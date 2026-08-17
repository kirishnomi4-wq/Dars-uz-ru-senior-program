# M4a-D2 — Hamma birdan kirsa, sayt chidaydimi? (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/4a-Modull/PmLesson15.jsx` (kelajakda quriladi; yangi `lessonId: pm-m4a2-v1`).
> Registr-pasporti: `PM_KEYS_MEXANIKA_REGISTRI.md` R2 Batch 2 — o'zgartirilmagan.

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 4a — «NestJS + Arxitektura» (oy 6–7.5) |
| **Dars** | M4a-D2 (modulning 2-darsi, birinchi PM darsi) · `key: m4a-02` |
| **Mavzu** | Bugungi qurilish — 6 oydan keyingi tezlik: qachon «katta»ga qurish kerak, qachon shart emas |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z qarorlarini **yozadi**; artefakt = matn (`PM_DARS_ETALON` 1-B). Bittalab-yozish ekrani (48/80-qonun) **majburiy** |
| **Bosh keys** | **K1 · UZUM** ♻️ (M4a da birinchi marta) — **infra-imkoniyat burchagi**: saytdan emas, yetkazish yo'lidan boshlashdi — o'sishga OLDINDAN qurilgan poydevor. ⚠️ M2-D2 (`PmLesson4`) K1 ni «muammo→yechim» burchagida ishlatgan — slayd-matnlari TAKRORLANMAYDI (2-bo'lim va 6-bo'limda farq-dalili) |
| **ISHLATILGAN_KEYS** | K1 · 🔴 modul-ichi qoidasi (registr 4-bo'lim): M4a da birinchi keys — modul ichida takror YO'Q ✓ |
| **Oldingi PM darslarning TEKSHIRUV mexanikasi** | **M4-D12** → artefakt-checklist · **M4-D15** → qaror-juftlash (registr R2 Batch 2). M3-D10 Timeline ham band. **M4a-D2 = «yuk-tartiblash»** — uchalasidan farq qiladi (26/59-qonun; asos: 1-bo'lim va s9 izohi) |
| **Band mexanikalar (TAQIQ)** | registr 5-bo'lim to'liq ro'yxati: story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli doska · «ISHGA TUSHIRIB KO'RISH» formasi · «XOTIRA TUGMALARI» · «GAPSIZ KO'RSATUV» · «UCH KIRISH — BIR SAHIFA» · «SXEMA-TO'QISH» · «ARXITEKTURA-QAVATLARI» · Hotspot · Timeline · MatchPairs · kartani ko'chirish · klinika · tekshiruvchi stoli · bo'laklash-doska · hafta-chizig'i · rang-juftlash darvozasi · PairTimer · jadval-qatorini belgilash (M4-D2) · pitch-oilasi ro'yxati |
| **Misol-ip (91/108 + 95 + 96c)** | 🎟️ **Konsert-chipta sayti** — hamma bir vaqtda kirganda nima bo'ladi. 95-qonun: o'smir konsertga O'ZI boradi, chipta ochilishini o'zi poylaydi ✓ · 96c(e) to'qnashuv: lavash · OLX · kinoteatr · Uzum · YouTube · o'yin-klub · Airbnb · Starbucks · Duolingo · Instagram · maktab bufeti · maydoncha · musiqa ilovasi · maktab jurnali · maktab kutubxonasi · AvtoStoyanka — **konsert-chipta sayti band emas** ✓. Grep-dalili: `konsert` src/ da faqat 2 yon-misolda (m2-09 «maktab konsertiga promo sahifa» — bitta mashq-varianti; AuthEnv «konsert kirishida hujjat» — login-analogiyasi) — ikkalasi ham bosh-misol emas, to'qnashuv darajasiga yetmaydi |
| **Kirish-artefakt** | 🔴 **YO'Q.** Modul-chegara qoidasi (registr 6-bo'lim): o'quvchi 2–3 oy tanaffusdan keyin keladi. Oldingi artefaktga bog'lanmaydi, «topilmadi/saqlanmagan» tarmog'i ham YOZILMAYDI (korpus §69) |
| **Chiqish-artefakt** | 🔴 `pm-m4a2-yuk` = `{ qarorlar: [ {qism, qaror, sabab} × 3 ], savedAt }` — `qaror` qiymati `'kuchaytiramiz'` yoki `'oddiy'`. Keyingi PM dars (M4b-D2) **o'qishi shart emas** (modul-chegara), lekin shakl shu yerda muhrlanadi |
| **Yordamchi kalitlar** | `pm-m4a2-hook-choice` (faqat YOZILADI — 100c) · `pm-m4a2-sinov` (s4 holati: slayder pog'onasi + kuchaytirilgan qism) · `pm-m4a2-code` · `pm-m4a2-reflection` · `pm-m4a2-hw-target` · `ccProgress` |
| **Koding** | 🖥 **KOMPILYATOR** — R1 navbati (registr: m4-15 VS Code → **m4a-02 kompilyator**). Senariy buni o'zgartirmaydi |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 bufer = 90 |
| **Ekranlar** | **16 ta** (s0…s15) — M3-D10/M4-D2 da tasdiqlangan yakun-tuzilmasi bilan bir xil |

**Atama-glosslar (62/39-qonun + korpus §20 — avval hodisa, keyin nom):**

- 🔴 **«Masshtablanuvchanlik» / «scalability» / «masshtab» ekranga CHIQMAYDI** (korpus §20: markaziy atama bo'lsa qavs-gloss yetmaydi — o'zbekcha ibora atamaning O'RNINI oladi; «masshtab» — kalka). Dars bo'ylab markaziy so'z — **«yuk»**. Inglizcha juftlik faqat flashcard-10 javobida: «Yukka chidash (inglizchasi — scalability)»;
- 🔴 **«yuk» — darsning yagona nomi** (korpus §80/§85). Kanonik ta'rif dars bo'ylab AYNAN bir xil: **«Hamma birdan kirganda saytga tushadigan og'irlik — yuk»** (§109: zamon-iborasi, yasama ot emas). Shu ta'rif s2 · flashcard-1 · RECAPS · s15 da so'zma-so'z takrorlanadi. «Yuk» o'smirga jismoniy tanish so'z — sumka og'ir yuk, gap o'z-o'zidan ochiladi;
- 🔴 **Fe'l-intizomi (korpus §80 — bir mashq, bir fe'l):** odamlar **kiradi/bosadi** · qism yukni **ko'taradi** (sig'im) · og'ir kelsa **sinadi** · bardosh bersa **chidaydi** · hamma bitta narsani **talashadi**. ❌ «yiqiladi», «quladi», «yotib qoladi», «ishdan chiqadi» — ishlatilmaydi: sinish uchun BITTA fe'l;
- 🔴 **Saytning bo'lagi — «qism», zaldagi o'rindiq — «joy»** (korpus §80 + §105: dars kalit so'zi ikki ma'noda turmasin). s4 fakt-qatorida «hamma eng yaxshi **joylarni** talashyapti» — bu zal o'rindig'i; shuning uchun sayt bo'lagi hamma yuzada faqat **«qism»**: «Qaysi qism birinchi sinadi?» · «birinchi sinadigan qism» · «talashadigan qism». ❌ «qaysi joy sinadi» — ikki ma'no bitta ekranda to'qnashadi;
- 🔴 **«sin-» oilasi ajratildi (korpus §105):** **«sinadi/sindi»** — faqat qismning og'ir yukka bardosh bermagani. O'quvchi harakati esa **«ko'ring», «tekshiring», «oshiring»** bilan aytiladi. ❌ «saytni **sinab ko'ring**», «bilimingizni **sinaymiz**», «to'rt **sinov** to'g'ri chiqdi» — bir ekranda «sinab ko'rish» (harakat) va «sinadi» (nosozlik) yonma-yon tursa, 13 yoshli bola ikkalasini bitta so'z deb o'qiydi. «YUK-SINOVI» — senariy-ichi imzo-nomi, ekranga chiqmaydi;
- 🔴 **«sig'im»** — s4 da hodisa ko'rinadi («100 kishigacha ko'tarardi»), NOM esa s10 da ochiladi: «qism bir vaqtda ko'tara oladigan odam soni — sig'im» (idish sig'imidan tanish so'z);
- 🔴 **Qaror-yorliqlari hamma yuzada bir xil** (korpus §80): **«Birinchi kundan kuchaytiramiz»** / **«Hozircha oddiy qoladi»** — s1 demo · s4 ikkinchi bosqich · s8 tugmalari · flashcard · testlar bitta juftlikda gapiradi;
- 🔴 **«unicorn»** — M2-D2 dagi gloss bilan AYNAN: «1 milliard dollardan yuqori baholangan kompaniya» (bir tushuncha — bir nom, kurs bo'ylab; «yagona shoxli» kabi yangi tarjima kiritilmaydi);
- ❌ **«arxitektura» o'quvchi matnida ISHLATILMAYDI** — u m4a-01 (texnik dars) niki; bu dars QAROR haqida. `App.jsx` sub'ida hozir turibdi — 14-bo'lim 1-bandiga qarang;
- ❌ **«server», «baza», «kesh», «CDN», «trafik» ISHLATILMAYDI** — pasport taqig'i: NestJS/texnik atamalar o'rgatilmaydi. Sinish sabablari faqat odam-tilida aytiladi (talashish, alohida javob, bir xil sahifa). «Entity», «DTO», «Repository» — m4a-03 niki (29-qonun: kelajak-dars atamasi oqmaydi);
- ❌ **«infratuzilma»** — kalka, ishlatilmaydi: keysda «yetkazish yo'li», «poydevor» (poydevor — uy qurilishidan tanish, 4.1 sinovidan o'tadi);
- ❌ «load», «stress-test», «lag» — kalka/jargon: **«yuk», «tekshiruv», «sekinlashdi»**.

🔴 **§40 darvozasi (o'quvchida hali YO'Q narsa uniki qilib aytilmaydi):** o'quvchida chipta sayti YO'Q — dars bo'ylab **«chipta sayti» / «sayt»**, hech qachon «saytingiz». O'quvchiniki — u YOZGAN uch qaror («qarorlaringiz»).

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «YUK-SINOVI»** (23-qonun: har darsda YANGI — registr 5-bo'limdagi birorta band vizual klonlanmaydi).

Ekran ikkiga bo'linadi. **Chapda** — «👥 Odam soni» boshqaruvi: to'rt pog'onali surma chiziq (50 → 300 → 800 → 3000) va ustida katta jonli son. **O'ngda** — chipta saytining uch qismi, uch karta ko'rinishida:

| Qism | Nima ish qiladi |
|---|---|
| 📄 E'lon sahifasi | Konsert haqidagi ma'lumot — hammaga bir xil sahifa |
| 💺 O'rindiq tanlash | Zaldagi bo'sh joylar — hamma eng yaxshisini xohlaydi |
| 💳 To'lov | Har kim o'z pulini o'tkazadi |

**1-bosqich — sinov.** O'quvchi odam sonini pog'onama-pog'ona oshiradi. Har pog'onada kartalar holati o'zgaradi va singan qism yonida **bitta fakt-qator** chiqadi:

| Odam soni | Ekranda nima bo'ladi | Fakt-qator |
|---|---|---|
| 50 | Uchchala karta yashil | ✅ 50 kishi birdan — hammasi chidayapti |
| 300 | O'rindiq kartasi qizarib to'xtaydi | 🔴 O'rindiq tanlash sindi — hamma birdan eng yaxshi joylarni talashyapti; u faqat 100 kishini ko'tara oladi |
| 800 | To'lov ham to'xtaydi | 🔴 To'lov ham sindi — har kimga alohida javob kerak; u 500 kishini ko'tara oladi |
| 3000 | Uchchalasi to'xtaydi | 🔴 E'lon sahifasi ham sindi — u hammaga bir xil, eng yengil ish; 2000 kishini ko'tara oladi |

**2-bosqich — qaror** (birinchi sinish ko'rilgach ochiladi — 94-qonun progressiv ochilish): ekranga bitta savol-karta chiqadi: *«Ochilish kuni 300 kishi birdan kiradi. Bitta qismni oldindan kuchaytira olasiz — qaysi birini?»* Uch qism tugmasidan bittasi tanlanadi, son avtomatik 300 ga yuradi:

- **O'rindiq tanlansa:** hammasi yashil — «✅ Sayt 300 kishiga chidadi. Kuchaytirilgan o'rindiq endi 1000 kishini ko'taradi.»
- **Boshqasi tanlansa:** «O'rindiq baribir sindi — kuch boshqa qismga ketdi. Birinchi sinadigani o'rindiq tanlash edi.» (56-qonun: ball yo'q, qizil baho yo'q, asl javob DOIM ochiladi; qayta tanlash ochiq.)

Yakun-qatori (bitta gap): **«✅ Buni o'zingiz topdingiz: birinchi sinadigan qismni oldindan kuchaytirgan sayt chidaydi.»**

🔴 **Rang-qonuni (palitra-pasporti):** singan qism qizilligi — **haqiqiy nosozlik holati** (M3-D10 «🔴 shart bajarilmagan» pretsedenti), o'quvchining xatosi EMAS — shuning uchun 2-bosqichdagi noto'g'ri tanlov javobiga qizil baho berilmaydi (neytral indigo). Chidayotgan qism — `success`.

🔴 **Nima uchun aynan shu:** yukni **o'qib** tushunib bo'lmaydi — sinishni **ko'rganda** ma'noga kiradi. Bola son haqida gapirmaydi: sonni o'zi oshiradi va qaysi qism birinchi sinishini **o'z qo'li bilan** topadi; keyin bitta qismni tanlab, to'g'ri qismga qo'yilgan kuch butun saytni qutqarishini ko'radi. Bu — darsning butun qarori («qachon kattaga quramiz, qachon shart emas») qo'lda o'ynaladigan shakli, va K1 keysining darsdagi kichik ko'rinishi.

🔴 **Mexanika-farqi (26/59-qonun):** M4-D2 da o'quvchi **tugmani yoqib-o'chirib oqibatni ko'rardi** (nimani saqlaymiz?), M3-D10 da **soxta formani bosib sinardi** (ish tayyormi?). Bu yerda **miqdorni oshirib sinish nuqtasini topadi va bitta kuchaytirish-qarorini qiladi** — boshqa obyekt (miqdor), boshqa harakat (oshirish), boshqa maqsad (qaror).

🔴 **Kashfiyot-himoyasi (M3-D10 GATE S saboqi):** 40–45 soniya harakatsizlikdan keyin bitta qoida-ipuchasi: «Odam sonini yana bir pog'ona oshirib ko'ring» — javobni AYTMAYDIGAN shaklda (korpus §77).

---

## 2. EKRAN-RO'YXATI (16 ekran)

> Yakun-tuzilmasi M3-D10/M4-D2 dagidek — etalon:
> koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa bir sahifada).

| # | Ekran | Blok | Scored | Mexanika |
|---|---|---|---|---|
| s0 | HOOK — «Chipta 10:00 da chiqadi. Sayt chidaydimi?» | 1 | — | 2 ta tanlov · ovoz berish · payoff shu ekranda |
| s1 | MAQSAD — uch qaror-qatori o'z-o'zidan yozilib chiqadi | 2 | — | jonli natija-preview (18-qonun) |
| s2 | TEORIYA-1 — yuk nima: oddiy kun ↔ ochilish daqiqasi | 3 | — | ikki karta solishtiruvi (tap-ochilma) |
| s3 | **TEST-1** | 3 | ✅ | TestQ |
| s4 | YADRO — **YUK-SINOVI** (surma + kuchaytirish-qarori) | 3 | — | 🔴 markaziy mexanika |
| s5 | **TEST-2** | 3 | ✅ | TestQ |
| s6 | KEYS — K1 Uzum (4 slayd + 2 bashorat + hisoblagich) | 3 | — | keys-slayd (33/56-qonun) |
| s7 | **TEST-3** | 3 | ✅ | TestQ |
| s8 | YOZISH-EKRANI — **3 qaror** (bittalab) | 4 | — | 48/80-qonun qolipi |
| s9 | TEKSHIRUV — **YUK-TARTIBLASH** | 5 | — | 🔴 raund-saralash (yangi mexanika) |
| s10 | KODING — sinadigan qismlarni topadigan kod | 6 | — | 26/82/87-qonun · kompilyator |
| s11 | **TEST-4** (yakuniy · `scope: final`) | 7 | ✅ | TestQ |
| s12 | REFLEKSIYA — juftlikda ayting + Reflection | 7 | — | 2 qadam (54e) |
| s13 | PODIUM | 9 | — | — |
| s14 | FLASHCARD — 10 karta | 7 | — | mentorsiz (99-qonun) |
| s15 | **YAKUN** — CodeStrike **+** uy-vazifa bir sahifada | 8+9 | ✅ | etalon yakun-tuzilmasi |

🔴 **Test-taqsimot:** s3 · s5 · s7 · s11 — ketma-ket emas, har biri o'z teoriyasidan keyin.

🔴 **«Ustaxona» va «slayder» so'zlari o'quvchi ekranida YO'Q** (korpus §84 + kalka) — bular senariy-ichi nomlar; ekranda boshqaruv «👥 Odam soni» deb yorliqlanadi, sarlavha aniq harakatni aytadi.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 4a — NestJS + Arxitektura
DARS: M4a-D2 (2-dars)
DARS_MAVZUSI: Bugungi qurilish — 6 oydan keyingi tezlik: qachon kattaga qurish kerak
ISHLATILGAN_KEYS: K1
```

### === BLOK 1: HOOK ===
```
VAQT: 5
KOMPONENT: Simulation (ovoz-berish)
EKRAN: Sevimli xonandangiz konserti uchun chiptalar ertaga 10:00 da sotuvga chiqadi.
Siz bilan birga yana ming kishi xuddi o'sha daqiqada «Sotib olish»ni bosadi —
sayt chidaydimi?
HARAKAT: O'quvchi ikkitadan bittasini tanlaydi. Tanlagach ikkala tanlov ostida ham
BIR XIL payoff ochiladi.
JAVOB: To'g'ri javob YO'Q — fikr-so'rovi. Payoff: farq omadda emas — chidagan sayt
shu daqiqaga oldindan qurilgan.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ovozlar bo'linadi — ikkala tomonning ham hayotiy dalili bor (chidagan sayt
ham, singan sayt ham hamma ko'rgan narsa). Shu bo'linishning o'zi darsga eshik.
```

**Ikki tanlov (104-qonun: teng sonli, teng uzunlikda, teng og'irlikda):**

| Tanlov | Belgilar |
|---|---|
| 💪 Chidaydi — katta saytlar bunga tayyor | 37 |
| 😬 Sinadi — hamma bir vaqtda bosyapti | 34 |

**Payoff (ikkala tanlovda ham AYNAN bir xil, maqtovsiz):**
> Ikkalasi ham bo'ladi: ba'zi saytlar chidaydi, ba'zilari sinadi. Farq omadda emas — chidagan sayt shu daqiqaga **oldindan** qurilgan. Qanday qurilishini bugun o'zingiz ko'rasiz.

> 🔴 **97-qonun / korpus §57:** savolda aniq narsa (konsert chiptasi, 10:00) + harakat-fe'l («bosadi») + o'quvchining o'z holatidan o'sadi (chipta ochilishini poylash — o'smir buni o'zi qilgan).
> 🔴 **104-qonun:** to'g'ri javob YO'Q — payoff ikkala tanlovda bir xil; ❌ «To'g'ri o'yladingiz…» yozilmaydi.
> 🔴 **100-qonun:** tanlov `pm-m4a2-hook-choice` ga yoziladi, hech qayerda o'qilmaydi; hook-echo YO'Q.
> 🔴 **62-qonun:** «yuk» atamasi bu ekranda YO'Q — u s2 da ochiladi.
> 🔴 **Korpus §97 (yakka rejim darvozasi):** ovoz-diagrammasi FAQAT jonli darsda; «ko'pchilik», «sinf», «ovozlar» o'quvchi matnida **0** — payoff ikkala rejimda so'zma-so'z bir xil.
> 🔴 **Ekran-o'lchovi:** savol + payoff = **345 grapheme** proza (chegara 400) ✓.

### === BLOK 2: MAQSAD ===
```
VAQT: 2
KOMPONENT: —
EKRAN: Dars oxirida chipta sayti uchun uchta qarorni o'zingiz yozib olasiz: qaysi
qismni birinchi kundan kuchaytirish kerak — qaysi qism hozircha oddiy qolaveradi.
HARAKAT: O'quvchi kuzatadi: bo'sh ro'yxatga uchta qaror-qatori o'z-o'zidan yozilib
chiqadi, har birining yoniga ✅ qo'yiladi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.
```

**Demo-uch qator (o'z-o'zidan yozilib chiqadi) — strelkali juftlik, ustun-sarlavhasiz (korpus §67d):**

| Ekranda ko'rinadigan qator |
|---|
| Sharhlar bo'limi → Hozircha oddiy qoladi |
| Yordam chati → Hozircha oddiy qoladi |
| Savat → Birinchi kundan kuchaytiramiz |

> 🔴 **39/62-qonun:** s1 da «yuk» va «sig'im» so'zlari **0** — atamalar o'z ekranida ochiladi; demo faqat qaror-juftligini ko'rsatadi.
> 🔴 **Spoyler-taqiq (M3-D5 saboqi):** demo-uchlik s4 uchligiga ham (sahifa · o'rindiq · to'lov), s9 to'rtligiga ham KIRMAYDI — ular saytning boshqa qismlari.
> 🔴 **Metodist-tuzatmasi (34-qonun — demo darsning o'z qoidasiga zid bo'lmasin):** eski uchlik «Konsert e'lonini o'qish · Sharh yozish · **Chipta qaytarish → kuchaytiramiz**» edi. Chipta qaytarish odamlarga **bitta-bitta**, har xil vaqtda keladi — ya'ni dars qoidasi bo'yicha u aynan «oddiy qoladi» qismi; demo o'z qoidasini buzib turardi. Yangi uchlikda kuchaytiriladigan qism — **savat**: ochilish daqiqasida hamma birdan bosadigan joy. Chap ustun endi qism-nomi (s8 artefakti bilan bir shakl), harakat emas.
> 🔴 **40-qonun / korpus §40:** «yozib olasiz» (artefakt) · «saytingiz» YO'Q — o'quvchida sayt yo'q.
> 🔴 **42-qonun:** suyuqlik-fe'li yo'q — «o'z-o'zidan yozilib chiqadi»; **54(b/c):** `ta-sub` ikkinchi qator YO'Q, demo ostidagi caption YO'Q.
> 🔴 **Ekran-o'lchovi:** proza **156 grapheme** ✓.

### === BLOK 3: YADRO ===
```
VAQT: 26
KOMPONENT: Simulation (yuk-sinovi) + 3 × Quiz
EKRAN: Hamma birdan kirganda saytga tushadigan og'irlik — yuk deyiladi. Odam soni
bir xil bo'lsa ham: bitta-bitta kelsa — yengil ish, hammasi birdan kelsa — og'ir yuk.
(🔴 Bu blok-gapi s2 ning xulosa-kartasi bo'lib turadi — boshqa ekranda takrorlanmaydi.)
HARAKAT: (s2) ikki kartani bosib solishtiradi; (s4) odam sonini o'zi oshirib, qaysi
qism birinchi sinishini topadi va bitta qismni kuchaytirib qayta ko'radi; (s6)
keys-slaydlarini bashorat bilan ochadi.
JAVOB: s4 — birinchi sinadigan qism: o'rindiq tanlash; kuchaytirish-qarori: o'rindiq.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: s4 da bolalar odatda sonni oxirigacha oshirib to'xtaydi. 2-bosqich savoli
chiqqach «endi bitta qismni tanlang» deb turtki bering — qaror aynan shu lahzada.
```

**s2 — TEORIYA-1: oddiy kun ↔ ochilish daqiqasi** (korpus §73: ikki olamni yonma-yon qo'yish)

Sarlavha (savol-murojaat — teoriya ekranida ruxsat, 47-qonun istisnosi): **«Chipta ochilgan daqiqada saytga nima bo'ladi?»**

Mentor (≤2 gap, 32b):
> Konsert chiptalari bir necha daqiqada tugaydi — sayt eng og'ir ishini o'sha daqiqada qiladi. Ikki kartani bosib solishtiring.

Ikki karta, bosilganda ochiladi (46-qonun: toggle, qayta bosilsa yopiladi):

| Karta | Ochilganda |
|---|---|
| 🌤 **Oddiy kun** | Odamlar bitta-bitta kiradi — sayt har biriga bemalol javob beradi |
| ⚡ **Chipta ochilgan daqiqa** | Hamma bir vaqtda bosadi — sayt hammasiga birdan javob berishi kerak |

Xulosa-karta (69-qonun · blok-gapining O'ZI · kanonik ta'rif):
> **Hamma birdan kirganda saytga tushadigan og'irlik — yuk deyiladi.** Odam soni bir xil bo'lsa ham: bitta-bitta kelsa — yengil ish, hammasi birdan kelsa — og'ir yuk.

> 🔴 **39-qonun qolipi:** avval hodisa (ikki karta), keyin «… yuk deyiladi». Sarlavhada yangi atama YO'Q ✓.
> 🔴 **§109:** ta'rif zamon-iborasi bilan («hamma birdan kirganda»), yasama ot emas.
> 🔴 **Korpus §24:** xulosa ko'rsatkich-so'z bilan boshlanmaydi — predmet nomlangan.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + xulosa = **332 grapheme** proza (karta matnlari — mashq-materiali, sanalmaydi) ✓.

**s4 — YADRO: YUK-SINOVI** (markaziy mexanika — to'liq spetsifikatsiya 1-bo'limda)

Sarlavha (47-qonun — buyruq): **«Odam sonini oshirib, nima o'zgarishini toping.»**

Mentor (≤2 gap, 92a):
> Chapda odam soni, o'ngda chipta saytining uch qismi. Sonni pog'onama-pog'ona oshirib boring.

> 🔴 **Metodist-tuzatmasi (§105 «sin-» oilasi):** eski sarlavha «saytni **sinab ko'ring**» edi — pastda esa fakt-qatorlar «O'rindiq tanlash **sindi**» deb chiqadi. Bitta ekranda ikki ma'no: harakat ↔ nosozlik. Endi sarlavha harakatni «oshiring» fe'li bilan aytadi, «sinadi» esa faqat nosozlikni bildiradi.

> 🔴 **98b:** mentor qaysi qism sinishini AYTMAYDI — fakt-qatorlar harakatdan KEYIN chiqadi.
> 🔴 **106d/71:** har sinishda javob darhol: belgi (🔴) **va** bitta fakt-qator — o'quvchi nega sinishini o'qiydi, taxmin qilmaydi. Fakt-qator sig'imni ham aytadi («100 kishigacha ko'tarardi») — ekrandagi har raqamning manbasi ko'rinadi (korpus §95).
> 🔴 **72-qonun:** «👥 Odam soni» boshqaruvi yorliqli idishda, diqqat-signali bilan; birinchi surishdan keyin signal tinadi.
> 🔴 **§106 (test ko'chirma bo'lmasin):** fakt-qatorlar QISM-darajasida gapiradi («hamma birdan eng yaxshi joylarni talashyapti»); umumiy QOIDA («talashadigan qism birinchi sinadi») ekranda yozilmaydi — uni bola s5 testida o'zi chiqaradi, reveal muhrlaydi.
> 🔴 **Sig'im-qatori hozirgi zamonda:** «u faqat 100 kishini ko'tara oladi» — ❌ «ko'tarardi» (o'tgan zamon sig'im o'zgargandek eshitiladi; sig'im — qismning doimiy xossasi).
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor + yakun-qatori = **229 grapheme** ✓.

**s6 — KEYS:** 6-bo'limga qarang.

### === BLOK 4: MUSTAQIL ISH (bittalab-yozish ekrani) ===
```
VAQT: 16
KOMPONENT: Simulation (bittalab-yozish)
EKRAN: (sarlavha) Chipta saytiga uchta qaror yozing.
(mentor, 1 gap) Har qismga bitta savol bering: buni hamma birdan ishlatadimi — yoki
bitta-bitta?
HARAKAT: Uchta qarorni BITTALAB yozadi. Har kartada: qism nomini yozadi, ikki qaror
tugmasidan birini tanlaydi, sababini yozadi. Saqlaganda qator o'ngdagi ro'yxatga
ko'chadi.
JAVOB: Uchala qaror yozilgan · har birida sabab bor · sabab yuk haqida gapiradi
(birdan/talashadi yoki bitta-bitta/faqat o'qiydi) · kamida bittasi «Hozircha oddiy
qoladi» · «muhim», «kerak» kabi bo'sh so'zlar sabab emas.
RO'YXAT: Uchta qaror yozilgan · Har sababda «birdan» yoki «bitta-bitta» ·
Kamida bittasi oddiy qoladi
YULDUZCHA: To'rtinchi qaror yozing: kuchaytirish shart bo'lmagan qismni toping.
YORDAM: O'zingizga ikki savol bering: bu qismni hamma **birdan** ishlatadimi? Hamma
**bitta narsani** talashadimi? Javoblar sababingiz bo'ladi.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: «Hammasini kuchaytiramiz» degan qarorlar chiqadi — bu eng foydali xato.
Javob-qatori uni tutadi, siz muhokama qiling: kuch hammaga yetadimi?
```

🔴 **Kirish-artefakt YO'Q — zaxira-tarmoq ham YO'Q** (korpus §69, modul-chegara): ekran «oldingi darsdan kelgan ish» haqida umuman gapirmaydi. Boshlanish to'g'ridan-to'g'ri: «Chipta saytiga uchta qaror yozing.» — «topilmadi / saqlanmagan / bo'sh» so'zlari **0**.

🔴 **Yozish-kartasi (80b) — bitta karta, uch qadam ichida:**

| Qadam | Ipucha (placeholder — korpus §32: qisqa savol, tayyor javob YO'Q) |
|---|---|
| Qism nomi (matn) | `Saytning qaysi qismi?` |
| Qaror (2 tugma) | «Birinchi kundan kuchaytiramiz» / «Hozircha oddiy qoladi» |
| Sabab (matn) | `Nega shunday qaror?` |

🔴 **Saqlash-shartining javob-qatorlari (48-qonun — alohida checklist-panel YO'Q; korpus §12; 106d ikki tomonlama):**
- ✅ qaror + sabab mos → «✅ Sababingizda yuk ko'rinib turibdi — qaror asosli.»
- 🤔 sabab bo'sh sifat (*muhim · kerak · yaxshi · foydali · qulay*) → «Bu hali sabab emas. Bu qismni hamma birdan ishlatadimi? Talashadimi? Shuni yozing.»
- 🤔 qaror «kuchaytiramiz», sababda esa yengil-ish belgisi (bitta-bitta / faqat o'qiydi) → «Sababingiz yengil ishni aytyapti — unda nega kuchaytiramiz? Qarorni yoki sababni qayta ko'ring.»
- 🤔 uchalasi ham «kuchaytiramiz» → «Hammasini kuchaytirsak, kuch hech qayerga yetmaydi — bittasini "Hozircha oddiy qoladi"ga o'tkazing.»
- 🤔 oldingi karta bilan bir xil qism → «Bu qism yuqorida allaqachon yozilgan — boshqa qismni oling.»
- holat ko'rsatkichi (106c-b): «3 tadan 2 tasi yozildi»

🔴 **Sabab-belgilar lug'ati** (qoida-asosidagi tekshiruv — 106d(c), dars o'z so'zlaridan): og'ir-yuk belgilari: *birdan · hamma · talash · ochilish daqiqasi · bir vaqtda*; yengil-ish belgilari: *bitta-bitta · faqat o'qiydi · har kim o'ziniki · har xil vaqtda*. Bloklamaydi — yo'naltiradi. 🔴 «yuk-belgisi» — senariy-ichi nom: checklist yorlig'ida o'quvchi ko'radigan matn **«Har sababda "birdan" yoki "bitta-bitta"»** (§ichki-jargon: defisli sun'iy birikma ekranga chiqmaydi).

🔴 **Ekran-o'lchovi:** sarlavha + mentor = **115 grapheme** ✓ (javob-qatorlar harakatdan keyin, bittadan chiqadi).

### === BLOK 5: TEKSHIRUV ===
```
VAQT: 6
KOMPONENT: Simulation (yuk-tartiblash — raund-saralash)
EKRAN: (topshiriq) Qaysi qism birinchi sinishini toping.
(yo'riqnoma) Konsert kuni eshik ochildi — hamma birdan telefonini chiqardi. To'rt
qismdan birinchi sinadiganini bosing; javob ochilgach keyingisiga o'ting.
HARAKAT: Uch raund: har raundda qolgan qismlardan «keyingi sinadigani»ni tanlaydi
(to'rtinchisi o'zi qoladi). Har tanlovdan keyin javob va bir qatorlik sabab ochiladi.
JAVOB: 1) Sovg'a-kodni kiritish → 2) QR-chiptani ochish → 3) Konsert tartibini
ko'rish → 4) Xonanda sahifasini o'qish (sabablar quyida).
RO'YXAT: —
YULDUZCHA: —
YORDAM: (birinchi xatodan keyin) Ikki savol bering: hamma **birdan** keladimi? Har kimga
**alohida** javob kerakmi — yoki hammaga bitta sahifami?
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda ishlating: har o'quvchi sherigining uch qarorini o'qib, har biriga
«buni hamma birdan ishlatadimi?» deb so'raydi. Javob topilmasa — qaror qayta yoziladi.
MENTORGA: Eng ko'p adashiladigan joy — QR-chipta bilan konsert tartibi orasidagi
farq: har kimga alohida javob og'irroq, hammaga bitta sahifa yengilroq.
```

**To'rt qism (yangi sahna: konsert kuni, eshik oldida — s4 uchligidan BOSHQA to'plam):**

| Sinish tartibi | Qism | Javob ochilgandagi sabab-qatori |
|---|---|---|
| 1 | 🎁 Sovg'a-kodni kiritish (birinchi 20 kishiga) | Hamma birdan **bitta** narsani talashyapti — eng og'ir ish |
| 2 | 📱 QR-chiptani ochish | Hamma birdan, va har kimga **alohida** javob kerak |
| 3 | 🗓 Konsert tartibini ko'rish | Hamma birdan, lekin hammaga **bitta** sahifa yetadi |
| 4 | ⭐ Xonanda sahifasini o'qish | Uni har kim har xil vaqtda ochadi — yuk tarqoq |

O'tish-gap (22-qonun — yangi to'plam ochiq aytiladi, mentor 1 gap):
> Uch qaroringiz tayyor — endi shu qoidani konsert kunining to'rt qismida qo'llaymiz.

Yakun-qatori:
> ✅ **Eng og'ir — hamma bitta narsani talashgani; keyin har kimga alohida javob; eng yengil — hammaga bir xil sahifa.**

> 🔴 **26/59-qonun — Timeline'dan farqi (pasport talabi bo'yicha asoslanadi):** M3-D10 Timeline'ida o'quvchi **jarayon qadamlarini VAQT bo'yicha** chizib chiqardi («nima birinchi QILINADI» — tartibning o'zi to'g'ri javob). Yuk-tartiblashda esa **vaqt yo'q** — o'quvchi har qismga **ZAIFLIK hukmini** beradi («nima birinchi SINADI»): ikki belgini (birdanmi? alohida javobmi?) solishtirib xulosa chiqaradi. Mexanika ham boshqa: chiziqqa joylash emas, **raund-raund saralab chiqarish** (har raund mustaqil tanlov + javob). Boshqa o'lchov, boshqa harakat — takror emas. M4-D12 artefakt-checklist va M4-D15 qaror-juftlashdan ham farqi ochiq: bu yerda juftlanmaydi, belgilanmaydi — tartib quriladi.
> 🔴 **106d + korpus §77/§98:** noto'g'ri tanlovda javob DOIM ochiladi: «🤔 Bu qism hali chidab turadi — undan og'irroq ish bor.» — qoida beriladi, to'g'ri qism AYTILMAYDI; YORDAM faqat birinchi xatodan keyin.
> 🔴 **Sahna yangi, olam o'sha (91-qonun):** chipta ochilish daqiqasi (s4) → konsert kuni eshigi (s9) — bitta ip ichida ikki payt; to'rtlik s4 uchligini takrorlamaydi (§102: testda ekran-ko'chirma yo'q).
> 🔴 **Metodist-tuzatmasi (§95 raqam-to'qnashuvi):** sovg'a-kod «birinchi **100** kishiga» edi — 100 shu darsda o'rindiqning sig'imi (s4 fakt-qatori · s10 kodi). Bir son ikki narsani anglatmasin: endi «birinchi **20** kishiga». Bu — demo-olamning o'z tafsiloti, keys-fakti emas.
> 🔴 **«sinaymiz» olib tashlandi (§105):** o'tish-gapi «bilimingizni … sinaymiz» edi — «sinadi» darsda nosozlik fe'li. Yangi shakl: «shu qoidani … qo'llaymiz».
> 🔴 **SOFT aynan shu blokda** (PM_Prompt_v8: SOFT bitta blokda) · **106f(c):** SOFT — sinf ish-tartibi, `MentorNote` da yashaydi, o'quvchi ekranida YO'Q.
> 🔴 **Ekran-o'lchovi:** topshiriq + yo'riqnoma = **180 grapheme** ✓.

### === BLOK 6: KODING ===
```
VAQT: 10
KOMPONENT: Code Challenge (kompilyator — R1 navbati)
EKRAN: (sarlavha) Sinadigan qismlarni topadigan kod yozamiz.
(mentor, 2 gap) Hozirgina odam sonini o'zingiz oshirgan edingiz — endi o'sha ishni kod
bajaradi. Sig'imlar o'sha saytniki.
HARAKAT: singanlar(odamlar) funksiyasini to'ldiradi: sig'imidan oshgan qismlar
ro'yxatini qaytaradi. To'rt tekshiruv bilan ko'radi.
JAVOB: To'rt natija to'g'ri chiqadi: [] · ['orindiq'] · ['orindiq','tolov'] ·
['orindiq','tolov','sahifa'].
RO'YXAT: Funksiya ro'yxat (massiv) qaytaradi · Sig'imdan oshgan qism ro'yxatga tushadi ·
To'rt natija to'g'ri chiqdi
YULDUZCHA: orindiq sig'imini 10 barobar oshiring (1000) va 300 kishida endi nima
chiqishini ko'ring — s4 dagi kuchaytirish-qarori kodda.
YORDAM: Bitta qismdan boshlang: 300 kishi orindiq sig'imidan ko'pmi? Ishlagach qolgan
ikkitasiga o'ting.
KOD: (7-bo'limda to'liq)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Kod — s4 dagi ishning to'g'ridan-to'g'ri tarjimasi, shuni ochiq ayting:
o'quvchi qo'lda surgan son endi funksiya argumenti.
```

> 🔴 **87-qonun (o'tilgan texnik material):** obyekt, massiv, `if`, taqqoslash, `push`, funksiya, `console.log` — hammasi M2 da o'tilgan; M3/M4 dan hech narsa talab qilinmaydi. NestJS atamalari (m4a-01/03) topshiriqqa KIRMAYDI.
> 🔴 **26-qonun / R1:** m4-15 VS Code → **m4a-02 kompilyator** — registr navbati, senariy o'zgartirmaydi.
> 🔴 **Korpus §19/§48:** sarlavha «…digan **kod** yozamiz» oilasidan, natijani aytadi.
> 🔴 **82(d):** kod nusxalanmaydi, sababi ochiq aytiladi («qo'lda yozganda o'rganiladi»).
> 🔴 **Metodist-tuzatmasi (§105 + ichki-jargon):** sarlavha «**Yuk sinovini** qiladigan kod yozamiz» edi — «yuk-sinovi» senariy-ichi imzo-nomi, «sinov» esa nosozlik fe'liga yopishib qoladi. Yangi sarlavha ekrandagi ishni aytadi: «Sinadigan qismlarni topadigan kod yozamiz». `console.log` chiqishlari ham «sinov» emas, **«natija»** deb ataladi.
> 🔴 **Ekran-o'lchovi:** sarlavha + mentor = **149 grapheme** ✓.

### === BLOK 7: RECAP ===
```
VAQT: 5
KOMPONENT: Reflection + Flashcard + Quiz
EKRAN: (sarlavha) Uch qaroringizni yoddan ayta olasizmi?
(mentor) Ekranga qaramasdan javob bering: qaysi qismni birinchi kundan kuchaytirasiz
va nega? Avval sherigingizga ayting, so'ng shu javobni bir qatorda yozing.
HARAKAT: (s11) yakuniy testga javob beradi; (s12) juftlikda aytadi va bir qator
yozadi; (s14) 10 ta takrorlash kartasini o'zi tekshiradi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Uchdan biri «nega» savoliga javob berolmasa — s4 ekranini qayta
oching va 300-pog'onani birga ko'ring.
```

> 🔴 **54(e):** recap **2 qadam** · **99a:** flashcard ekranida mentor YO'Q, sarlavha — **«O'zingizni tekshirib ko'ring.»** (§105 istisnosi: platformadagi odatiy «O'zingizni **sinab** ko'ring» shu darsda ishlamaydi — o'sha ekranning kartalarida «Qaysi qism birinchi **sinadi**?» turadi, bitta ekranda «sin-» ikki ma'no beradi. Pretsedent: §105 da yakun-eyebrow'i «Tayyor» → «Dars yakuni»).
> 🔴 **Yakka rejim (korpus §97):** yolg'iz o'quvchiga «Avval **ovoz chiqarib o'zingizga** ayting, so'ng shu javobni bir qatorda yozing» ko'rinadi. Ikki tarmoq bir shakl, bir uzunlikda.

### === BLOK 8: UYGA VAZIFA ===
```
VAQT: 4
KOMPONENT: —
EKRAN: Uyda qarorlaringizni davom ettirasiz: chipta saytining yana bir qismini topib,
qarorini va sababini yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
HARAKAT: To'rtinchi qismga qaror yozadi; qarorlaridan birinchi sinadiganini belgilaydi
va sababini bir gap bilan yozadi.
JAVOB: —
RO'YXAT: To'rtinchi qaror yozilgan · Birinchi sinadigani belgilangan ·
Sababda «birdan» yoki «bitta-bitta»
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Uch qaroringizdan birinchi sinadiganini belgilang va sababini bir gap
bilan yozing.
SOFT: —
MENTORGA: Kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga
qisqa. Muddat — keyingi darsgacha.
```

> 🔴 **57-qonun:** yorliqlar hajm bilan («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»).
> 🔴 **Korpus §11:** topshiriq kartasi 3 raqamli qadam + muddat; yakun-ekranda AYNAN shu takrorlanadi.
> 🔴 **Korpus §96 (variantli vazifa):** tepadagi EKRAN matni SONNI aytmaydi — «to'rtinchi», «uch qaror» sanoqlari faqat To'liq-kartada.
> 🔴 **Namunasiz harakat taqiqi:** har ish darsda ko'rsatilgan — qaror+sabab yozish s8 da, «birinchi sinadigani»ni topish s4/s9 da bajarilgan.

### === BLOK 9: CODESTRIKE ===
```
VAQT: 8
KOMPONENT: Quiz (arena)
EKRAN: —
HARAKAT: 12 savol · har biri 15 soniya · sinf reytingi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: Yuk nima va qachon og'irlashadi; hamma birdan kirganda qaysi qism birinchi
sinadi (talashadigan qism); sig'im; bitta qismni kuchaytirish qarori; nega hammasini
kuchaytirmaymiz; Uzum yetkazish yo'lini qachon qurgani (birinchi kundan, 2022);
unicorn — 1 milliard dollardan yuqori baholangan kompaniya (2024); oyiga ~17 million
odam foydalanadi (2025); yukni oldindan o'ylash kimning qarori.
QISQA_VARIANT: —
SOFT: —
MENTORGA: Arena tugagach podium — g'oliblarni nomlab tabriklang.
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> 74-qonun (test-qolipi) · 17 (bitta himoyalanadigan javob) · 64 (tuzoq ma'nodosh emas) · 105b (≤12 so'z) · 21 (glossli) · 34 (darsning o'z ta'limiga zid emas) · §99 (variantlar savol shaklida) · §102 (distraktor ekranda rost emas) · §110 (mutlaq so'v/kulgili-bo'sh yo'q) · §118 (cheklov-so'zsiz). Variant uzunliklari teng (8.4).

### TEST-1 (s3 — s2 dan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** 🎟 Saytga ikkala kuni ham ming kishi kirdi. Qaysi kuni yuk og'ir bo'ldi?
- A. Kun bo'yi tarqalib kirgan kuni *(30)*
- **B.** Hammasi 10:00 da kirgan kuni ✅ *(28)*
- C. Ikkala kuni ham bir xil bo'lgan *(31)*

**Reveal:** To'g'ri — odam soni ikkalasida bir xil edi; yukni bir vaqtda kelgani og'irlashtirdi.

> 🔴 **Metodist-tuzatmasi (§106 — test slayddan ko'chirilmasin):** eski savol «Yuk qachon eng og'ir bo'ladi?» + to'g'ri javob «Bir daqiqada hammasi birdan kirsa» edi — bu s2 xulosa-kartasining **so'zma-so'z** yarmi, ya'ni bola ko'chirib olardi. Yangi savol o'sha qoidani **qo'llashga** majbur qiladi: ikki kunda odam soni teng, farq faqat tarqalishida. Eski C («Ro'yxatdan o'tib, hali kirishmasa») ham §110 bo'yicha bo'sh edi — darsni o'qimagan bola ham chiqarib tashlardi.
> 🔴 **§102:** C — «odam soni bir xil bo'lsa, yuk ham bir xil» degan kundalik tasavvur; s2 xulosasi uni ochiq rad etadi («odam soni bir xil bo'lsa ham…») — ya'ni variant darsni **o'qiganni mukofotlaydi**. Uzunlik: 30 · 28 · 31 (tell 1.11 ✓). Savol 12 so'z, predmeti nomlangan — «Saytga …» (105b ✓ · korpus §24).
> 🔴 Raqam ekrandagi surma pog'onalaridan olinmadi (50/300/800/3000) — hook'dagi «ming kishi» qaytadi (§95: raqamning manbasi o'quvchiga tanish).

### TEST-2 (s5 — s4 dan keyin) — to'g'ri: **A (indeks 0)**
**Savol:** ⚡ Hamma birdan kirdi. Qaysi qism birinchi sinadi?
- **A.** Hamma bitta narsani talashadigan qism ✅ *(37)*
- B. Hamma bir xil sahifani ko'radigan qism *(38)*
- C. Har kim har xil vaqtda ochadigan qism *(37)*

**Reveal:** To'g'ri — hamma bitta narsani talashgan qism eng og'ir ishni qiladi, shuning uchun birinchi sinadi.

> 🔴 **§106:** umumiy qoida s4 ekranida YOZILMAGAN (u yerda faqat qism-darajasidagi faktlar) — bola formulani shu yerda o'zi chiqaradi, reveal muhrlaydi.
> 🔴 **Metodist-tuzatmasi (§105 + §110):** eski B «Rasmlari eng ko'p **yuklangan** joy» edi — «yuk» darsning bosh atamasi, «yuklangan» esa fayl-yuklash ma'nosida; ballanadigan matnda bosh atama boshqa ma'noda turmaydi. Eski C («Kodi eng oxirida yozilgan joy») darsning olamidan tashqarida edi. Yangi B/C — s4 da ko'rilgan **yuk-turlari**: B «hammaga bir xil sahifa» (s4 da e'lon sahifasi eng **oxirida** sindi — ya'ni ochiq rad etilgan), C «har xil vaqtda» (tarqoq yuk). Endi uchala variant ham yuk-profili, tanlov faqat MA'NOda.
> 🔴 **§99:** uchalasi ham «… qism» bilan tugaydi. Uzunlik: 37 · 38 · 37 (tell 1.03 ✓).

### TEST-3 (s7 — s6 keysidan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** 🚚 Uzum ochilgan kuni nimasi tayyor edi?
- A. Chegirmalar va reklama roliklari *(32)*
- B. Boshqa kompaniyalarning kuryerlari *(34)*
- **C.** Mashinalari va topshirish punktlari ✅ *(35)*

**Reveal:** To'g'ri — sayt hali yosh edi, yetkazish yo'li esa birinchi kundan tayyor turgan. Poydevor sinishdan keyin emas, oldin quriladi.

> 🔴 **Metodist-tuzatmasi (3 nuqson birdan):** eski savol «**17 million odam kelganda** Uzum yo'li nega chidadi?» edi. **(a) Keys-sadoqati:** bankda 17 mln — bir **oydagi** foydalanuvchi soni, «birdan kelgan» olomon emas; savol raqamni boshqa ma'noga burardi. **(b) 34-qonun:** dars aynan «yuk odam sonidan emas, bir-vaqtdalikdan og'irlashadi» deb o'rgatadi — savol esa katta sonni yuk deb ko'rsatib, darsning o'z ta'limiga zid tushardi. **(c) §106:** to'g'ri javob «Yo'li o'sishga oldindan qurilgani uchun» 2-slayd va ko'prik-gapida so'zma-so'z turardi. Yangi savol — bankdagi **fakt**ni so'raydi, xulosa-formulani esa reveal aytadi (§106 ning o'z qolipi).
> 🔴 **§102:** eski A «Boshqa saytlar hali yo'q bo'lgani uchun» 1-slaydda (Telegram/Instagram guruhlari) ROST bo'lib o'qilardi — olib tashlandi. Yangi B bankka zid («o'z mashinalari») — ya'ni slaydni o'qigan bola uni ishonch bilan rad etadi; A esa hech qayerda aytilmagan, lekin ishonarli. Uzunlik: 32 · 34 · 35 (tell 1.09 ✓).
> 🔴 **§99:** uchala variant ham «nimasi tayyor edi?» savoliga narsa-ro'yxati bilan javob beradi.

### TEST-4 (s11 — yakuniy · `scope: final`) — to'g'ri: **B (indeks 1)**
**Savol:** 📋 Qaysi qismni birinchi kundan kuchaytirishga arziydi?
- A. Saytning hamma qismini birga *(28)*
- **B.** Hamma birdan talashadigan qismni ✅ *(32)*
- C. Odam birinchi ko'radigan qismni *(31)*

**Reveal:** To'g'ri — kuch birinchi sinadigan qismga boradi; hammaga yoyilsa, hech qayerga yetmaydi.

> 🔴 A — s8 javob-qatorida ataylab tutiladigan xato («hammasini kuchaytiramiz»), o'quvchi uni bir marta ko'rgan; C — «birinchi ko'ringan qism muhim» degan ishonarli, lekin darsda rad etilgan tasavvur (e'lon sahifasi eng oxirida sindi). Uzunlik: 28 · 32 · 31 (tell 1.14 ✓).
> 🔴 **Metodist-tuzatmasi:** A da «hamma qismini **birdan**» edi — «birdan» bu darsda «bir vaqtda kirish» ma'nosini oladi; endi «**birga**» (§105).

> 🔴 **55-qonun:** test savoli yalang'och — hoshiya/marker/lenta YO'Q · **105:** `title h-ask` · emoji «bajarildi» signalini bermaydigan turdan (✅ savol oldida turmaydi).

---

## 5. YOZISH-EKRANI SPETSIFIKATSIYASI (s8 — 48/80/85/92/106d-qonunlar)

**Qadam-indikator (80a):** havoda uch doira — yozilgani yashil ✓, joriysi indigo-pulsda, kelgusi kulrang-punktir.

**Muharrir-karta (80b):** ekranning yagona kartasi, aksent-halqa bilan. Ichida: qism-nomi maydoni → ikki qaror-tugmasi → sabab maydoni + jonli javob-qatori. Qaror-tugmalari teng vaznda (104-qonun ruhi): birortasi «to'g'ri variant»dek ajratilmaydi.

**Yozilganlar (80c):** yozish paytida KO'RINMAYDI — faqat indikator chirog'i yonadi; uchtasi ham yozilgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda). Saqlangan qator ko'rinishi: `💺 O'rindiq tanlash → Birinchi kundan kuchaytiramiz — hamma birdan talashadi` (strelkali juftlik + sabab, s1 demo bilan bir shaklda — korpus §67d).

**Ipuchalar (92c/85 · korpus §32):** `«Saytning qaysi qismi?»` · `«Nega shunday qaror?»` — qisqa savollar; tayyor javob maydonda TURMAYDI, namuna-tugma YO'Q.

**106d javob (ikki tomonlama):** ✅ «Sababingizda yuk ko'rinib turibdi — qaror asosli.» · 🤔 «Bu hali sabab emas. Bu qismni hamma birdan ishlatadimi? Talashadimi? Shuni yozing.»

**Bo'sh-so'zlar ro'yxati** (106d(c), dars o'z lug'atidan): *muhim · kerak · yaxshi · foydali · qulay*. O'quvchi sababga faqat shularni yozsa — savol qaytariladi (bloklamaydi, yo'naltiradi).

**Muvozanat-sharti:** uchinchi karta saqlanayotganda uchala qaror ham «kuchaytiramiz» bo'lsa — yumshoq hint (blok 4 dagi qator). Bu darsning ikkinchi yarmi: hamma qismga birdan qurish ham yechim emas.

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s6 — K1 · 91b/33/42/43/56 + keys-ekran qoidasi)

**Freym (91b):** eyebrow — **«🛒 Haqiqiy voqea»**, K-kodi ekranga chiqmaydi.

🔴 **M2-D2 dan farq-dalili (pasport talabi):** `PmLesson4` K1 ni «muammo→yechim» burchagida bergan — slaydlari «Uzumgacha xarid qanday bo'lgan» (odamlarning qiyinchiligi) va «eng og'ir qiyinchilikdan boshlagan» xulosasi atrofida; bashoratlari «birinchi navbatda nimani qurdi?» va «oyiga qancha odam foydalanadi?». Bu dars esa **infra-imkoniyat burchagi**: o'sha yetkazish yo'li **QACHON** qurilgani (o'sishdan OLDIN — poydevor) va shu poydevor bugun ham butun mamlakatga ishlab turgani. Slayd-matnlar yangi, bashoratlar boshqa o'lchovlarda; faktlar faqat bankdan.

**Uzluksiz hisoblagich (keys-ekran qoidasi):** slaydlar tepasida yil-yo'li `2022 ─── 2024 ─── 2025` va bitta jonli hisoblagich — **«Kompaniya bahosi»**. Yonida doim yil-yorlig'i turadi (raqam yilsiz ko'rinmaydi — 10-qonun). `prefers-reduced-motion` da hisoblagich statik yakuniy holatda.

🔴 **Hisoblagich-uzluksizligi va bashorat-spoyleri (aniq tartib — quruvchiga majburiy):**

| Qadam | Hisoblagich holati |
|---|---|
| 1-slayd (2022) va bashorat-1 | **«—»** (raqam hali yo'q; kompaniya bahosi bu paytda aytilmagan) |
| 2-slayd | «—» qoladi |
| 3-slayd (2024) | «—» dan **1,16 mlrd $ (2024)** gacha jonli o'sadi |
| **bashorat-2** | **1,16 mlrd $ (2024) da to'xtab turadi** — javob ekranda ko'rinmaydi (§102) |
| 4-slayd | bashorat javobidan keyin **1,5 mlrd $ (2025)** gacha davom etadi; ostiga ikkinchi qator qo'shiladi: «oyiga ~17 million odam foydalanadi (2025)» |

> 🔴 **Metodist-tuzatmasi:** eski matnda hisoblagich «0 dan boshlab to'xtamasdan» o'sardi — ikki nuqson: **(a)** kompaniya bahosi hech qachon 0 bo'lmagan (bankda yo'q raqam — §101), **(b)** bashorat-2 «bir yilda qancha bo'ldi?» deb so'raganda hisoblagich javobni ekranda ko'rsatib qo'yishi mumkin edi (§102). Endi hisoblagich bashorat javobigacha 1,16 da turadi.

**4 slayd (hikoya tilida — 42-qonun · korpus §42):**

1. **2022-yil oktabr.** O'zbekistonda Uzum ochildi. O'shanda internet-xarid Telegram va Instagram guruhlarida bo'lardi — yetkazib berishsiz.
2. *(bashorat-1 dan keyin)* **Birinchi kundanoq.** Ochilish kuniyoq Uzumning o'z mashinalari, topshirish punktlari va «ertaga yetkazamiz» yo'li tayyor edi. Sayt hali yosh edi — yetkazish yo'li esa allaqachon ishlab turardi.
3. **2024-yil mart.** Uzum mamlakatning birinchi **unicorn**i bo'ldi — 1 milliard dollardan yuqori baholangan kompaniya (2024-yilda 1,16 milliard dollar).
4. *(bashorat-2 dan keyin)* **1,5 milliard dollar (2025).** Va oyiga qariyb **17 million odam foydalanadi** (2025). O'sha birinchi kundan qurilgan yo'l bugun ham hammasini yetkazib turibdi.

**Bashorat-1 (2-slayddan oldin · 1-o'lchov: VAQT — qachon qurilgan):**
- «Odamlar ko'payib qiynalgandan keyin» *(35)*
- «Sayt mashhur bo'lganidan keyin» *(30)*
- «Hali ochilmasidan, birinchi kundanoq» ✅ *(36)*

**Bashorat-2 (4-slayddan oldin · 2-o'lchov: QIYMAT — bir yilda qancha o'sdi):**
- «1,2 milliard — deyarli joyida qoldi» *(35)*
- «1,5 milliard bo'ldi — yana o'sdi» ✅ *(30)*
- «3 milliard — ikki barobardan oshdi» *(33)*

**Natija-qatorlari (56/100-qonun):** topsa «🎯 Topdingiz! …» — quyruqsiz; adashsa «Adashdingiz — asl javob: …». «Ball emas» izohi YO'Q · hook-echo YO'Q. Tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring».

**Ko'prik-gap (91b · 44-qonun — to'liq nom bilan, darsga qaytadi):**
> Uzum poydevorni birinchi kundan qurdi. Chipta saytida ham xuddi shu qaror bor: qaysi qismni hamma talashadi — o'shani birinchi kundan kuchaytirasiz. Buni kod emas, mahsulotni o'ylaydigan odam hal qiladi — endi shu qaror sizniki.

> 🔴 **10-qonun (keys-sadoqati — tekshirildi):** bankda bor — 2022-yil oktabr ochilishi · saytdan emas, yetkazish yo'lidan boshlagani (o'z mashinalari, topshirish punktlari, ertasiga yetkazish) · Telegram/Instagram-guruh xaridlari · 2024-yil mart birinchi unicorn · 1,16 mlrd (2024) → 1,5 mlrd (2025) · oyiga ~17 mln foydalanuvchi (2025). Unicorn — pul-istisno (atamani sumsiz tushuntirib bo'lmaydi). Har raqam yili bilan ✓. Bankdan tashqari birorta raqam/fakt YO'Q.
> 🔴 **Metodist-tuzatmasi (§101 — bankda yo'q da'vo):** 2-slaydda «yetkazish yo'li **katta o'sishni ko'tarishga mo'ljallab qurilgan edi**» degan gap bor edi — bu niyat haqidagi da'vo, bankda yo'q; ustiga u TEST-3 ning to'g'ri javobini so'zma-so'z ekranga chiqarardi (§106). Endi slayd faqat faktni aytadi («allaqachon ishlab turardi»), xulosani esa reveal va ko'prik-gap chiqaradi.
> 🔴 **Metodist-tuzatmasi (§21/§117 — atama ballanadigan matnda tug'ilmaydi):** bashorat-1 ning eski varianti «Birinchi **unicorn** bo'lganidan keyin» edi — «unicorn» esa bir slayd KEYIN, 3-slaydda izohlanadi; izohsiz chet so'z bashorat-chipida turolmaydi. Yangi variant: «Sayt mashhur bo'lganidan keyin».
> 🔴 **Atama-izchilligi (kurs bo'ylab bir nom):** «olib ketish punktlari» → «**topshirish punktlari**» — M2-D2 (`PmLesson4`) shu keysni aynan shu nom bilan bergan; «~17 mln **kiruvchi**» → «oyiga ~17 million odam **foydalanadi**» (bankdagi «foydalanuvchi»ga aynan mos, M2-D2 bilan ham bir xil).
> 🔴 **Bashorat halolligi (17/43/64):** har bashorat bitta o'lchovning uch darajasi, zinapoya tartibida; hech biri boshqa slaydda rost bo'lib chiqmaydi; «≥2 bashorat ikki o'lchovda» sharti bajarildi (vaqt + qiymat). Hisoblagich bashorat-2 gacha 1,16 da to'xtab turadi (yuqoridagi jadval).
> 🔴 **Ko'prik:** slot-sanog'i yo'q (63) · «mahsulotni o'ylaydigan odam hal qiladi» — M4-D2 bilan bir xil ibora (kurs bo'ylab bir til).

---

## 7. KODING SPETSIFIKATSIYASI (s10 — 26/82/87-qonun · kompilyator)

**Darvoza-mashq (82e):** bitta savol-tanlov: «Sig'im nima?» → «Qism bir vaqtda ko'tara oladigan odam soni» ✅ *(42)* / «Saytdagi sahifalarning umumiy soni» *(34)* / «Bir kunda saytga kirgan odamlar soni» *(36)* — «sig'im» atamasi shu yerda nom oladi (s4 da hodisasi ko'ringan edi: «u faqat 100 kishini ko'tara oladi»).

> 🔴 **Metodist-tuzatmasi (8.4 uzunlik-tell):** eski variantlar 42 · 24 · 28 belgi edi — to'g'ri javob boshqalardan 1.8 barobar uzun, ya'ni bilmagan bola ham uzunligidan topardi. Ta'rifning O'ZI o'zgarmaydi (§20 kaskad: flashcard-5 · arena-6 bilan so'zma-so'z bir xil) — noto'g'ri variantlar tenglashtirildi: tell 42 ÷ 34 = 1.24 ✓.

**Boshlang'ich kod:**

```js
// Har qism bir vaqtda shuncha odamni ko'taradi (s4 dagi sayt)
const sigim = { orindiq: 100, tolov: 500, sahifa: 2000 };

function singanlar(odamlar) {
  // Sig'imidan oshgan qismlar ro'yxatini qaytaring
  return [];   // ← bu joyni siz to'ldirasiz
}

console.log(singanlar(50));     // []
console.log(singanlar(300));    // ['orindiq']
console.log(singanlar(800));    // ['orindiq', 'tolov']
console.log(singanlar(3000));   // ['orindiq', 'tolov', 'sahifa']
```

**Uch shart (RO'YXAT bilan bir xil so'zlarda):**
1. Funksiya ro'yxat (massiv) qaytaradi
2. Sig'imdan oshgan qism ro'yxatga tushadi
3. To'rt natija to'g'ri chiqdi (`[]` · 1 nom · 2 nom · 3 nom)

**YORDAM (yechimni aytmaydi — korpus §77):** Bitta qismdan boshlang: 300 kishi orindiq sig'imidan ko'pmi? Ishlagach qolgan ikkitasiga o'ting.

**YULDUZCHA:** orindiq sig'imini 10 barobar oshiring (1000) va `singanlar(300)` endi nima qaytarishini ko'ring — s4 dagi kuchaytirish-qarori kodda.

> 🔴 **Sanoq-mosligi (22-qonun):** sig'imlar (100/500/2000) va sinov-sonlari (50/300/800/3000) s4 pog'onalari bilan AYNAN bir xil — o'quvchi qo'lda ko'rgan raqamlarni kodda qayta uchratadi (korpus §95: raqamning manbasi ko'rinadi). 3 qism · 4 sinov — matndagi sonlar ekrandagiga teng.
> 🔴 **Kod-nomlari ASCII, apostrofsiz** (`orindiq` · `tolov` · `sigim` — lug'atning `tolov` qatori pretsedenti): kodda `orindiq`, prozada «o'rindiq». Bir tushuncha, ikki ko'rinish — kod va matn.
> 🔴 **87-qonun:** obyekt + `if` + massiv-`push` — M2 materiali; `filter` bilan yozgan o'quvchiga ham ruxsat (M3 da o'tilgan), ikkala yo'l JAVOB shartini bajaradi.
> 🔴 **Pedagogik ulanish (87c):** mentor ochiq aytadi — qo'lda surilgan son endi funksiya argumenti; YULDUZCHA s4 ning 2-bosqichini kodda takrorlaydi.

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

| Ekran | Muhim bandlar |
|---|---|
| **s1 MAQSAD** | Uch qaror-qatori CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi (18-qonun). 🔴 Demo-uchlik s4/s9 to'plamlariga KIRMAYDI |
| **s12 REFLEKSIYA** | Sarlavha: «Uch qaroringizni yoddan ayta olasizmi?» · juftlik + Reflection bitta qator. Mentor niyatni ochiq aytadi (76-qonun); yakka rejimda «sherigingizga» → «ovoz chiqarib o'zingizga» |
| **s14 FLASHCARD** | 🔴 Mentor YO'Q (99a). Qatlamlar: sarlavha → progress → karta. Sarlavha: «O'zingizni tekshirib ko'ring.» (§105 — yuqoridagi izoh) |
| **s13 PODIUM** | 🔴 93-qonun: matn etalondan grep bilan — «Bugungi g'oliblarimiz» / «Bugungi natijangiz». «📊 Savollar bo'yicha» YO'Q |
| **s15 YAKUN** | hero (`h-sub` YO'Q) → «Endi siz bilasiz» 4 qator → `CsWordmark` → uy-vazifa kartasi → nishonlar (mentorda YO'Q). 🔴 Qatorlar (korpus §52 — qisqa, tugal, mustaqil gap): «Hamma birdan kirganda saytga tushadigan og'irlik — yuk.» · «Hamma bitta narsani talashgan qism birinchi sinadi.» · «Birinchi sinadigan qism birinchi kundan kuchaytiriladi — hammasi emas.» · «Yukni oldindan o'ylash — kod emas, mahsulotni o'ylaydigan odamning qarori.» |
| **Barcha ekranlar** | 🔴 47-qonun: interaktiv ekranlarda (s4 · s8 · s9 · s10) sarlavha buyruq shaklida — `?</h2>` shu 4 ekranda **0**; teoriya/refleksiya ekranlarida (s0 · s2 · s12) sarlavha — savol-murojaat |

---

## 9. CODESTRIKE — 12 SAVOL (arena · 3/3/3/3 · 15s)

> 🔴 **65-qonun:** har savol darsda AYTILGAN ekranga bog'langan.

| # | Savol (qisqa) | Manba |
|---|---|---|
| 1 | Yuk nima? | s2 |
| 2 | Yuk qachon og'irlashadi? | s2 |
| 3 | Hamma birdan kirganda qaysi qism birinchi sinadi? | s4 + s5 |
| 4 | O'rindiq tanlash nega birinchi sindi? | s4 |
| 5 | E'lon sahifasi nega eng oxirida sindi? | s4 |
| 6 | Sig'im nima? | s10 |
| 7 | Bitta qismni kuchaytirsangiz — qaysi birini? | s4 + s11 |
| 8 | Nega hamma qismni birdan kuchaytirmaymiz? | s8 + s11 |
| 9 | Uzum yetkazish yo'lini qachon qurgan? | s6 |
| 10 | 2025-da Uzumdan oyiga nechta odam foydalanadi? | s6 |
| 11 | Chidagan sayt bilan singan saytning farqi nimada? | s0 + s6 |
| 12 | Yukni oldindan o'ylashni kim hal qiladi? | s6 + s15 |

> 🔴 **21-qonun (scored-matn glossi):** ballanadigan matnda izohsiz chet so'z YO'Q — «scalability», «load», «server», «trafik» arena savollariga ham, variantlariga ham KIRMAYDI; hammasi «yuk», «sig'im», «sinadi», «chidaydi» so'zlari bilan.
> 🔴 **«unicorn» arenada — faqat gloss bilan** (§21, KODDA tekshiriladi): agar savol yoki variantda shu so'z chiqsa, yonida darsdagi AYNAN izoh turadi — «1 milliard dollardan yuqori baholangan kompaniya». Izohsiz «unicorn» ballanadigan matnda TAQIQ; eng xavfsiz shakli — savolni izohdan boshlash: «1 milliard dollardan yuqori baholangan kompaniya qanday ataladi?».
> 🔴 10-savol raqamni so'raydi, yilni emas (M4-D2 saboqi: yod-sana bilim emas); yil savol matnining o'zida turadi.

---

## 10. NISHONLAR (4 ta — 6/101-qonun: inglizcha nom · tavsif ≤48 belgi · REAL trigger)

| Nom | Tavsif | Belgi | Trigger |
|---|---|---|---|
| **Load Tester!** | Birinchi sinadigan qismni o'zingiz topdingiz | 44 | s4: 2-bosqich to'g'ri yakunlandi |
| **Wise Builder!** | Uch qarorni sabab bilan yozdingiz | 32 | s8: 3/3 saqlandi |
| **Rank Master!** | Sinish tartibini to'g'ri topdingiz | 33 | s9: 3/3 raund to'g'ri |
| **Load Coder!** | Sinadigan qismlarni kod bilan topdingiz | 39 | s10: bajarildi |

> 🔴 4/4 nom inglizcha ✓, 4/4 tavsif o'zbekcha siz-formada, hammasi 32–44 belgi (§63 oralig'i) ✓.
> 🔴 **§100 (omonim-tekshiruvi):** «Load», «Rank», «Wise», «Coder» — kursning texnik lug'atida boshqa ma'no bermaydi ✓.
> 🔴 **§93 (tasdiq bajarilgan ishni aytadi):** har tavsif ekranda chindan bajarilgan harakatni aytadi — «topdingiz» (s4 da topdi), «yozdingiz» (s8 da yozdi), «kod bilan topdingiz» (s10 da funksiya singan qismlar ro'yxatini qaytaradi).
> 🔴 **Metodist-tuzatmasi:** «Yuk sinovini kodga aylantirdingiz» tavsifi ikki nuqsonli edi — «yuk-sinovi» senariy-ichi nomi (o'quvchi bunday nomni ekranda ko'rmagan) va «sinov» nosozlik fe'liga yopishardi (§105 + ichki-jargon).

---

## 11. FLASHCARD (10 ta — korpus §76: tarjimasiz chet so'z yo'q · §90e: darsdagi asosiy nom bilan)

| # | Savol | Javob |
|---|---|---|
| 1 | Yuk nima? | Hamma birdan kirganda saytga tushadigan og'irlik |
| 2 | Yuk qachon og'irlashadi? | Hammasi bir vaqtda kirganda |
| 3 | Qaysi qism birinchi sinadi? | Hamma bitta narsani talashadigan qism |
| 4 | Eng yengil ish qaysi? | Hammaga bir xil sahifani ko'rsatish |
| 5 | Sig'im nima? | Qism bir vaqtda ko'tara oladigan odam soni |
| 6 | Qaysi qism birinchi kundan kuchaytiriladi? | Hamma birdan talashadigani |
| 7 | Nega hamma qismni kuchaytirmaymiz? | Kuch hech qayerga yetmay qoladi |
| 8 | Uzum yetkazish yo'lini qachon qurgan? | Birinchi kundanoq — ochilishdayoq tayyor edi |
| 9 | 2025-da Uzumdan oyiga nechta odam foydalanadi? | Qariyb 17 million |
| 10 | Saytning katta yukka chidashi qanday ataladi? | Yukka chidash (inglizchasi — scalability) |

> 🔴 **Korpus §20/§52📌:** 1-karta javobi s2 xulosa-kartasi, RECAPS va yakun-ro'yxatidagi kanonik ta'rif bilan **so'zma-so'z** bir xil.
> 🔴 **Korpus §24:** hech bir savol referentsiz «bu» bilan boshlanmaydi — har kartada predmet nomlangan.
> 🔴 **Korpus §90(f) ikki tomonlama tekshiruv:** 10 kartaning har biri darsda o'rgatilgan ✓ · darsning har kalit qoidasi kartada bor ✓ (ta'rif · qachon og'irlashadi · birinchi sinish · yengil ish · sig'im · kuchaytirish-qarori · muvozanat · keys-vaqt · keys-raqam · inglizcha juftlik).
> 🔴 **Inglizcha atama faqat 10-kartada** — dars ichida «scalability» boshqa hech qayerda yo'q (korpus §20).

---

## 12. RECAP-KARTALARI (`RECAPS` — har scored ekranga 3 karta, oxirgisida `ask`)

**s3 · «Yuk — birdan kelgan og'irlik»** — (1) kanonik ta'rif · (2) odam soni emas, bir vaqtda kelgani og'irlashtiradi · (3) sinfga savol
**s5 · «Talashadigan qism birinchi sinadi»** — (1) eng og'ir — hamma bitta narsani talashgani · (2) eng yengil — hammaga bir xil sahifa · (3) savol
**s7 · «Poydevor oldindan quriladi»** — (1) Uzum yo'lni birinchi kundan qurgan (2022) · (2) o'sha yo'l bugun oyiga ~17 million odamga xizmat qilyapti (2025) · (3) savol
**s11 · «Kuch bitta qismga»** — (1) birinchi sinadigan qism kuchaytiriladi · (2) hammasiga yoyilgan kuch hech qayerga yetmaydi · (3) savol

> 🔴 **43-qonun:** karta sarlavhalarida belgi-formula YO'Q — to'liq sodda gap.
> 🔴 **K-kod ekranga oqmaydi:** ❌ «K1 xulosasi» → «Uzum misolida».

---

## 13. O'Z-TEKSHIRUV

**PM_Prompt_v8 (8 band):**
1. VAQT = 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, tegishli bo'lmagani «—» ✓
3. Blok 4 va 8 da RO'YXAT **aynan 3 band** ✓
4. Blok 8 da EKRAN va QISQA_VARIANT ikkalasi ham ✓
5. Bosh keys **K1** — M4a modulida ishlatilmagan (modul-ichi qoidasi, registr 4-bo'lim) ✓
6. TEKSHIRUV mexanikasi oldingi PM darslarni takrorlamaydi — M4-D12 artefakt-checklist · M4-D15 qaror-juftlash · **M4a-D2 yuk-tartiblash (raund-saralash)** ✓
7. «Sen» murojaati — **0** ✓
8. SOFT **aynan bitta blokda** (blok 5) ✓

**PM_DARS_ETALON darvozalari:**
- 91/108 (bitta ip): konsert-chipta sayti — s0 dan s15 gacha; keys 91b freymi bilan kiradi va ko'prik bilan qaytadi ✓
- 95 (Toshkent o'smiri): konsert chiptasi — o'smir ochilishni o'zi poylaydi ✓
- 96c(e) (demo to'qnashuvi): band olamlarning hech biri emas (grep bilan tasdiqlandi — shapka) ✓
- 26/59 (mexanika almashadi): imzo-vizual ham, TEKSHIRUV ham, koding-navbat (m4-15 VS Code → m4a-02 kompilyator) ham registrga mos ✓
- 87 (o'tilgan material): koding faqat M2 materiali (obyekt · massiv · `if` · `push`) ✓
- 29 (kelajak-atama oqmaydi): «Entity», «DTO», «Repository», «NestJS» o'quvchi matnida **0** ✓
- 47: `?</h2>` interaktiv ekranlarda (s4 · s8 · s9 · s10) 0 ✓
- 54 (P0 dan o'chirishlar merosi): oltalasi ham YO'Q ✓
- 100: «ball emas» izohi va hook-echo yo'q ✓
- 104: hook ikki tanlovi teng (37 ↔ 34 belgi) ✓
- 106: har mashq-ekranida ≤4 blok ✓
- 109 (TMI): mentor ≤2 gap (yozish-ekranda 1 gap) ✓
- 92d: majburiy maydonlar faqat o'quvchida ANIQ bor ma'lumot uchun (qism nomi/qaror/sabab — hammasi darsning o'zidan) ✓

**MATN_KORPUS darvozalari (yozishdan OLDIN o'qildi — §99–118 bilan birga):**
1. **§20/§80/§85:** «yuk» yagona nom, kanonik ta'rif 4 yuzada so'zma-so'z; «masshtab/scalability» o'quvchi ekranida 0 (flashcard-10 dan tashqari) ✓
2. **§99:** har testda variantlar savolning o'z shaklida (T1 «… kuni» · T2 «… qism» · T3 narsa-ro'yxati · T4 «… qismni») ✓
3. **§102:** distraktorlar ekranda rost bo'lib ko'rinmaydi (metodist raundi: T1-C, T2-B, T3-A qayta yozildi) ✓
3a. **§105 (kalit so'z bir ma'noda):** sayt bo'lagi — faqat «qism» (zaldagi o'rindiq — «joy») · «sinadi» — faqat nosozlik (o'quvchi harakati «ko'ring/tekshiring/oshiring») · «yuk» boshqa ma'noda 0 (❌ «rasm yuklangan») · «birdan» faqat bir-vaqtdalik (T4-A: «birga») ✓
3b. **§106 (test ko'chirma emas):** T1 s2 xulosasini qo'llashga majbur qiladi · T2 formulasi s4 da yozilmagan · T3 bankdagi faktni so'raydi, xulosa reveal'da ✓
4. **§107:** ha/yo'q-savol yo'q — sinf qo'llanmaydi ✓
5. **§108:** hech bir savol rostni rad ettirmaydi — hamma savol darsning o'z fe'li yo'nalishida ✓
6. **§109:** bosh ta'rif zamon-iborasi bilan ✓
7. **§110:** mutlaq so'z bir variantdan oshmaydi; kulgili-bo'sh variant yo'q; T4-A darsni o'qiganni mukofotlaydi ✓
8. **§111:** «degan javob» qurilmasi 0 ✓
9. **§113:** MENTORGA bandlari ekran-mexanikaga mos (s4 turtkisi 2-bosqich savoli chiqqandan keyin) ✓
10. **§114:** arena-fon/dekor so'zlari shu dars lug'atidan bo'lishi quruvchiga brifda (yuk · sig'im · chipta · qism) ✓
11. **§115:** ipuchalar bir gap-turida (ikkala placeholder savol-shaklda); uy-vazifa kartasi sarlavha-savol («📝 Uyda nima qilasiz?» — M3-D10/M3-D14 naqshi) ✓
12. **§116:** s9 YORDAM-savoli ikkala o'lchovni qamraydi (birdanlik + alohida-javob) — har to'g'ri javobga olib boradi ✓
13. **§117:** metafora-so'z ballanadigan matnda tug'ilmaydi («talashadi» s4 fakt-qatorida ochiladi, keyin T2 da) · yo'nalish-fe'llari real yo'nalishda · kesik omonim yo'q ✓
14. **§118:** distraktorlarda takror cheklov-so'zi yo'q («faqat», «hech qachon» — ballanadigan variantlarda 0); T1 savoli o'lchov-so'zli («og'ir bo'ldi» — ikki kunni solishtiradi) ✓
15. **§40:** «saytingiz» 0 — o'quvchida sayt yo'q; «-ingiz» faqat u yozgan qarorlarga ✓
16. **§97:** «ko'pchilik / sinf / ovozlar» o'quvchi matnida 0 ✓
17. **§69:** «topilmadi / saqlanmagan / bo'sh» 0 — modul-chegara, zaxira-tarmoq yo'q ✓
18. **Sanoq-mosligi (22):** 2 tanlov (s0) · 3 demo-qator (s1) · 3 qism + 4 pog'ona (s4) · 4 slayd + 2 bashorat (s6) · 3 qaror (s8/s12/uy-vazifa) · 4 qism, 3 raund (s9) · 3 qism + 4 natija (s10) · 12 arena · 10 flashcard · 4 nishon · «Endi siz bilasiz» 4 qator ✓
19. **Ekran-prozalari (metodist raundidan keyin qayta o'lchandi, Intl.Segmenter):** s0 345 · s1 156 · s2 332 · s4 229 · s8 115 · s9 180 · s10 149 grapheme (chegara 400) ✓

**Taqiq-grep ro'yxati (qurishdan keyin yuritiladi):**
**(a) Umumiy:** `npm run lint:til src/4a-Modull/PmLesson15.jsx` → **0 error** shart (74 qoida).

**(b) Shu darsning O'Z residue-greplari** (linter bilmaydigan, faqat M4a-D2 ga tegishli):
`masshtab` · `scalab` (flashcard-10 dan tashqari **0**) · `scale` ·
`arxitektura` (o'quvchi matnida **0** — m4a-01 niki) · `server` · `baza` · `kesh` · `CDN` · `trafik` ·
`infratuzilma` · `load` · `stress` (texnik kalka **0**) ·
`yiqil` · `qulad` · `yotib qol` · `ishdan chiq` (fe'l-intizomi: faqat «sinadi») ·
`saytingiz` (§40) · `slayder` (o'quvchi matnida **0** — «Odam soni» boshqaruvi) ·
`Entity` · `DTO` · `Repository` · `Nest` (29-qonun) ·
`ko'pchilik` · `ovozlar` (§97) · `ball emas` · `degandingiz` (100-qonun) ·
`topilmadi` · `saqlanmagan` (§69) · `afisha` (lug'at-taqiq: «e'lon») ·
`yuk-qaror` · `yuk-belgisi` (defisli sun'iy birikma — o'quvchi matnida «qaror», «"birdan" yoki "bitta-bitta"») ·
**metodist raundi qo'shgan greplar (2026-08-14, F-0814-03):**
`sinov` · `sinab ko'r` · `sinaymiz` (o'quvchi matnida **0** — «sin-» faqat nosozlik: «sinadi/sindi/sinadigan/sinishini») ·
`qaysi joy` · `sinadigan joy` · `talashadigan joy` · `birinchi ko'ringan joy` (sayt bo'lagi — faqat «qism»; «joy» faqat zaldagi o'rindiq) ·
`yuklangan` · `yuklash` (§105 — «yuk» boshqa ma'noda 0) ·
`kiruvchi` (keys-raqami: «oyiga … odam foydalanadi») · `olib ketish punkt` (→ «topshirish punktlari») ·
`mo'ljallab` (bankda yo'q niyat-da'vosi — §101) ·
`unicorn` ballanadigan matnda gloss bilanmi (§21 — arena/test/bashorat KODDA tekshiriladi).

---

## 13-A. METODIST-KORREKTURA (2026-08-14 · F-0814-03 · senariy-bosqichi)

> Quruvchidan OLDINGI til/pedagogika raundi. Kalit-indekslar (to'g'ri javob POZITSIYASI) **tegilmadi** —
> T1 B · T2 A · T3 C · T4 B o'z joyida qoldi; faqat MATN o'zgardi.

**A · Test-halolligi (5 tuzatish)**
1. **T1** «Yuk qachon eng og'ir bo'ladi?» + «Bir daqiqada hammasi birdan kirsa» → s2 xulosasining so'zma-so'z yarmi edi (§106 ko'chirma). Yangi savol qoidani **qo'llatadi**: ikki kunda odam soni teng, farq tarqalishida. Eski C (§110 bo'sh variant) o'rniga «Ikkala kuni ham bir xil bo'lgan» — s2 ochiq rad etadigan kundalik tasavvur.
2. **T2-B** «Rasmlari eng ko'p **yuklangan** joy» → darsning bosh atamasi «yuk» boshqa (fayl-yuklash) ma'nosida, ballanadigan matnda (§105). Yangi B/C — s4 da ko'rilgan yuk-turlari, uchalasi bir shaklda (§99).
3. **T3** uch nuqson birdan: «17 million odam **kelganda**» bankdagi **oylik foydalanuvchi** sonini olomonga aylantirardi (10-qonun) · katta sonni yuk deb ko'rsatib, darsning o'z ta'limiga zid tushardi (34-qonun: yuk sondan emas, bir-vaqtdalikdan) · to'g'ri javob 2-slaydda va ko'prikda so'zma-so'z turardi (§106). Yangi savol bankdagi **faktni** so'raydi, xulosa reveal'da. Eski A («Boshqa saytlar hali yo'q») 1-slaydda ROST bo'lib o'qilardi (§102).
4. **Bashorat-1** varianti «Birinchi **unicorn** bo'lganidan keyin» — atama bir slayd KEYIN izohlanadi; izohsiz chet so'z bashorat-chipida turolmaydi (§21/§117). → «Sayt mashhur bo'lganidan keyin».
5. **s10 darvoza-mashqi** uzunlik-telli: 42 · 24 · 28 → ta'rif saqlanib, noto'g'ri variantlar tenglashtirildi (42 · 34 · 36).

**B · Atama-intizomi (darsning eng nozik joyi)**
6. **«joy» → «qism»** barcha qoida-yuzalarida (T2 · T4 reveal · RECAPS · flashcard-3 · s15 qatori · arena-3 · nishon · ko'prik · s1/s4 matnlari). Sabab: s4 fakt-qatorida «hamma eng yaxshi **joylarni** talashyapti» — bu **zaldagi o'rindiq**; bitta so'z ikki narsani anglatardi (§105/§80).
7. **«sin-» oilasi ajratildi:** «sinadi» — faqat nosozlik; o'quvchi harakati «ko'ring/oshiring/tekshiring». O'zgarganlar: s4 sarlavhasi · hook payoffi · s9 o'tish-gapi · s10 sarlavhasi va `console.log` «natija»lari · nishon tavsifi · flashcard sarlavhasi (§105 istisnosi — GATE S 11-band).
8. **T4-A** «hamma qismini **birdan**» → «**birga**»: «birdan» bu darsda faqat bir-vaqtdalikni bildiradi.
9. **Keys atama-izchilligi:** «olib ketish punktlari» → «**topshirish punktlari**» (M2-D2 bilan bir nom) · «~17 mln **kiruvchi**» → «oyiga ~17 million odam **foydalanadi**» (bank matni: foydalanuvchi) — arena-10 va flashcard-9 ham shu shaklga o'tdi.

**C · Keys-sadoqati va ekran-halolligi**
10. 2-slayddagi «katta o'sishni ko'tarishga **mo'ljallab** qurilgan edi» olib tashlandi — bankda niyat haqida gap yo'q (§101), ustiga u test javobini ekranga chiqarardi.
11. **Hisoblagich** «0 dan uzluksiz» edi → 0 bankda yo'q raqam, qolaversa bashorat-2 javobini ekranda ko'rsatib qo'yardi. Endi: «—» → 1,16 mlrd $ (2024) → **bashorat-2 gacha to'xtaydi** → 1,5 mlrd $ (2025) (jadval 6-bo'limda).
12. Slayd-3 raqami valyutasi bilan («2024-yilda 1,16 milliard **dollar**»), slayd-4 fe'li aniq («17 million odam **foydalanadi**»).

**D · Metodika va so'z-tanlovi**
13. **s1 demosi** darsning O'Z qoidasini buzardi: «Chipta qaytarish → Birinchi kundan kuchaytiramiz» — qaytarish odamlarga bitta-bitta keladi (34-qonun). Yangi uchlik: Sharhlar bo'limi · Yordam chati · **Savat** (ochilish daqiqasida hamma birdan bosadi); chap ustun endi s8 artefakti kabi **qism-nomi**.
14. **Sig'im-qatorlari** hozirgi zamonda: «u faqat 100 kishini **ko'tara oladi**» (❌ «ko'tarardi» — sig'im o'zgargandek eshitilardi).
15. **s9 sovg'a-kodi** «birinchi 100 kishiga» → «birinchi **20** kishiga»: 100 shu darsda o'rindiqning sig'imi (§95 — bir son ikki narsani anglatmasin). «Zaxirani talashyapti» → «bitta narsani talashyapti» (dars lug'ati).
16. **Katta harfli urg'u** (BITTA · BIRDAN · ALOHIDA) → **qalin** shrift: bosh harf o'zbek matnida baqirish sifatida o'qiladi (s4 · s8 YORDAM · s9 YORDAM va sabab-qatorlari).
17. **Ichki-jargon ekrandan:** checklist «Har sababda **yuk-belgisi** bor» → «Har sababda **"birdan" yoki "bitta-bitta"**» (uy-vazifa RO'YXATi ham) · javob-qatori «Sabab yukni aytdi» → «**Sababingizda yuk ko'rinib turibdi**».
18. **Mayda til-sayqali:** «ayni 10:00 da» → «xuddi o'sha daqiqada» · «ba'zi sayt … ba'zisi» → «ba'zi saytlar … ba'zilari» · «chipta arzimagan daqiqada tugaydi — daqiqa saytni sinovga soladi» → «chiptalar bir necha daqiqada tugaydi — sayt eng og'ir ishini o'sha daqiqada qiladi» · s8 YULDUZCHAsi chigal qo'shma gapdan bitta buyruqqa (§ETALONI 1: chigal ibora — soddaga).

**E · Qayta o'lchandi (Intl.Segmenter):** ekran-prozalari s0 345 · s1 156 · s2 332 · s4 229 · s8 115 · s9 180 · s10 149 (chegara 400 ✓) · variant-telllari T1 1.11 · T2 1.03 · T3 1.09 · T4 1.14 · darvoza 1.24 · bashorat-1 1.20 (chegara 1.4 ✓) · nishon tavsiflari 32–44 belgi ✓. `node til-lint.mjs` — **0 error / 3 warn** (warn'lar senariy-annotatsiyasiga tegishli: «YADRO» blok-nomi va o'z-tekshiruvdagi «Sen murojaati — 0» qatori).

---

## 14. ⚠️ [GATE S] — FOYDALANUVCHI QARORLARI (ochiq, 2026-08-14)

> 🔴 Senariy shu savollarga javob olmaguncha qurishga o'tmaydi.

1. 🔴 **DARS SARLAVHASI VA SUB.** `App.jsx` `m4a-02`: title «Masshtablanuvchanlik ham mahsulot qarori» · sub «bugungi arxitektura — 6 oydan keyingi tezlik». «Masshtablanuvchanlik» — kalka (pasport taqig'i), «arxitektura» — m4a-01 atamasi. **Taklif:** title → **«Hamma birdan kirsa, sayt chidaydimi?»** · sub → **«yukni oldindan o'ylash — mahsulot qarori»**. Tasdiqlaysizmi?

2. 🔴 **BOSH ATAMA «YUK» (metodist-hukmi so'raladi).** «Masshtab» o'rnini butun darsda **«yuk»** oilasi oladi (yuk · sinadi · chidaydi · ko'taradi · sig'im); inglizcha juftlik faqat flashcard-10 da («Yukka chidash — scalability»). Sabab: «yuk» o'smirga jismonan tanish, ta'rifi bir gapda ochiladi, fe'llari tabiiy. Rozimisiz — yoki «bardosh» kabi boshqa so'z izlansinmi?

3. 🔴 **s4 IKKI BOSQICHLI.** Pasportdagi imzo-vizual («foydalanuvchi-soni slayderi — nima birinchi sinishi ko'rinadi») 1-bosqich sifatida aynan bajarildi; men unga **2-bosqich** qo'shdim: «300 kishi kutilyapti — BITTA qismni oldindan kuchaytiring» tanlovi (to'g'ri tanlov saytni qutqaradi). Sabab: sinishni KO'RISH hali qaror emas — dars mavzusi «qachon kattaga quramiz» degan QAROR, va 2-bosqich uni qo'lda o'ynatadi. Qo'shimcha tasdiqlaysizmi — yoki imzo-vizual faqat sinov bo'lib qolsinmi?

4. 🟡 **RAQAMLAR-TIZIMI.** Sig'imlar (o'rindiq 100 · to'lov 500 · sahifa 2000) va pog'onalar (50 → 300 → 800 → 3000) — demo-qiymatlar; s10 kodi AYNAN shu raqamlarni ishlatadi (22-qonun mosligi). Tasdiqlaysizmi?

5. 🔴 **ARTEFAKT SHAKLI.** `pm-m4a2-yuk = { qarorlar: [ {qism, qaror: 'kuchaytiramiz'|'oddiy', sabab} × 3 ], savedAt }` + saqlash-sharti «kamida bittasi oddiy qoladi» (muvozanat-darsi). Keyingi PM dars (M4b-D2) o'qishi shart emas — modul-chegara; shakl shu ko'rinishda muhrlansinmi?

6. 🟡 **s8 QISM NOMINI O'QUVCHI O'ZI YOZADI** (erkin matn, «Saytning qaysi qismi?» ipuchasi bilan) — tayyor ro'yxatdan tanlamaydi. Sabab: 2-TUR darsida artefakt o'quvchining o'z matni bo'lishi kerak; qoida-tekshiruv sababni baribir tutadi. Rozimisiz — yoki qismlar tayyor ro'yxatdan berilsinmi (yozish faqat sababda)?

7. 🟡 **K1 RAQAM-SIYOSATI.** Unicorn ta'rifi uchun 1 mlrd $ (1,16 — 2024 · 1,5 — 2025) va oyiga ~17 mln foydalanuvchi (2025) aytiladi — pul-istisno (atamani sumsiz tushuntirib bo'lmaydi) va pasport ruxsati bo'yicha. Tasdiqlaysizmi? 🔴 **Metodist qo'shimchasi:** pul-istisno unicorn TA'RIFI uchun ochiq, bashorat-2 esa uchala variantini ham dollarda beradi (1,2 / 1,5 / 3 mlrd) — ya'ni bitta ekranda uchta pul-raqami. Variantlarni sifat-tilida berish mumkin («deyarli o'zgarmadi» / «yana o'sdi» / «ikki barobardan oshdi»), lekin unda to'g'ri javob yolg'iz raqamsiz qoladi va shakl-telli tug'iladi. Shu sababli hozirgi shakl saqlandi — tasdiqlaysizmi?

8. 🟡 **KEYS-BASHORATLAR M2-D2 DAN FARQI.** M2-D2 «nimani qurdi?» va «qancha odam?» deb so'ragan edi. Bu dars «QACHON qurgan?» (vaqt-o'lchovi) va «bahosi qancha bo'ldi?» (qiymat-o'lchovi) deb so'raydi — ikkala bashorat ham yangi. 17 mln raqami bashorat emas, 4-slayd fakti sifatida keladi. Shu chegara yetarlimi?

9. 🟡 **UY-VAZIFA DARS OLAMIDA QOLADI** (chipta saytining to'rtinchi qismi) — o'quvchining «o'z ilovasi»ga ko'chirilmaydi. Sabab: modul-chegara + M4-D2 pretsedenti (artefakt demo-olamda davom etadi). Rozimisiz — yoki to'liq versiya «o'zingiz har kuni ishlatadigan ilovadan qism toping» bo'lsinmi?

10. 🟢 **s9 SAHNASI** — konsert KUNI, eshik oldi (sovg'a-kod · QR-chipta · konsert tartibi · xonanda sahifasi): s4 dagi «chipta ochilish daqiqasi»dan boshqa payt, lekin o'sha olam (91-qonun ichida ikki sahna). Sovg'a-kod («birinchi **20** kishiga» — metodist tuzatdi: 100 shu darsda o'rindiqning sig'imi, bir son ikki narsani anglatmasin) — demo-olamning o'z tafsiloti, keys-fakti emas. OQLANADIMI?

**Metodist raundi qo'shgan savollar (2026-08-14 · F-0814-03):**

11. 🔴 **FLASHCARD SARLAVHASI SHU DARSDA O'ZGARADI.** Platformadagi odatiy «O'zingizni **sinab** ko'ring» — bu darsda o'sha ekranning kartalarida «Qaysi qism birinchi **sinadi**?» turadi, ya'ni bitta ekranda «sin-» ikki ma'no beradi (§105 · pretsedent: yakun-eyebrow'i «Tayyor» → «Dars yakuni»). Taklif: **«O'zingizni tekshirib ko'ring.»** Faqat shu darsda. Rozimisiz — yoki umumiy naqsh saqlanib, o'rniga darsning fe'li o'zgartirilsinmi?

12. 🟡 **T3 ENDI KEYS-FAKTINI SO'RAYDI, XULOSANI EMAS.** Eski savol («17 million odam kelganda yo'l nega chidadi?») uch qonunni birdan buzardi (13-A bo'lim, 3-band), shuning uchun savol **«Uzum ochilgan kuni nimasi tayyor edi?»** ga o'girildi — xulosa-formula reveal'ga ko'chdi (§106 qolipi: slayd faktni beradi, formulani bola chiqaradi). Natijada T3 bilim-darajasi «tushunish»dan «esda saqlash»ga bir pog'ona tushdi; o'rniga bashorat-1 (VAQT) va ko'prik-gap xulosani ushlab turadi. Shu almashuvni tasdiqlaysizmi — yoki T3 ni «qo'llash» darajasida qoldirib, 2-slayd va ko'prik matnini yana qisqartiraylikmi?

---

*Senariy PM_Prompt_v8 (9 blok · 13 maydon) · PM_DARS_ETALON (1–109) · MATN_KORPUS (0–118, §99–118 bilan) · MATN_ETALONI (lug'at + 7-B) · PM_KEYS_MEXANIKA_REGISTRI (R1/R2/R3 pasporti) bo'yicha yozildi. `pm-metodist` SENARIY-KORREKTURA bajarildi (2026-08-14 · F-0814-03 · 13-A bo'lim). Keyingi qadam: **[GATE S]** — 14-bo'lim savollari (1–12).*

---

## ✅ [AVTO-GATE S] YOPILDI — 2026-08-14 (foydalanuvchi avtokontrol-ruxsati asosida, bosh-agent)

1. **App.jsx karta:** title **«Hamma birdan kirsa, sayt chidaydimi?»** · sub «yuk — birdan
   kelgan og'irlik» (bosh-agent qurilishda).
2. **«Yuk» atama-oilasi TASDIQ** (masshtab/scale 0; §121 ildiz-intizomi bilan).
3. **s4 ikki-bosqichli imzo TASDIQ** (surma + «bitta qismni kuchaytir» qarori).
4. **Raqamlar-tizimi TASDIQ** (100/500/2000 ↔ pog'onalar ↔ s10 — korrektura izchilligi bilan).
5. **Artefakt TASDIQ:** `pm-m4a2-yuk = { qarorlar: [{qism, qaror, sabab}×3], savedAt }` +
   «kamida bittasi oddiy qoladi» sharti.
6. **s8 da qism-nomini o'quvchi o'zi yozadi — TASDIQ.**
7. **K1 pul-istisno TASDIQ** (metodist-izohi bilan: sifat-tilga o'tkazish shakl-telli
   tug'dirardi).
8. **Bashoratlar M2-D2 dan farqi TASDIQ** (qachon? / bahosi? — yangi o'lchovlar).
9. **Uy-vazifa dars olamida — TASDIQ.**
10. **s9 sahnasi TASDIQ** (sovg'a-kod 20 kishiga — korrektura tuzatishi bilan).
11. **Flashcard sarlavhasi SHU darsda «O'zingizni tekshirib ko'ring» — TASDIQ** (§121:
    «sin-» ildizi band); boshqa darslar uchun platforma-sweep savoliga yozildi.
12. **T3 hozirgi shakli TASDIQ** (bank-fakt so'raladi, xulosa reveal'da — xavfsiz tomon).
