# 11-Modul (kod: `src/9-Modull`) · 12-dars «Loyiha kuni: 2-asosiy funksiya» — MD v3 (loyiha kuni qolipi)

Fayl: `src/9-Modull/FeatureTwoLesson.jsx` · kalit `m9-12` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (SABOQ 12: kartochkalar alohida ekran) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · tip AI-PRAKT (dastur: «Vibe-coding: 2-funksiya — ikkinchi asosiy funksiya» → natija «2-funksiya tayyor») ·
eng yaqin namuna: 11-Modul `10-FoundationDay-v3.md` (blok modeli, trek farqi), 9-Modul `07-MvpFirstScreen-v3.md` va uning FILTR fayli, 9-Modul `10-PmUsabilityTest-v3.md` (kuzatuv yozuvi — uyga vazifa uchun). Matn ko'chirilmadi.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul C 19–31, majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan,
Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket ·
«Maydon Jamoa» nomi o'z rangida, telefon maketida · telefon maketi doim chapda, chizma va jadval o'ngda · ekranda ≤ 3 blok · yakuniy holat ixcham · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **A**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 · A2 · A3 — har biri ≈ 20; tayanch 9.1).
Menyu nomi (DE-205): App.jsx `m9-12` — «Loyiha kuni: 2-asosiy funksiya» (osti: «roadmap'dagi ikkinchi funksiya») ·
oldingi dars `m9-11` «Loyiha kuni: 1-asosiy funksiya» · keyingi `m9-13` «Uch foydalanuvchidan keyin nimani tuzatasiz?» (App.jsx 382–384-qatorlar, grep bilan; `comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida Mentor misoli «Maydon Jamoa» ilovasida **o'yin kuni tasdiq** ishlaydi (tayanch 1.4 F2, 1.7 «12»): o'yin kuni qo'shilgan o'yinchi «Kelaman»ni bosadi,
   `POST /oyinlar/:id/tasdiq` faqat o'yin kuni va faqat qo'shilganlarga ruxsat beradi, tashkilotchi «O'yin» ekranida «Kelishini tasdiqladi: 7 / 9» ni ko'radi.
   Teg: `m11-dars-12-start` (= `m11-dars-11-done`) → `m11-dars-12-done` (tayanch 3, aynan). O'quvchi xuddi shu ishni uch blokda **o'z repo'sida, o'z roadmap'idagi 2-funksiya** bilan quradi;
   «Maydon Jamoa» — namuna. Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi. Uyga — 3 kishi bilan sinov (istisno, Qaror-0 16).
2. **Bugungi asosiy fikr (P-013):** Har harakatda savol bor: kim va qachon bosa oladi. Ruxsatni Backend beradi — tugma noto'g'ri joyda chiqsa ham, Database'ga ruxsatsiz yozuv tushmaydi;
   ilova tugmani faqat ruxsat bor joyda ko'rsatadi, boshqa odam esa natijani so'rov bilan — ekranni ochganda yoki pastga tortganda — ko'radi.
   Agent talabga tayanib quradi, aytilmagan joyni taxmin qilishi mumkin (tayanch 7.2) — har blokning 4-qadami shu tekshiruv.
3. **Blok ketma-ketligi — Mentor misolining uch bo'lagi** (ko'p funksiyaga mos, lekin hammasiga emas — 12-FILTR 2): A1 **harakat va ruxsat** (Backend yo'li + tugma; tugma hozircha ruxsat yo'q joyda ham turadi — ruxsatni telefonda ko'rish uchun) →
   A2 **natija boshqa odamda** (ikki telefon, pastga tortib yangilash) → A3 **tugma faqat ruxsat bor joyda** (Backend'dagi qoida joyida qoladi). Mentor misolida bu — «Kelaman» → «Kelishini tasdiqladi» → «Kelaman» faqat o'yin kuni.
   O'quvchi funksiyasida alohida qoida yoki natijani ko'radigan boshqa odam bo'lmasa — har blokda funksiyasining mos qismini quradi (A1 «Ochish»da bir gap; tayanch 9.89).
4. **Texnik aniqlik (tayanch 1.6, 1.7, 3, 6 — aynan; taxmin emas):**
   - Jadval: `ishtirokchilar` (`oyin_id` · `oyinchi_id` · `holat`: `qoshildi` / `keladi` / `navbatda` / `chiqdi` · `yaratilgan`). Bugun holat `qoshildi` → `keladi`; `navbatda`, `chiqdi` — 14-dars.
   - Yo'l: `POST /oyinlar/:id/tasdiq` — faqat token bilan (10-dars), faqat o'yin kuni va faqat o'yinga qo'shilgan o'yinchiga. Rad javobi — **`403`** va sabab (tayanch 9.32):
     «Tasdiq faqat o'yin kuni» · «Siz bu o'yinga qo'shilmagansiz». 4a-Modul ko'prigi (`NestArchPracticeLesson`): «Token yo'q bo'lsa — 401, token bor, lekin rol yetmasa — 403» · «Tugmani yashirish himoya emas — server baribir 403 beradi». Bu darsda `403` — rol emas, qoida (kun, qo'shilganlik); o'quvchi matnida «ruxsat yo'q».
   - `oyinlar.kun` — sana, ekranda kun nomi; «o'yin kuni» — Toshkent vaqti bilan (tayanch 9.30; namuna talabda bitta qator). Tugma ko'rinishi uchun ilova sanani o'zi solishtirmaydi — Backend `menTasdiqlayOlaman` beradi (9.87). Namuna o'yinlar — keyingi shanba va yakshanba sanalari bilan.
   - «O'yin» ekrani yagona `GET /oyinlar` javobidan o'qiydi (`/:id` yo'q, tartib — `yaratilgan`; tayanch 9.29); bugun javobga `tasdiqlagan`, `menTasdiqlaganman`, `menTasdiqlayOlaman` qo'shiladi (11-darsdan — `qoshilgan`, `menQoshilganman`; `qoshilgan` — `qoshildi` va `keladi`, 9.74: «Kelaman»dan keyin «/ 9» o'zgarmaydi).
   - Tashkilotchi o'z o'yiniga avtomatik qo'shilmaydi (9.31) · tasdiq sonini tashkilotchi ko'radi, o'yinchi — «Tasdiqladingiz» (9.33) · «Hisobdan chiqish» — 10-darsdan (9.34).
   - Real vaqt nuqtasi (8-dars, tayanch 1.6): «Kelaman» belgilari va tasdiq soni — **11-Modulda ekran ochilganda va pastga tortib yangilaganda so'raydi**; o'zi yangilanishi — 12-Modulda (o'quvchi matnida aytilmaydi, T-038).
   - Pastga tortib yangilash — React Native `RefreshControl`: «used inside a ScrollView or ListView to add pull to refresh functionality» (reactnative.dev/docs/refreshcontrol, 06.10);
     ekran ochilganda — Expo Router `useFocusEffect` («the effect re-runs each time the screen comes into focus», docs.expo.dev/router/reference/hooks, 06.10). Ikkalasi faqat REPO va KOD da; o'quvchi matnida — «pastga tortish».
   - Render: «Whenever you push or merge a change to that branch, by default Render automatically rebuilds and redeploys your service» (Auto-Deploy «On Commit» — default);
     «All service types redeploy with zero downtime» — yangi versiya tayyor bo'lguncha eski Backend javob beradi (render.com/docs/deploys, 06.10).
   - Expo Go (tayanch 6): QR — bitta Wi-Fi; ishlamasa `npx expo start --tunnel`; iPhone'da «Expo Go opens your project only when Expo CLI and Expo Go are signed in to the same Expo account» (docs.expo.dev/get-started/start-developing, 06.10).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **tasdiq** · «Kelaman» (tugma) · «Tasdiqladingiz» (bosilgandan keyingi o'chiq holat — 7-darsdagi «Qo'shildingiz» naqshi; tayanch 9.33, 9.41) · «Kelishini tasdiqladi: 7 / 9» (tashkilotchida, tayanch aynan).
   - **qoida** — harakatga kim va qachon ruxsat olishi (Mentor misolida: faqat o'yin kuni, faqat qo'shilganlarga). **ruxsat** — Backend beradi yoki rad etadi.
     «Tekshirish» faqat o'quvchining o'z ishiga (blokning 4-qadami, tayanch 2) — Backend uchun «ruxsat beradi / rad etadi» (T-015).
   - **pastga tortish** (pastga tortib yangilash) · **real vaqt nuqtasi** (8-darsdan, qayta ta'riflanmaydi — joriy qatorda ko'prik).
   - **tashkilotchi** · **o'yinchi** · **e'lon** · «Qo'shilaman» · «Qo'shildingiz» · «O'yin to'ldi» — tayanch 2 va 7, 11-darslar.
   - **Backend** · **Database** · **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **tekshirish** · **token** · **sinov** (faqat uyga vazifada — real odam bilan) · **kuzatuv yozuvi** · **to'xtash** (9-Modul).
   - **Ishlatilmaydi:** server (prozada), refresh, real-time, bron, zayavka, ficha, «Chiqish» (F3 tugmasi — 14-dars; T-015), «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova ekrani; dars ekrani — «mashq»).
6. **Metafora yo'q. Keyssiz** (tayanch 5: loyiha kuni). Real kompaniya raqami yo'q. Raqamlar — faqat Mentor misolidan (`7 / 9` — tayanch 1.7; «10 kishi kerak edi, 7 kishi keldi» — tayanch 1.3, 1-yozuv);
   namuna ma'lumot (`oyinchi_id 2` — 10-darsdagi `Ali`) — qahramon emas, jadval qatori (tayanch 9.2, 9.8).
7. **Amaliyot bloki (tayanch 4, 9.1):** o'quvchi 4 qadamning **hammasini o'z repo'sida, o'z mahsuloti va trekida** bajaradi (Ochish → Prompt → Ishga tushirish → Tekshirish); 5-qadam yo'q.
   Mentor misoli — namuna: o'ngda kutilgan natija «namuna: Maydon Jamoa», «Yordam» ortida — Mentor misolidagi to'liq prompt.
   Talab zinapoyasi (tayanch 4): **11, 12, 14 — uch qatorni o'quvchi yozadi, namuna «Yordam» ortida** — uchala blokda ham. Har blok tepasida bitta qator «Vazifa: …» (umumiy, mahsulotga bog'liq emas).
   Roadmap'dagi 2-funksiya nomi — `pm-m9d6-roadmap` dan (A1 tepasida); kalit yo'q bo'lsa — o'quvchi o'zi yozadi (M-q5). Trek (`pm-m9d8-platforma`) farqi — «Yordam» ostida bir gap (9.7).
   Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» (faqat xato qatori, `.env` qiymatlari va token yuborilmaydi — 9.81)
   Push odati (10-Moduldan, tayanch 3): `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil · `git add <fayl>` (`git add .` emas).
8. **Uyga vazifa — istisno (Qaror-0 16, tayanch 1.8, 4):** auditoriyadan 3 kishi bilan sinov, 9-Modul kuzatuv yozuvi shaklida; sinovchi o'quvchining telefonida ishlatadi (unga Expo Go o'rnatish shart emas);
   vazifa — o'z mahsulotining asosiy harakati (faqat bugungi 2-funksiya emas — 12-FILTR 35); Mentor misolida: «Shanba soat 18:00 dagi o'yinga qo'shiling.» 13-dars shu yozuvlardan boshlanadi.
9. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, Backend, jadval maketlari chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3).
   Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon Jamoa» (Mentor misoli, repo `maydon-jamoa`) — mahalladagi mini-futbol uchun jamoa yig'adigan mobil ilova. 11-darsda 1-funksiya qurilgan: e'lon berish, «Qo'shilaman», «8 / 10» Backend'dan, «O'yin to'ldi».
  Bugun roadmap'dagi ikkinchisi — o'yin kuni tasdiq (muammo gapining ikkinchi yarmi: «… kim aniq kelishini bilishda qiynaladi»). Kutilgan natija doim «Maydon Jamoa» bilan ko'rsatiladi; o'quvchi har blokni o'z 2-funksiyasida bajaradi.
- **Hook:** tashkilotchi telefonida Shanba 18:00 dagi o'yin — to'qqiz kishi qo'shilgan; kim aniq kelishi ko'rinmaydi.
- **Ip (ot-shaklda):** Harakat va ruxsat → Natija boshqa telefonda → Tugma faqat ruxsat bor joyda.
- **Bitta vizual — «Tasdiq sahnasi»** (`TASDIQ` const → `TasdiqSahna`, dars bo'yi, 163/180):
  - chapda **telefon(lar)** — «Maydon Jamoa» (Expo Go), nom o'z rangida, barqaror o'lcham (≈170×272, SABOQ 22); «O'yin» ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «9 / 10» · qo'shilganlar — ismsiz doiralar (tayanch 9.15) ·
    tugmalar «Qo'shildingiz» (o'chiq) / «Qo'shilaman» · «Kelaman» → «Tasdiqladingiz» (o'chiq). Tashkilotchi telefonida — «Kelishini tasdiqladi: N / 9», tasdiqlaganlar doirasi yashil ✓. Telefon ramkasi ustida kichik yorliq: «o'yinchi» yoki «tashkilotchi» va «Bugun: shanba» (ilova tashqarisida — sahna sharti).
  - o'ngda **Backend** qutisi — yo'l `POST /oyinlar/:id/tasdiq` va ikki qoida katagi: «O'yin kunimi?» · «Qo'shilganmi?» (har biri bo'sh → yashil ✓ / qizil ✗);
    ostida **Database · `ishtirokchilar`** jadval-kartasi (2–3 qator `oyin_id · oyinchi_id · holat`) yoki bitta jonli hisoblagich («`keladi` · 6 · `qoshildi` · 3» — SABOQ 24).
  - Holatlar: kulrang (hali yo'q) → oq (ishlaydi) → accent (joriy) → yashil (yozildi / ruxsat) → qizil (`403`). Konvert — so'rov; uzuq chiziq — so'rov yo'q (U-041: faqat bo'sh joy uchun).
  - Namuna o'yinlar (tayanch 9.2; `oyin_id` — shu tartibda): 1 · Shanba 18:00 · Mahalla maydoni · 9 / 10 (8 namuna + `oyinchi_id 2`, 11-darsda qo'shilgan) · 2 · Shanba 20:00 · Maktab maydoni · 6 / 10 ·
    3 · Yakshanba 10:00 · Park maydoni · 4 / 8 · 4 · Yakshanba 17:00 · Mahalla maydoni · 9 / 10.
  - Ishlatilishi: 0 (tashkilotchi telefoni, bo'sh qator) · 1 (tayyor holat) · 2 (o'yinchi telefoni + Backend + jadval) · 4 (ikki telefon + hisoblagich) · A1–A3 o'ng (kutilgan natija).
  - `prefers-reduced-motion` da konvert, pulsatsiya va son o'zgarishi harakatsiz, holatlar bir zumda almashadi.
- **Yakun:** 2-funksiya tayyor · uyga — 3 kishi bilan sinov · keyingi dars — sinov yozuvlaridan tuzatish.

---

## 0 · Kirish — to'qqiz kishi qo'shilgan  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Qo'shilgan o'yinchilarning hammasi maydonga keladimi?** (51)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Shanba kuni soat 17:00 da tashkilotchi telefonida 18:00 dagi o'yin turibdi, to'qqiz kishi qo'shilgan — avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Navbatdagi harakat (halqa + yengil pulsatsiya): uchta variant guruhi.
- Maket (chap): bitta telefon, ustida yorliq «tashkilotchi» · «Bugun: shanba, 17:00»; «Maydon Jamoa» «O'yin» ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · **9 / 10** ·
  10 joy: 9 ta to'la doira, 1 ta bo'sh (uzuq chiziq). Tugma qatori yo'q (tashkilotchi ko'rinishi; u avtomatik qo'shilmaydi — 9.31).
- Savol: **Sizningcha, qaysi biri?**
  - Ha — to'qqizalasi ham o'zi bosib qo'shilgan (43)
  - Ha — kelolmasa, ilovaning o'zida xabar beradi (45)
  - Bilib bo'lmaydi — qo'shilish kelish degani emas (45)
- Javob — 3-variant: **Aynan!** Qo'shilgan odamning rejasi o'zgarishi mumkin. Mentor intervyusida: «10 kishi kerak edi, 7 kishi keldi». (110)
- Javob — 1-variant: **Qiziq fikr!** Qo'shilgan kuni hamma kelmoqchi edi. O'yin kunigacha reja o'zgarishi mumkin — ilova buni ko'rsatmaydi. (114)
- Javob — 2-variant: **Qiziq fikr!** Ilovada bunday joy hali yo'q — tashkilotchi kim aniq kelishini ko'rmaydi. (85)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → to'qqiz doira ichida navbat bilan «?» paydo bo'ladi (60–120 ms oraliq, SABOQ 19) → telefon ostida bo'sh kulrang qator sirg'alib kiradi:
  «Kelishini tasdiqladi: — / 9» va yonida kichik yorliq «hali yo'q».
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): tashkilotchi kim aniq kelishini bilmaydi (muammo gapi, tayanch 1). Variantlar «Ha — …» ×2 / «Bilib bo'lmaydi — …» (2 / 1, ✔ yolg'iz shaklda — 10-darsdagi naqsh, §147 juftlik);
  uzunlik 43–45. «10 kishi kerak edi, 7 kishi keldi» — tayanch 1.3, 1-yozuv (Telegram davri), «Mentor intervyusida» deb chegaralangan. Maketda «nechta keldi» raqami yo'q — o'ylab topilgan son yo'q (§36).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida roadmap'dagi ikkinchi funksiya ishlaydi.** (51)
- Mentor: Bugun roadmap'dagi ikkinchi funksiyani qurasiz. Mentor misolida bu — o'yin kuni tasdiq: o'yinchi «Kelaman»ni bosadi, tashkilotchi kim aniq kelishini ko'radi.
- Chap — «Dars oxirida»: Tasdiq sahnasi **tayyor** holatda, bir marta o'zi yuradi (DE-200): o'yinchi telefonida «Kelaman» → konvert `POST /oyinlar/1/tasdiq` → Backend'da ikki katak yashil ✓ →
  `ishtirokchilar` qatori `1 · 2 · keladi` (yashil) → tashkilotchi telefoni pastga tortiladi → «Kelishini tasdiqladi: 6 / 9» → «7 / 9», bitta doira yashil.
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Asosiy harakat: ruxsatni Backend beradi (39)
  - 02 · Natijani boshqa odam o'z telefonida ko'radi (43)
  - 03 · Tugma faqat ruxsat bor joyda chiqadi (36)
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m11-dars-12-start` · namuna `m11-dars-12-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni roadmap'ingizdagi 2-funksiya bilan, o'z mahsulotingizda bajarasiz.
- Tugmalar: Orqaga · Boshlaymiz
✎ Mentorning birinchi gapi — App.jsx menyu osti yozuvi (P-015). Qadamlar ko'p funksiyaga to'g'ri keladi; mos kelmasa — A1 «Ochish»dagi gap (12-FILTR 2). Mentor misoli — chap tomonda. «ruxsat» shu yerda oddiy so'z bo'lib keladi, 2-mashqda ko'rinadi (T-011).

## 2 · Uch «Kelaman» — qaysi biri yoziladi?  ← QTushuncha
- Eyebrow: Tushuncha · ruxsat
- Sarlavha: **Uch «Kelaman»dan qaysi biri Database'ga yoziladi?** (49)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Ilovada «Kelaman» hozircha har o'yinda turibdi — avval taxminingizni belgilang, keyin uchala o'yinda bosing.
  - harakat paytida: Telefondagi «Kelaman»ni bosing va Backend'dagi ikki katakni kuzating.
  - o'yinlar orasida: Endi «Keyingi o'yin ›»ni bosing va u yerda ham «Kelaman»ni sinab ko'ring. ✎ F-1006-279: navbatdagi tugma «Keyingi o'yin ›» edi, Mentor «Kelaman» der edi (SABOQ 34)
  - tugagach: Uchala bosish tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada (kirishda yengil ko'tariladi, variantlar navbat bilan): **Uch bosishdan nechtasi Database'ga `keladi` yozadi?** · Bittasi · Ikkitasi · Uchalasi.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chap (telefon, ustida «o'yinchi» · «Bugun: shanba»): «O'yin» ekrani **bittadan** — yorliq «O'yin N / 3»; harakat tugmasi telefonning o'zida («Kelaman», halqada); keyingisi — telefon ostidagi «Keyingi o'yin ›» (SABOQ 9, 13, 21). Tartib:
  1. «Shanba, 18:00» · «Mahalla maydoni» · «Qo'shildingiz» (o'chiq) · «Kelaman»
  2. «Yakshanba, 10:00» · «Park maydoni» · «Qo'shildingiz» (o'chiq) · «Kelaman»
  3. «Shanba, 20:00» · «Maktab maydoni» · «Qo'shilaman» · «Kelaman»
- O'ng (chizma): Backend qutisi — `POST /oyinlar/:id/tasdiq`, ikki bo'sh katak «O'yin kunimi?» · «Qo'shilganmi?»; ostida `ishtirokchilar`: `1 · 2 · qoshildi` · `3 · 2 · qoshildi` (o'yin 2 uchun qator yo'q).
- **Harakat → Vizual o'zgarish:**
  - 1-o'yin «Kelaman» → konvert `POST /oyinlar/1/tasdiq` telefondan Backend'ga uchadi → «O'yin kunimi?» ✓ · «Qo'shilganmi?» ✓ (navbat bilan «tushadi») → `1 · 2 · qoshildi` qatori `keladi` ga almashadi va ~1 s yashil yonadi →
    javob konverti qaytadi → telefonda tugma o'chiq «Tasdiqladingiz» bo'ladi.
  - 2-o'yin «Kelaman» → konvert `POST /oyinlar/3/tasdiq` → «O'yin kunimi?» ✗ (qizil) — ikkinchi katak kulrang qoladi → javob konverti qizil `403 · Tasdiq faqat o'yin kuni` →
    telefonda tugma ostida qizil qator shu gap bilan; `3 · 2 · qoshildi` qatori o'zgarmaydi.
  - 3-o'yin «Kelaman» → konvert `POST /oyinlar/2/tasdiq` → «O'yin kunimi?» ✓ · «Qo'shilganmi?» ✗ → qizil `403 · Siz bu o'yinga qo'shilmagansiz` → telefonda qizil qator; jadvalda yangi qator paydo bo'lmaydi.
  - Holat o'quvchi bosgan o'yinlardan chiziladi (P-046); noto'g'ri tanlov yo'q — qaror bashoratda, natija harakatda.
- Joriy qator (3/3 dan keyin, bitta): Token bor, lekin ruxsat yo'q bo'lsa — `403`. Token yo'q bo'lsa — `401`. (67)
- Natija qatori (xulosaning birinchi qatori, SABOQ 25): «Taxminingiz: … · haqiqatda: bittasi — o'yin kuni va qo'shilgan o'yinchi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Ruxsatni Backend beradi: tugma noto'g'ri joyda tursa ham, Database'ga faqat ruxsat bor tasdiq yoziladi. (103)
- Tugadi (199): harakat paneli va «Keyingi o'yin ›» yopiladi; telefon (oxirgi holat), Backend kataklari va `ishtirokchilar` butun enga, `keladi` qatori fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → «Kelaman»ni bosing / o'yinlar orasida «Keyingi o'yin ›»ni bosing → Davom etish ✎ F-1006-279: «(N/3)» olindi — tepada «O'yin N / 3» chipi bor (ikki sanoq, pilot 10 naqshi)
✎ Ko'prik (P-020): 10-darsda `401` — tokensiz so'rov; bugun token bor, ruxsat yo'q — `403`. 4a-Modulda o'tilgan (`NestArchPracticeLesson`: «401/403», «Tugmani yashirish himoya emas»). Joriy qator shu ko'prik.
  Bashorat — bitta o'lchovning uch darajasi (§43). 1-savol shu qoidani boshqa vaziyatda so'raydi — tugma yashirilganda ham qoida kerakmi (§106).

## A1 · Amaliyot 1 — asosiy harakat va ruxsat  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · harakat va ruxsat
- Sarlavha: **Asosiy harakat ishlasin, ruxsatni Backend bersin.** (49)
- Mentor: Uch qatorning hammasi sizdan, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Tepada (bitta qator, `pm-m9d6-roadmap`): Roadmap'ingizdagi 2-funksiya: **{nom}** · kalit yo'q bo'lsa — 1-qadamda erkin qator «2-funksiyangiz nomi».
- Vazifa (prompt ustida, bitta qator): Foydalanuvchi asosiy harakatni bajaradi; kim va qachon qila olishini Backend hal qiladi — ruxsat bo'lmasa, rad etib sababini qaytaradi. Tugma hozircha ruxsat yo'q joyda ham tursin — rad javobini ko'rasiz.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (11-darsdagi holat: 1-funksiya ishlaydi). 2-funksiyangiz uchun ikki savolga javob toping:
     foydalanuvchi nimani bosadi? Kim va qachon bosa oladi? Javoblar «Nima qilsin» qatoriga kiradi (Mentor misolida: «Kelaman» · faqat o'yin kuni, faqat qo'shilgan o'yinchi).
     Funksiyangizda alohida qoida yoki natijani ko'radigan boshqa odam bo'lmasa — har blokda funksiyangizning mos qismini quring: harakat · natija qayerda ko'rinadi · tugma qachon chiqadi.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — yangi yo'l `POST /oyinlar/:id/tasdiq`; `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`).
     > Nima qilsin: «O'yin» ekranida «Kelaman» tugmasi bo'lsin — hozircha har o'yinda. Bosilsa, Backend o'yinchining `ishtirokchilar` dagi holatini `keladi` qilsin.
     > Ruxsat faqat o'yin kuni va faqat o'yinga qo'shilgan o'yinchiga; «bugun» — Toshkent vaqti bilan. Aks holda `403` va sabab qaytarsin: «Tasdiq faqat o'yin kuni» yoki «Siz bu o'yinga qo'shilmagansiz»;
     > ilova shu gapni tugma ostida ko'rsatsin. Tasdiqlangach tugma o'rnida «Tasdiqladingiz» (o'chiq).
     > Nima buzilmasin: «Qo'shilaman», «8 / 10» va «O'yin to'ldi» avvalgidek ishlasin; yangi yo'l ham faqat token bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida ilova papkasi o'rniga sayt papkangiz va o'yin sahifasi turadi; Backend qismi o'sha.
  3. **Ishga tushirish** — `git status` (ro'yxat agent aytgani bilan bir xil, `.env` yo'q) → har faylni `git add <fayl>` → `git commit -m "2-funksiya: harakat va ruxsat"` → `git push`.
     Render Backend'ni push'dan keyin o'zi qayta chiqaradi — Render sahifangizda yangi deploy tugashini kuting. Mobil trekda: `npx expo start`, QR'ni Expo Go bilan oching;
     QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`. Web-trekda: push — Netlify o'zi yangilanadi. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     (1) Ruxsat bor holatda asosiy harakatni bajaring — ekranda yangi holat (Mentor misolida: bugungi sana bilan e'lon berib, unga qo'shilib, «Kelaman» → «Tasdiqladingiz»).
     (2) Neon'dagi SQL Editor'da jadvalingizni oching — sizning qatoringizda yangi holat (Mentor misolida: `SELECT oyin_id, oyinchi_id, holat FROM ishtirokchilar;` → `keladi`).
     (3) Ruxsat yo'q holatda bosing — ilova Backend'ning sababini ko'rsatadi, jadval o'zgarmaydi. «Nima buzilmasin» qatoringizni ham tekshiring. Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; ustida «Bugun: shanba»; ikki kadr bir marta o'zi yuradi) + jadval-karta:
  - kadr 1: «Shanba, 18:00» · «Mahalla maydoni» · «9 / 10» · «Qo'shildingiz» · «Kelaman» → «Tasdiqladingiz» (o'chiq)
  - kadr 2: «Shanba, 20:00» · «Maktab maydoni» · «6 / 10» · «Qo'shilaman» · «Kelaman» → qizil qator «Siz bu o'yinga qo'shilmagansiz»
  - Neon · SQL Editor — `ishtirokchilar`: `1 · 2 · keladi`
- Hammasi bajarilgach (yashil): Asosiy harakat ishlaydi; ruxsat bo'lmasa, Backend sababini qaytaradi. (69)
- Qator (`QIzoh`, natija ostida): Push'dan keyin Render yangi versiyani chiqarguncha eski Backend javob beradi — yangi yo'l hali yo'q. (100)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-12-done` —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Blok modeli — tayanch 4 va 9.1: hamma qadam o'z repo'sida, Mentor misoli — namuna (o'ngda va «Yordam»da). Talab zinapoyasi — uch qator o'quvchidan (tayanch 4: 11, 12, 14).
  «Tugma hozircha har joyda» — ataylab: ruxsatni Backend berishini o'quvchi o'z telefonida ko'radi (4-qadam (3)); A3 tugmani yashiradi. Mentor misolida bugungi o'yin — 1-funksiya bilan e'lon qilinadi (namuna o'yinlar keyingi shanba va yakshanbada — 9.30); tashkilotchi unga «Qo'shilaman» bilan o'zi qo'shiladi (avtomatik emas — 9.31).
  `QIzoh` manbasi: render.com/docs/deploys («zero downtime»).

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Tugma faqat o'yin kuni chiqsa, Backend'dagi qoida kerakmi?** (8 so'z)
  - Kerak emas — tugma yo'q joydan so'rov ham kelmaydi
  - Kerak — Backend tugmani o'yin kuni o'zi ko'rsatadi
  - ✔ Kerak — ilova xato ko'rsatsa ham, qoida saqlanadi
  - Kerak emas — endi ruxsatni ilovaning o'zi beradi
- Kalit: **C** (index 2). To'rttalasi «Kerak / Kerak emas — sabab» shaklida, ikkitadan (S-006, §107); «tugma» A, B da, «ilova» C, D da, «ruxsat» faqat D da (S-003); to'g'ri variant yolg'iz eng uzun emas (o'lchov pastda).
- To'g'ri izohi: Tugma — qulaylik; ruxsatni Backend har so'rovda beradi. (55)
- Xato izohlari (≤60):
  - A: Mashqda tugma noto'g'ri joyda ham turdi — so'rov ketdi. (55)
  - B: Tugmani ilova chizadi; Backend so'rovga javob beradi. (53)
  - D: Ilova faqat ko'rsatadi. Database'ga kim yozadi? (47)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-mashqda tugma hamma o'yinda turgan edi; savol teskari holatni (tugma to'g'ri joyda) so'raydi — javob slayddan ko'chirilmaydi (§106). «xato ko'rsatsa» — ilovaga odam-fe'l emas (§28 — «adashsa» yo'q).

## 4 · Tashkilotchi sonni qachon ko'radi?  ← QTushuncha
- Eyebrow: Tushuncha · tashkilotchi ekrani
- Sarlavha: **Tashkilotchi yangi tasdiqni qachon ko'radi?** (43)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Avval taxminingizni belgilang, keyin o'yinchi telefonida «Kelaman»ni bosing.
  - bashoratdan keyin: O'yinchi telefonida «Kelaman»ni bosing. ✎ F-1006-279
  - 1-harakatdan keyin: Endi tashkilotchi telefonida ekranni pastga torting.
  - tugagach: Ikkala harakat tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada: **O'yinchi bosgach, tashkilotchida son qachon o'zgaradi?** · Bosgan zahoti · Tashkilotchi ekranni yangilaganda · O'yin boshlanganda.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chap (ikki telefon yonma-yon, o'lcham barqaror — SABOQ 22): «o'yinchi» — «Shanba, 18:00» · «Qo'shildingiz» · «Kelaman» (halqada) ·
  «tashkilotchi» — «Shanba, 18:00» · «9 / 10» · 9 doira (6 tasi yashil ✓) · «Kelishini tasdiqladi: 6 / 9»; ekran tepasida kichik tutqich «↓ torting» (2-harakatda halqada).
- O'ng (chizma): Backend qutisi va bitta jonli hisoblagich — `ishtirokchilar` · o'yin 1: `keladi` · 6 · `qoshildi` · 3 (SABOQ 24: to'liq jadval emas).
- **Harakat → Vizual o'zgarish:**
  - «Kelaman» (o'yinchi) → konvert `POST /oyinlar/1/tasdiq` → Backend → hisoblagich `keladi` 6 → 7 (sanab o'sadi, yashil), `qoshildi` 3 → 2 → o'yinchi telefonida «Tasdiqladingiz» →
    tashkilotchi telefonida «6 / 9» o'zgarmaydi; Backend bilan tashkilotchi telefoni orasida kulrang uzuq chiziq va yorliq «so'rov yo'q».
  - «↓ torting» (tashkilotchi) → telefon ekrani pastga siljiydi, tepada aylanuvchi belgi → konvert `GET /oyinlar` tashkilotchidan Backend'ga → javob konverti qaytadi → uzuq chiziq yo'qoladi →
    «6 / 9» → «7 / 9» (son almashadi va bir lahza kattalashib, silliq qaytadi — 9.14), yettinchi doira yashil ✓ bo'ladi.
- Joriy qator (2/2 dan keyin, bitta): 8-darsda shunday joyni real vaqt nuqtasi deb atagansiz. (55)
- Natija qatori: «Taxminingiz: … · haqiqatda: tashkilotchi ekranni yangilaganda» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu modulda son o'zi yangilanmaydi: tashkilotchi ekranni ochganda yoki pastga tortganda keladi. (94)
- Tugadi (199): harakat paneli yopiladi; ikki telefon va hisoblagich butun enga, «7 / 9» fokusda; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → Harakatlarni navbat bilan bajaring (N/2) → Davom etish
✎ Bitta g'oya (P-008): boshqa odam natijani so'rov bilan ko'radi. Konvert yo'nalishi muhim: `POST` — o'yinchidan, `GET` — tashkilotchidan; Backend'dan telefonga o'zi konvert ketmaydi.
  O'zi yangilanishi (12-Modul) o'quvchi matnida aytilmaydi (T-038) — xulosa «Bu modulda» bilan chegaralangan. 2-savol shu qoidani boshqa vaziyatda so'raydi (ikki o'yinchi, ekran ochiq).

## A2 · Amaliyot 2 — natija boshqa telefonda  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 2 · boshqa odam ko'radi
- Sarlavha: **Natijani boshqa odam o'z telefonida ko'rsin.** (44)
- Mentor: Uch qatorni yana o'zingiz yozasiz, tekshirishga ikkinchi foydalanuvchi kerak; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Harakat natijasi boshqa foydalanuvchiga ko'rinadi va ekran ochilganda yoki pastga tortilganda Backend'dan qayta olinadi.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — o'z repo'ngizda 1-amaliyotdagi holat. Natijani kim va qayerda ko'radi — bir gap bilan o'ylang (Mentor misolida: tashkilotchi, «O'yin» ekranida).
     Ikkinchi foydalanuvchi — o'z telefoningizda «Hisobdan chiqish» bilan ikkinchi akkaunt; sinfdoshingiz telefoni ham bo'ladi (web-trekda — havola, mobil trekda — Android'dagi Expo Go).
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — `GET /oyinlar` javobi; `mobil/` — «O'yin» ekrani.
     > Nima qilsin: `GET /oyinlar` javobida har o'yinga `tasdiqlagan` — kelishini tasdiqlaganlar soni qo'shilsin. O'yinni e'lon qilgan o'yinchi «O'yin» ekranida «Kelishini tasdiqladi: 7 / 9» ni ko'rsin — tasdiqlaganlar / qo'shilganlar;
     > tasdiqlaganlar doirasi yashil. Ma'lumot ekran ochilganda va pastga tortilganda Backend'dan qayta olinsin.
     > Nima buzilmasin: «Kelaman» va Backend'dagi qoida avvalgidek; tasdiq soni faqat tashkilotchiga ko'rinsin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): pastga tortish o'rniga «Yangilash» tugmasi — ma'lumot sahifa ochilganda va shu tugma bosilganda olinadi.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → commit → `git push`; Render deploy tugashini kuting. Ikkinchi akkaunt: «Hisobdan chiqish» → namuna ism va **boshqa** namuna telefon bilan ro'yxatdan o'ting
     (Mentor misolida `+998 90 000 00 02`; telefon takrorlansa, ro'yxatdan o'tish rad etiladi). Sinfdosh telefoni bilan: web-trekda — Netlify havolangiz; mobil trekda — Android'dagi Expo Go QR'ni ochadi (bitta Wi-Fi).
     Expo akkauntingiz ma'lumotlarini boshqaga bermaysiz. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Ikki foydalanuvchi bilan tekshirish** — talabning har qatorini tekshiring:
     (1) Natijani ko'radigan — siz, harakatni bajaradigan — ikkinchi akkaunt (Mentor misolida: siz bugungi o'yinni e'lon qilasiz, ikkinchi akkaunt qo'shilib «Kelaman»ni bosadi).
     (2) Bitta telefonda: harakatni ikkinchi akkauntda bajaring, o'z akkauntingizga qayting — ekran ochilganda yangi son. Sinfdosh telefoni bilan: ekraningiz ochiq turganda son o'zgarmaydi, pastga torting — yangi son keladi.
     (3) «Nima buzilmasin» qatoringizni tekshiring (Mentor misolida: ikkinchi akkauntda tasdiq soni ko'rinmaydi). Sinfdosh bilan bo'lsangiz, keyin rollarni almashing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki telefon, nom o'z rangida; bir marta o'zi yuradi):
  - «o'yinchi»: «Shanba, 18:00» · «Kelaman» → «Tasdiqladingiz»
  - «tashkilotchi»: «9 / 10» · «Kelishini tasdiqladi: 6 / 9» → pastga tortish → «7 / 9», yettinchi doira yashil ✓
- Hammasi bajarilgach (yashil): Ikki foydalanuvchi bilan tekshirildi: boshqa odam harakatingiz natijasini o'z ekranida ko'radi. (95)
- Qator (`QIzoh`, natija ostida; faqat mobil trekda): Sinfdoshingiz telefoni ilova kodini sizning laptopingizdan oladi — o'yinlar esa Render'dagi Backend'dan. (104)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Ikkinchi foydalanuvchi — tayanch 9.35 (b): asosiy yo'l — «Hisobdan chiqish» bilan ikkinchi akkaunt (9.34, 9.88); sinfdosh telefoni — web havola yoki Android Expo Go (bitta Wi-Fi, Qaror-0 11).
  iPhone'da Expo Go loyiha egasining Expo akkauntini talab qiladi (tayanch 6) — akkaunt ma'lumoti sinfdoshga berilmaydi (12-FILTR 22). 4-mashqdagi «ochiq ekranda son o'zgarmaydi» bitta telefonda ko'rinmaydi — 4-mashq sahnasi shuni ko'rsatadi.
  Namuna ism va telefon — o'z raqami yozilmaydi (9.34, 10-Modul maxfiylik odati). Yo'l — yagona `GET /oyinlar` (9.29). Tasdiq soni tashkilotchiga — 9.33.

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Tashkilotchi ekrani ochiq, ikki o'yinchi tasdiqladi. U sonni qachon ko'radi?** (11 so'z)
  - ✔ Pastga tortganda — ilova Backend'dan qayta so'raydi
  - Bosilgan zahoti — Backend sonni telefonga o'zi yuboradi
  - Ertasi kuni — ilova kunda bir marta so'rab turadi
  - Bir soatdan keyin — Backend sonni soatda yangilaydi
- Kalit: **A** (index 0). To'rttalasi «vaqt — sabab» shaklida, tire hammasida; «Backend» A, B, D da, «so'r-» A, C da (S-003); to'g'ri variant yolg'iz eng uzun emas (o'lchov pastda).
- To'g'ri izohi: Tortilganda ilova so'raydi va yangi son keladi. (47)
- Xato izohlari (≤60):
  - B: Bu modulda Backend telefonga o'zi xabar yubormaydi. (51)
  - C: Ilova soatga qarab so'ramaydi. Son nimadan keyin o'zgardi? (58)
  - D: Backend o'zi hech narsa yubormaydi. Kim so'raydi? (49)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): S-019 — savoldagi son («ikki») kalitda takrorlanmaydi; 4-mashqdagi bitta o'yinchi o'rniga ikkita, xulosadagi «ochganda yoki pastga tortganda» so'zlari variantda aynan yo'q (§106).

## A3 · Amaliyot 3 — tugma faqat ruxsat bor joyda  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 3 · tugma faqat kerak joyda
- Sarlavha: **Tugma faqat ruxsat bor joyda chiqsin.** (37)
- Mentor: Uch qatorni yozasiz, Backend'dagi qoida joyida qolishi — «Nima buzilmasin» qatoriga; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Tugma faqat qoida ruxsat bergan joyda chiqadi; bajarilgan harakat holati ilova qayta ochilganda ham ko'rinadi.
- Qadamlar (hammasi o'z repo'ngizda, o'z trekingizda — `pm-m9d8-platforma`):
  1. **Ochish** — 1-amaliyotda tugma ruxsat yo'q joyda ham turgan edi. Ruxsat yo'q holatlarni sanab chiqing (Mentor misolida ikkita: o'yin bugun emas · o'yinchi qo'shilmagan).
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — «O'yin» ekrani; `backend/` — `GET /oyinlar` javobi.
     > Nima qilsin: javobda har o'yinga `menTasdiqlaganman` (kirgan o'yinchi tasdiqlaganmi) va `menTasdiqlayOlaman` qo'shilsin — Backend uni `…/tasdiq` dagi o'sha qoida bilan hisoblasin (o'yin kuni, qo'shilgan).
     > «Kelaman» faqat `menTasdiqlayOlaman` bo'lsa chiqsin — ilova sanani o'zi solishtirmasin; tasdiqlagan bo'lsa — «Tasdiqladingiz» (o'chiq), ilova qayta ochilganda ham.
     > Nima buzilmasin: Backend'dagi qoida o'chirilmasin — tugma yashirilsa ham, har so'rovga ruxsatni u bersin. «Qo'shilaman», «O'yin to'ldi» va «Kelishini tasdiqladi» avvalgidek. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): o'sha uch qator sayt papkangizdagi o'yin sahifasi uchun; holat sahifa yangilanganda ham ko'rinsin.
  3. **Ishga tushirish** — push → Render deploy tugashini kuting · mobil trekda `npx expo start` (QR ochilmasa — bitta Wi-Fi yoki `--tunnel`), web-trekda push — Netlify o'zi yangilanadi.
     Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     (1) Ruxsat bor holat — tugma bor (Mentor misolida: bugungi, qo'shilgan o'yin — «Kelaman»).
     (2) Har ruxsat yo'q holat — tugma yo'q (Mentor misolida: boshqa kungi o'yin; qo'shilmagan o'yin).
     (3) Mobil trekda terminalda `r` ni bosing (web-trekda sahifani yangilang) — bajarilgan holat joyida turibdi. Oxirida `git status` → `git add <fayl>` → commit → `git push`.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi; uch kadr bir marta o'zi yuradi, har kadr ustida «Bugun: …»):
  - «Bugun: juma» — «Shanba, 18:00» · «9 / 10» · «Qo'shildingiz» — «Kelaman» yo'q
  - «Bugun: shanba» — xuddi shu o'yin · «Qo'shildingiz» · «Kelaman» → bosiladi → «Tasdiqladingiz»
  - «Bugun: shanba» — «Shanba, 20:00» · «6 / 10» · «Qo'shilaman» — «Kelaman» yo'q
- Hammasi bajarilgach (yashil): Tugma faqat ruxsat bor joyda chiqadi; bajarilgan holat qayta ochilganda ham ko'rinadi. (86)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Nishon (bonus): Second Feature — oxirgi «Bajardim»da (4-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Mentor namunasida «Kelaman» yo'q joyda izoh yozuvi qo'shilmaydi: 13-dars sinovidagi 3-to'xtash («Kelaman» nega yo'qligini tushunmadi — tayanch 1.8) aynan shu qarordan chiqadi.
  «Nima buzilmasin»dagi Backend qoidasi — 1-savol bilan bog'liq (tugma yashirilsa ham qoida kerak). Tugma qachon chiqishini ham Backend aytadi (`menTasdiqlayOlaman`) — telefon soati yoki mintaqasi boshqa bo'lsa ham farq chiqmaydi (9.87).

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — Ruxsatni Backend beradi» · 5 — «2 — Pastga tortish».

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- SABOQ 12 (foydalanuvchining qat'iy qoidasi 05.10): kartochkalar yakun ichida emas — alohida ekran. Tartib: … → podium → **kartochkalar** → yakun.
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16).
- Kartochkalar — 12 ta (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 7 · Yakun — uyga sinov va keyingi dars  ← QYakun (172; kartochkalar — oldingi alohida ekranda)
- Eyebrow: Yakun · belgi «✓ 2-funksiya tayyor» — faqat A3 bajarilganda
- Sarlavha (bloklar holatiga qarab, P-046; 12-FILTR 42): A3 — **Ikkinchi funksiya tayyor: ruxsatni Backend beradi.** (50) ·
  A2 — **Harakat va natija ishlaydi — tugma qoidasi qoldi.** (49) · A1 — **Harakat va ruxsat ishlaydi — natijani ko'rsatish qoldi.** (55) · hech biri — **Ikkinchi funksiya boshlandi — qolgan qadamni tugating.** (54)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (4):
  - Harakatga kim va qachon ruxsat olishini Backend hal qiladi.
  - Token bor, lekin ruxsat yo'q bo'lsa, Backend `403` qaytaradi.
  - Tugma yashirilsa ham, Backend'dagi qoida joyida qoladi.
  - Bu modulda boshqa odam natijani ekranni ochganda yoki pastga tortganda ko'radi.
- Uyga vazifa — **istisno** (`HwCard`, P-025 karta shaklida; Qaror-0 16): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: mahsulotingiz kim uchun bo'lsa, shunday odamlar · Nechta: 3 ta sinov · Muddat: keyingi darsgacha
  - ① Sinov vazifasini bitta gap qilib yozing: odam nimaga erishsin — qaysi tugmani bosishni emas. Vazifa — mahsulotingizdagi asosiy ish, faqat bugungi funksiya emas. Mentor misolida: «Shanba soat 18:00 dagi o'yinga qo'shiling.»
  - ② Har sinovchidan oldin «Hisobdan chiqish»ni bosing: sinovchi namuna ism va har biri boshqa namuna telefon bilan ro'yxatdan o'tadi — o'z raqamini yozmaydi. Telefoningizni bering — unga hech narsa o'rnatish shart emas; mobil trekda laptopda `npx expo start` ishlab tursin (bitta Wi-Fi).
  - ③ Vazifani o'qib bering va kuzating: har to'xtashni vaqti bilan qog'ozga yozing, oxirida belgilang — vazifani bajara oldimi, ha yoki yo'q. Yozuvlarni keyingi darsga olib keling.
  - Karta ostida (kichik, bitta qator): 9-Moduldagidek: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Uch foydalanuvchidan keyin nimani tuzatasiz?»: auditoriya bilan sinov va shu darsda tuzatish.
- Nishonlaringiz — N/3
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
✎ Uyga vazifa — loyiha kunlaridagi yagona istisno (tayanch 4, P-058 dan farq). «Kim bilan» — HwCard yorlig'i. «To'xtash», «kuzatuv yozuvi» shakli — 9-Modul `m7-10` (`10-PmUsabilityTest-v3.md` A.1, yakun);
  «vazifani bajara oldimi» — 13-dars yozuvi (`MD_TOPSHIRIQ_2` 13-band). Sinovchilar orasida — «Hisobdan chiqish» va namuna akkaunt (tayanch 9.34).

---

## Nishonlar (3)
- **Rule Keeper** — Tugma yashirilsa ham qoida Backend'da kerakligini topdingiz (3-ekran, 1-savol)
- **Fresh Count** — Tashkilotchi yangi sonni pastga tortganda ko'rishini topdingiz (5-ekran, 2-savol)
- **Second Feature** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «Ruxsatni Backend beradi»
   - `POST /oyinlar/:id/tasdiq` · So'rov — O'yinchi «Kelaman»ni bosganda Backend'ga ketadi.
   - `403 · Tasdiq faqat o'yin kuni` · Rad — Ruxsat bo'lmasa, Database o'zgarmaydi.
   - `holat: keladi` · Database — Faqat ruxsat bo'lsa yoziladi.
   - Sinfga savol: Tugma noto'g'ri joyda chiqsa, Database'ga ruxsatsiz yozuv nega tushmaydi?
2. 2-savol (5-ekran) — «Son so'rov bilan keladi»
   - `POST /oyinlar/1/tasdiq` · O'yinchi — Tasdiq Database'ga yoziladi.
   - `GET /oyinlar` · Tashkilotchi — Pastga tortganda yangi son so'raladi.
   - `Kelishini tasdiqladi: 7 / 9` · Natija — Yangi son javob kelgach chiqadi.
   - Sinfga savol: Tashkilotchi ekrani ochiq tursa, son nega o'zgarmaydi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Ikkinchi funksiya qayerdan olinadi? | Roadmap'ingizdagi «hozir» ufqidan | Mentor misolida — o'yin kuni tasdiq |
| Mentor misolida «Kelaman»ni kim bosa oladi? | O'yinga qo'shilgan o'yinchi — faqat o'yin kuni | Shu qoida bo'yicha ruxsatni Backend beradi |
| Ruxsatni kim beradi: ilovami yoki Backend? | Backend — har so'rovda | Tugma faqat ko'rinish |
| Token bor, lekin ruxsat yo'q bo'lsa, Backend nima qaytaradi? | `403` | Token yo'q bo'lsa — `401` |
| «Kelaman» bosilganda Database'da nima o'zgaradi? | `ishtirokchilar` dagi holat `keladi` bo'ladi | Oldin `qoshildi` edi |
| «Tasdiq faqat o'yin kuni» degan javob qachon keladi? | O'yin bugun bo'lmasa | Mentor talabida «bugun» — Toshkent vaqti bilan |
| «Kelishini tasdiqladi: 7 / 9» nimani bildiradi? | Qo'shilgan to'qqiz kishidan yettitasi kelishini tasdiqladi | Mentor misolida faqat tashkilotchiga ko'rinadi |
| Tashkilotchi yangi tasdiqni qachon ko'radi? | Ekranni ochganda yoki pastga tortganda | Bu modulda son o'zi yangilanmaydi |
| Real vaqt nuqtasi nima? | Ekran ochiq turganda boshqa odam tufayli o'zgaradigan joy | 8-darsdan; tasdiq soni — shunday joy |
| Tugma yashirilsa, Backend'dagi qoida nega qoladi? | Ilova xato ko'rsatsa ham, ruxsatsiz tasdiq yozilmasin deb | «Nima buzilmasin» qatoriga yoziladi |
| Bugun o'yin bo'lmasa, tasdiqni qanday tekshirasiz? | Bugungi sana bilan yangi e'lon berasiz | 1-funksiya shu uchun ham kerak |
| Uyga sinovda siz nima qilasiz? | Vazifani o'qib berasiz va to'xtashlarni yozasiz | Tushuntirmaysiz, yordam bermaysiz |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
1. O'yinchi «Kelaman»ni bosdi. Ruxsatni kim beradi? ✔ Backend — har so'rovni qoida bilan ko'rib · Ilova — tugmani ko'rsatib yoki yashirib · Database — yangi qatorni o'zi ko'rib · Tashkilotchi — har tasdiqni qo'lda ko'rib
2. Token bor, lekin o'yinchi o'yinga qo'shilmagan. Backend nima qaytaradi? `401` — kimligi noma'lum deb · ✔ `403` — bu ishga ruxsat yo'q deb · `201` — yangi qatorni yozib qo'yib · `404` — bunday yo'l topilmadi deb
3. Shanbadagi o'yinga juma kuni «Kelaman» so'rovi keldi. Nima bo'ladi? Database'ga baribir `keladi` yozib qo'yiladi · O'yin o'zi juma kuniga ko'chadi · ✔ Backend rad etadi, holat o'zgarmaydi · Tashkilotchi uni qo'lda tasdiqlaydi
4. «Kelishini tasdiqladi: 7 / 9» da 9 nimani bildiradi? Kelishini tasdiqlagan o'yinchilar · O'yinga kerak bo'lgan odamlar · Maydondagi bo'sh o'rinlar soni · ✔ O'yinga qo'shilgan o'yinchilar
5. Tashkilotchi ekrani ochiq. Yangi tasdiqni qanday ko'radi? ✔ Ekranni pastga tortib yangilaydi · Ilovani telefondan o'chirib qo'yadi · Har o'yinchiga qo'ng'iroq qiladi · O'yin boshlanishini kutib turadi
6. Bu modulda tashkilotchidagi son o'zi yangilanadimi? Ha — Backend uni har soniyada yuboradi · ✔ Yo'q — ilova so'ragandagina yangilanadi · Ha — o'yinchi bosgan zahoti o'zgaradi · Yo'q — son faqat o'yin kuni yangilanadi
7. «Kelaman» endi faqat o'yin kuni chiqadi. Backend'dagi qoida-chi? O'chiriladi — endi u kerak emas · Ilovaga ko'chadi — endi u ruxsat beradi · ✔ Qoladi — har so'rovga ruxsatni u beradi · Database'ga ko'chadi — u eslab qoladi
8. Ekran ochiq turganda boshqa odam tufayli nima o'zgaradi? «‹ O'yinlar» tugmasining joyi · Ilova nomi «Maydon Jamoa» · E'lon formasidagi «Soat» qatori · ✔ «Kelishini tasdiqladi» dagi son
9. Tugmani yashirganda «Nima buzilmasin»ga nima yozasiz? ✔ Backend'dagi qoida o'chirilmasin · Tugma har o'yinda turaversin · Database jadvali tozalab qo'yilsin · Yo'l tokensiz ham ochilsin
10. Tasdiqni tekshirish kerak, lekin bugun o'yin yo'q. Nima qilasiz? Backend qoidasini vaqtincha o'chirasiz · ✔ Bugungi sana bilan yangi e'lon berasiz · Telefon soatini shanbaga o'tkazasiz · Shanba kelguncha kutib turasiz
11. Backend o'zgarishi Render'ga qanday chiqadi? Render sahifasida kodni qo'lda yozasiz · `npx expo start` — ilovani qayta yoqasiz · ✎ F-1006-279 (lint-tell: tire faqat to'g'ri variantda edi) · ✔ `git push` — Render o'zi qayta chiqaradi · Neon'da jadvalni qaytadan yaratasiz
12. Ikkinchi telefonda tekshirish nima uchun kerak? Sizning telefoningiz tezroq ishlashi uchun · Expo Go yangilanib olishi uchun · Ikkala telefonda ekran bir xil ko'rinishi uchun · ✔ Natijani boshqa odam ko'rishini bilish uchun

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik (python): to'g'ri variant hech bir savolda yolg'iz eng uzun emas; kod belgisi faqat to'g'rida emas (2 — to'rttalasida, 3 — A da, 11 — B va C da).
2-savolda har kod yonida izoh (S-020: `401`, `403`, `201`, `404` — 4a-Modulda o'tilgan). 10-savol «Telefon soati» — Backend vaqtni o'zi biladi (darsdagi «Toshkent vaqti» qatori).
Fon so'zlari (R-008, kodda {uz, ru}): tasdiq · Kelaman · ruxsat · qoida · `403` · `keladi` · Backend · pastga tortish · real vaqt nuqtasi · `POST /oyinlar/:id/tasdiq` · Maydon Jamoa

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **0 (A)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`TASDIQ` + `TasdiqSahna`** — bitta manba (180): telefon (rol yorlig'i «o'yinchi» / «tashkilotchi», «Bugun: …» yorlig'i — ramkadan tashqarida, ilova ekranining qismi emas, «O'yin» ekrani: kun, soat, maydon, «N / M», ismsiz doiralar, tugmalar holati),
   Backend qutisi (yo'l, ikki qoida katagi), `ishtirokchilar` jadval-kartasi yoki hisoblagich, konvertlar va uzuq chiziq. Holatlar: kulrang · oq · accent · yashil · qizil. 0, 1, 2, 4-ekran va A1–A3 o'ng tomoni shundan o'qiydi.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4). «Maydon Jamoa» nomi — telefon maketida, o'z rangida (SABOQ 2). Namuna o'yinlar — 7/9/10-dars bilan bir manba (tayanch 9.2).
3. 0-ekran `QKirish`: maket — tashkilotchi telefoni («9 / 10», 9 doira); javobdan keyin doiralarda navbat bilan «?» va telefon ostida bo'sh qator «Kelishini tasdiqladi: — / 9» + «hali yo'q».
4. 2-ekran `QTushuncha`: `QBashorat`/`QTaxmin` (yopilmaydi — `TaxminIxcham`), uch o'yin bittadan (telefon ichida «Kelaman» `.navbat` halqa + pulsatsiya, ostida «Keyingi o'yin ›»), konvertlar, ikki katak ✓/✗ navbat bilan,
   `ishtirokchilar` qatori almashishi, qizil `403` qatori, joriy qator, `zoom`, `tugadi`. Holat bosishlar ro'yxatidan chiziladi (P-046).
5. 4-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, ikki telefon (o'lcham barqaror), «Kelaman» → hisoblagich sanab o'sadi, tashkilotchi telefoni bilan Backend orasida uzuq chiziq «so'rov yo'q»;
   «↓ torting» tutqichi (bosish yoki pastga surish) → ekran siljishi, aylanuvchi belgi, `GET` konverti, «6 / 9» → «7 / 9» son animatsiyasi (9.14), `zoom`, `tugadi`. Telefonda (bir ustun) harakatdan keyin vizual ko'rinadigan joyga suriladi.
6. 3 va 5-ekran `QTest` — matn yuqoridagidek; to'g'ri izoh ≤60, xato izohlari ≤60.
7. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (10-dars naqshi: `yordam`, `XATO_YOLI`). Har blok **4 qadam**, hammasi o'quvchining o'z repo'sida (tayanch 9.1); 5-qadam yo'q.
   - Uchala blokda prompt — uch bo'sh joy `{qayerda}` · `{nima qilsin}` · `{nima buzilmasin}` (`A3_JOY` naqshi 10-darsdan) va ustida bitta «Vazifa: …» qatori; «Yordam» — Mentor misolidagi to'liq prompt.
   - A1 tepasida — `pm-m9d6-roadmap` dan 2-funksiya nomi (`ishlar[hozir[1]].nom`); kalit yo'q bo'lsa — 1-qadamda erkin qator (saqlanmaydi — yangi kalit yo'q).
   - Trek `pm-m9d8-platforma` dan: «Yordam» ostidagi web gapi faqat web-trekda; 3-qadamdagi mobil/web qatorlari trekka qarab (kalit yo'q bo'lsa — ikkalasi, M-q5). A2 `QIzoh` — faqat mobil trekda.
   - 4-qadam nomi: «Telefonda tekshirish» (A1, A3) · «Ikki foydalanuvchi bilan tekshirish» (A2). O'ng: A1 — telefon (ikki kadr) + jadval-karta; A2 — ikki telefon; A3 — telefon (uch kadr, «Bugun: …» yorlig'i bilan).
   - `ortda`: faqat A1 da (darsda bir marta, F-1006-271) `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-12-done` (tayanch 3 matni; 9.10).
8. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Rule Keeper, 5-ekran → Fresh Count, A3 oxirgi (4-qadam) «Bajardim» → Second Feature.
9. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; SABOQ 12, 16). 7-ekran `QYakun`: `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + 3 qadam + ostidagi bitta qator), `recap` 4 qator, `keyingi` matni yuqoridagidek.
10. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
11. `LESSON_META.lessonId` — `m9-12-v1`, `lessonTitle` — «Loyiha kuni: 2-asosiy funksiya». App.jsx `m9-12` qatoriga `comp: FeatureTwoLesson` — «qur» bosqichida (asosiy seans).
12. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates -- src/9-Modull/FeatureTwoLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:jsx` 0 · `lint:layout` 1280/1366 · surat 1280 + 393 ·
    `python3 feedback/F-1005-10modul/stilsiz.py` (SABOQ 31).
13. ru — uz tasdiqlangach, bir yo'la (6-RU).

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m11-dars-12-start` → `m11-dars-12-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m11-dars-12-start`** = `m11-dars-11-done` (tayanch 3): e'lon berish va qo'shilish, «8 / 10» Backend'dan, «O'yin to'ldi».
2. **`m11-dars-12-done`** = start + A1–A3 namunasi:
   - `backend/`: `POST /oyinlar/:id/tasdiq` — token guard (10-dars); o'yin topilmasa `404`; «bugun» — `Asia/Tashkent` bo'yicha sana `oyinlar.kun` bilan solishtiriladi; o'yinchi qo'shilgan bo'lmasa (qatori yo'q yoki holati `qoshildi` / `keladi` emas — 9.74, 9.87) —
     `403` «Siz bu o'yinga qo'shilmagansiz»; o'yin kuni bo'lmasa — `403` «Tasdiq faqat o'yin kuni»; aks holda `holat` `qoshildi` → `keladi` (qayta bosilsa — o'zgarmaydi, xato yo'q).
   - `GET /oyinlar` (yagona yo'l, tartib `yaratilgan` — 9.29): har o'yinga `tasdiqlagan` (`holat = keladi` soni), `menTasdiqlaganman` va `menTasdiqlayOlaman` (o'yin kuni — `Asia/Tashkent`, va qo'shilgan; `…/tasdiq` bilan bitta qoida) qo'shiladi (11-darsdan — `qoshilgan` — `qoshildi` + `keladi`, 9.74; `menQoshilganman`).
   - `mobil/src/app/oyin/[id].tsx` (shu javobdan o'qiydi): «Kelaman» (A1 da — har o'yinda; A3 dan keyin — `menTasdiqlayOlaman && !menTasdiqlaganman`, sanani ilova solishtirmaydi — 9.87); bosilgach «Tasdiqladingiz» (o'chiq); `403` matni tugma ostida;
     tashkilotchida «Kelishini tasdiqladi: {tasdiqlagan} / {qoshilgan}», tasdiqlaganlar doirasi yashil; `RefreshControl` (pastga tortish) va `useFocusEffect` (ekran ochilganda) — `GET` qayta.
   - Namuna: Shanba 18:00 o'yinining 8 namuna qo'shilganidan 6 tasi `keladi` (tashkilotchi ko'rinishidagi «6 / 9» → `oyinchi_id 2` tasdiqlagach «7 / 9»); bor bo'lsa, qayta qo'shilmaydi.
   - README «Xatolar» jadvaliga: `403 · Tasdiq faqat o'yin kuni` — o'yin bugun emas yoki Backend vaqti boshqa mintaqada · yangi yo'l `404` — Render deploy hali tugamagan.
3. **Shart:** teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida). Namuna o'yinlar seed paytida keyingi shanba va yakshanba sanalari bilan (9.30); «Kelaman»ni ko'rsatish uchun «bugungi» o'yin 1-funksiya bilan e'lon qilinadi.
4. **Bog'liqlik:** 13-dars sinovi shu holatdan boshlanadi (tayanch 1.8: «Kelaman» faqat o'yin kuni chiqadi — 3-to'xtash); 14-dars `chiqdi`/`navbatda` holatlarini shu jadvalga qo'shadi.

---

## TAYANCHGA SAVOL (asosiy seans qarorlari bilan, 06.10 — tayanch 9.29–35, 9.41)
1. ~~Rad javobi kodi va matni~~ — **yopildi: 9.32** (`403` — «Tasdiq faqat o'yin kuni» · «Siz bu o'yinga qo'shilmagansiz»; 4a-Modul 401/403 ko'prigi saqlandi).
2. ~~`oyinlar.kun` va «bugun»~~ — **yopildi: 9.30** (sana, ekranda kun nomi; Toshkent vaqti; namuna o'yinlar — keyingi shanba va yakshanba). Bugungi o'yin — 1-funksiya bilan e'lon qilinadi (MD shunday).
3. ~~«O'yin» ekrani yo'li~~ — **yopildi: 9.29** (yagona `GET /oyinlar`, `/:id` yo'q; F2 javobga `tasdiqlagan`, `menTasdiqlaganman` qo'shadi). MD dagi `GET /oyinlar/:id`, `GET /oyinlar/1` almashtirildi.
4. ~~Tashkilotchi o'z o'yiniga qo'shiladimi~~ — **yopildi: 9.31** (avtomatik qo'shilmaydi — yangi e'lon «0 / N»). A1 tekshiruvida o'quvchi bugungi e'loniga «Qo'shilaman» bilan o'zi qo'shiladi.
5. ~~Tasdiq soni kimga ko'rinadi~~ — **yopildi: 9.33** (tashkilotchi «O'yin» ekranida «Kelishini tasdiqladi: 7 / 9»). Doiralar ismsiz (7-dars) — o'zgarmadi.
6. ~~«Tasdiqladingiz» nomi~~ — **yopildi: 9.33, 9.41**.
7. ~~Uyga sinovda ilova holatini qaytarish~~ — **yopildi: 9.34** («Hisobdan chiqish» poydevorda; har sinovchi namuna ism va namuna telefon bilan ro'yxatdan o'tadi). Uyga vazifa ② shunga yozildi;
   darsdagi ikkinchi foydalanuvchi — 9.35 (b): sinfdosh telefoni yoki ikkinchi akkaunt (A2).
8. ~~Tartib ziddiyati~~ — **yopildi: 9.29** (`GET /oyinlar` tartibi `yaratilgan`; 10-dars REPO tuzatiladi).
9. ~~«O'yin» ekrani sarlavha formati~~ — **yopildi: 9.30** («Shanba, 18:00»).
**Holat (06.10, 12-FILTR):** 10 — `qoshilgan` sanog'i 9.74 bilan («/ 9» o'zgarmaydi) · yangi 11 — tugma qoidasi manbasi: Backend `menTasdiqlayOlaman` (9.87) · yangi 12 — namuna akkauntlar har biri boshqa telefon bilan (9.88).
10. **(yangi, kichik)** Namuna tasdiqlar: Shanba 18:00 dagi 8 namuna qo'shilgandan 6 tasi `keladi` (tashkilotchida «6 / 9» → «7 / 9») — 9.36 namunasiga qo'shimcha; «qur» da 12-dars seed'i yoki A2 namunasi orqali.

## Shubhali joylar (ishonchim to'liq emas)
- **Ikkinchi foydalanuvchi (A2):** ~~sinfdoshning iPhone'ida Expo akkaunti~~ — **yopildi (12-FILTR 21–22):** asosiy yo'l — «Hisobdan chiqish» bilan ikkinchi akkaunt; sinfdosh telefoni — web havola yoki Android Expo Go; Expo akkaunti boshqaga berilmaydi.
  Bitta telefonda «ekran ochiq turganda son o'zgarmaydi» ko'rinmaydi — faqat ekran ochilganda yangi son (MD da shunday yozildi).
- **«Render deploy tugashini kuting»** — Render sahifasidagi aniq tugma yoki bo'lim nomini yozmadim (P-028); auto-deploy va «zero downtime» — render.com/docs/deploys (06.10). Deploy vaqti hujjatda yo'q — «bir necha daqiqa» deb ham yozmadim.
- **Web-trek «Yangilash» tugmasi** — PWA rejimida brauzerning pastga tortishi ishlamasligi mumkin deb oldim (tekshirmadim); shuning uchun tugma. Bu yangi tugma nomi — web-trek o'quvchisi o'zi yozadi.
- **Uyga sinovda laptop** — Expo Go ilova kodini laptopdagi `npx expo start` dan oladi (10-dars `QIzoh`); uyda sinov uchun laptop yoqiq va bitta Wi-Fi kerak. Kod bir marta yuklangach laptopsiz ishlashini da'vo qilmadim.
- **Hook «Ha — kelolmasa, ilovaning o'zida xabar beradi»** — 14-darsdagi «Chiqish»dan keyin qisman rost bo'ladi; bu darsda ilovada bunday joy yo'q — javob matni «hali» bilan chegaralangan.
- **«Bugun: shanba» yorlig'i** — telefon ramkasi ustida, ilova ichida emas; quruvchi uni ilova qismi qilib qo'ymasin (13-dars «Bugun» kun sarlavhasi — boshqa narsa).
- **`403` matnlari ilovada** — agent Backend xabarini to'g'ridan-to'g'ri ko'rsatadi deb oldim; agent o'z matnini yozsa, kutilgan natija bilan farq qilishi mumkin.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m9-11` «Loyiha kuni: 1-asosiy funksiya» → **`m9-12` «Loyiha kuni: 2-asosiy funksiya»** (osti «roadmap'dagi ikkinchi funksiya» — 1-ekran Mentorida) →
  `m9-13` «Uch foydalanuvchidan keyin nimani tuzatasiz?» (App.jsx 382–384; yakundagi «Keyingi dars» shu nom va osti).
- [x] Bitta misol-ip («Maydon Jamoa», repo `maydon-jamoa`) · metafora yo'q · keyssiz · bitta vizual dars bo'yi — `TasdiqSahna` (0, 1, 2, 4; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (uch «Kelaman» → konvert, ikki katak ✓/✗, jadval qatori, `403`), 4 («Kelaman» → hisoblagich; pastga tortish → «7 / 9»); 0-ekran javobdan keyin o'zgaradi.
- [x] SABOQ 11, 19–30: navbatdagi element halqada, Mentor shu harakatni aytadi; bashorat natijagacha turadi; telefon chapda, chizma o'ngda; ≤ 3 blok; tugadi holati ixcham. SABOQ 12/16: kartochkalar alohida, Mentorsiz.
- [x] Sarlavhalar ≤55 bitta qator · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohlari ≤60 — sanoq python bilan (`md12/olchov.py`, natija hisobotda).
- [x] Atamalar tayanch 2 bilan bir xil: Backend · Database · token · talab · agent · tekshirish (faqat o'quvchiga) · sinov (faqat real odam — uyga vazifa) · tasdiq · tashkilotchi; «server», «refresh», «real-time», «ficha» yo'q ·
  siz-forma; Antigravity promptlari sen-formada (T-002) · Backend uchun «ruxsat beradi / rad etadi» («tekshiradi» emas — T-015).
- [x] Testlar: variantlar bir shaklda, uzunlik yaqin, to'g'ri variant yolg'iz eng uzun emas; Ha/Yo'q (Kerak / Kerak emas) 2/2 · ✔ o'rni: 3-ekran C, 5-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «hech qachon» — yo'q; «bu modulda», «Mentor misolida» chegaralari).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «F2», «m9-12», «11-Modul» yo'q; blok — «Amaliyot 1»; modul raqami LMS bo'yicha: «9-Moduldagidek», «8-darsda») · tarixiy voqea, real kompaniya raqami yo'q · «KOD» (13) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/009/010/011/014/015/016/024/029/038/039/042/043/045/047/048/049/064 · P-001/007/008/010/013/015/020/025/026/028/036/046/052/055/059/062/063/064/067 · S-001/002/003/004/006/008/010/019/020/025/026 — ko'rildi.
- [x] P-028 / P-026: uyga sinovda holat — «Hisobdan chiqish» va namuna akkaunt (9.34); A2 zaxirasi — ikkinchi akkaunt (9.35). TAYANCHGA SAVOL 1–9 yopildi (9.29–34, 9.41); 10 — kichik, «qur» uchun.

