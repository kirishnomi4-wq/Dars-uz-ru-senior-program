# 4-dars «AI-agent nima» — yakuniy matn

Fayl: `src/6-Modull/AgentArchitectureLesson.jsx` · 20 ekran · Keyingi dars: «Claude Skills»
Holat: 05.10.2026 — kodga mos

## 0 · Kirish — ikki xil AI
- Eyebrow: Dars · kirish
- Sarlavha: Mijoz sovg'a so'radi. Ikki xil AI qanday javob beradi?
- Mentor: Bot darslarida botingizga AI-agent qo'shgansiz. Endi agentga butun tizim nuqtai nazaridan qaraymiz. Avval eslaylik: agent oddiy AI'dan nimasi bilan farq qiladi? Mini-do'koningizga mijoz yozdi: «Do'stimga 200 ming so'mgacha sovg'a kerak, bugun yetib borsin». Tugmani bosing va javoblarni solishtiring.
- Karta 1 — Oddiy AI (chat):
  - tugma bosilguncha: …
  - tugma bosilgach: «Quloqchin yoki powerbank sovg'a qilishingiz mumkin. Do'kondan o'zingiz tanlab, buyurtma bering.»
- Karta 2 — AI-agent:
  - tugma bosilguncha: …
  - tugma bosilgach: «Database'dan 200 ming so'mgacha mahsulotlarni topdim ✓ Quloqchin omborda bor — band qildim ✓ Kuryer xizmatidan bugungi yetkazishni so'radim ✓ — 18:00 gacha yetib boradi.»
- Tugma: ▶ Ikki javobni ko'rish → ✓ Solishtirildi
- Savol (tugma bosilgach ochiladi): Asosiy farq nimada?
  - Agent chiroyliroq va batafsilroq gapirdi
  - ✔ Agent asboblar bilan bir necha qadam bajardi
  - Farqi yo'q — ikkalasi bir xil ishladi
- Javob izohlari:
  - 2-variant: **Aynan!** Oddiy AI savolga javob berdi. AI-agent esa maqsadni oldi va do'kon asboblari — Database, band qilish, kuryer xizmati — yordamida bir necha qadamni bajardi. Bugun agent qanday ishlashini va tizimda qayerda turishini ko'ramiz.
  - 1- va 3-variant: **Qiziq fikr!** Lekin gap chiroyli so'zda emas. Ikkinchi AI javob berish bilan qolmadi: do'kon asboblari yordamida mahsulotni topdi, band qildi va yetkazishni so'radi. Bunday AI'ni agent deyishadi.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: AI-agent — maqsad sari qadam tashlaydigan AI.
- Mentor: Bugun uchta savolga javob topamiz: agent oddiy AI'dan nimasi bilan farq qiladi, u tizimda qayerda turadi va qachon uni tanlash kerak.
- Chizma: Database · Tashqi xizmat (API) · Xabar ← Agent
- Karta: Bizning tizimda agent backend ichida ishlaydi va siz bergan asboblar (tool) orqali tizimning boshqa qismlari bilan ishlaydi.
- Bugungi 4 qadam
  1. Oddiy AI va agent — farqi nimada · farq
  2. Agent sikli: idrok → qaror → amal · sikl
  3. Tool — agent ishlata oladigan asbob · asbob
  4. Qachon agent kerak va chegara · qaror
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Natijani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Oddiy AI va agent
- Eyebrow: Tushuncha · farq
- Sarlavha: Oddiy AI javob beradi, agent maqsadga qadam tashlaydi.
- Mentor: Oddiy AI'ga savol berasiz — u javob beradi. Agentga maqsad berasiz — u keyingi qadamni o'zi tanlaydi va siz bergan asboblardan foydalanadi. Agentni detektivga o'xshatish mumkin: maqsad oladi, dalil yig'adi, keyingi qadamni tanlaydi. Har jihatni bosing.
- Jihatlar (bosilgani ✓ bilan belgilanadi; o'ngda jihat nomi va ikki karta ochiladi: **Oddiy AI** · **Agent**):
  - **Nima beriladi?** — Oddiy AI: savol · Agent: maqsad
  - **Necha qadam?** — Oddiy AI: odatda bitta javob · Agent: maqsadga yetguncha bir necha qadam
  - **Tizim bilan?** — Oddiy AI: javob matnini beradi · Agent: tool'lar orqali Database, xabar va boshqa xizmatlar bilan ishlaydi
  - **Qachon?** — Oddiy AI: aniq, bir martalik ish (tarjima, matn yozish) · Agent: bir necha qadam va asbob kerak bo'lgan ish
- Xulosa (4/4 dan keyin): Bir jumla: **oddiy AI javob beradi, agent asboblar bilan qadamma-qadam ish bajaradi.** Ikkalasi ham foydali — har biri o'z o'rnida.
- Eslatma (4/4 dan keyin): Eslatma: bugungi ba'zi chat-AI'lar ham asboblardan foydalana oladi. Agentning asosiy belgisi — maqsad sari bir necha qadamni o'zi tanlashi.
- Tugmalar: Orqaga · 4 jihatni ko'ring (N/4) → Davom etish

## 3 · Bir vazifa, ikki yo'l
- Eyebrow: Animatsiya · bir vazifa, ikki yo'l
- Sarlavha: Bitta vazifa — oddiy AI bitta javob, agent bir necha qadam.
- Mentor: Agent sikl bo'ylab ishlaydi: har qadamda bitta asbobni ishlatadi. Tugmani bosing.
- Tugma: ▶ Ikki yondashuvni ishga tushiring → ✓ Ko'rsatildi
- Chap — Oddiy AI — bitta javob:
  - tugma bosilguncha: Tugmani bosing →
  - tugma bosilgach: «Quloqchin yoki powerbank olishingiz mumkin.» → tugadi.
  - Belgi: 1 javob · faqat matn
- O'ng — Agent — sikl + asboblar (tugma bosilgach yonida: ↻ sikl):
  1. **1-amal** — Database'dan 200 ming so'mgacha mahsulotlarni qidirdi
  2. **2-amal** — Quloqchinni band qildi (Database'ga yozdi)
  3. **3-amal** — Kuryer xizmatidan (API) bugungi yetkazishni so'radi
  4. **tayyor** — Maqsad bajarildi
- Xulosa: Agent 3 ta amal bajardi va tizimdagi ma'lumotni o'zgartirdi. Oddiy AI esa javob matnini berdi. Farq shu.
- Tugmalar: Orqaga · Farqni ko'ring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Oddiy AI (chat) savolga javoban odatda nima qiladi?
  - Bir necha asbobni ishlatib, ishni oxirigacha bajaradi
  - ✔ Javob matnini beradi va to'xtaydi
  - Database'ga o'zi yangi buyurtma yozadi
  - Hech narsa — u faqat agent ichida ishlaydi
- Javob izohlari:
  - To'g'ri: To'g'ri! Oddiy AI savolga javob beradi va to'xtaydi — tizimdagi ma'lumotni o'zi o'zgartirmaydi. Bir necha qadam va asbob kerak bo'lgan ish uchun agent foydali bo'lishi mumkin.
  - 1-variant: Asboblarni ishlatib, ishni oxirigacha bajarish — agentning ishi.
  - 3-variant: Database'ga yozish uchun tool kerak — bu agentning ishi.
  - 4-variant: Oddiy AI alohida ishlaydi — agent shart emas.
- Test yozuvlari (4, 8, 11, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · Agent sikli
- Eyebrow: Ichki sikl
- Sarlavha: Agentning ichida sikl bor: idrok → qaror → amal.
- Mentor: Shu sikl agentga bir necha qadam bajarishga imkon beradi: u maqsadga yetguncha aylanadi va har aylanishda natijani yana ko'radi. Tugmani bosib, bosqichlarni yoqing.
- Oqim: Idrok — Qaror — Amal · ↺ qayta (bosilgan bosqich yonadi)
- Tugma: ▶ Siklni boshlash → Keyingi qadam → → ✓ Tugadi
- Bosqichlar (har bosishda bittasi):
  1. **Idrok:** agent vaziyatni ko'radi — masalan, Database'dan mahsulotlar ro'yxatini o'qiydi.
  2. **Qaror:** keyingi qadamni tanlaydi (qaror) — qaysi asbobni ishlatish kerak?
  3. **Amal:** tanlagan asbobini ishlatadi — masalan, mahsulotni band qiladi.
- Karta — Nega sikl?: Har amaldan keyin agent natijani ko'radi va keyingi qadamni tanlaydi — maqsad bajarilguncha. Shu sikl tufayli agent bir nechta qadamni ketma-ket bajara oladi.
- Xulosa (3/3 dan keyin): Siz agentga maqsad, asboblar va chegara berasiz. Agent shu doirada keyingi qadamni tanlaydi.
- Tugmalar: Orqaga · Siklni ko'ring (N/3) → Davom etish

## 6 · Tool nima
- Eyebrow: Ulanish · tool
- Sarlavha: Tool — agent ishlata oladigan asbob.
- Mentor: Agent tizim bilan faqat tool'lar orqali ishlaydi. Tool — siz yozgan oddiy funksiya: masalan, Database'dan o'qish yoki xabar yuborish. Toolni ruxsatnomaga o'xshatish mumkin: agent faqat ruxsat berilgan ishni qila oladi. Tugmani bosing.
- Karta — Tool nima?: Tool (o'zbekcha «asbob») — agent chaqira oladigan funksiya.
- Tugma: Tool qanday ishlaydi? → ✓ Ko'rdingiz
- O'ng (tugma bosilgach):
  1. **AI modeli tanlaydi:** «Buyurtma holatini bilish uchun Database tool'ini chaqiraman.»
  2. **Backend bajaradi:** sizning kodingiz shu funksiyani ishga tushiradi va Database'dan javob oladi.
  3. **Natija qaytadi:** javob AI'ga qaytadi — u keyingi qadamni tanlaydi.
- Xulosa: Demak agent yangi tizim emas — u tizimingizdagi mavjud qismlarni tool'lar orqali ishlatadi. Agentga qaysi tool'larni bersangiz, u faqat o'shalardan foydalana oladi.
- Tugmalar: Orqaga · Tool nima? → Davom etish

## 7 · Agent tizimda
- Eyebrow: Arxitektura · agent o'rni
- Sarlavha: Agent backend ichida — tool'lari tizim qismlariga ulanadi.
- Mentor: Har bir tool'ni bosing: agent u orqali nima qiladi?
- Chizma: Agent → Database · Tashqi xizmat · Xabar (ochilgani yonadi)
- Tool'lar (bosilgani ✓ bilan belgilanadi; o'ngda karta ochiladi):
  - **Database tool'i** — Agent mahsulot va buyurtmalarni o'qiydi, kerak bo'lsa yozadi. Bu Database'ga (PostgreSQL) so'rov.
  - **Tashqi xizmat tool'i** — Agent kuryer xizmatidan yetkazish vaqtini so'raydi. Bu API chaqiruvi. *API — boshqa xizmat bilan ma'lumot almashish yo'li.*
  - **Xabar tool'i** — Agent mijozga Telegram orqali xabar yuboradi. Bu xabar yuboradigan funksiya.
- Xulosa (3/3 dan keyin): Agent — bitta qism, lekin uchta tool orqali butun tizim bilan ishlaydi. Qancha ko'p tool bersangiz, shuncha ko'p ish qila oladi — shuning uchun tool'larni ehtiyot bo'lib berasiz.
- Tugmalar: Orqaga · 3 ta tool'ni oching (N/3) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Agent tizimdagi ma'lumotni qanday o'zgartiradi?
  - O'z-o'zidan, hech qanday tool'siz
  - Faqat javob matni yozib, boshqa ish qilmay
  - ✔ Siz bergan tool'lar orqali: Database, API, xabar
  - Foydalanuvchi ekranini o'zi chizib qo'yib
- Javob izohlari:
  - To'g'ri: To'g'ri! Agentning amallari — tool'lar orqali. Tool'lar esa siz yozgan funksiyalar: Database'ga so'rov, API chaqiruvi, xabar yuborish. Agent faqat qaysi birini, qaysi tartibda ishlatishni tanlaydi.
  - 1-variant: Tool'lar — siz yozgan oddiy funksiyalar. Agent ularsiz tizimga ta'sir qila olmaydi.
  - 2-variant: Faqat javob yozish — bu oddiy AI. Agent tool'lar orqali amal qiladi.
  - 4-variant: Agent ekranni o'zi chizmaydi — u tool'lar orqali ishlaydi, natijani esa frontend ko'rsatadi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Qachon agent
- Eyebrow: Qaror · qachon agent
- Sarlavha: Qachon oddiy AI yetadi, qachon agent foydali?
- Mentor: Agent kuchli, lekin oddiy ishga ortiqcha murakkablik qo'shadi. Tugmani bosib, qoidani ko'ring.
- Karta — Oddiy AI yetadi — qachon?: Aniq, bir martalik ish: tarjima, matn yozish, g'oya taklif qilish, savolga javob. Tizim bilan bir necha qadam ishlash shart emas.
- Tugma: Agent qachon foydali? → ✓ Ko'rdingiz
- Karta (tugma bosilgach) — Agent — qachon?: Bir necha qadam va asbob kerak bo'lgan ish: buyurtma muammosini hal qilish, ma'lumot yig'ib qaror qilish, bir nechta xizmat bilan ishlash.
- Xulosa: Qoida: **aniq va oddiy vazifa → oddiy AI yetishi mumkin; bir necha qadam va asbob kerak bo'lsa → agent foydali bo'lishi mumkin.** Keraksiz joyda agent ishlatish — ortiqcha murakkablik.
- Tugmalar: Orqaga · Qoidani ko'ring → Davom etish

## 10 · Oddiy AI yoki agent
- Eyebrow: Mashq · qaysi biri
- Sarlavha: Har vazifaga: oddiy AI yoki agent?
- Mentor: Endi o'zingiz qaror qiling. Har vazifani o'qing: bitta javob yetadimi yoki bir necha qadam va asbob kerakmi?
- Vazifalar (navbat bilan, «Vazifa N/4»):
  1. Mahsulot tavsifini ruschaga tarjima qil — to'g'ri: Oddiy AI
  2. Kelmay qolgan buyurtmani tekshir, kuryerga yoz va mijozga javob ber — to'g'ri: Agent
  3. Yangi mahsulot uchun 3 ta nom taklif qil — to'g'ri: Oddiy AI
  4. Mijoz shikoyatini oxirigacha hal qil: buyurtmani top, pul qaytarishni so'ra, mijozga xabar yubor — to'g'ri: Agent
- Tanlov tugmalari: Oddiy AI · bitta javob (+) · Agent · bir necha qadam (+)
- Xato bo'lsa: Qaytadan o'ylang: bu bitta javobli ishmi yoki bir necha qadam va asbob kerakmi?
- Hammasi to'g'ri bo'lsa: Hammasi to'g'ri! Endi vazifaga qarab oddiy AI yoki agentni to'g'ri tanlay olasiz.
- Tugmalar: Orqaga · Tanlang (N/4) → Davom etish

## 11 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mahsulot tavsifini ruschaga tarjima qilish kerak. Oddiy AI yetadimi yoki agent kerakmi?
  - ✔ Oddiy AI — bu bir martalik, aniq ish
  - Agent — u har doim oddiy AI'dan yaxshiroq
  - Ikkalasini birga ishlatib, solishtirish kerak
  - Hech qaysi — bu AI qiladigan ish emas
- Javob izohlari:
  - To'g'ri: To'g'ri! Tarjima — bitta qadamli, aniq vazifa. Oddiy AI yetadi. Bunga agent ishlatish — keraksiz murakkablik.
  - 2-variant: Agent har doim yaxshi emas — bir qadamli ish uchun u ortiqcha.
  - 3-variant: Ikkalasini birga — keraksiz. Sodda ishni sodda asbob bilan qiling.
  - 4-variant: Aksincha — tarjima oddiy AI'ning odatiy ishi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 12 · Agent ishda
- Eyebrow: Hayotiy · agent ishda
- Sarlavha: Agent ishda — maqsaddan natijagacha.
- Mentor: Mana agent mini-do'konda: mijoz yozdi, agent maqsadni oldi va tool'lar yordamida qadamma-qadam ishladi. Tugmani bosib, qadamlarni kuzating.
- Qadamlar (har bosishda bittasi, yorlig'i — bosqich nomi):
  1. **maqsad** — Mijoz: «Buyurtmam 2 kundan beri kelmadi.» Agent maqsadi: sababini topib, mijozga javob berish.
  2. **idrok** — Agent Database'dan buyurtma holatini o'qidi (tool: Database) — «kuryerga berilgan».
  3. **qaror** — Kuryer xizmatidan so'rash kerak: buyurtma qayerda?
  4. **amal** — Agent kuryer xizmatiga so'rov yubordi (tool: API) — «ertaga 12:00 gacha yetkaziladi».
  5. **qaror** — Endi mijozga aniq javob berish kerak.
  6. **amal** — Agent mijozga Telegram'da xabar yubordi (tool: xabar)
  7. **tayyor** — Maqsad bajarildi. Agent 3 ta tool ishlatdi: Database, API va xabar.
- Tugma: ▶ Agentga vazifa berish → Keyingi qadam → → ✓ Maqsad bajarildi
- O'ng — Ishlatilgan tool'lar: hali yo'q → 1 ta tool ishlatildi (Database) → 2 ta tool ishlatildi (Database, API) → 3 ta tool ishlatildi (Database, API, xabar)
- Xulosa (7/7 dan keyin): Siz faqat maqsad berdingiz. Agent idrok → qaror → amal sikli bilan tool'larni ishlatib, ishni bajardi.
- Tugmalar: Orqaga · Qadamlarni ko'ring (N/7) → Davom etish

## 13 · Chegara
- Eyebrow: Ehtiyot · chegara
- Sarlavha: Agentga chegara kerak.
- Mentor: Oddiy AI faqat javob yozadi. Agent esa real amal qiladi: Database'ga yozadi, pulni qaytaradi, xabar yuboradi. Shuning uchun oldindan aytiladi: nima mumkin, nima mumkin emas. Tugmani bosing.
- Karta — Agent backend ichida: U faqat siz bergan tool'larga ega; bermagan ishingizni qila olmaydi.
- Tugma: Qanday chegara? → ✓ Tushundim
- O'ng (tugma bosilgach):
  - **Cheklangan tool'lar:** faqat kerakli tool'larni bering (masalan, buyurtmani o'chirish tool'ini bermang).
  - **Tasdiq:** xavfli amaldan oldin (masalan, pul qaytarish) odamdan tasdiq so'ralsin.
- Xulosa: Chegarani inglizcha **guardrail** deyishadi — keyingi darslarda shu so'zni uchratasiz.
- Tugmalar: Orqaga · Qanday chegara? → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Bizning tizimda agent qaysi qismda ishlaydi va nima orqali amal qiladi?
  - Frontendda — chunki foydalanuvchi uni ko'radi
  - Database ichida — chunki ma'lumot bilan ishlaydi
  - Tizimdan tashqarida — alohida, bog'lanmagan dastur
  - ✔ Backend ichida — siz bergan tool'lar orqali
- Javob izohlari:
  - To'g'ri: To'g'ri! Bizning tizimda agent backend ichida ishlaydi. U tizimning bir qismi va faqat siz bergan tool'lar (Database, API, xabar) orqali boshqa qismlarga ta'sir qiladi.
  - 1-variant: Foydalanuvchi agentni ko'rmaydi — u orqa tomonda (backend) ishlaydi. Frontend faqat natijani ko'rsatadi.
  - 2-variant: Agent Database ichida emas — u backendda turadi va Database'ni tool orqali ishlatadi.
  - 3-variant: Agent tizim bilan bog'langan — u tool'lar orqali ulanadi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Yakuniy — siklni yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: agent sikli bosqichlarini to'g'ri tartibda yig'ing.
- Mentor: Agent vazifani qanday bajaradi? Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. Maqsad
  2. Idrok
  3. Qaror
  4. Amal
  5. Natijani tekshirish
- Joylar: 1 · 2 · 3 · 4 · 5 (bo'sh joyda: bu yerga qo'ying)
- To'g'ri yig'ilgach: ✓ Sikl tayyor: **Maqsad → Idrok → Qaror → Amal → Natijani tekshirish**
- Keyin (yashil): Ko'rmasa — qaror qilolmaydi, qarorsiz — amal qilolmaydi. Maqsad bajarilmasa, sikl qaytadan aylanadi.
- Xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Tugmalar: Orqaga · Siklni yig'ing → Davom etish

## 16 · Amaliyot · reja
- Eyebrow: Amaliyot · reja
- Sarlavha: Loyihangiz uchun AI-agentni rejalashtiring
- Mentor: Bu topshiriqni **o'z loyihangizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: Loyihangizni o'ylang. Unda qaysi vazifa bir necha qadam va asbob talab qiladi? O'sha — agentga nomzod. Uni tanlab, qaysi tool'lar kerakligini va chegarani yozing.
- Bosqichlar — belgilab boring (bosilgani ✓ bilan belgilanadi):
  1. Bir necha qadamli bitta vazifani tanlang (masalan: kelmay qolgan buyurtmani hal qilish)
  2. Agent maqsadini bir jumlada yozing
  3. Agentga qaysi 2–3 tool kerak: Database? tashqi xizmat (API)? xabar?
  4. Har tool uchun bir qatorda yozing: agent u bilan nima qiladi
  5. Chegarani belgilang: agent nima qila olmasligi kerak va qaysi amalga odam tasdig'i kerak?
- Tugma: Yana N qadam → Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach (yashil): Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Maqsad berilsa, bir necha qadamni tanlab bajaradigan AI qanday ataladi? | AI-agent | Siz bergan tool'lar va chegara doirasida ishlaydi |
| Oddiy AI savolga javoban odatda nima qiladi? | Javob beradi va to'xtaydi | Tizimdagi ma'lumotni o'zi o'zgartirmaydi |
| Agent sikli qaysi uch qadamdan iborat? | Idrok, qaror, amal | Har amaldan keyin natijani tekshiradi |
| Agent chaqira oladigan funksiya nima deyiladi? | Tool (asbob) | Siz yozgan oddiy funksiya |
| Qaysi tool'ni chaqirishni kim tanlaydi? | AI modeli | Tool'ni esa backend kodi bajaradi |
| Agent buyurtma holatini o'qishi uchun qaysi tool kerak? | Database tool'i | Database'ga so'rov |
| Agent kuryer xizmatidan ma'lumot so'rasa, bu qaysi tool? | API tool'i | API — boshqa xizmat bilan ma'lumot almashish yo'li |
| Agent maqsadga yetmasa nima qiladi? | Siklni qaytadan boshlaydi | Maqsad bajarilguncha davom etadi |
| Agent nima qila olishini kim belgilaydi? | Siz — chegara bilan | Inglizcha: guardrail |
| Xavfli amaldan oldin (masalan, pul qaytarish) nima kerak? | Odamning tasdig'i | Agent buni o'zi hal qilmaydi |
| Bizning tizimda agent qaysi qismda ishlaydi? | Backend'da | Foydalanuvchi uni ko'rmaydi |
| Oddiy tarjima ishiga agent kerakmi? | Yo'q, oddiy AI yetadi | Keraksiz agent — ortiqcha murakkablik |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Agentning o'rnini tushundingiz (yonida: N/5 to'g'ri)
- Sarlavha: AI-agent — maqsad sari qadam tashlaydigan tizim qismi.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - Oddiy AI savolga javob beradi; agent maqsad sari bir necha qadamni tanlab bajaradi
  - Agent sikli: idrok → qaror → amal (maqsadga yetguncha)
  - Tool — agent ishlata oladigan funksiya: Database, API, xabar
  - Bizning tizimda agent backend ichida, siz bergan tool'lar orqali ishlaydi
  - Oddiy ishga oddiy AI yetadi; xavfli amalga — chegara va odam tasdig'i
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **Toping** — loyihangizda qaysi vazifa bir necha qadamli? O'sha — agentga nomzod
  - **Tool'lar** — agentga qaysi tool'lar kerak: Database? API? xabar?
  - **Chegara** — agent nima qila olmasligi kerak? Chegarani yozing
- Keyingi dars — Claude Skills: AI va agentga yozma yo'riqnoma berib, uning ishini aniq shakllantirish.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: N/4 · bosilganda: Badges — N/4 (har nishon nomi; olinmagani qulf bilan)
- **Chat vs Agent** — Oddiy AI va agent farqini ajratdingiz (4-ekran)
- **Tool User** — Agent tool'lar orqali ishlashini bildingiz (8-ekran)
- **Right Place** — Agent tizimning qaysi qismida ishlashini bildingiz (14-ekran)
- **Agent Loop** — Agent siklini to'g'ri tartibda yig'dingiz (15-ekran)
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. Oddiy AI javob beradi, agent ish bajaradi (4-ekran)
   - Oddiy AI — Oddiy AI — savolga **javob beradi** va to'xtaydi.
   - AI-agent — Agent — **maqsad oladi** va tool'lar bilan bir necha qadam bajaradi.
   - Farq — amal — Agent tizimdagi ma'lumotni **tool orqali o'zgartira oladi**.
   - Sinfga savol: Oddiy AI va agentning asosiy farqi nima?
2. Tool — agentning asbobi (8-ekran)
   - Tool nima? — Tool — **siz yozgan funksiya**.
   - Uch xil tool — Database, API, xabar — har biri alohida tool.
   - Amal tool orqali — Agent faqat **siz bergan tool'lar** orqali amal qiladi.
   - Sinfga savol: Agent tizimga qanday amal qiladi?
3. Qachon oddiy AI, qachon agent (11-ekran)
   - Bir martalik ish — Aniq, bir martalik ish (tarjima, matn) — **oddiy AI** yetadi.
   - Bir necha qadam — Bir necha qadam va asbob kerak bo'lsa — **agent** foydali bo'lishi mumkin.
   - To'g'ri tanlov — Oddiy ishga agent — **ortiqcha murakkablik**.
   - Sinfga savol: Nega har ishga agent kerak emas?
4. Agent — backend qismi (14-ekran)
   - Backend ichida — Bizning tizimda agent **backend ichida** ishlaydi.
   - Tool'lar orqali — U tool'lar (Database, API, xabar) orqali boshqa qismlarga ta'sir qiladi.
   - Foydalanuvchi ko'rmaydi — Foydalanuvchi uni ko'rmaydi — frontend faqat natijani ko'rsatadi.
   - Sinfga savol: Agent tizimning qaysi qismida ishlaydi?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: agent · perceive · decide · act · tool · asbob · idrok→amal · goal · guardrail · backend

1. Oddiy AI va agent o'rtasidagi asosiy farq nima?
   - ✔ Oddiy AI javob beradi; agent qadamlar bilan ishlaydi
   - Agent chiroyliroq va odob bilan gapiradi
   - Oddiy AI har doim agentdan tezroq ishlaydi
   - Ular o'rtasida hech qanday farq yo'q
2. Agent sikli qanday nomlanadi?
   - Kirish → ishlov → chiqish
   - Boshlash → kutish → tugatish
   - ✔ Idrok → qaror → amal
   - Savol → javob → to'xtash
3. Tool nima?
   - Agentning dasturdagi laqabi
   - ✔ Agent chaqira oladigan funksiya
   - Do'kondagi mahsulotlar xaritasi
   - AI'ning telefon raqami
4. Agent Database'dan buyurtmalarni o'qishi — bu qaysi tool?
   - ✔ Database'ga so'rov
   - Foydalanuvchining kirish paroli
   - Ekran rasmini olish
   - Video faylni ijro etish
5. Bir martalik, aniq ish (masalan, tarjima) uchun nima yetadi?
   - Bunga ham albatta agent kerak
   - Hech qaysi biri to'g'ri emas
   - AI va agentni birga ishlatish
   - ✔ Oddiy AI yetadi
6. Bir necha qadam va asbob kerak bo'lgan ish uchun nima foydali?
   - Bitta javobli oddiy AI
   - Oddiy chiziqli skript
   - Faqat frontend qismi
   - ✔ AI-agent
7. Bizning tizimda agent qayerda ishlaydi?
   - Frontendda, foydalanuvchi ko'radigan joyda
   - ✔ Backend ichida
   - Database ichida
   - Tizimdan butunlay tashqarida
8. Agent tizimga qanday amal qiladi?
   - O'z-o'zidan, hech qanday kod va API'siz
   - ✔ Tool'lar orqali: Database, API, xabar
   - Faqat javob yozib, amalsiz
   - Ekranni o'zi chizib qo'yib
9. Nega agentga chegara kerak?
   - ✔ U real amal qiladi, xavflisini cheklash kerak
   - U juda sekin ishlaydi va kuttiradi
   - U juda ko'p xotira egallaydi
   - Aslida bunday chegara kerak emas
10. Agentga bir necha qadamni ketma-ket bajarish imkonini nima beradi?
    - Juda katta xotira hajmi
    - Chiroyli va zamonaviy interfeys
    - ✔ Maqsadga yetguncha aylanadigan sikl
    - Juda tez internet aloqasi
11. Har bir vazifaga agent ishlatish nima deyiladi?
    - Bu doim eng to'g'ri yechim
    - Vaqtni to'g'ri tejash usuli
    - Tizimni tezlashtirish usuli
    - ✔ Ortiqcha murakkablik
12. Agent siklining to'g'ri tartibi qanday?
    - Amal → idrok → qaror → maqsad → natija
    - Qaror → amal → natija → idrok → maqsad
    - ✔ Maqsad → idrok → qaror → amal → natija
    - Natija → maqsad → amal → qaror → idrok
