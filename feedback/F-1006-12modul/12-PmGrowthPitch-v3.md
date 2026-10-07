# 12-Modul · 12-dars (PM) «Raqamlaringiz zalni ishontiradimi?» — MD v3

Fayl: `src/10-Modull/PmGrowthPitchLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-12` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta) · «Maydon Jamoa» — telefon maketida, «Uzum» — o'z rangida, tanish maketda ·
ekranga kirganda bo'sh, ma'nosiz element yo'q · ekranda ≤ 3 blok · telefon maketi chapda (≈170×272, o'lchami barqaror), bo'laklar, grafik va varaq o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 7-ekran — **D** (`3`) · 12-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 408–410, DE-205): `m10-11` «Raqamlaringiz pitchni qanday o'zgartiradi?» → **`m10-12` «Raqamlaringiz zalni ishontiradimi?»** (osti: «metrikali pitch: o'sish grafigi — dalil») → `m10-13` «Zaxira dars» (`comp` siz).
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (besh bo'lakli 5 daqiqalik pitch) va uning juftlikdagi repetitsiyasi; mustaqil ish majburiy (10, 11-ekranlar). Keys — **K1 Uzum** (mintaqaviy; tayanch 5, bank matni).
REPO yo'q (tayanch 3: PM darslari 11, 12 — repo'ga yozmaydi). Jonli demo Mentor misolida — teg `m12-dars-10-done` holatidagi ilova (tayanch 3 jadvali).
Kod mexanikasi (tayanch 4): **kod oynasi — sonlar massividan ustunli grafik** (JS, brauzerda; `HtmlCompiler`). Oldingi PM darsi (11) — kod ekrani yo'q, 10 — Neon SQL: mexanika takrorlanmaydi.
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushuncha, keys va testlar (2–8) ≈ 30 · kod oynasi ≈ 12 · pitch yozish ≈ 12 · juftlikda pitch (2 × 5 daqiqa + varaq) va tuzatish ≈ 18 · yakuniy savol, podium, kartochkalar, arena ≈ 13.
  Ulgurmagan o'quvchi yo'li: 9-ekranda ikki hafta nuqtasi yo'q yoki kod tugamasa — «Grafikka nuqta yetmaydi» (grafiksiz davom etadi; grafik yo'qligi pitchni yomon qilmaydi — Raqamlar bo'lagida bor son, bosh raqam va halol gap) · 10-ekranda bo'laklar to'lmasa — jonli darsda Mentor o'tkazadi (`optionalLive`), qolgani uyda ·
  11-ekranda juftlik vaqti yetmasa — o'quvchi pitchni uyda aytadi (uyga vazifa ①) · yakun sarlavhasi holatga qarab (15-ekran, to'rt holat).
  ⛔ Taqsimot — reja: «qur» pilotida 12–15 o'quvchi bilan taymer (12-FILTR 36–38; auditor 11-ekranga 22–25 daqiqa kutadi) — sig'masa, B o'quvchining pitchi uyga vazifa ① ga o'tadi.
12-FILTR (F-1006-366, 06.10.2026) dan keyingi holat: Mentor pitchi 11-darsdagi tuzatilgan pitchning davomi (Muammo va Keyingi qadam gaplari bir) · dalil — son yoki kuzatuv · grafik: ustun — jami, farq — haftalik qo'shimcha · grafik nuqtalarining manbasi aniq · jonli demo — real odamlar qo'shilmagan o'yinda · 12-ekranning bitta varianti almashdi.
Manba: `00-MODUL-TAYANCH.md` (1.0 — muammo va yechim gapi, bosh raqam · 1.1 va 9.2 — lending foydalari · 1.10 — hisobot · 1.11 — tuzatilgan pitch · **1.12 — metrikali pitch aynan** · **1.13 — sonlar jadvali** · 2 — atamalar · 3 — teg 10 · 4 — tuzilish · 5 — K1 · 6 — Render, brauzer ko'rinishi · 7 — sinflar · 8 — kalitlar · 9 — kelishuvlar) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 13, 20, 22) · `00-TAQIQLAR.md` · `00-NOMLAR.md` · 11-Modul tayanchi (1, 1.9, 2, 9.2, 9.95, 9.98, 9.99) va `16-PmPrototypePitch-v3.md` + `16-FILTR.md` (to'rt bo'lak, zal savollari, varaq, jonli demo) ·
10-Modul `11-PmPitchRehearsal-v3.md` + `11-FILTR.md` (5 daqiqa, Raqamlar slaydi, halol gap ta'rifi) · `PM_Prompt_v8.md` K1 (171–174-qatorlar).
⚠️ Modul raqami o'quvchi matnida — LMS raqami («o'tgan modulda» — 11-Modul). Kod raqami faqat fayl yo'lida. O'quvchi matnida dars raqami («10-darsda») ham yo'q — dars natijasi nomi bilan aytiladi («metrika hisobotingiz», «tuzatilgan pitchingiz»).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (tayanch 4: «5 daqiqalik besh bo'lakli pitch, o'sish grafigi bilan, juftlikda baholangan»; dastur: «Pitch repetitsiyasi»):** o'quvchi o'z sonlaridan **o'sish grafigini** kod oynasida chizadi (9-ekran),
   pitchini besh bo'lakka yozadi — **Muammo · Yechim · Jonli demo · Raqamlar · Keyingi qadam** (10-ekran), sherigiga 5 daqiqada aytadi, jonli demoni ikki qurilmada ko'rsatadi, sherik **baholash varag'ini** to'ldiradi,
   o'quvchi ✗ olgan bitta bo'lakni darsda tuzatadi (qolgani — uyda; 11-ekran). Saqlanadi: `pm-m10d12-pitch` (tayanch 8; ichki shakli — TAYANCHGA SAVOL 5).
   Natija to'rt holatda bo'lishi mumkin (15-ekran sarlavhasi shunga qarab — sinf 1): aytildi va baholandi · yozildi, aytish qoldi · grafik tayyor, bo'laklar qoldi · grafik va bo'laklar qoldi. Belgi ✓ va nishon — faqat birinchisida.
   Bitiruv himoyasi, Demo Day va keyingi modullar o'quvchi matnida va'da qilinmaydi (T-038; faqat shu A-bo'limda: dastur bo'yicha bu pitch keyin ham kerak bo'ladi — `00-MANBA.md` 1).
2. **Bugungi asosiy fikr (P-013):** Zal sonni ustunlarda ko'radi: noldan, haftama-hafta, sanasi va nima sanalgani bilan — yonida bitta halol gap. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 9-Modul: **pitch** · **zal** (pitchni tinglaydiganlar) · **repetitsiya** (sahnadan oldin pitchni ovoz chiqarib aytib ko'rish).
   - 10-Modul 11-dars: **halol gap** — «raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish» (so'zma-so'z; bu darsda «raqam» o'rniga «son» — A-5) · **fidbek** · **qattiq, lekin hurmatli fidbek** · **baholash varag'i** · **keyingi qadam**.
   - 11-Modul 16-dars: **bo'lak** (pitchning qismi; «qism» emas — 11-Modul 9.46) · to'rt bo'lak nomlari **Muammo · Yechim · Jonli demo · Keyingi qadam** · **jonli demo** — «Jonli demo bo'lagida ilova zal oldida telefonda ishlatib ko'rsatiladi.» ·
     zal savollari (`ZAL_SAVOL`, aynan) · ekran videosi zaxirasi (11-Modul 9.98–9.99 naqshi) · «Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?».
   - 7, 10, 11-Modul: **metrika** · **bosh raqam** (Mentor misolida — haftada to'lgan o'yinlar) · **qaytganlar foizi** (faqat O'qituvchi eslatmasida) · **muammo gapi** · **dalil** (12-Modul 11-dars: son yoki yozuv; uch narsasi — son yoki yozuv, manba va qachon olingani — tayanch 9.43 a).
   - 12-Modul: **lending**, **foyda** (1-dars) · **ulanish belgisi** «Ulangan» · «Ulanmoqda…» · «Ulanmagan» (2-dars) · **ro'yxatdan o'tgan**, **asosiy harakatni qilgan**, sinfdoshlar alohida (7-dars) · **namuna va tekshiruv akkauntlari** (7-dars) ·
     **brauzer ko'rinishi** (7-dars) · **mehmon ko'rinishi** (8-dars, faqat O'qituvchi eslatmasida) · **metrika hisoboti**, **sanoq sahifasi** (8, 10-darslar) · **da'vo**, **tuzatilgan pitch** (11-dars) · **real vaqt** («o'zi yangilanadi», 2-dars).
   - JavaScript: `const`, `let`, `if` (3-Modul JavaScript darslari) · ro'yxat (massiv) va obyekt, `forEach`, `document.createElement`, `textContent`, `appendChild` — 11-Modul 1, 6-darslar kod oynalarida tayyor kod ichida ko'rilgan; bugun o'quvchi ularni yozmaydi, faqat to'rt joyni to'ldiradi (Yordam'da bir qatordan eslatma).
4. **Bu darsda yangi — misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar dars bo'yi so'zma-so'z (T-042):**
   - **Raqamlar bo'lagi** — «Raqamlar bo'lagida ilova ishga tushgach sanalgan sonlar ko'rsatiladi.» (2-ekran `QIzoh`, bo'lak paydo bo'lgandan keyin). Tarkibi (kurs qolipi, sinf 2a — «Bizda»): o'sish grafigi · bosh raqam · bitta halol gap.
     Zal savoli: **«Bu son qayerdan va nimani sanaydi?»** (tayanch 1.12).
   - **Besh bo'lak** — «Bizda 5 daqiqalik pitch besh bo'lakdan iborat: muammo, yechim, jonli demo, raqamlar va keyingi qadam.» (2-ekran xulosasi; kartochka 1; yakun).
   - **o'sish grafigi** — «Bir xil oraliqdagi sonlar ustunlari o'sish grafigi deyiladi; nima sanalgani sarlavhada yoziladi.» (4-ekran `QIzoh`, to'rt tuzatishdan keyin; tayanch 2 ta'rifi).
   - **Grafik qoidalari (tayanch 1.12; kurs qolipi — shu darsdagi ustunli grafik uchun, hamma grafik turiga umumiy qoida emas; 12-FILTR 3):** ustunlar **noldan** boshlanadi · oraliqlar **teng** (hafta) · har ustun **ostida sana, ustida son** · **sarlavhada nima sanalgani**. Har biri 4-ekranda harakat bilan, keyin yorliq bo'lib tug'iladi.
     **Ustun — jami, farq — qo'shimcha (12-FILTR 2):** Mentor grafigida har ustun — shu kungacha ro'yxatdan o'tganlarning jami (20 · 38 · 44); ikki ustun orasidagi farq — o'sha haftadagi qo'shimcha (18, keyin 6). O'quvchi «38»ni «birinchi haftada 38 kishi keldi» deb o'qimasligi uchun 4-ekranda bitta qator.
     «Ostida sana»: o'quvchi grafigida — kalendar kun; Mentor misolida aniq kun tayanchda yo'q — o'rnida «ishga tushirish kuni», «bir hafta o'tib» (to'qilgan sana qo'yilmaydi; 12-FILTR 27).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«son»** — sanalgan miqdor (44 kishi, 3 ta o'yin). **«raqam»** — faqat atoqli birikmalarda: bo'lak nomi «Raqamlar», atama «bosh raqam», dars nomi «Raqamlaringiz…». 10-Modul halol gap ta'rifidagi «raqam» bu darsda «son» bilan aytiladi (TAYANCHGA SAVOL 17).
   - **«bo'lak»** — pitchning besh qismidan biri. **«ustun»** — faqat grafik ustuni (jadval ustuni bu darsda yo'q). **«grafik»** — o'sish grafigi (qisqa nomi, atama tug'ilgandan keyin).
   - **«qadam»** — faqat «Keyingi qadam» (bo'lak nomi, atoqli) va O'qituvchi eslatmasidagi «qadamlar sanog'i»; ekrandagi bosiladigan tartib — **tugmalar** (1, 2, 3), keysda — **kadr** (T-015, tayanch 2). «bosqich» — o'quvchi matnida yo'q.
   - **«hafta»** — grafik oralig'i (7 kun). **«jami»** — shu kungacha ro'yxatdan o'tganlarning hammasi (Mentor sarlavhasi «Ro'yxatdan o'tganlar, jami»).
   - **«qurilma»** — jonli demodagi telefon yoki laptopdagi brauzer ko'rinishi; sahna yorliqlari «1-telefon · siz» · «2-telefon · boshqa o'yinchi» (tayanch 9.16). **«dars qurilmasi»** — dars ochiq turgan laptop yoki planshet (11-ekran).
   - **«tekshirish»** — o'z ishini ko'rish (ulanish belgisi, kod shartlari) · **«sinov»** — o'quvchi matnida yo'q (bugun real odam bilan sinov o'tkazilmaydi; sherik bilan — repetitsiya).
   - **«e'lon»** — faqat o'yin e'loni («E'lon berilgach …»). **«hodisa»**, **«xabar»**, **«post»**, **«kanal»** — bu darsda o'quvchi matnida yo'q. **«holat»** — faqat MD ichida (yakun holatlari).
   - **Ishlatilmaydi:** slayd (o'quvchi matnida) · chart · trayektoriya · voronka · retention · onlayn · real-time · «sir» · «albatta» · «darrov» · «aniq yetamiz» · «ishontiradi» (da'vo sifatida; dars nomidagi savol — o'z holida).
6. **Mentor misoli — «Maydon Jamoa» pitchi (bitta manba `JAMOA_PITCH`, 180-qonun; hamma son — tayanch 1.12/1.13, «Mentor misolida»):**

| Bo'lak (vaqt — «bu mashqda») | Matn (o'quvchi ko'radi) | Tayanch |
|---|---|---|
| Muammo (≈40 soniya) | «O'yinchilar jamoaga odam yig'ishda qiynaladi.» · dalil: «Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» (intervyu yozuvlari, 11-Modul) | 1.11 (1-da'vo — 11-darsdagi tuzatilgan pitch gapi), 9.44 a |
| Yechim (≈20 soniya) | yechim gapi: «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» + lendingdagi foydalar: «Bir bosishda jamoadasiz» · «Nechta odam yig'ilganini so'rab o'tirmaysiz» · «Kim aniq kelishini o'yindan oldin bilasiz» | 1.0, 1.1, 9.31 (GATE M 06.10: M-q4 A — tasdiqlandi) |
| Jonli demo (≈1,5 daqiqa) | 1-telefonda «Shanba, 18:00» o'yinida «Qo'shilaman» bosiladi · 2-telefonda «8 / 10» o'rniga «9 / 10» o'zi chiqadi | 1.12, 9.2 (11-Modul) |
| Raqamlar (≈1,5 daqiqa) | grafik «Ro'yxatdan o'tganlar, jami»: ishga tushirish kuni **20** · bir hafta o'tib **38** · ikki hafta o'tib **44** · bosh raqam: «Haftada to'lgan o'yinlar: birinchi haftada 1, ikkinchi haftada 3» · halol gap: «44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).» | 1.12, 1.13 |
| Keyingi qadam (≈1 daqiqa) | «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.» | 1.12, 9.44 a (11-darsdagi tuzatilgan pitch gapi + maqsad) |

   - Jami — 5 daqiqa (40 + 20 + 90 + 90 + 60 soniya). Taqsimot — mashq uchun boshlang'ich («bu mashqda», 10-Modul `11-FILTR` 6).
   - **Zal savollari (`ZAL_SAVOL`, bitta manba — P-063; Sahna pufagi va baholash varag'i qatorlari ham shular):** Muammo — «Bu muammo borligini qayerdan bilasiz?» · Yechim — «Mahsulot nima qiladi?» ·
     Jonli demo — «Ishlayotganini ko'rsata olasizmi?» · **Raqamlar — «Bu son qayerdan va nimani sanaydi?»** · Keyingi qadam — «Endi nima qilasiz?» (11-Modul 16-dars to'rttasi aynan + tayanch 1.12).
   - **Zaxira javoblar (faqat O'qituvchi eslatmasida — bo'lakka kirmaydi; TAYANCHGA SAVOL 8):** zal «ishlatyaptimi?» desa — asosiy harakatni qilganlar 8 · 19 · 24 (44 kishidan 24 tasi hozir kamida bitta o'yinda qatnashyapti yoki o'yin e'lon qilgan — 9.23 ta'rifi, 1.13 soni; 11-FILTR dan keyin 1.11 da bu — 2-da'vo dalilining izohi, 3-da'vo esa qaytganlar soni bilan qayta yozilgan);
     «qaytib kelyaptimi?» desa — birinchi haftada ochgan 61 qurilmadan 26 tasi ikkinchi haftada ham ochdi (43%; birligi — qurilma).
   - 4-ekran mashq grafigi (faqat 1.13 sonlari): «3 kun o'tib — 27» ustuni oraliqni buzadi; o'q «18» dan boshlanadi — bu Mentorning haqiqiy grafigi emas, kesilgan o'q qanday chalg'itishini ko'rsatadigan mashq (yorliq «mashq: ataylab buzilgan»; 12-FILTR 4).
   - **Mentor pitchi — 11-darsdagi tuzatilgan pitchning davomi (12-FILTR, o'z topilmam; tayanch 9.44 a):** Muammo gapi va Keyingi qadam gapi 11-darsdagi bilan bir; 11-darsdagi Jonli demo bo'lagining sonli gaplari (38 va 19; 46 dan 17) bu yerda bo'lakka kirmaydi — ular zal savoliga zaxira javob (pastda).
     Yechim bo'lagi — tayanch 9.31 bo'yicha yechim gapi + foydalar (avval MD da faqat foydalar edi — 9.31 bilan moslanmagan). Bu Mentor pitchining usuli, «yechim shunday yoziladi» degan umumiy qoida emas; o'quvchi yechim gapini qoldirib, 1–3 foydani o'zi tanlaydi.
7. **Sonlar (faqat tayanchdan):** 20 · 38 · 44 (grafik) · 27 (3 kun o'tib, 4-ekran) · 11 (sinfdosh) · 1 va 3 (bosh raqam) · 8 · 19 · 24 va 61 / 26 / 43% (O'qituvchi eslatmasi) · «8 / 10» → «9 / 10» (namuna o'yin) ·
   K1: 2022-yil oktabr, 2024-yil mart, 1 milliard dollar («unicorn» ta'rifi), oyiga ≈17 million foydalanuvchi (2025). Ikkinchi misol (testlar) — sonlar mashq uchun (P-002). Boshqa son yo'q.
   Birliklar: «kishi» — ro'yxatdan o'tgan hisob · «qurilma» — qaytganlar foizi · «o'yin» — bosh raqam. Har xil o'lchovdagi sonlar ayirilmaydi (sinf 5).
8. **Keys — K1 Uzum (tayanch 5, bank matni; ruscha asli `PM_Prompt_v8.md` 171–174):** «Marketpleys 2022-yil oktabrida ishga tushgan; saytdan emas, yetkazib berishdan boshlagan (o'z avtoparki, topshirish punktlari, ertasi kuni yetkazish) —
   oldin odamlar ko'pincha Instagram va Telegram guruhlari orqali xarid qilgan. 2024-yil martida mamlakatning birinchi «unicorn»i; oyiga ≈17 mln foydalanuvchi (2025).»
   Brend izohlari (S-018, tayanch 5): «Uzum — internet-magazin» · «unicorn — bahosi 1 mlrd dollardan oshgan kompaniya» (atamani tushuntirish uchun summa aytiladi — bank qoidasi).
   Ko'prik (umumiy joy, tenglik emas; tayanch 1.12): o'sish sana bilan aytiladi — qachon nechta; bugungi burchak — **son yonida yili va nima sanalgani**. «17 million» — o'quvchiga me'yor emas (6-ekran kulrang qator, 7-ekran A izohi, kartochka 9).
   Bankdan tashqari fakt (kompaniya bahosining keyingi qiymatlari, asoschilar, sabablar) yo'q. Bankdagi «Instagram va Telegram guruhlari» qismi bu darsda aytilmaydi — 9, 10, 11-Modulda aytilgan (O'qituvchi eslatmasi; TAYANCHGA SAVOL 10).
9. **Ikkinchi misol faqat testda (P-002), Mentorning 11-Moduldagi boshqa g'oyalari:** uy vazifalari ilovasi (3-ekran) · to'garaklar sayti (5-ekran) — sonlari mashq uchun.
10. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✗ › — belgilar. Zal siluetlari, taymer chizig'i, telefonlar, grafik ustunlari, Uzum sahnasi — chizilgan (CSS/SVG), logotip yo'q. O'yin qatlami (arena, nishon medali, podium) — mustasno.
    Kafolat so'zlari yo'q: «son o'zi o'zgaradi» — «odatda bir necha soniyada» bilan (8-ekran), ekran videosi — zaxira yo'li.
11. **Xavfsizlik (sinf 14, TAQIQLAR 2):** grafik va pitchda ism, login, familiya yo'q — faqat sonlar (sinfdoshlar — son bilan, ismsiz) · jonli demoda har qurilma o'z akkaunti bilan, akkaunt ma'lumoti boshqaga berilmaydi · demo — real odamlar qo'shilmagan o'yinda (ularga jonli xabar bormasin, son chalg'itmasin — 12-FILTR 22, 23) ·
    zal oldida laptopda Neon, sanoq sahifasi va `.env` yopiq (11-ekran «Pitchdan oldin») · uyda pitch tanish odamga aytiladi, ilovaga ro'yxatdan o'tishga majburlanmaydi (uyga vazifa).
12. **Trek:** ikkala trekka bitta matn; farqlari — 8-ekran 3-tugmasi va O'qituvchi eslatmasi, 11-ekran «Pitchdan oldin» bloki (mobil trek — ikki telefon yoki brauzer ko'rinishi; web-trek — ikki brauzer oynasi, boshqa akkaunt bilan).
    Trek kaliti (`pm-m9d8-platforma.trek`) o'qilmaydi — ikkala qator ham ko'rinadi.
13. **Kod mexanikasi (tayanch 4, Qaror-0 20):** kod oynasi (`HtmlCompiler`, `index.html` + `app.js`; CSS — darsda tayyor) — o'quvchi sonlar ro'yxatidan ustunli grafik chizadi: sarlavha, noldan balandlik, ustidagi son, ostidagi sana.
    Ro'yxat — o'quvchining haftalik jami sonlari. **Manba (tayanch 8, 9.44 b — 12-FILTR 6):** `pm-m10d10-hisobot.kunlar` — har kuni yangi ro'yxatdan o'tganlar soni (jami emas), sana `YYYY-MM-DD`, namuna va tekshiruv akkauntlarisiz; dars shundan har 7 kunda jamini hisoblaydi.
    `kunlar` metrika hisoboti yozilgan kungacha — keyingi hafta nuqtasini o'quvchi o'zi qo'shadi (o'sha so'rov yoki sanoq sahifasi bilan). `kunlar` yo'q bo'lsa — nuqtalarni ro'yxatga o'zi yozadi; ikki nuqta ham bo'lmasa — «Grafikka nuqta yetmaydi» (P-026).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0, 1.7–1.11):** ilova jonlandi (ekran o'zi yangilanadi), odamlarga yuborildi (7), sanaldi (8, 10), pitch dalil bilan tuzatildi (11) → **bugun: shu yo'l 5 daqiqalik pitchga, sonlari grafik bilan, yig'iladi**.
- **11-Modul ko'prigi (takrorlanmaydi):** u yerda 3 daqiqa va to'rt bo'lak — Muammo · Yechim · Jonli demo · Keyingi qadam, baholash varag'i, ekran videosi zaxirasi o'rgatilgan. Bugun — 5 daqiqa, beshinchi bo'lak «Raqamlar» va ikki qurilmali jonli demo.
- **Dars ipi:** 0 — zal ekranda yolg'iz «44» ni ko'rdi: u nimani so'raydi → 2 — to'rt bo'lak orasiga Raqamlar bo'lagi qo'shiladi, taymer 5 daqiqaga uzayadi (atama «Raqamlar bo'lagi») → 3 — test: qaysi son Raqamlarga →
  4 — bir xil sonlar: 18 dan boshlangan grafik noldan, haftama-hafta qilinadi, sana, son va sarlavha qo'shiladi (atama «o'sish grafigi») → 5 — test: ustunlar 30 dan → 6 — Uzum: har son yili bilan, «17 million» — oyiga → 7 — test →
  8 — jonli demo: bitta telefonda real vaqt ko'rinmaydi, ikkinchisida son o'zi o'zgaradi; zaxira yo'li → 9 — o'quvchi o'z sonlaridan grafikni kod bilan chizadi → 10 — besh bo'lakni yozadi → 11 — sherigiga 5 daqiqada aytadi, varaq, bitta bo'lak tuzatiladi →
  12 — yakuniy savol: sekinlashuv va halol gap → podium → kartochkalar → yakun; uyda — tanish odamga repetitsiya.
- **Bitta vizual — `BeshDaqiqaSahna` (dars bo'yi, 163/180; bitta manba `JAMOA_PITCH` + o'quvchi pitchi `pm-m10d12-pitch`; 11-Modul `UchDaqiqaSahna` ning davomi — dars ichida yoziladi, K-020):**
  - **chapda — telefon** (≈170×272, barqaror — SABOQ 22): «Maydon Jamoa» (nom o'z rangida, 11-Modul 9.62 yashili; logotip yo'q) — «O'yinlar» (tepada ulanish belgisi) va «O'yin» («Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shilaman»).
    «8 / 10» → «9 / 10»: son almashadi va bir lahza kattalashib, silliq qaytadi (11-Modul 9.14). **Jonli demo rejimi** (8-ekran): chapda «1-telefon · siz», o'rtada Backend (ichida «Database: 8» → «9»), o'ngda «2-telefon · boshqa o'yinchi»; konvert ochiq chiziq bo'ylab uchadi (tayanch 9.16).
  - **o'ngda — besh bo'lak** (ustma-ust ixcham kartalar, bir balandlikda): bo'lak nomi va 1–3 qator. Holatlar: bo'sh (kulrang uzuq chiziq, U-041) → joriy (accent chegara) → yozildi (matn sirg'alib kiradi, ~1 s yashil) → ✓ · ✗ (`err` chet) · o'zgartirildi (neytral chet + yorliq «o'zgartirildi»; ✗ o'chmaydi).
    **Raqamlar bo'lagi ichida — `OsishGrafigi`** (ixcham: uch ustun, sarlavha, ostida sana, ustida son); bo'lak joriy bo'lganda grafik kattalashadi (11-ekran taymerida).
  - **bo'laklar ostida — taymer chizig'i** 0–5:00, besh bo'lakka bo'lingan (≈40 s · ≈20 s · ≈1,5 daqiqa · ≈1,5 daqiqa · ≈1 daqiqa; har bo'lak ostida nomi); 5:00 dan oshsa chiziq o'ngga qizil davom etadi, yonida «+m:ss».
  - **bo'laklar ustida — zal:** to'rtta chizilgan bosh-siluet va bitta savol pufagi (`ZAL_SAVOL`); bo'lak javob bersa — pufak o'rnida yashil ✓.
  - **baholash varag'i qatlami** (11-ekran): besh qator — bo'lak nomi · zal savoli · ✓ / ✗ · izoh qatori; pastda «Vaqt: m:ss» (taymerdan o'zi yoziladi).
  - **`OsishGrafigi` katta ko'rinishi** (4, 9-ekranlar; 5, 7, 12-ekran javobidan keyingi kichik kartalar): ustunlar, chap o'qda pastki son, sarlavha qatori, ostida sana, ustida son; holatlar `buzilgan` (4-ekran boshi) → `toliq`.
  - Ishlatiladi: 0 (zal + «44» kartasi) · 1 (matnsiz skelet) · 2 · 4 (`OsishGrafigi` katta, telefonsiz — SABOQ 24) · 6 — o'z sahnasi `UzumSahna` · 8 (jonli demo rejimi) · 9 (natija oynasidagi grafik) · 10 · 11.
    `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi. Telefon kengligida (393) bo'laklar telefon ostiga tushadi. Vizual ⛶ ichida (q17).
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har holatda bitta faol element — accent halqa doim, yengil to'lqin 2–3 marta; tanlov guruhida har variantda yumshoq halqa. Yoqilgan pastki tugma ham halqada.
- **Bashorat (SABOQ 11, 25):** tanlangach yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (bo'lak taymerga, ustun joyiga, konvert telefondan telefonga) · yangi qator ~1 s yashil yonadi · ustun o'sib chiqadi, son sanab o'sadi.
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon Jamoa» pitchi
- Sarlavha: **Raqamlaringiz zalni ishontiradimi?** (34) — dars nomi (DE-205)
- Mentor: Mentor misolida zal ekranda faqat «44» ni ko'rdi: sizningcha, u birinchi nimani so'raydi?
- Maket (chap): zal — to'rtta siluet, pufakda «?»; ularning oldida bitta katta karta — faqat «44» (sarlavhasiz, sanasiz, ustunsiz), karta ustida kulrang yorliq «Mentor misoli».
- Variantlar (radio, o'ng; bir uzunlikda):
  - Bu son qayerdan va nimani sanaydi
  - Bu son boshqalarnikidan kattami
  - Bu sonni qanday qilib oshirgansiz
- Javob — «qayerdan va nimani»: **Aynan!** «44» yolg'iz turibdi: nimani sanagani ham, qachon sanalgani ham ko'rinmaydi.
- Javob — «kattami»: **Qiziq fikr!** Solishtirish keyin bo'ladi — avval zal «44» nimani sanashini bilmoqchi.
- Javob — «oshirgansiz»: **Qiziq fikr!** Buni ham so'rashadi, lekin «44» ning o'zi hali nimani sanashi noma'lum.
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant ixcham qator bo'lib qoladi; «44» kartasi ustida va ostida ikki bo'sh uzuq qator accent halqa bilan yonadi (sarlavha va sana joyi — matn yozilmaydi, 4-ekran kashfiyoti, P-036); pufakdagi «?» qoladi.
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: «44» — Mentor misolidagi son: ilova ishga tushganidan ikki hafta o'tib ro'yxatdan o'tganlar. Hozir aytmang — 4-ekranda grafikda o'zi chiqadi.
  O'tgan modulda pitch 3 daqiqa va to'rt bo'lak edi; bugun 5 daqiqa. Sinfdan so'rang: sonni eshitganda o'zingiz nimani so'raysiz?

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun 5 daqiqalik pitchni sonlaringiz bilan aytasiz.** (52)
- Mentor: Metrika hisobotingiz va tuzatilgan pitchingiz bugun kerak bo'ladi — ilovangiz telefonda ochilib tursin.
- Chap — «Dars oxirida» + kulrang yorliq **metrikali pitch: o'sish grafigi — dalil** (App.jsx osti so'zma-so'z, atamalar kulrang yorliqda — P-015) + vizual: Sahna skeleti — telefon (kulrang ekran-skelet) va beshta nomsiz bo'lak;
  kulrang chiziqlar 0.6 s oraliqda birma-bir to'q chiziqqa aylanadi, oxirida taymer chizig'i 5:00 gacha to'lib, zal ustida ✓. Matnsiz, grafiksiz — 2 va 4-ekran kashfiyotini ochmaydi (P-015).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Pitchga sonlar qayerda qo'shilishini bilib olasiz · `besh bo'lak`
  - 02 · Sonlarni ustunlarda halol ko'rsatishni o'rganasiz · `grafik`
  - 03 · Uzum qanday o'sganini ko'rasiz · `voqea`
  - 04 · Pitchni sherigingizga jonli demo bilan aytasiz · `jonli demo`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «o'sish grafigi», «metrikali pitch» faqat kulrang yorliqda. «sonlaringiz», «pitchingiz» — o'quvchida metrika hisoboti va tuzatilgan pitch bor (T-039); bo'lmasa ham dars yo'li bor (9, 10-ekran).

## 2 · Besh bo'lak  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · besh bo'lak
- Sarlavha: **Besh daqiqalik pitchda sonlar qayerda turadi?** (45) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: O'tgan modulda pitch 3 daqiqa va to'rt bo'lak edi: tugmalarni birma-bir bosib, taymerga qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov: o'rin, boshidan oxiriga): **Sonlar pitchning qayeriga qo'shiladi?** ·
  Muammodan oldin · Jonli demodan keyin · Keyingi qadamdan keyin — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; tugmalar shundan keyin yoqiladi.
- Vizual (SABOQ 21): **chapda** telefon («O'yinlar») · **o'ngda** to'rt bo'lak — Muammo · Yechim · Jonli demo · Keyingi qadam (Mentor matni ixcham, burchakda ✓), ostida taymer chizig'i 0–3:00, ustida zal (pufakda «?»).
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Yangi bo'lak · 2 Halol gap · 3 Besh daqiqa
- **Harakat → Vizual o'zgarish:**
  1. «Yangi bo'lak» → Jonli demo va Keyingi qadam orasiga nomsiz bo'lak sirg'alib kiradi (accent): ichida kichik grafik — «Ro'yxatdan o'tganlar, jami», ustunlar 20 · 38 · 44 o'sib chiqadi — va qator «Haftada to'lgan o'yinlar: birinchi haftada 1, ikkinchi haftada 3» ·
     pufak shu bo'lak ustida: «Bu son qayerdan va nimani sanaydi?». Shundan keyin bo'lak nomi chiqadi: **Raqamlar** (atama — misoldan keyin), `QIzoh`: Raqamlar bo'lagida ilova ishga tushgach sanalgan sonlar ko'rsatiladi.
  2. «Halol gap» → Raqamlar bo'lagiga qator yoziladi: «44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).» → pufak o'rnida ✓, bo'lak burchagida yashil ✓.
  3. «Besh daqiqa» → taymer chizig'i 3:00 dan 5:00 gacha uzayadi va besh bo'lakka bo'linadi: ≈40 s · ≈20 s · ≈1,5 daqiqa · ≈1,5 daqiqa · ≈1 daqiqa (har bo'lak ostida nomi); zal pufagi besh bo'lak ustidan birma-bir o'tib, oxirida ✓.
     `QIzoh`: Bu mashqdagi taqsimot: o'z pitchingizda bo'lak qisqaroq yoki uzunroq bo'lishi mumkin, jami 5 daqiqa.
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · haqiqatda: jonli demodan keyin» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan tugmani bosing — pitch va taymer qanday o'zgarishini ko'ring.
- Xulosa: Bizda 5 daqiqalik pitch besh bo'lakdan iborat: muammo, yechim, jonli demo, raqamlar va keyingi qadam.
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, Sahna butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: O'tgan moduldagi to'rt bo'lakka bugun Raqamlar qo'shildi. 10-Modulda besh slaydli pitchda Raqamlar slaydi bo'lgan — g'oyasi o'sha, bu darsda «slayd» so'zi yo'q.
  Raqamlar nega jonli demodan keyin: zal ilova ishlayotganini ko'rgach, uni kim ishlatayotganini so'raydi. Halol gap — 10-Modulda o'tilgan: son qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish.
  Mentorning qolgan bo'laklari matni — 10-ekran Yordam'ida va Mentor rejimida.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — uy vazifalari ilovasi, P-002)
- Eyebrow: Tekshiruv · besh bo'lak
- Savol: **Uy vazifalari ilovasi pitchi. Qaysi gap Raqamlar bo'lagiga chiqadi?** · savol ustida yorliq yo'q (SABOQ 6)
  - A — «5 sinfdoshdan 4 tasi vazifani chatda yo'qotgan»
  - B — «Keyingi haftada 2 ta sinf chatiga havola yuboramiz»
  - ✔ C — «Ishga tushgach 2 haftada 23 kishi ro'yxatdan o'tdi»
  - D — «Ilova 6 ta fanning vazifasini bir joyda ko'rsatadi»
- To'g'ri izohi: Bu son ilova ishga tushgach sanalgan — u Raqamlar bo'lagida.
- Xato izohlari: A — Bu intervyu sanog'i: u muammo borligini ko'rsatadi. · B — Bu hali bo'lmagan ish — u keyingi qadam. ·
  D — Bu ilova nima qilishi — u yechim bo'lagida. · (umumiy) Qaysi son ilova ishga tushgandan keyin sanalgan?
- Javob topilgach (QuestionScreen `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): besh bo'lak ixcham, C gap «Raqamlar» bo'lagiga uchib tushadi.
- Izoh (MD): sonlar to'rt variantning hammasida (kalit belgisi faqat to'g'rida emas, S-003); qo'shtirnoq to'rtalasida; A — muammo dalili, B — keyingi qadam, D — yechim (S-004: rost, lekin boshqa bo'lak).
  Son savolda yo'q — javobda takrorlanmaydi (S-019).

## 4 · O'sish grafigi  ← QTushuncha (ketma-ket, 4 tugma)
- Eyebrow: Tushuncha · grafik
- Sarlavha: **Ustunlar sonni qachon halol ko'rsatadi?** (39) — yangi atama sarlavhada yo'q (T-011)
- Mentor: Mentor misolining sonlaridan chizilgan grafikda kamchiliklar bor: tugmalarni birma-bir bosib, ustunlarga qarang.
- Bashorat (ballsiz; S-015 — bitta o'lchov, o'sish tartibida): **Noldan chizilsa, «44» ustuni «20» dan necha barobar baland bo'ladi?** · Ikki barobarga yaqin · Besh barobarga yaqin · O'n barobarga yaqin —
  tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (keng, ≤ 3 blok; telefon bu ekranda yo'q — SABOQ 24): **`OsishGrafigi` katta**, `buzilgan` holatda — sarlavha qatori bo'sh (uzuq chiziq); chap o'qda pastda «18», tepada «44»;
  to'rtta ustun teng oraliqda: «20» juda past, «27», «38», «44» juda baland; ustunlar ostida ham, ustida ham yozuv yo'q. Grafik ustida zal pufagi: «Bu son qayerdan va nimani sanaydi?». Kulrang yorliq «Mentor misoli sonlari · mashq: ataylab buzilgan».
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Noldan boshlang · 2 Oraliqni teng qiling · 3 Sana va sonni qo'ying · 4 Nima sanalganini yozing
- **Harakat → Vizual o'zgarish:**
  1. «Noldan boshlang» → chap o'qdagi «18» pastga «0» ga sirg'aladi, ustunlar qayta o'sib cho'ziladi: «20» ustuni «44» ning yarmidan sal pastga keladi; grafik ostida yorliq **noldan**.
  2. «Oraliqni teng qiling» → «27» ustuni kulrang bo'lib chiqib ketadi, o'rnida bir lahza yorliq «3 kun o'tib — hafta emas»; qolgan uch ustun teng oraliqda joylashadi; yorliq **teng oraliq**.
  3. «Sana va sonni qo'ying» → har ustun ostida: «ishga tushirish kuni» · «bir hafta o'tib» · «ikki hafta o'tib»; ustida son sanab o'sadi: 20 · 38 · 44; yorliq **sana va son**; ostida kulrang: Mentor misolida aniq kun o'rnida — necha hafta o'tgani; sizning grafigingizda — sana.
  4. «Nima sanalganini yozing» → sarlavha qatoriga sirg'alib yoziladi: **Ro'yxatdan o'tganlar, jami**; zal pufagi o'rnida ✓; yorliq **nima sanalgani**; ustunlar orasida ikki kichik belgi paydo bo'ladi: «+18», «+6», ostida kulrang:
     Ustun — shu kungacha jami; ustunlar farqi — o'sha haftadagi qo'shimcha: 18, keyin 6. (84)
  4/4 dan keyin grafik ostida yorliq **o'sish grafigi** paydo bo'ladi (atama — misoldan keyin), `QIzoh`: Bir xil oraliqdagi sonlar ustunlari o'sish grafigi deyiladi; nima sanalgani sarlavhada yoziladi.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: ikki barobarga yaqin» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s): Yoqilgan tugmani bosing — ustunlar qanday o'zgarishini ko'ring.
- Xulosa: Bu misolda grafik noldan va haftama-hafta chizildi: 20 dan 44 gacha o'sish ikki barobardan sal ko'p.
- Tugma (pastki): Tugmalarni bosing (N/4) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, grafik butun enga, to'rt yorliq ixcham qator bo'lib ostida qoladi.
- Keyingi bosiladigan joy: bashorat → joriy tugma (to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: 18 dan boshlangan grafikda «44» ustunining balandligi «20» nikidan o'n uch barobar ko'rinadi (26 va 2 birlik) — bu son emas, chizmaning ko'rinishi: sonning o'zi ikki barobardan sal ko'p. «O'n uch barobar o'sdi» deyilmaydi.
  Bu qoidalar — shu darsdagi ustunli grafik uchun (ustunda balandlik sonni bildiradi, shuning uchun noldan); boshqa turdagi grafiklar haqida gap yo'q. «38» — birinchi haftada kelganlar emas, shu kungacha jami: haftalik qo'shimcha — 18 va 6. «27» — Mentor misolida ishga tushganidan 3 kun keyingi son:
  u bilan oraliqlar 3, 4 va 7 kun bo'lib qoladi, o'sish bir tekis ko'rinadi. Birinchi ko'rinish mashq uchun chizilgan; Mentor pitchidagi grafik — to'rtinchi tugmadan keyingisi.
  Sinfdan so'rang: grafikdan ikkinchi hafta olib tashlansa, zal nimani ko'rmay qoladi?

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — to'garaklar sayti, P-002)
- Eyebrow: Tekshiruv · grafik
- Savol: **To'garaklar sayti grafigida ustunlar 30 dan boshlangan. Zal o'sishni qanday ko'radi?** · savol ustida yorliq yo'q
  - ✔ A — Haqiqatdagidan ancha katta
  - B — Haqiqatdagidek, o'zgarishsiz
  - C — Haqiqatdagidan ancha kichik
  - D — Ustunlar tengdek, o'sishsiz
- To'g'ri izohi: Pastki qismi kesilgan ustunlarda farq kattalashib ko'rinadi.
- Xato izohlari: B — Pastki qismi kesilsa, ustunlar nisbati o'zgaradi. · C — Kesilganda kichik ustun ko'proq qisqaradimi? · D — Ustunlar hali ham sonlarga qarab har xil. ·
  (umumiy) Grafik noldan boshlanmasa, ustunlar nisbati nima bo'ladi?
- Javob topilgach (kichik, savol ostida): ikki kichik grafik yonma-yon — «30 dan» va «noldan» (bir xil ikki ustun; sonsiz shakl, mashq uchun), ostida yorliq **noldan**.
- Izoh (MD): «Haqiqatdagi…» uch variantda (kalit so'z faqat to'g'rida emas); D — teng ko'rinish (4-ekrandagi boshqa xato emas, balki noto'g'ri tasavvur, S-004). Savoldagi «30» javobda yo'q (S-019).

## 6 · Uzum  ← QVoqea (PM keys K1, mintaqaviy; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Uzum'ning sonlari yonida nima turadi?** (37)
- Nuqtalar (3) · yorliq **Uzum · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 Mentor gapida, S-018 — tayanch 5): «Uzum — internet-magazin». Nom «Uzum» o'z rangida (binafsha — 10, 11-Modul bilan bir; TAYANCHGA SAVOL 10), logotip yo'q.
- Mentor — kadr gapini aytadi, har kadrda almashadi (≤2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket.
- Sahna (`UzumSahna`, chizilgan CSS/SVG; chapda telefon — «Uzum» ilovasi ekrani (narsa kartalari chizmasi), o'ngda vaqt chizig'i uch nuqta bilan; bankda yo'q narsa chizilmaydi — boshqa son, asoschi, narx yo'q):
  - 1/3 **2022-yil oktabr · ishga tushdi** — Mentor: Uzum — internet-magazin, u 2022-yil oktabrida ishga tushgan. Saytdan emas, yetkazib berishdan boshlagan: o'z avtoparki, topshirish punktlari, ertasi kuni yetkazish.
    · sahna: telefon ekranida «Uzum» (binafsha); vaqt chizig'ida birinchi nuqta yonadi, ostida «2022 · oktabr»; nuqta yonida kichik mashina va topshirish punkti chizmasi.
  - 2/3 **2024-yil mart · birinchi «unicorn»** — Mentor: Bahosi 1 milliard dollardan oshgan kompaniya «unicorn» deyiladi. 2024-yil martida Uzum mamlakatning birinchi «unicorn»i bo'lgan.
    · sahna: ikkinchi nuqta «2024 · mart», yorliq «unicorn»; uchinchi nuqta o'rnida kulrang «?» (sahna javobni ochmaydi — P-053 `pre` kadr).
    · bashorat (sahna ostida, bitta qator; S-015 — bitta o'lchov: vaqt oralig'i, kichikdan kattaga): **Uzum'ning 2025-yildagi «17 million» soni nimani sanaydi?** · Bir kunda foydalanganlarni · Bir oyda foydalanganlarni · Hamma yillarda foydalanganlarni —
      tanlangach ixcham qator natijagacha turadi.
  - 3/3 **2025 · oyiga ≈17 million** — Mentor: 2025-yilda Uzum'ning oyiga taxminan 17 million foydalanuvchisi bo'lgan. Bu son bir oyni sanaydi va yili bilan aytilgan.
    · sahna: uchinchi nuqta «2025», yorliq «oyiga ≈17 million foydalanuvchi»; ostida kulrang qator: Shu voqeaning soni — sizga me'yor emas.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: bir oyda foydalanganlarni» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Voqea davomi» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, kadr nomi va sahna almashadi (nuqta yonadi, yorliq sirg'alib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Bu voqeada har son yili bilan aytilgan, «17 million» esa nimani sanashi bilan — bir oyda.
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- O'qituvchi eslatmasi: Uzum voqeasi oldingi modullardan tanish (odamlar oldin Instagram va Telegram guruhlari orqali xarid qilgani ham o'sha yerda aytilgan) — bugungi savol boshqa: son yonida yili va nima sanalgani.
  Ko'prik — umumiy joy: grafigingizda ham har ustun ostida sana, sarlavhada nima sanalgani turadi. Uzum bilan o'zingizni solishtirmang: «17 million» — shu voqeaning soni, sizga me'yor emas.
  Bankdan tashqari son, sabab va kompaniya bahosining keyingi qiymatlarini qo'shmang.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K1 (171–174-qatorlar, ruscha asl — Manbalar bo'limida so'zma-so'z tarjimasi bilan) · tayanch 5 (o'zbekcha matn va brend izohlari).

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`; Uzum qoidasi — Mentor misolida)
- Eyebrow: Tekshiruv · Uzum'dagidek
- Savol: **Uzum voqeasidagidek, Mentor «44» sonini pitchda qanday aytadi?** · savol ustida yorliq yo'q
  - A — Uzum'ning soni bilan solishtirib
  - B — Ro'yxatdagi ismlarni o'qib berib
  - C — Sonni katta shriftda ko'rsatib
  - ✔ D — Qachon va nimani sanashini aytib
- To'g'ri izohi: Uzum'ning sonlari ham yili va nimani sanashi bilan aytilgan.
- Xato izohlari: A — Uzum'ning soni — shu voqeaniki, sizga me'yor emas. · B — Pitchda ism aytilmaydi — zal sonni tushunishi kerak. · C — Katta shrift sonni tushuntirmaydi. ·
  (umumiy) Uzum'ning sonlari yonida nima turgan edi?
- Javob topilgach (kichik, savol ostida): Mentor grafigi ixcham — «44» ustida, ostida «ikki hafta o'tib», tepada «Ro'yxatdan o'tganlar, jami».
- Izoh (MD): har variant «…-ib» shaklida (3-vs-1 shakl yo'q); «son» A va C da, «Uzum» A da — kalit so'z faqat to'g'rida emas. B — xavfsizlik (sinf 14), A — keys soni me'yor emas (sinf 9).

## 8 · Jonli demo  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · jonli demo
- Sarlavha: **Ekran o'zi yangilanishini zal qanday ko'radi?** (45)
- Mentor: Tugmalarni birma-bir bosing va zal nimani ko'rishiga qarang.
- Bashorat (ballsiz; S-015 — o'sish tartibida): **Ekran o'zi yangilanishini ko'rsatish uchun nechta qurilma kerak?** · Bitta · Ikkita · Uchta — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (jonli demo rejimi, tayanch 9.16): **chapda** «1-telefon · siz» — «O'yin» ekrani: «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shilaman»; **o'rtada** Backend (ichida «Database: 8»);
  **o'ngda** ikkinchi qurilma o'rni — uzuq chiziqli ramka (U-041), hali bo'sh. Ustida zal, pufakda «?». Taymer va bo'laklar bu ekranda yo'q (≤ 3 blok: sahna · tugmalar · bashorat).
- Tugmalar (ixcham, bir qatorda): 1 Bitta telefonda · 2 Ikkinchi qurilma · 3 Zaxira yo'li
- **Harakat → Vizual o'zgarish:**
  1. «Bitta telefonda» → 1-telefonda «Qo'shilaman» bosiladi: shu telefonda «9 / 10», tugma «Qo'shildingiz»; konvert Backend'ga boradi, «Database: 9»; zal pufagi: «Boshqalarda ham o'zgardimi?».
     `QIzoh`: Bitta telefonda zal siz bosgan tugmani ko'radi — ekran o'zi yangilanganini emas.
  2. «Ikkinchi qurilma» → o'ngda «2-telefon · boshqa o'yinchi» paydo bo'ladi (o'sha o'yin, «8 / 10»); 1-telefon qaytadan «8 / 10» bilan (o'yindan chiqilgan, ekran ortida); «Qo'shilaman» →
     konvert 1-telefondan Backend'ga, Backend'dan 2-telefonga uchadi → 2-telefonda «8 / 10» o'rniga «9 / 10» chiqadi (son bir lahza kattalashadi), pastga tortilmagan; pufak o'rnida ✓.
     `QIzoh`: 2-telefonda son pastga tortmasdan, odatda bir necha soniyada o'zgaradi — zal real vaqtni shunda ko'radi.
  3. «Zaxira yo'li» → 2-telefon o'rnida uch kichik karta navbat bilan: «sherik telefoni» · «brauzer ko'rinishi» · «ekran videosi»; ostida bir qator:
     Ilova ochilmasa — ekran videosini ko'rsating yoki jonli demoni og'zaki aytib bering.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: ikkita» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s): Yoqilgan tugmani bosing — qaysi qurilmada nima o'zgarishini ko'ring.
- Xulosa: Bu misolda jonli demo ikki qurilmada: birida bosiladi, ikkinchisida son o'zi o'zgaradi.
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, ikki telefon va Backend butun enga.
- Keyingi bosiladigan joy: bashorat → joriy tugma → «Davom etish».
- O'qituvchi eslatmasi: Ikkinchi qurilma — ilovaga **boshqa akkaunt** bilan kirgan qurilma: sherigingizning telefoni (o'z akkaunti bilan) yoki laptopdagi brauzer ko'rinishi (namuna akkaunt bilan — u sanoqqa kirmaydi). Akkaunt ma'lumotini boshqaga bermang.
  Kirmagan odamning ekrani (mehmon ko'rinishi) o'zi yangilanmaydi — ulanish faqat kirganlarga. Web-trekda: ikkinchi ekran — telefon brauzeri yoki inkognito oyna, boshqa akkaunt bilan.
  Pitchdan 2–3 daqiqa oldin ikkala qurilmada ilovani oching: bepul Backend uxlab qolgan bo'lsa, uyg'onishi bir daqiqagacha; «O'yinlar» ekranida belgi «Ulangan» bo'lsin.
  **Demo o'yini (12-FILTR 22, 23):** repetitsiya real odamlar qo'shilmagan o'yinda qilinadi — real o'yinchilari bor o'yinda har bosish ularga jonli xabar yuboradi va sonni chalg'itadi. Mentor misolida — namuna o'yin «Shanba, 18:00»; o'quvchi demo uchun alohida o'yin e'lon qilishi mumkin.
  Demodan keyin 1-telefonda (shu akkaunt egasi) «O'yindan chiqish» ni bosing — son avvalgi holatiga qaytadi, keyingi repetitsiya ham shundan boshlanadi. Namuna akkaunt sanoqqa kirmaydi (`namuna = true`).
  Ekran o'zi yangilanishi o'quvchi mahsulotida hali ishlamasa — jonli demo bitta telefonda ko'rsatiladi va bu halol aytiladi.

## 9 · Kod yozish: o'sish grafigi  ← QKod (kod oynasi — `HtmlCompiler`, JS; tayanch 4, Qaror-0 20; ≈12 daqiqa)
- Eyebrow: Kod yozish · grafik
- Sarlavha: **Sonlardan o'sish grafigini chizadigan kod yozamiz.** (50) — PM-082(a) sarlavha oilasi (korpus §19)
- Mentor: Kod tepasidagi ro'yxatda haftalik sonlaringiz turibdi: bo'sh joylarni to'ldiring, ustunlar shu sonlardan chiziladi.
  (Ro'yxatda Mentor misoli bo'lsa: Kod tepasidagi ro'yxatda Mentor misolining sonlari turibdi: bo'sh joylarni to'ldiring, keyin ularni o'z haftalik sonlaringizga almashtiring.)
- Darvoza-mashq (ballsiz, kod oldidan; PM-082 c/e): **Qaysi qator ustunni noldan chizadi?** · ✔ `h.soni / engKatta * BALANDLIK` · `(h.soni - engKichik) * 10` · `BALANDLIK / haftalar.length`
  - xato «engKichik»: Eng kichik ustun nolga tushib qoladi — bu noldan emas.
  - xato «haftalar.length»: Hamma ustun bir xil bo'ladi — son ko'rinmaydi.
  Tanlov yonida kichik grafik shu formula bilan qayta chiziladi (engKichik — birinchi ustun yo'qoladi; `length` — hamma ustun teng).
- Chap (vazifa, 3 band; bosiladigan katakcha emas — vazifa ro'yxati):
  1 Sarlavhaga nima sanalganini yozing.
  2 Ustun balandligini noldan hisoblang.
  3 Har ustun ustiga sonini, ostiga sanasini qo'ying.
- Yordam: Ustun balandligi — son eng katta songa bo'linib, `BALANDLIK` ga ko'paytiriladi: eng katta son eng baland ustun bo'ladi. Son va sana `h` ichida: `h.soni`, `h.sana`.
  Eslatma (oldingi kod oynalaridan): `forEach` — ro'yxatdagi har element uchun bir marta ishlaydi · `textContent` — elementga matn yozadi · `style.height` — element balandligi.
  O'z sonlaringiz qayerdan: metrika hisobotidagi kunlar bo'yicha sanoq (dars uni haftalik jamiga aylantirib qo'ygan); yangi hafta o'tgan bo'lsa — o'sha so'rovni Neon'da qayta «Run» qiling yoki sanoq sahifasidagi ro'yxatdan o'tganlar sonini oling.
  Ikki hafta nuqtasi hali yo'q bo'lsa — sonlarni o'ylab topmang va oraliqni sun'iy tenglashtirmang: Mentor sonlari bilan chizing va pastdagi «Grafikka nuqta yetmaydi»ni bosing.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `index.html` · `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijani shu yerda ko'rasiz.
  Kod nusxalanmaydi (PM-082 d).
- Kod — `app.js` (ro'yxat qismi — o'quvchining sonlari bo'lsa ularniki, KOD 8; quyida Mentor misoli):
```js
// Grafik ma'lumoti: har hafta — shu kungacha jami (Mentor misoli)
const haftalar = [
  { sana: "ishga tushirish kuni", soni: 20 },
  { sana: "bir hafta o'tib", soni: 38 },
  { sana: "ikki hafta o'tib", soni: 44 }
];
const sarlavha = "";      // shu joyni siz yozasiz: nima sanalgani
const BALANDLIK = 160;    // eng baland ustun, piksel

// eng katta son — noldan boshlab qidiramiz (bu qism tayyor)
let engKatta = 0;
haftalar.forEach(function (h) {
  if (h.soni > engKatta) engKatta = h.soni;
});

document.getElementById("sarlavha").textContent = sarlavha;

// har hafta — bitta ustun
haftalar.forEach(function (h) {
  const ustun = document.createElement("div");
  ustun.className = "ustun";
  ustun.style.height = 0 + "px";   // shu joyni siz yozasiz: noldan

  const son = document.createElement("b");
  son.textContent = "";            // shu joyni siz yozasiz: ustida — son

  const sana = document.createElement("span");
  sana.textContent = "";           // shu joyni siz yozasiz: ostida — sana

  const joy = document.createElement("div");
  joy.className = "joy";
  joy.appendChild(son);
  joy.appendChild(ustun);
  joy.appendChild(sana);
  document.getElementById("grafik").appendChild(joy);
});
```
- `index.html` (tayyor, o'zgartirilmaydi): `<h3 id="sarlavha"></h3>` · `<div id="grafik"></div>` · `<script src="app.js"></script>`. Ustunlar, son va sana ko'rinishi — dars CSS i (`previewCss`; KOD 8).
- Kod oynasi sarlavhasi: `app.js — o'sish grafigini yakunlang` · placeholder: `// bo'sh joylar: sarlavha, balandlik, son, sana`
- Shartlar (natija oynasidagi grafikdan tekshiriladi; xabarlar ≤60):
  1 — Sarlavhaga grafikda nima sanalganini yozing.
  2 — Ustun balandligi songa mos bo'lsin: noldan.
  3 — Har ustun ustida son, ostida sana tursin.
- **Harakat → Vizual o'zgarish:** darvozada tanlov → yonidagi kichik grafik shu formula bilan qayta chiziladi; kod ishga tushganda natija oynasida ustunlar pastdan o'sib chiqadi, ustida son, ostida sana yoziladi, shartlar birma-bir ✓;
  «Bajardim» → grafik kod oynasidan Sahnaning Raqamlar bo'lagiga uchib tushadi (P-046 — o'quvchining sonlari).
- Tugmalar: **Bajardim — grafik chizildi** (qulf: darvoza yechilmagan bo'lsa — «Avval ustun savolini yeching»; shartlar ✓ bo'lmasa — «Avval uchala shartni bajaring») ·
  ikkinchi (chegarali): **Grafikka nuqta yetmaydi** → grafik saqlanmaydi, nishon yo'q, «Davom etish» ochiladi (P-026: dars bitta tashqi bog'liqlikka osilmaydi). Avvalgi nomi «Sonlarim hali yo'q» edi — o'quvchida son bor, faqat o'sishni ko'rsatadigan ikki nuqta yo'q (12-FILTR 7).
  Bosilganda kulrang qator: Bitta son ham yetadi: uni Raqamlar bo'lagida sanasi va manbasi bilan aytasiz. (77)
- Hammasi bajarilgach (yashil): Grafik tayyor — u Raqamlar bo'lagiga qo'yildi.
- Nishon: Growth Chart! (darvoza birinchi urinishda + «Bajardim»; ro'yxatdagi sonlar Mentor sonlaridan farqli bo'lsa).
- O'qituvchi eslatmasi: Ko'p uchraydigan xato — balandlikni songa emas, farqqa qarab hisoblash: eng kichik ustun yo'qolib qoladi. Grafikdagi sonlar — ro'yxatdan o'tganlar, namuna va tekshiruv akkauntlarisiz
  (metrika hisobotidagi kunlar bo'yicha SQL dagidek, `WHERE namuna = false`). Oxirgi ustundan 7 kun o'tgan o'quvchi yangi hafta ustunini qo'shishi mumkin: jami son — sanoq sahifasidagi ro'yxatdan o'tganlar
  yoki Neon SQL Editor'da `SELECT COUNT(*) FROM oyinchilar WHERE namuna = false;` («Run»). 7 kun to'lmagan bo'lsa — ustun qo'shilmaydi (oraliq teng emas), bugungi son halol gapda aytiladi.
  Sonlar kichik bo'lsa ham — o'quvchining o'z soni; 50 — baho emas. Bir haftadan kam ishlagan mahsulotga grafik chizdirmang: bitta ustun o'sishni ko'rsatmaydi, sun'iy oraliq esa qoidani buzadi — grafiksiz pitch ham to'liq pitch.

## 10 · Pitch yozish  ← QMustaqil (USTAXONA — ketma-ket karta, 5 bo'lak; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Pitchingizni besh bo'lakka yozing.** (34)
- Mentor: Tuzatilgan pitchingiz va grafigingiz shu yerda: har bo'lakni tekshirib, «Saqlash»ni bosing.
- Kirish (P-046; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlash mumkin; yo'q bo'lsa — bo'sh, o'quvchi o'zi yozadi):
  - `pm-m10d11-pitch.bolaklar` (tuzatilgan pitchning yakuniy matni — 12-dars uni qayta yig'maydi; tayanch 9.43 d) → Muammo gapi · Yechim gapi · Jonli demo («1-qurilmada» ga telefondagi harakat) · Keyingi qadam — oldindan qo'yiladi, tahrirlanadi.
    `davolar` dan: Muammo da'vosining `dalil` i → «Dalil» maydoniga («{son yoki yozuv} · {manba} · {qachon}»; `dalil: { son, yozuv, manba, qachon }`) ·
    Jonli demo bo'lagidagi sonli da'volar (dalili bilan; `qaror` — `qoldi` yoki `qayta-yozildi`) → Raqamlar kartasi ostida kulrang ro'yxat «Zal so'rasa — javobingiz tayyor: {gap} · {dalil}» — bo'lakka kirmaydi (Mentor misolida ham shunday: 38 va 19, 46 dan 17 — zaxira javob).
  - `pm-m10d10-hisobot.tuzatishQator` — `'bosh'` yoki `'royxat'` bo'lsa, shu son oldindan qo'yilmaydi; o'rnida kulrang: Metrika hisobotida bu son «tuzatish» olgan — tuzatilgan sonni yozing. (tayanch 9.43 i)
  - `pm-m10d1-lending.foydalar` → Yechim maydoni ustida uch tugma (foyda matni); bosilgani yechim gapidan keyin qo'shiladi — o'quvchi 1–3 tasini tanlaydi (≈20 soniyaga sig'ishi uchun; 12-FILTR 11).
  - 9-ekran grafigi → Raqamlar «Grafik» (ixcham, sarlavhasi bilan; ✎ — har qatorda sana va son tahrirlanadi). «Grafikka nuqta yetmaydi» bo'lsa — grafik o'rnida maydon «Bor soningiz» va kulrang qator: Grafik yo'q — bor soningizni, sanasini va u qayerdan olinganini yozing.
  - `pm-m10d10-hisobot.bosh` → «Bosh raqam»: «{nima}: {soni} ({sana})» · `royxat` → «Halol gap» ustida kulrang qator: Hisobotingizda: {soni} kishidan {sinfdosh} tasi — sinfdosh.
  - `pm-m10d10-hisobot.zaxira.ish` → Keyingi qadam ustida tugma (zaxira rejangizdagi ish); `pm-m10d11-pitch` dagi keyingi qadam da'vosi — ikkinchi tugma.
- **Tepada — ixcham chiziq «Pitchim · n/5»:** bo'lak nomlari, yozilgani ✓ (bo'sh uzuq qatorlar yo'q, SABOQ 17).
- **Markazda — bitta katta bo'lak kartasi (joriy; bo'lak tugmalari 1–5: Muammo · Yechim · Jonli demo · Raqamlar · Keyingi qadam — joriysi accent, yozilgani ✓):**
  1. **Muammo** — «Muammo gapi» (placeholder: `Kim nimadan qiynaladi?`) · «Dalil» (placeholder: `Son yoki kuzatuv — qayerdan?`)
  2. **Yechim** — «Yechim» (placeholder: `Mahsulot nima qiladi va odamga nima beradi?`) — ustida lending foydalari tugmalari
  3. **Jonli demo** — «1-qurilmada» (placeholder: `Qaysi tugmani bosasiz?`) · «2-qurilmada» (placeholder: `Nima o'zi o'zgaradi?`)
  4. **Raqamlar** — «Grafik» (9-ekrandan) · «Bosh raqam» (placeholder: `Nima sanaladi va qancha?`) · «Halol gap» (placeholder: `Qanday sanaldi, xulosaga yetadimi?`)
  5. **Keyingi qadam** — maydon (placeholder: `Keyingi haftada nima qilasiz?`) · ustida tugmalar (zaxira reja va tuzatilgan pitchdan)
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; yo'naltiruvchilari ikkinchi «Saqlash» bilan o'tadi):
  - Dalil bo'sh (yo'naltiradi): Muammo borligini nima ko'rsatadi? Son yoki kuzatuv yozing. (58) — dalilda raqam talab qilinmaydi: intervyu yoki sinovdagi kuzatuv ham dalil (11-darsdagi model; 12-FILTR 1)
  - Yechimda texnologiya nomlari — «React», «Expo», «NestJS», «Neon», «Render», «Netlify», «socket.io» (yo'naltiradi): Bu texnologiya — mahsulot odamga nima beradi?
  - «2-qurilmada» bo'sh (bloklaydi): Ikkinchi qurilmada nima o'zgarishini yozing.
  - Halol gap bo'sh (bloklaydi): Halol gap: son qanday sanaldi, xulosaga yetadimi?
  - Halol gapda «sinfdosh» so'zi yo'q, hisobotda `sinfdosh` > 0 (yo'naltiradi): Sinfdoshlar ham sanalgan — buni halol gapda ayting.
  - Halol gap yoki keyingi qadamda va'da so'zlari — «tez orada», «albatta», «yetamiz», «aniq bo'ladi» (yo'naltiradi): Bu va'da — keyingi haftada aynan nima qilasiz?
  - Keyingi qadam bo'sh (bloklaydi): Keyingi haftadagi bitta ishni yozing.
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (bo'lakka qarab bitta qator — Mentor misolidan, A-6 jadvali):
  1 — Mentor misolida: «O'yinchilar jamoaga odam yig'ishda qiynaladi.» Dalil: «Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» (intervyu yozuvlari).
  2 — Mentor misolida: «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» va lendingdagi foydalar: «Bir bosishda jamoadasiz», «Nechta odam yig'ilganini so'rab o'tirmaysiz», «Kim aniq kelishini o'yindan oldin bilasiz».
  3 — Mentor misolida: 1-telefonda «Shanba, 18:00» o'yinida «Qo'shilaman» bosiladi, 2-telefonda «8 / 10» o'rniga «9 / 10» o'zi chiqadi.
  4 — Mentor misolida: grafik «Ro'yxatdan o'tganlar, jami» — 20, 38, 44; bosh raqam — haftada to'lgan o'yinlar: birinchi haftada 1, ikkinchi haftada 3; halol gap — «44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).» Sonlarni o'zini ayting: «uch barobar oshdi» emas — «1 ta edi, 3 ta bo'ldi».
  5 — Mentor misolida: «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.»
  Sonlaringiz kichik bo'lsa ham — o'zingizniki: o'ylab topilmaydi. 50 — baho emas. Web-trekda ham shunday: ikkinchi qurilma — boshqa brauzer oynasi.
- **Harakat → Vizual o'zgarish:** foyda yoki reja tugmasi → matn maydonga sirg'alib yoziladi. «Saqlash» → karta kichrayib tepadagi chiziqqa uchadi (bo'lak nomi yonida ~1 s yashil ✓), pastdan keyingi bo'lak kartasi kiradi;
  tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 5/5 da karta yopiladi; Sahna butun enga — besh bo'lak o'quvchi matni bilan, Raqamlar bo'lagida grafik (uzun matn «…» bilan qisqaradi, karta cho'zilmaydi — SABOQ 29), har bo'lakda ✎.
- Xulosa (o'quvchi ma'lumotidan, P-046): Besh bo'lak tayyor: Raqamlar bo'lagida grafik va halol gap bor. · grafik yo'q bo'lsa: Besh bo'lak tayyor — Raqamlar bo'lagida bor soningiz va halol gap.
- Tugma (pastki): Besh bo'lakni yozing (N/5) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → foyda yoki reja tugmalari (2, 5-bo'lakda) → «Saqlash» (maydon yozilgach halqada).
- Artefakt-strip (U-042): shu ekrandan — «Pitchim · n/5» (ixcham); 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: Five Parts! (5/5 saqlanganda).
- Mentor rejimi: forma o'rniga «Maydon Jamoa» pitchi (besh bo'lak, ochiq, A-6 jadvali); o'quvchilar o'z ekranida yozadi. Mentor statistikasi: «Besh bo'lakni yozganlar» · «Halol gapi borlar».
- O'qituvchi eslatmasi: 12 daqiqa. Eng ko'p xato — Raqamlar bo'lagini sonlar ro'yxatiga aylantirish: bitta grafik, bitta bosh raqam, bitta halol gap yetadi.
  Zal «ishlatyaptimi?» desa — Mentor misolida asosiy harakatni qilganlar 8 · 19 · 24 (44 kishidan 24 tasi hozir kamida bitta o'yinda qatnashyapti yoki o'yin e'lon qilgan); «qaytib kelyaptimi?» desa — birinchi haftada ochgan 61 qurilmadan 26 tasi ikkinchi haftada ham ochdi (43%).
  Bu sonlar bo'lakka shart emas — zal savoliga javob. Mentor bosh raqami — 1 va 3 ta o'yin: kichik son, o'sish bor, lekin isbot emas; «uch barobar oshdi» deb aytilmaydi — ikki son o'z holicha.
  Muammo dalili: «men so'ragan 5 o'yinchidan 4 tasi» — hamma o'yinchi haqida isbot emas, shu besh kishining javobi; shunday aytilsa — halol. Yechim: 20 soniyaga yechim gapi va 1–3 foyda sig'adi; uchalasi shart emas.
  Keyingi qadam: havolani tashkilotchining o'zi, o'z jamoasiga ulashadi — ilova hech kimga o'zi yubormaydi; guruhga yozish — 6-darsdagi qoidalar bilan (egasidan ruxsat).

## 11 · Juftlikda pitch  ← QMustaqil (juftlik, 3 tugma; yakka rejim bor)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Pitchingizni sherigingizga 5 daqiqada ayta olasizmi?** (52) · yakka rejimda: **Pitchingizni 5 daqiqada ayta olasizmi?** (38)
- Mentor: Ikki qurilmada ilovani ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, sherigingizga ayting.
  Yakka rejimda: Ikki qurilmada ilovani ochib qo'ying, keyin «5 daqiqani boshlash»ni bosib, pitchni ovoz chiqarib ayting.
- Tugmalar (ixcham, tepada): 1 Ayting · 2 Baholang · 3 Tuzating (varaqda beshta ✓ bo'lsa — «3 Aniqlashtiring»)
- 1-tugma:
  - «Pitchdan oldin» — bitta kulrang blok, to'rt qator (bosilmaydi, katakchasiz — korpus §19):
    Ikki qurilmada ilova ochiq, ikkinchisida — boshqa akkaunt; «O'yinlar» ekranida belgi «Ulangan». · Demo uchun real odamlar qo'shilmagan o'yinni tanlang; demodan keyin «O'yindan chiqish». · Web-trekda: ikkinchi oyna — boshqa brauzer yoki telefon brauzeri. · Laptopda Neon, sanoq sahifasi va `.env` yopiq — ekran zalga ko'rinadi.
  - Taymer (har o'quvchi o'z navbatida, o'z dars qurilmasida): 5 daqiqani boshlash · Hozir siz gapirasiz · To'xtatish · Qaytadan. 5:00 dan keyin taymer to'xtamaydi — qizil «+m:ss».
    Taymer yurganda joriy bo'lak Sahnada ochiq: Raqamlar bo'lagida grafik kattalashadi — zal uni dars qurilmangizda ko'radi. Juftlik yo'rig'i (bir qator): Avval A gapiradi, B tinglaydi; keyin almashasiz.
  - Ilova ochilmasa (bitta kulrang qator, P-026): Ilova ochilmasa — ekran videosini ko'rsating yoki jonli demoni og'zaki aytib bering.
- 2-tugma — baholash varag'i (sherik to'ldiradi, gapiruvchining dars qurilmasida): besh qator — bo'lak nomi · zal savoli (`ZAL_SAVOL`) · ✓ / ✗ · izoh (placeholder: `Nima yetishmadi?`); pastda «Vaqt: m:ss» — taymerdan o'zi yoziladi.
  Mentor gapi 2-tugmada (almashadi): Gap tugagach, dars ochiq turgan qurilmangizni sherigingizga bering — u har bo'lakka ✓ yoki ✗ qo'yadi.
- 3-tugma — tuzatish: ✗ olgan qatorni bosish → shu bo'lak kartasi (10-ekrandagi matn bilan) ochiladi → o'zgartirib «Saqlash». Hammasi ✓ bo'lsa — sherik «yanada aniqroq bo'lishi mumkin» deb yozgan bo'lak ochiladi; bu «tuzatish» deb atalmaydi — tugma va Mentor gapi «aniqlashtirish» deydi (yo'q kamchilik o'ylab topilmaydi — 12-FILTR 31).
  Mentor gapi 3-tugmada: ✗ olgan bo'lakni varaqdagi izohga qarab qayta yozing. · beshta ✓ bo'lsa: Sherigingiz tanlagan bo'lakni yanada aniqroq qilib yozing.
- Tekshiruv (`QXato`, ≤60):
  - belgisiz qator (bloklaydi): Har bo'lakka ✓ yoki ✗ qo'ying.
  - ✗ qatorida izoh 8 belgidan qisqa (bloklaydi): ✗ qo'ydingiz — nima yetishmaganini bir qatorda yozing.
  - beshta ✓ (yo'naltiradi): Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?
  - izohda «yomon», «zerikarli», «yoqmadi» (yo'naltiradi): Odam haqida emas — bo'lakda nima yetishmadi?
  - tuzatishda matn o'zgarmagan (bloklaydi): Matn o'zgarmadi — varaqdagi izohni qayta o'qing.
- Vaqt qatori (`QIzoh`, faqat «Vaqt» 5:00 dan oshgan bo'lsa): Vaqt 5 daqiqadan oshdi — har bo'lakdan bitta ortiqcha gapni oling.
- Vizual: Sahna — o'quvchining besh bo'lagi (10-ekrandan, ixcham) va taymer chizig'i (besh bo'lakli); 2–3-tugmada o'ngda varaq. Telefon maketi yo'q — ilova o'quvchining qo'lida (SABOQ 20: bo'sh ustun yo'q).
  10-ekran yozilmagan bo'lsa (mentor rejimi) — «Maydon Jamoa» pitchi.
- **Harakat → Vizual o'zgarish:** taymer → chiziq to'lib boradi, joriy bo'lak accent (Raqamlar — grafik kattalashadi); 5:00 dan oshsa chiziq qizil davom etadi. Varaq to'ldirilganda ✓ bo'laklar yashil ✓, ✗ bo'laklar `err` chet oladi;
  «Vaqt» qatori taymer ko'rsatgan vaqtni yozadi. «Saqlash» → bo'lak `err` chetdan neytral chetga o'tadi, ustida yorliq «o'zgartirildi»; varaq qatorida ✗ yonida «o'zgartirildi» (✗ o'chmaydi: sherik qayta baholamagan — «endi yaxshi» degan da'vo yo'q; 12-FILTR 32). Kamida bitta bo'lak o'zgartirilgach «Davom etish» ochiladi (qolgan ✗ — bloklamaydi).
- Xulosa: Varaq to'ldi va bitta bo'lak o'zgartirildi. Qolgan ✗ bo'laklar — uyga vazifada.
- Tugmalar: Orqaga · Davom etish (bitta bo'lak o'zgartirilgach)
- Saqlanadi: `pm-m10d12-pitch` (vaqt, varaq, tuzatildi, varaq turi — TAYANCHGA SAVOL 5).
- Keyingi bosiladigan joy: «5 daqiqani boshlash» → «To'xtatish» → varaq qatorlari (✓ / ✗) → ✗ qator → «Saqlash».
- Nishonlar: Live Pitch! (taymer to'xtatilib, varaq to'lganda) · Part Fixed! (birinchi o'zgartirilgan bo'lakda).
- Mentor rejimi: proyektorda katta taymer 5:00 va besh bo'lakli chiziq — ko'ngilli zal oldida aytadi; ikkinchi qurilma — Mentorning laptopidagi brauzer ko'rinishi (namuna akkaunt); zal har bo'lakka qo'l ko'tarib ✓ yoki ✗ beradi, Mentor varaqni ekranda to'ldiradi.
  Mentor statistikasi: «Pitchni aytganlar» · «5 daqiqaga sig'ganlar» · «Bo'lak tuzatganlar».
- O'qituvchi eslatmasi: Taymerni sinf bo'ylab bir vaqtda boshlating: avval hamma A, keyin hamma B (2 × 5 daqiqa + varaq ≈ 13 daqiqa, tuzatish ≈ 5). Vaqt qolsa — 1–2 ko'ngilli guruh oldida, Mentor rejimida (90 daqiqa hisobida yo'q).
  Tinglovchi bo'lak haqida yozadi, odam haqida emas (qattiq, lekin hurmatli fidbek). Raqamlar bo'lagida tinglovchi zal savolini ovoz chiqarib bersin: «Bu son qayerdan va nimani sanaydi?».
  Jonli demo uchun ikkinchi qurilma sherikning telefoni bo'lsa — u o'z akkaunti bilan kiradi; demo real odamlar qo'shilmagan o'yinda; demodan keyin 1-telefonda «O'yindan chiqish».
  Bepul Backend uyg'onishini taymerdan oldin kuting: avval hamma ilovani ochadi va belgi «Ulangan» bo'lishini ko'radi, keyin «5 daqiqani boshlash». 12–15 o'quvchi bir vaqtda ochganda sinf tarmog'i ham sekinlashishi mumkin — pilotda ko'riladi.

## 12 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; ikki qoida birga — grafik qoidalari va halol gap; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Grafigingizda ikkinchi hafta o'sish sekinlashdi. Pitchda nima qilasiz?** · savol ustida yorliq yo'q
  - A — Ikkinchi hafta ustunini grafikdan olib tashlaysiz
  - ✔ B — Sekinlashganini aytib, keyingi qadamga o'tasiz
  - C — Ustunlarni birinchi haftadagi sondan boshlaysiz
  - D — Sekinlashuvni aytmay, eng baland ustunni ko'rsatasiz
- To'g'ri izohi: Sekinlashuv yashirilmaydi — keyingi ishingizni aytasiz.
- Xato izohlari: A — Ustun olinsa, oraliqlar teng bo'lmay qoladi. · C — Noldan boshlanmasa, o'sish katta ko'rinadi. · D — Grafik to'g'ri qoladi — halol gap nima deyishi kerak edi? ·
  (umumiy) Grafik qoidalari va halol gapni eslang.
- Javob topilgach (kichik, savol ostida): Mentor grafigi (20 · 38 · 44) va ostida halol gap qatori «…ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).»
- Izoh (MD): A, C — 4-ekrandagi qoidalarga zid (teng oraliq · noldan); **D — grafikka tegmaydi, lekin halollikni buzadi** (12-FILTR 28: avval uchala noto'g'ri variant «grafikni buzadi» turkumida edi — to'g'ri javob ma'no bilan emas, turkum bilan topilardi); B — halol gap va keyingi qadam (2, 10-ekranlar).
  To'rttasi bir shaklda («…-asiz»); «ustun» A, C, D da, «sekinlash-» B va D da — kalit so'z faqat to'g'rida emas. To'g'ri izohi sabab da'vosisiz («keyingi qadam shundan» edi — 12-FILTR 29).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Raqamlar qaysi bo'lakda · 2 — Grafik noldan · 3 — Son yonida nima · 4 — Sekinlashuv va halol gap

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Bizda 5 daqiqalik pitch qaysi besh bo'lakdan iborat? | Muammo, yechim, jonli demo, raqamlar va keyingi qadam |
| Raqamlar bo'lagi pitchning qayerida turadi? | Jonli demodan keyin, keyingi qadamdan oldin |
| Raqamlar bo'lagida zal qaysi savolni beradi? | «Bu son qayerdan va nimani sanaydi?» |
| O'sish grafigi nima? | Bir xil oraliqdagi sonlar ustunlari; nima sanalgani sarlavhada yoziladi |
| Nega ustunli grafik noldan boshlanadi? | Shunda o'sish haqiqatdagidek ko'rinadi: Mentor misolida 44 ustuni 20 dan ikki barobardan sal baland |
| Mentor grafigidan «3 kun o'tib» ustuni nega olindi? | Oraliqlar teng bo'lishi uchun: har ustun — bir hafta |
| Grafik ustunining ustida va ostida nima turadi? | Ustida — son, ostida — sana |
| Mentor misolida halol gap nima deydi? | «44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi» |
| Uzum'ning «17 million» soni nimani sanaydi? | 2025-yilda bir oyda foydalanganlarni; bu son sizga me'yor emas |
| Uzum qachon mamlakatning birinchi «unicorn»i bo'lgan? | 2024-yil martida |
| Jonli demoda nega ikkita qurilma kerak? | Birida bosiladi, ikkinchisida son o'zi o'zgaradi — zal real vaqtni shunda ko'radi |
| Ilova ochilmasa, jonli demoni qanday ko'rsatasiz? | Ekran videosini ko'rsatasiz yoki og'zaki aytib berasiz |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (besh bo'lak, o'rni, zal savoli — 2 · o'sish grafigi, noldan, «3 kun o'tib», ustida/ostida — 4 · halol gap — 2 · Uzum, «17 million», «unicorn» — 6 · ikki qurilma, ekran videosi — 8).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab — sinf 1; belgi ✓ va nishon faqat birinchisida; o'quvchi qilgan ishni aytadi):
  - varaq to'ldi va kamida bitta bo'lak o'zgartirildi (11-ekran tugadi): **Pitchingiz grafik bilan aytildi va baholandi.** (45) · grafik saqlanmagan bo'lsa («Grafikka nuqta yetmaydi»): **Pitchingiz sonlaringiz bilan aytildi va baholandi.** (50) — grafiksiz pitch ham to'liq natija (12-FILTR 8)
  - besh bo'lak yozildi (10-ekran 5/5), 11-ekran tugamagan: **Pitchingiz besh bo'lakka yozildi — aytish qoldi.** (48)
  - grafik bor (9-ekran «Bajardim»), bo'laklar 5/5 dan kam: **Grafik tayyor — pitchning qolgan bo'laklari qoldi.** (50)
  - grafik yo'q va bo'laklar 5/5 dan kam: **Pitch boshlandi — qolgan bo'laklarni tugating.** (46)
  Sarlavha ostida bitta chip (varaq turi): «Varaq: sherik to'ldirdi» · «Varaq: o'zingiz — mashq» · «Varaq: qoldi».
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- **[07.10: yakunda KO'RSATILMAYDI — SABOQ E 50 (foydalanuvchi tasdig'i); fikr darsning ichki o'qi bo'lib qoladi]** Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Zal sonni ustunlarda ko'radi: noldan, haftama-hafta, sanasi va nima sanalgani bilan — yonida bitta halol gap.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Bizda 5 daqiqalik pitch besh bo'lakdan iborat: raqamlar jonli demodan keyin turadi.
  - O'sish grafigida ustun ostida sana, ustida son, sarlavhada esa nima sanalgani turadi.
  - Halol gap sinfdoshlarni va sekinlashuvni ochiq aytadi.
  - Jonli demo ikki qurilmada: birida bosiladi, ikkinchisida son o'zi o'zgaradi.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: oila a'zosi yoki do'stingiz · Nechta: 1 repetitsiya · Muddat: keyingi darsgacha
  - ① Pitchni bir kishiga 5 daqiqada, taymer bilan ayting. Jonli demoni ikki qurilmada ko'rsating; ikkinchisi bo'lmasa — ekran videosini.
  - ② Undan varaqdagi besh savolni so'rang va qolgan ✗ bo'laklarni tuzating.
  - ③ Oxirgi ustundan 7 kun o'tgan bo'lsa — grafikka yangi haftaning jami sonini qo'shing va halol gapni yangilang. Sonni metrika hisobotidagi yo'l bilan oling: o'sha so'rov yoki sanoq sahifasi.
  - Karta ostida (bitta kulrang qator): Tinglovchi topilmasa — pitchni telefonga yozib oling va varaqni o'zingiz to'ldiring. Tinglovchini ilovada ro'yxatdan o'tishga undamang.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Zaxira dars»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · varaq chipi · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Kim bilan» — HwCard yorlig'i. Muddat «keyingi darsgacha» — «Zaxira dars» nomi faqat «Keyingi dars» qatorida (T-038). ① — uyda ikkinchi telefon talab qilinmaydi: ikkinchi qurilma — laptopdagi brauzer oynasi, boshqa akkaunt bilan (mobil trekda — brauzer ko'rinishi va namuna akkaunt; web-trekda — boshqa brauzer), bo'lmasa — ekran videosi;
  ③ — teng oraliq qoidasi (7 kun to'lmasa — qo'shilmaydi); karta ostidagi ikkinchi gap — sinf 14 va 50 foydalanuvchi qoidasi (sonni sun'iy oshirish yo'q).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Growth Chart!** (9-ekran, darvoza birinchi urinishda va «Bajardim»; ro'yxatda o'quvchining sonlari) — O'z sonlaringizdan noldan boshlangan o'sish grafigini chizdingiz
- **Five Parts!** (10-ekran, 5/5 saqlanganda) — Pitchingizni besh bo'lakka, Raqamlar bo'lagi bilan yozdingiz
- **Live Pitch!** (11-ekran, taymer to'xtatilib, varaq to'lganda) — Pitchingizni 5 daqiqada aytib, baholatdingiz
- **Part Fixed!** (11-ekran, birinchi o'zgartirilgan bo'lakda) — Varaqdagi izohdan keyin bo'lakni qayta yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda; 2, 4, 8-ekranlar (tugmali tushuncha) nishonsiz. «Grafikka nuqta yetmaydi» yo'lida va Mentor sonlari bilan chizilgan grafikda Growth Chart! berilmaydi.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Raqamlar qaysi bo'lakda** — 1 Raqamlar bo'lagida ilova ishga tushgach sanalgan sonlar turadi. · 2 Intervyu sanog'i — muammo dalili; hali bo'lmagan ish — keyingi qadam. · 3 Ilova nima qilishi — yechim bo'lagida.
  — Sinfga savol: Pitchingizdagi qaysi son ilova ishga tushgandan keyin sanalgan?
- **5 · Grafik noldan** — 1 Ustunli grafikda ustunlar noldan boshlanadi. · 2 Pastki qismi kesilsa, kichik farq katta ko'rinadi. · 3 Mentor misolida 44 ustuni 20 dan ikki barobardan sal baland.
  — Sinfga savol: 18 dan boshlangan grafikda o'sish qanday ko'ringan edi?
- **7 · Son yonida nima** — 1 Uzum 2022-yil oktabrida ishga tushgan, 2024-yil martida — birinchi «unicorn». · 2 «17 million» — 2025-yilda bir oyda foydalanganlar. · 3 Grafigingizda ham har son sanasi va nima sanalgani bilan turadi.
  — Sinfga savol: «44» yonida nima tursa, zal uni tushunadi?
- **12 · Sekinlashuv va halol gap** — 1 Halol gap son qanday sanalganini va qancha xulosa qilsa bo'lishini aytadi. · 2 Sekinlashuv yashirilmaydi: ustun olinmaydi, grafik noldan qoladi. · 3 Keyin nima qilishingizni Keyingi qadam bo'lagida aytasiz.
  — Sinfga savol: Mentor ikkinchi haftadagi sekinlashuvdan keyin nima qilmoqchi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·11 · B 2·7·10 · C 3·8·12 · D 4·5·9 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Mentor misolida Muammo bo'lagiga qancha vaqt ajratilgan? (2)
   - ✔ Taxminan 40 soniya
   - Taxminan 2 daqiqa
   - Taxminan 3 daqiqa
   - Taxminan 10 soniya
2. Raqamlar bo'lagida grafik va bosh raqam yonida yana nima turadi? (2, 10)
   - Uzum sonlari bilan solishtiruv
   - ✔ Sonlar haqida bitta halol gap
   - Hamma kunlarning to'liq jadvali
   - Sinfdoshlarning ismlari ro'yxati
3. Grafikda «ishga tushirish kuni» yozuvi qayerda turadi? (4)
   - Birinchi ustunning ustida
   - Grafik sarlavhasi o'rnida
   - ✔ Birinchi ustunning ostida
   - Eng baland ustun ichida
4. O'sish grafigining sarlavhasiga nima yoziladi? (4, 9)
   - Mahsulot nomi va logotipi
   - Pitch aytiladigan sana
   - Grafikdagi eng katta son
   - ✔ Grafikda nima sanalgani
5. Grafikdan bir hafta tushib qolsa, nima buziladi? (4)
   - Ustunlar noldan boshlanmay qoladi
   - Sarlavha o'chib, ko'rinmay qoladi
   - Sonlar o'zi kattaroq bo'lib qoladi
   - ✔ Oraliqlar endi teng bo'lmay qoladi
6. Uzum qachon ishga tushgan? (6)
   - ✔ 2022-yil oktabrida
   - 2024-yil martida
   - 2020-yil oktabrida
   - 2025-yil martida
7. «Unicorn» deb qanday kompaniyaga aytiladi? (6)
   - Oyiga million foydalanuvchisi bo'lgan
   - ✔ Bahosi 1 milliard dollardan oshgan
   - Bir yilda o'nta shaharda ochilgan
   - O'z avtoparki va punktlari bo'lgan
8. Jonli demoda ikkinchi telefonda zal nimani ko'radi? (8)
   - Siz bosgan tugma o'chib qolganini
   - Ilova qaytadan ochilib yuklanganini
   - ✔ Son pastga tortmasdan o'zgarganini
   - Ulanish belgisi o'chib qolganini
9. Pitchdan oldin ikkala qurilmada nimani tekshirasiz? (8, 11)
   - Ikkalasida bitta akkaunt borligini
   - Ilova hali ochilmay yopiq turganini
   - Ro'yxat pastga tortib yangilanganini
   - ✔ Belgi «Ulangan» bo'lib turganini
10. Hisobotingizda sinfdoshlar ham bor. Halol gapda nima deysiz? (2, 10)
    - Sinfdoshlarni sanoqdan butunlay chiqaraman
    - ✔ Ulardan nechtasi sinfdosh ekanini aytaman
    - Hammasini «foydalanuvchi» deb aytaman
    - Sinfdoshlar haqida umuman gapirmayman
11. Grafikdagi sonlarni qayerdan olasiz? (9)
    - ✔ O'z Database'ingizdan, SQL bilan
    - Sinfdoshlar aytgan taxminiy sondan
    - Mentor misolidagi tayyor sonlardan
    - Umami'dagi lending tashriflaridan
12. Sherik Raqamlar qatoriga ✗ va «nima sanalgan?» deb yozdi. Nima qilasiz? (11)
    - Raqamlar bo'lagini pitchdan olasiz
    - Sonlarni kattaroq qilib ko'rsatasiz
    - ✔ Sarlavhaga nima sanalganini yozasiz
    - Sherigingizdan ✓ qo'yishini so'raysiz
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — pitch, zal, bo'lak, grafik, ustun, son, sana, halol gap, telefon, taymer · uyga vazifa banneri — pitch, grafik, zal, daqiqa (faqat so'z, emojisiz).
- Izoh (MD): 3 — kartochka 7 («ustida va ostida») nusxasi emas: aniq yozuv va aniq ustun (S-021); 6 — «2020», «2025-yil mart» — yolg'on sana distraktor sifatida (bank faktiga zid, S-004); 7 — distraktorlar ta'rif emas, Uzum voqeasining boshqa bo'laklari («o'z avtoparki») ham bor — rost, lekin ta'rif emas;
  9 — «bitta akkaunt» — 8-ekran qoidasiga zid; 11 — Umami — lending tashriflari, boshqa o'lchov (sinf 5); 12 — 4-ekran 4-qoidasi.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmGrowthPitchLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m10d12-v1` (07.10: hamma PM dars bilan bir shakl — `pm-m10dN-v1`) · «Raqamlaringiz zalni ishontiradimi?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` · s9 `QKod` (`HtmlCompiler`) ·
   s10/s11 `QMustaqil` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`.
2. **`BeshDaqiqaSahna`** — bitta vizual (180): telefon (`JamoaTelefon`: «O'yinlar» + ulanish belgisi · «O'yin»; «8 / 10» → «9 / 10» son animatsiyasi; ≈170×272 barqaror) · besh bo'lak (holatlar: bo'sh · joriy · yozildi · ✓ · ✗ · o'zgartirildi) ·
   taymer chizig'i (besh bo'lak `[40, 20, 90, 90, 60]` s; 5:00 dan keyin qizil «+m:ss») · zal (4 siluet, `ZAL_SAVOL` pufagi / ✓) · `BaholashVaragi` qatlami (5 qator + «Vaqt») · **jonli demo rejimi** (ikki telefon + Backend «Database: N» + konvert; tayanch 9.16).
   11-Modul `UchDaqiqaSahna` dan ko'chirilmaydi — dars ichida (K-020). Rangli yon chiziq yo'q. `reduced-motion`; 393 da bo'laklar telefon ostida. Qolip-maket izohi faylda e'lon qilinadi (`// qolip-maket: …`).
3. **`OsishGrafigi`** — bitta komponent: `{ haftalar: [{ sana, soni }], sarlavha, noldan: bool, korinish: 'katta' | 'ixcham' }`; `buzilgan` holat (4-ekran: o'q 18 dan, «27» ustuni bilan) → to'rt tuzatish ketma-ket; ustun o'sishi `transform: scaleY` + `transition`.
   Raqamlar bo'lagi, 4, 9-ekranlar va test vizuallari shundan o'qiydi (P-063).
4. **`JAMOA_PITCH`** — bitta manba (A-6 aynan): `muammo: { gap, dalil }` · `yechim: { gap, foydalar: [3] }` · `demo: { bosiladi, ozgaradi }` · `raqamlar: { grafik: [{ sana, soni }] × 3, nima, bosh, halolGap }` · `keyingi` · `vaqt: [40, 20, 90, 90, 60]`.
   **`ZAL_SAVOL`** (5) · **`MASHQ_GRAFIK`** (4-ekran: `{ ok: 18, haftalar: [20, 27, 38, 44] }` — 1.13 sonlari). s0, s2, s4, s8, s10/s11 (mentor rejimi) shundan o'qiydi.
5. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); «44» kartasi, tanlovda ikki uzuq qator halqasi; matn yozilmaydi.
6. s2: `QBashorat` (uch o'rin) → 3 tugma → yangi bo'lak (ichida `OsishGrafigi` ixcham + bosh raqam qatori), nom «Raqamlar» + `QIzoh`; halol gap qatori; taymer 3:00 → 5:00 va besh bo'lak; `QIzoh` (taqsimot); `QTaxmin`; 40 s ipucha.
7. s4: `OsishGrafigi` `buzilgan` → 4 tugma (noldan, teng oraliq, sana va son, sarlavha), har birida yorliq; 4/4 da yorliq «o'sish grafigi» + `QIzoh`; `QBashorat` (ikki · besh · o'n barobar); `QTaxmin`.
8. s9: `HtmlCompiler` — `files: [{ name: 'index.html' (tayyor, o'qish uchun) }, { name: 'app.js', starter }]`, `previewCss` — `#grafik` (flex, `align-items: flex-end`, pastki chiziq), `.joy` (ustun + son + sana ustma-ust), `.ustun` (en, rang; balandlik JS dan).
   ⚠️ CSS va kod namunasi ichida backtik yo'q (template-satr tuzog'i, CLAUDE.md); kod satrlari oddiy qo'shtirnoqda.
   **Boshlang'ich `haftalar` (manba shartnomasi — tayanch 8, 9.44 b):** `pm-m10d10-hisobot.kunlar` — `[{ sana: 'YYYY-MM-DD', soni }]`, `soni` — shu kuni yangi ro'yxatdan o'tganlar (jami emas), `namuna = false`. Bo'lsa — dars har 7 kunda jamini hisoblaydi (birinchi sana — 0-kun; har nuqtada shu kungacha bo'lgan `soni` lar yig'indisi, o'sha kun ham kiradi; 7 kun to'lmagan oxirgi bo'lak tashlanadi),
   `sana` — `YYYY-MM-DD`, izoh «// sizning sonlaringiz: metrika hisobotidagi kunlar bo'yicha sanoqdan, har 7 kunda jami»; nuqta 2 tadan kam bo'lsa yoki kalit yo'q — Mentor ro'yxati (A-6) va Mentor matni; o'quvchi nuqtalarni o'zi yozishi mumkin (Yordam) yoki «Grafikka nuqta yetmaydi».
   **Darvoza** `GATE_ITEMS` (3 formula; to'g'ri — `h.soni / engKatta * BALANDLIK`) + kichik jonli grafik. **Shartlar** (`requirements`, natija DOM idan — ⛔ haqiqiy `HtmlCompiler` da sinalmagan, pastda): 1 — `#sarlavha` matni ≥ 5 belgi · 2 — har `.ustun` balandligi / `soni` bir xil (±2 px), eng balandi ≈ `BALANDLIK` ·
   3 — `.joy` soni = ro'yxat uzunligi (≥ 2), har birida `b` = `soni`, `span` = `sana`. Boshlang'ich kod 0/3 (sarlavha bo'sh, balandlik 0, matnlar bo'sh); namuna yechim (`h.soni / engKatta * BALANDLIK`, `h.soni`, `h.sana`, sarlavha) — 3/3, balandliklar 73 · 138 · 160 px;
   «eng kichikdan» formula (`(h.soni - 20) * 10`) 2-shartda yiqiladi — 06.10 da `node` va kichik soxta DOM bilan sinaldi (scratchpad `md12/sinov.js`); haqiqiy `HtmlCompiler` da quruvchi qayta sinaydi.
   «Bajardim» → `.joy` lardan `{ sana, soni }` va `#sarlavha` o'qiladi → `pm-m10d12-pitch.bolaklar.raqamlar.grafik`, `.nima`; kod qoralamasi — `pm-m10d12-code` (tayanch 8). «Grafikka nuqta yetmaydi» → `grafik: []`, nishon yo'q.
   ⛔ **«Qur» darvozasi (12-FILTR 10):** kompilyator natijani alohida oynada (iframe) chizsa, dars undan DOM ni o'qiy olmasligi mumkin — haqiqiy `HtmlCompiler` da to'liq yo'l sinaladi: chizish · uch shart · «Bajardim» · `{ sana, soni }` ni olish.
   O'qib bo'lmasa — zaxira: «Bajardim»dan keyin kichik forma (nuqtalar ro'yxati dars bilgan `haftalar` bilan to'ldirilgan; o'quvchi koddagi o'zgarishini shu yerda tasdiqlaydi) — grafik kalitga shundan yoziladi.
   Nishon `growthChart` — darvoza birinchi urinishda + «Bajardim» + ro'yxat Mentor sonlaridan farqli.
9. s10: 5 bosqichli forma (ketma-ket karta); o'qiydi `pm-m10d11-pitch` (`bolaklar` — yakuniy matn; `davolar[].bolak`, `qaror`, `gap`, `yangiGap`, `dalil: { son, yozuv, manba, qachon }` — Muammo dalili va zaxira javoblar uchun), `pm-m10d1-lending` (`foydalar`), `pm-m10d10-hisobot` (`bosh`, `royxat.soni`, `royxat.sinfdosh`, `zaxira.ish`, `tuzatishQator`);
   yo'q bo'lsa — bo'sh maydon (M-q5). Tekshiruv funksiyasi (dalil bo'sh — raqam talab qilinmaydi · texnologiya nomlari · «2-qurilmada» bo'sh · halol gap bo'sh · «sinfdosh» so'zi va `sinfdosh` > 0 · va'da so'zlari · keyingi qadam bo'sh) — PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi;
   artefakt-strip «Pitchim» (U-042); nishon `fiveParts`.
10. s11: 3 tugma; `PitchTaymer` (5 daqiqa, besh bo'lak, to'xtamaydi, «+m:ss»; ▶ ⏹ belgilari yo'q; joriy bo'lak Raqamlar bo'lsa `OsishGrafigi` katta) · varaq formasi (5 × ✓/✗ + izoh ≥ 8 belgi; «hammasi ✓» va baho so'zlari — yo'naltiradi) ·
    o'zgartirish (bo'lak kartasi, o'zgarish tekshiruvi, yorliq «o'zgartirildi»; beshta ✓ da tugma «Aniqlashtiring») · vaqt > 5:00 bo'lsa `QIzoh`; juftlik / yakka matnlari; Mentor rejimi — proyektor taymeri va guruh varag'i; `optionalLive`; nishonlar `livePitch`, `partFixed`.
11. **Saqlash** `localStorage` `pm-m10d12-pitch` = `{ bolaklar: { muammo: { gap, dalil }, yechim, demo: { bosiladi, ozgaradi }, raqamlar: { grafik: [{ sana, soni }], nima, bosh, halolGap, manba }, keyingi }, vaqt, varaq: [{ bolak, belgi, izoh }], tuzatildi: [bolak], varaqTur: 'sherik' | 'ozi' | null, savedAt }`
    (tayanch 8, 9.44 d; `tuzatildi` — kalit nomi o'zgarmaydi, ma'nosi «matni o'zgartirilgan bo'laklar», ekrandagi yorliq — «o'zgartirildi»: 5-darsdagi kelishuv 9.37 f naqshi). `bolak` — `'muammo' | 'yechim' | 'demo' | 'raqamlar' | 'keyingi'` (barqaror id; tartib o'zgarmaydi). Shaxsiy ma'lumot (ism, login) hech qaysi maydonga yozilmaydi.
12. Testlar s3/s5/s7/s12 — `correctIdx` 2/0/3/1 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4).
    Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. Jonli ball: `INLINE_KEYS` = { s3: 2, s5: 0, s7: 3, s12: 1, beshBolak: -1, grafik: -1, demo: -1, kod: -1, practice: -1, juftlik: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`.
14. `ACHIEVEMENTS` 4 (`growthChart`, `fiveParts`, `livePitch`, `partFixed`) · `FLASHCARDS` 12 · s15 `RECAP` 4 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — ScoreRing ostida (P-013) ·
    yakun sarlavhasi — `varaq`, `tuzatildi`, bo'laklar soni, `grafik` dan (4 holat; birinchi holatda `grafik` bo'sh bo'lsa — «sonlaringiz bilan»); varaq chipi — `varaqTur` dan · `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
15. s6: `UZUM_KADR` 3 × `{ h — kadr nomi, m — Mentor gapi }` (SABOQ 8); `UzumSahna` (telefon — «Uzum» ilovasi ekrani; vaqt chizig'i uch nuqta; mashina va topshirish punkti chizmasi; 3/3 da kulrang qator); nom «Uzum» — `Brend` komponenti, binafsha (10/11-Modul bilan bir), logotip yo'q;
    bashorat 2/3 da (ballsiz, ixcham qator, `QTaxmin`); tugma «Voqea davomi (N/3)»; manba izohi faylda.
16. s8: jonli demo rejimi — 3 tugma (bitta telefon: o'z ekrani o'zgaradi · ikkinchi qurilma: konvert 1 → Backend → 2, «9 / 10» · zaxira: uch karta); `QBashorat` (bitta · ikkita · uchta); `QTaxmin`.
17. Uyga vazifa — yangi `HwCard` («Kim bilan · Nechta · Muddat», 3 band, ③ shartli); alohida `.homework.jsx` yo'q. App.jsx: `m10-12` qatoriga `comp: PmGrowthPitchLesson` + import — asosiy seans (bu agent tegmaydi); nom va osti ✓ (409-qator).
- Darvozalar: `npm run gates -- src/10-Modull/PmGrowthPitchLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

## Manbalar (o'zim tekshirgan sahifalar va qatorlar, 06.10.2026)
- `PM_Prompt_v8.md` 171–174 (K1) — o'zim o'qidim; ruscha asldan so'zma-so'z tarjima: «Marketpleys 2022-yil oktabrida ishga tushdi. Saytdan emas, logistikadan boshlashdi: o'z avtoparki, topshirish punktlari, ertasi kuni yetkazish …
  2024-yil martida mamlakatning birinchi «unicorn»i bo'ldi.» · «Raqamlar: unicorn — bahosi 1 mlrd dollardan yuqori … oyiga ≈17 mln foydalanuvchi (2025).» · bank qoidasi (160–163): «unicorn»ni tushuntirishda summa aytiladi; yilsiz son aytilmaydi.
  Tayanch 5 matni bilan solishtirildi: tayanchdagi «oldin odamlar ko'pincha Instagram va Telegram guruhlari orqali xarid qilgan» — bankda «yetkazib berishsiz» qo'shimchasi bor (10-FILTR: o'quvchi matnida «ko'pincha»); bu darsda u qism aytilmaydi.
- support.apple.com/en-us/102653 (iPhone ekran yozuvi): «Tap the gray Record button, then wait for the three-second countdown.» · «open the Photos app and select your screen recording in your Library». O'quvchi matnida tugma nomi yozilmadi — «ekran videosi».
- support.google.com/android/answer/9075928 (Android ekran yozuvi): «Screen record» — Quick Settings orqali. Versiya chegarasi sahifada aytilmagan (Shubhali joylar). O'quvchi matnida tugma nomi yozilmadi.
- Tayanch 6 (asosiy seans, 06.10, rasmiy hujjat): Render bepul xizmati uxlaydi, uyg'onishi ≈1 daqiqa (9.19: «bir daqiqagacha») · brauzer ko'rinishi `npx expo export -p web` (amalda tekshirilmagan) · 11-Modul 9.99: Neon SQL Editor «Run».
- 10-Modul `10-FILTR.md` (Uzum 1, 2): TechCrunch, 25.03.2024 — «launched in October 2022», «the country's first unicorn» — men qayta ochmadim; tayanch 5 tasdig'i sifatida.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**12-FILTR (F-1006-366) dan keyingi holat — tayanch 9.44 ga yozildi; 1-band — GATE M 06.10: M-q4 A (yechim gapi + uch foyda) tasdiqlandi:**
1. ✅ **Mentorning Yechim bo'lagi** — endi tayanch 9.31 bo'yicha: yechim gapi + lendingdagi foydalar (MD da faqat foydalar edi). Auditor «bitta yechim gapi + 1–2 foyda»ni kuchliroq deydi — M-q4 ga uchinchi variant bo'lib qo'shildi. O'quvchi 1–3 foydani o'zi tanlaydi.
2. ✅ **Mentor grafigidagi ustun yozuvlari** — nisbiy («bir hafta o'tib»); aniq sana to'qilmaydi; o'quvchida — kalendar kun.
3. ✅ **4-ekran mashq grafigi** (o'q 18 dan) — faqat «kesilgan o'q chalg'itadi» mashqi; yorliq «mashq: ataylab buzilgan».
4. 🔁 **O'quvchi grafigining nuqtalari** — manba shartnomasi yozildi (tayanch 8, 9.44 b; 10 MD): `kunlar[].soni` — kunlik yangi ro'yxatdan o'tganlar, `YYYY-MM-DD`, namunasiz; keyingi hafta nuqtasi — o'quvchidan; `kunlar` yo'q — o'zi yozadi yoki «Grafikka nuqta yetmaydi».
5. ✅ **`pm-m10d12-pitch` ichki shakli** — tayanch 8 ga kirdi (`varaqTur`, `savedAt`, barqaror `bolak`).
6. ✅ **`pm-m10d1-lending` o'quvchilari** — 12-dars tayanch 8 jadvalida bor.
7. ✅ **Ikkinchi qurilmaning akkaunti** — tayanch 9.44 c: sherik — o'z akkaunti; brauzer ko'rinishi yoki Mentor — namuna akkaunt (sanoqqa kirmaydi); demo — real odamlar qo'shilmagan o'yinda; keyin «O'yindan chiqish».
8. ✅ **8 · 19 · 24 va 61 / 26 / 43%** — zaxira javob (bo'lakka kirmaydi); o'quvchida ham 11-darsdagi sonli da'volar shunday ko'rsatiladi.
9. ✅ **Bashoratlar, zaxira yo'li kartalari, hook sahnasi** — tasdiq.
10. ✅ **Uzum burchagi** — tasdiq.
11. ✅ **Nishon nomlari** — tasdiq.
12. ✅ **Yakun holatlari** — tasdiq; + grafiksiz o'quvchi uchun birinchi sarlavhaning ikkinchi matni.
13. ✅ **Halol gap tekshiruvi** — yumshoq (yo'naltiradi), tasdiq.
14. ✅ **Uyga vazifa ③** — manba yo'li yozildi.
15. ◐ **Kod oynasi** — tasdiq, lekin «Bajardim»ning DOM dan o'qishi haqiqiy `HtmlCompiler` da sinalmaguncha muzlatilmaydi (⛔ «qur»; zaxira forma yozildi).
16. ✅ **Zal savollari** — tasdiq.
17. ✅ **«son» va «raqam»** — tasdiq (tayanch 9.43 f).
18. ✅ **Keyingi qadam** — «maqsad 50» va'da emas; gap endi 11-darsdagi tuzatilgan pitch gapi + maqsad: «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.»

## Shubhali joylar (ishonchim komil emas)
- ⛔ **Brauzer ko'rinishida real vaqt** (ikkinchi qurilma sifatida) — tayanch 6: brauzer ko'rinishi (kirish, ulanish, CORS, Backend uyg'onishi, bitta o'yinda «8 → 9») amalda tekshirilmagan — «qur» darvozasi (9.39 k, 9.44). Ishlamasa — asosiy yo'l sherik telefoni, uyda — ekran videosi; brauzer kartasi olib tashlanadi.
- **Android ekran yozuvi** — Google sahifasi «Screen record» deydi, lekin qaysi versiyadan va hamma telefonda borligi aytilmagan; iPhone'da — Apple sahifasi bo'yicha bor. O'quvchi matnida tugma nomlari yo'q.
- ✅ **Haftalik jami hisobi** (`kunlar` → har 7 kun) — 10-dars MD si bilan solishtirildi va shartnoma yozildi (tayanch 9.44 b): kunlik son, `YYYY-MM-DD`, `namuna = false`; kun Database vaqt mintaqasi bo'yicha (10-dars O'qituvchi eslatmasi) — jami o'zgarmaydi, kun chegarasi siljishi mumkin.
- **`kunlar` 10-dars kunigacha** — 12-darsda oxirgi hafta nuqtasi yo'q bo'ladi; o'quvchi qo'shmasa, grafik ikki ustunli qoladi (bu ham to'g'ri grafik). 10-darsda SQL qilmagan o'quvchida `kunlar` umuman yo'q.
- **O'quvchida 7 kun o'tmagan bo'lsa** (masalan, ishga tushirish kech bo'lgan) — grafik bitta ustun bo'lib qoladi; shart 3 «≥ 2 ustun» — bu holatda o'quvchi «Grafikka nuqta yetmaydi» yo'liga o'tadi va yakunda to'liq natija oladi («sonlaringiz bilan»). Pilotda ko'rish kerak.
- ⛔ **`HtmlCompiler` imkoniyati** — `files`, `previewCss`, DOM tekshiruvi kompilyator sarlavhasida bor (o'qidim), lekin «Bajardim» da natija DOM idan ma'lumot olish yo'li haqiqiy kompilyatorda sinalmagan — «qur» darvozasi; zaxira forma KOD 8 da.
- ⛔ **Juftlikda vaqt** — 2 × 5 daqiqa + varaq + jonli demo tayyorligi ≈ 18 daqiqa tig'iz (auditor 22–25 kutadi); ikki qurilmani ochish va «Ulangan» ni kutish (Render uyg'onishi bir daqiqagacha) — pilotda taymer bilan.
- **Sanoq sahifasidagi ro'yxatdan o'tganlar yozuvi** — aniq yorlig'i tayanchda yo'q (1.8: «ro'yxatdan o'tganlar»); O'qituvchi eslatmasida umumiy so'z bilan.
- **4-ekran «o'n uch barobar»** — (44 − 18) / (20 − 18) = 13; o'quvchiga faqat O'qituvchi eslatmasida aytiladi; vizualda balandliklar shu nisbatda chizilishi kerak.
- **Uzum «oyiga 17 million foydalanuvchi»** — faqat bank va tayanch; men tashqi manbadan tekshirmadim.
- **Arena 6, 7 distraktorlari** («2020-yil oktabrida», «2025-yil martida», «Bir yilda o'n shaharda ochilgan») — yolg'on, lekin o'zini fosh qilmaydi deb oldim; auditor ko'rsin.
- **8-ekran 2-tugmasi** — 1-telefon «8 / 10» ga qaytishi (o'yindan chiqilgan, ekran ortida) sahna uchun soddalashtirish; o'quvchi «nega yana 8?» deb so'rashi mumkin — O'qituvchi eslatmasidagi «O'yindan chiqish» qatori shunga javob.
- ✅ **12-ekran B varianti** — auditor aynan shuni ko'rdi: D endi grafikka tegmaydigan, lekin halollikni buzadigan variant.
- ✅ **Muammo gapi** — 11-darsdagi qisqa shaklga moslandi («O'yinchilar jamoaga odam yig'ishda qiynaladi.»); Keyingi qadam ham 11-dars gapi bilan bir.
- **Demo o'yini** — o'quvchining ishlab turgan ilovasida real odamlar qo'shilmagan o'yin bo'lmasligi mumkin; demo oldidan alohida o'yin e'lon qilish — qo'shimcha daqiqa. 7-darsda namuna o'yinlar qolganmi (tashkilotchisi namuna akkaunt) — «qur» da Mentor repo'sida ko'riladi.

---

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 15-ekran: to'rt sarlavha (aytildi va baholandi · yozildi, aytish qoldi · grafik tayyor · boshlandi) + varaq chipi; ✓ va nishon faqat birinchisida; sarlavha o'quvchi ishini aytadi, Mentor sonini emas.
2. [x] **Da'vo isbot emas** — (a) «Bizda 5 daqiqalik pitch besh bo'lakdan…» (2, 14, 15), «Bu mashqdagi taqsimot…» (2), grafik qoidalari kurs qolipi (A-4); (b) «Mentor misolida» / «Bu misolda» (0, 4, 8, 10 Yordam, kartochka 5, 8);
   (c) «odatda bir necha soniyada» (8-ekran `QIzoh`), «Ilova ochilmasa — ekran videosi…» (8, 11), ekran o'zi yangilanmasa — bitta telefon va halol aytish (8 eslatma); (d) Mentor bosh raqami «kichik son, o'sish bor, lekin isbot emas» (10 eslatma), «sekinlashdi» halol gapi (2, 12).
3. [x] **Maxfiy qiymat chiqmaydi** — 11-ekran «Pitchdan oldin»: laptopda Neon, sanoq sahifasi (maxfiy kalit so'raydi) va `.env` yopiq; akkaunt ma'lumoti boshqaga berilmaydi (8, 11); grafik va pitchda ism, login yo'q (A-11, KOD 11). Agent bu darsda yo'q.
4. [x] **Tashqi xizmat — faqat rasmiy hujjat** — Render uyg'onishi (tayanch 6, 9.19 so'zi), Neon «Run» (11-Modul 9.99), ekran yozuvi (Apple, Google sahifalari — Manbalar; tugma nomlari yozilmadi), brauzer ko'rinishi (tekshirilmagan — Shubhali joylar).
5. [x] **Har sonning manbasi va o'lchovi** — grafik sarlavhasi «Ro'yxatdan o'tganlar, jami» (birlik — hisob), qaytganlar foizi — qurilma, bosh raqam — o'yin (A-7); «27 — 3 kun o'tib» (4); «17 million» — yili va «oyiga» bilan (6); har xil o'lchov ayirilmaydi; kichik N — 10-ekran eslatmasi.
6. [x] **Tayanchda yo'q narsa to'qilmadi** — Mentor pitchi, sonlar, halol gap, keyingi qadam, K1 so'zlari va brend izohlari — tayanchdan aynan; o'zim qaror qilganlar (Yechim, ustun yozuvlari, «18», nuqtalar hisobi, akkaunt, bashoratlar) — TAYANCHGA SAVOL 1–18, 12-FILTR dan keyin tayanch 9.44 da.
7. [x] **Saqlash kaliti — o'qiydigan darsning ehtiyojidan** — `pm-m10d12-pitch` tayanch 8 shakli + `varaqTur` (real/mashq ajratiladi), `bolak` — barqaror id, `tuzatildi` (ish fakti) va `varaq` (natija) alohida, grafik `{ sana, soni }` sana tartibida; kalit yo'q — o'quvchi o'zi yozadi (10-ekran bo'sh maydonlar). O'qiydi `pm-m10d11-pitch.bolaklar` (qayta yig'maydi) va `kunlar` (manba shartnomasi — 9.44 b); «tuzatish» olgan son oldindan qo'yilmaydi.
8. [x] **Test: bitta himoyalanadigan javob** — s3 (A muammo, B keyingi qadam, D yechim), s5 (B/C/D noto'g'ri tasavvur), s7 (A keys me'yori, B ism, C shrift), s12 (A, C — grafik qoidalariga zid; D — grafik to'g'ri, halollik buzilgan); «Hech qayerda» tipidagi variant yo'q; ✔ yolg'iz eng uzun emas (O'lchov); savoldagi son javobda yo'q.
9. [x] **Keys: bank so'zi aynan** — 6-ekran uch kadr bank matni (ruscha asl bilan solishtirildi), brend izohlari tayanch 5; «17 million» — me'yor emas (6-ekran qatori, 7-ekran A izohi, kartochka 9); ko'prik «Bu voqeada …»; natija va sabab qo'shilmagan.
10. [~] **90 daqiqa** — A-bo'limda taqsimot (reja, 12–15 o'quvchi bilan pilotda o'lchanadi) va ulgurmagan o'quvchi yo'li; 9-ekran «Grafikka nuqta yetmaydi», 10-ekran `optionalLive`, 11-ekran — uyga vazifa ①; Render uyg'onishi kutishi pitchdan oldin (8 eslatma); yakun holatga qarab.
11. [x] **Bir ma'no — bir so'z** — A-5: «son» / «raqam», «bo'lak», «ustun», «qadam» (faqat «Keyingi qadam»; ekran tartibi — tugmalar, keysda — kadr), «sinov» o'quvchi matnida yo'q, «e'lon» — o'yin e'loni, «hodisa», «post», «kanal», «push» — yo'q.
12. [x] **Web-trek teng yo'l** — 8-ekran eslatmasi (telefon brauzeri yoki inkognito oyna, boshqa akkaunt), 10-ekran Yordam, 11-ekran «Pitchdan oldin» web qatori, kod oynasi ikkala trekka bir xil; yakuniy test va yakun holatlari ikkala trekka to'g'ri.
13. [x] **Agent va o'quvchi ishi ajratilgan** — bu darsda agent yo'q: grafik kodini, bo'laklarni, halol gapni o'quvchi o'zi yozadi; qarorni o'quvchi qiladi (qaysi son, qaysi foyda); tekshiruvda nima ko'rinishi aniq (shartlar, belgi «Ulangan»). `DELETE` va tekshiruv yozuvi yo'q.
14. [x] **O'smir xavfsizligi** — pitch va grafikda ism, login, familiya yo'q; sinfdoshlar — faqat son; har qurilma o'z akkaunti bilan (8, 11); uyda tinglovchi ro'yxatdan o'tishga undalmaydi (15); namuna akkaunt sanoqqa kirmaydi (8 eslatma); jonli demo real odamlar qo'shilmagan o'yinda — ularga jonli xabar bormaydi (8, 11).

## O'lchov (`scratchpad/md12/olchov.py` natijasi — jadval skript chiqishidan, 06.10.2026; to'liq chiqish `md12/olchov-natija.txt`)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 4, 6, 8, 9, 10, 11 ×2, 14, 15 ×4) | 15 | 25 | 52 | ≤55, bitta qator |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 83 | 83 | ≤120 |
| Hook variantlari (0) | 3 | 31 | 33 | farq 6% |
| Xulosa (2, 4, 6, 8, 10 ×2, 11) | 7 | 63 | 101 | ≤110 |
| Bugungi asosiy fikr | 1 | 109 | 109 | ≤110 (12-FILTR dan keyin) |
| `QIzoh` qatorlari (2 ×2, 4, 8 ×2) | 5 | 69 | 104 | bitta qator (≤110) |
| To'g'ri izohi (3, 5, 7, 12) | 4 | 57 | 60 | ≤60, «To'g'ri!» siz |
| Xato izohlari (3, 5, 7, 12 — har biri uch + umumiy) | 16 | 31 | 57 | ≤60 |
| `QXato` va tekshiruv xabarlari (9 darvoza va shartlar, 10, 11) | 17 | 30 | 56 | ≤60 |
| Test variantlari — s3 (✔ C) | 4 | 48 | 52 | farq 8%, ✔ 52 (B, D ham 52 — yolg'iz eng uzun emas) |
| s5 (✔ A) | 4 | 26 | 28 | farq 7%, ✔ 26 |
| s7 (✔ D) | 4 | 30 | 32 | farq 6%, ✔ 32 (A, B ham 32) |
| s12 (✔ B) | 4 | 46 | 52 | o'rtachadan eng katta farq 7%, ✔ 46 (12-FILTR dan keyin D almashdi; to'g'ri izohi 55, D izohi 57) |
| Test savollari (so'z) | 4 | 8 | 11 | ≤12 |
| Arena 1–12 (variantlar) | 48 | 16 (6-savol) | 42 (10-savol) | har savolda farq ≤12%; ✔ hech qayerda yolg'iz eng uzun emas |
| Arena savollari (so'z) | 12 | 4 | 11 | ≤12 |

Arena ✔ taqsimoti: A — 1, 6, 11 · B — 2, 7, 10 · C — 3, 8, 12 · D — 4, 5, 9 (3/3/3/3). Ekran testlari: s3 C · s5 A · s7 D · s12 B.
Mentor gaplari: interaktiv ekranlarda (0, 2, 4, 8, 9, 10, 11 va 11-ekran tugma gaplari) — bitta gap; 1 (reja) — bitta gap; 6 (har kadr) — ikki gap; sarlavhani takrorlamaydi, «Bu…», «Hammasini…» bilan boshlanmaydi (qo'lda tekshirildi).
Kod oynasi: boshlang'ich kod 0/3, namuna yechim 3/3, «eng kichikdan» formula 2/3 (`md12/sinov.js`, soxta DOM bilan — haqiqiy `HtmlCompiler` da emas).
`npm run lint:til feedback/F-1006-12modul/12-PmGrowthPitch-v3.md` — **0 error** (12-FILTR dan keyin qayta yurgizildi — natija 12-FILTR da; undan oldin 0 warn) (06.10; oxirgi tahrirdan keyin qayta yurgizildi — Hisobotdagi yakuniy natijaga qarang).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 408 `m10-11` «Raqamlaringiz pitchni qanday o'zgartiradi?» → 409 **`m10-12` «Raqamlaringiz zalni ishontiradimi?»** (osti «metrikali pitch: o'sish grafigi — dalil» — reja chap yorlig'i so'zma-so'z) →
  410 `m10-13` «Zaxira dars» (yakun qatori). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (muammo gapi, foydalar, namuna o'yin, sonlar 1.12/1.13 aynan); metafora yo'q; bitta vizual — `BeshDaqiqaSahna` (telefon · besh bo'lak · taymer · zal · varaq · jonli demo rejimi) va uning ichidagi `OsishGrafigi`.
  Ikkinchi misol faqat testda (uy vazifalari ilovasi — 3, to'garaklar sayti — 5; P-002). Uzum — keys sahnasi (PM-028/029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 8 (QTushuncha) + 0, 6, 9, 10, 11; testlarda javobdan keyingi kichik vizual. «bosish va matn-karta» naqshi yo'q — har bosish bo'lakni, ustunni, telefonni yoki taymerni o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: pitch, zal, repetitsiya (9-Modul) · halol gap, fidbek, baholash varag'i, keyingi qadam (10-Modul 11-dars) · bo'lak va to'rt nomi, jonli demo ta'rifi, zal savollari, «Hammasi ✓ — …» (11-Modul 16-dars) ·
  lending, foyda, ulanish belgisi, ro'yxatdan o'tgan, namuna akkaunt, brauzer ko'rinishi, metrika hisoboti, sanoq sahifasi, tuzatilgan pitch (12-Modul tayanchi 2). Yangi — «Raqamlar bo'lagi», «o'sish grafigi» — misoldan keyin.
  Siz-forma; tugmalar ot-shaklda yoki siz-formada («Saqlash», «5 daqiqani boshlash», «Bajardim — grafik chizildi», «Grafikka nuqta yetmaydi», «Noldan boshlang»).
- [x] Testlar: 4 variant, uzunlik teng (farq ≤ 12%), to'g'ri javob hech qayerda yolg'iz eng uzun emas; qo'shtirnoq s3 da to'rttasida, tire hammasida; kalit so'z faqat to'g'rida emas (s5 «Haqiqatdagi…» uchtasida, s12 «hafta» uchtasida). Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✗ › ≈ — belgilar) · kafolat so'zlari yo'q: «darrov», «darhol», «har doim», «100%» — 0; «albatta» — faqat 10-ekran tekshiruv detektori ro'yxatida va A-5 «Ishlatilmaydi» da (MD ichki).
  «son o'zi o'zgaradi» — 8-ekran `QIzoh` da «odatda bir necha soniyada» bilan; xulosalar «Bu misolda», «Bu voqeada», «Bizda» bilan chegaralangan.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m10-12`, «Modul 12», K1, A1 — faqat MD izohlarida; modul raqami — «o'tgan modulda»; dars raqami yo'q). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 17 band, REPO 0.
- [x] Karta T · P · S · PM: T-011/PM-030 (Raqamlar bo'lagi, o'sish grafigi — misoldan keyin; sarlavhalarda yangi atama yo'q) · T-014/T-015 (A-5: son/raqam, qadam → tugma/kadr, sinov yo'q, hodisa yo'q) · T-016 (metafora yo'q) · T-020 · T-029/T-047 ·
  T-035 (o'quvchi matnida ÷ × → yo'q — Yordam'da so'z bilan; strelka faqat MD ichida) · T-038 (Zaxira dars — faqat yakun qatori; bitiruv, Demo Day — yo'q) · T-039 · T-042 (ta'riflar so'zma-so'z: xulosa 2, `QIzoh` 4, kartochkalar 1, 4) · T-043 («bu misolda», «bu mashqda») ·
  T-045 (bitta telefonda real vaqt ko'rinmaydi; mehmon ko'rinishi yangilanmaydi; APK yo'q) · T-064 (2-ekran sarlavhasi 0-ekran savoliga javob) · P-001 · P-002 · P-008 (≤3 blok; 8-ekranda taymer yo'q) · P-012 (testlar 3, 5, 7, 12 — ketma-ket emas) · P-013 · P-015 (reja grafiksiz, «ikki qurilma» aytilmaydi) ·
  P-016 · P-025 · P-026 (9 «Grafikka nuqta yetmaydi», 8 va 11 ekran videosi) · P-028 (ekran yozuvi — tugma nomi yozilmadi) · P-033 · P-036 · P-046 (9, 10, 11, 15 — o'quvchi ma'lumotidan) · P-052 · P-053 (keys `pre` kadr) · P-055 · P-062 (4-ekran Mentori sonni aytmaydi) · P-063 (`ZAL_SAVOL`, `OsishGrafigi`) · P-064 · P-067 ·
  S-001 (savollar 4–11 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 (bashoratlar bir o'lchovda, o'sish tartibida; keysda bitta) · S-018 (Uzum, «unicorn» izohi Mentor gapida) · S-019 (savoldagi son javobda yo'q) · S-020 · S-026 · S-027 · §144/§145 ·
  PM-005 (2-tur) · PM-017 · PM-018 (Uzum ichki qarori da'vo qilinmaydi — faqat bank) · PM-021 · PM-027 · PM-082 (darvoza-mashq, «…digan kod yozamiz», nusxa yo'q) · PM-108 (10-ekran tekshiruvi) · J-026 · SABOQ 1–31.
- [x] GATE M 06.10: MD tasdiqlandi (M-q4 A). Qurishdan oldin — ⛔ «qur»: `HtmlCompiler` dan o'qish, brauzer ko'rinishi, juftlik vaqti; 11-ekran varag'i va grafik telefonda (393 px) sig'ishi — vizual bosqichda (U-006).
