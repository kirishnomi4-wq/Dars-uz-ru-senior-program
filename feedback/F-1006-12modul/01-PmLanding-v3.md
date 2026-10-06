# 12-Modul · 1-dars (PM) «Mahsulotingizni bir sahifada qanday tanishtirasiz?» — MD v3

Fayl: `src/10-Modull/PmLandingLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-01` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, yozilgani ixcham qatorga uchadi) · mahsulot nomi «Maydon Jamoa» o'z rangida, telefon maketida; lending — brauzer maketida ·
ekranga kirganda bo'sh, ma'nosiz element yo'q · ekranda ≤ 3 blok · maket chapda, karta o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 8-ekran — **A** (`0`) · 12-ekran — **C** (`2`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 391–398, DE-205): `m9-17` «Demo Day 7» (`comp` siz) → **`m10-01` «Mahsulotingizni bir sahifada qanday tanishtirasiz?»** (osti: «lending: sarlavha, foyda va bitta tugma») → `m10-02` «WebSocket: ekran o'zi yangilanadigan ulanish».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (sahifa matni), mustaqil ish majburiy (9-ekran). Keys — **K3 Instagram** (tayanch 5, faqat bank matni). Repo — o'quvchining o'z final repo'si, yangi `lending/` papkasi (11-ekran); Mentor misoli `maydon-jamoa`, teg `m12-dars-01-done`.
Kod mexanikasi (tayanch 4): amaliy topshiriq o'quvchining o'z kompyuterida — agent asbobi Antigravity (tayanch 9.14; o'quvchi matnida «VS Code» yo'q) + Netlify. Kod oynasi yo'q; 3-dars — bloklar, mexanika takrorlanmaydi.
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushuncha, keys va testlar (2–8) ≈ 24 · sahifa matni ≈ 13 · besh soniyalik sinov ≈ 7 · `lending/` va Netlify ≈ 30 · yakuniy savol, podium, kartochkalar, arena ≈ 11 (01-FILTR 11: blok 22 → 30, Umami — uyga vazifa ②).
  Ulgurmagan o'quvchi yo'li: 9-ekranda matn to'lmasa — jonli darsda Mentor o'tkazadi, qolgani uyda · 11-ekranda Netlify'ga ulgurilmasa — push qilinadi, Netlify va tekshiruv — uyga vazifa ① · yakun sarlavhasi holatga qarab (15-ekran).
Manba: `00-MODUL-TAYANCH.md` (1.0 — boshlanish nuqtasi, muammo va yechim gapi · **1.1 — lending aynan** · 2 — atamalar · 3 — repo, teg 01 · 4 — tuzilish · 5 — K3 · 6 — Umami · 7 — sinflar · 8 — `pm-m10d1-lending`) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 3, 17, 18, 22) · `00-TAQIQLAR.md` · `00-NOMLAR.md` · 11-Modul tayanchi (1, 1.4 PRD matni, 2, 9.2 namuna o'yin, 9.27 ritm) · 11-Modul `05-PmPrd-v3.md` (Mentor PRD si — 2-ekran kartasi).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «11-Modul» (kod `9-Modull`), «9-Modul» (kod `7-Modull`: Umami, Netlify), «2-Modul» (kod `1-Modull`: CTA, Netlify akkaunti). Kod raqami faqat fayl yo'lida.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (tayanch 4: «lending matni yozilgan, sherik bilan sinalgan, internetga chiqqan»):** o'quvchi o'z mahsuloti uchun sahifa matnini yozadi (sarlavha · sarlavha osti · uch foyda · tugma yozuvi),
   uni sherik bilan besh soniyalik sinovdan o'tkazadi, agent `lending/` papkasida sahifani yig'adi va sahifa Netlify'ga chiqadi. Saqlanadi: `pm-m10d1-lending` (6, 7-darslar o'qiydi).
   Natija to'rt holatda bo'lishi mumkin (15-ekran sarlavhasi shunga qarab): internetda · yig'ildi, lekin internetga chiqmadi · matn tayyor, yig'ilmadi · matn to'lmadi. Belgi va nishon — faqat birinchi holatda (sinf 1).
   Bugun kanal tanlanmaydi va havola hech qayerga yuborilmaydi — bu boshqa darsning ishi (dars ichida va'da qilinmaydi, T-038).
2. **Bugungi asosiy fikr (P-013):** Lending funksiyani sanamaydi: kim uchun va nima foyda ekanini aytib, bitta harakatga chaqiradi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042; tayanch 2 aynan):**
   - **lending** — «Mahsulotni bitta sahifada tanishtiradigan sayt — lending deyiladi.» (2-ekran, Mentor sahifasi sarlavhasi va sarlavha osti yozilgandan so'ng tug'iladi.) Sarlavhada yo'q (T-011): 0–2-ekran sarlavhalarida «sahifa».
     **Kurs qolipi (sinf 2a — «Bizda» bilan):** «Bizda lending uch bo'lakdan iborat: sarlavha, uchta foyda va bitta asosiy tugma.» (6-ekran xulosasi oldidan, 14-ekran kartochkasi, 15-ekran).
   - **sarlavha** — sahifaning birinchi qatori; **«Bizda sarlavha ikki savolga javob beradi: kim uchun va nima foyda.»** (2-ekran xulosasi). **sarlavha osti** — sarlavha ostidagi bir qatorlik izoh: bu qanday bo'ladi (2-Modul «birinchi blok — katta sarlavha va bir qatorlik izoh» bilan bir — O'qituvchi eslatmasida).
   - **foyda** — «Funksiya odamga nima berishi — foyda deyiladi.» (4-ekran, birinchi juftlikdan keyin); juftligi — **funksiya** (mahsulot nima qilishi; 11-Modul PRD «Uchta asosiy funksiya» so'zi).
   - **asosiy tugma** — «Sahifadagi odamni bitta harakatga chaqiradigan tugma — asosiy tugma.» (6-ekran, tugma bosilgandan so'ng). Ko'prik bir marta, o'sha joyda: «2-Modulda buni CTA deb atagansiz.» (tayanch 2; 2-Modul `m1-05`: «Harakat tugmasi … Uni CTA ham deyishadi»). CTA — boshqa joyda yo'q.
   - **sahifa matni** — «lendingdagi sarlavha, foydalar va tugma yozuvi» (9-ekran eyebrow va Mentor gapida; «kopirayting», «kontent» yo'q).
   - **besh soniyalik sinov** — «Sherik sahifani 5 soniya ko'rib, nima va kim uchun ekanini aytdi — besh soniyalik sinov shu.» (10-ekran, solishtirishdan so'ng). «5 soniya — shu mashqning qoidasi» (kulrang qator; umumiy mezon emas — tayanch 1.1).
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **muammo gapi** (11-Modul, so'zma-so'z: «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.») · **yechim** (PRD 4-bo'limi: «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.») ·
     **kim uchun** (PRD 3-bo'limi, 11-Modul 5-dars MD matni: «Mahalladagi mini-futbol o'yinchilari: tashkilotchi — o'yinni e'lon qiladi, o'yinchi — o'yinga qo'shiladi.») · **asosiy funksiya** (PRD 5-bo'limi: O'yin e'loni va qo'shilish · O'yin kuni tasdiq · Chiqish va navbat).
   - **talab** (agentga: qayerda · nima qilsin · nima buzilmasin) · **agent** · **repo** · **push** (faqat `git push`) · **adaptiv** (11-Modul 9-dars: «telefon kengligiga moslashadigan sayt») · **trek** (web-trek, mobil trek — `pm-m9d8-platforma`).
   - **Umami** (9-Modul: saytda odamlar nima qilganini yozib boradigan xizmat) · **hodisa** — bu darsda **faqat** 9–10-Modul ma'nosida: analitikaga yoziladigan bitta harakat (`qoshilmoqchiman`); ulanish hodisasi bu darsda yo'q (T-015, tayanch 2).
   - **Netlify** (2-Modul «Netlify va deploy»; 9-Modul: sayt GitHub'dan — push qilinsa odatda o'zi yangilanadi) · **tekshirish** (o'z ishini ko'rish) va **sinov** (faqat real odam bilan — sherik).
   - **roadmap · keyinroq** (11-Modul 6-dars: «o'yindan oldin eslatma», «ro'yxat o'zi yangilanadi» — keyinroq ufqida; 4-ekranda «roadmap: keyinroq» yorlig'i).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«sahifa»** — faqat lending sahifasi; dars ekrani «sahifa» yoki «ekran» deb atalmaydi (T-064). **«bo'lak»** — lendingning uch bo'lagi (sarlavha · foyda · tugma); **«bo'lim»** — faqat sahifadagi «Qanday qo'shilaman» bo'limi.
   - **«foyda»** — faqat atama ma'nosida; «qulaylik», «afzallik» yo'q. **«tugma»** / **«asosiy tugma»** — sahifadagi tugma; dars tugmalari («Davom etish») matnda tilga olinmaydi.
   - **«e'lon»** — faqat o'yin e'loni («O'yinni e'lon qiling»). **«xabar»**, **«post»**, **«kanal»** — bu darsda yo'q (6-dars so'zlari).
   - **«qadam»**, **«bosqich»** — o'quvchi matnida yo'q (12-Modulda «qadam» — foydalanuvchi yo'li, «bosqich» — 7-dars rejasi; tayanch 2). Blok qadamlari o'quvchiga raqam va nom bilan («1 · Ochish»), keys tugmasi «Voqea davomi».
   - **«eslatma»** — faqat «o'yindan oldin eslatma» funksiyasining nomi (11-Modul roadmap so'zi); ta'rifi 4-darsda, bu darsda ochilmaydi. **«ro'yxat»** — faqat telefondagi o'yinlar ro'yxati.
   - **«mashq»** — yakka rejimdagi besh soniyalik ko'rish (`tur: 'mashq'`); **«sinov»** — sherik bilan (`tur: 'sherik'`; 01-FILTR 6 — «real» 11-Modulda auditoriya ma'nosida band). **«nom»** — mahsulot nomi («Maydon Jamoa»), sarlavha emas.
   - **Ishlatilmaydi:** landing · landing page · bir sahifalik · CTA (ko'prikdan boshqa joyda) · kopirayting · kontent · chaqiriq tugmasi · 5 sekund test · deploy (o'quvchi matnida — «internetga chiqarish») · «Modul 12» · pilot · keys · A1.
6. **Mentor misoli — «Maydon Jamoa» lendingi (`MENTOR_LENDING`, tayanch 1.1 aynan; nom — mahsulot nomi, sarlavha emas):**

| Bo'lak | Matn (o'quvchi ko'radi) |
|---|---|
| Nom (sahifa tepasida, kichik, o'z rangida) | Maydon Jamoa |
| Sarlavha | Mahalla futboliga jamoani bir joyda yig'ing |
| Sarlavha osti | O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi. |
| Asosiy tugma | Qo'shilmoqchiman |
| Telefon maketi | «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» |
| Uch foyda (foyda — katta yozuv, funksiya — ostidagi bir qator; tayanch 9.2) | 1) «Bir bosishda jamoadasiz» — ostida «Har o'yin alohida kartada: «Qo'shilaman» ni bosasiz.» · 2) «Nechta odam yig'ilganini so'rab o'tirmaysiz» — ostida «Kartada ko'rinadi: 8 / 10.» · 3) «Kim aniq kelishini o'yindan oldin bilasiz» — ostida «O'yin kuni har kim «Kelaman» ni bosadi.» |
| «Qanday qo'shilaman» bo'limi | Hozircha o'rnatish havolasi yo'q. |

   - Sahifadagi tartib (tepadan): nom · sarlavha · sarlavha osti · asosiy tugma · telefon maketi va yonida uch foyda · «Qanday qo'shilaman» bo'limi (TAYANCHGA SAVOL 2 — tartib tayanchda yo'q).
   - **Funksiyadan foydaga — Mentor juftliklari (4-ekran mashqi, aynan):** «Qo'shilaman» tugmasi → «bir bosishda jamoadasiz» · «8 / 10» soni → «nechta odam yig'ilganini so'rab o'tirmaysiz» · «Kelaman» belgisi → «kim aniq kelishini o'yindan oldin bilasiz».
     Sahifadagi uch foyda — shu juftliklarning o'zi (tayanch 9.2): foyda bosh harf bilan katta yozuv, uning ostida funksiya qatori. Strelka o'quvchi matnida yo'q (T-035) — juftlik orasida ingichka chiziq.
   - **Halollik qoidasi (tayanch 1.1):** sahifaga faqat hozir ishlaydigan narsa yoziladi; «eslatma keladi», «ro'yxat o'zi yangilanadi» 1-darsda yozilmaydi (4-ekran 4-kartasi, 12-ekran testi).
   - **O'lchov (tayanch 1.1, 6):** sahifa ochilishi — Umami avtomatik; tugma bosilishi — hodisa `qoshilmoqchiman` (`data-umami-event`; hodisa nomi 50 belgigacha). Umami — faqat lendingda. Shaxsiy ma'lumot yig'ilmaydi: forma yo'q. **Umami ulanishi — uyga vazifa ②** (darsda vaqt — 01-FILTR 11): darsda hodisa nomi tugma yozuvidan bir marta yasaladi va saqlanadi (`pm-m10d1-lending.hodisa`, tahrirlanmaydi — 01-FILTR 4); 6, 7, 10-darslar shu nomni o'qiydi.
   - **Web-trek:** lending — mahsulot saytidan alohida sahifa (`lending/`); asosiy tugma darhol saytga olib boradi; «Qanday qo'shilaman» bo'limi yo'q.
7. **Raqamlar (faqat tayanchdan):** namuna o'yin «8 / 10» (9.2 namuna o'yinlar) · K3: 2010-yil oktabr, birinchi kuni 25 000 ro'yxatdan o'tish (bank; o'quvchiga maqsad emas — 7-ekranda kulrang qator) · «5 soniya» — mashq qoidasi. Boshqa son yo'q.
8. **Keys — K3 Instagram (tayanch 5, bank matni aynan):** «Avval Burbn ilovasi bo'lgan: belgilash (qayerdaligini), rejalar, rasm — ko'p funksiya, hech kim ishlatmagan. Asoschilar odamlarga yoqqanidan boshqa hammasini olib tashlagan: rasm, filtr va izohlar.
   Instagram shunday tug'ilgan. 2010-yil oktabr — birinchi kuni 25 000 ro'yxatdan o'tish.» Brend izohlari (S-018): «Instagram — rasm va video ulashiladigan ilova» · «Burbn — Instagram asoschilarining birinchi ilovasi».
   Ko'prik (umumiy joy, tenglik emas; 01-FILTR 2): bu voqeada hamma funksiya oldinga chiqarilmagan — lendingda ham hamma funksiya sanalmaydi: muhim foydalar va bitta asosiy tugma. Bankdan tashqari fakt (asoschilar ismi, keyingi sonlar, sabablar) yo'q. 9-Modul 3-darsida Burbn boshqa ko'prik bilan bo'lgan (O'qituvchi eslatmasida).
9. **Ikkinchi misol faqat testda (P-002), o'quvchi tanigan olamdan — Mentorning 11-Moduldagi boshqa g'oyalari:** sinf uy vazifalari (3-ekran: «uy vazifasi chatlarda yo'qoladi · sinfdoshlar · har fan bo'yicha vazifalar bir joyda») ·
   mahalla to'garaklari (5-ekran: «to'garaklar xaritasi va jadvali»). Arena: kutubxona sayti (3-savol) — o'smir olami, bitta gap.
10. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q («har doim», «darhol», «100%»); tashqi qadamlarda «odatda», «bo'lishi kerak — tekshiring».
11. **Xavfsizlik (sinf 14, TAQIQLAR 2):** lendingda forma yo'q — ism, telefon, email so'ralmaydi (6-ekran, 11-ekran «Nima buzilmasin», kartochka); sahifa matnida telefon raqami va akkaunt nomi tekshiruvi (9-ekran); sinov javobida sherik ismi yozilmaydi (10-ekran);
    havola bugun guruhlarga yuborilmaydi — uyda sahifa o'z telefonida tanish odamlarga ko'rsatiladi (15-ekran); maketda namuna ma'lumot, haqiqiy odamlar emas (11-ekran).
12. **Trek (tayanch 4):** `pm-m9d8-platforma.trek` — 6-ekran (web-trek chipi), 11-ekran (talabning «tugma ochadigan joy» qatori va «Yordam» gapi). Kalit yo'q bo'lsa — 11-ekran «Ochish»da tanlanadi va shu kalitga yoziladi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0):** 11-Modul oxirida «Maydon Jamoa» ishlaydi (teg `m11-dars-15-done`): o'yin e'loni, qo'shilish, tasdiq, chiqish va navbat; 3 sinovchi. 12-Modulda ilova jonlanadi va 50 foydalanuvchiga chiqadi — birinchi ish: mahsulotni bir sahifada tanishtirish.
- **Dars ipi:** 0 — mahsulotni ko'rmagan odam sahifani ochdi: unga nima yetishmaydi → 2 — Mentor sarlavhasi 11-Moduldagi PRD so'zlaridan yoziladi: kim uchun, nima foyda, qanday qilib (atama «lending») → 3 — test: sarlavhada kim uchun va foyda →
  4 — telefondagi uch funksiya foydaga aylanadi, hali yo'q eslatma sahifaga yozilmaydi (atama «foyda») → 5 — test: funksiya va foyda → 6 — «Qo'shilmoqchiman» bosiladi: sahifadagi bo'lim ochiladi, Umami sanaydi (atama «asosiy tugma», CTA ko'prigi) →
  7 — Instagram: ko'p funksiyadan yoqqani qoldi; lendingda ham hamma funksiya sanalmaydi → 8 — test → 9 — o'quvchi o'z sahifa matnini yozadi → 10 — sherik 5 soniya ko'radi, uch savol (atama «besh soniyalik sinov») →
  11 — agent `lending/` ni yig'adi, sahifa Netlify'ga chiqadi → 12 — yakuniy test: hali yo'q funksiya → podium → kartochkalar → yakun; uyda — sahifani ko'rmagan ikki kishi bilan sinov.
- **Bitta vizual — lending sahifasi brauzer maketida (`LendingSahifa`, dars bo'yi, 163/180; bitta manba `MENTOR_LENDING` + o'quvchi matni `pm-m10d1-lending`):**
  - Brauzer oynasi (nuqtalar, manzil qatori `maydon-jamoa-….netlify.app`, qulf belgisi — manzil namuna); ichida sahifa: tepa-chapda kichik nom (o'z rangida) · sarlavha (eng katta yozuv) · sarlavha osti · asosiy tugma ·
    telefon maketi (`JamoaTelefon`, ≈170×272 — 11-Modul ko'rinishi: «O'yinlar» ekrani, namuna o'yin; 4-ekranda «O'yin» ekrani) va yonida uch foyda qatori · pastda «Qanday qo'shilaman» bo'limi (sahifa surilganda ko'rinadi).
  - **Holatlar (bitta komponentdan):** **qoralama** (0, 2-ekranlar: sarlavha o'rnida faqat nom, qolgan joylar kulrang uzuq chiziq — U-041) → **to'lib boradi** (2, 4-ekranlar: bo'lak sirg'alib yoziladi, ~1 s yashil) → **to'liq** (6, 7-ekranlar) →
    **ixcham** («Sahifam · n / 4», 9–11-ekranlar va artefakt-strip) → **parda** (10-ekran: 5 soniya ochiq, keyin yopiq) → **o'quvchi sahifasi** (9–11-ekranlarda o'quvchining matni bilan; nom — `pm-m9d4-final.goya`, yo'q bo'lsa kulrang «mahsulot nomi»).
  - Bo'lak holatlari: bo'sh (uzuq chiziq) → joriy (accent chegara) → yozildi (matn sirg'alib kiradi, ~1 s yashil) → xato (`err` fon, bir lahza) → sinovda (parda).
  - `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi. Vizual ⛶ ichida (q17).
- **Brend o'z maketida (PM-028/029, S-018, SABOQ 2–3):** «Maydon Jamoa» — telefon maketida va sahifa tepasida, o'z rangida; «Instagram» — telefon maketida o'z rangida (7-ekran 3/3); «Burbn» — telefon maketida neytral to'q rangda (rangi bankda yo'q — Shubhali joylar). Logotip chizilmaydi.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, yengil to'lqin 2–3 marta; tanlov guruhida har variantda yumshoq halqa; yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (SABOQ 11, 25):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (PRD so'zi sarlavhaga, foyda kartadan sahifaga) · yangi qator sirg'alib kirib ~1 s yashil yonadi · hisoblagich sanab o'sadi · sahifa «surilib» bo'limga tushadi.
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Mahsulotingizni bir sahifada qanday tanishtirasiz?** (50) — dars nomi (DE-205)
- Mentor: Mahsulotni hali ko'rmagan odam shu sahifani ochdi: sizningcha, unga birinchi nima yetishmaydi?
- Maket (chap): brauzer oynasi — manzil qatori `maydon-jamoa-….netlify.app`; sahifada katta yozuv o'rnida faqat nom **Maydon Jamoa** (o'z rangida), ostida telefon maketi («O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10») va matnsiz tugma-skelet;
  sahifa oldida odam silueti, pufagida «?». Sarlavha joyi — kulrang uzuq qator (bo'sh). «Qo'shilmoqchiman» yozuvi yo'q (6-ekran kashfiyoti).
- Variantlar (radio, o'ng; bir uzunlikda):
  - Chiroyli rasm va yorqin ranglar (31)
  - Kim uchun va nima foyda ekani (29)
  - Hamma funksiyalarning ro'yxati (30)
- Javob — «Kim uchun…»: **Aynan!** Sahifada hozir nom va telefon bor — bu kim uchun va nima foyda berishi yozilmagan. (89)
- Javob — «Chiroyli rasm»: **Qiziq fikr!** Rasm sahifani bezaydi, lekin undan bu kim uchun va nima foyda berishi bilinmaydi. (93)
- Javob — «Hamma funksiyalar»: **Qiziq fikr!** Funksiyalar ham yoziladi, lekin sahifada avval bu kim uchun ekani aytilishi kerak. (94)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant ixcham qator bo'lib qoladi; sahifadagi bo'sh sarlavha qatori accent halqa bilan yonadi (matn yozilmaydi — 2-ekran kashfiyoti, P-036); siluet pufagidagi «?» qoladi.
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni). Uchala javob ekrandagi dalilni ko'rsatadi (T-067): nom va telefon bor, sarlavha qatori bo'sh.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan so'ng «Davom etish».
- O'qituvchi eslatmasi: Sahifa — Mentor lendingining qoralamasi (faqat nom va telefon); to'liq matn 2–6-ekranlarda yoziladi. Sinfdan so'rang: 11-Modulda ilovangizni kimlar ko'rdi? (odatda 3 sinovchi va sinf). Javobni muhokama qilmang — 2-ekran sahifani o'zi to'ldiradi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingizni tanishtiradigan sahifa yozasiz.** (53)
- Mentor: 11-Modulda mahsulotingizni qurdingiz va sinadingiz. Bugungi matnni o'zingiz yozasiz, kodini esa agent yig'adi.
- Chap — «Dars oxirida: sarlavha, foyda va bitta tugma» + kulrang yorliq `lending` (App.jsx osti «lending: sarlavha, foyda va bitta tugma» — so'zlari aynan, atama kulrang yorliqda, P-015) + vizual: brauzer maketi-skelet —
  kulrang qatorlar 0.4 s oraliqda yoziladi (matnsiz): tepada kichik qator, katta qator, ingichka qator, tugma-skelet, telefon-skelet yonida uch qisqa qator; oxirida manzil qatorida qulf belgisi va `….netlify.app`.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Sahifaning birinchi qatorini yozishni bilib olasiz · `sarlavha`
  - 02 · Funksiyani odamga beradigan foydaga aylantirasiz · `foyda`
  - 03 · Instagram nimadan boshlanganini ko'rasiz · `voqea`
  - 04 · Sahifani sherigingiz bilan sinab, internetga chiqarasiz · `sinov`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «lending» faqat kulrang yorliqda, atama 2-ekranda tug'iladi (P-014); reja ta'rif aytmaydi va 2-ekran kashfiyotini («kim uchun va nima foyda») ochmaydi (P-015).
  «mahsulotingizni» — 11-Modulda o'quvchida mahsulot bor (T-039). 04 — internetga chiqarish o'quvchining harakati, va'da emas (P-026: Netlify qolsa — uyga vazifa).

## 2 · Sarlavha  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · sarlavha
- Sarlavha: **Sahifaning birinchi qatoriga nima yoziladi?** (43) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: Sarlavhaning so'zlari 11-Moduldagi PRD dan olinadi: o'ngdagi savollarni birma-bir bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov: nomning kattaligi, yo'q → kichik → katta): **Sarlavha yozilgach, «Maydon Jamoa» nomi qanday turadi?** ·
  Sahifadan olib tashlanadi · Tepada kichik bo'lib turadi · Eng katta yozuv bo'lib qoladi — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; savol-tugmalar shundan keyin yoqiladi.
- Vizual (SABOQ 21 — maket chapda, karta o'ngda):
  - **chapda — brauzer maketi** (0-ekrandagi qoralama: nom katta, sarlavha qatori bo'sh, telefon, tugma-skelet).
  - **o'ngda — karta «11-Moduldan · PRD»** (kulrang yorliq «Mentor misoli»), uch qator: **Muammo:** O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi. ·
    **Kim uchun:** Mahalladagi mini-futbol o'yinchilari: tashkilotchi — o'yinni e'lon qiladi, o'yinchi — o'yinga qo'shiladi. · **Yechim:** Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.
    Karta ostida savol-tugmalar (faqat joriysi yoqilgan, halqada): «Kim uchun?» · «Nima foyda?» · «Qanday qilib?»
- **Harakat → Vizual o'zgarish:**
  1. «Kim uchun?» → PRD kartasida «Mahalladagi mini-futbol o'yinchilari» ajraladi; sahifada nom kichrayib tepa-chap burchakka ko'chadi, sarlavha qatoriga **Mahalla futboliga** sirg'alib yoziladi (qolgani uzuq chiziq); ostida kulrang yorliq «kim uchun».
  2. «Nima foyda?» → PRD kartasida «jamoaga yetarli odam yig'ishda» ajraladi; sarlavha to'liq yoziladi: **Mahalla futboliga jamoani bir joyda yig'ing**; yorliq «kim uchun · nima foyda».
  3. «Qanday qilib?» → PRD kartasida Yechim qatori ajraladi; sarlavha ostiga sirg'alib yoziladi: **O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.**; yorliq «sarlavha osti».
  3/3 dan so'ng brauzer maketi ostida yorliq **lending** paydo bo'ladi (atama — misoldan keyin), `QIzoh`: Mahsulotni bitta sahifada tanishtiradigan sayt — lending deyiladi. (66)
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · haqiqatda: tepada kichik bo'lib turadi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bizda sarlavha ikki savolga javob beradi: kim uchun va nima foyda. Nom esa tepada kichik turadi. (96)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): O'ngdagi yoqilgan savolni bosing — sahifada nima o'zgarishini ko'ring.
- Tugma (pastki): Savollarni bosing (N/3) → Davom etish · `tugadi`: savol-tugmalar yo'qoladi, PRD kartasi ixcham qatorga yig'iladi, brauzer maketi butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy savol-tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: 2-Modulda birinchi blok — «katta sarlavha va bir qatorlik izoh» edi; bugungi «sarlavha osti» — shu izoh. Muammo gapi o'yinchilar haqida yozilgan («qiynaladi»), sarlavha esa odamning o'ziga qaratilgan («yig'ing») —
  sinfga shu farqni og'zaki ayting. Nomning kichik turishi — Mentor lendingidagi qaror, umumiy qoida emas. Sarlavha so'zma-so'z ko'chirilmaydi — PRD dan ma'nosi olinadi.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — Mentorning 11-Moduldagi g'oyasi, P-002)
- Eyebrow: Tekshiruv · sarlavha
- Savol: **Sinf uy vazifalari sayti. Qaysi sarlavhada kim uchun va foyda bor?** (11 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — «Vazifalar» — zamonaviy va qulay yangi sayt (43)
  - ✔ B — Sinfdoshlar, uy vazifasini bir joyda ko'ring (44)
  - C — Fanlar, jadval, fayllar va izohlar bo'limi (42)
  - D — React va NestJS'da qurilgan tezkor yangi sayt (45)
- To'g'ri izohi: Kim uchun — sinfdoshlar; foyda — vazifa bir joyda ko'rinadi. (60)
- Xato izohlari: A — Nom va sifat bor, lekin sayt kim uchun ekani yozilmagan. (56) · C — Bu bo'limlar ro'yxati — odam nima olishi ko'rinmaydi. (53) ·
  D — Texnologiya quruvchiga muhim; odam undan nima oladi? (52) · (umumiy) Ikki savolni bering: kim uchun? nima foyda? (43)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida kichik brauzer maketi — sarlavha B, «Sinfdoshlar» ostida kulrang yorliq «kim uchun», «bir joyda ko'ring» ostida «nima foyda».
- Izoh (MD): A — nom va bo'sh sifat (2-ekran: nom sarlavha emas; «qulay» — umumiy so'z), C — funksiyalar ro'yxati (0-ekran uchinchi varianti), D — texnologiya; har biri dars qoidasi bo'yicha noto'g'ri (S-004).
  Tire va qo'shtirnoq faqat A da, vergul B va C da — belgi faqat to'g'rida emas (S-003). «sayt» A va D da.

## 4 · Funksiyadan foydaga  ← QTushuncha (ketma-ket, 4 karta; SABOQ 9/13)
- Eyebrow: Tushuncha · foyda
- Sarlavha: **Funksiya odamga nima beradi?** (28)
- Mentor: Telefonda ajralib turgan funksiyaga qarang va u odamga nima berishini o'ngdagi kartadan tanlang.
- Chip qatori (`QQadamlar`, ixcham, bir qatorda; joriysi accent, o'tgani ✓): 1 «Qo'shilaman» · 2 «8 / 10» · 3 «Kelaman» · 4 Eslatma
- **Chapda — brauzer maketidagi telefon kattalashgan** (`JamoaTelefon`, ≈170×272): «Maydon Jamoa» · «O'yin» ekrani — «Shanba, 18:00 · Mahalla maydoni», «8 / 10», tugma «Qo'shilaman»; 3-kartada o'yin kuni holati — «Kelaman» belgisi. Joriy funksiya accent halqada.
  Telefon yonida juftliklar ro'yxati (bo'sh qatorlar yo'q — SABOQ 17): yozilgani «funksiya · foyda» (orasida ingichka chiziq, strelka emas).
- **O'ngda — bitta karta (joriy):** funksiya nomi (kulrang yorliq «funksiya») va uch tanlov (aralash tartib, to'g'ri o'rni har kartada boshqa):
  1. **«Qo'shilaman» tugmasi**
     - bir bosishda jamoadasiz (23)
     - bosilsa ro'yxatga yozadi (24)
     - Backend'ga so'rov yuboradi (26)
  2. **«8 / 10» soni**
     - qo'shilganlar va kerakli odam soni yoziladi (43)
     - nechta odam yig'ilganini so'rab o'tirmaysiz (43)
     - son har qo'shilishda bittaga oshib boradi (41)
  3. **«Kelaman» belgisi**
     - belgi faqat o'yin kuni ekranda paydo bo'ladi (44)
     - bosilganda tasdiq Backend'ga yozib qo'yiladi (44)
     - kim aniq kelishini o'yindan oldin bilasiz (41)
  4. **O'yindan oldin eslatma** — kulrang yorliq «roadmap: keyinroq»; telefonda bu funksiya yo'q — ekran o'zgarmaydi, ostida kulrang «ilovada hali yo'q». Ikki tugma: «Sahifaga yoziladi» · ✔ «Hozircha yozilmaydi»
  Tuzoqlar har kartada bitta xato-sinf (S-040): 1–3 — funksiyaning o'zi qanday ishlashi (odam nima olishi emas); 4 — hali yo'q narsani yozish.
- `QXato` (≤60): 1–3 — Bu funksiya nima qilishi — odam nima olishi emas. (49) · 4 — Ilovada eslatma hali yo'q — telefonga qarang. (45)
- Yordam (birinchi xatodan keyin, P-033; kartaga qarab bitta qator): 1–3 — Shu funksiya tufayli o'yinchi nimani qilmay qo'yadi yoki nimani biladi? · 4 — Sahifani o'qigan odam ilovani ochganda shu narsani topadimi?
- **Harakat → Vizual o'zgarish:** to'g'ri tanlov → foyda matni kartadan telefon yonidagi ro'yxatga uchadi: «Qo'shilaman» tugmasi · bir bosishda jamoadasiz (~1 s yashil), chip ✓, keyingi karta kiradi.
  Birinchi juftlikdan so'ng ro'yxat ustida yorliq **foyda** paydo bo'ladi (atama — misoldan keyin), `QIzoh`: Funksiya odamga nima berishi — foyda deyiladi. (46)
  4-karta: «Hozircha yozilmaydi» → «Eslatma» chipi kulrang qutiga tushadi, yorliq «hali yo'q». Xato → tanlov silkinadi, karta bir lahza `err` fon, bitta `QXato`.
  4/4 dan so'ng (`tugadi`): karta va chip qatori yo'qoladi; telefon kichrayib brauzer maketidagi joyiga qaytadi; juftliklar telefon yonidagi «uch foyda» joyiga navbat bilan ko'chadi — foyda katta yozuv bo'lib, ostida funksiya qatori (A-6 jadvali, bitta manba);
  «Eslatma» chipi sahifadan tashqarida kulrang qoladi. `QIzoh`: Mentor sahifasida har foyda katta yozilgan, ostida — uni beradigan funksiya. (76)
- Xulosa: Bu misolda sahifaga funksiya nomi emas, uning foydasi yozildi — hali yo'q eslatma esa yozilmadi. (96)
- Tugma (pastki): Funksiyalarni oching (N/4) → Davom etish · vizual ⛶ ichida.
- Keyingi bosiladigan joy: joriy chip → uch tanlov (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Benefit Finder! (to'rt kartada birinchi urinishda).
- O'qituvchi eslatmasi: Sahifadagi uch foyda — shu uch juftlikning o'zi: avval odam nima olishi, ostida qaysi funksiya beradi. «Ro'yxat o'zi yangilanadi» ham hali yo'q — sahifaga yozilmagan.
  Sinfdan so'rang: mahsulotingizdagi qaysi funksiya hali ishlamaydi? — o'shani sahifaga yozmaysiz.

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; ikkinchi misol — Mentorning 11-Moduldagi g'oyasi, P-002)
- Eyebrow: Tekshiruv · funksiya va foyda
- Savol: **To'garaklar sayti xaritani ko'rsatadi. Qaysi gap foydani aytadi?** (9 so'z) · savol ustida yorliq yo'q
  - A — Xarita manzillarni Database'dan oladi (37)
  - B — Xarita telefon ekraniga moslashtirilgan (39)
  - C — Tugma bilan xaritani kattalashtirasiz (37)
  - ✔ D — Yaqin to'garakni xaritadan tez topasiz (38)
- To'g'ri izohi: Bu gap odam nima olishini aytadi: yaqin to'garakni topadi. (58)
- Xato izohlari: A — Bu sayt qanday ishlashi — odam nima olishi emas. (48) · B — Bu sayt qanday qurilgani; odam undan nima oladi? (48) ·
  C — Bu funksiyaning o'zi: kattalashtirish nima beradi? (50) · (umumiy) Funksiya tufayli odam nimaga erishadi — shuni qidiring. (55)
- Javob topilgach (kichik karta, savol ostida): juftlik qatori «to'garaklar xaritasi · yaqin to'garakni tez topasiz» (4-ekran ro'yxati ko'rinishida).
- Izoh (MD): «xarita» to'rt variantda (kalit so'z faqat to'g'rida emas); C va D — ikkinchi shaxsda, A va B — uchinchi (3-vs-1 tell yo'q); distraktorlar rost, lekin funksiya yoki qurilish haqida (S-004).

## 6 · Asosiy tugma  ← QTushuncha
- Eyebrow: Tushuncha · tugma
- Sarlavha: **Tugma odamni qayerga olib boradi?** (33) — yangi atama sarlavhada yo'q (T-011)
- Mentor: Ilovani o'rnatish havolasi hali yo'q, sahifada esa tugma bor: uni bosib ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: hech qayerga → shu sahifa → boshqa sayt): **«Qo'shilmoqchiman» bosilganda nima ochiladi?** · Hech narsa ochilmaydi · Shu sahifadagi bo'lim · Boshqa sayt — ilova do'koni —
  tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; tugma shundan keyin yoqiladi.
- Vizual: **chapda — brauzer maketi**, to'liq lending (nom, sarlavha, sarlavha osti, **Qo'shilmoqchiman** tugmasi halqada, telefon va uch foyda); «Qanday qo'shilaman» bo'limi sahifa pastida — hali ko'rinmaydi.
  **O'ngda — kichik hisoblagich-karta** «Umami · tugma bosilishi: 0» (9-Modul Umami maketi ko'rinishida, chizilgan, logotipsiz; SABOQ 24 — bitta jonli hisoblagich, jadval emas); birinchi bosishdan so'ng ostida trek chiplari «Mobil trek» (accent) · «Web-trek».
- **Harakat → Vizual o'zgarish:**
  1. «Qo'shilmoqchiman» ni bosish → sahifa pastga suriladi, «Qanday qo'shilaman» bo'limi ochiladi: **Hozircha o'rnatish havolasi yo'q.**; hisoblagich 0 → 1, ostida mono `qoshilmoqchiman`.
     Tugma ustida yorliq **asosiy tugma** paydo bo'ladi (atama — harakatdan keyin), `QIzoh`: Sahifadagi odamni bitta harakatga chaqiradigan tugma — asosiy tugma. 2-Modulda buni CTA deb atagansiz. (102)
  2. «Web-trek» chipini bosish → sahifa tepaga qaytadi, tugma yana halqada; bosilganda manzil qatori almashadi (`….netlify.app` — mahsulot sayti, sahifa skeleti), kulrang yorliq «web-trekda tugma saytni ochadi»; «Qanday qo'shilaman» bo'limi yo'q.
     Hisoblagich bu yerda ham oshadi — ikkala trekda tugma bosilishi sanaladi.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: shu sahifadagi bo'lim» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bizda lending uch bo'lakdan iborat: sarlavha, uchta foyda va bitta asosiy tugma. U bor narsaga olib boradi. (107)
- Natija (`tugadi`): trek chiplari yo'qoladi; sahifa to'liq, tugma ustida yorliq, hisoblagich ixcham qator.
- Tugma (pastki): Tugmani bosing → Davom etish (ikkinchi trek ixtiyoriy) · vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat variantlari → «Qo'shilmoqchiman» (halqada) → «Davom etish» (yoki «Web-trek» chipi).
- O'qituvchi eslatmasi: Sahifada forma yo'q — ism, telefon, email so'ralmaydi; tugma faqat bo'limga olib boradi, bo'lim esa hozir nima tayyorligini halol aytadi. Tugma nomi keyin ham o'zgarmaydi (o'quvchiga va'da qilinmaydi).
  Umami 9-Moduldan: sahifa ochilishi avtomatik yoziladi, tugma bosilishi — hodisa. 2-Modulda «Harakat tugmasi … uni CTA ham deyishadi» — ko'prik shu yerda bir marta.

## 7 · Instagram  ← QVoqea (PM keys K3; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Instagram nimadan boshlangan?** (29)
- Nuqtalar (3) · yorliq **Instagram · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Instagram** (o'z rangida) — rasm va video ulashiladigan ilova. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har kadrda almashadi (≤2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket; takror matn yo'q.
- Sahna (`InstagramSahna`, chizilgan CSS/SVG telefon maketi; bankda yo'q narsa chizilmaydi — asoschilar, boshqa son, sabab yo'q):
  - 1/3 **Burbn** — Mentor: Burbn — Instagram asoschilarining birinchi ilovasi. Unda qayerdaligini belgilash, rejalar va rasm bor edi: funksiya ko'p, lekin uni hech kim ishlatmagan.
    · sahna: telefon, tepada nom «Burbn» (neytral to'q rang); menyuda uch nomli qator — «Belgilash» · «Rejalar» · «Rasm» — va yana uch nomsiz kulrang qator (ko'p funksiya); ekran oldida odam silueti yo'q.
    · bashorat (sahna ostida, bitta qator; S-015 — ko'paytirish → o'zgarishsiz → kamaytirish): **Asoschilar funksiyalar bilan nima qilgan?** · Yana funksiya qo'shgan · Hammasini qoldirgan · ✔ Ko'pini olib tashlagan
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Yoqqani qoldi** — Mentor: Asoschilar odamlarga yoqqanidan boshqa hammasini olib tashlagan. Qolgani — rasm, filtr va izohlar.
    · sahna: nomsiz qatorlar, «Belgilash» va «Rejalar» birma-bir so'nib chiqib ketadi; «Rasm» kattalashib ekranning o'rtasiga chiqadi, ostida filtr doiralari qatori va izoh qatori paydo bo'ladi.
  - 3/3 **Instagram** — Mentor: Instagram shunday tug'ilgan. 2010-yil oktabr — birinchi kuni 25 000 ta ro'yxatdan o'tish.
    · sahna: nom «Burbn» → **Instagram** (o'z rangida); ostida sana yorlig'i «2010-yil oktabr» va hisoblagich sanab o'sadi «birinchi kuni: 25 000 ro'yxatdan o'tish»; ostida kulrang qator: Shu voqeaning soni — sizga maqsad emas.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: ko'pini olib tashlagan» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Voqea davomi» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, kadr nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan so'ng, pastda, yashil): Bu voqeada hamma funksiya oldinga chiqarilmagan. Lendingda ham — muhim foydalar va bitta tugma. (95)
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- O'qituvchi eslatmasi: Burbn voqeasi 9-Modulning «Besh suhbatdan qaysi muammo chiqdi?» darsida ham bo'lgan — eslating; bugungi savol boshqa: sahifa hamma funksiyani sanaydimi. Ko'prik — umumiy joy: ilova va lending bir narsa emas; lendingdagi uch foyda «bitta narsa» emas — muhimlari (01-FILTR 2).
  25 000 — Instagram'ning soni; o'quvchi sahifasidan bunday son kutilmaydi, buni sinfga aytib qo'ying. Bankdan tashqari raqam, yil, ism va sabab qo'shmang.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K3 (183-qator, ruscha asl: Burbn — ko'p funksiya, hech kim ishlatmagan; qolgani — rasm, filtr, izohlar; 25 000, 2010-yil oktabr) · tayanch 5 (o'zbekcha matn va brend izohlari).
  9-Modul 3-darsida «surat · izoh · layk» deyilgan — bu darsda bank va tayanch so'zi: «rasm, filtr va izohlar» (Shubhali joylar).

## 8 · 3-savol  ← QTest (✔ A, `correctIdx 0`; Instagram qoidasi — o'quvchining o'z sahifasi)
- Eyebrow: Tekshiruv · Instagram'dagidek
- Savol: **Sahifaga hamma funksiyani yozmoqchisiz. Instagram voqeasi nimani eslatadi?** (9 so'z) · savol ustida yorliq yo'q
  - ✔ A — Odamlarga yoqqan bittasini oldinga chiqarishni (46)
  - B — Funksiya ko'p bo'lsa, odam ham ko'p kelishini (45)
  - C — Birinchi kunning o'zida juda ko'p odam kelishini (48)
  - D — Rasm va filtr har bir mahsulotga kerakligini (44)
- To'g'ri izohi: Bu voqeada ko'p funksiyadan odamlarga yoqqani qoldi. (52)
- Xato izohlari: B — Burbn'da funksiya ko'p edi — uni kim ishlatgan edi? (51) · C — Bu shu voqeaning soni — sahifangizga qoida emas. (48) ·
  D — Bu Instagram'da qolgani; sizda odamlarga nima yoqdi? (52) · (umumiy) Asoschilar ko'p funksiya bilan nima qilganini eslang. (53)
- Javob topilgach (kichik, savol ostida): 7-ekran 2/3 kadri — telefon ekranida bitta «Rasm» kartasi, so'ngan qatorlar kulrang.
- Izoh (MD): «-ni» tugallovi to'rt variantda; «odam» B va C da, «funksiya» B da (kalit so'z faqat to'g'rida emas); distraktorlar bank faktiga zid yoki shu voqeaning sonini qoida qiladi (S-004; sinf 9).

## 9 · Sahifa matni  ← QMustaqil (USTAXONA — ketma-ket karta, 4 bo'lak; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish · sahifa matni
- Sarlavha: **Sahifangiz matnini bo'lakma-bo'lak yozing.** (42)
- Mentor: Muammo gapingiz va yechimingiz 11-Moduldan keldi — ularga qarab avval sarlavhani yozing.
  (`pm-m9d4-final` va `pm-m9d5-prd` yo'q bo'lsa — Mentor: Avval muammo gapingiz va yechimingizni bir qatordan yozing, keyin sarlavhaga o'ting.)
- **Tepada — ixcham qator «11-Moduldan · PRD»** (bosilsa ochiladi, toggle — U-013): Muammo (`pm-m9d4-final.muammoGapi`) · Kim uchun (`pm-m9d5-prd.kim`) · Yechim (`pm-m9d5-prd.yechim`) · Uchta asosiy funksiya (`pm-m9d5-prd.funksiyalar`).
  Kalit yo'q bo'lsa — ikki erkin qator shu qatorda: «Muammo gapi» (placeholder «Kim nimadan qiynaladi?») · «Yechim» («Mahsulot nima qiladi?») — faqat shu darsda ishlatiladi, 11-Modul kalitlariga yozilmaydi.
- **Chapda — brauzer maketi:** o'quvchining sahifasi, jonli to'lib boradi; tepada kichik nom — `pm-m9d4-final.goya` dan; yo'q bo'lsa — birinchi karta «Mahsulot nomi» maydoni (nom `pm-m10d1-lending.nom` ga yoziladi — 01-FILTR 3); hisoblagich «Sahifam · n / 4».
- **O'ngda — bitta katta karta (joriy),** to'rt bo'lak ketma-ket (placeholder qisqa, tayyor javobsiz — §32; belgilar hisoblagichi — maket qo'riqchisi, xato matni yo'q):
  1. **Sarlavha** — savol: Kim uchun va nima foyda? · placeholder «Bir qator, odamga qaratib» · ≤ 60 belgi
  2. **Sarlavha osti** — savol: Bu qanday bo'ladi? · placeholder «Bir gap» · ≤ 110
  3. **Uch foyda** — uch juft maydon (Mentor sahifasidagi shakl: foyda va ostida funksiya qatori): **Foyda** — placeholder «Odam nima oladi?» · ≤ 50 · **Funksiya qatori** — placeholder «Qaysi funksiya buni beradi?» · ≤ 70;
     funksiya qatori ustida kulrang eslatma — PRD dagi funksiya nomi (`funksiyalar[i]`, bo'lsa; tahrirlanmaydi) · karta ostida kulrang qator: Faqat hozir ishlaydigan funksiyaning foydasi.
  4. **Asosiy tugma** — savol: Odam nima qiladi? · placeholder «Bir-uch so'z» · ≤ 24
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; yumshoq — ikkinchi «Saqlash» bilan o'tadi, «bo'sh» va «shaxsiy ma'lumot»dan tashqari):
  - maydon bo'sh (bloklaydi): Bu bo'lak bo'sh — sahifada joyi ko'rinmay qoladi. (49)
  - sarlavha ≤ 2 so'z yoki mahsulot nomi bilan bir xil: Bu nomga o'xshaydi: kim uchun va nima foyda? (44)
  - sarlavha yoki foydada bo'sh sifat («eng yaxshi», «zamonaviy», «qulay», «sifatli», «ajoyib»): Bu umumiy so'z — odam aynan nima oladi? (39)
  - foyda yoki funksiya qatorida kelajak belgisi («tez orada», «yaqinda», «keyinroq», «rejada», «bo'ladi»): Hali yo'q narsa bo'lsa — sahifaga yozilmaydi. (45)
  - foyda PRD dagi funksiya nomi bilan aynan bir xil: Bu funksiya nomi — u odamga nima beradi? (40)
  - ikki foyda bir xil: Bu foyda yuqorida bor — boshqasini yozing. (42)
  - tugma yozuvi > 3 so'z: Tugma yozuvi qisqa bo'lsin: bir-uch so'z. (41)
  - matnda 7+ raqam ketma-ket yoki «@» (bloklaydi): Sahifaga telefon va akkaunt nomi yozilmaydi. (44)
  - Yorliq (yumshoq xatodan so'ng): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (bo'lakka qarab bitta qator — Mentor misolidan, A-6 jadvali): 1 — Mentor misolida: «Mahalla futboliga jamoani bir joyda yig'ing» — odamga qaratib yozilgan. · 2 — Mentor misolida: «O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.» ·
  3 — Mentor misolida: «Nechta odam yig'ilganini so'rab o'tirmaysiz», ostida «Kartada ko'rinadi: 8 / 10.» — avval odam nima oladi, keyin qaysi funksiya beradi. · 4 — Mentor misolida: «Qo'shilmoqchiman» — odam o'z nomidan aytadigan bitta so'z.
- **Harakat → Vizual o'zgarish:** «Saqlash» → matn kartadan brauzer maketidagi o'z joyiga uchadi (~1 s yashil), hisoblagich n / 4 sanab o'sadi, pastdan keyingi karta kiradi. Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
  4/4 da karta yopiladi; brauzer maketi butun enga — to'liq sahifa, har bo'lak yonida ✎ (bosilsa o'sha bo'lak katta karta bo'lib ochiladi, qolgani joyida — SABOQ 29).
- Xulosa: Sahifangiz matni tayyor: sarlavha, uch foyda va bitta asosiy tugma. (67)
- Tugma (pastki): Yana N ta bo'lak yozing → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → «Saqlash» (maydon yozilgach halqada).
- Artefakt-strip (U-042): shu ekrandan — «Sahifam · n/4» (ixcham); 10, 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Saqlash: `pm-m10d1-lending = { sarlavha, osti, foydalar: [3], funksiyaQatori: [3], tugma, manzil: null, sinov: null }` (tayanch 8; `funksiyaQatori` — TAYANCHGA SAVOL 13; `manzil` — 11-ekranda, `sinov` — 10-ekranda yoziladi).
- Nishon: Page Writer! (4/4).
- Mentor rejimi: forma o'rniga Mentor lendingi to'liq (6-ekran holati). Mentor statistikasi: «Matnni to'liq yozganlar» · «Sarlavhasi birinchi urinishda o'tganlar».
- O'qituvchi eslatmasi: 15 daqiqa; ulgurmagan o'quvchi uyda yakunlaydi. Eng ko'p xato — sarlavhaga nom yoki shior yozish: «Bu kim uchun? Unga nima foyda?» deb so'rang. Ikkinchi xato — foydaga hali qurilmagan funksiyani yozish:
  «Odam ilovani ochganda buni topadimi?». Matnda telefon va akkaunt nomi bo'lmasin — sahifa hammaga ochiq bo'ladi.

## 10 · Besh soniyalik sinov  ← QMustaqil (juftlik + yakka rejim, 3 qadam)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Sherigingiz 5 soniyada nimani tushunadi?** (40) · yakka rejimda: **5 soniyadan keyin sahifadan nima esda qoladi?** (45)
- Mentor: Ekranni sherigingizga buring va «5 soniyani boshlash»ni bosing — keyin unga uch savol berasiz.
  Yakka rejimda: Sahifangizni 5 soniya ko'ring, keyin uch savolga ekranga qaramasdan, yoddan javob yozing.
- Chip qatori (ot-shakl, T-073): 1 Ko'rsatish · 2 So'rash · 3 Solishtirish · yakka: 1 Ko'rish · 2 Yozish · 3 Solishtirish
- 1-qism: brauzer maketi (o'quvchi sahifasi, butun en) parda ostida; tugma **5 soniyani boshlash** (halqada) → parda ko'tariladi, sanoq 5 → 0, parda tushadi. Kulrang qator: 5 soniya — shu mashqning qoidasi.
- 2-qism: uch savol kartasi (bittadan): **Bu nima?** · **Kim uchun?** · **Bu yerda nima qilish mumkin?** — har biriga qator (placeholder «U nima dedi?»; yakka: «Nima esda qoldi?») va kichik tugma «Javob bermadi» (yakka: «Eslay olmadim») · «Saqlash».
  Kulrang qator: Sherigingiz ismini yozmang — faqat javobini.
- 3-qism: «Ochish» → parda ko'tariladi; uch javob chapda pufak bo'lib turadi, har biri sahifadagi o'z bo'lagiga ingichka chiziq bilan ulanadi: «Bu nima?» va «Kim uchun?» — sarlavha · «Bu yerda nima qilish mumkin?» — asosiy tugma. Kulrang qator (bitta): Bu mashqda: javob mos kelmasa, chiziq ko'rsatgan bo'lakni qayta ko'rasiz. (01-FILTR 8 — bog'lash mashq yordamchisi, umumiy qoida emas)
  Har juftlik ostida ikki tugma: «Mos keldi» · «Mos kelmadi» (belgisiz — hech biri xato emas; sherik javobi kuzatuv).
- **Harakat → Vizual o'zgarish:** «5 soniyani boshlash» → parda va sanoq · «Saqlash» → javob ixcham qatorga · «Ochish» → parda yuqoriga sirg'aladi · «Mos keldi» → chiziq yashil · «Mos kelmadi» → chiziq kulrang uzuq, bo'lak yonida ✎ paydo bo'ladi
  (bosilsa 9-ekran kartasi ochiladi — ixtiyoriy; qizil rang yo'q). 3/3 dan so'ng sahifa ostida yorliq **besh soniyalik sinov** (yakka rejimda — **mashq**), `QIzoh`: Sherik sahifani 5 soniya ko'rib, nima va kim uchun ekanini aytdi — besh soniyalik sinov shu. (92)
  (yakka: Sherik bilan qilinsa, bu — besh soniyalik sinov; hozirgisi — mashq: sahifani o'zingiz bilasiz. (94))
- Xulosa (tanlovdan, P-046):
  - uchalasi «Mos keldi»: Bu sinovda sherigingiz uch savolga ham sahifadagidek javob berdi. Bitta sinov — kuzatuv, isbot emas. (100)
  - kamida bitta «Mos kelmadi»: {n} ta javob sahifaga mos kelmadi — o'sha bo'lakni qayta o'qing. Bitta sinov — kuzatuv, isbot emas. (99)
  - yakka rejim: Bu mashq edi: sahifani o'zingiz bilasiz. Sinov — uni hali ko'rmagan odam bilan, uyga vazifada. (94)
- Saqlash: `pm-m10d1-lending.sinov = { tur: 'sherik' | 'mashq', javoblar: [3], mos: [bool × 3] }` — juftlikda `'sherik'`, yakka rejimda `'mashq'`; «Javob bermadi» → `''`; «Mos keldi» → `true`, «Mos kelmadi» → `false` (01-FILTR 6, 7).
- Tugma (pastki): Solishtiring (N/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: «5 soniyani boshlash» → javob qatori → «Saqlash» → «Ochish» → «Mos keldi» / «Mos kelmadi».
- Nishon: Five Seconds! (solishtirish bajarilganda — juftlikda ham, yakka rejimda ham rost).
- Mentor statistikasi: «Mos keldi» · «Mos kelmadi» (savol bo'yicha).
- O'qituvchi eslatmasi: 7 daqiqa — yarmida «O'rin almashing» deng. Sherik mahsulotni 11-Modul pitchidan bilishi mumkin — iloji bo'lsa mahsulotni kam biladigan sinfdosh bilan juftlang; natijani shuni hisobga olib o'qing.
  Savolni bering, tushuntirmang. «Mos kelmadi» — sahifa uchun foydali topilma, baho emas; tuzatish ixtiyoriy va uyda ham bo'ladi.

## 11 · Sahifa internetga  ← QKod (amaliy topshiriq, agent — Antigravity — amaliyot bloki modeli `QBlok`: 4 qadam; ≈30 daq — 01-FILTR 11)
- Eyebrow: Amaliyot · lending
- Sarlavha: **Sahifangizni yig'ing va internetga chiqaring.** (45) — PM-082(a) «…digan kod yozamiz» oilasi emas: o'quvchi kod yozmaydi, talab beradi (tayanch 9.14: amaliy topshiriq sarlavhasi — natija-gap)
- Mentor: Sahifa matni tayyor — endi agent uni sahifaga aylantiradi; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingiz va trekingizda — `pm-m9d8-platforma`; trek yo'q bo'lsa 1-qadamda tanlov: «Mobil ilova» · «Sayt» → shu kalitga yoziladi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status` — o'zgargan fayl yo'q bo'lsin; ro'yxatda `.env` ko'rinmasin (ko'rinsa — avval `.gitignore` ga qo'shing).
  2. **Prompt** — talabning matn qatorlari mustaqil ishingizdan to'ldirilgan (tahrirlash mumkin). Qalin ikki joyni o'zingiz yozing — kulrang namunaga qarang, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: repo ildizida yangi `lending/` papkasi — `index.html` va `style.css`. Boshqa papkalarga tegma.
     > Nima qilsin: bitta sahifali statik sayt — oddiy HTML va CSS, yig'ish buyrug'isiz. Matnni aynan shunday yoz, bitta so'zini ham o'zgartirma:
     > nom — «{mahsulot nomi}» · sarlavha — «{sarlavha}» · sarlavha osti — «{sarlavha osti}» ·
     > uch foyda, har biri katta yozuv va ostida bitta qator — «{1-foyda}», ostida «{1-funksiya qatori}» · «{2-foyda}», ostida «{2-funksiya qatori}» · «{3-foyda}», ostida «{3-funksiya qatori}» · asosiy tugma — «{tugma yozuvi}».
     > Tugma bosilganda: **{tugma ochadigan joy}**
     > Sahifada mahsulot maketi bo'lsin — HTML va CSS bilan chizilgan, surat emas: **{maketda nima ko'rinadi}**. Sahifa adaptiv: telefon kengligida bir ustun.
     > Nima buzilmasin: boshqa papkalar o'zgarmasin. Sahifada forma va kiritish maydoni bo'lmasin — ism, telefon, email so'ralmaydi. O'zgargan fayllarni ayt.
     Joy yonidagi kulrang namunalar: `{tugma ochadigan joy}` — mobil trek: «masalan: sahifa pastidagi «Qanday qo'shilaman» bo'limi; bo'lim matni: «Hozircha o'rnatish havolasi yo'q.»» ·
     web-trek: «masalan: saytim — https://….netlify.app» · `{maketda nima ko'rinadi}` — «masalan: «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» — namuna ma'lumot, haqiqiy odamlar emas» ·
     `{hodisa nomi}` darsda promptga kirmaydi — u 9-ekranda tugma yozuvidan yasalib saqlangan (`pm-m10d1-lending.hodisa`; Mentor misolida `qoshilmoqchiman`) va uyga vazifa ② da ishlatiladi.
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: repo ildizida yangi `lending/` papkasi — `index.html` va `style.css`. Boshqa papkalarga tegma.
     > Nima qilsin: bitta sahifali statik sayt — oddiy HTML va CSS, yig'ish buyrug'isiz. Matnni aynan shunday yoz, bitta so'zini ham o'zgartirma:
     > nom — «Maydon Jamoa» · sarlavha — «Mahalla futboliga jamoani bir joyda yig'ing» · sarlavha osti — «O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.» ·
     > uch foyda, har biri katta yozuv va ostida bitta qator — «Bir bosishda jamoadasiz», ostida «Har o'yin alohida kartada: «Qo'shilaman» ni bosasiz.» ·
     > «Nechta odam yig'ilganini so'rab o'tirmaysiz», ostida «Kartada ko'rinadi: 8 / 10.» · «Kim aniq kelishini o'yindan oldin bilasiz», ostida «O'yin kuni har kim «Kelaman» ni bosadi.» · asosiy tugma — «Qo'shilmoqchiman».
     > Tugma bosilganda sahifa pastdagi «Qanday qo'shilaman» bo'limiga o'tsin; bo'lim matni: «Hozircha o'rnatish havolasi yo'q.»
     > Sahifada telefon maketi bo'lsin — HTML va CSS bilan chizilgan, surat emas: «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10». Sahifa adaptiv: telefon kengligida bir ustun.
     > Nima buzilmasin: `mobil/`, `backend/` va `prototip/` o'zgarmasin. Sahifada forma va kiritish maydoni bo'lmasin — ism, telefon, email so'ralmaydi. O'zgargan fayllarni ayt.
     Web-trekda Yordam promptining farqi bir gap: «Tugma bosilganda saytim ochilsin: {sayt manzili}» va «`prototip/` va `backend/` o'zgarmasin» (web-trek papkasi — 11-Modul tayanchi: `prototip/`).
  3. **Ishga tushirish** — agent tugatgach `lending/index.html` ni brauzerda oching. Agentning hisobotiga emas, sahifaning o'ziga qarang: matnni mustaqil ishdagi yozuvingiz bilan so'zma-so'z solishtiring (tepadagi ixcham sahifa shu uchun turibdi).
     `git status` — faqat `lending/` ichidagi fayllar o'zgargan. Mos kelmagan so'zni agentga bitta gap bilan yozing: «Sarlavha so'zma-so'z shunday bo'lsin: {sarlavha}. Tuzat.»
     Keyin `git add lending/index.html lending/style.css` → `git commit -m "12-modul 1-dars: lending"` → `git push`.
     Netlify: app.netlify.com da akkauntingizga kiring (2-Modulda ochgansiz) → yangi loyiha qo'shing («Add new project») → GitHub'dan import → o'z repo'ngiz. Sozlamada: Base directory — bo'sh (repo ildizi); Build command — bo'sh (yig'ish yo'q); Publish directory — `lending` (01-FILTR 12).
     Havola chiqadi: `….netlify.app`. Netlify sahifani chiqarguncha kutish paytida telefoningizda brauzerni ochib qo'ying. Sahifa ochilmasa — avval Netlify sozlamasida Publish directory `lending` ekanini tekshiring; keyin xato qatorini agentga yuboring (`.env` qiymatlarini emas).
     Vaqt tugayotgan bo'lsa — push qilib qo'ying: Netlify va tekshiruv — uyga vazifa ①.
  4. **Telefonda tekshirish** — telefonda `….netlify.app` havolasini oching va talabning har qatorini tekshiring: (1) sahifa bir ustunda, matn mustaqil ishdagi bilan bir xil; (2) asosiy tugmani bosing — mobil trekda sahifa bo'limga o'tishi, web-trekda saytingiz ochilishi kerak.
     Mos kelmagan qatorni agentga yozing. Oxirida havolani shu yerga yozing: maydon **Sahifa manzili** (`https://….netlify.app`) → «Bajardim».
     Tugma bosilishini sanash (Umami) — uyga vazifa ②: sahifa manzili endi ma'lum, Umami'da saytni shu manzil bilan qo'shasiz.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (brauzer maketi `maydon-jamoa-….netlify.app`, to'liq lending; bir marta o'zi yuradi: «Qo'shilmoqchiman» bosiladi → sahifa «Qanday qo'shilaman» bo'limiga suriladi);
  ostida bitta qator (kichik, mono): `git status` → `lending/index.html` `lending/style.css`
- Hammasi bajarilgach (yashil): Sahifangiz internetda: matnini va tugmasini telefonda o'zingiz tekshirdingiz. (77)
- Saqlanadi: `pm-m10d1-lending.manzil` — 4-qadamdagi maydon (bo'lmasa `null`). Blok holati (qaysi qadam «Bajardim») — skelet `ScreenBlok` da (dars `ccProgress`); 15-ekran sarlavhasi shundan.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-01-done` — oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi (01-FILTR 17). `lending/` papkasi namuna; o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Nishon: Page Online! (4-qadam «Bajardim» — havola yozilganda).
- Tugmalar: Orqaga · Avval bajaring → Davom etish (`optionalLive` — Netlify qolgan o'quvchi ham davom etadi; yakun holati «yig'ildi, internetga chiqmadi»).
- O'qituvchi eslatmasi: 30 daqiqa — 15 daqiqadan so'ng hali «Prompt»da bo'lgan o'quvchiga Mentor talabini (Yordam) ko'rsating. Netlify'da bepul navbat bo'lishi mumkin — kutish paytida 4-qadamni o'qishsin.
  Web-trekda lending — mahsulot saytidan **alohida** Netlify sayti (o'sha repo, boshqa papka). Matn so'zma-so'z — agent «yaxshilab» o'zgartirishi mumkin: o'quvchi solishtirishini talab qiling.
  Darsdan oldin tekshiring (P-028): Netlify'da yangi loyiha qo'shish oynasi va Base / Publish directory maydonlari hozir shundaymi; uyga vazifa ② dagi Umami yo'li («Websites» → «Add website» → «Edit» → «Tracking code» — rasmiy hujjat, 06.10).
- ✎ Talab (tayanch 1.1): qayerda · nima qilsin · nima buzilmasin — matn qatorlari 9-ekrandan tayyor, o'quvchi ikki joyni yozadi (TAYANCHGA SAVOL 6). Umami — uyga vazifa ② (01-FILTR 11); hodisaning yozilishi (`data-umami-event`) u yerda ham talabda aytilmaydi — agent tanlaydi.
  Netlify sozlamalari nomi — rasmiy hujjat (Manbalar; 06.10 qayta o'qildi: «Publish directory … is relative to the base directory, which is root by default» — shuning uchun base bo'sh, publish `lending`); Mentor repo'sida «qur» da sinaladi (Shubhali joylar).

## 12 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; halollik qoidasi — ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Mahsulotingizda bitta funksiya hali yo'q. Uni sahifaga foyda qilib yozasizmi?** (10 so'z) · savol ustida yorliq yo'q
  - A — Ha — u baribir yaqin kunlarda qo'shiladi (40)
  - B — Ha — kichik harflar bilan eng pastga yozasiz (44)
  - ✔ C — Yo'q — sahifaga hozir ishlaydigani yoziladi (43)
  - D — Yo'q — yangi funksiya odamlarga kerak emas (42)
- To'g'ri izohi: Sahifani o'qigan odam mahsulotda shu narsani topishi kerak. (59)
- Xato izohlari: A — Qo'shilguncha odam uni mahsulotda topa olmaydi. (47) · B — Kichik harf ham va'da: odam uni mahsulotda topadimi? (52) ·
  D — Funksiya kerak bo'lishi mumkin — gap u hozir yo'qligida. (56) · (umumiy) Sahifani o'qigan odam mahsulotda nimani topadi? (47)
- Javob topilgach (kichik, savol ostida): 4-ekrandagi «Eslatma» chipi — sahifadan tashqarida, kulrang «hali yo'q».
- Izoh (MD): «Ha» ikki, «Yo'q» ikki variantda (S-006); tire to'rtalasida; D — rost emas (yangi funksiya kerak bo'lishi mumkin), lekin sabab noto'g'ri — dars qoidasi bo'yicha xato (S-004). «Mahsulotingizda» — ikkala trek (sinf 12).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Sarlavha · 2 — Funksiya va foyda · 3 — Instagram · 4 — Hali yo'q funksiya

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Lending nima? | Mahsulotni bitta sahifada tanishtiradigan sayt |
| Bizda lending qaysi uch bo'lakdan iborat? | Sarlavha, uchta foyda va bitta asosiy tugma |
| Sarlavha qaysi ikki savolga javob beradi? | Kim uchun va nima foyda |
| Funksiya bilan foydaning farqi nima? | Funksiya — mahsulot nima qilishi; foyda — u odamga nima berishi |
| Mentor misolida «8 / 10» sonining foydasi qanday yozilgan? | «nechta odam yig'ilganini so'rab o'tirmaysiz» |
| Hali qurilmagan funksiya sahifaga yoziladimi? | Yo'q: sahifaga hozir ishlaydigan narsa yoziladi |
| Asosiy tugma nima? | Sahifadagi odamni bitta harakatga chaqiradigan tugma |
| Mentor lendingida tugma bosilganda nima ochiladi? | Sahifadagi «Qanday qo'shilaman» bo'limi |
| Nega lendingda forma yo'q? | Sahifa shaxsiy ma'lumot yig'maydi: ism ham, telefon ham so'ralmaydi |
| Besh soniyalik sinovda sherikka qaysi uch savol beriladi? | Bu nima? Kim uchun? Bu yerda nima qilish mumkin? |
| Burbn'dan nima qoldi? | Rasm, filtr va izohlar — ilova Instagram bo'ldi |
| Lending telefonda qanday ko'rinadi? | Adaptiv: telefon kengligida bir ustun |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (lending — 2 · uch bo'lak — 6 · ikki savol — 2 · funksiya va foyda — 4 · «8 / 10» juftligi — 4 · hali yo'q — 4, 12 · asosiy tugma, bo'lim — 6 · forma yo'q — 6 eslatma, 11 «Nima buzilmasin» · uch savol — 10 · Burbn — 7 · adaptiv — 11).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). CTA kartochkada yo'q (ko'prik bir marta — 6-ekran).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab — sinf 1; belgi ✓ va nishon faqat birinchisida):
  - `manzil` bor (blok 4/4): **Sahifangizni yozdingiz va internetga chiqardingiz.** (50)
  - blok 2- yoki 3-qadamda, `manzil` yo'q: **Sahifa yig'ildi — internetga chiqarish qoldi.** (45)
  - matn 4/4, blok boshlanmagan: **Sahifa matni tayyor — yig'ish qoldi.** (36)
  - matn 4/4 dan kam: **Sahifa matni boshlandi — qolganini yozing.** (42)
  Sarlavha ostida bitta chip (sinov holati): «Besh soniyalik sinov: sherik bilan» · «Besh soniyalik ko'rish: mashq — sinov uyda» · «Besh soniyalik sinov: qoldi».
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Lending funksiyani sanamaydi: kim uchun va nima foyda ekanini aytib, bitta harakatga chaqiradi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Lending — mahsulotni bitta sahifada tanishtiradigan sayt.
  - Bizda sarlavha ikki savolga javob beradi: kim uchun va nima foyda.
  - Foyda — funksiya odamga nima berishi; sahifaga hozir ishlaydigan funksiyaning foydasi yoziladi.
  - Asosiy tugma odamni bitta harakatga chaqiradi va hozir bor narsaga olib boradi.
  - Burbn'dan odamlarga yoqqani qoldi: rasm, filtr va izohlar.
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: sahifangizni hali ko'rmagan 2 kishi — uydagilar yoki do'stingiz · Nechta: 2 ta besh soniyalik sinov · Muddat: keyingi darsgacha
  - ① Sahifa hali internetga chiqmagan bo'lsa — push qiling va Netlify'ga chiqaring; havolani darsdagi «Sahifa manzili» maydoniga yozing.
  - ② Tugma bosilishini sanashni ulang: `cloud.umami.is` da akkauntingizga kiring (9-Modulda ochgansiz) → «Websites» → «Add website»: Name — mahsulotingiz nomi va «lending», Domain — sahifangiz manzili → «Save» → saytingiz yonidagi «Edit» → «Tracking code» dagi bir qator kodni nusxalang (u maxfiy emas — sahifa kodida hammaga ko'rinadi).
    Agentga: «`lending/index.html` ning `<head>` qismiga shu skriptni qo'sh: {skript}. Tugma bosilganda Umami'ga `{hodisa nomi}` hodisasi yozilsin. Umami yuklanmasa ham tugma ishlasin. Boshqa fayllarga tegma.» → push → sahifada tugmani bosing, Umami'da saytingiz sahifasini yangilang: hodisalar orasida `{hodisa nomi}` ko'rinishi kerak (reklama to'sgichi yoqilgan brauzerda yozilmasligi mumkin). Umami akkauntingiz bo'lmasa — Mentor o'z akkauntida sayt qo'shib beradi.
  - ③ Sahifani o'z telefoningizda har biriga 5 soniya ko'rsating va uch savolni bering: «Bu nima?» · «Kim uchun?» · «Bu yerda nima qilish mumkin?». Javoblarni qog'ozga yozing — ismini emas, kimligini («akam», «sinfdoshim»). Havolani guruhlarga yubormang.
  - ④ Ikkalasi ham javob bera olmagan savol bo'lsa — o'sha bo'lakni darsdagi matnda tuzating, agentga «Sahifadagi {bo'lak} shunday bo'lsin: {yangi matn}. Tuzat.» deb yozing va push qiling — sahifa odatda o'zi yangilanadi. Ikki kishi — kuzatuv, isbot emas.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «WebSocket: ekran o'zi yangilanadigan ulanish»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · sinov chipi · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Kim bilan» — HwCard yorlig'i; «kim uchun» — sarlavha savoli (T-015 — ikkalasi boshqa joyda). Uyga vazifa ① shartli (sinf 10); ② — Umami (darsdan ko'chdi, 01-FILTR 11; `{hodisa nomi}` — `pm-m10d1-lending.hodisa` dan); ③ — tanish doira, o'z telefonida, havola tarqatilmaydi (sinf 14); ④ — bitta tuzatish, «odatda» (sinf 2c). Uydagi sinov natijasi platformaga yozilmaydi — o'quvchi sahifasini o'zi tuzatishi uchun; keyingi darslar sahifa matnini o'qiydi, sinovni emas (01-FILTR 25).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Benefit Finder!** (4-ekran, to'rt kartada birinchi urinishda) — Uch funksiyaning foydasini va hali yo'q funksiyani birinchi urinishda ajratdingiz
- **Page Writer!** (9-ekran, 4/4) — Sahifangiz uchun sarlavha, uch foyda va tugma yozuvini yozdingiz
- **Five Seconds!** (10-ekran, solishtirish bajarilganda) — Sahifangizni besh soniyalik ko'rishdan keyin uch savol bilan solishtirdingiz (juftlikda ham, yakka rejimda ham rost)
- **Page Online!** (11-ekran, 4-qadam «Bajardim» — havola yozilganda) — Sahifangizni internetga chiqardingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Sarlavha: kim uchun va nima foyda** — 1 Sarlavha — sahifaning birinchi qatori. · 2 Bizda u ikki savolga javob beradi: kim uchun va nima foyda. · 3 Nom, texnologiya va bo'limlar ro'yxati bu savollarga javob bermaydi.
  — Sinfga savol: «Maydon Jamoa» so'zining o'zidan kim uchun ekani ko'rinadimi?
- **5 · Funksiya va foyda** — 1 Funksiya — mahsulot nima qilishi. · 2 Foyda — funksiya odamga nima berishi. · 3 Mentor misolida: «8 / 10» soni — «nechta odam yig'ilganini so'rab o'tirmaysiz».
  — Sinfga savol: Mahsulotingizdagi bitta funksiya odamga nima beradi?
- **8 · Instagram: yoqqani qoldi** — 1 Burbn'da funksiya ko'p edi, uni hech kim ishlatmagan. · 2 Asoschilar odamlarga yoqqanidan boshqa hammasini olib tashlagan. · 3 Qolgani — rasm, filtr va izohlar: Instagram shunday tug'ilgan.
  — Sinfga savol: Sahifangiz bitta gapda nimani va'da qiladi?
- **12 · Sahifada hozir ishlaydigan narsa** — 1 Sahifani o'qigan odam mahsulotni ochadi. · 2 U sahifada yozilgan narsani mahsulotda topishi kerak. · 3 Hali qurilmagan funksiya sahifaga yozilmaydi.
  — Sinfga savol: Mentor sahifasiga nega «eslatma» yozilmadi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·11 · B 2·7·12 · C 3·8·9 · D 4·5·10 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Sherigingiz sarlavhaga faqat mahsulot nomini yozdi. Nima yetishmaydi? (2)
   - ✔ Kim uchun va nima foyda (23)
   - Rang va shrift kattaligi (24)
   - Narxi va chiqqan sanasi (23)
   - Logotipi va nomning rangi (25)
2. Mentor lendingida «Maydon Jamoa» nomi qayerda turadi? (2)
   - Sarlavha o'rnida, katta yozuv (29)
   - ✔ Sahifa tepasida, kichik yozuv (29)
   - Faqat tugmaning ichida, qalin (29)
   - Sahifaning eng pastida, xira (28)
3. Kutubxona sayti kitob bor-yo'qligini ko'rsatadi. Foydasi qaysi? (4)
   - Sayt kitob ro'yxatini saqlaydi (30)
   - Qidiruvga kitob nomini yozasiz (30)
   - ✔ Kutubxonaga bekorga bormaysiz (29)
   - Ro'yxat har kuni yangilanadi (28)
4. Mentor sahifasiga «o'yindan oldin eslatma» nega yozilmadi? (4)
   - Eslatma o'yinchilarga yoqmagani uchun (37)
   - Sahifada bo'sh joy qolmagani uchun (34)
   - Eslatma juda uzun yozilgani uchun (33)
   - ✔ Ilovada u hali qurilmagani uchun (32)
5. Mentor lendingidagi «Qanday qo'shilaman» bo'limida hozir nima yozilgan? (6)
   - Ilovani do'kondan yuklab olish havolasi (39)
   - Ism va telefon raqami so'raladigan forma (40)
   - O'yinlar ro'yxati va «8 / 10» sonlari (37)
   - ✔ Hozircha o'rnatish havolasi yo'qligi (36)
6. Sahifangizda «Batafsil», «Yozilish» va «Bog'lanish» tugmalari bor. Bu darsda nima qilasiz? (6, 7)
   - ✔ Bitta asosiy tugmani qoldirasiz (31)
   - Uchalasini bir qatorga terasiz (30)
   - Yana bitta yangi tugma qo'shasiz (32)
   - Tugmalarni kichikroq qilib qo'yasiz (35)
7. Asoschilar Burbn'da qaysi funksiyalarni qoldirgan? (7)
   - Eng qiyin qurilganlarini (24)
   - ✔ Odamlarga yoqqanlarini (22)
   - O'zlariga yoqqanlarini (22)
   - Oxirgi qo'shilganlarini (23)
8. Instagram voqeasidagi «25 000» soni sizga nimani bildiradi? (7)
   - Birinchi kun uchun eng kam natijani (35)
   - Har lending yetishi kerak bo'lgan sonni (39)
   - ✔ Shu voqeaning sonini, sizga maqsad emas (39)
   - Sahifa sarlavhasiga yoziladigan sonni (37)
9. Sahifangizga ism va telefon uchun forma qo'ymoqchisiz. Bu darsda qanday qilinadi? (6, 11)
   - Forma asosiy tugmaning ostiga qo'yiladi (39)
   - Formada faqat telefon raqami so'rab olinadi (43)
   - ✔ Forma qo'yilmaydi: sahifa ma'lumot olmaydi (42)
   - Forma faqat mobil trekdagi sahifada bo'ladi (43)
10. Besh soniyalik sinovda sherigingiz «Kim uchun?» savoliga javob bera olmadi. Qaysi bo'lakni qayta o'qiysiz? (10)
    - Uchta foyda qatorini (20)
    - Tugmaning yozuvini (18)
    - Sahifaning manzilini (20)
    - ✔ Sahifa sarlavhasini (19)
11. Agent sahifani yig'di. Matnni qanday tekshirasiz? (11)
    - ✔ Yozganingiz bilan so'zma-so'z solishtirib (41)
    - Agentning yozgan hisobotini o'qib chiqib (40)
    - Sahifa brauzerda ochilganiga qarab qo'yib (41)
    - Papkadagi fayllar sonini sanab chiqib (37)
12. Tugma nechta marta bosilganini qayerdan bilasiz? (6, 11)
    - Netlify'dagi sayt sozlamalaridan (32)
    - ✔ Umami'dagi hodisalar ro'yxatidan (32)
    - GitHub'dagi commit ro'yxatidan (30)
    - Telefondagi brauzer tarixidan (29)
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — lending · sarlavha · foyda · funksiya · tugma · sahifa · sinov · Umami · uyga vazifa banneri — sahifa · sarlavha · foyda · sinov.
- Izoh (MD): 1 — kartochka 3 («qaysi ikki savol») nusxasi emas: sherik sahifasi holati (S-021); 3 — kutubxona sayti (o'smir olami, bitta gap; P-002); 6 — tugma nomlari namuna, o'quvchining sahifasi haqida savol; 12 — Netlify'da bepul analitika yo'q deb da'vo qilinmaydi: variant sozlamalar haqida (S-004, sinf 8).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmLandingLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s6 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s8/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s7 `QVoqea` · s9/s10 `QMustaqil` · s11 `QKod` o'rnida `QBlok` + `QPrompt` (skelet `ScreenBlok`, `ScreenA1` naqshi — amaliy topshiriq, agent Antigravity; tayanch 9.14) · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`LendingSahifa`** — bitta vizual (180): brauzer ramkasi (nuqtalar, manzil, qulf) + sahifa; holatlar `qoralama · toladi · toliq · ixcham · parda · oquvchi`; bo'lak holatlari (bo'sh/joriy/yozildi/xato); ichida **`JamoaTelefon`** (11-Modul ko'rinishi, ≈170×272; `oyinlar` / `oyin` ekranlari, o'yin kuni holati).
   Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda e'lon qilinadi. Manzil `maydon-jamoa-….netlify.app` — namuna, haqiqiy havola emas.
3. **`MENTOR_LENDING`** — `{ nom, sarlavha, osti, tugma, foydalar: [{ foyda, funksiya }] × 3, bolim, telefon: { ekran, oyin } }` (A-6 aynan; tayanch 9.2). **`MENTOR_PRD`** (s2 kartasi) — `{ muammo, kim, yechim }` 11-Modul 5-dars matni aynan. **`JUFTLIKLAR`** (s4) — 3 × `{ funksiya, foyda, tanlov: [3], togri }` — `foyda` `MENTOR_LENDING.foydalar[i].foyda` bilan bitta manba (kichik harf bilan; P-063) + 4-karta `{ nom: 'O\'yindan oldin eslatma', haliYoq: true }`.
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); `HookMaket` = `LendingSahifa` qoralama + siluet va «?» pufagi; tanlovda sarlavha qatori halqasi; matn yozilmaydi.
5. s2: `QBashorat` (nom kattaligi) → savol-tugmalar; `S2_SAVOLLAR` 3 × `{ savol, prdQator, ajraladi, boLak, matn }`; nom tepa-chapga ko'chadi (bitta `transform`); yorliq «lending» + `QIzoh` + `QTaxmin` + xulosa bitta natija blokida (SABOQ 25); 40 s ipucha.
6. s4: `JamoaTelefon` kattalashgan (`oyin` ekrani; 3-kartada `oyinKuni: true`); tanlov kartasi; juftliklar ro'yxati (ingichka chiziq, strelka emas); 4-karta ikki tugma; `tugadi` da telefon kichrayib `LendingSahifa` ga qaytadi, `foydalar` navbat bilan yoziladi; nishon `benefitFinder` (birinchi urinish ×4).
7. s6: `LendingSahifa` to'liq + «Qanday qo'shilaman» bo'limi (sahifa ichida scroll-animatsiya — `scrollIntoView` emas, ichki `translateY`); `UmamiSanoq` hisoblagich (0 → 1, mono `qoshilmoqchiman`); trek chipi `Web-trek` — manzil almashadi, bo'lim yo'q; yorliq «asosiy tugma» + `QIzoh` (CTA ko'prigi bir marta).
8. s7: `INSTAGRAM_KADR` 3 × `{ h — kadr nomi, m — Mentor gapi }` (SABOQ 8); `InstagramSahna` — telefon maketi: menyu qatorlari (3 nomli + 3 nomsiz) → so'nish → «Rasm» kartasi + filtr doiralari + izoh qatori → nom «Instagram» (brend rangi, `Brend` komponenti), sana yorlig'i, hisoblagich 25 000, kulrang qator;
   bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); tugma «Voqea davomi (N/3)»; manba izohi faylda. «Burbn» — neytral to'q rang.
9. s9 artefakt: `localStorage` `pm-m10d1-lending` = `{ nom, sarlavha, osti, foydalar: [3], funksiyaQatori: [3], tugma, hodisa, manzil: null, sinov: null, savedAt }` (tayanch 8; `nom` — `goya` dan yoki maydondan, `hodisa` — `tugma` dan `slug`: kichik lotin, apostrofsiz, chiziqcha, ≤50, tahrirlanmaydi — 01-FILTR 3, 4); o'qiydi `pm-m9d4-final` (`muammoGapi`, `goya`), `pm-m9d5-prd` (`kim`, `yechim`, `funksiyalar`); kalit yo'q — ikki erkin qator (saqlanmaydi);
   tekshiruvlar — bo'sh (blok), nom-o'xshash (≤2 so'z yoki `goya` bilan bir xil), bo'sh sifat ro'yxati, kelajak so'zlari, funksiya nomi bilan bir xil, takror foyda, tugma >3 so'z, telefon/«@» (blok; PM-032 — regex zamonni adashtirmaydi, ≥8 namuna sinovi);
   ketma-ket karta (bitta katta — SABOQ 29); ✎ — o'sha bo'lakni katta karta qiladi; nishon `pageWriter`; artefakt-strip «Sahifam».
10. s10: 3 qism; `BeshSoniya` taymer (5 → 0; ▶ ⏹ belgisiz) va parda; uch savol kartasi (`Javob bermadi` → `''`); solishtirish — pufak ↔ bo'lak chiziqlari, `Mos keldi` / `Mos kelmadi` (qizil yo'q, ✎ ixtiyoriy — 9-ekran kartasini ochadi);
    yakka rejim — `tur: 'mashq'` (juftlik — `'sherik'`), yorliq «mashq», o'z xulosasi; `pm-m10d1-lending.sinov` (`mos` bilan) yoziladi; `optionalLive`; nishon `fiveSeconds`; Mentor statistikasi.
11. s11: `QBlok` 4 qadam (`Bajardim` qulfi, ↻); `QPrompt` — qatorlar `pm-m10d1-lending` dan to'ldiriladi, ikki `{…}` joy (qalin), kulrang namunalar trekka qarab (`pm-m9d8-platforma.trek`; yo'q — 1-qadamda chip, kalitga yoziladi); Umami darsda yo'q — uyga vazifa ② (`hodisa` dan, 01-FILTR 11);
    Yordam — Mentor prompti (mobil; uch foyda — foyda va funksiya qatori, tayanch 9.2) + web-trek farqi bir gap; o'ng — `LendingSahifa` to'liq, bir marta o'zi yuradi, mono qatorlar; 4-qadamda maydon «Sahifa manzili» → `pm-m10d1-lending.manzil`; «Ortda qoldingizmi» qatori; nishon `pageOnline` (manzil yozilganda); `optionalLive`.
    ⚠️ Prompt matni ichida backtik — `QPrompt` ichida kod belgisi sifatida, template-satr ichida emas (CLAUDE.md tuzog'i).
12. Testlar s3/s5/s8/s12 — `correctIdx` 1/3/0/2 = `INLINE_KEYS`; `RECAPS` 3/5/8/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). s3/s5/s8/s12 kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. `ACHIEVEMENTS` 4 (`benefitFinder`, `pageWriter`, `fiveSeconds`, `pageOnline`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); yakun sarlavhasi — `manzil`, blok qadami, `n/4` dan (4 holat); sinov chipi — `sinov.tur` dan; `HW_TOKENS` — faqat so'z.
14. Uyga vazifa — yangi `HwCard` («Kim bilan · Nechta · Muddat», 3 band, ① shartli); alohida `.homework.jsx` yo'q.
15. App.jsx: `m10-01` qatoriga `comp: PmLandingLesson` + import — asosiy seans (bu agent tegmaydi). Nom «Mahsulotingizni bir sahifada qanday tanishtirasiz?» ✓ va osti «lending: sarlavha, foyda va bitta tugma» ✓ (App.jsx 398-qator, 06.10).
16. **REPO (Mentor misoli, «qur» da, buyruq bilan):** `maydon-jamoa` → `lending/index.html`, `lending/style.css` (A-6 matni, telefon maketi, adaptiv, Umami skripti + `data-umami-event="qoshilmoqchiman"`), teg `m12-dars-01-done`; Netlify'da alohida sayt (tayanch 3).
- Darvozalar: `npm run gates -- src/10-Modull/PmLandingLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

## Manbalar (o'zim tekshirgan rasmiy sahifalar, 06.10.2026)
- docs.umami.is/docs/track-events — «Add a data attribute with the following format: `data-umami-event="{event-name}"`» · «Other event listeners inside the element will not be triggered.» · «Event names are limited to 50 characters.» · `umami.track('Signup button')`.
- github.com/umami-software/umami — `src/tracker/index.ts` (master): `data-umami-event` li ichki `<a>` da tracker avval `preventDefault`, hodisani yuboradi, so'ng `location.href = href` — tugma havola bo'lsa ham bo'limga o'tish hodisadan keyin bo'ladi; tashqi havola (`target="_blank"`) oddiy ochiladi.
  Umami skripti yuklanmasa — ishlovchi yo'q, havola oddiy ishlaydi («Umami yuklanmasa ham tugma ishlasin» talabi shunga mos).
- docs.umami.is/docs/add-a-website — «Websites» → «Add website» → «Name», «Domain» («used to filter your own site from referrer metrics») → «Save». docs.umami.is/docs/collect-data — «Edit» → «Tracking code»; «Copy the code and insert it into the `<head>` section of your website»; «Ad blockers may prevent the tracking script from loading».
- docs.netlify.com/build/configure-builds/overview/ — «Base directory: directory where Netlify … runs your build command … If not set, the base directory defaults to the root of the repository» · «Publish directory: directory that contains the deploy-ready HTML files … relative to the base directory» ·
  «Build command: the command to run to build your site if you are using a static site generator or other build tool» · «To work from a specific subdirectory, update the base directory» · UI yorlig'i «Add new project».
- Tayanch 6 (06.10, asosiy seans): Umami `data-umami-event` / `umami.track`, 50 belgi · Netlify `*.netlify.app` HTTPS o'zi (10-Modul tayanchi 6) · Instagram 13 yoshdan (help.instagram.com) — darsda yosh aytilmaydi.
- 9-Modul `06-PmAnalyticsDayOne-v3.md` (05.10 tekshirilgan): «Websites» → «Add website», «Edit» → «Tracking code», «Views», «Events» — bugun «Add website», «Edit», «Tracking code» qayta tasdiqlandi; «Views» va «Events» yorliqlari bugun qayta tekshirilmadi (Shubhali joylar).

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10 15:55, 01-FILTR):** 5 → ✅ `tur: 'sherik'`, `mos` qo'shildi · 7 → Umami uyga vazifa ② ga ko'chdi, Domain endi sahifa manzili (`localhost` kerak emas) · 8 → ✅ `nom` kalitga qo'shildi · 10 → qiymatlar o'zgardi (base bo'sh, publish `lending`), «qur» da sinaladi · 13 → ✅ tayanch 9.21 · 14 (yangi) → ✅ `hodisa` kalitda.
> Oldingi holat (06.10 14:15, tayanch 9): 1 → ✅ 9.2 · 5 → ✅ 9.13 · 9 → ✅ 9.14 · 2, 3, 4, 6, 7, 8, 11, 12 → ✅ qabul — MD qarori · 10 → ochiq — «qur» da sinaladi · 13 → ochiq (yangi, 9.2 dan keyin).
1. ✅ tayanch 9.2 — **Juftliklar va sahifadagi uch foyda** bir xil emas edi. Endi aynan bir: foyda — katta yozuv, funksiya — ostidagi qator (1.1). MD da Mentor lendingi ko'ringan hamma joy (A-6, 4-ekran yakuni, 9-ekran shakli va Yordam, 11-ekran prompti va Yordam, KOD) shu matnga almashtirildi.
2. ✅ qabul — MD qarori. **Sahifadagi tartib** (nom tepa-chapda kichik · sarlavha · sarlavha osti · asosiy tugma · telefon maketi va yonida uch foyda · «Qanday qo'shilaman» bo'limi pastda) — tayanchda yo'q; 2-ekran bashorati («nom qanday turadi») shu qarorga tayanadi. Mentor repo'si (`lending/index.html`) shu tartibda bo'lsin.
3. ✅ qabul — MD qarori. **0-ekran qoralamasi** — Mentor lendingining «faqat nom va telefon» holati (sarlavha yo'q) tayanchda yo'q; vizual uchun kerak, matn qo'shilmagan.
4. ✅ qabul — MD qarori. **Sarlavha osti roli — «qanday qilib»** (yechim gapidan) va sarlavha so'zlari PRD «Kim uchun» hamda muammo gapidan olinishi — mening izohim; tayanch faqat matnni beradi. 2-ekran savol-tugmalari shunga qurilgan.
5. ✅ 01-FILTR 6, 7 — `tur: 'sherik' | 'mashq'`, `mos: [bool × 3]` saqlanadi. Eski matn: **`sinov` kaliti:** `tur: 'real'` — sherik bilan (real odam), `'mashq'` — yakka rejim. 11-Modul `pm-m9d13-sinov` da `real` auditoriyadan, `mashq` sinfdosh edi — bu darsda sherik «real» deb olindi (tayanch 2: «real odam bilan — shuning uchun «sinov»»). Agar 11-Modul ma'nosi saqlansin desangiz — sinfdosh `'mashq'` bo'ladi, yakun chipi o'zgaradi.
   «Mos keldi / kelmadi» natijasi saqlanmaydi (kalitda joy yo'q) — kerak bo'lsa `mos: [bool × 3]` maydoni (6, 7-darslar o'qimaydi).
6. ✅ qabul — MD qarori. **Talab zinapoyasi (1-dars):** matn qatorlari 9-ekrandan tayyor, o'quvchi uch joyni yozadi (tugma ochadigan joy · maketda nima ko'rinadi · Umami skripti); `{hodisa nomi}` tugma yozuvidan avto. Tayanch 4 zinapoyani faqat loyiha kunlari uchun beradi.
7. ✅ qabul — MD qarori. **Umami Domain — hozircha `localhost`** (sahifa manzili Netlify'dan keyin bilinadi); Name — «{mahsulot} lending». Tayanch 6 da Domain haqida yo'q. Umami hodisa nomi o'quvchida — tugma yozuvidan (`qoshilmoqchiman` — Mentorniki; 6–7, 10-darslar Umami sonini «tugma bosilishi» deb o'qiydi).
8. ✅ qabul — MD qarori. **Mahsulot nomi** `pm-m10d1-lending` da yo'q — talabda `{mahsulot nomi}` `pm-m9d4-final.goya` dan to'ldiriladi; yo'q bo'lsa o'quvchi promptda yozadi. 6-dars posti nomni qayerdan oladi — shu kalitdan.
9. ✅ tayanch 9.14. **«VS Code topshirig'i» va Antigravity.** Tayanch 4 mexanikani «VS Code» deydi; 11-Modul bloklarida agent — Antigravity («Antigravity'da o'z repo'ngizni oching»). MD da o'quvchi matni 11-Modul so'zi bilan; MD sarlavhasi «…digan kod yozamiz» oilasida emas (kod yozilmaydi — 11-Modul 5-dars `PRD.md` naqshi).
10. ochiq — «qur» da sinaladi. **Netlify sozlamasi** — Base directory `lending`, Build command bo'sh, Publish directory — shu papkaning o'zi (rasmiy hujjat: publish base'ga nisbatan). Lending — alohida Netlify sayti (o'sha repo). «Qur» da Mentor repo'sida sinab, tayanch 6 ga aniq qiymat yozilsin.
11. ✅ qabul — MD qarori. **9-ekran tekshiruvlari** (bo'sh sifat, kelajak so'zlari, telefon/«@», tugma ≤3 so'z) — mening ro'yxatim; 6-dars posti uchun ham xuddi shu tekshiruv kerak bo'ladi — bitta funksiyaga chiqarilsinmi?
12. ✅ qabul — MD qarori. **Arena 6 tugma nomlari** («Batafsil», «Yozilish», «Bog'lanish») va arena 3 (kutubxona sayti) — ikkinchi misol, bitta gapda (P-002); tayanchda yo'q.
13. ochiq. **`funksiyaQatori: [3]`** — 9.2 dan keyin o'quvchi har foydaga funksiya qatorini ham yozadi (9-ekran), u 11-ekran promptiga kerak. Tayanch 8 da `foydalar: [3]` (faqat foyda) — MD shu maydonni o'zgartirmadi
    (6-dars posti va 12-dars «Yechim» foydalarni avvalgidek o'qiydi), funksiya qatorlari uchun yangi maydon qo'shdi. Tayanch 8 ga qo'shilsinmi yoki `foydalar: [{ foyda, funksiya }]` shakliga o'tilsinmi?

14. ✅ 01-FILTR 4 (yangi) — **Umami hodisa nomi kalitda:** `pm-m10d1-lending.hodisa` — 9-ekranda tugma yozuvidan yasaladi, tahrirlanmaydi; uyga vazifa ② va 6, 7, 10-darslar shu nomni o'qiydi.
15. ✅ 01-FILTR 20 (rad, o'zgarishsiz) — «Bir bosishda jamoadasiz»: 11-Modul tayanchi 1.7 — to'lgan o'yinda «Qo'shilaman» o'rnida «O'yin to'ldi» / «Navbatga yozilish»; «Qo'shilaman» faqat joy bor o'yinda turadi — foyda rost.

## Shubhali joylar (ishonchim komil emas)
- **Netlify «Publish directory — shu papkaning o'zi»** (Base `lending`, build bo'sh): hujjat «publish base'ga nisbatan» deydi, lekin bo'sh build va statik papka bilan UI nimani oldindan to'ldirishi tekshirilmadi — pilotda Mentor repo'sida sinaladi. Xato yo'li MD da bitta gap.
- **Umami (uyga vazifa ②)** — «Websites», «Add website», «Save», «Edit», «Tracking code» — rasmiy hujjat (docs.umami.is, 06.10 qayta o'qildi); hodisalar ro'yxatining aniq yorlig'i («Events») o'quvchi matnidan olindi — umumiy so'z «hodisalar orasida» (01-FILTR 13).
- **Umami hodisasi `<a href="#…">` tugmada** — tracker manbasiga ko'ra ichki havolada avval hodisa, keyin o'tish; haqiqiy sahifada sinalmadi («qur» da). Talab agentga mexanizmni aytmaydi — agent `<button>` + JS yoki `<a>` tanlashi mumkin; tekshiruv — xatti-harakat bilan.
- **Umami `localhost` yoki `file://` da yozadimi** — 3-qadamda `index.html` lokal ochilganda Umami'da nima ko'rinishi aytilmagan; tekshiruv faqat Netlify havolasida.
- **Burbn rangi** — bankda va rasmiy manbada yo'q; sahnada neytral to'q rang («Instagram» — o'z rangida). 9-Modul 3-darsida Burbn sahnasi bor edi — rang shu bilan bir xil bo'lsin (quruvchi tekshiradi).
- **Bank so'zi «rasm, filtr va izohlar»** — 9-Modul 3-darsida «Surat · Izoh · Layk» deyilgan (o'sha dars TechCrunch manbasidan «photo, comment, and like» olgan). Bu darsda bank va tayanch so'zi; ikki dars orasidagi farq o'quvchiga ko'rinmaydi, lekin bor.
- **2-ekran «Kim uchun?» → «Mahalla futboliga»** — PRD «Mahalladagi mini-futbol o'yinchilari» dan sarlavhaga «Mahalla futboliga» o'tishi ma'no bo'yicha, so'zma-so'z emas; o'quvchi «nega o'yinchilar yozilmadi?» deb so'rashi mumkin — O'qituvchi eslatmasida javob bor.
- **Hook javobi «Rasm sahifani bezaydi…»** — rasm va rang haqida umumiy gap; dalil ekranda (sarlavha qatori bo'sh), lekin «rasm yetmaydi» degan fikr yolg'onga chiqarilmaydi (P-016) — ikkala «Qiziq fikr!» ham «ham yoziladi/bezaydi» deb tan oladi.
- **9-ekran kelajak-so'z tekshiruvi** («bo'ladi») — rost foydada ham uchrashi mumkin («bir joyda ko'rinadigan bo'ladi»); yumshoq xato, ikkinchi «Saqlash» bilan o'tadi; ≥8 namuna sinovi «qur» da (PM-032).
- **Sherik mahsulotni biladi** (11-Modul pitchidan) — besh soniyalik sinov natijasi shunga bog'liq; O'qituvchi eslatmasi juftlashni maslahat beradi, MD xulosasi «bitta sinov — kuzatuv» deb chegaralaydi.
- **30 daqiqalik blok** (01-FILTR 11: 22 edi; Umami uyga ko'chdi) — agent + push + Netlify + telefon tekshiruvi; pilotda taymer bilan o'lchanadi. Ulgurmaslik yo'li 3-qadamda yozilgan.
- **Mentor repo'si `maydon-jamoa` da 11-Modul «qur» bosqichi hali bo'lmagan bo'lishi mumkin** — `m12-dars-01-done` tegi «Ortda qoldingizmi» qatorida; teg hozir yo'q (tayanch 3: «qur» da yoziladi).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 15-ekran: to'rt sarlavha (internetda · yig'ildi · matn tayyor · matn boshlandi) + sinov chipi; ✓ va nishon faqat `manzil` bor holatda; sarlavha o'quvchi ishini aytadi, Mentor natijasini emas.
2. [x] **Da'vo isbot emas** — (a) «Bizda lending uch bo'lakdan…», «Bizda sarlavha ikki savolga…» (2, 6, 14, 15-ekranlar); (b) «Mentor misolida», «Mentor lendingida» (2, 4, 6, 9 Yordam, arena 2, 4, 5); (c) «odatda o'zi yangilanadi» (15 ③), «bo'lishi kerak — tekshiring», «yozmasligi mumkin» (11-ekran 4-qadam), agent hisobotiga emas sahifaga qarash (11-ekran 3-qadam);
   (d) «Bitta sinov — kuzatuv, isbot emas» (10-ekran xulosalari), «Ikki kishi — kuzatuv, isbot emas» (15 ③).
3. [x] **Maxfiy qiymat chiqmaydi** — 11-ekran 1-qadam `git status` da `.env` ko'rinmasin; 3-qadam xato yo'li «`.env` qiymatlarini emas»; Umami skripti maxfiy emasligi aytilgan; lendingda shaxsiy ma'lumot yo'q (9-ekran tekshiruvi, 11-ekran «Nima buzilmasin»).
4. [x] **Tashqi xizmat — faqat rasmiy hujjat** — Umami («Websites», «Add website», «Edit», «Tracking code», 50 belgi), Netlify («Base directory», «Build command», «Publish directory», «Add new project») — Manbalar bo'limida havola va sana; tekshirilmaganlar («Views», «Events», publish qiymati) — umumiy so'z + Shubhali joylar.
5. [x] **Har sonning manbasi** — «8 / 10» (namuna o'yin), «25 000» (bank, «shu voqeaning soni — sizga maqsad emas», arena 8), «5 soniya» (mashq qoidasi), Umami hisoblagich «tugma bosilishi: 1» (birligi — bosish). Boshqa son yo'q.
6. [x] **Tayanchda yo'q narsa to'qilmadi** — lending matni, juftliklar, bo'lim matni, K3 so'zlari, brend izohlari — aynan; o'zim qaror qilganlar (tartib, qoralama, bashorat, tekshiruvlar, Netlify qiymatlari, `funksiyaQatori`) — TAYANCHGA SAVOL 1–13.
7. [x] **Saqlash kaliti — o'qiydigan darsning ehtiyojidan** — `pm-m10d1-lending` tayanch 8 aynan (6, 7-darslar: sarlavha, foydalar, tugma, manzil, sinov) + `funksiyaQatori` (TAYANCHGA SAVOL 13); `sinov.tur` real/mashq ajratilgan; ish fakti (`manzil`) va natija (`sinov`) alohida; kalit yo'q bo'lsa — o'quvchi o'zi yozadi (9-ekran erkin qatorlar, 11-ekran `{mahsulot nomi}`).
8. [x] **Test: bitta himoyalanadigan javob** — s3 (A nom+sifat, C ro'yxat, D texnologiya), s5 (A/B qurilish, C funksiya), s8 (B bankga zid, C son — qoida emas, D ko'chirma), s12 (A/B va'da, D sabab noto'g'ri); «Hech qayerda» tipidagi variant yo'q; ✔ yolg'iz eng uzun emas (O'lchov); son savolda takrorlanmaydi.
9. [x] **Keys: bank so'zi aynan** — 7-ekran uch kadr bank matni; brend izohlari tayanch 5; ko'prik «Bu voqeada … Lending ham …» (umumiy joy); «25 000» maqsad emas (kulrang qator, O'qituvchi eslatmasi, s8 C, arena 8); natija va sabab qo'shilmagan.
10. [x] **90 daqiqa** — A-bo'limda taqsimot; 9-ekran `optionalLive` + uyda yakunlash; 11-ekran 3-qadamda «Vaqt tugayotgan bo'lsa — push qilib qo'ying»; Netlify kutishida nima qilinishi yozilgan; «Ortda qoldingizmi»; yakun holatga qarab.
11. [x] **Bir ma'no — bir so'z** — A-5: «sahifa» (lending), «bo'lak» / «bo'lim», «hodisa» (faqat analitika), «e'lon» (o'yin), «sinov» / «tekshirish» / «mashq», «qadam»/«bosqich» o'quvchi matnida yo'q, «eslatma» faqat funksiya nomi, «push» faqat `git push`.
12. [x] **Web-trek teng yo'l** — 6-ekran «Web-trek» chipi (tugma saytni ochadi, bo'lim yo'q); 11-ekran `{tugma ochadigan joy}` namunasi va Yordam farqi bir gap; 12-ekran savoli «Mahsulotingizda»; 15-ekran holatlari ikkala trekka to'g'ri.
13. [x] **Agent va o'quvchi ishi ajratilgan** — matnni o'quvchi yozadi (9), tugma qayerga olib borishini va maketni o'quvchi aytadi (11-ekran joylar), agent yig'adi; tekshiruvda o'quvchi nimani ko'rishi aniq (so'zma-so'z solishtirish, `git status`, telefon, Umami); agent hisoboti — da'vo. `DELETE`/tekshiruv yozuvi bu darsda yo'q.
14. [x] **O'smir xavfsizligi** — forma yo'q (6, 11, kartochka 9, arena 9); matnda telefon/akkaunt tekshiruvi (9); sherik ismi yozilmaydi (10); uyda — tanish doira, o'z telefonida, havola guruhlarga yuborilmaydi (15); maketda namuna ma'lumot (11).

## O'lchov (`scratchpad/md01/olchov.py` natijasi — har o'lchangan matn yonida qavsda; jadval skript chiqishidan)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0–2, 4, 6, 7, 9, 10 ×2, 11, 14, 15 ×4) | 15 | 25 | 53 | ≤55, bitta qator |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 89 | 94 | ≤120 |
| Xulosa (2, 4, 6, 7, 9, 10 ×3) | 8 | 67 | 108 | ≤110 |
| To'g'ri izohi (3, 5, 8, 12) | 4 | 52 | 60 | ≤60, «To'g'ri!» siz |
| Xato izohi va `QXato` (3, 4, 5, 8, 9, 12) | 26 | 39 | 56 | ≤60 |
| `QIzoh` va yashil yakun (2, 4 ×2, 6, 10 ×2, 11) | 7 | 46 | 102 | hisobot (≤110); 4-ekran yakuniy `QIzoh` (14:15 yangilandi) — 76 |
| Mentor lendingi uch foyda (tayanch 9.2; 14:15) — foyda · funksiya qatori | 3 + 3 | 23 · 26 | 43 · 52 | 9-ekran maydon chegarasi: foyda ≤50, funksiya qatori ≤70 |
| Test variantlari — s3 | 4 | 42 | 45 | farq 7%, ✔ 44 |
| s5 | 4 | 37 | 39 | farq 5%, ✔ 38 |
| s8 | 4 | 44 | 48 | farq 8%, ✔ 46 |
| s12 | 4 | 40 | 44 | farq 9%, ✔ 43 |
| Hook variantlari (0) | 3 | 29 | 31 | farq 6% |
| 4-ekran tanlovlari (uch karta) | 3 ×3 | 23 · 41 · 41 | 26 · 43 · 44 | farq 12% · 5% · 7%; ✔ yolg'iz eng uzun emas |
| Arena 1–12 | 48 | 18 (10-savol) | 43 (9-savol) | har savolda farq ≤14%; ✔ hech qayerda yolg'iz eng uzun emas |

Arena ✔ taqsimoti: A — 1, 6, 11 · B — 2, 7, 12 · C — 3, 8, 9 · D — 4, 5, 10 (3/3/3/3). Ekran testlari: s3 B · s5 D · s8 A · s12 C.
Mentor gaplari: 0, 2, 4, 6, 9, 10, 11 — bitta gap (interaktiv); 1, 7 (har kadr) — ikki gap; sarlavhani takrorlamaydi (qo'lda tekshirildi). Savollar: s3 11 so'z · s5 9 · s8 9 · s12 10 (≤12).
`npm run lint:til feedback/F-1006-12modul/01-PmLanding-v3.md` — 0 error, 0 warn (06.10; 14:15 yangilanishdan keyin qayta yurgizildi).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 391 `m9-17` «Demo Day 7» → 398 **`m10-01` «Mahsulotingizni bir sahifada qanday tanishtirasiz?»** (osti «lending: sarlavha, foyda va bitta tugma» — reja chap qatori so'zma-so'z) → 399 `m10-02` «WebSocket: ekran o'zi yangilanadigan ulanish» (yakun qatori).
- [x] Bitta misol-ip: «Maydon Jamoa» lendingi (1.1 aynan); metafora yo'q; bitta vizual — `LendingSahifa` (qoralama · to'liq · ixcham · parda · o'quvchi) + ichida `JamoaTelefon`. Ikkinchi misol faqat testda (uy vazifalari sayti, to'garaklar xaritasi, kutubxona — P-002). Instagram — keys sahnasi (PM-028/029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 6 (QTushuncha) + 0, 7, 9, 10, 11; testlarda javobdan keyingi kichik vizual. «bosish va matn-karta» naqshi yo'q — har bosish sahifani, telefonni yoki hisoblagichni o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izoh ≤60 — jadval yuqorida.
- [x] Atamalar: muammo gapi, yechim, kim uchun, asosiy funksiya (11-Modul), Umami va hodisa (9-Modul), Netlify (2, 9-Modul), adaptiv (11-Modul 9-dars) — so'zma-so'z; yangi «lending», «foyda», «asosiy tugma», «besh soniyalik sinov» — misoldan keyin; siz-forma, tugmalar ot-shaklda («Saqlash», «Ochish», «Davom etish», «5 soniyani boshlash»), yorliq qatori ot-shaklda (10-ekran chip qatori).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov jadvali, farq ≤15%); to'g'ri javob hech qayerda yolg'iz eng uzun emas; tire / kalit so'z faqat to'g'rida emas (s3 — tire A da, vergul B/C; s5 — «xarita» to'rttasida; s8 — «-ni» to'rttasida; s12 — tire to'rttasida, Ha/Yo'q 2/2). Arena 12 — farq ≤15%, ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%» — grep 0; «odatda», «bo'lishi kerak», «mumkin», «bu misolda», «bu voqeada» bilan chegaralangan).
- [x] Ichki kodlar yo'q (o'quvchi matnida F-kod, `m10-NN`, «Modul 12», A1, K3 yo'q; modul raqami LMS raqamida — «11-Modul», «9-Modul», «2-Modul»). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 16 band. Manbalar — havola va sana bilan.
- [x] Karta T · P · S · PM: T-011/PM-030 (atamalar misoldan keyin, sarlavhada yo'q) · T-014/T-015 (A-5) · T-016 (metafora yo'q) · T-020 (kafolat yo'q) · T-029 (Mentor «Bu…» bilan boshlanmaydi, ekrandagini ta'riflamaydi) · T-035 (strelka yo'q — chiziq) ·
  T-038 (keyingi dars faqat yakun qatorida) · T-039 («sahifangiz» — yozilayotgan narsa) · T-042 (ta'riflar so'zma-so'z: 2, 4, 6, 10, 14, 15) · T-043 («bu misolda», «bu voqeada») · T-047/T-048 · T-064 (2-ekran 0-ekran savoliga javob) · T-071/T-073 (siz-forma, ot-shakl) ·
  P-001 (bitta ip) · P-002 (ikkinchi misol testda) · P-008 (bir ekran — bir ish; 4-ekranda to'rt karta ketma-ket, bitta ish — foydani tanlash) · P-013 · P-014/P-015 · P-016 (hook javoblari teng, dalil ekranda) · P-025 (uyga vazifa karta) · P-026/P-028 (tashqi qadamlar: xato yo'li bitta gap, nomlar hujjatdan) ·
  P-033 (Yordam xatodan keyin) · P-036 (0-ekranda sarlavha yozilmaydi) · P-046 (10, 15-ekran o'quvchi ma'lumotidan) · P-052 (bitta vizual) · P-053 (keys sahnasi, `pre` kadr) · P-059 (blok 4 qadam) · P-062 · P-064 (bashorat 2, 6, 7) · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 · S-006 (s12 Ha/Yo'q 2/2) · S-009 (to'g'ri izoh ≤60, «To'g'ri!» siz) · S-010 · S-015 (bashoratlar bitta o'lchov) · S-018 (Instagram, Burbn izohlari) · S-020 (ballik matnda atama glossasiz yo'q — «Umami», «hodisa» 9-Moduldan, arena 12) · S-021 · S-026 · S-027 · S-034 · S-040 ·
  PM-005 (2-tur) · PM-017 (namuna — bitta olam, rost) · PM-018 (Instagram — faqat bank qarori) · PM-028/029 · J-026 (hook ballsiz) · SABOQ 1–31 (A-bo'limda va har ekranda).
