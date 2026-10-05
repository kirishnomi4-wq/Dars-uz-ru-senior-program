# 9-Modul — MD v3 to'plami (05.10.2026)

Tartib: modul tayanchi → 12 dars. 12 darsning hammasi tashqi audit Filtridan keyingi holatda.

# 9-Modul — modul tayanchi (12 MD uchun bitta manba; har MD ning «A» bo'limi shundan oladi)

Qarorlar: `GATE_M_JAVOB.md` · nomlar: `00-NOMLAR.md` · dastur: `00-MANBA.md`. Bu fayldagi nom, raqam va so'zlar hamma darsda **aynan** shunday.
Bu yerda yo'q tafsilot kerak bo'lsa — MD oxiridagi «TAYANCHGA SAVOL» ro'yxatiga yoziladi, o'zicha o'ylab topilmaydi.

## 1. Misol-ip — «Maydon»

- **Mahsulot:** «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt.
- **Odamlar** (ismsiz, o'ylab topilgan qahramon yo'q): **o'yinchi** — maydonda o'ynaydigan o'smir; **maydon egasi** — vaqtlarni boshqaradi.
- **Muammo (bitta gap):** Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak.
- **Mentor misolidagi 5 intervyu natijasi** (3-dars shu raqamlar bilan ishlaydi; 2-darsda ular hali yo'q):
  5 kishidan 4 tasi — «oxirgi marta kelganimizda maydon band edi»; 3 tasi — «egasi telefonni ko'tarmadi»; 2 tasi — «jamoaga odam yetmadi»; 1 tasi — «pulni bo'lishish qiyin».
  Tanlangan bitta muammo (muammo gapi, GATE M 03-q0 — so'zma-so'z): **«O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»**
  Band qilishga dalil — telefon: o'yinchilar kelishdan oldin egasiga qo'ng'iroq qilib, vaqtni kelishib qo'ymoqchi bo'lgan (1-yozuv: «vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim»).
- **MVP chegarasi:** qilamiz — kun bo'yicha vaqt kataklari (bo'sh / band) · katakni band qilish (ism + telefon) · egasi uchun bandlar ro'yxati.
  Keyin — to'lov · jamoa yig'ish · eslatma. Qilmaymiz — baho · chat.
- **Sinov vazifasi (10-dars):** «Shanba kuni soat 18:00 ga maydon band qiling.»
- Metafora yo'q. Loyiha va mahsulot (1-dars, GATE M 01-q0 — so'zma-so'z): **Loyiha** — boshlanishi va oxiri bor qurish ishi. **Mahsulot** — odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat.
  Bog'lovchi gap: «Saytni qurish — loyiha. Tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi.» Mezon — maqsad (o'z ishi uchunmi), manba (havola kimdan kelgani) emas.

## 2. Atamalar (bir ma'no — bir so'z)

| So'z | Ma'nosi | Ishlatilmaydi |
|---|---|---|
| sayt | React ilova (`web/`) | frontend (faqat sxema tugunida «Sayt · React») |
| Backend | NestJS server (`backend/`) | server (prozada) |
| Database | PostgreSQL (Neon) | baza |
| vaqt katagi | bitta soatlik oraliq (masalan 18:00–19:00) | slot |
| band qilish · band | katakni egallash · egallangan katak | bron, buyurtma |
| o'yinchi · maydon egasi | ikki foydalanuvchi | mijoz, admin |
| intervyu | bitta odam bilan suhbat; **yozuv** — shablonga yozilgani | custdev (faqat kartochkada bir marta) |
| sinov | real odam ilovani ishlatadi, siz kuzatasiz | usability test (kartochkada bir marta), test qilish |
| hodisa | analitikaga yoziladigan bitta harakat | event (kod ichida — ha) |
| animatsiya | interfeysdagi ko'rinadigan harakat yoki holatning silliq o'zgarishi (5-darsda — holat o'zgarishini silliq ko'rsatadiganlari); **mikro-harakat** — foydalanuvchi harakatiga yoki holat o'zgarishiga berilgan kichik vizual javob (misol: bosilgan katak kichrayadi) — GATE M 05-q0 | mikrovzaimodeystviya |
| talab | o'quvchi agentga yozadigan vazifa matni (nima qilsin, nima buzilmasin) | spec, TZ |
| agent | Antigravity (6-Moduldan tanish) | — |
| Motion | animatsiya kutubxonasi; bir marta «Motion (oldingi nomi Framer Motion)» | — |

O'tilgan atamalar (mahsulot, MVP, User Story, pitch, deploy, token, `.env`) — oldingi darslardagidek; agent yozishdan oldin 5 va 6-Modul YAKUNIY larida grep qiladi.

## 3. Repo — `maydon` (yangi; «qur» bosqichida yoziladi)

- Papkalar: `web/` (React + Vite, `localhost:5173`) · `backend/` (NestJS, `localhost:3000`) · Database — Neon, `.env` da `DATABASE_URL`.
- Jadval `bandlar`: `id` · `kun` · `soat` · `ism` · `telefon` · `yaratilgan`.
- Yo'llar: `GET /vaqtlar?kun=` (kataklar: soat + holat) · `POST /bandlar` (`kun`, `soat`, `ism`, `telefon`) · `POST /kirish` (ega paroli → token) · `GET /bandlar` (faqat token bilan).
- Animatsiyalanadigan uch element (5-dars): 1) vaqt katagi bosilganda kichrayib qaytadi (`transform` + `transition`); 2) katak band bo'lganda rangi silliq o'zgaradi (`transition`);
  3) «Band qilindi» belgisi paydo bo'ladi (Motion).
- Hodisalar (Umami): sahifa ochilishi — avtomatik; `vaqt-tanladi` (6-dars) · `band-qildi` (9-darsda qo'shiladi). Zanjir: ochdi → vaqtni tanladi → band qildi.

| Teg | Dars | Repo holati (dars oxirida) |
|---|---|---|
| `dars-04-done` | 4 · arxitektura | skelet: `web/` + `backend/` + Database ulangan; saytda statik vaqt kataklari (namuna ma'lumot) |
| `dars-05-done` | 5 · animatsiya | statik kataklarda uch element jonlangan |
| `dars-06-done` | 6 · analitika | Umami ulangan; `vaqt-tanladi` hodisasi yoziladi |
| `dars-07-done` | 7 · birinchi ekran | kataklar Backend'dan keladi (`GET /vaqtlar`), kun almashtiriladi |
| `dars-08-done` | 8 · dizayn | bitta tanlangan namuna qo'llangan; ro'yxat va sahifa o'tishi animatsiyasi |
| `dars-09-done` | 9 · MVP tayyor | band qilish ishlaydi (`POST /bandlar`), ega sahifasi parol bilan, `band-qildi` hodisasi, deploy |
| `dars-11-done` | 11 · tuzatish | sinovda topilgan eng muhim bitta muammo tuzatilgan |

Sinovda topiladigan muammolar (10-dars kuzatuvi → 11-dars): 1) o'yinchi «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi (**eng muhim, tuzatiladi**);
2) band bo'lgandan keyin nima bo'lganini tushunmadi; 3) kunni almashtirishni sezmadi.

## 4. Darslar — qisqa topshiriq

| № | Fayl (MD) | Tip · qolip | Darsning bitta natijasi | Namuna MD (`feedback/F-0929-QA-6modul/`) |
|---|---|---|---|---|
| 1 | `01-PmProductProblem-v3.md` | PM | 3 ishlaydigan mahsulot tahlili + atrofdan 10 muammo ro'yxati | `14-PmLesson25-v3.md` |
| 2 | `02-PmFiveInterviews-v3.md` | PM | intervyu shabloni + sinfdosh bilan 1 mashq yozuvi; uyga — 5 real intervyu | `14-PmLesson25-v3.md` |
| 3 | `03-PmInterviewMvp-v3.md` | PM | 5 yozuvdan 1 muammo + qilamiz / keyin / qilmaymiz ro'yxati | `12-PmLesson24-v3.md` |
| 4 | `04-MvpArchitecture-v3.md` | TEX | «Maydon» sxemasi + skelet ishga tushgan | `01-SystemArchitecture-v3.md` |
| 5 | `05-Animation-v3.md` | TEX (cho'qqi) | uch element qo'lda jonlantirilgan | `01-SystemArchitecture-v3.md` |
| 6 | `06-PmAnalyticsDayOne-v3.md` | PM qismi + amaliyot bloki | nimani o'lchash tanlangan + Umami ulangan | `14-PmLesson25-v3.md` + `08-PipelineProject-v3.md` |
| 7 | `07-MvpFirstScreen-v3.md` | loyiha kuni: 8 ekran + 3 blok | talab yozilgan, birinchi ekran ishlaydi | `08-PipelineProject-v3.md` |
| 8 | `08-PmDesignMotion-v3.md` | PM qismi + amaliyot bloki | 1 namuna tanlangan + animatsiyalar agent orqali | `14-PmLesson25-v3.md` + `08-PipelineProject-v3.md` |
| 9 | `09-MvpComplete-v3.md` | loyiha kuni: 8 + 3 | ishlaydigan MVP, deploy | `13-FullSystemProject-v3.md` |
| 10 | `10-PmUsabilityTest-v3.md` | PM | sinov rejasi + sinfdosh bilan sinov, kuzatuv yozuvi; uyga — real odam | `14-PmLesson25-v3.md` |
| 11 | `11-MvpIteration-v3.md` | loyiha kuni: 8 + 3 | eng muhim muammo tuzatilgan | `08-PipelineProject-v3.md` |
| 12 | `12-PmUserStoryPitch-v3.md` | PM | muammo → yechim → foydalanuvchi hikoyasi bilan pitch, repetitsiya | `14-PmLesson25-v3.md` |

Hamma darsda: real odam bilan ish — darsda sinfdosh bilan juftlikda, real odam uyga (qaror 7); amaliyot blokida Mentor misoli repo'da, blok oxirida «shu promptni o'z g'oyangizga yozing» (qaror 8);
oldingi va keyingi dars nomi — `00-NOMLAR.md` dan (1-darsdan oldingi dars: 8-Modul «Raqamingiz nimani isbotlaydi?»; 12-darsdan keyin — «Zaxira dars»).

## 5. GATE M kelishuvlari (05.10.2026, tasdiqlangan — hamma MD shu holatda)

- **K1 kataklar:** 6 ta, boshlanishi 16:00 … 21:00 (oxirgisi 21:00–22:00). Repo namuna bandlari: Shanba 17:00 va 20:00; 18:00 bo'sh (10-dars sinov vazifasi). Yakshanba band 18:00, 19:00 (8-dars).
- **K2 `kun`:** sana (`2026-10-10`); ekranda kun nomi («Shanba»). Namunada bugun — Dushanba `2026-10-05`.
- **K3 kun almashtirgichi:** strelkali «‹ Bugun ›» (4-darsda statik «‹ Shanba ›», 7-darsda ishlaydi). 10-dars «kunni sezmadi» muammosi shu kichik strelkalar haqida.
- **K4 intervyu:** 5 yozuv — 5 o'yinchi. Taqsimot: 1, 2, 4 — band + telefon; 3 — band; 4 — yana jamoa; 5 — jamoa + pul. 2-darsdagi maydon egasi suhbati — savol namunasi, beshlikka kirmaydi.
- **K5 sinov:** 10-dars yozuvi — manba: bitta o'yinchi, uch to'xtash (kunni topish 0:00–0:25 · tugma 0:41–1:43 · «Band qilindi» dan keyin 18 s). Tuzatish (11, 12): «Band qilish» tugmasi ekran pastiga qotiriladi.
- **K6 analitika misoli (6-dars):** ochdi 12 · vaqtni tanladi 9 · band qildi 2.
- **K7 nomlar:** `EGA_PAROLI`, `JWT_SECRET`, `WEB_ORIGIN` (`backend/.env`, Render) · `VITE_UMAMI_ID`, `VITE_API_URL` (`web/.env`, Netlify) · ega sahifasi `/ega` · to'qnashuv `409 · Bu vaqt band`.
  Test bandlari: 9-darsda 19:00 (A1) va 21:00 (A3) — 18:00 10-dars sinovi uchun bo'sh qoladi.
- **K8 so'zlar:** «sinov» — faqat real odam bilan (10–12); o'z ishini ko'rish — «tekshirish»; «maydon» — faqat futbol maydoni.
- **K9 keyslar** (takrorlanmaydi): 1 Dropbox · 2 «The Mom Test» (ramka «Kitobdan») · 3 Instagram · 8 Tweetie · 10 «300 million dollarlik tugma» · 12 Canva. 4, 5, 6, 7, 9, 11 — keyssiz.
- **K10 repo:** `github.com/Azizbekcrypto/maydon`. 4-darsda o'quvchi Fork → `git clone https://github.com/{sizning login}/maydon.git`.
  Upstream `main` — bo'sh boshlang'ich holat (o'quvchi noldan quradi); yechim commitlari alohida tarmoqda, teglar `dars-NN-start` va `dars-NN-done` ularda («qur» da yoziladi).
  «Ortda qoldingizmi»: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-NN-start` (1-blok) yoki `dars-NN-done` (keyingi bloklar) — 8-Modul naqshi.
- **K11 App.jsx osti yozuvi:** 3-dars «sanoq, …», 4-dars «… — chizma».

**Savollar javobi:** M-q1 «O'z g'oyangiz» — blokning alohida 5-qadami · M-q2 «prompt» — agentga xabar; «talab» (7-darsda tug'iladi) — promptning uch qatori: qayerda · nima qilsin · nima buzilmasin ·
M-q3 «zanjir» o'rniga «uch qadam» · M-q4 «chizma» va «stack» · M-q5 dars oldingi dars natijasini o'qiydi, yo'q bo'lsa o'quvchi o'zi yozadi (kalit nomlari «qur» da bitta ro'yxat) ·
M-q6 PM darslarida kod ekrani qoladi · M-q7 deploy: Backend — Render, sayt — Netlify, ikkalasi GitHub'dan (push → o'zi yangilanadi) ·
M-q8 Umami akkauntini o'quvchi o'zi ochadi, ocholmasa — Mentor akkauntiga sayt · M-q9 PM uyga vazifasi — yakun kartasida, alohida fayl yo'q ·
02-q0 keys qoladi, ramka «Kitobdan» · 06-q0 keyssiz · 12-q0 pitch 1 daqiqa, juftlikda 2.

## 6. Darslar orasida saqlanadigan natija (GATE M M-q5; kalitlar — dars MD lari va auditdan, 05.10.2026)

Qoida: dars oldingi dars natijasini o'qiydi; yo'q bo'lsa — o'quvchi o'zi yozadi (erkin qator). Kalit nomi — `pm-m7dN-<nima>`.

| Kalit | Yozadi | O'qiydi | Tarkib |
|---|---|---|---|
| `pm-m7d1-ilovalar` | 1-dars s8 | — | `[{ nom, yechim, muammo, kim }] × 3` |
| `pm-m7d1-muammolar` | 1-dars s10 | 2-dars s8 (ro'yxat) | `{ muammolar: [{ matn, manba }] × 10 }` |
| `pm-m7d1-tanlangan` | 1-dars s13 | 2-dars s8 (tanlangan holda) | `{ matn, kim }` |
| `pm-m7d2-shablon` | 2-dars s8 | 2-dars s9, 3-dars | `{ muammo, kimdan, savol1 }` |
| `pm-m7d2-mashq` | 2-dars s9 | 3-dars | `{ kim, voqea, qildi, qiyin }` |
| `pm-m7d3-muammo` · `pm-m7d3-mvp` | 3-dars s8 · s10 | 12-dars (muammo gapi) | 3-dars MD dagi tarkib |

10 → 11-dars (eng muhim to'xtash) va 12-dars kalitlari — o'z darslari navbatida shu jadvalga qo'shiladi.

---

# 9-Modul · 1-dars (PM) «Loyihangiz kimga kerak?» — MD v3

Fayl: `src/7-Modull/PmProductProblemLesson.jsx` (kalit `m7-01`) · 17 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi. Dars yangi — hamma ekran noldan.
Tashqi audit (ChatGPT) Filtri: `01-FILTR.md` — 05.10.2026 qo'llandi (ta'rif — GATE M 01-q0 A, kod mashqi — 01-q1 A).
Testlar va to'g'ri javob o'rni: s3 = 3-variant (`correctIdx 2`) · s5 = 2 (`1`) · s7 = 4 (`3`) · s12 = 1 (`0`) — `INLINE_KEYS` shu bilan; arena 3/3/3/3.
Dars turi: PM 2-tur (sof PM, PM-005) — artefakt yozma: uch mahsulot kartasi + o'nta muammo ro'yxati. USTAXONA — s8 va s10 (bittalab yozish).
Oldingi dars: 8-Modul «Raqamingiz nimani isbotlaydi?» (`m6-14`, 1-bosqich yakuni) · keyingi: «Besh odamdan nimani bilib olasiz?» (`m7-02`).

---

## A. Darsning tayanchi

1. **Dars nima beradi.** 2-bosqichning birinchi darsi: o'quvchi birinchi marta o'zi uchun emas, boshqa odam uchun quradigan narsani qidiradi.
   Natija (dastur): uch ishlaydigan mahsulot tahlili + atrofdan o'nta muammo ro'yxati.
2. **Ikki atama — misoldan KEYIN, bir marta (PM-030, T-011).** 2-ekranda o'quvchi «Sizsiz bir kun» tajribasini ko'radi, shundan keyin ikki tomon nom oladi.
   Ta'rif dars bo'yi so'zma-so'z shu (T-042) — xulosa, kartochka, recap, yakun:
   - **Loyiha** — boshlanishi va oxiri bor qurish ishi. Qisqa yorliq: «qurish ishi».
   - **Mahsulot** — odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat. Qisqa yorliq: «odamlar ishlatadi».
   - Bog'lovchi gap: «Saytni qurish — loyiha. Tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi.»
     Ikkalasi qarama-qarshi emas: loyiha mahsulot yaratishi mumkin (GATE M 01-q0; PMI ta'rifiga mos).
   - Tekshiruv-savoli (bir xil so'zlar bilan): «Odamlar uni o'z ishi uchun ishlatyaptimi?» Mezon — maqsad, manba emas: havola qayerdan kelgani muhim emas.
3. **Tushuncha fe'li bitta: «ishlatadi»** (T-014). «Ochadi» — faqat to'g'ri ma'noda (sayt, havola, fayl ochiladi: hook, Dropbox). UI uchun «oching» yozilmaydi («bosing», «ko'ring»),
   «ochilmagan» (chiqmagan) ma'nosi ham yo'q — «ochish» bu darsda bitta ma'noda. Platforma tugmasi «Kompilyatorni ochish» — tegilmaydi; Mentor va izohda «kompilyator» ta'riflanmaydi — «kod oynasi» (MATN_ETALONI lug'ati).
4. **Takror, yangi atama emas (T-052):**
   - **auditoriya-karta** — «Kim mening foydalanuvchim?» darsidan (`m1-02`): KIM · MUAMMO · YECHIM. Bu darsda u ishlaydigan mahsulotni tahlil qiladi.
     Slot nomlari faqat karta ekranda ko'rinib turgan joyda ishlatiladi (§50); ichki ishora («karta ichidagi KIM» kabi) yo'q.
   - **uch belgi** — «Muammoni qanday topamiz» darsidan (`m2-16`): qayta-qayta bo'ladi · odam o'zicha yo'l topgan · odam voz kechgan. So'zma-so'z shu.
   - **yechim** — «Muammodan yechimga» darsidan (`m2-02`): sayt beradigan bitta aniq foyda-ish. «Bu yechim» xabari m2-16 dagidek.
   - Muammo yozish qolipi — m2-16 dagidek: «Kim, qayerda, nimadan qiynaldi?»; xabarlar ham o'sha so'zlar bilan.
5. **So'zlar (bir ma'no — bir so'z):** loyiha · mahsulot · ishlatadi · auditoriya-karta · KIM / MUAMMO / YECHIM · muammo · uch belgi · ro'yxat · sinfdosh (juftlikda — sherik) ·
   o'yinchi · maydon egasi (tayanch). **«maydon» — faqat futbol maydoni** (T-015): forma joylari «qator» deyiladi, «maydon» emas. «skan», «intervyu» va inglizcha tadqiqot atamasi — o'quvchi matnida yo'q
   (muammo yig'ish · suhbat; «intervyu» 2-darsda tug'iladi).
6. **Toza yuza (185):** tugma, variant, karta, recap'da emoji yo'q; o'yin qatlami (arena, nishon, podium) mustasno. Kafolat so'zlari yo'q.
7. **Real kompaniya va raqam — manba bilan.** Ilovalar (Yandex Go, Payme, Google Translate, Uzum Market, Google Maps) faqat o'zi ko'rsatadigan ish bilan
   tasvirlanadi — son yo'q. Dropbox voqeasi va 75 000 — manba 6-ekranda (izoh qatori, o'quvchi ko'rmaydi).

## Darsning ipi va bitta vizual

- **Ip:** «Kimga kerak?» savoli. Hook — portfolio saytingizni kim ochgan (nima uchun — ishingizni ko'rish uchun) → loyiha va mahsulot → uch ishlaydigan mahsulot → Dropbox: boshqalarga ham
  kerakligi qanday bilindi → Mentorning muammo ro'yxati: **«Maydon» muammosi shu yerda birinchi bor topiladi** (o'nta muammodan biri, modul ipi shu yerdan) →
  o'quvchi sinfdoshi bilan o'z ro'yxatini yig'adi → bittasini tanlab, «yana kimlarda bor?» deb KIM qatorini yozadi.
- **Maydon (tayanch, aynan):** KIM — o'yinchilar (maydonda o'ynaydigan o'smirlar) · MUAMMO — «Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak.» ·
  YECHIM — bo'sh («hali yo'q»). Intervyu natijalari (5 kishidan 4 tasi…) bu darsda YO'Q — ular 3-darsda.
- **Bitta vizual — auditoriya-karta (`AudKarta`, manba `KARTALAR`, 180):** oq karta, tepada nom va kichik yorliq («loyiha» / «mahsulot» — atama tug'ilgandan keyin),
  ichida uch qator: **KIM** (chizilgan bosh-siluetlar — CSS doira + yarim doira, emoji emas — va matn) · **MUAMMO** (bitta gap) · **YECHIM** (bitta gap yoki uzuq chiziq «hali yo'q»).
  - Qator holatlari: bo'sh (kulrang uzuq chiziq — skelet) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent chegara) → xato (`err` fon) → karta to'liq (chap chetda yashil chiziq).
  - Uch ko'rinish bitta komponentdan: **to'liq** (3 qator) · **ixcham** (nom + KIM qatori, s2) · **qator** (ro'yxatdagi bitta muammo: joy yorlig'i + gap, s1/s9/s10/s13).
  - KIM qatorida siluet yonida kichik yorliq: «ko'rsatish uchun» (kulrang) yoki «o'z ishi uchun» (yashil) — s0 va s2 shu farqdan ishlaydi (mezon — maqsad, manba emas).
  - Ishlatiladi: 0 (maket ostida) · 1 · 2 · 4 · 5 (kichik) · 6 (Dropbox kartasi) · 8 · 9 · 10 · 13. Dropbox (6) — o'z sahnasi `DropboxSahna` + shu karta.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Portfolio saytingizni oxirgi marta kim ochgan?** (46)
- Mentor: Saytingiz hozir ham internetda turibdi. Eslab ko'ring va bittasini tanlang.
- Maket (chap): brauzer oynasi — nuqtalar, manzil qatori `ismingiz.netlify.app`, sahifada portfolio skeleti (ism, yo'nalish, uch karta-skelet).
  Ostida ixcham auditoriya-karta: KIM qatorida uchta bo'sh siluet-uya.
- Variantlar (radio, o'ng; bir uzunlikda):
  - O'zim — ishlayaptimi deb tekshirdim (35)
  - Mentor — vazifamni ko'rib chiqish uchun (39)
  - Do'stim — havolasini o'zim yuborgandim (38)
- Javob (uchalasida bir xil, maqtovsiz): Uchalasida sayt ishingizni ko'rish uchun ochilgan. Yandex Go'ni esa odam o'z ishi uchun ochadi — uyga yetib olish uchun. (120)
- **Harakat → Vizual o'zgarish:** variantni tanlash → KIM qatoriga tanlangan odam siluet bo'lib kiradi, yonida kulrang yorliq «ko'rsatish uchun»;
  bir lahzadan keyin yonida ikkinchi ixcham karta «Yandex Go» kirib keladi — yorlig'i yashil «o'z ishi uchun». Jonli darsda ovozlar chizig'i.
- O'qituvchi eslatmasi: Javobni muhokama qilmang — keyingi ekranlar o'zi ochadi. Saytini yo'qotgan o'quvchi ham tanlaydi: savol voqea haqida, sayt haqida emas.

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun atrofingizdan o'nta muammo yig'asiz.** (42)
- Mentor: Bu modulda quradigan narsangiz shunday ro'yxatdagi bitta muammodan boshlanadi.
- Chap: «Dars oxirida — atrofingizdan muammolar ro'yxati» + vizual: o'nta qator-karta skeleti (matnsiz kulrang chiziqlar) 0.4 s oraliqda yashil ✓ oladi;
  oxirida bittasi kattalashib to'liq auditoriya-karta bo'ladi: KIM va MUAMMO — skelet chiziq, YECHIM — uzuq chiziq «hali yo'q».
- O'ng (01 · matn · teg):
  - 01 · Mahsulot va loyiha farqini ajratasiz · `farq`
  - 02 · Uchta ishlaydigan mahsulotni tahlil qilasiz · `tahlil`
  - 03 · Dropbox boshqalarga kerakligi qanday bilinganini ko'rasiz · `voqea`
  - 04 · Sinfdoshingiz bilan atrofdan muammo yig'asiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Skelet matnsiz: 9-ekran kashfiyoti (maydon) va 4-ekran javoblari ochilmaydi (P-015).

## 2 · Qurish tugasa  ← QTushuncha
- Eyebrow: Tushuncha · loyiha va mahsulot
- Sarlavha: **Qurish tugasa, mahsulot tayyormi?** (33)
- Mentor: To'rttasining qurilishi tugagan. «Sizsiz bir kun»ni bosing: hech kimga ko'rsatmasangiz, ularni kim o'z ishi uchun ishlatadi?
- Bashorat (ballsiz, 181): **To'rttadan nechtasini odamlar o'z ishi uchun ishlatadi?** · 1 · 2 · 3 — tanlov saqlanadi.
- Vizual: to'rtta ixcham auditoriya-karta (2 × 2, bir balandlikda), har birida nom + KIM qatori:
  - **Portfolio saytingiz** — siz · mentor (yorliq «ko'rsatish uchun») · do'stingiz («ko'rsatish uchun»)
  - **Telegram botingiz** — siz · do'stingiz («ko'rsatish uchun»)
  - **Yandex Go** — yo'lovchilar («o'z ishi uchun»)
  - **Payme** — hisobi tugaganlar («o'z ishi uchun»)
- **Harakat → Vizual o'zgarish:** «Sizsiz bir kun» tugmasi → «siz» siluetlari xiralashib chiqib ketadi, «ko'rsatish uchun» yorliqli siluetlar ham ular bilan birga so'nadi;
  portfolio va bot kartalarida KIM qatori bo'shab qoladi — kulrang yozuv «bugun hech kim ishlatmadi»; Yandex Go va Payme kartalarida odamlar qoladi, chap chetida yashil chiziq.
  Keyin juftliklar ustida nom paydo bo'ladi (atama — misoldan keyin, bir marta): chap juftlik ustida **Loyiha tugadi** — «qurish ishi», o'ng juftlik ustida **Mahsulot** — «odamlar ishlatadi».
  Ikki nom orasida bitta ingichka strelka: Yandex Go va Payme ham bir vaqtlar loyiha bo'lgan (yorliq: «avval — qurish ishi»).
  Natija qatori (`QTaxmin`): «Taxminingiz: 3 · haqiqatda: 2» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Saytni qurish — loyiha. Tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi. (98)
- Tugma (pastki): Sizsiz bir kun → Davom etish · `tugadi`: tugma va bashorat paneli yopiladi, to'rt karta va ikki nom butun enga (199).
- O'qituvchi eslatmasi: Loyihani «yomon» demang — har mahsulot loyihadan boshlanadi. «Do'stim ham ochgan» desa, so'rang: ko'rish uchunmi yoki o'z ishi uchunmi?

## 3 · 1-savol  ← QTest (✔ 3-variant, `correctIdx 2`)
- Eyebrow: Tekshiruv · loyiha va mahsulot
- Savol: **Sinfingizda to'rtta bot bor. Qaysi biri mahsulot?** (7 so'z)
  - Egasi uni bir marta qurib, keyin ochmay qo'ygan (47)
  - Do'stlari egasining iltimosi bilan bir marta ochgan (51)
  - ✔ Sinfdoshlar uy vazifasini bilish uchun ishlatadi (48)
  - Egasi Demo Day'da ota-onalarga ishlatib ko'rsatadi (50)
- To'g'ri izohi: Sinfdoshlar botni o'z muammosi uchun ishlatadi.
- Xato izohlari: 1 — Bot qurildi, lekin uni hech kim ishlatmayapti. (46) · 2 — Do'stlar ko'rib qo'ydi — o'z ishi uchun emas. (45) ·
  4 — Ota-onalar botni ko'rdi, lekin o'zi ishlatmaydi. (48) · (umumiy) Kim ishlatadi va nima uchun — shuni qarang. (43)
- Tanlagach: savol ustidagi kichik ixcham karta KIM qatoriga tanlangan variantning odami tushadi — yorlig'i «o'z ishi uchun» (to'g'ri, yashil) yoki «ko'rsatish uchun» (xato, `err` fon).

## 4 · Uch mahsulot  ← QTushuncha (markaziy; «yechimdan muammoga»)
- Eyebrow: Tajriba · uch ishlaydigan mahsulot
- Sarlavha: **Bu mahsulot kimning qaysi muammosini yechadi?** (45)
- Mentor: KIM, MUAMMO, YECHIM — «Kim mening foydalanuvchim?» darsidagi auditoriya-karta. Ilovada odatda avval YECHIM ko'rinadi — kimga va qaysi muammoga kerakligini siz topasiz.
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8): 1 Yandex Go · 2 Payme · 3 Google Translate (joriy — accent, o'tgani ✓). O'ng — to'liq auditoriya-karta: YECHIM yozilgan, KIM va MUAMMO bo'sh.
- Har qadamda karta ostida uchta tanlov (bir uzunlikda, aralash tartibda; to'g'ri — ✔):
  1. **Yandex Go** · YECHIM: Telefondan mashina chaqiradi, narxni oldindan ko'rsatadi.
     - ✔ Ko'chada taksi kutardi, narxni oldindan bilmasdi
     - Telefonida chiroyli xarita bo'lishini xohlardi
     - Shaharda taksi haydovchilari juda ko'p edi
     - KIM (to'g'ri tanlovdan keyin yoziladi): kechqurun uyga qaytayotgan yo'lovchilar
  2. **Payme** · YECHIM: Telefon hisobini uydan turib to'ldiradi.
     - ✔ Hisobni to'ldirish uchun do'konga borardi
     - Ilovada ko'p tugma bo'lishini xohlardi
     - Telefonida internet bor edi
     - KIM: telefon hisobi tugab qolganlar
  3. **Google Translate** · YECHIM: Matnni bir bosishda boshqa tilga o'giradi.
     - ✔ Har so'zni lug'atdan qidirib, uzoq o'tirardi
     - Ingliz tili darsini juda yaxshi ko'rardi
     - Uyida inglizcha kitoblar ko'p edi
     - KIM: inglizcha matnni tushunmagan o'quvchilar
- **Harakat → Vizual o'zgarish:** MUAMMO tanlovini bosish → to'g'ri bo'lsa MUAMMO qatoriga gap yoziladi, KIM qatorida siluetlar va matn paydo bo'ladi (yorliq «o'z ishi uchun»),
  karta chap chetida yashil chiziq, qadam ✓ va keyingi mahsulot kartasi kiradi. Xato bo'lsa tanlov silkinib qaytadi, MUAMMO qatori bir lahza `err` fon, bitta `QXato`:
  Bu gapda odam nimadan qiynalgani ko'rinmaydi. (45) — ikkala tuzoq bitta xato-sinf (S-040): xohish yoki rost fakt, qiynalish yo'q.
  42 soniya harakatsizlikda bitta ipucha (javobni aytmaydi): YECHIMga qarang: ilova bo'lmasa, odam nimadan qiynalardi?
- 3/3 dan keyin uch karta yonma-yon, ixcham to'liq ko'rinishda.
- Xulosa: Bu uch mahsulot aniq odamlarning aniq muammosini yengillashtiradi. (66)
- Tugma (pastki): Muammoni toping (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, uch karta butun enga.
- Nishon: Product Spotter! (uchalasida birinchi urinishda).
- O'qituvchi eslatmasi: Har mahsulotda sinfdan bitta odamni so'rang: «Siz ham shunday qiynalganmisiz?» Javob «ha» bo'lsa — KIM qatori uning o'zi.

## 5 · 2-savol  ← QTest (✔ 2-variant, `correctIdx 1`; qo'llash — yangi mahsulot)
- Eyebrow: Tekshiruv · MUAMMO qatori
- Savol ustida kichik auditoriya-karta: **Uzum Market** · KIM — xaridorlar · MUAMMO — bo'sh chiziq · YECHIM — Narsani telefonda topadi va yetkazib beradi.
- Savol: **Uzum Market uchun MUAMMO qatoriga nima yoziladi?** (7 so'z)
  - Ilovada chegirma ko'p bo'lishini xohlardi (41)
  - ✔ Kerakli narsani do'konma-do'kon qidirardi (41)
  - Shahar do'konlarida narsa juda ko'p turardi (43)
  - Telefonda buyurtma qilishni yaxshi ko'rardi (43)
- To'g'ri izohi: Odam nimadan qiynalgani ko'rinadi — ilova aynan shuni yengillashtiradi.
- Xato izohlari: 1 — Bu xohish — odam nimadan qiynalgani ko'rinmaydi. (48) · 3 — Bu rost gap, lekin unda hech kim qiynalmagan. (45) ·
  4 — Bu yechimni takrorlaydi — qiyinchilik yo'q. (43) · (umumiy) Ilovasiz odam nimadan qiynalardi — shuni toping. (48)
- Tanlagach: kichik kartaning MUAMMO qatoriga tanlangan gap yoziladi (to'g'ri — yashil, xato — `err` fon).

## 6 · Dropbox  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Dropbox boshqalarga ham kerakligi qanday bilindi?** (49)
- Mentor: Dropbox — fayllarni internetda saqlab, istalgan kompyuterdan ochadigan xizmat. Bosqichlarni birma-bir ko'ring va kartaning KIM qatoriga qarang.
- Nuqtalar (5) · yorliq **Dropbox · N/5** (bashorat kartasida ham) · maket `DropboxSahna`: chapda noutbuk (ekran holati), o'ngda Dropbox auditoriya-kartasi. Logotip yo'q.
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/5 **Avtobusda, fleshkasiz** — Drew Houston Bostondan Nyu-Yorkka avtobusda ketayotgan edi. Yo'lda ishlamoqchi edi, lekin fayllari bor fleshka uyda, stol ustida qolgan.
    · maket: noutbuk ekranida «fayl topilmadi», USB uyasi bo'sh; kartaning MUAMMO qatori yoziladi: Fayllar bor fleshka uyda qolgan.
  - 2/5 **O'z muammosi uchun dastur** — Shu muammoga qayta duch kelmaslik uchun u fayllarni internet orqali istalgan kompyuterda ochadigan dastur yoza boshladi.
    · maket: noutbuk va ikkinchi kompyuter orasida fayl chizig'i yuradi; YECHIM qatori yoziladi; KIM qatorida bitta siluet «o'zi».
  - 3/5 bashorat — Dastur hali hamma uchun tayyor emas edi. U qanday ishlashini ko'rsatadigan video chiqdi — xohlaganlar kutish ro'yxatiga yozilardi.
    **Bir kunda nechta odam yozildi?** · Yuzlab odam · Minglab odam · ✔ O'n minglab odam (zinapoya, S-015)
  - 4/5 **Bir kunda 75 000 kishi** — Video chiqqach, bir kun ichida 75 000 kishi kutish ro'yxatiga yozildi. Ular dasturni o'z fayllari uchun kutayotgan edi.
    · maket: KIM qatoriga siluetlar oqib kiradi, burchakda hisoblagich 0 → 75 000.
  - 5/5 **Boshqalarga ham kerak** — Dastur bitta odamning muammosidan boshlangan edi. Kutish ro'yxati shu muammo o'n minglab odamda borligini ko'rsatdi.
    · maket: KIM qatori siluetlar bilan yozilib chiqadi, chap chetida yashil chiziq; karta yorlig'i almashmaydi (75 000 — kerakligining belgisi, «mahsulot bo'ldi» chegarasi emas — audit 3).
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: o'n minglab» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `DropboxSahna` holati o'zgaradi: fleshkasiz noutbuk (MUAMMO yoziladi) → fayl chizig'i
  (YECHIM, KIM «o'zi») → hisoblagich va oqib kirgan siluetlar → KIM qatori yozilib chiqadi, yashil chiziq. Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (5/5 dan keyin, hisoblagichsiz): Dropbox bitta odamning muammosidan boshlangan. Kutish ro'yxati u boshqalarga ham kerakligini ko'rsatdi. (103)
- Tugma (pastki): Keyingi bosqich (N/5) → Davom etish
- O'qituvchi eslatmasi: Dropbox nomini bilmasliklari mumkin — izohning o'zi yetadi. Raqam manbadan; boshqa raqam qo'shmang.
- Manba (o'quvchi ko'rmaydi, fakt tekshiruvi 05.10.2026):
  - Avtobus, Boston → Nyu-York, fleshka uyda qolgan; dastur 2007-yilda yozila boshlagan — MIT News, 2012: https://news.mit.edu/2012/dropbox-ceo-alumnus-drew-houston-commencement-speaker-1113
  - «bu muammoga boshqa duch kelmaslik» (Houston so'zi) — Fortune, 14.06.2017: https://fortune.com/2017/06/14/founder-dropbox-got-idea-chinatown-bus
  - Demo video, 24 soat ichida 75 000 kishi kutish ro'yxatiga yozildi — TechCrunch, 01.11.2011, «How Dropbox Got Its First 10 Million Users»: https://techcrunch.com/?p=442136
  - «Ular dasturni o'z fayllari uchun kutayotgan edi» — bizning xulosamiz (ro'yxatga yozilish = dasturni o'zi uchun so'rash), manbada so'zma-so'z yo'q.

## 7 · 3-savol  ← QTest (✔ 4-variant, `correctIdx 3`; Dropbox qoidasi o'quvchi olamiga)
- Eyebrow: Tekshiruv · Dropbox'dagidek
- Savol: **O'zingiz uchun qurgan jadval botingiz boshqalarga ham kerakligini qachon bilasiz?** (10 so'z)
  - Botga yana o'nta yangi tugma qo'shib qo'yganda (46)
  - Bot serverga chiqib, kechasi ham ishlaganda (43)
  - Botni Demo Day'da ota-onalarga ko'rsatganda (43)
  - ✔ Sinfdoshlar uni o'z jadvali uchun ishlatganda (45)
- To'g'ri izohi: Boshqalar botni o'z ishi uchun ishlata boshladi — demak, u ularga ham kerak.
- Xato izohlari: 1 — Tugma ko'paydi, lekin botni hali faqat siz ishlatasiz. (54) · 2 — Bot ishlayapti, lekin uni hali hech kim ishlatmadi. (51) ·
  3 — Ota-onalar botni siz ko'rsatganingiz uchun ko'rdi. (50) · (umumiy) Dropbox kerakligi qanday bilinganini eslang. (44)

## 8 · Mustaqil ish  ← QMustaqil (USTAXONA 1 — uch mahsulot tahlili)
- Eyebrow: Mustaqil ish
- Sarlavha: **Telefoningizdagi ilovalar kimga kerak?** (38)
- Mentor: Har kuni ishlatadigan ilovalaringizni oling: avval ilova nima qilishini, keyin u kimning qaysi muammosini yechishini yozing.
- Bitta ustun: tepada 1/2/3 doiralar (joriy — accent) → to'liq auditoriya-karta forma bo'lib (4 qator: nom · YECHIM · MUAMMO · KIM; joriy qator accent) → Yordam · «Saqlash» o'ngda (187).
- Qator ipuchalari: nom — Ilova nomi · YECHIM — Ilova nima qiladi? · MUAMMO — Ilovasiz odam nimadan qiynalardi? · KIM — Bu qanday odamlar?
- Tekshiruv (`QXato`, ≤60; yumshoq — ikkinchi «Saqlash» bilan o'tadi, m2-16 dagidek):
  - qator bo'sh: To'rt qatorni ham to'ldiring. (29)
  - MUAMMO yechim so'zlarini takrorlasa (umumiy so'zlar yarmidan ko'p): MUAMMO yechimni takrorladi — odam nimadan qiynaldi? (51)
  - MUAMMO'da qiynalish yo'q («xohlardi», «yoqardi», «yaxshi ko'rardi»): Bu xohish — odam nimadan qiynalgani ko'rinmaydi. (48)
  - KIM — «hamma», «odamlar», «hamma odamlar»: KIM aniqroq bo'lsin: qanday odamlar? (36)
  - ikki kartada bir xil nom: Bu ilova ro'yxatda bor — boshqasini oling. (42)
  - Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam: Ilovani bir hafta ishlatmasangiz, nima qiyin bo'lardi? O'sha qiyinchilik MUAMMO qatoriga yoziladi.
- **Harakat → Vizual o'zgarish:** qatorni yozib «Saqlash» → kartaga qator kiradi, joriy belgi keyingi qatorga o'tadi; to'rt qator to'lsa karta chap chetida yashil chiziq, doira ✓,
  keyingi doira joriy. Tekshiruvdan o'tmagan qator `err` fonda, ostida bitta `QXato`. 3/3 da forma yopiladi, uch karta yonma-yon butun enga (199), har kartada ✎ Tahrirlash.
- Xulosa: Uch mahsulot kartangiz tayyor: har birida yechim kimningdir muammosini yengillashtiradi. (88)
- Tugma (pastki): Uch kartani yozing (N/3) → Davom etish
- Mentor rejimi: forma o'rniga 4-ekrandagi Yandex Go kartasi (namuna); o'quvchilar o'z telefonida yozadi. Mentor statistikasi: «Uch kartani yozganlar».
- O'qituvchi eslatmasi: Eng ko'p xato — MUAMMO qatoriga yechimni qayta yozish («video ko'rsatadi»). «Ilova bo'lmasa, nima qilardingiz?» deb so'rang.

## 9 · Mentorning ro'yxati  ← QTushuncha
- Eyebrow: Tushuncha · muammo yig'ish
- Sarlavha: **Qaysi yozuv Mentor ro'yxatiga tushadi?** (38)
- Mentor: Kecha maktab, yo'l va mahallada ko'rganlarimni yozib chiqdim. Har yozuvni ro'yxatga qo'shing yoki chiqarib tashlang.
- Izoh (bitta qator, `QIzoh`): «Muammoni qanday topamiz» darsidagi uch belgi: qayta-qayta bo'ladi · odam o'zicha yo'l topgan · odam voz kechgan.
- Bashorat (ballsiz): **Olti yozuvdan nechtasi muammo?** · 3 · 4 · 5 — tanlov saqlanadi.
- Vizual: chapda Mentor ro'yxati — o'nta qator-karta, hisoblagich «6 / 10». Oltitasi to'la (joy yorlig'i + gap), to'rttasi bo'sh uzuq chiziq:
  1. maktab — Tanaffusda telefonni quvvatlash uchun bo'sh rozetka topilmaydi.
  2. maktab — To'garak qaysi xonada ekanini bilmay, o'quvchilar xonama-xona yurishadi.
  3. yo'l — Maktab oldida velosiped qo'yadigan joy yo'q — daraxtga bog'lab ketishadi.
  4. yo'l — Kechqurun ko'cha chirog'i yonmaydi — o'smirlar telefon chirog'ini yoqib yurishadi.
  5. mahalla — Suv qachon o'chirilishini qo'shnilar kech bilishadi — idish to'ldirishga ulgurishmaydi.
  6. mahalla — Lift buzilganini odamlar uzoq kutib turgandan keyin bilishadi.
  O'ngda olti yozuv-karta, shu tartibda:
  - yo'l — Velosiped g'ildiragi teshilsa, ustaxonani topolmay uyga yetaklab ketishadi. — *muammo*
  - mahalla — Mahallaga yana bitta maydon qurish kerak. — *yechim*
  - mahalla — Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak. — *muammo (maydon)*
  - maktab — Futbol — eng qiziq o'yin. — *fikr*
  - maktab — Oshxonada bugun nima borligini bilish uchun navbatga turib ko'rishadi. — *muammo*
  - mahalla — Eski darsliklarni kimga berishni bilmay, o'quvchilar ularni uyda yillab saqlaydi. — *muammo*
- **Harakat → Vizual o'zgarish:** yozuv-kartani bosib, «Ro'yxatga» yoki «Muammo emas» → to'g'ri bo'lsa muammo bo'sh qatorga kirib boradi (hisoblagich n / 10),
  «muammo emas» karta kulrang bo'lib chetga suriladi, ustida yorliq «chiqarildi». Xato bo'lsa karta silkinib qaytadi, bitta `QXato`:
  - yechimni ro'yxatga qo'shsa: Bu yechim — kim nimadan qiynalgani yozilmagan. (46)
  - fikrni ro'yxatga qo'shsa: Bu fikr — hech kim qiynalgani ko'rinmaydi. (42)
  - muammoni chiqarsa: Bu yerda odam qiynalgan — belgisini toping. (43)
  42 soniya harakatsizlikda bitta ipucha: Har yozuvda odam qiynalganmi — shuni qarang.
- 2-bosqich (10/10 dan keyin, shu ekranda, harakatsiz): maydon qatori accent bo'lib ko'tariladi va to'liq auditoriya-kartaga aylanadi:
  KIM — o'yinchilar (maydonda o'ynaydigan o'smirlar) · MUAMMO — Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak. · YECHIM — uzuq chiziq «hali yo'q».
  Natija qatori (`QTaxmin`) — bashorat bo'yicha.
- Xulosa: Mentor maydon muammosini tanladi: uni maydonda o'ynaydiganlardan so'rab bilish mumkin. (86)
- Tugma (pastki): Yozuvlarni joylang (N/6) → Davom etish · `tugadi`: yozuvlar paneli yopiladi, ro'yxat va maydon kartasi butun enga.
- Nishon: Clean List! (oltitasi birinchi urinishda).
- O'qituvchi eslatmasi: Maydon — modul bo'yi misolimiz. Bugun yechim aytmang: «sayt qilamiz» deyish erta, avval o'yinchilarning o'zidan eshitiladi.

## 10 · Juftlikda ish  ← QMustaqil (USTAXONA 2 — o'nta muammo, sinfdosh bilan)
- Eyebrow: Juftlikda ish
- Sarlavha: **Sinfdoshingiz kecha qayerda qiynaldi?** (37)
- Mentor: Sherigingizga pastdagi savollarni bering, keyin o'rin almashing. Eshitganingiz va o'zingiz ko'rganingizni bittadan yozing.
- Savollar (`QIzoh` ostida, uch qator — uch belgidan):
  1. Qayerda har safar kutishga to'g'ri keladi?
  2. Nimani bilish uchun kimdandir so'radingiz?
  3. Nimadan voz kechib, qaytib ketdingiz?
- Qadamlar 1/2/3: 1 Sherigingizdan so'rang (taymer 3 daqiqa) · 2 O'rin almashing (taymer 3 daqiqa) · 3 O'zingiz ko'rganlarni qo'shing.
  Yakka rejimda (sherik yo'q) 1–2-qadam o'rniga bitta: Kecha ko'rgan odamlaringizni eslang.
- Bitta ustun: tepada o'nta nuqta (yozilgani ✓, joriysi accent) + hisoblagich n / 10 → bitta yozish qatori → Yordam · «Saqlash» o'ngda.
- Qator ipuchasi: Kim, qayerda, nimadan qiynaldi?
- Har yozilgan muammoga manba yorlig'i o'zi qo'yiladi: 1-qadamda «sinfdoshdan», 3-qadamda «o'zim ko'rdim».
- Tekshiruv (`QXato`, ≤60; yumshoq, m2-16 xabarlari):
  - takror: Bu muammo ro'yxatda bor. Boshqa joyni eslang. (45)
  - juda qisqa (≤15 belgi): Juda qisqa: kim, qayerda, nimadan qiynaldi? (43)
  - gap «… qurish kerak» / «… qilish kerak» bilan tugasa va unda kim qiynalgani yo'q: Bu yechim. Avval odam nimadan qiynalishini yozing. (50)
  - mavhum («yomon», «qiyin», «hamma» — qisqa gapda): Bu umumiy gap. Kim qiynaldi va qayerda? (39)
  - Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam: Kecha uydan chiqqaningizdan qaytguningizcha borgan joylaringizni sanang: bekat, maktab, do'kon, maydon. Qayerda kutdingiz yoki kimdandir so'radingiz?
- **Harakat → Vizual o'zgarish:** gapni yozib «Saqlash» → ro'yxatga yangi qator-karta kiradi (gap + manba yorlig'i), nuqta yashil ✓, hisoblagich oshadi;
  tekshiruvdan o'tmagan gap qatorda `err` fonda, ostida bitta `QXato`. 10/10 da yozish qatori yopiladi, ro'yxat butun enga, har qatorda ✎ Tahrirlash.
- Xulosa (o'quvchi sonidan yig'iladi, P-046): O'nta muammo yig'dingiz: {n} tasini sinfdoshingizdan eshitdingiz. (≈65)
- Tugma (pastki): Yana N ta muammo yozing → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Nishon: Street Scout! (o'nta muammo).
- Mentor statistikasi: «O'nta muammoni yozganlar» · «sinfdoshdan yozilganlar».
- O'qituvchi eslatmasi: Taymerni siz boshqaring — 3 daqiqadan keyin «O'rin almashing» deng. 10 taga ulgurmagan o'quvchi uyda to'ldiradi.

## 11 · Kod yozish  ← QKod (2–3 daqiqa; yangi qoida yo'q — 9-ekran va uch belgining takrori, audit 5)
- Eyebrow: Kod yozish
- Sarlavha: **Ro'yxatdan faqat muammolarni ajratadigan kod yozamiz.** (53) — PM-082(a) sarlavha oilasi (korpus §19, §48)
- Mentor: 9-ekranda yozuvlarni qo'lda ajratdingiz — endi shu ishni kod bajaradi. Yozuvlar — Mentor ro'yxatidan.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Kod yozuvni qaysi qiymatga qarab ajratadi?** · `joy` · `matn` · ✔ `tur`
  - xato `joy`: Joydan yozuv muammomi yoki yechimmi — bilinmaydi. (49) · xato `matn`: Kod gapning ma'nosini o'qimaydi — unga belgi kerak. (51)
- Chap (vazifa, 3 band): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ro'yxatga faqat muammolarning matni tushadi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Bitta yozuvdan boshlang: birinchi yozuvning `tur` qiymati `"muammo"` mi? Ishlagach qolganlariga o'ting.
  Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `console.log` — qiymatni ekranga chiqaradi.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
  «Kompilyator» ta'riflanmaydi (MATN_ETALONI lug'ati: oyna kompilyator emas). Kod nusxalanmaydi (PM-082 d).
- Kod:
```js
// Mentor ro'yxatidagi yozuvlar: joy, matn va turi
const yozuvlar = [
  { joy: "yo'l", matn: "Velosiped teshilsa, ustaxona topilmaydi", tur: "muammo" },
  { joy: "mahalla", matn: "Yana bitta maydon qurish kerak", tur: "yechim" },
  { joy: "maktab", matn: "Futbol — eng qiziq o'yin", tur: "fikr" },
  { joy: "maktab", matn: "Oshxonada nima borligini navbatda bilishadi", tur: "muammo" }
];

function muammolar(royxat) {
  // faqat muammolarning matni qaytsin
  return [];   // shu joyni siz yozasiz
}

console.log(muammolar(yozuvlar));
// ["Velosiped teshilsa, ustaxona topilmaydi", "Oshxonada nima borligini navbatda bilishadi"]
console.log(muammolar([]));
// []
console.log(muammolar([yozuvlar[1], yozuvlar[3]]));
// ["Oshxonada nima borligini navbatda bilishadi"]
```
- Kod oynasi sarlavhasi: `app.js — muammolar funksiyasini yakunlang` · placeholder: `// muammolarning matnini yig'ib qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: to'rt yozuvdan ikkitasi tushadi. (60) · 2 — Faqat matn tushsin; yechim va fikr tushmasin. (45) · 3 — Bo'sh ro'yxatga — bo'sh; ikki yozuvdan bittasi tushadi. (55)
- **Harakat → Vizual o'zgarish:** darvozada `tur` tanlanadi → kod namunasida `tur` qiymatlari bir lahza ajraladi (9-ekrandagi rangda: muammo — yashil, yechim va fikr — kulrang);
  kod ishga tushganda Console'da ro'yxat chiqadi, shartlar birma-bir ✓ bo'ladi.

## 12 · Yakuniy savol  ← QTest (✔ 1-variant, `correctIdx 0`; uch belgi + 2-darsga ko'prik, audit 4)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Qaysi muammo haqida avval odamlardan so'raysiz?** (6 so'z)
  - ✔ Ko'p tengdoshda qayta-qayta bo'ladigan muammo (45)
  - Faqat o'zingizda qayta-qayta bo'ladigan muammo (46)
  - Bitta tanishingiz bir marta aytib o'tgan muammo (47)
  - AI bilan yechish eng qiziq tuyulgan muammo (42)
- To'g'ri izohi: Bir necha odamda takrorlangan muammo haqida avval o'shalardan so'raymiz.
- Xato izohlari: 2 — Faqat sizda bo'lsa, so'raydigan boshqa odam yo'q. (49) · 3 — Bir marta aytilgan — takror yo'q, tasodif bo'lishi mumkin. (58) ·
  4 — Qiziq texnologiya — hali hech kim qiynalgani emas. (50) · (umumiy) Bu muammo yana kimda bor — shuni qarang. (40)

## 13 · O'zingiz o'ylab ko'ring  ← QMustaqil (2 qadam)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Qaysi muammongiz boshqalarda ham bor?** (37)
- Mentor: Ro'yxatdan bitta muammoni tanlang va {sherigingizga | ovoz chiqarib o'zingizga} ayting: u yana kimlarda bor? Keyin KIM qatoriga yozing.
- Qadamlar 1/2: 1 Sherigingizga ayting | Ovoz chiqarib ayting (taymer 1 daqiqa | 30 soniya) · 2 KIM qatorini yozing
- Vizual: 10-ekrandagi ro'yxat (qator-kartalar). Bittasini bosish → u kattalashib to'liq auditoriya-karta bo'ladi: MUAMMO — tanlangan gap · KIM — bo'sh qator (joriy, accent) ·
  YECHIM — uzuq chiziq «hali yo'q». 10-ekran yozilmagan bo'lsa (mentor rejimi) — Mentorning maydon kartasi, KIM yozilgan.
- KIM qatori ipuchasi: Bu muammo yana kimlarda bor?
- **Harakat → Vizual o'zgarish:** qator-kartani tanlash → to'liq karta; taymer → aytish; KIM yozilgach (≥8 belgi) qatorga siluetlar to'plami chiqadi, karta chap chetida yashil chiziq;
  YECHIM bo'sh qoladi.
- Xulosa (yozgach): Mahsulot shunday kartadan boshlanadi: KIM va MUAMMO bor, YECHIM hali bo'sh. (75)
- Taymer tugmalari: 1 daqiqani boshlash · To'xtatish · ↻ Yana 1 daqiqa (yakka rejimda — 30 soniya)
- Tugma (pastki): KIM qatorini yozing → Davom etish

## 14 · Natijalar (podium)  ← QNatija
- Platforma standarti (jonli reyting · yakka rejimda o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Qaysi bot mahsulot · 2 — MUAMMO qatori · 3 — Boshqalarga kerakligi · 4 — Avval kimdan so'raysiz

## 15 · Takrorlash  ← QKartochka
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon | Orqa |
|---|---|
| Loyiha nima? | Boshlanishi va oxiri bor qurish ishi |
| Mahsulot nima? | Odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat |
| Loyiha va mahsulot qanday bog'lanadi? | Saytni qurish — loyiha; tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi |
| Do'stingiz siz yuborgan havola orqali kelib, botdan har kuni jadvalini ko'radi. Bu mahsulotmi? | Ha: u botni o'z ishi uchun ishlatyapti — havola qayerdan kelgani muhim emas |
| Auditoriya-kartada qaysi uch qator bor? | KIM, MUAMMO, YECHIM |
| Ilovada odatda avval qaysi qator ko'rinadi? | YECHIM — ilova nima qilishi |
| MUAMMO qatoriga nima yoziladi? | Ilovasiz odam nimadan qiynalgani |
| Xohish nega muammo emas? | Unda odam qiynalgani ko'rinmaydi |
| Dropbox nimadan boshlangan? | Fleshkasini uyda unutgan dasturchining muammosidan |
| Dropbox boshqalarga ham kerakligi qanday bilindi? | Video chiqqach, bir kunda 75 000 kishi kutish ro'yxatiga yozildi |
| Muammoning uch belgisi qaysilar? | Qayta-qayta bo'ladi · odam o'zicha yo'l topgan · odam voz kechgan |
| Qaysi muammo haqida avval odamlardan so'raysiz? | Bir necha odamda qayta-qayta bo'ladigani haqida |

## 16 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Muammolar ro'yxatingiz tayyor.** (30)
- Arena tugmasi: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM (platforma standarti)
- Endi siz bilasiz:
  - Loyiha — boshlanishi va oxiri bor qurish ishi.
  - Mahsulot — odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat.
  - Ilovada odatda avval yechim ko'rinadi — uning muammosi va kimga kerakligini siz topasiz.
  - Bir necha odamda qayta-qayta bo'ladigan muammo haqida avval o'shalardan so'raysiz.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar):
  - Sarlavha: Uyda nima qilasiz?
  - Karta: Kim bilan: oilangiz va qo'shnilaringiz · Nechta: 1 odam, 3 yangi muammo, 5 odam ro'yxati · Muddat: keyingi darsgacha
  - Qadamlar:
    1. Oilangizdan yoki qo'shnilardan bitta odamga darsdagi uch savolni bering.
    2. Uning javobidan va yo'lda ko'rganingizdan ro'yxatga 3 ta yangi muammo yozing.
    3. Darsda tanlagan muammo bor 5 odamni toping va yozib qo'ying: ismi emas, kimligi (masalan: «maydonda o'ynaydigan qo'shni bola»).
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Besh odamdan nimani bilib olasiz?»: tanlagan muammo bor odamlar bilan qanday gaplashishni o'rganasiz.
- Nishonlar — pastda (mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Product Spotter!** (4-ekran, uchalasida birinchi urinishda) — Uch mahsulotning muammosini birinchi urinishda topdingiz
- **App Analyst!** (8-ekran) — Uchta ilova uchun auditoriya-karta yozdingiz
- **Clean List!** (9-ekran, birinchi urinishda) — Mentor yozuvlaridan muammoni yechim va fikrdan ajratdingiz
- **Street Scout!** (10-ekran) — Atrofingizdan o'nta muammo yig'dingiz
- Yozuvlar (platforma): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (platforma yorliqlari).
1. (3-ekran) **Loyiha va mahsulot**
   1. Loyiha — Boshlanishi va oxiri bor qurish ishi.
   2. Mahsulot — Odamlar o'z muammosi uchun ishlatadigan sayt, ilova yoki xizmat.
   3. Qanday bilinadi — So'rang: odamlar uni o'z ishi uchun ishlatyaptimi? Havola qayerdan kelgani muhim emas.
   - Sinfga savol: Do'stingiz siz yuborgan havolani bir marta ochib ko'rdi. Bu mahsulotmi?
2. (5-ekran) **Yechimdan muammoga**
   1. Ilovada nima ko'rinadi — Ilovada odatda avval YECHIM ko'rinadi: u nima qiladi.
   2. MUAMMO qatori — Ilovasiz odam nimadan qiynalganini yozamiz.
   3. Muammo emas — Xohish yoki rost fakt: unda hech kim qiynalmagan.
   - Sinfga savol: Yandex Go bo'lmasa, yo'lovchi nimadan qiynalardi?
3. (7-ekran) **Boshqalarga ham kerakmi**
   1. Boshlanishi — Dropbox fleshkasini uyda unutgan dasturchining muammosidan boshlangan.
   2. Bir kunda — Video chiqqach, bir kun ichida 75 000 kishi kutish ro'yxatiga yozildi.
   3. Kerakligi bilindi — Kutish ro'yxati shu muammo boshqalarda ham borligini ko'rsatdi.
   - Sinfga savol: Siz qurgan bot boshqalarga ham kerakligini qanday bilasiz?
4. (12-ekran) **Avval kimdan so'raysiz**
   1. Uch belgi — Muammo odamning qilgan ishida ko'rinadi: qayta-qayta bo'ladi, odam o'zicha yo'l topgan yoki voz kechgan.
   2. Faqat sizda bo'lsa — So'raydigan boshqa odam yo'q.
   3. Ko'p odamda bo'lsa — Avval o'shalardan so'raysiz.
   - Sinfga savol: Ro'yxatingizdagi qaysi muammo boshqalarda ham bor?

## Jonli viktorina — 12 savol (✔ o'rni: A — 1, 7, 11 · B — 3, 6, 10 · C — 2, 5, 12 · D — 4, 8, 9)
1. Qaysi biri loyiha?
   - ✔ Saytni to'rt hafta ichida qurish ishi
   - Siz qurgan, sinfdoshlar ishlatadigan bot
   - Yo'lovchilar taksi chaqiradigan ilova
   - Odamlar hisobini to'ldiradigan ilova
2. Mahsulotni kim ishlatadi?
   - Faqat uni qurgan odamning o'zi
   - Qurgan odam ko'rsatgan do'stlar
   - ✔ Odamlar — o'z muammosi uchun
   - Mentor — vazifani tekshirish uchun
3. Saytingiz internetga chiqdi, lekin uni faqat o'zingiz ochasiz. Bu nima?
   - Mahsulot — chunki u internetda turibdi
   - ✔ Loyiha tugadi — hech kim ishlatmaydi
   - Mahsulot — chunki uni hamma ocha oladi
   - Loyiha — chunki kodi juda kam yozilgan
4. Ilovani ishlatsangiz, auditoriya-kartaning qaysi qatori ko'rinib turadi?
   - KIM — ilovani kimlar ishlatishi
   - MUAMMO — odam nimadan qiynalgani
   - Hech biri — hammasi yashirin
   - ✔ YECHIM — ilova nima qilishi
5. Google Maps uchun MUAMMO qatoriga nima yoziladi?
   - Xaritada chiroyli rang bo'lishini xohlardi
   - Shaharda ko'chalar juda ko'p edi
   - ✔ Yangi joyni odamlardan so'rab topardi
   - Telefonda xarita ko'rishni yaxshi ko'rardi
6. Muammoning uch belgisidan biri qaysi?
   - Odam «menda muammo bor» deb aytadi
   - ✔ Odam o'zicha boshqa yo'l topgan
   - Muammo haqida internetda yozilgan
   - Muammoni yechadigan ilova bor
7. «Maktabga yangi oshxona qurish kerak.» Bu yozuv nima?
   - ✔ Yechim — unda kim qiynalgani yo'q
   - Muammo — unda «kerak» so'zi bor
   - Muammo — u maktabda bo'lyapti
   - Yechim — chunki u juda qimmat
8. Dropbox qanday muammodan boshlangan?
   - Kompyuterlar juda qimmat turardi
   - Internet juda sekin ishlab turardi
   - Fayllarni chop etish juda qiyin edi
   - ✔ Fayllar bor fleshka uyda qolgan edi
9. Dropbox'ni ko'rsatadigan video chiqqach nima bo'ldi?
   - Dasturni faqat do'stlari ko'rib chiqdi
   - Dastur shu kuni yopib qo'yildi
   - Videoni hech kim ko'rmay qoldi
   - ✔ O'n minglab odam ro'yxatga yozildi
10. Do'stingiz siz yuborgan havola orqali kelib, botdan har kuni jadval ko'radi. Bot nima?
    - Loyiha — chunki havolani o'zingiz yuborgansiz
    - ✔ Mahsulot — botni o'z ishi uchun ishlatadi
    - Mahsulot — chunki havolasi ishlayapti
    - Loyiha — chunki bot hali kichik
11. Muammo yig'ishda sherigingizdan nimani so'raysiz?
    - ✔ Nimani bilish uchun kimdandir so'raganini
    - Qaysi ilovani qurib berishingizni xohlashini
    - Qaysi ilovani eng chiroyli deb bilishini
    - G'oyangiz unga yoqadimi yoki yoqmaydimi
12. Mentor nega maydon muammosini tanladi?
    - Futbolni hammadan ham yaxshi ko'rgani uchun
    - Yangi maydon qurish arzon bo'lgani uchun
    - ✔ O'yinchilardan so'rab bila olgani uchun
    - Ro'yxatda u eng birinchi turgani uchun
- Arena yozuvlari — platforma shabloni (namuna YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — loyiha · mahsulot · muammo · kim · yechim · ro'yxat · sinfdosh · karta ·
  uyga vazifa banneri — muammo · odam · ro'yxat · savol.

---

## B. KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`)
1. Yangi fayl `src/7-Modull/PmProductProblemLesson.jsx` — skeletdan (pilotdan emas, JR-14). Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s9 `QTushuncha` (`zoom`, `tugadi` — q17/q18) ·
   s3/s5/s7/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` · s8/s10/s13 `QMustaqil` · s11 `QKod` · s14 `QNatija` · s15 `QKartochka` · s16 `QYakun`; palitra `qolipRang('pm')`.
2. **`AudKarta`** — bitta vizual (180): uch ko'rinish (`toliq` · `ixcham` · `qator`), qator holatlari (bo'sh/yozildi/joriy/xato/to'liq), KIM siluetlari (CSS), yorliq «ko'rsatish uchun» / «o'z ishi uchun»,
   karta yorlig'i «loyiha» / «mahsulot». Manba `KARTALAR`; `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda e'lon qilinadi.
3. **`NARSALAR`** (s0, s2): 4 narsa `{ nom, kim: [{t, nega}], nega }`, `nega: 'korsatish' | 'ozIshi'` (yorliq «ko'rsatish uchun» / «o'z ishi uchun»).
4. **`MAHSULOTLAR`** (s4): 3 ta `{ nom, yechim, muammo, tuzoq: [2], kim }`; s5 `UZUM` kartasi alohida (KIM, YECHIM).
5. **`ROYXAT_MENTOR`** (s9): 6 tayyor + 6 yozuv `{ joy, t, tur: 'muammo' | 'yechim' | 'fikr', maydon? }`; 2-bosqichda `maydon: true` qator → `AudKarta toliq`. s11 `yozuvlar` — shu ro'yxatdan 4 ta `{ joy, matn, tur }` (matn qisqartirilgan).
6. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); javob 120 belgi; KIM siluet + «ko'rsatish uchun» yorlig'i, ikkinchi ixcham karta (Yandex Go, «o'z ishi uchun»).
7. s2: bashorat (1/2/3) · «Sizsiz bir kun» bitta tugma · siluetlar so'nishi · nomlar «Loyiha tugadi — «qurish ishi»» / «Mahsulot — «odamlar ishlatadi»» + strelka «avval — qurish ishi» · `QTaxmin`.
8. s4: `QQadamlar` 3 qadam; tanlov tartibi aralash (to'g'ri o'rni har qadamda boshqa); `QXato` bitta matn; 42 s ipucha; nishon `productSpotter`.
9. s6: `DropboxSahna` (noutbuk ekrani, USB uyasi, fayl chizig'i, hisoblagich 0 → 75 000, siluetlar oqimi) + `AudKarta`; `K_SLIDES` 5; bashorat 3/5 (zinapoya, ballsiz); 5/5 da karta yorlig'i almashmaydi; manba izohi faylda.
10. s8 artefakt: `localStorage` `pm-m7d1-ilovalar` = `[{ nom, yechim, muammo, kim } × 3]`; tekshiruv yumshoq (ikkinchi «Saqlash» bilan o'tadi); mentor rejimida namuna karta.
11. s9: saralash (`Ro'yxatga` / `Muammo emas`), hisoblagich «n / 10», 3 `QXato`, bashorat 3/4/5, 2-bosqich (maydon kartasi), nishon `cleanList`.
12. s10 artefakt: `pm-m7d1-muammolar` = `{ muammolar: [{ matn, manba: 'sinfdosh' | 'ozim' } × 10], savedAt }`; `PairTimer` 3 + 3 daqiqa; manba yorlig'i qadamdan.
    `saveHint` — m2-16 xabarlari, LEKIN m2-16 dagi `RE_YECHIM` (`kerak\b`) bu yerda ishlatilmaydi: maydon muammosining o'zi «…qo'ng'iroq qilish kerak» bilan tugaydi.
    Yechim faqat gap «… qurish kerak / qilish kerak» shaklida va unda odam so'zi (o'quvchi, odam, qo'shni, o'yinchi, -lar …) bo'lmasa. `optionalLive`.
13. s11: `KOD_TASK` (`muammolar`), starter, 3 `evalEquals` (ikki muammo matni · `[]` · bitta matn), darvoza `joy` / `matn` / `tur`; kod nusxalanmaydi (PM-082 d); «kompilyator» ta'riflanmaydi — «kod oynasi».
14. s13 artefakt: `pm-m7d1-tanlangan` = `{ matn, kim }` — 2-dars kirishi (TAYANCHGA SAVOL 3). `PairTimer` 1 daqiqa / 30 soniya (▶ ⏹ belgisiz).
15. Testlar s3/s5/s7/s12 — `correctIdx` 2/1/3/0 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
16. `ACHIEVEMENTS` 4 (`productSpotter`, `appAnalyst`, `cleanList`, `streetScout`); s16 `RECAP` 4 band = A-2 ta'riflari so'zma-so'z; `HW_TOKENS` — faqat so'z.
17. Uyga vazifa — yangi `HwCard` (dars yangi, PM-027 dagi «tegilmaydi» bu yerga tegishli emas): 3 qadam, yakun ekranida aynan shular.
18. App.jsx: `m7-01` qatoriga `comp: PmProductProblemLesson` + import — asosiy seans (bu agent tegmaydi). Nom «Loyihangiz kimga kerak?» ✓ (DE-205).
19. **REPO — yo'q** (PM darsi, `maydon` repo 4-darsdan).
- Darvozalar: `npm run gates -- src/7-Modull/PmProductProblemLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentorning qolgan 9 muammosi** (9-ekran ro'yxati: rozetka, to'garak xonasi, velosiped joyi, ko'cha chirog'i, suv o'chishi, lift, g'ildirak, oshxona, eski darsliklar) — o'zim yozdim.
   Nega: tayanchda faqat maydon bor. Boshqa darslar ularga tayanmaydi; tayanchga yozilsa, 2–3-darsda Mentor shu ro'yxatga qaytishi mumkin.
2. **Vizual — «auditoriya-karta» (KIM · MUAMMO · YECHIM, `m1-02` dan).** Yangi nom o'ylab topmaslik uchun tanish atamani oldim. Nega savol: 3-dars (MVP chegarasi) va 12-dars (pitch)
   ham «kim va nima uchun» bilan ishlaydi — modul bo'yi bitta karta bo'lsinmi? Bo'lsa, tayanchga qo'shilsin.
3. **Artefaktlar va kalitlar:** `pm-m7d1-ilovalar` · `pm-m7d1-muammolar` · `pm-m7d1-tanlangan`. Qaror 7: «keyingi dars shu yozuvlar bilan boshlanadi» — 2-dars `pm-m7d1-tanlangan`
   (tanlangan muammo + KIM) va uyga vazifadagi «5 odam ro'yxati» bilan boshlanishi kerak. 2-dars MD agenti shu kalitni bilsin.
4. **Ta'riflar** — GATE M 01-q0 bilan yopildi: tayanch 1-bo'limda; boshqa darslar shu so'zlar bilan (12-dars kartochkasi — o'z navbatida).
5. **«maydon» so'zi faqat futbol maydoni** (T-015) — butun modul uchun: forma joyi «qator» deyilsin. Kod darslarida «input maydoni» chiqishi mumkin — modul qoidasi kerak.
6. **«skan» so'zi** — topshiriqda bor, o'quvchi matnida «muammo yig'ish» deb yozdim (kundalik so'z, atama yuki yo'q). Modulda boshqa dars «skan» desa — mos kelmaydi.
7. **Dropbox keysi** — bu darsda. 12-dars (pitch) yoki boshqa PM darsi ham keys tanlasa, takrorlanmasin. Dropbox 1–8-Modul faol darslarida yo'q (grep: 0).
8. **Hook portfolio saytiga tayanadi** (`m1-08` + `m1-11` Netlify). Har o'quvchida bor deb oldim; yo'q bo'lsa ham savol voqea haqida, javob bir xil.
9. **Uyga vazifa 3-qadami** («tanlagan muammongiz bor 5 odam ro'yxati») 2-dars uyga vazifasini (5 real intervyu) oldindan tayyorlaydi — 2-dars MD si bilan kelishilsin.

## Shubhali joylar (ishonchim komil emas)
- s4/s5/arena-5 tuzoqlari («…bo'lishini xohlardi», «… ko'p edi») — bitta xato-sinf; o'quvchi uchun juda oson bo'lishi mumkin.
- s6 4/5 «Ular dasturni o'z fayllari uchun kutayotgan edi» — manbada so'zma-so'z yo'q, bizning xulosa (manba qatorida aytilgan).
- s12 ✔ va 2-variant faqat «Ko'p tengdoshda» / «Faqat o'zingizda» bilan farq qiladi — juda yaqin ko'rinishi mumkin; lekin aynan shu farq — dars qoidasi.
- s9 Mentor gapi birinchi shaxsda («ko'rganlarimni yozib chiqdim») — Mentor o'qituvchi sifatida o'z kunini aytadi; qahramon emas.
- Payme «telefon hisobini to'ldiradi», Uzum Market «yetkazib beradi» — ilovalarning ko'rinadigan ishi, son yo'q; manba kerak emas deb oldim.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx `m6-14` «Raqamingiz nimani isbotlaydi?» → **`m7-01` «Loyihangiz kimga kerak?»** (sub «mahsulot va loyiha farqi, atrofdan 10 muammo» — reja 01 va 04 qadami shu so'zlar bilan) → `m7-02` «Besh odamdan nimani bilib olasiz?».
- [x] Bitta misol-ip: «Kimga kerak?» + Mentorning maydon muammosi (9-ekranda birinchi bor, tayanch gapi aynan); metafora yo'q; bitta vizual — `AudKarta` (to'liq · ixcham · qator).
  Ikkinchi misol faqat testda va tanish olamdan: s3 sinf botlari, s5 Uzum Market, s7 jadval boti (P-002). Dropbox — keys sahnasi (PM-028/029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 9 (QTushuncha) + 0, 3, 5, 6, 8, 10, 11, 13. Bosilganda matn-karta ochiladigan ekran yo'q.
- [x] O'lchov (skript bilan sanaldi): sarlavha 30–49, bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 65–100 · hook javobi 120 · xato izohi 29–60.
- [x] Atamalar: auditoriya-karta (`m1-02`), uch belgi va muammo xabarlari (`m2-16`), yechim (`m2-02`) — so'zma-so'z; yangi ikki atama misoldan keyin; «ishlatadi» bitta fe'l; siz-forma, tugmalar ot-shaklda.
- [x] Testlar: 4 variant, uzunlik teng (s3 48/48/48/50 · s5 41/41/43/43 · s7 46/43/43/45 · s12 45/46/47/42); to'g'ri javob hech qayerda yolg'iz eng uzun emas;
  kalit so'z faqat to'g'rida emas («o'z», «qayta-qayta» distraktorda ham bor); 3-vs-1 shakl yo'q (arena 1, 3, 7, 10 — 2/2). Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «har doim», «100%» — grep 0; «mumkin» bilan yumshatilgan).
- [x] Ichki kodlar yo'q (o'quvchi matnida modul raqami, T/P kodlari yo'q — oldingi darslar nomi bilan); Dropbox fakti — manba bilan (MIT News 2012, Fortune 2017, TechCrunch 2011); «KOD» ro'yxati 19 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (atama misoldan keyin) · T-014/T-015 (ishlatadi; maydon bir ma'noda; ochish bir ma'noda) · T-039 (portfolio va bot — o'quvchida bor; s13 da «muammongiz» — ro'yxat yozilgandan keyin) ·
  T-042 (ta'rif so'zma-so'z) · T-047 (Mentor ekrandagini ta'riflamaydi) · T-052 (uchta tanish atama dars nomi bilan) · P-015 (reja skeleti kashfiyotni ochmaydi) · P-025 (uyga vazifa karta) ·
  P-046 (s10 xulosa o'quvchi sonidan) · P-062 (son ekranda bir marta) · P-064 (bashorat 2, 6, 9) · S-001 (savollar ≤10 so'z) · S-004/S-040 (har tuzoq bitta yanglish tasavvur) · S-015 (keysda 1 bashorat, zinapoya) ·
  S-018 (Dropbox izohi Mentorda; qolgan brendlar tanish ro'yxatda) · S-026 (recap raqam) · PM-005 (2-tur) · PM-082 (kod ekrani darvozasi) · J-026 (hook).
- [ ] Ochiq: s2 to'rt karta + bashorat + nomlar telefonda (393) sig'ishi; s9 o'n qator + olti yozuv bir ekranda (U-006) — vizual bosqichda ko'riladi, kerak bo'lsa ro'yxat 2 ustun.

---

# 9-Modul (kod: `src/7-Modull`, kalit `m7-02`) · 2-dars (PM) «Besh odamdan nimani bilib olasiz?» — MD v3

Fayl: `src/7-Modull/PmFiveInterviewsLesson.jsx` (yangi, `src/skelet/NamunaDars.jsx` dan) · 16 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Menyu: «Besh odamdan nimani bilib olasiz?» · osti: «intervyu: bo'lib o'tgan ishni so'rash, 5 yozuv» (App.jsx `m7-02`, DE-205).
Oldingi dars: `m7-01` «Loyihangiz kimga kerak?» · keyingi: `m7-03` «Besh suhbatdan qaysi muammo chiqdi?».
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi.
Ballik testlar, to'g'ri javob o'rni: s3 = C (`correctIdx 2`) · s5 = A (`0`) · s7 = D (`3`) · s11 = B (`1`) — `INLINE_KEYS` shu bilan quriladi.
Dars hali yo'q — hamma ekran noldan yozilgan. Qavsdagi son — belgilar soni (skript bilan sanaldi).
Tashqi audit (ChatGPT) Filtri: `02-FILTR.md` — 05.10.2026 qo'llandi.

---

## A. Darsning tayanchi

1. **Bosh qoida (dars bo'yi bitta):** muammoni o'rganadigan intervyuda avval g'oyangizni aytmaysiz — odamdan oxirgi marta nima bo'lganini so'raysiz va eshitgan javobni u aytganidek yozasiz.
   Chegarasi (audit 1): bu — muammo bosqichining qoidasi. Tayyor saytni odamga berib kuzatish — boshqa ish (10-darsdagi sinov).
2. **Takror — yangi atama emas.** Texnika «Botingizni ishlatgan odamdan nimani so'raysiz?» darsida o'tilgan (`m5-08`, yakuniy MD `feedback/F-0928-QA-5modul/YAKUNIY/08-PmLesson20.md`).
   O'sha so'zlar aynan qoladi: **voqea savoli** — bo'lib o'tgan ishni so'ragan savol · **bo'sh savol** — javobidan bo'lib o'tgan ish bilinmaydigan savol ·
   **va'da** — hali bo'lmagan ish haqidagi javob · **eshitgan javob — u aytganidek** · **o'sha zahoti** yozish · «bitta odamning gapi hammaga yoyilmaydi».
   Bu darsdagi yangi qadam: u yerda odam botni ishlatgan edi, bu yerda sayt hali yo'q — shuning uchun **g'oya haqidagi savol ham bo'sh savol** (2-ekran xulosasi).
3. **Yangi so'zlar — misoldan KEYIN, bir marta (PM-030, T-011).** 4-ekranda o'quvchi o'yinchi bilan suhbatni oxirigacha olib boradi, shundan keyin nom beriladi:
   - **intervyu** — bitta odam bilan suhbat (ta'rif dars bo'yi so'zma-so'z shu, T-042; `m5-08` dagi «suhbat» bilan bir gapda tenglashadi, T-052);
   - **shablon** — har intervyuda bir xil to'rt qator (so'z o'smirga tanish, 1-ekrandan karta yorlig'i);
   - **yozuv** — to'ldirilgan shablon.
   Shablon qatorlari (dars bo'yi aynan shu nom, `SHABLON` bitta manbada, 180): **Kim bilan · Oxirgi marta nima bo'ldi? · O'shanda nima qildi? · Nima qiyin bo'ldi?**
4. **Inglizcha nom «custdev (customer development)» — faqat 14-ekran kartochkasida bir marta** (tayanch 2-bo'lim), qavsda izoh bilan. Boshqa joyda yo'q.
5. **Bir ma'no — bir so'z (T-014/015):** «maydon» — faqat futbol maydoni; forma joyi **qator** deyiladi, «maydon» emas · «band» — faqat egallangan
   (ro'yxat bandi ma'nosida ishlatilmaydi — kod vazifasida «shart») · «katak» ishlatilmaydi (4-darsdan «vaqt katagi») · «sinov», «hodisa», «talab», «mijoz» — bu darsda yo'q.
   «suhbat» — 1–3-ekranda (atama tug'ilguncha) va kitob voqeasida; 4-ekrandan keyin Maydon olamida — **intervyu**.
6. **Real odam (qaror 7):** darsda — sinfdosh bilan juftlikda bitta mashq intervyusi (9-ekran); uyga — besh real intervyu; 3-dars shu yozuvlar bilan boshlanadi.
   Tayanchdagi besh intervyu natija raqamlari bu darsda yo'q (ular 3-darsda).
7. **Toza yuza (185):** tugma, variant, karta, yorliq, recap'da emoji yo'q. O'yin qatlami (arena, nishon, podium) — mustasno.

## Darsning ipi va bitta vizual

- **Ip — «Maydon»:** mahalladagi futbol maydoni; muammo — kelasiz, band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak. Odamlar — **o'yinchi** va **maydon egasi** (ismsiz).
  Hook'da do'stga g'oya aytiladi → kelajak javobi (0) → o'yinchiga olti savol (2) → o'sha o'yinchi bilan intervyu, shablon yoziladi (4) → kitobdagi ona (6) →
  o'quvchining o'z muammosi uchun shablon (8) → sinfdosh bilan mashq yozuvi (9) → kod yozuvlarni tekshiradi (10) → uyda besh intervyu → 3-dars.
  Maydon egasi: 3 va 7-ekran savollari, 1-ekran namunasi va 10-ekran kodi. Bu — savol namunasi; 3-darsdagi besh yozuv — besh o'yinchi (GATE M K4).
- **Bitta vizual — «Suhbat va shablon» (`SuhbatShablon`, dars bo'yi):**
  - chapda **suhbatdosh**: chizilgan bosh-siluet (CSS doira + yarim doira, emoji emas), ostida rol yorlig'i («o'yinchi» / «maydon egasi» / «sinfdosh») va **javob pufagi**;
    pufak ostida bitta kulrang yorliq — javob turi: «voqea» (yashil) · «va'da» · «javob savolda» · «baho» · «fikr»;
  - o'ngda **shablon kartasi** (yorliq «Shablon»): tepada ixcham sarlavha-qator «Muammo: …» (faqat 8–9-ekranda), ostida to'rt qator — har birida qator nomi (kulrang) va javob joyi.
  - Qator holatlari: bo'sh (uzuq chiziq — to'ldiriladigan joy, U-041) → joriy (accent chegara) → yozildi (javob qo'shtirnoqda, bir lahza ajralib kiradi) →
    xato (`err` fon) → to'liq yozuv (chap chetda yashil chiziq).
  - 4-ekranda karta yonida beshta kichik karta-izi: «1 / 5» (bittasi yozilgan, to'rttasi uzuq chiziq) — P-056.
  - Ishlatiladi: 0 (pufak) · 1 · 2 (suhbatdosh va pufak) · 4 · 8 · 9 · 12. Kitob voqeasi (6) — o'z keys-maketi `KitobSahna` (PM-029).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · bitta savol
- Sarlavha: **«Ishlatarmidingiz?» desangiz, do'stingiz nima deydi?** (52)
- Mentor: Bugungi misol — mahalladagi futbol maydoni: kelasiz, u esa band. Shu muammo uchun sayt g'oyasini do'stingizga aytdingiz.
- Maket (chap): chat oynasi. O'ngda sizning pufagingiz: «Maydonni oldindan band qiladigan sayt qilsam, ishlatarmidingiz?» · chapda do'st pufagi — uch nuqta (yozmoqda).
- Variantlar (radio, o'ng; bir uzunlikda):
  - «Ha, men ham ishlatardim» deydi (30)
  - «Bilmadim, ko'rish kerak» deydi (30)
- Javob (ikkalasida bir xil, maqtovsiz — J-026): Ikkalasi ham bo'lishi mumkin. Lekin ikkalasi ham kelajak haqida: maydonda oxirgi marta nima bo'lgani aytilmadi. (111)
- **Harakat → Vizual o'zgarish:** variantni tanlash → chatda uch nuqta o'rniga do'stning javobi pufak bo'lib tushadi, ostida kulrang yorliq «va'da» (ikkinchi variantda «fikr»).
  Jonli darsda: sinf ovozlari chizig'i — har variant va foizi.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun bitta suhbatni to'rt qatorga yozib olasiz.** (48)
- Mentor: Darsda sinfdoshingiz bilan mashq qilasiz, uyda — besh odam bilan.
- Chap: «Dars oxirida — to'rt qatorga yozilgan bitta suhbat» + shablon kartasi; qatorlar 0.9 s oraliqda o'zi yoziladi (maydon egasi namunasi):
  - Kim bilan — maydon egasi
  - Oxirgi marta nima bo'ldi? — «Kecha bir soatga uch kishi qo'ng'iroq qildi»
  - O'shanda nima qildi? — «Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim»
  - Nima qiyin bo'ldi? — «Kim birinchi qo'ng'iroq qilganini eslay olmadim»
  oxirida karta chetida yashil chiziq.
- O'ng (01 · matn · teg; bosilmaydi — P-015):
  - 01 · Qaysi savol bo'lib o'tgan ishni so'rashini ajratasiz · `savol`
  - 02 · O'yinchi bilan suhbatni to'rt qatorga yozasiz · `shablon`
  - 03 · Kitobdagi ona qaysi savolga voqeani aytganini ko'rasiz · `voqea`
  - 04 · O'z muammongiz bo'yicha sinfdoshingiz bilan suhbatlashasiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi.
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Ikki xil savol  ← QTushuncha
- Eyebrow: Takror · ikki xil savol
- Sarlavha: **Qaysi savol maydonda bo'lgan voqeani ochadi?** (44)
- Mentor: Botingizni ishlatgan odamdan nimani so'raganingizni eslang — o'sha qoida maydonda ham ishlaydi. Har savolni o'z tomoniga joylang.
- Bashorat (ballsiz, 181): **Bu savollardan nechtasi voqeani ochadi?** · 2 · 3 · 4 — tanlov saqlanadi.
- Vizual: tepada olti savol-karta (aralash tartibda) · ostida ikki tomon, bir balandlikda: chap **Bo'lib o'tgan ishni so'raydi** · o'ng **Bo'lib o'tgan ishni so'ramaydi** ·
  o'ng chetda suhbatdosh — o'yinchi (pufak bo'sh).
- Savollar (o'yinchiga) → o'yinchining javobi → yorliq:
  1. «Oxirgi marta maydonga qachon bordingiz?» → «O'tgan shanba, kechqurun.» → voqea
  2. «O'sha kuni maydon bo'shligini qanday bildingiz?» → «Bilmadik — borib ko'rdik.» → voqea
  3. «Oxirgi marta egasiga qachon qo'ng'iroq qildingiz?» → «O'tgan shanba, maydon oldida turib.» → voqea
  4. «Band qiladigan sayt bo'lsa, ishlatarmidingiz?» → «Ha, ishlatardim.» → va'da
  5. «Maydon topish qiyin, shundaymi?» → «Ha, qiyin.» → javob savolda
  6. «Shunday sayt yaxshi g'oyami?» → «Ha, ajoyib g'oya!» → baho
- **Harakat → Vizual o'zgarish:** savol-kartani bosib, tomonni bosish (yoki sudrash) → to'g'ri bo'lsa karta o'sha tomonga kiradi VA o'yinchi pufagida uning javobi chiqadi,
  ostida yorliq (voqea — yashil; va'da / javob savolda / baho — kulrang). Noto'g'ri tomon → karta silkinib qaytadi, bir qator (`QXato`):
  - voqea savoli o'ng tomonga: Bu savol bo'lib o'tgan kunni so'rayapti. (40)
  - 4 chap tomonga: Bu sayt hali yo'q — javobi va'da bo'ladi. (41)
  - 5 chap tomonga: Javobni savolning o'zi aytib qo'ydi. (36)
  - 6 chap tomonga: Bu savol g'oyangizga baho so'rayapti. (37)
- 6/6 da: tomonlar ustida `m5-08` dagi nom paydo bo'ladi: chap **voqea savoli**, o'ng **bo'sh savol**. Natija qatori (`QTaxmin`): «Taxminingiz: 2 · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: G'oya haqidagi savol ham bo'sh savol: javobida maydonda bo'lgan voqea yo'q. (75)
- Tugma (pastki): 6 savolni joylang (N/6) → Davom etish · `tugadi`: kartalar paneli yopiladi, ikki tomon va o'yinchi pufagi butun enga (199).
- O'qituvchi eslatmasi: 6-savoldagi maqtovni «yomon» demang — u rost his, faqat maydonda nima bo'lganini aytmaydi. Kitob voqeasi (6-ekran) shu haqda.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · maydon egasi
- Savol: **Maydon egasiga qaysi savol voqea savoli?** (6 so'z)
  - A «Band qiladigan sayt sizga kerak bo'ladimi?» (42)
  - B «Kelasi oy odam ko'payadi deb o'ylaysizmi?» (41)
  - ✔ C «Kecha qaysi soatga ko'p qo'ng'iroq bo'ldi?» (42)
  - D «Kecha ham qo'ng'iroq ko'p bo'ldi, shundaymi?» (44)
- To'g'ri izohi: Savol kechagi kunni so'rayapti — egasi bo'lgan voqeani aytadi.
- Xato izohlari: A — Bu savol g'oyani so'rayapti — javobi baho bo'ladi. (50) · B — Kelasi oy hali kelmagan — javobi taxmin bo'ladi. (48) ·
  D — Javobni savolning o'zi aytdi — egasi «ha» deydi. (48)
- Eslatma: «kecha» to'g'ri variant va D da bor (vaqt so'zi faqat to'g'rida emas, §135 C).
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 4 · Bitta intervyu  ← QTushuncha (markaziy)
- Eyebrow: Tajriba · bitta suhbat
- Sarlavha: **Bitta o'yinchidan nimani bilib olasiz?** (38)
- Mentor: Savolni siz tanlaysiz, o'sha o'yinchi javob beradi. Javob shablonning qaysi qatoriga tushishini kuzating.
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8): 1 Oxirgi marta nima bo'ldi? · 2 O'shanda nima qildi? · 3 Nima qiyin bo'ldi? (joriy — accent, o'tgani ✓).
  Har qadamda ikki savol-tugma (bir uzunlikda). O'ng — suhbatdosh (o'yinchi) + shablon kartasi; 1-qator «Kim bilan — o'yinchi» oldindan yozilgan, qolgan uchtasi uzuq chiziq.
- Qadamlar (✔ — qatorni to'ldiradigan savol; o'rni almashib turadi):
  1. «Maydon topish sizga qiyinmi?» → «Ha, ba'zan qiyin.» → javob savolda ·
     ✔ «Oxirgi marta borganingizda nima bo'ldi?» → «O'tgan shanba sinfdoshlar bilan bordik — maydon band ekan.» → 2-qator
  2. ✔ «O'shanda nima qildingiz?» → «Egasiga qo'ng'iroq qildik — ko'tarmadi. Hovlida o'ynadik.» → 3-qator ·
     «Sayt bo'lsa, oldindan band qilarmidingiz?» → «Ha, band qilardim.» → va'da
  3. «Maydonlar umuman yetishmaydimi?» → «Bilmadim, balki yetishmaydi.» → fikr ·
     ✔ «O'sha kuni eng qiyini nima bo'ldi?» → «Yarim soat yo'l yurib keldik — bekorga.» → 4-qator
- **Harakat → Vizual o'zgarish:** savolni bosish → o'yinchi pufagida javob chiqadi.
  Voqea savoli bo'lsa javob pufakdan shablonning joriy qatoriga qo'shtirnoqda tushadi, qadam ✓ bo'ladi, keyingi qadam ochiladi.
  Bo'sh savol bo'lsa pufak ostida kulrang yorliq («javob savolda» / «va'da» / «fikr»), qator uzuq chiziq bo'lib qoladi, tanlangan tugma o'chadi — ikkinchisi qoladi.
  42 soniya harakatsizlikda bitta ipucha (javobni aytmaydi): Qaysi savolning javobida kun yoki qilingan ish bo'ladi?
- 3/3 da (atama — misoldan keyin, bir marta; `QIzoh`): Bitta odam bilan shunday suhbat — intervyu. To'ldirilgan shablon — yozuv.
  Karta ustida yorliq **intervyu yozuvi**, yonida beshta karta-izi: «1 / 5».
- Xulosa: Bitta yozuv — bitta odamning voqeasi. Bu modulda besh odam bilan gaplashib, takrorini qidiramiz. (96) — 5 — modul topshirig'i, qonun emas (audit 2)
- Tugma (pastki): Savolni tanlang (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, shablon kartasi va «1 / 5» butun enga.
- Nishon: **First Record!** — uchala qadamda birinchi bosishda voqea savoli.
- Eslatma (`m5-08` bilan bog'lanish): «suhbat» so'zi o'sha darsdagi ma'noda; bu yerda u nom oladi — intervyu (T-052).

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`)
- Eyebrow: Tekshiruv · keyingi savol
- Iqtibos (savol ustida, suhbatdosh pufagida): O'yinchi: «Kelsak, maydon band ekan.»
- Savol: **Keyingi savolingiz qaysi?** (3 so'z)
  - ✔ A «Maydon band ekan — o'shanda nima qildingiz?» (42)
  - B «Sayt bo'lsa, maydonni band qilarmidingiz?» (41)
  - C «Maydonlar ko'pincha band bo'ladi, shundaymi?» (44)
  - D «Keyingi safar qachon borishni o'ylayapsiz?» (41)
- To'g'ri izohi: Savol o'sha voqeani davom ettiradi — shablonning keyingi qatori yoziladi.
- Xato izohlari: B — Bu sayt hali yo'q — javobi va'da bo'ladi. (41) · C — Javobni savolning o'zi aytdi — u «ha» deydi. (44) ·
  D — Bu kelajakni so'rayapti — voqeadan chiqib ketdingiz. (52)
- Tanlagach: pufak ostidagi kichik shablonda «O'shanda nima qildi?» qatori yonadi (to'g'ri — yashil, xato — `err` fon).
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 6 · Kitobdan · The Mom Test  ← QVoqea
- Eyebrow: Kitobdan (GATE M 02-q0; PM-028 ramkasi)
- Sarlavha: **Onangiz ham rostini aytadigan savol qanday bo'ladi?** (51)
- Mentor: «The Mom Test» — Rob Fitzpatrick degan tadbirkorning odamlar bilan qanday gaplashish haqidagi kitobi. U 2013-yilda chiqqan.
- Nuqtalar (5) · yorliq **The Mom Test · N/5** (bashorat kartasida ham) · maket `KitobSahna` (chizilgan: kitob muqovasi → oshxona stoli, ona va o'g'il siluetlari, planshet, javon; logotip yo'q, son o'ylab topilmagan).
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/5 **Kitob bitta misol bilan boshlanadi** — Muallif o'zi ham odamlar bilan noto'g'ri gaplashganini yozadi. Kitobda o'g'il onasi bilan ikki marta gaplashadi.
    · maket: muqova ochilib oshxona sahnasiga o'tadi
  - 2/5 bashorat — **O'g'il g'oyasini aytadi: planshetda ochiladigan taomlar kitobi. Onasi nima deydi?** · «Menga kerak emas» · «Bilmadim, ko'rish kerak» · ✔ «Ajoyib ekan, narxi ham yaxshi»
    (bir o'lchov — rozilik darajasi, o'sish tartibida, S-015)
  - 3/5 **Ona g'oyani maqtadi** — Ona yolg'on gapirmoqchi emas edi: o'g'lini xafa qilmaslik uchun maqtadi. O'g'il ilovani qurdi — uni hech kim, hatto onasi ham olmadi.
    · maket: ona pufagi «Ajoyib ekan!», ostida kulrang yorliq «baho»
  - 4/5 bashorat — **Ikkinchi suhbatda o'g'il boshqa savollar beradi. Qaysi biri ko'proq narsa ochadi?** · «Taomlar ilovasi sizga kerakmi?» · «Planshetda odatda nima qilasiz?» ·
    ✔ «O'zingizga oxirgi marta qaysi kitobni oldingiz?» (g'oya → odatda → oxirgi marta)
    · javobdan keyin bir qator (`QIzoh`): «Odatda» savoliga ona umumiy javob bergan: yangiliklar, o'yinlar.
  - 5/5 **«Oxirgi marta» savoli voqeani ochdi** — Uch oy oldin ona o'zi uchun go'shtsiz taomlar kitobini olgan. G'oya aytilmagani uchun u maqtamadi — voqeani aytdi.
    · maket: javonda bitta ochilgan kitob, yorliq «3 oy oldin»
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- Sahna yozuvlari (rasm ostida): 1 «Kitob · 2013» · 2 «Birinchi suhbat» · 3 «Maqtov» · 4 «Ikkinchi suhbat» · 5 «3 oy oldin»
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `KitobSahna` holati o'zgaradi: muqova → oshxona (o'g'il planshetni ko'rsatadi) →
  ona pufagi «Ajoyib ekan!» + yorliq «baho» → o'g'il planshetni qo'yadi, javonga ishora qiladi → javondagi kitob ochiladi, «3 oy oldin». Bashoratda tanlangan variant ✓/✗ va `QTaxmin`.
- Xulosa (5/5 dan keyin, ko'prik o'rnida): Kitob nomi shundan: ona ham rostini aytadigan savollar. Maydon intervyusida ham oxirgi voqea so'raladi. (103)
- Tugma (pastki): Keyingi bosqich (N/5) → Davom etish · nuqtalar ustida: Avval shu bosqichni tugating
- O'qituvchi eslatmasi: «rostini aytadi» — kitob nomidan; gap yolg'onda emas: g'oyani eshitgan odam muloyimlik qilib maqtaydi yoki kelajakni taxmin qiladi,
  o'tgan voqeani so'rasangiz — aniqroq javob olasiz (audit 3). Kitobdagi ona — muallif tuzgan misol, real voqea emas; bashoratlardan keyin buni sinfga ayting. Kitobdagi qoidalar real: g'oya o'rniga odamning hayoti,
  kelajak o'rniga o'tgan aniq voqea, kamroq gapirib ko'proq tinglash.
<!-- manba: Rob Fitzpatrick, «The Mom Test: how to talk to customers and learn if your business is a good idea when everyone is lying to you», v1.06 (Launched: August, 2013; Revised: August, 2014), foundercentric.com;
1-bob «The Mom Test», 11–17-betlar: «Your mom will lie to you the most (just 'cuz she loves you)» · «digital cookbooks for the iPad» · onaning javobi «that sounds amazing. And you're right, $40 is a good deal» ·
«nobody (even his mom) buys it» · «What do you usually do on it? … generic question» → «Read the news, play sudoku…» · «What's the last cookbook you did buy for yourself?» → «I bought a vegan cookbook about 3 months ago» ·
«Mom was unable to lie to us because we never talked about our idea» · uch qoida (11–17-betlar) · «questions that even your mom can't lie to you about». Sayt: https://www.momtestbook.com (05.10.2026 ochildi).
«vegan» → «go'shtsiz» (vegan kitob go'shtsiz — gap rost, soddaroq). -->

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`; kitob qoidasi maydon egasiga)
- Eyebrow: Tekshiruv · kitobdagidek
- Savol: **Kitobdagi o'g'ildek, maydon egasiga qaysi savolni berasiz?** (8 so'z)
  - A «Band qilish saytim sizga foydali bo'ladimi?» (43)
  - B «Saytim bo'lsa, unga pul to'lab turarmidingiz?» (45)
  - C «Odatda kim band qilganini qayerga yozasiz?» (41)
  - ✔ D «Kecha kim band qilganini qayerga yozdingiz?» (42)
- To'g'ri izohi: Kitobdagidek: g'oya aytilmadi, kechagi voqea so'raldi.
- Xato izohlari: A — Bu savol g'oyangizga baho so'rayapti. (37) · B — Bu sayt hali yo'q — javobi va'da bo'ladi. (41) · C — «Odatda» savoliga umumiy javob keladi. (38)
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 8 · Shablonni tayyorlash  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Muammongiz bo'yicha kimdan nimani so'raysiz?** (44)
- Kirish qatori (kulrang, bitta; ikki tarmoq bir shaklda):
  - (1-darsda muammo tanlangan bo'lsa — `pm-m7d1-tanlangan`) O'tgan darsda tanlagan muammongiz: «{matn}». Shu bilan davom etasiz yoki ro'yxatingizdan (`pm-m7d1-muammolar`) boshqasini tanlaysiz.
  - (bo'lmasa) Atrofingizdagi bitta muammoni yozing.
- Mentor: Muammoga kim duch kelsa, o'shandan so'raysiz — maydonda bular o'yinchi va maydon egasi edi. Savolda g'oyangiz bo'lmasin.
- Bitta ustun: qadam-chiplari 1/2/3 → forma (har qadamda bitta qator) → Yordam · «Shablonga yozish» o'ngda (187) · ostida shablon kartasi.
- Qadamlar va qatorlar:
  - 1 Muammo — «Qaysi muammo haqida so'raysiz?» (ro'yxatdan bosib tanlash yoki yozish) → karta sarlavha-qatori «Muammo: …»
  - 2 Kimdan so'raysiz — «Bu muammoga kim duch keladi?» → karta sarlavha-qatori «Kimdan so'rayman: …»
  - 3 Birinchi savol — «Oxirgi marta nima bo'lganini qanday so'raysiz?» → «Oxirgi marta nima bo'ldi?» qatori ostida savolingiz (kulrang kursiv)
- Shablonda tayyor turadi (har intervyuda bir xil): «O'shanda nima qildi?» qatori ostida savol «O'shanda nima qildingiz?» · «Nima qiyin bo'ldi?» qatori ostida «Eng qiyini nima bo'ldi?».
- Izoh-qator (`QIzoh`, shablon kartasi ostida; audit 4): Uch savol — boshlash uchun tayanch. Odam qiziq narsa aytsa, o'sha joyni davom ettiring: «Keyin nima bo'ldi?» · «Nega shunday qildingiz?»
- Tekshiruv (`QXato`, ≤60; o'tmasa qator `err` fonda, yozilmaydi):
  - 2-qadamda «hamma», «odamlar», «har kim»: "Hamma" — juda keng. Aynan kim duch keladi? (43)
  - 3-qadamda kelajak yoki shart («bo'lsa», «-armidingiz», «kelasi», «keyingi»): Bu ish hali bo'lmagan — o'tgan kunni so'rang. (45)
  - 3-qadamda g'oya so'zi («sayt», «ilova», «bot», «g'oya»): Savolda g'oyangiz bor — odamning o'zi haqida so'rang. (53)
  - 3-qadamda «shundaymi», «to'g'rimi»: Bunga odam shunchaki «ha» deydi. (32)
  - o'tsa (yashil, bitta qator): Savol o'tgan voqeani so'rayapti — shablonga yozildi. (51)
- Yordam: Savolni «Oxirgi marta … qachon bo'ldi?» yoki «Oxirgi marta … bo'lganda nima bo'ldi?» deb boshlang. Muammoning ikki tomoni bo'lsa, ikkalasidan ham so'rang.
- **Harakat → Vizual o'zgarish:** qatorni yozib «Shablonga yozish» → shablon kartasiga qator kiradi, joriy chip keyingisiga o'tadi; o'tmagan qator `err` fonda va ostida bitta `QXato`.
  3/3 da forma yopiladi, shablon kartasi butun enga (199), har qator yonida ✎ (sichqoncha ustida: Tahrirlash).
- Xulosa: Shablon tayyor: savolingiz g'oyani emas, odamning oxirgi voqeasini so'raydi. (76)
- Tugma (pastki): Uch qadamni yozing (N/3) → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Nishon: **Ready to Ask!**

## 9 · Juftlikda intervyu  ← QMustaqil
- Eyebrow: Juftlikda · mashq intervyu
- Sarlavha: **Sinfdoshingizdan nimani eshitasiz?** (34)
- Mentor (jonli darsda): Avval siz so'raysiz, keyin sherigingiz sizdan so'raydi. Javobni o'sha zahoti, u aytganidek yozing.
- Mentor (mustaqil rejimda): Yoningizdagi bir odamga savollaringizni bering. Javobni o'sha zahoti, u aytganidek yozing.
- Bitta ustun: qadam-chiplari 1/2/3 → forma → Yordam · «Yozuvga qo'shish» o'ngda · ostida 8-ekrandagi shablon kartasi (savollar bilan).
  1-qator «Kim bilan» oldindan yozilgan: jonli — «sinfdosh», mustaqil — «yoningizdagi odam» (✎ bilan o'zgartiriladi).
- Qadamlar (har qadamda tepada savol, ostida bitta qator «U nima dedi?»):
  - 1 Oxirgi marta nima bo'ldi? — savol: {8-ekrandagi birinchi savol}
  - 2 O'shanda nima qildi? — savol: «O'shanda nima qildingiz?»
  - 3 Nima qiyin bo'ldi? — savol: «Eng qiyini nima bo'ldi?»
- Tekshiruv (`QXato`, ≤60):
  - xulosa so'zi («kerak», «hamma», «ko'pchilik», «odatda»): Bu xulosaga o'xshaydi — u aytganidek yozing. (44)
  - qator bo'sh: tugma o'chiq emas, yonida qulf-yorliq: Sinfdoshingiz nima dedi — shuni yozing. (40)
- Yordam: Sinfdoshingizda bu voqea bo'lmagan bo'lsa — shuni yozing: bu ham javob. Kitobdagi yana bir qoida: kamroq gapiring, ko'proq tinglang.
- **Harakat → Vizual o'zgarish:** javobni yozib «Yozuvga qo'shish» → shablon qatoriga eshitgan javob qo'shtirnoqda kiradi, chap chetda yashil chiziq; xulosa so'zi bo'lsa qator `err` fonda.
  3/3 da forma yopiladi, karta ustida yorliq **mashq yozuvi**, karta butun enga, har qator yonida ✎.
- Xulosa: Mashq yozuvi tayyor: har qatorda eshitgan javob, u aytganidek. (62)
- Tugma (pastki): Uch qatorni yozing (N/3) → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- O'qituvchi eslatmasi: juftlikka 6 daqiqa — 3 daqiqa birinchisi so'raydi, 3 daqiqa ikkinchisi. Sherigida voqea bo'lmasa, bu ham yozuv: «muammo unda yo'q» degani.
- Nishon: **Interviewer!**

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish
- Sarlavha: **Yozuvning bo'sh qatorlarini topadigan kod yozamiz.** (50) — PM-082(a) sarlavha oilasi
- Mentor: Uyda besh yozuv yig'asiz — har birida to'rt qator yozilganini endi kod tekshiradi. Yozuvlar Maydon intervyularidan.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **`yozuv.qildi` qiymati `""` bo'lsa, nima bilinadi?** · Odam hech narsa qilmagan · ✔ Bu qator hali yozilmagan · Intervyu umuman bo'lmagan
  - xato 1: Bo'sh qator — odam emas, siz yozmagan joy. (42) · xato 3: Boshqa qatorlar yozilgan — intervyu bo'lgan. (44)
- Chap (vazifa, 3 shart): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ro'yxatda faqat yozilmagan qatorlar nomi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Bitta qatordan boshlang: `yozuv.voqea === ""` bo'lsa, ro'yxatga `"voqea"` ni qo'shing. Ishlagach qolgan ikkitasiga o'ting.
  Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `if` — shart · `push` — ro'yxat oxiriga qo'shadi · `console.log` — qiymatni ekranga chiqaradi.
  Qo'shimcha: `yozuvlar` ga sinfdoshingizdan olgan mashq yozuvini qo'shing va tekshiring.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
  «Kompilyator» ta'riflanmaydi (MATN_ETALONI lug'ati: oyna kompilyator emas).
- Kod:
```js
// Maydon intervyulari — uchta yozuv
const yozuvlar = [
  { kim: "o'yinchi",
    voqea: "O'tgan shanba bordik — maydon band ekan",
    qildi: "Egasiga qo'ng'iroq qildik — ko'tarmadi",
    qiyin: "Yarim soat yo'l yurib keldik — bekorga" },
  { kim: "maydon egasi",
    voqea: "Kecha bir soatga uch kishi qo'ng'iroq qildi",
    qildi: "",
    qiyin: "Kim birinchi qo'ng'iroq qilganini eslay olmadim" },
  { kim: "o'yinchi", voqea: "", qildi: "", qiyin: "" }
];

function yozilmagan(yozuv) {
  // yozilmagan qatorlarning nomini ro'yxatga yig'ing
  return [];   // shu joyni siz yozasiz
}

console.log(yozilmagan(yozuvlar[0]));
// []
console.log(yozilmagan(yozuvlar[1]));
// ["qildi"]
console.log(yozilmagan(yozuvlar[2]));
// ["voqea", "qildi", "qiyin"]
```
- Kod oynasi sarlavhasi: `app.js — yozilmagan funksiyasini yakunlang` · bo'sh fayldagi izoh: `// yozilmagan qatorlar nomini qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: to'liq yozuvga — bo'sh ro'yxat. (59) · 2 — Ro'yxatga faqat qiymati "" bo'lgan qator nomi tushsin. (54) ·
  3 — Uchinchi yozuvda uch qator yozilmagan — uchalasi chiqsin. (57)
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri javob → kod namunasidagi `""` qiymatlar bir lahza ajraladi; kod ishga tushganda Console'da uch ro'yxat chiqadi, shartlar birma-bir ✓.
- Tugma: ✓ Bajardim — kod ishladi · qulf-holat: Avval kod-savolini yeching
- Tugmalar: Orqaga · ① Kod-savolini yeching → ② Kodni yozing → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Nishon: **Record Checker!**

## 11 · 4-savol  ← QTest (✔ B, `correctIdx 1`; yakuniy)
- Eyebrow: Yakuniy tekshiruv
- Iqtibos: O'yinchi: «Juma kuni egasiga uch marta qo'ng'iroq qildim — ko'tarmadi.»
- Savol: **Yozuvga qanday yozasiz?** (3 so'z) — distraktorlar mazmunga yaqinlashtirildi (audit, Qisman)
  - A «O'yinchilar egasiga ko'p qo'ng'iroq qilib, qattiq qiynaladi» (59)
  - ✔ B «Juma kuni egasiga uch marta qo'ng'iroq qildim — ko'tarmadi» (58)
  - C «Egasi juma kunlari telefoniga deyarli qaramasa kerak» (52)
  - D «Egasining o'rniga band qilish sayti kerakligi aytildi» (53)
- To'g'ri izohi: Yozuvga eshitgan javob tushadi — u aytganidek.
- Xato izohlari: A — Siz gapini hammaga yoydingiz — u o'zi haqida gapirdi. (53) · C — Bu sizning taxminingiz — u buni aytmadi. (40) ·
  D — Bu sizning xulosangiz — u sayt haqida gapirmadi. (48)
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 12 · Mustahkamlash  ← QMustaqil (2 qadam; audit: yodlash o'rniga keyingi savol)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Odam qisqa javob bersa, keyin nima so'raysiz?** (45)
- Mentor: Maydon egasi bitta gap bilan javob berdi. Avval {sherigingizga | ovoz chiqarib o'zingizga} keyingi savolni ayting, keyin yozing.
- Vizual: suhbatdosh (maydon egasi) va uning pufagi: «Kecha ko'p qo'ng'iroq bo'ldi.» · ostida shablon kartasi, «O'shanda nima qildi?» qatori joriy (uzuq chiziq).
- Qadamlar 1/2: 1 Sherigingizga ayting | Ovoz chiqarib ayting · 2 Keyingi savolni yozing
  - Mustaqil taymer (30 s): 30 soniyani boshlash · Hozir ovoz chiqarib ayting · To'xtatish · Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Jonli taymer (1 daqiqa): Har biringizga 30 soniyadan — avval A, keyin B. · 1 daqiqani boshlash · Hozir A gapiradi · Hozir B gapiradi · To'xtatish · ↻ Yana 1 daqiqa
- Qator maslahati: O'sha kun haqida nimani so'raysiz?
- Tekshiruv (`QXato`, 8-ekrandagi qoidalar va matnlar): kelajak yoki shart — Bu ish hali bo'lmagan — o'tgan kunni so'rang. · g'oya so'zi — Savolda g'oyangiz bor — odamning o'zi haqida so'rang. ·
  «shundaymi», «to'g'rimi» — Bunga odam shunchaki «ha» deydi. · o'tsa (yashil): Savol o'sha voqeani davom ettiryapti.
- Yordam: O'sha kunni so'rang: «O'shanda nima qildingiz?» yoki «Keyin nima bo'ldi?»
- **Harakat → Vizual o'zgarish:** savolni yozib «Saqlash» → savol o'quvchi pufagi bo'lib chiqadi. O'tsa — egasi davom etadi: «Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim.»,
  javob shablonning «O'shanda nima qildi?» qatoriga qo'shtirnoqda tushadi, chap chetda yashil chiziq. O'tmasa — egasi pufagi ostida kulrang yorliq («va'da» / «javob savolda» / «baho»), bitta `QXato`.
- Xulosa (yozgach): Qisqa javobdan keyin o'sha voqeani davom ettirasiz — yozuvning keyingi qatori shunday yoziladi. (95)
- Tugmalar: Orqaga · Davom etish

## 13 · Natijalar (podium)  ← QNatija
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Egasiga voqea savoli · 2 — Keyingi savol · 3 — Kitobdagidek savol · 4 — Yozuvga tushadigan gap

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (platforma standarti, QOLIP)

| Old tomon | Orqa tomon |
|---|---|
| Intervyu nima? | Bitta odam bilan suhbat |
| Yozuv nima? | To'ldirilgan shablon |
| Shablonda qaysi to'rt qator bor? | Kim bilan · Oxirgi marta nima bo'ldi · O'shanda nima qildi · Nima qiyin bo'ldi |
| Voqea savoli nima? | Bo'lib o'tgan ishni so'ragan savol |
| Bo'sh savol nima? | Javobidan bo'lib o'tgan ish bilinmaydigan savol |
| «Sayt bo'lsa, ishlatarmidingiz?» — nima xato? | Sayt hali yo'q: javobi va'da bo'ladi |
| Muammoni o'rganadigan intervyuda g'oyangizni avval aytasizmi? | Yo'q — avval odamning oxirgi voqeasini so'raysiz |
| Yozuvga nima tushadi? | Eshitgan javob — u aytganidek |
| Nega bitta intervyu yetmaydi? | Bitta yozuv — bitta odamning voqeasi; takrorni ko'rish uchun bir necha odam kerak |
| Maydon muammosi bo'yicha kimdan so'raysiz? | O'yinchidan va maydon egasidan |
| Kitobdagi ona g'oyani nega maqtadi? | O'g'lini xafa qilmaslik uchun — bu baho, voqea emas |
| Muammoni odamlar bilan intervyu orqali o'rganish inglizcha qanday ataladi? | Custdev (customer development) |

- Tugmalar: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · 12/12 karta yodlandi · ↻ Qaytadan takrorlash

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Shablon va mashq yozuvingiz tayyor.** (35)
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): G'oya haqida so'rasangiz baho eshitasiz, oxirgi voqea haqida so'rasangiz — muammoni bilasiz.
- Arena tugmasi: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda mentor boshlamaguncha) Mentorni kuting
- Endi siz bilasiz:
  - Bitta odam bilan suhbat — intervyu, to'ldirilgan shablon — yozuv.
  - Muammoni o'rganadigan intervyuda avval g'oyangiz emas, odamning oxirgi voqeasi so'raladi.
  - Shablonda to'rt qator bor: kim bilan, oxirgi marta nima bo'ldi, o'shanda nima qildi, nima qiyin bo'ldi.
  - Yozuvga eshitgan javob tushadi — u aytganidek.
- Nishonlaringiz — n/4 (mentor rejimida yo'q)
- Uyga vazifa (`HwCard`; sarlavha «Uyda nima qilasiz?», P-025):
  - Karta: Kimdan: muammongizga duch keladigan odamlardan · Nechta: 5 ta intervyu · Muddat: keyingi darsgacha
  - Qadamlar (raqam-doirali):
    1. Muammongizga duch keladigan besh odamni toping; muammoning ikki tomoni bo'lsa — ikkalasidan ham.
    2. Har biriga shablondagi savollarni bering, g'oyangizni aytmang.
    3. Javobni o'sha zahoti, u aytganidek yozing: har intervyu — bitta yozuv.
    4. Besh yozuvni keyingi darsga olib keling.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — **«Besh suhbatdan qaysi muammo chiqdi?»** Besh yozuvingizdagi takrorlardan bitta muammoni tanlaysiz.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **First Record!** (4-ekran, uchala qadamda birinchi bosishda voqea savoli) — O'yinchi bilan suhbatda shablonning uch qatorini birinchi urinishda to'ldirdingiz
- **Ready to Ask!** (8-ekran) — Muammongiz uchun shablonni tayyorladingiz
- **Interviewer!** (9-ekran) — Sinfdoshingizdan intervyu olib, mashq yozuvini to'ldirdingiz
- **Record Checker!** (10-ekran) — Yozuvning yozilmagan qatorlarini kod bilan topdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · bosib davom eting · Nishonlar — n/4

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
1. (3-ekran) **Voqea savoli va bo'sh savol**
   1. Voqea savoli — Bo'lib o'tgan ishni so'ragan savol — **voqea savoli**. Javobida kun va qilingan ish bo'ladi.
   2. G'oya haqidagi savol — Sayt hali yo'q: «ishlatarmidingiz?» savoliga javob **va'da** bo'ladi.
   3. Javob savolda — «…, shundaymi?» savoliga odam shunchaki **«ha»** deydi.
   - Sinfga savol: Maydon egasidan kechagi kun haqida nimani so'rardingiz?
2. (5-ekran) **Voqeani davom ettiring**
   1. Keyingi savol — Odam voqeani aytdi: endi **«O'shanda nima qildingiz?»** deb so'raysiz.
   2. Keyingi qator — Har voqea savoli shablonning **keyingi qatorini** to'ldiradi.
   3. Chiqib ketish — «Keyingi safar…» savoli gapni **kelajakka** olib ketadi — qator yozilmaydi.
   - Sinfga savol: O'yinchi «maydon band ekan» dedi. Keyin nimani so'raysiz?
3. (7-ekran) **Onangiz ham rostini aytadi**
   1. Birinchi suhbat — G'oyani eshitgan ona o'g'lini xafa qilmaslik uchun **maqtadi**.
   2. Ikkinchi suhbat — G'oya aytilmadi: ona **oxirgi marta** nima bo'lganini aytdi.
   3. «Odatda» savoli — Unga **umumiy javob** keladi, «oxirgi marta» savoliga esa voqea.
   - Sinfga savol: Do'stingiz g'oyangizni maqtasa, bundan nima bilinadi?
4. (11-ekran) **Yozuvga nima tushadi**
   1. Eshitgan javob — Yozuvga **eshitgan javob** tushadi — u aytganidek.
   2. Xulosa va taxmin — Sizning **xulosangiz** ham, taxminingiz ham yozuvga tushmaydi.
   3. Bitta odam — Bitta odamning gapi **hammaga yoyilmaydi**: u o'zi haqida gapirdi.
   - Sinfga savol: Sinfdoshingizning javobini u aytganidek ayta olasizmi?

## Jonli viktorina (12 savol; ✔ o'rni A/B/C/D — har biri 3 marta)
1. Intervyu nima?
   - ✔ A — Bitta odam bilan suhbat
   - B — Ko'p odamga bitta e'lon
   - C — Sinfga g'oyani aytish
   - D — Odamni jim kuzatib turish
2. Yozuv nima?
   - A — Intervyu savollari ro'yxati
   - ✔ B — To'ldirilgan shablon
   - C — Intervyudan chiqqan xulosa
   - D — G'oyangiz haqidagi matn
3. «Sayt bo'lsa, ishlatarmidingiz?» — bu qanday savol?
   - A — Voqea savoli — maydonni so'radi
   - B — Voqea savoli — javobi qisqa
   - ✔ C — Bo'sh savol — javobi va'da
   - D — Bo'sh savol — savoli qisqa
4. «Oxirgi marta maydonga qachon bordingiz?» — bu qanday savol?
   - A — Bo'sh savol — kelajakni so'radi
   - B — Bo'sh savol — javobi «ha» bo'ladi
   - C — Voqea savoli — g'oyani so'radi
   - ✔ D — Voqea savoli — o'tgan kunni so'radi
5. Shablondagi to'rt qatordan biri qaysi?
   - A — Sayt sizga yoqdimi?
   - ✔ B — Nima qiyin bo'ldi?
   - C — Kelasi safar nima qilasiz?
   - D — Narxi qancha bo'lsin?
6. O'yinchi: «Maydon band ekan». Keyingi savol qaysi?
   - ✔ A — O'shanda nima qildingiz?
   - B — Sayt bo'lsa, band qilasizmi?
   - C — Maydon ko'p band bo'ladimi?
   - D — Keyin qachon borasiz?
7. Yozuvga qaysi gap tushadi?
   - A — Intervyudan siz chiqargan xulosa
   - B — Odam haqida sizning taxminingiz
   - C — Hammaga taalluqli umumiy gap
   - ✔ D — Eshitgan javob, u aytganidek
8. Kitobdagi ona g'oyani nega maqtadi?
   - A — U shunday ilovani qidirgan edi
   - B — Planshetda ko'p o'tirardi
   - ✔ C — O'g'lini xafa qilmaslik uchun
   - D — Taomlar kitobi unga kerak edi
9. Kitobda qaysi savol ko'proq narsa ochdi?
   - A — «Taomlar ilovasi sizga kerak bo'ladimi?»
   - B — «Planshetda odatda nima qilasiz?»
   - C — «Shunday ilovani sotib olarmidingiz?»
   - ✔ D — «Oxirgi marta qaysi kitobni oldingiz?»
10. Kitob nomi nimani anglatadi?
    - ✔ A — Onangiz ham rostini aytadigan savollar
    - B — Faqat onangizga beriladigan savollar
    - C — Onangizga g'oyani aytib ko'rish usuli
    - D — Onangiz bilan maslahatlashish qoidasi
11. Maydon muammosi bo'yicha kimdan intervyu olasiz?
    - A — Futbol o'ynamaydigan qo'shnidan
    - B — Sayt yasay oladigan do'stdan
    - ✔ C — O'yinchidan va maydon egasidan
    - D — G'oyani maqtaydigan sinfdoshdan
12. Nega bitta intervyu yetmaydi?
    - A — Bitta odam ko'p gapira olmaydi
    - ✔ B — Bitta yozuv — bitta odamning voqeasi
    - C — Shablonda to'rtta qator bor xolos
    - D — Ko'p odam maqtasa, g'oya to'g'ri
- ✔ taqsimoti: A — 1, 6, 10 · B — 2, 5, 12 · C — 3, 8, 11 · D — 4, 7, 9.
- Kalit ibora to'g'ri javoblarda takrorlanmaydi (§138 C): «voqea» 3A/3B/4C distraktorlarida ham bor, «u aytganidek» faqat 7-savolda.
- Arena yozuvlari — umumiy shablon (Testni boshlash · Mentor testni boshlashini kuting… · Savol n/12 · Adashdingiz — 0 ball. Keyingisida olasiz. · Test yakunlandi! · jadval: TOP-5).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — intervyu · yozuv · savol · voqea · shablon · maydon · odam (+ 🎙️ ✅ — o'yin qatlami) ·
  uyga vazifa banneri — intervyu · yozuv · savol · odam (faqat so'z).

---

## B. KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`)
1. Yangi fayl `src/7-Modull/PmFiveInterviewsLesson.jsx` skeletdan; App.jsx `m7-02` qatoriga `comp: PmFiveInterviewsLesson` («qur» bosqichida, qaror 6) — nom va `sub` o'zgarmaydi (DE-205).
2. Qolip: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` ·
   s8/s9/s12 `QMustaqil` · s10 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')` (q13–q21).
3. `SHABLON` — bitta manba (180): 4 qator `{ kalit: 'kim'|'voqea'|'qildi'|'qiyin', nom, savol }`; `SuhbatShablon` vizuali (suhbatdosh silueti + pufak + yorliq · shablon kartasi + qator holatlari ·
   «n / 5» izlari) — 0, 1, 2, 4, 8, 9, 12-ekranlar shundan. s10 kod yozuvlari ham shu kalitlar bilan. `reduced-motion` — o'tishsiz.
4. s2 — `S2_SAVOLLAR` (6: matn, javob, tur `voqea|vada|savolda|baho`); bashorat 2/3/4; saralash; 6/6 da tomon nomlari; `QXato` matnlari turga qarab.
5. s4 — `S4_QADAMLAR` (3 × 2 savol, ✔ o'rni 2/1/2); bo'sh savol bosilsa tugma o'chadi; 3/3 da `QIzoh` atama-qatori va «1 / 5»; 42 s ipucha; nishon `firstRecord`.
6. s6 — `KitobSahna` maketi (muqova → oshxona → pufak → javon), `MOM_SLIDES` 5 ta, 2 bashorat, `QTaxmin`, 4/5 dan keyin `QIzoh`; yorliq «The Mom Test · N/5»; manba izohi faylda ham.
7. s8 — o'qiydi: `pm-m7d1-tanlangan` (`{ matn, kim }`, tanlangan holda) va `pm-m7d1-muammolar` (ro'yxat); yo'q bo'lsa erkin qator; tekshiruv `RegExp` lari (kelajak, g'oya so'zi, «shundaymi», «hamma»); natija saqlanadi
   `pm-m7d2-shablon` = `{ muammo, kimdan, savol1 }` — s9, uyga vazifa va 3-dars uchun (tayanch 6-bo'lim).
8. s9 — jonli/mustaqil ikki Mentor matni; 1-qator «Kim bilan» standart qiymati rejimga qarab; xulosa-so'z tekshiruvi; mashq yozuvi `pm-m7d2-mashq` = `{ kim, voqea, qildi, qiyin }`.
9. s10 — `KOD_TASK`: starter (yuqoridagi kod), `yozilmagan` funksiyasi, 3 `evalEquals` (`yozilmagan(yozuvlar[0])` → `[]` · `[1]` → `["qildi"]` · `[2]` → `["voqea","qildi","qiyin"]`);
   darvoza-mashq 3 variant; `HtmlCompiler` `app.js`. Satrlar qo'shtirnoqda (apostrof — §135 D).
10. s12 — `PairTimer` (▶ ⏹ belgisiz); savol tekshiruvi s8 `RegExp` lari bilan; o'tsa egasi javobi «O'shanda nima qildi?» qatoriga tushadi.
11. Testlar s3/s5/s7/s11 — `correctIdx` 2/0/3/1, `INLINE_KEYS` shu bilan; `RECAPS` 3/5/7/11 (`ask` + 3 karta, raqam 1/2/3); `Q_LABELS`.
12. s14 `FLASHCARDS` (12); s15 `RECAP` 4 qator, `HW_STEPS` 4 qadam, «Keyingi dars — …», asosiy fikr.
13. Uyga vazifa `HwCard` — yangi dars, `*.homework.jsx` hali yo'q (PM-027 mavjud fayllarga tegishli) — kim yozishi TAYANCHGA SAVOL 3.
14. Arena `QUIZ_BANK` 12 savol (✔ yuqoridagidek), fon so'zlari {uz, ru}. `ACHIEVEMENTS` 4 ta.
15. **REPO — yo'q** (PM darsi; `maydon` repo 4-darsdan, `dars-04-done`).
- Darvozalar: `npm run gates -- src/7-Modull/PmFiveInterviewsLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL
1. ~~1-darsdagi ro'yxat kaliti~~ — **yopildi** (audit, GATE M M-q5): s8 `pm-m7d1-tanlangan` dan boshlanadi, ro'yxat `pm-m7d1-muammolar`; yo'q bo'lsa erkin qator (tayanch 6-bo'lim).
2. ~~Mentor misolidagi yozuvlar~~ — **yopildi** (GATE M K4): 3-darsdagi besh yozuv — besh o'yinchi; maydon egasi suhbati — savol namunasi. Tarix: Men yozdim: o'yinchi — «O'tgan shanba sinfdoshlar bilan bordik — maydon band ekan» · «Egasiga qo'ng'iroq qildik — ko'tarmadi. Hovlida o'ynadik» ·
   «Yarim soat yo'l yurib keldik — bekorga» (tayanchdagi «band edi» va «egasi telefonni ko'tarmadi» ga mos); maydon egasi — «Kecha bir soatga uch kishi qo'ng'iroq qildi» ·
   «Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim» · «Kim birinchi qo'ng'iroq qilganini eslay olmadim» (tayanchda egasi tomoni yo'q — o'zim qaror qildim).
   Tayanchdagi besh natija o'yinchi tilida («kelganimizda») — besh kishining hammasi o'yinchimi? Bu dars «ikki tomondan so'rang» deydi; 3-dars beshligida maydon egasi bo'lsa, natijalar bilan mos kelishi kerak.
3. **Uyga vazifa (`HwCard`) — yangi PM dars uchun homework faylini kim yozadi?** PM-027 mavjud fayllarni himoya qiladi; yangi darsda matn shu MD dan olinsinmi?
4. **Keys — kitobdagi misol (muallif tuzgan ona), real kompaniya voqeasi emas.** Manba kitobning o'zi (v1.06, 2013), lekin «Biznes olamidan» freymida bunday misol mosmi?
   Muqobil — real kompaniya voqeasi; Airbnb 7-Modul darsida (`m5-08`) allaqachon bor, takror bo'lardi.
5. **Besh real yozuv qayerga yoziladi va 3-darsga qanday yetadi?** (qisman yopildi: 2-dars `pm-m7d2-shablon`, `pm-m7d2-mashq` yozadi; besh real yozuv — 3-dars 8-ekranida qo'lda kiritiladi, 3-dars navbatida) Uyga vazifa «keyingi darsga olib keling» deydi; qog'ozdami, telefondami yoki dars sahifasidami — 3-dars MD si bilan kelishish kerak
   (9-ekrandagi mashq yozuvi va 8-ekrandagi shablon saqlash kaliti ham shu savolga bog'liq).

## Shubhali joylar
- 0-ekran Mentorida muammoning ikkinchi yarmi («bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak») qisqalik uchun olindi — u 2-ekranda (3-savol) va 4-ekranda ochiladi.
- 6-ekranda «go'shtsiz taomlar kitobi» — kitobda «vegan cookbook»; «go'shtsiz» rost, lekin to'liq ma'nosi emas.
- 6-ekran 3/5 kartasi ~120 belgi — boshqa kartalardan uzunroq.
- 9-ekran — darsdagi yagona real odam bilan ish; mustaqil rejimda (o'quvchi yolg'iz) «yoningizdagi odam» bo'lmasligi mumkin — bajarib bo'lmaydigan qadam (P-028) xavfi; zaxira kerakmi?
- 11-ekranda to'g'ri javob — iqtibosning aynan o'zi (`m5-08` 11-ekrani ham shunday); qoida shu bo'lgani uchun qoldirdim.
- Arena 5-savol («Shablondagi to'rt qatordan biri qaysi?») — eslash savoli, distraktorlar bo'sh savollar; juda oson bo'lishi mumkin.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): `m7-01` «Loyihangiz kimga kerak?» → **`m7-02` «Besh odamdan nimani bilib olasiz?»** → `m7-03` «Besh suhbatdan qaysi muammo chiqdi?» — App.jsx 308–310-qatorlar bilan mos.
- [x] Bitta misol-ip: «Maydon» (o'yinchi + maydon egasi) — 0, 1, 2, 3, 4, 5, 7, 10, 11; metafora yo'q; bitta vizual `SuhbatShablon`. Kitob voqeasi — freymlangan keys (91b), xulosasi Maydonga qaytadi.
  O'quvchining o'z muammosi — 8, 9 (P-004 shaxsiy ip).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha) + 0, 6, 8, 9, 10, 12. Matn-karta yo'q.
- [x] O'lchov (skript bilan sanaldi): sarlavha 32–52 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 62–103 · hook javobi 111 · xato izohi 32–59.
- [x] Atamalar `m5-08` YAKUNIY bilan bir xil (voqea savoli, bo'sh savol, va'da, eshitgan javob — u aytganidek, o'sha zahoti); tayanch atamalari (intervyu, yozuv, band, maydon egasi) aynan;
  inglizcha nom — bir marta (14-ekran, qavs bilan); siz-forma; tugmalar ot-shaklda.
- [x] Testlar: s3 42/41/42/44 · s5 42/41/44/41 · s7 43/45/41/42 (C va D farqi — faqat «odatda» ↔ «kecha», kitob qoidasi) · s11 49/48/49/43 — to'g'ri javob eng uzun emas; «kecha» faqat to'g'rida emas (s3 D); ✔ o'rni C/A/D/B; arena 3/3/3/3.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno); kafolat so'zlari yo'q («har doim», «100%», «darrov», «albatta» — Mentor va variantlarda yo'q).
- [x] Ichki kodlar yo'q (o'quvchi matnida «7-Modul», «m5-08» yo'q — «Botingizni ishlatgan odamdan…» darsi mazmuni bilan eslatiladi); keys fakti — manba bilan (izohda);
  «KOD» ro'yxati 15 qator, REPO 0.
- [x] Karta T · P · S · PM: T-011/PM-030 (atama misoldan keyin, 4-ekran) · T-014/015 («maydon» bir ma'noda, forma joyi «qator»; «band» faqat egallangan) · T-042 (intervyu/yozuv ta'rifi bir xil) ·
  T-052 (suhbat → intervyu bir gapda) · T-039 (sayt «sizniki» deyilmaydi — «sayt g'oyasi») · P-013 (asosiy fikr) · P-015 (reja bosilmaydi, kashfiyotni aytmaydi) · P-025 (uyga vazifa karta + 4 qadam, yakunda o'sha) ·
  P-056 («1 / 5») · P-062 (son bir marta) · P-064/S-015 (bashorat zinapoya, 2 va 6) · S-004 (har distraktor dars qoidasi bo'yicha xato) · S-018 (kitob izohi Mentorda, birinchi ko'rinishda) ·
  S-026 (recap raqam) · PM-028/029 (keys qolipi, chizilgan maket) · PM-082 (kod ekrani darvozasi) · J-026 (hook maqtovsiz).
- [ ] Ochiq: TAYANCHGA SAVOL 5 (besh real yozuv — 3-dars navbatida); 9-ekran mustaqil rejim zaxirasi.

---

# 9-Modul · 3-dars (PM) «Besh suhbatdan qaysi muammo chiqdi?» — MD v3

Fayl: `src/7-Modull/PmInterviewMvpLesson.jsx` · kalit `m7-03` · 17 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Oldingi dars: 2 «Besh odamdan nimani bilib olasiz?» · keyingi: 4 «Mini-MVP arxitekturasi» (App.jsx 7-blok). Menyu nomi = `lessonTitle` = «Besh suhbatdan qaysi muammo chiqdi?» (205).
Dars yo'q — hamma ekran noldan. Tashqi audit (ChatGPT) Filtri: `03-FILTR.md` — 05.10.2026 qo'llandi (03-q0 A).
Fidbek: qator yoniga `>> …`. Tasdiqlangach (GATE M) dars shu holatda quriladi.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: s3 = B, s5 = D, s7 = A, s12 = C (`INLINE_KEYS { s3: 1, s5: 3, s7: 0, s12: 2 }`);
arena kaliti 0,2,1,3 · 1,0,3,2 · 3,1,2,0 (A/B/C/D har biri 3 marta).

---

## A. Darsning tayanchi

1. **Dars turi (PM-005):** 2-tur, sof PM — artefakt yozma: bitta muammo gapi + uch quti ro'yxati (USTAXONA: 8 va 10-ekran). Kod ekrani (11) — 1-tur qismi (87): shikoyatlarni sanaydigan kod.
2. **Dars natijasi (00-MODUL-TAYANCH 4-bo'lim):** o'quvchining besh yozuvidan 1 muammo gapi + «Qilamiz / Keyin / Qilmaymiz» ro'yxati.
3. **Boshlanishi (qaror 7):** dars uyga vazifadagi besh intervyu yozuvi bilan ochiladi. 0–7 va 9-ekranda — Mentor misoli «Maydon» yozuvlari; 8, 10, 13-ekranda — o'quvchining
   o'z yozuvlari (yo'q bo'lsa — sinfdoshining yozuvlari). Real odam bilan yangi ish bu darsda yo'q.
4. **Avval misol, keyin nom (PM-107):** «muammo gapi» nomi 4-ekranda, ikki shikoyat birlashib karta o'zi yozilgandan keyin bir marta beriladi; «MVP» yangi atama emas —
   9-ekranda «Dekompozitsiya» darsidagi ta'rif so'zma-so'z qaytariladi (T-052).
5. **Asosiy ko'nikma:** bir kishi aytgani emas — ko'p yozuvda chiqqan shikoyat kuchli belgi (keyin og'irligi ham qaraladi: «bir soat kutdik, uyga qaytdik»; audit 1); uni bitta gapga aylantirish; imkoniyatlarni ikki savol bilan uch qutiga ajratish.
6. **Bugungi asosiy fikr (P-013, yakunda va 13-ekran xulosasida so'zma-so'z):** Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi.
7. **Matn o'lchovi (162/164, MK §218/219/225):** sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
8. **Toza yuza (D4):** tugma, variant, natija qatorida emoji yo'q; ✓ ✗ → ▸ — belgilar. O'yin qatlami (arena, nishon medali, podium) mustasno.

### Atamalar (bir ma'no — bir so'z; grep: 5 va 6-Modul YAKUNIY, `src/2-Modull/PmLesson5.jsx`, `src/3-Modull/PmLesson8.jsx`, `src/pm/PmUserStoryLesson.jsx`)

| So'z | Ma'nosi (darsda) | Qayerdan · ishlatilmaydi |
|---|---|---|
| intervyu | bitta odam bilan suhbat | tayanch; sarlavhadagi «suhbat» 2-ekranda tenglashtiriladi: «Har intervyu — bitta odam bilan suhbat» (T-052) · inglizcha atama yo'q |
| yozuv | bitta intervyuning shablonga yozilgani | tayanch, 2-dars · «varaq», «hisobot» yo'q |
| shikoyat | yozuvda odam aytgan, nimasi noqulay bo'lgani (u aytganidek) | 5-Modul 9-dars (§221 «shikoyatni emas, nimani berasiz?») · TAYANCHGA SAVOL 8 |
| muammo | ko'p odamda bor qiyinchilik; ikki shikoyat bitta asosiy qiyinchilikni ko'rsatsa — bitta muammo | 1-dars · «og'riq», «dard» yo'q |
| muammo gapi | kim, qachon va nimadan qiynalishini aytadigan bitta gap (2-Modul qolipi); unda yechim yo'q | faqat shu dars (12-dars pitchi o'qishi mumkin) |
| sanoq · nechta yozuvda | shikoyat chiqqan yozuvlar soni, «4 / 5» | m5-09 «nechta odam aytgan», m3-05 «nechta odam so'raydi» · **«takror» ishlatilmaydi** — «Takrorlash» (kartochkalar) va «Qisqa takrorlash» bilan to'qnashadi (T-015) |
| imkoniyat | mahsulot qila oladigan bitta ish (feature) | m2-07 «Oltala imkoniyat», LUG'AT «feature → imkoniyat» · «funksiya» yo'q (JS funksiyasi bilan to'qnashadi, T-015) |
| MVP | mahsulotning ish beradigan eng sodda birinchi versiyasi | m2-07, so'zma-so'z · yangi atama emas |
| «Qilamiz» · «Keyin» · «Qilmaymiz» | uch quti nomi (dastur, App.jsx `sub`) | «Keyin» = m2-07 «keyinga qoldirilganlar» (backlog): o'chirilmaydi, navbati suriladi · ravish «keyin» quti yonida ishlatilmaydi — «so'ng» |
| doska | darsning bitta vizuali (pastda) | LUG'AT («matritsa → doska») |
| o'yinchi · maydon egasi | «Maydon»ning ikki foydalanuvchisi | tayanch · «mijoz», «admin» yo'q |
| vaqt katagi · band qilish | bitta soatlik oraliq · katakni egallash | tayanch («ishlatilmaydi» ustuni) |

Bir so'z — bir ma'no ogohlantirishlari (T-015): «maydon» faqat futbol maydoni («forma maydoni» deyilmaydi — «katak», «qator»); «izoh» faqat Instagram'dagi izoh (izoh-tushuntirish o'quvchi matnida yo'q); «baho» faqat «Maydonga baho» imkoniyati.

### Misol-ip — «Maydon» (00-MODUL-TAYANCH 1-bo'lim, aynan)

- Mahsulot: mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. Odamlar ismsiz: o'yinchi · maydon egasi.
- Besh intervyu natijasi: 5 kishidan 4 tasi — «maydon band edi»; 3 tasi — «egasi telefonni ko'tarmadi»; 2 tasi — «jamoaga odam yetmadi»; 1 tasi — «pulni bo'lishish qiyin».
- Tanlangan muammo — darsdagi muammo gapi (GATE M 03-q0; qolip — 2-Modul «Kim, qayerda, nimadan qiynaldi?»: kim · qachon · nimadan qiynaladi; butun dars bo'yi bitta manba `MUAMMO_GAP`):
  **«O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»** · dalil «5 yozuvdan 4 tasida». Band qilishga dalil: 1, 2, 4-yozuvda o'yinchi kelishdan oldin egasiga qo'ng'iroq qilgan.
- MVP chegarasi: **Qilamiz** — kun bo'yicha vaqt kataklari · katakni band qilish · egasi uchun bandlar ro'yxati; **Keyin** — to'lov · jamoa yig'ish · vaqt bo'shasa — eslatma;
  **Qilmaymiz** — maydonga baho · o'yinchilar chati.
- Ikkinchi olam faqat test bandida (P-002): maktab oshxonasi (5-ekran, arena 1).

**Besh yozuv** (bitta manba `YOZUVLAR`; taqsimot — TAYANCHGA SAVOL 1; olam ichidagi gap, T-008):

| Yozuv | Odam aytgani (u aytganidek) | Shikoyatlar |
|---|---|---|
| 1-yozuv · o'yinchi | «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» | band · telefon |
| 2-yozuv · o'yinchi | «Shanba kuni bordik, maydon band ekan. Egasiga ikki marta qo'ng'iroq qildim — telefonni ko'tarmadi.» | band · telefon |
| 3-yozuv · o'yinchi | «Kecha kechqurun keldik, maydon band edi. Bir soat kutdik, so'ng uyga qaytdik.» | band |
| 4-yozuv · o'yinchi | «Yakshanba maydon band edi, egasi telefonni ko'tarmadi. Ertasiga keldik — endi jamoaga odam yetmadi.» | band · telefon · jamoa |
| 5-yozuv · o'yinchi | «**Eng yomoni — pulni bo'lishish!** Har safar kimdir "keyin beraman" deydi. Jamoaga odam ham yetmadi: guruhda yozdik, ikki kishi kelmadi.» | jamoa · pul |

Sanoq: band 4/5 · telefon 3/5 · jamoa 2/5 · pul 1/5 (tayanch bilan aynan). «Band» va «telefon» birga — 1, 2, 3, 4-yozuv = 4/5.

---

## Darsning ipi va bitta vizual

- **Hook:** besh yozuvdan biri juda qattiq yozilgan (pul) → «qaysi muammoni birinchi hal qilardingiz?» → yozuvning o'zi sanoqni aytmaydi.
- **Doska (`SanoqDoska`, dars bo'yi; bitta manba — `YOZUVLAR`, `SHIKOYATLAR`, `MUAMMO_GAP`, `IMKONIYATLAR`, 180):** oq karta, tepada kichik yorliq «"Maydon" · besh yozuv». Uch qavat:
  1. **Yozuvlar qatori** — besh kichik yorliq «1 · 2 · 3 · 4 · 5» (ochilmagan — kulrang, ochilgan — accent chegara).
  2. **Shikoyatlar** — har qatorda shikoyat (qo'shtirnoqda) + besh nuqta (qaysi yozuvlarda bor — bo'yaladi) + son «n / 5»; qatorlar son bo'yicha saralanadi.
     4-ekrandan tepada **muammo kartasi** (accent chegara): uch bo'lak — kulrang yorliqlar «kim» · «qachon» · «nimadan qiynaladi» — va «5 yozuvdan 4 tasida».
  3. **Uch quti** — «Qilamiz · Keyin · Qilmaymiz», bo'sh joy uzuq chiziqli (U-041), har qutida «N ta».
  Holatlar: kulrang «hali ochilmagan» · accent «hozir» · yashil ✓ «o'z joyida» · qizil chiziq bir lahza «boshqa qutiga». Yangi qator yoki karta bir lahza ajralib kiradi;
  `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Doska ⛶ ichida kattalashadi (`zoom`, q17).
- **Qayerda:** 0 (besh yozuv, «? / 5») · 1 (bo'sh shakl) · 2 (shikoyatlar tushadi) · 4 (ikki qator birlashadi, muammo kartasi) · 8 (o'quvchining doskasi) · 9 (imkoniyatlar qutilarga) ·
  10 (o'quvchining uch qutisi) · 11 (terminal — doskaning kod ko'rinishi) · 13 (muammo kartasi). 6-ekran (Burbn) — o'z sahnasi (telefon maketi), doska yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Qaysi muammoni birinchi hal qilardingiz?** (40)
- Mentor: «Maydon» uchun besh o'yinchi bilan intervyu qilindi — yozuvlar shu yerda. Uyga vazifadagi o'z yozuvlaringiz ham bugun kerak bo'ladi. (2 gap)
- Maket (chap): doskaning yozuvlar qavati — besh yozuv-kartasi (A-bo'lim jadvali), 5-yozuv boshqalardan uzun, birinchi gapi qalin. Kartalar o'qiladi, bosilmaydi.
- Variantlar (radio, teng uzunlikda):
  - Eng qattiq aytilganini — odam juda qiynalgan (44)
  - Eng ko'p aytilganini — ko'p odam qiynalgan (42)
- Javob (ikkalasida bir xil — sof so'rovnoma: «Aynan!/Qiziq fikr!» yo'q, P-016, J-026):
  Ikkalasining ham sababi bor. Lekin yozuvning o'zi buni aytmaydi — avval har shikoyat nechta yozuvda borligini sanaymiz. (119)
- **Harakat → Vizual o'zgarish:** variantni tanlash → har kartadagi shikoyat ostiga kulrang chiziq tushadi va yonida «? / 5» belgisi ochiladi — sanoq hali yo'q.
- Jonli darsda: sinf ovozlari — har variant va foizi.
- Tugma (pastki): Bittasini tanlang → Davom etish
- MentorNote: Uyga vazifani qilmagan o'quvchilarga ayting: mustaqil ishda sinfdoshining yozuvlari bilan ishlaydi. Hook'da to'g'ri javob yo'q — ikkala tanlovni ham qo'llang.

## 1 · Maqsad  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun yozuvlardan muammo va MVP ro'yxatini tuzasiz** (50)
- Mentor: Besh yozuvda gap ko'p, lekin birinchi versiya bitta muammoni hal qiladi. (72)
- Chap yorliq: Dars oxirida o'z g'oyangiz uchun shu doskani to'ldirasiz
- Chap: doskaning bo'sh shakli — tepada bo'sh muammo qatori «? / 5», pastda uch quti «Qilamiz · Keyin · Qilmaymiz»; kataklar ichida kulrang skelet-chiziqlar navbat bilan paydo bo'ladi (matnsiz — 4 va 9-ekran kashfiyotini ochmaydi, P-015).
- O'ng yorliq: Bugungi 4 qadam
- Qadamlar (01 · matn · teg; bosilmaydi):
  - 01 · Besh yozuvdagi shikoyatlarni sanaysiz · `sanoq`
  - 02 · Eng ko'p chiqqanini bitta gapga yozasiz · `muammo`
  - 03 · Imkoniyatlarni uch qutiga ajratasiz · `MVP`
  - 04 · Shikoyatlarni kod bilan sanaysiz · `kod`
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Besh yozuv  ← QTushuncha
- Eyebrow: Tushuncha · sanoq
- Sarlavha: **Bitta shikoyat nechta yozuvda chiqadi?** (38)
- Mentor: Har intervyu — bitta odam bilan suhbat. Yozuvlarni birma-bir oching va doskaga qarang. (2 gap)
- Bashorat (ballsiz, `QBashorat`, yozuv ochilishidan oldin; yorliq «Avval o'zingiz belgilab ko'ring»):
  **Pul haqidagi qattiq gap nechta yozuvda chiqadi?** — Bittasida · Ikki-uchtasida · To'rt-beshtasida (bitta o'lchov, o'sish tartibida, S-015)
- Harakat paneli: besh yozuv-kartasi, har birida «Ochish».
- Vizual: doska — yozuvlar qatori kulrang, shikoyatlar qavati bo'sh.
- **Harakat → Vizual o'zgarish:** «Ochish» → karta matni ochiladi, undagi shikoyatlar doskaga uchadi:
  - doskada shunday qator bo'lsa — o'sha qatorda navbatdagi nuqta bo'yaladi, son o'sadi («2 / 5»);
  - yangi shikoyat bo'lsa — yangi qator paydo bo'ladi;
  - qatorlar son bo'yicha o'zi saralanadi; yozuvlar qatorida ochilgan raqam accent bo'ladi.
- Natija qatori (`QTaxmin`, 5/5 dan keyin): «Taxminingiz: … · haqiqatda: bittasida» yoki «Taxminingiz to'g'ri chiqdi».
- Natija (tugadi): panel yopiladi, doska butun enga — «Maydon band edi» 4 / 5 · «Egasi telefonni ko'tarmadi» 3 / 5 · «Jamoaga odam yetmadi» 2 / 5 · «Pulni bo'lishish qiyin» 1 / 5.
- Xulosa: Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz. (109) — yakundagi «Endi siz bilasiz» 1-band bilan so'zma-so'z
- Tugma (pastki): Yozuvlarni oching (N/5) → Davom etish
- MentorNote: Sinfdan so'rang: «Qaysi yozuvni ochganda doska eng ko'p o'zgardi?» Javob — yangi qator chiqqanda emas, bor qatorga nuqta qo'shilganda.

## 3 · 1-savol  ← QTest (✔ B)
- Eyebrow: Tekshiruv · bitta yozuv
- Savol: **Bir o'yinchi qattiq shikoyat qildi — bu nima degani?** (52)
  - A · Bu maydonning eng katta muammosi ekan (37)
  - B ✔ Bu hozircha faqat shu odamning gapi (35)
  - C · Boshqa o'yinchilar ham shunday o'ylaydi (39)
  - D · Sayt aynan shu shikoyatdan boshlanadi (37)
- To'g'ri izohi: Qattiq gap ham bitta yozuvda chiqsa, bir odamniki bo'lib qoladi. (64)
- Xato izohlari:
  - A: Qattiq aytilgani — ko'p odamda borligi emas. (44)
  - C: Boshqalar nima degani — ularning yozuvlarida. (45)
  - D: Bitta gapdan boshlansa, qolgan to'rt kishi-chi? (47)
  - (umumiy): Doskani eslang: qattiq gap nechta yozuvda chiqdi? (49)
- Yozuvlar, jonli rejim, tugmalar — platforma standarti (`QTest`, DE-203).

## 4 · Ikki shikoyat — bitta muammo  ← QTushuncha
- Eyebrow: Tushuncha · muammo gapi
- Sarlavha: **Ikki shikoyat ortida qanday bitta muammo bor?** (45)
- Mentor: Ikki qatorni bosib, har biri nega bo'lganini o'qing. (52)
- Vizual: 2-ekran natijasidagi doska; ikki tepa qator accent chegarada, qolgan ikkitasi kulrang.
- Harakat paneli: ikki qator-tugma — «Maydon band edi» · «Egasi telefonni ko'tarmadi» (ochilmaguncha «›», ochilgach ✓, U-013).
- **Harakat → Vizual o'zgarish:** qatorni bosish → doskadagi o'sha qator ostida «Nega?» qatori ochiladi (yozuvlardan):
  - «Maydon band edi» → Kelishdan oldin bo'sh vaqtni bilishmagan va uni band qila olishmagan. (69)
  - «Egasi telefonni ko'tarmadi» → Vaqtni bilish va band qilishning yo'li bitta — qo'ng'iroq. U ishlamadi. (71)
- Bashorat (ikkala qator ochilgach; ballsiz `QBashorat`): **Ikki qator bitta muammoga qo'shilsa, u nechta yozuvda bo'ladi?** — 3 tasida · 4 tasida · 7 tasida (o'sish tartibida)
  - **Harakat → Vizual o'zgarish:** tanlov → ikki qator bir-biriga suriladi, «telefon» nuqtalari (1, 2, 4) «band» nuqtalari (1, 2, 3, 4) ustiga tushadi — yangi nuqta qo'shilmaydi;
    qatorlar o'rnida muammo kartasi ochiladi va o'zi yoziladi: «kim» — O'yinchilar · «qachon» — maydonga borishdan oldin · «nimadan qiynaladi» — bo'sh vaqtni bilish va uni band qilishda · «5 yozuvdan 4 tasida».
  - Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 4 tasida» yoki «Taxminingiz to'g'ri chiqdi».
  - Qator (`QIzoh`): Telefon haqida gapirgan uch kishi «band edi» ham degan — ular o'sha to'rt yozuvda. (82)
- Natija (tugadi): panel yopiladi, doska butun enga — tepada muammo kartasi, ostida kulrang ikki qator (2 / 5, 1 / 5).
- Xulosa: Ikki shikoyat bitta asosiy qiyinchilikni ko'rsatdi. Muammo gapi shuni aytadi — unda sayt ham, ilova ham yo'q. (109)
- Tugma (pastki): ① Ikki qatorni oching (N/2) → ② Taxminingizni belgilang → Davom etish

## 5 · 2-savol  ← QTest (✔ D)
- Eyebrow: Tekshiruv · muammo gapi
- Savol: **Oshxona haqidagi qaysi gap muammo gapi?** (39) — ikkinchi olam test bandida (P-002)
  - A · Oshxonaga oldindan buyurtma ilovasi kerak (41)
  - B · Tanaffusda oshxonada odam juda ko'p bo'ladi (43)
  - C · Menga oshxonadagi somsa umuman yoqmaydi (39)
  - D ✔ O'quvchilar tanaffusda ovqat ola olmaydi (40)
- To'g'ri izohi: Gapda kim, qachon va nimadan qiynalgani bor — yechim yo'q. (58)
- Xato izohlari:
  - A: Bu yechim — muammo gapida ilova bo'lmaydi. (42)
  - B: Odam ko'pligi rost, lekin kim nimadan qiynaldi? (47)
  - C: Bu bitta odamga yoqmagani, ko'pchilikning muammosi emas. (59)
  - (umumiy): Muammo kartasini eslang: unda qanday uch bo'lak bor edi? (56)

## 6 · Burbn  ← QVoqea (PM keys)
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Ko'p imkoniyatli ilovadan nima qoldi?** (37)
- Karta yorlig'i: «Burbn · N/6»; 5-kartada sahnada «Instagram» nom-yorlig'i o'z rangida ochiladi (sir-brend — ochilish qadamida), logotip yo'q (PM-028/029).
- Sahna (186): chizilgan telefon ekrani — «Burbn» menyusi, to'rt qator chizilgan belgi bilan: Joyni belgilash · Uchrashuv rejasi · Ball yig'ish · Surat joylash.
  Bashorat kadrlarida keyingi o'zgarish yopiq (`pre`), javob sahnada ochilmaydi.
- **Harakat → Vizual o'zgarish:** «Keyingi» → sahna navbat bilan o'zgaradi: 3-kartada «Surat joylash» qatori ajraladi, qolgan uchtasi xiralashadi; 5-kartada uch qator chiziladi va yo'qoladi,
  qolgan ekranda «Surat · Izoh · Layk», nom-yorliq «Burbn» → «Instagram»; 6-kartada sana yorlig'i «2010 · 6-oktabr» va «3 oyga yetmay · 1 000 000» qatori.
- Kartalar:
  1. **Burbn** — Ikki kishi Burbn degan telefon ilovasini qildi. Unda do'stlar qayerdaligini belgilar, uchrashuv rejasini tuzar, uchrashgani uchun ball yig'ar va surat joylar edi.
  2. Bashorat: **Ishlatganlar ko'pincha nechta imkoniyatdan foydalandi?** — Bittasidan · Ikki-uchtasidan · To'rttalasidan (o'sish tartibida, S-015)
     → `QTaxmin`: «Taxminingiz: … · haqiqatda: bittasidan — surat joylashdan» / «Taxminingiz to'g'ri chiqdi»
  3. **Odamlar nima qildi** — Ikkalasi odamlar ilovada nima qilayotganini kuzatdi. Jamoa odamlar surat joylashga ko'proq tortilayotganini ko'rdi.
  4. Bashorat: **Jamoa to'rt imkoniyatdan nechtasini qoldirdi?** — Bittasini · Ikki-uchtasini · To'rttalasini (o'sish tartibida) → `QTaxmin`
  5. **Qaror** — Jamoa suratdan boshqa hamma narsani olib tashladi: surat, unga izoh va layk qoldi. Ilovaga yangi nom berildi — Instagram.
     Kulrang qator (S-018, brend javob bo'lgani uchun izoh javobdan keyin): Instagram — surat va video joylanadigan ilova.
  6. **2010-yil 6-oktabr** — Instagram chiqdi. Uch oyga yetmay unda bir million odam ro'yxatdan o'tdi.
- Xulosa (6-kartadan keyin): Bu misolda jamoa odamlar ko'p qilgan bitta ishni qoldirdi, qolganini olib tashladi. (83)
- Tugma (pastki): Keyingi (N/6) → Davom etish · bashoratda «Avval o'zingiz belgilang»
- Manba (o'quvchiga ko'rinmaydi):
  - M. G. Siegler, «A Pivotal Pivot», TechCrunch, 2010-11-08 — https://techcrunch.com/?p=241149 (Systrom'ning Quora javobi: Burbn'da «check in to locations, make plans, earn points for hanging out with friends, post pictures»;
    «basically cut everything in the Burbn app except for its photo, comment, and like capabilities. What remained was Instagram»).
  - Wikipedia, «Instagram» (History) — https://en.wikipedia.org/wiki/Instagram (Burbn — Systrom va Krieger'ning check-in ilovasi; «refocused their app on photo-sharing, which had become
    a popular feature among its users»; 2010-10-06 App Store).
  - TechCrunch, 2010-12-21 — Instagram 1 million foydalanuvchiga uch oydan kam vaqtda yetdi (audit manbasi; havola «qur» da tekshiriladi). «Ikki oy» (Wikipedia) o'rniga «uch oyga yetmay» — xavfsizroq.

## 7 · 3-savol  ← QTest (✔ A)
- Eyebrow: Tekshiruv · Burbn qarori
- Savol: **Burbn jamoasi suratni nega qoldirdi?** (36)
  - A ✔ Odamlar ilovada shunga ko'p tortilardi (38)
  - B · Jamoaning o'zi suratni yaxshi ko'rardi (38)
  - C · Suratni qurish eng kam vaqt olgan edi (37)
  - D · Bitta foydalanuvchi shuni so'ragan edi (38)
- To'g'ri izohi: Jamoa odamlar ilovada ko'pincha nima qilganiga qaradi. (54)
- Xato izohlari:
  - B: Voqeani eslang: jamoa kimni kuzatdi? (36)
  - C: Voqeada vaqt haqida gap bo'lmadi — jamoa nimaga qaradi? (55)
  - D: Bitta odam so'ragani — bir kishining gapi. (42)
  - (umumiy): Uchinchi kartani eslang: odamlar ilovada nima qilardi? (54)

## 8 · Sizning muammo gapingiz  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Besh yozuvingiz qaysi muammoni aytyapti?** (37)
- Mentor: Uyga vazifadagi besh yozuvingizni oching; yo'q bo'lsa, sinfdoshingiznikini oling. Avval sanang, so'ng yozing. (2 gap)
- Qadam-tugmalari 1/2/3: Shikoyatlar · Kim · Qachon va nimadan qiynaladi
- Forma (bitta ustun, «Saqlash» o'ngda):
  - ① qator «Shikoyat» (placeholder «Odam aytgan shikoyat…») + «Nechta yozuvda?» — 1 · 2 · 3 · 4 · 5 tugmalari + «Qo'shish»; qatorlar o'quvchining doskasiga tushadi, son bo'yicha saralanadi
    (kamida 2 qator; ko'pi bilan 5).
  - ② «Kim qiynaladi?» (placeholder shu savolning o'zi)
  - ③ «Qachon va nimadan qiynaladi?» + ostida «5 yozuvdan [n] tasida» — n doskadagi eng ko'p sondan olinadi, o'zgartirsa bo'ladi.
  - Yig'ilgan gap (③ dan keyin, muammo kartasi shaklida): «{Kim} {qachon va nimadan qiynaladi}. 5 yozuvdan {n} tasida chiqdi.»
    Tekshiruv-juftlik (PM-020): «O'yinchilar» + «maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi» → «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi. 5 yozuvdan 4 tasida chiqdi.»
- Javob-qatorlari (bloklamaydi, yo'naltiradi, ≤60):
  - ③ da yechim so'zi (sayt, ilova, bot, «kerak»): Bu yechim. Odam nimadan qiynalishini yozing. (44)
  - ② «hamma»: «Hamma» — juda keng. Yozuvlarda kim gapirgan edi? (49)
  - n = 1: Bu bitta yozuvda chiqdi — ko'proq yozuvda chiqqanini oling. (59)
  - qisqa: Qisqa qoldi: to'liq yozing. (27)
- Yordam (yopiq): Yozuvlarni birma-bir o'qing va har shikoyat yoniga chiziqcha qo'ying. Ikki shikoyat bitta asosiy qiyinchilikni ko'rsatsa, ularni bitta qatorga yozing.
- Natija (3/3): forma yopiladi, o'quvchining doskasi fokusga — shikoyat qatorlari sanog'i bilan, tepada o'z muammo kartasi, ✎.
- Xulosa: Muammo gapingiz saqlandi — imkoniyatlar endi shu gapga qarab tanlanadi. (71)
- Tugma (pastki): ① Kamida ikki shikoyat qo'shing → ② Kim qiynalishini yozing → ③ Nimadan qiynalishini yozing → Davom etish
- MentorNote: Yozuvi yo'q o'quvchini yozuvi bor sherigi bilan juftlang — bitta yozuvlar to'plami, ikki muammo gapi. Ikki shikoyatni birlashtirgan o'quvchidan qaysi qiyinchilik ularni birlashtirganini so'rang.

## 9 · Uch quti  ← QTushuncha (mashq)
- Eyebrow: Mashq · MVP chegarasi
- Sarlavha: **Maydonning birinchi versiyasiga nima kiradi?** (44)
- Mentor: «Qilamiz» qutisi — MVP: mahsulotning ish beradigan eng sodda birinchi versiyasi. Ikki savol — bugun birinchi versiyani kichik saqlash uchun; universal qoida emas. (2 gap, audit 4)
- Ikki savol (harakat paneli tepasida, bitta manba `IKKI_SAVOL` — 9, 10-ekran va 4-recap, P-063):
  1 · Busiz muammo hal bo'ladimi? · 2 · Yozuvlarda unga sabab bormi?
- Harakat paneli: joriy imkoniyat kartasi «N / 8» + uch tugma: Qilamiz · Keyin · Qilmaymiz. Vizual: doska — tepada «Maydon» muammo kartasi, pastda uch quti.
- **Harakat → Vizual o'zgarish:** quti tugmasini bosish → karta doskaning tanlangan qutisiga uchadi; noto'g'ri bo'lsa quti bir lahza qizil chegara oladi va karta o'z qutisiga ko'chadi;
  karta ostida sabab-qatori ochiladi; qutidagi «N ta» o'sadi.
- Kartalar (navbat — aralash; kod `IMKONIYATLAR`) va sabab-qatorlari:
  - O'yinchilar chati → Qilmaymiz — Gaplashishdan shikoyat yo'q — jamoa guruhda yozishadi. (54)
  - Kun bo'yicha vaqt kataklari → Qilamiz — Bo'sh vaqtni aynan shu kataklar ko'rsatadi. (43)
  - To'lov → Keyin — Pul haqida bitta yozuv bor, lekin band qilish pulsiz ham ishlaydi. (66)
  - Egasi uchun bandlar ro'yxati → Qilamiz — Egasi bandlarni ko'rmasa, maydonni boshqaga berib yuborishi mumkin. (67)
  - Maydonga baho → Qilmaymiz — Besh yozuvda maydon sifatidan shikoyat yo'q. (44)
  - Jamoa yig'ish → Keyin — Jamoa haqida ikki yozuv bor, lekin bo'sh vaqtni busiz ham bilib, band qilsa bo'ladi. (77)
  - Katakni band qilish → Qilamiz — Bo'sh vaqtni ko'rib band qila olmasa, kelguncha boshqa odam egallaydi. (70)
  - Vaqt bo'shasa — eslatma → Keyin — Muammoga yordam beradi, lekin kataklar busiz ham bo'sh vaqtni ko'rsatadi. (73)
- Javob qatori: to'g'ri — Shu qutida turadi. · noto'g'ri yo'nalish bo'yicha (≤60):
  - «Qilamiz» kerak edi: Busiz muammo hal bo'lmaydi — u MVP'da kerak. (45)
  - «Qilamiz» tanlandi, kerak emas edi: Muammo busiz ham hal bo'ladi — MVP'ga shart emas. (49)
  - «Keyin» kerak edi, «Qilmaymiz» tanlandi: Yozuvlarda bunga sabab bor — o'chirmang, keyinga suring. (56)
  - «Qilmaymiz» kerak edi, «Keyin» tanlandi: Besh yozuvda bunga sabab topilmadi. (35)
- Karta tugmasi (o'ngda): Keyingi imkoniyat → · oxirgisida: Qutilarni ko'rish
- Yordam — birinchi xatodan keyin (P-033): Ikki savolni tartib bilan bering: avval — busiz muammo hal bo'ladimi? «Ha» bo'lsa — yozuvlarda unga sabab bormi?
- Natija (tugadi): panel yopiladi, doska butun enga — Qilamiz 3 · Keyin 3 · Qilmaymiz 2; tepada muammo kartasi.
- Xulosa: Bu misolda MVP'ga uchta imkoniyat kirdi: ularsiz muammo hal bo'lmaydi. (70)
- Qator (xulosadan keyin, `QIzoh`): «Keyin» — «Dekompozitsiya» darsidagi keyinga qoldirilganlar: hech narsa o'chirilmaydi, navbati suriladi. (104)
- Tugma (pastki): Imkoniyatlarni qutilarga qo'ying (N/8) → Davom etish

## 10 · Sizning uch qutingiz  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Hozir nimani qurmaslik kerak?** (30)
- Mentor: Muammo gapingiz tepada turibdi — har imkoniyatni unga solishtiring. (67)
- Tepada (kulrang, 8-ekrandan): o'quvchining muammo kartasi.
- Qadam-tugmalari 1/2/3: Qilamiz · Keyin · Qilmaymiz
- Forma: joriy qutiga imkoniyat yoziladi (har biri «Qo'shish», qutida bir nechta); placeholder:
  «Qaysi imkoniyatsiz muammo hal bo'lmaydi?» · «Qaysi imkoniyat keyin kerak bo'ladi?» · «Yozuvlarda qaysi imkoniyatga sabab yo'q?» · «Saqlash» o'ngda.
  Har qutida kamida bitta.
- Javob-qatorlari (bloklamaydi, ≤60):
  - takror: Bu imkoniyat boshqa qutida bor — bittasini tanlang. (51)
  - bo'sh so'z («yaxshi», «chiroyli», «qulay»): Bu hali imkoniyat emas: mahsulot nima qila olsin? (49)
  - «Qilamiz»da 3 tadan ko'p: «Qilamiz»da uchtadan ko'p: har biriga birinchi savolni qayta bering. (68 — yorliq qatori, xato izohi emas)
  - qisqa: Qisqa qoldi: imkoniyatni to'liq yozing. (39)
- Yordam (yopiq): `IKKI_SAVOL` — Har imkoniyatga ikki savol bering: busiz muammo hal bo'ladimi? «Ha» bo'lsa — yozuvlarda unga sabab bormi?
- Natija (3/3): forma yopiladi, o'quvchining doskasi fokusga — tepada muammo gapi, pastda uch quti o'z imkoniyatlari bilan, har qatorda ✎.
- Xulosa: Uch qutingiz saqlandi: «Qilamiz» — sizning MVP'ingiz. (53)
- Tugma (pastki): ① «Qilamiz»ga imkoniyat yozing → ② Yana N quti qoldi → Davom etish
- MentorNote: «Qilamiz»da beshta-oltita imkoniyat bo'lsa, bittasini oling va so'rang: busiz muammo hal bo'ladimi?

## 11 · Kod yozish  ← QKod
- Eyebrow: Kod yozish · VS Code
- Sarlavha: **Shikoyatlarni sanaydigan kod yozamiz.** (37)
- 1-bosqich (darvoza-savol, ballsiz) — Mentor: Avval bitta savol — so'ng kod yoziladi.
  - Savol: Kod `yozuvlar[4]` ni chiqarsa, terminalda nima ko'rinadi?
  - To'rtinchi yozuvdagi shikoyatlar · ✔ Beshinchi yozuvdagi shikoyatlar · Yozuvlarning umumiy soni
  - Xato bosilsa (silkinadi + qator): Ro'yxatda sanash 0 dan boshlanadi. (34)
- 2-bosqich — Mentor: Doskada qo'lingiz bilan sanagan shikoyatlarni endi kod xuddi shunday sanaydi. (77)
  - Chap: «Kod nima chiqarsin» — 1 To'rt shikoyat, har biri alohida qatorda · 2 Har qator yonida — nechta yozuvda · 3 Sonlar doskadagi bilan bir xil
  - Yordam (yopiq):
    - Eslatma (JavaScript darslaridan): `yozuvlar[j]` — j-indeksdagi yozuv (indeks 0 dan boshlanadi) · `.includes(s)` — ro'yxatda s bormi (5-Modulda ishlatgansiz) ·
      `for` — yozuvlarni birma-bir ko'rib chiqadi (sikl) · `if (...)` — shart rost bo'lsa, qavs ichidagi qator ishlaydi · `son = son + 1` — songa bitta qo'shadi ·
      **terminal** — `node sanoq.js` yozib natijani ko'radigan oyna
    - Uch qadam: 1. Ichkariga ikkinchi sikl: `for (let j = 0; j < yozuvlar.length; j++)` · 2. Ichida shart: `if (yozuvlar[j].includes(s))` · 3. Shart rost bo'lsa: `son = son + 1;`
  - Tugma: Bajardim — to'rt qator chiqdi (o'ngda)
  - O'ng: VS Code oynasi `sanoq.js` (qo'lda yoziladi; sichqoncha ustida: Kod nusxalanmaydi — o'zingiz terib yozasiz), ostida terminal:
    ```js
    // sanoq.js — «Maydon» intervyulari: har shikoyat nechta yozuvda chiqdi

    // Kodda shikoyatlarni bitta so'z bilan yozamiz: band, telefon, jamoa, pul
    const yozuvlar = [
      ["band", "telefon"],
      ["band", "telefon"],
      ["band"],
      ["band", "telefon", "jamoa"],
      ["jamoa", "pul"],
    ];

    const shikoyatlar = ["band", "telefon", "jamoa", "pul"];

    for (let i = 0; i < shikoyatlar.length; i++) {
      const s = shikoyatlar[i];   // s — shu aylanishda sanalayotgan shikoyat
      let son = 0;
      // Shu yerga: yozuvlar'ni ikkinchi sikl bilan aylanib chiqing,
      // yozuvda s bo'lsa, son'ga bitta qo'shing (Yordam ▸)
      console.log(s + " — " + son + " / " + yozuvlar.length);
    }
    ```
  - Terminal paneli «Kutilgan natija» (boshidan xira, 12-q1 A naqshi):
    ```
    $ node sanoq.js
    band — 4 / 5
    telefon — 3 / 5
    jamoa — 2 / 5
    pul — 1 / 5
    ```
- **Harakat → Vizual o'zgarish:** «Bajardim» → terminaldagi kutilgan natija xiradan to'liq rangga o'tadi, to'rt qator ketma-ket bir lahza ajraladi — bu 2-ekrandagi doskaning kod ko'rinishi.
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Tugmalar: Orqaga · Avval kod-savolini yeching → ② Kodni yozing va tugmani bosing → Davom etish

## 12 · 4-savol (yakuniy)  ← QTest (✔ C)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Imkoniyatni «Qilamiz» qutisiga nima kiritadi?** (45)
  - A · Muammoni ko'p o'yinchi aytgani (30)
  - B · Uni jamoaning o'zi yoqtirgani (29)
  - C ✔ Busiz muammo hal bo'lmasligi (28)
  - D · Uni yozuvda kimdir aytgani (26)
- To'g'ri izohi: «Qilamiz»ga faqat busiz muammo hal bo'lmaydigan imkoniyat kiradi. (65)
- Xato izohlari:
  - A: Ko'p aytilgani muammoni tanlaydi, imkoniyatni emas. (51)
  - B: Burbn jamoasi o'z xohishiga emas, odamlarga qaradi. (51)
  - D: Yozuvda bor bo'lsa ham, u «Keyin»da turishi mumkin. (51)
  - (umumiy): Qutilarga ajratishdagi birinchi savolni eslang. (47)

## 13 · O'zingiz o'ylab ko'ring  ← QMustaqil (2 qadam)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Siz aslida qaysi muammoni hal qilyapsiz?** (40)
- Mentor: Ekranga qaramasdan ayting: kim, qachon, nimadan qiynaladi va bu nechta yozuvda chiqdi? (86)
- 1-qadam: (mustaqil rejimda) Ovoz chiqarib o'zingizga ayting / (jonli darsda) Sherigingizga ayting — taymer 30 s / 1 daqiqa, platforma standarti.
- 2-qadam: Endi shu gapni bir qatorda yozing · placeholder «… … qiynaladi. 5 yozuvdan … tasida chiqdi.»
- Xulosa (yozgach): Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi. (89) — «Bugungi asosiy fikr» bilan so'zma-so'z
- Tugmalar: Orqaga · Davom etish

## 14 · Natijalar  ← QNatija — platforma standarti (bitta karta, U-048; jonli reyting / podium)

## 15 · Takrorlash  ← QKartochka (11 karta)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon | Orqa |
|---|---|
| Shikoyat qachon kuchli belgi bo'ladi? | Ko'p yozuvda chiqqanda — keyin uning og'irligi ham qaraladi |
| Bitta yozuvdagi qattiq gap kimniki? | Bir odamniki |
| «Maydon»da qaysi shikoyat eng ko'p chiqdi? | «Maydon band edi» — 5 yozuvdan 4 tasida |
| «Maydon» muammo gapi qanday? | O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi |
| Muammo gapida qanday uch bo'lak bor? | Kim · qachon · nimadan qiynaladi |
| Muammo gapida nima bo'lmaydi? | Yechim — sayt ham, ilova ham |
| MVP nima? | Mahsulotning ish beradigan eng sodda birinchi versiyasi |
| «Qilamiz» qutisiga qanday imkoniyat kiradi? | Busiz muammo hal bo'lmaydigani |
| «Keyin» bilan «Qilmaymiz» farqi nima? | «Keyin»ga yozuvlarda sabab bor, «Qilmaymiz»ga yo'q |
| Burbn'dan nima qoldi? | Surat, izoh va layk — ilova Instagram bo'ldi (2010) |
| `yozuvlar[j].includes(s)` nima qiladi? | j-indeksdagi yozuvda s bor-yo'qligini tekshiradi |

- Tugmalar, oxirgi holat — platforma standarti (`QKartochka`, 174).

## 16 · Yakun  ← QYakun (PM: HwCard)
- Eyebrow: Dars yakuni
- Belgi: ✓ Dars tugadi (yonida: N/4 to'g'ri)
- Sarlavha: **Muammo gapingiz va MVP chegarangiz tayyor.** (43)
- Bugungi asosiy fikr — Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi.
- CODE STRIKE + arena — platforma standarti (192).
- Endi siz bilasiz:
  - Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz.
  - Muammo gapi kim, qachon va nimadan qiynalishini aytadi — unda yechim yo'q.
  - MVP — mahsulotning ish beradigan eng sodda birinchi versiyasi; «Qilamiz»ga busiz muammo hal bo'lmaydigan imkoniyat kiradi.
  - Burbn jamoasi odamlar ko'p qilgan bitta ishni qoldirdi — ilova Instagram bo'ldi.
- Nishonlaringiz — n/4
- Uyga vazifa (HwCard; yangi `PmInterviewMvpLesson.homework.jsx` — «qur» bosqichida, PM-025):
  - Kim uchun: o'z g'oyangiz · Nechta: 1 muammo gapi va uch quti · Muddat: keyingi darsgacha
  - ① O'z besh yozuvingizni qayta o'qing va har shikoyat nechta yozuvda chiqqanini sanang.
  - ② Eng ko'p chiqqanini bitta muammo gapiga yozing: kim, qachon, nimadan qiynaladi.
  - ③ Imkoniyatlarni uch qutiga ajrating — «Qilamiz»da faqat busiz muammo hal bo'lmaydiganlari qolsin.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Mini-MVP arxitekturasi». «Maydon»ning «Qilamiz» qutisidagi uch imkoniyat uchun sayt, Backend va Database'ni bitta chizmaga chizasiz.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Fon so'zlari (uz; kod bosqichida {uz, ru}, R-008):
  - Arena (`QZ_BG_SHAPES`): yozuv · shikoyat · muammo · sanoq · MVP · qilamiz · keyin · qilmaymiz · intervyu (+ o'yin qatlami shakllari)
  - Uyga vazifa banneri (`HW_TOKENS`): yozuv · muammo · MVP · quti · sanoq

---

## Nishonlar (4; nomlar inglizcha, PM an'anasi)
- **Pattern Spotter!** (2-ekran) — Besh yozuvni ochib, shikoyatlarni sanadingiz
- **Problem Writer!** (8-ekran) — O'z muammo gapingizni yozdingiz
- **Scope Keeper!** (9-ekran) — Sakkizta imkoniyatni uch qutiga ajratdingiz
- **Code Counter!** (11-ekran) — Shikoyatlarni kod bilan sanadingiz
- Yozuvlar — platforma standarti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishonlar — n/4

## Qisqa takrorlash oynalari (har ballik test — 3 karta; PM darsida belgi o'rniga raqam 1/2/3 — S-026)
Yorliq: Qayta tushuntirish · tugmalar — platforma standarti.

1. (3-ekran) **Bitta yozuv — bir odamning gapi**
   1. Qattiq gap — Pul haqidagi gap eng qattiq aytilgan edi, lekin u faqat **bitta yozuvda** chiqdi.
   2. Sanoq — Har shikoyat nechta yozuvda chiqqanini sanaymiz: «Maydon band edi» — **5 yozuvdan 4 tasida**.
   3. Muammo — Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz.
   - Sinfga savol: Yozuvlaringizda qaysi shikoyat eng ko'p chiqdi?
2. (5-ekran) **Muammo gapi qiyinchilikni aytadi**
   1. Ikki shikoyat, bitta qiyinchilik — «Band edi» va «telefonni ko'tarmadi» bitta asosiy qiyinchilikni ko'rsatdi: bo'sh vaqtni oldindan bilib, band qilib bo'lmaydi.
   2. Uch bo'lak — **kim**, **qachon**, **nimadan qiynaladi**: «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»
   3. Yechim yo'q — Muammo gapida sayt ham, ilova ham yo'q: yechim qutilarda tanlanadi.
   - Sinfga savol: Muammo gapingizga yechim kirib qolmadimi?
3. (7-ekran) **Burbn odamlar ko'p qilgan ishni qoldirdi**
   1. To'rt imkoniyat — Burbn'da joy belgilash, uchrashuv rejasi, ball va surat joylash bor edi.
   2. Odamlar nima qildi — Jamoa kuzatdi: odamlar **surat joylashga** ko'proq tortilardi.
   3. Qaror — Suratdan boshqasi olib tashlandi — ilova **Instagram** bo'ldi (2010).
   - Sinfga savol: Yozuvlaringizda odamlar ko'pincha nima qilgani aytilgan?
4. (12-ekran) **«Qilamiz»ga busiz muammo hal bo'lmaydigani kiradi**
   1. Birinchi savol — Busiz muammo hal bo'ladimi? «Yo'q» — **Qilamiz**.
   2. Ikkinchi savol — «Ha» bo'lsa: yozuvlarda unga sabab bormi? Bor — **Keyin**, yo'q — **Qilmaymiz**.
   3. «Maydon»da — «Qilamiz»da uchta: vaqt kataklari · band qilish · egasi uchun bandlar ro'yxati.
   - Sinfga savol: «Qilamiz» qutingizdagi qaysi imkoniyat birinchi savoldan o'tmaydi?

## Jonli viktorina (12 savol, ✔; to'g'ri javob o'rni: A 1·6·12 · B 3·5·10 · C 2·8·11 · D 4·7·9)
1. Oshxona haqida besh intervyu qildingiz, deylik. Qaysi shikoyatdan boshlaysiz?
   - ✔ To'rt yozuvda chiqqanidan
   - Eng qattiq aytilganidan
   - O'zingizga qiziq bo'lganidan
   - Oxirgi yozuvdagisidan
2. Qaysi gap muammo gapi bo'la oladi?
   - Maydonni band qiladigan sayt kerak
   - Shanba kuni futbol o'ynash juda yoqadi
   - ✔ O'yinchilar bo'sh vaqtni bila olmaydi
   - Mahallada futbol o'ynaydiganlar ko'p
3. Bitta o'yinchi «chat kerak» dedi. Bu nimani bildiradi?
   - Chat — MVP'ning eng muhim qismi
   - ✔ Hozircha bu bir odamning gapi
   - Hamma o'yinchiga chat kerak ekan
   - Chatni bugunoq qurish kerak
4. MVP nima?
   - Mahsulotning eng chiroyli to'liq versiyasi
   - Barcha imkoniyati bor oxirgi versiyasi
   - Faqat rasmi chizilgan birinchi versiyasi
   - ✔ Ish beradigan eng sodda birinchi versiya
5. «Keyin» qutisidagi imkoniyat bilan nima bo'ladi?
   - Butunlay o'chirib tashlanadi
   - ✔ Saqlanadi, navbati suriladi
   - Bugunoq MVP'ga qo'shiladi
   - Boshqa mahsulotga beriladi
6. «Jamoa yig'ish» nega «Keyin» qutisida?
   - ✔ Yozuvda bor, lekin MVP busiz ishlaydi
   - Uni hech bir yozuvda hech kim aytmagan
   - Busiz bo'sh vaqtni bilib bo'lmaydi
   - Uni besh yozuvning hammasida aytishgan
7. «Maydonga baho» nega «Qilmaymiz» qutisida?
   - Uni qurish juda qiyin bo'lgani uchun
   - Jamoaning o'ziga u yoqmagani uchun
   - Uni ko'p o'yinchi so'ragani uchun
   - ✔ Yozuvlarda unga sabab yo'qligi uchun
8. «Egasi uchun bandlar ro'yxati»siz nima bo'ladi?
   - Hech narsa — bu ro'yxat o'yinchilarga kerak emas
   - O'yinchilar sayt kataklarini umuman ko'ra olmaydi
   - ✔ Egasi maydonni boshqaga berib yuborishi mumkin
   - Sayt ochilmaydi va hech kim band qila olmaydi
9. Burbn jamoasi qaysi imkoniyatni qoldirdi?
   - Joyni belgilashni
   - Uchrashuv rejasini
   - Ball yig'ishni
   - ✔ Surat joylashni
10. Burbn jamoasi qarorni nimaga qarab qildi?
    - Jamoaning o'z xohishiga qarab
    - ✔ Odamlar nima qilganiga qarab
    - Eng oson imkoniyatga qarab
    - Bitta odamning gapiga qarab
11. Kodda `yozuvlar[j].includes("band")` nimani tekshiradi?
    - Yozuvlar soni nechtaligini
    - Birinchi yozuv nimaligini
    - ✔ j-yozuvda «band» bormi
    - «band» so'zi uzunligini
12. Ikki shikoyat bitta qiyinchilikni ko'rsatsa, nima qilasiz?
    - ✔ Ikkalasini bitta muammo gapiga yozaman
    - Ulardan birini o'chirib, bittasini qoldiraman
    - Har biri uchun alohida sayt qilaman
    - Ikkalasini ham «Keyin» qutisiga qo'yaman

Arena yozuvlari — umumiy shablon (platforma standarti, o'zgarmaydi).

---

## KOD (qolipda yo'q yoki «qur» bosqichida yoziladigan joylar)

1. **`SanoqDoska`** — bitta komponent (163/180): `YOZUVLAR` (5 ta: matn + shikoyat kalitlari), `SHIKOYATLAR` (4 ta: kalit, matn, «Nega?» qatori), `MUAMMO_GAP` (kim, nima),
   `IMKONIYATLAR` (8 ta: nom, quti, sabab), `IKKI_SAVOL` dan; uch qavat (yozuvlar · shikoyatlar + muammo kartasi · uch quti); holatlar kulrang · accent · yashil ✓ · qizil chiziq;
   nuqtalar ustma-ust tushishi (4-ekran birlashish); `// qolip-maket:` e'loni; `zoom` (⛶, q17); `prefers-reduced-motion`.
2. **s0** `QKirish` (DE-201): maket — besh yozuv-kartasi; tanlovdan keyin «? / 5» belgisi; javob bitta, `correct: false` hammaga (J-026).
3. **s1** `QReja`: chap — doskaning bo'sh shakli (skelet-chiziqlar), o'ng — 4 qadam «01 · matn · teg».
4. **s2** `QTushuncha`: besh «Ochish»; `QBashorat` + `QTaxmin`; qatorlar saralanishi; `tugadi` (q18); nishon `patternSpotter`.
5. **s4** `QTushuncha`: ikki qator-tugma (toggle, U-013); «Nega?» qatorlari; ikkinchi `QBashorat` (3 · 4 · 7) + `QTaxmin` + `QIzoh`; birlashish animatsiyasi; muammo kartasi o'zi yoziladi; `tugadi`.
6. **s6** `QVoqea`: telefon maketi (chizilgan belgilar, emoji emas); yorliq «Burbn · N/6», 5-kartada «Instagram» nom-yorlig'i; 2 bashorat ballsiz (`ans` — 0, 0) + `QTaxmin`; manba — fayl izohida.
7. **s8** `QMustaqil`: shikoyat qatori + 1–5 tugmalari + «Qo'shish»; ② ③ yozuv qatorlari; yig'ilgan gap; javob-qatorlari detektorlari (yechim so'zlari: sayt, ilova, bot, kerak · «hamma» · n = 1 · qisqa);
   `OUT_KEY` `pm-m7d3-muammo` = `{ shikoyatlar: [{ t, n }], kim, nima, n }`; nishon `problemWriter`. Yozuvlar soni 5 sukutda (TAYANCHGA SAVOL 3).
8. **s9** `QTushuncha` (mashq): 8 karta, 3 tugma, sabab-qatorlari, 4 yo'nalishli javob qatori, Yordam birinchi xatodan keyin; `tugadi`; nishon `scopeKeeper` (birinchi urinish).
9. **s10** `QMustaqil`: uch quti, ko'p qatorli; javob-qatorlari; `OUT_KEY` `pm-m7d3-mvp` = `{ qilamiz: [], keyin: [], qilmaymiz: [] }`.
10. **s11** `QKod`: darvoza-savol (`GATE_OPTS`, ✔ 1); `sanoq.js` (`KD_CODE`, uz + ru izohlar); terminal «Kutilgan natija» boshidan xira; nishon `codeCounter`.
11. **Testlar s3/s5/s7/s12** → `QTest` (DE-203, q20): `INLINE_KEYS { s3: 1, s5: 3, s7: 0, s12: 2 }`, `explainCorrect`, `explainWrong` (variant bo'yicha + umumiy).
12. **s13** `QMustaqil` 2 qadam: taymer (30 s / 1 daqiqa), bir qatorlik yozish joyi.
13. **s15** `QKartochka` (DE-204, 11 karta). **s16** `QYakun`: sarlavha, asosiy fikr, 4 band, HwCard (3 qadam), «Keyingi dars».
14. **RECAPS** (3, 5, 7, 12) — raqam 1/2/3 (S-026), `Q_LABELS` / `SCORED_IDX` bilan mos (S-025).
15. **Arena** `QUIZ_BANK` 12 savol, kalitlar 0,2,1,3 · 1,0,3,2 · 3,1,2,0; `QZ_BG_SHAPES`, `HW_TOKENS` ({uz, ru}, R-008).
16. `ACHIEVEMENTS` (4), `LESSON_META` `{ lessonId: 'pm-m7d3-v1', lessonTitle: 'Besh suhbatdan qaysi muammo chiqdi?' }`, `SCREEN_INTENTS` — 17 ekran.
17. **Artefakt-strip** (U-042): «Doskam» — 8-ekrandan; 8, 10, 11, 13-ekran, recap va uyga vazifada ko'rinadi; test, arena, podiumda yo'q.
18. **App.jsx** `m7-03` qatoriga `comp: PmInterviewMvpLesson` («qur» bosqichida, asosiy seans); `sub` — TAYANCHGA SAVOL 7.

REPO: yo'q (PM darsi, teg yo'q).
Darvozalar (kod bosqichida): `npm run gates -- src/7-Modull/PmInterviewMvpLesson.jsx` · `lint:olchov` 0 · `lint:emoji` qolip-rejim 0 · `lint-qolip` q13–q21 · `lint:jsx` · surat 1280 + 393 (0, 2, 4, 6, 9, 11, 16).

---

## TAYANCHGA SAVOL

1. **Besh yozuvning taqsimoti** (kim nimani aytgan): 1 — band + telefon · 2 — band + telefon · 3 — band · 4 — band + telefon + jamoa · 5 — jamoa + pul.
   Nega: tayanch faqat jami sonlarni beradi (4 · 3 · 2 · 1); 4-ekrandagi birlashish va 11-ekrandagi kod aniq taqsimotni talab qiladi. Shu taqsimotda «band» va «telefon» birga = 4/5 —
   tayanchdagi tanlangan muammo bilan mos. 2-dars MD si Mentor misolida yozuv namunasini bersa — matnlar solishtiriladi.
2. ~~Beshalasi o'yinchimi~~ — **yopildi** (GATE M K4, audit): besh yozuv — besh o'yinchi; maydon egasi suhbati 2-darsda savol namunasi. Tarix: Nega: tayanch gaplari o'yinchi tilida («kelganimizda», «egasi … ko'tarmadi»). 2-dars egasi bilan ham intervyu qilsa — 6-yozuv kerakmi?
3. **Yozuv shabloni bo'limlari va joyi (2-dars).** Men yozuv kartasini «N-yozuv · o'yinchi» + odam aytgan gaplar (u aytganidek) deb oldim. 2-dars shabloni boshqa bo'lsa (masalan «Qachon? · Nima bo'ldi? · Nima qildi?») —
   kartalar shunga keltiriladi. Besh real yozuv qayerda turadi (qog'oz, telefon, 2-dars `OUT_KEY`)? 8-ekran hozir qo'lda kiritishni oladi.
4. **«Eslatma» = «Vaqt bo'shasa — eslatma»** (bo'sh vaqt chiqsa xabar). Nega: qutilar qoidasida «Keyin» = yozuvlarda sabab bor; «o'yindan oldin eslatma» bo'lsa, yozuvlarda sababi yo'q va u «Qilmaymiz»ga tushardi.
   Boshqa darslarda eslatma boshqa ma'noda kelsa — kelishish kerak.
5. **«Chat» = «O'yinchilar chati»**, «Qilmaymiz» sababi — 5-yozuvdagi «guruhda yozdik» (jamoa guruhda gaplashadi). **«Baho» = «Maydonga baho»**, sababi — yozuvlarda maydon sifatidan shikoyat yo'q.
6. **Qutilar qoidasi — ikki savol** («Busiz muammo hal bo'ladimi?» · «Yozuvlarda unga sabab bormi?»). 7, 9, 11-darslar «Qilamiz» qutisini tilga olsa — shu so'zlar bilan.
7. **App.jsx `sub` «takrorlar, …»** — darsda «takror» so'zi yo'q (kartochkalar «Takrorlash» va «Qisqa takrorlash» bilan to'qnashadi, T-015) va reja «sub» bilan so'zma-so'z mos bo'lishi kerak (P-015).
   Taklif: `sub` → «sanoq, bitta muammo, qilamiz / keyin / qilmaymiz» (App.jsx — asosiy seans).
8. **«shikoyat» atamasi** tayanch jadvalida yo'q; men qo'shdim: shikoyat — yozuvda odam aytgani, muammo — ko'p yozuvdagi shikoyatlar ortidagi qiyinchilik. 10 va 12-darslar bilan bir xil bo'lsin.
9. **Muammo gapi shakli:** «{Kim} {qachon va nimadan qiynaladi}. 5 yozuvdan {n} tasida chiqdi.» Maydon: «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.» —
   GATE M 03-q0 (tayanch 1-bo'limda ham shu gap). 12-dars pitchidagi muammo gapi shu bilan so'zma-so'z bo'lsin.
10. **Keys — Burbn → Instagram (2010).** Modulning boshqa darsi ham Instagram'ni olsa — takrorlanmasin. (3-Modul m3-05 da Instagram Stories voqeasi bor — boshqa voqea.)
11. **`OUT_KEY`'lar** `pm-m7d3-muammo`, `pm-m7d3-mvp` — 7 va 12-darslar o'qishi mumkin; nomlar asosiy seans bilan kelishiladi.

---

## GATE M — o'z tekshiruvim

- [x] Oldingi/keyingi dars va menyu nomi — App.jsx 7-blok bilan mos (m7-02 «Besh odamdan nimani bilib olasiz?» → m7-03 → m7-04 «Mini-MVP arxitekturasi»; yakunda «Keyingi dars — «Mini-MVP arxitekturasi»») (205)
- [x] Bitta misol-ip («Maydon»; oshxona — faqat 5-ekran testi va arena 1, P-002) · metafora yo'q · bitta vizual dars bo'yi — doska (0, 1, 2, 4, 8, 9, 10, 11, 13); 6-ekran — keys sahnasi
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 9 (+ 0 hook, 6 voqea, 11 kod) — matn-karta yo'q
- [x] Sarlavha ≤55 (36–52; test savollari 36–52) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 (53–100) · hook javobi 119 · xato izohi ≤60 (34–57).
      Istisno: 9-ekran `QIzoh` qatori 104 (xulosa emas, ≤110) va 10-ekran «Qilamiz»da uchtadan ko'p» qatori 68 (yorliq, xato izohi emas)
- [x] Atamalar oldingi darslar bilan bir xil (grep: MVP — m2-07 so'zma-so'z; «imkoniyat» — m2-07 va LUG'AT; «nechta yozuvda» — m5-09/m3-05 naqshi; `includes` — 5-Modul) · siz-forma ·
      quti nomlari tayanch va App.jsx dagidek · «takror», «funksiya» va tayanchning «ishlatilmaydi» so'zlari yo'q
- [x] Testlar: 4 variant, uzunlik farqi ≤5, ✔ eng uzun emas (s3 35 / s5 40 vs 43 / s7 38 teng / s12 28 vs 30) · kalit ildiz faqat to'g'rida emas («muammo» s12 da A va C da; «olmaydi» shakli s5 da — C «yoqmaydi» bilan) ·
      ✔ o'rni yangi dars uchun shu yerda belgilandi (B · D · A · C)
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — 12-ekran testi). Uch quti mashqi (9) Mentor/yorliq orqali tartibni ochmaydi: ikki savol — vosita, javob — mexanikada
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («har doim», «100%», «darrov» — yo'q; 5-yozuvdagi «har safar» — olam ichidagi gap, T-008)
- [x] Ichki kodlar o'quvchi matnida yo'q («s4», «Modul 9» yo'q; «2-ekrandagi doska» faqat MD izohida) · Burbn/Instagram — manba bilan (TechCrunch 2010-11-08, Wikipedia) · «KOD» ro'yxati 18 band
- [x] Karta T · P · S · PM ko'rildi: T-008/011/014/015/016/024/029/039/042/043/047/048/049/052/064/070 · P-001/002/008/010/013/014/015/016/025/033/036/046/048/052/053/062/063/064/067 ·
      S-001/002/004/006/008/010/015/018/019/025/026 · PM-005/017/020/025/027/030 (PM-107).
      Ochiq: T-039 — 0-ekran Mentori uyga vazifani qilgan deb oladi (qaror 7), qilmaganlar uchun 8-ekranda sinfdosh yo'li.

---

# 9-Modul · 4-dars «Mini-MVP arxitekturasi» — MD v3 (yangi dars, TEX + 2 amaliyot bloki)

Fayl: `src/7-Modull/MvpArchitectureLesson.jsx` (kalit `m7-04`) · **18 ekran** (13 dars ekrani + 2 amaliyot bloki + podium, takrorlash, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Namuna: `feedback/F-0929-QA-6modul/01-SystemArchitecture-v3.md` (tuzilish) · blok: `08-PipelineProject-v3.md` (A1–A3) · kod: `src/skelet/NamunaDars.jsx` dan.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Menyu (DE-205, App.jsx `m7-04`): «Mini-MVP arxitekturasi» · osti «qismlar, ma'lumot, kirish, deploy — sxema» (TAYANCHGA SAVOL 1) ·
oldingi dars `m7-03` «Besh suhbatdan qaysi muammo chiqdi?» · keyingi `m7-05` «Animatsiya: interfeys javob beradi».
Vaqt: ≈ 90 daqiqa — 0–12-ekranlar ≈ 50 · A1 ≈ 20 · A2 ≈ 15 · natija va yakun ≈ 5.

---

Tashqi audit (ChatGPT) Filtri: `04-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Bitta natija.** Dars oxirida o'quvchida ikki narsa bor: **«Maydon» chizmasi** (qismlar · `bandlar` jadvali · to'rt yo'l · ega kirishi · deploy joyi) va **skelet**:
   `maydon` papkasida `backend/` (NestJS) Database'ga (Neon) ulangan, `web/` (React) da statik vaqt kataklari ko'rinadi. Mentor repo'sidagi teg — `dars-04-done` (tayanch 3-bo'lim).
   Chizma 1-ekranda tayyor holatda ko'rsatiladi, 2–11-ekranlarda bo'lakma-bo'lak yozilib boradi, bloklarda papkaga aylanadi.
2. **Bugungi asosiy fikr (P-013):** Kod yozishdan oldin har funksiya chizmada o'z qismini, ma'lumotini va yo'lini oladi — shunda agentga aniq prompt yozasiz. (121)
3. **3-darsdan keladigan narsa** (tayanch 1-bo'lim, aynan): «Maydon» MVP ro'yxati — **qilamiz:** kun bo'yicha vaqt kataklari (bo'sh / band) · katakni band qilish (ism + telefon) ·
   egasi uchun bandlar ro'yxati · **keyin:** to'lov · jamoa yig'ish · eslatma · **qilmaymiz:** baho · chat. Darsda ro'yxat qatorlari **«funksiya»** deb ataladi
   («band» so'zi bu darsda faqat «egallangan katak» ma'nosida — T-015).
4. **Atamalar (bir ma'no — bir so'z, T-014):**
   - **sayt** — React ilova (`web/`, `localhost:5173`); tugunda «Sayt · React». «frontend» ishlatilmaydi.
   - **Backend** — NestJS (`backend/`, `localhost:3000`); tugunda «Backend · NestJS». Prozada «server» yo'q.
   - **Database** — PostgreSQL (Neon); tugunda «Database · PostgreSQL». «baza» yo'q.
   - **qism** — sayt · Backend · Database (8-Modul 1-dars «Komponentlardan tizim» so'zi: «qism», «tizim», «arxitektura»).
   - **chizma** — qismlar, jadval va yo'llar chizilgan rasm; **arxitektura** — shu chizma ko'rsatadigan tuzilish (m6-01: «Kod yozishdan oldin tizimni chizing», «arxitektura chizmasi»).
     «sxema» ishlatilmaydi: kursda «sxema» — Database jadvallari tuzilishi (m4-01 «JSON, jadval, sxema») — TAYANCHGA SAVOL 1.
   - **vaqt katagi · katak** — bitta soatlik oraliq (18:00 — 18:00–19:00); **band qilish · band** — katakni egallash · egallangan katak; **bo'sh** — egallanmagan katak. Boshqa nom yo'q (tayanch 2-bo'lim).
   - **o'yinchi · maydon egasi (ega)** — ikki foydalanuvchi; ismsiz.
   - **jadval `bandlar`** · **ustun** · **qator** («Jadvaldagi har qator — bitta band»). «Qator» faqat jadval ma'nosida; saytdagi kun tanlovi — «kun tugmalari».
   - **yo'l (route)** — Backend'dagi method + manzil: `GET /vaqtlar?kun=` · `POST /bandlar` · `POST /kirish` · `GET /bandlar` (tayanch 3-bo'lim, aynan).
     Kursdagi «route = method + path» (m4-05) bilan 5-ekranda bir gapda tenglashtiriladi (T-052). «Yo'l» boshqa ma'noda (sayohat, kirish yo'li) bu darsda ishlatilmaydi.
   - **ega kirishi** — ega parol bilan `POST /kirish` ga kiradi, **token** oladi (m4-11 «login», «token», «401», «`.env`» — 7-ekranda tenglashtiriladi).
   - **stack** — birga ishlaydigan texnologiyalar to'plami (m2-10 «PERN Stack» so'zi, ta'rif aynan) — TAYANCHGA SAVOL 2.
   - **deploy** — internetga chiqarish (KORPUS §196 izohi, dars bo'yi shu). **skelet (shablon)** — birinchi ko'rinishda qavs bilan, keyin «skelet» (KORPUS §213).
   - **agent** — Antigravity; **prompt** — agentga yuboriladigan matn (blok qolipi so'zi). Bu darsda «talab» ishlatilmaydi — TAYANCHGA SAVOL 12.
5. **Metafora yo'q.** Chizma — haqiqiy arxitektura rasmi; o'xshatish kerak bo'lmadi.
6. **Kod yozish — Antigravity** (6-Moduldan tanish). Prompt faqat *qayerda · nima qilsin · nima buzilmasin* (173.4). Xato bo'lsa — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
   Har blok oxirida bitta qadam — **«O'z g'oyangiz»**: o'sha promptning `{…}` li nusxasi o'quvchi MVP siga (qaror 8); u uyda yuboriladi.
7. **Toza yuza (D4):** tugma va variantlarda emoji yo'q; chizma CSS/SVG bilan chiziladi, logotip yo'q; rang — faqat holat foni (D3).
8. **Real odam bilan ish** bu darsda yo'q (TEX). Uyda — o'z MVP chizmasi va skeleti.

## Darsning ipi va bitta vizual

- **Misol-ip — «Maydon»** (tayanch 1-bo'lim): mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. Hamma ekran — shu bitta sayt.
- **Hook:** 3-darsdagi ro'yxat agentga bitta gapda berilgan → o'yinchi band qildi, ega ko'rmadi → «Kod yozishdan oldin qismlar chiziladi».
- **Bitta vizual — «Maydon» chizmasi (`MAYDON_NODES`, dars bo'yi, 163/180):**
  - Chapda ikki odam: **O'yinchi** · **Maydon egasi** (belgi + so'z, ismsiz).
  - **Sayt · React** — ichida kichik sayt maketi (`localhost:5173`): sarlavha «Maydon» · kun almashtirgichi «‹ **Shanba** ›» · olti vaqt katagi 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00 ·
    forma (Ism · Telefon · «Band qilish») · ega sahifasi («Bandlar», parol katagi, «Kirish»).
  - **Backend · NestJS** (`localhost:3000`) — ichida `.env` belgisi (`DATABASE_URL` · `EGA_PAROLI` · `JWT_SECRET`, qiymatlari yashirin).
  - **Database · PostgreSQL** (Neon) — kichik jadval kartasi `bandlar`: `id` · `kun` · `soat` · `ism` · `telefon` · `yaratilgan`.
  - Sayt ↔ Backend orasida **to'rt yo'l qatori** (bo'sh paytda uzuq chiziq, ochilgani — mono yozuv + chiziq): `GET /vaqtlar?kun=` · `POST /bandlar` · `POST /kirish` · `GET /bandlar` (qulf belgisi).
  - Pastda ikki zona (11-ekranda yonadi): **Kompyuteringizda** (Sayt, Backend) · **Internetda** (Database — boshidan shu yerda).
  - Holatlar — tugun: kulrang (hali ochilmagan) → oq karta (ochilgan) → accent chegara (joriy) → yashil (ishladi) · qizil (rad etdi, 401). So'rov — yo'l yorlig'i yozilgan kichik konvert.
    `prefers-reduced-motion` da konvert sakraydi.
  - Namuna ma'lumot: `kun` — sana (Shanba = `2026-10-10`, Yakshanba = `2026-10-11`); qatorlar `Ali · +998 90 000 00 01 · 18:00` va `Bek · +998 90 000 00 02 · 17:00` (TAYANCHGA SAVOL 3–5).
  - Ishlatilishi: 0 (sayt maketi — ikki telefonda) · 1 (tayyor) · 2 (qismlar) · 4 (jadval) · 5 (o'yinchi yo'llari) · 7 (ega kirishi) · 9 (stack nomlari) · 11 (zonalar) · A1/A2 kutilgan natija — tugunlarning kattasi.
- **Yakun:** chizma va skelet tayyor · keyingi dars — shu statik kataklar bosilganda javob beradi (animatsiya).

---

## 0 · Kirish — o'yinchi band qildi, ega ko'rmadi  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **O'yinchi band qilgan vaqtni egasi nega ko'rmadi?** (48)
- Mentor: O'tgan darsdagi ro'yxatni agentga bitta gapda berdik. O'yinchi telefonida 18:00 katagini bosing.
- Maket (chap):
  - tepada agent chati, ikki pufak: siz → «Maydon saytini qil: bo'sh vaqt kataklari, band qilish va egasi uchun bandlar ro'yxati.» · Antigravity → «Tayyor! Sayt ochiladi, kataklar ishlaydi.» (T-008 — chat matni)
  - ostida ikki telefon ramkasi yonma-yon: **O'yinchi telefoni** — «Maydon» · Shanba · olti katak, hammasi bo'sh · «Band qilish» ·
    **Ega telefoni** — «Bandlar» · «Hali band yo'q».
- **Harakat → Vizual o'zgarish:** 18:00 katagini bosish → o'yinchi telefonida katak band rangga o'tadi, ostida «Band qilindi»; ega telefonida hech narsa o'zgarmaydi — «Hali band yo'q».
  Shundan keyin o'ngdagi variantlar ochiladi (bosilmaguncha xira).
- Savol: **Egasi nega bandni ko'rmayapti?**
  - Egasi sahifani hali qayta yuklamagan (36)
  - ✔ Band faqat o'yinchi telefonida qolgan (37)
  - Ega telefonida internet ishlamayapti (36)
- Javob — 2-variant: **Aynan!** Bu misolda band faqat o'yinchi sahifasida o'zgardi. Umumiy Backend va Database bo'lmasa, egasiga hech narsa yetmaydi. (117)
- Javob — 1 yoki 3: **Qiziq fikr!** Yangilash yordam bermaydi: bu misolda ikkalasi ishlatadigan umumiy ma'lumot hali yo'q. (86)
- Javobdan keyin: ikki telefon orasida uzuq chiziqli bo'sh joy paydo bo'ladi — bugun chiziladigan qismlar o'rni (U-041).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun MVP ro'yxatini chizmaga aylantirasiz.** (43)
- Mentor: Kod yozishdan oldin har funksiyaning joyini chizmada belgilaymiz. Dars oxirida shu chizma bo'yicha loyiha skeleti (shablon) ishga tushadi.
- Chap yorliq: Dars oxirida — shu chizma va uning skeleti
- Chap — «Maydon» chizmasi **tayyor** holatda (hammasi oq, konvert bir marta o'zi yuradi — DE-200): O'yinchi · Maydon egasi → Sayt · React ↔ Backend · NestJS → Database · PostgreSQL (`bandlar`);
  Sayt–Backend orasida to'rtta chiziq (yorliqsiz — yo'l nomlari 5 va 7-ekranda ochiladi, P-015).
- O'ng yorliq: Bugungi 4 qadam (tex-karta, bosilmaydi, o'ngda mono teg):
  - 01 · Qismlar va stack · `sayt · Backend · Database`
  - 02 · Ma'lumot jadvali · `bandlar`
  - 03 · Yo'llar va ega kirishi · `GET · POST`
  - 04 · Deploy va skelet · `maydon`
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Uch qism  ← QTushuncha
- Eyebrow: Tushuncha · qismlar
- Sarlavha: **Har ishni qaysi qism bajaradi?** (30)
- Mentor: Har ish bitta qismda bajariladi — shunda agentga qayerga yozishni aniq aytasiz. Avval ishni tanlang, so'ng uning qismini bosing.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»): **«Maydon» MVP siga nechta qism kerak?** · Bitta · Uchta · Beshta — tanlov saqlanadi.
- Chap — MVP kartasi (kichik, 3-darsdan): Kun bo'yicha vaqt kataklari · Katakni band qilish · Egasi uchun bandlar ro'yxati. Ostida 6 ish-tugmasi (aralash):
  Kataklarni ko'rsatadi · Band katakni boshqa rangda chizadi · Katak bo'shligini tekshiradi · Ega parolini tekshiradi · Bandni saqlaydi · Eslatma yuboradi
- O'ng — chizma: Sayt · Backend · Database kulrang (texnologiya nomisiz — 9-ekranda yoziladi) + chetda uzuq chiziqli **«Keyin»** qutisi (joylash zonasi).
- **Harakat → Vizual o'zgarish:** ish-tugmasini tanlab, qismni bosish → to'g'ri bo'lsa tugun kulrangdan oq kartaga aylanadi, ichiga ish qatori yoziladi va tugun belgisi chiqadi:
  Sayt — kataklar maketi chiqadi, band katak rangli · Backend — `bo'shmi? ✓` va `parol ✓` qatorlari · Database — jadval belgisi. «Eslatma yuboradi» — «Keyin» qutisiga tushadi va kulrang qoladi.
  Noto'g'ri qism → tugma silkinib qaytadi, bir qator (≤60):
  - Kataklarni ko'rsatadi: Kataklar ekranda ko'rinadi — bu saytning ishi. (46)
  - Band katakni boshqa rangda chizadi: Rang ekranda o'zgaradi — bu saytning ishi. (42)
  - Katak bo'shligini tekshiradi: Bir katakni ikki kishi olmasin — buni Backend tekshiradi. (57)
  - Ega parolini tekshiradi: Parolni brauzerda tekshirish xavfli — bu Backend ishi. (54)
  - Bandni saqlaydi: Sahifa yopilsa ham band qolsin — bu Database ishi. (50)
  - Eslatma yuboradi (uch qismdan biriga): Eslatma «keyin» ro'yxatida — bugungi chizmaga kirmaydi. (55)
- Natija qatori: «Taxminingiz: … · haqiqatda: uchta» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa (6/6): Bu MVP da uch qism yetadi: sayt ko'rsatadi, Backend qoidani tekshiradi, Database bandlarni saqlaydi. (100)
- Tugadi (199): harakat paneli yopiladi, chizma butun enga chiqadi; vizual ⛶ ichida (q17).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → 6 ishni joylang (N/6) → Davom etish

## 3 · 1-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Ikki o'yinchi bir vaqtda 18:00 ni bosdi. Kim hal qiladi?** (10 so'z)
  - Sayt — birinchi bosgan telefonga beradi (39)
  - ✔ Backend — katak bo'shligini tekshiradi (38)
  - Database — ikkala bandni ham saqlaydi (37)
  - Ega — qo'ng'iroq qilib o'zi tanlaydi (36)
- Kalit: **B** (index 1). To'g'ri variant eng uzun emas; to'rttasi «qism — ish» shaklida (§204).
- To'g'ri izohi: Backend avval tekshiradi, Database esa bir xil kun va soatni ikki marta yozdirmaydi. (84) — audit 1: bir lahzadagi ikki so'rovga yakuniy himoya — jadvaldagi `kun + soat` noyobligi
- Xato izohlari (≤60):
  - A: Har telefon o'zini ko'radi — ikkinchisini qayerdan biladi? (58)
  - C: Ikkala band yozilsa, maydonga ikki jamoa keladi. (48)
  - D: Egasiga qo'ng'iroq — aynan biz hal qilayotgan muammo. (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Jadval `bandlar`  ← QTushuncha
- Eyebrow: Tushuncha · ma'lumot
- Sarlavha: **Bitta band uchun nimani yozib qo'yamiz?** (39)
- Mentor: Egasi har bandda kim va qachon kelishini bilishi kerak. Formaga va katakka qarab, kerakli ustunlarni bosing.
- Chap — sayt maketi (chizmadagi Sayt tugunining kattasi): Shanba · 18:00 tanlangan · forma: Ism «Ali» · Telefon «+998 90 000 00 01» · «Band qilish» (hozircha xira).
  Ostida 6 ustun-tugmasi: `kun` · `soat` · `ism` · `telefon` · `baho` · `tolov`
- O'ng — Database tugunidagi jadval kartasi `bandlar`: `id` va `yaratilgan` kulrang turibdi, yonida izoh «Database o'zi to'ldiradi»; to'rtta bo'sh ustun uzuq chiziqli (hisoblagich N/4).
- **Harakat → Vizual o'zgarish:** ustun-tugmasini bosish → to'g'ri bo'lsa ustun jadval sarlavhasiga kiradi va sayt maketida mos joy bir lahza yonadi
  (`kun` → «‹ Shanba ›» · `soat` → 18:00 katagi · `ism`, `telefon` → forma qatorlari). Noto'g'ri → tugma silkinadi, bir qator:
  - `baho`: Baho «qilmaymiz» ro'yxatida — jadvalga kirmaydi. (48)
  - `tolov`: To'lov «keyin» ro'yxatida — bugun ustun ochilmaydi. (51)
  4/4 da «Band qilish» yonadi → o'quvchi bosadi → jadvalga birinchi qator tushadi: `1 · 2026-10-10 · 18:00 · Ali · +998 90 000 00 01 · 2026-10-05 14:02`;
  sayt maketida 18:00 katagi band rangga o'tadi.
- Joriy qator (qator tushgach, bitta): Jadvaldagi har qator — bitta band.
- Xulosa: Ustunlar bugungi funksiyalardan chiqadi: kun, soat, ism, telefon. Baho va to'lov jadvalga kirmaydi. (99)
- Qator (`QIzoh`, xulosadan keyin; audit 1, 3): `kun` — sana, `telefon` — matn (+998 va bo'shliq son emas). Bir xil kun va soat jadvalda ikki marta turmaydi. (109)
- Tugadi: tugmalar paneli yopiladi, jadval va maket fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Ustunlarni tanlang (N/4) → Band qiling → Davom etish

## 5 · O'yinchining ikki yo'li  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tajriba · o'yinchi yo'llari
- Sarlavha: **Bo'sh kataklar ham Database'da turadimi?** (40)
- Mentor: Sayt kataklarni har ochilganda Backend'dan so'raydi. Qadamlarni bajaring va jadvalga qarang.
- Bashorat (ballsiz): **Database'da qaysi kataklar saqlanadi?** · Hamma kataklar — bo'shi ham, bandi ham · Faqat band qilingan kataklar
- Chapda qadam-ro'yxati (163.8, o'tgani ✓): 1 Shanbani oching · 2 17:00 ni band qiling · 3 Yakshanbaga o'ting
- O'ngda chizma: Sayt (maket) ↔ Backend → Database (`bandlar`: 4-ekrandagi bitta qator, 18:00 · Ali).
- **Harakat → Vizual o'zgarish:** har qadamda o'quvchi maketda bosadi, keyin ikki yo'l-tugmasidan birini tanlaydi: `GET /vaqtlar?kun=` · `POST /bandlar` →
  1. Shanba + `GET /vaqtlar?kun=` → konvert `GET /vaqtlar?kun=2026-10-10` Sayt → Backend; Backend → Database: shu kunning qatori yonadi (18:00); javob qaytadi —
     olti katak, 18:00 band, qolgani bo'sh. Sayt–Backend orasida birinchi yo'l qatori yoziladi.
  2. 17:00 → forma (Bek · +998 90 000 00 02) → «Band qilish» + `POST /bandlar` → konvert (`kun`, `soat`, `ism`, `telefon`) → Backend'da `bo'shmi? ✓` →
     jadvalga ikkinchi qator → saytda 17:00 band. Ikkinchi yo'l qatori yoziladi.
  3. Yakshanba + `GET /vaqtlar?kun=` → konvert `?kun=2026-10-11`; jadvaldagi ikki qator kulrang qoladi (ikkalasi shanba) → olti katak, hammasi bo'sh.
  Noto'g'ri yo'l-tugmasi → silkinadi, bir qator: kun ochishda `POST` — «Kunni ochish hech narsa yozmaydi — bu o'qish.» (45) · band qilishda `GET` — «Band qilish yangi qator yozadi — bu yozish.» (43)
- Joriy qator (2-qadamdan keyin, bitta): Har yo'l (route) — method va manzil: GET o'qiydi, POST yozadi. (62)
- Natija qatori: «Taxminingiz: hamma kataklar · haqiqatda: faqat bandlar» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Jadvalda faqat bandlar turadi. Ish vaqti Backend kodida — bo'sh kataklarni u shundan hisoblaydi. (96)
- Tugadi: qadam-ro'yxati yopiladi, chizma (ikki yo'l qatori bilan) fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 6 · 2-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Juma kuni oltita katakdan bittasi bo'sh. Jadvalda juma uchun nechta qator?** (11 so'z; kalitdagi son savolda yo'q — S-019)
  - Oltita — har katak uchun bitta qator (36)
  - Bitta — faqat bo'sh katak uchun qator (37)
  - ✔ Beshta — har band uchun bitta qator (35)
  - Hech biri — kataklar saytning o'zida (36)
- Kalit: **C** (index 2). Ma'lumot 5-ekrandan farq qiladi (u yerda olti katakdan ikkitasi band) — slayddan ko'chirib bo'lmaydi (§106).
- To'g'ri izohi: Jadvalda faqat bandlar turadi: besh band — besh qator, bo'sh katak yozilmaydi. (78)
- Xato izohlari (≤60):
  - A: Bo'sh katakni yozish shart emas — Backend uni hisoblaydi. (57)
  - B: Bo'sh katakda ism ham, telefon ham yo'q — nimani yozasiz? (57)
  - D: Sayt kataklarni Backend'dan oladi — ma'lumot jadvalda. (54)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 7 · Ega kirishi  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · ega kirishi
- Sarlavha: **Bandlar ro'yxatini kim ochib ko'ra oladi?** (41)
- Mentor: Ro'yxatda o'yinchilarning telefoni bor — uni begona ko'rmasligi kerak. Ega sahifasida qadamlarni bajaring.
- Bashorat (ballsiz): **Tokensiz `GET /bandlar` nima qaytaradi?** · Bandlar ro'yxatini · Bo'sh ro'yxatni · 401 xatosini
- Chapda qadam-ro'yxati (o'tgani ✓): 1 Ro'yxatni oching · 2 Parol bilan kiring · 3 Ro'yxatni qayta oching
- O'ngda chizma: Maydon egasi → Sayt (ega sahifasi: «Bandlar» tugmasi · parol katagi · «Kirish») ↔ Backend (`.env` belgisi) → Database (`bandlar`, 2 qator).
- **Harakat → Vizual o'zgarish:**
  1. «Bandlar» → konvert `GET /bandlar` (tokensiz) → Backend tuguni qizil yonadi, javob `401` → saytda «Avval kiring». Chizmada uchinchi yo'l qatori — qulf belgisi bilan.
  2. Parol (namuna «••••••») → «Kirish» → konvert `POST /kirish` → Backend parolni `.env` dagi `EGA_PAROLI` bilan solishtiradi, `✓` → javob — token
     (sayt maketida kichik yorliq `token: eyJhbGci…`). To'rtinchi yo'l qatori yoziladi.
  3. «Bandlar» → `GET /bandlar` + token → Backend tokenni tekshiradi `✓` → Database'dan ikki qator → saytda ro'yxat:
     «Shanba 17:00 · Bek · +998 90 000 00 02» · «Shanba 18:00 · Ali · +998 90 000 00 01». Qulf ochiladi, yo'l qatori yashil.
- Joriy qator (2-qadamdan keyin): Ega kirishi — oldingi darslardagi login: parol to'g'ri bo'lsa, Backend token beradi. (84)
- Natija qatori: «Taxminingiz: … · haqiqatda: 401 xatosi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: O'yinchi yo'llari hammaga ochiq. `GET /bandlar` esa faqat ega tokeni bilan ochiladi. (82)
- Qator (`QIzoh`, xulosadan keyin; audit 4): Bu — bitta egali MVP uchun sodda kirish. Katta tizimda har kimning paroli alohida va yashirin saqlanadi. (100)
- Tugadi: qadamlar yopiladi, chizma to'rt yo'l qatori bilan fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 8 · 3-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Agent ega parolini kodga yozib qo'ydi. Qayerga ko'chirasiz?** (8 so'z)
  - ✔ Backend'ning `.env` fayliga (25)
  - Saytning `App.jsx` fayliga (24)
  - `bandlar` jadvalining ustuniga (28)
  - Repo'dagi README fayliga (24)
- Kalit: **A** (index 0). Fayl/jadval nomi to'rtala variantda bor — kalit so'z faqat to'g'rida emas.
- To'g'ri izohi: `.env` `.gitignore` da — repo'ga qo'shilmaydi, kodni o'qigan odam parolni ko'rmaydi. (84)
- Xato izohlari (≤60):
  - B: Sayt kodi brauzerga boradi — parolni har kim ko'radi. (53)
  - C: `bandlar` — o'yinchilar bandi uchun, parol uchun emas. (52)
  - D: README — repo'ni ochgan hamma o'qiydigan fayl. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 9 · Stack tanlovi  ← QTushuncha (bashorat + bitta solishtirish; audit 5 — uch qatordan bittaga qisqardi)
- Eyebrow: Tushuncha · stack
- Sarlavha: **Yangi stack kerakmi?** (21)
- Mentor: Kodni agent yozadi, uni tekshirish esa sizning ishingiz. Ikki variantni bosib, qaysi kodni o'qiy olishingizga qarang.
- Bashorat (ballsiz): **MVP uchun qaysi texnologiyalarni tanlaysiz?** · Yangilarini — shu loyihada o'rganaman · Tanishlarini — tez qurib, sinayman
- Chap — bitta qator, ikki tugma: **Backend:** NestJS · Django (bitta funksiya — kataklar yo'li).
- O'ng — kod kartasi (3–4 qator, P-065) va ostida bir qator; tepada chizma tugunlari: «Sayt · React» va «Database · PostgreSQL (Neon)» oldindan yozilgan (tanish), «Backend · ?».
  - NestJS: `@Get('vaqtlar')` · `vaqtlar(@Query('kun') kun: string) {` · `  return this.bandlar.kataklar(kun)` · `}`
  - Django: `def vaqtlar(request):` · `    kun = request.GET['kun']` · `    return JsonResponse(kataklar(kun), safe=False)`
  Kod ostidagi qator: NestJS — «Bu kodni oldingi loyihalarda ko'rgansiz — o'qiy olasiz.» (55) · Django — «Bu shaklni hali loyihada ishlatmagansiz.» (40)
- **Harakat → Vizual o'zgarish:** tugma bosilsa kod kartasi o'sha texnologiya kodiga almashadi va ostidagi qator o'zgaradi; NestJS da Backend tuguniga nom yoziladi va tugun oq bo'ladi,
  Django da tugun kulrang «?» bilan qoladi. Ikkala tugma ko'rilgach ✓, tugunlar: **Sayt · React** · **Backend · NestJS** · **Database · PostgreSQL (Neon)**.
- Joriy qator (ko'rilgach): Birga ishlaydigan texnologiyalar to'plami — stack.
- Natija qatori: «Taxminingiz: yangilari · MVP uchun: tanishlari» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Maqsad — MVP ni tez qurib sinash. Stack tanish bo'lsa, agent kodini o'zingiz tekshirasiz. (88)
- Tugadi: tugmalar paneli yopiladi, chizma texnologiya nomlari bilan fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki variantni ko'ring (N/2) → Davom etish
- Izoh (MD uchun): Vue va MongoDB solishtiruvi olindi (audit 5 — dars yuki). «Nega tanish?» savoli — 10-ekranda (4-savol). Django kursda loyihada ishlatilmagan (grep `src/` — 0) — qator rost.

## 10 · 4-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Agent kodni yozadi. Nega baribir tanish stack tanlaysiz?** (9 so'z)
  - Yangi stack'da agent kodni yoza olmaydi (39)
  - Yangi stack internetga chiqa olmaydi (36)
  - Tanish stack'da Database kerak emas (35)
  - ✔ Tanish stack'da agent kodini o'qiysiz (37)
- Kalit: **D** (index 3). «Yangi» — 2 ta, «Tanish» — 2 ta (shakl-telli yo'q, §147); to'g'ri variant eng uzun emas.
- To'g'ri izohi: Kodni siz tekshirasiz: tanish shaklda xato qayerdaligini ko'rasiz. (66)
- Xato izohlari (≤60):
  - A: Agent ikkala stack'da ham yozdi — kodga qarang. (47)
  - B: Har qanday stack internetga chiqadi — gap unda emas. (52)
  - C: Bandlar baribir saqlanadi — Database har stack'da kerak. (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 11 · Deploy — qism qayerda turadi?  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tajriba · deploy
- Sarlavha: **Do'stingiz «Maydon»ni telefonidan ocha oladimi?** (47)
- Mentor: Hozir sayt va Backend sizning kompyuteringizda ishlaydi. Qadamlarni bajaring va natijaga qarang.
- Bashorat (ballsiz): **Do'st telefonida `localhost:5173` nima ko'rsatadi?** · «Maydon» sahifasini · Hech narsa — sahifa ochilmaydi
- Chapda qadam-ro'yxati: 1 Do'st telefonida oching · 2 Saytni internetga chiqaring · 3 Backend'ni internetga chiqaring
- O'ngda chizma ikki zonada: **Kompyuteringizda** — Sayt (`localhost:5173`), Backend (`localhost:3000`) · **Internetda** — Database · PostgreSQL (Neon), ostida «Neon — boshidan internetda».
  Chetda do'st telefoni ramkasi (191).
- **Harakat → Vizual o'zgarish:**
  1. «Ochish» → do'st telefonida «Sahifa ochilmadi». Joriy qator: `localhost` — har qurilmaning o'zi. Do'st telefoni sizning kompyuteringizni ko'rmaydi. (84)
  2. Sayt tugunini bosish → u «Internetda» zonasiga suriladi, manzili `localhost:5173` o'rniga «internetdagi manzil» bo'ladi → do'st telefonida «Maydon» sahifasi ochiladi,
     kataklar o'rnida «Kataklar yuklanmadi». Joriy qator: Saytni internetga chiqarish — deploy. Sahifa ochildi, kataklar esa yuklanmadi. (78)
     (Sayt hali `localhost:3000` dan so'rayapti — konvert do'st telefonidan chiqib, qizil uziladi.)
  3. Backend tugunini bosish → u ham «Internetda»ga suriladi, sayt–Backend chizig'i internet zonasi ichida yashil → do'st telefonida olti katak chiqadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: sahifa ochilmadi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Do'stingiz to'liq ishlatishi uchun sayt ham, Backend ham internetdan ochiladigan manzilda ishlasin. (99)
- Tugadi: qadamlar yopiladi, chizma ikki zona bilan fokusga (xizmat nomlari yo'q — TAYANCHGA SAVOL 9).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 12 · Yakuniy · band tartibi (jonli ball)  ← QTartib
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Bitta band chizma bo'ylab qanday yuradi?** (40)
- Mentor: O'yinchi shanba kuni 18:00 ni band qiladi. Bo'laklarni to'g'ri tartibda joylang.
- Beshta uya — faqat raqam 1–5 va izoh «bu yerga qo'ying» (tartibni ochmaydi).
- Bo'laklar (bu yerda to'g'ri tartibda; ekranda aralash; sudrash yoki bosish):
  1. O'yinchi 18:00 katagini bosadi
  2. Sayt `POST /bandlar` yuboradi
  3. Backend katak bo'shligini tekshiradi
  4. Database yangi qator yozadi
  5. Sayt katakni band qilib ko'rsatadi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Yechilgach xulosa: Band shu tartibda o'tadi: o'yinchi → sayt → Backend → Database → ekran. (71)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## A1 · Amaliyot 1 — Backend va Database  ← amaliyot bloki (QBlok, ≈20 daq)
- Eyebrow: Amaliyot 1 · Backend → Database
- Sarlavha: **«Maydon» Backend'ini oching va Database'ga ulang.** (49)
- Mentor: Chizmadagi ikki qism bugun `maydon` papkasida paydo bo'ladi — «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — GitHub'da `github.com/Azizbekcrypto/maydon` → «Fork» (o'z nusxangiz). Terminalda: `git clone https://github.com/{sizning login}/maydon.git` · `cd maydon`, papkani Antigravity'da oching. neon.tech da New project oching (nom: `maydon`) va «Connection string» ni nusxalang.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `maydon` papkasida `backend/` yarat — `README.md` dagi stack bo'yicha, port 3000.
     > `backend/.env` dagi `DATABASE_URL` bilan PostgreSQL'ga ulan. `.env` ni `.gitignore` ga qo'sh.
     > `bandlar` jadvalini yarat: `id`, `kun` (sana), `soat`, `ism`, `telefon` (matn), `yaratilgan`. Bitta `kun` + `soat` juftligi ikki marta yozilmasin.
     > `GET /` «Maydon Backend ishlayapti» deb javob bersin. Boshqa yo'l yozma.
  3. **Ishga tushirish** — `backend/.env` ga qator yozing: `DATABASE_URL=` va Neon'dan nusxa (oxiridagi `?sslmode=require` qoladi). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — brauzerda `localhost:3000`: «Maydon Backend ishlayapti». Neon'da jadvallar bo'limida `bandlar` jadvali paydo bo'ldi — 6 ustun, 0 qator.
  5. **O'z g'oyangiz** — qavs ichini o'z MVP ingiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     > `{loyiha papkasi}` da `backend/` yarat: NestJS va TypeORM, port 3000.
     > `backend/.env` dagi `DATABASE_URL` bilan PostgreSQL'ga ulan. `.env` ni `.gitignore` ga qo'sh.
     > `{jadval nomi}` jadvalini yarat: `{ustunlar}`.
     > `GET /` «{loyiha nomi} Backend ishlayapti» deb javob bersin. Boshqa yo'l yozma.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (terminal + jadval kartasi):
  - `$ npm run start:dev`
  - `[Nest] LOG Nest application successfully started`
  - `localhost:3000` → Maydon Backend ishlayapti
  - Neon · `bandlar` — `id · kun · soat · ism · telefon · yaratilgan` · 0 qator
- Hammasi bajarilgach (yashil): Backend ishlayapti va Database'ga ulandi: `bandlar` jadvali tayyor. (65)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-04-done` (keyin `backend/.env` ga `DATABASE_URL`)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## A2 · Amaliyot 2 — sayt va statik kataklar  ← amaliyot bloki (QBlok, ≈15 daq)
- Eyebrow: Amaliyot 2 · sayt
- Sarlavha: **Saytda shanba kunining vaqt kataklari ko'rinsin.** (48)
- Mentor: Kataklar hozircha namuna ma'lumotdan, Backend'ga 7-darsda ulanadi — «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — Backend terminali ishlab tursin. Ikkinchi terminalni `maydon` papkasida oching.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `maydon` papkasida `web/` yarat: React + Vite, port 5173.
     > `web/src/App.jsx`: sarlavha «Maydon», kun almashtirgichi «‹ Shanba ›» (strelkalar hozircha ishlamaydi) va olti vaqt katagi: 16:00 dan 21:00 gacha.
     > Kataklar namuna ma'lumotdan: 17:00 va 20:00 band, qolgani bo'sh. Band katak boshqa rangda, ustida «band» yozuvi.
     > Backend'ga hali so'rov yuborma. `backend/` papkasiga tegma.
  3. **Ishga tushirish** — terminalda `cd web`, `npm install`, `npm run dev` — xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — `localhost:5173`: «Maydon», «‹ Shanba ›», olti katak, 17:00 va 20:00 band rangda. Strelkalar hozircha hech narsani o'zgartirmaydi.
  5. **O'z g'oyangiz** — qavs ichini o'z MVP ingiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying:
     > `{loyiha papkasi}` da `web/` yarat: React + Vite, port 5173.
     > `web/src/App.jsx`: sarlavha «{loyiha nomi}», asosiy ekranda {nima ko'rinsin}.
     > Ma'lumot hozircha namuna: {namuna ma'lumot}. Backend'ga hali so'rov yuborma.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`, chizmadagi sayt maketining kattasi):
  - Maydon
  - ‹ **Shanba** ›
  - 16:00 · 17:00 band · 18:00 · 19:00 · 20:00 band · 21:00
- Hammasi bajarilgach (yashil): Skelet tayyor: sayt, Backend va Database ishga tushdi. (54)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-04-done`
- Nishon (bonus): Skeleton Ready — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 15 · Natijalar (podium) — jonli reyting
- Jonli reyting: 4 savol + yakuniy tartib + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 3 — «1 — Kim hal qiladi» · 6 — «2 — Jadval qatorlari» · 8 — «3 — Parol joyi» · 10 — «4 — Tanish stack» · 12 — «Yakuniy — band tartibi».

## 16 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun  ← QYakun
- Eyebrow: Tayyor · belgilar: ✓ Chizma va skelet tayyor · N/5 to'g'ri
- Sarlavha: **Chizma va loyiha skeleti tayyor.** (32)
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- ✓ Endi siz bilasiz (5):
  - Bu MVP da sayt ko'rsatadi, Backend qoidani tekshiradi, Database bandlarni saqlaydi.
  - Jadvalda faqat bandlar turadi; ish vaqti Backend kodida, bo'sh kataklarni u hisoblaydi.
  - Bandlar ro'yxati faqat ega tokeni bilan ochiladi.
  - Tanish stack'da agent yozgan kodni o'zingiz tekshirasiz.
  - Do'stingiz to'liq ishlatishi uchun sayt ham, Backend ham internetdan ochiladigan manzilda ishlashi kerak.
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda so'zlar: chizma · stack · skelet · deploy)
- Bosilgach karta «Uyga vazifa» (muddat — keyingi darsgacha):
  - Chizma — o'z MVP ingiz chizmasini chizing: qismlar, jadval ustunlari va yo'llar.
  - Skelet — bloklarda yozgan ikki promptingizni o'z loyihangiz papkasida yuboring.
  - Tekshirish — `localhost:5173` va `localhost:3000` ochiladi, jadval Neon'da ko'rinadi.
  - Keyingi dars — «Animatsiya: interfeys javob beradi». Bugungi statik kataklar bosilganda javob beradigan bo'ladi.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (5)
- **Booking Guard** — Katakni Backend tekshirishini bildingiz (3-ekran, 1-savol — birinchi urinishda)
- **Lean Table** — Jadvalda faqat bandlar turishini bildingiz (6-ekran, 2-savol)
- **Secret Safe** — Parolni `.env` ga ko'chirishni bildingiz (8-ekran, 3-savol)
- **Known Stack** — Tanish stack nega to'g'ri ekanini bildingiz (10-ekran, 4-savol)
- **Skeleton Ready** — Ikki amaliyot blokini oxirigacha bajardingiz (A2 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (§184)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`: Keeper/Stack/Table nomlari tekshirildi — Data Keeper, Token Keeper, Full Stack Explorer, Table Linker band).

## Qisqa takrorlash oynalari (5 — har ballik testga 3 karta)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Katakni Backend tekshiradi»
   - `POST /bandlar` · Ikki so'rov ham Backend'ga keladi — Har telefon o'zicha hal qila olmaydi.
   - `bo'shmi? → ha` · Birinchisi yoziladi — Katak band bo'ladi.
   - `kun + soat` noyob · Database ham himoya qiladi — Ikki so'rov bir lahzada kelsa ham ikkinchisi yozilmaydi.
   - Sinfga savol: Nega buni sayt hal qila olmaydi?
2. 2-savol (6-ekran) — «Jadvalda faqat bandlar»
   - `INSERT INTO bandlar …` · Band qilinganda — Jadvalga bitta qator qo'shiladi.
   - `SELECT soat FROM bandlar WHERE kun = …` · Backend o'qiydi — Shu kunning band soatlari.
   - `16:00 … 21:00` · Ish vaqti Backend kodida — Band bo'lmaganlari saytda bo'sh ko'rinadi.
   - Sinfga savol: Bo'sh katakni nega yozib qo'ymaymiz?
3. 3-savol (8-ekran) — «Parol `.env` da»
   - `EGA_PAROLI=…` · `.env` da turadi — Kodni o'qigan odam ko'rmaydi.
   - `.gitignore` → `.env` · Repo'ga qo'shilmaydi — Sirni kodga va README'ga yozmaymiz.
   - `process.env.EGA_PAROLI` · Backend shundan o'qiydi — Sayt kodida parol yo'q.
   - Sinfga savol: Sayt kodiga parol yozsak nima bo'ladi?
4. 4-savol (10-ekran) — «Tanish stack»
   - `@Get('vaqtlar')` · Tanish shakl — Kodni o'qib, tekshira olasiz.
   - `def vaqtlar(request):` · Yangi shakl — Avval o'rganishga to'g'ri keladi.
   - `agent → kod → siz` · Tekshiruv sizda — Tanish shaklda xatoni o'zingiz topasiz.
   - Sinfga savol: Agent xato qilsa, qaysi stack'da tezroq topasiz?
5. Yakuniy (12-ekran) — «Band tartibi»
   - `18:00` · O'yinchi bosadi — Sayt so'rov yuboradi.
   - `POST /bandlar` · Backend tekshiradi — Database qator yozadi.
   - `band` · Ekranda natija — Katak band rangda.
   - Sinfga savol: Backend tekshirmasa nima bo'ladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Kod yozishdan oldin nima chiziladi? | Chizma (arxitektura) | Qismlar, jadval va yo'llar |
| Katak bo'shligini qaysi qism tekshiradi? | Backend; Database esa bir xil kun va soatni ikki marta yozdirmaydi | Masalan: 18:00 ni ikki kishi bosdi |
| Bandlar qayerda saqlanadi? | `bandlar` jadvalida | Database — PostgreSQL (Neon) |
| Bo'sh kataklar jadvalga yoziladimi? | Yo'q | Ish vaqti Backend kodida — bo'shini u bandlardan hisoblaydi |
| Kataklarni qaysi yo'l olib keladi? | `GET /vaqtlar?kun=` | GET — o'qish |
| Yangi bandni qaysi yo'l yozadi? | `POST /bandlar` | POST — yozish |
| Ega qaysi yo'l bilan kiradi? | `POST /kirish` | Parol to'g'ri bo'lsa — token |
| Tokensiz `GET /bandlar` nima qaytaradi? | 401 (ruxsat yo'q) | Ro'yxat faqat egaga ochiladi |
| Ega paroli qayerda turadi? | Backend'ning `.env` faylida | `.env` `.gitignore` da — repo'ga qo'shilmaydi |
| «Maydon» qaysi stack'da quriladi? | React · NestJS · PostgreSQL | Tanish stack — agent kodini o'qiysiz |
| Do'stlar ochishi uchun «Maydon» bilan nima qilinadi? | Deploy (internetga chiqarish) | Sayt ham, Backend ham internetga |
| Loyiha skeleti (shabloni) nima? | Qismlari ulangan boshlang'ich loyiha | Funksiyalar keyingi darslarda qo'shiladi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni qurilgandan keyin o'zgarmaydi
1. «Maydon» MVP siga qaysi qismlar yetadi? ✔ Sayt, Backend va Database · Faqat sayt — hammasi brauzerda · Sayt, Backend, AI va Bot · Faqat Database va bitta jadval
2. Vaqt kataklarini ekranda qaysi qism chizadi? Backend — u kataklarni hisoblaydi · ✔ Sayt — u o'yinchiga ko'rsatadi · Database — u bandlarni saqlaydi · Agent — u kodni yozib bergan
3. Yangi band qilinganda `bandlar` jadvaliga nima qo'shiladi? Yangi ustun · Yangi jadval · ✔ Yangi qator · Yangi yo'l
4. `baho` ustuni nega jadvalda yo'q? Database bahoni saqlay olmaydi · Bahoni sayt o'zi hisoblab chiqadi · Jadvalda ustunlar soni cheklangan · ✔ Baho «qilmaymiz» ro'yxatida
5. Sayt kataklarni qaysi yo'ldan oladi? ✔ `GET /vaqtlar` · `POST /bandlar` · `POST /kirish` · `GET /bandlar`
6. Dushanba uchun jadvalda qator yo'q. Saytda nima ko'rinadi? Kataklar umuman chiqmaydi · ✔ Olti katak, hammasi bo'sh · Olti katak, hammasi band · Sayt xatoni ko'rsatib qo'yadi
7. Kimdir tokensiz bandlar ro'yxatini so'radi. Backend nima qiladi? Ro'yxatni to'liq qaytaradi · Bo'sh ro'yxat qaytaradi · ✔ 401 bilan rad etadi · Saytni yopib qo'yadi
8. Ega to'g'ri parol yozdi. `POST /kirish` nima qaytaradi? Bandlar ro'yxatini · Parolning o'zini · Kataklar ro'yxatini · ✔ Ega uchun tokenni
9. `.env` repo'ga qo'shilmasligi uchun nima qilinadi? ✔ U `.gitignore` ga yoziladi · Fayl nomi o'zgartiriladi · Fayl `web/` ga ko'chiriladi · Ichidagi qatorlar o'chiriladi
10. Stack nima? Bitta katta dastur fayli · ✔ Birga ishlaydigan texnologiyalar · Saytdagi tugmalar va sahifalar · Database'dagi jadvallar ro'yxati
11. Sayt internetda, Backend kompyuteringizda. Do'st nimani ko'radi? Hamma kataklarni ko'radi · Hech narsa — sahifa ochilmaydi · ✔ Sahifani, lekin kataklarsiz · Faqat band kataklarni
12. Kod yozishdan oldin chizma nega kerak? Kod o'zi ancha tezroq ishlay boshlaydi · Saytning dizayni ancha chiroyli chiqadi · Keyin deploy qilish umuman shart bo'lmaydi · ✔ Agentga qism va yo'llarni aniq aytasiz

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har harf 3 marta).
Fon so'zlari: React · NestJS · PostgreSQL · Neon · `bandlar` · `GET /vaqtlar` · `POST /bandlar` · `POST /kirish` · token · `.env` · `localhost:5173` · deploy · stack · chizma
Ekran testlari bilan takror yo'q (§144): 1-savol (kim hal qiladi) ↔ arena 2 (kim chizadi) · 2-savol (juma, nechta qator) ↔ arena 6 (dushanba, nima ko'rinadi) ·
3-savol (parol joyi) ↔ arena 9 (`.gitignore`) · 4-savol (nega tanish) ↔ arena 10 (stack nima).

---

## KOD — qurishda kerak bo'ladigan narsalar (qolipda yo'q)
1. **`MAYDON_NODES` + `MaydonChizma`** — bitta manba (180): 2 odam, 3 qism, 4 yo'l qatori (uzuq → ochilgan → qulf/qizil/yashil), «Keyin» qutisi, ikki zona («Kompyuteringizda» · «Internetda»),
   konvert + yo'l yorlig'i, `.env` belgisi. Ekranlar 0, 1, 2, 4, 5, 7, 9, 11 shundan o'qiydi; A1/A2 kutilgan natija — tugunlarning kattasi. Bosiladigan qismlar `// qolip-maket: …` bilan e'lon qilinadi.
2. **`SaytMock`** holatlari: kataklar (bo'sh · band · tanlangan), kun tugmalari, forma (Ism · Telefon · «Band qilish»), «Band qilindi», ega sahifasi («Bandlar», parol, «Kirish», ro'yxat, «Avval kiring»),
   «Kataklar yuklanmadi», «Sahifa ochilmadi». **`TelefonMock`** (191 ramka) — 0-ekranda ikkita, 11-ekranda do'st telefoni. **`JadvalMock`** `bandlar` — kulrang ustunlar, qator qo'shilishi, o'qilgan qator yonishi.
3. 0-ekran `QKirish`: agent chati (2 pufak) + ikki telefon; 18:00 bosilmaguncha variantlar xira; javobdan keyin uzuq bo'sh joy.
4. `QTushuncha` ekranlari (`zoom`, `tugadi` majburiy): 2 — saralash (6 tugma + «Keyin» zona, N/6) · 4 — ustun-tanlash (6 tugma, N/4) + «Band qilish» · 5 — `QQadamlar` + har qadamda 2 yo'l-tugmasi ·
   7 — `QQadamlar` (401 → token → ro'yxat) · 9 — 3 qator × 2 tugma + kod kartasi (6 namuna, `fmtCode`) · 11 — `QQadamlar` + zonaga surish.
   Bashorat (`QBashorat`/`QTaxmin`) — 2, 5, 7, 9, 11-ekranlarda, ballsiz, `onAnswer` ga kirmaydi.
5. Testlar `QTest` + `QuestionScreen`: 3 (**B**, index 1) · 6 (**C**, 2) · 8 (**A**, 0) · 10 (**D**, 3); yakuniy 12 — `QTartib` (5 bo'lak). `INLINE_KEYS` shu indekslar bilan.
6. **`ScreenBlok` ×2** (`NamunaDars.jsx`): **5 qadam** — 5-qadam «O'z g'oyangiz» (prompt `{…}` + «Nusxalash», qaror 8). `QBlok` 5 qadamni ko'taradimi — tekshiriladi (TAYANCHGA SAVOL 11).
   `ortda` ikkala blokda: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-04-done`.
7. `RECAPS` 5 (kalit = 3, 6, 8, 10, 12) · `Q_LABELS` shu 5 · `ACHIEVEMENTS` 5, `ACH_TRIGGERS`: 3 → Booking Guard, 6 → Lean Table, 8 → Secret Safe, 10 → Known Stack, A2 oxirgi «Bajardim» → Skeleton Ready.
8. `QUIZ_BANK` 12 (✔ A·B·C·D ×3) · `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emojisiz.
9. `SCREEN_META` 18: hook · plan · concept · test · concept · concept · test · concept · test · concept · test · concept · final · practice · practice · stats · flashcards · summary.
10. `LESSON_META.lessonId` `mvp-architecture-07-04-v1` · App.jsx `m7-04` ga `comp: MvpArchitectureLesson` (asosiy seans, «qur» bosqichi).
11. Darvozalar: `npm run gates -- src/7-Modull/MvpArchitectureLesson.jsx` 12/12 · `lint:jsx` · `lint:olchov` · `lint:emoji` · surat 1280 + 393.

## REPO — `maydon` (yangi; «qur» bosqichida yoziladi, push — buyruq bilan)
1. **`dars-04-done`** (A1 + A2 namunasi):
   - `README.md` — «Maydon» nima, papkalar (`web/` sayt · `backend/` Backend), ikki terminal, `.env` eslatmasi, «Darslar va teglar» jadvali (4-dars qatori).
   - `.gitignore` — `.env`, `node_modules`, `dist`.
   - `backend/` — NestJS, port 3000; TypeORM + PostgreSQL (`DATABASE_URL`, `synchronize: true`); entity `Band` → jadval `bandlar`: `id` (serial) · `kun` (date) · `soat` (varchar, `18:00`) ·
     `ism` · `telefon` (varchar) · `yaratilgan` (default now); `@Unique(['kun', 'soat'])` (audit 1); ish vaqti — Backend konstantasi `KATAKLAR` (16:00 … 21:00, 7-darsda `GET /vaqtlar` o'qiydi);
     upstream `main` dagi `README.md` — «Stack: sayt — React (Vite) · Backend — NestJS + TypeORM · Database — PostgreSQL (Neon)» (A1 prompti shunga tayanadi, P-060); `GET /` → «Maydon Backend ishlayapti»; `backend/.env.example` — `DATABASE_URL=` izoh bilan («Neon → Connection string»).
   - `web/` — Vite + React, port 5173; `App.jsx`: «Maydon», kun almashtirgichi «‹ Shanba ›» (strelkalar 7-darsda ishlaydi), olti katak 16:00–21:00, namuna ma'lumotda 17:00 va 20:00 band; Backend'ga so'rov yo'q.
2. **Keyingi darslar uchun ochiq qoldi:** `GET /vaqtlar` (7-dars) · `POST /bandlar`, `POST /kirish`, `GET /bandlar`, `EGA_PAROLI`, `JWT_SECRET` (9-dars) · CORS (7-dars) — chizmada bor, kodda yo'q.
3. Boshlang'ich teg (`dars-04-start`) yo'q — A1 bo'sh papkadan boshlanadi; ortda qolgan o'quvchi `dars-04-done` ni oladi (TAYANCHGA SAVOL 7).

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim)
1. **«chizma» — «sxema» emas.** Nega: 8-Modul 1-dars «Komponentlardan tizim» va 13-darsda «chizma» (arxitektura chizmasi); kursda «sxema» — Database jadvallari tuzilishi (m4-01 «JSON, jadval, sxema»).
   Topshiriqdagi «Maydon» sxemasi = darsda «Maydon» chizmasi. App.jsx `m7-04` osti yozuvi «… — sxema» → «… — chizma» bo'lishi kerakmi (P-015: reja ↔ App.jsx so'zma-so'z)? Qaror asosiy seansda.
2. **«stack» — «stek» emas.** Nega: kursda o'rgatilgan so'z — m2-10 «PERN Stack», ta'rif «Birga ishlaydigan texnologiyalar». Dastur matnidagi «stek» o'quvchiga yangi yozuv bo'lardi.
3. **Kataklar oralig'i — 16:00 dan 21:00 gacha, olti soatlik katak** (oxirgisi 21:00–22:00). Tayanchda soatlar yo'q; 5, 7, 10-darslar ham shu oraliqni ishlatishi kerak.
4. **`kun` — sana (`2026-10-10`), hafta kuni nomi emas.** Nega: «shanba» yozilsa band har shanbaga tegib qoladi (T-045 — yolg'on model). Saytda «Shanba» ko'rinadi, `?kun=2026-10-10` yuboriladi.
5. **Namuna qatorlar:** `Ali · +998 90 000 00 01 · 18:00`, `Bek · +998 90 000 00 02 · 17:00` — qahramon emas, jadvaldagi ma'lumot; telefon ataylab soxta (`000 00 0N`). Boshqa ism kerakmi?
6. **`.env` nomlari:** `EGA_PAROLI` (ega paroli) va `JWT_SECRET` (m4-11 dagi nom). 9-dars shu nomlar bilan qurishi kerak.
7. **Repo manzili `github.com/Azizbekcrypto/maydon`** — taxmin (TelegramBotNest egasi bo'yicha). Boshlang'ich teg yo'q: A1 bo'sh papka + `git init`; «Ortda qoldingizmi» ikkala blokda `dars-04-done`.
8. **`GET /vaqtlar` 4-darsda yozilmaydi** — tayanch jadvalida u `dars-07-done` da. 4-dars Backend'ida faqat `GET /` (holat matni) va `bandlar` jadvali; yo'llar faqat chizmada. 7-dars MD si bilan kelishish kerak.
9. **Deploy joylari** (sayt va Backend qaysi xizmatga — masalan Vercel, Render) tayanchda yo'q; bu darsda nomsiz «Internetda» zonasi. 9-dars MD si nomlaydi.
10. **Eyebrow «Dars · kirish»** (platforma standarti, 6-Modulda 6 dars) va «ega kirishi» / `POST /kirish` — bitta darsda «kirish» ikki ma'noda (T-015). Eyebrowni «Dars · boshlanish» qilaymi?
11. **Blokda 5 qadam** (4 + «O'z g'oyangiz», qaror 8) — P-059 dagi 4 qadamdan bittaga ko'p; 6, 7, 8, 9, 11-darslar bloklari ham shunday bo'ladimi, `QBlok` 5 qadamni sig'diradimi.
12. **«prompt», «talab» emas.** Tayanch «talab»ni o'quvchi agentga yozadigan matn deydi; blok qolipi va qaror 8 «prompt» deydi. Bu darsda faqat «prompt» — 7-dars «talab»ni boshlasa, ikkalasi bitta tushuncha bo'lib qoladi.

## Shubhali joylar (ishonchim komil emas)
- 0-ekran: ~~«Agent bandni o'yinchining telefonida saqladi»~~ — audit bilan «Bu misolda …» qilindi (T-043). Mentor buni «bitta gapda berdik» bilan bog'laydi.
- 3-ekran to'g'ri izohi «ikkinchisida katak allaqachon band» — bir vaqtdagi ikki so'rovning soddalashtirilgan modeli (aslida Database cheklovi ham kerak); 13 yoshga yolg'on emas, lekin to'liq ham emas.
- (audit 5 bilan qisqardi — faqat NestJS/Django) 9-ekran kod namunalari — o'quvchi o'qimaydi, faqat «tanish emas»ligini ko'radi; kod to'g'ri, lekin ekran kodga boy (P-052 — bitta vizual: kod kartasi + chizma tugunlari).
- 11-ekran «Saytni internetga chiqaring» — darsda simulyatsiya; haqiqiy deploy 9-darsda. Xulosa buni aytadi.
- A1 1-qadam ikki ish (papka + Neon) — bitta qadamga og'ir; ajratilsa 6 qadam bo'ladi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-03` «Besh suhbatdan qaysi muammo chiqdi?» → **`m7-04` «Mini-MVP arxitekturasi»** → `m7-05` «Animatsiya: interfeys javob beradi».
  Osti yozuvi «— sxema» bilan chizma so'zi farqi — TAYANCHGA SAVOL 1.
- [x] Bitta misol-ip («Maydon», tayanch 1-bo'lim) · metafora yo'q · bitta vizual dars bo'yi — «Maydon» chizmasi `MAYDON_NODES` (0, 1, 2, 4, 5, 7, 9, 11; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (saralash), 4 (ustun), 5 (yo'l tanlash), 7 (401 → token), 9 (kod solishtirish), 11 (zonaga surish); 0-ekran ham harakatli.
- [x] Sarlavhalar ≤55 bitta qator (25–50) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosalar ≤110 (54–100) · hook javobi ≤120 (118/101) · xato izohlari ≤60 (42–58).
  Belgilar soni Python `len()` bilan sanaldi (skript scratchpad'da).
- [x] Atamalar oldingi darslar bilan: qism · tizim · arxitektura · chizma (m6-01) · route = method + path (m4-05) · login · token · 401 · `.env` (m4-11) · stack (m2-10) · deploy — internetga chiqarish (§196) ·
  Neon «Connection string», `?sslmode=require` (5-Modul 4-dars) · skelet (shablon) (§213) · siz-forma; Antigravity promptlari — T-002 istisnosi · tugma ot-shaklda.
- [x] Testlar: variantlar uzunligi yaqin (3: 36–39 · 6: 35–37 · 8: 24–28 · 10: 35–39), to'g'ri variant eng uzun emas; kalit so'z/strelka/qavs faqat to'g'rida emas · ✔: 3 — B, 6 — C, 8 — A, 10 — D ·
  arena A·B·C·D ×3 · inkor-savol yo'q (arena 4 «nega yo'q?» — sabab-savol, rad etishga majburlamaydi).
- [x] Final (12-ekran): uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [x] Emoji yo'q (nishon medali, arena — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — grep 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (T6, P1, «Modul 9», m4-11 — faqat MD izohlarida) · real kompaniya raqami yo'q · tarixiy voqea yo'q · «KOD» (11) va «REPO» (3) ro'yxati to'liq.
- [x] Karta T · P · S — ko'rildi: T-002/011/014/015/029/039/047/052/064 · P-001/010/013/015/036/046/052/059/062/064/065/067 · S-001/004/006/008/010/015/019/026.
  ✗ P-059 (blok 4 qadam) — qaror 8 bilan 5 qadam (TAYANCHGA SAVOL 11) · ✗ T-015 «kirish» ikki ma'noda (TAYANCHGA SAVOL 10) · P-028 neon.tech yozuvlari 5-Moduldagidek, «jadvallar bo'limida» (aniq menyu nomisiz, 08-q1 kabi).

---

# 9-Modul · 5-dars «Animatsiya: interfeys javob beradi» — MD v3

Fayl: `src/7-Modull/AnimationLesson.jsx` · 20 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Kalit `m7-05` · TEX (modulning texnik cho'qqisi) · qolip: texnik dars (QTushuncha, QKod, QTest) + bitta amaliyot bloki.
Menyu nomi (DE-205, App.jsx `m7-05`): «Animatsiya: interfeys javob beradi» · oldingi — `m7-04` «Mini-MVP arxitekturasi» · keyingi — `m7-06` «Birinchi odam kirganda nimani ko'rasiz?».
Fidbek: qator yoniga `>> …`. Tasdiqlangach (GATE M) dars shu holatga keltiriladi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) kodda o'zgarmaydi.
Vaqt: ≈ 90 daqiqa, shundan amaliyot bloki ≈ 25.

---

Tashqi audit (ChatGPT) Filtri: `05-FILTR.md` — 05.10.2026 (atamalar ta'rifi — 05-q0 javobidan keyin).

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9):** dars oxirida «Maydon» saytining uchta elementi bosishga javob beradi — o'quvchi ularni avval kod oynasida **qo'lda** yozadi
   (QKod, qaror 4), keyin repo `maydon` ga qo'shadi (teg `dars-05-done`):
   1) vaqt katagi bosilganda kichrayib qaytadi (`transform` + `transition`);
   2) band bo'lgan katakning rangi silliq o'zgaradi (`transition`);
   3) «Band qilindi» belgisi Motion bilan chiqadi va so'nib ketadi.
2. **Bugungi asosiy fikr (P-013):** Animatsiya bezak emas: u odamga «bosildi», «o'zgardi», «tayyor» deb javob beradi.
   Ortiqcha harakat va `prefers-reduced-motion` — bitta qisqa joyda (12-ekran).
3. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim):**
   - **sayt** — React ilova (`web/`, `localhost:5173`); **Backend**, **Database** — bugun ishlatilmaydi (band qilish hozircha faqat saytda — TAYANCHGA SAVOL 2).
   - **vaqt katagi** (qisqasi **katak**) — bitta soatlik oraliq, masalan 18:00–19:00. **band qilish · band** — katakni egallash · egallangan katak. **o'yinchi** — saytdan foydalanadigan o'smir.
   - **animatsiya** — interfeysdagi ko'rinadigan harakat yoki holatning silliq o'zgarishi; bu darsda — holat o'zgarishini silliq ko'rsatadiganlari (3-ekranda, harakatdan keyin tug'iladi; GATE M 05-q0).
     **mikro-harakat** — foydalanuvchi harakatiga yoki holat o'zgarishiga berilgan kichik vizual javob; bizning misolda — bosilgan katak kichrayadi (5-ekran xulosasida, bir marta + kartochka).
   - **`transform`** — elementni kichraytiradi yoki kattalashtiradi, qo'shni elementlar joyida qoladi (bugun faqat `scale`). **`:active`** — element bosib turilgan payt.
   - **`transition`** — o'zgarishni bir zumda emas, berilgan vaqt ichida silliq bajaradi: qaysi xususiyat va qancha vaqt (`0.15s` — 0.15 soniya).
   - **Motion** — React uchun animatsiya kutubxonasi; matnda **bir marta** (9-ekran): «Motion (oldingi nomi Framer Motion)». Paket `motion`, import `motion/react`.
     `motion.div` · `initial` (chiqishdan oldingi holat) · `animate` (kelib to'xtaydigan holat) · `exit` (ketayotgandagi holat) · `AnimatePresence` (React elementni olib tashlayotganda `exit` animatsiyasini ishlatishga imkon beradi).
   - **`prefers-reduced-motion`** — qurilmada harakatni kamaytirish yoqilganini sayt shu orqali biladi.
   - **belgi** — faqat «Band qilindi» belgisi ma'nosida (tayanch 3-bo'lim). **hodisa** so'zi bu darsda **ishlatilmaydi** — u 6-darsda analitika ma'nosida keladi (T-015).
   - **prompt** — Antigravity'ga yoziladigan matn (6-Moduldan, qaror 8 so'zi); «talab» 7-darsda (TAYANCHGA SAVOL 5).
4. **O'tilgan so'zlar (grep, so'zma-so'z olingan):** Selektor · Xususiyat · Qiymat; klass nuqta bilan `.row`; `color` — matn rangi, `background-color` — fon rangi; hex kod (rang raqami) —
   `src/1-Modull/CssLesson1.jsx` (`m1-06`). `className`, `onClick`, `useState` — 3-Modul React darslari. `npm install` — «kerakli kutubxonalarni yuklab oladi» (`ReactFirstComponentLesson`).
   hover — «sichqoncha ustiga kelganda» (`src/2-Modull/PracticeLesson1.jsx`, faqat arena distraktorida). Antigravity, repo, teg, «Shu xato chiqdi: {xato}. Tuzat.» — 6-Modul bloklari.
   `transition`, `transform`, `:active`, Motion — **yangi** (korpus §39: avval oddiy gap, keyin nom).
5. **Metafora yo'q** (tayanch). Qahramon yo'q — vazifani Mentor beradi.
6. **Toza yuza (185, D4):** tugma, variant va maket ichida emoji yo'q; maket chizilgan (CSS/SVG), logotip yo'q; rang — faqat holat foni.
7. **Manbalar (o'quvchiga ko'rinmaydi):** Motion — https://motion.dev/docs/react-quick-start («Motion for React (previously Framer Motion)», `npm install motion`, `import { motion } from "motion/react"`),
   https://motion.dev/docs/react-animate-presence (`exit` faqat `AnimatePresence` ichida, bevosita bolaga `key`), https://motion.dev/docs/react-accessibility
   (`MotionConfig reducedMotion="user"` — transform va layout animatsiyasini o'chiradi, `opacity` va `backgroundColor` qoladi) — 05.10.2026 tekshirildi.
   `prefers-reduced-motion` — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion («discomfort for those with vestibular motion disorders»; sozlama joylari:
   iOS Settings › Accessibility › Motion · Android Settings › Accessibility › Remove animations · Windows 11 › Accessibility › Visual Effects › Animation Effects) — o'quvchi matniga menyu nomi kirmaydi (P-028).

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. O'tgan darsda skelet ishga tushdi (`dars-04-done`):
  saytda statik vaqt kataklari bor, lekin bosilsa ekranda hech narsa o'zgarmaydi. Bugun shu kataklar javob beradi; kod — repo `maydon`, `dars-05-done`.
- **Hook:** o'quvchi katakni bosadi — ekran jim → «band bo'ldimi?» → sayt band qilgan, ekran ko'rsatmagan.
- **Bitta vizual — «Maydon» maketi** (bitta manba `KATAKLAR`, 163/180) + yonida kod parchasi (`App.css` yoki `App.jsx`); kod va maket birga o'zgaradi (09-dars naqshi):
  - brauzer oynasi (nuqtalar + manzil `localhost:5173`), ichida sarlavha «Maydon», kun yorlig'i «Shanba» (bosilmaydi), 6 ta vaqt katagi, 2 ustunda:
    16:00–17:00 · 17:00–18:00 **band** · 18:00–19:00 · 19:00–20:00 · 20:00–21:00 **band** · 21:00–22:00 (namuna ma'lumot — TAYANCHGA SAVOL 1);
  - katak holatlari: bo'sh (oq) · bosib turilgan (95%) · band (kulrang, kichik yozuv «band»); kataklar ostida belgi joyi: yo'q · chiqmoqda · turibdi · ketmoqda («Band qilindi: 18:00»);
  - maket rejimlari: **jim** (animatsiyasiz) · **javob beradi** (uch element) · **sekin ko'rsatish** (10 baravar sekin, oraliq holatlar xira chiziladi) · **harakat kamaytirilgan**.
  - Ishlatilishi: 0, 1, 2, 3, 6, 9, 10, 12, 14, 16 (A-blok o'ng tomoni — shu maketning kattasi). `prefers-reduced-motion` da maketning o'z harakati ham to'xtaydi (DE-200).
- **Rang yo'li** (bitta manba `RANG_YOLI`, 6-ekran «sekin ko'rsatish» yorliqlari va 15-ekran finali, P-063): O'yinchi katakni bosadi · Katakka `band` klassi qo'shiladi ·
  Brauzer 0.3 soniya oraliq ranglarni chizadi · Katak kulrang bo'lib qoladi.
- **Yakun:** Maydon bosishga javob beradi · keyingi dars — kim saytda nima qilayotganini o'lchash.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Bosganingizdan keyin katak band bo'ldimi?** (41)
- Mentor: O'tgan darsda Maydon sayti ishga tushdi, kataklar ekranda turibdi. Maketda 18:00–19:00 ni bir marta bosing.
- Maket (chap): «Maydon» maketi **jim** rejimda — 6 katak, 17:00–18:00 va 20:00–21:00 kulrang «band», qolgani oq.
- **Harakat → Vizual o'zgarish:** 18:00–19:00 ni bosish → ekranda hech narsa o'zgarmaydi: katak o'lchami ham, rangi ham o'sha, pastda yozuv yo'q. Shundan keyin variantlar faollashadi.
- Variantlar (radio, ballsiz):
  - Ha, endi katak band bo'ldi
  - Yo'q, katak bo'sh qoldi
  - ✔ Ekrandan bilib bo'lmaydi
- Javob — 3-variant: **Aynan!** Sayt katakni band qildi, ekran esa jim qoldi. O'yinchi yana bosadi yoki chiqib ketadi. (93)
- Javob — 1-variant: **Qiziq fikr!** Rost, sayt band qildi — lekin ekranda buni ko'rsatadigan hech narsa o'zgarmadi. (91)
- Javob — 2-variant: **Qiziq fikr!** Aslida sayt band qildi — ekran buni ko'rsatmadi, shuning uchun katak bo'sh ko'rindi. (96)
- Javobdan keyin: maket ostida kulrang qator ochiladi — «Sayt ichida: 18:00–19:00 — band»; katak esa hamon oq (sayt bilgan narsani ekran aytmagani ko'rinadi).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun Maydon'ga uchta animatsiya yozasiz.** (41)
- Mentor: Avval har birini shu yerda sinab ko'rasiz, keyin Maydon repo'siga o'zingiz yozasiz.
- Chap — «Dars oxirida»: maket **javob beradi** rejimida, bir marta o'zi o'ynaydi (DE-200): 18:00–19:00 bosiladi → kichrayib qaytadi → rangi silliq kulranglashadi →
  pastdan «Band qilindi: 18:00» chiqadi va 3 soniyadan keyin so'nadi.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` bilan mos — P-015):
  - 01 · Bosilgan katak kichrayib qaytadi · `transform`
  - 02 · Band katakning rangi silliq o'zgaradi · `transition`
  - 03 · «Band qilindi» belgisi chiqib, so'nadi · `Motion`
  - 04 · Uchalasi Maydon repo'sida ishlaydi · `repo`
- Pastki qator (mono, kichik): repo `maydon` · boshlanish `dars-04-done` · tayyor namuna `dars-05-done`
- Tugmalar: Orqaga · Boshlaymiz

- O'qituvchi eslatmasi (audit, dars hajmi): 2–3 va 6-ekranlarga ortiqcha vaqt bermang — Motion (9–11-ekranlar) darsning yangi va eng qiyin qismi.

## 2 · Katak kichrayadi  ← QTushuncha
- Eyebrow: Tushuncha · transform
- Sarlavha: **Bosilgan katak qanchaga kichraysin?** (35)
- Mentor: Ko'p ilovalarda tugma barmoq ostida biroz cho'kadi — odam shundan bosilganini sezadi. Qiymatni tanlang va 18:00–19:00 ni bosib turing.
- Bashorat (ballsiz, 181): **Katak kichraysa, qo'shni kataklar nima bo'ladi?** · Ular ham suriladi · Joyida qoladi · Ular ham kichrayadi — tanlov saqlanadi.
- Chap — kod (`App.css` parchasi), qiymat tugmalari pulsatsiya halqasi bilan (168): `1` · `0.95` · `0.8`
  ```css
  .katak:active {
    transform: scale(1);
  }
  ```
  Kod yonida kulrang izoh: `:active` — bosib turilgan payt.
- O'ng — maket (**jim** rejim).
- **Harakat → Vizual o'zgarish:** qiymatni bosish → kodda qiymat almashadi; 18:00–19:00 ni bosib turish → katak tanlangan o'lchamga kichrayadi
  (`1` — o'zgarmaydi · `0.95` — biroz cho'kadi · `0.8` — yozuvi bilan birga ancha kichrayadi), qo'yib yuborilganda bir zumda qaytadi.
  Qo'shni kataklar joyidan qimirlamaydi — ularning chegarasi bir lahza yonadi.
- Nom qatori (3/3 dan keyin, bitta): Elementni shunday kichraytirish yoki kattalashtirishni `transform` qiladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: joyida qoldi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: `transform: scale(0.95)` katakni 95% gacha kichraytiradi, qo'shni kataklar joyida qoladi. (87)
- Tugadi (199): qiymatlar paneli yopiladi, maket va kod butun enga; vizual ⛶ ichida (q17).
- Tugma (pastki): 3 qiymatni sinang (N/3) → Davom etish

## 3 · Sakrab yoki silliq  ← QTushuncha
- Eyebrow: Tushuncha · transition
- Sarlavha: **Kichrayish qancha vaqt davom etsin?** (35)
- Mentor: Hozir katak bir zumda cho'kib, bir zumda qaytadi — ko'z buni sakrash deb ko'radi. Vaqtni tanlang va katakni bosing.
- Bashorat (ballsiz): **0.15 soniya ko'zga qanday ko'rinadi?** · Sezilmaydi · Silliq · Sekin (bitta o'lchovning uch darajasi, o'sish tartibida — §43).
- Chap — kod, vaqt tugmalari pulsatsiyada: `0s` · `0.15s` · `1s`; izoh: `s` — soniya.
  ```css
  .katak {
    transition: transform 0s;
  }
  .katak:active {
    transform: scale(0.95);
  }
  ```
- O'ng — maket + kalit «Sekin ko'rsatish»; katak ostida kichik soniya hisoblagichi.
- **Harakat → Vizual o'zgarish:** vaqtni bosish → kodda vaqt almashadi; katakni bosish → `0s` — sakraydi · `0.15s` — silliq cho'kib, silliq qaytadi ·
  `1s` — sekin kichrayadi va qo'yib yuborilgach ham sekin qaytadi, hisoblagich «1.0 s» gacha boradi.
  «Sekin ko'rsatish» yoqilsa `0.15s` 10 baravar sekin o'ynaydi, katak atrofida oraliq o'lchamlar xira chiziladi (100% → 98% → 96% → 95%).
- Nom qatori (3/3 dan keyin): Interfeysdagi shunday ko'rinadigan harakat — animatsiya; bu darsda biz holat o'zgarishini silliq qilamiz. CSS'da unga vaqtni `transition` beradi.
- Natija qatori: «Taxminingiz: … · haqiqatda: silliq».
- Xulosa: `transition` o'zgarishni berilgan vaqt ichida silliq bajaradi. Maydon'da kichrayish — 0.15 soniya. (96)
- Tugadi (199) · Tugma (pastki): 3 vaqtni sinang (N/3) → Davom etish

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Katak bosilganda sakrab kichrayadi. Kodga nima qo'shasiz?** (8 so'z)
  - `scale` ichiga kichikroq son yozaman
  - `transform` ni `.katak` ga ko'chiraman
  - ✔ `.katak` ga `transition` qo'shaman
  - `transform` o'rniga `transition` yozaman
- Kalit: **C** (index 2). Variantlar: 34 · 34 · 30 · 36 belgi; `transform`/`transition` so'zlari uch variantda bor (kalit so'z faqat to'g'rida emas).
- To'g'ri izohi: `transition` kichrayishga vaqt beradi — katak silliq cho'kib qaytadi.
- Xato izohlari (≤60):
  - A: Son kichrayishni oshiradi, sakrash esa qoladi. (46)
  - B: Unda katak bosilmasdan ham doim kichik turadi. (46)
  - D: `transform` bo'lmasa, katak umuman kichraymaydi. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 5 · 1-element: bosilgan katak  ← QKod
- Eyebrow: Kod yozish · 1-element
- Sarlavha: **Bosilgan katakni silliq kichraytiradigan kod yozamiz.** (53) — §19 sarlavha oilasi
- Mentor: Kodni o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. `.katak:active` qoidasini yozing: `transform: scale(0.95);`
  2. `.katak` qoidasiga qo'shing: `transition: transform 0.15s;`
  3. Natija oynasida katakni bosing — u silliq kichrayib qaytsin.
- Yordam: Natija o'zgarmasa, `:active` oldida bo'sh joy yo'qligini va `0.15s` da «s» harfi borligini tekshiring.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi.
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; Mentor: kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz) → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <h1>Maydon · Shanba</h1>
    <div class="kataklar">
      <button class="katak">16:00–17:00</button>
      <button class="katak">18:00–19:00</button>
      <button class="katak">19:00–20:00</button>
    </div>
    ```
  - `style.css` — o'quvchi yozadi (boshlang'ich holat):
    ```css
    .katak {
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 14px 18px;
      /* 2) transition shu yerga */
    }
    /* 1) .katak:active qoidasi shu yerga */
    ```
- Kod oynasi sarlavhasi: `style.css — bosilgan katakni kichraytiring`
- Shart xabarlari (≤60):
  - 1 — `.katak:active` ichida `transform: scale(0.95)` bo'lsin. (52)
  - 2 — `.katak` dagi `transition` da `transform` va vaqt bo'lsin. (52)
- **Harakat → Vizual o'zgarish:** o'quvchi yozadi → natija oynasida kataklar; har shart bajarilganda ✓; katakni bosish → silliq kichrayib qaytadi.
  «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Katak bosilganini ko'rsatadi. Harakatga berilgan shunday kichik javob mikro-harakat deyiladi. (91)

## 6 · Rang ham silliq o'zgaradimi?  ← QTushuncha
- Eyebrow: Tushuncha · rang
- Sarlavha: **Band bo'lgan katak rangi qanday o'zgaradi?** (42)
- Mentor: Katak band bo'lsa, unga `band` klassi qo'shiladi va fon kulrang bo'ladi. `transition` ga nima qo'shishni tanlang va bo'sh katakni bosing.
- Bashorat (ballsiz): **`transition: transform 0.15s` turibdi. Rang ham silliq o'zgaradimi?** · Ha, silliq · Yo'q, sakraydi
- Chap — kod:
  ```css
  .katak {
    transition: transform 0.15s;
  }
  .katak.band {
    background-color: lightgray;
  }
  ```
  Izoh (kulrang): `.katak.band` — `katak` va `band` klassi ikkalasi bor element.
  Ostida bitta tugma (pulsatsiya): `, background-color 0.3s` ni qo'shish.
- O'ng — maket + «Sekin ko'rsatish» kaliti.
- **Harakat → Vizual o'zgarish:** 18:00–19:00 ni bosish → katakka `band` qo'shiladi (kodda `.katak.band` qatori yonadi), rang **sakrab** kulrang bo'ladi.
  Shu tugmani bosish → `transition` qatori `transform 0.15s, background-color 0.3s` bo'ladi; 19:00–20:00 ni bosish → rang 0.3 soniyada silliq kulranglashadi.
  «Sekin ko'rsatish» yoqilsa katak ostida `RANG_YOLI` yorliqlari navbat bilan yonadi: O'yinchi katakni bosadi · Katakka `band` klassi qo'shiladi ·
  Brauzer 0.3 soniya oraliq ranglarni chizadi · Katak kulrang bo'lib qoladi; katakda oqdan kulranggacha oraliq ranglar ko'rinadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: sakradi — `transition` da rang yo'q edi».
- Xulosa: `transition` faqat unda yozilgan xususiyatni silliq qiladi; ikkinchisi vergul bilan qo'shiladi. (93)
- Tugadi (199) · Tugma (pastki): 2 katakni band qiling (N/2) → Davom etish

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Band katak rangi sakrab o'zgaryapti. `transition` ga nima yozasiz?** (9 so'z)
  - ✔ `transform 0.15s, background-color 0.3s`
  - `transform 0.15s; background-color 0.3s`
  - `transform 0.15s, background-color 3s`
  - `transform, background-color 0.3s`
- Kalit: **A** (index 0). Variantlar: 38 · 38 · 36 · 32 belgi — hammasi kod, to'g'risi yolg'iz eng uzun emas.
- To'g'ri izohi: Ikki xususiyat vergul bilan yoziladi, har birining o'z vaqti bor.
- Xato izohlari (≤60):
  - B: Nuqta-vergul qatorni tugatadi — rang unga kirmay qoladi. (56)
  - C: 3 soniya silliq, lekin o'yinchi kutib qoladi. (45)
  - D: `transform` vaqtsiz qoldi — kichrayish yana sakraydi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · 2-element: band katak  ← QKod
- Eyebrow: Kod yozish · 2-element
- Sarlavha: **Band katak rangini silliq o'zgartiradigan kod yozamiz.** (54)
- Mentor: Katakka `band` klassini `app.js` qo'shadi — siz faqat CSS'ni yozasiz.
- Chap — vazifa (3 band):
  1. `.katak.band` qoidasini yozing: `background-color: lightgray;`
  2. `transition` ga vergul bilan qo'shing: `background-color 0.3s`
  3. Bo'sh katakni bosing — rangi 0.3 soniyada kulranglashsin.
- Yordam: Ikki klass orasida bo'sh joy yo'q: `.katak.band`. Rang sakrasa, `transition` da vergul turganini tekshiring.
- Tugma (o'ngda): Bajardim
- O'ng — `HtmlCompiler`, fayllar:
  - `index.html` — tayyor: 4 katak, 17:00–18:00 oldindan `class="katak band"`;
  - `app.js` — tayyor, o'zgarmaydi:
    ```js
    document.querySelectorAll('.katak').forEach(k => {
      k.addEventListener('click', () => k.classList.add('band'));
    });
    ```
  - `style.css` — o'quvchining 5-ekrandagi kodi bilan boshlanadi (saqlangan holat; bo'lmasa — namuna yechim).
- Kod oynasi sarlavhasi: `style.css — band katak rangini silliq qiling`
- Shart xabarlari (≤60):
  - 1 — `.katak.band` ichida `background-color` bo'lsin. (44)
  - 2 — `transition` da `background-color` va vaqt bo'lsin. (47)
  - 3 — `transform 0.15s` ham `transition` da qolsin. (41)
- **Harakat → Vizual o'zgarish:** `.katak.band` yozilishi bilan oldindan band 17:00–18:00 darhol kulrang bo'ladi; bo'sh katakni bosish → rang silliq o'zgaradi,
  bosilgan payt kichrayish ham ishlaydi. «Bajardim» → panel yopiladi, natija oynasi fokusga.
- Xulosa: Ikkinchi element tayyor: katak band bo'lganini rangi bilan ko'rsatadi. (70)

## 9 · Belgi qanday ketadi?  ← QTushuncha
- Eyebrow: Tushuncha · Motion
- Sarlavha: **«Band qilindi» belgisi qanday chiqib, qanday ketadi?** (52)
- Mentor: Belgi oldin ekranda yo'q — React uni band qilingandan keyin chizadi va 3 soniyadan keyin olib tashlaydi. Ikkala maketda katakni bosing va kuzating.
- Bashorat (ballsiz): **`transition` bilan belgi qanday ketadi?** · Silliq so'nadi · Birdan yo'qoladi
- Ikki maket yonma-yon (bitta maketning ikki nusxasi, P-057): chap yorliq «`transition` bilan» · o'ng yorliq «Motion bilan»; har birida 18:00–19:00 va belgi joyi.
- **Harakat → Vizual o'zgarish:** chapda katakni bosish → belgi birdan chiqadi, 3 soniyadan keyin birdan yo'qoladi;
  o'ngda katakni bosish → belgi pastdan ko'tarilib aniqlashadi, 3 soniyadan keyin so'nib ketadi. Har maket ostida ikki kichik yorliq yonadi:
  chap «chiqdi: birdan · ketdi: birdan», o'ng «chiqdi: silliq · ketdi: silliq». «Qayta» tugmasi ikkalasini boshlang'ich holatga qaytaradi.
- Nom qatori (2/2 dan keyin): O'ngdagini Motion (oldingi nomi Framer Motion) qiladi — React uchun animatsiya kutubxonasi, paketi `motion`.
- Natija qatori: «Taxminingiz: … · haqiqatda: birdan yo'qoldi».
- Xulosa: Oddiy `transition` olib tashlangan elementni ko'rsatmaydi. Bu misolda Motion kirish va ketishni osonlashtiradi. (106) — audit 4: «CSS qila olmaydi» deyilmaydi (`@keyframes`, `@starting-style` ham bor)
- Tugma (pastki): Ikkala maketda bosing (N/2) → Davom etish

## 10 · Motion kodi  ← QTushuncha
- Eyebrow: Kod · Motion
- Sarlavha: **Belgi qayerdan va qanday kirib keladi?** (38)
- Mentor: `motion.div` oddiy `div` ga o'xshaydi, lekin uch holatni biladi. Qiymatni almashtiring va katakni bosib, belgini qayta chiqaring.
- Chap — kod (repo `App.jsx` dagi parcha, P-065), qatorlar yonida kulrang yorliqlar:
  ```jsx
  import { motion, AnimatePresence } from "motion/react"

  <AnimatePresence>
    {belgi && (
      <motion.div
        key="belgi"
        className="belgi"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        Band qilindi: {belgi}
      </motion.div>
    )}
  </AnimatePresence>
  ```
  Yorliqlar: `initial` — chiqishdan oldingi holat · `animate` — kelib to'xtaydigan holat · `exit` — ketayotgandagi holat · `AnimatePresence` — element olib tashlanayotganda `exit` ni ishlatadi ·
  `y: 8` — 8 piksel pastda · `{belgi && …}` — `belgi` bo'lsa, chiziladi.
  Bosiladigan joylar (pulsatsiya): `initial` qiymati — `{ opacity: 0, y: 8 }` · `{ opacity: 0, y: -8 }` · `{ opacity: 0 }`; kalit «`AnimatePresence`: yoqilgan / o'chirilgan».
- O'ng — maket (**javob beradi** rejimi, belgi joyi katta).
- **Harakat → Vizual o'zgarish:** `initial` qiymatini bosish → kodda qiymat almashadi; katakni bosish → belgi tanlangan tomondan kiradi (pastdan · tepadan · joyida xiradan aniqqa)
  va `animate` holatida to'xtaydi, 3 soniyadan keyin `exit` bo'yicha so'nadi. `AnimatePresence` o'chirilsa → u qatorlar kodda xiralashadi, belgi ketishda birdan yo'qoladi;
  qayta yoqilsa — yana so'nib ketadi.
- Xulosa: `initial` dan `animate` ga — kirish, `exit` — ketish. Ketish ishlashi uchun `AnimatePresence` kerak. (92)
- Tugadi (199) · Tugma (pastki): 2 narsani sinang (N/2) → Davom etish

## 11 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Kodda `exit` bor, lekin belgi birdan yo'qoladi. Sabab nima?** (10 so'z)
  - `initial` qatorida `opacity` yo'q
  - `animate` qatorida `y: 0` yo'q
  - `exit` qatorida vaqt yozilmagan
  - ✔ `<AnimatePresence>` qatori yo'q
- Kalit: **D** (index 3). Variantlar: 29 · 26 · 29 · 29 belgi; to'rttalasi bir shaklda — «`…` qatori(da) … yo'q» (§147, 3-vs-1 yo'q).
- To'g'ri izohi: `exit` faqat `AnimatePresence` ichida ishlaydi — u element olib tashlanayotganda ketish animatsiyasini ishlatadi.
- Xato izohlari (≤60):
  - A: `initial` kirishni boshqaradi, ketishni emas. (43)
  - B: `animate` — to'xtash holati, ketishga tegmaydi. (45)
  - C: Vaqt yozilmasa ham Motion o'z vaqtini oladi. (44)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 12 · Qaysi harakat ortiqcha?  ← QTushuncha (2 qadam, 163.8)
- Eyebrow: Tushuncha · ortiqcha harakat
- Sarlavha: **Qaysi harakat o'yinchiga hech narsa demaydi?** (44)
- Mentor: Harakat «bosildi», «o'zgardi» yoki «tayyor» deb javob bermasa — u ortiqcha. Shundaylarini bosib o'chiring.
- Chapda qadam-ro'yxati (o'tgani ✓, joriysi accent): 1 Ortiqchasini o'chiring · 2 Harakatni kamaytiring; o'ngda faqat joriy qadam kartasi.
- O'ng — maket, beshta harakat bilan: sarlavha yonidagi katta to'p rasmi doim aylanadi · «Maydon» sarlavhasi miltillaydi · bosilgan katak kichrayadi ·
  band katak rangi silliq o'zgaradi · «Band qilindi» belgisi chiqadi. Hisoblagich: «Ortiqcha harakat: 0/2».
- **Harakat → Vizual o'zgarish:**
  - 1-qadam: harakatni bosish → aylanayotgan to'p rasmi yoki miltillayotgan sarlavha to'xtaydi va xiralashadi, hisoblagich oshadi;
    uch javobdan birini bosish → u silkinadi, bir qator (≤60): «Bu harakat o'yinchiga javob beradi — qoldiring.» (47). 2/2 da maketda faqat uch element qoladi.
  - 2-qadam (joriy karta, bitta qator): Ba'zi odamlarga ko'p harakat noqulay — boshi aylanishi mumkin; ular qurilmada harakatni kamaytiradi. Kalitni yoqing.
    Karta ostida chizilgan sozlama kaliti «Harakatni kamaytirish». Yoqilganda: kodda ikki qator yonadi
    ```css
    @media (prefers-reduced-motion: reduce) {
      .katak:active { transform: none; }
    }
    ```
    va `<MotionConfig reducedMotion="user">`; maketda katak bosilganda kichraymaydi, rang baribir silliq o'zgaradi, belgi pastdan ko'tarilmaydi — joyida xiradan aniqqa chiqadi.
- Nom qatori (2-qadamdan keyin): Qurilmada harakat kamaytirilganini sayt `prefers-reduced-motion` orqali biladi.
- Xulosa: O'yinchiga javob beradigan harakat qoladi. Harakatni kamaytirgan odamda rang va shaffoflik qoladi. (98)
- Tugadi (199) · Tugma (pastki): 2 qadamni bajaring (N/2) → Davom etish

## 13 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Harakat kamaytirilsa, bizning Maydon kodimizda nima ishlaydi?** (7 so'z) — audit 5: javob shu kodga tegishli, umumiy qoida emas
  - Hamma animatsiya avvalgidek ishlaydi
  - ✔ Faqat rang va shaffoflik o'zgaradi
  - Hech qanday o'zgarish ko'rinmaydi
  - Faqat katakning kichrayishi ishlaydi
- Kalit: **B** (index 1). Variantlar: 36 · 35 · 33 · 36 belgi; to'g'risi eng uzun emas, «Faqat» ikki variantda.
- To'g'ri izohi: Bu darsdagi kodda kichrayish va surilish o'chadi, rang va shaffoflik esa qoladi.
- Xato izohlari (≤60):
  - A: Sozlama yoqilgan — kichrayish va surilish o'chadi. (50)
  - C: Hammasi o'chsa, o'yinchi yana bosilganini bilmaydi. (51)
  - D: Kichrayish — aynan o'chadigan harakat. (38)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 14 · Nega silliq emas?  ← QTushuncha (xatoni topish, 3 qadam)
- Eyebrow: Xatoni topish
- Sarlavha: **Kod yozildi, lekin katak sakrayapti. Xato qayerda?** (50)
- Mentor: Ko'pincha xato bitta harfda yoki bo'sh joyda bo'ladi. Natijaga qarang va xato qatorni bosing.
- Chapda qadam-ro'yxati (o'tgani ✓): 1 Kichrayish sakraydi · 2 Qaytish sakraydi · 3 Rang o'zgarmaydi
- O'ngda joriy kod parchasi (3–5 qator) va maket; har qadamda maket o'sha xatoni ko'rsatadi:
  1. `.katak { transition: transform 0.15; }` — katak sakrab kichrayadi va sakrab qaytadi.
  2. `transition: transform 0.15s;` `.katak:active` ichida yozilgan — katak silliq cho'kadi, qo'yib yuborilganda sakrab qaytadi.
  3. `.katak .band { background-color: lightgray; }` — bosilgan katak rangi umuman o'zgarmaydi.
- **Harakat → Vizual o'zgarish:** o'quvchi kod qatorini bosadi →
  - to'g'ri qator → qizil bo'ladi, ostida tuzatilgan shakli yashil chiqadi (`0.15s` · `transition` `.katak` ga ko'chdi · `.katak.band`) va «Qayta sinash» tugmasi →
    maketda katak silliq ishlaydi, chapdagi qadam ✓;
  - xatosiz qator → silkinadi, bir qator (§185, ≤60): 1-qadamda «Bu qator to'g'ri. Vaqt qanday yozilgan?» (39) ·
    2-qadamda «Bu qator to'g'ri. Qo'yib yuborilganda qaysi qoida qoladi?» (57) · 3-qadamda «Bu qator to'g'ri. Selektorni harfma-harf o'qing.» (48)
- Xulosa: Kichik xato butun harakatni buzadi: vaqt «s» bilan, `transition` — `.katak` da, klasslar orasida bo'sh joy yo'q. (108)
- Tugadi (199) · Tugma (pastki): 3 xatoni toping (N/3) → Davom etish

## 15 · Bosishdan kulrang katakkacha (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Bosishdan kulrang katakkacha nima bo'ladi?** (42)
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- Bo'laklar (to'g'ri tartibda, `RANG_YOLI` — 6-ekran bilan bitta manba): O'yinchi katakni bosadi · Katakka `band` klassi qo'shiladi · Brauzer 0.3 soniya oraliq ranglarni chizadi ·
  Katak kulrang bo'lib qoladi
- Uyalar: 4 ta, har birida «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib xato — bo'lakni bosib qaytaring. (39)
- Xulosa (yechilgach, bir marta): Bosish klassni o'zgartiradi, `transition` esa eski va yangi rang orasini 0.3 soniyada to'ldiradi. (95)

## 16 · Amaliyot — uch element Maydon'da  ← amaliyot bloki (QBlok + `ScreenBlok`, 172/173 · ≈25 daq)
- Eyebrow: Amaliyot · Maydon repo'si
- Sarlavha: **Uch elementni Maydon saytiga qo'shing.** (38)
- Mentor: Bosish mantiqini Antigravity yozadi, animatsiyani — siz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda: `cd web`, `npm install motion`, keyin `npm run dev`. Brauzerda `localhost:5173` — Shanba kataklari chiqsin.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `web/src/App.jsx`: bo'sh vaqt katagi bosilsa, u band bo'lsin — katakka `band` klassi qo'shilsin.
     > Kataklar ostida «Band qilindi: 18:00» kabi yozuv soati bilan chiqsin va 3 soniyadan keyin yo'qolsin; soat `belgi` nomli state'da tursin, yozuvga `belgi` klassini ber.
     > Band katak qayta bosilmasin. Hozircha hammasi faqat saytda — Backend'ga yuborilmasin.
     > `App.css` ga va animatsiyaga tegma — ularni men yozaman. O'zgargan qatorlarni ayt.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. **CSS — qo'lda** — `web/src/App.css` ni oching va o'zingiz terib yozing (nusxa yo'q): `.katak` ga `transition: transform 0.15s, background-color 0.3s;`,
     yangi qoida `.katak:active { transform: scale(0.95); }`, faylning oxiriga `@media (prefers-reduced-motion: reduce) { .katak:active { transform: none; } }`. Saqlang va katakni bosing:
     kichrayib qaytadi, rangi silliq kulranglashadi.
  4. **Motion — qo'lda** — `App.jsx` tepasiga `import { motion, AnimatePresence, MotionConfig } from "motion/react"` ni yozing. Yozuvning `div` ini `motion.div` qiling
     (`key`, `initial`, `animate`, `exit`, `transition`) va uni `<AnimatePresence>` ichiga oling; butun sahifani `<MotionConfig reducedMotion="user">` ichiga oling.
     Saqlang va katakni bosing: «Band qilindi: 18:00» pastdan chiqadi va 3 soniyadan keyin so'nadi. Ekranda xato chiqsa — matnini Antigravity'ga: «Shu xato chiqdi: {xato}. Tuzat.»
  5. **O'z g'oyangizga** — qavslarni o'z loyihangiz bo'yicha to'ldiring va «Nusxalash» — uyda o'z loyihangizda Antigravity'ga yuborasiz:
     > {sahifa yoki fayl}: {bosiladigan tugma} bosilganda kichrayib qaytsin — `transform: scale(0.95)`, `transition` 0.15 soniya.
     > {holati o'zgaradigan element} rangi 0.3 soniyada silliq o'zgarsin.
     > {tasdiq yozuvi} `motion` paketi bilan chiqib, so'nib ketsin (`AnimatePresence`, `exit`).
     > Qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`, xaritadagi maketning kattasi):
  - Maydon · Shanba
  - 16:00–17:00 · 17:00–18:00 band · 18:00–19:00 band · 19:00–20:00 · 20:00–21:00 band · 21:00–22:00
  - pastda: Band qilindi: 18:00
- Hammasi bajarilgach (yashil): Maydon bosishga javob beradi: bosildi, o'zgardi, band qilindi. (62)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-05-done` (o'z o'zgarishlaringiz o'chadi).
- Nishon (bonus): Live Maydon — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Silliq qaytish» · 7 — «2 — Ikki xususiyat» · 11 — «3 — Belgining ketishi» · 13 — «4 — Kamaytirilgan harakat» · 15 — «5 — Rang yo'li»

## 18 · Takrorlash  ← QKartochka (12 karta, tepadan, savolsiz sarlavha — 174)
- Kartalar — «Kartochkalar (12)» bo'limida. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Maydon javob beradi · {N}/5 to'g'ri
- Sarlavha: **Endi bosishga javob beradigan sayt qila olasiz.** (47)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Animatsiya bezak emas: u odamga «bosildi», «o'zgardi», «tayyor» deb javob beradi.
- Endi siz bilasiz (4):
  - `transform: scale(0.95)` katakni kichraytiradi, qo'shni kataklar joyida qoladi
  - `transition` o'zgarishni berilgan vaqt ichida silliq bajaradi
  - Motion `initial`, `animate`, `exit` bilan chiqish va ketishni silliq qiladi
  - Harakat kamaytirilgan qurilmada kichrayish o'chadi, rang va shaffoflik qoladi
- Uyga vazifa (`uyga`, karta: kim uchun — o'z loyihangiz · muddat — keyingi darsgacha):
  1. **O'z loyihangizda** — amaliyotdagi 5-qadam promptini Antigravity'ga yuboring: uch element bosishga javob bersin
  2. **Tekshiring** — qurilmada harakatni kamaytirishni yoqib, sahifangizni oching: kichrayish o'chdimi?
  3. **Kuzating** — telefoningizdagi bitta ilovada «bosildi», «o'zgardi», «tayyor» javoblarini toping va har birini bir gapda yozing
- Keyingi dars — «Birinchi odam kirganda nimani ko'rasiz?»: Maydon bosishga javob beradi, endi odamlar unda nima qilayotganini ko'rish navbati.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (5) — inglizcha nom va medal (o'yin qatlami)
- **Smooth Press** — katak silliq qaytishi uchun nima kerakligini topdingiz (4-ekran, 1-savol)
- **Two Transitions** — ikki xususiyatni bitta `transition` ga yozdingiz (7-ekran, 2-savol)
- **Exit Ready** — `exit` ishlashi uchun nima kerakligini topdingiz (11-ekran, 3-savol)
- **Calm Motion** — harakatni kamaytirgan odamga nima qolishini bildingiz (13-ekran, 4-savol)
- **Live Maydon** — amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta, emoji o'rniga koddan bitta qator (S-026)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Silliq qaytish uchun `transition`»
   - `:active` — bosib turilgan payt · `.katak:active { transform: scale(0.95); }`
   - `transform` katakni kichraytiradi, qo'shni kataklar joyida qoladi · `scale(0.95)`
   - `transition` kichrayishga vaqt beradi · `transition: transform 0.15s;`
   - Sinfga savol: Nega `transition` siz katak sakraydi?
2. 2-savol (7-ekran) — «Ikki xususiyat — vergul bilan»
   - `band` klassi qo'shilsa, fon kulrang bo'ladi · `.katak.band { background-color: lightgray; }`
   - `transition` faqat unda yozilgan xususiyatni silliq qiladi · `transition: transform 0.15s;`
   - Ikkinchi xususiyat vergul bilan, o'z vaqti bilan · `transform 0.15s, background-color 0.3s`
   - Sinfga savol: Vergul o'rniga nuqta-vergul qo'yilsa nima bo'ladi?
3. 3-savol (11-ekran) — «`exit` — `AnimatePresence` ichida»
   - `initial` dan `animate` ga — belgi kiradi · `initial={{ opacity: 0, y: 8 }}`
   - `exit` — ketayotgandagi holat · `exit={{ opacity: 0 }}`
   - `AnimatePresence` element olib tashlanayotganda `exit` ni ishlatadi · `<AnimatePresence>`
   - Sinfga savol: `AnimatePresence` bo'lmasa, belgi qanday ketadi?
4. 4-savol (13-ekran) — «Harakatni kamaytirgan odam»
   - Sayt buni `prefers-reduced-motion` orqali biladi · `@media (prefers-reduced-motion: reduce)`
   - Kichrayish o'chadi · `.katak:active { transform: none; }`
   - Motion surilishni o'chiradi, shaffoflik qoladi · `reducedMotion="user"`
   - Sinfga savol: Nega rang o'zgarishini o'chirmaymiz?
5. Final (15-ekran) — «Bosishdan kulrang katakkacha»
   - O'yinchi bosadi, katakka `band` klassi qo'shiladi · `className="katak band"`
   - Brauzer 0.3 soniya oraliq ranglarni chizadi · `background-color 0.3s`
   - Katak kulrang bo'lib qoladi · (4)
   - Sinfga savol: `transition` qachon ishga tushadi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Harakat yoki holat o'zgarishiga kichik vizual javob qanday ataladi? | Mikro-harakat | Bizning misolda: bosilgan katak kichrayib qaytadi |
| Katakni 95% gacha qaysi qiymat kichraytiradi? | `transform: scale(0.95)` | Qo'shni kataklar joyida qoladi |
| Bosib turilgan payt CSS'da qanday yoziladi? | `:active` | Masalan: `.katak:active` |
| O'zgarishga vaqtni qaysi xususiyat beradi? | `transition` | Qaysi xususiyat va qancha vaqt |
| `transition: transform 0.15s` dagi «s» nima? | soniya | 1 soniyada o'yinchi kutib qoladi |
| Bitta `transition` ga ikki xususiyat qanday yoziladi? | Vergul bilan | `transform 0.15s, background-color 0.3s` |
| `.katak.band` qaysi elementni topadi? | `katak` va `band` klassi bor elementni | Orasida bo'sh joy bo'lsa — boshqa selektor |
| Motion qaysi buyruq bilan o'rnatiladi? | `npm install motion` | Import: `motion/react` |
| Belgining chiqishdan oldingi holati qayerda yoziladi? | `initial` | Kelib to'xtaydigan holat — `animate` |
| Belgining ketayotgandagi holati qayerda yoziladi? | `exit` | `AnimatePresence` ichida ishlaydi |
| Harakat kamaytirilganini sayt qanday biladi? | `prefers-reduced-motion` | Kichrayish o'chadi, rang qoladi |
| Saytda qaysi harakat qoladi? | O'yinchiga javob beradigani | «Bosildi», «o'zgardi», «tayyor» |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Animatsiya o'yinchiga nimani aytadi? ✔ «Bosildi», «o'zgardi» yoki «tayyor» · Saytda hozir nechta odam borligini · Sahifa qancha vaqtdan beri ochiqligini · Katak qaysi rangda chiroyli turishini
2. `transform: scale(1.1)` nima qiladi? Elementni 10% ga kichraytiradi · ✔ Elementni 10% ga kattalashtiradi · Elementni 10 piksel o'ngga suradi · Element rangini 10% ochroq qiladi
3. Tugma `scale(0.9)` bilan kichraydi. Ostidagi matn nima bo'ladi? Tepaga ko'tariladi · Pastga tushadi · ✔ Joyida qoladi · U ham kichrayadi
4. `transition: transform 0.15s` dagi `0.15s` nimani bildiradi? Katak necha marta kichrayishini · Katak qancha kichrayishini · Katak qachon bosilishini · ✔ O'zgarish qancha davom etishini
5. Bir `transition` da ikki xususiyat qanday ajratiladi? ✔ Vergul bilan · Nuqta-vergul bilan · Bo'sh joy bilan · Ikki nuqta bilan
6. `.katak.band` selektori qaysi elementni topadi? `katak` ichidagi `band` ni · ✔ Ikkala klassi bor elementni · Faqat `band` klassli har elementni · Hamma `katak` klassli elementni
7. Tugma bosib turilgan payt CSS'da qanday yoziladi? `.tugma:hover` · `.tugma.band` · ✔ `.tugma:active` · `.tugma .active`
8. Motion'ni loyihaga qaysi buyruq qo'shadi? `npm run motion` · `npm motion install` · `npx motion` · ✔ `npm install motion`
9. `motion.div` dagi `initial` nimani bildiradi? ✔ Element chiqishidan oldingi holat · Element to'xtaydigan oxirgi holat · Element ketayotgandagi holat · Element bosilgan paytdagi holat
10. Ro'yxatdan qator o'chirilsa, u silliq ketishi uchun nima kerak? `initial` da `opacity: 0` · ✔ `AnimatePresence` va `exit` · `animate` da `y: 0` · CSS'dagi `transition` qatori
11. Do'kon saytida qaysi harakat ortiqcha? Savatga qo'shilganda son o'zgarishi · Bosilgan tugma kichrayib qaytishi · ✔ Doim miltillaydigan «Aksiya» yozuvi · «Buyurtma qabul qilindi» chiqishi
12. `prefers-reduced-motion` nimani bildiradi? Internet sekin ishlayotganini · Telefon quvvati kam qolganini · Ekran yorqinligi pasaytirilganini · ✔ Odam harakatni kamaytirganini

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): `transition` · `transform` · `scale(0.95)` · `:active` · `0.15s` · `.katak.band` · `motion.div` · `initial` · `animate` ·
`exit` · `AnimatePresence` · `prefers-reduced-motion` · `npm install motion` · Maydon

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 20 ekran: hook · rule · exploration ×2 · test · practice(kod) · exploration · test · practice(kod) · exploration ×2 · test ·
   exploration · test · exploration(debug) · test(final, `scope: 'final'`) · practice(blok) · stats · flashcards · summary. `INLINE_KEYS`: s4 **2 (C)** · s7 **0 (A)** · s11 **3 (D)** · s13 **1 (B)** ·
   s15 sentinel **0**; QKod (5, 8) va blok (16) — `practice: -1`. `LESSON_META.lessonId` — `m7-05-animation-v1`.
2. **Bitta manba (180):** `KATAKLAR` (6 katak: soat, holat) va `RANG_YOLI` (4 bo'lak — 6-ekran yorliqlari va 15-ekran finali). 0, 1, 2, 3, 6, 9, 10, 12, 14, 16-ekranlar shundan o'qiydi.
3. **`MaydonMaket`** komponenti: brauzer ramkasi, kun yorlig'i, 6 katak, belgi joyi; rejimlar `jim` · `javob` · `sekin` (×10, oraliq o'lchamlar/ranglar xira) · `kam` (harakat kamaytirilgan);
   bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: mk-katak mk-kun mk-kalit`). Maket o'zi `prefers-reduced-motion` da to'xtaydi (DE-200). Logotip/emoji yo'q (D4); 12-ekrandagi «to'p rasmi» — chizilgan doira (SVG).
4. **Motion darsning o'zida:** platformada `motion` paketi yo'q (`package.json`) — 9, 10, 12-ekran maketlari belgining chiqish/ketishini CSS/JS bilan **taqlid qiladi**, kod parchasi esa repo'dagi
   haqiqiy Motion kodi (TAYANCHGA SAVOL 8). `AnimatePresence` o'chirilgan holat — belgi birdan yo'qoladi.
5. **QKod (5, 8) → `HtmlCompiler`** (ko'p fayl: `index.html` tayyor · `style.css` o'quvchi · 8-ekranda `app.js` tayyor). Yangi CSS tekshiruvlari (stylesheet parse, regex emas):
   `.katak:active` da `transform: scale(x)`, 0.9 ≤ x ≤ 0.98 · `.katak` dagi `transition` ro'yxatida `transform` (yoki `all`) va birligi bor vaqt · 8-ekranda `background-color` vaqti ham, `transform` ham ·
   `.katak.band` da `background-color`. 8-ekran `style.css` 5-ekrandagi saqlangan koddan boshlanadi (`storageKey` umumiy). «Bajardim» shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
   ⚠️ `style.css` starter `.jsx` ichida shablon-satr bo'ladi — CSS izohida backtik yo'q (CLAUDE.md; starterdagi izohlar backtiksiz yozildi).
6. **14-ekran (debug):** uch kod parchasi, qator bosish → tekshirish; xatosiz qator — `QXato` bir qator; tuzatilgan shakl yashil; «Qayta sinash» → maket to'g'ri ishlaydi.
7. **Bashorat ekranlari** (2, 3, 6, 9) — `QBashorat` ballsiz, `onAnswer` ga kirmaydi; natija — `QTaxmin` bitta qator. 12-ekran — `QQadamlar` (2 qadam).
8. **16-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (2- va 5-qadam; 5-qadamda `{…}` joylari); 3- va 4-qadamda nusxa tugmasi **yo'q** (qo'lda); o'ngda `MaydonMaket` (javob rejimi, katta).
   `ortda`: `git checkout -f dars-05-done`. `ACH_TRIGGERS`: oxirgi «Bajardim» → Live Maydon.
9. `RECAPS` 5 (kalit = 4, 7, 11, 13, 15) · `Q_LABELS` {4, 7, 11, 13, 15} · `ACHIEVEMENTS` 5 · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 · `HW_TOKENS` fon so'zlari {uz, ru}
   (`hodisa` so'zi skelet namunasida bor — bu darsda **olinadi**, T-015).
10. **Darvozalar:** `npm run gates -- src/7-Modull/AnimationLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 (shu dars) · `lint:emoji` · `lint:layout` 1280/1366/390 · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`dars-04-done` → `dars-05-done`)
1. `web/package.json` — `motion` qaramligi (`npm install motion`).
2. `web/src/App.jsx` — `belgi` state (soat yoki `null`), bo'sh katak bosilsa `band` klassi va belgi, 3 soniyadan keyin `belgi` → `null`; band katak qayta bosilmaydi; faqat saytda (Backend'ga so'rov yo'q).
   Belgi: `<AnimatePresence>{belgi && (<motion.div key="belgi" className="belgi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>Band qilindi: {belgi}</motion.div>)}</AnimatePresence>`;
   butun sahifa `<MotionConfig reducedMotion="user">` ichida.
3. `web/src/App.css` — `.katak { … transition: transform 0.15s, background-color 0.3s; }` · `.katak:active { transform: scale(0.95); }` · `.katak.band { background-color: lightgray; }` (4-darsda bo'lmasa) ·
   `@media (prefers-reduced-motion: reduce) { .katak:active { transform: none; } }`.
4. README «Darslar va teglar» jadvaliga `dars-05-done` qatori: «statik kataklarda uch element jonlangan».
5. **Muhrdan oldin haqiqiy sinov (P-028):** Android va iPhone brauzerida `:active` kichrayishi (iOS Safari'da `:active` faqat sahifada bosish tinglovchisi bo'lsa ishlaydi — React ilovada odatda bor, lekin sinab ko'riladi),
   OS sozlamasida harakatni kamaytirish → kichrayish va surilish o'chadi, rang va shaffoflik qoladi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **4-dars repo holati:** fayl va klass nomlari — `web/src/App.jsx`, `web/src/App.css`, `.katak`, `.katak.band`; namuna ma'lumot — Shanba, 16:00–22:00, band 17:00–18:00 va 20:00–21:00.
   Tayanchda yo'q; 4-dars MD bilan solishtirish kerak (3, 6, 10, 16-ekran va REPO shu nomlarga bog'liq).
2. **5-darsda band qilish faqat saytda** (React state, Backend'ga yozilmaydi, sahifa yangilansa yo'qoladi); haqiqiy `POST /bandlar` (ism + telefon) — 9-darsda. Tayanchdagi «statik kataklarda jonlangan» shunday tushunildi.
3. **Belgi tafsilotlari:** matn «Band qilindi: 18:00» (soati bilan), 3 soniyadan keyin yo'qoladi (ketish animatsiyasini ko'rsatish uchun), state va klass nomi `belgi`. Tayanchda faqat «Band qilindi» belgisi bor.
4. **Blokda ish taqsimoti:** bosish mantiqi — Antigravity prompti (qaror 3), animatsiya — qo'lda (qaror 4); oxirida 5-qadam «o'z g'oyangizga» (qaror 8). Shu tufayli blok 5 qadam (P-059 dagi 4 + qaror 8).
5. **«prompt» va «talab»:** blokda qaror 8 so'zi «prompt» qoldi (6-Moduldan tanish); tayanchdagi «talab» 7-darsda tug'iladi deb hisobladim. Modul bo'yi bitta so'z kerak bo'lsa — 1-2 joy almashadi.
6. **Repo manzili:** tayanchda URL va `git fetch` qatori yo'q — «Ortda qoldingizmi» faqat `git checkout -f dars-05-done`. Teglar upstream'da kurs boshlanishidan oldin bo'lishi kerak (6-Modul REPO 3-band shartidek).
7. **Maydon ranglari:** bo'sh — oq (`white`), band — kulrang (`lightgray`) — tayanchda saytning ranglari yo'q; yashil olinmadi (dars yuzasida yashil = to'g'ri).
8. **Darsning o'zida Motion:** platformada `motion` paketi yo'q — maket taqlid qiladi (KOD 4) yoki paket qo'shiladi (umumiy qaror, asosiy seans).
9. **Kun almashtirish** — 7-darsda; 5-darsda kun yorlig'i «Shanba» faqat ko'rinadi, bosilmaydi.

## Shubhali joylar (ishonchim komil emas)
1. **«javob» ikki ma'noda** (T-015): dars nomi va asosiy fikrda «sayt javob beradi», test eyebrow'ida platforma standarti «To'g'ri javobni tanlang». O'z matnimda test ma'nosida «javob» ishlatmadim; standart yorliq tegilmadi.
2. **«belgi» ildizi:** `QBashorat` qolip yorlig'i «Avval o'zingiz belgilab ko'ring» — «belgilab» fe'li «Band qilindi» belgisidan boshqa ma'no (T-015 chegarasida). Qolip matni o'zgartirilmadi.
3. **Hook 1-varianti** («Ha, endi katak band bo'ldi») faktda rost — shuning uchun javobi «Qiziq fikr! Rost, …» bilan boshlanadi; «Aynan!» ekrandan bilib bo'lmasligiga beriladi (P-016).
4. **11-ekran D-varianti** «`<AnimatePresence>` qatori yo'q» — to'rt variant bir shaklda bo'lishi uchun shunday yozildi; aslida u ochiluvchi va yopiluvchi teg (o'rab turadi). Muqobil: «`AnimatePresence` ichiga olinmagan» (aniqroq, lekin shakli boshqa — §147).
5. **0.15 va 0.3 soniya** — sanoatda keng ishlatiladigan qiymatlar, ilmiy manba emas; matn ularni «Maydon'da» deb aytadi, umumiy qonun qilmaydi (T-043). «1 soniyada o'yinchi kutib qoladi» — kuzatuv, son emas.
6. ~~«boshi aylanadi»~~ — audit bilan «boshi aylanishi mumkin» qilindi; MDN dagi «discomfort … vestibular motion disorders» ning soddalashtirilgani (12-ekran).
7. **9-ekran da'vosi** «React o'chirgan element shu zahoti yo'qoladi» — rost; lekin «`transition` bilan belgi birdan chiqadi» faqat oddiy `transition` uchun rost (`@starting-style` yoki `@keyframes` bilan CSS ham chiqishni silliq qila oladi) —
   shuning uchun xulosa faqat ketish va Motion haqida gapiradi.
8. **14-ekran 1-xato** (`0.15` birliksiz): brauzer butun `transition` qatorini tashlab yuboradi — rost (CSS `<time>` birlik talab qiladi); maketda «sakrab» ko'rsatiladi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-04` «Mini-MVP arxitekturasi» → **`m7-05` «Animatsiya: interfeys javob beradi»** → `m7-06` «Birinchi odam kirganda nimani ko'rasiz?»; reja teglari `sub` «transition, transform, Motion» bilan.
- [x] Bitta misol-ip («Maydon», hook → blok); metafora yo'q; bitta vizual — «Maydon» maketi + kod parchasi (`KATAKLAR`); arena 11 — ikkinchi misol faqat test bandida, tanish olamdan (P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 3, 6, 9, 10, 12, 14 (va 0, 5, 8, 16) — matn-karta yo'q.
- [x] Sarlavhalar ≤55 bitta qator (35–54; brauzerda `lint:sarlavha` bilan yakuniy hukm) · Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi (o'z ko'zim bilan; `lint:olchov` kod bosqichida) · xulosalar ≤110 (62–108) · hook javoblari ≤120 (91–96) · xato izohlari ≤60 (38–57).
- [x] Atamalar oldingi darslar bilan bir xil (grep: CssLesson1 — selektor/xususiyat/qiymat, `background-color` — fon rangi, hex kod; 3-Modul — `className`, `onClick`, `npm install`; tayanch — sayt, vaqt katagi, band, o'yinchi) ·
      siz-forma; ketma-ketlik va yorliq ot-shaklda (`RANG_YOLI`, 12-ekran qadamlari), tugma siz-formada; Antigravity promptlari buyruq shaklida (T-002) · «hodisa» bu darsda yo'q (T-015).
- [x] Testlar: variantlar uzunligi yaqin (4: 30–36 · 7: 32–38 · 11: 26–29 · 13: 33–36); `transform`/`transition`/kod belgilari faqat to'g'rida emas; to'g'ri izoh bitta gap, «To'g'ri!» yo'q · ✔: s4 C · s7 A · s11 D · s13 B · arena A·B·C·D ×3.
- [x] Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi, yagona sabab-oqibat tartibi (6-ekranda o'rgatilgan — P-063).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — o'quvchi matnida yo'q; «ko'pincha» bitta joyda, 14-ekran Mentor).
- [x] Ichki kodlar o'quvchi matnida yo'q (modul raqami, F-ID, T6); ekran raqami faqat MD izohlarida · tarixiy voqea yo'q; texnik faktlar manba bilan (A-7) · «KOD» (10) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 (promptda buyruq shakli) · T-011 (transform, animatsiya, transition, mikro-harakat, Motion — harakatdan keyin) · T-015 (hodisa olindi; «javob», «belgi» — shubhali 1–2) ·
      T-016/017 (metafora yo'q) · T-024 (tugmalar «Bajardim», «Qayta sinash», «Nusxalash») · T-039 (sarlavhalarda o'quvchida yo'q narsa uniki qilinmadi) · T-043 (0.15/0.3 — «Maydon'da») · T-045 (9-ekran da'vosi cheklandi) ·
      T-064 (ko'priklarda «N-ekran» yo'q) · T-070 (kartochka javoblari savol so'zini takrorlamaydi) · P-001/004 · P-008 (har ekranda bitta ish; 12 va 14 — qadamlar bilan) · P-013 · P-015 · P-016 · P-025 · P-028 (REPO 5, OS menyu nomi yo'q) ·
      P-052 · P-059 (+ qaror 8 qadami) · P-063 · P-064 · P-065 · P-067 · S-001 (savollar 8–10 so'z) · S-004 · S-006 · S-010 · S-015 · S-026 · S-040 (14-ekran xatosiz qator izohi).
- [x] `npm run lint:til feedback/F-1005-9modul/05-Animation-v3.md` — 0 error, 0 warn (05.10.2026).

---

# 9-Modul · 6-dars (PM + amaliyot) «Birinchi odam kirganda nimani ko'rasiz?» — MD v3

Fayl: `src/7-Modull/PmAnalyticsDayOneLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m7-06` · **14 ekran** (PM qismi 8 · amaliyot bloki 2 · yakun 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **A** (`correctIdx 0`) · 5-ekran — **C** (`2`) · 10-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — PM qismi ≈ 22 (0–7-ekran) · A1 ≈ 22 · A2 ≈ 18 · yakun ≈ 15 (yakuniy savol, podium, kartochkalar, arena).
Menyu nomi (DE-205): App.jsx `m7-06` — «Birinchi odam kirganda nimani ko'rasiz?» · oldingi `m7-05` «Animatsiya: interfeys javob beradi» · keyingi `m7-07` «Loyiha kuni: MVP — birinchi ekran».
Manba: `00-MODUL-TAYANCH.md` (misol-ip, repo, hodisa `vaqt-tanladi`, teg `dars-06-done`) · `GATE_M_JAVOB.md` (qaror 5 — Umami, 7 — juftlik, 8 — blok oxiridagi qadam) · Umami — rasmiy hujjat va manba kodi (05.10.2026 tekshirildi, pastda «Manbalar»).

---

Tashqi audit (ChatGPT) Filtri: `06-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Bitta natija (dastur: «birinchi foydalanuvchidan oldin analitika ulangan»).** Dars oxirida o'quvchining kompyuteridagi `maydon` repo'sida Umami ulangan:
   saytning ochilishi o'zi yoziladi, bo'sh vaqt katagi bosilganda `vaqt-tanladi` hodisasi yoziladi. Namuna — teg `dars-06-done`. Birinchi «odam» — sherigi (A2).
2. **Bugungi asosiy fikr (P-013):** Bizning MVP da analitika birinchi odamdan oldin ulanadi — shunda qaysi qadamdan keyin son keskin kamayganini ko'rasiz.
3. **Atamalar (bir ma'no — bir so'z, T-014):**
   - **analitika** — odamlar saytda nima qilganini yozib, sanab beradigan asbob. 2-ekranda harakatdan KEYIN tug'iladi (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z shu (T-042).
     Sarlavhada — 4-ekrandan boshlab.
   - **hodisa** — analitikaga yoziladigan bitta harakat (tayanch ta'rifi). 6-ekranda saralashdan keyin tug'iladi. Kod ichida — event (`data-umami-event`).
     Nom qoidasi: kichik harf, so'zlar chiziqcha bilan, o'tgan zamon fe'li — `vaqt-tanladi`, `band-qildi` (tayanch).
   - **uch qadam** — «Maydon»da: **Saytni ochdi → Vaqtni tanladi → Band qildi** (GATE M M-q3). O'quvchi matnida faqat «uch qadam»:
     «zanjir» lug'atda boshqa ma'noda band (`zanjir-streak`, MATN_ETALONI 205) va bir ma'noga ikki nom bo'lmaydi. Ustun yorliqlari dars bo'yi aynan shu uch shakl.
   - **Umami** — saytda odamlar nima qilganini yozib boradigan xizmat. Brend izohi bir marta — Reja Mentorida (S-018). Xizmat: Umami Cloud (`cloud.umami.is`).
   - **skript** — Umami bergan bir qator kod (A1 1-qadamida, harakat bilan birga).
   - **Takror — qayta o'rgatilmaydi, o'sha so'zlar bilan:**
     **bosh raqam** — o'z ishini bajarganini sanaydigan raqam (m5-14; «Maydon»da — band qilganlar) ·
     **foydalanish boshlangani / ish oxirigacha yetgani** (m6-14; Saytni ochdi / Band qildi) ·
     **hisobda yozilmagan kun bo'sh qoladi** (m5-11: «Hisobda bundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani 0») ·
     **o'lchagich** — sayt ochilyaptimi, shuni o'lchaydi (m4c-06; faqat kartochka va arenada — analitikadan farqi uchun).
   - **Ishlatilmaydi:** «kuzatish / kuzatuv» analitika ma'nosida (modulda bu — sinovning so'zi, 10-dars «kuzating», T-015) · «voronka / funnel» (chuqur mavzu — «Analitika amalda» darsida) ·
     «event» prozada · «o'lchagich» analitika ma'nosida · «baza» (Database) · vaqt katagining inglizcha nomi.
   - Modul atamalari (tayanch, aynan): sayt · Backend · Database · vaqt katagi · band qilish · band · maydon egasi · agent (Antigravity).
4. **Metafora yo'q.**
5. **Misol raqamlari — mashq uchun o'ylab topilgan, real statistika emas** (manba yo'q; matnda «bu misolda», T-043). Birinchi kun: 12 · 9 · 2. Besh kun — `KUNLAR` (pastda).
   Har kuni eng ko'p odam 2-qadamdan keyin to'xtaydi — 10–11-darsdagi sinov topilmasi («Band qilish» tugmasi forma ostida, ko'rinmaydi) bilan bir yo'nalishda. → TAYANCHGA SAVOL 1.
5a. **Uch xil son (audit 1–2).** Mashqda har odam har qadamda bir marta sanaladi — shuning uchun «7 to'xtadi» deyiladi (2-ekranda aytiladi). Real Umami'da sonlar har xil sanaladi:
   1-qadam — sahifa ochilishlari (Views; alohida tashrifchilar — Visitors), 2-qadam — har bosish (`vaqt-tanladi`; bir odam bir necha marta bosishi mumkin), 3-qadam — Database'dagi bandlar.
   Ularni bir-biridan ayirib «N odam to'xtadi» deyilmaydi — faqat katta pasayish belgisi. Analitika «qayerda?» ga javob beradi, «nega?» ga — 10-darsdagi sinov.
6. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; odam-belgilari CSS doira; Umami maketi chizilgan, logotipsiz. O'yin qatlami (arena, nishon medali, podium) — mustasno.
7. **Kod yozish — Antigravity** (173). Prompt faqat *qayerda · nima qilsin · nima buzilmasin* (173.4); Antigravity'ga gap sen-formada (T-002).
   Xato yo'li — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»

## Darsning ipi va bitta vizual

- **Ip:** «Maydon» ishga tushgan kun. Hook'da o'quvchi birinchi odam bo'lib vaqtni tanlaydi va chiqib ketadi — sayt hech narsa yozmagan, band 0 →
  2-ekran: shu kun yozilganda ko'rinadi — qaysi qadamda to'xtashdi → 4-ekran: kech ulangan kun — to'xtaganlarning izi yo'q →
  6-ekran: qaysi qadamni Umami o'zi yozadi, qaysisiga nom beriladi → 7-ekran: o'z loyihasining uch qadami →
  A1/A2: o'z kompyuterida «Maydon»ga Umami ulanadi, birinchi «odam» — sherigi — yoziladi. Hook savoliga javob — A2 xulosasi.
- **Bitta vizual — Maydon paneli (`MaydonPanel`, dars bo'yi, 163/180):**
  - chapda kichik sayt maketi (telefon ramkasi, 191): sarlavha «Maydon · Shanba», 6 vaqt katagi `16:00` … `21:00`; `17:00` va `20:00` — band (to'q), qolgani bo'sh.
    Bosilgan bo'sh katak 5-dars animatsiyasi bilan kichrayib qaytadi va tanlanadi (accent). Ostida kichik «×» — saytdan chiqish.
  - o'ngda uch ustun — **Saytni ochdi · Vaqtni tanladi · Band qildi**; har ustunda son va odam-belgilari (kichik doiralar).
    Ustun holati: «?» kulrang (yozilmagan) → son (yozildi) → joriy (accent chegara). 3-ustun ostida doimiy kichik yorliq «Database'dan» — band analitikasiz ham saqlanadi.
  - ustunlar orasidagi ikki oraliq — tanlansa qizil chiziq va yorliq «N to'xtadi»; to'xtagan odam-belgilari o'z ustuni ostida kulrang qoladi.
  - qo'shimcha holatlar (o'sha komponent): kun tasmasi «1-kun … 5-kun» (4-ekran; yozilmagan kun — uzuq chiziqli bo'sh katak, U-041) ·
    ustun ostidagi yorliq «Avtomatik yoziladi» / mono `vaqt-tanladi` / qulf «band qilish qurilgach» (6-ekran) · o'quvchi yozgan qadamlar (7-ekran).
  - Ishlatiladi: 0 · 1 · 2 · 3 (kichik) · 4 · 6 · 7. `prefers-reduced-motion` da belgilar yurmaydi — sonlar birdan qo'yiladi.
  - Bloklarda o'ng tomon — **Umami maketi** (`UmamiMock`: «Maydon · localhost» · Visitors · Visits · Views; «Events» ro'yxati) — panelning 1–2-ustuni bilan bitta manbadan (A1/A2 va 10-ekran).
- **`KUNLAR`** (bitta manba, 180; Saytni ochdi · Vaqtni tanladi · Band qildi): 1-kun 12 · 9 · 2 · 2-kun 10 · 8 · 2 · 3-kun 8 · 6 · 1 · 4-kun 9 · 7 · 2 · 5-kun 11 · 8 · 3.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon» ishga tushdi
- Sarlavha: **Birinchi odam kirganda nimani ko'rasiz?** (39) — dars nomi (DE-205)
- Mentor: «Maydon» ishga tushgan kunni tasavvur qiling. Maketda bitta bo'sh vaqtni tanlang va saytdan chiqing.
- Maket (chap): Maydon paneli — telefon maketi faol; ustunlar: Saytni ochdi «?» · Vaqtni tanladi «?» · Band qildi «0 · Database'dan».
- **Harakat → Vizual o'zgarish:** bo'sh katakni bosish (masalan `18:00`) → katak kichrayib qaytadi va tanlanadi; «×» bosish → telefon maketi xiralashadi.
  Panelda hech narsa o'zgarmaydi: ikki ustun «?» qoladi, band 0 — ustunlar bir lahza miltillaydi (bo'sh). Shundan keyin variantlar ochiladi.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Qaysi qadamda chiqib ketganini (30)
  - Hech narsani — u band qilmadi (29)
- Javob (ikkalasida bir xil, maqtovsiz — J-026, P-016): Ikkalasi ham bo'lishi mumkin. Sayt uning qadamlarini yozib borsa — birinchisi, yozmasa — ikkinchisi. (100)
- Javobdan keyin: 1–2-ustun atrofida uzuq chiziqli ramka — bugun yoziladigan joy (U-041).
- Ballsiz (J-026: `correct: false` hammaga). Jonli darsda — sinf ovozlari chizig'i. Tugma: Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun «Maydon» har odamning qadamlarini yozib boradi.** (53)
- Mentor: Umami — saytda odamlar nima qilganini yozib boradigan xizmat. Kodni Antigravity yozadi, siz har qadamni Umami'da tekshirasiz.
- Chap — «Dars oxirida — o'z kompyuteringizda shunday»: Maydon paneli o'zi o'ynaydi (DE-200) — odam-belgisi saytni ochadi → «Saytni ochdi 1»;
  `18:00` tanlanadi → «Vaqtni tanladi 1»; 3-ustun kulrang «?».
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015):
  - 01 · Qaysi qadamdan keyin son keskin kamayishini topasiz · `uch qadam`
  - 02 · Kech ulansa nima yo'qolishini ko'rasiz · `birinchi kun`
  - 03 · «Maydon»ga Umami'ni ulaysiz · `Umami`
  - 04 · Vaqt tanlashni ham yozdirasiz · `hodisa`
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-05-done` · tayyor namuna `dars-06-done`
- Harakat yo'q (reja ekrani) — vizual o'zi o'ynaydi. Tugmalar: Orqaga · Boshlaymiz

## 2 · Qaysi qadamda to'xtadi  ← QTushuncha
- Eyebrow: Tushuncha · uch qadam
- Sarlavha: **Birinchi kuni odamlar qaysi qadamda to'xtadi?** (45)
- Mentor: Ochish — foydalanish boshlangani, band qilish — ish oxirigacha yetgani. Kunni boshlang va o'rtada nima bo'lganini ko'ring.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Ko'pchilik qaysi qadamdan keyin to'xtagan?** · Saytni ochgandan keyin · Vaqtni tanlagandan keyin — tanlov saqlanadi.
- Vizual: Maydon paneli, ustunlar 0 · 0 · 0 (bu kunni sayt yozib borgan).
- **Harakat → Vizual o'zgarish:**
  1. «Kunni boshlang» → 12 odam-belgisi birin-ketin telefon maketidan o'tadi, har biri o'z qadamigacha boradi: ustunlar 12 · 9 · 2 ga o'sadi;
     to'xtaganlar o'z ustuni ostida kulrang qoladi (1-ustun ostida 3, 2-ustun ostida 7).
  2. Bitta qator (`QIzoh`): Bu mashqda har odam har qadamda bir marta sanaladi: ikki ustun farqi — o'sha qadamda to'xtaganlar. (98)
     O'quvchi oraliqni bosadi:
     - to'g'ri (Vaqtni tanladi → Band qildi) → oraliq qizil, yorliq «7 to'xtadi», 7 kulrang belgi bir lahza yonadi;
     - boshqasi (Saytni ochdi → Vaqtni tanladi) → yorliq «3 to'xtadi» qoladi, oraliq silkinadi, `QXato`: Bu yerda 3 odam to'xtadi — ko'prog'i qayerda? (45)
  3. Joriy qator (bitta, oraliq topilgach): Odamlar saytda nima qilganini yozib, sanab beradigan asbob **analitika** deyiladi. (78)
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: vaqtni tanlagandan keyin» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda eng katta pasayish — vaqt tanlashdan keyin. Analitika muammo qayerdaligini aytadi, sababini emas. (109)
- Tugadi (199): tugma paneli yopiladi, panel butun enga chiqadi; vizual ⛶ ichida (q17).
- Tugma (pastki): Kunni boshlang → Oraliqni tanlang → Davom etish
- Nishon: Drop Spotter — birinchi tanlovda to'g'ri oraliq.
- O'qituvchi eslatmasi: «Nega band qilmadi?» savolini ochiq qoldiring — raqam buni aytmaydi; sababni odamning o'zini ko'rib topasiz (sinov darsi). Xulosadagi «sababini emas» shunga.
  Real Umami'da sonlar boshqacha sanaladi (A-5a) — u yerda farq «N odam» emas, pasayish belgisi.

## 3 · 1-savol  ← QTest (✔ A, `correctIdx 0`)
- Eyebrow: Tekshiruv · qaysi qadamda
- Savol ustida kichik Maydon paneli (boshqa kun, bu misolda; har odam bir marta sanalgan): Saytni ochdi 20 · Vaqtni tanladi 4 · Band qildi 3.
- Savol: **Bu kuni ko'pchilik qaysi qadamda to'xtagan?** (6 so'z)
  - ✔ A — Saytni ochib, vaqt tanlamay ketgan (34)
  - B — Vaqtni tanlab, band qilmay ketgan (33)
  - C — Band qilib, ertasi kuni qaytmagan (33)
  - D — Havolani ko'rib, saytni ochmagan (32)
- To'g'ri izohi: 20 odamdan 16 tasi vaqt tanlamay ketdi — farq shu yerda eng katta.
- Xato izohlari (≤60):
  - B: 4 odamdan 3 tasi band qildi — bu yerda bittasi to'xtadi. (56)
  - C: Qaytish uch qadamda yo'q — u kecha va bugunni solishtiradi. (59)
  - D: Saytni ochmagan odam yozilmaydi — uni sanab bo'lmaydi. (54)
  - (umumiy) Qo'shni ikki ustunni solishtiring: farq qayerda katta? (54)
- Tanlagach: kichik panelda tanlangan oraliq belgilanadi (to'g'ri — qizil chiziq «16 to'xtadi», xato — `err` fon).
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Kech ulash  ← QTushuncha
- Eyebrow: Tushuncha · birinchi kun
- Sarlavha: **Analitikani kech ulasangiz, kimning izi yo'qoladi?** (50)
- Mentor: Hisobda yozilmagan kun bo'sh qoladi — buni «Kecha kelgan odam bugun ham keldimi?» darsida ko'rgansiz. Umami'ni qaysi kuni ulashni o'zingiz tanlang.
- Bashorat (ballsiz, zinapoya — S-015, KORPUS §43): **Umami 4-kuni ulansa, besh kundan nechtasi yoziladi?** · Bittasi · Ikkitasi · Beshtasi — tanlov saqlanadi.
- Vizual: Maydon paneli + kun tasmasi «1-kun … 5-kun»; panelda 1-kun.
- **Harakat → Vizual o'zgarish:** ulash kuni — ikki tugma: «4-kuni» · «1-kundan oldin» (ikkalasi ham ko'riladi):
  - «4-kuni» → tasmada 1–3-kun bo'sh (uzuq chiziq), 4–5-kun yoziladi; panelda 1-kun: Saytni ochdi «?» · Vaqtni tanladi «?» · Band qildi «2 · Database'dan» —
    to'xtagan 10 odamning belgisi o'chib ketadi;
  - «1-kundan oldin» → beshala kun yoziladi; panelda 1-kun: 12 · 9 · 2, to'xtaganlar o'z ustuni ostida kulrang.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: ikkitasi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Analitika ulangan kundan boshlab yozadi. Birinchi kunlarda to'xtaganlarning izi qolmaydi. (89)
- Tugadi (199): tugmalar yopiladi, panel va tasma «1-kundan oldin» holatida fokusga; vizual ⛶ ichida.
- Tugma (pastki): Ikkala kunni tanlang (N/2) → Davom etish
- O'qituvchi eslatmasi: band qilganlar Database'da baribir qoladi (`bandlar` jadvali) — yo'qoladigani aynan to'xtab ketganlar. Shuni panelda ko'rsating, gapirib bermang.

## 5 · 2-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · qachon ulanadi
- Savol: **«Maydon»ga hali hech kim kirmagan. Umami'ni qachon ulaysiz?** (8 so'z)
  - A — Band qilish to'liq ishlagandan keyin (36)
  - B — Saytga yuzta odam kirgandan keyin (33)
  - ✔ C — Hozir, birinchi odam kelmasdan oldin (35)
  - D — Birinchi shikoyat kelgandan keyin (33)
- To'g'ri izohi: Ulangan kundan oldingi odamlar yozilmaydi — birinchilari ham.
- Xato izohlari (≤60):
  - A: Band qilish qurilguncha ochganlar yozilmay qoladi. (50)
  - B: Birinchi yuzta odamning izi qolmaydi. (37)
  - D: Shikoyat qilmay ketganlar hech qayerda yozilmaydi. (50)
  - (umumiy) Analitika faqat ulangan kundan boshlab yozadi. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Day One — birinchi urinishda to'g'ri.

## 6 · Kim nimani yozadi  ← QTushuncha (saralash)
- Eyebrow: Tushuncha · hodisa
- Sarlavha: **Umami qaysi qadamni o'zi yozadi?** (32)
- Mentor: Sahifa ochilishi hamma saytda bir xil, vaqt katagi esa faqat «Maydon»da bor. Har qadamni o'z tomoniga qo'ying.
- Vizual: Maydon paneli; uch qadam-karta (ustun nomlari) panel ustida, aralash tartibda; ikki tomon-yorliq: «Avtomatik yoziladi» · «Nom berasiz».
- **Harakat → Vizual o'zgarish:** qadam-kartani bosib, tomonni bosish (yoki sudrash) → to'g'ri bo'lsa karta o'sha tomonga kiradi VA maket o'zgaradi:
  - Saytni ochdi → «Avtomatik yoziladi»: 1-ustun yashil, ostida «Avtomatik yoziladi»; telefon maketi ochilganda 1-ustunga +1 o'zi qo'shiladi.
  - Vaqtni tanladi → «Nom berasiz»: maketdagi bo'sh katak ustida mono yorliq `data-umami-event="vaqt-tanladi"` paydo bo'ladi; katak bosilsa 2-ustunga +1.
  - Band qildi → «Nom berasiz»: 3-ustun ostida mono `band-qildi` va qulf «band qilish qurilgach» — maketda band qilish tugmasi hali yo'q (kulrang).
  Noto'g'ri tomon → karta silkinib qaytadi, bitta qator (`QXato`):
  - ochilish «Nom berasiz»ga: Sahifa ochilishini Umami avtomatik yozadi — nom kerak emas. (46)
  - tanlash yoki band «Avtomatik yoziladi»ga: Umami katakni tanimaydi — unga nom kerak. (41)
- 3/3 da joriy qator (atama — saralashdan keyin, bir marta): Analitikaga yoziladigan bitta harakat **hodisa** deyiladi. (54)
- Xulosa: Sahifa ochilishini Umami avtomatik yozadi. Vaqt tanlash hodisasiga esa nomni siz berasiz. (76)
- Tugadi (199): kartalar yopiladi, panel uch yorlig'i bilan butun enga.
- Tugma (pastki): Uch qadamni joylang (N/3) → Davom etish
- O'qituvchi eslatmasi: `band-qildi` bugun ulanmaydi — band qilish «Loyiha kuni: MVP tayyor» darsida quriladi, hodisa o'sha kuni qo'shiladi (tayanch). Bugun bitta hodisa.

## 7 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Loyihangizda odam qaysi uch qadamni bosib o'tadi?** (49)
- Kirish qatori (kulrang, bitta; 3-dars yozuvi saqlangan bo'lsa): 3-darsda tanlagan muammoingiz: «{saqlangan muammo}». — yozuv bo'lmasa qator chiqmaydi (TAYANCHGA SAVOL 7).
- Mentor: Oxiridan boshlang: odam nima qilsa, loyihangiz o'z ishini bajargan bo'ladi — bu darsda shuni bosh raqam deb olamiz.
- Bitta ustun: Maydon paneli (o'quvchining ustunlari: 1 «Saytni ochdi» — oldindan, ostida «Avtomatik yoziladi»; 2 va 3 — uzuq chiziqli bo'sh) → forma (bitta maydon) →
  Yordam · «Saqlash» o'ngda (187).
- Qadam-doiralar 1/2/3 (joriysi accent, saqlangani ✓):
  1. **Asosiy ish** — maslahat: Odam nima qilganda ishi bitadi? · placeholder: Odam nima qildi?
  2. **Undan oldingi qadam** — maslahat: Asosiy ishdan oldin odam nimani bosadi?
  3. **Hodisa nomi** — maslahat: O'rtadagi qadam uchun nom: kichik harf, so'zlar chiziqcha bilan.
- Tekshiruv (`QXato`, ≤60; bo'sh maydon bloklaydi, qolgani yo'naltiradi):
  - bo'sh: Odamning bitta harakatini yozing. (33)
  - 2-qadam 1-qadam bilan bir xil: Oldingi qadam asosiy ishdan boshqa harakat bo'lsin. (51)
  - 1 yoki 2-qadamda «ochdi»: Sahifa ochilishini Umami avtomatik yozadi — boshqa qadamni yozing. (53)
  - nomda bo'sh joy yoki katta harf: Nomni kichik harf va chiziqcha bilan yozing. (44)
  - nom 50 belgidan uzun (Umami cheklovi — rasmiy hujjat): Nom 50 belgidan oshmasin — qisqaroq yozing. (43)
- Yordam: «Maydon»da asosiy ish — band qilish, undan oldin — vaqtni tanlash. Loyihangizda odam qaysi tugmani bosganda maqsadiga yetadi?
- **Harakat → Vizual o'zgarish:** maydonni yozib «Saqlash» → matn panel ustuniga kiradi: 1-maydon — 3-ustunga (yonida «bosh raqam» yorlig'i), 2-maydon — 2-ustunga,
  3-maydon — 2-ustun ostiga mono nom; joriy doira keyingisiga o'tadi. O'tmagan maydon `err` fonda, ostida bitta `QXato`. 3/3 da forma yopiladi, panel butun enga (199),
  har ustun yonida ✎ (tahrirlash).
- Xulosa: Uch qadamingiz yozildi: bu darsda oxirgisi — bosh raqam, o'rtadagisi — birinchi hodisangiz. (91)
- Tugma (pastki): Uch maydonni yozing (N/3) → Davom etish
- Saqlanadi: A2 5-qadam prompti va uyga vazifa shu yozuvdan oladi (KOD 7).

## A1 · Amaliyot 1 — Umami'ni ulash  ← amaliyot bloki (≈22 daq; `screens[8]`)
- Eyebrow: Amaliyot 1 · Umami
- Sarlavha: **«Maydon» har ochilishni Umami'ga yozsin.** (40)
- Mentor: Birinchi odam kelishidan oldin ulaymiz, uning izi ham qolsin; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — `cloud.umami.is` da ro'yxatdan o'ting (ism, email, parol). «Websites» → «Add website»: Name — `Maydon`, Domain — `localhost` → «Save».
     «Maydon» yonidagi «Edit» → «Tracking code»: Umami bergan bir qator kodni — skriptni — nusxalang.
  2. **Prompt** — Antigravity'da `maydon` papkasini oching. Qavs ichiga skriptni qo'ying, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > `web/index.html` ning `<head>` qismiga Umami skriptini qo'sh: **{Umami bergan skript}**.
     > Skriptda `data-website-id="%VITE_UMAMI_ID%"` bo'lsin — qiymat `web/.env` dagi `VITE_UMAMI_ID` dan keladi; `web/.env.example` ga bo'sh `VITE_UMAMI_ID=` qatorini qo'sh.
     > Kataklar va animatsiyalar o'zgarmasin.
  3. **Ishga tushirish** — `web/.env` da `VITE_UMAMI_ID=` dan keyin qiymat turibdi. Bu ID maxfiy emas — `.env` da turishining sababi: u har o'quvchida boshqa. Terminalda `cd web`, keyin `npm run dev`.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Umami'da tekshirish** — brauzerda `localhost:5173` ni oching. Umami'da «Maydon» sahifasida «Views» (sahifa ochilishlari) soni oshdi.
     0 qolsa — brauzerdagi reklama to'sgich (AdBlock kabi) skriptni to'smaganini tekshiring: shu sahifa uchun o'chirib, sahifani yangilang.
  5. **O'z g'oyangiz** — Umami'da «Add website» bilan loyihangiz uchun yana bitta sayt qo'shing. Uning skriptini shu promptning qavsiga qo'yib, «Nusxalash» —
     promptni saqlab qo'ying, uyda o'z loyihangizga yuborasiz.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (`UmamiMock`, chizilgan, logotipsiz):
  - Maydon · localhost
  - Visitors 1 · Visits 1 · Views 1
  - ostida Maydon panelining 1-ustuni: Saytni ochdi 1 (Views dan; bitta manba)
- Hammasi bajarilgach (yashil): «Maydon» ochilishi Umami'ga yozildi — birinchi odam kelsa, u ham yoziladi. (74)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-06-start` (TAYANCHGA SAVOL 3)
- Nishon (bonus): Tracker On — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: darsdan oldin `cloud.umami.is/signup` ochilishini va «Add website» → «Edit» → «Tracking code» yo'li hozirgi Umami'da shundayligini tekshiring (P-028).
  Akkauntni har o'quvchi o'zi ochadi; ocholmasa — Mentor akkauntiga uning sayti qo'shiladi (GATE M M-q8).
✎ yangi blok. Namuna AvtoPizza emas — «Maydon» (tayanch 3-bo'lim, qaror 8). Website ID `web/.env` da: `dars-06-done` tegi hammaga bir xil, ID esa har kimniki boshqa (TAYANCHGA SAVOL 2).

## A2 · Amaliyot 2 — `vaqt-tanladi` hodisasi  ← amaliyot bloki (≈18 daq; `screens[9]`)
- Eyebrow: Amaliyot 2 · hodisa
- Sarlavha: **Vaqt tanlash ham Umami'ga yozilsin.** (35)
- Mentor: Vaqt katagiga nom beramiz — shunda har tanlov sanaladi; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — terminalda `npm run dev` ishlayapti, Umami'da «Maydon» ochiq.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `web/` dagi vaqt katagi: bo'sh katak bosilganda Umami'ga `vaqt-tanladi` hodisasi yozilsin.
     > Band katak bosilganda hodisa yozilmasin.
     > Umami yuklanmasa ham katak ishlayversin; animatsiyalar o'zgarmasin.
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Sherigingiz bilan tekshirish** — sherigingiz kompyuteringizda «Maydon»ni ochib, bitta bo'sh vaqtni tanlasin. Umami'da «Events» (hodisalar) bo'limida `vaqt-tanladi` — 1.
     Band katakni bosing — son o'zgarmaydi.
  5. **O'z g'oyangiz** — shu promptni loyihangizga yozing: qavslarga mustaqil ishdagi o'rtadagi qadam va hodisa nomi o'zi tushgan. «Nusxalash» — uyda yuborasiz.
     > Saytda **{o'rtadagi qadam}** tugmasi bosilganda Umami'ga **{hodisa nomi}** hodisasi yozilsin.
     > Umami yuklanmasa ham tugma ishlayversin; boshqa tugmalar o'zgarmasin.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (`UmamiMock`, «Events»):
  - Events
  - `vaqt-tanladi` · 1
  - ostida Maydon panelining 1–2-ustuni: Saytni ochdi 1 · Vaqtni tanladi 1
- Qator (`QIzoh`, natija ostida; audit 1): Real Umami'da sonlar har xil sanaladi: ochilish, bosish, Database'dagi band. Ularni ayirmang — pasayishni ko'ring. (113)
- Hammasi bajarilgach (yashil): Endi birinchi odamning ikki qadami ko'rinadi: saytni ochdi va vaqtni tanladi. (77)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-06-done` — `web/.env` o'zgarmaydi.
- Nishon (bonus): First Event — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: sherik sizning kompyuteringiz va brauzeringizda ochsa, «Visitors» o'zgarmasligi mumkin — Umami odamni brauzer va qurilma belgilaridan sanaydi
  (rasmiy «Metric definitions»). Tekshiruv shuning uchun «Events» soniga qaraydi.
✎ yangi blok. Hook savoliga javob shu yerda: birinchi odam (sherik) kirganda uning ikki qadami ko'rinadi.

## 10 · 3-savol  ← QTest (✔ B, `correctIdx 1`; yakuniy — ikki blok birga)
- Eyebrow: Yakuniy tekshiruv
- Savol ustida kichik `UmamiMock`: Visitors 6 · Events — `vaqt-tanladi` 0.
- Savol: **Ochilish yozilyapti, vaqt tanlash — yo'q. Nimani tekshirasiz?** (8 so'z)
  - A — Umami skripti `<head>` da turganini (33)
  - ✔ B — Katakda hodisa nomi borligini (29)
  - C — Reklama to'sgichi o'chiqligini (30)
  - D — Band qilish tugmasi borligini (29)
- To'g'ri izohi: Ochilish yozilyapti — skript ishlayapti; demak hodisa nomi yetmaydi.
- Xato izohlari (≤60):
  - A: Skript bo'lmasa, ochilish ham yozilmasdi. (41)
  - C: To'sgich ishlasa, ochilish ham yozilmasdi. (42)
  - D: Vaqt tanlash band qilishdan oldin — tugma bu yerda emas. (56)
  - (umumiy) Nima yozilyapti, nima yo'q — shuni solishtiring. (48)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 11 · Natijalar (podium)  ← QNatija
- Jonli reyting: 3 savol + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — Qaysi qadamda to'xtadi · 5 — Umami qachon ulanadi · 10 — Hodisa yozilmadi

## 12 · Takrorlash  ← QKartochka
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon | Orqa | Izoh |
|---|---|---|
| Analitika nima? | Odamlar saytda nima qilganini yozib, sanab beradigan asbob | Masalan, Umami |
| Hodisa nima? | Analitikaga yoziladigan bitta harakat | Masalan, `vaqt-tanladi` |
| «Maydon»ning uch qadami qaysi? | Saytni ochdi → Vaqtni tanladi → Band qildi | Bu darsda oxirgisi — bosh raqam |
| Odamlar qaysi qadamda to'xtaganini qanday topasiz? | Qo'shni ikki qadam sonini solishtirasiz | Eng katta farq — ko'pchilik to'xtagan joy |
| Bizning MVP da analitika nega birinchi odamdan oldin ulanadi? | U ulangan kundan boshlab yozadi | Oldingi odamlarning izi qolmaydi |
| Analitikasiz kunda nima ma'lum? | Faqat Database'dagi bandlar | To'xtab ketganlar hech qayerda yo'q |
| Sayt ochilishini kim yozadi? | Umami skripti o'zi | Nom berish shart emas |
| Vaqt tanlashni Umami qanday biladi? | Katakdagi hodisa nomidan | `data-umami-event="vaqt-tanladi"` |
| Website ID maxfiymi? | Yo'q — u sahifa kodida ochiq turadi | `web/.env` da turadi, chunki har kimniki boshqa |
| O'lchagich va analitika — farqi nima? | O'lchagich sayt ochilyaptimi, shuni o'lchaydi; analitika odam nima qilganini yozadi | Ikkalasi ham sizsiz ishlaydi |
| Umami'da hech narsa chiqmasa, avval nima qilasiz? | Reklama to'sgichini shu sahifa uchun o'chirasiz | Reklama to'sgich skriptni to'sishi mumkin |
| Analitika odam nega to'xtaganini aytadimi? | Yo'q — qaysi qadamda to'xtaganini aytadi | Sababni odamning o'zini ko'rib topasiz |

## 13 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha: **Analitika tayyor: birinchi foydalanish ham yoziladi.** (50)
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Analitika odamlar saytda nima qilganini yozib, sanab beradi.
  - Analitika ulangan kundan boshlab yozadi — bizning MVP da u birinchi odamdan oldin ulanadi.
  - Qadamlar sonini solishtirib, qayerda katta pasayish borligini ko'rasiz — bu belgi, sabab emas.
  - Sahifa ochilishini Umami avtomatik yozadi; boshqa harakat — siz nom bergan hodisa.
- Bugungi asosiy fikr (ScoreRing ostida, `small`, kartochkaga qo'shilmaydi — P-013): Bizning MVP da analitika birinchi odamdan oldin ulanadi — shunda qaysi qadamdan keyin son keskin kamayganini ko'rasiz. (96)
- Uyga vazifa (`HwCard`, yangi fayl — KOD 12) · sarlavha: **Uyda nima qilasiz?**
  - Kim uchun: o'z loyihangiz · Nechta: 1 hodisa · Muddat: keyingi darsgacha
  - 1 · Loyihangiz sahifasiga Umami skriptini ulang — Amaliyot 1 da saqlagan prompt bilan.
  - 2 · Uch qadamingizdagi o'rtadagi qadamga hodisa qo'shing — Amaliyot 2 da saqlagan prompt bilan.
  - 3 · Uydagi bir odam saytingizda o'sha tugmani bossin — «Events»da hodisa paydo bo'lsin.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: MVP — birinchi ekran». Talabni siz yozasiz, agent birinchi ekranni quradi. Umami bugundan uning har ochilishini yozadi.
- Nishonlar — pastda (mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Drop Spotter!** — Ko'p odam to'xtagan qadamni birinchi urinishda topdingiz (2)
- **Day One!** — Umami qachon ulanishini birinchi urinishda topdingiz (5)
- **Tracker On!** — «Maydon»ga Umami'ni uladingiz (A1, oxirgi «Bajardim» — bonus, P-048: ish bajarilgan)
- **First Event!** — Birinchi hodisangiz Umami'ga yozildi (A2, oxirgi «Bajardim» — bonus)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida raqam 1/2/3, kodli kartada koddan qator)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Qaysi qadamda to'xtadi** — 1 «Maydon»ning uch qadami: Saytni ochdi → Vaqtni tanladi → Band qildi. ·
  2 Qo'shni ikki qadam sonini solishtiring: farq — o'sha qadamda to'xtaganlar. · 3 Eng katta farq — ko'pchilik to'xtagan qadam.
  - Sinfga savol: Saytni ochdi 15, Vaqtni tanladi 12, Band qildi 3. Son qayerda keskin kamaydi?
- **5 · Qachon ulanadi** — 1 Analitika ulangan kundan boshlab yozadi. · 2 Undan oldingi kunlar bo'sh qoladi: ochib ketganlarning izi yo'q. ·
  3 Band qilganlar Database'da qoladi, to'xtaganlar esa faqat analitikada ko'rinadi.
  - Sinfga savol: Sayt bir hafta Umami'siz ishladi. O'sha haftadan nimani bilamiz?
- **10 · Hodisa yozilmadi** — 1 `<script defer src="…" data-website-id="…">` · Skript sahifa ochilishini avtomatik yozadi. ·
  2 `data-umami-event="vaqt-tanladi"` · Katak bosilishini shu nom yozadi. · 3 Ochilish bor, hodisa yo'q · Skript ishlayapti — katakdagi nomni tekshiring.
  - Sinfga savol: Umami'da ochilish ham, hodisa ham 0. Avval nimani tekshirasiz?

## Jonli viktorina — 12 savol (✔ o'rni: A·B·C·D ×3 — 1A 2B 3C 4D 5A 6B 7C 8D 9A 10B 11C 12D)
1. Analitika saytda nimani yozib boradi?
   - ✔ A — Odamlar saytda nima qilganini (29)
   - B — Sayt necha soniyada ochilishini (31)
   - C — Kodda qancha xato qolganini (27)
   - D — Saytni kim va qachon qurganini (29)
2. Umami 4-kuni ulandi. 1-kundan nima ma'lum?
   - A — Hamma qadam, faqat kechikib keladi (34)
   - ✔ B — Faqat Database'dagi bandlar (27)
   - C — Faqat saytni ochganlar soni (27)
   - D — Hech narsa — bandlar ham o'chgan (32)
3. «Maydon»ning uch qadami qaysi tartibda?
   - A — Band qildi → Vaqtni tanladi → Saytni ochdi
   - B — Vaqtni tanladi → Saytni ochdi → Band qildi
   - ✔ C — Saytni ochdi → Vaqtni tanladi → Band qildi
   - D — Saytni ochdi → Band qildi → Vaqtni tanladi (strelka hammasida — bir uzunlik 42)
4. 10 odam ochdi, 8 tasi vaqt tanladi, 1 tasi band qildi. Son qayerda keskin kamaydi?
   - A — Sahifa ochilgandan keyin (24)
   - B — Band qilib bo'lgandan keyin (26)
   - C — Saytni ochishdan ham oldin (26)
   - ✔ D — Vaqtni tanlagandan keyin (24)
5. Analitikaga yoziladigan bitta harakat nima deyiladi?
   - ✔ A — Hodisa
   - B — Metrika
   - C — Bosh raqam
   - D — Sinov
6. Saytning ochilishini Umami qanday yozadi?
   - A — Har sahifaga hodisa nomi qo'shiladi (35)
   - ✔ B — Skript ulangach, o'zi yozib boradi (34)
   - C — Maydon egasi qo'lda kiritib boradi (34)
   - D — Faqat band qilinganda yozib qo'yadi (35)
7. Bugun nega faqat bitta hodisa qo'shildi?
   - A — Umami bittadan ortig'ini olmaydi (32)
   - B — Ochilish ham nom kutib turadi (29)
   - ✔ C — Band qilish hali qurilmagan (27)
   - D — Bitta hodisa hamma qadamni yozadi (33)
8. «Kun almashtirish» hodisasiga qaysi nom darsdagidek?
   - A — `Kun Almashtirdi`
   - B — `kun almashtirdi`
   - C — `KUN_ALMASHTIRDI`
   - ✔ D — `kun-almashtirdi` (hammasi 15)
9. Katak bosilishini Umami'ga qaysi yozuv aytadi?
   - ✔ A — `data-umami-event` (16)
   - B — `data-website-id` (15)
   - C — `VITE_UMAMI_ID` (13)
   - D — `cloud.umami.is/script.js` (24)
10. Website ID nega `web/.env` faylida turadi?
    - A — Uni boshqa odam ko'rib qolmasligi uchun (38)
    - ✔ B — Har o'quvchining Umami sayti boshqa (35)
    - C — Umami uni faqat .env fayldan o'qiydi (36)
    - D — index.html uni o'zi o'qiy olmagani uchun (39)
11. Sayt ochildi, Umami'da esa 0. Sabab nima bo'lishi mumkin?
    - A — Katakka hodisa nomi qo'shilmagan (32)
    - B — Band qilish tugmasi hali qurilmagan (35)
    - ✔ C — Reklama to'sgichi skriptni yopgan (33)
    - D — Database'ga ulanish uzilib qolgani (34)
12. «Maydon»ning bosh raqami nimani sanaydi?
    - A — Saytni ochgan odamlarni (23)
    - B — Vaqtni tanlagan odamlarni (25)
    - C — Kunni almashtirgan odamlarni (28)
    - ✔ D — Band qilgan odamlarni (21)
- Har savolda to'g'ri variant eng uzun emas (S-006); kalit ibora testlar bilan takrorlanmaydi (S-008): 3-ekran ↔ arena 4 (boshqa sonlar), 5-ekran ↔ arena 2 (boshqa vaziyat), 10-ekran ↔ arena 11 (teskari belgi).
- 10-savol A varianti («ko'rib qolmasligi») — darsda rad etilgan: 12-ekran 9-karta va A1 3-qadam («har o'quvchida boshqa»). 12-savol — m5-14 «bosh raqam» takrori.
- **Fon so'zlari** (R-008, kodda {uz, ru}): Umami · analitika · hodisa · qadam · `vaqt-tanladi` · `data-umami-event` · Visitors · Events · `localhost:5173` · band · Maydon.
- Arena yozuvlari — umumiy shablon (m5-11 YAKUNIY dagidek): «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`)
1. Yangi fayl `src/7-Modull/PmAnalyticsDayOneLesson.jsx` — skeletdan (pilotdan nusxa yo'q, JR-14); palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `m7-06-v1`.
2. `SCREEN_META` 14: hook · plan · concept · test · concept · test · concept · practice (mustaqil) · practice (A1) · practice (A2) · test · stats · flashcards · summary.
   `INLINE_KEYS` { 3: 0, 5: 2, 10: 1 }; bloklar `practice: -1`, signal `PRACTICE_BASE + ekran`.
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s6 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s2, s4 da `QBashorat` + `QTaxmin`) · s3/s5/s10 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s7 `QMustaqil` · A1/A2 `QBlok` (`ScreenBlok` ulagichi, 5 qadam) · s11 `QNatija` · s12 `QKartochka` · s13 `QYakun`.
4. **Bitta vizual `MaydonPanel`** (180): `QADAMLAR` const — 3 qadam { id, nom: «Saytni ochdi» / «Vaqtni tanladi» / «Band qildi», hodisa: null / `vaqt-tanladi` / `band-qildi`, kim: umami | siz } (P-063);
   `KUNLAR` (5 × 3 son); `KATAKLAR` (16:00–21:00, band 17:00 va 20:00). Ustun holatlari (? · son · joriy), oraliq tanlash, odam-belgilari (CSS), kun tasmasi, ostki yorliqlar.
   0, 1, 2, 3 (kichik), 4, 6, 7-ekranlar shundan. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: mp-katak mp-oraliq mp-ustun mp-kun`). `reduced-motion` — o'tishsiz.
5. **`UmamiMock`** — Umami ko'rinishining chizilgan maketi (logotipsiz): sarlavha «Maydon · localhost», uch son (Visitors · Visits · Views), «Events» ro'yxati (nom · son).
   A1/A2 natijasi va 10-ekran savol ustida; sonlar `MaydonPanel` 1–2-ustuni bilan bitta manbadan.
6. s2 — «Kunni boshlang» animatsiyasi (12 belgi, `KUNLAR[0]`), oraliq tanlash, ta'rif qatori; nishon `dropSpotter` (birinchi tanlov to'g'ri). s4 — ulash kuni tanlagichi (2 holat), tasma, `QTaxmin`.
   s6 — saralash (3 karta → 2 tomon), maketga mono yorliq `data-umami-event="vaqt-tanladi"`, ta'rif qatori.
7. s7 — `QMustaqil` 3 maydon + tekshiruv (bo'sh · takror · «ochdi» · nom formati `/^[a-z0-9]+(-[a-z0-9]+)*$/` (o'zbek apostrofi bilan — `'` ruxsat) · ≤50 belgi);
   saqlash: artefakt kalit (masalan `pm-m7-06-qadamlar`, `ccProgress` bilan) → A2 5-qadam prompti `{o'rtadagi qadam}`, `{hodisa nomi}` oldindan to'ldiriladi; uyga vazifa banneri.
   3-dars yozuvi kirish qatori — 3-dars kaliti ma'lum bo'lgach (TAYANCHGA SAVOL 7).
8. A1/A2 — `ScreenBlok` (skelet) 5 qadam; prompt qatorlari `prompt: [...]`, `{…}` joylar accent pill; A1 4-qadamida xato yo'li — reklama to'sgichi gapi (P-026).
   `ortda`: A1 `dars-05-done`, A2 `dars-06-done`; `git fetch` qatori repo manzili kelgach (TAYANCHGA SAVOL 3).
9. Testlar s3/s5/s10 — matn yuqoridagidek, variantlar uzunligi `git diff` dan keyin skript bilan qayta sanaladi; s3 savol ustida kichik `MaydonPanel` (20 · 4 · 3), s10 ustida kichik `UmamiMock`.
   `RECAPS` { 3, 5, 10 } (`ask` + 3 karta; 10-ekran kartalarida kod qatori); `Q_LABELS` { 3, 5, 10 }.
10. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s2 → Drop Spotter · s5 birinchi urinish → Day One · A1 oxirgi «Bajardim» → Tracker On · A2 oxirgi «Bajardim» → First Event.
11. `QUIZ_BANK` 12 (✔ A·B·C·D ×3) + fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}).
12. s13 `QYakun`: `recap` 4 qator, «Bugungi asosiy fikr» `small`, `uyga` — yangi `PmAnalyticsDayOneLesson.homework.jsx` (`HwCard`, 3 qadam; PM-027 eski fayllar uchun — bu yangi, asosiy seans qarori), `keyingi` matni.
13. App.jsx `m7-06` qatoriga `comp` ulash — asosiy seans (nom o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari (3, 5, 10).
- Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`dars-06-done` = `dars-05-done` + bitta commit; «qur» bosqichida)
1. `web/index.html` `<head>`: `<script defer src="https://cloud.umami.is/script.js" data-website-id="%VITE_UMAMI_ID%"></script>`
   (Vite `index.html` da `import.meta.env` qiymatlarini `%NOM%` bilan qo'yadi; o'zgaruvchi bo'lmasa — qator o'zgarmay qoladi, sayt ishlayveradi, Umami yozmaydi).
2. `web/.env.example`: `VITE_UMAMI_ID=` + izoh «6-dars: Umami → Edit → Tracking code dagi data-website-id»; `.gitignore` da `web/.env` (tayanch 4-dars `.gitignore` i tekshiriladi).
3. Vaqt katagi komponenti: bo'sh katakda `data-umami-event="vaqt-tanladi"`, band katakda atribut yo'q. `umami.track` emas — atribut Umami yuklanmasa ham xato bermaydi
   (A2 promptidagi «Umami yuklanmasa ham katak ishlayversin»).
4. README: «Darslar va teglar» jadvaliga 6-dars qatori; «Xatolar»: Umami'da 0 — reklama to'sgichi / `web/.env` da `VITE_UMAMI_ID` bo'sh (dev serverni qayta yoqing).
5. **Bog'liqlik:** 9-dars `band-qildi` shu usulda qo'shiladi; deploy'da hostingga `VITE_UMAMI_ID` muhit qiymati qo'shiladi (Vite uni build paytida o'qiydi) —
   9-dars MD shu nomni ishlatadi (TAYANCHGA SAVOL 2). Umami'dagi Domain (`localhost`) deploy manziliga almashtirilishi — 9-darsda, ixtiyoriy (Domain faqat referrer filtri uchun).

## Manbalar (Umami — rasmiy, 05.10.2026 ochib tekshirildi)
- Sayt qo'shish: https://docs.umami.is/docs/add-a-website — «Websites» (yon menyu) → «Add website» → Name, Domain → «Save».
- Kod: https://docs.umami.is/docs/collect-data — «Edit» → «Tracking code», kod `<head>` ga; reklama to'sgichi skriptni to'sishi mumkin.
  Kod shakli — Umami manba kodi `src/app/(main)/websites/[websiteId]/settings/WebsiteTrackingCode.tsx`: `<script defer src="${url}" data-website-id="${websiteId}"></script>`;
  bulutda manzil `https://cloud.umami.is/script.js` (`next.config.ts`).
- Hodisa: https://docs.umami.is/docs/track-events — `data-umami-event="…"` yoki `umami.track('…')`; nom 50 belgigacha; hodisalar «Events» sahifasida.
- Sonlar: https://docs.umami.is/docs/metric-definitions — Visitors (sessiya: website ID, hostname, User-Agent xeshi), Visits, Views.
- Domain maydoni `localhost` ni qabul qiladi (`DOMAIN_REGEX`, `src/lib/constants.ts`); tracker `localhost` ni o'tkazib yubormaydi (`src/tracker/index.ts` — `data-domains` berilmasa).
- Ro'yxatdan o'tish: https://cloud.umami.is/signup — Name, Email address, Password. Hobby rejasi bepul (https://docs.umami.is/docs/cloud/faq); sayt soni cheklovi rasmiy sahifada topilmadi.
- Vite: https://vite.dev/guide/env-and-mode — `index.html` da `%VITE_…%`; `VITE_` qiymatlari brauzer kodida ochiq (website ID maxfiy emas).

---

## TAYANCHGA SAVOL
1. **Misol raqamlari** — tayanchda yo'q. Qaror: birinchi kun 12 · 9 · 2, besh kunlik `KUNLAR`, eng ko'p to'xtash 2→3 qadamda (10-darsdagi «Band qilish tugmasi ko'rinmaydi» topilmasiga mos).
   Nega so'rayman: 10–12-darslar (sinov, pitch) shu raqamlarni ishlatishi mumkin — tayanchga yozilsinmi?
2. **`web/.env` → `VITE_UMAMI_ID`** — yangi nom, 9-dars deploy'iga tegadi. Nega: `dars-06-done` tegi hamma uchun bir xil, website ID esa har o'quvchida boshqa;
   ID `index.html` da qattiq yozilsa, `git checkout -f dars-06-done` mentorning ID sini qo'yadi.
3. **Repo manzili** (`git fetch … --tags` qatori, A1/A2 «Ortda qoldingizmi») — tayanchda yo'q; o'quvchi `maydon` ni qanday oladi (fork / clone, qaysi darsda). MD da `{maydon repo manzili}`.
4. **Vaqt katagi qaysi faylda** (`web/src/…`) — 4–5-dars qurilganda aniqlanadi; promptda fayl nomisiz «`web/` dagi vaqt katagi».
5. **`dars-05-done` da katak bosilganda nima bo'ladi** (faqat tanlanadimi, «Band qilindi» belgisi chiqadimi) — hook maketi va hodisa sharti «bo'sh katak bosilganda» shunga bog'liq.
6. **Umami akkaunti kimniki:** har o'quvchi o'zi (email kerak) / juftlik / mentor jamoasi? Rasmiy hujjatda Hobby sayt soni va yosh cheklovi topilmadi.
   A1 5-qadami (o'z loyihasi uchun ikkinchi sayt) shunga bog'liq.
7. **3-dars yozuvi** (tanlangan muammo, «qilamiz» ro'yxati) localStorage'da saqlanadimi va qaysi kalitda — 7-ekran kirish qatori uchun.
8. **O'z MVP kodi 6-darsgacha bormi** — uyga vazifa 1–2-qadami loyiha sahifasi borligini kutadi. Yo'q bo'lsa: «promptni saqlab qo'ying, birinchi ekran qurilgan kuni yuborasiz».
9. **«Zanjir» so'zi** — GATE M M-q3: hamma darsda «uch qadam».
10. **Keys («Biznes olamidan»)** — qo'yilmadi: PM qismi ≈20 daqiqa, ishonchli manbali qisqa keys topilmadi. Kerakmi?
11. **Ikki amaliyot bloki** (A1 ulash, A2 hodisa) — tayanchda «amaliyot bloki» birlikda. Bitta 7–8 qadamli blok o'quvchi uchun og'ir deb bo'ldim.
12. **Hodisa nomi qoidasi** («kichik harf, so'zlar chiziqcha bilan, o'tgan zamon fe'li») — modul qoidasi sifatida tayanchga (9-dars `band-qildi` ham shunday).

## Shubhali joylar (ishonchim komil emas)
- Umami interfeys nomlari («Websites», «Add website», «Edit», «Tracking code», «Events», «Visitors») — rasmiy hujjatdan, lekin Umami versiyasi o'zgarsa, tugma boshqa joyda bo'lishi mumkin (P-028 — darsdan oldin tekshiruv).
- A1 2-qadam promptining ikkinchi qatori (`VITE_UMAMI_ID` dan olinsin) — 173.4 «texnologiya aytilmaydi» chegarasida; kerakli, chunki tegdan keyin ham har kimning ID si o'zida qolsin.
- s4 Mentorida o'tgan dars nomi butun keltirildi («Kecha kelgan odam bugun ham keldimi?») — uzun, lekin modul raqami ichki kod bo'lgani uchun boshqa yo'l topmadim.
- A2 4-qadam — sherik bir xil kompyuterda: «Visitors» o'smasligi mumkin; tekshiruv «Events» ga qaratildi, lekin o'quvchi «Visitors» ga qarab hayron bo'lishi mumkin.
- Arena 2 (to'g'ri: «Faqat Database'dagi bandlar») — «Maydon»da band qilish 9-darsda quriladi; savol 4-ekrandagi «ishga tushgan kun» vaziyatiga tayanadi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-05` «Animatsiya: interfeys javob beradi» → **`m7-06` «Birinchi odam kirganda nimani ko'rasiz?»** → `m7-07` «Loyiha kuni: MVP — birinchi ekran» (App.jsx 313-qator, 05.10).
- [x] Bitta misol-ip — «Maydon» (hook → 7-ekran → bloklar); ikkinchi misol yo'q (7-ekran — o'quvchining o'z loyihasi, P-004). Metafora yo'q. Bitta vizual — `MaydonPanel` (bloklarda uning `UmamiMock` davomi).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (odamlar oqadi, oraliq), 4 (ulash kuni → tasma), 6 (saralash → maketga nom yorlig'i) + 0, 7, A1, A2. Matn-karta yo'q.
- [x] O'lchov (skript bilan sanaldi): sarlavhalar 32–53 · Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi · xulosalar 74–99 · hook javobi 100 · xato izohlari 33–59.
- [x] Atamalar: sayt · Backend · Database · vaqt katagi · band (tayanch); bosh raqam (m5-14), foydalanish boshlangani / ish oxirigacha yetgani (m6-14), yozilmagan kun (m5-11), o'lchagich (m4c-06) — grep bilan o'sha so'zlar.
  Siz-forma; tugmalar siz-formada, yorliqlar ot-shaklda (§222/224); Antigravity promptlari sen-formada (T-002).
- [x] Testlar: variantlar 29–36 belgi, to'g'ri variant eng uzun emas; kod/qavs faqat xato variantda (10-A) · ✔ o'rni A/C/B (yangi dars) · arena A·B·C·D ×3.
- [ ] Final tartib-mashqi — yo'q (PM qismi + amaliyot; yakuniy — `QTest`), shuning uchun uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («har doim», «100%», «darrov», «darhol», «doim» — grep 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (modul raqami, T6, P1 — yo'q; o'tgan dars nomi bilan atalgan) · real raqam yo'q (mashq raqamlari — «bu misolda»), Umami fakti — rasmiy manba bilan · «KOD» 13 band, «REPO» 5 band.
- [x] Karta T · P · S · PM ko'rildi: T-011 (analitika 2-ekranda, hodisa 6-ekranda — harakatdan keyin) · T-014/015 (uch qadam, «kuzatuv» yo'q) · T-024/029/047 · T-039 (««Maydon»ga», o'z loyihasi — «loyihangiz») ·
  T-042 (ta'rif so'zma-so'z) · T-043 («bu misolda») · T-045 (Umami odamni ism bilan emas, brauzer belgilaridan sanaydi — «kim» deyilmaydi) · T-064 (sarlavha zanjiri) ·
  P-001/004/008/013/014/015/016/025/026/028/036/046/048/052/059/062/063/064/067 · S-001/002/004/006/008/010/015/018/025/026 · PM-021 (maydon yo'riqlari) · PM-030 (misol → atama).
  ✗ P-011 (PM V4 tartibi: keys, klinika, koding) — gibrid dars, PM qismi ≈20 daqiqa; keys yo'q (TAYANCHGA SAVOL 10). ✗ P-059 «4 qadam» — 5 qadam (qaror 8 «blok oxirida bitta qadam»).

---

# 9-Modul (kod: 7-Modul) · 7-dars «Loyiha kuni: MVP — birinchi ekran» — MD v3 (loyiha kuni qolipi)

Fayl: `src/7-Modull/MvpFirstScreenLesson.jsx` · kalit `m7-07` · **8 ekran + 3 amaliyot bloki = 11** · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · qolip: 172-qonun (8 + 3) va 173-qonun (blok repo ustida) · qaror 8 (blok oxirida «O'z g'oyangiz» qadami) ·
namuna: `feedback/F-0929-QA-6modul/08-PipelineProject-v3.md` (tuzilish, matn ko'chirilmadi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD dan olinadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **A**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 58 (A1 ≈ 20 · A2 ≈ 23 · A3 ≈ 15; har blokning 5-qadami ≈ 3 daqiqa).
Menyu nomi (DE-205): App.jsx `m7-07` — «Loyiha kuni: MVP — birinchi ekran» (osti: «talabni siz yozasiz, agent quradi») ·
oldingi dars m7-06 «Birinchi odam kirganda nimani ko'rasiz?» · keyingi m7-08 «Yaxshi interfeysdan nimani olasiz?».

---

Tashqi audit (ChatGPT) Filtri: `07-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida `maydon` repo'sida «Maydon» saytining birinchi ekrani Backend bilan ishlaydi: vaqt kataklari
   `GET /vaqtlar?kun=` dan keladi, kun almashtirilsa kataklar shu kunniki bo'ladi, Backend javob bermasa sayt buni aytadi;
   animatsiya darsidagi uch harakat va `vaqt-tanladi` hodisasi joyida qoladi. Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
   Bugungi yagona yangi ko'nikma — **talab yozish**; kodni Antigravity yozadi. Teg: `dars-07-done`.
2. **Bugungi asosiy fikr (P-013):** Agent talabga tayanib quradi; noaniq yoki aytilmagan joyni taxmin qilishi mumkin — shuning uchun natijani talabning har qatori bo'yicha saytda tekshirasiz.
   Uch qism (qayerda · nima qilsin · nima buzilmasin) — bu kursdagi amaliy qolip, dunyodagi yagona qoida emas: matnda «bu darsda» (audit 2). «Nima buzilmasin» — agentga cheklov, kafolat emas: tekshiruv baribir o'quvchida (audit 4).
3. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim):**
   - **talab** — promptdagi vazifa; uch qismi: **qayerda · nima qilsin · nima buzilmasin** (173.4). 2-ekranda, harakatdan keyin tug'iladi (T-011). «spec», «TZ» yo'q.
     Yaxshi talab — uchala qismi bor va har qatorini saytda tekshirib bo'ladi. Yomon talab — qism tushib qolgan yoki umumiy so'z («chiroyli qil»).
   - **prompt** — agentga yuboriladigan xabar (5–6-Moduldan tanish). Blokdagi «Prompt» qadami va «Nusxalash» qutisi shu nomda qoladi.
     Prompt — xabar, talab — uning ichidagi vazifa; ikkalasi 2-ekranda bir gapda tenglashtiriladi (T-052).
   - **agent** — Antigravity (6-Moduldan tanish). Prozada «agent», blok qadamlarida dastur nomi «Antigravity» (qayerga yuborish).
   - **sayt** (`web/`, `localhost:5173`) · **Backend** (`backend/`, `localhost:3000`) · **Database** (`bandlar` jadvali, Neon). «server», «baza», «frontend» yo'q.
   - **vaqt katagi** (birinchi marta to'liq, keyin «katak») · **bo'sh** · **band** · **kun almashtirgichi** · **hodisa** (`vaqt-tanladi`, analitika darsidan) · **animatsiya** (animatsiya darsidan).
   - **tekshirish** — natijani o'zingiz saytda ko'rib chiqasiz. «sinov» ishlatilmaydi: u modulda real odam ilovani ishlatishi uchun band (10-dars, T-015).
   - «ekran» — faqat MVP ekrani ma'nosida (dars nomi: «birinchi ekran»); dars ekrani o'quvchi matnida «ekran» deb atalmaydi (T-064).
   - «Tayyor» — faqat agent javobidagi so'z (0- va 4-ekran); yakun belgisida ham yo'q (T-015). «maydon» — faqat «Maydon» sayti; forma joylari «qator» deyiladi.
4. **Metafora yo'q.**
5. **Kod yozish — Antigravity** (173.1). Prompt faqat *qayerda · nima qilsin · nima buzilmasin* deydi (173.4) — har qator o'z yorlig'i bilan boshlanadi,
   shuning uchun talabning uch qismi har blokda ko'rinib turadi. Texnologiya aytilmaydi (repo'da). Xato bo'lsa — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
   Prompt matni sen-formada (T-002) — o'quvchi agentga buyruq beradi.
6. **Talab yozish zinapoyasi (uch blok):** A1 — talab tayyor, faqat `{kun}` joyini to'ldirasiz · A2 — «Nima buzilmasin» qatorini o'zingiz yozasiz ·
   A3 — uch qatorni ham o'zingiz yozasiz (namuna «Yordam» ortida). Har blokning 5-qadami — «O'z g'oyangiz»: shu talabni o'z MVP g'oyangiz uchun yozasiz (qaror 8).
7. **Real odam bilan ish bu darsda yo'q** (qaror 7 — 2, 10, 12-darslar). **Uyga vazifa yo'q** (172.4): ish repo'da, keyingi dars shu repo ustida.
8. **Toza yuza (D4):** tugma va variantlarda emoji yo'q; maketlar chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon» (tayanch 1) — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan sayt; 4–6-darslarda skeleti, animatsiyasi va analitikasi qurilgan.
  O'quvchi blokda Mentor misolini repo'da quradi, 5-qadamda shu talabni o'z g'oyasiga yozadi. Kutilgan natija doim «Maydon» bilan ko'rsatiladi.
- **Hook:** bir qatorli prompt «Vaqtlarni Backend'dan olib kel.» → agent «Tayyor!» → saytda ikkinchi ro'yxat, kun tanlab bo'lmaydi, katak jonlanmaydi →
  «Nima yetishmadi?» → talab (2-ekran).
- **Bitta vizual — «Maydon» sayt maketi (`MAYDON_KATAKLAR`, dars bo'yi, 163/180):**
  - Brauzer ramkasi `localhost:5173`; sarlavha «Maydon»; kun almashtirgichi «‹ Bugun ›» (ikki kichik strelka, o'rtada kun nomi).
  - Olti vaqt katagi (2 qator × 3): 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00 — **bo'sh** (oq) yoki **band** (kulrang, «band» yozuvi, bosilmaydi).
  - Ostida bitta mono holat qatori — kataklar qayerdan: «namuna ma'lumot · faylda» (dars boshi) → `GET /vaqtlar?kun=2026-10-10 · Backend` (ulangan) →
    «Backend javob bermadi» (xato holati). 2- va 4-ekranda yonida hodisa sanog'i `vaqt-tanladi · N`.
  - Holatlar: statik (kun almashtirgichi yo'q) · Backend'dan · buzilgan joy (qizil halqa + bir qatorlik kuzatuv) · tuzaldi (yashil halqa, so'nadi) · xato holati (kataklar o'rnida xabar).
  - Animatsiya maketda haqiqiy: bo'sh katak bosilsa kichrayib qaytadi (`transform`); «buzilgan» holatda jonlanmaydi. `prefers-reduced-motion` da harakat yo'q, faqat rang.
  - Namuna sanalari: bugun — Dushanba (`2026-10-05`), namuna bandlar — Shanba (`2026-10-10`) 17:00 va 20:00 (18:00 ataylab bo'sh — 10-dars sinov vazifasi «Shanba 18:00»).
  - Ishlatilishi: 0 (hook, buzilgan) · 1 (tayyor natija) · 2 (talab qismlari) · 4 (talab qatorlarini tekshirish) ·
    A1 o'ng — Backend javobi (brauzer `localhost:3000/vaqtlar?kun=…`), A2/A3 o'ng — shu maketning kattasi (bitta manba).
- **Yakun:** birinchi ekran Backend bilan ishlaydi · keyingi dars — bitta yaxshi namuna va animatsiyalar.

---

## 0 · Kirish — agent «Tayyor» dedi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Agent «Tayyor» dedi. Nega sayt buzildi?** (39)
- Mentor: «Maydon» saytidagi kataklarni Backend'dan olmoqchimiz — agentga bir qatorli prompt yozildi. «Yuborish»ni bosing.
- Maket (chap): tepada agent chati — o'quvchi pufagi «Vaqtlarni Backend'dan olib kel.» va «Yuborish» tugmasi; ostida «Maydon» maketi **statik** holatda:
  kun almashtirgichi yo'q, olti katak faylda yozilgan namuna (4-darsdagidek), holat qatori «namuna ma'lumot · faylda». Bo'sh katak bosilsa kichrayib qaytadi.
- **Harakat → Vizual o'zgarish:** «Yuborish» → agent pufagi «yozmoqda…» → «Tayyor! Vaqtlar endi Backend'dan keladi.» → maket o'zgaradi:
  kataklar ostida yangi oddiy ro'yxat chiqadi («16:00 — bo'sh», «17:00 — bo'sh» …), kataklar o'zi faylda qoladi, kun almashtirgichi yo'q,
  katak bosilsa endi jonlanmaydi. Shundan keyin savol ochiladi.
- Savol: **Nima yetishmadi?**
  - Agent kuchsiz — boshqa agentni ishlatish kerak edi (50)
  - ✔ Promptda joy yo'q — nimaga tegmaslik ham aytilmagan (51)
  - Prompt juda qisqa — uni uzunroq yozish kerak edi (48)
- Javob — 2-variant: **Aynan!** Bu misolda agent vaqtlarni Backend'dan oldi, lekin qayerga qo'yish va nimaga tegmaslik aytilmagan edi. (102)
- Javob — 1 yoki 3: **Qiziq fikr!** Muammo agentda ham, uzunlikda ham emas: vaqtlar keldi, lekin qayerga qo'yish va nimaga tegmaslik yozilmagan. (108)
- Javobdan keyin: maketda uch joy qizil halqa bilan belgilanadi, har birida bir qator: «Ikkinchi ro'yxat» · «Kun tanlab bo'lmaydi» (bo'sh joy, uzuq chiziq — U-041) ·
  «Katak jonlanmaydi». Ular 2-ekranda tuzatiladi.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida «Maydon» ekrani Backend bilan ishlaydi.** (52)
- Mentor: Talabni siz yozasiz, kodni agent yozadi. «Maydon» — namuna: har amaliyot oxirida o'z g'oyangizga ham yozasiz.
- Chap — «Dars oxirida»: «Maydon» maketi **tayyor** holatda, bir marta o'zi yuradi (DE-200):
  - «‹ Bugun ›» — olti katak bo'sh; «›» bilan Shanbaga o'tiladi → 17:00 va 20:00 «band» bo'ladi; bo'sh katak kichrayib qaytadi.
  - Holat qatori: `GET /vaqtlar?kun=2026-10-10 · Backend`.
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Backend tanlangan kunning kataklarini beradi
  - 02 · Sayt kataklarni Backend'dan oladi, kun almashadi
  - 03 · Backend javob bermasa, sayt buni aytadi
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-06-done` · namuna `dars-07-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Talabning uch qismi  ← QTushuncha
- Eyebrow: Tushuncha · talab
- Sarlavha: **Promptga nima qo'shsangiz, agent aniqroq quradi?** (48)
- Mentor: Kirishdagi bir qatorli promptga qism qo'shing — har safar agent qaytadan quradi.
- Bashorat (ballsiz, 181): **Promptga bitta qism qo'shsangiz, nechta buzilgan joy tuzaladi?** · Bittasi · Ikkitasi · Uchalasi — tanlov saqlanadi.
- Chapda prompt kartasi: «Vaqtlarni Backend'dan olib kel.» va ostida uchta bo'sh qator; pastda to'rt bo'lak (tartibi aralash):
  - «Saytdagi vaqt kataklari» — joyi: **Qayerda**
  - «Kun almashtirilsa, kataklar shu kun uchun Backend'dan kelsin» — joyi: **Nima qilsin**
  - «Katak animatsiyasi va `vaqt-tanladi` hodisasi» — joyi: **Nima buzilmasin**
  - «Chiroyli va zamonaviy qilib ber» — tuzoq (S-040)
- O'ngda «Maydon» maketi — kirishdagi natija: uch buzilgan joy qizil halqada (ikkinchi ro'yxat · kun tanlab bo'lmaydi · katak jonlanmaydi), hodisa sanog'i `vaqt-tanladi · 0`.
- **Harakat → Vizual o'zgarish:** bo'lakni bosish → u prompt kartasidagi o'z qatoriga tushadi, yonida yorlig'i chiqadi → «agent qaytadan quryapti…» (≈0,8 s) →
  maketda mos joy tuzaladi (halqa yashil, so'nadi):
  - Qayerda → ikkinchi ro'yxat yo'qoladi, kataklarning o'zi Backend'dan keladi (holat qatori `GET /vaqtlar`);
  - Nima qilsin → kataklar ustida kun almashtirgichi paydo bo'ladi; Shanbaga o'tilsa 17:00 va 20:00 band bo'ladi;
  - Nima buzilmasin → bo'sh katak bosilsa kichrayib qaytadi, hodisa sanog'i `vaqt-tanladi · 1`;
  - tuzoq → maket ranglari bir lahza o'zgaradi, buzilgan joylar qoladi; bo'lak silkinib joyiga qaytadi, bir qator: «Umumiy so'z — agent nimani tuzatishni bilmaydi.» (47)
  Qismlar istalgan tartibda qo'shiladi; har qism faqat o'z joyini tuzatadi (holat qo'shilgan qismlardan chiziladi — P-046; bu dars mexanikasi — haqiqiy kodda bitta o'zgarish bir necha joyga tegishi mumkin).
- Joriy qator (3/3 dan keyin, bitta): Promptdagi bunday vazifa **talab** deyiladi: qayerda, nima qilsin, nima buzilmasin. (79)
- Natija qatori: «Taxminingiz: … · haqiqatda: har qism bitta joyni tuzatdi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu darsda talab uch qismli: qayerda, nima qilsin, nima buzilmasin. Bu mashqda har qism bitta muammoni yopdi. (108)
- Tugadi (199): harakat paneli yopiladi; uch qatorli talab kartasi va tuzalgan maket yonma-yon fokusga; vizual ⛶ ichida (q17).
- Tugma (pastki): Qism qo'shing (N/3) → Davom etish

## A1 · Amaliyot 1 — Backend kun bo'yicha kataklarni beradi  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · Backend → Database
- Sarlavha: **Backend tanlangan kunning vaqt kataklarini bersin.** (50)
- Mentor: Talab tayyor — siz faqat {kun} joyini to'ldirasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Birinchi terminalda: `cd backend`, `npm run start:dev`. Ikkinchisida: `cd web`, `npm run dev`.
  2. **Prompt** — `{kun}` joyiga eng yaqin shanba sanasini `yil-oy-kun` shaklida yozing (masalan `2026-10-10`), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: `backend/`, yangi yo'l `GET /vaqtlar?kun=` (kun — sana, masalan 2026-10-10).
     > Nima qilsin: shu kun uchun 16:00 dan 21:00 gacha har soatga bitta katak qaytarsin: soat va holat — «bo'sh» yoki «band».
     > Holatni `bandlar` jadvalidan ol: shu kun va soatda yozuv bo'lsa — «band».
     > `http://localhost:5173` dan kelgan so'rovga ruxsat ber (CORS).
     > Tekshirish uchun `bandlar` da **{kun}** 17:00 va 20:00 namuna bandlari bo'lmasa — qo'sh; bor bo'lsa, qayta qo'shma.
     > Nima buzilmasin: sayt kodi va `bandlar` jadvalining ustunlari. Boshqa joyga tegma.
  3. **Ishga tushirish** — Backend terminali o'zi qayta yukladi, xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — `localhost:3000/vaqtlar?kun=` ga o'z sanangizni qo'shib oching: olti katak, 17:00 va 20:00 — «band». Boshqa sanani yozing — hammasi «bo'sh».
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: g'oyangizning birinchi ekrani Backend'dan qaysi ro'yxatni oladi? Uch qatorni to'ldiring:
     Qayerda: … · Nima qilsin: … · Nima buzilmasin: … — «Bajardim» uchala qator yozilgach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:3000/vaqtlar?kun=2026-10-10`):
  ```
  [ { "soat": "16:00", "holat": "bo'sh" },
    { "soat": "17:00", "holat": "band" },
    { "soat": "18:00", "holat": "bo'sh" },
    { "soat": "19:00", "holat": "bo'sh" },
    { "soat": "20:00", "holat": "band" },
    { "soat": "21:00", "holat": "bo'sh" } ]
  ```
- Hammasi bajarilgach (yashil): Backend tanlangan kunning kataklarini beradi, holatini Database'dan oladi. (74)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-07-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Kataklar keldi, lekin `vaqt-tanladi` hodisasi yozilmayapti. Talabda nima yo'q edi?** (10 so'z)
  - Qayerda — agent saytning qaysi joyida ishlashi
  - Nima qilsin — agent qaysi ishni bajarishi
  - ✔ Nima buzilmasin — agent nimaga tegmasligi
  - Texnologiya — agent qaysi kutubxonani olishi
- Kalit: **C** (index 2). Variantlar: 46 · 41 · 41 · 44 belgi — to'g'ri variant eng uzun emas; to'rttalasi bir shaklda («Qism — agent …»).
- To'g'ri izohi: Agent hodisaga tegmaslik kerakligini bilmadi — bu talabda aytilmagan edi.
- Xato izohlari (≤60):
  - A: Joy aytilgan — kataklar o'z joyiga keldi. (41)
  - B: Ish bajarilgan — kataklar Backend'dan keldi. (44)
  - D: Kutubxona repo'da tanlangan. Hodisa nega yo'qoldi? (50)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda «Nima buzilmasin» yo'qligi animatsiyada ko'rindi; savol boshqa belgini — hodisani — so'raydi (§106: slayddan ko'chirib bo'lmaydi).

## 4 · Talabning har qatori — bitta tekshiruv  ← QTushuncha
- Eyebrow: Tushuncha · tekshirish
- Sarlavha: **Agent «Tayyor» dedi. Ishlaganini qanday bilasiz?** (48)
- Mentor: Talabning har qatorini bosing — sayt uni bajaryaptimi, o'zingiz ko'rasiz.
- Bashorat (ballsiz): **Agent «Tayyor» degan talabning nechta qatori ishlaydi?** · Bittasi · Ikkitasi · Uchalasi — tanlov saqlanadi.
- Chapda talab kartasi — 2-ekrandagi uch qator (bitta manba, P-063), qadam-ro'yxati ko'rinishida (163.8, o'tgani ✓):
  1. Qayerda: saytdagi vaqt kataklari
  2. Nima qilsin: kun almashtirilsa, kataklar shu kun uchun Backend'dan kelsin
  3. Nima buzilmasin: katak animatsiyasi va `vaqt-tanladi` hodisasi
- O'ngda «Maydon» maketi — agent ishidan keyin: kun almashtirgichi bor, «‹ Bugun ›», olti katak bo'sh, holat qatori `GET /vaqtlar · Backend`, hodisa sanog'i `vaqt-tanladi · 0`.
- **Harakat → Vizual o'zgarish:** o'quvchi talab qatorini bosadi → maket o'sha qatorni o'zi bajarib ko'rsatadi:
  - 1-qator → kataklar joyi yoritiladi, ikkinchi ro'yxat yo'q → qator ✓, bir qator: «Kataklar o'z joyida, ikkinchi ro'yxat yo'q.» (43)
  - 2-qator → Shanbaga o'tiladi → kataklar **o'zgarmaydi** (hammasi bo'sh qoladi), holat qatorida `GET /vaqtlar` — kun qo'shilmagan → qator qizil.
    Ostida tuzatish talabi (mono, uch qator) va «Qayta tekshirish» tugmasi:
    «Qayerda: kun almashtirgichi. · Nima qilsin: Shanbaga o'tilsa kataklar o'zgarmayapti — tanlangan kun `?kun=` ga qo'shilsin. · Nima buzilmasin: katak animatsiyasi.»
    → «Qayta tekshirish» → «agent tuzatyapti…» → Shanba: 17:00 va 20:00 band, holat qatori `GET /vaqtlar?kun=2026-10-10` → qator ✓.
  - 3-qator → bo'sh katak bosiladi → kichrayib qaytadi, hodisa sanog'i `vaqt-tanladi · 1` → qator ✓, bir qator: «Animatsiya va hodisa joyida.» (28)
  Qatorlar istalgan tartibda tekshiriladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: bu safar uchtadan ikkitasi ishladi, bittasini tuzatdingiz» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Agent «Tayyor» desa ham, talabning har qatorini tekshirasiz. Mos kelmagan joyni aniq yozib, tuzattirasiz. (105)
- Tugadi (199): qadam-ro'yxati yopiladi; uch qatori ✓ talab va maket fokusga; vizual ⛶ ichida.
- Tugma (pastki): Har qatorni tekshiring (N/3) → Davom etish

## A2 · Amaliyot 2 — sayt kataklarni Backend'dan oladi, kun almashadi  ← amaliyot bloki (≈23 daq)
- Eyebrow: Amaliyot 2 · Sayt → Backend
- Sarlavha: **Sayt kataklarni Backend'dan olsin, kun almashsin.** (49)
- Mentor: Endi «Nima buzilmasin» qatorini o'zingiz yozasiz — u agentga nimani saqlashni aytadi, tekshiruv esa baribir sizda. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti (`npm run start:dev` va `web` da `npm run dev`). Brauzerda `localhost:5173` ni oching: kataklar hali faylda, kun almashtirgichi yo'q.
  2. **Prompt** — `{nima buzilmasin}` joyini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytdagi vaqt kataklari (`web/`).
     > Nima qilsin: kun almashtirilsa, kataklar shu kun uchun Backend'dan kelsin — `http://localhost:3000/vaqtlar?kun=`.
     > Kataklar ustida kun almashtirgichi bo'lsin: «‹» va «›» strelkalari, o'rtada kun nomi («Bugun», «Shanba»). Sahifa ochilganda — bugungi kun.
     > «band» katak bosilmasin.
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna qator): «Nima buzilmasin: katak bosilganda kichrayib qaytishi, band bo'lganda rangi silliq o'zgarishi,
     «Band qilindi» belgisi va `vaqt-tanladi` hodisasi. Boshqa joyga tegma.»
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — talabning har qatorini tekshiring: kataklar o'z joyida, ikkinchi ro'yxat yo'q · birinchi amaliyotda yozgan shanbangizni bosing —
     17:00 va 20:00 band, boshqa kun — hammasi bo'sh · bo'sh katakni bosing — animatsiya darsidagidek jonlanadi. Mos kelmagan qatorni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: g'oyangizning birinchi ekrani ro'yxatni qanday ko'rsatadi va unda nima buzilmasin? Uch qatorni to'ldiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`, dars maketining kattasi):
  - Maydon
  - ‹ **Shanba** ›
  - 16:00 bo'sh · 17:00 band · 18:00 bo'sh
  - 19:00 bo'sh · 20:00 band · 21:00 bo'sh
- Hammasi bajarilgach (yashil): Kataklar Backend'dan keladi, kun almashadi — animatsiya va hodisa joyida. (73)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-07-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Shanba bosildi, kataklar o'zgarmadi. Agentga nima yozasiz?** (8 so'z)
  - ✔ Bosilgan kunni so'rovga qo'sh, kataklarni yangila
  - Ishlamayapti — butun saytni boshidan qayta yoz
  - Kun almashtirgichini olib tashla, faqat bugun qolsin
  - Kataklarni Backend'siz, yana avvalgidek fayldan ol
- Kalit: **A** (index 0). Variantlar: 49 · 46 · 47 · 50 belgi — to'rttalasi agentga sen-buyruq (T-002), bir shaklda; to'g'ri variant eng uzun emas.
- To'g'ri izohi: Joy va kerakli natija aniq — agent faqat shu joyni tuzatadi.
- Xato izohlari (≤60):
  - B: Agent qayerni tuzatishni bilmaydi — ishlagani ham buziladi. (59)
  - C: Kun almashishi talabda bor — uni olib tashlab bo'lmaydi. (56)
  - D: Faylga qaytsa, kataklar yana faqat bitta kunniki bo'ladi. (57)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## A3 · Amaliyot 3 — Backend javob bermasa, sayt aytadi; butun ekranni tekshirish  ← amaliyot bloki (≈15 daq)
- Eyebrow: Amaliyot 3 · xato holati, tekshirish
- Sarlavha: **Backend javob bermasa, sayt buni aytsin.** (40)
- Mentor: Endi uch qatorni ham o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti, sayt kataklarni Backend'dan ko'rsatyapti.
  2. **Prompt** — vazifa: kataklar kelguncha «Yuklanmoqda…» chiqsin; Backend javob bermasa — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»
     Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab):
     > Qayerda: saytdagi vaqt kataklari joyi.
     > Nima qilsin: kataklar kelguncha «Yuklanmoqda…» deb yozsin. Backend javob bermasa — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»
     > Nima buzilmasin: kun almashtirgichi, katak animatsiyasi va `vaqt-tanladi` hodisasi. Boshqa joyga tegma.
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Butun ekranni tekshirish** — (1) Xato holatini ko'rish uchun Backend'ni ataylab to'xtating: terminalida Ctrl+C, sahifani yangilang — sayt «Vaqtlarni yuklab bo'lmadi» deydi; Backend'ni qayta yoqing
     (`npm run start:dev`). (2) Kunni almashtiring va bo'sh katakni bosing — animatsiya joyida. (3) Umami panelida `vaqt-tanladi` hodisasi soni oshgan.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: ma'lumot kelmasa, g'oyangizning birinchi ekrani nima deydi? Uch qatorni to'ldiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`):
  - Maydon
  - ‹ **Shanba** ›
  - (kataklar o'rnida) Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.
- Hammasi bajarilgach (yashil): Birinchi ekran ishlaydi: kataklar Backend'dan keladi, Backend javob bermasa sayt buni aytadi. (93)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-07-done`
- Nishon (bonus): First Screen — oxirgi «Bajardim»da (5-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 3 — «1 — Talab qismlari» · 5 — «2 — Tuzatish talabi».

## 7 · Yakun — kartochkalar va keyingi dars  ← QYakun (ichida QKartochka, 172)
- Eyebrow: Yakun · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Birinchi ekran tayyor: talab bo'yicha tekshirildi.** (49)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (3):
  - Agentga vazifani uch qism bilan yozasiz: qayerda, nima qilsin, nima buzilmasin
  - Agent «Tayyor» desa ham, talabning har qatorini tekshirasiz
  - Mos kelmagan joyni aniq yozib, tuzatishni so'raysiz
- Kartochkalar (shu ekranda, `QKartochka`; jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Uyga vazifa — yo'q (172.4: ish repo'da, keyingi dars shu repo ustida).
- Keyingi dars — «Yaxshi interfeysdan nimani olasiz?»: bitta yaxshi namuna tanlab, animatsiyalarni agent orqali qo'shasiz.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Three Parts** — Talabning qaysi qismi yetmaganini topdingiz (3-ekran, 1-savol)
- **Clear Fix** — Ko'rganingizni aniq talabga aylantirdingiz (5-ekran, 2-savol)
- **First Screen** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Talabning uch qismi (bu darsdagi qolip)»
   - `Qayerda: saytdagi vaqt kataklari` · Joy aytildi — Ikkinchi ro'yxat paydo bo'lmaydi.
   - `Nima qilsin: kun bosilsa, kataklar kelsin` · Ish aytildi — Kataklar tanlangan kunniki bo'ladi.
   - `Nima buzilmasin: vaqt-tanladi hodisasi` · Tegmaslik aytildi — Hodisa va animatsiya joyida qoladi.
   - Sinfga savol: «Nima buzilmasin» bo'lmasa, agent nimaga tegishi mumkin?
2. 2-savol (5-ekran) — «Ko'rganingiz — aniq talab»
   - `Ishlamayapti, tuzat` · Noaniq — Agent qayerni tuzatishni bilmaydi.
   - `Shanbaga o'tilsa kataklar o'zgarmayapti` · Nima ko'rdingiz — Joy va belgi aniq.
   - `Bosilgan kun ?kun= ga qo'shilsin` · Nima bo'lsin — Agent faqat shu joyni tuzatadi.
   - Sinfga savol: «Ishlamayapti» o'rniga agentga nima yozasiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Talab nima? | Promptdagi vazifa | Bu darsda uch qism bilan: qayerda, nima qilsin, nima buzilmasin |
| Talab bilan prompt bir narsami? | Yo'q | Prompt — agentga xabar, talab — uning ichidagi vazifa |
| Talabda «qayerda» bo'lmasa, agent nima qiladi? | Joyni boshqacha talqin qilishi mumkin | Masalan: kataklar ostida ikkinchi ro'yxat |
| «Nima buzilmasin» nimani aytadi? | Agent nimaga tegmasligini — tekshiruv baribir sizda | Masalan: katak animatsiyasi va `vaqt-tanladi` hodisasi |
| «Chiroyli qil» — nega talab emas? | Uni tekshirib bo'lmaydi | Agent nimani o'zgartirishni o'zi taxmin qiladi |
| Bu loyiha talabida React yoki NestJS ni qayta yozish kerakmi? | Yo'q | Stack repo'da tanlangan |
| Agent «Tayyor» desa, nima qilasiz? | Talabning har qatorini tekshirasiz | Har qator — bitta tekshiruv |
| Tekshiruvda qator mos kelmasa-chi? | Ko'rganingizni aniq yozib, tuzatishni so'raysiz | «Ishlamayapti» emas — nima bo'ldi, nima bo'lsin |
| Terminalda xato chiqsa, agentga nima yozasiz? | «Shu xato chiqdi: {xato}. Tuzat.» | Xatoning aniq matni bilan |
| `GET /vaqtlar?kun=2026-10-10` nima qaytaradi? | Shu kunning vaqt kataklari | Har biri: soat va holat — bo'sh yoki band |
| Katak band ekanini Backend qayerdan biladi? | `bandlar` jadvalidan | Shu kun va soatda yozuv bo'lsa — band |
| Backend javob bermasa, sayt nima qiladi? | Buni aytadi | «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3
1. Talab nima? ✔ Promptdagi vazifa: qayerda, nima qilsin, nima buzilmasin · Agent javobi: qaysi fayllar o'zgargani va «Tayyor» so'zi · Sayt ko'rinishi: tugmalar, kataklar va ularning ranglari · Backend ro'yxati: hamma yo'llar va undagi hamma jadvallar
2. Agent kataklar ostiga ikkinchi ro'yxat qo'shdi. Talabda nima yo'q edi? Nima qilsin — qaysi ishni bajarish · ✔ Qayerda — saytda qaysi joyda ishlash · Nima buzilmasin — nimaga tegmaslik · Texnologiya — qaysi kutubxonani olish
3. Qaysi biri yaxshi talab? Saytni chiroyli va zamonaviy qilib ber, iltimos · Hammasini o'zing bilganingcha tartibga keltir · ✔ Kataklar Backend'dan kelsin, animatsiya qolsin · Kataklar bilan bir narsa qil, yaxshi chiqsin
4. Agent «Tayyor» dedi. Keyin nima qilasiz? Keyingi talabni shu zahoti agentga yuborasiz · Agentdan «rostdanmi?» deb yana so'raysiz · Kodni o'chirib, agentga qayta yozdirasiz · ✔ Talabning har qatorini saytda tekshirasiz
5. «Nima buzilmasin» qatoriga nima yoziladi? ✔ Ishlab turgan narsa: animatsiya va hodisa · Hali qurilmagan funksiyalarning ro'yxati · Qaysi kutubxona bilan yozish kerakligi · Agent ishni necha daqiqada tugatishi kerak
6. `GET /vaqtlar?kun=2026-10-10` nima qaytaradi? Shu kuni band qilganlarning ismlari · ✔ Shu kunning kataklari va holati · Haftadagi hamma kunlarning nomlari · Saytning bosh sahifasi uchun kod
7. Katak «band» ekanini Backend qayerdan biladi? Saytdagi kun almashtirgichining rangidan · Umami'dagi `vaqt-tanladi` sonidan · ✔ `bandlar` jadvalidagi yozuvdan · Brauzerning o'z xotirasidan
8. Tekshiruvda bitta qator mos kelmadi. Agentga nima yozasiz? «Ishlamayapti, tuzat» degan bitta gap · Butun saytni boshidan qayta yozish iltimosi · Boshqa agentga o'tib ko'rish taklifi · ✔ Nima ko'rganingiz va nima bo'lishi kerak
9. Terminalda xato chiqdi. Agentga nima yuborasiz? ✔ Xatoning aniq matni va «Tuzat» so'zi · «Ishlamayapti» degan bitta so'zni · Butun loyihani qayta yozish iltimosini · Faqat «Yordam ber» degan qisqa gapni
10. Bu loyiha talabida React yoki NestJS ni qayta yozish kerakmi? Ha — har talabda kutubxona nomi turadi · ✔ Yo'q — stack repo'da tanlangan · Ha — agent usiz kod yoza olmaydi · Yo'q — agent o'zi boshqasini topadi
11. Backend javob bermayapti. Sayt nima qilishi kerak? Bo'sh oq sahifani ko'rsatib turishi · Eski kataklarni ko'rsataverib turishi · ✔ Vaqtlarni yuklab bo'lmaganini aytishi · Backend'ni o'zi qaytadan yoqib qo'yishi
12. Ju 9 bosildi. Sayt qaysi manzilga so'rov yuboradi? `/vaqtlar` — kun qo'shilmagan · `/bandlar?kun=2026-10-09` · `/kirish?kun=2026-10-09` · ✔ `/vaqtlar?kun=2026-10-09`

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik: to'g'ri variant hech bir savolda eng uzun emas (S-006); 10-savolda «Ha» 2 · «Yo'q» 2; kod-belgi (backtik) faqat to'g'rida emas (7, 12).
Fon so'zlari: talab · qayerda · nima qilsin · nima buzilmasin · `GET /vaqtlar` · `?kun=` · `bandlar` · Antigravity · CORS · `vaqt-tanladi` · Umami · Motion · `localhost:5173` · 17:00

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 11: hook · plan · concept · practice · test · concept · practice · test · practice · stats · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **0 (A)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`MAYDON_KATAKLAR` + `MaydonMaket`** — bitta manba (180): kun almashtirgichi, 6 katak, holat qatori, hodisa sanog'i, holatlar (statik · Backend · buzilgan joy · tuzaldi · xato);
   0, 1, 2, 4-ekran va A2/A3 o'ng tomoni shundan o'qiydi. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4).
   Hook statik kataklari — 4-dars namunasidan (qaysi soat band — 4-dars MD si bilan bir xil).
3. **`TALAB_QATORLAR`** — bitta `const` (P-063): 2-ekran bo'laklari, 4-ekran talab kartasi va 1-savol oynasi shundan; A2 prompti shu matndan boshlanadi.
4. 0-ekran `QKirish` (maket = agent chati + `MaydonMaket` statik; «Yuborish»dan keyin variantlar ochiladi).
   2-ekran `QTushuncha` (`QBashorat`/`QTaxmin`, `QChip` bo'lak → qator, holat qo'shilgan qismlar to'plamidan — 2³ holat, tuzoq bo'lakda `silk`), `zoom`, `tugadi`.
   4-ekran `QTushuncha` (`QQadamlar` — uch talab qatori, 2-qatorda tuzatish talabi + «Qayta tekshirish»), `QBashorat`/`QTaxmin`, `zoom`, `tugadi`.
5. 3 va 5-ekran `QTest` — matn yuqoridagidek; xato izohlari ≤60.
6. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (skeletdan). Har blok **5 qadam** (173.2 dagi 4 qadam + qaror 8 «O'z g'oyangiz»):
   - 5-qadam — uch qatorli forma (Qayerda · Nima qilsin · Nima buzilmasin), `ccProgress` da saqlanadi, «Nusxalash» bor; «Bajardim» uchala qator bo'sh emasligida ochiladi.
     Qolipda forma qadami yo'q — `QBlok` ga `forma` turi qo'shiladi yoki ulagichda yoziladi (asosiy seans qarori — TAYANCHGA SAVOL 10).
   - `QPrompt` ichida «Yordam» (A2 — namuna qator, A3 — namuna talab), bosilsa ochiladi. Qolipda yo'q bo'lsa — qo'shiladi.
   - 4-qadam nomi: «Brauzerda tekshirish» (A1, A2) · «Butun ekranni tekshirish» (A3). O'ng: A1 — brauzer maketi (JSON), A2/A3 — `MaydonMaket` katta.
   - `ortda`: A1 = `dars-06-done`, A2/A3 = `dars-07-done` (`dars-07-start` teg yo'q — tayanch jadvalida faqat `-done`).
7. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Three Parts, 5-ekran → Clear Fix, A3 oxirgi «Bajardim» → First Screen.
8. 7-ekran `QYakun`: `uyga` yo'q, `recap` 3 qator, ichida `QKartochka` (12 karta), `keyingi` matni yuqoridagidek.
9. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
10. `LESSON_META.lessonId` — `m7-07-v1`. App.jsx `m7-07` qatoriga `comp` — «qur» bosqichida (asosiy seans).
11. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/1366 · surat (1280 + 393).

## REPO — `maydon` ga qo'shiladigan narsalar (`dars-06-done` → `dars-07-done`)
1. **`dars-07-done`** = `dars-06-done` + A1–A3 namunasi («Maydon»):
   - `backend/`: `GET /vaqtlar?kun=YYYY-MM-DD` → `[{ soat: '16:00', holat: "bo'sh" | 'band' }, …]` (16:00–21:00, 6 ta); holat — `bandlar` da shu `kun` + `soat` bo'lsa «band»;
     CORS faqat `http://localhost:5173`; namuna yozuvlar: eng yaqin shanba 17:00 va 20:00 (namuna sanasi README da).
   - `web/`: kataklar ustida kun almashtirgichi «‹ Bugun ›» (strelkalar, ochilganda bugun); kataklar `GET /vaqtlar?kun=` dan, kun bosilganda qayta so'raladi; «band» katak bosilmaydi;
     kelguncha «Yuklanmoqda…», Backend javob bermasa «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»;
     animatsiya darsidagi uch harakat (`transition`, `transform`, Motion) va `vaqt-tanladi` hodisasi o'zgarmagan.
   - README: «Darslar va teglar» jadvaliga 7-dars qatori; «Xatolar» jadvaliga: `Failed to fetch` — Backend ishlamayapti / CORS yoqilmagan · kun bosilsa kataklar o'zgarmaydi — `?kun=` yuborilmayapti.
2. **Shart:** `dars-07-done` teg kurs boshlanishidan oldin upstream'da bo'lishi kerak (6-Modul REPO 3-band bilan bir xil sabab).
3. **Bog'liqlik:** `GET /vaqtlar` va kun almashtirgichi 9-darsda (`POST /bandlar`, band qilish) va 10-darsda (sinov: «kunni almashtirishni sezmadi») tayyor deb olinadi — nomlar bir xil bo'lishi kerak.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **prompt ↔ talab** (modul bo'yi, 6, 8, 9, 11-darslar ham): «prompt — agentga xabar, talab — uning ichidagi vazifa (uch qism)» deb tenglashtirdim. Nega: qaror 8 da «shu promptni…»,
   tayanchda «talab» — ikkala so'z bir darsda yashaydi; sinonim bo'lmasligi uchun farq bir gapda aytiladi. Boshqa darslar ham shu ta'rifda bo'lishi kerak.
2. **«tekshirish», «sinov» emas** (modul bo'yi): o'z natijangizni ko'rib chiqish — «tekshirish». Nega: tayanchda «sinov» = real odam bilan (10-dars); bir ildiz ikki ma'noda yashamasin (T-015).
3. **Kataklar soatlari 16:00–21:00 (6 ta)** — tayanchda yo'q. 4–5-darsdagi statik kataklar shu soatlarda bo'lishi kerak.
4. **`holat` qiymatlari** «bo'sh» / «band», **`kun`** — sana `YYYY-MM-DD`, **`soat`** — `'18:00'` satri. Tayanchda faqat «soat + holat». 4-dars (jadval) va 9-dars (`POST /bandlar`) bilan bir xil bo'lsin.
5. **Kun almashtirgichi** — strelkali «‹ Bugun ›» (GATE M K3). 10-darsdagi «kunni almashtirishni sezmadi» muammosi shu kichik strelkalar haqida.
6. **Xato holati** («Yuklanmoqda…», «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.») — `dars-07-done` ga qo'shdim; tayanch jadvalida yo'q. Nega: A3 uchun uchinchi ish kerak
   va «birinchi ishlaydigan ekran» Backend o'chganda oq qolmasin. Rad etilsa A3 — «butun ekranni tekshirish + bitta tuzatish talabi» bo'ladi.
7. **Namuna bandlar** (2 yozuv, eng yaqin shanba 17:00 va 20:00) — 9-darsgacha `POST /bandlar` yo'q, «band» katakni ko'rsatish uchun kerak. 18:00 ataylab bo'sh (10-dars sinov vazifasi).
8. **`dars-07-start` teg yo'q** — A1 «Ortda qoldingizmi» `dars-06-done` ga qaytaradi.
9. **Repo manzili va fork/clone** — tayanchda yo'q; `git fetch --tags` URLsiz yozdim. O'quvchi fork qilsa — `git fetch <upstream> --tags` kerak (6-Modul M-q8 kabi).
10. **«O'z g'oyangiz» qadami** (qaror 8, modul bo'yi 6–9, 11): blokning 5-qadami, dars ichidagi uch qatorli forma (saqlanadi, «Nusxalash» bilan). 173.2 «4 qadam» dan farqli —
    qolipga forma turi kerak. Muqobil: faqat «Nusxalash» + o'z loyiha papkasidagi fayl (fayl nomi tayanchda yo'q, shuning uchun tanlamadim).
    172.4 «uyga vazifa yo'q» saqlandi; qaror 8 dagi «o'z MVP si uyda davom etadi» yakunda alohida qator bo'lib chiqmaydi — kerakmi?
11. **Fayl nomlari** (`web/` ichidagi katak komponenti) tayanchda yo'q — promptda papka va tasvir («saytdagi vaqt kataklari (`web/`)») yozdim.
12. **«Band qilindi» belgisi 7-darsda** — `POST /bandlar` hali yo'q; animatsiya darsidagi xatti-harakati o'zgarmaydi deb oldim (buzilmasin ro'yxatida bor).

## Bahsli joylar (ishonchim to'liq emas)
- 2-ekran 2³ holat modeli (har qism faqat o'z joyini tuzatadi) — haqiqiy agentda qismlar bog'liq bo'lishi mumkin; matnda «Bu misolda» deb chegaralandi (T-043).
- 3-ekran va arena 2-savol bir shaklda (to'rt qism) — holat boshqa (hodisa / ikkinchi ro'yxat), §144 bo'yicha qabul qildim.
- Hook «Qiziq fikr!» javobi 115 belgi — ≤120 ichida, lekin namunadagidan uzun.
- A2 Mentor gapi uzun (117 belgi, bitta gap) — «katakdagi animatsiya va hodisani nomlang» ishora; qisqartirilsa o'quvchi nima yozishni bilmay qolishi mumkin.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): m7-06 «Birinchi odam kirganda nimani ko'rasiz?» → **m7-07 «Loyiha kuni: MVP — birinchi ekran»** →
  m7-08 «Yaxshi interfeysdan nimani olasiz?» (App.jsx 313–315-qatorlar, grep bilan).
- [x] Bitta misol-ip («Maydon», repo `maydon`) · metafora yo'q · bitta vizual dars bo'yi — `MaydonMaket` (0, 1, 2, 4; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (qism qo'shish → buzilgan joy tuzaladi), 4 (qatorni bosish → sayt o'zi bajaradi); 0-ekran ham harakatli.
- [x] Sarlavhalar ≤55 bitta qator (39–52) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 (73–109) ·
  hook javobi ≤120 (95/115) · xato izohlari ≤60 (41–59). Sanoq python bilan (belgi soni).
- [x] Atamalar tayanch bilan bir xil: sayt · Backend · Database · vaqt katagi · band · hodisa · talab · agent; «baza», «server», «bron», «spec», «TZ» yo'q ·
  siz-forma; Antigravity promptlari va 5-savol variantlari sen-formada (T-002) · tugmalar ot-shaklda yoki siz-formada («Qism qo'shing», «Qayta tekshirish»).
- [x] Testlar: variantlar 41–46 va 46–50 belgi, to'g'ri variant eng uzun emas; strelka/qavs faqat to'g'rida emas; shakl bir xil · ✔ o'rni: 3-ekran C, 5-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — yo'q; «shu zahoti» faqat arena distraktorida, harakat ma'nosida).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «T6», «Modul 9» yo'q — blok o'quvchiga «birinchi amaliyot»); «5-dars», «6-dars» o'rniga «animatsiya darsi», «analitika darsi» ·
  tarixiy voqea, real kompaniya raqami yo'q · «KOD» (11) va «REPO» (3) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/011/014/015/029/039/043/047/052/064 · P-001/008/013/015/036/046/052/059/062/063/064/067 · S-001/004/006/008/010/026/040 — ko'rildi.
- [ ] P-028 (tashqi manzil tirikligi): Umami panelidagi bo'lim nomi va repo manzili tayanchda yo'q — «Umami panelida» deb umumiy yozildi, repo URL — TAYANCHGA SAVOL 9.
- [ ] 173.2 «blok = 4 qadam» — qaror 8 bilan 5 qadam bo'ldi; qolipda forma qadami yo'q (TAYANCHGA SAVOL 10, KOD 6) — tasdiq kerak.

---

# 9-Modul · 8-dars (PM + amaliyot) «Yaxshi interfeysdan nimani olasiz?» — MD v3

Fayl: `src/7-Modull/PmDesignMotionLesson.jsx` (yangi) · kalit `m7-08` · **14 ekran** (PM qismi 7 · amaliyot bloki 2 · tushuncha va test 2 · podium, kartochkalar, yakun 3) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yo'q edi — hamma ekran noldan. Namuna: PM qismi — `F-0929-QA-6modul/14-PmLesson25-v3.md`, amaliyot bloki — `F-0929-QA-6modul/08-PipelineProject-v3.md`.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi.
Testlarda to'g'ri javob o'rni (yangi dars, shu MD bilan belgilanadi): 3-ekran = **B** (`correctIdx 1`) · 5-ekran = **C** (`2`) · 9-ekran = **A** (`0`); arena A·B·C·D har biri 3 marta.
Vaqt: ≈ 85 daqiqa — PM qismi (0–6) ≈ 25 · Amaliyot 1 ≈ 18 · tushuncha va test ≈ 7 · Amaliyot 2 ≈ 20 · podium, kartochkalar, yakun ≈ 10.
Menyu nomi (DE-205): App.jsx `m7-08` «Yaxshi interfeysdan nimani olasiz?» · osti «bitta usul va animatsiyalar» · oldingi `m7-07` «Loyiha kuni: MVP — birinchi ekran» · keyingi `m7-09` «Loyiha kuni: MVP tayyor».

---

Tashqi audit (ChatGPT) Filtri: `08-FILTR.md` — 05.10.2026 (atama «namuna» — 08-q0 javobidan keyin).

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Bitta natija (dastur v9, 8-dars):** dars oxirida `maydon` repo'sida Maydon jonli ko'rinadi — vaqt kataklari uch ustunli to'rda, sahifa ochilganda kataklar
   birin-ketin kiradi, kun almashganda kun sahifasi silliq almashadi. Kodni agent (Antigravity) yozadi, o'quvchi talab beradi. Teg `dars-08-done`.
2. **Bugungi asosiy fikr (P-013):** Yaxshi interfeysdan bezak emas, usul olinadi; usulni ham, animatsiyani ham agentga aniq talab bilan berasiz.
3. **Ikki atama — misoldan KEYIN, bir marta (PM-030):** 2-ekranda o'quvchi dizayner ekranidagi to'rt bo'lakni Maydon'ga qo'yib ko'radi, shundan keyin bo'laklar nom oladi:
   - **usul** (interfeys usuli; GATE M 08-q0) — boshqa interfeysda ishlatilgan va foydalanuvchining vazifasini osonlashtiradigan ko'rinish yoki harakat (masalan: vaqtlar to'ri, pastga tortib yangilash); bugun undan foydalanuvchining eng muhim savoliga javob beradiganini izlaymiz (ta'rif dars bo'yi so'zma-so'z shu, T-042; audit 1).
     **bezak** — bu misolda vazifani o'zgartirmay, faqat ko'rinishni o'zgartiradigan detal (rang holatni bildirsa — u bezak emas, axborot; audit 2). Birinchi chiqqanda bir marta: «Arxitektura patternlari»
     darsidagi pattern bilan tenglashtiriladi (T-052; 6-Modul YAKUNIY `03-ArchPatterns.md`: «Tez-tez uchraydigan muammoni hal qilishning sinab ko'rilgan usuli. U tayyor kod emas»).
   - **bezak** — ko'rinish: rang, rasm, shrift. O'zgartirsangiz ham foydalanuvchining savoli o'z joyida qoladi.
   Keyin faqat shu ikki nom. «Usul» — faqat ta'rif ichida; «pattern» — faqat 2-ekrandagi ko'prik gapida va 1-kartochka izohida.
4. **Bir so'z — bir ma'no (T-015, GATE M 08-q0):** pattern — **usul** (interfeys usuli). «Namuna» — butun modulda misol ma'nosida (namuna ma'lumot, blok yorlig'i);
   shuning uchun bloklarda standart yorliq **«kutilgan natija · namuna: Maydon»**.
5. **Atamalar (tayanch 2-bo'lim, aynan):** vaqt katagi · band qilish / band · o'yinchi · maydon egasi · intervyu · hodisa (`vaqt-tanladi`) · talab · agent (Antigravity) ·
   sayt · Backend · **animatsiya** — interfeysdagi ko'rinadigan harakat yoki holatning silliq o'zgarishi · **mikro-harakat** — foydalanuvchi harakatiga yoki holat o'zgarishiga berilgan kichik vizual javob (tayanch, GATE M 05-q0) · **Motion** (5-darsda «oldingi nomi Framer Motion» deb aytilgan, bu darsda faqat «Motion»).
   Yangi so'zlar: **dizayner ekrani** (2 va 0-ekrandagi chizilgan ekran — bitta nom, «chiroyli ekran»/«dizayner ishi» yo'q) · **vaqtlar to'ri** (kataklar uch ustunda) ·
   **kunlar tasmasi** (yetti kun yonma-yon) · **ro'yxat animatsiyasi** (kataklar birin-ketin kirishi) · **sahifa o'tishi** (Maydon'da — bir kundan boshqasiga o'tish).
   «Ro'yxat» — kataklar ro'yxati (to'plami) ma'nosida; kataklarning eski shakli «bitta ustunda» deb aytiladi (T-015).
6. **Talab = 7-dars shakli:** qayerda · nima qilsin · nima buzilmasin (173.4). Blokning 2-qadam nomi platforma standartida «Prompt» qoladi, ichidagi matn — talab (TAYANCHGA SAVOL 6).
   Agent promptlari — T-002 istisnosi (o'quvchi agentga buyruq beradi): «joyla», «tegma», «ayt». Xato yo'li har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
7. **Metafora yo'q.** Brendlar (S-018) — birinchi ko'rinishda bir qatorlik izoh: Dribbble (0), Behance (6), Tweetie, Twitter, Loren Brichter (4), Chrome (4, «brauzerida»).
8. **Toza yuza (185, D4):** tugma, variant, karta, yorliq, recap'da emoji yo'q; maketlar chizilgan (CSS/SVG), logotip va muallif nomi yo'q. O'yin qatlami (arena, nishon, podium) — mustasno.

**Fakt-manbalar (o'quvchi matnida havola yo'q, faqat shu yerda):**
- Dribbble — «the world's leading platform for discovering top designers, their work» (dribbble.com/about, 05.10 ochildi); «shot» — dizayn ishidan kichik surat, toifalar orasida Animation, Mobile, Web Design (help.dribbble.com «Dribbble shot guidelines»).
- Behance — Adobe'ga tegishli, «Founded in 2006», «the world's largest creative network» (behance.net/about, 05.10 ochildi); loyiha — bir nechta rasm, matn va video bilan (Behance «Create a Project»).
- Tweetie / pull-to-refresh — en.wikipedia.org/wiki/Pull-to-refresh va /wiki/Tweetie (Loren Brichter; Tweetie 2 — birinchi pull-to-refresh ilova; 2010-yil 9-aprel Twitter Tweetie'ni sotib oldi;
  Chrome uni 41-versiyada qo'shgan) · jeremystanley.substack.com «Twitter for iPhone: A history» (Tweetie 2 — 2009-yil 9-oktabr; «No longer do you have to scroll up, click the refresh button
  and wait»; «hold it until you get feedback that it is reloading») · Brichter so'zi: «They all had to find a spot and just cram a refresh button somewhere» (Wikipedia).
- Animatsiya davomiyligi — Nielsen Norman Group «Executing UX Animations: Duration and Motion Characteristics» (nngroup.com/articles/animation-duration): «most animations should be in the range of 100–500 ms»;
  «At 500ms, animations start to feel like a real drag». Darsdagi 0,4 s (ro'yxat) va 0,3 s (sahifa o'tishi) shu oraliqdan.

## Darsning ipi va bitta vizual

- **Ip:** Maydon (tayanch 1-bo'lim). O'tgan darsda Maydon'ning birinchi ekrani qurildi — kataklar Backend'dan keladi, kun almashadi (`dars-07-done`).
  Bugun: dizayner ekranidan bitta usul → Maydon'ga (A1) → animatsiya talabi → ro'yxat va sahifa o'tishi (A2). O'quvchining o'z g'oyasi — 6-ekrandagi usul kartasi va har blokning 5-qadami.
- **Hook:** dizayner ekrani va Maydon yonma-yon → «Dizayner ekranidan Maydon'ga nimani olasiz?» → o'yinchining savoli «Bugun qaysi vaqt bo'sh?» — Maydon'da kechki kataklar ekrandan pastda.
- **O'yinchining savoli** (intervyudan, tayanch: 5 kishidan 4 tasi — «oxirgi marta kelganimizda maydon band edi»; «kechqurun» olindi — intervyuda yo'q, audit 4): **«Bugun qaysi vaqt bo'sh?»** — dars bo'yi bitta pufak.
- **Maydon ma'lumoti (`KATAKLAR`, bitta manba — 180):** 6 vaqt katagi, 16:00 … 21:00 (GATE M K1). Shanba: band — 17:00, 20:00; qolgani bo'sh (18:00 bo'sh — 10-darsdagi sinov vazifasi bilan mos).
  Yakshanba: band — 18:00, 19:00. Katakda: soat (`18:00`) va holat (`bo'sh` / `band`). (TAYANCHGA SAVOL 1–2.)
- **Bitta vizual — «Ikki telefon» (`IkkiTelefon`, dars bo'yi, 163/180):**
  - **o'ngda Maydon** (telefon ramkasi, 191): oq fon · «Maydon» · kun almashtirgich «‹ Shanba ›» · kataklar · tepada o'yinchi pufagi.
    Holatlar: *bitta ustun* (telefonda forma ostida 16:00–18:00 ko'rinadi, kechki 3 katak pastda, ekran cheti kesilgan) → *to'r* (uch ustun, 6 katak bir ekranda) →
    *jonli* (kataklar birin-ketin kiradi; › bosilsa yangi kun o'ngdan, ‹ — chapdan kiradi). Pufak: savol (oq) → ✓ (yashil, «18:00 bo'sh ekan»).
  - **chapda dizayner ekrani** (faqat 0 va 2-ekranda): binafshadan ko'kka o'tadigan fon · tepada katta futbol to'pi rasmi · kunlar tasmasi (Du Se Ch Pa Ju Sh Ya, «Sh» ajralgan) ·
    vaqtlar to'ri (uch ustun). Dribbble'dagi ishlarga o'xshatib o'zimiz chizgan maket — real ish emas, logotip va muallif yo'q.
  - Ishlatiladi: 0 · 1 (faqat Maydon, tayyor holat) · 2 · 7 (o'ng — kutilgan natija) · 8 · 10 (o'ng — kutilgan natija). Tweetie (4) — o'z keys-maketi `TortishMaket` (PM-029).
- **Yakun:** Maydon jonli ko'rinadi · keyingi dars — «Loyiha kuni: MVP tayyor» (band qilish, ega sahifasi, deploy).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · dizayner ekrani
- Sarlavha: **Dizayner ekranidan Maydon'ga nimani olasiz?** (44)
- Mentor: Chapdagi ekranni Dribbble'dagi ishlarga o'xshatib chizdik: Dribbble — dizaynerlar o'z ishini ko'rsatadigan sayt. O'ngda — o'tgan darsda qurilgan Maydon.
- Maket (chap): «Ikki telefon» — dizayner ekrani to'liq · Maydon *bitta ustun* holatida, pufak hali yo'q.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Ko'rinishini — fon rangi, rasm va shrift (39)
  - Ishlashini — vaqtlar qanday ko'rsatilgani (41)
- Javob — 2-variant: **Aynan!** Bu misolda rang va rasm faqat ko'rinishni o'zgartiradi. O'yinchiga esa vaqtlar qanday ko'rsatilgani yordam beradi. (114)
- Javob — 1-variant: **Qiziq fikr!** Rang yoqadi, lekin bu misolda u faqat ko'rinish. O'yinchiga vaqtlar qanday ko'rsatilgani yordam beradi. (103)
- **Harakat → Vizual o'zgarish:** variantni tanlash → dizayner ekranida tanlangan qism uzuq chiziq bilan ajraladi (1: fon, rasm, shrift · 2: kunlar tasmasi va vaqtlar to'ri);
  Maydon ustida o'yinchi pufagi chiqadi «Bugun qaysi vaqt bo'sh?», Maydon'ning pastki cheti bir lahza yonadi — kechki kataklar o'sha yerda, ko'rinmaydi.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
- O'qituvchi eslatmasi: Dribbble'ni hozir ochmang — uni o'quvchi mustaqil ishda o'z g'oyasi uchun ochadi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Dars oxirida Maydon jonli ko'rinadi.** (36)
- Mentor: Kodni agent — Antigravity — yozadi, siz unga talab berasiz. Talab o'tgan darsdagidek: qayerda, nima qilsin, nima buzilmasin.
- Chap — «Dars oxirida»: Maydon *jonli* holatda, bir marta o'zi yuradi (DE-200): kataklar uch ustunda birin-ketin kiradi → › bosiladi → Yakshanba o'ngdan kiradi.
- O'ng (01 · matn · teg; bosilmaydi, P-015):
  - 01 · Dizayner ekranidan nimani olish kerakligini ajratasiz · `tanlash`
  - 02 · Bitta usul ilovadan ilovaga qanday o'tganini ko'rasiz · `voqea`
  - 03 · O'z g'oyangiz uchun Dribbble'dan usul topasiz · `izlash`
  - 04 · Maydon'ga usul va animatsiyalarni agent orqali qo'shasiz · `amaliyot`
- Pastki qator (mono, kichik): repo `maydon` · boshlanish `dars-07-done` · tayyor `dars-08-done`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): 02–04 dagi «usul» — menyu ostidagi yozuv bilan bir xil («bitta usul va animatsiyalar», P-015); atama ta'rifi 2-ekranda.

## 2 · Bezak va usul  ← QTushuncha
- Eyebrow: Tushuncha · bezak va usul
- Sarlavha: **Qaysi bo'lak o'yinchiga yordam beradi?** (38)
- Mentor: Dizayner ekranidagi bo'laklarni birma-bir Maydon'ga qo'yib ko'ring va o'yinchining savoliga qarang.
- Bashorat (ballsiz, 181): **Bo'laklardan nechtasi o'yinchiga yordam beradi?** · 1 · 2 · 3 — tanlov saqlanadi.
- Vizual — «Ikki telefon»: chapda dizayner ekrani, bo'laklar bosiladigan karta (doimiy «›», bosilgach ✓ — U-013); o'ngda Maydon *bitta ustun*, pufak «Bugun qaysi vaqt bo'sh?».
  Bo'lak kartalari (nom + bir qator):
  - **Binafsha fon** — binafshadan ko'kka o'tadigan fon
  - **To'p rasmi** — tepada katta futbol to'pi
  - **Kunlar tasmasi** — yetti kun yonma-yon, tanlangani ajralgan
  - **Vaqtlar to'ri** — kataklar uch ustunda, butun kun bir ekranda
- **Harakat → Vizual o'zgarish:** bo'lakni bosish (yoki Maydon'ga sudrash) → bo'lak Maydon'ga qo'shiladi, karta ostida natija qatori chiqadi:
  - Binafsha fon → Maydon foni binafsha bo'ladi; kataklar o'sha joyda, pufak o'zgarmaydi · karta ostida (kulrang): Savolga javob bermadi.
  - To'p rasmi → Maydon tepasida katta to'p; kataklar pastga suriladi, endi 4 tasi ko'rinadi · karta ostida (kulrang): Kataklar yana pastga tushdi.
  - Kunlar tasmasi → Maydon tepasida yetti kun; Yakshanbani bir bosishda ochish mumkin · karta ostida (yashil): «Boshqa kun-chi?» savoliga javob · pufak o'z savolida qoladi.
  - Vaqtlar to'ri → kataklar uch ustunga yig'iladi, kechki kataklar ko'rinadi (17:00 band · 18:00 bo'sh · 19:00 band · 20:00 band · 21:00 bo'sh) ·
    karta ostida (yashil): «Bugun qaysi vaqt bo'sh?» savoliga javob · pufak o'rnida ✓ «18:00 bo'sh ekan».
- 4/4 da: kartalar ustida nom paydo bo'ladi (atama — misoldan keyin, bir marta): yashil ikkitasi — **usul**, kulrang ikkitasi — **bezak**.
  Joriy qator (bitta): Boshqa interfeysda ishlatilgan va foydalanuvchining vazifasini osonlashtiradigan ko'rinish yoki harakat interfeys usuli deyiladi — «Arxitektura patternlari»dagi pattern kabi. Bu misolda fon va katta rasm faqat ko'rinishni o'zgartirdi — bu bezak.
  Natija qatori (`QTaxmin`): «Taxminingiz: 1 · haqiqatda: 2» yoki «Taxminingiz to'g'ri chiqdi».
- 2-bosqich (shu ekranda, 4/4 dan keyin; savol kartalar USTIDA, kartalar bir balandlikda):
  - Savol-qatori: Intervyuda 5 kishidan 4 tasi: «Oxirgi marta kelganimizda maydon band edi». Maydon'ga qaysi usulni olasiz?
  - Ikki karta (ballsiz): **Vaqtlar to'ri** · **Kunlar tasmasi**
  - Tanlagach ikkala karta ostida izoh (`QIzoh`): to'r — Asosiy savol bo'sh vaqt haqida — to'r shunga javob beradi. (58) · tasma — Kun tanlash qulay, lekin asosiy savol — bo'sh vaqt. (51)
  - **Vizual:** Maydon'da faqat tanlangan usul qoladi (fon, rasm va ikkinchi usul bir lahzada o'chadi). To'r tanlansa — pufak ✓;
    tasma tanlansa — pufak «Bugun qaysi vaqt bo'sh?» qoladi, to'r kartasi yonadi.
- Xulosa: Bu mashqda dizayner ekranidan avval bitta usul olamiz — eng muhim savolga javob beradiganini. (95)
- Tugma (pastki): Bo'laklarni qo'ying (N/4) → Bittasini tanlang → Davom etish · `tugadi`: dizayner ekrani va kartalar yopiladi, Maydon (to'r bilan) butun enga (199).
- O'qituvchi eslatmasi: Kunlar tasmasi ham yaxshi usul — u «keyin» ro'yxatida qoladi. Bu mashqda nima o'zgarganini aniq ko'rish uchun avval bittasini tanlaymiz (audit 3: bitta ekranda bir nechta usul ham ishlaydi).
- Nishon: Pattern Picker (2-bosqichda birinchi tanlov — Vaqtlar to'ri).

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`)
- Eyebrow: Tekshiruv · usul
- Savol: **Kino chiptasi ilovasidan bitta narsa olasiz. Qaysi biri usul?** (10 so'z)
  - A · Band qilish tugmasi oltin rangda, yumaloq (41)
  - ✔ B · Band o'rindiq xira, uni bosib bo'lmaydi (39)
  - C · Har film ustida katta, rangli afisha rasmi (42)
  - D · Fon qora, sarlavhalar esa qalin shriftda (40)
- To'g'ri izohi: Xira o'rindiq «qaysi joy bo'sh?» savoliga javob beradi.
- Xato izohlari (≤60): A — Tugma rangi — bezak: u qaysi savolga javob beradi? (50) · C — Afisha chiroyli, lekin bo'sh joyni topishga yordam bermaydi. (60) ·
  D — Fon va shrift — bezak: joy topish o'zgarmaydi. (46) · (umumiy) Foydalanuvchining savoliga javob beradiganini toping. (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Tweetie  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Ro'yxatni pastga tortib yangilash qayerdan chiqqan?** (50)
- Mentor: Tweetie — iPhone uchun Twitter ilovasi edi, uni dasturchi Loren Brichter yasagan. Twitter — bugungi X ijtimoiy tarmog'i.
- Nuqtalar (5) · yorliq **Tweetie · N/5** (bashorat kartasida ham) · maket `TortishMaket` (telefon ramkasi, postlar — kulrang chiziqlar, logotip yo'q; strelka va aylanuvchi belgi — chizilgan misol).
- Bosqichlar (karta matni qisqa, karta cho'zilmaydi):
  - 1/5 **Yangilash tugmasi tepada** — O'sha paytdagi Twitter ilovalarida yangi postni ko'rish uchun ro'yxat tepasiga chiqib, yangilash tugmasini bosish kerak edi. ·
    maket: barmoq ro'yxatni tepaga suradi, tepada tugma bosiladi, kutish belgisi.
  - 2/5 bashorat — **Brichter yangilash tugmasi o'rniga nima qildi?** · Tugmani ekranning pastiga ko'chirdi · ✔ Ro'yxatni tortib yangilashni topdi · Ro'yxatni har daqiqada o'zi yangiladi
  - 3/5 **Pastga tortib yangilash** — 2009-yil oktabrda chiqqan Tweetie 2 da ro'yxat tepasida barmoq bilan pastga tortib qo'yib yuborsangiz, yangi postlar chiqardi.
    Tortib turganingizda ilova yangilanish boshlanishini ko'rsatardi. · maket: ro'yxat pastga suriladi, tepada strelka buriladi, qo'yib yuborilgach aylanuvchi belgi, tepaga yangi post qo'shiladi.
  - 4/5 bashorat — **Keyin ko'p ilovalarda nima paydo bo'ldi?** · Tweetie'ning ranglari va belgisi · ✔ Pastga tortib yangilash usuli · Tweetie ekranining o'zi
  - 5/5 **Usul tarqaldi** — 2010-yilda Twitter Tweetie'ni sotib oldi. Pastga tortib yangilash keyin ko'p ilovalarda paydo bo'ldi: bugun telefondagi Chrome brauzerida ham sahifani shunday yangilaysiz. ·
    maket: uch telefon, har biri o'z rangida (logotipsiz), uchalasida bir xil tortish harakati.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `TortishMaket` holati o'zgaradi: tugma (tepaga surish + bosish) → tortish (ro'yxat pastga, strelka,
  aylanuvchi belgi, yangi post) → uch telefon (ko'rinishi har xil, harakat bir xil). Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (5/5 dan keyin, hisoblagichsiz): Bitta usul turli ko'rinishdagi ilovalarda ishladi: u «Yangi post bormi?» savoliga javob berardi. (96)
- Tugma (pastki): Keyingi bosqich (N/5) → Davom etish
- O'qituvchi eslatmasi: Tortib turgandagi belgi — animatsiya: u foydalanuvchiga nima bo'layotganini aytadi. Amaliyotda Maydon'ga ham animatsiyalarni shu maqsadda qo'shamiz.
- Fakt-manba — A-bo'lim (Wikipedia «Pull-to-refresh», «Tweetie»; jeremystanley.substack.com). Sana va yillar faqat manbadagidek; maketda son yo'q.

## 5 · 2-savol  ← QTest (✔ C, `correctIdx 2`; bitta usul — eng muhim savolga)
- Eyebrow: Tekshiruv · eng muhim savol
- Savol: **Navbat ilovasida odamlar «Navbatim qachon?» deb so'raydi. Qaysi usulni olasiz?** (10 so'z)
  - A · Kunlar tasmasi — boshqa kunni bir bosishda (42)
  - B · Sartaroshlar rasmi katta, yumaloq kartalarda (44)
  - ✔ C · Oldingizda nechta odam borligi yirik turadi (43)
  - D · Ilova foni ko'k rangdan oqqa silliq o'tadi (42)
- To'g'ri izohi: Odamlar soni «Navbatim qachon?» savoliga javob beradi.
- Xato izohlari (≤60): A — Kunlar tasmasi — usul, lekin boshqa savolga javob. (52) · B — Rasm — bezak: navbat qachonligi bilinmaydi. (43) ·
  D — Fon rangi — bezak: savolga javob bermaydi. (42) · (umumiy) Odamlarning asosiy savoliga javob beradiganini toping. (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): navbat ilovasi — 6-Modul PM misoli (sartarosh), o'quvchiga tanish olam (P-002: ikkinchi misol faqat testda). A — «rost, lekin mos emas» (S-004).

## 6 · Usul kartasi  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Foydalanuvchingiz nimani tezroq topishi kerak?** (45)
- Mentor: Dribbble yoki Behance'da g'oyangizga yaqin ishni oching — Behance'da dizaynerlar loyihasini rasmlar va izoh bilan ko'rsatadi. Rangga emas, foydalanuvchingizning savoliga qarang.
- Kirish qatori (kulrang, bitta): G'oyangizdagi muammo: «{3-darsda saqlangan muammo}». — 3-dars ma'lumoti yo'q bo'lsa: «g'oyangizdagi asosiy muammo».
- Bitta ustun: usul kartasi (3 qator = qadamlar 1/2/3, joriy qator accent) → forma (bitta maydon) → Yordam · «Kartaga yozish» o'ngda (187).
- Maydon maslahati: 1 — Foydalanuvchingizning eng muhim savoli qanday? · 2 — Qaysi usul unga javob beradi? · 3 — Uni qayerga qo'yasiz?
- Ipucha (placeholder, qisqa — §32): 1 «Foydalanuvchi nimani bilmoqchi yoki qilmoqchi?» · 2 «Usul qanday ishlaydi?» · 3 «Qaysi sahifada, qaysi joyda?»
- Tekshiruv (`QXato`, ≤60; faqat 1-qator bloklaydi, qolgani yo'naltiradi):
  - 1-qator bo'sh yoki juda qisqa: Foydalanuvchining savoli yoki vazifasini aniq yozing. (53) — «?» majburiy emas (audit)
  - 2-qatorda bezak so'zi (rang, fon, shrift, rasm, chiroyli, gradient): Bu bezakka o'xshaydi — u qaysi savolga javob beradi? (51)
  - 3-qator ikki so'zdan qisqa: Usul qaysi sahifada turishini yozing. (39)
- Doimiy qator (forma ostida): Rang va rasmni emas, usulni yozasiz.
- Yordam: Qidiruvga inglizcha yozing: g'oyangiz va `app`. Masalan, `booking app` — band qilish ilovalari. Sayt ochilmasa, dizayner ekranidagi ikki usuldan birini oling.
- **Harakat → Vizual o'zgarish:** qatorni yozib «Kartaga yozish» → kartaga qator kiradi, joriy belgi keyingi qatorga o'tadi. 1-qator yozilgach karta tepasida foydalanuvchi pufagi
  chiqadi (o'quvchining o'z savoli); 2-qator tekshiruvdan o'tsa pufak o'rnida ✓, o'tmasa qator `err` fonda va ostida bitta `QXato`. 3/3 da forma yopiladi, karta butun enga (199),
  har qator yonida ✎ (tahrirlash).
- Xulosa: Usul kartangiz tayyor — amaliyot oxirida undan o'z g'oyangizga talab yozasiz. (83)
- Tugma (pastki): Uch qatorni yozing (N/3) → Davom etish
- Artefakt-strip (U-042): shu ekrandan — «Usul kartam» (bir qator, 3/3); 7, 10-ekranlarning 5-qadamida va yakundagi uyga vazifada ko'rinadi.
- O'qituvchi eslatmasi: Izlashga 5 daqiqa bering. Dribbble va Behance kirishsiz ochiladi — sinf tarmog'ida darsdan oldin tekshiring.
- Nishon: Idea Hunter (3/3).

## 7 · Amaliyot 1 — vaqtlar to'ri  ← amaliyot bloki (QBlok, ≈18 daq)
- Eyebrow: Amaliyot 1 · usul
- Sarlavha: **Maydon'ga vaqtlar to'rini qo'shing.** (35)
- Mentor: Talabni siz yozasiz, kodni Antigravity yozadi — «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`.
     Brauzerda `localhost:5173` ni oching, F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M) — telefon ko'rinishi.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Maydon sahifasida vaqt kataklarini **{ustunlar soni}** ustunli to'rga joyla: butun kun telefon ekraniga sig'sin.
     > Har katakda soat va holat (bo'sh yoki band) qolsin.
     > Kun almashtirgich, `GET /vaqtlar`, `vaqt-tanladi` hodisasi va kataklardagi animatsiyalar o'zgarmasin.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sahifa o'zi yangilandi, terminallarda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefon ko'rinishida butun kun pastga surmasdan ko'rinadi, 21:00 katagi ham. Bo'sh katakni bosing — u kichrayib qaytadi.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: qavslarga usul kartangizdan oling. «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.
     > Joy — **{qayerga qo'yasiz}**. Shu usulni qo'sh: **{usul}**. U «**{foydalanuvchi savoli}**» savoliga javob bersin.
     > **{nima buzilmasin}** o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     (Usul kartasi to'ldirilgan bo'lsa, uchta qavs kartadan o'zi qo'yiladi; «nima buzilmasin»ni o'quvchi yozadi. PM-020: har qiymat qavssiz, «Joy — …» shaklida — o'quvchi qanday yozsa ham gap buzilmaydi.)
- O'ng tomon — «kutilgan natija · namuna: Maydon» (telefon maketi): Maydon · ‹ Shanba › · to'r 3×2:
  16:00 bo'sh · 17:00 band · 18:00 bo'sh · 19:00 bo'sh · 20:00 band · 21:00 bo'sh
- Hammasi bajarilgach (yashil): Butun kun bir qarashda — o'yinchi kechki bo'sh vaqtni pastga surmasdan topadi. (79)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-08-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- Izoh (MD): «{ustunlar soni}» — Mentor misolida 3 (telefonda «18:00» va «bo'sh» sig'adi); o'quvchi 4 yozsa, 4-qadamda o'zi ko'radi.

## 8 · Animatsiya talabi  ← QTushuncha
- Eyebrow: Tushuncha · animatsiya talabi
- Sarlavha: **Animatsiya talabida nima aytiladi?** (34)
- Mentor: 5-darsda animatsiyani qo'lda yozgansiz, bugun uni agent yozadi — har qismdan bittasini tanlang.
- Chap — talab uch qismdan (`QQadamlar` uslubida: 1 Qayerda · 2 Nima qilsin · 3 Nima buzilmasin; joriy — accent, o'tgani ✓), har qismda variant-tugmalar:
  - Qayerda: «Saytda» · «Vaqt kataklari to'rida»
  - Nima qilsin: «Chiroyli harakat qo'shilsin» · «Motion bilan animatsiya qilinsin» · «Kataklar birin-ketin kirsin, hammasi 0,4 soniyada»
  - Nima buzilmasin: «Hech narsa yozilmagan» · «Katak bosilgandagi mikro-harakat qolsin»
- O'ng — Maydon (*to'r* holatida, A1 natijasi) + «Qayta ko'rish» (ikkinchi tugma); variant tanlanganda maket o'zi ham bir marta yuradi.
- **Harakat → Vizual o'zgarish:** variantni tanlash → Maydon shu talab bo'yicha harakatlanadi (agent shunday yozishi mumkin — maket misol) va pufak o'zgaradi:
  - «Saytda» → sarlavha, kun almashtirgich va kataklar — hammasi sakrab kiradi · pufak «Nega hamma narsa sakrayapti?» · `QXato`: Joy aytilmasa, agent hamma joyga qo'shishi mumkin. (50)
  - «Chiroyli harakat qo'shilsin» → kataklar aylanib, 2 soniyada kiradi · pufak «Qachon bosaman?» · `QXato`: Vaqt aytilmasa, agent uni boshqacha talqin qilishi mumkin. (58)
  - «Motion bilan animatsiya qilinsin» → kataklar 2 soniyada sakrab kiradi · pufak «Qachon bosaman?» · `QXato`: Kutubxona repo'da bor — u harakatni aytmaydi. (45)
  - «Hech narsa yozilmagan» → kataklar kiradi, lekin bosilganda kichrayish yo'q · pufak «Bosdim — sezilmadi» · `QXato`: Aytilmasa, eski animatsiya yo'qolishi mumkin. (45)
  - aniq variant → o'sha qism ✓; uchala qism aniq bo'lsa kataklar 0,4 soniyada birin-ketin kiradi, bosilganda kichrayib qaytadi, pufak o'rnida ✓.
  3/3 da joriy qator (bitta): Elementlarning birin-ketin kirishi ro'yxat animatsiyasi deyiladi. Ostida talab bitta qutida yig'iladi (mono): «Vaqt kataklari to'rida: kataklar birin-ketin kirsin, hammasi 0,4 soniyada. Katak bosilgandagi mikro-harakat qolsin.»
- Xulosa: Animatsiya talabi joyni, vaqtni va nima qolishini aytadi — noaniq joyni agent boshqacha talqin qilishi mumkin. (110)
- Tugma (pastki): Uch qismni tanlang (N/3) → Davom etish · `tugadi`: variantlar yopiladi, Maydon va yig'ilgan talab butun enga (199); vizual ⛶ ichida (q17).
- O'qituvchi eslatmasi: Qisqa interfeys animatsiyalari ko'pincha bir necha yuz millisekund davom etadi (manba A-bo'limda); Maydon'da 0,3–0,4 soniya. Kutubxona nomini talabga yozish shart emas: Motion repo'da bor.
- Nishon: Motion Writer (uchala qism aniq yig'ildi).

## 9 · 3-savol  ← QTest (✔ A, `correctIdx 0`)
- Eyebrow: Tekshiruv · animatsiya talabi
- Savol: **Agent ro'yxat animatsiyasini 2 soniya qildi. Talabda nima aytilmagan?** (9 so'z)
  - ✔ A · Harakat jami qancha vaqt davom etishi (37)
  - B · Harakat to'rning qaysi joyida bo'lishi (38)
  - C · Harakatda kataklar qaysi rangda bo'lishi (40)
  - D · Animatsiya qaysi kutubxonada yozilishi (38)
- To'g'ri izohi: 2 soniya o'yinchini kuttiradi — vaqtni talabda o'zingiz yozasiz.
- Xato izohlari (≤60): B — Joy aytilgan: kataklar to'ri. Yana nima yetishmaydi? (52) · C — Rang harakat uzunligiga ta'sir qilmaydi. (40) ·
  D — Kutubxona repo'da bor — harakatni u aytmaydi. (45) · (umumiy) Agent nimani o'zi tanlab oldi — shuni toping. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 10 · Amaliyot 2 — ro'yxat va sahifa o'tishi  ← amaliyot bloki (QBlok, ≈20 daq)
- Eyebrow: Amaliyot 2 · animatsiya
- Sarlavha: **Ro'yxat va sahifa o'tishini jonlantiring.** (41)
- Mentor: Maydon'da bir kundan boshqasiga o'tganda sahifa almashadi. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti, brauzerda Maydon telefon ko'rinishida ochiq.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash», Antigravity'ga:
     > Maydon sahifasidagi vaqt kataklari to'rida: sahifa ochilganda kataklar birin-ketin kirsin, hammasi **{soniya}** soniyada.
     > Kun almashganda eski kun chiqib ketsin, yangisi kirsin: › bosilsa o'ngdan, ‹ bosilsa chapdan — 0,3 soniyada.
     > Katak bosilgandagi kichrayish, band rangining silliq o'zgarishi va «Band qilindi» belgisi o'zgarmasin; `vaqt-tanladi` hodisasi qolsin.
     > Yangi paket o'rnatma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sahifa o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — sahifani yangilang: kataklar birin-ketin kiradi. › ni bosing — Yakshanba o'ngdan kiradi; ‹ ni bosing — Shanba chapdan qaytadi. Bo'sh katakni bosing — kichrayib qaytadi.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizdagi ro'yxatga yozing: qavslarga ro'yxatingiz joyini va nima buzilmasligini qo'ying. «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.
     > Joy — **{ro'yxatingiz qayerda}**. Sahifa ochilganda ro'yxat elementlari birin-ketin kirsin, hammasi 0,4 soniyada.
     > **{nima buzilmasin}** o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (telefon maketi, o'zi aylanadi): Shanba kataklari birin-ketin kiradi → › → Shanba chapga chiqib ketadi,
  Yakshanba o'ngdan kiradi (band: 18:00, 19:00) → ‹ → Shanba chapdan qaytadi.
- Qator (`QIzoh`, natija ostida): Yo'nalish vaqtni his qildiradi: keyingi kun o'ngdan kiradi, oldingisi chapdan qaytadi. (86)
- Hammasi bajarilgach (yashil): Maydon jonli: kataklar birin-ketin kiradi, kun silliq almashadi, bosish o'zgarmadi. (81)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-08-done`
- Nishon (bonus): Live Maydon — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- Izoh (MD): «{soniya}» — 8-ekrandagi 0,4. «Yangi paket o'rnatma» — Motion 5-darsdan `web/` da bor; texnologiya nomi promptda yo'q (173.4).

## 11 · Natijalar (podium)  ← QNatija
- Jonli reyting: 3 savol + 2 blok «Bajardim» (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — Kinodagi usul · 5 — Asosiy savolga usul · 9 — Talabdagi vaqt

## 12 · Takrorlash  ← QKartochka
- Sarlavha: O'zingizni sinab ko'ring. (12 karta — jadval «Kartochkalar» bo'limida)

## 13 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha: **Vaqtlar to'ri va animatsiyalar tayyor.** (38)
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Yaxshi interfeysdan bezak emas, usul olinadi: u foydalanuvchining savoliga javob beradi.
  - Avval eng muhim savolga javob beradigan bitta usuldan boshlaysiz.
  - Animatsiya talabi joyni, harakat vaqtini va nima qolishini aytadi.
  - Qisqa interfeys animatsiyalari ko'pincha bir necha yuz millisekund davom etadi — Maydon'da 0,3–0,4 soniya.
- Uyga vazifa (karta, P-025):
  - Sarlavha: Uyda nima qilasiz?
  - Kim uchun: o'z MVP ingiz · Nechta: usul va ro'yxat animatsiyasi · Muddat: keyingi darsgacha
  - 1 · Usul kartangizdagi talabni o'z loyihangizda Antigravity'ga bering.
  - 2 · Ro'yxat animatsiyasi talabini bering va telefon ko'rinishida tekshiring.
  - (Usul kartasi shu yerda ko'rinadi — 6-ekrandagi uch qator.)
- Keyingi dars — «Loyiha kuni: MVP tayyor». Bugun Maydon jonli ko'rindi; o'sha darsda band qilish ishlaydi, maydon egasi o'z sahifasini oladi va Maydon internetga chiqadi.
- Nishonlaringiz — N/4 (mentor rejimida yo'q)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Pattern Picker!** — Maydon'ga eng muhim savolga javob beradigan usulni tanladingiz (2)
- **Idea Hunter!** — O'z g'oyangiz uchun usul kartasini yozdingiz (6)
- **Motion Writer!** — Animatsiya talabini uch aniq qismdan yig'dingiz (8)
- **Live Maydon!** — Ikki amaliyot blokini oxirigacha bajardingiz (10) — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Usul va bezak** — 1 Usul — boshqa interfeysda ishlatilgan va foydalanuvchining vazifasini osonlashtiradigan ko'rinish yoki harakat. · 2 Bezak — bu misolda vazifani o'zgartirmay, faqat ko'rinishni o'zgartiradigan detal. ·
  3 Har bo'lakdan so'rang: u foydalanuvchining qaysi savoliga javob beradi? — savol: 3-ekran savoli
- **5 · Eng muhim savolga bitta usul** — 1 Avval foydalanuvchining eng muhim savolini toping. · 2 Bir nechta usul bo'lsa, shu savolga javob beradiganini oling. ·
  3 Qolgan usullar «keyin» ro'yxatida qoladi. — savol: 5-ekran savoli
- **9 · Animatsiya talabi** — 1 Qayerda: harakat qaysi joyda bo'ladi. · 2 Nima qilsin: qanday harakat va necha soniya. ·
  3 Nima buzilmasin: qaysi eski animatsiya qolishi kerak. — savol: 9-ekran savoli

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Interfeys usuli nima? | Boshqa interfeysda ishlatilgan va vazifani osonlashtiradigan ko'rinish yoki harakat | «Arxitektura patternlari»dagi pattern kabi — tayyor rasm emas |
| Bezak nima? | Ko'rinish: rang, rasm, shrift | O'zgartirsangiz ham foydalanuvchining savoli o'z joyida qoladi |
| Dribbble'da nima ko'rasiz? | Dizaynerlar ishidan ekranlar | Qidiruvga inglizcha yozasiz: `booking app` |
| Nega dizayner ekranini butunligicha ko'chirmaysiz? | U boshqa foydalanuvchi va boshqa savol uchun chizilgan | Rang va rasm — dizaynerning o'z ishi |
| Maydon'ga qaysi usul olindi? | Vaqtlar to'ri | Butun kun bir ekranda — «Bugun qaysi vaqt bo'sh?» savoliga javob |
| Nega bu mashqda avval bitta usul olinadi? | Nima o'zgarganini aniq ko'rish uchun | Qolgani «keyin» ro'yxatida |
| Pastga tortib yangilash qaysi ilovada paydo bo'lgan? | Tweetie 2 da, 2009-yilda | Uni dasturchi Loren Brichter yasagan |
| Tweetie'dan keyin ko'p ilovalarda nima paydo bo'ldi? | Pastga tortib yangilash usuli | Bitta usul turli ko'rinishdagi ilovalarda ishlaydi |
| Animatsiya talabi nimalarni aytadi? | Qayerda, nima qilsin, nima buzilmasin | «Nima qilsin»da — harakat va uning vaqti |
| Ro'yxat animatsiyasi nima? | Elementlarning birin-ketin kirishi | Maydon'da — kataklar, hammasi 0,4 soniyada |
| Maydon'da sahifa o'tishi qachon bo'ladi? | Kun almashganda | › bosilsa yangi kun o'ngdan kiradi |
| Talabda «yangi paket o'rnatma» nega bor? | Motion repo'da allaqachon bor | Agent boshqa kutubxona qo'shmaydi |

## Jonli viktorina (arena, 12 savol) — kalitlar: A · B · C · D · B · A · D · C · A · D · C · B (har harf 3 marta)
1. Behance'da dizayner nimani ko'rsatadi? · ✔ Loyihasini rasmlar va izoh bilan · Faqat o'z rezyumesini matn bilan · Ilovasining tayyor kodini fayl bilan · Ilovalarning yuklab olinish sonini
2. Musiqa ilovasida qaysi biri usul? · Ilova foni qora, harflari esa oppoq · ✔ Oxirgi tinglangan qo'shiq tepada turadi · Albom rasmlari katta va yumaloq chizilgan · Tugmalar och ko'k rangga bo'yalgan
3. Maydon misolida qaysi biri bezak? · Band katakni bosib bo'lmasligi · Butun kun bitta ekranga sig'ishi · ✔ Fon rangi va sarlavha shrifti · Kun almashganda yo'nalish ko'rinishi
4. To'p rasmi Maydon'ga qo'yilganda nima bo'ldi? · O'yinchi bo'sh vaqtni tezroq topib oldi · Kataklar uch ustunga yig'ildi · Kun almashtirgich yo'qolib qoldi · ✔ Kataklar yana pastga surilib ketdi
5. Kunlar tasmasi qaysi savolga javob beradi? · «Bugun qaysi vaqt bo'sh?» · ✔ «Boshqa kunda bo'sh vaqt bormi?» · «Maydon egasining telefoni qaysi?» · «Band qilish qancha pul turadi?»
6. Usulni qayerdan boshlab izlaysiz? · ✔ Foydalanuvchining eng muhim savolidan · Dribbble'da eng ko'p yoqtirilgan ishdan · O'zingizga yoqqan rang va shrift turidan · Do'stingiz ilovasining ekranidan
7. Tweetie'gacha yangi postni qanday ko'rardingiz? · Telefonni silkitib yangilardingiz · Ilova har daqiqada o'zi yangilab turardi · Yangi post kelsa, xabar chiqardi · ✔ Tepaga chiqib, tugmani bosardingiz
8. Tortib turganingizda belgi nima qiladi? · Ilovaning o'zini tezroq ishlatib yuboradi · Ekranni chiroyliroq qilib ko'rsatadi · ✔ Yangilanish boshlanishini ko'rsatadi · Yangi postlar sonini sanab ko'rsatadi
9. Talabdagi «qayerda» qismi nima uchun kerak? · ✔ Agent boshqa joyga tegmasligi uchun · Agent kodni tezroq yozib berishi uchun · Kod chiroyliroq va qisqa yozilishi uchun · Talab uzunroq va jiddiyroq bo'lishi uchun
10. Maydon'dagi ro'yxat animatsiyasiga qaysi vaqt tanlandi? · 2 soniyadan ham uzunroq · Roppa-rosa bir soniya · 3–5 soniya oralig'ida · ✔ Hammasi 0,4 soniyada
11. O'yinchi › ni bosdi. Yangi kun qayerdan kiradi? · Chap tomondan · Tepadan pastga · ✔ O'ng tomondan · Pastdan tepaga
12. Talabga «nima buzilmasin» nega yoziladi? · Agent ko'proq kod yozib bersin deb · ✔ Ishlab turgan narsa saqlansin deb · Talab rasmiyroq bo'lib ko'rinsin deb · Agent yangi paketlar o'rnatsin deb

- Fon so'zlari (R-008, {uz, ru}): usul · bezak · talab · animatsiya · katak · to'r · Dribbble · Behance · Motion · `0,4 s` · Maydon · agent (+ ✅ 🎯 — o'yin qatlami).
- Izoh (MD): ekran testlari (3, 5, 9), kartochkalar va arena — uch xil savol (§144): arena 2 — yangi tanish olam (musiqa ilovasi, P-002), 4/5 — 2-ekran tafsiloti, 7/8 — keys, 9–12 — talab va animatsiya.
  Variant uzunliklari (belgi, skript): 1 · 32/32/36/34 · 2 · 35/39/41/34 · 3 · 30/32/29/36 · 4 · 39/29/32/34 · 5 · 29/32/34/32 · 6 · 37/39/40/32 · 7 · 33/40/32/34 · 8 · 41/36/36/37 · 9 · 35/38/40/41 · 10 · 23/21/21/22 · 11 · 13/14/13/14 · 12 · 34/33/36/34 — to'g'ri variant hech qayerda eng uzun emas.

---

## KOD — qurish bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`)
1. **Yangi fayl** `src/7-Modull/PmDesignMotionLesson.jsx` — skeletdan (pilotdan emas, JR-14); palitra `qolipRang('pm')`; `SCREEN_META` 14:
   hook · plan · concept · test · keys · test · workshop · practice · concept · test · practice · stats · flashcards · summary. `LESSON_META.lessonId` — `m7-08-v1`.
2. **Ekran turlari:** s0 `QKirish` · s1 `QReja` · s2/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s9 `QTest` (`QuestionScreen` mantig'i, DE-203) · s4 `QVoqea` ·
   s6 `QMustaqil` · s7/s10 `QBlok` (skeletdagi `ScreenBlok` ulagichi) · s11 `QNatija` · s12 `QKartochka` · s13 `QYakun`.
3. **Bitta vizual `IkkiTelefon`** (180): `DIZ_BOLAKLAR` (4: `id`, `nom`, `tur: usul|bezak`, `savol`, `effekt`) + `KATAKLAR` (Shanba, Yakshanba — 6 katak, `holat`) →
   `MaydonTel` holatlari (`ustun` | `tor`; `fon`, `rasm`, `tasma` qatlamlari; `jonli` — kirish va kun almashishi; pufak). s0, s1, s2, s7 (o'ng), s8, s10 (o'ng) shundan o'qiydi.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). `prefers-reduced-motion` — o'tishsiz, holat bir zumda.
4. **KOD — qolipda yo'q bo'lishi mumkin:** `QBlok` 5 qadam (skelet namunasida 4) — 5-qadam «O'z g'oyangiz» ikkinchi prompt qutisi bilan; qavslar s6 namuna kartasidan to'ldiriladi.
   Qolip 5-qadamni ko'tarmasa — `QBlok` ga `qadamlar` uzunligi cheklanmaganini tekshirish (asosiy seans, 6, 7, 9, 11-darslar ham shu qadamni oladi).
5. **KOD — darsga xos:** s2 ikki bosqichli tajriba (bo'lak → Maydon qatlami → karta ostida natija qatori → 4/4 da `usul`/`bezak` yorliqlari → ikki karta tanlovi);
   s8 variant → maket animatsiya rejimi (`sakrash` · `uzoq` · `mikroYoq` · `aniq`) + `QXato` + yig'ilgan talab qutisi; s4 `TortishMaket` (3 holat: tugma · tortish · uch telefon).
6. **Saqlash:** s6 usul kartasi (3 qator) — `ccProgress` + artefakt-strip «Usul kartam» (U-042); s7/s10 5-qadamida va s13 uyga vazifada o'qiladi.
   s6 kirish qatori — 3-darsda saqlangan muammo (kalit nomi TAYANCHGA SAVOL 9); yo'q bo'lsa zaxira gap.
7. **Testlar:** `INLINE_KEYS` s3 → 1, s5 → 2, s9 → 0; `RECAPS` 3/5/9 (`ask` + 3 karta, `ic` 1/2/3); `Q_LABELS`; xato izohlari ≤60.
8. `QUIZ_BANK` 12 (kalitlar A B C D B A D C A D C B); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`.
9. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s2 2-bosqich birinchi tanlov `tor` → patternPicker · s6 3/3 → ideaHunter · s8 uchala aniq → motionWriter · s10 oxirgi «Bajardim» → liveMaydon.
10. Uyga vazifa — yangi karta (HW_STEPS 2 qadam + usul kartasi); `*.homework.jsx` hozir yo'q (PM-027 — tegilmaydi qoidasi mavjud fayllar uchun).
11. App.jsx `m7-08` qatoriga `comp` — «qur» bosqichida, asosiy seans (nom va osti yozuvi o'zgarmaydi, DE-205 ✓).
12. Darvozalar: `npm run gates -- src/7-Modull/PmDesignMotionLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

## REPO — `maydon`, teg `dars-08-done` (tayanch 3-bo'lim; «qur» bosqichida yoziladi)
1. `dars-08-done` = `dars-07-done` + A1 va A2 natijasi (Mentor misoli):
   - `web/` — vaqt kataklari uch ustunli to'r (6 katak telefonda bir ekranda); katakda soat va holat;
   - ro'yxat animatsiyasi — kataklar birin-ketin kiradi, jami 0,4 s (Motion, 5-darsda o'rnatilgan `motion` paketi);
   - sahifa o'tishi — kun almashganda eski kun chiqadi, yangisi tugma tomonidan kiradi, 0,3 s; reduced-motion'da o'tishsiz;
   - saqlanadi: 5-darsdagi uch animatsiya (bosilganda kichrayish · band rangining silliq o'zgarishi · «Band qilindi» belgisi), `GET /vaqtlar`, `vaqt-tanladi` hodisasi; yangi paket yo'q.
2. README «Darslar va teglar» jadvaliga 8-dars qatori.
3. Bog'liqlik: 9-dars band qilish formasi shu to'r ustida quriladi; 10-dars sinovi shu ko'rinishda (3-muammo «kunni almashtirishni sezmadi» — kunlar tasmasi olinmagani bilan mos).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tayanchda yo'q edi)
1. **Kataklar soni va vaqti** — GATE M K1 bilan yopildi: 6 katak, 16:00 … 21:00; Shanba band 17:00, 20:00; Yakshanba band 18:00, 19:00; to'r 3×2.
   aniq raqam talab qiladi. 4, 5, 7-darslarning namuna ma'lumoti bilan bir xil bo'lishi kerak (18:00 Shanba bo'sh — 10-dars sinov vazifasi).
2. **`dars-07-done` ko'rinishi:** kataklar bitta ustunda, kun almashtirgich «‹ Shanba ›». Nega: 8-darsdagi usul (to'r) shu holatdan o'sadi. 7-dars MD si boshqacha bo'lsa — 0, 2, 7-ekran maketi moslanadi.
3. **Tanlangan usul — «Vaqtlar to'ri»;** «Kunlar tasmasi» — «keyin». Nega: intervyudagi asosiy muammo (bo'sh vaqtni bilish) shunga javob beradi; 10-dars 3-muammosi («kunni almashtirishni
   sezmadi») bilan zid emas, aksincha mos. 9–11-darslar shu ko'rinishda.
4. **«Sahifa o'tishi» = kun almashishi.** Nega: 8-darsda Maydon'da boshqa sahifa yo'q (ega sahifasi 9-darsda).
5. **«namuna» so'zi ikki ma'noda (T-015):** bu darsda — pattern; tayanchda `dars-04-done` «namuna ma'lumot», 173-qonun blok yorlig'i «kutilgan natija · namuna: …». Bu darsda yorliq
   «kutilgan natija · namuna: Maydon». — yopildi (GATE M 08-q0 A): pattern — «usul», «namuna» — misol; blok yorlig'i standart.
6. **«talab» va «prompt»:** qaror 8 — «shu promptni o'z g'oyangizga yozing», tayanch — «talab», blok qadami — «Prompt». Bu darsda: qadam nomi «Prompt», ichidagi matn va tushuncha — «talab».
   Modul bo'yi bitta qoida kerak (7, 9, 11-darslar ham).
7. **Repo manzili va `git fetch`:** o'quvchi `maydon` ni clone qiladi deb oldim — `git fetch --tags` (URL siz). Fork bo'lsa — to'liq URL kerak (tayanchda yo'q).
8. **O'z g'oyasi uchun prompt qayerda turadi:** darsda — usul kartasi (6-ekran) va 5-qadamdagi «Nusxalash»; o'z repo'sidagi fayl nomi o'ylab topilmadi (boshqa darslarga tegadi).
9. **3-darsda saqlangan muammo** (6-ekran kirish qatori): kalit nomi va 3-dars shu muammoni saqlashi — 3-dars MD si bilan kelishiladi; yo'q bo'lsa zaxira gap.
10. **Dribbble va Behance sinfda ochiladimi** (kirishsiz, sinf tarmog'ida): curl bilan tekshirib bo'lmadi (bot himoyasi 202/403); dribbble.com/about va behance.net/about WebFetch bilan ochildi.
    Zaxira darsda bor: dizayner ekranidagi ikki usul.
11. **Motion `web/` da 5-darsda o'rnatilgan** (`motion` paketi) — A2 «Yangi paket o'rnatma» shunga tayanadi.
12. **Tweetie keysi** — modulda boshqa darsda ishlatilmasin (bir keys — bir dars).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): m7-07 «Loyiha kuni: MVP — birinchi ekran» → **m7-08 «Yaxshi interfeysdan nimani olasiz?»** (osti «bitta usul va animatsiyalar») → m7-09 «Loyiha kuni: MVP tayyor».
- [x] Bitta misol-ip — Maydon; metafora yo'q; bitta vizual — «Ikki telefon» (Maydon + dizayner ekrani, bitta manbadan). Ikkinchi misol faqat testda: s3 kino chiptasi, s5 navbat ilovasi, arena 2 musiqa ilovasi (P-002).
  Tweetie — keys maketi (PM-029). [?] dizayner ekrani — ikkinchi telefon, lekin u darsning o'qitish obyekti (manba); vizual bosqichda ko'riladi.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (bo'lak → Maydon), 8 (variant → maket harakati) + 0, 4, 6, 7, 10. Matn-karta yo'q.
- [x] Sarlavha ≤55 bitta qator (34–50) · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 (78–108) · hook javobi ≤120 (103/114) · xato izohi ≤60 (39–60) — skript bilan sanaldi.
- [x] Atamalar tayanch bilan bir xil (vaqt katagi, band, o'yinchi, hodisa, talab, agent, animatsiya, mikro-harakat, Motion; slot/bron/frontend/baza yo'q — grep) · siz-forma; Antigravity promptlari
  T-002 istisnosida (buyruq shakli) · tugmalar ot-shaklda yoki siz-formada («Kartaga yozish», «Qayta ko'rish»).
- [x] Testlar: variantlar 37–44 belgi, to'g'ri variant eng uzun emas (s3 39/42 · s5 43/44 · s9 37/40); kalit so'z faqat to'g'rida emas («Band» s3 A va B da, «Harakat» s9 A, B, C da); tire faqat to'g'rida emas.
  ✔ o'rni yangi dars uchun belgilandi: B · C · A; arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (PM + amaliyot darsi; yakuniy — s9 `QTest`), uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — grep 0).
- [x] Ichki kodlar yo'q (o'quvchi matnida «9-Modul», «T6», «P1» yo'q; «5-darsda», «o'tgan darsda» — dars raqami, namuna MD dagidek) · keys faktlari — manba bilan (A-bo'lim) · «KOD» 12 band, «REPO» 3 band.
- [x] Karta T · P · S · PM: T-002/011/014/015/029/039/042/047/052/064 · P-001/002/008/010/013/014/015/016/026/028/036/052/059/062/064/067 · S-001/004/006/008/010/015/018/026/040 ·
  PM-028/029/030. [ ] P-028 qisman: Dribbble/Behance qidiruv tugmasi nomi yozilmadi (taxmin qilinmaydi) — «qidiruvga yozing»; sinf tarmog'ida ochilishi tekshirilmagan (TAYANCHGA SAVOL 10).
- [?] Ochiq: s2 ikki telefon + to'rt karta — 1280 da sig'adi, 393 da telefonlar ustma-ust; vizual bosqichda ko'riladi. QBlok 5-qadam (KOD 4).

---

# 9-Modul · 9-dars «Loyiha kuni: MVP tayyor» — MD v3 (172-qonun qolipi)

Fayl: `src/7-Modull/MvpCompleteLesson.jsx` · kalit `m7-09` · **8 ekran + 3 amaliyot bloki = 11** · faqat o'zbekcha (ru — 6-RU bosqichida)
Namuna: `feedback/F-0929-QA-6modul/13-FullSystemProject-v3.md` (tuzilish) · blok ulagichi: `src/skelet/NamunaDars.jsx` (`ScreenBlok`).
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi — `.jsx` hali yo'q, hamma ekran noldan.
⚠️ Dars yangi: ballik testlarda to'g'ri javob o'rni shu MD'da belgilanadi (3-ekran **B**, 5-ekran **C**) va keyin o'zgarmaydi.
Menyu nomi (205): «Loyiha kuni: MVP tayyor» — App.jsx `m7-09` bilan bir xil. Oldingi: 8-dars PM + amaliyot «Yaxshi interfeysdan nimani olasiz?» ·
keyingi: 10-dars PM «Odam ilovangizda qayerda to'xtab qoladi?».
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 · A2 · A3 — har biri ≈ 20). Sarlavha yonidagi `(NN)` — belgilar soni.

---

Tashqi audit (ChatGPT) Filtri: `09-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi

1. **Bitta natija.** Dars oxirida «Maydon» internetda ishlaydi: o'yinchi telefondan bo'sh katakni band qiladi, maydon egasi bandlar ro'yxatini parol bilan
   ko'radi, Umami uch qadamni sanaydi (ochdi → vaqtni tanladi → band qildi). Natija 1-ekranda ko'rsatiladi, 3 blokda quriladi, 6-ekranda sanaladi.
2. **Dasturdagi o'rni** — «MVP ishlab chiqish — 2-qism». 7-darsda talab yozilib birinchi ekran qurilgan (kataklar Backend'dan, `dars-07-done`),
   8-darsda bitta interfeys usuli va animatsiyalar qo'shilgan (`dars-08-done`). Bugun — MVP ro'yxatidagi qolgan ikki funksiya va internetga chiqarish (`dars-09-done`).
3. **MVP ro'yxati** (3-dars, tayanch 1): «qilamiz» — kun bo'yicha vaqt kataklari · katakni band qilish (ism + telefon) · ega uchun bandlar ro'yxati;
   «keyin» — to'lov · jamoa yig'ish · eslatma; «qilmaymiz» — baho · chat. Bugun faqat «qilamiz».
   **«Yana funksiya qo'shamiz» istagiga qarshi bitta joy — 0-ekran:** agent to'lov tugmasini taklif qiladi, savol «MVP qachon tayyor?», javob «keyin» qutisiga
   qaytaradi. MVP ro'yxati qatori dars bo'yi vizual tepasida turadi, «keyin» qutisi kulrang (qayta gapirilmaydi — faqat ko'rinadi).
4. **Atamalar (bir ma'no — bir so'z, tayanch 2):** sayt · Backend · Database · vaqt katagi · band qilish / band · o'yinchi · maydon egasi · hodisa · talab ·
   agent (Antigravity) · token (4-Modul ta'rifi: parol to'g'ri bo'lsa beriladi, keyingi so'rov u bilan ketadi) · `.env` · deploy (1-Modul: saytni internetga chiqarish).
   **Ishlatilmaydi:** server (prozada), frontend, baza, slot, bron, buyurtma, mijoz, admin · «sinov / sinash» — 10-dars atamasi (real odam), bugun «tekshirish» ·
   «maydon» forma qismi ma'nosida (T-015, mahsulot nomi bilan to'qnashadi) · «band» ro'yxat qismi ma'nosida — o'rniga «funksiya» · «katak» jadval qismi ma'nosida — o'rniga «qator».
5. **Texnik aniqlik (tayanch 3, taxmin emas):** `GET /vaqtlar?kun=` — soat + holat (ism va telefon yo'q) · `POST /bandlar` — `kun`, `soat`, `ism`, `telefon` ·
   `POST /kirish` — ega paroli → token · `GET /bandlar` — faqat token bilan, aks holda `401`. Jadval `bandlar`: `id · kun · soat · ism · telefon · yaratilgan`.
   Hodisalar: sahifa ochilishi (avtomatik) · `vaqt-tanladi` (6-dars) · `band-qildi` (bugun). Darsning uch g'oyasi shundan chiqadi:
   (a) bo'sh katakni Backend tekshiradi — telefondagi sahifa eskirgan bo'lishi mumkin; (b) `band-qildi` faqat band saqlangach yoziladi;
   (c) ism va telefon faqat ega sahifasida, token bilan; parol — `.env` da.
6. **Talab (7-darsdagidek):** uch qator — «Qayerda» · «Nima qilsin» · «Nima buzilmasin» — va oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» (§221, 173.4).
   Prompt — agentga buyruq, sen-formada (T-002). O'quvchi `{...}` joylarni o'zi to'ldiradi — javobi oldingi tushuncha ekranida.
7. **Amaliyot bloki (173 + qaror 8):** 4 qadam (Ochish → Prompt → Ishga tushirish → Tekshirish) + **5-qadam «O'z g'oyangiz»** — shu talabni o'quvchi o'z MVP'siga yozadi;
   o'z MVP'si uyda davom etadi. Kutilgan natija — «Maydon» namunasi. **Uyga vazifa bloki yo'q (172.4).**
8. **Deploy yo'li — o'tilgandan, yangi xizmat yo'q:** Backend — Render (5-Modul bot darslari: «New → Web Service», «Environment»; 6-Modulda ham Backend serverga chiqqan) ·
   sayt — Netlify, GitHub'dan (1-Modul «Netlify va deploy» da tanishgan). Ikkalasi GitHub'dan oladi: push qilinsa o'zi yangilanadi (GATE M M-q7; 11-dars shunga tayanadi). Database — Neon (4-darsdan, bir xil `DATABASE_URL`).
   6-Modulda web laptopda qolgan edi; bu yerda sayt ham chiqadi — 10-darsda boshqa odam MVP'ni o'z telefonida ochadi → **TAYANCHGA SAVOL 1**.
9. **Metafora yo'q.** Qahramon yo'q — vazifani Mentor beradi; jadvaldagi ism va telefon — namuna ma'lumot (TAYANCHGA SAVOL 9).
   Matn o'lchovi (162/164, §225): sarlavha ≤55 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60. Yuzada emoji yo'q (185); ✓ ✗ → — belgilar.

---

## Darsning ipi va bitta vizual

- **Hook:** kataklar bor, lekin hali hech kim band qila olmaydi; agent esa to'lov tugmasini taklif qiladi → «MVP qachon tayyor?».
- **Ip (ot-shaklda, §224):** Band qilish → Ega sahifasi → Internetga chiqarish.
- **Namuna:** «Maydon» — repo `maydon`, `dars-08-done` → `dars-09-done`. O'quvchi darsda «Maydon»ni quradi, har blok oxirida talabni o'z g'oyasiga yozadi.
- **Bitta vizual — «Maydon» xaritasi** (4-dars sxemasining davomi; to'plam bitta manbada — 180):
  - tepada **MVP ro'yxati qatori**: «qilamiz» — Vaqt kataklari ✓ · Band qilish ○ · Ega uchun bandlar ro'yxati ○ · yonida «keyin» qutisi kulrang (To'lov · Jamoa yig'ish · Eslatma);
  - chapda **sayt** — telefon ramkasi: kun tanlagich (Shanba), vaqt kataklari 16:00–22:00 (bo'sh — oq, band — to'q), katak bosilganda forma (ism, telefon) va «Band qilish» tugmasi;
  - o'rtada **Backend** — qutida to'rt yo'l: `GET /vaqtlar` · `POST /bandlar` · `POST /kirish` · `GET /bandlar` (qulf belgisi bilan);
  - pastda **Database** — `bandlar` jadvali (`kun · soat · ism · telefon`);
  - o'ngda **ega sahifasi** — brauzer `/ega`: parol qatori va bandlar ro'yxati;
  - burchakda **Umami'dagi uch qadam** — ochdi → vaqtni tanladi → band qildi (har qadam ostida son).
  - Holatlar: kulrang (hali yo'q) → oq (ishlaydi) → accent (joriy) → yashil (bugun qurildi) → qizil (rad etildi / qulf). Konvert — so'rov.
  - Ishlatiladi: 0 (sayt + MVP ro'yxati) · 1 (tayyor holat: hammasi yashil, manzil `....netlify.app`) · 2 (band yo'li, ikki telefon) · 4 (ega yo'li) · A1–A3 (kutilgan natija).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **«Maydon»ni qachon tayyor deyish mumkin?** (39)
- Mentor: Kataklar Backend'dan keladi, lekin hali hech kim maydonni band qila olmaydi. Agent esa to'lov tugmasini ham qo'shishni taklif qilyapti.
- Maket (chap): telefon ramkasida «Maydon» — Shanba, kataklar 16:00–22:00, hammasi bo'sh; katak ostida «Band qilish» tugmasi xira.
  Ostida MVP ro'yxati qatori: «qilamiz» — Vaqt kataklari ✓ · Band qilish ○ · Ega uchun bandlar ro'yxati ○ · «keyin» — To'lov · Jamoa yig'ish · Eslatma (kulrang).
- Variantlar (radio):
  - To'lov va jamoa yig'ish ham qo'shilganda
  - «Qilamiz» qutisidagi funksiyalar ishlaganda
  - Ko'rinishi namunadagidek mukammal bo'lganda
- Javob — 2-variant: **Aynan!** Biz belgilagan shu versiya «qilamiz» qutisi ishlaganda tayyor. Bugun qolgan ikkitasini quramiz. (95)
- Javob — 1-variant: **Qiziq fikr!** To'lov va jamoa yig'ish — «keyin» qutisida. Avval odam maydonni band qila olishi kerak.
- Javob — 3-variant: **Qiziq fikr!** Ko'rinishni 8-darsda tanladingiz. Tayyorlikni esa «qilamiz» qutisi o'lchaydi.
- **Harakat → Vizual o'zgarish:** variant tanlanadi → maketda 18:00 katagi bosiladi, «Band qilish» xira qoladi — hech narsa o'zgarmaydi;
  MVP ro'yxatida «Band qilish» va «Ega uchun bandlar ro'yxati» accent bo'lib yonadi (bugungi ish), «keyin» qutisi kulrangligicha qoladi.
- Jonli: sof so'rovnoma — `correct: false` hammaga, maqtov yo'q (J-026).

## 1 · Bugun quramiz  ← QReja
- Eyebrow: Reja
- Sarlavha: **Dars oxirida «Maydon» telefonda shunday ishlaydi.** (49)
- Mentor: «Maydon»ni birga quramiz, har blok oxirida esa shu talabni o'z g'oyangizga yozasiz.
- Chapda «Dars oxirida ...»: telefon maketi, manzil `maydon-....netlify.app` — Shanba, 19:00 band, «Band qilindi» belgisi; yonida ega sahifasi «Shanba · bandlar»:
  - 19:00 · Jasur · +998 90 123 45 67
  - 21:00 · Bekzod · +998 93 765 43 21
  - Tepada MVP ro'yxati qatori: «qilamiz» uchala funksiya ✓, «keyin» qutisi kulrang — tegilmagan.
- O'ngda 3 qadam (bosilmaydi, teg yo'q — 172 tuzatish F-1003-06, P-015):
  - 01 · Band qilish — o'yinchi bo'sh katakni bosadi, band Database'ga yoziladi
  - 02 · Ega sahifasi — bandlar ro'yxati faqat parol bilan ochiladi
  - 03 · Internetga chiqarish — sayt va Backend internetda, telefondan ochiladi
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-08-done` · tayyor namuna `dars-09-done`
- **Harakat → Vizual o'zgarish:** bosiladigan narsa yo'q (reja); telefonda 19:00 bosiladi → konvert Backend'ga, undan Database'ga yuradi →
  katak band rangiga silliq o'tadi, «Band qilindi» paydo bo'ladi → ega ro'yxatiga 19:00 qatori ajralib kiradi (jonli maket, DE-200).
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Tushuncha 1 — bo'sh katakni kim tekshiradi  ← QTushuncha
- Eyebrow: Tushuncha · band qilish
- Sarlavha: **Ikki o'yinchi bitta katakni band qilsa, kim oladi?** (50)
- Mentor: Ikkala telefonda 18:00 hozir bo'sh ko'rinadi. Avval birinchisidan, keyin ikkinchisidan band qiling.
- Bashorat (ballsiz, 181): **Ikkinchi band ham Database'ga yoziladimi?** · Ha, ikkalasi ham yoziladi · Yo'q, bittasi rad etiladi
- Vizual: «Maydon» xaritasining chap va o'rta qismi — ikki telefon yonma-yon («1-telefon», «2-telefon»), ikkalasida Shanba 18:00 bo'sh;
  Backend qutisida `POST /bandlar`; Database `bandlar` bo'sh; burchakda Umami: band qildi — 0.
- **Harakat → Vizual o'zgarish:**
  - 1-telefonda «Band qilish» (ism va telefon to'ldirilgan) → konvert `{ kun, soat, ism, telefon }` Backend'ga yuradi → Backend Database'dan 18:00 ni so'raydi —
    bo'sh, yashil ✓ → jadvalga qator ajralib kiradi `2026-10-10 · 18:00 · Jasur` → javob qaytadi → 1-telefonda katak band rangiga silliq o'tadi,
    «Band qilindi» belgisi chiqadi → Umami: band qildi — 1.
  - 2-telefonda 18:00 hali bo'sh ko'rinadi — katak ustida kichik kulrang yorliq «eski holat» (sahifa yangilanmagan).
  - 2-telefonda «Band qilish» → konvert Backend'ga → Database'da 18:00 band — Backend qutisi qizil yonadi, javob `409 · Bu vaqt band` →
    jadvalga qator qo'shilmaydi → 2-telefonda «Bu vaqt band — boshqa vaqtni tanlang», katak band rangiga o'tadi → Umami soni o'zgarmaydi (1).
- Natija qatori: «Taxminingiz: ... · haqiqatda: ikkinchi band yozilmadi — Backend rad etdi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Backend tekshiradi, Database bir katakni ikki marta yozdirmaydi. `band-qildi` faqat band saqlangach yoziladi. (109)
- Tugma (pastki): Ikkala telefondan band qiling (N/2) → Davom etish
- Tugagach (199): harakat paneli yopiladi, xarita butun enga chiqadi, Backend qutisidagi tekshiruv va Umami soni fokusda.

## A1 · Amaliyot 1 — band qilish  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 1 · band qilish
- Sarlavha: **Bo'sh katakni bosgan o'yinchi uni band qila olsin.** (50)
- Mentor: Talabdagi ikki qavsni o'zingiz to'ldirasiz — ikki telefonni eslang. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Ikki terminal: `cd backend && npm run start:dev` · `cd web && npm run dev`.
     Brauzerda `localhost:5173` — shanba kataklari ko'rinsin.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytdagi vaqt kataklari va Backend'dagi `POST /bandlar`.
     > Nima qilsin: bo'sh katak bosilsa, **{o'yinchidan nima so'ralsin}** so'rasin va bandni `bandlar` jadvaliga yozsin; javob kelgach katak band bo'lsin.
     > Band saqlangach `band-qildi` hodisasini yuborsin.
     > Nima buzilmasin: **{band katak uchun qoida}** — buni Backend tekshirsin. Animatsiyalar va `vaqt-tanladi` hodisasi qolsin.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Antigravity o'zgargan fayllarni aytadi: ular `backend/` va `web/` ichida bo'lsin. Ikkala terminal xatosiz, sahifa o'zi yangilanadi.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — saytni ikki oynada oching. Birinchisida shanba 19:00 ni o'z ismingiz bilan band qiling (18:00 ni band qilmang — 10-darsdagi sinov vazifasi shu vaqt uchun); ikkinchisida sahifani yangilamasdan o'sha katakni
     band qilib ko'ring — «Bu vaqt band» chiqsin. Neon'dagi **SQL Editor**'da: `SELECT kun, soat, ism FROM bandlar WHERE soat = '19:00';` — bitta qator (17:00 va 20:00 — 7-darsdagi namuna bandlar). Umami'da `band-qildi` — bitta.
  5. **O'z g'oyangiz** — MVP'ingizning asosiy harakati uchun shu talabni yozing: qayerda, nima qilsin, nima buzilmasin. Uyda o'z loyihangizda Antigravity'ga yuborasiz.
- O'ng tomon — «Kutilgan natija (namuna: «Maydon»)»: ikki brauzer oynasi yonma-yon — 1-oyna: 19:00 band, «Band qilindi»; 2-oyna: «Bu vaqt band — boshqa vaqtni tanlang».
  Ostida jadval-karta (Neon · SQL Editor):
  | kun | soat | ism |
  |---|---|---|
  | 2026-10-10 | 19:00 | Jasur |
- **Harakat → Vizual o'zgarish:** «Bajardim» → chapdagi qadam ✓, keyingisi ochiladi; 5/5 da qadam paneli yopiladi, kutilgan natija fokusga (199).
- Hammasi bajarilgach (yashil): Band qilish ishlayapti: bitta katakka faqat bitta band yoziladi. (64)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-09-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 3 · 1-savol ✅ (jonli ball)  ← QTest · kalit **B**
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Ikki o'yinchi bir vaqtda 18:00 ni bosdi. Qaysi qism hal qiladi?** (`h-ask`, 10 so'z — S-001)
  - Sayt — qaysi telefon birinchi bosganini ko'rib
  - ✔ Backend — yozishdan oldin Database'ni ko'rib
  - Umami — har `vaqt-tanladi` hodisasini sanab
  - Maydon egasi — Database'dagi ro'yxatni ko'rib
- To'g'ri izohi: Backend tekshiradi; ikki so'rov bir lahzada kelsa ham Database ikkinchisini yozdirmaydi.
- Xato izohlari (≤60):
  - A: Har telefon faqat o'zini biladi — boshqasini ko'rmaydi.
  - C: Umami hodisani sanaydi, bandni to'xtatmaydi.
  - D: Ega ro'yxatni keyin ko'radi — o'shanda ikkalasi yozilgan.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Tushuncha 2 — ega sahifasi  ← QTushuncha
- Eyebrow: Tushuncha · ega sahifasi
- Sarlavha: **O'yinchilarning telefon raqamini kim ko'ra oladi?** (49)
- Mentor: Ism va telefon `bandlar` jadvalida turadi, o'yinchi sahifasiga esa faqat soat va holat boradi. Ega sahifasiga uch xil kirib ko'ring.
- Bashorat (ballsiz, 181): **Ega sahifasi manzilini bilgan odam bandlar ro'yxatini ko'radimi?** · Ha, manzil yetadi · Yo'q, yana nimadir kerak
- Vizual: «Maydon» xaritasining o'rta va o'ng qismi — brauzer `localhost:5173/ega` (parol qatori, ro'yxat joyi bo'sh); Backend qutisida `POST /kirish` va
  `GET /bandlar` (qulf); Database `bandlar` — uch qator (17:00, 18:00, 20:00); chetda o'yinchi telefoni — `GET /vaqtlar` javobi: `18:00 · band`.
- **Harakat → Vizual o'zgarish** (uch tugma: «Parolsiz», «Noto'g'ri parol», «To'g'ri parol»):
  - Parolsiz → sahifa `GET /bandlar` ga tokensiz so'rov yuboradi → qulf qizil yonadi → javob `401` → sahifada «Avval parolni kiriting», ro'yxat bo'sh qoladi.
  - Noto'g'ri parol → `POST /kirish` → Backend parolni `.env` dagi `EGA_PAROLI` bilan solishtiradi → mos emas, qizil → `401` → «Parol noto'g'ri».
  - To'g'ri parol → `POST /kirish` → token konvertda sahifaga qaytadi → `GET /bandlar` + token → qulf yashil ochiladi → Database'dan uch qator →
    ro'yxatga `soat · ism · telefon` qatorlari ajralib kiradi.
  - 3/3 da o'yinchi telefonidagi `18:00 · band` qatori bir lahza yonadi — unda ism ham, telefon ham yo'q.
- Natija qatori: «Taxminingiz: ... · haqiqatda: manzil yetmadi — ro'yxat faqat token bilan keldi».
- Xulosa: Ega sahifasi manzili sir emas. Ro'yxatni Backend faqat token bilan beradi, parol `.env` da turadi. (96)
- Tugma (pastki): Uch xil kiring (N/3) → Davom etish
- Tugagach (199): harakat paneli yopiladi, xarita butun enga; `GET /bandlar` qulfi fokusda.

## A2 · Amaliyot 2 — ega sahifasi  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 2 · ega sahifasi
- Sarlavha: **Bandlar ro'yxati faqat maydon egasiga ochilsin.** (47)
- Mentor: Parolni talabga yozmaysiz — u faqat `.env` da turadi. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — `backend/.env` ga ikki qator qo'shing: `EGA_PAROLI=` (o'zingiz o'ylagan parol) va `JWT_SECRET=` (tokenni imzolaydigan uzun tasodifiy qator). Ikkala terminal ishlab tursin.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytda yangi `/ega` sahifasi; Backend'da `POST /kirish` va `GET /bandlar`.
     > Nima qilsin: `POST /kirish` parolni `.env` dagi `EGA_PAROLI` bilan solishtirsin, to'g'ri bo'lsa token bersin; `/ega` sahifasi **{egaga nima ko'rinsin}** ko'rsatsin.
     > Nima buzilmasin: `GET /bandlar` tokensiz javob bermasin. Parol va `JWT_SECRET` kodda ham, repo'da ham bo'lmasin. **{o'yinchi sahifasida nima ko'rinmasin}**.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Backend yangi `.env` qatorini o'qishi uchun uni qayta ishga tushiring: Ctrl+C, keyin `npm run start:dev`.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — `localhost:5173/ega`: avval noto'g'ri parol — «Parol noto'g'ri»; keyin to'g'risi — shanba ro'yxatida 19:00 va sizning ismingiz.
     Brauzerda `localhost:3000/bandlar` ni oching — ro'yxat emas, `401` chiqsin.
  5. **O'z g'oyangiz** — MVP'ingizda faqat bir kishi ko'radigan ma'lumot bormi? Bor bo'lsa, shu talabni unga yozing; yo'q bo'lsa, «Bajardim»ni bosing.
- O'ng tomon — «Kutilgan natija (namuna: «Maydon»)»: brauzer `localhost:5173/ega` — «Shanba · bandlar»: `19:00 · Jasur · +998 90 123 45 67`;
  ostida ikkinchi brauzer qatori `localhost:3000/bandlar` → `{"statusCode":401,"message":"Unauthorized"}`.
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 5/5 da panel yopiladi, o'ngdagi ega sahifasi fokusga, ro'yxat qatori ajralib kiradi (199).
- Hammasi bajarilgach (yashil): Ro'yxat faqat egada: token bilan ochiladi, tokensiz — `401`. (58)
- Qator (`QIzoh`, natija ostida; audit): Bu — bitta egali MVP uchun sodda kirish. Ko'p foydalanuvchili mahsulotda kirish boshqacha quriladi. (99)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-09-done` (parolni `.env` ga o'zingiz yozasiz)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 5 · 2-savol ✅ (jonli ball)  ← QTest · kalit **C**
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Ega sahifasi kodini kimdir GitHub'da o'qidi. Bandlar ro'yxatini ocha oladimi?** (`h-ask`, ikki qism, 10 so'z — S-001)
  - Ha — sahifa kodida token ham yozilgan
  - Ha — kodda `GET /bandlar` manzili bor
  - ✔ Yo'q — tokensiz `GET /bandlar` 401 qaytaradi
  - Yo'q — `.env` fayli kodni yashirib turadi
- To'g'ri izohi: Kodni o'qish yetmaydi: Backend ro'yxatni faqat to'g'ri token bilan beradi.
- Xato izohlari (≤60):
  - A: Token kodda turmaydi — u kirgandan keyin beriladi.
  - B: Manzilni bilish yetmaydi — tokensiz `401` qaytadi.
  - D: `.env` parol kabi qiymatlarni saqlaydi, kodni emas.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## A3 · Amaliyot 3 — deploy  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 3 · deploy
- Sarlavha: **«Maydon»ni internetga chiqaring, telefondan oching.** (51)
- Mentor: `localhost` faqat sizning laptopingizda ochiladi, boshqa odamning telefonida emas. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — avval `git push`. render.com → «New → Web Service» → `maydon` repo'ngiz; Root Directory — `backend`, tarif **Free**.
     «Environment» bo'limiga `DATABASE_URL`, `EGA_PAROLI` va `JWT_SECRET` — qiymatlari `.env` dan. «Deploy Web Service» — tayyor bo'lgach manzil chiqadi: `....onrender.com`.
  2. **Prompt** — Render manzilini yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytdagi Backend manzili va Backend'ning ruxsat ro'yxati (CORS).
     > Nima qilsin: sayt Backend manzilini `VITE_API_URL` dan olsin (laptopda `http://localhost:3000`, Netlify'da **{Render manzilingiz}**);
     > Backend `localhost:5173` dan va `WEB_ORIGIN` dagi Netlify manzilidan kelgan so'rovga ruxsat bersin.
     > Nima buzilmasin: sayt Netlify'da turganda `/ega` sahifasi to'g'ridan ochilsa ham ishlasin.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — app.netlify.com → yangi loyiha → GitHub'dan import → o'z `maydon` repo'ngiz. Base directory `web`, build `npm run build`,
     publish `dist` (base'ga nisbatan); sozlamada `VITE_API_URL` (Render manzili) va `VITE_UMAMI_ID`. Netlify manzilini Render'da `WEB_ORIGIN` ga yozing. Havola chiqadi: `....netlify.app`; keyin har push'da sayt o'zi yangilanadi. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefonda `....netlify.app` ni oching: shanba 21:00 ni band qiling, keyin `/ega` da parol bilan kirib, bandni ko'ring.
     Umami'da uch qadam: sahifa ochildi → `vaqt-tanladi` → `band-qildi`. Bepul Backend 15 daqiqa ishlatilmasa uxlab qolishi mumkin — keyingi birinchi so'rov sekinroq javob beradi.
  5. **O'z g'oyangiz** — shu talabni o'z MVP'ingizga yozing: Render manzili o'rniga o'zingizniki. Uyda o'z loyihangizni ham shu yo'l bilan chiqarasiz.
- O'ng tomon — «Kutilgan natija (namuna: «Maydon»)»: telefon maketi `maydon-....netlify.app` — Shanba · 21:00 band · «Band qilindi»;
  ostida Umami'dagi uch qadam: sahifa ochildi 1 → `vaqt-tanladi` 1 → `band-qildi` 1.
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 5/5 da panel yopiladi, telefon maketi fokusga, Umami sonlari navbat bilan yonadi (199).
- Hammasi bajarilgach (yashil): «Maydon» internetda: telefondan band qilinadi, ega ro'yxatni parol bilan ko'radi. (81)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-09-done` (Render manzilini o'zingiznikiga almashtiring) ·
  bepul Render 15 daqiqa jimlikdan keyin uxlaydi, so'rov kelganda uyg'onadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 1 — Bo'sh katakni kim tekshiradi · 2 — Parol qayerda turadi

## 7 · Yakun  ← QYakun (+ QKartochka)
- Eyebrow: Loyiha kuni · yakun
- Belgi: ✓ MVP internetda
- Sarlavha: **MVP tayyor: boshqa odam ishlata oladi.** (37)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Biz belgilagan shu MVP versiyasi «qilamiz» qutisidagi funksiyalar ishlaganda tayyor bo'ladi.
  - Backend avval tekshiradi, Database esa bir katakni ikki marta yozdirmaydi.
  - Hodisa harakat haqiqatan saqlangandan keyin yoziladi.
  - Shaxsiy ma'lumotni Backend faqat token bilan beradi; parol va sirlar `.env` da turadi.
- Kartochkalar (shu ekranda, `QKartochka`; eyebrow «Takrorlash») — pastdagi jadval.
- Uyga vazifa — **yo'q** (172.4): ish repo'da; o'z MVP'ingiz har blokning 5-qadamidagi talablar bilan davom etadi (ekranda alohida blok yo'q).
- Keyingi dars — PM: **Odam ilovangizda qayerda to'xtab qoladi?** MVP'ni boshqa odam ishlatadi, siz esa tushuntirmasdan kuzatasiz.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

### Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Shu MVP versiyasi qachon tayyor? | «Qilamiz» qutisidagi funksiyalar ishlaganda | To'lov va jamoa yig'ish — «keyin» qutisida |
| Bo'sh katak bosilganda band qayerga ketadi? | `POST /bandlar` ga | Backend uni `bandlar` jadvaliga yozadi |
| Bo'sh katakni kim tekshiradi? | Backend | Telefondagi sahifa eskirgan bo'lishi mumkin |
| Katak band bo'lsa, Backend nima qaytaradi? | «Bu vaqt band» | Ikkinchi band jadvalga yozilmaydi |
| `band-qildi` hodisasi qachon yoziladi? | Band saqlangandan keyin | Rad etilgan urinish sanalmaydi |
| Umami qaysi uch qadamni sanaydi? | Ochdi → vaqtni tanladi → band qildi | Oxirgi qadam bugun qo'shildi |
| Ega parolni kiritsa, Backend nima beradi? | Token | `POST /kirish` — parol to'g'ri bo'lsa |
| `GET /bandlar` tokensiz nima qaytaradi? | `401` | Ro'yxat faqat egaga ochiladi |
| O'yinchi sahifasida bandlar haqida nima ko'rinadi? | Soat va holat | Ism va telefon — faqat ega sahifasida |
| Ega paroli qayerda turadi? | `.env` va Render'da | Kodda ham, GitHub'da ham emas |
| Talab qaysi uch qismdan iborat? | Qayerda · nima qilsin · nima buzilmasin | Oxirida: «Boshqa joyga tegma» |
| MVP'ni internetga chiqarish nima deyiladi? | Deploy | Bizda: Backend — Render, sayt — Netlify |

---

## Nishonlar (3)
- **One Booking** — Bitta katakka bitta band yozilishini topdingiz (3-ekran, 1-savol)
- **Safe Password** — Parol kodda emas, `.env` da turishini topdingiz (5-ekran, 2-savol)
- **MVP Live** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «Bo'sh katakni Backend tekshiradi»
   - `POST /bandlar` · Band yo'li — Sayt bandni Backend'ga yuboradi, Backend uni Database'ga yozadi.
   - `409 · Bu vaqt band` · Rad javobi — Katak band bo'lsa, ikkinchi band yozilmaydi.
   - `band-qildi` · Hodisa — Band saqlangandan keyin Umami'ga yoziladi.
   - Sinfga savol: Nega telefondagi katak rangiga qarab tekshirib bo'lmaydi?
2. 2-savol (5-ekran) — «Parol `.env` da, ro'yxat token bilan»
   - `POST /kirish` · Kirish — Parol to'g'ri bo'lsa, Backend token beradi.
   - `GET /bandlar` · Qulf — Tokensiz so'rovga `401` qaytadi.
   - `EGA_PAROLI=...` · Parol joyi — `.env` da turadi: kodda ham, GitHub'da ham emas.
   - Sinfga savol: Ega sahifasi kodini o'qigan odam ro'yxatni ocha oladimi?

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
1. MVP qachon tayyor deyiladi? ✔ «Qilamiz» qutisidagi funksiyalar ishlaganda · «Keyin» qutisidagi funksiyalar ham qo'shilganda · Har bir tugma va rang mukammal bo'lganda · Birinchi o'yinchi pul to'lab bo'lganda
2. Agent «To'lovni ham qo'shaymi?» desa, nima deysiz? Ha — o'yinchiga qulayroq bo'ladi · ✔ Yo'q — to'lov «keyin» qutisida · Ha — to'lovsiz band qilib bo'lmaydi · Yo'q — to'lov «qilmaymiz» qutisida
3. Bo'sh katakni band qilishdan oldin kim tekshiradi? Sayt — telefondagi katak rangiga qarab · Umami — `vaqt-tanladi` soniga qarab · ✔ Backend — Database'dagi bandlarga qarab · Maydon egasi — bandlar ro'yxatiga qarab
4. Katak band bo'lsa, `POST /bandlar` nima qiladi? Ikkinchi bandni ham jadvalga yozadi · Eski bandni o'chirib, yangisini yozadi · Ikkala o'yinchiga «Band qilindi» deydi · ✔ «Bu vaqt band» deb, bandni yozmaydi
5. `band-qildi` hodisasi qachon yoziladi? ✔ Band Database'ga saqlangandan keyin · «Band qilish» tugmasi bosilishi bilan · Sahifa birinchi marta ochilganda · Maydon egasi ro'yxatni ochganda
6. O'yinchi sahifasida bandlar haqida nima ko'rinadi? Har bandning ismi va telefoni · ✔ Har katakning soati va holati · Ega paroli va kirish tokeni · Hamma o'yinchining telefon raqami
7. `GET /bandlar` ga tokensiz so'rov kelsa, nima bo'ladi? Ro'yxatni to'liq qaytaradi · Faqat ismlarni qaytaradi · ✔ `401` qaytaradi, ro'yxat bermaydi · Ega sahifasini o'zi ochadi
8. Maydon egasining paroli qayerda turadi? Saytning kodida, tugma yonida · GitHub'dagi README faylida · Talab matnida, agentga berilib · ✔ `.env` da va Render sozlamasida
9. Talab qaysi uch qismdan iborat? ✔ Qayerda · nima qilsin · nima buzilmasin · Kim · qachon · qancha vaqt oladi · Muammo · yechim · foydalanuvchi · Rang · shrift · animatsiya turi
10. Talabdagi «nima buzilmasin» qatoriga nima yoziladi? Yangi qo'shiladigan funksiya · ✔ O'zgarmay qolishi kerak bo'lgan ish · Terminalda chiqqan xato matni · Ertaga qilinadigan ishlar rejasi
11. MVP nega internetga chiqariladi? Laptopda tezroq ishlashi uchun · Kodi qisqaroq bo'lishi uchun · ✔ Boshqa odam telefonda ochishi uchun · Umami hodisalarni yozishi uchun
12. Bepul Render'da birinchi javob nega kechikadi? Neon Database'da joy tugab qolgan · Sayt kodi juda katta bo'lib ketgan · Netlify havolasi eskirib qolgan · ✔ Jimlikdan keyin Backend uyg'onadi

**Fon so'zlari** (R-008; kodda {uz, ru}): arena — sayt · Backend · Database · vaqt katagi · band · token · `.env` · deploy · hodisa · talab · MVP · Umami
(o'yin qatlami belgilari qoladi) · uyga vazifa banneri yo'q (172.4).

---

## KOD — razrabotkada qilinadigan narsalar (qolipda yo'q yoki darsga xos)
1. `SCREEN_META` 11: hook · plan · concept · practice · test · concept · practice · test · practice · stats · summary. `INLINE_KEYS` 2: 3-ekran **1** (B) · 5-ekran **2** (C).
   `RECAPS`, `Q_LABELS`, `ACH_TRIGGERS` — shu indekslar bilan (S-025).
2. **«Maydon» xaritasi** — darsning bitta vizuali: `MAYDON` const (kataklar, to'rt yo'l, `bandlar` jadvali, ega ro'yxati, Umami'dagi uch qadam, MVP ro'yxati qatori) → `MaydonXarita`.
   4-dars kodi bor bo'lsa, sxema o'shandan olinadi (bitta manba — 180). `// qolip-maket:` e'loni. Holat o'quvchi bosishidan chiziladi (P-046).
3. **Tushuncha 1:** ikki telefon maketi (bitta komponent, ikki nusxa) + `POST /bandlar` tekshiruvi + `409` + Umami hisoblagichi; «eski holat» yorlig'i.
4. **Tushuncha 2:** brauzer `/ega` maketi + `POST /kirish` / `GET /bandlar` qulfi; uch tugma (Parolsiz · Noto'g'ri parol · To'g'ri parol); o'yinchi telefonidagi `GET /vaqtlar` qatori.
5. **Amaliyot bloki A1–A3:** skelet `ScreenBlok` + `QBlok`, **5 qadam** (4 + «O'z g'oyangiz», qaror 8) — `steps.length` 5 bilan ishlashi, «5/5» va qulf tekshiriladi.
   Kutilgan natija maketlari: A1 — ikki brauzer oynasi + jadval-karta · A2 — ega sahifasi + `401` qatori · A3 — telefon maketi + Umami'dagi uch qadam.
   «Ortda qoldingizmi»: A1 `dars-08-done`, A2 va A3 `dars-09-done` (skelet qoidasi: birinchi blok — boshlanish holati, keyingilari — tayyor).
   `git fetch <maydon repo> --tags` qatori — repo manzili ma'lum bo'lgach (TAYANCHGA SAVOL 5).
6. Ekran turlari: 0 `QKirish` (maket + radio) · 1 `QReja` · 2, 4 `QTushuncha` (`zoom`, `tugadi`, `QBashorat`, `QTaxmin`) · 3, 5 `QTest` · 7 `QYakun` + `QKartochka`.
7. `QYakun` **`uyga` siz** (172.4) — qolip bo'sh `uyga` bilan to'g'ri chizishini tekshirish; bo'lmasa qolipga kichik shart (KOD, asosiy seans).
8. Nishonlar 3 (`ACHIEVEMENTS`): One Booking (3-ekran) · Safe Password (5-ekran) · MVP Live (A3 oxirgi «Bajardim», bonus).
9. `QUIZ_BANK` 12 — shu MD'dan; ✔ 3/3/3/3 (q23). `FLASHCARDS` 12; `QZ_BG_SHAPES` so'zlari {uz, ru}.
10. App.jsx `m7-09` qatoriga `comp: MvpCompleteLesson` — «qur» bosqichida (asosiy seans).
11. `narrow` faqat 3, 5, 6-ekranlarda (171).
12. Darvozalar: `npm run gates -- src/7-Modull/MvpCompleteLesson.jsx` 12/12 · `lint:olchov` 0 warn · `lint:emoji` (qolip) 0 · `lint:jsx` 0 · surat 1280 + 390.
13. ru — uz tasdiqlangach, bir yo'la (6-RU).

## REPO — `maydon` ga nima qo'shiladi (`dars-08-done` → `dars-09-done`)
1. **Boshlanish = `dars-08-done`:** kataklar `GET /vaqtlar` dan, kun almashtiriladi, uch animatsiya, `vaqt-tanladi` hodisasi, bitta tanlangan namuna.
2. **A1:** `POST /bandlar` (`kun`, `soat`, `ism`, `telefon`) → `bandlar`; o'sha kun va soat band bo'lsa `409` «Bu vaqt band» va yozilmaydi (Backend tekshiradi;
   jadvalda `kun + soat` noyob — ikki so'rov bir lahzada kelsa ham); saytda katak bosilganda forma (ism, telefon) + «Band qilish»; javob kelgach kataklar yangilanadi,
   «Band qilindi» (5-dars elementi); faqat muvaffaqiyatda `band-qildi` hodisasi; rad bo'lsa xabar va kataklar yangilanadi.
3. **A2:** `backend/.env` — `EGA_PAROLI`, `JWT_SECRET` (`.env.example` da bo'sh qatorlar); `POST /kirish` → token; `GET /bandlar?kun=` faqat token bilan, aks holda `401`;
   saytda `/ega` sahifasi (parol, kun bo'yicha `soat · ism · telefon`); `GET /vaqtlar` javobida ism va telefon yo'qligi tekshiriladi.
4. **A3:** `backend/` Render uchun tayyor (Dockerfile yoki build/start buyruqlari — TAYANCHGA SAVOL 6); saytda Backend manzili `VITE_API_URL` da
   (`web/.env` — `http://localhost:3000`, Netlify — Render manzili); Backend CORS: `localhost:5173` + `WEB_ORIGIN` (Render Environment); `web/public/_redirects` (`/* /index.html 200`) — `/ega` Netlify'da to'g'ridan ochiladi;
   README «Internetga chiqarish» bo'limi (Render: `DATABASE_URL`, `EGA_PAROLI`, `JWT_SECRET`, `WEB_ORIGIN` · Netlify: base `web`, publish `dist`, `VITE_API_URL`, `VITE_UMAMI_ID`).
5. Teg `dars-09-done` — A1–A3 oxiri (shu MD'dagi «Maydon» namunasi); MD tasdiqlangach yoziladi, push — buyruq bilan.

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim, tasdiq kerak)
1. **Deploy xizmatlari** — GATE M M-q7: Backend — Render, sayt — Netlify, ikkalasi GitHub'dan (push → o'zi yangilanadi). Netlify tugma nomlari «qur» da tekshiriladi.
   10-darsda boshqa odam MVP'ni o'z telefonida ochishi uchun sayt ham internetda bo'lishi kerak. Yangi xizmat yo'q. 4-dars sxemasidagi deploy tugunlari bilan bir xil bo'lsin.
2. **Nomlar:** parol o'zgaruvchisi `EGA_PAROLI`, ega sahifasi yo'li `/ega`, rad javobi `409 · Bu vaqt band` — o'zim qo'ydim. 4-dars (kirish sxemasi) va 11-dars bilan bir xil bo'lishi kerak.
3. **`kun` formati** — GATE M K2: sana (`2026-10-10`), ekranda «Shanba».
4. **`dars-09-start` tegi yo'q:** A1 «ortda» — `dars-08-done`, A2 va A3 — `dars-09-done` (skelet `ScreenBlok` izohi bo'yicha).
5. **O'quvchi `maydon` ni o'z GitHub'iga oladimi (fork, 4-dars)?** A3 1-qadam (`git push`, Render o'z repo'sidan) shunga tayanadi. Repo manzili (`git fetch ... --tags` qatori uchun).
6. **Render uchun `backend/`:** Dockerfile 4-dars skeletida bormi yoki 9-darsda qo'shiladimi; Root Directory `backend`. `.env` joyi — `backend/.env` deb yozildi.
7. **Talab ko'rinishi** — uch yorliqli qator («Qayerda» / «Nima qilsin» / «Nima buzilmasin») + «Boshqa joyga tegma, o'zgargan fayllarni ayt.» — 7 va 11-dars bilan bir xil bo'lsin.
8. **«O'z g'oyangiz» qadami** — o'quvchi talabni qayerga yozadi (o'z repo'sidagi fayl nomi)? Boshqa darslarga tegadigan nom o'ylab topmadim — MD'da joy aytilmagan.
9. **Namuna ma'lumot:** jadval qatorlaridagi ism va telefon (`Jasur`, `Bekzod`, `+998 90 123 45 67`) — qahramon emas, ma'lumot qatori. Ruxsat bormi yoki ismsiz namuna kerakmi.
10. **10-darsda qaysi MVP sinaladi** — «Maydon» (Mentor misoli, sinov vazifasi «Shanba 18:00») yoki o'quvchining o'z MVP'si? «Keyingi dars» qatori neytral yozildi.
11. **Umami:** sayt internetga chiqqanda 6-darsdagi o'sha Umami sayti ishlatiladimi yoki domen qo'shiladimi (6-dars sozlamasiga bog'liq).
12. **MVP ro'yxati nomlari** — «MVP ro'yxati» va «qilamiz / keyin / qilmaymiz» «qutisi» — 3-dars bilan bir xil bo'lsin.

## Shubhali joylar (ishonchim komil emas)
- Render forma yozuvi «Root Directory» — 5-Modulda ishlatilmagan; Render hujjatida tekshirish kerak (§182: UI-yozuv taxmin qilinmaydi).
- 0-ekran hook: «Qilamiz» so'zi faqat 2-variantda — sof so'rovnoma bo'lgani uchun qoldirildi; ko'rikda shakl belgisi bo'lib tuyulsa, variantlar qayta yoziladi.
- 5-ekran B-varianti («kodda `GET /bandlar` manzili bor») — o'zi rost fakt; yanglish tasavvur «manzil yetadi» ekanini izoh aytadi (S-004 chegarasida).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (`m7-08` «Yaxshi interfeysdan nimani olasiz?» · `m7-10` «Odam ilovangizda qayerda to'xtab qoladi?»; `m7-09` «Loyiha kuni: MVP tayyor»)
- [x] Bitta misol-ip («Maydon», tayanch 1) · metafora yo'q · bitta vizual dars bo'yi — «Maydon» xaritasi (0, 1, 2, 4, A1–A3)
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» (2 — ikki telefon, 4 — uch kirish; hook, reja va bloklarda ham) — matn-karta yo'q
- [x] Sarlavhalar 39–51 (≤55), bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosalar 58–96 · hook javoblari ≤120 · xato izohlari ≤60
  (test savollari `h-ask`, sarlavha emas — S-001 bo'yicha 10 so'z) — sonlar skript bilan sanaldi, yakuniy hukm `lint:olchov` da
- [x] Atamalar tayanch 2 bilan bir xil (sayt · Backend · Database · vaqt katagi · band · hodisa · talab); «server / baza / slot / bron / sinov» yo'q; token va deploy — 4 va 1-Modul ta'rifi ·
  siz-forma; ip va zanjir ot-shaklda; prompt sen-formada (T-002)
- [x] Testlar: variantlar bir shaklda («Qism — qanday» · «Ha/Yo'q — sabab», Ha va Yo'q 2/2), uzunligi yaqin; kalit so'z faqat to'g'rida emas
  (1-savolda «Database» B va D da · 2-savolda `.env` C va D da, «token» A da) · ✔ o'rni yangi dars uchun belgilandi: B va C
- [x] Final DnD yo'q (172 qolipi) — uya izohi masalasi yo'q; arena tartib-savolisiz
- [x] Emoji yo'q (arena, nishon medali — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — yo'q; «faqat» — Backend qoidasi, kafolat emas)
- [x] Ichki kodlar o'quvchi matnida yo'q («1-Modulda», «8-darsda» — modul raqamisiz o'quvchi tilida) · tarixiy voqea / real raqam yo'q · «KOD» (13) va «REPO» (5) ro'yxati to'liq
- [x] Karta T · P · S ko'rildi: T-002 (prompt sen-forma) · T-011 (deploy/token — o'tilgan, qayta ta'riflanmadi) · T-014/T-015 («maydon», «band», «katak», «sinov» bir ma'noda) ·
  T-039 (o'quvchi MVP'si «sizning g'oyangiz» — 5-qadamda) · T-047 (Mentor ekranni ta'riflamaydi) · T-064 (dars ekrani «sahifa» deb atalmadi; sahifa — saytniki) ·
  P-001 (bitta ip) · P-015 (reja teglarsiz, App.jsx `sub` bilan mos) · P-026/P-028 (tashqi qadamlarda xato yo'li bitta gap; Render/Netlify yo'li 5 va 1-Modulda o'tilgan) ·
  P-036 (Mentor javobni aytmaydi; qavslar javobi — tushunchada) · P-046 (vizual holat bosishdan) · P-052/P-067 (bitta vizual, harakat) · P-059 (blok 4 qadam + qaror 8 qadami) ·
  P-062 (son bir marta) · P-064 (bashorat 2, 4) · S-001/S-004/S-006/S-010 (savol qisqa, har xato alohida tasavvur, Ha/Yo'q teng, izoh javobni aytmaydi) · S-026 (recap — kod qatori) ·
  P-025 — qo'llanmaydi (uyga vazifa yo'q, 172.4)
- [ ] (ochiq) TAYANCHGA SAVOL 1, 2, 5, 6 — deploy yo'li va nomlar 4/7/11-dars MD'lari bilan solishtirilmagan (ular parallel yozilmoqda); asosiy seans bitta jadvalda tekshiradi
- [ ] (ochiq) Sarlavha/Mentor uzunligi kodda `lint:olchov` bilan o'lchanadi; ru — 6-RU bosqichida

---

# 9-Modul · 10-dars (PM) «Odam ilovangizda qayerda to'xtab qoladi?» — MD v3

Fayl: `src/7-Modull/PmUsabilityTestLesson.jsx` · kalit `m7-10` · 16 ekran (yangi dars — hamma ekran noldan) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi.
⚠️ Ballik testlar va to'g'ri javob o'rni: s3 = 2-variant (`correctIdx 1`), s5 = 4 (`3`), s7 = 1 (`0`), s11 = 3 (`2`) — `INLINE_KEYS` shu bilan quriladi; arena ✔ — A/B/C/D har biri 3 marta.
Oldingi dars: m7-09 «Loyiha kuni: MVP tayyor» · keyingi: m7-11 «Loyiha kuni: sinovdan keyingi tuzatish» (App.jsx 317-qator: menyu nomi = dars nomi, `sub` «sinov: tushuntirmang, kuzating»).
Tur (PM-005): **2-tur, sof PM** — artefakt yozma: sinov vazifasi + kuzatuv yozuvi; o'quvchi o'z artefaktini yozadi (s8, s12). Kod ekrani (s10) — PM tartibidagi koding (P-011), repo'ga tegmaydi.

---

Tashqi audit (ChatGPT) Filtri: `10-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi

1. **Bosh qoida (ta'rif dars bo'yi so'zma-so'z bir xil, T-042):** «Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.»
   Ekranlarda bo'laklab ochiladi: s2 — kuzatish va yozish · s4 — yordam bermaslik · s6/s7 — vazifa · s11 — to'rttasi birga.
2. **Atamalar (bir ma'no — bir so'z, tayanch 2-bo'lim):**

| So'z | Ma'nosi (darsdagi ta'rif) | Ishlatilmaydi |
|---|---|---|
| **sinov** | real odam saytni o'zi ishlatadi, siz kuzatasiz | «usability test» — faqat 1-kartochka izohida, bir marta · «test qilish», «sinab ko'rish» (sinov ma'nosida) |
| **sinov vazifasi** | odamga beriladigan bitta gap: u nimaga erishsin («Shanba kuni soat 18:00 ga maydon band qiling.») | topshiriq, ssenariy |
| **to'xtash** · to'xtadi | odam keyingi qadamni topishda qiynalgan joy: jim qolishi, uzoq qidirishi yoki noto'g'ri joyni bosishi mumkin (audit 1) | qotib qoldi, adashdi (sarlavhada) |
| **kuzatuv yozuvi** | sinovda odam nima qilgani va qayerda to'xtagani — vaqti bilan | varaq, hisobot, protokol |
| **muammo** | to'xtashning ortidagi sabab (s9 da yozuvdan chiqariladi) | bug, nuqson |
| intervyu · yozuv | 2-darsdagidek: bitta odam bilan suhbat; yozuv — shablonga yozilgani | suhbat varag'i |
| sayt · vaqt katagi · band qilish · o'yinchi · maydon egasi | tayanchdagidek | ilova (faqat dars nomida — App.jsx), slot, bron, mijoz, admin |

   - «Maydon» — faqat futbol maydoni va mahsulot nomi. Forma qatorlari «ism va telefon yoziladigan joy» deyiladi — **«maydon» so'zi forma ma'nosida ishlatilmaydi** (T-015).
   - «Taxmin» — faqat ballsiz bashorat (`QTaxmin`); test izohlarida «fikringiz», «xulosangiz».
3. **Avval misol, keyin atama (PM-030):** s2 da o'quvchi o'yinchini kuzatib, uchta to'xtashni o'zi yozadi — shundan keyin varaq «Kuzatuv yozuvi», sahna «Sinov» nomini oladi.
4. **Fakt va muammo ajratiladi:** yozuvga — ko'rilgan harakat (s2, s3, s12); muammo — yozuvdan keyin (s9). 2-darsdagi «eshitgan javob — u aytganidek» qoidasining sinovdagi juftligi: «ko'rgan harakat — u qilganidek».
5. **O'tilgan darslarga ko'priklar (takror, yangi mavzu emas):**
   - 2-dars intervyu (bo'lib o'tgan ishni so'rash) → bugun so'ramaysiz, kuzatasiz (s2 Mentor, 2-kartochka, arena 2).
   - AvtoPizza botida «qayerda to'xtab qoldingiz?» deb so'ragansiz (m5-09) → bugun to'xtashni o'zingiz ko'rasiz (s2 O'qituvchi eslatmasi).
   - AvtoStoyanka (m4-14): o'z ishingizdagi kamchilikni o'zingiz ko'rmaysiz → s1 Mentor (nega boshqa odam kerak).
   - 9-dars: MVP tayyor va deploy qilingan → bugun uni birinchi marta boshqa odam ishlatadi.
6. **Toza yuza (185):** tugma, variant, karta, yorliq, recap'da emoji yo'q. Belgilar ✓ ✗ → ‹ › — ruxsat. O'yin qatlami (arena, nishon, podium) — mustasno.
7. **Keys — haqiqiy voqea, manba bilan (s6):** «300 million dollarlik tugma» — Jared M. Spool, «The $300 Million Button», 14.01.2009,
   https://articles.centercentre.com/three_hund_million_button/ (05.10.2026 ochib tekshirildi: forma «Email Address, Password, Login, Register, Forgot Password»;
   sinovda odamlarga xarid ro'yxati va pul berilgan, vazifa — xaridni oxiriga yetkazish; yangi xaridorlar ro'yxatdan o'tishni xohlamagan, iqtibos
   «I'm not here to enter into a relationship. I just want to buy something.»; oldin kelganlarning ko'pi parolni eslay olmagan; tuzatish — «Register» o'rniga «Continue» va
   «You do not need to create an account to make purchases on our site.»; natija — xaridorlar 45% ko'paygan, birinchi oy +15 mln $, birinchi yil +300 mln $). Magazin nomi maqolada aytilmagan.

## Darsning ipi va bitta vizual

- **Ip:** 9-darsda tayyor bo'lgan «Maydon» (repo `maydon`, teg `dars-09-done`) birinchi marta boshqa odam qo'lida. Mentor sinov o'tkazgan — bitta o'yinchi, bitta vazifa:
  **«Shanba kuni soat 18:00 ga maydon band qiling.»** O'quvchi shu sinovni kuzatadi (s2) → yordam bersa nima bo'lishini ko'radi (s4) → yozuvdan uch muammo chiqarib, birinchi
  tuzatiladiganini o'zi tanlaydi (s9; 11-dars shu tanlov bilan boshlanadi) → o'z saytiga vazifa yozadi (s8) → sinfdoshi bilan juftlikda sinov o'tkazadi (s12) → uyda real odam bilan (uyga vazifa).
- **Mentor sinovi — bitta manba (`SINOV`, 180):** s0, s2, s4, s9, s10 shundan o'qiydi. Vaqtlar sinov boshidan (m:ss):

| Vaqt | O'yinchi nima qildi | Telefonda | To'xtash? |
|---|---|---|---|
| 0:00 | Saytni ochdi | «‹ Bugun ›» (kichik strelkalar), 16:00–21:00 kataklari | — |
| 0:00–0:25 | Bugungi kataklarni tepaga-pastga surib, shanbani qidirdi | barmoq halqasi kataklar ustida aylanadi | **ha** (25 s) |
| 0:25 | «›» ni bosib, shanbaga o'tdi | sarlavha «‹ Shanba ›» | — |
| 0:29 | 18:00 katagini bosdi | ostida ism va telefon yoziladigan joy ochiladi | — |
| 0:41 | Ism va telefonni yozdi | «Band qilish» tugmasi forma ostida — telefon ekranidan pastda, ko'rinmaydi | — |
| 0:41–1:43 | Tugmani qidirdi. 1:10 da so'radi: «Qanday yuboriladi?» Mentor: «O'zingiz qanday deb o'ylaysiz?» 1:43 da ekranni tasodifan surib, tugmani ko'rdi va bosdi | halqa forma ustida aylanadi; 1:43 da ekran suriladi | **ha** (62 s) |
| 1:43–2:01 | «Band qilindi» belgisi chiqib, yo'qoldi; 18 soniya qarab turdi, katakni yana bosdi: «Bo'ldimi?» | katak rangi o'zgaradi, belgi chiqib ketadi | **ha** (18 s) |

  Yozuvdan chiqadigan uch muammo (tayanch 3-bo'lim oxiri — **aynan shu uchtasi**, s9): kunni almashtirishni sezmadi · «Band qilish» tugmasini topa olmadi — u forma ostida,
  ko'rinmaydi · band bo'lgandan keyin nima bo'lganini tushunmadi. Birinchi tuzatiladigani (11-dars, `dars-11-done`) — **tugma**: usiz vazifa bajarilmaydi.
- **Bitta vizual — Sinov sahnasi (`SinovSahna`, dars bo'yi):** chapda telefon ramkasi (191) — «Maydon» sayti; ustida o'yinchining **barmoq halqasi** (CSS doira, emoji emas) va tepada
  **vaqt hisoblagichi** (m:ss). O'ngda **yozuv** — oq karta: tepada «Vazifa: «…»», ostida qatorlar «vaqt · nima qildi».
  - Qator holatlari: bo'sh (kulrang uzuq chiziq — skelet) → yozildi (bir lahza ajralib kiradi) → to'xtash (accent chegara, o'ngda yorliq «to'xtadi») →
    yozilmadi (kulrang, chizilgan — s4) → birinchi (yorliq «Birinchi» — s9, s12) → xato (`err` fon — s8, s12 tekshiruvi).
  - Halqa holatlari: harakatda — joydan joyga silliq o'tadi · to'xtashda — bir joyda sokin aylanadi, hisoblagich accent rangda · pufaklar: o'yinchi (chapda), siz (o'ngda).
  - Ishlatiladi: 0 · 1 · 2 · 4 · 8 · 9 · 12. s6 — o'z keys-maketi (`FormaMaket`, PM-029). Hammasi `prefers-reduced-motion` da o'tishsiz.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · birinchi odam
- Sarlavha: **Sinfdoshingiz «Maydon»da to'xtab qoldi. Nima qilasiz?** (53)
- Mentor: O'tgan darsda «Maydon» tayyor bo'ldi. Endi uni birinchi marta boshqa odam ishlatyapti.
- Maket (chap): Sinov sahnasi — telefonda «‹ Bugun ›» va kataklar; barmoq halqasi kataklar ustida aylanadi, hisoblagich sekin yuradi (0:08 → 0:12); yozuv bo'sh.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Qayerni bosishni ko'rsataman (28)
  - Jim turib, nima qilishini ko'raman (34)
- Javob (ikkalasida bir xil, maqtovsiz — J-026): Oddiy vaziyatda yordam berish mumkin. Bugun esa saytni sinayapmiz: ko'rsatsangiz, tushunarsiz joyni ko'rmay qolasiz. (116)
- **Harakat → Vizual o'zgarish:** variantni tanlash → hisoblagich to'xtaydi, telefon ustida savol pufagi chiqadi «U qayerda to'xtadi?»; yozuvning birinchi qatori bir lahza yonib o'chadi (joy bo'sh).
  Jonli darsda — sinf ovozlari chizig'i (har variant va foizi).
- Tugma (pastki): Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun odam qayerda to'xtashini ko'rib, yozasiz.** (47)
- Mentor: Saytni o'zingiz qurgansiz — qayerni bosishni bilasiz. Uni birinchi marta ochgan odam bilmaydi.
- Chap: «Dars oxirida — shunday yozuv: odam nima qildi va qayerda to'xtadi» + yozuv qatorlari 0.9 s oraliqda o'zi yoziladi (javob ochilmaydi — matn kulrang chiziq):
  `0:00 · ━━━━━━` · `0:14 · ━━━━━━━━  to'xtadi` · `0:31 · ━━━━━` · `0:58 · ━━━━━━━  to'xtadi`; oxirida bitta qator yonida «Birinchi».
- O'ng (01 · matn · teg):
  - 01 · Odam qayerda to'xtashini kuzatib, yozasiz · `kuzatish`
  - 02 · Yordam bersangiz, yozuvda nima qolishini ko'rasiz · `yordam`
  - 03 · Odamga beriladigan vazifani yozasiz · `vazifa`
  - 04 · Sinfdoshingiz bilan bir-biringizni kuzatasiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi.
- Reja = dars ta'rifi (App.jsx `sub` «sinov: tushuntirmang, kuzating») — «sinov» so'zi reja yuzasida yo'q, u 2-ekranda misoldan keyin tug'iladi (T-011, P-014).

## 2 · Sinovni kuzating  ← QTushuncha
- Eyebrow: Tushuncha · kuzatish
- Sarlavha: **O'yinchi «Maydon»da qayerda to'xtaydi?** (38)
- Mentor: 2-darsda odamdan bo'lib o'tgan ishini so'ragansiz. Bugun so'ramaysiz: o'yinchi vazifani bajaradi, siz har to'xtashini yozasiz.
- Yozuv tepasida (bitta qator, `QIzoh`): Vazifa: «Shanba kuni soat 18:00 ga maydon band qiling.»
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»): **O'yinchi necha marta to'xtaydi?** · 1 · 2 · 3 — tanlov saqlanadi.
- Vizual: Sinov sahnasi — telefon (bugungi kataklar) · yozuv (bo'sh qatorlar, nomsiz). Telefon tepasida kichik yorliq «×5» (sinov tezlashtirib ko'rsatiladi).
- **Harakat → Vizual o'zgarish:** «Sinovni boshlash» → sinov `SINOV` bo'yicha ×5 tezlikda yuradi: halqa harakat qiladi, telefon ekrani o'zgaradi, hisoblagich yuradi.
  To'xtash paytida halqa bir joyda aylanadi, hisoblagich accent bo'ladi. O'quvchi **«To'xtashni yozish»** ni bosadi → yozuvga qator tushadi (accent, yorliq «to'xtadi»):
  1. `0:00–0:25 · Bugungi kataklarni surib, shanbani qidirdi`
  2. `0:41–1:43 · Tugmani qidirdi, «Qanday yuboriladi?» deb so'radi` — 1:10 da telefon ustida ikki pufak: o'yinchi «Qanday yuboriladi?» · siz «O'zingiz qanday deb o'ylaysiz?»
  3. `1:43–2:01 · «Band qilindi» chiqqach, katakni yana bosdi`
  - Harakat paytida bosilsa (`QXato`): Hozir u to'g'ri yo'lda ketyapti — bu to'xtash emas. (51)
  - To'xtash bosilmay o'tib ketsa, sinov shu joyda pauza qiladi (`QXato`): Bu yerda u qiynaldi — to'xtashni yozing. (40) · tugma pulsda.
  - Hisoblagich yonida «Yozildi: N» (jami aytilmaydi — bashorat javobini ochmaydi, P-040).
- 2:01 da (sinov tugadi): yozuv tepasida nom paydo bo'ladi **«Kuzatuv yozuvi»**, telefon ustida yorliq **«Sinov»** (atama — misoldan keyin, bir marta).
  Natija qatori (`QTaxmin`): «Taxminingiz: 2 · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Real odam saytni o'zi ishlatadi, siz kuzatasiz — bu sinov deyiladi. Intervyuda so'raysiz, sinovda ko'rasiz. (107)
- Tugma (pastki): Sinovni boshlang → To'xtashlarni yozing (Yozildi: N) → Davom etish · `tugadi`: tugmalar paneli yopiladi, telefon va kuzatuv yozuvi butun enga (199) · «↻ Qaytadan» (ikkinchi tugma).
- O'qituvchi eslatmasi: AvtoPizza botida «qayerda to'xtab qoldingiz?» deb so'ragan edingiz — bugun javobni odamning o'zidan emas, uning harakatidan olasiz. Sinfga savol: «Siz o'yinchining o'rnida qayerda to'xtardingiz?»

## 3 · 1-savol  ← QTest (✔ 2-variant, `correctIdx 1`)
- Eyebrow: Tekshiruv · kuzatuv yozuvi
- Savol: **Sinfdoshingiz 18:00 katagi oldida to'xtadi. Yozuvga nima yoziladi?** (9 so'z)
  - 0:40 · 18:00 katagi juda kichik ekan (36)
  - ✔ 0:40 · Katakka qarab turdi, bosmadi (35)
  - 0:40 · Odamlar kataklarni tushunmaydi (37)
  - 0:40 · Sayt unga yoqmagan bo'lsa kerak (38)
- To'g'ri izohi: Yozuvga u nima qilgani tushadi — siz ko'rgan harakat.
- Xato izohlari (≤60): 1 — Kichikligi — sizning xulosangiz. U nima qildi? (44) · 3 — Bitta odamdan hamma haqida gap chiqmaydi. (42) ·
  4 — Bu sizning fikringiz: u buni aytmadi ham, qilmadi ham. (53) · (umumiy) Odam nima qilganini toping — ko'rgan harakatingizni. (54)
- Tanlagach: kichik yozuv-qatorda tanlangan gap ko'rinadi (to'g'ri — yashil chiziq, xato — `err` fon).

## 4 · Yordam bersangiz-chi?  ← QTushuncha
- Eyebrow: Tajriba · yordam
- Sarlavha: **Yordam bersangiz, yozuvda nima qoladi?** (38)
- Mentor: Bu safar o'yinchi to'xtagan har joyda unga yo'lni ko'rsating. Keyin ikki yozuvni solishtiring.
- Bashorat (ballsiz): **Ko'rsatsangiz, yozuvda nechta to'xtash qoladi?** · 0 · 1 · 3
- Vizual: Sinov sahnasi — o'sha vazifa, yangi bo'sh yozuv (sarlavhasi «Ko'rsatdingiz»).
- **Harakat → Vizual o'zgarish:** sinov qayta yuradi; har to'xtash boshlanganda sinov pauza qiladi va bitta tugma chiqadi **«Ko'rsatish»** (N/3). Bosilganda:
  telefon ustida sizning pufagingiz (1 — «Strelkani bosing» · 2 — «Pastga suring, tugma o'sha yerda» · 3 — «Bo'ldi, band qilindi»), halqa shu zahoti kerakli joyga o'tadi,
  hisoblagich 2–3 soniyada davom etadi; yozuvdagi o'sha qator kulrang va chizilgan: «yozilmadi».
- 3/3 da: ikki yozuv yonma-yon (bir balandlikda): chap **«Kutdingiz»** (2-ekrandan) — 3 to'xtash · 2:01 · o'ng **«Ko'rsatdingiz»** — 0 to'xtash · 0:30.
  Natija qatori (`QTaxmin`).
- Xulosa: Ko'rsatsangiz, odam tezroq davom etadi, lekin o'sha joyni o'zi topa olarmidi — buni bilmay qolasiz. (99) — vizualdagi «0 to'xtash» — bu simulyatsiyada (audit 2)
- Tugma (pastki): Har to'xtashda ko'rsating (N/3) → Davom etish · `tugadi`: tugma paneli yopiladi, ikki yozuv butun enga.
- O'qituvchi eslatmasi: Ko'rsatish yomon odat emas — darsda bir-biringizga yordam berasiz. Faqat sinov paytida yordam to'xtash joyini yashiradi.

## 5 · 2-savol  ← QTest (✔ 4-variant, `correctIdx 3`)
- Eyebrow: Tekshiruv · yechimni ko'rsatmaysiz
- Savol: **O'yinchi so'radi: «Endi nimani bosaman?» Nima deysiz?** (7 so'z)
  - «Pastga suring, tugma o'sha yerda» (34)
  - «Avval kunni, keyin vaqtni tanlaysiz» (37)
  - «Bering, bu joyini o'zim qilaman» (33)
  - ✔ «O'zingiz qanday deb o'ylaysiz?» (32)
- To'g'ri izohi: Savol unga qaytdi — u o'zi qidiradi, siz to'xtashni yozasiz.
- Xato izohlari (≤60): 1 — Bu yordam: tugmani o'zi topishi endi bilinmaydi. (47) · 2 — Bu tushuntirish: u qayerda to'xtashi yozilmay qoladi. (51) ·
  3 — Siz qilsangiz, to'xtash yozuvga tushmaydi. (42) · (umumiy) Javob bermang — savolni unga qaytaring. (40)

## 6 · Internet-magazin  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Internet-magazin xaridorlari qayerda to'xtab qolgan?** (52)
- Mentor: Jared Spool — odamlar saytni qanday ishlatishini o'rganadigan tadqiqotchi. Bu voqeani u 2009-yilda yozgan, magazin nomini aytmagan.
- Nuqtalar (6) · yorliq **Internet-magazin · N/6** (bashorat kartasida ham) · maket `FormaMaket` (chizilgan forma: ikki qator, ikki tugma, bitta havola; logotip yo'q).
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/6 **Xarid oxirida — oddiy forma** — Savatni to'ldirib, xaridga o'tgan odam forma ko'rardi: email, parol, «Kirish», «Ro'yxatdan o'tish» va «Parolni unutdingizmi?». · maket: forma chiziladi
  - 2/6 **Sinov: ro'yxat va pul** — Tadqiqotchilar odamlarga xarid ro'yxati va pul berishdi. Vazifa bitta edi: xaridni oxiriga yetkazish. · maket: forma yonida ro'yxat-karta va barmoq halqasi
  - 3/6 bashorat — **Formaga yetgan odamlar bilan nima bo'ldi?** · Forma ularni to'xtatmadi · Ba'zilari formada ikkilandi · ✔ Forma xaridga to'siq bo'ldi
  - 4/6 **Kuzatuvda nima ko'rindi** — Yangi xaridorlar ro'yxatdan o'tishni xohlamadi. Bittasi aytdi: «Men bu yerga tanishgani kelmadim. Shunchaki xarid qilmoqchiman.» Oldin kelganlarning ko'pi parolini eslay olmadi. · maket: forma ustida halqa aylanadi, ikki pufak
  - 5/6 bashorat — **Dizaynerlar formada nimani o'zgartirdi?** · ✔ Bitta tugmaning yozuvini almashtirdi · Formani butunlay olib tashladi · Saytni boshidan qayta qurdi
  - 6/6 **Bitta tugma** — «Ro'yxatdan o'tish» o'rniga «Davom etish» qo'yildi va bitta gap: xarid uchun ro'yxatdan o'tish shart emas. Xarid qilgan mijozlar soni 45% oshdi, birinchi yilda magazin qo'shimcha 300 million dollar oldi. · maket: tugma yozuvi almashadi, yonida ustun-belgi o'sadi «+45%»
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `FormaMaket` holati o'zgaradi: forma chiziladi → ro'yxat-karta va halqa → halqa forma ustida aylanadi
  (to'xtash — s2 dagidek belgi) → pufaklar → «Ro'yxatdan o'tish» yozuvi «Davom etish» ga almashadi, ustun-belgi o'sadi. Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (6/6 dan keyin, hisoblagichsiz): Vazifada qaysi tugmani bosish aytilmagan — shuning uchun formadagi to'xtash ko'rindi. (85)
- Tugma (pastki): Keyingi bosqich (N/6) → Davom etish
- O'qituvchi eslatmasi: Raqamlar maqoladan (45% — xarid qilgan mijozlar soni, maqolada «The number of customers purchasing went up by 45%»; 15 mln $ — birinchi oy; 300 mln $ — birinchi yil). Magazin nomini taxmin qilmang — maqolada yo'q.

## 7 · 3-savol  ← QTest (✔ 1-variant, `correctIdx 0`; keys qoidasi «Maydon» egasiga)
- Eyebrow: Tekshiruv · Internet-magazindagidek
- Savol: **Internet-magazindagidek: maydon egasiga qaysi vazifani berasiz?** (7 so'z)
  - ✔ «Ertaga kim band qilganini bilib oling» (39)
  - «Kirishni bosib, parolingizni yozing» (37)
  - «Ega sahifasi sizga yoqdimi, ayting» (36)
  - «Ro'yxat qayerdaligini o'zim ko'rsataman» (41)
- To'g'ri izohi: Vazifa natijani aytadi — qayerni bosishni ega o'zi topadi.
- Xato izohlari (≤60): 2 — Bu qadamlarni aytadi: to'xtash ko'rinmay qoladi. (45) · 3 — Bu fikr so'raydi: ega bajaradigan ish yo'q. (42) ·
  4 — Ko'rsatsangiz, ega qayerda to'xtashini bilmaysiz. (48) · (umumiy) Ega nimaga erishishi kerakligini toping. (42)

## 8 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Odamga maqsadni qanday aytasiz?** (30)
- Mentor: «Qilamiz» ro'yxatingizdagi asosiy ishni oling. Vazifada odam nimaga erishishini yozing — qayerni bosishni emas.
- Bitta ustun: yozuv sarlavhasi «Vazifa: ━━━━» (skelet; telefon ramkasida yorliq «Sizning saytingiz») → forma (bitta qator) → Yordam · «Saqlash» o'ngda (187).
- Ipucha (placeholder, §32): Odam nimaga erishsin?
- Tekshiruv (`QXato`, ≤60; faqat bo'sh qator bloklaydi, qolgani — maslahat, qaror o'quvchida; audit):
  - bo'sh: Odam nimaga erishsin — shuni yozing. (36)
  - qatorda tugma/qadam so'zi (bosing, tugma, katak, menyu, oching, tanlang) — maslahat: Bu gap maqsadni aytyaptimi yoki yo'lni ham ko'rsatyaptimi? (58)
  - qatorda «?» yoki «yoqdimi», «qanday ekan»: Bu fikr so'raydi. Odam bajaradigan ishni yozing. (47)
  - 15 belgidan qisqa — maslahat: Vazifa to'liq gap bo'lsin: nima va qachon. (40)
- Yordam (sukutda yopiq): «Maydon» vazifasida qaysi tugmani bosish yo'q — faqat natija bor: kun, soat va band qilish. Saytingizda odam oxirida nimaga ega bo'ladi? Shuni yozing.
- **Harakat → Vizual o'zgarish:** gap yozib «Saqlash» → yozuv sarlavhasiga «Vazifa: «…»» kiradi (yashil chiziq); tekshiruvdan o'tmasa sarlavha `err` fonda va ostida bitta `QXato`.
  Saqlangach forma yopiladi, yozuv butun enga, sarlavha yonida ✎ (tahrirlash).
- Xulosa: Vazifangiz tayyor. Uni sinfdoshingizga o'qib berasiz — qolganini u o'zi qiladi. (79)
- Tugma (pastki): Vazifani yozing → Davom etish
- Zaxira (o'z sayti hali ishlamasa): «Maydon» vazifasi bilan davom etadi — sinfdoshi «Maydon» ni sinaydi (teg `dars-09-done`). Kirish qatorida bir marta: Saytingiz hali ishlamasa, «Maydon» bilan davom eting. (55)

## 9 · Birinchi qaysi?  ← QTushuncha (o'quvchining o'z tanlovi; 11-dars shu tanlov bilan boshlanadi)
- Eyebrow: Mashq · birinchi tuzatiladigan
- Sarlavha: **Qaysi to'xtash birinchi tuzatiladi?** (35)
- Mentor: Yozuvdagi har to'xtash ortida bitta muammo bor. Uchalasini ko'rib, birinchisini o'zingiz tanlang.
- Chapda uch karta (2-ekrandagi yozuv qatori + muammo; bir balandlikda; ochiladigan — «›», ko'rilgach ✓, U-013):
  - `0:00–0:25` · **Kunni almashtirishni sezmadi**
  - `0:41–1:43` · **«Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi**
  - `1:43–2:01` · **Band bo'lgandan keyin nima bo'lganini tushunmadi**
- O'ngda: Sinov sahnasi (telefon + kuzatuv yozuvi, 2-ekrandagi uch qator).
- 1-bosqich — **Harakat → Vizual o'zgarish:** kartani bosish → telefonda o'sha joy ko'rinadi (kun: «‹ ›» strelkalari halqada · tugma: forma ostidagi tugma ekran chetidan yarim chiqib turadi · band:
  «Band qilindi» belgisi chiqib yo'qoladi) va yozuvdagi o'sha qator ajraladi; karta ostida savol va javob:
  **Bu to'xtash vazifani to'xtatadimi?**
  - Kun — Yo'q: 25 soniyadan keyin o'zi topdi. (42)
  - Tugma — Ha: tasodifan surmaganda band qila olmasdi. (51)
  - Band — Yo'q: band bo'ldi, u faqat ishonmadi. (44)
- 2-bosqich (3/3 ko'rilgach, shu ekranda): savol-qatori **Birinchi tuzatiladiganini tanlang** → bitta kartani bosish → u **«Birinchi»** uyasiga o'tadi (sig'im 1), qolgan ikkitasi
  «Keyin» qatoriga (kulrang). Telefonda tanlangan joy accent halqada, yozuvdagi qator yonida yorliq «Birinchi».
  - Tugma tanlansa: natija qatori yo'q, shu zahoti xulosa.
  - Kun yoki band tanlansa (`QTaxmin` shaklida, ballsiz): Tanlovingiz: {kun | band} · Mentor tanlovi: tugma — usiz band qilib bo'lmaydi. + ikkinchi tugma «Tanlovni almashtirish».
    O'quvchi o'z tanlovida qolishi mumkin — saqlanadigan tanlov uniki (S-008).
- Xulosa: Bu sinovda vazifani tugatishga to'sqinlik qilgan to'xtashdan boshlaymiz. Qolgan ikkitasi navbatda turadi. (105)
- Tugma (pastki): Uch kartani ko'ring (N/3) → Birinchisini tanlang → Davom etish · `tugadi`: kartalar paneli yopiladi, telefon va yozuv («Birinchi» yorlig'i bilan) butun enga.
- Nishon: First Fix (birinchi tanlov — tugma).
- O'qituvchi eslatmasi: Tanlovni sinfda muhokama qiling: «Kun» ham, «band» ham haqiqiy muammo — faqat vazifani to'xtatmaydi. Tugmani tuzatish — keyingi dars ishi.

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish
- Sarlavha: **To'xtashlarni topadigan kod yozamiz.** (36) — PM-082(a) sarlavha oilasi
- Mentor: 2-ekranda to'xtashni ko'zingiz bilan topdingiz, endi kod harakatlar orasidagi uzun tanaffusni belgilaydi. Bu — ehtimoliy to'xtash: muammo ekanini siz kuzatuv bilan tekshirasiz.
- Darvoza-mashq (kod oldidan, ballsiz): **Harakatlar 41 va 103-soniyada. Orasida necha soniya o'tdi?** · 41 · ✔ 62 · 103
  - xato `41`: 41 — birinchi harakat vaqti. Ikkalasining farqini toping. (49) · xato `103`: 103 — ikkinchi harakat vaqti. 103 dan 41 ni ayiring. (48)
- Chap (vazifa, 3 band): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ikki harakat orasi chegaradan uzun bo'lsa, ro'yxatga qator tushadi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Qo'shni ikki harakatni oling: `royxat[i]` va `royxat[i + 1]`. Orasi — `royxat[i + 1].t - royxat[i].t`. Ishlagach `for` bilan hammasini aylanib chiqing.
  Eslatma (JavaScript darslaridan): `for` — bir ishni ro'yxat bo'ylab takrorlaydi · `push` — ro'yxat oxiriga qo'shadi · `console.log` — qiymatni ekranga chiqaradi.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
  «Kompilyator» ta'riflanmaydi (MATN_ETALONI lug'ati: oyna kompilyator emas).
- Kod:
```js
// O'yinchining harakatlari: t — sinov boshidan necha soniya o'tgani
const harakatlar = [
  { t: 0,   nima: "saytni ochdi" },
  { t: 25,  nima: "shanbaga o'tdi" },
  { t: 29,  nima: "18:00 katagini bosdi" },
  { t: 41,  nima: "ism va telefonni yozdi" },
  { t: 103, nima: "Band qilish tugmasini bosdi" },
  { t: 121, nima: "katakni yana bosdi" }
];

function toxtashlar(royxat, chegara) {
  // ikki harakat orasi chegaradan uzun bo'lsa — to'xtash
  return [];   // shu joyni siz yozasiz
}

console.log(toxtashlar(harakatlar, 15));
// ["saytni ochdi: 25 soniya", "ism va telefonni yozdi: 62 soniya", "Band qilish tugmasini bosdi: 18 soniya"]
console.log(toxtashlar(harakatlar, 60));
// ["ism va telefonni yozdi: 62 soniya"]
console.log(toxtashlar([], 15));
// []
```
- Kod oynasi sarlavhasi: `app.js — toxtashlar funksiyasini yakunlang` · placeholder: `// to'xtashlarni yig'ib qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: chegara 15 da uchta qator. (51) · 2 — Har qator «harakat: N soniya» ko'rinishida bo'lsin. (47) ·
  3 — Bo'sh ro'yxatga — bo'sh; chegara 60 da faqat bitta qator. (54)
- **Harakat → Vizual o'zgarish:** darvozada `62` tanlanadi → kod namunasida `t: 41` va `t: 103` qatorlari bir lahza ajraladi, orasida «62» chizig'i; kod ishga tushganda Console'da
  ro'yxat chiqadi, shartlar birma-bir ✓ bo'ladi.

## 11 · Yakuniy savol  ← QTest (✔ 3-variant, `correctIdx 2`; qoidaning to'rt qismi birga)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Qaysi sinov qoidaga to'liq mos o'tkazildi?** (6 so'z)
  - Saytni tushuntirib, keyin vazifa berdi (38)
  - Vazifa berdi, to'xtaganda tugmani ko'rsatdi (43)
  - ✔ Vazifa berdi, jim kuzatib, to'xtashni yozdi (43)
  - Saytni ko'rsatib, «yoqdimi?» deb so'radi (40)
- To'g'ri izohi: Vazifa berildi, tushuntirilmadi, yordam berilmadi va to'xtash yozildi.
- Xato izohlari (≤60): 1 — Oldindan tushuntirsangiz, to'xtash joylari yo'qoladi. (51) · 2 — Ko'rsatish — yordam: to'xtash yozuvdan yo'qoladi. (47) ·
  4 — Bu fikr so'rash: sinovda odam vazifa bajaradi. (47) · (umumiy) To'rt qismni tekshiring: vazifa, tushuntirish, yordam, yozuv. (59)

## 12 · Juftlikda sinov  ← QMustaqil (3 qadam)
- Eyebrow: Juftlikda sinov
- Sarlavha: **Sinfdoshingiz saytingizda qayerda to'xtaydi?** (44)
- Mentor: {jonli: Avval siz vazifa berib kuzatasiz, keyin rollarni almashasiz. | mustaqil: Uydagi biror kishiga saytingizni bering va kuzating.} Savol bersa — unga qaytaring.
- Qadamlar 1/2/3 (QQadamlar):
  1. **Vazifani o'qib bering** — 8-ekrandagi vazifa yozuv sarlavhasida; tugma «Sinovni boshlash» → taymer 0:00 dan yuradi (3 daqiqa — darsdagi mashq uchun limit, keyin o'zi to'xtaydi).
  2. **To'xtashlarni yozing** — «To'xtashni yozish» bosilganda yozuvga taymer vaqti bilan yangi qator qo'shiladi; ipucha «Qayerda, nima qildi?». Odam hech qayerda to'xtamasa —
     «To'xtash bo'lmadi» (bu ham natija: 3-qadam o'tkazib yuboriladi).
  3. **Birinchisini belgilang** — har qator yonida savol «Vazifani to'xtatdimi?» (Ha / Yo'q); bitta qatorni bosib «Birinchi» qilasiz → «Saqlash».
- Vizual: o'quvchining kuzatuv yozuvi — sarlavhada vazifasi, qatorlar vaqt bilan. 8-ekran yozilmagan bo'lsa (yoki mentor rejimi) — «Maydon» vazifasi.
- Tekshiruv (`QXato`, ≤60): qator bo'sh — Odam nima qilganini yozing. (28) · qatorda xulosa so'zi (yomon, noqulay, chalkash, kerak) — Bu xulosa. Odam nima qilganini yozing. (39)
- **Harakat → Vizual o'zgarish:** «To'xtashni yozish» → yozuvga vaqtli qator kiradi (accent, «to'xtadi»); matn yozilgach qator oddiy holatga o'tadi; 3-qadamda tanlangan qator «Birinchi»
  yorlig'ini oladi; «Saqlash» → yozuv chap chetida yashil chiziq, forma yopiladi, yozuv butun enga (199), har qator yonida ✎.
- Xulosa: Kuzatuv yozuvingiz tayyor: vazifa, to'xtashlar va birinchi tuzatiladigani. (74)
- Tugma (pastki): Sinovni o'tkazing (N/3) → Davom etish
- O'qituvchi eslatmasi: Juftliklarni oldindan bo'ling. Har sinov 3 daqiqa, keyin almashish. Kuzatuvchi faqat «O'zingiz qanday deb o'ylaysiz?» deydi — boshqa gap yo'q.
  Darsdagi sinfdosh — mashq; real odam bilan sinov — uyga vazifa.

## 13 · Natijalar (podium)  ← QNatija
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Yozuvga nima yoziladi · 2 — Savolni qaytarish · 3 — Egaga vazifa · 4 — To'g'ri o'tgan sinov

## 14 · Takrorlash  ← QKartochka
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon | Orqa | Izoh |
|---|---|---|
| Sinov nima? | Real odam saytni o'zi ishlatadi, siz kuzatasiz | Inglizcha — usability test |
| Sinov intervyudan nimasi bilan farq qiladi? | Intervyuda so'raysiz, sinovda kuzatasiz | Javob — odamning harakatida |
| Sinovning qoidasi qanday? | Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz | To'rt qism — bitta gap |
| To'xtash nima? | Odam keyingi qadamni topishda qiynalgan joy: jim qoladi, qidiradi yoki noto'g'ri bosadi | Yozuvga vaqti bilan tushadi |
| Kuzatuv yozuviga nima tushadi? | Odam nima qilgani va qayerda to'xtagani | Ko'rgan harakat — u qilganidek |
| Yozuvga nima tushmaydi? | Sizning xulosangiz | «Katak kichik» — xulosa |
| Odam «Endi nimani bosaman?» desa-chi? | «O'zingiz qanday deb o'ylaysiz?» | Savol unga qaytadi |
| Sinovda yordam bersangiz nima bo'ladi? | To'xtash yozuvdan yo'qoladi | Odam tez tugatadi, yozuv bo'sh |
| Yaxshi sinov vazifasi nimani aytadi? | Odam nimaga erishishini | Qaysi tugmani bosishni emas |
| Maydon sinovida birinchi qaysi to'xtash tuzatildi? | Vazifani tugatishga to'sqinlik qilgani | «Maydon»da — tugma |
| Internet-magazinda nima o'zgardi? | «Ro'yxatdan o'tish» o'rniga «Davom etish» | Xarid qilgan mijozlar soni 45% oshdi |
| Real odam bilan sinovni kimga berasiz? | Saytingiz mo'ljallangan odamga | Sinfdosh — darsdagi mashq |

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Kuzatuv yozuvi tayyor: birinchi tuzatish aniq.** (46)
- Endi siz bilasiz:
  - Sinov — real odam saytni o'zi ishlatadi, siz kuzatasiz.
  - Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.
  - Kuzatuv yozuviga xulosangiz emas, odam nima qilgani vaqti bilan tushadi.
  - Maydon sinovida birinchi — vazifani tugatishga to'sqinlik qilgan to'xtash.
- Uyga vazifa (`HwCard`, P-025): **Kim bilan:** 2-darsda intervyu bergan odamlardan ikkitasi · **Nechta:** 2 ta sinov · **Muddat:** keyingi darsgacha
  1. Sinov vazifangizni o'qib bering va telefonni (yoki laptopni) bering.
  2. Tushuntirmang, yordam bermang — har to'xtashni vaqti bilan yozing.
  3. Vazifani to'xtatgan to'xtashni «Birinchi» deb belgilang va yozuvni keyingi darsga olib keling.
- Keyingi dars — «Loyiha kuni: sinovdan keyingi tuzatish». Sinovda topilgan birinchi to'xtashni agent bilan tuzatasiz.
- Nishonlar — pastda (mentor rejimida yo'q).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Silent Observer!** — Sinovda uchala to'xtashni o'zingiz yozdingiz (2)
- **Task Giver!** — Sinov vazifangizni qoidaga mos yozdingiz (8)
- **First Fix!** — Vazifani to'xtatadigan to'xtashni birinchi tanladingiz (9)
- **Pair Tester!** — Sinfdoshingiz bilan sinov o'tkazib, yozuvni saqladingiz (12)

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida raqam 1/2/3)
- **3 · Yozuvga nima tushadi** — 1 Odam nima qilgani — siz ko'rgan harakat, vaqti bilan. · 2 Xulosangiz («katak kichik») yozuvga tushmaydi. ·
  3 Bitta odamdan hamma haqida gap chiqarilmaydi. — savol: 3-ekran savoli
- **5 · Savolni qaytaring** — 1 Sinovda yechimni ko'rsatib bermaysiz: ko'rsatsangiz, qiyinchilik ko'rinmay qoladi. · 2 Odam so'rasa: «O'zingiz qanday deb o'ylaysiz?» ·
  3 Jim qolsa — kutasiz va vaqtini yozasiz. — savol: 5-ekran savoli
- **7 · Vazifa natijani aytadi** — 1 Internet-magazinda vazifa bitta edi: xaridni oxiriga yetkazish. · 2 Qaysi tugmani bosish aytilmagan — shuning uchun forma to'xtash bo'lib ko'rindi. ·
  3 Vazifada odam nimaga erishishi yoziladi, qadamlar emas. — savol: 7-ekran savoli
- **11 · Sinovning to'rt qismi** — 1 Vazifa berasiz. · 2 Yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz. · 3 Qayerda to'xtaganini vaqti bilan yozasiz. — savol: 11-ekran savoli

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·9 · B 3·5·11 · C 2·8·12 · D 4·7·10 — har biri 3 marta)
1. Sinov nima?
   - A ✔ Real odam saytni ishlatadi, siz kuzatasiz
   - B Siz saytni ishlatasiz, odam sizni kuzatadi
   - C Odamdan sayt haqidagi fikrini so'raysiz
   - D Saytni o'zingiz qayta-qayta ishlatib ko'rasiz
2. Sinov intervyudan nimasi bilan farq qiladi?
   - A Sinovda odamga ko'proq savol beriladi
   - B Intervyuda odam saytni o'zi ishlatadi
   - C ✔ Sinovda so'ramaysiz — odamni kuzatasiz
   - D Sinovda faqat sinfdoshlaringiz qatnashadi
3. O'yinchi 25 soniya hech narsa bosmadi. Bu nima?
   - A Sayt juda sekin ochilayotganining belgisi
   - B ✔ To'xtash — yozuvga vaqti bilan tushadi
   - C Odam saytni yoqtirmaganining belgisi
   - D Sinov shu yerda tugaganining belgisi
4. Sinovda odamga yordam bersangiz, yozuvda nima bo'ladi?
   - A Yozuvga ko'proq to'xtash tushadi
   - B Yozuv avvalgidek o'zgarmay qoladi
   - C Odam to'xtagan joylar ikki marta yoziladi
   - D ✔ To'xtash joyi yozuvga tushmay qoladi
5. Yaxshi sinov vazifasi nimani aytadi?
   - A Qaysi tugmalarni bosish kerakligini
   - B ✔ Odam nimaga erishishi kerakligini
   - C Sayt qaysi qismlardan qurilganini
   - D Odamga sayt yoqqan-yoqmaganini
6. Qaysi biri sinov vazifasi bo'la oladi?
   - A ✔ «Shanba kuni soat 18:00 ga maydon band qiling»
   - B «18:00 katagini bosib, ism va telefonni yozing»
   - C «Sayt sizga qulaymi? Fikringizni aytib bering»
   - D «Pastdagi «Band qilish» tugmasini topib bosing»
7. Kuzatuv yozuviga qaysi qator tushadi?
   - A «Tugma juda noqulay joyga qo'yilgan ekan»
   - B «Hamma odam bunday formani yomon ko'radi»
   - C «Sayt menga ham chalkash tuyuldi»
   - D ✔ «Tugmani qidirib, 1 daqiqa ekranni surdi»
8. Internet-magazinda odamlar qayerda to'xtab qolgan?
   - A Savatga narsalarni solayotgan paytda
   - B Kerakli narsani qidiruvdan izlayotganda
   - C ✔ Email va parol so'raydigan formada
   - D Yetkazib berish manzilini yozayotganda
9. Internet-magazinda nima o'zgartirildi?
   - A ✔ «Ro'yxatdan o'tish» o'rniga «Davom etish»
   - B Formaga yana bitta qator qo'shib qo'yildi
   - C Sayt boshidan to'liq qayta qurib chiqildi
   - D Ro'yxatdan o'tganlarga chegirma berildi
10. Uch to'xtashdan qaysi biri birinchi tuzatiladi?
   - A Sinovning eng oxirida bo'lgani
   - B Eng qisqa vaqt olgan to'xtash
   - C O'zingizga eng qiziq tuyulgani
   - D ✔ Vazifani to'xtatib qo'yadigani
11. Real odam bilan sinovni kim bilan o'tkazasiz?
   - A Saytni qurgan o'zingiz bilan
   - B ✔ Saytingiz mo'ljallangan odam bilan
   - C Saytni oldin ko'rgan dasturchi bilan
   - D Sinfdagi eng a'lochi o'quvchi bilan
12. Sinovdan keyin kuzatuv yozuvi bilan nima qilasiz?
   - A Uni o'chirib, yangisini boshidan boshlayman
   - B Hamma to'xtashni bir kunning o'zida tuzataman
   - C ✔ Birinchi tuzatiladigan to'xtashni tanlayman
   - D Odamdan yozuvni tasdiqlashini so'rayman
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — sinov · kuzatish · to'xtash · vazifa · yozuv · tugma · vaqt · odam (+ o'yin qatlami belgilari) ·
  uyga vazifa banneri — sinov · vazifa · to'xtash · yozuv · odam.

---

## B. KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; yangi fayl — hamma band yangi)
1. Fayl `src/7-Modull/PmUsabilityTestLesson.jsx` (skeletdan, pilotdan emas — JR-14); App.jsx m7-10 qatoriga `comp: PmUsabilityTestLesson` («qur» bosqichida; nom va `sub` o'zgarmaydi — DE-205 ✓).
2. Qolip: s0 `QKirish` · s1 `QReja` · s2/s4/s9 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` ·
   s8/s12 `QMustaqil` · s10 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')` (q13–q21).
3. `SINOV` — Mentor sinovi bitta manbada (A-bo'lim jadvali: `t`, `nima`, `ekran`, `toxtash: bool`, `pufak`); s0, s2, s4, s9 va s10 (`harakatlar` — faqat bosish/yozish qatorlari) shundan.
   `MUAMMOLAR` — uch karta (`joy: kun|tugma|band`, `vaqt`, `nomi`, `toxtatadi: bool`, `izoh`).
4. `SinovSahna` — bitta vizual (180): telefon ramkasi («Maydon»: «‹ Bugun / Shanba ›», kataklar, forma, ekran ostidagi tugma, «Band qilindi» belgisi) + barmoq halqasi + hisoblagich +
   pufaklar (o'yinchi / siz) + yozuv (qator holatlari: bo'sh · yozildi · to'xtash · yozilmadi · birinchi · xato). `reduced-motion` — o'tishsiz, halqa harakatsiz.
5. s2 — ×5 ijro (`requestAnimationFrame` yoki `setInterval`, reduced-motion da qadam-baqadam «Keyingi»); «To'xtashni yozish» to'xtash oynasida bosilsa qator, tashqarida — `QXato`;
   o'tkazib yuborilgan to'xtashda pauza; «Yozildi: N» (jami yo'q); 3/3 da «Kuzatuv yozuvi» / «Sinov» yorliqlari; `QBashorat` + `QTaxmin`.
6. s4 — o'sha ijro, har to'xtashda pauza + «Ko'rsatish» (N/3); yonma-yon ikki yozuv (s2 natijasi — saqlangan holatdan; s2 o'tilmagan bo'lsa `SINOV` dan to'liq yozuv).
7. s6 — `FormaMaket` (CSS chizilgan forma: 2 qator, «Kirish» / «Ro'yxatdan o'tish», havola; ro'yxat-karta; ustun-belgi «+45%»); `K_SLIDES` 6 bosqich, 2 bashorat, yorliq «Internet-magazin · N/6».
8. s8 — vazifa tekshiruvi (regex, PM-032: ≥8 namuna uz+ru sinovi; «tanlab», «bosib o'tib» kabi to'g'ri gaplar bloklanmasin); saqlangan vazifa s12 va uyga vazifa banneriga o'tadi.
9. s9 — kartalar akkordeon emas: bosish → telefon holati o'zgaradi (DE-184); 2-bosqich — uya «Birinchi» (sig'im 1), «Tanlovni almashtirish»; **tanlov saqlanadi — 11-dars o'qiydi**
   (kalit nomi — TAYANCHGA SAVOL 4); nishon `firstFix` — birinchi tanlov `tugma`.
10. s10 — darvoza-mashq (41 · 62 · 103), `KOD_TASK` (title, brief, starter uz/ru), 3 `evalEquals` (chegara 15 → 3 qator · 60 → 1 qator · bo'sh → bo'sh), requirement xabarlari.
11. s12 — `PairTimer` (3 daqiqa, ▶ ⏹ belgisiz yozuvlar: «Sinovni boshlash» · «To'xtatish»), «To'xtashni yozish» taymer vaqtini oladi, «To'xtash bo'lmadi», Ha/Yo'q savoli, «Birinchi»;
    jonli/mustaqil Mentor matni; xulosa so'zi tekshiruvi (PM-032).
12. Testlar s3/s5/s7/s11 — `correctIdx` 1/3/0/2 = `INLINE_KEYS`; `RECAPS` 3/5/7/11 (raqamli kartalar); `Q_LABELS`; arena `QUIZ_BANK` 12 (A/B/C/D 3/3/3/3).
13. s14 `FLASHCARDS` 12 · s15 `RECAP` 4 band (A-1 ta'rifi so'zma-so'z), `HW_STEPS` 3 qadam (yakun ekranida aynan shu), «Keyingi dars — …» · `ACHIEVEMENTS` 4.
14. Uyga vazifa fayli (`PmUsabilityTestLesson.homework.jsx`, `HwCard`) — yangi; PM-027 eski fayllar uchun, bu dars uchun yangi fayl quruvchi tomonidan, MD dagi 3 qadam bilan.
15. **REPO — bu darsda yo'q** (PM darsi; teg yo'q). Lekin s2/s9 maketi `dars-09-done` holatiga tayanadi — REPO talabi TAYANCHGA SAVOL 3 da.
- Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim)
1. **Mentor sinovining tafsiloti** — bitta o'yinchi, vaqtlar (0:25 · 1:43 · 2:01), 1:10 dagi «Qanday yuboriladi?», tugmani tasodifan surib topgani, «Bo'ldimi?» deb katakni yana bosgani.
   Nega: uch muammo bitta sinovda bir-biriga zid bo'lmasligi uchun (tugmani topa olmasa, keyingi muammo bo'lmasdi). 11-dars shu sinovga tayanadi — o'sha MD bilan mos bo'lishi kerak.
2. **Kun almashtirgich ko'rinishi «‹ Bugun ›» (kichik strelkalar)** — «kunni almashtirishni sezmadi» muammosi shu bilan tushuntiriladi. 7-dars (kun almashtiriladi) va 8-dars (dizayn) maketi bilan mosmi?
3. **`dars-09-done` repo holati** (9-dars agenti / «qur» bosqichi uchun): telefon kengligida «Band qilish» tugmasi forma ostida — birinchi ekranda ko'rinmaydi; «Band qilindi» belgisi qisqa chiqib
   yo'qoladi; kun almashtirgich kichik. Aks holda 10-dars sinovi repo'dagi saytga to'g'ri kelmaydi. `dars-11-done` faqat tugmani tuzatadi (tayanch jadvali bilan bir xil).
4. **s9 tanlovi qayerda saqlanadi** (localStorage kaliti nomi) — 11-dars «shu tanlov bilan boshlanadi»; kalit nomini o'ylab topmadim, 11-dars bilan birga belgilanishi kerak.
5. **Uyga vazifa hajmi** — «2-darsda intervyu bergan odamlardan ikkitasi · 2 ta sinov». Tayanchda soni yo'q; 11-dars real yozuvlar bilan boshlanadi — soni u yerda ham bir xil bo'lsin.
6. **Juftlik sinovi taymeri — 3 daqiqa** (har kishiga), keyin rollar almashadi. Darsga sig'ishi uchun tanladim.
7. **Keys «300 million dollarlik tugma»** (Jared Spool, 2009) — 9-Modulning boshqa darslarida ishlatilmasin (PM-016: bosh-keys modulda takrorlanmaydi). 8-dars (dizayn) yoki 12-dars uni olsa — ziddiyat.
8. **PM darsida `QKod` ekrani** (s10) — P-011 PM tartibi va namuna (m6-14) bo'yicha qo'ydim; 9-Modul PM darslarida koding saqlanadimi — modul bo'yi qaror kerak.
9. **«Sinov» va «to'xtash» atamalari** — 11-dars va 12-dars ham aynan shu so'zlarni ishlatishi kerak (12-dars pitchida «real foydalanuvchi hikoyasi» — sinov yozuvidan).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 316–318 — m7-09 «Loyiha kuni: MVP tayyor» → **m7-10 «Odam ilovangizda qayerda to'xtab qoladi?»** → m7-11 «Loyiha kuni: sinovdan keyingi tuzatish». `comp` hali yo'q («qur» da ulanadi).
- [x] Bitta misol-ip: «Maydon», bitta sinov vazifasi («Shanba kuni soat 18:00 ga maydon band qiling.»), tayanchdagi uch muammo aynan; metafora yo'q; bitta vizual — `SinovSahna`.
  Ikkinchi misol faqat keys (s6, `FormaMaket` — PM-029) va testda tanish olamdan (s7 — o'sha «Maydon»ning egasi, P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 9 (QTushuncha) + 0, 6, 8, 10, 12. Matn-karta yo'q (s9 kartasi bosilganda telefon holati o'zgaradi).
- [x] O'lchov (skript bilan sanaldi — `lint:til` dan keyin): sarlavha 35–52 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 72–105 · hook javobi 106 · xato izohi 28–59.
- [x] Atamalar: sinov / to'xtash / kuzatuv yozuvi / sinov vazifasi — A-2 jadvali; intervyu, yozuv, sayt, vaqt katagi, band qilish, o'yinchi, maydon egasi — tayanchdagidek; «usability test» — 1-kartochka izohida bir marta;
  «maydon» forma ma'nosida yo'q (T-015); siz-forma; tugmalar ot-shaklda («Sinovni boshlash», «To'xtashni yozish», «Ko'rsatish», «Saqlash», «Tanlovni almashtirish»).
- [x] Testlar: 4 variant, uzunlik teng (s3 35–38 · s5 32–37 · s7 36–41 · s11 38–43) — to'g'ri javob yolg'iz eng uzun emas (s11 da 2 va 3 teng); vaqt belgisi «0:40» hamma variantda (s3);
  «vazifa berdi» ikki variantda, «to'xtash» ikki variantda (s11). ✔ o'rni 2/4/1/3 — yangi dars.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno); kafolat so'zlari yo'q («har doim», «100%», «darrov», «darhol», «doim» — grep 0, faqat shu qatorda).
  Arena: 12 savol, ✔ A 1·6·9 · B 3·5·11 · C 2·8·12 · D 4·7·10 (skript bilan sanaldi); to'g'ri variant hech qaysi savolda yolg'iz eng uzun emas.
- [x] Ichki kodlar yo'q (modul raqami o'rniga «AvtoPizza boti», «AvtoStoyanka», «2-darsda»); keys — manba bilan (Spool 2009, sahifa ochib tekshirildi 05.10); «KOD» ro'yxati 15 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (sinov atamasi s2 da misoldan keyin) · T-014/015 (bir so'z, «maydon» bir ma'noda) · T-024 (tugma oti) · T-039 (saytingiz — 9-darsda MVP bor; yo'q bo'lsa zaxira) ·
  T-042 (qoida va ta'rif so'zma-so'z bir xil) · T-047 (ekranda ko'ringanini Mentor aytmaydi) · P-001 (bitta ip) · P-014/015 (reja kashfiyotni ochmaydi) · P-016 (hook ikki variant teng) ·
  P-025 (uyga vazifa karta + yakunda aynan) · P-040 (yozildi hisoblagichi) · P-046 (s9, s12 holat o'quvchi tanlovidan) · P-064 (bashorat s2, s4) · S-002/S-004 (har xato variant qoidaga ko'ra xato) ·
  S-008 (s9 tanlovi jazolanmaydi; arena kalit iboralari darsdagi testlardan farqli) · S-015 (bashorat zinapoya) · S-018 (Jared Spool izohi birinchi ko'rinishda) · S-026 (recap raqam) · PM-005 (2-tur) ·
  PM-016 (keys yangi) · PM-028/029 (keys yorlig'i, chizilgan maket).
- [ ] Ochiq: s2 ×5 ijro — 7–10 soniya testida «qachon bosaman?» tushunarlimi, surat va 👦 o'qishda ko'riladi; telefonda (393) telefon va yozuv ustma-ust — vizual bosqichda.

---

# 9-Modul (kod: `src/7-Modull`) · 11-dars «Loyiha kuni: sinovdan keyingi tuzatish» — MD v3 (loyiha kuni qolipi)

Fayl: `src/7-Modull/MvpIterationLesson.jsx` · **8 ekran + 3 amaliyot bloki = 11** · faqat o'zbekcha (ru — 6-RU bosqichida)
Qolip: 172-qonun (8 + 3) va 173-qonun (blok repo ustida) · namuna: `feedback/F-0929-QA-6modul/08-PipelineProject-v3.md` · dars yangi — hamma ekran noldan.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **B**; arena 12 savol — A·B·C·D ×3 (A B C D A B C D A B C D).
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 58 (A1 ≈ 15 · A2 ≈ 25 · A3 ≈ 18).
Menyu nomi (DE-205): App.jsx `m7-11` — «Loyiha kuni: sinovdan keyingi tuzatish», menyu osti «eng muhim bitta muammo tuzatiladi» ·
oldingi dars `m7-10` «Odam ilovangizda qayerda to'xtab qoladi?» · keyingi `m7-12` «Pitchingizda kimning hikoyasi bor?» (App.jsx `comp` — «qur» bosqichida, asosiy seans).

---

Tashqi audit (ChatGPT) Filtri: `11-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida `maydon` repo'sida «Band qilish» tugmasi telefon ekranida forma bilan birga ko'rinadi (`dars-11-done`);
   sinfdosh o'sha vazifa bilan qayta sinaydi, natija `SINOV.md` da yozilgan. Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
   Sayt, Backend, Database, band qilish, Umami — `dars-09-done` dan tayyor. Bugungi yagona yangi narsa: **kuzatuvni talabga aylantirish va tuzatishni qayta sinash**.
2. **Bugungi asosiy fikr (P-013):** Sinovdan keyin vazifani to'xtatgan bitta muammo talab bilan tuzatiladi va o'sha vazifa bilan qayta sinaladi.
3. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim aynan):**
   - **sinov** — real odam saytni ishlatadi, siz kuzatasiz (o'tgan dars). **qayta sinov** — tuzatishdan keyin o'sha vazifa bilan yana sinov.
   - **vazifa** — sinovda o'yinchiga beriladigan bitta ish: «Shanba kuni soat 18:00 ga maydon band qiling.» (10-dars, aynan).
   - **kuzatuv** — sinovda ko'rilgan bitta holat («tugmani topa olmadi»); **kuzatuv yozuvi** — kuzatuvlar yozilgan varaq. «Sinov yozuvi» deyilmaydi.
   - **talab** — agentga yoziladigan vazifa matni: **qayerda · nima qilsin · nima buzilmasin** (7-darsdan tanish). Kuzatuv — nima bo'lgani, talab — nima qilish.
   - **iteratsiya** — kuzatish → tuzatish → qayta sinov takrori (AvtoPizza botidan tanish so'z: «Tinglaysiz, eng muhimini tuzatasiz, yana tinglaysiz»).
   - **uch qadam** — `ochdi → vaqtni tanladi → band qildi` (6-dars, Umami hodisalari); bugun u vazifa qayerda to'xtaganini ko'rsatadi.
   - **keyin** — navbatga qo'yilgan muammo (3-darsdagi «qilamiz / keyin / qilmaymiz» bilan bir so'z).
   - **sayt** (React, `web/`) · **Backend** (NestJS, `backend/`) · **Database** (Neon) · **vaqt katagi** · **band qilish / band** · **o'yinchi** · **maydon egasi** · **hodisa** — tayanchdagidek.
   - **forma** — ism va telefon yoziladigan qism. **«maydon» so'zi forma qatori uchun ishlatilmaydi** (T-015, §202) — faqat maydonning o'zi va «Maydon» nomi.
   - **tekshirish** — o'zingiz brauzerda ko'rasiz (A2); **sinov** — boshqa odam ishlatadi (A3). Ikkalasi aralashmaydi (T-015).
   - **agent** — Antigravity agenti; dastur nomi faqat ochish va yuborish qadamida («Antigravity'da oching», «Antigravity'ga yuboring»).
4. **Metafora yo'q.**
5. **Kod yozish — Antigravity (173.1).** Prompt faqat *qayerda · nima qilsin · nima buzilmasin* deydi (173.4); texnologiya repo'da.
   Xato bo'lsa — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» Promptlar agentga buyruq shaklida (T-002).
6. **Real odam (qaror 7, 8):** darsda — sinfdosh bilan juftlikda qayta sinov (A3); o'z MVP — har blok oxiridagi «O'z g'oyangiz» qadami, ishlash uyda.
7. **Toza yuza (185, D4):** tugma va variantlarda emoji yo'q; telefon maketi chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3). ★ — belgi (FIKRLAR.md naqshi).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon» (Mentor misoli, repo `maydon`) — mahalladagi mini-futbol maydonchasini band qiladigan sayt. 10-dars sinovi uch kuzatuv berdi (tayanch 3-bo'lim oxiri):
  1) «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi · 2) band bo'lgandan keyin nima bo'lganini tushunmadi · 3) kunni almashtirishni sezmadi.
  Eng muhimi — 1 (bugun tuzatiladi); 2 va 3 — «keyin» (bitta tuzatish, keyin yana sinov).
- **Hook:** kuzatuv yozuvi ochiladi — uch muammo → «Endi nima qilasiz?» → eng muhimini tuzatib, qayta sinash.
- **Bitta vizual — «Maydon» telefoni + kuzatuv yozuvi (`MAYDON` + `KUZATUV`, dars bo'yi, 163/180):**
  - **Telefon maketi** (ramka, ekran chegarasi aniq): tepada «Maydon» · kun qatori «‹ Juma ›» (kichik o'qchalar) ·
    vaqt kataklari: 16:00 bo'sh · 17:00 band · 18:00 bo'sh · 19:00 bo'sh · 20:00 band · 21:00 bo'sh (bo'sh — oq, band — kulrang «band»).
    18:00 bosilganda katak ostida forma ochiladi: «Shanba · 18:00–19:00» · Ism · Telefon · «Band qilish».
  - **Ikki holat:** *oldin* (`dars-09-done`) — «Band qilish» telefon ramkasidan pastda, xira (ekranda ko'rinmaydi) ·
    *keyin* (`dars-11-done`) — «Band qilish» ekran pastida qotib turadi, forma bilan birga ko'rinadi. Band qilingach: katak band, «Band qilindi» belgisi.
  - **Kuzatuv yozuvi kartasi** (telefon yonida): «Kuzatuv yozuvi · Maydon», vazifa qatori, uch kuzatuv. Har kuzatuvning telefonda o'z joyi bor
    (1 — forma osti, 2 — «Band qilindi» belgisi, 3 — kun qatori) — u yerda nuqta yonadi.
  - **Uch qadam** (karta ostida, uch tugun): `ochdi → vaqtni tanladi → band qildi` — tugun kulrang → yashil; uzilgan joy — qizil uzuq chiziq; tugundan keyin «?» — noaniq.
  - Holatlar — kuzatuv qatori: oq (yozilgan) → accent (tanlangan) → qizil nuqta (telefonda joyi) → ★ «Birinchi» (accent) → yashil «tuzatildi» · kulrang «Keyin».
  - Ishlatilishi: 0 (uch nuqta) · 1 (*keyin* holati, «Qayta sinov: vazifa bajarildi») · 2 (uch qadam + qatorlar) · 4 (talab yig'ilganda telefon javob beradi) ·
    A1, A3 o'ng tomoni — `SINOV.md` fayl-kartasi (kuzatuv yozuvining fayldagi shakli, bitta manba `KUZATUV`) · A2 — telefonning kattasi (*keyin*).
  - `prefers-reduced-motion` da holatlar silliq animatsiyasiz, bir zumda almashadi.
- **Yakun:** o'yinchi to'xtagan joy tuzatildi va qayta sinaldi · keyingi dars — pitch: muammo, yechim va sinovdagi real odamning hikoyasi.

---

## 0 · Kirish — kuzatuv yozuvi ochiladi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Sinovdan uch muammo chiqdi. Qayerdan boshlaysiz?** (48)
- Mentor: O'tgan darsdagi sinovdan kuzatuv yozuvlari qoldi — «Maydon» yozuvini ochish uchun «Sinovni ko'rish»ni bosing.
- Maket (chap): «Maydon» telefoni *oldin* holatida (Shanba, 18:00 tanlangan, forma ochiq: Ism, Telefon; tugma ramkadan pastda) · yonida bo'sh kuzatuv yozuvi kartasi,
  tepasida vazifa: «Shanba kuni soat 18:00 ga maydon band qiling.» · tugma «Sinovni ko'rish».
- **Harakat → Vizual o'zgarish:** «Sinovni ko'rish» bosish → kartada uch kuzatuv birin-ketin yoziladi, har biri telefondagi joyida qizil nuqta bo'lib yonadi:
  1. «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi. (nuqta — forma osti, ramka chegarasi)
  2. Band bo'lgandan keyin nima bo'lganini tushunmadi. (nuqta — «Band qilindi» belgisi joyi)
  3. Kunni almashtirishni sezmadi. (nuqta — «‹ Bugun ›» qatori)
  Uchinchi nuqtadan keyin savol ochiladi.
- Savol: **Birinchi nima qilasiz?** (AvtoPizza botidagi kirish savoli bilan bir so'z)
  - Uchalasini bitta promptda agentga tuzattiraman (46)
  - ✔ Eng muhimini tuzatib, o'sha vazifa bilan sinayman (49)
  - O'yinchiga keyingi safar saytni oldindan tushuntiraman (54)
- Javob — 2-variant: **Aynan!** Bitta tuzatish, keyin o'sha vazifa bilan qayta sinov. Shu takror — iteratsiya. (85)
- Javob — 1-variant: **Qiziq fikr!** Uchtasini birga tuzatsangiz, qaysi o'zgarish yordam berganini ajratish qiyin. Bittadan tuzatib, qayta sinaymiz. (111)
- Javob — 3-variant: **Qiziq fikr!** Har o'yinchiga tushuntirib bo'lmaydi — sayt o'zi tushunarli bo'lsin. Eng muhimini tuzatib, qayta sinaymiz. (118)
- Javobdan keyin: kuzatuv yozuvi ostida bo'sh «Talab» qatori paydo bo'ladi (uzuq chiziq — bugun to'ldiriladi, U-041).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida o'yinchi to'xtagan joy tuzatiladi.** (47)
- Mentor: «Maydon» — namuna: har blok oxirida xuddi shu ishni o'z MVP'ingiz uchun yozasiz. Tuzatishni Antigravity agenti qiladi, siz talab yozasiz va qayta sinaysiz.
- Chap — «Dars oxirida»: telefon *keyin* holatida, bir marta o'zi yuradi (DE-200): Shanba → 18:00 → forma (Ism, Telefon) → ekran pastidagi «Band qilish» bosiladi →
  katak «band» bo'ladi, «Band qilindi» belgisi chiqadi. Ostida yashil qator: «Qayta sinov: vazifa bajarildi».
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Kuzatuv yozuvi faylga yoziladi, eng muhimi tanlanadi
  - 02 · Eng muhim bitta muammo talab bilan tuzatiladi
  - 03 · O'sha vazifa bilan qayta sinov o'tkaziladi
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-09-done` · tayyor namuna `dars-11-done`
- Tugmalar: Orqaga · Boshlaymiz
✎ 02-qadam App.jsx menyu osti yozuvi bilan so'zma-so'z mos («eng muhim bitta muammo tuzatiladi», P-015). Kuzatuv qatorlarining holati rejada ko'rsatilmaydi —
  qaysi muammo eng muhimligi 2-ekranning kashfiyoti (P-015, 178).

## 2 · Qaysi muammo eng muhim?  ← QTushuncha
- Eyebrow: Tushuncha · eng muhim muammo
- Sarlavha: **Uch muammodan qaysi biri eng muhim?** (35)
- Mentor: Bu sinovda asosiy vazifani tugatishga to'sqinlik qilgan muammodan boshlaymiz — har kuzatuv qatorini bosing. Uchala muammo bitta o'yinchining bitta sinovidan.
- Bashorat (ballsiz, 181): **Ulardan nechtasi vazifani to'xtatadi?** · Bittasi · Ikkitasi · Uchalasi — tanlov saqlanadi.
- **Harakat → Vizual o'zgarish:** o'quvchi kuzatuv qatorini bosadi → telefonda o'sha joy accent ramka oladi, uch qadam shu muammo bilan bosib o'tiladi:
  - 3-qator (kunni sezmadi) → kun qatori ramkada; uch qadamda «ochdi → vaqtni tanladi» chizig'i uzunroq yo'l bilan aylanib o'tadi, keyin uchala tugun yashil.
    Yorliq: «Vazifa bajariladi — kechroq» (33)
  - 1-qator (tugmani topa olmadi) → forma osti ramkada, tugma ramkadan pastda xira; uch qadamda «vaqtni tanladi → band qildi» chizig'i qizil va uzun (62 soniya qidirdi, tasodifan surib topdi).
    Yorliq: «Vazifaga to'sqinlik qildi» (26)
  - 2-qator (band bo'lgach tushunmadi) → «Band qilindi» belgisi ramkada; uch qadamning uchalasi yashil, oxirida «?».
    Yorliq: «Vazifa bajariladi — lekin noaniq» (32)
  3/3 dan keyin: 1-qator ★ «Birinchi» oladi, 2 va 3 kulrang bo'lib «Keyin» guruhiga suriladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: bittasi — «Band qilish» tugmasi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Maydon'da tugma birinchi: usiz band qilish tasodifga qoladi. Bittadan tuzatsangiz, ajratish oson. (97)
- Tugadi (199): harakat paneli yopiladi, telefon + uch qadam butun enga chiqadi; vizual ⛶ ichida (q17).
- Tugma (pastki): Qatorlarni ko'ring (N/3) → Davom etish
✎ Nega bittasi (topshiriq): xulosaning ikkinchi gapi — uchtasi birga tuzatilsa, qaysi biri yordam berganini ajratish qiyin (audit 2). Son ekranda bir marta: sarlavhada «Uch», tugmada N/3 (P-062).

## A1 · Amaliyot 1 — kuzatuv yozuvi `SINOV.md` ga  ← amaliyot bloki (≈15 daq)
- Eyebrow: Amaliyot 1 · SINOV.md
- Sarlavha: **Kuzatuvni faylga yozing va eng muhimini belgilang.** (50)
- Mentor: Yozuv repo'da tursa, talab va qayta sinov ham shu faylda yig'iladi; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Ikki terminal: `backend` da `npm run start:dev`, `web` da `npm run dev`.
     Brauzerda `localhost:5173` ni oching, F12, keyin Ctrl+Shift+M — sahifa telefon o'lchamida ochiladi.
     «‹ Juma ›» o'qchasi bilan Shanbaga o'ting va 18:00 ni bosing: «Band qilish» ekranda ko'rinmayotganini o'zingiz ko'ring.
  2. **Yozish** — repo ildizida `SINOV.md` faylini yarating. Shablonni «Nusxalash» bilan qo'ying va o'tgan darsdagi kuzatuvlarni yozing.
     Prompt qutisi (Shablon → SINOV.md · Nusxalash):
     ```
     # SINOV — {sayt nomi}
     Vazifa: {sinovdagi vazifa}
     | № | Kuzatuv | Vazifaga ta'siri | Navbat |
     |---|---|---|---|
     | 1 | {…} | to'sqinlik qildi / kechikdi / noaniq qoldi | ★ birinchi / keyin |
     ```
  3. **Tanlash** — har kuzatuvga «Vazifaga ta'siri» ustunini yozing: vazifaga to'sqinlik qildimi, uni kechiktirdimi yoki natija noaniq qoldimi.
     To'sqinlik qilganini ★ bilan belgilang, qolganiga — «keyin».
  4. **O'z g'oyangiz** — shu shablonni o'z g'oyangizga yozing: o'z MVP'ingiz papkasida `SINOV.md`, uydagi sinov kuzatuvlari va ★.
     Sinov o'tkazmagan bo'lsangiz — tanaffusda sinfdoshingizga MVP'ingizni bering, bitta vazifa ayting va kuzating.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (fayl-karta `SINOV.md`):
  ```
  # SINOV — Maydon
  Vazifa: Shanba kuni soat 18:00 ga maydon band qiling.
  | № | Kuzatuv                                                  | Vazifaga ta'siri          | Navbat      |
  | 1 | «Band qilish» tugmasini topa olmadi — forma ostida       | to'sqinlik qildi          | ★ birinchi  |
  | 2 | Band bo'lgandan keyin nima bo'lganini tushunmadi         | bajarildi, lekin noaniq   | keyin       |
  | 3 | Kunni almashtirishni sezmadi                             | kechikdi                  | keyin       |
  ```
- Hammasi bajarilgach (yashil): Kuzatuv repo'da: bitta muammo ★, qolgani «keyin» navbatida. (59)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-11-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 5-Modul `FIKRLAR.md` naqshi (fayl repo ildizida, shablon «Nusxalash» bilan, ★) — §221: joy aniq, natija tekshiriladi.
  1-qadamdagi «o'zingiz ko'ring» — o'zgarish ko'rsatiladi, aytilmaydi (179): A2 dan keyingi farqni o'quvchi o'z ko'zi bilan solishtiradi.

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Egaga vazifa: «Shanba bandlarini ko'ring». Qaysi muammoni birinchi tuzatasiz?** (9 so'z)
  - Parolni bir marta xato yozdi, keyin kirdi (41)
  - Ro'yxatni uzun dedi, lekin shanbani topdi (41)
  - ✔ Kirish tugmasini bosdi, ro'yxat ochilmadi (41)
  - Ranglarni xira dedi, bandlarni ko'rib chiqdi (44)
- Kalit: **C** (index 2). To'g'ri variant eng uzun emas; vergul hamma variantda.
- To'g'ri izohi: Ro'yxat ochilmasa, ega shanba bandlarini ko'ra olmaydi. (55)
- Xato izohlari (≤60):
  - A: Bir xato bo'ldi, lekin ega kirdi. Vazifa to'xtadimi? (52)
  - B: Uzun ro'yxat noqulay. Shanba bandlari topildimi? (48)
  - D: Rang haqidagi fikr foydali. Bandlar ko'rindimi? (47)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Ikkinchi misol — faqat test bandida, tanish olamdan (P-002): maydon egasi va uning sahifasi (`POST /kirish` → `GET /bandlar`, tayanch 3-bo'lim).
  Ta'rif-savol («qaysi muammo birinchi?» — mezon) arenada (2-savol), bu yerda — misol-savol (T-070).

## 4 · Kuzatuvdan talab  ← QTushuncha
- Eyebrow: Tushuncha · kuzatuvdan talab
- Sarlavha: **Kuzatuvdan qanday talab chiqadi?** (32)
- Mentor: Agentga shikoyat emas, vazifa kerak — «Qayerda» qatoridan boshlab har qatorga bitta bo'lak tanlang.
- Chapda: ★ kuzatuv (bitta qator): «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi.
  Ostida talabning uch qatori — **Qayerda** · **Nima qilsin** · **Nima buzilmasin**; har qatorda ikki bo'lak (tartib kodda aralashtiriladi):
  - Qayerda: ✓ «vaqt katagi bosilgach ochiladigan forma» · tuzoq «butun saytda»
  - Nima qilsin: ✓ «tugma forma bilan birga ekranda ko'rinsin va ism, telefon qatorini yopmasin» · tuzoq «tugma chiroyliroq bo'lsin»
  - Nima buzilmasin: ✓ «bandni saqlash, kataklar va `band-qildi` hodisasi» · tuzoq «hech narsa o'zgarmasin»
  Tuzoqlar bitta xato-sinf — umumiy gap (S-040).
- **Harakat → Vizual o'zgarish:** o'quvchi bo'lakni tanlaydi → telefon maketi javob beradi:
  - Qayerda ✓ → forma accent ramka bilan ajraladi · tuzoq → butun telefon xira ramka oladi, silkinadi: «Butun sayt — agent qayerdan boshlaydi?» (38)
  - Nima qilsin ✓ → «Band qilish» ramka ichiga, ekran pastiga ko'tariladi (*keyin* holati) · tuzoq → tugma rangi o'zgaradi, lekin ramkadan pastda qoladi:
    «Tugma chiroyli, lekin baribir ko'rinmaydi.» (42)
  - Nima buzilmasin ✓ → kataklar, forma va uch qadamning uch tuguni yashil ✓ oladi · tuzoq → tugma joyiga qaytib tushadi: «Hech narsa o'zgarmasa, tugma ham joyida qoladi.» (47)
  3/3 dan keyin talab kartasi yig'iladi (uch qator, `SINOV.md` dagi shakl):
  ```
  Qayerda: vaqt katagi bosilgach ochiladigan forma
  Nima qilsin: tugma forma bilan birga ekranda ko'rinsin va ism, telefon qatorini yopmasin
  Nima buzilmasin: bandni saqlash, kataklar va band-qildi hodisasi
  ```
  Qator (`QIzoh`, talab kartasi ostida; audit): Tugmaning joyi o'zgaradi, bandni saqlash esa o'zgarmaydi. (57)
- Xulosa: Kuzatuv nima bo'lganini aytadi, talab — nima qilishni. Aniq talabni agent to'g'riroq talqin qiladi. (99)
- Tugadi (199): bo'laklar paneli yopiladi, telefon (*keyin*) + talab kartasi fokusga; vizual ⛶ ichida.
- Tugma (pastki): Talabni yig'ing (N/3) → Davom etish
✎ 5-Modul so'zi: «Odam aytgan gap — shikoyat, Antigravity'ga esa vazifa kerak» (BotFeedbackIteration A1) — Mentor gapida takrorlandi.
  «Nima qilsin» tuzog'i (rang) 5-savol va arena 6 bilan bir g'oya: talab sababga tegadi — tugma ko'rinmasdi, joyi tuzatiladi.

## A2 · Amaliyot 2 — agent talab bo'yicha tuzatadi  ← amaliyot bloki (≈25 daq)
- Eyebrow: Amaliyot 2 · talab → tuzatish
- Sarlavha: **Agent «Band qilish» tugmasini ko'rinadigan qilsin.** (50)
- Mentor: Talabda joy aniq bo'lsa, agent o'zgartirgan narsani tekshirish oson; «1 · Talab»dan boshlang.
- Qadamlar:
  1. **Talab** — `SINOV.md` oxiriga talabni yozing (shablon «Nusxalash» bilan):
     Prompt qutisi (Shablon → SINOV.md · Nusxalash):
     ```
     ## Talab (1-tuzatish)
     Qayerda: {qayerda}
     Nima qilsin: {nima qilsin}
     Nima buzilmasin: {nima buzilmasin}
     ```
  2. **Prompt** — talabning uch qatorini qavslarga qo'ying, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > `web/` dagi saytda tuzat. Qayerda: **{qayerda}**. Nima qilsin: **{nima qilsin}**.
     > Nima buzilmasin: **{nima buzilmasin}**. `backend/` ga tegma, o'zgargan fayl va qatorlarni ayt.
  3. **Ishga tushirish** — sahifa o'zi yangilandi, terminalda xato yo'q. Agentning hisobotiga emas, haqiqiy o'zgarishga qarang: `git diff` (nima o'zgargani ko'rinadi) — faqat `web/` dagi forma o'zgarganmi; keyin brauzerda talabning har qatorini tekshiring.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — telefon o'lchamida: Shanba, 18:00 → «Band qilish» ekranda ko'rinadi.
     Keyin eski narsalar: ism va telefonni yozib band qiling — katak «band» bo'ladi, «Band qilindi» belgisi chiqadi.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: qavslarga o'z `SINOV.md`'ingizdagi ★ kuzatuvdan chiqqan talabni qo'ying va faylga saqlang.
     Uyda uni o'z MVP'ingiz papkasida Antigravity'ga yuborasiz.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (telefon maketi, *keyin* holati, kattasi):
  - Maydon · ‹ Shanba ›
  - 16:00 bo'sh · 17:00 band · **18:00 tanlangan** · 19:00 bo'sh · 20:00 band · 21:00 bo'sh
  - Shanba · 18:00–19:00 · Ism · Telefon
  - ekran pastida qotgan: [Band qilish]
- Hammasi bajarilgach (yashil): «Band qilish» ekranda ko'rinadi, band qilish eskidek ishlaydi. (62)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-11-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 5-Modul A2 naqshi: «Boshqa joyga tegma, o'zgargan qatorlarni ayt» (§221), 4-qadam — avval tuzatilgan joy, keyin eski narsalar.
  «Tekshirish» — o'quvchining o'zi; «sinov» so'zi A3 ga qoldi (T-015).

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Kuzatuv: kunni almashtirishni sezmadi. Qaysi talab aniq?** (7 so'z)
  - Kun tanlash joyi qulay bo'lsin, hech narsa buzilmasin (53)
  - ✔ Kun qatori boshqa kunni ko'rsatsin, kataklar qolsin (51)
  - O'yinchi kunni sezmadi, endi shu joy tezroq tuzatilsin (54)
  - Kun qatori, kataklar va forma noldan qayta yozilsin (51)
- Kalit: **B** (index 1). To'g'ri variant eng uzun emas (C bilan teng); to'rttalasi bir shaklda («…sin»), «buzilmasin» to'g'rida ham, A da ham; «Kun qatori» D da ham.
- To'g'ri izohi: Joy, nima qilish va nima buzilmasligi bor; qanday ko'rsatishni keyin tanlaysiz. (79)
- Xato izohlari (≤60):
  - A: «Qulay» — agent aynan nimani o'zgartiradi? (42)
  - C: Bu kuzatuvning o'zi. Qayerda nima qilinsin — aytildimi? (55)
  - D: Noldan yozilsa, ishlab turgan qism ham buzilishi mumkin. (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ 3-kuzatuv (keyingi iteratsiyalardan biri) — o'quvchi talabni yangi kuzatuvga ko'chiradi; 4-ekran bo'laklari takrorlanmaydi (S-008).
  D — «Botni noldan, butunlay qayta yozaman» (AvtoPizza boti, kirish savoli) bilan bir xato-sinf.

## A3 · Amaliyot 3 — chiqarish va qayta sinov  ← amaliyot bloki (≈18 daq)
- Eyebrow: Amaliyot 3 · qayta sinov
- Sarlavha: **Tuzatishni chiqaring va o'sha vazifa bilan sinang.** (50)
- Mentor: Tuzatish ishladimi — buni siz emas, o'yinchi ko'rsatadi; «1 · Chiqarish»dan boshlang.
- Qadamlar:
  1. **Chiqarish** — terminalda (`maydon` papkasida) uch buyruq. Push'dan keyin sayt 9-darsdagi deploy orqali yangilanadi.
     Prompt qutisi (Siz → terminal · Nusxalash):
     ```
     git add -A
     git commit -m "11-dars: «Band qilish» tugmasi ko'rinadi"
     git push
     ```
  2. **Qayta sinov** — sinfdoshingizga telefonda sayt manzilini bering va vazifani o'qing: «Shanba kuni soat 18:00 ga maydon band qiling.»
     Imkon bo'lsa — saytni oldin ishlatmagan odamga bering. O'sha sinfdosh bo'lsa, u yo'lni eslab qolgan bo'lishi mumkin: natijani shuni hisobga olib yozing.
     Tushuntirmang, kuzating. Sayt yangilanmagan bo'lsa — laptopda telefon o'lchamida (`localhost:5173`) sinang.
  3. **Yozish** — natijani `SINOV.md` oxiriga yozing (shablon):
     Prompt qutisi (Shablon → SINOV.md · Nusxalash):
     ```
     ## Qayta sinov (1-tuzatishdan keyin)
     Kim: {yangi odam / o'sha odam} · Vazifaga ta'siri: {…} · Kuzatuv: {nima ko'rdingiz}
     Keyingi: {«keyin» ro'yxatidagi navbatdagi muammo}
     ```
  4. **O'z g'oyangiz** — shu shablonni o'z g'oyangizga yozing: uyda tuzatishdan keyin o'sha vazifani yangi odamga (bo'lmasa — o'sha odamga) bering va natijani o'z `SINOV.md`'ingizga qo'shing.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (fayl-karta `SINOV.md`, oxirgi ikki bo'lim):
  ```
  ## Talab (1-tuzatish)
  Qayerda: vaqt katagi bosilgach ochiladigan forma
  Nima qilsin: tugma forma bilan birga ekranda ko'rinsin va ism, telefon qatorini yopmasin
  Nima buzilmasin: bandni saqlash, kataklar va band-qildi hodisasi

  ## Qayta sinov (1-tuzatishdan keyin)
  Kim: yangi odam · Vazifaga ta'siri: to'sqinlik yo'q · Kuzatuv: tugmani darrov topdi, band qildi
  Keyingi: band bo'lgandan keyin nima bo'lganini tushunmadi
  ```
- Hammasi bajarilgach (yashil): Bitta iteratsiya tugadi: kuzatish → tuzatish → qayta sinov. Keyingisi «keyin» ro'yxatidan. (90)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-11-done`
- Nishon (bonus): Fix and Retest — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 5-Modul A3 naqshi (push → serverda tekshirish → qayta o'lchash, Mentor «buni siz emas, o'sha odam aytadi»). 2-qadam — 10-darsning o'z so'zi («tushuntirmang, kuzating»).
  2-qadamdagi zaxira yo'l — P-026 (yakuniy va'da bitta tashqi bog'liqlikka osilmaydi). Formula ot-shaklda (§224).

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 3 — «1 — Eng muhim muammo» · 5 — «2 — Aniq talab».

## 7 · Yakun — kartochkalar va keyingi dars  ← QYakun (ichida QKartochka, 172)
- Eyebrow: Tayyor · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Birinchi tuzatish tayyor — qayta sinov yozildi.** (46)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (3):
  - Bu sinovda vazifaga to'sqinlik qilgan muammo birinchi tuzatildi, qolgani navbatda
  - Kuzatuvdan talab yozasiz: qayerda, nima qilsin, nima buzilmasin
  - Tuzatishdan keyin o'sha vazifa bilan qayta sinaysiz
- Kartochkalar (shu ekranda, `QKartochka`; jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Uyga vazifa — yo'q (172.4: ish repo'da; o'z MVP — bloklardagi «O'z g'oyangiz» qadami).
- Keyingi dars — «Pitchingizda kimning hikoyasi bor?». Bugun o'yinchi to'xtagan joy tuzatildi. Pitchda muammo, yechim va sinovdagi real odamning hikoyasi bo'ladi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Stop Finder** — Vazifani to'xtatgan muammoni topdingiz (3-ekran, 1-savol)
- **Clear Request** — Aniq talabni tanladingiz (5-ekran, 2-savol)
- **Fix and Retest** — Tuzatishni o'sha vazifa bilan qayta sinadingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Vazifani to'xtatgan muammo birinchi»
   - `to'xtadi` · Vazifa shu yerda uzildi — Birinchi tuzatiladi, ★ oladi.
   - `bajarildi` · Vazifa qiyin, lekin bajarildi — «keyin» navbatiga.
   - `1` · Bir vaqtda bitta tuzatish — Keyin o'sha vazifa bilan qayta sinov.
   - Sinfga savol: Nega uchala muammoni birga tuzatmaymiz?
2. 2-savol (5-ekran) — «Talab: qayerda · nima qilsin · nima buzilmasin»
   - `Qayerda` · Aniq joy — Forma yoki kun qatori, «butun sayt» emas.
   - `Nima qilsin` · Sababga tegadi — Tugma ko'rinmasdi, shuning uchun joyi tuzatiladi.
   - `Nima buzilmasin` · Ishlab turgani — Band qilish, kataklar, `band-qildi` hodisasi.
   - Sinfga savol: «Kunni sezmadi» — talabning «Qayerda» qatoriga nima yoziladi?
✎ Emoji o'rniga koddan / fayldan bitta qator (S-026): `SINOV.md` ustun qiymatlari va talab qatorlari nomi.

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Sinovdan uch muammo chiqdi. Nechtasini birga tuzatasiz? | Bittasini | Keyin o'sha vazifa bilan, imkon bo'lsa yangi odamda sinaysiz |
| Maydon sinovida qaysi muammo birinchi tuzatildi? | Vazifaga to'sqinlik qilgani | Boshqa holatda yana: nechta odamda takrorlandi, ta'siri qancha |
| Nega bir vaqtda bitta muammo tuzatiladi? | Nima yordam berganini ajratish osonroq | Uchtasi birga tuzatilsa, ajratish qiyin |
| Kuzatuv bilan talabning farqi nima? | Kuzatuv nima bo'lganini, talab nima qilishni aytadi | «Topa olmadi» → «ekranda ko'rinsin» |
| Talab qaysi uch qismdan iborat? | Qayerda, nima qilsin, nima buzilmasin | AvtoPizza botidagi «aniq o'zgarish» ham shu shaklda |
| Tugma ko'rinmasdi. «Chiroyliroq qil» nega yetmaydi? | Sababga tegmaydi | Tugmaning joyi tuzatiladi, rangi emas |
| «Nima buzilmasin» qatoriga nima yoziladi? | Ishlab turgan, kerakli narsalar | Band qilish, kataklar, `band-qildi` hodisasi |
| Agent tuzatdi. Birinchi nimani o'qiysiz? | O'zgargan fayl va qatorlarni | Faqat kerakli joy o'zgarganmi |
| Muammo telefonda chiqdi. Laptopda qanday ko'rasiz? | Brauzerni telefon o'lchamiga o'tkazib | F12, keyin Ctrl+Shift+M |
| Qayta sinovda qaysi vazifa beriladi? | O'sha vazifa | «Shanba kuni soat 18:00 ga maydon band qiling.» |
| Qayta sinovda o'yinchi qiynalsa? | Tushuntirmaysiz, kuzatasiz | Qiynalgan joy — keyingi kuzatuv |
| Kuzatish → tuzatish → qayta sinov. Bu takror nima? | Iteratsiya | Har aylanishda sayt biroz yaxshilanadi |

✎ 5-Modul so'zlari takrorlandi: iteratsiya, chastota va ta'sir, «aniq o'zgarish» (talab bilan bir gapda tenglashtirildi — T-052).
  Kartalar «Endi siz bilasiz» qatorlarini so'zma-so'z takrorlamaydi (§216).

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A B C D A B C D A B C D
1. Sinovdan uch muammo chiqdi. Birinchi nima qilinadi? ✔ Eng muhimini tuzatib, yana sinaladi · Uchalasi bitta promptda tuzatiladi · O'yinchiga sayt qanday ishlashi aytiladi · Sayt noldan, boshqatdan qayta yoziladi
2. Maydon sinovida qaysi muammo birinchi tuzatildi? Eng oson va tez tuzatiladigani · ✔ Odam vazifani bajara olmagani · Kuzatuvda eng oxirgi yozilgani · Eng ko'p so'z bilan yozilgani
3. Nega bir vaqtda bitta muammo tuzatiladi? Agent bittadan ko'pini tushunmaydi · Ikkinchisi keyin o'zi tuzalib qoladi · ✔ Nima yordam berganini ajratish oson · Qolgan muammolar muhim emas
4. «Tugmani topa olmadi» — bu nima? Agentga beriladigan talab · Sayt kodidagi xato qator · Agentga yuboriladigan prompt · ✔ Sinovda yozilgan kuzatuv
5. Talab qaysi uch qismdan iborat? ✔ Qayerda, nima qilsin, nima buzilmasin · Kim, qachon va qancha vaqt ichida · Muammo, sabab va kimning aybi · Sarlavha, matn va rasmning joyi
6. Tugma ko'rinmasdi. «Chiroyliroq qil» nega yetmaydi? Agent rang so'zlarini tushunmaydi · ✔ Tugmaning joyi o'zgarmay qoladi · Chiroyli tugma sekinroq ochiladi · Talabga rang yozib bo'lmaydi
7. «Nima buzilmasin» qatoriga nima yoziladi? Tuzatilishi kerak bo'lgan joy · Agent qo'shishi kerak bo'lgan narsa · ✔ Ishlab turgan, kerakli narsalar · O'yinchining ismi va telefoni
8. Agent tuzatdi. Birinchi nimani o'qiysiz? Agentning «tayyor» degan gapini · Loyihadagi hamma fayllarni · README'dagi eski yozuvlarni · ✔ O'zgargan fayl va qatorlarni
9. Muammo telefonda chiqdi. Laptopda qanday ko'rasiz? ✔ Brauzerni telefon o'lchamiga o'tkazib · Terminalda Backend'ni qayta yoqib · Sahifani katta ekranda yangilab · Database jadvalini ochib ko'rib
10. Qayta sinovda o'yinchiga qaysi vazifa beriladi? Yangi, qiyinroq boshqa vazifa · ✔ Birinchi sinovdagi o'sha vazifa · Faqat tuzatilgan tugmani bosish · Vazifasiz, o'zi aylanib ko'rsin
11. Qayta sinovda o'yinchi qiynalsa, nima qilasiz? Tugmani barmog'ingiz bilan ko'rsatasiz · Saytni qanday ishlatishni aytib berasiz · ✔ Tushuntirmaysiz, kuzatib yozasiz · Sinovni to'xtatib, keyinga qoldirasiz
12. Kuzatish → tuzatish → qayta sinov. Bu takror nima? Deploy · Talab · Pitch · ✔ Iteratsiya

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Fon so'zlari: sinov · kuzatuv · talab · iteratsiya · «Band qilish» · `SINOV.md` · Shanba 18:00 · `dars-11-done` · `web/` · Antigravity · qayta sinov · uch qadam · `POST /bandlar` · Ctrl+Shift+M
✎ To'g'ri variant eng uzun emas (S-006): 1 (35 / 34·40·38) · 5 (37 / 33·29·31) · 9 (37 / 33·31·31) — eng uzun, lekin farq 4 belgigacha; kodda tekshiriladi.
  Strelka faqat 12-savol matnida (variantlarda yo'q). Arenadagi 3 va 12 — 3-ekran va kartochkalar bilan bir fikr, boshqa so'z bilan (S-008).

---

## KOD — razrabotkada qilinadigan narsalar
1. Yangi fayl `src/7-Modull/MvpIterationLesson.jsx` — `src/skelet/NamunaDars.jsx` dan (JR-14, pilotdan nusxa yo'q); palitra `qolipRang('tex')`.
2. `SCREEN_META` 11: hook · plan · concept · practice · test · concept · practice · test · practice · stats · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **1 (B)**; `practice: -1`.
3. **`MAYDON` + `KUZATUV` + `MaydonTel` + `KuzatuvKarta` + `UchQadam`** — bitta manba (180): telefon maketi ikki holatda (*oldin* — tugma ramkadan pastda, *keyin* — ekran pastida qotgan),
   uch kuzatuv (matn, telefondagi joyi, uch qadamga ta'siri: `kech` · `uzildi` · `noaniq`), uch qadam — uch tugun. 0, 1, 2, 4-ekranlar va A1–A3 o'ng tomoni shundan o'qiydi;
   `SINOV.md` fayl-kartasi ham `KUZATUV` dan yig'iladi. Bosiladigan qismlar: `// qolip-maket: mt-katak kz-qator tl-bolak`. Logotip/emoji yo'q (D4).
4. 0-ekran `QKirish` (maket = `MaydonTel` *oldin* + `KuzatuvKarta`, «Sinovni ko'rish»dan keyin variantlar). 2-ekran `QTushuncha` (`zoom`, `tugadi`, `QBashorat` + `QTaxmin`).
   4-ekran `QTushuncha` — uch qator × ikki `QChip` (`holat`, tuzoqda `silk`), telefon tanlovga javob beradi; `QXato` bitta qator.
5. 3 va 5-ekran `QTest` + darsning `QuestionScreen`; xato izohlari ≤60.
6. **`ScreenBlok`** (skeletdan): A1 — 4 qadam, A2 — 5, A3 — 4; oxirgi qadam «O'z g'oyangiz» (qaror 8; 173.2 dagi 4 qadamdan bittasi ortiq — `steps` uzunligi erkin).
   `kimga`: Shablon → SINOV.md · Siz → Antigravity · Siz → terminal. O'ng: A1/A3 — `SINOV.md` fayl-kartasi, A2 — `MaydonTel` *keyin* (kattasi).
   `ortda`: A1 `dars-09-done`, A2/A3 `dars-11-done` (ikkalasida oldin `git fetch … --tags`). 4-qadam nomi A2 da «Brauzerda tekshirish».
7. `RECAPS` 2 (kalit 3 va 5) · `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Stop Finder, 5-ekran → Clear Request, A3 oxirgi «Bajardim» → Fix and Retest.
8. 7-ekran `QYakun`: `uyga` yo'q, `recap` 3 qator, ichida `QKartochka` (12 karta), `keyingi` matni yuqoridagidek.
9. `QUIZ_BANK` 12 savol, kalitlar A·B·C·D ×3 (yuqoridagi tartib); fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
10. `LESSON_META.lessonId` — `m7-11-v1`. `narrow` faqat 3, 5, 6-ekranlarda (171).
11. App.jsx `m7-11` qatoriga `comp: MvpIterationLesson` — asosiy seans («qur» bosqichi).
12. Darvozalar: `npm run gates -- src/7-Modull/MvpIterationLesson.jsx` 12/12 · `lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/390 · surat (1280 + 393).

## REPO — `maydon` ga qo'shiladigan narsalar («qur» bosqichi)
1. **`dars-09-done` da xato holat bo'lishi shart:** telefon o'lchamida (≈390×844) Shanba 18:00 bosilganda forma ochiladi, «Band qilish» ekrandan pastda — ko'rinmaydi.
   Namuna ma'lumotda Shanba 18:00 bo'sh. (9-dars qurilishi bilan kelishiladi — B-bo'lim.)
2. **`dars-11-done`** = `dars-09-done` + bitta tuzatish commit:
   - `web/` forma: «Band qilish» telefon ekranida forma bilan birga ko'rinadi (ekran pastida qotgan); kataklar, `POST /bandlar`, `band-qildi` hodisasi, animatsiyalar o'zgarmagan;
   - `SINOV.md` (repo ildizi, Maydon namunasi): vazifa, uch kuzatuv jadvali (★ / keyin), «Talab (1-tuzatish)», «Qayta sinov (1-tuzatishdan keyin)» — A1/A3 o'ng tomonidagidek;
   - README «Darslar va teglar» jadvaliga 11-dars qatori (10-dars — kodsiz, tegi yo'q).
3. `dars-10-*` teg yo'q: A1 boshlang'ich holati — `dars-09-done`.

## B. Bu darsdan tashqariga chiqadigan narsalar (hozir tegilmaydi)
- 9-dars MD si va repo: `dars-09-done` da tugma forma ostida, telefon ekranidan tashqarida qolishi kerak (aks holda bugungi muammo qayta chiqmaydi).
- 10-dars MD si: kuzatuv yozuvi shu uch qator bilan va «kuzatuv yozuvi» so'zi bilan bo'lishi; vazifa matni aynan «Shanba kuni soat 18:00 ga maydon band qiling.»
- 7-dars MD si: «talab» atamasi va uch qismi (qayerda · nima qilsin · nima buzilmasin) shu yerda kiritiladi deb olindi.
- 12-dars MD si: pitchdagi «real foydalanuvchi hikoyasi» `SINOV.md` dagi qayta sinov yozuvidan olinishi mumkin (keyingi dars ko'prigi shunga tayanadi).

---

## TAYANCHGA SAVOL
1. ~~Uch kuzatuv bitta odamdanmi?~~ — **yopildi** (GATE M K5, audit 3): bitta o'yinchi, bitta sinov, uch to'xtash. Tarix: 1 («tugmani topa olmadi») bo'lsa, o'sha odamda 2 («band bo'lgach tushunmadi») chiqmaydi. Men yozuvda odam sonini aytmadim (sarlavha «Kuzatuv yozuvi»),
   2-ekran esa xronologiyani emas, har muammo uch qadamni qayerda sekinlatishi yoki uzishini ko'rsatadi.
   3-kuzatuv («sezmadi») ta'siri — «kech topdi, vazifa bajarildi» deb olindi; 10-dars yozuvi boshqacha bo'lsa, 2-ekran yorlig'i o'zgaradi. 10-dars yozuvi ikki sinovdan (sinfdosh + uydagi odam) bo'lsa — shunday deb yozish mumkin.
2. **`SINOV.md` fayli** (repo ildizi) — tayanchda yo'q; 5-Modul `FIKRLAR.md` naqshi. 10-dars yozuvni qayerda saqlaydi (dars formasi)? Bu darsda faylga ko'chiriladi.
3. **Tuzatish shakli** — «Band qilish» ekran pastida qotib turadi (forma bilan birga ko'rinadi). Tayanchda faqat «tuzatilgan»; 4-ekran bo'laklari va `dars-11-done` shunga bog'liq.
4. **Repo manzili** `github.com/Azizbekcrypto/maydon` va o'quvchi clone qiladimi yoki fork — «Ortda qoldingizmi» dagi `git fetch … --tags` qatori shunga bog'liq (P-028: manzil «qur»da tekshiriladi).
5. **9-darsdagi deploy** qayerda va push'dan keyin o'zi yangilanadimi — A3 1-qadami shunga tayanadi; zaxira yo'l — laptopda telefon o'lchami.
6. **Telefon o'lchami** — F12 → Ctrl+Shift+M (Chrome). O'quvchilar boshqa brauzerda bo'lsa, yozuv o'zgaradi.
7. **«O'z g'oyangiz» qadami** — 173.2 «4 qadam» deydi, qaror 8 «har blok oxirida bitta qadam». Men qo'shimcha qadam qildim (A1 4, A2 5, A3 4). Qadam nomi «O'z g'oyangiz» — boshqa loyiha kunlari bilan bir xil bo'lishi kerak.
8. **1-test ikkinchi misoli** — maydon egasi sinovi (vazifa: shanba bandlarini ko'rish) va to'rt kuzatuv shu test uchun o'ylab topildi (P-002 ruxsati); tayanchda ega sinovi yo'q.
9. **Keyingi iteratsiya tartibi** — A3 namunasida «Keyingi: 2-muammo». 2-test 3-muammo uchun talab namunasi beradi («boshqa kunni ko'rsatsin» — yechim emas, natija; audit 5). Tartibni men tanladim.
10. **«kuzatuv yozuvi» va «sinov yozuvi»** — topshiriqda «sinov yozuvlari», tayanch 4-jadvalda «kuzatuv yozuvi». Men «kuzatuv yozuvi»ni oldim (T-014).
11. **«talab» va «aniq o'zgarish»** — 7-dars MD si ularni allaqachon tenglashtirgan bo'lsa, bu darsdagi kartochka izohi («AvtoPizza botidagi «aniq o'zgarish» ham shu shaklda») qisqaradi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-10` «Odam ilovangizda qayerda to'xtab qoladi?» → **`m7-11` «Loyiha kuni: sinovdan keyingi tuzatish»** → `m7-12` «Pitchingizda kimning hikoyasi bor?»; reja 02-qadami menyu osti yozuvi bilan so'zma-so'z.
- [x] Bitta misol-ip («Maydon», repo `maydon`) · metafora yo'q · bitta vizual dars bo'yi — «Maydon» telefoni + kuzatuv yozuvi + uch qadam (`MAYDON`/`KUZATUV`; 0, 1, 2, 4, bloklar). Ikkinchi misol faqat 1-testda (ega).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (qator → telefon joyi + uch qadam), 4 (bo'lak → telefon javob beradi); 0-ekran ham harakatli.
- [x] Sarlavha ≤55 bitta qator (32–54) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavha so'zlarini takrorlamaydi · xulosalar ≤110 (59–99) · hook javobi ≤120 (85/113/118) · xato izohlari ≤60 (42–56).
  Belgilar skript bilan sanaldi; yakuniy hukm — `lint:olchov` / `lint:sarlavha` kodda.
- [x] Atamalar tayanch bilan bir xil (sayt · Backend · Database · vaqt katagi · band qilish · o'yinchi · talab · agent · hodisa); 5-Modul so'zlari (iteratsiya, chastota va ta'sir, «aniq o'zgarish», «Boshqa joyga tegma, o'zgargan qatorlarni ayt») grep bilan olindi;
  siz-forma, promptlar agentga buyruq shaklida (T-002), tugmalar ot-shaklda, formula ot-shaklda (§224). «maydon» forma qatori ma'nosida yo'q (T-015).
- [x] Testlar: variantlar teng (41–44 · 51–54), to'g'ri variant eng uzun emas; «buzilmasin» to'g'rida ham, xatoda ham; strelka/qavs yo'q; ✔ o'rni 3-ekran C, 5-ekran B · arena A·B·C·D ×3.
  ✗ qisman: arena 1, 5, 9 da to'g'ri variant 2–4 belgi uzunroq — kodda tenglashtiriladi (S-006).
- [x] Final tartib-mashqi yo'q (172), uya izohi talabi qo'llanmaydi; 4-ekran bo'laklari tartibi kodda aralashtiriladi.
- [x] Emoji yo'q (★ ✓ → ‹ › — belgilar; nishon medali — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — yo'q).
- [x] Ichki kodlar yo'q (o'quvchi matnida modul raqami, «T6», «P1» yo'q; «5-Modul» faqat MD izohlarida, o'quvchiga — «AvtoPizza boti») · tarixiy voqea yo'q · «KOD» (12) va «REPO» (3) ro'yxati to'liq.
- [x] Karta T · P · S (+ PM): T-002/011/014/015/029/039/047/049/052/064 · P-001/002/013/014/015/026/028/036/052/059/062/064/067 · S-001/002/004/006/008/010/015/026/040 — ko'rildi.
  ✗ P-028: repo manzili va deploy yo'li tayanchda yo'q — TAYANCHGA SAVOL 4, 5; «qur» bosqichida tiriklik tekshiriladi.

---

# 9-Modul · 12-dars (PM) «Pitchingizda kimning hikoyasi bor?» — MD v3

Fayl: `src/7-Modull/PmUserStoryPitchLesson.jsx` (yangi) · kalit `m7-12` · 16 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi.
Dars yangi — hamma ekran noldan, to'liq yozilgan. Testlarda to'g'ri javob o'rni: s3 = 2-variant (`correctIdx 1`), s5 = 3 (`2`), s7 = 1 (`0`), s11 = 4 (`3`) — `INLINE_KEYS` shu bilan.
Menyu (App.jsx, DE-205): m7-11 «Loyiha kuni: sinovdan keyingi tuzatish» → **m7-12 «Pitchingizda kimning hikoyasi bor?»** (osti: «muammo, yechim va real foydalanuvchi») → m7-13 «Zaxira dars».
Tur (PM-005): 2-tur sof PM — artefakt yozma matn (uch slaydli pitch), mustaqil ish majburiy. Modulning oxirgi darsi.

---

Tashqi audit (ChatGPT) Filtri: `12-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur):** muammo → yechim → foydalanuvchi pitchi, unda real odamning hikoyasi; sinfdosh oldida repetitsiya. Real foydalanuvchini pitchga taklif qilish — uyga vazifa (qaror 7).
2. **Bugungi asosiy fikr (P-013):** Pitchda raqam yonida bitta real odamning hikoyasi turadi. (12-ekran xulosasi va yakun — so'zma-so'z shu.)
3. **O'tilgan atamalar (8-Modul 14-dars YAKUNIY dan aynan):** slayd (taqdimotning bitta sahifasi) · raqam, u nimani sanadi, u nimani ko'rsatadi · mehnat raqami · «Sahna ekrani» ·
   «Yo'q raqamni o'ylab topmaysiz — bor raqamga izoh berasiz» (bugungi juftligi: «Hikoyani o'ylab topmaysiz — yozuvingizdan olasiz»).
   Pitch (2-Moduldan: qisqa taqdimot) · intervyu · yozuv (intervyu yozuvi, kuzatuv yozuvi) · sinov · fikr va va'da (5-Modul 8-dars: «Ikkalasi ham fikr», «javobi va'da, qilingan ish emas») ·
   bo'lib o'tgan ish (m7-02 osti) · talab · agent · investor.
4. **Yangi atamalar — misoldan KEYIN, bir marta (PM-107):**
   - **hikoya** — bitta real odam bilan bo'lib o'tgan ish. (2-ekranda yorliq bo'lib tug'iladi, 4-ekran xulosasida ta'rif; ta'rif dars bo'yi so'zma-so'z shu, T-042.)
     Bu darsda «hikoya» faqat shu ma'noda (T-015). «User Story» atamasi (3-Modul: bir gaplik formula) o'quvchi matnida ishlatilmaydi — fayl nomida qoladi.
   - **repetitsiya** — sahnadan oldin pitchni ovoz chiqarib aytib ko'rish (12-ekran Mentori; reja tegida kulrang yorliq, P-015).
   - Juftlik (§146 — ikkala yarmi ham nomlanadi): **bo'lib o'tgan ish** ↔ **fikr yoki va'da** (4-ekranda saralashdan keyin).
5. **Raqam va hikoya vazifasi (dars bo'yi bitta gap, 2-ekran xulosasi):** Raqam — 5 suhbatda bu holat necha kishida chiqqani, hikoya — bitta odamda qanday bo'lgani.
6. **Uch slayd nomi (dastur):** Muammo · Yechim · Foydalanuvchi. Muammo slaydida — intervyudagi odamning hikoyasi (sayt hali yo'q edi); Foydalanuvchi slaydida — saytni sinovda ishlatgan odamning hikoyasi va tuzatilgan narsa.
7. **Odam ismsiz (tayanch):** hikoyada odamning ismi emas, kimligi aytiladi (o'yinchi, maydon egasi). Hikoyani aytishga ruxsat — uyga vazifada.
8. **So'zlar (bir ma'no — bir so'z):** sayt (frontend emas) · band qilish · vaqt katagi · o'yinchi · maydon egasi (mijoz, admin emas) · zal (pitchni tinglaydiganlar) · slayd (varaq emas — bu darsda Canva'da ham «slayd»).
9. **Toza yuza (185-qonun):** tugma, variant, karta, yorliq, recap'da emoji yo'q. O'yin qatlami (arena, nishon medali, podium) — mustasno.

## Darsning ipi va bitta vizual

- **Modul ipi — «Maydon»** (tayanch, o'zgarishsiz): muammo «Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak» → 5 intervyu
  (4/5 «oxirgi marta kelganimizda maydon band edi», 3/5 «egasi telefonni ko'tarmadi», 2/5 «jamoaga odam yetmadi», 1/5 «pulni bo'lishish qiyin») → MVP (kun bo'yicha vaqt kataklari, band qilish) →
  sinov vazifasi «Shanba kuni soat 18:00 ga maydon band qiling» → kuzatuv: o'yinchi «Band qilish» tugmasini topa olmadi (forma ostida, ko'rinmaydi) → 11-darsda tuzatildi → **bugun pitch**.
- **Dars ipi:** hook'da ikki slayd (raqamli / odamning gapi) → 2-ekranda ular bitta slaydga birlashadi → 4-ekranda qaysi gap yozuvda borligi ajratiladi → 6-ekran Canva: muammo real odamlardan,
  pitchda ko'rinadigan qilingan → 8-ekranda «Maydon» pitchi uch slaydga yig'iladi → 9-ekranda o'quvchi o'z pitchini yozadi → 12-ekranda sinfdosh oldida aytadi → uyda real foydalanuvchiga.
- **Mentor misolidagi ikki hikoya (bitta manba `MAYDON`, 180-qonun):**
  - intervyu hikoyasi (o'yinchi gapi, 3-darsdagi **1-yozuv** so'zma-so'z — audit 2: agregat sonlardan hikoya yasalmaydi): «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.»
  - sinov hikoyasi: Sinovda o'yinchi shanba 18:00 ga band qilmoqchi bo'ldi, lekin «Band qilish» tugmasini topa olmadi. · tuzatish va qayta sinov (11-dars `SINOV.md`): Tugmani ekran pastiga qotirdik — qayta sinovda yangi o'yinchi darrov band qildi. (TAYANCHGA SAVOL 2)
- **Bitta vizual — Sahna (`PitchSahna`, dars bo'yi):** 8-Modul 14-dars «Sahna ekrani» slaydining davomi. Tepada 1–3 ta oq slayd-karta tasma bo'lib turadi
  (1 **Muammo** · 2 **Yechim** · 3 **Foydalanuvchi**; har birida bo'sh qatorlar), ostida **zal**: to'rtta chizilgan bosh-siluet (CSS doira + yarim doira, emoji emas) va ular ustida bitta **savol pufagi**.
  - Qator holatlari: bo'sh (kulrang uzuq chiziq) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent chegara) → xato (`err` fon) → slayd to'liq (chap chetda yashil chiziq).
  - Zal: slayd to'lmaguncha pufakda savol («Bu qanday bo'lgan?», «Bu nechta odamda bo'lgan?», «Sayt nima qiladi?», «Kimdir ishlatib ko'rdimi?»); to'liq bo'lsa pufak o'rnida yashil ✓.
  - Ishlatiladi: 0 (ikki slayd) · 1 (uch slayd skeleti) · 2 (bitta slayd) · 8 · 9 · 12 (uch slayd). Canva (6) — o'z keys-maketi `CanvaMock` (PM-029). 4-ekranda yozuv kartalari (saralash maketi).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon» pitchi
- Sarlavha: **4 / 5 raqami ortida nima bor?** (28)
- Mentor: Sahnada «Maydon» pitchi — loyihaning qisqa taqdimoti. Ikkala slayd ham intervyu yozuvlaridan olingan, ikkalasi ham rost.
- Maket (chap): Sahna — ikki slayd yonma-yon (yorliq «Sahna ekrani»):
  - 1-slayd: katta `4 / 5`, ostida: 5 suhbatdan «maydon band edi» deganlar
  - 2-slayd: «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.»
  - ostida zal — jim.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Beshta suhbatdan to'rttasida shu holat chiqqani (47)
  - To'rt odamning har biri boshidan kechirgan kun (46)
- Javob (ikkalasiga bir xil, maqtovsiz — J-026): Ikkalasi ham rost. Raqam suhbatlarda necha kishida chiqqanini aytadi, hikoya — o'sha kunlardan birini. (102)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan slayd bir lahza ko'tariladi, zaldagi to'rt bosh unga buriladi; keyin ikki slayd orasida «+» belgisi paydo bo'ladi
  (ikkinchi slayd xiralashmaydi — ikkala tanlov teng, P-016). Jonli darsda ovozlar chizig'i — har variant va ovozlar soni.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun loyihangiz pitchini yozib, aytib ko'rasiz.** (48)
- Mentor: Intervyu va kuzatuv yozuvlaringizni yoningizga oling — bugun ular kerak bo'ladi.
- Chap: «Dars oxirida — pitch: muammo, yechim va real foydalanuvchi» + Sahna: uch slayd skeleti (nomlari Muammo · Yechim · Foydalanuvchi),
  kulrang chiziqlar 0.9 s oraliqda birma-bir to'q chiziqqa aylanadi (matnsiz — keyingi ekranlar javobini ochmaydi, P-015), oxirida zal ustida ✓.
- O'ng (01 · matn · teg; bosilmaydi):
  - 01 · Raqam yonida yana nima turishini ko'rasiz · `raqam`
  - 02 · Pitchga qaysi gap chiqishini ajratasiz · `yozuv`
  - 03 · Mashhur sayt muammoni qanday ko'rsatganini bilib olasiz · `biznes`
  - 04 · Loyihangiz pitchini yozib, sinfdoshga aytasiz · `repetitsiya`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi.
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Raqam va hikoya  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · raqam yonida
- Sarlavha: **Raqamdan keyin zal yana nimani so'raydi?** (40)
- Mentor: Raqam slaydini o'tgan modulda yozgansiz — endi unga yozuvdan bo'laklar qo'shib, zalga qarang.
- Bashorat (ballsiz, 181-qonun): **Qaysi holat muammoni aniqroq ko'rsatadi?** · Slaydda faqat raqam bo'lsa · Slaydda faqat bitta voqea bo'lsa · Ikkalasi birga bo'lsa — tanlov saqlanadi, qadamlar shundan keyin ochiladi.
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8; joriysi accent, o'tgani ✓): 1 Raqamni qo'ying · 2 Raqam o'rniga bitta odam bilan bo'lgan voqeani qo'ying · 3 Ikkalasini birga qo'ying.
- O'ng — Sahna: bitta slayd **Muammo**, sarlavha qatori «Maydonga kelasiz — band», ostida ikki bo'sh qator.
- **Harakat → Vizual o'zgarish:** joriy qadam tugmasini bosish → slayd o'zgaradi va zal pufagi javob beradi:
  1. slaydga uch qator yoziladi: `4 / 5` · 5 suhbatdan «maydon band edi» deganlar · demak bu bitta odamning gapi emas → pufak «Bu qanday bo'lgan?»
  2. raqam chiqib ketadi, o'rniga: «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» → pufak «Bu nechta odamda bo'lgan?»
  3. ikkalasi birga: raqam tepada, gap ostida → pufak o'rnida ✓, slayd chap chetida yashil chiziq; qatorlar ustida yorliqlar paydo bo'ladi: **raqam** · **hikoya** (atama — misoldan keyin).
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: ikkalasi birga bo'lsa» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Keyingi qadamni bosing — zal yana nima so'rashini ko'ring.
- Xulosa: Raqam — 5 suhbatda bu holat necha kishida chiqqani, hikoya — bitta odamda qanday bo'lgani. (90)
- Tugma (pastki): Qadamlarni bajaring (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, slayd butun enga (DE-199).
- O'qituvchi eslatmasi: 2-qadamdan keyin sinfdan so'rang — shu gapni eshitib, muammo nechta odamda ekanini bildingizmi?

## 3 · 1-savol  ← QTest (✔ 2-variant, `correctIdx 1`)
- Eyebrow: Tekshiruv · raqam yonida
- Savol: **Slaydda «4 / 5» turibdi. Yoniga yana nima qo'yasiz?** (9 so'z)
  - A — O'yinchilar sonini yana bir marta (33)
  - ✔ B — Bitta o'yinchi bilan bo'lgan ishni (34)
  - C — O'yinchilarga bergan savollaringizni (36)
  - D — Saytning bosh sahifasidan rasmni (32)
- To'g'ri izohi: Raqam 5 suhbatda necha kishida chiqqanini aytdi, bitta odamning ishi — qanday bo'lganini.
- Xato izohlari: A — Son takrorlansa ham, qanday bo'lgani aytilmaydi. (48) · C — Savollar ro'yxati muammo qanday bo'lganini aytmaydi. (52) ·
  D — Sayt rasmi yechimni ko'rsatadi, muammoni emas. (46) · umumiy — Zal muammo qanday bo'lganini bilishi kerak. (43)
- Yozuvlar (barcha testlarda bir xil, qolip): To'g'ri · Qaytadan urinib ko'ring · (jonli darsda xato tanlansa) To'g'ri javob: X — …

## 4 · Bo'lib o'tganmi?  ← QTushuncha (saralash; audit 5 — «yozuvda bor» va «bo'lib o'tgan ish» bir xil emas)
- Eyebrow: Tushuncha · yozuvdan olingan gap
- Sarlavha: **Qaysi gap haqiqatan bo'lib o'tgan?** (34)
- Mentor: Pitch uchun oltita gap yozildi. Yozuvni tekshirib, har birini o'z tomoniga joylang.
- Bashorat (ballsiz): **Olti gapdan nechtasi bo'lib o'tgan ish?** · 2 · 3 · 4
- Vizual (ikki tomon, bir balandlikda):
  - chap **Bo'lib o'tgan ish** — ostida ikki yozuv kartasi (tekshirish uchun):
    «Intervyu yozuvlari · 5» — 4 qator, yonida son: «oxirgi marta kelganimizda maydon band edi» 4 · «egasi telefonni ko'tarmadi» 3 · «jamoaga odam yetmadi» 2 · «pulni bo'lishish qiyin» 1;
    «Kuzatuv yozuvi · sinov» — 3 qator: «Band qilish» tugmasini topa olmadi · band bo'lgandan keyin nima bo'lganini tushunmadi · kunni almashtirishni sezmadi;
  - o'ng **Fikr yoki va'da** — bo'sh ustun (uzuq chiziqli joy, U-041);
  - tepada 6 gap-karta, aralash tartibda.
- Gaplar (to'g'ri tomoni — kodda `GAPLAR`):
  1. «O'tgan juma do'stlar bilan keldik — maydon band edi» — Bo'lib o'tgan ish (intervyu, 1-yozuv)
  2. «Kelishdan oldin egasiga qo'ng'iroq qilgandim, ko'tarmadi» — Bo'lib o'tgan ish (intervyu, 1-yozuv)
  3. Sinovda o'yinchi «Band qilish» tugmasini topa olmadi — Bo'lib o'tgan ish (kuzatuv, 1-qator)
  4. Bunday sayt hamma o'yinchiga kerak — Fikr yoki va'da
  5. O'yinchilar saytni albatta ishlatadi — Fikr yoki va'da
  6. Sayt juda qulay chiqdi — Fikr yoki va'da
- **Harakat → Vizual o'zgarish:** gap-kartani bosib, tomonni bosish (yoki sudrash) → «Bo'lib o'tgan ish»ga to'g'ri tushsa, yozuv kartasidagi mos qator yashil ajraladi va karta shu qator yoniga ixcham chip bo'lib o'tiradi;
  «Fikr yoki va'da»ga to'g'ri tushsa, karta o'ng ustunga tushadi, yozuv kartalari ustidan bir lahza kulrang chiziq o'tadi (mos qator topilmadi).
  Noto'g'ri tomon → karta silkinib qaytadi, bitta `QXato`:
  - voqea «Fikr yoki va'da»ga: Bu yerda odam bilan bo'lgan voqea bor — yozuvni o'qing. (55)
  - fikr «Bo'lib o'tgan ish»ga: Bu fikr yoki va'da — yozuvda bunday voqea yo'q. (47)
- 6/6 da tomonlar ostida nom paydo bo'ladi: chap **bo'lib o'tgan ish** · o'ng **fikr yoki va'da**. Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 3».
- Xulosa: Hikoya — bitta real odam bilan bo'lib o'tgan ish. U yozuvdan olinadi, o'ylab topilmaydi. (88)
- Tugma (pastki): 6 gapni joylang (N/6) → Davom etish · `tugadi`: kartalar paneli yopiladi, ikki tomon butun enga.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato bo'lsa) Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: «Sayt juda qulay chiqdi» kuzatuv yozuviga hatto zid — sinovda o'yinchi tugmani topa olmagan. Shuni sinfdan so'rang.

## 5 · 2-savol  ← QTest (✔ 3-variant, `correctIdx 2`; boshqa tanish olam — P-002)
- Eyebrow: Tekshiruv · hikoya
- Savol: **Navbat ilovasi pitchida qaysi gap hikoya bo'ladi?** (7 so'z) — navbat ilovasi: 8-Modul 12/14-darsdagi sartaroshxona ilovasi.
  - A — Bunday ilova hamma odamga kerak (31)
  - B — Odamlar ilovani albatta ishlatadi (33)
  - ✔ C — Kecha bir odam sartaroshda uzoq kutdi (37)
  - D — Ilova juda qulay va tushunarli chiqdi (37)
- To'g'ri izohi: Unda bitta odam bilan bo'lib o'tgan ish bor.
- Xato izohlari: A — Bu fikr: unda hech kim bilan bo'lgan ish yo'q. (46) · B — Bu va'da: odamlar hali hech narsa qilmagan. (43) ·
  D — «Qulay» degani fikr: kim, qachon, nima qildi — aytilmagan. (58) · umumiy — Bitta odam bilan bo'lib o'tgan ishni toping. (44)

## 6 · Canva  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Canva muammosi qayerdan chiqqan?** (32)
- Mentor: Canva — taqdimot va rasm yasaydigan sayt. Uni boshlagan Melanie Perkins avval universitetda o'qigan.
- Nuqtalar: 6 ta · yorliq **Canva · N/6** (bashorat kartasida ham) · maket `CanvaMock`: chizilgan dastur oynasi va taqdimot slaydlari; «Canva» nom-yorlig'i o'z rangida (182-qonun), logotip yo'q, son yo'q.
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/6 **Talabalarga dars bergan talaba** — Melanie universitetda o'qib yurib, boshqa talabalarga dizayn dasturlarini o'rgatgan. · maket: tugmalari ko'p dastur oynasi, oldida uchta talaba-siluet
  - 2/6 bashorat — **Talabalar nimaga qiynalgan?** · Chiroyli rang tanlashga · ✔ Tugmalar qayerdaligini o'rganishga · Ishni vaqtida topshirishga
  - 3/6 **Tugma qidirib o'tgan vaqt** — Melanie aytishicha, tugmalar qayerdaligini o'rganishning o'ziga juda ko'p vaqt ketgan. Bu muammoni u talabalarda o'z ko'zi bilan ko'rgan. ·
    maket: kursor tugmalar orasida adashib yuradi, tugmalar birma-bir yonib o'chadi
  - 4/6 **Uch yil pitch** — U g'oyasini investorlarga — loyihaga pul tikadigan odamlarga — uch yilga yaqin pitch qilgan. Har rad javobidan keyin taqdimotini yaxshilagan. ·
    maket: taqdimot slaydlari ustida bir necha marta rad belgisi (✗), har safar slaydlar qayta tartiblanadi
  - 5/6 bashorat — **Investor «sohangizni tushunmayapman» degan. Melanie qanday slayd qo'shgan?** · Jamoasini tanishtiradigan slayd · ✔ Dizayn qanchalik murakkabligini ko'rsatadigan slayd · Kelajakdagi daromadni ko'rsatadigan slayd
  - 6/6 **Muammo ko'rinadigan bo'ldi** — Yangi slayd hozirgi dizayn ishi qanday bo'lishini va qanchalik murakkabligini ko'rsatgan. · maket: taqdimotga yangi slayd kiradi — ichida ko'p qadamli chigal chiziq
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `CanvaMock` holati o'zgaradi: kirish (dastur oynasi + talabalar) → qidiruv (kursor adashadi) →
  pitch (rad belgilari, slaydlar qayta tartiblanadi) → yangi slayd (chigal chiziq). Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (6/6 dan keyin, hisoblagichsiz): Canva muammosi o'ylab topilmagan — Melanie uni talabalarda ko'rgan va pitchda ko'rinadigan qilgan. (98)
- Tugma (pastki): Keyingi bosqich (N/6) → Davom etish
- O'qituvchi eslatmasi: Melanie gaplari — Guy Kawasaki bilan suhbatdan (manba pastda). «Rad javobi» — investor pul tikmaslikka qaror qilgani.
- Manba (o'quvchiga ko'rinmaydi; 05.10.2026 ochib tekshirildi): Guy Kawasaki, «Remarkable People» — Melanie Perkins suhbati, https://guykawasaki.com/melanie-perkins-canva-ceo/ :
  «I was teaching design programs and students would struggle learning the very basics. It would take a very long time to learn where the buttons were…» ·
  «It was like three years of pitching» · «Every time we were rejected, we would refine our pitch deck» · investor «I don't understand your industry» deganda —
  «how the current design process works and how it's really complicated» sahifasi qo'shilgan. Universitet (Western Australia, 2007) — CNBC Make It, 09.01.2020,
  https://www.cnbc.com/2020/01/09/canva-how-melanie-perkins-built-a-3point2-billion-dollar-design-start-up.html (sahifa 403 berdi — qidiruv parchasi orqali; yil va universitet nomi o'quvchi matnida yo'q).

## 7 · 3-savol  ← QTest (✔ 1-variant, `correctIdx 0`; Canva qoidasi «Maydon»ga)
- Eyebrow: Tekshiruv · Canva'dagidek
- Savol: **Zal «Maydon» muammosini tushunmadi. Pitchga nima qo'shasiz?** (8 so'z)
  - ✔ A — Maydon band bo'lgan kun haqida slayd (36)
  - B — Saytni qurishga ketgan haftalar slaydi (38)
  - C — Saytning yangi dizayni haqida slayd (35)
  - D — Keyin qo'shiladigan to'lov slaydi (33)
- To'g'ri izohi: Canva'dagidek: muammo qanday bo'lishini ko'rsatadigan slayd qo'shiladi.
- Xato izohlari: B — Qurishga ketgan vaqt — mehnat raqami, muammo emas. (50) · C — Dizayn yechim haqida — muammoni ko'rsatmaydi. (45) ·
  D — To'lov keyin qilinadi — u muammoni ko'rsatmaydi. (48) · umumiy — Muammo qanday bo'lishini ko'rsating. (36)

## 8 · Uch slayd  ← QTushuncha
- Eyebrow: Tushuncha · uch slayd
- Sarlavha: **Qaysi hikoya qaysi slaydga chiqadi?** (35)
- Mentor: Beshta bo'lak «Maydon» yozuvlaridan va saytidan — har birini o'z slaydiga joylang.
- Qator (`QIzoh`, uch slayd ustida; audit 6): Foydalanuvchi slaydida kimligi emas, saytni ishlatganda nima bo'lgani ko'rinadi. (80)
- Bashorat (ballsiz): **Sinovdagi o'yinchining hikoyasi qaysi slaydga chiqadi?** · Muammo · Yechim · Foydalanuvchi
- Vizual: Sahna — uch slaydli tasma: 1 **Muammo** · 2 **Yechim** · 3 **Foydalanuvchi** (har birida bo'sh qatorlar); ostida zal.
- Bo'laklar (5, aralash tartibda — kodda `BOLAKLAR`):
  1. `4 / 5` · intervyuda «maydon band edi» deganlar → Muammo
  2. «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» → Muammo
  3. Sayt kun bo'yicha bo'sh vaqt kataklarini ko'rsatadi, katakni band qiladi → Yechim
  4. Sinovda o'yinchi shanba 18:00 ga band qilmoqchi bo'ldi, lekin «Band qilish» tugmasini topa olmadi → Foydalanuvchi
  5. Tugmani ekran pastiga qotirdik — qayta sinovda yangi o'yinchi darrov band qildi → Foydalanuvchi (11-dars `SINOV.md`)
- **Harakat → Vizual o'zgarish:** bo'lakni tanlab, slaydni bosish (yoki sudrash) → to'g'ri bo'lsa bo'lak slaydga yoziladi (bir lahza ajralib kiradi), to'lgan slayd chap chetida yashil chiziq;
  zal pufagi to'lmagan birinchi slayd ustida turadi: Muammo — «Bu qanday bo'lgan?» · Yechim — «Sayt nima qiladi?» · Foydalanuvchi — «Kimdir ishlatib ko'rdimi?».
  Noto'g'ri slayd → bo'lak silkinib qaytadi, bitta `QXato`:
  - intervyu hikoyasi Foydalanuvchi slaydiga: Intervyuda sayt hali yo'q edi — bu muammo hikoyasi. (51)
  - sinov hikoyasi Muammo slaydiga: Bu odam saytni ishlatgan — u foydalanuvchi haqida. (50)
  - raqam boshqa slaydga: Bu raqam suhbatlarda necha kishida chiqqanini sanaydi. (54)
  - yechim gapi boshqa slaydga: Bu gap sayt nima qilishini aytadi. (34)
  - tuzatish boshqa slaydga: Bu sinovdan keyin tuzatilgan narsa. (35)
  5/5 da zal ✓; slayd nomlari ostida manba yorliqlari chiqadi: «intervyudan» · «saytdan» · «sinovdan». Natija qatori (`QTaxmin`).
- Xulosa: Muammo slaydiga intervyudagi odamning hikoyasi, foydalanuvchi slaydiga sinovdagi odamning hikoyasi chiqadi. (107)
- Tugma (pastki): 5 bo'lakni joylang (N/5) → Davom etish · `tugadi`: bo'laklar paneli yopiladi, uch slayd butun enga.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: Sinfdan so'rang — intervyudagi o'yinchi nega foydalanuvchi slaydiga chiqmaydi? (U paytda sayt hali yo'q edi.)

## 9 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Loyihangiz pitchini uch slaydda yozing.** (39)
- Mentor: Yozuvlaringizni yoningizga oching. Hikoyadagi odamning ismini emas, kimligini yozing.
- Bitta ustun: Sahna (uch slayd; qatorlar = qadamlar 1/2/3/4, joriy qator accent) → forma (har qadamda bitta maydon) → Yordam · «Slaydga chiqarish» o'ngda (187-qonun).
- Qadamlar va maydon maslahati (placeholder, §32 — qisqa, tayyor javobsiz):
  1. raqam (Muammo slaydi) — Necha kishidan nechtasi shu muammoni aytdi?
  2. muammo hikoyasi (Muammo slaydi) — Kim edi, nima qilmoqchi edi, nima bo'ldi?
  3. yechim (Yechim slaydi) — Saytingiz shu muammoni qanday hal qiladi?
  4. sinov hikoyasi (Foydalanuvchi slaydi) — Sinovda odam nimaga qoqildi, siz nimani tuzatdingiz?
- Tekshiruv (`QXato`, ≤60; faqat 1-qadam bloklaydi, qolgani yo'naltiradi; javob forma ostida, yozilgan zahoti — 106d):
  - 1-qadamda son yo'q: Raqam qatoriga intervyudagi sonni yozing. (41)
  - 2/4-qadamda «hamma», «ko'pchilik», «har kim»: Hikoya bitta odam haqida — u kim edi? (37)
  - 2/4-qadamda «albatta», «kerak», «yoqadi», «qulay», «zo'r»: Fikrga o'xshaydi — yozuvda aynan shunday gap bormi? (51)
  - o'tgan qator (ikki tomonlama javob, 106d-a): qator slayd ichida yashil chiziq oladi — alohida maqtov-matni yo'q.
- Doimiy qator (forma ostida): Hikoyani o'ylab topmaysiz — yozuvingizdan olasiz.
- Yordam: Real odam bilan hali gaplashmagan bo'lsangiz — sinfdosh bilan mashqdagi yozuvni oling. Sinovdan keyin hali tuzatmagan bo'lsangiz — topilgan muammoni yozing.
- **Harakat → Vizual o'zgarish:** qatorni yozib «Slaydga chiqarish» → qator o'z slaydiga kiradi, joriy belgi keyingi qatorga o'tadi; tekshiruvdan o'tgan qator yashil chiziq oladi,
  o'tmagani `err` fonda va ostida bitta `QXato`; zal pufagi slayd bo'yicha («Bu qanday bo'lgan?» → «Sayt nima qiladi?» → «Kimdir ishlatib ko'rdimi?» → ✓).
  4/4 da forma yopiladi, uch slayd butun enga (DE-199), har qator yonida ✎ (tahrirlash).
- Xulosa: Pitchingizning uch slaydi tayyor: muammo, yechim va foydalanuvchi. (66)
- Tugma (pastki): To'rt qatorni yozing (N/4) → Davom etish
- Artefakt-strip (U-042): shu ekrandan — «Pitchim» (ixcham, uch slayd holati «2/3»); 10, 12, 14, 15-ekranlarda ko'rinadi, test, arena va podiumda yo'q.

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish
- Sarlavha: **Bo'lib o'tgan ishlarni ajratadigan kod yozamiz.** (46) — PM-082(a) sarlavha oilasi
- Mentor: Gaplarni qo'lda ajratgan edingiz — endi shu ishni kod bajaradi. Gaplar o'sha «Maydon» pitchidan.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Kod gapni qaysi qiymatga qarab ajratadi?** · `matn` · `qism` · ✔ `turi`
  - xato `matn`: `matn` — gapning o'zi; uning turi alohida yozilgan. (49, belgisiz)
  - xato `qism`: `qism` — slayd nomi; gapning turini aytmaydi. (45, belgisiz)
- Chap (vazifa, 3 band): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ro'yxatga faqat bo'lib o'tgan ishlar tushadi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Bitta gapdan boshlang: uning `turi` qiymati `"bo'lib o'tgan ish"` mi? Ishlagach qolganlariga o'ting.
  Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `console.log` — qiymatni ekranga chiqaradi.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
  «Kompilyator» ta'riflanmaydi (MATN_ETALONI lug'ati: oyna kompilyator emas).
- Kod:
```js
// «Maydon» pitchi uchun yozilgan gaplar (saralashdan tanish)
const gaplar = [
  { matn: "O'tgan juma keldik — maydon band edi", qism: "muammo", turi: "bo'lib o'tgan ish" },
  { matn: "Bunday sayt hamma o'yinchiga kerak", qism: "muammo", turi: "fikr" },
  { matn: "«Band qilish» tugmasini topa olmadi", qism: "foydalanuvchi", turi: "bo'lib o'tgan ish" },
  { matn: "Sayt juda qulay chiqdi", qism: "foydalanuvchi", turi: "fikr" }
];

function hikoyalar(royxat) {
  // bo'lib o'tgan ishlarning matni
  return [];   // shu joyni siz yozasiz
}

console.log(hikoyalar(gaplar));
// ["O'tgan juma keldik — maydon band edi", "«Band qilish» tugmasini topa olmadi"]
console.log(hikoyalar([gaplar[2]]));
// ["«Band qilish» tugmasini topa olmadi"]
console.log(hikoyalar([gaplar[1], gaplar[0]]));
// ["O'tgan juma keldik — maydon band edi"]
```
- Boshlang'ich kod tekshiruvi (§140-B): `return []` hech bir kutilgan natijaga teng emas — tegilmagan kod 0/3.
- Kod oynasi sarlavhasi: `app.js — hikoyalar funksiyasini yakunlang` · placeholder: `// bo'lib o'tgan ishlarni yig'ib qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: to'rt gapdan ikkitasi tushadi. (58) · 2 — Ro'yxatga faqat bo'lib o'tgan ish tushsin, fikr emas. (53) ·
  3 — Kichik ro'yxatda ham faqat yozuvdan olingani qolsin. (52)
- **Harakat → Vizual o'zgarish:** darvozada `turi` tanlanadi → kod namunasida `turi` qiymatlari bir lahza ajraladi; kod ishga tushganda Console'da ro'yxat chiqadi, shartlar birma-bir ✓ bo'ladi.

## 11 · Yakuniy savol  ← QTest (✔ 4-variant, `correctIdx 3`; ikki qoida birga, boshqa tanish olam)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Navbat ilovasi pitchi: foydalanuvchi slaydiga nima chiqadi?** (8 so'z)
  - A — Intervyuda navbat kutib qiynalganlar soni (41)
  - B — Ilovani hamma albatta ishlatadi degan gap (41)
  - C — Ilovani qurishga ketgan besh haftalik ish (41)
  - ✔ D — Sinovda bir odam vaqt tanlay olmagani (37)
- To'g'ri izohi: Foydalanuvchi slaydiga ilovani sinovda ishlatgan odamning hikoyasi chiqadi.
- Xato izohlari: A — Bu son intervyudan — u muammo slaydiga chiqadi. (47) · B — Bu va'da: hali bo'lib o'tmagan. (31) ·
  C — Bu mehnat raqami — foydalanuvchi haqida emas. (45) · umumiy — Ilovani ishlatgan odamning hikoyasini toping. (45)

## 12 · Repetitsiya  ← QMustaqil (2 qadam)
- Eyebrow: Mashq · sinfdosh oldida
- Sarlavha: **Pitchingizni 1 daqiqada tushuntira olasizmi?** (44)
- Mentor: Sahnadan oldin pitchni ovoz chiqarib aytib ko'rish repetitsiya deyiladi. Avval {sinfdoshingizga | o'zingizga} 1 daqiqada ayting, keyin bir qator yozing.
- Qadamlar 1/2: 1 Sinfdoshingizga ayting | Ovoz chiqarib ayting · 2 Endi bir qator yozing
  - Jonli taymer (juftlik, 2 daqiqa): Har biringizga 1 daqiqadan — avval A, keyin B. · 2 daqiqani boshlash · Hozir A gapiradi · Hozir B gapiradi · To'xtatish · Yana 2 daqiqa
  - Mustaqil taymer (1 daqiqa): 1 daqiqani boshlash · Hozir ovoz chiqarib ayting · To'xtatish · Yana 1 daqiqa
- Maydon maslahati: (juftlikda) Sinfdoshingiz qaysi odamni va uning qaysi muammosini eslab qoldi? | (mustaqil) Qaysi odamning hikoyasini va muammosini aytdingiz?
- Vizual: 9-ekrandagi pitch — uch slayd, qatorlar yopiq (kulrang chiziq). 9-ekran yozilmagan bo'lsa (mentor rejimi) — «Maydon» pitchi yopiq holda.
- **Harakat → Vizual o'zgarish:** taymer → aytish; qator yozilgach (≥8 belgi) yopiq slaydlar ochiladi — o'quvchi eslab qolingan odam qaysi slaydda turganini o'zi ko'radi.
- Xulosa (yozgach): Bugungi qoida: pitchda raqam yonida bitta real odamning hikoyasi turadi. (72)
- Tugmalar: Orqaga · Davom etish
- O'qituvchi eslatmasi (`MentorNote`): Tinglovchi baho bermaydi — faqat eslab qolgan odamini aytadi. Hikoya esda qolmagan bo'lsa, u raqam yonida turibdimi — birga tekshiring.
- Nishon: Rehearsal Done (taymer tugagach va qator yozilgach).

## 13 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti.
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Raqam yoniga nima · 2 — Qaysi gap hikoya · 3 — Canva'dagidek · 4 — Foydalanuvchi slaydi

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon | Orqa tomon |
|---|---|
| Raqam va hikoya pitchda nimani ko'rsatadi? | Raqam — 5 suhbatda necha kishida chiqqani; hikoya — bitta odamda qanday bo'lgani |
| Hikoya nima? | Bitta real odam bilan bo'lib o'tgan ish |
| Hikoya qayerdan olinadi? | Intervyu yoki kuzatuv yozuvidan — o'ylab topilmaydi |
| «Bunday sayt hammaga kerak» — hikoyami? | Yo'q, bu fikr: unda bo'lib o'tgan ish yo'q |
| Raqam yolg'iz tursa, zal nimani so'raydi? | «Bu qanday bo'lgan?» |
| Pitch qaysi uch slayddan iborat? | Muammo, yechim va foydalanuvchi |
| Muammo va foydalanuvchi slaydida kimning hikoyasi turadi? | Muammoda — intervyudagi odamning; foydalanuvchida — saytni sinovda ishlatgan odamning |
| Sinov hikoyasi yonida nima turadi? | Sinovdan keyin tuzatilgan narsa |
| Canva g'oyasi qayerdan chiqqan? | Melanie Perkins dars bergan talabalar tugma qidirib qiynalganidan |
| Investor tushunmaganda Canva pitchiga nima qo'shilgan? | Dizayn qanchalik murakkabligini ko'rsatadigan slayd |
| Repetitsiya nima? | Sahnadan oldin pitchni ovoz chiqarib aytib ko'rish |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 11/11 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi atama darsda bor (hikoya — 2/4, repetitsiya — 12, Canva — 6, «Bu qanday bo'lgan?» — 2).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Pitchingizda endi real odamning hikoyasi bor.** (45)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Endi siz bilasiz (modul yo'li):
  - Mahsulot — odamlar o'z muammosi uchun ishlatadigan narsa; u real odamning muammosidan boshlanadi.
  - Muammoni o'rganadigan intervyuda odamning fikri emas, bo'lib o'tgan ishi so'raladi.
  - Agent MVP qurishda talabingizga tayanadi, siz natijani tekshirasiz; animatsiya uni jonli qiladi.
  - Sinovda tushuntirilmaydi — odam qayerda to'xtashi kuzatiladi.
  - Pitchda raqam yonida bitta real odamning hikoyasi turadi.
- Uyga vazifa (karta, P-025): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: sinovda saytingizni ishlatgan real odam · Nechta: 1 pitch · Muddat: zaxira darsgacha
  - ① Sinovda saytingizni ishlatgan odamdan ruxsat so'rang: hikoyasini ismsiz aytasiz.
  - ② Uni pitchingizni tinglashga taklif qiling va 1 daqiqada aytib bering. Kelolmasa — ruxsati bilan hikoyani ismsiz boshqa tinglovchiga ayting.
  - ③ Hikoya u bilan bo'lgandek aytildimi — so'rang; tuzatsa, slaydga yozing.
  - Karta ostida (bitta kulrang qator): Real odam hali sinamagan bo'lsa — avval u bilan sinov o'tkazing, keyin pitch.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — Zaxira dars: ortda qolgan ishni yetkazasiz va pitchni sayqallaysiz.
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Story Finder!** (4-ekran, birinchi urinishda xatosiz) — Olti gapdan yozuvda borini ajratdingiz
- **Pitch Builder!** (8-ekran, birinchi urinishda xatosiz) — «Maydon» pitchini uch slaydga yig'dingiz
- **Real Voice!** (9-ekran, 4/4) — Pitchingizning to'rt qatorini yozdingiz
- **Rehearsal Done!** (12-ekran) — Pitchingizni ovoz chiqarib aytdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Raqam yonida hikoya** — 1 Raqam 5 suhbatda necha kishida chiqqanini ko'rsatadi. · 2 Hikoya bitta odamda u qanday bo'lganini ko'rsatadi. ·
  3 Pitchda ikkalasi bitta slaydda yonma-yon turadi. — Sinfga savol: 3-ekran savoli
- **5 · Hikoya — bo'lib o'tgan ish** — 1 Hikoya — bitta real odam bilan bo'lib o'tgan ish. · 2 «Hammaga kerak» — fikr, «albatta ishlatadi» — va'da. ·
  3 Ikkalasida ham bo'lib o'tgan ish yo'q, ular hikoya emas. — Sinfga savol: 5-ekran savoli
- **7 · Canva'dagidek** — 1 Melanie Perkins talabalarga dizayn dasturlarini o'rgatgan. · 2 Talabalar tugmalar qayerdaligini o'rganishga qiynalgan. ·
  3 Investor tushunmaganda, u muammoni ko'rsatadigan slayd qo'shgan. — Sinfga savol: 7-ekran savoli
- **11 · Kimning hikoyasi qaysi slaydda** — 1 Muammo slaydida — intervyudagi odamning hikoyasi. · 2 Foydalanuvchi slaydida — saytni sinovda ishlatgan odamning hikoyasi. ·
  3 Sinov hikoyasi yonida tuzatilgan narsa turadi. — Sinfga savol: 11-ekran savoli

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144 va uning qo'shimcha bandi): boshqa holat, boshqa so'z.
1. «5 kishidan 4 tasi» zalga nimani aytadi?
   - ✔ A — Beshta intervyudan nechtasida chiqqanini
   - B — Muammo bir odamda qanday kechganini
   - C — Saytni nechta odam qurganini
   - D — Intervyu qancha davom etganini
2. Pitchda faqat hikoya bor. Yoniga nima qo'yiladi?
   - A — Yana bitta shunday hikoya
   - ✔ B — Intervyudan olingan raqam
   - C — Saytning rangli rasmi
   - D — Jamoa a'zolari ro'yxati
3. Pitch uchun to'rt gap. Qaysi biri fikr?
   - A — «Kelganimizda maydon band edi»
   - B — «Egasi telefonni ko'tarmadi»
   - ✔ C — «Bu sayt juda yaxshi chiqdi»
   - D — «Tugmani topa olmadim»
4. «O'yinchilar saytni albatta ishlatadi» — bu qanday gap?
   - A — Intervyudan olingan hikoya
   - B — Sinovda yozilgan kuzatuv
   - C — Muammoni sanagan raqam
   - ✔ D — Hali bo'lib o'tmagan va'da
5. Yozuvda: «egasi telefonni ko'tarmadi». Pitchga nima yozasiz?
   - ✔ A — Yozuvdagi gapni o'zgartirmasdan
   - B — Maydon egalari telefon ko'tarmaydi
   - C — Egasi o'yinchilarni yoqtirmaydi
   - D — Egasi bilan janjal bo'lib o'tgan
6. Intervyudagi o'yinchining hikoyasi qaysi slaydga chiqadi?
   - A — Foydalanuvchi slaydiga
   - ✔ B — Muammo slaydiga
   - C — Yechim slaydiga
   - D — Uchala slaydga ham
7. Pitch slaydlari qaysi tartibda boradi?
   - A — Yechim → muammo → foydalanuvchi
   - B — Foydalanuvchi → muammo → yechim
   - ✔ C — Muammo → yechim → foydalanuvchi
   - D — Muammo → foydalanuvchi → yechim
8. «Ko'pchilik bo'sh vaqtni bilmaydi» hikoya bo'lishi uchun nima kerak?
   - A — Muammoni boshqacha nomlash
   - B — Gapni ikki barobar uzaytirish
   - C — Yoniga katta raqam qo'yish
   - ✔ D — Bitta odam va uning ishi
9. Melanie Perkins har rad javobidan keyin nima qilgan?
   - ✔ A — Taqdimotini yaxshilagan
   - B — Boshqa g'oyaga o'tgan
   - C — Pitch qilishni to'xtatgan
   - D — Faqat raqamlarni ko'paytirgan
10. Sinovdagi odamni pitchda qanday tilga olasiz?
    - A — To'liq ismi va familiyasi bilan
    - ✔ B — Kimligi bilan, masalan o'yinchi
    - C — Telefon raqami bilan birga
    - D — Sinfi va maktabi nomi bilan
11. Repetitsiyada sinfdoshingiz nima qiladi?
    - A — Pitchingizga ball qo'yadi
    - B — Pitchni siz uchun aytadi
    - ✔ C — Eslab qolganini aytib beradi
    - D — Slaydlaringizni qayta yozadi
12. Sinovda o'yinchi tugmani topa olmadi. Pitchda keyin nima aytiladi?
    - A — Intervyudagi raqam qaytadan
    - B — Saytni qurgan haftalar soni
    - C — Keyin qo'shiladigan to'lov
    - ✔ D — Tugma qanday tuzatilgani

- Arena yozuvlari — umumiy shablon (8-Modul 14-dars YAKUNIY dagidek).
- **Fon so'zlari** (R-008, {uz, ru}): arena — pitch · hikoya · raqam · slayd · yozuv · odam · sahna · sinov · uyga vazifa banneri — pitch · hikoya · slayd · odam (faqat so'z, emojisiz).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/7-Modull/PmUserStoryPitchLesson.jsx`; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m7d12-v1` · «Pitchingizda kimning hikoyasi bor?».
2. Ekran turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (darsning `QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s9/s12 `QMustaqil` · s10 `QKod` · s13 `QNatija` (podium) · s14 `QKartochka` · s15 `QYakun`.
3. **`PitchSahna` — qolipda yo'q, yangi** (bitta vizual, 180-qonun): 1–3 slaydli tasma + zal (4 siluet, savol pufagi / ✓), qator holatlari (bo'sh · yozildi · joriy · xato · to'liq), `reduced-motion`.
   Asos — 8-Modul 14-dars «Sahna ekrani» slaydi (`src/6-Modull/PmLesson25.jsx`, `sl-*` CSS); umumiy qolipga ko'chirish K-020 tartibida (shubhada — dars ichida nusxa). Ishlatiladi: 0, 1, 2, 8, 9, 12.
4. `MAYDON` — bitta manba (180-qonun): muammo gapi · intervyu takrorlari (4 qator + son) · intervyu hikoyasi · yechim gapi · sinov vazifasi · kuzatuv (3 qator) · tuzatish. s0, s2, s4, s8, s10 shundan o'qiydi.
5. s2 — `QBashorat` (uch holat) → `QQadamlar` (uch qadam) → slayd almashinuvi + zal pufagi; 3-qadamda `raqam`/`hikoya` yorliqlari; `QTaxmin`; 40 s ipucha.
6. s4 — `GAPLAR` (6: `matn`, `tomon`, `yozuvQatori`) + yozuv maketi (intervyu 4 qator, kuzatuv 3 qator; mos qator yashil, «topilmadi» chizig'i); bashorat 2/3/4; 6/6 da yorliqlar; nishon — birinchi urinish.
7. s6 — `CanvaMock` (yangi keys-maketi: dastur oynasi + tugmalar, kursor, taqdimot slaydlari, rad belgilari, «chigal chiziq» slaydi); `K_CANVA` 6 bosqich; `.ksc-brand` «Canva» o'z rangida (182-qonun; rang tasdig'i — TAYANCHGA SAVOL 8).
8. s8 — `BOLAKLAR` (5: `matn`, `slayd`, `xato`); bashorat; zal pufagi to'lmagan birinchi slayd ustida; 5/5 da manba yorliqlari.
9. s9 — 4 qadamli forma, `LS` kalit `pm-m7d12-pitch` ({raqam, muammoHikoya, yechim, sinovHikoya, savedAt}); tekshiruv funksiyasi (son · «hamma|ko'pchilik|har kim» · «albatta|kerak|yoqadi|qulay|zo'r») —
   PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi; artefakt-strip «Pitchim» (U-042). Oldingi darslar artefakti bo'lsa — kulrang ma'lumot qatori (TAYANCHGA SAVOL 4).
10. s10 — `KOD_TASK` (gaplar, `hikoyalar`), 3 `evalEquals` ifodasi, `GATE_ITEMS` (`matn`/`qism`/`turi`), requirement yorliqlari va xabarlari; starter 0/3 (§140-B).
11. s12 — `PairTimer`: juftlik 2 daqiqa (A 1 + B 1), mustaqil 1 daqiqa; s9 slaydlari yopiq → qator yozilgach ochiladi; ▶ ⏹ belgilari yo'q.
12. Jonli ball: `INLINE_KEYS` = { s3: 1, s5: 2, s7: 0, s11: 3, saralash: -1, slaydlar: -1, practice: -1, koding: -1, repetitsiya: -1 }; `RECAPS` 3/5/7/11; `Q_LABELS`;
    `QUIZ_BANK` 12 (✔ 0/1/2/3 har biri 3 marta) + `set_quiz_keys`; `SCREEN_META` == screens; `SCREEN_INTENTS`.
13. `ACHIEVEMENTS` 4 · `FLASHCARDS` 11 · `RECAP` 5 · `HW_TOKENS` · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
14. Uyga vazifa — yangi dars, `HwCard` mazmuni shu MD dan (PM-027 faqat mavjud homework fayllariga tegishli; yangi fayl ochish — TAYANCHGA SAVOL 6).
15. App.jsx m7-12 qatoriga `comp: PmUserStoryPitchLesson` ulash (nom va osti o'zgarmaydi — DE-205 ✓).
16. **REPO — yo'q** (PM darsi; `maydon` repo'ga tegilmaydi).
- Darvozalar: `npm run gates -- src/7-Modull/PmUserStoryPitchLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL
1. **Yopildi (audit 2):** hikoya agregat sonlardan yasalmaydi — 3-darsdagi 1-yozuv so'zma-so'z olindi. Tarix: **Intervyu hikoyasi — ikki ibora bitta odamda.** «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» — tayanchdagi ikki iborani bitta o'yinchiga berdim
   («qo'ng'iroq qildik» qo'shildi). Nega: hikoya uchun bitta odam kerak; 4 + 3 > 5, ya'ni kamida ikki kishi ikkalasini aytgan. Taklif: tayanchga shu matnli bitta yozuv qo'shilsin (2, 3, 10-dars ham ishlatishi mumkin).
2. **Yopildi:** tuzatish va qayta sinov — 11-dars `SINOV.md` dagi so'zlar bilan («tugmani ekran pastiga qotirdik», «yangi o'yinchi darrov band qildi»). Tarix: **Tuzatish qanday bo'lgan.** «"Band qilish" tugmasini ko'rinadigan joyga chiqardik» — tayanchda faqat «tuzatiladi». 11-dars MD dagi aniq so'z bilan bir xil qilish kerak (masalan, «formadan tepaga»).
3. **Tuzatishdan keyin qayta sinov bormi?** Natija tayanchda yo'q — pitchda «endi topdi» deyilmadi (o'ylab topilmaydi). Bo'lsa, foydalanuvchi slaydi kuchliroq bo'ladi.
4. **Oldingi darslar artefakti.** 2-dars (intervyu yozuvlari), 3-dars (muammo + son), 10-dars (kuzatuv yozuvi), 11-dars (tuzatish) localStorage'da saqlanadimi va qaysi kalit bilan — 9-ekran ularni ko'rsatishi uchun.
5. **Pitch uzunligi.** Repetitsiya taymeri 1 daqiqa (juftlikda 2) — dastur aytmaydi; uch slaydga yetadi deb tanladim.
6. **Uyga vazifa fayli.** Yangi dars uchun `PmUserStoryPitchLesson.homework.jsx` ochiladimi yoki uyga vazifa faqat yakun kartasida qoladimi.
7. **Foydalanuvchi slaydida raqam.** Sinovchilar soni tayanchda yo'q — slaydda raqam qo'yilmadi, faqat hikoya va tuzatish.
8. **Canva rangi.** `.ksc-brand` uchun Canva brend rangi (#00C4CC yoki #7D2AE8) — tasdiq kerak; logotip qo'yilmaydi.
9. **Real foydalanuvchi ishtiroki qayerda tekshiriladi.** Uyga vazifa muddati «zaxira darsgacha» — zaxira dars qurilmaydi; natija keyingi modulda ko'riladimi.

## Shubhali joylar (ishonchim komil emas)
- s0 variantlari: «beshtadan to'rttasi» degani — og'zaki shakl; «besh kishidan to'rttasi» ham bo'ladi (uzunlik tenglashadi).
- s2 bashorat varianti «odamning gapi» — atama («hikoya») hali tug'ilmagani uchun shunday; o'qilishi og'ir bo'lsa, «bitta odamning gapi».
- s2 zal pufaklari («Bu qanday bo'lgan?» / «Bu nechta odamda bo'lgan?») — model, haqiqiy zal emas; `QTaxmin` «haqiqatda» so'zi shu modelga ishora qiladi.
- s4 «Yozuvda bor / yo'q» → nomlar «bo'lib o'tgan ish / fikr yoki va'da»: yozuvda ham fikr bo'lishi mumkin (odam «yaxshi ekan» desa). Bu misolda tenglik rost; umumiy qonun qilib aytilmadi (T-043).
- s6 Canva: manba Melanie talabalar hikoyasini pitchga qo'yganini aytmaydi — matnda faqat manbadagi gaplar: muammoni talabalarda ko'rgan, uch yil pitch, har raddan keyin yaxshilagan, murakkablik slaydi qo'shilgan.
  «Investor muammoni ko'rdi» kabi xulosa yozilmadi. Canva — Toshkent o'smiriga maktab taqdimotidan tanish deb oldim (tekshirilmagan).
- s9 tekshiruvidagi «kerak» so'zi to'g'ri hikoyada ham chiqishi mumkin («qo'ng'iroq qilish kerak edi») — shuning uchun faqat yo'naltiradi, bloklamaydi. «zo'r» — lint:til warn (detektor ro'yxati, o'quvchi matni emas).
- s10 kod ekrani dars vaqtiga og'ir bo'lsa — PM-082 bo'yicha qoladi, lekin olib tashlash mumkin (repetitsiya — darsning asosiy natijasi).
- s11 C varianti «besh haftalik ish» — 8-Modul 14-dars navbat ilovasi raqami («5 hafta ishlandi»); tanish raqam, lekin variant matnida yolg'iz son.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (DE-205): App.jsx m7-11 «Loyiha kuni: sinovdan keyingi tuzatish» → **m7-12 «Pitchingizda kimning hikoyasi bor?»** → m7-13 «Zaxira dars»; reja chap matni App.jsx ostiga mos («muammo, yechim va real foydalanuvchi»).
- [x] Bitta misol-ip — «Maydon» (tayanch faktlari: 4/3/2/1 intervyu, sinov vazifasi, «Band qilish» tugmasi); metafora yo'q; bitta vizual — `PitchSahna`. Ikkinchi misol faqat testda (s5, s11 — navbat ilovasi, tanish olam, P-002); Canva — keys (PM-029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 8 (QTushuncha) + 0, 6, 9, 10, 12. Matn-karta yo'q.
- [x] O'lchov (python bilan sanaldi, qavsdagi sonlar): sarlavha 31–50 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 66–107 · hook javobi 80 · xato izohi 31–58.
- [x] Atamalar oldingi darslar bilan bir xil (grep: 8-Modul 14-dars YAKUNIY — slayd, raqam/nimani sanadi/nimani ko'rsatadi, mehnat raqami, «Sahna ekrani»; 5-Modul 8-dars — fikr, va'da, bo'lib o'tgan ish);
  siz-forma; formula ot-shaklda («Muammo → yechim → foydalanuvchi»), tugma siz-formada yoki ot-shaklda (§222/224).
- [x] Testlar: 4 variant, uzunlik yaqin (s3 33/34/36/32 · s5 31/33/37/37 · s7 36/38/35/33 · s11 41/41/41/37 — to'g'ri javob eng uzun emas); kalit so'z, strelka, qavs faqat to'g'rida emas
  (arena 10 da «» olindi, arena 7 da strelka hamma variantda); ✔ o'rni 1/2/0/3 (yangi dars).
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), shuning uchun uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami — nishon, arena, podium — mustasno; ✓ ✗ «+» — belgilar); kafolat gaplari yo'q («albatta» faqat va'da namunasi sifatida — o'rgatilayotgan xato).
- [x] Ichki kodlar o'quvchi matnida yo'q («o'tgan modulda», «navbat ilovasi» — raqamsiz); Canva fakti — manba bilan (Guy Kawasaki suhbati, ochib tekshirildi); «KOD» ro'yxati 16 band, REPO 0.
- [x] Karta T · P · S · PM ko'rildi: T-011/PM-107 (hikoya, repetitsiya — misoldan keyin) · T-014/015 (hikoya bir ma'noda, «User Story» ishlatilmadi, «slayd» — varaq emas) · T-039 («pitchingiz» faqat 9-ekrandan keyin; reja «loyihangiz pitchini») ·
  T-042 (ta'rif va bugungi qoida so'zma-so'z) · T-043 (s4 shubhali bandda) · T-047/P-036 (Mentor natijani aytmaydi) · T-064 (s9 xulosasi keyingi ekranni va'da qilmaydi) · P-013 (bugungi asosiy fikr) · P-015 (reja demo matnsiz) ·
  P-025 (uyga vazifa karta) · P-033 · P-046 (s9 slaydlari o'quvchi yozganidan) · P-048 (nishon — ish qilingan ekranda) · P-052/P-057 (s4 solishtirish) · P-062 (son bir marta) · P-064 va 181-qonun (bashorat 2, 4, 6, 8) ·
  S-001 (savollar 7–9 so'z) · S-004/S-010 · S-006 (inkor-savol yo'q) · S-008 (kalit ibora takrorlanmaydi) · S-018 (Canva izohi Mentorda, birinchi ko'rinishda) · S-026 · §140-B (starter 0/3) · §144/145 ·
  PM-005 (2-tur) · PM-018 (odam roli bilan, ismsiz) · PM-027 (yangi uyga vazifa — savol 6) · PM-028/029 (keys yorlig'i, o'z maketi) · PM-082 (kod darvozasi) · PM-108 (s9 tekshiruvi sinaladi) · J-026 (hook maqtovsiz).
- [?] Ochiq: s4 da ikki tomon + ikki yozuv kartasi telefonda (393 px) sig'ishi — vizual bosqichda ko'riladi (U-006).
