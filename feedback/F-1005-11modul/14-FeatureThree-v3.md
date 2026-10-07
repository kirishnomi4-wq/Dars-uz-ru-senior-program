# 11-Modul (kod: `src/9-Modull`) · 14-dars «Loyiha kuni: 3-asosiy funksiya» — MD v3 (loyiha kuni qolipi)

Fayl: `src/9-Modull/FeatureThreeLesson.jsx` · kalit `m9-14` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (SABOQ 12: kartochkalar alohida ekran) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · tip AI-PRAKT (dastur: «Vibe-coding: 3-funksiya — uchinchi asosiy funksiya» → natija «3-funksiya tayyor») ·
eng yaqin namuna: 11-Modul `10-FoundationDay-v3.md` (tuzilish, blok modeli), 9-Modul `07-MvpFirstScreen-v3.md` va `09-MvpComplete-v3.md`, 10-Modul `02-EventTracking-v3.md` (agent tekshiruv so'rovi + Neon naqshi), ularning FILTR fayllari (matn ko'chirilmadi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31, majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · keyingi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan,
Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi · kartada rangli yon chiziq yo'q ·
ko'p elementli mashq ketma-ket · «Maydon Jamoa» nomi o'z rangida, telefon maketida · telefon maketi doim CHAPDA, Backend va jadval O'NGDA · bir vaqtda ≤3 blok · yakuniy holat ixcham.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **A**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 · A2 · A3 — har biri ≈ 20; tayanch 9.1).
Menyu nomi (DE-205): App.jsx `m9-14` — «Loyiha kuni: 3-asosiy funksiya» (osti: «roadmap'dagi uchinchi funksiya») ·
oldingi dars `m9-13` «Uch foydalanuvchidan keyin nimani tuzatasiz?» · keyingi `m9-15` «Roadmap bo'yicha qayerdasiz?» (App.jsx 384–386-qatorlar, grep bilan; `comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida Mentor misoli «Maydon Jamoa» ilovasida uchinchi funksiya — **chiqish va navbat** — telefonda ishlaydi: qo'shilgan o'yinchi o'yindan chiqa oladi,
   to'lgan o'yinda «Navbatga yozilish» bor, bo'shagan joyni navbatga birinchi yozilgan o'yinchi oladi, ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmaydi.
   Teg: `m11-dars-14-start` (= `m11-dars-13-done`) → `m11-dars-14-done` (tayanch 3, aynan). O'quvchi xuddi shu uch blokni o'z repo'sida, **roadmap'idagi o'z uchinchi funksiyasida** va o'z trekida bajaradi;
   «Maydon Jamoa» — namuna. Natija 1-ekranda nomlanadi, uch blokda quriladi, podiumda sanaladi.
2. **Bugungi asosiy fikr (P-013):** Funksiya umumiy ma'lumotni o'zgartirsa, ikki narsa tekshiriladi: yangi harakat Database'ga to'g'ri yoziladimi va ikki so'rov bir lahzada kelsa ham yozuv to'g'ri qoladimi (14-FILTR 3).
   Oldingi ikki funksiya endi «Nima buzilmasin» qatorida turadi. Agent talabga tayanib quradi, aytilmagan joyni taxmin qilishi mumkin (tayanch 7.2) — har blokning 4-qadami shu tekshiruv.
3. **Texnik aniqlik (tayanch 1.4 F3, 1.6, 1.7 «14», 3, 9 — aynan; taxmin emas):**
   - F3 (tayanch 1.4): o'yinchi chiqsa, joy bo'shaydi; o'yin to'lgan bo'lsa yangi odam navbatga yoziladi va bo'shagan joyga navbatdagi kiradi.
   - Yo'llar (tayanch 1.7 «14»): `POST /oyinlar/:id/chiqish` · to'lgan o'yinda «Navbatga yozilish» — alohida yo'l `POST /oyinlar/:id/navbat` (tayanch 1.7, 06.10) ·
     joy bo'shasa navbatdagi `qoshildi` bo'ladi — bitta ish ichida (tayanch: «bitta tranzaksiyada»; o'quvchi tilida — «ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin», MD_TOPSHIRIQ_2 14).
   - Jadval `ishtirokchilar` (`oyin_id` · `oyinchi_id` · `holat`: `qoshildi` / `keladi` / `navbatda` / `chiqdi` · `yaratilgan`) — tayanch 1.6; navbat tartibi — `yaratilgan` (yozilgan vaqti) bo'yicha.
   - Oldingi funksiyalar (Nima buzilmasin): F1 — `POST /oyinlar` (e'lon), `POST /oyinlar/:id/qoshilish`, «8 / 10» Backend'dan, to'lgan o'yinda «O'yin to'ldi» · F2 — `POST /oyinlar/:id/tasdiq`, o'yin kuni «Kelaman» ·
     13-dars tuzatishi — ro'yxat kun va soat bo'yicha, kun sarlavhalari bilan («Shanba», «Yakshanba»; tayanch 1.8).
   - Real vaqt nuqtasi (tayanch 1.6): 11-Modulda ilova ekran ochilganda va pastga tortib yangilaganda so'raydi; o'zi yangilanishi — 12-Modul (o'quvchi matnida «12-Modul» va'dasi yo'q — T-038).
   - Backend laptopda o'zgaradi (A1, A2), telefondagi ilova esa Render'dagi Backend'ga ulangan (10-dars) — shuning uchun A3 da `git push`: Render push'dan keyin xizmatni o'zi qayta deploy qiladi
     («Whenever you push or merge a change to that branch, by default Render automatically rebuilds and redeploys your service»; Auto-Deploy «On Commit» — yangi xizmatda default; render.com/docs/deploys, 06.10).
   - Laptopdagi Backend va Render'dagi Backend bitta Neon Database'ga yozadi (bitta `DATABASE_URL`) — agent tekshiruv yozuvlari shuning uchun tekshiruvdan keyin o'chiriladi — faqat agent aytgan `id` lar bo'yicha (10-Modul `brauzer_id = 'tekshiruv'` naqshi; tayanch 9.92).
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **asosiy funksiya** — PRD dagi uchta funksiyadan biri; o'quvchi matnida nomi bilan: «chiqish va navbat» (F3 — faqat MD/kodda). «ficha» yo'q.
   - **navbat** — faqat «o'yinga navbat» ma'nosida (to'lgan o'yinda kutayotganlar ro'yxati). Shuning uchun «tugmalarni navbat bilan bosing», «navbatdagi harakat» kabi ikkinchi ma'no YO'Q — o'rniga «tartib bilan», «keyingi» (T-015).
     **navbatdagi** — navbatda turgan o'yinchi.
   - **chiqish** — o'yindan chiqish: tugma **«O'yindan chiqish»** (tayanch 2, 06.10); yolg'iz «Chiqish» ishlatilmaydi — akkauntdan chiqish «Hisobdan chiqish» (10-dars). Funksiya nomi «Chiqish va navbat» o'zgarmaydi. «Backend'ni internetga chiqarish» o'rniga — «deploy», «Render yangilaydi» (ildiz to'qnashmasin).
   - **qo'shilish** — F1 so'zi; navbatdagi o'yinchi bo'shagan joyni olganda ham «qo'shiladi» (holat `qoshildi`). «kiradi» faqat «ilovaga kirgan o'yinchi» (kirish = login) ma'nosida.
   - **bitta ish** — Backend joyni tekshirish va yozishni ajralmas bitta ish qilib bajaradi: shu payt ikkinchi so'rov kutib turadi. Bu — tayanchdagi «bitta tranzaksiya»ning o'quvchi tilidagi aytilishi;
     «tranzaksiya» atamasi o'quvchi matnida yo'q — faqat kartochka 8 izohida bir marta ko'prik: 5-Modul (kod `m4-03`) «Bu nazorat tranzaksiya deb ataladi» (tayanch 9.37). Metafora emas — ish qanday bajarilishining sodda tavsifi.
   - **talab** (qayerda · nima qilsin · nima buzilmasin) · **agent** (Antigravity) · **prompt** · **tekshirish** (o'z ishini ko'rish; «sinov» — faqat real odam, 12–13-darslar, bu darsda yo'q) ·
     **Backend** · **Database** · **deploy** · **token** · **tashkilotchi** · **o'yinchi** · **e'lon** · «Qo'shilaman» · «Kelaman» · «Navbatga yozilish» · «O'yindan chiqish» · «Hisobdan chiqish» — tayanch 2.
   - **eslatma** — o'yindan oldin telefonga keladigan xabar (roadmap'da «keyinroq»); «push» so'zi faqat `git push` ma'nosida (T-015).
   - **Ishlatilmaydi:** server (prozada), baza, ficha, tranzaksiya (o'quvchi matnida), sinov, «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova ekrani), «navbat» tartib ma'nosida.
5. **Metafora yo'q. Keyssiz** (tayanch 5: loyiha kuni). Real kompaniya raqami yo'q. Raqamlar — faqat Mentor misolidan («Yakshanba, 17:00 · Mahalla maydoni · 9 / 10» — tayanch 9.2);
   «11 / 10» — dars mexanikasidagi holat («bu misolda»), statistika emas.
6. **Amaliyot bloki (tayanch 4, 9.1):** o'quvchi 4 qadamning **hammasini o'z repo'sida, o'z mahsuloti va trekida** bajaradi (Ochish → Prompt → Ishga tushirish → Tekshirish); 5-qadam yo'q.
   Mentor misoli — namuna: o'ngda kutilgan natija «namuna: Maydon Jamoa», «Yordam» ortida — Mentor misolidagi to'liq prompt.
   **Talab zinapoyasi (tayanch 4: 11, 12, 14):** uch blokda ham **uch qatorni o'quvchi yozadi**, namuna «Yordam» ortida. Joy yonida kulrang ipucha — savol shaklida, javob emas (KORPUS §32).
   Uch blok — Mentor misolining uch qatlami (ko'p funksiyaga mos, lekin hammasiga emas — 14-FILTR 2): **A1 Backend** (harakat Database'ga yoziladi) · **A2 bir vaqtda bosish** (ikki so'rov bir lahzada — yozuv to'g'ri qoladi) · **A3 ilova** (telefonda, oldingi ikki funksiya bilan).
   Funksiya umumiy ma'lumotga yozmasa — A1 da u ishlatadigan Backend qismi, A2 da tez ikki marta bosishda nima buzilishi tekshiriladi (A1, A2 «Ochish»da bir gap; tayanch 9.94).
   Trek (`pm-m9d8-platforma`) farqi faqat A3 da: 3-qadamda bir qator, «Yordam» ostida bir gap (9.7); A1, A2 — Backend, ikkala trekda bir xil.
   Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» (faqat xato qatori, `.env` qiymatlari va token yuborilmaydi — 9.81)
   Backend tekshiruvi — 10-Modul naqshi: agent tekshiruv so'rovlarini yuboradi, o'quvchi Neon'dagi SQL Editor'da o'zi ko'radi («Agent nima desa ham, jadval shuni ko'rsatsin»), keyin tekshiruv yozuvlari o'chiriladi.
   Push odati (tayanch 3): `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil · `git add <fayl>` (`git add .` emas).
7. **Real odam bilan ish bu darsda yo'q** (ikkinchi akkaunt — o'quvchining o'zi yoki yonidagi sinfdoshi, tekshirish uchun). **Uyga vazifa yo'q** (P-058; tayanch 4: istisno faqat 12-dars).
8. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, terminal, agent chati, jadval maketlari chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3).
   Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda — `md14/olchov.py`).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon Jamoa» (Mentor misoli, repo `maydon-jamoa`) — mahalladagi mini-futbol uchun jamoa yig'adigan mobil ilova. 11-darsda e'lon va qo'shilish, 12-darsda o'yin kuni tasdiq,
  13-darsda ro'yxat kun bo'yicha qurilgan. Bugun — roadmap'dagi uchinchi funksiya. Kutilgan natija doim «Maydon Jamoa» bilan; o'quvchi har blokni o'z uchinchi funksiyasida bajaradi.
- **Hook:** qo'shilgan o'yinchi kela olmaydi — ilovada o'yindan chiqish yo'li yo'q; ikkinchi o'yinchi «O'yin to'ldi»ni ko'radi; o'yin kuni maydonda 10 kishi o'rniga 9 kishi.
- **Ip (ot-shaklda):** O'yindan chiqish va navbat → Bir vaqtda ikki so'rov → Telefonda, oldingi funksiyalar bilan.
- **Bitta vizual — «O'yin sahnasi»** (`OYIN_SAHNA` const → `OyinSahna`, dars bo'yi, 163/180):
  - chapda **telefon(lar)** — «Maydon Jamoa» (Expo Go), nom o'z rangida; «O'yin» ekrani: «‹ O'yinlar» · «Yakshanba, 17:00» · «Mahalla maydoni» · katta son **«N / 10»** ·
    qo'shilganlar — ismsiz doiralar (ikki qator × 5, tayanch 9.15) · «Navbatda: N» qatori · pastda bitta tugma holati: «Qo'shilaman» / «Qo'shildingiz» (o'chiq) / «O'yin to'ldi» (o'chiq) /
    «Navbatga yozilish» / «Navbatdasiz» + «O'yindan chiqish». Telefon ustida yorliq: «1-telefon · qo'shilgan o'yinchi» · «2-telefon · yangi o'yinchi». O'lchami barqaror (SABOQ 22).
  - o'ngda **Backend** qutisi — uch yo'l: `POST …/qoshilish` · `POST …/navbat` · `POST …/chiqish`; ichida so'rov kartalari («joy bormi?» → ✓ / ✗) va «bitta ish» payti — qulf belgisi, ikkinchi so'rov eshik oldida «kutyapti»;
  - o'ngda pastda **`ishtirokchilar`** jadval-kartasi (Neon) — ixcham: harakatdagi o'yinchilar alohida qator (`oyinchi` · `holat` · `yaratilgan`), qolganlari bitta yig'ma qator «yana 9 ta · `qoshildi`» (SABOQ 24, 27).
  - Holatlar: kulrang (hali yo'q) → oq (ishlaydi) → accent (joriy / `navbatda`) → yashil (`qoshildi`, yangi) → qizil («11 / 10», `409`) · `chiqdi` — kulrang, ustidan chiziq. Konvert — so'rov.
  - Namuna ma'lumot: o'yin — **Yakshanba, 17:00 · Mahalla maydoni · 9 / 10** (tayanch 9.2); «10 / 10» — hook va 2-ekranda bitta o'yinchi qo'shilgandan keyingi holat.
  - Ishlatilishi: 0 (ikki telefon + maydon kadri) · 1 (tayyor tugmalar) · 2 (chiqish va navbat) · 4 (bir vaqtda ikki so'rov) · A1–A3 o'ng (kutilgan natija).
  - `prefers-reduced-motion` da konvert, silkinish va pulsatsiya harakatsiz, holatlar bir zumda almashadi.
- **Yakun:** uchinchi funksiya telefonda, oldingi ikkitasi bilan ishlaydi · keyingi dars — Mentor bilan yakkama-yakka.

---

## 0 · Kirish — kela olmaydigan o'yinchi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Qo'shilgan o'yinchi kela olmasa, joyi nima bo'ladi?** (51)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: 1-telefondagi o'yinchi Yakshanba 17:00 dagi o'yinga qo'shilgan, lekin endi kela olmaydi. 2-telefondagi o'yinchi shu o'yinda o'ynamoqchi — avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Keyingi harakat (halqa + yengil pulsatsiya): uchta variant guruhi.
- Maket (chap): ikki telefon yonma-yon — «1-telefon · qo'shilgan o'yinchi» va «2-telefon · yangi o'yinchi»; ikkalasida «Maydon Jamoa» ilovasining «O'yin» ekrani:
  «‹ O'yinlar» · «Yakshanba, 17:00» · «Mahalla maydoni» · **10 / 10** · o'nta ismsiz doira. 1-telefonda tugma «Qo'shildingiz» (o'chiq), 2-telefonda «O'yin to'ldi» (o'chiq).
- Savol: **Sizningcha, qaysi biri?**
  - Joy bo'shaydi — o'yin kuni «Kelaman» bosilmaydi (47)
  - Joy band qoladi — ilovada o'yindan chiqish yo'q (47)
  - Joy band qoladi — tashkilotchi buni bilmaydi (44)
- Javob — 2-variant: **Aynan!** Ilovada o'yindan chiqish yo'li yo'q: joy band turadi, o'ynamoqchi bo'lgan o'yinchi esa «O'yin to'ldi»ni ko'radi. (119)
- Javob — 1-variant: **Qiziq fikr!** «Kelaman» bosilmasa, tashkilotchi buni ko'radi, lekin joy band turaveradi. O'yindan chiqish yo'li yo'q. (115)
- Javob — 3-variant: **Qiziq fikr!** O'yin kuni tashkilotchi kim tasdiqlaganini ko'radi. Lekin joyni bo'shatadigan tugma ilovada yo'q. (109)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → 1-telefonda barmoq «Qo'shildingiz»ni bosadi — tugma o'chiq, bir lahza silkinadi, boshqa tugma yo'q →
  2-telefonda «O'yin to'ldi» o'chiq turaveradi → telefonlar ostida «Yakshanba, 17:00 · maydonda» kadri chiziladi: o'nta doira o'rni, to'qqiztasi birin-ketin yonadi, bittasi uzuq chiziqli bo'sh qoladi;
  yonida yorliq «bu misolda: 10 kishi kerak edi — 9 kishi keldi» → 2-telefon ostida kulrang yorliq «o'ynamoqchi edi — joy yo'q edi».
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): o'yindan chiqish va bo'shagan joy. Uchala variant «Joy … — …» shaklida; ✔ juftlikda («Joy band qoladi» ×2 — §147); uzunlik 44–47.
  1 va 3-variant 12-darsdagi «Kelaman» va tashkilotchi ko'rinishiga tayanadi (F2) — xato tanlov ham oldingi funksiyani eslatadi. «10 kishi kerak edi — 9 kishi keldi» — sahna, Mentor misolidagi intervyu yozuvi 5 bilan bir ohangda (tayanch 1.3), raqam emas, holat.

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida uchinchi funksiya telefonda ishlaydi.** (50)
- Mentor: Bugun roadmap'dagi uchinchi funksiyani qurasiz — talabning uch qatorini har blokda o'zingiz yozasiz. Mentor misolida bu funksiya — o'yindan chiqish va navbat.
- Chap — «Dars oxirida» (namuna: Maydon Jamoa): «O'yin sahnasi» **tayyor** holatda, bir marta o'zi yuradi (DE-200): ikki telefon «O'yin» ekranida, «Yakshanba, 17:00 · 10 / 10» →
  2-telefonda «O'yin to'ldi» o'rnida «Navbatga yozilish» tugmasi ajralib chiqadi → 1-telefonda «Qo'shildingiz» ostida «O'yindan chiqish» tugmasi paydo bo'ladi → ikkala telefonda «Navbatda: 0» qatori.
  Tugmalar bosilganda nima bo'lishi bu yerda ko'rsatilmaydi — u 2-ekranning kashfiyoti (P-015, §178).
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Backend yangi harakatni Database'ga yozadi (42)
  - 02 · Ikki so'rov bir lahzada kelsa ham yozuv to'g'ri qoladi (54)
  - 03 · Funksiya telefonda ishlaydi, oldingi ikkitasi ham (49)
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m11-dars-14-start` · namuna `m11-dars-14-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni roadmap'ingizdagi uchinchi funksiyada bajarasiz: **«{nom}»**.
  `{nom}` — `pm-m9d6-roadmap` dan (`hozir` ning uchinchisi); kalit yo'q bo'lsa qator «…uchinchi funksiyada bajarasiz.» bilan tugaydi, nom A1 da yoziladi.
- Tugmalar: Orqaga · Boshlaymiz
✎ Mentorning birinchi gapi — App.jsx menyu osti yozuvi «roadmap'dagi uchinchi funksiya» (P-015). Funksiya nomi o'quvchi matnida so'z bilan — «o'yindan chiqish va navbat» (F3 emas).
  Reja kashfiyotni oldindan aytmaydi: tayyor holatda faqat yangi tugmalar ko'rinadi, navbatdagi qo'shilishi — 2-ekranda.

## 2 · O'yindan chiqish va navbat  ← QTushuncha
- Eyebrow: Tushuncha · chiqish va navbat
- Sarlavha: **O'yinchi chiqsa, bo'shagan joyni kim oladi?** (43)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: O'yin to'ldi — avval taxminingizni belgilang, keyin tugmalarni tartib bilan bosing.
  - harakat paytida: Keyingi tugmani bosing va `ishtirokchilar` jadvalida nima o'zgarishini kuzating.
  - tugagach: Uchala qadam tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada: **Navbatda odam bor. Bir o'yinchi chiqsa, kartada qaysi son?** · «9 / 10» · «10 / 10».
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chap (maket + harakat): ikki telefon — «1-telefon · qo'shilgan o'yinchi» («Qo'shildingiz», ostida «O'yindan chiqish») va «2-telefon · yangi o'yinchi» («Navbatga yozilish»);
  ikkalasida «Yakshanba, 17:00 · Mahalla maydoni · **10 / 10**» · «Navbatda: 0». Harakat tugmalari telefonlarning o'zida (SABOQ 21), tartib bilan halqada:
  **Navbatga yozilish** (2-telefon) → **O'yindan chiqish** (1-telefon) → **Pastga tortib yangilash** (2-telefon ekrani ustida chizilgan strelka-tugma).
- O'ng (vizual): Backend qutisi — `POST …/navbat` · `POST …/chiqish`; ostida `ishtirokchilar` kartasi: `1-telefon o'yinchisi · qoshildi` · «yana 9 ta · `qoshildi`» (ustunlar: o'yinchi · holat · yozilgan vaqti).
- **Harakat → Vizual o'zgarish:**
  - «Navbatga yozilish» → konvert `POST /oyinlar/4/navbat` Backend'ga → jadvalga yangi qator ajralib kiradi `2-telefon o'yinchisi · navbatda · Juma 19:42` (accent) →
    javob qaytadi → 2-telefonda «Navbatdasiz» va «O'yindan chiqish», ikkala telefonda «Navbatda: 1».
  - «O'yindan chiqish» (1-telefonda) → kichik oyna «Rostdan chiqasizmi?» · «Ha» o'zi bosiladi → konvert `POST /oyinlar/4/chiqish` → Backend qutisida qulf yopiladi →
    1-qator `qoshildi` → `chiqdi` (kulrang, ustidan chiziq) va shu lahzaning o'zida navbatdagi qator `navbatda` → `qoshildi` (yashil yonadi) → qulf ochiladi →
    1-telefonda son **«10 / 10»** qoladi (bir lahza ham «9 / 10» bo'lmaydi), doiralardan biri kulrang bo'lib, o'rniga yangisi yonadi; tugma — «Navbatga yozilish» (o'yin yana to'la).
    2-telefon esa hali «Navbatdasiz» ni ko'rsatadi — ustida kichik kulrang yorliq «eski holat».
  - «Pastga tortib yangilash» (2-telefonda) → ekran pastga tortiladi, aylanish belgisi → konvert `GET /oyinlar` → 2-telefonda «Qo'shildingiz», «Navbatda: 0», doiralar orasida u ham bor; «eski holat» yorlig'i yo'qoladi.
- Joriy qator (2/3 dan keyin, bitta): Navbat tartibi — yozilgan vaqti: birinchi yozilgan birinchi qo'shiladi. (71)
- Natija qatori: «Taxminingiz: … · haqiqatda: «10 / 10» — joyni navbatdagi oldi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Qo'shilgan o'yinchi chiqsa, joyni navbatdagi birinchi o'yinchi oladi. U buni ekranni yangilaganda ko'radi. (106)
- Tugadi (199): harakat paneli yopiladi; ikki telefon va `ishtirokchilar` kartasi butun enga, `chiqdi` va `qoshildi` qatorlari fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Tugmalarni tartib bilan bosing (N/3) → Davom etish
✎ Bitta g'oya (P-008): bo'shagan joy navbatdagiga o'tadi. «Pastga tortib yangilash» — 8-darsdagi real vaqt nuqtasi (11-Modulda ilova ekran ochilganda va pastga tortilganda so'raydi — tayanch 1.6);
  ekranda «real vaqt» so'zi aytilmaydi, kartochka 5 da. «Rostdan chiqasizmi?» — tasdiq oynasi (tayanch 1.7, 06.10). `oyin_id = 4` — Yakshanba 17:00 (namuna o'yinlar tartibi, tayanch 9.2).
  3-savol shu qoidani boshqa holatda so'raydi — ikki chiqish, navbatda ikki kishi (§106).

## A1 · Amaliyot 1 — Backend: yangi harakat Database'ga  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · Backend
- Sarlavha: **Uchinchi funksiyaning Backend qismi ishlasin.** (45)
- Mentor: Uch qatorni o'zingiz yozasiz, Mentor misoli «Yordam»da; «1 · Ochish»dan boshlang.
- Blok tepasida (ixcham qator): «Uchinchi funksiyangiz: **{nom}**» — `pm-m9d6-roadmap` dan; kalit yo'q bo'lsa — bitta qatorli maydon, ipucha «Roadmap'ingizdagi uchinchi funksiya nomi».
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z funksiyangizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (13-darsdagi holat). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.
     `README.md` dagi arxitekturaga qarang: funksiyangiz qaysi jadvalga nima yozadi? Oldingi ikki funksiyadan biri tugamagan bo'lsa — avval uni tugating.
     Funksiyangiz Database'ga yozmasa (masalan, faqat ko'rsatadi) — bu blokda u ishlatadigan Backend yo'lini quring.
  2. **Prompt** — vazifa: funksiyangizga kerak Backend qismi ishlasin; harakat yangi holatni saqlasa — Database'ga yozilsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Joylar ipuchasi (kulrang, savol shaklida — KORPUS §32): `{qayerda}` — «qaysi papka, qaysi yo'l va jadval?» · `{nima qilsin}` — «foydalanuvchi nima qiladi, jadvalga nima yoziladi?» ·
     `{nima buzilmasin}` — «qaysi yo'llar va ustunlar o'zgarmasin?»
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt):
     > Qayerda: `backend/` — yangi yo'llar `POST /oyinlar/:id/navbat` va `POST /oyinlar/:id/chiqish`, ikkalasi token bilan; jadval `ishtirokchilar`.
     > Nima qilsin: `navbat` — o'yin to'lgan bo'lsa, o'yinchini `navbatda` holatida yozsin; to'lmagan bo'lsa — `409`.
     > `chiqish` — qo'shilgan yoki navbatdagi o'yinchini `chiqdi` qilsin. Qo'shilgan o'yinchi chiqsa va navbatda odam bo'lsa, navbatga eng birinchi yozilgan o'yinchi `qoshildi` bo'lsin.
     > `GET /oyinlar` har o'yinda `navbatda` (navbatdagilar soni) va `menNavbatdaman` ni ham bersin.
     > Nima buzilmasin: `POST /oyinlar`, `…/qoshilish` va `…/tasdiq` yo'llari, «8 / 10» hisobi va jadval ustunlari. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Backend terminali o'zi qayta yuklanadi, xato yo'q. Antigravity'ga yozing: «Yangi yo'llarni tekshir: tekshiruv uchun yangi yozuvlar yarat, ularning `id` larini ayt, so'rov yubor va har biri nima qaytarganini ayt.»
     Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Neon'da tekshirish** — talabning har qatorini tekshiring:
     (1) Agent aytgan javoblar talabingizdagidek.
     (2) Neon'dagi SQL Editor'da funksiyangiz yozadigan jadvalni oching — agent aytgan o'zgarish jadvalda ham bor. Agent nima desa ham, jadval shuni ko'rsatsin.
     (3) Antigravity'ga yozing: «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» — jadvalda ular qolmasin, boshqa qatorlar joyida. Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (agent chati + jadval kartasi; o'zingiznikini shunga solishtirasiz):
  - Antigravity javobi: `tekshiruv o'yini id 5 · 2 kishi kerak` · `o'yinchi 1, 2 · qoshilish → 201` · `o'yinchi 3 · navbat → 201 · navbatda` · `o'yinchi 1 · chiqish → 201 · chiqdi` · `o'yinchi 3 → qoshildi`
  - Neon · SQL Editor — `SELECT oyinchi_id, holat FROM ishtirokchilar WHERE oyin_id = 5;` → `1 · chiqdi` · `2 · qoshildi` · `3 · qoshildi` (`5` — Mentor misolidagi tekshiruv o'yini; sizda — agent aytgan `id`)
- Hammasi bajarilgach (yashil): Backend yangi harakatni Database'ga yozadi. Bu misolda chiqqan o'yinchining joyini navbatdagi oldi. (99)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-14-done` —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Blok modeli — tayanch 4 va 9.1: hamma qadam o'z repo'sida, Mentor misoli — namuna (o'ngda va «Yordam»da). Talab zinapoyasi — uch qator o'quvchidan (tayanch 4: 11, 12, 14).
  4-qadam nomi «Neon'da tekshirish» — Backend hali laptopda (9.9), `POST` yo'lini brauzer manzil qatoridan ochib bo'lmaydi; tekshiruv so'rovini agent yuboradi (10-Modul `02-EventTracking` naqshi).
  `oyin_id = 5` — agent yaratgan tekshiruv o'yini (namuna o'yinlar 1–4); u (3)-bandda o'chiriladi. Telefonda tekshirish — A3 da (push'dan keyin).

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **«10 / 10», navbatda ikki kishi. Ikki o'yinchi chiqdi. Kartada nima?** (9 so'z)
  - 10 / 10 · navbatda: 2
  - 9 / 10 · navbatda: 1
  - ✔ 10 / 10 · navbatda: 0
  - 8 / 10 · navbatda: 2
- Kalit: **C** (index 2). To'rttalasi bir shaklda («son · navbatda: N» — karta yozuvi); «10 / 10» A va C da, «navbatda: 2» A va D da (S-003, §204); to'g'ri variant eng uzun emas.
- To'g'ri izohi: Ikki joy bo'shadi — ularni navbatdagi ikkala o'yinchi oldi. (59)
- Xato izohlari (≤60):
  - A: Joylar to'ldi. Ularni kim oldi — navbatga qarang. (49)
  - B: Navbatda odam kutyapti, joy esa bo'sh turibdi. (46)
  - D: Navbatda odam bo'lsa, bo'shagan joy bo'sh qolmaydi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda bitta chiqish va navbatda bitta kishi edi; savol ikki chiqishni so'raydi — qoidani ikki marta qo'llash kerak, slayddan ko'chirib bo'lmaydi (§106).

## 4 · Oxirgi joyga ikki so'rov  ← QTushuncha
- Eyebrow: Tushuncha · bir vaqtda bosish
- Sarlavha: **Oxirgi joyni ikki kishi bir vaqtda bossa, nima bo'ladi?** (55)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Ikkala telefonda «9 / 10» — bitta joy qoldi; avval taxminingizni belgilang.
  - 1-tugma paytida: «Bir vaqtda bosish»ni bosing va Backend'ga kelgan ikki so'rovni kuzating.
  - 1-natijadan keyin: Bu talabda shu holat yozilmagan edi — qatorni talabga qo'shing.
  - 3-tugma paytida: Agent qaytadan qurdi — «Yana bir vaqtda bosish»ni bosing.
  - tugagach: Ikkala urinish tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada: **Ikkalasi bir lahzada bossa, nechta o'yinchi qo'shiladi?** · Bittasi · Ikkalasi.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chap (maket): ikki telefon — «1-telefon · yangi o'yinchi» va «2-telefon · yangi o'yinchi», ikkalasida «Yakshanba, 17:00 · **9 / 10**» va «Qo'shilaman»;
  ostida ixcham talab kartasi (yorliq «talab — bu qatorsiz»; uch qator, mono): «Qayerda: `…/qoshilish`» · «Nima qilsin: to'lmagan o'yinga qo'shsin» · «Nima buzilmasin: «8 / 10» hisobi».
- O'ng (vizual): Backend qutisi — `POST …/qoshilish`; `ishtirokchilar` kartasi — «9 ta · `qoshildi`».
- Harakat (telefonlar ostida, bittadan, halqada): **Bir vaqtda bosish** → talab qatori kartasi + **Talabga qo'shish** → **Yana bir vaqtda bosish**.
- **Harakat → Vizual o'zgarish:**
  - «Bir vaqtda bosish» → ikki telefondan ikki konvert bir vaqtda Backend'ga uchadi → Backend qutisida ikki so'rov kartasi yonma-yon, har birida «joy bormi? · 9 / 10 — bor» (ikkalasida yashil ✓) →
    jadvalga ikki qator birga ajralib kiradi (`qoshildi`) → ikkala telefonda «Qo'shildingiz» → son **«11 / 10»** qizil yonadi. Yorliq: «Ikki so'rov ham «joy bor» deb ko'rdi.» (37)
  - talab kartasi ostida yangi qator kartasi chiqadi (halqada): «Ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin.» · tugma «Talabga qo'shish» →
    qator «Nima qilsin» ga uchib tushadi (qator bir lahza yoritiladi) → «agent qaytadan quryapti…» (≈0,8 s) → holat qaytadi: «9 / 10», ikki yangi qator so'nib o'chadi.
  - «Yana bir vaqtda bosish» → ikki konvert → Backend qutisida 1-so'rov ichkariga o'tadi, ortidan qulf yopiladi; 2-so'rov eshik oldida kulrang «kutyapti» →
    1-so'rov: «joy bormi? · 9 / 10 — bor» → qator yoziladi → «10 / 10» → qulf ochiladi → 2-so'rov: «joy bormi? · 10 / 10 — yo'q» (qizil ✗) → javob `409 · O'yin to'ldi` →
    1-telefonda «Qo'shildingiz», 2-telefonda «O'yin to'ldi» va ostida «Navbatga yozilish» tugmasi paydo bo'ladi. Yorliq: «Ikkinchi so'rov birinchisi tugashini kutdi.» (43)
  Har tugma bitta — noto'g'ri tanlov yo'q; qaror bashoratda, natija harakatda (P-046: holat o'quvchi bosgan tugmalardan chiziladi).
- Joriy qator (3/3 dan keyin, bitta): Bu misolda Backend joyni tekshirish va yozishni bitta ish qilib bajaradi: ikkinchi so'rov kutib turadi. (103)
- Natija qatori: «Taxminingiz: … · haqiqatda: qatorsiz — ikkalasi, qator bilan — bittasi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Tekshirish va yozish bitta ish bo'lsa, oxirgi joy bitta odamga tegadi. Buni talabda o'zingiz yozasiz. (101)
- Tugadi (199): harakat paneli yopiladi; ikki telefon («Qo'shildingiz» · «O'yin to'ldi») va Backend qutisidagi qulf butun enga, fokusda; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → Tugmalarni tartib bilan bosing (N/3) → Davom etish
✎ Ko'prik (P-020, T-052): 9-Modul 9-darsida bitta katakni ikki o'yinchi band qilolmagan — katak bitta edi, Database ikkinchisini yozdirmagan. Bugun katak yo'q, joylar son bilan («9 / 10»),
  shuning uchun har so'rov «joy bormi?» deb sanaydi va ikkalasi «bor» javobini olishi mumkin. Bu gap ekranda aytilmaydi — kartochka 9 da.
  «11 / 10» — dars mexanikasidagi holat: talabda yozilmasa, agent shunday qurishi **mumkin** (Mentor gapi «bu misolda»). Qo'lda ikki telefondan bosish bu holatni har safar ko'rsatmaydi — A2 QIzoh.
  5-savol shu qoidani talab tomonidan so'raydi — qaysi qator haqiqatan himoya qiladi (§106).

## A2 · Amaliyot 2 — bir vaqtda bosish  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 2 · bir vaqtda bosish
- Sarlavha: **Ikki kishi bir vaqtda bossa ham, yozuv to'g'ri qolsin.** (54)
- Mentor: Funksiyangizga ikki so'rov bir lahzada kelsa nima buzilishi mumkin — talabni shunga yozing; «1 · Ochish»dan boshlang.
- Qadamlar (hammasi o'z repo'ngizda, o'z funksiyangizda):
  1. **Ochish** — Backend laptopda ishlab tursin. Funksiyangizda ikki holatni o'ylab ko'ring: bitta odam tugmani ikki marta tez bossa · ikki odam bir lahzada bossa.
     Qaysi yozuv ikki marta tushishi yoki chegaradan oshishi mumkin? Funksiyangiz umumiy ma'lumotga yozmasa — tez ikki marta bosishda nima buzilishi mumkinligini toping;
     hech narsa buzilmasa — Mentor bilan funksiyangizga mos boshqa tekshiruvni tanlang.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Joylar ipuchasi: `{qayerda}` — «qaysi yo'llar?» · `{nima qilsin}` — «ikki so'rov bir lahzada kelsa, nima bo'lsin?» · `{nima buzilmasin}` — «qaysi javoblar va sonlar o'zgarmasin?»
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt):
     > Qayerda: `backend/` — `POST /oyinlar/:id/qoshilish`, `…/navbat` va `…/chiqish`.
     > Nima qilsin: ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin: joyni tekshirish va yozish bitta ish bo'lsin, shu payt boshqa so'rov kutib tursin.
     > Chiqqan o'yinchining joyini navbatdagi shu ishning ichida olsin. Bitta o'yinchi bir o'yinga ikki marta yozilmasin.
     > Nima buzilmasin: yo'llarning javoblari va «8 / 10» hisobi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Backend terminali o'zi qayta yuklanadi, xato yo'q. Antigravity'ga yozing: «Birga yuboriladigan so'rovlar bilan tekshir: yangi tekshiruv yozuvi yarat (`id` sini ayt), oxirgi joyga beshta so'rovni birga yubor. Qaysi usul bilan yuborganingni va har javobni ayt.»
     Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Neon'da tekshirish** — talabning har qatorini tekshiring:
     (1) Agent javobida beshtadan faqat bittasi o'tgan, qolganlari rad etilgan.
     (2) Neon'dagi SQL Editor'da jadvalingizni oching — tekshiruv yozuvlari soni chegaradan oshmagan, bitta odam ikki marta yozilmagan. Agent nima desa ham, jadval shuni ko'rsatsin.
     (3) Antigravity'ga yozing: «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (agent chati + jadval kartasi):
  - Antigravity javobi: `tekshiruv o'yini id 6 · 2 kishi kerak · 1 joy qoldi` · `5 so'rov birga (Promise.all)` · `1 → 201 · qoshildi` · `4 → 409 · O'yin to'ldi`
  - Neon · SQL Editor — `SELECT holat, COUNT(*) FROM ishtirokchilar WHERE oyin_id = 6 GROUP BY holat;` → `qoshildi · 2` (oldin 1 + yangi 1; `6` — Mentor misolida, sizda — agent aytgan `id`)
- Hammasi bajarilgach (yashil): Ikki so'rov bir lahzada kelsa ham, yozuv to'g'ri qoladi. Bu misolda oxirgi joy bitta odamga tegdi. (98)
- Qator (`QIzoh`, natija ostida): Qo'lda bosilganda so'rovlar bir lahzaga kamdan-kam tushadi — shuning uchun agent so'rovlari bilan tekshirasiz. (110)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Talab qatori o'quvchi tilida (MD_TOPSHIRIQ_2 14): «ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin» — tayanchdagi «bitta tranzaksiya». Yoziladigan har funksiyada bo'lishi mumkin: bir odamning ikki marta tez bosishi
  (bir yozuv ikki marta tushadi) ham shu blokda. Beshta so'rov — bitta tekshiruv tasodifan o'tib ketmasligi uchun; bu tekshiruv, isbot emas — qulfsiz kod ham ba'zan o'tib ketishi mumkin (shubhali joylar; 14-FILTR 7).
  `oyin_id = 6` — agent bu blokda yaratgan tekshiruv o'yini; (3)-bandda o'chiriladi.

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Oxirgi joyga ikki kishi yozildi: «11 / 10». Talabga nima qo'shasiz?** (10 so'z)
  - ✔ Ikki kishi bir vaqtda bossa ham, joy bittasiga tegsin
  - Tugma bir soniya o'chib tursin — bir vaqtda bosilmasin
  - O'yin to'lganda «Qo'shilaman» tugmasi ko'rinmasin
  - Ortiqcha o'yinchini tashkilotchi o'zi chiqarib yuborsin
- Kalit: **A** (index 0). To'rttalasi talab qatori (agentga istak shakli); «bir vaqtda» A va B da, tugma B va C da, tire faqat B da (to'g'rida emas — S-003); to'g'ri variant eng uzun emas.
- To'g'ri izohi: Ikkala so'rov Backend'ga keladi — joyni u bittaga beradi. (57)
- Xato izohlari (≤60):
  - B: Tugma bitta telefonda o'chadi — so'rovlar ikki telefondan. (58)
  - C: Bosilgan payt ikkala telefonda ham «9 / 10» edi. (48)
  - D: Ikkalasi «Qo'shildingiz»ni ko'rgan — qaysi biri chiqadi? (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): B va C — haqiqiy usullar (ikki marta bosishdan himoya, F1 dagi «O'yin to'ldi»), lekin ikki telefondan bir lahzada kelgan so'rovni to'xtatmaydi — «rost, lekin mos emas» (§171).
  4-ekranda talab qatori tayyor berilgan edi; savol uni boshqa uch talab bilan solishtirishni so'raydi.

## A3 · Amaliyot 3 — ilova: telefonda, oldingi funksiyalar bilan  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 3 · ilova
- Sarlavha: **Uchinchi funksiya telefonda ishlasin, oldingilari ham.** (54)
- Mentor: Endi «Nima buzilmasin» qatoriga oldingi ikki funksiyangizni yozing; «1 · Ochish»dan boshlang.
- Qadamlar (hammasi o'z repo'ngizda, o'z trekingizda — `pm-m9d8-platforma`):
  1. **Ochish** — ilova papkangizni oching. Ikkinchi akkaunt tayyorlang: o'zingizda «Hisobdan chiqish»dan keyin namuna ism va boshqa namuna telefon bilan
     ro'yxatdan o'ting (yoki sinfdoshingiz telefonida — 12-darsdagidek) — funksiyani ikki foydalanuvchi bilan tekshirasiz.
  2. **Prompt** — vazifa: funksiyangiz ilovada ko'rinsin va Backend'dagi yangi yo'llarni chaqirsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Joylar ipuchasi: `{qayerda}` — «qaysi ekran va qaysi tugma?» · `{nima qilsin}` — «bosilganda nima bo'ladi, ekranda nima ko'rinadi?» · `{nima buzilmasin}` — «oldingi ikki funksiya va animatsiyalar».
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`) va «O'yinlar» kartasi.
     > Nima qilsin: o'yin to'lgan bo'lsa, «O'yin to'ldi» o'rnida «Navbatga yozilish» tugmasi bo'lsin — `POST /oyinlar/:id/navbat`; navbatdagi o'yinchi «Navbatdasiz» yozuvini ko'rsin.
     > Qo'shilgan va navbatdagi o'yinchida «O'yindan chiqish» tugmasi bo'lsin — `POST /oyinlar/:id/chiqish`, bosilganda «Rostdan chiqasizmi?» deb so'rasin.
     > «O'yinlar» kartasida «Navbatda: N» chiqsin. «O'yin» ekranida ham pastga tortilsa, o'yin qayta so'ralsin.
     > Nima buzilmasin: e'lon berish, «Qo'shilaman», o'yin kunidagi «Kelaman», kun sarlavhalari va animatsiyalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» — o'yin sahifasi; pastga tortish o'rniga «Yangilash» tugmasi — sahifa ochilganda va shu tugma bosilganda so'raladi (9.84), «Rostdan chiqasizmi?» — brauzer oynasida.
  3. **Ishga tushirish** — (a) Backend'ni yangilang: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "uchinchi funksiya"`, `git push`.
     Render push'dan keyin Backend'ni o'zi qayta deploy qiladi — Render'dagi xizmatingizda yangi deploy tugashini kuting.
     (b) Mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching; QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.
     Web-trekda: push'dan keyin Netlify saytni o'zi yangilaydi. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     (1) Funksiyangizni ikki akkaunt bilan bajaring; ikkinchisida ekranni pastga torting (web-trekda sahifani yangilang) — o'zgarish u yerda ham ko'rinsin.
     (2) Oldingi ikki funksiyangizni bir marta bajaring — avvalgidek ishlasin.
     (3) Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin. Oxirida yangi o'zgarish bo'lsa: `git status` → `git add <fayl>` → commit → `git push`.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; uch kadr bir marta o'zi yuradi):
  - «O'yinlar»: «Shanba» — 18:00 · Mahalla maydoni · 8 / 10 · 20:00 · Maktab maydoni · 6 / 10 · «Yakshanba» — 10:00 · Park maydoni · 4 / 8 · 17:00 · Mahalla maydoni · 10 / 10 · Navbatda: 1
  - «O'yin» (2-akkaunt): «Yakshanba, 17:00 · 10 / 10» · «Navbatdasiz» · «O'yindan chiqish»
  - 1-akkaunt «O'yindan chiqish» → «Rostdan chiqasizmi?» · «Ha» → 2-akkauntda pastga tortiladi: «Qo'shildingiz» · «10 / 10» · «Navbatda: 0»
- Hammasi bajarilgach (yashil): Uchinchi funksiya telefonda ishlaydi, oldingi ikkitasi ham joyida. (66)
- Qator (`QIzoh`, natija ostida): Navbatdagi o'yinchi qo'shilganini ekranni yangilaganda ko'radi. Eslatma Mentor roadmap'ida «keyinroq». (102)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Nishon (bonus): Third Feature — oxirgi «Bajardim»da (4-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Trek farqi: 3-qadamda bir qator, «Yordam» ostida bir gap (9.7). «Nima buzilmasin»ga oldingi funksiyalar — uchinchi funksiya kunining asosiy ko'nikmasi (Mentor gapi shuni aytadi).
  Ikkinchi akkaunt: telefon raqami SMS bilan tasdiqlanmaydi (10-dars: ism, telefon, parol — jadval qatori) — shuning uchun «Hisobdan chiqish»dan keyin namuna ism va namuna telefon bilan ikkinchi akkaunt ochiladi (tayanch 9.34, 9.35 b).
  QIzoh dagi «eslatma» — Mentor roadmap'idagi «O'yindan oldin eslatma» (tayanch 1.5, keyinroq); «12-Modulda» deb va'da qilinmaydi (T-038).

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — Bo'shagan joy» · 5 — «2 — Oxirgi joy».

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
- Eyebrow: Yakun · belgi «✓ Uchinchi funksiya tayyor» — faqat A3 bajarilganda (nishon Third Feature bilan bir)
- Sarlavha (bloklar holatiga qarab, P-046; 14-FILTR 39): A3 — **Uchinchi funksiya tayyor: oldingilari bilan ishlaydi.** (53) ·
  A2 — **Backend qismi tayyor — telefondagi qismi qoldi.** (47) · A1 — **Backend harakati ishlaydi — bir vaqtda bosish qoldi.** (52) · hech biri — **Uchinchi funksiya boshlandi — qolgan qadamni tugating.** (54)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (4):
  - Qo'shilgan o'yinchi chiqsa, bo'shagan joyni navbatga birinchi yozilgan o'yinchi oladi.
  - Navbatdagi o'yinchi qo'shilganini ekranni yangilaganda ko'radi.
  - Oxirgi joy bitta odamga tegishi uchun Backend tekshirish va yozishni bitta ish qiladi.
  - Uchinchi funksiyaning «Nima buzilmasin» qatorida oldingi ikki funksiya turadi.
- Uyga vazifa — yo'q (P-058: ish repo'da — uch blok o'z funksiyangizda bajarildi; ekranda alohida blok yo'q).
- Keyingi dars — «Roadmap bo'yicha qayerdasiz?»: Mentor bilan yakkama-yakka: risklar va tuzatilgan reja.
- Nishonlaringiz — N/3
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Queue Keeper** — Bo'shagan joyni navbatdagi olishini topdingiz (3-ekran, 1-savol)
- **Last Seat** — Oxirgi joyni himoya qiladigan talab qatorini topdingiz (5-ekran, 2-savol)
- **Third Feature** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «Joy bo'shasa, navbatdagi oladi»
   - `POST /oyinlar/:id/navbat` · Navbat — To'lgan o'yinda o'yinchi `navbatda` bo'lib yoziladi.
   - `POST /oyinlar/:id/chiqish` · O'yindan chiqish — Qo'shilgan o'yinchi `chiqdi` bo'ladi, joy bo'shaydi.
   - `holat: 'qoshildi'` · Navbatdagi — Navbatga birinchi yozilgan o'yinchi bo'shagan joyni oladi.
   - Sinfga savol: Navbatda ikki kishi turibdi. Bitta joy bo'shasa, qaysi biri oladi?
2. 2-savol (5-ekran) — «Oxirgi joy — bitta odamga»
   - `9 / 10` · Ikki so'rov — Bir lahzada kelsa, ikkalasi ham «joy bor» deb ko'rishi mumkin.
   - `409 · O'yin to'ldi` · Bitta ish — Ikkinchi so'rov kutadi, keyin joy qolmaganini ko'radi.
   - `Nima qilsin: …` · Talab — «Ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin.»
   - Sinfga savol: Nega tugmani yashirish oxirgi joyni himoya qilmaydi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Mentor misolida uchinchi funksiya qaysi? | O'yindan chiqish va navbat | Chiqqan o'yinchining joyi bo'shaydi, to'lgan o'yinda navbatga yoziladi |
| Ilovada o'yindan chiqish yo'li bo'lmasa, nima bo'ladi? | Kela olmaydigan o'yinchining joyi band turadi | O'ynamoqchi bo'lgan odam «O'yin to'ldi»ni ko'radi |
| To'lgan o'yinda «O'yin to'ldi» o'rnida qaysi tugma chiqadi? | «Navbatga yozilish» | Bosilsa, o'yinchi `navbatda` holatida yoziladi |
| Qo'shilgan o'yinchi chiqsa, bo'shagan joyni kim oladi? | Navbatga birinchi yozilgan o'yinchi | Navbat bo'sh bo'lsa — joy bo'sh qoladi, «Qo'shilaman» qaytadi |
| Navbatdagi o'yinchi qo'shilganini qachon ko'radi? | Ekranni ochganda yoki pastga tortib yangilaganda | Navbat holati — real vaqt nuqtasi: bu modulda ilova uni ekran ochilganda va pastga tortilganda so'raydi |
| `ishtirokchilar` jadvalida o'yinchi qaysi holatlarda turadi? | `qoshildi`, `keladi`, `navbatda`, `chiqdi` | `keladi` — o'yin kuni «Kelaman»ni bosgani |
| Oxirgi joyga ikki so'rov bir lahzada kelsa, nima bo'lishi mumkin? | Ikkalasi «joy bor» deb ko'radi va ikkalasi yoziladi | Bu misolda talabda yozilmagan edi — «11 / 10» bo'ldi |
| Backend oxirgi joyni bitta odamga qanday beradi? | Joyni tekshirish va yozishni bitta ish qiladi | Shu payt ikkinchi so'rov kutib turadi. 5-Modulda bu nazorat tranzaksiya deb atalgan |
| 9-Moduldagi katakdan bugungi joyning farqi nima? | Katak bitta edi, joylar esa son bilan | «9 / 10» da ikki so'rov ham «joy bor» deb ko'rishi mumkin |
| Bir lahzadagi ikki so'rovni qanday tekshirasiz? | Agentga bir vaqtda bir nechta so'rov yubortirasiz | Qo'lda bosilganda so'rovlar bir lahzaga kamdan-kam tushadi; jadvalni Neon'da ko'rasiz |
| Uchinchi funksiya talabida «Nima buzilmasin»ga nima yoziladi? | Oldingi ikki funksiya | Mentor misolida: e'lon berish, «Qo'shilaman», «Kelaman» |
| Backend o'zgargach, telefondagi ilova uni qachon ko'radi? | `git push` dan keyin, Render yangilagach | Render push'dan keyin xizmatni o'zi qayta deploy qiladi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
1. Qo'shilgan o'yinchi kela olmaydi. Ilovada nima qiladi? ✔ «O'yindan chiqish»ni bosadi · «Kelaman»ni bosmay kutadi · Tashkilotchiga xabar yozadi · Ilovani telefondan o'chiradi
2. To'lgan o'yinda o'ynamoqchisiz. Nimani bosasiz? «Qo'shilaman»ni qayta bosaman · ✔ «Navbatga yozilish»ni bosaman · «Kelaman»ni o'yin kuni bosaman · «E'lon berish»ni yangidan bosaman
3. Bo'shagan joyni kim oladi? Ekranni birinchi yangilagan o'yinchi · Tashkilotchi o'zi tanlagan o'yinchi · ✔ Navbatga birinchi yozilgan o'yinchi · Navbatga oxirgi yozilgan o'yinchi
4. Navbat bo'sh, «10 / 10». Bir o'yinchi chiqdi — kartada nima? 10 / 10 va «O'yin to'ldi» · 9 / 10 va «O'yin to'ldi» · 10 / 10 va «Qo'shilaman» · ✔ 9 / 10 va «Qo'shilaman»
5. Navbatdagi o'yinchi qo'shilganini qachon ko'radi? ✔ Ekranni ochganda yoki yangilaganda · Tashkilotchi unga qo'ng'iroq qilganda · O'yin kuni maydonga borgan paytda · Navbatga yozilgan paytning o'zida
6. Jadvalda navbatdagi o'yinchi qanday turadi? `qoshildi` holatida, ro'yxatning oxirida · ✔ `navbatda` holatida, yozilgan vaqti bilan · `chiqdi` holatida, joy bo'shashini kutib · Alohida `navbat` jadvalida, o'z raqami bilan
7. Backend o'zgardi. Telefondagi ilova uni qachon ko'radi? Laptopda `npm run start:dev` qilgach · Telefonda Expo Go'ni qayta o'rnatgach · ✔ Push'dan keyin Render yangilagach · Neon'da jadvalni qayta ochib ko'rgach
8. Talabda «bir vaqtda» yo'q. Ikki kishi oxirgi joyni bosdi — nima bo'lishi mumkin? Ikkalasi ham rad etiladi, joy qoladi · Ilova ikkinchi bosishni o'zi o'chiradi · Tashkilotchiga ikkalasidan xabar boradi · ✔ Ikkalasi yoziladi, «11 / 10» bo'ladi
9. Backend oxirgi joyni bitta odamga qanday beradi? ✔ Tekshirish va yozishni bitta ish qiladi · Ikkalasini yozib, keyin birini o'chiradi · Yaqinroq telefonning so'rovini tanlaydi · Ikkala so'rovni ham rad etib qaytaradi
10. «Bitta ish» paytida ikkinchi so'rov nima qiladi? Birinchisidan oldin o'zi yoziladi · ✔ Kutib turadi, keyin javob oladi · Yo'qolib ketadi, javob kelmaydi · Birinchisi bilan birga yoziladi
11. Bir lahzadagi ikki so'rovni qanday tekshirasiz? Ikki telefondan qo'lda bir vaqtda bosib · Bitta telefondan ikki marta tez bosib · ✔ Agentga bir vaqtda so'rov yubortirib · Neon'da jadvalni qo'lda o'zgartirib
12. Uchinchi funksiyada «Nima buzilmasin»ga nima yoziladi? Faqat yangi funksiyaning o'z tugmalari · `README.md` va `.gitignore` fayllari · Render va Neon xizmatlaridagi sozlamalar · ✔ Oldingi ikki funksiyangiz va yo'llari

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik (python, `md14/olchov.py`): to'g'ri variant hech bir savolda yolg'iz eng uzun emas; har savolda variantlar ±15% ichida (jadval — o'lchov chiqishida).
Fon so'zlari (R-008, kodda {uz, ru}): navbat · chiqish · `navbatda` · `qoshildi` · `chiqdi` · «10 / 10» · `409` · bitta ish · Backend · Database · Render · Maydon Jamoa

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **0 (A)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`OYIN_SAHNA` + `OyinSahna`** — bitta manba (180): telefon(lar) («O'yin» ekrani, son, ismsiz doiralar, «Navbatda: N», tugma holatlari: Qo'shilaman · Qo'shildingiz · O'yin to'ldi · Navbatga yozilish ·
   Navbatdasiz · O'yindan chiqish; «eski holat» yorlig'i; «Rostdan chiqasizmi?» kichik oynasi; pastga tortish belgisi), Backend qutisi (uch yo'l, so'rov kartalari «joy bormi?», qulf, «kutyapti»),
   `ishtirokchilar` kartasi (alohida qatorlar + yig'ma qator). Holatlar: kulrang · oq · accent · yashil · qizil · `chiqdi` (ustidan chiziq). 0, 1, 2, 4-ekran va A1–A3 o'ng tomoni shundan o'qiydi.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4). «Maydon Jamoa» nomi — telefon maketida, o'z rangida (SABOQ 2). Telefon maketi ≈170×272 (SABOQ 22), doim chapda (SABOQ 21).
3. 0-ekran `QKirish`: maket — ikki telefon («10 / 10», «Qo'shildingiz» / «O'yin to'ldi», ikkalasi o'chiq); javobdan keyin 1-telefonda bosish → tugma silkinadi; ostida maydon kadri
   (10 doira o'rni, 9 tasi birin-ketin yonadi, bittasi uzuq — U-041 bo'sh joy), yorliqlar «10 kishi kerak edi — 9 kishi keldi», «o'ynamoqchi edi — joy yo'q edi».
4. 2-ekran `QTushuncha`: `QBashorat`/`QTaxmin` (yopilmaydi — `TaxminIxcham`), uch tugma telefonlarning o'zida tartib bilan (`.keyingi` halqa + pulsatsiya), konvertlar, jadvalga qator kirishi,
   `chiqdi` / `qoshildi` almashinuvi bitta qulf ichida (son «9 / 10» ga tushmaydi), 2-telefonda «eski holat» → pastga tortilganda yangilanadi, `zoom`, `tugadi`. Holat bosishlar ro'yxatidan chiziladi (P-046).
5. 4-ekran `QTushuncha`: `QBashorat`/`QTaxmin`; uch harakat bittadan (`QKarta` + bitta `QTugma`): «Bir vaqtda bosish» (ikki so'rov kartasi yonma-yon, «11 / 10» qizil) →
   talab qatori kartasi «Talabga qo'shish» (qator talab kartasiga uchadi, «agent qaytadan quryapti…», holat qaytadi) → «Yana bir vaqtda bosish» (qulf, 2-so'rov «kutyapti», `409`, «Navbatga yozilish» paydo bo'ladi). `zoom`, `tugadi`.
   Telefonda (bir ustun) harakatdan keyin vizual ko'rinadigan joyga suriladi.
6. 3 va 5-ekran `QTest` — matn yuqoridagidek; to'g'ri izoh ≤60, xato izohlari ≤60.
7. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (10-dars `FoundationDayLesson` naqshi). Har blok **4 qadam**, hammasi o'quvchining o'z repo'sida (tayanch 9.1); 5-qadam yo'q.
   - Uch blokda ham prompt — uch joy `{qayerda}` · `{nima qilsin}` · `{nima buzilmasin}` (`A3_JOY` naqshi 10-darsdan), har joy ostida kulrang savol-ipucha (MD dagi matn; namuna emas — KORPUS §32);
     «Yordam» — Mentor misolidagi to'liq prompt. Qolipda ipucha maydoni bo'lmasa — `QPrompt` ga `ipucha` (asosiy seans qarori; 11-Modul MEXANIZM-TAKLIF 1 bilan bir).
   - A1 tepasida «Uchinchi funksiyangiz: {nom}» — `pm-m9d6-roadmap` dan (`hozir[2]` → `ishlar` dagi `nom`); kalit yo'q bo'lsa — bitta qatorli maydon, qiymati dars qoralamasida (`pm-m9d14-code`) saqlanadi va 1-ekran pastki qatorida ko'rinadi (TAYANCHGA SAVOL 13).
   - Trek `pm-m9d8-platforma` dan: A3 3-qadamida `mobil` — Expo qatori, `web` — Netlify qatori; «Yordam» ostidagi web gapi faqat web-trekda. Kalit yo'q bo'lsa — ikkala qator ham ko'rinadi (M-q5 naqshi).
   - 4-qadam nomi: «Neon'da tekshirish» (A1, A2) · «Telefonda tekshirish» (A3). O'ng: A1, A2 — agent chati + jadval-karta; A3 — telefon maketi (uch kadr).
   - A2 `QIzoh` (qo'lda bosish) va A3 `QIzoh` (ekranni yangilash, eslatma) — natija ostida, bittadan.
   - `ortda`: faqat A1 da (darsda bir marta, F-1006-271) `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-14-done` (tayanch 3 matni; 9.10).
8. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Queue Keeper, 5-ekran → Last Seat, A3 oxirgi (4-qadam) «Bajardim» → Third Feature.
9. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; SABOQ 12, 16). 7-ekran `QYakun`: `uyga` yo'q, `recap` 4 qator, `keyingi` matni yuqoridagidek.
10. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
11. `LESSON_META.lessonId` — `m9-14-v1`, `lessonTitle` — «Loyiha kuni: 3-asosiy funksiya». App.jsx `m9-14` qatoriga `comp: FeatureThreeLesson` — «qur» bosqichida (asosiy seans).
12. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates -- src/9-Modull/FeatureThreeLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:jsx` 0 · `lint:layout` 1280/1366 ·
    `python3 feedback/F-1005-10modul/stilsiz.py` (SABOQ 31) · surat 1280 + 393.
13. ru — uz tasdiqlangach, bir yo'la (6-RU).

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m11-dars-14-start` → `m11-dars-14-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m11-dars-14-start`** = `m11-dars-13-done` (tayanch 3): F1 (e'lon, qo'shilish, «8 / 10», «O'yin to'ldi») · F2 («Kelaman», «Kelishini tasdiqladi: 7 / 9») · ro'yxat kun va soat bo'yicha, kun sarlavhalari bilan (tayanch 1.8).
2. **`m11-dars-14-done`** = start + A1–A3 namunasi:
   - `backend/`: `POST /oyinlar/:id/navbat` (token bilan; o'yin to'lmagan bo'lsa `409 · O'yin hali to'lmagan`; o'yinchi bu o'yinda bo'lsa `409 · Siz bu o'yinga qo'shilgansiz` — 9.32) ·
     `POST /oyinlar/:id/chiqish` (token bilan; `qoshildi` / `keladi` / `navbatda` → `chiqdi`; qo'shilgan o'yinchi chiqsa va navbat bo'sh bo'lmasa — `yaratilgan` bo'yicha birinchi `navbatda` → `qoshildi`) ·
     `…/qoshilish`, `…/navbat`, `…/chiqish` — bitta tranzaksiyada, ichida `oyinlar` qatori qulflanadi (PostgreSQL `SELECT … FOR UPDATE`; TypeORM'da masalan `lock: { mode: 'pessimistic_write' }`) — ikkinchi so'rov kutadi;
     `ishtirokchilar` da (`oyin_id`, `oyinchi_id`) noyob — bitta o'yinchi bir o'yinda bitta qator (qayta yozilsa holat va `yaratilgan` yangilanadi — navbat oxiriga);
     to'lgan o'yinga `…/qoshilish` — `409 · O'yin to'ldi` (tayanch 9.32) · `GET /oyinlar` — har o'yinda `navbatda` (soni) va `menNavbatdaman` (tayanch 9.29).
     «8 / 10» = `qoshildi` + `keladi` (o'zgarmagan).
   - `mobil/`: «O'yin» ekrani (`src/app/oyin/[id].tsx`) — «Navbatga yozilish», «Navbatdasiz», «O'yindan chiqish» (`Alert.alert` — «Rostdan chiqasizmi?» · «Ha» · «Yo'q»), pastga tortib yangilash (`RefreshControl`);
     «O'yinlar» kartasi — «Navbatda: N». E'lon berish, «Qo'shilaman», «Kelaman», kun sarlavhalari, animatsiyalar o'zgarmagan.
   - `README.md` «Xatolar» jadvaliga: `409 · O'yin to'ldi` — navbatga yoziling · `409 · O'yin hali to'lmagan` — «Qo'shilaman» bor · Render'da eski javob — yangi deploy tugashini kuting.
   - Web-trek namunasi (`prototip/`) bu darsda o'zgarmaydi — Mentor misoli mobil; web-trek o'quvchisi «Yordam» ostidagi gap bo'yicha yozadi (9.7).
3. **Shart:** `m11-dars-14-start` va `m11-dars-14-done` teglari kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida). Mentor Render xizmati yangi deploy bilan.
4. **Bog'liqlik:** 15-dars (tayanch 1.9) Mentor misolida F3 ni «kechikdi» deydi — «keyin tugagan bo'lsa ham» ma'nosida (tayanch 9.39); `-done` teg ishlaydigan holat, zid emas. Nomlar (yo'llar, holatlar, tugmalar) tayanch bilan bir xil.

---

## TAYANCHGA SAVOL (asosiy seans javoblari 06.10 — tayanch 1.7, 2, 9.29–9.39)
**Holat (06.10, 14-FILTR):** 7 — tayanch 9.93 · 9 — 9.92 (yozuvlar `id` bilan yaratiladi va faqat shu `id` lar o'chiriladi) · 10 — 9.94 (Mentor misoli, umumiy qolip emas) · 13 — ochiq · 14 — yopildi: 11-dars Mentor talabida «bir vaqtda» qatori yo'q (o'zaro tekshiruv), A2 «Yordam»idagi `…/qoshilish` — haqiqiy o'zgarish.
1. ~~Navbat yo'li `POST /oyinlar/:id/navbat`~~ — **yopildi: 1.7** (alohida yo'l qabul qilindi). MD shunga keltirildi.
2. ~~To'lgan o'yinga `…/qoshilish` javobi~~ — **yopildi: 9.32** (`409 · O'yin to'ldi`; takror — «Siz bu o'yinga qo'shilgansiz»).
3. ~~Navbat tartibi~~ — **yopildi: 1.7** (`yaratilgan`). Chiqib qayta yozilgan o'yinchi navbat oxiriga — REPO dagi talqin (shu bo'yicha qoldi).
4. ~~`GET /oyinlar` javobi~~ — **yopildi: 9.29** (`/:id` yo'q; `navbatda`, `menNavbatdaman`). A1 «Yordam» va REPO shunga keltirildi; «Navbatdasiz · N-o'rin» o'rnini ko'rsatish olib tashlandi — javobda o'rin yo'q.
5. ~~«Chiqish» tugmasi nomi~~ — **yopildi: tayanch 2** (tugma «O'yindan chiqish»; akkauntdan — «Hisobdan chiqish»). O'quvchi ko'radigan hamma joyda almashtirildi; funksiya nomi «Chiqish va navbat».
6. ~~«Rostdan chiqasizmi?» tasdiq oynasi~~ — **yopildi: 1.7** (qabul).
7. **(ochiq) Yangi holat yozuvlari** «Navbatdasiz» va kartadagi «Navbatda: N» — tayanch 2 da tugma emas, holat yozuvi sifatida yo'q (`navbatda`, `menNavbatdaman` dan chiziladi).
8. ~~«tranzaksiya»~~ — **yopildi: 9.37** — o'quvchi matnida «ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin»; kartochka 8 izohida bir marta: «5-Modulda bu nazorat tranzaksiya deb atalgan» (kod `m4-03`).
9. **(ochiq, qisman 9.35 a) Agent tekshiruv yozuvlari** — A1, A2 da agent tekshiruv so'rovlarini yuboradi, o'quvchi Neon'da ko'radi, keyin agent tekshiruv yozuvlarini o'chiradi (10-Modul naqshi). 9.35 (a) dagi «test ma'lumoti `WHERE` bilan va qaytarish» ga yaqin — shu shakl ma'qulmi?
10. **(ochiq) Blok bo'linishi** — A1 Backend · A2 bir vaqtda bosish · A3 ilova: har o'quvchi funksiyasiga mos keladigan qatlamlar. 11, 12-dars MD lari bilan bir ritm bo'lsinmi — o'zaro tekshiruvda solishtirilsin.
11. ~~Ikkinchi akkaunt~~ — **yopildi: 9.34, 9.35 b** (sinfdosh telefoni yoki «Hisobdan chiqish» bilan ikkinchi akkaunt; namuna ism va namuna telefon). A3 1-qadam shunga keltirildi.
12. ~~15-dars bilan bog'liqlik~~ — **yopildi: 9.39** («kechikdi» — «keyin tugagan bo'lsa ham»; zid emas).
13. **(ochiq) Kalit yo'q bo'lsa funksiya nomi** — `pm-m9d6-roadmap` bo'lmasa o'quvchi nomni A1 da yozadi; yangi saqlash kaliti ochmadim (qoralama `pm-m9d14-code`). 15-dars uni o'qishi kerakmi?
14. **(ochiq) 4-ekrandagi talab kartasi va 11-dars** — 4-ekran «bir vaqtda» qatorisiz talabni ko'rsatadi (yorliq «talab — bu qatorsiz», Mentor misolining 11-darsdagi talabi deb aytilmaydi).
    Agar 11-dars MD sida Mentor F1 talabida bu qator allaqachon bo'lsa — A2 «Yordam»idagi `…/qoshilish` qismi tekshiruvga aylanadi; o'zaro tekshiruvda solishtirilsin.

## Shubhali joylar (ishonchim to'liq emas)
- **Render auto-deploy** — render.com/docs/deploys (06.10): «Whenever you push or merge a change to that branch, by default Render automatically rebuilds and redeploys your service»; Auto-Deploy «On Commit» — yangi xizmatda default.
  Mentor yoki o'quvchi buni o'chirgan bo'lsa — qo'lda deploy kerak; Render interfeysidagi tugma nomini yozmadim (P-028).
- **Bir vaqtda tekshiruvi** — agent so'rovlarni haqiqatan bir lahzada yuboradimi (masalan, birga yuboriladigan beshta so'rov), uning tizimiga bog'liq (10-Modul `02` shubhasi bilan bir). Qulf bo'lmasa ham tekshiruv ba'zan tasodifan o'tishi mumkin —
  shuning uchun beshta so'rov va Neon sanog'i. Bu isbot emas, tekshiruv; «qur» da `-done` kodi qulfsiz versiya bilan solishtirib ko'rilsin.
- **TypeORM qulf yozuvi** (`lock: { mode: 'pessimistic_write' }`) — rasmiy hujjat sahifasini ochib tekshira olmadim (typeorm.io manzili 404). REPO da «masalan» deb yozildi; «qur» da tekshiriladi.
- **«11 / 10»** — talabsiz agent har doim shunday qurmaydi; 4-ekran mexanikasi «bu misolda» deb chegaralangan. Auditor «agent buni o'zi o'ylaydi» deyishi mumkin — Mentor gapi va kartochka «mumkin» deydi.
- **`Alert.alert` va «Rostdan chiqasizmi?»** — RN da ishlaydi; web-trekda brauzer oynasi (`window.confirm`) — «Yordam» ostida umumiy so'z bilan («brauzer oynasida»).
- **Pastga tortib yangilash** (`RefreshControl`) — «O'yinlar» ro'yxatida 11-darsda bor deb oldim (tayanch 1.6 real vaqt nuqtasi); «O'yin» ekranida yo'q bo'lsa — A3 Yordam qatori shuni qo'shadi.
- **Hook kadri «10 kishi kerak edi — 9 kishi keldi»** — sahna (Mentor misoli), raqam emas; auditor statistika deb o'qishi mumkin — yorliq kulrang, «bu misolda» Mentor gapida yo'q (hook javobni oldindan aytmasin — P-016).
- **`oyin_id = 4 / 5 / 6`** — Yakshanba 17:00 namuna tartibida 4-o'yin (tayanch 9.2 tartibi bo'yicha); tekshiruv o'yinlari 5, 6 — agentga bog'liq, maketda namuna son.
- **Arena 6** — `navbatda` holati va `yaratilgan` 2-ekranda ko'rsatilgan; «`chiqdi` holatida, joy bo'shashini kutib» distraktori — navbatdagi `chiqdi` emas, `navbatda` (2-ekranda ko'rsatilgan); variant noto'g'ri bo'lib qoladi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m9-13` «Uch foydalanuvchidan keyin nimani tuzatasiz?» → **`m9-14` «Loyiha kuni: 3-asosiy funksiya»** (osti «roadmap'dagi uchinchi funksiya» — 1-ekran Mentorida) →
  `m9-15` «Roadmap bo'yicha qayerdasiz?» (App.jsx 384–386, grep bilan; yakundagi «Keyingi dars» shu nom va osti yozuvi).
- [x] Bitta misol-ip («Maydon Jamoa», repo `maydon-jamoa`, Yakshanba 17:00 o'yini) · metafora yo'q («bitta ish» — tavsif) · keyssiz · bitta vizual dars bo'yi — `OyinSahna` (0, 1, 2, 4; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (navbatga yozilish → chiqish → yangilash: jadval holatlari, son, «eski holat»), 4 (bir vaqtda → talabga qo'shish → yana: «11 / 10» → qulf, `409`); 0-ekran javobdan keyin o'zgaradi.
- [x] SABOQ 11: harakatli ekranlarda keyingi element halqa + pulsatsiya, Mentor bosqichga qarab shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12/16: kartochkalar alohida, Mentorsiz.
  SABOQ 19–31: telefon chapda, Backend va jadval o'ngda; jadval ixcham (yig'ma qator); har ekranda ≤3 blok; tugmalar maketning o'zida.
- [x] Sarlavhalar ≤55 bitta qator · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 · hook javobi ≤120 ·
  to'g'ri izoh ≤60 · xato izohlari ≤60. Sanoq python bilan (`md14/olchov.py`).
- [x] Atamalar tayanch 2 bilan bir xil: asosiy funksiya · navbat · chiqish · qo'shilish · talab · agent · tekshirish · Backend · Database · deploy; «navbat» faqat bir ma'noda («tartib bilan», «keyingi»);
  «push» faqat `git push`; «kiradi» faqat ilovaga kirish; «server», «baza», «ficha», «sinov», «tranzaksiya» o'quvchi matnida yo'q · siz-forma; Antigravity promptlari sen-formada (T-002).
- [x] Testlar: variantlar bir shaklda, uzunlik yaqin, to'g'ri variant yolg'iz eng uzun emas; kalit so'z kamida ikki variantda (1: «10 / 10», «navbatda: 2»; 2: «bir vaqtda», tugma) ·
  ✔ o'rni: 3-ekran C, 5-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — yo'q; «mumkin», «bu misolda», «kamdan-kam»).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «F3», «m9-14», «11-Modul» yo'q; blok — «Amaliyot 1»; modul raqami LMS bo'yicha — «9-Moduldagi» kartochkada) · tarixiy voqea, real kompaniya raqami yo'q · «KOD» (13) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/011/014/015/016/020/029/039/043/045/047/048/052/064 · P-001/008/013/015/020/026/028/036/046/052/059/062/063/064/067 · S-001/003/004/006/008/009/010/020/026/040 — ko'rildi.
- [ ] (ochiq) P-028: Render auto-deploy — hujjatdan, interfeys ko'z bilan ko'rilmagan; TypeORM qulf yozuvi hujjatdan tekshirilmagan (shubhali joylar); «qur» da tekshiriladi.
- [x] Blok modeli — tayanch 9.1 (hamma qadam o'z repo'sida, 5-qadam yo'q); talab zinapoyasi — tayanch 4 (11, 12, 14: uch qator o'quvchidan); namuna o'yin — 9.2. TAYANCHGA SAVOL: 1–6, 8, 11, 12 — yopildi (tayanch 1.7, 2, 9.29–9.39); ochiq — 7, 9, 10, 13, 14.
