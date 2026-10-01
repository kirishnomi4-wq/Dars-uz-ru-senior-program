# 5-Modul (LMS: 7-Modul) · 10-dars «AI-agent yaratish» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotAiAgentLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook:** AI-bot «buyurtmani yubordim» degan, lekin daftarda hech narsa yo'q. O'quvchi «▶ Ikki botni solishtirish» tugmasini bosadi: bir xil so'rovga AI-bot faqat «Albatta, rasmiylashtirdim ✅» deb yozadi, AI-agent esa `saveOrder()` va `arrangeDelivery()` ni chaqiradi. Keyin o'quvchi AI-botga nima yetishmasligini 3 variantdan tanlaydi.
- **Markaziy o'yin/mexanika:** agentni 3 narsadan yig'ish (maqsad · asboblar · chegara, 5-ekran) → vaziyatga mos asbobni tanlash (7-ekran) → xavfli amalda chegara tanlash (9-ekran) → qaysi amal odam ruxsatini talab qilishini belgilash (11-ekran). Oraliqda sikl yuritiladi (3-ekran), avtonom agent kuzatiladi (12-ekran).
- **Asosiy metafora:** Botjon = AI-bot «og'iz» (gapiradi); AI-agent = og'iz + 🧰 asbob sumkasi (asboblar bilan amal qiladi). Asbob = siz yozgan funksiya, chegara = 🧰 sumkadagi cheklov (xavfli amaldan oldin odamdan tasdiq). Sikl: idrok → qaror → amal → natijani ko'r.
- **Yakun:** 5 bo'lakli agent siklini tartiblash (15-ekran) → AI chatda o'z agentingizga maqsad + asboblar + chegara yozish (16-ekran) → podium → 12 kartochka → xulosa, uyga vazifa, arena.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — gapirdi vs qildi | hook | ikki botni solishtiradi, AI-botda nima yetishmasligini tanlaydi | — |
| 1 | Reja | qoida | dars oxiridagi agent namunasi + jihozlar paneli + bugungi 4 qadam | — |
| 2 | AI-bot va AI-agent | tushuncha | 4 farqni bosib ko'radi | — |
| 3 | Agent sikli | tushuncha | siklni 6 qadamda yuritadi (bitta buyurtma — 2 aylanish) | — |
| 4 | 1-savol | test | «Bu nima?» — AI-agent | ✅ |
| 5 | Agentni qurish | markaziy | maqsad / asboblar / chegara qatorlarida to'g'risini tanlaydi | — (🏅) |
| 6 | Sumkadagi asboblar | tushuncha | 4 asbobni ochib o'qiydi | — |
| 7 | To'g'ri asbob | markaziy | 3 vaziyatga mos asbobni tanlaydi | — (🏅) |
| 8 | 2-savol | test | agent ishni qanday bajaradi | ✅ |
| 9 | Xavfli amal | case | 450 000 so'm yechish: tasdiqsizmi yoki tasdiq bilanmi | — (🏅) |
| 10 | 3-savol | test | bitta amaldan keyin agent nima qiladi | ✅ |
| 11 | Amal xavfsizligi | markaziy | 3 amalni «O'zi» / «Ruxsat kerak» deb belgilaydi | — (🏅) |
| 12 | Avtonom agent | hayotiy | agentning 8 ichki qadamini kuzatadi | — |
| 13 | Chegaralar | tushuncha | 3 chegarani ochib o'qiydi | — |
| 14 | 4-savol | test | pul yechishdan oldin nima muhim | ✅ |
| 15 | Siklni yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · AI-agent | praktika | AI chatda agent yo'riqnomasini yozadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa + arena | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta (4, 8, 10, 14, 15-ekran uchun); nishonlar — 4 ta (5, 7, 9, 11-ekran).

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
Botjon · AI-bot = og'iz (gapiradi) · AI-agent = og'iz + 🧰 sumka · 🧰 asbob sumkasi / sumka · asbob / asboblar (tools, funksiya) ·
Vositalar (jihoz paneli, 1-ekran) · maqsad · idrok → qaror → amal · natijani ko'r · sikl / aylanadi (loop) ·
mustaqillik (avtonomlik) · chegara (guardrail / guardrails) · tasdiq so'rash · odam nazorati (human-in-loop) · direktor (siz) ·
daftar / doimiy daftar (baza) · reaktiv / proaktiv · checkOrder · saveOrder · arrangeDelivery · notifyUser · chargeCard

---

## 0 · Kirish — gapirdi vs qildi  `[799]`
- Eyebrow: Loyiha · kirish
- Sarlavha: **AI-bot «buyurtmani yubordim» dedi. Lekin daftarda hech narsa yo'q. Nima yetishmaydi?**
- Mentor: O'tgan darsni eslang: AI-bot chiroyli javob yozadi, lekin amal qilmaydi. Tugmani bosing — bir vaziyatda AI-bot va AI-agent qanday farq qilishini ko'ring.
- Chat 1 — **AI-bot (faqat gapiradi)** · holat: bot · reaktiv
  - mijoz: «Buyurtmamni rasmiylashtir» → (bosilgach) bot: «Albatta, rasmiylashtirdim ✅»
- Chat 2 — **AI-agent (amal qiladi)** · holat: bot · proaktiv
  - mijoz: «Buyurtmamni rasmiylashtir» → (bosilgach) bot: «saveOrder() ✅ Buyurtma daftarga yozildi, arrangeDelivery() ✅ yetkazish rejalashtirildi 📦»
- Tugma: ▶ Ikki botni solishtirish → ✓ Solishtirildi
- Bosilgach ogohlantirish: 📓 Daftar: **hech narsa yozilmadi** — faqat matn chiqdi.
- Savol (tugma bosilmaguncha xira): **AI-botda nima yetishmaydi?**
  - Bot buzilgan — kodda xato bor
  - AI-bot faqat gapiradi — amal qilish uchun unga maqsad va 🧰 sumka (asboblar) kerak
  - Internet sekin ishlagan
- Javobdan keyin (qaysi variant tanlansa ham bir xil): Aynan! AI-bot — og'iz (gapiradi). **AI-agent** — og'iz + 🧰 sumka (asboblar bilan AMAL qiladi). Bugun botingizga maqsad, asboblar va sikl beramiz.
- Tugma: Davom etish

## 1 · Reja  `[845]`
- Eyebrow: Reja
- Sarlavha: **Botjon endi gapiribgina qolmay — ish bajaradi.**
- Mentor: Hozirgacha Botjon javob yozardi. Bugun uning yelkasiga 🧰 **asbob sumkasi** ilinadi — u maqsad sari o'zi amal qiladi: idrok → qaror → amal. Bu — modulning cho'qqisi. Yangi jihoz yondi: 🧰 **Vositalar**.
- Blok: dars oxirida — o'zi ish bajaradigan agent
  - Chat **AI-agent** · holat: agent · proaktiv 🟢
  - mijoz: «2 dona A-model, Chilonzor 5» → bot: «Tekshirdim ✓ saqladim ✓ yetkazishni rejaladim ✓ — 30 daqiqada yetkazamiz 📦»
  - Siz bitta maqsad berdingiz — agent o'zi qadamlarni topib, hammasini bajardi. Mana shuni quramiz.
- Jihozlar paneli (yonganlari — «AI yordamchi»dan boshqa hammasi): Kalit · Qoidalar varag'i · Tugmalar · Konvert (ctx) · Holat daftari · Yo'l-yo'riq · Vositalar · AI yordamchi
- Bugungi 4 qadam:
  1. AI-bot → AI-agent: gapirishdan amalga · *farq*
  2. Sikl: idrok → qaror → amal (loop) · *sikl*
  3. 🧰 Asboblar (tools) — agentning qo'li · *qo'l*
  4. Maqsad + chegaralar bilan agent qurish · *qurish*
- Tugmalar: (telefonda) 4 qadamni ko'rish / ↩ Natijani ko'rish · Boshlaymiz →

## 2 · AI-bot va AI-agent  `[885]`
- Eyebrow: Tushuncha · farq
- Sarlavha: **AI-bot va AI-agent — eng muhim farq.**
- Mentor: Bu darsning asosi shu. AI-bot javob yozadi va to'xtaydi. AI-agent maqsadga qarab qadam-baqadam **amal qiladi**. Har jihatni bosib, farqni ko'ring.
- Jihatlar (bosilganda ikki karta: 💬 AI-bot · 🧰 AI-agent):
  - **Qanday ishlaydi?** — 💬 reaktiv — javob yozadi · 🧰 proaktiv — maqsad sari amal qiladi
  - **Necha qadam?** — 💬 bir martalik (xabar → javob) · 🧰 ko'p qadam — maqsadga yetguncha sikl
  - **Nimasi bor?** — 💬 faqat og'iz (gapiradi) · 🧰 og'iz + 🧰 sumka (asboblar bilan amal)
  - **Siz nima berasiz?** — 💬 har javob uchun ko'rsatma · 🧰 maqsad — qadamlarni o'zi topadi
- Xulosa (4 tasi ochilgach): Bir jumla: **AI-bot gapiradi, AI-agent qiladi.** Bot — bir martalik javob; agent — maqsadga yetguncha amallar sikli.
- Tugma: 4 farqni ko'ring (0/4) → Davom etish

## 3 · Agent sikli  `[921]`
- Eyebrow: Tushuncha · sikl
- Sarlavha: **Agentning asosi: idrok → qaror → amal, va u aylanadi.**
- Mentor: Agent bir martada to'xtamaydi — u **aylanadi**: ko'radi, qaror qiladi, amal qiladi, natijani ko'radi va yana. Tugmani bosib, bitta buyurtma uchun sikl ikki marta aylanishini kuzating.
- Oqim yorlig'i: Idrok → Qaror → Amal → qayta
- Tugma: ▶ Siklni boshlash → Keyingi qadam → … → ✓ Sikl aylandi
- Qadamlar (har bosishda bittasi, sarlavhasi — bosqich nomi):
  1. **Idrok** — Mijoz: «2 dona A-model». Agent xabarni va daftardagi holatni o'qiydi.
  2. **Qaror** — Maqsad — buyurtmani qabul qil. Avval ro'yxatda bormi? → checkOrder tanlanadi.
  3. **Amal** — sumkadan checkOrder() olindi → «A-model mavjud» natijasi qaytdi.
  4. **Idrok** — Natija keldi: mahsulot bor. Agent holatni qayta baholaydi.
  5. **Qaror** — Endi buyurtmani saqlash kerak → saveOrder tanlanadi.
  6. **Amal** — sumkadan saveOrder() olindi → buyurtma doimiy daftarga yozildi ✅.
- Karta: **🔁 Nega aylanadi?** — Har amaldan keyin natija paydo bo'ladi — agent uni **ko'radi** (idrok) va maqsadga yetmagan bo'lsa, **keyingi qadamni** tanlaydi. Maqsad bajarilguncha davom etadi.
- Xulosa: Ko'rdingiz: bitta buyurtma uchun agent ikki marta aylandi (tekshir → saqla). Mana shu — agentning mustaqilligi (avtonomlik).
- Tugma: Siklni yuriting (0/6) → Davom etish

## 4 · 1-savol ✅  `[951]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Bot xabarni o'qib, ro'yxatni tekshirdi, daftarga yozdi va yetkazishni rejaladi. Bu nima?**
  - AI-bot — har qanday bot aslida shu tarzda ishlaydi
  - Oddiy kalkulyator — u shunchaki sonlarni hisoblaydi
  - ✔ AI-agent — maqsad sari real amallar bajardi
  - Rule-bot — oldindan yozib qo'yilgan tayyor javoblar to'plami
- To'g'ri: To'g'ri! Bu agent: u matn yozish bilan cheklanmadi, balki maqsadga (buyurtmani qabul qil) erishish uchun ketma-ket amallar bajardi — 🧰 sumkadan asboblarni oldi. AI-bot esa faqat javob matnini yozardi.
- Xato izohlari:
  - (A) AI-bot faqat matn yozadi — amal qilmaydi. Bu bot esa real ish bajardi — demak agent.
  - (B) Kalkulyator hisoblaydi, lekin maqsad sari qaror chiqarib amal qilmaydi. Bu — AI-agent.
  - (D) Rule-bot tayyor javoblar beradi, amal qilmaydi. Bu agent — ketma-ket amallar bajardi.
  - (umumiy) Maqsad sari amallar bajargan — bu AI-agent.
- Test ekranlarining umumiy yozuvlari (4, 8, 10, 14-ekran): tugma «To'g'ri javobni toping» → «Davom etish» · xato bosilsa «Qaytadan urinib ko'ring» · to'g'ri bo'lsa «To'g'ri» · birinchi javob xato bo'lsa havola «📖 Qisqa takrorlash — mavzuni yana bir ko'rish» · jonli darsda: «⚡ Jonli dars — bitta urinish, o'ylab bosing!» → «📨 Javobingiz qabul qilindi» / «Hozir to'g'ri javobni bilib olasiz.» → «To'g'ri javob: C — …» · tugma «Javob tanlang»

## 5 · Agentni qurish (markaziy)  `[966]`
- Eyebrow: Markaziy · qurish
- Sarlavha: **Agentni 3 narsa bilan quring: maqsad, asboblar, chegara.**
- Mentor: Siz direktorsiz — agentni ta'riflaysiz: nima qilsin (maqsad), nima bilan (asboblar), nimaga ruxsat yo'q (chegara). Har qatorda to'g'ri variantni tanlab, agentni yig'ing. Noto'g'ri variant ham bor — diqqat bilan tanlang.
- **Maqsad?**
  - ✔ Buyurtmani qabul qilib, yetkazishga tayyorlash
  - Har savolga o'zim javob yozib berish
  - Faqat salomlashish
- **Asboblar?**
  - ✔ checkOrder, saveOrder, arrangeDelivery, notifyUser
  - Hech qanday asbob — faqat gaplashsin
  - Faqat bitta asbob — qolgani kerak emas
- **Chegara?**
  - ✔ Xavfli amaldan (to'lov, bekor) oldin odamdan tasdiq so'rasin
  - Hamma narsani tasdiqsiz o'zi bajaraversin
  - Hech qanday amal qilmasin
- O'ng tomonda: yig'ilayotgan agent yo'riqnomasi · karta «🧰 AGENT»: MAQSAD: … . ASBOBLAR: … . QOIDA: … . (tanlangan variantlar bilan to'ladi)
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- Xato bo'lsa: Ba'zi javoblar hali noto'g'ri — ✗ belgisini toping va to'g'risini tanlang.
- Muvaffaqiyat: Zo'r! Agentga aniq ish yo'riqnomasi berildi: **maqsad + asboblar + chegara**. Bu — har agentning skeleti.
- Tugma: Agentni yig'ing → Davom etish

## 6 · Sumkadagi asboblar  `[1011]`
- Eyebrow: Asboblar · sumka
- Sarlavha: **Sumkadagi asboblar (tools) — agentning qo'li.**
- Mentor: Agent amalni «asbob» orqali qiladi — bular siz yozgan funksiyalar. AI o'zi gapira oladi, lekin **ish qilish uchun asboblar** kerak. Har asbobni bosib ko'ring.
- Asboblar (bosilganda izoh):
  - `checkOrder()` — Buyurtma holatini yoki mahsulot borligini tekshiradi.
  - `saveOrder()` — Buyurtmani doimiy daftarga (bazaga) yozadi.
  - `arrangeDelivery()` — Yetkazishni rasmiylashtiradi.
  - `notifyUser()` — Mijozga xabar yuboradi.
- Xulosa (4 tasi ochilgach): Asboblar — agentga bergan **qo'l**laringiz. Qancha asbob solsangiz — shuncha ish qila oladi (lekin ehtiyot bo'ling — keyin ko'ramiz).
- Tugma: 4 asbobni oching (0/4) → Davom etish

## 7 · To'g'ri asbob (markaziy)  `[1043]`
- Eyebrow: Qaror · tanlash
- Sarlavha: **«Qaror» qadami: vaziyatga qarab to'g'ri asbobni tanlang.**
- Mentor: Haqiqiy agentda qaysi asbobni chaqirishni AI o'zi tanlaydi. Hozir siz uning o'rnida sinab ko'ring: har vaziyatga mos asbobni 🧰 sumkadan oling.
- Karta: 🎯 Vaziyat 1/3 (birma-bir):
  1. «Buyurtmam tayyormi?» — avval holatni bilish kerak → ✔ `checkOrder()`
  2. Mijoz to'lovni tasdiqladi — endi yozib qo'yish kerak → ✔ `saveOrder()`
  3. Buyurtma yozildi — endi yetkazishni rasmiylashtirish kerak → ✔ `arrangeDelivery()`
- O'ng tomonda: qaysi asbobni chaqirasiz? · `checkOrder()` · `saveOrder()` · `arrangeDelivery()` · `notifyUser()`
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- Xato bo'lsa: Bu vaziyatga mos emas — vaziyatni qayta o'qing va boshqa asbobni tanlang.
- Muvaffaqiyat: Hammasi to'g'ri! Har vaziyatga mos asbobni tanladingiz — aynan shu «qaror» qadami agentni aqlli qiladi.
- Tugma: Asbobni tanlang (0/3) → Davom etish

## 8 · 2-savol ✅  `[1088]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **AI-agent biror ishni qanday bajaradi?**
  - ✔ Maqsadga mos asbobni (funksiyani) tanlab chaqiradi
  - Faqat matn yozib beradi — qolgan ishni odam qiladi
  - Hech qanday kodsiz, o'z-o'zidan bajaradi
  - Har doim bitta oldindan belgilangan amalni qiladi
- To'g'ri: To'g'ri! Agent amalni asboblar (siz yozgan funksiyalar) orqali qiladi. AI vaziyatni ko'rib, maqsadga mos asbobni tanlaydi va chaqiradi — masalan saveOrder(). Tanlash AI'da, bajarish — asbobda.
- Xato izohlari:
  - (B) Faqat matn yozish — bu AI-bot. Agent matndan tashqari real amal (asbob chaqirish) qiladi.
  - (C) Asboblar — siz yozgan oddiy funksiyalar. AI faqat qaysi birini ishlatishni tanlaydi.
  - (D) Aksincha — agent vaziyatga qarab har xil asbobni tanlaydi. Bitta qotib qolgan amal — bu agent emas.
  - (umumiy) Agent maqsadga mos asbobni tanlab chaqiradi.

## 9 · Xavfli amal (case)  `[1103]`
- Eyebrow: Xavfsizlik · chegara
- Sarlavha: **Agent xavfli amal qilmoqchi — nima to'g'ri?**
- Mentor: Agent real ishlarni bajaradi — jumladan pul bilan. Xato qilsa, oqibati real bo'ladi. Bu vaziyatda to'g'ri chegarani tanlang.
- Karta: **💳 Vaziyat** — Agent mijozning kartasidan **450 000 so'm** yechmoqchi (chargeCard). Bu — xavfli amal.
- Savol: qaysi chegara to'g'ri?
  - Agent o'zi, tasdiqsiz yechib yuboraversin
  - ✔ Avval odamdan (mijoz/admin) tasdiq so'rasin
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (bitta urinish; xato bo'lsa: «Nishon birinchi urinish uchun edi.»)
- To'g'ri: ✓ To'g'ri! Pul yechish — xavfli amal. 🧰 Sumkadagi chegara (guardrail) shuni talab qiladi: xavfli amaldan oldin odamdan tasdiq so'ralsin.
- Xato: Tasdiqsiz pul yechish xavfli — agent xato qilsa, real zarar. To'g'ri yo'l: xavfli amaldan oldin odam tasdig'i.
- Tugma: Qarorni tanlang → Davom etish

## 10 · 3-savol ✅  `[1137]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Agent bitta amalni bajardi (buyurtmani saqladi). Endi nima qiladi?**
  - Darrov to'xtaydi — bitta amal doimo yetarli bo'ladi
  - Foydalanuvchidan keyingi buyruq berishini kutib turaveradi
  - Hammasini boshidan, butunlay noldan qayta boshlab yuboradi
  - ✔ Natijani ko'radi va keyingi qadamni tanlaydi
- To'g'ri: To'g'ri! Agentni avtonom qiladigan narsa shu: u amaldan keyin natijani ko'radi (idrok) va maqsad bajarilmagan bo'lsa keyingi qadamni tanlaydi. Saqladi → endi yetkazishni rejalash kerak → sikl davom etadi.
- Xato izohlari:
  - (A) Bitta amal kamdan-kam yetarli. Maqsadga yetguncha agent sikl bo'ylab davom etadi.
  - (B) Buyruq kutish — bu reaktiv AI-bot. Agent maqsad sari o'zi davom etadi, kutib turmaydi.
  - (C) Noldan boshlamaydi — u qilingan ishni hisobga olib, keyingi qadamga o'tadi.
  - (umumiy) Natijani ko'radi va sikl davom etadi.

## 11 · Amal xavfsizligi (markaziy)  `[1152]`
- Eyebrow: Markaziy · xavfsizlik
- Sarlavha: **Qaysi amalni agent o'zi, qaysini odam ruxsati bilan bajarsin?**
- Mentor: Har amalni ko'rib chiqing: xavfsizmi (agent o'zi bajaraversin) yoki xavflimi (avval odamdan ruxsat so'ralsin)? Har amalni belgilang.
- Amallar (har qatorda 2 tugma: 🛠️ O'zi · ✋ Ruxsat kerak; bitta urinish):
  - Buyurtma holatini tekshirish — checkOrder() → ✔ 🛠️ O'zi
  - Mijoz kartasidan pul yechish — chargeCard() → ✔ ✋ Ruxsat kerak
  - Mijozga «qabul qilindi» xabari — notifyUser() → ✔ 🛠️ O'zi
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (xato bo'lsa: «Nishon birinchi urinish uchun edi.»)
- Hammasi to'g'ri: ✓ Ajoyib! Pul yechish — xavfli, odam ruxsati kerak. Tekshirish va xabar — xavfsiz, agent o'zi bajaraveradi. Mana guardrail mantig'i.
- Xato bo'lsa: Diqqat: pul yechish (chargeCard) — xavfli, odam ruxsatini talab qiladi. Oddiy tekshirish va xabar — xavfsiz, o'zi bajaraveradi.
- Tugma: Har amalni belgilang (0/3) → Davom etish

## 12 · Avtonom agent (hayotiy)  `[1196]`
- Eyebrow: Hayotiy · avtonom agent
- Sarlavha: **Bitta maqsad — agent qolganini o'zi bajaradi.**
- Mentor: Mijoz bitta xabar yozdi. Agent endi sikl bo'ylab o'zi yuradi: ko'radi, qaror qiladi, 🧰 sumkadan asbob oladi — maqsadga yetguncha. Tugmani bosib, har qadamni kuzating.
- Chap: agent ichki qadamlari (sahna ortida):
  1. **Idrok** — Mijoz: «2 dona A-model, Chilonzor 5». Agent xabarni o'qidi.
  2. **Qaror** `checkOrder()` — Avval ro'yxatda bormi — tekshiraman.
  3. **Amal** `checkOrder()` — checkOrder() → «A-model mavjud» ✅
  4. **Qaror** `saveOrder()` — Bor ekan — buyurtmani saqlayman.
  5. **Amal** `saveOrder()` — saveOrder() → buyurtma daftarga yozildi ✅
  6. **Qaror** `arrangeDelivery()` — Saqlandi — endi yetkazishni rejalayman.
  7. **Amal** `arrangeDelivery()` — arrangeDelivery() → yetkazish rejalashtirildi 📦✅
  8. **Tayyor** — Maqsadga yetildi. Mijozga javob yuboriladi.
- Tugma: ▶ Agentni ishga tushirish → Keyingi qadam → … → ✓ Maqsadga yetildi
- O'ng: mijoz ko'radigan chat · **AI-agent** · agent · proaktiv 🟢
  - mijoz: «2 dona A-model, Chilonzor 5» → (oxirida) bot: «2 dona A-model qabul qilindi ✅ Chilonzor 5 manziliga ~30 daqiqada yetkazamiz 📦»
- Karta: **🧰 Chaqirilgan asboblar** — hali yo'q → (qadamlar bilan to'ladi) checkOrder() · saveOrder() · arrangeDelivery()
- Xulosa: Mijoz bitta gap yozdi — agent 3 ta asbobni o'zi chaqirdi va ishni bajardi. Mana AI-agent kuchi.
- Tugma: Agentni kuzating (0/8) → Davom etish

## 13 · Chegaralar  `[1248]`
- Eyebrow: Xavfsizlik · chegaralar
- Sarlavha: **Amal qiladigan agent — kuchli, lekin xavfli. Chegara qo'ying.**
- Mentor: Agent real ishlar qiladi: pul, xabar, o'chirish. Xato qilsa — oqibati real. Shuning uchun direktor 🧰 sumkaga **chegara** qo'yadi. Har birini bosing.
- Chegaralar (bosilganda izoh):
  - **Cheklangan asboblar** — Sumkaga faqat kerakli asboblarni soling. «Pul qaytarish» yoki «o'chirish» kabilarni bermang — ishlata olmaydi.
  - **Tasdiq so'rash** — Xavfli amaldan (to'lov, bekor qilish) oldin mijoz yoki admin tasdig'ini so'rasin.
  - **Odam nazorati** — Murakkab yoki shubhali holatni odamga uzatsin (human-in-loop) — hammasini o'zi hal qilmasin.
- Xulosa (3 tasi ochilgach): Avtonomlik + chegara = ishonchli agent. Erkinlikni asta-sekin, ishonch ortgani sari kengaytirasiz.
- Tugma: 3 chegarani ko'ring (0/3) → Davom etish

## 14 · 4-savol ✅  `[1280]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Agent real pul yechadigan amal qilishidan oldin nima muhim?**
  - Hech narsa — agentga hamma ishda to'liq erkinlik berib qo'yish kerak
  - ✔ Chegara: ruxsat etilgan asboblar va xavfli amalga tasdiq
  - Agentni bunday ishlarda umuman ishlatmaslik kerak
  - Faqat javob berish tezligini iloji boricha oshirish
- To'g'ri: To'g'ri! Amal qiladigan agent xato qilsa, oqibati real (pul, mijoz). Shuning uchun chegara qo'yiladi: cheklangan asboblar, xavfli amaldan oldin tasdiq, kerakli joyda odam nazorati (human-in-loop). Bu — har avtonom tizimda muhim.
- Xato izohlari:
  - (A) To'liq erkinlik xavfli — agent xato qilsa real zarar. Chegara shart.
  - (C) Ishlatmaslik — yechim emas. To'g'ri yo'l: chegara bilan xavfsiz ishlatish.
  - (D) Tezlik bu yerda asosiy emas — xavfsizlik (chegara, tasdiq) muhim.
  - (umumiy) Chegara qo'yish: ruxsat etilgan asboblar va tasdiq/odam nazorati.

## 15 · Siklni yig'ing ✅ (final)  `[1295]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: AI-agent siklini to'g'ri tartibda yig'ing.**
- Mentor: Agent qanday ishlaydi? Maqsad oladi, holatni ko'radi, asbob tanlaydi, amal qiladi va natijani ko'rib qaytadi. To'g'ri tartibni yig'ing.
- Bo'laklar (aralash): Maqsad · Idrok · Qaror · Amal · Natijani ko'r
- Uyachalar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- Xato (hamma uyacha to'lib, tartib noto'g'ri): ⚠️ Tartib xato — qayta joylang. · (bo'laklar tugaganda) Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- To'g'ri: ✓ AI-agent sikli tayyor!
- Xulosa: ✓ Tartib: **Maqsad → Idrok → Qaror → Amal → Natijani ko'r** — va maqsadga yetguncha qayta aylanadi. Mana AI-agent.
- Tugma: Siklni yig'ing → Davom etish
- (Bu ekranda «📖 Qisqa takrorlash» havolasi YO'Q — 5-takrorlash oynasi «AI-agent sikli» ochilmaydi, qarang: belgilar/shubhali)

## 16 · Amaliyot · AI-agent  `[2122]`
- Eyebrow: Amaliyot · AI-agent
- Sarlavha: **O'z agentingiz uchun maqsad + asboblar + chegara yozing**
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: AI chat (masalan, Claude yoki ChatGPT) oching. O'z botingiz (yoki istalgan mavzu) uchun agent yo'riqnomasini yozing: MAQSAD (nima qilsin), ASBOBLAR (3-4 funksiya), CHEGARA (qaysi amal xavfli — odam tasdig'i kerak). Keyin AI'dan agent qaysi tartibda ishlashini so'rang.
- Bosqichlar — belgilab boring:
  1. AI chat sahifasini oching (masalan, `claude.ai`)
  2. MAQSAD yozing: agent nimaga erishishi kerak (masalan, buyurtmani qabul qilish)
  3. 3-4 ASBOB (funksiya) ro'yxatini yozing: masalan checkOrder, saveOrder, notifyUser
  4. CHEGARA belgilang: qaysi amal xavfli (pul) — undan oldin odamdan tasdiq so'ralsin
  5. AI'dan agent idrok → qaror → amal siklini qanday yurishini tushuntirishni so'rang
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · (bajarilmaguncha) Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1868]`
- Eyebrow: Natijalar · Sarlavha: **Kim g'olib?**
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (x/5 to'g'ri) · 🏆 To'liq reyting · Davom etish

## 18 · Takrorlash (kartochkalar)  `[2150]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Maqsad sari o'zi amal qiladigan botni nima deb ataymiz? | AI-agent | sumkadan asbob olib real ish bajaradi |
| Faqat javob yozib, hech narsa qilmaydigan bot qanday ataladi? | AI-bot | bir javob berib to'xtaydi |
| Agent sikli qaysi uch qadamdan iborat? | Idrok, qaror, amal | maqsadga yetguncha qayta aylanadi |
| Agent hozir nima bo'layotganini qaysi qadamda o'qiydi? | Idrok qadamida | xabar va daftardagi holat o'qiladi |
| Qaysi asbobni ishlatishni agent qaysi qadamda tanlaydi? | Qaror qadamida | tanlovni maqsadga qarab AI qiladi |
| Agent asbobni chaqirib, ishni qaysi qadamda bajaradi? | Amal qadamida | masalan saveOrder chaqiriladi |
| Agent chaqiradigan funksiya nima deb ataladi? | Asbob | tool — sumkadagi har bir funksiya |
| Agentga qadamlar beriladimi yoki maqsadmi? | Maqsad | qadamlarni agent o'zi topadi |
| Agent bitta amaldan keyin nima qiladi? | Natijani ko'radi | maqsad bajarilmasa, sikl qayta aylanadi |
| Agentga qo'yiladigan xavfsizlik chegaralari qanday ataladi? | Guardrails | sumkaga faqat kerakli asboblar solinadi |
| Pul yechish kabi xavfli amaldan oldin agent nima so'raydi? | Odam tasdig'ini | tasdiqsiz xavfli amal bajarilmaydi |
| Muhim qarorni odam nazorat qiladigan tamoyil nima deyiladi? | Human-in-loop | shubhali holat odamga uzatiladi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · 🎉 Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2163]`
- Eyebrow: Tayyor · belgi: ✓ Botjon ish bajaradi
- Sarlavha: **Endi Botjon gapiribgina qolmay — o'zi ish bajaradi (AI-agent).** · yonida ball-halqasi (x/5)
- CodeStrike arena tugmasi (jonli darsda: ⏳ Mentorni kuting)
- Endi siz bilasiz:
  - AI-bot gapiradi, AI-agent 🧰 sumkadan asboblarni olib ISH BAJARADI
  - Agent sikli: idrok → qaror → amal → natijani ko'r — maqsadga yetguncha aylanadi
  - Asbob (tool) — agent chaqiradigan funksiya; AI qaysi asbobni ishlatishni tanlaydi
  - Agentga qadam emas, MAQSAD berasiz — qadamlarni u o'zi topadi
  - Guardrails: cheklangan asboblar, xavfli amaldan oldin odam tasdig'i (human-in-loop)
- Uyga vazifa (tugma: «Uyga vazifa · Amaliy topshiriqni bajarish →», suzuvchi so'zlar: amaliyot · loyiha · mashq · natija):
  - **Loyihalang** — o'z botingiz uchun bitta maqsad va 3-4 ta asbob (funksiya) yozing
  - **Chegaralang** — qaysi amal xavfli (pul, o'chirish)? Unga odam tasdig'i yoki taqiq qo'ying
  - **Quring** — AI'ga maqsad + asboblar + chegarani bering va agent siklini sinab ko'ring
- 🚀 Keyingi dars — Botjon o'z javobidan fikr-mulohaza (fidbek) asosida o'zini yaxshilashni o'rganadi!
- 🏅 Nishonlaringiz — N/4 (olinmaganlari 🔒)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):**
- 🧰 **Cycle Builder** — Idrok → qaror → amal rejasini yig'dingiz (5-ekran «Agentni qurish»)
- 🔧 **Tool Picker** — Vaziyatga to'g'ri asbobni (tool-call) tanladingiz (7-ekran)
- 🛡️ **Guardrail Keeper** — Agentga chegara (guardrail) qo'ydingiz (9-ekran)
- ✋ **Safe Actor** — Qaysi amal odam ruxsatini so'rashini bildingiz (11-ekran)

Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · (bitta urinishli ekranda) Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (5)** — oyna yozuvlari: 📖 Qayta tushuntirish · 🗣️ Sinfga savol: · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz · Yopish
1. **AI-bot va AI-agent farqi** (4-ekran): 💬 Bot gapiradi — AI-bot faqat javob **matnini** yozadi — real amal qilmaydi. · 🧰 Agent qiladi — AI-agent maqsad sari 🧰 sumkadan **asboblarni** olib real amal bajaradi. · 🔁 Bir martalik vs sikl — Bot bir javob berib to'xtaydi; agent maqsadga yetguncha sikl bo'ylab aylanadi. · Savol: AI-bot bilan AI-agent orasidagi asosiy farq nima?
2. **Agent qanday amal qiladi** (8-ekran): 👁️ Idrok — Agent xabar va daftardagi holatni **o'qiydi** — hozir nima bo'layapti. · ⚖️ Qaror — AI maqsadga qarab qaysi **asbobni** ishlatishni tanlaydi. · 🛠️ Amal — Tanlangan asbobni chaqiradi (masalan saveOrder) va natijani oladi. · Savol: Agent amalni nima orqali bajaradi?
3. **Sikl — nega aylanadi** (10-ekran): 👁️ Natijani ko'radi — Har amaldan keyin agent **natijani** ko'radi (yana idrok). · 🎯 Maqsad tekshiriladi — Maqsad bajarilmagan bo'lsa — agent keyingi qadamni tanlaydi. · 🔁 Loop — Maqsadga yetguncha idrok → qaror → amal qayta aylanadi. · Savol: Agent bitta amaldan keyin nima qiladi?
4. **Guardrails — 🧰 sumkadagi chegaralar** (14-ekran): 🧰 Cheklangan asboblar — Sumkaga faqat **kerakli** asboblarni soling — xavflisini bermang. · ✋ Tasdiq so'rash — Xavfli amaldan (to'lov, bekor) oldin odamdan **tasdiq** so'ralsin. · 🧑‍💼 Odam nazorati — Shubhali holatni odamga uzat (human-in-loop) — hammasini o'zi hal qilmasin. · Savol: Agent pul yechishdan oldin nima qilishi kerak?
5. **AI-agent sikli** (15-ekran): 🎯 Maqsad → Idrok — Agent vazifa oladi va holatni **ko'radi**. · ⚖️ Qaror → Amal — AI asbob tanlaydi va uni **chaqiradi**. · 🔁 Natijani ko'r — Tugamasa — qayta idrok. · oqim: Maqsad → Idrok → Qaror → Amal → 🔁 Natijani ko'r · Savol: Agent sikli qaysi qadamdan boshlanadi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. AI-bot va AI-agent orasidagi asosiy farq nima? Bot rangi va shrifti butunlay boshqacha bo'ladi · ✔ Bot gapiradi, agent asbob bilan amal qiladi · Ular orasida hech qanday farq mavjud emas · Agent har doim botdan sekinroq ishlaydi
2. AI-agentning «amal» qadami nima? Foydalanuvchini jimgina kutib turish · Shunchaki salom berib qo'yish va kutish · O'zini o'chirib qo'yib, butun ishni to'xtatish · ✔ Asbobni (funksiyani) chaqirib ish bajarish
3. «Tool» (asbob) nima? ✔ Agent chaqiradigan funksiya (saveOrder) · Botning rang va shrift sozlamasi · Server joylashgan aniq manzil (IP-raqam) · Internetga ulanish tezligi
4. Agent qaysi asbobni ishlatishni qanday hal qiladi? Har doim ro'yxatdagi eng birinchisini oladi · Tasodifan, tavakkaliga tanlaydi · ✔ AI maqsad va holatga qarab tanlaydi · Hech qachon o'zi tanlamaydi — odam tanlaydi
5. Agent bitta amalni bajardi. Endi nima qiladi? Darrov butunlay to'xtab qoladi · ✔ Natijani ko'radi va maqsadga yetmasa davom etadi · Hammasini noldan boshdan qayta boshlaydi · Foydalanuvchining keyingi buyrug'ini kutib qoladi
6. Agentga qadam emas, nima beriladi? ✔ Maqsad — qadamlarni o'zi topadi · Har bir javobning aniq to'liq matni · Serverning maxfiy paroli · Faqat rang va shrift sxemasi
7. Guardrails (chegaralar) nima uchun kerak? Botni foydalanuvchiga chiroyliroq ko'rsatish uchun · Javob berish tezligini oshirish uchun · Chiroyli rang tanlab qo'yish uchun · ✔ Xavfli amaldan (masalan pul) himoya qilish uchun
8. Agent pul yechadigan xavfli amaldan oldin nima qilishi kerak? Hech narsa — tasdiqsiz o'zi yechaversin · ✔ Odamdan (mijoz/admin) tasdiq so'rash · Botni butunlay o'chirib qo'yish · Imkon boricha tezroq yechib olish
9. Human-in-loop nimani anglatadi? Agent hamma ishni butunlay yolg'iz bajaradi · Odam jarayonga umuman aralashmaydi · ✔ Muhim qarorda odam nazorat qiladi · Foydalanuvchi butunlay bloklanadi
10. «Cheklangan asboblar» chegarasi nimani bildiradi? Asboblar ancha sekinroq ishlab qoladi · Barcha asboblar bepulga aylanadi · Mavjud barcha asboblar unga berilishi shart · ✔ Sumkaga faqat kerakli asboblar solinadi
11. AI-agent siklining to'g'ri tartibi qanday? ✔ Idrok → Qaror → Amal → Natijani ko'r → (qayta) · Amal → Idrok → Maqsad → Qaror · Qaror → Natija → Idrok → Amal · Faqat bitta Amal — boshqa qadam yo'q
12. AI-agentda «qaror» qadamini kim bajaradi? Foydalanuvchi har safar buni qo'lda qiladi · Umuman hech kim bajarmaydi · ✔ AI — qaysi asbobni ishlatishni tanlaydi · Asbobning o'zi mustaqil hal qiladi

Arena fonida suzuvchi so'zlar: agent · 🧰 · tool-call · idrok · qaror · amal · guardrails · 🛡️ · ✗ · ✓ · tashqi xizmat · 🔧 · sikl · ✋
Podium nuqtalari yorlig'i (sichqoncha ustiga olib borilganda): 1 — Agent nima · 2 — Tool-call · 3 — Tashqi xizmat · 4 — Guardrails · 5 — Agent sikli

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **Keyingi dars matni zid** — 19-ekran: «🚀 Keyingi dars — Botjon o'z javobidan fikr-mulohaza (fidbek) asosida o'zini yaxshilashni o'rganadi!» — bu 9-dars «Fikr va iteratsiya» mavzusi (o'tib bo'lgan). App.jsx bo'yicha keyingisi — 11-dars PM «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?». Shu ekrandagi belgi «Botjon ish bajaradi» ham App.jsx nomi («AI-agent yaratish») bilan bir xil emas.
- **«O'tgan darsni eslang» zid** — 0-ekran Mentor: «O'tgan darsni eslang: AI-bot chiroyli javob yozadi, lekin amal qilmaydi.» — o'tgan dars 9-dars «Fikr va iteratsiya»; AI-bot 6-darsda («Bot ichida AI») o'tilgan.
- **Final javobi Mentor gapida** — 15-ekran Mentor: «Maqsad oladi, holatni ko'radi, asbob tanlaydi, amal qiladi va natijani ko'rib qaytadi» — sudraladigan 5 bo'lak tartibini aynan aytib qo'yadi (ballik final).
- **Hook: har javobga «Aynan!»** — 0-ekran: «Bot buzilgan» yoki «Internet sekin ishlagan» tanlansa ham «Aynan! AI-bot — og'iz…» chiqadi. Sarlavhada AI-bot «buyurtmani yubordim» dedi, chatda esa «Albatta, rasmiylashtirdim ✅» — ikki xil gap.
- **«tool» ning nomi har xil** — 1-ekran Mentor va panel: «Yangi jihoz yondi: 🧰 **Vositalar**»; qolgan joyda «asbob / asboblar (tools)» (1-ekran 3-qadam, 6, 7, 8-ekran, arena 3, kartochka 7); nishonda «tool-call». 5-ekranda qator «Chegara?», kartada esa «QOIDA:». Panel faktlari: «Vositalar» 5-dars (BotAiProjectLesson) va 7-darsda allaqachon yongan — bu yerda «yangi» deyilgan; «AI yordamchi» 5-darsda yongan, bu darsda yonmaydi.
- **Sikl nomi va tarkibi** — Idrok / Qaror / Amal nomlari hamma joyda bir xil (yaxshi). Lekin aylanma o'zi: «sikl» (1, 3, 10, 12, 15-ekran), «aylanadi», «(loop)» (1-ekran), «Loop» (3-takrorlash oynasi sarlavhasi); App.jsx tavsifida «aylanma», 1-darsda «aylana». Tarkib ham har xil: 1, 3-ekran va kartochka 3 — «uch qadam: idrok, qaror, amal»; arena 11 — «Idrok → Qaror → Amal → Natijani ko'r» (Maqsadsiz); 15-ekran final — 5 qadam «Maqsad → Idrok → Qaror → Amal → Natijani ko'r».
- **Nishon/yorliq ekranga mos emas** — «Cycle Builder: Idrok → qaror → amal rejasini yig'dingiz» 5-ekranda beriladi, u yerda esa maqsad + asboblar + chegara yig'iladi (sikl emas). Podium yorlig'i «3 — Tashqi xizmat» 10-ekran (sikl testi)ga qo'yilgan; «tashqi xizmat» (arena fonida ham) darsda umuman o'tilmaydi. Nishon nomlari faqat inglizcha (Cycle Builder, Tool Picker, Guardrail Keeper, Safe Actor).
- **Izohsiz inglizcha / ikki shakl** — «Rule-bot» (4-ekran D varianti va izohi — darsda ochilmagan); «reaktiv / proaktiv» (0-ekran chat holati, 1, 2, 12-ekran, 10-ekran izohi) izohsiz; «rejaladi / rejaladim / rejalayman / rejalash» (1, 4, 10, 12-ekran) bilan «rejalashtirildi» (0, 12-ekran) aralash; 12-ekran «Maqsadga yetildi».
