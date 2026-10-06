# 12-Modul (kod: `src/10-Modull`) · 8-dars (PM + amaliyot) «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?» — MD v3

Fayl: `src/10-Modull/PmDropOffLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-08` · **12 ekran** (kirish, reja, tushuncha, test · Amaliyot 1 · voqea · mustaqil ish · Amaliyot 2 · yakuniy savol, podium, kartochkalar, yakun; tayanch 4 «PM+PRAKT» — 8-darsda Amaliyot 1 mustaqil ishdan oldin: sonlar avval kerak) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta) · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q ·
ekranda ≤ 3 blok · telefon yoki brauzer maketi chapda, ustunlar va jadval o'ngda · telefon ramkasi ≈170×272, kichraymaydi · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 8-ekran — **A** (`correctIdx 0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 404–406, grep 06.10, DE-205): `m10-07` «50 foydalanuvchiga qanday yetasiz?» → **`m10-08` «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?»** (osti: «qadamlar bo'yicha sanoq, gipoteza va shu darsda tuzatish», `type: 'PM'`) → `m10-09` «Loyiha kuni: foydalanuvchini qaytaradigan eslatma».
Tur (PM-005): **gibrid — PM qismi 1-tur (texnikaga yaqin: artefakt — o'quvchining qadamlar sanog'i va gipotezasi) + amaliyot (repo, ikki blok)**. Namuna tuzilmasi — 10-Modul `04-PmAbTest-v3.md` (gipoteza), `03-LiveDashboard-v3.md` (sanoq sahifasining oldingi ko'rinishi — dashboard), 11-Modul `13-PmAudienceTest-v3.md` (to'xtashdan tuzatishgacha) va ularning FILTR fayllari; pilot `07-PmFiftyUsers-v3.md` (PM+PRAKT shakli).
Keys — **K6 Netflix** (tayanch 5, Qaror-0 22; bank asli — `PM_Prompt_v8.md` 198–202-qatorlar). REPO — `maydon-jamoa` (`m12-dars-08-start` = `m12-dars-07-done` → `m12-dars-08-done`).
**Vaqt: ≈ 90 daqiqa** — kirish va reja ≈ 5 · tushuncha va 1-savol ≈ 12 · Amaliyot 1 ≈ 20 · Netflix ≈ 6 · o'z sonlaringiz ≈ 10 · Amaliyot 2 ≈ 22 · yakuniy savol, podium, kartochkalar, arena ≈ 12 · zaxira ≈ 3. Har blokda «Ulgurmasangiz» yo'li; o'rnatish fayli navbati dars oqimini to'xtatmaydi (A2 4-bo'lim).
Manba: `00-MODUL-TAYANCH.md` (1.0 — 12-Modul o'zgarishlari, mehmon ko'rinishi · 1.7 — qadamlar, hodisalar, qurilma ID, `namuna`, sinfdoshlar, APK · **1.8 — Mentor sonlari, foizlar, ikki to'xtab qolish qadami, gipoteza, sanoq sahifasi, mehmon ko'rinishi, yangi versiya, tuzatishdan keyingi sonlar — AYNAN** · 1.13 — sonlar jadvali · 2 — atamalar · 3 — repo, `.env`, teg 08 · 5 — K6 · 6 — Render, socket.io, EAS, brauzer ko'rinishi · 7 — oldindan tuzatiladigan sinflar · 8 — `pm-m10d7-reja` → `pm-m10d8-qadamlar` · 9 — to'lqin kelishuvlari, ayniqsa 9.3–9.6, 9.19, 9.20) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 10, 13, 16, 22, 23) · `00-TAQIQLAR.md` · `00-MANBA.md` 4–6 · 11-Modul tayanchi (1.0, 1.7, 1.8, 2, 9.3, 9.29, 9.74, 9.81, 9.84, 9.92) · 10-Modul `03-LiveDashboard-v3.md`, `04-PmAbTest-v3.md` (gipoteza shakli, «chunki» — 04-FILTR 1).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «GIBRID: … qayerda ketishadi → gipoteza → shu darsda tuzatish», natija «2 ketish nuqtasi topilgan, iteratsiya chiqarilgan»; tayanch 4: «ikki to'xtab qolish qadami topilgan; bitta gipoteza bo'yicha tuzatish chiqarilgan»):
   o'quvchi o'z ilovasida sanoq sahifasini quradi (maxfiy kalit bilan yopiq, o'zi yangilanadi), o'z sonlaridan ikki to'xtab qolish qadamini topadi, bittasi uchun gipoteza yozadi, shu gipotezadagi bitta o'zgarishni agent bilan quradi, o'zi tekshiradi va yangi versiyani chiqaradi.
   Saqlanadi: `pm-m10d8-qadamlar` (9, 10-darslar o'qiydi). Repo'da (tayanch 3, `m12-dars-08-done`): `GET /hodisalar/sanoq` (`SANOQ_KALITI`), `lending/sanoq.html` (o'zi yangilanadi) · mehmon ko'rinishi (`GET /oyinlar` tokensiz).
   Mentor misoli — namuna va «kutilgan natija», umumiy qolip emas (tayanch 7.2b): to'rt qadam, mehmon ko'rinishi, «ro'yxatdan o'tish birinchi» — Mentor qarori.
2. **Bugungi asosiy fikr (P-013):** Bu darsda qadamlar sanog'i qaysi oraliqda kamroq qurilma keyingi qadamga o'tganini ko'rsatadi, gipoteza esa nega shunday bo'lganini taxmin qiladi va bitta tuzatish bilan tekshiriladi.
   (Yakunda ScoreRing ostida, `small`; kartochkalarda so'zma-so'z yo'q.)
3. **O'tilgan — qayta o'rgatilmaydi, bir gap bilan eslatiladi (T-052):**
   - 7-dars (shu modul): **qadamlar** — ochdi → ro'yxatdan o'tdi → qo'shildi → kelishini tasdiqladi (yorliqlar; hodisalar `ochdi` · `royxatdan-otdi` · `qoshildi` · `tasdiqladi`), `hodisalar` jadvali (`id` · `nom` · `qurilma_id` · `yaratilgan`), `POST /hodisalar`, `hodisaYoz(nom)` ·
     **sanoq sharti** — har qadamda turli qurilmalar soni; o'quvchining o'z qurilmasi ham sanaladi · **qurilma ID** · **ro'yxatdan o'tgan** va **asosiy harakatni qilgan** (ikki sanoq; `oyinchilar.namuna = false` — namuna va tekshiruv akkauntlarisiz; sinfdoshlar — o'quvchi bilsa, alohida aytiladi — 9.5, 9.6, 9.39 e) ·
     **login** · **APK** · **brauzer ko'rinishi** · lendingdagi ikki havola «Android: ilovani o'rnatish» · «iPhone: brauzerda ochish».
   - 2-dars va 4-dars (shu modul): **doimiy ulanish** (ilova bir marta ulanadi, ulanish ochiq turadi, Backend istagan payt yubora oladi) · **xona** (Backend'dagi ulanishlar guruhi). Bu darsda faqat sanoq sahifasining o'zi yangilanishi uchun, bir gapda.
   - 10-Modul: **foiz** (qadamdan qadamga o'tganlar foizi) · **gipoteza** — «Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin; «chunki» — nega shunday kutayotganimiz (04-FILTR 1) · **dashboard** (bir marta ko'prik: «10-Modulda bunday sahifani dashboard degansiz») · brauzer ID va inkognito oyna (web-trek).
   - 11-Modul: «Maydon Jamoa», «Kirish» ekrani, «Hisobdan chiqish», «Qo'shilaman», «Kelaman», `GET /oyinlar` (9.29), **talab** (qayerda · nima qilsin · nima buzilmasin), **agent** (Antigravity), **tekshirish** (o'z ishi), Render, Neon SQL Editor «Run», Expo Go; 13-dars — sinovchilar qayerda **to'xtaganini** kuzatish (bu darsda ko'prik: kuzatuvdan sanoqqa).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi so'zma-so'z (T-042):**
   - **to'xtab qolish qadami** — keyingi qadamga o'tganlar foizi past bo'lgan joy; **bu darsda foizi eng past ikki oraliq olinadi** (dastur: «2 ketish nuqtasi»; 2-ekran, uchala oraliq bosilgandan keyin). Ortidan bitta qo'shimcha: «uni foiz ko'rsatadi» — eng kichik son emas. 08-FILTR 1: avvalgi «eng kichik bo'lgan joy» bitta joy berardi, darsda esa ikkitasi olinardi.
   - **sanoq sahifasi** — qadamlar sonini maxfiy kalit bilan ko'rsatadigan sahifa (`lending/sanoq.html`; kalitni bilgan har kim ochadi — kalit egada turadi, 08-FILTR 6); 10-Modul so'zi «dashboard» — bir marta ko'prik (A1 kirish qatori).
   - **mehmon ko'rinishi** — kirmagan odam ko'radigan ekran: o'yinlar ro'yxati bor, harakat uchun ro'yxatdan o'tish kerak (A2, 4-bo'lim (1) dan keyin). Ishlatilmaydi: gost, demo rejim.
   - **yangi versiya** — atama emas, oddiy so'z: tuzatilgan kod odamlarga yetadigan holat (Backend yangilandi, mobil trekda yangi o'rnatish fayli lendingda).
   - **tavsiya** (faqat Netflix voqeasida) — xizmat odam ko'rgan narsalarga qarab taklif qiladigan film yoki serial (bankdagi «tavsiyalar ko'rish tarixidan yig'iladi» — tayanch 5).
   - Kartochkada bir marta: «inglizchasi: funnel» (tayanch 2, «qadamlar» qatori). «Voronka» so'zi va obrazi yo'q (`00-TAQIQLAR.md` 3) — ustunlar teng kenglikda, torayib boradigan shakl chizilmaydi.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **hodisa** — bu darsda faqat analitika hodisasi (`ochdi` …; tayanch 2: 7, 8, 10-darslar). Sanoq sahifasini yangilaydigan `sanoq-ozgardi` o'quvchi matnida «hodisa» deb atalmaydi: «Backend sahifaga ulanish orqali aytadi», promptda — faqat nomi (TAYANCHGA SAVOL 3).
   - **qadam** — faqat foydalanuvchi yo'li bo'lagi. Amaliyot blokidagi bo'laklar o'quvchi matnida «1 · Ochish», «2 · Prompt» — «bo'lim», «qadam» emas. **oraliq** — ikki qadam orasidagi joy (ustunlar orasi; 2, 3, 6-ekranlar). «o'tish» so'zi yolg'iz ishlatilmaydi — «ro'yxatdan o'tish» bilan aralashadi (T-070).
   - **qurilma** — qadamlardagi birlik; **akkaunt** — Database'dagi birlik («ro'yxatdan o'tgan akkauntlar»). Ikkalasi ayirilmaydi va «teng bo'lishi kerak» deyilmaydi (tayanch 7.5, 1.13). «odam» — faqat ta'rifda va savolda (tayanch 2 so'zi).
   - **tekshirish** — o'z ishini ko'rish (blokdagi «Tekshirish», tekshiruv akkaunti); **sinov** — faqat real odam bilan (bu darsda yo'q). **tuzatildi** — tuzatish qilindi va o'zingiz tekshirdingiz (ish fakti); gipoteza to'g'rimi — keyingi kunlardagi sonlar (natija, alohida).
   - **e'lon** — faqat o'yin e'loni. **push** — faqat `git push`. **o'rnatish fayli** — APK tayyorlanishi («build» — faqat `eas build` buyrug'ida). **kanal**, **bosqich** — bu darsda ishlatilmaydi.
   - **Ishlatilmaydi:** voronka, drop-off, ketish nuqtasi, otval, konversiya, ulush, iteratsiya, event, retention, admin panel, gost, demo rejim, build (prozada), «faol foydalanuvchi», «hisoblanadi» (bog'lama).
6. **Raqamlar (faqat tayanch 1.8 va 1.13, «Mentor misolida»; boshqa son yo'q):**
   - ishga tushirilganidan 3 kun keyin, har qadamda turli qurilmalar: **ochdi 46 · ro'yxatdan o'tdi 27 · qo'shildi 12 · kelishini tasdiqladi 9**; foizlar **59 · 44 · 75** (27 ni 46 ga, 12 ni 27 ga, 9 ni 12 ga — butun songa yaxlitlab; hisob, yangi fakt emas); o'tmaganlar — **19** va **15** (tayanch), oxirgi oraliqda 3 (hisob).
   - Database: ro'yxatdan o'tgan akkauntlar **27** (bu misolda qadam soni bilan teng chiqdi; biri qurilma, biri akkaunt) · shundan sinfdosh **11** · asosiy harakatni qilgan **13** (faqat O'qituvchi eslatmasida — «qo'shildi 12» bilan ayirilmaydi).
   - tuzatishdan keyin kelgan qurilmalar (ochdi 15 · ro'yxatdan o'tdi 11 — 73%) — **bu darsda ko'rsatilmaydi** (08-FILTR 15: tayanch 1.8 bo'yicha 10-darsda; 8-dars faqat «gipoteza keyingi sonlar bilan bilinadi» deydi).
   - Netflix (bank, yili bilan): **2016** — ko'rishlarning **qariyb 80 foizi** tavsiyalardan. EAS: oyiga **15** bepul Android build (tayanch 6) · Mentor misolida navbat **≈25 daqiqa** (va'da emas, 1.7).
   - Mashq sonlari (Mentor misoli emas; 3-ekran testi, kulrang yorliq «mashq uchun»): 40 · 30 · 10 · 8 (TAYANCHGA SAVOL 11). Arena 4 (20 dan 15) va arena 6 (30 va 28) — mashq sonlari.
   Har son yonida nima sanalgani: qurilma · akkaunt · foiz. «kishi» qadamlar sonida ishlatilmaydi.
7. **Xavfsizlik va maxfiylik (`00-TAQIQLAR.md` 2, tayanch 3, 7.3, 7.14):**
   `SANOQ_KALITI` — maxfiy kalit: `backend/.env` va Render'ning Environment bo'limida; agentga, chatga, repo'ga, lendingga yozilmaydi; agent faqat nomini biladi · kalit sahifada faqat ochiq turganda (yangilansa — qayta so'raladi); kalit chiqib ketsa — `.env` va Render'da yangisi qo'yiladi · kalit bilan ulangan ulanish faqat `sanoq` xonasiga kiradi (08-FILTR 7) · sanoq sahifasida faqat sonlar — ism, login, qurilma ID ko'rsatilmaydi ·
   mehmon ko'rinishida boshqa o'yinchilarning ismi yo'q — tokensiz javobda faqat ruxsat etilgan maydonlar: `id, kun, soat, maydon, kerak, qoshilgan` (08-FILTR 12, 13) · agentga xato yuborilganda «`.env` qiymatlari, token va kalitlarni emas» · `.env` — `git status` da ko'rinmaydi (A1 1-bo'lim) ·
   ikkinchi qurilma tekshiruvida sherik o'z telefonida havoladan ochadi — akkaunt ma'lumoti berilmaydi · telefon raqami hech qayerda so'ralmaydi (7-darsdan login).
8. **Vaqt (tayanch 4 «Vaqt», 7.10):** taqsimot sarlavha ostida. Bloklar pilotda taymer bilan o'lchanadi. «Ulgurmasangiz»: A1 — sonlar Neon SQL Editor'dan (7-dars so'rovi) · A2 — tuzatish tekshirilib push qilinadi, o'rnatish fayli va havola uyda.
   O'rnatish fayli navbati (Mentor misolida ≈25 daqiqa) — A2 oxirida boshlanadi, kutilmaydi: o'quvchi yakuniy savolga o'tadi; havola tayyor bo'lgach lendingga qo'yiladi (yakun sarlavhasi shuni aytadi, 11-ekran).
   7-darsdagi sanoq yoqilmagan o'quvchi — A1 1-bo'limdagi qator; ilova hali odamlarga yuborilmagan yoki sonlar yo'q o'quvchi — 6-ekrandagi «Sonlarim hali yo'q» yo'li (mashq sonlari, TAYANCHGA SAVOL 9).
9. **Amaliyot bloki (tayanch 4):** o'quvchi 4 bo'limning hammasini **o'z repo'sida, o'z mahsuloti va trekida** bajaradi (trek — `pm-m9d8-platforma.trek`; yo'q bo'lsa — tanlov shu kalitga yoziladi); Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam» ortida — to'liq prompt); 5-bo'lim yo'q.
   **Talab zinapoyasi (MD_TOPSHIRIQ_2, 8):** A1 — tayyor talab + bitta joy `{nimani sanasin}` · A2 — bitta qatorni o'quvchi yozadi («Nima qilsin» — gipotezadan). Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.»
   Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» (faqat xato qatori). Push odati: `git diff` → `git status` → `git add <fayl>` → commit → `git push` (`git add .` emas). Push'dan keyin Render'da yangi deploy tugashini kutish (11-Modul 9.82). Har blokda **web-trek qatori** aniq.
10. **Keys — K6 Netflix** (tayanch 5; bank asli — «Manbalar»): bank so'zi aynan — bosh sahifa har kimda o'ziniki, tavsiyalar ko'rish tarixidan yig'iladi · ko'rishlarning qariyb 80 foizi qidiruvdan emas, tavsiyalardan keladi (Netflix ochiq bayonoti, 2016).
    Brend izohi (S-018, 5-ekranda bir marta): «Netflix — film va serial ko'rsatadigan xizmat». Ko'prik — «bu voqeada …» bilan, umumiy joy: son yo'lni ko'rsatadi (Netflix'da — ko'rishlar qayerdan kelishini, sizda — qaysi qadamda to'xtab qolishayotganini). Netflix'ning ichki qarorlari, boshqa sonlar va yillar aytilmaydi (PM-016, PM-018).
11. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; telefon, brauzer, Netflix sahnasi chizilgan (CSS/SVG), logotip yo'q; «Maydon Jamoa» — telefon ramkasida, lending va sanoq sahifasi — brauzer oynasida; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno.
    Matn o'lchovi (python bilan sanalgan, qavsda): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 · test variantlari ±15%.
12. **Fakt-manbalar (o'quvchi ko'rmaydi; to'liq — «Manbalar»):** Render Environment bo'limi — render.com/docs (06.10 ochildi) · Netlify buyruq bilan chiqarish va Git bilan ulash — docs.netlify.com, docs.expo.dev (06.10) · socket.io brauzerdan boshqa manzilga ulanishda CORS — socket.io/docs (06.10) ·
    socket.io `auth`, xona, qayta ulanish — tayanch 6 · EAS (`eas build -p android --profile preview`, oyiga 15 ta, navbat) — tayanch 6 · `GET /oyinlar` javobi — 11-Modul tayanchi 9.29 · namuna o'yin `id` — `1` (tayanch 9.20).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 7-darsda ilova odamlarga yuborildi va qadamlar sanala boshladi (Mentor misolida ishga tushirish kuni ro'yxatdan o'tgan 20). Uch kun o'tdi: sonlar bor, lekin ular hali bitta sahifada emas va nima deyayotgani o'qilmagan. Bugun — sanoq, to'xtab qolish qadami, gipoteza va bitta tuzatish.
- **Dars ipi:** 0 — 46 ta qurilmada ochildi, 9 tasida kelish tasdiqlandi: qolganlari qayerda qoldi, qanday bilasiz (ballsiz) → 2 — qadamdan qadamga foiz: ikki to'xtab qolish qadami, eng kichik son — undan emas → 3 — test: mashq sonlarida to'xtab qolish qadami →
  A1 — sanoq sahifasi: kalit bilan yopiq, o'zi yangilanadi → 5 — Netflix: son yo'lni ko'rsatadi → 6 — o'z sonlari: ikki to'xtab qolish qadami, bittasiga gipoteza → A2 — gipotezadagi bitta o'zgarish, tekshirish, yangi versiya → 8 — yakuniy savol: gipoteza qachon bilinadi →
  podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Qadamlar sanog'i»** (`QADAM_SANOQ` const → `QadamSanoq`, dars bo'yi, 163/180; bitta manbadan: Mentor sonlari, foizlar, telefon ekranlari, sanoq sahifasi, mashq sonlari):
  - **chapda maket** (holatga qarab bittasi, o'lchami barqaror — SABOQ 22): **telefon** («Maydon Jamoa» nomi o'z rangida; ekranlar: «Kirish» — Login · Parol · «Kirish» · pastda «Ro'yxatdan o'tish» · «O'yinlar» — «Shanba, 18:00 · Mahalla maydoni · 8 / 10» · «O'yin» — «Kelaman» · mehmon «O'yinlar» — tepada «Kirish» havolasi) yoki
    **brauzer** (`maydon-jamoa-….netlify.app/sanoq.html` — kalit maydoni yoki «Maydon Jamoa · sanoq» sahifasi).
  - **o'ngda to'rt ustun** — teng kenglikda, balandligi songa mos (noldan), ostida yorliq (ochdi · ro'yxatdan o'tdi · qo'shildi · kelishini tasdiqladi), ustida son; ustunlar orasida uchta **oraliq** yorlig'i (bo'sh — uzuq chiziq, U-041; ochilgach «46 dan 27 — 59%»).
    Holatlar: oraliq foizi `err` fon (to'xtab qolish qadami) · `ok` fon · ustun ostida yorliq «to'xtab qolish qadami». Torayib boradigan shakl yo'q (voronka obrazi taqiq).
  - Ishlatiladi: 0 (telefon «O'yinlar» + ustunlar: faqat 46 va 9, o'rtadagi ikkitasi bo'sh) · 1 (o'zi yuradi, sonsiz) · 2 (telefon + ustunlar + oraliqlar) · 3 (kichik mashq kartasi) · A1 o'ngi (brauzer — sanoq sahifasi; telefon — yangi qurilma) · 5 (Netflix sahnasi 3/3 da ustunlarga ulanadi) · 6 (o'quvchining o'z ustunlari, bitta ustun joylashuvi) · A2 o'ngi (telefon — mehmon «O'yinlar») · 8 (kichik karta).
    `prefers-reduced-motion` da ustunlar o'smaydi, sonlar sanab chiqmaydi, holatlar bir zumda almashadi.
- **Mentor misolining holati (tayanch 3):**

| | Dars boshida (`m12-dars-08-start` = `07-done`) | Dars oxirida (`m12-dars-08-done`) |
|---|---|---|
| Sanoq | qadamlar `hodisalar` ga yoziladi; sonni faqat Neon SQL Editor ko'rsatadi | `GET /hodisalar/sanoq` (kalitsiz `401`) · `lending/sanoq.html` — kalit bilan, o'zi yangilanadi (`sanoq` xonasi, `sanoq-ozgardi`) · `SANOQ_KALITI` — `backend/.env` va Render'da |
| Ilova ochilganda | token yo'q — «Kirish» ekrani | token yo'q — mehmon ko'rinishi: «O'yinlar» (kun, soat, maydon, «8 / 10»); «Qo'shilaman» → «Ro'yxatdan o'tish» |
| `GET /oyinlar` | faqat token bilan | tokensiz ham — `men…` maydonlari va ismlarsiz; ro'yxat mehmonda ekran ochilganda va pastga tortganda yangilanadi |
| O'rnatish fayli | 7-dars fayli (eski «Kirish» birinchi ekran) | yangi fayl; lendingdagi «Android: ilovani o'rnatish» havolasi almashtirilgan |

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Foydalanuvchilar qaysi qadamda to'xtab qolyapti?** (48) — dars nomi (DE-205)
- Mentor: Mentor misolida 3 kunda ilova 46 ta qurilmada ochildi, o'yinga kelish esa 9 tasida tasdiqlandi. Ikki javobdan birini tanlang.
- Maket (chap): telefon — «Maydon Jamoa» (nomi o'z rangida), «O'yinlar» ekrani: «Shanba, 18:00 · Mahalla maydoni · 8 / 10».
  O'ngda to'rt ustun: «ochdi» — 46 · «ro'yxatdan o'tdi» — bo'sh · «qo'shildi» — bo'sh · «kelishini tasdiqladi» — 9 (bo'sh ustunlar uzuq chiziqli, U-041). Ustunlar tepasida kulrang yorliq: Mentor misolida · 3 kun · turli qurilmalar.
- Savol: **Boshqalari qaysi qadamda to'xtaganini qanday bilasiz?**
- Variantlar (radio, o'ng; bir uzunlikda):
  - A — Foydalanuvchilarning o'zidan so'rab bilaman (43)
  - B — Har qadamda nechta qurilma borligidan bilaman (45)
- Javob — B: **Aynan!** Sanoq qaysi oraliqda kamroq qurilma o'tganini bir qarashda ko'rsatadi. Nega — hali taxmin. (90)
- Javob — A: **Qiziq fikr!** So'rash qayerda va nega to'xtaganini aytadi. Hamma qadamni bir xil solishtirish uchun esa sanoq kerak. (102)
- **Harakat → Vizual o'zgarish:** variantni tanlash → o'rtadagi ikki bo'sh ustun navbat bilan (100 ms) yengil to'lqin oladi va uzuq chizig'i accent rangga kiradi — keyin to'ldiriladigan joy. Son yozilmaydi (2-ekran kashfiyoti, P-036). Ikkala tanlovda vizual bir xil — payoff hech bir javobni rad etmaydi (KORPUS §21).
- Ballsiz. Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha ikki variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: qo'l ko'tartirib so'rang: «7-darsdan keyin ilovangizni kimdir ochdimi? Sonini ko'rdingizmi?» Ikkala javob teng: so'rash (11-Modul intervyulari va sinovi) «nega»ni topadi, sanoq «qayerda»ni ko'rsatadi — bugun sanoq, «nega» esa gipoteza bo'lib qoladi.
  Ilovasi hali odamlarga yuborilmagan o'quvchi uchun 6-ekranda mashq sonlari yo'li bor — buni hozir aytib qo'ying, baho emas.
- ✎ Hook — o'quvchi o'zi qilgan ish (7-darsda ilova yuborildi, qadamlar sanaldi) va o'z savoli (P-016). Sarlavha — dars nomi; savol qatori uni «qanday bilasiz» bilan davom ettiradi, variantlar shu savolga javob beradi (KORPUS §57). Javoblarning ikkinchi gapi «nega»ni gipotezaga ko'prik qiladi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun sanoq ko'rsatgan bitta joyni tuzatasiz.** (45)
- Mentor: 11-Modulda uch sinovchi qayerda to'xtaganini kuzatgansiz — bugun buni har qadam sanog'i ko'rsatadi. Kodni agent yozadi, qaysi qadamni tuzatishni siz tanlaysiz.
- Chap — kulrang yorliq (App.jsx osti, so'zma-so'z — P-015): «qadamlar bo'yicha sanoq, gipoteza va shu darsda tuzatish»; ostida vizual bir marta o'zi yuradi (DE-200): telefonda «Maydon Jamoa» ochiladi → o'ngda to'rt kulrang ustun sonsiz o'sadi →
  ikki oraliq ustida kulrang belgi yonadi (foizsiz — 2-ekran kashfiyoti ochilmaydi) → telefonda ekran almashadi (matnsiz) → ostida yashil qator «yangi versiya».
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Har qadamda nechta qurilma borligini sanaysiz · `sanoq`
  - 02 · Qaysi qadamga kam odam o'tganini foizdan topasiz · `foiz`
  - 03 · Bittasi uchun gipoteza yozasiz · `gipoteza`
  - 04 · Tuzatishni tekshirib, yangi versiyani chiqarasiz · `yangi versiya`
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m12-dars-08-start` · namuna `m12-dars-08-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.
- Pastki qator 2 (kichik; faqat `pm-m10d7-reja.tekshiruv.olchov` yo'q yoki `false` bo'lsa): Ilovangizda qadamlar hali sanalmasa — Amaliyot 1 ning birinchi bo'limi nima qilishni aytadi.
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011): «to'xtab qolish qadami», «sanoq sahifasi», «mehmon ko'rinishi» — keyingi ekranlarda. Reja ta'rif aytmaydi va 2-ekran sonlarini ochmaydi (P-015); «ikki» to'xtab qolish qadami ham aytilmaydi (2-ekran bashorati).
  Mentorning birinchi gapi — 11-Modul 13-dars bilan ko'prik (P-020): u yerda uch kishini kuzatish, bu yerda qurilmalar sanog'i.

## 2 · Qadamlar va foiz  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · qadamlar
- Sarlavha: **Qadamdan qadamga necha foiz o'tdi?** (34)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Mentor misolining 3 kunlik sanog'i tayyor — avval javobingizni belgilang.
  - 1/3–3/3: Keyingi oraliqni bosing — telefonda shu qadam ekrani ochiladi.
  - 3/3 dan keyin: Foizlarni solishtirib, «Davom etish»ni bosing.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»): **Qaysi qadamga o'tganlar foizi eng kichik?** · Ro'yxatdan o'tdi · Qo'shildi · Kelishini tasdiqladi
  — variantlar yo'l tartibida (bitta o'lchov — qadamning yo'ldagi joyi); tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi.
- Vizual: chapda **telefon** («Maydon Jamoa», bosh ekran) · o'ngda **to'rt ustun** sonlari bilan — **ochdi 46 · ro'yxatdan o'tdi 27 · qo'shildi 12 · kelishini tasdiqladi 9**, tepada kulrang yorliq «Mentor misolida · 3 kun · har qadamda turli qurilmalar»;
  ustunlar orasida uchta bo'sh oraliq (uzuq chiziq). Oraliqlar bashorat tanlangunicha bosilmaydi. Ekranda uch blok: telefon · ustunlar · harakat tugmasi (SABOQ 26).
- **Harakat → Vizual o'zgarish** (oraliqlar tartibda, bittasi halqada; N/3):
  1. 1-oraliq (ochdi — ro'yxatdan o'tdi) → yorliq sanab chiqadi: **46 dan 27 — 59%**, ostida kulrang «19 tasi o'tmadi»; telefonda «Kirish» ekrani ochiladi: Login · Parol · «Kirish» · pastda «Ro'yxatdan o'tish».
  2. 2-oraliq (ro'yxatdan o'tdi — qo'shildi) → **27 dan 12 — 44%**, «15 tasi o'tmadi»; telefonda «O'yinlar»: «Shanba, 18:00 · Mahalla maydoni · 8 / 10» va «Qo'shilaman».
  3. 3-oraliq (qo'shildi — kelishini tasdiqladi) → **12 dan 9 — 75%**, «3 tasi o'tmadi»; telefonda «O'yin»: «Kelaman».
  3/3 dan keyin: 59% va 44% yorliqlari `err` fon oladi, «ro'yxatdan o'tdi» va «qo'shildi» ustunlari ostida yorliq **to'xtab qolish qadami**; 75% — `ok` fon; «9» ustuni yonida kulrang qator «eng kichik son — 75% o'tgan».
- Joriy qator (3/3 dan keyin, bitta): Keyingi qadamga o'tganlar foizi past bo'lgan joy to'xtab qolish qadami deyiladi; bu darsda — eng past ikkitasi. (111)
- Natija qatori (`QTaxmin`, xulosaning birinchi qatori — SABOQ 25): «Taxminingiz: … · haqiqatda: qo'shildi — 44%, ro'yxatdan o'tdi — 59%» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda to'xtab qolish qadamlari — ro'yxatdan o'tish va qo'shilish. Eng kichik son — 9 — ulardan emas. (105)
- Tugadi (199): harakat paneli yopiladi; ustunlar, uch foiz va ikki yorliq butun enga, fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval belgilang → Oraliqni bosing (N/3) → Davom etish
- O'qituvchi eslatmasi: foiz — keyingi qadamdagi sonni oldingisiga bo'lib, 100 ga ko'paytirib, butun songa yaxlitlanadi (27 ni 46 ga — 58,7 → 59). Sonlar — qurilmalar, odamlar emas: bitta odam ikki qurilmada — ikkita; Mentorning o'z telefoni va sinfdoshlar ham bor
  (Database'da ro'yxatdan o'tgan 27 akkauntdan 11 tasi — sinfdosh). «Asosiy harakatni qilgan — 13» (akkaunt, e'lon berganlar ham) va «qo'shildi — 12» (qurilma) — har xil o'lchov, ayirilmaydi.
  Foizlar hammasi baland bo'lsa ham (masalan, 98 va 99) eng past ikkitasi olinadi — lekin bu «muammo» degani emas; o'quvchi buni gipotezada aytadi (08-FILTR 3).
  Sinfga savol: «Nega 9 eng kichik son, lekin to'xtab qolish qadami emas?» — u yerga o'tgan qurilmalar foizi katta (75); oxirgi qadamga kam yetgani — undan oldingi qadamlar tufayli.
- ✎ Bitta g'oya (P-008): foiz → ikki to'xtab qolish qadami → eng kichik son — undan emas. Atama — uchala oraliq bosilgandan keyin (T-011). Holat o'quvchi bosgan oraliqlardan chiziladi (P-046). Telefon ekranlari gipotezaga zamin: 1-oraliqda birinchi ekran — «Kirish» (P-036: matnda aytilmaydi, 6-ekran va Yordamda).

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — mashq sonlari, o'sha olam — P-002)
- Eyebrow: Tekshiruv · to'xtab qolish qadami (savol ustida yorliq yo'q — SABOQ 6)
- Savol ustida kichik karta (kulrang yorliq «mashq uchun · turli qurilmalar»): ochdi 40 · ro'yxatdan o'tdi 30 · qo'shildi 10 · kelishini tasdiqladi 8
- Savol: **Shu sanoqda qaysi oraliqda o'tganlar foizi eng past?** (8 so'z; 08-FILTR 11: «to'xtab qolish qadami qaysi?» — yangi ta'rifda ikkinchi past oraliq ham himoyalanardi)
  - A — Tasdiqlashda: qurilmalar soni eng kichik (40)
  - B — Ro'yxatdan o'tishda: 40 dan 30 tasi o'tgan (42)
  - ✔ C — Qo'shilishda: 30 dan 10 tasi o'tgan (35)
  - D — Ochishda: qurilmalar soni eng katta (35)
- Kalit: **C** (index 2). To'rttalasi bir shaklda («…-da: …»); «qurilmalar soni» A va D da, «dan … tasi o'tgan» B va C da — foizni o'quvchi o'zi hisoblaydi; to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: 30 dan 10 tasi — 33 foiz: oraliqlar ichida eng pasti. (53)
- Xato izohlari (≤60):
  - A: Son kichik, lekin 10 dan 8 tasi o'tgan — 80 foiz. (49)
  - B: 40 dan 30 — 75 foiz. Pastrog'i qaysi oraliqda? (46)
  - D: Ochish — birinchi qadam: undan oldingi son yo'q. (48)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Drop-off Finder — birinchi urinishda to'g'ri.
- Izoh (MD): savolda son yo'q — sonlar kartada (S-019); javob variantlarida faqat B dagi «75» (hisob, kartada yo'q). A — «eng kichik son = to'xtash» yanglishi (2-ekranning o'zi rad etgan) · B — «rost, lekin mos emas» (S-004) · D — ta'rifga zid: oldingi qadam yo'q.
  B — rost son, lekin foizi pastroq oraliq bor (S-004). Mashq sonlari 2-ekrandan boshqa (§106 — slayddan ko'chirib bo'lmaydi); ikkala trekka to'g'ri keladi (qadamlar nomi umumiy).

## A1 · Amaliyot 1 — sanoq sahifasi  ← amaliyot bloki (≈20 daq; `screens[4]`)
- Eyebrow: Amaliyot 1 · sanoq sahifasi
- Sarlavha: **Qadamlar soni bitta yopiq sahifada ko'rinsin.** (45) (08-FILTR 6: umumiy kalit — shaxs emas)
- Mentor: Talab tayyor — qavs ichiga nimani va qanday sanashni yozasiz; «1 · Ochish»dan boshlang.
- Kirish qatori (`QIzoh`, bo'limlar ustida, bir marta; T-011, T-052): Qadamlar sonini maxfiy kalit bilan ko'rsatadigan sahifa sanoq sahifasi deyiladi. 10-Modulda uni dashboard degansiz. (115)
- Bo'limlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingizda va trekingizda — `pm-m9d8-platforma`):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi.
     `backend/.env` ga yangi qator yozing: `SANOQ_KALITI=` va o'zingiz o'ylagan uzun kalit — harf va raqamlar; boshqa joyda ishlatadigan parolingiz emas. Shu nom va qiymatni Render'da xizmatingizning Environment bo'limiga qo'shib saqlang.
     Kalitni agentga, chatga va repo'ga yozmang — agent faqat nomini biladi.
     7-darsda qadamlar sanog'i yoqilmagan bo'lsa (`hodisalar` jadvali yo'q) — avval 7-darsdagi Amaliyot 2 ning 2 va 3-bo'limini bajaring; sanoq sahifasi shundan keyin quriladi.
  2. **Prompt** — qavs ichini to'ldiring (kulrang namunaga qarang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: Backend — yangi yo'l `GET /hodisalar/sanoq` va real vaqt ulanishi; `lending/` — yangi sahifa `sanoq.html`.
     > Nima qilsin: `GET /hodisalar/sanoq` `hodisalar` jadvalidan **{nimani sanasin}** bersin (`?dan=` vaqt berilsa — shu vaqtdan keyingi yozuvlar bo'yicha); yonida — ro'yxatdan o'tgan akkauntlar soni, namuna va tekshiruv akkauntlarisiz (7-darsdagi `namuna` belgisi bo'yicha).
     > Kalit so'rov sarlavhasida kelsin; kalit bo'lmasa yoki `.env` dagi `SANOQ_KALITI` bilan mos kelmasa — `401`.
     > `lending/sanoq.html` avval kalitni so'rasin, keyin sonlarni qadamlar tartibida ko'rsatsin; kalit faqat ochiq sahifada tursin — sahifa yangilansa, qayta so'ralsin.
     > Sahifa o'zi yangilansin: ulanayotganda kalitni yuborsin; kalit to'g'ri bo'lsa, Backend uni faqat `sanoq` xonasiga qo'shsin — o'yin xonalari va foydalanuvchi harakatlariga emas; `hodisalar` ga yangi yozuv saqlanib tugagach shu xonaga `sanoq-ozgardi` yuborsin, sahifa sonlarni qayta so'rasin.
     > Backend **{lending manzili}** dan kelgan so'rov va ulanishni ham qabul qilsin (oldingi manzillar ham qolsin). README dagi o'zgaruvchilar ro'yxatiga `SANOQ_KALITI` nomini qiymatsiz qo'sh.
     > Nima buzilmasin: ilova va uning ulanishi, `POST /hodisalar` va boshqa yo'llar avvalgidek ishlasin. `sanoq.html` ga lendingdan havola qo'yma, unda Umami bo'lmasin; sahifada faqat sonlar — ism, login va qurilma ID ko'rsatilmasin.
     > Kalitni kodga yozma, `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Joy yonidagi kulrang namuna: `{nimani sanasin}` — masalan: to'rt qadam — `ochdi`, `royxatdan-otdi`, `qoshildi`, `tasdiqladi`, shu tartibda; har birida turli qurilmalar soni.
     `{lending manzili}` — 1-darsdagi manzilingizdan o'zi qo'yiladi (`pm-m10d1-lending.manzil`); bo'lmasa — o'zingiz yozasiz.
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — yangi yo'l `GET /hodisalar/sanoq`, gateway va `POST /hodisalar`; `lending/` — yangi `sanoq.html`.
     > Nima qilsin: `GET /hodisalar/sanoq` to'rt qadam uchun turli `qurilma_id` lar sonini bersin — `ochdi`, `royxatdan-otdi`, `qoshildi`, `tasdiqladi`, shu tartibda (`?dan=` vaqt berilsa — shu vaqtdan keyingi yozuvlar bo'yicha); yonida — `oyinchilar` dagi `namuna = false` akkauntlar soni.
     > Kalit so'rov sarlavhasida kelsin; kalit bo'lmasa yoki `SANOQ_KALITI` bilan mos kelmasa — `401`.
     > `lending/sanoq.html` — «Maydon Jamoa · sanoq»: avval kalit maydoni, keyin to'rt qadam va ro'yxatdan o'tgan akkauntlar; kalit faqat sahifa holatida, yangilansa qayta so'raladi.
     > Gateway: ulanishda `auth` da kalit kelsa va to'g'ri bo'lsa — ulanish faqat `sanoq` xonasiga qo'shilsin (o'yin xonalari va o'yin yo'llariga kira olmaydi), noto'g'ri bo'lsa — yopilsin; ilovaning token bilan ulanishi o'zgarmasin. `POST /hodisalar` yangi qatorni yozib tugatgandan keyin `sanoq` xonasiga `sanoq-ozgardi` yuborsin; sahifa sonlarni qayta so'rasin.
     > Backend `maydon-jamoa-….netlify.app` (lending) dan kelgan so'rov va ulanishni ham qabul qilsin — brauzer ko'rinishi manzili ham qolsin. README dagi o'zgaruvchilar ro'yxatiga `SANOQ_KALITI` nomini qiymatsiz qo'sh.
     > Nima buzilmasin: ilova, real vaqt ulanishi, eslatma, `POST /hodisalar` va boshqa yo'llar avvalgidek ishlasin. `sanoq.html` ga lendingdan havola qo'yma, unda Umami bo'lmasin; sahifada ism, login va qurilma ID yo'q. Kalitni kodga yozma, `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — `git diff` — o'zgarish agent aytgan fayllardami. `git status` → `.env` ro'yxatda yo'q → har faylni `git add <fayl>` bilan → `git commit -m "8-dars: sanoq sahifasi"` → `git push`.
     Render'da yangi deploy tugashini kuting (odatda bir necha daqiqa); lending Netlify'da push'dan keyin odatda o'zi yangilanadi (1-darsda repo bilan ulangan).
     Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — agent nima desa ham, o'zingiz tekshiring:
     (1) Brauzerda Render manzilingizga `/hodisalar/sanoq` qo'shib oching — sonlar emas, `401` chiqishi kerak: kalitsiz yopiq.
     (2) Lending manzilingizga `/sanoq.html` qo'shib oching → kalitni kiriting: qadamlar sonlari va ro'yxatdan o'tgan akkauntlar soni chiqishi kerak. Noto'g'ri kalit bilan sonlar chiqmasligi kerak; sahifani yangilang — kalit qayta so'ralishi kerak. Kalitni bilgan har kim sahifani ochadi: kalit chiqib ketsa — `.env` va Render'da yangisini qo'ying.
     (3) Ilovangizni hali ochilmagan qurilmada oching — sherigingiz telefonida lendingdagi havoladan yoki laptopda brauzer ko'rinishida. Sanoq sahifasini yangilamang: «ochdi» bittaga oshishi kerak — odatda bir necha soniyada.
     O'z telefoningiz allaqachon sanalgan — u sonni oshirmaydi: har qadamda turli qurilmalar sanaladi.
     (4) 7-darsda yozgan soningiz shu yerda: «Ro'yxatdan o'tgan: {royxat} · {sana}» — sahifadagi son bilan solishtiring. Sonlarni mustaqil ishda kiritasiz.
     Mos kelmagan qatorni agentga yozing: «Shu qator talabga mos emas: {nima}. Tuzat.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (chapda telefon, o'ngda brauzer; bir marta o'zi yuradi):
  - brauzer `maydon-jamoa-….netlify.app/sanoq.html`: kalit maydoni (nuqtalar bilan yopiq) → **Maydon Jamoa · sanoq** · ochdi 46 · ro'yxatdan o'tdi 27 · qo'shildi 12 · kelishini tasdiqladi 9 (ostida kulrang: har qadamda turli qurilmalar) · alohida qator «Ro'yxatdan o'tgan akkauntlar: 27»
  - telefon: yangi qurilmada ilova ochiladi → sahifada «ochdi» 46 → 47, son bir lahza yashil yonadi (sahifa yangilanmagan)
  - ostida kichik qator: `…onrender.com/hodisalar/sanoq` → `401`
- Qator (`QIzoh`, natija ostida; tayanch 1.8): Bu misolda «ro'yxatdan o'tdi» va Database'dagi son teng chiqdi — 27. Biri qurilmani, biri akkauntni sanaydi. (108)
- Kichik izoh (kulrang): Sonlar Mentor misolidan — sizda boshqacha. Ro'yxatdan o'tgan 27 akkauntdan 11 tasi — sinfdosh (Mentor bilganicha).
- Hammasi bajarilgach (yashil): Sanoq sahifasi faqat kalit bilan ochiladi va yangi qurilma kelganda o'zi yangilanadi. (85)
- Ulgurmasangiz (kichik, pastda): Vaqt tugayaptimi — push qiling: «Davom etish» ochiladi, blok 4-bo'limdagi tekshiruvdan keyin bajarilgan sanaladi (tayanch 9.36 h). Sonlarni hozircha Neon SQL Editor'dan oling: `SELECT nom, COUNT(DISTINCT qurilma_id) FROM hodisalar GROUP BY nom;` → «Run». Tekshirishni uyda qilasiz.
- Web-trek qatori: o'sha talab — «qurilma» o'rnida brauzer ID (`brauzer_id`, 10-Moduldagidek); (3) da yangi brauzer — inkognito oyna (hamma inkognito oynalar yopilib, yangisi ochilsa); sanoq sahifasi ham `lending/` da.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-08-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz; `backend/.env` ga o'z kalitingizni yozasiz.
- Nishon (bonus): Live Counter — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: `SANOQ_KALITI` — `DATABASE_URL` va `JWT_SECRET` bilan bir qatorda turadigan maxfiy kalit (tayanch 3). Render'da Environment bo'limiga qo'shilgach saqlash — render.com/docs (06.10); qaysi saqlash varianti tanlansa ham, keyingi push yangi deploy qiladi.
  (3) tekshiruvi uchun ikkinchi qurilma kerak — juftlikda sherik o'z telefonida havoladan ochadi: `ochdi` kirishdan oldin yoziladi, akkaunt kerak emas. Shu qurilma ham sanoqqa qo'shiladi — sonni aytganda eslab qoling.
  10-Moduldagi dashboard har 5 soniyada so'rardi — bu sahifa 2-darsdagi doimiy ulanish bilan yangilanadi (bir gap, o'quvchi so'rasa).
- ✎ Talab zinapoyasi: A1 — tayyor talab + bitta joy `{nimani sanasin}` (qaror o'quvchida: qaysi qadamlar, qaysi tartibda, qanday sanaladi — tayanch 7.13). `{lending manzili}` — o'zi qo'yiladigan qiymat, qaror emas.
  Kalit sarlavhada, Umami'siz va havolasiz sahifa, CORS — MD qarori (TAYANCHGA SAVOL 6, 7). `sanoq-ozgardi` o'quvchi prozasida «hodisa» deb atalmaydi (T-015; TAYANCHGA SAVOL 3).

## 5 · Netflix  ← QVoqea (PM keys K6; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Netflix'da ko'rishlar qayerdan keladi?** (38)
- Nuqtalar (3) · yorliq **Netflix · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · bosqich nomi · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Netflix** (nomi o'z rangida — qizil) — film va serial ko'rsatadigan xizmat. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket.
- Sahna (`NetflixSahna`, chizilgan CSS/SVG; bankda yo'q narsa chizilmaydi — film nomi, boshqa son, yil yo'q):
  - 1/3 **Har kimda o'ziniki** — Mentor: Netflix'da bosh sahifa har kimda o'ziniki: tavsiyalar ko'rish tarixidan — odam oldin ko'rganlaridan yig'iladi.
    · sahna: ikki telefon yonma-yon, ikkalasida Netflix bosh sahifasi (to'q fon, rangli kartalar qatorlari — matnsiz); har telefon ostida kulrang «ko'rganlari» kartalari, ulardan ingichka chiziq yuqoridagi qatorga boradi — ikki telefonda qatorlar boshqa-boshqa.
    · bashorat (sahna ostida, bitta qator; P-053 `pre` kadr — sahna javobni ochmaydi; S-015 — zinapoya): **2016-yilda Netflix aytishicha, ko'rishlarning qanchasi tavsiyalardan keladi?** · Qariyb 20 foizi · Qariyb 50 foizi · ✔ Qariyb 80 foizi — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi.
  - 2/3 **Qidiruvdan emas** — Mentor: 2016-yilda Netflix ochiq aytgan: ko'rishlarning qariyb 80 foizi qidiruvdan emas, tavsiyalardan keladi.
    · sahna: bitta telefon kattalashadi; «ko'rish» belgilarining uzluksiz oqimi — ko'pchiligi tavsiyalar qatoridan, ozi qidiruv qutisidan; belgilar sanaladigan bo'lmaydi (son faqat Mentor gapida — bankdagi «qariyb»; 08-FILTR 10).
  - 3/3 **Son yo'lni ko'rsatadi** — Mentor: Sizning sanog'ingiz ham yo'lni ko'rsatadi: odamlar qaysi qadamda to'xtab qolyapti.
    · sahna: Netflix telefoni kichrayib chapga suriladi, o'ngda «Maydon Jamoa» ning to'rt ustuni chiqadi (2-ekrandagi), ikki oraliq `err` fon bilan bir lahza yonadi.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: qariyb 80 foizi» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Bu voqeada son ko'rishlar qayerdan kelishini ko'rsatdi: qariyb 80 foizi — tavsiyalardan. (88)
- Tugma (pastki): Avval belgilang → Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: Netflix'ni 5-Modulda «Ilova nimani eslab qolsin?» darsida ko'rgansiz (bosh sahifa saqlangan ma'lumotdan quriladi) — bugun boshqa savol: son nimani ko'rsatadi. Netflix qanday qaror qilgani, boshqa sonlar va yillar aytilmaydi (bankda yo'q — PM-016, PM-018).
  Ko'prik — umumiy joy, tenglik emas: Netflix ko'rish yo'llarini, siz qadamlarni sanaysiz.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K6 — «Главная страница у каждого своя — рекомендации собираются из истории просмотров» · «~80% просмотров приходит из рекомендаций, а не из поиска (публичное заявление Netflix, 2016)» · tayanch 5.
  «qariyb 80 foizi» — «~80%» (5-Modul `PmLesson11` ham shunday: «2016-yilda Netflix aytdi: ko'rishlarning qariyb 80 foizi tavsiyadan keladi»). «Netflix ochiq aytgan» — «публичное заявление».
- ✎ SABOQ 2, 3, 8: nom o'z rangida, tanish maketda (telefon ilovasi), sahna bosqichga qarab o'zgaradi; logotip yo'q. Bashorat — bitta (S-015, zinapoya 20 · 50 · 80). Sarlavhadagi savolga javob — 2/3.

## 6 · O'z sonlaringiz  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Sizning ilovangizda odamlar qayerda to'xtab qolyapti?** (53)
- Mentor: Sanoq sahifangizdagi sonlarni qadamlar tartibida kiriting — foizni ekran o'zi hisoblaydi, tanlovni siz qilasiz.
- Kirish qatori (kulrang, tepada, bir marta): Sonlaringiz kichik bo'lsa ham kiriting: topilgan joy — taxmin, isbot emas. (74)
- Qadamlar 1/2/3 (`QQadamlar` tugmalari «1 · Sonlar · 2 · To'xtash · 3 · Gipoteza»); bitta ustun; bir vaqtda bitta katta karta, yozilgani yuqoridagi ixcham qatorga uchadi (SABOQ 29):
  1. **Sonlar** — karta: «Qadam» (ipucha: Qadam nomi) · «Nechta qurilma» (raqam) → «Qo'shish» → ixcham qator «ochdi · 46»; 3 tadan 5 tagacha. Ikkinchi qatordan boshlab yonida o'zi chiqadi: «oldingisidan — 59%».
     Karta ostida kichik tugma: **Sonlarim hali yo'q** → Mentor sonlari qo'yiladi, ustida kulrang yorliq «mashq sonlari — Mentor misoli» (kalitda `tur: 'mashq'`); gipoteza baribir o'z ilovangiz uchun yoziladi.
  2. **To'xtash** — oraliqlar yo'l tartibida, har birida foiz (o'quvchi sonlaridan — P-046). Ustida kulrang qator: Foizi eng past ikki oraliqni bosing. Qaysi biridan boshlashni o'zingiz tanlaysiz. (81)
     Bosilgan oraliq `err` fon oladi va «to'xtab qolish qadami» uyasiga uchadi (ikkita). Keyin ikkalasidan biri: **Avval shuni tuzataman** (★, accent) — ikkinchisi kulrang «Keyin» yorlig'ini oladi. 3 qadam bo'lsa — ikki oraliq, ikkalasi tanlanadi.
  3. **Gipoteza** — karta tepasida: «★ {qadam} · {foiz}». Uch qator (10-Modul shakli): «Agar …» (ipucha: Nimani o'zgartirasiz?) · «… o'zgaradi» (ipucha: Qaysi qadamga ko'proq o'tadi?) · «chunki …» (ipucha: Nega shunday deb o'ylaysiz?).
     Karta ostida to'liq gap yig'iladi: «Agar {agar}, {o'zgaradi}, chunki {chunki}.»
- Tekshiruv (`QXato`, ≤60; faqat bo'sh qator bloklaydi, qolgani — maslahat, qaror o'quvchida — S-008):
  - xato · bo'sh qadam nomi: Qadam nomini yozing. (20)
  - xato · son yo'q: Shu qadamda nechta qurilma — son yozing. (40)
  - xato · keyingi son oldingisidan katta (maslahat): Keyingi qadamga ko'proq o'tganmi? Sonni tekshiring. (51)
  - xato · tanlangan oraliq foizi eng kichik ikkitadan emas (maslahat): Bu oraliqda foiz kattaroq. Sababingiz bormi? (44)
  - xato · «o'zgaradi» da qadam nomi yo'q (maslahat): Qaysi qadamga ko'proq o'tishi kerak — shuni yozing. (51)
  - xato · «Agar» da ikki o'zgarish («va», «ham») (maslahat): Bitta o'zgarish yozing — bugun bittasi quriladi. (48)
- Yordam (sukutda yopiq): Mentor misolida: ochdi 46 · ro'yxatdan o'tdi 27 · qo'shildi 12 · kelishini tasdiqladi 9 — foizlar 59 · 44 · 75. To'xtab qolish qadamlari — ro'yxatdan o'tish va qo'shilish.
  Mentor ro'yxatdan o'tishni tanladi: u yo'lda birinchi — undan o'tmagan odam keyingi qadamlarga yetmaydi. Gipoteza: «Agar o'yinlar ro'yxati ro'yxatdan o'tmasdan ham ko'rinsa, ochganlardan ko'prog'i ro'yxatdan o'tadi, chunki hozir ilova birinchi ekranda parol so'raydi — ichida nima borligi ko'rinmaydi.»
- **Harakat → Vizual o'zgarish:** «Qo'shish» → qator ixcham chiziqqa uchadi, o'ngdagi kichik ustunlar chizmasida yangi ustun o'sadi, oraliq foizi sanab chiqadi; 2-qismda bosilgan oraliq qizil yonadi va uyaga uchadi, ★ bosilgani accent halqada qoladi;
  «Saqlash» → forma yopiladi, karta butun enga (199): ustunlar, ikki qizil oraliq, ★ va gipoteza to'liq gap bo'lib; har qator yonida ✎.
- Saqlanadi: `pm-m10d8-qadamlar` — `{ tur: 'real' | 'mashq', qadamlar: [{ id, nom, soni }] (3–5), toxtash: [id, id], gipoteza: { agar, ozgaradi, chunki }, tuzatildi: false, chiqarildi: false, chiqarildiVaqt: null, sana }` (tayanch 8; `tur` va `chiqarildiVaqt` — 08-FILTR 5, 16;
  `id` — `q1`…`q5`, tartib o'zgarmaydi; `toxtash` — oraliq oxiridagi qadam `id` si, `toxtash[0]` — ★ tuzatiladigani; mashq sonlarida belgi — TAYANCHGA SAVOL 9).
- Xulosa: Sonlaringiz saqlandi: ikki to'xtab qolish qadami topildi, biri uchun gipoteza yozildi. (86)
- Tugma (pastki): Sonlarni kiriting (N/3) → Davom etish · oxirida «Saqlash»
- Nishon: Hypothesis Ready — «Saqlash» bosilganda (ish bajarilgan — P-048).
- Mentor rejimida (proyektorda): forma o'rnida Mentor misoli (`QADAM_SANOQ.mentor`) to'ldirilgan holda ko'rinadi.
- O'qituvchi eslatmasi: juftlikda sherik gipotezani o'qisin va ikki savolga javob bersin: «qaysi qadam?» va «nega shunday deb o'ylaysiz?». Sonlar kichik bo'lsa ham to'xtab qolish qadami topiladi — taxmin sifatida; bu baho emas.
  «Sonlarim hali yo'q» — ilova hali yuborilmagan yoki sanoq endi yoqilgan o'quvchi uchun: oraliqni Mentor sonlarida topadi, gipotezani o'z ilovasidagi o'xshash qadam uchun yozadi; uyda o'z sonlari bilan qaytadi (uyga vazifa ②).
- ✎ 11-Modul 13-dars 5-mashqi naqshi (birinchisini o'quvchi tanlaydi; «Keyin» ro'yxati) — bu yerda sanoq foizdan. Bir darsda bitta tuzatish — ikkinchi to'xtab qolish qadami «Keyin» (tayanch 1.8).

## A2 · Amaliyot 2 — tuzatish va yangi versiya  ← amaliyot bloki (≈22 daq; `screens[7]`)
- Eyebrow: Amaliyot 2 · tuzatish
- Sarlavha: **Gipotezadagi bitta o'zgarish odamlarga chiqsin.** (47)
- Mentor: Endi «Nima qilsin» qatorini gipotezangizdan o'zingiz yozasiz; «1 · Ochish»dan boshlang.
- Bo'limlar (hammasi o'z repo'ngizda):
  1. **Ochish** — Amaliyot 1 push qilingan. Gipotezangiz shu yerda: «Agar {agar}, {o'zgaradi}, chunki {chunki}.» «Agar» qismi — bugungi tuzatish.
     U bitta ekran yoki bitta Backend yo'liga sig'sin; katta bo'lsa — birinchi ko'rinadigan qismini tanlang. Ilovangizda ★ qadam turgan ekranni oching. Mentor misolida bu — ilova ochilgandagi birinchi ekran: hozir u «Kirish».
  2. **Prompt** — «Qayerda» qatori mustaqil ishdagi ★ qadamdan to'ldirilgan (tahrirlash mumkin). «Nima qilsin» qatorini yozing (kulrang namunaga qarang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: ilovamda — «{to'xtab qolish qadami}» qadami turgan ekran va u so'raydigan Backend yo'li.
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: qolgan ekranlar va yo'llar avvalgidek ishlasin; qadamlar sanog'i (`hodisaYoz`) o'z joyida qolsin. Kirmagan odamga boshqa foydalanuvchilarning ismi va shaxsiy ma'lumoti ko'rinmasin — kirmagan odamga ketadigan maydonlar ro'yxatini avval menga ko'rsat, faqat shular ketsin.
     > `.env` ga tegma. Tekshiruv uchun yozuv yaratsang — `id` larini ayt va faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Joy yonidagi kulrang namuna: `{nima qilsin}` — masalan: kirmagan odam ham o'yinlar ro'yxatini ko'rsin; «Qo'shilaman» bosilsa — «Ro'yxatdan o'tish» ochilsin. Bitta o'zgarish yozing — butun ilovani qayta qurish emas.
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — `GET /oyinlar`; `mobil/` — ilova ochilgandagi birinchi ekran, «O'yinlar», «O'yin» va «Qo'shilaman».
     > Nima qilsin: kirmagan odam ham «O'yinlar»ni ko'rsin. `GET /oyinlar` token bo'lmasa ham javob bersin — faqat shu maydonlar: `id`, `kun`, `soat`, `maydon`, `kerak`, `qoshilgan`; boshqa hech qanday maydon (`men…`, o'yinchilar ismi va keyin qo'shiladiganlari) bo'lmasin.
     > Ilova tokeni yo'q odamga birinchi ekranda «O'yinlar»ni ko'rsatsin, tepada «Kirish» havolasi bilan; «Qo'shilaman» bosilsa — «Ro'yxatdan o'tish» ochilsin. Kirmagan odamga ro'yxat ekran ochilganda va pastga tortganda yangilansin; real vaqt ulanishi — faqat kirganlarga.
     > Nima buzilmasin: kirgan o'yinchi uchun qo'shilish, tasdiq, chiqish, navbat, real vaqt va eslatma avvalgidek ishlasin; to'rt qadam sanog'i (`hodisaYoz`) o'z joyida qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordamning oxirgi qatori (web-trek): Saytingizda ham shunday: kirmagan odamga ro'yxat sahifa ochilganda va «Yangilash» bosilganda so'raladi.
  3. **Ishga tushirish** — `git diff` → `git status` → `git add <fayl>` → `git commit -m "8-dars: {tuzatishingiz nomi}"` → `git push`; Render'da yangi deploy tugashini kuting.
     Mobil trekda `npx expo start`, QR'ni Expo Go bilan oching (bitta Wi-Fi; bo'lmasa `--tunnel`); web-trekda `npm run dev`. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — agent nima desa ham, o'zingiz tekshiring:
     (1) «Hisobdan chiqish» → ilovani qayta oching: tuzatilgan joy gipotezangizdagidek ko'rinishi kerak. Mentor misolida — «O'yinlar» ro'yxatdan o'tmasdan ko'rinadi, «Qo'shilaman» → «Ro'yxatdan o'tish».
     - Joriy qator (1) dan keyin: Kirmagan odam ko'radigan bu ekran mehmon ko'rinishi deyiladi: ro'yxat bor, harakat uchun ro'yxatdan o'tish kerak. (113)
     (2) Brauzerda Render manzilingizga o'zgargan yo'lni qo'shib, tokensiz oching (Mentor misolida `/oyinlar`): javobda ism, login va `men…` maydonlari bo'lmasligi kerak. Tuzatishingiz Backend yo'liga tegmagan bo'lsa — bu bandni o'tkazing.
     (3) Kiring: asosiy harakat va real vaqt avvalgidek ishlashi kerak. Shu yerda «Bajardim» — tuzatish qilindi va tekshirildi.
     (4) **Yangi versiya** — Backend push'dan keyin yangilandi. Brauzer ko'rinishi push'dan keyin o'zi yangilanmaydi: `npx expo export -p web`, keyin `netlify deploy --prod --dir dist` bilan qayta chiqaring.
     APK o'zi yangilanmaydi — yangi o'rnatish fayli kerak: `cd mobil` → `eas build -p android --profile preview` (bepul rejada oyiga 15 ta Android build — keraksiz qayta tayyorlamang). Navbatni kutmang — yakuniy savolga o'ting.
     Fayl tayyor bo'lgach agentga: «`lending/index.html` dagi «Android: ilovani o'rnatish» havolasini shu manzilga almashtir: {yangi havola}. Boshqa joyga tegma.» → `git push`.
     Eski faylni o'rnatgan odamda tuzatish yo'q — u yangisini o'rnatgandagina chiqadi; yangi keladiganlar lendingdagi yangi havoladan o'rnatadi. Tanlang: **Yangi versiya chiqdi** · **O'rnatish fayli navbatda** (vaqt o'zi yoziladi — `chiqarildiVaqt`).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon chapda, karta o'ngda; ≤3 blok; bir marta o'zi yuradi):
  - telefon «Maydon Jamoa», kirmagan holat: «O'yinlar» — «Shanba, 18:00 · Mahalla maydoni · 8 / 10» va boshqa kartalar, tepada «Kirish» havolasi → «Qo'shilaman» bosiladi → «Ro'yxatdan o'tish» (Ism · Login · Parol)
  - brauzer qatori `…onrender.com/oyinlar` (tokensiz) → `[{ "id": 1, "kun": "…", "soat": "18:00", "maydon": "Mahalla maydoni", "kerak": 10, "qoshilgan": 8, … }]` — `men…` va ism yo'q
  - kichik karta «Lending · Qanday qo'shilaman»: «Android: ilovani o'rnatish» — yonida yashil ✓ «yangi havola»
- Qator (`QIzoh`, natija ostida): Tuzatish chiqdi — bu ish fakti. Gipoteza to'g'rimi — keyingi kunlardagi sonlar ko'rsatadi. (90)
- Hammasi bajarilgach (yashil; «Yangi versiya chiqdi» — P-046): Tuzatish tekshirildi va odamlarga chiqdi: yangi kelganlar uni lendingdagi havoladan oladi. (90)
- Hammasi bajarilgach («O'rnatish fayli navbatda»): Tuzatish tekshirildi, Backend yangilandi. Fayl tayyor bo'lgach, lendingdagi havolani almashtirasiz. (99)
- Saqlanadi: `pm-m10d8-qadamlar.tuzatildi` (4-bo'lim (3) «Bajardim») · `.chiqarildi` va `.chiqarildiVaqt` («Yangi versiya chiqdi»; web-trekda push va tekshiruvdan keyin) · dars ichida (ccProgress) `navbatda` — yakun sarlavhasi uchun (TAYANCHGA SAVOL 9).
- Ulgurmasangiz (kichik, pastda): Vaqt tugayaptimi — (1)–(3) ni tekshirib, push qiling; yangi o'rnatish fayli va lending havolasi uyda. Tekshirilmagan tuzatishdan o'rnatish fayli tayyorlamang.
- Web-trek qatori: tuzatish — saytingizda; o'rnatish fayli yo'q. (4) da saytni telefonda ochib, tuzatish ko'rinishini tekshirasiz: ko'rinmasa — sayt Netlify'ga buyruq bilan chiqarilgan, qayta `netlify deploy --prod` (7-darsdagidek); ko'rinsa — «Yangi versiya chiqdi» (08-FILTR 20).
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-08-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) (o'rnatish faylini o'z Expo akkauntingizda tayyorlaysiz).
- Nishon (bonus): New Version — «Yangi versiya chiqdi» tanlanganda (08-FILTR 21: fayl navbatda bo'lsa — hali yo'q).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: bir darsda bitta tuzatish — ikkinchi to'xtab qolish qadami «Keyin» yorlig'ida qoladi (Mentor misolida — qo'shilish). Kirmagan odamga ism ko'rsatilmasligi — o'smir xavfsizligi (Mentor promptida ham).
  Eski faylni o'rnatganlar mehmon ko'rinishini ko'rmaydi — ular allaqachon akkauntli; tuzatish yangi kelganlar uchun. Ro'yxatdan o'tgach odam «Kirish» qilib, o'yinni qayta topadi — bu ham qiyinchilik bo'lishi mumkin; bugun faqat «ichini ro'yxatdan o'tishdan oldin ko'rsatish» tekshiriladi (bir darsda bitta o'zgarish — 08-FILTR 14). Navbat Mentor misolida ≈25 daqiqa (va'da emas) — dars ichida tugamasligi mumkin, yakun sarlavhasi shuni aytadi.
  Netlify'ga buyruq bilan chiqarilgan brauzer ko'rinishi push'dan keyin o'zi yangilanmaydi (Netlify hujjati, 06.10) — o'quvchi 7-darsda qaysi yo'lni tanlaganini so'rang (TAYANCHGA SAVOL 4).
- ✎ Talab zinapoyasi: A2 — bitta qatorni o'quvchi yozadi («Nima qilsin» — gipotezaning «Agar» qismidan). «Qayerda» — ★ qadamdan o'zi qo'yiladi. 4-bo'lim nomi — tayanch 4 dagi «Tekshirish»; yangi versiya uning oxirgi bandi (1.8: «A2 oxirgi qadami»).

## 8 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikki blok va PM qismi birga: tuzatish — ish fakti, natija — sonlar)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q — SABOQ 6)
- Savol ustida kichik karta: «Tuzatish: tekshirildi ✓ · Yangi versiya: chiqdi ✓ · Keyingi kunlardagi sonlar: —».
- Savol: **Tuzatish tekshirildi va odamlarga chiqdi. Gipoteza to'g'ri ekani bilindimi?** (9 so'z; 08-FILTR 15: kelajak sonlari bu darsda ochilmaydi)
  - ✔ A — Yo'q — buni keyingi kunlarning sonlari aytadi (45)
  - B — Ha — tuzatish chiqdi, demak gipoteza to'g'ri (44)
  - C — Ha — agent «tuzatdim» dedi, shuning o'zi yetadi (47)
  - D — Yo'q — gipotezani endi tekshirib bo'lmaydi (42)
- Kalit: **A** (index 0). Tire to'rttalasida; «Ha» ikkita, «Yo'q» ikkita (S-006); to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: Tuzatish — ish fakti. Gipotezani keyingi sonlar aytadi. (55)
- Xato izohlari (≤60):
  - B: Chiqqan tuzatish — ish. Keyingi sonlar hali bormi? (50)
  - C: Agentning so'zi — da'vo. Sonlar nima deydi? (43)
  - D: Keyingi kunlarda sanoq sahifasi nimani ko'rsatadi? (50)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol A2 QIzohiga tayanadi («Tuzatish chiqdi — bu ish fakti. Gipoteza to'g'rimi — keyingi kunlardagi sonlar ko'rsatadi.»). Har noto'g'ri javob darsning o'z qoidasi bilan noto'g'ri (S-004): B — tuzatish chiqishi gipotezani isbotlamaydi (7.2d) · C — agentning so'zi da'vo · D — sanoq sahifasi keyingi sonlarni ko'rsatadi.
  Savol yangi holat — slayddan ko'chirib bo'lmaydi (§106); ikkala trekka to'g'ri keladi (qoida umumiy). Kalit ibora 3-ekran bilan takrorlanmaydi (S-008: foiz bilan topish ↔ kichik sondan xulosa).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Eng past foiz» · 8 — «2 — Gipoteza va sonlar»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — P-046, tayanch 7.1; belgi ✓ va nishon — faqat birinchi holatda; tartib — yuqoridan birinchi mos kelgani):
  - Sarlavha · tuzatildi ✓, chiqarildi ✓: **Tuzatish odamlarga chiqdi.** (26)
  - Sarlavha · tuzatildi ✓, fayl navbatda yoki havola qoldi: **Tuzatish tayyor — yangi versiya qoldi.** (38)
  - Sarlavha · gipoteza saqlangan, tuzatish tugamagan: **Gipoteza tayyor — tuzatish qoldi.** (33)
  - Sarlavha · Amaliyot 1 ✓, gipoteza saqlanmagan: **Sanoq sahifasi tayyor — gipoteza qoldi.** (39)
  - Sarlavha · hech biri saqlanmagan: **Sonlar o'qildi — sanoq sahifasini tugating.** (43)
  - Mashq sonlari bilan saqlangan bo'lsa — sarlavha o'sha; ostida kulrang qator: Gipoteza mashq sonlarida — o'z sonlaringiz bilan qayta tekshiring. (66)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Bu darsda qadamlar sanog'i qaysi oraliqda kamroq qurilma keyingi qadamga o'tganini ko'rsatadi, gipoteza esa nega shunday bo'lganini taxmin qiladi va bitta tuzatish bilan tekshiriladi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Har qadamda turli qurilmalar sanaladi: bitta qurilma necha marta ochsa ham — bitta.
  - To'xtab qolish qadamini eng kichik son emas, past foiz ko'rsatadi.
  - Sanoq sahifasi maxfiy kalit bilan ochiladi; kalit agentga va repo'ga yozilmaydi.
  - APK o'zi yangilanmaydi: tuzatishdan keyin yangi fayl tayyorlanadi va havola almashtiriladi.
  - Kam qurilmadagi farq — kuzatuv, isbot emas.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z ilovangiz · Nechta: bitta tuzatish va bitta yozuv · Muddat: keyingi darsgacha
  - ① Mobil trekda: yangi o'rnatish fayli tayyor bo'lgach, lendingdagi «Android» havolasini almashtiring va telefonda havoladan o'rnatib ko'ring.
  - ② 2–3 kundan keyin sanoq sahifasini oching va qadamlar sonini sanasi bilan yozib oling. Mashq sonlari bilan ishlagan bo'lsangiz — o'z sonlaringizni mustaqil ishga kiriting.
  - ③ Darsda qolgan qismni tugating: {holatga qarab — sanoq sahifasini tekshiring · gipotezani yozing · tuzatishni tekshirib push qiling}.
  - Karta ostida (bitta kulrang qator): Bir-ikki kunlik oz sondan xulosa chiqarmang — bu kuzatuv. (57)
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: foydalanuvchini qaytaradigan eslatma».
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): uyga vazifa — PM+PRAKT naqshi (11-Modul 13-dars `HwCard`; tayanch 4). «Keyingi dars» qatori — App.jsx `m10-09` nomi, so'zma-so'z (`00-NOMLAR.md`). ① faqat mobil trekda va fayl/havola qolgan bo'lsa ko'rinadi; ③ holatdan yig'iladi (P-046), hammasi tugagan bo'lsa ko'rinmaydi.
  Tuzatishdan keyingi sonni 10-dars ko'rishi — o'quvchi matnida va'da qilinmaydi (T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Drop-off Finder!** (3-ekran, birinchi urinishda) — Foizi eng past oraliqni birinchi urinishda topdingiz
- **Live Counter!** (A1, oxirgi «Bajardim» — bonus, P-048: ish bajarilgan) — Sanoq sahifangiz kalit bilan ochiladi va o'zi yangilanadi
- **Hypothesis Ready!** (6-ekran, «Saqlash») — O'z sonlaringizdan to'xtab qolish qadamini topib, gipoteza yozdingiz
- **New Version!** (A2, «Yangi versiya chiqdi» tanlanganda — bonus) — Tuzatishni o'zingiz tekshirib, yangi versiyani chiqardingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Tekin bonus yo'q — to'rttalasi ish bajarilganda (P-048). 8-ekran nishonsiz.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · To'xtab qolish qadami** — 1 Har oraliqda keyingi qadamdagi son oldingisining necha foizi ekanini toping. · 2 Foizi past oraliq — to'xtab qolish qadami; bu darsda eng past ikkitasi olinadi. ·
  3 Eng kichik son shart emas: Mentor misolida 12 dan 9 tasi o'tgan — 75 foiz.
  — Sinfga savol: Oxirgi qadamda son eng kichik bo'lsa, u to'xtab qolish qadamimi?
- **8 · Gipoteza va sonlar** — 1 «Tuzatildi» — ish fakti: tuzatish qilindi va o'zingiz tekshirdingiz. · 2 Gipoteza to'g'rimi — keyingi kunlardagi sonlar ko'rsatadi. · 3 Bir-ikki kunlik oz sondan xulosa chiqarilmaydi — bu kuzatuv.
  — Sinfga savol: Tuzatish chiqdi — gipoteza to'g'ri ekanini qachon bilamiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Qadamlar nima? | Foydalanuvchi mahsulotda bosib o'tadigan yo'l bo'laklari | Inglizchasi: funnel. Mentor misolida: ochdi, ro'yxatdan o'tdi, qo'shildi, kelishini tasdiqladi |
| Bu darsda foiz nimani ko'rsatadi? | Bir qadamdan keyingisiga o'tganlar foizini | Mentor misolida 46 dan 27 tasi — 59 foiz |
| To'xtab qolish qadami nima? | Keyingi qadamga o'tganlar foizi past bo'lgan joy | Bu darsda foizi eng past ikki oraliq olinadi |
| Eng kichik son — to'xtab qolish qadamimi? | Shart emas: foizga qarang | Mentor misolida 12 dan 9 tasi o'tgan — 75 foiz |
| Har qadamda nima sanaladi? | Turli qurilmalar soni | Bitta qurilma necha marta ochsa ham — bitta |
| Sanoq sahifasini kim ko'radi? | Maxfiy kalitni bilgan odam | Kalitsiz so'rovga Backend `401` beradi; kalit chiqib ketsa — yangisi qo'yiladi |
| `SANOQ_KALITI` qayerda turadi? | Backend `.env` da va Render'da | Agentga, chatga va repo'ga yozilmaydi |
| Gipoteza qanday shaklda yoziladi? | «Agar … qilsak, … o'zgaradi, chunki …» | «Chunki» — nega shunday kutayotganimiz |
| Mehmon ko'rinishi nima? | Kirmagan odam ko'radigan ekran: ro'yxat bor, harakat uchun ro'yxatdan o'tish kerak | Mentor misolida boshqa o'yinchilarning ismi unda yo'q |
| APK o'rnatgan telefonda tuzatish o'zi paydo bo'ladimi? | Yo'q: yangi fayl tayyorlanadi va havola almashtiriladi | Backend esa push'dan keyin odatda o'zi yangilanadi |
| 2016-yilda Netflix nimani ochiq aytgan? | Ko'rishlarning qariyb 80 foizi qidiruvdan emas, tavsiyalardan keladi | Netflix — film va serial ko'rsatadigan xizmat |
| Tuzatish chiqdi — gipoteza to'g'ri ekani bilindimi? | Yo'q: buni keyingi kunlardagi sonlar ko'rsatadi | «Tuzatildi» — ish fakti, natija — keyingi sonlar |
- §145: har javobdagi so'z darsda bor (qadamlar — 0, 2 · foiz, to'xtab qolish qadami, eng kichik son — 2, 3 · turli qurilmalar — 2, A1 · sanoq sahifasi, kalit — A1 · gipoteza — 6, A2 · mehmon ko'rinishi, APK — A2 · Netflix — 5 · 15 ta qurilma — 8).
- S-027: har old tomon — to'liq savol, «?» bilan. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). «Inglizchasi: funnel» — faqat shu kartada, bir marta (tayanch 2).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda.
1. Sinfdoshingiz sanoq sahifasi manzilini bilib oldi. U sonlarni ko'radimi? (A1)
   - ✔ A — Yo'q: kalitsiz sonlar chiqmaydi (31)
   - B — Ha: manzilni bilgan har kim ko'radi (35)
   - C — Ha: lending hammaga ochiq turibdi (33)
   - D — Ha, ilovani o'rnatgan bo'lsa ko'radi (36)
2. Render'dagi Backend `SANOQ_KALITI` ni qayerdan oladi? (A1)
   - A — Backend kodiga yozilgan qatordan (32)
   - ✔ B — Xizmatning Environment bo'limidan (33)
   - C — Repo'dagi README faylining ichidan (34)
   - D — Lending sahifasining kodi ichidan (33)
3. Sanoq sahifasi o'zi qanday yangilanadi? (A1)
   - A — Har 5 soniyada Backend'dan qayta-qayta so'raydi (47)
   - B — Ega sahifani o'zi qo'lda yangilab o'tiradi (42)
   - ✔ C — Ulanish orqali Backend aytadi, sahifa so'raydi (46)
   - D — Ilova sonlarni sahifaga o'zi yozib boradi (41)
4. 20 qurilmadan 15 tasi keyingi qadamga o'tdi. Foiz qancha? (2)
   - A — 15 foiz (7)
   - B — 20 foiz (7)
   - C — 5 foiz (6)
   - ✔ D — 75 foiz (7)
5. Yangi telefonda ilovani uch marta ochdingiz. `ochdi` qancha oshadi? (2, A1)
   - ✔ A — Bittaga: turli qurilmalar sanaladi (34)
   - B — Uchtaga: har ochish alohida sanaladi (36)
   - C — Oshmaydi: egasi sanoqqa kirmaydi (32)
   - D — Ikkitaga: birinchi ochish sanalmaydi (36)
6. Sanoqda «ro'yxatdan o'tdi» — 30, Database'da — 28. Nima deysiz? (A1)
   - A — Ikkalasi bir narsa, farqini o'chiramiz (38)
   - ✔ B — O'lchovi boshqa: qurilma va akkaunt (35)
   - C — Biri xato, qaysi biri ekanini qidiramiz (39)
   - D — Teng bo'lishi shart, bo'lmasa sanoq xato (40)
7. 2016-yilda Netflix aytishicha, ko'rishlarning qariyb 80 foizi qayerdan keladi? (5)
   - A — Qidiruv qatoridan (17)
   - B — Reklama oynalaridan (19)
   - ✔ C — Tavsiyalar qatoridan (20)
   - D — Do'stlar havolasidan (20)
8. Bu darsda nechta to'xtab qolish qadami tuzatiladi? (6, A2)
   - A — Ikkalasi ham, birdaniga (23)
   - B — Hech biri, avval kutiladi (25)
   - C — Uchalasi ham, navbat bilan (26)
   - ✔ D — Bittasi, ikkinchisi keyin (25)
9. Mentor misolida kirmagan odam «Qo'shilaman»ni bossa, nima ochiladi? (A2)
   - ✔ A — «Ro'yxatdan o'tish» ekrani (26)
   - B — «O'yin to'ldi» degan yozuv (26)
   - C — O'yinchilar ismlari ro'yxati (28)
   - D — Ilovaning o'rnatish fayli (25)
10. Mehmon ko'rinishi APK o'rnatgan telefonda qachon chiqadi? (A2)
   - A — `git push` qilinishi bilanoq (28)
   - ✔ B — Yangi faylni o'rnatgandan keyin (31)
   - C — Render qayta ishga tushganda (28)
   - D — Ilovani yopib, qaytadan ochganda (32)
11. Gipotezaning «chunki» qismi nimani aytadi? (6)
   - A — Qaysi ekranda nima o'zgarishini (31)
   - B — Tuzatishga qancha vaqt ketishini (32)
   - ✔ C — Nega shunday kutayotganimizni (29)
   - D — Tuzatishni kim yozib berishini (30)
12. Agent «tuzatdim» dedi. Birinchi nima qilasiz? (A2)
   - A — Yangi o'rnatish faylini tayyorlaysiz (36)
   - B — Lendingga yangi havolani qo'yib qo'yasiz (40)
   - C — Gipotezani isbotlandi deb yozib qo'yasiz (40)
   - ✔ D — Ilovada tuzatishni o'zingiz tekshirasiz (39)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran ↔ arena 4 (qaysi oraliq ↔ foiz hisobi), 8-ekran ↔ arena 12 (kichik sondan xulosa ↔ agent da'vosi).
- 1, 2-savollar distraktorlari — sahifa hammaga ochiq yoki kalit ochiq joyda degan yanglish (bitta xato-sinf: maxfiylik); savollar kartochka 6, 7 nusxasi emas (boshqa holat) · 5, 6-savollar — o'lchov birligini aralashtirish (qurilma · ochish · akkaunt) · 10-savol — APK o'zi yangilanadi degan yanglish (A, C, D — Backend yoki telefon tomonidagi harakat).
  3-savol A — 10-Moduldagi dashboard usuli: o'sha darsda rost edi, bu sahifada emas (savol «sanoq sahifasi» haqida). 7-savol — bank fakti (2016, «qariyb 80 foizi», «qidiruvdan emas»); distraktorlar bankka zid.
- **Fon so'zlari** (R-008, kodda {uz, ru}): qadamlar · foiz · to'xtab qolish qadami · sanoq sahifasi · maxfiy kalit · gipoteza · mehmon ko'rinishi · yangi versiya · APK · Maydon Jamoa · 59% · 44%. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmDropOffLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `m10-08-v1`, `lessonTitle` — «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?».
2. `SCREEN_META` 12: hook · plan · concept · test · practice (A1) · case (voqea) · practice-own (mustaqil) · practice (A2) · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 2, 8: 0 }; bloklar `practice: -1`, signal `PRACTICE_BASE + ekran`.
   ⚠️ Skelet tartibidan farq: A1 — `screens[4]`, voqea — `[5]`, mustaqil — `[6]`, A2 — `[7]` (tayanch 4: 8-darsda A1 mustaqil ishdan oldin).
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + `QTaxmin`, yopilmaydigan ixcham qator) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s4/s7 `QBlok` + `QPrompt` (`ScreenBlok` ulagichi, 4 bo'lim) ·
   s5 `QVoqea` (+ `NetflixSahna`) · s6 `QMustaqil` (`QQadamlar` 1/2/3) · s9 `QNatija` · s10 `QKartochka` (alohida ekran) · s11 `QYakun`.
4. **Bitta vizual `QadamSanoq`** (180): `QADAM_SANOQ` const — `mentor` (to'rt qadam: `{ id, nom, soni }` 46 · 27 · 12 · 9; `db` 27; `sinfdosh` 11), `oraliq` (59 · 44 · 75; o'tmadi 19 · 15 · 3 — hisob funksiyasi, qo'lda yozilmaydi), `ekran` (Kirish · O'yinlar · O'yin · mehmon O'yinlar),
   `mashq` (40 · 30 · 10 · 8), `keyin` (15 · 11 · 73 · oldin 59), `sanoqSahifa` (sarlavha, kalit maydoni, qatorlar). Telefon ramkasi ≈170×272 (SABOQ 22), «Maydon Jamoa» o'z rangida (SABOQ 2, 23); ustunlar noldan, teng kenglikda (voronka shakli yo'q).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: qs-oraliq qs-ustun qs-telefon`). Foiz — `Math.round(keyingi / oldingi * 100)`, 0 ga bo'lish — «—». `reduced-motion` — o'tishsiz.
5. s2: uch oraliq tartibda (halqa + pulsatsiya, SABOQ 11); har bosishda yorliq sanab chiqadi, telefon ekrani almashadi; 3/3 dan keyin ikki eng kichik foiz `err` fon, «to'xtab qolish qadami» yorlig'i; `QTaxmin`. Holat bosilgan oraliqlardan (P-046).
6. s4 (A1): `ScreenBlok` 4 bo'lim; joy `{nimani sanasin}` (o'quvchi) + `{lending manzili}` (`pm-m10d1-lending.manzil` dan oldindan, tahrirlanadi; yo'q bo'lsa bo'sh pill). 4-bo'lim (4) qatori `pm-m10d7-reja.royxat` va `.sana` dan (yo'q bo'lsa qator ko'rinmaydi).
   1-ekran pastki qator 2 — `pm-m10d7-reja.tekshiruv.olchov` dan. Bajarilganda dars ichida `a1: true` (yakun uchun).
7. s5: `NetflixSahna` — uch kadr (ikki telefon · bitta telefon va besh «ko'rish» belgisi · Netflix telefoni chapda + `QadamSanoq` ustunlari); «Netflix» nomi qizil rangda, logotipsiz (SABOQ 2, 3); `QBashorat` 1/3 da, zinapoya 20 · 50 · 80.
8. s6: ketma-ket karta formasi (SABOQ 29): 1 — qatorlar `{ nom, soni }` (3–5; `/^\d+$/`), foiz o'zi; «Sonlarim hali yo'q» → `QADAM_SANOQ.mentor` nusxasi + belgi `mashq` (TAYANCHGA SAVOL 9); 2 — oraliq tanlash (ikki), ★ (bitta); 3 — gipoteza uch maydon.
   `QXato` maslahatlari — bo'sh maydondan boshqasi bloklamaydi. Saqlash `pm-m10d8-qadamlar` (tayanch 8: `id` `q1`…, `toxtash: [★ id, keyin id]`, `tuzatildi: false`, `chiqarildi: false`, `sana`). Mentor rejimida — `QADAM_SANOQ.mentor` va Mentor gipotezasi.
9. s7 (A2): `ScreenBlok` 4 bo'lim; «Qayerda» qatoridagi `{to'xtab qolish qadami}` — `pm-m10d8-qadamlar` dagi ★ qadam `nom` i; 1-bo'limdagi gipoteza gapi — o'sha kalitdan; joy `{nima qilsin}` (o'quvchi).
   **KOD (qolipda yo'q):** 4-bo'lim (4) ichida **lending havolasi uchun kichik tayyor prompt qutisi** («Nusxalash», `{yangi havola}` — o'quvchi qo'yadi) va **ikki tanlov** «Yangi versiya chiqdi» / «O'rnatish fayli navbatda» → `tuzatildi` ((3) «Bajardim»), `chiqarildi`, dars ichida `navbatda`.
   Trek (`pm-m9d8-platforma.trek`): `web` — (4) da APK va brauzer ko'rinishi qatorlari yashirin, web-trek qatori ko'rinadi; kalit yo'q bo'lsa — ikkalasi. 4-bo'lim (1) dan keyin joriy qator (mehmon ko'rinishi ta'rifi).
   `ortda`: ikkala blokda `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-08-done`.
10. s3/s8 `QTest` — matn yuqoridagidek; s3 ustida mashq kartasi, s8 ustida «tuzatishdan keyingi kunlarda» kartasi (`QADAM_SANOQ.mashq`, `.keyin`). `RECAPS` { 3, 8 } (3 karta + `ask`); `Q_LABELS` { 3, 8 }.
11. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s3 birinchi urinish → Drop-off Finder · A1 oxirgi «Bajardim» → Live Counter · s6 «Saqlash» → Hypothesis Ready · A2 oxirgi «Bajardim» → New Version.
12. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — s10 alohida ekranda.
13. s11 `QYakun`: `recap` 5 qator, «Bugungi asosiy fikr» `small`; `uyga` — `HwCard` (alohida `.homework.jsx` yo'q; ① trek va `navbatda` dan, ③ holatdan yig'iladi); sarlavha **besh holat** + mashq qatori — `a1`, `pm-m10d8-qadamlar` (`gipoteza`, `tuzatildi`, `chiqarildi`), `navbatda`, mashq belgisidan (P-046);
    `keyingi` — «Loyiha kuni: foydalanuvchini qaytaradigan eslatma».
14. App.jsx `m10-08` qatoriga `comp: PmDropOffLesson` — «qur» bosqichida (asosiy seans; nom va osti o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari (3, 8).
- Darvozalar: `npm run gates -- src/10-Modull/PmDropOffLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` · `lint:jsx` 0 · `stilsiz.py` · surat 1280 + 393.

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m12-dars-08-start` → `m12-dars-08-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m12-dars-08-start`** = `m12-dars-07-done` (tayanch 3): `hodisalar` va `hodisaYoz` to'rt joyda; `GET /oyinlar` faqat token bilan; ilova tokensiz «Kirish»ni ochadi; lendingda ikki havola.
2. **`m12-dars-08-done`** = start + ikki commit (A1, A2) aynan A1/A2 «Yordam» promptlaridagidek: `GET /hodisalar/sanoq` (kalit sarlavhada; `401`) — to'rt qadam `COUNT(DISTINCT qurilma_id)` + `oyinchilar` `namuna = false` soni · gateway: `auth` dagi kalit → `sanoq` xonasi, `POST /hodisalar` dan keyin `sanoq-ozgardi` ·
   Backend lending manzilini qabul qiladi · `lending/sanoq.html` (kalit maydoni, sonlar, Umami'siz, lendingdan havolasiz) · README o'zgaruvchilar ro'yxatida `SANOQ_KALITI` (qiymatsiz) ·
   `GET /oyinlar` tokensiz — `men…` va ismsiz · ilovada mehmon «O'yinlar» (tepada «Kirish»), «Qo'shilaman» → «Ro'yxatdan o'tish», mehmonga ulanish yo'q · lendingdagi «Android: ilovani o'rnatish» — yangi fayl havolasi.
3. README «Darslar va teglar» jadvaliga 8-dars qatori: «sanoq sahifasi (`lending/sanoq.html`, `SANOQ_KALITI`); mehmon ko'rinishi; yangi o'rnatish fayli».
4. **Bog'liqlik:** 9-dars `eslatmadan-ochdi` sanoq sahifasida yangi qator bo'lib chiqadi (tayanch 1.9 A3) — sahifa qadamlar ro'yxatini koddagi tartibdan oladi; 10-dars Mentor hisobotidagi qadamlar sanog'i shu sahifadan (tayanch 1.10).

## Manbalar (o'zim tekshirgan rasmiy sahifalar — 06.10.2026)
- render.com/docs/configure-environment-variables — xizmat sahifasida chap paneldagi **Environment** → «+ Add Environment Variable» → saqlashning uch varianti: «Save, rebuild, and deploy» · «Save and deploy» · «Save only» (oxirgisi deploy qilmaydi). Darsda: «Environment bo'limiga qo'shib saqlang»; tugma nomlari o'quvchi matnida yo'q.
- docs.netlify.com/cli/get-started — «By default, the `deploy` command deploys to a unique _draft_ URL for previewing and testing» · «To do a _production_ deploy to your main site URL, use the `--prod` flag» ·
  «With continuous deployment, Netlify will automatically deploy new versions of your site when you push commits to your connected Git repository.» → brauzer ko'rinishi push'dan keyin faqat Git bilan ulangan saytda o'zi yangilanadi (TAYANCHGA SAVOL 4).
- docs.expo.dev/guides/publishing-websites — `npx expo export -p web`; `public/_redirects`; «`netlify deploy --dir dist`»; «Netlify can also build and deploy when you push to git».
- socket.io/docs/v4/handling-cors — «Since Socket.IO v3, you need to explicitly enable Cross-Origin Resource Sharing (CORS).» → lending sahifasi Render'dagi Backend'ga boshqa manzildan ulanadi (A1 promptidagi «{lending manzili} dan … qabul qilsin»).
- Qayta ochilmadi, tayanch 6 dan: socket.io `auth`, xona, qayta ulanish, «ko'pi bilan bir marta» · EAS `eas build -p android --profile preview`, oyiga 15 ta Android build, past ustuvor navbat · Render push'dan keyin deploy, ulanish yangi versiyada uziladi · Neon SQL Editor «Run».
- `PM_Prompt_v8.md` K6 (198–202-qatorlar, grep 06.10) — bank asli (5-ekran «Manba» qatorida) · `src/4-Modull/PmLesson11.jsx` (5-Modul `m4-02`) — K6 oldingi ishlatilishi va «qariyb 80 foizi» yozilishi · 11-Modul tayanchi 9.29 (`GET /oyinlar` maydonlari) · App.jsx 404–406.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ⚠️ 08-FILTR 1: ta'rif almashtirildi — «foizi past joy; bu darsda eng past ikkitasi» (tayanch 9.40 a). ✅ tayanch 9.27 (ta'rif — «o'tganlar foizi eng kichik bo'lgan joy») — 🔴 **«To'xtab qolish qadami» ta'rifi** (tayanch 2, 1.8: «bir qadamdan keyingisiga eng kam odam o'tgan joy») — mutlaq son bilan o'qilsa, Mentor misolida eng kam qurilma oxirgi oraliqqa o'tgan (12 dan 9 tasi — 9 ta), lekin u to'xtab qolish qadami emas (75%).
   Tayanchning o'zi ikki to'xtab qolish qadamini foiz va yo'qotish bo'yicha belgilagan (59%, 44%). MD ta'rifni so'zma-so'z oldi va ortiga «— uni foiz ko'rsatadi» qo'shdi; 3-ekran testi shu farqni so'raydi. Taklif: tayanch 2 ta'rifi — «bir qadamdan keyingisiga eng kam foiz o'tgan joy».
2. **Qaysi to'xtab qolish qadami birinchi tuzatiladi.** Tayanch: Mentor gipotezasi «birinchi to'xtab qolish qadami uchun» (ro'yxatdan o'tish, 59%), qo'shilish (44%) — «keyin». Sabab tayanchda yo'q. MD sababi (6-ekran Yordam): «u yo'lda birinchi — undan o'tmagan odam keyingi qadamlarni ko'rmaydi». O'quvchi o'zi tanlaydi (★), umumiy qoida qilinmagan.
3. **`sanoq-ozgardi` nomi.** 8-darsda «hodisa» — analitika ma'nosida (tayanch 2, T-015). Sanoq sahifasini yangilaydigan ulanish xabari o'quvchi prozasida «Backend sahifaga ulanish orqali aytadi», promptda faqat `sanoq-ozgardi` nomi. 9-darsdagi «sanoq yozuvi» kabi alohida so'z kerakmi?
4. ◐ 08-FILTR 20: web-trek — telefonda tekshirib, ko'rinmasa qayta `--prod` (bitta usul muzlatilmadi: 11-Modul usulni aytmagan). ✅ tayanch 9.28 (`netlify deploy --prod --dir dist`, qayta eksport bilan) — 🔴 **Brauzer ko'rinishi push'dan keyin «odatda o'zi yangilanadi»** (tayanch 1.8) — 7-dars pilotida brauzer ko'rinishi `netlify deploy --dir dist` bilan chiqarilgan; Netlify hujjati bo'yicha bu buyruq sukutda **draft** manzil beradi, asosiy manzil — `--prod`; push'dan keyin o'zi yangilanish — faqat Git bilan ulangan saytda.
   MD ikkala yo'lni yozdi (A2 4 (4)). 7-dars bilan kelishish kerak: Git bilan ulash yoki `netlify deploy --prod --dir dist`; lendingdagi iPhone havolasi qaysi manzil.
5. **Web-trek qatorlari** — tayanch 1.8 da yo'q. MD: A1 bir xil (brauzer ID, inkognito oyna); A2 — o'z saytidagi tuzatish, push bilan yangi versiya, o'rnatish fayli yo'q; mehmon uchun ro'yxat sahifa ochilganda va «Yangilash» bosilganda (11-Modul 9.84).
6. ✅ 08-FILTR 6, 7: «maxfiy kalit bilan yopiq», kalitli ulanish faqat `sanoq` xonasiga. **Sanoq sahifasi tafsilotlari** (tayanchda yo'q): kalit so'rov **sarlavhasida** (manzil qatorida emas — tarixda va loglarda qolmasin) · sahifa lendingdan havolasiz va **Umami'siz** (egasining kirishlari lending tashriflariga qo'shilmasin) · sahifada ism, login, qurilma ID yo'q · kalit — «boshqa joyda ishlatadigan parol emas».
7. ✅ 08-FILTR TS 7: bir nechta manzil — lending va brauzer ko'rinishi birga. **CORS** — lending (Netlify) Render'dagi Backend'ga boshqa manzildan so'rov va ulanish yuboradi (socket.io v3 dan aniq ruxsat kerak — Manbalar). MD: `{lending manzili}` `pm-m10d1-lending.manzil` dan o'zi qo'yiladi; tayanch 9.10 dagi `WEB_ORIGIN` ga ikkinchi manzil sifatida qo'shilsinmi?
8. ✅ 08-FILTR 12, 13: ruxsat etilgan maydonlar ro'yxati (Mentor: `id, kun, soat, maydon, kerak, qoshilgan`); tayanch 9.40 f. **Mehmonga ism ko'rsatilmaydi** — tayanch 1.8 da faqat «`men…` maydonlari yo'q». Mehmon — notanish odam bo'lishi mumkin (APK havolasi ochiq), o'yinchilar — o'smirlar; MD tokensiz javobdan o'yinchilar ismini ham olib tashladi (Mentor promptida va o'quvchi talabidagi «Nima buzilmasin»da). Tayanch 1.8 ga kiritilsinmi?
9. ✅ 08-FILTR 5: `tur: 'real' | 'mashq'` qo'shildi (tayanch 8). **`pm-m10d8-qadamlar` aniqlashtirishlari:** `id` — `q1`…`q5`, tartib o'zgarmaydi · `toxtash[0]` — ★ tuzatiladigani, `toxtash[1]` — «Keyin» · sonlari yo'q o'quvchi uchun **mashq belgisi** (`tur: 'real' | 'mashq'` — tayanch 7.7: real va mashq ajratiladi; 9, 10-darslar mashq sonlarini real deb o'qimasin) ·
   yakun uchun dars ichidagi `a1` va `navbatda` (ccProgress). Sxemaga `tur` qo'shilsinmi?
10. ✅ **08-FILTR 15: auditor rad etdi, men qabul qildim — 15/11/73 bu darsda ko'rsatilmaydi; 8-ekran savoli «gipoteza qachon bilinadi».** Eski matn: **Tuzatishdan keyingi sonlar 8-darsda.** Tayanch 1.8: «ochdi 15, ro'yxatdan o'tdi 11 (73%)» — «10-darsda ko'riladi». MD_TOPSHIRIQ_2 esa 8-darsda «15 ta qurilma — kam: farq bor, lekin bu isbot emas»ni talab qiladi. MD: 8-ekran savoli kartasida «Mentor misolida · tuzatishdan keyingi kunlarda» yorlig'i bilan va bitta kartochkada. 10-dars MD si bilan takror bo'lmasligi kerak.
11. **3-ekran mashq sonlari** 40 · 30 · 10 · 8, arena 4 dagi «20 dan 15» va arena 6 dagi «30 va 28» — Mentor misoli emas, «mashq uchun» yorlig'i bilan (pilot 07 dagi 8-ekran naqshi). 1.13 «boshqa son yo'q» faqat Mentor misoliga tegishli deb tushundim.
12. ✅ 08-FILTR 14: bu darsda qurilmaydi — O'qituvchi eslatmasida ochiq aytiladi. **Mehmon ro'yxatdan o'tgach** — `POST /royxat` token bermaydi (11-Modul 9.3), ilova «Kirish»ni ochadi; o'yinchi qaytib «Qo'shilaman»ni yana bosadi. Mentor promptida bu yo'l o'zgartirilmadi (tayanchda yo'q). Ro'yxatdan keyin o'sha o'yinga qaytarish kerakmi?
13. ✅ 10-FILTR (tayanch 9.42 g): 10-dars `chiqarildiVaqt` dan foydalanadi (birinchi `ochdi` shu vaqtdan keyin bo'lgan qurilmalar — agent yozgan `SELECT`); sanoq `?dan=` yangi kelganlarni ajratmaydi (shu vaqtdan keyingi yozuvlarni sanaydi) — 10-dars undan foydalanmaydi, «qur» da keragi qayta ko'riladi. Avvalgi yozuv: ◐ 08-FILTR 16: `chiqarildiVaqt` va sanoq `?dan=` qo'shildi; 10-darsdagi ko'rinish — 10-dars Filtrida (tayanch 9.40 e). **Tuzatishdan keyin kelgan qurilmalarni ajratish** — sanoq sahifasi jami sonni ko'rsatadi; uyga vazifa ② da o'quvchi faqat sanasi bilan yozib oladi. 10-darsdagi «tuzatishdan keyin kelgan qurilmalar» qanday sanaladi (sana bo'yicha SQL?) — tayanch 1.10 bilan kelishish kerak.
14. **«Mehmon ko'rinishi»da «Kirish» havolasi** (tepada) — tayanchda yo'q; akkaunti bor odam uchun kerak (aks holda «Qo'shilaman» → «Ro'yxatdan o'tish» yagona yo'l bo'lib qoladi).
15. ✅ 08-FILTR 10: sahnada sanaladigan besh belgi yo'q — oqim, «qariyb». **Netflix ko'prigi matni** — tayanch: «mahsulot qarori sonlarga qarab qilinadi». Umumiy qoida bo'lib qolmasligi (7.2a) va Netflix ichki qarori da'vo qilinmasligi (PM-018) uchun MD: «Bu voqeada son ko'rishlar qayerdan kelishini ko'rsatadi. Sizning sanog'ingiz ham yo'lni ko'rsatadi…». «tavsiya» — bankdagi so'zning tarjimasi (5-Modul `PmLesson11` ham shu so'z bilan).
16. **11-Modul 13-dars ko'prigi** (1-ekran Mentori): «uch sinovchi qayerda to'xtaganini kuzatgansiz — bugun buni har qadam sanog'i ko'rsatadi». 11-Modulda «to'xtash» — sinovdagi atama; bu darsda «to'xtab qolish qadami» — boshqa atama, ildizi bir. Ko'prik qolsinmi?
17. **Mustaqil ish maslahatlari va tugmalari** («Avval shuni tuzataman», «Keyin», «Sonlarim hali yo'q», «Yangi versiya chiqdi» / «O'rnatish fayli navbatda») va yakunning besh holati — MD qarori.

## Shubhali joylar (ishonchim komil emas)
1. ⚠️ **Sanoq sahifasining real vaqtda yangilanishi** — statik `lending/sanoq.html` dan Render'dagi Backend'ga socket.io ulanishi, kalit bilan `sanoq` xonasi, CORS: hujjatdan yozilgan, qurilmada sinalmagan. Agent socket.io mijozini statik sahifaga qanday ulashi (paket yoki CDN) — agentda. Pilotda.
2. ⚠️ **A1 tekshiruvi (3)** — laptopdagi brauzer ko'rinishi yangi qurilma ID olib `ochdi` ni yozadi deb kutildi (7-darsda `hodisaYoz` qurilma ID ni qurilmada saqlaydi; brauzerda qayerda saqlanishi tekshirilmadi). Ishlamasa — sherik telefoni yoki Expo Go.
3. **Brauzer ko'rinishini yangilash** — TAYANCHGA SAVOL 4; o'quvchi 7-darsda qaysi yo'l bilan chiqargani noma'lum.
4. **`GET /oyinlar` ni tokensiz ochish** — 11-Modul Backend'ida yo'l token himoyasi ostida; agent butun yo'lni ochib, `men…` maydonlarini qoldirishi mumkin. A2 4-bo'lim (2) aynan shuni tekshiradi — lekin `men…` maydonlari tokensiz qiymatsiz qaytsa ham «yo'q» deb ko'rinishi mumkin.
5. **EAS navbati** — Mentor misolida ≈25 daqiqa (tayanch 1.7, va'da emas); haqiqiy vaqt tekshirilmagan. Oyiga 15 ta bepul build — 6 va 7-darsdagi build'lar bilan yetishi o'quvchiga bog'liq.
6. **«APK o'zi yangilanmaydi»** — tayanch fakti, kursdagi sozlamada rost; Expo'da havodan yangilash xizmati bor (EAS Update), bu kursda sozlanmagan — MD bu haqda gapirmaydi, ochiqlik uchun shu yerda.
7. **Render Environment saqlash** — uch variantdan qaysi biri tanlanishiga qaramay, keyingi push deploy qiladi deb yozdim (Render hujjati: «Save only» deploy qilmaydi; push esa Auto-Deploy bilan deploy qiladi — 11-Modulda sozlangan deb oldim).
8. **3-ekran D varianti** («Ochishda») — ta'rifga zid, lekin lendingdan ilovaga yetmaganlar ham bor; savol kartadagi sonlarga bog'langan — sonlar «ochdi» dan boshlanadi. Auditor «rost bo'lib qolishi mumkin» desa — boshqa distraktor kerak.
9. **Netflix sahnasidagi besh belgi** (to'rttasi tavsiyadan) — «qariyb 80 foizi»ning ko'rinishi; son faqat Mentor gapida. Sahna «aniq 4 / 5» deb o'qilishi mumkin.
10. **Mehmonga ro'yxat Backend'dan keladi, lekin «O'yin» ekrani** — 11-Modulda «qo'shilganlar ro'yxati» (ismlar) ko'rsatilgan bo'lsa, mehmonda u yashirilishi kerak; `GET /oyinlar` javobida ismlar bor-yo'qligi tayanchda aniq emas (9.29 da maydonlar ro'yxatida yo'q). TAYANCHGA SAVOL 8.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7)
1. [x] Yakun holatga qarab — 11-ekran: besh sarlavha + mashq qatori; ✓ va nishon faqat «Tuzatish odamlarga chiqdi» da; uyga vazifa ① trek va navbatdan, ③ holatdan.
2. [x] Da'vo isbot emas: a) kurs qolipi chegaralangan — asosiy fikr «Bu darsda …», arena 8 «Bu darsda», «bir darsda bitta tuzatish» — Mentor misoli va tayanch qoidasi deb; gipoteza shakli — «10-Modul shakli» · b) Mentor misoli umumiy qolip emas — to'rt qadam, mehmon ko'rinishi, «ro'yxatdan o'tish birinchi» — «Mentor misolida», A1/A2 «Yordam»; o'quvchi qadamlari va tuzatishi o'ziniki (A1 `{nimani sanasin}`, A2 1-bo'lim «katta bo'lsa — birinchi ko'rinadigan qismi») ·
   c) kafolat yo'q — «oshishi kerak — odatda bir necha soniyada», «odatda o'zi yangilanadi», «chiqishi kerak», «bo'lmasligi kerak»; agent «tuzatdim» — A1/A2 4-bo'lim «agent nima desa ham, o'zingiz tekshiring», arena 12 · d) bitta tekshiruv isbot emas — «tuzatildi» (ish fakti, (3) «Bajardim») va natija (keyingi sonlar) alohida: A2 `QIzoh`, 8-ekran, recap 8, kartochka 12, uyga vazifa kulrang qatori, 6-ekran kirish qatori.
3. [x] Maxfiy qiymat chiqmaydi — `SANOQ_KALITI` faqat `.env` va Render'da, agentga faqat nomi (A1 1-bo'lim, prompt «Kalitni kodga yozma»), README da qiymatsiz; har xato gapida «`.env` qiymatlari, token va kalitlarni emas» (A1 3, A2 3); `.env` `git status` da yo'q (A1 1, 3); sanoq sahifasida ism, login, qurilma ID yo'q.
4. [x] Tashqi xizmat faqat rasmiy hujjat — Render Environment, Netlify draft/`--prod`/Git, Expo web eksporti, socket.io CORS — «Manbalar» (06.10); EAS — tayanch 6; Render tugma nomlari o'quvchi matnida yo'q; tekshirilmaganlar — «Shubhali joylar» 1, 2, 5.
5. [x] Har sonning manbasi va o'lchovi — «Mentor misolida · 3 kun · turli qurilmalar» yorlig'i (0, 2-ekran), «mashq uchun» (3-ekran), «tuzatishdan keyingi kunlarda» (8-ekran); qurilma va akkaunt ayirilmaydi (A1 `QIzoh`, arena 6, 2-ekran O'qituvchi eslatmasi — «qo'shildi 12» va «asosiy harakat 13»); kichik son — 6-ekran kirish qatori, 8-ekran; sinfdoshlar — A1 kichik izohi.
6. [x] Tayanchda yo'q narsa to'qilmaydi — Mentor sonlari, foizlar, gipoteza, mehmon ko'rinishi, halol gap — tayanch 1.8 dan aynan; o'zim qaror qilganlar — TAYANCHGA SAVOL 1–17.
7. [x] Saqlash kaliti — `pm-m10d8-qadamlar` tayanch 8 aynan (`id` barqaror, tartib o'zgarmaydi; `tuzatildi` va `chiqarildi` — ish fakti, natija sxemada yo'q); mashq belgisi va `toxtash` tartibi — TAYANCHGA SAVOL 9; `pm-m10d7-reja`, `pm-m10d1-lending` dan o'qish — yo'q bo'lsa qator ko'rinmaydi yoki o'quvchi yozadi.
8. [x] Test: bitta himoyalanadigan javob — 3-ekran (ta'rif «foiz bilan» — TAYANCHGA SAVOL 1; A «eng kichik son» 2-ekranda rad etilgan), 8-ekran (halol gap aynan); distraktorlar darsning o'z qoidasi bilan noto'g'ri; keys distraktorlari bankka zid (arena 7); «Hech qayerda» turidagi variant yo'q; to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [x] Keys: bank so'zi aynan — 5-ekran Mentor gaplari bank bilan yonma-yon («Manba» qatori); natija va sabab qo'shilmagan; brend izohi tayanch 5 dan; ko'prik «Bu voqeada …»; «80 foiz» o'quvchiga me'yor emas (o'z sonlari bilan solishtirilmaydi).
10. [x] 90 daqiqa — taqsimot sarlavha ostida; «Ulgurmasangiz» A1 (Neon SQL bilan sonlar), A2 (o'rnatish fayli uyda); «Ortda qoldingizmi» ikkala blokda; o'rnatish fayli navbati — «Navbatni kutmang — yakuniy savolga o'ting»; sanoq yoqilmagan va sonlari yo'q o'quvchi yo'li (A1 1, 6-ekran).
11. [x] Bir ma'no — bir so'z — A-bo'lim 5: hodisa (analitika; `sanoq-ozgardi` — hodisa emas), qadam (foydalanuvchi yo'li; blok bo'laklari «bo'lim»), oraliq, qurilma / akkaunt, tekshirish / sinov, e'lon, push, «o'tish» yolg'iz yo'q.
12. [x] Web-trek teng yo'l — A1, A2 «Web-trek qatori» (brauzer ID, inkognito, push bilan yangi versiya, o'rnatish fayli yo'q), A2 Yordam oxirgi qatori; yakuniy test va yakun ikkala trekka (kichik sondan xulosa; uyga vazifa ① faqat mobil).
13. [x] Agent va o'quvchi ishi ajratilgan — qarorlar o'quvchida: nimani sanash (A1), qaysi oraliq va ★ (6-ekran), gipoteza va «Nima qilsin» (A2), «Yangi versiya chiqdi» tanlovi; agent quradi; tekshiruv o'quvchida (4-bo'limlar); agent tekshiruv yozuvlari `id` bo'yicha (A2 prompt); bu darsda `DELETE` yo'q.
14. [x] O'smir xavfsizligi — kalit va sanoq sahifasi faqat egaga; mehmonga ism ko'rsatilmaydi (A2 prompti, kartochka 9); sherik o'z telefonida havoladan ochadi — akkaunt berilmaydi (A1 eslatmasi); telefon raqami so'ralmaydi (7-darsdan login); sonlar baho emas (0, 6-ekran eslatmalari).

## O'lchov — `md08/olchov.py` natijasi (qavsdagi sonlar skript bilan to'ldirilgan) — 08-FILTR dan keyin qayta yurgizildi
```
Sarlavha [0 · Kirish  ← ]: 48 / ≤55
Javob — B [0 · Kirish  ← ]: 97 / ≤120
Javob — A [0 · Kirish  ← ]: 114 / ≤120
Sarlavha [1 · Reja  ← QR]: 45 / ≤55
Sarlavha [2 · Qadamlar v]: 34 / ≤55
Joriy qator (3/3 dan keyin, bitta) [2 · Qadamlar v]: 111 / ≤120
Xulosa [2 · Qadamlar v]: 105 / ≤110
To'g'ri izohi [3 · 1-savol  ←]: 53 / ≤60
A [3 · 1-savol  ←]: 49 / ≤60
B [3 · 1-savol  ←]: 46 / ≤60
D [3 · 1-savol  ←]: 48 / ≤60
Kirish qatori (`QIzoh`, bo'limlar ustida [A1 · Amaliyot ]: 115 / ≤120
Qator (`QIzoh`, natija ostida; tayanch 1 [A1 · Amaliyot ]: 108 / ≤120
Hammasi bajarilgach (yashil) [A1 · Amaliyot ]: 85 / ≤110
Sarlavha [5 · Netflix  ←]: 38 / ≤55
Xulosa (3/3 dan keyin, pastda, yashil) [5 · Netflix  ←]: 88 / ≤110
Sarlavha [6 · O'z sonlar]: 53 / ≤55
Kirish qatori (kulrang, tepada, bir mart [6 · O'z sonlar]: 74 / ≤120
xato · bo'sh qadam nomi [6 · O'z sonlar]: 20 / ≤60
xato · son yo'q [6 · O'z sonlar]: 40 / ≤60
xato · keyingi son oldingisidan katta (m [6 · O'z sonlar]: 51 / ≤60
xato · tanlangan oraliq foizi eng kichik [6 · O'z sonlar]: 44 / ≤60
xato · «o'zgaradi» da qadam nomi yo'q (m [6 · O'z sonlar]: 51 / ≤60
xato · «Agar» da ikki o'zgarish («va», « [6 · O'z sonlar]: 48 / ≤60
Xulosa [6 · O'z sonlar]: 86 / ≤110
Sarlavha [A2 · Amaliyot ]: 47 / ≤55
Joriy qator (1) dan keyin [A2 · Amaliyot ]: 113 / ≤120
Qator (`QIzoh`, natija ostida) [A2 · Amaliyot ]: 90 / ≤120
Hammasi bajarilgach (yashil; «Yangi vers [A2 · Amaliyot ]: 90 / ≤110
Hammasi bajarilgach («O'rnatish fayli na [A2 · Amaliyot ]: 99 / ≤110
To'g'ri izohi [8 · Yakuniy sa]: 55 / ≤60
B [8 · Yakuniy sa]: 50 / ≤60
C [8 · Yakuniy sa]: 43 / ≤60
D [8 · Yakuniy sa]: 50 / ≤60
Sarlavha [10 · Takrorlas]: 25 / ≤55
Sarlavha · tuzatildi ✓, chiqarildi ✓ [11 · Dars yaku]: 26 / ≤55
Sarlavha · tuzatildi ✓, fayl navbatda yo [11 · Dars yaku]: 38 / ≤55
Sarlavha · gipoteza saqlangan, tuzatish  [11 · Dars yaku]: 33 / ≤55
Sarlavha · Amaliyot 1 ✓, gipoteza saqlan [11 · Dars yaku]: 39 / ≤55
Sarlavha · hech biri saqlanmagan [11 · Dars yaku]: 43 / ≤55
Mashq sonlari bilan saqlangan bo'lsa — s [11 · Dars yaku]: 66 / ≤120
Karta ostida (bitta kulrang qator) [11 · Dars yaku]: 57 / ≤120

TEST L103 [0 · Kirish  ← QKiris] n=2 min/max 43/45 (4%) ✔-
TEST L162 [3 · 1-savol  ← QTest] n=4 min/max 35/42 (17%) ✔C
TEST L343 [8 · Yakuniy savol  ←] n=4 min/max 42/47 (11%) ✔A
TEST L441 [Jonli viktorina — 12] n=4 min/max 31/36 (14%) ✔A
TEST L446 [Jonli viktorina — 12] n=4 min/max 32/34 (6%) ✔B
TEST L451 [Jonli viktorina — 12] n=4 min/max 41/47 (13%) ✔C
TEST L456 [Jonli viktorina — 12] n=4 min/max 6/7 (14%) ✔D
TEST L461 [Jonli viktorina — 12] n=4 min/max 32/36 (11%) ✔A
TEST L466 [Jonli viktorina — 12] n=4 min/max 35/40 (12%) ✔B
TEST L471 [Jonli viktorina — 12] n=4 min/max 17/20 (15%) ✔C
TEST L476 [Jonli viktorina — 12] n=4 min/max 23/26 (12%) ✔D
TEST L481 [Jonli viktorina — 12] n=4 min/max 25/28 (11%) ✔A
TEST L486 [Jonli viktorina — 12] n=4 min/max 28/32 (12%) ✔B
TEST L491 [Jonli viktorina — 12] n=4 min/max 29/32 (9%) ✔C
TEST L496 [Jonli viktorina — 12] n=4 min/max 36/40 (10%) ✔D
ARENA ✔ tartibi: A B C D A B C D A B C D · taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3}

--- MUAMMOLAR ---
```
Sarlavha, xulosa, hook javobi, izoh — belgilar soni (bo'shliq bilan, `**` siz); testlar — eng qisqa / eng uzun variant va farq foizi ((max − min) / max; ±15% → ≤ ~15%); «✔ yolg'iz eng uzun» — hech bir testda yo'q; arena — ✔ o'rni A·B·C·D ×3.
Mentor gaplari ko'z bilan sanaldi: hamma ekranda ≤ 2 gap, interaktiv bosqichlarda 1. Joriy qator / `QIzoh` uchun qat'iy chegara yo'q (≤ 120 — o'z mo'ljalim); A1 kirish qatori — 120 (chegarada). Arena 4 variantlari (6–7 belgi) — son javoblari.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m10-07` «50 foydalanuvchiga qanday yetasiz?» → **`m10-08` «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?»** (osti — 1-ekran chap yorlig'ida) → `m10-09` «Loyiha kuni: foydalanuvchini qaytaradigan eslatma» (App.jsx 404–406, grep 06.10; yakundagi «Keyingi dars» shu nom).
- [x] Bitta misol-ip — «Maydon Jamoa» (hook → foiz → sanoq sahifasi → mehmon ko'rinishi); ikkinchi misol faqat 3-ekran testida va arena 4, 6 da (mashq sonlari, P-002). Metafora yo'q; voronka obrazi yo'q. Bitta vizual — `QadamSanoq` (0, 1, 2, 3, A1, 5 oxiri, 6, A2, 8).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0 (bo'sh ustunlar halqada), 2 (oraliq → foiz, telefon ekrani; 3/3 — ikki qizil oraliq), 5 (bosqich → sahna), 6 (qo'shish → ustun, oraliq → uya), A1, A2. Matn-karta yo'q.
- [x] SABOQ 11: harakatli ekranlarda navbatdagi element halqa + pulsatsiya, Mentor bosqichga qarab shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12/16: kartochkalar alohida, Mentorsiz. SABOQ 21/26: maket chapda, ustunlar o'ngda, ≤3 blok.
- [x] O'lchov (python, `md08/olchov.py`): sarlavhalar ≤55 · xulosalar ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohlari ≤60 · test variantlari ±15% (qavsdagi sonlar; natija — yuqorida). Mentor gaplari ko'z bilan sanaldi: hamma ekranda ≤2 gap, interaktiv bosqichlarda 1.
- [x] Atamalar: qadamlar · hodisa (analitika) · qurilma ID · foiz · gipoteza · talab · agent · tekshirish (tayanch 2, 7-dars, 10-Modul so'zlari); yangi: to'xtab qolish qadami · sanoq sahifasi · mehmon ko'rinishi — har biri misoldan keyin · siz-forma; Antigravity promptlari — agentga buyruq shaklida (T-002) ·
  tugmalar ot-shaklda yoki siz-formada («Oraliqni bosing», «Avval shuni tuzataman», «Sonlarim hali yo'q», «Yangi versiya chiqdi»).
- [x] Testlar: variantlar bir shaklda, uzunlik yaqin (skript), to'g'ri variant yolg'iz eng uzun emas; kalit so'z kamida ikki variantda · ✔ o'rni: 3-ekran C, 8-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (PM+PRAKT — yakuniy `QTest`) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q — xulosalar «Bu misolda», «Bu voqeada»; tashqi qadamlar «odatda», «kerak», «mumkin».
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «m10-08», «12-Modul», «K6» yo'q; blok — «Amaliyot 1»; modul raqami LMS bo'yicha — «10-Modulda», «11-Modulda», «5-Modulda» faqat O'qituvchi eslatmasida) · keys tarixiy fakti — bank bilan («Manba») · «KOD» (14) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S · PM ko'rildi: T-002/008/009/010/011/014/015/016/024/029/039/042/043/044/045/047/048/049/052/064/070 · P-001/002/004/007/008/013/014/015/016/020/025/026/028/036/046/048/052/053/059/062/064/067 ·
  S-001/002/004/006/008/010/015/018/019/020/026/027 · PM-005/017/018/020/021/030.
- [ ] (ochiq) TAYANCHGA SAVOL 1 (to'xtab qolish qadami ta'rifi — 3-ekran kaliti shunga tayanadi) va 4 (brauzer ko'rinishini yangilash — 7-dars bilan kelishish). P-011 PM V4 tartibi to'liq emas (koding yo'q) — gibrid dars, 12 ekran (tayanch 4).
