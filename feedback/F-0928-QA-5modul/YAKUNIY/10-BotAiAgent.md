# 10-dars «AI-agent yaratish» — yakuniy matn

Fayl: `src/5-Modull/BotAiAgentLesson.jsx` · 20 ekran · Keyingi dars: «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?»
Holat: 01.10.2026 — kodga mos

## 0 · Kirish — ikki bot
- Eyebrow: Kirish
- Sarlavha: AvtoPizza'ning ikki botiga bir xil buyurtma keldi. Qaysi biri uni haqiqatan qabul qiladi?
- Mentor: 6-darsda botingizga AI ulagansiz: u system prompt bo'yicha javob yozadi. Bunday botni bugun AI-bot deb ataymiz. Tugmani bosing va ikki botni solishtiring.
- Chat 1 (AvtoPizza · AI-bot · bot):
  - mijoz: 2 ta Pepperoni, Chilonzor 5-kvartal. Buyurtmani rasmiylashtiring
  - bot (tugma bosilgach): Albatta! Buyurtmangiz qabul qilindi.
  - Baza: yangi buyurtma yo'q
- Chat 2 (AvtoPizza · AI-agent · agent):
  - mijoz: 2 ta Pepperoni, Chilonzor 5-kvartal. Buyurtmani rasmiylashtiring
  - bot (tugma bosilgach): Buyurtmangiz qabul qilindi: 2 ta Pepperoni. Taxminan 30 daqiqada yetkazamiz.
  - Baza: `saveOrder()` → yangi buyurtma: 2 ta Pepperoni, Chilonzor 5-kvartal · `arrangeDelivery()` → kuryer belgilandi
- Tugma: ▶ Ikki botni solishtirish → ✓ Solishtirildi
- Savol (javoblardan keyin): AI-botda nima yetishmaydi?
  - Kodida xato bor — bot buzilgan
  - ✔ Bazaga yozadigan funksiyani chaqira olmaydi
  - Internet sekin ishlab, xabar kechikdi
- Javob izohlari:
  - 2-variant: **Aynan!** «Qabul qilindi» deb yozish bilan buyurtma bazaga tushmaydi — AI-agent buning uchun `saveOrder()` ni chaqirdi.
  - 1-variant: **Qiziq fikr!** Lekin ikkala bot ham ishladi — farq «Baza» qatorida.
  - 3-variant: **Qiziq fikr!** Lekin ikkala javob ham vaqtida keldi — farq «Baza» qatorida.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun: AI-agent — maqsad oladi, asbob tanlaydi va ishni bajaradi.
- Mentor: O'tgan darsda botni mijozlar fikriga qarab o'zingiz yaxshiladingiz. Bugun botga maqsad berasiz: keyingi qadamni u o'zi tanlaydi — lekin faqat siz bergan asboblar va chegara ichida.
- Chizma: Siz berasiz: **Maqsad · Asboblar · Chegara** → Agent: **Idrok → Qaror → Amal** ↻ (maqsadga yetguncha)
- Bugungi 4 qadam
  1. AI-bot va AI-agent — farqi nimada
  2. Agent sikli: Idrok → Qaror → Amal
  3. Asbob (tool) — agent chaqira oladigan funksiya
  4. Maqsad, asboblar va chegara bilan agent qurish
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Chizmani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · AI-bot va AI-agent
- Eyebrow: Tushuncha · farq
- Sarlavha: AI-bot va AI-agent: farq qayerda?
- Mentor: Ikkalasining ichida bir xil AI bo'lishi mumkin. Farq — AI'ga nima berilganida va u nima qila olishida. Har jihatni bosing.
- Jihatlar (bosilgani ✓ bilan belgilanadi; o'ngda jihat nomi va ikki karta ochiladi: **AI-bot** · **AI-agent**):
  - **Necha qadam?** — AI-bot: bitta: xabar → javob · AI-agent: bir nechta: maqsadga yetguncha sikl
  - **Nima bilan ishlaydi?** — AI-bot: faqat matn bilan · AI-agent: asboblar bilan: siz yozgan funksiyalar (`saveOrder()` kabi)
  - **Siz nima berasiz?** — AI-bot: system prompt: qanday javob yozsin · AI-agent: maqsad, asboblar va chegara
- Xulosa (3/3 dan keyin): Qisqasi: AI-botda AI javob matnini yozadi. AI-agentda AI keyingi qadamni tanlaydi, ishni esa siz yozgan asbob bajaradi.
- Tugmalar: Orqaga · 3 farqni ko'ring (N/3) → Davom etish

## 3 · Agent sikli
- Eyebrow: Tushuncha · sikl
- Sarlavha: Agent sikli: Idrok → Qaror → Amal.
- Mentor: Agent bitta amal bilan to'xtamaydi: har Amaldan keyin natijani ko'radi va keyingi qadamni tanlaydi. Tugmani bosing va bitta buyurtma uchun sikl necha marta takrorlanishini kuzating.
- **Maqsad:** Buyurtmani qabul qilish
- Oqim: Idrok → Qaror → Amal ↻ (joriy qadam yonadi)
- Tugma: ▶ Siklni boshlash → Keyingi qadam → → ✓ Maqsadga yetdi
- Qadamlar (har bosishda bittasi, sarlavhasi — qadam nomi):
  1. **Idrok** — Mijoz yozdi: «2 ta Pepperoni». Agent xabarni o'qidi. Pepperoni bugun bormi — hali noma'lum.
  2. **Qaror** — Avval Pepperoni borligini bilish kerak → `checkOrder` asbobini tanlaydi.
  3. **Amal** — `checkOrder()` chaqirildi → natija: «Pepperoni bor». Maqsadga hali yetmadi.
  4. **Idrok** — Natijani o'qidi: Pepperoni bor, buyurtma esa hali bazada yo'q.
  5. **Qaror** — Endi buyurtmani saqlash kerak → `saveOrder` asbobini tanlaydi.
  6. **Amal** — `saveOrder()` chaqirildi → buyurtma bazaga yozildi. Maqsadga yetdi — sikl to'xtaydi.
- Xulosa (6/6 dan keyin): Sikl ikki marta takrorlandi: avval tekshirdi, keyin saqladi. Keyingi asbobni har safar agent natijaga qarab o'zi tanladi.
- Tugmalar: Orqaga · Siklni yuriting (N/6) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Botdagi AI qadamlarni o'zi tanladi: avval Pepperoni borligini tekshirdi, keyin buyurtmani bazaga yozdi, oxirida yetkazishni rejaladi. Bu qanday bot?
  - AI-bot — AI javob matnini yozib beradi
  - Oddiy skript — bir marta ishlab, to'xtaydi
  - ✔ AI-agent — maqsad sari asboblarni ishlatadi
  - Handlerli bot — oldindan yozilgan javob beradi
- Javob izohlari:
  - To'g'ri: Qadamlarni AI o'zi tanladi va har qadamda asbob chaqirdi — bu AI-agent.
  - AI-bot: AI-bot faqat javob matnini yozadi — bazaga yozish yoki yetkazishni rejalash uchun asbob chaqirmaydi.
  - Oddiy skript: Oddiy skript bir marta yuqoridan pastga ishlaydi va qadamlarni o'zi tanlamaydi. Bu yerda qadamlarni AI tanladi.
  - Handlerli bot: Handlerli botda har hodisaga javobni siz oldindan yozasiz. Bu yerda esa qadamlarni AI o'zi tanladi.
- Test yozuvlari (4, 8, 10, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · Agentni qurish
- Eyebrow: Markaziy · qurish
- Sarlavha: Agentni quring: maqsad, asboblar, chegara.
- Mentor: Agentga uch narsani siz berasiz: nima qilsin (maqsad), nima bilan qilsin (asboblar), nimani so'ramasdan qilmasin (chegara). Har qatorda mos variantni tanlang.
- Qatorlar (navbat bilan; xato tanlangani ✗ oladi va ostida izohi chiqadi):
  1. Maqsad?
     - Buyurtma haqidagi savollarga javob yozish — xato: Faqat javob yozish — AI-botning ishi.
     - ✔ Buyurtmani qabul qilib, yetkazishga tayyorlash
     - Taom bor-yo'qligini tekshirish — xato: Bu — bitta qadam, maqsad emas.
  2. Asboblar?
     - sendSticker, changeAvatar, playMusic, setTheme, sendGif — xato: Bu asboblar buyurtmaga kerak emas.
     - changePrice, banUser, refundAll, deleteMenu, sendAds — xato: Bu asboblar buyurtmani qabul qilishga kerak emas.
     - ✔ checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder
  3. Chegara?
     - ✔ Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin
     - Mijoz so'rasa, har amalni tasdiqsiz bajarsin — xato: Agent xato tushunsa, pul haqiqatan yechiladi.
     - Hech qanday amal qilmay, faqat javob yozsin — xato: Unda u yana AI-bot bo'lib qoladi.
- Bajarilgan qator: **Maqsad:** Buyurtmani qabul qilib, yetkazishga tayyorlash ✓ ↻ · **Asboblar:** checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder ✓ ↻ · **Chegara:** Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin ✓
- O'ng panel — Agent kartasi (tanlanmagan qator o'rnida «…»):
  - MAQSAD: Buyurtmani qabul qilib, yetkazishga tayyorlash
  - ASBOBLAR: checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder
  - CHEGARA: Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: Agent tayyor. Amaliyotda o'z botingiz uchun ham shu uch qismni yozasiz.
- Tugmalar: Orqaga · Agentni yig'ing → Davom etish

## 6 · Asbob nima
- Eyebrow: Tushuncha · asbob
- Sarlavha: Asbob (tool) — agent chaqira oladigan funksiya.
- Mentor: Asbobni siz yozasiz — oddiy JS funksiya, xuddi handler ichidagi kod kabi. AI o'zi faqat matn yozadi; bazaga yozish yoki kartadan pul yechishni asbob bajaradi. Har asbobni bosing.
- Asboblar (bosilgani ✓ bilan belgilanadi va o'ngda ochiladi):
  - `checkOrder()` — Taom borligini yoki buyurtma qaysi holatda ekanini tekshiradi.
  - `saveOrder()` — Buyurtmani bazaga (PostgreSQL) yozadi.
  - `arrangeDelivery()` — Yetkazishni rejalaydi: kuryerga manzil va vaqtni beradi.
  - `chargeCard()` — Mijoz kartasidan pul yechadi.
  - `cancelOrder()` — Buyurtmani bekor qiladi.
- Xulosa (5/5 dan keyin): Agent faqat siz bergan asboblar bilan ishlaydi. Pul yechish va bekor qilishda xato qimmatga tushadi — ularga chegara qo'yiladi.
- Tugmalar: Orqaga · 5 asbobni oching (N/5) → Davom etish

## 7 · Mos asbobni tanlash
- Eyebrow: Qaror · asbob tanlash
- Sarlavha: Qaror qadami: vaziyatga mos asbobni tanlang.
- Mentor: Haqiqiy agentda qaysi asbobni chaqirishni AI tanlaydi. Hozir uning o'rnida siz tanlang.
- Karta: Vaziyat N/3 (birma-bir):
  1. Mijoz yozdi: «Buyurtmam qayerda?» — ✔ `checkOrder()`
  2. Pul yechildi, lekin buyurtma hali bazada yo'q — ✔ `saveOrder()`
  3. Buyurtma bazaga yozildi. Endi uni kuryerga berish kerak — ✔ `arrangeDelivery()`
- O'ng panel — Avval qaysi asbob kerak?
  - `saveOrder()` · `cancelOrder()` · `arrangeDelivery()` · `checkOrder()` · `chargeCard()`
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato: Bu vaziyatda avval boshqa asbob kerak. Vaziyatni qayta o'qing.
- Muvaffaqiyat (vaziyat kartasi o'rnida): Siz vaziyatni ko'rdingiz (Idrok) va asbobni tanladingiz (Qaror) — uni chaqirish esa Amal.
- Tugmalar: Orqaga · Asbobni tanlang (N/3) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: AI-agent ishni qanday bajaradi?
  - ✔ Maqsadga mos asbobni tanlab chaqiradi
  - Faqat matn yozib beradi, ishni odam qiladi
  - Kod yozilmasa ham, o'zi bajarib qo'yadi
  - Oldindan belgilangan bitta amalni takrorlaydi
- Javob izohlari:
  - To'g'ri: AI asbobni tanlaydi, uni esa siz yozgan kod bajaradi.
  - Faqat matn: Faqat matn yozish — bu AI-bot. Agent asbob chaqirib, ishni o'zi bajaradi.
  - Kod yozilmasa ham: Asboblar — siz yozgan oddiy funksiyalar. Ularsiz agent bazaga ham, kuryerga ham yeta olmaydi.
  - Bitta amalni takrorlaydi: Agent vaziyatga qarab har xil asbobni tanlaydi. Doim bitta amalni takrorlash — agent emas.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Pul yechishdan oldin
- Eyebrow: Xavfsizlik · tasdiq
- Sarlavha: Agent pul yechmoqchi. Qanday qilish to'g'ri?
- Mentor: Agent asbob bilan real ish qiladi, jumladan pul yechadi. Xato qilsa, pul ham haqiqatan yechiladi. Vaziyatni o'qing va tanlang.
- Karta **Vaziyat**: Mijoz 5 ta katta pitsa buyurdi. Agent `chargeCard()` bilan uning kartasidan **450 000 so'm** yechmoqchi.
- Variantlar (bitta urinish):
  - Mijoz o'zi buyurdi — agent tasdiqsiz yechaversin
  - ✔ Yechishdan oldin mijozdan summani tasdiqlatsin
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Javob izohlari:
  - To'g'ri: Agent 5 o'rniga 15 deb tushungan bo'lsa ham, tasdiq xatoni pul yechilmasdan to'xtatadi.
  - Xato: Mijoz summani hali ko'rmagan: agent 5 o'rniga 15 deb tushunsa, ortiqcha pul yechiladi.
- Chizma (to'g'ri tanlangach): Agent · Mijoz
  - Agent → Mijoz: «450 000 so'm yechilsinmi?»
  - Mijoz → Agent: «Ha»
  - `chargeCard()`
- Tugmalar: Orqaga · Qarorni tanlang → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Agentning maqsadi — buyurtmani qabul qilib, yetkazishga tayyorlash. U buyurtmani saqladi. Endi nima qiladi?
  - Mijozga «qabul qilindi» deb yozib, ishni tugatadi
  - Mijoz keyingi buyruq yozishini kutib turadi
  - Buyurtmani yana bir marta bazaga yozadi
  - ✔ Natijani ko'radi va keyingi qadamni tanlaydi
- Javob izohlari:
  - To'g'ri: Yetkazish hali rejalanmagan — maqsadga yetmadi, shuning uchun agent keyingi qadamni tanlaydi.
  - Ishni tugatadi: Yetkazish hali rejalanmagan: maqsadga yetmay turib ish tugamaydi.
  - Kutib turadi: Keyingi buyruqni kutish — AI-botning ishi. Agent keyingi qadamni o'zi tanlaydi.
  - Yana bazaga yozadi: Buyurtma allaqachon saqlangan — natijani ko'rgan agent uni qayta yozmaydi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 11 · Amal xavfsizligi
- Eyebrow: Markaziy · xavfsizlik
- Sarlavha: Qaysi amalni agent o'zi, qaysini odam tasdig'i bilan bajarsin?
- Mentor: Har amalni belgilang: agent uni o'zi bajarsinmi yoki avval odamdan tasdiq so'rasinmi? Har qatorda bitta urinish.
- Amallar (navbat bilan; har qatorda tugmalar: O'zi · Tasdiq kerak):
  - Buyurtma holatini tekshirish — `checkOrder()` — ✔ O'zi
  - Buyurtmani bekor qilish — `cancelOrder()` — ✔ Tasdiq kerak
  - Buyurtmani bazaga yozish — `saveOrder()` — ✔ O'zi
- Belgilangan qator: ✓ yoki ✕ va tanlov (O'zi / Tasdiq kerak)
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Javob izohlari (3/3 dan keyin):
  - Hammasi to'g'ri: Bu agentda tekshirish va saqlash tasdiqsiz bajariladi, bekor qilish esa buyurtmani yo'qotadi — uni odam tasdiqlaydi.
  - Xato bo'lsa: Qarang: bekor qilish buyurtmani yo'qotadi — odam tasdig'i kerak; tekshirish va saqlashni agent o'zi bajaradi.
- Tugmalar: Orqaga · Har amalni belgilang (N/3) → Davom etish

## 12 · Agent ishda
- Eyebrow: Hayotiy · agent ishda
- Sarlavha: Bitta xabar — agent qadamlarni o'zi tanlab, ishni oxirigacha bajaradi.
- Mentor: Bu — siz yig'gan agent: maqsadi buyurtmani qabul qilib, yetkazishga tayyorlash. Tugmani bosing va u har qadamda nima qilishini kuzating.
- Yorliq: Agent qadamlari (mijoz ularni ko'rmaydi)
- Qadamlar (har bosishda bittasi; oldingilari «✓ nomi asbobi» qatoriga yig'iladi):
  1. **Idrok** — Mijoz: «2 ta Pepperoni, Chilonzor 5-kvartal». Agent xabarni o'qidi.
  2. **Qaror** `checkOrder()` — Avval Pepperoni borligini tekshiraman.
  3. **Amal** `checkOrder()` — Natija: «Pepperoni bor».
  4. **Idrok · Qaror** `saveOrder()` — Pepperoni bor, buyurtma hali bazada yo'q → saqlayman.
  5. **Amal** `saveOrder()` — Natija: buyurtma bazaga yozildi.
  6. **Idrok · Qaror** `arrangeDelivery()` — Buyurtma saqlandi, yetkazish hali rejalanmagan → rejalayman.
  7. **Amal** `arrangeDelivery()` — Natija: kuryer taxminan 30 daqiqada yetkazadi.
  8. **Maqsadga yetdi** — Buyurtma qabul qilindi va yetkazishga tayyor. Sikl to'xtaydi, mijozga javob ketadi.
- Tugma: ▶ Agentni ishga tushirish → Keyingi qadam → → ✓ Maqsadga yetdi
- O'ng panel — yorliq: Mijoz ko'radigan chat
  - Chat (AvtoPizza · AI-agent · agent): mijoz: 2 ta Pepperoni, Chilonzor 5-kvartal
  - bot (8/8 dan keyin): 2 ta Pepperoni qabul qilindi. Chilonzor 5-kvartalga taxminan 30 daqiqada yetkazamiz.
- Karta **Chaqirilgan asboblar**: hali yo'q → (Amal qadamlarida to'ladi) `checkOrder()` · `saveOrder()` · `arrangeDelivery()`
- Xulosa (8/8 dan keyin): Mijoz bitta xabar yozdi, agent esa uchta asbobni chaqirdi. Qaysi birini qachon chaqirishni u o'zi tanladi — lekin faqat siz bergan asboblar orasidan.
- Tugmalar: Orqaga · Agentni kuzating (N/8) → Davom etish

## 13 · Chegaralar
- Eyebrow: Xavfsizlik · chegara
- Sarlavha: Agent real ish qiladi — shuning uchun unga chegara qo'yiladi.
- Mentor: Chegara (inglizcha guardrail) agent nimani qila olishini va nimani so'ramasdan qilmasligini belgilaydi. Uch turini bosib ko'ring.
- Chegaralar (bosilgani ✓ bilan belgilanadi va o'ngda ochiladi):
  - **Cheklangan asboblar** — Agentga faqat kerakli asboblarni bering. Masalan, buyurtma agentiga narxni o'zgartirish yoki mijozni bloklash asbobini bermang: bermagan asbobini u chaqira olmaydi.
  - **Tasdiq so'rash** — Xavfli amaldan oldin (pul yechish, bekor qilish) agent mijoz yoki admindan tasdiq so'raydi.
  - **Odam nazorati** — Murakkab yoki shubhali holatni agent odamga, masalan AvtoPizza adminiga, uzatadi. Inglizcha nomi — human-in-the-loop.
- Xulosa (3/3 dan keyin): Agentga erkinlik asta-sekin beriladi: avval kam asbob va ko'proq tasdiq, ishonch ortgani sari — ko'proq.
- Tugmalar: Orqaga · 3 chegarani ko'ring (N/3) → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Agent mijozning kartasidan pul yechishidan oldin nima muhim?
  - Unga hamma ishda to'liq erkinlik berib qo'yish
  - ✔ Faqat kerakli asboblarni berish va tasdiq so'ratish
  - Pul yechilgach, mijozga xabar yuborib qo'yish
  - Javob berish tezligini iloji boricha oshirish
- Javob izohlari:
  - To'g'ri: Xato pul yechilmasdan oldin to'xtashi kerak — chegara shuning uchun.
  - To'liq erkinlik: To'liq erkinlik xavfli: agent xato qilsa, pul haqiqatan yechiladi. Chegara kerak.
  - Xabar yuborish: Xabar pul yechilgandan keyin ketadi — xatoni to'xtata olmaydi. Tasdiq pul yechilishidan oldin so'raladi.
  - Tezlik: Bu yerda tezlik asosiy emas — xavfsizlik muhim: kerakli asboblar va tasdiq.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Tartibni yig'ing (final)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: agent qanday ishlashini to'g'ri tartibda yig'ing.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. Maqsad olinadi
  2. Idrok
  3. Qaror
  4. Amal
  5. Maqsadga yetdimi?
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- Javob izohlari:
  - To'g'ri: Tartib to'g'ri: maqsadga yetmaguncha agent yana Idrok'ka qaytadi.
  - Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
  - Birinchi xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 16 · Amaliyot · AI-agent
- Eyebrow: Amaliyot · AI-agent
- Sarlavha: Agentga ikki asbob bering — qaysi birini chaqirishini ko'ring
- Mentor: Topshiriqni o'z kompyuteringizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- TOPSHIRIQ: aistudio.google.com'da agentga maqsad, chegara va ikki asbob berasiz. Model asbobni chaqiradi, natijani siz qaytarasiz — keyingi asbobni u o'zi tanlaydi.
- 1-namuna — **Maqsad va chegara** (tugma: Nusxalash → ✓ Nusxalandi):
```text
MAQSAD: Buyurtmani qabul qilib, bazaga yozish.
CHEGARA: Taom borligini tekshirmasdan buyurtma yozilmasin.
```
- 2-namuna — **Asboblar** (tugma: Nusxalash → ✓ Nusxalandi):
```json
[
  {
    "name": "checkOrder",
    "description": "Taom borligini tekshiradi",
    "parameters": {
      "type": "object",
      "properties": {
        "taom": { "type": "string" },
        "soni": { "type": "integer" }
      },
      "required": ["taom", "soni"]
    }
  },
  {
    "name": "saveOrder",
    "description": "Buyurtmani bazaga yozadi",
    "parameters": {
      "type": "object",
      "properties": {
        "taom": { "type": "string" },
        "soni": { "type": "integer" },
        "manzil": { "type": "string" }
      },
      "required": ["taom", "soni", "manzil"]
    }
  }
]
```
- Qadamlar (navbat bilan; bajarilgani ✓ bilan qatorga yig'iladi):
  1. aistudio.google.com'ni oching (6-darsda temperature'ni shu yerda sinagansiz). **System instructions** maydoniga 1-namunani joylang.
  2. O'ngdagi sozlamalarda **Function calling** ni yoqing, **Edit** ni bosing va 2-namunani joylang.
  3. Xabar yozing: «2 ta Pepperoni, Chilonzor 5-kvartal». Model javob matnini yozmaydi — `checkOrder` ni chaqiradi. Asbobni tanlagani — Qaror.
  4. Asbob o'rnida natijani o'zingiz yozing: `{ "bor": true }`. Model natijani ko'radi — bu yangi Idrok — va `saveOrder` ni chaqiradi.
- Tugma (har qadamda): Bajardim
- Hammasi bajarilgach:
  - **Qo'shimcha:** yangi suhbat ochib, natijaga `{ "bor": false }` yozing. Model `saveOrder` ni chaqiradimi?
  - ✓ Bajarildi — Mentorni kuting · Agent ikki asbobni o'zi tanladi. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- 18-ekran · Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Maqsad olib, asboblar bilan qadamma-qadam ish bajaradigan bot nima deb ataladi? | AI-agent | Masalan, buyurtmani tekshiradi, saqlaydi, yetkazishni rejalaydi |
| AI faqat javob matnini yozadigan bot qanday ataladi? | AI-bot | 6-darsdagi bot: system prompt bo'yicha javob yozadi |
| Agent sikli qaysi uch qadamdan iborat? | Idrok, Qaror, Amal | Maqsadga yetguncha takrorlanadi |
| Agent vaziyatni qaysi qadamda ko'radi? | Idrok | Xabar, bazadagi ma'lumot va oldingi Amal natijasi |
| Qaysi asbobni chaqirishni agent qaysi qadamda tanlaydi? | Qaror | Tanlovni AI maqsadga qarab qiladi |
| Agent asbobni qaysi qadamda chaqiradi? | Amal | Masalan, `saveOrder()` buyurtmani bazaga yozadi |
| Agent chaqira oladigan funksiya nima deb ataladi? | Asbob (tool) | Uni siz yozasiz, agent faqat tanlaydi |
| Agentga siz qaysi uch narsani berasiz? | Maqsad, asboblar, chegara | Keyingi qadamni agent shular ichida tanlaydi |
| Agent Amaldan keyin nima qiladi? | Natijani ko'radi | Maqsadga yetmagan bo'lsa — yana Idrok |
| Agent nimani qila olishi va nimani so'ramasdan qilmasligini nima belgilaydi? | Chegara (guardrail) | Masalan, agentga faqat kerakli asboblar beriladi |
| Pul yechish kabi xavfli amaldan oldin agent nima so'raydi? | Odam tasdig'ini | Tasdiqsiz xavfli amal bajarilmaydi |
| Murakkab holatni agent odamga uzatishi nima deyiladi? | Odam nazorati | Inglizcha: human-in-the-loop |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: ✓ Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- 19-ekran · Eyebrow: Tayyor
- Belgi: ✓ AI-agent qanday ishlashini bilasiz
- Sarlavha: Endi AI-agent qanday ishlashini bilasiz. (yonida ball halqasi)
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - AI-bot javob matnini yozadi; AI-agent maqsad sari keyingi qadamni o'zi tanlab, asbob chaqiradi
  - Agent sikli: Idrok → Qaror → Amal — maqsadga yetguncha takrorlanadi
  - Asbob (tool) — agent chaqira oladigan funksiya: uni siz yozasiz, qaysi birini chaqirishni AI tanlaydi
  - Agentga siz maqsad, asboblar va chegara berasiz — keyingi qadamni u shular ichida tanlaydi
  - Xavfli amaldan (pul yechish, bekor qilish) oldin agent odamdan tasdiq so'raydi
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **Loyihalang** — o'z botingiz uchun bitta maqsad va 3–4 ta asbob yozing
  - **Chegaralang** — qaysi amal xavfli (pul yechish, bekor qilish)? Unga odam tasdig'ini qo'ying yoki bu asbobni bermang
  - **Sinab ko'ring** — aistudio.google.com'da o'z botingizning ikki asbobini yozing va ikki xil xabarda model qaysi asbobni chaqirishini ko'ring
- Keyingi dars — **«Botingiz yaxshi ishlayotganini qaysi raqam aytadi?»** Botingiz foydali ekanini ko'rsatadigan bitta bosh raqamni va unga yordam beradigan uch raqamni tanlaymiz.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: Nishonlar — N/4
- **Agent Builder** — Agentga maqsad, asboblar va chegara berdingiz (5-ekran)
- **Tool Picker** — Har vaziyatga mos asbobni tanladingiz (7-ekran)
- **Guardrail Keeper** — Pul yechishdan oldin tasdiq so'rashni tanladingiz (9-ekran)
- **Safe Actor** — Qaysi amalga odam tasdig'i kerakligini to'g'ri belgiladingiz (11-ekran)
- Nishon qoidasi yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi.
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. AI-bot va AI-agent farqi (4-ekran)
   - 1 · AI-bot — AI faqat javob matnini yozadi.
   - `saveOrder()` · AI-agent — AI keyingi qadamni tanlaydi va asbob chaqiradi.
   - 3 · Bitta javob va sikl — Bot bitta javob bilan to'xtaydi, agent maqsadga yetguncha sikl bo'ylab ishlaydi.
   - Sinfga savol: AI-bot bilan AI-agentning asosiy farqi nima?
2. Agent ishni qanday bajaradi (8-ekran)
   - 1 · Idrok — Vaziyatni ko'radi: xabar va bazadagi ma'lumot.
   - 2 · Qaror — AI maqsadga qarab asbob tanlaydi.
   - `saveOrder()` · Amal — Asbob chaqiriladi (masalan, `saveOrder()`) va natija qaytadi.
   - Sinfga savol: Agent ishni nima orqali bajaradi?
3. Nega sikl takrorlanadi (10-ekran)
   - 1 · Natijani ko'radi — Har Amaldan keyin agent natijaga qaraydi, bu yangi Idrok.
   - 2 · Maqsadga yetdimi? — Yetmagan bo'lsa, keyingi qadamni tanlaydi.
   - 3 · Takrorlanadi — Maqsadga yetguncha Idrok → Qaror → Amal.
   - Sinfga savol: Agent bitta amaldan keyin nima qiladi?
4. Chegara — agent nimani qila oladi (14-ekran)
   - 1 · Cheklangan asboblar — Agentga faqat kerakli asboblar beriladi.
   - `chargeCard()` · Tasdiq so'rash — Xavfli amaldan (pul yechish, bekor qilish) oldin odamdan tasdiq so'raladi.
   - 3 · Odam nazorati — Shubhali holat odamga uzatiladi.
   - Sinfga savol: Agent pul yechishdan oldin nima qilishi kerak?
5. Agent qanday ishlaydi (15-ekran)
   - 1 · Maqsad olinadi — Agent vazifani oladi.
   - 2 · Idrok → Qaror → Amal — Vaziyatni ko'radi, asbob tanlaydi, uni chaqiradi.
   - 3 · Maqsadga yetdimi? — Yetmagan bo'lsa, yana Idrok.
   - Chizma: Maqsad olinadi → Idrok → Qaror → Amal → Maqsadga yetdimi?
   - Sinfga savol: Agent ishi nimadan boshlanadi?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: agent · asbob · maqsad · idrok · qaror · amal · chegara · sikl · ✗ · ✓

1. AI-bot va AI-agentning asosiy farqi nima?
   - Agentning rangi va shrifti boshqacha bo'ladi
   - ✔ Agent maqsad sari qadamlarni o'zi tanlaydi
   - Ular orasida hech qanday farq yo'q
   - Agent botdan ancha sekin ishlaydi
2. Agent siklidagi «Amal» qadami nima?
   - Mijozning keyingi xabarini kutish
   - Salom berib, menyuni yuborish
   - O'zini o'chirib, ishni to'xtatish
   - ✔ Tanlangan asbobni chaqirish
3. Asbob (tool) nima?
   - ✔ Agent chaqira oladigan funksiya
   - Botning rang va shrift sozlamasi
   - Server joylashgan IP-manzil
   - Internetga ulanish tezligi
4. Agent qaysi asbobni chaqirishni qanday tanlaydi?
   - Ro'yxatdagi birinchi asbobni oladi
   - AI tasodifan, tavakkaliga tanlaydi
   - ✔ AI maqsad va vaziyatga qarab tanlaydi
   - Har safar odam qo'lda tanlab beradi
5. Agent bitta amalni bajardi. Endi nima qiladi?
   - Ish tugadi deb, shu zahoti to'xtaydi
   - ✔ Natijani ko'rib, keyingi qadamni tanlaydi
   - O'sha amalni yana bir marta bajaradi
   - Mijoz keyingi buyruq yozishini kutadi
6. Agentga siz qaysi uch narsani berasiz?
   - ✔ Maqsad, asboblar va chegara
   - Faqat system prompt: qanday javob yozsin
   - Har hodisa uchun tayyor javob matni
   - Bot tokeni va server manzili
7. Chegara (guardrail) nima uchun kerak?
   - Botni chiroyliroq ko'rsatish uchun
   - Javob tezligini oshirish uchun
   - Mijozga rang tanlab berish uchun
   - ✔ Agentni xavfli amaldan to'xtatish uchun
8. Agent pul yechishdan oldin nima qilishi kerak?
   - Tasdiqsiz, o'zi yechaverishi
   - ✔ Odamdan tasdiq so'rashi
   - Botni o'chirib qo'yishi
   - Imkon boricha tez yechishi
9. Odam nazorati (human-in-the-loop) nimani anglatadi?
   - Agent hamma ishni yolg'iz bajaradi
   - Odam jarayonga umuman aralashmaydi
   - ✔ Muhim holatda qarorni odam qiladi
   - Mijoz botdan butunlay bloklanadi
10. «Cheklangan asboblar» chegarasi nimani bildiradi?
    - Asboblar sekinroq ishlay boshlaydi
    - Hamma asboblar bepul bo'ladi
    - Agentga barcha asboblar beriladi
    - ✔ Agentga faqat kerakli asboblar beriladi
11. Agent sikli qaysi tartibda ishlaydi?
    - ✔ Idrok → Qaror → Amal → yana Idrok
    - Amal → Idrok → Qaror → yana Amal
    - Qaror → Amal → Idrok → yana Qaror
    - Idrok → Amal → Qaror → yana Idrok
12. Agent siklida «Qaror» qadamini kim bajaradi?
    - Mijoz har safar qo'lda tanlaydi
    - Hech kim — qadam o'z-o'zidan o'tadi
    - ✔ AI — qaysi asbob kerakligini tanlaydi
    - Asbob o'zi hal qiladi, AI faqat kutadi
