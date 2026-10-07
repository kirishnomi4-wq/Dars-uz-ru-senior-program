# 11-Modul · 2-dars (PM) «Oltita g'oyadan qaysi uchtasi qoladi?» — MD v3

Fayl: `src/9-Modull/PmIdeaRiceLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-02` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, yozilgani ixcham qatorga uchadi) · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q ·
ekranda ≤ 3 blok · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 7-ekran — **A** (`0`) · 12-ekran — **C** (`2`) — `INLINE_KEYS { s3: 1, s5: 3, s7: 0, s12: 2 }`; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx, DE-205): `m9-01` «Oltita g'oyani qayerdan topasiz?» → **`m9-02` «Oltita g'oyadan qaysi uchtasi qoladi?»** (osti: «saralash va RICE bahosi») → `m9-03` «Ikki g'oyadan qaysi biri odamlarga kerak?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma (saralangan g'oyalar va RICE jadvali), mustaqil ish majburiy (8, 9-ekran); kod ekrani (11) — 1-tur qismi (VS Code, `node rice.js`).
Keys — **K14 Instagram Stories** (tayanch 5, faqat bank matni). REPO yo'q (PM darsi; `maydon-jamoa` 7-darsdan).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 6 · tushuncha, keys va testlar (2–7) ≈ 28 · saralash ≈ 10 · RICE ≈ 16 · juftlik ≈ 6 · kod ≈ 10 · yakuniy savol, podium, kartochkalar, arena ≈ 14.
Manba: `00-MODUL-TAYANCH.md` (1.2 aynan — uch savol, 4 g'oya, RICE jadvali, uchta va ikkita · 2 — saralash, RICE va to'rt bo'lak · 4 — kod mexanikasi · 5 — K14 · 6 — RICE manbasi · 7 — takroriy xatolar · 8 — kalitlar ·
9.20–28 — 1-dars kelishuvlari) · `GATE_M_JAVOB.md` (Qaror-0 1, 2, 3, 17) · `00-TAQIQLAR.md` · 1-dars MD `01-PmTenIdeas-v3.md` (Mentorning 6 g'oyasi, «G'oyalarim» ro'yxati, uyga vazifa ③).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «Bajariladigan / real auditoriya / qiziq; RICE → RICE baholi 3 g'oya»):** o'quvchi 1-darsdagi oltita g'oyasini uch savol bilan saralaydi, o'tganlarini RICE bilan baholaydi,
   RICE bo'yicha **uchta** g'oya qoladi va ulardan **ikkitasi** belgilanadi (RICE birinchi ikkitasini taklif qiladi, o'quvchi sababi bilan almashtira oladi).
   O'qiydi: `pm-m9d1-goyalar` (1-dars). Yozadi: `pm-m9d2-rice` (3, 6-darslar o'qiydi). Ikkitasi — 3–4-darslardagi intervyu uchun (dars ichida va'da qilinmaydi, T-038; faqat uyga vazifa ③ da «keyingi darsgacha»).
2. **Bugungi asosiy fikr (P-013):** Uch savoldan o'tgan g'oyalarni RICE tartiblaydi; RICE — tanlovga yordam, hukm emas. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **uch savol** (bitta manba `SAVOLLAR` — 2, 3-javob, 8, recap, kartochka; tayanch 1.2, siz-formada — TAYANCHGA SAVOL 1):
     **Bajariladimi?** — «Birinchi versiyasini shu modulning 6 haftasida qura olasizmi?» · **Real auditoriya bormi?** — «Gaplasha oladigan kamida 5 tanishingiz bormi?» ·
     **Qiziqmi?** — «Bitiruvgacha shu ustida ishlashni xohlaysizmi?»
   - **saralash** — «G'oyalarni uch savol bilan ajratish saralash deyiladi.» (2-ekran, uchinchi savoldan keyin; tayanch 2.) G'oya uchala savolga «ha» olsa o'tadi; bitta «yo'q» — chetda qoladi (o'chirilmaydi — TAYANCHGA SAVOL 3).
   - **qamrov · ta'sir · ishonch · mehnat** (4-ekran; har biri avval savol bo'lib turadi, ustun ochilgach nomi chiqadi — T-011):
     **qamrov** — bir oyda nechta odamga yetadi · **ta'sir** — bitta odamga qancha foyda: 3 juda katta · 2 katta · 1 o'rta · 0,5 kichik · 0,25 juda kichik ·
     **ishonch** — taxminga qanchalik ishonasiz: 100% o'lchangan son bor · 80% dalil bor · 50% faqat taxmin — **bu kursdagi sodda izoh** (Intercom'da 100% — yuqori, 80% — o'rta, 50% — past ishonch; darsda «Bu kursda:» yorlig'i bilan, 02-FILTR 1) ·
     **mehnat** — bitta odam necha hafta ishlaydi.
   - **RICE** — «Bu baho RICE deyiladi. RICE — to'rt so'zning bosh harflari: Reach, Impact, Confidence, Effort.» (4-ekran, hisobdan keyin; tayanch 2.)
     O'quvchi matnida formula so'z bilan: «qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz»; belgilar (×, ÷) — faqat formula kartasida (vizual, T-035).
   - **uchta · ikkita** — RICE bo'yicha eng yuqori uch g'oya · ulardan belgilangan ikkitasi (yorliqlar «Uchta», «Ikkita»).
   - **mehnat — hafta (bir marta ochiq, 4-ekran manba qatori):** «RICE Intercom kompaniyasida (mijozlar bilan yozishadigan chat dasturi) o'ylab topilgan. U yerda mehnat odam-oyda, bu kursda — haftada sanaladi.»
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **g'oya** — «G'oya uch qismdan iborat: muammo, kim uchun va yechim.» (1-dars, so'zma-so'z; tayanch 9.20). 8-ekran kartasida uch qator shu tartibda.
   - **«G'oyalarim»** — 1-dars ro'yxati (`pm-m9d1-goyalar`), ixcham qatorda yechim qisqa «…» (nom yo'q — tayanch 8). Mentorniki — «Mentorning g'oyalari» (nom yorlig'i bilan, tayanch 1.1).
   - **navbat belgilash (prioritet)** — User Story darsi (`m3-02`, `PmUserStoryLesson`, P0): «… eng muhimi birinchi qilinadi; buni navbat belgilash (prioritet) deyiladi». Bu darsda bir gapli ko'prik (1-ekran Mentori).
   - **«nechta odam so'raydi · qancha vaqt oladi»** — «Qaysi ishni birinchi qilasiz?» darsi (`m3-05`, `PmLesson8`). Ko'prik faqat O'qituvchi eslatmasida (4, 6-ekran): RICE da ular qamrov va mehnat bo'ldi, yangisi — ta'sir va ishonch.
   - **dalil** — 1-darsdagi dalil-yorliq «9-Modul intervyusi: 5 kishidan 2 tasi «jamoaga odam yetmadi»» (tayanch 9.26). Ishonch 80% shundan.
   - **intervyu** — faqat dalil-yorliqda va O'qituvchi eslatmasida; ballik matnda yo'q (S-020) — arena 11 da «9-Modulda 5 kishidan 2 tasi aytgan».
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«jamoa»** — faqat futbol jamoasi (Qaror-0 3): «Intercom jamoasi» emas — «Intercom kompaniyasida». **«maydon»** — faqat futbol maydoni; forma joyi — «qator».
   - **«baho» / «baholash»** — faqat RICE bahosi (menyu osti «RICE bahosi»). Testdagi ball — «ball».
   - **«tanish»** — o'quvchi gaplasha oladigan odam (real auditoriya savoli; 1-dars uyga vazifa ③ qog'ozi). **«odam»** — qamrovdagi sanoq birligi.
   - **«chetda»** — saralashdan o'tmagan g'oyalar turgan joy (ro'yxat pastidagi kulrang qism). «O'chirildi», «tashlandi» yo'q.
   - **«o'rin»** — RICE jadvalidagi tartib («1-o'rin»). **«son»** — to'rt bo'lakdan birining qiymati.
   - **«taxmin»** — o'quvchi yoki Mentor qo'ygan son (ishonchning 50% darajasi ham shu so'z).
   - **Ishlatilmaydi:** prioritet formulasi · ball (RICE ma'nosida) · erishish, effekt, kuch (tayanch 2) · filtr, otsev · ficha · «Maydon Jamoa» (mahsulot nomi 4-darsdan — tayanch 9.23) · «hisoblanadi» (kantselyarit) · «g'olib g'oya» (faqat 12-ekranning noto'g'ri A variantida — yanglish tasavvur sifatida).
6. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** saralash — oltitadan 4 tasi o'tdi (1.2) · RICE jadvali (1.2 aynan): 60·2·80%·4 = 24 · 80·1·50%·2 = 20 · 30·1·50%·3 = 5 · 30·0,5·50%·2 = 3,75 ·
   dalil — 9-Modul intervyusi: 5 kishidan 2 tasi «jamoaga odam yetmadi» (tayanch 1, 9.26) · 6 hafta, kamida 5 tanish (1.2). Testdagi sonlar (5-ekran, arena 7) — ikkinchi olam, hisob mashqi. Boshqa son yo'q. K14 — raqamsiz (yil 2016 — bankda).
7. **Misol-ip — Mentorning 6 g'oyasi (1-dars, tayanch 1.1) → saralash → RICE:** «Jamoa yig'ish» — nom yorlig'i (tayanch 9.23), mahsulot nomi aytilmaydi. Metafora yo'q.
   Hech bir g'oya «yomon» deyilmaydi: chetdagilar bu modulga mos kelmadi, xolos.
8. **Keys — K14 Instagram Stories (tayanch 5, bank matni aynan):** «Stories'ni Snapchat o'ylab topgan; Instagram 2016-yilda formatni ochiq olgan va tayyor katta auditoriyasi tufayli format aynan u yerda «uchgan».
   G'oya muallifi emas, foydalanuvchiga yaxshiroq yetkazgan yutadi. Raqamsiz.» Ko'prik: RICE ning **qamrov** bo'lagi. Xulosa chegaralangan: «Bu voqeada …» (T-043). Bankdan tashqari fakt yo'q
   (Snapchat yutqazdi, foydalanuvchilar soni, boshqa yil — yo'q). Brend izohlari: Snapchat — KORPUS §189 so'zma-so'z; Instagram — izohsiz (§189 ro'yxati); Stories — format izohi (TAYANCHGA SAVOL 10).
9. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** sinfdoshning g'oyasi (3), «g'oyangiz» sonlari (5), ovqat yetkazish, sinf vazifalari, oshxona, to'garak sahifalari (arena 3).
10. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.
11. **Kod yozish (tayanch 4, PM_DARS_ETALON 26, PM-082):** VS Code (`rice.js`, `node rice.js`): `rice()` funksiyasi va eng yuqori uch g'oya terminalda. 1-dars — kod oynasi; mexanika takrorlanmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1-darsda Mentor (xuddi o'quvchi kabi) oltita g'oya yozdi. 2-dars: oltitadan qaysilari qoladi — saralash, keyin RICE; uchta va ikkita.
- **Dars ipi:** 0 — oltita g'oyadan uchtasini nimaga qarab tanlaysiz (Mentorning 6 g'oyasi, «6 → ? → 3») → 2 — uch savol: oltitadan to'rttasi o'tadi (atama «saralash») →
  3 — test: real auditoriya → 4 — to'rt g'oya to'rt son bilan: qamrovi eng katta g'oya ikkinchi bo'ladi (atama «RICE»; uchta va ikkita) → 5 — test: RICE hisobi →
  6 — Instagram Stories: format ko'proq odamga yetgan joyda ko'proq ishlatildi (qamrov) → 7 — test → 8 — o'quvchi o'z g'oyalarini saralaydi →
  9 — o'tganlarini RICE bilan baholaydi, uchta va ikkita → 10 — juftlik: sherik bitta soniga «nega?» deydi → 11 — kod: `rice()` va eng yuqori uchtasi →
  12 — yakuniy: RICE hukm emas → podium → kartochkalar → yakun, uyda — har ikki g'oyaga 5 tanish.
- **Bitta vizual — g'oyalar jadvali (`GoyaJadval`, dars bo'yi, 163/180; manba `MENTOR_GOYALAR` (1-dars bilan bir), `MENTOR_SARALASH`, `MENTOR_RICE` + o'quvchi ma'lumoti):**
  - **Saralash ko'rinishi:** g'oya qatorlari (Mentorniki — nom; o'quvchiniki — yechim qisqa «…»), har qatorda uch kichik katak — «Bajariladimi? · Real auditoriya bormi? · Qiziqmi?» tartibida
    (holat: kulrang «?» → yashil ✓ / kulrang ✕ + sabab yorlig'i). Pastda — **«Chetda»** qismi (kulrang, xira qatorlar; o'chmaydi). Tepada hisoblagich «Qoldi: n».
  - **RICE ko'rinishi:** qatorlar × ustunlar **Qamrov · Ta'sir · Ishonch · Mehnat · RICE**; ustun sarlavhasi avval savol («Bir oyda nechta odamga yetadi?»), ochilgach nom («Qamrov»), savol ostida kulrang qoladi.
    RICE dan keyin qatorlar kattadan kichikka silliq qayta tartiblanadi; yuqori uch qator chap tomonda **«Uchta»** qavsi bilan, ularning birinchi ikkitasida **«Ikkita»** yorlig'i (accent fon).
  - **Formula kartasi (`RiceFormula`, jadval ostida):** «qamrov × ta'sir × ishonch ÷ mehnat = RICE» — sonlar qatordan uchib kiradi, natija sanab o'sadi. Belgilar faqat shu kartada (T-035).
  - Qator holatlari: bo'sh (kulrang uzuq chiziq — U-041) → joriy (accent chegara) → yozildi (~1 s yashil) → chetda (kulrang, xira). Matn ≥ 12 px; 6 qator — ikki ustun × 3 (SABOQ 27).
  - Ishlatiladi: 0 (6 qator, holatsiz) · 1 (skelet) · 2 (saralash) · 3 (javobdan keyin, kichik) · 4 (RICE) · 5 (javobdan keyin — formula kartasi) · 7 (javobdan keyin — ustun sarlavhalari) ·
    8 (o'quvchining saralashi) · 9 (o'quvchining RICE jadvali) · 10 (o'quvchining 1-o'rindagi g'oyasi) · 11 (terminal — jadvalning kod ko'rinishi) · 15 (artefakt-strip). `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan.
- **Mentor misoli — saralash (`MENTOR_SARALASH`, tayanch 1.2; sabab yorliqlari 1.2 dan, siz-forma emas — yorliq):**

| № | G'oya | Bajariladimi? | Real auditoriya bormi? | Qiziqmi? | Natija |
|---|---|---|---|---|---|
| 1 | Jamoa yig'ish | ✓ | ✓ | ✓ | o'tdi |
| 2 | Maydon pulini bo'lishish | ✓ | ✓ | ✓ | o'tdi |
| 3 | Mahalla to'garaklari | ✓ | ✓ | ✓ | o'tdi |
| 4 | Sinf uy vazifalari | ✓ | ✓ | ✓ | o'tdi |
| 5 | Eski darsliklar | ✕ pul va yetkazish kerak | — | — | chetda |
| 6 | Yo'qolgan buyumlar | ✓ | ✕ kamida 5 tanish topilmadi | — | chetda |

  «Qiziqmi?» savolidan bu misolda hammasi o'tadi (06.10 — 6 g'oya, F-1006-272).

- **Mentor misoli — RICE (`MENTOR_RICE`, tayanch 1.2 aynan; taxminlar; ishonch — intervyudan oldingi holat):**

| O'rin | G'oya | Qamrov (oyiga) | Ta'sir | Ishonch | Mehnat (hafta) | RICE | Yorliq |
|---|---|---|---|---|---|---|---|
| 1 | Jamoa yig'ish | 60 | 2 | 80% | 4 | **24** | Uchta · Ikkita |
| 2 | Mahalla to'garaklari | 80 | 1 | 50% | 2 | **20** | Uchta · Ikkita |
| 3 | Maydon pulini bo'lishish | 30 | 1 | 50% | 3 | **5** | Uchta |
| 4 | Sinf uy vazifalari | 30 | 0,5 | 50% | 2 | 3,75 | — |

  Jadval kirishda 1.2 tartibida emas, 2-ekrandagi tartibda (1, 2, 3, 4) turadi — RICE dan keyin qayta tartiblanadi (harakat shu).
- **Brend o'z maketida (PM-028/029, S-018, SABOQ 2–3):** «Snapchat» — nomi o'z sariq rangida, telefon maketi ustida; «Instagram» — nomi o'z rangida (pushti-binafsha), ikkinchi telefon ustida; logotip chizilmaydi, son yo'q.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32).
  Yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (SABOQ 11):** tanlangach karta yo'qolmaydi — «Taxminingiz: …» ixcham qator natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi (SABOQ 25).
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → ✓ kataklarga navbat bilan tushadi, chetga chiqqan qator pastga suriladi · son sanab o'sadi · qatorlar qayta tartiblanganda silliq siljiydi.
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Oltita g'oyadan qaysi uchtasi qoladi?** (36) — dars nomi (DE-205)
- Mentor: O'tgan darsda oltita g'oya yozildi, bitiruvgacha esa bittasi quriladi. O'zingizga yaqin javobni belgilang.
- Maket (chap): «Mentorning g'oyalari · 6 / 6» — 1-dars ro'yxati (ikki ustun × 3; nom · manba yorlig'i), qatorlar bosilmaydi. Ro'yxat ustida yo'l: «6 g'oya» → «?» → «3 g'oya» (o'rtadagi «?» kulrang, harakatsiz).
- Variantlar (radio, o'ng; bir uzunlikda):
  - O'zimga eng qiziq bo'lgan g'oyalar (34)
  - Ko'p odamga kerakli bo'lgan g'oyalar (36)
  - Eng tez qurib bo'ladigan g'oyalar (33)
- Javob (uchalasida bir xil, maqtovsiz): Uchalasi ham hisobga olinadi. Mentor oltita g'oyasini aynan shu uch tomondan ko'rib chiqdi. (90)
- **Harakat → Vizual o'zgarish:** variantni tanlash → oltita qator ro'yxatdan «?» tomonga bir oz siljib, joyiga qaytadi; «3 g'oya» ostida uchta bo'sh uzuq katak chiziladi (navbat bilan, 100 ms).
  Qaysi g'oya qolishi ochilmaydi (P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: 1-dars uyga vazifasidagi qog'ozni (har g'oyaga bitta tanish) stolga chiqarib qo'yishni so'rang — 8-ekranda kerak. Hook'da to'g'ri javob yo'q: uch variant — dars savollarining uch tomoni (qiziqmi · odamlar · qura olish).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun oltita g'oyadan uchtasini tanlab olasiz.** (45)
- Mentor: User Story darsida hikoyalarga navbat belgilagansiz (prioritet). Bugun oltita g'oyaga navbatni savollar va sonlar bilan belgilaysiz.
- Chap — «Dars oxirida: saralash va RICE bahosi» (App.jsx osti, P-015; RICE — kulrang yorliq) + vizual: oltita ixcham qator-skelet (matnsiz) → bir qismi xiralashib pastga suriladi →
  qolganlari yonida kulrang son-skeleti paydo bo'ladi → yuqori uchtasi accent «Uchta» qavsiga oladi (sonsiz, nomsiz — 2 va 4-ekran kashfiyotini ochmaydi).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Har g'oyaga uchta «ha / yo'q» savol berasiz · `saralash`
  - 02 · Savollardan o'tgan g'oyalarni to'rt son bilan baholaysiz · `RICE`
  - 03 · Instagram Stories qayerda ko'p ishlatilganini ko'rasiz · `voqea`
  - 04 · Bitta soningizni sherigingizga tushuntirasiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada atama yo'q (T-011); «prioritet» — P0 so'zi bilan bir gapli ko'prik (tayanch topshirig'i), keyin «navbat» ham, «prioritet» ham ishlatilmaydi.

## 2 · Uch savol  ← QTushuncha (markaziy, `keng`)
- Eyebrow: Tushuncha · saralash
- Sarlavha: **Mentorning qaysi g'oyalari uch savoldan o'tadi?** (47)
- Mentor: Savollarni tartib bilan bosing — har biridan keyin ro'yxatga qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Oltita g'oyadan nechtasi uch savoldan o'tadi?** · 2 ta · 4 ta · 5 ta —
  tanlangach ixcham qator «Taxminingiz: N ta» natijagacha turadi; savol-tugmalar shundan keyin yoqiladi.
- Vizual (keng; bitta ustun — SABOQ 20, jadval butun enga):
  - **tepada — uch savol-tugma** bir qatorda (faqat joriysi yoqilgan, halqada; har birida qisqa savol, ostida kulrang to'liq savol):
    1 **Bajariladimi?** — Birinchi versiyasini shu modulning 6 haftasida qura olasizmi? · 2 **Real auditoriya bormi?** — Gaplasha oladigan kamida 5 tanishingiz bormi? ·
    3 **Qiziqmi?** — Bitiruvgacha shu ustida ishlashni xohlaysizmi?
  - **pastda — `GoyaJadval` saralash ko'rinishida:** Mentorning 6 g'oyasi (ikki ustun × 3; nom va uch kulrang «?» katak), tepada «Qoldi: 6».
- **Harakat → Vizual o'zgarish:**
  1. «Bajariladimi?» → har qatorning 1-katagiga navbat bilan (60 ms) yashil ✓ tushadi; **Eski darsliklar** — ✕ «pul va yetkazish kerak»;
     qator xiralashib pastdagi «Chetda» qismiga suriladi, hisoblagich 6 → 5 sanab tushadi.
  2. «Real auditoriya bormi?» → qolgan qatorlarning 2-katagiga ✓; **Yo'qolgan buyumlar** — ✕ «kamida 5 tanish topilmadi» → chetga; 5 → 4.
  3. «Qiziqmi?» → 3-katakka ✓; bu misolda hammasi «ha» — hisoblagich 4 da qoladi.
     Qolgan to'rt qator (Jamoa yig'ish · Maydon pulini bo'lishish · Mahalla to'garaklari · Sinf uy vazifalari) tepaga yig'iladi, ✓✓✓ bilan ~1 s yashil yonadi.
  Uchinchi savoldan keyin `QIzoh`: Uchala savolga «ha» olgan g'oya qoladi. G'oyalarni uch savol bilan ajratish saralash deyiladi. (94)
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: N ta · haqiqatda: 4 ta» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda oltitadan to'rtta g'oya o'tdi. Qolgan ikkitasi o'chirilmadi — chetda turibdi. (86)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan savolni bosing — ro'yxatda nima o'zgarishini ko'ring.
- Tugma (pastki): Savollarni bosing (N/3) → Davom etish · `tugadi`: savol-tugmalar yig'ilib bitta ixcham qatorga aylanadi («3 savol ✓»), ro'yxat fokusga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy savol-tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: 6 hafta — shu modulning taxminiy davomi: birinchi versiya Demo Day 7 gacha quriladi. Chetdagi g'oyalar yomon emas — bu modulga mos kelmadi, xolos.
  Real auditoriya savoli muammo borligini isbotlamaydi — u faqat gaplashadigan odamlar borligini tekshiradi; muammoni odamlar bilan suhbat tekshiradi (02-FILTR 3).
  Sinfdan so'rang: «Yo'qolgan buyumlar g'oyasi uchun 5 tanishni kimdan topsa bo'lardi?» — real auditoriya savoli 8-ekranda uyga vazifa qog'ozidan boshlanadi.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · real auditoriya
- Savol: **Sinfdoshingiz g'oyasi uchun faqat 2 tanishi bilan gaplasha oladi. Qaysi savolga «yo'q»?** (12 so'z; 02-FILTR 4 — 5 tanish mezoni tekshiriladi) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Bajariladimi — 6 haftada qura oladimi (37)
  - ✔ B — Real auditoriya bormi — 5 tanishi bormi (39)
  - C — Qiziqmi — shu ustida ishlashni xohlaydimi (41)
  - D — Hech biriga — tanishlar keyin ham topiladi (42)
- To'g'ri izohi: Gaplasha oladigan kamida 5 tanish bo'lmasa, real auditoriya savoliga «yo'q».
- Xato izohlari: A — Qura olish haqida savolda hech narsa yo'q. (42) · C — Qiziqish haqida savolda gap yo'q — odamlarga qarang. (52) ·
  D — Ikki tanish kam: bu savolga kamida 5 kerak. (43) · (umumiy) Uch savolni eslang: qaysi biri odamlar haqida? (46)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida kichik qator — «Sinfdosh g'oyasi» va uch katak:
  Bajariladimi? «?» · Real auditoriya bormi? ✕ (accent) «2 tanish» · Qiziqmi? «?» — g'oya «Chetda» yorlig'ini oladi.
- Izoh (MD): har variantda tire va savol nomi (belgi faqat to'g'rida emas, S-006); D — ishonarli yanglish tasavvur («tanishni keyin topaman»), dars qoidasi bo'yicha noto'g'ri (S-004).

## 4 · To'rt son  ← QTushuncha (markaziy, `keng`)
- Eyebrow: Tushuncha · to'rt son
- Sarlavha: **To'rt g'oyadan qaysi uchtasi oldinga chiqadi?** (43) — 0-ekran savoliga javob (T-064)
- Mentor: To'rt g'oyaga birdaniga vaqt yetmaydi: jadval ustunlarini chapdan o'ngga birma-bir oching.
- Vizual (keng; SABOQ 20–21: jadval butun enga, harakat tugmalari jadvalning o'zida — ustun sarlavhalari):
  - **`GoyaJadval` RICE ko'rinishida:** 2-ekranda o'tgan to'rt g'oya (tartib: Jamoa yig'ish · Maydon pulini bo'lishish · Mahalla to'garaklari · Sinf uy vazifalari), kataklar bo'sh (uzuq chiziq).
  - Ustun sarlavhalari — savol-tugmalar (faqat joriysi yoqilgan, halqada):
    1 «Bir oyda nechta odamga yetadi?» → **Qamrov** · 2 «Bitta odamga qancha foyda?» → **Ta'sir** · 3 «Taxminga qanchalik ishonasiz?» → **Ishonch** ·
    4 «Bitta odam necha hafta ishlaydi?» → **Mehnat** · 5 «Hisoblash» → **RICE**
- **Harakat → Vizual o'zgarish:**
  1. Qamrov → kataklarga sonlar sanab chiqadi: 60 · 30 · 80 · 30; eng kattasi (80, Mahalla to'garaklari) bir lahza accent; jadval tepasida kulrang yorliq «Sonlar — Mentorning taxmini» (02-FILTR 9).
     Shundan keyin bashorat chiqadi (ballsiz, `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Qamrovi eng katta «Mahalla to'garaklari» oxirida nechanchi bo'ladi?** · Birinchi · Ikkinchi · Uchinchi —
     tanlangach ixcham qator; keyingi ustun yoqiladi.
  2. Ta'sir → 2 · 1 · 1 · 0,5; ustun ostida shkala qatori chiqadi: «3 juda katta · 2 katta · 1 o'rta · 0,5 kichik · 0,25 juda kichik» — ishlatilgan qiymatlar bir lahza yonadi.
  3. Ishonch → 80% · 50% · 50% · 50%; shkala qatori: «Bu kursda: 100% — o'lchangan son bor · 80% — dalil bor · 50% — faqat taxmin»;
     Jamoa yig'ish katagi yonida kulrang dalil-yorliq: «9-Modul intervyusi: 5 kishidan 2 tasi «jamoaga odam yetmadi»».
  4. Mehnat → 4 · 3 · 2 · 2.
  5. «Hisoblash» → jadval ostida formula kartasi (`RiceFormula`): «qamrov × ta'sir × ishonch ÷ mehnat»; Jamoa yig'ish qatorining sonlari kartaga uchib kiradi: 60 × 2 × 80% ÷ 4 → **24** (son sanab o'sadi).
     Qolgan qatorlarga RICE navbat bilan yoziladi: 5 · 20 · 3,75. Keyin qatorlar RICE bo'yicha silliq qayta tartiblanadi: Jamoa yig'ish 24 · Mahalla to'garaklari 20 ·
     Maydon pulini bo'lishish 5 · Sinf uy vazifalari 3,75. Yuqori uch qator — «Uchta» qavsi; birinchi ikkitasida «Ikkita» yorlig'i; 4-qator kulrang.
     Formula kartasi ostida `QIzoh`: Bu baho RICE deyiladi. RICE — to'rt so'zning bosh harflari: Reach, Impact, Confidence, Effort. (94)
     Manba qatori (kulrang, kichik; «hafta» bir marta ochiq aytiladi): RICE Intercom kompaniyasida (mijozlar bilan yozishadigan chat dasturi) o'ylab topilgan. U yerda mehnat odam-oyda, bu kursda — haftada sanaladi.
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · haqiqatda: ikkinchi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda qamrovi eng katta g'oya ikkinchi bo'ldi. RICE — tanlovga yordam, hukm emas. (86)
- Ipucha (40 s; javobni aytmaydi): Yoqilgan ustun sarlavhasini bosing — kataklarga sonlar yoziladi.
- Tugma (pastki): Ustunlarni oching (N/5) → Davom etish · `tugadi`: ustun savollari kulrang ostki qatorga tushadi, jadval va formula kartasi fokusga; vizual ⛶ ichida.
- Keyingi bosiladigan joy: joriy ustun sarlavhasi (to'lqin) → bashorat variantlari (1-ustundan keyin) → «Hisoblash» → «Davom etish».
- O'qituvchi eslatmasi: Ko'prik — «Qaysi ishni birinchi qilasiz?» darsidagi ikki savol («nechta odam so'raydi», «qancha vaqt oladi») RICE da qamrov va mehnat bo'ldi; yangisi — ta'sir va ishonch.
  Jamoa yig'ishda ishonch 80% — 9-Modul intervyusidagi dalil; qolganlarida dalil yo'q — 50%. Mehnati eng ko'p g'oya birinchi chiqdi: ta'sir va ishonch uni ko'tardi — shuni sinf bilan ko'ring.
  «Ikkita» — jamoa yig'ish va mahalla to'garaklari: Mentor ular bo'yicha odamlar bilan gaplashadi (3–4-darslar; o'quvchilarga va'da qilib aytmang).

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · RICE hisobi
- Savol: **G'oyangizda qamrov 120, ta'sir 0,5, ishonch 80%, mehnat 3. RICE qancha?** (11 so'z) · savol ustida yorliq yo'q
  - A — 32
  - B — 48
  - C — 20
  - ✔ D — 16
- To'g'ri izohi: 120 ni 0,5 ga va 80% ga ko'paytirib, 3 ga bo'lsangiz, 16 chiqadi.
- Xato izohlari: A — Bu son ta'sirsiz chiqdi — to'rtala sonni ishlating. (51) · B — Mehnatga bo'linmadi: ko'p mehnat bahoni kamaytiradi. (51) ·
  C — Bu son ishonchsiz chiqdi — to'rtala sonni ishlating. (52) · (umumiy) Qamrovni ta'sir va ishonchga ko'paytirib, mehnatga bo'ling. (57)
- Javob topilgach (kichik, savol ostida): 4-ekrandagi formula kartasi shu sonlar bilan — «120 × 0,5 × 80% ÷ 3 = 16»; to'rt son o'z ustun nomi ostida.
- Izoh (MD): har noto'g'ri variant — bitta bo'lak tushib qolgan hisob (S-004, S-040 — bitta xato-sinf): 32 — ta'sirsiz · 20 — ishonchsiz · 48 — mehnatga bo'linmagan. Sonlar 4-ekrandagidan boshqa (javob yod emas).

## 6 · Instagram Stories  ← QVoqea (PM keys K14; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Stories'ni o'ylab topgan ilova yutdimi?** (38)
- Nuqtalar (3) · yorliq **Instagram Stories · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket; slayd ichida takror matn yo'q.
- Sahna (`StoriesSahna`, chizilgan CSS/SVG; ikki telefon yonma-yon, bir o'lchamda ≈170×272 — SABOQ 22; bosqichga qarab o'zgaradi; bankda yo'q narsa chizilmaydi — logotip, son, sana-yorliq yo'q):
  - 1/3 **Snapchat'da yangi format** — Mentor: Snapchat (yuborilgan surat ko'rilgach yo'qoladigan ilova) Stories'ni o'ylab topgan. Stories — bir kundan keyin o'chib ketadigan surat va videolar.
    · sahna: chap telefon ustida «Snapchat» (o'z sariq rangida); ekran tepasida doirachalar qatori navbat bilan paydo bo'ladi, bittasi bosiladi → surat ochiladi, ustida yupqa vaqt chizig'i to'lib, surat yopiladi.
      O'ng telefon ustida «Instagram» (o'z rangida) — ekranda suratlar lentasi, doirachalar qatori yo'q. Telefonlar atrofida odam siluetlari hali yo'q (`pre` kadr).
    · bashorat (sahna ostida, bitta qator; S-015 — bir o'lchov, tartib bilan): **Instagram ham Stories qo'shsa, format qayerda ko'proq ishlatiladi?** · Snapchat'da · Ikkalasida teng · Instagram'da
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Instagram ham qo'shdi** — Mentor: 2016-yilda Instagram shu formatni ochiq oldi. Instagram'da tayyor katta auditoriya bor edi.
    · sahna: o'ng telefonda ham xuddi shunday doirachalar qatori paydo bo'ladi; telefonlar atrofida odam siluetlari kiradi — Instagram atrofida bir necha qator, Snapchat atrofida kamroq (son yozilmaydi).
  - 3/3 **Format qayerda ko'p ishlatildi** — Mentor: Format aynan Instagram'da ko'proq ishlatildi. Bu voqeada g'oya muallifi emas, foydalanuvchiga yaxshiroq yetkazgan yutdi. (bank so'zi — 02-FILTR 13)
    · sahna: Instagram atrofidagi siluetlardan doirachalarga ko'p yupqa chiziqlar boradi, doirachalar qatori to'lib yonga suriladi; Snapchat telefoni joyida qoladi (yo'qolmaydi, xiralashmaydi).
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: Instagram'da» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Bu voqeada tayyor katta auditoriya formatni ko'proq odamga yetkazdi — RICE da buni qamrov o'lchaydi. (100)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: Bu voqea «Qaysi ishni birinchi qilasiz?» darsida ham chiqqan — eslating: u yerda «nechta odam so'raydi» savoli edi, bugun u RICE ning qamrov bo'lagi.
  «Snapchat yutqazdi» demang, foydalanuvchilar soni va boshqa sana qo'shmang — bankda yo'q. Siluetlar — «tayyor katta auditoriya» chizmasi, son emas (02-FILTR 14). Sinfdan so'rang: «G'oyangiz ko'proq odamga qayerda yetadi — maktabdami, mahallada yoki Telegram guruhidami?»
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K14 (bank: raqamsiz, 2016) · tayanch 5 (o'zbekcha matn) · Snapchat izohi — `MATN_KORPUS.md` §189 · Stories izohi — `m3-05` (`PmLesson8`) dagi izoh bilan bir ma'noda.

## 7 · 3-savol  ← QTest (✔ A, `correctIdx 0`; Stories — RICE bo'lagi)
- Eyebrow: Tekshiruv · Stories va RICE
- Savol: **Stories voqeasi RICE ning qaysi bo'lagini ko'rsatadi?** (7 so'z) · savol ustida yorliq yo'q
  - ✔ A — Qamrov — bir oyda nechta odamga yetadi (38)
  - B — Ta'sir — bitta odamga qancha foyda beradi (41)
  - C — Ishonch — taxminga qanchalik ishonasiz (38)
  - D — Mehnat — bitta odam necha hafta ishlaydi (40)
- To'g'ri izohi: Instagram'dagi tayyor katta auditoriya formatni ko'proq odamga yetkazdi.
- Xato izohlari: B — Format ikkala ilovada bir xil edi — farq boshqa joyda. (54) · C — Voqeada taxmin haqida gap bo'lmadi. (36) ·
  D — Voqeada qurish vaqti haqida gap bo'lmadi. (41) · (umumiy) Instagram'da nima ko'p edi — shuni eslang. (42)
- Javob topilgach (kichik, savol ostida): RICE jadvalining to'rt ustun sarlavhasi — «Qamrov» accent; yonida 6-ekrandan kichik ikki telefon, Instagram atrofida siluetlar ko'p.
- Izoh (MD): har variant — bo'lak nomi va 4-ekrandagi ta'rif so'zma-so'z (T-042); tire to'rtalasida (S-006). Savol `m3-05` arenasidagi «Stories nega Instagram'da ko'proq ishlatildi?» ni takrorlamaydi.

## 8 · Saralash  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **G'oyalaringizdan qaysilari uch savoldan o'tadi?** (47)
- Mentor: Birinchi g'oyadan boshlang: har savolga «Ha» yoki «Yo'q» ni bosing.
- **Tepada — ixcham ro'yxat «G'oyalarim · n / 6»** (`pm-m9d1-goyalar`): har qator — yechim qisqa «…» · holat: kulrang «?» · yashil «O'tdi ✓» · kulrang «Chetda» · ✎. Bo'sh uzuq qatorlar yo'q.
- **Markazda — bitta katta karta (joriy g'oya):**
  1. Uch qator (1-dars kartasi, faqat o'qiladi): Muammo · Kim uchun · Yechim.
  2. Uch savol, har birida ikki tugma «Ha» · «Yo'q» (faqat joriy savol yoqilgan, halqada; tartib — `SAVOLLAR`):
     - **Bajariladimi?** — Birinchi versiyasini shu modulning 6 haftasida qura olasizmi?
     - **Real auditoriya bormi?** — Gaplasha oladigan kamida 5 tanishingiz bormi? · ostida kulrang yo'riq: Qog'ozdagi tanishingizdan boshlang: unga o'xshash yana to'rt kishini ayta olasizmi?
     - **Qiziqmi?** — Bitiruvgacha shu ustida ishlashni xohlaysizmi?
  3. Bitta «Yo'q» → qolgan savollar so'ralmaydi (bitta «yo'q» yetadi).
- `pm-m9d1-goyalar` topilmasa (9-Modul M-q5 qoidasi; TAYANCHGA SAVOL 5): karta o'rnida kulrang qator «G'oyalaringiz topilmadi — qog'ozdagi g'oyalarni bittadan yozing.» va uch qatorli forma
  (Muammo · Kim uchun · Yechim; placeholder 1-dars bilan bir: «Odamlar nimadan qiynaladi?» · «Aynan qanday odamlar?» · «Mahsulot nima qiladi?») + «Saqlash» o'ngda; har saqlangan g'oya o'sha kartada saralanadi.
- **Harakat → Vizual o'zgarish:** «Ha» → savol qatori ✓ (~1 s yashil), keyingi savol yoqiladi. Uchala «Ha» → karta yashil chegara bilan kichrayib tepadagi ro'yxatga uchadi, qatori «O'tdi ✓» oladi.
  «Yo'q» → savol qatori kulrang ✕, karta xiralashib ro'yxat pastidagi «Chetda» qismiga suriladi (yo'qolmaydi). Pastdan keyingi karta kiradi; hisoblagich «Saralandi: n / 6» sanab o'sadi.
  Hammasi saralangach karta yopiladi; ro'yxat butun enga — ikki ustun: tepada o'tganlar, pastda «Chetda»; har qatorda ✎ (bosilsa o'sha g'oya katta karta bo'lib qayta ochiladi, javoblari tozalanadi — SABOQ 29).
- Yorliqlar (bloklamaydi, ro'yxat ostida bitta qator):
  - o'tgan g'oya 3 tadan kam: Uchtasini ajratish uchun kamida uchta g'oya o'tishi kerak: «Chetda» gi g'oyani ✎ bilan qayta ko'ring. (RICE ning qoidasi emas — bugungi mashq sharti, 02-FILTR 16) («Davom etish» qulfda; jonli darsda — `optionalLive`)
  - hammasi o'tgan bo'lsa (6/6): Oltitasi ham o'tdi — har biriga 5 tanishni ayta olasizmi? Kerak bo'lsa ✎ bilan qayta ko'ring. (yumshoq, o'tkazib yuborsa bo'ladi)
- Yordam (birinchi «Yo'q» dan keyin yoki 60 s harakatsizlikda): Bitta «yo'q» g'oyani chetga chiqaradi, lekin o'chirmaydi. Qaysi savolga ishonchingiz komil emasligini sherigingiz bilan ko'ring.
- Xulosa (o'quvchi sonidan, P-046): {n} ta g'oyadan {k} tasi uch savoldan o'tdi, {n−k} tasi chetda turibdi. (≈65; namuna 10/5/5 — 64)
- Tugma (pastki): Yana N ta g'oya qoldi → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy savolning «Ha» / «Yo'q» tugmalari (to'lqin) → keyingi karta → «Davom etish».
- Saqlash (ekran oxirida, 9-ekran bilan birga to'ldiriladi): `pm-m9d2-rice.otdi` — o'tgan g'oyalar indekslari (`pm-m9d1-goyalar.goyalar` bo'yicha).
- Nishon: Sorted It! (hamma g'oya saralanganda).
- Mentor rejimi: forma o'rniga 2-ekrandagi Mentor saralashi (natija holatida). Mentor statistikasi: «Saralashni tugatganlar» · «Uchtadan kam o'tganlar».
- O'qituvchi eslatmasi: Eng ko'p ikkilanish — real auditoriya: «5 tanish» — o'quvchi bugun-erta gaplasha oladigan odamlar (ismi emas, kimligi). Uyga vazifa qog'ozi yo'q o'quvchi og'zaki sanaydi.
  Hamma g'oyasi o'tgan o'quvchidan bittasini so'rang: «Shu g'oya uchun 5 kishini ayting». G'oyani «yomon» demang.

## 9 · RICE bahosi  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Qaysi uchta g'oyangiz oldinga chiqadi?** (38)
- Mentor: Birinchi g'oyadan boshlang: to'rt qatorni to'ldiring — RICE kartaning o'zida chiqadi.
- **Tepada — ixcham jadval «Baholanganlar · n / k»** (k — 8-ekranda o'tganlar): har qator — yechim qisqa «…» · RICE soni · ✎; qatorlar RICE bo'yicha tartiblanadi (yangi qator o'z o'rniga sirg'alib kiradi).
- **Markazda — bitta katta karta (joriy g'oya):** tepada yechim qisqa; to'rt qator (`GoyaJadval` ustunlari bilan bir nom, bir savol):
  1. **Qamrov** — Bir oyda nechta odamga yetadi? — son kiritiladi (placeholder «masalan: 60»).
  2. **Ta'sir** — Bitta odamga qancha foyda? — beshta tanlov: 3 juda katta · 2 katta · 1 o'rta · 0,5 kichik · 0,25 juda kichik.
  3. **Ishonch** — Taxminga qanchalik ishonasiz? — uchta tanlov: 100% o'lchangan son bor · 80% dalil bor · 50% faqat taxmin.
  4. **Mehnat** — Bitta odam necha hafta ishlaydi? — oltita tanlov: 1 · 2 · 3 · 4 · 5 · 6 (hafta).
  5. Karta ostida formula qatori (`RiceFormula`, kichik): to'rt qator to'lgach sonlar uchib kiradi, RICE sanab o'sadi. «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob qator ostida; yumshoq — ikkinchi «Saqlash» bilan o'tadi, «bo'sh» dan tashqari):
  - qator bo'sh (bloklaydi): To'rt qatorni ham to'ldiring. (29)
  - qamrov 0 yoki son emas (bloklaydi): Qamrovni son bilan yozing: bir oyda nechta odam? (48)
  - ishonch 100%: 100% — o'lchangan son bo'lsa. Sizda qaysi son bor? (50)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (yopiq; birinchi xatodan keyin ham ochiladi, P-033): Qamrov — maktabingiz, mahallangiz yoki Telegram guruhingizdagi shunday odamlarni sanang. Ta'sir — taxmin: g'oya bitta odamning muammosini qanchalik yengillashtiradi — juda ko'p bo'lsa 3, sezilmas bo'lsa 0,25.
  Ishonch — odamlar shu muammoni aytgan bo'lsa 80%, faqat o'zingiz o'ylagan bo'lsa 50%. Mehnatga 6 hafta qo'ysangiz, «Bajariladimi?» javobini qayta ko'ring: shu modulda boshqa ishga vaqt qolmaydi.
- **Harakat → Vizual o'zgarish:** son yoki tanlov → qator ✓ (~1 s yashil); to'rttasi to'lgach formula qatoriga sonlar uchadi, RICE sanab o'sadi. «Saqlash» → karta kichrayib tepadagi jadvalga uchadi va RICE bo'yicha o'z o'rniga kiradi;
  pastdan keyingi karta kiradi. Hammasi baholangach: karta yopiladi, jadval butun enga; yuqori uch qator «Uchta» qavsiga oladi, birinchi ikkitasida «Ikkita» belgisi (accent); pastda kulrang «Chetda» qatori (8-ekrandan, ixcham: «Chetda: N ta»).
- **Ikkitasini belgilash (oxirgi qadam):** jadval ustida yorliq: Chuqurroq tekshirish uchun ikkitasini belgilang: RICE birinchi ikkitasini taklif qiladi, qaror — sizniki. (02-FILTR 8)
  Uchta qatorning har birida belgi-katak (birinchi ikkitasi belgilangan). Belgi almashtirilsa (uchinchisi tanlansa) — ostida qator ochiladi: «Nega aynan shu ikkitasi?» (placeholder shu savolning o'zi; bo'sh bo'lsa: Sababini bir qatorda yozing. (28)).
  RICE bir xil bo'lgan qatorlar yonida kulrang yorliq: Baho teng — qaysi biri oldin, o'zingiz tanlaysiz.
- Xulosa (o'quvchi tanlovidan, P-046):
  - ikkitasi — RICE taklifi: RICE jadvalida yuqori uchta g'oya chiqdi; ikkitasi — RICE taklif qilgani. (73)
  - ikkitasi almashtirilgan: RICE jadvalida yuqori uchta g'oya chiqdi; ikkitasini sababi bilan o'zingiz belgiladingiz. (89)
- Tugma (pastki): Yana N ta g'oyani baholang → Ikkitasini belgilang → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy qator (to'lqin) → «Saqlash» (to'rt qator to'lgach halqada) → belgi-kataklar → «Davom etish».
- Artefakt-strip (U-042): shu ekrandan — «Uchta g'oyam» (ixcham: uch qisqa yechim · RICE); 10, 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Saqlash: `pm-m9d2-rice` = `{ otdi, baho: [{ goya, qamrov, tasir, ishonch, mehnat, rice }], uchta, ikkita, sabab, savedAt }` (`goya` — `pm-m9d1-goyalar` indeksi; `ishonch` — 0.8 kabi kasr;
  `sabab` — ikkitasi almashtirilganda, aks holda `""`; TAYANCHGA SAVOL 4).
- Nishon: RICE Rated! (o'tgan g'oyalarning hammasi baholanib, ikkitasi belgilanganda).
- Mentor rejimi: forma o'rniga 4-ekrandagi Mentor jadvali (natija holatida). Mentor statistikasi: «RICE jadvalini tugatganlar» · «Ikkitasini o'zi almashtirganlar».
- O'qituvchi eslatmasi: Sonlar taxmin — «to'g'ri son» yo'q. Qamrovi katta chiqqan o'quvchidan so'rang: «Bu odamlar kimlar, qayerda?» (son chegarasi yo'q — 02-FILTR 10) Ishonch 100% qo'ygan o'quvchidan — qaysi son o'lchangan.
  Ikkitasini almashtirgan o'quvchi sababini sinfga aytsin: RICE — tanlovga yordam, hukm emas.

## 10 · Sherik «nega?» deydi  ← QMustaqil (juftlik, 3 qadam; P-057 solishtirish sahnasi)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Sherigingiz qaysi soningizga «nega?» deydi?** (43) · yakka rejimda: **Mentorning qaysi soniga «nega?» der edingiz?** (44)
- Mentor: Birinchi o'rindagi g'oyangizni sherigingizga ko'rsating — u bitta sonni tanlab, «nega?» deb so'raydi.
  Yakka rejimda: Mentorning ikkinchi g'oyasidan bitta sonni tanlang — Mentor sababini aytadi.
- Qadamlar (`QQadamlar`): 1 Sonni tanlang · 2 Sababini ayting · 3 Qaror (yakka: 1 Sonni tanlang · 2 Mentorni o'qing · 3 Qaror)
- 1-qadam: o'quvchining 1-o'rindagi g'oyasi — katta karta (9-ekrandan): yechim qisqa, to'rt son katta-katta (Qamrov · Ta'sir · Ishonch · Mehnat) va RICE. Ustida savol-qator: «Sherigingiz qaysi sonni so'radi?» — to'rt son bosiladi (halqada).
- 2-qadam: tanlangan son accent; «1 daqiqani boshlash» (taymer; ▶ belgisiz) — o'quvchi sherigiga sababini og'zaki aytadi.
- 3-qadam: ikki tugma: «✓ Son qoladi» · «✎ Sonni o'zgartiraman» → o'zgartirsa, o'sha qatorning tanlovlari (9-ekrandagidek) ochiladi → RICE qayta sanaladi;
  «Uchta g'oyam» jadvalida qatorlar kerak bo'lsa silliq o'rin almashadi (o'zgarish `pm-m9d2-rice` ga yoziladi; «Uchta»/«Ikkita» qayta sanaladi, ikkitasi o'quvchi tanlagan bo'lsa — belgisi saqlanadi).
- **Harakat → Vizual o'zgarish:** son bosish → o'sha son kattalashib accent halqa oladi · taymer → sanoq · «✓ Son qoladi» → son yonida yashil ✓ · «✎ Sonni o'zgartiraman» → yangi son sirg'alib kiradi,
  RICE eski qiymatdan yangisiga sanab o'tadi, o'rin o'zgarsa jadvaldagi qator yuqoriga yoki pastga suriladi.
- Xulosa (tanlovdan, P-046):
  - «✓ Son qoladi»: Soningizni sabab bilan tushuntirdingiz — baho o'zgarmadi. (57)
  - «✎», o'rin o'zgarmadi: Bitta son o'zgardi va baho ham o'zgardi: RICE sonlari — taxmin. (63)
  - «✎», o'rin o'zgardi: Bitta son o'zgardi va g'oyalar o'rni almashdi: RICE sonlari — taxmin. (69)
- Yakka rejim (sherik yo'q yoki 9-ekran bo'sh): Mentorning **Mahalla to'garaklari** kartasi — Qamrov 80 · Ta'sir 1 · Ishonch 50% · Mehnat 2 · RICE 20. O'quvchi bitta sonni bosadi → chapda Mentor pufagi (o'ylab topilgan izoh — TAYANCHGA SAVOL 12):
  - Qamrov 80: Mahallada to'garak izlaydigan o'smirlar ko'p deb o'yladim, lekin ularni sanamaganman.
  - Ta'sir 1: To'garak topilsa foydasi bor, lekin u har kuni kerak bo'ladigan narsa emas.
  - Ishonch 50%: Bu g'oya bo'yicha hali hech kim bilan gaplashmaganman — faqat taxmin.
  - Mehnat 2: Xarita va jadval — ikki ekran: bir o'zim ikki haftada qura olaman deb o'yladim.
  → ikki tugma «✓ Ishonarli» · «✕ Ishonarsiz»; xulosa: «✓» — Sababi bor — son qoladi. Lekin bu misolda ishonch 50%: sonlar hali taxmin. (74) ·
  «✕» — Ishonarsiz son pasaysa, g'oya o'rni o'zgarishi mumkin: RICE sonlari — taxmin. (77)
- Tugma (pastki): Qarorni belgilang → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: to'rt son → «1 daqiqani boshlash» → «✓ Son qoladi» / «✎ Sonni o'zgartiraman».
- Nishon: Pair Review! (qaror belgilanganda).
- Mentor statistikasi: «Son qoldi» · «Son o'zgardi» · «O'rin almashdi» (sinf bo'yicha son).
- O'qituvchi eslatmasi: 1 daqiqadan keyin «O'rin almashing» deng. Sonni o'zgartirgan 2–3 o'quvchidan so'rang: qaysi son, nega va o'rin o'zgardimi? O'zgarish — xato emas: sonlar taxmin.

## 11 · Kod yozish  ← QKod (VS Code; tayanch 4; PM-082)
- Eyebrow: Kod yozish · VS Code
- Sarlavha: **RICE bahosini hisoblaydigan kod yozamiz.** (41) — PM-082(a) sarlavha oilasi (korpus §19, §48)
- 1-bosqich (darvoza-savol, PM-082 c/e, ballsiz) — Mentor: Avval bitta savol — so'ng kod yoziladi.
  - Savol: **Kodda `sort` dan keyin `goyalar[0]` da qaysi g'oya turadi?**
  - RICE bahosi eng katta g'oya ✔ · Ro'yxatga birinchi yozilgan g'oya · RICE bahosi eng kichik g'oya
  - Xato bosilsa (silkinadi + qator): Bu kodda `sort` bahoni kattadan kichikka tartiblaydi. (53)
- 2-bosqich — Mentor: Jadvalda ko'rgan hisobni endi kod qiladi: `rice` funksiyasini va eng yuqori uchtasini yozing.
  - Chap «Kod nima chiqarsin» (3 band; bosiladigan katakcha emas): 1 `rice(g)` qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'ladi · 2 Terminalda uchta qator: o'rni, nomi va bahosi ·
    3 Birinchi qator — «1. Jamoa yig'ish — 24»
  - Yordam (yopiq):
    - Eslatma (JavaScript darslaridan): `g.qamrov` — g'oyaning qamrovi · `*` — ko'paytirish, `/` — bo'lish · `return` — funksiya natijasini qaytaradi · `for` — qatorlarni birma-bir ko'rib chiqadi (sikl) ·
      `console.log` — terminalga chiqaradi · `sort` — ro'yxatni tartiblaydi (bu kodda tayyor) · **terminal** — `node rice.js` yozib natijani ko'radigan oyna · kodda 80% — `0.8` (kasr nuqta bilan)
    - Uch qadam: 1. `rice` ichida: `return g.qamrov * g.tasir * g.ishonch / g.mehnat;` · 2. Sikl: `for (let i = 0; i < 3; i++)` ·
      3. Sikl ichida: `console.log((i + 1) + ". " + goyalar[i].nom + " — " + goyalar[i].baho);`
  - Tugma: Bajardim — uch qator chiqdi (o'ngda)
  - O'ng: VS Code oynasi `rice.js` (qo'lda yoziladi; sichqoncha ustida: Kod nusxalanmaydi — o'zingiz terib yozasiz), ostida terminal:
    ```js
    // rice.js — Mentorning to'rtta g'oyasi: RICE bahosi va eng yuqori uchtasi

    // ishonch kodda kasr bilan: 80% — 0.8, 50% — 0.5
    const goyalar = [
      { nom: "Jamoa yig'ish",            qamrov: 60, tasir: 2,   ishonch: 0.8, mehnat: 4 },
      { nom: "Maydon pulini bo'lishish", qamrov: 30, tasir: 1,   ishonch: 0.5, mehnat: 3 },
      { nom: "Mahalla to'garaklari",     qamrov: 80, tasir: 1,   ishonch: 0.5, mehnat: 2 },
      { nom: "Sinf uy vazifalari",       qamrov: 30, tasir: 0.5, ishonch: 0.5, mehnat: 2 },
    ];

    function rice(g) {
      // qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'ling
      return 0;   // shu joyni siz yozasiz
    }

    // har g'oyaga baho qo'shamiz va kattadan kichikka tartiblaymiz (bu qism tayyor)
    goyalar.forEach(function (g) { g.baho = rice(g); });
    goyalar.sort(function (a, b) { return b.baho - a.baho; });

    // Shu yerga: eng yuqori uchtasini terminalga chiqaring (Yordam ▸)
    ```
  - Terminal paneli «Kutilgan natija» (boshidan xira, 9-Modul 12-q1 A naqshi):
    ```
    $ node rice.js
    1. Jamoa yig'ish — 24
    2. Mahalla to'garaklari — 20
    3. Maydon pulini bo'lishish — 5
    ```
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri javob → kod namunasida `goyalar.sort(…)` qatori bir lahza ajraladi; «Bajardim» → terminaldagi kutilgan natija xiradan to'liq rangga o'tadi,
  uch qator ketma-ket bir lahza ajraladi — bu 4-ekrandagi jadvalning yuqori uch qatori (kod ko'rinishi).
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Tugmalar: Orqaga · Avval kod-savolini yeching → ② Kodni yozing va tugmani bosing → Davom etish
- O'qituvchi eslatmasi: Kod — 3–4 daqiqalik mashq: `rice` bitta qator, sikl uch qator. `node rice.js` — VS Code terminalida. Ekranda «0,8», kodda `0.8` — sinfga bir gap bilan ayting.
  Kuchli o'quvchi o'z uchta g'oyasini massivga qo'shib ko'rsa bo'ladi — shart emas.

## 12 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; RICE — tanlovga yordam, hukm emas)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Ikki g'oyangiz RICE da 20 va 18 oldi. Bu nimani bildiradi?** (10 so'z) · savol ustida yorliq yo'q
  - A — Birinchisi g'olib — ikkinchisini o'chirasiz (43)
  - B — Birinchisini qurasiz — gaplashish shart emas (44)
  - ✔ C — Sonlar taxmin — boshqa dalil ham kerak (38)
  - D — Ikkinchisi yomon — RICE uni chetga chiqardi (43)
- To'g'ri izohi: RICE — tanlovga yordam, hukm emas: sonlar taxmin, qarorga boshqa dalil ham kerak.
- Xato izohlari: A — RICE hukm emas: 20 ham, 18 ham — taxmindan chiqqan son. (55) · B — Baho — taxmin, isbot emas. (26) ·
  D — RICE chetga chiqarmaydi — u faqat tartiblaydi. (46) · (umumiy) RICE nimaga yordam berishini eslang. (36)
- Javob topilgach (kichik, savol ostida): ikki qator — «20» va «18» — yonma-yon gorizontal chiziqlar (uzunligi deyarli teng), ustida kulrang yorliq «taxmin».
- Izoh (MD): A, B, D — «RICE hukm» yanglishining uch ko'rinishi (S-040); tire to'rtalasida; to'g'ri javob eng qisqasi (C 38 · A 43 · B 44 · D 43 — farq ≤15%). «Yaqin» chegarasi talab qilinmaydi (02-FILTR 22).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Real auditoriya · 2 — RICE hisobi · 3 — Instagram Stories · 4 — Yakuniy savol

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| G'oyani saralashda qaysi uch savol beriladi? | Bajariladimi, real auditoriya bormi va qiziqmi |
| «Bajariladimi?» savoli nimani so'raydi? | Birinchi versiyasini shu modulning 6 haftasida qura olasizmi |
| Real auditoriya savoli nimani tekshiradi? | Gaplasha oladigan kamida 5 tanishingiz borligini — muammo borligini emas |
| Qaysi g'oya RICE ga o'tadi? | Uchala savolga «ha» olgan g'oya |
| RICE ni qanday hisoblaysiz? | Qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz |
| Qamrov nimani o'lchaydi? | G'oya bir oyda nechta odamga yetishini |
| Ta'sir qaysi sonlar bilan belgilanadi? | 3 juda katta, 2 katta, 1 o'rta, 0,5 kichik, 0,25 juda kichik |
| Bu kursda ishonch qachon 80% bo'ladi? | Dalil bo'lsa: masalan, odamlar shu muammoni aytgan |
| Bu kursda mehnat qanday sanaladi? | Bitta odam necha hafta ishlashi bilan |
| Nega Stories Instagram'da ko'proq ishlatildi? | U yerda tayyor katta auditoriya bor edi — format ko'proq odamga yetdi |
| Mentorning qaysi g'oyasi RICE da birinchi bo'ldi va nega? | Jamoa yig'ish: ta'siri katta va ishonchi 80% — dalil bor |
| RICE tanlovni o'zi hal qiladimi? | Yo'q: u faqat tartiblaydi, sonlar esa taxmin |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (uch savol — 2, 8 · 6 hafta, 5 tanish — 2, 8 · RICE ga o'tish — 2 · formula — 4, 5 · qamrov, ta'sir, ishonch — 4, 9 · hafta — 4 · Stories — 6, 7 · Mentorning birinchisi — 4 · hukm emas — 4, 9, 12).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013); oxirgi karta — o'z so'zlari bilan.

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Uchta g'oyangiz RICE jadvalida oldinga chiqdi.** (46) · uchtadan kam baholangan bo'lsa (P-046): **{k} ta g'oya baholandi — qolgani uyda.** (≈36)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Uch savoldan o'tgan g'oyalarni RICE tartiblaydi; RICE — tanlovga yordam, hukm emas.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - G'oyani uch savol bilan saralaysiz: bajariladimi, real auditoriya bormi, qiziqmi.
  - RICE uchun qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz.
  - Bu kursda mehnat — bitta odam necha hafta ishlashi.
  - Stories voqeasida format ko'proq odamga yetgan joyda ko'proq ishlatildi.
  - Bitta son o'zgarsa, g'oyalar o'rni ham o'zgarishi mumkin.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: uydagilardan biri · Nechta: 2 g'oya, 10 tanish · Muddat: keyingi darsgacha
  - ① Darsda ulgurmagan g'oyalarni saralang va baholang — «Uchta g'oyam» ro'yxatida.
  - ② Uchta g'oyangizning RICE sonlarini uydagilardan biriga ko'rsating. U qaysi soniga «nega?» desa, o'sha sonni qayta ko'ring.
  - ③ Belgilangan ikki g'oyangizning har biri uchun gaplasha oladigan 5 kishini qog'ozga yozing: ismi emas, kimligi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Ikki g'oyadan qaysi biri odamlarga kerak?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); «Kim bilan» — HwCard yorlig'i (g'oyaning «Kim uchun» qismi bilan to'qnashmasin, T-015). ③ — 3-darsdagi intervyular uchun tanishlar (har g'oyaga 5 — tayanch 1.3, 4-darsgacha 10 yozuv);
  intervyu so'zi uyga vazifada aytilmaydi — 3-dars o'zi ochadi.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Sorted It!** (8-ekran, hamma g'oya saralanganda) — G'oyalaringizni uch savol bilan saraladingiz
- **RICE Rated!** (9-ekran, o'tganlarning hammasi baholanib, ikkitasi belgilanganda) — Savollardan o'tgan g'oyalaringizni RICE bilan baholab, ikkitasini belgiladingiz
- **Pair Review!** (10-ekran, qaror belgilanganda) — Bitta soningizni sabab bilan tushuntirdingiz
- **RICE Coder!** (11-ekran, darvoza-savol birinchi urinishda va «Bajardim») — RICE bahosini hisoblaydigan kod yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Real auditoriya** — 1 Uch savol: bajariladimi, real auditoriya bormi, qiziqmi. · 2 Real auditoriya savoli — gaplasha oladigan kamida 5 tanishingiz bormi. · 3 Bitta «yo'q» bo'lsa, g'oya chetda qoladi.
  — Sinfga savol: Qog'ozingizdagi tanishga o'xshash yana kimlarni bilasiz?
- **5 · RICE hisobi** — 1 Qamrovni ta'sirga ko'paytiring. · 2 Keyin ishonchga ko'paytiring: 80% — 0,8. · 3 Oxirida mehnatga bo'ling.
  — Sinfga savol: Mehnat ikki baravar oshsa, baho nima bo'ladi?
- **7 · Instagram Stories** — 1 Stories'ni Snapchat o'ylab topgan. · 2 2016-yilda Instagram formatni ochiq oldi; u yerda tayyor katta auditoriya bor edi. · 3 Format Instagram'da ko'proq ishlatildi — RICE da bu qamrov.
  — Sinfga savol: G'oyangiz qayerda ko'proq odamga yetadi?
- **12 · RICE — hukm emas** — 1 RICE sonlari — taxmin. · 2 Qarorga sonlardan tashqari dalil ham kerak. · 3 Ikkitani almashtirsangiz, sababini yozasiz.
  — Sinfga savol: RICE da uchinchi bo'lgan g'oyani qachon tanlasa bo'ladi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. G'oya uch savoldan qachon o'tadi? (2)
   - ✔ Uchala savolga «ha» olsa
   - Ikkita savolga «ha» olsa
   - Birinchi savolga «ha» olsa
   - Bitta savolga «yo'q» olsa
2. «Real auditoriya bormi?» savoli nimani so'raydi? (2, 8)
   - 6 hafta ichida qura olasizmi
   - ✔ Kamida 5 tanishingiz bormi
   - Shu g'oya o'zingizga qiziqmi
   - Ilovani necha kishi yuklaydi
3. Qaysi g'oyaning birinchi versiyasini 6 haftada qurish qiyin? (2)
   - Sinf vazifalari ro'yxati
   - Oshxona menyusi sahifasi
   - ✔ Uyga ovqat yetkazish xizmati
   - To'garaklar jadvali sahifasi
4. Ta'sir 3 nimani bildiradi? (4)
   - Uch kishiga foyda yetkazadi
   - Uch hafta mehnat talab qiladi
   - Ro'yxatda uchinchi o'rinda
   - ✔ Har odamga juda katta foyda
5. Bu kursda ishonch 50% qachon qo'yiladi? (4)
   - ✔ Dalil yo'q, faqat taxmin bo'lsa
   - O'lchangan aniq son bor bo'lsa
   - Ko'p odamlar shuni aytgan bo'lsa
   - G'oyaning yarmi qurilgan bo'lsa
6. Bu kursda mehnat qanday sanaladi? (4)
   - Odam-oyda — bitta odam bir oyda
   - ✔ Haftada — bir odam necha hafta
   - Kunda — butun sinf necha kun
   - Soatda — kod necha soat oladi
7. Qamrov 90, ta'sir 2, ishonch 50%, mehnat 3. RICE qancha? (4, 5)
   - 15
   - 60
   - ✔ 30
   - 90
8. Qamrovi katta g'oyaning bahosi nega past chiqishi mumkin? (4)
   - Odam ko'p bo'lsa, baho o'zi pasayadi
   - Qamrov bahoda umuman sanalmaydi
   - Mehnati juda kam bo'lgani uchun
   - ✔ Ta'sir yoki ishonch kichik bo'lsa
9. Stories voqeasidan qaysi xulosa chiqadi? (6)
   - ✔ Yaxshiroq yetkazgan ilova yutdi
   - Uni birinchi o'ylab topgan yutdi
   - Arzonroq bo'lgan ilova yutdi
   - Eng keyin chiqqan ilova yutdi
10. Sherigingiz bitta soningizga «nega?» dedi. Nima qilasiz? (10)
    - Hech narsa demay, sonni o'zgartirmaysiz
    - ✔ Sababini aytib, kerak bo'lsa tuzatasiz
    - G'oyani butunlay chetga chiqarasiz
    - Sherigingiz aytgan sonni yozib qo'yasiz
11. Mentorning jamoa yig'ish g'oyasida ishonch nega 80%? (4)
    - Mentorga bu g'oya hammasidan qiziq
    - Bu g'oyaning ta'siri ikkiga teng
    - ✔ 9-Modulda 5 kishidan 2 tasi aytgan
    - Uning mehnati 4 hafta — eng ko'p
12. `rice(g)` funksiyasi nimani qaytaradi? (11)
    - Bitta g'oyaning qisqa nomini
    - Eng yuqori uchta g'oya nomini
    - Ro'yxatdagi g'oyalar sonini
    - ✔ Bitta g'oyaning bahosini ✎ F-1006-277: «RICE» faqat to'g'ri variantda edi (lint-tell, quruvchi)
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — g'oya · saralash · RICE · qamrov · ta'sir · ishonch · mehnat · tanish ·
  uyga vazifa banneri — g'oya · RICE · tanish · uchta.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmIdeaRiceLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`keng`, `zoom`, `tugadi` — q17/q18) · s3/s5/s7/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s8/s9/s10 `QMustaqil` · s11 `QKod` (VS Code varianti — 9-Modul `m7-03` 11-ekran naqshi: darvoza → VS Code oynasi + terminal, «Bajardim») · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`GoyaJadval`** — bitta vizual (180): ikki ko'rinish (`saralash` · `rice`), qator holatlari (bo'sh/joriy/yozildi/chetda), «Chetda» qismi, ustun sarlavhasi savol → nom, qayta tartiblash animatsiyasi (FLIP),
   «Uchta» qavsi, «Ikkita» yorlig'i; ixcham ko'rinish (9-ekran tepasi, artefakt-strip). **`RiceFormula`** — formula kartasi (sonlar uchib kiradi, natija sanab o'sadi). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz.
   1-dars `GoyaKarta` (to'liq ko'rinish) 8-ekranda qayta ishlatiladi — 1-dars faylidan nusxa olinmaydi, shu darsning o'z komponenti (qolip-maket izohi faylda).
3. **Ma'lumot:** `MENTOR_GOYALAR` — 6 × `{ nom, muammo, kim, yechim, manba }` (1-dars bilan aynan, tayanch 1.1) · `MENTOR_SARALASH` — 6 × `{ b, a, q, sabab }` (A-bo'lim jadvali) ·
   `MENTOR_RICE` — 4 × `{ goya (indeks), qamrov, tasir, ishonch, mehnat, rice }` (tayanch 1.2 aynan) · `SAVOLLAR` — 3 × `{ q: qisqa, t: to'liq }` (bitta manba: s2, s3 javob karta, s8, recap 3, kartochka 1–2) ·
   `TASIR_SHKALA` (3/2/1/0,5/0,25 + nomi) · `ISHONCH_SHKALA` (100/80/50 + izohi) · `MEHNAT_HAFTA` (1–6). Kasr ko'rinishi — vergul («0,5», «3,75»), kodda nuqta.
4. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); javob 91 belgi; maket — «Mentorning g'oyalari · 6 / 6» + «6 g'oya → ? → 3 g'oya» yo'li; tanlovdan keyin uch uzuq katak.
5. s2: `QBashorat` 2/5/8 → ixcham qator; savol-tugmalar bashoratdan keyin, ketma-ket; ✓/✕ navbat bilan (60 ms), chetga surilish, hisoblagich; `QIzoh` (saralash atamasi) + `QTaxmin` + xulosa bitta natija blokida (SABOQ 25); 40 s ipucha.
6. s4: ustun-tugmalar 5 (savol → nom); 1-ustundan keyin `QBashorat` (1/2/3-o'rin); shkala qatorlari (ta'sir, ishonch); dalil-yorliq; «Hisoblash» → `RiceFormula` + RICE ustuni + qayta tartiblash + «Uchta»/«Ikkita»;
   `QIzoh` (RICE atamasi) + manba qatori (Intercom, odam-oy → hafta) + `QTaxmin` + xulosa — natija blokida; `tugadi` da ustun savollari kulrang ostki qatorga.
7. s6: `STORIES_BOSQICH` 3 × `{ h — bosqich nomi, m — Mentor gapi }` (SABOQ 8); `StoriesSahna` (ikki telefon ≈170×272; doirachalar qatori; surat ochilib-yopilishi; siluetlar; chiziqlar);
   nomlar «Snapchat» (sariq) va «Instagram» (o'z rangi) — `Brend` komponenti, logotip yo'q; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); manba izohi faylda.
8. s8: o'qiydi `pm-m9d1-goyalar` (`{ goyalar: [{ muammo, kim, yechim, manba }] }`); yo'q bo'lsa — uch qatorli forma, saqlangan g'oya `pm-m9d1-goyalar` ga yoziladi (TAYANCHGA SAVOL 5);
   ketma-ket karta (bitta katta, qolgani ixcham — SABOQ 29); bitta «Yo'q» → chetga; ✎ — qayta saralash; <3 o'tsa «Davom etish» qulf (`optionalLive`); nishon `sortedIt`.
9. s9: ketma-ket karta, to'rt qator (son kiritish + uch tanlov guruhi), `QXato` tekshiruvlari (bo'sh, qamrov 0/son emas — bloklaydi; 100% — yumshoq; qamrovda son chegarasi yo'q — 02-FILTR 10), jonli RICE (`RiceFormula` kichik),
   RICE bo'yicha tartiblanadigan ixcham jadval; «Uchta» (eng yuqori 3; teng bo'lsa saralash tartibi) · «Ikkita» (default — eng yuqori 2; almashtirilsa `sabab` majburiy); artefakt-strip «Uchta g'oyam»;
   `localStorage` `pm-m9d2-rice` = `{ otdi: [i], baho: [{ goya: i, qamrov, tasir, ishonch, mehnat, rice }], uchta: [i×3], ikkita: [i×2], sabab, savedAt }`; nishon `riceRated`.
   `pm-m9d1-goyalar` tartibi o'zgarmaydi: 1-dars ✎ joyida tahrirlaydi, o'chirish yo'q; 8-ekran zaxira formasi yangi g'oyani oxiriga qo'shadi (02-FILTR 20).
10. s10: 3 qadam; `PairTimer` 1 daqiqa (▶ ⏹ belgisiz); son tanlash → «✓ Son qoladi» / «✎ Sonni o'zgartiraman» (9-ekran tanlovlari) → `pm-m9d2-rice` yangilanadi, «Uchta» qayta sanaladi,
    o'quvchi tanlagan «Ikkita» saqlanadi (o'quvchi tanlamagan bo'lsa — yangi eng yuqori 2); yakka rejim — `MENTOR_RICE` (Mahalla to'garaklari) + 4 Mentor pufagi + «✓ Ishonarli» / «✕ Ishonarsiz»;
    `optionalLive`; Mentor statistikasi; nishon `pairReview`. Yangi kalit yo'q.
11. s11: `QKod` VS Code varianti — darvoza `KOD_DARVOZA` (3 variant, ✔ «RICE bahosi eng katta g'oya»), `KodNamuna` (nusxalanmaydi — `user-select: none`), terminal «Kutilgan natija» xira → «Bajardim» bilan to'liq;
    kod oynasi (`HtmlCompiler`) ishlatilmaydi, `pm-m9d2-code` yo'q; nishon `riceCoder`. ⚠️ Starter matni ichida backtik yo'q (template-satr emas) — CSS/JSX tuzog'i (CLAUDE.md).
12. Testlar s3/s5/s7/s12 — `correctIdx` 1/3/0/2 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6).
    s3/s5/s7/s12 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. `ACHIEVEMENTS` 4 (`sortedIt`, `riceRated`, `pairReview`, `riceCoder`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); `HW_TOKENS` — faqat so'z.
14. Uyga vazifa — yangi `HwCard` (dars yangi; PM-027 «tegilmaydi» bu yerga tegishli emas): yorliqlar «Kim bilan · Nechta · Muddat», 3 qadam, yakun ekranida aynan shular. Alohida `.homework.jsx` yo'q.
15. App.jsx: `m9-02` qatoriga `comp: PmIdeaRiceLesson` + import — asosiy seans (bu agent tegmaydi). Nom «Oltita g'oyadan qaysi uchtasi qoladi?» ✓ va osti «saralash va RICE bahosi» ✓ (DE-205).
16. **REPO — yo'q** (PM darsi; `maydon-jamoa` 7-darsdan).
- Darvozalar: `npm run gates -- src/9-Modull/PmIdeaRiceLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10, 02-FILTR):** 1, 2, 3, 4, 5, 9, 10, 11, 13, 14 — qabul, tayanch 1.2 va 9.48–9.52 ga yozildi · 6 — qoladi («Davom etish» qulf, so'z — «bugungi mashq sharti») · 7 — qoladi (1–6 hafta) ·
> 12 — Mentor sabablari tayanch 1.2 ga kiritildi (o'zboshimcha emas) · 15 — 1000 chegarasi olib tashlandi · 8 — ochiq (asosiy seans: `m3` LMS raqami).
1. **Uch savol siz-formada.** Tayanch 1.2 — birinchi shaxsda («qura olamanmi», «tanishim bormi», «xohlaymanmi»). Darsda hamma joyda siz-forma («qura olasizmi», «tanishingiz bormi», «xohlaysizmi»),
   2-ekrandagi Mentor misolida ham — bitta matn, bitta manba `SAVOLLAR` (T-014, T-042). Qisqa nomlar (Bajariladimi? · Real auditoriya bormi? · Qiziqmi?) — tayanchdagidek.
2. **Ishonch darajalarining izohi** — «100% o'lchangan son bor · 80% dalil bor · 50% faqat taxmin». Intercom maqolasidagi misollardan moslandi (100% — «quantitative metrics … user research … engineering estimate»;
   80% — «data to support the reach and effort, but I'm unsure about the impact»; 50% — «may be lower than estimated … effort may be higher»). Jamoa yig'ishdagi 80% (dalil — 9-Modul intervyusi) shu izohga mos. Tayanch 1.2 ga qo'shish taklifi.
3. **Chetdagi g'oyalar** — saralashdan o'tmagan g'oya o'chirilmaydi, «Chetda» qismida turadi (✎ bilan qayta saralanadi). Kalitda alohida maydon yo'q — `otdi` dan tashqaridagilar.
4. **`pm-m9d2-rice` maydonlari:** `goya` — `pm-m9d1-goyalar.goyalar` indeksi (nusxa emas); `ishonch` — kasr (0.8); **`sabab`** — yangi maydon (ikkitasi RICE taklifidan boshqacha bo'lsa).
   3-dars `ikkita` dagi ikki g'oyani o'qiganda 1-dars kalitini ham o'qishi kerak (g'oya matni u yerda). Muqobil — `baho[].goya` ga `{ muammo, kim, yechim }` nusxasi. Qaysi biri?
5. **`pm-m9d1-goyalar` yo'q bo'lsa** (1-darsni o'tmagan yoki boshqa qurilma): 8-ekranda g'oyalar uch qatorli forma bilan yoziladi va **`pm-m9d1-goyalar` ga saqlanadi** (2-dars 1-dars kalitiga yozadi) —
   indekslar bir manbada qolsin deb. `manba` maydoni — `'kuzatuv'` (yoki bo'sh). Ruxsat kerak.
6. **Uchtadan kam g'oya o'tsa** — «Davom etish» qulf, yo'riq: «Chetda» gi g'oyani ✎ bilan qayta ko'ring. Yangi g'oya qo'shish yo'li yo'q (1-dars ro'yxati o'zgarmasin) — kerak bo'lsa qo'shiladi.
7. **Mehnat tanlovi 1–6 hafta** (butun son). Intercom: butun son, kamida yarim oy. 6 haftadan ko'p — «Bajariladimi?» savoliga zid, shuning uchun 7+ yo'q. 0,5 hafta yo'q.
8. **P0 ko'prigi** «User Story darsida hikoyalarga navbat belgilagansiz (prioritet)» — modul raqami aytilmadi: kursdagi MD larda `m3` darslari ham «3-Modul», ham «4-Modul» deb yozilgan (9M `03` — «3-Modul m3-05»; 11M `01` — «4-Modul m3-17»).
   «Qaysi ishni birinchi qilasiz?» (`m3-05`) ham shu sababli faqat nomi bilan (O'qituvchi eslatmasida). Kursda `m3` qaysi LMS raqami — bir marta yopilsin.
9. **K14 kursda ikkinchi marta:** `m3-05` (`PmLesson8`) da Instagram Stories voqeasi bor va burchagi ham yaqin («bir xil ish odam ko'p joyda ko'proq odamga yetadi»). Qaror-0 17 bo'yicha qoldirildi —
   modul ichida takror emas; O'qituvchi eslatmasida ko'prik qilib ishlatildi, test savoli `m3-05` arenasidagi savolni takrorlamaydi. Boshqa keys kerakmi?
10. **Stories izohi** «bir kundan keyin o'chib ketadigan surat va videolar» — bankda yo'q (format tavsifi; `m3-05` dagi izoh bilan bir ma'noda). Snapchat izohi — KORPUS §189 so'zma-so'z.
11. **Intercom izohi** «mijozlar bilan yozishadigan chat dasturi» (S-018 — brend nimaligi) va «RICE Intercom kompaniyasida o'ylab topilgan» — maqoladagi «we began developing our own scoring system» dan. «Jamoa» so'zi ishlatilmadi (Qaror-0 3).
12. **Yakka rejimdagi Mentor pufaklari** (10-ekran, to'rt izoh: «ularni sanamaganman», «har kuni kerak bo'ladigan narsa emas», «hech kim bilan gaplashmaganman», «ikki ekran — ikki hafta») — o'ylab topildi;
    tayanch 1.2 sonlariga mos, yangi son yo'q.
13. **Saralash sabab yorliqlari** (A-bo'lim jadvali, 6 g'oya — F-1006-272): 5 «pul va yetkazish kerak», 6 «kamida 5 tanish topilmadi» — 1.2 dagi so'zlar; 6 uchun «topilmadi» (07.10, F-1007-289: raqamlar 10 g'oyalik ro'yxatdan yangilandi)
    (tanishlar soni aytilmaydi — o'ylab topilgan son bo'lmasin).
14. **`sort` JavaScript darslarida o'tilmagan** (grep: faqat ichki kodda) — 11-ekranda «bu qism tayyor», izoh va Yordam bilan; darvoza-savol shu qatorni o'qitadi. Muqobil — o'quvchi `if` bilan eng kattasini topadi (uzunroq).
15. **Qamrov «bir oyda»** — o'quvchining hali yo'q mahsuloti uchun taxmin; Yordam «maktabingiz, mahallangiz yoki Telegram guruhingizdagi shunday odamlarni sanang». Yumshoq chegara 1000 — o'zim tanladim.

## Shubhali joylar (ishonchim komil emas)
- 4-ekran: jadvalda RICE dan oldingi tartib 2-ekrandagidek (1, 2, 3, 4, 8) — tayanch 1.2 jadvali esa RICE tartibida. Qayta tartiblash harakati shu farqqa tayanadi.
- 4-ekran bashorati «Qamrovi eng katta «Mahalla to'garaklari» oxirida nechanchi bo'ladi?» — 1-ustundan keyin chiqadi (ekran boshida emas); variantlar o'rin tartibi bilan (birinchi → ikkinchi → uchinchi, S-015).
- 6-ekran: «Instagram ham Stories qo'shsa, …» bashorati 1/3 da — 2016 yili Mentor gapida 2/3 da aytiladi. Siluetlar soni farqi (Instagram atrofida ko'proq) — bank «tayyor katta auditoriya» ning chizmasi, son emas.
- ~~6-ekran 3/3 Mentor: «ko'proq odamga yetkazgan»~~ — **yopildi (02-FILTR 13):** Mentor bank so'zi bilan («yaxshiroq yetkazgan yutdi»), qamrov ko'prigi — xulosada («tayyor katta auditoriya formatni ko'proq odamga yetkazdi»).
- 5-ekran va arena 7: hisob-savollarda variant — faqat son (tire yo'q, uzunlik teng). Arena 15 soniyada «90 × 2 × 50% ÷ 3» ni og'zaki hisoblash — qiyin bo'lishi mumkin.
- 3-ekran D varianti «Hech biriga — tanishlar keyin ham topiladi» — savol «Qaysi savolga «yo'q»?» ga grammatik javob, lekin boshqa uchtadan shakli farq qiladi (savol nomi emas).
- Arena 3: «Uyga ovqat yetkazish xizmati» — 6 haftada qurib bo'lmaydi degan da'vo kod emas, yetkazish va pul tufayli (Mentorning 6-g'oyasi sababi bilan bir) — o'quvchi «sayti 6 haftada bo'ladi» deb e'tiroz qilishi mumkin.
- Arena 11: «Uning mehnati 4 hafta — eng ko'p» — Mentor jadvalida rost (4 — eng katta mehnat), lekin ishonch sababi emas (rost, lekin mos emas — S-004).
- 8-ekran: «bitta «yo'q» yetadi» — keyingi savollar so'ralmaydi; o'quvchi qolgan javoblarni ko'rmaydi (Mentor misolida ham «—»).
- 9-ekran: o'quvchining yechimi uzun bo'lsa ixcham qatorda «…» bilan qisqaradi — jadvalda g'oyalar bir-biriga o'xshab qolishi mumkin (nom maydoni yo'q — tayanch 8).
- 11-ekran: `forEach`, `function`, `return`, `for`, `console.log` — JS darslarida o'tilgan deb oldim (1-dars MD bilan bir); `sort` — yo'q (TAYANCHGA SAVOL 14).
- 1-ekran Mentori: «User Story darsida hikoyalarga navbat belgilagansiz» — o'quvchi bu darsni ancha oldin o'tgan; eslay olmasligi mumkin, ikkinchi gap baribir tushunarli.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 9-blok — `m9-01` «Oltita g'oyani qayerdan topasiz?» → **`m9-02` «Oltita g'oyadan qaysi uchtasi qoladi?»** (osti «saralash va RICE bahosi» — reja chap qatori so'zma-so'z)
  → `m9-03` «Ikki g'oyadan qaysi biri odamlarga kerak?» (yakun qatori). Sarlavha 0-ekranda = dars nomi.
- [x] Bitta misol-ip: Mentorning 6 g'oyasi (1-dars, tayanch 1.1) → saralash (1.2: 4 ta) → RICE (1.2 jadvali aynan) → uchta, ikkita; metafora yo'q; bitta vizual — `GoyaJadval` (saralash · RICE) + `RiceFormula`.
  Ikkinchi misol faqat testda (sinfdosh g'oyasi, «g'oyangiz» sonlari, arena 3 — P-002). Stories — keys sahnasi (PM-028/029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha) + 0, 6, 8, 9, 10, 11; testlarda javobdan keyingi karta. «bosish → matn-karta» yo'q — har bosish jadval, sahna yoki kartani o'zgartiradi.
- [x] O'lchov (skript bilan sanaldi, `scratchpad/md02/olchov.py`): sarlavha ≤55, bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
- [x] Atamalar: g'oya (1-dars ta'rifi), «G'oyalarim», dalil-yorliq (1-dars) — so'zma-so'z; navbat belgilash (prioritet) — P0 so'zi bilan; yangi — uch savol, saralash, qamrov/ta'sir/ishonch/mehnat, RICE — hodisadan keyin;
  «jamoa», «maydon» — bitta ma'noda; «baho» — faqat RICE; siz-forma, tugmalar ot-shaklda («Saqlash», «Hisoblash», «Davom etish»).
- [x] Testlar: 4 variant, uzunlik teng (s3 37–42 · s5 2/2/2/2 · s7 38–41 · s12 39–44 — farq ≤15%); to'g'ri javob hech qayerda yolg'iz eng uzun emas;
  tire to'rtala variantda (s3, s7, s12). Arena 12 — ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «albatta», «100%» — 100% faqat ishonch darajasi nomi sifatida) · «bu misolda», «bu voqeada» bilan chegaralangan.
- [x] Ichki kodlar yo'q (o'quvchi matnida F-kod, `m9-NN`, «Modul 11» yo'q; modul raqami LMS raqamida — «9-Modul»). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 16 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (uch savol, saralash, to'rt son, RICE — hodisadan keyin; sarlavhalarda yangi atama yo'q, RICE sarlavhada faqat 11-ekranda) · T-014/T-015 («jamoa», «baho», «Kim bilan») ·
  T-016 (metafora yo'q) · T-035 (formula belgilari faqat formula kartasida; izohda so'z bilan) · T-039 («g'oyangiz» — 1-darsda yozilgan) · T-042 (ta'riflar so'zma-so'z: `SAVOLLAR`, to'rt bo'lak) ·
  T-043 («bu misolda», «bu voqeada») · T-047/T-048 · T-052 (P0 ko'prigi bir gapda) · T-064 (4-ekran sarlavhasi 0-ekran savoliga javob) ·
  P-001 · P-008 · P-013 · P-015 · P-025 · P-033 · P-036 (0-ekranda natija ochilmaydi) · P-046 (8, 9, 10-ekran xulosasi o'quvchi ma'lumotidan) · P-053 (Stories — bosqichma-bosqich, `pre` kadr) · P-057 · P-062 · P-064 · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 · S-006 · S-010 · S-015 (bashoratlar bir o'lchov, tartib bilan) · S-018 (Snapchat, Intercom izohi) · S-020 · S-026 · S-027 · S-040 (5-ekran, 12-ekran — bitta xato-sinf) ·
  PM-005 (2-tur) · PM-017 · PM-018 (Stories — faqat bankdagi voqea, ichki qaror da'vo qilinmaydi) · PM-082 (kod ekrani darvozasi, nusxa yo'q) · J-026 (hook) · SABOQ 1–31 (A-bo'limda va har ekranda).
