# 10-dars «AI-agent yaratish» — yakuniy matn

Fayl: `src/5-Modull/BotAiAgentLesson.jsx` · 20 ekran · Keyingi dars: «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?»
Holat: 04.10.2026 — kodga mos

## 0 · Kirish — ikki bot
- Eyebrow: Kirish
- Sarlavha: Qaysi bot buyurtmani haqiqatan qabul qiladi?
- Mentor: 6-darsda botingizga AI ulagansiz: u system prompt bo'yicha javob yozadi. Bunday botni bugun AI-bot deb ataymiz. Ikki botga bir xil buyurtma keldi — tugmani bosing va ularni solishtiring.
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
- Sarlavha: Bugun: AI-agent — o'zi ishni bajaradigan bot.
- Mentor: O'tgan darsda botni mijozlar fikriga qarab o'zingiz yaxshiladingiz. Bugun botga maqsad berasiz: keyingi qadamni u o'zi tanlaydi — lekin faqat siz bergan tool'lar va chegara ichida.
- Chizma: Siz berasiz: **Maqsad · Tool'lar · Chegara** → Agent: **Idrok → Qaror → Amal** ↻ (maqsadga yetguncha)
- Bugungi 4 qadam
  1. AI-bot va AI-agent — farqi nimada
  2. Agent sikli: Idrok → Qaror → Amal
  3. Tool — agent chaqira oladigan funksiya
  4. Maqsad, tool'lar va chegara bilan agent qurish
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Chizmani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · AI-bot va AI-agent
- Eyebrow: Tushuncha · farq
- Sarlavha: AI-bot va AI-agent: farq qayerda?
- Mentor: Ikkalasining ichida bir xil AI bo'lishi mumkin. Farq — AI'ga nima berilganida va u nima qila olishida. Har jihatni bosing.
- Jihatlar (bosilgani ✓ bilan belgilanadi; o'ngda jihat nomi va ikki karta ochiladi: **AI-bot** · **AI-agent**):
  - **Necha qadam?** — AI-bot: bitta: xabar → javob · AI-agent: bir nechta: maqsadga yetguncha sikl
  - **Nima bilan ishlaydi?** — AI-bot: faqat matn bilan · AI-agent: tool'lar bilan: siz yozgan funksiyalar (`saveOrder()` kabi)
  - **Siz nima berasiz?** — AI-bot: system prompt: qanday javob yozsin · AI-agent: maqsad, tool'lar va chegara
- Xulosa (3/3 dan keyin): AI-botda AI javob matnini yozadi. AI-agentda AI qadamni tanlaydi, ishni esa siz yozgan tool bajaradi.
- Tugmalar: Orqaga · 3 farqni ko'ring (N/3) → Davom etish

## 3 · Agent sikli
- Eyebrow: Tushuncha · sikl
- Sarlavha: Agent sikli: Idrok → Qaror → Amal.
- Mentor: Agent bitta amal bilan to'xtamaydi: har Amaldan keyin natijani ko'radi va keyingi qadamni tanlaydi. Tugmani bosing va bitta buyurtma uchun sikl necha marta takrorlanishini kuzating.
- **Maqsad:** Buyurtmani qabul qilish
- Oqim: Maqsad olinadi → Idrok → Qaror → Amal → Maqsadga yetdimi? ↻ (joriy qadam yonadi; 4-qadamdan keyin Idrok'ka qaytuvchi strelka chiziladi)
- Tugma: ▶ Siklni boshlash → Keyingi qadam → → ✓ Maqsadga yetdi
- Qadamlar (har bosishda bittasi, sarlavhasi — qadam nomi):
  1. **Idrok** — Mijoz yozdi: «2 ta Pepperoni». Agent xabarni o'qidi. Pepperoni bugun bormi — hali noma'lum.
  2. **Qaror** — Avval Pepperoni borligini bilish kerak → `checkOrder` tool'ini tanlaydi.
  3. **Amal** — `checkOrder()` chaqirildi → natija: «Pepperoni bor». Maqsadga hali yetmadi.
  4. **Idrok** — Natijani o'qidi: Pepperoni bor, buyurtma esa hali bazada yo'q.
  5. **Qaror** — Endi buyurtmani saqlash kerak → `saveOrder` tool'ini tanlaydi.
  6. **Amal** — `saveOrder()` chaqirildi → buyurtma bazaga yozildi. Maqsadga yetdi — sikl to'xtaydi.
- Xulosa (6/6 dan keyin): Sikl ikki marta aylandi: avval tekshirdi, keyin saqladi. Keyingi tool'ni agent natijaga qarab o'zi tanladi.
- Tugmalar: Orqaga · Siklni yuriting (N/6) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Botdagi AI qadamlarni o'zi tanladi: avval Pepperoni borligini tekshirdi, keyin buyurtmani bazaga yozdi, oxirida yetkazishni rejaladi. Bu qanday bot?
  - AI-bot — AI javob matnini yozib beradi
  - Oddiy skript — bir marta ishlab, to'xtaydi
  - ✔ AI-agent — maqsad sari tool'larni ishlatadi
  - Handlerli bot — oldindan yozilgan javob beradi
- Javob izohlari:
  - To'g'ri: Qadamlarni AI o'zi tanladi va har qadamda tool chaqirdi — bu AI-agent.
  - AI-bot: AI-bot faqat javob matnini yozadi — bazaga yozish yoki yetkazishni rejalash uchun tool chaqirmaydi.
  - Oddiy skript: Oddiy skript bir marta yuqoridan pastga ishlaydi va qadamlarni o'zi tanlamaydi. Bu yerda qadamlarni AI tanladi.
  - Handlerli bot: Handlerli botda har hodisaga javobni siz oldindan yozasiz. Bu yerda esa qadamlarni AI o'zi tanladi.
- Test yozuvlari (4, 8, 10, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · Agentni qurish
- Eyebrow: Markaziy · qurish
- Sarlavha: Agentni quring: maqsad, tool'lar, chegara.
- Mentor: Agentga uch narsani siz berasiz: nima qilsin (maqsad), nima bilan qilsin (tool'lar), nimani so'ramasdan qilmasin (chegara). Har qatorda mos variantni tanlang.
- Qatorlar (navbat bilan; xato tanlangani ✗ oladi va ostida izohi chiqadi):
  1. Maqsad?
     - Buyurtma haqidagi savollarga javob yozish — xato: Faqat javob yozish — AI-botning ishi.
     - ✔ Buyurtmani qabul qilib, yetkazishga tayyorlash
     - Taom bor-yo'qligini tekshirish — xato: Bu — bitta qadam, maqsad emas.
  2. Tool'lar?
     - sendSticker, changeAvatar, playMusic, setTheme, sendGif — xato: Bu tool'lar buyurtmaga kerak emas.
     - changePrice, banUser, refundAll, deleteMenu, sendAds — xato: Bu tool'lar buyurtmani qabul qilishga kerak emas.
     - ✔ checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder
  3. Chegara?
     - ✔ Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin
     - Mijoz so'rasa, har amalni tasdiqsiz bajarsin — xato: Agent xato tushunsa, pul haqiqatan yechiladi.
     - Hech qanday amal qilmay, faqat javob yozsin — xato: Unda u yana AI-bot bo'lib qoladi.
- Bajarilgan qator: **Maqsad:** Buyurtmani qabul qilib, yetkazishga tayyorlash ✓ ↻ · **Tool'lar:** checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder ✓ ↻ · **Chegara:** Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin ✓
- O'ng panel — Agent kartasi (tanlanmagan qator o'rnida «…»):
  - MAQSAD: Buyurtmani qabul qilib, yetkazishga tayyorlash
  - TOOL'LAR: checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder
  - CHEGARA: Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: Agent tayyor. Amaliyotda shu uch qismni o'zingiz yozasiz.
- Tugmalar: Orqaga · Agentni yig'ing → Davom etish

## 6 · Tool nima
- Eyebrow: Tushuncha · tool
- Sarlavha: Tool — agent chaqira oladigan funksiya.
- Mentor: Tool'ni siz yozasiz — oddiy JS funksiya, xuddi handler ichidagi kod kabi. AI o'zi faqat matn yozadi; bazaga yozish yoki kartadan pul yechishni tool bajaradi. Har tool'ni bosing.
- Tool'lar (bosilgani ✓ bilan belgilanadi; o'ngda tool nomi, kodi va izohi ochiladi):
  - `checkOrder()` — Taom menyuda bormi — tekshiradi, narxini qaytaradi.
```js
async function checkOrder(taom, soni) {
  const narx = narxi(taom); // menyudan
  return { bor: narx > 0, jami: narx * soni };
}
```
  - `saveOrder()` — Buyurtmani bazaga yozadi — faqat taom bor bo'lsa.
```js
async function saveOrder(taom, soni, manzil) {
  if (narxi(taom) === 0) return { saqlandi: false };
  await buyurtmalar.yoz(taom, soni, manzil); // bazaga
  return { saqlandi: true };
}
```
  - `arrangeDelivery()` — Yetkazishni rejalaydi: kuryerga manzil va vaqtni beradi.
```js
async function arrangeDelivery(buyurtmaId, manzil) {
  const kuryer = await kuryerlar.bosh(); // bo'sh kuryer
  return { kuryer: kuryer.ism, daqiqa: 30 };
}
```
  - `chargeCard()` — Mijoz kartasidan pul yechadi.
```js
async function chargeCard(buyurtmaId, summa) {
  // pul yechadi — oldin odamdan tasdiq
  return await tolov.yech(buyurtmaId, summa);
}
```
  - `cancelOrder()` — Buyurtmani bekor qiladi.
```js
async function cancelOrder(buyurtmaId) {
  // bekor qiladi — oldin odamdan tasdiq
  await buyurtmalar.holat(buyurtmaId, 'bekor');
}
```
- Xulosa (5/5 dan keyin): Agent faqat siz bergan tool'lar bilan ishlaydi. Pul yechish va bekor qilishga chegara qo'yiladi — xato qimmat.
- Tugmalar: Orqaga · 5 tool'ni oching (N/5) → Davom etish

## 7 · Qaror — tool tanlash
- Eyebrow: Qaror · tool tanlash
- Sarlavha: Qaror qadami: vaziyatga mos tool'ni tanlang.
- Mentor: Haqiqiy agentda qaysi tool'ni chaqirishni AI tanlaydi. Hozir uning o'rnida siz tanlang.
- Vaziyatlar (navbat bilan, yorliq «Vaziyat»; sanoq tugmada «Tool'ni tanlang (N/3)» *(✎ F-1015-120, 208-qonun 0-band: takror olindi)*):
  1. Mijoz yozdi: «Buyurtmam qayerda?» — to'g'ri tool: `checkOrder()`
  2. Pul yechildi, lekin buyurtma hali bazada yo'q — to'g'ri tool: `saveOrder()`
  3. Buyurtma bazaga yozildi. Endi uni kuryerga berish kerak — to'g'ri tool: `arrangeDelivery()`
- Savol: Avval qaysi tool kerak?
  - Tool'lar (shu tartibda): `saveOrder()` · `cancelOrder()` · `arrangeDelivery()` · `checkOrder()` · `chargeCard()`
- Xato bo'lsa: Bu vaziyatga boshqa tool kerak — vaziyatni qayta o'qing.
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Muvaffaqiyat: Siz vaziyatni ko'rdingiz (Idrok) va tool'ni tanladingiz (Qaror) — uni chaqirish esa Amal.
- Tugmalar: Orqaga · Tool'ni tanlang (N/3) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: AI-agent ishni qanday bajaradi?
  - ✔ Maqsadga mos tool'ni tanlab chaqiradi
  - Faqat matn yozib beradi, ishni odam qiladi
  - Kod yozilmasa ham, o'zi bajarib qo'yadi
  - Oldindan belgilangan bitta amalni takrorlaydi
- Javob izohlari:
  - To'g'ri: AI tool'ni tanlaydi, uni esa siz yozgan kod bajaradi.
  - 2-variant: Faqat matn yozish — bu AI-bot. Agent tool chaqirib, ishni o'zi bajaradi.
  - 3-variant: Tool'lar — siz yozgan oddiy funksiyalar. Ularsiz agent bazaga ham, kuryerga ham yeta olmaydi.
  - 4-variant: Agent vaziyatga qarab har xil tool'ni tanlaydi. Doim bitta amalni takrorlash — agent emas.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Xavfsizlik — tasdiq
- Eyebrow: Xavfsizlik · tasdiq
- Sarlavha: Agent pul yechmoqchi. Qanday qilish to'g'ri?
- Mentor: Agent tool bilan real ish qiladi, jumladan pul yechadi. Xato qilsa, pul ham haqiqatan yechiladi. Vaziyatni o'qing va tanlang.
- Vaziyat: Mijoz 5 ta katta pitsa buyurdi. Agent `chargeCard()` bilan uning kartasidan **450 000 so'm** yechmoqchi.
- Tanlov:
  - Mijoz o'zi buyurdi — agent tasdiqsiz yechaversin
  - ✔ Yechishdan oldin mijozdan summani tasdiqlatsin
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- To'g'ri tanlansa (yashil): Agent 5 o'rniga 15 deb tushungan bo'lsa ham, tasdiq xatoni pul yechilmasdan to'xtatadi.
- To'g'ri tanlansa (chizma, Agent ↔ Mijoz): «450 000 so'm yechilsinmi?» → «Ha» → `chargeCard()`
- Xato tanlansa (ogohlantirish): Mijoz summani tasdiqlamagan: xato — ortiqcha pul ketadi.
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
  - 1-variant: Yetkazish hali rejalanmagan: maqsadga yetmay turib ish tugamaydi.
  - 2-variant: Keyingi buyruqni kutish — AI-botning ishi. Agent keyingi qadamni o'zi tanlaydi.
  - 3-variant: Buyurtma allaqachon saqlangan — natijani ko'rgan agent uni qayta yozmaydi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 11 · Amal xavfsizligi
- Eyebrow: Markaziy · xavfsizlik
- Sarlavha: Qaysi amalga odam tasdig'i kerak?
- Mentor: Har amalni belgilang: agent uni o'zi bajarsinmi yoki avval odamdan tasdiq so'rasinmi? Har qatorda bitta urinish.
- Amallar (navbat bilan; har birida ikki tugma: O'zi · Tasdiq kerak):
  1. Buyurtma holatini tekshirish — `checkOrder()` — to'g'ri: O'zi
  2. Buyurtmani bekor qilish — `cancelOrder()` — to'g'ri: Tasdiq kerak
  3. Buyurtmani bazaga yozish — `saveOrder()` — to'g'ri: O'zi
- Belgilangach qatorda: ✓ yoki ✕ va tanlangan javob (O'zi / Tasdiq kerak)
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- Hammasi to'g'ri bo'lsa: Tekshirish va saqlash tasdiqsiz bajariladi; bekor qilish buyurtmani yo'qotadi — uni odam tasdiqlaydi.
- Xato bo'lsa: Bekor qilish buyurtmani yo'qotadi — odam tasdig'i kerak.
- Tugmalar: Orqaga · Har amalni belgilang (N/3) → Davom etish

## 12 · Agent ishda
- Eyebrow: Hayotiy · agent ishda
- Sarlavha: Bitta xabar — agent ishni oxirigacha bajaradi.
- Mentor: Bu — siz yig'gan agent: maqsadi buyurtmani qabul qilib, yetkazishga tayyorlash. Tugmani bosing va u har qadamda nima qilishini kuzating.
- Chap — Agent qadamlari (mijoz ularni ko'rmaydi); bajarilgani ✓ bilan qatorga yig'iladi, joriysi karta bo'lib ochiladi:
  1. **Idrok** — Mijoz: «2 ta Pepperoni, Chilonzor 5-kvartal». Agent xabarni o'qidi.
  2. **Qaror** `checkOrder()` — Avval Pepperoni borligini tekshiraman.
  3. **Amal** `checkOrder()` — Natija: «Pepperoni bor».
  4. **Idrok · Qaror** `saveOrder()` — Pepperoni bor, buyurtma hali bazada yo'q → saqlayman.
  5. **Amal** `saveOrder()` — Natija: buyurtma bazaga yozildi.
  6. **Idrok · Qaror** `arrangeDelivery()` — Buyurtma saqlandi, yetkazish hali rejalanmagan → rejalayman.
  7. **Amal** `arrangeDelivery()` — Natija: kuryer taxminan 30 daqiqada yetkazadi.
  8. **Maqsadga yetdimi? — ha** — Buyurtma qabul qilindi va yetkazishga tayyor. Sikl to'xtaydi, mijozga javob ketadi.
- Tugma: ▶ Agentni ishga tushirish → Keyingi qadam → (tugagach tugma yo'qoladi)
- O'ng — Mijoz ko'radigan chat (AvtoPizza · AI-agent · agent):
  - mijoz: 2 ta Pepperoni, Chilonzor 5-kvartal
  - bot (8 qadamdan keyin): 2 ta Pepperoni qabul qilindi. Chilonzor 5-kvartalga taxminan 30 daqiqada yetkazamiz.
- O'ng — Chaqirilgan tool'lar: hali yo'q → `checkOrder()` · `saveOrder()` · `arrangeDelivery()` (Amal qadamida yangisi chiziq bilan ulanadi)
- Xulosa: Bitta xabarga agent uchta tool'ni chaqirdi. Tartibni o'zi tanladi — lekin faqat siz bergan tool'lar orasidan.
- Tugmalar: Orqaga · Agentni kuzating (N/8) → Davom etish

## 13 · Chegaralar
- Eyebrow: Xavfsizlik · chegara
- Sarlavha: Agent real ish qiladi — unga chegara kerak.
- Mentor: Chegara (inglizcha guardrail) agent nimani qila olishini va nimani so'ramasdan qilmasligini belgilaydi. Uch turini bosib ko'ring.
- Turlar (bosilgani ✓ bilan belgilanadi; o'ngda izohi ochiladi):
  - **Cheklangan tool'lar** — Agentga faqat kerakli tool'larni bering. Masalan, buyurtma agentiga narxni o'zgartirish yoki mijozni bloklash tool'ini bermang: bermagan tool'ini u chaqira olmaydi.
  - **Tasdiq so'rash** — Xavfli amaldan oldin (pul yechish, bekor qilish) agent mijoz yoki admindan tasdiq so'raydi.
  - **Odam nazorati** — Murakkab yoki shubhali holatni agent odamga, masalan AvtoPizza adminiga, uzatadi. Inglizcha nomi — human-in-the-loop.
- Xulosa (3/3 dan keyin): Agentga erkinlik asta-sekin beriladi: avval kam tool va ko'proq tasdiq, ishonch ortgani sari — ko'proq.
- Tugmalar: Orqaga · 3 chegarani ko'ring (N/3) → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Agent mijozning kartasidan pul yechishidan oldin nima muhim?
  - Unga hamma ishda to'liq erkinlik berib qo'yish
  - ✔ Faqat kerakli tool'larni berish va tasdiq so'ratish
  - Pul yechilgach, mijozga xabar yuborib qo'yish
  - Javob berish tezligini iloji boricha oshirish
- Javob izohlari:
  - To'g'ri: Xato pul yechilmasdan oldin to'xtashi kerak — chegara shuning uchun.
  - 1-variant: To'liq erkinlik xavfli: agent xato qilsa, pul haqiqatan yechiladi. Chegara kerak.
  - 3-variant: Xabar pul yechilgandan keyin ketadi — xatoni to'xtata olmaydi. Tasdiq pul yechilishidan oldin so'raladi.
  - 4-variant: Bu yerda tezlik asosiy emas — xavfsizlik muhim: kerakli tool'lar va tasdiq.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Yakuniy — tartibga soling
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: agent ishini tartibga soling.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. Maqsad olinadi
  2. Idrok
  3. Qaror
  4. Amal
  5. Maqsadga yetdimi?
- Joylar: 1 · 2 · 3 · 4 · 5 (bo'sh joyda: bu yerga joylang; «N-qadam» yozuvi raqamni takrorlardi) *(✎ F-1015-120, 208-qonun 0-band: takror olindi)*
- To'g'ri yig'ilgach: 5-qadamdan Idrok'ka qaytuvchi strelka chiziladi
- Javob izohlari:
  - To'g'ri: Tartib to'g'ri: maqsadga yetmaguncha agent yana Idrok'ka qaytadi.
  - Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
  - Birinchi xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 16 · Amaliyot · agent
- Eyebrow: Amaliyot · agent
- Sarlavha: Agentga ikki tool bering: qaysisini chaqiradi?
- Mentor: Darsda ko'rgan `checkOrder` va `saveOrder` endi haqiqiy funksiya bo'ladi — chaqirishni agent o'zi hal qiladi; **«1 · Ochish»**dan boshlang.
- Qadamlar (navbat bilan; bajarilgani ✓ bilan qatorga yig'iladi, ↻ bilan qaytariladi):
  1. **Ochish** — Antigravity'da `TelegramBotNest`, `npm run start:dev`. 6-dars kaliti `.env` da.
  2. **Prompt** — «Nusxalash», Antigravity'ga.
     - Prompt qutisi (Siz → Antigravity; tugma: Nusxalash → ✓ Nusxalandi):
       - AiService ga Gemini function calling qo'sh. Ikki tool: checkOrder(taom, soni) — taom PITSALAR da bormi, narxini qaytaradi; saveOrder(taom, soni, manzil) — BuyurtmaService.yoz bilan bazaga yozadi.
       - System prompt'ga: «MAQSAD: buyurtmani qabul qilib bazaga yozish. CHEGARA: taom borligini tekshirmasdan buyurtma yozilmasin.»
       - Model tool chaqirsa — funksiyani bajar, natijani modelga qaytar, u keyingi qadamni o'zi tanlasin; oxirgi matnni mijozga yoz. Tugmalar va /start o'zgarmasin.
  3. **Ishga tushirish** — terminal xatosiz; konsolga har tool chaqiruvi yozilsin (`checkOrder → …`, `saveOrder → …`).
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telegramda tekshirish** — «2 ta Pepperoni, Chilonzor 5» → konsolda avval `checkOrder`, keyin `saveOrder`; botda tasdiq; `/buyurtmalarim` da yangi qator. Keyin «3 ta Shaurma, Yunusobod» → `checkOrder` yo'q deydi, `saveOrder` chaqirilmaydi.
- Tugma (har qadamda): Bajardim
- O'ng — kutilgan natija · namuna: AvtoPizza (chat): (yorliq natija ostida ✎ F-1015-166)
  - mijoz: 2 ta Pepperoni, Chilonzor 5
  - bot: Tekshirdim: Pepperoni bor. Buyurtma saqlandi: 2 × Pepperoni · Chilonzor 5 — 110 000 so'm.
  - mijoz: 3 ta Shaurma, Yunusobod
  - bot: Shaurma menyuda yo'q — buyurtma yozilmadi. Pitsa tanlaysizmi?
- Ortda qoldingizmi — mentor bilan `git checkout -f dars-10-done`
- Repo: `TelegramBotNest` · teg `dars-10-done`
- Hammasi bajarilgach (yashil): Keyingi qadamni agent tanladi, ishni siz yozgan tool bajardi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.


| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Maqsad olib, tool'lar bilan qadamma-qadam ish bajaradigan bot nima deb ataladi? | AI-agent | Masalan, buyurtmani tekshiradi, saqlaydi, yetkazishni rejalaydi |
| AI faqat javob matnini yozadigan bot qanday ataladi? | AI-bot | 6-darsdagi bot: system prompt bo'yicha javob yozadi |
| Agent sikli qaysi uch qadamdan iborat? | Idrok, Qaror, Amal | Maqsadga yetguncha takrorlanadi |
| Agent vaziyatni qaysi qadamda ko'radi? | Idrok | Xabar, bazadagi ma'lumot va oldingi Amal natijasi |
| Qaysi tool'ni chaqirishni agent qaysi qadamda tanlaydi? | Qaror | Tanlovni AI maqsadga qarab qiladi |
| Agent tool'ni qaysi qadamda chaqiradi? | Amal | Masalan, `saveOrder()` buyurtmani bazaga yozadi |
| Agent chaqira oladigan funksiya nima deb ataladi? | Tool | Uni siz yozasiz, agent faqat tanlaydi |
| Agentga siz qaysi uch narsani berasiz? | Maqsad, tool'lar, chegara | Keyingi qadamni agent shular ichida tanlaydi |
| Agent Amaldan keyin nima qiladi? | Natijani ko'radi | Maqsadga yetmagan bo'lsa — yana Idrok |
| Agent nimani qila olishi va nimani so'ramasdan qilmasligini nima belgilaydi? | Chegara (guardrail) | Masalan, agentga faqat kerakli tool'lar beriladi |
| Pul yechish kabi xavfli amaldan oldin agent nima so'raydi? | Odam tasdig'ini | Tasdiqsiz xavfli amal bajarilmaydi |
| Murakkab holatni agent odamga uzatishi nima deyiladi? | Odam nazorati | Inglizcha: human-in-the-loop |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: ✓ Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ AI-agent qanday ishlashini bilasiz (yonida: N/5 to'g'ri)
- Sarlavha: Endi AI-agent qanday ishlashini bilasiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - AI-bot javob matnini yozadi; AI-agent maqsad sari keyingi qadamni o'zi tanlab, tool chaqiradi
  - Agent sikli: Idrok → Qaror → Amal — maqsadga yetguncha takrorlanadi
  - Tool — agent chaqira oladigan funksiya: uni siz yozasiz, qaysi birini chaqirishni AI tanlaydi
  - Agentga siz maqsad, tool'lar va chegara berasiz — keyingi qadamni u shular ichida tanlaydi
  - Xavfli amaldan (pul yechish, bekor qilish) oldin agent odamdan tasdiq so'raydi
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyda nima qilasiz? (Uyga vazifa bosilgach)
  - Kim uchun — o'z botingiz · Nechta — 1 maqsad, 3–4 tool · Muddat — keyingi darsgacha
  - **Loyihalang** — o'z botingiz uchun bitta maqsad va 3–4 ta tool yozing
  - **Chegaralang** — qaysi amal xavfli (pul yechish, bekor qilish)? Unga odam tasdig'ini qo'ying yoki bu tool'ni bermang
  - **Sinab ko'ring** — agent.service.ts ga uchinchi tool qo'shing (masalan, buyurtmani bekor qilish, odam tasdig'i bilan) va Telegramda sinang
- Keyingi dars — **«Botingiz yaxshi ishlayotganini qaysi raqam aytadi?»** Botingiz foydali ekanini ko'rsatadigan bitta bosh raqamni va unga yordam beradigan uch raqamni tanlaymiz.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
✎ F-1015-123 (16.10, S1-A): uy vazifasi kartasi P-025 — sarlavha «Uyda nima qilasiz?» (bannerdagi «Uyga vazifa» bilan takror emas); maydonlar: Kim uchun — o'z botingiz · Nechta — 1 maqsad, 3–4 tool · Muddat — keyingi darsgacha (qiymatlar topshiriq matnidan); qadamlar raqam-doira; «Keyingi dars» karta ichida; bezak emoji olindi.

## Nishonlar
- Yuqoridagi hisoblagich: Nishonlar — N/4
- **Agent Builder** — Agentga maqsad, tool'lar va chegara berdingiz (5-ekran)
- **Tool Picker** — Har vaziyatga mos tool'ni tanladingiz (7-ekran)
- **Guardrail Keeper** — Pul yechishdan oldin tasdiq so'rashni tanladingiz (9-ekran)
- **Safe Actor** — Qaysi amalga odam tasdig'i kerakligini to'g'ri belgiladingiz (11-ekran)
- Nishon qoidasi yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi.
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. AI-bot va AI-agent farqi (4-ekran)
   - 1 · AI-bot — AI faqat javob matnini yozadi.
   - `saveOrder()` · AI-agent — AI keyingi qadamni tanlaydi va tool chaqiradi.
   - 3 · Bitta javob va sikl — Bot bitta javob bilan to'xtaydi, agent maqsadga yetguncha sikl bo'ylab ishlaydi.
   - Sinfga savol: AI-bot bilan AI-agentning asosiy farqi nima?
2. Agent ishni qanday bajaradi (8-ekran)
   - 1 · Idrok — Vaziyatni ko'radi: xabar va bazadagi ma'lumot.
   - 2 · Qaror — AI maqsadga qarab tool tanlaydi.
   - `saveOrder()` · Amal — Tool chaqiriladi (masalan, `saveOrder()`) va natija qaytadi.
   - Sinfga savol: Agent ishni nima orqali bajaradi?
3. Nega sikl takrorlanadi (10-ekran)
   - 1 · Natijani ko'radi — Har Amaldan keyin agent natijaga qaraydi, bu yangi Idrok.
   - 2 · Maqsadga yetdimi? — Yetmagan bo'lsa, keyingi qadamni tanlaydi.
   - 3 · Takrorlanadi — Maqsadga yetguncha Idrok → Qaror → Amal.
   - Sinfga savol: Agent bitta amaldan keyin nima qiladi?
4. Chegara — agent nimani qila oladi (14-ekran)
   - 1 · Cheklangan tool'lar — Agentga faqat kerakli tool'lar beriladi.
   - `chargeCard()` · Tasdiq so'rash — Xavfli amaldan (pul yechish, bekor qilish) oldin odamdan tasdiq so'raladi.
   - 3 · Odam nazorati — Shubhali holat odamga uzatiladi.
   - Sinfga savol: Agent pul yechishdan oldin nima qilishi kerak?
5. Agent qanday ishlaydi (15-ekran)
   - 1 · Maqsad olinadi — Agent vazifani oladi.
   - 2 · Idrok → Qaror → Amal — Vaziyatni ko'radi, tool tanlaydi, uni chaqiradi.
   - 3 · Maqsadga yetdimi? — Yetmagan bo'lsa, yana Idrok.
   - Chizma: Maqsad olinadi → Idrok → Qaror → Amal → Maqsadga yetdimi?
   - Sinfga savol: Agent ishi nimadan boshlanadi?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: agent · tool · maqsad · idrok · qaror · amal · chegara · sikl · ✗ · ✓

1. AI-bot va AI-agentning asosiy farqi nima?
   - Agentning rangi va shrifti boshqacha bo'ladi
   - ✔ Agent maqsad sari qadamlarni o'zi tanlaydi
   - Ular orasida hech qanday farq yo'q
   - Agent botdan ancha sekin ishlaydi
2. Agent siklidagi «Amal» qadami nima?
   - Mijozning keyingi xabarini kutish
   - Salom berib, menyuni yuborish
   - O'zini o'chirib, ishni to'xtatish
   - ✔ Tanlangan tool'ni chaqirish
3. Tool nima?
   - ✔ Agent chaqira oladigan funksiya
   - Botning rang va shrift sozlamasi
   - Server joylashgan IP-manzil
   - Internetga ulanish tezligi
4. Agent qaysi tool'ni chaqirishni qanday tanlaydi?
   - Ro'yxatdagi birinchi tool'ni oladi
   - AI tasodifan, tavakkaliga tanlaydi
   - ✔ AI maqsad va vaziyatga qarab tanlaydi
   - Har safar odam qo'lda tanlab beradi
5. Agent bitta amalni bajardi. Endi nima qiladi?
   - Ish tugadi deb, shu zahoti to'xtaydi
   - ✔ Natijani ko'rib, keyingi qadamni tanlaydi
   - O'sha amalni yana bir marta bajaradi
   - Mijoz keyingi buyruq yozishini kutadi
6. Agentga siz qaysi uch narsani berasiz?
   - ✔ Maqsad, tool'lar va chegara
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
10. «Cheklangan tool'lar» chegarasi nimani bildiradi?
    - Tool'lar sekinroq ishlay boshlaydi
    - Hamma tool'lar bepul bo'ladi
    - Agentga barcha tool'lar beriladi
    - ✔ Agentga faqat kerakli tool'lar beriladi
11. Agent sikli qaysi tartibda ishlaydi?
    - ✔ Idrok → Qaror → Amal → yana Idrok
    - Amal → Idrok → Qaror → yana Amal
    - Qaror → Amal → Idrok → yana Qaror
    - Idrok → Amal → Qaror → yana Idrok
12. Agent siklida «Qaror» qadamini kim bajaradi?
    - Mijoz har safar qo'lda tanlaydi
    - Hech kim — qadam o'z-o'zidan o'tadi
    - ✔ AI — qaysi tool kerakligini tanlaydi
    - Tool o'zi hal qiladi, AI faqat kutadi
