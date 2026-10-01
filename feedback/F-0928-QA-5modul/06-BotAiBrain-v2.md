# 5-Modul (LMS: 7-Modul) · 6-dars «Bot ichida AI» — YANGI MATN (v2)

Fayl: `src/5-Modull/BotAiBrainLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `06-BotAiBrain-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s4:2 · s8:0 · s10:3 · s14:1 · s15` tartib; arena `1·3·0·2·1·0·3·1·2·3·0·2`) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (UI qoidalari U1–U3 bilan) · 29.09 v2-qoralama · **30.09: QA suratlari (F-0930-89…94) qo'llandi**; **ChatGPT matn auditi (F-0930-96) filtrlandi** — hukmlar `JURNAL.md`. **30.09 javoblari (F-0930-98):** 19-savol A (5 va 6-darsda «prompt») · 20-savol A («Faktni tekshirish», sarlavha qisqa) · 7-savol A (amaliyotda aistudio.google.com) · 10-savol A (13-ekran kodi, matn qisqa) · 4-savol A (5-ekran variantlari aralash) · 16-savol (to'g'ri javob izohi — bitta gap).

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Shu darsga xos qo'shimchalar:

**A1 (davomi) — bu darsning atamalari.** Hamma metafora-nom haqiqiy atamaga o'tadi. O'xshatish qoldirilmadi: atamalarning o'zi yetarlicha sodda.

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| Maslahatchi · 🧭 | **AI** (bot ulanadigan AI modeli, masalan, Gemini) | «ko'p matndan o'rgangan model; bot unga AI API orqali so'rov yuboradi» (2-ekran) |
| topshiriq | **prompt** (19-savol A — modulda bitta nom) | 5-darsda kiritilgan; 3-ekran Mentorida eslatma |
| yo'riqnoma · 📜 · «Yo'l-yo'riq» jihozi | **system prompt** | «AI'ga har so'rovdan oldin beriladigan doimiy ko'rsatma: u kim, qanday gapiradi, nima haqida gapiradi» (5-ekran) |
| stol usti · varaq | **kontekst oynasi** · xabar | «AI bir so'rovda ko'ra oladigan matn hajmi» (7-ekran) |
| daftar | **suhbat tarixi** (bot AI'ga qo'shib yuboradigan oldingi xabarlar) · muhim ma'lumot uchun **baza** (4-darsdagi holat kabi) | — (F-0929-51) |
| erkinlik murvati · 🎚️ | **temperature** | «javob qanchalik erkin bo'lishini belgilaydigan son; Gemini'da 0 dan 2 gacha» (9-ekran) |
| o'ylab topish · o'ylab topilgan | **hallutsinatsiya** · to'qib chiqarilgan | «AI ishonch bilan aytgan, lekin haqiqatga to'g'ri kelmaydigan gap» (11-ekran) |
| API kalit · kalit | **AI API kaliti** | «Telegram tokeni kabi maxfiy» (13-ekran) |
| Fact Checker · javobni tekshirish | **faktni tekshirish** (20-savol A); nishon nomi «Fact Checker» | 11-ekran Mentori: «…buni inglizcha fact-checking deyishadi» (bir marta) |
| xavfsiz ishlash sikli | **handler AI bilan ishlash tartibi** | — («sikl» — faqat botning ish sikli, A2) |
| Pitsa Bek · mijoz Aziz | **AvtoPizza** (modul olami) · mijoz **Aziza** (1, 4-darsdagi) | — |
| LLM token (matn bo'lagi) | ishlatilmaydi — «matn hajmi» | — (bot tokeni bilan adashadi; eslatma 7) |

**A6 istisnosi — solishtirish ekranlari (3, 9).** Birinchi natija ✓ qatorga yig'ilmaydi — solishtirish uchun ikkala natija yonma-yon qoladi. Navbat faqat tugmada: ikkinchi tugma birinchi natijadan keyin chiqadi.

**«Sen» istisnosi.** System prompt matni («Sen … yordamchisisan. … gapir.») — AI'ga yozilgan ko'rsatma, o'quvchiga murojaat emas; «siz» qoidasi unga tegishli emas.

---

## Darsning ipi
- **Olam (bitta):** AvtoPizza boti — 1, 3, 4-darsdagi bot. Bu safar uning handleri javobni AI'dan oladi.
- **Hook:** mijoz «Pitsa haqida ayting» deb yozadi → system prompt'siz AI pitsaning tarixini gapiradi → mijoz: «Menga do'koningizdagi pitsalar kerak edi».
- **Asosiy model (dars bo'yi bitta):** mijoz xabari (hodisa) → handler → AI API (system prompt + suhbat tarixi + yangi xabar; temperature) → javob tekshiriladi → mijozga ketadi.
- **Oldingi bilimga ko'prik:** 1-dars — handler faqat yozilgan javobni yuborardi («Javobni o'zi yozadigan AI-botni 6-darsda ko'rasiz») · 3-dars — Telegram Bot API va token → AI API va AI API kaliti · 4-dars — baza va holat → suhbat tarixi va muhim ma'lumot · 5-dars — AI'ga prompt yozib kod oldingiz → bugun prompt bot ichida ishlaydi.
- **Tajribalar:** noaniq va aniq prompt (3) · system prompt yig'ish (5) · ikki alohida so'rov (6) · kontekst oynasi (7) · temperature (9) · javobni menyu bilan tekshirish (11) · buyurtmagacha suhbat (12) · handler tartibi (15) · gemini.google.com'da system prompt (16).
- **Keyingi dars (App.jsx m5-07):** «Loyiha kuni: bot + DB + AI».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — «Pitsa haqida ayting» | hook | xabarni yuboradi, AI nega shunday javob berganini tanlaydi | — |
| 1 | Reja | qoida | xabar → handler → AI API → javob chizmasi + 4 qadam | — |
| 2 | AI nimani biladi | tushuncha | uchta xususiyatni ochadi | — |
| 3 | Noaniq va aniq prompt | tushuncha | ikki promptni navbat bilan yuborib, javoblarni solishtiradi | — |
| 4 | 1-savol | test | qanday prompt foydali javob beradi | ✅ |
| 5 | System prompt yozing | markaziy #1 | kim / qanday / nima haqida — navbat bilan tanlab yig'adi | — · nishon |
| 6 | Ikki alohida so'rov | case | ikkinchi xabarni yuboradi, AI ismni bilmasligini ko'radi | — |
| 7 | Kontekst oynasi sinovi | markaziy #2 | 5 xabarni birma-bir yuboradi, qaysi muhim ma'lumot chiqib ketishini topadi | — · nishon |
| 8 | 2-savol | test | tarix oynaga sig'masa nima bo'ladi | ✅ |
| 9 | Temperature | markaziy #3 | past va baland javoblarni solishtiradi, menyu uchun qiymat tanlaydi | — · nishon |
| 10 | 3-savol | test | temperature baland bo'lsa nima bo'ladi | ✅ |
| 11 | Faktni tekshirish | markaziy #4 | 3 gapni menyu bilan solishtirib belgilaydi | — · nishon |
| 12 | AvtoPizza suhbati | hayotiy | buyurtmagacha suhbatni qadam-baqadam ochadi | — |
| 13 | AI botga qanday ulanadi | tushuncha | kod (taklif), AI API kaliti va xarajat | — |
| 14 | 4-savol | test | AI menyuda yo'q pitsani aytsa nima qilinadi | ✅ |
| 15 | Handler tartibini yig'ing | yakuniy | 5 bo'lakni tartiblaydi | ✅ (final) |
| 16 | Amaliyot · AI chat | praktika | gemini.google.com'da o'z system prompt'ini sinaydi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — «Pitsa haqida ayting»  `[732]`
- Eyebrow: Kirish
- Sarlavha: **Mijoz pitsa haqida so'radi. AI nima deb javob beradi?**
- Mentor: 1-darsda bot faqat handlerda yozilgan javobni yuborardi. Endi AvtoPizza botining handleri mijoz xabarini AI'ga yuboradi va javobni undan oladi. AI'ga hali hech narsa aytilmagan. Tugmani bosing va nima bo'lishini ko'ring.
- Chat (AvtoPizza · holati: AI ulangan, system prompt yo'q):
  - mijoz: «Pitsa haqida ayting»
  - (bosilgach) bot: «Pitsa Italiyaning Neapol shahrida paydo bo'lgan taom. Uning tarixi bir necha asrga boradi: Margarita, Marinara kabi turlari bor. Bugun u ko'p mamlakatda mashhur, har birida o'z retsepti bor…»
  - (keyin) mijoz: «Menga do'koningizdagi pitsalar kerak edi»
- Tugma: ▶ Xabarni AI'ga yuborish → ✓ AI javob berdi
- Savol: **Nega AI shunday javob berdi?**
  - AI'ga vazifasi aytilmagan, u qaysi do'kon boti ekanini bilmaydi
  - Bot savolni AI'ga emas, qidiruv saytiga yubordi
  - Internet sekin ishlab, javob chalkashib ketdi
- Javob — 1-variant: **Aynan!** AI juda ko'p narsani biladi, lekin unga vazifasi aytilmagan: u AvtoPizza boti ekanini ham, nima haqida gapirishini ham bilmaydi. Bugun buni system prompt bilan hal qilamiz.
- Javob — 2 yoki 3-variant: **Qiziq fikr!** Chatga qarang: AI to'liq va tartibli javob yozdi — faqat do'kon haqida emas. Unga u AvtoPizza boti ekani aytilmagan edi. Bugun buni system prompt bilan hal qilamiz.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, chat (faqat mijoz xabari) va tugma. Savol va variantlar hali yo'q (hozir xira bo'lib turadi — **KOD**).
Tugma bosilgach: «yozmoqda…» → AI javobi → mijozning norozi xabari (xuddi shu chatda) → savol va 3 variant chiqadi → tanlangach javob izohi.
Animatsiya: «yozmoqda…» uch nuqtasi (chatning o'z ko'rinishi); chizish yo'q.
Olib tashlanadi: ikkinchi «Mijoz» chati (mijoz xabari bot chatiga ko'chadi — bitta suhbat, bitta blok; **KOD**) · 🧭 🍕 😕 🙋.

✎ Maslahatchi → AI · 1-dars ko'prigi qo'shildi («handler javobni AI'dan oladi») · sarlavha natijani oldindan aytib qo'yardi («hammasini gapirib berdi») → savol · «Topshiriqni yuborish» → «Xabarni AI'ga yuborish» (mijoz xabarini bot yuboradi, o'quvchi emas) · javob tanlovga qarab ikki xil (**KOD:** hozir hammasiga «Aynan!») · «Loyiha · kirish» → «Kirish» (bu loyiha kuni emas)

## 1 · Reja  `[776]`
- Eyebrow: Reja
- Sarlavha: **Bugun: bot javobni AI'dan qanday oladi va AI'ni qanday boshqaramiz.**
- Mentor: 1-darsda handler javobni o'zi yozilgan matndan olardi. Bugun u javobni AI'dan oladi. AI yaxshi javob yozishi uchun unga nima yuborishni o'rganamiz.
- Chizma: Mijoz xabari (hodisa) → handler → AI API → javob · AI API ostida kichik yozuv: system prompt · suhbat tarixi · temperature
- Bugungi 4 qadam:
  1. AI nimani biladi va nimani bilmaydi
  2. System prompt yozamiz
  3. Suhbat tarixi va temperature'ni sinaymiz
  4. Faktni tekshiramiz
- Tugmalar: 4 qadamni ko'rish / ↩ Chizmani ko'rish (telefonda) · Orqaga · Boshlaymiz →

**Ko'rinish:** sarlavha + Mentor → chizma chiziladi → shundan keyin 4 qadam birma-bir chiqadi.
Animatsiya: HA — «Mijoz xabari» → strelka → «handler» → strelka → «AI API» → strelka → «javob» (~1.2 s; javob qaysi yo'l bilan kelishini ko'rsatadi). **KOD:** chizma yangi (1-darsdagi `SignalFlow` naqshi).
Olib tashlanadi: «dars oxirida — aniq va ishonchli javob» chati (12-ekrandagi suhbat bilan bir ma'no) · «Tayyor javob emas — Maslahatchi…» kartasi · «Jihozlar paneli» (qaror F-0929-63, B-1).

✎ «Botjoningizga o'ylaydigan maslahatchi ulaymiz» → yangi sarlavha · «Hozirgacha Botjon faqat 📋 qoidalar varag'idan qator qidirdi… Yangi jihoz yondi: 🧭 Yo'l-yo'riq» → 1-dars ko'prigi (handler), jihoz olindi · qadamlardagi 🧭 📜 olindi · «Stol usti va murvatni» → «Suhbat tarixi va temperature'ni»

## 2 · AI nimani biladi  `[816]`
- Eyebrow: Tushuncha · AI
- Sarlavha: **Bot ulanadigan AI nimani biladi va nimani bilmaydi?**
- Mentor: Bot javobni AI modelidan oladi, masalan, Gemini'dan. Uning uchta xususiyatini bosib ko'ring.
- Kartalar:
  - **Ko'p matndan o'rgangan** — AI modeli juda ko'p matn asosida o'qitilgan, shuning uchun turli mavzularda gapira oladi. Lekin AvtoPizza menyusini u bilmaydi — buni unga aytish kerak.
  - **Har safar biroz boshqacha yozadi** — AI javobni so'zma-so'z tanlab yozadi. Shuning uchun bir xil savolga ikki marta bir xil javob bermasligi mumkin.
  - **Oldingi so'rovni o'zi eslamaydi** — Bot yuborgan har so'rov AI uchun alohida. Oldingi xabarlarni AI faqat bot ularni so'rovga qo'shib yuborsa biladi — buni tez orada sinab ko'rasiz.
- Tugma: Uchalasini oching (N/3) → Davom etish

**Ko'rinish:** hozirgidek — 3 tugma; bosilgani bitta kartada ochiladi (bir vaqtda bittasi).
Animatsiya: yo'q.
Olib tashlanadi: «Eng muhimi — u sizni eslamaydi… Buni keyingi ekranlarda sinaymiz» ramkasi (3-kartani qaytaradi).

✎ 30.09 ChatGPT #9–10 **Qabul**: «deyarli har qanday mavzuda» → «turli mavzularda» (keng da'vo) · 3-karta aniqroq: AI oldingi xabarni «hech qachon eslamaydi» emas — bot tarixni qo'shib yuborsa biladi (6–7-ekranning mantig'i shu gapdan boshlanadi) · «Maslahatchi — botning yangi buyumi. U hech qachon uxlamaydi» → olindi (qat'iy gap, buyum-metafora) · 2-karta «Charchamaydi: tunu-kun, minglab savolga… hech qachon charchamaydi» → «Har safar biroz boshqacha yozadi» (qat'iy gaplar; yangi karta 9-ekrandagi temperature'ga zamin) · «Sizni ESLAMAYDI» → «Oldingi so'rovni eslamaydi» (texnik aniq: AI API so'rovlar orasida holat saqlamaydi) · 1-kartaga «menyuni bilmaydi» qo'shildi (system prompt'ga ehtiyoj shundan) · 🧭 olindi

## 3 · Noaniq va aniq prompt  `[848]`
- Eyebrow: Tushuncha · prompt
- Sarlavha: **Noaniq prompt va aniq prompt.**
- Mentor: Prompt — AI'ga yuboriladigan matn (5-darsda bot kodi uchun yozgansiz). Ikkala promptni yuborib, qaysi javob foydaliroq ekanini solishtiring.
- Chap — yorliq «noaniq prompt»:
  - Karta [prompt]: «Yordam bering»
  - Tugma: ▶ Yuborish → ✓ Yuborildi
  - AI: «Albatta. Nimada yordam kerak? Savol juda keng — qaysi mavzu, qaysi vazifa ekanini aniqroq yozing.»
- O'ng — yorliq «aniq prompt»:
  - Karta [prompt]: «AvtoPizza do'konining Telegram-boti uchun 3 ta qisqa salomlashuv gapi yozing»
  - Tugma: ▶ Yuborish → ✓ Yuborildi
  - AI: «1) Xush kelibsiz! AvtoPizza'da bugun qaysi pitsani tanlaysiz? 2) Assalomu alaykum! Menyuni ko'rish uchun «Menyu» tugmasini bosing. 3) Salom! Buyurtma berishga yordam beraymi?»
- Xulosa: Aniq prompt — foydali javob. Bot ichida ham shunday: AI'ga u kim ekani va nima qilishi aniq yozib beriladi. Buni system prompt deyiladi — uni birozdan keyin o'zingiz yozasiz.
- Tugma: Ikkalasini yuboring (N/2) → Davom etish

**Ko'rinish (A6 istisnosi — solishtirish):** ikkala prompt kartasi ko'rinadi; faqat chap tugma faol. Chap javob chiqqach o'ng tugma chiqadi (**KOD:** hozir ikkalasi birdan). Ikkala javob yonma-yon qoladi; xulosa 2/2 dan keyin.
Animatsiya: yo'q.

✎ «topshiriq» → «prompt» (A1) · «Yomon / yaxshi topshiriq» → «Noaniq / aniq prompt» (yomon-yaxshi baho beradi, noaniq-aniq sababini aytadi) · Mentor xulosani oldindan aytardi («qanchalik aniq bo'lsa, shunchalik foydali») — endi faqat vazifa · Pitsa Bek → AvtoPizza · 🍕 📜 olindi · 🔴 FAKT: «keyingi ekranda uni yozamiz» — keyingi ekran test (4), system prompt 5-ekranda → «birozdan keyin»

## 4 · 1-savol ✅  `[880]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **AI'dan foydali javob olish uchun prompt qanday yozilishi kerak?**
  - Iloji boricha qisqa, bir-ikki so'z bilan
  - Katta harflar va undov belgilari bilan
  - ✔ Kim uchun va nima kerakligini aniq aytib
  - Bitta savolni bir necha marta takrorlab
- To'g'ri: AI faqat promptda yozilganini ko'radi — kim uchun va nima kerakligini aniq yozing.
- Xato izohlari:
  - Qisqa prompt ko'pincha noaniq bo'ladi: «Yordam bering» ga AI aniqlashtiruvchi savol qaytardi.
  - Katta harf AI'ga yangi ma'lumot bermaydi. Muhimi — nima kerakligi aniq yozilgani.
  - Takrorlash promptni aniqroq qilmaydi: AI'ga yangi ma'lumot qo'shilmaydi.
  - (umumiy) Foydali javob uchun promptda kim uchun va nima kerakligi aniq yoziladi.

✎ Savol almashdi: eski savol («Nega Maslahatchi kerak bo'lmagan narsalar haqida gapirdi?») 0-ekrandagi hook savolini deyarli so'zma-so'z takrorlardi — javobi hookda allaqachon aytilgan edi. Yangi savol 3-ekrandagi tajribani tekshiradi · ✔ o'rni (C) saqlandi · to'g'ri variantdagi qavs olindi («(yo'riqnoma)» faqat to'g'rida edi) · «charchab, dam olishga chiqib ketgan» — ishonarsiz variant edi (eslatma 5)

## 5 · System prompt yozing (markaziy #1)  `[900]`
- Eyebrow: Markaziy · system prompt
- Sarlavha: **AvtoPizza boti uchun system prompt yozing.**
- Mentor: System prompt — AI'ga har so'rovdan oldin beriladigan doimiy ko'rsatma: u kim, qanday gapiradi, nima haqida gapiradi. Har savolga bitta javob tanlang.
- Savollar va variantlar (tanlanganda ✓ yoki ✗; ballsiz — to'g'ri variant o'rni aralash, 4-savol A):
  - **Kim?** — Istalgan savolga javob beradigan ensiklopediya · ✔ AvtoPizza do'konining yordamchisi · Faqat o'zi haqida gapiradigan yordamchi
  - **Qanday gapirsin?** — Imkon qadar uzun va batafsil · Faqat «ha» yoki «yo'q» deb · ✔ Qisqa, samimiy, aniq
  - **Nima haqida?** — Istalgan mavzuda erkin gaplashaver · ✔ Faqat menyu va buyurtma haqida gaplash · Hech qanday savolga javob berma
- Yorliq: yig'ilayotgan system prompt · karta «SYSTEM PROMPT»: «Sen …san. … gapir. ….» (tanlangan javoblar o'rniga tushadi)
  - to'g'ri yig'ilganda: «Sen AvtoPizza do'konining yordamchisisan. Qisqa, samimiy, aniq gapir. Faqat menyu va buyurtma haqida gaplash.»
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Bu javob AvtoPizza boti uchun mos emas — ✗ belgisini ko'ring va boshqasini tanlang.
- To'g'ri: Tayyor — endi AI biladi: u kim, qanday gapiradi va nima haqida gapiradi.
- Tugma: System prompt'ni yig'ing → Davom etish

**Ko'rinish (KOD — hozir 3 savolning 9 varianti birdan):**
1. Kirganda: faqat «Kim?» savoli va uning 3 varianti; o'ngda bo'sh system prompt kartasi.
2. To'g'ri tanlangach → «Kim? — AvtoPizza do'konining yordamchisi ✓» bitta qatorga yig'iladi (`↻` bilan o'zgartiriladi), so'z kartaga tushadi, keyingi savol ochiladi.
3. Xato tanlansa → savol ochiq qoladi, variant yonida ✗ va xato yozuvi; kartada xato so'z ko'rinadi (gap qanday buzilishini o'quvchi ko'radi).
Animatsiya: yo'q.
Olib tashlanadi: Mentordagi «Noto'g'ri variant ham tanlanishi mumkin — ehtiyot bo'ling» (nishon sharti shuni aytadi) · 📜 🏅.

✎ 30.09 QA F-0930-89 (rasm, jamoadagi ikkinchi QA fikri bilan): «3 ta narsa birdaniga kelgan — oynani to'ldirib qo'ygan; bittadan kelsin, bajarilgach yig'ilib ketsin» — 29.09 qoralamasida aynan shunday (Ko'rinish 1–3, A6); «Maslahatchi» → AI, 📜 olingan · yo'riqnoma → system prompt · «Chegara?» → «Nima haqida?» (o'quvchi uchun aniqroq savol) · 🔴 xato variantlar yig'ilgan gapni buzardi: «…hech narsani qisqartirmasin gapir», «…javob bersin gapir», «Sen … Faqat do'kon menyusi haqida gaplashsin» (sen + u-shakl aralash) → variantlar kartadagi «Sen …san. … gapir. …» qolipiga moslandi · «skeleti» → «boshlanadi» · Pitsa Bek → AvtoPizza · to'g'ri variant uchala savolda 1-o'rinda (eslatma 4)

## 6 · Ikki alohida so'rov (case)  `[958]`
- Eyebrow: Sinov · xotira
- Sarlavha: **Ikki xabar — ikki alohida so'rov.**
- Mentor: Bot har mijoz xabarini AI'ga alohida so'rov qilib yuboradi. Aziza avval ismini aytdi, keyin «Ismim nima edi?» deb so'radi. Ikkinchi xabarni yuboring: AI eslaydimi?
- 1-so'rov: mijoz «Salom, mening ismim Aziza.» → AI «Salom, Aziza! Sizga qanday yordam beray?»
- Tugma: ▶ Ikkinchi xabarni yuborish → ✓ Yuborildi
- 2-so'rov (holati: AI'ga ketdi — faqat shu xabar): mijoz «Ismim nima edi?» → (yozmoqda…) → AI «Kechirasiz, ismingizni bilmayman. Uni menga hali aytmagansiz.»
- Tugma: Javobni ko'rish
- Xulosa: AI ismni bilmadi: 2-so'rovda faqat «Ismim nima edi?» bor edi. Eslashi uchun bot har so'rovga suhbat tarixini — oldingi xabarlarni — qo'shib yuboradi. Tarix uzaysa nima bo'ladi — keyingi ekranda ko'ramiz.
- Tugma: Ikkinchi xabarni yuborish → Davom etish

**Ko'rinish:** hozirgidek — chapda 1-so'rov va tugma; o'ngda 2-so'rov tugma bosilgach, javob «Javobni ko'rish» dan keyin; xulosa oxirida.
Animatsiya: HA — har so'rov kartasi ostida «bot → AI» strelkasi chiziladi; ikki so'rov orasida chiziq yo'q (ular bog'lanmaganini ko'rsatadi).
Olib tashlanadi: 🧭 😅 · «Menga har safar hammasini qaytadan aytishingiz kerak» (AI buni o'zi bilmaydi — u faqat oldida turgan matnni ko'radi).

✎ 🔴 FAKT: eski Mentor «Bir suhbatda ikki marta yozamiz», keyin AI ikkinchi xabardayoq ismni unutadi. Texnik jihatdan noto'g'ri: bir suhbatda tarix yuboriladi va AI eslaydi; 7-ekranga ham zid edi (u yerda 4 xabar sig'adi). Endi sabab aniq: ikkinchi so'rovda tarix yo'q · chat sarlavhalari «Maslahatchi» → «1-so'rov / 2-so'rov» (**KOD**) · «Lekin muammo battarroq» → oddiy ko'prik · Aziz → Aziza

## 7 · Kontekst oynasi sinovi (markaziy #2)  `[1029]`
- Eyebrow: Markaziy · kontekst oynasi
- Sarlavha: **Suhbat tarixi uzaysa nima bo'ladi?**
- Mentor: Endi bot har so'rovga suhbat tarixini qo'shadi. AI bir so'rovda ko'ra oladigan matn hajmi kontekst oynasi deyiladi. Xabarlarni birma-bir yuboring va oynani kuzating.
- Oyna: yorliq «kontekst oynasi · sinovda 4 ta xabar sig'adi» · ostida: «Haqiqiy AI'da oyna ancha katta, lekin cheksiz emas.» · bo'sh holatda: «bo'sh»
  - Xabarlar navbati: Salom! · Ismim: Aziza · Bugun ob-havo yaxshi ekan · Menga Margarita kerak · Manzil: Chilonzor 5-kvartal
  - 4 ta to'lganda: Oyna to'ldi — keyingi xabar kelsa, bot eng eskisini tarixdan olib tashlaydi
  - 5-xabardan keyin: «Salom!» — oynadan chiqdi
- Tugma: ▶ Xabar yuborish (N/5) → ✓ Hammasi yuborildi
- Savol (hammasi yuborilgach, variantlar bilan birga chiqadi): **Keyingi xabar kelsa, qaysi muhim ma'lumot oynadan chiqib ketadi?**
  - Bugun ob-havo yaxshi ekan
  - ✔ Ismim: Aziza
  - Manzil: Chilonzor 5-kvartal
- To'g'ri: «Ismim: Aziza» endi eng eski xabar — keyingi xabar kelsa, u oynadan chiqadi.
- Xato: Oynadan birinchi eng eski xabar chiqadi. Hozir eng eskisi — «Ismim: Aziza»: keyingi xabarda AI ismni bilmay qoladi. Shuning uchun muhim ma'lumot bazaga saqlanadi va har so'rovda system prompt'ga qo'shiladi.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Tugma: Sinovni bajaring → Davom etish

**Ko'rinish:** chapda oyna va tugma; o'ng ustun (savol yorlig'i + 3 variant) hamma xabar yuborilgach chiqadi (**KOD:** hozir yorliq boshidan turadi). Natija yozuvi bitta.
Animatsiya: HA — 5-xabar kelganda eng eski xabar oynadan tashqariga suriladi va xiralashadi (hozirgi `fell` harakati; oynadan chiqishning o'zi).
Olib tashlanadi: ⚠️ 🍂 📓 · «stol usti / varaq / stol to'ldi».

✎ 30.09 16-savol: to'g'ri javob izohi bitta gap; bazaga saqlash haqidagi davomi 8-savol izohlari va 6-kartochkada bor · 30.09 QA F-0930-90 (rasm): «shu o'yin sal chalkash» — eski savol «qaysi ma'lumot daftarga yozilishi kerak edi?» edi, to'g'ri javob esa muhimligi uchun emas, eng eskisi bo'lgani uchun tanlanardi (savol va javob boshqa-boshqa narsani so'rardi). 29.09 da savol «keyingi xabar kelsa, qaysi ma'lumot oynadan chiqadi?» bo'ldi — javob ko'rgan narsadan chiqadi; «stol usti» metaforasi olingan · stol usti → kontekst oynasi · daftar → baza (F-0929-51) · 🔴 FAKT: «faqat oxirgi bir necha xabar sig'adi» (kartochka, recap) — haqiqiy modellarda oyna ancha katta; sinovdagi 4 — soddalashtirish, endi shunday aytiladi · kim olib tashlaydi — aniqlandi: bot (kod) tarixni qisqartiradi, AI «unutmaydi» · savol halolligi: eski savol «qaysi ma'lumot daftarga yozilishi kerak edi?» — «Manzil» ham muhim, u ham saqlanishi kerak (qisman to'g'ri variant). Yangi savol «qaysi biri oynadan chiqib ketadi» — javobi bitta · ✔ o'rni (2-variant) saqlandi · Aziz → Aziza, manzil 1-darsdagi kabi

## 8 · 2-savol ✅  `[1068]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Suhbat tarixi kontekst oynasiga sig'may qolsa, nima bo'ladi?**
  - ✔ Eng eski xabarlar chiqadi va AI ularni ko'rmaydi
  - AI butunlay ishlashdan to'xtab qoladi
  - Bot yangi xabarlarni qabul qilmay qo'yadi
  - Eski xabarlar o'zi bazaga yozilib qoladi
- To'g'ri: Oyna cheklangan: odatda eng eski xabarlar chiqadi va AI ularni endi ko'rmaydi.
- Xato izohlari:
  - AI ishlashda davom etadi — faqat eski xabarlarni endi ko'rmaydi.
  - Yangi xabarlar qabul qilinadi — oynadan eskisi chiqadi.
  - O'zi hech narsa saqlanmaydi: muhim ma'lumotni bazaga bot kodi yozadi.
  - (umumiy) Oyna to'lsa, eng eski xabarlar chiqadi va AI ularni ko'rmaydi.

✎ «Stol usti (kontekst oynasi)» → «kontekst oynasi» · «Maslahatchi butunlay o'chib qoladi» → «AI butunlay ishlashdan to'xtab qoladi» · «avtomatik daftarga» → «o'zi bazaga» · variantlar tenglashtirildi

## 9 · Temperature (markaziy #3)  `[1087]`
- Eyebrow: Markaziy · temperature
- Sarlavha: **Temperature: javob qat'iy bo'lsinmi yoki erkin?**
- Mentor: Temperature — javob qanchalik erkin bo'lishini belgilaydigan son, Gemini'da 0 dan 2 gacha. Bitta savolni — «Bizda qanday pitsalar bor?» — uch marta beramiz. Ikkala qiymatni navbat bilan bosib, javoblarni solishtiring.
- Tugmalar: Past (0.1) · Baland (1.5)
- «AvtoPizza · temperature 0.1» javoblari: «Bizda Margarita, Pepperoni va To'rt pishloq bor.» · «Bizda Margarita, Pepperoni va To'rt pishloq bor.» · «Bizda Margarita, Pepperoni va To'rt pishloq bor.»
- «AvtoPizza · temperature 1.5» javoblari: «Bizda Margarita va Pepperoni bor — qaysi birini tanlaysiz?» · «Bugun Margarita bilan boshlang, Pepperoni ham bor — albatta sinab ko'ring!» · «Menyuda Pepperoni va To'rt pishloq — ikkalasi ham mazali!»
- Savol (ikkalasi ko'rilgach): **Menyuni har safar bir xil va aniq aytish kerak. Qaysi temperature mos?** — ✔ Past (0.1) · Baland (1.5)
- To'g'ri: Past temperature'da javob deyarli bir xil chiqadi — menyu uchun shu mos.
- Xato (Baland): Baland temperature'da javob har safar boshqacha: birida To'rt pishloq bor, boshqasida yo'q. Menyuni har safar bir xil aytish kerak bo'lganda bu noqulay. Baland qiymat reklama matni kabi ijodiy ish uchun qulay.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Tugma: Ikkalasini sinab ko'ring → Davom etish

**Ko'rinish (A6 istisnosi — solishtirish):** kirganda faqat «▶ 0.1 bilan so'rash» tugmasi (asosiy uslub, U1); uning 3 javobi chiqqach tugma «✓ 0.1 sinaldi» qatoriga yig'iladi va «▶ 1.5 bilan so'rash» chiqadi; u ham yig'iladi. Ikkala javob to'plami yonma-yon qoladi, sarlavhasida qiymat (temperature 0.1 / 1.5). Savol va uning ikki varianti — faqat ikkalasi ko'rilgach; ekranda «Past / Baland» tugmalari ikki joyda turmaydi (**KOD:** hozir sinash tugmalari va javob tugmalari bir xil yozuvda, ikki qator bo'lib birdan turadi).
Animatsiya: yo'q.
Olib tashlanadi: Mentordagi «Vaziyat: menyuni har doim bir xil va aniq aytish kerak — qaysi murvat…» (savol yorlig'i aynan shuni so'raydi) · ❄️ 🔥 🍍 🧭.

✎ 30.09 ChatGPT #16–17 **Qisman**: temperature — javob xilma-xilligi sozlamasi; baland qiymatda xato ehtimoli oshishi mumkin, lekin to'qib chiqarishning sababi temperature emas va past qiymat ham to'g'rilikni kafolatlamaydi. Eski demo buni aralashtirardi (1.5 da «ananasli pitsa» paydo bo'lardi) → 1.5 javoblari endi har xil va to'liq emas (birida To'rt pishloq yo'q), to'qib chiqarilgan narsa yo'q; to'qib chiqarish (hallutsinatsiya) — faqat 11-ekranda, temperature'dan alohida · 30.09 QA F-0930-91 (4 rasm): «mavzu nima?» — sarlavhada «Erkinlik murvati» metaforasi mavzuni yashirardi, 29.09 da «Temperature: javob qat'iy bo'lsinmi yoki erkin?» · ❄️ 🔥 🧭 — «emojilar kamaysin», 29.09 da olingan · 🔴 yangi (QA surati): sinash tugmalari «Past (0.1) · Baland (1.5)» va javob tugmalari «Past (0.1) · Baland (1.5)» — bir xil yozuvli ikki qator (bir ma'no — bir blok emas, qaysi biri nima qilishi noaniq) → sinash tugmalari navbat bilan va yig'iladi (Ko'rinish) · erkinlik murvati → temperature; son nima ekani va oralig'i aytildi (0.1 / 1.5 izohsiz edi) · 🔴 FAKT: past javob «Margarita va Pepperoni» edi — 11-ekrandagi haqiqiy menyuda uchta pitsa bor; «to'g'ri» deb ko'rsatilgan javob to'liq emas edi → To'rt pishloq qo'shildi · 🔴 FAKT: ananasli pitsa bu yerda «3 000 so'm», 11-ekranda «30 000 so'm» → 30 000 · 🔴 FAKT: «Past murvat — qat'iy va bir xil» to'g'rilik kafolatidek o'qilardi; past temperature'da ham hallutsinatsiya bo'lishi mumkin → «bir xil — hali to'g'ri degani emas» · «har doim» olindi

## 10 · 3-savol ✅  `[1133]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Temperature baland qilib qo'yilsa, nima bo'ladi?**
  - AI javobni ancha tezroq yozib beradi
  - Javoblar har safar aynan bir xil chiqadi
  - Bot internetni ancha ko'proq sarflaydi
  - ✔ Javoblar har safar boshqacha bo'lishi mumkin
- To'g'ri: Baland temperature'da javoblar har safar boshqacha bo'lishi mumkin.
- Xato izohlari:
  - Tezlikka aloqasi yo'q — temperature javob qanchalik erkin bo'lishini belgilaydi.
  - Aksincha: bir xil javob past temperature'da bo'ladi.
  - Internet sarfiga aloqasi yo'q — temperature faqat javob matniga ta'sir qiladi.
  - (umumiy) Baland temperature — xilma-xil javob.

✎ 30.09 ChatGPT #18 **Qabul**: to'g'ri javob temperature'ni to'qib chiqarish bilan bog'lardi → faqat xilma-xillik (9-ekran bilan bir model); ✔ o'rni (D) o'sha, uzunligi boshqalar bilan teng · «Maslahatchi har doim sezilarli darajada tezroq…» → «har doim» olindi · «hatto o'ylab topilishi mumkin» → «ba'zan to'qib chiqarilgan» · variantlar tenglashtirildi (to'g'ri javob eng qisqa, xatolar «sezilarli darajada» bilan uzaytirilgan edi)

## 11 · Faktni tekshirish (markaziy #4)  `[1154]`
- Eyebrow: Markaziy · faktni tekshirish
- Sarlavha: **Faktni tekshiring.**
- Mentor: AI menyu haqida uchta gap aytdi. Har birini haqiqiy menyu bilan solishtiring — buni inglizcha fact-checking deyishadi.
- Yorliq «haqiqiy menyu (bazadan)»: Margarita — 35 000 so'm · Pepperoni — 42 000 so'm · To'rt pishloq — 48 000 so'm
- Yorliq «AI javobidagi gaplar» (har qatorda: Rost · To'qib chiqarilgan):
  - Margarita — 35 000 so'm → ✔ Rost
  - Ananasli pitsa — 30 000 so'm → ✔ To'qib chiqarilgan
  - Pepperoni — 42 000 so'm → ✔ Rost
- Hammasi to'g'ri: To'g'ri. «Ananasli pitsa» menyuda yo'q — AI uni o'zi to'qib chiqardi. Bu hallutsinatsiya deb ataladi: AI ishonch bilan aytadi, lekin gap haqiqatga to'g'ri kelmaydi. Bu temperature past bo'lganda ham bo'lishi mumkin — narx va taom nomini menyu bilan solishtiring.
- Xato bo'lsa: Menyuga qarang: Margarita va Pepperoni narxi mos, «Ananasli pitsa» esa menyuda yo'q — AI uni to'qib chiqardi. Bu hallutsinatsiya deb ataladi.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Tugma: Har gapni tekshiring (N/3) → Davom etish

**Ko'rinish (KOD — hozir 3 qatorning 6 tugmasi birdan):** menyu doim ko'rinadi; gaplar bittadan: joriy gap va uning 2 tugmasi ochiq; belgilangach «Margarita — 35 000 so'm · Rost ✓» bitta qatorga yig'iladi, keyingisi ochiladi. Natija-ramka bitta, oxirida.
Animatsiya: HA — gap belgilangach undan menyudagi mos qatorga chiziq chiziladi; «Ananasli pitsa» uchun chiziq chizilmaydi, yonida «menyuda yo'q» chiqadi (mos qator yo'q — bog'lanish ham yo'q).
Olib tashlanadi: ✅ ❌ · «Fact Checker» sarlavhadan (izohsiz inglizcha; nishon nomida qoladi) · «YO'Q» katta harfi · «Har doim shunday tekshiring».

✎ 30.09 20-savol A (foydalanuvchi izohi: «sarlavha qisqa, pastdagi gap Mentorga — ixcham, oddiy»): sarlavha «AI rost aytdimi? Menyu bilan solishtiring.» → «Faktni tekshiring.»; «fact-checking» — Mentorda bir marta; nishon «Fact Checker» shunga bog'landi · 30.09: «Buni hallutsinatsiya deyiladi» → «Bu hallutsinatsiya deb ataladi» (grammatika — o'zim) · temperature bilan chegara aniq aytildi (ChatGPT #16) · ChatGPT #19–20 («yolg'on gapiradi», «har doim tekshiring») — 29.09 da tuzatilgan · 30.09 QA F-0930-92 (rasm): «shuni hamma joyda fact checker deb ketsakchi? maslahatchi to'g'ri kelmayapti» — «Maslahatchi» 29.09 da «AI» bo'lgan; ekranning nomi (Javobni tekshirish / Fact Checker) — 20-savol · «Maslahatchining da'volari» → «AI javobidagi gaplar» · «O'ylab topilgan» → «To'qib chiqarilgan» · hallutsinatsiya atamasi shu yerda birinchi marta, izoh bilan · «To'rt pishloqli» → «To'rt pishloq» (1-darsdagi menyu nomi) · «har doim» olindi

## 12 · AvtoPizza suhbati (hayotiy)  `[1201]`
- Eyebrow: Hayotiy · AvtoPizza
- Sarlavha: **AvtoPizza boti AI bilan: buyurtmagacha bitta suhbat.**
- Mentor: Suhbatni qadam-baqadam oching. O'ng tomonda — AI'ga har so'rovda nima borishi.
- Suhbat (AvtoPizza · har bosishda bitta juftlik):
  1. mijoz «Salom! Juda ochman, nima tavsiya qilasiz?» → «Salom! Menyudan Pepperoni'ni tavsiya qilaman — go'shtli va to'yimli. Yoki klassik Margarita?»
  2. mijoz «Achchiq narsani yoqtirmayman» → «Unda Margarita sizga mos: achchiq emas, yumshoq pishloqli. Buyurtma qilamizmi?»
  3. mijoz «Ha, bittasini olaman» → «Ajoyib! Margarita — 35 000 so'm. Manzilingizni yuboring, buyurtmani rasmiylashtiramiz.»
- Tugma: ▶ Suhbatni boshlash · Keyingi savol → · ✓ Buyurtma qabul qilindi
- Karta «So'rov ichida»:
  - System prompt: «Sen AvtoPizza do'konining yordamchisisan. Qisqa, samimiy, aniq gapir. Faqat menyu va buyurtma haqida gaplash.»
  - Menyu (bazadan): Margarita — 35 000 so'm · Pepperoni — 42 000 so'm · To'rt pishloq — 48 000 so'm
  - Suhbat tarixi: shu suhbatdagi oldingi xabarlar
- Xulosa: 3-xabarda mijoz «bittasini» dedi — AI bu Margarita ekanini suhbat tarixidan bildi. Narx esa AI'ning o'zidan emas, bazadagi menyudan olindi.
- Tugma: Suhbatni davom ettiring (N/3) → Davom etish

**Ko'rinish:** hozirgidek — xabarlar navbat bilan; «So'rov ichida» kartasi boshidan turadi (tushuntirish, natija emas); xulosa 3/3 dan keyin.
Animatsiya: «yozmoqda…» (0-ekrandagi bilan bir xil); chizish yo'q.
Olib tashlanadi: 😅 😊 🍕 🧀 🎉 📍 📜 · «qurollangan» · «Aniq yo'riqnoma + tekshirish = ishonchli Maslahatchi» (formula; karta va xulosa shuni aniqroq aytadi).

✎ Pitsa Bek → AvtoPizza · sarlavha «javob endi aniq va ishonchli» — natijani oldindan e'lon qilardi → suhbat nima ekanini aytadi · «Och qornimga nima maslahat berasiz?» → adabiy shakl · karta: system prompt, menyu va suhbat tarixi alohida ko'rsatildi (6–7-ekrandagi tushunchalar shu yerda birlashadi) · xulosa: «to'qib chiqarilmagan — narxlar ham haqiqiy menyudan» → aniq sabab (narx bazadan, «bittasi» tarixdan) · «Zo'r tanlov» → «Ajoyib» · «yo'lga qo'yildi» → «qabul qilindi»

## 13 · AI botga qanday ulanadi  `[1246]`
- Eyebrow: Amalda · AI API
- Sarlavha: **AI botga qanday ulanadi?**
- Mentor: Bot AI bilan AI API orqali gaplashadi — Telegram bilan Bot API orqali gaplashgani kabi. Kodni ko'rib chiqing.
- Kod oynasi, yorliq «bot.js · soddalashtirilgan»:
  ```js
  // /start va «Menyu» — oddiy handlerlar. Qolgan erkin savol — AI'ga:
  bot.on('text', async (ctx) => {
    const tarix = await suhbatTarixi(ctx.from.id) // bazadan: oldingi xabarlar
    const javob = await soraAI({
      systemPrompt,             // kim · qanday · nima haqida + menyu
      tarix,
      xabar: ctx.message.text,
      temperature: 0.2,
    })
    await ctx.reply(javob)
  })
  ```
  Kod ostida: `suhbatTarixi` va `soraAI` — loyiha kunida AI yordamida yozadigan funksiyalaringiz.
- Kartalar (bittadan gap):
  - **AI API kaliti — .env faylida** — Kodda faqat `process.env.AI_API_KEY` turadi.
  - **Har so'rov hisobga olinadi** — AI API odatda matn hajmiga qarab haq oladi, shuning uchun oddiy ishlarni handler bajaradi.
- Tugma: Tushundim ✓ → ✓ Tushundim
- Pastki tugma: Kodni o'qing → Davom etish

**Ko'rinish:** chapda kod oynasi (mono shrift, sarlavha va kartalardan ajralib turadi), o'ngda ikki qisqa karta va «Tushundim». Kod — faqat o'qish uchun. Matn uzun bo'lmasin: karta — bitta gap (10-savol izohi: «matnlar juda uzun, hammasi bir xil ko'rinadi»).
Animatsiya: yo'q.
Olib tashlanadi: «Bugungi qoidalar — qisqacha: 📜 aniq yo'riqnoma → 📓 muhimini daftarga → 🎚️ murvat → 🔍 tekshirish» kartasi (final tartibiga zid edi) · «Ana shu 4 qoida bilan Maslahatchi ishonchli yordamchiga aylanadi» ramkasi · 🔑 💰 📍 · kartalardagi ikkinchi-uchinchi gaplar (.gitignore, bepul foydalanish, tarix narxi — 30.09 da qisqardi) (**KOD**).

✎ 30.09 10-savol A: kod oynasi qabul qilindi («taklif» belgisi olindi); foydalanuvchi izohi — matnlar juda uzun va bir xil ko'rinadi → sarlavha qisqardi, Mentor bir gap, har karta bitta gap, kod mono shriftda alohida (**KOD**) · QA F-0930-93 (emoji) — 29.09 da · 🔴 FAKT (DAVOM 7, 29.09): 13-ekran tartibi 15-final tartibiga zid edi → karta olindi

## 14 · 4-savol ✅  `[1272]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **AI «Bizda ananasli pitsa bor» deb yozdi. Nima qilish kerak?**
  - Ishonib, mijozga shundayligicha yuborish
  - ✔ Menyu bilan solishtirib, tekshirib ko'rish
  - Mijozdan savolni qaytadan yozishni so'rash
  - Botni to'xtatib, qayta ishga tushirish
- To'g'ri: AI menyuda yo'q narsani ham aytishi mumkin — narx va nomni menyu bilan solishtiring.
- Xato izohlari:
  - Tekshirmasdan yuborish xavfli: mijoz menyuda yo'q pitsani buyurtma qiladi.
  - Muammo mijozning savolida emas, AI javobida. Javob menyu bilan tekshiriladi.
  - Qayta ishga tushirish javobni to'g'rilamaydi — AI yana shunday yozishi mumkin.
  - (umumiy) AI javobidagi narx va taomni menyu bilan solishtiring.

✎ «Darhol ishonib» → «darhol» olindi · «Erkinlik murvatini butunlay o'chirib qo'yish» → «Mijozdan savolni qaytadan yozishni so'rash» (temperature'ni o'chirib bo'lmaydi; bundan tashqari 9-ekrandan keyin «pasaytirish» varianti qisman to'g'ri ko'rinardi) · «Botni darhol butunlay o'chirish» → «to'xtatib, qayta ishga tushirish» · «har doim» olindi

## 15 · Handler tartibini yig'ing ✅ (final)  `[1296]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: handler AI bilan qanday ishlashini tartibga soling.**
- Mentor: Mijoz AvtoPizza botiga erkin savol yozdi. Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash chiqadi; id va to'g'ri tartib o'zgarmaydi — faqat matn): Mijoz xabari keladi · Xabarga system prompt va suhbat tarixi qo'shiladi · AI API javob yozadi · Javob menyu bilan tekshiriladi · Javob yuboriladi va tarixga yoziladi
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- To'g'ri (bitta ramka): ✓ Tartib to'g'ri: xabar keladi → system prompt va tarix qo'shiladi → AI javob yozadi → javob tekshiriladi → mijozga ketadi. Keyin bot 1-darsdagi siklga qaytadi: yana keyingi hodisani kutadi.
- Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola: Qisqa takrorlash — mavzuni yana bir ko'rish (birinchi xatodan keyin)
- Tugma: Tartibni yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi). Natija yozuvi bitta: hozir to'g'rida ikkita («Xavfsiz ishlash sikli tayyor!» + «Tartib: …»), xatoda ikkita («⚠️ Tartib xato — qayta joylang.» + pastdagi yozuv) chiqadi → bittadan qoladi (**KOD**). «Qisqa takrorlash» tugmasi — RECAPS[15] bor, ochadigan tugma yo'q (**KOD**).
Animatsiya: HA — to'g'ri yig'ilgach 1-qadamdan 5-qadamgacha strelkalar birma-bir chiziladi (xabarning handler ichidagi yo'li); faqat to'g'ri javobdan keyin.

✎ 🔴 Final mazmuni: «Aniq yo'riqnoma yozish → Murvatni sozlash → Javob olish → Tekshirish → Muhimini daftarga yozish» → handler ichidagi 5 qadam. Sabab: (1) eski tartibda 1- va 2-bo'lak o'rin almashsa ham mantiqli edi (ikkalasi ham sozlama — test halolligi); (2) 13-ekran bilan zid edi; (3) «sikl» 1-darsda botning ish sikli (A2). Yangi tartibda har qadam oldingisiga bog'liq — javob bitta. Id va tartib o'zgarmadi, ball kaliti buzilmaydi (eslatma 3) · Mentor «avval nima yoziladi, so'ng nima sozlanadi, oxirida nima tekshiriladi?» — tartibni aytib qo'yardi → olindi · ⚠️ olindi

## 16 · Amaliyot · AI chat  `[2116]`
- Eyebrow: Amaliyot · AI chat · joy: «kompyuteringizda»
- Sarlavha: **O'z botingiz uchun system prompt yozing**
- Topshiriq: gemini.google.com'ni oching. O'z botingiz uchun system prompt yozing: u kim, qanday gapiradi, nima haqida gapiradi. Oddiy chatda system prompt birinchi xabar qilib yuboriladi — botda esa u kodda alohida beriladi. Keyin AI chegarada qolishini va to'g'ri javob berishini tekshirasiz.
- Umumiy matn: Topshiriqni o'z kompyuteringizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- Qadamlar:
  1. gemini.google.com'ni oching va yangi chat boshlang.
  2. Birinchi xabarga system prompt yozing: `Sen ... yordamchisisan. ... gapir. Faqat ... haqida gaplash.` Oxiriga menyu yoki o'z ma'lumotlaringizni qo'shing.
  3. Mavzuga oid savol bering va javob system prompt'ga mos kelganini tekshiring.
  4. Mavzudan tashqari savol bering (masalan, «Ertaga ob-havo qanday?»). AI chegarada qoladimi?
  5. Menyudagi narxni so'rang va o'zingiz yozgan menyu bilan solishtiring. Mos kelmasa — bu hallutsinatsiya.
  6. aistudio.google.com'ni oching (o'sha Gemini, o'sha Google akkaunti). Temperature'ni 0.1 qilib bitta savolni ikki marta bering, keyin 1.5 qilib yana ikki marta — javoblarni solishtiring.
- Tugmalar: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting · «Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.» · pastda: Avval bajaring → Davom etish

**Ko'rinish (KOD):** qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi.
Animatsiya: yo'q.
Olib tashlanadi: 📜 ✅ · «ustoz» (2 joyda).

✎ 30.09 7-savol A: temperature sinovi qaytdi — 6-qadam, aistudio.google.com'da (gemini.google.com'da temperature sozlanmaydi; AI Studio — o'sha Gemini, sozlama bor) · 🔴 FAKT (DAVOM 6–7): «AI chat (masalan, Claude yoki ChatGPT)», «`claude.ai`» → gemini.google.com (sinfdagi vosita) · 🔴 FAKT: «Imkoni bo'lsa, murvat (temperature)ni past/baland qilib…» — gemini.google.com'da temperature sozlanmaydi → olindi (eslatma 6) · «Xuddi shu savolni yana bir marta yuboring — javoblarni solishtiring» → olindi (system prompt'ni tekshirmaydi); o'rniga chegara (4) va hallutsinatsiya (5) sinovi — darsning o'zi · «Maslahatchi» → «AI chat» · «ustoz» → «Mentor» · «Zo'r!» olindi

## 17 · Natijalar (podium)  `[1863]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «sessiya» so'zi — B-6.)

## 18 · Takrorlash (kartochkalar)  `[2144]`
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| AI'ga yuboriladigan so'rov matni nima deyiladi? | Prompt | Aniq prompt — foydali javob |
| AI'ga u kim ekanini, qanday va nima haqida gapirishini aytadigan doimiy ko'rsatma nima? | System prompt | Har so'rovdan oldin beriladi: kim · qanday · nima haqida |
| Bot AI'ga qo'shib yuboradigan oldingi xabarlar nima deyiladi? | Suhbat tarixi | AI API oldingi so'rovni o'zi eslamaydi |
| AI bir so'rovda ko'ra oladigan matn hajmi nima deyiladi? | Kontekst oynasi | Katta, lekin cheksiz emas |
| Tarix oynaga sig'masa, qaysi xabar birinchi chiqib ketadi? | Eng eski xabar | AI uni endi ko'rmaydi |
| Ism, manzil kabi muhim ma'lumot yo'qolmasligi uchun qayerda saqlanadi? | Bazada | Har so'rovda system prompt'ga qo'shiladi |
| Javob qanchalik erkin bo'lishini qaysi sozlama belgilaydi? | Temperature | Gemini'da 0 dan 2 gacha |
| Temperature past bo'lsa, javob qanday bo'ladi? | Deyarli bir xil | Menyu, narx kabi aniq ma'lumot uchun |
| Temperature baland bo'lsa, javob qanday bo'ladi? | Xilma-xil | Ijodiy matn uchun qulay; to'g'rilikni esa tekshirish ko'rsatadi |
| AI ishonch bilan aytgan, lekin haqiqatga to'g'ri kelmaydigan javob nima deyiladi? | Hallutsinatsiya | Masalan, menyuda yo'q «ananasli pitsa» |
| AI aytgan narxni qanday tekshirasiz? | Menyu bilan solishtiraman | Narx bazadagi menyudan olinadi |
| AI API kaliti qaysi faylda saqlanadi? | .env faylida | Kodda faqat `process.env.AI_API_KEY` ko'rinadi |

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ …)

✎ 30.09 ChatGPT #28: 9-kartochka «Har safar boshqacha … to'qib chiqarish ehtimoli ko'proq» → «Xilma-xil … to'g'rilikni tekshirish ko'rsatadi» · Maslahatchi / Topshiriq / Yo'riqnoma / Stol usti / Daftar / Erkinlik murvati → haqiqiy atamalar (A1) · 1-kartochka «sizni eslamaydigan yordamchi → Maslahatchi» → «Suhbat tarixi» (3-kartochka: eslamaslikning texnik sababi va yechimi) · 🔴 FAKT: «kontekst oynasi — faqat oxirgi bir necha xabar sig'adi» → «katta, lekin cheksiz emas» · «Maslahatchi uni butunlay unutadi» → «AI uni endi ko'rmaydi» · «ism va buyurtma daftarda saqlanadi» → «bazada» (4-dars) · «Qat'iy va bir xil» → «Deyarli bir xil»

## 19 · Yakun  `[2157]`
- Eyebrow: Tayyor · belgi: ✓ Bot javobni AI'dan oladi
- Sarlavha: **Endi botingiz javobni AI'dan oladi — va siz uni boshqarasiz.**
- Endi siz bilasiz:
  - AI API oldingi so'rovni eslamaydi — bot unga system prompt va suhbat tarixini har so'rovda yuboradi
  - System prompt AI'ga u kim ekanini, qanday va nima haqida gapirishini aytadi
  - Kontekst oynasi cheklangan — muhim ma'lumot tarixda emas, bazada saqlanadi
  - Temperature: past — deyarli bir xil javob, baland — xilma-xil. Javob to'g'riligini temperature emas, tekshirish ko'rsatadi
  - AI hallutsinatsiya qilishi mumkin — narx va faktni menyu bilan solishtiring
- Uyga vazifa:
  - **Yozing** — o'z botingiz uchun system prompt yozing: kim, qanday gapiradi, nima haqida gapiradi
  - **Ajrating** — botingizga keladigan 5 ta xabarni yozing va har biri yoniga belgilang: unga handler javob beradimi yoki AI
  - **Tekshiring** — gemini.google.com'da system prompt'ingizni sinang va bitta faktni o'z ma'lumotingiz bilan solishtiring
- Uyga vazifa · Amaliy topshiriqni bajarish →
- Keyingi dars — **«Loyiha kuni: bot + DB + AI»**. Handler, baza va AI'ni bitta botga yig'asiz va uni kompyuteringiz yopiq bo'lsa ham ishlaydigan serverga joylaysiz.
- Arena tugmasi · Mentorni kuting · Nishonlaringiz — N/4 · Orqaga · Qaytadan · Yakunlash ✓

Olib tashlanadi: «Endi Maslahatchi siz uchun boshqariladigan vosita» · 🧭 📜 📝 🚀 🏅 ⏳ (matn oldidagi) · «ESLAMAYDI» katta harfi.

✎ 🔴 FAKT (DAVOM 6): «Keyingi dars — Botjon o'z javobidan fikr-mulohaza (fidbek) asosida o'zini yaxshilashni o'rganadi» → App.jsx bo'yicha keyingi dars m5-07 «Loyiha kuni: bot + DB + AI» (fidbek — 9-dars) · 🔴 FAKT: uyga vazifa «bir xil savolni ikki marta bering va Maslahatchi eslay olmasligini ko'ring» — oddiy chatda AI bitta suhbat ichida eslaydi, o'quvchi aksini ko'radi → «Ajrating» (handler yoki AI — 7-darsning birinchi ishiga tayyorgarlik) · «Botjon o'ylay boshladi» → «Bot javobni AI'dan oladi» · «har doim» olindi

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Prompt Writer** (hozir Rule Writer) — AvtoPizza boti uchun system prompt yozdingiz (5-ekran)
- **Context Keeper** (hozir Table Manager) — Oynadan chiqib ketadigan muhim ma'lumotni topdingiz (7-ekran)
- **Temperature Tuner** (hozir Dial Master) — Menyu uchun to'g'ri temperature tanladingiz (9-ekran)
- **Fact Checker** — To'qib chiqarilgan pitsani menyu bilan tutdingiz (11-ekran)
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting

✎ «Table Manager» — daftar-metaforaga bog'langan edi · «Muhim ma'lumotni daftarga ko'chirdingiz» — 7-ekranda o'quvchi ko'chirmaydi, topadi · 📓 medal belgisi → mavzuga mos belgi

**Test ekranlarining umumiy yozuvlari:** Jonli dars — bitta urinish, o'ylab bosing! · Javob tanlang · Qaytadan urinib ko'ring · ✓ To'g'ri javob: X — … · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · Qisqa takrorlash — mavzuni yana bir ko'rish
✎ ⚡ 📨 📖 olindi

**Podium savol yorliqlari:** 1 — Prompt · 2 — Kontekst oynasi · 3 — Temperature · 4 — Faktni tekshirish · 5 — Handler tartibi

**Qisqa takrorlash oynalari (5)** — umumiy yozuvlar: Qayta tushuntirish · N-karta · ← Oldingi · Keyingisi → · Sinfga savol: · ✓ Tushunarli — davom etamiz · Yopish. Karta belgisi (`ic`) o'rniga kod misoli (U3), kodsiz kartada raqam; «Belgilar» qatori ro'yxat ostida:
1. (4) **Aniq prompt — foydali javob:** AI promptni o'qiydi — AI faqat promptda yozilganini ko'radi, qolganini o'zi taxmin qiladi. · Noaniq prompt — «Yordam bering» dan AI nima kerakligini bilmaydi va aniqlashtiruvchi savol beradi. · Aniq prompt — kim uchun va nima kerakligi yozilsa, javob foydali bo'ladi. · Sinfga savol: «Yordam bering» promptini qanday aniqroq qilasiz?
2. (8) **Kontekst oynasi:** Oyna cheklangan — AI bir so'rovda ma'lum hajmdagi matnni ko'radi: system prompt, suhbat tarixi va yangi xabar shunga sig'ishi kerak. · Eng eskisi chiqadi — tarix uzaysa, bot eng eski xabarlarni olib tashlaydi va AI ularni endi ko'rmaydi. · Yechim — baza — ism, manzil kabi muhim ma'lumot bazaga saqlanadi va har so'rovda system prompt'ga qo'shiladi. · Sinfga savol: Tarix uzaysa, qaysi xabar birinchi chiqib ketadi?
3. (10) **Temperature:** Past — qat'iy — temperature past bo'lsa, AI deyarli bir xil javob beradi; aniq ma'lumot uchun shu tanlanadi. · Baland — erkin — baland bo'lsa, javob har safar boshqacha; ijodiy matn uchun qulay. · To'g'rilikni kafolatlamaydi — past qiymatda ham javob menyu bilan tekshiriladi. · Sinfga savol: Menyuni bir xil aytish uchun qaysi temperature tanlanadi?
4. (14) **Faktni tekshirish — hallutsinatsiya:** Ishonchli ohang — AI noto'g'ri javobni ham ishonch bilan yozadi. · To'qib chiqarilgan fakt — «ananasli pitsa» kabi menyuda yo'q narsani ham aytishi mumkin; bu hallutsinatsiya. · Yechim — manba bilan solishtirish — narx va taom nomi bazadagi menyu bilan solishtiriladi. · Sinfga savol: AI javobidagi qaysi ma'lumotni albatta tekshirish kerak?
5. (15) **Handler AI bilan: 5 qadam:** Avval — xabar va kontekst — mijoz xabari keladi, bot unga system prompt va suhbat tarixini qo'shadi. · Keyin — AI javobi — AI API shu hammasini o'qib, javob yozadi. · Oxiri — tekshirish va yuborish — javob menyu bilan tekshiriladi, keyin mijozga ketadi va tarixga yoziladi. (Xabar → System prompt + tarix → AI javobi → Tekshirish → Yuborish) · Sinfga savol: Nega javob yuborishdan oldin tekshiriladi?
- Belgilar (U3): 1-oyna — 1 · 2 · 3 | 2-oyna — 1 · 2 · 3 | 3-oyna — `temperature: 0.1` · `temperature: 1.5` · 3 | 4-oyna — 1 · 2 · 3 | 5-oyna — `ctx.message.text` · `soraAI({ systemPrompt, tarix, xabar })` · `ctx.reply(javob)`

✎ 30.09: RECAPS belgilari — U3 (QA F-0930-80, 5-dars) · 1-oyna yangi 1-savolga moslandi · «Stol usti / varaq / daftar» → atamalar · 5-oyna yangi finalga moslandi (hozir ochib bo'lmaydi — KOD 13) · 📚 🙈 📜 🗂️ 🍂 📓 ❄️ 🔥 ⚠️ 🧭 🍍 🔍 🎚️ 🗣️ olindi

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. AI'ga system prompt berilmasa, u mijozga qanday javob beradi? Umuman javob bermay, jim qoladi · ✔ Umumiy, mavzudan chetga chiqqan javob · Faqat «tushunmadim» deb yozadi · Bot o'zi o'chib, qayta yonadi
2. System prompt nimani belgilaydi? AI'ning javob yozish tezligini · Botning rangi va shriftini · Server joylashgan shaharni · ✔ AI'ning xulqi va chegarasini
3. Prompt nima? ✔ AI'ga yuboriladigan so'rov matni · Botning xatolar jurnali · AI API'ning internet manzili · Telegram kanalining nomi
4. Kontekst oynasi nima? AI'ning javob yozish tezligi · Botning Telegram'dagi chat oynasi · ✔ AI bir so'rovda ko'radigan matn hajmi · Bazadagi jadvallar soni
5. Suhbat tarixi oynaga sig'masa, qaysi xabar birinchi chiqib ketadi? Eng yangi xabar · ✔ Eng eski xabar · Eng qisqa xabar · Tasodifiy bir xabar
6. Mijoz ismi yo'qolmasligi uchun bot nima qiladi? ✔ Ismni bazaga saqlab, promptga qo'shadi · Kontekst oynasini o'zi kattalashtiradi · Temperature'ni pastroq qilib qo'yadi · AI'ni har safar qayta ishga tushiradi
7. Temperature past bo'lsa (masalan, 0.1), javob qanday bo'ladi? Har safar butunlay boshqacha · Har safar xato chiqadi · Juda uzun va batafsil · ✔ Qat'iy va deyarli bir xil
8. Temperature baland bo'lsa (masalan, 1.5), menyu uchun nima noqulay? Bot butunlay to'xtab qoladi · ✔ Javob har safar boshqacha chiqadi · Internet uzilib qoladi · API kaliti oshkor bo'ladi
9. Menyuni har safar bir xil va aniq aytish kerak. Qaysi temperature mos? Baland (1.5) · O'rtacha, xohlagancha · ✔ Past (0.1) · Har so'rovda almashtirib
10. AI «Bizda ananasli pitsa bor» dedi, menyuda esa bunday pitsa yo'q. Bu nima? To'g'ri javob, hammasi joyida · Telegram Bot API'ning xatosi · API kalitining oshkor bo'lishi · ✔ Hallutsinatsiya, tekshirish kerak
11. AI javobidagi narxni qachon tekshirish kerak? ✔ Mijozga yuborishdan oldin · Hech qachon, AI adashmaydi · Faqat temperature past bo'lsa · Faqat mijoz shikoyat qilsa
12. AI API kaliti qayerda saqlanadi? bot.js kodining ichida, ochiq holda · Mijozga chatda yuboriladi · ✔ .env faylida, kodda emas · Telegram profil sozlamasida
✎ 01.10 (F-1001-53, razrabotka): 2, 3, 12-savollarda bitta xato variant `lint:tell` uchun o'zgardi — atama (AI, API, bot.js) faqat to'g'ri variantda turgan edi; ✔ o'rni o'sha.

✎ 30.09 ChatGPT #16: 8-savol «baland temperature'da qanday xavf — AI to'qib chiqarishi mumkin» → «menyu uchun nima noqulay — javob har safar boshqacha» (✔ o'rni B o'sha) · 🔴 4-savol aylanma edi («nima uchun cheklangan?» → «Joyi cheklangan») → «Kontekst oynasi nima?» · 6-savol: «Uni 📓 daftarga yozib qo'yish» → «bazaga saqlab, promptga qo'shadi» (texnik yechim) · 8-savol: «Internet butunlay va qaytarilmas tarzda uzilib qoladi» — eng uzun xato variant, qisqartirildi · 10-savol: «xizmat oynasining jiddiy texnik xatoligi» → «Telegram Bot API'ning xatosi» (A1); to'g'ri variantdagi tire olindi · 11-savol: «Har doim tekshirish kerak» → «Mijozga yuborishdan oldin» (qat'iy gap; finaldagi tartib bilan bir xil) · 12-savol: to'g'ri variant eng uzun va izohli edi («maxfiy, git'ga tushmaydi») → tenglashtirildi · 1, 2-savol: «Maslahatchi», «📜 Yo'riqnoma» → atamalar

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — ikkinchi «Mijoz» chati olinadi, norozi xabar bot chatiga tushadi; savol va variantlar tugma bosilgandan keyin chiqadi; javob izohi tanlovga qarab ikki xil («Aynan!» / «Qiziq fikr!»); chat sarlavhasi «AvtoPizza».
2. s1 — preview chat, `sk-info` va `GearPanel` olinadi; o'rniga xabar → handler → AI API → javob chizmasi (strelkalar chiziladi), keyin 4 qadam birma-bir; mobil tugma «↩ Chizmani ko'rish».
3. s2 — `MASLAHATCHI_FACTS` matni (2-karta yangi); xulosa `frame-success` olinadi.
4. s3 — o'ng tugma chap javobdan keyin chiqadi; `PromptCard who` → «prompt».
5. s4 — savol, variantlar, izohlar va `questionText` yangi (✔ = 2 o'zgarmaydi); s8, s10, s14 — matn; `RECAPS` 4/8/10/14.
6. s5 — `YR_SLOTS` navbatli ochilish (savol → tanlov → ✓ qator → keyingi); variant matni kartadagi qolipga moslanadi; (ixtiyoriy, eslatma 4) `right` o'rinlari aralashtiriladi.
7. s6 — chat sarlavhalari «1-so'rov / 2-so'rov», 2-so'rov holati; har so'rovda «bot → AI» strelkasi.
8. s7 — `DESK_MSGS` (Aziza, 5-kvartal), oyna yorliqlari; o'ng ustun yorlig'i variantlar bilan birga chiqadi; xato matni bitta.
9. s9 — «Past» → «Baland» navbat; `DIAL_REPLIES` (To'rt pishloq, 30 000); tugmalardagi emoji.
10. s11 — gaplar navbat bilan; belgilangach menyu qatoriga chiziq («menyuda yo'q» holati); `MENU_REAL` → «To'rt pishloq».
11. s12 — `STEPS` matni; karta «So'rov ichida» (system prompt · menyu · suhbat tarixi); xulosa.
12. s13 — o'ng ustundagi «Bugungi qoidalar» kartasi va xulosa ramkasi olinadi; nav yorlig'i «Tushunding ✓» → «Kartalarni o'qing»; (taklif, eslatma 2) kod oynasi.
13. s15 — `SAFE_CYCLE` yorliqlari (id va tartib o'zgarmaydi); `dd-done` + `frame-success` → bitta ramka; `dd-wrong` + `dd-pool-empty` → bitta xato yozuvi; RECAPS[15] ochish tugmasi (birinchi xatodan keyin, `QuestionScreen` dagi kabi); to'g'ri yig'ilgach strelkalar.
14. s16 — `ScreenBotPractice` task/checklist; `ScreenLivePractice` checklist navbat bilan (bu darsdagi nusxa); «ustoz» → «Mentor».
15. s18–19 — `BOT_FLASHCARDS`, `RECAP`, `HOMEWORK`, done-chip, sarlavha, keyingi dars qatori.
15b. 30.09 javoblari: 11-ekran nomi va Mentori (20-savol A), podium yorlig'i, 4-oyna sarlavhasi; 13-ekran — kod qabul, matn qisqa (10-savol A); 16-ekran 6-qadam — aistudio (7-savol A); 5-ekran variantlari aralash, nishon sharti variant matni bo'yicha (4-savol A); test izohlari bitta gap (16-savol).
15a. Butun dars — UI qoidalari U1–U3: harakat tugmalari bitta asosiy uslubda; ochiladigan kartalarda `›` / `✓`; 9-ekran sinash tugmalari navbat bilan va yig'iladi (javob tugmalari bilan ikki qator bo'lmaydi); `TgChat` oraliqlari; RECAPS `ic` → kod misoli.
16. Butun dars — emoji A4 (`npm run lint:emoji`): `TgChat` `ava` va standart sarlavha («Botjon», 🤖), `AchRule` 🏅, `RecapOverlay` 📖 🗣️, test yozuvlari ⚡ 📨 📖; RECAPS `ic` → raqam; `QZ_BG_SHAPES` (🧭 📜 🎚️, «daftar», «stol usti», «token» → «suhbat tarixi», «context window» → «kontekst oynasi»); `Q_LABELS`; `ACHIEVEMENTS` (`name`, `desc`).
17. Nomlar: `LESSON_META.lessonTitle` «Botjon o'ylay boshlaydi — Maslahatchi (AI)» → «Bot ichida AI» (LMS natijasiga ketadi); `LiveGate title` «Botjon darsi» → «Bot ichida AI».

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **Jihozlar paneli (`GearPanel`)** — 1-dars v2 B-1 (qaror F-0929-63): bu darsda ham olinadi (KOD 2).
2. **App.jsx m5-06 `sub`** «AI API'ni ulash, xulq sozlash»: 13-ekran kod taklifi qabul qilinsa — o'zgarmaydi; rad etilsa — «AI javob yozadi: system prompt, suhbat tarixi, temperature» (App.jsx — chegaradan tashqarida).
3. **7 va 10-dars v2 atamalari:** 7-darsda «🧭 maslahatchi (AI)», «📓 daftar (DB)», 10-darsda «yo'riqnoma (system prompt)» bor → bu darsdagi nomlar: AI · baza · system prompt · suhbat tarixi · temperature · hallutsinatsiya. 10-dars 0-ekrani «O'tgan darsni eslang: AI-bot…» — AI-bot shu 6-darsda (DAVOM 7).
4. **5-dars v2:** u yerda «topshiriq (prompt)»; bu dars «prompt» ni asosiy nom qildi — 5-dars v2 shu bilan mos bo'lsin (A2).
5. **AchRule matni** «🏅 Birinchi urinishda…» — MATN_KORPUS §183 da «hamma darsda aynan bir xil»; emojisiz shakl umumiy qaror (umumiy fayl → `QONUN_NOMZODLARI.md`).
6. **«sessiya»** (podium) — 1-dars v2 B-5.
7. **`DragDropOrder` ikki xato yozuvi** (`dd-pool-empty` + `dd-wrong` bir vaqtda) — boshqa darslardagi nusxalarda ham bo'lishi mumkin (tekshirilmadi).
8. **RU matni** — o'zbekcha tasdiqlangach.

---

## Agent eslatmalari
1. **DAVOM 6–7 tekshiruvi (kodda):** «Keyingi dars — fidbek» — xato, tasdiqlandi `[2211]` → tuzatildi (19) · RECAPS[15] bor, ochish tugmasi yo'q — tasdiqlandi (`recapOpen` hech qachon `true` bo'lmaydi) → KOD 13 · amaliyotda Claude/ChatGPT/`claude.ai` — tasdiqlandi `[2119, 2121]` → gemini.google.com · 13↔15 tartib zid — tasdiqlandi → 13-ekrandagi karta olindi, final qayta nomlandi · «AI API'ni ulash» — darsda ulash kodi yo'q, tasdiqlandi → eslatma 2, B-2.
2. **Savol — 13-ekran kod oynasi (TAKLIF):** App.jsx va'dasi («ulash») shu bilan bajariladi. `soraAI` va `suhbatTarixi` — o'zimiz nomlagan funksiyalar (haqiqiy SDK chaqiruvi emas), shuning uchun «soddalashtirilgan» deb yozildi. Qabulmi?
3. **Savol — final (15) mazmuni o'zgardi:** «yo'riqnoma → murvat → javob → tekshirish → daftar» o'rniga handler ichidagi 5 qadam. Id va to'g'ri tartib o'zgarmaydi (ball kaliti buzilmaydi), lekin bu — test mazmunining katta o'zgarishi. Sabablar 15-ekran `✎` da.
4. **Savol — 5-ekran:** to'g'ri variant uchala savolda ham 1-o'rinda («javob sotilgan»). Ekran INLINE_KEYS'ga kirmaydi (faqat nishon) — o'rinlarni aralashtirish mumkinmi? MD'da hozircha tartib o'zgartirilmadi.
5. **Savol — 4-ekran (1-savol) almashdi:** eski savol hookni takrorlardi. Yangi savol 3-ekranni tekshiradi, ✔ o'rni (C) saqlandi. Rozi bo'lmasangiz — eski savol atamalar bilan qaytariladi.
6. **Texnik — temperature amaliyotda:** gemini.google.com'da temperature sozlanmaydi, shuning uchun 16-ekrandan olindi. Temperature'ni qo'lda sinash kerak bo'lsa — Google AI Studio (aistudio.google.com; o'sha Google akkaunt) qo'shilishi mumkin — qaror sizda.
7. **Atama — LLM «token»:** ishlatilmadi (A1 da «token» = bot tokeni; ikki ma'no adashtiradi). Kontekst oynasi va xarajat «matn hajmi» bilan aytildi — texnik jihatdan to'g'ri, lekin o'quvchi AI hujjatlarida «token» ni uchratadi. Kiritish kerak bo'lsa — 10-darsda yoki 13-ekranda bir gap bilan.
8. **Metafora:** stol usti / murvat / daftar / Maslahatchi — bir martalik o'xshatish sifatida ham qoldirilmadi (atamalar sodda, 7-ekrandagi «oynadan chiqish» harakati o'xshatishni o'zi ko'rsatadi). Foydalanuvchi xohlasa, 7-ekran Mentoriga «stol» o'xshatishi bir marta qaytadi.
