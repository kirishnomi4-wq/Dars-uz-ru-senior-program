# 11-Modul · 4-dars (PM) «O'n intervyudan keyin qaysi g'oya qoladi?» — MD v3

Fayl: `src/9-Modull/PmFinalIdeaLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-04` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta) · brend va mahsulot nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q ·
ekranda ≤ 3 blok · maket chapda, karta o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **D** (`correctIdx 3`) · 5-ekran — **B** (`1`) · 7-ekran — **C** (`2`) · 12-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 374–376, DE-205): `m9-03` «Ikki g'oyadan qaysi biri odamlarga kerak?» → **`m9-04` «O'n intervyudan keyin qaysi g'oya qoladi?»** (osti: «takrorlangan javoblar va final g'oya») → `m9-05` «G'oyangiz bir sahifaga sig'adimi?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma (o'quvchining sanoq doskasi, final g'oya, muammo gapi); mustaqil ish majburiy (9, 10-ekran). Keys — **K15 YouTube** (tayanch 5, faqat bank matni). REPO yo'q (PM darsi; `maydon-jamoa` 7-darsdan).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushuncha, keys va testlar (2–8) ≈ 32 · o'z sanog'i ≈ 15 · final g'oya va juftlik ≈ 10 · kod ≈ 10 · yakuniy savol, podium, kartochkalar, arena ≈ 18.
Manba: `00-MODUL-TAYANCH.md` (1-bo'lim — muammo gapi · 1.3 — 10 yozuv jadvali, sanoq, final g'oya, halol gap · 2 — atamalar · 4 — kod mexanikasi · 5 — K15 · 7 — takroriy xatolar · 8 — kalitlar · 9.20–28) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 3, 15, 17) · `00-TAQIQLAR.md` · `MD_TOPSHIRIQ_2.md` (№ 4 va «Darsga xos eslatmalar» 4).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur, 4-dars: «10 intervyu — 2-qism · patternlar tahlili, final g'oya tanlovi → 10 intervyu + final g'oya»; tayanch 4: «10 yozuv jadvali, final g'oya, muammo gapi»):**
   o'quvchi o'z yozuvlarini ikki g'oya bo'yicha sanaydi (sanoq doskasi), bitta **final g'oya** tanlaydi, uning **muammo gapi**ni yozadi; ikkinchi g'oya **«Keyin» qutisi**ga o'tadi.
   O'qiydi: `pm-m9d3-intervyu` (g'oya nomlari; uy yozuvlari qog'ozda — sanoqni o'quvchi kiritadi, tayanch 9.44). Yozadi: `pm-m9d4-final` (5 va 16-darslar o'qiydi).
   **Final — 5 + 5 da (04-FILTR 1, 2):** har g'oyada kamida 5 ta haqiqiy yozuv bo'lsa — final g'oya; kam bo'lsa dars yuradi, lekin tanlov **vaqtincha** (`vaqtincha: true`), yozuvlar uyda 5 + 5 ga yetkaziladi va doska qayta ko'riladi.
2. **Bugungi asosiy fikr (P-013):** Yozuvlar sanog'i final g'oya uchun yangi dalil beradi, isbot emas: qaror bitta songa tayanmaydi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **takrorlangan javob** — «Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob.» (2-ekran, uchala qator sanalgandan keyin). Menyu ostidagi so'z (App.jsx `sub`, P-015) — TAYANCHGA SAVOL 2.
   - **final g'oya** — «Intervyudan keyin tanlangan, bitiruvgacha quriladigan bitta g'oya — final g'oya.» (8-ekran, Mentor tanlovidan keyin; tayanch 2 so'zma-so'z).
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **g'oya** — «G'oya uch qismdan iborat: muammo, kim uchun va yechim.» (1-dars, tayanch 9.20) — bu darsda ta'rif qaytarilmaydi, faqat nom yorlig'i («Jamoa yig'ish», «Mahalla to'garaklari»).
   - **intervyu · yozuv** — 9-Modul `m7-02`: «intervyu — bitta odam bilan suhbat»; «yozuv — to'ldirilgan shablon». Yozuv qatorlari (tayanch 1.3, 3-dars): **Kim · Oxirgi marta · Qanday qildi · Eng qiyini · Hozir nima bilan · Belgi**.
   - **harakat belgisi** — 3-darsdan (tayanch 2): «Intervyu oxirida odam so'z bilan emas, ish bilan ko'rsatgan qiziqish — harakat belgisi.»; Mentor misolida — **sinab ko'rishga kun belgiladi** (HB-q0 A; telefon raqami so'ralmaydi).
   - **va'da** — 9-Modul `m7-02`: «hali bo'lmagan ish haqidagi javob» (faqat 5-ekran xato izohi va arena 3).
   - **sanoq · nechta yozuvda · «4 / 5»** — 9-Modul `m7-03` (`SanoqDoska`, «5 yozuvdan 4 tasida»). **doska** — 9-Modul `m7-03` (LUG'AT «matritsa → doska»).
   - **muammo gapi** — 9-Modul `m7-03`: «kim, qachon va nimadan qiynalishini aytadigan bitta gap; unda yechim yo'q» (qolip — 2-Modul «Kim, qayerda, nimadan qiynaldi?»). Bu darsda uch bo'lak: **Kim · Qachon · Nimadan qiynaladi**.
   - **saralash** — 2-dars (faqat 0-ekran javobida: qiziqish va qurish vaqti saralashda ko'rilgan). **«Keyin» qutisi** — tayanch 9.22.
   - **dalil · isbot emas** — tayanch 1.3 halol gapi, 7.1: «10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas.» (8-ekran xulosasi, so'zma-so'z).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«takror»** — faqat «takrorlangan javob» va «takrorlandi» (fe'l) ma'nosida; kartochka ekranining platforma yorlig'i «Takrorlash» tegilmaydi (TAYANCHGA SAVOL 2).
   - **«belgi»** — faqat «harakat belgisi» (doska qatori «Harakat belgisi», yozuv qatori «Belgi»); «✓ belgisi» kabi boshqa ma'noda o'quvchi matnida yo'q.
   - **«jamoa»** — faqat futbol jamoasi (Qaror-0 3); YouTube voqeasida «asoschilar» (jamoa emas). **«maydon»** — faqat futbol maydoni; forma joyi — **«qator»**.
   - **«qoladi»** — g'oya bitiruvgacha qoladi (dars nomi); ikkinchi g'oya o'chirilmaydi — «Keyin» qutisiga o'tadi.
   - **«dalil»** — sanoqdagi son; **«isbot»** — faqat «isbot emas» shaklida.
   - **Ishlatilmaydi:** pattern, patternlar tahlili (o'quvchi matnida — «takrorlangan javob»), custdev (kartochkada ham — 9-Modulda bir marta berilgan), commitment, va'da (harakat belgisi ma'nosida), asosiy g'oya, startap, pivot, «aniq ishlaydi», «isbotlandi» (faqat noto'g'ri variantda).
6. **Raqamlar (faqat tayanch 1.3 dan, «Mentor misolida» / «bu misolda»):** 10 yozuv (1–5 jamoa, 6–10 to'garak), sanoq jadvali (pastda), belgi 4 / 5 ga 1 / 5; nom tug'ilgan telefon maketida namuna e'lon
   «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (tayanch 9.2). Boshqa son yo'q. YouTube — raqamsiz, yilsiz.
7. **Misol-ip — Mentorning 10 yozuvi (tayanch 1.3, AYNAN; o'zgartirilmaydi; olam ichidagi gap, T-008):**

| № | G'oya | Kim | Oxirgi marta | Qanday qildi | Eng qiyini | Hozir nima bilan | Belgi |
|---|---|---|---|---|---|---|---|
| 1 | jamoa | o'yinchi, 15 yosh | o'tgan shanba: 10 kishi kerak edi, 7 kishi keldi | Telegram guruhida «kim keladi?» deb yozdi | kim «+» qo'ygani xabarlar orasida yo'qoldi | Telegram guruhi | ha |
| 2 | jamoa | o'yinchi, 14 yosh | kecha: ikki kishi oxirgi daqiqada kelmadi | tanishlariga birma-bir qo'ng'iroq qildi | kim aniq kelishini bilmadi | Telegram guruhi va qo'ng'iroq | ha |
| 3 | jamoa | o'yinchi, 16 yosh, o'yinni ko'pincha o'zi yig'adi | uch kun oldin: 6 kishi yig'ildi, o'yin bo'lmadi | guruhga uch marta yozdi | javoblar boshqa xabarlar ostida qoldi | Telegram guruhi | ha |
| 4 | jamoa | o'yinchi, 13 yosh | o'tgan hafta: hamma keldi | akasi guruhda yig'di | «qiyin bo'lmadi» | Telegram guruhi | yo'q |
| 5 | jamoa | o'yinchi, 15 yosh | yakshanba: 10 kerak edi, 8 kishi keldi | guruhga yozdi, maydonda kutdi | javoblar yo'qoldi, kim kelishini bilmadi | Telegram guruhi | ha |
| 6 | to'garak | o'smir, 14 yosh | yozda: robototexnika to'garagini qidirdi, topolmadi | onasi tanishlaridan so'radi | qayerda va qachon ekani noma'lum | ota-onaning tanishlari | yo'q |
| 7 | to'garak | ota-ona (o'g'li 13 yoshda) | sentabrda: suzish to'garagini qidirdi | mahalla guruhida va tanishlardan so'radi | jadvalni bilish uchun borib ko'rish kerak | tanishlar | ha |
| 8 | to'garak | o'smir, 15 yosh | «hech izlamaganman — onam biladi» | — | — | onasi tanlaydi | yo'q |
| 9 | to'garak | o'smir, 13 yosh | «to'garakni dadam topadi, men bilmayman» | — | — | dadasi tanlaydi | yo'q |
| 10 | to'garak | ota-ona (qizi 14 yoshda) | avgustda: rasm to'garagi | tanishlardan so'radi, uch joyga borib ko'rdi | vaqtini bilish uchun har biriga borish kerak bo'ldi | tanishlar | yo'q |

   **Sanoq (tayanch 1.3, aynan):**

| Sanoq | Jamoa yig'ish (5) | Mahalla to'garaklari (5) |
|---|---|---|
| oxirgi marta muammo bo'lgan | 4 / 5 — oxirgi o'yinda odam yetmagan yoki kimdir kelmagan | 3 / 5 — to'garak topishda qiynalgan |
| hozir nima bilan | 5 / 5 — Telegram guruhida «kim keladi?» | 3 / 5 — tanishlar orqali |
| eng qiyini | 3 / 5 — javoblar xabarlar orasida yo'qoladi | 3 / 5 — qayerda va qachon ekani bilinmaydi (6, 7, 10) |
| o'zi tanlamaydi | — | 2 / 5 — «onam biladi» (8, 9) |
| harakat belgisi (sinovga kun belgiladi) | 4 / 5 | 1 / 5 |

   Doska shu sonlar bilan — har son o'sha ekrandagi yozuv kartalari bilan bir (T-043; tayanch 1.3 06.10 da tuzatilgan, 04-FILTR 5).
8. **Final g'oya va nom (tayanch 1.3, 9.23):** jamoa yig'ish — muammo ko'proq yozuvda takrorlandi (4 / 5) va harakat belgisi kuchliroq (4 / 5 ga 1 / 5). Mahalla to'garaklari — muammo bor, lekin yozuvlarda ikki o'smir tanlovni ota-onasiga qoldirgan → «Keyin» qutisi (04-FILTR 8).
   Nom — final g'oya tanlangach, Mentor gapi so'zma-so'z: «Final g'oyaga nom beramiz: Maydon Jamoa.» Shu ekrandan keyin mahsulot nomi «Maydon Jamoa» (8-ekrandan oldin — «Jamoa yig'ish», nom yorlig'i).
9. **Muammo gapi (tayanch 1, so'zma-so'z; 8-ekranda uch bo'lakdan yig'iladi):** **«O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.»**
   Bo'laklar: Kim — O'yinchilar · Qachon — o'yindan oldin · Nimadan qiynaladi — jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.
10. **Keys — K15 YouTube (tayanch 5, bank matni aynan):** «Video-tanishuv sayti bo'lib boshlangan — g'oya ishlamagan; asoschilar odamlar har xil video yuklayotganini payqab, «hamma narsa uchun video»ga burilgan. Raqamsiz.»
    Ko'prik: yozuvlar g'oyani o'zgartirishi mumkin. Faqat K15 voqeasi — YouTube kundalik ilova misoli sifatida ishlatilmaydi (PM-016). Bankdan tashqari fakt, yil, asoschi ismi yo'q.
11. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** intervyu oxiridagi javoblar (5), «teng chiqdi» holati (12).
12. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ▸ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q.
13. **Kod yozish (tayanch 4, PM_DARS_ETALON 26, PM-082):** VS Code, `node sanoq.js` — o'n yozuvdan har g'oya bo'yicha muammo va belgi sanog'i. 9-Modul `m7-03` dagi `sanoq.js` dan farqi: u yerda bitta
    g'oyaning shikoyatlari (`includes`, ichma-ich sikl), bu yerda **ikki g'oya yonma-yon** — yozuv obyekt (`goya`, `muammo`, `belgi`), `sanoq(goya)` ikki marta chaqiriladi, yozuv `goya` qiymatidan ajratiladi.
    3-dars — kod oynasi (savollar massivi), 5-dars — VS Code `PRD.md`: ketma-ket darslarda mexanika takrorlanmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1-darsda Mentor oltita g'oya yozdi, 2-darsda saralash va RICE dan ikkitasi qoldi — jamoa yig'ish va mahalla to'garaklari; 3-darsda ikkalasiga bir xil savollar bilan intervyu boshlandi.
  Bugun o'nta yozuv sanaladi va bitta g'oya bitiruvgacha qoladi — u shu darsda nom oladi: «Maydon Jamoa».
- **Dars ipi:** 0 — ikki g'oya va o'nta yopiq yozuv: g'oyani nimaga qarab tanlaysiz → 2 — uch savol bo'yicha takrorlangan javoblar sanaladi; muammo ikkala g'oyada ham bor, farq — bitta yozuv →
  3 — test → 4 — harakat belgisi: 4 / 5 ga 1 / 5, to'garakda kunni ota-ona belgiladi → 5 — test → 6 — YouTube: odamlar nima qilganiga qarab g'oya o'zgargan → 7 — test →
  8 — Mentor tanlovi: jamoa yig'ish final, to'garak «Keyin» qutisida; muammo gapi yozuvlardan yig'iladi; nom «Maydon Jamoa»; halol gap → 9 — o'quvchi o'z yozuvlarini sanaydi →
  10 — sherik doskaga qarab tanlaydi, o'quvchi final g'oyasini tanlab muammo gapini yozadi → 11 — kod ikki g'oyani sanaydi → 12 — yakuniy savol → podium → kartochkalar → yakun, uyda — 5 + 5 ga yetkazish va doskani qayta ko'rish.
- **Bitta vizual — «Ikki g'oya doskasi» (`IkkiGoyaDoska`, dars bo'yi, 163/180; bitta manba `MENTOR_YOZUVLAR` + `SANOQ_QATORLAR` + o'quvchi yozuvlari):**
  - **Chap — yozuvlar:** o'nta yozuv kartasi, ikki ustun: «Jamoa yig'ish» (1–5) · «Mahalla to'garaklari» (6–10). Kartada: raqam · Kim (masalan «o'yinchi, 15 yosh») · ostida bitta qator — joriy savolga javob
    (yozuvdagidek, qisqartirilmaydi; ≥ 12 px, uzun javob ikki qatorga o'tadi). Javob qatori yo'q holat — faqat raqam va Kim.
  - **O'ng — sanoq doskasi:** tepada ikki ustun nomi; to'rt qator — **Muammo bo'lgan · Hozir nima bilan · Eng qiyini · Harakat belgisi**; har katakda beshta nuqta (yozuv raqami ostida), son «n / 5»
    va qisqa javob («Telegram guruhi», «javoblar yo'qoladi»). Qator sanalmaguncha — o'rnida savol-tugma (joriysi halqada); sanalgach — nuqtalar bo'yaladi, son sanab o'sadi.
  - Holatlar: yopiq (0-ekran: kartada faqat raqam) · ochiq · joriy (accent chegara) · mos javob (accent fon, ✓) · mos emas (kulrang) · yangi qator sirg'alib kirib ~1 s yashil yonadi.
  - Ko'rinishlar (bitta komponentdan): **to'liq** (yozuvlar + doska) · **ixcham** (yozuvlar raqam-yorliqqa yig'iladi, doska butun enga) · **o'quvchiniki** (9–10-ekran: o'z g'oya nomlari, uch qator —
    Muammo bo'lgan · Eng qiyini · Harakat belgisi, nuqtalar soni — yozuvlar soni) · **qator** (3, 5, 12-ekran javobidan keyin — bitta qator kichik).
  - Ishlatiladi: 0 (yopiq) · 1 (skelet) · 2 · 3 (javobdan keyin) · 4 · 8 · 9, 10 (o'quvchiniki) · 11 (terminal — doskaning kod ko'rinishi) · 12 (javobdan keyin) · 15 (artefakt-strip «Doskam»).
    Doska ⛶ ichida kattalashadi (`zoom`, q17). `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi.
- **Mahsulot nomi o'z maketida (TAQIQLAR 0, SABOQ 2):** «Maydon Jamoa» — 8-ekran 3-qadamida telefon maketida (≈170×272, SABOQ 22), nom o'z rangida (TAYANCHGA SAVOL 6), logotip yo'q.
- **Brend o'z maketida (PM-028/029, S-018):** «YouTube» — nomi o'z qizil rangida, brauzer oynasida; logotip va o'ynatish belgisi chizilmaydi; son yo'q.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, juda yengil to'lqin (≤3%, ≥2 s — SABOQ 32, F-1006-270: «tebranish oshib ketibdi»); tanlov guruhida bitta halqa (har variantda emas — SABOQ 32).
  Yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (SABOQ 11):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi (SABOQ 25).
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → javob kartadan doskaga uchadi, nuqta bo'yaladi, son sanab o'sadi · g'oya kartasi final joyiga yoki «Keyin» qutisiga uchadi ·
  yangi qator ~1 s yashil yonadi. Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **O'n intervyudan keyin qaysi g'oya qoladi?** (41) — dars nomi (DE-205)
- Mentor: Ikki g'oya bo'yicha intervyular tugadi — endi bittasini tanlash kerak. Siz g'oyani nimaga qarab tanlardingiz?
- Maket (chap; `IkkiGoyaDoska` yopiq holatda): ikki g'oya kartasi yonma-yon — nom **Jamoa yig'ish** (ostida «mahalladagi o'yinchilar») · nom **Mahalla to'garaklari** (ostida «to'garak izlayotgan o'smirlar»);
  har birining ostida beshta yopiq yozuv kartasi («1»…«5» · «6»…«10», ichida kulrang chiziq). Tepada kulrang yorliq «Mentor misoli».
- Variantlar (radio, o'ng; bir uzunlikda):
  - Qaysi biri o'zimga ko'proq yoqishiga (36)
  - Qaysi birini tezroq qura olishimga (34)
  - Qaysi muammo ko'proq odamda borligiga (37)
- Javob (uchalasida bir xil, maqtovsiz): Uchalasining ham sababi bor. Qiziqish va qurish vaqti saralashda ko'rilgan — bugun yozuvlar nima deyishini sanaymiz. (116)
- **Harakat → Vizual o'zgarish:** variantni tanlash → o'nta yopiq yozuv navbat bilan (100 ms) ochiladi — har kartada Kim qatori chiqadi («o'yinchi, 15 yosh» … «ota-ona (qizi 14 yoshda)»);
  ikki ustun ostida kulrang «? / 5» belgisi paydo bo'ladi — sanoq hali yo'q. Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Javobni muhokama qilmang — 2 va 4-ekranlar o'zi ochadi. Uyda o'nta yozuv yig'magan o'quvchi ham tanlaydi: 9-ekranda bor yozuvlari bilan sanaydi.
  To'garak kartasidagi «Kim uchun» — 1-dars yozuvi («to'garak izlayotgan o'smirlar»); bu darsda yozuvlar shu qatorni tekshiradi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun o'nta yozuvdan bitta g'oyani tanlaysiz.** (45)
- Mentor: Intervyu savollari ikkala g'oyaga bir xil edi — shuning uchun javoblarni yonma-yon sanash mumkin.
- Chap — «Dars oxirida: takrorlangan javoblar va final g'oya» (App.jsx osti, P-015) + vizual: sanoq doskasining bo'sh shakli — ikki ustun (nomsiz), to'rt qator; har katakda beshta kulrang nuqta-skelet
  navbat bilan paydo bo'ladi (0.3 s oraliq); oxirida doska tepasida bitta bo'sh qator (uzuq chiziq — U-041, matnsiz). Hech qaysi ustun tanlanmaydi, son va matn yo'q (2, 4, 8-ekran kashfiyotini ochmaydi).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Ikki g'oya bo'yicha takrorlangan javoblarni sanaysiz · `sanoq`
  - 02 · Kim faqat gapirganini, kim ish qilganini ajratasiz · `harakat belgisi`
  - 03 · YouTube qanday g'oyadan boshlanganini ko'rasiz · `voqea`
  - 04 · O'z yozuvlaringizdan bitta g'oyani tanlab, muammo gapini yozasiz · `final g'oya`
- Harakat yo'q (reja ekrani) — vizual o'zi chiziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); «final g'oya» — faqat kulrang tegda va App.jsx ostida (ta'rif 8-ekranda).

## 2 · Takrorlangan javoblar  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · takrorlangan javob
- Sarlavha: **Qaysi javob bir necha yozuvda chiqdi?** (37)
- Mentor: Doskadagi savollarni birma-bir bosing va yozuvlarga qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Qaysi g'oyada muammo ko'proq yozuvda chiqadi?** · Jamoa yig'ishda · Ikkalasida teng · Mahalla to'garaklarida —
  tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; savol-tugmalar shundan keyin yoqiladi.
- Vizual (keng; SABOQ 21 — yozuvlar chapda, doska o'ngda): `IkkiGoyaDoska` to'liq — yozuv kartalarida faqat raqam va Kim; doskada uch savol-tugma (to'rtinchi qator — kulrang, 4-ekranda ochiladi):
  «Oxirgi marta muammo bo'ldimi?» · «Hozir nima bilan hal qilyapti?» · «Eng qiyini nima bo'ldi?» — faqat joriysi yoqilgan (halqada).
- **Harakat → Vizual o'zgarish:**
  1. «Oxirgi marta muammo bo'ldimi?» → har kartaga «Oxirgi marta» javobi sirg'alib yoziladi; muammo bo'lganlari navbat bilan (100 ms) accent ✓ oladi — 1, 2, 3, 5 · 6, 7, 10; qolganlari kulrang (4 «hamma keldi» · 8, 9).
     Doska: **Muammo bo'lgan — 4 / 5 · 3 / 5**; to'garak katagi ostida kulrang qator «2 tasi izlamagan: «onam biladi»».
  2. «Hozir nima bilan hal qilyapti?» → kartalarda «Hozir nima bilan» javobi; doska: **Hozir nima bilan — Telegram guruhi 5 / 5 · tanishlar orqali 3 / 5** (6, 7, 10; 8, 9 kulrang).
  3. «Eng qiyini nima bo'ldi?» → kartalarda «Eng qiyini» javobi; bir ma'noli javoblar bir rangda yonadi — 1, 3, 5 · 6, 7, 10 (2 «kim aniq kelishini bilmadi» va 4 — kulrang; 8, 9 «—»);
     doska: **Eng qiyini — javoblar yo'qoladi 3 / 5 · qayerda va qachon — bilinmaydi 3 / 5**.
  Uch qator to'lgach, `QIzoh`: Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob. (61)
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · haqiqatda: jamoa yig'ishda» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda muammo ikkala g'oyada ham takrorlandi: farq — bitta yozuv. (69)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Doskadagi yoqilgan savolni bosing — yozuvlar javob beradi.
- Tugma (pastki): Savollarni bosing (N/3) → Davom etish · `tugadi`: savol-tugmalar yo'qoladi, yozuvlar raqam-yorliqqa yig'iladi (✓ bilan), doska butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy savol-tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: 9-Modulda besh yozuvdan bitta muammo topilgan edi — bugun ikki g'oya yonma-yon sanaladi; savollar bir xil bo'lgani uchun qatorlar solishtiriladi.
  Sinfdan so'rang: «Hozir nima bilan» qatorida jamoada 5 / 5 — bu nimani bildiradi? (Hammada hozirgi yo'l bor — Telegram guruhi; yangi mahsulot shu yo'ldan qulayroq bo'lishi kerak.)
  2-yozuvdagi «kim aniq kelishini bilmadi» 8-ekranda muammo gapiga kiradi.

## 3 · 1-savol  ← QTest (✔ D, `correctIdx 3`)
- Eyebrow: Tekshiruv · takrorlangan javob
- Savol: **Muammo jamoada 4 yozuvda, to'garakda 3 tasida. Bu nima degani?** (10 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Jamoa yig'ish g'oyasi endi isbotlandi (37)
  - B — To'garak g'oyasida muammo umuman yo'q (37)
  - C — Bu sonlardan hech narsa bilib bo'lmaydi (39)
  - ✔ D — Muammo ikkala g'oyada ham takrorlangan (38)
- To'g'ri izohi: Farq — bitta yozuv: muammo ikkala g'oyada ham bir necha odamda bor.
- Xato izohlari: A — Bitta yozuv farqi — belgi, isbot emas. (38) · B — To'garakda ham uch yozuvda muammo bo'lgan. (42) ·
  C — Sanoq ikki g'oyani yonma-yon ko'rsatadi. (40) · (umumiy) Doskadagi birinchi qatorni eslang: sonlar qanday? (49)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida doskaning bitta qatori kichik — «Muammo bo'lgan · 4 / 5 · 3 / 5», farq qiladigan nuqta accent.
- Izoh (MD): «g'oya» A, B, D da (kalit so'z faqat to'g'rida emas); A — «4 / 5 isbot» yanglishi, B — «3 / 5 = yo'q» yanglishi, C — «son hech narsa demaydi» yanglishi (S-004). Halol gap ruhida (tayanch 7.1).

## 4 · Harakat belgisi  ← QTushuncha (2 qadam)
- Eyebrow: Tushuncha · harakat belgisi
- Sarlavha: **Sinovga kimlar kun belgiladi?** (29)
- Mentor: Har intervyu oxirida sinab ko'rishga vaqt so'ralgan: avval belgilarni oching.
- Bashorat (ballsiz, `QBashorat`): **To'garak g'oyasida nechta odam kun belgilagan?** · Bittasi · Uchtasi · Beshtasi (bitta o'lchov, o'sish tartibida — S-015)
- Qadam chiplari (`QQadamlar`, ixcham; joriysi accent, o'tgani ✓): 1 Belgilar · 2 Kim belgiladi
- Vizual: 2-ekrandagi `IkkiGoyaDoska` (uch qator to'la, yozuvlar raqam-yorliqda); to'rtinchi qator «Harakat belgisi» joyida savol-tugma.
- **Harakat → Vizual o'zgarish:**
  1. «Belgilarni ochish» (doskadagi savol-tugma) → yozuv yorliqlariga «Belgi» navbat bilan tushadi: «ha» — yashil ✓ «kun belgiladi», «yo'q» — kulrang; to'rtinchi qator to'ldiriladi:
     **Harakat belgisi — 4 / 5 · 1 / 5**. `QIzoh`: Harakat belgisi — odam so'z bilan emas, ish bilan ko'rsatgan qiziqish; bu misolda — sinovga kun belgiladi. (106)
     Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: bittasi» yoki «Taxminingiz to'g'ri chiqdi».
  2. «Kim belgiladi?» (to'garak ustuni tepasidagi tugma, halqada) → to'garak kartalari Kim bo'yicha ikki guruhga suriladi: «o'smir» (6, 8, 9) · «ota-ona» (7, 10);
     yagona «ha» — 7-yozuv (ota-ona) yonadi; birinchi qatordagi «2 tasi izlamagan: «onam biladi»» bir lahza ajraladi, 8 va 9-kartada o'sha gap ochiladi («onam biladi» · «dadam topadi»).
     `QIzoh`: To'garakda kunni ota-ona belgiladi, o'smirlar esa belgilamadi. (62)
- Xulosa: Bu misolda harakat belgisi jamoa yig'ishda kuchliroq; to'garakda ikki o'smir tanlovni ota-onasiga qoldirgan. (108)
- Tugma (pastki): ① Belgilarni oching → ② Kim belgilaganini ko'ring → Davom etish · `tugadi`: qadam chiplari va tugmalar yo'qoladi, doska butun enga (to'rt qator), to'garak guruhlari joyida qoladi.
- Keyingi bosiladigan joy: bashorat → «Belgilarni ochish» → «Kim belgiladi?» → «Davom etish».
- O'qituvchi eslatmasi: Belgi — so'z emas, ish: «ishlatardim» degani va sinovga kun belgilash bir xil emas (9-Modulda bunday javob «va'da» deyilgan).
  «Yo'q» — odam qiziqmaydi degani emas: vaqti yo'q bo'lishi ham mumkin; belgi — dalillardan biri (04-FILTR 9). Sinfdan so'rang: to'garak ilovasini kim ochadi, kim tanlaydi?
  To'garak g'oyasi yomon emas — bu yozuvlarda tanlovchi boshqa odam (ota-ona) ekani ko'rindi.

## 5 · 2-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi olam — P-002)
- Eyebrow: Tekshiruv · harakat belgisi
- Savol: **Mentor misolidagidek, qaysi biri harakat belgisi?** (6 so'z; 04-FILTR 11) · savol ustida yorliq yo'q
  - A — Chiqsa, ishlatib ko'rishini aytdi (32)
  - ✔ B — Sinab ko'rishga o'zi kun belgiladi (33)
  - C — G'oyani yoqtirganini aytib maqtadi (33)
  - D — Do'stlari ham ishlatishini aytdi (31)
- To'g'ri izohi: Odam o'z vaqtidan kun belgiladi — bu so'z emas, ish.
- Xato izohlari: A — Bu va'da: hali bo'lmagan ish haqida. (36) · C — Yoqqani — so'z: odam hech narsa qilmadi. (40) ·
  D — Bu boshqalar haqida taxmin, ish emas. (37) · (umumiy) Odam nima qildi — shuni qidiring. (33)
- Javob topilgach (kichik, savol ostida): 7-yozuv yorlig'i — «Belgi: ha · kun belgiladi».
- Izoh (MD): to'rt variant — odam nima qilgani (qo'shtirnoqsiz, bir shaklda); «aytdi» A va D da, «ishlat-» A va D da — belgi faqat to'g'rida emas. Ikkinchi olam — umumiy intervyu (mahsulot nomsiz).

## 6 · YouTube  ← QVoqea (PM keys K15; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **YouTube qanday g'oyadan boshlangan?** (35)
- Nuqtalar (3) · yorliq **YouTube · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **YouTube** (o'z qizil rangida) — video qo'yiladigan va ko'riladigan sayt. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket; slayd ichida takror matn yo'q.
- Sahna (`YouTubeSahna`, chizilgan CSS/SVG; brauzer oynasi — nuqtalar va kulrang manzil qatori; bosqichga qarab o'zgaradi; bankda yo'q narsa chizilmaydi — asoschi surati, yil, son, logotip yo'q):
  - 1/3 **Tanishuv sayti** — Mentor: YouTube avval tanishuv sayti bo'lib boshlangan: odamlar o'zi haqida video qo'yib, tanishishi kerak edi.
    · sahna: sahifa tepasida nom «YouTube» (qizil); o'rtada bitta profil-video kartasi — siluet, yorliq «O'zim haqimda», ▸ belgisi; yonida ikki bo'sh joy (uzuq chiziq).
    · bashorat (sahna ostida, bitta qator; S-015 — tor → keng): **Odamlar saytga qanday video yuklagan?** · Faqat tanishuv videosini · Asosan tanishuv videosini · ✔ Har xil videoni
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Har xil video** — Mentor: Tanishuv g'oyasi ishlamagan. Lekin asoschilar odamlar saytga har xil video yuklayotganini payqagan.
    · sahna: profil kartasi xiralashadi; bo'sh joylarga yangi video kartalari navbat bilan kiradi — har biri boshqa rangda, ichida boshqa chizilgan belgi (nota, to'p, kamera); mavzu yozuvi yo'q.
  - 3/3 **Hamma narsa uchun video** — Mentor: Asoschilar saytni «hamma narsa uchun video» qilib o'zgartirgan — shu ishlagan.
    · sahna: «O'zim haqimda» kartasi yo'qoladi; nom ostida yorliq «hamma narsa uchun video»; video kartalari uch ustunli to'r bo'lib joylashadi.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: har xil videoni» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): YouTube asoschilari g'oyani odamlar saytda nima qilayotganiga qarab o'zgartirgan. (81)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: Ko'prik: bu darsda ham yozuvlar g'oyani o'zgartirishi mumkin — to'garak yozuvlarida ikki o'smir tanlovni ota-onasiga qoldirgan. Bankdan tashqari yil, son, asoschi ismi qo'shmang;
  «tanishuv sayti» mavzusini kengaytirmang — voqeaning ma'nosi: odamlar nima qilganiga qarash.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K15 (bank: raqamsiz) · tayanch 5 (o'zbekcha matn). «Video qo'yiladigan va ko'riladigan sayt» — brend izohi (S-018, umumiy bilim).

## 7 · 3-savol  ← QTest (✔ C, `correctIdx 2`; YouTube voqeasi)
- Eyebrow: Tekshiruv · YouTube
- Savol: **YouTube asoschilari g'oyani nimaga qarab o'zgartirgan?** (6 so'z) · savol ustida yorliq yo'q
  - A — Raqobatchi saytlar nima qilayotganiga (37)
  - B — Sayt nomi odamlarga qanchalik yoqqaniga (39)
  - ✔ C — Odamlar saytga qanday video yuklaganiga (39)
  - D — O'zlari qaysi videoni ko'proq yoqtirganiga (42)
- To'g'ri izohi: Ular odamlar har xil video yuklayotganini payqagan.
- Xato izohlari: A — Voqeada raqobatchilar haqida gap bo'lmadi. (42) · B — Voqeada sayt nomi haqida gap bo'lmadi. (38) ·
  D — Ular o'zlariga emas, odamlarga qarashgan. (41) · (umumiy) Ikkinchi bosqichni eslang: asoschilar nimani payqadi? (53)
- Izoh (MD): «odamlar» B va C da, «video» C va D da; distraktorlar bankka zid fakt aytmaydi — tanlov sababini taxmin qiladi (S-004).

## 8 · Final g'oya  ← QTushuncha (markaziy, 3 qadam; SABOQ 9/13)
- Eyebrow: Tushuncha · final g'oya
- Sarlavha: **Mentorning ikki g'oyasidan qaysi biri qoladi?** (45) — 0-ekran savoliga javob (T-064)
- Mentor (qadamga qarab, har biri bitta gap):
  1. Doskaga qarab belgilang: Mentor qaysi g'oyani bitiruvgacha quradi?
  2. Muammo gapini yozuvlardan yig'ing: har bo'lakka mos gapni tanlang.
  3. Final g'oyaga nom beramiz: Maydon Jamoa. (tayanch 9.23, so'zma-so'z)
- Qadam chiplari (`QQadamlar`): 1 Tanlov · 2 Muammo gapi · 3 Nom
- Vizual (≤ 3 blok): chap — `IkkiGoyaDoska` ixcham (to'rt qator, ikki ustun); o'ng — **final kartasi**: tepada bo'sh joy «Final g'oya», ostida uch bo'sh qator «Kim · Qachon · Nimadan qiynaladi»,
  pastda kichik «Keyin» qutisi (bo'sh, uzuq chiziq). 3-qadamda chap blok telefon maketiga almashadi.
- **1-qadam · Tanlov** (ballsiz tanlov — Mentor qarorini taxmin qilish): final kartasi ustida ikki g'oya tugmasi — «Jamoa yig'ish» · «Mahalla to'garaklari».
  - **Harakat → Vizual o'zgarish:** tanlov → doskada ikki dalil navbat bilan yonadi: «Muammo bo'lgan 4 / 5 · 3 / 5» va «Harakat belgisi 4 / 5 · 1 / 5»; «Jamoa yig'ish» kartasi «Final g'oya» joyiga uchadi,
    «Mahalla to'garaklari» kartasi «Keyin» qutisiga uchadi, ostida kulrang sabab-qator «ikki o'smir tanlovni ota-onasiga qoldirgan».
  - Natija qatori (`QTaxmin`): «Taxminingiz: … · Mentor tanlovi: jamoa yig'ish» yoki «Taxminingiz to'g'ri chiqdi».
  - `QIzoh`: Intervyudan keyin tanlangan, bitiruvgacha quriladigan bitta g'oya — final g'oya. (80)
- **2-qadam · Muammo gapi** (bo'laklar ketma-ket; joriy qator accent, ostida 3 tanlov — navbat bilan chiqadi, aralash tartib, to'g'ri o'rni har qatorda boshqa):
  1. **Kim** — Hamma odamlar · O'yinchilar ✔ · Maydon egalari
  2. **Qachon** — o'yindan oldin ✔ · o'yin tugagandan keyin · maydon band bo'lganda
  3. **Nimadan qiynaladi** — Telegram guruhida xabar yozishda qiynaladi · o'yin e'loni ilovasi yo'qligidan qiynaladi · jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi ✔
  Kim bo'lagi gap boshida (bosh harf); Qachon va Nimadan qiynaladi — gap o'rtasida (kichik harf, «Telegram» — atoqli ot).
  Tuzoqlar har qatorda bitta xato-sinf (S-040): 1 — yozuvlarda gapirmagan odam yoki «hamma» · 2 — yozuvlardagi qiyinchilik vaqti emas · 3 — qiyinchilik o'rniga hozirgi vosita yoki yechim.
  - `QXato` (≤60): 1 «Hamma odamlar» — «Hamma» juda keng. Yozuvlarda kim gapirgan? (43) · 1 «Maydon egalari» — Bu yozuvlarda maydon egasi gapirmagan. (38) ·
    2 «o'yin tugagandan keyin» — Yozuvlarda qiyinchilik o'yindan oldin bo'lgan. (46) · 2 «maydon band bo'lganda» — Band maydon — boshqa muammo; bu yerda odam yetmagan. (52) ·
    3 «Telegram…» — Yozish qiyin emas — javoblar xabarlar orasida yo'qoladi. (56) · 3 «ilovasi yo'qligidan» — Bu yechim — muammo gapida ilova bo'lmaydi. (42)
  - **Harakat → Vizual o'zgarish:** to'g'ri tanlov → bo'lak final kartasidagi qatoriga uchib yoziladi (~1 s yashil); doskada manba yozuvlari bir lahza yonadi:
    Kim — beshta «o'yinchi» · Qachon — 1, 3, 5 «Oxirgi marta» · Nimadan qiynaladi — 1, 3, 5 «javoblar yo'qoladi» va 2, 5 «kim aniq kelishini bilmadi».
    Xato → tanlov silkinadi, qator bir lahza `err` fon, bitta `QXato`. 3/3 dan keyin uch qator bitta gapga qo'shiladi:
    «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.»
  - Yordam (birinchi xatodan keyin, P-033; qatorga qarab bitta gap): 1–5-yozuvlarda gapirganlarning hammasi maydonda o'ynaydi. · Yozuvlardagi «Oxirgi marta» qatori o'yindan oldinmi, keyinmi? ·
    Muammo gapida yechim bo'lmaydi: odam aynan nimadan qiynalgan?
- **3-qadam · Nom** («Nom berish» tugmasi, halqada):
  - **Harakat → Vizual o'zgarish:** chapda doska kichrayib chiqadi, telefon maketi kiradi (≈170×272): ekran tepasida nom **Maydon Jamoa** (o'z rangida) harfma-harf yoziladi; ostida namuna e'lon kartasi
    «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (son yonida o'nta kichik doira, sakkiztasi to'la — qo'shilganlar; 04-FILTR 19) va «Qo'shilaman» tugmasi; telefon ostida kulrang yorliq «chizma — hali qurilmagan». Final kartasida nom yorlig'i «Jamoa yig'ish» → «Maydon Jamoa»,
    muammo gapi ostida kulrang dalil-qator «Muammo 4 / 5 · belgi 4 / 5» (doska endi ko'rinmaydi — son ekranda bir marta, P-062).
- Natija (`tugadi`): qadam chiplari va tanlovlar yo'qoladi; chapda telefon, o'ngda bitta final kartasi — nom · muammo gapi · dalil-qator · «Keyin»: Mahalla to'garaklari.
- Xulosa: 10 intervyu — kichik son; bu tanlov uchun dalil, isbot emas. (60) — tayanch 1.3 halol gapi, so'zma-so'z
- Tugma (pastki): ① Tanlang → ② Muammo gapini yig'ing (N/3) → ③ Nom bering → Davom etish
- Keyingi bosiladigan joy: g'oya tugmalari → joriy qatorning uch tanlovi (navbatma-navbat to'lqin) → «Nom berish» → «Davom etish».
- Nishon: Problem Builder! (2-qadam, uch qatorda birinchi urinishda).
- O'qituvchi eslatmasi: Muammo gapi qolipi — 9-Moduldagidek: kim · qachon · nimadan qiynaladi; unda yechim yo'q. «Maydon Jamoa» — shu ekrandan modul bo'yi mahsulot nomi.
  Sinfdan so'rang: to'garak g'oyasi o'chirildimi? (Yo'q — «Keyin» qutisida.) Telefondagi e'lon — chizma, hali qurilmagan; quriladigan narsa keyingi darslarda tanlanadi (o'quvchiga aytilmaydi).

## 9 · Sizning sanog'ingiz  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Yozuvlaringizda qaysi javob takrorlandi?** (40)
- Mentor: Qog'ozdagi yozuvlaringizni har g'oya bo'yicha alohida sanang.
- **Tepada — ixcham chiziq «Doskam»:** ikki g'oya nomi (`pm-m9d3-intervyu` → `goyalar`) va holati (joriy — accent, saqlangan — ✓). Kalit bo'lmasa — nomlar o'rnida ikki qator «1-g'oya nomi» · «2-g'oya nomi» (o'quvchi yozadi).
- **Markazda — bitta katta karta (joriy g'oya; chiplari 1 {1-g'oya} · 2 {2-g'oya}):**
  - Sanoq qog'ozdagi hamma yozuvdan kiritiladi (uy yozuvlari platformada yo'q — tayanch 9.44). Kalitda darsdagi 1–2 haqiqiy yozuv bo'lsa — kichik kartalar bo'lib eslatma sifatida turadi, alohida sanalmaydi.
  0. **Nechta yozuv?** — haqiqiy yozuvlar soni N (son-tanlagich 1…10; mashq yozuvi kirmaydi).
  1. **Muammo bo'lgan** — «Nechtasida odam oxirgi marta qiynalganini aytgan?» n (1…N); ostida kulrang yo'riq: Bu sanoq — sizning o'qishingiz: qaysi yozuvda muammo bo'lganini javobga qarab o'zingiz belgilaysiz. (04-FILTR 13)
  2. **Harakat belgisi** — «Nechtasida «ha» — kun belgilagan?» m (0…N).
  3. **Eng qiyini** — qator (placeholder «Qaysi qiyinchilik bir necha yozuvda chiqdi?») + «Nechta yozuvda?» son-tanlagich (1…N).
  - «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob qator ostida):
  - g'oya nomi bo'sh (kalitsiz; bloklaydi): G'oya nomini yozing. (20)
  - Eng qiyini qatori bo'sh (bloklaydi): Bir necha yozuvda chiqqan qiyinchilikni yozing. (47)
  - Eng qiyini sanog'i 1 (yumshoq): Bu bitta yozuvda chiqdi — takrorlangani emas. (45)
  - ikkala g'oya saqlangach, N < 5 (bittasida ham; yumshoq, bloklamaydi): Har g'oyada 5 tadan yozuv bo'lsa, final g'oyani tanlaysiz; hozircha — vaqtincha tanlov. (87)
  - N lar har xil (yumshoq): Yozuvlar soni har xil — sonlarni ehtiyot bilan solishtiring. (60)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam: Yozuvlarni birma-bir o'qing: oxirgi marta odam qiynalganmi? Keyin «Eng qiyini» qatorlarini solishtiring — so'zlari boshqa, ma'nosi bir xil javoblar qaysilari?
- **Harakat → Vizual o'zgarish:** son tanlanganda shu qatordagi nuqtalar bo'yaladi, son sanab o'sadi. «Saqlash» → karta kichrayib o'quvchi doskasining o'z ustuniga uchadi, uch qatorda nuqtalar bo'yaladi;
  pastdan ikkinchi g'oya kartasi kiradi. Tekshiruvdan o'tmagan qator `err` fon, ostida bitta `QXato`.
  2/2 dan keyin karta yopiladi; o'quvchi doskasi butun enga — ikki ustun, uch qator (Muammo bo'lgan · Eng qiyini · Harakat belgisi), har ustunda ✎ (bosilsa o'sha g'oya katta karta bo'lib ochiladi).
- Xulosa: Doskangiz tayyor: ikki g'oya bir xil qatorlar bilan sanaldi. (60)
- Tugma (pastki): Ikkala g'oyani saqlang (N/2) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: «Nechta yozuv?» → uch son-tanlagich → Eng qiyini qatori → «Saqlash» → ikkinchi karta → «Davom etish».
- Artefakt-strip (U-042): shu ekrandan — «Doskam» (ixcham, «2/2 ✓»); 10 va 15-ekranda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: Repeat Finder! (2/2 saqlanganda).
- Mentor rejimi: forma o'rniga Mentorning doskasi (2 va 4-ekran natijasi); o'quvchilar o'z ekranida sanaydi. Mentor statistikasi: «Doskasini saqlaganlar» · «5 + 5 yozuvga yetganlar».
- O'qituvchi eslatmasi: Yozuvi yo'q o'quvchi sherigining yozuvlari bilan mashq qiladi (tanlovi vaqtincha). Yozuvlar 5 + 5 dan kam bo'lsa ham sanaladi — tanlov vaqtincha, uyda to'ldiriladi.
  Eng ko'p xato — «yoqdi» degan javobni muammo deb sanash: «Odam oxirgi marta qiynalganmi?» deb so'rang.

## 10 · Final g'oyangiz  ← QMustaqil (juftlik, 3 qadam; yakka rejimda 2 qadam; P-057 solishtirish)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Bitiruvgacha qaysi g'oyani qurasiz?** (35)
- Mentor: Avval doskangizni sherigingizga ko'rsating: u qaysi g'oyani tanlaydi?
  Yakka rejimda: Doskangizga qarab bitta g'oyani tanlang — ikkinchisi «Keyin» qutisiga o'tadi.
- Qadam chiplari: 1 Sherigingiz tanlaydi · 2 Siz tanlaysiz · 3 Muammo gapi (yakka: 1 Siz tanlaysiz · 2 Muammo gapi)
- **1-qadam:** o'quvchi doskasi (9-ekrandan, ixcham) · ostida yorliq «Sherigingiz tanladi:» va ikki tugma — {1-g'oya} · {2-g'oya}.
- **2-qadam:** ikki g'oya kartasi (doskadagi sonlari bilan) · bittasini bosish → «Final g'oya» joyiga uchadi; ikkinchisi «Keyin» qutisiga, ostida qator «Nega keyin?» (placeholder «Bir gap bilan»).
  - Solishtirish (juftlikda): bir xil → sherik tanlovi bilan o'quvchi tanlovi orasida yashil chiziq; boshqacha → kulrang uzuq chiziq, `QIzoh` «Sherigingizga qaysi dalil yoki sabab tanlovingizga ta'sir qilganini ayting.» (75);
    ikkala holatda ostida kulrang qator: Sherik tanlovi dalil emas: u doskangizni boshqa odam qanday o'qishini ko'rsatadi. (81) (04-FILTR 21, 22)
  - Vaqtincha (9-ekranda N < 5): «Final g'oya» joyi yorlig'i — «Vaqtincha tanlov», saqlanganda `vaqtincha: true`.
  - Yumshoq (tanlangan g'oyaning ikkala soni ham kichikroq bo'lsa): Doskada sonlar ikkinchi g'oyada kattaroq. Sababini yozing. (58) — ostida qator «Nega shu g'oya?» (tanlov o'quvchiniki — S-008).
- **3-qadam · Muammo gapi:** uch qator — **Kim** (placeholder «Kim qiynaladi?») · **Qachon** («Qachon qiynaladi?») · **Nimadan qiynaladi** («… qiynaladi»); ostida yig'ilgan gap (muammo gapi kartasi):
  «{Kim} {qachon} {nimadan qiynaladi}.» va kulrang dalil-qator «Muammo {n} / {N} · belgi {m} / {N}» (doskadan).
  Tekshiruv-juftlik (PM-020, KORPUS §37): «O'yinchilar» + «o'yindan oldin» + «jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi» → tayanch 1 gapi ✓ ·
  «Ota-onalar» + «yozda» + «farzandiga to'garak topishda qiynaladi» → «Ota-onalar yozda farzandiga to'garak topishda qiynaladi.» ✓
  - Javob-qatorlari (≤60, bloklamaydi, yo'naltiradi):
    - yechim so'zi («ilova», «sayt», «bot», «kerak»): Bu yechim. Odam nimadan qiynalishini yozing. (44)
    - Kim — «hamma», «hamma odamlar», «har kim»: «Hamma» juda keng. Yozuvlarda kim gapirgan? (43)
    - uchinchi qatorda «qiynal» ildizi yo'q: Oxirida «qiynaladi» tursin: nimadan qiynaladi? (46)
    - qisqa (< 3 so'z): Qisqa qoldi: to'liq yozing. (27)
  - «Saqlash» o'ngda → `pm-m9d4-final`.
- **Harakat → Vizual o'zgarish:** sherik tugmasi → doska ustida kichik yorliq «Sherik: {g'oya}» · g'oya kartasi → final joyiga / «Keyin» qutisiga uchadi, solishtirish chizig'i chiziladi ·
  uch qator yozilgach yig'ilgan gap qatorma-qator yoziladi · «Saqlash» → final kartasi ~1 s yashil yonadi, «Doskam» strip «Final ✓» oladi.
- Xulosa: Final g'oyangiz saqlandi; ikkinchi g'oya «Keyin» qutisida turibdi. (66) · vaqtincha: Vaqtincha tanlov saqlandi: yozuvlar 5 + 5 bo'lganda doskani qayta ko'ring. (73)
- Tugma (pastki): ① Sherigingiz tanlasin → ② O'zingiz tanlang → ③ Muammo gapini yozing → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: sherik tugmalari → g'oya kartalari → «Nega keyin?» → Kim qatori → … → «Saqlash».
- Nishon: Final Idea! (saqlanganda).
- Yakka rejim (sherik yo'q): 1-qadam yo'q, solishtirish chizig'i yo'q; qolgani aynan.
- Mentor statistikasi: «Sherigi bilan bir xil tanlaganlar» · «Final g'oyasini saqlaganlar».
- O'qituvchi eslatmasi: Sherik boshqacha tanlasa — g'oya yomon degani emas: doskadagi sonlar bilan tanlov orasida nima borligini so'rang (qiziqish, qurish vaqti). Jamoa yig'ishni tavsiya qilmang —
  har o'quvchining o'z g'oyasi. 2–3 juftlikdan so'rang: qaysi dalil yoki sabab tanlovga ta'sir qildi?

## 11 · Kod yozish  ← QKod (VS Code; tayanch 4; PM-082)
- Eyebrow: Kod yozish · VS Code
- Sarlavha: **Ikki g'oyani yonma-yon sanaydigan kod yozamiz.** (46) — PM-082(a) sarlavha oilasi (korpus §19, §48)
- **1-bosqich (darvoza-mashq, ballsiz; PM-082 c/e)** — Mentor: Avval bitta savol — so'ng kod yoziladi.
  - Savol: **Kod jamoa yig'ish yozuvlarini qanday ajratadi?** — uch tanlov:
    ✔ «`goya` qiymati "jamoa" bo'lgan yozuvlarni oladi» · «Ro'yxatdagi birinchi beshta yozuvni oladi» · «`belgi` qiymati `true` bo'lgan yozuvlarni oladi»
  - Xato (silkinadi + qator): birinchi beshta — Yozuvlar aralash bo'lishi mumkin: g'oya `goya` dan bilinadi. (60) · `belgi` — `belgi` kun belgilaganini aytadi, g'oyani emas. (49)
- **2-bosqich** — Mentor: Doskada qo'lda sanaganingizni endi kod ikki g'oya uchun sanaydi.
  - Chap (vazifa, 3 band; bosiladigan katakcha emas): 1 Har g'oya uchun bitta qator · 2 Qatorda muammo va belgi soni · 3 Sonlar doskadagi bilan bir xil
  - Yordam (yopiq):
    - Eslatma (JavaScript darslaridan): `y.goya` — yozuvdagi `goya` qiymati · `===` — ikki qiymat tengmi · `if (...)` — shart rost bo'lsa, ichidagi qator ishlaydi ·
      `if (y.muammo)` — `y.muammo` rost (`true`) bo'lsa ishlaydi · `jami = jami + 1` — songa bitta qo'shadi · **terminal** — `node sanoq.js` yozib natijani ko'radigan oyna
    - Uch qadam: 1. Shart: `if (y.goya === goya) { … }` · 2. Ichida: `jami = jami + 1;` · 3. Yana ichida ikki shart: `if (y.muammo) muammoSoni = muammoSoni + 1;` va `if (y.belgi) belgiSoni = belgiSoni + 1;`
  - Tugma: Bajardim — ikki qator chiqdi (o'ngda)
  - O'ng: VS Code oynasi `sanoq.js` (qo'lda yoziladi; sichqoncha ustida: Kod nusxalanmaydi — o'zingiz terib yozasiz; PM-082 d), ostida terminal.
  - Mentor gapi (o'ng, kod ustida): Kodni VS Code'da o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi. (korpus §19)
- Kod (`sanoq.js`):
```js
// sanoq.js — Mentor misoli: ikki g'oya bo'yicha o'nta yozuv
// muammo — oxirgi marta muammo bo'lganmi · belgi — sinovga kun belgilaganmi
const yozuvlar = [
  { goya: "jamoa", muammo: true, belgi: true },          // 1
  { goya: "jamoa", muammo: true, belgi: true },          // 2
  { goya: "jamoa", muammo: true, belgi: true },          // 3
  { goya: "jamoa", muammo: false, belgi: false },        // 4
  { goya: "jamoa", muammo: true, belgi: true },          // 5
  { goya: "to'garak", muammo: true, belgi: false },      // 6
  { goya: "to'garak", muammo: true, belgi: true },       // 7
  { goya: "to'garak", muammo: false, belgi: false },     // 8
  { goya: "to'garak", muammo: false, belgi: false },     // 9
  { goya: "to'garak", muammo: true, belgi: false },      // 10
];

function sanoq(goya) {
  let jami = 0;
  let muammoSoni = 0;
  let belgiSoni = 0;
  for (let i = 0; i < yozuvlar.length; i++) {
    const y = yozuvlar[i];   // y — shu aylanishdagi yozuv
    // Shu yerga: y.goya shu g'oya bo'lsa — jami'ga bitta qo'shing,
    // ichida: y.muammo rost bo'lsa — muammoSoni'ga, y.belgi rost bo'lsa — belgiSoni'ga (Yordam ▸)
  }
  console.log(goya + " — muammo " + muammoSoni + " / " + jami + " · belgi " + belgiSoni + " / " + jami);
}

sanoq("jamoa");
sanoq("to'garak");
```
  - Terminal paneli «Kutilgan natija» (boshidan xira, 9-Modul 12-q1 A naqshi):
```
$ node sanoq.js
jamoa — muammo 4 / 5 · belgi 4 / 5
to'garak — muammo 3 / 5 · belgi 1 / 5
```
- Sonlar tekshiruvi (tayanch 1.3): jamoa muammo 1, 2, 3, 5 · belgi 1, 2, 3, 5 · to'garak muammo 6, 7, 10 · belgi 7 — kodning `true`/`false` qiymatlari yozuvlar jadvali bilan aynan.
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri tanlov → kod namunasida `goya` kalitlari bir lahza ajraladi (doskaning ustun nomi rangida). «Bajardim» → terminaldagi kutilgan natija xiradan
  to'liq rangga o'tadi, ikki qator ketma-ket bir lahza ajraladi; terminal yonida doskaning ikki qatori kichik (Muammo bo'lgan · Harakat belgisi) — sonlar mos ekanini ko'rsatadi (SABOQ 20).
- Jonli darsda (o'quvchiga ko'rinmaydi — PM-082 f): Sinfda: N bajardi · N hali bajarmoqda
- Tugmalar: Orqaga · Avval kod-savolini yeching → ② Kodni yozing va tugmani bosing → Davom etish
- Nishon: Count Coder! (darvoza birinchi urinishda va «Bajardim»).
- O'qituvchi eslatmasi: Kod — yangi qoida yo'q: g'oyani `goya` qiymatidan ajratish va ikki sanoq. `"to'garak"` — satr ikki qo'shtirnoqda, apostrof xato bermaydi; bitta qo'shtirnoq bilan yozilsa — xato.
  O'z yozuvlarini massivga qo'shib, o'z g'oyalari nomi bilan `sanoq("…")` chaqirgan o'quvchini maqtang — shart emas.

## 12 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; «teng chiqdi» holati — P-002)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Ikki g'oyada muammo teng chiqdi. Doskadan yana nimani ko'rasiz?** (9 so'z; 04-FILTR 12) · savol ustida yorliq yo'q
  - ✔ A — Necha yozuvda harakat belgisi «ha» ekanini (42)
  - B — Qaysi odam muammoni eng qattiq aytganini (40)
  - C — Qaysi g'oyaning nomi esda qolarliroq ekanini (44)
  - D — Qaysi intervyu eng uzoq davom etganini (38)
- To'g'ri izohi: Doskadagi keyingi dalil — harakat belgisi; qaror bitta qatorga tayanmaydi.
- Xato izohlari: B — Qattiq gap bir odamniki — sanoq emas. (37) · C — Nom g'oyani tanlamaydi — yozuvlarga qarang. (43) ·
  D — Uzoq suhbat — muammo ham, belgi ham emas. (41) · (umumiy) Doskaning to'rtinchi qatorini eslang. (37)
- Javob topilgach (kichik, savol ostida): doskaning bitta qatori — «Harakat belgisi · 4 / 5 · 1 / 5».
- Izoh (MD): «Qaysi» to'rtalasida; «g'oya» A va C da, «odam» A va B da (kalit so'z faqat to'g'rida emas); savol — teng holat (ikkinchi olam), Mentor misolini takrorlamaydi.

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Takrorlangan javob · 2 — Harakat belgisi · 3 — YouTube · 4 — Teng sanoq

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Takrorlangan javob nima? | Bir necha yozuvda bir xil ma'noda qaytgan javob |
| Ikki g'oyaning javoblarini nega yonma-yon sanash mumkin? | Ikkala g'oyaga bir xil savollar berilgan |
| Harakat belgisi nima? | Odam so'z bilan emas, ish bilan ko'rsatgan qiziqish; Mentor misolida — sinovga kun belgiladi |
| «Ishlatib ko'raman» degan javob harakat belgisimi? | Yo'q: bu va'da — hali bo'lmagan ish haqida |
| Mentor misolida muammo qaysi g'oyada ko'proq yozuvda chiqdi? | Jamoa yig'ishda: 5 yozuvdan 4 tasida, to'garakda 3 tasida |
| Mentor misolida sinovga qaysi g'oya bo'yicha ko'proq kun belgilandi? | Jamoa yig'ishda — 4 / 5; to'garakda — 1 / 5 |
| Nega mahalla to'garaklari «Keyin» qutisiga o'tdi? | Harakat belgisi kam; yozuvlarda ikki o'smir tanlovni ota-onasiga qoldirgan |
| Final g'oya nima? | Intervyudan keyin tanlangan, bitiruvgacha quriladigan bitta g'oya |
| Muammo gapida qaysi uch bo'lak bor? | Kim, qachon va nimadan qiynaladi — yechim yo'q |
| O'nta intervyu g'oyani isbotlaydimi? | Yo'q: bu tanlov uchun dalil, isbot emas |
| YouTube g'oyasi nimaga qarab o'zgargan? | Odamlar saytga har xil video yuklayotganiga |
| Kodda `y.goya === goya` nimani tekshiradi? | Yozuv shu g'oyaniki ekanini |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (takrorlangan javob — 2 · bir xil savollar — 1 · harakat belgisi — 4 · va'da — 5 · sonlar — 2, 4 · ota-ona — 4, 8 · final g'oya — 8 · muammo gapi — 8, 10 ·
  dalil, isbot emas — 8 · YouTube — 6 · `y.goya` — 11).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan; 1, 3, 8 — «… nima?» atama savoli, javob — ta'rif). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Final g'oyangiz va muammo gapingiz tayyor.** (42) · 10-ekran saqlanmagan bo'lsa (P-046): **Doskangiz tayyor — final g'oyani uyda tanlaysiz.** (48) · vaqtincha: **Vaqtincha tanlov tayyor — yozuvlar 5 + 5 bo'lsin.** (48)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Yozuvlar sanog'i final g'oya uchun yangi dalil beradi, isbot emas: qaror bitta songa tayanmaydi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob; ikki g'oyani bir xil qatorlar bilan sanaysiz.
  - Harakat belgisi — so'z emas, ish: Mentor misolida odam sinovga kun belgiladi.
  - Mahsulotni kim ishlatishi va kim tanlashi boshqa-boshqa odam bo'lishi mumkin.
  - Muammo gapi kim, qachon va nimadan qiynalishini aytadi — unda yechim yo'q.
  - YouTube asoschilari g'oyani odamlar saytda nima qilayotganiga qarab o'zgartirgan.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: o'z auditoriyangiz · Nechta: 10 yozuv · Muddat: keyingi darsgacha
  - ① Har g'oyada 5 ta yozuv bo'lmasa, qolgan intervyularni o'tkazing, doskangizdagi sonlarni yangilang va tanlovni qayta ko'ring.
  - ② Muammo gapingizni qayta o'qing: kim, qachon va nimadan qiynalishi bormi, yechim kirib qolmadimi?
  - ③ Sinovga kun belgilagan odamlarni qog'ozingizda belgilab qo'ying — ismi emas, kimligi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «G'oyangiz bir sahifaga sig'adimi?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ichki skroll qutisi yo'q (SABOQ 18); artefakt-strip «Doskam» — uyga vazifa kartasi ustida; «Kim bilan» — HwCard yorlig'i (muammo gapining «Kim» bo'lagi bilan aralashmasin, T-015).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Problem Builder!** (8-ekran, 2-qadam, uch qatorda birinchi urinishda) — Mentorning muammo gapini yozuvlardan birinchi urinishda yig'dingiz
- **Repeat Finder!** (9-ekran, 2/2 saqlanganda) — O'z yozuvlaringizda takrorlangan javoblarni sanadingiz
- **Final Idea!** (10-ekran, saqlanganda) — Final g'oyangizni tanlab, muammo gapini yozdingiz
- **Count Coder!** (11-ekran, darvoza birinchi urinishda va «Bajardim») — Ikki g'oyani yonma-yon sanaydigan kod yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Takrorlangan javob** — 1 Ikkala g'oyaga bir xil savollar berilgan — javoblar yonma-yon sanaladi. · 2 Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob. ·
  3 Mentor misolida muammo jamoada 5 yozuvdan 4 tasida, to'garakda 3 tasida — farq bitta yozuv.
  — Sinfga savol: Yozuvlaringizda qaysi qiyinchilik bir necha marta chiqdi?
- **5 · Harakat belgisi** — 1 «Ishlatib ko'raman» — bu va'da: hali bo'lmagan ish. · 2 Odam sinab ko'rishga kun belgiladi — bu harakat belgisi: so'z emas, ish. ·
  3 Mentor misolida belgi: jamoa yig'ishda 4 / 5, to'garakda 1 / 5.
  — Sinfga savol: Intervyularingizda kim sinovga kun belgiladi?
- **7 · YouTube** — 1 YouTube avval tanishuv sayti bo'lib boshlangan — bu g'oya ishlamagan. · 2 Asoschilar odamlar saytga har xil video yuklayotganini payqagan. ·
  3 Sayt «hamma narsa uchun video» bo'lib o'zgargan.
  — Sinfga savol: Yozuvlaringizda odamlar siz kutmagan nima qilgan?
- **12 · Teng sanoqda** — 1 Muammo ikkala g'oyada teng chiqishi mumkin. · 2 Shunda doskadagi harakat belgisi qatoriga ham qarang. · 3 10 intervyu — kichik son: tanlov uchun dalil, isbot emas.
  — Sinfga savol: Sizning doskangizda qaysi qator ikki g'oyani ko'proq ajratdi?

## Jonli viktorina — 12 savol (✔ o'rni: A 2·7·11 · B 1·6·12 · C 3·5·10 · D 4·8·9 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Ikki g'oya intervyusida savollar nega bir xil bo'ladi? (1, 2)
   - Intervyu qisqaroq va tezroq o'tishi uchun (41)
   - ✔ Javoblarni yonma-yon sanay olish uchun (38)
   - Odamlar savollarni oldindan bilishi uchun (41)
   - Ikkinchi g'oyani tezroq unutish uchun (37)
2. Qaysi javob takrorlangan javob bo'ladi? (2)
   - ✔ To'rt yozuvda bir xil ma'noli javob (35)
   - Bitta yozuvda eng qattiq aytilgan javob (39)
   - Eng uzun yozuvdagi eng oxirgi javob (35)
   - Mentorga eng ko'p yoqqan bitta javob (36)
3. Odam «Chiqsa, ishlatib ko'raman» dedi. Bu nima? (5)
   - Harakat belgisi — kun belgilagan (32)
   - Takrorlangan javob — ko'pchilik degan (37)
   - ✔ Va'da — hali bo'lmagan ish haqida (33)
   - Muammo gapi — kim nimadan qiynaladi (35)
4. Mentor misolida nechta o'yinchi sinovga kun belgiladi? (4)
   - 5 tadan 1 tasi (14)
   - 5 tadan 2 tasi (14)
   - 5 tadan 3 tasi (14)
   - ✔ 5 tadan 4 tasi (14)
5. Mentor misolida ikki o'smirning to'garagini kim topadi? (4)
   - O'smirning o'zi (15)
   - Uning sinfdoshi (15)
   - ✔ Uning ota-onasi (15)
   - Uning murabbiyi (15)
6. Mentor misolida o'yinchilar hozir jamoani nima bilan yig'adi? (2)
   - Maydon egasi orqali (19)
   - ✔ Telegram guruhida (17)
   - Maktab e'lonlarida (18)
   - Maxsus ilova orqali (19)
7. Muammo gapida qaysi uch bo'lak bo'ladi? (8)
   - ✔ Kim, qachon va nimadan qiynaladi (32)
   - Kim, qayerda va qaysi ilova kerak (33)
   - Muammo, yechim va ilovaning nomi (32)
   - Tugma, rang va ilovaning narxi (30)
8. Final g'oya qaysi g'oya? (8)
   - Nomi eng chiroyli bo'lgan g'oya (31)
   - RICE bahosi eng katta bo'lgan g'oya (35)
   - Ro'yxatda birinchi yozilgan g'oya (33)
   - ✔ Intervyudan keyin tanlangan g'oya (33)
9. Final g'oya tanlangach, ikkinchi g'oya bilan nima qilinadi? (8, 10)
   - Ro'yxatdan butunlay o'chiriladi (31)
   - Final g'oyaga qo'shib yuboriladi (32)
   - Sinfdoshlardan biriga beriladi (30)
   - ✔ «Keyin» qutisiga yozib qo'yiladi (32)
10. 10 intervyudan keyingi tanlov haqida qaysi gap to'g'ri? (8)
    - G'oya endi isbotlandi, tekshirish shart emas (44)
    - Intervyu soni tanlovga hech ta'sir qilmaydi (43)
    - ✔ Tanlov uchun dalil bor, lekin isbot emas (40)
    - Sanoqdan ko'ra o'zimning fikrim muhimroq (40)
11. YouTube asoschilari nimani payqagan? (6)
    - ✔ Odamlar har xil video yuklayotganini (36)
    - Faqat tanishuv videolari qo'yilganini (37)
    - Sayt nomi odamlarga yoqmay qolganini (36)
    - Saytga video yuklash juda sekinligini (37)
12. Kodda `y.goya === goya` nimani tekshiradi? (11)
    - Yozuvda belgi bor-yo'qligini (28)
    - ✔ Yozuv shu g'oyaniki ekanini (27)
    - Yozuvlar soni nechtaligini (26)
    - G'oya nomining uzunligini (25)
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — yozuv · sanoq · takrorlangan javob · harakat belgisi · final g'oya · muammo gapi · «Keyin» · dalil ·
  uyga vazifa banneri — yozuv · sanoq · final g'oya · muammo gapi.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmFinalIdeaLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s9/s10 `QMustaqil` · s11 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`IkkiGoyaDoska`** — bitta vizual (180): chap `YozuvKarta` × N (ikki ustun; holatlar yopiq/ochiq/joriy/mos/mos emas; javob qatori `ustun` propidan), o'ng `SanoqDoska` (qatorlar `SANOQ_QATORLAR`,
   katakda nuqtalar + «n / N» + qisqa javob + ixtiyoriy kulrang ost-qator); ko'rinishlar `toliq` · `ixcham` · `oquvchi` · `qator`; savol-tugma qator o'rnida; nuqta bo'yalishi va son sanab o'sishi;
   `// qolip-maket:` e'loni; `zoom`; `reduced-motion` — o'tishsiz. Rangli yon chiziq yo'q.
3. **`MENTOR_YOZUVLAR`** — 10 × `{ n, goya: 'jamoa' | 'togarak', kim, oxirgi, qanday, qiyin, hozir, belgi: true | false, muammo: true | false, guruh: 'osmir' | 'ota-ona' | 'oyinchi' }` — tayanch 1.3 aynan
   (`muammo` — sanoq tekshiruvidan: 1, 2, 3, 5, 6, 7, 10). **`SANOQ_QATORLAR`** — 4 × `{ id, savol, nom, jamoa: { n, matn, yozuvlar }, togarak: { n, matn, yozuvlar, ost? } }`
   (A-bo'lim 7 dagi doska; to'garak «Muammo bo'lgan» `ost`: «2 tasi izlamagan: «onam biladi»»). Bitta manba: 0, 1, 2, 3, 4, 8, 11, 12.
4. s0: `QKirish` sof so'rovnoma — hammaga `correct: false`, maqtov yo'q (J-026); javob 116 belgi; maket — `IkkiGoyaDoska` yopiq + ikki g'oya kartasi (1-dars `GoyaKarta` ixcham ko'rinishi bo'lsa — o'sha;
   yo'q bo'lsa nom + «Kim uchun» qatori); tanlovdan keyin kartalar ochilishi (100 ms) va «? / 5».
5. s2: `QBashorat` (3 variant) → ixcham qator; 3 savol-tugma ketma-ket (`SANOQ_QATORLAR[0..2]`); javob kartaga yozilishi, mos yozuvlar ✓ (100 ms navbat), nuqta va son; `QIzoh` + `QTaxmin` + xulosa bitta natija blokida (SABOQ 25); 40 s ipucha; `tugadi`.
6. s4: `QBashorat` (1/3/5) · 2 qadam (`QQadamlar`): belgilar tushishi, 4-qator; «Kim qoldirdi?» — to'garak kartalari `guruh` bo'yicha surilishi, 7-yozuv yonishi, 1-qator `ost` ajralishi; ikki `QIzoh` (navbat bilan) + `QTaxmin` + xulosa.
7. s6: `YOUTUBE_BOSQICH` 3 × `{ h — bosqich nomi, m — Mentor gapi }` (SABOQ 8); `YouTubeSahna` (brauzer oynasi — profil-video kartasi va bo'sh joylar · har xil video kartalari kirishi · to'r va yorliq «hamma narsa uchun video»);
   nom «YouTube» qizil (`Brend` komponenti — o'quvchi yuzasidagi tashqi rang), logotip va o'ynatish tugmasi chizilmaydi; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); manba izohi faylda.
8. s8: 3 qadam (`QQadamlar`); `FinalKarta` (final joyi · uch bo'lak · «Keyin» qutisi · dalil-qator); 1-qadam — ballsiz tanlov + uchish animatsiyalari + `QTaxmin` + `QIzoh` (final g'oya ta'rifi);
   2-qadam — `MUAMMO_BOLAK` 3 × `{ nom, tanlov: [3], togri, xato: {…}, manba: [yozuv raqamlari] }`, `QXato`, Yordam birinchi xatodan keyin, nishon `problemBuilder` (birinchi urinish);
   3-qadam — `JamoaTelefon` mini (≈170×272; nom «Maydon Jamoa» harfma-harf, namuna e'lon `NAMUNA_OYINLAR[0]` — tayanch 9.2, «Qo'shilaman»), yorliq «chizma — hali qurilmagan»; xulosa — halol gap.
9. s9 artefakt: o'qiydi `localStorage` `pm-m9d3-intervyu` (`goyalar`, `yozuvlar[].goya`, `kim`, `oxirgi`, `qiyin`, `belgi`); kalit yo'q yoki bo'sh — son-tanlagichli rejim (g'oya nomlari qo'lda).
   Ketma-ket karta (bitta katta, ikkinchisi kutadi — SABOQ 29); son-tanlagichlar (N · n · m) qog'ozdan; kalitdagi darsdagi yozuvlar — eslatma kartalari (sanalmaydi; tayanch 9.44);
   Eng qiyini qatori + son-tanlagich; tekshiruvlar (9-ekrandagi, 5 + 5 va har xil N yorliqlari bilan); `QXato`; o'quvchi doskasi (`IkkiGoyaDoska` `oquvchi`); ✎; nishon `repeatFinder`; artefakt-strip «Doskam».
10. s10: 3 qadam (yakka — 2); sherik tanlovi (saqlanmaydi, faqat solishtirish chizig'i va Mentor statistikasi); g'oya kartalari uchishi; «Nega keyin?» qatori; yumshoq ogohlantirish (ikkala son kichik);
    muammo gapi uch qatori + yig'ilgan gap (PM-020 juftliklari); javob-qatorlari detektorlari (yechim so'zlari: ilova, sayt, bot, kerak · «hamma» · «qiynal» ildizi yo'q · < 3 so'z);
    yozadi `pm-m9d4-final` = `{ goya, muammoGapi, bolaklar: { kim, qachon, nima }, dalil: { a: { takror, belgi }, b: { takror, belgi } }, qiyin: { a: { matn, n }, b: { matn, n } }, yozuvlarSoni: { a, b }, keyin: { goya, sabab }, vaqtincha, savedAt }` (tayanch 8; 04-FILTR 23);
    `takror` = «Muammo bo'lgan» soni; nishon `finalIdea`; `optionalLive`; yakka rejim.
11. s11: `QKod` (VS Code naqshi, 9-Modul `m7-03` s11 kabi): darvoza `GATE_OPTS` (✔ 0) va ikki xato izohi; `sanoq.js` (`KD_CODE`, uz + ru izohlar; nusxalanmaydi — PM-082 d); terminal «Kutilgan natija» boshidan xira;
    «Bajardim» → natija to'liq rangda + doskaning ikki qatori kichik; nishon `countCoder`. Kod oynasi (`HtmlCompiler`) yo'q — `pm-m9d4-code` kaliti kerak emas.
    ⚠️ Starter matni ichida backtik yo'q (template-satr emas) — CSS/JSX tuzog'i (CLAUDE.md).
12. Testlar s3/s5/s7/s12 — `correctIdx` 3/1/2/0 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6).
    s3/s5/s12 karta — `QuestionScreen` `vizual`: savol ostida, faqat javob topilgach / natija ochilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. `ACHIEVEMENTS` 4 (`problemBuilder`, `repeatFinder`, `finalIdea`, `countCoder`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); `HW_TOKENS` — faqat so'z.
14. Uyga vazifa — yangi `HwCard` (dars yangi; PM-027 «tegilmaydi» bu yerga tegishli emas): yorliqlar «Kim bilan · Nechta · Muddat», 3 qadam, yakun ekranida aynan shular. Alohida `.homework.jsx` yo'q.
15. App.jsx: `m9-04` qatoriga `comp: PmFinalIdeaLesson` + import — asosiy seans (bu agent tegmaydi). Nom «O'n intervyudan keyin qaysi g'oya qoladi?» ✓ va osti ✓ (DE-205, App.jsx 375-qator).
16. `LESSON_META` `{ lessonId: 'pm-m9d4-v1', lessonTitle: "O'n intervyudan keyin qaysi g'oya qoladi?" }`, `SCREEN_INTENTS` — 16 ekran.
17. **REPO — yo'q** (PM darsi; `maydon-jamoa` 7-darsdan).
- Darvozalar: `npm run gates -- src/9-Modull/PmFinalIdeaLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10, 04-FILTR):** 1 → tayanch 1.3 (tuzatilgan) · 2 → qabul, ta'rif «bir xil ma'noda qaytgan javob» · 3 → qabul, tayanch 8 (+ `qiyin`, `vaqtincha`) · 4 → 9.44 (uy yozuvlari qog'ozda) ·
> 5 → qabul · 6 → tayanch 9.62 · 7 → qabul · 8 → qabul · 9, 10, 11 → qabul · 12 → «tanishlar orqali». Harakat belgisi — HB-q0 A (sinovga kun belgilash).
1. **Sanoq jadvalining «eng qiyini» qatori, to'garak katagi.** Tayanch 1.3: «2 / 5 — «onam biladi» (o'zi tanlamaydi)». Lekin yozuvlar jadvalida 8 va 9-yozuvning «Eng qiyini» katagi — «—»;
   «onam biladi» / «dadam topadi» — ularning «Oxirgi marta» va «Hozir nima bilan» katagida. 6, 7, 10 ning «Eng qiyini» javoblari esa bir ma'noda («qayerda va qachon ekani noma'lum» ·
   «jadvalni bilish uchun borib ko'rish kerak» · «vaqtini bilish uchun har biriga borish kerak bo'ldi») — 3 / 5. 2-ekranda doska yozuv kartalari yonida turadi: «Eng qiyini — onam biladi 2 / 5» desa,
   o'quvchi kartada «—» ni ko'radi (T-043). Shuning uchun darsda: «Eng qiyini» to'garak — **3 / 5 «qayerda va qachon — bilinmaydi»** (1.1 dagi muammo so'zi), «onam biladi» **2 / 5** —
   «Muammo bo'lgan» qatori ostida kulrang qator va 4-ekranda. Boshqa hamma son va yozuv matni — aynan. Tasdiq yoki tayanch jadvalini tuzatish kerak.
2. **«Takrorlangan javob» atamasi.** App.jsx osti — «takrorlangan javoblar va final g'oya»; reja shu bilan so'zma-so'z (P-015), shuning uchun atama shu. 9-Modul `m7-03` da «takror» ataylab
   ishlatilmagan (kartochka «Takrorlash» va «Qisqa takrorlash» bilan to'qnashuv, T-015). Bu darsda ta'rif bitta: «Bir necha yozuvda bir xil ma'noda qaytgan javob — takrorlangan javob.»; kartochka yorlig'i platformaniki.
   Alternativ — osti «bir xil javoblar sanog'i va final g'oya» (App.jsx — asosiy seans).
3. **`pm-m9d4-final` kaliti** — tayanch 8 dagi sxema saqlandi; `dalil.a.takror` = «Muammo bo'lgan» yozuvlar soni (tayanch «4 / 5 · 4 / 5» — muammo va belgi). 5-dars PRD «Qilmaymiz / keyin» va
   «Dalil» bo'limlari uchun taklif: `keyin: { goya, sabab }` (ikkinchi g'oya va «Nega keyin?» qatori) `bolaklar: { kim, qachon, nima }` (muammo gapining uch bo'lagi) va `qiyin: { a: { matn, n }, b: { matn, n } }` (doskaning «Eng qiyini» qatori). `yozuvlarSoni` — `{ a: N, b: N }` deb oldim
   (sxemada son yoki obyekt ekani aytilmagan).
4. **Uyda yig'ilgan yozuvlar qayerda.** 3-dars kaliti `pm-m9d3-intervyu` (`yozuvlar`) uyda ham to'ldiriladimi (3-dars sahifasini uyda ochib) — 3-dars MD hali yo'q. Men: 9-ekran kalitdan o'qiydi;
   yozuv kam yoki yo'q bo'lsa — son-tanlagich (qog'ozdagi yozuvlardan). 4-dars 3-dars kalitiga yozmaydi. 3-dars MD bilan kelishish kerak.
5. **«Muammo bo'lgan» belgisi** yozuv sxemasida yo'q (`{ goya, kim, oxirgi, qanday, qiyin, hozir, belgi }`) — 9-ekranda o'quvchi o'zi belgilaydi, faqat soni saqlanadi. Mentor yozuvlarida (`MENTOR_YOZUVLAR.muammo`) —
   tayanchning sanoq tekshiruvidan (1, 2, 3, 5 · 6, 7, 10).
6. **«Maydon Jamoa» nomining rangi** — tayanchda yo'q (TAQIQLAR 0: «o'z rangida»). Nom shu darsda tug'iladi — rang ham shu yerda belgilanadi; 7, 9-darslar telefon maketi shu rang bilan.
   Taklif: bitta yashil (maydon rangi), PM palitrasining `ok` yashilidan farqli. Tasdiq kerak.
7. **YouTube «tanishuv sayti»** — bank «video-tanishuv sayti»; 13 yoshli auditoriya uchun neytral: «odamlar o'zi haqida video qo'yib, tanishishi kerak edi». Mavzu kengaytirilmaydi. Tasdiq kerak.
8. **Muammo gapining uch bo'lagi** — Kim «O'yinchilar» · Qachon «o'yindan oldin» · Nimadan qiynaladi «jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi» (9-Modul qolipi;
   tayanch 1 gapi so'zma-so'z yig'iladi). 5-dars PRD «Muammo» bo'limi shu gap bilan.
9. **O'quvchi doskasida «Hozir nima bilan» qatori yo'q** (uch qator) — mustaqil ishni yengil saqlash uchun (PM-008: ≤3–4 element). 5-dars PRD da «hozirgi yo'l» kerak bo'lsa — qo'shiladi.
10. **Kod soddalashtirishi** — `sanoq.js` da yozuv `{ goya, muammo, belgi }` (matn qatorlari yo'q): sanoq uchun kerakli uch maydon. `goya` qiymatlari "jamoa", "to'garak" (g'oya nomi qisqa).
11. **Nom tug'ilgan telefondagi e'lon** — tayanch 9.2 namuna o'yini «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (1-darsdagi «Bugun · 18:00 · 8 / 10» emas) — 7, 9, 13-darslar bilan bir.
12. **To'garak «Hozir nima bilan» yorlig'i** «ota-onasi tanishlardan so'ragan» (tayanch) — 7 va 10-yozuvda intervyu bergan odamning o'zi ota-ona; doska yorlig'ini «tanishlar orqali» qilish mumkin. Hozir — tayanchdagidek.

## Shubhali joylar (ishonchim komil emas)
- **TAYANCHGA SAVOL 1** — doskadagi to'garak «Eng qiyini» 3 / 5 tayanch jadvalidagi 2 / 5 dan farq qiladi (yozuvlar bilan mos, jadval bilan emas).
- 0-ekran: «Qaysi muammo ko'proq odamda borligiga» varianti darsning yo'nalishiga yaqin — sof so'rovnoma bo'lsa ham bitta variant «to'g'ri» ko'rinishi mumkin (9-Modul `m7-03` hookidagi kabi).
- 2-ekran: «bir ma'noli javoblar bir rangda yonadi» — 1, 3, 5 («yo'qoldi», «boshqa xabarlar ostida qoldi», «yo'qoldi, kim kelishini bilmadi») va 6, 7, 10 so'zma-so'z bir emas; bir ma'noga yig'ish — tahlil, o'quvchi bahslashishi mumkin.
- 4-ekran: «harakat belgisi» ta'rifi tayanch 2 dan olindi — 3-dars MD dagi so'zma-so'z ta'rif bilan solishtirish kerak (T-042).
- 6-ekran: «shu ishlagan» — bankning ruscha matnida ham «ishladi» ma'nosidagi fe'l; «ishlagan» bu yerda «natija bergan» ma'nosida (korpus §42: texnik fe'l odam uchun emas — bu yerda sayt haqida).
- 6-ekran: «Video qo'yiladigan va ko'riladigan sayt», «O'zim haqimda» yorlig'i, profil-video va har xil video kartalari — bankda so'zma-so'z yo'q: brend izohi va sahna chizmasi (S-018, P-053).
- 8-ekran 1-qadam: o'quvchi to'garakni tanlasa — «Taxminingiz: … · Mentor tanlovi: jamoa yig'ish»; ball yo'q, lekin tanlov Mentor qarori bilan solishtiriladi.
- 8-ekran 2-qadam: «o'yindan oldin» — 1, 3, 5-yozuvlardan xulosa (guruhga yozish o'yindan oldin); yozuvlarda «o'yindan oldin» so'zi yo'q.
- 10-ekran: «qiynal» ildizi tekshiruvi — o'quvchi «qiyin bo'ladi» deb yozsa ham to'g'ri gap bo'lishi mumkin; javob-qatori bloklamaydi.
- 10-ekran: sherikning tanlovini o'quvchi o'zi belgilaydi — halol tugma, tekshirib bo'lmaydi.
- 11-ekran: `true`/`false` va obyekt maydoni (`y.goya`) — JS darslarida o'tilgan deb oldim (2-Modul shart va massiv darslari, 9-Modul `m7-03` kodi).
- Arena 5: variantlar «O'smirning o'zi · Uning sinfdoshi · Uning ota-onasi · Uning murabbiyi» — uzunlik teng bo'lishi uchun «Uning» (o'smirga ishora); «murabbiy» — to'garak olamidan distraktor.
- 5-ekran: to'g'ri variant (39) bilan A, C (41) farqi ikki belgi — to'g'ri javob eng uzun emas, lekin to'rttasi deyarli teng.
- ~~Uyga vazifa ③: raqamlarni saqlash~~ — **yopildi (HB-q0 A, 04-FILTR 10):** telefon raqami umuman so'ralmaydi; ③ — sinovga kun belgilaganlarni qog'ozda belgilash.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 374–376 — `m9-03` «Ikki g'oyadan qaysi biri odamlarga kerak?» → **`m9-04` «O'n intervyudan keyin qaysi g'oya qoladi?»**
  (osti «takrorlangan javoblar va final g'oya» — reja chap qatori so'zma-so'z) → `m9-05` «G'oyangiz bir sahifaga sig'adimi?» (yakun qatori).
- [x] Bitta misol-ip: Mentorning 10 yozuvi (tayanch 1.3 aynan, yozuv matni o'zgarmagan), «Maydon Jamoa» nomi — 8-ekranda, final g'oya tanlangach (9.23); metafora yo'q; bitta vizual — `IkkiGoyaDoska`
  (to'liq · ixcham · o'quvchiniki · qator). Ikkinchi misol faqat testda (5, 12). YouTube — keys sahnasi (PM-028/029). Telefon maketi — faqat nom tug'ilishi uchun (TAQIQLAR 0).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 8 (QTushuncha) + 0, 6, 9, 10, 11; testlarda javobdan keyingi qator. «bosish → matn-karta» yo'q — har bosish yozuv kartasi, doska yoki telefonni o'zgartiradi.
- [x] O'lchov (skript bilan sanaldi, `scratchpad/md04/olchov.py`): sarlavha 25–48, bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa 60–96 · hook javobi 116 ·
  xato izohi 20–60 · `QIzoh` 61–97. 122 ta o'lchangan matn — yozilgan son haqiqiy uzunlik bilan bir xil (`scratchpad/md04/tuzat.py`).
- [x] Atamalar: intervyu, yozuv (9-Modul `m7-02`), sanoq, doska, muammo gapi (`m7-03`), va'da (`m7-02`), harakat belgisi (tayanch 2), saralash (2-dars), «Keyin» qutisi (9.22) — so'zma-so'z;
  yangi «takrorlangan javob» va «final g'oya» misoldan keyin; «jamoa», «maydon», «belgi» — bir ma'noda; siz-forma, tugmalar ot-shaklda («Saqlash», «Nom berish», «Davom etish»).
- [x] Testlar: 4 variant, uzunlik teng (s3 37/37/39/38 · s5 41/39/41/39 · s7 37/39/39/42 · s12 42/40/44/43 — farq ≤15%); to'g'ri javob hech qayerda yolg'iz eng uzun emas;
  kalit so'z faqat to'g'rida emas (s3 «g'oya» uchtasida · s5 «chiqsa», «ishlat-» ikkitadan · s7 «odamlar», «video» ikkitadan · s12 «g'oya», «odam» ikkitadan). Arena 12 — farq ≤15%, ✔ A3 B3 C3 D3.
  Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%», «albatta» — o'quvchi matnida 0; «mumkin», «bu misolda», «Mentor misolida» bilan chegaralangan;
  «isbotlandi» — faqat noto'g'ri variantda va halol gapda inkor bilan).
- [x] Ichki kodlar yo'q (o'quvchi matnida F-kod, `m9-NN`, «Modul 11», «pattern» yo'q; modul raqami LMS raqamida — «9-Modul»). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 17 band.
- [x] Karta T · P · S · PM: T-008 (yozuvlar va test qo'shtirnoqlari — olam ichidagi gap) · T-011/PM-030 («takrorlangan javob», «final g'oya» misoldan keyin, sarlavhada yo'q) · T-014/T-015 (bir so'z — bir ma'no; «Kim bilan» yorlig'i) ·
  T-016 (metafora yo'q) · T-039 («doskangiz», «final g'oyangiz» — yaratilgandan keyin) · T-042 (ta'riflar so'zma-so'z: 2/14/15; 8/14; halol gap 8/12-recap/14) · T-043 («bu misolda»; doskadagi son kartadagi yozuv bilan bir —
  TAYANCHGA SAVOL 1) · T-047/T-048 (Mentor ekrandagini aytmaydi; asosiy fikr yakunda bir marta) · T-052 (o'tilgan atamalar o'z ta'rifi bilan) · T-064 (8-ekran sarlavhasi 0-ekran savoliga javob) ·
  P-001 (bitta ip) · P-002 (ikkinchi olam faqat testda) · P-008 (bir ekran — bir ish; 8 va 10 — ketma-ket qadamlar) · P-013 · P-015 (reja ta'rif aytmaydi, osti so'zma-so'z) · P-016 (hook payoffi hech bir variantni yolg'onga chiqarmaydi) ·
  P-025 (uyga vazifa karta) · P-033 (yordam xatodan keyin) · P-036 (0-ekranda yozuvlar yopiq, sanoq yo'q) · P-046 (9, 10-ekran xulosa va solishtirish o'quvchi ma'lumotidan) · P-053 (keys sahnasi bosqichma-bosqich, `pre` kadr) ·
  P-055 (8, 9, 10 — qadam chiplari, joriy karta) · P-057 (10-ekran solishtirish chizig'i) · P-062 (8-ekranda dalil-qator doska yo'qolgandan keyin) · P-064 (bashorat 2, 4, 6) · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 (bitta himoyalanadigan javob; distraktor dars qoidasi bo'yicha noto'g'ri) · S-006 · S-008 (10-ekranda o'quvchi tanlovi jazolanmaydi) · S-010 · S-015 (bashoratlar tor → keng / o'sish tartibida) ·
  S-018 (YouTube izohi) · S-020 (ballik matnda atama o'z ta'rifi bilan o'tilgan: harakat belgisi — 4, takrorlangan javob — 2, va'da — 9-Modul) · S-026 (recap raqam) · S-027 · S-040 (8-ekran har qator tuzoqlari bitta xato-sinf) ·
  PM-005 (2-tur) · PM-017 (namuna — bitta olam, rost) · PM-018 (YouTube — faqat bankdagi qaror) · PM-020 (10-ekran yig'ilgan gap juftliklari) · PM-082 (kod ekrani darvozasi, nusxa yo'q) · J-026 (hook) · SABOQ 1–31 (A-bo'limda va har ekranda).
