# 6-Modul (LMS: 8-Modul) · 4-dars «AI-agent nima» — MD v3

Fayl: `src/6-Modull/AgentArchitectureLesson.jsx` · 20 ekran · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `04-AgentArchitecture-v2.md` va hozirgi kod. Deyarli hamma ekran o'zgargani uchun v3 har ekranni to'liq yozadi; «o'zgarmaydi» deyilgani — kodda qanday bo'lsa.
Oldingi dars — «Arxitektura patternlari» (m6-03) · keyingi — «Claude Skills — nima» (m6-05) · menyu nomi = «AI-agent nima» (App.jsx, o'zgarmaydi).
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: `INLINE_KEYS = { s4: 1, s8: 2, s11: 0, s14: 3, s15: 0 }` (s4 = 2-variant · s8 = 3 · s11 = 1 · s14 = 4 · s15 tartib) · arena kaliti 3/3/3/3.

---

## A. Darsning tayanchi

**v3 qoidalari** (pilot A-7…A-11 o'z kuchida): har tushuncha-ekranda o'quvchi bitta ish qiladi va **agent xaritasi** o'zgaradi (DE-184); ish tugagach harakat paneli
yopiladi, xarita fokusga chiqadi (199); ⛶ har vizualda (200); bashorat ballsiz (181); yuzada emoji yo'q (185); sarlavha ≤55 · Mentor ≤2 gap · xulosa ≤110.

**Atamalar — bot darslari (5-Modul «AI-agent yaratish», `BotAiAgentLesson.jsx`) bilan aynan bir xil (T-014):**
1. **Oddiy AI** — savolga bitta javob matnini yozadi va to'xtaydi. Bot darslaridagi «AI-bot» ham shunday edi — 2-ekranda bir gapda tenglashtiriladi (T-052).
2. **AI-agent** — maqsad olgach, keyingi qadamni o'zi tanlaydi va siz bergan asboblar bilan bir necha qadam bajaradi.
3. **Asbob** (inglizcha *tool*, faqat 2-ekranda bir marta) — agent chaqira oladigan funksiya. Qaysi asbobni chaqirishni AI modeli tanlaydi, asbobni backend kodingiz bajaradi.
   v2 dagi «tool / tool'lar» → **asbob / asboblar** (5-Modulda asosiy nom shu).
4. **Agent sikli** — `Maqsad olinadi → Idrok → Qaror → Amal → Maqsadga yetdimi?` (5-Modul `CYCLE` aynan). v2 dagi «Maqsad», «Natijani tekshirish» → 5-Modul nomlari.
5. **Chegara** (inglizcha *guardrail*, 13-ekranda bir marta) — agent nimani o'zi qiladi, nimani faqat odam tasdig'i bilan, nimani umuman qilmaydi.
   v2 dagi «vakolat chegarasi» → **chegara** (5-Modul nomi). Uch daraja 6-dars (PM) bilan bir: o'zi · tasdiq bilan · umuman yo'q.
6. Siz agentga **uch narsa** berasiz: maqsad, asboblar, chegara (5-Modul A11 aynan).
7. Tizim qismlari 1-dars xaritasidagi nomlar bilan: **Backend · Database · Frontend**; yangi — **Kuryer xizmati** (tashqi xizmat · API), **To'lov xizmati**, **Admin** (odam).

**Misol-ip:** mini-do'kon (1–3-darslar) va uning Telegram boti. Mijoz yozadi, agent backend ichida ishlaydi. Mahsulotlar 1-dars narxlarida: Quloqchin 300 000,
Powerbank 250 000 (yangi). Metafora yo'q: v2 dagi «detektiv» (2-ekran) va «ruxsatnoma» (6-ekran) olindi — xarita o'zi ko'rsatadi (pilotdagidek, T-016/017).

---

## Darsning ipi va bitta vizual

- **Hook:** mijoz botga yozadi: «Do'stimga 300 ming so'mgacha sovg'a kerak, bugun yetib borsin» → oddiy AI maslahat beradi, agent ishni bajaradi.
- **Agent xaritasi (dars bo'yi bitta vizual, bitta manba `AGENT_XARITA` + `ASBOBLAR` + `SIKL`, 180):**
  - chapda **Telegram chat** (mijoz ↔ do'kon boti): pufaklar, yangi xabar bir lahza ajralib kiradi;
  - o'rtada **AI** tuguni (1-darsdagi AI — «maslahat beradi») → asboblar ulanib, sikl paydo bo'lgach **Agent** yorlig'ini oladi; tugunda **sikl halqasi** —
    uch bo'lak Idrok · Qaror · Amal (joriy bo'lak accent), ostida «Maqsadga yetdimi?» belgisi va halqa boshiga qaytuvchi strelka;
  - o'ngda qismlar: **Database** (kichik jadval: mahsulotlar, buyurtmalar), **Kuryer xizmati** (API); 10-ekrandan **To'lov xizmati**, 13-ekranda **Admin**;
  - **asbob-chiziqlar** agentdan qismga: chiziq ustida o'zbekcha nom, ostida mayda mono kod nomi. Holatlar: yo'q · kulrang (berilgan) · oqim (chaqirilyapti,
    konvert yuradi — so'rov modul rangida, javob yashil) · yashil (natija qaytdi) · qulf (tasdiq bilan) · uzuq kulrang iz (berilmagan);
  - **ikki ko'rinish:** 0–6-ekran — yaqin (chat · agent · qismlar); 7-ekrandan — to'liq: 1-dars xaritasi ichida, agent **Backend** qutisida.
- **Asboblar (bitta manba `ASBOBLAR`, 5-Modul A14 naqshi):**

| O'zbekcha nom (xaritada) | Kod nomi | Qism | 13-ekran guruhi |
|---|---|---|---|
| Mahsulot qidirish | `findProduct()` | Database · o'qiydi | O'zi qiladi |
| Buyurtmani o'qish | `getOrder()` | Database · o'qiydi | O'zi qiladi |
| Buyurtma yozish | `saveOrder()` | Database · yozadi | O'zi qiladi |
| Kuryerdan so'rash | `askCourier()` | Kuryer xizmati · API | O'zi qiladi |
| Pul qaytarish | `refund()` | To'lov xizmati | Tasdiq bilan |
| Buyurtmani o'chirish | `deleteOrder()` | Database · o'chiradi | Umuman yo'q |

---

## 0 · Kirish  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Bitta xabarga ikki xil AI qanday javob beradi?** (46)
- Mentor: Bot darslarida botingizga agent qo'shgansiz. Endi uni butun tizim ichida ko'ramiz — avval tugmani bosib, ikki javobni solishtiring.
- Maket (chap): Telegram chat «Mini-do'kon boti». Mijoz: «Do'stimga 300 ming so'mgacha sovg'a kerak, bugun yetib borsin.»
  Tugma (ikkinchi daraja): Ikki javobni ko'rish → ikki pufak navbat bilan, har birining ustida kulrang yorliq:
  - Oddiy AI: «Quloqchin yoki powerbank sovg'a qilishingiz mumkin. Do'kondan o'zingiz tanlab, buyurtma bering.»
  - AI-agent: «Quloqchin topildi — 300 000 so'm, omborda bor ✓ Kuryer bugun 18:00 gacha yetkazadi ✓ Buyurtma #1043 band qilindi ✓»
- Savol (o'ng): **Asosiy farq nimada?** — variantlar javoblar chiqqach ochiladi (radio, ballsiz):
  1. Agent chiroyliroq va batafsilroq yozdi
  2. Agent javobdan oldin uch ishni bajardi
  3. Farqi yo'q — ikkalasi bir xil ish qildi
- Javob — 2-variant: **Aynan!** Oddiy AI maslahat berdi. Agent esa do'kon ma'lumotini oldi va ishni o'zi bajardi. (88)
- Javob — 1 yoki 3: **Qiziq fikr!** Gap so'zda emas: ikkinchi AI mahsulotni topdi, kuryerdan so'radi va band qildi. (91)
- **Harakat → Vizual o'zgarish:** «Ikki javobni ko'rish» → chatda ikki pufak navbat bilan chiqadi, agent pufagidagi uch ✓ bittadan yonadi; shundan keyin variantlar ochiladi.
✎ sarlavha 131 → 46: mijoz xabari maketga ko'chdi (P-010) · hook javoblari 230/250 → 88/91 · 💬/🤖 yorliqlari → kulrang so'z-yorliq (185) · budjet 200 → 300 ming
(1-darsda Quloqchin 300 000 — 200 ming bilan agent uni topa olmasdi) · to'g'ri variant endi «asbob» atamasini oldindan aytmaydi (T-011) va eng uzuni emas (38/38/39)

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun agent tizimda qanday ishlashini ko'ramiz.** (47)
- Mentor: Avval agentning ichiga qaraymiz, keyin uni qachon ishlatishni hal qilamiz.
- Chapda: «Dars oxirida agentning ishini xaritada qadamma-qadam tushuntira olasiz.» + agent xaritasining kulrang skeleti: chat · AI · Database · Kuryer xizmati,
  chiziqda so'rov va javob konverti aylanib yuradi (1-dars rejasi naqshi).
- O'ngda (01 · matn · teg):
  - 01 · Oddiy AI va agent farqi · farq
  - 02 · Agent sikli: Idrok → Qaror → Amal · sikl
  - 03 · Asboblar va agentning tizimdagi o'rni · asbob
  - 04 · Qachon agent kerak va unga chegara · chegara
- Tugma: Boshlaymiz
✎ sxema emojilari (🗄️ 📡 💬 🤖) → chizilgan xarita skeleti · «Agent backend ichida ishlaydi…» kartasi olindi — buni o'quvchi 7-ekranda o'zi topadi (P-015: reja kashfiyotni
oldindan aytmaydi) · 3-qadam ta'rifi («Tool — agent ishlata oladigan asbob») olindi · «vakolat chegarasi» → «chegara»

## 2 · Asbob ulangan AI  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · asbob
- Sarlavha: **Asbob ulangan AI nimani qila oladi?** (35)
- Mentor: Bot darslaridagi AI-bot kabi, oddiy AI do'kon ichini ko'rmaydi. Unga uchta asbob (inglizcha tool) ulab, chatdagi javobga qarang.
- Bashorat (ballsiz): **Asbob ulansa, AI javobi qanday bo'ladi?** · Uzunroq va chiroyliroq · Do'kondagi aniq ma'lumot bilan
- Vizual: xarita yaqin ko'rinishda — o'rtada **AI** tuguni (asbobsiz), o'ngda Database va Kuryer xizmati (kulrang), chapda chat: hook xabari va oddiy AI javobi.
- Chapda (harakat): uchta asbob — Mahsulot qidirish · Kuryerdan so'rash · Buyurtma yozish.
- **Harakat → Vizual o'zgarish:** asbobni bosish → AI tugunidan qismga chiziq chiziladi (nom + mayda `findProduct()`), qism kulrangdan oq kartaga aylanadi
  VA chatdagi AI javobi qayta yoziladi:
  - asbobsiz: «Quloqchin yoki powerbank sovg'a qilishingiz mumkin.»
  - + Mahsulot qidirish: «Omborda quloqchin bor — 300 000 so'm.»
  - + Kuryerdan so'rash: «Quloqchin bor, 300 000. Kuryer bugun 18:00 gacha yetkazadi.»
  - + Buyurtma yozish: «Quloqchin band qilindi (#1043), bugun 18:00 gacha yetib boradi.» — Database jadvaliga `#1043 · Quloqchin · band` qatori ajralib tushadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: do'kondagi aniq ma'lumot bilan»
- Xulosa: Asbobsiz AI faqat maslahat yozadi. Asbob bilan u do'kondagi ma'lumotni o'qiydi va o'zgartiradi. (95)
- Tugma (pastki): 3 asbobni ulang (N/3) → Davom etish
✎ 4 jihat-chip → matn-karta edi (DE-184) → asbob ulanadi, chat javobi ko'z oldida o'zgaradi · detektiv o'xshatishi olindi · «Eslatma: chat-AI'lar ham asbob ishlatadi…»
olindi — agentning asosiy belgisini 3-ekran ko'rsatadi · «AI-bot» ko'prigi (T-052) · 1-darsdagi AI tuguni («maslahat beradi») shu yerda davom etadi

## 3 · Natija o'zgarsa  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · keyingi qadam
- Sarlavha: **Natija o'zgarsa, agent nima qiladi?** (35)
- Mentor: Xabarni ikkala AI'ga yuboring. Keyin ombordagi quloqchinni «tugadi» qilib, yana yuboring va yo'llarni solishtiring.
- Bashorat (ballsiz): **Quloqchin tugasa, agent nima qiladi?** · Baribir band qilishga urinadi · «Yo'q» deb to'xtaydi · Boshqa sovg'a qidiradi
- Vizual: chapda kichik chat — oddiy AI javobi; o'ngda xarita, Database jadvalida `Quloqchin · 12 dona` va kalit: **omborda bor ↔ tugadi**.
- **Harakat → Vizual o'zgarish:** «Yuborish» (omborda bor) → keyin kalit «tugadi» → yana «Yuborish»; har safar ikkala AI ishlaydi:
  - oddiy AI: chatda **o'sha** maslahat pufagi qayta chiqadi (so'zma-so'z bir xil);
  - agent: konvert xaritada yuradi, har qadamda hisoblagich o'sadi. «Bor» — Mahsulot qidirish → Kuryerdan so'rash → Buyurtma yozish (3 qadam).
    «Tugadi» — Mahsulot qidirish (Quloqchin · 0 dona, qator qizil) → Mahsulot qidirish (300 ming gacha boshqasi: Powerbank 250 000) → Kuryerdan so'rash →
    Buyurtma yozish (4 qadam); javob: «Quloqchin tugagan. Powerbank 250 000 — bugun 18:00 gacha yetkaziladi, band qildim.»
  Ikki yo'l ham ko'rilgach (2/2): AI tuguni yorlig'i **AI → Agent** bo'ladi, atrofida sikl halqasi paydo bo'ladi.
- Natija qatori: «Taxminingiz: … · bu agent: boshqa sovg'a qidirdi»
- Xulosa: Oddiy AI har safar bir xil maslahat beradi. Agent natijaga qarab keyingi qadamni o'zi tanlaydi. (95)
- Tugma (pastki): Ikki holatni sinang (N/2) → Davom etish
✎ «▶ Ikki yondashuvni ishga tushiring» + 4 matn-qator («1-amal … tayyor») → o'quvchi omborni o'zgartiradi va agent yo'li o'zgaradi (184) · agentning asosiy
belgisi («keyingi qadamni o'zi tanlaydi», v2 eslatmasi) endi ko'rinadi — chiziqli skriptdan farqi (arena 6-savol) · xaritadagi AI tuguni «Agent» yorlig'ini shu yerda, belgisi ko'ringach oladi (T-011)

## 4 · 1-savol  ← QTest (✔ 2-variant)
- Eyebrow: Mashq · 1-savol
- Savol: **Mijoz oddiy AI'ga savol yozdi. AI odatda nima qiladi?**
  1. Asboblar bilan ishni oxirigacha bajaradi
  2. ✔ Bitta javob matnini yozadi va to'xtaydi
  3. Database'ga yangi buyurtmani o'zi yozadi
  4. Savolni agentga uzatib, kutib turadi
- To'g'ri izohi: Oddiy AI javob yozadi, do'kondagi ma'lumotni o'zi o'zgartirmaydi.
- Xato izohlari:
  - 1: Asboblar bilan ishni bajarish — agentning ishi. (47)
  - 3: Database'ga yozish uchun asbob kerak — oddiy AI'da u yo'q. (58)
  - 4: Oddiy AI hech kimni kutmaydi — u alohida ishlaydi. (50)
  - (umumiy): Oddiy AI'da asbob ham, sikl ham yo'q. (37)
✎ uzunlik 54/34/42/43 → 40/39/40/36 · «To'g'ri!» olindi, izoh bir gap · «tool» → «asbob», «baza» → «Database» (1-dars xaritasi nomi)

## 5 · Agent sikli  ← QTushuncha (qayta qurildi)
- Eyebrow: Sikl · Idrok → Qaror → Amal
- Sarlavha: **Har qadamda agentning ichida nima bo'ladi?** (42)
- Mentor: Siklni bot darslaridan bilasiz. Endi Qaror bosqichida asbobni agent o'rniga siz tanlang.
- Vizual: agent tugunidagi sikl halqasi kattalashadi (uch bo'lak, joriysi accent, markazda «aylanish 1/3»); yonida chat va qismlar.
- Uch aylanish (hook voqeasi, «bor» yo'li). Har aylanishda Idrok qatori halqa ostida, Qaror — o'quvchi uchta ulangan asbobdan birini bosadi:
  1. Idrok: «Mijoz 300 ming so'mgacha sovg'a so'radi, bugun.» → to'g'ri: **Mahsulot qidirish** → Amal: «Quloqchin · 300 000 · bor»
  2. Idrok: «Quloqchin bor. Bugun yetadimi — noma'lum.» → to'g'ri: **Kuryerdan so'rash** → Amal: «bugun 18:00 gacha»
  3. Idrok: «Mahsulot bor, yetkazish bor, buyurtma yo'q.» → to'g'ri: **Buyurtma yozish** → Amal: «#1043 band qilindi»
- **Harakat → Vizual o'zgarish:** asbobni bosish → halqada Qaror bo'lagidan Amal bo'lagiga o'tadi, konvert tanlangan chiziq bo'ylab qismga uchadi va natija bilan
  qaytadi; halqa ostida «Maqsadga yetdimi? — Yo'q» → strelka Idrok'ka qaytadi, hisoblagich 1/3 → 2/3. 3-aylanishda «Maqsadga yetdimi? — Ha» → halqa yashil,
  chatga agent javobi tushadi. Noto'g'ri asbob → chiziq qizil silkinadi, bir qator:
  - 1-aylanishda Buyurtma yozish yoki Kuryerdan so'rash: «Avval mahsulot borligini bilish kerak.» (38)
  - 2-aylanishda Buyurtma yozish: «Mijoz «bugun» dedi — avval yetkazishni bilish kerak.» (52)
  - 2–3-aylanishda Mahsulot qidirish: «Mahsulot topilgan — endi uni qayta qidirish shart emas.» (55)
- Xulosa: Har Amaldan keyin agent natijani ko'radi va maqsadga yetguncha yana aylanadi. (77)
- Tugma (pastki): Agent o'rnida tanlang (N/3) → Davom etish
✎ «▶ Siklni boshlash → Keyingi qadam» + 3 matn-karta + «Nega sikl?» kartasi → o'quvchi Qaror bosqichini o'zi bajaradi (184, 5-Modul asbob tanlash naqshi) ·
«Nega sikl?» va «Siz agentga maqsad, asboblar…» bitta xulosaga · «↺ qayta» yorlig'i → halqa strelkasi · Mentor 2 gap

## 6 · Asbobni kim bajaradi  ← QTushuncha (qayta qurildi)
- Eyebrow: Asbob · kim tanlaydi, kim bajaradi
- Sarlavha: **Asbobni kim tanlaydi va kim bajaradi?** (37)
- Mentor: Asbob — backend'dagi oddiy funksiya, uni siz yozasiz. Chaqiruvni o'zingiz yo'naltiring: har qadamda keyingi qismni bosing.
- Bashorat (ballsiz): **Database'ga kim boradi?** · AI modelining o'zi · Backend'dagi funksiya
- Vizual (⛶, yaqin): Agent tuguni ikki bo'lakka ochiladi — **AI modeli** (tanlaydi) va **asbob kodi** (bajaradi); o'ngda Database jadvali; ostida kod kartasi (P-065):
  ```
  async function findProduct(nom) {
    const m = await mahsulotlar.top(nom); // Database
    return { bor: m.soni > 0, narx: m.narx };
  }
  ```
- Yo'l (4 qadam, chapda qadam-ro'yxati 163.8): 1 AI modeli asbobni tanladi · 2 Kod funksiyani ishga tushirdi · 3 Database javob berdi · 4 Natija AI modeliga qaytdi
- **Harakat → Vizual o'zgarish:** AI modeli ustida pufak `findProduct("Quloqchin")` → o'quvchi keyingi qismni bosadi: to'g'ri — konvert o'sha tomonga uchadi,
  kod kartasida joriy qator yonadi (1-qator → 2-qator → 3-qator), Database'da `Quloqchin · 300 000 · 12 dona` qatori yonadi, javob `{ bor: true, narx: 300000 }`
  AI modeliga qaytadi. AI modelidan to'g'ri Database bosilsa — chiziq qizil uziladi, bir qator: «AI Database'ga o'zi bormaydi — funksiyani kod bajaradi.» (55)
- Natija qatori: «Taxminingiz: … · haqiqatda: backend'dagi funksiya»
- Xulosa: AI modeli qaysi asbobni chaqirishni tanlaydi. Uni sizning backend kodingiz bajaradi. (84)
- Tugma (pastki): Chaqiruvni yo'naltiring (N/4) → Davom etish
✎ «Tool nima?» kartasi + «Tool qanday ishlaydi?» → 3 matn-karta (184) → o'quvchi chaqiruvni o'zi yo'naltiradi, 4 qatorli kod (P-065, repo'dagi `asbob()` naqshi) ·
ruxsatnoma o'xshatishi olindi · 2 gapli xulosa («Demak agent yangi tizim emas…») → bitta

## 7 · Agentning o'rni  ← QTushuncha (qayta qurildi)
- Eyebrow: Arxitektura · agentning o'rni
- Sarlavha: **Agentni tizim xaritasida qayerga qo'yasiz?** (42)
- Mentor: 1-darsdagi xaritani eslang: sayt va bot bitta Backend'ga ulanadi. Agent tugunini to'g'ri qismga joylang.
- Vizual: xarita to'liq ko'rinishda — Sayt (Frontend) · Telegram bot → **Backend** → **Database**; tizim chegarasidan tashqarida — **Kuryer xizmati (API)**.
  Chetda **Agent** tuguni (sikl halqasi bilan), asbob-chiziqlarining uchi bo'sh.
- **Harakat → Vizual o'zgarish:** Agentni bosib, qismni bosish →
  - Backend → Backend qutisi kengayib agentni ichiga oladi; agentning to'liq asbob to'plami chiziladi: Mahsulot qidirish · Buyurtmani o'qish · Buyurtma yozish
    (Database) va Kuryerdan so'rash (tashqaridagi Kuryer xizmati); bot → Backend yo'li yonadi va chatdagi xabar konvert bo'lib agentga keladi;
  - Frontend → tugun silkinadi: «Mijoz agentni ko'rmaydi — faqat javobini ko'radi.» (49)
  - Database → «Database ma'lumotni saqlaydi — qaror qilmaydi.» (46)
- Xulosa: Agent backend ichida ishlaydi. Database va tashqi xizmatlarga faqat asboblar orqali yetadi. (91)
- Tugma (pastki): Agentni joylang → Davom etish
✎ uch chip → matn-karta (Baza / Tashqi xizmat / Xabar) → o'quvchi agentni 1-dars xaritasiga o'zi joylaydi, asbob-chiziqlar chiziladi · **«Xabar tool'i» olindi:**
javob mijozga bot orqali qaytadi (1-dars yo'li), repo'dagi agent ham matn qaytaradi — «xabar = asbob» yolg'on model edi (T-045) · xulosa 160 → 91 ·
API 1-darsda o'tilgan — xaritada «Kuryer xizmati · API» yorlig'i yetadi

## 8 · 2-savol  ← QTest (✔ 3-variant)
- Eyebrow: Mashq · 2-savol
- Savol: **Agent do'kon ma'lumotini qanday o'zgartiradi?**
  1. O'zi, hech qanday asbobsiz o'zgartiradi
  2. Faqat javob yozadi, boshqa ish qilmaydi
  3. ✔ Siz bergan asboblar orqali o'zgartiradi
  4. Mijoz ekranini o'zi chizib o'zgartiradi
- To'g'ri izohi: Asbob — siz yozgan funksiya; agent faqat qaysi birini chaqirishni tanlaydi.
- Xato izohlari:
  - 1: Asbobsiz agent tizimga ta'sir qila olmaydi. (43)
  - 2: Faqat javob yozish — oddiy AI'ning ishi. (40)
  - 4: Ekranni frontend chizadi, agent unga tegmaydi. (46)
  - (umumiy): Agentning amali xaritada qaysi chiziqdan o'tganini eslang. (58)
✎ uzunlik 31/41/43/39 → 39/39/39/39 · «asbob» so'zi endi 1 va 3-variantda (faqat to'g'rida emas) · «baza, API, xabar» → «asboblar» (xabar asbobi olindi)

## 9 · Har ishga agent kerakmi?  ← QTushuncha (qayta qurildi)
- Eyebrow: Tanlov · qachon agent
- Sarlavha: **Har ishga agent kerakmi?** (24)
- Mentor: Agentga asbob, sikl va chegara kerak — bu qo'shimcha ish. Ikki vazifani avval oddiy AI'ga bering.
- Ikki vazifa kartasi:
  1. Quloqchin uchun reklama gapi yozish
  2. Mijoz so'rovi: «Powerbank bormi? Ertaga Yunusobodga yetkazasizmi?»
- **Harakat → Vizual o'zgarish:** kartada «Oddiy AI'ga berish» →
  - 1-vazifa: chatda AI pufagi «Quloqchin — sevimli qo'shiqlaringiz uchun.»; xaritada asbob-chiziqlar kulrang qoladi, hisoblagich «asbob: 0»; karta yashil ✓.
  - 2-vazifa: AI pufagi «Omborni ko'ra olmayman — do'konga qo'ng'iroq qiling.»; karta qizil ✗ va «Agentga berish» ochiladi → Mahsulot qidirish va Kuryerdan so'rash
    chiziqlari navbat bilan yonadi, «asbob: 2», javob: «Bor, 250 000. Ertaga 14:00 gacha yetkazamiz — buyurtma beraymi?»; karta yashil.
- Xulosa: Bitta javob yetsa — oddiy AI. Do'kon ma'lumoti va bir necha qadam kerak bo'lsa — agent foydali. (95)
- Tugma (pastki): Ikki vazifani sinang (N/2) → Davom etish
✎ «Oddiy AI yetadi — qachon?» kartasi + ochiladigan «Agent — qachon?» kartasi (184) → o'quvchi ikki vazifani sinab ko'radi, asbob hisoblagichi 0 / 2 ·
xulosa 165 → 95 · «foydali» ehtiyotkor ohangi saqlandi · tarjima misoli bu yerdan olindi (11-savolda turadi, S-008)

## 10 · Oddiy AI yoki agent  ← QTushuncha (saralash mashqi, vizual qo'shildi)
- Eyebrow: Mashq · qaysi biri
- Sarlavha: **Bu vazifaga oddiy AI yetadimi yoki agent kerakmi?** (49)
- Mentor: Vazifalar bittadan keladi. Har birida do'kon ma'lumoti va bir necha qadam kerakmi — shunga qarang.
- Vazifalar (bittadan; kalit tartibi kodda o'zgarmaydi: AI · agent · AI · agent):
  1. Yangi g'ilof uchun 3 ta nom topish — oddiy AI
  2. Kelmagan buyurtmani tekshirish, kuryerdan so'rash, mijozga javob yozish — agent
  3. Quloqchin tavsifidagi imlo xatolarini tuzatish — oddiy AI
  4. Shikoyatni hal qilish: buyurtmani topish, pulni qaytarish, mijozga yozish — agent
- Tugmalar (o'ngda): Oddiy AI · bitta javob | Agent · bir necha qadam
- **Harakat → Vizual o'zgarish:** tanlash → to'g'ri bo'lsa vazifa kartasi xaritaga tushadi: oddiy AI'da — chat pufagi bo'lib; agentda — kerakli chiziqlar bir lahza
  yonadi (2-vazifa: Database + Kuryer xizmati; 4-vazifa: Database, va xaritada birinchi marta **To'lov xizmati** tuguni kulrang, chiziqsiz paydo bo'ladi —
  pul qaytarish uchun hali asbob yo'q).
  Noto'g'ri → karta silkinadi, bir qator:
  - oddiy AI vazifasi agentga: «Bu ishga do'kon ma'lumoti kerak emas — bitta javob yetadi.» (58)
  - agent vazifasi oddiy AI'ga: «Bu ishda Database'ga qarash va bir necha qadam bor.» (51)
- Xulosa (4/4): Agent kerak bo'lgan ikki vazifada ham Database'ga qarash va bir necha qadam bor edi. (84)
- Tugma (pastki): Tanlang (N/4) → Davom etish
✎ umumiy «Qaytadan o'ylang…» → tomonga qarab ikki izoh (≤60) · vazifalar ot-shaklga (§222: «tarjima qil» → «… topish») · 1-vazifa «tarjima» → «3 ta nom»,
3-vazifa «3 ta nom» → «imlo xatolari» (11-savoldagi tarjima mashqda takrorlanmasin) · «Hammasi to'g'ri!» xulosasi → nima o'rganilganini aytadi (T-049)

## 11 · 3-savol  ← QTest (✔ 1-variant)
- Eyebrow: Mashq · 3-savol
- Savol: **Mahsulot tavsifini ruschaga tarjima qilish kerak. Nima yetadi?**
  1. ✔ Oddiy AI — bu bir martalik, aniq ish
  2. Agent — chunki u oddiy AI'dan kuchli
  3. Ikkalasi — natijani solishtirish uchun
  4. Hech biri — bu AI qiladigan ish emas
- To'g'ri izohi: Tarjimaga do'kon ma'lumoti ham, bir necha qadam ham kerak emas.
- Xato izohlari:
  - 2: Bir qadamli ishga agent ortiqcha murakkablik qo'shadi. (54)
  - 3: Ikki yechim — ikki barobar ish, foydasi yo'q. (45)
  - 4: Tarjima — AI eng ko'p qiladigan ishlardan biri. (47)
  - (umumiy): Bu ishga asbob kerakmi — shuni o'ylang. (39)
✎ «har doim» (kafolat iborasi) distraktordan olindi · uzunlik 37/40/43/36 → 36/36/38/36 · savol 14 → 8 so'z (S-001)

## 12 · Agent ishda  ← QTushuncha (CASE: bashorat + qadam-ro'yxati 163.8 + xarita)
- Eyebrow: Hayotiy · agent ishda
- Sarlavha: **Kelmagan buyurtmani agent qanday hal qiladi?** (44)
- Mentor: Mijoz shikoyat yozdi, agent maqsadni oldi. Qadamlarni bosib, xaritani kuzating.
- Bashorat (ballsiz): **Agent birinchi nima qiladi?** · Mijozga uzr yozadi · Buyurtmani Database'dan o'qiydi · Kuryerga xabar yozadi
- Chapda qadam-ro'yxati (yorliqlar `SIKL` dan, o'tgani ✓, joriysi accent):
  1. **Maqsad olinadi** — Mijoz: «Buyurtmam #1042 ikki kundan beri kelmadi.» Maqsad: sababini bilib, aniq javob berish.
  2. **Idrok** — Xabarda raqam bor, buyurtma holati noma'lum.
  3. **Qaror** — Avval holatni bilish kerak → Buyurtmani o'qish.
  4. **Amal** — `getOrder(1042)` → Database: «kuryerga berilgan».
  5. **Idrok · Qaror** — Kuryerda, lekin vaqti noma'lum → Kuryerdan so'rash.
  6. **Amal** — `askCourier(1042)` → Kuryer xizmati: «ertaga 12:00 gacha».
  7. **Maqsadga yetdimi?** — Ha → chatga javob: «Buyurtmangiz ertaga 12:00 gacha yetib boradi.»
- O'ngda xarita (to'liq ko'rinish), har qadamda bitta o'zgarish: 1 chatda mijoz xabari · 2 halqada Idrok yonadi · 3 Qaror, Buyurtmani o'qish chizig'i belgilanadi ·
  4 konvert Database'ga, jadvalda `#1042 · kuryerga berilgan` qatori yonadi · 5 halqa yana Idrok → Qaror, Kuryer chizig'i · 6 konvert Kuryer xizmatiga, javob qaytadi ·
  7 halqa yashil, chatga javob tushadi, ishlatilgan ikki chiziq yashil. Joriy qadam kartasi — xarita ostida bitta qator; «Keyingi qadam» shu karta ostida o'ngda (187).
- **Harakat → Vizual o'zgarish:** «Keyingi qadam» → chapda qadam ✓, xaritada yuqoridagi bitta o'zgarish.
- Natija qatori: «Taxminingiz: … · haqiqatda: buyurtmani Database'dan o'qidi»
- Xulosa: Siz faqat maqsad berdingiz. Qaysi asbobni qachon chaqirishni agent o'zi tanladi. (80)
- Tugma (pastki): Qadamlarni kuzating (N/7) → Davom etish
✎ 7 matn-qator pastga cho'zilardi + «Ishlatilgan tool'lar» kartasi → qadam-ro'yxati + xarita (163.8, pilot 12-ekran naqshi) · bashorat qo'shildi ·
«xabar tool'i» qadami → javob chat orqali qaytadi (7-ekran ✎) · 📨 olindi · yorliqlar 5-Modul nomlarida («Maqsad olinadi», «Maqsadga yetdimi?») ·
`phase` maydoni saqlanadi (e4d4ced saboq'i: yorliq belgidan olinmaydi)

## 13 · Chegara  ← QTushuncha (qayta qurildi)
- Eyebrow: Ehtiyot · chegara
- Sarlavha: **Agent pulni o'zi qaytara olsinmi?** (33)
- Mentor: Agent haqiqiy amal qiladi, demak xatosi ham haqiqiy bo'ladi. Qolgan asboblarni uch guruhga joylang.
- Vizual: xarita to'liq — agentning oltita asbob-chizig'i (`ASBOBLAR`), shulardan ikkitasi yangi: Pul qaytarish (To'lov xizmati) va Buyurtmani o'chirish
  (Database). Chapda uch guruh: **O'zi qiladi** · **Tasdiq bilan** · **Umuman yo'q**. Namuna sifatida Mahsulot qidirish va Buyurtma yozish allaqachon
  «O'zi qiladi»da turadi; o'quvchi qolgan to'rttasini joylaydi: Buyurtmani o'qish · Kuryerdan so'rash · Pul qaytarish · Buyurtmani o'chirish.
- **Harakat → Vizual o'zgarish:** asbobni bosib, guruhni bosish → xaritada o'sha chiziq o'zgaradi: O'zi qiladi — oddiy chiziq; Tasdiq bilan — chiziq o'rtasida
  chizilgan qulf, yonida **Admin** tuguni paydo bo'ladi; Umuman yo'q — chiziq o'chadi, o'rnida uzuq kulrang iz. Noto'g'ri → asbob joyiga qaytadi, bir qator:
  - Pul qaytarish → O'zi qiladi: «Pul ketsa, qaytarib bo'lmaydi — odam tasdig'i kerak.» (52)
  - Buyurtmani o'chirish → O'zi qiladi yoki Tasdiq bilan: «Mijozga yordam uchun o'chirish kerak emas — bermang.» (52)
  - o'qish / so'rash → Umuman yo'q: «Busiz agent mijozga yordam bera olmaydi.» (40)
  - o'qish / so'rash → Tasdiq bilan: «Bu xavfsiz amal — har safar tasdiq shart emas.» (46)
  4/4 da sinov (bir lahza, ballsiz): chatga mijoz «Pulimni qaytaring» deb yozadi → konvert To'lov xizmati chizig'idagi qulfda to'xtaydi, Admin ustida
  «Tasdiqlaysizmi?» pufagi chiqadi.
- Xulosa: Chegara: agent nimani o'zi qiladi, nimani tasdiq bilan, nimani umuman qilmaydi. Buni siz belgilaysiz. (101)
- Qator (xulosadan keyin, kulrang): Inglizcha nomi — guardrail.
- Tugma (pastki): 4 asbobni joylang (N/4) → Davom etish
✎ «Agent backend ichida» kartasi + «Qanday chegara?» → 2 matn-karta (184) → saralash + xarita chiziqlari o'zgaradi · «vakolat chegarasi» → «chegara» (5-Modul) ·
uch daraja 6-dars (PM) bilan bir · 5-Modul «Tasdiq so'rash» va «Odam nazorati» → «Tasdiq bilan» guruhida · 🧾/✋ emoji olindi · «keyingi darslarda uchratasiz» olindi
(6-dars o'zi aytadi)

## 14 · 4-savol  ← QTest (✔ 4-variant)
- Eyebrow: Mashq · 4-savol
- Savol: **Bizning tizimda agent qayerda ishlaydi va nima orqali amal qiladi?**
  1. Frontendda — mijoz uni ko'rib turadi
  2. Database ichida — ma'lumot o'sha yerda
  3. Tizimdan tashqarida — alohida dastur
  4. ✔ Backend'da — siz bergan asboblar orqali
- To'g'ri izohi: Agent tizimning bir qismi va boshqa qismlarga faqat asboblar orqali yetadi.
- Xato izohlari:
  - 1: Mijoz agentni ko'rmaydi — frontend javobni ko'rsatadi. (54)
  - 2: Database saqlaydi; agent unga asbob orqali murojaat qiladi. (59)
  - 3: Agent tizimga ulangan — asboblari shuning isboti. (49)
  - (umumiy): Agentni xaritada qaysi qutiga qo'yganingizni eslang. (52)
✎ uzunlik 45/44/50/41 → 36/38/36/39 · «foydalanuvchi» → «mijoz» (dars bo'yi bitta nom) · izohlar ≤60

## 15 · Agent sikli (final)  ← QTartib
- Eyebrow: Yakuniy · sikl
- Sarlavha: **Agent siklini to'g'ri tartibda yig'ing.** (39)
- Mentor: Mini-do'kon agenti har vazifada shu yo'ldan yuradi. Bo'laklarni bo'sh joylarga qo'ying.
- Bo'laklar (to'g'ri tartibda; ekranda aralash): Maqsad olinadi · Idrok · Qaror · Amal · Maqsadga yetdimi?
- Uyalar: raqam + «bu yerga qo'ying» (tartibni ochmaydi)
- Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang. (56)
- Xulosa (yechilgach): Maqsadga yetmagan bo'lsa, agent yana Idrokdan boshlaydi. (56)
✎ «Maqsad» → «Maqsad olinadi», «Natijani tekshirish» → «Maqsadga yetdimi?» (5-Modul yakuniy tartibi aynan, T-014) · `doneText` + yashil quti — ikki yopilish matni →
bitta xulosa (P-051) · F-1004-10/11 saqlanadi (to'liq kenglik, izoh faqat yechilgach) · `FLOW` id'lari o'zgarmaydi (`loop` — faqat yorliq)

## 16 · Amaliyot  ← amaliyot bloki (173, `ScreenBlok`)
- Eyebrow: Amaliyot · agent repo'da
- Sarlavha: **Agentingizga yangi asbob bering.** (32)
- Mentor: Bot darslaridagi agentingizda ikki asbob bor. Uchinchisini qo'shing: u faqat o'qisin — «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `TelegramBotNest` papkasini oching. Terminalda: `npm run start:dev`. «Telegram bot ulandi» chiqsin.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > `src/api/ai/agent.service.ts` dagi agentga yangi asbob qo'sh: `getOrders` — mijozning oxirgi buyurtmalarini Database'dan o'qiydi (`BuyurtmaService.oxirgilar`).
     > Mijoz «**{mijoz savoli}**» deb yozsa, agent shu asbob bilan javob bersin.
     > Asbob faqat o'qisin: buyurtmani o'zgartirmasin va o'chirmasin. `checkOrder` va `saveOrder` o'zgarmasin.
  3. **Ishga tushirish** — terminal o'zi qayta yukladi, xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telegramda tekshirish** — botingizga o'z savolingizni yozing (masalan, «Oxirgi buyurtmam nima edi?»): bot Database'dagi buyurtmangizni aytadi,
     terminalda `getOrders → …` qatori chiqadi.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - mijoz: Oxirgi buyurtmam nima edi?
  - bot: Oxirgi buyurtmangiz: 2 × Pepperoni, Chilonzor 5-kvartal.
  - terminal: `getOrders → 3 ta buyurtma`
- Hammasi bajarilgach (yashil): Agentingiz yangi asbob oldi: buyurtmalarni o'qiydi, lekin o'zgartirmaydi. (73)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan `git checkout -f dars-6-04-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ v2 «Loyihangiz uchun AI-agentni rejalashtiring» (5 belgilash-bandi, qog'ozda) → repo ustidagi aniq ish (173): 2-ekrandagi «asbob ulansa, AI yangi ish qiladi»
o'quvchining o'z botida · chegara amalda: asbob faqat o'qiydi · reja-topshiriq uyga vazifaga o'tdi · «TOPSHIRIQ» nishoni va «Zo'r!» olindi

## 17 · Natijalar (podium) — o'zgarmaydi (umumiy shablon)
- Faqat `Q_LABELS` 8: «2 — Tool» → «2 — Asbob».

## 18 · Takrorlash  ← QKartochka
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — qolip standarti

| Old tomon | Orqa | Izoh |
|---|---|---|
| Maqsad olgach, keyingi qadamni o'zi tanlab bajaradigan AI qanday ataladi? | AI-agent | Siz bergan asboblar va chegara ichida ishlaydi |
| Oddiy AI savolga odatda nima qiladi? | Bitta javob yozadi va to'xtaydi | Do'kon ma'lumotini o'zi o'zgartirmaydi |
| Agent sikli qaysi uch bosqichdan iborat? | Idrok, Qaror, Amal | Har Amaldan keyin: maqsadga yetdimi? |
| Agent chaqira oladigan funksiya nima deyiladi? | Asbob (tool) | Uni backend'da siz yozasiz |
| Qaysi asbobni chaqirishni kim tanlaydi? | AI modeli | Asbobni esa backend kodi bajaradi |
| AI modeli Database'ga o'zi boradimi? | Yo'q, asbob kodi boradi | AI faqat chaqiruvni tanlaydi |
| Natija o'zgarsa, agent nima qiladi? | Keyingi qadamni qayta tanlaydi | Oddiy AI esa o'sha javobni beradi |
| Maqsadga yetmagan agent nima qiladi? | Yana Idrokdan boshlaydi | Maqsadga yetguncha aylanadi |
| Agentga qaysi uch narsani berasiz? | Maqsad, asboblar, chegara | Chegara inglizcha — guardrail |
| Pul qaytarish asbobi qaysi guruhda? | Tasdiq bilan | Admin tasdiqlamaguncha pul ketmaydi |
| Bizning tizimda agent qayerda ishlaydi? | Backend'da | Mijoz faqat uning javobini ko'radi |
| Matn tarjimasiga agent kerakmi? | Yo'q, oddiy AI yetadi | Keraksiz agent — ortiqcha murakkablik |
✎ «tool» → «asbob», «vakolat chegarasi» → «chegara» · «API tool'i» kartasi → «Natija o'zgarsa» (3-ekran) · «AI modeli Database'ga boradimi» (6-ekran) qo'shildi

## 19 · Yakun  ← QYakun
- Chip: Agent xaritasini o'qiy olasiz
- Sarlavha: **AI-agent — maqsad sari qadam tashlaydigan tizim qismi.** (54)
- Endi siz bilasiz:
  - Oddiy AI bitta javob yozadi; agent maqsadga yetguncha keyingi qadamni o'zi tanlaydi
  - Agent sikli: Idrok → Qaror → Amal → maqsadga yetdimi?
  - Asbob — siz yozgan funksiya: AI modeli tanlaydi, backend kodi bajaradi
  - Agent backend ichida ishlaydi; Database va tashqi xizmatlarga asboblar orqali yetadi
  - Oddiy ishga oddiy AI yetadi; agent chegarasi — o'zi · tasdiq bilan · umuman yo'q
- Uyga vazifa:
  - **Toping** — loyihangizdagi bir necha qadamli bitta vazifa: o'sha agentga nomzod
  - **Asboblar** — unga qaysi 2–3 asbob kerak va har biri tizimning qaysi qismiga ulanadi
  - **Chegara** — har asbobni uch guruhga ajrating: o'zi qiladi, tasdiq bilan, umuman yo'q
- Keyingi dars — **Claude Skills — nima.** AI'ga yozma yo'riqnoma berib, uning ishini aniq belgilashni ko'ramiz.
✎ «Agentning o'rnini tushundingiz» → asl ko'nikma (T-049) · «🚀 Keyingi dars — Claude Skills:» → menyu nomi aynan (DE-205) · 📝/🚀 olindi · uyga vazifa
amaliyotdan ko'chgan reja (repo ishi darsda bajarildi)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom va medal belgisi qoladi (o'yin qatlami), id'lar o'zgarmaydi:
- **Chat vs Agent** — oddiy AI va agent farqini ajratdingiz (4)
- **Tool User** — agent asboblar orqali ishlashini bildingiz (8)
- **Right Place** — agent tizimning qaysi qismida ishlashini bildingiz (14)
- **Agent Loop** — agent siklini to'g'ri tartibda yig'dingiz (15)

**Qisqa takrorlash oynalari (5)** — belgi emoji emas: raqam yoki koddan bitta qator (S-026):
1. (4) **Oddiy AI va agent:** `1` Oddiy AI bitta javob yozadi va to'xtaydi. · `2` Agent maqsadga yetguncha keyingi qadamni o'zi tanlaydi. ·
   `findProduct()` Asbob bilan agent do'kon ma'lumotini o'qiydi va o'zgartiradi. · Sinfga savol: Oddiy AI va agentning asosiy farqi nima?
2. (8) **Asbob — siz yozgan funksiya:** `findProduct()` Asbob — backend'dagi oddiy funksiya. · `2` AI modeli tanlaydi, kod bajaradi. ·
   `3` Agent faqat siz bergan asboblar orqali amal qiladi. · Sinfga savol: Agent do'kon ma'lumotini qanday o'zgartiradi?
3. (11) **Qachon oddiy AI, qachon agent:** `1` Bitta javobli ish — oddiy AI yetadi. · `2` Do'kon ma'lumoti va bir necha qadam — agent. ·
   `3` Keraksiz agent — ortiqcha murakkablik. · Sinfga savol: Nega har ishga agent kerak emas?
4. (14) **Agent — backend qismi:** `1` Agent backend ichida ishlaydi. · `getOrder()` Database va tashqi xizmatlarga asboblar orqali yetadi. ·
   `3` Mijoz faqat javobni ko'radi. · Sinfga savol: Agent tizimning qaysi qismida ishlaydi?
5. (15) **Agent sikli:** `1` Maqsad olinadi. · `2` Idrok → Qaror → Amal. · `3` Maqsadga yetdimi? Yo'q bo'lsa — yana Idrok.
   (chizma: Maqsad olinadi → Idrok → Qaror → Amal → Maqsadga yetdimi?) · Sinfga savol: Agent bitta amaldan keyin nima qiladi?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi: 0·2·1·0·3·3·1·1·0·2·3·2):**
1. Oddiy AI va agentning asosiy farqi nima? ✔ Agent qadamlarni o'zi tanlab bajaradi · Agent chiroyliroq va odobliroq yozadi · Oddiy AI har safar agentdan tezroq ishlaydi · Ular orasida hech qanday farq yo'q
2. Agent sikli qanday nomlanadi? Kirish → ishlov → chiqish · Boshlash → kutish → tugatish · ✔ Idrok → Qaror → Amal · Savol → javob → to'xtash
3. Asbob (tool) nima? Agentning dasturdagi laqabi · ✔ Agent chaqira oladigan funksiya · Do'kondagi mahsulotlar ro'yxati · AI'ning telefon raqami
4. Agent buyurtmani Database'dan o'qishi uchun nima kerak? ✔ Buyurtmani o'qiydigan asbob · Mijozning kirish paroli · Do'kon ekranining surati · Tezroq internet aloqasi
5. Bir martalik aniq ishga (masalan, tarjima) nima yetadi? Bunga ham albatta agent kerak · Hech biri bunga mos kelmaydi · AI va agentni birga ishlatish · ✔ Oddiy AI'ning o'zi yetadi
6. Bir necha qadam va asbob kerak bo'lgan ishga nima mos? Bitta javobli oddiy AI · Oddiy chiziqli skript · Faqat frontend qismi · ✔ Maqsad olgan AI-agent
7. Bizning tizimda agent qayerda ishlaydi? Frontendda, mijoz ko'radigan joyda · ✔ Backend ichida, server tomonida · Database ichida, jadval yonida · Tizimdan butunlay tashqarida
8. Agent do'kon ma'lumotini nima orqali o'zgartiradi? O'zi, hech qanday kodsiz · ✔ Siz bergan asboblar orqali · Faqat javob matni orqali · Mijoz ekranini o'zi chizib
9. Nega agentga chegara kerak? ✔ Uning amallari haqiqiy, xatosi ham · U juda sekin ishlaydi va kuttiradi · U juda ko'p xotira egallaydi · Aslida chegara umuman kerak emas
10. Agentga ketma-ket bir necha qadam qilishni nima beradi? Juda katta xotira hajmi · Chiroyli zamonaviy interfeys · ✔ Maqsadgacha aylanadigan sikl · Juda tez internet aloqasi
11. Oddiy ishga agent qo'yish nimaga olib keladi? Eng to'g'ri va tejamli yechimga · Vaqtni ikki barobar tejashga · Tizim tezroq ishlashiga · ✔ Ortiqcha murakkablikka
12. Agent siklining to'g'ri tartibi qanday? Amal → Idrok → Qaror → yana Amal · Qaror → Amal → Idrok → yana Qaror · ✔ Idrok → Qaror → Amal → yana Idrok · Idrok → Amal → Qaror → yana Idrok
✎ «tool» → «asbob», «vakolat chegarasi» → «chegara» · 1, 7, 9, 10-savolda to'g'ri javob eng uzun edi — tenglashtirildi · 4-savol «Ma'lumotlar bazasiga so'rov» →
asbob · 11-savol «nima deyiladi» → «nimaga olib keladi» · 12-savol 5 bo'lakli («natija») → 5-Modul arena shakli («→ yana Idrok»)

**Fon so'zlari** (arena kapsulasi `QZ_BG_SHAPES`, R-008; uz, ru — kod bosqichida): agent · idrok · qaror · amal · asbob · maqsad · chegara · sikl · backend ·
Database · tool · guardrail. Inglizcha `perceive / decide / act / goal` → o'zbekcha. Emoji tokenlari — arena qatlami (o'zgarmaydi).
Uyga vazifa banneri (`HW_TOKENS`): amaliyot · loyiha · mashq · natija — o'zgarmaydi.

---

## B. Kod bosqichida (KOD)
1. **`AGENT_XARITA` + `AgentMap`** — bitta manba (180): tugunlar (chat, AI/Agent + sikl halqasi, Database jadvali, Kuryer xizmati, To'lov xizmati, Admin), asbob-chiziq
   holatlari (yo'q · kulrang · oqim · yashil · qulf · uzuq iz), konvert (1-dars `SysMap` naqshi, `reduced-motion` — sakrash), ikki ko'rinish (yaqin / to'liq).
   1-darsning chizilgan belgilari (server · baza · AI · chat) aynan olinadi. 0, 1, 2, 3, 5, 6, 7, 9, 10, 12, 13-ekranlar shundan o'qiydi.
2. **`ASBOBLAR`** — 6 asbob (jadval yuqorida): o'zbekcha nom, kod nomi, qism, 13-ekran guruhi. `TOOLS`, `TOOL_FLOW`, `VS_ROWS` o'rniga.
3. **`SIKL`** — 5-Modul `CYCLE` aynan (`goal · perceive · decide · act · check`); 5, 12, 15-ekran va 5-recap shundan (P-063). `FLOW` id'lari o'zgarmaydi,
   faqat yorliq: `goal` → «Maqsad olinadi», `loop` → «Maqsadga yetdimi?». `ENGINE`, `CASE_PHASE` shu manbaga ulanadi.
4. Qolip turlari: 0 `QKirish` · 1 `QReja` · 2, 3, 5, 6, 7, 9, 10, 12, 13 `QTushuncha` (`zoom` + `tugadi`) · 4, 8, 11, 14 `QTest` (`QuestionScreen` mantig'i,
   `INLINE_KEYS` o'zgarmaydi) · 15 `QTartib` · 16 `ScreenBlok` (173) · 18 `QKartochka` · 19 `QYakun`.
5. Bashorat (2, 3, 6, 12) — ballsiz, `onAnswer` ga kirmaydi; natija qatori `QTaxmin`.
6. 3-ekran: `AG` massivi va «1-amal / tayyor» yorliqlari olinadi; ombor kaliti + ikki yo'l (3 / 4 qadam).
7. 10-ekran: `TASKS` matni ot-shaklga, `ans` tartibi o'zgarmaydi; xato izohi `ans` ga qarab ikki xil; 4-vazifada To'lov xizmati tuguni paydo bo'ladi.
8. 12-ekran: `CASE_STEPS` 7 qadam (yuqoridagi matn), `phase` maydoni saqlanadi, «Ishlatilgan tool'lar» kartasi olinadi — hisob xaritada.
9. 15-ekran: `doneText` olinadi, bitta `QXulosa`.
10. 16-ekran: `ScreenLivePractice` → `ScreenBlok` (4 qadam, `PromptBox`, kutilgan natija chat + terminal, tail `git checkout -f dars-6-04-done`).
11. `Q_LABELS` 8 → «2 — Asbob» · `ACHIEVEMENTS` desc: «tool'lar» → «asboblar» · `RECAPS` `ic`: emoji → raqam yoki kod qatori (S-026).
12. `QZ_BG_SHAPES`: `perceive / decide / act / goal` → `{uz,ru}` (idrok/восприятие …) — R-008.
13. ru (6-RU bosqichi): Восприятие → Решение → Действие → Цель достигнута? · asbob = инструмент · chegara = ограничение (5-Modul ru aynan; hozirgi
    «рамки полномочий» → «ограничение»).
14. Darvozalar: `npm run gates -- src/6-Modull/AgentArchitectureLesson.jsx` 12/12 · `lint:olchov` 0 warn · `lint:emoji` qolip 0 · `lint-qolip` (q15–q21) 0 ·
    surat 1280 + 393.

## C. Repo (REPO) — `TelegramBotNest`
1. Teg `dars-6-04-start` = `dars-10-done` (`3eb3333`).
2. `src/api/ai/agent.service.ts`: `ASBOBLAR` ga `getOrders` (description: «Mijozning oxirgi buyurtmalarini bazadan o'qiydi», parametrsiz — `telegramId` `asbob()` dan);
   `asbob()` ichida `this.buyurtmalar.oxirgilar(telegramId)` → `{ buyurtmalar: [{ pitsa, manzil }] }`, `console.log('getOrders → N ta buyurtma')`.
3. `MAQSAD` ga qator: mijoz buyurtmalari haqida so'rasa — `getOrders` bilan javob ber; `CHEGARA` ga: `getOrders` faqat o'qiydi.
4. Teg `dars-6-04-done`; README'da 6-Modul 4-dars qatori.

## D. Foydalanuvchi hal qiladigan savollar
1. **«Chegara» nomi:** 5-Modul «chegara» deydi, v3 shunga o'tdi. 6-dars (`PmLesson23.jsx:824`) «4-darsda agentga **vakolat chegarasi** qo'ygan edingiz» —
   u ham «chegara» bo'lsinmi? Tavsiya: **ha** (G4 6-dars MD v3 ga bitta so'z).
2. **«Database» yoki «baza»:** 1-dars xaritasi «Database», 3-dars va 5-Modul «baza». 4-dars xaritasi 1-dars nomini oldi. Tavsiya: modul bo'yi **«Database»** (xarita nomi).
3. **«Xabar» asbobi olindi** (javob bot orqali qaytadi, repo agenti ham matn qaytaradi), o'rniga **To'lov xizmati** (chegara uchun). Tavsiya: **qabul**.
4. **Amaliyot repo'da** (`getOrders`, teglar `dars-6-04-start/done` — G3 naqshida). Tavsiya: **qabul**; aks holda v2 rejasi (qog'ozda) qoladi.

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi — App.jsx bilan mos: m6-03 «Arxitektura patternlari» · m6-05 «Claude Skills — nima» · nom «AI-agent nima» o'zgarmaydi (205).
- [✓] Bitta misol-ip — mini-do'kon boti (hook sovg'a → 2, 3, 5, 6, 9 · case #1042 · chegara — pul qaytarish); metafora yo'q; bitta vizual — agent xaritasi (0–13).
  Amaliyot — AvtoPizza repo (173 namunasi, o'quvchining o'z boti).
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» (2, 3, 5, 6, 7, 9, 10, 12, 13; kirish 0 ham) — matn-karta qolmadi.
- [✓] Sarlavha ≤55 (eng uzuni 54) · Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi · xulosa ≤110 (eng uzuni 101) · hook javobi 88/91 · xato izohi ≤60 (eng uzuni 59).
- [✓] Atamalar 5-Modul `BotAiAgentLesson` bilan bir xil (Idrok · Qaror · Amal · asbob · chegara · Maqsad olinadi · Maqsadga yetdimi?) · siz-forma; vazifalar va
  yorliqlar ot-shaklda; prompt (16) — mashinaga buyruq, sen-forma (T-002).
- [✓] Testlar: uzunlik teng (40/39/40/36 · 39×4 · 36/36/38/36 · 36/38/36/39), «asbob» faqat to'g'rida emas · ✔ o'rni o'zgarmagan (s4=2, s8=3, s11=1, s14=4) ·
  arena 3/3/3/3 o'z o'rnida.
- [✓] Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi, izoh faqat yechilgach.
- [✓] Yuzada emoji yo'q (nishon medali, arena — o'yin qatlami) · kafolat iborasi yo'q (11-savoldagi «har doim» olindi).
- [✓] Ichki kodlar yo'q · tarixiy voqea yo'q · «KOD» 14 band, «REPO» 4 band.
- [✓] Karta T · P · S ko'rildi: T-011 (xaritadagi «Agent» yorlig'i 3-ekranda, belgisi ko'ringach), T-014, T-016/017 (metafora olindi), T-045 (xabar asbobi), T-049, T-052 (AI-bot ko'prigi) ·
  P-010, P-015, P-051, P-052, P-055 (12-ekran), P-063 (`SIKL`), P-064 (bashorat 2, 3, 6, 12), P-065 (6-ekran kodi), P-067 · S-001, S-006, S-008 (tarjima
  takrori olindi), S-010, S-026.
