# 7-dars «O'z Skill'ingizni yozing» — yakuniy matn

Fayl: `src/6-Modull/WriteSkillLesson.jsx` · 20 ekran · Keyingi dars: «Loyiha kuni: to'liq pipeline»
Holat: 05.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Skill yozdingiz: «muloyim javob yoz». Nima qilasiz?
- Mentor: 5-darsda tayyor Skill'ni o'qidingiz. Bugun o'z Skill'ingizni **yozasiz**. Birinchi urinish ko'pincha kutilgandek chiqmaydi — bu normal. Tugmani bosing — Skill'ni sinab ko'ring.
- Kod oynasi «SKILL.md (1-urinish)»:
```
---
name: mijoz-javobi
description: javob yozish
---
Muloyim javob yoz.
```
- Tugma: ▶ Sinab ko'rish → ✓ Natijani ko'rdingiz
- Karta «Natija» (bosilgach): «Kechirasiz, biz buni ko'rib chiqamiz.» — muloyim, lekin foydasiz: aniq yechim yo'q.
- Savol (sinovdan keyin ochiladi): Eng to'g'ri qadam qaysi?
  - Skill yomon chiqdi — undan voz kechaman
  - ✔ Skill noaniq edi — uni aniqroq qilib yozaman
  - AI aybdor — boshqa model kerak
- Javob izohlari:
  - 2-variant: **Aynan!** Skill yozish — jarayon: yozasiz, sinab ko'rasiz, kamchilikni topasiz, tuzatasiz va qayta sinaysiz. Bugun o'z Skill'ingizni shu yo'l bilan yozasiz.
  - 1- va 3-variant: **Qiziq fikr!** Lekin avval o'zingiz yozgan ko'rsatmani tekshiring: bu yerda description ham, body ham juda noaniq. Model almashtirish yoki voz kechishdan oldin Skill'ni aniqroq qilib yozib ko'ramiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: O'z Skill'ingizni yozasiz, sinaysiz va yaxshilaysiz.
- Mentor: 5-darsda tayyor Skill'ni o'qidingiz. Bugun uni o'zingiz yozasiz: aniq nom, aniq description, qadamlar va misol. Keyin sinab ko'rib, kamchiligini tuzatasiz.
- Chap — yorliq «dars oxirida — siz shunday Skill yozasiz» · kod oynasi «SKILL.md (tayyor)»:
```
---
name: mijoz-javobi
description: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
---
# Mijozga javob
1. Uzr so'ra  2. Yechim taklif qil  3. Muddatni ayt
Misol: "Uzr! Bepul almashtiramiz, 1 kun ichida"
```
- O'ng — Bugungi 4 qadam:
  1. name va description yozish · yozish
  2. Qadamlar va misol qo'shish · qadamlar
  3. Skill'ni sinab ko'rish · sinov
  4. Kamchilikni topib, aniq tuzatish · yaxshilash
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Faylni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Skill'ning asosiy qismlari
- Eyebrow: Tushuncha · asosiy qismlar
- Sarlavha: Skill'ning asosiy qismlari: name, description va body.
- Mentor: 5-darsdan eslang: SKILL.md yuqorida frontmatter'dan (name va description), pastda body'dan iborat. Yaxshi Skill yozish uchun shu qismlarning har biri aniq bo'lishi kerak. Tugmani bosing.
- Tugma: Qismlarni ko'rsat → ✓ Ko'rdingiz
- Kartalar (bosilgach):
  - **name:** Skill'ning nomi: kichik harflar va defis bilan (`mijoz-javobi`).
  - **description:** Skill **nima qiladi** va **qachon ishlatiladi**. Claude Skill'ni shunga qarab tanlaydi.
  - **body:** AI bajaradigan aniq, raqamlangan qadamlar va bitta misol.
- Xulosa: Uchalasi aniq bo'lsa, Skill kerakli paytda ishlab, kutilgan natijani berish ehtimoli ancha oshadi. Endi har birini qanday yozishni ko'ramiz.
- Tugmalar: Orqaga · Qismlarni ko'ring → Davom etish

## 3 · description'ni yozish
- Eyebrow: Yozish · description
- Sarlavha: description — Skill nima qiladi va qachon ishlatiladi.
- Mentor: Claude Skill'ni description'ga qarab tanlaydi. Description noaniq bo'lsa, Skill kerakli paytda ishlamasligi yoki keraksiz paytda ishlab ketishi mumkin. Tugmani bosing.
- Chap — karta «Noaniq»:
  - javob yozish
  - → Qanaqa javob? Qaysi vaziyatda? Claude bilmaydi.
- Tugma: Aniq description-chi? → ✓ Ko'rdingiz
- O'ng — karta «Aniq» (bosilgach):
  - Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
  - → QACHON (mijoz shikoyat qilganda) + NIMA (g'amxo'r javob yozadi).
- Xulosa: Qoida: description'da **nima qilishi** va **qachon ishlatilishi** qisqa aytiladi. Javobni qanday yozish — qadamlar — body'ga yoziladi.
- Tugmalar: Orqaga · Farqni ko'ring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Qaysi description yaxshiroq yozilgan?
  - «Mijozlar bilan bog'liq har qanday ishni bajaradi»
  - «Chiroyli va yoqimli matnlar yozishda yordam beradi»
  - «Javob yozadi, kerak bo'lganda ishlatiladi»
  - ✔ «Mijoz shikoyat qilganda g'amxo'r javob yozadi»
- Javob izohlari:
  - To'g'ri: To'g'ri! Yaxshi description qachon ishlatilishini (mijoz shikoyat qilganda) va nima qilishini (g'amxo'r javob yozadi) aniq aytadi. Shunda Claude Skill'ni kerakli paytda tanlaydi.
  - 1-variant: «Har qanday ish» — juda keng: Claude bu Skill'ni keraksiz joyda ham ishlatib yuborishi mumkin.
  - 2-variant: Nima qilishi bor, lekin qachon ishlatilishi yo'q.
  - 3-variant: «Kerak bo'lganda» — qachon ekanini aytmaydi. Qaysi vaziyatda?
- Test yozuvlari (4, 8, 10, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · Body: qadamlar va misol
- Eyebrow: Yozish · body
- Sarlavha: Body — aniq, raqamlangan qadamlar va misol.
- Mentor: Body'ga «yaxshi javob yoz» deb yozsangiz, AI o'zicha taxmin qiladi. Qadamma-qadam yozilsa, unga nima qilish kerakligi tushunarli bo'ladi. Tugmani bosing.
- Chap — karta «Noaniq»: «Mijozga yaxshi javob yoz.»
- Tugma: Aniq qadamlar-chi? → ✓ Ko'rdingiz
- O'ng — kod oynasi «Aniq qadamlar» (bosilgach):
```
1. Avval samimiy uzr so'ra.
2. Aniq yechim taklif qil (almashtirish / qaytarish).
3. Muddatni ayt.
4. Iliq jumla bilan yakunla.
Misol: Uzr so'raymiz! Buzuq mahsulotni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat.
```
- Xulosa: Raqamlangan qadamlar AI'ga nima qilish kerakligini aniqroq tushuntiradi, misol esa kutilgan natija qanday ko'rinishini ko'rsatadi.
- Tugmalar: Orqaga · Aniq qadamlarni ko'ring → Davom etish

## 6 · Skill yig'uvchi
- Eyebrow: Quramiz · Skill yig'uvchi
- Sarlavha: O'z Skill'ingizni yig'ing — fayl o'ng tomonda to'lib boradi.
- Mentor: Endi amalda: har qismni qo'shing va o'ng tomonda SKILL.md qanday to'lib borishini kuzating. Uchala qismni ham qo'shing.
- Chap — tugmalar (bosilgani ✓ bilan belgilanadi, qolgani +):
  - name qo'shish
  - description qo'shish
  - qadamlar va misol qo'shish
- O'ng — kod oynasi «SKILL.md» (qo'shilmagan joyda: (name hali yo'q) · (description hali yo'q) · (qadamlar hali yo'q)); to'lgan holat:
```
---
name: mijoz-javobi
description: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
---

# Mijozga javob
1. Avval samimiy uzr so'ra.
2. Aniq yechim taklif qil (almashtirish / qaytarish).
3. Muddatni ayt.
4. Iliq jumla bilan yakunla.
Misol: Uzr so'raymiz! Buzuq mahsulotni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat.
```
- Xulosa (3/3 dan keyin): Skill tayyor: name, description va body. Endi uni sinab ko'ramiz.
- Tugmalar: Orqaga · Skill'ni yig'ing (N/3) → Davom etish

## 7 · Skill'ni sinash
- Eyebrow: Sinov · Skill'ni sinash
- Sarlavha: Yozdingiz — endi sinab ko'ring.
- Mentor: Skill yaxshi ishlashi hozircha faqat taxmin. Rostan ishlashini sinab ko'rib bilasiz. Haqiqiy shikoyat berib sinaymiz. Tugmani bosing.
- Chap — karta «Sinov: shikoyat»: «Telefonim buzuq keldi! Pulimni qaytaring!»
- Tugma: ▶ Skill bilan sinash → ✓ Sinaldi
- O'ng (bosilgach):
  - Karta «Natija»: «Uzr so'raymiz! Buzuq telefonni bepul almashtiramiz yoki pulingizni qaytaramiz, 1 kun ichida. Sabringiz uchun rahmat»
  - Skill'dagi qadamlarga amal qildi: uzr → yechim → muddat → iliq yakun.
- Xulosa: **Yaxshi chiqdi!** Lekin bitta sinov yetmaydi: Skill'ni **2–3 xil holatda** sinab ko'ring — boshqa shikoyatda ham, shikoyat bo'lmagan oddiy savolda ham (u yerda Skill ishlamasligi kerak). Keyingi ekranlarda natija kutilgandek chiqmagan holatni va uni tuzatishni ko'ramiz.
- Tugmalar: Orqaga · Skill'ni sinang → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Skill qadamlarini kuchli qiladigan narsa qaysi?
  - ✔ Aniq, raqamlangan qadamlar va bitta misol
  - Iloji boricha uzun va batafsil yozilgan matn
  - «Yaxshi qil» degan qisqa umumiy ko'rsatma
  - Faqat Skill'ning nomi va sarlavhasi
- Javob izohlari:
  - To'g'ri: To'g'ri! Aniq, raqamlangan qadamlar AI'ga nima qilish kerakligini tushuntiradi, misol esa kutilgan natijani ko'rsatadi.
  - 2-variant: Uzunlik emas — aniqlik muhim. Uzun, lekin noaniq qadamlar foydasiz.
  - 3-variant: «Yaxshi qil» — AI taxmin qiladi, natija har xil bo'ladi.
  - 4-variant: Faqat nom yetmaydi — AI'ga aniq qadamlar va misol kerak.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Aniq tuzatish
- Eyebrow: Tushuncha · aniq tuzatish
- Sarlavha: Hammasini emas — aniq joyni tuzatasiz.
- Mentor: Natija kutilgandek chiqmasa, Skill'ni qaytadan yozmaysiz. Kamchilikni topib, bitta qoida qo'shasiz yoki so'zni aniqroq qilasiz. Tugmani bosing.
- Tugma: Qanday tuzatiladi? → ✓ Ko'rdingiz
- Kartalar (bosilgach):
  - **Qoida qo'shish:** «narxni ham ko'rsat» degan qadamni qo'shasiz.
  - **So'zni aniqlashtirish:** «qisqa» → «aniq 3 jumla».
  - **Misol qo'shish:** kerakli natijaga o'xshash namuna berasiz.
- Xulosa: Kichik, aniq tuzatish — katta natija. AI'ga to'g'ri ma'lumot va aniq ko'rsatma berishni **kontekst-injiniring** deyishadi — siz hozir aynan shuni qilyapsiz.
- Tugmalar: Orqaga · Qanday tuzatilishini ko'ring → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Skill natijasi kerakli darajada emas. Eng yaxshi qadam qaysi?
  - Skill'dan butunlay voz kechaman
  - Hamma narsani noldan qayta yozib chiqaman
  - ✔ Kamchilikni topib, o'sha joyni tuzatib sinayman
  - AI aybdor — kuchliroq model izlab ko'raman
- Javob izohlari:
  - To'g'ri: To'g'ri! Aniq kamchilikni topasiz, Skill'da o'sha joyni tuzatasiz (qoida qo'shasiz yoki so'zni aniqlashtirasiz), keyin qayta sinaysiz. Kichik, aniq tuzatish — eng samarali yo'l.
  - 1-variant: Voz kechish shart emas — Skill deyarli ishlayapti, faqat aniq tuzatish kerak.
  - 2-variant: Noldan qayta yozish — keraksiz mehnat. Aniq joyni tuzatish yetadi.
  - 4-variant: Avval o'zingiz yozgan ko'rsatmani tekshiring — muammo ko'pincha o'sha yerda bo'ladi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 11 · Yaxshilash sikli
- Eyebrow: Jarayon · yaxshilash sikli
- Sarlavha: Natija chala → aniq tuzatish → natija yaxshilandi.
- Mentor: Mana yaxshilash sikli amalda: 1-variant kutilgandek chiqmadi, kamchilikni topamiz, aniq qoida qo'shamiz, 2-variantni sinaymiz. Tugmani bosib, bosqichlarni kuzating.
- Chap — bosqichlar (har bosishda bittasi):
  1. **Sinov (1-variant)** — Skill: «muloyim javob yoz». Natija: «Kechirasiz, ko'rib chiqamiz.» — muloyim, lekin aniq yechim yo'q.
  2. **Kamchilik** — Skill «aniq yechim taklif qil» demagan. Shuning uchun AI umumiy javob berdi.
  3. **Aniq tuzatish** — Qadamlarga qoida qo'shamiz: «Aniq yechim taklif qil (almashtirish yoki qaytarish) va muddatni ayt.»
  4. **Qayta sinov (2-variant)** — Natija: «Uzr! Bepul almashtiramiz, 1 kun ichida» — endi aniq yechim va muddat bor.
- Tugma: ▶ 1-variantni sinash → Keyingi qadam → → ✓ Natija yaxshilandi
- O'ng — karta «YAXSHILASH SIKLI»: Yozish → Sinab ko'rish → Kamchilikni topish → Tuzatish → Qayta sinab ko'rish. Birinchi urinish darrov mukammal bo'lishi shart emas — sikl uni yaxshilaydi.
- Xulosa (4/4 dan keyin): Bitta aniq qoida qo'shildi — natija yaxshilandi. Hammasini qayta yozmadingiz.
- Tugmalar: Orqaga · Siklni yuring (N/4) → Davom etish

## 12 · Yozish → sinash → tuzatish
- Eyebrow: Hayotiy · Skill yozish
- Sarlavha: Boshidan oxirigacha: yozish → sinash → tuzatish.
- Mentor: Mana to'liq jarayon bitta misolda. Tugmani bosib, Skill qanday yozilib, sinalib va yaxshilanishini kuzating.
- Chap — qadamlar (har bosishda bittasi, yorlig'i «qadam N»):
  1. Yozdik: `mijoz-javobi` — uzr, yechim va muddat qadamlari bilan.
  2. Sinov: «Yetkazib berish kechikdi!» → «Uzr! Tezlashtiramiz.» — yechim bor, lekin muddat yo'q.
  3. Aniq tuzatish: «Aniq muddat ayt (masalan: bugun kechgacha)» qoidasini aniqlashtirdik.
  4. Qayta sinov: «Uzr! Bugun soat 18:00 gacha yetkazamiz, yo'l haqi bizdan» — endi muddat aniq.
  5. Skill tayyor — endi turli shikoyatlarga to'liq javob berishga tayyor. Yangi xil shikoyat chiqsa, yana sinab ko'rasiz.
- Tugma: ▶ Skill'ni yozish → Keyingi qadam → → ✓ Skill tayyor
- O'ng — karta «Diqqat»: 1-variant yechim berdi, lekin muddatni unutdi. Bitta qoidani aniqlashtirish yetdi — hammasini qayta yozmasdan.
- Xulosa (5/5 dan keyin): Skill yozish shunday bo'ladi: birinchi urinish → sinov → aniq tuzatish → tayyor. Endi o'z vazifangizga Skill yoza olasiz.
- Tugmalar: Orqaga · Jarayonni yuring (N/5) → Davom etish

## 13 · SKILL.md bo'sh joylari
- Eyebrow: Amaliyot · SKILL.md
- Sarlavha: SKILL.md fayli qanday yoziladi?
- Mentor: Bu — haqiqiy `SKILL.md` ko'rinishi. Uchta bo'sh joyni to'g'ri variant bilan to'ldiring.
- Chap — yorliq «SKILL.md» · kod oynasi «SKILL.md» (bo'sh joy ____ to'g'ri tanlov bilan to'ladi):
```
---
____: mijoz-javobi
____: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
____

# Mijozga javob
1. Uzr so'ra  2. Yechim taklif qil  3. Muddatni ayt
```
- O'ng — bo'sh joylar (har birida 3 variant; to'g'risi ✔, tanlangach «✓ …»):
  - Skill nomi: title · ✔ name · id
  - Nima qiladi va qachon: ✔ description · summary · trigger
  - Frontmatter'ni yopadigan qator: ### · === · ✔ ---
- Xato izohlari:
  - `title` — SKILL.md'da nom uchun `name` ishlatiladi.
  - `id` — bunday maydon yo'q; nom `name` bilan yoziladi.
  - `summary` — bunday maydon yo'q; qisqa tavsif `description` bilan yoziladi.
  - `trigger` — Skill'ning ishga tushishini shunday deyishadi, lekin maydonning nomi `description`.
  - `###` — Markdown'da sarlavha belgisi, frontmatter'ni yopmaydi.
  - `===` — SKILL.md'da bunday belgi ishlatilmaydi.
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- To'g'ri: SKILL.md to'ldi! `name` — nomi, `description` — nima qiladi va qachon, `---` — frontmatter'ning chegarasi. Pastdagi body sarlavhasini esa o'zingiz tanlaysiz.
- Tugmalar: Orqaga · Bo'sh joylarni to'ldiring → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Natija deyarli to'g'ri, lekin har safar narxni unutyapti. Eng aniq tuzatish qaysi?
  - Butun Skill'ni o'chirib, boshidan yozaman
  - description'ni uzunroq qilib yozaman
  - AI'ga ko'proq pul to'lab, kuchaytiraman
  - ✔ Qadamlarga «narxni ko'rsat» qoidasini qo'shaman
- Javob izohlari:
  - To'g'ri: To'g'ri! Aniq muammo (narx yo'q) → aniq tuzatish: qadamlarga narx qoidasini qo'shasiz va misolda ham narxni ko'rsatasiz. Qolgan hammasi joyida qoladi.
  - 1-variant: Butun Skill'ni qayta yozish — keraksiz. Faqat narx qoidasi yetishmayapti.
  - 2-variant: description Skill qachon ishlatilishini aytadi — narx muammosini qadamlar hal qiladi.
  - 3-variant: Pul masalasi emas — Skill'da narx qoidasi yo'q. O'shani qo'shing.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Yakuniy — jarayonni yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: Skill yaratish jarayonini to'g'ri tartibda yig'ing.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang.
- Joylar: 1 · 2 · 3 · 4 · 5 (bo'sh joyda: bu yerga qo'ying)
- Bo'laklar (aralash chiqadi) — to'g'ri tartib:
  1. Vazifani tanlash
  2. SKILL.md yozish
  3. Sinab ko'rish
  4. Kamchilikni topish
  5. Tuzatib, qayta sinash
- «Kamchilikni topish» «Sinab ko'rish»dan oldin qo'yilsa: Hali sinamasdan kamchilikni qayerdan bilasiz? — Avval sinab ko'riladi, keyin kamchilik topiladi.
- Boshqa xato tartib: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri yig'ilgach: ✓ Jarayon tayyor: **Vazifa → Yozish → Sinov → Kamchilik → Tuzatib qayta sinash** ↻
- Havola (birinchi urinish xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Jarayonni yig'ing → Davom etish

## 16 · Amaliyot · SKILL.md
- Eyebrow: Amaliyot · SKILL.md
- Sarlavha: O'z Skill'ingizni yozing
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'zingiz tez-tez AI'ga beradigan bitta vazifani tanlang va unga SKILL.md yozing: aniq name, description, qadamlar va misol. Keyin sinab ko'rib, kamchilikni tuzating.
- Bosqichlar — belgilab boring (bosilgani ✓ bilan belgilanadi):
  1. Tez-tez beradigan bitta vazifani tanlang — bitta Skill, bitta vazifa (masalan: mijozga javob)
  2. `name:` — kichik harflar va defis bilan nom bering
  3. `description:` — nima qilishi va qachon ishlatilishini yozing
  4. Body: qadamlarni raqamlab yozing va bitta tayyor misol qo'shing
  5. 2–3 xil holatda sinab ko'ring: Claude'da Skill yuklash imkoni bo'lsa — yuklab; bo'lmasa, SKILL.md matnini AI suhbatiga qo'yib, shu yo'riqnoma bo'yicha javob berishini so'rang. Natija chala bo'lsa — aniq qoida qo'shib qayta sinang.
- Tugma: Yana N qadam → Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach: Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium)
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Skill'ning asosiy qismlari qaysi? | name, description va body | Body ichida — qadamlar va misol |
| name qanday yoziladi? | Kichik harflar va defis bilan | Masalan: mijoz-javobi |
| description'da nima yoziladi? | Skill nima qiladi va qachon ishlatiladi | Claude Skill'ni shunga qarab tanlaydi |
| Frontmatter qaysi belgi bilan ochilib-yopiladi? | --- | Ikki --- orasida name va description |
| Body sarlavhasi majburiy so'zmi? | Yo'q | Sarlavhani o'zingiz tanlaysiz |
| Qadamlarni qanday yozish kerak? | Aniq va raqamlab | AI'ga nima qilish kerakligini aniqroq tushuntiradi |
| Misol nega foydali? | Kutilgan natijani ko'rsatadi | AI nimaga intilishni yaxshiroq tushunadi |
| Skill'ni yozib bo'lgach nima qilasiz? | 2–3 xil holatda sinab ko'rasiz | Ishlashini faqat sinov ko'rsatadi |
| Natija chala chiqsa nima qilasiz? | Aniq joyni tuzatasiz | Hammasini qayta yozmaysiz |
| AI'ga to'g'ri ma'lumot va ko'rsatma berish qanday ataladi? | Kontekst-injiniring | Skill yozish — shuning bir ko'rinishi |
| Skill yaratishning to'g'ri sikli qanday? | Yoz, sina, tuzat, qayta sina | Bir marta yozib qo'yish yetmaydi |
| Bitta Skill'ga nechta vazifa yuklanadi? | Bitta aniq vazifa | «Hamma narsani qiladigan» Skill yaxshi ishlamaydi |

- Kartochka yozuvlari: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Hammasi yodlanganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Skill yozishni o'rgandingiz (yonida: N/5 to'g'ri)
- Sarlavha: Endi AI uchun o'z Skill'ingizni yozasiz.
- Arena tugmasi: CODE STRIKE (jonli darsda kutilsa: Mentorni kuting)
- Endi siz bilasiz:
  - Skill yozish — jarayon: yozish → sinash → tuzatish → qayta sinash
  - description — nima qiladi va qachon ishlatiladi; Claude Skill'ni shunga qarab tanlaydi
  - Body — aniq, raqamlangan qadamlar va bitta misol
  - Natija chala bo'lsa — hammasini emas, aniq joyni tuzatasiz
  - Yaxshi Skill: bitta vazifaga, aniq, misolli va 2–3 holatda sinalgan
- Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija) — bosilgach:
  - **Tanlang** — tez-tez AI'ga beradigan bitta vazifani tanlang
  - **Yozing** — unga SKILL.md yozing: name, description, qadamlar va misol
  - **Sinang** — 2–3 xil holatda sinab ko'ring; natija chala bo'lsa, aniq qoida qo'shib qayta sinang
  - Keyingi dars — **Loyiha kuni: to'liq pipeline.** React, Node, PostgreSQL, Telegram va AI'ni bitta ishlaydigan tizimga ulaysiz.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: N/4 · bosilganda: Badges — N/4 (har nishon nomi; olinmagani qulf bilan)
- **Clear Trigger** — Yaxshi description'ni tanladingiz (4-ekran)
- **Step Writer** — Kuchli qadamlar qoidasini 1-urinishda topdingiz (8-ekran)
- **Field Master** — SKILL.md'ni xatosiz to'ldirdingiz (13-ekran)
- **Skill Cycle** — Skill yaratish jarayonini to'g'ri yig'dingiz (15-ekran)
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting
- Nishon yozuvlari (13-ekranda): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. description — nima va qachon (4-ekran)
   - Asosiy qismlar — Skill'ning asosiy qismlari — **name, description, body**.
   - description nimani aytadi — description Skill **nima qilishini** va **qachon ishlatilishini** aytadi.
   - Noaniq bo'lsa — Noaniq bo'lsa — Skill kerakli paytda **ishlamasligi** mumkin.
   - Sinfga savol: Nega description aniq bo'lishi kerak?
2. Qadamlar va misol (8-ekran)
   - Aniq, raqamlangan qadamlar — Aniq, raqamlangan qadamlar AI'ga **nima qilishni** aniqroq tushuntiradi.
   - Bitta misol — namuna — Misol **kutilgan natijani** ko'rsatadi.
   - Umumiy gap — har xil natija — «Yaxshi qil» degan umumiy gap har xil natija beradi.
   - Sinfga savol: Skill qadamlarini nima kuchli qiladi?
3. Aniq tuzatish (10-ekran)
   - Kamchilikni toping — Natija chala bo'lsa — avval **aniq kamchilikni** topasiz.
   - Qoida qo'shing — **O'sha joyga** qoida qo'shasiz.
   - Qayta sinang — Keyin qayta sinaysiz.
   - Sinfga savol: Chala natija chiqsa, eng yaxshi qadam nima?
4. Aniq joyni tuzatish (14-ekran)
   - Aniq qoida — Skill biror narsani unutsa — **qadamlarga** aniq qoida qo'shasiz.
   - Misolda ham ko'rsating — Qoidani misolda ham ko'rsatasiz.
   - Qolgani joyida qoladi — Qolgani joyida qoladi.
   - Sinfga savol: Skill bir narsani unutyapti — eng aniq tuzatish qanday?
5. Skill yaratish jarayoni (15-ekran)
   - Avval — vazifa va yozish — Avval vazifa tanlanadi va **SKILL.md** yoziladi.
   - Keyin — sinov va kamchilik — Keyin **sinab ko'riladi** va kamchilik topiladi.
   - Oxiri — tuzatish — Tuzatib, **qayta sinaladi**.
     - Chizma: Vazifa → Yozish → Sinov → Kamchilik → Tuzatish ↻
   - Sinfga savol: Nega sinovdan oldin kamchilikni topib bo'lmaydi?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena oynasi: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM
- Arena fonidagi so'zlar: SKILL.md · --- · description · body · name: · qadamlar · misol · yozish→sinash→tuzatish · frontmatter · kontekst

1. Skill'ning asosiy qismlari qaysi?
   - Rang, o'lcham va narx
   - Server, Database va dizayn
   - ✔ name, description va body
   - Rasm, video va ovoz
2. description AI'ga nimani aytadi?
   - ✔ Skill nima qiladi va qachon kerak
   - Skill faylining rangi va o'lchami
   - Xabarni kimga yuborish kerakligi
   - Necha ball berilishini
3. Qadamlarni kuchli qiladigan narsa?
   - Iloji boricha uzun matn
   - Faqat sarlavha
   - «Yaxshi qil» degan umumiy gap
   - ✔ Aniq qadamlar va misol
4. Kontekst-injiniring nima?
   - Skill'ni noldan boshlab qayta yozish
   - ✔ AI'ga to'g'ri ma'lumot va ko'rsatma berish
   - Skill'ni butunlay o'chirish
   - AI uchun kuchliroq model sotib olish
5. Natija kutilgandek chiqmasa, eng yaxshi qadam?
   - ✔ Kamchilikni topib, o'sha joyni tuzatib sinash
   - Skill'dan butunlay voz kechish
   - Hammasini noldan boshlab qayta yozish
   - AI'ni ayblab, boshqa kuchliroq model izlash
6. Nega Skill'ni sinab ko'rish kerak?
   - Chiroyliroq ko'rinishi uchun
   - Ballni oshirish uchun
   - Faylni o'chirish uchun
   - ✔ Ishlashini faqat sinab bilamiz
7. Yaxshi description qanday bo'ladi?
   - Bitta so'zdan iborat, masalan «javob»
   - ✔ Nima qilishi va qachon kerakligini aytadi
   - Iloji boricha noaniq, har narsaga mos
   - Faqat emojidan iborat qisqa satr
8. Misol Skill uchun nega foydali?
   - Faylni uzunroq qiladi
   - Faqat bezak uchun
   - ✔ Kutilgan natijani ko'rsatadi
   - Hech qanday ta'sir qilmaydi
9. Skill har safar narxni unutyapti. Eng aniq tuzatish?
   - Butun Skill'ni o'chirib, boshidan yozish
   - description'ni uzunroq qilib yozish
   - AI'ga ko'proq pul to'lab, kuchaytirish
   - ✔ Qadamlarga «narxni ko'rsat» qoidasini qo'shish
10. Skill yozishning to'g'ri sikli qaysi?
    - Bir marta yozish, hech qachon tekshirmaslik
    - ✔ Yozish → sinash → tuzatish → qayta sinash
    - Sinash → o'chirish → unutish
    - Ko'chirish → jo'natish → kutish
11. Noaniq description nimaga olib keladi?
    - Skill ikki barobar tezroq ishlaydi
    - Hech qanday ta'sir yo'q, hammasi bir xil
    - ✔ Skill kerakli paytda ishlamasligi mumkin
    - Ball o'z-o'zidan oshib ketadi
12. Yaxshi Skill qanday bo'ladi?
    - ✔ Bitta vazifaga, aniq va sinalgan
    - Iloji boricha uzun va batafsil
    - Ko'p vazifani birga bajaradigan
    - Faqat nomdan iborat bo'lgan
- Arena yozuvlari: Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · ball · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish
