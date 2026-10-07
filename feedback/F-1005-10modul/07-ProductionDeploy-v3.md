# 10-Modul · 7-dars «Production deploy: domen, SSL, monitoring» — MD v3 (yangi dars, TEX + 3 amaliyot bloki)

Fayl: `src/8-Modull/ProductionDeployLesson.jsx` (kalit `m8-07`) · **18 ekran** (12 dars ekrani + 3 amaliyot bloki + podium, takrorlash, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Qolip: texnik dars (QTushuncha, QTest, QTartib) + 3 amaliyot bloki: repo `maydon` va tashqi xizmatlar (Netlify, Render, UptimeRobot). Kod — `src/skelet/NamunaDars.jsx` dan.
Namuna (tuzilish, hajm): 9-Modul `04-MvpArchitecture-v3.md`, `09-MvpComplete-v3.md` (A3 — deploy yo'li) va ularning `04-FILTR.md`, `09-FILTR.md`; izchillik — 10-Modul `02-EventTracking-v3.md`. Matn ko'chirilmadi.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
Menyu (DE-205, App.jsx `m8-07`): «Production deploy: domen, SSL, monitoring» · osti «sayt yiqilsa, ogohlantirish sizga keladi» (05.10 GATE M 07-q0 A; avval «birinchi bo'lib siz bilasiz») ·
oldingi dars `m8-06` «Foydalanuvchi sizga ma'lumotini ishonadimi?» · keyingi `m8-08` «Loyiha kuni: prodga ko'tarish — 1-qism».
Vaqt: ≈ 90 daqiqa — 0–11-ekranlar ≈ 42 · A1 ≈ 12 · A2 ≈ 15 · A3 ≈ 15 · natija va yakun ≈ 6. Sarlavha va izoh yonidagi `(NN)` — belgilar soni (Python `len()`, backtik sanalmaydi).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9: «SSL + uptime-monitoring sozlangan»; tayanch 4-bo'lim: «HTTPS tekshirilgan, `/health`, UptimeRobot ogohlantirishi»).** Dars oxirida o'quvchining «Maydon»i:
   - Netlify'da yangi nom bilan ishlaydi — bepul `*.netlify.app` manzil (qaror 9), masalan `https://maydon-mahalla.netlify.app`; Render'dagi `WEB_ORIGIN` shu manzilga yangilangan (aks holda CORS so'rovni to'sadi);
   - HTTPS tekshirilgan: manzil `https://` bilan ochiladi, brauzer ulanish xavfsiz ekanini ko'rsatadi (Chrome'da «Connection is secure» — namuna yozuv, 07-FILTR 9);
   - Backend'da `GET /health` → `{ holat: 'ok' }` — Database'ga so'rov yubormaydi (GATE M M-q1 A: bepul Neon limiti); Backend javob bermasa — monitor «Down» (tayanch 3-bo'lim);
   - UptimeRobot'da ikki monitor — sayt va `/health`, har 5 daqiqada; ogohlantirish — email va telefon ilovasi; ogohlantirish kelishi bir marta tekshirilgan.
   Teglar: `m10-dars-07-start` → `m10-dars-07-done` (tayanch 3-bo'lim; A1 va A3 repo'ni o'zgartirmaydi — kod faqat A2 da).
2. **Bugungi asosiy fikr (P-013):** Monitoring saytni siz o'rningizga so'rab turadi va javob bo'lmasa sizga xabar beradi; nimani so'rashini esa bepul limitlarga qarab tanlaysiz.
   (07-FILTR 3: «birinchi bo'lib siz bilasiz» kafolat emas — monitoring navbatdagi so'rovda biladi; 07-q0 A — menyu osti ham «ogohlantirish sizga keladi».)
3. **Oldingi darslardan keladigan narsa** (`m10-dars-07-start` = `m10-dars-06-done`; deploy yo'li 9-Modul `dars-11-done` dan, repo'dan o'qildi — `README.md` «Internetga chiqarish», `backend/src/main.ts`, `backend/src/app.controller.ts`):
   - Backend — Render (Root Directory `backend`; Environment: `DATABASE_URL`, `EGA_PAROLI`, `JWT_SECRET`, `WEB_ORIGIN` — Netlify manzili) · sayt — Netlify (base `web`; `VITE_API_URL` — Render manzili, `VITE_UMAMI_ID`) ·
     ikkalasi GitHub'dan oladi va har push'dan keyin o'zi yangilanadi · Database — Neon. 9-Modulda Netlify manzili tasodifiy nom bilan qolgan (`maydon-....netlify.app`).
   - `main.ts`: CORS — `http://localhost:5173` va `WEB_ORIGIN` (oxiridagi `/` olib tashlanadi). `app.controller.ts`: `GET /` → «Maydon Backend ishlayapti» — Database'ni so'ramaydi.
   - Sayt xato holati (`App.jsx`): «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» README «Xatolar»: «Netlify'da sayt «Vaqtlarni yuklab bo'lmadi» deydi — Render'da `WEB_ORIGIN` yozilmagan…».
   - 1-Modul `InternetLesson`: «Domen — saytning manzili» · «DNS — manzilni topadi» (domen → IP). 1-Modul «Netlify va deploy»: «Havola oxiri `.netlify.app` bo'ladi, boshidagi nomni Netlify o'zi tanlaydi.»
   - 4c-Modul «Saytingiz hozir ochilyaptimi?» (`PmLesson18`): «o'lchagich» — chiqqandan keyin saytni to'xtovsiz o'lchab turadigan asbob; «signal» — chegaradan o'tganda keladigan xabar;
     kartochka: «To'xtovsiz — kunu-tun (bu ishning inglizchasi — monitoring)». 4c «Loyiha kuni: ishonchli lenta»: «Haqiqiy reys (production)» — foydalanuvchi qo'lidagi muhit.
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim):**
   - **production · prod** — haqiqiy foydalanuvchilar ishlatadigan versiya (tayanch, so'zma-so'z). Bizda — internetdagi «Maydon» (Netlify + Render + Neon). «jonli versiya» ishlatilmaydi.
     Bepul rejalar uzluksiz ishlashni va'da qilmaydi: Render bepul xizmatni production uchun tavsiya qilmaydi («Do not use them for production applications», render.com/docs/free) — 1-ekran qatori (07-FILTR 1).
   - **sayt nomi** — Netlify'dagi loyiha nomi, `….netlify.app` manzilining boshi (Netlify interfeysida «project name» — T-033). **bepul manzil** — `{nom}.netlify.app` (qaror 9).
   - **domen · DNS** (1-Modul, so'zma-so'z) · **o'z domeni** — sotib olinadigan domen (faqat Mentor misolida: `maydon-mahalla.uz`) ·
     **DNS yozuvi** — YANGI: domen qaysi saytga olib borishini aytadigan yozuv (10-ekran; yozuv turi «CNAME» — faqat maket yorlig'ida, yodlatilmaydi).
   - **`WEB_ORIGIN` · ruxsat ro'yxati (CORS)** — 9-Modul 9-dars so'zi: «Backend'ning ruxsat ro'yxati (CORS)».
   - **HTTPS · SSL** — tayanch: «qulf belgisi: sayt bilan brauzer orasidagi ma'lumot shifrlangan; SSL — buni ta'minlaydigan sertifikat». Darsda: **shifrlash** — yo'lda o'qib bo'lmaydigan ko'rinishga aylantirish
     (tarmoqda kuzatayotgan odam mazmunini o'qiy olmaydi — 07-FILTR 7); **SSL sertifikati** — HTTPS ni yoqadigan, aynan shu manzil uchun berilgan hujjat. «Qulf» so'zi — TAYANCHGA SAVOL 6 (Chrome'da belgi o'zgargan).
   - **`/health`** — Backend javob berayotganini aytadigan yo'l (route); bizda Database'ni so'ramaydi — Database, band qilish va kirish ishlashini isbotlamaydi. **200** — javob keldi; javob kelmasa — monitor «Down». **bepul limit** — bepul rejada xizmat oyiga necha soat ishlay olishi (Neon ≈ 400 soat, Render 750 soat — tayanch 6).
   - **monitoring** (4c-Moduldan) — saytni to'xtovsiz, kunu-tun kuzatish; **ogohlantirish** — sayt yiqilsa keladigan xabar (tayanch). 4c dagi «o'lchagich» va «signal» 8-ekranda bir marta tenglashtiriladi (T-052).
   - **UptimeRobot** — saytlarni kuzatadigan xizmat (birinchi ko'rinishda bir qatorli izoh). **monitor** — UptimeRobot'dagi bitta kuzatuv: qaysi manzil, necha daqiqada (interfeys so'zi).
     Holatlar **Up** / **Down** — interfeys so'zlari, tarjima qilinmaydi: Up — javob keldi; Down — javob kelmadi yoki xato qaytdi.
   - **yiqildi** — sayt yoki Backend javob bermay qoldi (menyu osti yozuvi so'zi; «Down» bilan bir ma'noda).
   - **Ishlatilmaydi:** «alert» · «server» (prozada) · «baza» · «24/7» (T-020) · «jonli versiya» · «bildirishnoma», «push» (o'rniga «ilovaga ogohlantirish») · «sinov» (real odam emas — «tekshirish», «tekshiruv monitori») ·
     «sir» (o'rniga «maxfiy kalit», T-021) · «tekshiradi» UptimeRobot uchun kam — asosiy fe'l «so'raydi» (tayanch 6: «`/health` ni so'rasa»).
5. **Mentor misolidagi nomlar va voqea (o'ylab topilgan maket ma'lumoti, statistika emas — TAYANCHGA SAVOL 4):** Netlify eski nomi `maydon-x7k2p9` (tasodifiy) → yangi `maydon-mahalla`
   (05.10 da bo'sh — `https://maydon-mahalla.netlify.app` 404 «Not Found») · Render manzili `maydon-….onrender.com` (README namunasi `maydon-xxxx.onrender.com`) ·
   o'z domeni `maydon-mahalla.uz` (05.10 da DNS'da yo'q — ro'yxatdan o'tmagan ko'rinadi; `maydon.uz` band — ishlatilmadi) · tun voqeasi: 23:10 da Backend javob bermay qoladi (0, 8, 11-ekranlar).
   Sonlar faqat tayanch 6-bo'limdan: UptimeRobot — 50 monitor, 5 daqiqa; Render bepul — 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈ 1 daqiqa, 750 soat butun akkauntga; Neon bepul — 100 CU-soat (≈ 400 soat eng kichik o'lchamda), 5 daqiqada o'chadi. Namuna forma: `Ali · +998 90 000 00 01 · 18:00` (9-Modul namunasi).
6. **Metafora yo'q. Keyssiz** (TEX — tayanch 5-bo'lim). Qahramon yo'q — vazifani Mentor beradi; odamlar: o'yinchi, maydon egasi.
7. **Kod yozish — faqat A2 da** (`/health`, Antigravity prompt bilan). A1 va A3 — tashqi xizmat sozlamalari, kod yo'q. Agent talabga tayanib quradi, taxmin qilishi mumkin — `ok` va javobsizlikni o'quvchi
   brauzerda o'zi tekshiradi (tayanch 7.2). Har tashqi qadamda xato yo'li bitta gap (P-026). Har blok oxirida — «O'z g'oyangiz» (9-Modul M-q1).
8. **Domen sotib olish va DNS — faqat Mentor misolida** (qaror 9; 10-ekran, maket). O'quvchi pul to'lamaydi; narx va domen sotuvchisi nomi aytilmaydi (tayanchda manba yo'q).
9. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; Netlify, Render, UptimeRobot, Chrome kartalari chizilgan, logotipsiz; rang — faqat holat foni (D3).
10. **Tashqi xizmatlar — rasmiy hujjatdan tekshirildi (05.10.2026; o'quvchiga ko'rinmaydi, P-028):**
    - **Netlify.** Loyiha nomi: «Project Overview dashboard → **Customize** → **Manage project name and cover image**»; «The project name determines the default URL»
      (docs.netlify.com/manage/projects/customize-project-name-and-cover-image). «If you rename your project, the default URL changes to match» (docs.netlify.com/manage/projects/how-projects-work).
      HTTPS: «When you create a new site on Netlify, it's instantly secured at the Netlify-generated URL… If you add a custom domain, we will automatically provision a certificate with Let's Encrypt»;
      holat — «Domain management > HTTPS» (docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl). `*.netlify.app` sertifikati — DigiCert, `CN=*.netlify.app` (openssl, 05.10) —
      shuning uchun darsda «Let's Encrypt» faqat o'z domeni uchun aytiladi. Tashqi DNS: `www` uchun **CNAME** → `{nom}.netlify.app`; «Domain management > Production domains», holat «Pending DNS verification»
      (docs.netlify.com/manage/domains/configure-domains/configure-external-dns; o'sha sahifa: «changes to DNS records can take several hours to propagate», «It may take a full day»). «The Netlify subdomain URLs will always work even if you set up a custom domain» (…/domains-fundamentals/understand-domains).
    - **Render.** «Environment» (chap panel) → «+ Add Environment Variable» / qatorni tahrirlash → saqlash ro'yxati: «Save, rebuild, and deploy» · «Save and deploy» · «Save only»; «Save only» dan boshqasi qayta deploy qiladi
      (render.com/docs/configure-environment-variables). Bepul: «spins down a Free web service that goes 15 minutes without receiving any inbound traffic… takes about one minute» (render.com/docs/free).
    - **UptimeRobot.** Bepul reja: 50 monitor, 5 daqiqa, «Mobile app (iOS/Android) — Yes», Telegram — Solo rejasidan (uptimerobot.com/pricing.md; tayanch 6 bilan mos).
      Tijorat loyihasida ham ishlatsa bo'ladi: «The free plan can be used for business, commercial, and revenue-generating projects» (help.uptimerobot.com/en/articles/11604710, 28.09.2026 yangilangan; 05.10 o'qildi) —
      tayanch 6 dagi «shaxsiy, notijorat» eskirgan edi (07-FILTR 2).
      Monitor qo'shish: «**+ Add New Monitor**» → «**HTTP(s)**» → URL → alert contact → «**Create monitor**» (help.uptimerobot.com/en/articles/11358364). Email kanali — ro'yxatdan o'tgan email;
      ilova: «install the UptimeRobot application on your mobile device and log in… This will make the push notification endpoint available in your dashboard» (…/articles/11360953).
      «By default, any HTTP 2xx or 3xx response counts as up»; sukut timeout — 30 soniya; xato bo'lsa 3 martagacha qayta so'raydi (…/articles/11358466) — TAYANCHGA SAVOL 10.
    - **Chrome.** 117-versiyadan manzil qatoridagi qulf o'rnida sozlama belgisi turadi; bosilsa «Connection is secure» (Chromium blogi, 2023-yil may; matbuot) — darsda «manzil qatori chetidagi belgi».

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. 9-Modulda u internetga chiqdi, 10-Modulda o'lchandi va himoyalandi.
  Bugun — prodga tayyorlanadi: eslab qoladigan nom, HTTPS, holat yo'li va monitoring.
- **Hook:** kechasi 23:10 da Backend javob bermay qoladi → buni birinchi bo'lib ertalab sayt ochgan o'yinchi ko'radi → 2 nom → 4 HTTPS → 6 `/health` va bepul limit → 8 monitoring (javob hook savoliga) → 10 o'z domeni (Mentor misoli) → A1–A3.
- **Bitta vizual — «Prod xaritasi» (`PROD_TUGUNLAR`, dars bo'yi, 163/180):**
  - Chapda **o'yinchi telefoni** (191 ramka): manzil qatori (chetida belgi) · «Maydon» · Bugun · olti vaqt katagi `16:00` … `21:00` · forma (Ism · Telefon · «Band qilish») ·
    xato holati «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»
  - **Sayt · Netlify** (ichida sayt nomi) → **Backend · Render** (ichida `WEB_ORIGIN` qatori va ikki yo'l: `GET /` · `GET /health`) → **Database · PostgreSQL (Neon)** (holat: oq — javob beradi, qizil — javob bermaydi).
  - Chetda **UptimeRobot** tuguni — ikki uzuq chiziq: saytga va `/health` ga; ichida ikki monitor qatori (5 daqiqalik katakchalar, Up — yashil, Down — qizil).
  - O'ngda **sizning telefoningiz** — email va ilova ogohlantirishlari joyi (0-ekranda bo'sh: «Yangi xabar yo'q»).
  - Ekranga xos qo'shimcha tugunlar: **Wi-Fi** (4-ekran, telefon bilan Backend orasida) · **DNS** va «domen sotuvchisi paneli» (10-ekran).
  - So'rov — yorlig'i yozilgan konvert (`GET /vaqtlar`, `GET /health`). 6-ekranda Database tugunida oy kalendari va «uyg'oq soatlar» chizig'i. `prefers-reduced-motion` da konvert yurmaydi — holat birdan almashadi (DE-200).
  - Ishlatilishi: 0 · 1 (tayyor, o'zi o'ynaydi) · 2 · 4 · 6 · 8 · 10 · 11 (bo'laklar ostida kichik) · A1–A3 kutilgan natija — tugunlarning kattasi.
- **Yakun:** «Maydon» yangi manzilda, HTTPS bilan, ikki monitor ostida · keyingi dars — eng yaxshi loyiha prod ro'yxati bo'yicha.

---

## 0 · Kirish — kechasi yiqildi, ertalab bilindi  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **«Maydon» kechasi yiqilsa, buni birinchi kim biladi?** (51)
- Mentor: O'yinchilar «Maydon»ni kechasi ham ochadi, siz esa uxlaysiz. Tunni boshlang va soatga qarang.
- Maket (chap): tepada soat `22:00` va tun chizig'i (22:00 … 08:00). Ostida uch karta yonma-yon: **O'yinchi telefoni** (manzil `maydon-x7k2p9.netlify.app`, «Maydon», olti katak) ·
  **Prod xaritasi** kichik (Sayt · Netlify → Backend · Render → Database · Neon, hammasi oq) · **Sizning telefoningiz** (qulflangan ekran, «Yangi xabar yo'q»).
- **Harakat → Vizual o'zgarish:** «Tunni boshlang» → soat yuradi; 23:10 da Backend tuguni qizil yonadi («javob bermayapti») va soat to'xtaydi — o'ngdagi variantlar ochiladi (shu paytgacha xira).
  Javobdan keyin soat davom etadi: 07:40 da o'yinchi telefonida «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»; sizning telefoningiz jim — «Yangi xabar yo'q».
- Savol: **Buni birinchi kim biladi?**
  - Siz — telefoningizga xabar keladi (33)
  - ✔ Ertalab saytni ochgan o'yinchi (30)
  - Maydon egasi — bandlar ro'yxatidan (34)
- Javob — 2-variant: **Aynan!** Bu misolda «Maydon»ni hech narsa kuzatmayapti. Xatoni birinchi bo'lib ertalab sayt ochgan o'yinchi ko'radi. (114)
- Javob — 1-variant: **Qiziq fikr!** Bu misolda telefoningizga xabar yuboradigan hech narsa yo'q — u jim qoladi. (87)
- Javob — 3-variant: **Qiziq fikr!** Ega sahifasi ham o'sha Backend'dan so'raydi — ega ham uni ochgandagina ko'radi. (91)
- Javobdan keyin: sizning telefoningiz ekranida uzuq chiziqli bo'sh joy paydo bo'ladi — bugun to'ladigan joy (U-041).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Tunni boshlang → Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: 23:10 dagi to'xtash — Mentor misoli simulyatsiyasi. Sababini so'rashsa: masalan, Backend xato bilan to'xtab qoldi — 8-ekranda shu holat monitoring bilan ko'riladi.
  Menyu osti yozuvi («ogohlantirish sizga keladi») 1-variantga ishora qiladi — bu yaxshi: javob darsning va'dasini ochadi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun «Maydon»ga nom, HTTPS va monitoring berasiz.** (50)
- Mentor: Internetdagi «Maydon»ni o'yinchilar ishlatadi — bu production, qisqasi prod. Dars oxirida u yiqilsa, ogohlantirish sizga keladi.
- Chap yorliq: Dars oxirida — «Maydon» shunday ishlaydi
- Chap — «Prod xaritasi» tayyor holatda, bir marta o'zi o'ynaydi (DE-200): telefon manzili `https://maydon-mahalla.netlify.app` — kataklar chiqadi; UptimeRobot kartasida ikki qator Up (yashil);
  `/health` qatori bir lahza qizil «Down» bo'ladi → sizning telefoningizga ogohlantirish kartasi kiradi → qator yana Up.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx sarlavhasi so'zlari bilan — P-015):
  - 01 · Saytga eslab qoladigan nom · `domen`
  - 02 · Ulanish shifrlanganini tekshirish · `SSL`
  - 03 · Backend o'z holatini aytadi · `/health`
  - 04 · Yiqilsa, ogohlantirish keladi · `monitoring`
- Qator (kulrang, qadamlar ostida): Bepul rejalar uzluksiz ishlashni va'da qilmaydi: Render bepul xizmatni prod uchun tavsiya qilmaydi. (99)
- Pastki qator (mono, kichik): repo `maydon` · boshlanish `m10-dars-07-start` · tayyor namuna `m10-dars-07-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: «production» 4c-Modul «Loyiha kuni: ishonchli lenta» darsida «haqiqiy reys (production)» bo'lib o'tgan — so'rashsa, shuni eslating.
  Bepul rejalar kursda o'rganishga yetadi; katta loyihada xizmatning pullik rejasi ko'riladi — narxini aytmang (manba yo'q).
  Dars hajmi: 4 va 10-ekranlarga ortiqcha vaqt bermang — og'ir qism 2, 6, 8-ekranlar va uch blok.

## 2 · Sayt nomi va `WEB_ORIGIN`  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · sayt nomi
- Sarlavha: **Tasodifiy manzil o'rniga qanday nom qo'yasiz?** (45)
- Mentor: Manzil boshidagi nomni Netlify o'zi tanlagan — o'yinchi uni eslab qololmaydi. Yangi nom yozing va saytni telefonda oching.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»): **Nom o'zgargach, saytda vaqt kataklari chiqadimi?** · Ha, hammasi avvalgidek ishlaydi · Yo'q, yana nimadir yangilanadi
- Chapda qadamlar (163.8, o'tgani ✓, joriysi accent): 1 Yangi nom yozing · 2 Saytni oching · 3 `WEB_ORIGIN` ni yangilang
- Chap (1-qadamda): Netlify sozlama kartasi (chizilgan): «Project name» qatori `maydon-x7k2p9` → o'quvchi yozadi (ipucha: `maydon-…`) → «Saqlash».
  Faqat kichik lotin harf, raqam va chiziqcha; boshqa belgi bo'lsa — qator ostida: «Faqat kichik lotin harf, raqam va chiziqcha.» (46)
- O'ng — xarita: o'yinchi telefoni (manzil qatori) → Sayt · Netlify (nom) → Backend · Render (`WEB_ORIGIN = https://maydon-x7k2p9.netlify.app`) → Database · Neon.
- **Harakat → Vizual o'zgarish:**
  1. Nom → «Saqlash» → Netlify tugunidagi nom va telefonning manzil qatori `https://{yangi nom}.netlify.app` ga almashadi. Joriy qator: Nom o'zgarsa, manzil ham o'zgaradi. (35)
  2. «Saytni oching» → sahifa ochiladi, «Maydon» sarlavhasi bor, kataklar o'rnida «Vaqtlarni yuklab bo'lmadi». Konvert `GET /vaqtlar` Render'ga boradi, Backend uni `WEB_ORIGIN` bilan solishtiradi —
     nom boshqa: Render tuguni qizil «ruxsat ro'yxatida yo'q», javob brauzerda to'xtaydi. Joriy qator: Backend'ning ruxsat ro'yxatida (CORS) hali eski manzil turibdi. (63)
  3. Render tugunidagi `WEB_ORIGIN` qatorini bosish → qiymat yangi manzilga almashadi → tugun bir lahza kulrang «deploy…» → konvert yashil o'tadi → telefonda olti katak chiqadi.
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: `WEB_ORIGIN` yangilangach chiqdi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Netlify nomi o'zgarsa, manzil ham o'zgaradi. Yangi manzil Render'dagi `WEB_ORIGIN` ga yoziladi. (93)
- Qator (`QIzoh`, xulosadan keyin): Bu manzil bepul: `….netlify.app` ning boshini o'zingiz tanlaysiz. (63)
- Tugadi (199): qadamlar yopiladi, xarita (yangi nom, yashil chiziq) butun enga; vizual ⛶ ichida (q17).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
- O'qituvchi eslatmasi: «Netlify va deploy» darsida «boshidagi nomni Netlify o'zi tanlaydi» degan edik — bugun shu nomni o'zimiz qo'yamiz. `VITE_API_URL` o'zgarmaydi: Render manzili o'sha-o'sha.

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Netlify'da sayt nomini o'zgartirdingiz. Yana nimani yangilaysiz?** (8 so'z)
  - Netlify'dagi `VITE_API_URL` qiymatini (35)
  - ✔ Render'dagi `WEB_ORIGIN` qiymatini (32)
  - Render'dagi `DATABASE_URL` qiymatini (34)
  - Saytdagi `api.js` faylidagi manzilni (34)
- Kalit: **B** (index 1). To'g'ri variant eng uzun emas; «Render'dagi» ikki variantda, to'rttasi «joy — nom» shaklida (bir xato-sinf: qaysi qiymat sayt manziliga bog'liq).
- To'g'ri izohi: `WEB_ORIGIN` — Backend ruxsat beradigan sayt manzili; u yangi nom bilan bir xil bo'lsin. (86)
- Xato izohlari (≤60):
  - A: `VITE_API_URL` — Render manzili, u o'zgarmadi. (44)
  - C: `DATABASE_URL` — Neon manzili, sayt nomiga bog'liq emas. (54)
  - D: `api.js` Render manzilini oladi — u o'zgarmadi. (45)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · HTTPS va SSL  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · HTTPS
- Sarlavha: **Telefon raqami Backend'ga yetguncha kim ko'ra oladi?** (52)
- Mentor: O'yinchi bepul Wi-Fi'dan ham band qilishi mumkin — unda so'rov begona tarmoqdan o'tadi. Ikki xil manzil bilan yuborib, Wi-Fi tugunida nima ko'rinishiga qarang.
- Bashorat (ballsiz): **`https://` bilan yuborilsa, Wi-Fi telefon raqamini ko'radimi?** · Ha, ko'radi · Yo'q, ko'rmaydi
- Chapda qadamlar (o'tgani ✓): 1 `http://` bilan yuboring · 2 `https://` bilan yuboring · 3 Manzil chetidagi belgini bosing
- O'ng: o'yinchi telefoni (forma to'ldirilgan: `Ali · +998 90 000 00 01 · 18:00` · «Band qilish») → **Wi-Fi** tuguni (chizilgan, yorlig'i «bepul Wi-Fi») → Backend · Render.
  1-qadamda manzil qatorida `http://…` va kulrang yorliq «faraz».
- **Harakat → Vizual o'zgarish:**
  1. «`http://` bilan yuboring» → konvert ochiq yuradi; Wi-Fi tugunida matn o'qiladi: `ism: Ali · telefon: +998 90 000 00 01` (qizil fon).
  2. «`https://` bilan yuboring» → konvert qulfli yuradi; Wi-Fi tugunida `k3#9Qz…` — o'qib bo'lmaydi (yashil fon); Backend'ga yetgach konvert ochiladi — ma'lumot to'liq.
     Joriy qator: Yo'lda o'qib bo'lmaydigan ko'rinishga aylantirish — shifrlash. Shifrlangan ulanish HTTPS deyiladi. (98)
  3. Manzil qatori chetidagi belgi → kichik panel: «Connection is secure» · sertifikat: `*.netlify.app`.
     Joriy qator: HTTPS ni yoqadigan, shu manzil uchun berilgan hujjat — SSL sertifikati. (71)
- Natija qatori: «Taxminingiz: … · haqiqatda: ko'rmaydi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: HTTPS bilan ma'lumot yo'lda shifrlangan. Netlify'ning `*.netlify.app` manzilida u o'zi yoqilgan. (94)
- Tugadi (199): qadamlar yopiladi, telefon, Wi-Fi tuguni (`k3#9Qz…`) va panel fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
- O'qituvchi eslatmasi: `http://` bilan yuborish — faraz: «Maydon» manzillari `https://` bilan boshlanadi. Chrome'ning yangi versiyalarida manzil chetida qulf emas, sozlama belgisi turadi; bosilsa «Connection is secure».
  Hostinglarda ko'pincha «SSL sertifikati» deyiladi; bugungi ulanish TLS bilan ishlaydi — so'rashsa ayting, testga chiqmaydi.
  Shifrlangan ulanishda ham Wi-Fi qaysi saytga ulanayotganingizni ko'rishi mumkin — so'rashsa ayting; ekranda bitta g'oya qoladi: mazmun o'qilmaydi.

## 5 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **«Maydon» HTTPS bilan ochiladi. Bu nimani bildiradi?** (7 so'z)
  - Saytda bironta zaiflik qolmaganini (34)
  - Sayt egasi ishonchli odam ekanini (33)
  - Backend kechasi yiqilmasligini (30)
  - ✔ Ma'lumot yo'lda shifrlanganini (30)
- Kalit: **D** (index 3). To'g'ri variant eng uzun emas; to'rttasi «nimani» savoliga bir shaklda javob beradi; xato variantlar — HTTPS ni boshqa himoya bilan aralashtirish (5-dars zaifliklari, ishonch, yiqilish).
- To'g'ri izohi: HTTPS yo'ldagi ma'lumotni shifrlaydi — saytning o'zini tekshirmaydi. (68)
- Xato izohlari (≤60):
  - A: Zaiflik kodda yopiladi — HTTPS uni ko'rmaydi. (45)
  - B: HTTPS ulanishni himoya qiladi, egasini tekshirmaydi. (52)
  - C: Backend kechasi yiqilsa ham, manzil `https://` qoladi. (52)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 6 · `/health` — nega Database'ni so'ramaydi  ← QTushuncha (bashorat + kalit; GATE M M-q1 A)
- Eyebrow: Tushuncha · Backend holati
- Sarlavha: **`/health` Database'ni ham so'rasa, nima bo'ladi?** (44)
- Mentor: UptimeRobot `/health` ni har 5 daqiqada so'raydi. Kalitni tanlab, oy davomida bepul Database'ga nima bo'lishiga qarang.
- Bashorat (ballsiz): **Har 5 daqiqada Database ham so'ralsa, bepul Neon oy oxirigacha yetadimi?** · Ha, yetadi · Yo'q, oy tugamasdan to'xtaydi
- Chap: kalit «`/health` Database'ni ham so'raydi / faqat Backend javob beradi» va tugma «Oyni boshlang» (har holatda bir marta — N/2).
- O'ng: Backend · Render → Database · Neon; Database tugunida oy kalendari (30 katak) va chiziq-hisoblagich «uyg'oq soatlar» — chiziqda belgi «bepul limit ≈ 400 soat»; kalendar ustida kulrang yorliq «soddalashtirilgan hisob» (07-FILTR 5); chetda kichik o'yinchi telefoni (kataklar).
- **Harakat → Vizual o'zgarish:**
  1. «Database'ni ham so'raydi» → «Oyni boshlang» → har kun katagi to'liq to'q bo'ladi (so'rov har 5 daqiqada keladi — Database o'chishga ulgurmaydi) → chiziq kuniga 24 soatdan o'sadi →
     17-kun atrofida limit belgisiga yetadi → Database tuguni qizil «bepul limit tugadi — oy oxirigacha to'xtadi»; o'yinchi telefonida «Vaqtlarni yuklab bo'lmadi».
     Joriy qator (shu holatdan keyin): Har so'rov Database'ni uyg'otadi. Soddalashtirilgan hisob: bepul Neon oyiga taxminan 400 soat uyg'oq turadi — oyga yetmaydi. (124)
  2. «Faqat Backend javob beradi» → «Oyni boshlang» → kun kataklarining faqat kechki qismi to'q (o'yinchilar kelgan soatlar) → chiziq oy oxirigacha limit belgisidan ancha pastda qoladi; Database tuguni oq.
  - Ikkala holat ko'rilgach — kod kartasi (P-065; repo'dagi `app.controller.ts` dan soddalashtirilgan):
    ```ts
    @Get('health')
    health() {
      return { holat: 'ok' }
    }
    ```
    Ostida: `/health` faqat Backend javob berayotganini aytadi — Database'ga so'rov yubormaydi. (79)
- Natija qatori: «Taxminingiz: … · hisob bo'yicha: oy tugamasdan to'xtaydi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bizning `/health` Backend'ni aytadi, Database'ni uyg'otmaydi — monitoring bepul limitni sarflamaydi. (99)
- Qator (`QIzoh`, xulosadan keyin — tanlovning narxi halol aytiladi): Narxi: Database to'xtasa, monitoring buni sezmaydi — buni dashboard va o'yinchi sahifasi ko'rsatadi. (103)
- Tugadi (199): kalit va tugma yopiladi, ikki kalendar yonma-yon va kod kartasi fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki holatni ko'ring (N/2) → Davom etish
- O'qituvchi eslatmasi: Raqamlar — Neon bepul rejasi (neon.com/pricing, 05.10.2026): oyiga 100 CU-soat; eng kichik o'lchamda (0,25 CU) bu taxminan 400 soat; 5 daqiqa so'rovsiz qolsa Database o'chadi;
  limit tugasa — keyingi oygacha to'xtaydi. 400 / 24 ≈ 17 kun — kalendardagi soddalashtirilgan hisob shu: bepul Neon kerak bo'lsa 2 CU gacha kattalashadi, unda limit tezroq tugaydi; o'yinchilar ham uni uyg'otadi.
  Aniq kunni va'da qilmang — g'oya: monitoring uchun Database'ni bekorga uyg'otmaymiz. Render ham shunga o'xshash: 750 soat butun akkaunt uchun — bitta xizmatni doim uyg'oq tutish mumkin, ikkitasini emas
  (7-Moduldagi bot ham Render'da bo'lsa — birga hisoblang). `GET /` ham Database'ni so'ramaydi; `/health` — monitoring uchun alohida, qisqa javobli yo'l.

## 7 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **UptimeRobot `/health` dan 200 oldi. Bu nimani bildiradi?** (7 so'z; 6-ekrandan boshqa savol — natijani o'qish, §106)
  - ✔ Backend ishlab turibdi va javob berdi (37)
  - Database ham tekshirilib, ishlab turibdi (40)
  - Sayt Netlify'da xatosiz ochilib turibdi (39)
  - Ega paroli `.env` faylida to'g'ri yozilgan (40)
- Kalit: **A** (index 0). To'g'ri variant eng uzun emas; «ishlab turibdi» ikki variantda.
- To'g'ri izohi: Bizning `/health` faqat Backend'ni aytadi — Database'ni so'ramaydi. (66)
- Xato izohlari (≤60):
  - B: Bu `/health` Database'ga so'rov yubormaydi. (44)
  - C: `/health` — Backend manzili, saytni ochmaydi. (43)
  - D: Parolni `/health` emas, `POST /kirish` tekshiradi. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · Monitoring — yiqilganini kim aytadi  ← QTushuncha (bashorat + bitta oqim)
- Eyebrow: Tajriba · monitoring
- Sarlavha: **Sayt yiqilsa, buni siz qanday bilib qolasiz?** (44) — hook savoliga javob (T-064)
- Mentor: UptimeRobot — saytlarni kuzatadigan xizmat: u ikki manzilni har 5 daqiqada so'raydi. Tunni boshlang va telefoningizga qarang.
- Bashorat (ballsiz): **Backend javob bermasa, qaysi monitor «Down» bo'ladi?** · Sayt monitori · `/health` monitori · Ikkalasi ham
- Vizual: chapda UptimeRobot kartasi (chizilgan, logotipsiz) — ikki qator: **Maydon · sayt** (`maydon-mahalla.netlify.app`) · **Maydon · /health** (`maydon-….onrender.com/health`);
  har qatorda 5 daqiqalik katakchalar chizig'i va holat yorlig'i (Up — yashil). O'ngda sizning telefoningiz (0-ekrandagi uzuq bo'sh joy) va kichik o'yinchi telefoni. Tepada soat.
- **Harakat → Vizual o'zgarish:**
  1. «Tunni boshlang» → har 5 daqiqada ikki qatorga yashil katakcha qo'shiladi (22:00, 22:05 …). 23:10 da Backend tuguni qizil. 23:15 da `/health` → javob yo'q → qator qizil «Down»;
     sayt qatori yashil qoladi — sahifa Netlify'dan ochilyapti. Telefoningizga ikki ogohlantirish kiradi: ilova va email — «Down · Maydon · /health». O'yinchi telefonida — «Vaqtlarni yuklab bo'lmadi».
     Joriy qator: Saytni to'xtovsiz kuzatish — monitoring. Yiqilganda keladigan xabar — ogohlantirish. (84)
     Qator (`QIzoh`, joriy qator ostida; T-052): «Saytingiz hozir ochilyaptimi?» darsidagi o'lchagich va signal — shu monitoring va ogohlantirish. (97)
  2. «Backend'ni tiklang» → navbatdagi so'rovda `/health` → `200` → qator yashil «Up» → telefonga «Up · Maydon · /health».
- Natija qatori: «Taxminingiz: … · haqiqatda: faqat `/health` monitori» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Sayt monitori sahifani, `/health` monitori Backend'ni so'raydi. Javob bo'lmasa — ogohlantirish keladi. (100)
- Qator (`QIzoh`, xulosadan keyin; tayanch 6 — bepul rejadagi narxi halol aytiladi): Narxi: so'rovlar bepul Backend'ni uyg'oq tutishi mumkin — Render'ning 750 soatlik umumiy limitidan sarflanadi. (103)
- Tugadi (199): tugmalar yopiladi, UptimeRobot kartasi (Down → Up) va telefoningizdagi ikki ogohlantirish fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Tunni boshlang → Backend'ni tiklang → Davom etish
- O'qituvchi eslatmasi: «Up» / «Down» — UptimeRobot interfeysi so'zi, tarjima qilinmaydi. Maketdagi ogohlantirish matni soddalashtirilgan; haqiqiy email va ilova matni boshqacha ko'rinishi mumkin.
  Monitoring navbatdagi so'rovda biladi, xato bo'lsa qayta so'rashi ham mumkin — o'yinchi undan oldin ochsa, u oldinroq ko'radi. «Birinchi bo'lib siz bilasiz»ni kafolat qilib aytmang.
  Narx haqida: tunda uxlamagan Backend — monitoringning maqsadi emas, bepul rejadagi narxi; Render workspace'idagi boshqa bepul xizmatlar ham shu 750 soatdan sarflaydi.

## 9 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol ustida kichik UptimeRobot kartasi: **Maydon · sayt** — Up · **Maydon · /health** — Down (8-ekrandan boshqa — vaqt va soat yo'q, faqat holat; §106).
- Savol: **Sayt monitori «Up», `/health` «Down». O'yinchi nimani ko'radi?** (8 so'z)
  - Sahifa umuman ochilmaydi, ekran bo'sh (37)
  - Hamma narsa odatdagidek ishlab turibdi (38)
  - ✔ Sahifa ochiladi, vaqtlar yuklanmaydi (36)
  - Faqat egasining sahifasi ochilmay qoladi (40)
- Kalit: **C** (index 2). To'g'ri variant eng uzun emas; «Sahifa» ikki variantda, «ochil-» uch variantda.
- To'g'ri izohi: Sahifa Netlify'dan keladi, vaqtlar esa Backend'dan. (50)
- Xato izohlari (≤60):
  - A: Sayt monitori «Up» — sahifa Netlify'dan kelyapti. (49)
  - B: `/health` «Down» — Backend javob bermayapti. (44)
  - D: O'yinchi sahifasi ham vaqtlarni o'sha Backend'dan oladi. (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 10 · O'z domeni — Mentor misoli  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Mentor misoli · o'z domeni
- Sarlavha: **Sotib olingan domen saytga qanday ulanadi?** (42)
- Mentor: Bugun bepul manzil yetadi, o'z domeni esa pullik — shuning uchun uni Mentor misolida ko'ramiz. Qadamlarni bajaring va brauzerdagi belgiga qarang.
- Bashorat (ballsiz): **Domen Netlify'ga qo'shilgach, sayt HTTPS bilan shu zahoti ochiladimi?** · Ha, shu zahoti ochiladi · Yo'q, avval DNS, keyin sertifikat
- Chapda qadamlar (o'tgani ✓): 1 Domenni Netlify'ga qo'shing · 2 DNS yozuvini qo'shing · 3 Sertifikatni tekshiring
- O'ng — xarita: brauzer (manzil `www.maydon-mahalla.uz`) → **DNS** tuguni (1-Moduldagi belgi) → Sayt · Netlify (`maydon-mahalla.netlify.app`);
  chetda «Domen sotuvchisi paneli» kartasi — DNS yozuvlari ro'yxati, bo'sh. Kartada kulrang yorliq: «Mentor misoli · maket · vaqt tezlashtirilgan».
- **Harakat → Vizual o'zgarish:**
  1. «Domenni qo'shing» → Netlify kartasida «Domain management» ro'yxatiga `www.maydon-mahalla.uz` tushadi, holati «Pending DNS verification» (kulrang soat);
     brauzerda domen ochilmaydi — DNS uni hali hech qayerga olib bormaydi.
  2. «DNS yozuvini qo'shing» → sotuvchi panelida yozuv: `www` → `maydon-mahalla.netlify.app` (kichik yorliq: «yozuv turi: CNAME») → DNS tuguni yonadi, chiziq Netlify'ga ulanadi; Netlify'da holat yashil.
     Joriy qator: Domen qaysi saytga olib borishini aytadigan yozuv — DNS yozuvi. DNS manzilni shu yozuvdan topadi. (97)
  3. «Sertifikatni tekshiring» → Netlify kartasida «HTTPS · Let's Encrypt ✓» → brauzer `https://www.maydon-mahalla.uz` ni belgisi bilan ochadi; ostida `maydon-mahalla.netlify.app` ham ochilaveradi.
- Natija qatori: «Taxminingiz: … · haqiqatda: avval DNS domenni Netlify'ga olib boradi, keyin sertifikat tayyorlanadi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: DNS domenni Netlify'ga olib borgach, Netlify sertifikatni o'zi oladi. Bunga vaqt ketishi mumkin. (97)
- Tugadi (199): qadamlar yopiladi, xarita (DNS chizig'i va yashil HTTPS) butun enga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
- O'qituvchi eslatmasi: `maydon-mahalla.uz` — misol nomi, sotib olinmagan; ekran — maket, vaqt tezlashtirilgan. Netlify: DNS o'zgarishi bir necha soatda, ba'zan bir kunda tarqaladi;
  sertifikat DNS to'g'ri bo'lmaguncha berilmaydi. Narx va domen sotuvchisi nomi aytilmaydi. `www` dan boshqa (yalang'och) domen uchun yozuv turi boshqacha —
  so'rashsa, Netlify ko'rsatgan yozuvni ko'chirish kerakligini ayting.

## 11 · Yakuniy · ogohlantirish yo'li (jonli ball)  ← QTartib (sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Backend to'xtasa, ogohlantirish sizga qanday yetadi?** (52)
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- Beshta uya — faqat raqam 1–5 va izoh «bu yerga qo'ying» (tartibni ochmaydi).
- Bo'laklar (bu yerda to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — `FINAL_BOLAKLAR`):
  1. Backend javob bermay qoladi
  2. UptimeRobot `/health` ni so'raydi
  3. Javob kelmaydi
  4. `/health` monitori «Down» bo'ladi
  5. Email va ilovaga ogohlantirish keladi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring. (39)
- Yechilgach xulosa (bir marta): Ogohlantirish shu tartibda yetadi: Backend to'xtaydi, `/health` javob bermaydi, UptimeRobot sizga xabar beradi. (113)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## A1 · Amaliyot 1 — sayt nomi, `WEB_ORIGIN` va HTTPS  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈12 daq; `screens[12]`; qadamlarda prompt yo'q — skeletda `prompt?` ixtiyoriy)
- Eyebrow: Amaliyot 1 · sayt nomi
- Sarlavha: **«Maydon»ga eslab qoladigan manzil bering.** (41)
- Mentor: Bu blokda kod yo'q — sozlamani o'zingiz o'zgartirasiz, natijani telefonda tekshirasiz. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — app.netlify.com'da `maydon` loyihangizni oching. Telefonda hozirgi `….netlify.app` manzilini oching — kataklar chiqsin.
     Loyiha Netlify'da yo'q bo'lsa — `README.md` dagi «Internetga chiqarish» bo'limi bo'yicha avval chiqaring.
  2. **Sayt nomi** — Netlify'da loyiha nomini o'zgartirish joyini oching (hozir: «Project overview» → «Customize» → «Manage project name and cover image»). Yangi nom: `maydon-` va o'zingiz tanlagan so'z (kichik lotin harf, raqam, chiziqcha).
     Saqlang — manzil `https://{yangi nom}.netlify.app` bo'ladi. Nom band bo'lsa, Netlify uni qabul qilmaydi — oxiriga raqam qo'shing.
  3. **`WEB_ORIGIN`** — telefonda yangi manzilni oching: «Vaqtlarni yuklab bo'lmadi» — kutilgan holat. render.com'da Backend'ingiz → o'zgaruvchilar bo'limi («Environment») → `WEB_ORIGIN` qiymatini yangi manzilga almashtiring
     (`https://` bilan) → saqlash ro'yxatidan qayta deploy qiladiganini tanlang (hozir: «Save and deploy»). Deploy tugagach sahifani yangilang — kataklar chiqadi. Chiqmasa — `WEB_ORIGIN` dagi nom Netlify'dagi bilan harfma-harf bir xilmi, qarang.
  4. **HTTPS tekshiruvi** — yangi manzil `https://` bilan ochilsin. Manzil qatori chetidagi belgini bosing: brauzer ulanish xavfsiz ekanini ko'rsatsin, ogohlantirish bo'lmasin
     (Chrome'da masalan «Connection is secure»; boshqa brauzer va tilda yozuv boshqacha).
  5. **O'z g'oyangiz** — o'z MVP ingiz Netlify'da bo'lsa, uyda unga ham nom bering va Backend'ingizning ruxsat ro'yxatini (CORS) yangi manzilga moslang. Internetda bo'lmasa — «Bajardim»ni bosing.
- O'ng tomon — «kutilgan natija · namuna: Maydon»: telefon maketi `https://maydon-mahalla.netlify.app` (Bugun, olti katak); ostida Render qatori `WEB_ORIGIN` · `https://maydon-mahalla.netlify.app`;
  Chrome panelining kichik maketi «Connection is secure» (namuna yozuv).
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓, keyingisi ochiladi; 5/5 da qadam paneli yopiladi, kutilgan natija fokusga (199).
- Hammasi bajarilgach (yashil): Yangi manzil ishlayapti: kataklar chiqadi, ulanish HTTPS bilan. (63)
- Qator (`QIzoh`, natija ostida): Eski havolani kimgadir yuborgan bo'lsangiz, yangisini qayta yuboring. (69)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-07-start` (bu blok repo'ni o'zgartirmaydi — Netlify va Render sozlamalari o'zingizda)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: Umami'dagi sayt Domain'ini yangi manzilga almashtirish — ixtiyoriy (README «Internetga chiqarish»). Render qayta deploy qilayotganda 4-qadamni bajartiring.
  4-darsdagi B variantini sinfdoshlar va uydagi odamlar eski havola bilan ochayotgan bo'lishi mumkin — QIzoh shu uchun (TAYANCHGA SAVOL 9).

## A2 · Amaliyot 2 — `GET /health`  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈15 daq; `screens[13]`)
- Eyebrow: Amaliyot 2 · Backend holati
- Sarlavha: **Backend o'z holatini `/health` da aytsin.** (39)
- Mentor: Kodni Antigravity yozadi — `ok` va to'xtagan Backend'ni esa brauzerda o'zingiz tekshirasiz. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti».
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/src/app.controller.ts` — yangi yo'l `GET /health`.
     > Nima qilsin: `{ holat: 'ok' }` qaytarsin. Database'ga so'rov yubormasin — bu yo'lni UptimeRobot har 5 daqiqada so'raydi.
     > Nima buzilmasin: `GET /` va boshqa yo'llar o'zgarmasin; javobda `DATABASE_URL` ham, maxfiy kalitlar ham bo'lmasin. O'zgargan fayllarni ayt.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. **Ishga tushirish** — Backend o'zi qayta ishga tushadi. Brauzerda `localhost:3000/health` — `{"holat":"ok"}`.
     Keyin Backend terminalida Ctrl+C bosing va sahifani yangilang: Backend to'xtagan — sahifa ochilmaydi. UptimeRobot buni «Down» deb ko'radi. `npm run start:dev` — yana `ok`.
  4. **Internetda tekshirish** — `git status`: o'zgargan fayl — `backend/src/app.controller.ts`, agent aytgan ro'yxat bilan bir xil. `git add backend/src/app.controller.ts`, `git commit -m "health"`, `git push` — Render o'zi yangilanadi. Deploy tugagach brauzerda `https://{Render manzilingiz}/health` — `{"holat":"ok"}`.
     Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha.
  5. **O'z g'oyangiz** — qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     > Qayerda: `{loyiha papkasi}/backend` — yangi yo'l `GET /health`.
     > Nima qilsin: `{ holat: 'ok' }` qaytarsin; Database'ga so'rov yubormasin (bepul limit).
     > Nima buzilmasin: boshqa yo'llar o'zgarmasin; javobda maxfiy kalitlar bo'lmasin. O'zgargan fayllarni ayt.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (uch brauzer qatori, xaritadagi Backend tugunining kattasi):
  - `localhost:3000/health` → `{"holat":"ok"}`
  - Backend to'xtatilgan: `localhost:3000/health` → «Saytga ulanib bo'lmadi» (brauzer xabari)
  - `maydon-….onrender.com/health` → `{"holat":"ok"}`
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 5/5 da panel yopiladi, uch qator navbat bilan yonadi (199).
- Hammasi bajarilgach (yashil): `/health` ishlayapti: Backend javob bersa — `ok`, to'xtasa — javob yo'q. (67)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-07-done` (`.env` fayllaringiz o'zgarmaydi)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: Ctrl+C — terminalda ishlab turgan Backend'ni to'xtatadi; tekshiruvdan keyin qayta yoqishni eslating. Push'dan keyin Render deploy'i bir necha daqiqa oladi — shu paytda A3 ning 1-qadamini boshlatish mumkin.

## A3 · Amaliyot 3 — UptimeRobot: ikki monitor va ogohlantirish  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈15 daq; `screens[14]`; qadamlarda prompt yo'q)
- Eyebrow: Amaliyot 3 · monitoring
- Sarlavha: **«Maydon» yiqilsa, ogohlantirish sizga kelsin.** (45)
- Mentor: UptimeRobot'ning bepul rejasi «Maydon»ga yetadi. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — uptimerobot.com'da bepul ro'yxatdan o'ting: ogohlantirish shu emailga keladi. Telefoningizga UptimeRobot ilovasini o'rnating (Android yoki iOS) va o'sha akkaunt bilan kiring —
     ilova ham ogohlantirish oladigan bo'ladi.
  2. **Sayt monitori** — yangi monitor qo'shing («+ Add New Monitor») → turi «HTTP(s)» → URL: `https://{yangi nom}.netlify.app` → interval — 5 daqiqa → ogohlantirish: email va telefoningiz belgilangan bo'lsin → «Create monitor».
  3. **`/health` monitori** — xuddi shunday, URL: `https://{Render manzilingiz}/health`. Ikkala qator «Up» bo'lsin. «Down» bo'lsa — URL ni brauzerda ochib, `ok` qaytayotganini qarang.
  4. **Ogohlantirishni tekshirish** — vaqtinchalik uchinchi monitor qo'shing: URL — Render manzilingiz va oxirida `/yoq` (bunday yo'l yo'q, Backend 404 qaytaradi).
     U «Down» bo'lib, email va ilovaga ogohlantirish kelguncha kuting. Keyin shu monitorni o'chiring.
  5. **O'z g'oyangiz** — o'z MVP ingiz internetda bo'lsa, uyda unga ham ikki monitor qo'shing: sayt va Backend'ning `/health` yo'li. Bepul rejada 50 tagacha monitor bor.
- O'ng tomon — «kutilgan natija · namuna: Maydon»: UptimeRobot maketi — **Maydon · sayt** Up · **Maydon · /health** Up · **tekshiruv · /yoq** Down (kulrang yorliq «o'chiriladi»);
  telefon maketi — ilova va email ogohlantirishi «Down · tekshiruv · /yoq».
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 5/5 da panel yopiladi, UptimeRobot maketi va telefon fokusga, ogohlantirish kartasi bir lahza ajralib kiradi (199).
- Hammasi bajarilgach (yashil): Ikki monitor ishlayapti: «Maydon» yiqilsa, email va ilovaga ogohlantirish keladi. (81)
- Qator (`QIzoh`, natija ostida; tayanch 6): Telegram orqali ogohlantirish bepul rejada yo'q — email va telefon ilovasi yetadi. (82)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-07-done` (UptimeRobot sozlamasi repo'da emas — monitorlarni o'zingiz qo'shasiz)
- Nishon (bonus): Night Watch — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: Sinf bir vaqtda ro'yxatdan o'tadi — tasdiqlash xati kechikishi mumkin. `/yoq` monitori «Down» bo'lguncha bir necha daqiqa o'tishi mumkin — kutayotganlar 5-qadamni yozsin.
  Tekshiruv monitori o'chirilmasa, u «Down» bo'lib turaveradi — dars oxirida birga qarab chiqing.

## 15 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + yakuniy tartib + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — Yangi nom va `WEB_ORIGIN`» · 5 — «2 — HTTPS nimani bildiradi» · 7 — «3 — `/health` 200» · 9 — «4 — Ikki monitor» · 11 — «Yakuniy — ogohlantirish yo'li»

## 16 · Takrorlash  ← QKartochka (12 karta, tepadan — 174)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- ✎ Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Ikki monitor ishlayapti · {N}/5 to'g'ri
- Sarlavha: **Endi «Maydon» yiqilsa, ogohlantirish sizga keladi.** (47)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, kartochkaga qo'shilmaydi — P-013): Monitoring saytni siz o'rningizga so'rab turadi va javob bo'lmasa sizga xabar beradi; nimani so'rashini esa bepul limitlarga qarab tanlaysiz.
- ✓ Endi siz bilasiz (5):
  - Netlify nomi o'zgarsa, manzil o'zgaradi va Render'dagi `WEB_ORIGIN` yangilanadi.
  - HTTPS bilan ma'lumot yo'lda shifrlangan — tarmoq mazmunini o'qiy olmaydi; `*.netlify.app` da Netlify uni o'zi yoqqan.
  - Bizning `/health` Backend'ni aytadi va Database'ni uyg'otmaydi — monitoring bepul limitni sarflamaydi.
  - UptimeRobot sayt va `/health` ni har 5 daqiqada so'raydi; javob bo'lmasa email va ilovaga ogohlantirish yuboradi.
  - O'z domeni DNS yozuvi bilan ulanadi; DNS tayyor bo'lgach, sertifikatni Netlify o'zi oladi.
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda so'zlar: domen · HTTPS · `/health` · UptimeRobot)
- Bosilgach karta «Uyda nima qilasiz?» (kim uchun — o'z MVP ingiz · nechta — 3 qadam · muddat — keyingi darsgacha):
  1. **Manzil** — MVP ingiz internetda bo'lsa, Netlify'da unga nom bering va Backend ruxsat ro'yxatini yangilang. Internetda bo'lmasa — avval «Maydon» README'sidagi «Internetga chiqarish» yo'li bilan chiqaring.
  2. **`/health`** — Amaliyot 2 dagi «O'z g'oyangiz» promptini yuboring; `ok` ni va to'xtagan Backend'ni brauzerda tekshiring.
  3. **Monitoring** — UptimeRobot'da ikki monitor qo'shing va ogohlantirish kelishini bir marta tekshiring.
  - Keyingi dars — «Loyiha kuni: prodga ko'tarish — 1-qism». Eng yaxshi loyihangizni prodga tayyorlaysiz.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (5) — inglizcha nom va medal (o'yin qatlami)
- **Right Origin** — Nom o'zgargach `WEB_ORIGIN` ni yangilashni bildingiz (3-ekran, 1-savol — birinchi urinishda)
- **Secure Line** — HTTPS nimani himoya qilishini bildingiz (5-ekran, 2-savol)
- **Health Check** — `/health` javobi nimani bildirishini bildingiz (7-ekran, 3-savol)
- **Two Monitors** — Ikki monitor holatini to'g'ri o'qidingiz (9-ekran, 4-savol)
- **Night Watch** — Uch amaliyot blokini oxirigacha bajardingiz (A3, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (S-034: tekin bonus bitta)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/F-1005-9modul`, `feedback/F-1005-10modul`, 05.10: Right Origin, Secure Line, Health Check, Two Monitors, Night Watch — 0).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta, emoji o'rniga koddan bitta qator (S-026)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Nom o'zgarsa — `WEB_ORIGIN`»
   - `maydon-mahalla.netlify.app` · Yangi nom — manzil ham yangi.
   - `WEB_ORIGIN=https://maydon-mahalla.netlify.app` · Render'da — Backend shu saytdan kelgan so'rovga ruxsat beradi.
   - `Vaqtlarni yuklab bo'lmadi` · Eski manzil qolsa — ruxsat ro'yxati (CORS) yangi saytni to'sadi.
   - Sinfga savol: Nega `VITE_API_URL` ni o'zgartirmaymiz?
2. 2-savol (5-ekran) — «HTTPS yo'lni himoya qiladi»
   - `http://` · Ochiq — yo'ldagi tarmoq matnni o'qiy oladi.
   - `https://` · Shifrlangan — yo'ldagi tarmoq mazmunini o'qiy olmaydi.
   - `*.netlify.app` · Sertifikat — Netlify HTTPS ni o'zi yoqqan.
   - Sinfga savol: HTTPS bor saytda zaiflik bo'lishi mumkinmi?
3. 3-savol (7-ekran) — «`/health` Backend'ni aytadi»
   - `{ holat: 'ok' }` · Backend javob berdi — Database so'ralmadi.
   - `≈ 400 soat` · Eng kichik o'lchamda bepul Neon oyiga taxminan shuncha uyg'oq turadi.
   - `har 5 daqiqa` · Database ham so'ralsa, u o'chishga ulgurmaydi.
   - Sinfga savol: Database to'xtasa, buni qayerdan bilamiz?
4. 4-savol (9-ekran) — «Ikki monitor»
   - `maydon-mahalla.netlify.app` · Sayt monitori — sahifa ochiladimi.
   - `/health` · Backend monitori — Backend javob beradimi.
   - `Down` · Ogohlantirish — email va telefon ilovasiga.
   - Sinfga savol: Faqat sayt monitori bo'lsa, kechasi nimani bilmay qolamiz?
5. Yakuniy (11-ekran) — «Ogohlantirish yo'li»
   - `Backend` · Javob bermay qoladi.
   - `/health` · Javob kelmaydi — monitor «Down».
   - `email · ilova` · Ogohlantirish sizga keladi.
   - Sinfga savol: Monitoring bo'lmasa, buni kim birinchi biladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Production (prod) nima? | Haqiqiy foydalanuvchilar ishlatadigan versiya | Bizda — internetdagi «Maydon»; bepul reja uzluksizlikni va'da qilmaydi |
| Netlify sayt nomi nimani belgilaydi? | `….netlify.app` manzilining boshini | Nom o'zgarsa, manzil ham o'zgaradi |
| Sayt nomi o'zgargach Render'da nima yangilanadi? | `WEB_ORIGIN` | Aks holda CORS so'rovni to'sadi, kataklar chiqmaydi |
| HTTPS nimani bildiradi? | Yo'ldagi ma'lumot shifrlangan — tarmoq mazmunini o'qiy olmaydi | Zaiflikni ham, sayt egasini ham tekshirmaydi |
| SSL nima? | HTTPS ni ta'minlaydigan sertifikat | `*.netlify.app` da Netlify uni o'zi yoqqan |
| O'z domeni saytga qanday ulanadi? | DNS yozuvi bilan | Yozuv domenni Netlify manziliga olib boradi |
| O'z domenida sertifikatni kim oladi? | Netlify, o'zi | DNS domenni Netlify'ga olib borgach (Let's Encrypt); vaqt ketishi mumkin |
| `GET /health` nima qaytaradi? | `{ holat: 'ok' }` | Database'ni so'ramaydi |
| `/health` nega Database'ni so'ramaydi? | Monitoring bepul Database limitini sarflamasin | Har 5 daqiqalik so'rov uni uxlatmaydi |
| Monitoring nima? | Saytni to'xtovsiz, kunu-tun kuzatish | Yiqilsa — ogohlantirish keladi |
| «Maydon» uchun nechta monitor qo'shamiz? | Ikkita: sayt va `/health` | Har biri 5 daqiqada so'raladi |
| UptimeRobot bepul rejada ogohlantirish qayerga keladi? | Email va telefon ilovasiga | Telegram bepul rejada yo'q |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Netlify sayt nomi nimani o'zgartiradi? ✔ `.netlify.app` manzilining boshini · Render'dagi Backend manzilini ham · Database'dagi jadvallarning nomini · Saytdagi «Band qilish» tugmasi matnini
2. Sayt nomi o'zgargach kataklar chiqmadi. Sabab nima? Database'dagi bandlar o'chib ketgan · ✔ `WEB_ORIGIN` da eski manzil qolgan · Netlify saytni hali yaratmagan · Brauzer yangi nomni tanimagan
3. Render'dagi `WEB_ORIGIN` nima uchun kerak? Database'ga ulanish manzilini saqlash · Ega parolini tekshirib, token berish · ✔ Sayt so'roviga ruxsat berish uchun · Monitor intervalini belgilab berish
4. Manzil `https://` bilan bo'lsa, yo'ldagi Wi-Fi nimani ko'radi? Ism va telefonni ochiq matnda · Faqat telefon raqamini ko'radi · Hech qanday so'rov o'tmaydi · ✔ O'qib bo'lmaydigan ma'lumotni
5. SSL sertifikati nima qiladi? ✔ Saytda HTTPS ni yoqadi · Saytni tezroq ochadi · Database'ni himoya qiladi · Backend'ni uyg'otib turadi
6. `*.netlify.app` manzilida HTTPS ni kim yoqadi? O'quvchi sertifikat sotib oladi · ✔ Netlify uni o'zi yoqib qo'yadi · Render `WEB_ORIGIN` orqali yoqadi · UptimeRobot monitor orqali yoqadi
7. O'z domenida sertifikat qachon olinadi? Domen sotib olingan zahotiyoq · Sayt nomi o'zgartirilgan zahoti · ✔ DNS yozuvi to'g'ri bo'lgach · Birinchi monitor qo'shilgach
8. Database javob bermasa, `GET /` nima qaytaradi? 503 — xizmat hozir ishlay olmaydi · 404 — bunday yo'l Backend'da yo'q · 401 — avval parol bilan kiring · ✔ 200 — «Maydon Backend ishlayapti»
9. `/health` nega Database'ni so'ramaydi? ✔ Bepul Database limiti tugamasin · Database'ni Backend ko'rmaydi · Database javobi juda sekin · UptimeRobot SQL'ni bilmaydi
10. Bepul UptimeRobot manzilni necha daqiqada so'raydi? Har bir daqiqada · ✔ Har 5 daqiqada · Har bir soatda · Kuniga bir marta
11. Bepul rejada ogohlantirish qayerga keladi? Telegram botiga va guruhiga · Tekin SMS va qo'ng'iroq bilan · ✔ Email va telefon ilovasiga · Render boshqaruv sahifasiga
12. UptimeRobot so'rovlari bepul Render'ga qanday ta'sir qiladi? Backend sekinlashib qoladi · Render pullik bo'lib qoladi · Database to'lib qoladi · ✔ Backend uxlab qolmaydi

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har harf 3 marta).
Variant uzunliklari (Python `len()`, backtiksiz; to'g'ri variant hech qayerda yolg'iz eng uzun emas — S-006): 1 · 32/33/34/38 · 2 · 35/32/30/29 · 3 · 37/36/34/35 · 4 · 29/30/27/29 · 5 · 22/20/25/26 · 6 · 31/30/31/33 ·
7 · 29/31/27/28 · 8 · 33/33/30/33 · 9 · 25/21/25/24 · 10 · 16/14/14/16 · 11 · 27/29/26/27 · 12 · 26/27/22/22.
Ballik matnda atama izohi (S-020): CORS — 3-savolda «so'rovga ruxsat» bilan ochilgan · SSL — 5-savolda vazifasi bilan · 503 — faqat 8-savol distraktorida, izohi bilan («xizmat hozir ishlay olmaydi»).
Ekran testlari bilan takror yo'q (§144): 1-savol (nimani yangilaysiz) ↔ arena 2, 3 (sabab, vazifasi) · 2-savol (HTTPS nimani bildiradi) ↔ arena 4, 5, 6 (Wi-Fi, SSL, kim yoqadi) ·
3-savol (`/health` 200) ↔ arena 8, 9 (`GET /`, nega Database'siz) · 4-savol (ikki monitorni o'qish) ↔ arena 10, 11, 12 (interval, kanal, yon ta'sir).
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): production · prod · domen · DNS · HTTPS · SSL · `.netlify.app` · `WEB_ORIGIN` · CORS · `/health` · bepul limit · UptimeRobot · Up · Down · monitoring
Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — qurishda kerak bo'ladigan narsalar (qolipda yo'q yoki qo'shimcha)
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14, pilotdan nusxa yo'q); palitra `qolipRang('tex')`, `qolipCss(T)`; `LESSON_META.lessonId` `m8-07-production-deploy-v1`.
   `SCREEN_META` 18: hook · plan · concept · test · concept · test · concept · test · concept · test · concept · test(final, `scope: 'final'`) · practice(A1) · practice(A2) · practice(A3) · stats · flashcards · summary.
   `INLINE_KEYS`: s3 **1 (B)** · s5 **3 (D)** · s7 **0 (A)** · s9 **2 (C)** · s11 sentinel **0**; bloklar (12, 13, 14) — `practice: -1`, blok signali `PRACTICE_BASE + ekran`.
2. **Bitta manba (180):** `PROD_TUGUNLAR` (xarita) · `NOMLAR` `{ eski: 'maydon-x7k2p9', yangi: 'maydon-mahalla', render: 'maydon-….onrender.com', domen: 'maydon-mahalla.uz' }` ·
   `HEALTH_JAVOB` `{ holat: 'ok' }` (6, 7, A2, takrorlash) · `LIMIT_HISOB` `{ neonSoat: 400, kun: 30, soatKuniga: 24 }` (6-ekran kalendari; tayanch 6 dan) · `MONITORLAR` (sayt, `/health`; 8, 9, A3) ·
   `TUN` `{ boshi: '22:00', toxtash: '23:10', bilindi: '07:40' }` (0, 8) · `FINAL_BOLAKLAR` (11-ekran, 5 bo'lak).
3. **`ProdXarita`** komponenti: o'yinchi telefoni (191 ramka; manzil qatori va uning chetidagi belgi — chizilgan, Chrome logotipisiz; kataklar; xato holati), Sayt · Netlify (nom), Backend · Render
   (`WEB_ORIGIN` qatori, `GET /` · `GET /health`, «deploy…» holati), Database · Neon (oq / qizil), Wi-Fi tuguni (4-ekran, ochiq / shifrlangan matn), DNS tuguni + «domen sotuvchisi paneli» (10-ekran),
   UptimeRobot kartasi (monitor qatorlari, 5 daqiqalik katakchalar, Up / Down), «Sizning telefoningiz» (bo'sh joy → ilova va email ogohlantirish kartalari), konvert + yorliq.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: px-nom px-origin px-sorov px-kalit px-dns px-tun`). `prefers-reduced-motion` da to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **0-ekran `QKirish`:** tun chizig'i + soat (`TUN`), 23:10 da to'xtash va variantlarni ochish, javobdan keyin 07:40 gacha davom; uzuq bo'sh joy (U-041).
5. **`QTushuncha` ekranlari** (`zoom`, `tugadi` majburiy — q17/q18): 2 — `QQadamlar` (3) + nom kiritish (tekshiruv `/^[a-z0-9-]+$/`, ≤40 belgi; bo'sh bo'lsa — davom yo'q) + `WEB_ORIGIN` bosish ·
   4 — `QQadamlar` (3) + Wi-Fi tuguni + Chrome paneli maketi · 6 — kalit + ikki tugma (N/4) + javob kartasi + kod kartasi (`fmtCode`; ⚠️ kod `.jsx` ichida shablon-satr bo'lsa — backtiksiz, CLAUDE.md) ·
   8 — «Tunni boshlang» oqimi (5 daqiqalik qadam, 22:00 … 23:20) + «Backend'ni tiklang» · 10 — `QQadamlar` (3) + DNS paneli + Netlify holati.
   Bashorat (`QBashorat`/`QTaxmin`) — 2, 4, 6, 8, 10-ekranlarda, ballsiz, `onAnswer` ga kirmaydi.
6. **Testlar** `QTest` + `QuestionScreen` (DE-203): 3 (**B**) · 5 (**D**) · 7 (**A**) · 9 (**C**, savol ustida kichik monitor kartasi); yakuniy 11 — `QTartib` (5 bo'lak). Variant uzunliklari qurilgandan keyin skript bilan qayta sanaladi.
7. **`ScreenBlok` ×3** (skeletdagi ulagich) + `QPrompt` — har biri 5 qadam (5-qadam «O'z g'oyangiz»). Prompt faqat A2 (2 va 5-qadam); A1 va A3 qadamlarida `prompt` yo'q — `QBlok` promptsiz qadamni to'g'ri chizishi tekshiriladi.
   A2 prompti uch yorliqli qator: «Qayerda · Nima qilsin · Nima buzilmasin». `ortda`: A1 `m10-dars-07-start`, A2 va A3 `m10-dars-07-done` (skelet qoidasi: birinchi blok — boshlanish, keyingilari — tayyor).
8. `RECAPS` 5 (kalit = 3, 5, 7, 9, 11) · `Q_LABELS` {3, 5, 7, 9, 11} · `ACHIEVEMENTS` 5, `ACH_TRIGGERS`: 3 → Right Origin, 5 → Secure Line, 7 → Health Check, 9 → Two Monitors, A3 oxirgi «Bajardim» → Night Watch.
9. `QUIZ_BANK` 12 (✔ A·B·C·D ×3) + `QZ_BG_SHAPES` fon so'zlari `{uz, ru}`, emojisiz · `FLASHCARDS` 12 ({front, back, note}) · `HW_TOKENS`.
10. App.jsx `m8-07` qatoriga `comp: ProductionDeployLesson` — asosiy seans, «qur» bosqichida (nom va `sub` o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari.
11. **Darvozalar:** `npm run gates -- src/8-Modull/ProductionDeployLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:layout` 1280/390 · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`m10-dars-07-start` = `m10-dars-06-done` → `m10-dars-07-done`; «qur» bosqichida, 9-Modul repo'si yopilgandan keyin)
1. `backend/src/app.controller.ts` — `GET /health` → `200 { holat: 'ok' }`; **Database'ga so'rov yo'q** (GATE M M-q1 A — bepul Neon limiti; kod izohida sabab bir qatorda). `GET /` o'zgarmaydi. Yangi `.env` qiymati yo'q.
2. `README.md`:
   - «Darslar va teglar» jadvaliga `m10-dars-07-done` qatori («`GET /health` — Backend holati, Database'siz; Monitoring bo'limi»).
   - «Internetga chiqarish»ga qator: «Netlify'da loyiha nomi o'zgarsa (Customize → Manage project name and cover image), manzil ham o'zgaradi — Render'da `WEB_ORIGIN` ni yangilang, aks holda sayt «Vaqtlarni yuklab bo'lmadi» deydi».
   - Yangi bo'lim «Monitoring»: UptimeRobot — ikki HTTP(s) monitor: sayt (`https://{nom}.netlify.app`) va `https://{Render manzili}/health`, 5 daqiqa; ogohlantirish — email va telefon ilovasi (Telegram bepul rejada yo'q);
     tekshirish — vaqtinchalik `/yoq` monitori (404 → Down → ogohlantirish), keyin o'chiriladi; bepul rejadagi narxi — UptimeRobot so'rovlari bepul Render Backend'ini uyg'oq tutishi mumkin (750 soatlik umumiy limitdan).
   - «Monitoring» bo'limiga: «`/health` Database'ni so'ramaydi: UptimeRobot har 5 daqiqada so'raydi, Database ham so'ralsa bepul Neon limiti oy tugamasdan tugashi mumkin. Database xatosi dashboard va sayt xabarida ko'rinadi.»
   - «Xatolar» jadvaliga qator: «`/health` monitori Down — Backend to'xtagan: Render'da Backend holatini ko'ring».
   - «Bepul limitlar» qatori: Render — 750 soat butun workspace'ga (bitta doim uyg'oq xizmat sig'adi, boshqa bepul xizmatlar ham shundan; Render bepul xizmatni production uchun tavsiya qilmaydi); Neon — 100 CU-soat (tayanch 6).
3. Mentor misoli: Netlify nomi `maydon-mahalla` va UptimeRobot monitorlari — mentor akkauntida, «qur» da (TAYANCHGA SAVOL 4). Domen sotib olinmaydi.
4. **Muhrdan oldin haqiqiy tekshiruv (P-028):** Netlify «Customize → Manage project name and cover image» yo'li va nom band bo'lgandagi xabar; Render «Environment» va «Save and deploy»;
   UptimeRobot «+ Add New Monitor», «HTTP(s)», «Create monitor» yozuvlari (yangi interfeysda boshqacha bo'lishi mumkin), ilova akkaunt bilan ulanishi, `/yoq` monitori «Down» bo'lib ogohlantirish kelishi va vaqti;
   Backend to'xtatilganda (Ctrl+C) brauzer ulanish xatosini ko'rsatishi va UptimeRobot monitorining Down bo'lishi; Chrome paneli yozuvlari («Connection is secure», sertifikat qatori) — Windows'da.
5. **Keyingi darslar uchun ochiq qoldi:** so'rovlar chegarasi, xato va kutish holatlari, A/B yakuni — 8-dars (`prod` tarmog'i, tayanch 3-bo'lim).

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim, tasdiq kerak)
1. ✅ **(05.10 GATE M M-q1 A: `/health` Database'siz — hal qilindi)** **(Muhim) Neon bepul rejasi va har 5 daqiqalik `/health`.** Neon Free: 100 CU-soat / loyiha / oy; jimlikdan 5 daqiqa o'tgach compute to'xtaydi (bepul rejada o'chirib bo'lmaydi);
   CU-soat tugasa, compute keyingi oygacha to'xtatiladi; 0,25 CU compute oyiga ≈ 400 soat ishlay oladi (neon.com/pricing, neon.com/docs/introduction/plans — 05.10 o'qildi).
   `/health` har so'rovda `SELECT 1` yuboradi; UptimeRobot uni har 5 daqiqada so'rasa, compute deyarli to'xtamaydi → oyiga ≈ 720–744 soat × 0,25 CU ≈ 180 CU-soat — 100 dan ko'p.
   Ya'ni oy o'rtasida Neon to'xtab, «Maydon» (kataklar ham, `/health` ham) ishlamay qolishi mumkin. MD tayanchdagidek yozildi (5 daqiqa, `/health` Database bilan). Variantlar:
   (a) `/health` monitori intervali uzunroq (30–60 daqiqa; bepul rejada tanlash mumkinligi tekshiriladi) — lekin Render 15 daqiqada uxlaydi, birinchi javob ≈ 1 daqiqa, UptimeRobot sukut timeout'i 30 soniya → yolg'on «Down» xavfi;
   (b) `/health` Database natijasini bir necha daqiqa eslab qoladi — compute kamroq uyg'onadi, lekin `database: 'ok'` eskirgan bo'lishi mumkin; (c) shundayligicha qoldirib, cheklovni darsda halol aytish (fakt tayanch 6 ga qo'shiladi).
   Qaror «qur» dan oldin kerak — 8-dars (prod ro'yxati) ham shunga tayanadi.
2. ✅ **(tayanch 6, 6 va 8-ekranlarda aytiladi)** **Render 750 soat.** Render har workspace'ga oyiga 750 bepul instance-soat beradi; tugasa, hamma bepul web xizmatlar oy oxirigacha to'xtatiladi (render.com/docs/free). Bitta kunu-tun uyg'oq xizmat ≈ 720–744 soat — sig'adi;
   o'quvchida boshqa bepul Render xizmati ham uyg'oq tursa — sig'maydi. Darsda aytilmadi (tayanch 6 da yo'q). Kerak bo'lsa — 8-dars prod ro'yxatiga bir qator.
3. ✅ **(M-q1 A bilan olindi — 503 yo'q)** **503 javob tanasi va kutish vaqti:** `{ holat: 'xato', database: 'xato' }` va 3 soniya — o'zim qo'ydim (tayanchda faqat «Database javob bermasa 503»). 3 soniya UptimeRobot sukut timeout'i (30 soniya) ichida.
4. **Mentor misoli nomlari:** Netlify `maydon-mahalla` (05.10 bo'sh), eski tasodifiy nom namunasi `maydon-x7k2p9`, o'z domeni `maydon-mahalla.uz` (DNS'da yo'q — sotib olinmagan, faqat maket). Boshqa darslar (8, 9, 11) Netlify manzilini yozsa — shu nom.
   Mentor domenni haqiqatan sotib oladimi yoki faqat maketmi — qaror 9 «Mentor misolida» deydi; men maket deb yozdim.
5. **Netlify atamasi:** Netlify hozir «site» emas, «project» deydi («project name»). Darsda tayanchdagi «sayt nomi», interfeys yorliqlari inglizcha (T-033).
6. **«Qulf belgisi»:** tayanch HTTPS ni «qulf belgisi» bilan ta'riflaydi; Chrome 117+ da manzil qatorida qulf o'rnida sozlama belgisi turadi (qulf panel ichida). Darsda «manzil qatori chetidagi belgi» + «Connection is secure»;
   «qulf» faqat konvert maketida (4-ekran). Tayanch ta'rifi shunga moslansinmi?
7. **4c-Modul atamalari:** «Saytingiz hozir ochilyaptimi?» darsida monitoring asbobi «o'lchagich», ogohlantirish «signal» deb atalgan. 10-Modul tayanchi — «monitoring», «ogohlantirish»; 8-ekranda bir marta tenglashtirildi (T-052).
8. **Uch amaliyot bloki** (TEX darsda; 9-Modul 4-dars namunasida ikkita): A1 — sozlama, A2 — kod, A3 — UptimeRobot. A1 va A3 da prompt yo'q (skeletda `prompt?` ixtiyoriy). Ikki blok kerak bo'lsa — A1 qadamlari A2 boshiga qo'shiladi.
9. **A/B test (4–8-dars) va yangi manzil:** 4-darsda B varianti sinfdoshlarga va uyda real odamlarga yuboriladi, natija 8-darsda. 7-darsda Netlify nomi o'zgarsa, havola o'zgaradi
   (eski manzil ishlashda davom etishi Netlify hujjatida aytilmagan — tekshirilmagan). A1 ga «yangi havolani qayta yuboring» qatori qo'shildi. 8-darsdagi A/B sonlariga ta'sir qilishi mumkin.
10. **UptimeRobot holat qoidasi** («2xx/3xx — Up», sukut timeout 30 soniya, 3 marta qayta so'rash — help.uptimerobot.com) tayanch 6 da yo'q. Darsda faqat «503 — Down» (8, 9, 11-ekranlar) va A3 dagi `/yoq` (404 → Down) tekshiruvi shunga tayanadi.
    Tayanch 6 ga qo'shilsinmi.
11. ✅ **(M-q1 A: Ctrl+C bilan Backend'ni to'xtatish tekshiruviga almashdi)** **A2 3-qadam — Wi-Fi o'chirib 503 ni ko'rish.** Database internetda bo'lgani uchun Wi-Fi o'chsa `SELECT 1` javobsiz qoladi → 3 soniya ichida 503. Jonli tekshirilmagan (REPO 4); kabel bilan ulanganlar uchun — kodni o'qish yo'li.
12. ✅ **(07-FILTR 14)** **DNS yozuvining tarqalish vaqti** (Netlify: bir necha soat, bir kungacha) — 10-ekran xulosasida «vaqt ketishi mumkin», maket yorlig'ida «vaqt tezlashtirilgan», O'qituvchi eslatmasida manba bilan.
13. **`m10-dars-07-start`** tayanch jadvalida yozilmagan — `m10-dars-06-done` bilan bir xil deb oldim.
14. **«Ortda qoldingizmi» dan keyin push:** `git checkout -f m10-dars-07-done` — teg ustida turgan holat, `git push` ishlamaydi; A2 4-qadam (push → Render) ortda qolgan o'quvchida mentor bilan qilinadi. Modul bo'yi masala (3-dars ham shunday).
15. **README «Monitoring»** — mentor tegida (REPO 2); o'quvchi prompti README ga tegmaydi (agent ishi kichik bo'lsin).

## Shubhali joylar (ishonchim komil emas)
1. **UptimeRobot tugma nomlari:** «+ Add New Monitor», «HTTP(s)», «Create monitor» — yordam markazidan; yangilangan interfeysda «+ New monitor» kabi bo'lishi mumkin. «qur» da ko'rib, A3 matni moslanadi.
2. **Netlify:** «Project overview → Customize → Manage project name and cover image» — hujjatdan; saqlash tugmasining aniq yozuvi va nom band bo'lgandagi xabar matni tekshirilmagan (A1 da umumiy so'z: «Saqlang», «qabul qilmaydi»).
3. **Chrome paneli:** «Connection is secure» — tekshirilgan (matbuot, Chromium blogi); keyingi «sertifikat qatori» umumiy so'z bilan yozildi (Chrome'da «Certificate is valid» bo'lishi kerak — tekshirilmagan). Telefon brauzerlarida panel boshqacha.
4. **`/yoq` monitori qancha vaqtda «Down» bo'ladi** — darsda «kelguncha kuting» deyildi, vaqt va'da qilinmadi. Bepul rejada takroriy ogohlantirish yo'q (narxlar sahifasi) — bitta ogohlantirish keladi deb tushunaman.
5. **4-ekran:** Wi-Fi faqat shifrlangan matnni ko'radi — mazmun bo'yicha to'g'ri; qaysi saytga ulanayotgani ko'rinishi mumkinligi faqat o'qituvchi eslatmasida (soddalashtirish — T-045 chegarasida).
6. **6-ekran kod kartasi** 3 soniyalik kutishni ko'rsatmaydi (soddalashtirilgan) — o'qituvchi eslatmasi va A2 prompti buni to'ldiradi.
7. **8-ekran simulyatsiyasi:** 23:10 dagi to'xtash 23:15 dagi so'rovda «Down» bo'lishi — UptimeRobot qayta so'rashlari soddalashtirilgan; ogohlantirish matni maketda o'ylab topilgan («Down · Maydon · /health»).
8. **0-ekran hook'i** — menyu osti yozuvi 1-variantga ishora qiladi; payoff «Qiziq fikr!» bilan adolatli, lekin ko'pchilik 1-variantni tanlashi mumkin (bu darsning va'dasiga ko'prik, xato emas).
9. **A1 3-qadam** — sinf bir vaqtda Render'ni qayta deploy qiladi; deploy vaqti va «Live» holati yozuvi va'da qilinmadi.
10. **«Tasodifiy manzil»** (2-ekran sarlavhasi) — 9-Modulda Netlify nomi qanday qolgani o'quvchiga qarab farq qiladi (ba'zilar import paytida nom bergan bo'lishi mumkin); Mentor misolida tasodifiy deb olindi.

---

## Qurilish (06.10.2026, F-1005-182) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- «Prod xaritasi» (`PROD_TUGUNLAR`): o'yinchi telefoni = sayt (chapda, 172×272, «Sayt · Netlify»), Backend · Render, Database · Neon, chizilgan UptimeRobot, sizning telefoningiz; konvert uchishi.
- Arena 5 ta variant (lint:tell / S-006): 1-savol ✔ «Netlify manzilining boshini» · 2C «Netlify DNS ni hali yangilamagan» · 5D «CORS ruxsatini o'zi beradi» · 7C «WEB_ORIGIN yangilangan zahoti» · 9C «Database javobi juda sekin keladi» (uzunliklar 31/29/26/27).
- KOD 5 «N/4» → «N/2» (ekran matni bo'yicha); `LIMIT_HISOB.kechki = 6` (soddalashtirilgan hisob, «faqat Backend» — 180 soat); 11-ekran ostidagi kichik xarita olindi (1280×800 ga sig'masdi).
- Joylashuv SABOQ 21–23: 8-ekranda o'yinchi telefoni chapda to'liq o'lchamda (MD «kichik»), soat o'rtada; 6-ekranda kalit Backend tugunida; 0-ekranda «Sayt · Netlify» — telefon yorlig'i.
- Matn qo'shimchalari: 10-ekranda «Saytga ulanib bo'lmadi» (A2 dagi so'z) · A1 da «Chrome · namuna yozuv» · 4-ekran natija blokida SSL ta'rifi. `lessonTitle.ru` «Production deploy: домен, SSL, мониторинг».
- Qolip savoli: QPrompt `{ holat: 'ok' }` ni to'ldiriladigan `{…}` deb ajratadi (A2) — MEXANIZM-TAKLIF 6 (QPrompt).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-06` «Foydalanuvchi sizga ma'lumotini ishonadimi?» → **`m8-07` «Production deploy: domen, SSL, monitoring»** → `m8-08` «Loyiha kuni: prodga ko'tarish — 1-qism»
  (App.jsx 334–336-qatorlar, 05.10); reja teglari sarlavha so'zlari bilan: `domen` · `SSL` · `/health` · `monitoring`; yakun sarlavhasi `sub` («sayt yiqilsa, ogohlantirish sizga keladi», 07-q0 A) bilan so'zma-so'z bog'langan.
- [x] Bitta misol-ip («Maydon», hook → bloklar); metafora yo'q; keyssiz (tayanch 5); bitta vizual — «Prod xaritasi» `PROD_TUGUNLAR` (0, 1, 2, 4, 6, 8, 10, 11, A1–A3).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (nom → CORS → `WEB_ORIGIN`), 4 (ochiq / shifrlangan konvert, panel), 6 (kalit → oy kalendari, bepul limit), 8 (tun oqimi → Down → ogohlantirish → Up), 10 (DNS → sertifikat) + 0, 11, A1–A3.
- [x] O'lchov (Python `len()`, backtik sanalmaydi; skript scratchpad'da): sarlavhalar, xulosalar, hook javoblari, xato izohlari — qiymatlar matnda `(NN)`; Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi.
- [x] Atamalar oldingi darslar bilan: domen, DNS (1-Modul, so'zma-so'z) · `.netlify.app` boshidagi nom (1-Modul «Netlify va deploy») · production (4c «haqiqiy reys») · monitoring (4c) · CORS — «ruxsat ro'yxati» (9-Modul 9) ·
  Render «Environment», Netlify, Neon, `VITE_API_URL`, `WEB_ORIGIN` (9-Modul 9, repo) · «Shu xato chiqdi: {xato}. Tuzat.» · siz-forma; tugmalar siz-formada, yorliqlar ot-shaklda; prompt agentga buyruq (T-002).
  «server», «baza», «alert», «24/7», «sir» va lint taqiqlagan so'zlar — o'quvchi matnida yo'q; «sinov» ishlatilmadi (`tekshiruv` monitori).
- [x] Testlar: variantlar uzunligi yaqin (3: 35/32/34/34 · 5: 34/33/30/30 · 7: 37/39/39/40 · 9: 37/38/36/40; arena — o'z bo'limida), to'g'ri variant eng uzun emas; kalit so'z/strelka/qavs faqat to'g'rida emas; inkor-savol yo'q ·
  ✔: s3 B · s5 D · s7 A · s9 C · arena A·B·C·D ×3; to'g'ri izoh bitta gap, «To'g'ri!» yo'q.
- [x] Final (11-ekran): uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi; tartib 6 va 8-ekranlarda o'rgatilgan (P-063).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol», «hech qachon», «24/7» — o'quvchi matnida yo'q).
- [x] Ichki kodlar o'quvchi matnida yo'q (modul raqami, F-ID, `m8-07` — faqat MD izohlarida; o'tgan dars nomi bilan atalgan) · real kompaniya raqami yo'q · tashqi xizmat faktlari manba bilan (A-10) · «KOD» (11) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 · T-009/010 · T-011 (shifrlash, HTTPS, SSL, DNS yozuvi, monitoring — harakatdan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 («yiqildi» = Down, «so'raydi») · T-016/017 (metafora yo'q) ·
  T-024 · T-029 · T-039 («o'z domeni» — o'quvchiniki qilinmadi, «Mentor misoli») · T-042 · T-043 («Bu misolda», «Mentor misoli», sarlavhada manbasiz son yo'q) · T-045 (shubhali 5, 6, 7) · T-047 · T-052 (4c atamalari, DNS) · T-064 (8-ekran sarlavhasi hook'ka javob) ·
  P-001/004 · P-008 · P-010 · P-013 · P-014/015 · P-016 (hook — shubhali 8) · P-025 · P-026 (har tashqi qadamda xato yo'li bitta gap) · P-028 (A-10 manbalar, REPO 4) · P-036 · P-046 (2-ekranda o'quvchi yozgan nom) · P-052 · P-055 · P-062 · P-063 · P-064 · P-065 · P-067 ·
  S-001 (savollar 6–9 so'z) · S-002 · S-004 · S-006 · S-008 · S-010 · S-019 · S-020 · S-026.
  ✗ P-059 «4 qadam» — 5 qadam (M-q1) · ✗ P-011 to'liq skelet — QKod yo'q (kod faqat A2 da agent orqali; 9-Modul 4-dars namunasidagidek) · ✗ uch blok (TAYANCHGA SAVOL 8).
- [x] (05.10 GATE M M-q1 A — `/health` Database'siz) TAYANCHGA SAVOL 1 — Neon bepul rejasi bilan 5 daqiqalik `/health` ziddiyati: tayanch qarori kerak, aks holda dars prodda oy o'rtasida Database to'xtashiga olib kelishi mumkin.
- [ ] (ochiq) Tashqi xizmat yozuvlari (UptimeRobot, Netlify saqlash, Chrome sertifikat qatori) — «qur» da jonli ko'rib tasdiqlanadi (REPO 4).
