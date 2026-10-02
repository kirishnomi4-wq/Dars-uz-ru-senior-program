# 6-Modul (LMS: 8-Modul) · 7-dars «O'z Skill'ingizni yozing» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/WriteSkillLesson.jsx` · 20 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook:** o'quvchi shoshib «muloyim javob yoz» degan super-kuch kartasini yozgan. «Mashg'ulot maydonida sinash» tugmasini bosadi — natija muloyim, lekin foydasiz («Kechirasiz, biz buni ko'rib chiqamiz.»). Keyin 3 variantdan eng to'g'ri qadamni tanlaydi (voz kechish / aniqroq qoidalar bilan yaxshilash / AI aybdor).
- **Markaziy mexanika:** karta yig'uvchi (6-ekran) — 3 maydonni (nomi · qachon ishlaydi · qadamlar + misol) qo'shib, kartaning jonli to'lishini ko'radi; keyin sinov → xira natija → aniq tuzatish sikli (11, 12-ekran); oxirida SKILL.md maydon nomlarini to'ldiradi va karta tuzilmasini sudrab tartiblaydi.
- **Asosiy metafora:** Skill = «super-kuch kartasi» · sinov = «mashg'ulot maydoni» · yomon natija = «karta xira yondi» · tuzatish = «kontekst-injiniring».
- **Yakun:** o'z vazifangizga SKILL.md yozish amaliyoti → podium → 12 kartochka → xulosa + uyga vazifa (tanlang · yozing · sinang).

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — xira karta | hook | kartani sinaydi, eng to'g'ri qadamni tanlaydi | — |
| 1 | Reja | qoida | tayyor karta namunasi + bugungi 4 qadam | — |
| 2 | 3 maydon | tushuncha | tugma bosib 3 maydon ta'rifini ochadi | — |
| 3 | Qachon ishlaydi | tushuncha | noaniq vs aniq trigger solishtiradi | — |
| 4 | 1-savol | test | qaysi «qachon ishlaydi» yaxshiroq | ✅ |
| 5 | Qadamlar | tushuncha | noaniq vs aniq raqamlangan qadamlar + misol | — |
| 6 | Karta yig'uvchi | markaziy | 3 maydonni qo'shadi, karta jonli to'ladi | — |
| 7 | Mashg'ulot maydoni | tushuncha | haqiqiy shikoyat bilan kartani sinaydi | — |
| 8 | 2-savol | test | qadamlarni nima kuchli qiladi | ✅ |
| 9 | Kontekst-injiniring | tushuncha | 3 usulni ochadi (qoida · so'z · misol) | — |
| 10 | 3-savol | test | natija chala — eng yaxshi qadam | ✅ |
| 11 | Aniqlashtirish sikli | tushuncha | v1 → kamchilik → tuzatish → v2 bosqichlarini yuradi | — |
| 12 | Yoz → test → tuzat | case | 5 qadamli to'liq misolni ochadi | — |
| 13 | Karta kodda | amaliyot | SKILL.md dagi 3 bo'shliqni to'ldiradi | (nishon) |
| 14 | 4-savol | test | karta narxni unutyapti — eng aniq tuzatish | ✅ |
| 15 | Kartani yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · SKILL.md | praktika | o'z kartasini yozadi, bosqichlarni belgilaydi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + arena | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
super-kuch kartasi (Skill / SKILL.md) · nomi (name) · qachon ishlaydi (description, trigger) · qadamlar (body) · misol ·
mashg'ulot maydoni · karta yondi / xira yondi · kamchilik · aniq tuzatish · kontekst-injiniring · aniqlashtirish sikli · v1 / v2 · mijoz-javobi

---

## 0 · Kirish — xira karta  `[741]`
- Eyebrow: Dars · kirish
- Sarlavha: **Tez super-kuch kartasi yozdingiz: «muloyim javob yoz». Karta xira yondi. Nima qilasiz?**
- Mentor: O'tgan darsda tayyor kartani o'qidingiz. Bugun o'z super-kuch kartangizni **yozasiz**. Birinchi qoralama ko'pincha xira chiqadi. Tugmani bosing — kartani mashg'ulot maydonida sinang.
- Karta: 🎴 super-kuch kartasi (1-urinish)
  ```
  ---
  name: mijoz-javobi
  description: javob yozish
  ---
  Muloyim javob yoz.
  ```
- Tugma: ▶ Mashg'ulot maydonida sinash → ✓ Natijani ko'rdingiz
- Natija: ❌ Mashg'ulot maydoni — «Kechirasiz, biz buni ko'rib chiqamiz.» — muloyim, lekin foydasiz: aniq yechim yo'q. Karta adashdi.
- Savol: **Eng to'g'ri qadam?**
  - Karta yomon — undan voz kechaman
  - Karta juda noaniq edi — uni aniqroq qoidalar bilan yaxshilayman
  - AI aybdor — boshqa model kerak
- Javobdan keyin (har qanday tanlovda): Aynan! Karta yozish — bu **jarayon**: yoz → mashg'ulotda test → kamchilikni top → aniqlashtir → qayta test. Bugun o'z kartangizni shu yo'l bilan yozasiz (kontekst-injiniring).
- Tugma: Davom etish

## 1 · Reja  `[782]`
- Eyebrow: Reja
- Sarlavha: **O'z super-kuch kartangizni yozasiz.**
- Mentor: O'tgan darsda tayyor kartani o'qidingiz. Bugun — yozuvchi bo'lasiz: aniq nom, aniq «qachon ishlaydi», qadamlar, mashg'ulotda test va **kontekst-injiniring** bilan sayqallash.
- Yorliq: dars oxirida — siz shunday karta yozasiz
- Karta: 🎴 super-kuch kartasi (tayyor)
  ```
  ---
  name: mijoz-javobi
  description: Mijoz shikoyat qilganda…
  ---
  1. Uzr so'ra  2. Yechim  3. Muddat
  Misol: "Uzr! Bepul almashtiramiz 🙏"
  ```
- Bugungi 4 qadam:
  1. Aniq nom + «qachon ishlaydi» yozish · *trigger*
  2. Qadamlar + misol qo'shish · *qadamlar*
  3. Kartani mashg'ulot maydonida sinash · *test*
  4. Kontekst-injiniring bilan aniqlashtirish · *iteratsiya*
- Tugmalar (mobil): 4 qadamni ko'rish / ↩ Kartani ko'rish · Boshlaymiz →

## 2 · 3 maydon  `[819]`
- Eyebrow: Tushuncha · 3 maydon
- Sarlavha: **Har super-kuch kartasi — 3 maydon: nomi, qachon ishlaydi, qadamlar.**
- Mentor: O'tgan darsdan eslang: kartada description (qachon) va body (qanday) bor. Yaxshi karta yozish uchun uchta maydon aniq bo'lishi kerak. Tugmani bosing.
- Tugma: 3 maydonni ko'rsat → ✓ Ko'rdingiz
- Kartalar:
  - **nomi:** Kuch nima ekanini bildiradi — kartaning sarlavhasi.
  - **qachon ishlaydi:** AI'ga **qaysi vaziyatda** kuchni yoqishni aytadi (trigger).
  - **qadamlar:** AI bajaradigan aniq, raqamlangan ko'rsatmalar (+ bitta misol).
- Xulosa: Shu uchta maydon aniq bo'lsa — karta to'g'ri yonadi. Endi har birini qanday yozishni ko'ramiz.
- Pastki tugma: 3 maydonni ko'ring → Davom etish

## 3 · Qachon ishlaydi  `[850]`
- Eyebrow: Yozish · qachon ishlaydi
- Sarlavha: **`Qachon ishlaydi` — kuch qaysi paytda yonadi.**
- Mentor: Bu maydon AI'ga «qachon meni yoq» deydi (trigger). Noaniq bo'lsa → karta noto'g'ri vaqtda yonadi yoki umuman yonmaydi. Tugmani bosing.
- ❌ Noaniq: «javob yoz» → Qanaqa javob? Qaysi paytda? AI bilmaydi.
- Tugma: Aniq trigger-chi? → ✓ Ko'rdingiz
- ✅ Aniq: «Mijoz shikoyat qilganda yonadi — rasmiy va g'amxo'r javob yozadi.» → QACHON (shikoyat kelganda) + NIMA (g'amxo'r javob). AI kartani to'g'ri paytda yoqadi.
- Xulosa: Qoida: «qachon ishlaydi»da QAYSI PAYT va NIMA qilishi bo'lsin. Bu — kartaning eng muhim qatori.
- Pastki tugma: Farqni ko'ring → Davom etish

## 4 · 1-savol ✅  `[878]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Qaysi «qachon ishlaydi» maydoni yaxshiroq?**
  - «javob» — bitta so'z, yozish oson
  - «yaxshi narsa qil» — har vaziyatga mos
  - «matn yoz» — qisqa va tushunarli
  - ✔ «Shikoyat kelganda — g'amxo'r javob» — qachon + nima
- To'g'ri: To'g'ri! Yaxshi trigger QAYSI PAYTDA (shikoyat kelganda) va NIMA qilishini (g'amxo'r javob) aniq aytadi. Shunda AI kartani to'g'ri vaqtda yoqadi. Noaniq trigger — karta adashadi.
- Xato izohlari:
  - Bitta so'z yetarli emas — trigger qaysi paytda va nima ekanini aytishi kerak.
  - «yaxshi narsa qil» — AI qachon yoqishni va nimani aniqlay olmaydi.
  - «matn yoz» — juda noaniq. Qanaqa matn? Qaysi paytda? AI bilmaydi.
  - (umumiy) Yaxshi trigger — qachon + nima.

## 5 · Qadamlar  `[901]`
- Eyebrow: Yozish · qadamlar
- Sarlavha: **Qadamlar — aniq, raqamlangan + misol.**
- Mentor: Qadamlarda «yaxshi javob yoz» deb yozsangiz — AI taxmin qiladi. Aniq, raqamlangan qadamlar yozsangiz — aniq bajaradi. Tugmani bosing.
- ❌ Noaniq qadamlar: «Mijozga yaxshi javob yoz.»
- Tugma: Aniq qadamlar-chi? → ✓ Ko'rdingiz
- ✅ aniq qadamlar:
  ```
  1. Avval samimiy uzr so'ra.
  2. Aniq yechim taklif qil (almashtirish / qaytarish).
  3. Muddatni ayt (qachon hal bo'ladi).
  4. Iliq jumla bilan yakunla.
  Misol: Uzr so'raymiz! Buzuq mahsulotni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat 🙏
  ```
- Xulosa: Raqamlangan qadamlar + misol = AI taxmin qilmaydi, aniq bajaradi. Misol — eng kuchli qism.
- Pastki tugma: Aniq qadamlarni ko'ring → Davom etish

## 6 · Karta yig'uvchi (markaziy)  `[934]`
- Eyebrow: Quramiz · karta yig'uvchi
- Sarlavha: **O'z kartangizni yig'ing — jonli to'lib boradi.**
- Mentor: Endi amalda: har maydonni qo'shing va o'ng tomonda super-kuch kartangiz jonli to'lib borishini kuzating. Uchala maydonni ham qo'shing.
- Tugmalar (+ / ✓): nomi qo'shish · «qachon ishlaydi» qo'shish · qadamlar + misol qo'shish
- Yorliq: jonli super-kuch kartasi · 🎴 super-kuch kartasi
- Bo'sh joylar: (nomi hali yo'q) · (qachon ishlaydi hali yo'q) · (qadamlar hali yo'q)
- To'lgach: name: mijoz-javobi · description: Mijoz shikoyat qilganda yonadi — rasmiy va g'amxo'r javob yozadi. · 4 qadam + misol (5-ekrandagi bilan bir xil)
- Xulosa: Karta tayyor! 3 maydon: nomi, qachon ishlaydi (trigger), qadamlar + misol. Endi mashg'ulot maydonida sinab ko'ramiz.
- Pastki tugma: Kartani yig'ing (0/3) → Davom etish

## 7 · Mashg'ulot maydoni  `[970]`
- Eyebrow: Test · mashg'ulot maydoni
- Sarlavha: **Yozdingiz — endi mashg'ulot maydonida sinang.**
- Mentor: Karta yozish — taxmin. U rostan yonadimi? Buni faqat mashg'ulot maydonida sinab ko'rib bilasiz. Haqiqiy shikoyat berib, kartani sinaymiz. Tugmani bosing.
- 🥋 Sinov: shikoyat — «Telefonim buzuq keldi! Pulimni qaytaring!»
- Tugma: ▶ Karta bilan sinash → ✓ Sinaldi
- ⚡ Karta yondi: «Uzr so'raymiz! Buzuq telefonni bepul almashtiramiz yoki pulingizni qaytaramiz, 1 kun ichida. Sabringiz uchun rahmat 🙏»
- Izoh: Kartadagi qadamlarga to'liq amal qildi: uzr → yechim → muddat → iliq yakun.
- Xulosa: Yaxshi yondi! Lekin har doim shunday emas — keyingi ekranlarda xira yongan holatni va uni tuzatishni ko'ramiz.
- Pastki tugma: Kartani sinang → Davom etish

## 8 · 2-savol ✅  `[1001]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Karta qadamlarini kuchli qiladigan narsa?**
  - ✔ Aniq, raqamlangan qadamlar + misol
  - Iloji boricha uzun, batafsil matn
  - «Yaxshi qil» degan umumiy ko'rsatma
  - Faqat kartaning sarlavhasi
- To'g'ri: To'g'ri! Aniq raqamlangan qadamlar AI'ni adashtirmaydi, misol esa unga taqlid qiladigan namuna beradi. Aniqlik + misol = izchil natija.
- Xato izohlari:
  - Uzunlik emas — aniqlik muhim. Uzun, lekin noaniq qadamlar foydasiz.
  - «Yaxshi qil» — AI taxmin qiladi, natija har xil bo'ladi. Aniq qadamlar kerak.
  - Faqat sarlavha yetarli emas — AI'ga aniq qadamlar va misol kerak.
  - (umumiy) Aniq qadamlar + misol — kuchli qadamlar.

## 9 · Kontekst-injiniring  `[1024]`
- Eyebrow: Tushuncha · kontekst-injiniring
- Sarlavha: **Kontekst-injiniring — kartani aniq sozlash.**
- Mentor: Karta xira yonsa, hammasini qaytadan yozmaysiz. **Aniq nuqtani** tuzatasiz — bitta qoida qo'shasiz yoki so'zni o'tkirlashtirasiz. Bu — kontekst-injiniring. Tugmani bosing.
- 🔧 Kontekst-injiniring nima? — Kartani AI to'g'ri paytda to'g'ri ishlatadigan qilib aniq sozlash — kerakli natijaga yetguncha kichik, aniq o'zgartirishlar.
- Tugma: Qanday qilinadi? → ✓ Ko'rdingiz
- Kartalar:
  - ➕ **Qoida qo'shish:** «narxni ham ko'rsat» degan qatorni qo'shasiz.
  - ✏️ **So'zni o'tkirlash:** «qisqa» → «aniq 3 jumla».
  - ✨ **Misol qo'shish:** kerakli natijaga o'xshash namuna berish.
- Xulosa: Kichik, aniq tuzatish — katta natija. Endi buni amalda ko'ramiz.
- Pastki tugma: Nima ekanini ko'ring → Davom etish

## 10 · 3-savol ✅  `[1056]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Karta natijasi kerakli darajada emas. Eng yaxshi qadam?**
  - Kartadan butunlay voz kechaman
  - Hamma narsani noldan qayta yozib chiqaman
  - ✔ Kamchilikni topib, o'sha nuqtani tuzatib sinayman
  - AI aybdor — kuchliroq model izlab ko'raman
- To'g'ri: To'g'ri! Bu — kontekst-injiniring: aniq kamchilikni topib, kartada o'sha joyni tuzatasiz (qoida qo'shasiz yoki so'zni o'tkirlashtirasiz), keyin qayta sinaysiz. Kichik, aniq tuzatish — eng samarali yo'l.
- Xato izohlari:
  - Voz kechish shart emas — karta deyarli yonyapti, faqat aniq tuzatish kerak.
  - Noldan qayta yozish — keraksiz mehnat. Aniq nuqtani tuzatish yetadi.
  - Muammo modelda emas — kartada. Kartani aniqlashtiring.
  - (umumiy) Kamchilikni aniq tuzatib, qayta sinang.

## 11 · Aniqlashtirish sikli  `[1079]`
- Eyebrow: Animatsiya · aniqlashtirish sikli
- Sarlavha: **Xira natija → aniq tuzatish → karta yonadi.**
- Mentor: Mana aniqlashtirish sikli amalda: v1 xira yondi, kamchilikni topamiz, aniq qoida qo'shamiz, v2 to'g'ri yonadi. Tugmani bosib bosqichlarni kuzating.
- Bosqichlar (tugma: ▶ v1 ni sinash → Keyingi qadam → → ✓ Karta aniqlashdi):
  1. 🧪 Test (v1) — Karta: «muloyim javob yoz». Natija: «Kechirasiz, ko'rib chiqamiz.» — muloyim, lekin ANIQ yechim yo'q. Karta xira yondi. ❌
  2. 🔍 Kamchilik — Muammo: karta «aniq yechim taklif qil» demadi. Shuning uchun AI umumiy javob berdi.
  3. 🔧 Kontekst-injiniring — Qadamlarga aniq qoida qo'shamiz: «Aniq yechim taklif qil (almashtirish/qaytarish) + muddat.»
  4. ✅ Qayta test (v2) — Natija: «Uzr! Bepul almashtiramiz, 1 kun ichida 🙏» — endi aniq yechim va muddat bor. Karta to'g'ri yondi!
- O'ng karta: 🔁 ANIQLASHTIRISH SIKLI — Yoz → mashg'ulotda test → kamchilik → aniq tuzat → qayta test. Birinchi qoralama hech qachon mukammal emas — sikl uni yaxshilaydi.
- Xulosa: Bitta aniq qoida (yechim+muddat) qo'shildi — karta endi to'g'ri yonadi. Hammasini qayta yozmadingiz. Mana kontekst-injiniring kuchi.
- Pastki tugma: Siklni yuring (0/4) → Davom etish

## 12 · Yoz → test → tuzat (case)  `[1113]`
- Eyebrow: Hayotiy · karta yasash
- Sarlavha: **Boshidan oxirigacha: yoz → test → tuzat.**
- Mentor: Mana to'liq jarayon bitta misolda. Tugmani bosib, karta qanday yozilib, mashg'ulot maydonida sinab ko'rilib va aniqlanishini kuzating.
- Qadamlar (tugma: ▶ Kartani yozish → Keyingi qadam → → ✓ Karta tayyor):
  1. Yozdik: «mijoz-javobi» kartasi — uzr + yechim + muddat qadamlari bilan.
  2. Mashg'ulot: «Yetkazib berish kechikdi!» → «Uzr! Tezlashtiramiz.» — yechim bor, lekin MUDDAT yo'q.
  3. Kontekst-injiniring: «Aniq muddat ayt (masalan: bugun kechgacha)» qoidasini o'tkirlashtirdik.
  4. Qayta test: «Uzr! Bugun soat 18:00 gacha yetkazamiz, yo'l haqi bizdan 🙏» — endi muddat aniq!
  5. Karta tayyor — endi har shikoyatga izchil, to'liq javob bilan yonadi.
- 💡 Diqqat: Birinchi versiya yechim berdi, lekin muddatni unutdi. Bitta qoidani o'tkirlash bilan karta to'liq yondi — hammasini qayta yozmasdan.
- Xulosa: Mana karta yozish mahorati: birinchi qoralama → test → aniq tuzatish → tayyor. Endi o'z vazifangizga karta yoza olasiz.
- Pastki tugma: Jarayonni yuring (0/5) → Davom etish

## 13 · Karta kodda (amaliyot)  `[1161]`
- Eyebrow: Amaliyot · karta kodda
- Sarlavha: **Super-kuch kartasi kodda qanday yoziladi?**
- Mentor: Bu — `SKILL.md`: sizning kartangiz shu tarzda yoziladi. Uch maydon nomini to'g'ri chipdan tanlab to'ldiring.
- Kod (🎴 SKILL.md):
  ```
  ---
  ____: mijoz-javobi
  ____: Mijoz shikoyat qilganda…
  ---

  # ____
  1. Uzr so'ra  2. Yechim  3. Muddat
  ```
- Bo'shliqlar:
  1. 1-maydon (kuch nomi): id · ✔ name · color
  2. 2-maydon (qachon yonadi): ✔ description · password · date
  3. 3-maydon (nima qiladi): rasm · ovoz · ✔ qadamlar
- Xato izohlari:
  - «id» — texnik raqam, o'quvchiga ko'rinadigan nom emas.
  - «color» — kartaning rangi, kuch nomi emas.
  - «password» — maxfiy so'z, trigger emas.
  - «date» — sana, kuch qachon yonishini bildirmaydi.
  - Rasm karta ishini bajarmaydi — aniq qadamlar kerak.
  - Ovoz emas — AI aniq yozma qadamlarga amal qiladi.
  - (umumiy) Bu to'g'ri emas.
- Nishon yozuvi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- Muvaffaqiyat: Karta to'ldi! `name` = kuch nomi, `description` = qachon yonadi, `qadamlar` = nima qiladi.
- Pastki tugma: Maydonlarni to'ldiring → Davom etish

## 14 · 4-savol ✅  `[1221]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Natija deyarli to'g'ri, lekin har safar narxni unutyapti. Eng aniq tuzatish?**
  - Butun kartani o'chirib, boshidan yozaman
  - «qachon ishlaydi» maydonini uzaytiraman
  - AI'ga ko'proq pul to'lab, kuchaytiraman
  - ✔ Qadamlarga «narxni ko'rsat» qoidasini qo'shaman
- To'g'ri: To'g'ri! Aniq muammo (narx yo'q) → aniq tuzatish (narx qoidasini qo'shish + misolda narx ko'rsatish). Bu — kontekst-injiniring: kichik, nishonli o'zgartirish. Qolgan hammasi joyida turaveradi.
- Xato izohlari:
  - Butun kartani qayta yozish — keraksiz. Faqat narx qoidasi yetishmayapti, o'shani qo'shing.
  - «qachon ishlaydi» kuch qachon yonishini belgilaydi — narx muammosini qadamlar hal qiladi.
  - Pul masalasi emas — kartada narx qoidasi yo'q. O'shani qo'shing.
  - (umumiy) Qadamlarga aniq narx qoidasini qo'shing.

## 15 · Kartani yig'ing ✅ (final)  `[1244]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: super-kuch kartasi strukturasini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang. Diqqat: agar ✨ Misolni 📋 Qadamlardan oldin qo'ysangiz — oqibatini ko'rasiz.
- Bo'laklar: Nomi · Qachon ishlaydi · Qadamlar · Misol · Mashg'ulotda test
- Uyachalar: birinchi nima yoziladi · keyin nima keladi · keyin nima keladi · keyin nima keladi · eng oxiri nima qilinadi · «bu yerga joylang»
- Misol qadamlardan oldin bo'lsa: 😕 Misol qadamlardan oldin turibdi! — Misol — qadamlarga namuna. Qadamlarsiz misol turmaydi: avval qadamlar, keyin misol.
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang.
- To'g'ri: To'g'ri: Nomi → Qachon ishlaydi → Qadamlar → Misol → Mashg'ulotda test. · ✓ Karta tayyor: **Nomi → Qachon ishlaydi → Qadamlar → Misol → Mashg'ulotda test** → va aniqlashtirish ↻.
- Havola (xato bo'lgan bo'lsa): 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Pastki tugma: Kartani yig'ing → Davom etish

## 16 · Amaliyot · SKILL.md  `[2097]`
- Eyebrow: Amaliyot · SKILL.md · joy: «kompyuteringizda»
- Sarlavha: **O'z super-kuch kartangizni yozing**
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'zingiz tez-tez AI'ga beradigan bitta vazifani tanlang va unga super-kuch kartasini (SKILL.md) yozing: aniq nom + «qachon ishlaydi» + qadamlar + misol. Keyin mashg'ulot maydonida sinab, kamchilikni tuzating.
- Bosqichlar — belgilab boring:
  1. O'zingiz tez-tez beradigan bitta vazifani tanlang (masalan: «mijoz-javobi»)
  2. `name:` — kuchga aniq nom bering
  3. `description:` — «qachon ishlaydi»ni yozing: qaysi paytda + nima qiladi
  4. Qadamlarni raqamlab yozing va bitta tayyor `misol` qo'shing
  5. Kartani real vaziyatda sinang; xira yonsa — aniq qoida qo'shib qayta sinang
- Tugmalar: Avval bajaring · ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.»

## 17 · Natijalar (podium)  `[1843]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2125]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Super-kuch kartasining uchta maydoni qaysi? | Nomi, qachon ishlaydi, qadamlar | Uchtasi ham bo'lsa, karta to'liq |
| Karta qaysi vaziyatda yonishini qaysi maydon aytadi? | «Qachon ishlaydi» | Uni trigger deb ham atashadi |
| Kodda «qachon ishlaydi» maydoni qanday yoziladi? | description | Masalan: «Mijoz shikoyat qilganda…» |
| Kodda kuch nomi qaysi so'z bilan yoziladi? | name | Masalan: name: mijoz-javobi |
| Qadamlarni qanday yozish kerak? | Aniq va raqamlab | Shunda AI taxmin qilmaydi, aynan bajaradi |
| Qadamlardan keyin kartaga yana nima qo'shiladi? | Bitta tayyor misol | Misol — kartaning eng kuchli qismi |
| Nega bitta misol shunchalik kuchli? | AI unga taqlid qiladi | Namunani ko'rgan AI aniqroq yozadi |
| Kartani yozib bo'lgach nima qilasiz? | Mashg'ulot maydonida sinaysiz | Karta rostan yonishini faqat sinov ko'rsatadi |
| Kontekst-injiniring nima? | Kartani aniq sozlash | Hammasini emas, faqat kerakli joyni tuzatasiz |
| Karta har safar narxni unutsa, nima qilasiz? | Qadamlarga aniq qoida qo'shasiz | Masalan: «narxni ko'rsat» |
| Karta yozishning to'g'ri sikli qanday? | Yoz, sina, tuzat, qayta sina | Bir marta yozib qo'yish yetmaydi |
| Bitta kartaga nechta vazifa yuklanadi? | Bitta aniq vazifa | «Hamma narsani qiladigan» karta xira yonadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2138]`
- Eyebrow: Tayyor
- Belgi: ✓ Super-kuch kartasini yozishni o'rgandingiz
- Sarlavha: **Endi AI'ga o'z kartangizni yozasiz.**
- Endi siz bilasiz:
  - Karta yozish — jarayon: yoz → test → tuzat → qayta test
  - «qachon ishlaydi» (trigger) — qaysi paytda + nima; AI kartani to'g'ri paytda yoqadi
  - Qadamlar — aniq, raqamlangan + bitta misol (misol eng kuchli qism)
  - Kontekst-injiniring: xira natijani aniq, nishonli tuzatish bilan to'g'rilash
  - Zo'r karta: aniq, misolli, bitta vazifaga, mashg'ulot maydonida sinalgan
- Uyga vazifa:
  - **Tanlang** — o'zingiz tez-tez AI'ga beradigan bitta vazifani tanlang
  - **Yozing** — unga super-kuch kartasini (SKILL.md) yozing: aniq nom + «qachon ishlaydi» + qadamlar + misol
  - **Sinang** — mashg'ulot maydonida sinang; xira yonsa, aniq qoida qo'shib qayta sinang
- Uyga vazifa · Amaliy topshiriqni bajarish → · 📝 Uyga vazifa
- 🚀 Keyingi dars — kartalar to'plamini birga ishlatamiz: bir nechta super-kuch kartasini bitta loyihada boshqaramiz!
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** ⚡ Clear Trigger — «Qachon ishlaydi» maydonini tanladingiz · 🎴 Card Writer — Kuchli qadamlar qoidasini 1-urinishda topdingiz · 🗂️ Field Master — Karta maydonlarini kodda xatosiz to'ldirdingiz · 🧪 Tested Skill — Karta strukturasini to'g'ri yig'dingiz
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.

**Qisqa takrorlash oynalari (5):**
1. Trigger — karta qachon yonadi: Karta uchta maydon (Har super-kuch kartasida nomi · qachon ishlaydi · qadamlar bo'ladi.) · Qachon ishlaydi = trigger («Qachon ishlaydi» maydoni AI'ga qaysi vaziyatda kuchni yoqishni aytadi.) · Aniq trigger — aniq yonish (Trigger aniq bo'lsa, karta to'g'ri paytda yonadi; noaniq bo'lsa — adashadi.) — savol: Nega «qachon ishlaydi» maydoni aniq bo'lishi kerak?
2. Qadamlar — misol eng kuchli: Aniq, raqamlangan qadamlar (Qadamlar aniq bo'lsa, AI taxmin qilmaydi — aynan bajaradi.) · Bitta misol — namuna (Bitta tayyor misol — AI uchun eng kuchli yo'riqnoma, u shunga taqlid qiladi.) · Noaniq body — foydasiz («Yaxshi qil» degan umumiy gap har xil natija beradi.) — savol: Karta qadamlarini nima kuchli qiladi?
3. Kontekst-injiniring — aniq tuzatish: Kamchilikni aniqla (Natija chala chiqsa, avval aniq nuqtani topasiz.) · Bitta qoida qo'sh (Hammasini qayta yozmaysiz — o'sha joyga aniq qoida qo'shasiz.) · Qayta test (Kichik tuzatishdan keyin kartani yana sinaysiz.) — savol: Chala natija chiqsa eng yaxshi qadam nima?
4. Aniqlik — noaniqlikni yopadi: Aniq nuqtaga qoida (Karta biror narsani unutsa — o'sha maydonga aniq qoida qo'shasiz.) · Misolda ham ko'rsat (Qoidani misolda ham ko'rsatsangiz, AI aniq taqlid qiladi.) · Qolgani joyida qoladi (Faqat kerakli maydonni tuzatasiz — boshqasi o'zgarmaydi.) — savol: Karta bir narsani unutyapti — eng aniq tuzatish qanday?
5. Karta strukturasi — tartib muhim: Avval — nomi (Karta nomi bilan boshlanadi — bu kuch nimaligini bildiradi.) · Keyin — qachon + qadamlar (So'ng qachon ishlaydi (trigger), keyin qadamlar keladi.) · Eng oxiri — misol (Misol qadamlardan keyin — namuna sifatida yakunlaydi.) · (Nomi → Qachon → Qadamlar → Misol → Test) — savol: Nega karta maydonlari tartibi muhim?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Super-kuch kartasining uch maydoni qaysi? Rang, o'lcham va narx · Server, ma'lumotlar bazasi, dizayn · ✔ Nomi, qachon ishlaydi, qadamlar · Rasm, video va ovoz
2. «Qachon ishlaydi» maydoni AI'ga nimani aytadi? ✔ Kuch qaysi vaziyatda yonishini · Kartaning rangi va o'lchamini · Xabarni kimga yuborishni · Necha ball berilishini
3. Karta qadamlarini eng kuchli qiladigan narsa? Iloji boricha uzun matn · Faqat sarlavha · «Yaxshi qil» degan umumiy gap · ✔ Aniq raqamlangan qadamlar + bitta misol
4. Kontekst-injiniring nima? Kartani noldan butunlay qayta yozish · ✔ Kartani AI to'g'ri ishlatadigan qilib sozlash · Kartani butunlay o'chirib tashlash · Kuchliroq model sotib olib almashtirish
5. Karta xira yonsa, eng yaxshi qadam? ✔ Kamchilikni topib, o'sha nuqtani tuzatib sinash · Kartadan butunlay voz kechib qo'yish · Hamma narsani noldan qayta yozib chiqish · AI'ni ayblab, boshqa model izlab ko'rish
6. Nega kartani mashg'ulot maydonida sinash kerak? Kartani chiroyliroq ko'rsatish uchun · Ballni oshirish uchun · Kartani o'chirish uchun · ✔ U rostan yonishini faqat sinab bilamiz
7. Yaxshi «qachon ishlaydi» maydoni qanday bo'ladi? Bitta so'zdan iborat bo'ladi · ✔ Qaysi paytda va nima qilishini aytadi · Iloji boricha noaniq bo'ladi · Faqat emojidan iborat
8. Bitta tayyor misol karta uchun nega muhim? Kartani uzunroq qiladi · Faqat chiroy va bezak uchun · ✔ AI taqlid qiladigan namuna beradi · Hech qanday ta'sir qilmaydi
9. Karta har safar narxni unutyapti. Eng aniq tuzatish? Butun kartani o'chirib tashlash · «qachon ishlaydi» maydonini uzaytirish · AI'ga ko'proq pul to'lab berish · ✔ «narxni ko'rsat» qoidasini qadamlarga qo'shish
10. Karta yozishning to'g'ri sikli qaysi? Faqat bir marta yoz, tekshirma · ✔ Yoz → test → aniq tuzat → qayta test · Test → o'chir → unut · Ko'chir → jo'nat → kut
11. Noaniq «qachon ishlaydi» maydoni nimaga olib keladi? Karta tezroq yonib ketadi · Hech qanday ta'sir ko'rsatmaydi · ✔ Noto'g'ri paytda yonadi yoki adashadi · Karta ballini oshirib beradi
12. Zo'r super-kuch kartasi qanday bo'ladi? ✔ Aniq, misolli, bitta vazifaga, sinalgan · Iloji boricha uzun · Ko'p vazifani birga bajaradigan · Faqat nomdan iborat

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«chip»** — 13-ekran Mentor («to'g'ri chipdan tanlab») · lug'atda taqiqlangan so'z.
- **Bir maydonning uch-to'rt nomi:** «qachon ishlaydi» = description = trigger = «qachon yonadi»; «qadamlar» = body (2-ekran Mentor, takrorlash 2 «Noaniq body») · «body» izohsiz, darsda boshqa joyda yo'q.
- **13-ekran SKILL.md:** `name` / `description` inglizcha, uchinchisi esa `# qadamlar` — o'zbekcha; o'quvchi «haqiqiy faylda ham qadamlar deb yoziladimi?» deb o'ylaydi. Xato variantlar (id/color · password/date · rasm/ovoz) juda uzoq — javob o'z-o'zidan ko'rinib turibdi.
- **Test «sotilib» qolgan:** 4-savol — to'g'ri javob eng uzuni va «— qachon + nima» deb sarlavhadagi so'zni aynan takrorlaydi; 8-savol «+ misol» (5-ekran sarlavhasi bilan bir xil); 0-ekran hook — to'g'ri variant yaqqol uzun. 14-savol to'g'ri javobi viktorina 9 va kartochka 10 bilan so'zma-so'z bir xil.
- **Inglizcha/texnik so'z izohsiz:** «iteratsiya» (1-ekran yorlig'i), «v1 / v2» (11-ekran), nishon nomlari inglizcha (Clear Trigger · Card Writer · Field Master · Tested Skill).
- **11-ekran eyebrow «Animatsiya · aniqlashtirish sikli»** — «Animatsiya» ichki ish-yorlig'iga o'xshaydi, o'quvchiga ma'nosiz.
- **«Kontekst-injiniring»** 0 va 1-ekranda ishlatiladi, ta'rifi faqat 9-ekranda; «nishonli o'zgartirish/tuzatish» (14-savol, yakun) — «nishon» (badge) so'zi bilan chalkashadi; «o'tkirlash» / «o'tkirlashtirish» ikki shaklda.
- **Dars nomi «Skill»** faqat sarlavhada — dars ichida «Skill = super-kuch kartasi» degan bog'lanish aytilmaydi (faqat 13, 16-ekranda SKILL.md). 7-ekran Mentor «Karta yozish — taxmin.» jumlasi tushunarsiz.
