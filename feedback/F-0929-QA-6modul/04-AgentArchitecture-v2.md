# 6-Modul (LMS: 8-Modul) · 4-dars «AI-agent nima» — YANGI MATN (v2)

Fayl: `src/6-Modull/AgentArchitectureLesson.jsx` · 20 ekran · faqat o'zbekcha
Eski matn: `04-AgentArchitecture-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=2-variant, s8=3, s11=1, s14=4; arena kaliti o'zgarmaydi) — faqat matn.

---

## A. Darsning 4 ta tayanch tushunchasi

1. **Oddiy AI (chat)** — savol bersangiz, javob beradi: matn yozadi, tarjima qiladi, tahlil qiladi.
2. **AI-agent** — maqsad berilganda, keyingi qadamni o'zi tanlaydi va **siz bergan** asboblar yordamida bir necha qadamni bajaradi.
3. **Tool (asbob)** — agent chaqira oladigan funksiya (bot darslarida ham «asbob» deyilgan). Qaysi toolni chaqirishni AI modeli tanlaydi, toolni esa backend kodingiz bajaradi.
4. **Vakolat chegarasi** (inglizcha *guardrail*) — agentga nima qilish mumkin, nima mumkin emasligini belgilaydi.

**Sikl:** Idrok → Qaror → Amal (maqsadga yetguncha). O'quvchi bot darslarida («AI-agent yaratish») aynan shu nomlarni o'rgangan — nomlar o'zgarmaydi. Idrok — vaziyatni ko'rish · Qaror — keyingi qadamni tanlash · Amal — asbobni ishlatish.
**Misol-ip:** dars bo'yi mini-do'kon (1–3-darslardagi loyiha). Shahar, idora, byuro — olib tashlanadi.
Detektiv — faqat 2-ekranda bir marta, o'xshatish sifatida. Ruxsatnoma — 6-ekranda bir marta.

---

## 0 · Kirish — ikki xil AI  `[715]`
- Eyebrow: Dars · kirish
- Sarlavha: **Mini-do'koningizga mijoz yozdi: «Do'stimga 200 ming so'mgacha sovg'a kerak, bugun yetib borsin». Ikki xil AI qanday javob beradi?**
- Mentor: Bot darslarida botingizga AI-agent qo'shgansiz. Endi agentga butun tizim nuqtai nazaridan qaraymiz. Avval eslaylik: agent oddiy AI'dan nimasi bilan farq qiladi? Tugmani bosing — bitta iltimosga ikki xil AI qanday javob berishini solishtiring.
- Karta 1: 💬 **Oddiy AI (chat)** → «Quloqchin yoki powerbank sovg'a qilishingiz mumkin. Do'kondan o'zingiz tanlab, buyurtma bering.»
- Karta 2: 🤖 **AI-agent** → «Do'kon bazasidan 200 ming so'mgacha mahsulotlarni topdim ✓ Quloqchin omborda bor — band qildim ✓ Kuryer xizmatidan bugungi yetkazishni so'radim ✓ — 18:00 gacha yetib boradi.»
- Tugma: ▶ Ikki javobni ko'rish → ✓ Solishtirildi
- Savol: **Asosiy farq nimada?**
  - Agent chiroyliroq va batafsilroq gapirdi
  - Agent asboblar bilan bir necha qadam bajardi
  - Farqi yo'q — ikkalasi bir xil ishladi
- Javob — 2-variant: **Aynan!** Oddiy AI savolga javob berdi. AI-agent esa maqsadni oldi va do'kon asboblari — baza, band qilish, kuryer xizmati — yordamida bir necha qadamni bajardi. Bugun agent qanday ishlashini va tizimda qayerda turishini ko'ramiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Lekin gap chiroyli so'zda emas. Ikkinchi AI javob berish bilan qolmadi: do'kon asboblari yordamida mahsulotni topdi, band qildi va yetkazishni so'radi. Bunday AI'ni agent deyishadi.

✎ «Shaharga kirdingiz / ma'lumot byurosi / detektiv» → mini-do'kon va «oddiy AI / AI-agent» (bitta misol-ip) · agent javobi endi qaysi asbobni ishlatganini ko'rsatadi · to'g'ri variant endi eng uzuni emas · javob tanlovga qarab ikki xil

## 1 · Reja  `[762]`
- Eyebrow: Reja
- Sarlavha: **AI-agent — maqsad sari qadam tashlaydigan AI.**
- Mentor: Bugun uchta savolga javob topamiz: agent oddiy AI'dan nimasi bilan farq qiladi, u tizimda qayerda turadi va qachon uni tanlash kerak.
- Sxema: 🗄️ Baza · 📡 Tashqi xizmat (API) · 💬 Xabar ← 🤖 Agent
- Blok: Bizning tizimda agent backend ichida ishlaydi va siz bergan asboblar (tool) orqali tizimning boshqa qismlari bilan ishlaydi.
- Bugungi 4 qadam:
  1. Oddiy AI va agent — farqi nimada · *farq*
  2. Agent sikli: idrok → qaror → amal · *sikl*
  3. Tool — agent ishlata oladigan asbob · *asbob*
  4. Qachon agent kerak va vakolat chegarasi · *qaror*

✎ «aqlli komponent», «qo'l cho'zadi» olib tashlandi

## 2 · Oddiy AI va agent  `[802]`
- Eyebrow: Tushuncha · farq
- Sarlavha: **Oddiy AI savolga javob beradi. Agent maqsad sari qadam tashlaydi.**
- Mentor: Oddiy AI'ga savol berasiz — u javob beradi. Agentga maqsad berasiz — u keyingi qadamni o'zi tanlaydi va siz bergan asboblardan foydalanadi. Agentni detektivga o'xshatish mumkin: maqsad oladi, dalil yig'adi, keyingi qadamni tanlaydi. Har jihatni bosing.
- Jihatlar (💬 Oddiy AI · 🤖 Agent):
  - **Nima beriladi?** — savol · maqsad
  - **Necha qadam?** — odatda bitta javob · maqsadga yetguncha bir necha qadam
  - **Tizim bilan?** — javob matnini beradi · tool'lar orqali baza, xabar va boshqa xizmatlar bilan ishlaydi
  - **Qachon?** — aniq, bir martalik ish (tarjima, matn yozish) · bir necha qadam va asbob kerak bo'lgan ish
- Xulosa: Bir jumla: **oddiy AI javob beradi, agent asboblar bilan qadamma-qadam ish bajaradi.** Ikkalasi ham foydali — har biri o'z o'rnida.
- Eslatma: Bugungi ba'zi chat-AI'lar ham asboblardan foydalana oladi. Agentning asosiy belgisi — maqsad sari bir necha qadamni o'zi tanlashi.

✎ «Byuro gapiradi, detektiv bajaradi» (qat'iy qarama-qarshilik) → ta'rif bilan · «call-markaz», «tergovchi» olib tashlandi · qisqa halol eslatma qo'shildi

## 3 · Bir vazifa, ikki yo'l  `[838]`
- Eyebrow: Animatsiya · bir vazifa, ikki yo'l
- Sarlavha: **Bitta vazifa — oddiy AI bitta javob, agent bir necha qadam.**
- Mentor: Oddiy AI bitta javob qaytaradi va to'xtaydi. Agent esa sikl bo'ylab bir nechta amal bajaradi — har amalda bitta asbobni ishlatadi. Tugmani bosing.
- Chap: 💬 Oddiy AI — bitta javob · «Quloqchin yoki powerbank olishingiz mumkin.» → tugadi · belgi: 1 javob · faqat matn
- O'ng: 🤖 Agent — sikl + asboblar · belgi: ↻ sikl
  - 1-amal — Bazadan 200 ming so'mgacha mahsulotlarni qidirdi
  - 2-amal — Quloqchinni band qildi (bazaga yozdi)
  - 3-amal — Kuryer xizmatidan (API) bugungi yetkazishni so'radi
  - tayyor — Maqsad bajarildi
- Xulosa: Agent 3 ta amal bajardi va tizimdagi ma'lumotni o'zgartirdi. Oddiy AI esa javob matnini berdi. Farq shu.

✎ «Kerakli idoraga bordi», «aloqa idorasi» → baza va API · «↻ loop» → «↻ sikl»

## 4 · 1-savol ✅  `[882]`
- Savol: **Oddiy AI (chat) savolga javoban odatda nima qiladi?**
  - Bir necha asbobni ishlatib, ishni oxirigacha bajaradi
  - ✔ Javob matnini beradi va to'xtaydi
  - Do'kon bazasiga o'zi yangi buyurtma yozadi
  - Hech narsa — u faqat agent ichida ishlaydi
- To'g'ri: To'g'ri! Oddiy AI savolga javob beradi va to'xtaydi — tizimdagi ma'lumotni o'zi o'zgartirmaydi. Bir necha qadam va asbob kerak bo'lgan ish uchun agent foydali bo'lishi mumkin.
- Xato izohlari:
  - Asboblarni ishlatib, ishni oxirigacha bajarish — agentning ishi.
  - Bazaga yozish uchun tool kerak — bu agentning ishi.
  - Oddiy AI alohida ishlaydi — agent shart emas.
  - (umumiy) Oddiy AI javob beradi va to'xtaydi.

## 5 · Agent sikli  `[905]`
- Eyebrow: Ichki sikl
- Sarlavha: **Agentning ichida sikl bor: idrok → qaror → amal.**
- Mentor: Agentga bir necha qadam bajarish imkonini beradigan narsa — shu sikl. U maqsadga yetguncha aylanadi: vaziyatni ko'radi (idrok), keyingi qadamni tanlaydi (qaror), asbobni ishlatadi (amal) — va natijani yana ko'radi. Tugmani bosib, bosqichlarni yoqing.
- Sxema: Idrok — Qaror — Amal · ↺ qayta
- Bosqichlar:
  1. **Idrok:** agent vaziyatni ko'radi — masalan, bazadan mahsulotlar ro'yxatini o'qiydi.
  2. **Qaror:** keyingi qadamni tanlaydi (qaror) — qaysi asbobni ishlatish kerak?
  3. **Amal:** tanlagan asbobini ishlatadi — masalan, mahsulotni band qiladi.
- Blok: 🔁 **Nega sikl?** — Har amaldan keyin agent natijani ko'radi va keyingi qadamni tanlaydi — maqsad bajarilguncha. Shu sikl tufayli agent bir nechta qadamni ketma-ket bajara oladi.
- Xulosa: Siz agentga maqsad, asboblar va chegara berasiz. Agent shu doirada keyingi qadamni tanlaydi.

✎ «Kuzat → Xulosa → Harakat» → «Idrok → Qaror → Amal» (bot darsidagi nomlar — bir tushuncha, bir nom) · «dvigatel» → «sikl» (bitta nom) · «agentni avtonom qiladi», «qolganini o'zi qiladi» → «siz bergan maqsad, asbob va chegara doirasida»

## 6 · Tool nima  `[946]`
- Eyebrow: Ulanish · tool
- Sarlavha: **Tool — agent ishlata oladigan asbob.**
- Mentor: Agent tizim bilan faqat tool'lar orqali ishlaydi. Tool — siz yozgan oddiy funksiya: masalan, bazadan o'qish yoki xabar yuborish. Toolni ruxsatnomaga o'xshatish mumkin: agent faqat ruxsat berilgan ishni qila oladi. Tugmani bosing.
- Blok: 🧰 **Tool nima?** — Tool (o'zbekcha «asbob») — agent chaqira oladigan funksiya.
- Tugma: Tool qanday ishlaydi? → ✓ Ko'rdingiz
- Ochilgach (3 qadam):
  1. **AI modeli tanlaydi:** «Buyurtma holatini bilish uchun baza tool'ini chaqiraman.»
  2. **Backend bajaradi:** sizning kodingiz shu funksiyani ishga tushiradi va bazadan javob oladi.
  3. **Natija qaytadi:** javob AI'ga qaytadi — u keyingi qadamni tanlaydi.
- Xulosa: Demak agent yangi tizim emas — u tizimingizdagi mavjud qismlarni tool'lar orqali ishlatadi. Agentga qaysi tool'larni bersangiz, u faqat o'shalardan foydalana oladi.

✎ ruxsatnoma = tool = funksiya = idora = komponent aralashmasi → bitta ta'rif · 🔴 bu ekrandagi 3 karta 7-ekranda so'zma-so'z takrorlanardi → bu yerda endi «kim tanlaydi, kim bajaradi» ko'rsatiladi · «muvofiqlashtiruvchi» olib tashlandi

## 7 · Agent tizimda  `[976]`
- Eyebrow: Arxitektura · agent o'rni
- Sarlavha: **Agent backend ichida — tool'lari tizim qismlariga ulanadi.**
- Mentor: Bizning tizimda agent backend ichida ishlaydi va har bir tool orqali tizimning bitta qismiga ulanadi. Har bir tool'ni bosib, agent u bilan nima qilishini ko'ring.
- Sxema: 🤖 Agent → Baza · Tashqi xizmat · Xabar
- Kartalar:
  - **Baza tool'i** — Agent mahsulot va buyurtmalarni o'qiydi, kerak bo'lsa yozadi. Bu ma'lumotlar bazasiga (PostgreSQL) so'rov.
  - **Tashqi xizmat tool'i** — Agent kuryer xizmatidan yetkazish vaqtini so'raydi. Bu API chaqiruvi. *API — boshqa xizmat bilan ma'lumot almashish yo'li.*
  - **Xabar tool'i** — Agent mijozga Telegram orqali xabar yuboradi. Bu xabar yuboradigan funksiya.
- Xulosa: Agent — bitta qism, lekin uchta tool orqali butun tizim bilan ishlaydi. Qancha ko'p tool bersangiz, shuncha ko'p ish qila oladi — shuning uchun tool'larni ehtiyot bo'lib berasiz.

✎ Arxiv/Ekspert/Aloqa → Baza/Tashqi xizmat/Xabar · API birinchi uchragan joyida izohlandi · «Ekspert = API» olib tashlandi (1-darsda AI edi — to'qnashuv)

## 8 · 2-savol ✅  `[1015]`
- Savol: **Agent tizimdagi ma'lumotni qanday o'zgartiradi?**
  - O'z-o'zidan, hech qanday tool'siz
  - Faqat javob matni yozib, boshqa ish qilmay
  - ✔ Siz bergan tool'lar orqali — baza, API, xabar
  - Foydalanuvchi ekranini o'zi chizib qo'yib
- To'g'ri: To'g'ri! Agentning amallari — tool'lar orqali. Tool'lar esa siz yozgan funksiyalar: bazaga so'rov, API chaqiruvi, xabar yuborish. Agent faqat qaysi birini, qaysi tartibda ishlatishni tanlaydi.
- Xato izohlari:
  - Tool'lar — siz yozgan oddiy funksiyalar. Agent ularsiz tizimga ta'sir qila olmaydi.
  - Faqat javob yozish — bu oddiy AI. Agent tool'lar orqali amal qiladi.
  - Agent ekranni o'zi chizmaydi — u tool'lar orqali ishlaydi, natijani esa frontend ko'rsatadi.
  - (umumiy) Agent siz bergan tool'lar orqali amal qiladi.

✎ «fuqaroning uyiga kirib olib» (shahar) → «ekranini o'zi chizib»

## 9 · Qachon agent  `[1038]`
- Eyebrow: Qaror · qachon agent
- Sarlavha: **Qachon oddiy AI yetadi, qachon agent foydali?**
- Mentor: Agent kuchli, lekin har joyga kerak emas. Oddiy ish uchun oddiy AI yetadi — agent ortiqcha murakkablik qo'shadi. Tugmani bosib, qoidani ko'ring.
- Blok: 💬 **Oddiy AI yetadi — qachon?** — Aniq, bir martalik ish: tarjima, matn yozish, g'oya taklif qilish, savolga javob. Tizim bilan bir necha qadam ishlash shart emas.
- Tugma: Agent qachon foydali? → ✓ Ko'rdingiz
- Ochilgach: 🤖 **Agent — qachon?** — Bir necha qadam va asbob kerak bo'lgan ish: buyurtma muammosini hal qilish, ma'lumot yig'ib qaror qilish, bir nechta xizmat bilan ishlash.
- Xulosa: Qoida: **aniq va oddiy vazifa → oddiy AI yetishi mumkin; bir necha qadam va asbob kerak bo'lsa → agent foydali bo'lishi mumkin.** Keraksiz joyda agent ishlatish — ortiqcha murakkablik.

✎ «agent kerak» → «agent foydali bo'lishi mumkin» · «qadamlar soni» yagona mezon emas — asbob ham qo'shildi · «manzil» olib tashlandi (pastga qarang)

## 10 · Oddiy AI yoki agent  `[1066]`
- Eyebrow: Mashq · qaysi biri
- Sarlavha: **Har vazifaga: oddiy AI yoki agent?**
- Mentor: Endi o'zingiz qaror qiling. Har vazifani o'qing: bitta javob yetadimi yoki bir necha qadam va asbob kerakmi?
- Tugmalar: 💬 Oddiy AI · bitta javob | 🤖 Agent · bir necha qadam
- Vazifalar:
  1. Mahsulot tavsifini ruschaga tarjima qil — ✔ oddiy AI
  2. Kelmay qolgan buyurtmani tekshir, kuryerga yoz va mijozga javob ber — ✔ agent
  3. Yangi mahsulot uchun 3 ta nom taklif qil — ✔ oddiy AI
  4. Mijoz shikoyatini oxirigacha hal qil: buyurtmani top, pul qaytarishni so'ra, mijozga xabar yubor — ✔ agent
- Xato: Qaytadan o'ylang: bu bitta javobli ishmi yoki bir necha qadam va asbob kerakmi?
- Yakun: Hammasi to'g'ri! Endi vazifaga qarab oddiy AI yoki agentni to'g'ri tanlay olasiz.

✎ 🔴 FAKT: oldingi «Bitta manzilni xaritada ko'rsat» va «Bugungi ob-havoni ayt» — ✔ «byuro» deb berilgan edi. Aslida oddiy AI buni asbobiz qila olmaydi: xarita va bugungi ob-havo jonli ma'lumot, ular uchun tool kerak. O'quvchi noto'g'ri qoida o'rganardi. Vazifalar mini-do'konga almashdi (to'g'ri javoblar tartibi o'sha: AI · agent · AI · agent)

## 11 · 3-savol ✅  `[1104]`
- Savol: **Mahsulot tavsifini ruschaga tarjima qilish kerak. Oddiy AI yetadimi yoki agent kerakmi?**
  - ✔ Oddiy AI — bu bir martalik, aniq ish
  - Agent — u har doim oddiy AI'dan yaxshiroq
  - Ikkalasini birga ishlatib, solishtirish kerak
  - Hech qaysi — bu AI qiladigan ish emas
- To'g'ri: To'g'ri! Tarjima — bitta qadamli, aniq vazifa. Oddiy AI yetadi. Bunga agent ishlatish — keraksiz murakkablik.
- Xato izohlari:
  - Agent har doim yaxshi emas — bir qadamli ish uchun u ortiqcha.
  - Ikkalasini birga — keraksiz. Sodda ishni sodda asbob bilan qiling.
  - Aksincha — tarjima oddiy AI'ning odatiy ishi.
  - (umumiy) Bir martalik ishga oddiy AI yetadi.

✎ 🔴 Savol almashdi — oldingi «manzilni xaritada ko'rsatish» uchun tool kerak (10-ekrandagi sabab)

## 12 · Agent ishda (case)  `[1127]`
- Eyebrow: Hayotiy · agent ishda
- Sarlavha: **Agent ishda — maqsaddan natijagacha.**
- Mentor: Mana agent mini-do'konda: mijoz yozdi, agent maqsadni oldi va tool'lar yordamida qadamma-qadam ishladi. Tugmani bosib, qadamlarni kuzating.
- Tugma: ▶ Agentga vazifa berish → Keyingi qadam → → ✓ Maqsad bajarildi
- Qadamlar (har qatorda yorliq):
  1. **maqsad** — Mijoz: «Buyurtmam 2 kundan beri kelmadi.» Agent maqsadi: sababini topib, mijozga javob berish.
  2. **idrok** — Agent bazadan buyurtma holatini o'qidi (tool: baza) — «kuryerga berilgan».
  3. **qaror** — Kuryer xizmatidan so'rash kerak: buyurtma qayerda?
  4. **amal** — Agent kuryer xizmatiga so'rov yubordi (tool: API) — «ertaga 12:00 gacha yetkaziladi».
  5. **qaror** — Endi mijozga aniq javob berish kerak.
  6. **amal** — Agent mijozga Telegram'da xabar yubordi (tool: xabar) 📨
  7. **tayyor** — Maqsad bajarildi. Agent 3 ta tool ishlatdi: baza, API va xabar.
- Blok: 🧰 **Ishlatilgan tool'lar** — hali yo'q → «N ta tool ishlatildi (baza, API, xabar)».
- Xulosa: Siz faqat maqsad berdingiz. Agent idrok → qaror → amal sikli bilan tool'larni ishlatib, ishni bajardi.

✎ 🔴 KOD XATOSI (ekranda ko'rinadi): hozir har qadam yorlig'i «tayyor» bo'lib chiqadi, «Ishlatilgan ruxsatnomalar» oxirigacha «hali yo'q» deb turadi. Sabab: 26.09 dagi emoji-tozalash codemodi (commit e4d4ced) qadamlardagi `ico` belgisini o'chirgan, kod esa yorliqni aynan shu belgidan aniqlardi. Tuzatishda belgi emas, alohida `phase` maydoni qo'yiladi (keyingi tozalashda yana buzilmasin) · 🔴 «B-manzilga bordi, yukni topdi» — agent tom ma'noda «bormaydi» → haqiqiy mini-do'kon voqeasi

## 13 · Vakolat chegarasi  `[1162]`
- Eyebrow: Ehtiyot · vakolat chegarasi
- Sarlavha: **Agent amal qiladi — demak unga vakolat chegarasi kerak.**
- Mentor: Oddiy AI faqat javob yozadi. Agent esa real amal qiladi: bazaga yozadi, pulni qaytaradi, xabar yuboradi. Shuning uchun unga vakolat chegarasi beriladi — nima qilish mumkin, nima mumkin emasligi. Tugmani bosing.
- Blok: 🤖 **Agent backend ichida** — U faqat siz bergan tool'larga ega; bermagan ishingizni qila olmaydi.
- Tugma: Qanday chegara? → ✓ Tushundim
- Ochilgach:
  - 🧾 **Cheklangan tool'lar:** faqat kerakli tool'larni bering (masalan, buyurtmani o'chirish tool'ini bermang).
  - ✋ **Tasdiq:** xavfli amaldan oldin (masalan, pul qaytarish) odamdan tasdiq so'ralsin.
- Atama: Vakolat chegarasini inglizcha **guardrail** deyishadi — keyingi darslarda shu so'zni uchratasiz.
- Tugma: Qanday chegara? → Davom etish

✎ «order» olib tashlandi (o'zbekcha «orden» bilan chalkashadi) · «(arxivga yozadi, pul, xabar)» chala ro'yxati → to'liq jumla · guardrail bir marta izoh bilan (6-darsda izohsiz ishlatiladi) · «KEYINGI DARS» bloki olib tashlandi (19-ekranda bor — takror edi) · ikki xil tugma nomi → bitta

## 14 · 4-savol ✅  `[1193]`
- Savol: **Bizning tizimda agent qaysi qismda ishlaydi va nima orqali amal qiladi?**
  - Frontendda — chunki foydalanuvchi uni ko'radi
  - Baza ichida — chunki ma'lumot bilan ishlaydi
  - Tizimdan tashqarida — alohida, bog'lanmagan dastur
  - ✔ Backend ichida — siz bergan tool'lar orqali
- To'g'ri: To'g'ri! Bizning tizimda agent backend ichida ishlaydi. U tizimning bir qismi va faqat siz bergan tool'lar (baza, API, xabar) orqali boshqa qismlarga ta'sir qiladi.
- Xato izohlari:
  - Foydalanuvchi agentni ko'rmaydi — u orqa tomonda (backend) ishlaydi. Frontend faqat natijani ko'rsatadi.
  - Agent baza ichida emas — u backendda turadi va bazani tool orqali ishlatadi.
  - Agent tizim bilan bog'langan — u tool'lar orqali ulanadi.
  - (umumiy) Agent backend ichida, tool'lar orqali amal qiladi.

✎ «qayerda yashaydi» → «qaysi qismda ishlaydi» · «Bizning tizimda» qo'shildi · to'g'ri javob qisqartirildi (oldin eng uzuni edi)

## 15 · Agent sikli ✅ (final)  `[1216]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: agent sikli bosqichlarini to'g'ri tartibda yig'ing.**
- Mentor: Agent vazifani qanday bajaradi? Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar (aralash): Maqsad · Idrok · Qaror · Amal · Natijani tekshir
- Joylar: har katakda raqam (1…5) + «bu yerga qo'ying»
✎ QAROR F-0929-27 (29.09, foydalanuvchi Q1-B): katak izohi «bu yerga qo'ying» — katakda raqam allaqachon bor, «1 · 1-qadam» takrorlanardi; joylashuv ikki ustun (kataklar chapda, bo'laklar o'ngda)
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Tayyor: ✓ Sikl tayyor!
- Blok: 🔁 **Nega tartib muhim?** — Agent avval vaziyatni ko'rmasa (idrok), qaror qila olmaydi; qarorsiz amal qila olmaydi. Amaldan keyin natijani tekshiradi va maqsad bajarilmagan bo'lsa, sikl qaytadan boshlanadi.
- Xulosa: ✓ **Maqsad → Idrok → Qaror → Amal → Natijani tekshir** (maqsadga yetguncha qaytadan aylanadi).

✎ 🔴 Javob ochiq turardi: bo'sh joylarda «Vazifa bosqichi · Kuzat bosqichi · …» tartib bilan yozilgan edi (kodda `FLOW_HINTS`), Mentor ham butun tartibni aytardi → «1-qadam…5-qadam», Mentor gapidan tartib olib tashlandi · «Vazifa» → «Maqsad», «Natijani ko'r / Natija» → «Natijani tekshir» (dars bo'yi bitta nom)

## 16 · Amaliyot  `[2014]`
- Eyebrow: Amaliyot · reja · joy: «loyihangizda»
- Sarlavha: **Loyihangiz uchun AI-agentni rejalashtiring**
- Mentor: Bu topshiriqni o'z loyihangizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Topshiriq: Loyihangizni o'ylang. Unda qaysi vazifa bir necha qadam va asbob talab qiladi? O'sha — agentga nomzod. Uni tanlab, qaysi tool'lar kerakligini va vakolat chegarasini yozing.
- Bosqichlar:
  1. Bir necha qadamli bitta vazifani tanlang (masalan: kelmay qolgan buyurtmani hal qilish)
  2. Agent maqsadini bir jumlada yozing
  3. Agentga qaysi 2–3 tool kerak: baza? tashqi xizmat (API)? xabar?
  4. Har tool uchun bir qatorda yozing: agent u bilan nima qiladi
  5. Vakolat chegarasini belgilang: agent nima qila olmasligi kerak va qaysi amalga odam tasdig'i kerak?
- Tugmalar: o'zgarmaydi

## 17 · Natijalar (podium)  `[1766]` — o'zgarmaydi (umumiy shablon)

## 18 · Takrorlash (kartochkalar)  `[2042]`

| Old tomon | Orqa | Izoh |
|---|---|---|
| Maqsad berilsa, bir necha qadamni tanlab bajaradigan AI qanday ataladi? | AI-agent | Siz bergan tool'lar va chegara doirasida ishlaydi |
| Oddiy AI savolga javoban odatda nima qiladi? | Javob beradi va to'xtaydi | Tizimdagi ma'lumotni o'zi o'zgartirmaydi |
| Agent sikli qaysi uch qadamdan iborat? | Idrok, qaror, amal | Har amaldan keyin natijani tekshiradi |
| Agent chaqira oladigan funksiya nima deyiladi? | Tool (asbob) | Siz yozgan oddiy funksiya |
| Qaysi tool'ni chaqirishni kim tanlaydi? | AI modeli | Tool'ni esa backend kodi bajaradi |
| Agent buyurtma holatini o'qishi uchun qaysi tool kerak? | Baza tool'i | Ma'lumotlar bazasiga so'rov |
| Agent kuryer xizmatidan ma'lumot so'rasa, bu qaysi tool? | API tool'i | API — boshqa xizmat bilan ma'lumot almashish yo'li |
| Agent maqsadga yetmasa nima qiladi? | Siklni qaytadan boshlaydi | Maqsad bajarilguncha davom etadi |
| Agent nima qila olishini kim belgilaydi? | Siz — vakolat chegarasi bilan | Inglizcha: guardrail |
| Xavfli amaldan oldin (masalan, pul qaytarish) nima kerak? | Odamning tasdig'i | Agent buni o'zi hal qilmaydi |
| Bizning tizimda agent qaysi qismda ishlaydi? | Backend'da | Foydalanuvchi uni ko'rmaydi |
| Oddiy tarjima ishiga agent kerakmi? | Yo'q, oddiy AI yetadi | Keraksiz agent — ortiqcha murakkablik |

✎ Qo'shildi: «kim tanlaydi» va «odam tasdig'i» · «Oddiy ishga agent — ortiqcha murakkablik» alohida kartasi oxirgi kartaga qo'shildi

## 19 · Yakun  `[2055]`
- Eyebrow: Tayyor · belgi: ✓ Agentning o'rnini tushundingiz
- Sarlavha: **AI-agent — maqsad sari qadam tashlaydigan tizim qismi.**
- Endi siz bilasiz:
  - Oddiy AI savolga javob beradi; agent maqsad sari bir necha qadamni tanlab bajaradi
  - Agent sikli: idrok → qaror → amal (maqsadga yetguncha)
  - Tool — agent ishlata oladigan funksiya: baza, API, xabar
  - Bizning tizimda agent backend ichida, siz bergan tool'lar orqali ishlaydi
  - Oddiy ishga oddiy AI yetadi; xavfli amalga — vakolat chegarasi va odam tasdig'i
- Uyga vazifa:
  - **Toping** — loyihangizda qaysi vazifa bir necha qadamli? O'sha — agentga nomzod
  - **Tool'lar** — agentga qaysi tool'lar kerak: baza? API? xabar?
  - **Chegara** — agent nima qila olmasligi kerak? Vakolat chegarasini yozing
- 🚀 Keyingi dars — **Claude Skills:** AI va agentga yozma yo'riqnoma berib, uning ishini aniq shakllantirish.

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi (1-darsda tasdiqlangan qoida), mavzuga moslanadi:
- 💬 **Chat vs Agent** — oddiy AI va agent farqini ajratdingiz (4)
- 🧰 **Tool User** — agent tool'lar orqali ishlashini bildingiz (8)
- 📍 **Right Place** — agent tizimning qaysi qismida ishlashini bildingiz (14)
- 🔁 **Agent Loop** — agent siklini to'g'ri tartibda yig'dingiz (15)

✎ «With a Warrant — vakolat chegarasini tushundingiz» 14-ekranga (agent qayerda) bog'langan edi — mos emas edi

**Qisqa takrorlash oynalari (5):**
1. (4) **Oddiy AI javob beradi, agent ish bajaradi:** Oddiy AI — savolga javob beradi va to'xtaydi. · Agent — maqsad oladi va tool'lar bilan bir necha qadam bajaradi. · Farq — amal: agent tizimdagi ma'lumotni tool orqali o'zgartira oladi. · Sinfga savol: Oddiy AI va agentning asosiy farqi nima?
2. (8) **Tool — agentning asbobi:** Tool — siz yozgan funksiya. · Baza, API, xabar — har biri alohida tool. · Agent faqat siz bergan tool'lar orqali amal qiladi. · Sinfga savol: Agent tizimga qanday amal qiladi?
3. (11) **Qachon oddiy AI, qachon agent:** Aniq, bir martalik ish (tarjima, matn) — oddiy AI yetadi. · Bir necha qadam va asbob kerak bo'lsa — agent foydali bo'lishi mumkin. · Oddiy ishga agent — ortiqcha murakkablik. · Sinfga savol: Nega har ishga agent kerak emas?
4. (14) **Agent — backend qismi:** Bizning tizimda agent backend ichida ishlaydi. · U tool'lar (baza, API, xabar) orqali boshqa qismlarga ta'sir qiladi. · Foydalanuvchi uni ko'rmaydi — frontend faqat natijani ko'rsatadi. · Sinfga savol: Agent tizimning qaysi qismida ishlaydi?
5. (15) **Agent sikli — tartib muhim:** Avval maqsad beriladi. · Idrok → qaror → amal. · Natijani tekshiradi — maqsad bajarilmagan bo'lsa, qaytadan. (Maqsad → Idrok → Qaror → Amal → Natijani tekshir) · Sinfga savol: Nega agent sikl bo'ylab ishlaydi?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Oddiy AI va agent o'rtasidagi asosiy farq nima? ✔ Oddiy AI javob beradi; agent qadamlar bilan ishlaydi · Agent chiroyliroq va odob bilan gapiradi · Oddiy AI har doim agentdan tezroq ishlaydi · Ular o'rtasida hech qanday farq yo'q
2. Agent sikli qanday nomlanadi? Kirish → ishlov → chiqish · Boshlash → kutish → tugatish · ✔ Idrok → qaror → amal · Savol → javob → to'xtash
3. Tool nima? Agentning dasturdagi laqabi · ✔ Agent chaqira oladigan funksiya · Do'kondagi mahsulotlar xaritasi · AI'ning telefon raqami
4. Agent bazadan buyurtmalarni o'qishi — bu qaysi tool? ✔ Ma'lumotlar bazasiga so'rov · Foydalanuvchining kirish paroli · Ekran rasmini olish · Video faylni ijro etish
5. Bir martalik, aniq ish (masalan, tarjima) uchun nima yetadi? Bunga ham albatta agent kerak · Hech qaysi biri to'g'ri emas · Ikkalasini birga ishlatish · ✔ Oddiy AI yetadi
6. Bir necha qadam va asbob kerak bo'lgan ish uchun nima foydali? Bitta javobli oddiy AI · Oddiy chiziqli skript · Faqat frontend qismi · ✔ AI-agent
7. Bizning tizimda agent qayerda ishlaydi? Frontendda, foydalanuvchi ko'radigan joyda · ✔ Backend ichida · Baza ichida · Tizimdan butunlay tashqarida
8. Agent tizimga qanday amal qiladi? O'z-o'zidan, hech qanday kodsiz · ✔ Tool'lar orqali: baza, API, xabar · Faqat javob yozib, amalsiz · Ekranni o'zi chizib qo'yib
9. Nega agentga vakolat chegarasi kerak? ✔ U real amal qiladi — xavflisini cheklash kerak · U juda sekin ishlaydi va kuttiradi · U juda ko'p xotira egallaydi · Aslida bunday chegara kerak emas
10. Agentga bir necha qadamni ketma-ket bajarish imkonini nima beradi? Juda katta xotira hajmi · Chiroyli va zamonaviy interfeys · ✔ Maqsadga yetguncha aylanadigan sikl · Juda tez internet aloqasi
11. Har bir vazifaga agent ishlatish nima deyiladi? Bu doim eng to'g'ri yechim · Vaqtni to'g'ri tejash usuli · Tizimni tezlashtirish usuli · ✔ Ortiqcha murakkablik
12. Agent siklining to'g'ri tartibi qanday? Amal → idrok → qaror → maqsad → natija · Qaror → amal → natija → idrok → maqsad · ✔ Maqsad → idrok → qaror → amal → natija · Natija → maqsad → amal → qaror → idrok

✎ «avtonom» (izohsiz) → 10-savol qayta yozildi · 11-savoldagi «hisoblanadi» (kantselyarit) va to'g'ri javobdagi qavsli uzun izoh olib tashlandi · 6-savoldagi «(avtonom)» qo'shimchasi olib tashlandi (to'g'ri javobni ajratib qo'yardi)

---

## B. Bu darsdan tashqariga chiqadigan narsa — takror kod xatosi
Emoji-tozalash codemodi (e4d4ced) `ico` belgisini o'chirgan, kod esa shu belgiga qarab ishlardi. Shu xato **uch darsda** bor:
- **4-dars** (12-ekran) — yorliqlar va tool hisoblagichi buzuq (yuqorida).
- **1-dars** (12-ekran, «To'liq tizim») va **7-dars** (case) — oxirgi qadam yashil «bajarildi» bo'lib yonmaydi (kichik).
Tuzatishda uchalasida ham belgi o'rniga `phase` maydoni qo'yiladi. Bu xato turi tekshiruvchi rol-fayliga ov-bandi bo'ladi.
