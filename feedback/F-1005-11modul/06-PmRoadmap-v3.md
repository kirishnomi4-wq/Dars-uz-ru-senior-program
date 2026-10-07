# 11-Modul · 6-dars (PM) «Bitiruvgacha nimani qachon qurasiz?» — MD v3

Fayl: `src/9-Modull/PmRoadmapLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-06` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, saqlangani ixcham qatorga uchadi) · brend va mahsulot nomi o'z rangida, tanish maketda ·
ekranga kirganda bo'sh, ma'nosiz element yo'q · ekranda ≤ 3 blok · telefon maketi chapda, chizma o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **C** (`2`) · 7-ekran — **D** (`3`) · 12-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 376–378, DE-205): `m9-05` «G'oyangiz bir sahifaga sig'adimi?» → **`m9-06` «Bitiruvgacha nimani qachon qurasiz?»** (osti: «RICE bo'yicha roadmap») → `m9-07` «Jonli prototip: qog'ozdan bosiladigan ekrangacha».
Tur (PM-005): **1-tur (texnikaga yaqin)** — artefakt tuzilma: RICE jadvali va uch ufqli doska (roadmap); USTAXONA — 8, 9, 10-ekranlar. Keys — **K1 Uzum** (mintaqaviy; tayanch 5, faqat shu matn). REPO yo'q (PM darsi; `maydon-jamoa` 7-darsdan).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushuncha, keys va testlar (2–7) ≈ 30 · o'z ishlari RICE ≈ 15 · juftlik ≈ 7 · o'z roadmap'i ≈ 10 · kod ≈ 10 · yakuniy savol, podium, kartochkalar, arena ≈ 13.
Manba: `00-MODUL-TAYANCH.md` (1 — ip · 1.2 RICE va shkalalar · 1.4 PRD, uchta funksiya, «Keyin» · 1.5 roadmap jadvali aynan · 1.6 real vaqt — 12-Modul · 1.7 F1–F3 ekran so'zlari · 2 — atamalar · 4 — kod mexanikasi · 5 — K1 · 7 — takroriy xatolar · 8 — kalitlar · 9 — kelishuvlar 1–28) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 3, 17) · `00-TAQIQLAR.md` · 8-Modul (kod `m6-12`) — `feedback/F-0929-QA-6modul/YAKUNIY/12-PmLesson24.md` (ufq ta'rifi so'zma-so'z).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «RICE orqali bitiruvgacha roadmap → roadmap qayd etilgan»):** o'quvchi PRD dagi ishlarini (uchta asosiy funksiya va «Keyin» qutisi) RICE bilan tartiblaydi
   va uch ufqqa joylaydi: **hozir — 11-Modul** · **keyinroq — 12–13-Modul** · **uzoqroq — bitiruvdan keyin** (tayanch 1.5). Poydevor — «Hozir» boshida, RICE ga kirmaydi.
   Saqlanadi: `pm-m9d6-roadmap` (11, 12, 14, 15-darslar o'qiydi). O'qiydi: `pm-m9d5-prd` (ishlar) va `pm-m9d2-rice` + `pm-m9d1-goyalar` (2-darsdagi ikki g'oya qamrovi — yordam qatori; TAYANCHGA SAVOL 2).
2. **Bugungi asosiy fikr (P-013):** RICE ishlar tartibini ko'rsatadi, ish esa unga kerak narsa tayyor bo'lgan ufqda boshlanadi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atama — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **roadmap** — «Roadmap — qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq.» Tug'iladi 4-ekran oxirida, Mentorning oltita ishi ufqlarga tushgandan keyin:
     «Bitiruvgacha shunday uch ufqli reja roadmap deyiladi.» «Bizda» — uch ufq va bitiruv bu modulniki, roadmap'ning umumiy qoidasi emas (06-FILTR 4). Sarlavhalarda 4-ekrangacha yo'q. «Yo'l xaritasi» deb tarjima qilinmaydi (LMS 6-Modulda, kod `4c`, boshqa ma'no — tayanch 2).
     Reja ekranining chap matnida — App.jsx osti so'zma-so'z «RICE bo'yicha roadmap» (P-015); reja qadamida — kulrang teg (KORPUS §178).
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **RICE** (2-dars, tayanch 1.2) — qamrov × ta'sir × ishonch ÷ mehnat. **qamrov** — bir oyda nechta odamga yetadi · **ta'sir** — bitta odamga qancha foyda: 3 · 2 · 1 · 0,5 · 0,25 ·
     **ishonch** — taxminga qanchalik ishonasiz: 100% · 80% · 50% · **mehnat** — bitta odam necha hafta (kursda shunday; 2-darsda ochiq aytilgan). Formula — faqat formula kartasida (vizual);
     izohda so'z bilan: «qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz» (T-035).
   - **ufq** (8-Modul (kod `m6-12`), so'zma-so'z): «Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi.» Uch ufq nomi ham 8-Moduldagi: hozir · keyinroq · uzoqroq.
     8-Modulda mashq uchun «uch oy · olti oy» edi — bugun ufqlar modullar bilan (tayanch 1.5). 8-Modul qoidasi «ishni ufqqa unga kerak narsaning tayyor bo'lish payti qo'yadi» — bugungi asosiy fikrning ikkinchi yarmi.
   - **PRD** (8-Modul (kod `m6-02`), 5-dars — yetti bo'lim) · **asosiy funksiya** (PRD dagi uchtasi; o'quvchi matnida nomi bilan, F1/F2/F3 yo'q) · **poydevor** (tayanch 2: «Database, kirish va deploy — har funksiyadan oldin kerak bo'lgan qism»; 10-dars) ·
     **loyiha kuni** (App.jsx: «Loyiha kuni: 1-asosiy funksiya» …).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«navbat»** — faqat 3-funksiya nomida («Chiqish va navbat», tugma «Navbatga yozilish»). RICE bo'yicha joy — **«tartib»** («RICE bo'yicha tartib», «tartibda birinchi»). P0 dagi «navbat belgilash (prioritet)» bu darsda ishlatilmaydi.
   - **«ish»** — roadmap'dagi bitta band (funksiya yoki «Keyin»dagi ish; 8-Modul so'zi). **«funksiya»** — faqat PRD dagi uchtasi va ilova imkoniyati ma'nosida.
   - **«hozir» · «keyinroq» · «uzoqroq»** — faqat ufq nomi (o'quvchi matnida qo'shtirnoqda: «Hozir», «Keyinroq», «Uzoqroq»); oddiy ravish sifatida ishlatilmaydi (7-dars MD ham shunday — T-015).
   - **«Keyin» qutisi** — PRD ning 6-bo'limidagi keyinga qoldirilgan ishlar (tayanch 1.4, 9.22; 5-dars MD si bilan bir nom). «Keyinroq» ufqi bilan aralashmasin: «Keyin»dagi ish «Keyinroq»qa ham, «Uzoqroq»qa ham tushishi mumkin (4-ekranda pul ishi — «Uzoqroq»).
   - **«sig'adi»** — ufqqa nechta ish kirishi («Hozir»ga uchta ish sig'adi). **«joy»** — ishlatilmaydi (3-funksiyada «joy bo'shaydi» — o'yindagi joy, T-015).
   - **«maydon»** — faqat futbol maydoni · **«jamoa»** — faqat futbol jamoasi · **«tasdiq»** — faqat 2-funksiya nomida (5-darsdagi «Mentor tekshiruvi — tasdiq» bu darsda yo'q).
   - **«baho»** — ishlatilmaydi (PRD «Qilmaymiz»da «reyting va baho» bor — T-015); RICE haqida: «RICE: 72», «RICE bo'yicha», «RICE ni hisoblang».
   - **Ishlatilmaydi:** yo'l xaritasi · prioritet · ficha · reja-grafik · «hisoblanadi» (kantselyarit) · Demo Day 7 (tayanch 2: faqat yakundagi «Keyingi dars» qatorida — bu darsda u qator boshqa) · «11-Modul» kod uslubida.
6. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** tayanch 1.5 jadvali aynan (pastda) · namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (tayanch 9.2, 9.30) · «Kelishini tasdiqladi: 7 / 9» (tayanch 1.7, 2-funksiya) ·
   «11-Modulda funksiya uchun uchta loyiha kuni» (App.jsx: 11, 12, 14-darslar). Uzum — faqat «2022-yil oktabr» va «ertasi kuni». Boshqa son yo'q.
7. **Misol-ip — Mentorning roadmap'i (tayanch 1.5 aynan; «Maydon Jamoa» — 4-darsdan beri nom, telefon maketida, o'z rangida):**

| Tartib | Ish | Qamrov (oyiga) | Ta'sir | Ishonch | Mehnat (hafta) | RICE | Ufq | Darsdagi sabab (4-ekran) |
|---|---|---|---|---|---|---|---|---|
| — | Poydevor (Database, kirish, deploy) | — | — | — | — | RICE ga kirmaydi | Hozir · boshida | busiz hech bir funksiya ishlamaydi (tayanch 1.5) |
| 1 | O'yin e'loni va qo'shilish | 60 | 3 | 80% | 2 | **72** | Hozir · 1-asosiy funksiya | tartibda birinchi |
| 2 | O'yin kuni tasdiq | 60 | 2 | 50% | 1 | **60** | Hozir · 2-asosiy funksiya | qo'shilganlarga tayanadi (tayanch 1.7: «faqat qo'shilganlar») |
| 3 | Chiqish va navbat | 60 | 1 | 80% | 1 | **48** | Hozir · 3-asosiy funksiya | uchinchi loyiha kuni |
| 4 | O'yindan oldin eslatma | 60 | 1 | 50% | 2 | 15 | Keyinroq · 12-Modul | 12-Modulni kutadi (tayanch 1: «push — 12-Modulda») |
| 5 | Ro'yxat o'zi yangilanadi | 60 | 1 | 50% | 3 | 10 | Keyinroq · 12-Modul | 12-Modulni kutadi (tayanch 1.6: «o'zi yangilanishi — 12-Modul») |
| 6 | Maydon pulini bo'lishish | 30 | 1 | 50% | 3 | 5 | Uzoqroq | muammo gapidan kelmaydi (5-dars Mentor tekshiruvi; tayanch 1.5, 06-FILTR 5) |

   Hisob tekshirildi: 60·3·0,8÷2 = 72 · 60·2·0,5÷1 = 60 · 60·1·0,8÷1 = 48 · 60·1·0,5÷2 = 15 · 60·1·0,5÷3 = 10 · 30·1·0,5÷3 = 5. 2-darsdagi g'oya qatorlari bilan mos: jamoa yig'ish qamrovi 60, maydon pulini bo'lishish — 30 · 1 · 50% · 3 (tayanch 1.2).
   RICE tartibi PRD dagi ajratish bilan bir xil chiqadi (uchta asosiy funksiya — yuqorida) — bu misolda; o'quvchida farq qilishi mumkin (10-ekran tekshiruvi).
8. **Keys — K1 Uzum (tayanch 5, faqat shu matn):** «Marketpleys 2022-yil oktabrida ishga tushgan. Saytdan emas, logistikadan boshlagan: o'z avtoparki, topshirish punktlari, ertasi kuni yetkazish —
   chunki oldin odamlar ko'pincha Instagram va Telegram guruhlari orqali xarid qilgan.» O'quvchi matnida: «yetkazib berish» (logistika so'zi o'rniga), «o'z mashinalari», «ko'pincha».
   «Unicorn», kompaniya bahosi, foydalanuvchilar soni — **aytilmaydi** (tayanch 5: atama bu darsda kerak emas). Bankdagi «yetkazib berishsiz» so'zi tayanch 5 da yo'q — darsda ham yo'q.
   Yangi burchak (oldingi darslar: `m2-02` «birinchi navbatda nimani qurdi?», `m4a-02` «yetkazishni qachon qurgan?», `m8-10` «ikki sana orasidagi vaqt»): **birinchi ish ekranda ko'rinmagan** →
   Mentor rejasida «Hozir» ham ko'rinmaydigan poydevordan boshlanadi (7-ekran testi). Bashorat — «ertasi kuni» (bank faktidan, oldingi darslarda so'ralmagan).
9. **Ikkinchi misol faqat testda (P-002):** yo'q — hamma testlar Mentor rejasi va Uzum ustida (arena 3 — umumiy «ikki funksiya»).
10. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ↑ ↓ — belgilar. Telefon, mashina, topshirish punkti — chizilgan (CSS/SVG), logotipsiz. O'yin qatlami (arena, nishon medali, podium) — mustasno.
    Kafolat so'zlari yo'q; xulosalar «bu misolda», «Mentor misolida» bilan chegaralangan; RICE — «tanlovga yordam beradi, hukm emas» (tayanch 1.2, T-043).
11. **Kod yozish (tayanch 4, PM_DARS_ETALON 26, PM-082):** kod oynasi (`HtmlCompiler`, `app.js` + `index.html`): Mentorning oltita ishi RICE bo'yicha tartiblanadi, o'quvchi `ufq()` funksiyasini yozadi —
    ishlar sahifada uch ustunga tushadi. 5-dars — VS Code `PRD.md`; 2-dars — VS Code `node rice.js` (mexanika takrorlanmaydi: bu yerda brauzer, ustunlar, `rice()` yozilmaydi).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1-dars — oltita g'oya · 2 — saralash va RICE · 3–4 — o'n intervyu, final g'oya «Maydon Jamoa» · 5 — PRD (uchta asosiy funksiya, «Keyin» qutisi) · **6 — roadmap** · 7 — prototip (roadmap'dagi birinchi funksiya) ·
  10 — poydevor · 11, 12, 14 — uchta asosiy funksiya («Hozir» tartibida) · 15 — roadmap holati.
- **Dars ipi:** 0 — PRD dan oltita ish chiqadi: qaysi biridan boshlaysiz? → 2 — har ishga RICE: tartib 72 · 60 · 48 · 15 · 10 · 5, telefon maketida har ish ko'rinadi → 3 — test: qamrov teng bo'lsa, tartibni nima ajratadi →
  4 — tartibdan uch ufqqa: poydevor RICE siz, «Hozir»ga uchta funksiya sig'adi, 12-Modulni kutadigan ishlar «Keyinroq»da → atama «roadmap» → 5 — test: RICE katta, lekin kutadi →
  6 — Uzum: birinchi ish ekranda ko'rinmagan → 7 — test: Mentor «Hozir»ni poydevordan boshlaydi → 8 — o'quvchi o'z ishlariga RICE → 9 — juftlik: bir ishga sherik RICE beradi, solishtirish →
  10 — o'z roadmap'i → 11 — kod: tartib → uch ustun → 12 — yakuniy: «Hozir» to'la, yangi ish → podium → kartochkalar → yakun, uyda — auditoriyadan bir kishi bilan tekshirish.
- **Bitta vizual — roadmap doskasi (`RoadmapDoska`, dars bo'yi, 163/180; bitta manba `MENTOR_ISHLAR` + o'quvchi ishlari):**
  - **Ish kartasi:** oq karta, tepada nom va kulrang yorliq («asosiy funksiya» yoki «Keyin»dan); ostida to'rt kichik katak — qamrov · ta'sir · ishonch · mehnat; o'ngda RICE katagi (bo'sh → son sanab chiqadi).
    Ko'rinishlar (bitta komponentdan): **to'liq** (to'rt katak + RICE) · **ixcham qator** (tartib raqami · nom · RICE · ufq yorlig'i yoki ✎) · **ustunda** (doska ichida: nom · RICE).
  - **Formula kartasi** (2, 8-ekranlar): «qamrov × ta'sir × ishonch ÷ mehnat = RICE» — bosilgan ishning sonlari joyiga uchib kiradi, natija sanab o'sadi. Formula belgisi faqat shu kartada (T-035).
  - **Uch ufqli doska:** gorizontal yo'l chizig'i, uch zona — **«Hozir · 11-Modul»** (birinchi bo'lib kulrang blok «Poydevor» va kichik yorliq «RICE ga kirmaydi»; keyin uch uzuq katak
    «1-asosiy funksiya · 2-asosiy funksiya · 3-asosiy funksiya» — App.jsx dars nomlari) · **«Keyinroq · 12–13-Modul»** · **«Uzoqroq · bitiruvdan keyin»**. Uzuq chiziq faqat to'ldiriladigan katakda (U-041).
    Karta zonaga uchib tushadi, ostida bitta qator sabab (~1 s yashil yonadi). Zonalar bo'sh holatda ham yorliqli (P-056: sig'im boshidanoq ko'rinadi — «Hozir»da uch katak).
  - **Telefon maketi «Maydon Jamoa»** (2-ekran, chapda, ≈170×272 — SABOQ 22; nom o'z rangida; ostida kulrang yorliq «chizma — hali qurilmagan»): bosilgan ish ilovada qanday ko'rinishi (pastda, 2-ekran).
  - Ishlatiladi: 0 (PRD dan oltita karta) · 1 (skelet) · 2 · 3 (javobdan keyin, kichik) · 4 · 5 (javobdan keyin) · 7 (javobdan keyin) · 8 · 9 · 10 · 12 (javobdan keyin) · 15 (artefakt-strip «Roadmap'im»).
    `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi.
- **Brend o'z maketida (PM-028/029, S-018, SABOQ 2–3):** «Uzum» — nomi o'z binafsha rangida (10-Modul `m8-10` bilan bir), telefon (guruh-chat, keyin Uzum ilovasi ekrani), mashina, topshirish punkti — chizilgan; logotip yo'q.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32). Yoqilgan pastki tugma ham halqada.
- **Bashorat (SABOQ 11):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi (SABOQ 25).
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → karta joyidan joyiga uchadi (PRD dan doskaga, tartibdan ufqqa) · son sanab o'sadi · yangi qator sirg'alib kirib ~1 s yashil yonadi.
  Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Bitiruvgacha nimani qachon qurasiz?** (35) — dars nomi (DE-205)
- Mentor: Mentor misolida PRD da oltita ish bor — ularni birdan qurib bo'lmaydi. O'zingizga yaqin javobni belgilang.
- Maket (chap; bitta chizma): 5-darsdagi PRD varag'i (yetti bo'lim, yopiq qatorlar; mahsulot nomi yozilmaydi — nom faqat telefon maketida, TAQIQLAR 0).
  5-bo'lim «Uchta asosiy funksiya» (uch qator) va 6-bo'lim «Qilmaymiz / keyin» («Keyin»da uch yorliq) — ochiq. O'ngda gorizontal chiziq «Bugun ——— Bitiruv» (bo'sh, zonasiz).
- Variantlar (radio, o'ng; bir uzunlikda):
  - Eng ko'p odamga kerak ishdan (28)
  - Eng tez quriladigan ishdan (26)
  - Eng katta foyda beradigan ishdan (32)
- Javob (uchalasida bir xil, maqtovsiz): Uchalasi ham RICE ning bir bo'lagi: qamrov, mehnat va ta'sir. Bugun ular bitta hisobda birlashadi. (98)
- **Harakat → Vizual o'zgarish:** variantni tanlash → PRD ning 5 va 6-bo'limi accent halqa bilan ko'tariladi; oltita ish kartasi navbat bilan (100 ms) PRD dan uchib chiqib, «Bugun» uchida tartibsiz to'p bo'lib turadi
  (zonalar yo'q — ufqlar 4-ekranda). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: javobni muhokama qilmang — RICE 2-darsda o'tilgan, bugun u PRD dagi ishlarga qo'llanadi. «Poydevordan boshlayman» degan o'quvchi bo'lsa — maqtang, lekin hozir ochmang (4-ekran).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun bitiruvgacha reja tuzasiz.** (32)
- Mentor: O'tgan darsda PRD yozildi. Bugun undagi har ish qachon qurilishini belgilaysiz.
- Chap — «Dars oxirida: RICE bo'yicha roadmap» (App.jsx osti, P-015) + vizual: uch ustun-skelet (yorliqsiz, matnsiz); kulrang kartalar 0.4 s oraliqda tushadi — 3 · 2 · 1; birinchi ustun boshida kulrang blok (yorliqsiz).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · PRD dagi ishlarni RICE bilan tartiblaysiz · `RICE`
  - 02 · Har ishni uch ufqdan biriga joylaysiz · `ufq`
  - 03 · Uzum ishni nimadan boshlaganini ko'rasiz · `voqea`
  - 04 · O'z ishlaringizdan bitiruvgacha reja tuzasiz · `roadmap`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada «roadmap» yo'q (T-011); reja ta'rif aytmaydi va poydevor kashfiyotini ochmaydi (P-015, KORPUS §178); 04 da «ishlaringiz» — PRD dagi ishlar o'quvchida bor (T-039).

## 2 · Funksiyalarga RICE  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · RICE tartibi
- Sarlavha: **PRD dagi oltita ishni RICE qanday tartiblaydi?** (46)
- Mentor: 2-darsda g'oyalarni RICE bilan baholagansiz — endi PRD dagi har ish kartasini bosing.
  (Birinchi harakat — bashorat; yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Qaysi ish RICE bo'yicha birinchi turadi?** · O'yin e'loni va qo'shilish · O'yin kuni tasdiq · Ro'yxat o'zi yangilanadi —
  tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; ish kartalari shundan keyin yoqiladi.
- Vizual (SABOQ 21 — telefon chapda, chizma o'ngda):
  - **chapda — telefon maketi «Maydon Jamoa»** (bosilgan ishning ekrani; boshida — «O'yinlar» ro'yxati, birinchi karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10»).
  - **o'ngda — formula kartasi** (tepada) va **oltita ish kartasi** (PRD tartibida: uchta asosiy funksiya, keyin «Keyin»dagi uchtasi; har birida to'rt son, RICE katagi bo'sh).
- **Harakat → Vizual o'zgarish:** ish kartasini bosish → uning to'rt soni formula kartasiga uchib kiradi, RICE sanab chiqadi; karta o'ngdagi «RICE bo'yicha tartib» ustuniga o'z o'rniga tushadi (qolganlari suriladi, tartib raqami 1–6);
  telefon ekrani shu ishga almashadi (bir lahza ajralib kiradi):
  1. O'yin e'loni va qo'shilish (72) → e'lon kartasi «Shanba, 18:00 · Mahalla maydoni · 8 / 10» va «Qo'shilaman»; tugma bir marta o'zi bosiladi, «8 / 10» silliq «9 / 10» ga o'tadi.
  2. O'yin kuni tasdiq (60) → o'yin sahifasi: «Kelaman» tugmasi, ostida tashkilotchi qatori «Kelishini tasdiqladi: 7 / 9» (tayanch 9.33).
  3. Chiqish va navbat (48) → to'lgan o'yin «10 / 10 · O'yin to'ldi», tugma «Navbatga yozilish».
  4. O'yindan oldin eslatma (15) → telefonning qulf ekrani, bildirishnoma «Maydon Jamoa · Bugun, 18:00 · Mahalla maydoni».
  5. Ro'yxat o'zi yangilanadi (10) → e'lon kartasida «8 / 10» hech kim bosmasdan «9 / 10» ga o'tadi; yorliq «ekran ochiq — son o'zi yangilandi».
  6. Maydon pulini bo'lishish (5) → «Kim to'ladi» ro'yxati: to'rt ismsiz doira, ikkitasida ✓.
  Oltitasi bosilgach — tartib ustuni: 72 · 60 · 48 · 15 · 10 · 5; birinchi uch qator yonida kulrang qavs «asosiy funksiyalar».
  `QIzoh`: Bu misolda RICE tartibi PRD bilan bir xil chiqdi: uchta asosiy funksiya — yuqorida. (83)
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · haqiqatda: o'yin e'loni va qo'shilish» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Mentor misolida uch funksiyaning qamrovi bir xil — tartibni ta'sir, ishonch va mehnat ajratdi. (94)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Halqadagi ish kartasini bosing — RICE formulada hisoblanib chiqadi.
- Tugma (pastki): Ishlarni bosing (N/6) → Davom etish · `tugadi`: ish kartalari va formula yig'iladi, tartib ustuni va telefon butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → yuqoridagi bosilmagan ish kartasi (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: Mehnat — kursda «bitta odam necha hafta» (2-darsda aytilgan). Telefon maketi — chizma: bu ekranlar 7-darsdan keyin quriladi.
  Sonlar — Mentorning taxmini (formula kartasi ustida kulrang yorliq «Mentorning taxmini»). Ishonch sababi so'ralsa (tayanch 1.5): qo'shilish — 80% (1, 2, 3, 5-yozuvlarda kim keladi muammosi) ·
  tasdiq — 50% (odamlar o'yin kuni tugmani bosadimi — hali taxmin) · chiqish va navbat — 80% (oxirgi daqiqada kelmaganlar — 1, 2, 5-yozuvlar) (06-FILTR 6).
  Sinfdan so'rang: «Eslatma ham foydali-ku — nega u pastda?» (qamrov bir xil, ta'sir va ishonch kichik, mehnat ikki hafta).

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`)
- Eyebrow: Tekshiruv · RICE tartibi
- Savol: **Mentor misolida uch funksiyaning qamrovi bir xil. Tartibni nima ajratadi?** (10 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Qamrov: oyiga nechta odam ishlatishi (36)
  - ✔ B — Ta'sir, ishonch va mehnatdagi farq (34)
  - C — PRD da qaysi biri oldin yozilgani (33)
  - D — Qaysi birini qurish qiziqroq ekani (34)
- To'g'ri izohi: Qamrov teng bo'lsa, RICE ni qolgan uch bo'lak o'zgartiradi. (59)
- Xato izohlari: A — Qamrov uchalasida 60 — u tartibni ajratmaydi. (45) · C — PRD dagi o'rni emas, RICE ning bo'laklari ajratadi. (51) ·
  D — Qiziqish RICE ga kirmaydi — to'rt bo'lakka qarang. (50) · (umumiy) Formula kartasida qaysi sonlar har xil — shuni ko'ring. (55)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida uch ixcham ish kartasi — qamrov katagi kulrang «60», ta'sir · ishonch · mehnat kataklari accent.
- Izoh (MD): A — RICE bo'lagi (rost, lekin bu misolda teng — S-004); C — PRD tartibi; D — xohish. To'rtala variant bir qolipda — tartibning manbai; A da ham RICE bo'lagi (qamrov) bor, «RICE» so'zi C va D izohida (kalit so'z faqat to'g'rida emas). ✔ B — 2-ekran xulosasining qo'llanishi.

## 4 · Uch ufq  ← QTushuncha (8-Modul ko'prigi; P-055 kabi ketma-ket, 6 qadam)
- Eyebrow: Tushuncha · ufq
- Sarlavha: **Tartibdagi oltita ish qaysi ufqqa tushadi?** (42)
- Mentor: Tartibdagi eng yuqori ishni bosing — u o'z ufqiga tushadi va sababi ochiladi.
- Doska ustida kulrang eslatma-qator (kod `m6-12` dan so'zma-so'z; o'quvchi ko'radi): **8-Moduldan:** Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi.
- Bashorat (ballsiz, `QBashorat`): **To'rtinchi ish — «O'yindan oldin eslatma» — qaysi ufqqa tushadi?** · «Hozir» · «Keyinroq» · «Uzoqroq» — ixcham qator natijagacha turadi.
- Vizual (keng; chapda harakat, o'ngda vizual):
  - **chapda — tartib ro'yxati** (2-ekrandan, olti ixcham qator: raqam · nom · RICE; joriysi halqada, bosilgani kulrang ✓).
  - **o'ngda — uch ufqli doska:** «Hozir · 11-Modul» (Poydevor bloki + uch uzuq katak «1-asosiy funksiya · 2-asosiy funksiya · 3-asosiy funksiya») · «Keyinroq · 12–13-Modul» · «Uzoqroq · bitiruvdan keyin».
- **Harakat → Vizual o'zgarish:** tartibdagi joriy ishni bosish → karta doskaga uchib, o'z zonasiga tushadi; ostida bitta qator sabab (~1 s yashil yonadi):
  1. O'yin e'loni va qo'shilish → «Hozir», 1-asosiy funksiya — sabab: Tartibda birinchi: poydevordan keyin boshlanadi. (48)
  2. O'yin kuni tasdiq → «Hozir», 2-asosiy funksiya — sabab: Qo'shilganlarga tayanadi: ular birinchi funksiyada paydo bo'ladi. (65)
  3. Chiqish va navbat → «Hozir», 3-asosiy funksiya — sabab: 11-Modulda funksiya uchun uchta loyiha kuni bor. (48)
  4. O'yindan oldin eslatma → «Keyinroq» — sabab: Kutadi: telefonga eslatma yuborish — 12-Modul ishi. (51)
  5. Ro'yxat o'zi yangilanadi → «Keyinroq» — sabab: Kutadi: ro'yxat o'zi yangilanishi — 12-Modul ishi. (50)
  6. Maydon pulini bo'lishish → «Uzoqroq» — sabab: Muammo gapidan kelmaydi: bitiruvgacha ishlar jamoa yig'ishga qaratilgan. (72)
  Oltinchidan keyin «Poydevor» bloki bir lahza accent bo'ladi, `QIzoh`: Poydevor RICE ga kirmaydi: busiz hech bir funksiya ishlamaydi. (62)
  Shundan keyin doska tepasida yorliq **roadmap** paydo bo'ladi (atama — misoldan keyin).
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: «Keyinroq»» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bitiruvgacha shunday uch ufqli reja roadmap deyiladi: qaysi ish qaysi ufqda turadi. (83)
- Ipucha (40 s): Chapdagi halqali ishni bosing — u qaysi ufqqa tushishini ko'ring.
- Tugma (pastki): Ishlarni joylang (N/6) → Davom etish · `tugadi`: tartib ro'yxati yig'iladi, doska butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → tartib ro'yxatidagi joriy ish (to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: 8-Modulda ufqlar «uch oy · olti oy» edi (mashq uchun) — bugun modullar. 8-Modul qoidasini eslating: ishni ufqqa unga kerak narsaning tayyor bo'lish payti qo'yadi;
  RICE esa tartibni ko'rsatadi. «Ro'yxat o'zi yangilanishi» — 12-Modul ishi; 11-Modulda ilova ekran ochilganda va pastga tortib yangilaganda so'raydi (tayanch 1.6) — bu tafsilotni faqat so'rasa ayting.
  Poydevor — 10-dars: bugun uning ichini ochmang.

## 5 · 2-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · kutadigan ish
- Savol: **Ish RICE bo'yicha birinchi, lekin 12-Modulni kutadi. Qayerga qo'yasiz?** (9 so'z) · savol ustida yorliq yo'q
  - A — «Hozir»ga: tartibda u birinchi turibdi (38)
  - B — «Uzoqroq»qa: kutgan ish oxirida turadi (38)
  - ✔ C — «Keyinroq»qa: 12-Modulda boshlanadi (35)
  - D — Hech qayerga: roadmap'dan o'chiriladi (37)
- To'g'ri izohi: Ish unga kerak narsa tayyor bo'lgan ufqda boshlanadi — unga kerak qism 12-Modulda o'tiladi. (86)
- Xato izohlari: A — Tartib birinchi, lekin unga kerak narsa hali yo'q. (50) · B — U bitiruvgacha kutmaydi — faqat 12-Modulgacha. (46) ·
  D — Kutadigan ish o'chirilmaydi — u keyingi ufqda turadi. (53) · (umumiy) Ish nimani kutayotganiga qarang. (32)
- Javob topilgach (kichik, savol ostida): 4-ekran doskasi — «Keyinroq» zonasi accent, ichida eslatma va o'zi yangilanadigan ro'yxat kartalari.
- Izoh (MD): savolda «RICE bo'yicha birinchi» — o'ylab topilgan holat, Mentor ma'lumotida emas (Mentor ishlarida 12-Modulni kutadiganlar tartibda pastda). Ikki nuqta to'rtala variantda (belgi faqat to'g'rida emas).
  KORPUS §141-B: kalit ibora 3-testniki bilan takrorlanmaydi; §141-C: savol yorliqni emas, ma'noni aytadi.

## 6 · Uzum  ← QVoqea (PM keys K1, mintaqaviy; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Uzum ishni telefon ekranidan boshlaganmi?** (41)
- Nuqtalar (3) · yorliq **Uzum · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket; slayd ichida takror matn yo'q. Logotip yo'q.
- Sahna (`UzumSahna`, chizilgan CSS/SVG; bosqichga qarab o'zgaradi; bankda yo'q narsa chizilmaydi — son, narx, asoschi yo'q):
  - 1/3 **Bungacha** — Mentor: Uzum — narsani telefonda tanlasangiz, yetkazib beradigan internet-magazin. Bungacha odamlar ko'pincha Instagram va Telegram guruhlari orqali xarid qilgan.
    · sahna: telefon, ichida guruh-chat: narsa surati chizilgan post, ostida matnsiz pufak-chiziqlar; telefon yonida kulrang yorliq «guruh orqali xarid».
    · bashorat (sahna ostida, bitta qator; S-015 — bir o'lchov, o'sish tartibida; KORPUS §43 — to'g'ri birinchi turishi mumkin): **Uzum boshida buyurtmani qachon yetkazgan?** · ✔ Ertasi kuni · Uch kunda · Bir haftada
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **2022-yil oktabr · ishga tushdi** — Mentor: Uzum 2022-yil oktabrda ishga tushgan. U saytdan emas, yetkazib berishdan boshlagan: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish.
    · sahna: chapda telefon — «Uzum» (binafsha) ilova ekrani, narsa kartalari chizmasi; o'ngda yo'l: mashina topshirish punktiga boradi; ostida chiziq «bugun → ertaga», «ertaga» nuqtasi yonadi.
  - 3/3 **Ekranda ko'rinmaydigan qism** — Mentor: Xaridor telefonda faqat ekranni ko'radi. Mashina va topshirish punkti ekranda yo'q, lekin buyurtma ular orqali yetib keladi.
    · sahna: telefon ekranida «buyurtma» tugmasi bosiladi → ekrandan pastga uzuq chiziq: mashina → topshirish punkti → qo'lida quti bilan odam siluet; telefon ustida yorliq «ekranda», pastki qism ustida «ekranda ko'rinmaydi».
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: ertasi kuni» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi; mashina yo'l bo'ylab yuradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Uzum ishni saytdan emas, yetkazib berishdan boshlagan — bu qism ekranda ko'rinmaydi. (84)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: Uzum voqeasi o'quvchilarga oldingi modullardan tanish («Muammodan yechimga», «Hamma birdan kirsa, sayt chidaydimi?», «Bir yilda nimalarni qurdingiz?» darslari) — bugungi savol boshqa:
  birinchi ish ekranda ko'rinadimi. «Unicorn», kompaniya bahosi va foydalanuvchilar sonini aytmang (bu darsda kerak emas).
  «Saytdan emas» — sayt bo'lmagan degani emas (2/3 sahnada ilova ham bor): birinchi tayyorlangan narsa — yetkazib berish. Bu har mahsulotda «avval Backend» degani ham emas (06-FILTR 16, 17). Sinfdan so'rang: «Sizning mahsulotingizda ekranda ko'rinmaydigan qaysi qism kerak?»
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K1 (bank, ruscha matndan so'zma-so'z: «saytdan emas, logistikadan boshlashdi: o'z avtoparki, topshirish punktlari, ertasi kuni yetkazish») · tayanch 5 (o'zbekcha matn, «ko'pincha») ·
  TechCrunch, 25.03.2024 (10-Modul `10-FILTR.md` da tasdiqlangan: «started by setting up its logistics, a fleet, and established pickup points to offer next-day deliveries»).
  3/3 bosqich gapi — bankdagi faktdan mantiqiy izoh (telefon ekranida mashina ko'rinmaydi), yangi fakt emas.

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`; Uzum → Mentor rejasi)
- Eyebrow: Tekshiruv · Uzum va roadmap
- Savol: **Uzum saytdan emas, yetkazib berishdan boshlagan. Mentor «Hozir»ni nimadan boshlaydi?** (10 so'z) · savol ustida yorliq yo'q
  - A — RICE bo'yicha eng yuqori funksiyadan (36)
  - B — Ekranda eng ko'p ko'rinadigan qismdan (37)
  - C — Mehnati eng kichik bo'lgan ishdan (33)
  - ✔ D — Har funksiya tayanadigan poydevordan (36)
- To'g'ri izohi: Poydevor RICE ga kirmaydi va birinchi turadi: busiz hech bir funksiya ishlamaydi. (81)
- Xato izohlari: A — Bu funksiya poydevordan keyin boshlanadi. (41) · B — Ko'rinish emas — boshqa ishlar nimaga tayanadi? (47) ·
  C — Mehnat RICE bo'lagi, poydevor esa RICE ga kirmaydi. (51) · (umumiy) Uzum ham ko'rinmaydigan qismdan boshlagan. (42)
- Javob topilgach (kichik, savol ostida): doskaning «Hozir» zonasi — «Poydevor» bloki accent, undan uch funksiya katagiga ingichka chiziqlar.
- Izoh (MD): A — 2-ekrandagi tartib (rost, lekin poydevordan keyin); B, C — ko'rinish va mehnat. «funksiya» A va D da, «ish» C da (kalit so'z faqat to'g'rida emas). Uzum — taqqoslash uchun, «poydevor» metafora qilinmaydi (TAQIQLAR 2).

## 8 · Ishlaringizga RICE  ← QMustaqil (USTAXONA 1 — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **PRD dagi har ishga RICE ni hisoblang.** (37)
- Mentor: Har kartada qamrov va mehnatni yozing, ta'sir va ishonchni tanlang — RICE o'zi chiqadi.
- **Tepada — ixcham ro'yxat «Ishlarim · RICE bo'yicha tartib · n / N»:** saqlanganlar bittadan qator (tartib raqami · nom · RICE · ✎); bo'sh uzuq qatorlar yo'q. Bo'sh bo'lsa — faqat sarlavha va «0 / N».
- **Markazda — bitta katta ish kartasi (joriy):**
  1. Nom — `pm-m9d5-prd` dan (avval `funksiyalar` uchtasi, yorliq «asosiy funksiya»; so'ng `keyin` ro'yxati — har biri alohida karta, yorliq «Keyin» qutisidan; 06-FILTR 13); tahrirlasa bo'ladi.
     PRD topilmasa — kulrang qator: PRD topilmadi — ishlaringizni o'zingiz yozing. (nom qatori bo'sh, placeholder «Ish nomi»).
  2. To'rt qator: **Qamrov** — son, placeholder «Oyiga nechta odam?» · **Ta'sir** — tugmalar 3 · 2 · 1 · 0,5 · 0,25 (ostida kulrang: juda katta · katta · o'rta · kichik · juda kichik) ·
     **Ishonch** — tugmalar 100% · 80% · 50% · **Mehnat** — son, placeholder «Necha hafta?» (0,5 dan).
     Qamrov qatori ostida kulrang yordam (`pm-m9d2-rice` bo'lsa): 2-darsda g'oyalaringiz qamrovi: {yechim…} — {qamrov} · {yechim…} — {qamrov}. (`ikkita` dagi ikki g'oya; Mentor misolida «o'yin e'loni va… — 60 · to'garaklar xaritasi… — 80»; TAYANCHGA SAVOL 2)
  3. Formula kartasi (karta ichida, jonli): «60 × 3 × 80% ÷ 2 = 72» — o'quvchi sonlari bilan.
  4. «Saqlash» o'ngda (187). Ostida kichik havola «+ Yana ish qo'shish» (ixtiyoriy; jami 6 tagacha).
- Tekshiruv (`QXato`, ≤60; javob qator ostida; yumshoq — ikkinchi «Saqlash» bilan o'tadi, «bo'sh» dan tashqari):
  - qamrov yoki mehnat bo'sh yoki 0 (bloklaydi): Qamrov va mehnatni son bilan yozing. (36)
  - ta'sir yoki ishonch tanlanmagan (bloklaydi): Ta'sir va ishonchni tanlang. (28)
  - ishonch 100%: Bu kursda 100% — o'lchangan raqam uchun. Dalilingiz bormi? (58)
  - mehnat 6 haftadan ko'p: Bu modulda bitta ishga 6 haftadan ko'p — bo'lsa bo'ladimi? (57)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam: Qamrov — funksiyani bir oyda nechta odam ishlatadi. Ta'sir — taxmin: funksiya bitta odamning muammosini qanchalik yengillashtiradi. Ishonch — raqamlaringizga qanchalik ishonasiz: dalil qancha kam bo'lsa, shuncha past.
  Mehnat — bitta odam uni necha haftada quradi. Bir mahsulotning funksiyalarida qamrov yaqin bo'lishi mumkin — Mentor misolida uchalasida 60.
- **Harakat → Vizual o'zgarish:** son yozilganda yoki tugma tanlanganda formula kartasidagi son almashadi, RICE sanab o'zgaradi. «Saqlash» → karta kichrayib tepadagi ro'yxatga uchadi va RICE bo'yicha o'z o'rniga tushadi
  (qatorlar suriladi, yangi qator ~1 s yashil), hisoblagich n / N sanab o'sadi, pastdan keyingi karta kiradi. Tekshiruvdan o'tmagan qator `err` fon, ostida bitta `QXato`.
  Hammasi saqlangach karta yopiladi; ro'yxat butun enga (har qatorda ✎ — bosilsa o'sha ish katta karta bo'lib ochiladi, qolganlari ixcham — SABOQ 29).
- Xulosa (o'quvchi ma'lumotidan, P-046): Tartibingiz tayyor: birinchi — «{nom}», oxirgi — «{nom}». (Mentor nomlari bilan — 97)
  «Keyin»dagi ish asosiy funksiyadan yuqoriga chiqsa — qo'shimcha kulrang qator: «{nom}» «Keyin» qutisidan, lekin RICE bo'yicha asosiy funksiyadan yuqori. (namuna — 94)
- Tugma (pastki): Yana N ta ishga RICE → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: qamrov qatori (accent, to'lqin) → ta'sir tugmalari → ishonch tugmalari → mehnat → «Saqlash» (to'rt qator to'lgach halqada).
- Nishon: RICE Ranker! (kamida 4 ish saqlanganda).
- Mentor rejimi: forma o'rniga Mentorning oltita ishi (2-ekran tartib ustuni); o'quvchilar o'z ekranida yozadi. Mentor statistikasi: «RICE ni hisoblaganlar» · «Kamida 4 ish yozganlar».
- O'qituvchi eslatmasi: Taymer yo'q — 15 daqiqadan keyin juftlikka o'ting. Eng ko'p savol — «qamrovni qayerdan bilaman?»: intervyudagi odamlar va guruhdagi o'yinchilar kabi tanish sondan boshlansin; qamrovda son chegarasi yo'q (06-FILTR 8).
  Ishonch 100% bergan o'quvchidan «qayerdan bilasiz?» deb so'rang — bu taqiq emas, dalil savoli.

## 9 · Bir ishga ikki RICE  ← QMustaqil (juftlik, 3 qadam; P-057 solishtirish sahnasi)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Sherigingiz bir ishga sizdek RICE beradimi?** (43) · yakka rejimda: **Mentorning bir ishiga qanday RICE berasiz?** (42)
- Mentor: Bitta ishingizni tanlang: uning ta'siri va ishonchini sherigingiz o'zi belgilaydi.
  Yakka rejimda: Mentorning raqamlari yopiq: «O'yin kuni tasdiq»ga ta'sir va ishonchni o'zingiz belgilang.
- Qadam chiplari: 1 Ishni tanlang · 2 Sherigingiz belgilaydi · 3 Solishtiring (yakka: 1 Ishni o'qing · 2 Belgilang · 3 Solishtiring)
- 1-qadam: «Ishlarim» ro'yxati (8-ekrandan, ixcham, halqada) → bitta qator bosiladi → katta ish kartasi: nom, qamrov va mehnat ochiq; ta'sir, ishonch va RICE — kulrang parda «yopiq».
  Ostida kulrang yo'riq: Ishni sherigingizga bir gap bilan tushuntiring.
- 2-qadam: sherik shu ekranda ta'sir tugmalarini (3 · 2 · 1 · 0,5 · 0,25) va ishonch tugmalarini (100% · 80% · 50%) bosadi · «Saqlash».
- 3-qadam: «Ochish» → pardalar ko'tariladi; solishtirish: chapda «Siz: ta'sir · ishonch · RICE», o'ngda «Sherigingiz: ta'sir · ishonch · RICE» (o'sha qamrov va mehnat bilan);
  ikki ustunda farq qilgan katak accent bo'ladi; foiz chegarasi va «yaqin / uzoq» hukmi yo'q (06-FILTR 10). Ostida ixtiyoriy kulrang tugma «✎ Raqamni tuzatish» — suhbatdan keyin dalil o'zgargan bo'lsa (tuzatish 8-ekran ro'yxatiga yoziladi, tartib qayta joylanadi).
- **Harakat → Vizual o'zgarish:** qator bosish → karta kattalashib chiqadi, uch katak parda ostida · tugma bosish → sherik ustunida son almashadi · «Ochish» → parda yuqoriga sirg'aladi, ikki RICE sanab chiqadi ·
  sonlar bir xil → ikki ustun orasida kulrang chiziq · farq bor → farq qilgan katak accent (qizil rang yo'q).
- Xulosa (natijadan, P-046):
  - bir xil: Baholaringiz bir xil chiqdi; baribir RICE — taxmin. (51)
  - farq bor: Bir ishga ikki xil RICE chiqdi: qaysi bo'lakda farq bor — dalilga qayting. (74)
- Yakka rejim (sherik yo'q yoki 8-ekran bo'sh): Mentorning «O'yin kuni tasdiq» ishi — qamrov 60, mehnat 1 hafta ochiq; o'quvchi ta'sir va ishonchni belgilaydi;
  ochilganda — Mentor: ta'sir 2, ishonch 50%, RICE 60. Xulosa — yuqoridagi ikki matndan biri (sonlar bir xilmi yoki yo'qmi).
- Tugma (pastki): Solishtiring → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: ro'yxat qatorlari → ta'sir tugmalari → ishonch tugmalari → «Saqlash» → «Ochish» → «Davom etish» (ixtiyoriy «✎ Raqamni tuzatish»).
- Nishon: Pair Score! (solishtirish bajarilganda).
- Mentor statistikasi: «Bir xil» · «Farq bor» (sinf bo'yicha son).
- O'qituvchi eslatmasi: Keyin rollarni almashtiring — sherik o'z ekranida shu ishni qiladi. Farq chiqishi xato emas: ikki odam bir ishni ikki xil ko'radi.
  2–3 juftlikdan so'rang: kimning raqami dalilga yaqinroq va nega? Ishonch — dalil bilan o'zgaradigan son.

## 10 · Uch ufqqa joylash  ← QMustaqil (USTAXONA 2 — ketma-ket karta; artefakt)
- Eyebrow: Mustaqil ish · roadmap
- Sarlavha: **Ishlaringizni uch ufqqa joylang.** (32)
- Mentor: RICE bo'yicha yuqoridagi ishdan boshlang va har biriga savol bering: u nimani kutadi?
- **Tepada — uch ufqli doska (ixcham):** «Hozir · 11-Modul» (avtomatik «Poydevor» bloki, yorliq «RICE ga kirmaydi»; uch uzuq katak «1-asosiy funksiya · 2-asosiy funksiya · 3-asosiy funksiya») ·
  «Keyinroq · 12–13-Modul» · «Uzoqroq · bitiruvdan keyin».
- **Markazda — bitta katta ish kartasi (joriy, 8-ekran tartibida):** tartib raqami · nom · RICE · uch tugma: «Hozir» · «Keyinroq» · «Uzoqroq».
- Tekshiruv (`QXato`, ≤60):
  - «Hozir» to'la (bloklaydi): Bu modulda «Hozir»da uchta ish — har loyiha kuniga bitta. (55)
  - tartibda yuqoriroq ish uzoqroq ufqqa, pastroq ish esa yaqinroq ufqqa qo'yilsa (yumshoq): Tartibda yuqoriroq ish uzoqroqda qoldi — u nimani kutadi? (57)
  - asosiy funksiya «Hozir»dan tashqariga (yumshoq): Bu PRD dagi asosiy funksiya — nega keyinga qoldi? (49) — ostida qator «Sabab» (javob `sabab` ga yoziladi; 06-FILTR 22)
  - «Keyin»dagi ish «Hozir»ga (yumshoq): Bu ish PRD dagi uchtasidan emas — PRD ni ham yangilang. (55) — ostida qator «Sabab» (06-FILTR 2, 19)
  - oxirida «Hozir»da uchtadan kam (Saqlash bloklanadi): Bu modulda uchta loyiha kuni — «Hozir»ga uchta ish qo'ying. (59)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana bosing.
- «Hozir» ichida tartib — RICE bo'yicha avtomatik (1-, 2-, 3-asosiy funksiya); har katak yonida ↑ ↓ — bir ish boshqasiga tayansa, almashtirish uchun.
- Yordam: Ikki savol bering: ish RICE bo'yicha nechanchi? Unga kerak narsa 11-Modulda tayyor bo'ladimi? Bir funksiya boshqasiga tayansa — undan keyin turadi (Mentor misolida tasdiq qo'shilishdan keyin).
- «Saqlash» → `pm-m9d6-roadmap`; doska butun enga; artefakt-strip «Roadmap'im» paydo bo'ladi.
- **Harakat → Vizual o'zgarish:** ufq tugmasi → karta kichrayib doskadagi zonaga uchadi (yangi karta ~1 s yashil), pastdan keyingi karta kiradi; «Hozir»da katak to'lganda uzuq chiziq yo'qoladi ·
  ↑ ↓ → ikki karta o'rin almashadi, katak yorlig'i («1-asosiy funksiya» …) joyida qoladi · tekshiruvdan o'tmagan tanlov — tugma silkinadi, ostida bitta `QXato`.
  Hammasi joylangach — doska butun enga, «Saqlash» halqada.
- Xulosa (o'quvchi ma'lumotidan, P-046; 0 bo'lgan bo'lak tushib qoladi): Roadmap'ingiz tayyor: «Hozir»da {a}, «Keyinroq»da {b}, «Uzoqroq»da {c} ta ish. (namuna 3/2/1 — 72)
- Tugma (pastki): Ishlarni joylang (n/N) → Saqlash → Davom etish
- Keyingi bosiladigan joy: joriy kartaning uch tugmasi (navbatma-navbat to'lqin) → (hammasi joylangach) «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Roadmap'im · 3 · 2 · 1» (ixcham); 11 va 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: Roadmap Ready! («Hozir» uchta bilan saqlanganda).
- Mentor rejimi: Mentorning doskasi (4-ekran, to'liq). Mentor statistikasi: «Roadmap'ni saqlaganlar» · «Hozir»ga «Keyin»dan ish olganlar».
- O'qituvchi eslatmasi: «Hozir»dagi uchta — kurs sig'imi (11, 12, 14-darslar — uchta loyiha kuni), roadmap'ning umumiy qoidasi emas (06-FILTR 1). «Keyin»dan ish «Hozir»ga kirsa — xato emas,
  lekin PRD ning uchta funksiyasi ham shunga moslanishi kerak: o'quvchiga ayting (5-darsdagi PRD qayta ochiladi).
  «Uzoqroq» bo'sh qolsa — so'rang: «Bitiruvgacha hammasi sig'adimi?»

## 11 · Kod yozish  ← QKod (kod oynasi; tayanch 4; PM-082)
- Eyebrow: Kod yozish
- Sarlavha: **Ishlarni ufqlarga ajratadigan kod yozamiz.** (42) — PM-082(a) sarlavha oilasi (korpus §19, §48)
- Mentor: Mentorning oltita ishi kodda ro'yxat bo'lib turibdi: har birini o'z ufqi ustuniga chiqaring.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **`kutadi: "12-Modul"` yozilgan ish qaysi ustunga tushadi?** — uch tanlov: «`"hozir"`» · ✔ «`"keyinroq"`» · «`"uzoqroq"`»
  - xato («`"hozir"`»): Unga kerak narsa 12-Modulda — «Hozir»ga tushmaydi. (50) · xato («`"uzoqroq"`»): U bitiruvgacha kutmaydi — 12-Modulda boshlanadi. (48)
- Chap (vazifa, 3 band; bosiladigan katakcha emas): 1 12-Modulni kutadigan ish — `"keyinroq"` · 2 «Hozir»da uchtadan kam bo'lsa — `"hozir"` · 3 Qolgani — `"uzoqroq"`
- Yordam: Avval kutishni tekshiring: `if (ish.kutadi === "12-Modul") return "keyinroq";`. So'ng «Hozir» sonini: `hozirSoni < 3`. Qolgan holatda — `return "uzoqroq";`.
  Eslatma (JavaScript darslaridan): `sort` — ro'yxatni tartiblaydi (`b.rice - a.rice` — kattasi oldinda) · `return` — funksiya javobini qaytaradi · `if` — shart rost bo'lsa ishlaydi.
- O'ng: kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d, `user-select: none`) va platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`).
  Mentor gapi (o'ng, tugma ustida): Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz. «Kompilyator» ta'riflanmaydi — «kod oynasi».
- Kod (`app.js`):
```js
// Mentor misoli: oltita ish va RICE; kutadi — ish 12-Modulni kutadi
const ishlar = [
  { nom: "Maydon pulini bo'lishish", rice: 5 },
  { nom: "O'yin kuni tasdiq", rice: 60 },
  { nom: "O'yindan oldin eslatma", rice: 15, kutadi: "12-Modul" },
  { nom: "O'yin e'loni va qo'shilish", rice: 72 },
  { nom: "Ro'yxat o'zi yangilanadi", rice: 10, kutadi: "12-Modul" },
  { nom: "Chiqish va navbat", rice: 48 }
];

// RICE bo'yicha tartib: kattasi oldinda (bu qator tayyor)
ishlar.sort(function (a, b) { return b.rice - a.rice; });

function ufq(ish, hozirSoni) {
  // ish qaysi ustunga tushadi: "hozir", "keyinroq" yoki "uzoqroq"
  // hozirSoni — «Hozir» ustuniga allaqachon tushgan ishlar soni
  return "uzoqroq";   // boshida hamma ish shu yerda — shu joyni siz yozasiz
}

// har ish — o'z ustunida (bu qism tayyor)
let hozirSoni = 0;
ishlar.forEach(function (ish) {
  const u = ufq(ish, hozirSoni);
  if (u === "hozir") hozirSoni = hozirSoni + 1;
  const p = document.createElement("p");
  p.textContent = ish.nom + " · " + ish.rice;
  document.getElementById(u).appendChild(p);
});
```
- `index.html` (tayyor, o'zgarmaydi): `<h1>Mentorning roadmap'i</h1>` · uch ustun: `<div class="ufq"><h3>Hozir · 11-Modul</h3><p class="poydevor">Poydevor · RICE ga kirmaydi</p><div id="hozir"></div></div>` ·
  `<div class="ufq"><h3>Keyinroq · 12–13-Modul</h3><div id="keyinroq"></div></div>` · `<div class="ufq"><h3>Uzoqroq · bitiruvdan keyin</h3><div id="uzoqroq"></div></div>` — `app.js` ni kod oynasi o'zi ulaydi.
  `previewCss`: `.ufq` — uch ustun yonma-yon, oq fon, ingichka chegara, 8 px radius · `.ufq p` — oq karta-qator · `.poydevor` — kulrang fon, kulrang matn.
- Boshlang'ich holat (ishga tushirganda): oltita ish «Uzoqroq» ustunida, «Hozir» va «Keyinroq» bo'sh — o'quvchi «reja yo'q» holatini ko'radi.
- Kutilgan natija: Hozir — «O'yin e'loni va qo'shilish · 72», «O'yin kuni tasdiq · 60», «Chiqish va navbat · 48» · Keyinroq — «O'yindan oldin eslatma · 15», «Ro'yxat o'zi yangilanadi · 10» ·
  Uzoqroq — «Maydon pulini bo'lishish · 5». (4-ekran doskasi bilan bir xil.)
- Kod oynasi sarlavhasi: `app.js — ufq funksiyasini yakunlang` · placeholder: `// ish qaysi ustunga tushadi`
- Shart xabarlari (≤60): 1 — 12-Modulni kutadigan ish «Keyinroq»ga tushsin. (46) · 2 — «Hozir»ga uchta ish, to'rtinchisi «Uzoqroq»ga. (46) ·
  3 — Ustunlarda 3, 2 va 1 ta ish bo'lsin. (36)
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri tanlov → kod namunasida `kutadi: "12-Modul"` ikki qatori bir lahza accent bo'ladi; kod oynasida kod ishga tushganda kartalar «Uzoqroq»dan
  o'z ustunlariga o'tadi, shartlar birma-bir ✓. Kod oynasidagi «Davom etish» faqat uch shart ✓ bo'lganda ochiladi.
- Hammasi bajarilgach (yashil): Kod ishlarni tartib va kutishga qarab uch ustunga ajratdi — Mentor doskasidagidek. (82)
- O'qituvchi eslatmasi: Kod — 3–4 daqiqalik mashq, yangi qoida yo'q: 4-ekrandagi uch qoida. `sort` tayyor — u o'zgarmaydi. Tez bajargan o'quvchi o'z ishlaridan birini ro'yxatga qo'shib ko'rsin (shart emas).
- Saqlash: kod oynasi qoralamasi `pm-m9d6-code` (tayanch 8).

## 12 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; uch qoida birga — tartib, sig'im, kutish)
- Eyebrow: Yakuniy tekshiruv
- Savol: **PRD da yo'q yangi ish RICE da birinchi chiqdi. Avval nima qilasiz?** (11 so'z; 06-FILTR 2, 20) · savol ustida yorliq yo'q
  - ✔ A — Avval PRD dagi uchta funksiyani qayta ko'raman (45)
  - B — Uni «Hozir»ga to'rtinchi ish qilib qo'shaman (44)
  - C — Uni o'chiraman — PRD da yo'q ish kerak emas (43)
  - D — Eng pastdagisini surib, uni «Hozir»ga qo'yaman (46)
- To'g'ri izohi: Roadmap PRD dan ajralmaydi: uchta asosiy funksiya o'zgarsa, PRD ham yangilanadi. (80)
- Xato izohlari: B — Bu modulda «Hozir»ga uchta ish sig'adi. (39) · C — Yuqori RICE — o'chirishga emas, o'ylashga sabab. (47) ·
  D — Surish mumkin, lekin avval PRD qayta ko'riladi. (47) · (umumiy) Roadmap'dagi uchta funksiya qaysi hujjatdan keladi? (52)
- Javob topilgach (kichik, savol ostida): yonma-yon ixcham PRD (5-bo'lim «Uchta asosiy funksiya» accent) va doskaning «Hozir» zonasi — ular orasida ikki tomonlama chiziq (namoyish; Mentor ma'lumoti o'zgarmaydi).
- Izoh (MD): ✔ A eng uzun emas (D — 46); farq 43–46 (≤15%); D — eski «surish» javobi: PRD siz surish — yanglish (S-004); vergul to'rtala variantda; «sig'im» — o'quvchi matnida faqat umumiy xato izohida (4, 10-ekranlardagi «sig'adi» bilan bir ildiz). O'qituvchi eslatmasi: haqiqiy roadmap'da bunday almashtirish PRD ni ham yangilaydi (10-ekran eslatmasi).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Qamrov teng · 2 — Kutadigan ish · 3 — Uzum va poydevor · 4 — PRD va roadmap

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Roadmap nima? | Qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq |
| Ufq nima? | Ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi |
| Bu modulda uchta ufq qaysilar? | «Hozir» — 11-Modul, «Keyinroq» — 12–13-Modul, «Uzoqroq» — bitiruvdan keyin |
| RICE qanday hisoblanib chiqadi? | Qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz |
| Bu kursda mehnat nima bilan o'lchanadi? | Bitta odam necha hafta ishlashi bilan |
| Funksiyalarning qamrovi teng bo'lsa, tartibni nima ajratadi? | Ta'sir, ishonch va mehnat |
| Nega poydevor RICE ga kirmaydi? | Busiz hech bir funksiya ishlamaydi — u har funksiyadan oldin turadi |
| RICE bo'yicha yuqori ish 12-Modulni kutsa, qayerga tushadi? | «Keyinroq»qa: unga kerak narsa 12-Modulda tayyor bo'ladi |
| Bu modulda «Hozir» ufqiga nechta funksiya sig'adi? | Uchta: 11-Modulda funksiya uchun uchta loyiha kuni bor |
| Bir funksiya boshqasiga tayansa, qaysi biri oldin quriladi? | Boshqasi tayanadigan funksiya: Mentor misolida qo'shilish tasdiqdan oldin |
| Uzum ishni nimadan boshlagan? | Saytdan emas, yetkazib berishdan: o'z mashinalari, topshirish punktlari va ertasi kuni yetkazish |
| Bir ishga ikki odam har xil RICE bersa, bu nimani bildiradi? | RICE — taxmin: farq qilgan bo'lakda dalilga qaytiladi |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (roadmap — 4 · ufq — 4 · ufq nomlari — 4, 10 · RICE, mehnat — 2, 8 · qamrov teng — 2, 3 · poydevor — 4, 7 · kutish — 4, 5 · sig'im — 4, 10 · tayanish — 4, 10 · Uzum — 6 · juftlik — 9).
- S-027: har old tomon — to'liq savol, «?» bilan («ta'rif → atamani toping» yo'q). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Roadmap'ingiz tayyor.** (21) · saqlanmagan bo'lsa (P-046): **Roadmap boshlandi — qolgani uyda.** (33)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): RICE ishlar tartibini ko'rsatadi, ish esa unga kerak narsa tayyor bo'lgan ufqda boshlanadi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Roadmap — qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq.
  - Qamrov teng bo'lsa, tartibni ta'sir, ishonch va mehnat ajratadi.
  - Poydevor RICE ga kirmaydi: busiz hech bir funksiya ishlamaydi.
  - Bu modulda «Hozir» ufqiga uchta funksiya sig'adi — har loyiha kuniga bittadan.
  - Uzum ishni saytdan emas, yetkazib berishdan boshlagan.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: auditoriyadan bir kishi · Nechta: 3 funksiya · Muddat: keyingi darsgacha
  - ① «Hozir» ufqidagi uchta funksiyani auditoriyangizdan bir kishiga ayting va so'rang: «Qaysi biri sizga birinchi kerak?»
  - ② Javobini yozib oling. Tartibingizdan farq qilsa, «Nega?» deb so'rang — RICE ni faqat yangi dalil chiqsa tahrirlang (✎).
  - ③ «Hozir»dagi uchta funksiyani o'qing: qaysi biri boshqasiga tayanadi? Tartib shunga mos kelmasa, ↑ ↓ bilan almashtiring.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Jonli prototip: qog'ozdan bosiladigan ekrangacha»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); «Kim bilan» — HwCard yorlig'i; «auditoriyangizdan» — 3–4-darslardagi intervyu odamlari (o'quvchida bor — T-039).
  Uyga vazifa ① — intervyu emas, bitta savol (9-Modul texnikasi takrorlanmaydi).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi; S-031: tavsif ≤48)
- **RICE Ranker!** (8-ekran, kamida 4 ish saqlanganda) — Ishlaringizni RICE bo'yicha tartibladingiz (42)
- **Pair Score!** (9-ekran, solishtirish bajarilganda) — Bir ishga sherigingiz bilan RICE solishtirdingiz (48)
- **Roadmap Ready!** (10-ekran, «Hozir» uchta bilan saqlanganda) — Ishlaringizni uch ufqqa joyladingiz (35)
- **Horizon Coder!** (11-ekran, uch shart ✓) — Ishlarni kod bilan ufqlarga ajratdingiz (39)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda. 8-Modul (kod `m6-12`) nishon nomlari (Road Builder, Plan Writer, Horizon Master, Code Planner) takrorlanmaydi.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Qamrov teng bo'lsa** — 1 RICE: qamrovni ta'sirga va ishonchga ko'paytirib, mehnatga bo'lasiz. · 2 Mentor misolida uch funksiyaning qamrovi — 60. ·
  3 Qamrov teng bo'lsa, tartibni ta'sir, ishonch va mehnat ajratadi. — Sinfga savol: Sizning funksiyalaringizda qaysi bo'lak eng ko'p farq qiladi?
- **5 · Kutadigan ish** — 1 Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi. · 2 RICE tartibni ko'rsatadi, ish esa unga kerak narsa tayyor bo'lganda boshlanadi. ·
  3 Eslatma va o'zi yangilanadigan ro'yxat 12-Modulni kutadi — ular «Keyinroq»da. — Sinfga savol: Roadmap'ingizdagi qaysi ish nimanidir kutadi?
- **7 · Uzum va poydevor** — 1 Uzum 2022-yil oktabrda saytdan emas, yetkazib berishdan boshlagan. · 2 Mashina va topshirish punkti ekranda yo'q, lekin buyurtma ular orqali yetib keladi. ·
  3 Mentor rejasida «Hozir» poydevordan boshlanadi: busiz hech bir funksiya ishlamaydi. — Sinfga savol: Sizning mahsulotingizda ekranda ko'rinmaydigan qaysi qism kerak?
- **12 · PRD va roadmap** — 1 Bu modulda «Hozir»ga uchta funksiya sig'adi: 11-Modulda uchta loyiha kuni. · 2 «Hozir»dagi uchta funksiya PRD dan keladi. ·
  3 Yangi ish yuqori chiqsa — avval PRD qayta ko'riladi, so'ng roadmap. — Sinfga savol: Roadmap'ingizga yangi ish qo'shilsa, PRD ning qaysi bo'limi o'zgaradi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·10 · B 3·7·12 · C 2·8·11 · D 4·6·9 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. RICE hisobida qamrov nimani bildiradi? (2)
   - ✔ Oyiga nechta odamga yetib borishini (35)
   - Bitta odamga qancha foyda berishini (35)
   - Qurishga necha hafta vaqt ketishini (35)
   - Taxminga qanchalik ishonishingizni (34)
2. Bu kursda RICE ning mehnati nima bilan o'lchanadi? (2)
   - Butun guruh necha oy ishlashi bilan (35)
   - Kodda nechta qator yozilishi bilan (34)
   - ✔ Bitta odam necha hafta ishlashi bilan (37)
   - Nechta ekran chizilishi kerakligi bilan (39)
3. Ikki funksiyada faqat mehnat farq qiladi. Qaysi biri tartibda yuqori? (2, 8)
   - Mehnati ko'proq bo'lgan funksiya (32)
   - ✔ Mehnati kamroq bo'lgan funksiya (31)
   - PRD da birinchi yozilgan funksiya (33)
   - Ko'proq ko'rinadigan funksiya (29)
4. Ish «Keyinroq» ufqida turibdi. Bu nimani bildiradi? (4)
   - 12–13-Modul bo'yi qilinishini (29)
   - 12–13-Modulda tugab bo'lishini (30)
   - Bitiruvdan keyin boshlanishini (30)
   - ✔ 12–13-Modulda boshlanishini (27)
5. Nega poydevor RICE ga kirmaydi? (4, 7)
   - ✔ Busiz hech bir funksiya ishlamaydi (34)
   - Uni qurish hammadan tez va oson (31)
   - Uni foydalanuvchi ekranda ko'rmaydi (35)
   - U PRD dagi birinchi bo'limda turadi (35)
6. O'yin kuni tasdiq qo'shilganlarga tayanadi. U qachon quriladi? (4)
   - Qo'shilish funksiyasidan oldin (30)
   - Qo'shilish bilan bir vaqtda (27)
   - Bitiruvdan keyin, oxirgi bo'lib (31)
   - ✔ Qo'shilish funksiyasidan keyin (30)
7. «Hozir» ufqiga 11-Modulda nechta funksiya sig'adi? (4, 10)
   - Ikkita: qolgani keyingi modulda (31)
   - ✔ Uchta: har loyiha kuniga bitta (30)
   - Oltita: PRD dagi hamma ishlar (29)
   - To'rtta: poydevor bilan birga (29)
8. Uzum'da xaridor telefon ekranida nimani ko'rmaydi? (6)
   - Narsalar ro'yxati va narxini (28)
   - Narsalarning surati va nomini (29)
   - ✔ Mashina va topshirish punktini (30)
   - Do'kon nomi va qidiruv qatorini (31)
9. Uzum'dagidek, rejaning birinchi ishi qanday bo'lishi mumkin? (6, 7)
   - Ekranda eng chiroyli ko'rinadigan qism (38)
   - Reklamada eng ko'p ko'rsatiladigan qism (39)
   - Eng tez va eng oson quriladigan qism (36)
   - ✔ Ekranda ko'rinmasa ham kerakli qism (35)
10. Sherigingiz bir ishga boshqacha RICE berdi. Bu nimani bildiradi? (9)
    - ✔ RICE taxmin ekanini va dalil kerakligini (40)
    - Sherigingiz RICE formulasini bilmasligini (41)
    - Ishni roadmap'dan o'chirish kerakligini (39)
    - Sizning raqamingiz baribir to'g'ri ekanini (42)
11. Roadmap'da har ish haqida nima ko'rinadi? (4, 10)
    - Uni sinfdagi qaysi o'quvchi qurishi (35)
    - Unga qancha pul sarflanishi kerakligi (37)
    - ✔ U qaysi ufqda va qaysi o'rinda turishi (38)
    - Unda necha qator kod yozilishi kerakligi (40)
12. «Uzoqroq» ufqidagi ish bilan bitiruvgacha nima bo'ladi? (4)
    - «Hozir»dagi ishlar bilan birga quriladi (39)
    - ✔ Bitiruvdan keyin boshlanishini kutadi (37)
    - Roadmap'dan butunlay o'chirib tashlanadi (40)
    - 12-Modulda birinchi bo'lib boshlanadi (37)
- Arena yozuvlari — platforma shabloni (namuna 8-Modul (kod 6) YAKUNIY 12-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — RICE · qamrov · ta'sir · ishonch · mehnat · ufq · roadmap · poydevor ·
  uyga vazifa banneri — roadmap · ufq · RICE · funksiya.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmRoadmapLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s8/s9/s10 `QMustaqil` · s11 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`RoadmapDoska`** — bitta vizual (180): `IshKarta` (`toliq` · `ixcham` · `ustunda`), `FormulaKarta` (sonlar uchib kirishi, RICE sanab o'sishi), `UfqDoska` (uch zona, «Poydevor» bloki,
   «Hozir»da uch katak «1/2/3-asosiy funksiya», kartaning zonaga uchishi, sabab qatori). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda e'lon qilinadi.
3. **`MENTOR_ISHLAR`** — 6 × `{ nom, qamrov, tasir, ishonch, mehnat, rice, ufq: 'hozir' | 'keyinroq' | 'uzoqroq', kutadi?: '12-Modul', sabab, turi: 'asosiy' | 'keyin', telefon }` — tayanch 1.5 aynan;
   `rice` — `qamrov * tasir * ishonch / mehnat` dan (konstanta bilan solishtiruvchi assert: 72, 60, 48, 15, 10, 5). **`UFQLAR`** — 3 × `{ id, nom: 'Hozir' | 'Keyinroq' | 'Uzoqroq', izoh: '11-Modul' | '12–13-Modul' | 'bitiruvdan keyin' }`.
   Bitta manba: 0, 2, 4, 5, 7, 9 (yakka), 10 (mentor rejimi), 11 (kod ma'lumoti shu jadvaldan), 12.
4. **`MaydonTelefon`** — 2-ekran telefon maketi (≈170×272, SABOQ 22; «Maydon Jamoa» nomi o'z rangida; yorliq «chizma — hali qurilmagan»), 6 holat (`telefon` maydoni): e'lon «8 / 10» → «9 / 10» · «Kelaman» + «Kelishini tasdiqladi: 7 / 9» ·
   «10 / 10 · O'yin to'ldi» + «Navbatga yozilish» · qulf ekrani bildirishnomasi · son o'zi yangilanishi · «Kim to'ladi» (ismsiz doiralar). Namuna o'yin — tayanch 9.2.
5. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); `PrdMaket` (yetti bo'lim, 5 va 6 ochiq, nomsiz) + oltita karta uchishi + «Bugun — Bitiruv» chizig'i.
6. s2: `QBashorat` (3 variant) → ixcham qator; kartalar bashoratdan keyin yoqiladi; bosilgan karta → `FormulaKarta` → tartib ustuni (qayta saralash animatsiyasi) + `MaydonTelefon` holati;
   `QIzoh` + `QTaxmin` + xulosa bitta natija blokida (SABOQ 25); 40 s ipucha.
7. s4: `QBashorat` (3 ufq) → tartib ro'yxati (ketma-ket, faqat joriysi faol) → `UfqDoska` (uchish + sabab qatori 6 ta, `MENTOR_ISHLAR[i].sabab`) → «Poydevor» accent + `QIzoh` → yorliq «roadmap» → xulosa.
8. s6: `UZUM_BOSQICH` 3 × `{ h — bosqich nomi, m — Mentor gapi }` (SABOQ 8); `UzumSahna` (guruh-chat telefon · Uzum ilovasi + yo'l, mashina, topshirish punkti, «bugun → ertaga» ·
   «ekranda / ekranda ko'rinmaydi» kesimi); nom «Uzum» binafsha (`Brend` komponenti — o'quvchi yuzasida yagona tashqi rang), logotip yo'q; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); manba izohi faylda.
9. s8 artefakt (1-qism): o'qiydi `pm-m9d5-prd` (`funksiyalar` [3], `keyin`) va `pm-m9d2-rice` (`ikkita` → `baho[i].goya`, `baho[i].qamrov` — yordam qatori; TAYANCHGA SAVOL 1, 2);
   `pm-m9d1-goyalar[goya].yechim` — yordam qatoridagi g'oya nomi o'rniga (qisqa «…»); ketma-ket karta (bitta katta, qolgani ixcham — SABOQ 29); tekshiruvlar (bo'sh — bloklaydi; 100%, >6 hafta, qamrov farqi — yumshoq); «+ Yana ish qo'shish» (≤6);
   yozadi `pm-m9d6-roadmap` = `{ ishlar: [{ nom, qamrov, tasir, ishonch, mehnat, rice, ufq: null, turi }], hozir: [], savedAt }`; nishon `riceRanker` (≥4).
10. s9: 3 qadam; parda «yopiq» → «Ochish»; ta'sir va ishonch bir xilmi — bir xil / farq bor (foiz chegarasi yo'q — 06-FILTR 10); «✎ Raqamni tuzatish» → `pm-m9d6-roadmap.ishlar[i]` (`rice` qayta, tartib qayta);
    yakka rejim — `MENTOR_ISHLAR[1]` (O'yin kuni tasdiq); `optionalLive`; Mentor statistikasi; nishon `pairScore`. Yangi kalit yo'q.
11. s10 artefakt (2-qism): ketma-ket karta (tartib bo'yicha), uch ufq tugmasi; «Hozir» sig'imi 3 (bloklaydi); yumshoq tekshiruvlar (tartib teskari, asosiy funksiya tashqarida); «Hozir» ichida ↑ ↓;
    «Saqlash» → `pm-m9d6-roadmap` = `{ ishlar: [... ufq, sabab], hozir: [i, j, k] (1-, 2-, 3-asosiy funksiya tartibida), savedAt }` (tayanch 8 shakli + `turi`, `sabab`, `savedAt`);
    `ishlar` tartibi 6-darsdan keyin o'zgarmaydi — o'chirish yo'q, yangi ish oxiriga (11, 12, 14, 15-darslar `ishlar[hozir[k]]` o'qiydi; 06-FILTR 14);
    artefakt-strip «Roadmap'im · a · b · c»; nishon `roadmapReady`; mentor rejimi — Mentor doskasi.
12. s11: `KOD_TASK` — `files: [{ name: 'app.js' }, { name: 'index.html' }]`, `previewCss` (`.ufq`, `.ufq p`, `.poydevor`), 3 shart (`C.evalEquals`):
    (1) `ufq({ rice: 15, kutadi: "12-Modul" }, 0)` = `keyinroq` · (2) `ufq({ rice: 48 }, 2)` = `hozir` va `ufq({ rice: 5 }, 3)` = `uzoqroq` ·
    (3) `#hozir p` soni 3, `#keyinroq p` soni 2, `#uzoqroq p` soni 1 (`C.custom` yoki `evalEquals` bilan, `window` ichida); darvoza `KOD_DARVOZA` (`"keyinroq"` — to'g'ri);
    `KodNamuna` (`kutadi` qatorlari ajralishi, nusxalanmaydi); `storageKey="pm-m9d6-code"`; QKod o'ng ustun propi — 9-Modul 1-dars `QKOD_ONG` yechimi (til-lint); «kompilyator» ta'riflanmaydi; nishon `horizonCoder`.
    ⚠️ Starter matni ichida backtik yo'q (template-satr emas) — CSS/JSX tuzog'i (CLAUDE.md). Boshlang'ich `return "uzoqroq";` — kod xatosiz ishlaydi (bo'sh `id` bilan `null` xatosi bo'lmaydi).
13. Testlar s3/s5/s7/s12 — `correctIdx` 1/2/3/0 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6).
    s3/s5/s7/s12 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
14. `ACHIEVEMENTS` 4 (`riceRanker`, `pairScore`, `roadmapReady`, `horizonCoder`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); `HW_TOKENS` — faqat so'z.
15. Uyga vazifa — yangi `HwCard` (dars yangi; PM-027 bu yerga tegishli emas): yorliqlar «Kim bilan · Nechta · Muddat», 3 qadam, yakun ekranida aynan shular. Alohida `.homework.jsx` yo'q.
16. App.jsx: `m9-06` qatoriga `comp: PmRoadmapLesson` + import — asosiy seans (bu agent tegmaydi). Nom «Bitiruvgacha nimani qachon qurasiz?» ✓ va osti «RICE bo'yicha roadmap» ✓ (DE-205, App.jsx 377-qator).
17. **REPO — yo'q** (PM darsi).
- Darvozalar: `npm run gates -- src/9-Modull/PmRoadmapLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10, 06-FILTR):** 1 → `keyin` — massiv (5-dars ham, tayanch 8) · 2 → qabul · 3 → «Hozir» = 3 — kurs sig'imi (tayanch 1.5), «Keyin»dan ish kirsa PRD yangilanadi · 4 → sabab: «muammo gapidan kelmaydi» (tayanch 1.5) ·
> 5 → ishonch sabablari tayanch 1.5 da · 6 → «N-Modul» (kurs bo'yi) · 7, 8, 10 → qabul · 9 → `turi`, `sabab`, `savedAt`; `hozir` — indeks, `ishlar` o'zgarmas · 11 → tayanch 1.5.
1. **`pm-m9d5-prd.keyin` shakli.** 5-dars MD sida (06.10 01:52) `keyin` — bitta matn maydoni (≤120, «Nimani navbatdan surasiz?»). 8-ekran uni ishlarga bo'ladi: vergul, «·» va yangi qator bo'yicha;
   bo'lingan har bo'lak — alohida karta (o'quvchi tahrirlaydi yoki o'chiradi). Massivga o'tkazish (`keyin: [satr]`) 6-darsni soddalashtiradi — 5-dars bilan kelishilsin. Nom — «Keyin» qutisi (5-dars bilan bir).
2. **`pm-m9d2-rice` dan nima o'qiladi.** Topshiriq: «2-darsdagi RICE usuli o'qiladi». Darsda: 8-ekran qamrov qatori ostida `ikkita` dagi ikki g'oyaning nomi va qamrovi (Mentor misolida «o'yin e'loni va… — 60 · to'garaklar xaritasi… — 80»).
   2-dars MD sida `baho[].goya` — `pm-m9d1-goyalar` indeksi; g'oyada `nom` yo'q — shuning uchun 6-dars `pm-m9d1-goyalar` ni ham o'qiydi va yechimni qisqa ko'rsatadi («o'yin e'loni va…» — 60).
   Bu — tayanch 8 dagi «6-dars o'qiydi» ro'yxatiga qo'shimcha kalit. Yo'q bo'lsa — yordam qatori chiqmaydi (shkala darsning o'zida).
3. **«Hozir» sig'imi — 3** (11, 12, 14-darslar — «1/2/3-asosiy funksiya»). «Hozir» PRD dagi uchta funksiya bilan bog'lanmagan: «Keyin»dan RICE i yuqori ish kirishi mumkin — yumshoq ogohlantirish bilan
   (12-ekran testi ham shunga tayanadi). Agar «Hozir» = PRD ning uchta funksiyasi (qat'iy) bo'lishi kerak bo'lsa — 10-ekran tekshiruvi bloklaydigan, 12-ekran testi boshqa savolga almashadi.
4. **Ufq sabablari (4-ekran) — tayanchda yozilmagan:** 2-funksiya «qo'shilganlarga tayanadi» (tayanch 1.7 dan chiqarildi) · 4, 5 «12-Modul ishi» (tayanch 1 va 1.6 dan) · **6 — maydon pulini bo'lishish «Uzoqroq»:
   tayanchda sabab yo'q**, darsda: «Tartibda oxirgi: …» edi — **yopildi (06-FILTR 5):** «Muammo gapidan kelmaydi: bitiruvgacha ishlar jamoa yig'ishga qaratilgan.» (tayanch 1.5).
5. **Ishonch sabablari:** 2-funksiyada 50%, 3-funksiyada 80% — tayanchda sababi yo'q (intervyuda «kim aniq kelishini bilmadi» ikki marta aytilgan — 2-funksiya uchun ham dalil). Darsda har ishning ishonch sababi aytilmaydi;
   o'quvchi so'rasa — «Mentor misolidagi taxmin». Kerak bo'lsa tayanchga bir qator sabab qo'shilsin.
6. **Modul raqami yozilishi:** ufq yorliqlarida «11-Modul», «12–13-Modul» — tayanch 1.5 dagidek kichik harf; o'tgan modullar «8-Modul», «9-Modul» (TAQIQLAR 3). Bitta yozilish tanlansin.
7. **«navbat» ikki ma'nosi:** 3-funksiya «Chiqish va navbat» (kutish ro'yxati) va «navbat» — ishlar tartibi. Bu darsda RICE bo'yicha joy — faqat «tartib». 2-dars MD si P0 ko'prigida bir marta «navbat belgilash (prioritet)» deydi,
   keyin ishlatmaydi (mos); 5-dars MD sida «Keyin» — «navbati suriladi», «Nimani navbatdan surasiz?» — o'sha darsda «Chiqish va navbat» bilan yonma-yon (T-015). Modul bo'yi «tartib» taklif.
8. **Kod ma'lumotiga `kutadi: "12-Modul"`** — tayanch 1.5 jadvalida bunday ustun yo'q («Ufq» ustunidan va tayanch 1, 1.6 dan chiqarildi). Kalit `pm-m9d6-roadmap` ga qo'shilmaydi (o'quvchi ufqni o'zi tanlaydi).
9. **`pm-m9d6-roadmap` qo'shimchalari:** `turi: 'asosiy' | 'keyin'` va `savedAt`; 8-ekran `ufq: null` bilan yozadi, 10-ekran to'ldiradi; `hozir` — 1-, 2-, 3-asosiy funksiya tartibidagi indekslar (11, 12, 14-darslar shunday o'qisin).
10. **Uzum bashorati** — «Uzum boshida buyurtmani qachon yetkazgan?» (✔ ertasi kuni). Bank faktidan; oldingi uch darsdagi bashoratlardan farqli. Tayanchdagi ko'prik «roadmap — nimani birinchi qurish» —
    darsda «birinchi ish ekranda ko'rinmagan» burchagidan (sarlavha, 3/3 bosqich, 7-ekran testi).
11. **«11-Modulda funksiya uchun uchta loyiha kuni»** — App.jsx `m9-11`, `m9-12`, `m9-14` dan (10 — poydevor, 13 — sinov tuzatishi). Tayanchda bu gap yo'q, sig'im shunga tayanadi.

## Shubhali joylar (ishonchim komil emas)
- 6-ekran 3/3: «Xaridor telefonda faqat ekranni ko'radi. Mashina va topshirish punkti ekranda yo'q, lekin buyurtma ular orqali yetib keladi.» — bankda so'zma-so'z yo'q, faktdan mantiqiy izoh.
- 6-ekran: Uzum'ni «internet-magazin» deb tanishtirish (10-Modul `m8-10` dagidek; bankda «marketpleys»). Uzum sahnasidagi ilova ekrani (narsa kartalari) — umumiy ko'rinish, haqiqiy ilova nusxasi emas.
- Arena 8: «Narsalar ro'yxati va narxini», «Narsalarning surati va nomini», «Do'kon nomi va qidiruv qatorini» — internet-magazin ekranining umumiy tasviri; Uzum ilovasi tekshirilmagan.
- 4-ekran 6-qadam sababi va TAYANCHGA SAVOL 4 (pul ishi — «Uzoqroq»).
- 12-ekran ✔ A — haqiqiy roadmap'da «Hozir»ga yangi ish kirsa, PRD ham yangilanadi; test buni aytmaydi (O'qituvchi eslatmasida).
- 5-ekran savoli — o'ylab topilgan holat («RICE bo'yicha birinchi, lekin kutadi»): Mentor ma'lumotida bunday ish yo'q. To'g'ri javob 8-Modul qoidasiga tayanadi.
- 8-ekran yordamidagi «Bir mahsulotning funksiyalarida qamrov yaqin bo'lishi mumkin» — umumiy kuzatuv, manbasi yo'q; «Mentor misolida uchalasida 60» bilan chegaralangan.
- 9-ekran: sherik o'quvchining funksiyasini bir gapdan tushunib baholaydi — farq ko'pincha tushuntirishdan chiqishi mumkin (xulosa buni «taxmin» deb oladi). ~~«Yaqin» chegarasi 25%~~ — olindi (06-FILTR 10).
- 2-ekran telefonidagi bildirishnoma matni «Maydon Jamoa · Bugun, 18:00 · Mahalla maydoni» va «Kim to'ladi» ro'yxati — chizma uchun o'ylab topilgan (tayanch namunasidan), keyingi darslar bilan kelishilmagan.
- Arena 2 distraktori «Butun guruh necha oy ishlashi bilan» — Intercom'dagi o'lchovga yaqin (odam-oy) — «rost, lekin bu kursda emas» (S-004); «jamoa» so'zi ataylab ishlatilmadi (T-015).
- 15-dars MD sidagi doska «Hozir» kataklarini «11-dars · 12-dars · 14-dars» deb ataydi, bu darsda — «1-asosiy funksiya · 2- · 3-» (App.jsx dars nomlari). Ikki darsda bir yorliq tanlansin.

---

## O'lchov (python bilan sanaldi — belgi soni; skript: scratchpad `md06/olchov.py`, `md06/olch2.py`, 06.10)
- Sarlavhalar: 21–46 (eng uzuni 2-ekran «PRD dagi oltita ishni RICE qanday tartiblaydi?» — 46), hammasi bitta qator, ≤55.
- Mentor: interaktiv ekranlarda (2, 4, 8, 9, 10, 11) — 1 gap; kirish, reja, Uzum bosqichlari — 2 gap; sarlavhani takrorlamaydi.
- Xulosalar: 72–97 (≤110; 8-ekran namunasi bilan) · hook javobi 98 (≤120; «Aynan!»siz — sof so'rovnoma) · `QIzoh` 62–83 · 4-ekran sabab qatorlari 48–65.
- To'g'ri izohlar: 59–81 (bitta gap) · xato izohlari va `QXato`: 28–58 (≤60) · kod shart xabarlari 36–46.
- Test variantlari (farq ≤15%, ✔ yolg'iz eng uzun emas): s3 36/34/33/34 · s5 38/38/35/37 · s7 36/37/33/36 · s12 42/39/43/39; arena 12 ta — hammasi ≤15% (eng kattasi 2-savol: 34–39, 12,8%).
- Savollar: ekran testlari 9–11 so'z, arena 5–10 so'z (≤12).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 376–378 — `m9-05` «G'oyangiz bir sahifaga sig'adimi?» → **`m9-06` «Bitiruvgacha nimani qachon qurasiz?»**
  (osti «RICE bo'yicha roadmap» — reja chap qatori so'zma-so'z) → `m9-07` «Jonli prototip: qog'ozdan bosiladigan ekrangacha» (yakun qatori).
- [x] Bitta misol-ip: Mentorning oltita ishi (tayanch 1.5 aynan), «Maydon Jamoa» — telefon maketida; metafora yo'q; bitta vizual — `RoadmapDoska` (ish kartasi · formula · uch ufqli doska) + 2-ekran telefoni.
  Uzum — keys sahnasi (PM-028/029). Ikkinchi olam yo'q (arena 3 — umumiy holat).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha) + 0, 6, 8, 9, 10, 11; testlarda javobdan keyingi karta. «bosish → matn-karta» yo'q — har bosish karta, formula, doska yoki telefonni o'zgartiradi.
- [x] O'lchov (skript bilan sanaldi, `scratchpad/md06/olchov.py`): pastdagi «O'lchov» bo'limiga qarang — sarlavha ≤55 · Mentor ≤2 gap (interaktiv ekranlarda 1) · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
- [x] Atamalar: RICE va to'rt bo'lak (tayanch 1.2), ufq (8-Modul so'zma-so'z), PRD, poydevor, asosiy funksiya — bir xil; yangi «roadmap» — misoldan keyin; «navbat» — faqat 3-funksiya nomida, RICE uchun «tartib»;
  «maydon», «jamoa», «tasdiq» — bir ma'noda; siz-forma; tugmalar ot-shaklda («Saqlash», «Ochish», «Davom etish»).
- [x] Testlar: 4 variant, uzunlik farqi ≤15% (pastda); to'g'ri javob yolg'iz eng uzun emas; tire / ikki nuqta / vergul / kalit so'z faqat to'g'rida emas. Arena 12 — ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q (grep: «darrov», «darhol», «har doim», «hech qachon», «100% ishlaydi» — 0; «100%» faqat ishonch shkalasi qiymati).
- [x] Ichki kodlar yo'q (o'quvchi matnida F1/F2/F3, `m9-NN`, «Modul 11» yo'q). Keys — tayanch 5 matni, manba qatori bilan. «KOD» ro'yxati 17 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (roadmap — misoldan keyin, sarlavhada yo'q) · T-014/T-015 (tartib/navbat, joy/sig'adi, «Keyin»/«Keyinroq») · T-016 (metafora yo'q) · T-035 (formula faqat kartada) ·
  T-039 («roadmap'ingiz» — 10-ekranda yaratilgandan keyin) · T-042 (ta'rif so'zma-so'z: 4, 14, 15) · T-043 («Mentor misolida», «bu misolda», RICE — hukm emas) · T-047/T-048 · T-064 (5-ekran savoli 4-ekran so'zi bilan) ·
  P-001 · P-008 · P-013 · P-015 · P-025 · P-033 · P-036 (0-ekranda ufqlar yo'q) · P-046 (8, 9, 10, 15) · P-053 · P-055 (4-ekran ketma-ket) · P-056 («Hozir» sig'imi boshidanoq) · P-057 (9-ekran) · P-062 · P-064 (2, 4, 6) · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 · S-006 · S-008 · S-010 · S-015 (keysda bitta bashorat, bir o'lchov) · S-018 (Uzum izohi 1/3 da) · S-020 (ballik matnda atama glossasiz yo'q — «ufq» arena 4 da variantlar o'zi ochadi) ·
  S-026 · S-027 · S-040 · PM-005 (1-tur) · PM-017 · PM-018 (Uzum — faqat bank qarori; 3/3 — mantiqiy izoh) · PM-082 (kod darvozasi, nusxa yo'q) · J-026 · SABOQ 1–31.
