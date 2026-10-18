# 9-Modul · 1-dars (PM) «Loyihangiz kimga kerak?» — MD v3

Fayl: `src/7-Modull/PmProductProblemLesson.jsx` (kalit `m7-01`) · 17 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi. Dars yangi — hamma ekran noldan.
Tashqi audit (ChatGPT) Filtri: `01-FILTR.md` — 05.10.2026 qo'llandi (ta'rif — GATE M 01-q0 A, kod mashqi — 01-q1 A).
Pilot fidbeki F-1005-75…83 (qarorlar 76 A · 78 A · 79 A · 81 A · 83 A) va F-1005-85 (bashorat yopilmaydi, keyingi bosiladigan joy ko'rinadi) — 05.10.2026 kodga va shu MD ga qo'llandi (`QURUVCHI_SABOQ.md`).
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
  - Qator holatlari: bo'sh (kulrang uzuq chiziq — skelet) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent chegara) → xato (`err` fon).
    Kartada rangli yon chiziq yo'q — «mahsulot» belgisi faqat yorliqda (F-1005-79, qaror A).
  - Uch ko'rinish bitta komponentdan: **to'liq** (3 qator) · **ixcham** (nom + KIM qatori, s2) · **qator** (ro'yxatdagi bitta muammo: joy yorlig'i + gap, s1/s9/s10/s13).
  - KIM qatorida siluet yonida kichik yorliq: «ko'rsatish uchun» (kulrang) yoki «o'z ishi uchun» (yashil) — s0 va s2 shu farqdan ishlaydi (mezon — maqsad, manba emas).
  - Ishlatiladi: 0 (maket ostida) · 1 · 2 · 3 va 5 (javobdan keyin, kichik) · 4 · 6 (Dropbox kartasi) · 8 · 9 · 10 · 13. Dropbox (6) — o'z sahnasi `DropboxSahna` + shu karta.
- **Brend o'z maketida (PM-028, PM-029, S-018; F-1005-76/78/80):** brend nomi o'z rangida (`Brend`: Yandex Go — sariq fonda qora matn · Payme — moviy-yashil · Google Translate — ko'k ·
  Dropbox — ko'k · Telegram — ko'k · Uzum Market — binafsha), tanish maketda (telefon ekrani, brauzer oynasi, chat oynasi). Logotip chizilmaydi, emoji yo'q, to'qib chiqarilgan son yo'q.
- **Keyingi bosiladigan joy (F-1005-85, qat'iy):** har bosqichda keyingi bosiladigan element ajralib turadi — accent halqa doim, yengil to'lqin 2–3 marta;
  tanlov guruhida (variantlar, bashorat va MUAMMO tanlovlari, test javoblari) — har elementda yumshoq halqa va navbatma-navbat to'lqin. Yoqilgan pastki tugma («Davom etish», «Keyingi bosqich») ham halqada.
  `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (F-1005-85, qat'iy):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: N» ixcham qator bo'lib natija (`QTaxmin`) chiqquncha turadi (s2, s9);
  s6 3/5 da natija darhol chiqadi — bashorat kartasi tanlangan variant ✓/✗ bilan joyida qoladi.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Portfolio saytingizni oxirgi marta kim ochgan?** (46)
- Mentor: Saytingiz hozir ham internetda turibdi. Eslab ko'ring va bittasini tanlang.
- Maket (chap): brauzer oynasi — nuqtalar, manzil qatori `ismingiz.netlify.app`, sahifada portfolio skeleti (ism, yo'nalish, uch karta-skelet).
  Ekranga kirganda faqat brauzer; ixcham kartalar tanlovdan keyin chiqadi (javobga bog'liq vizual, F-1005-75). Bo'sh siluet-uyalar yo'q.
- Variantlar (radio, o'ng; bir uzunlikda):
  - O'zim — ishlayaptimi deb tekshirdim (35)
  - Mentor — vazifamni ko'rib chiqish uchun (39)
  - Do'stim — havolasini o'zim yuborgandim (38)
- Javob (uchalasida bir xil, maqtovsiz): Uchalasida sayt ishingizni ko'rish uchun ochilgan. Yandex Go'ni esa odam o'z ishi uchun ochadi — uyga yetib olish uchun. (120)
- **Harakat → Vizual o'zgarish:** variantni tanlash → ostida ixcham karta «Portfolio saytingiz» chiqadi: KIM qatorida tanlangan odam siluet bo'lib, yonida kulrang yorliq «ko'rsatish uchun»;
  bir lahzadan keyin yonida ikkinchi ixcham karta «Yandex Go» (nom sariq fonda) kirib keladi — yorlig'i yashil «o'z ishi uchun». Ikki karta bir balandlikda, pastki cheti bir chiziqda (F-1005-75).
  Mentor rejimida (proyektor) portfolio kartasida uchala odam: siz · mentor · do'stingiz. Jonli darsda ovozlar chizig'i.
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (to'lqin); tanlovdan keyin «Davom etish».
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
- Bashorat (ballsiz, 181): **To'rttadan nechtasini odamlar o'z ishi uchun ishlatadi?** · 1 · 2 · 3 — tanlov saqlanadi. Tanlangach ixcham qator: savol · «Taxminingiz: N»;
  yonida «Sizsiz bir kun» tugmasi chiqadi (halqa + to'lqin, F-1005-85). Qator natija chiqquncha turadi.
- Vizual (F-1005-76, qaror A): to'rtta ixcham auditoriya-karta bitta qatorda, ikki juftlik (telefonda 2 × 2). Har kartaning tepasida o'z maketi, ostida nom + KIM qatori:
  - **Portfolio saytingiz** — brauzer oynasi `ismingiz.netlify.app` (portfolio skeleti) · KIM: siz · mentor · do'stingiz («ko'rsatish uchun»)
  - **Telegram botingiz** («Telegram» o'z ko'kida) — telefonda Telegram chat oynasi: `/start` va javob pufaklari · KIM: siz · do'stingiz («ko'rsatish uchun»)
  - **Yandex Go** (nom sariq fonda) — sariq telefon ekrani, «Qayerga?» qatori · KIM: yo'lovchilar («o'z ishi uchun»)
  - **Payme** (nom o'z rangida) — Payme rangidagi telefon ekrani, «Hisobni to'ldirish» qatori · KIM: hisobi tugaganlar («o'z ishi uchun»)
  - Kartalar bir balandlikda; ikki juftlik orasida katta bo'sh joy yo'q.
- **Harakat → Vizual o'zgarish:** «Sizsiz bir kun» → tepada kun chizig'i yuradi: «ertalab» → «kechqurun» (3,6 s; quyosh nuqtasi binafsha rangga o'tadi).
  Shu vaqtda Yandex Go va Payme ekraniga odamlar (siluetlar) birin-ketin oqib keladi; to'qib chiqarilgan son yo'q — oqimni siluetlar ko'rsatadi.
  Portfolio va bot ekrani kulrang bo'lib qoladi, ustida «bugun hech kim ochmadi» chiqadi; ularning KIM qatoridagi siluetlar so'nadi, o'rniga kulrang yozuv «bugun hech kim ishlatmadi».
  Kun tugagach juftliklar ustida nom paydo bo'ladi (atama — misoldan keyin, bir marta): chap juftlik ustida **Loyiha tugadi** — «qurish ishi», o'ng juftlik ustida **Mahsulot** — «odamlar ishlatadi»;
  kartalarda yorliq «loyiha» / «mahsulot». O'ng nom oldida ingichka strelka chapga: Yandex Go va Payme ham bir vaqtlar loyiha bo'lgan (yorliq: «avval — qurish ishi»).
  Natija qatori (`QTaxmin`): «Taxminingiz: 3 · haqiqatda: 2» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Saytni qurish — loyiha. Tayyor saytni odamlar o'z ishi uchun ishlatsa, u mahsulot bo'lib ishlaydi. (98)
- Tugma (pastki): Sizsiz bir kun → Davom etish · `tugadi`: bashorat qatori yopiladi, to'rt maket-karta va ikki nom butun enga (199).
- O'qituvchi eslatmasi: Loyihani «yomon» demang — har mahsulot loyihadan boshlanadi. «Do'stim ham ochgan» desa, so'rang: ko'rish uchunmi yoki o'z ishi uchunmi?

## 3 · 1-savol  ← QTest (✔ 3-variant, `correctIdx 2`)
- Eyebrow: Tekshiruv · loyiha va mahsulot
- Savol: **Sinfingizda 4 ta Telegram bot bor. Qaysi biri mahsulot?** (8 so'z; «bot» odamga nisbat berib o'qilmasin — F-1005-77). Savol ustida yorliq yo'q (F-1005-82).
  - Egasi uni bir marta qurib, keyin ochmay qo'ygan (47)
  - Do'stlari egasining iltimosi bilan bir marta ochgan (51)
  - ✔ Sinfdoshlar uy vazifasini bilish uchun ishlatadi (48)
  - Egasi Demo Day'da ota-onalarga ishlatib ko'rsatadi (50)
- To'g'ri izohi: Sinfdoshlar botni o'z muammosi uchun ishlatadi.
- Xato izohlari: 1 — Bot qurildi, lekin uni hech kim ishlatmayapti. (46) · 2 — Do'stlar ko'rib qo'ydi — o'z ishi uchun emas. (45) ·
  4 — Ota-onalar botni ko'rdi, lekin o'zi ishlatmaydi. (48) · (umumiy) Kim ishlatadi va nima uchun — shuni qarang. (43)
- Ekranga kirganda savol ustida karta yo'q. To'g'ri javob topilgach savol ostida kichik ixcham karta chiqadi va to'g'ri javobni ko'rsatadi: **Telegram bot** · yorliq «mahsulot» ·
  KIM — sinfdoshlar (3 siluet) · «o'z ishi uchun» (yashil). Jonli darsda karta natija ochilgandan keyin chiqadi (F-1005-77).

## 4 · Uch mahsulot  ← QTushuncha (markaziy; «yechimdan muammoga»)
- Eyebrow: Tajriba · uch ishlaydigan mahsulot
- Sarlavha: **Bu mahsulot kimning qaysi muammosini yechadi?** (45)
- Mentor: KIM, MUAMMO, YECHIM — «Kim mening foydalanuvchim?» darsidagi auditoriya-karta. Ilovada odatda avval YECHIM ko'rinadi — kimga va qaysi muammoga kerakligini siz topasiz.
- Chap — ixcham qadam-qatori (`QQadamlar`, 163.8): 1 Yandex Go · 2 Payme · 3 Google Translate (joriy — accent, o'tgani ✓) va ostida brend rangidagi telefon maketi (F-1005-78, qaror A):
  telefonda YECHIM ko'rinadi — Yandex Go: sariq ekran, xaritada mashina va manzil belgisi, «Qayerga?», narx yorlig'i «narx: oldindan» (summa yozilmaydi) ·
  Payme: Payme rangidagi ekran, «Hisobni to'ldirish», raqam qatori, «To'ldirish» · Google Translate: ko'k ekran, «Inglizcha» → «O'zbekcha» oynalari.
  Logotip yo'q — faqat nom o'z rangida (PM-029). Telefonda (393) tartib: karta va tanlovlar tepada, qadamlar va telefon pastda.
  O'ng — to'liq auditoriya-karta (nom o'z rangida): YECHIM yozilgan, KIM va MUAMMO bo'sh.
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
- **Harakat → Vizual o'zgarish:** MUAMMO tanlovini bosish → to'g'ri bo'lsa MUAMMO qatoriga gap yoziladi, KIM qatorida siluetlar va matn paydo bo'ladi (yorliq «o'z ishi uchun»), qadam ✓.
  Telefon qisqa **«oldin»** kadrini ko'rsatadi (1,3 s, yorliq tepada): Yandex Go — ko'chada qo'l ko'targan odam, yonidan mashinalar o'tadi, yorliq «narx: ?» ·
  Payme — uydan do'konga yo'l, odam do'konga yuradi · Google Translate — ochiq lug'at, lupa so'zma-so'z yuradi, soat aylanadi.
  Keyin **«keyin»** kadri (1,7 s): mashina xarita bo'ylab keladi va narx yorlig'i chiqadi · «uydan to'ldirildi ✓» · tugma bosiladi, tarjima qatorlari bir zumda chiziladi.
  So'ng keyingi mahsulot kartasi kiradi. Xato bo'lsa tanlov silkinib qaytadi, MUAMMO qatori bir lahza `err` fon, bitta `QXato`:
  Bu gapda odam nimadan qiynalgani ko'rinmaydi. (45) — ikkala tuzoq bitta xato-sinf (S-040): xohish yoki rost fakt, qiynalish yo'q.
  42 soniya harakatsizlikda bitta ipucha (javobni aytmaydi): YECHIMga qarang: ilova bo'lmasa, odam nimadan qiynalardi?
- 3/3 dan keyin uch karta yonma-yon, ixcham to'liq ko'rinishda (nomlar o'z rangida, yon chiziq yo'q).
- Keyingi bosiladigan joy: uch MUAMMO tanlovi halqada (har yangi mahsulotda to'lqin).
- Xulosa: Bu uch mahsulot aniq odamlarning aniq muammosini yengillashtiradi. (66)
- Tugma (pastki): Muammoni toping (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, uch karta butun enga.
- Nishon: Product Spotter! (uchalasida birinchi urinishda).
- O'qituvchi eslatmasi: Har mahsulotda sinfdan bitta odamni so'rang: «Siz ham shunday qiynalganmisiz?» Javob «ha» bo'lsa — KIM qatori uning o'zi.

## 5 · 2-savol  ← QTest (✔ 2-variant, `correctIdx 1`; qo'llash — yangi mahsulot)
- Eyebrow: Tekshiruv · MUAMMO qatori
- Ekranga kirganda karta yo'q (F-1005-77). Savol ustida yorliq yo'q (F-1005-82).
- Savol: **Uzum Market uchun MUAMMO qatoriga nima yoziladi?** (7 so'z)
  - Ilovada chegirma ko'p bo'lishini xohlardi (41)
  - ✔ Kerakli narsani do'konma-do'kon qidirardi (41)
  - Shahar do'konlarida narsa juda ko'p turardi (43)
  - Telefonda buyurtma qilishni yaxshi ko'rardi (43)
- To'g'ri izohi: Odam nimadan qiynalgani ko'rinadi — ilova aynan shuni yengillashtiradi.
- Xato izohlari: 1 — Bu xohish — odam nimadan qiynalgani ko'rinmaydi. (48) · 3 — Bu rost gap, lekin unda hech kim qiynalmagan. (45) ·
  4 — Bu yechimni takrorlaydi — qiyinchilik yo'q. (43) · (umumiy) Ilovasiz odam nimadan qiynalardi — shuni toping. (48)
- To'g'ri javob topilgach savol ostida kichik auditoriya-karta chiqadi: **Uzum Market** (nom o'z rangida) · yorliq «mahsulot» · KIM — xaridorlar ·
  MUAMMO — Kerakli narsani do'konma-do'kon qidirardi (yashil) · YECHIM — Narsani telefonda topadi va yetkazib beradi. Jonli darsda — natija ochilgandan keyin.

## 6 · Dropbox  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Dropbox boshqalarga ham kerakligi qanday bilindi?** (49)
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; F-1005-81, qaror A). Sahnada faqat bosqich nomi va jonli maket; slayd ichida takror matn yo'q.
- Nuqtalar (5) · yorliq **Dropbox · N/5** (bashorat kartasida ham) · sahna `DropboxSahna` (chapda) + Dropbox auditoriya-kartasi (o'ngda, nom o'z ko'kida). Logotip yo'q.
- Sahna (F-1005-80): chizilgan CSS/SVG maket — stol yuzasi, noutbuk, monitor, fikr pufagi; har bosqichda o'zgaradi. 2/5 dan boshlab sahna burchagida nom-yorliq «Dropbox» o'z ko'kida.
  Sahnaga MD va manbada yo'q narsa qo'shilmaydi: avtobus, asoschi ismi va yil chizilmaydi.
- Bosqichlar (nom · Mentor · sahna):
  - 1/5 **Avtobusda, fleshkasiz** — Mentor: Drew Houston Bostondan Nyu-Yorkka avtobusda ketayotgan edi. Yo'lda ishlamoqchi edi, lekin fayllari bor fleshka uyda, stol ustida qolgan.
    (F-1005-89, qaror B: GATE M matni aynan; avtobus sahnada chizilmaydi)
    · brend tanishtiruvi (sahna ustidagi qator): **Dropbox** (o'z ko'kida) — fayllarni internetda saqlab, istalgan kompyuterdan ochadigan xizmat · yonida tanish ko'rinish:
      papkaga qo'yilgan fayl ikkinchi kompyuter ekranida ham paydo bo'ladi.
    · sahna: noutbuk ekranida «fleshka ulanmagan», USB uyasi bo'sh va qizil miltillaydi; fikr pufagida uy (deraza, stol, chiroq) va stol ustida fleshka, yorliq «uyda».
    · karta: MUAMMO — Fayllar bor fleshka uyda qolgan.
  - 2/5 **O'z muammosi uchun dastur** — Mentor: Shu muammoga qayta duch kelmaslik uchun u fayllarni internet orqali istalgan kompyuterda ochadigan dastur yoza boshladi.
    · sahna: noutbuk va monitorda bir xil papka (ko'k); fayl noutbukdan bulut («internet») orqali monitorga uchib o'tadi va u yerda paydo bo'ladi.
    · karta: YECHIM yoziladi; KIM qatorida bitta siluet «o'zi».
  - 3/5 **Video va kutish ro'yxati** — Mentor: Dastur hali hamma uchun tayyor emas edi. U qanday ishlashini ko'rsatadigan video chiqdi — xohlaganlar kutish ro'yxatiga yozilardi.
    · sahna: video pleer (play bosiladi, chiziq yuradi; ekranda papka sinxronlanadi) va «Kutish ro'yxati» formasi (@ qatori, «Yozilish»). Hisoblagich yo'q — javobni ochmaydi.
    · bashorat (sahna ostida, bitta qator): **Bir kunda nechta odam yozildi?** · Yuzlab odam · Minglab odam · ✔ O'n minglab odam (zinapoya, S-015)
  - 4/5 **Bir kunda 75 000 kishi** — Mentor: Video chiqqach, bir kun ichida 75 000 kishi kutish ro'yxatiga yozildi. Ular dasturni o'z fayllari uchun kutayotgan edi.
    · sahna: kichik video yonida ro'yxat qatorlari (siluet + chiziq) tez oqadi, hisoblagich 0 → 75 000, keyin oqim sekinlashadi.
    · karta: KIM qatoriga siluetlar oqib kiradi.
  - 5/5 **Boshqalarga ham kerak** — Mentor: Kutish ro'yxati shu muammo o'n minglab odamda borligini ko'rsatdi. Kartaning KIM qatoriga qarang.
    · sahna: bitta odam «o'zi» (fikr pufagida fleshka) → strelka → olomon (48 siluet to'lqin bo'lib chiqadi), ostida «75 000».
    · karta: KIM qatori siluetlar bilan yozilib chiqadi; karta yorlig'i almashmaydi (75 000 — kerakligining belgisi, «mahsulot bo'ldi» chegarasi emas — audit 3).
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: o'n minglab» yoki «Taxminingiz to'g'ri chiqdi». Bashorat kartasi tanlangan variant ✓/✗ bilan joyida qoladi (F-1005-85).
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi; karta qatorlari bosqichma-bosqich yoziladi.
- Xulosa (5/5 dan keyin, pastda, yashil): Dropbox bitta odamning muammosidan boshlangan. Kutish ro'yxati u boshqalarga ham kerakligini ko'rsatdi. (103)
- Tugma (pastki): Keyingi bosqich (N/5) → Davom etish
- O'qituvchi eslatmasi: Dropbox nomini bilmasliklari mumkin — izohning o'zi yetadi. Raqam manbadan; boshqa raqam qo'shmang.
- Manba (o'quvchi ko'rmaydi, fakt tekshiruvi 05.10.2026):
  - Avtobus, Boston → Nyu-York, fleshka uyda qolgan; dastur 2007-yilda yozila boshlagan — MIT News, 2012: https://news.mit.edu/2012/dropbox-ceo-alumnus-drew-houston-commencement-speaker-1113
  - «bu muammoga boshqa duch kelmaslik» (Houston so'zi) — Fortune, 14.06.2017: https://fortune.com/2017/06/14/founder-dropbox-got-idea-chinatown-bus
  - Demo video, 24 soat ichida 75 000 kishi kutish ro'yxatiga yozildi — TechCrunch, 01.11.2011, «How Dropbox Got Its First 10 Million Users»: https://techcrunch.com/?p=442136
  - «Ular dasturni o'z fayllari uchun kutayotgan edi» — bizning xulosamiz (ro'yxatga yozilish = dasturni o'zi uchun so'rash), manbada so'zma-so'z yo'q.
  - Sahnada avtobus, asoschi ismi va yil chizilmaydi (F-1005-80). Mentor gapida 1/5 GATE M matni (ism, avtobus) qoladi (F-1005-89 B).

## 7 · 3-savol  ← QTest (✔ 4-variant, `correctIdx 3`; Dropbox qoidasi o'quvchi olamiga)
- Eyebrow: Tekshiruv · Dropbox'dagidek
- Savol: **O'zingiz uchun qurgan jadval botingiz boshqalarga ham kerakligini qachon bilasiz?** (10 so'z) · savol ustida yorliq yo'q (F-1005-82)
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
- **Harakat → Vizual o'zgarish:** qatorni yozib «Saqlash» → kartaga qator kiradi, joriy belgi keyingi qatorga o'tadi; to'rt qator to'lsa doira ✓,
  keyingi doira joriy. Tekshiruvdan o'tmagan qator `err` fonda, ostida bitta `QXato`. 3/3 da forma yopiladi, uch karta yonma-yon butun enga (199), har kartada ✎ Tahrirlash. Yon chiziq yo'q (F-1005-79).
- Keyingi bosiladigan joy (F-1005-85): joriy qator accent chegarada (bir necha to'lqin); qatorga yozilgach «Saqlash» halqada.
- Xulosa: Uch mahsulot kartangiz tayyor: har birida yechim kimningdir muammosini yengillashtiradi. (88)
- Tugma (pastki): Uch kartani yozing (N/3) → Davom etish
- Mentor rejimi: forma o'rniga 4-ekrandagi Yandex Go kartasi (namuna); o'quvchilar o'z telefonida yozadi. Mentor statistikasi: «Uch kartani yozganlar».
- O'qituvchi eslatmasi: Eng ko'p xato — MUAMMO qatoriga yechimni qayta yozish («video ko'rsatadi»). «Ilova bo'lmasa, nima qilardingiz?» deb so'rang.

## 9 · Mentorning ro'yxati  ← QTushuncha (F-1005-83, qaror A — ketma-ket karta)
- Eyebrow: Tushuncha · muammo yig'ish
- Sarlavha: **Qaysi yozuv Mentor ro'yxatiga tushadi?** (38)
- Mentor: Kecha maktab, yo'l va mahallada ko'rganlarimni yozib chiqdim. Har yozuvni ro'yxatga qo'shing yoki chiqarib tashlang.
- Bashorat (ballsiz): **Olti yozuvdan nechtasi muammo?** · 3 · 4 · 5 — tanlov saqlanadi. Tanlangach ixcham qator «Taxminingiz: N» natija chiqquncha turadi (F-1005-85).
- Chapda — joriy yozuv bitta katta karta: manba yorlig'i (MAKTAB / YO'L / MAHALLA), «N / 6», gap; ostida uch belgi yorlig'i: **uch belgi** · qayta-qayta bo'ladi · o'zicha yo'l topgan · voz kechgan
  («Muammoni qanday topamiz» darsidan; alohida eslatma qatori yo'q). Karta ostida ikki tugma: **Chiqarib tashlash** · **Ro'yxatga** (bashoratdan keyin yoqiladi, halqada).
- O'ngda — Mentor ro'yxati, ixcham: sarlavha «Mentor ro'yxati» + hisoblagich «6 / 10» va faqat yozilgan qatorlar (bo'sh uzuq qator yo'q):
  1. maktab — Tanaffusda telefonni quvvatlash uchun bo'sh rozetka topilmaydi.
  2. maktab — To'garak qaysi xonada ekanini bilmay, o'quvchilar xonama-xona yurishadi.
  3. yo'l — Maktab oldida velosiped qo'yadigan joy yo'q — daraxtga bog'lab ketishadi.
  4. yo'l — Kechqurun ko'cha chirog'i yonmaydi — o'smirlar telefon chirog'ini yoqib yurishadi.
  5. mahalla — Suv qachon o'chirilishini qo'shnilar kech bilishadi — idish to'ldirishga ulgurishmaydi.
  6. mahalla — Lift buzilganini odamlar uzoq kutib turgandan keyin bilishadi.
  Yozuvlar (bittadan, shu tartibda):
  - yo'l — Velosiped g'ildiragi teshilsa, ustaxonani topolmay uyga yetaklab ketishadi. — *muammo*
  - mahalla — Mahallaga yana bitta maydon qurish kerak. — *yechim*
  - mahalla — Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak. — *muammo (maydon)*
  - maktab — Futbol — eng qiziq o'yin. — *fikr*
  - maktab — Oshxonada bugun nima borligini bilish uchun navbatga turib ko'rishadi. — *muammo*
  - mahalla — Eski darsliklarni kimga berishni bilmay, o'quvchilar ularni uyda yillab saqlaydi. — *muammo*
- **Harakat → Vizual o'zgarish:** «Ro'yxatga» yoki «Chiqarib tashlash» → to'g'ri bo'lsa karta o'ngdagi ro'yxatga uchib kiradi (yangi qator yashil bo'lib kiradi, hisoblagich 6/10 → 7/10 …),
  chiqarilgani chetga so'nib ketadi; keyingi yozuv kartasi pastdan kiradi. Telefonda (393) ro'yxat pastda — karta pastga uchadi.
  Xato bo'lsa karta silkinadi (chegara `err`), bitta `QXato`:
  - yechimni ro'yxatga qo'shsa: Bu yechim — kim nimadan qiynalgani yozilmagan. (46)
  - fikrni ro'yxatga qo'shsa: Bu fikr — hech kim qiynalgani ko'rinmaydi. (42)
  - muammoni chiqarsa: Bu yerda odam qiynalgan — belgisini toping. (43)
  42 soniya harakatsizlikda bitta ipucha: Har yozuvda odam qiynalganmi — shuni qarang.
- 2-bosqich (6/6 dan keyin, shu ekranda, harakatsiz): ro'yxat bitta ixcham qatorga yig'iladi — «Mentor ro'yxati · muammolar yig'ildi · 10 / 10 ✓» (F-1005-90 B: kulrang chiziqlar yo'q)
  → ostida maydon yozuvi to'liq auditoriya-kartaga aylanadi:
  **Maydon** · KIM — o'yinchilar (maydonda o'ynaydigan o'smirlar) · MUAMMO — Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak. · YECHIM — uzuq chiziq «hali yo'q».
  Natija qatori (`QTaxmin`) — bashorat bo'yicha. Yakun holati 1280×773 da pastki panel ostiga kirmaydi.
- Xulosa: Mentor maydon muammosini tanladi: uni maydonda o'ynaydiganlardan so'rab bilish mumkin. (86)
- Tugma (pastki): Yozuvlarni joylang (N/6) → Davom etish · `tugadi`: karta paneli yopiladi, yig'ilgan ro'yxat va maydon kartasi butun enga.
- Nishon: Clean List! (oltitasi birinchi urinishda).
- O'qituvchi eslatmasi: Maydon — modul bo'yi misolimiz. Bugun yechim aytmang: «sayt qilamiz» deyish erta, avval o'yinchilarning o'zidan eshitiladi.

## 10 · Juftlikda ish  ← QMustaqil (USTAXONA 2 — o'nta muammo, sinfdosh bilan)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Sinfdoshingiz kecha qayerda qiynaldi?** (37) · yakka rejimda: **Kecha kim qayerda qiynaldi?** (27)
- Mentor: Sherigingizga pastdagi savollarni bering, keyin o'rin almashing. Eshitganingiz va o'zingiz ko'rganingizni bittadan yozing.
  Yakka rejimda (sherik yo'q): Pastdagi savollarni o'zingizga bering va kecha ko'rgan odamlaringizni eslang. Har muammoni bittadan yozing.
- Savollar (`QIzoh` ostida, uch qator — uch belgidan):
  1. Qayerda har safar kutishga to'g'ri keladi?
  2. Nimani bilish uchun kimdandir so'radingiz?
  3. Nimadan voz kechib, qaytib ketdingiz?
- Qadamlar 1/2/3: 1 Sherigingizdan so'rang (taymer 3 daqiqa) · 2 O'rin almashing (taymer 3 daqiqa) · 3 O'zingiz ko'rganlarni qo'shing.
  Yakka rejimda (sherik yo'q) 1–2-qadam o'rniga bitta: Kecha ko'rgan odamlaringizni eslang.
- Bitta ustun: tepada o'nta nuqta (yozilgani ✓, joriysi accent) + hisoblagich n / 10 → bitta yozish qatori → Yordam · «Saqlash» o'ngda.
- Qator ipuchasi: Kim, qayerda, nimadan qiynaldi?
- Keyingi bosiladigan joy (F-1005-85): juftlikda birinchi muammogacha «3 daqiqani boshlash» halqada; taymer boshlangach (yoki yakka rejimda) bo'sh yozish qatori halqada; gap yozilgach «Saqlash» halqada.
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
- Savol: **Qaysi muammo haqida avval odamlardan so'raysiz?** (6 so'z) · savol ustida yorliq yo'q (F-1005-82)
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
- Vizual: 10-ekrandagi ro'yxat (qator-kartalar, halqada). Bittasini bosish → ro'yxat yig'iladi va tanlangan muammo to'liq auditoriya-karta bo'ladi: MUAMMO — tanlangan gap ·
  KIM — bo'sh qator (joriy, accent) · YECHIM — uzuq chiziq «hali yo'q»; karta ostida «Boshqa muammoni tanlash» (ro'yxatni qayta ochadi). Karta va xulosa
  1280×773 da pastki panel ostiga kirmaydi. 10-ekran yozilmagan bo'lsa (mentor rejimi) — Mentorning maydon kartasi, KIM yozilgan.
- KIM qatori ipuchasi: Bu muammo yana kimlarda bor?
- **Harakat → Vizual o'zgarish:** qator-kartani tanlash → to'liq karta; taymer → aytish; KIM yozilgach (≥8 belgi) qatorga siluetlar to'plami chiqadi; YECHIM bo'sh qoladi.
- Xulosa (yozgach): Mahsulot shunday kartadan boshlanadi: KIM va MUAMMO bor, YECHIM hali bo'sh. (75)
- Taymer tugmalari: 1 daqiqani boshlash · To'xtatish · ↻ Yana 1 daqiqa (yakka rejimda — 30 soniya)
- Tugma (pastki): KIM qatorini yozing → Davom etish

## 14 · Natijalar (podium)  ← QNatija
- Platforma standarti (jonli reyting · yakka rejimda o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Qaysi bot mahsulot · 2 — MUAMMO qatori · 3 — Boshqalarga kerakligi · 4 — Avval kimdan so'raysiz

## 15 · Takrorlash  ← QKartochka
- Sarlavha: O'zingizni sinab ko'ring.
- Mentor yo'q (KORPUS §61). Karta ostida, birinchi bosishgacha: Kartani bosing — javob ochiladi · karta yuzi halqada (F-1005-91 B).

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
2. **`AudKarta`** — bitta vizual (180): uch ko'rinish (`toliq` · `ixcham` · `qator`), qator holatlari (bo'sh/yozildi/joriy/xato), KIM siluetlari (CSS), yorliq «ko'rsatish uchun» / «o'z ishi uchun»,
   karta yorlig'i «loyiha» / «mahsulot»; `ust` — karta tepasidagi maket (s2). Rangli yon chiziq yo'q (F-1005-79). Manba `KARTALAR`; `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda e'lon qilinadi.
   **`Brend`** (nom o'z rangida, logotipsiz) · **`Telefon`** (CSS ramka, ekran brend rangida: `kichik` s2 / `katta` s4) · **`Bashorat`** (QBashorat → tanlangach ixcham «Taxminingiz: N», F-1005-85).
   Keyingi bosiladigan joy (F-1005-85): `pp-bos` / `pp-bos-nav` (halqa + 3 to'lqin; NavNext yoqilganda o'zi), tanlov guruhlari CSS `:has()` bilan (variant, bashorat tanlovi, test javobi, s4/s11 tanlovlari,
   s9 tugmalari, s13 qatorlari, joriy qator); `reduced-motion` — halqa qoladi, to'lqin yo'q.
3. **`NARSALAR`** (s0, s2): 4 narsa `{ nom, kim: [{t, nega}], nega }`, `nega: 'korsatish' | 'ozIshi'` (yorliq «ko'rsatish uchun» / «o'z ishi uchun»).
4. **`MAHSULOTLAR`** (s4): 3 ta `{ nom, yechim, muammo, tuzoq: [2], kim }`; s5 `UZUM` kartasi alohida (KIM, YECHIM).
5. **`ROYXAT_MENTOR`** (s9): 6 tayyor + 6 yozuv `{ joy, t, tur: 'muammo' | 'yechim' | 'fikr', maydon? }`; 2-bosqichda `maydon: true` qator → `AudKarta toliq`. s11 `yozuvlar` — shu ro'yxatdan 4 ta `{ joy, matn, tur }` (matn qisqartirilgan).
6. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); javob 120 belgi; kartalar tanlovdan keyin (`.pp-juftlik` stretch — bir balandlik), KIM siluet + «ko'rsatish uchun», ikkinchi ixcham karta (Yandex Go, «o'z ishi uchun»).
7. s2: `S2Maket` (brauzer · Telegram chat · Yandex Go · Payme), bashorat (1/2/3) → ixcham qator + «Sizsiz bir kun» yonida · `S2_KUN` 3,6 s kun chizig'i · odamlar oqimi (siluet, son yo'q) ·
   loyiha ekrani kulrang + «bugun hech kim ochmadi» · nomlar «Loyiha tugadi — «qurish ishi»» / «Mahsulot — «odamlar ishlatadi»» + strelka «avval — qurish ishi» · `QTaxmin`.
8. s4: `QQadamlar` 3 qadam (ixcham, bir qator); `S4Ekran` brend telefoni: `yechim` → `oldin` (1,3 s) → `keyin` (1,7 s) → keyingi mahsulot; tanlov tartibi aralash (to'g'ri o'rni har qadamda boshqa);
   `QXato` bitta matn; 42 s ipucha; nishon `productSpotter`. Telefonda (393) karta va tanlovlar tepada.
9. s6: `DROPBOX_BOSQICH` 5 × { h — bosqich nomi, m — Mentor gapi } (F-1005-81); `DbTanishuv` (1/5 brend qatori) + `DropboxSahna` (noutbuk/USB/fikr pufagi · fayl bulut orqali uchadi ·
   video pleer + «Kutish ro'yxati» formasi · ro'yxat oqimi + hisoblagich 0 → 75 000 · olomon) + `AudKarta`; bashorat 3/5 (zinapoya, ballsiz); 5/5 da karta yorlig'i almashmaydi; manba izohi faylda.
10. s8 artefakt: `localStorage` `pm-m7d1-ilovalar` = `[{ nom, yechim, muammo, kim } × 3]`; tekshiruv yumshoq (ikkinchi «Saqlash» bilan o'tadi); mentor rejimida namuna karta.
11. s9: ketma-ket karta (`UCH_BELGI` yorliqlari, `Ro'yxatga` / `Chiqarib tashlash`, uchish `S9_UCH` 430 ms), ixcham ro'yxat «n / 10» (bo'sh qator yo'q), 3 `QXato`, bashorat 3/4/5 (ixcham qator),
    2-bosqich: ro'yxat yig'iladi → maydon kartasi ajralib chiqadi; nishon `cleanList` (birinchi urinish, yozuvlar to'plami o'zgarmagan).
12. s10 artefakt: `pm-m7d1-muammolar` = `{ muammolar: [{ matn, manba: 'sinfdosh' | 'ozim' } × 10], savedAt }`; `PairTimer` 3 + 3 daqiqa; manba yorlig'i qadamdan.
    `saveHint` — m2-16 xabarlari, LEKIN m2-16 dagi `RE_YECHIM` (`kerak\b`) bu yerda ishlatilmaydi: maydon muammosining o'zi «…qo'ng'iroq qilish kerak» bilan tugaydi.
    Yechim faqat gap «… qurish kerak / qilish kerak» shaklida va unda odam so'zi (o'quvchi, odam, qo'shni, o'yinchi, -lar …) bo'lmasa. `optionalLive`.
13. s11: `KOD_TASK` (`muammolar`), starter, 3 `evalEquals` (ikki muammo matni · `[]` · bitta matn), darvoza `joy` / `matn` / `tur`; kod nusxalanmaydi (PM-082 d); «kompilyator» ta'riflanmaydi — «kod oynasi».
14. s13 artefakt: `pm-m7d1-tanlangan` = `{ matn, kim }` — 2-dars kirishi (TAYANCHGA SAVOL 3). `PairTimer` 1 daqiqa / 30 soniya (▶ ⏹ belgisiz). Tanlovdan keyin ro'yxat yig'iladi, «Boshqa muammoni tanlash».
15. Testlar s3/s5/s7/s12 — `correctIdx` 2/1/3/0 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
    Savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q (F-1005-82). s3/s5 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (F-1005-77).
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
- [x] Ko'rildi (05.10.2026, F-1005-75…85 tuzatishidan keyin, surat 1280×773 va 393): s2 to'rt maket-karta + ixcham bashorat 393 da 2 × 2, gorizontal skroll yo'q;
  s9 ketma-ket karta — bir ekranda bitta yozuv, yakun 1280×773 da pastki panel ostiga kirmaydi; s13 xulosa 773 da ko'rinadi (10 muammo bilan sinaldi).
