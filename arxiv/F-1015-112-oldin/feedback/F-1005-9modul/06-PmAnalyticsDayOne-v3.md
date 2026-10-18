# 9-Modul · 6-dars (PM + amaliyot) «Birinchi odam kirganda nimani ko'rasiz?» — MD v3

Fayl: `src/7-Modull/PmAnalyticsDayOneLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m7-06` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; GATE M P-q0 + F-1005-88) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 4-ekran — **C** (`correctIdx 2`) · 8-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — PM qismi ≈ 20 (0–5-ekran) · A1 ≈ 22 · A2 ≈ 22 (o'z g'oyasi qadami bilan) · yakun ≈ 15 (yakuniy savol, podium, kartochkalar, arena).
Tuzilma (GATE M P-q0, 05.10): PM+PRAKT — 12 ekran: PM nazariya 0–5 → A1 · A2 → yakuniy savol · podium · kartochkalar · yakun (F-1005-88: kartochka alohida ekran, foydalanuvchi qarori 05.10). Eski 3-ekran testi va 7-ekran mustaqil ishi olindi (mustaqil ish — A2 5-qadamida).
Menyu nomi (DE-205): App.jsx `m7-06` — «Birinchi odam kirganda nimani ko'rasiz?» · oldingi `m7-05` «Animatsiya: interfeys javob beradi» · keyingi `m7-07` «Loyiha kuni: MVP — birinchi ekran».
Manba: `00-MODUL-TAYANCH.md` (misol-ip, repo, hodisa `vaqt-tanladi`, teg `dars-06-done`) · `GATE_M_JAVOB.md` (qaror 5 — Umami, 7 — juftlik, 8 — blok oxiridagi qadam) · Umami — rasmiy hujjat va manba kodi (05.10.2026 tekshirildi, pastda «Manbalar»).

---

Tashqi audit (ChatGPT) Filtri: `06-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Bitta natija (dastur: «birinchi foydalanuvchidan oldin analitika ulangan»).** Dars oxirida o'quvchining kompyuteridagi `maydon` repo'sida Umami ulangan:
   saytning ochilishi o'zi yoziladi, bo'sh vaqt katagi bosilganda `vaqt-tanladi` hodisasi yoziladi. Namuna — teg `dars-06-done`. Birinchi «odam» — sherigi (A2).
2. **Bugungi asosiy fikr (P-013):** Bizning MVP da analitika birinchi odamdan oldin ulanadi — shunda qaysi qadamdan keyin son keskin kamayganini ko'rasiz.
3. **Atamalar (bir ma'no — bir so'z, T-014):**
   - **analitika** — odamlar saytda nima qilganini yozib, sanab beradigan asbob. 2-ekranda harakatdan KEYIN tug'iladi (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z shu (T-042).
     Sarlavhada — 3-ekrandan boshlab.
   - **hodisa** — analitikaga yoziladigan bitta harakat (tayanch ta'rifi). 5-ekranda saralashdan keyin tug'iladi. Kod ichida — event (`data-umami-event`).
     Nom qoidasi: kichik harf, so'zlar chiziqcha bilan, o'tgan zamon fe'li — `vaqt-tanladi`, `band-qildi` (tayanch).
   - **uch qadam** — «Maydon»da: **Saytni ochdi → Vaqtni tanladi → Band qildi** (GATE M M-q3). O'quvchi matnida faqat «uch qadam»:
     «zanjir» lug'atda boshqa ma'noda band (`zanjir-streak`, MATN_ETALONI 205) va bir ma'noga ikki nom bo'lmaydi. Ustun yorliqlari dars bo'yi aynan shu uch shakl.
   - **Umami** — saytda odamlar nima qilganini yozib boradigan xizmat. Brend izohi bir marta — Reja Mentorida (S-018). Xizmat: Umami Cloud (`cloud.umami.is`).
   - **skript** — Umami bergan bir qator kod (A1 1-qadamida, harakat bilan birga).
   - **Takror — qayta o'rgatilmaydi, o'sha so'zlar bilan:**
     **bosh raqam** — o'z ishini bajarganini sanaydigan raqam (m5-14; «Maydon»da — band qilganlar) ·
     **foydalanish boshlangani / ish oxirigacha yetgani** (m6-14; Saytni ochdi / Band qildi) ·
     **hisobda yozilmagan kun bo'sh qoladi** (m5-11: «Hisobda bundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani 0») ·
     **o'lchagich** — sayt ochilyaptimi, shuni o'lchaydi (m4c-06; faqat kartochka va arenada — analitikadan farqi uchun).
   - **Ishlatilmaydi:** «kuzatish / kuzatuv» analitika ma'nosida (modulda bu — sinovning so'zi, 10-dars «kuzating», T-015) · «voronka / funnel» (chuqur mavzu — «Analitika amalda» darsida) ·
     «event» prozada · «o'lchagich» analitika ma'nosida · «baza» (Database) · vaqt katagining inglizcha nomi.
   - Modul atamalari (tayanch, aynan): sayt · Backend · Database · vaqt katagi · band qilish · band · maydon egasi · agent (Antigravity).
4. **Metafora yo'q.**
5. **Misol raqamlari — mashq uchun o'ylab topilgan, real statistika emas** (manba yo'q; matnda «bu misolda», T-043). Birinchi kun: 12 · 9 · 2. Besh kun — `KUNLAR` (pastda).
   Har kuni eng ko'p odam 2-qadamdan keyin to'xtaydi — 10–11-darsdagi sinov topilmasi («Band qilish» tugmasi forma ostida, ko'rinmaydi) bilan bir yo'nalishda. → TAYANCHGA SAVOL 1.
5a. **Uch xil son (audit 1–2).** Mashqda har odam har qadamda bir marta sanaladi — shuning uchun «7 to'xtadi» deyiladi (2-ekranda aytiladi). Real Umami'da sonlar har xil sanaladi:
   1-qadam — sahifa ochilishlari (Views; alohida tashrifchilar — Visitors), 2-qadam — har bosish (`vaqt-tanladi`; bir odam bir necha marta bosishi mumkin), 3-qadam — Database'dagi bandlar.
   Ularni bir-biridan ayirib «N odam to'xtadi» deyilmaydi — faqat katta pasayish belgisi. Analitika «qayerda?» ga javob beradi, «nega?» ga — 10-darsdagi sinov.
6. **Toza yuza (185, D4):** tugma, variant, karta, yorliqda emoji yo'q; odam-belgilari CSS doira; Umami maketi chizilgan, logotipsiz. O'yin qatlami (arena, nishon medali, podium) — mustasno.
7. **Kod yozish — Antigravity** (173). Prompt faqat *qayerda · nima qilsin · nima buzilmasin* (173.4); Antigravity'ga gap sen-formada (T-002).
   Xato yo'li — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»

## Darsning ipi va bitta vizual

- **Ip:** «Maydon» ishga tushgan kun. Hook'da o'quvchi birinchi odam bo'lib vaqtni tanlaydi va chiqib ketadi — sayt hech narsa yozmagan, band 0 →
  2-ekran: shu kun yozilganda ko'rinadi — qaysi qadamda to'xtashdi → 3-ekran: kech ulangan kun — to'xtaganlarning izi yo'q →
  5-ekran: qaysi qadamni Umami avtomatik yozadi, qaysisiga nom beriladi →
  A1/A2: o'z kompyuterida «Maydon»ga Umami ulanadi, birinchi «odam» — sherigi — yoziladi. Hook savoliga javob — A2 xulosasi.
- **Bitta vizual — Maydon paneli (`MaydonPanel`, dars bo'yi, 163/180):**
  - chapda kichik sayt maketi (telefon ramkasi, 191): sarlavha «Maydon · Shanba», 6 vaqt katagi `16:00` … `21:00`; `17:00` va `20:00` — band (to'q), qolgani bo'sh.
    Bosilgan bo'sh katak 5-dars animatsiyasi bilan kichrayib qaytadi va tanlanadi (accent). Ostida kichik «×» — saytdan chiqish.
  - o'ngda uch ustun — **Saytni ochdi · Vaqtni tanladi · Band qildi**; har ustunda son va odam-belgilari (kichik doiralar).
    Ustun holati: «?» kulrang (yozilmagan) → son (yozildi) → joriy (accent chegara). 3-ustun ostida doimiy kichik yorliq «Database'dan» — band analitikasiz ham saqlanadi.
  - ustunlar orasidagi ikki oraliq — tanlansa qizil chiziq va yorliq «N to'xtadi»; to'xtagan odam-belgilari o'z ustuni ostida kulrang qoladi.
  - qo'shimcha holatlar (o'sha komponent): kun tasmasi «1-kun … 5-kun» (3-ekran; yozilmagan kun — uzuq chiziqli bo'sh katak, U-041) ·
    ustun ostidagi yorliq «Avtomatik yoziladi» / mono `vaqt-tanladi` / qulf «band qilish qurilgach» (5-ekran) · o'quvchi yozgan qadamlar (A2 5-qadam).
  - Ishlatiladi: 0 · 1 · 2 · 3 (kichik) · 4 · 6 · 7. `prefers-reduced-motion` da belgilar yurmaydi — sonlar birdan qo'yiladi.
  - Bloklarda o'ng tomon — **Umami maketi** (`UmamiMock`: «Maydon · localhost» · Visitors · Visits · Views; «Events» ro'yxati) — panelning 1–2-ustuni bilan bitta manbadan (A1/A2 va 8-ekran).
- **`KUNLAR`** (bitta manba, 180; Saytni ochdi · Vaqtni tanladi · Band qildi): 1-kun 12 · 9 · 2 · 2-kun 10 · 8 · 2 · 3-kun 8 · 6 · 1 · 4-kun 9 · 7 · 2 · 5-kun 11 · 8 · 3.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon» ishga tushdi
- Sarlavha: **Birinchi odam kirganda nimani ko'rasiz?** (39) — dars nomi (DE-205)
- Mentor: «Maydon» ishga tushgan kunni tasavvur qiling. Maketda bitta bo'sh vaqtni tanlang va saytdan chiqing.
- Maket (chap): Maydon paneli — telefon maketi faol; ustunlar: Saytni ochdi «?» · Vaqtni tanladi «?» · Band qildi «0 · Database'dan».
- **Harakat → Vizual o'zgarish:** bo'sh katakni bosish (masalan `18:00`) → katak kichrayib qaytadi va tanlanadi; «×» bosish → telefon maketi xiralashadi.
  Panelda hech narsa o'zgarmaydi: ikki ustun «?» qoladi, band 0 — ustunlar bir lahza miltillaydi (bo'sh). Shundan keyin variantlar ochiladi.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Qaysi qadamda chiqib ketganini (30)
  - Hech narsani — u band qilmadi (29)
- Javob (ikkalasida bir xil, maqtovsiz — J-026, P-016): Ikkalasi ham bo'lishi mumkin. Sayt uning qadamlarini yozib borsa — birinchisi, yozmasa — ikkinchisi. (100)
- Javobdan keyin: 1–2-ustun atrofida uzuq chiziqli ramka — bugun yoziladigan joy (U-041).
- Ballsiz (J-026: `correct: false` hammaga). Jonli darsda — sinf ovozlari chizig'i. Tugma: Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun «Maydon» har odamning qadamlarini yozib boradi.** (53)
- Mentor: Umami — saytda odamlar nima qilganini yozib boradigan xizmat. Kodni Antigravity yozadi, siz har qadamni Umami'da tekshirasiz.
- Chap — «Dars oxirida — o'z kompyuteringizda shunday»: Maydon paneli o'zi o'ynaydi (DE-200) — odam-belgisi saytni ochadi → «Saytni ochdi 1»;
  `18:00` tanlanadi → «Vaqtni tanladi 1»; 3-ustun kulrang «?».
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015):
  - 01 · Qaysi qadamdan keyin son keskin kamayishini topasiz · `uch qadam`
  - 02 · Kech ulansa nima yo'qolishini ko'rasiz · `birinchi kun`
  - 03 · «Maydon»ga Umami'ni ulaysiz · `Umami`
  - 04 · Vaqt tanlashni ham yozdirasiz · `hodisa`
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-05-done` · tayyor namuna `dars-06-done`
- Harakat yo'q (reja ekrani) — vizual o'zi o'ynaydi. Tugmalar: Orqaga · Boshlaymiz

## 2 · Qaysi qadamda to'xtadi  ← QTushuncha
- Eyebrow: Tushuncha · uch qadam
- Sarlavha: **Birinchi kuni odamlar qaysi qadamda to'xtadi?** (45)
- Mentor: Ochish — foydalanish boshlangani, band qilish — ish oxirigacha yetgani. Kunni boshlang va o'rtada nima bo'lganini ko'ring.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Ko'pchilik qaysi qadamdan keyin to'xtagan?** · Saytni ochgandan keyin · Vaqtni tanlagandan keyin — tanlov saqlanadi.
- Vizual: Maydon paneli, ustunlar 0 · 0 · 0 (bu kunni sayt yozib borgan).
- **Harakat → Vizual o'zgarish:**
  1. «Kunni boshlang» → 12 odam-belgisi birin-ketin telefon maketidan o'tadi, har biri o'z qadamigacha boradi: ustunlar 12 · 9 · 2 ga o'sadi;
     to'xtaganlar o'z ustuni ostida kulrang qoladi (1-ustun ostida 3, 2-ustun ostida 7).
  2. Bitta qator (`QIzoh`): Bu mashqda har odam har qadamda bir marta sanaladi: ikki ustun farqi — o'sha qadamda to'xtaganlar. (98)
     O'quvchi oraliqni bosadi:
     - to'g'ri (Vaqtni tanladi → Band qildi) → oraliq qizil, yorliq «7 to'xtadi», 7 kulrang belgi bir lahza yonadi;
     - boshqasi (Saytni ochdi → Vaqtni tanladi) → yorliq «3 to'xtadi» qoladi, oraliq silkinadi, `QXato`: Bu yerda 3 odam to'xtadi — ko'prog'i qayerda? (45)
  3. Joriy qator (bitta, oraliq topilgach): Odamlar saytda nima qilganini yozib, sanab beradigan asbob **analitika** deyiladi. (78)
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: vaqtni tanlagandan keyin» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda eng katta pasayish — vaqt tanlashdan keyin. Analitika muammo qayerdaligini aytadi, sababini emas. (109)
- Tugadi (199): tugma paneli yopiladi, panel butun enga chiqadi; vizual ⛶ ichida (q17).
- Tugma (pastki): Kunni boshlang → Oraliqni tanlang → Davom etish
- Nishon: Drop Spotter — birinchi tanlovda to'g'ri oraliq.
- O'qituvchi eslatmasi: «Nega band qilmadi?» savolini ochiq qoldiring — raqam buni aytmaydi; sababni odamning o'zini ko'rib topasiz (sinov darsi). Xulosadagi «sababini emas» shunga.
  Real Umami'da sonlar boshqacha sanaladi (A-5a) — u yerda farq «N odam» emas, pasayish belgisi.

## 3 · Kech ulash  ← QTushuncha
- Eyebrow: Tushuncha · birinchi kun
- Sarlavha: **Analitikani kech ulasangiz, kimning izi yo'qoladi?** (50)
- Mentor: Hisobda yozilmagan kun bo'sh qoladi — buni «Kecha kelgan odam bugun ham keldimi?» darsida ko'rgansiz. Umami'ni qaysi kuni ulashni o'zingiz tanlang.
- Bashorat (ballsiz, zinapoya — S-015, KORPUS §43): **Umami 4-kuni ulansa, besh kundan nechtasi yoziladi?** · Bittasi · Ikkitasi · Beshtasi — tanlov saqlanadi.
- Vizual: Maydon paneli + kun tasmasi «1-kun … 5-kun»; panelda 1-kun.
- **Harakat → Vizual o'zgarish:** ulash kuni — ikki tugma: «4-kuni» · «1-kundan oldin» (ikkalasi ham ko'riladi):
  - «4-kuni» → tasmada 1–3-kun bo'sh (uzuq chiziq), 4–5-kun yoziladi; panelda 1-kun: Saytni ochdi «?» · Vaqtni tanladi «?» · Band qildi «2 · Database'dan» —
    to'xtagan 10 odamning belgisi o'chib ketadi;
  - «1-kundan oldin» → beshala kun yoziladi; panelda 1-kun: 12 · 9 · 2, to'xtaganlar o'z ustuni ostida kulrang.
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: ikkitasi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Analitika ulangan kundan boshlab yozadi. Birinchi kunlarda to'xtaganlarning izi qolmaydi. (89)
- Tugadi (199): tugmalar yopiladi, panel va tasma «1-kundan oldin» holatida fokusga; vizual ⛶ ichida.
- Tugma (pastki): Ikkala kunni tanlang (N/2) → Davom etish
- O'qituvchi eslatmasi: band qilganlar Database'da baribir qoladi (`bandlar` jadvali) — yo'qoladigani aynan to'xtab ketganlar. Shuni panelda ko'rsating, gapirib bermang.

## 4 · 1-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · qachon ulanadi
- Savol: **«Maydon»ga hali hech kim kirmagan. Umami'ni qachon ulaysiz?** (8 so'z)
  - A — Band qilish to'liq ishlagandan keyin (36)
  - B — Saytga yuzta odam kirgandan keyin (33)
  - ✔ C — Hozir, birinchi odam kelmasdan oldin (35)
  - D — Birinchi shikoyat kelgandan keyin (33)
- To'g'ri izohi: Ulangan kundan oldingi odamlar yozilmaydi — birinchilari ham.
- Xato izohlari (≤60):
  - A: Band qilish qurilguncha ochganlar yozilmay qoladi. (50)
  - B: Birinchi yuzta odamning izi qolmaydi. (37)
  - D: Shikoyat qilmay ketganlar hech qayerda yozilmaydi. (50)
  - (umumiy) Analitika faqat ulangan kundan boshlab yozadi. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Day One — birinchi urinishda to'g'ri.

## 5 · Kim nimani yozadi  ← QTushuncha (saralash)
- Eyebrow: Tushuncha · hodisa
- Sarlavha: **Umami qaysi qadamni o'zi yozadi?** (32)
- Mentor: Sahifa ochilishi hamma saytda bir xil, vaqt katagi esa faqat «Maydon»da bor. Har qadamni o'z tomoniga qo'ying.
- Vizual: Maydon paneli; uch qadam-karta (ustun nomlari) panel ustida, aralash tartibda; ikki tomon-yorliq: «Avtomatik yoziladi» · «Nom berasiz».
- **Harakat → Vizual o'zgarish:** qadam-kartani bosib, tomonni bosish (yoki sudrash) → to'g'ri bo'lsa karta o'sha tomonga kiradi VA maket o'zgaradi:
  - Saytni ochdi → «Avtomatik yoziladi»: 1-ustun yashil, ostida «Avtomatik yoziladi»; telefon maketi ochilganda 1-ustunga +1 o'zi qo'shiladi.
  - Vaqtni tanladi → «Nom berasiz»: maketdagi bo'sh katak ustida mono yorliq `data-umami-event="vaqt-tanladi"` paydo bo'ladi; katak bosilsa 2-ustunga +1.
  - Band qildi → «Nom berasiz»: 3-ustun ostida mono `band-qildi` va qulf «band qilish qurilgach» — maketda band qilish tugmasi hali yo'q (kulrang).
  Noto'g'ri tomon → karta silkinib qaytadi, bitta qator (`QXato`):
  - ochilish «Nom berasiz»ga: Sahifa ochilishini Umami avtomatik yozadi — nom kerak emas. (46)
  - tanlash yoki band «Avtomatik yoziladi»ga: Umami katakni tanimaydi — unga nom kerak. (41)
- 3/3 da joriy qator (atama — saralashdan keyin, bir marta): Analitikaga yoziladigan bitta harakat **hodisa** deyiladi. (54)
- Xulosa: Sahifa ochilishini Umami avtomatik yozadi. Vaqt tanlash hodisasiga esa nomni siz berasiz. (76)
- Tugadi (199): kartalar yopiladi, panel uch yorlig'i bilan butun enga.
- Tugma (pastki): Uch qadamni joylang (N/3) → Davom etish
- O'qituvchi eslatmasi: `band-qildi` bugun ulanmaydi — band qilish «Loyiha kuni: MVP tayyor» darsida quriladi, hodisa o'sha kuni qo'shiladi (tayanch). Bugun bitta hodisa.

## A1 · Amaliyot 1 — Umami'ni ulash  ← amaliyot bloki (≈22 daq; `screens[6]`)
- Eyebrow: Amaliyot 1 · Umami
- Sarlavha: **«Maydon» har ochilishni Umami'ga yozsin.** (40)
- Mentor: Birinchi odam kelishidan oldin ulaymiz, uning izi ham qolsin; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — `cloud.umami.is` da ro'yxatdan o'ting (ism, email, parol). «Websites» → «Add website»: Name — `Maydon`, Domain — `localhost` → «Save».
     «Maydon» yonidagi «Edit» → «Tracking code»: Umami bergan bir qator kodni — skriptni — nusxalang.
  2. **Prompt** — Antigravity'da `maydon` papkasini oching. Qavs ichiga skriptni qo'ying, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > `web/index.html` ning `<head>` qismiga Umami skriptini qo'sh: **{Umami bergan skript}**.
     > Skriptda `data-website-id="%VITE_UMAMI_ID%"` bo'lsin — qiymat `web/.env` dagi `VITE_UMAMI_ID` dan keladi; `web/.env.example` ga bo'sh `VITE_UMAMI_ID=` qatorini qo'sh.
     > Kataklar va animatsiyalar o'zgarmasin.
  3. **Ishga tushirish** — `web/.env` da `VITE_UMAMI_ID=` dan keyin qiymat turibdi. Bu ID maxfiy emas — `.env` da turishining sababi: u har o'quvchida boshqa. Terminalda `cd web`, keyin `npm run dev`.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Umami'da tekshirish** — brauzerda `localhost:5173` ni oching. Umami'da «Maydon» sahifasida «Views» (sahifa ochilishlari) soni oshdi.
     0 qolsa — brauzerdagi reklama to'sgich (AdBlock kabi) skriptni to'smaganini tekshiring: shu sahifa uchun o'chirib, sahifani yangilang.
  5. **O'z g'oyangiz** — Umami'da «Add website» bilan loyihangiz uchun yana bitta sayt qo'shing. Uning skriptini shu promptning qavsiga qo'yib, «Nusxalash» —
     promptni saqlab qo'ying, uyda o'z loyihangizga yuborasiz.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (`UmamiMock`, chizilgan, logotipsiz):
  - Maydon · localhost
  - Visitors 1 · Visits 1 · Views 1
  - ostida Maydon panelining 1-ustuni: Saytni ochdi 1 (Views dan; bitta manba)
- Hammasi bajarilgach (yashil): «Maydon» ochilishi Umami'ga yozildi — birinchi odam kelsa, u ham yoziladi. (74)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-06-start` (TAYANCHGA SAVOL 3)
- Nishon (bonus): Tracker On — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: darsdan oldin `cloud.umami.is/signup` ochilishini va «Add website» → «Edit» → «Tracking code» yo'li hozirgi Umami'da shundayligini tekshiring (P-028).
  Akkauntni har o'quvchi o'zi ochadi; ocholmasa — Mentor akkauntiga uning sayti qo'shiladi (GATE M M-q8).
✎ yangi blok. Namuna AvtoPizza emas — «Maydon» (tayanch 3-bo'lim, qaror 8). Website ID `web/.env` da: `dars-06-done` tegi hammaga bir xil, ID esa har kimniki boshqa (TAYANCHGA SAVOL 2).

## A2 · Amaliyot 2 — `vaqt-tanladi` hodisasi  ← amaliyot bloki (≈22 daq; `screens[7]`)
- Eyebrow: Amaliyot 2 · hodisa
- Sarlavha: **Vaqt tanlash ham Umami'ga yozilsin.** (35)
- Mentor: Vaqt katagiga nom beramiz — shunda har tanlov sanaladi; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — terminalda `npm run dev` ishlayapti, Umami'da «Maydon» ochiq.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `web/` dagi vaqt katagi: bo'sh katak bosilganda Umami'ga `vaqt-tanladi` hodisasi yozilsin.
     > Band katak bosilganda hodisa yozilmasin.
     > Umami yuklanmasa ham katak ishlayversin; animatsiyalar o'zgarmasin.
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Sherigingiz bilan tekshirish** — sherigingiz kompyuteringizda «Maydon»ni ochib, bitta bo'sh vaqtni tanlasin. Umami'da «Events» (hodisalar) bo'limida `vaqt-tanladi` — 1.
     Band katakni bosing — son o'zgarmaydi.
  5. **O'z g'oyangiz** — loyihangizda odam qaysi uch qadamni bosib o'tadi? Oxiridan boshlang: odam nima qilsa, loyihangiz o'z ishini bajargan bo'ladi — bu darsda shuni bosh raqam deb olamiz.
     O'rtadagi qadamni va uning hodisa nomini (kichik harf, so'zlar chiziqcha bilan, 50 belgigacha) qavslarga yozing, «Nusxalash» — uyda yuborasiz.
     Tekshiruv (yo'naltiradi): «ochdi» — Sahifa ochilishi avtomatik yoziladi — boshqa qadamni yozing. · nomda bo'sh joy yoki katta harf — Nomni kichik harf va chiziqcha bilan yozing.
     > Saytda **{o'rtadagi qadam}** tugmasi bosilganda Umami'ga **{hodisa nomi}** hodisasi yozilsin.
     > Umami yuklanmasa ham tugma ishlayversin; boshqa tugmalar o'zgarmasin.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (`UmamiMock`, «Events»):
  - Events
  - `vaqt-tanladi` · 1
  - ostida Maydon panelining 1–2-ustuni: Saytni ochdi 1 · Vaqtni tanladi 1
- Qator (`QIzoh`, natija ostida; audit 1): Real Umami'da sonlar har xil sanaladi: ochilish, bosish, Database'dagi band. Ularni ayirmang — pasayishni ko'ring. (113)
- Hammasi bajarilgach (yashil): Endi birinchi odamning ikki qadami ko'rinadi: saytni ochdi va vaqtni tanladi. (77)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-06-done` — `web/.env` o'zgarmaydi.
- Nishon (bonus): First Event — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: sherik sizning kompyuteringiz va brauzeringizda ochsa, «Visitors» o'zgarmasligi mumkin — Umami odamni brauzer va qurilma belgilaridan sanaydi
  (rasmiy «Metric definitions»). Tekshiruv shuning uchun «Events» soniga qaraydi.
✎ yangi blok. Hook savoliga javob shu yerda: birinchi odam (sherik) kirganda uning ikki qadami ko'rinadi.

## 8 · 2-savol  ← QTest (✔ B, `correctIdx 1`; yakuniy — ikki blok birga)
- Eyebrow: Yakuniy tekshiruv
- Savol ustida kichik `UmamiMock`: Visitors 6 · Events — `vaqt-tanladi` 0.
- Savol: **Ochilish yozilyapti, vaqt tanlash — yo'q. Nimani tekshirasiz?** (8 so'z)
  - A — Umami skripti `<head>` da turganini (33)
  - ✔ B — Katakda hodisa nomi borligini (29)
  - C — Reklama to'sgichi o'chiqligini (30)
  - D — Band qilish tugmasi borligini (29)
- To'g'ri izohi: Ochilish yozilyapti — skript ishlayapti; demak hodisa nomi yetmaydi.
- Xato izohlari (≤60):
  - A: Skript bo'lmasa, ochilish ham yozilmasdi. (41)
  - C: To'sgich ishlasa, ochilish ham yozilmasdi. (42)
  - D: Vaqt tanlash band qilishdan oldin — tugma bu yerda emas. (56)
  - (umumiy) Nima yozilyapti, nima yo'q — shuni solishtiring. (48)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 4 — Umami qachon ulanadi · 8 — Hodisa yozilmadi

## 10 · Takrorlash  ← QKartochka (alohida ekran — F-1005-88, foydalanuvchi qarori 05.10)
- Sarlavha: O'zingizni sinab ko'ring.
- 12 karta — «Kartochkalar» jadvali.
- Mentor yo'q (KORPUS §61). Karta ostida, birinchi bosishgacha: Kartani bosing — javob ochiladi · karta yuzi halqada (F-1005-91 B).
- Tugmalar: Orqaga · Yakunlash → (platforma shakli)

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha: **Analitika tayyor: birinchi foydalanish ham yoziladi.** (50)
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Analitika odamlar saytda nima qilganini yozib, sanab beradi.
  - Analitika ulangan kundan boshlab yozadi — bizning MVP da u birinchi odamdan oldin ulanadi.
  - Qadamlar sonini solishtirib, qayerda katta pasayish borligini ko'rasiz — bu belgi, sabab emas.
  - Sahifa ochilishini Umami avtomatik yozadi; boshqa harakat — siz nom bergan hodisa.
- Bugungi asosiy fikr (ScoreRing ostida, `small`, kartochkaga qo'shilmaydi — P-013): Bizning MVP da analitika birinchi odamdan oldin ulanadi — shunda qaysi qadamdan keyin son keskin kamayganini ko'rasiz. (96)
- Uyga vazifa (`HwCard` yakun ekranida — alohida `.homework.jsx` yo'q, GATE M M-q9) · sarlavha: **Uyda nima qilasiz?**
  - Kim uchun: o'z loyihangiz · Nechta: 1 hodisa · Muddat: keyingi darsgacha
  - 1 · Loyihangiz sahifasiga Umami skriptini ulang — Amaliyot 1 da saqlagan prompt bilan.
  - 2 · Uch qadamingizdagi o'rtadagi qadamga hodisa qo'shing — Amaliyot 2 da saqlagan prompt bilan.
  - 3 · Uydagi bir odam saytingizda o'sha tugmani bossin — «Events»da hodisa paydo bo'lsin.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: MVP — birinchi ekran». Talabni siz yozasiz, agent birinchi ekranni quradi. Umami bugundan uning har ochilishini yozadi.
- Kartochkalar (10-ekran «Takrorlash» uchun, `QKartochka`):

| Old tomon | Orqa | Izoh |
|---|---|---|
| Analitika nima? | Odamlar saytda nima qilganini yozib, sanab beradigan asbob | Masalan, Umami |
| Hodisa nima? | Analitikaga yoziladigan bitta harakat | Masalan, `vaqt-tanladi` |
| «Maydon»ning uch qadami qaysi? | Saytni ochdi → Vaqtni tanladi → Band qildi | Bu darsda oxirgisi — bosh raqam |
| Qadamlar sonidan nimani bilasiz? | Qayerda katta pasayish borligini | Bu — belgi, sabab emas (real sonlar har xil sanaladi) |
| Bizning MVP da analitika nega birinchi odamdan oldin ulanadi? | U ulangan kundan boshlab yozadi | Oldingi odamlarning izi qolmaydi |
| Analitikasiz kunda nima ma'lum? | Faqat Database'dagi bandlar | To'xtab ketganlar hech qayerda yo'q |
| Sayt ochilishini kim yozadi? | Umami skripti o'zi | Nom berish shart emas |
| Vaqt tanlashni Umami qanday biladi? | Katakdagi hodisa nomidan | `data-umami-event="vaqt-tanladi"` |
| Website ID maxfiymi? | Yo'q — u sahifa kodida ochiq turadi | `web/.env` da turadi, chunki har kimniki boshqa |
| O'lchagich va analitika — farqi nima? | O'lchagich sayt ochilyaptimi, shuni o'lchaydi; analitika odam nima qilganini yozadi | Ikkalasi ham sizsiz ishlaydi |
| Umami'da hech narsa chiqmasa, avval nima qilasiz? | Reklama to'sgichini shu sahifa uchun o'chirasiz | Reklama to'sgich skriptni to'sishi mumkin |
| Analitika odam nega to'xtaganini aytadimi? | Yo'q — qaysi qadamda to'xtaganini aytadi | Sababni odamning o'zini ko'rib topasiz |

- Nishonlar — pastda (mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Drop Spotter!** — Ko'p odam to'xtagan qadamni birinchi urinishda topdingiz (2)
- **Day One!** — Umami qachon ulanishini birinchi urinishda topdingiz (4)
- **Tracker On!** — «Maydon»ga Umami'ni uladingiz (A1, oxirgi «Bajardim» — bonus, P-048: ish bajarilgan)
- **First Event!** — Birinchi hodisangiz Umami'ga yozildi (A2, oxirgi «Bajardim» — bonus)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida raqam 1/2/3, kodli kartada koddan qator)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

- **4 · Qachon ulanadi** — 1 Analitika ulangan kundan boshlab yozadi. · 2 Undan oldingi kunlar bo'sh qoladi: ochib ketganlarning izi yo'q. ·
  3 Band qilganlar Database'da qoladi, to'xtaganlar esa faqat analitikada ko'rinadi.
  - Sinfga savol: Sayt bir hafta Umami'siz ishladi. O'sha haftadan nimani bilamiz?
- **8 · Hodisa yozilmadi** — 1 `<script defer src="…" data-website-id="…">` · Skript sahifa ochilishini avtomatik yozadi. ·
  2 `data-umami-event="vaqt-tanladi"` · Katak bosilishini shu nom yozadi. · 3 Ochilish bor, hodisa yo'q · Skript ishlayapti — katakdagi nomni tekshiring.
  - Sinfga savol: Umami'da ochilish ham, hodisa ham 0. Avval nimani tekshirasiz?

## Jonli viktorina — 12 savol (✔ o'rni: A·B·C·D ×3 — 1A 2B 3C 4D 5A 6B 7C 8D 9A 10B 11C 12D)
1. Analitika saytda nimani yozib boradi?
   - ✔ A — Odamlar saytda nima qilganini (29)
   - B — Sayt necha soniyada ochilishini (31)
   - C — Kodda qancha xato qolganini (27)
   - D — Saytni kim va qachon qurganini (29)
2. Umami 4-kuni ulandi. 1-kundan nima ma'lum?
   - A — Hamma qadam, faqat kechikib keladi (34)
   - ✔ B — Faqat Database'dagi bandlar (27)
   - C — Faqat saytni ochganlar soni (27)
   - D — Hech narsa — bandlar ham o'chgan (32)
3. «Maydon»ning uch qadami qaysi tartibda?
   - A — Band qildi → Vaqtni tanladi → Saytni ochdi
   - B — Vaqtni tanladi → Saytni ochdi → Band qildi
   - ✔ C — Saytni ochdi → Vaqtni tanladi → Band qildi
   - D — Saytni ochdi → Band qildi → Vaqtni tanladi (strelka hammasida — bir uzunlik 42)
4. 10 odam ochdi, 8 tasi vaqt tanladi, 1 tasi band qildi. Son qayerda keskin kamaydi?
   - A — Sahifa ochilgandan keyin (24)
   - B — Band qilib bo'lgandan keyin (26)
   - C — Saytni ochishdan ham oldin (26)
   - ✔ D — Vaqtni tanlagandan keyin (24)
5. Analitikaga yoziladigan bitta harakat nima deyiladi?
   - ✔ A — Hodisa
   - B — Metrika
   - C — Bosh raqam
   - D — Sinov
6. Saytning ochilishini Umami qanday yozadi?
   - A — Har sahifaga hodisa nomi qo'shiladi (35)
   - ✔ B — Skript ulangach, o'zi yozib boradi (34)
   - C — Maydon egasi qo'lda kiritib boradi (34)
   - D — Faqat band qilinganda yozib qo'yadi (35)
7. Bugun nega faqat bitta hodisa qo'shildi?
   - A — Umami bittadan ortig'ini olmaydi (32)
   - B — Ochilish ham nom kutib turadi (29)
   - ✔ C — Band qilish hali qurilmagan (27)
   - D — Bitta hodisa hamma qadamni yozadi (33)
8. «Kun almashtirish» hodisasiga qaysi nom darsdagidek?
   - A — `Kun Almashtirdi`
   - B — `kun almashtirdi`
   - C — `KUN_ALMASHTIRDI`
   - ✔ D — `kun-almashtirdi` (hammasi 15)
9. Katak bosilishini Umami'ga qaysi yozuv aytadi?
   - ✔ A — `data-umami-event` (16)
   - B — `data-website-id` (15)
   - C — `VITE_UMAMI_ID` (13)
   - D — `cloud.umami.is/script.js` (24)
10. Website ID nega `web/.env` faylida turadi?
    - A — Uni boshqa odam ko'rib qolmasligi uchun (38)
    - ✔ B — Har o'quvchining Umami sayti boshqa (35)
    - C — Umami uni faqat .env fayldan o'qiydi (36)
    - D — index.html uni o'zi o'qiy olmagani uchun (39)
11. Sayt ochildi, Umami'da esa 0. Sabab nima bo'lishi mumkin?
    - A — Katakka hodisa nomi qo'shilmagan (32)
    - B — Band qilish tugmasi hali qurilmagan (35)
    - ✔ C — Reklama to'sgichi skriptni yopgan (33)
    - D — Database'ga ulanish uzilib qolgani (34)
12. «Maydon»ning bosh raqami nimani sanaydi?
    - A — Saytni ochgan odamlarni (23)
    - B — Vaqtni tanlagan odamlarni (25)
    - C — Kunni almashtirgan odamlarni (28)
    - ✔ D — Band qilgan odamlarni (21)
- Har savolda to'g'ri variant eng uzun emas (S-006); kalit ibora testlar bilan takrorlanmaydi (S-008): 4-ekran ↔ arena 2 (boshqa vaziyat), 10-ekran ↔ arena 11 (teskari belgi).
- 10-savol A varianti («ko'rib qolmasligi») — darsda rad etilgan: yakundagi 9-karta va A1 3-qadam («har o'quvchida boshqa»). 12-savol — m5-14 «bosh raqam» takrori.
- **Fon so'zlari** (R-008, kodda {uz, ru}): Umami · analitika · hodisa · qadam · `vaqt-tanladi` · `data-umami-event` · Visitors · Events · `localhost:5173` · band · Maydon.
- Arena yozuvlari — umumiy shablon (m5-11 YAKUNIY dagidek): «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`)
1. Yangi fayl `src/7-Modull/PmAnalyticsDayOneLesson.jsx` — skeletdan (pilotdan nusxa yo'q, JR-14); palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `m7-06-v1`.
2. `SCREEN_META` 12: hook · plan · concept · concept · test · concept · practice (A1) · practice (A2) · test · stats · flashcards · summary (F-1005-88).
   `INLINE_KEYS` { 4: 2, 8: 1 }; bloklar `practice: -1`, signal `PRACTICE_BASE + ekran`.
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s3/s5 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s2, s3 da `QBashorat` + `QTaxmin`) · s4/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6/s7 (A1/A2) `QBlok` (`ScreenBlok` ulagichi, 5 qadam) · s9 `QNatija` · s10 `QKartochka` (alohida ekran) · s11 `QYakun`.
4. **Bitta vizual `MaydonPanel`** (180): `QADAMLAR` const — 3 qadam { id, nom: «Saytni ochdi» / «Vaqtni tanladi» / «Band qildi», hodisa: null / `vaqt-tanladi` / `band-qildi`, kim: umami | siz } (P-063);
   `KUNLAR` (5 × 3 son); `KATAKLAR` (16:00–21:00, band 17:00 va 20:00). Ustun holatlari (? · son · joriy), oraliq tanlash, odam-belgilari (CSS), kun tasmasi, ostki yorliqlar.
   0, 1, 2, 3, 5-ekranlar shundan. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: mp-katak mp-oraliq mp-ustun mp-kun`). `reduced-motion` — o'tishsiz.
5. **`UmamiMock`** — Umami ko'rinishining chizilgan maketi (logotipsiz): sarlavha «Maydon · localhost», uch son (Visitors · Visits · Views), «Events» ro'yxati (nom · son).
   A1/A2 natijasi va 8-ekran savol ustida; sonlar `MaydonPanel` 1–2-ustuni bilan bitta manbadan.
6. s2 — «Kunni boshlang» animatsiyasi (12 belgi, `KUNLAR[0]`), oraliq tanlash, ta'rif qatori; nishon `dropSpotter` (birinchi tanlov to'g'ri). s3 — ulash kuni tanlagichi (2 holat), tasma, `QTaxmin`.
   s5 — saralash (3 karta → 2 tomon), maketga mono yorliq `data-umami-event="vaqt-tanladi"`, ta'rif qatori.
7. A2 5-qadam — o'z g'oyasi formasi (o'rtadagi qadam, hodisa nomi) + tekshiruv (bo'sh · «ochdi» · nom formati `/^[a-z0-9]+(-[a-z0-9]+)*$/` (o'zbek apostrofi bilan — `'` ruxsat) · ≤50 belgi);
   saqlash `pm-m7d6-qadamlar` (tayanch 6) → shu qadamning prompt qavslari va uyga vazifa banneri. Tepada kirish qatori — `pm-m7d3-muammo` bo'lsa (tayanch 6).
8. A1/A2 — `ScreenBlok` (skelet) 5 qadam; prompt qatorlari `prompt: [...]`, `{…}` joylar accent pill; A1 4-qadamida xato yo'li — reklama to'sgichi gapi (P-026).
   `ortda`: A1 `dars-05-done`, A2 `dars-06-done`; `git fetch` qatori repo manzili kelgach (TAYANCHGA SAVOL 3).
9. Testlar s4/s8 — matn yuqoridagidek, variantlar uzunligi `git diff` dan keyin skript bilan qayta sanaladi; s8 ustida kichik `UmamiMock`.
   `RECAPS` { 4, 8 } (`ask` + 3 karta; 8-ekran kartalarida kod qatori); `Q_LABELS` { 4, 8 }.
10. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s2 → Drop Spotter · s4 birinchi urinish → Day One · A1 oxirgi «Bajardim» → Tracker On · A2 oxirgi «Bajardim» → First Event.
11. `QUIZ_BANK` 12 (✔ A·B·C·D ×3) + fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}).
12. s11 `QYakun`: `recap` 4 qator, «Bugungi asosiy fikr» `small`; kartochkalar — s10 alohida ekranda (`FLASHCARDS` 12); `uyga` — `HwCard` yakun ekranida (alohida `.homework.jsx` yo'q — GATE M M-q9), `keyingi` matni.
13. App.jsx `m7-06` qatoriga `comp` ulash — asosiy seans (nom o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari (4, 8).
- Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`dars-06-done` = `dars-05-done` + bitta commit; «qur» bosqichida)
1. `web/index.html` `<head>`: `<script defer src="https://cloud.umami.is/script.js" data-website-id="%VITE_UMAMI_ID%"></script>`
   (Vite `index.html` da `import.meta.env` qiymatlarini `%NOM%` bilan qo'yadi; o'zgaruvchi bo'lmasa — qator o'zgarmay qoladi, sayt ishlayveradi, Umami yozmaydi).
2. `web/.env.example`: `VITE_UMAMI_ID=` + izoh «6-dars: Umami → Edit → Tracking code dagi data-website-id»; `.gitignore` da `web/.env` (tayanch 4-dars `.gitignore` i tekshiriladi).
3. Vaqt katagi komponenti: bo'sh katakda `data-umami-event="vaqt-tanladi"`, band katakda atribut yo'q. `umami.track` emas — atribut Umami yuklanmasa ham xato bermaydi
   (A2 promptidagi «Umami yuklanmasa ham katak ishlayversin»).
4. README: «Darslar va teglar» jadvaliga 6-dars qatori; «Xatolar»: Umami'da 0 — reklama to'sgichi / `web/.env` da `VITE_UMAMI_ID` bo'sh (dev serverni qayta yoqing).
5. **Bog'liqlik:** 9-dars `band-qildi` shu usulda qo'shiladi; deploy'da hostingga `VITE_UMAMI_ID` muhit qiymati qo'shiladi (Vite uni build paytida o'qiydi) —
   9-dars MD shu nomni ishlatadi (TAYANCHGA SAVOL 2). Umami'dagi Domain (`localhost`) deploy manziliga almashtirilishi — 9-darsda, ixtiyoriy (Domain faqat referrer filtri uchun).

## Manbalar (Umami — rasmiy, 05.10.2026 ochib tekshirildi)
- Sayt qo'shish: https://docs.umami.is/docs/add-a-website — «Websites» (yon menyu) → «Add website» → Name, Domain → «Save».
- Kod: https://docs.umami.is/docs/collect-data — «Edit» → «Tracking code», kod `<head>` ga; reklama to'sgichi skriptni to'sishi mumkin.
  Kod shakli — Umami manba kodi `src/app/(main)/websites/[websiteId]/settings/WebsiteTrackingCode.tsx`: `<script defer src="${url}" data-website-id="${websiteId}"></script>`;
  bulutda manzil `https://cloud.umami.is/script.js` (`next.config.ts`).
- Hodisa: https://docs.umami.is/docs/track-events — `data-umami-event="…"` yoki `umami.track('…')`; nom 50 belgigacha; hodisalar «Events» sahifasida.
- Sonlar: https://docs.umami.is/docs/metric-definitions — Visitors (sessiya: website ID, hostname, User-Agent xeshi), Visits, Views.
- Domain maydoni `localhost` ni qabul qiladi (`DOMAIN_REGEX`, `src/lib/constants.ts`); tracker `localhost` ni o'tkazib yubormaydi (`src/tracker/index.ts` — `data-domains` berilmasa).
- Ro'yxatdan o'tish: https://cloud.umami.is/signup — Name, Email address, Password. Hobby rejasi bepul (https://docs.umami.is/docs/cloud/faq); sayt soni cheklovi rasmiy sahifada topilmadi.
- Vite: https://vite.dev/guide/env-and-mode — `index.html` da `%VITE_…%`; `VITE_` qiymatlari brauzer kodida ochiq (website ID maxfiy emas).

---

## TAYANCHGA SAVOL
1. **Misol raqamlari** — tayanchda yo'q. Qaror: birinchi kun 12 · 9 · 2, besh kunlik `KUNLAR`, eng ko'p to'xtash 2→3 qadamda (10-darsdagi «Band qilish tugmasi ko'rinmaydi» topilmasiga mos).
   Nega so'rayman: 10–12-darslar (sinov, pitch) shu raqamlarni ishlatishi mumkin — tayanchga yozilsinmi?
2. **`web/.env` → `VITE_UMAMI_ID`** — yangi nom, 9-dars deploy'iga tegadi. Nega: `dars-06-done` tegi hamma uchun bir xil, website ID esa har o'quvchida boshqa;
   ID `index.html` da qattiq yozilsa, `git checkout -f dars-06-done` mentorning ID sini qo'yadi.
3. **Repo manzili** (`git fetch … --tags` qatori, A1/A2 «Ortda qoldingizmi») — tayanchda yo'q; o'quvchi `maydon` ni qanday oladi (fork / clone, qaysi darsda). MD da `{maydon repo manzili}`.
4. **Vaqt katagi qaysi faylda** (`web/src/…`) — 4–5-dars qurilganda aniqlanadi; promptda fayl nomisiz «`web/` dagi vaqt katagi».
5. **`dars-05-done` da katak bosilganda nima bo'ladi** (faqat tanlanadimi, «Band qilindi» belgisi chiqadimi) — hook maketi va hodisa sharti «bo'sh katak bosilganda» shunga bog'liq.
6. **Umami akkaunti kimniki:** har o'quvchi o'zi (email kerak) / juftlik / mentor jamoasi? Rasmiy hujjatda Hobby sayt soni va yosh cheklovi topilmadi.
   A1 5-qadami (o'z loyihasi uchun ikkinchi sayt) shunga bog'liq.
7. **3-dars yozuvi** (tanlangan muammo, «qilamiz» ro'yxati) localStorage'da saqlanadimi va qaysi kalitda — A2 5-qadam kirish qatori uchun (yopildi: `pm-m7d3-muammo`, tayanch 6).
8. **O'z MVP kodi 6-darsgacha bormi** — uyga vazifa 1–2-qadami loyiha sahifasi borligini kutadi. Yo'q bo'lsa: «promptni saqlab qo'ying, birinchi ekran qurilgan kuni yuborasiz».
9. **«Zanjir» so'zi** — GATE M M-q3: hamma darsda «uch qadam».
10. **Keys («Biznes olamidan»)** — qo'yilmadi: PM qismi ≈20 daqiqa, ishonchli manbali qisqa keys topilmadi. Kerakmi?
11. **Ikki amaliyot bloki** (A1 ulash, A2 hodisa) — tayanchda «amaliyot bloki» birlikda. Bitta 7–8 qadamli blok o'quvchi uchun og'ir deb bo'ldim.
12. **Hodisa nomi qoidasi** («kichik harf, so'zlar chiziqcha bilan, o'tgan zamon fe'li») — modul qoidasi sifatida tayanchga (9-dars `band-qildi` ham shunday).

## Shubhali joylar (ishonchim komil emas)
- Umami interfeys nomlari («Websites», «Add website», «Edit», «Tracking code», «Events», «Visitors») — rasmiy hujjatdan, lekin Umami versiyasi o'zgarsa, tugma boshqa joyda bo'lishi mumkin (P-028 — darsdan oldin tekshiruv).
- A1 2-qadam promptining ikkinchi qatori (`VITE_UMAMI_ID` dan olinsin) — 173.4 «texnologiya aytilmaydi» chegarasida; kerakli, chunki tegdan keyin ham har kimning ID si o'zida qolsin.
- s3 Mentorida o'tgan dars nomi butun keltirildi («Kecha kelgan odam bugun ham keldimi?») — uzun, lekin modul raqami ichki kod bo'lgani uchun boshqa yo'l topmadim.
- A2 4-qadam — sherik bir xil kompyuterda: «Visitors» o'smasligi mumkin; tekshiruv «Events» ga qaratildi, lekin o'quvchi «Visitors» ga qarab hayron bo'lishi mumkin.
- Arena 2 (to'g'ri: «Faqat Database'dagi bandlar») — «Maydon»da band qilish 9-darsda quriladi; savol 3-ekrandagi «ishga tushgan kun» vaziyatiga tayanadi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-05` «Animatsiya: interfeys javob beradi» → **`m7-06` «Birinchi odam kirganda nimani ko'rasiz?»** → `m7-07` «Loyiha kuni: MVP — birinchi ekran» (App.jsx 313-qator, 05.10).
- [x] Bitta misol-ip — «Maydon» (hook → bloklar); ikkinchi misol yo'q (A2 5-qadam — o'quvchining o'z loyihasi, P-004). Metafora yo'q. Bitta vizual — `MaydonPanel` (bloklarda uning `UmamiMock` davomi).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (odamlar oqadi, oraliq), 4 (ulash kuni → tasma), 6 (saralash → maketga nom yorlig'i) + 0, 7, A1, A2. Matn-karta yo'q.
- [x] O'lchov (skript bilan sanaldi): sarlavhalar 32–53 · Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi · xulosalar 74–99 · hook javobi 100 · xato izohlari 33–59.
- [x] Atamalar: sayt · Backend · Database · vaqt katagi · band (tayanch); bosh raqam (m5-14), foydalanish boshlangani / ish oxirigacha yetgani (m6-14), yozilmagan kun (m5-11), o'lchagich (m4c-06) — grep bilan o'sha so'zlar.
  Siz-forma; tugmalar siz-formada, yorliqlar ot-shaklda (§222/224); Antigravity promptlari sen-formada (T-002).
- [x] Testlar: variantlar 29–36 belgi, to'g'ri variant eng uzun emas; kod/qavs faqat xato variantda (10-A) · ✔ o'rni A/C/B (yangi dars) · arena A·B·C·D ×3.
- [ ] Final tartib-mashqi — yo'q (PM qismi + amaliyot; yakuniy — `QTest`), shuning uchun uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («har doim», «100%», «darrov», «darhol», «doim» — grep 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (modul raqami, T6, P1 — yo'q; o'tgan dars nomi bilan atalgan) · real raqam yo'q (mashq raqamlari — «bu misolda»), Umami fakti — rasmiy manba bilan · «KOD» 13 band, «REPO» 5 band.
- [x] Karta T · P · S · PM ko'rildi: T-011 (analitika 2-ekranda, hodisa 5-ekranda — harakatdan keyin) · T-014/015 (uch qadam, «kuzatuv» yo'q) · T-024/029/047 · T-039 (««Maydon»ga», o'z loyihasi — «loyihangiz») ·
  T-042 (ta'rif so'zma-so'z) · T-043 («bu misolda») · T-045 (Umami odamni ism bilan emas, brauzer belgilaridan sanaydi — «kim» deyilmaydi) · T-064 (sarlavha zanjiri) ·
  P-001/004/008/013/014/015/016/025/026/028/036/046/048/052/059/062/063/064/067 · S-001/002/004/006/008/010/015/018/025/026 · PM-021 (maydon yo'riqlari) · PM-030 (misol → atama).
  ✗ P-011 (PM V4 tartibi: keys, klinika, koding) — gibrid dars, PM qismi ≈20 daqiqa; keys yo'q (TAYANCHGA SAVOL 10). ✗ P-059 «4 qadam» — 5 qadam (qaror 8 «blok oxirida bitta qadam»).
