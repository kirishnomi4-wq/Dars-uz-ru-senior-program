# 5-Modul · 9-dars «Fikr va iteratsiya» — YANGI MATN (v2, amaliyot-qolip)

Fayl: `src/5-Modull/BotFeedbackIterationLesson.jsx` · **8 ekran + 3 amaliyot bloki = 11** (20 edi) · uz + ru
**Holat: 03.10 — KODGA MOS (F-1002-112).** Farqlar `⚙` bilan.
Eski matn: `feedback/F-0928-QA-5modul/YAKUNIY/09-BotFeedbackIteration.md`. Har ekran ostida `✎`.
Qolip: 5-dars v2 A-bo'limi; 7-dars v2 dagi Render/webhook yo'li. Fidbek: `>> ...`. Tasdiqlangach (GATE M) kod. Vaqt ≈ 90 daqiqa, amaliyot ≈ 58.

---

## A. 9-darsga xos qoidalar

1. **Bitta natija:** dars oxirida botning **v2** si serverda — 8-dars suhbatidagi eng muhim fikr tuzatilgan, eski narsalar buzilmagan, o'sha odamdan qayta so'ralgan.
2. **Fikr qayerdan:** 8-darsda (PM) o'quvchi botini sinagan odamdan «qayerda to'xtab qoldingiz?» deb so'rab, javoblarni yozgan. 9-dars shu javoblardan boshlanadi — yangi suhbat emas. Javob yozmagan o'quvchi uchun A1 da «o'zingiz 3 kishiga sinating» zaxira yo'li.
3. **Fikrlar repo'da yashaydi:** `FIKRLAR.md` fayli (repo ildizida) — ro'yxat, tur, chastota, tanlov, aniq o'zgarish, v2 dan keyingi o'lchov. Keyingi iteratsiyalar ham shu faylga yoziladi (10-dars, Demo Day).
4. **Iteratsiya yo'li 7-darsdan:** laptopda tuzatish (polling — serverdagi webhook o'chadi, bu normal) → `git push` → Render o'zi qayta joylaydi, webhook tiklanadi → telefondan sinash. Bu A2–A3.
5. **Bir dars — bitta yangi narsa:** «fikr → aniq o'zgarish → v2 → qayta o'lchash» sikli. Kod yangiligi yo'q — prompt va git 5/7-darslardan.
6. **Namuna (AvtoPizza, bir hafta):** narx ko'rinmaydi — 18 · bot sekin — 5 · glutensiz pitsa — 3 · manzilni 2 marta so'radi — 2 · tez va qulay, rahmat — 6. Birinchi: **narx** (ko'p odam, buyurtmadan oldin ketadi). Repo `dars-07-done` tasdiq xabarida narx yo'q — namuna haqiqiy.
7. Tushib qolgan: fikr manbalari (drop-off, loglar), savol berish (8-dars takrori), voronka, 3 tuzoq, final — kartochkalar/arena; «bitta to'liq iteratsiya» hikoyasi — A1→A3 ning o'zi.

---

## Darsning ipi
- **Hook:** bir hafta o'tdi, 4 xabar keldi → «Birinchi nima qilasiz?»
- **Model:** tingla → sarala (tur, aniqmi) → tanla (chastota × ta'sir) → aniq o'zgarish → tuzat (laptop) → v2 (server) → qayta o'lcha → yana.
- **Namuna:** AvtoPizza v1 → v2 (tasdiq xabarida narx).
- **Yakun:** v2 serverda · keyingi dars — «AI-agent yaratish».

---

## 0 · Kirish — fikrlar keldi
- Eyebrow: Kirish
- Sarlavha: **Mijozlar yoza boshladi. Birinchi nima qilasiz?**
- Mentor: Botingiz bir haftadan beri serverda, odamlar uni siz o'ylamagan tomondan ishlatdi — <b>«▶ Mijozlar nima dedi?»</b>ni bosing.
- Chat «AvtoPizza»:
  - mijoz: Narxni ko'rsatmaydi, noqulay
  - (bosilgach, birin-ketin) mijoz: Manzilimni 2 marta so'radi
  - mijoz: Glutensiz pitsa qo'shing!
  - mijoz: Tez va qulay, rahmat!
- Tugma: ▶ Mijozlar nima dedi? → ✓ Fikrlar keldi
- Savol: **Birinchi nima qilasiz?**
  - Hech narsa: bot ishlayapti, shikoyat bo'lib turadi
  - ✔ Fikrlarni o'qib, eng ko'p takrorlanganini tuzataman
  - Botni noldan, butunlay qayta yozaman
- Javob — 2-variant: **Aynan!** Tinglaysiz, eng muhimini tuzatasiz, yana tinglaysiz. Shu takror — iteratsiya.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Shikoyat o'zi tuzalmaydi, noldan yozsangiz ishlayotgani ham ketadi. Eng muhimi tuzatiladi, yana tinglanadi.
- Tugma: Davom etish

✎ Eski 0-ekran; xabar tartibi namunaga mos (narx birinchi), javoblar 162-qonun.

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: **Dars oxirida botingizning v2 si serverda.**
- Mentor: 8-darsda yozib olgan javoblaringiz bugun ishga tushadi — ulardan bittasini tanlab, tuzatib, serverga chiqarasiz.
- Chat «AvtoPizza · v2» (bot · serverda):
  - mijoz: Margarita, Chilonzor 5
  - bot: Qabul qilindi: Margarita — 45 000 so'm. Manzil: Chilonzor 5.
  - pastki yozuv: v1 da narx yo'q edi — 18 kishi yozgan
- Bugungi 3 qadam:
  1. Saralash — 8-dars javoblaridan `FIKRLAR.md`, bittasini tanlaysiz
  2. Tuzatish — laptopda Antigravity bilan, eskisini buzmay
  3. Yangi versiya — `git push`, Render, telefondan sinash, qayta so'rash
- Pastki qator: repo `TelegramBotNest` · `dars-09-start` · namuna `dars-09-done`
- Tugmalar: Orqaga · Boshlaymiz →

⚙ F-1003-06 (03.10): qadam ostidagi kichik teglar olib tashlandi — qadam matni o'zi yetadi (QA «olib tashlaylik», 5-Modul 8 kod darsi).

✎ Eski 1-ekran (4 qadam) → natija chati + 3 qadam. 5-dars/8-dars havolalari mentorda bitta gap.

## 2 · Tushuncha 1 — fikr turi va aniqligi
- Eyebrow: Tushuncha · fikr turi
- Sarlavha: **Har fikr bir xilmi? To'rttasini saralang.**
- Mentor: Fikr uch turga bo'linadi — bug, taklif, maqtov — va har biri aniq yoki noaniq bo'ladi; <b>chapdagi xabarlarni</b> bosib, har birining tegini ko'ring.
- Chapda — 0-ekrandagi 4 xabar (chat pufagi ko'rinishida, bosiladi, ko'rilgani ✓):
  - «Narxni ko'rsatmaydi, noqulay» → **Bug · aniq** — joy bor (narx), muammo bor (ko'rinmaydi). Tuzatiladi.
  - «Manzilimni 2 marta so'radi» → **Bug · aniq** — bot kutilgan ishni qilmayapti. Tuzatiladi.
  - «Glutensiz pitsa qo'shing!» → **Taklif · aniq** — botda yo'q narsa. Hozir qo'shilmaydi — ko'pchilikka kerakmi, qaraladi.
  - «Tez va qulay, rahmat!» → **Maqtov · noaniq** — nima yaxshi ekani aytilmagan; tuzatayotganda buzilmasin.
- O'ngda — bitta karta (matn almashadi, 163.8): tur-tegi (rangli pill: bug — qizil, taklif — accent, maqtov — yashil) + «aniq/noaniq» + bir gap izoh.
- 4/4 dan keyin (yashil): Aniq fikrda joy va muammo bor. Noaniqni avval aniqlashtirasiz: «aynan qayerda?»
- Tugmalar: Orqaga · 4 xabarni saralang (N/4) → Davom etish

✎ Eski 2 («4 manba»), 3 («savol berish») → kartochka; eski 6 («noaniq → aniq») A1 4-qadamida haqiqiy ishga aylandi.

## A1 · Amaliyot 1 — fikrlar ro'yxati  `(≈18 daq)`
- Eyebrow: Amaliyot 1 · FIKRLAR.md
- Sarlavha: **8-dars javoblaridan bitta aniq o'zgarish chiqaring.**
- Mentor: Odam aytgan gap — shikoyat, Antigravity'ga esa vazifa kerak; <b>«1 · Ochish»</b>dan boshlang.
- Qadamlar:
  1. **Ochish** — Antigravity'da `TelegramBotNest`, yangi fayl `FIKRLAR.md` (repo ildizida). Shablonni «Nusxalash» bilan faylga qo'ying:
     > `# FIKRLAR — {bot nomi}`
     > `| № | Fikr (odam aytgani) | Tur | Aniqmi | Nechta odam |`
     > `|---|---|---|---|---|`
     > `| 1 | {…} | bug / taklif / maqtov | aniq / noaniq | {…} |`
  2. **Yozish** — 8-darsda yozib olgan javoblaringizdan kamida 5 fikr, har biriga tur va aniqmi. Javob yozmagan bo'lsangiz: qo'shningizga botni bering, «qayerda to'xtab qoldingiz?» deb so'rang va yozing.
  3. **Tanlash** — nechta odam aytgan (chastota) va buyurtmani to'xtatadimi (ta'sir) — bittasini ★ bilan belgilang. Noaniq bo'lsa, avval odamdan aniqlashtiring: «aynan qayerda?».
  4. **Aniq o'zgarish** — ★ fikrni faylning oxiriga bitta gap qilib yozing va qo'shningizga o'qiting: u nima qilish kerakligini tushundimi?
     > `## Aniq o'zgarish (v2)`
     > `{qayerda} da {nima o'zgarsin}. {nima buzilmasin}.`
- O'ng tomon — «Kutilgan natija · FIKRLAR.md (namuna: AvtoPizza)» — fayl-karta:
  ```
  # FIKRLAR — AvtoPizza
  | № | Fikr                          | Tur    | Aniqmi | Nechta |
  | 1 | Narxni ko'rsatmaydi           | bug    | aniq   | 18 ★   |
  | 2 | Tez va qulay, rahmat          | maqtov | noaniq | 6      |
  | 3 | Bot sekin                     | bug    | noaniq | 5      |
  | 4 | Glutensiz pitsa qo'shing      | taklif | aniq   | 3      |
  | 5 | Manzilimni 2 marta so'radi    | bug    | aniq   | 2      |

  ## Aniq o'zgarish (v2)
  Buyurtma tasdiq xabarida pitsa narxi ko'rsatilsin.
  Manzil bir marta so'ralishi o'zgarmasin.
  ```
- Hammasi bajarilgach (yashil): Shikoyat vazifaga aylandi. Endi uni Antigravity tushunadi.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-09-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 16-ekran amaliyoti (`fikrlar.txt`, kod yozilmaydi) → repo'dagi `FIKRLAR.md` + haqiqiy tanlov. Eski 7-ekran (bir haftalik fikrlar, 3 nishon) va 13-ekran (prompt yig'ish) → shu blok.

## 3 · 1-savol ✅ (jonli ball)
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mijoz: «Bot manzilimni 2 marta so'radi». Bu qanday fikr?**
  - Taklif: botda hali yo'q narsa so'ralgan
  - ✔ Bug: bot yozilgan manzilni eslab qolmagan
  - Maqtov: mijoz botdan mamnun ekanini aytgan
  - Shovqin: bunga e'tibor berish shart emas
- To'g'ri: To'g'ri! Bot kutilgan ishni bajarmayapti — bu bug.
- Xato izohlari (≤60):
  - A: Taklif — yo'q narsani so'rash; bu yerda bor narsa buzilgan.
  - C: Mijoz bir narsani ikki marta yozdi — bu norozilik.
  - D: Aksincha, bu aniq fikr: nima buzilgani aytilgan.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

✎ Eski 4-ekran, kalit o'rni (B) o'zgarmadi.

## 4 · Tushuncha 2 — nimani birinchi
- Eyebrow: Tushuncha · tanlov
- Sarlavha: **Beshta fikr, bitta kun. Qaysi birini birinchi?**
- Mentor: Hammasini bir kunda tuzatib bo'lmaydi — <b>har fikrni</b> bosib, nechta odam aytgani va botga qanchalik zarar qilganini ko'ring.
- Bitta vizual — chastota chizig'i (gorizontal bar, 18 eng uzun) + ta'sir yozuvi (bosilgach):
  - Narx ko'rinmaydi — **18** — ta'sir: buyurtmadan oldin ketadi · **birinchi**
  - Tez va qulay — 6 — maqtov: tegilmaydi, buzilmasin
  - Bot sekin — 5 — noaniq: avval «qaysi javob?» deb so'raladi
  - Glutensiz — 3 — taklif: «hozir emas» — kam odam
  - Manzil 2 marta — 2 — bug: kichik, navbatda
- 5/5 dan keyin (yashil): Ko'p odam aytgan va qattiq qiynagan — birinchi. Qolganiga «hozir emas» deyish ham qaror.
- Tugmalar: Orqaga · 5 fikrni ko'ring (N/5) → Davom etish

✎ Eski 5 («chastota»), 7 («bir haftalik», voronka), 10-savol («100 dan bittasi») va 11 («3 tuzoq») → bitta ekran; voronka/drop-off — kartochka va arena.

## A2 · Amaliyot 2 — tuzatish  `(≈25 daq)`
- Eyebrow: Amaliyot 2 · v2
- Sarlavha: **Tanlangan fikrni tuzating, eskisini buzmang.**
- Mentor: Tuzatish laptopda — serverdagi bot shu payt jim turadi, bu normal; <b>«1 · Ochish»</b>dan boshlang.
- Qadamlar:
  1. **Ochish** — Antigravity'da `telegram.service.ts`, terminalda `npm run start:dev` → «Telegram bot ulandi» (polling: serverdagi webhook o'chdi, A3 da qaytadi).
  2. **Prompt** — `FIKRLAR.md` dagi aniq o'zgarishni qavsga qo'ying, «Nusxalash», Antigravity'ga:
     > `FIKRLAR.md` dagi v2 o'zgarishi: **{qayerda}** da **{nima o'zgarsin}**. **{nima buzilmasin}**. Boshqa joyga tegma, o'zgargan qatorlarni ayt.
  3. **Ishga tushirish** — terminal xatosiz. Antigravity aytgan qatorlarni o'qing: faqat kerakli joy o'zgarganmi (4 tekshiruv — 5-dars). Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telegramda tekshirish** — avval tuzatilgan joy; keyin eski uch narsa: `/start`, menyu tugmalari, bitta buyurtma oxirigacha. Hammasi ishlasa — v2 tayyor.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza v2)»:
  - mijoz: (Margarita bosdi)
  - bot: Margarita — 45 000 so'm. Buyurtma qabul qilindi. Manzilingizni yozing.
  - mijoz: Chilonzor 5
  - bot: Buyurtma tasdiqlandi: Margarita — 45 000 so'm · Chilonzor 5
- Hammasi bajarilgach (yashil): v2 laptopda ishlaydi. Eski narsalar ham joyida.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-09-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 13-ekran promptining uch qismi («qayerda · nima o'zgarsin · nima buzilmasin») — haqiqiy prompt. Eski 11-ekran «3 tuzoq» (ishlayotganini buzish) → 4-qadam regressiya tekshiruvi.

## 5 · 2-savol ✅ (jonli ball)
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Vaqt oz. 18 kishi: narx ko'rinmaydi, buyurtma bermay ketadi. 3 kishi: glutensiz pitsa yo'q. Birinchi nimani?**
  - Glutensiz pitsani: yangi taom ko'proq mijoz olib keladi
  - Ikkalasini birga: hech bir fikr kutib qolmasin
  - ✔ Narxni: u ko'p odamni buyurtmadan to'xtatyapti
  - Hech birini: bular oddiy shikoyat, jiddiy emas
- To'g'ri: To'g'ri! Narx muammosi ko'p odamda (18) buyurtmani to'xtatadi — chastota ham, ta'sir ham katta.
- Xato izohlari (≤60):
  - A: Yangi taomni 3 kishi so'ragan, narxni 18 kishi.
  - B: Vaqt oz bo'lsa, ikkalasi ham chala chiqadi.
  - D: 18 kishi bir xil shikoyat qildi — bu jiddiy fikr.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

✎ Eski 8-ekran; kalit o'rni (C) o'zgarmadi; «manzil bug'i» → «narx» — namuna bilan bir xil (A-6). Sarlavha uzun bo'lgani uchun `questionText` qisqa, savol matni test-ekranida ikki qatorli `h-ask` (164-qonun test-ekranni cheklamaydi — tekshiriladi).

## A3 · Amaliyot 3 — yangi versiya serverga  `(≈15 daq)`
- Eyebrow: Amaliyot 3 · Render
- Sarlavha: **v2 ni serverga chiqaring va qayta so'rang.**
- Mentor: Tuzatish ishladimi — buni siz emas, o'sha odam aytadi; <b>«1 · Push»</b>dan boshlang.
- Qadamlar:
  1. **Push** — laptopdagi botni to'xtating (Ctrl+C), keyin:
     ```
     git add -A
     git commit -m "9-dars: v2 — {nima tuzatildi}"
     git push
     ```
  2. **Render** — render.com'da xizmatingiz o'zi qayta joylanadi (Auto-Deploy). Loglarda 2–4 daqiqada «Telegram bot ulandi (webhook)». Xato bo'lsa: log matnini Antigravity'ga.
  3. **Telefondan tekshirish** — tuzatilgan joy serverda ham ishlaydi (birinchi javob 30–60 s kechikishi mumkin).
  4. **Qayta o'lchash** — 8-darsdagi odamga yana bering va yana so'rang: «qayerda to'xtab qoldingiz?». Javobni `FIKRLAR.md` ga yozing:
     > `## v2 dan keyin`
     > `{odam nima dedi} — {shikoyat qoldimi / yo'qoldimi}. Keyingi: {ro'yxatdagi navbatdagi fikr}.`
- O'ng tomon — «Kutilgan natija · terminal + log»:
  ```
  $ git push
  To https://github.com/{siz}/TelegramBotNest.git
  ...
  Render ▸ Deploying commit 7c1e2b4 "9-dars: v2 — narx"
  Render ▸ Telegram bot ulandi (webhook)
  ```
- Hammasi bajarilgach (yashil): v2 serverda. Keyingi iteratsiya `FIKRLAR.md` dagi navbatdagi qatordan boshlanadi.
- Pastki qator: Bitta iteratsiya: tingla → tanla → tuzat → chiqar → qayta o'lcha.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 9 («bitta to'liq iteratsiya» hikoyasi), 12 («qayta o'lchash» 18 → 1), 14-savol («yangi versiyadan keyin nima?») va 15-final — o'quvchi haqiqiy iteratsiyani o'zi bosib o'tadi.

## 6 · Natijalar (podium) — o'zgarmaydi

## 7 · Yakun — kartochkalar va keyingi dars
- Eyebrow: Tayyor
- Belgi: ✓ v2 serverda
- Sarlavha: **Bot fikr bilan o'sadi — siz buni bir marta qildingiz.**
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CodeStrike
- Kartochkalar (12):

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Fikr yig'ish → tuzatish → yangi versiya → yana fikr. Bu takror? | Iteratsiya | Har iteratsiyada bot biroz yaxshilanadi |
| Fikrlar qaysi uch turga ajratiladi? | Bug, taklif, maqtov | Tuzatish · o'ylab ko'rish · saqlash |
| «Bot manzilimni ikki marta so'radi» — qanday fikr? | Bug | Bot kutilgan ishni bajarmayapti |
| Mijoz botda yo'q narsani so'rasa? | Taklif | Hozir qo'shilmaydi — ko'pchilikka kerakmi |
| Aniq fikr noaniqdan nimasi bilan farq qiladi? | Unda joy va muammo bor | Noaniqni avval aniqlashtirasiz: «aynan qayerda?» |
| Qaysi tuzatish birinchi — nimaga qarab? | Chastota va ta'sir | Nechta odam · buyurtmani to'xtatadimi |
| Kam odamga kerak taklifga nima deysiz? | «Hozir emas» | Bu ham qaror — asosiy ish saqlanadi |
| Fikrlar ro'yxati qayerda turadi? | `FIKRLAR.md` — repo'da | Keyingi iteratsiyalar ham shu yerda |
| Antigravity'ga shikoyatni emas, nimani berasiz? | Aniq o'zgarishni | qayerda · nima o'zgarsin · nima buzilmasin |
| Tuzatgandan keyin eski narsani nega tekshirasiz? | Buzilmaganini bilish uchun | /start, menyu, buyurtma — uchalasi |
| Ko'p odam suhbatning bir joyida ketib qolsa? | Ketib qolish (drop-off) | O'sha qadamda nimadir xalaqit beradi |
| Tuzatishni chiqargandan keyin nima qilasiz? | Qayta o'lchaysiz | O'sha odamdan yana so'raysiz; keyingi iteratsiya shundan |

- Keyingi dars — «AI-agent yaratish». Botga maqsad berasiz — keyingi qadamni u o'zi tanlab, asbob chaqiradi: masalan, buyurtmani bazaga saqlaydi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

✎ Eski 18 + 19; uyga vazifa olindi (qayta o'lchash A3 da). Kartochka: voronka → drop-off bitta karta; 2 yangi (FIKRLAR.md, regressiya).

---

## Nishonlar (3)
- Feedback Sorter — Fikr turini to'g'ri aniqladingiz (3-ekran, 1-savol)
- Right Fix First — Eng ta'sirli tuzatishni birinchi tanladingiz (5-ekran, 2-savol)
- Full Iteration — Bitta to'liq iteratsiyani o'zingiz bosib o'tdingiz (A3 oxirgi «Bajardim») — bonus

## Qisqa takrorlash oynalari (2)
1. 1-savol (3-ekran) — «Uch tur, ikki aniqlik»
   - 1 · Bug — Bor narsa noto'g'ri ishlayapti. Tuzatiladi.
   - 2 · Taklif — Yo'q narsa so'ralgan. O'ylab ko'riladi.
   - 3 · Maqtov — Nima yaxshi ishlayotganini aytadi. Buzilmasin.
   - Sinfga savol: «Manzilimni 2 marta so'radi» — qaysi tur?
2. 2-savol (5-ekran) — «Chastota va ta'sir»
   - 18 · Chastota — Nechta odam aytgan.
   - 2 · Ta'sir — Buyurtma to'xtaydimi yoki shunchaki noqulaymi.
   - 3 · «Hozir emas» — Kam odamga kerak narsa navbatda turadi.
   - Sinfga savol: 18 kishi narx, 3 kishi glutensiz — birinchi nima?

## Jonli viktorina (arena, 12 savol) — o'zgarmaydi
Hech bir savol namuna bilan to'qnashmaydi («18 kishi bir xil shikoyat» umumiy). Tekshirildi: 6-savol «menyu tugmasi tuzatilgach 60 → 15» — voronka misoli, kartochkada drop-off bor.

---

## KOD — razrabotkada o'zgargan narsalar (03.10, F-1002-112 — bajarildi)
1. `SCREEN_META` 11, `INLINE_KEYS` `{ s3: 1, s5: 2 }`, RECAPS 4/7, nishon 3 (`fullIteration` = a3 bonus).
2. `ScreenBlok` + `PromptBox` 7-darsdagi versiya (term/code prop); A1 o'ng tomoni yangi `FileCard` (`FIKRLAR.md`, mono, ★ qator accent); A3 o'ng tomoni `Term`. `PromptBox` ga `who` prop («Shablon → FIKRLAR.md»); ⚙ `|`/`#` bilan boshlangan shablon qatorlari mono shriftda (Manrope'da `|` «I» ga o'xshardi).
3. 2-ekran: chat pufaklari bosiladi (hook chati qayta ishlatiladi) + o'ngda teg-karta; 4-ekran: chastota chiziqlari (`.freq-bar`, kenglik = n/18).
4. Eski Screen2…15, DragDropOrder, final, uyga vazifa olindi; `Flashcards` summary ichida; ⚙ «Keyingi dars» qatori eski kodda faqat uyga vazifa kartasi ichida edi — endi alohida qator.
5. ru — uz bilan birga.

## B. Bu darsdan tashqariga chiqadigan narsalar
- **Repo `dars-09-done`:** `FIKRLAR.md` namunasi + v2 (tasdiq xabarida narx; `PITSALAR` narxi bilan). `dars-09-start` = `dars-07-done` (8-dars PM — kod yo'q).
- **8-dars (PM):** amaliyoti «javoblarni yozib oling» — qayerga yozishni aytmaydi; 9-dars A1 ularni `FIKRLAR.md` ga ko'chiradi. 8-dars matniga tegilmaydi (PM fidbeki alohida).
- **10-dars** kirishi «6-darsda botingizga AI ulagansiz» — mos. 10-dars amaliyot ekrani (agentga 2 asbob) keyin.
- **Demo Day (14-dars):** `FIKRLAR.md` — o'quvchining iteratsiya dalili; Demo Day rejasi yozilganda eslatiladi.
