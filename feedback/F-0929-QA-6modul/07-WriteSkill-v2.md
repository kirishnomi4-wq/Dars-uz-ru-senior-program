# 6-Modul (LMS: 8-Modul) · 7-dars «O'z Skill'ingizni yozing» — YANGI MATN (v2)

Fayl: `src/6-Modull/WriteSkillLesson.jsx` · 20 ekran · faqat o'zbekcha
Eski matn: `07-WriteSkill-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=4-variant, s8=1, s10=3, s14=4; arena kaliti o'zgarmaydi) — faqat matn.

---

## A. Darsning tayanchi (5-dars v2 bilan bir xil atamalar)

**Skill tuzilishi (fayl):** `SKILL.md` = frontmatter (`name` + `description`) + body (qadamlar va misol).
- `name` — kichik harflar, raqam va defis: `mijoz-javobi`
- `description` — Skill **nima qiladi va qachon ishlatiladi** (qisqa). Batafsil «qanday» — body'da.
- body — oddiy matn: sarlavhasi va tuzilishini o'zingiz tanlaysiz (masalan, `# Mijozga javob`), ichida qadamlar va misol.

**Skill yaratish jarayoni (ish):** Yoz → Sinab ko'r → Kamchilikni top → Tuzat → Qayta sinab ko'r.
Tuzilish va jarayon — **ikki alohida narsa** (oldin 15-ekranda aralash edi).

**Qoida:** Bitta Skill — bitta aniq vazifa.
**Kafolat yo'q:** yaxshi Skill natijani siz kutganga yaqinlashtiradi, lekin AI har safar so'zma-so'z bir xil yozmaydi.
**Metafora yo'q:** «super-kuch kartasi», «karta yondi / xira yondi», «mashg'ulot maydoni» — olib tashlanadi. Asosiy so'z — **Skill**.

---

## 0 · Kirish — birinchi urinish  `[741]`
- Eyebrow: Dars · kirish
- Sarlavha: **Shoshib Skill yozdingiz: «muloyim javob yoz». Natija kutilgandek chiqmadi. Nima qilasiz?**
- Mentor: 5-darsda tayyor Skill'ni o'qidingiz. Bugun o'z Skill'ingizni **yozasiz**. Birinchi urinish ko'pincha kutilgandek chiqmaydi — bu normal. Tugmani bosing — Skill'ni sinab ko'ring.
- Fayl: 📄 SKILL.md (1-urinish)
  ```
  ---
  name: mijoz-javobi
  description: javob yozish
  ---
  Muloyim javob yoz.
  ```
- Tugma: ▶ Sinab ko'rish → ✓ Natijani ko'rdingiz
- Natija: ❌ «Kechirasiz, biz buni ko'rib chiqamiz.» — muloyim, lekin foydasiz: aniq yechim yo'q.
- Savol: **Eng to'g'ri qadam qaysi?**
  - Skill yomon chiqdi — undan voz kechaman
  - Skill noaniq edi — uni aniqroq qilib yozaman
  - AI aybdor — boshqa model kerak
- Javob — 2-variant: **Aynan!** Skill yozish — jarayon: yozasiz, sinab ko'rasiz, kamchilikni topasiz, tuzatasiz va qayta sinaysiz. Bugun o'z Skill'ingizni shu yo'l bilan yozasiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Lekin avval o'zingiz yozgan ko'rsatmani tekshiring: bu yerda description ham, body ham juda noaniq. Model almashtirish yoki voz kechishdan oldin Skill'ni aniqroq qilib yozib ko'ramiz.

✎ 🔴 FAKT: «O'tgan darsda tayyor kartani o'qidingiz» → «5-darsda» (o'tgan dars — 6-dars, PM) · «karta xira yondi», «mashg'ulot maydoni» → oddiy so'zlar · javob tanlovga qarab ikki xil

## 1 · Reja  `[782]`
- Sarlavha: **O'z Skill'ingizni yozasiz, sinaysiz va yaxshilaysiz.**
- Mentor: 5-darsda tayyor Skill'ni o'qidingiz. Bugun uni o'zingiz yozasiz: aniq nom, aniq description, qadamlar va misol. Keyin sinab ko'rib, kamchiligini tuzatasiz.
- Fayl: 📄 SKILL.md (tayyor)
  ```
  ---
  name: mijoz-javobi
  description: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
  ---
  # Mijozga javob
  1. Uzr so'ra  2. Yechim taklif qil  3. Muddatni ayt
  Misol: "Uzr! Bepul almashtiramiz, 1 kun ichida 🙏"
  ```
- Bugungi 4 qadam:
  1. name va description yozish · *yozish*
  2. Qadamlar va misol qo'shish · *qadamlar*
  3. Skill'ni sinab ko'rish · *sinov*
  4. Kamchilikni topib, aniq tuzatish · *yaxshilash*

✎ «iteratsiya», «trigger», «kontekst-injiniring» reja yorliqlaridan olib tashlandi · namunadagi description to'liq jumla (nima + qachon)

## 2 · Skill'ning asosiy qismlari  `[819]`
- Eyebrow: Tushuncha · asosiy qismlar
- Sarlavha: **Skill'ning asosiy qismlari: name, description va body.**
- Mentor: 5-darsdan eslang: SKILL.md yuqorida frontmatter'dan (name va description), pastda body'dan iborat. Yaxshi Skill yozish uchun shu qismlarning har biri aniq bo'lishi kerak. Tugmani bosing.
- Tugma: Qismlarni ko'rsat → ✓ Ko'rdingiz
- Kartalar:
  - **name** — Skill'ning nomi: kichik harflar va defis bilan (`mijoz-javobi`).
  - **description** — Skill nima qiladi va qachon ishlatiladi. Claude Skill'ni shunga qarab tanlaydi.
  - **body** — AI bajaradigan aniq, raqamlangan qadamlar va bitta misol.
- Xulosa: Uchalasi aniq bo'lsa, Skill kerakli paytda ishlab, kutilgan natijani berish ehtimoli ancha oshadi. Endi har birini qanday yozishni ko'ramiz.

✎ «Har super-kuch kartasi — 3 maydon: nomi, qachon ishlaydi, qadamlar» → 5-dars bilan bir xil nomlar: name · description · body (qadamlar + misol) · «karta to'g'ri yonadi» (kafolat) → «ehtimoli oshadi»

## 3 · description  `[850]`
- Eyebrow: Yozish · description
- Sarlavha: **description — Skill nima qiladi va qachon ishlatiladi.**
- Mentor: Claude Skill'ni description'ga qarab tanlaydi. Description noaniq bo'lsa, Skill kerakli paytda ishlamasligi yoki keraksiz paytda ishlab ketishi mumkin. Tugmani bosing.
- ❌ Noaniq: «javob yozish» → Qanaqa javob? Qaysi vaziyatda? Claude bilmaydi.
- Tugma: Aniq description-chi? → ✓ Ko'rdingiz
- ✅ Aniq: «Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.» → QACHON (mijoz shikoyat qilganda) + NIMA (g'amxo'r javob yozadi).
- Xulosa: Qoida: description'da **nima qilishi** va **qachon ishlatilishi** qisqa aytiladi. Javobni qanday yozish — qadamlar — body'ga yoziladi.

✎ «kuch qaysi paytda yonadi», «Bu — kartaning eng muhim qatori» → aniq ta'rif · description (qisqa nima + qachon) va body (batafsil qanday) vazifasi ajratildi

## 4 · 1-savol ✅  `[878]`
- Savol: **Qaysi description yaxshiroq yozilgan?**
  - «Mijozlar bilan bog'liq har qanday ishni bajaradi»
  - «Chiroyli va yoqimli matnlar yozishda yordam beradi»
  - «Javob yozadi, kerak bo'lganda ishlatiladi»
  - ✔ «Mijoz shikoyat qilganda g'amxo'r javob yozadi»
- To'g'ri: To'g'ri! Yaxshi description qachon ishlatilishini (mijoz shikoyat qilganda) va nima qilishini (g'amxo'r javob yozadi) aniq aytadi. Shunda Claude Skill'ni kerakli paytda tanlaydi.
- Xato izohlari:
  - «Har qanday ish» — juda keng: Claude bu Skill'ni keraksiz joyda ham ishlatib yuborishi mumkin.
  - Nima qilishi bor, lekin qachon ishlatilishi yo'q.
  - «Kerak bo'lganda» — qachon ekanini aytmaydi. Qaysi vaziyatda?
  - (umumiy) Yaxshi description — nima qiladi + qachon ishlatiladi.

✎ 🔴 Test «sotilib» qolgan edi: xato variantlar bitta-ikki so'z, to'g'ri javob esa eng uzun va sarlavhadagi «qachon + nima»ni aynan takrorlardi. Endi to'rttalasi ham ishonarli description, uzunligi teng

## 5 · Qadamlar va misol  `[901]`
- Eyebrow: Yozish · body
- Sarlavha: **Body — aniq, raqamlangan qadamlar va misol.**
- Mentor: Body'ga «yaxshi javob yoz» deb yozsangiz, AI o'zicha taxmin qiladi. Aniq, raqamlangan qadamlar yozsangiz, unga nima qilish kerakligi aniqroq tushunarli bo'ladi. Tugmani bosing.
- ❌ Noaniq: «Mijozga yaxshi javob yoz.»
- Tugma: Aniq qadamlar-chi? → ✓ Ko'rdingiz
- ✅ Aniq qadamlar (o'zgarmaydi): 1. Avval samimiy uzr so'ra. 2. Aniq yechim taklif qil (almashtirish / qaytarish). 3. Muddatni ayt. 4. Iliq jumla bilan yakunla. · Misol: Uzr so'raymiz! Buzuq mahsulotni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat 🙏
- Xulosa: Raqamlangan qadamlar AI'ga nima qilish kerakligini aniqroq tushuntiradi, misol esa kutilgan natija qanday ko'rinishini ko'rsatadi.

✎ «AI taxmin qilmaydi, aniq bajaradi», «Misol — eng kuchli qism» (kafolat va reyting) → 5-dars v2 bilan bir xil yumshoq ifoda

## 6 · Skill yig'uvchi (markaziy)  `[934]`
- Eyebrow: Quramiz · Skill yig'uvchi
- Sarlavha: **O'z Skill'ingizni yig'ing — fayl o'ng tomonda to'lib boradi.**
- Mentor: Endi amalda: har qismni qo'shing va o'ng tomonda SKILL.md qanday to'lib borishini kuzating. Uchala qismni ham qo'shing.
- Tugmalar: name qo'shish · description qo'shish · qadamlar va misol qo'shish
- Yorliq: 📄 SKILL.md
- Bo'sh joylar: (name hali yo'q) · (description hali yo'q) · (qadamlar hali yo'q)
- To'lgach: name: mijoz-javobi · description: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi. · # Mijozga javob + 4 qadam + misol
- Xulosa: Skill tayyor: name, description va body. Endi uni sinab ko'ramiz.

✎ «jonli super-kuch kartasi» → SKILL.md fayli · description «…yonadi — rasmiy va g'amxo'r javob yozadi» → sodda jumla

## 7 · Sinab ko'rish  `[970]`
- Eyebrow: Sinov · Skill'ni sinash
- Sarlavha: **Yozdingiz — endi sinab ko'ring.**
- Mentor: Skill yaxshi ishlashi hozircha faqat taxmin. Rostan ishlashini sinab ko'rib bilasiz. Haqiqiy shikoyat berib sinaymiz. Tugmani bosing.
- 🧪 Sinov: shikoyat — «Telefonim buzuq keldi! Pulimni qaytaring!»
- Tugma: ▶ Skill bilan sinash → ✓ Sinaldi
- ✅ Natija: «Uzr so'raymiz! Buzuq telefonni bepul almashtiramiz yoki pulingizni qaytaramiz, 1 kun ichida. Sabringiz uchun rahmat 🙏»
- Izoh: Skill'dagi qadamlarga amal qildi: uzr → yechim → muddat → iliq yakun.
- Xulosa: Yaxshi chiqdi! Lekin bitta sinov yetmaydi: Skill'ni 2–3 xil holatda sinab ko'ring — boshqa shikoyatda ham, shikoyat bo'lmagan oddiy savolda ham (u yerda Skill ishlamasligi kerak). Keyingi ekranlarda natija kutilgandek chiqmagan holatni va uni tuzatishni ko'ramiz.

✎ «Karta yozish — taxmin» (tushunarsiz) → aniq jumla · 🔴 «bitta sinov yaxshi chiqdi — tayyor» degan xulosa chiqmasin: 2–3 xil holat va «ishlamasligi kerak bo'lgan» holat qo'shildi (Skill'ni sinashning haqiqiy qoidasi)

## 8 · 2-savol ✅  `[1001]`
- Savol: **Skill qadamlarini kuchli qiladigan narsa qaysi?**
  - ✔ Aniq, raqamlangan qadamlar va bitta misol
  - Iloji boricha uzun va batafsil yozilgan matn
  - «Yaxshi qil» degan qisqa umumiy ko'rsatma
  - Faqat Skill'ning nomi va sarlavhasi
- To'g'ri: To'g'ri! Aniq, raqamlangan qadamlar AI'ga nima qilish kerakligini tushuntiradi, misol esa kutilgan natijani ko'rsatadi.
- Xato izohlari:
  - Uzunlik emas — aniqlik muhim. Uzun, lekin noaniq qadamlar foydasiz.
  - «Yaxshi qil» — AI taxmin qiladi, natija har xil bo'ladi.
  - Faqat nom yetmaydi — AI'ga aniq qadamlar va misol kerak.
  - (umumiy) Aniq qadamlar va misol.

✎ Variantlar tenglashtirildi · «AI'ni adashtirmaydi», «izchil natija» (kafolat) → yumshatildi

## 9 · Aniq tuzatish  `[1024]`
- Eyebrow: Tushuncha · aniq tuzatish
- Sarlavha: **Natija kutilgandek chiqmasa — hammasini emas, aniq joyni tuzatasiz.**
- Mentor: Natija kutilgandek chiqmasa, Skill'ni qaytadan yozmaysiz. Kamchilik qayerdaligini topib, o'sha joyni tuzatasiz — bitta qoida qo'shasiz yoki so'zni aniqroq qilasiz. Tugmani bosing.
- Tugma: Qanday tuzatiladi? → ✓ Ko'rdingiz
- Kartalar:
  - ➕ **Qoida qo'shish:** «narxni ham ko'rsat» degan qadamni qo'shasiz.
  - ✏️ **So'zni aniqlashtirish:** «qisqa» → «aniq 3 jumla».
  - ✨ **Misol qo'shish:** kerakli natijaga o'xshash namuna berasiz.
- Xulosa: Kichik, aniq tuzatish — katta natija. AI'ga to'g'ri ma'lumot va aniq ko'rsatma berishni **kontekst-injiniring** deyishadi — siz hozir aynan shuni qilyapsiz.

✎ «Kontekst-injiniring» endi asosiy termin emas — avval oddiy ma'no («aniq tuzatish»), atama oxirida bir marta, to'g'ri ta'rif bilan (AI'ga to'g'ri ma'lumot va ko'rsatma berish; oldingi «kartani aniq sozlash» ta'rifi tor edi) · «o'tkirlash / o'tkirlashtirish» (ikki shakl) → «aniqlashtirish»

## 10 · 3-savol ✅  `[1056]`
- Savol: **Skill natijasi kerakli darajada emas. Eng yaxshi qadam qaysi?**
  - Skill'dan butunlay voz kechaman
  - Hamma narsani noldan qayta yozib chiqaman
  - ✔ Kamchilikni topib, o'sha joyni tuzatib sinayman
  - AI aybdor — kuchliroq model izlab ko'raman
- To'g'ri: To'g'ri! Aniq kamchilikni topasiz, Skill'da o'sha joyni tuzatasiz (qoida qo'shasiz yoki so'zni aniqlashtirasiz), keyin qayta sinaysiz. Kichik, aniq tuzatish — eng samarali yo'l.
- Xato izohlari:
  - Voz kechish shart emas — Skill deyarli ishlayapti, faqat aniq tuzatish kerak.
  - Noldan qayta yozish — keraksiz mehnat. Aniq joyni tuzatish yetadi.
  - Avval o'zingiz yozgan ko'rsatmani tekshiring — muammo ko'pincha o'sha yerda bo'ladi.
  - (umumiy) Kamchilikni aniq tuzatib, qayta sinang.

✎ «Muammo modelda emas — kartada» (qat'iy) → «avval ko'rsatmani tekshiring, muammo ko'pincha o'sha yerda»

## 11 · Yaxshilash sikli  `[1079]`
- Eyebrow: Jarayon · yaxshilash sikli
- Sarlavha: **Natija chala → aniq tuzatish → natija yaxshilandi.**
- Mentor: Mana yaxshilash sikli amalda: 1-variant kutilgandek chiqmadi, kamchilikni topamiz, aniq qoida qo'shamiz, 2-variantni sinaymiz. Tugmani bosib, bosqichlarni kuzating.
- Bosqichlar (tugma: ▶ 1-variantni sinash → Keyingi qadam → → ✓ Natija yaxshilandi):
  1. 🧪 **Sinov (1-variant)** — Skill: «muloyim javob yoz». Natija: «Kechirasiz, ko'rib chiqamiz.» — muloyim, lekin aniq yechim yo'q. ❌
  2. 🔍 **Kamchilik** — Skill «aniq yechim taklif qil» demagan. Shuning uchun AI umumiy javob berdi.
  3. 🔧 **Aniq tuzatish** — Qadamlarga qoida qo'shamiz: «Aniq yechim taklif qil (almashtirish yoki qaytarish) va muddatni ayt.»
  4. ✅ **Qayta sinov (2-variant)** — Natija: «Uzr! Bepul almashtiramiz, 1 kun ichida 🙏» — endi aniq yechim va muddat bor.
- O'ng karta: 🔁 **Yaxshilash sikli** — Yoz → Sinab ko'r → Kamchilikni top → Tuzat → Qayta sinab ko'r. Birinchi urinish darrov mukammal bo'lishi shart emas — sikl uni yaxshilaydi.
- Xulosa: Bitta aniq qoida qo'shildi — natija yaxshilandi. Hammasini qayta yozmadingiz.

✎ «Animatsiya · …» (ichki yorliq) → «Jarayon · …» · «v1 / v2» → «1-variant / 2-variant» · «Birinchi qoralama hech qachon mukammal emas» (qat'iy) → «darrov mukammal bo'lishi shart emas» · «karta xira/to'g'ri yondi» olib tashlandi

## 12 · Yoz → sina → tuzat (case)  `[1113]`
- Eyebrow: Hayotiy · Skill yozish
- Sarlavha: **Boshidan oxirigacha: yoz → sina → tuzat.**
- Mentor: Mana to'liq jarayon bitta misolda. Tugmani bosib, Skill qanday yozilib, sinalib va yaxshilanishini kuzating.
- Qadamlar (tugma: ▶ Skill'ni yozish → Keyingi qadam → → ✓ Skill tayyor):
  1. Yozdik: `mijoz-javobi` — uzr, yechim va muddat qadamlari bilan.
  2. Sinov: «Yetkazib berish kechikdi!» → «Uzr! Tezlashtiramiz.» — yechim bor, lekin muddat yo'q.
  3. Aniq tuzatish: «Aniq muddat ayt (masalan: bugun kechgacha)» qoidasini aniqlashtirdik.
  4. Qayta sinov: «Uzr! Bugun soat 18:00 gacha yetkazamiz, yo'l haqi bizdan 🙏» — endi muddat aniq.
  5. Skill tayyor — endi turli shikoyatlarga to'liq javob berishga tayyor. Yangi xil shikoyat chiqsa, yana sinab ko'rasiz.
- 💡 Diqqat: 1-variant yechim berdi, lekin muddatni unutdi. Bitta qoidani aniqlashtirish yetdi — hammasini qayta yozmasdan.
- Xulosa: Skill yozish shunday bo'ladi: birinchi urinish → sinov → aniq tuzatish → tayyor. Endi o'z vazifangizga Skill yoza olasiz.

✎ «endi har shikoyatga izchil, to'liq javob bilan yonadi» (kafolat) → «tayyor; yangi holat chiqsa, yana sinaysiz»

## 13 · SKILL.md'ni to'ldiring (nishon)  `[1161]`
- Eyebrow: Amaliyot · SKILL.md
- Sarlavha: **SKILL.md fayli qanday yoziladi?**
- Mentor: Bu — haqiqiy SKILL.md ko'rinishi. Uchta bo'sh joyni to'g'ri variant bilan to'ldiring.
- Kod (📄 SKILL.md):
  ```
  ---
  ____: mijoz-javobi
  ____: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
  ____

  # Mijozga javob
  1. Uzr so'ra  2. Yechim taklif qil  3. Muddatni ayt
  ```
- Bo'shliqlar (✔ o'rni o'zgarmaydi):
  1. Skill nomi: `title` · ✔ `name` · `id`
  2. Nima qiladi va qachon: ✔ `description` · `summary` · `trigger`
  3. Frontmatter'ni yopadigan qator: `###` · `===` · ✔ `---`
- Xato izohlari:
  - `title` — SKILL.md'da nom uchun `name` ishlatiladi.
  - `id` — bunday maydon yo'q; nom `name` bilan yoziladi.
  - `summary` — bunday maydon yo'q; qisqa tavsif `description` bilan yoziladi.
  - `trigger` — Skill'ning ishga tushishini shunday deyishadi, lekin maydonning nomi `description`.
  - `###` — Markdown'da sarlavha belgisi, frontmatter'ni yopmaydi.
  - `===` — SKILL.md'da bunday belgi ishlatilmaydi.
  - (umumiy) Bu to'g'ri emas — qayta o'ylab ko'ring.
- Muvaffaqiyat: SKILL.md to'ldi! `name` — nomi, `description` — nima qiladi va qachon, `---` — frontmatter'ning chegarasi. Pastdagi body sarlavhasini esa o'zingiz tanlaysiz.

✎ 🔴 TEXNIK XATO: oldin uchinchi bo'shliq `# ____` → ✔ «qadamlar» edi — go'yo body'ning majburiy nomi «qadamlar». Haqiqiy SKILL.md'da body sarlavhasi erkin; bunday kalit so'z yo'q. Endi uchinchi bo'shliq — haqiqiy sintaksis: frontmatter'ni yopuvchi `---` · xato variantlar endi ishonarli (`title`, `summary`, `trigger` — o'quvchi haqiqatan adashishi mumkin bo'lgan so'zlar; oldin `password`, `rasm`, `ovoz` — javob o'z-o'zidan ko'rinardi) · «chip» (taqiqlangan so'z) → «variant»

## 14 · 4-savol ✅  `[1221]`
- Savol: **Natija deyarli to'g'ri, lekin har safar narxni unutyapti. Eng aniq tuzatish qaysi?**
  - Butun Skill'ni o'chirib, boshidan yozaman
  - description'ni uzunroq qilib yozaman
  - AI'ga ko'proq pul to'lab, kuchaytiraman
  - ✔ Qadamlarga «narxni ko'rsat» qoidasini qo'shaman
- To'g'ri: To'g'ri! Aniq muammo (narx yo'q) → aniq tuzatish: qadamlarga narx qoidasini qo'shasiz va misolda ham narxni ko'rsatasiz. Qolgan hammasi joyida qoladi.
- Xato izohlari:
  - Butun Skill'ni qayta yozish — keraksiz. Faqat narx qoidasi yetishmayapti.
  - description Skill qachon ishlatilishini aytadi — narx muammosini qadamlar hal qiladi.
  - Pul masalasi emas — Skill'da narx qoidasi yo'q. O'shani qo'shing.
  - (umumiy) Qadamlarga aniq narx qoidasini qo'shing.

✎ «nishonli o'zgartirish» (nishon = badge bilan chalkashardi) → «aniq tuzatish»

## 15 · Jarayonni yig'ing ✅ (final)  `[1244]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: Skill yaratish jarayonini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang.
- Bo'laklar: Vazifani tanlash · SKILL.md yozish · Sinab ko'rish · Kamchilikni topish · Tuzatib, qayta sinash
- Joylar: har katakda raqam (1…5) + «bu yerga qo'ying»
✎ QAROR F-0929-27 (29.09, foydalanuvchi Q1-B): katak izohi «bu yerga qo'ying» — katakda raqam allaqachon bor, «1 · 1-qadam» takrorlanardi; joylashuv ikki ustun (kataklar chapda, bo'laklar o'ngda)
- Maxsus xato (kamchilik sinovdan oldin qo'yilsa): 😕 Hali sinamasdan kamchilikni qayerdan bilasiz? Avval sinab ko'riladi, keyin kamchilik topiladi.
- Boshqa xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri (bir marta): ✓ Jarayon tayyor: **Vazifa → Yozish → Sinov → Kamchilik → Tuzatib qayta sinash** ↻

✎ 🔴 MANTIQ XATOSI: oldin «Nomi → Qachon ishlaydi → Qadamlar → Misol → Mashg'ulotda test» — fayl tuzilishi bilan ish jarayoni aralash edi (test faylning qismi emas). Ustiga YAML'da `name` va `description` tartibi texnik jihatdan ahamiyatsiz — tartib so'rash noto'g'ri. Endi ma'noli tartib — **jarayon** · ⚠️ KOD: maxsus xato-shart («misol qadamlardan oldin») yangi shartga almashadi (Quruvchi ishi)

## 16 · Amaliyot · SKILL.md  `[2097]`
- Eyebrow: Amaliyot · SKILL.md · joy: «kompyuteringizda»
- Sarlavha: **O'z Skill'ingizni yozing**
- Mentor: Bu topshiriqni o'z kompyuteringizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Topshiriq: O'zingiz tez-tez AI'ga beradigan bitta vazifani tanlang va unga SKILL.md yozing: aniq name, description, qadamlar va misol. Keyin sinab ko'rib, kamchilikni tuzating.
- Bosqichlar:
  1. Tez-tez beradigan bitta vazifani tanlang — bitta Skill, bitta vazifa (masalan: mijozga javob)
  2. `name:` — kichik harflar va defis bilan nom bering
  3. `description:` — nima qilishi va qachon ishlatilishini yozing
  4. Body: qadamlarni raqamlab yozing va bitta tayyor misol qo'shing
  5. 2–3 xil holatda sinab ko'ring: Claude'da Skill yuklash imkoni bo'lsa — yuklab; bo'lmasa, SKILL.md matnini AI suhbatiga qo'yib, shu yo'riqnoma bo'yicha javob berishini so'rang. Natija chala bo'lsa — aniq qoida qo'shib qayta sinang.

✎ «super-kuch kartangizni yozing» → «O'z Skill'ingizni yozing» · 🔴 «mashg'ulot maydonida sinang» — bunday joy yo'q; o'quvchi uyda qayerda sinashini bilmasdi → haqiqiy ikki yo'l ko'rsatildi · «bitta Skill — bitta vazifa» qoidasi qo'shildi

## 17 · Natijalar (podium)  `[1843]` — o'zgarmaydi (umumiy shablon)

## 18 · Takrorlash (kartochkalar)  `[2125]`

| Old tomon | Orqa | Izoh |
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

✎ Qo'shildi: `name` qoidasi, `---`, «body sarlavhasi erkin» · «Misol — eng kuchli qism», «AI taxmin qilmaydi, aynan bajaradi» olib tashlandi

## 19 · Yakun  `[2138]`
- Eyebrow: Tayyor · Belgi: ✓ Skill yozishni o'rgandingiz
- Sarlavha: **Endi AI uchun o'z Skill'ingizni yozasiz.**
- Endi siz bilasiz:
  - Skill yozish — jarayon: yoz → sina → tuzat → qayta sina
  - description — nima qiladi va qachon ishlatiladi; Claude Skill'ni shunga qarab tanlaydi
  - Body — aniq, raqamlangan qadamlar va bitta misol
  - Natija chala bo'lsa — hammasini emas, aniq joyni tuzatasiz
  - Yaxshi Skill: bitta vazifaga, aniq, misolli va 2–3 holatda sinalgan
- Uyga vazifa:
  - **Tanlang** — tez-tez AI'ga beradigan bitta vazifani tanlang
  - **Yozing** — unga SKILL.md yozing: name, description, qadamlar va misol
  - **Sinang** — 2–3 xil holatda sinab ko'ring; natija chala bo'lsa, aniq qoida qo'shib qayta sinang
- 🚀 Keyingi dars — **Praktika: to'liq pipeline.** React, Node, PostgreSQL, Telegram va AI'ni bitta ishlaydigan tizimga ulaysiz.

✎ 🔴 FAKT: «Keyingi dars — kartalar to'plamini birga ishlatamiz: bir nechta super-kuch kartasini bitta loyihada boshqaramiz!» — keyingi dars aslida «Praktika: to'liq pipeline» (8-dars). Bunday dars yo'q

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, mavzuga moslanadi:
- ⚡ **Clear Trigger** — yaxshi description'ni tanladingiz (4)
- 🧩 **Step Writer** — kuchli qadamlar qoidasini 1-urinishda topdingiz (8)
- 🗂️ **Field Master** — SKILL.md'ni xatosiz to'ldirdingiz (13)
- 🔁 **Skill Cycle** — Skill yaratish jarayonini to'g'ri yig'dingiz (15)

✎ «Card Writer» → «Step Writer» · «Tested Skill — Karta strukturasini to'g'ri yig'dingiz» → jarayon (15-ekran endi jarayon haqida)

**Qisqa takrorlash oynalari (5):**
1. (4) **description — nima va qachon:** Skill'ning asosiy qismlari — name, description, body. · description nima qilishini va qachon ishlatilishini aytadi. · Noaniq bo'lsa — Skill kerakli paytda ishlamasligi mumkin. · Sinfga savol: Nega description aniq bo'lishi kerak?
2. (8) **Qadamlar va misol:** Aniq, raqamlangan qadamlar AI'ga nima qilishni aniqroq tushuntiradi. · Misol kutilgan natijani ko'rsatadi. · «Yaxshi qil» degan umumiy gap har xil natija beradi. · Sinfga savol: Skill qadamlarini nima kuchli qiladi?
3. (10) **Aniq tuzatish:** Natija chala bo'lsa — avval aniq kamchilikni topasiz. · O'sha joyga qoida qo'shasiz. · Keyin qayta sinaysiz. · Sinfga savol: Chala natija chiqsa, eng yaxshi qadam nima?
4. (14) **Aniq joyni tuzatish:** Skill biror narsani unutsa — qadamlarga aniq qoida qo'shasiz. · Qoidani misolda ham ko'rsatasiz. · Qolgani joyida qoladi. · Sinfga savol: Skill bir narsani unutyapti — eng aniq tuzatish qanday?
5. (15) **Skill yaratish jarayoni:** Avval vazifa tanlanadi va SKILL.md yoziladi. · Keyin sinab ko'riladi va kamchilik topiladi. · Tuzatib, qayta sinaladi. (Vazifa → Yozish → Sinov → Kamchilik → Tuzatish ↻) · Sinfga savol: Nega sinovdan oldin kamchilikni topib bo'lmaydi?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Skill'ning asosiy qismlari qaysi? Rang, o'lcham va narx · Server, baza va dizayn · ✔ name, description va body · Rasm, video va ovoz
2. description AI'ga nimani aytadi? ✔ Skill nima qiladi va qachon kerak · Skill faylining rangi va o'lchami · Xabarni kimga yuborish kerakligi · Necha ball berilishini
3. Qadamlarni kuchli qiladigan narsa? Iloji boricha uzun matn · Faqat sarlavha · «Yaxshi qil» degan umumiy gap · ✔ Aniq qadamlar va misol
4. Kontekst-injiniring nima? Skill'ni noldan qayta yozish · ✔ AI'ga to'g'ri ma'lumot va ko'rsatma berish · Skill'ni butunlay o'chirish · Kuchliroq model sotib olish
5. Natija kutilgandek chiqmasa, eng yaxshi qadam? ✔ Kamchilikni topib, o'sha joyni tuzatib sinash · Skill'dan butunlay voz kechish · Hammasini noldan qayta yozish · AI'ni ayblab, boshqa model izlash
6. Nega Skill'ni sinab ko'rish kerak? Chiroyliroq ko'rinishi uchun · Ballni oshirish uchun · Faylni o'chirish uchun · ✔ Ishlashini faqat sinab bilamiz
7. Yaxshi description qanday bo'ladi? Bitta so'zdan iborat · ✔ Nima qilishi va qachon kerakligini aytadi · Iloji boricha noaniq · Faqat emojidan iborat
8. Misol Skill uchun nega foydali? Faylni uzunroq qiladi · Faqat bezak uchun · ✔ Kutilgan natijani ko'rsatadi · Hech qanday ta'sir qilmaydi
9. Skill har safar narxni unutyapti. Eng aniq tuzatish? Butun Skill'ni o'chirish · description'ni uzaytirish · AI'ga ko'proq pul to'lash · ✔ Qadamlarga «narxni ko'rsat» qoidasini qo'shish
10. Skill yozishning to'g'ri sikli qaysi? Bir marta yoz, tekshirma · ✔ Yoz → sina → tuzat → qayta sina · Sina → o'chir → unut · Ko'chir → jo'nat → kut
11. Noaniq description nimaga olib keladi? Skill tezroq ishlaydi · Hech qanday ta'sir yo'q · ✔ Skill kerakli paytda ishlamasligi mumkin · Ball oshib ketadi
12. Yaxshi Skill qanday bo'ladi? ✔ Bitta vazifaga, aniq va sinalgan · Iloji boricha uzun va batafsil · Ko'p vazifani birga bajaradigan · Faqat nomdan iborat bo'lgan

---

## B. Rad etilgan / tuzatilgan taklif
- **«Qachon ishlaydi»ga faqat vaziyat, «g'amxo'r javob yozadi» esa body'ga** (ChatGPT, 2-band) — **texnik jihatdan noto'g'ri, rad.** Claude Skills qoidasi bo'yicha description'da Skill **nima qiladi va qachon ishlatiladi** — ikkalasi ham bo'lishi kerak; Claude aynan shunga qarab tanlaydi. To'g'ri ajratish boshqa: description'da **qisqa** «nima + qachon», body'da esa **batafsil qanday** (qadamlar). 3-ekran shunday yozildi.
- **Inglizcha nishon nomlari** — qoida bo'yicha qoladi.
