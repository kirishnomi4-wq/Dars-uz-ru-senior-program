# 9-Modul · 8-dars (PM + amaliyot) «Yaxshi interfeysdan nimani olasiz?» — MD v3

Fayl: `src/7-Modull/PmDesignMotionLesson.jsx` (yangi) · kalit `m7-08` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; GATE M P-q0 + F-1005-88) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yo'q edi — hamma ekran noldan. Namuna: PM qismi — `F-0929-QA-6modul/14-PmLesson25-v3.md`, amaliyot bloki — `F-0929-QA-6modul/08-PipelineProject-v3.md`.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi.
Testlarda to'g'ri javob o'rni (yangi dars, shu MD bilan belgilanadi): 3-ekran = **B** (`correctIdx 1`) · 8-ekran = **A** (`0`); arena A·B·C·D har biri 3 marta.
Vaqt: ≈ 85 daqiqa — PM qismi (0–5) ≈ 22 · Amaliyot 1 ≈ 23 (o'z g'oyasi qadami bilan) · Amaliyot 2 ≈ 20 · yakuniy savol, podium, yakun ≈ 12.
Tuzilma (GATE M P-q0, 05.10): PM+PRAKT — 12 ekran: PM nazariya 0–5 → A1 · A2 → yakuniy savol · podium · kartochkalar · yakun (F-1005-88: kartochka alohida ekran, foydalanuvchi qarori 05.10). Eski 5-ekran testi va 6-ekran mustaqil ishi olindi (mustaqil ish — A1 5-qadamida); animatsiya talabi amaliyotdan oldinga o'tdi.
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
  Bugun: dizayner ekranidan bitta usul → Maydon'ga (A1) → animatsiya talabi → ro'yxat va sahifa o'tishi (A2). O'quvchining o'z g'oyasi — A1 5-qadamdagi usul kartasi va har blokning 5-qadami.
- **Hook:** dizayner ekrani va Maydon yonma-yon → «Dizayner ekranidan Maydon'ga nimani olasiz?» → o'yinchining savoli «Bugun qaysi vaqt bo'sh?» — Maydon'da kechki kataklar ekrandan pastda.
- **O'yinchining savoli** (intervyudan, tayanch: 5 kishidan 4 tasi — «oxirgi marta kelganimizda maydon band edi»; «kechqurun» olindi — intervyuda yo'q, audit 4): **«Bugun qaysi vaqt bo'sh?»** — dars bo'yi bitta pufak.
- **Maydon ma'lumoti (`KATAKLAR`, bitta manba — 180):** 6 vaqt katagi, 16:00 … 21:00 (GATE M K1). Shanba: band — 17:00, 20:00; qolgani bo'sh (18:00 bo'sh — 10-darsdagi sinov vazifasi bilan mos).
  Yakshanba: hammasi bo'sh (repo bilan bir xil — namuna bandlar faqat shanbada). Katakda: soat (`18:00`) va holat (`bo'sh` / `band`). (TAYANCHGA SAVOL 1–2.)
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
- Javob — 2-variant: **Aynan!** Bu misolda rang va rasm faqat ko'rinishni o'zgartiradi. O'yinchiga vaqtlar qanday ko'rsatilgani yordam beradi. (F-1005-93 A: «esa» olindi)
  ✎ (quruvchi, 05.10) Kodda «esa» olingan: «O'yinchiga vaqtlar qanday ko'rsatilgani yordam beradi.» — `lint:olchov` «Aynan!» bilan sanaydi: 121 > 120 (MD dagi 114 — «Aynan!»siz). MD ga taklif: shu so'z olinsin.
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
    ✎ (quruvchi) Kodda bo'laklar MD tartibida (fon → rasm → tasma → to'r): to'p qo'yilganda bitta ustunda 1 katak to'liq ko'rinadi, keyingisi kesilgan («4 tasi» emas); to'r qo'yilgach (to'p va tasma bilan ham) 6 katak ko'rinadi.
  - Kunlar tasmasi → Maydon tepasida yetti kun; Yakshanbani bir bosishda ochish mumkin · karta ostida (yashil): «Boshqa kun-chi?» savoliga javob · pufak o'z savolida qoladi.
  - Vaqtlar to'ri → kataklar uch ustunga yig'iladi, kechki kataklar ko'rinadi (17:00 band · 18:00 bo'sh · 19:00 band · 20:00 band · 21:00 bo'sh) ·
    ✎ (quruvchi) Kodda kataklar `KATAKLAR` dan (A-bo'lim, K1): Shanba band — 17:00 va 20:00; 19:00 — bo'sh (bu qatordagi «19:00 band» A-bo'lim bilan zid).
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
  ✎ (quruvchi) SABOQ 8 va 2: bu gap kodda 1/5 sahnasida brend tanishuvi bo'lib turadi (ikki qator: «Tweetie — …», «Twitter — …», nom o'z rangida); Mentor har bosqichda bosqich gapini aytadi, bashorat bosqichida — oldingi gapda qoladi.
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

## 5 · Animatsiya talabi  ← QTushuncha (amaliyotdan oldin — GATE M P-q0)
- Eyebrow: Tushuncha · animatsiya talabi
- Sarlavha: **Animatsiya talabida nima aytiladi?** (34)
- Mentor: 5-darsda animatsiyani qo'lda yozgansiz, bugun uni agent yozadi — har qismdan bittasini tanlang.
- Chap — talab uch qismdan (`QQadamlar` uslubida: 1 Qayerda · 2 Nima qilsin · 3 Nima buzilmasin; joriy — accent, o'tgani ✓), har qismda variant-tugmalar:
  - Qayerda: «Saytda» · «Vaqt kataklari to'rida»
  - Nima qilsin: «Chiroyli harakat qo'shilsin» · «Motion bilan animatsiya qilinsin» · «Kataklar birin-ketin kirsin, hammasi 0,4 soniyada»
  - Nima buzilmasin: «Hech narsa yozilmagan» · «Katak bosilgandagi mikro-harakat qolsin»
- O'ng — Maydon (*to'r* holatida — 2-ekranda tanlangan usul; A1 da quriladi) + «Qayta ko'rish» (ikkinchi tugma); variant tanlanganda maket o'zi ham bir marta yuradi.
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

## 6 · Amaliyot 1 — vaqtlar to'ri  ← amaliyot bloki (QBlok, ≈23 daq — o'z g'oyasi qadami bilan)
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
  5. **O'z g'oyangiz** — Dribbble yoki Behance'da g'oyangizga yaqin ishni oching (qidiruvga inglizcha: masalan, `booking app`). Rangga emas, foydalanuvchingizning savoliga qarang.
     Uch savolga javob yozing — ular shu promptning qavslariga tushadi: foydalanuvchingiz nimani tezroq topishi kerak? · qaysi usul unga yordam beradi? · uni qayerga qo'yasiz?
     «Nusxalash» — uyda o'z loyihangizda Antigravity'ga berasiz.
     > Joy — **{qayerga qo'yasiz}**. Shu usulni qo'sh: **{usul}**. U «**{foydalanuvchi savoli}**» savoliga javob bersin.
     > **{nima buzilmasin}** o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     (Uch javob formadan qavslarga o'zi qo'yiladi; «nima buzilmasin»ni o'quvchi yozadi. Tekshiruv — eski mustaqil ishdagidek: 1-javob bo'sh yoki juda qisqa — «Foydalanuvchining savoli yoki vazifasini aniq yozing.» (bloklaydi);
     2-javobda bezak so'zi — «Bu bezakka o'xshaydi — u qaysi savolga javob beradi?» (maslahat). Sayt ochilmasa — dizayner ekranidagi ikki usuldan birini oling. PM-020: har qiymat «Joy — …» shaklida.)
- O'qituvchi eslatmasi (5-qadam): izlashga 5 daqiqa bering; Dribbble va Behance kirishsiz ochiladi — sinf tarmog'ida darsdan oldin tekshiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (telefon maketi): Maydon · ‹ Shanba › · to'r 3×2:
  16:00 bo'sh · 17:00 band · 18:00 bo'sh · 19:00 bo'sh · 20:00 band · 21:00 bo'sh
- Hammasi bajarilgach (yashil): Butun kun bir qarashda — o'yinchi kechki bo'sh vaqtni pastga surmasdan topadi. (79)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-08-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- Izoh (MD): «{ustunlar soni}» — Mentor misolida 3 (telefonda «18:00» va «bo'sh» sig'adi); o'quvchi 4 yozsa, 4-qadamda o'zi ko'radi.

## 7 · Amaliyot 2 — ro'yxat va sahifa o'tishi  ← amaliyot bloki (QBlok, ≈20 daq)
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
  Yakshanba o'ngdan kiradi (hammasi bo'sh) → ‹ → Shanba chapdan qaytadi.
- Qator (`QIzoh`, natija ostida): Yo'nalish vaqtni his qildiradi: keyingi kun o'ngdan kiradi, oldingisi chapdan qaytadi. (86)
- Hammasi bajarilgach (yashil): Maydon jonli: kataklar birin-ketin kiradi, kun silliq almashadi, bosish o'zgarmadi. (81)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-08-done`
- Nishon (bonus): Live Maydon — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- Izoh (MD): «{soniya}» — 8-ekrandagi 0,4. «Yangi paket o'rnatma» — Motion 5-darsdan `web/` da bor; texnologiya nomi promptda yo'q (173.4).

## 8 · 2-savol  ← QTest (✔ A, `correctIdx 0`; yakuniy)
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

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 3 savol + 2 blok «Bajardim» (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — Kinodagi usul · 5 — Asosiy savolga usul · 9 — Talabdagi vaqt
  ✎ (quruvchi) Ballik ekranlar 3 va 8 (q22): kodda «1 — Kinodagi usul» · «2 — Talabdagi vaqt»; «5 — Asosiy savolga usul» — olingan eski testdan.

## 10 · Takrorlash  ← QKartochka (alohida ekran — F-1005-88, foydalanuvchi qarori 05.10)
- Sarlavha: O'zingizni sinab ko'ring.
- 12 karta — «Kartochkalar» jadvali.
- Mentor yo'q (KORPUS §61). Karta ostida, birinchi bosishgacha: Kartani bosing — javob ochiladi · karta yuzi halqada (F-1005-91 B).
- Tugmalar: Orqaga · Yakunlash → (platforma shakli)

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
  ✎ (quruvchi) Ballik test 2 ta (s3, s8) — kodda «N/2 to'g'ri».
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
  - (Usul kartasi shu yerda ko'rinadi — A1 5-qadamdagi uch javob.)
- Keyingi dars — «Loyiha kuni: MVP tayyor». Bugun Maydon jonli ko'rindi; o'sha darsda band qilish ishlaydi, maydon egasi o'z sahifasini oladi va Maydon internetga chiqadi.
- Nishonlaringiz — N/4 (mentor rejimida yo'q)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Pattern Picker!** — Maydon'ga eng muhim savolga javob beradigan usulni tanladingiz (2)
- **Idea Hunter!** — O'z g'oyangiz uchun usul kartasini yozdingiz (A1, 5-qadam)
- **Motion Writer!** — Animatsiya talabini uch aniq qismdan yig'dingiz (5)
- **Live Maydon!** — Ikki amaliyot blokini oxirigacha bajardingiz (7) — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Usul va bezak** — 1 Usul — boshqa interfeysda ishlatilgan va foydalanuvchining vazifasini osonlashtiradigan ko'rinish yoki harakat. · 2 Bezak — bu misolda vazifani o'zgartirmay, faqat ko'rinishni o'zgartiradigan detal. ·
  3 Har bo'lakdan so'rang: u foydalanuvchining qaysi savoliga javob beradi? — savol: 3-ekran savoli

- **8 · Animatsiya talabi** — 1 Qayerda: harakat qaysi joyda bo'ladi. · 2 Nima qilsin: qanday harakat va necha soniya. ·
  3 Nima buzilmasin: qaysi eski animatsiya qolishi kerak. — savol: 8-ekran savoli

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Interfeys usuli nima? | Boshqa interfeysda ishlatilgan va vazifani osonlashtiradigan ko'rinish yoki harakat | «Arxitektura patternlari»dagi pattern kabi — tayyor rasm emas |
| Bezak nima? | Bu misolda: vazifani o'zgartirmay, faqat ko'rinishni o'zgartiradigan detal | Rang holatni bildirsa — u bezak emas, axborot |
| Dribbble'da nima ko'rasiz? | Dizaynerlar ishidan ekranlar | Qidiruvga inglizcha yozasiz: `booking app` |
| Nega dizayner ekranini butunligicha ko'chirmaysiz? | U boshqa foydalanuvchi va boshqa savol uchun chizilgan | Bu misolda rang va rasm faqat ko'rinish |
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
1. **Yangi fayl** `src/7-Modull/PmDesignMotionLesson.jsx` — skeletdan (pilotdan emas, JR-14); palitra `qolipRang('pm')`; `SCREEN_META` 12:
   hook · plan · concept · test · keys · concept · practice · practice · test · stats · flashcards · summary (F-1005-88). `LESSON_META.lessonId` — `m7-08-v1`.
2. **Ekran turlari:** s0 `QKirish` · s1 `QReja` · s2/s5 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s4 `QVoqea` ·
   s6/s7 `QBlok` (skeletdagi `ScreenBlok` ulagichi) · s9 `QNatija` · s10 `QKartochka` (alohida ekran) · s11 `QYakun`.
3. **Bitta vizual `IkkiTelefon`** (180): `DIZ_BOLAKLAR` (4: `id`, `nom`, `tur: usul|bezak`, `savol`, `effekt`) + `KATAKLAR` (Shanba, Yakshanba — 6 katak, `holat`) →
   `MaydonTel` holatlari (`ustun` | `tor`; `fon`, `rasm`, `tasma` qatlamlari; `jonli` — kirish va kun almashishi; pufak). s0, s1, s2, s5, s6 (o'ng), s7 (o'ng) shundan o'qiydi.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). `prefers-reduced-motion` — o'tishsiz, holat bir zumda.
4. **KOD — qolipda yo'q bo'lishi mumkin:** `QBlok` 5 qadam (skelet namunasida 4) — 5-qadam «O'z g'oyangiz» ikkinchi prompt qutisi bilan; qavslar A1 5-qadam formasidan to'ldiriladi.
   Qolip 5-qadamni ko'tarmasa — `QBlok` ga `qadamlar` uzunligi cheklanmaganini tekshirish (asosiy seans, 6, 7, 9, 11-darslar ham shu qadamni oladi).
5. **KOD — darsga xos:** s2 ikki bosqichli tajriba (bo'lak → Maydon qatlami → karta ostida natija qatori → 4/4 da `usul`/`bezak` yorliqlari → ikki karta tanlovi);
   s5 variant → maket animatsiya rejimi (`sakrash` · `uzoq` · `mikroYoq` · `aniq`) + `QXato` + yig'ilgan talab qutisi; s4 `TortishMaket` (3 holat: tugma · tortish · uch telefon).
6. **Saqlash:** A1 5-qadam formasi (3 javob) — `ccProgress` + artefakt-strip «Usul kartam» (U-042); s7 5-qadamida va s10 uyga vazifada o'qiladi.
   Kirish qatori — `pm-m7d3-muammo` (tayanch 6); yo'q bo'lsa zaxira gap.
7. **Testlar:** `INLINE_KEYS` s3 → 1, s8 → 0; `RECAPS` 3/8 (`ask` + 3 karta, `ic` 1/2/3); `Q_LABELS`; xato izohlari ≤60.
8. `QUIZ_BANK` 12 (kalitlar A B C D B A D C A D C B); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`.
9. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s2 2-bosqich birinchi tanlov `tor` → patternPicker · A1 5-qadam formasi 3/3 → ideaHunter · s5 uchala aniq → motionWriter · s7 oxirgi «Bajardim» → liveMaydon.
10. Uyga vazifa — `HwCard` yakun ekranida (HW_STEPS 2 qadam + usul kartasi); alohida `.homework.jsx` yo'q (GATE M M-q9).
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
1. **Kataklar soni va vaqti** — GATE M K1 bilan yopildi: 6 katak, 16:00 … 21:00; Shanba band 17:00, 20:00; Yakshanba — hammasi bo'sh (repo); to'r 3×2.
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
8. **O'z g'oyasi uchun prompt qayerda turadi:** darsda — usul kartasi (A1 5-qadam) va 5-qadamdagi «Nusxalash»; o'z repo'sidagi fayl nomi o'ylab topilmadi (boshqa darslarga tegadi).
9. **3-darsda saqlangan muammo** (A1 5-qadam kirish qatori; yopildi — `pm-m7d3-muammo`, tayanch 6): kalit nomi va 3-dars shu muammoni saqlashi — 3-dars MD si bilan kelishiladi; yo'q bo'lsa zaxira gap.
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
- [x] Testlar: variantlar 37–44 belgi, to'g'ri variant eng uzun emas (s3 39/42 · s8 37/40; eski s5 olindi); kalit so'z faqat to'g'rida emas («Band» s3 A va B da, «Harakat» s9 A, B, C da); tire faqat to'g'rida emas.
  ✔ o'rni yangi dars uchun belgilandi: B · C · A; arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (PM + amaliyot darsi; yakuniy — s8 `QTest`), uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — grep 0).
- [x] Ichki kodlar yo'q (o'quvchi matnida «9-Modul», «T6», «P1» yo'q; «5-darsda», «o'tgan darsda» — dars raqami, namuna MD dagidek) · keys faktlari — manba bilan (A-bo'lim) · «KOD» 12 band, «REPO» 3 band.
- [x] Karta T · P · S · PM: T-002/011/014/015/029/039/042/047/052/064 · P-001/002/008/010/013/014/015/016/026/028/036/052/059/062/064/067 · S-001/004/006/008/010/015/018/026/040 ·
  PM-028/029/030. [ ] P-028 qisman: Dribbble/Behance qidiruv tugmasi nomi yozilmadi (taxmin qilinmaydi) — «qidiruvga yozing»; sinf tarmog'ida ochilishi tekshirilmagan (TAYANCHGA SAVOL 10).
- [?] Ochiq: s2 ikki telefon + to'rt karta — 1280 da sig'adi, 393 da telefonlar ustma-ust; vizual bosqichda ko'riladi. QBlok 5-qadam (KOD 4).
