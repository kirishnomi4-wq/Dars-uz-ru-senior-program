# 10-Modul (kod: `src/8-Modull`) · 9-dars «Loyiha kuni: prodga ko'tarish — 2-qism» — MD v3 (loyiha kuni qolipi)

Fayl: `src/8-Modull/ProdReviewLesson.jsx` · kalit `m8-09` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (P-058 dan farq — SABOQ 12) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · tip AI-PRAKT (dastur: «Prodga ko'tarish — 2-qism + code review: code review'da har qarorni tushuntiradi»; natija — «kod himoyaga tayyor») ·
eng yaqin namuna: `feedback/F-1005-9modul/11-MvpIteration-v3.md` va `11-FILTR.md` (tuzilish; matn ko'chirilmadi) · shakl: `03-LiveDashboard-v3.md` (shu moduldagi loyiha kuni).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **A**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 ≈ 20 · A2 ≈ 22 · A3 ≈ 18; har blokning 5-qadami ≈ 3 daqiqa).
Menyu nomi (DE-205): App.jsx `m8-09` — «Loyiha kuni: prodga ko'tarish — 2-qism» (osti: «code review: har qarorni tushuntirasiz») ·
oldingi dars `m8-08` «Loyiha kuni: prodga ko'tarish — 1-qism» · keyingi `m8-10` «Bir yilda nimalarni qurdingiz?» (App.jsx 336–338-qatorlar, grep; `comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2, qaror 12).** Dars oxirida o'quvchining `maydon` repo'sida (o'z fork'i) `prod` → `main` Pull Request ochilgan, sinfdosh unga izoh yozgan,
   har izohga «nega shunday qildim» javobi berilgan, review'dan chiqqan (topilmasa — Mentor bergan) bitta kamchilik tuzatilgan va PR birlashtirilgan («Merged»).
   Review kamchilik topmasligi ham normal — izoh savol yoki taklif bo'lishi mumkin (09-FILTR 2). Repo ildizida `REVIEW.md` — izohlar va javoblar.
   Birlashtirilgach Render va Netlify `main` dan yangilanadi — o'tgan darsdagi o'zgarishlar internetdagi saytga chiqadi («prodga ko'tarish — 2-qism»).
   Teg: `m10-dars-09-start` → `m10-dars-09-done` (tayanch 3). Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
   Bugungi yangi ko'nikma — **qarorni sabab bilan tushuntirish**: kodni agent yozgan bo'lsa ham, sababni o'quvchi kod bilan tekshirib, o'zi yozadi.
   Dastur natijasidagi «himoya» so'zi o'quvchi matniga olinmadi: 3–5-darslarda «himoya» — token bilan himoya ma'nosida (T-015). O'rniga: «har qarorni tushuntirasiz».
2. **Bugungi asosiy fikr (P-013):** Pull Request'da sinfdosh kodni birlashtirishdan oldin o'qiydi; siz har izohga qaror sababini yozasiz, topilgan kamchilik tuzatilgach o'zgarish `main` ga — internetga chiqadi.
   Agent talabga tayanib quradi, aytilmagan joyni taxmin qilishi mumkin (tayanch 7.2) — shuning uchun «agent shunday yozgan» javob bo'lmaydi.
3. **Texnik aniqlik** (manba: docs.github.com, 05.10.2026 da ochib o'qildi; havolalar — pastdagi «Manbalar» ro'yxatida [M1]…[M11]; GitHub yozuvlari inglizcha qoladi — T-033):
   - **PR ochish:** «Pull requests» → «New pull request» → *base* va *compare* tanlanadi → «Create pull request» → sarlavha va tavsif → yana «Create pull request».
     Manba: [M1] (4–5-qadam) · [M2]
     («base» — qayerga birlashtiriladi, «compare» — o'zgarish qaysi tarmoqda; sariq «Compare & pull request» banneri faqat yaqinda push qilingan tarmoqda chiqadi — shuning uchun darsda «New pull request»).
   - **Fork tuzog'i:** o'quvchi repo'si `Azizbekcrypto/maydon` ning fork'i (9-Modul K10). Fork'da PR ochilsa, «base repository» o'zi asosiy repo'ga (upstream) qaraydi —
     o'quvchi uni o'z repo'siga (`{login}/maydon`) almashtiradi, aks holda PR Mentor repo'sida ochiladi (head tarmog'iga yozish huquqi bor — docs: «you must have write access to the head or the source branch»).
     Manba: [M3] (rasm izohi: «dropdown menus for choosing the base repository and branch»)
     va [M4] («While your repository is a fork, pull requests will always default to the upstream repository») — docs'da to'g'ridan yozilmagan (shubhali joylar).
     Xato yo'li: PR asosiy repo'da ochilib qolsa — «Close pull request» [M5].
   - **Kim review qila oladi:** «Anyone with read access can review and comment on proposed changes» — public fork'ni har qanday GitHub akkaunti o'qiydi [M6].
     Review so'rash (Reviewers) — yozish huquqi kerak; darsda ishlatilmaydi: PR havolasi sinfdoshga Telegram'da yuboriladi.
   - **Izoh va review:** «Files changed» → qator ustiga kelinadi → ko'k izoh belgisi (rasmda «+») → izoh → «Start a review» (keyingilari — «Add review comment») →
     «Review changes» → umumiy izoh → «Comment» / «Approve» / «Request changes» → «Submit review». Yuborilguncha izohlar «pending» — faqat yozganga ko'rinadi. O'qilgan faylga «Viewed».
     Manba: [M7].
     Sinfdoshning «Approve»i yozish huquqi bo'lmagani uchun birlashtirish shartiga kirmaydi, lekin PR'da ko'rinadi (o'sha sahifa, TIP) — darsda belgi sifatida.
     PR muallifi o'z PR'ini «Approve» qila olmaydi (o'sha sahifa).
   - **Javob va yopish:** izoh ostiga yangi izoh — javob; muallif «Resolve conversation»ni bosishi mumkin («if you opened the pull request») — [M8].
   - **PR ochiq turganda push:** `prod` ga yangi commit PR'ga o'zi qo'shiladi («you can continue changing files by adding new commits to your head branch» — [M2]).
   - **Birlashtirish:** «Merge pull request» → «Confirm merge» (sukut bo'yicha merge commit) — [M9].
   - **Deploy:** Render — «Whenever you push or merge a change to that branch, by default Render automatically rebuilds and redeploys» [M10];
     Netlify ham ulangan tarmoqdan oladi. 9-Modul 9-darsida ikkalasi `main` ga ulangan deb olindi (repo sukut tarmog'i) — TAYANCHGA SAVOL 2.
     Netlify PR'ga «Deploy Preview» holatini va izohini qo'yadi (sukut bo'yicha yoqilgan — [M11]);
     u alohida manzil, `WEB_ORIGIN` da yo'q — Backend bilan ishlamasligi mumkin, darsda ishlatilmaydi (A1 da bir gap).
   - **Kamchilik (Mentor misoli)** — 8-dars MD si bilan solishtirildi (05.10, 15:09 versiyasi): o'tgan darsda kutish holati **faqat o'yinchi sahifasiga** qo'yildi
     («Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.», har 5 soniyada qayta so'rov, bir daqiqadan keyin «Vaqtlarni yuklab bo'lmadi» + «Qayta urinish» — 8-dars A-bo'lim 4, REPO).
     `/ega` dagi bandlar ro'yxati esa (`web/src/Ega.jsx`, 9-Modul kodi `dars-11-done`) javob kelguncha hech narsa ko'rsatmaydi, xatoda — «Bandlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.».
     Backend kechiksa, ega bo'sh joyni ko'radi va «band yo'q» deb o'ylashi mumkin. Tuzatish — o'yinchi sahifasidagi holat `/ega` ro'yxatiga ham (8-dars A2 talabi bilan bir xil shakl).
     `429` xabari 8-darsda hal qilingan (`/ega` va `/dashboard` kirishida «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.») — bu darsda tegilmaydi.
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **Pull Request (PR)** — o'zgarishni birlashtirishdan oldin ko'rsatish so'rovi (tayanch, so'zma-so'z). Birinchi marta — 2-ekran Mentori; 0-ekran va 1-ekranda yo'q (T-011). «merge request» yo'q.
   - **code review** — boshqa odam kodni o'qib izoh yozishi (tayanch; bu darsdagi ta'rif — izoh savol ham bo'lishi mumkin). Birinchi marta — 0-ekran Mentori. «kod ko'rigi» ishlatilmaydi.
   - **izoh** — sinfdosh kodning bir qatoriga yozgan fikri yoki savoli (GitHub'da comment). Bu darsdagi qolip — uch qator: **Joy** · **Nega muhim** · **Taklif** (savol bo'lsa — «Taklif» o'rnida savol; umumiy qoida emas, 09-FILTR 16). «izoh» bu darsda boshqa ma'noda yo'q (kod izohi `//` tilga olinmaydi — T-015).
   - **javob** — muallifning izoh ostidagi yozuvi. Ikki qatori: **Sabab** (nega shunday qildim) · **Qaror** (qoldi / tuzataman; `REVIEW.md` da — qoldi / tuzatildi).
     HTTP ma'nosida «javob» o'quvchi prozasida yo'q: «Backend `429` qaytaradi». Test tanlovlari — «variant». («To'g'ri javobni tanlang» yorlig'i yozilmaydi — SABOQ 6; «to'g'ri javob» — platforma matni.)
   - **muallif** — PR'ni ochgan odam. **sinfdosh** — izoh yozadigan odam (juftlikda). Ism yo'q (DARS_ETALON 5.8).
   - **tavsif** — PR ostidagi matn, uch bo'lim: **Nima o'zgardi** · **Sabab** · **Qanday tekshirdim**. «Sabab» — tavsifda ham, javobda ham bir ma'noda (qaror sababi).
   - **kamchilik** — review'da topilgan, tuzatiladigan narsa (Mentor misolida — `/ega` ro'yxatida yuklanish holati yo'qligi). Har review kamchilik topmaydi.
   - **tarmoq (branch)** — `main`, `prod`; ta'rif 8-dars MD sidan so'zma-so'z: «repo'dagi alohida yo'l: o'zgarishlar `main` ga tegmasdan shu yerda yig'iladi». Gloss — kartochkada va arena 3-savolda.
     1-Moduldagi «tarmoq» (internet) bu darsda yo'q.
   - **birlashtirish** — PR'ni `main` ga qo'shish; tugma «Merge pull request». 4c-Moduldagi so'z: «kodni birlashtirishdan oldin tekshirish» (`GithubActionsLesson.jsx`).
   - **qator** — yozuvdagi bitta qator: kod qatori, talab (prompt) va izoh qatori, `REVIEW.md` jadval qatori (03 va 08-darslar bilan bir xil: «qator» — jadval va prompt qatori). Bo'lim — faqat tavsif bo'limi.
   - **talab** (Qayerda · Nima qilsin · Nima buzilmasin — 9-Modul M-q2) · **prompt** · **agent** (Antigravity; dastur nomi faqat ochish va yuborish qadamida) · **tekshirish** (o'zingiz ko'rasiz).
     «sinov» (real odam ishlatadi, siz kuzatasiz) bu darsda yo'q: sinfdosh kodni o'qiydi, saytni sinamaydi.
   - sayt · Backend · Database · o'yinchi · maydon egasi (qisqa — «ega») · laptop — tayanchdagidek. **Ishlatilmaydi:** server (prozada), baza, «ekran» dars ekrani ma'nosida (T-064), «himoya» (1-band).
5. **Metafora yo'q. Keyssiz** (tayanch 5: loyiha kuni). Real kompaniya va tashqi raqam yo'q. Raqamlar — faqat Mentor misolidan (tayanch 1, aynan):
   A/B (B ishga tushgandan beri — 08-FILTR 3): **A — vaqt tanlagan 42 brauzerdan 12 tasi band qildi · B — 40 tadan 17 tasi**; Mentor: «farq bor, lekin 82 … hali kam — raqamni kuzatib boramiz» (tayanch 1 va 8-dars MD si bilan aynan — TAYANCHGA SAVOL 7).
   Render: 15 daqiqa so'rovsiz — uxlaydi, uyg'onishi ≈ 1 daqiqa (tayanch 6). Chegara sonlari (kirish 5 · band 10 · hodisa 60, bir daqiqada) va `429` matni — 8-dars MD sidan.
6. **Kod yozish — Antigravity (173.1).** A1: agent `main` va `prod` farqidan «Nima o'zgardi» ro'yxatini yozadi, fayllarga tegmaydi. A3: agent kamchilikni tuzatadi.
   Prompt — uch qator, har biri o'z yorlig'i bilan; oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» (9-Modul naqshi). Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
   Prompt matni sen-formada (T-002). Javob yozishda agentdan sabab so'rash mumkin, lekin uning gapi kod bilan solishtiriladi (4c-Modul «AI bilan lentani boshqarish»: «Ko'r-ko'rona qabul qilmang»,
   «Qaror — sizniki» — `AiPipelineProjectLesson.jsx` 272, 1081-qatorlar, grep).
7. **Talab zinapoyasi (tayanch 9.2: 8, 9 — uch qatorni o'quvchi yozadi, namuna «Yordam» ortida):** A1 — agentga prompt (uch qator) · A2 — izoh (Joy · Nega muhim · Taklif; agent yo'q — code review odam ishi) ·
   A3 — tuzatish talabi (uch qator). Har blokning 5-qadami — **«O'z g'oyangiz»**: o'tgan darsda tanlagan eng yaxshi loyihangiz uchun shu uch qator (qaror 2: 8–9-darslar — eng yaxshi loyiha).
8. **Real odam bilan ish:** juftlikda sinfdosh (qaror 12) — ikkalasi bir-birining PR'iga izoh yozadi. Toq son bo'lsa — uchlik (A → B → C → A). **Uyga vazifa yo'q** (P-058; tayanch 9.10).
9. **Toza yuza (D4):** tugma va variantlarda emoji yo'q; GitHub va sayt maketlari chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3; «Merged» — accent, binafsha emas).
   Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1) · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda; backtick sanalmaydi).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon» (Mentor misoli, repo `maydon`) — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt.
  O'tgan darsda `prod` tarmog'ida so'rovlar chegarasi, xato va kutish holatlari va A/B yakuni (hozircha B qoladi) tayyorlandi — internetdagi sayt hali eski.
  Bugun shu o'zgarishlar PR'da ko'rib chiqiladi va `main` ga qo'shiladi. O'quvchi blokda Mentor misolini o'z fork'ida bajaradi, 5-qadamda o'z eng yaxshi loyihasi uchun yozadi.
- **Hook:** sinfdosh «Nega chegara Backend'da?» deb yozdi → qaysi javob qaror sababini aytadi? → «agent yozgan» ham, ko'r-ko'rona rozilik ham javob emas.
- **Ip (ot-shaklda):** PR ochish → Juftlikda code review → Tuzatish va birlashtirish.
- **Bitta vizual — «Maydon» PR maketi** (`PR_NAMUNA` → `PrMaket`, dars bo'yi, 163/180):
  - Sarlavha: **Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1** · holat belgisi «Open» (keyin «Merged») · tarmoqlar `main` ← `prod` ·
    yorliqlar «Conversation» · «Files changed» (GitHub yozuvlari — T-033).
  - «Files changed» ro'yxati (namuna; 8-dars repo'si bilan solishtiriladi — TAYANCHGA SAVOL 4): `backend/src/app.module.ts` (chegara) · `web/src/App.jsx` (kutish holati) ·
    `web/src/BandForma.jsx` (B matni) · `web/src/Ega.jsx` · `README.md`.
  - **Uch izoh** (bitta manba `IZOHLAR`; har biri o'z fayli va qatori yonida, ostida javob):
    1. `web/src/BandForma.jsx`, tugma matni — Joy: tugma matni, endi hamma B ni ko'radi · Nega muhim: A va B farqi kichik ko'rinadi · Taklif: qaysi raqamlarga tayanganingizni yozing.
       Javob — Sabab: B ishga tushgandan beri A — vaqt tanlagan 42 brauzerdan 12 tasi, B — 40 tadan 17 tasi band qildi; farq bor, lekin 82 ta brauzer hali kam — hozircha B qoladi, raqamni kuzatib boramiz. Qaror: qoldi.
    2. `backend/src/app.module.ts`, chegara — Joy: so'rovlar chegarasi Backend'da · Nega muhim: chegara saytda bo'lsa, Backend'ga keraksiz so'rov bormaydi · Taklif: tugma bir daqiqaga o'chsin.
       Javob — Sabab: so'rovni saytsiz ham, to'g'ridan Backend'ga yuborsa bo'ladi; chegara Backend'da tursa, Backend'ga kelgan har so'rovga ishlaydi. Qaror: qoldi.
    3. `web/src/App.jsx`, o'tgan darsda qo'shilgan «yuklanmoqda» qatori (diff'da bor) — Joy: `/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`) · Nega muhim: Backend kechiksa, ro'yxat joyi bo'sh turadi — ega «band yo'q» deb o'ylashi mumkin ·
       Taklif: o'yinchi sahifasidagi «yuklanmoqda» holatini bu yerga ham qo'shing. Javob — Sabab: tekshirdim, shunday — holat faqat o'yinchi sahifasiga qo'shilgan edi. Qaror: tuzataman.
  - **Tarmoq chizmasi** (2-ekran): `main` va `prod` chiziqlari (nuqta — commit) · «Render · Netlify» qutisi `main` ga ulangan · ega sahifasi maketi `maydon-….netlify.app/ega`.
  - **Ega sahifasi maketi** (`EgaSahifa`): «Maydon · ega» · «‹ Shanba ›» · «Shanba · bandlar»; ro'yxat joyi holatlari: bo'sh (hech narsa yo'q, qizil uzuq ramka — kamchilik) ·
    «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» (accent, halqa) · ro'yxat: 17:00 va 20:00 (README dagi namuna bandlar; ism va telefon o'rnida kulrang chiziq — shaxsiy ma'lumot yozilmaydi).
  - Ishlatilishi: 0 (2-izoh va javob) · 1 (tayyor holat: uch izoh javobli, «Merged») · 2 (tarmoq chizmasi + ega sahifasi) · 4 (`App.jsx` yangi qatori + ega sahifasi + izoh yig'iladi) · A1–A3 o'ng (kutilgan natija).
  - `prefers-reduced-motion` da nuqtalar va pufaklar harakatsiz, holatlar bir zumda almashadi.
- **Yakun:** PR birlashtirildi, har qaror sababi bilan yozilgan · keyingi dars — yil bo'yi qurilgan loyihalar vaqt chizig'ida.

---

## 0 · Kirish — sinfdosh «Nega?» deb yozdi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Sinfdosh kodingizga «Nega?» deb yozdi. Nima deysiz?** (51)
- Mentor: Boshqa odam kodni o'qib izoh yozishi code review deyiladi. Uch variantdan bittasini tanlang.
- Maket (chap): `PrMaket` «Files changed» ko'rinishida, bitta fayl `backend/src/app.module.ts`: chegara qatori accent bilan ajralgan, yonida sinfdosh izohi (pufak):
  «Nega chegara Backend'da? Saytda tugma bir daqiqaga o'chsa, Backend'ga keraksiz so'rov bormaydi.» Ostida bo'sh javob joyi (uzuq chiziq — U-041).
- Savol: **Sizningcha, qaysi biri?**
  - Agent shunday yozgan, men tegmaganman (37)
  - ✔ So'rovni saytsiz ham yuborsa bo'ladi (36)
  - Mayli, aytganingizdek saytga ko'chiraman (40)
- Javob — 2-variant: **Aynan!** Bu — qaror sababi: so'rovni saytsiz ham yuborsa bo'ladi, chegara esa Backend'ga kelgan har so'rovga ishlaydi. (116)
- Javob — 1-variant: **Qiziq fikr!** Kodni agent yozgan bo'lsa ham, qaror sizniki. Sabab: so'rovni saytsiz ham yuborsa bo'ladi. (102)
- Javob — 3-variant: **Qiziq fikr!** Rozi bo'lishdan oldin sababni o'ylang: so'rovni saytsiz ham yuborsa bo'ladi. (88)
- **Harakat → Vizual o'zgarish:** variant tanlanadi → bo'sh javob joyiga Mentor misolining javobi yoziladi (ikki qator):
  «Sabab: so'rovni saytsiz ham, to'g'ridan Backend'ga yuborsa bo'ladi; chegara Backend'da tursa, Backend'ga kelgan har so'rovga ishlaydi.» · «Qaror: qoldi» (accent belgi).
  Izoh va javob orasiga ingichka chiziq tortiladi.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): izohga qaror sababi bilan javob. Uch tanlov — uch yo'l: aybni agentga ag'darish · sabab · ko'r-ko'rona rozilik (36–40 belgi).
  «So'rovni saytsiz yuborish» — himoya tamoyili (tekshiruv Backend'da), hujum yo'rig'i emas (tayanch 3, xavfsizlik qoidasi). «Backend'ga kelgan har so'rov» — «har so'rovni ko'radi» mutlaq edi (09-FILTR 6).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida ko'rib chiqilgan kod internetga chiqadi.** (53)
- Mentor: Kodni sinfdosh o'qiydi, kamchilikni agent tuzatadi, qarorni esa siz tushuntirasiz. «Maydon» — namuna: har amaliyot oxirida shu ishni o'z eng yaxshi loyihangiz uchun ham yozasiz.
- Chap — «Dars oxirida»: `PrMaket` tayyor holatda, bir marta o'zi yuradi (DE-200): uch izoh yonida javob paydo bo'ladi (qoldi · qoldi · tuzataman) →
  3-izoh ostida «Tuzatildi» → sarlavha yonidagi «Open» belgisi «Merged» ga almashadi. (Sayt yangilanishi ko'rsatilmaydi — u 2-ekran kashfiyoti, P-015.)
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · O'tgan darsdagi o'zgarishlar sinfdoshga ko'rsatiladi (52)
  - 02 · Code review: har qarorni tushuntirasiz (40)
  - 03 · Topilgan kamchilik tuzatilib, kod birlashtiriladi (51)
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `m10-dars-09-start` · namuna `m10-dars-09-done`
- Tugmalar: Orqaga · Boshlaymiz
✎ 02-qadam — App.jsx menyu osti yozuvi, so'zma-so'z (P-015). Qadamlarda «Pull Request» yo'q — atama 2-ekranda tug'iladi (T-011, P-014).

## 2 · O'zgarish internetga qanday chiqadi?  ← QTushuncha
- Eyebrow: Tushuncha · Pull Request
- Sarlavha: **O'zgarish internetdagi saytga qanday yetib boradi?** (50)
- Mentor: O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi Pull Request (PR) deyiladi — ikki yo'lni ham bosib ko'ring.
- Bashorat (ballsiz, 181): **O'tgan darsdagi so'rovlar chegarasi hozir qayerda ishlayapti?** · Hech qayerda · Faqat laptopda · Laptopda ham, internetda ham — tanlov saqlanadi.
- Chap (harakat): ikki tugma — «To'g'ridan `main` ga push» · «PR orqali birlashtirish».
- O'ng (vizual): tarmoq chizmasi — tepada `prod` (o'tgan darsdagi uch commit nuqtasi, accent; yonida laptop belgisi «laptopda ishlayapti»), pastda `main` ·
  o'ngda «Render · Netlify» qutisi, `main` dan strelka · eng o'ngda ega sahifasi maketi `maydon-….netlify.app/ega` (eski holat).
- **Harakat → Vizual o'zgarish:**
  - «To'g'ridan `main` ga push» → `prod` nuqtalari `main` ga o'tadi → «Render · Netlify» qutisi yonadi → ega sahifani ochadi, Backend javobi kechikadi →
    ro'yxat joyi bo'sh turadi (qizil uzuq ramka). Yorliq: «Hech kim o'qimadi — kamchilik internetga chiqdi.» (48)
  - «PR orqali birlashtirish» → `prod` va `main` orasida PR kartasi paydo bo'ladi («Files changed») → `App.jsx` dagi yangi holat yonida sinfdosh izohi («`/ega` da-chi?») → `prod` ga yangi nuqta «tuzatish» →
    «Merge pull request» → `main` yangilanadi → «Render · Netlify» → ega sahifasi: «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.», keyin ro'yxat (yashil).
    Yorliq: «Sinfdosh o'qidi — kamchilik birlashtirishdan oldin tuzatildi.» (61)
  2/2 dan keyin ikki yo'l yonma-yon turadi (solishtirish-sahnasi, P-057): chapda qizil ✗, o'ngda yashil ✓.
- Natija qatori: «Taxminingiz: … · haqiqatda: faqat laptopda — `prod` hali birlashtirilmagan» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu repo'da sayt `main` dan chiqadi. PR'da kod oldindan o'qiladi, kamchilikni ertaroq ko'rish mumkin. (98)
- Tugadi (199): harakat paneli yopiladi; tarmoq chizmasi va ega sahifasi butun enga, PR yo'li fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Ikki yo'lni bosing (N/2) → Davom etish
✎ Ko'prik (P-020): 9-Modulda o'zgarish to'g'ridan `main` ga push qilinardi va sayt o'zi yangilanardi (9-Modul 9-dars) — bugun oraga PR kiradi.
  Bashorat variantlari bir o'lchovning uch darajasi, o'sish tartibida (S-015). «Bir necha daqiqa» (deploy vaqti) — manbasiz son yozilmadi.
  Xulosa «kamchilik topiladi» demaydi — «ko'rish mumkin» (tayanch 7.1: kafolat yo'q).

## A1 · Amaliyot 1 — PR ochiladi, sabab sizdan  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · Pull Request
- Sarlavha: **PR oching: har o'zgarish yonida sababi tursin.** (46)
- Mentor: Nima o'zgarganini agent kod farqidan o'qiy oladi, nega — faqat siz bilasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda: `git checkout prod` (`git branch` — `* prod`), keyin `git push -u origin prod` — `prod` GitHub'dagi repo'ngizda ham bo'lsin.
     Brauzerda o'z repo'ngizni oching (`github.com/{login}/maydon`) → «Pull requests» → «New pull request».
     Repo fork bo'lgani uchun «base repository» asosiy repo'ni (`Azizbekcrypto/maydon`) ko'rsatadi — uni o'z repo'ngizga almashtiring. Keyin base: `main`, compare: `prod`.
     Pastda o'zgargan fayllar chiqadi.
  2. **Prompt** — talabning uch qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab):
     > Qayerda: `main` va `prod` tarmoqlari farqi (`git diff main...prod`).
     > Nima qilsin: har o'zgarish uchun bitta qator yozsin — nima o'zgardi va qaysi faylda. Sababini yozmasin.
     > Nima buzilmasin: hech qaysi faylni o'zgartirma, commit qilma — ro'yxatni faqat menga yoz.
  3. **Solishtirish** — agent ro'yxatini GitHub'dagi o'zgargan fayllar bilan solishtiring: har qator kodda bormi, tushib qolgan fayl yo'qmi. Kodda yo'q qatorni o'chiring.
     Keyin «Sabab» va «Qanday tekshirdim» bo'limlarini o'zingiz yozing. Agentdan sabab so'rasangiz, uning gapini kod bilan solishtiring: faqat o'zingiz tekshirgan sababni yozasiz.
     Prompt qutisi (Shablon → PR tavsifi · Nusxalash):
     ```
     ## Nima o'zgardi
     - {o'zgarish} — {fayl}
     ## Sabab
     - {o'zgarish}: {nega shunday qildingiz}
     ## Qanday tekshirdim
     - {nima qildingiz va nima ko'rdingiz}
     ```
  4. **PR ochish** — «Create pull request» → sarlavha (masalan: `Prod ro'yxati: chegara, xato holatlari, A/B yakuni`) → tavsifga shablonni qo'ying → yana «Create pull request».
     PR havolasini sinfdoshingizga Telegram'da yuboring. PR ostida Netlify'ning «Deploy Preview» qatori chiqishi mumkin — bu alohida manzil, bugun kerak emas.
     PR `Azizbekcrypto/maydon` da ochilib qolsa — uni «Close pull request» bilan yoping va 1-qadamdagi «base repository»ni qayta tanlang.
  5. **O'z g'oyangiz** — shu tavsifni o'tgan darsda tanlagan eng yaxshi loyihangiz uchun yozing: unda nima o'zgardi va nega? Uch qatorni to'ldiring.
     Nima o'zgardi: … · Sabab: … · Qanday tekshirdim: … — «Bajardim» uchala qator yozilgach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (`PrMaket`, «Conversation»):
  - **Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1** · «Open» · `main` ← `prod`
  - ```
    ## Nima o'zgardi
    - So'rovlar chegarasi: POST /bandlar, POST /kirish, POST /hodisalar — backend/
    - Xato va kutish holatlari — web/
    - A/B yakuni: hamma B ni ko'radi («18:00 ni band qilish») — web/src/BandForma.jsx
    - README — olti qism — README.md
    ## Sabab
    - Chegara: parolni qayta-qayta taxmin qilishni va soxta bandlarni sekinlatadi
    - Kutish holati: Backend kechiksa yoki javob bermasa — o'yinchi kutishni bilsin, sayt o'zi qayta so'raydi
    - B: kuzatilgan foiz yuqoriroq (A — 42 tadan 12, B — 40 tadan 17); 82 ta brauzer hali kam — hozircha qoladi, kuzatiladi
    ## Qanday tekshirdim
    - Laptopda noto'g'ri parolni ketma-ket yozdim — chegara ishladi
    - Backend'ni to'xtatdim — «Vaqtlar yuklanmoqda…», bir daqiqadan keyin «Qayta urinish» chiqdi
    ```
- Hammasi bajarilgach (yashil): PR ochildi: har o'zgarish yonida sababi bor, havola sinfdoshingizda. (68)
- Pastki qator (accent ogohlantirish, keyin kichik buyruqlar): Ortda qoldingizmi — **faqat mentor bilan** (`-f` `prod` dagi commitlaringizni o'chiradi): `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f -B prod m10-dars-09-start` · `git push -f -u origin prod`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Agent «Nima o'zgardi»ni yozadi, «Sabab»ni — yo'q: u qaror sababini bilmaydi, taxmin qilishi mumkin (tayanch 7.2). 3-qadam — «AI javobini tekshirmasdan qabul qilmaslik» (4c-Modul) shu darsda.
  «Ortda qoldingizmi» 9-Modul naqshidan farq qiladi: PR uchun tarmoq kerak (`-B prod`), `-f` push faqat `prod` ga (TAYANCHGA SAVOL 5).
  Tavsifdagi «Qanday tekshirdim» qatorlari — namuna; 8-dars tekshiruvlari bilan solishtiriladi (B-bo'lim).

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **PR ochiq turibdi, `prod` ga yana push qildingiz. Internetdagi sayt-chi?** (11 so'z)
  - Yangilanadi, chunki yangi push qilindi (38)
  - To'xtaydi, chunki PR birlashtirilmagan (38)
  - ✔ Eskicha qoladi, chunki main o'zgarmadi (38)
  - Yangilanadi, chunki PR ochiq turibdi (36)
- Kalit: **C** (index 2). To'rttalasi bir shaklda («Natija, chunki sabab»); «PR» ikki variantda, «Yangilanadi» ikki variantda; kod-belgi hech birida yo'q; to'g'ri variant eng uzun emas (A, B bilan teng).
- To'g'ri izohi: Push PR'ga qo'shildi; sayt `main` dan chiqadi — u o'zgarmadi. (59)
- Xato izohlari (≤60):
  - A: Push `prod` ga ketdi. Sayt qaysi tarmoqdan chiqadi? (49)
  - B: Ishlab turgan sayt `main` dan. U o'zgardimi? (42)
  - D: PR — ko'rsatish so'rovi. U `main` ni o'zgartiradimi? (50)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda ikki yo'l solishtirildi; savol yangi holatni so'raydi — PR ochiq paytidagi push (§106). A3 3-qadamda o'quvchi aynan shuni qiladi.

## 4 · Kamchilik izohga aylanadi  ← QTushuncha
- Eyebrow: Tushuncha · izoh va javob
- Sarlavha: **Sinfdosh topgan kamchilik qanday izohga aylanadi?** (49)
- Mentor: Izohni o'qigan muallif nimani tuzatishni bilishi kerak — «Joy» qatoridan boshlab har qatorga bitta bo'lak tanlang.
- Chap (harakat): sinfdoshning xom izohi (bitta pufak): «Bu yer yomon, qayta yozing.» Ostida izohning uch qatori — **Joy** · **Nega muhim** · **Taklif**; har qatorda ikki bo'lak (tartib kodda aralashtiriladi):
  - Joy: ✓ «`/ega` dagi bandlar ro'yxati (`Ega.jsx`)» · tuzoq «Siz yozgan hamma kod»
  - Nega muhim: ✓ «Backend kechiksa, ro'yxat bo'sh — ega «band yo'q» deb o'ylaydi» · tuzoq «Siz bu yerni o'ylamasdan yozgansiz»
  - Taklif: ✓ «O'yinchi sahifasidagi «yuklanmoqda» holati bu yerda ham bo'lsin» · tuzoq «Keyingi safar e'tiborliroq bo'ling»
  Tuzoqlar bitta xato-sinf — kodga emas, odamga qaratilgan gap (S-040).
- O'ng (vizual): `PrMaket` «Files changed» — `web/src/App.jsx` dagi o'tgan dars qo'shgan qatorlar (yashil «+»; namuna — 8-dars kodi bilan almashtiriladi, faqat matn 8-dars MD sidan aniq):
  ```
  + {kechikdi && (
  +   <p className="xabar">Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.</p>
  + )}
  ```
  Yonida kichik ega sahifasi maketi (`EgaSahifa`, `maydon-….netlify.app/ega`, «Shanba · bandlar», ro'yxat joyi bo'sh).
  Izoh `App.jsx` qatoriga qo'yiladi (diff'da shu qator bor), Joy esa tuzatiladigan joyni — `/ega` ro'yxatini — aytadi.
- **Harakat → Vizual o'zgarish:** o'quvchi bo'lak tanlaydi → maket javob beradi:
  - Joy ✓ → izoh pufagi `App.jsx` dagi «+» qatorga yopishadi, ega maketidagi ro'yxat joyi accent ramka oladi · tuzoq → butun fayl xira ramka oladi, silkinadi: «Hamma kod — qaysi qator tuzatiladi?» (35)
  - Nega muhim ✓ → ega maketida ro'yxat joyi qizil uzuq ramka oladi, yonida kulrang soat «40 soniya» — hali hech narsa yo'q · tuzoq → pufak silkinadi: «Bu odam haqida. Kodda nima bo'ladi?» (35)
  - Taklif ✓ → ega maketida uzuq chiziqli namuna xabar: «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» · tuzoq → pufak silkinadi: «Bu maslahat odamga. Kodda nima qilinadi?» (40)
  3/3 dan keyin izoh yig'iladi (uch qator, `IZOHLAR[2]` dagi matn) va ikkinchi ish ochiladi (P-008: shartli) — **Javob** qatori, muallif o'rnida, ikki bo'lak:
  - ✓ «Sabab: tekshirdim, shunday — holat faqat o'yinchi sahifasida edi. Qaror: tuzataman.» → izoh ostida javob pufagi, «tuzataman» belgisi (accent)
  - tuzoq «Siz tushunmabsiz, kod to'g'ri ishlaydi.» → pufak silkinadi: «Bu sinfdosh haqida. Kod haqida nima dedingiz?» (45)
  Qator (`QIzoh`, javobdan keyin): Qattiq izoh ham hurmatli bo'ladi, agar u kodga qaratilsa. (57)
- Xulosa: Izohda joy, nega muhimligi va taklif bor, javobda — qaror sababi. Ikkalasi odamga emas, kodga qaratilgan. (105)
- Tugadi (199): bo'laklar paneli yopiladi; `App.jsx` qatorlari, ega sahifasi, izoh va javob butun enga; vizual ⛶ ichida.
- Tugma (pastki): Izohni yig'ing (N/4) → Davom etish
✎ Javob qatori — shu suhbatning davomi (bir ish: bitta izoh-suhbatni yig'ish); tuzog'i ham odamga qaratilgan — xato-sinf bitta (S-040).
  «Qattiq lekin hurmatli» — topshiriq so'zi, QIzoh qatorida (xulosa takrorlanmaydi — T-048). Son ekranda bir marta: tugmada N/4 (P-062).

## A2 · Amaliyot 2 — juftlikda code review  ← amaliyot bloki (≈22 daq)
- Eyebrow: Amaliyot 2 · code review
- Sarlavha: **Sinfdosh PR'ini o'qing, o'zingiznikiga javob bering.** (52)
- Mentor: Juftlikda ikki PR bor: birini siz o'qiysiz, ikkinchisiga siz javob berasiz; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — sinfdoshingiz yuborgan PR havolasini oching → «Files changed». Har faylni oxirigacha o'qing, o'qib bo'lgan faylga «Viewed» belgisini qo'ying.
     Uch savol bilan o'qing: tavsifdagi sabab kodga mosmi? Xato bo'lsa, o'yinchi yoki ega nimani ko'radi? Maxfiy kalit (`JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI`) kodda ochiq turibdimi?
  2. **Izoh** — kamida ikkita izoh yozing: savol, taklif yoki haqiqiy kamchilik bo'lishi mumkin — kamchilik bo'lmasa, uni o'ylab topmang. Qator yonidagi ko'k «+» belgisini bosing va izohning uch qatorini yozing
     (bu darsdagi qolip; savol bo'lsa — «Taklif» o'rniga savolingiz). Birinchi izohdan keyin «Start a review», keyingisida «Add review comment».
     > Joy: **{qaysi qator}**
     > Nega muhim: **{bu kimga va nima xalaqit beradi}**
     > Taklif: **{nima qilish kerak}**
     Yordam (bosilsa ochiladi — namuna izoh, «Maydon», `web/src/App.jsx` dagi yangi «yuklanmoqda» qatoriga):
     > Joy: `/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`).
     > Nega muhim: Backend kechiksa, ro'yxat joyi bo'sh turadi — ega «band yo'q» deb o'ylashi mumkin.
     > Taklif: o'yinchi sahifasidagi «yuklanmoqda» holatini bu yerga ham qo'shing.
  3. **Yuborish** — «Review changes» → bitta umumiy gap yozing → «Comment» → «Submit review». Izohlaringiz sinfdoshingizga shundan keyin ko'rinadi.
  4. **Javob** — o'z PR'ingizga qayting: sinfdoshingizning har izohi ostiga javob yozing — **Sabab** va **Qaror** (qoldi yoki tuzataman). Tuzatish kerak bo'lgan kamchilik topilgan bo'lsa — 3-amaliyotda ✎ (T-036) uni tuzatasiz; topilmagan bo'lsa — Mentor bergan kamchilikni (`/ega` yuklanish holati) tuzatasiz.
     Sababini bilmasangiz — kodni o'qing; agentdan so'rasangiz, uning gapini kod bilan solishtiring. «Agent shunday yozgan» — javob emas.
     Yordam (bosilsa ochiladi — ikki namuna javob, «Maydon»):
     > Sabab: so'rovni saytsiz ham, to'g'ridan Backend'ga yuborsa bo'ladi; chegara Backend'da tursa, Backend'ga kelgan har so'rovga ishlaydi. Qaror: qoldi.
     > Sabab: tekshirdim, shunday — holat faqat o'yinchi sahifasiga qo'shilgan edi. Qaror: tuzataman.
  5. **O'z g'oyangiz** — eng yaxshi loyihangizda sinfdosh qaysi qaroringizni so'rashi mumkin? Uch qatorni yozing.
     Savol: … · Sabab: … · Qaror: … — «Bajardim» uchala qator yozilgach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (`PrMaket`, «Files changed»): uch izoh-suhbat ixcham kartalar bo'lib (`IZOHLAR`):
  - `web/src/BandForma.jsx` · izoh (uch qator) · javob — Qaror: qoldi
  - `backend/src/app.module.ts` · izoh · javob — Qaror: qoldi
  - `web/src/App.jsx` («yuklanmoqda» qatori, Joy — `/ega`) · izoh · javob — Qaror: tuzataman (accent)
  Tepada: sinfdoshning review'i, turi «Comment».
- Hammasi bajarilgach (yashil): Review yuborildi, har izohga sabab bilan javob berildi. (55)
- Pastki qator (accent ogohlantirish): Ortda qoldingizmi — **faqat mentor bilan** (`-f` `prod` dagi commitlaringizni o'chiradi): `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f -B prod m10-dars-09-start` · `git push -f -u origin prod` (PR'ni mentor bilan ochasiz)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: juftlarni oldindan bo'ling; toq bo'lsa — uchlik (A → B → C → A). Ikkalasi GitHub'ga kirgan bo'lsin (fork 9-Modulda ochilgan; public fork'ni har qanday akkaunt o'qiydi).
  Birinchi review — «Comment» bilan; «Approve» A3 da, tuzatishdan keyin. Izohda ism, laqab, baho yo'q — faqat kod. Kod yaxshi bo'lsa, savol ham yaxshi review: «Nega chegara Backend'da?», «B ni qaysi raqamga qarab qoldirdingiz?».
✎ 1-qadamdagi uch savol — review uchun yo'l-yo'riq; uchinchisi tayanch 7.9 (qaysi qiymat maxfiy). «Viewed» va «pending» — docs.github.com dan (A-bo'lim 3).
  4-qadam — hook va 4-ekranning davomi: javob ikki qatordan (Sabab · Qaror); qaror 12 — «review topgan bitta narsa tuzatiladi»; topilmasa, zaxira — Mentor misolidagi kamchilik (o'quvchi fork'ida ham bor, agar 8-dars holati bir xil bo'lsa).

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Sinfdosh: «Bu qatorni nega qo'shdingiz?» Kodni agent yozgan. Nima qilasiz?** (10 so'z)
  - ✔ Kodni o'qib tekshiraman, keyin sababni yozaman (46)
  - «Agent shunday yozgan» deb javobga yozib qo'yaman (49)
  - Agentdan so'rab, javobini tekshirmay qo'yaman (45)
  - Izohni javobsiz qoldirib, PR'ni birlashtiraman (46)
- Kalit: **A** (index 0). To'g'ri variant eng uzun emas (B 49); «tekshir» to'g'rida ham, C da ham; «agent» B va C da; to'rttalasi bir shaklda (birinchi shaxs, «…man»).
- To'g'ri izohi: Qaror sizniki: sababni kodda tekshirib, o'zingiz yozasiz. (57)
- Xato izohlari (≤60):
  - B: Sinfdosh agentdan emas, sizdan so'radi. Sabab qani? (51)
  - C: Agent taxmin qilishi mumkin. Uning gapi kodga mosmi? (52)
  - D: Savol ochiq qoldi. Birlashtirishdan oldin nima kerak? (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 4-ekranda javob qatori ko'rsatildi, A2 4-qadamda «agent shunday yozgan — javob emas» qoidasi; savol yangi holat — sababni o'quvchi bilmaydi (§106).
  Variantlar «men» shaklida — o'quvchi o'z harakatini tanlaydi (agentga prompt emas).

## A3 · Amaliyot 3 — tuzatish va birlashtirish  ← amaliyot bloki (≈18 daq)
- Eyebrow: Amaliyot 3 · tuzatish va «Merge»
- Sarlavha: **Kamchilikni tuzating, keyin PR'ni birlashtiring.** (48)
- Mentor: Tuzatish ham `prod` ga push qilinadi — PR o'zi yangilanadi; «1 · Talab»dan boshlang.
- Qadamlar:
  1. **Talab** — «tuzataman» degan izoh uchun talabning uch qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab, «Maydon»):
     > Qayerda: `/ega` sahifasidagi bandlar ro'yxati (`web/src/Ega.jsx`).
     > Nima qilsin: ro'yxat 5 soniyada kelmasa yoki so'rov o'tmasa, «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» chiqsin. So'rov o'tmasa — 5 soniyadan keyin qayta so'rasin;
     > oldingi so'rov tugamasdan yangisi ketmasin. Bir daqiqadan keyin ham bo'lmasa — «Bandlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi. O'yinchi sahifasidagi qayta so'rash kodini qayta ishlat.
     > Nima buzilmasin: parol va kod bilan kirish, `401` da parol formasi qaytishi, o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  2. **Tekshirish** — agentning hisobotiga emas, haqiqiy o'zgarishga qarang: `git diff` — faqat `web/src/Ega.jsx` o'zgarganmi.
     Keyin `localhost:5173/ega` ga kiring. Backend terminalida Ctrl+C bilan uni to'xtating va kunni almashtiring («›»): «Bandlar yuklanmoqda…» chiqadi.
     Bu tekshiruvda Backend umuman javob bermaydi; sekin javob holati o'tgan darsdagi sahnada ko'rilgan.
     Shu daqiqa ichida Backend'ni qayta yoqing (`npm run start:dev`) — sahifani yangilamasangiz ham ro'yxat o'zi chiqadi.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. **Push** — repo ildizida `REVIEW.md` yarating (shablon) va izoh-javoblarni yozing. Keyin `git status` — o'zgargan fayllar: agent aytgan ro'yxat va `REVIEW.md`; shularni `git add` bilan qo'shing, `git commit -m "review: /ega yuklanish holati, REVIEW.md"`, `git push` — yangi commit PR'da ko'rinadi.
     «tuzataman» degan izoh ostiga «Tuzatildi» deb yozing.
     Prompt qutisi (Shablon → REVIEW.md · Nusxalash):
     ```
     # REVIEW — {loyiha nomi} · PR #{raqam} (prod → main)
     Ko'rib chiqdi: {sinfdoshingizning GitHub logini}
     | № | Joy | Izoh | Sabab (nega shunday qildim) | Qaror |
     |---|---|---|---|---|
     | 1 | {fayl va qator} | {izoh} | {sabab} | qoldi / tuzatildi |
     ```
  4. **Birlashtirish** — sinfdoshingiz yangi commitni ko'rib, «Review changes» → «Approve» → «Submit review» qiladi. Bu repo'da «Approve» birlashtirish uchun shart emas — u tuzatishni qayta ko'rganining belgisi.
     Sinfdosh ulgurmasa yoki GitHub ochilmasa — mentor ko'rib, «ko'rdim» izohini qoldiradi. Siz suhbatlarni «Resolve conversation» bilan yopasiz.
     Birlashtirishdan oldin «Files changed»ga qarang: Database jadvali fayli (`….entity.ts`) o'zgarmagan bo'lsin. O'zgargan bo'lsa — birlashtirmang, mentorga ayting.
     Keyin PR pastida «Merge pull request» → «Confirm merge». Render va Netlify `main` dan oladi — bir necha daqiqada internetdagi sayt yangilanadi.
     Netlify manzilingizga `/ega` qo'shib oching va kiring — bandlar ro'yxati chiqadi. Bepul Backend uxlab qolgan bo'lsa, birinchi so'rov kechikishi mumkin — taxminan bir daqiqagacha.
     Netlify yoki Render yangilanmasa — tekshiruvni laptopda qiling, deploy'ni mentor bilan ko'rasiz.
  5. **O'z g'oyangiz** — eng yaxshi loyihangizda code review topishi mumkin bo'lgan bitta kamchilik uchun talab yozing. Uch qatorni to'ldiring.
     Qayerda: … · Nima qilsin: … · Nima buzilmasin: … — «Bajardim» uchala qator yozilgach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon»: tepada `PrMaket` — **Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1** · «Merged» · `main` ← `prod` ·
  ostida ega sahifasi maketi `maydon-….netlify.app/ega` — «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.», keyin ro'yxat 17:00, 20:00 (yashil) · yonida fayl-karta `REVIEW.md`:
  ```
  # REVIEW — Maydon · PR #1 (prod → main)
  Ko'rib chiqdi: sinfdosh
  | № | Joy                          | Izoh                                         | Sabab (nega shunday qildim)                                  | Qaror     |
  | 1 | web/src/BandForma.jsx, tugma | Nega B qoldi? Farq kichik ko'rinadi          | A — 42 tadan 12, B — 40 tadan 17; 82 ta brauzer hali kam — hozircha B, kuzatamiz | qoldi     |
  | 2 | backend, so'rovlar chegarasi | Saytda tugma bir daqiqaga o'chsa-chi?        | So'rovni saytsiz ham yuborsa bo'ladi; chegara Backend'ga kelgan har so'rovga ishlaydi | qoldi     |
  | 3 | web/src/Ega.jsx, bandlar     | Backend kechiksa, ro'yxat bo'sh — «yuklanmoqda» holati kerak | Tekshirdim, shunday: holat faqat o'yinchi sahifasida edi | tuzatildi |
  ```
- Hammasi bajarilgach (yashil): Kamchilik tuzatildi, PR birlashtirildi — ko'rib chiqilgan kod internetda. (73)
- Pastki qator (accent ogohlantirish): Ortda qoldingizmi — **faqat mentor bilan** (`-f` `prod` dagi commitlaringizni o'chiradi): `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f -B prod m10-dars-09-done` · `git push -f -u origin prod`
  (`REVIEW.md` ni o'z izohlaringiz bilan almashtiring; Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan ✎ (06.10, T-036)).
- Nishon (bonus): Merged — oxirgi «Bajardim»da (5-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 2-qadam — 9-Modul A2 naqshi («agentning hisobotiga emas, haqiqiy o'zgarishga qarang: `git diff`») va 8-dars A2 tekshiruvi (Backend'ni to'xtatib-yoqish) — yangi vosita yo'q.
  Token Backend qayta yoqilganda ham amal qiladi (`JWT_SECRET` o'zgarmaydi), kirish qayta so'ralmaydi. 4-qadamdagi zaxira yo'l — P-026 (mentor «ko'rdim»).
✎ 4-qadamdagi jadval fayli tekshiruvi — `synchronize: true` (8-dars «keyin», GATE M M-q2 A): jadval fayli o'zgargan kod `main` ga chiqsa, TypeORM prod Database'dagi jadvalni o'zi o'zgartiradi.
  Bu PR'da jadval fayli o'zgarmaydi (B qoladi kodda — `variant` ustuni saqlanadi; 8-dars REPO), shuning uchun birlashtirish jadvalga tegmaydi. 05.10 GATE M 09-q0 A: M-q2 qoladi — kod o'zgarmaydi, tekshiruv qadami bilan.
- O'qituvchi eslatmasi: «Files changed»da `.entity.ts` yo'qligini birga ko'ring va sababini bir gap bilan ayting: «kod jadvalni o'zi o'zgartiradi — shuning uchun jadval fayli o'zgargan PR'ni mentor bilan birlashtiramiz».

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — Sayt `main` dan» · 5 — «2 — Sabab sizdan».

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
- Sarlavha: **PR birlashtirildi — har qaror sababi bilan yozilgan.** (52)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (5):
  - Bu repo'da `prod` dagi o'zgarish PR orqali birlashtirilgach internetga chiqadi.
  - Yaxshi izohda joy, nega muhimligi va taklif bor.
  - Izoh odamga emas, kodga qaratiladi.
  - Javobda qaror sababi yoziladi, kerak bo'lsa tuzatish ham.
  - Kodni agent yozgan bo'lsa ham, sababni kodda tekshirib, o'zingiz yozasiz.
- Uyga vazifa — yo'q (P-058, 172.4: ish repo'da; eng yaxshi loyihangiz har blokning 5-qadamidagi yozuvlar bilan davom etadi — ekranda alohida blok yo'q).
- Keyingi dars — «Bir yilda nimalarni qurdingiz?»: yil bo'yi qurgan loyihalaringizni vaqt chizig'iga qo'yasiz, «Maydon» — oxirgisi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Branch Aware** — Sayt `main` dan chiqishini, push PR'ga qo'shilishini bildingiz (3-ekran, 1-savol)
- **Own Answer** — Sababni kodda tekshirib, o'zingiz yozishni tanladingiz (5-ekran, 2-savol)
- **Merged** — PR'ni code review'dan keyin birlashtirdingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Sayt `main` dan chiqadi»
   - `base: main ← compare: prod` · PR — `prod` dagi o'zgarish `main` ga birlashtirishga so'raladi.
   - `git push` · PR ochiq — yangi commit PR'ga qo'shiladi, sayt o'zgarmaydi.
   - `Merge pull request` · Birlashtirish — `main` o'zgaradi, Render va Netlify yangilanadi.
   - Sinfga savol: O'tgan darsdagi chegara nega hali internetda ishlamayapti?
2. 2-savol (5-ekran) — «Sabab — sizdan»
   - `git diff` · Kod — sabab kodda tekshiriladi.
   - `Sabab:` · Javob — nega shunday qilganingizni aytadi.
   - `Qaror: qoldi / tuzataman` · Qaror — o'zgarmaydi yoki tuzatiladi.
   - Sinfga savol: «Agent shunday yozgan» nega javob emas?
✎ Emoji o'rniga koddan / GitHub'dan bitta qator (S-026).

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Pull Request (PR) nima? | O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi | «Maydon» da — `prod` dan `main` ga |
| Code review nima? | Boshqa odam kodni o'qib izoh yozishi | Izoh savol ham bo'lishi mumkin; har review kamchilik topmaydi |
| Tarmoq (branch) nima? | Repo'dagi alohida yo'l: o'zgarishlar `main` ga tegmasdan shu yerda yig'iladi | «Maydon» da — `prod`; PR bilan `main` ga birlashtiriladi |
| PR ochiq turganda `prod` ga push qilsangiz nima bo'ladi? | Yangi commit PR'ga qo'shiladi | Internetdagi sayt `main` birlashtirilguncha o'zgarmaydi |
| Yaxshi izoh qaysi uch qismdan iborat? | Joy, nega muhim, taklif | «Bu yer yomon» da joy ham, sabab ham yo'q |
| Izoh kimga qaratiladi? | Kodga, odamga emas | «Siz o'ylamay yozgansiz» o'rniga — qator va sabab |
| Yaxshi javobda nima bo'ladi? | Qaror sababi, kerak bo'lsa — tuzatish | Qaror: qoldi yoki tuzataman |
| Taklifga rozi bo'lmasangiz, nima yozasiz? | Sababini | Chegara Backend'da qoldi: so'rovni saytsiz ham yuborsa bo'ladi |
| Kodni agent yozgan. Sinfdosh «Nega?» desa-chi? | Kodni tekshirib, sababni o'zingiz yozasiz | Agentdan so'rasangiz ham, uning gapini kod bilan solishtirasiz |
| PR tavsifining qaysi bo'limini agent yozib bera olmaydi? | «Sabab» bo'limini | Nima o'zgarganini agent kod farqidan o'qiy oladi |
| Maydon PR'ida nega B qoldi? | B'da band qilganlar foizi yuqoriroq chiqdi | Hozircha qoladi — isbot emas: 82 ta brauzer hali kam, raqam kuzatiladi |
| PR'ni birlashtirish uchun nima bosiladi? | «Merge pull request», keyin «Confirm merge» | Shundan keyin Render va Netlify `main` dan yangilanadi |

✎ Kartalar «Endi siz bilasiz» qatorlarini so'zma-so'z takrorlamaydi (§216). «Sabab» — tavsifda ham, javobda ham bir so'z (T-014).

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3
1. Pull Request (PR) nima? ✔ O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi · Kodni internetga chiqaradigan, terminaldagi buyruq · Asosiy repo'dan o'zingizga nusxa oladigan GitHub tugmasi · Sinfdosh kodning bir qatoriga yozgan bitta izohi
2. Code review nima? O'zgarishni main'ga birlashtirish tugmasi · ✔ Boshqa odam kodni o'qib izoh yozishi · Agent kodni o'zi o'qib tuzatib qo'yishi · Saytni telefonda ochib tekshirib ko'rish
3. Bu repo'da Netlify qaysi tarmoqdan (branch) yangilanadi? prod'dan, har push qilinganda · Ochiq PR'ning o'zidan, har safar · ✔ main'dan, PR birlashtirilgach · Laptopdagi web/ papkasidan
4. PR ochiq. prod'ga yana push qildingiz. Nima bo'ladi? Internetdagi sayt shu zahoti yangilanadi · PR yopilib, o'rniga yangisi ochiladi · Push rad etiladi, chunki PR ochiq · ✔ Yangi commit PR'ning o'ziga qo'shiladi
5. Yaxshi izoh qaysi uch qismdan iborat? ✔ Joy, nega muhim, taklif · Ism, sana va qo'yilgan baho · Fayl, tarmoq va commit nomi · Savol, javob va olingan ball
6. Qaysi izoh kodga qaratilgan? «Siz bu yerni umuman o'ylamasdan yozgansiz» · ✔ «Ro'yxat yuklanguncha xabar yo'q, qo'shing» · «Keyingi safar ancha e'tiborliroq bo'ling» · «Sizga bu mavzuni qaytadan o'qish kerak»
7. Sinfdosh taklifiga rozi emassiz. Nima yozasiz? «Yo'q» deb yozib, suhbatni yopib qo'yasiz · Javobsiz qoldirib, PR'ni birlashtirasiz · ✔ Sababni yozib, «qoldi» deb javob berasiz · Taklifni o'ylab ko'rmasdan qabul qilasiz
8. Kodni agent yozgan. Sinfdosh «Nega?» dedi. Nima qilasiz? «Agent shunday yozgan» deb yozasiz · Agent gapini tekshirmasdan qo'yasiz · Izohni javobsiz yopib qo'yasiz · ✔ Kodni tekshirib, sababni yozasiz
9. PR tavsifidagi «Sabab» bo'limini kim yozadi? ✔ Kod muallifi, o'zingiz · Agent, kod farqiga qarab · Izoh yozadigan sinfdosh · GitHub o'zi, avtomatik
10. Izohlar «Submit review»dan oldin kimga ko'rinadi? Faqat PR'ni ochgan muallifga · ✔ Faqat izohni yozgan odamga · Repo'ni ochgan har qanday odamga · Mentor va PR muallifiga
11. Maydon PR'ida nega B varianti qoldi? B tugmasining matni chiroyliroq ko'rindi · Sinfdoshlar B ni ko'proq maqtab yozdi · ✔ Hozircha B foizi yuqoriroq chiqdi · A ni Netlify ko'rsatmay qo'ygan edi
12. Kamchilik tuzatildi, sinfdosh «Approve» berdi. Keyin-chi? PR'ni yopib, o'rniga yangisini ochasiz · main'ga kodni qo'lda ko'chirib qo'yasiz · prod'ni o'chirib, kodni qaytadan yozasiz · ✔ PR'ni birlashtirib, saytni tekshirasiz

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik (python): to'g'ri variant hech bir savolda yolg'iz eng uzun emas — 1 A 53/50/56/48 · 2 B 41/36/39/40 · 3 C 29/32/29/26 · 4 D 40/36/33/38 · 5 A 23/27/27/28 · 6 B 43/43/42/40 · 7 C 41/39/40/40 · 8 D 34/35/30/32 · 9 A 22/24/23/22 · 10 B 28/26/32/23 · 11 C 40/37/33/35 · 12 D 38/39/40/38;
 6-savolda to'rttala variant qo'shtirnoqda, uchta noto'g'risi odamga qaratilgan (bitta xato-sinf — S-040), to'g'risi — kodga; 9-savolda tire yo'q (S-003); 8-savolda «tekshir» B va D da;
3- va 12-savollarda tarmoq nomlari kamida uch variantda; 6-savolda kod-belgi yo'q. Savollar ≤12 so'z.
11-savol — A-bo'lim 5 raqamlari (A 12/42 ≈ 29%, B 17/40 ≈ 43% — «foiz» tayanch 2 ma'nosida); arenada son yo'q.
Fon so'zlari (R-008, kodda {uz, ru}): Pull Request · code review · main · prod · Files changed · Merge pull request · REVIEW.md · /ega · Approve · Joy · Nega muhim · Taklif · Maydon · Netlify

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **0 (A)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`PR_NAMUNA` + `IZOHLAR` + `PrMaket`** — bitta manba (180): `{ sarlavha, raqam: 1, holat: 'Open' | 'Merged', base: 'main', compare: 'prod', fayllar: [...], tavsif: {...} }`;
   `IZOHLAR` — uch izoh `{ fayl, qator, joy, negaMuhim, taklif, sabab, qaror }` (A-bo'limdagi matn). Proplar: `korinish` («Conversation» / «Files changed»), `holat`, `javoblar` (ko'rinadimi).
   0, 1, 4-ekran va A1–A3 o'ng tomoni shundan o'qiydi; `REVIEW.md` fayl-kartasi ham `IZOHLAR` dan yig'iladi. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4).
3. **`TarmoqChizma`** (2-ekran: `main`, `prod`, PR kartasi, «Render · Netlify») va **`EgaSahifa`** (ro'yxat joyi: bo'sh · «Bandlar yuklanmoqda…» · ro'yxat) — 2, 4-ekran va A3 o'ngida.
4. 0-ekran `QKirish` (maket = `PrMaket` «Files changed», 2-izoh; variant tanlangach javob yoziladi). 2-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, ikki yo'l (P-057), `zoom`, `tugadi`.
   4-ekran `QTushuncha`: uch qator × ikki `QChip` (`holat`, tuzoqda `silk`) + shartli to'rtinchi qator (javob); `QXato` bitta qator; `QIzoh`; `zoom`, `tugadi`.
5. 3 va 5-ekran `QTest` — matn yuqoridagidek; xato izohlari ≤60, to'g'ri izoh ≤60.
6. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (9-Modul `src/7-Modull/MvpFirstScreenLesson.jsx` naqshi: `GoyaForma`, `yordam`, `forma: true`, `XATO_YOLI`). Har blok **5 qadam**.
   - A1: prompt uch joy (`A3_JOY` naqshi) + shablon «PR tavsifi»; A2: izoh uch joy (`kimga`: «Siz → GitHub izohi») + «Yordam»da ikki namuna javob; A3: talab uch joy + shablon `REVIEW.md`.
   - `kimga`: «Siz → Antigravity» · «Shablon → PR tavsifi» · «Siz → GitHub izohi» · «Shablon → REVIEW.md» · «Siz → terminal». 5-qadam `GoyaForma` — uch maydon (A1: Nima o'zgardi · Sabab · Qanday tekshirdim;
     A2: Savol · Sabab · Qaror; A3: Qayerda · Nima qilsin · Nima buzilmasin).
   - O'ng: A1 — `PrMaket` «Conversation» (tavsif bilan); A2 — `PrMaket` «Files changed», uch suhbat; A3 — `PrMaket` «Merged» + `EgaSahifa` (tuzatilgan) + `REVIEW.md` fayl-karta.
   - `ortda`: A1, A2 = `git checkout -f -B prod m10-dars-09-start`; A3 = `… m10-dars-09-done`; uchalasida oldin `ORTDA_FETCH`, keyin `git push -f -u origin prod`.
7. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Branch Aware, 5-ekran → Own Answer, A3 oxirgi «Bajardim» → Merged.
8. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; SABOQ 12, 16). 7-ekran `QYakun`: `uyga` yo'q, `recap` 5 qator, `keyingi` matni yuqoridagidek.
9. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
10. `LESSON_META.lessonId` — `m8-09-v1`, `lessonTitle` — «Loyiha kuni: prodga ko'tarish — 2-qism». App.jsx `m8-09` qatoriga `comp` — «qur» bosqichida (asosiy seans).
11. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/1366 · surat (1280 + 393).

## REPO — `maydon` ga qo'shiladigan narsalar (`m10-dars-09-start` → `m10-dars-09-done`; yozish — «qur» da, 9-Modul repo'si yopilgandan keyin, qaror 3)
1. **`m10-dars-09-start`** = `m10-dars-08-done` — `prod` tarmog'ining uchi (birlashtirilmagan); `main` = `m10-dars-07-done` (tayanch 3).
2. **`m10-dars-09-done`** = `prod` + bitta tuzatish commit + `REVIEW.md` → `main` ga merge commit orqali birlashtirilgan:
   - `web/src/Ega.jsx`: bandlar ro'yxati — 5 s kechikish yoki xatoda «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.», so'rov o'tmasa 5 s dan keyin qayta (oldingisi tugamasdan yangisi yo'q),
     60 s dan keyin «Bandlarni yuklab bo'lmadi» + «Qayta urinish»; qayta so'rash — o'yinchi sahifasidagi bilan bitta yordamchi (takror kod yo'q)
     (8-dars o'yinchi sahifasidagi holat bilan bir xil); kirish, `401`, `429` matni va o'yinchi sahifasi o'zgarmagan;
   - `REVIEW.md` (repo ildizi, Maydon namunasi): uch izoh, sabab, qaror — A3 o'ng tomonidagidek;
   - README: «Darslar va teglar» jadvaliga 9-dars qatori; «Xato holatlari» bo'limiga `/ega` qatori; «Prod ro'yxati → keyin»: «`synchronize: true` — jadval fayli o'zgargan PR mentor bilan birlashtiriladi» (09-q0 A).
   - Jadval fayllari (`*.entity.ts`) bu darsda o'zgarmaydi — `m10-dars-09-done` dagi merge Database jadvaliga tegmaydi (muhrdan oldin `git diff m10-dars-07-done m10-dars-09-done -- '*.entity.ts'` bo'sh).
3. **Mentor misoli PR** (GitHub'da, repo push qilingandan keyin, foydalanuvchi buyrug'i bilan — tayanch 3): PR #1 `prod` → `yechim` (05.10 tayanch: upstream `main` — bo'sh boshlang'ich holat, tegilmaydi; darsdagi maketda o'quvchi fork'idagidek `prod` → `main` ko'rsatiladi), uch izoh va javoblar, «Merged». Qayerda ochilishi — TAYANCHGA SAVOL 1.
4. **Bog'liqlik:** 8-dars `m10-dars-08-done` — B-bo'lim; 10-dars — PR havolasi va `REVIEW.md` yillik yo'lda dalil bo'lishi mumkin (kalit taklif qilinmadi — TAYANCHGA SAVOL 12).

## B. Bu darsdan tashqariga chiqadigan narsalar (hozir tegilmaydi)
- **8-dars MD si va repo:** `prod` tarmog'i GitHub'ga push qilingan, birlashtirilmagan; `main` = 7-dars holati; Render va Netlify `main` ga ulangan (9-Modul deploy).
  Kutish holati faqat o'yinchi sahifasida (8-dars MD si A-bo'lim 4 va REPO shunday) — `/ega` bandlar ro'yxati 9-Modul holatida qoladi; bugungi kamchilik shunga tayanadi.
  8-dars `/ega` ga holat qo'shsa, Mentor misolidagi kamchilik o'zgaradi (TAYANCHGA SAVOL 3). A/B yakuni: A 42 dan 12, B 40 dan 17 → B (tayanch 1). PR tavsifidagi «Qanday tekshirdim» — 8-dars tekshiruvlaridan.
  Fayl nomlari (`backend/src/app.module.ts` — chegara, `web/src/App.jsx` — kutish holati) — 8-dars kodi bilan bir xil bo'lsin. PR sarlavhasida «tayyor» yo'q (08-FILTR 2).
- **5-dars:** ega kirishi parol + 6 xonali kod — 9-dars A3 «Nima buzilmasin» da «parol va kod bilan kirish».
- **10-dars:** «Maydon» — vaqt chizig'ida oxirgi loyiha; PR va `REVIEW.md` — dalil sifatida ishlatilishi mumkin.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ✅ **(05.10 asosiy seans: hal qilindi — Mentor repo'sida `prod` → `yechim`, tayanch 3)** **Mentor misoli PR qayerda turadi?** Tayanch: «Mentor misoli PR'i GitHub'da turadi — repo push qilingandan keyin». Lekin 9-Modul K10: upstream `main` — **bo'sh boshlang'ich holat** (o'quvchilar noldan quradi).
   `Azizbekcrypto/maydon` da `prod` → `main` birlashtirilsa, upstream `main` yechim bilan almashadi va keyingi oqim o'quvchilari uchun boshlang'ich holat buziladi.
   Taklif: Mentor misoli PR — alohida tarmoqlar orasida (masalan `m10-main` ← `m10-prod`) yoki Mentor'ning o'z fork'ida; darsdagi maket esa `PR_NAMUNA` dan chiziladi.
2. **Render va Netlify `main` ga ulangan** deb olindi (9-Modul 9-darsida tarmoq tanlanmagan — repo sukut tarmog'i; 8-dars MD si ham shunday oladi, A-bo'lim 4). Boshqa tarmoqqa ulangan bo'lsa, 2-ekran, 1-savol va A3 4-qadam o'zgaradi.
3. **Kamchilik — `/ega` ro'yxatida yuklanish holati yo'qligi** (8-dars REPO «holat faqat o'yinchi sahifasida» — «qur» da shu holatda muzlatiladi, 09-FILTR 7). Avval `429` xabarini olgan edim; 8-dars MD si (15:09) uni allaqachon hal qilgani uchun almashtirdim.
   Yangi kamchilik 8-darsning «holat faqat o'yinchi sahifasida» qaroriga tayanadi; 8-dars `/ega` ga ham holat qo'shsa — boshqa kamchilik kerak (shakl o'sha: izoh → «tuzataman» → talab → birlashtirish).
   UptimeRobot (7-dars) Backend'ni odatda uyg'oq tutadi — kamchilik kam uchraydigan holat uchun, buni izohning «Nega muhim» qatori «kechiksa» deb aytadi.
4. **«Files changed» fayl nomlari** (`backend/src/app.module.ts`, `web/src/App.jsx`) — 8-dars kodi qayerga yozilishiga bog'liq; namuna sifatida olindi.
5. **«Ortda qoldingizmi»** — 9-Modul naqshi (`git checkout -f <teg>`) PR uchun yetmaydi: tarmoq kerak. `git checkout -f -B prod <teg>` va `git push -f -u origin prod` yozdim (`-f` — faqat `prod` ga).
   O'quvchining `main` i 7-dars holatidan farq qilsa (orqada yoki o'z commitlari bilan), PR'da ko'proq fayl chiqadi yoki to'qnashuv bo'ladi — mentor bilan.
   `m10-dars-09-done` — `main` dagi merge commit deb oldim; A3 qatori shunga bog'liq (`prod` uchi bo'lsa ham ishlaydi).
6. **Atama «tarmoq (branch)»** — tayanch 2-bo'limda yo'q (3-bo'limda «`prod` tarmog'ida»). 8-dars MD si bilan bir xil bo'lishi kerak; gloss — kartochka va arena 3.
7. **«82 ta brauzer»** — tayanch 1 va 8-dars MD si bilan aynan qoldirdim (Mentor gapi). Sanoq birligi 2-darsdan — brauzer (tayanch 7.3); «kishi» ↔ «brauzer» nomuvofiqligi 8-dars bilan birga hal qilinadi.
8. **A2 da agent prompti yo'q** — code review odam ishi; tayanch 9.2 dagi «uch qator» — izohning uch qatori (Joy · Nega muhim · Taklif). A1 va A3 — agentga prompt.
9. **Juftlik** — sinfdoshlarning GitHub akkaunti (9-Modul fork). Toq son — uchlik. Sinfda internet va GitHub ochilishi — «qur» oldidan tekshiriladi (P-028).
10. **`REVIEW.md` tuzilishi** — tayanchda faqat «izohlar va «nega shunday qildim» javoblari». Ustunlar: № · Joy · Izoh · Sabab · Qaror (qoldi / tuzatildi).
11. ✅ **(09-FILTR 3)** **Sinfdoshning «Approve»i** — birlashtirish sharti emas; A3 4-qadamda o'quvchiga ochiq aytiladi; zaxira — mentor «ko'rdim» izohi.
12. **Saqlanadigan natija kaliti** (`pm-m8d9-…`) — tayanch 8 da yo'q; men qo'shmadim (loyiha kuni, natija repo'da). 10-dars eng yaxshi loyiha PR havolasini so'rasa — kalit kerak bo'ladi.
13. **«javob» so'zi** — review javobi ma'nosida; HTTP ma'nosida o'quvchi prozasida yo'q. Qolipning standart yozuvlari («N/2 · to'g'ri javob»; «To'g'ri javobni tanlang» yorlig'i yozilmaydi — SABOQ 6) — platforma matni, o'zgartirilmadi.
14. **«himoya» so'zi** dastur natijasida («kod himoyaga tayyor») — o'quvchi matniga olinmadi (T-015: 3–5-darslarda «himoya» — token bilan). 11-moduldagi ommaviy himoyaga ko'prik kerak bo'lsa — boshqa so'z bilan.
15. **`synchronize: true` va birlashtirish** — auditor 9-darsda yopishni talab qildi (08, 09-auditlar). M-q2 A bo'yicha kod o'zgarmadi; A3 4-qadamga jadval fayli tekshiruvi qo'shildi. ✅ 05.10 GATE M 09-q0 A: M-q2 qoladi, kod o'zgarmaydi.

## Shubhali joylar (ishonchim to'liq emas)
- **«base repository» yozuvi va fork'dagi sukut:** docs.github.com da faqat rasm izohida («base repository and branch»); fork'da PR asosiy repo'ga qarashi — GitHub hamjamiyati sahifasidan, docs'da to'g'ridan yozilmagan. Darsdan oldin brauzerda bir marta ko'rish kerak.
- **«Review changes» va «Submit review»:** docs'ning ikki maqolasi ikki xil yozadi — «Reviewing proposed changes»: «Review changes» → … → «Submit review»; «Commenting on a pull request»: «Submit review» → … → «Submit review».
  GitHub'ning yangi «Files changed» ko'rinishida birinchi tugma nomi boshqacha bo'lishi mumkin. Bitta izoh uchun tugma docs'da «Comment» (eski nomi «Add single comment») — darsda «Start a review» ishlatildi.
- **Ko'k «+» belgisi:** docs matnida «blue comment icon», rasm izohida «blue plus icon».
- **Netlify «Deploy Preview»:** PR'ga holat va izoh qo'yadi (docs.netlify.com); uning manzili `WEB_ORIGIN` da yo'q — Backend so'rovlari CORS bilan to'silishi mumkin. Darsda «bugun kerak emas» deyildi.
- **8-dars bilan moslik:** 8-dars MD si yozilish jarayonida edi (15:09 versiyasini o'qidim); u o'zgarsa — B-bo'lim va TAYANCHGA SAVOL 3 qayta ko'riladi.
- **Backend'ni to'xtatib tekshirish (A3):** Backend yoqilgach eski token amal qiladi deb oldim (`JWT_SECRET` o'zgarmaydi, 12 soat); 5-dars 2FA tokenni boshqacha bersa — tekshiruv matni o'zgaradi.
- **«Saytsiz ham yuborsa bo'ladi»:** himoya tamoyili (tekshiruv Backend'da bo'lishi kerak); qanday yuborilishi yozilmadi — hujum yo'rig'i emas.
- **Deploy vaqti:** «bir necha daqiqa» — manbasiz son yozilmadi.
- **Hook 2-variant** («So'rovni saytsiz ham yuborsa bo'ladi») — 13 yoshli uchun mavhumroq; «Aynan!» javobi va 0-ekran maketidagi to'liq javob ochib beradi.
- **A2 vaqti (≈22 daq):** ikki PR o'qish, kamida ikki izoh, javoblar — sinf sur'atiga bog'liq; sekin juftlarda bitta izoh bilan cheklash mumkin (o'qituvchi qarori).

## Manbalar (05.10.2026 da ochildi, hammasi 200)
* [M1] GitHub Docs · Hello World — https://docs.github.com/en/get-started/start-your-journey/hello-world
* [M2] GitHub Docs · Creating a pull request — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request
* [M3] GitHub Docs · Creating a pull request from a fork — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork
* [M4] GitHub Community · How to make pull requests to self by default — https://github.community/t/how-to-make-pull-requests-to-self-by-default/3215
* [M5] GitHub Docs · Closing a pull request — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/closing-a-pull-request
* [M6] GitHub Docs · Pull request reviews — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews
* [M7] GitHub Docs · Reviewing proposed changes in a pull request — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request
* [M8] GitHub Docs · Commenting on a pull request — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request
* [M9] GitHub Docs · Merging a pull request — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request
* [M10] Render Docs · Deploying on Render — https://render.com/docs/deploys
* [M11] Netlify Docs · Deploy Previews — https://docs.netlify.com/site-deploys/deploy-previews/

✎ Ro'yxat `*` bilan yozildi: `til-lint` URL ichidagi «creating-a-…» bo'lagini so'zlashuv yuklamasi deb ushlaydi (yolg'on topilma); `*` bilan boshlangan qatorni u o'tkazib yuboradi.
  GitHub tugma nomlari docs matnidan; [M4] — rasmiy hujjat emas, hamjamiyat javobi (shubhali joylar).

---

## Qurilish (06.10.2026, F-1005-184) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- Bitta vizual `PR_NAMUNA` + `IZOHLAR` → `PrMaket` (chizilgan GitHub PR, logotipsiz; «Open» yashil, «Merged» accent); `TarmoqChizma` (prod/main, «Render · Netlify»); `EgaSahifa` — telefon chapda, manzil telefon brauzerida.
- T-036: A2 4-qadam «A3 da» → «3-amaliyotda»; A3 «Ortda» izohi «o'tgan moduldagi deploy'dan».
- Joylashuv (SABOQ 21): 2-ekranda telefon chapda (MD «eng o'ngda»), yo'l tugmalari chizma ostida; 4-ekranda telefon chapda, PR o'ngda, bo'laklar ostida bitta katta karta.
- Sig'ish (SABOQ 25): 0-ekran diff'idan yopuvchi `}),`, 4-ekrandan `)}` olindi; 1, 4-ekran PR oynasi manzil qatorisiz; A2 natijasida «Open · main ← prod» yo'q; uzun qatorlar qisqartirilgan, ⛶ da to'liq.
- 1-ekran «Tuzatildi» javob belgisi yonida; 4-ekran QIzoh — natija blokining birinchi qatori; 0-ekran chegara kodi `throttlers: [{ ttl: 60_000, limit: 60 }]` (QAROR 10M-58 namunasi).
- «Files changed» 5 fayl ro'yxati ekranda ishlatilmadi; `kimga: «Siz → terminal»` ishlatilmadi. `lessonTitle.ru` «День проекта: вывод в прод — часть 2».
- Qolip takliflari: QBlok `ortdaSarlavha` prop (accent «faqat mentor bilan» ogohlantirishi) · QYakun `uyga` siz `keyingi` ko'rsatilsin — MEXANIZM-TAKLIF 6.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-08` «Loyiha kuni: prodga ko'tarish — 1-qism» → **`m8-09` «Loyiha kuni: prodga ko'tarish — 2-qism»**
  (osti «code review: har qarorni tushuntirasiz» — reja 02-qadamida so'zma-so'z) → `m8-10` «Bir yilda nimalarni qurdingiz?» (App.jsx 336–338, grep).
- [x] Bitta misol-ip («Maydon», repo `maydon`) · metafora yo'q · keyssiz · bitta vizual dars bo'yi — `PrMaket` (+ uning qismlari: tarmoq chizmasi, `EgaSahifa`, `IZOHLAR`).
  Ikkinchi misol yo'q; o'quvchining eng yaxshi loyihasi — faqat 5-qadamlarda.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (yo'l tugmasi → tarmoq chizmasi + ega maketi), 4 (bo'lak → `App.jsx` qatori, ega maketi, izoh/javob pufagi); 0-ekran ham javobdan keyin o'zgaradi.
- [x] Sarlavhalar ≤55 bitta qator (46–53) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 (98, 105) · hook javobi ≤120 (88–102) ·
  to'g'ri izoh ≤60 (57, 59) · xato izohlari ≤60 (42–53). Sanoq python bilan (belgi soni, backtick va `**` sanalmaydi).
- [x] Atamalar tayanch bilan bir xil: Pull Request (PR) · code review (birinchi marta Mentor gapida, hodisa avval — T-011) · talab · agent · tekshirish; «kod ko'rigi», «merge request», «sinov», «himoya», «server», «baza» yo'q ·
  «izoh», «javob», «qator», «Sabab» — har biri bir ma'noda (A-bo'lim 4) · siz-forma; promptlar sen-formada (T-002) · tugmalar ot-shaklda yoki GitHub yozuvi (T-033).
- [x] Testlar: variantlar 36–38 va 45–49 belgi, to'g'ri variant yolg'iz eng uzun emas; «PR» / «tekshir» / «agent» kamida ikki variantda; qavs va strelka yo'q ·
  ✔ o'rni: 3-ekran C, 5-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi; 4-ekran bo'laklari tartibi kodda aralashtiriladi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — o'quvchi matnida yo'q).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «m8-09», «10-Modul», «4c-Modul» yo'q; blok o'quvchiga «Amaliyot 1») · tarixiy voqea va real kompaniya raqami yo'q · «KOD» (11) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/011/014/015/016/029/039/042/043/047/048/049/052/064 · P-001/008/010/013/014/015/020/026/028/036/046/052/057/062/063/064/067 · S-001/002/003/004/006/008/009/010/015/020/026/040 — ko'rildi.
- [ ] P-028 (tashqi qadam): GitHub yozuvlari docs.github.com dan tekshirildi (A-bo'lim 3), lekin «base repository» sukuti va «Review changes» nomi — shubhali joylarda; darsdan oldin brauzerda bir marta ko'rib chiqish kerak.
- [ ] Tayanchda yo'q yoki boshqa darsga bog'liq qarorlar — TAYANCHGA SAVOL 1 (Mentor PR joyi), 2 (deploy tarmog'i), 3 (`/ega` kamchiligi — 8-dars holati), 5 («Ortda qoldingizmi»); 8-dars MD si bilan solishtirish kerak.
