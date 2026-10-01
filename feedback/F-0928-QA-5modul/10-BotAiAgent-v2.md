# 5-Modul (LMS: 7-Modul) · 10-dars «AI-agent yaratish» — YANGI MATN (v2-qoralama)

Fayl: `src/5-Modull/BotAiAgentLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `10-BotAiAgent-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
01.10: **22-savol A** qo'llandi (16-ekran, yakun). ⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s4:2 · s8:0 · s10:3 · s14:1 · s15` tartib; arena `correct`: 1·3·0·2·1·0·3·1·2·3·0·2) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (U1–U3, A8 — to'g'ri javob izohi bitta gap) · 29.09 v2-qoralama · **30.09: ChatGPT matn auditi (F-0930-105) filtrlandi** — hukmlar `JURNAL.md` · qaror sahifasi javoblari: 4-savol A (5, 7-ekran aralash), 8-savol A (final), 13-savol A (tartib qoladi), 19-savol A (6-dars nomi — system prompt).

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Quyida faqat shu darsga xos qo'shimchalar.

**A10. Shu darsning atamalari** (A1 bilan bir qoida: asosiy nom — haqiqiy atama, o'xshatish ko'pi bilan bir marta)

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| Vositalar · tools · tool-call · 🧰 asbob sumkasi · sumka | **asbob (tool)** · asboblar | «agent chaqira oladigan funksiya» — 1-ekran rejasida, 6-ekranda to'liq. 6-Modul 4-darsi bilan bir xil ta'rif |
| og'iz · «og'iz + sumka» | olinadi: AI-bot «javob matnini yozadi», AI-agent «asbob chaqirib, ishni bajaradi» | — |
| agentning qo'li | olinadi (30.09: o'xshatishsiz ham tushunarli — «AI matn yozadi, ishni asbob bajaradi») | — |
| reaktiv · proaktiv | olinadi (izohsiz edi) | — |
| direktor (siz) | olinadi: «agentni siz sozlaysiz» | — |
| avtonom · avtonomlik · mustaqillik | «keyingi qadamni o'zi tanlaydi — siz bergan asboblar va chegara ichida» | — |
| guardrail · guardrails | **chegara** | 13-ekranda: «chegara (inglizcha guardrail) — agent nimani qila olishini va nimani so'ramasdan qilmasligini belgilaydi» |
| human-in-loop | **odam nazorati** | 13-ekranda: «inglizcha nomi — human-in-the-loop» (to'g'ri yozilishi) |
| loop · aylanadi · aylanma | **sikl** · «takrorlanadi» | — |
| daftar · doimiy daftar · daftardagi holat | **baza** (4-darsdagi PostgreSQL) · **holat** | — |
| Rule-bot | **handlerli bot** (1-dars atamasi) | — |
| yo'riqnoma (6-dars boti) · agent yo'riqnomasi | **system prompt** (6-dars v2 nomi, 19-savol A) · o'quvchi yozadigan maqsad + asboblar + chegara — **agent kartasi** (5-ekran; 16-ekranda uning qismlari System instructions va Function calling ga tushadi) | — |
| ruxsat · odam ruxsati · «Ruxsat kerak» | **tasdiq** · odam tasdig'i · «Tasdiq kerak» (9, 13, 14-ekran bilan bir so'z) | — |
| to'lov · pul (xavfli amal nomi) | **pul yechish** (`chargeCard()` nima qilsa, shunday) | — |
| admin · administrator | **admin** | — |
| tashqi xizmat (arena foni, podium) | olinadi — darsda o'tilmaydi | — |
| QOIDA: (5-ekran kartasi) | **CHEGARA:** (qator nomi bilan bir xil) | — |
| A-model (qaysi do'kon ekani noma'lum) | **AvtoPizza**: «2 ta Pepperoni, Chilonzor 5-kvartal» (1-dars 12-ekrandagi taom va manzil) | — |

**A11. Agent ishining bitta tartibi** (hozir 3, 4 va 5 qadam aralash edi). Darsning hamma joyida shu:

> Maqsad olinadi → **Idrok → Qaror → Amal** → maqsadga yetdimi? Yetmagan bo'lsa — yana Idrok.

- **Sikl — uch qadam, nomlari O'ZGARMAYDI** (6-Modul 4-darsi aynan shularni oladi):
  **Idrok** — vaziyatni ko'radi (xabar, bazadagi ma'lumot, oldingi Amal natijasi) · **Qaror** — keyingi qadamni, ya'ni qaysi asbobni chaqirishni tanlaydi · **Amal** — asbobni chaqiradi.
- **Maqsad** — sikl qadami emas, sikldan oldin beriladi. **«Natijani ko'rish»** — alohida qadam emas, u keyingi Idrok. **«Maqsadga yetdimi?»** — har Amaldan keyingi tekshiruv, sikl shu bilan to'xtaydi yoki davom etadi.
- Final (15-ekran) 5 bo'lagi — shu tartibning to'liq ko'rinishi: Maqsad olinadi + 3 qadam + tekshiruv. Kartochka, arena, recap, yakun — shu nomlar bilan.

**A12. «Amal» — istisno.** A1 dagi «amal → javob» botning javob xabari uchun. Bu darsda **Amal** — agent siklining qadami (asbob chaqirish); «xavfli amal» — xavfli asbobni chaqiradigan Amal. Botning mijozga yozgan xabari — **javob**.

**A13. «Sikl» ikki joyda.** 1-darsda — botning ish sikli (kutadi → hodisa → handler → javob), bu darsda — **agent sikli**. Chalkashmasligi uchun bu darsda doim «agent sikli» yoki «sikl» faqat Idrok → Qaror → Amal ma'nosida. Fe'li — «takrorlanadi» («aylanadi» emas).

**A14. Agentning asboblari — butun darsda bitta to'plam (30.09).** `checkOrder()` · `saveOrder()` · `arrangeDelivery()` · `chargeCard()` · `cancelOrder()`. 5-ekranda tanlanadi, 6-ekranda ochiladi; 7, 9, 11, 12-ekran va amaliyot namunasi faqat shulardan oladi. Oldin 6-ekranda 4 ta asbob bor edi, 9-ekranda `chargeCard()`, 11-ekranda `cancelOrder()` birdan paydo bo'lardi; 5-ekran chegarasi esa agentda yo'q asboblar (to'lov, bekor qilish) haqida edi. `notifyUser()` olinadi — mijozga javobni bot o'zi yozadi.

**A15. AI-bot va AI-agent farqi — «kim tanlaydi».** Asosiy farq: agentda keyingi qadamni AI o'zi tanlaydi (maqsad sari, siz bergan asboblar va chegara ichida). «Bot gapiradi, agent qiladi» deyilmaydi — 4-darsdagi oddiy bot ham bazaga yozadi. 2-ekran xulosasi, 1 va 6-viktorina, 1 va 8-kartochka, yakun — shu gap bilan.

---

## Darsning ipi
- **Olam (bitta):** AvtoPizza boti (1, 3, 9-darslardagi bot). Bugun unga agent qo'shiladi.
- **Hook:** bir xil buyurtmaga ikki bot «qabul qilindi» deb yozadi. AI-botda buyurtma bazaga tushmaydi, AI-agent `saveOrder()` va `arrangeDelivery()` ni chaqiradi.
- **Asosiy model (dars bo'yi bitta):** A11 — Maqsad olinadi → Idrok → Qaror → Amal → maqsadga yetdimi? Agentga siz beradigan uch narsa: maqsad, asboblar, chegara.
- **Oldingi bilimga ko'prik:** 6-dars — botga AI ulangan, u system prompt bo'yicha javob yozadi (bugun uni «AI-bot» deymiz) · 4-dars — baza (PostgreSQL), `saveOrder()` shunga yozadi · 1-dars — handler va skript (4-savol variantlari) · 9-dars — botni o'zingiz yaxshilagansiz, bugun keyingi qadamni bot o'zi tanlaydi.
- **Tajribalar:** ikki botni solishtirish (0) · siklni qadam-baqadam yuritish (3) · agentni yig'ish (5) · vaziyatga asbob tanlash (7) · pul yechishdan oldin tasdiq (9) · amallarni belgilash (11) · agentni ishda kuzatish (12) · final (15) · aistudio.google.com'da haqiqiy asbob chaqiruvi (16).
- **Keyingi dars (App.jsx m5-14, 11-dars):** PM — «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — ikki bot | hook | ikki botni solishtiradi, AI-botda nima yetishmasligini tanlaydi | — |
| 1 | Reja | qoida | agent chizmasi + 4 qadam | — |
| 2 | AI-bot va AI-agent | tushuncha | 3 jihatni bosib ko'radi | — |
| 3 | Agent sikli | tushuncha | siklni 6 qadamda yuritadi (bitta buyurtma — sikl 2 marta) | — |
| 4 | 1-savol | test | bu qanday bot | ✅ |
| 5 | Agentni qurish | markaziy | maqsad → asboblar → chegara qatorlarini navbat bilan tanlaydi | — (nishon) |
| 6 | Asbob nima | tushuncha | 5 asbobni ochadi | — |
| 7 | To'g'ri asbob | markaziy | 3 vaziyatga mos asbobni tanlaydi | — (nishon) |
| 8 | 2-savol | test | agent ishni qanday bajaradi | ✅ |
| 9 | Pul yechishdan oldin | hayotiy | tasdiqsizmi yoki tasdiq bilanmi | — (nishon) |
| 10 | 3-savol | test | Amaldan keyin agent nima qiladi | ✅ |
| 11 | Amal xavfsizligi | markaziy | 3 amalni «O'zi» / «Tasdiq kerak» deb belgilaydi | — (nishon) |
| 12 | Agent ishda | hayotiy | agentning 8 qadamini kuzatadi | — |
| 13 | Chegaralar | tushuncha | 3 chegarani ochadi | — |
| 14 | 4-savol | test | pul yechishdan oldin nima muhim | ✅ |
| 15 | Tartibni yig'ing | yakuniy | 5 bo'lakni tartiblaydi | ✅ (final) |
| 16 | Amaliyot · AI-agent | praktika | aistudio.google.com'da 2 asbobni e'lon qiladi, model chaqirgan asbobga natijani o'zi qaytaradi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — ikki bot  `[799]`
- Eyebrow: Kirish
- Sarlavha: **AvtoPizza'ning ikki botiga bir xil buyurtma keldi. Qaysi biri uni haqiqatan qabul qiladi?**
- Mentor: 6-darsda botingizga AI ulagansiz: u system prompt bo'yicha javob yozadi. Bunday botni bugun AI-bot deb ataymiz. Tugmani bosing va ikki botni solishtiring.
- Chat 1 — **AvtoPizza · AI-bot** · holat: bot
  - mijoz: «2 ta Pepperoni, Chilonzor 5-kvartal. Buyurtmani rasmiylashtiring» → (bosilgach) bot: «Albatta! Buyurtmangiz qabul qilindi.»
  - Baza: yangi buyurtma yo'q
- Chat 2 — **AvtoPizza · AI-agent** · holat: agent
  - mijoz: (xuddi shu xabar) → (bosilgach) bot: «Buyurtmangiz qabul qilindi: 2 ta Pepperoni. Taxminan 30 daqiqada yetkazamiz.»
  - Baza: `saveOrder()` → yangi buyurtma: 2 ta Pepperoni, Chilonzor 5-kvartal · `arrangeDelivery()` → kuryer belgilandi
- Tugma: ▶ Ikki botni solishtirish → ✓ Solishtirildi
- Savol: **AI-botda nima yetishmaydi?**
  - Kodida xato bor — bot buzilgan
  - Bazaga yozadigan funksiyani chaqira olmaydi
  - Internet sekin ishlab, xabar kechikdi
- Javob — 2-variant: **Aynan!** «Qabul qilindi» deb yozish bilan buyurtma bazaga tushmaydi — AI-agent buning uchun `saveOrder()` ni chaqirdi.
- Javob — 1-variant: **Qiziq fikr!** Lekin ikkala bot ham ishladi — farq «Baza» qatorida.
- Javob — 3-variant: **Qiziq fikr!** Lekin ikkala javob ham vaqtida keldi — farq «Baza» qatorida.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, ikki chat (faqat mijoz xabari) va tugma. Savol va variantlar hali yo'q (hozir xira bo'lib turadi — **KOD**).
Tugma bosilgach: ikki chatda «yozmoqda…» (~0.8 s) → ikki javob → har chat ostida «Baza» qatori → shundan keyin savol va 3 variant → tanlangach javob izohi.
Animatsiya: HA — AI-agent chatida `saveOrder()` dan «Baza» qatoriga strelka chiziladi va yangi buyurtma paydo bo'ladi; AI-bot tomonida strelka yo'q (funksiya chaqirilmadi — bog'lanish ham yo'q).
Olib tashlanadi: «📓 Daftar: hech narsa yozilmadi — faqat matn chiqdi» ramkasi (o'rniga har chat ostidagi «Baza» qatori) · chat holatidagi «reaktiv / proaktiv» · avatar emojisi 💬 🧰 · bot javobidagi ✅ 📦.

✎ 🔴 FAKT: Mentor «O'tgan darsni eslang: AI-bot…» → o'tgan dars 9-dars «Fikr va iteratsiya»; AI ulangan bot 6-darsda («Bot ichida AI») · 🔴 sarlavha «AI-bot "buyurtmani yubordim" dedi», chatda esa «rasmiylashtirdim» — ikki xil gap edi → ikkala bot bir xil «qabul qilindi» deydi, farq faqat bazada (hook kuchliroq: matn bir xil, natija har xil) · agent javobidagi `saveOrder() ✅ …` mijoz chatidan «Baza» qatoriga ko'chdi (mijoz funksiya nomini ko'rmaydi) · to'g'ri variant endi eng uzuni emas, «maqsad va 🧰 sumka» olindi (atama hali o'tilmagan edi) · javob tanlovga qarab ikki xil (**KOD:** hozir hammasiga «Aynan! AI-bot — og'iz…») · «og'iz + sumka» olindi (A10) · «daftar» → «baza» · Botjon yo'q · «A-model» → AvtoPizza
✎ 30.09 ChatGPT #7: xato javob izohi har variantga alohida, bitta qisqa gap (A8) · #35: «O'tgan darsni eslang» — 29.09 da 6-darsga bog'langan · #6: holat o'zgarishi «Baza» qatorida ko'rinadi (29.09) · «yo'riqnoma» → «system prompt» (6-dars v2 nomi, A2)

## 1 · Reja  `[845]`
- Eyebrow: Reja
- Sarlavha: **Bugun: AI-agent — maqsad oladi, asbob tanlaydi va ishni bajaradi.**
- Mentor: O'tgan darsda botni mijozlar fikriga qarab o'zingiz yaxshiladingiz. Bugun botga maqsad berasiz: keyingi qadamni u o'zi tanlaydi — lekin faqat siz bergan asboblar va chegara ichida.
- Chizma: Siz berasiz: **Maqsad · Asboblar · Chegara** → Agent: **Idrok → Qaror → Amal** ↻ (maqsadga yetguncha)
- Bugungi 4 qadam:
  1. AI-bot va AI-agent — farqi nimada
  2. Agent sikli: Idrok → Qaror → Amal
  3. Asbob (tool) — agent chaqira oladigan funksiya
  4. Maqsad, asboblar va chegara bilan agent qurish
- Tugmalar: 4 qadamni ko'rish / ↩ Chizmani ko'rish (telefonda) · Boshlaymiz →

**Ko'rinish:** sarlavha + Mentor → chizma → shundan keyin 4 qadam birma-bir chiqadi.
Animatsiya: yo'q (sikl 3-ekranda chiziladi; bu yerda chizma statik).
Olib tashlanadi: «dars oxirida — o'zi ish bajaradigan agent» chati va uning ostidagi «Siz bitta maqsad berdingiz — agent o'zi qadamlarni topib, hammasini bajardi…» kartasi (0-ekrandagi agent chatini takrorlardi; karta Mentor bilan bir ma'no) ·
«Jihozlar paneli» (qaror F-0929-63, 1-dars B-1) · Mentordagi «Bu — modulning cho'qqisi» (ortiqcha da'vo: modulda yana 2 dars bor) va «Yangi jihoz yondi: 🧰 Vositalar».

✎ Sarlavha va Mentordagi «Botjon» olindi · «uning yelkasiga 🧰 asbob sumkasi ilinadi» → olindi (A10) · Mentor sarlavhani takrorlamaydi — 9-darsga ko'prik («siz yaxshiladingiz → bugun bot o'zi tanlaydi») va chegara · 2-qadam «(loop)» olindi · 3-qadam «🧰 Asboblar (tools) — agentning qo'li» → ta'rif bilan · 🔴 panelda «Vositalar — yangi» degan edi, holbuki u 5 va 7-darsda yongan (panel butunlay olinadi) · 🟢 olindi · 30.09: qadam yorliqlari (*farq*, *sikl*…) olindi (U1)

## 2 · AI-bot va AI-agent  `[885]`
- Eyebrow: Tushuncha · farq
- Sarlavha: **AI-bot va AI-agent: farq qayerda?**
- Mentor: Ikkalasining ichida bir xil AI bo'lishi mumkin. Farq — AI'ga nima berilganida va u nima qila olishida. Har jihatni bosing.
- Jihatlar (bosilganda ikki karta: **AI-bot** · **AI-agent**):
  - **Necha qadam?** — bitta: xabar → javob · bir nechta: maqsadga yetguncha sikl
  - **Nima bilan ishlaydi?** — faqat matn bilan · asboblar bilan: siz yozgan funksiyalar (`saveOrder()` kabi)
  - **Siz nima berasiz?** — system prompt: qanday javob yozsin · maqsad, asboblar va chegara
- Xulosa (3/3 dan keyin): Qisqasi: AI-botda AI javob matnini yozadi. AI-agentda AI keyingi qadamni tanlaydi, ishni esa siz yozgan asbob bajaradi.
- Tugma: 3 farqni ko'ring (N/3) → Davom etish

**Ko'rinish:** 3 tugma; bosilgani bitta joyda ikki karta bo'lib ochiladi (bir vaqtda bitta jihat). Xulosa 3/3 dan keyin (**KOD:** hozir 4 jihat).
Animatsiya: yo'q.
Olib tashlanadi: karta sarlavhalaridagi 💬 🧰 · Mentordagi «AI-bot javob yozadi va to'xtaydi. AI-agent … amal qiladi» (xulosa bilan bir ma'no edi; xulosa endi yangi gap aytadi — kim tanlaydi, kim bajaradi).

✎ 🔴 FAKT: «Siz nima berasiz? — har javob uchun ko'rsatma» → noto'g'ri: 6-darsda yo'riqnoma bir marta yoziladi, har javobga emas · 🔴 «AI-bot gapiradi, AI-agent qiladi» mazmunan qisman xato: 4-darsdagi oddiy bot ham bazaga yozadi. Farq — qadamni AI tanlaydimi (6-Modul 4-dars v2 ham shunday: «agentning asosiy belgisi — maqsad sari bir necha qadamni o'zi tanlashi») · «reaktiv / proaktiv», «og'iz», «sumka» olindi · «Nimasi bor?» → «Nima bilan ishlaydi?» · «Bu darsning asosi shu» olindi
✎ 30.09: «Qanday ishlaydi?» jihati olindi — «Necha qadam?» bilan bir ma'no edi (A2; ChatGPT ham «3 farq» taklif qilgan) · ChatGPT #2 «bot gapiradi, agent qiladi» — 29.09 da tuzatilgan (A15), endi yakun, viktorina va kartochkada ham · «yo'riqnoma» → «system prompt»

## 3 · Agent sikli  `[921]`
- Eyebrow: Tushuncha · sikl
- Sarlavha: **Agent sikli: Idrok → Qaror → Amal.**
- Mentor: Agent bitta amal bilan to'xtamaydi: har Amaldan keyin natijani ko'radi va keyingi qadamni tanlaydi. Tugmani bosing va bitta buyurtma uchun sikl necha marta takrorlanishini kuzating.
- Maqsad (yuqorida, bir qator): Buyurtmani qabul qilish
- Oqim: Idrok → Qaror → Amal ↻
- Tugma: ▶ Siklni boshlash → Keyingi qadam → … → ✓ Maqsadga yetdi
- Qadamlar (har bosishda bittasi, sarlavhasi — qadam nomi):
  1. **Idrok** — Mijoz yozdi: «2 ta Pepperoni». Agent xabarni o'qidi. Pepperoni bugun bormi — hali noma'lum.
  2. **Qaror** — Avval Pepperoni borligini bilish kerak → `checkOrder` asbobini tanlaydi.
  3. **Amal** — `checkOrder()` chaqirildi → natija: «Pepperoni bor». Maqsadga hali yetmadi.
  4. **Idrok** — Natijani o'qidi: Pepperoni bor, buyurtma esa hali bazada yo'q.
  5. **Qaror** — Endi buyurtmani saqlash kerak → `saveOrder` asbobini tanlaydi.
  6. **Amal** — `saveOrder()` chaqirildi → buyurtma bazaga yozildi. Maqsadga yetdi — sikl to'xtaydi.
- Xulosa: Sikl ikki marta takrorlandi: avval tekshirdi, keyin saqladi. Keyingi asbobni har safar agent natijaga qarab o'zi tanladi.
- Tugma: Siklni yuriting (N/6) → Davom etish

**Ko'rinish:** maqsad qatori + oqim + tugma. Har bosishda bitta qadam kartasi (joriy qadam), oqimda o'sha qadam yonadi. Xulosa 6/6 dan keyin — ekrandagi yagona natija-ramka.
Animatsiya: HA — oqimda joriy qadam yonadi; 3-qadamdan (Amal) keyin Amal → Idrok qaytuvchi strelka chiziladi (~0.8 s) va sikl ikkinchi marta boshlanadi. Sikl chiziladigan asosiy joy shu.
Olib tashlanadi: «🔁 Nega aylanadi?» kartasi (Mentor bilan bir ma'no) · oqimdagi «qayta» so'zi (o'rniga ↻) · qadamlardagi «sumkadan … olindi» · «doimiy daftarga yozildi ✅».

✎ Sarlavha «…va u aylanadi» → sikl nomi A11 bo'yicha; takrorlanishni Mentor aytadi · 🔴 xulosa «Mana shu — agentning mustaqilligi (avtonomlik)» → olindi (A10: «o'zi tanlaydi» — siz bergan asboblar ichida) · «daftardagi holat» → «baza» · «Agent holatni qayta baholaydi» → «natijani o'qidi» (Idrok ta'rifi bilan bir xil) · 6-qadamga «maqsadga yetdi — sikl to'xtaydi» qo'shildi (A11 tekshiruvi) · «A-model» → «Pepperoni» · tugma oxiri «✓ Sikl aylandi» → «✓ Maqsadga yetdi»
✎ 30.09: «aylanishini», «aylandi» → «takrorlanishini», «takrorlandi» (o'z A10 qoidamizga zid edi) · ChatGPT #5 «ikki marta aylandi» noaniq — xulosada «natijaga qarab» (har takror — natijani ko'rib, keyingi asbob) · ChatGPT #4 sikl 3/4/5 — 29.09 da A11 bilan bitta tartib

## 4 · 1-savol ✅  `[951]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Botdagi AI qadamlarni o'zi tanladi: avval Pepperoni borligini tekshirdi, keyin buyurtmani bazaga yozdi, oxirida yetkazishni rejaladi. Bu qanday bot?**
  - AI-bot — AI javob matnini yozib beradi
  - Oddiy skript — bir marta ishlab, to'xtaydi
  - ✔ AI-agent — maqsad sari asboblarni ishlatadi
  - Handlerli bot — oldindan yozilgan javob beradi
- To'g'ri: Qadamlarni AI o'zi tanladi va har qadamda asbob chaqirdi — bu AI-agent.
- Xato izohlari:
  - AI-bot faqat javob matnini yozadi — bazaga yozish yoki yetkazishni rejalash uchun asbob chaqirmaydi.
  - Oddiy skript bir marta yuqoridan pastga ishlaydi va qadamlarni o'zi tanlamaydi. Bu yerda qadamlarni AI tanladi.
  - Handlerli botda har hodisaga javobni siz oldindan yozasiz. Bu yerda esa qadamlarni AI o'zi tanladi.
  - (umumiy) Qadamlarni AI o'zi tanlab, asboblarni chaqirgan bo'lsa — bu AI-agent.
- Test ekranlarining umumiy yozuvlari (4, 8, 10, 14-ekran): tugma «To'g'ri javobni toping» → «Davom etish» · xato bosilsa «Qaytadan urinib ko'ring» · to'g'ri bo'lsa «To'g'ri» · birinchi javob xato bo'lsa havola «Qisqa takrorlash — mavzuni yana bir ko'rish» · jonli darsda: «Jonli dars — bitta urinish, o'ylab bosing» → «Javobingiz qabul qilindi» / «Hozir to'g'ri javobni bilib olasiz.» → «To'g'ri javob: C — …» · tugma «Javob tanlang»

✎ 🔴 FAKT: savol «Bot xabarni o'qib, ro'yxatni tekshirdi, daftarga yozdi va yetkazishni rejaladi. Bu nima?» — buni 4-darsdagi oddiy bot ham qila oladi (handler ichida bazaga yozish), savol ikki javobli edi → «AI qadamlarni o'zi tanladi» qo'shildi · «Rule-bot» (izohsiz inglizcha) → «Handlerli bot» (1-dars atamasi) · «Oddiy kalkulyator» (ishonarsiz) → «Oddiy skript» (1-darsda o'tilgan) · variantlar tenglashtirildi · «🧰 sumkadan asboblarni oldi» olindi · test yozuvlaridagi ⚡ 📨 📖 olindi (**KOD**) · `questionText` ko'rinadigan savolga teng bo'lsin (**KOD**: hozir «buyurtmani daftarga yozdi» — boshqa matn)
✎ 30.09: to'g'ri javob izohi bitta gap, «To'g'ri!» siz (A8) · ChatGPT #22 «Rule-bot» — 29.09 da «Handlerli bot»

## 5 · Agentni qurish (markaziy)  `[966]`
- Eyebrow: Markaziy · qurish
- Sarlavha: **Agentni quring: maqsad, asboblar, chegara.**
- Mentor: Agentga uch narsani siz berasiz: nima qilsin (maqsad), nima bilan qilsin (asboblar), nimani so'ramasdan qilmasin (chegara). Har qatorda mos variantni tanlang.
- **Maqsad?**
  - Buyurtma haqidagi savollarga javob yozish — xato: «Faqat javob yozish — AI-botning ishi.»
  - ✔ Buyurtmani qabul qilib, yetkazishga tayyorlash
  - Taom bor-yo'qligini tekshirish — xato: «Bu — bitta qadam, maqsad emas.»
- **Asboblar?**
  - sendSticker, changeAvatar, playMusic, setTheme, sendGif — xato: «Bu asboblar buyurtmaga kerak emas.»
  - changePrice, banUser, refundAll, deleteMenu, sendAds — xato: «Bu asboblar buyurtmani qabul qilishga kerak emas.»
  - ✔ checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder
- **Chegara?**
  - ✔ Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin
  - Mijoz so'rasa, har amalni tasdiqsiz bajarsin — xato: «Agent xato tushunsa, pul haqiqatan yechiladi.»
  - Hech qanday amal qilmay, faqat javob yozsin — xato: «Unda u yana AI-bot bo'lib qoladi.»
- O'ng tomonda: yig'ilayotgan **agent kartasi** · MAQSAD: … · ASBOBLAR: … · CHEGARA: … (tanlangan variantlar bilan to'ladi)
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- Muvaffaqiyat: Agent tayyor. Amaliyotda o'z botingiz uchun ham shu uch qismni yozasiz.
- Tugma: Agentni yig'ing → Davom etish

**Ko'rinish (KOD — hozir 3 qator, 9 variant birdan chiqadi):**
1. Kirganda: faqat «Maqsad?» qatori va uning 3 varianti + o'ngda bo'sh agent kartasi.
2. To'g'ri tanlangach → «Maqsad: Buyurtmani qabul qilib… ✓» bitta qatorga yig'iladi (`↻` bilan o'zgartiriladi), kartadagi MAQSAD to'ladi, «Asboblar?» qatori ochiladi.
3. Xato tanlansa → ✗ va o'sha variantning xato yozuvi (bitta, joriy qator ostida); qator ochiq qoladi.
4. «Chegara?» ham to'lgach → muvaffaqiyat yozuvi (yagona natija-ramka).
Animatsiya: yo'q (karta to'lishining o'zi yetadi).
Olib tashlanadi: Mentordagi «Siz direktorsiz» va «Noto'g'ri variant ham bor — diqqat bilan tanlang» · karta belgisi 🧰 · nishon qoidasidagi 🏅.

✎ 🔴 qator «Chegara?», kartada esa «QOIDA:» — ikki nom → «CHEGARA:» · «Har savolga o'zim javob yozib berish» (kimning «o'zim»i — tushunarsiz) → «Mijoz bilan istalgan mavzuda suhbatlashish» · asbob variantlari bir xil ko'rinishga keltirildi (oldin to'g'risi yolg'iz kod ro'yxati, qolgani gap edi — shakl-tell) · muvaffaqiyat «Bu — har agentning skeleti» → 6-darsga ko'prik va amaliyotga ishora · (taklif, **KOD**) uchala qatorda ✔ birinchi o'rinda — pastga qarang, Agent eslatmalari 6
✎ 30.09: ✔ o'rni aralash — Maqsad 2-, Asboblar 3-, Chegara 1-variant (4-savol A; nishon sharti variant matni bo'yicha) · ChatGPT #23: maqsad variantlari tenglashtirildi — biri AI-bot ishi (faqat javob), biri bitta qadam (maqsad emas); ikkalasi ham buyurtma haqida, ishonarli · xato yozuvi har variantga bitta qisqa gap (umumiy «mos emas» o'rniga — nimaga mos emasligini aytadi) · asboblar — A14 to'plami (5 ta; distraktorlar ham 5 tadan — shakl bir xil); `deleteOrder` distraktordan olindi (`cancelOrder` bilan chalkashardi) · chegara: «To'lov» → «Pul yechish» (A10) · «6-darsdagi yo'riqnomadan farqi…» olindi (muvaffaqiyat qisqa) · ChatGPT #9 «har agentning skeleti» — 29.09 da olingan

## 6 · Asbob nima  `[1011]`
- Eyebrow: Tushuncha · asbob
- Sarlavha: **Asbob (tool) — agent chaqira oladigan funksiya.**
- Mentor: Asbobni siz yozasiz — oddiy JS funksiya, xuddi handler ichidagi kod kabi. AI o'zi faqat matn yozadi; bazaga yozish yoki kartadan pul yechishni asbob bajaradi. Har asbobni bosing.
- Asboblar (bosilganda izoh):
  - `checkOrder()` — Taom borligini yoki buyurtma qaysi holatda ekanini tekshiradi.
  - `saveOrder()` — Buyurtmani bazaga (PostgreSQL) yozadi.
  - `arrangeDelivery()` — Yetkazishni rejalaydi: kuryerga manzil va vaqtni beradi.
  - `chargeCard()` — Mijoz kartasidan pul yechadi.
  - `cancelOrder()` — Buyurtmani bekor qiladi.
- Xulosa (5/5 dan keyin): Agent faqat siz bergan asboblar bilan ishlaydi. Pul yechish va bekor qilishda xato qimmatga tushadi — ularga chegara qo'yiladi.
- Tugma: 5 asbobni oching (N/5) → Davom etish

**Ko'rinish:** 5 tugma; bosilgani bitta kartada ochiladi. Xulosa 5/5 dan keyin (**KOD:** hozir 4 asbob, `notifyUser` bor).
Animatsiya: yo'q.

✎ Sarlavha «Sumkadagi asboblar (tools) — agentning qo'li» → asosiy ta'rif (A10; 6-Modul 4-dars bilan bir xil) · «qo'l» o'xshatishi faqat shu yerda, bir marta · Eyebrow «Asboblar · sumka» → «Tushuncha · asbob» · «doimiy daftarga (bazaga)» → «bazaga (PostgreSQL)» · «Yetkazishni rasmiylashtiradi» → nima qilishi aniq · `notifyUser` — Telegram'ga bog'landi · xulosadagi «qo'llaringiz» olindi (o'xshatish bir marta)
✎ 30.09 ChatGPT #11 **Qabul**: `chargeCard()` 9-ekranda birdan paydo bo'lardi → asboblar ro'yxatida (A14); o'zim: `cancelOrder()` ham 11-ekranda birdan chiqardi → ro'yxatda; `notifyUser()` olindi · ChatGPT #27: «Asbob — agentning qo'li» olindi (Mentorning qolgan gapi shuni o'xshatishsiz aytadi) · xulosadagi «Asbob qancha ko'p bo'lsa…» va «Buni keyinroq ko'ramiz» → xavfli asboblar nomi bilan, 9 va 13-ekranga zamin

## 7 · To'g'ri asbob (markaziy)  `[1043]`
- Eyebrow: Qaror · asbob tanlash
- Sarlavha: **Qaror qadami: vaziyatga mos asbobni tanlang.**
- Mentor: Haqiqiy agentda qaysi asbobni chaqirishni AI tanlaydi. Hozir uning o'rnida siz tanlang.
- Karta: Vaziyat N/3 (birma-bir):
  1. Mijoz yozdi: «Buyurtmam qayerda?» → ✔ `checkOrder()`
  2. Pul yechildi, lekin buyurtma hali bazada yo'q → ✔ `saveOrder()`
  3. Buyurtma bazaga yozildi. Endi uni kuryerga berish kerak → ✔ `arrangeDelivery()`
- O'ng tomonda: **Avval qaysi asbob kerak?** · `saveOrder()` · `cancelOrder()` · `arrangeDelivery()` · `checkOrder()` · `chargeCard()` (A14 to'plami, vaziyat tartibidan boshqa tartibda)
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- Xato: Bu vaziyatda avval boshqa asbob kerak. Vaziyatni qayta o'qing.
- Muvaffaqiyat: Siz vaziyatni ko'rdingiz (Idrok) va asbobni tanladingiz (Qaror) — uni chaqirish esa Amal.
- Tugma: Asbobni tanlang (N/3) → Davom etish

**Ko'rinish:** hozirgidek — vaziyat birma-bir; xato yozuvi bitta, asboblar ostida. Oxirida muvaffaqiyat yozuvi vaziyat kartasi o'rnida.
Animatsiya: yo'q.
Olib tashlanadi: 🎯 · Mentordagi «🧰 sumkadan oling».

✎ Vaziyatlar javobni aytib qo'yardi («avval holatni bilish kerak» → `checkOrder` «holatini tekshiradi»; «endi yozib qo'yish kerak» → `saveOrder` «yozadi») → endi faqat vaziyat · «qaysi asbobni chaqirasiz?» → «Avval qaysi asbob kerak?» (1-vaziyatda keyin `notifyUser` ham kerak bo'ladi — «avval» ikki javobni yopadi) · muvaffaqiyat «aynan shu "qaror" qadami agentni aqlli qiladi» (ortiqcha da'vo, Mentorni takrorlardi) → sikl nomlariga bog'landi · (taklif, **KOD**) vaziyat 1-2-3 → asbob 1-2-3 ketma-ket — Agent eslatmalari 6
✎ 30.09: asboblar A14 to'plami, aralash tartibda (4-savol A; ChatGPT #13 — to'g'ri javob ko'rinib turmasin) · 2-vaziyat «to'lovni tasdiqladi» → «Pul yechildi»: ro'yxatda endi `chargeCard()` bor — «tasdiqladi» bo'lsa, u ham to'g'ri bo'lib qolardi; «yechildi» — pul masalasi yopiq, faqat saqlash qoldi · muvaffaqiyat bitta gap

## 8 · 2-savol ✅  `[1088]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **AI-agent ishni qanday bajaradi?**
  - ✔ Maqsadga mos asbobni tanlab chaqiradi
  - Faqat matn yozib beradi, ishni odam qiladi
  - Kod yozilmasa ham, o'zi bajarib qo'yadi
  - Oldindan belgilangan bitta amalni takrorlaydi
- To'g'ri: AI asbobni tanlaydi, uni esa siz yozgan kod bajaradi.
- Xato izohlari:
  - Faqat matn yozish — bu AI-bot. Agent asbob chaqirib, ishni o'zi bajaradi.
  - Asboblar — siz yozgan oddiy funksiyalar. Ularsiz agent bazaga ham, kuryerga ham yeta olmaydi.
  - Agent vaziyatga qarab har xil asbobni tanlaydi. Doim bitta amalni takrorlash — agent emas.
  - (umumiy) Agent maqsadga mos asbobni tanlab chaqiradi.

✎ To'g'ri javobdagi «(funksiyani)» qavsi olindi (qavs faqat to'g'rida edi) · «— qolgan ishni odam qiladi» tiresi olindi · «Har doim bitta…» (qat'iy so'z xato variantni ochib qo'yardi) → «Oldindan belgilangan bitta amalni takrorlaydi» · «Tanlash AI'da, bajarish — asbobda» → 6-Modul 4-dars bilan bir xil gap («AI tanlaydi, kod bajaradi») · `questionText` «(amal qiladi)» — ko'rinadigan savolga teng bo'lsin (**KOD**)
✎ 30.09: to'g'ri javob izohi bitta gap (A8) · ChatGPT #12 «AI tanlaydi, asbob bajaradi» ajratmasi saqlansin — 29.09 dan butun darsda bir xil

## 9 · Pul yechishdan oldin  `[1103]`
- Eyebrow: Xavfsizlik · tasdiq
- Sarlavha: **Agent pul yechmoqchi. Qanday qilish to'g'ri?**
- Mentor: Agent asbob bilan real ish qiladi, jumladan pul yechadi. Xato qilsa, pul ham haqiqatan yechiladi. Vaziyatni o'qing va tanlang.
- Karta **Vaziyat**: Mijoz 5 ta katta pitsa buyurdi. Agent `chargeCard()` bilan uning kartasidan **450 000 so'm** yechmoqchi.
- Variantlar (bitta urinish):
  - Mijoz o'zi buyurdi — agent tasdiqsiz yechaversin
  - ✔ Yechishdan oldin mijozdan summani tasdiqlatsin
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (xato bo'lsa: «Nishon birinchi urinish uchun edi.»)
- To'g'ri: Agent 5 o'rniga 15 deb tushungan bo'lsa ham, tasdiq xatoni pul yechilmasdan to'xtatadi.
- Xato: Mijoz summani hali ko'rmagan: agent 5 o'rniga 15 deb tushunsa, ortiqcha pul yechiladi.
- Tugma: Qarorni tanlang → Davom etish

**Ko'rinish:** vaziyat + 2 variant; tanlangach bitta natija-ramka (to'g'ri yoki xato).
Animatsiya: HA — to'g'ri tanlovdan keyin tartib chiziladi: Agent → Mijoz («450 000 so'm yechilsinmi?») → Mijoz → Agent («Ha») → `chargeCard()`. Tasdiq Amaldan OLDIN ekanini strelka yo'nalishi ko'rsatadi.
Olib tashlanadi: 💳 · «🧰 Sumkadagi chegara (guardrail)» · «(mijoz/admin)» qavsi · natija yozuvi boshidagi «✓».

✎ Xato variant «Agent o'zi, tasdiqsiz yechib yuboraversin» — hech kim tanlamaydigan edi → ishonarli sabab bilan («Mijoz o'zi buyurdi») · nega xavfli ekani misol bilan (5 o'rniga 15) · «Bu — xavfli amal» kartadan olindi (javobni oldindan aytardi) · Eyebrow «Xavfsizlik · chegara» → «Xavfsizlik · tasdiq» (chegara 13-ekranda ochiladi) · «real zarar» → aniq oqibat
✎ 30.09: izohlar bitta gap (A8) · `chargeCard()` endi 6-ekrandagi ro'yxatdan (A14; «asbobi bilan» — ortiqcha so'z olindi)

## 10 · 3-savol ✅  `[1137]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Agentning maqsadi — buyurtmani qabul qilib, yetkazishga tayyorlash. U buyurtmani saqladi. Endi nima qiladi?**
  - Mijozga «qabul qilindi» deb yozib, ishni tugatadi
  - Mijoz keyingi buyruq yozishini kutib turadi
  - Buyurtmani yana bir marta bazaga yozadi
  - ✔ Natijani ko'radi va keyingi qadamni tanlaydi
- To'g'ri: Yetkazish hali rejalanmagan — maqsadga yetmadi, shuning uchun agent keyingi qadamni tanlaydi.
- Xato izohlari:
  - Yetkazish hali rejalanmagan: maqsadga yetmay turib ish tugamaydi.
  - Keyingi buyruqni kutish — AI-botning ishi. Agent keyingi qadamni o'zi tanlaydi.
  - Buyurtma allaqachon saqlangan — natijani ko'rgan agent uni qayta yozmaydi.
  - (umumiy) Agent natijani ko'radi va maqsadga yetguncha sikl davom etadi.

✎ 🔴 savolda maqsad yo'q edi — «to'xtaydi» ham to'g'ri bo'lishi mumkin edi (maqsad faqat saqlash bo'lsa) → maqsad savolga qo'shildi · «Darrov… doimo…» (qat'iy so'zlar) olindi · «Buyruq kutish — bu reaktiv AI-bot» → «reaktiv» olindi · «Agentni avtonom qiladigan narsa shu» → A11 tili · «rejalash» → «rejalanmagan» (bir shakl) · `questionText` ko'rinadigan savolga teng (**KOD**)
✎ 30.09 ChatGPT #24 **Qabul**: xato variantlar juda oson edi («to'xtaydi», «noldan») → ishonarli: AI-botdek javob yozib tugatish · buyruq kutish · natijaga qaramay o'sha amalni takrorlash; ✔ o'rni D o'sha · to'g'ri izoh bitta gap

## 11 · Amal xavfsizligi (markaziy)  `[1152]`
- Eyebrow: Markaziy · xavfsizlik
- Sarlavha: **Qaysi amalni agent o'zi, qaysini odam tasdig'i bilan bajarsin?**
- Mentor: Har amalni belgilang: agent uni o'zi bajarsinmi yoki avval odamdan tasdiq so'rasinmi? Har qatorda bitta urinish.
- Amallar (har qatorda 2 tugma: O'zi · Tasdiq kerak):
  - Buyurtma holatini tekshirish — `checkOrder()` → ✔ O'zi
  - Buyurtmani bekor qilish — `cancelOrder()` → ✔ Tasdiq kerak
  - Buyurtmani bazaga yozish — `saveOrder()` → ✔ O'zi
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (xato bo'lsa: «Nishon birinchi urinish uchun edi.»)
- Hammasi to'g'ri: Bu agentda tekshirish va saqlash tasdiqsiz bajariladi, bekor qilish esa buyurtmani yo'qotadi — uni odam tasdiqlaydi.
- Xato bo'lsa: Qarang: bekor qilish buyurtmani yo'qotadi — odam tasdig'i kerak; tekshirish va saqlashni agent o'zi bajaradi.
- Tugma: Har amalni belgilang (N/3) → Davom etish

**Ko'rinish (KOD — hozir 3 qator, 6 tugma birdan):** qatorlar navbat bilan: joriy qator ochiq; belgilangani natija rangi va tanlov bilan bitta qatorga yig'iladi (bitta urinish — `↻` yo'q); keyingi qator shundan keyin chiqadi. 3/3 dan keyin bitta natija-ramka.
Animatsiya: yo'q.
Olib tashlanadi: tugmalardagi 🛠️ ✋ · «✓ Ajoyib!» · «Mana guardrail mantig'i».

✎ 2-qator «Mijoz kartasidan pul yechish — chargeCard()» → «Buyurtmani bekor qilish — cancelOrder()»: pul yechish 9-ekranda aynan shu savol bilan yechilgan edi — endi qoida yangi holatga qo'llanadi (bekor qilish 5 va 13-ekranda «xavfli amal» deb aytilgan) · Mentordagi takror gap («Har amalni… Har amalni belgilang») birlashtirildi · (savol — Agent eslatmalari 5)
✎ 30.09: «ruxsat» → «tasdiq» (9, 13, 14-ekran bilan bir so'z — A2) · 3-qator `notifyUser()` → `saveOrder()` (A14) · ChatGPT #14 **Qabul**: «Tekshirish va xabar xavfsiz» — umumiy qoida bo'lib qolardi → «Bu agentda…»; Mentorda «xavfsiz / xavfli» o'rniga savolning o'zi

## 12 · Agent ishda (hayotiy)  `[1196]`
- Eyebrow: Hayotiy · agent ishda
- Sarlavha: **Bitta xabar — agent qadamlarni o'zi tanlab, ishni oxirigacha bajaradi.**
- Mentor: Bu — siz yig'gan agent: maqsadi buyurtmani qabul qilib, yetkazishga tayyorlash. Tugmani bosing va u har qadamda nima qilishini kuzating.
- Chap: agent qadamlari (mijoz ularni ko'rmaydi):
  1. **Idrok** — Mijoz: «2 ta Pepperoni, Chilonzor 5-kvartal». Agent xabarni o'qidi.
  2. **Qaror** `checkOrder()` — Avval Pepperoni borligini tekshiraman.
  3. **Amal** `checkOrder()` — Natija: «Pepperoni bor».
  4. **Idrok · Qaror** `saveOrder()` — Pepperoni bor, buyurtma hali bazada yo'q → saqlayman.
  5. **Amal** `saveOrder()` — Natija: buyurtma bazaga yozildi.
  6. **Idrok · Qaror** `arrangeDelivery()` — Buyurtma saqlandi, yetkazish hali rejalanmagan → rejalayman.
  7. **Amal** `arrangeDelivery()` — Natija: kuryer taxminan 30 daqiqada yetkazadi.
  8. **Maqsadga yetdi** — Buyurtma qabul qilindi va yetkazishga tayyor. Sikl to'xtaydi, mijozga javob ketadi.
- Tugma: ▶ Agentni ishga tushirish → Keyingi qadam → … → ✓ Maqsadga yetdi
- O'ng: mijoz ko'radigan chat · **AvtoPizza · AI-agent** · holat: agent
  - mijoz: «2 ta Pepperoni, Chilonzor 5-kvartal» → (oxirida) bot: «2 ta Pepperoni qabul qilindi. Chilonzor 5-kvartalga taxminan 30 daqiqada yetkazamiz.»
- Karta **Chaqirilgan asboblar** — hali yo'q → (qadamlar bilan to'ladi) `checkOrder()` · `saveOrder()` · `arrangeDelivery()`
- Xulosa: Mijoz bitta xabar yozdi, agent esa uchta asbobni chaqirdi. Qaysi birini qachon chaqirishni u o'zi tanladi — lekin faqat siz bergan asboblar orasidan.
- Tugma: Agentni kuzating (N/8) → Davom etish

**Ko'rinish:** qadamlar bittadan; joriy qadam to'liq, oldingilari qisqa qatorga yig'iladi (faqat nom va asbob) — 8 ta to'liq karta ustma-ust turmaydi (**KOD**). Chat javobi va xulosa — faqat 8/8 dan keyin.
Animatsiya: HA — har Amal qadamida asbob nomidan «Chaqirilgan asboblar» kartasiga chiziq chiziladi va nom o'sha yerga tushadi (qadam ↔ asbob bog'lanishi). 3-ekrandagi qaytuvchi strelkadan boshqa.
Olib tashlanadi: «(sahna ortida)» · status «proaktiv 🟢» · 🧰 · ✅ 📦 · xulosadagi «Mana AI-agent kuchi» (sun'iy hayajon).

✎ 🔴 4 va 6-qadam «Qaror» edi — Amal'dan keyin Idrok'siz, 3-ekrandagi sikl tartibiga zid → «Idrok · Qaror» (natijani ko'rib, keyingisini tanlaydi) · 8-qadam «Tayyor — Maqsadga yetildi» → «Maqsadga yetdi» (A11 tekshiruvi; «yetildi» — g'ayritabiiy shakl) · Mentordagi «🧰 sumkadan asbob oladi» olindi · Eyebrow «avtonom agent» → «agent ishda» · xulosaga chegara ma'nosi qo'shildi (13-ekranga ko'prik) · «A-model» → «Pepperoni»

## 13 · Chegaralar  `[1248]`
- Eyebrow: Xavfsizlik · chegara
- Sarlavha: **Agent real ish qiladi — shuning uchun unga chegara qo'yiladi.**
- Mentor: Chegara (inglizcha guardrail) agent nimani qila olishini va nimani so'ramasdan qilmasligini belgilaydi. Uch turini bosib ko'ring.
- Chegaralar (bosilganda izoh):
  - **Cheklangan asboblar** — Agentga faqat kerakli asboblarni bering. Masalan, buyurtma agentiga narxni o'zgartirish yoki mijozni bloklash asbobini bermang: bermagan asbobini u chaqira olmaydi.
  - **Tasdiq so'rash** — Xavfli amaldan oldin (pul yechish, bekor qilish) agent mijoz yoki admindan tasdiq so'raydi.
  - **Odam nazorati** — Murakkab yoki shubhali holatni agent odamga, masalan AvtoPizza adminiga, uzatadi. Inglizcha nomi — human-in-the-loop.
- Xulosa (3/3 dan keyin): Agentga erkinlik asta-sekin beriladi: avval kam asbob va ko'proq tasdiq, ishonch ortgani sari — ko'proq.
- Tugma: 3 chegarani ko'ring (N/3) → Davom etish

**Ko'rinish:** hozirgidek — 3 tugma; bosilgani bitta kartada. Izoh kartasi oddiy (neytral) karta — hozir `frame-warn` (ogohlantirish rangi) va xulosa yashil ramkasi bilan yonma-yon ikki ramka bo'lib turadi (**KOD**).
Animatsiya: yo'q.
Olib tashlanadi: Mentordagi «direktor 🧰 sumkaga chegara qo'yadi» va «pul, xabar, o'chirish» ro'yxati (xabar yuborish 11-ekranda xavfsiz deb o'rgatiladi — zid edi).

✎ Sarlavha «kuchli, lekin xavfli» → sokin gap · 🔴 FAKT: «human-in-loop» → to'g'ri nomi «human-in-the-loop» · chegara ta'rifi 6-Modul 4-dars bilan bir xil ma'noda («nima qilish mumkin, nima mumkin emas») · «Avtonomlik + chegara = ishonchli agent» → formula-shior olindi, aniq qoida qoldi · «Sumkaga … soling» → «Agentga … bering»
✎ 30.09: cheklangan asbob misoli «pul qaytarish, buyurtmalarni o'chirish» → «narxni o'zgartirish, mijozni bloklash» (5-ekrandagi keraksiz asboblar; `cancelOrder()` agentda bor — «o'chirish» unga zid ko'rinardi) · «to'lov» → «pul yechish», «administrator» → «admin» (A10) · ChatGPT #15, #16 — 29.09 da (shior olingan, human-in-the-loop izohli)

## 14 · 4-savol ✅  `[1280]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Agent mijozning kartasidan pul yechishidan oldin nima muhim?**
  - Unga hamma ishda to'liq erkinlik berib qo'yish
  - ✔ Faqat kerakli asboblarni berish va tasdiq so'ratish
  - Pul yechilgach, mijozga xabar yuborib qo'yish
  - Javob berish tezligini iloji boricha oshirish
- To'g'ri: Xato pul yechilmasdan oldin to'xtashi kerak — chegara shuning uchun.
- Xato izohlari:
  - To'liq erkinlik xavfli: agent xato qilsa, pul haqiqatan yechiladi. Chegara kerak.
  - Xabar pul yechilgandan keyin ketadi — xatoni to'xtata olmaydi. Tasdiq pul yechilishidan oldin so'raladi.
  - Bu yerda tezlik asosiy emas — xavfsizlik muhim: kerakli asboblar va tasdiq.
  - (umumiy) Pul yechishdan oldin chegara kerak: faqat kerakli asboblar va odam tasdig'i.

✎ To'g'ri javobdagi «Chegara:» atamasi va ikki nuqta olindi (faqat to'g'rida edi) · «Hech narsa — …» tiresi olindi · «Agentni bunday ishlarda umuman ishlatmaslik» → «Pul yechilgach, mijozga xabar yuborish» (oldin/keyin farqini tekshiradi; oldingisi qisman to'g'ri bo'lib qolardi — xavfli ishda agentni ishlatmaslik ham yechim) · 🔴 `questionText` «…yoki mijozga xabar yuboradigan amal…» — ko'rinadigan savolda yo'q va 11-ekranga zid (xabar — xavfsiz) → ko'rinadigan savolga teng (**KOD**) · «Bu — har avtonom tizimda muhim» olindi
✎ 30.09: to'g'ri javob izohi bitta gap (A8)

## 15 · Tartibni yig'ing ✅ (final)  `[1295]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: agent qanday ishlashini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar: Maqsad olinadi · Idrok · Qaror · Amal · Maqsadga yetdimi?
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · «bu yerga joylang»
- Xato (hamma joy to'lib, tartib xato): Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (birinchi xatodan keyin): Qisqa takrorlash — mavzuni yana bir ko'rish
- To'g'ri (bitta yozuv): Tartib to'g'ri: maqsadga yetmaguncha agent yana Idrok'ka qaytadi.
- Tugma: Tartibni yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi). Xato va muvaffaqiyat yozuvi — har biri bitta (**KOD:** hozir xatoda ikki yozuv — «⚠️ Tartib xato — qayta joylang» va «Tartib xato — bo'lakni bosib qaytaring…»; muvaffaqiyatda ikki yozuv — «✓ AI-agent sikli tayyor!» va «✓ Tartib: …»).
Animatsiya: HA — to'g'ri yig'ilgach 5-joydan 2-joyga (Idrok) qaytuvchi strelka chiziladi: sikl Maqsadga emas, Idrok'ka qaytadi. Faqat to'g'ri javobdan keyin.

✎ 🔴 Mentor «Maqsad oladi, holatni ko'radi, asbob tanlaydi, amal qiladi va natijani ko'rib qaytadi» — 5 bo'lak tartibini aynan aytib qo'yardi (ballik final) → olindi · bo'lak «Natijani ko'r» → «Maqsadga yetdimi?» (A11: natijani ko'rish — keyingi Idrok; tekshiruv — sikl to'xtaydimi yoki davom etadimi) · «Maqsad» → «Maqsad olinadi» (sikl qadami emasligi ko'rinsin) · 🔴 RECAPS[15] («AI-agent sikli») yozilgan, lekin ochish tugmasi yo'q (`recapOpen` bor, `setRecapOpen(true)` hech joyda chaqirilmaydi [1303]) → havola qo'shiladi (**KOD**) · ⚠️ olindi · sarlavha «AI-agent siklini» → «agent qanday ishlashini» (5 bo'lakning 2 tasi sikl qadami emas)
✎ 30.09 ChatGPT #18 **Qabul**: to'g'ri yozuvi 5 bo'lakni «Bu — agent sikli» derdi — sarlavhaga zid → olindi; yozuv bitta gap (A8), qaytuvchi strelka shuni ko'rsatadi · ChatGPT #4 «sikl — 4 qadam (…Natijani tekshir)» — Qisman: bitta tartib 29.09 da (A11); sikl nomlari uchtaligicha qoladi — 6-Modul 4-darsi aynan shularni oladi; uning «Natijani tekshir» qadami bizda «Maqsadga yetdimi?» · #17 Mentor javobni aytardi — 29.09 da tuzatilgan (8-savol A)

## 16 · Amaliyot · AI-agent  `[2122]`
- Eyebrow: Amaliyot · AI-agent · joy: «kompyuteringizda»
- Sarlavha: **Agentga ikki asbob bering — qaysi birini chaqirishini ko'ring**
- Topshiriq: aistudio.google.com'da agentga maqsad, chegara va ikki asbob berasiz. Model asbobni chaqiradi, natijani siz qaytarasiz — keyingi asbobni u o'zi tanlaydi.
- Umumiy matn: Topshiriqni o'z kompyuteringizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- 1-namuna — **Maqsad va chegara** (kod kartasi, «Nusxalash» tugmasi bilan):
  ```
  MAQSAD: Buyurtmani qabul qilib, bazaga yozish.
  CHEGARA: Taom borligini tekshirmasdan buyurtma yozilmasin.
  ```
- 2-namuna — **Asboblar** (kod kartasi, «Nusxalash» tugmasi bilan):
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
- Qadamlar:
  1. aistudio.google.com'ni oching (6-darsda temperature'ni shu yerda sinagansiz). **System instructions** maydoniga 1-namunani joylang.
  2. O'ngdagi sozlamalarda **Function calling** ni yoqing, **Edit** ni bosing va 2-namunani joylang.
  3. Xabar yozing: «2 ta Pepperoni, Chilonzor 5-kvartal». Model javob matnini yozmaydi — `checkOrder` ni chaqiradi. Asbobni tanlagani — Qaror.
  4. Asbob o'rnida natijani o'zingiz yozing: `{ "bor": true }`. Model natijani ko'radi — bu yangi Idrok — va `saveOrder` ni chaqiradi.
  - Qo'shimcha: yangi suhbat ochib, natijaga `{ "bor": false }` yozing. Model `saveOrder` ni chaqiradimi?
- Tugmalar: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting · «Agent ikki asbobni o'zi tanladi. Mentor tekshirib, keyingi qadamga o'tkazadi.»

**Ko'rinish (KOD):** ikki namuna kartasi yuqorida (har biri «Nusxalash» bilan); qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi.
Animatsiya: yo'q.

✎ AI vositasi «Claude yoki ChatGPT», `claude.ai` → gemini.google.com (qoida: sinfda Gemini) · 🔴 umumiy Mentor «ustoz kuzatib turadi» / «ustozni kuting» / «Ustoz tekshirib…» → «Mentor» (darsning boshqa joylarida Mentor) · 3-qadam: asbob nima qilishini yozish qo'shildi (Gemini tushunishi uchun) · 5-qadam: aniq so'rov-namuna (AvtoPizza bilan) · «✅ Bajardim» → «Bajardim» · «Zo'r! Vazifani bajardingiz» → «Yo'riqnoma tayyor»
✎ 30.09 ChatGPT #20 **Qabul**: «Maqsadni qanday yozaman?» — namuna (agent kartasi, AvtoPizza) qo'shildi; o'quvchi uni o'z botiga moslaydi → har qadamdagi «masalan…» izohlari namunaga ko'chdi, qadamlar 5 → 3 · 3-qadam so'rovi o'quvchining o'z xabari bilan («2 ta Pepperoni» — faqat AvtoPizza uchun edi) · «yo'riqnoma» → «agent kartasi» (A10: yo'riqnoma — 6-darsda system prompt) · «(yoki istalgan mavzu)» olindi — o'z boti · ChatGPT #21 AI nomi bitta — gemini.google.com (qoida) · ChatGPT #19 «agent yaratilmayapti» — 22-savol
✎ 01.10 **22-savol A** (F-1001-83): nom qoladi, amaliyotda haqiqiy asbob chaqiruvi. Agent kartasining uch qismi saytga shunday tushadi: maqsad va chegara — System instructions, asboblar — Function calling (Gemini API asbob e'loni). O'quvchi asbob o'rnida natijani qaytaradi — Idrok → Qaror → Amal ko'z oldida. gemini.google.com'da asbob e'lon qilib bo'lmaydi, shuning uchun AI Studio (6-darsdan tanish, o'sha Google akkaunti). Namuna AvtoPizza asboblaridan ikkitasi (A14); chegara `checkOrder` ni birinchi chaqirishga undaydi. Sayt tugmalari inglizcha — nomlari qalin. ⚠️ Sayt qadamlari brauzerda hali sinalmagan (01.10 Chrome kengaytmasi ulanmagan) — darsdan oldin bir marta sinash kerak.

## 17 · Natijalar (podium)  `[1868]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «sessiya» so'zi — 1-dars B-5.)

## 18 · Takrorlash (kartochkalar)  `[2150]`
- Sarlavha: **O'zingizni sinab ko'ring.**

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

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ …) · «🎉 Hammasini bilasiz!» → «Hammasini bilasiz!»

✎ 🔴 3-kartochka «uch qadam» — to'g'ri, A11 bilan mos; 9-kartochka «sikl qayta aylanadi» → «yana Idrok» (bitta tartib) · 10-kartochka «Guardrails» → «Chegara (guardrail)» (asosiy nom — o'zbekcha, 13-ekrandagidek) · 12-kartochka «Human-in-loop» → «Odam nazorati» + to'g'ri inglizcha nomi · «sumkadan asbob olib», «sumkadagi har bir funksiya», «sumkaga solinadi» → A10 · «daftardagi holat» → «bazadagi ma'lumot» · «Idrok qadamida» → «Idrok» (javob qisqa, bir shakl)
✎ 30.09 ChatGPT #31 **Qabul**: 8-kartochka «qadam emas — maqsad» (kartochka qat'iy gapni eng ko'p mustahkamlaydi) → darsning markaziy modeli: maqsad, asboblar, chegara (hech bir kartochkada yo'q edi) · 2-kartochka «yo'riqnoma» → «system prompt» · ChatGPT #32 «12 → 8 kartochka» — Rad: barcha darslar shabloni (9-dars #19 bilan bir hukm)

## 19 · Yakun  `[2163]`
- Eyebrow: Tayyor · belgi: ✓ AI-agent qanday ishlashini bilasiz
- Sarlavha: **Endi AI-agent qanday ishlashini bilasiz.** · yonida ball-halqasi (x/5)
- Arena tugmasi (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - AI-bot javob matnini yozadi; AI-agent maqsad sari keyingi qadamni o'zi tanlab, asbob chaqiradi
  - Agent sikli: Idrok → Qaror → Amal — maqsadga yetguncha takrorlanadi
  - Asbob (tool) — agent chaqira oladigan funksiya: uni siz yozasiz, qaysi birini chaqirishni AI tanlaydi
  - Agentga siz maqsad, asboblar va chegara berasiz — keyingi qadamni u shular ichida tanlaydi
  - Xavfli amaldan (pul yechish, bekor qilish) oldin agent odamdan tasdiq so'raydi
- Uyga vazifa (tugma: «Uyga vazifa · Amaliy topshiriqni bajarish →», suzuvchi so'zlar: amaliyot · loyiha · mashq · natija):
  - **Loyihalang** — o'z botingiz uchun bitta maqsad va 3–4 ta asbob yozing
  - **Chegaralang** — qaysi amal xavfli (pul yechish, bekor qilish)? Unga odam tasdig'ini qo'ying yoki bu asbobni bermang
  - **Sinab ko'ring** — aistudio.google.com'da o'z botingizning ikki asbobini yozing va ikki xil xabarda model qaysi asbobni chaqirishini ko'ring
- Keyingi dars — **«Botingiz yaxshi ishlayotganini qaysi raqam aytadi?»** Botingiz foydali ekanini ko'rsatadigan bitta bosh raqamni va unga yordam beradigan uch raqamni tanlaymiz.
- Nishonlaringiz — N/4 (olinmaganlari qulf belgisi bilan — nishon qatlami) · Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

Olib tashlanadi: «AI-bot gapiradi, AI-agent 🧰 sumkadan asboblarni olib ISH BAJARADI» (katta harf, sumka) · «Guardrails: …» qatori (atama A10 bo'yicha) · 📝 🚀 🏅 ⏳ (matn oldidagi).

✎ 🔴 FAKT: «Keyingi dars — Botjon o'z javobidan fikr-mulohaza (fidbek) asosida o'zini yaxshilashni o'rganadi!» → bu 9-dars mavzusi (o'tib bo'lgan); App.jsx bo'yicha keyingi dars — 11-dars PM «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?» (tavsif App.jsx `sub` dan) · belgi va sarlavhadagi «Botjon» olindi · 2-band «idrok → qaror → amal → natijani ko'r» → A11 (sikl — uch qadam) · uyga vazifa «Quring» → «Sinab ko'ring» (sinfda agent qurilmaydi, yo'riqnoma sinaladi) · AI vositasi — gemini.google.com
✎ 30.09 ChatGPT #2, #10 **Qabul**: 1 va 4-band qat'iy edi («agent ishni bajaradi», «qadamlar emas — maqsad») → A15 · «to'lov», «pul, o'chirish» → «pul yechish, bekor qilish» (A10) · «Sinab ko'ring» — ikki xil xabar (sinfdagi 3-qadam bitta xabar bilan edi — uyda yangi ish) · ChatGPT #34 keyingi dars — 29.09 da tuzatilgan
✎ 01.10 22-savol A: «Sinab ko'ring» — aistudio.google.com, o'z botining ikki asbobi (16-ekrandagi ish uyda o'z boti bilan)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Agent Builder** (hozir Cycle Builder) — Agentga maqsad, asboblar va chegara berdingiz (5-ekran)
- **Tool Picker** — Har vaziyatga mos asbobni tanladingiz (7-ekran)
- **Guardrail Keeper** — Pul yechishdan oldin tasdiq so'rashni tanladingiz (9-ekran)
- **Safe Actor** — Qaysi amalga odam tasdig'i kerakligini to'g'ri belgiladingiz (11-ekran)
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · (bitta urinishli ekranda) Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting

✎ 🔴 «Cycle Builder — Idrok → qaror → amal rejasini yig'dingiz» 5-ekranda beriladi, u yerda esa maqsad + asboblar + chegara yig'iladi (sikl emas) → «Agent Builder» · «(tool-call)», «(guardrail)» qavslari tavsifdan olindi · 🏅 yozuv boshidan olindi
✎ 30.09 ChatGPT #25 — 29.09 da (har nishon o'z ekraniga); nomlarni o'zbekchaga o'girish — Rad (modul qoidasi: nishon nomi inglizcha) · «ruxsati» → «tasdig'i»

**Qisqa takrorlash oynalari (5)** — karta belgisi (`ic`) o'rniga kod misoli (U3), kodsiz kartada raqam; «Belgilar» qatori ro'yxat ostida; oyna yozuvlari: Qayta tushuntirish · Sinfga savol: · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz · Yopish
1. (4) **AI-bot va AI-agent farqi:** AI-bot — AI faqat javob matnini yozadi. · AI-agent — AI keyingi qadamni tanlaydi va asbob chaqiradi. · Bitta javob va sikl — bot bitta javob bilan to'xtaydi, agent maqsadga yetguncha sikl bo'ylab ishlaydi. · Sinfga savol: AI-bot bilan AI-agentning asosiy farqi nima?
2. (8) **Agent ishni qanday bajaradi:** Idrok — vaziyatni ko'radi: xabar va bazadagi ma'lumot. · Qaror — AI maqsadga qarab asbob tanlaydi. · Amal — asbob chaqiriladi (masalan, `saveOrder()`) va natija qaytadi. · Sinfga savol: Agent ishni nima orqali bajaradi?
3. (10) **Nega sikl takrorlanadi:** Natijani ko'radi — har Amaldan keyin agent natijaga qaraydi, bu yangi Idrok. · Maqsadga yetdimi? — yetmagan bo'lsa, keyingi qadamni tanlaydi. · Takrorlanadi — maqsadga yetguncha Idrok → Qaror → Amal. · Sinfga savol: Agent bitta amaldan keyin nima qiladi?
4. (14) **Chegara — agent nimani qila oladi:** Cheklangan asboblar — agentga faqat kerakli asboblar beriladi. · Tasdiq so'rash — xavfli amaldan (pul yechish, bekor qilish) oldin odamdan tasdiq so'raladi. · Odam nazorati — shubhali holat odamga uzatiladi. · Sinfga savol: Agent pul yechishdan oldin nima qilishi kerak?
5. (15) **Agent qanday ishlaydi:** Maqsad olinadi — agent vazifani oladi. · Idrok → Qaror → Amal — vaziyatni ko'radi, asbob tanlaydi, uni chaqiradi. · Maqsadga yetdimi? — yetmagan bo'lsa, yana Idrok. · oqim: Maqsad olinadi → Idrok → Qaror → Amal → Maqsadga yetdimi? · Sinfga savol: Agent ishi nimadan boshlanadi?
- Belgilar (U3): 1-oyna — 1 · `saveOrder()` · 3 | 2-oyna — 1 · 2 · `saveOrder()` | 3-oyna — 1 · 2 · 3 | 4-oyna — 1 · `chargeCard()` · 3 | 5-oyna — 1 · 2 · 3 (tartibning o'zi — raqam)

✎ 3-oyna sarlavhasi «Loop» → «Takrorlanadi» · 4-oyna «Guardrails — 🧰 sumkadagi chegaralar» → «Chegara — agent nimani qila oladi» · 5-oyna «🔁 Natijani ko'r» → «Maqsadga yetdimi?» (final bo'laklari bilan bir xil) · «daftardagi holat» → «bazadagi ma'lumot» · 💬 🧰 🔁 👁️ ⚖️ 🛠️ 🎯 ✋ 🧑‍💼 📖 🗣️ olindi · 5-oynaga ochish havolasi — 15-ekran (**KOD**)
✎ 30.09: «Belgilar» qatori (U3) · 1-oyna «ishni bajarmaydi» olindi (A15) · «to'lov» → «pul yechish»

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. AI-bot va AI-agentning asosiy farqi nima? Agentning rangi va shrifti boshqacha bo'ladi · ✔ Agent maqsad sari qadamlarni o'zi tanlaydi · Ular orasida hech qanday farq yo'q · Agent botdan ancha sekin ishlaydi
2. Agent siklidagi «Amal» qadami nima? Mijozning keyingi xabarini kutish · Salom berib, menyuni yuborish · O'zini o'chirib, ishni to'xtatish · ✔ Tanlangan asbobni chaqirish
3. Asbob (tool) nima? ✔ Agent chaqira oladigan funksiya · Botning rang va shrift sozlamasi · Server joylashgan IP-manzil · Internetga ulanish tezligi
4. Agent qaysi asbobni chaqirishni qanday tanlaydi? Ro'yxatdagi birinchi asbobni oladi · AI tasodifan, tavakkaliga tanlaydi · ✔ AI maqsad va vaziyatga qarab tanlaydi · Har safar odam qo'lda tanlab beradi
5. Agent bitta amalni bajardi. Endi nima qiladi? Ish tugadi deb, shu zahoti to'xtaydi · ✔ Natijani ko'rib, keyingi qadamni tanlaydi · O'sha amalni yana bir marta bajaradi · Mijoz keyingi buyruq yozishini kutadi
6. Agentga siz qaysi uch narsani berasiz? ✔ Maqsad, asboblar va chegara · Faqat system prompt: qanday javob yozsin · Har hodisa uchun tayyor javob matni · Bot tokeni va server manzili
7. Chegara (guardrail) nima uchun kerak? Botni chiroyliroq ko'rsatish uchun · Javob tezligini oshirish uchun · Mijozga rang tanlab berish uchun · ✔ Agentni xavfli amaldan to'xtatish uchun
8. Agent pul yechishdan oldin nima qilishi kerak? Tasdiqsiz, o'zi yechaverishi · ✔ Odamdan tasdiq so'rashi · Botni o'chirib qo'yishi · Imkon boricha tez yechishi
9. Odam nazorati (human-in-the-loop) nimani anglatadi? Agent hamma ishni yolg'iz bajaradi · Odam jarayonga umuman aralashmaydi · ✔ Muhim holatda qarorni odam qiladi · Mijoz botdan butunlay bloklanadi
10. «Cheklangan asboblar» chegarasi nimani bildiradi? Asboblar sekinroq ishlay boshlaydi · Hamma asboblar bepul bo'ladi · Agentga barcha asboblar beriladi · ✔ Agentga faqat kerakli asboblar beriladi
11. Agent sikli qaysi tartibda ishlaydi? ✔ Idrok → Qaror → Amal → yana Idrok · Amal → Idrok → Qaror → yana Amal · Qaror → Amal → Idrok → yana Qaror · Idrok → Amal → Qaror → yana Idrok
12. Agent siklida «Qaror» qadamini kim bajaradi? Mijoz har safar qo'lda tanlaydi · Hech kim — qadam o'z-o'zidan o'tadi · ✔ AI — qaysi asbob kerakligini tanlaydi · Asbob o'zi hal qiladi, AI faqat kutadi

✎ Qavslar faqat to'g'rida edi → olindi: 2 «(funksiyani)», 3 «(saveOrder)», 7 «(masalan pul)», 8 «(mijoz/admin)» · qat'iy so'zlar xato variantlarda javobni ochib qo'yardi («har doim», «hech qachon») → 1, 4 · 🔴 11-savol: to'g'ri variant «Idrok → Qaror → Amal → Natijani ko'r → (qayta)» 4 bo'lakli, distraktorlarda «Maqsad», «Natija» aralash edi → A11 bo'yicha uch qadam + «yana Idrok»; 4-variant «Faqat bitta Amal» (shakli boshqa) → bir xil shakldagi noto'g'ri tartib · 5-savol: to'g'ri eng uzuni edi → tenglashtirildi · 9-savol: «Human-in-loop» → «Odam nazorati (human-in-the-loop)» · 10-savol: «Sumkaga» → «Agentga»; 3-variant to'g'rining teskarisi (ishonarli)
✎ 30.09: 1-savol ✔ «Bot javob yozadi, agent asbob bilan ish qiladi» → A15 (kim tanlaydi) · 6-savol «qadamlar o'rniga maqsad» (qat'iy, 4-savol bilan takror) → markaziy model; xato variantlar ishonarli: AI-bot (system prompt), handlerli bot (tayyor javob), 1-dars (token) · 5-savol «noldan boshlaydi» → «o'sha amalni yana bajaradi» (10-ekran bilan bir xil sabab — ChatGPT #24) · ✔ o'rinlari o'zgarmadi
✎ 01.10 razrabotka (F-1001-84, lint:tell): «AI» faqat to'g'ri variantda edi → 4-savol 2-variant «AI tasodifan…», 12-savol 4-variant «Asbob o'zi hal qiladi, AI faqat kutadi» · ✔ o'rinlari o'zgarmadi

**Arena fonida suzuvchi so'zlar:** agent · asbob · maqsad · idrok · qaror · amal · chegara · sikl · ✓ · ✗
**Podium nuqtalari yorlig'i:** 1 — AI-agent nima · 2 — Asbob · 3 — Amaldan keyin · 4 — Chegara · 5 — Agent sikli

✎ 🔴 podium yorlig'i «3 — Tashqi xizmat» 10-ekranga (Amaldan keyin nima bo'ladi) qo'yilgan edi; «tashqi xizmat» darsda umuman o'tilmaydi → «Amaldan keyin» · «Tool-call», «Guardrails» → «Asbob», «Chegara» · fondagi 🧰 🛡️ 🔧 ✋ va «tool-call», «guardrails», «tashqi xizmat» olindi

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — savol va variantlar tugma bosilgandan keyin chiqadi; javob izohi tanlovga qarab ikki xil («Aynan!» faqat 2-variantga, qolganiga «Qiziq fikr!»); `frame-warn` («📓 Daftar…») o'rniga har chat ostida «Baza» qatori; `saveOrder()` → «Baza» strelkasi; chat avatar emojisi va holatdagi «reaktiv / proaktiv» olinadi.
2. s1 — `Preview` dagi `TgChat` + `sk-info` va `GearPanel` olinadi; o'rniga statik chizma («Siz berasiz: Maqsad · Asboblar · Chegara → Agent: Idrok → Qaror → Amal ↻»); 4 qadam birma-bir.
3. s2 — karta sarlavhalaridagi emoji olinadi (matn o'zgarishi bilan).
4. s3 — «Nega aylanadi?» kartasi olinadi; maqsad qatori qo'shiladi; oqimda joriy qadam yonadi, 3-qadamdan keyin Amal → Idrok qaytuvchi strelka; tugma oxiri «✓ Maqsadga yetdi».
5. s4, s8, s10, s14 — `questionText` ko'rinadigan savol matniga teng (hozir to'rttasida farq bor; s14 dagi «yoki mijozga xabar yuboradigan» 11-ekranga zid).
6. s5 — qatorlar navbat bilan (Maqsad → Asboblar → Chegara, ✓ yig'ilish, `↻`); kartada «QOIDA:» → «CHEGARA:», «🧰 AGENT» → «AGENT»; (4-savol A) har qatorda ✔ o'rni har xil — hozir uchalasida `right: 0`.
7. s7 — `flow-label` «Avval qaysi asbob kerak?»; (4-savol A) s7 dagi asboblar ro'yxati boshqa tartibda ko'rsatiladi — hozir vaziyat 1-2-3 → asbob 1-2-3.
8. s9 — to'g'ri tanlovdan keyin tasdiq strelkasi (Agent → Mijoz → Agent → `chargeCard()`).
9. s11 — qatorlar navbat bilan; tugma emojisi olinadi; `ACT_SAFETY.a2` matni: chargeCard → cancelOrder (`danger: true` o'zgarmaydi); `a3`: notifyUser → saveOrder.
10. s12 — `STEPS` 4 va 6-qadam yorlig'i «Idrok · Qaror», 8-qadam «Maqsadga yetdi»; oldingi qadamlar qisqa qatorga yig'iladi; asbob → «Chaqirilgan asboblar» chizig'i; status 🟢, ✅ 📦 olinadi.
11. s13 — izoh kartasi `frame-warn` → neytral karta (ekranda bitta ramka).
12. s15 — Mentor matni; `FLOW` yorliqlari; `DragDropOrder` da xato yozuvi bitta (`dd-wrong` yoki `dd-pool-empty` dan biri) va muvaffaqiyat yozuvi bitta (`dd-done` yoki `frame-success` dan biri); RECAPS[15] ni ochish havolasi (birinchi xatodan keyin, test ekranlaridagidek); Idrok'ka qaytuvchi strelka.
13. s16 — `ScreenLivePractice` checklist navbat bilan (bu darsdagi nusxa); umumiy Mentor matnidagi «ustoz» → «Mentor»; «✅ Bajardim» → «Bajardim». **01.10 (22-savol A):** sarlavha, topshiriq, ikki namuna kartasi (har biri «Nusxalash»), 4 qadam + qo'shimcha, yakun yozuvi — 16-ekrandagidek; manba aistudio.google.com.
14. Test va oyna yozuvlari — `QuestionScreen` dagi ⚡ 📨 📖, `AchRule` dagi 🏅, `RecapOverlay` dagi 📖 🗣️, flashcard «🎉» olinadi.
15. s19 — belgi, sarlavha, `RECAP`, `HOMEWORK`, keyingi dars qatori; 📝 🚀 🏅 ⏳ olinadi.
16. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`), RECAPS `ic` → kod misoli yoki raqam (U3), `ACHIEVEMENTS` (`name` cycleBuilder → Agent Builder, `desc`), `Q_LABELS`, `QZ_BG_SHAPES`, `BOT_FLASHCARDS`, `QUIZ_BANK` matnlari (`correct` o'zgarmaydi).
16a. 30.09 (ChatGPT auditi F-0930-105): UI qoidalari U1–U3 (harakat tugmalari bir uslubda; ochiladigan kartalarda `›` / `✓`; hook tanlovi neytral; 1-ekran qadam teglari olinadi; `TgChat` oraliqlari; RECAPS «Belgilar») · to'g'ri javob izohlari bitta gap (4, 7, 8, 9, 10, 11, 14, 15-ekran) · s0 xato izohi har variantga alohida (1 va 3) · s2 — 4 → 3 jihat («Qanday ishlaydi?» olinadi) · s5 — ✔ o'rni aralash (Maqsad 2, Asboblar 3, Chegara 1), nishon sharti variant matni bo'yicha; har xato variantga o'z yozuvi; asboblar variantlari 5 tadan; karta sarlavhasi «Agent kartasi» · s6 — `TOOLS` 5 ta: `notifyUser` olinadi, `chargeCard`, `cancelOrder` qo'shiladi · s7 — panel 5 asbob aralash tartibda (A14); 2-vaziyat matni · s11 — tugma «Ruxsat kerak» → «Tasdiq kerak»; 3-qator `notifyUser` → `saveOrder` (`danger: false`) · s16 — namuna kod kartasi «Nusxalash» tugmasi bilan; checklist 5 → 3 qadam · `QUIZ_BANK` 1, 5, 6-savol matni (✔ indekslari 1, 1, 0 o'zgarmaydi) · `BOT_FLASHCARDS` 2 va 8 · `QZ_BG_SHAPES` dan «tool».

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **Jihozlar paneli (`GearPanel`)** — 1-dars B-1 bo'yicha (bu dars KOD 2 da). 7-dars panelida «Ish bajaradi» (10-dars mavzusi) oldindan yonishi ham shu bilan yopiladi.
2. **App.jsx m5-10 `sub`** «idrok, qaror va amal aylanmasi» → «idrok, qaror va amal sikli» (A2: bir tushuncha — bir nom; App.jsx — chegaradan tashqarida).
3. **9-dars v2:** yakundagi «Keyingi dars — AI-agent: bu yaxshilash aylanasini endi botning O'ZIga beramiz» — 10-dars bunday qilmaydi (bot o'zini yaxshilamaydi, maqsad sari qadam tanlaydi) → masalan, «Keyingi dars — «AI-agent yaratish»: botga maqsad berasiz, qadamlarni u o'zi tanlaydi». → 30.09: 9-dars v2 da tuzatilgan; A15 bo'yicha yana aniqlandi («botga maqsad berasiz — keyingi qadamni u o'zi tanlab, asbob chaqiradi»).
4. **6-dars v2:** 10-dars «AI-bot» deganda 6-dars botini nazarda tutadi («yo'riqnoma bo'yicha javob yozadi»; 06-sozlar'da «AI-bot» atamasi yo'q — u yerda «Maslahatchi»). 6-dars v2 da «yo'riqnoma» nomi o'zgarsa — 10-darsning 0, 2, 5-ekranlari va 2-kartochkasi shunga moslanadi. → 30.09: 6-dars v2 nomi — **system prompt**; 10-darsning 0, 2-ekrani, 2-kartochkasi va 6-viktorinasi shunga moslandi.
5. **6-Modul 4-dars (boshqa seans, faqat xabar):** «asbob (tool) — agent chaqira oladigan funksiya» va Idrok → Qaror → Amal — mos. Farqlar: u yerda «vakolat chegarasi (guardrail)», bu yerda «chegara (guardrail)»; u yerdagi 12-ekranda ham Amal'dan keyin darhol Qaror keladi (bu yerda «Idrok · Qaror» qilindi). 30.09: u yerdagi amaliyot ham agentni faqat rejalaydi («Loyihangiz uchun AI-agentni rejalashtiring») — 22-savolga bog'liq.
6. **«sessiya»** (podium) — 1-dars B-5.
7. **RU matni** — o'zbekcha tasdiqlangach.
8. **Dars nomi (22-savol — 01.10 javob A: nom qoladi, 16-ekranda asbob chaqiruvi; App.jsx o'zgarmaydi):** App.jsx m5-10 `title` «AI-agent yaratish», turi «Proyekt» — lekin darsda agent qurilmaydi, agent kartasi yoziladi (ChatGPT #19). Javobga qarab: nom (App.jsx, 9-dars «Keyingi dars» qatori) yoki 16-ekran amaliyoti o'zgaradi.

---

## Agent eslatmalari
1. **DAVOM 6–7, tekshirdim — hammasi tasdiqlandi va tuzatildi:** «Keyingi dars — fidbek» [2217] (19) · 0-ekran «O'tgan darsni eslang: AI-bot» [814] (0) · RECAPS[15] bor, ochish tugmasi yo'q [1303–1317] (15, KOD 12) · final Mentor tartibni aytadi [1308] (15) · sikl 3/4/5 qadam (1, 3, kartochka 3 — uch; arena 11 — to'rt; final — besh) → A11 · «Vositalar / asbob / tool-call» → A10.
2. **Qo'shimcha fakt (muhim):** «AI-bot gapiradi, AI-agent real ish qiladi» — to'liq to'g'ri emas: 4-darsdagi oddiy bot ham handler ichida bazaga yozadi. Farqni «qadamni AI o'zi tanlaydi» ga ko'chirdim (2-ekran xulosasi, 4-savol), 6-Modul 4-dars v2 ham shunday deydi.
3. **Savol — final bo'laklari:** «Maqsad olinadi · Idrok · Qaror · Amal · Maqsadga yetdimi?» (sikl — uch qadam, qolgan ikkitasi — boshi va tekshiruvi). Muqobil 5-bo'lak «Natijani ko'radi» — lekin u keyingi Idrok bilan bir ma'no, yana 4/5 chalkashligi qaytadi. Ma'qulmi? → 30.09: 8-savol A — qabul.
4. **Savol — sikl bo'lmagan qadamlar nomi:** A11 dagi «Maqsad olinadi» va «Maqsadga yetdimi?» — 6-Modul 4-darsida bunday nom yo'q (u yerda faqat «maqsadga yetguncha»). Nomlar sikl nomlariga (Idrok · Qaror · Amal) tegmaydi, lekin 6-Modul seansiga xabar berish kerakmi? → 30.09: faqat xabar (B-5); sikl nomlariga tegmaydi.
5. **Savol — 11-ekran:** pul yechish 9-ekranda aynan shu savol bilan yechiladi, shuning uchun 11-ekrandagi 2-qatorni «Buyurtmani bekor qilish — cancelOrder()» ga almashtirdim (nishon ekrani, `danger` o'rni o'zgarmaydi). Rozimisiz? → 30.09: qabul («O'zim hal qilganlar» 8); `cancelOrder()` endi agent asboblarida (A14).
6. **Savol — nishon ekranlarida naqsh:** 5-ekranda uchala qatorda ✔ birinchi; 7-ekranda vaziyat tartibi = asboblar tartibi. Bular jonli ball kalitiga kirmaydi (faqat nishon), lekin o'qimasdan bosib nishon olish mumkin. Aralashtirish (KOD 6, 7) — sizning tasdig'ingiz bilan. → 30.09: 4-savol A — aralashtirildi.
7. **Tuzilma (o'zim qilmadim):** 5-ekran (agentni qurish — asboblar ro'yxati tanlanadi) 6-ekrandan (asbob nima) oldin keladi. O'quvchi asboblarni 0 va 3-ekrandan taniydi, lekin 5 ↔ 6 almashsa mantiqiyroq bo'lardi. Ekran tartibi o'zgarmasligi kerak bo'lgani uchun faqat yozib qo'ydim. → 30.09 (13-savol A, ChatGPT auditidan keyin): tartib qoladi — ChatGPT taklif qilgan tuzilma ham 5-ekranda qurish, 6-ekranda asboblar; asbob nomlari o'z vazifasini aytadi, 0 va 3-ekranda ko'rilgan.
8. **Olam:** «A-model» (qanday do'kon ekani aytilmagan) → AvtoPizza «2 ta Pepperoni, Chilonzor 5-kvartal» (1 va 9-darsdagi ip). 9-ekrandagi 450 000 so'm 5 ta katta pitsaga moslab qoldirildi.
