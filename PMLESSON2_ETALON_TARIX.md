# 📜 PMLESSON2 — ETALON-TARIX (5 kunlik evolyutsiya, 2026-07-26 → 2026-07-30)

> **Bu hujjat nima uchun:** qolgan ~75 dars qayta tuzilganda quruvchi/metodist AYNAN shu
> yo'ldan yursin — shu yerda yig'ilgan taqiq-so'zlarni UMUMAN ishlatmasin, shu fyuchalarni
> standart deb bilsin, chetga chiqmasin. Bu — tarix-xulosa; qonunlarning o'zi
> `PM_DARS_ETALON.md` (1-B/1-C/1-D, qonun 87–90) va `MATN_KORPUS.md` (20–28-bo'limlar)da.
> Etalon-fayl: `src/1-Modull/PmLesson2.jsx` (1-TUR — texnikaga yaqin PM dars).

---

## 1. XRONOLOGIYA (commit + F-ID bilan)

| Sana | Commit | Nima bo'ldi |
|---|---|---|
| 2026-07-10 | (v18 to'lqini) | Dars asli qurilgan (20 ekran, «Bozor» nomli sayt, audio-qatlam, onboarding-tur bilan) |
| 2026-07-28 | `f4f765b` | Git'ga birinchi kirdi (3334 qator). Shu kun: onboarding-tur o'chdi → **navbat-pulsi** keldi; **F-0728-01…07 foydalanuvchi ko'rigi**; audio o'lik qatlami o'chdi; lessonId `pm-m1d6-v1`; arena-naqsh tuzatildi; katalog-matn tozalandi; pm-metodist matn-sayqali («UX qaror» 14 o'rin) |
| 2026-07-28 | — | **IKKI-TUR ETALON qarori** (PM_DARS_ETALON 1-B): PmLesson2 = 1-TUR etaloni · PmUserStory = 2-TUR etaloni · klon-taqiq |
| 2026-07-29 | `c58bde4` | Ikki-tur etalon muhrlash to'lqini (+895/−549) |
| 2026-07-29 | `e59b2bc` | **F-0729-01…07, 15…18, 20…22** matn-ko'rik + mentor-badges qonuni + 9-sahifa o'chdi (18→17 ekran) + yakun-sahifa neon-kapsula |
| 2026-07-30 | `73493ed` | **F-0730-01** sahifa-holat saqlovi + **F-0730-02…04** matn-sayqal |
| 2026-07-30 | (uncommitted) | **F-0730-05** Stage eyebrow tr() bugi (platforma-sweep 8 fayl) |

**Jami: ~20 ta F-ID to'g'ridan-to'g'ri shu darsga, 5 commit, 20 → 17 ekran.**

---

## 2. HOZIRGI YAKUNIY HOLAT — DARS ANATOMIYASI (17 ekran, chuqur)

| idx | id | type | Komponent | Nima qiladi / mexanika |
|---|---|---|---|---|
| 0 | s0 | hook | Screen0 | OLX «Tartibli/Aralash» ikki-tugmali solishtiruv (bir xil so'zlar, faqat tartib farq) + 3 variantli sabab-so'rovi — HAR tanlov `correct:true` (hook ballanmaydi), ack farqni ochadi |
| 1 | s1 | rule | Screen1 | Reja: 2 «Asosiy g'oya» kartasi + 5 qadam roadmap |
| 2 | s2 | exploration | Screen2 | «Tepada: birinchi blok / Tepada: tugma» chip-solishtiruv (fold) |
| 3 | s3 | exploration | Screen3 | 3 real sayt tap-reveal (OLX · Yangiliklar · Video), 3/3 shart |
| 4 | s4 | **TEST 1** | QuestionScreen | «Birinchi nimani ko'radi?» correctIdx=0 |
| 5 | s5 | exploration | Screen5 | 5 bo'lim tap-reveal — SECDATA vazifasi ochiladi, 5/5 shart |
| 6 | s5b | **TEST 2** | Screen5b | «CTA qayerda?» correctIdx=2 |
| 7 | s6 | exploration | Screen6 | «Hikoyani qurish» stepper — 5 bo'lim 720ms bilan birma-bir yig'iladi |
| 8 | s8 | exploration | Screen8 | Juftlash: bo'lim ↔ vazifa (4 juft, tanla-mosla) |
| 9 | s9 | **TEST 3** | Screen9 | «Tartibdan maqsad?» correctIdx=1 |
| 10 | s11 | exploration | Screen11 | DragDrop 3-bo'lim tartiblash + **CustomerRun sinov-simulyatori** |
| 11 | s12 | **TEST 4** | Screen12 | «Eng mantiqiy tartib?» correctIdx=3 |
| 12 | s14 | rule | Screen14 | Qoida-plakat («Ishonch chiroydan emas, tartibdan») |
| 13 | koding | koding | ScreenCoding | To'liq-ekran StrukturaCompiler (HTML-lint + 4 shart-chip + jonli iframe) |
| 14 | s15b | stats | ScreenPodium | Jonli podium 2-1-3; self'da ScoreRing |
| 15 | sflash | flashcards | ScreenFlashcards | 7 savol-karta 3D-flip, «Bildim/Takrorlash» |
| 16 | s16 | summary | Screen16 | RECAP 4 band + CodeStrike-arena kapsula + «Uyga vazifa» neon-kapsula + nishonlar |

**Ball-relslari:** `INLINE_KEYS {s4:0, s5b:2, s9:1, s12:3}` · scored [4,6,9,11] = RECAPS =
Q_LABELS · `QUIZ_BANK` 12 savol, naqsh `0,1,2,3,1,0,3,2,0,3,1,2` (3/3/3/3, qo'shni takror 0) ·
nishonlar: s4→firstwin · s11→builder · koding→strategist · yakun→graduate.

**Misol-ip xaritasi (91a isboti):** butun dars BITTA olam — OLX: hook-preview `olx.uz` →
s2 → s3 (market) → s6-stepper → s11 CustomerRun → koding (sarlavha/placeholder/preview —
hammasi OLX). Boshqa saytlar FAQAT s3'da, **umumlashma nom bilan** («Yangiliklar», «Video» —
brendsiz) — «qoida universal» degan 3-nuqtali isbot. Testlar/arena brend-neytral.
Ikonka-zaxiralar (telegram/taxi) e'lon qilingan-u ISHLATILMAGAN — matnda begona brend 0.

**Sinov-simulyator (CustomerRun) tili:** yorliq «Foydalanuvchi — sahifangizni birinchi marta
ochib ko'rayotgan odam» · tugma-oila: «Sahifani sinab ko'rish» → «Foydalanuvchi sahifani
ko'rmoqda…» → «↻ Yana/Qayta sinab ko'rish» · convert: «Foydalanuvchi ishonch bilan tugmani
bosdi — bu **konversiya**: u siz kutgan harakatni bajardi.» · bounce: «Foydalanuvchi shu
bo'limga kelganda adashdi va sahifadan chiqib ketdi — bu bo'lim o'z o'rnida emas.»

**Koding (87-qonun jonli tatbiqi — Htmllesson2 qoldirgan struktura-praktika bo'shlig'ini
yopadi):** topshiriq «"OLX" sahifasining tuzilishini yozing» — `header`/`main`/`footer`,
`main`da 4 bo'lim (h2+p), bo'limlar ATAYLAB aralash sanab beriladi (tartibni o'quvchi topadi);
muharrir bo'sh + xira placeholder-namuna («Yozishni boshlasangiz o'chadi — o'zingiz yozing»);
4 shart-chip (teglar bor · 4 bo'lim · qavat-tartib · hikoya-tartib), har hint HARAKATGA
chorlaydi («"Muammo" hozir N-o'rinda — u "…"dan KEYIN kelishi kerak. O'rin almashtiring»);
kod nusxalanmaydi (82d) · avtosaqlash `pm-m1d6-koding` · kdx-skip takrorlash-yo'li (89).

**Puls-nuqtalari (11 ta, aynan):** s0 «Aralash» chipi (tinch) → s0 ovoz-variantlari
(TO'LQIN w1/w2/w3) · s2 yurish (sukutda ochiq hero emas — «tugma» chipi) · s3 saytlar-yurish ·
s5 bo'limlar-yurish · s6 «Hikoyani qurish» (tinch) · s8 yurish, bo'lim tanlangach TO'XTAYDI ·
s11 dd-chip tap-hint · koding «Kompilyatorni ochish» (tinch) · NavNext global · mentor
«🔓 Natijani ochish» (yagona mentor-puls). s14 ro'yxat-jonlanishi — dekorativ, puls EMAS.

---

## 2-B. 🧑‍🏫 MENTOR-GAPLAR ANTOLOGIYASI (barcha 10 gap — namuna-to'plam)

1. **s0:** «Mana internet-magazin — OLX sayti, pastdagi **«Tartibli»** va **«Aralash»** tugmalarini bosib, ikki ko'rinishni solishtiring. So'ng savolga javobingizni variantlardan belgilang.»
2. **s1:** «Yaxshi sayt bo'limlarni to'g'ri tartibda joylashtiradi — bugun siz ham shu **tartibni** o'rganasiz. Yo'limiz — 5 qadam: ro'yxatga qarang, so'ng boshlaymiz.»
3. **s2:** «Saytga kirgan foydalanuvchi dastlab faqat sahifaning **yuqori qismini** ko'radi — qolish yoki ketish shu yerda hal bo'ladi. Pastdagi ikki tugmani bosib, farqni o'zingiz ko'ring.»
4. **s3:** «Mashhur saytlar ham shu qoidaga amal qiladi. Pastdagi uchta saytni **birma-bir bosing** — har birida bo'limlar qaysi tartibda turgani ochiladi.»
5. **s5:** «Yaxshi sahifada ishlamaydigan bo'lim bo'lmaydi — hammasining aniq **vazifasi** bor. Pastdagi beshta bo'limni birma-bir bosing: bosganingizda uning vazifasi ochiladi.»
6. **s6:** «Yaxshi sahifa hikoyaga o'xshaydi: bitta bo'limni o'qigan foydalanuvchi **keyingisini ham** o'qigisi keladi. Pastdagi «Hikoyani qurish» tugmasini bosing — beshta bo'lim ko'z oldingizda birma-bir joylashib boradi.»
7. **s8:** «Chapdagi bo'limlardan bittasini tanlang, so'ng o'ng tomondan uning **vazifasini** toping — to'g'ri topsangiz, juftlik yashil rangga o'zgaradi.»
8. **s11:** «Uchta bo'lakni to'g'ri tartibga joylang, so'ng **«Sahifani sinab ko'rish»** tugmasini bosing — foydalanuvchi sahifangizni tepadan pastgacha o'qib chiqadi.»
9. **s14:** «Ishonch chiroydan emas, **tartibdan** tug'iladi: to'g'ri tuzilgan sahifa foydalanuvchini muammodan yechimga, so'ng harakatga yetaklaydi. Shuning uchun tartib — **foydalanuvchi uchun qilingan qulaylik**.»
10. **koding:** «Tartibni o'rgandingiz — endi uni haqiqiy kodda qurasiz. Pastdagi **«Kompilyatorni ochish»** tugmasini bosing: nima yozishni o'sha yerda ko'rsatamiz.»

Naqsh: har gapda NEGA (sabab) + BITTA aniq chorlov, element O'Z NOMI bilan; test/podium/
flashcard/yakunda mentor-gap YO'Q. Test-izoh uslubi: explainCorrect «To'g'ri! …» + sabab;
explainWrong har variant uchun ALOHIDA — avval variantning to'g'ri jihatini tan oladi,
keyin yo'naltiradi (ayblamaydi).

---

## 2-C. 📐 1-TUR BLOK-STANDART O'QISHI VA 1-TURGA XOS QONUNLAR

**Blok-standart (2-bo'lim) 1-turda shunday to'ladi:** NAZARIYA pozitsiyasida KEYS-SLAYD
o'rniga — **interfeys-namunalar** (tap-reveal, solishtiruv, real-sayt tuzilishi); o'quvchi
harakati = joylashtiradi/tartiblaydi/moslaydi/tuzatadi; artefakt = to'g'ri qurilgan TUZILMA;
koding = tuzilmani kod bilan quradi. Ritm o'zgarmaydi: ilinma → nazariya → test, testlar
ketma-ket EMAS, har test o'z nazariyasidan keyin.

**USTAXONA-chegara:** 48/80-qonun (bittalab-yozish qolipi) 1-turga TATBIQ QILINMAYDI —
yozma artefakt bu turga tegishli emas; artefakt-yaratish qurish-mashqlari va koding orqali.
Agar ARALASH dars yozma qism olsa — o'sha qism 2-tur qolipida quriladi va GATE S'da qayd etiladi.

**1-turga xos qonunlar:**
- **46 (tap-ochilma toggle):** mikro-karta birinchi bosishdan keyin qotib QOLMAYDI — qayta
  ochib-yopiladi; progress «kamida bir marta ochildi» (`seen`) bilan ALOHIDA sanaladi.
- **72 (lagancha):** ko'chiriladigan kartalar yalang'och turmaydi — buyruq-yorliqli idishda,
  diqqat-puls birinchi harakatdan keyin tinchiydi.
- **75 (mexanika-yo'riq):** «avval … tanlang, so'ng … bosing» + element o'z nomi bilan.
- **18/23 (maqsad-ekran WOW):** s1 natija-preview JONLI to'ladi; naqsh universal, KO'RINISH
  har darsda o'z metaforasidan yangi imzo-vizual — klon taqiq.
- **27:** test/recap «quruq ro'yxat» emas — mavzuga mos mikro-animatsiya (reduced-motion bilan).
- **56/79:** ilinma-bashorat DOIM asl javobni ochadi; «ball yo'q» ochiq aytiladi.
- **82 (koding-qolip):** sarlavha «…digan *kod* yozamiz» · mock-panel YO'Q (real natija jonli) ·
  kod nusxalanmaydi · honor-checklist yo'q · sinf-puls o'quvchiga ko'rinmaydi.
- **91a:** hook obyekti = darsning o'qitish obyekti (PmLesson2: OLX boshidan oxirigacha);
  real interfeys-misol KEYS EMAS — unga bank-raqamlari qo'shilmaydi, to'qish umuman taqiq;
  24-qonun: tanlangan sayt boshqa darsda bosh-misol bo'lolmaydi (jurnal tekshiriladi).

**87-qonun 1-tur tatbiq-namunasi:** PmLesson2 kodingi `Htmllesson2.jsx:2562`da olib
tashlangan struktura-praktika BO'SHLIG'INI yopdi — yangi 1-tur dars ham avval «oldingi
texnik dars nimani nazariy berib, praktikasiz qoldirdi?» deb qidiradi.

**v8-halollik eslatmasi:** PM_Prompt_v8 ikki-tur bo'linishidan OLDIN yozilgan — «1-tur hook =
interfeys-solishtiruv» v8'da emas, ETALON 1-B + 91a'dan keladi. v8 koding-jadvalidan 1-turga
mos qatorlar: «lending/dizayn → interfeys-blok verstka» · «ma'lumot/sxema → struktura-topshiriq».

---

## 3. QO'SHILGAN FYUCHALAR (75 darsga standart)

1. **Navbat-pulsi** (88-qonun + 1-C bo'lim) — onboarding-tur O'RNIGA: ekranda ayni lahzada
   FAQAT BITTA element yonadi; ~2.6s harakatsizlikdan keyin; ballanadigan testda javobgacha
   puls YO'Q; sukut bo'yicha ochiq turgan emas — KO'RILMAGANI yonadi. Uch naqsh: tinch halqa /
   YURISH (`useTurnWalk` — bajarilmaganlar bo'ylab) / TO'LQIN (teng variantlar). Darsda 11
   puls-nuqta. Kod-shartnoma 1-C.8 da — qayta ixtiro qilinmaydi, ko'chiriladi.
2. **Mentor ekrani = SAHNA, o'quvchi qurilmasi = DAFTAR** (90-qonun + 1-D jadval) —
   proyektorda nishon-hisoblagich, nishon-ro'yxati, ScoreRing, «0/4» savol-statistikasi
   CHIQMAYDI (yolg'on hisob + mag'lubiyat-tablosi); to'liq-ekran bayram (AchCelebrate) esa
   mentorda ham o'chirildi (F-0729-06, 79 darsga qorovul-sweep qilingan).
3. **Takrorlash-yo'li** (89-qonun) — koding-darvozada xira havola «✓ Bu mashqni sinfda
   bajarganman — davom etish →»; faqat `onNext`, nishon/ball/saqlash YO'Q; faqat self-rejimda.
4. **Sahifa-holat saqlovi** (F-0730-01) — `ccProgress:<lessonId>` localStorage: screen +
   answers + earned + startedAt; TTL 6 soat; total-tekshiruv; reset/finish tozalaydi;
   jonli-o'quvchi mentor-darvozadan oshmaydi. 111 darsga tatbiq qilingan — yangi darsda majburiy.
5. **Yakun-sahifa neon-kapsula** (F-0729-20…22) — vazifa-ro'yxat YO'Q; «Endi siz bilasiz»
   to'liq kenglikda; ostida BITTA katta «Uyga vazifa» tugma (CODE STRIKE fon: qorong'i-binafsha
   radial + neon-hoshiya + suzuvchi dars-tokenlar + shine + zaryad-effekt). Muddat-qatori YO'Q.
6. **Flashcard savol-shaklda** (F-0728-07 → F-0729-05) — «ta'rif→atama» topishmoq EMAS,
   to'g'ridan-to'g'ri savol («… nima vazifani bajaradi?»); mexanika-nomlari ([]«sinov mijozi»),
   belgi-formulalar, manbasiz raqamlar kartaga KIRMAYDI. 11→8→7 karta.
7. **Sinov-simulyator tili** (F-0729-03) — «sinov mijozi» emas «foydalanuvchi»; tugma-holatlar:
   «Sahifani sinab ko'rish» / «Foydalanuvchi sahifani ko'rmoqda…» / «↻ Qayta sinab ko'rish».
8. **Arena javob-naqshi** — qo'shni takror 0, taqsimot 3/3/3/3 (o'quvchi bir tugmani
   bosaverib yutmasin); faqat to'g'ri-variant O'RNI suriladi, matnlar tegilmaydi.
9. **Mentor-eslatma chipi** — MentorNote faqat `isMentor` ostida, «Eslatma — faqat sizga»
   ixcham chip; o'quvchi ekranida MUTLAQO ko'rinmaydi. Keraksiz eslatmalar o'chirilgan.
10. **Real sayt-nomi** (F-0728-04) — o'ylab topilgan «Bozor» emas, bola taniydigan **OLX**;
    LEKIN real nom fakt-majburiyat olib keladi: haqiqiy OLX'da tugma tepada ham bor —
    shuning uchun absolyut da'vo «tugma faqat oxirida» → «tugma SABABDAN KEYIN turadi».
11. **Ikki-tur maqomi** (1-B) — bu dars 1-TUR (texnikaga yaqin): mavzu KO'RINADIGAN interfeys
    orqali; o'quvchi joylashtiradi/tartiblaydi/tuzatadi; artefakt = tuzilma; USTAXONA majburiy
    EMAS; koding = tuzilmani kod bilan qurish. KLON-TAQIQ: 2-TUR (UserStory) vizuallari ko'chirilmaydi.

## 3-B. OLIB TASHLANGANLAR (nega — qisqa sabab)

- **3 ekran o'chdi (20→17):** Screen10 «debug» (soxta ish — tugma bossa o'zi tuzalardi) ·
  Screen13 (6-sahifa bilan kod-darajada takror) · Screen7 toggle (1- va 3-sahifa bilan takror).
- **Audio-qatlam** (9 941 belgi) — allaqachon o'lik edi (speak hech qachon chaqirilmagan).
- **Onboarding-tur** (TOUR+TourGuide ~98 qator) — o'rnini navbat-pulsi oldi.
- **Mentor-statistika podiumda** («0/4») + nishon-hisoblagich/ro'yxat mentor-rejimda.
- **MentorNote'lar** o'quvchiga ko'ringan/ortiqcha joylarda; flashcard-sahifadagi Mentor-blok.
- **«Muddat: keyingi darsgacha»** qatori (F-0729-07) — muddat LMS ishi, ekran ishi emas.

---

## 3-C. 🔔 NAVBAT-PULSI — TO'LIQ LOGIKA (tugma/karta/variant yonishi)

> Normativ manba: `PM_DARS_ETALON.md` 1-C bo'lim + 88-qonun. Kod-manba: `PmLesson2.jsx`
> (`useTurnHint` / `useTurnWalk` / `turnCls` + `.turn-ring/.turn-step/.turn-wave`).
> Bu yerda — to'liq ishlash-mantiq, yangi dars quruvchisi shu tartibda yuradi.

### Nega bor
Onboarding-tur hamma narsani OLDINDAN aytadi — o'quvchi kerak paytda unutgan bo'ladi.
Puls AYNAN KERAK LAHZADA aytadi: «bu ekran hozir mendan nimani kutyapti?». Puls bezak
emas — ekranning HOZIRGI talabi, shuning uchun faqat BITTA joyda bo'la oladi.

### 4 tayanch shart (88-qonun)
1. Ekranda ayni lahzada **FAQAT BITTA** element yonadi (yurish/to'lqinda ham maks 1).
2. Puls darhol emas — **~2.6s harakatsizlikdan keyin** (`TURN_HINT_MS = 2600`); bilgan
   o'quvchi uni umuman ko'rmaydi.
3. **Ballanadigan testda javobgacha puls YO'Q** (test halolligi).
4. Qulflangan / mentorni kutayotgan tugma **yonmaydi**.

### Qaror-tartibi (har ekran uchun 3 qadam)
1. **HARAKAT-ZANJIRINI yozing** — ekran tugashi uchun nima, qaysi tartibda bo'ladi.
   Zanjir DARS MANTIG'I bo'yicha, DOM/ekran-joylashuv bo'yicha EMAS. Namunalar:
   ilinma = ko'rilmagan holat → ovoz → o'tish · ro'yxat = har elementni ochish → o'tish ·
   juftlik-mashq = chapdan tanlash → o'ngdan tanlash (×N) → o'tish · koding =
   kompilyatorni ochish → bajarish → o'tish.
2. **Navbat = birinchi bajarilmagan halqa.** Puls faqat shu yerda; halqa bajarilishi bilan
   DARHOL o'chadi, navbat keyingisiga o'tadi. Oxirgi halqa doim «o'tish» — uni `NavNext`
   avtomatik oladi (qo'shimcha ish YO'Q).
3. **Naqshni halqaning SHAKLI belgilaydi:**
   | Halqa shakli | Naqsh | Vosita |
   |---|---|---|
   | Bitta aniq element bosiladi | tinch nafas | `useTurnHint` → `.turn-ring` |
   | Bir nechtasining HAMMASI ko'riladi | **yurish** — faqat bajarilmaganlar aylanadi | `useTurnWalk(pending)` → `.turn-step` |
   | Bir nechtasidan BITTASI tanlanadi | **to'lqin** — hammasi TENG (bittasini yoritish = javobga undash) | `.turn-wave w1/w2/w3` |
   Yurish tartibi darsning o'z ketma-ketligiga (`ORDER`/`PAIRS`) ergashadi — alifbo/DOM emas.

### Sukut-holati tuzog'i (eng ko'p xato)
Sukut bo'yicha ochiq/tanlangan turgan element **YONMAYDI** — **KO'RILMAGANI** yonadi.
*(PmLesson2: «Tartibli» ochiq turadi → «Chalkash» yonadi.)* Navbat dars mantig'iga
ergashadi, ekran tartibiga emas.

### Puls QO'YILMAYDIGAN 6 joy
test-variantlari (javobgacha) · qulflangan/kutish tugmasi · ikkinchi-darajali boshqaruvlar
(«Orqaga», «Qaytadan», zoom, til) · teng bo'lmagan variantlardan bittasi (→ to'lqin
ishlatiladi) · navbat boshqa zonaga o'tgan joy *(juftlikda chap tanlangach o'ng ustun
YONMAYDI — javobni aytib qo'yardi)* · mentor-boshqaruvlari o'quvchi ko'rinishida.

### Majburiy 5 tekshiruv (har ekran, dasturiy)
puls ~2.6s dan OLDIN chiqmasin · bir lahzada MAKS 1 · harakatdan keyin DARHOL o'chsin ·
testda javobgacha yo'q · `prefers-reduced-motion`da butunlay o'chiq.
⚠️ O'lchov-tuzoq: `::after` yo'q elementda ham opacity 1 qaytadi — avval KLASS borligini
tekshiring; klass nomiga emas, HAQIQIY animatsiyaga (box-shadow'dagi aksent rang) qarang.

### Kod-shartnoma (ko'chiriladi, qayta ixtiro qilinmaydi)
`TURN_HINT_MS 2600 · TURN_STEP_MS 1300 · TURN_PAUSE_MS 3200` · `useTurnHint(active)` →
bool · `useTurnWalk(pending, enabled)` → yonayotgan kalit yoki null (pending bo'sh = o'chiq;
bitta qolsa = tinch yonadi) · halqa `::after`da — **o'lcham hech qachon o'zgarmaydi, layout
sakramaydi** · `NavNext`ga `turnBusy` propi: navbat hali ekran ichida bo'lsa tugma yonmaydi.
PmLesson2'da jami **11 puls-nuqta**.

---

## 3-D. 🧑‍🏫 MENTOR-YO'NALTIRISH LOGIKASI (puls bilan mehnat-taqsimoti)

> Bu 07-28 kunning bosh kashfiyoti: yo'naltirish ishi IKKIGA bo'lindi —
> **puls QAYERDA ekanini ko'rsatadi · mentor-gap NIMA QILISHNI va NEGA aytadi.**
> Ikkalasi BIR XIL harakatni ko'rsatishi shart — qarama-qarshi bo'lsa, bug.

1. **Mentor-gap qolipi = NEGA + aniq chorlov** (korpus 22): birinchi yarmi sababni ochadi
   («Bekorga turgan bo'lim foydalanuvchini charchatadi — shuning uchun har bo'limga aniq
   vazifa beriladi»), ikkinchi yarmi bitta aniq harakatni nomlaydi («Beshtasini birma-bir
   bosib chiqing»). Quruq ta'rif + umumiy «bosib ko'ring» EMAS.
2. **Mentor-gap harakat-zanjirining O'SHA halqasini nomlaydi** — puls qaysi halqada tursa,
   gap o'sha harakatni aytadi. Tarixiy saboq (07-28 takomil): 1-ekranda mentor «Ikkala
   tugmani bosib solishtiring, KEYIN sababini tanlang» derdi, puls esa 1-qadamni tashlab
   variantda turardi — bu XATO deb topildi, navbat solishtirishdan boshlanadigan qilindi.
3. **Puls tufayli mentor yo'riqnomadan OZOD:** «qaysi tugmani bosish»ni endi puls
   ko'rsatadi, mentor esa mexanika-yo'riqni emas, MA'NOni gapiradi. Interaktiv ekranda
   mentor ≤1 gap, oddiy ekranda ≤2 gap (matn-qonuni saqlanadi).
4. **Mexanika-yo'riq kerak bo'lsa** — «avval … tanlang, so'ng … bosing» qolipida (korpus
   16, 75-qonun), tugma/element O'Z NOMI bilan ataladi («Hikoyani qurish»ni bosing —
   «tugmani bosing» emas, qaysi tugma ekani noaniq qolmasin).
5. **Slot/bo'lak SANALMAYDI** (63-qonun): «5 bo'lakni joylang» emas — «bo'laklarni
   birma-bir joylang»; sonni ekran o'zi ko'rsatib turadi.
6. **MentorNote (real mentorga yo'riqnoma)** — faqat `isMentor` ostidagi «Eslatma — faqat
   sizga» chipi; o'quvchi matnida YO'Q. Og'zaki sinf-muhokama savollari ham MentorNote'ga
   ko'chadi (proyektor-sirlik: javob o'quvchi ekranida oldindan ochilmaydi).
7. **Tekshiruv-savollari:** har interaktiv ekranda (a) mentor-gap va puls bir halqani
   ko'rsatyaptimi? (b) mentor-gapda NEGA bormi? (c) chorlov element nomi bilanmi?
   (d) interaktivda ≤1 gapmi?

---

## 4. 🚫 SO'Z/ATAMA TAQIQ-LUG'ATI (shu darsda topilgan — 75 darsda UMUMAN ishlatilmaydi)

| ❌ TAQIQ | ✅ O'RNIGA | F-ID / qoida |
|---|---|---|
| «UX qaror» (markaziy atama sifatida) | «foydalanuvchi uchun qilingan qulaylik» | F-0728 + F-0729-04 · korpus 20: qisqartma markaziy bo'lsa UMUMAN olinadi |
| «qavat» (tepa/past qavat) | teg nomlari: `header` / `main` / `footer` | F-0728-06 · bir tushuncha — bir atama |
| «Bozor» (o'ylab topilgan sayt) | real tanish sayt (OLX) + fakt-tekshiruv | F-0728-04 |
| «savdo sayti» | «internet-magazin» | F-0730-02 · korpus 26 |
| «sizga tanish …» (ortiqcha kirish) | to'g'ridan-to'g'ri: «Mana internet-magazin — OLX sayti» | F-0730-03 |
| «sinov mijozi» / «mijoz» (foydalanuvchi ma'nosida) | «foydalanuvchi» (haqiqiy xaridor ma'nosidagina «mijoz») | F-0729-03 |
| «ishsiz bo'lim» | «ishlamaydigan bo'lim» | F-0729-01 |
| «yashil belgilanadi» | «yashil rangga o'zgaradi» | F-0729-02 |
| «tushunish oson» | «tushunarli» | F-0729-01 · korpus 23 |
| «ro'yxatga ko'z tashlang» | «ro'yxatga qarang» | F-0730-03 · korpus 27 |
| «ketib qoladi» (qayerdan?) | «saytga kirmay qo'yadi» / «saytdan chiqib ketadi» | F-0730-03 · korpus 27 |
| «pastga davom etadi» | «saytdan foydalanishda davom etadi» | F-0730-03 · korpus 27 |
| «tugma shoshilmaydi / keladi» (jonlantirish) | «tugma eng oxirida turibdi — … tushungandan keyin chiqadi» | F-0730-04 · korpus 28 |
| «darrov ishongingiz keladi» | aniq savol: «Nega ba'zi saytlar bir qarashda ishonch uyg'otadi?» | F-0729-16 |
| «Muddat: keyingi darsgacha» | (umuman yozilmaydi — muddat LMS'da) | F-0729-07 |
| «LMS'dagi topshiriq — … yuklanadi» | «Amaliy vazifa — … bajaring» | F-0729-17 |
| Belgi-formulalar matnda: `=` `→` («Struktura = mahsulot qarori») | to'liq ibora: «Struktura — mahsulot qarori» | 43a-qonun |
| Manbasiz raqam («bir necha soniya») | (olib tashlanadi yoki manbali fakt) | F-0728-07 |
| Absolyut da'vo («tugma FAQAT oxirida», «doim», «har doim») | yumshoq qoida: «tugma sababdan keyin turadi» | F-0728-04 |
| O'zini fosh qiladigan distraktor («Farqi yo'q, bari bir xil») | ishonarli-lekin-noto'g'ri variant | korpus 21 |
| «chalkash» (taqiq-oila) | «aralash» / kontekstga mos so'z | matn-sayqal 07-28 |
| «mavhum» | «aniq emas» | F-0729-08 oilasi |
| Atama-bo'tqa (3+ izohsiz inglizcha so'z yonma-yon) | o'zbekcha tavsif («kunlik foydalanuvchi, qaytish…») | katalog-tozalash 07-28 |

**Tekshiruv-darvozasi:** bularning grep-lanadigan qismi `til-lint-rules.json`da (55 qoida) —
har matn-tahrirdan keyin `npm run lint:til <fayl>` 0 error bo'lishi SHART.

---

## 4-B. ✅ ISHLATILADIGAN LUG'AT — matn hozirgi holiga QANDAY keldi va NIMA bilan yozamiz

**Matn-feedback statistikasi (5 kun):** ~15 alohida matn-to'lqin, 60+ so'z/ibora-almashuv:
F-0728-04/06/07 · pm-metodist katta sayqal (07-28: «UX qaror» 14 o'rin, 12 distraktor,
fakt-nuqsonlar, karta-matnlari) · katalog-tozalash (19 belgi-formula, 3 atama-bo'tqa) ·
F-0729-01/02/03/04/05/16/17/18 · F-0730-02/03/04. Har biri foydalanuvchi jonli ko'rigidan
chiqqan va korpus/lug'at/lintga muhrlangan.

### Atama-lug'at (dars HOZIR shu so'zlar bilan gaplashadi — yagona ta'riflar bilan)

| Atama | Yagona ta'rif (hamma ekranda AYNAN shu) |
|---|---|
| **birinchi blok** (`hero` qavsda) | «katta sarlavha va bir qatorlik izoh — bir jumlada sayt nima taklif qilishini aytadi» |
| **Muammo** bo'limi | «foydalanuvchi o'zi duch kelgan qiyinchilikni eslatadi — "ha, bu menga tanish"» |
| **Qanday ishlaydi** (yechim) | «sayt qiyinchilikni qanday yengib berishini qadamma-qadam ko'rsatadi» |
| **Isbot** | «boshqalar allaqachon foydalanayotganini ko'rsatadi — shundan ishonch tug'iladi» |
| **Harakat tugmasi** (`CTA` qavsda, «harakatga chaqiruv») | «aniq keyingi qadamni beradi: "E'lon berish"» |
| **footer** | «sahifaning eng pastki qismi: havolalar va aloqa» (tor «aloqa qismi» EMAS) |
| **foydalanuvchi** | darsning bosh shaxsi (36 marta); «mijoz» FAQAT haqiqiy xaridor ma'nosida |
| **qulaylik** | markaziy formula: «bo'limlarni joylash — foydalanuvchi uchun qilingan qulaylik; chiroylilik uchun emas — adashmasligi uchun» |
| **konversiya** | hodisadan KEYIN kiritiladi: «foydalanuvchi ishonib tugmani bosadi — bu konversiya (tashrifchi mijozga aylanadi)» |
| **internet-magazin** | sayt-turi nomi (o'smir tilida) |
| **sahifa = hikoya** | yagona metafora: nima → nega → qanday → ishonch → harakat |

### Gap-qoliplari (75 darsda ham shu ohang)

1. **Mentor = NEGA + aniq chorlov** (korpus 22): avval sabab, keyin bitta aniq harakat —
   «Bekorga turgan bo'lim foydalanuvchini charchatadi — shuning uchun har bo'limga aniq
   vazifa beriladi. Beshtasini birma-bir bosib chiqing.» Quruq ta'rif + «bosib ko'ring» EMAS.
2. **Harakat-fe'llar aniq** (korpus 27): qarang · bosing · tanlang · solishtiring · yig'asiz ·
   joylang. Kitobiy («ko'z tashlang») va mavhum («davom etadi» — nimani?) fe'l YO'Q.
3. **Foydalanuvchi harakati to'liq aytiladi:** «saytga kirmay qo'yadi» · «saytdan chiqib
   ketadi» · «saytdan foydalanishda davom etadi» — qayerga/nimadan doim aniq.
4. **Jonsiz narsaga odam-fe'l YO'Q** (korpus 28): tugma «shoshilmaydi/keladi» emas —
   «tugma eng oxirida turibdi … tushungandan keyin chiqadi».
5. **Sarlavha — buyruq yoki aniq savol** (korpus 3): «Nega ba'zi saytlar bir qarashda
   ishonch uyg'otadi?» · «Uchta mashhur saytni bosib, tuzilishini solishtiring».
6. **Izoh referentdan boshlanadi** (korpus 24): avval NIMA haqida gap — keyin xulosa;
   «Hammasini…», «Bu…» bilan gap BOSHLANMAYDI.
7. **Bir tushuncha — bir atama — bir ta'rif** (korpus 20): sinonim-almashinish yo'q
   («qavat» saboqlari); ta'rif SECDATA, flashcard, RECAP, testda so'zma-so'z bir xil.
8. **Flashcard — to'g'ridan-to'g'ri savol:** «Isbot bo'limi nima vazifani bajaradi?» →
   qisqa javob + bir qatorlik izoh. Topishmoq/ta'rif-old tomonda EMAS.
9. **Test-izoh NEGAni bo'lak nomi bilan ochadi** (korpus 5), distraktor ishonarli (korpus 21).
10. **Sifat sodda:** «tushunarli» («tushunish oson» emas) · «aniq emas» («mavhum» emas) ·
    «ishlamaydigan» («ishsiz» emas).
11. **Atama qavs-gloss bilan BIR marta** kiritiladi (CTA kabi), keyin o'zbekcha muqobili
    ishlaydi; markaziy tushunchada esa qisqartma UMUMAN olinadi (korpus 20).
12. **Raqam faqat manbali** («3 daqiqada e'lon» — saytning o'z va'dasi); «bir necha soniya»
    kabi havoyi raqam YO'Q. Absolyut «doim/faqat» o'rniga qoida-gap («sababdan keyin»).

> Yozishdan oldin: `MATN_KORPUS.md` 0-bo'lim (7 yozuv-tamoyil) + shu jadval.
> Yozilgandan keyin: `npm run lint:til` — 0 error. Shu ikkovi orasida chetga chiqish YO'Q.

---

## 5. TAKROR BUG-SINFLAR (shu darsda ochilgan — tekshiruvchi ov-ro'yxatida)

- **fade-up ↔ animation shorthand to'qnashuvi** — elementga `fade-up` bilan birga boshqa
  `animation:` berilsa element ABADIY `opacity:0`da qoladi (ko'rinmas-bug).
- **`<style>` shablon-satri ichida backtick** — CSS-izohdagi bitta backtick butun faylni sindiradi.
- **Ekran o'chirilganda indeks-siljish** — RECAPS/Q_LABELS/scored ekran RAQAMIGA bog'liq;
  o'chirishdan keyin dasturiy mos-tekshiruv majburiy.
- **Umumiy komponentga `{uz,ru}` prop** — Stage/NavNext kabi komponentlar har matn-propni
  `tr()` bilan o'rashi shart, aks holda React #31 oq-ekran (F-0730-05).
- **`::after` opacity o'lchov-tuzog'i** — mavjud bo'lmagan psevdo-elementda ham opacity 1
  qaytadi; klass borligini tekshirmasdan o'lchash yolg'on-signal beradi (1-C.7).
- **KODING_KEY ko'chirish-xatosi** — boshqa darsdan ko'chirilgan kalit o'z darsi ID'siga
  moslanishi shart (`pm-m1d6-koding`).

---

## 6. 75 DARSGA TATBIQ-TARTIBI (chetga chiqmaslik qoidasi)

1. **Tur aniqlanadi** (PM_DARS_ETALON 1-B): texnikaga yaqin → PmLesson2 etaloni; sof PM →
   PmUserStory etaloni. Klon-taqiq: etalon vizuallari ko'chirilmaydi, tizim (rang/rels/qonun) ko'chiriladi.
2. **Matn yozishdan OLDIN** `MATN_KORPUS.md` (ayniqsa 20–28) o'qiladi; yozilgach `lint:til` 0 error.
3. **Majburiy fyuchalar:** navbat-pulsi (1-C tartibida) · mentor-ekran 1-D jadvali ·
   takrorlash-yo'li (agar praktika bo'lsa) · ccProgress saqlov · yakun neon-kapsula ·
   flashcard savol-shaklda · arena qo'shni-takrorsiz naqsh.
4. **Har tahrirdan keyin esbuild**; ekran o'chirilsa indeks-mos dasturiy tekshiruv;
   yakunda pm-tekshiruvchi 15 ov-bandi (shu hujjatning 5-bo'limi ham kiradi).
5. **Real nom ishlatilsa** — fakt-tekshiruv majburiy (OLX-saboq: real mahsulot darsdagi
   da'voni sindirishi mumkin).

---

*Yig'ildi: 2026-07-30. Manbalar: PIPELINE_STATE.md (07-26…30 yozuvlari) ·
PM_PIPELINE_STATE.md (P83 + F-0728/0729/0730 yozuvlari) · MATN_KORPUS 20–28 ·
PM_DARS_ETALON 1-B/1-C/1-D · git log f4f765b…73493ed.*
