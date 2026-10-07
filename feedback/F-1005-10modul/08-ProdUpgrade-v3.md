# 10-Modul (kod: `src/8-Modull`) · 8-dars «Loyiha kuni: prodga ko'tarish — 1-qism» — MD v3 (loyiha kuni qolipi)

Fayl: `src/8-Modull/ProdUpgradeLesson.jsx` · kalit `m8-08` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (P-058 dan farq — SABOQ 12) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · tip AI-PRAKT (dastur: «Loyihani prodga ko'tarish — 1-qism: eng yaxshi loyihani production darajasiga»; natija — «production darajadagi loyiha») ·
natija darsda «prod ro'yxati bo'yicha yaxshilangan loyiha» deb aytiladi — «production darajadagi» hukmi berilmaydi (08-FILTR 2: bepul Render, `synchronize` «keyin») ·
eng yaqin namuna: `feedback/F-1005-9modul/09-MvpComplete-v3.md` va `09-FILTR.md` (tuzilish) · shakl: `03-LiveDashboard-v3.md` (shu moduldagi loyiha kuni). Matn ko'chirilmadi.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **A**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 ≈ 20 · A2 ≈ 18 · A3 ≈ 22; har blokning 5-qadami ≈ 3 daqiqa).
Menyu nomi (DE-205): App.jsx `m8-08` — «Loyiha kuni: prodga ko'tarish — 1-qism» (osti: «eng yaxshi loyihangiz prod ro'yxati bo'yicha» — 05.10 GATE M 08-q0 A; avval «… production darajasiga») ·
oldingi dars `m8-07` «Production deploy: domen, SSL, monitoring» · keyingi `m8-09` «Loyiha kuni: prodga ko'tarish — 2-qism» (`comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida «Maydon» prod ro'yxati bo'yicha yaxshilangan va o'zgarishlar repo'ning `prod` tarmog'ida turadi (hali birlashtirilmagan):
   - **so'rovlar chegarasi** — `POST /bandlar`, `POST /kirish`, `POST /hodisalar`: bitta IP manzildan bir daqiqada belgilangan sondan ko'p so'rov kelsa, Backend `429` qaytaradi va yozmaydi;
   - **xato va kutish holatlari** — o'yinchi sahifasi Backend kechiksa yoki javob bermasa, kutishni aytadi va o'zi qayta so'raydi (ustma-ust emas); bir daqiqadan keyin — «Qayta urinish» tugmasi;
   - **A/B yakuni** — B ishga tushgandan beri (4-darsdan) sonlar Neon SQL Editor'da bitta SQL bilan (tayanch 9.4): A — vaqt tanlagan 42 brauzerdan 12 tasi band qildi, B — 40 tadan 17 tasi; **hozircha B qoladi** —
     mahsulot qarori, B yaxshiroq ekanining isboti emas. Mentor: «farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz» (tayanch 1, aynan). Statistik da'vo yo'q;
   - **README — olti qism** («Maydon» uchun kurs mezoni, umumiy «to'liq README» ta'rifi emas): ishga tushirish, maxfiy kalit nomlari (qiymatsiz), so'rovlar chegarasi, xato holatlari, A/B natijasi va prod ro'yxati.
   Teg: `m10-dars-08-start` (= `m10-dars-07-done`) → `m10-dars-08-done` (tayanch 3). Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
2. **Bugungi asosiy fikr (P-013):** Internetdagi MVP ishlayapti, lekin hali mustahkam emas — prod ro'yxati nima yetishmasligini aytadi, har ishni siz talab bilan yozasiz va o'zingiz tekshirasiz.
   Agent talabga tayanib quradi, aytilmagan joyni taxmin qilishi mumkin (tayanch 7.2) — har blokning 4-qadami shu tekshiruv.
3. **Prod ro'yxati — darsning bosh tushunchasi.** Ta'rif (dars bo'yi so'zma-so'z): **«Prod ro'yxati — internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati.»**
   (08-FILTR 1: «Maydon» 9-Modulda internetga chiqqan, 4-darsda A/B real odamlarga ketgan — «ochishdan oldin» tarixga zid edi.)
   Ro'yxatdagi har biri — **ish** («band» emas — «band» bu modulda faqat band qilish; «qator» emas — «qator» faqat jadval va prompt qatori, T-015).
   «Maydon» prod ro'yxati (Mentor misoli; oldingi darslar natijasi tayanch 3-jadvalidan):
   - bor: HTTPS va `/health` monitoringi (7-dars) · uch zaiflik yopilgan, ega kirishida 2FA (5-dars) · maxfiylik siyosati va eski ma'lumotni o'chirish — band 30 kun, hodisalar 60 kun (6-dars);
   - bugun: so'rovlar chegarasi · xato va kutish holatlari · A/B yakuni · README — olti qism;
   - keyin: **laptopdagi tekshiruvlar ham sanaladi** — laptopdagi Backend ham, Render'dagisi ham bitta Neon Database'ga yozadi (tayanch 9.11); yechim yo'llari README da yoziladi, bugun qilinmaydi.
   O'quvchining o'z ro'yxatiga 6-darsdagi audit natijasi (`pm-m8d6-audit`) qo'shiladi — A3 5-qadami (tayanch 8).
4. **Texnik aniqlik** (manba: repo `dars-11-done` kodi + tayanch 3, 6; taxmin emas):
   - **Hozirgi xato holatlari** (`web/src/App.jsx`, `BandForma.jsx`, `Ega.jsx`, `dars-11-done`): kataklar so'rovi o'tmasa — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» (tugma yo'q, sahifani o'zingiz yangilaysiz);
     javob kelguncha — «Yuklanmoqda…» (vaqt chegarasi yo'q); band formasida `409` dan boshqa har xato — «Band qilib bo'lmadi. Birozdan keyin urinib ko'ring.»; ega kirishida `401` dan boshqa xato — «Kirib bo'lmadi…».
     2–7-darslar bu matnlarga tegmaydi deb oldim (TAYANCHGA SAVOL 7).
   - **Render bepul rejasi** (tayanch 6 + render.com/docs/free, 05.10): 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi taxminan bir daqiqa. 7-darsdan UptimeRobot har 5 daqiqada `/health` ni so'raydi —
     Backend odatda uxlamaydi (yon ta'sir). Lekin monitoring to'xtasa, Render qayta ishga tushsa yoki tarmoq sekin bo'lsa, o'yinchi baribir kutadi — shuning uchun holat kerak.
     Uyg'onish paytida brauzer so'roviga Render nima qaytarishi hujjatda aniq yozilmagan (brauzerga «yuklanish sahifasi» ko'rsatiladi) — talab ikkala yo'lni qamraydi: javob kechiksa ham, so'rov o'tmasa ham (shubhali joylar).
   - **So'rovlar chegarasi** — Backend'da, har yo'l uchun alohida, **bitta IP manzil** (1-Modul atamasi) bo'yicha bir daqiqalik oynada sanaladi. Mentor misolidagi sonlar (tayanchda yo'q — TAYANCHGA SAVOL 1):
     `POST /kirish` — daqiqada 5 · `POST /bandlar` — daqiqada 10 · `POST /hodisalar` — daqiqada 60. Chegaradan oshsa — `429` va matn «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.»
     Nega har xil (bu MVP'dagi tanlov): kirish — parol va kod tekshiriladigan yo'l, shuning uchun eng qattiq; bandlar — o'yinchi daqiqada bir-ikki band qiladi; hodisalar — har ochish va bosish hodisa yuboradi.
     **IP manzil ≠ o'yinchi (08-FILTR 4):** bir Wi-Fi'dagi telefonlar Backend'ga bitta manzildan kelgandek ko'rinishi mumkin — chegara odamni emas, manzilni sanaydi; umumiy Wi-Fi'da bir-birining chegarasini yeyishi mumkin.
     «Maydon» bitta ega uchun qurilgan — kirishga sodda IP chegarasi yetadi; katta mahsulotda IP'ning o'zi yetmasligi mumkin (2-ekran `QIzoh`, O'qituvchi eslatmasi).
     Render'da so'rov uning proksi-serveri orqali keladi — o'yinchining manzili sarlavhada (`X-Forwarded-For`) turadi; Backend uni hisobga olmasa, hamma o'yinchi bitta manzil bo'lib sanaladi.
     Rasmiy hujjatda yo'q — jamoatchilik forumi: Render ro'yxatga qo'shib boradi, mijoz yuborgan qiymatni tozalamaydi (soxta qiymat xavfi). Shuning uchun proksi va chegara mexanizmi agentga qoldirilmaydi —
     «qur» dan oldin asosiy seans muzlatadi (REPO 2, tayanch 9.18). Bu 8-darsda internetda tekshirilmaydi: `prod` tarmog'i hali deploy qilinmaydi.
     Chegara xotirada saqlanadi — Backend qayta ishga tushsa, sanoq noldan boshlanadi (Render'da bitta nusxa; MVP uchun yetarli). Chegara tekshiruvi so'rov ishlovidan **oldin** — shuning uchun oshgan so'rov tekshirilmaydi ham, yozilmaydi ham.
   - **Kutish holati** (o'yinchi sahifasi, `web/`; avvalgi nomi «Backend uyg'onmoqda» — sababni taxmin qilardi: sayt Render uyg'onayotganini bilmaydi, 08-FILTR 9): javob 5 soniyada kelmasa — sayt kutishni aytadi;
     so'rov o'tmasa — 5 soniyadan keyin qayta so'raydi, **oldingi so'rov tugamasdan yangisi ketmaydi** (08-FILTR 6; 3-dars naqshi); bir daqiqadan keyin ham bo'lmasa — «Vaqtlarni yuklab bo'lmadi» + «Qayta urinish» tugmasi.
     Saytdagi yozuv o'yinchi tilida: **«Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.»** (bir daqiqadan keyin xato chiqadi — matn rost; «Backend» so'zi o'yinchiga ko'rinmaydi; TAYANCHGA SAVOL 2).
     `429` da — Backend matni ko'rsatiladi; band formasida yozilgan ism va telefon o'chmaydi.
   - **A/B yakuni (SQL).** `hodisalar` jadvalida `variant` ustuni 4-darsdan bor (eski qatorlarda bo'sh). Bitta SQL — B ishga tushgandan beri, har variant bo'yicha turli brauzerlar.
     `variant IS NOT NULL` — aynan tajriba davri: A va B bir vaqtda boshlangan, sana chegarasi shart emas; matnda «bir haftalik» emas — «B ishga tushgandan beri» (08-FILTR 3):
     ```sql
     SELECT variant,
            COUNT(DISTINCT brauzer_id) FILTER (WHERE nom = 'vaqt-tanladi') AS tanladi,
            COUNT(DISTINCT brauzer_id) FILTER (WHERE nom = 'band-qildi')  AS band_qildi
     FROM hodisalar
     WHERE variant IS NOT NULL AND brauzer_id <> 'tekshiruv'
     GROUP BY variant
     ORDER BY variant;
     ```
     Mentor misoli natijasi: `A · 42 · 12` · `B · 40 · 17` → foiz: A ≈ 29 (12 / 42), B ≈ 43 (17 / 40). Dashboard bu sonlarni bermaydi: u faqat bugunni ko'rsatadi (tayanch 9.4).
     Ikki kun kirgan brauzer bir marta sanaladi (`COUNT(DISTINCT …)` butun davr bo'yicha) — kunlik sonlar qo'shilmaydi (tayanch 7.3).
     `band_qildi` — shu variantdagi band qilgan hamma brauzer; «Maydon»da band qilishdan oldin vaqt tanlanadi, shuning uchun ular vaqt tanlaganlar ichida. README'da: «shu oqimda vaqt tanlaganlardan band qilganlar».
   - **B qoladi — kodda:** hamma o'yinchiga B matni («18:00 ni band qilish»); variant endi tanlanmaydi, `hodisaYoz` yangi hodisaga `variant` qo'shmaydi; eski qatorlar va `variant` ustuni o'zgarmaydi;
     dashboard'da A va B foizi o'rniga bitta foiz — bugun vaqtni tanlaganlardan band qilganlar (TAYANCHGA SAVOL 4).
   - **`prod` tarmog'i.** A1 1-qadamida `git checkout -b prod`; har blok oxirida commit; A3 da `git push -u origin prod`. Bizning sozlamada Render «linked branch» dan deploy qiladi (render.com/docs/web-services),
     Netlify — production tarmog'idan, boshqa tarmoqlar uchun deploy sukut bo'yicha o'chiq (docs.netlify.com/site-deploys/overview, 05.10). 9-Modulda ikkalasi `main` ga ulangan —
     shuning uchun internetdagi sayt bugun o'zgarmaydi. Tekshiruv — laptopda.
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **production (prod)** — haqiqiy foydalanuvchilar ishlatadigan versiya (7-darsdan; bepul reja uzluksizlikni va'da qilmaydi). **prod ro'yxati** — 3-banddagi ta'rif. «jonli versiya», «production darajadagi» — ishlatilmaydi.
   - **so'rovlar chegarasi** — bir IP manzildan bir daqiqada nechta so'rov qabul qilinishi. Birinchi ko'rinishi — 2-ekran Mentori, oddiy gapdan keyin (T-011). «rate limit» — faqat kartochkada bir marta.
   - **`429`** — «juda ko'p so'rov» javobi; yonida doim ma'nosi bilan (S-020). `401`, `409`, `400` — oldingi darslardan, yonida ma'nosi bilan.
   - **kutish holati** — Backend kechikkanda yoki javob bermaganda sayt kutishni aytadigan holat (sababni aytmaydi). **xato holati** — so'rov bir daqiqadan keyin ham o'tmaganda: xabar va «Qayta urinish».
   - **tarmoq** (`prod` tarmog'i) — yangi atama, A1 da bir marta: «repo'dagi alohida yo'l: o'zgarishlar `main` ga tegmasdan shu yerda yig'iladi». «branch» — qavsda bir marta. **birlashtirish** — `prod` ni `main` ga qo'shish (9-dars so'zi; bugun faqat «hali birlashtirilmagan»).
   - **A/B test · variant A · variant B · foiz · gipoteza** — 4-darsdan, tayanchdagidek. «ulush», «konversiya» — yo'q.
   - **README** — repo'dagi yo'riqnoma fayli (4c-Moduldan tanish). **IP manzil** — 1-Moduldan.
   - sayt · Backend · Database · vaqt katagi · band qilish · o'yinchi · maydon egasi (qisqa — «ega») · hodisa · brauzer ID · dashboard · talab · prompt · agent (Antigravity) · tekshirish — tayanchdagidek.
     **Ishlatilmaydi:** server (prozada; «proksi-server» faqat A-bo'limda), baza, panel, «sinov» (real odam yo'q), «band» va «qator» ro'yxat qismi ma'nosida, «sir» (T-021 — o'rniga «maxfiy kalit»).
6. **Metafora yo'q. Keyssiz** (tayanch 5: loyiha kuni). Real kompaniya va tashqi raqam yo'q. Raqamlar — Mentor misolidan (tayanch 1, aynan): A/B 42 → 12 · 40 → 17 · 82.
   Chegara sonlari (5 · 10 · 60) — Mentor misolidagi sozlama, statistika emas. Foiz 29 va 43 — hisob.
7. **Kod yozish — Antigravity (173.1).** Prompt — uch qator, har qator o'z yorlig'i bilan, oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» Texnologiya va kutubxona nomi promptda yo'q (P-060) — faqat repo'dagi nomlar.
   Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» Prompt sen-formada (T-002).
8. **Talab zinapoyasi (tayanch 9.2):** uch blokda ham uch qatorni o'quvchi yozadi, namuna «Yordam» ortida. Har blokning 5-qadami — **«O'z g'oyangiz»**: eng yaxshi loyihangiz uchun
   (o'zingiz tanlaysiz; ko'pincha o'tgan modulda boshlagan MVP — qaror 2). Mentor misoli — «Maydon». **Uyga vazifa yo'q** (P-058, tayanch 9.10).
9. **Toza yuza (D4):** tugma va variantlarda emoji yo'q; maketlar chizilgan, logotip yo'q; rang — holat foni (D3). Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1) · xulosa ≤110 ·
   hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon» (Mentor misoli, repo `maydon`) — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt.
  9-Modulda internetga chiqqan, 7-darsda HTTPS, `/health` va monitoring oldi; bugun prod ro'yxatidagi to'rt ish `prod` tarmog'ida bajariladi.
  O'quvchi blokda Mentor misolini repo'da quradi, 5-qadamda shu talabni o'z loyihasiga yozadi.
- **Hook:** Backend javob bermaganda o'yinchi saytda bitta qator ko'radi va nima qilishni bilmaydi → «internetdagi «Maydon»ga yana nima yetishmaydi?» → prod ro'yxati.
- **Ip (ot-shaklda):** So'rovlar chegarasi → Xato holatlari → A/B yakuni va README.
- **Bitta vizual — «Maydon» prod ro'yxati** (`PROD_ROYXAT` → `ProdRoyxat`, dars bo'yi, 163/180):
  - Karta sarlavhasi «Maydon · prod ro'yxati». Ostida ishlar uch guruhda: **bor** (yashil ✓, kulrang matn) · **bugun** (to'rt ish, oq; joriysi accent) · **keyin** (ikki ish, uzuq chiziqli chegara — U-041).
  - Karta yonida (bitta manbadan) **o'yinchi telefoni** (`MaydonTelefon`: «Maydon», «‹ Bugun ›», kataklar 16:00 … 21:00; xabar joyi kataklar ostida) va **Backend qutisi**
    (`POST /kirish` · `POST /bandlar` · `POST /hodisalar` — har biri ostida kichik hisoblagich «n / chegara»).
  - Holatlar: ish — kutmoqda (oq) → joriy (accent) → bajarildi (yashil ✓, bir lahza ajralib) · Backend qutisi: so'rov o'tdi (yashil) · `429` (qizil) · javob kechikmoqda (halqa-taymer) · javob yo'q (kulrang).
  - Ishlatilishi: 0 (telefon + xabar → karta ochiladi) · 1 (tayyor holat: bugungi to'rt ish ✓, «keyin» ochiq) · 2 (Backend qutisi + hisoblagichlar) · 4 (ikki telefon: hozir va prod) ·
    A1–A3 o'ng (kutilgan natija) · bloklar oxirida tegishli ish ✓ bo'ladi.
  - Namuna vaqt: bugun Shanba `2026-10-10` (9-Modul K2 shakli: sana), soat 18:20. `prefers-reduced-motion` da taymer va konvert harakatsiz, holatlar bir zumda almashadi.
- **Yakun:** «Maydon» prod ro'yxati bo'yicha yaxshilandi, o'zgarishlar `prod` tarmog'ida · keyingi dars — Pull Request va code review.

---

## 0 · Kirish — Backend javob bermasa  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Backend javob bermasa, o'yinchi saytda nimani ko'radi?** (54)
- Mentor: Tasavvur qiling: o'yinchi «Maydon»ni ochdi, Backend esa shu payt javob bermayapti. Uch javobdan bittasini tanlang.
- Maket (chap): `MaydonTelefon` — manzil `maydon-….netlify.app`, «Maydon», «‹ Bugun ›», kataklar joyi sokin skelet (uzuq chiziq). Backend qutisi kulrang, belgisi «javob yo'q».
- Savol: **Sizningcha, qaysi biri?**
  - Kataklar chiqadi, hammasi bo'sh ko'rinadi (41)
  - ✔ «Vaqtlarni yuklab bo'lmadi» degan bitta xabar (45)
  - Backend xatosi — kod va inglizcha matn (39)
- Javob — 2-variant: **Aynan!** Sayt bitta xabar yozadi, lekin qayta urinish tugmasi yo'q — o'yinchi nima qilishni bilmaydi. (104)
- Javob — 1-variant: **Qiziq fikr!** Kataklar Backend'dan keladi — javob bo'lmasa, ular chizilmaydi. Sayt bitta xabar yozadi. (104)
- Javob — 3-variant: **Qiziq fikr!** Sayt texnik matnni o'yinchiga ko'rsatmaydi — bitta xabar yozadi, lekin tugmasiz. (98)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → telefonda kataklar o'rniga qizil qator chiqadi: «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» → qator ostida bo'sh joy pulsatsiyalanadi
  (tugma yo'q) → yonda `ProdRoyxat` kartasi ochiladi: «bugun» guruhidagi «Xato va kutish holatlari» ishi accent bo'lib yonadi, qolgan uch ish oq, «bor» guruhi yashil.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook — haqiqiy o'yinchi tajribasi (P-016): hozirgi kod nima ko'rsatishi `dars-11-done` dan (`App.jsx` `xato` holati), taxmin emas. Uchala tanlov 39–45 belgi.
  «Prod ro'yxati» atamasi bu ekranda tug'ilmaydi — karta sarlavhasida ko'rinadi, ta'rifi 1-ekran Mentorida (T-011).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun prod ro'yxatidagi to'rt ishni bajarasiz.** (46)
- Mentor: Prod ro'yxati — internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati. Har amaliyot oxirida shu ishni eng yaxshi loyihangiz uchun ham yozasiz.
- Chap — «Dars oxirida»: `ProdRoyxat` **tayyor** holatda — «bugun» guruhidagi to'rt ish birin-ketin yashil ✓ bo'ladi (DE-200, bir marta); «keyin» guruhida ikki ish uzuq chiziqli qoladi:
  «Laptopdagi tekshiruvlar ham sanaladi» · «Database jadvallari kod bilan o'zi o'zgaradi (`synchronize`)» (GATE M M-q2 A). Karta ostida mono qator: `prod` tarmog'i · hali birlashtirilmagan.
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Backend bir manzildan kelgan ortiqcha so'rovni yozmaydi (47)
  - 02 · Backend kechiksa, sayt o'yinchiga kutishni aytadi (50)
  - 03 · A/B natijasi va README repo'da, `prod` tarmog'ida (49)
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `m10-dars-08-start` · namuna `m10-dars-08-done`
- Tugmalar: Orqaga · Boshlaymiz
✎ Mentorning birinchi gapi — prod ro'yxati ta'rifi (dars bo'yi so'zma-so'z; 08-FILTR 1). Sarlavha «tayyor» hukmini bermaydi (08-FILTR 2). App.jsx osti «eng yaxshi loyihangiz prod ro'yxati bo'yicha» (08-q0 A) — ikkinchi gapda «eng yaxshi loyihangiz» bilan (P-015).
  Qadamlarda chegara sonlari va «5 soniya» yo'q — ular 2- va 4-ekran kashfiyoti.

## 2 · Backend nechta so'rovni qabul qilsin?  ← QTushuncha
- Eyebrow: Tushuncha · so'rovlar chegarasi
- Sarlavha: **Backend bir daqiqada nechta so'rovni qabul qilsin?** (50)
- Mentor: Hozir Backend har so'rovni yozadi — ularni hech kim sanamaydi. Uch yo'lga so'rov yuborib, hisoblagichni kuzating.
- Bashorat (ballsiz, 181): **Uchala yo'lga bir xil son qo'yilsinmi?** · Ha, bitta son yetadi · Yo'q, har yo'lga o'zi — tanlov saqlanadi.
- Chap (harakat): uch tugma — «Ega kirishi» (`POST /kirish`) · «Band qilish» (`POST /bandlar`) · «Sahifani ochish» (`POST /hodisalar`). Ostida mono yorliq: «so'rov — bitta IP manzildan».
- O'ng (vizual): Backend qutisi, uch yo'l; har yo'l ostida hisoblagich «0 / 5» · «0 / 10» · «0 / 60» va «bir daqiqa» taymeri (to'la halqa). `ProdRoyxat` da «So'rovlar chegarasi» ishi accent.
- **Harakat → Vizual o'zgarish:**
  - Har bosish → konvert yo'lga yuradi → hisoblagich bittaga oshadi, yo'l yashil yonadi (yozildi).
  - «Ega kirishi» 6-marta bosilsa → konvert qizil to'siqqa uriladi → `429` qaytadi → telefon maketida xabar: «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.» → hisoblagich «5 / 5» qizil.
  - «Sahifani ochish» bir bosishda 10 ta konvert yuboradi (bir Wi-Fi'dagi telefonlar kabi) → hisoblagich «10 / 60», hammasi yashil.
  - Bir daqiqa taymeri tugaganda (namuna — 10 soniyaga qisqartirilgan, yorlig'i «bir daqiqa») hisoblagichlar nolga qaytadi, qizil yo'l yana yashil.
- Joriy qator (birinchi `429` dan keyin, bitta): `429` — «juda ko'p so'rov» javobi: Backend so'rovni yozmaydi. (66)
- Natija qatori: «Taxminingiz: … · haqiqatda: har yo'lga o'z soni — kirishga eng kami: u yerda parol va kod tekshiriladi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda har yo'lga o'z chegarasi bor: kirish — 5, band — 10, hodisa — 60. Ortig'iga `429`. (95)
- Qator (`QIzoh`, xulosadan keyin): Chegara odamni emas, IP manzilni sanaydi: bir Wi-Fi'dagi telefonlar bitta manzil bo'lib ko'rinishi mumkin. (106)
- Tugadi (199): harakat paneli yopiladi; Backend qutisi uch hisoblagich bilan butun enga, qizil `429` fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Uch yo'lni sinab ko'ring (N/3) → Davom etish
✎ Atama tartibi (T-011): Mentor avval hodisani aytadi («hech kim sanamaydi»), xulosa va A1 «so'rovlar chegarasi» deb nomlaydi. Chegara Backend'da — 9-Modul «Backend tekshiradi» qoidasining davomi.
  «Ha, bitta son yetadi» — ishonarli tanlov; javob uni harakat bilan rad etadi (kirish 6-da to'xtaydi, hodisa 10 da ham o'tadi).
- O'qituvchi eslatmasi: 5 · 10 · 60 — «Maydon» uchun tanlangan sozlama, «eng yaxshi chegara» emas. «Maydon»da ega bitta — kirishga sodda IP chegarasi yetadi;
  bir Wi-Fi'da bir nechta ega bo'lsa, ular bir-birini to'sishi mumkin — katta mahsulotda IP'ning o'zi yetmasligi mumkin.

## A1 · Amaliyot 1 — so'rovlar chegarasi  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · so'rovlar chegarasi
- Sarlavha: **Backend ortiqcha so'rovni yozmasdan, `429` qaytarsin.** (53)
- Mentor: Uch qatorni o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda `git checkout -b prod` — bugungi o'zgarishlar `prod` tarmog'ida yig'iladi.
     Tarmoq (branch) — repo'dagi alohida yo'l: o'zgarishlar `main` ga tegmasdan shu yerda yig'iladi. Keyin ikki terminal: `cd backend`, `npm run start:dev` · `cd web`, `npm run dev`.
  2. **Prompt** — uch qatorni yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab):
     > Qayerda: Backend'dagi `POST /kirish`, `POST /bandlar`, `POST /hodisalar`; saytda ega kirishi (`/ega`, `/dashboard`) va band formasi.
     > Nima qilsin: bitta IP manzildan bir daqiqada `POST /kirish` ga 5 tadan, `POST /bandlar` ga 10 tadan, `POST /hodisalar` ga 60 tadan ortiq so'rov kelsa, Backend uni yozmasin va `429` bilan
     > «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.» qaytarsin; chegara so'rov ishlovidan oldin tekshirilsin. Sayt `429` kelsa, shu matnni ko'rsatsin.
     > Render'da so'rov proksi orqali keladi — IP manzilni `CF-Connecting-IP` sarlavhasidan olsin, sarlavha bo'lmasa `req.ip` dan.
     (Proksi usuli — Yordam namunasidagi tayyor qism, o'quvchi o'zgartirmaydi. ✅ 06.10 QAROR 10M-58: `getTracker: (req) => req.headers['cf-connecting-ip'] ?? req.ip` — Render oldida Cloudflare (o'z tekshiruvim:
     `server: cloudflare`, `cf-ray`); Render'dagi haqiqiy sinovgacha (8-q3 A, foydalanuvchi) vaqtincha muzlatilgan — sinov boshqacha chiqsa faqat shu qator almashadi. TAYANCHGA SAVOL 12, REPO 2.)
     > Nima buzilmasin: boshqa yo'llar chegarasiz qolsin; `409` «Bu vaqt band», parol va 6 xonali kod tekshiruvi, hodisalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Antigravity o'zgargan fayllarni aytadi: ular `backend/` va `web/` ichida bo'lsin. Backend terminali o'zi qayta yukladi, xato yo'q.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — o'z saytingizda, laptopda:
     (1) `localhost:5173/ega` — noto'g'ri parol bilan «Kirish»ni 6 marta bosing: besh marta «Parol noto'g'ri», oltinchisida «Juda ko'p urinish…».
     (2) Bir daqiqa kuting — to'g'ri parol va kod bilan kirish yana ishlaydi.
     (3) `localhost:5173` da bitta bo'sh vaqtni band qiling — band odatdagidek saqlanadi.
     Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing va `git commit -m "so'rovlar chegarasi"`. Mos kelmagan qatorni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — eng yaxshi loyihangizni tanlang (ko'pincha o'tgan modulda boshlagan MVP). Unda qaysi yo'llar yozadi yoki parol tekshiradi? Shularga chegara talabini yozing.
     Loyiha nomi: … · Qayerda: … · Nima qilsin: … · Nima buzilmasin: … — «Bajardim» to'rttalasi yozilgach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon»: brauzer maketi `localhost:5173/ega` — «Maydon · ega», parol qatori, ostida qizil xabar «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.»;
  yonida Backend qutisi: `POST /kirish` «6 / 5» qizil `429` · `POST /bandlar` «1 / 10» yashil · `POST /hodisalar` yashil. `ProdRoyxat` da «So'rovlar chegarasi» ✓.
- Hammasi bajarilgach (yashil): Ortiqcha so'rovga Backend `429` beradi, odatdagi band esa saqlanadi. (68)
- Qator (`QIzoh`, natija ostida): Chegara laptopda tekshirildi; Render'dagi manzil sanog'i birlashtirilgandan keyin tekshiriladi. (95)
- O'qituvchi eslatmasi: proksi orqasidagi IP usuli — Yordam namunasida va mentor tegidagi README'da bir xil. Agent o'zicha boshqa usul tanlasa — namunadagisiga qaytaring.
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-08-start` (keyin `git checkout -b prod`; `.env` fayllaringiz o'zgarmaydi)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 4-qadam (1) — o'z ega sahifangiz, o'z parolingiz (tayanch 3 qoidasi ruhida: tekshiruv o'z saytingizda). 6 urinishdan keyin bir daqiqa kutish — chegaraning o'zi tekshiruvi.
  `POST /hodisalar` chegarasi (60) darsda alohida tekshirilmaydi — o'quvchi uni kodda va README da ko'radi (shubhali joylar).

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **`POST /kirish` ga daqiqada 5 ta chegara. Oltinchi so'rovga Backend nima qaytaradi?** (11 so'z)
  - `401` — parol noto'g'ri, qayta kiriting (39)
  - `409` — bu vaqt band, boshqasini tanlang (40)
  - ✔ `429` — ko'p so'rov keldi, kutib turing (39)
  - `400` — ism yozilmagan, formani to'ldiring (42)
- Kalit: **C** (index 2). To'rttalasi bir shaklda («kod — ma'no, harakat»); to'g'ri variant eng uzun emas (39; D — 42, A — 39, B — 40).
- To'g'ri izohi: Chegaradan oshgan so'rov tekshirilmaydi ham, yozilmaydi ham. (60)
- Xato izohlari (≤60):
  - A: `401` parol tekshirilganda chiqadi. Oltinchisi-chi? (51)
  - B: `409` band qilishda chiqadi — bu kirish yo'li. (49)
  - D: `400` ma'lumot xato bo'lganda chiqadi — so'rov soni-chi? (59)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Backend kechiksa, o'yinchi nimani ko'radi?  ← QTushuncha
- Eyebrow: Tushuncha · xato holatlari
- Sarlavha: **Backend kechiksa, o'yinchi nima qilishini biladimi?** (51)
- Mentor: Ikki telefon bir xil holatga tushadi: chapdagisi hozirgi sayt, o'ngdagisi — prod ro'yxati bo'yicha. Backend holatini tanlab, ikkalasini solishtiring.
- Bashorat (ballsiz, 181): **Backend 50 soniya kechiksa, hozirgi sayt nima qiladi?** · Xabar yozib, o'zi qayta so'raydi · «Yuklanmoqda…» deb turaveradi · Sahifani o'zi yangilaydi — tanlov saqlanadi.
- Chap (harakat): uch tugma — «Backend kechikmoqda (50 soniya)» · «Backend javob bermayapti» · «Juda ko'p urinish (`429`)».
- O'ng (vizual, solishtirish-sahnasi P-057): ikki `MaydonTelefon` yonma-yon — «Hozir» va «Prod»; ikkalasining ostida bir xil soat-taymer. `ProdRoyxat` da «Xato va kutish holatlari» ishi accent.
- **Harakat → Vizual o'zgarish:**
  - «Backend kechikmoqda» → taymer yuradi. «Hozir»: «Yuklanmoqda…» 50 soniya turadi, o'zgarmaydi. «Prod»: 5-soniyada «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.»
    va kichik halqa; 50-soniyada ikkalasida kataklar chiqadi (taymer namuna uchun tezlashtirilgan, yorlig'ida haqiqiy soniyalar).
  - «Backend javob bermayapti» → «Hozir»: darhol «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» — tugma yo'q, qizil ✗. «Prod»: «Vaqtlar yuklanmoqda…», har 5 soniyada konvert qayta ketadi;
    oldingisi qaytmaguncha yangisi ketmaydi; bir daqiqadan keyin «Vaqtlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi — yashil ✓.
  - «Juda ko'p urinish» (band formasida, ism va telefon yozilgan) → «Hozir»: «Band qilib bo'lmadi. Birozdan keyin urinib ko'ring.» — sabab aytilmaydi. «Prod»: «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.»,
    ism va telefon joyida qoladi — yashil ✓.
- Joriy qator (3/3 dan keyin, bitta): Kutishni yoki xatoni o'yinchiga aytish — kutish va xato holatlari. (66)
- Natija qatori: «Taxminingiz: … · haqiqatda: hozirgi sayt «Yuklanmoqda…» deb turaveradi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Prod saytda o'yinchi kutishni ham, xatoni ham ko'radi va keyin nima qilishni biladi. (82)
- Tugadi (199): harakat paneli yopiladi; ikki telefon butun enga, «Prod» ustunidagi uch ✓ fokusda; vizual ⛶ ichida.
- Tugma (pastki): Uch holatni tanlang (N/3) → Davom etish
✎ «Hozir» telefonidagi matnlar `dars-11-done` kodidan, so'zma-so'z (taxmin emas). «Backend kechikmoqda» — sahna sharti; Render uyg'onishida aynan nima bo'lishi bu yerda da'vo qilinmaydi (A-bo'lim 4).
  Sayt sababni aytmaydi (Render uyg'onyaptimi, tarmoq sekinmi — sayt bilmaydi) — shuning uchun holat nomi «kutish», «uyg'onmoqda» emas (08-FILTR 9).
  Bashorat variantlari — sayt xatti-harakatining uch darajasi; to'g'ri javob — o'rtadagi (S-015 — o'sish tartibi: o'zi hal qiladi → kutadi → o'yinchiga tashlaydi; ballsiz).

## A2 · Amaliyot 2 — xato va kutish holatlari  ← amaliyot bloki (≈18 daq)
- Eyebrow: Amaliyot 2 · xato holatlari
- Sarlavha: **Backend kechiksa, sayt o'yinchiga kutishni aytsin.** (50)
- Mentor: Uch qatorni o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti, siz `prod` tarmog'idasiz (`git branch` — `* prod`). `localhost:5173` da kataklar chiqadi.
  2. **Prompt** — uch qatorni yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab):
     > Qayerda: o'yinchi sahifasi (`web/`) — kataklarni yuklash (`GET /vaqtlar`) va band formasi (`POST /bandlar`).
     > Nima qilsin: javob 5 soniyada kelmasa yoki so'rov o'tmasa, «Yuklanmoqda…» o'rniga «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» chiqsin. So'rov o'tmasa — 5 soniyadan keyin qayta so'rasin;
     > oldingi so'rov tugamasdan yangisi ketmasin. Bir daqiqadan keyin ham bo'lmasa — «Vaqtlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi. Band formasi xato bersa, yozilgan ism va telefon o'chmasin.
     > Nima buzilmasin: kataklar, band qilish, «Bu vaqt band» va «Juda ko'p urinish» xabarlari, hodisalar va animatsiyalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — bu tekshiruvda Backend umuman javob bermaydi; kechikish holatini 4-ekran sahnasida ko'rdingiz. Backend terminalida Ctrl+C bosing (Backend to'xtaydi) va `localhost:5173` ni yangilang:
     (1) «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» chiqadi.
     (2) Shu daqiqa ichida Backend'ni qayta yoqing: `npm run start:dev` — sahifani yangilamasangiz ham kataklar o'zi chiqadi.
     (3) Backend'ni yana to'xtating, sahifani yangilang va bir daqiqa kuting — «Vaqtlarni yuklab bo'lmadi» va «Qayta urinish». Backend'ni yoqib, tugmani bosing — kataklar chiqadi.
     Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing va `git commit -m "xato holatlari"`. Mos kelmasa — ko'rganingizni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — loyihangizda Backend kechiksa, foydalanuvchi nimani ko'radi? U nima qilishni bilishi uchun talab yozing. Uch qatorni to'ldiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon»: ikki telefon kadri — 1) «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» va halqa · 2) «Vaqtlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi;
  yonida terminal maketi: `^C` · `npm run start:dev` · «Nest application successfully started». `ProdRoyxat` da «Xato va kutish holatlari» ✓.
- Hammasi bajarilgach (yashil): Backend to'xtasa, o'yinchi kutishni, keyin «Qayta urinish»ni ko'radi. (69)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-08-done` (keyin `git checkout -b prod`)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Tekshiruv Backend'ni o'zingiz to'xtatib qilinadi — Windows, macOS va Linux'da bir xil (Ctrl+C). Bu «javob yo'q» holati; sekin javob (5 soniyadan uzoq) amaliyotda tekshirilmaydi — 4-ekran sahnasi (08-FILTR 7).
  O'qituvchi eslatmasi: sekin javobni ko'rsatmoqchi bo'lsangiz — brauzer dasturchi oynasida tarmoqni sekinlashtirish mumkin (ixtiyoriy, o'quvchi qadami emas).
  Terminaldagi «Nest application successfully started» — NestJS ishga tushish yozuvi (versiyaga qarab biroz farq qilishi mumkin — shubhali joylar).

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Backend javob bermayapti. Prod ro'yxatiga mos sayt nima qiladi?** (9 so'z)
  - ✔ Kutishni aytadi va o'zi qayta so'raydi (38)
  - «Failed to fetch» xatosini ko'rsatadi (37)
  - Hamma kataklarni bo'sh qilib chizadi (36)
  - Sahifani har soniyada qayta yuklab turadi (41)
- Kalit: **A** (index 0). To'rttalasi bir shaklda (sayt nima qiladi — fe'l bilan); to'g'ri variant eng uzun emas (38; D — 41, B — 37, C — 36). «qayta» A va D da (S-003).
- To'g'ri izohi: O'yinchi holatni biladi, sayt esa o'zi qayta urinadi. (53)
- Xato izohlari (≤60):
  - B: Texnik matn o'yinchiga nima qilishni aytadimi? (49)
  - C: Bo'sh kataklarni bosgan o'yinchi band qila oladimi? (54)
  - D: Har soniyalik yuklash Backend'ga ortiqcha so'rov yuboradi. (58)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## A3 · Amaliyot 3 — A/B yakuni va README  ← amaliyot bloki (≈22 daq)
- Eyebrow: Amaliyot 3 · A/B yakuni va README
- Sarlavha: **A/B sonlarini sanab, qarorni README ga yozing.** (46)
- Mentor: B ishga tushgandan beri sonlarni Neon'da o'zingiz sanaysiz, qaror va README talabini ham o'zingiz yozasiz. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish — sonlar** — Neon'dagi SQL Editor'da (dashboard faqat bugunni ko'rsatadi) — «Nusxalash»:
     ```sql
     SELECT variant,
            COUNT(DISTINCT brauzer_id) FILTER (WHERE nom = 'vaqt-tanladi') AS tanladi,
            COUNT(DISTINCT brauzer_id) FILTER (WHERE nom = 'band-qildi')  AS band_qildi
     FROM hodisalar
     WHERE variant IS NOT NULL AND brauzer_id <> 'tekshiruv'
     GROUP BY variant
     ORDER BY variant;
     ```
     Ikki qator chiqadi: har variantda vaqtni tanlagan va band qilgan turli brauzerlar soni — B ishga tushgandan beri. Foizni hisoblang: band qildi / tanladi.
     Laptopdagi tekshiruvlaringiz ham shu sonlarda bor — bu prod ro'yxatidagi «keyin» ishi.
  2. **Prompt** — uch qatorni yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab):
     > Qayerda: o'yinchi sahifasidagi tugma matni va variant tanlash, `/dashboard` dagi A/B qismi (`web/`), `README.md`.
     > Nima qilsin: hamma o'yinchiga B matni chiqsin («18:00 ni band qilish»); variant endi tanlanmasin, yangi hodisalarga `variant` qo'shilmasin. Dashboard'da A va B o'rniga bitta foiz:
     > bugun vaqtni tanlaganlardan band qilganlar. README ni to'ldir: ishga tushirish, `.env` nomlari (qiymatsiz), so'rovlar chegarasi, xato holatlari, A/B natijasi va qaror (foiz — shu oqimda vaqt tanlaganlardan band qilganlar),
     > prod ro'yxati — qilingan va qolgan ishlar.
     > Nima buzilmasin: `hodisalar` jadvali va eski `variant` qiymatlari, Backend yo'llari, chegara va xato holatlari. Maxfiy kalitlarning qiymati README ga yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sayt o'zi yangilandi, xato yo'q. Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing, `git commit -m "A/B yakuni va README"`, `git push -u origin prod`.
     Bizning sozlamada Render va Netlify `main` dan oladi — internetdagi sayt o'zgarmaydi, `prod` hali birlashtirilmagan. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — (1) inkognito oynada `localhost:5173` — bo'sh katakni bosing: tugmada «… ni band qilish», soat bilan. (2) `localhost:5173/dashboard` — bitta foiz, A va B yo'q.
     (3) GitHub'da repo'ngiz → `prod` tarmog'i → `README.md`: oltita qism bor, `.env` qiymatlari yo'q — faqat nomlari.
  5. **O'z g'oyangiz** — loyihangizning prod ro'yxatini yozing: bugungi uch ish, audit natijangizdan qolgan ishlar va 4-darsdagi gipotezangiz natijasi. Uni README talabiga qo'shing.
     Ochiq turadi (`pm-m8d6-audit` bo'lsa): audit varag'ingizdan holati «tuzatish kerak» bo'lgan savollar — ro'yxatga o'zi qo'yiladi. Gipoteza (`pm-m8d4-gipoteza` bo'lsa): «Agar {agar}, {ozgaradi}, chunki {chunki}» — natijasini yozasiz.
     Saqlangan natija yo'q bo'lsa — o'zingiz yozasiz (erkin qator).
- O'ng tomon — «kutilgan natija · namuna: Maydon»:
  - Neon · SQL Editor → `variant · tanladi · band_qildi`: `A · 42 · 12` · `B · 40 · 17`
  - Ostida hisob: A — vaqt tanlagan 42 brauzerdan 12 tasi band qildi, taxminan 29 foiz · B — 40 tadan 17 tasi, taxminan 43 foiz.
  - Mentor qatori (`QIzoh`): Hozircha B qoladi. Farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz.
  - Ostida kulrang: Bu mahsulot qarori — B yaxshiroq ekanini isbotlamaydi.
  - GitHub fayl-karta `README.md` (`prod` tarmog'i) — qism sarlavhalari: Ishga tushirish · Maxfiy kalitlar (`.env`) · So'rovlar chegarasi · Xato holatlari · A/B natijasi · Prod ro'yxati.
  - `ProdRoyxat`: «A/B yakuni» va «README — olti qism» ✓; «keyin» guruhida ikki ish uzuq chiziqli qoladi: «Laptopdagi tekshiruvlar ham sanaladi» · «Database jadvallari kod bilan o'zi o'zgaradi (`synchronize`)».
  - Qator (`QIzoh`, ro'yxat ostida; M-q2 A): Hozir jadval kodga qarab o'zi o'zgaradi. Shuning uchun eski tegdagi kodni prodga yubormaysiz — yangi ustun o'chib ketishi mumkin. (117)
- Hammasi bajarilgach (yashil): Hozircha B qoldi, raqam kuzatiladi; README'da olti qism, hammasi `prod` tarmog'ida. (81)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-08-done` (keyin `git checkout -b prod`; Neon'dagi sonlaringiz o'zingizniki)
- Nishon (bonus): Prod Builder — oxirgi «Bajardim»da (5-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ GATE M M-q2 A: `synchronize: true` — prod'da xavfli (TypeORM hujjati: prod uchun migratsiya); 9-Moduldan beri repo'da yoqilgan. Bu darsda kod o'zgarmaydi — faqat «keyin» ishi va bitta qator:
  Render eski kodni ishga tushirsa (masalan eski teg push qilinsa), TypeORM entity'da yo'q ustunni (`variant`) ma'lumoti bilan o'chirishi mumkin. Migratsiya — keyingi modullarda.
✎ SQL tayyor beriladi (nusxa) — bugungi ko'nikma talab va qaror, SQL emas (1-dars SQL'idan bir qadam katta: `FILTER`, `GROUP BY`). «82 ta brauzer» — Mentor gapi aynan (tayanch 1); sanoq birligi ostidagi hisobda — brauzer (42 + 40).
  O'quvchining Neon sonlari Mentornikidan boshqacha — o'z saytining hodisalari (sinfdoshlar 4-darsda, real odamlar uyda).

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — So'rovlar chegarasi» · 5 — «2 — Xato holatlari».

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- ✎ SABOQ 12 (9-Modul F-1005-88, foydalanuvchining qat'iy qoidasi 05.10): kartochkalar yakun ichida emas — alohida ekran. Tartib: … → podium → **kartochkalar** → yakun.
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16).
- Kartochkalar — 12 ta, matn o'zgarmagan (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 7 · Yakun — keyingi dars  ← QYakun (172; kartochkalar — oldingi alohida ekranda)
- Eyebrow: Yakun · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **«Maydon» prod ro'yxati bo'yicha yaxshilandi.** (44)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (4):
  - Prod ro'yxati — internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati.
  - Bu misolda har yo'lga o'z chegarasi bor, ortiqcha so'rovga Backend `429` qaytaradi.
  - Backend kechiksa, sayt o'yinchiga kutishni aytadi va o'zi qayta so'raydi — ustma-ust emas.
  - Bu A/B da farq bor, lekin 82 ta brauzer xulosa uchun hali kam: hozircha B qoladi, raqam kuzatiladi.
- Uyga vazifa — yo'q (P-058, tayanch 9.10: ish repo'da; loyihangiz har blokning 5-qadamidagi talablar bilan davom etadi — ekranda alohida blok yo'q).
- Keyingi dars — «Loyiha kuni: prodga ko'tarish — 2-qism»: `prod` tarmog'ini Pull Request bilan ko'rsatasiz, sinfdosh kodni o'qib izoh yozadi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Rate Guard** — Ortiqcha so'rovga Backend javobini topdingiz (3-ekran, 1-savol)
- **Clear Status** — Backend kechikkanda sayt nima qilishini tanladingiz (5-ekran, 2-savol)
- **Prod Builder** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «Har yo'lga o'z chegarasi»
   - `POST /kirish · 5` · Kirish — Bir daqiqada bir manzildan 5 ta so'rov, oltinchisi yozilmaydi.
   - `429` · Juda ko'p so'rov — Backend so'rovni tekshirmaydi ham, yozmaydi ham.
   - `POST /hodisalar · 60` · Hodisalar — Har ochish va bosish hodisa, shuning uchun chegara kengroq.
   - Sinfga savol: Nega uchala yo'lga bir xil son qo'yilmadi?
2. 2-savol (5-ekran) — «Kutishni aytadi, o'zi qayta so'raydi»
   - `5 s` · Kutish — Javob 5 soniyada kelmasa, sayt kutishni aytadi.
   - `5 s` · Qayta so'rash — So'rov o'tmasa, sayt o'zi qayta urinadi — oldingisi tugagach.
   - `Qayta urinish` · Tugma — Bir daqiqadan keyin ham bo'lmasa, o'yinchi o'zi bosadi.
   - Sinfga savol: «Yuklanmoqda…» deb turaveradigan sayt o'yinchiga nimani aytmaydi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Prod ro'yxati nima? | Internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati | «Maydon» da bugun — to'rt ish |
| So'rovlar chegarasi nima? | Bir IP manzildan bir daqiqada nechta so'rov qabul qilinishi | Inglizcha — rate limit |
| Chegaradan oshgan so'rovga Backend nima qaytaradi? | `429` — juda ko'p so'rov | So'rov yozilmaydi |
| «Maydon» da kirish chegarasi nega eng qattiq? | Bu yo'lda parol va kod tekshiriladi | Kirish — 5, band — 10, hodisa — 60 |
| Chegara nega Backend'da qo'yiladi? | Hamma so'rov Backend'dan o'tadi | Band tekshiruvi kabi — Backend tekshiradi |
| Chegara nimani sanaydi — odamnimi, manzilnimi? | IP manzilni | Bir Wi-Fi'dagi telefonlar bitta manzil bo'lib ko'rinishi mumkin |
| Kutish holatida o'yinchi nimani ko'radi? | Kutishni aytadigan xabarni | So'rov o'tmasa, sayt qayta so'raydi — ustma-ust emas |
| Bir daqiqadan keyin ham javob bo'lmasa-chi? | «Qayta urinish» tugmasi chiqadi | O'yinchi keyin nima qilishni biladi |
| Band formasi xato bersa, ism va telefon nima bo'ladi? | Joyida qoladi | O'yinchi qayta yozmaydi |
| A/B natijasi bu misolda qanday? | A ≈ 29 foiz, B ≈ 43 foiz | Vaqt tanlagan 42 va 40 brauzer |
| Nega B qolsa ham «xulosa» deyilmaydi? | 82 ta brauzer hali kam | Hozircha B qoladi — mahsulot qarori, isbot emas |
| O'zgarishlar nega `prod` tarmog'ida turadi? | `main` ga tegmasdan yig'ilishi uchun | Bizning sozlamada internetdagi sayt `main` dan yangilanadi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3
1. Prod ro'yxati nima? ✔ Loyihani ishonchliroq qiladigan ishlar ro'yxati · MVP'ga keyinroq qo'shiladigan funksiyalar ro'yxati · Saytdagi hamma sahifalar manzilining ro'yxati · Bugun maydonda band qilingan vaqtlar ro'yxati
2. So'rovlar chegarasi nimani sanaydi? Bugun saytga kirgan hamma odamlar sonini · ✔ Bir manzildan bir daqiqadagi so'rovlarni · Database'dagi barcha jadvallar qatorlarini · Har o'yinchining band qilgan vaqtlarini
3. Chegaradan oshgan so'rovga Backend nima qaytaradi? `401` — parol noto'g'ri, qayta kiriting · `409` — bu vaqt band, boshqasini tanlang · ✔ `429` — ko'p so'rov keldi, kutib turing · `400` — ism yozilmagan, formani to'ldiring
4. Chegara nega saytda emas, Backend'da qo'yiladi? Sayt kodi Backend'dan sekinroq ishlaydi · Saytda chegara uchun joy qolmagan · Backend kodini o'quvchi o'zgartira olmaydi · ✔ Hamma so'rov Backend'dan o'tadi
5. «Maydon» da qaysi yo'lga eng qattiq chegara? ✔ `POST /kirish` — parol va kod tekshiriladi · `POST /hodisalar` — hodisa ko'p yuboriladi · `GET /vaqtlar` — kataklar ko'p so'raladi · `POST /bandlar` — band ko'p qilinadi
6. Bir Wi-Fi'dagi o'nta telefon Backend'ga qanday ko'rinishi mumkin? Har biri o'z brauzer ID si bilan · ✔ Bitta IP manzildan kelgandek · Har biri alohida Render orqali · Netlify saytining manzilidan
7. Backend 50 soniya kechiksa, prod sayt nima qiladi? «Yuklanmoqda…» deb jim turaveradi · Kataklarni hammasini bo'sh chizadi · ✔ Kutishni aytib, o'zi qayta so'raydi · Sahifani har soniyada qayta yangilab turadi
8. Bir daqiqadan keyin ham javob bo'lmasa, nima chiqadi? Backend xatosining to'liq matni · Bo'sh oq sahifa, hech qanday yozuv · «Band qilindi» belgisi, kataklarsiz · ✔ Xabar va «Qayta urinish» tugmasi
9. `429` kelsa, band formasidagi ism va telefon-chi? ✔ Joyida qoladi, qayta yozish shart emas · O'chadi, o'yinchi ikkalasini qayta yozadi · Egaga yuboriladi, band baribir saqlanadi · Ertangi kunning formasiga ko'chiriladi
10. A — 42 tadan 12, B — 40 tadan 17. Qaysi biri qoladi? A — vaqt tanlaganlar ko'proq · ✔ B — band qilganlar foizi kattaroq · A — hozirgi variant, o'zgartirmaymiz · B — yangi tugma chiroyliroq ko'rinadi
11. Nega «B aniq yaxshi» deb xulosa qilinmaydi? Foiz A da kattaroq chiqdi · Dashboard faqat bugunni ko'rsatadi · ✔ 82 ta brauzer xulosa uchun hali kam · SQL sonlari noto'g'ri sanaldi
12. «Maydon» sozlamasida `prod` push qilindi. Internetdagi sayt-chi? Bir necha daqiqada `prod` holatiga o'tadi · Render uxlab qoladi, sayt ochilmaydi · Netlify `prod` ni alohida manzilda chiqaradi · ✔ O'zgarmaydi — u `main` dan yangilanadi

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik (python): to'g'ri variant hech bir savolda yolg'iz eng uzun emas (1, 3, 5-savolda boshqa variant bilan teng yoki undan qisqa); 10-savolda «A —» 2 · «B —» 2 (ikki shakl teng);
05.10 asosiy seans: 10-savol D va 12-savol A dagi mutlaq so'zlar («har doim», «Darrov») olindi — mutlaq so'z faqat noto'g'ri variantda turib, javobni sezdirardi (S-003).
3- va 5-savolda kod belgisi to'rttala variantda. Savollar ≤12 so'z.
Fon so'zlari (R-008, kodda {uz, ru}): prod · prod ro'yxati · chegara · `429` · IP manzil · `POST /kirish` · kutish · Qayta urinish · A/B · foiz · README · `prod` tarmog'i · Maydon

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **0 (A)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`PROD_ROYXAT` + `ProdRoyxat`** — bitta manba (180): `{ bor: [3 ish], bugun: [4 ish], keyin: [2 ish] }`, har ish `{ id, t, holat }`; proplar: `joriy` (ish id), `bajarildi` (id ro'yxati).
   0, 1, 2, 4-ekran va A1–A3 o'ng tomoni shundan o'qiydi. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4).
3. **`MaydonTelefon`** (soatlar 9-Modul `MAYDON_KATAKLAR` bilan bir xil; xabar joyi; `holat`: kataklar · yuklanmoqda · kutish · xato+tugma · 429) va **`BackendQuti`** (uch `POST` yo'l, hisoblagich «n / chegara», `429` holati) —
   03 dagi shu nomli komponentlar bo'lsa, o'shalardan (bitta manba).
4. 0-ekran `QKirish` (maket = telefon + kulrang Backend; javobdan keyin `ProdRoyxat` ochiladi).
   2-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, uch tugma → konvert + hisoblagich, «Ega kirishi» 6-da `429`; bir daqiqalik oyna namunada 10 soniyaga qisqartirilgan (yorlig'i «bir daqiqa»); holat bosishlardan chiziladi (P-046); `zoom`, `tugadi`.
   4-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, uch holat tugmasi → ikki telefon («Hozir» matnlari `dars-11-done` dan so'zma-so'z), tezlashtirilgan taymer; `zoom`, `tugadi`.
5. 3 va 5-ekran `QTest` — matn yuqoridagidek; xato izohlari ≤60, to'g'ri izoh ≤60.
6. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (9-Modul `MvpFirstScreenLesson.jsx` naqshi: `GoyaForma`, `yordam`, `forma: true`, `XATO_YOLI`, `A3_JOY`). Har blok **5 qadam**, uchalasida uch joy `{qayerda}`, `{nima qilsin}`, `{nima buzilmasin}`.
   - A1 5-qadam formasi — to'rt maydon (Loyiha nomi + uch qator). A3 1-qadamda SQL «Nusxalash» bilan (QPrompt ikkinchi nusxasi yoki kod-karta).
   - A3 5-qadam: `pm-m8d6-audit` (`{ savollar: [{ savol, holat }] }`) dan holati `tuzatish kerak` bo'lgan savollar va `pm-m8d4-gipoteza` (`agar`, `ozgaradi`, `chunki`) o'qiladi; yo'q bo'lsa erkin qator (tayanch 8, M-q5).
   - O'ng: A1 — `/ega` maketi + `BackendQuti` `429` bilan; A2 — ikki telefon kadri + terminal maketi; A3 — SQL jadval-karta + hisob + Mentor `QIzoh` + README fayl-karta.
   - `ortda`: A1 = `m10-dars-08-start`, A2/A3 = `m10-dars-08-done` (`ORTDA_FETCH`); ortda qatorida «keyin `git checkout -b prod`».
7. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Rate Guard, 5-ekran → Clear Status, A3 oxirgi «Bajardim» → Prod Builder («Prod Ready» — «tayyor» hukmi edi, 08-FILTR 2).
8. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; SABOQ 12, 16). 7-ekran `QYakun`: `uyga` yo'q, `recap` 4 qator, `keyingi` matni yuqoridagidek.
9. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
10. `LESSON_META.lessonId` — `m8-08-v1`, `lessonTitle` — «Loyiha kuni: prodga ko'tarish — 1-qism». App.jsx `m8-08` qatoriga `comp` — «qur» bosqichida (asosiy seans).
11. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/1366 · surat (1280 + 393).

## REPO — `maydon` ga qo'shiladigan narsalar (`m10-dars-08-start` → `m10-dars-08-done`; yozish — «qur» da, 9-Modul repo'si yopilgandan keyin, qaror 3)
1. **`m10-dars-08-start`** = `m10-dars-07-done` (tayanch 3 naqshi).
2. **`m10-dars-08-done`** = start + A1–A3 namunasi («Maydon»), `prod` tarmog'ining holati (`yechim` tarmog'idagi teg shu holatni ko'rsatadi):
   - `backend/`: so'rovlar chegarasi — `POST /kirish` 5/daq · `POST /bandlar` 10/daq · `POST /hodisalar` 60/daq, IP bo'yicha, xotirada; oshsa `429` + «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.»
     **«Qur» dan oldin asosiy seans muzlatadi (08-FILTR 5; 5-dars TOTP naqshi — agent tanlamaydi):** chegara mexanizmi (masalan `@nestjs/throttler` yoki o'z guard — rasmiy hujjatdan, NestJS 12 bilan mosligi) ·
     ✅ **06.10 QAROR 10M-58 (F-1005-173):** chegara — `@nestjs/throttler` 6.7.1 (Nest 12 peer): `ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 60 }], errorMessage: "Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.", getTracker })`, uch yo'lga `@UseGuards(ThrottlerGuard)` + `@Throttle({ default: { limit: N, ttl: 60_000 } })`; sinov (NestJS 12.1.2): 5 → `429` + shu matn, boshqa yo'llar chegarasiz. IP — yuqoridagi `CF-Connecting-IP ?? req.ip`.
     oyna — qat'iy bir daqiqalik, oyna tugagach noldan · tekshiruv so'rov ishlovidan oldin (oshgan so'rov yozilmaydi) · `429` tanasi — `{ statusCode: 429, message: "Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring." }` (`@nestjs/throttler` `errorMessage`; 05.10 sinovida aynan shunday) — sayt `message` ni ko'rsatadi ✎ (06.10, F-1005-183) ·
     Render proksi orqasida IP olish usuli — Render'da o'z xizmatida haqiqiy so'rov bilan tekshiriladi (soxta `X-Forwarded-For` bilan ham — forum: Render mijoz qiymatini tozalamaydi), usul kodda va README «So'rovlar chegarasi» qismida.
     Boshqa yo'llar (`GET /vaqtlar`, `GET /bandlar`, `GET /hodisalar/sanoq`, `GET /health`) chegarasiz — UptimeRobot `/health` ni so'rab turadi.
   - `web/`: o'yinchi sahifasi — 5 s kechikish yoki xatoda «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.», so'rov o'tmasa 5 s dan keyin qayta so'rov (oldingisi tugamasdan yangisi yo'q), 60 s dan keyin «Vaqtlarni yuklab bo'lmadi» + «Qayta urinish»;
     band formasi — `429` va boshqa xatoda Backend matni (yoki umumiy matn), ism va telefon saqlanadi; `/ega` va `/dashboard` kirishida `429` matni.
     A/B yakuni: tugma hammaga B («{soat} ni band qilish»); variant tanlanmaydi, `hodisaYoz` `variant` yubormaydi; `maydon-variant` o'qilmaydi; dashboard'da bitta foiz (band-qildi / vaqt-tanladi, bugun).
   - `README.md` — oltita qism: Ishga tushirish · Maxfiy kalitlar (`.env` nomlari, qiymatsiz) · So'rovlar chegarasi (uch yo'l, son, `429`, IP manzil sanaladi — bir Wi-Fi bitta manzil bo'lishi mumkin, proksi usuli) · Xato holatlari ·
     A/B natijasi (SQL, A 42/12, B 40/17; foiz — shu oqimda vaqt tanlaganlardan band qilganlar; qaror: hozircha B qoladi, kuzatiladi — isbot emas) ·
     Prod ro'yxati (bor / bugun / keyin: «Laptopdagi tekshiruvlar ham sanaladi — tekshiruvni boshqa kunda qilish yoki tekshiruv yozuvlarini ajratish»). 3- va 7-darsdagi «Darslar va teglar», «Xatolar», «Monitoring» qismlari saqlanadi.
3. **`prod` tarmog'i** `main` ga birlashtirilmagan — 9-dars Pull Request uchun (tayanch 3). Render/Netlify `main` dan deploy qiladi.
4. **Shart:** teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida); `m10-dars-08-done` dagi `prod` holati 9-dars PR boshlanishi bilan mos bo'lishi kerak.
5. **Ataylab qoldiriladigan narsa:** Backend sanoq javobidagi `variantlar` maydoni (4-dars) olib tashlanmaydi — dashboard uni endi ishlatmaydi (TAYANCHGA SAVOL 4: 9-dars review topadigan bitta tuzatish shu bo'lsinmi?).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Chegara sonlari** — `POST /kirish` 5 · `POST /bandlar` 10 · `POST /hodisalar` 60, bir daqiqada, bitta IP manzil bo'yicha. Tayanchda faqat yo'llar bor. Sonlar — Mentor misolidagi sozlama (statistika emas); 9-dars va README bilan bir xil bo'lishi kerak.
2. ✅ **(08-FILTR 9)** **Saytdagi matn** — o'yinchiga «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.»; darsdagi holat nomi — «kutish holati» («Backend uyg'onmoqda» sababni taxmin qilardi).
3. **Kutish holati qoidasi** — 5 s kechikish → xabar; so'rov o'tmasa 5 s dan keyin qayta (ustma-ust emas) → 60 s dan keyin «Qayta urinish». Tayanchda tafsilot yo'q. 60 s — Render uyg'onishi (≈ bir daqiqa, tayanch 6) ga moslab.
4. **«B qoladi» kodda** — variant tanlash olinadi, yangi hodisalarga `variant` yozilmaydi, dashboard'da bitta foiz; Backend'dagi `variantlar` maydoni qoldiriladi. Tayanchda faqat «B qoladi». 9-dars review shu qoldiqni topsinmi?
5. **`prod` tarmog'i — yangi atama** (oldingi darslarda «branch/tarmoq» grep: 0). A1 1-qadamda bir gaplik ta'rif bilan kiritildi. 9-dars (Pull Request) ham shu so'zni ishlatishi kerak.
6. **README qismlari** — oltita nom (Ishga tushirish · Maxfiy kalitlar · So'rovlar chegarasi · Xato holatlari · A/B natijasi · Prod ro'yxati) — «Maydon» uchun kurs mezoni («README — olti qism»; «to'liq» deyilmaydi, 08-FILTR); 9-dars reviewer'i shu ro'yxatga tayanadi.
7. **2–7-darslar xato matnlariga tegmaydimi** — «Hozir» telefonidagi matnlar `dars-11-done` dan. Agar 2–7-darsda ular o'zgarsa, 0 va 4-ekran matni moslanadi.
8. ✅ **(08-FILTR 3)** **A/B SQL davri** — `variant IS NOT NULL` = B ishga tushgandan beri (A va B bir vaqtda boshlangan — tajriba davri); matnda «bir haftalik» olib tashlandi, sana chegarasi qo'shilmadi.
9. **`pm-m8d6-audit` holat qiymati** — hal bo'ldi (06-FILTR 11): `{ savollar: [{ savol, holat }] }`, holat `joyida` · `tuzatish kerak` · `tuzatildi`; A3 5-qadam `tuzatish kerak` ni oladi.
10. **«Eng yaxshi loyiha» tanlovi** — A1 5-qadam formasiga «Loyiha nomi» maydoni qo'shildi; yangi saqlanadigan kalit yaratmadim (A3 5-qadam shu nomni ekranda ko'rsatadi, xolos). Kalit kerakmi (masalan 9-dars uchun)?
11. **Chegara Render'da tekshirilmaydi** — `prod` deploy qilinmagani uchun; proksi orqasidagi manzil (A1 talabidagi oxirgi gap) 9-darsda, birlashtirilgandan keyin tekshirilishi kerak.
12. **Proksi orqasida IP olish usuli** — rasmiy Render hujjatida yo'q (shubhali joylar). Asosiy seans «qur» dan oldin o'z Render xizmatida tekshirib muzlatadi; A1 Yordam namunasidagi `{proksi usuli}` va README shu matn bilan to'ldiriladi.

## Shubhali joylar (ishonchim to'liq emas)
- **Render va `X-Forwarded-For`:** mijoz manzili sarlavhada kelishi Render jamoatchilik forumi va fikr-sahifasidan (feedback.render.com), rasmiy hujjatda topilmadi; forum: Render mijoz yuborgan qiymatni tozalamaydi.
  Shuning uchun usul agentga qoldirilmaydi — asosiy seans «qur» dan oldin Render'da tekshirib muzlatadi (REPO 2); o'quvchi talabi README'dagi usulga ishora qiladi.
- **Render uyg'onishi paytidagi javob:** render.com/docs/free — «Render displays a loading page to connecting browsers while a service is spinning up». Saytdan yuborilgan so'rovga (fetch) aynan nima qaytishi yozilmagan
  (kechikadimi yoki CORS'siz sahifa qaytib, so'rov o'tmaydimi). Talab ikkala holatni qamraydi; darsda Render xatti-harakati da'vo qilinmaydi.
- **Bir Wi-Fi — bitta manzil:** NAT ortidagi telefonlar Backend'ga bitta tashqi manzildan kelgandek ko'rinishi «mumkin» deb yozildi (kartochka va 2-ekran) — umumiy tarmoq bilimi, manbasi darsda keltirilmagan.
- **`POST /hodisalar` chegarasi (60) darsda tekshirilmaydi** — tekshiruv uchun ko'p so'rov yuborish kerak bo'ladi; o'quvchi uni README va agent aytgan fayllardan ko'radi.
- **«Nest application successfully started»** — NestJS ishga tushish yozuvi; NestJS 12 da so'zma-so'z shundayligi tekshirilmagan.
- **Netlify branch deploy** — docs.netlify.com: boshqa tarmoqlar uchun sukut bo'yicha o'chiq; o'quvchi 9-Modulda o'zi yoqmagan deb oldim. Render — «linked branch» (9-Modulda `main`).
- **SQL `FILTER (WHERE …)`** — PostgreSQL sintaksisi (Neon — PostgreSQL); o'quvchiga yangi, shuning uchun tayyor beriladi.
- **«82 ta brauzer»** — Mentor gapi aynan berilgan; modulda sanoq birligi brauzer (tayanch 2). Hisob qatorida «brauzer» deb yozdim, Mentor qatori o'zgarmadi.
- **Arena 10-savol D varianti** («yangisi har doim yaxshi») va 12-savol A varianti («Darrov») — kafolat so'zlari ataylab distraktorda (rad etiladigan tasavvur); lint ogohlantirsa, so'z almashtiriladi.

---

## Qurilish (06.10.2026, F-1005-183) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- 2, 4-ekran va A1/A2 o'ng tomoni: to'liq prod kartasi o'rniga bir qatorli `ProdChip` (SABOQ 24/26). A3 o'ng tomoni uch kadr (Sonlar · README · Prod ro'yxati), qadamga ergashadi.
- **MD ichki ziddiyati:** A1 o'ngida `POST /kirish` «6 / 5» ↔ 2-ekranda «5 / 5» — kodda ikkalasi «5 / 5»; `POST /hodisalar` «3 / 60» (son MD da yo'q edi). MD ga taklif: bir xil qilish.
- A2 4-qadam: «4-ekran sahnasida» → «ikki telefonli sahnada» (ekran hisobi 06/12 — chalg'itardi). Arena 12-savol B (S-006): «Render uxlab qoladi — sayt ochilmaydi».
- «Ortda qoldingizmi» izohlari («`.env` fayllaringiz o'zgarmaydi», «Neon'dagi sonlaringiz o'zingizniki») — qolip `ortda` faqat buyruq oladi (MEXANIZM-TAKLIF 6 — izoh qatori).
- 5-ekran: «Hozir» telefonida uchala holatda ✗; Backend holat tanlagichi yakunda statik ✓ ro'yxat. A3 5-qadam forma yorliqlari: «Bugungi ishlar» · «Audit natijangizdan / Qolgan ishlar» · «Gipotezangiz» · «Natijasi».
- Kichik yorliqlar: A2 kadrlarida «1» / «2», telefon ustida «Sayt · React» va `web/`, Yordamda «namuna talab», 4-ekranda «Backend holati». `lessonTitle.ru` «День проекта: выход в прод — часть 1».

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-07` «Production deploy: domen, SSL, monitoring» → **`m8-08` «Loyiha kuni: prodga ko'tarish — 1-qism»** (osti «eng yaxshi loyihangiz prod ro'yxati bo'yicha» — 08-q0 A, avval «… production darajasiga»; 1-ekran Mentorida) → `m8-09` «Loyiha kuni: prodga ko'tarish — 2-qism» (`00-NOMLAR.md` + App.jsx — grep bilan tekshiriladi).
- [x] Bitta misol-ip («Maydon», repo `maydon`) · metafora yo'q · keyssiz · bitta vizual dars bo'yi — `ProdRoyxat` (telefon va Backend qutisi bilan bitta manbadan).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (yo'l tugmalari → konvert, hisoblagich, `429`), 4 (holat tugmalari → ikki telefon); 0-ekran javobdan keyin o'zgaradi; bloklarda ish ✓.
- [x] Sarlavhalar 44–54 (≤55) bitta qator · Mentor ≤2 gap (bloklarda 1), sarlavhani takrorlamaydi · xulosalar 84–93 · hook javobi 96–104 · to'g'ri izoh 53–60 · xato izohlari 49–59 (python bilan sanalgan, qavsda).
- [x] Atamalar tayanch bilan bir xil: production (prod) · prod ro'yxati (bitta ta'rif) · so'rovlar chegarasi · `429` (ma'nosi bilan) · kutish holati · tarmoq (A1 da ta'rif) · A/B · foiz · brauzer ID · dashboard · talab;
  «band» va «qator» ro'yxat qismi ma'nosida yo'q, «sir», «server», «baza», «panel», «sinov» yo'q · siz-forma; promptlar sen-formada (T-002); tugmalar ot-shaklda yoki siz-formada.
- [x] Testlar: variantlar 39–42 va 36–41 belgi, to'g'ri variant yolg'iz eng uzun emas; kod belgisi (1-savol) to'rttalasida, «qayta» (2-savol) ikkitasida · ✔ o'rni: 3-ekran C, 5-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari o'quvchi matnida yo'q («darrov», «har doim» — faqat arena distraktorida, rad etiladi).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «m8-08», «10-Modul», «K9» yo'q; «4-darsdagi gipotezangiz», «o'tgan modulda» — o'quvchi tilida) · real kompaniya raqami yo'q · «KOD» (11) va «REPO» (5) ro'yxati to'liq.
- [x] Xavfsizlik qoidasi ruhida: chegara faqat himoya tomonidan (nega kerak, qayerda, qanday tekshiriladi); tekshiruv o'z saytingizda, laptopda.
- [x] Karta T · P · S: T-002/011/014/015/020/029/039/042/043/045/047/048/052/064 · P-001/008/013/015/020/026/028/036/046/052/057/058/062/064/067 · S-001/003/004/006/009/010/015/019/020/026/031/034 — ko'rildi.
- [ ] P-028 (tashqi qadam): Render proksi sarlavhasi va uyg'onish paytidagi javob — rasmiy hujjatda to'liq yo'q (shubhali joylar); GitHub'da `prod` tarmog'ini ochish yo'li umumiy so'z bilan yozildi.
- [ ] Tayanchda yo'q qarorlar (chegara sonlari, kutish holati qoidasi va matni, B qoladi kodda, README qismlari, `prod` atamasi) — TAYANCHGA SAVOL 1–6; 9-dars MD si bilan solishtirish kerak.
