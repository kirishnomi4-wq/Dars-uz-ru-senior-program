# 9-dars «Foydalanuvchi fikri va iteratsiya» — yakuniy matn

Fayl: `src/5-Modull/BotFeedbackIterationLesson.jsx` · 11 ekran (8 ekran + 3 amaliyot bloki A1–A3) · Keyingi dars: «AI-agent yaratish»
Holat: 04.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: Mijozlar yoza boshladi. Birinchi nima qilasiz?
- Mentor: Botingiz bir haftadan beri serverda, odamlar uni siz o'ylamagan tomondan ishlatdi — **«▶ Mijozlar nima dedi?»**ni bosing.
- Chat (AvtoPizza):
  - mijoz: Narxni ko'rsatmaydi, noqulay
  - mijoz (tugma bosilgach, birin-ketin): Manzilimni 2 marta so'radi
  - mijoz: Glutensiz pitsa qo'shing!
  - mijoz: Tez va qulay, rahmat!
- Tugma: ▶ Mijozlar nima dedi? → ✓ Fikrlar keldi
- Savol (uchala xabardan keyin): Birinchi nima qilasiz?
  - Hech narsa: bot ishlayapti, shikoyat bo'lib turadi
  - ✔ Fikrlarni o'qib, eng ko'p takrorlanganini tuzataman
  - Botni noldan, butunlay qayta yozaman
- Javob izohlari:
  - 2-variant: **Aynan!** Tinglaysiz, eng muhimini tuzatasiz, yana tinglaysiz. Shu takror — iteratsiya.
  - 1 yoki 3-variant: **Qiziq fikr!** Shikoyat o'zi tuzalmaydi, noldan yozsangiz ishlayotgani ham ketadi. Eng muhimi tuzatiladi, yana tinglanadi.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Dars oxirida botingizning v2 si serverda.
- Mentor: 8-darsda yozib olgan **javoblaringiz** bugun ishga tushadi — ulardan bittasini tanlab, tuzatib, serverga chiqarasiz.
- Yorliq: dars oxirida — namuna: AvtoPizza · v2
- Chat (AvtoPizza):
  - mijoz: Margarita, Chilonzor 5
  - bot: Qabul qilindi: Margarita — 45 000 so'm. Manzil: Chilonzor 5.
- Pastki yozuv: v1 da narx yo'q edi — 18 kishi yozgan
- Bugungi 3 qadam
  1. Saralash — 8-dars javoblaridan FIKRLAR.md, bittasini tanlaysiz
  2. Tuzatish — laptopda Antigravity bilan, eskisini buzmay
  3. Yangi versiya — git push, Render, telefondan sinash, qayta so'rash
- Pastki qator: repo `TelegramBotNest` · `dars-09-start` · namuna `dars-09-done`
- Tugmalar (telefonda): 3 qadamni ko'rish · ↩ Natijani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Fikr turi
- Eyebrow: Tushuncha · fikr turi
- Sarlavha: Har fikr bir xilmi? To'rttasini saralang.
- Mentor: Fikr uch turga bo'linadi — bug, taklif, maqtov — va har biri aniq yoki noaniq bo'ladi; **chapdagi xabarlarni** bosib, har birining tegini ko'ring.
- Chapda — 4 xabar (bosiladi, ko'rilgani ✓ bilan belgilanadi); o'ngda bosilgan xabarning tegi va izohi:
  - Narxni ko'rsatmaydi, noqulay — Bug · aniq — Joy bor (narx), muammo bor (ko'rinmaydi). Tuzatiladi.
  - Manzilimni 2 marta so'radi — Bug · aniq — Bot kutilgan ishni qilmayapti. Tuzatiladi.
  - Glutensiz pitsa qo'shing! — Taklif · aniq — Botda yo'q narsa. Hozir qo'shilmaydi — ko'pchilikka kerakmi, qaraladi.
  - Tez va qulay, rahmat! — Maqtov · noaniq — Nima yaxshi ekani aytilmagan; tuzatayotganda buzilmasin.
- Xulosa (4/4 dan keyin): Aniq fikrda joy va muammo bor. Noaniqni avval aniqlashtirasiz: «aynan qayerda?»
- Tugmalar: Orqaga · 4 xabarni saralang (N/4) → Davom etish

## 3 · Amaliyot 1 — FIKRLAR.md
- Eyebrow: Amaliyot 1 · FIKRLAR.md
- Sarlavha: 8-dars javoblaridan bitta aniq o'zgarish chiqaring.
- Mentor: Odam aytgan gap — shikoyat, Antigravity'ga esa vazifa kerak; **«1 · Ochish»**dan boshlang.
- Qadamlar (har birida «Bajardim» tugmasi):
  1. Ochish — Antigravity'da `TelegramBotNest`, yangi fayl `FIKRLAR.md` (repo ildizida). Shablonni «Nusxalash» bilan faylga qo'ying.
     - Prompt qutisi (Shablon → FIKRLAR.md · Nusxalash):
       ```
       # FIKRLAR — {bot nomi}
       | № | Fikr (odam aytgani) | Tur | Aniqmi | Nechta odam |
       |---|---|---|---|---|
       | 1 | {…} | bug / taklif / maqtov | aniq / noaniq | {…} |
       ```
  2. Yozish — 8-darsda yozib olgan javoblaringizdan kamida 5 fikr, har biriga tur va aniqmi. Javob yozmagan bo'lsangiz: qo'shningizga botni bering, «qayerda to'xtab qoldingiz?» deb so'rang va yozing.
  3. Tanlash — nechta odam aytgan (chastota) va buyurtmani to'xtatadimi (ta'sir) — bittasini ★ bilan belgilang. Noaniq bo'lsa, avval odamdan aniqlashtiring: «aynan qayerda?».
  4. Aniq o'zgarish — ★ fikrni faylning oxiriga bitta gap qilib yozing va qo'shningizga o'qiting: u nima qilish kerakligini tushundimi?
     - Prompt qutisi (Shablon → FIKRLAR.md · Nusxalash):
       ```
       ## Aniq o'zgarish (v2)
       {qayerda} da {nima o'zgarsin}. {nima buzilmasin}.
       ```
- Kutilgan natija · FIKRLAR.md (namuna: AvtoPizza) — fayl `FIKRLAR.md`:
  ```
  # FIKRLAR — AvtoPizza
  | № | Fikr                       | Tur    | Aniqmi | Nechta |
  | 1 | Narxni ko'rsatmaydi        | bug    | aniq   | 18 ★   |
  | 2 | Tez va qulay, rahmat       | maqtov | noaniq | 6      |
  | 3 | Bot sekin                  | bug    | noaniq | 5      |
  | 4 | Glutensiz pitsa qo'shing   | taklif | aniq   | 3      |
  | 5 | Manzilimni 2 marta so'radi | bug    | aniq   | 2      |

  ## Aniq o'zgarish (v2)
  Buyurtma tasdiq xabarida pitsa narxi ko'rsatilsin.
  Manzil bir marta so'ralishi o'zgarmasin.
  ```
- Hammasi bajarilgach: Shikoyat vazifaga aylandi. Endi uni Antigravity tushunadi.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-09-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mijoz: «Bot manzilimni 2 marta so'radi». Bu qanday fikr?
  - Taklif: botda hali yo'q narsa so'ralgan
  - ✔ Bug: bot yozilgan manzilni eslab qolmagan
  - Maqtov: mijoz botdan mamnun ekanini aytgan
  - Shovqin: bunga e'tibor berish shart emas
- Javob izohlari:
  - To'g'ri: Bot kutilgan ishni bajarmayapti — bu bug.
  - Taklif: Taklif — yo'q narsani so'rash; bu yerda bor narsa buzilgan.
  - Maqtov: Mijoz bir narsani ikki marta yozdi — bu norozilik.
  - Shovqin: Aksincha, bu aniq fikr: nima buzilgani aytilgan.
- Test yozuvlari (4 va 7-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz.
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · Nimani birinchi
- Eyebrow: Tushuncha · tanlov
- Sarlavha: Beshta fikr, bitta kun. Qaysi birini birinchi?
- Mentor: Hammasini bir kunda tuzatib bo'lmaydi — **har fikrni** bosib, nechta odam aytgani va botga qanchalik zarar qilganini ko'ring.
- Chastota chiziqlari (har qator bosiladi; bosilgach o'ngda izoh ochiladi; chiziq uzunligi odam soniga mos):
  - Narx ko'rinmaydi — 18 — ta'sir: buyurtmadan oldin ketadi — birinchi
  - Tez va qulay — 6 — maqtov: tegilmaydi, buzilmasin
  - Bot sekin — 5 — noaniq: avval «qaysi javob?» deb so'raladi
  - Glutensiz — 3 — taklif: «hozir emas» — kam odam
  - Manzil 2 marta — 2 — bug: kichik, navbatda
- Xulosa (5/5 dan keyin): Ko'p odam aytgan va qattiq qiynagan — birinchi. Qolganiga «hozir emas» deyish ham qaror.
- Tugmalar: Orqaga · 5 fikrni ko'ring (N/5) → Davom etish

## 6 · Amaliyot 2 — v2
- Eyebrow: Amaliyot 2 · v2
- Sarlavha: Tanlangan fikrni tuzating, eskisini buzmang.
- Mentor: Tuzatish laptopda — serverdagi bot shu payt jim turadi, bu normal; **«1 · Ochish»**dan boshlang.
- Qadamlar (har birida «Bajardim» tugmasi):
  1. Ochish — Antigravity'da `telegram.service.ts`, terminalda `npm run start:dev` → «Telegram bot ulandi» (polling: serverdagi webhook o'chdi, A3 da qaytadi).
  2. Prompt — `FIKRLAR.md` dagi aniq o'zgarishni qavsga qo'ying, «Nusxalash», Antigravity'ga.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       FIKRLAR.md dagi v2 o'zgarishi: {qayerda} da {nima o'zgarsin}. {nima buzilmasin}. Boshqa joyga tegma, o'zgargan qatorlarni ayt.
       ```
  3. Ishga tushirish — terminal xatosiz. Antigravity aytgan qatorlarni o'qing: faqat kerakli joy o'zgarganmi (4 tekshiruv — 5-dars).
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Telegramda tekshirish — avval tuzatilgan joy; keyin eski uch narsa: `/start`, menyu tugmalari, bitta buyurtma oxirigacha. Hammasi ishlasa — v2 tayyor.
- Kutilgan natija · namuna: AvtoPizza v2 (chat):
  - mijoz: «Margarita» bosildi
  - bot: Margarita — 45 000 so'm. Buyurtma qabul qilindi. Manzilingizni yozing.
  - mijoz: Chilonzor 5
  - bot: Buyurtma tasdiqlandi: Margarita — 45 000 so'm · Chilonzor 5
- Hammasi bajarilgach: v2 laptopda ishlaydi. Eski narsalar ham joyida.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-09-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Vaqt oz. 18 kishi: narx ko'rinmaydi, buyurtma bermay ketadi. 3 kishi: glutensiz pitsa yo'q. Birinchi nimani?
  - Glutensiz pitsani: yangi taom ko'proq mijoz olib keladi
  - Ikkalasini birga: hech bir fikr kutib qolmasin
  - ✔ Narxni: u ko'p odamni buyurtmadan to'xtatyapti
  - Hech birini: bular oddiy shikoyat, jiddiy emas
- Javob izohlari:
  - To'g'ri: Narx muammosi ko'p odamda (18) buyurtmani to'xtatadi — chastota ham, ta'sir ham katta.
  - Glutensiz: Yangi taomni 3 kishi so'ragan, narxni 18 kishi.
  - Ikkalasi: Vaqt oz bo'lsa, ikkalasi ham chala chiqadi.
  - Hech biri: 18 kishi bir xil shikoyat qildi — bu jiddiy fikr.
- Test yozuvlari: 4-ekrandagidek.
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 8 · Amaliyot 3 — Render
- Eyebrow: Amaliyot 3 · Render
- Sarlavha: v2 ni serverga chiqaring va qayta so'rang.
- Mentor: Tuzatish ishladimi — buni siz emas, o'sha odam aytadi; **«1 · Push»**dan boshlang.
- Qadamlar (har birida «Bajardim» tugmasi):
  1. Push — laptopdagi botni to'xtating (Ctrl+C), keyin uch buyruq.
     ```
     git add -A
     git commit -m "9-dars: v2 — {nima tuzatildi}"
     git push
     ```
  2. Render — render.com'da xizmatingiz o'zi qayta joylanadi (Auto-Deploy). Loglarda 2–4 daqiqada «Telegram bot ulandi (webhook)».
     - Xato izohi: Xato bo'lsa, log matnini Antigravity'ga: «Render logida shu xato: {xato}. Sabab nima?»
  3. Telefondan tekshirish — tuzatilgan joy serverda ham ishlaydi (birinchi javob 30–60 s kechikishi mumkin).
  4. Qayta o'lchash — 8-darsdagi odamga yana bering va yana so'rang: «qayerda to'xtab qoldingiz?». Javobni `FIKRLAR.md` ga yozing.
     - Prompt qutisi (Shablon → FIKRLAR.md · Nusxalash):
       ```
       ## v2 dan keyin
       {odam nima dedi} — {shikoyat qoldimi / yo'qoldimi}. Keyingi: {ro'yxatdagi navbatdagi fikr}.
       ```
- Kutilgan natija · terminal + Render log:
  ```
  $ git push
  To https://github.com/{siz}/TelegramBotNest.git
  …
  Render ▸ Deploying commit 7c1e2b4 "9-dars: v2 — narx"
  Render ▸ Telegram bot ulandi (webhook)
  ```
- Hammasi bajarilgach: v2 serverda. Keyingi iteratsiya `FIKRLAR.md` dagi navbatdagi qatordan boshlanadi.
- Pastki qator (Ortda qoldingizmi o'rniga): Bitta iteratsiya: tinglang → tanlang → tuzating → chiqaring → qayta o'lchang.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting

## 10 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ v2 serverda · N/2 to'g'ri
- Sarlavha: Bot fikr bilan o'sadi — siz buni bir marta qildingiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Takrorlash — kartochkalar (12; old tomonida savol, ochilganda javob va izoh):

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Fikr yig'ish → tuzatish → yangi versiya → yana fikr. Bu takror? | Iteratsiya | Har iteratsiyada bot biroz yaxshilanadi |
| Fikrlar qaysi uch turga ajratiladi? | Bug, taklif, maqtov | Tuzatish · o'ylab ko'rish · saqlash |
| «Bot manzilimni ikki marta so'radi» — qanday fikr? | Bug | Bot kutilgan ishni bajarmayapti |
| Mijoz botda yo'q narsani so'rasa? | Taklif | Hozir qo'shilmaydi — ko'pchilikka kerakmi |
| Aniq fikr noaniqdan nimasi bilan farq qiladi? | Unda joy va muammo bor | Noaniqni avval aniqlashtirasiz: «aynan qayerda?» |
| Qaysi tuzatish birinchi — nimaga qarab? | Chastota va ta'sir | Nechta odam · buyurtmani to'xtatadimi |
| Kam odamga kerak taklifga nima deysiz? | «Hozir emas» | Bu ham qaror — asosiy ish saqlanadi |
| Fikrlar ro'yxati qayerda turadi? | FIKRLAR.md | Repo'da — keyingi iteratsiyalar ham shu yerda |
| Antigravity'ga shikoyatni emas, nimani berasiz? | Aniq o'zgarishni | qayerda · nima o'zgarsin · nima buzilmasin |
| Tuzatgandan keyin eski narsani nega tekshirasiz? | Buzilmaganini bilish uchun | /start, menyu, buyurtma — uchalasi |
| Ko'p odam suhbatning bir joyida ketib qolsa? | Ketib qolish (drop-off) | O'sha qadamda nimadir xalaqit beradi |
| Tuzatishni chiqargandan keyin nima qilasiz? | Qayta o'lchaysiz | O'sha odamdan yana so'raysiz; keyingi iteratsiya shundan |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Keyingi dars — **«AI-agent yaratish»**. Botga maqsad berasiz — keyingi qadamni u o'zi tanlab, asbob chaqiradi: masalan, buyurtmani bazaga saqlaydi.
- Nishonlaringiz — N/3 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: Nishonlaringiz — N/3
- **Feedback Sorter** — Fikr turini to'g'ri aniqladingiz (4-ekran)
- **Right Fix First** — Eng ta'sirli tuzatishni birinchi tanladingiz (7-ekran)
- **Full Iteration** — Bitta to'liq iteratsiyani o'zingiz bosib o'tdingiz (8-ekran, amaliyot tugagach)

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran — Uch tur, ikki aniqlik
   - 1 · Bug — Bor narsa noto'g'ri ishlayapti. Tuzatiladi.
   - 2 · Taklif — Yo'q narsa so'ralgan. O'ylab ko'riladi.
   - 3 · Maqtov — Nima yaxshi ishlayotganini aytadi. Buzilmasin.
   - Sinfga savol: «Manzilimni 2 marta so'radi» — qaysi tur?
2. 7-ekran — Chastota va ta'sir
   - 18 · Chastota — Nechta odam aytgan.
   - 2 · Ta'sir — Buyurtma to'xtaydimi yoki shunchaki noqulaymi.
   - 3 · «Hozir emas» — Kam odamga kerak narsa navbatda turadi.
   - Sinfga savol: 18 kishi narx, 3 kishi glutensiz — birinchi nima?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: iteratsiya · v2 · bug · taklif · chastota · ta'sir · voronka · ↻ · fikr

1. Foydalanuvchi: «/start bosdim, menyu tugmasi chiqmadi». Bu qanday fikr?
   - Maqtov: mijoz botdan mamnun
   - ✔ Bug: aniq joy va muammo bor
   - Taklif: yangi narsa so'ralgan
   - Shovqin: e'tibor shart emas
2. «Yaxshi bot» degan fikr nega kam foydali?
   - Chunki bu salbiy fikr
   - Chunki maqtov kam uchraydi
   - Chunki botni yomon ko'rsatadi
   - ✔ Chunki aniq joy aytilmagan
3. 18 kishi bir xil shikoyat qildi, 1 kishi boshqa narsani aytdi. Qaysi birini birinchi ko'rib chiqasiz?
   - ✔ 18 kishinikini: ko'pchilik aytgan
   - 1 kishinikini: u eng birinchi yozgan
   - Ikkalasini ham bir vaqtning o'zida
   - Hech birini: bular shunchaki hissiyot
4. Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz?
   - Eng jahl bilan yozilgan fikrga qarab
   - Eng birinchi kelgan fikrga qarab
   - ✔ Ko'p aytilgani va qattiq qiynaganiga
   - O'zimga eng qiziq tuyulganiga qarab
5. Voronkada eng katta yo'qotish qayerda ko'rinadi?
   - Eng ko'p odam turgan birinchi qadamda
   - ✔ Odam soni eng ko'p kamaygan joyda
   - Bot eng sekin javob bergan joyda
   - Eng ko'p maqtov kelgan qadamda
6. Menyu tugmasi tuzatilgach, menyuni ochmasdan ketganlar 60 dan 15 ga tushdi. Bu nimani bildiradi?
   - Tuzatish ishlamadi, hamma ketyapti
   - Sonlar tasodifiy, xulosa chiqmaydi
   - Botda yana yangi bug paydo bo'ldi
   - ✔ Tuzatish ishladi, muammo kamaydi
7. «Bot ahmoq» sharhiga javob yozish nega eng ta'sirli tuzatish emas?
   - ✔ Unda nimani tuzatish kerakligi yo'q
   - Bunday sharhga javob yozib bo'lmaydi
   - Uni yozgan odam botni ishlatmagan
   - Javob yozish juda ko'p vaqt oladi
8. 100 kishidan bittasi faqat o'ziga kerak narsani so'radi. Nima qilasiz?
   - Darrov qo'shaman: har so'rov bajarilsin
   - U foydalanuvchini botdan bloklayman
   - ✔ Avval ko'pchilikka keraklisini qilaman
   - Hamma so'rovni navbati bilan qo'shaman
9. Tuzatishdan keyin nima qilasiz?
   - Hech narsa: tuzatish albatta ishlaydi
   - ✔ Qayta o'lchayman: shikoyat kamaydimi
   - Darhol yana katta o'zgarish qilaman
   - Fikr yig'ishni butunlay to'xtataman
10. Botingizning birinchi versiyasi chiqdi. Ish tugadimi?
   - ✔ Yo'q: bot fikr bilan yaxshilanib boradi
   - Ha: birinchi versiya — tayyor mahsulot
   - Testlarning hammasi o'tib bo'lsa — tugadi
   - Bir hafta shikoyat kelmasa — tugadi
11. Noaniq fikr («menyu chalkash») aniq o'zgarishdan nimasi bilan farq qiladi?
   - Farqi yo'q, ikkalasi bir xil ishlatiladi
   - Noaniq fikr odatda yolg'on bo'ladi
   - Aniq o'zgarishni faqat dasturchi tushunadi
   - ✔ Fikr shikoyat, aniq o'zgarish esa vazifa
12. Aniq maqtovni («tez va qulay, rahmat!») nega e'tiborsiz qoldirmaysiz?
   - Chunki maqtovni ham tuzatish kerak
   - Chunki maqtov yozganga chegirma beriladi
   - ✔ Chunki u nima yaxshi ishlashini aytadi
   - Chunki maqtovda eng ko'p bug bo'ladi
