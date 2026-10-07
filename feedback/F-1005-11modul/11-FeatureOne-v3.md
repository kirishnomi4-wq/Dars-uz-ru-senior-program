# 11-Modul (kod: `src/9-Modull`) · 11-dars «Loyiha kuni: 1-asosiy funksiya» — MD v3 (loyiha kuni qolipi)

Fayl: `src/9-Modull/FeatureOneLesson.jsx` · kalit `m9-11` (App.jsx `type: 'Proyekt'`) · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (SABOQ 12: kartochkalar alohida ekran) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · tip AI-PRAKT (dastur: «Vibe-coding: 1-funksiya — roadmap bo'yicha birinchi asosiy funksiya; talab — o'quvchidan» → natija «1-funksiya tayyor») ·
eng yaqin namuna: shu modul `10-FoundationDay-v3.md` (blok modeli, trek farqi, «Ortda qoldingizmi»), 9-Modul `07-MvpFirstScreen-v3.md` va uning `07-FILTR.md` (tuzilish; matn ko'chirilmadi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18 va 10-Modul «C» 19–31, majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan,
Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi · telefon maketi doim chapda, chizma o'ngda · ekranda ≤3 blok ·
ko'p elementli mashq ketma-ket · «Maydon Jamoa» nomi o'z rangida, telefon maketida · ekranga kirganda bo'sh, ma'nosiz element yo'q · yakuniy holat ixcham.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **D**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 ≈ 22 · A2 ≈ 22 · A3 ≈ 16; tayanch 9.1) · 0–2 ≈ 10 · 3–5 ≈ 8 · podium, kartochkalar, yakun ≈ 12.
Menyu nomi (DE-205): App.jsx `m9-11` — «Loyiha kuni: 1-asosiy funksiya» (osti: «roadmap'dagi birinchi funksiya — talabni siz yozasiz») ·
oldingi dars `m9-10` «Loyiha kuni: poydevor — Database, kirish, deploy» · keyingi `m9-12` «Loyiha kuni: 2-asosiy funksiya» (App.jsx 381–383-qatorlar, grep bilan; `comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida Mentor misoli «Maydon Jamoa» ilovasida birinchi asosiy funksiya — **o'yin e'loni va qo'shilish** — telefonda ishlaydi (tayanch 1.4, 1.7 «11»):
   tashkilotchi o'yin e'lon qiladi (`POST /oyinlar`), o'yinchi «Qo'shilaman»ni bosadi (`POST /oyinlar/:id/qoshilish`), «8 / 10» Backend'dan keladi, to'lgan o'yinda «Qo'shilaman» o'rnida «O'yin to'ldi».
   Teg: `m11-dars-11-start` (= `m11-dars-10-done`) → `m11-dars-11-done` (tayanch 3, aynan).
   O'quvchi xuddi shu yo'lni uch blokda **o'z repo'sida, o'z mahsulotida, o'z roadmap'idagi birinchi funksiya** bilan (`pm-m9d6-roadmap`), o'z trekida (`pm-m9d8-platforma`) bosib o'tadi; «Maydon Jamoa» — namuna.
   Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
2. **Bugungi asosiy fikr (P-013):** Roadmap'dagi funksiyani agent talabdan quradi — talabda aytilmagan holatni u o'zi taxmin qilishi mumkin (tayanch 7.2).
   Shuning uchun uch qatorni o'zingiz yozasiz, bo'lmasligi kerak bo'lgan holatni (ikki marta bosish, to'lgan o'yin) ham yozasiz va har gapni telefonda tekshirasiz.
   Telefondagi son so'ralgan paytdagi holat — u eskirgan bo'lishi mumkin; to'lgan o'yinni Backend Database'ga qarab tekshiradi.
   «Uch qator» — bu kursdagi amaliy qolip (9-Modul FILTR 2): matnda «bu darsda» bilan chegaralangan.
3. **Texnik aniqlik (tayanch 1.4, 1.6, 1.7, 3, 9 — aynan; taxmin emas):**
   - Jadvallar (10-darsdan): `oyinchilar` (`id` · `ism` · `telefon` · `parol_hash`) · `oyinlar` (`id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` · `yaratilgan`) ·
     `ishtirokchilar` (`oyin_id` · `oyinchi_id` · `holat`: `qoshildi` / `keladi` / `navbatda` / `chiqdi` · `yaratilgan`). Bu darsda `holat` — faqat `qoshildi` (qolganlari 12, 14-darslarda).
   - Yangi yo'llar (tayanch 1.7 «11»): `POST /oyinlar` (kun, soat, maydon, kerak; tashkilotchi — token egasi) · `POST /oyinlar/:id/qoshilish` (token bilan).
     `GET /oyinlar` (10-darsdan) endi har o'yinga qo'shilganlar sonini va o'yinchining o'zi qo'shilganini ham beradi — «8 / 10» shu sondan.
   - Rad javobi — `409` va xabar: «O'yin to'ldi» · «Siz bu o'yinga qo'shilgansiz» (9-Modul `409 · Bu vaqt band` naqshi; tayanch 9.32). Bitta o'yinchi bitta o'yinda bir marta — Database qoidasi bilan ham (9.83).
   - Namuna o'yinlar (tayanch 9.2, HAMMA darsda bir xil): Shanba 18:00 · Mahalla maydoni · **8 / 10** · Shanba 20:00 · Maktab maydoni · 6 / 10 · Yakshanba 10:00 · Park maydoni · 4 / 8 ·
     Yakshanba 17:00 · Mahalla maydoni · 9 / 10. 10-darsda kartada «N kishi kerak» edi; «8 / 10» Backend'dan — **shu darsdan** (A2 talabi namuna qo'shilganlarni qo'shadi; TAYANCHGA SAVOL 2).
   - Mentor misolidagi yangi e'lon (A1 va 2-ekran): **Yakshanba, 19:00 · Maktab maydoni · 10 kishi** — e'lon beruvchi `Ali` (10-Modul namuna forma qiymati, tayanch 9.8; jadval qatori, qahramon emas).
   - Real vaqt nuqtasi (8-dars atamasi, tayanch 1.6): «8 / 10» · qo'shilganlar ro'yxati — **ekran ochilganda va pastga tortilganda** so'raladi (web-trekda — sahifa ochilganda va «Yangilash» bosilganda, 8-dars; 9.84). O'zi yangilanishi — o'quvchi matnida aytilmaydi (T-038).
   - Backend Render'da (10-darsdan): `backend/` o'zgarsa — `git push` → Render yangi deploy qiladi («Render triggers a deploy as soon as you push or merge a change to your linked branch.
     This is the default behavior for a new service.» — render.com/docs/deploys, 06.10); holati xizmatning Deploys sahifasida. Shuning uchun tekshiruv — telefonda, deploy tugagach (tayanch 9.9).
   - Expo Go: «Expo Go is configured by default to automatically reload the app whenever a file is changed» (docs.expo.dev/get-started/start-developing, 06.10); qo'lda — terminalda `r` (10-dars).
   - Pastga tortib yangilash (React Native): FlatList `onRefresh` — «If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality», `refreshing` bilan (reactnative.dev/docs/flatlist, 06.10).
     O'quvchi matnida kod nomi yo'q — faqat «pastga tortilganda»; Yordam promptida ham agent o'zi tanlaydi.
   - Bir vaqtda ikki kishi oxirgi joyni bosishi (bitta tranzaksiya) — **14-dars**; bu darsda faqat **eskirgan ekran** holati (biri qo'shilgan, ikkinchisining ekranida eski son).
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **talab** — agentga yoziladigan matn: qayerda · nima qilsin · nima buzilmasin (9-Moduldan). Bugun uch qatorni o'quvchi o'zi yozadi (tayanch 4 zinapoyasi: 11, 12, 14). Blok qadami nomi — «Prompt», ichidagi matn — talab.
   - **asosiy funksiya** — PRD dagi uchta funksiyadan biri; o'quvchi matnida **nomi bilan**: «o'yin e'loni va qo'shilish» (F1 — faqat MD/kodda). **roadmap** — 6-darsdan (uch ufqli reja).
   - **PRD** — 5-darsdan; hookda «PRD dagi funksiya gapi» (tayanch 1.4 F1 gapi). PRD ma'nosida «talab» yo'q (T-015).
   - **e'lon** · **qo'shilish** · tugmalar «E'lon berish» · «Yuborish» · «Qo'shilaman» → «Qo'shildingiz» · holat «O'yin to'ldi» (tayanch 1.7, 9.15). **tashkilotchi** · **o'yinchi** — ismsiz rol.
     «Chiqish» — bu darsda yo'q (F3 tugmasi, 14-dars; T-015).
   - **real vaqt nuqtasi** (8-darsdan) — A3 «Ochish» qadamida bir marta. «real-time» yo'q.
   - **eskirgan** (son) — oddiy so'z, atama emas: ekrandagi son oxirgi so'ralgan paytdagi holatni ko'rsatadi. «eski» shu ma'noda ishlatilmaydi (T-014).
   - **asosiy ro'yxat** — 10-dars bloklaridagi so'z (o'quvchi mahsulotining bosh ro'yxati; Mentor misolida — o'yinlar). **asosiy harakat** — ro'yxatdagi biriga foydalanuvchi qiladigan ish (Mentor misolida — qo'shilish); yangi so'z emas, oddiy ibora.
   - **Backend** · **Database** · **token** · **kirish** · **agent** (Antigravity) · **prompt** · **tekshirish** (o'z ishini ko'rish) · **deploy** — oldingi darslardan, qayta ta'riflanmaydi.
   - **Ishlatilmaydi:** server (prozada), baza, ficha, spec, real-time, sinov (real odam — 12–13-darslar), «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova ekrani), «Tayyor» (faqat agent javobida — hook).
5. **Metafora yo'q. Keyssiz** (tayanch 5: loyiha kuni). Real kompaniya raqami yo'q. Raqamlar — faqat Mentor misolidan («8 / 10» va namuna o'yinlar — tayanch 9.2).
6. **Amaliyot bloki (tayanch 4, 9.1):** o'quvchi 4 qadamning **hammasini o'z repo'sida, o'z mahsuloti va trekida** bajaradi (Ochish → Prompt → Ishga tushirish → Telefonda tekshirish); 5-qadam yo'q.
   Mentor misoli — namuna: o'ngda kutilgan natija «namuna: Maydon Jamoa», «Yordam» ortida — Mentor misolidagi to'liq talab (mobil trek) va web-trek uchun bir gap (9.7).
   **Talab zinapoyasi (tayanch 4: 11-dars):** uch blokda ham **uch qatorni o'quvchi yozadi**; har qator ostida kulrang savol-ipucha (bir xil, uch blokda — KORPUS §32: qisqa, tayyor javobsiz),
   promptning oxirgi qatori tayyor: «Boshqa joyga tegma, o'zgargan fayllarni ayt.» (push odati — `git status` agent aytgan ro'yxat bilan solishtiriladi). Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» (faqat xato qatori, `.env` qiymatlari va token yuborilmaydi — 9.81)
   **Funksiyani bloklarga bo'lish** (A1 «Ochish»da bir marta aytiladi): Mentor misolida 1 — e'lon berish (ro'yxatga yangisi qo'shiladi) · 2 — qo'shilish (asosiy harakat va
   u bo'lmasligi kerak bo'lgan holat) · 3 — ekran yangilanishi. Bu — namuna, umumiy qolip emas: o'quvchi funksiyasida yangisini qo'shish bo'lmasa, 1-blokda uning birinchi ko'rinadigan qismini quradi (ekranda aytiladi; 11-FILTR 1).
   Push odati (10-Moduldan): `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil · `git add <fayl>` (`git add .` emas) · `.env` push qilinmaydi.
7. **Real odam bilan ish bu darsda yo'q** (sinov — 12-dars uyga vazifasi). **To'lgan o'yinni** tekshiruvda Neon'dagi SQL Editor yasaydi — test holati: `kerak` vaqtincha kamaytiriladi, keyin qaytariladi
   (GATE M 11-q0 A, tayanch 9.35). O'quvchi matnida bu «test holati» — «boshqa o'yinchi qo'shildi» deb aytilmaydi (11-FILTR 16). **Uyga vazifa yo'q** (P-058): ish repo'da.
8. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, agent chati, Backend va Database maketlari chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3).
   Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon Jamoa» (Mentor misoli, repo `maydon-jamoa`) — mahalladagi mini-futbol uchun jamoa yig'adigan mobil ilova. 10-darsda poydevor qo'yildi: kirish, token, o'yinlar ro'yxati Render'dagi Backend'dan.
  Bugun roadmap'dagi birinchi funksiya — o'yin e'loni va qo'shilish — quriladi. Kutilgan natija doim «Maydon Jamoa» bilan; o'quvchi har blokni o'z funksiyasida bajaradi.
- **Hook:** agentga PRD dagi funksiya gapi o'zi yuborilgan → «Qo'shilaman» ikki marta bosiladi → «10 / 10», bitta o'yinchi ikki joyda → gapda bu holat aytilmagan edi.
- **Ip (ot-shaklda):** E'lon berish → Qo'shilish va to'lgan o'yin → Ekran yangilanishi.
- **Bitta vizual — «Funksiya sahnasi»** (`JAMOA_F1` const → `FunksiyaSahna`, dars bo'yi, 163/180):
  - chapda **telefon** (bitta yoki ikkita, o'lchami barqaror — SABOQ 22) — «Maydon Jamoa» (Expo Go), nom o'z rangida; ekranlar: **O'yinlar** (kartalar: kun · soat · maydon · «8 / 10») ·
    **O'yin** («‹ O'yinlar» · kun va soat · maydon · «8 / 10» · qo'shilganlar — ismsiz doiralar, bo'sh joylar uzuq chiziqli · tugma «Qo'shilaman» / «Qo'shildingiz» (o'chiq) / «O'yin to'ldi») ·
    **E'lon berish** (Kun · Soat · Maydon · Nechta odam · «Yuborish»). Telefon ustida yorliq: «1-telefon · o'yinchi» kabi (ikki telefonli ekranlarda).
  - o'ngda **Backend** qutisi — uch yo'l: `GET /oyinlar` · `POST /oyinlar` · `POST /oyinlar/:id/qoshilish` (yorliq `maydon-jamoa-….onrender.com · Render`) va **Database · Neon** kartasi:
    `oyinlar` qatorlari va har o'yinga qo'shilganlar sanog'i (`ishtirokchilar` dan) — «8 / 10» shu yerda.
  - hookda telefon ustida **agent chati** (Antigravity, chizilgan): o'quvchi pufagi — PRD gapi, agent javobi «Tayyor!».
  - Holatlar: kulrang (hali yo'q) → oq (ishlaydi) → accent (joriy) → yashil (bugun qurildi / to'g'ri) → qizil (aytilmagan holat / eskirgan son). Konvert — so'rov, yonida kichik `token` yorlig'i.
  - Ishlatilishi: 0 (agent chati + O'yin ekrani) · 1 (tayyor holat, o'zi yuradi) · 2 (E'lon berish → Backend → Database) · 4 (ikki telefon + Database sanog'i) · A1–A3 o'ng (kutilgan natija).
  - `prefers-reduced-motion` da konvert, son animatsiyasi va pulsatsiya harakatsiz, holatlar bir zumda almashadi.
- **Yakun:** birinchi funksiya telefonda ishlaydi · keyingi dars — roadmap'dagi ikkinchi funksiya.

---

## 0 · Kirish — tugma ikki marta bosilsa  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Tugmani ikki marta bossangiz, «8 / 10» nima bo'ladi?** (52)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Mentor misolida agentga PRD dagi funksiya gapi o'zi yuborildi — agent «Tayyor» dedi. O'yinchi «Qo'shilaman»ni ikki marta bosmoqchi: avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Navbatdagi harakat (halqa + yengil pulsatsiya): uchta variant guruhi.
- Maket (chap): tepada agent chati — o'quvchi pufagi «O'yin e'loni va qo'shilishni qur: tashkilotchi e'lon beradi, o'yinchi «Qo'shilaman»ni bosadi, «8 / 10» o'zgaradi.» va agent pufagi «Tayyor!»;
  ostida telefon — «Maydon Jamoa», «O'yin» ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · **8 / 10** · 8 ta to'la doira + 2 bo'sh joy · «Qo'shilaman».
- Savol: **Sizningcha, qaysi biri?**
  - «9 / 10» — bitta o'yinchi faqat bitta joy oladi (47)
  - «10 / 10» — har bosish yana bitta joy qo'shadi (46)
  - «8 / 10» — ikkinchi bosish birinchisini bekor qiladi (52)
- Javob — 2-variant: **Aynan!** Bu misolda PRD gapida ikki marta bosish aytilmagan edi. Agent har bosishni yangi joy deb sanadi. (103)
- Javob — 1-variant: **Qiziq fikr!** Shunday bo'lishi kerak edi, lekin PRD gapida bu holat yo'q. Agent har bosishni yangi joy deb sanadi. (112)
- Javob — 3-variant: **Qiziq fikr!** Bu misolda ikkinchi bosish ham joy qo'shdi: PRD gapida bu holat aytilmagan edi. (91)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → telefonda «Qo'shilaman» ikki marta bosiladi (barmoq izi ikki marta) → «8 / 10» → «9 / 10» → «10 / 10» (son har safar bir lahza kattalashib, silliq qaytadi — 9.14) →
  ikki yangi doira to'liq bo'ladi, ikkalasining ostida bir xil yorliq «Siz» → ikkala doira qizil halqada, ostida bitta qator: «bitta o'yinchi — ikki joy» →
  agent chatidagi PRD gapi ostida uzuq chiziqli bo'sh qator chiziladi: «ikki marta bosilsa — ?» (gapda yo'q joy).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): funksiya talabda aytilmagan holat bilan qurilsa nima bo'ladi. Uchala variant «son — sabab» shaklida, ✔ (bu misoldagi natija) o'rtada.
  «Tayyor» — faqat agent javobida (T-015). Javob matnlari «bu misolda» bilan chegaralangan (tayanch 7.1–7.2): agent boshqacha qurishi ham mumkin (shubhali joylar).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida birinchi funksiya telefonda ishlaydi.** (50)
- Mentor: Roadmap'dagi birinchi funksiya — talabni siz yozasiz, kodni agent yozadi. Mentor misoli — o'yin e'loni va qo'shilish, siz esa o'z funksiyangizni qurasiz.
- Chap — «Dars oxirida»: Funksiya sahnasi **tayyor** holatda, bir marta o'zi yuradi (DE-200): «E'lon berish» → «Yuborish» → «O'yinlar»da yangi karta «Yakshanba, 19:00 · Maktab maydoni · 0 / 10» →
  Shanba 18:00 kartasi → «O'yin»: «Qo'shilaman» → «8 / 10» → «9 / 10», tugma «Qo'shildingiz» (o'chiq) → orqaga, ro'yxat pastga tortiladi → Yakshanba 17:00 kartasi «10 / 10 · to'ldi»
  (boshqa o'yinchi qo'shilgan) → «O'yin»: tugma o'rnida «O'yin to'ldi». Backend yorlig'i `maydon-jamoa-….onrender.com · Render`.
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · E'lon berish: yangi o'yin ro'yxatda chiqadi (43)
  - 02 · Qo'shilish: «8 / 10» Backend'dan keladi (39)
  - 03 · Yangilash: to'lgan o'yinda «O'yin to'ldi» (41)
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m11-dars-11-start` · namuna `m11-dars-11-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda, roadmap'ingizdagi birinchi funksiya bilan bajarasiz.
✎ Mentorning birinchi gapi — App.jsx menyu osti yozuvi (P-015). Reja yakunidagi «to'lgan o'yin» kadri — tayanch 1.7 «11» natijasi (namuna Yakshanba 17:00 «9 / 10» ga yana bir o'yinchi qo'shilgan).
- Tugmalar: Orqaga · Boshlaymiz

## 2 · E'lon kimniki bo'ladi?  ← QTushuncha
- Eyebrow: Tushuncha · e'lon
- Sarlavha: **Formada «kim» qatori yo'q. E'lon kimniki bo'ladi?** (49)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Avval taxminingizni belgilang, keyin telefonda «Yuborish»ni bosing.
  - 1-harakatdan keyin: Endi xuddi shu e'lonni tokensiz yuborib ko'ring — Backend nima qilishini kuzating.
  - tugagach: Ikkala yuborish tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada: **Backend e'lon egasini qayerdan biladi?** · Telefon raqamidan · So'rovdagi tokendan.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chap (telefon): «Maydon Jamoa» — «E'lon berish» ekrani, forma to'ldirilgan: Kun `Yakshanba` · Soat `19:00` · Maydon `Maktab maydoni` · Nechta odam `10` · «Yuborish» (bashoratdan keyin halqada).
  Telefon ustida kichik yorliq: «kirgan: Ali».
- O'ng (vizual): Backend qutisi (`POST /oyinlar` yo'li ajralib turadi) va Database kartasi — `oyinchilar`: `1 · Namuna tashkilotchi` · `2 · Ali`; `oyinlar`: to'rt qator (Shanba 18:00 · Shanba 20:00 · Yakshanba 10:00 · Yakshanba 17:00), `tashkilotchi_id` ustuni bilan.
- **Harakat → Vizual o'zgarish:**
  - «Yuborish» → konvert `POST /oyinlar { kun, soat, maydon, kerak }` telefondan chiqadi, yonida kichik `token` yorlig'i → Backend qutisida token ochiladi va `oyinchilar` dagi `2 · Ali` qatori bir lahza yonadi →
    `oyinlar` ga yangi qator sirg'alib kiradi `5 · Yakshanba, 19:00 · Maktab maydoni · 10 · tashkilotchi_id 2` — `tashkilotchi_id` katagi accent, yonida yorliq «tokendan — formada yo'q» (~1 s yashil) →
    telefon «O'yinlar»ga qaytadi, beshinchi karta ajralib kiradi: «Yakshanba, 19:00 · Maktab maydoni · 10 kishi kerak».
  - «Tokensiz yuborish» (ikkinchi tugma, telefon ostida, halqada) → konvert `token` yorlig'isiz chiqadi → Backend qutisida qizil `401` → konvert telefonga qaytadi →
    telefonda mono qator `401 · Unauthorized`, forma joyida qoladi → `oyinlar` jadvali o'zgarmaydi, ostida kulrang qator: «yangi qator yo'q».
  - Holat bosishlardan chiziladi (P-046): avval «Yuborish», keyin «Tokensiz yuborish» — tartib qulf bilan.
- Joriy qator (2/2 dan keyin, bitta): Backend tokendan kirgan o'yinchini taniydi va e'lon egasini shundan yozadi. (75)
- Natija qatori: «Taxminingiz: … · haqiqatda: so'rovdagi tokendan» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: E'lon Database'ga yoziladi, egasini Backend tokendan oladi. Formada «kim» so'ralmaydi. (86)
- Tugadi (199): harakat paneli yopiladi; telefon («O'yinlar», beshta karta) va `oyinlar` jadvalidagi yangi qator butun enga, `tashkilotchi_id` katagi fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Ikkala yuborishni bosing (N/2) → Davom etish
✎ Bitta g'oya (P-008): e'lonning egasi — token egasi; shuning uchun talabda «tashkilotchi — kirgan o'yinchi, formada so'ralmasin» deb yoziladi (A1 «Yordam»). Ko'prik (P-020): 10-darsda token bilan
  ro'yxat olindi; bugun token bilan yoziladi. Bu gap ekranda aytilmaydi — kartochka 3 va A1 «Yordam»da. 1-savol shu qoidani boshqa vaziyatda (agent formaga maydon qo'shgan) so'raydi (§106).

## A1 · Amaliyot 1 — e'lon berish  ← amaliyot bloki (≈22 daq)
- Eyebrow: Amaliyot 1 · e'lon berish
- Sarlavha: **Funksiyangizning birinchi qismi telefonda ishlasin.** (51)
- Mentor: Uch qatorni o'zingiz yozasiz — har qator ostida kulrang savol, Mentor misoli «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (10-darsdagi holat: kirish ishlaydi, asosiy ro'yxat Backend'dan keladi).
     Roadmap'ingizdagi birinchi funksiya: **«{1-funksiya}»** (6-darsdagi roadmap'dan; bo'lmasa — shu qatorga o'zingiz yozing).
     Uni uch blokda qurasiz; Mentor misolida: 1 — e'lon berish (ro'yxatga yangisi qo'shiladi) · 2 — qo'shilish (asosiy harakat) · 3 — ekran yangilanishi.
     Funksiyangizda yangisini qo'shish bo'lmasa — bu blokda uning birinchi ko'rinadigan qismini quring.
  2. **Prompt** — vazifa: funksiyangizning birinchi qismi ishlasin va natijasi ro'yxatda chiqsin (Mentor misolida — tashkilotchi o'yin e'lon qiladi, e'lon ro'yxatda chiqadi).
     Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.  ← tayyor qator
     Qatorlar ostidagi kulrang savollar (uch blokda bir xil):
     `{qayerda}` — Qaysi ekran, qaysi tugma va Backend'da qaysi yo'l? ·
     `{nima qilsin}` — Bosilganda nima bo'lsin — Backend'da va ekranda? Qachon bo'lmasin? ·
     `{nima buzilmasin}` — Oldin ishlagan qaysi narsa joyida qolsin?
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq talab, mobil trek):
     > Qayerda: `mobil/` — «E'lon berish» ekrani (`src/app/elon.tsx`) va «O'yinlar» (`src/app/index.tsx`); `backend/` — yangi yo'l `POST /oyinlar`.
     > Nima qilsin: «Yuborish» bosilganda kun, soat, maydon va nechta odam kerakligi token bilan `POST /oyinlar` ga ketsin. Backend e'lonni `oyinlar` ga yozsin; tashkilotchi — token egasi, formada «kim» so'ralmasin.
     > Maydonlardan biri bo'sh bo'lsa — Backend yozmasin (`400`), ilova nima yetmaganini aytsin. Yuborilgach «O'yinlar» ochilsin, yangi o'yin ro'yxatda tursin.
     > Nima buzilmasin: kirish, «O'yinlar» ro'yxati, «O'yin» ekrani va animatsiyalar.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): forma `prototip/` dagi e'lon sahifasida, so'rov `VITE_API_URL` dagi Backend'ga, token `localStorage` dan; foydalanuvchi matni sahifaga HTML bo'lib chiqmasin (10-darsdagidek).
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "e'lon berish"`, `git push`.
     Render yangi deploy qiladi — xizmatingizning Deploys sahifasida tugashini kuting. Mobil trekda `npx expo start` ishlab tursin: fayl o'zgarsa, Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`).
     Web-trekda push'dan keyin Netlify o'zi yangilanadi. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini telefonda bajarib ko'ring. Mentor misolida:
     (1) «E'lon berish»da formani to'ldirib yuboring — «O'yinlar» tepasida yangi o'yin chiqsin.
     (2) Bitta maydonni bo'sh qoldirib yuboring — ilova nima yetmaganini aytsin, ro'yxatga bo'sh e'lon qo'shilmasin.
     (3) Neon'dagi SQL Editor'da `SELECT * FROM oyinlar ORDER BY yaratilgan DESC;` — birinchi qator sizning e'loningiz, `tashkilotchi_id` to'ldirilgan.
     Mos kelmagan gapni uch qism bilan agentga yozing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; ikki kadr bir marta o'zi yuradi):
  - «E'lon berish»: Kun `Yakshanba` · Soat `19:00` · Maydon `Maktab maydoni` · Nechta odam `10` · «Yuborish»
  - «O'yinlar» (eng yangisi tepada — tayanch 9.29): **Yakshanba, 19:00 · Maktab maydoni · 10 kishi kerak** (yangi, bir lahza yashil) · Yakshanba, 17:00 · Mahalla maydoni · 10 kishi kerak ·
    Yakshanba, 10:00 · Park maydoni · 8 kishi kerak · Shanba, 20:00 · Maktab maydoni · 10 kishi kerak · Shanba, 18:00 · Mahalla maydoni · 10 kishi kerak
  - ostida jadval-karta (Neon · SQL Editor): `oyinlar` — `5 · Yakshanba, 19:00 · Maktab maydoni · 10 · tashkilotchi_id 2`
- Hammasi bajarilgach (yashil): Birinchi qism ishlaydi: natija Database'ga yoziladi va ro'yxatda chiqadi. (73)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-11-done` —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Blok modeli — tayanch 4 va 9.1: hamma qadam o'z repo'sida, Mentor misoli — namuna (o'ngda va «Yordam»da). Talab zinapoyasi 11-dars: uch qator o'quvchidan (tayanch 4).
  Kulrang savollar — 9.1 dagi «masalan: …» namunasi o'rniga (uch qator butunlay o'quvchidan; namuna-qiymat «Yordam» ortida — TAYANCHGA SAVOL 7).
  Kartada «8 / 10» hali yo'q — u A2 da Backend'dan keladi (tayanch 9.2); A1 dan keyin karta 10-darsdagidek «N kishi kerak».

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Agent e'lon formasiga «Tashkilotchi» maydonini qo'shdi. Agentga nima yozasiz?** (9 so'z)
  - Maydonni qoldir, ismni o'yinchi o'zi yozsin
  - Maydonni majburiy qil, bo'sh yuborilmasin
  - ✔ Maydonni olib tashla, egasini tokendan ol
  - Tokenni olib tashla, egasini formadan ol
- Kalit: **C** (index 2). To'rttalasi agentga buyruq (T-002 istisnosi), bir shaklda (buyruq va kerakli natija); «Maydonni» A, B, C da · «token» C va D da · «egasini» C va D da (S-003, §204); to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: Backend egasini tokendan oladi — formada «kim» so'ralmaydi. (59)
- Xato izohlari (≤60):
  - A: Ismni har kim istaganicha yozadi. Egasi qayerdan keladi? (56)
  - B: Bo'sh forma — boshqa holat. Bu maydonning o'zi kerakmi? (55)
  - D: Tokensiz Backend kim yuborganini bilmaydi. (42)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda token egasini harakat ko'rsatdi; savol boshqa vaziyatni — agent talabda aytilmagan joyni o'zicha to'ldirgan holatni — so'raydi (§106) va darsning asosiy ko'nikmasini (tuzatish talabi) ham ushlaydi.

## 4 · Ekrandagi son eskirgan bo'lsa  ← QTushuncha
- Eyebrow: Tushuncha · to'lgan o'yin
- Sarlavha: **Ekranda «9 / 10», o'yin esa to'lgan bo'lsa-chi?** (47)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Ikki o'yinchi bitta o'yinni ochib turibdi — avval taxminingizni belgilang, keyin 2-telefonda «Qo'shilaman»ni bosing.
  - 2-telefon qo'shilgach: Endi talab qatorlarini bittadan tekshiring — «Tekshirish»ni bosing va 1-telefonni kuzating.
  - tugagach: Ikkala qator tekshirildi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada: **Ilova to'lgan o'yinda tugmani yashirsa, 1-telefon qo'shila oladimi?** · Qo'shila olmaydi · Qo'shila oladi.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chap (vizual): ikki telefon yonma-yon (o'lchami barqaror) — «1-telefon · o'yinchi» va «2-telefon · o'yinchi»; ikkalasida «O'yin» ekrani: «Yakshanba, 17:00» · «Mahalla maydoni» · **9 / 10** · 9 doira + 1 bo'sh joy · «Qo'shilaman».
- O'ng (vizual): Database kartasi — «Yakshanba 17:00 · qo'shilganlar» va katta son **9 / 10** (`ishtirokchilar` sanog'i), ustida Backend qutisi (`POST /oyinlar/:id/qoshilish`).
- Harakat (telefonlar ostida): avval 2-telefondagi «Qo'shilaman» (halqada); keyin talab qatorlari **bittadan** katta karta bo'lib chiqadi (SABOQ 9, 13). Karta: yorliq «Qator N / 2» · talab qatori (katta) · bitta tugma «Tekshirish».
  Tartib:
  1. «Nima qilsin: o'yin to'lsa, ilova «Qo'shilaman»ni yashirsin.»
  2. «Nima qilsin: o'yin to'lsa, Backend qo'shmasin, ilova «O'yin to'ldi» desin.»
- **Harakat → Vizual o'zgarish:**
  - 2-telefon «Qo'shilaman» → konvert Backend'ga → Database sanog'i «9 / 10» → «10 / 10» (son sanab o'tadi, ~1 s yashil) → 2-telefonda «10 / 10», tugma «Qo'shildingiz» (o'chiq) →
    1-telefon **o'zgarmaydi**: «9 / 10» va «Qo'shilaman» turibdi, son yonida kulrang yorliq «oxirgi so'rovdagi son».
  - 1-qator «Tekshirish» → 1-telefonda tugma ko'rinib turibdi (ekranda hali «9 / 10») → «Qo'shilaman» bosiladi → konvert → Database sanog'i «11 / 10» qizil →
    1-telefonda «11 / 10» qizil, doiralar chegaradan chiqadi → karta qizil ✗, yorliq: «Ekrandagi son eskirgan edi — ilova bilmadi.» (43) → bir lahzadan keyin sahna qaytadi (Database «10 / 10»).
  - 2-qator «Tekshirish» → 1-telefonda «Qo'shilaman» bosiladi → konvert → Backend qutisida Database'ga qarash belgisi: «10 / 10 — to'lgan» → javob konverti `409 · O'yin to'ldi` qaytadi →
    1-telefonda tugma o'rnida «O'yin to'ldi», son «10 / 10» ga almashadi → Database sanog'i o'zgarmaydi → karta yashil ✓, yorliq: «Backend Database'ga qaradi.» (27)
  - Har qator bitta tugma bilan tekshiriladi — noto'g'ri tanlov yo'q; qaror bashoratda, natija harakatda (P-046: holat o'quvchi bosgan qatorlardan chiziladi).
- Joriy qator (2/2 dan keyin, bitta): Telefon sonni oxirgi so'raganda olgan — boshqa o'yinchi undan keyin qo'shilgan bo'lishi mumkin. (95)
- Natija qatori: «Taxminingiz: … · haqiqatda: qo'shila oladi — ekranida hali «9 / 10» edi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Telefondagi son eskirgan bo'lishi mumkin. To'lgan o'yinni Backend tekshiradi, ilova «O'yin to'ldi» deydi. (105)
- Tugadi (199): harakat paneli yopiladi; ikki telefon (1-telefonda «O'yin to'ldi») va Database sanog'i «10 / 10» butun enga, fokusda; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → 2-telefonda qo'shiling → Qatorlarni tekshiring (N/2) → Davom etish
✎ Bitta g'oya (P-008): ekrandagi son so'ralgan paytdagi holat — to'lgan o'yinni Backend tekshiradi. Ikki marta bosish (hook) ham shu qoidaga tushadi — Backend o'yinchi oldin qo'shilganini ko'radi (A2 talabi).
  Bir vaqtda ikki kishi oxirgi joyni bosishi — 14-dars (tayanch 1.7); bu sahnada bosishlar ketma-ket. 2-savol shu qoidani boshqa sonlar bilan so'raydi (§106).

## A2 · Amaliyot 2 — qo'shilish  ← amaliyot bloki (≈22 daq)
- Eyebrow: Amaliyot 2 · qo'shilish
- Sarlavha: **Asosiy harakat ishlasin, natija Database'da qolsin.** (51)
- Mentor: Endi talabga bo'lmasligi kerak bo'lgan holatni ham yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — e'lon berish ishlayapti. Funksiyangizning asosiy harakatini toping: foydalanuvchi ro'yxatdagi biriga nima qiladi? (Mentor misolida — o'yinchi o'yinga qo'shiladi.)
     Qachon bu harakat bo'lmasligi kerak? (Mentor misolida — o'yin to'lgan yoki o'yinchi oldin qo'shilgan.)
  2. **Prompt** — vazifa: asosiy harakat ishlasin, natija Database'da qolsin; bo'lmasligi kerak bo'lgan holatda Backend yozmasin, ilova nima bo'lganini aytsin.
     Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.  ← tayyor qator
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq talab, mobil trek):
     > Qayerda: `backend/` — yangi yo'l `POST /oyinlar/:id/qoshilish` va `GET /oyinlar`; `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`) va «O'yinlar» kartalari.
     > Nima qilsin: «Qo'shilaman» bosilganda token bilan `POST /oyinlar/:id/qoshilish` ketsin; Backend `ishtirokchilar` ga `qoshildi` qatorini yozsin.
     > O'yin to'lgan bo'lsa yoki bu o'yinchi oldin qo'shilgan bo'lsa — yozmasin, `409` va xabar qaytarsin: «O'yin to'ldi» yoki «Siz bu o'yinga qo'shilgansiz»; ilova shu xabarni ko'rsatsin.
     > Bitta o'yinchi bitta o'yinda bir marta yozilsin — Database qoidasi bilan ham.
     > `GET /oyinlar` har o'yinga qo'shilganlar sonini va o'yinchining o'zi qo'shilganini bersin: kartada va «O'yin» ekranida «8 / 10» shu sondan chiqsin, qo'shilgan o'yinda tugma «Qo'shildingiz» (o'chiq).
     > Tekshirish uchun 9 ta namuna o'yinchi qo'sh (kirgan o'yinchi ular qatorida bo'lmasin) va ulardan qo'shilishlar: Shanba 18:00 ga 8, Shanba 20:00 ga 6, Yakshanba 10:00 ga 4,
     > Yakshanba 17:00 ga 9 — bitta namuna o'yinchi bir necha o'yinda bo'lishi mumkin; bor bo'lsa, qayta qo'shma.
     > Nima buzilmasin: kirish, e'lon berish va «8 / 10» animatsiyasi.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): tugma va son `prototip/` dagi o'yin sahifasida, so'rov `VITE_API_URL` dagi Backend'ga, token `localStorage` dan — Backend qismi ikkala trekda bir xil.
  3. **Ishga tushirish** — `git status` → har faylni `git add <fayl>` → `git commit -m "qo'shilish"` → `git push`; Render'da yangi deploy tugashini kuting (Deploys sahifasi).
     Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r` (web-trekda — Netlify). Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini telefonda bajarib ko'ring. Mentor misolida:
     (1) Shanba 18:00 dagi o'yinga qo'shiling — «8 / 10» → «9 / 10», tugma «Qo'shildingiz».
     (2) Terminalda `r` ni bosing (web-trekda sahifani yangilang) — «9 / 10» va «Qo'shildingiz» joyida.
     (3) Yakshanba 10:00 dagi «Qo'shilaman»ni tez ikki marta bosing — «4 / 8» → «5 / 8»: son faqat bittaga oshsin.
     (4) To'lgan o'yin — test holati: Neon'dagi SQL Editor'da kerakli odam sonini vaqtincha kamaytirasiz. `SELECT id, soat, maydon, kerak FROM oyinlar;` — Shanba 20:00 ning `id` sini toping,
         `UPDATE oyinlar SET kerak = 6 WHERE id = …;` → telefonda Shanba 20:00 dagi «Qo'shilaman»ni bosing — ilova «O'yin to'ldi» desin, son oshmasin.
         So'ng qaytaring: `UPDATE oyinlar SET kerak = 10 WHERE id = …;`
     O'z mahsulotingizda bo'lmasligi kerak bo'lgan holatni ham shunday yarating va tekshiring. Mos kelmagan gapni uch qism bilan agentga yozing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, uch kadr bir marta o'zi yuradi):
  - «O'yin» (Shanba, 18:00 · Mahalla maydoni): «8 / 10» · «Qo'shilaman» → «9 / 10» (son kattalashib qaytadi) · 9 doira, oxirgisi ostida «Siz» · «Qo'shildingiz» (o'chiq)
  - «O'yin» (Shanba, 20:00 · Maktab maydoni, test holati): «Qo'shilaman» → xabar «O'yin to'ldi» · son «6 / 6»
  - ostida jadval-karta (Neon · SQL Editor): `ishtirokchilar` — `oyin_id 1 · oyinchi_id 2 · qoshildi` (yangi qator, bir lahza yashil)
- Hammasi bajarilgach (yashil): Asosiy harakat ishlaydi: natija Database'da qoladi, bo'lmasligi kerak bo'lgan holatda Backend yozmaydi. (103)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Hook (ikki marta bosish) va 4-ekran (to'lgan o'yin) shu blokning «Nima qilsin» qatoriga tushadi. Test holati SQL bilan (GATE M 11-q0 A) — bitta telefonda to'lgan o'yinni yasaydi: `kerak` kamayadi, boshqa o'yinchi qo'shilmaydi (11-FILTR 16).
  Tekshiruv (3) natijani ko'rsatadi: ikkinchi bosishni ilova to'xtatdimi yoki Backend — ajratmaydi; Backend himoyasi — 4-ekranda va Database qoidasida (11-FILTR 15).
  Namuna qo'shilganlar — tayanch 9.2 («8 / 10» Backend'dan — 11-darsdan; TAYANCHGA SAVOL 2).

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Ekranda «7 / 8». Oxirgi joyni boshqa o'yinchi oldi. Bossangiz nima bo'lishi kerak?** (11 so'z; «7 / 8» — bitta)
  - Backend qo'shadi, ilova «8 / 8» ni ko'rsatadi
  - Backend qo'shadi, ilova «9 / 8» ni ko'rsatadi
  - Ilova qo'shmaydi, tugmani o'zi yashirib qo'yadi
  - ✔ Backend qo'shmaydi, ilova «O'yin to'ldi» deydi
- Kalit: **D** (index 3). To'rttalasi «kim — nima qiladi, ilova — nima ko'rsatadi» shaklida; «Backend» A, B, D da · «qo'shmaydi» C va D da · «ilova» hammasida; to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: Backend Database'ga qaraydi — ekrandagi son eskirgan edi. (57)
- Xato izohlari (≤60):
  - A: Database'da o'yin to'lgan edi. Backend yana qo'shsinmi? (55)
  - B: Bu — talabda aytilmagan holat. Kim tekshirishi kerak edi? (57)
  - C: Ekranda «7 / 8» turibdi — ilova joy bor deb biladi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 4-ekranda «9 / 10» va ikki telefon edi; savol boshqa son va bitta o'quvchi nuqtai nazaridan («bossangiz») so'raydi (§106).

## A3 · Amaliyot 3 — ekran yangilanishi  ← amaliyot bloki (≈16 daq)
- Eyebrow: Amaliyot 3 · yangilash
- Sarlavha: **Ro'yxat yangilansin: Database'dagi o'zgarish ko'rinsin.** (55)
- Mentor: Oxirgi blok — ekran Database bilan bir xil bo'lsin, keyin butun funksiyani tekshirasiz; «1 · Ochish»dan boshlang.
- Qadamlar (hammasi o'z repo'ngizda, o'z trekingizda — `pm-m9d8-platforma`):
  1. **Ochish** — qo'shilish ishlayapti. 8-darsda `README.md` ga yozgan real vaqt nuqtangizni toping: ekranda boshqa foydalanuvchi tufayli o'zgaradigan joy (Mentor misolida — «8 / 10»).
  2. **Prompt** — vazifa: shu joy ekran ochilganda va pastga tortilganda (web-trekda — «Yangilash» bosilganda) Backend'dan qayta kelsin; bo'lmasligi kerak bo'lgan holat ekranda oldindan ko'rinsin.
     Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.  ← tayyor qator
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq talab, mobil trek):
     > Qayerda: `mobil/` — «O'yinlar» (`src/app/index.tsx`) va «O'yin» (`src/app/oyin/[id].tsx`) ekranlari.
     > Nima qilsin: ikkala ekran ochilganda va pastga tortilganda ma'lumotni `GET /oyinlar` dan qayta olsin.
     > O'yin to'lgan bo'lsa — kartada son yonida «to'ldi», «O'yin» ekranida «Qo'shilaman» o'rnida «O'yin to'ldi» tursin.
     > Nima buzilmasin: e'lon berish, qo'shilish, «Qo'shildingiz» va animatsiyalar.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): pastga tortish o'rniga «Yangilash» tugmasi — ro'yxat va o'yin sahifasi ochilganda va shu tugma bosilganda `GET /oyinlar` dan qayta olinsin.
  3. **Ishga tushirish** — bu blokda Backend o'zgarmaydi: Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r`; web-trekda — `git push`, Netlify saytni o'zi yangilaydi. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — butun funksiyani tekshiring. Mentor misolida:
     (1) Test holati: Neon'dagi SQL Editor'da siz qo'shilmagan Yakshanba 17:00 da kerakli sonni 9 ga tushiring: `UPDATE oyinlar SET kerak = 9 WHERE id = …;` → telefonda «O'yinlar»ni pastga torting (web-trekda — «Yangilash») —
         kartada «9 / 9 · to'ldi», «O'yin» ekranida «Qo'shilaman» o'rnida «O'yin to'ldi».
     (2) Qaytaring: `UPDATE oyinlar SET kerak = 10 WHERE id = …;` → yana pastga torting — «9 / 10» va «Qo'shilaman» qaytdi.
     (3) Uch blok talablarining har gapini yana bir marta bajaring: e'lon berish, qo'shilish, ikki marta bosish.
     Oxirida `git status` → `git add <fayl>` → `git commit -m "yangilash"` → `git push`.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, uch kadr bir marta o'zi yuradi):
  - «O'yinlar» pastga tortilmoqda (tepada aylanuvchi belgi)
  - kartalar (eng yangisi tepada — 9.29): Yakshanba, 19:00 · 0 / 10 · **Yakshanba, 17:00 · 9 / 9 · to'ldi** · Yakshanba, 10:00 · 5 / 8 · Shanba, 20:00 · 6 / 10 · Shanba, 18:00 · 9 / 10 ✎ F-1006-280: tartib 9.29 ga moslandi; A2 prompt gapidan «(kulrang savollar — A1 dagidek)» olindi — o'quvchiga ichki «A1» belgisi chiqardi (quruvchi)
  - to'lgan karta bosiladi → «O'yin» (Yakshanba, 17:00 · Mahalla maydoni): «9 / 9» · tugma o'rnida «O'yin to'ldi»
- Hammasi bajarilgach (yashil): Birinchi funksiya ishlaydi: ekran yangilanadi, to'lgan holat oldindan ko'rinadi. (80)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Nishon (bonus): First Feature — oxirgi «Bajardim»da (4-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Real vaqt nuqtasi — 8-dars README'sidan (tayanch 9.19); bu modulda u ekran ochilganda va pastga tortilganda so'raladi (tayanch 1.6). O'zi yangilanishi va'da qilinmaydi (T-038).
  A3 da faqat ilova o'zgaradi — Render kutilmaydi. Kutilgan natija A2 dan keyingi holatdan: Shanba 18:00 «9 / 10» va Yakshanba 10:00 «5 / 8» — Mentor misolida o'zi qo'shilgan o'yinlar;
  to'ldiriladigan o'yin — qo'shilmagani (aks holda tugma «Qo'shildingiz» bo'lib qoladi).

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — E'lon egasi» · 5 — «2 — To'lgan o'yin».

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- SABOQ 12 (foydalanuvchining qat'iy qoidasi 05.10): kartochkalar yakun ichida emas — alohida ekran. Tartib: … → podium → **kartochkalar** → yakun.
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16).
- Kartochkalar — 12 ta (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 7 · Yakun — keyingi dars  ← QYakun (172; kartochkalar — oldingi alohida ekranda)
- Eyebrow: Yakun · belgi «✓ Birinchi funksiya ishlaydi» — faqat A3 bajarilganda
- Sarlavha (bloklar holatiga qarab, P-046; 11-FILTR 36): A3 — **Birinchi funksiya ishlayapti: talabni siz yozdingiz.** (52) ·
  A2 — **Asosiy harakat ishlaydi — yangilanish qoldi.** (44) · A1 — **Birinchi qism ishlaydi — asosiy harakat qoldi.** (46) · hech biri — **Birinchi funksiya boshlandi — qolgan qadamni tugating.** (54)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (4):
  - Roadmap'dagi funksiyani uch qatorli talabga aylantirib, o'zingiz yozasiz.
  - Talabda aytilmagan holatni agent o'zi taxmin qilishi mumkin — uni talabda yozasiz.
  - E'lon egasini Backend tokendan oladi, «8 / 10» esa Database'dan sanaladi.
  - Ekrandagi son eskirgan bo'lishi mumkin: to'lgan o'yinni Backend tekshiradi.
- Uyga vazifa — yo'q (P-058: ish repo'da — uch blok o'z mahsulotingizda bajarildi; ekranda alohida blok yo'q).
- Keyingi dars — «Loyiha kuni: 2-asosiy funksiya»: roadmap'dagi ikkinchi funksiya.
- Nishonlaringiz — N/3
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Right Owner** — E'lon egasi tokendan olinishini topdingiz (3-ekran, 1-savol)
- **Full Game** — To'lgan o'yinni Backend tekshirishini topdingiz (5-ekran, 2-savol)
- **First Feature** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «E'lon egasi — tokendan»
   - `POST /oyinlar` · E'lon — Kun, soat, maydon va odam soni Backend'ga ketadi.
   - `Authorization: Bearer <token>` · Token — So'rov bilan birga kim yuborgani ham keladi.
   - `tashkilotchi_id` · Egasi — Backend uni tokendan yozadi, formadan emas.
   - Sinfga savol: Formaga «Tashkilotchi» maydoni nega kerak emas?
2. 2-savol (5-ekran) — «To'lgan o'yinni Backend tekshiradi»
   - `9 / 10` · Ekran — Telefon oxirgi so'ralgan sonni ko'rsatadi.
   - `POST /oyinlar/:id/qoshilish` · Backend — Database'dagi sonni ko'rib, o'yin to'lganini biladi.
   - `409 · O'yin to'ldi` · Javob — Backend qo'shmaydi, ilova xabarni ko'rsatadi.
   - Sinfga savol: Ekranda joy bor edi — nega qo'shila olmadingiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Roadmap'dagi funksiyani agentga qanday berasiz? | Uch qatorli talab qilib: qayerda, nima qilsin, nima buzilmasin | Bu darsda uchala qatorni o'zingiz yozdingiz |
| PRD gapining o'zi agentga yuborilsa, nima bo'lishi mumkin? | Aytilmagan holatni agent o'zi taxmin qiladi | Mentor misolida: ikki marta bosilganda «10 / 10» |
| E'lon egasini Backend qayerdan oladi? | So'rovdagi tokendan | Formada «kim» so'ralmaydi |
| Ilova qayta yuklansa, yangi e'lon nega yo'qolmaydi? | U Database'ga yozilgan | 7-darsdagi prototipda e'lon faqat ochiq sahifada edi |
| «8 / 10» dagi 8 qayerdan keladi? | Database'dagi qo'shilganlar sonidan | Backend sanaydi — telefon o'zi qo'shib qo'ymaydi |
| Bir o'yinchi «Qo'shilaman»ni ikki marta bossa, nima bo'lishi kerak? | Son bittaga oshadi | Backend ikkinchisiga `409` qaytaradi |
| Nega to'lgan o'yinni faqat ilova tekshirsa yetmaydi? | Ekrandagi son eskirgan bo'lishi mumkin | Siz bosguncha boshqa o'yinchi qo'shilgan bo'lishi mumkin |
| To'lgan o'yinda «Qo'shilaman» o'rnida nima turadi? | «O'yin to'ldi» | Backend ham bu o'yinga qo'shmaydi |
| Boshqa telefondagi «8 / 10» qachon yangilanadi? | Ekran ochilganda yoki pastga tortilganda | «8 / 10» — real vaqt nuqtasi |
| Backend o'zgarishi telefonga qachon yetadi? | Push'dan keyin Render yangi deploy'ni tugatgach | Xizmatning Deploys sahifasida ko'rinadi |
| To'lgan o'yinni bitta telefon bilan qanday tekshirasiz? | Neon'dagi SQL Editor'da test holati bilan | Kerakli sonni vaqtincha kamaytirasiz, keyin qaytarasiz |
| Agent «Tayyor» desa, ishni qanday tekshirasiz? | Talabning har gapini telefonda bajarib ko'rib | Agent talabga tayanib quradi, taxmin qilishi mumkin |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
1. Roadmap'dagi funksiyani agentga qanday berasiz? ✔ Uch qatorli talab qilib, o'zingiz yozib · Roadmap qatorini o'zgartirmay, o'zini · PRD ning hamma bo'limini birdaniga yuborib · Faqat funksiya nomini, qisqa qilib yozib
2. Talabda ikki marta bosish aytilmagan. Agent nima qilishi mumkin? Tugmani ekrandan butunlay olib tashlaydi · ✔ Bu holatni o'zicha taxmin qilib quradi · Funksiyani umuman qurmasdan qoldiradi · Ilovani boshidan to'liq qayta yozadi
3. Formada «kim» yo'q. E'lon egasi qayerdan olinadi? Telefon raqamidan, so'rovdagi · Ilova ustidagi ism yozuvidan · ✔ So'rov bilan kelgan tokendan · Database'dagi oxirgi qatordan
4. Ilova qayta yuklandi. Yangi e'lon nega yo'qolmadi? Telefon xotirasiga yozilgani uchun · Agent uni namunaga qo'shgani uchun · Expo Go uni o'zida saqlagani uchun · ✔ U Database'ga yozilgani uchun
5. «8 / 10» dagi 8 qayerdan keladi? ✔ Database'dagi qo'shilganlar sonidan · Telefonda bosilgan tugmalar sanog'idan · Prototipdagi namuna fayl raqamidan · Tashkilotchi formaga yozgan sondan
6. Bir o'yinchi «Qo'shilaman»ni ikki marta bosdi. Nima bo'lishi kerak? Son ikkiga oshadi, ikkala joy ham olinadi · ✔ Son bittaga oshadi, ikkinchisi yozilmaydi · Son o'zgarmaydi, ikkala bosish ham bekor · O'yin o'chadi, qayta e'lon kerak bo'ladi
7. Ekranda «9 / 10», o'yin esa to'lgan. Nega shunday? Backend sonni noto'g'ri sanab qo'ygan · Database'ga qo'shilganlar yozilmagan · ✔ Ekranda oxirgi so'ralgan son turibdi · Agent ekranni noto'g'ri qurib qo'ygan
8. To'lgan o'yinga qo'shmaslikni qayerda tekshirish kerak? Ilovada, tugmani ekrandan yashirib · Talabda, agent o'zi bilsin deb · Neon'da, har kuni qo'lda sanab · ✔ Backend'da, Database'ga qarab
9. Backend to'lgan o'yinga qo'shmadi. Ilova nima ko'rsatadi? ✔ «O'yin to'ldi» degan xabarni · «11 / 10» degan yangi sonni · Yozuvsiz, bo'sh qolgan ekranni · Qayta ochilgan «Kirish» ekranini
10. Boshqa telefondagi «8 / 10» qachon yangilanadi? Har soniyada o'zi, hech narsa so'ramasdan · ✔ Ekran ochilganda yoki pastga tortilganda · Faqat ilova qayta o'rnatilgandan keyin · Tashkilotchi o'yinga ruxsat berganda
11. Backend o'zgardi. Telefonda u qachon ishlaydi? Agent «Tayyor» deb javob berishi bilan · `git commit` qilinishi bilan, push'siz · ✔ Push'dan keyin Render yangilangach · Telefon o'chib, qayta yoqilgandan keyin
12. Agent «Tayyor» dedi. Keyin nima qilasiz? Shu zahoti keyingi blokka o'tasiz · Agentdan yana bir bor so'rab ko'rasiz · README'ga «tayyor» deb yozib qo'yasiz · ✔ Talabning har gapini tekshirasiz

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik (python): to'g'ri variant hech bir savolda yolg'iz eng uzun emas (sanog'i — `md11/olchov.py`); 11-savolda kod belgisi to'g'ri variantda yo'q (`git commit` — B da).
Fon so'zlari (R-008, kodda {uz, ru}): talab · e'lon · Qo'shilaman · O'yin to'ldi · 8 / 10 · token · Backend · Database · `POST /oyinlar` · `409` · Render · Maydon Jamoa

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **3 (D)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`JAMOA_F1` + `FunksiyaSahna`** — bitta manba (180): telefon (ekranlar O'yinlar · O'yin · E'lon berish; tugma holatlari «Qo'shilaman» / «Qo'shildingiz» / «O'yin to'ldi»; doiralar soni sanoqdan),
   agent chati (faqat 0-ekran), Backend qutisi (uch yo'l), Database kartasi (`oyinlar` qatorlari, `oyinchilar` mini, `ishtirokchilar` sanog'i). Holatlar: kulrang · oq · accent · yashil · qizil.
   Namuna o'yinlar — 7/9/10-dars `namuna` bilan bir manba (tayanch 9.2): sanoqlar 8 · 6 · 4 · 9, kerak 10 · 10 · 8 · 10; yangi e'lon — Yakshanba, 19:00 · Maktab maydoni · 10.
   «8 / 10» → «9 / 10» son animatsiyasi — 7-dars naqshi (bir lahza kattalashib, silliq qaytadi; 9.14). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4).
3. 0-ekran `QKirish`: maket — agent chati (PRD gapi + «Tayyor!») va telefon («O'yin», «8 / 10»); javobdan keyin «Qo'shilaman» ikki marta bosiladi → «10 / 10», ikki doira «Siz» qizil halqada,
   chatdagi PRD gapi ostida uzuq chiziqli «ikki marta bosilsa — ?» qatori (U-041: bo'sh joy).
4. 2-ekran `QTushuncha`: `QBashorat`/`QTaxmin` (yopilmaydi — `TaxminIxcham`), telefondagi «Yuborish» (halqa) va «Tokensiz yuborish» (navbat bilan), konvert (`token` yorlig'i bilan/siz),
   `oyinlar` ga qator kirishi, `tashkilotchi_id` yorlig'i, `401` → «Kirish» bir lahza, `zoom`, `tugadi`. Holat bosishlardan chiziladi (P-046).
5. 4-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, ikki telefon (o'lchami barqaror), Database sanog'i, 2-telefon «Qo'shilaman» (halqa) → keyin talab qatori kartasi bittadan (`QKarta` + bitta `QTugma` «Tekshirish»):
   1-qator — «11 / 10» qizil (sahna qaytadi), 2-qator — `409 · O'yin to'ldi`, «O'yin to'ldi» tugma o'rnida. `zoom`, `tugadi`. Telefonda (bir ustun) harakatdan keyin vizual ko'rinadigan joyga suriladi.
6. 3 va 5-ekran `QTest` — matn yuqoridagidek; to'g'ri izoh ≤60, xato izohlari ≤60.
7. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (9-Modul `src/7-Modull/MvpFirstScreenLesson.jsx` naqshi: `yordam`, `XATO_YOLI`). Har blok **4 qadam**, hammasi o'quvchining o'z repo'sida (tayanch 9.1); 5-qadam yo'q.
   - Uch blokda ham uch joy (`A3_JOY` naqshi, 10-dars) — `{qayerda}` · `{nima qilsin}` · `{nima buzilmasin}`; har joy ostida **kulrang savol** (uch blokda bir xil matn, yuqorida); oxirgi qator tayyor, tahrirlanmaydi:
     «Boshqa joyga tegma, o'zgargan fayllarni ayt.» «Nusxalash» — uchala joy to'ldirilgach ochiladi. Qolipda «kulrang savol» turi bo'lmasa — `QPrompt` ga `ipucha` maydoni (asosiy seans qarori; MEXANIZM-TAKLIF 1 bilan bir).
   - A1 1-qadamda roadmap'dagi birinchi funksiya nomi — `pm-m9d6-roadmap` (`hozir` dagi birinchisi → `ishlar[…].nom`); kalit yo'q bo'lsa — tahrirlanadigan bo'sh qator (M-q5 naqshi).
   - Trek `pm-m9d8-platforma` dan: 3-qadamda `mobil` — Expo qatori, `web` — Netlify/`npm run dev` qatori; «Yordam» ostidagi web gapi faqat web-trekda. Kalit yo'q bo'lsa — ikkala qator ham ko'rinadi.
   - 4-qadam nomi: «Telefonda tekshirish» (uch blokda — Backend Render'da, 9.9). O'ng: A1 — telefon (E'lon berish → O'yinlar) + jadval-karta `oyinlar`; A2 — telefon (O'yin, uch kadr) + jadval-karta `ishtirokchilar`;
     A3 — telefon (pastga tortish, kartalar, O'yin «O'yin to'ldi»). SQL qatorlari — mono, nusxalanadigan.
   - `ortda`: faqat A1 da (darsda bir marta, F-1006-271) `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-11-done` (tayanch 3 matni; 9.10).
8. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Right Owner, 5-ekran → Full Game, A3 oxirgi (4-qadam) «Bajardim» → First Feature.
9. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; SABOQ 12, 16). 7-ekran `QYakun`: `uyga` yo'q, `recap` 4 qator, `keyingi` matni yuqoridagidek.
10. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
11. `LESSON_META.lessonId` — `m9-11-v1`, `lessonTitle` — «Loyiha kuni: 1-asosiy funksiya». App.jsx `m9-11` qatoriga `comp: FeatureOneLesson` — «qur» bosqichida (asosiy seans).
12. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates -- src/9-Modull/FeatureOneLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:jsx` 0 · `lint:layout` 1280/1366 · surat 1280 + 393 ·
    `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31).
13. ru — uz tasdiqlangach, bir yo'la (6-RU).

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m11-dars-11-start` → `m11-dars-11-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m11-dars-11-start`** = `m11-dars-10-done` (tayanch 3): `backend/` (uch jadval, `POST /royxat`, `POST /kirish`, `GET /oyinlar` token bilan, Render) · `mobil/` (kirish ekranlari, token `expo-secure-store` da, ro'yxat Backend'dan).
2. **`m11-dars-11-done`** = start + A1–A3 namunasi:
   - `backend/` — `POST /oyinlar` (guard bilan; DTO: `kun`, `soat`, `maydon`, `kerak` — bo'sh bo'lsa `400` va qaysi maydon yetmagani; `tashkilotchi_id` — tokendagi o'yinchi) ·
     `POST /oyinlar/:id/qoshilish` (guard; o'yin yo'q — `404`; o'yinchi oldin qo'shilgan — `409` «Siz bu o'yinga qo'shilgansiz»; qo'shilganlar soni (9.74) `kerak` ga yetgan — `409` «O'yin to'ldi»; aks holda `ishtirokchilar` ga `qoshildi`) ·
     `ishtirokchilar` da (`oyin_id`, `oyinchi_id`) noyob — Database cheklovi (9.83) · `GET /oyinlar` javobi `[{ id, kun, soat, maydon, kerak, qoshilgan, menQoshilganman }]` (9.29; `qoshilgan` — `holat IN ('qoshildi', 'keladi')` sanog'i, 9.74; bu darsda faqat `qoshildi` bor) ·
     namuna: 9 ta namuna o'yinchi (kirgan o'yinchidan alohida) va ulardan qo'shilishlar 8 · 6 · 4 · 9 — jami 27 qator (tayanch 9.2, 9.36; bor bo'lsa qayta qo'shilmaydi). Tartib — `ORDER BY yaratilgan DESC` (9.29).
     Sanab-keyin-yozish — bir vaqtda ikki bosishga himoya emas (bitta tranzaksiya — 14-dars, tayanch 1.7); `README.md` «Keyin» qatorida eslatma.
   - `mobil/` — `src/app/elon.tsx`: forma → `POST /oyinlar` (token bilan), bo'sh maydon xabari, yuborilgach `router.push('/')` (Expo Router, tayanch 6) ·
     `src/app/index.tsx`: kartada `qoshilgan / kerak`, to'lsa «to'ldi»; FlatList `onRefresh` + `refreshing` (pastga tortish), ekranga qaytilganda qayta so'rov ·
     `src/app/oyin/[id].tsx` (`useLocalSearchParams`): «Qo'shilaman» → `POST …/qoshilish` → «Qo'shildingiz» (o'chiq) va son animatsiyasi; `409` xabari ko'rsatiladi; to'lgan o'yinda «O'yin to'ldi»; pastga tortish.
     Ma'lumot — `GET /oyinlar` dan (yangi `GET /oyinlar/:id` ochilmadi; agent ochsa ham talabga zid emas — TAYANCHGA SAVOL 5).
   - `README.md` «Xatolar» jadvaliga: `409 · O'yin to'ldi` — o'yin to'lgan · `409 · Siz bu o'yinga qo'shilgansiz` · `400` — formada bo'sh maydon · telefonda o'zgarish yo'q — Render deploy hali tugamagan.
   - Web-trek namunasi (`prototip/`) bu darsda Backend'ga ulanmaydi — Mentor misoli mobil; web-trek o'quvchisi «Yordam» ostidagi gap bo'yicha yozadi (9.7).
3. **Shart:** `m11-dars-11-start` va `m11-dars-11-done` teglari kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida). Render xizmati (10-darsdan) `yechim` push'ida yangilanadi.
4. **Bog'liqlik:** 12-dars `POST /oyinlar/:id/tasdiq` va «Kelaman» ni shu `ishtirokchilar` ga qo'shadi (namuna Yakshanba 17:00 — 9 qo'shilgan, «7 / 9» shundan); 14-dars «Chiqish» va navbatni shu yo'lga tranzaksiya bilan qo'shadi.
   13-dars sinov topilmasi (ro'yxat kun bo'yicha emas) — bugungi tartibga tayanadi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**Holat (06.10, 11-FILTR):** 1 — GATE M 11-q0 A + tayanch 9.35 («test holati» so'zi — 11-FILTR 16) · 2 — 9.36 · 3 — 9.29 · 4 — 9.31 · 5 — 9.29 · 6 — 9.32 · 7 — kulrang savol soddalashtirildi (11-FILTR 27) · 8 — 11-FILTR 1 · 9 — ochiq (vaqt — 10-dars sinovidagi taymer bilan).
1. **Ikkinchi akkaunt bilan tekshirish** (11, 12, 14 uchun bir usul kerak). Ilovada akkauntdan chiqish tugmasi yo'q (10-dars), «Chiqish» — F3 tugmasi (T-015); sinfdosh telefoni iPhone'da Expo akkaunti tufayli ochilmasligi mumkin.
   Men tanladim: **Neon SQL Editor'da test ma'lumoti** (`UPDATE oyinlar SET kerak = … WHERE id = …;`, keyin qaytariladi) — bitta telefon, «boshqa o'yinchi» o'rnini bosadi (10-Modul `06-PmTrustAudit` naqshi).
   12-dars («Kelishini tasdiqladi», tashkilotchi va o'yinchi) va 14-dars (navbat) ham shu usuldami yoki ilovaga «Akkauntni almashtirish» qo'shiladimi?
2. **Namuna qo'shilganlar** — 9.2 «8 / 10» Backend'dan 11-darsdan» deydi, lekin Database'ga qanday tushishi yozilmagan. Men: A2 talabida «9 ta namuna o'yinchi va qo'shilganlar 8, 6, 4, 9; bor bo'lsa, qayta qo'shma».
3. **Ro'yxat tartibi 11–12-darslarda** — 13-dars sinov topilmasi «e'lonlar qo'shilgan vaqti bo'yicha turibdi, kun bo'yicha emas» (tayanch 1.8). 10-dars REPO esa «`GET /oyinlar` … kun bo'yicha tartibda» deydi — ziddiyat.
   ~~Men: yangi e'lon ro'yxat oxirida~~ — **yopildi: 9.29** (asosiy seans, 06.10): `yaratilgan` bo'yicha, eng yangisi tepada; A1 kutilgan natija va 10-dars REPO tuzatildi.
4. **Tashkilotchi o'z e'loniga avtomatik qo'shilmaydi** — yangi e'lon «0 / 10» (tashkilotchi o'ynasa, o'zi «Qo'shilaman» ni bosadi). Tayanchda yo'q; 12-dars «7 / 9» bilan zid emas.
5. **«O'yin» ekrani ma'lumoti** — tayanch 1.7 «11» faqat ikki POST yo'lini aytadi. Men `GET /oyinlar` javobiga `qoshilgan` va `menQoshilganman` qo'shdim; `GET /oyinlar/:id` nomlanmadi.
6. **`409` matnlari** — «O'yin to'ldi» (tayanch 1.7 so'zi) va yangi «Siz bu o'yinga qo'shilgansiz» (ikki marta bosish uchun). `400` — bo'sh forma.
7. **Kulrang savol-ipucha** — tayanch 9.1 «joy yonida kulrang namuna — Mentor misolidan: «masalan: o'yinlar»» deydi; 11-darsda uch qator butunlay o'quvchidan, namuna-qiymat bersam «Yordam» takrorlanadi.
   Men: har qator ostida bir xil **savol** (Qaysi ekran, qaysi tugma va Backend'da qaysi yo'l? · Bosilganda nima yuboriladi … Nima bo'lmasligi kerak? · Oldin ishlagan qaysi narsa joyida qolsin?). 12, 14-darslar bilan bir xil bo'lishi kerak.
8. **Funksiyani uch blokka bo'lish** — o'quvchi funksiyasi «yangisini qo'shish · asosiy harakat · ekran yangilanishi» ga tushmasligi mumkin (masalan, faqat ko'rish funksiyasi). A1 «Ochish»da bir gap: «birinchi ko'rinadigan bo'lagidan boshlaydi»? — hozir MD da A-bo'limda, ekranda emas.
9. **Backend o'zgargan blokda tekshirish** — push → Render deploy kutiladi (A1, A2; har biri bir necha daqiqa). Laptopda tekshirish yo'q (9.9). Vaqt bo'yicha xavf: sekin internet bo'lsa blok 20 daqiqadan oshadi.

## Shubhali joylar (ishonchim to'liq emas)
- **Hook natijasi «10 / 10»** — misol sahnasi; haqiqiy agent tugmani so'rov paytida o'chirishi yoki ikkinchi bosishni o'zi to'xtatishi mumkin. Matn «Mentor misolida», «bu misolda» bilan chegaralangan; auditor «agent bunday qilmaydi» deyishi mumkin.
- **Render Deploys sahifasi** — rasmiy hujjatdan («Deploys page», render.com/docs/deploys, 06.10); deploy holati yozuvi (masalan «Live») taxmin qilinmadi — MD da «tugashini kuting». Interfeys «qur» da ko'z bilan.
- **Expo Go avtomatik qayta yuklash** — docs.expo.dev/get-started/start-developing (06.10) iqtibosi bor; ba'zan ishlamasa — `r` (10-dars). Matnda endi «odatda o'zi qayta yuklaydi, bo'lmasa — `r`» (11-FILTR 31).
- **Web-trekda pastga tortish** — ko'p telefon brauzerlari sahifani pastga tortganda yangilaydi; hamma brauzerda tekshirilmagan. **Yopildi:** web-trekda «Yangilash» tugmasi (8, 12-darslar bilan bir; 9.84, 11-FILTR 23).
- **SQL `UPDATE`** — `id` ni avval `SELECT` bilan topish kerak; o'quvchi o'z mahsulotida bo'lmasligi kerak bo'lgan holatni SQL'siz (masalan bo'sh forma) yaratishi mumkin. 10-Modulda `INSERT`/`DELETE` bo'lgan, `UPDATE` — birinchi marta.
- **`Authorization: Bearer <token>`** — takrorlash kartasida (10-dars bilan bir); agent boshqa sarlavha tanlasa, ma'no o'zgarmaydi.
- **«Ilova ustidagi ism yozuvidan»** (arena 3) — 2-ekran telefonida «kirgan: Ali» yorlig'i bor; distraktor shu yorliqqa tayanadi — quruvchi yorliqni Backend'ga bog'lamasligi kerak.
- **A2 tekshiruvi (3) «tez ikki marta bosish»** — agent tugmani bosilgach o'chirsa, ikkinchi bosish ketmaydi; natija baribir «bittaga oshadi», lekin Backend himoyasi ko'rinmaydi. Backend himoyasini to'liq ko'rish — 4-ekranda (sahna).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m9-10` «Loyiha kuni: poydevor — Database, kirish, deploy» → **`m9-11` «Loyiha kuni: 1-asosiy funksiya»** (osti — 1-ekran Mentorining birinchi gapi) →
  `m9-12` «Loyiha kuni: 2-asosiy funksiya» (App.jsx 381–383, grep bilan; yakundagi «Keyingi dars» shu nom va osti).
- [x] Bitta misol-ip («Maydon Jamoa», repo `maydon-jamoa`) · metafora yo'q · keyssiz · bitta vizual dars bo'yi — `FunksiyaSahna` (0, 1, 2, 4; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 («Yuborish» → konvert, `oyinlar` ga qator, egasi tokendan; tokensiz → `401`), 4 (2-telefon qo'shiladi; ikki talab qatori tekshiriladi → «11 / 10» / «O'yin to'ldi»); 0-ekran javobdan keyin o'zgaradi.
- [x] SABOQ 11: harakatli ekranlarda navbatdagi element halqa + pulsatsiya bilan, Mentor bosqichga qarab shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12/16: kartochkalar alohida, Mentorsiz.
  SABOQ 21–22, 26: telefon chapda, chizma o'ngda, telefon o'lchami barqaror, ekranda ≤3 blok (0: chat + telefon + variantlar · 2: telefon + Backend/Database + bashorat · 4: ikki telefon + Database + karta).
- [x] Sarlavhalar ≤55 bitta qator · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohlari ≤60. Sanoq python bilan (`md11/olchov.py`) — sonlar qavsda.
- [x] Atamalar tayanch 2 bilan bir xil: talab · asosiy funksiya (nomi bilan) · roadmap · PRD · e'lon · qo'shilish · tashkilotchi · o'yinchi · real vaqt nuqtasi · Backend · Database · token · tekshirish;
  «ficha», «spec», «real-time», «server», «baza», «sinov» yo'q · siz-forma; Antigravity promptlari buyruq shaklida (T-002 istisnosi) · tugmalar ot-shaklda yoki siz-formada («Tekshirish», «Ikkala yuborishni bosing»).
- [x] Testlar: variantlar bir shaklda, uzunlik yaqin, to'g'ri variant yolg'iz eng uzun emas; kalit so'z kamida ikki variantda (1: «token», «egasini», «Maydonni»; 2: «Backend», «qo'shmaydi», «ilova») ·
  ✔ o'rni: 3-ekran C, 5-ekran D · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — yo'q; agent «taxmin qilishi mumkin», son «eskirgan bo'lishi mumkin»).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «F1», «m9-11», «11-Modul» yo'q; blok — «Amaliyot 1»; dars raqami «8-darsda», «7-darsdagi» — modul ichidagi dars) · tarixiy voqea, real kompaniya raqami yo'q ·
  «KOD» (13) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/008/011/014/015/029/038/039/043/045/047/048/064 · P-001/007/008/013/015/016/020/026/028/036/046/052/055/059/062/064/067 · S-001/002/004/006/008/010/015/020/025/026 — ko'rildi.
- [ ] (ochiq) P-028: Render Deploys sahifasi va Neon SQL Editor — hujjatdan, interfeys ko'z bilan ko'rilmagan (shubhali joylar); «qur» da tekshiriladi.
- [x] TAYANCHGA SAVOL 1 va 3 — yopildi (GATE M 11-q0 A, tayanch 9.29, 9.35).
- [x] Blok modeli — tayanch 4 va 9.1 bo'yicha (hamma qadam o'z repo'sida, 5-qadam yo'q, uch qator o'quvchidan); namuna o'yinlar — 9.2; «Ortda qoldingizmi» — `m11-dars-11-done` (9.10).

