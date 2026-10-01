# 5-Modul (LMS: 7-Modul) · 4-dars «Stateful logika + PostgreSQL» — YANGI MATN (v2)

Fayl: `src/5-Modull/BotStatefulMemoryLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `04-BotStatefulMemory-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s4:2 · s8:1 · s10:3 · s14:0 · s15` tartib, `s15:0` = birinchi urinishda to'g'ri) · jonli viktorina: `2·3·0·1·3·1·0·2·2·0·1·3` — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (`01-BotIntro-v2.md`) · 1-dars v2 12-ekran ko'prigi · DAVOM 6–7 (4-dars qatorlari) · **30.09: QA suratlari (F-0930-66…74) qo'llandi**; UI qoidalari U1–U3 — 1-dars v2 A-bo'limi. **30.09 (2-raund): ChatGPT matn auditi (F-0930-117…122) filtrlandi** — audit eski matnni (`-sozlar.md`) o'qigan, 37 bandning yarmidan ko'pi 29.09 da tuzatilgan edi; hukmlar `JURNAL.md`. 30.09 javoblari: 11-savol A (`tanlov` ustuni), 17-savol A (tanish turlar + `NOT NULL`), 16-savol (to'g'ri javob izohi — bitta gap; daftar — hech qayerda), 4-savol A (ballsiz tanlov aralash).

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Shu darsga xos qo'shimchalar:

**A1-4. «daftar» va uning atrofidagi metaforalar → haqiqiy atamalar** (F-0929-51). Bitta so'z bitta narsani bildiradi.

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| 📓 daftar (bot eslab qoladigan narsa) | **holat** | 0-ekran, qisqa: «suhbat qaysi bosqichda ekanini saqlaydigan yozuv» · 3-ekran, to'liq: «bot suhbat haqida eslab qoladigan yozuv: suhbat qaysi bosqichda va mijoz nimani tanlagan» (F-0930-118: so'z 0–2-ekranda ta'rifsiz ishlatilardi) |
| daftarsiz · stateless | **holatsiz bot** | — |
| daftarli · stateful | **holatli bot** | 3-ekran: «holatli (stateful) bot» — bir marta, dars nomidagi so'z shu |
| bosqich (holat ma'nosida) · `bosqich` o'zgaruvchisi | **holat** · `holat` | «bosqich» faqat holat ta'rifida qoladi |
| daftar sahifasi (bitta mijozniki) | **sessiya** | 9-ekran: «bitta mijozning holati, boshqalarnikidan alohida; bot uni `chat.id` bo'yicha topadi» |
| bitta umumiy sahifa | **umumiy holat** (hamma uchun bitta o'zgaruvchi) | — |
| cho'ntak · cho'ntakdagi varaqcha | **dastur xotirasi (RAM)** · koddagi obyekt | 5-ekran: React darslaridagi tajriba bilan bog'lanadi («sahifani yangilasangiz, ro'yxat yo'qolardi») — o'xshatish emas, tanish hodisa |
| javon · javondagi doimiy daftar | **PostgreSQL** · baza | — (backend darslarida o'tilgan) |
| restart · o'chir-yoqish | **qayta ishga tushirish** | — |
| deploy | yangi versiya chiqishi | — |
| Case (eyebrow) | Tuzatish | — |
| Holat daftari (Jihozlar paneli uyachasi) | — (panel olinadi, B-1) | — |

O'xshatish (cho'ntak / javon) bu darsda **0 marta** — o'rniga o'quvchining React'dagi tajribasi ishlatiladi (Agent eslatmalari, 4).

**A10. Holat qiymatlari butun darsda bir xil yozuvda:** `PITSA_KUTYAPMAN` · `OLCHAM_KUTYAPMAN` · `QOSHIMCHA_KUTYAPMAN` · `MANZIL_KUTYAPMAN` · `TAYYOR`
(3, 5, 6, 7, 9, 11, 12-ekranlar). Ekranda ham, kodda ham, jadvalda ham — bitta shakl.

**A11. Olam raqamlari bir xil:** mijoz Aziza — `chat.id` va `telegram_id` = `558210300` (6, 9, 11-ekranlar); Bek — `604417829`.
Aziza Pepperoni oladi (0, 2, 3, 7, 9, 11), Bek — Margarita (7, 9). 12-ekran — Azizaning boshqa buyurtmasi.

**A12. Ikki yo'l — bor mijoz va yangi mijoz (F-0930-119).** Xabar oqimi (SELECT → holat tekshiriladi → javob va yangi holat → UPDATE) — jadvalda bor mijoz uchun.
Yangi mijozni SELECT topmaydi — bot avval INSERT bilan qator qo'shadi. «/start = INSERT» emas: INSERT faqat birinchi marta.
Bu ikki yo'l 1, 14, 15, 19-ekranda bir xil aytiladi.

**A13. Bot tabiati emas — shu botda saqlash yo'q (F-0930-117 #2).** «Bot har xabarni alohida ko'radi» — holat saqlanmagan botning xossasi, har qanday botniki emas.
Shuning uchun: «bu bot», «holatsiz bot», «holat saqlanmasa» — «bot tabiatan…» emas (0, 2, 19-ekran, 1-oyna).

---

## Darsning ipi
- **Olam (bitta):** AvtoPizza boti (1- va 3-darsdagi bot). Mijozlar — Aziza va Bek.
- **Hook:** Aziza «Pepperoni» deb yozadi, bot o'zi «Qaysi pitsa?» deb so'ragan bo'lsa ham, «Tushunmadim» deydi.
- **Asosiy model (dars bo'yi bitta):** holat — suhbat qaysi bosqichda va mijoz nimani tanlagan. U `chat.id` bo'yicha ajratiladi (sessiya) va PostgreSQL'da saqlanadi. Har xabar: SELECT → holatni tekshirish → javob va yangi holat → UPDATE; yangi mijozga avval INSERT (A12).
- **Oldingi bilimga ko'prik:** 1-dars 12-ekran («4-qadamda bot qaysi pitsa tanlanganini eslab qolishi kerak — buning uchun holat kerak. Uni 4-darsda qo'shamiz») · 3-darsdagi handler, tugmalar va `ctx` · React darslari (sahifa yangilansa xotiradagi ro'yxat yo'qoladi) · backend darslaridagi PostgreSQL, `CREATE TABLE`, `pool.query`, `$1`.
- **Tajribalar:** holatsiz suhbat (2) · holat qo'shish (3) · koddagi obyekt (5) · qayta ishga tushirish (6) · umumiy holat → aralashuv (7) · har mijozga sessiya (9) · users jadvali (11) · to'liq buyurtma (12) · SQL so'rovlari (13) · xabar oqimi (15) · o'z botingiz uchun jadval loyihasi (16).
- **Keyingi dars (App.jsx m5-05):** «Loyiha kuni: AI bilan bot».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — «Pepperoni» | hook | suhbatni ochadi, bot nega adashganini tanlaydi | — |
| 1 | Reja | qoida | natija-chat + bugungi 4 qadam | — |
| 2 | Holatsiz bot | tajriba | 4 xabar yuboradi, bot 2 marta «Tushunmadim» deydi | — |
| 3 | Botga holat qo'shamiz | markaziy | holat qo'shadi, 3 xabarda holat jonli yangilanadi | — |
| 4 | 1-savol | test | bot nega «Katta» ni tushunmadi | ✅ |
| 5 | Holat koddagi obyektda | tushuncha (kod) | obyekt kodini ko'radi, kamchiligini ochadi | — |
| 6 | Qayta ishga tushirish | markaziy | botni qayta ishga tushiradi — nima qoladi, nima yo'qoladi | — |
| 7 | Ikki mijoz — umumiy holat | muammo | 3 xabarni ochadi, buyurtmalar aralashadi | — |
| 8 | 2-savol | test | server o'chsa qaysi holat qoladi | ✅ |
| 9 | Har mijozga sessiya | tuzatish | Aziza / Bek sessiyasini ochadi, keyin «ikkalasi birdan» | — |
| 10 | 3-savol | test | ikki suhbat aralashmasligi uchun nima kerak | ✅ |
| 11 | users jadvali | tushuncha | `CREATE TABLE` kodi, 4 ustunni bosib o'qiydi | — |
| 12 | AvtoPizza buyurtmasi | hayotiy | 4 qadamli buyurtma, holatni kuzatadi | — |
| 13 | SQL so'rovlari | amaliyot | 3 SQL bo'shlig'ini navbat bilan to'ldiradi (nishon bor) | — |
| 14 | 4-savol | test | yangi mijoz uchun qaysi SQL buyrug'i | ✅ |
| 15 | Oqimni yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · loyihalash | praktika | o'z botingiz uchun users jadvalini qog'ozda loyihalaydi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — «Pepperoni»  `[758]`
- Eyebrow: Kirish
- Sarlavha: **Aziza «Pepperoni» deb yozdi, bot esa tushunmadi. Nega?**
- Mentor: 3-darsda botingizga handler va tugmalar yozdingiz. Endi mijoz bir necha xabar bilan buyurtma beryapti. Tugmani bosing va bot qanday javob berishini kuzating.
- Chat (AvtoPizza bot): bot «Salom! Nima buyurtma qilasiz?» → (tugmadan keyin) mijoz «Pitsa buyurtma qilaman» → bot «Ajoyib! Qaysi pitsa?» → mijoz «Pepperoni» → bot «Nima pepperoni? Tushunmadim.»
- Tugma: ▶ Suhbatni davom ettirish → ✓ Suhbatni ko'rdingiz
- Savol: **Sizningcha, bot nega adashdi?**
  - Bot buzilgan, dasturi ishlamay qoldi
  - Bot har xabarni alohida ko'radi, oldingisini eslamaydi
  - Internet sekin, xabarning bir qismi yo'qoldi
- Javob — 2-variant: **Aynan!** Bu bot oldingi xabarlarni saqlamaydi: «Pepperoni» kelganda o'zi «Qaysi pitsa?» deb so'raganini bilmaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.
- Javob — 1-variant: **Qiziq fikr!** Lekin bot ishlayapti: u «Pepperoni» ga javob berdi. U faqat o'zi «Qaysi pitsa?» deb so'raganini saqlamaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.
- Javob — 3-variant: **Qiziq fikr!** Lekin xabar yetib keldi: bot «Pepperoni» ga javob berdi. U faqat o'zi «Qaysi pitsa?» deb so'raganini saqlamaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, chat (faqat botning salomi) va «▶ Suhbatni davom ettirish» — asosiy tugma uslubida (U1; hozir och `btn-soft` [778] — QA uni tugma deb tanimagan). Savol va variantlar hali yo'q (hozir xira bo'lib turadi — **KOD**). Tanlangan variant neytral to'q ramka bilan belgilanadi — hozirgi qizilga yaqin urg'u rangi to'g'ri tanlovni ham xatodek ko'rsatadi (U1, **KOD**).
Tugma bosilgach: suhbat ochiladi → shundan keyin savol va 3 variant chiqadi → tanlangach javob izohi.
Animatsiya: yo'q (chatning o'z ko'rinishi yetarli).
Olib tashlanadi: Mentor gapidagi «u bir necha soniya oldin nima gaplashganini eslay olmaydi» — savolning javobini oldindan aytib qo'yardi · 😳.

✎ 30.09 QA F-0930-66 (2 rasm): tugma tanilmadi, to'g'ri tanlov qizil ko'rindi → U1; «qaysi daftar?» — 29.09 da «holat» · «Bola Botjonga…» → «Aziza» (olamdagi mijoz, keyingi ekranlarda ham u) · sarlavha chatni so'zma-so'z takrorlamaydi · Mentor javobni emas, kuzatish vazifasini beradi + 3-darsga ko'prik · variantlardagi tire faqat to'g'rida edi → olindi · «Botjon buzuq — kodda xatolik bor» qisman to'g'ri eshitilardi (holat yo'qligi ham «kod kamchiligi») → «dasturi ishlamay qoldi» (bot javob bergani uchun aniq xato) · javob tanlovga qarab ikki xil (**KOD:** hozir hammasiga «Aynan!») · «daftarsiz», «📓 daftar» → «holat»
✎ 30.09 ChatGPT F-0930-117 (#2, #20, #26): «Bot har xabarni alohida hodisa deb ko'radi» — bot tabiati kabi eshitilardi → «Bu bot oldingi xabarlarni saqlamaydi» (A13) · xato tanlovlarga alohida birinchi gap: «buzilgan» → «bot ishlayapti», «internet» → «xabar yetib keldi» (**KOD:** uch xil izoh) · F-0930-118: «holat» shu yerda birinchi chiqadi, ta'rifi esa 3-ekranda edi → qisqa ta'rif shu yerda · «bugun shuni qo'shamiz» olindi (1-ekran aytadi, A5)

## 1 · Reja  `[794]`
- Eyebrow: Reja
- Sarlavha: **Bugun botingiz suhbatni eslab qolishni o'rganadi.**
- Mentor: 1-darsda buyurtma suhbatini ko'rgansiz: manzil kelganda bot qaysi pitsa tanlanganini bilishi kerak edi. Buning uchun holat kerak. Bugun botga holat qo'shamiz va uni backend darslaridan tanish PostgreSQL'da saqlaymiz.
- Yorliq: dars oxirida — bot suhbatni eslab qoladi
- Chat (AvtoPizza bot · holat bilan): mijoz «Katta» → bot «Yaxshi, Aziza: katta Pepperoni. Endi manzilingizni yuboring.»
- Bugungi 4 qadam:
  1. Bot nega unutadi — holatsiz bot
  2. Holat: dastur xotirasida va PostgreSQL'da
  3. Ikki mijoz — har biriga alohida sessiya
  4. Xabar oqimi: SELECT → tekshirish → UPDATE, yangi mijozga INSERT
- Tugmalar (telefonda): 4 qadamni ko'rish / ↩ Natijani ko'rish · Orqaga · Boshlaymiz →

**Ko'rinish:** hozirgidek — chap tomonda natija-chat, o'ngda 4 qadam (telefonda navbat bilan).
Animatsiya: yo'q.
Olib tashlanadi: «Botjon ismni va o'tgan buyurtmani esladi — chunki ularni daftarga yozib qo'ygan…» izoh kartasi (yorliq bilan bir ma'no) ·
«Jihozlar paneli — bugun 3-uyacha yonadi» + panel (qaror F-0929-63: butun moduldan olinadi — 1-dars B-1).

✎ 30.09 QA F-0930-67 (2 rasm): «daftar database bo'lyaptimi? AI gapni aylantiryaptimi?» — 29.09 da «daftar / cho'ntak / javon / sahifa» o'rniga holat · sessiya · PostgreSQL (A1-4); «PostgreSQL'ni oldingi modulda o'rgangansiz» → «backend darslaridan tanish» (A9); qadam yorliqlari («muammo · saqlash · sessiya · oqim») olindi (U1) · 🔴 FAKT: «Jihozlar paneli — bugun 3-uyacha yonadi» — kodda 5 uyacha yonadi (`active: key, sheet, btn, env, note`); panel baribir olinadi · 🔴 FAKT: natija-chatdagi «O'tgan safargi Margaritani yana olasizmi?» — buyurtmalar tarixi darsda saqlanmaydi (jadvalda bunday ustun yo'q) → darsda quriladigan narsa: ism (`ism`), tanlov (`tanlov`) va holat · «Bu — modulning eng "texnik" darsi» — tekshirib bo'lmaydigan da'vo, olindi · «PostgreSQL'ni oldingi modulda o'rgangansiz» → «backend darslaridan tanish» (modul raqamisiz) · 1-dars v2 ko'prigi Mentorda · «Botjonga xotira beramiz» → yangi sarlavha · 😊 olindi
✎ 30.09 ChatGPT #28: 4-qadamda INSERT yo'q edi, 13–14-ekranda esa u katta o'rin oladi → «yangi mijozga INSERT» (A12)

## 2 · Holatsiz bot  `[842]`
- Eyebrow: Tajriba · holatsiz bot
- Sarlavha: **Holatsiz bot har xabarni birinchi marta ko'rgandek qabul qiladi.**
- Mentor: Aziza pitsa buyurtma qilmoqchi. Botda hali holat yo'q. Tugmani bosib suhbatni davom ettiring va o'ngda bot nimani bilishini kuzating.
- Chat (AvtoPizza bot · holatsiz), har bosishda bitta juftlik:
  1. Pitsa buyurtma qilaman → Ajoyib! Qaysi pitsa?
  2. Pepperoni → Nima pepperoni? Tushunmadim.
  3. Pepperoni pitsa haqida gapiryapman → Qaysi o'lchamda? Kichikmi, kattami?
  4. Katta → Nima katta? Tushunmadim.
- Tugma: ▶ Yozishni boshlash → Keyingi xabar → → ✓ Aziza buyurtmasiz ketdi
- Bot nimani biladi: Hali hech narsa — birinchi xabarni kutyapti. → (keyin) Faqat hozirgi xabarni. Oldingilarini eslamaydi.
- Oxirida: Aziza ikki marta «Tushunmadim» javobini oldi. Bot «Pepperoni» va «Katta» ni oldi, lekin ular qaysi savolga javob ekanini bilmadi: o'zi nima so'raganini eslamaydi. Unga holat kerak.
- Tugma (pastda): Suhbatni davom ettiring (N/4) → Davom etish

**Ko'rinish:** «▶ Yozishni boshlash» — boshqa ekranlardagi harakat tugmasi bilan bir uslubda (U1). Hozirgidek — chat juftliklari bittadan; «Bot nimani biladi» qutisi har bosishda yangilanadi; natija-ramka 4/4 dan keyin.
Animatsiya: yo'q (xabar → holat chizig'i 3-ekranda; bu yerda bog'lanadigan holat yo'q).
Olib tashlanadi: 😳 😕 📍 · natija-ramkadagi «📓 daftar kerak».

✎ 30.09 QA F-0930-68 (rasm): «bu tugma endi boshqacha — yo primary, yo secondary bo'lsin» → U1 (bir vazifa — bir uslub) · «Bola» → «Aziza» · «Bola charchab qoldi» → «Aziza buyurtmasiz ketdi» (1-darsdagi «javobsiz qoldi — ketib qoldi» bilan bir mantiq) · xulosa: nega holat kerakligi — qisqa javob faqat savol bilan birga ma'noli (shunchaki «Pepperoni» uchun yangi handler yozish muammoni yechmaydi — ChatGPT bu savolni berishi mumkin, javob shu gapda)
✎ 30.09 ChatGPT #4: «so'zlar o'zi hech narsa demaydi» noto'g'ri urg'u — «Pepperoni» o'zi ma'noli; muammo — bot xabar qaysi savolga javob ekanini bilmaydi → xulosa shu bilan. Uning «holat xabar mazmunini emas, suhbat qayerdaligini saqlaydi» formulasi — Rad: bu darsda holat tanlovni ham saqlaydi (`tanlov` ustuni, 11-savol A)

## 3 · Botga holat qo'shamiz (markaziy)  `[876]`
- Eyebrow: Markaziy · holat
- Sarlavha: **Botga holat qo'shamiz — endi u suhbatni eslab qoladi.**
- Mentor: Holat — bot suhbat haqida eslab qoladigan yozuv: suhbat qaysi bosqichda va mijoz nimani tanlagan. Holat qo'shing, keyin xabarlarni birma-bir oching va o'ngda holat qanday o'zgarishini kuzating.
- Boshida: Botda hali holat yo'q. · Tugma: Holat qo'shish
- Chat (AvtoPizza bot · holat bilan):
  1. Pitsa buyurtma qilaman → Ajoyib! Qaysi pitsa?
  2. Pepperoni → Pepperoni — yaxshi tanlov! Qaysi o'lchamda?
  3. Katta → Rahmat! Buyurtmangiz: katta Pepperoni. Manzilni yuboring.
- Tugma: ▶ Yozishni boshlash → Keyingi xabar → → ✓ Buyurtma qabul qilindi
- Suhbat holati (mijoz · holat · tanlov):
  - qo'shishdan oldin: — · — · —
  - qo'shilgach: Aziza · — · —
  - 1-xabar: Aziza · `PITSA_KUTYAPMAN` · —
  - 2-xabar: Aziza · `OLCHAM_KUTYAPMAN` · Pepperoni
  - 3-xabar: Aziza · `MANZIL_KUTYAPMAN` · Pepperoni, katta
- Oxirida: Har xabardan keyin holat yangilandi. Shuning uchun «Katta» endi ma'noli: bot holatdan o'zi o'lcham so'raganini biladi. Holatni eslab qoladigan bot holatli (stateful) bot deb ataladi.
- Tugma (pastda): Holat qo'shing → Suhbatni kuzating (N/3) → Davom etish

**Ko'rinish:** kirganda — «Botda hali holat yo'q» + «Holat qo'shish»; bosilgach chat va «▶ Yozishni boshlash» chiqadi; o'ngda holat paneli; natija-ramka 3/3 dan keyin.
Animatsiya: HA — har xabardan keyin chatdagi mijoz xabaridan o'ngdagi holat paneliga strelka chiziladi va o'zgargan qator yonadi (~0.8 s): xabar → holat bog'lanishini ko'rsatadi (**KOD**).
Olib tashlanadi: 📓 📍 · Mentor gapidagi «jonli yangilanadi» (natija-ramka shuni aytadi).

✎ 🔴 FAKT: «Bola Botjonga daftar biriktiradi» — holatni mijoz emas, botni yozgan dasturchi qo'shadi → «Holat qo'shing» (o'quvchining o'zi) · «Daftar sahifasi (mijoz · bosqich · tanlov)» → «Suhbat holati (mijoz · holat · tanlov)» — `bosqich` va `holat` bir narsa edi, endi bitta nom (A1-4) · holat qiymatlari «Pitsa tanlash / O'lcham tanlash…» → A10 dagi yozuv (11-ekrandagi jadval bilan bir xil) · «stateful» atamasi shu yerda bir marta izohlanadi (oldin faqat 18-ekran kartochkasida) · «zo'r» → «yaxshi tanlov»

## 4 · 1-savol ✅  `[917]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Bot o'zi o'lcham so'radi, lekin «Katta» javobini tushunmadi. Nega?**
  - Internet sekin bo'lib, xabar Bot API'ga yetmadi
  - Mijoz juda tez yozdi, handler ulgurmay qoldi
  - ✔ Bot holatni saqlamaydi, o'z savolini eslamaydi
  - Telegram xabarlarni aralash tartibda yetkazdi
- To'g'ri: Bot holatni saqlamaydi, shuning uchun «Katta» qaysi savolga javob ekanini bilmaydi.
- Xato izohlari:
  - Xabar yetib kelgan: bot unga javob berdi. Muammo — bot o'z savolini eslamaydi.
  - Tezlik sabab emas: handler har xabarni oladi. Muammo — oldingi xabar hech qayerda saqlanmaydi.
  - Telegram bitta chatdagi xabarlarni kelgan tartibida yetkazadi. Muammo boshqa joyda.
  - (umumiy) Holat saqlanmasa, bot har xabarni alohida ko'radi va oldingisini eslamaydi.

✎ 30.09 QA F-0930-69 (rasm): «daftar db edi, testda endi state/holat» — 29.09 da butun darsda bitta nom: holat, holatsiz bot (A1-4) · Savol aniq vaziyatga bog'landi («tez-tez unutib qoladi» — noaniq) · tire va dars metaforasi («daftarsiz») faqat to'g'rida edi → har variantda bittadan atama (Bot API · handler · holat · Telegram), uzunliklar tenglashtirildi · «doimo beqaror», «tasodifiy» kabi qat'iy so'zlar olindi · «(stateless)» izohdan olindi (A1-4)

## 5 · Holat koddagi obyektda  `[933]`
- Eyebrow: Kod · dastur xotirasi
- Sarlavha: **Holatni saqlashning eng sodda yo'li — koddagi obyekt.**
- Mentor: Holatni oddiy JavaScript obyektida saqlash mumkin. Mijoz bot bilan shaxsiy chatda yozadi, shuning uchun uning holati chat raqami — `ctx.chat.id` bo'yicha yoziladi. Bu ishlaydi, lekin bitta jiddiy kamchiligi bor. Tugmani bosing.
- Kod:
  ```js
  // Har chatning holati — oddiy obyektda
  const holatlar = {}   // { chat.id: holat }

  // Mijoz pitsani tanladi:
  holatlar[ctx.chat.id] = "OLCHAM_KUTYAPMAN"

  // Keyingi xabar kelganda:
  const holat = holatlar[ctx.chat.id]
  ```
- Tugma: Kamchiligi nimada? → ✓ Ko'rdingiz
- Kamchilik: Bu obyekt dastur xotirasida (RAM) turadi. Bot qayta ishga tushsa, xotira tozalanadi va barcha holatlar yo'qoladi: suhbat o'rtasidagi mijozlar boshidan boshlashga majbur bo'ladi. React darslarida ham shunday edi: sahifani yangilasangiz, xotiradagi ro'yxat yo'qolardi. Yechim — holatni PostgreSQL'ga yozish.
- Tugma (pastda): Kamchiligini ko'ring → Davom etish

**Ko'rinish:** hozirgidek — kod + tugma; bosilgach o'ngda bitta ogohlantirish-ramka.
Animatsiya: yo'q.
Olib tashlanadi: «📍 YECHIM: Cho'ntak emas — javondagi doimiy daftar kerak…» kartasi (ekranda ikkinchi natija-ramka edi; yechim bir gap bo'lib ogohlantirish oxiriga qo'shildi — **KOD**) · ❌ 🤔.

✎ «Daftarning eng sodda shakli — cho'ntakdagi varaqcha» → «koddagi obyekt» (A1-4; oldin RAM ham «daftar» deb atalardi — bir so'z uch narsa edi) · kodda `chontak` → `holatlar`, `bosqich` → `holat` · `ctx.chat.id` bir gap bilan izohlandi (3-darsda `ctx.from` va `ctx.message.text` ko'rilgan, `ctx.chat` — yangi; B-3) · «yuzlab mijoz suhbat o'rtasida qolib ketadi» → «suhbat o'rtasidagi mijozlar» (A3) · React darsiga ko'prik (`ReactCrudPracticeLesson`: «sahifani yangilasangiz yo'qoladi — faqat xotirada»)
✎ 30.09 ChatGPT #11: `ctx.chat.id` chat raqami, mijoz raqami emas — ular faqat shaxsiy chatda teng → «shaxsiy chatda» shu yerda (birinchi chiqqan joy) va 11-ekranda · #6 («server o'chsa» → «qayta ishga tushsa»), #7 (deploy) — 29.09 da tuzatilgan

## 6 · Qayta ishga tushirish (markaziy)  `[968]`
- Eyebrow: Markaziy · qayta ishga tushirish
- Sarlavha: **Botni qayta ishga tushiring: nima qoladi, nima yo'qoladi?**
- Mentor: Bot serveri vaqti-vaqti bilan qayta ishga tushadi: yangi versiya chiqqanda yoki nosozlikdan keyin. Tugmani bosing va ikkala qutiga qarang.
- Qutilar:
  - Dastur xotirasi (RAM) — vaqtinchalik: `holatlar = { 558210300: "MANZIL_KUTYAPMAN" }` → qayta ishga tushgach: bo'sh — holatlar yo'qoldi
  - PostgreSQL — doimiy: `users: 558210300 · Aziza · MANZIL_KUTYAPMAN`
- Tugma: Botni qayta ishga tushirish → ✓ Bot qayta ishga tushdi
- Natija: Dastur xotirasi bo'shab qoldi, PostgreSQL'dagi qator esa joyida. Shuning uchun holatni PostgreSQL'ga yozamiz: bot qayta ishga tushgach, Azizaning holatini bazadan o'qiydi va suhbat shu joydan davom etadi.
- Tugma (pastda): Botni qayta ishga tushiring → Davom etish

**Ko'rinish:** hozirgidek — ikki quti + tugma; bosilgach o'ngda bitta natija-ramka.
Animatsiya: HA — tugma bosilganda RAM qutisidagi qator chapdan o'ngga o'chib boradi (~0.8 s), PostgreSQL qutisi qimirlamaydi: nima yo'qolishini ko'rsatadi (**KOD**).
Olib tashlanadi: «Xulosa: cho'ntak — vaqtinchalik, javon — doimiy…» ikkinchi ramkasi (natija bilan bir ma'no — **KOD**) · 👖 🗄️ 💨 🔌 ✅ · «hammasi to'kilib ketdi!».

✎ 30.09 QA F-0930-70 (2 rasm) — 29.09 da tuzatilgan: «o'chir-yoqing», «restart» → «qayta ishga tushirish» · «Serverlar har kuni qayta ishga tushadi (…deploy)» → «vaqti-vaqti bilan… yangi versiya chiqqanda» (A3; «deploy» izohsiz edi) · RAM'dagi raqam `5582` va 11-ekrandagi `558210300` bir xil qilindi (A11) · «bosqichni ham, ma'lumotni ham javonga» → «holatni PostgreSQL'ga»
✎ 30.09 ChatGPT #13 (12-ekran uchun aytilgan, bu yerda ham shu): bazada turgani yetmaydi — bot uni qayta o'qigandagina suhbat davom etadi → «bazadan o'qiydi» (13–15-ekrandagi SELECT'ga ko'prik)

## 7 · Ikki mijoz — umumiy holat  `[1012]`
- Eyebrow: Muammo · ikki mijoz
- Sarlavha: **Aziza va Bek bir vaqtda yozyapti. Holat ikkalasiga bitta bo'lsa-chi?**
- Mentor: Faraz qiling: kodda holat `chat.id` bo'yicha ajratilmagan — hamma mijoz uchun bitta o'zgaruvchi. Tugmani bosing va holat qanday o'zgarishini kuzating.
- Xabarlar:
  1. Aziza: Pepperoni olmoqchiman
  2. Bek: Menga Margarita
  3. Aziza: Katta o'lchamda, iltimos
- Tugma: ▶ Xabarlarni boshlash → Keyingi xabar → → ✓ Hammasi ko'rildi
- Umumiy holat (hamma uchun bitta): mijoz «?» · holat `OLCHAM_KUTYAPMAN` · tanlov: — → Pepperoni (Aziza) → Margarita (Bek) → Margarita, katta (kimniki?)
- Oxirida: Oxirgi qatorda «Margarita, katta» turibdi, lekin «Katta» ni Aziza yozgan edi. Holat bitta bo'lgani uchun Bekning Margaritasi Azizaning Pepperonisi ustiga yozildi. Endi Aziza Bekning pitsasini oladi.
- Tugma (pastda): Xabarlarni ko'ring (N/3) → Davom etish

**Ko'rinish:** hozirgidek — xabarlar bittadan; o'ngda umumiy holat paneli; natija-ramka 3/3 dan keyin.
Animatsiya: HA — har xabardan umumiy holat qutisiga strelka chiziladi; Aziza va Bekning strelkalari bitta qutiga tushadi — aralashuvning sababi ko'rinadi (**KOD**).
Olib tashlanadi: 😳 📓 · Mentor gapidagi «Har xabar keyingi qatorda shu sahifaga yoziladi» (panelning o'zi ko'rsatadi; qolaversa, qiymat keyingi qatorga emas, ustiga yoziladi — noto'g'ri edi).

✎ 30.09 QA F-0930-71 (rasm, 😳 — «qizil rangning o'zi ma'noni beradi») — 29.09 da olingan (A4) · 🔴 FAKT (mantiq): 5-ekrandagi kod holatni allaqachon `chat.id` bo'yicha ajratadi, bu ekran esa «bitta umumiy sahifa» aralashuvini ko'rsatardi — ikkisi bog'lanmagan edi → «`chat.id` bo'yicha ajratilmasa-chi?» tajribasi (5-ekrandagi `[ctx.chat.id]` nega kerakligi shu yerda ko'rinadi) · Mentordagi «har xabar keyingi qatorga yoziladi» panelga zid edi (qiymat ustiga yoziladi) → olindi · pitsalar A11 bo'yicha: Aziza — Pepperoni, Bek — Margarita (11-ekrandagi jadval bilan mos) · «umumiy sahifa» → «umumiy holat»

## 8 · 2-savol ✅  `[1041]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Bot serveri birdan o'chib qoldi. Qaysi holat yo'qolmaydi?**
  - Koddagi oddiy JavaScript obyektiga yozilgan holat
  - ✔ PostgreSQL'dagi users jadvaliga yozilgan holat
  - Handler ichidagi o'zgaruvchiga yozilgan holat
  - Hech qaysi: server o'chsa, hammasi yo'qoladi
- To'g'ri: PostgreSQL ma'lumotni diskka yozadi — server qayta ishga tushsa ham u joyida qoladi.
- Xato izohlari:
  - Bu obyekt dastur xotirasida (RAM) turadi — bot qayta ishga tushsa, bo'shab qoladi.
  - Handler ichidagi o'zgaruvchi ham dastur xotirasida — u keyingi xabargacha ham saqlanmaydi.
  - PostgreSQL'ga yozilgan holat saqlanib qoladi — hammasi yo'qolmaydi.
  - (umumiy) Qayta ishga tushgandan keyin faqat PostgreSQL'ga yozilgan holat qoladi.

✎ 30.09 QA F-0930-72 (rasm): to'g'ri javob oynasida «TO'G'RI» yorlig'i va «To'g'ri!» so'zi takrorlanadi — barcha test ekranlarining umumiy shabloni, 16-savol (qaror sahifasi) · «PostgreSQL — doimiy daftarga…» — tire va metafora faqat to'g'rida edi → olindi · «Faqat brauzer xotirasida turgan ma'lumot» — ishonarsiz variant (bot serverida brauzer yo'q) → «Handler ichidagi o'zgaruvchi» (yangi o'quvchi chindan shunday o'ylashi mumkin, texnik jihatdan aniq xato) · «javon», «cho'ntakdagi varaqcha» → «PostgreSQL», «dastur xotirasi»

## 9 · Har mijozga sessiya (tuzatish)  `[1061]`
- Eyebrow: Tuzatish · sessiya
- Sarlavha: **Har mijozga alohida holat.**
- Mentor: Sessiya — bitta mijozning holati, boshqalarnikidan alohida. Bot uni `chat.id` bo'yicha topadi. Avval har mijozni bosing, keyin ikkalasini birdan sinang.
- Kartalar (bosilganda sessiya ochiladi):
  - Aziza · o'z sessiyasi → `chat.id 558210300` · holat `OLCHAM_KUTYAPMAN` · tanlov Pepperoni
  - Bek · o'z sessiyasi → `chat.id 604417829` · holat `OLCHAM_KUTYAPMAN` · tanlov Margarita
- Tugma: ▶ Ikkalasi birdan yozsin → ✓ Ikkalasi birdan yozdi
- Tugma bosilganda ikki xabar birdan: Aziza «Katta» · Bek «Kichik»
- Natija (bitta ramka): Aziza — Pepperoni, katta · Bek — Margarita, kichik · Ikkala javob bir vaqtda keldi, lekin har biri o'z sessiyasiga tushdi — hech narsa aralashmadi.
- Tugma (pastda): Ikkalasini birdan sinang → Davom etish

**Ko'rinish (KOD — hozir karta bosilganda faqat ✓ chiqadi, ichida hech narsa yo'q; «Ikkalasi birdan» tugmasi boshidan bosiladi; ruscha rejimda kartadagi matn ⛶ belgisi ostida qirqiladi — U2):**
1. Kirganda: Aziza va Bek kartalari.
2. Karta bosilganda — shu mijozning sessiyasi (chat.id · holat · tanlov) ochiladi; karta ✓ bilan belgilanadi.
3. Ikkala karta ko'rilgach — «▶ Ikkalasi birdan yozsin» tugmasi chiqadi.
4. Bosilgach — avval ikki xabar pufakchasi (Aziza «Katta», Bek «Kichik»), strelkalar ularni o'z sessiyasiga olib boradi; keyin bitta natija-ramka (ikki qator + bir gap).

Animatsiya: HA — «Ikkalasi birdan» bosilganda ikki strelka bir vaqtda chiziladi: Aziza → o'z sessiyasi, Bek → o'z sessiyasi (7-ekranda ikkala strelka bitta qutiga borgan edi — farqning o'zi).
Olib tashlanadi: alohida natija-kartalar + «Endi hech narsa aralashmaydi…» ramkasi → bitta ramka (**KOD**) · ✅ · Mentordagi «alohida daftar sahifasi (sessiya) ochadi».

✎ 30.09 QA F-0930-73 (2 rasm): ruscha matn «Маргарита · больш…» ⛶ belgisi ostida qirqilgan → U2 (belgiga joy ajratiladi, **KOD**) · «Case · tuzatish» → «Tuzatish · sessiya» («Case» — lug'atda taqiqlangan) · sarlavha va Mentor bir gapni aytardi («har mijozga o'z sahifasi») → sarlavha — natija, Mentor — sessiya ta'rifi · sessiya `chat.id` bilan bog'landi (texnik aniq: Telegraf'ning session vositasi ham holatni chat va foydalanuvchi raqami bo'yicha ajratadi) · «hech narsa aralashmaydi» qoldi — bu shu tajribaning natijasi, umumiy kafolat emas
✎ 30.09 ChatGPT #9 (🔴 blocker, eski matnda: «Bek · Kichik» qayerdan?): 29.09 da natija-gapda aytilgan edi, lekin xabarning o'zi ko'rinmasdi — endi «Katta» va «Kichik» pufakchalari natijadan oldin chiqadi (**KOD**), gap takrorlamaydi · #10 (sessiya ta'rifi cheklansin) — 29.09 da Mentor ta'rifi shu darsga bog'langan · #29 (karta bosilishi ko'rinsin) — U1

## 10 · 3-savol ✅  `[1102]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Aziza va Bek bir vaqtda buyurtma beryapti. Ularning suhbati aralashmasligi uchun nima kerak?**
  - Ikkala mijozning holatini bitta umumiy o'zgaruvchida saqlash
  - Har mijoz uchun alohida bot ochib, alohida token berish
  - Umumiy holatni obyektda emas, PostgreSQL'da saqlash
  - ✔ Har mijozga alohida sessiya ochib, holatini unda saqlash
- To'g'ri: Har mijozning holati o'z `chat.id` si bo'yicha alohida saqlanadi.
- Xato izohlari:
  - Bitta umumiy o'zgaruvchi aralashuvga olib keladi: oxirgi yozuv oldingisining ustiga yoziladi.
  - Har mijozga alohida bot kerak emas: bitta bot holatni `chat.id` bo'yicha ajratsa yetadi.
  - PostgreSQL holatni saqlab qoladi, lekin u hammaga bitta bo'lsa, baribir aralashadi.
  - (umumiy) Har mijozning holatini alohida sessiyada saqlash kerak.

✎ Tire faqat to'g'rida edi («alohida sessiya — o'z sahifasini saqlash») → olindi · «Faqat birinchi yozgan mijozga navbat bilan javob berish» — qisman to'g'ri eshitilardi (navbat bilan ishlasa, aralashuv bo'lmasligi ham mumkin) → «alohida bot va token» (aniq xato, lekin yangi o'quvchiga ishonarli) · «hech qachon aralashmaydi», «yagona to'g'ri yechimi» → yumshatildi (A3) · «Botjon hech kimni e'tiborsiz qoldirmaydi» → olindi
✎ 30.09 ChatGPT #32 (F-0930-122): «Xabarlarni aralashtirib, tasodifiy tartibda…» — hech kim tanlamaydigan variant → «Umumiy holatni obyektda emas, PostgreSQL'da saqlash»: yangi o'quvchi shunday o'ylashi mumkin (bazani endi o'rgandi), lekin saqlash joyi ajratishni bermaydi — 8 va 10-savol farqini tekshiradi · #19 (✔ shaklidan topiladi) — 29.09 da tenglashtirilgan

## 11 · users jadvali  `[1123]`
- Eyebrow: PostgreSQL · users jadvali
- Sarlavha: **Holat PostgreSQL'da: users jadvali.**
- Mentor: Backend darslarida PostgreSQL'da jadval yaratgansiz. Bot uchun ham shunday jadval kerak: har mijoz — bitta qator, uning sessiyasi shu qatorda saqlanadi. Har ustunni bosib, nima saqlashini o'qing.
- Kod:
  ```sql
  CREATE TABLE users (
    id           SERIAL PRIMARY KEY,
    telegram_id  BIGINT NOT NULL UNIQUE,
    ism          TEXT,
    holat        TEXT NOT NULL,
    tanlov       TEXT
  )
  ```
- Ustun tugmalari (bosilganda izoh):
  - `telegram_id` — Mijozning Telegram raqami; shaxsiy chatda u `ctx.chat.id` ga teng. Bot mijozning qatorini shu raqam bilan topadi.
  - `ism` — Mijozning ismi. Bir marta so'raladi va keyingi safar ham kerak bo'ladi.
  - `holat` — Suhbat hozir qaysi bosqichda, masalan `MANZIL_KUTYAPMAN`. Keyingi xabarni bot shu qiymatga qarab tushunadi.
  - `tanlov` — Mijoz hozirgacha nimani tanlagani, masalan «Pepperoni, katta». Buyurtma oxirida bot shu yerdan o'qiydi.
- Jadval «users»: id · telegram_id · ism · holat · tanlov → 1 · 558210300 · Aziza · MANZIL_KUTYAPMAN · Pepperoni, katta (bo'sh bo'lsa: — jadval bo'sh —)
- Tugma (pastda): 4 ustunni oching (N/4) → Davom etish

**Ko'rinish:** hozirgidek — kod + 4 ustun tugmasi; bosilgani o'ngda bitta izohda ochiladi (bir vaqtda bittasi); 4/4 dan keyin jadval (bitta qator) chiqadi.
`holat` — darsning asosiy ustuni: kodda, tugmalarda va jadvalda urg'u rangida (qo'shimcha matnsiz — **KOD**).
Animatsiya: yo'q.
Olib tashlanadi: «Diqqat: holat ham shu yerda — suhbat bosqichini ham javonga yozamiz, restart'da yo'qolmasin» ramkasi (`holat` ustuni izohi bilan bir ma'no — **KOD**) · 🗄️ · `created_at` ustuni (quyida).

✎ 30.09 17-savol A: turlar backend darslaridagidek (`SERIAL`, `BIGINT`, `TEXT`), `NOT NULL` — `telegram_id` va `holat` da (ular yangi qator qo'shilganda doim bor); `ism` va `tanlov` — bo'sh bo'lishi mumkin: ism suhbatda so'raladi, tanlov buyurtma davomida yoziladi (`NOT NULL` qo'yilsa, INSERT xato beradi). QA taklif qilgan `IDENTITY`, `VARCHAR`, `TIMESTAMPTZ` olinmadi · 11-savol A — `tanlov` ustuni (29.09 qoralamada) · 30.09 QA F-0930-74 (rasm): «TEXT → VARCHAR» + tayyor jadval (`GENERATED ALWAYS AS IDENTITY`, `VARCHAR(100) NOT NULL`, `TIMESTAMPTZ`) — fakt: backend darslarida `SERIAL` 30 marta, `TEXT` 15, `TIMESTAMP` 5, `VARCHAR` — 0; PostgreSQL'da `TEXT` xato emas (`VARCHAR(n)` faqat uzunlik chegarasi); `NOT NULL` — foydali qo'shimcha. Qaror — 17-savol (11-savol `tanlov` ustuni bilan birga); hozircha jadval o'zgartirilmadi · 🔴 FAKT: jadvalda faqat `holat` (bosqich) bor edi, lekin bot 12-ekranda «Buyurtma: Katta + pishloq…» deydi va 3-ekranda «tanlov» ko'rsatiladi — tanlov hech qayerda saqlanmasdi → `tanlov TEXT` ustuni qo'shildi; o'rniga `created_at` («standart vaqt ustuni» — darsda hech narsa o'rgatmaydi) olindi, tugmalar soni 4 ligicha qoladi (**KOD**) · `telegram_id` izohi: tekshirdim — shaxsiy chatda `ctx.chat.id` mijozning Telegram raqamiga teng, to'g'ri; `BIGINT` to'g'ri (Telegram raqamlari 32-bitli sondan katta bo'lishi mumkin) · «Botjonning doimiy daftari», «daftarning eng muhim ustuni» → A1-4 · Mentor backend darslariga ko'prik
✎ 30.09 ChatGPT #11: «shaxsiy chatda» qo'shildi (guruhda `chat.id` guruhniki bo'ladi; muqobil — 3-darsdan tanish `ctx.from.id`, lekin `chat.id` 5, 7, 9, 10-ekranda ishlatiladi — qoldi) · #12: `holat` ustuni boshqalar bilan teng ko'rinardi → urg'u rangi + izohi «keyingi xabarni shunga qarab tushunadi» · #5: «har javobdan keyin yangilaydi» — har xabar UPDATE emas → olindi · #10 («sessiya ≠ jadval qatori»): Mentor «sessiyasi shu qatorda saqlanadi» deydi, «qator = sessiya» demaydi — o'zgarmadi

## 12 · AvtoPizza buyurtmasi (hayotiy)  `[1173]`
- Eyebrow: Hayotiy · buyurtma
- Sarlavha: **AvtoPizza buyurtmasi qadam-baqadam.**
- Mentor: Buyurtmani qadam-baqadam oching va har javobdan keyin holat qanday o'zgarishini kuzating.
- Chat (AvtoPizza bot):
  1. /start → «Salom! Pitsa o'lchamini tanlang: kichik yoki katta?» · holat `OLCHAM_KUTYAPMAN`
  2. Katta → «Yaxshi! Qo'shimcha pishloq qo'shaymi? (ha / yo'q)» · holat `QOSHIMCHA_KUTYAPMAN`
  3. Ha → «Qo'shdim. Endi manzilingizni yuboring.» · holat `MANZIL_KUTYAPMAN`
  4. Chilonzor 5-uy → «Rahmat! Buyurtma: katta, qo'shimcha pishloq bilan, Chilonzor 5-uy. Qabul qilindi.» · holat `TAYYOR`
- Suhbat holati · Aziza: holat — → (yuqoridagilar) · tanlov: — → katta → katta, pishloq → katta, pishloq, Chilonzor 5-uy
- Tugma: ▶ Buyurtmani boshlash → Keyingi javob → → ✓ Buyurtma qabul qilindi
- Oxirida: Bot «Katta» va «Ha» kabi qisqa javoblarni holatga qarab tushundi. Har xabarda u holatni bazadan o'qiydi va yangisini yozadi — shuning uchun o'rtada qayta ishga tushsa ham, suhbat shu joydan davom etadi.
- Tugma (pastda): Buyurtmani yig'ing (N/4) → Davom etish

**Ko'rinish:** hozirgidek — xabarlar navbat bilan, «yozmoqda…» (~0.75 s); o'ngda holat paneli; natija-ramka 4/4 dan keyin.
Animatsiya: yo'q (xabar → holat strelkasi 3-ekranda bor; bu yerda takrorlanmaydi).
Olib tashlanadi: 🍕 🧀 📍 ✅ · Mentordagi «Bu — to'liq stateful suhbat. Botjon har javobni daftarga yozadi…» (natija-ramka bilan bir ma'no; sarlavha ham shuni aytardi).

✎ 🔴 FAKT: holat panelidagi «tanlov» qatori «1/4 qadam … 4/4 qadam» ni ko'rsatardi — bu tanlov emas, sanoq → haqiqiy tanlov (**KOD**: `DaftarPage maz`) · holat qiymatlari A10 dagi yozuvda («O'lcham kutilmoqda» → `OLCHAM_KUTYAPMAN`), boshlang'ich «BO'SH» → «—» · «Mazza» (so'zlashuv) → «Qo'shdim» · sarlavha va Mentor bir gapni aytmaydi · «Bot restart bo'lsa ham, holat javonda» → «Holat PostgreSQL'da bo'lgani uchun» · «har lahzada» olindi
✎ 30.09 ChatGPT #13: bazada turgani yetmaydi — suhbat bot holatni qayta o'qigani uchun davom etadi → «har xabarda o'qiydi va yozadi» (13-ekrandagi SELECT / UPDATE ga ko'prik)

## 13 · SQL so'rovlari (amaliyot)  `[1215]`
- Eyebrow: Amaliyot · SQL
- Sarlavha: **Holat bilan ishlaydigan uchta SQL so'rovi.**
- Mentor: Handler bu so'rovlarni backend darslaridagidek `pool.query(...)` bilan yuboradi. Bo'shliqlarni navbat bilan to'ldiring.
- Kod yorlig'i: SQL
- Kod:
  ```sql
  ____ * FROM users WHERE telegram_id = $1

  ____ users SET holat = $1 WHERE telegram_id = $2

  ____ INTO users (telegram_id, holat) VALUES ($1, $2)
  ```
- Bo'shliqlar (ballsiz — variantlar aralash, 4-savol A; to'g'risi: SELECT · UPDATE · INSERT): 1) UPDATE / SELECT / INSERT · 2) SELECT / DELETE / UPDATE · 3) SELECT / INSERT / UPDATE
- Xato izohlari:
  - 1-bo'shliq: UPDATE — ma'lumotni o'zgartiradi; bu yerda esa avval o'qish kerak. · INSERT — yangi qator qo'shadi; bu yerda mavjud qatorni o'qiymiz.
  - 2-bo'shliq: SELECT faqat o'qiydi; bu yerda holatni yangilash kerak. · DELETE qatorni o'chiradi; bizga esa holatni yangilash kerak.
  - 3-bo'shliq: SELECT mavjud qatorni o'qiydi, yangi qator qo'shmaydi. · UPDATE faqat mavjud qatorni o'zgartiradi — yangi mijozning qatori hali yo'q.
  - (zaxira) Bu to'g'ri emas.
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: To'g'ri: `SELECT` holatni o'qiydi, `UPDATE` holatni yangilaydi, `INSERT` yangi mijozga qator qo'shadi.
- Tugma (pastda): Bo'shliqlarni to'ldiring → Davom etish

**Ko'rinish (KOD — hozir 3 bo'shliqning 9 varianti birdan, har guruh ustida SQL qatori yana bir bor yozilgan):** faqat joriy bo'shliq kodda yonadi va uning 3 varianti ko'rinadi; to'g'ri tanlangach so'z kodga tushadi, keyingi bo'shliq ochiladi.
Variantlar ustidagi yorliq — «1-bo'shliq / 2-bo'shliq / 3-bo'shliq» (SQL qatori kodda bor, takrorlanmaydi). Xato izohi — bitta, joriy bo'shliq ostida.
Animatsiya: yo'q.
Olib tashlanadi: `// o'qi → tekshir → yoz — xuddi daftar bilan ishlagandek` izohi (javoblar tartibini aytib qo'yardi) · 🏅 (qoida matni oldidagi) · «Daftar to'ldi!».

✎ 🔴 FAKT: fayl yorlig'i «handler.ts», ichida esa yalang'och SQL va `//` izoh — TypeScript faylida SQL bunday yozilmaydi, SQL'da esa izoh `--` bilan → yorliq «SQL», izoh olindi, Mentor so'rov handlerdan `pool.query(...)` bilan yuborilishini aytadi (backend darslarida shunday: `pool.query('SELECT * FROM cars')`, `WHERE id = $1`) · SQL'ning o'zi tekshirildi — to'g'ri (SELECT … WHERE, UPDATE … SET … WHERE, INSERT INTO … VALUES, `$1/$2` parametrlar) · «Daftar kodda qanday yoziladi?» → yangi sarlavha · to'g'ri variant har guruhda 1-o'rinda — Agent eslatmalari, 1
✎ 30.09 ChatGPT #14: variantlar aralash — 4-savol A (30.09) · xatodan keyin avval xato izohi, keyin nishon yozuvi — bor · «SQL nimani qaytaradi — kontekst yo'q» — Rad: SELECT / INSERT / UPDATE backend darslarida `pool.query` bilan o'tilgan (`PostgresCrudLesson`, `BackendCrudPracticeLesson`); bu ekran faqat eslatadi, muvaffaqiyat gapi har buyruq vazifasini aytadi

## 14 · 4-savol ✅  `[1273]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Mijoz birinchi marta /start bosdi, jadvalda uning qatori hali yo'q. Qaysi buyruq kerak?**
  - ✔ INSERT — jadvalga yangi qator qo'shadi
  - SELECT — mavjud qatorni o'qiydi
  - UPDATE — mavjud qatorni o'zgartiradi
  - DELETE — mavjud qatorni o'chiradi
- To'g'ri: Yangi mijozni SELECT topmaydi, shuning uchun unga INSERT bilan qator qo'shiladi.
- Xato izohlari:
  - SELECT o'qiydi, lekin yangi mijozning qatori hali yo'q — u hech narsa topmaydi.
  - UPDATE mavjud qatorni o'zgartiradi — yangi mijozning qatori hali yo'q.
  - DELETE o'chiradi — bizga esa yangi qator kerak.
  - (umumiy) Yangi qator INSERT bilan qo'shiladi.

✎ Variantlar shakli teng (hammasida «BUYRUQ — nima qiladi») — o'zgarmaydi · savol ikki qisqa gapga bo'lindi · «Foydalanuvchi» → «Mijoz» (dars bo'yi shu so'z)
✎ 30.09 F-0930-120 (o'zim): savoldagi «jadvalga qo'shish» to'g'ri variantdagi «jadvalga … qo'shadi» bilan so'zma-so'z mos edi — javob SQL'ni bilmasdan topilardi → savol vaziyatni aytadi («qatori hali yo'q») · «faqat», «butunlay» faqat xato variantlarda edi → olindi · ChatGPT #15/#16 (F-0930-119): to'g'ri izoh 15-ekranga ko'prik — «SELECT topmaydi → INSERT» (A12)

## 15 · Oqimni yig'ing ✅ (final)  `[1297]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: holatli botning xabar oqimini yig'ing.**
- Mentor: Aziza jadvalda bor va yangi xabar yozdi. Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash chiqadi): Xabar keladi · SELECT — holat bazadan o'qiladi · Holat tekshiriladi · Javob va yangi holat tanlanadi · UPDATE — yangi holat yoziladi
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · «bu yerga qo'ying»
- To'g'ri: ✓ Oqim tayyor: xabar keladi → SELECT → holat tekshiriladi → javob va yangi holat tanlanadi → UPDATE, keyin bot javobni yuboradi. Yangi mijozni SELECT topmaydi — shunda bot avval INSERT bilan qator qo'shadi.
- UPDATE SELECT'dan oldin bo'lsa: Bot holatni o'qimasdan yozib yubordi. UPDATE SELECT'dan oldin bo'lsa, bot suhbat qaysi bosqichda ekanini bilmay turib yangi holat yozadi — mijoz noto'g'ri savol olishi mumkin.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma (pastda): Oqimni yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi). Xato bo'lsa — bitta xato yozuvi; to'g'ri bo'lsa — bitta natija-ramka.
Hozir xato tartibda bir vaqtda uchta bir xil yozuv chiqadi (hovuzdagi «Tartib xato — bo'lakni bosib qaytaring…», «⚠️ Tartib xato — qayta joylang.» va ramka) — bittasi qoladi; to'g'rida ham ikkita («✓ To'g'ri: Xabar keladi → …» va «✓ Oqim tayyor: …») — bittasi qoladi (**KOD**).
Animatsiya: HA — to'g'ri yig'ilgach 5-qadamdan 1-qadamga qaytuvchi strelka chiziladi (keyingi xabar — yana shu oqim); faqat to'g'ri javobdan keyin.
Olib tashlanadi: Mentordagi «Diqqat: agar 💾 UPDATE'ni 🔍 SELECT'dan oldin qo'ysangiz — Botjon hali o'qimasdan yozib yuboradi» (SELECT va UPDATE tartibini oldindan aytib qo'yardi) · joy izohlari «birinchi nima bo'ladi · keyin nima o'qiladi · … · eng oxiri nima yoziladi» (tartibni ochib qo'yardi) → «1-qadam…» (**KOD**) · 😕 ⚠️ 📖.

✎ «Amal bajar / javob tayyorla» → «Javob va yangi holat tanlanadi»: UPDATE nega oxirida ekani mantiqan ko'rinadi (yangi holatni tanlamasdan yozib bo'lmaydi), «javob UPDATE'dan oldin yuboriladimi?» degan bahs qolmaydi — javob yuborilishi natija matnida · «Bosqichni tekshir» → «Holat tekshiriladi» (A1-4) · «daftardan o'qi / daftarga yoz» → «bazadan o'qiladi / yoziladi» · «stateful» → «holatli bot»
✎ 30.09 ChatGPT #15, #37 (F-0930-119, 🔴 blocker — to'g'ri): 14-savol «yangi mijoz → INSERT», bu oqim esa INSERT'siz — yangi mijozda SELECT hech narsa topmaydi → Mentor oqim kimniki ekanini aytadi («Aziza jadvalda bor»), natija INSERT yo'lini bir gapda qo'shadi; bo'laklar 5 ligicha, ✔ tartib o'zgarmaydi · #17 («javob oldindan ko'rinadi»): kodda `doneText` faqat yig'ilgandan keyin chiqadi — Rad; oldindan aytgan narsa Mentordagi «UPDATE'ni SELECT'dan oldin qo'ysangiz…» edi — 29.09 da olingan

## 16 · Amaliyot · loyihalash  `[2145]`
- Eyebrow: Amaliyot · loyihalash
- Sarlavha: **Botingiz uchun users jadvalini loyihalang**
- Topshiriq: 1-darsda ochgan botingiz uchun users jadvalini qog'ozda loyihalang: qaysi ustunlar kerak, holat qayerda saqlanadi va qaysi SQL qachon ishlatiladi. Bugun kod yozmaysiz — faqat loyihalaysiz.
- Mentor: Topshiriqni qog'ozda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- Qadamlar:
  1. Botingizga qaysi ustunlar kerakligini yozing: `telegram_id`, `ism`, …
  2. Ro'yxatga `holat` ustunini qo'shing (`TEXT NOT NULL`).
  3. Xabar kelganda avval qaysi SQL ishlatilishini yozing.
  4. Holat o'zgarganda qaysi SQL ishlatilishini yozing.
  5. Yangi mijoz uchun qaysi SQL kerakligini yozing.
- Tugmalar: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting · «Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.»

**Ko'rinish (KOD):** qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi (1-dars v2 16-ekran bilan bir xil; `ScreenLivePractice` ning shu darsdagi nusxasi).
Animatsiya: yo'q.
Olib tashlanadi: qadamlardagi javoblar — `(SELECT)`, `(UPDATE)`, `(INSERT)` (o'quvchi o'zi yozishi kerak edi, qavsda tayyor turardi) · ✅ · «Zo'r!».

✎ «o'z loyihangiz» → «1-darsda ochgan botingiz» (qaysi loyiha ekani aniq) · «users jadvalida qaysi ustunlar borligini ro'yxat qiling» — o'quvchida hali bunday jadval yo'q → «qaysi ustunlar kerakligini yozing» · «ustoz» → «Mentor» (A1) · «SELECT → UPDATE oqimini qog'ozga chizib chiqing» topshiriq matnidan olindi (3–5-qadam shuni so'raydi)
✎ 30.09 ChatGPT #18: sarlavha «loyihalang» — 29.09 da tuzatilgan; 2-qadam «ro'yxatga qo'shing» — qog'ozdagi ro'yxat, kod emas — o'zgarmadi

## 17 · Natijalar (podium)  `[1889]` — shablon o'zgarmaydi
(Tizim-UI: podium belgilari qoladi.)
- Bo'sh podium: **Bu darsga hali hech kim qo'shilmagan.** (hozir «Bu sessiyaga…» — **KOD**, B-2)
- Savol yorliqlari (nuqtalar ustida): 1 — Holatsiz bot · 2 — Xotira va baza · 3 — Ikki mijoz · 4 — INSERT/SELECT/UPDATE · 5 — Oqim tartibi

✎ «Xotirasiz muammo» → «Holatsiz bot» · «Cho'ntak vs javon» → «Xotira va baza»
✎ 30.09 ChatGPT #22 (F-0930-121): «sessiya» bu darsda — bitta mijozning holati; podium esa uni «jonli dars» ma'nosida ishlatardi (A2). Fakt: matn umumiy shablonda emas, har dars faylida o'z nusxasi (`BotStatefulMemoryLesson.jsx` [1935]) — shu darsda almashtiriladi

## 18 · Takrorlash (kartochkalar)  `[2159]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Holati yo'q bot bir necha xabardan keyin nega adashadi? | Oldingi xabarni eslamaydi | Har xabarni alohida hodisa deb ko'radi — bu holatsiz bot |
| Suhbat hozir qaysi bosqichda ekanini bildiradigan yozuv nima? | Holat (state) | Masalan: `MANZIL_KUTYAPMAN` — bot manzil kutyapti |
| Holatni eslab qoladigan bot qanday ataladi? | Holatli bot (stateful) | U suhbat qayerda to'xtaganini biladi |
| Bitta mijozning boshqalarnikidan alohida saqlanadigan holati nima? | Sessiya | Bot uni `chat.id` bo'yicha topadi |
| Hamma mijozning holati bitta o'zgaruvchida bo'lsa, nima bo'ladi? | Buyurtmalar aralashadi | Oxirgi yozuv oldingisining ustiga yoziladi |
| Koddagi oddiy obyektdagi holat bot qayta ishga tushsa nima bo'ladi? | Yo'qoladi | Obyekt dastur xotirasida (RAM) turadi — u vaqtinchalik |
| Bot qayta ishga tushsa ham holat qolishi uchun uni qayerga yozasiz? | PostgreSQL | Baza ma'lumotni diskka yozadi |
| Bot mijozlari haqidagi yozuvlar qaysi jadvalda turadi? | users | Ustunlari: id, telegram_id, ism, holat, tanlov |
| Yangi mijoz birinchi marta /start bosganda qaysi SQL buyrug'i ishlatiladi? | INSERT | Jadvalga yangi qator qo'shiladi |
| Mijozning holatini bazadan o'qish uchun qaysi buyruq kerak? | SELECT | Mijoz qatori `telegram_id` bo'yicha topiladi |
| Holat o'zgarganda mavjud qatorni qaysi buyruq yangilaydi? | UPDATE | Yangi qator qo'shilmaydi — bori yangilanadi |
| Xabar kelganda bot birinchi navbatda nima qiladi? | Holatni o'qiydi (SELECT) | Keyin holatni tekshiradi, javob va yangi holatni tanlaydi, yangi holatni yozadi (UPDATE) |

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →)

✎ 1: «Chunki eslamaydi» → «Oldingi xabarni eslamaydi» (to'liq javob) · 3: «Daftarli bot» → «holatli bot» · 4: «alohida daftar sahifasi» → sessiya ta'rifi (9-ekran bilan bir xil) · 5: «umumiy sahifa» → «bitta o'zgaruvchi» · 6–7: «Cho'ntak xotira», «Javon: … restart» → «dastur xotirasi», «qayta ishga tushsa» · 8: `tanlov` ustuni (11-ekran) · 12: 15-ekrandagi yangi tartib bilan mos
✎ 30.09 ChatGPT #24 (12 → 8–10 karta) — Rad: DARS_ETALON 9.3 — 12 karta; kartalar takrorlanmaydi (10 — buyruq nomi, 12 — oqimdagi o'rni)

## 19 · Yakun  `[2186]`
- Eyebrow: Tayyor · belgi: ✓ Holatni saqlashni bilasiz
- Sarlavha: **Endi botingiz suhbatni eslab qoladi.** (yonida ball halqasi)
- Endi siz bilasiz:
  - Holat saqlanmasa, bot qisqa javob qaysi savolga tegishli ekanini bilmaydi
  - Holat — suhbat qaysi bosqichda ekani va mijoz nimani tanlagani
  - Dastur xotirasidagi holat qayta ishga tushganda yo'qoladi — PostgreSQL'dagisi qoladi
  - Har mijozga alohida sessiya kerak — holat `chat.id` bo'yicha ajratiladi
  - Xabar oqimi: SELECT → holatni tekshirish → javob va yangi holat → UPDATE; yangi mijozga avval INSERT
- Arena tugmasi (jonli darsda kutish): Mentorni kuting
- Uyga vazifa · Amaliy topshiriqni bajarish → (bosilganda ochiladi) Uyga vazifa:
  - **Holatlarni yozing** — botingiz suhbati qaysi holatlardan o'tadi? Masalan: `OLCHAM_KUTYAPMAN` → `MANZIL_KUTYAPMAN` → `TAYYOR`
  - **Ajrating** — botingizdagi qaysi ma'lumot vaqtinchalik bo'lsa bo'ladi, qaysi biri PostgreSQL'da saqlanishi kerak?
  - **Gemini'dan so'rang** — gemini.google.com'ga botingizning users jadvalini va holatlarini yozing, so'ng ikki mijoz uchun kod so'rang: yangi mijoz (INSERT) va jadvalda bor mijoz (SELECT → UPDATE).
- Keyingi dars — **«Loyiha kuni: AI bilan bot».** Aniq topshiriq yozib, botni AI yordamida qurasiz, uning kodini o'qiysiz va sinab ko'rasiz.
- Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

Olib tashlanadi: ⏳ 📝 🚀 🏅 (matn oldidagi) · uyga vazifadagi «Loyihalang — users jadvali sxemasini chizing» (16-ekrandagi amaliyot bilan bir ish) → «Holatlarni yozing».

✎ 🔴 FAKT: «Keyingi dars — Botjon bilimlaringizni yanada chuqurlashtiramiz!» — dars nomi yo'q, grammatikasi xato; App.jsx bo'yicha keyingi dars m5-05 «Loyiha kuni: AI bilan bot» (DAVOM 6) · «Botjoningizga xotira berdingiz» / «Endi Botjon eslab qoladi» → botingiz · xulosalar A1-4 bo'yicha («daftarsiz», «cho'ntak/javon», «sahifa» olindi) · «AI'ga» → «gemini.google.com uchun» (sinfdagi AI vositasi) · uyga vazifaning 3-bandi keyingi darsga ko'prik bo'ladi
✎ 30.09 ChatGPT #26 (A13): «bot tabiatan…» o'rniga «holat saqlanmasa…»; 2-band endi ta'rif (bosqich + tanlov), 1-band bilan takrorlanmaydi · #15/#28 (A12): 5-bandga INSERT · #27: AI topshirig'i umumiy edi → jadval + holatlar beriladi, ikki yo'l so'raladi · 19-savol A: AI'ga yoziladigan matn — «prompt», u 5-darsda izoh bilan kiritiladi; «Topshiriq yozing» shu ma'noda edi (A2) → «Gemini'dan so'rang» (otsiz) · #25 (keyingi dars nomi) — 29.09 da tuzatilgan

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), tavsif — shu nishon beriladigan ekranga mos; medal belgisi — o'yin qatlami:
- **Safe Storage** (hozir Safe Notes) — 8-ekran: Bot qayta ishga tushsa ham yo'qolmaydigan joyni tanladingiz
- **No Mix-Up** — 10-ekran: Ikki mijozning suhbati aralashmaydigan yo'lni tanladingiz
- **SQL Writer** — 13-ekran: SQL bo'shliqlarini birinchi urinishda to'g'ri to'ldirdingiz
- **State Flow** (hozir Memory Keeper) — 15-ekran: Holatli botning xabar oqimini birinchi urinishda to'g'ri yig'dingiz
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

✎ 🔴 «Memory Keeper — Buyurtmani boshidan oxirigacha olib bordingiz» 15-ekranda (oqimni tartiblash) beriladi, buyurtma esa 12-ekranda (ballsiz) → tavsif va nom 15-ekranga moslandi · «No Mix-Up — …aralashib ketgan sababini topdingiz» — 10-ekranda sabab emas, yechim so'raladi → «yo'lni tanladingiz» · «Safe Notes» — «notes» daftar ma'nosida edi → «Safe Storage» · 📓 medal belgisi (daftar) → 🔁 (oqim) — **KOD**, qolgan belgilar qoladi
✎ 30.09 ChatGPT #31 (Memory Keeper → 12-ekran, No Mix-Up — sabab emas yechim) — 29.09 da tuzatilgan (State Flow, «yo'lni tanladingiz»)

**Qisqa takrorlash oynalari (5)** — karta belgisi (`ic`) o'rniga kod misoli (U3), kodsiz kartada raqam; «Belgilar» qatori ro'yxat ostida:
1. (4) **Bot nega unutadi:** Holat saqlanmasa, har xabar — alohida hodisa: bot hodisani oladi, javob beradi va keyingisini yangidan boshlaydi. · Shuning uchun «Tushunmadim» deydi: «Katta» kabi qisqa javob qaysi savolga tegishli ekanini bilmaydi. · Yechim — holat: suhbat qaysi bosqichda ekanini saqlasak, bot qayerda to'xtaganini biladi. · Sinfga savol: Bot nega bir necha xabardan keyin adashadi?
2. (8) **Dastur xotirasi va PostgreSQL:** Koddagi obyekt — tez, lekin vaqtinchalik: u dastur xotirasida (RAM) turadi. · Qayta ishga tushsa — yo'qoladi: xotiradagi hamma holat o'chadi. · PostgreSQL — doimiy: ma'lumot diskda, bot qayta ishga tushsa ham qoladi. · Sinfga savol: Bot o'chib-yonganda qaysi ma'lumot saqlanib qoladi?
3. (10) **Ikki mijoz aralashmasligi uchun:** Bitta umumiy holat — xavfli: oxirgi yozuv oldingisining ustiga yoziladi. · Har mijozga o'z sessiyasi: holat `chat.id` bo'yicha alohida saqlanadi. · Natija — har kim o'z buyurtmasini oladi. · Sinfga savol: Ikki mijoz aralashib ketmasligi uchun nima kerak?
4. (14) **INSERT, SELECT, UPDATE:** INSERT — yangi qator: yangi mijoz kelganda jadvalga qator qo'shiladi. · SELECT — o'qish: mavjud mijozning holatini o'qib olish uchun. · UPDATE — yangilash: holat o'zgarganda mavjud qator yangilanadi, yangisi qo'shilmaydi. · Sinfga savol: Yangi mijoz uchun qaysi SQL ishlatiladi?
5. (15) **Holatli botning xabar oqimi:** Avval — xabar keladi: hammasi shundan boshlanadi. · Keyin — o'qish va tekshirish: bot mijoz holatini o'qiydi (SELECT) va tekshiradi. · Eng oxiri — saqlash: yangi holat bazaga yoziladi (UPDATE). · Chizma: Xabar → SELECT → Tekshirish → Javob → UPDATE · Sinfga savol: Xabar kelganda bot birinchi nima qiladi?
- Belgilar (U3): 1-oyna — 1 · 2 · `holat = "OLCHAM_KUTYAPMAN"` | 2-oyna — `const holatlar = {}` · 2 · `CREATE TABLE users` | 3-oyna — 1 · `holatlar[ctx.chat.id]` · 3 | 4-oyna — `INSERT` · `SELECT` · `UPDATE` | 5-oyna — 1 · `SELECT` · `UPDATE`

✎ «Bot signalni oladi, amalni bajaradi» → «hodisani oladi, javob beradi» (A1) · «Yechim — daftar» → «Yechim — holat» · «Cho'ntak vs javon» → «Dastur xotirasi va PostgreSQL» · «Aziza va Bekning buyurtmasi endi hech qachon aralashmaydi» → «har kim o'z buyurtmasini oladi» (A3) · «Stateful xabar oqimi» → «Holatli botning xabar oqimi» · chizmadagi 🔍 💾 olindi · 🔁 😳 📓 👖 💨 🗄️ 📄 👥 ✅ ➕ 📩 → raqam
✎ 30.09 ChatGPT #33: 2-oyna «qayta ishga tushirish unga ta'sir qilmaydi» → «bot qayta ishga tushsa ham qoladi» (A3); «hech qachon aralashmaydi» — 29.09 da olingan · 1-oyna — A13

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Bot nega bir necha xabardan keyin oldingi javobni unutadi? Internet aloqasi beqaror bo'lib, xabar yo'qoladi · Mijoz xabarlarni juda tez ketma-ket yuborib turadi · ✔ Bot holatni saqlamaydi, har xabarni alohida ko'radi · Telegram xabarlarni tasodifiy tartibda yetkazadi
2. Aziza va Bek bir vaqtda botga yozsa, suhbatlari aralashmasligi uchun nima kerak? Ikkalasining holatini bitta o'zgaruvchida saqlash · Har mijozga alohida bot ochib, alohida token berish · Umumiy holatni obyektda emas, PostgreSQL'da saqlash · ✔ Har mijozga alohida sessiya ochib, holatni saqlash
3. Bot serveri qayta ishga tushganda qaysi ma'lumot saqlanib qoladi? ✔ PostgreSQL jadvaliga yozilgan ma'lumot · Koddagi JavaScript obyektidagi holat ma'lumoti · Hech qaysi, hammasi birdan yo'qoladi · Handler ichidagi o'zgaruvchidagi ma'lumot
   ✎ 01.10 (F-1001-56, razrabotka): 2-variant `lint:tell` uchun — texnik atama (PostgreSQL) faqat to'g'ri variantda edi; ✔ o'rni o'sha.
4. Bot «pitsa o'lchamini kutyapman» degan yozuvni saqladi. Bu yozuv nima deyiladi? Webhook — Telegram xabarni botga o'zi yuboradigan usul · ✔ Holat — suhbat hozir qaysi bosqichda ekanini bildiradi · Token — bot sizniki ekanini tasdiqlaydigan maxfiy qator · Fallback — hech bir handler mos kelmaganda ishlaydi
5. SELECT buyrug'i botga nima uchun kerak? Yangi mijozni jadvalga qo'shib qo'yish uchun · Mavjud ma'lumotni bazadan o'chirish uchun · Jadval tuzilishini o'zgartirib qurish uchun · ✔ Mijoz va uning holatini bazadan o'qish uchun
6. Yangi mijoz birinchi marta /start bosdi, jadvalda uning qatori hali yo'q. Qaysi buyruq kerak? SELECT — mavjud qatorni bazadan o'qiydi · ✔ INSERT — jadvalga yangi qator qo'shadi · UPDATE — mavjud qatorni o'zgartiradi · DELETE — mavjud qatorni o'chiradi
7. Mijoz javob bergach, bot holatni keyingi bosqichga qanday o'tkazadi? ✔ UPDATE bilan holatni yangi qiymatga o'zgartiradi · INSERT bilan har safar yangi qator qo'shib boradi · SELECT bilan holatni bazadan qayta o'qib oladi · DELETE bilan eski holatni o'chirib tashlaydi
8. Koddagi oddiy JavaScript obyektida saqlangan holatning eng katta kamchiligi nima? Bu usul botni juda sekinlashtirib qo'yadi · Bu usul diskda juda ko'p joy egallaydi · ✔ Bot qayta ishga tushsa, hammasi yo'qoladi · Uni bir vaqtda faqat bitta mijoz ishlata oladi
9. users jadvalidagi `holat` ustuni nima uchun kerak? Mijozning ismini saqlab qo'yish uchun · Mijoz tanlagan pitsani saqlab qo'yish uchun · ✔ Suhbat qaysi bosqichda ekanini saqlash uchun · Xabar yuborilgan vaqtni yozib qo'yish uchun
10. Nega har mijozga alohida sessiya berish muhim? ✔ Har kimning suhbati o'zida qoladi, aralashmaydi · Bot shundan keyin ancha tezroq ishlay boshlaydi · Bot qayta ishga tushsa ham, holat saqlanib qoladi · Bu faqat juda katta va murakkab botlarga kerak
11. Holatli bot xabar olganda birinchi nima qiladi? Har safar mijozni jadvalga yangidan INSERT qiladi · ✔ Mijoz va uning holatini SELECT bilan o'qiydi · Avval yangi holatni UPDATE bilan yozib qo'yadi · Mijozdan ismini har safar qaytadan so'raydi
12. Bot qayta ishga tushgandan keyin ham suhbatni davom ettirishi uchun nima kerak? Mijoz /start buyrug'ini qaytadan bosishi kerak · Bot internetga avvalgidan tezroq ulanishi kerak · Holat koddagi oddiy obyektda saqlanib turishi kerak · ✔ Holat PostgreSQL bazasida saqlangan bo'lishi kerak

✎ 1, 2, 3: tire va metafora («daftarsiz», «o'z sahifasi», «Doimiy daftar») faqat to'g'rida edi → olindi · 2: «Faqat birinchi xabar yuborgan mijozga javob» → «alohida bot va token» (10-ekran bilan bir sabab) · 3: «Faqat foydalanuvchi telefonidagi ilova xotirasi» — ishonarsiz → «Handler ichidagi o'zgaruvchi» · 🔴 4: savol «Suhbat holati … nima deb ataladi?» — javob savolning o'zida («holat»), to'g'ri variant esa «Sessiya bosqichi» edi (sessiya va holat aralashardi) → savol qayta yozildi, to'g'ri — «Holat»; variantlardagi «signal», «kalit», «isbotlovchi», «qator» → A1 · 5, 7, 10: «butunlay», «qaytarilmas holda», «sezilarli darajada ancha» kabi to'ldiruvchi so'zlar olindi (variantlar teng, lekin sun'iy uzun edi) · to'g'ri javob boshqalardan sezilarli uzun emas — farq 3 belgigacha (1, 2, 4, 5, 10, 12 da tenglashtirildi) · 11: «Mijozni jadvaldan butunlay o'chirib tashlaydi» 7-savoldagi variant bilan so'zma-so'z bir xil edi → «Mijozdan ismini har safar qaytadan so'raydi»; «Darhol» olindi · 12: «Cho'ntakdagi vaqtinchalik oddiy obyekt» → «koddagi obyekt»
✎ 30.09 ChatGPT #32 (F-0930-122): hech kim tanlamaydigan variantlar yaqin xatolarga almashdi — har biri darsdagi haqiqiy adashishni tekshiradi: 2 — «umumiy holat PostgreSQL'da» (saqlash ≠ ajratish; 10-ekran bilan bir xil) · 7 — INSERT / SELECT / DELETE (buyruqlar farqi) · 9 — «tanlagan pitsa» (`holat` ≠ `tanlov`) · 10 — «qayta ishga tushsa ham qoladi» (sessiya ≠ PostgreSQL) · 11 — «avval UPDATE» (15-ekrandagi tartib xatosi) · F-0930-120: 6-savol — savol so'zi to'g'ri variantda takrorlanardi → 14-ekran bilan bir xil yechim · ✔ o'rni hammasida o'sha (`2·3·0·1·3·1·0·2·2·0·1·3`)

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — savol va variantlar tugma bosilgandan keyin chiqadi (hozir xira ko'rinib turadi); javob izohi tanlovga qarab uch xil («Aynan!» · 1-variant · 3-variant — «Qiziq fikr!» dan keyingi birinchi gap har xil).
2. s1 — `sk-info` izoh kartasi va `GearPanel` (+ «Jihozlar paneli…» yorlig'i) olinadi.
3. `DaftarPage` — sarlavha ekran bo'yicha prop bilan: «Suhbat holati» (3), «Umumiy holat (hamma uchun bitta)» (7), «Suhbat holati · Aziza» (12); qator yorlig'i `bosqich` → `holat`; 📓 olinadi.
4. s3 — xabar → holat paneli strelka animatsiyasi.
5. s5 — YECHIM `agent-card` olinadi (bitta ramka qoladi); kod matni (`holatlar`, `holat`).
6. s6 — ikkinchi `sk-info` xulosa olinadi; RAM qutisidagi qator o'chib boradigan animatsiya.
7. s7 — ikki mijozdan bitta qutiga strelka animatsiyasi; `MIX_MSGS` / `MIX_PAGE_AFTER` matni (A11).
8. s9 — karta bosilganda sessiya (chat.id · holat · tanlov) ochiladi; «Ikkalasi birdan» 2/2 dan keyin chiqadi; natija-kartalar + `frame-success` → bitta ramka; ikki strelka animatsiyasi; `SESS_CLIENTS` (Aziza — Pepperoni, Bek — Margarita).
9. s11 — `SCHEMA_COLS`: `created_at` → `tanlov`; `CREATE TABLE` qatori; `DbTable` / `DB_COLS` ga `tanlov` ustuni; 4/4 dan keyingi `frame-success` olinadi.
10. s12 — `DaftarPage maz`: «N/4 qadam» → haqiqiy tanlov; holat qiymatlari A10 bo'yicha.
11. s13 — bo'shliqlar navbat bilan (faqat joriy bo'shliq variantlari); `bg-lbl` → «N-bo'shliq»; kod yorlig'i `handler.ts` → `SQL`; kod izohi olinadi.
12. s15 — slot yorliqlari «1-qadam…»; xato tartibda bitta yozuv (hovuz yozuvi va `dd-wrong` bu ekranda chiqmaydi), to'g'rida bitta natija (`dd-done` yoki `frame-success`); qaytuvchi strelka animatsiyasi; `FLOW` yorliqlari.
13. s16 — `ScreenLivePractice` checklist navbat bilan (shu darsdagi nusxa); «✅ Bajardim» → «Bajardim», «ustoz» → «Mentor».
14. Nishonlar — `ACHIEVEMENTS` name/desc; `memoryKeeper` belgisi 📓 → 🔁.
14b. 30.09 javoblari: 11-ekran jadvali (`NOT NULL`, 17-savol A); 13-ekran bo'shliq variantlari aralash, nishon sharti variant matni bo'yicha (4-savol A); 4 ta testning to'g'ri javob izohi — bitta gap (16-savol).
14a. Butun dars — UI qoidalari U1–U3: harakat tugmalari bitta asosiy uslubda (0, 2, 3-ekran va boshqalar); hook tanlovi neytral rangda; qadam teglari olinadi; ochiladigan kartalarda `›` / `✓`; ⛶ matn ustiga tushmaydi (9-ekran, RU); `TgChat` oraliqlari; RECAPS `ic` → kod misoli.
14c. 30.09 ChatGPT auditi (F-0930-117…122): s9 — «Ikkalasi birdan» bosilganda avval ikki xabar pufakchasi (Aziza «Katta», Bek «Kichik»), keyin natija · s11 — `holat` qatori kodda, tugmada va `DbTable` da urg'u rangida · s17 — bo'sh podium «Bu darsga hali hech kim qo'shilmagan.» (shu fayldagi nusxa [1935]) · matn: s0, s2, s5, s6, s10 (3-variant va izohi), s11, s12, s14 (savol, variantlar, izohlar), s15 (Mentor, natija), s19, RECAPS 1–2, `QUIZ_BANK` 2, 6, 7, 9, 10, 11 — ✔ o'rni o'zgarmaydi.
15. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`); `RECAPS` `ic` → raqam, `RcFlow` dan 🔍 💾; `Q_LABELS`; `QZ_BG_SHAPES` dan `'daftar→javon'` va 📓 (→ `chat.id`, `tanlov`); `LESSON_META.lessonTitle` «Botjon eslab qoladi — stateful logika va PostgreSQL» → «Bot eslab qoladi — holat va PostgreSQL».

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **Jihozlar paneli (`GearPanel`)** — 1-dars B-1 (✅ qaror F-0929-63); bu darsda KOD 2.
2. **«sessiya» (podium: «Bu sessiyaga hali hech kim qo'shilmagan»)** — 1-dars B-5. Bu darsda to'qnashuv to'g'ridan-to'g'ri: «sessiya» shu darsning asosiy atamasi (bitta mijozning holati). **30.09 fakt (F-0930-121):** matn umumiy shablonda emas — har dars faylida o'z nusxasi (5-Modulda 11 fayl, hammasi chegara ichida). Shu darsda KOD 14c bilan almashtiriladi; qolgan 10 darsda — A2 bo'yicha razrabotkada bir yo'la. Boshqa modullardagi nusxalar — KATTA_TOZALASH nomzodi.
3. **3-dars v2:** `ctx` ichidan `ctx.from` va `ctx.message.text` ko'rsatiladi, `ctx.chat` yo'q; 4-dars `ctx.chat.id` bilan ishlaydi (bu darsda bir gap bilan izohlandi). 3-dars 6-ekraniga `ctx.chat.id` qo'shilsa, ko'prik tabiiy bo'ladi. Aziza raqami ham bir xil bo'lsin: 3-darsda `id: 5012`, bu darsda `558210300` (A11).
4. **1-dars v2 6-ekran «Bot holati» (oflayn / onlayn / xavfda)** — «holat» so'zi 4-darsda «suhbat holati» ma'nosini oladi (A2: bir so'z — bir ma'no). Taklif: 1-darsda yorliq so'zsiz — «Bot: onlayn / oflayn / xavfda» (til-lint tizim haqida boshqa so'zga ruxsat bermaydi, shuning uchun sinonim emas, yorliqning o'zi olinadi). Qaror 1-dars ko'rigida.
5. **7-dars (Loyiha kuni: bot + DB + AI) va 11-dars (PmMetrics, «keyin bazadan keladi»)** — baza haqida gapirganda shu darsdagi nomlar: users jadvali (`telegram_id`, `ism`, `holat`, `tanlov`), holat, sessiya, INSERT/SELECT/UPDATE.
6. **RU matni** — o'zbekcha tasdiqlangach (ruscha «bloknot», «karman», «shkaf» ham ketadi).

---

## Agent eslatmalari
1. **13-ekran — to'g'ri tugma doim 1-o'rinda (DAVOM 7):** tekshirdim — to'g'ri: `SQL_BLANKS` da uchala bo'shliqda `options[0] === correct` (SELECT / UPDATE / INSERT). Matn bilan hal bo'lmaydi. s13 `INLINE_KEYS` da yo'q (jonli ball kaliti emas, faqat SQL Writer nishoni), shuning uchun tartibni almashtirish ballni buzmaydi — lekin qoida «kod-bo'shliq tartibi o'zgarmaydi» bo'lgani uchun o'zgartirmadim. Taklif: 1) UPDATE · SELECT · INSERT · 2) SELECT · DELETE · UPDATE · 3) SELECT · INSERT · UPDATE. 1-dars v2 13-ekranda ham xuddi shu naqsh (start / reply / hears birinchi) — modul uchun bitta qaror kerak.
2. **«bugun 3-uyacha yonadi» (DAVOM 7):** tekshirdim — xato to'g'ri: `active` da 5 ta uyacha. Panel olinadi, yozuv ham ketadi.
3. **«Keyingi dars» (DAVOM 6):** tekshirdim — nomsiz va grammatikasi xato edi; App.jsx m5-05 «Loyiha kuni: AI bilan bot» bilan tuzatildi (19-ekran).
4. **Metafora:** «cho'ntak / javon» bitta o'xshatish sifatida ham qoldirilmadi — o'rniga React darsidagi tajriba (`ReactCrudPracticeLesson`: «sahifani yangilasangiz yo'qoladi — faqat xotirada»). Foydalanuvchi bitta o'xshatish istasa, eng mos joy — 5-ekran kamchilik ramkasi.
5. **`tanlov` ustuni (11-ekran, `created_at` o'rniga)** — kichik tuzilma o'zgarishi, 12, 16, 18-ekran va viktorinaga tegadi. Sababi: busiz bot pitsa tanlovini hech qayerda saqlamaydi, holbuki 1-dars ko'prigi aynan «qaysi pitsa tanlangan» ni eslashni va'da qiladi. Tasdiq kerak.
6. **Holat qiymatlari konstanta ko'rinishida** (`OLCHAM_KUTYAPMAN`) 3-ekranning o'zida ham — bir tushuncha bir yozuvda qolsin deb (A10). Muqobil: 3-ekranda odam tilida («O'lcham kutilmoqda»), 5-ekrandan boshlab konstanta — bu holda bitta qiymat ikki shaklda bo'ladi.
7. **7-ekran mantiqi:** «`chat.id` bo'yicha ajratilmasa-chi?» tajribasi bo'lib qoldi, ekran tartibi o'zgarmadi. Pedagogik jihatdan 7 → 5 tartibi (avval muammo, keyin kod) tozaroq bo'lardi, lekin ekran tartibi o'zgarmaydi — shunchaki qayd.
9. **30.09 ChatGPT auditi (F-0930-117)** eski matnni (`-sozlar.md`) o'qigan: «Botjon tabiatan daftarsiz», «chontak», «created_at», «Memory Keeper», «bugun 3-uyacha», «Aziza — Margarita» — bularning hammasi 29.09 da tuzatilgan. Yangi va haqli topgani: 14↔15-ekran INSERT yo'li (A12), 0-ekranda xato tanlovga alohida gap, `ctx.chat.id` doirasi, `holat` ustuni urg'usi, qayta ishga tushgach bazadan o'qish, arena variantlari. O'zim topganlar: «holat» 0–2-ekranda ta'rifsiz (F-0930-118), 14-savol / viktorina 6 — savol so'zi to'g'ri variantda (F-0930-120), 10-savol / viktorina 2 — ishonarsiz variant, podium matni har faylda (F-0930-121), uyga vazifadagi «Topshiriq yozing» (19-savol A bilan zid).
10. **`ctx.chat.id` yoki `ctx.from.id`:** `telegram_id` mazmunan mijoz raqami, ya'ni `ctx.from.id` (3-darsdan tanish). Lekin darsning butun «ajratish» mantig'i chat bo'yicha (5, 7, 9, 10-ekran, kartochka, viktorina) — `chat.id` qoldi, «shaxsiy chatda» doirasi bilan. Guruh botlari bu modulda yo'q.
8. **Tekshirilgan texnik da'volar (xato emas):** SQL sintaksisi (13, 14), `BIGINT UNIQUE` (11), shaxsiy chatda `ctx.chat.id` = mijozning Telegram raqami (5, 11), holat diskdagi bazada saqlanishi va RAM'dagi obyekt qayta ishga tushganda yo'qolishi (5, 6, 8), sessiyani chat bo'yicha ajratish (9, 10 — Telegraf'ning session vositasi ham chat + foydalanuvchi raqami bo'yicha ajratadi).
