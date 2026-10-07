# 11-Modul — quruvchi saboqlari (MAJBURIY)

> Har quruvchi/vizual agent topshirig'iga shu fayl qo'shiladi. Uch manba: (A) 9-Modul pilotlari · (B) 10-Modul pilot ko'rigi — foydalanuvchining qat'iy qoidalari;
> (C) 11-Modul MD lari va tashqi audit Filtrlari (`NN-FILTR.md`, tayanch 9-bo'lim) — quruvchiga tegishli kelishuvlar. Umumiy qonunga muhrlash — asosiy seansda.

## A va B. 9 va 10-Modul saboqlari — TO'LIQ o'qing

1. `feedback/F-1005-9modul/QURUVCHI_SABOQ.md` (1–18) va `feedback/F-1005-10modul/QURUVCHI_SABOQ.md` (A qisqasi, B, **C 19–31**) — ikkalasi ham shu modulga to'liq tegishli.
   10-Modul B qismidagi atamalar va kalitlar (`pm-m8dN-…`, «kutish holati») — O'SHA modulniki; bu modulda — tayanch 2 va 8 (pastda C).
2. Fidbek rasmlari `feedback/F-1005-10modul/rasm/F-1005-174-*`, `F-1005-175-*` — o'z ekran turingizga o'xshashini Read bilan ko'ring: foydalanuvchi aynan nimani «jonsiz», «ko'p element», «bo'sh ustun» degan.
3. Eng muhimlari (unutilsa — ekran RAD): navbatdagi harakat doim ko'rinadi (halqa + yengil puls) · bashorat tanlangach ixcham qator bo'lib qoladi · kartochkalar alohida ekran, Mentorsiz, «Kartani bosing — javob ochiladi» ·
   jonli ekran (kirishda navbat bilan, bosishda narsa uchadi, holat animatsiya bilan) · bo'sh ustun yo'q · ekranda ≤ 3 blok · yakuniy holat bitta natija bloki, 1280×800 ga sig'adi ·
   telefon maketi CHAPDA va o'lchami barqaror (≈170×272) · stilsiz element yo'q (`python3 feedback/F-1005-10modul/stilsiz.py <fayl>`) · har ekran «4 savol» (SABOQ 30).

## C. 11-Modul kelishuvlari

- **MD = manba-haqiqat.** O'quvchi ko'radigan har `uz` satr MD dan so'zma-so'z. «✎», «Harakat → Vizual o'zgarish», «KOD», «REPO», «TAYANCHGA SAVOL», «Shubhali joylar», «GATE M — o'z tekshiruvim» — ko'rsatma, ekranga chiqmaydi.
  «O'qituvchi eslatmasi» — faqat MD aytgan joyda (Mentor statistikasi / mentor ko'rinishi). Matn noqulay tuyulsa — o'zgartirmang, hisobotda «MD ga taklif» (SABOQ 15).
- **Atamalar** — `00-MODUL-TAYANCH.md` 2-bo'lim aynan (bir ma'no — bir so'z). Backend'li narsa — «ilova»; «jonli prototip» — faqat 7–9-darsdagi narsa; «Backend», «Database» (prozada «server», «baza» yo'q); «maxfiy kalit» («sir» yo'q).
  Taqiqlar — `00-TAQIQLAR.md`. Kafolat so'zlari («har doim», «darrov», «100%», «albatta») yo'q; xulosa «Bu misolda…», «Bu darsda…».
- **Saqlanadigan natija kalitlari** — tayanch 8 jadvali aynan (`pm-m9dN-…`; maydon nomlari ham). Boshqa dars o'qiydigan kalitni o'zgartirmang.
- **Hook javobi** — MD qanday desa: 1-dars `QKirish` sof so'rovnoma (J-026, maqtov yo'q). «Aynan!» / «Qiziq fikr!» qolgan joyda — kurs qonuni (T-028, T-067), olib tashlanmaydi.
- **PM keys brendi** (1-dars Starbucks): nom o'z rangida, logotipsiz, tanish maket, bosqich gapi Mentorda, sahna bosqichga qarab o'zgaradi (9-SABOQ 2, 3, 8; 10-SABOQ 26). Namuna — `src/6-Modull/PmLesson22.jsx` `AltairMock`, `PmLesson25.jsx` `DeckMock` (faqat ko'rish).
- **Amaliyot bloklari** (loyiha kunlari 10–14): `ScreenBlok` + `QBlok` + `QPrompt`; blok — **Mentor misoli** («Maydon Jamoa»), umumiy qolip emas (9.86); hammasi o'quvchining o'z repo'sida, tayyor skelet yo'q (Qaror-0 6).
  Prompt `{…}` joylari yonida kulrang «masalan: …» — `QPrompt` da `namuna` maydoni YO'Q: o'z faylingizda kichik o'rovchi bilan qiling, **`src/qolip` ga tegilmaydi**, hisobotda «qolip taklifi».
  Agentga yoziladigan prompt matni sen-formada (MD aynan) — `lint:til` ogohlantirishi kutilgan, error emas. Xato qatori: «xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas)» (9.81).
  «Ortda qoldingizmi» — `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-NN-done` (tayanch 3). Repo hali ochilmagan — ekranda faqat matn; quruvchi repo yaratmaydi, GitHub'ga hech narsa yubormaydi.
- **Trek** — `pm-m9d8-platforma` (`mobil` | `web`): MD dagi trek qatorlari; kalit yo'q bo'lsa — ikkala qator ham (M-q5 naqshi).
- **Skelet tuzoqlari** (10-Modul pilot topshirig'idagidek, o'z faylingizda hal qiling): test ustidagi «To'g'ri javobni tanlang» yo'q · `bashorat={!taxmin && …}` ishlatilmaydi ·
  `practice: ou(title)` → `ou(eyebrow)` · `QZ_BG_SHAPES` — darsning o'z atamalari, emoji va «Frontend/Backend» yo'q · `rgba(255,79,40,…)` → `fon(T.accent)` ·
  `QKod` o'ng ustun propi — 9-Modul 1-dars `QKOD_ONG` yechimi · global `.mentor` klassi bilan to'qnashmang (dars elementiga o'z nomi) · ⛶ (`Zoomable`) telefonda mazmunni yopmasin.
  LiveGate sarlavhasi — `tr(LESSON_META.lessonTitle)` (asosiy seans fayl nusxasida allaqachon tuzatgan).
- **Agent tuzog'i:** Write/Bash `\uXXXX` ni harfga aylantirishi mumkin — kirill/belgilarni to'g'ridan-to'g'ri yozing va `lint:prompt` / `gates` bilan tekshiring.

## D. 11-Modul pilot ko'rigidan (06.10, F-1006-270 · 1-dars, F-1006-271 · 10-dars) — foydalanuvchining 16 rasmli fidbeki, QAT'IY

Rasmlar: `feedback/F-1005-11modul/rasm/F-1006-270-1dars-01…14.png` — quruvchi O'QIYDI.

32. 🔴 **Halqa pulsatsiyasi yengil.** «Tebranish juda oshib ketibdi» — navbatdagi element halqasi: kattalashish ≤ 3% (scale 1 → 1.03), shaffoflik ≤ 0.35, sikl ≥ 2 s;
    bir guruhda (variantlar, tanlov chiplari) faqat BITTA halqa — guruh atrofida yoki birinchi elementda, har variantda alohida emas. `prefers-reduced-motion` — statik halqa.
33. 🔴 **Matnsiz bo'sh chiziqlar yo'q.** Reja/kirish vizualidagi «qator-skelet» — haqiqiy mazmun bilan (Mentor misolidagi nomlar), bo'sh kulrang chiziqlar RAD («barchasi bo'sh turadimi»).
34. 🔴 **Yashirin bosish yo'q.** Keyingi qadam faqat kichik chip/yorliqni bosib ochiladigan bo'lsa — o'quvchi to'xtab qoladi («o'tolmadim»). Ketma-ket qadamlar o'zi ochiladi
    yoki katta, halqali tugma sahnaning o'zida turadi va Mentor aynan shuni aytadi.
35. 🔴 **Chap va o'ng bog'lanishi ko'rinsin.** Ikki ustunning vazifasi har xil bo'lsa (manba ↔ natija), ular orasida ko'rinadigan bog'lanish: bir xil belgi, uchish chizig'i, mos rang.
36. 🔴 **Odamlar real ko'rinishda.** Sahnadagi odam — tayoqcha/quti siluet emas: bosh, soch, yuz belgisi, rangli kiyim, qo'lida narsa (stakan, telefon); iliq ranglar. Keys sahnasi jonli (Starbucks 3-bosqich — namuna, foydalanuvchiga yoqdi).
37. 🔴 **Kod tekshiruvi ma'lumotga bog'lanmaydi.** Shart o'quvchi o'zgartirishi mumkin bo'lgan massivdan emas, o'z namuna obyekti bilan funksiyani chaqirib tekshiradi
    (`qatorlar({ muammo: "a", kim: "b", yechim: "" })`); boshlang'ich kod qatorlari ≤ 70 belgi — har kalit ko'rinadi (gorizontal skroll yo'q); shart yiqilsa — nima yetishmayotgani aytiladi.
38. 🔴 **⛶ ishlaydi.** Faylda `.zoom-on { position: fixed; … }` qoidasi bo'lishi shart (skeletda yo'q edi — F-1006-271); ⛶ ni bosib, kattalashganini surat bilan tekshiring.
39. **«Ortda qoldingizmi» — darsda bir marta** (birinchi blokda); keyingi bloklarda takrorlanmaydi (F-1006-271).
