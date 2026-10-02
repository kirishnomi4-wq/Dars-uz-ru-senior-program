# 6-Modul (LMS: 8-Modul) · 3-dars «Arxitektura patternlari» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/ArchPatternsLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** loyiha 100 ta faylga o'sgan. O'quvchi tugmani bosib ikki papkani solishtiradi: tartibsiz (`kod2.js`, `stuff.js`, `final_ROST.js`) va tartibli (`views/ · controllers/ · models/`), keyin «qaysisida tez ishlaydi?» savoliga javob beradi.
- **Markaziy mexanika:** MVC ning 3 rolini bosib ochadi → so'rov Controller orqali qanday yurishini qadam-baqadam kuzatadi → o'z mini-do'konining qismlarini (React / Nest / PostgreSQL) MVC rollariga joylaydi → monolitni mikroservislarga «bo'ladi» → 3 tizimni monolit/mikroservis deb ajratadi.
- **Asosiy metafora:** bitta idora — View = Peshtoq, Controller = Dispetcher (markaz), Model = Arxiv. Monolit = hamma bo'lim bitta binoda; mikroservis = idoralar mahallasi.
- **Yakun:** so'rov oqimini sudrab yig'adi (So'rov → Controller → Model → View → Foydalanuvchiga), keyin o'z loyihasini bir jumlada ta'riflaydi: «MVC monolit: React (View), Nest (Controller), PostgreSQL (Model)».

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — 100 ta fayl | hook | ikki loyiha tuzilishini ochib, qaysisida tez ishlashini tanlaydi | — |
| 1 | Reja | qoida | dars oxiridagi «bir jumla» + bugungi 4 qadam | — |
| 2 | Pattern nima | tushuncha | ta'rifni o'qiydi, «Hayotdan misol?» ni bosadi | — |
| 3 | MVC — 3 rol | tushuncha | View / Controller / Model ni bosib ochadi | — |
| 4 | 1-savol | test | ko'rinadigan qism qaysi rol | ✅ |
| 5 | MVC oqimi | animatsiya | so'rovni 5 qadamda Controller orqali kuzatadi | — |
| 6 | Sizning do'kon — MVC | moslash (challenge) | Frontend / Backend / PostgreSQL ni rolga joylaydi | — (nishon) |
| 7 | Nega pattern | tushuncha | 4 foydani bosib ochadi | — |
| 8 | 2-savol | test | PostgreSQL qaysi rol | ✅ |
| 9 | Monolit | tushuncha | plus/minusni ochadi | — |
| 10 | Mikroservis | tushuncha | monolitni 4 xizmatga bo'ladi, plus/minus | — |
| 11 | 3-savol | test | kichik loyiha — monolitmi, mikroservismi | ✅ |
| 12 | Pattern topish | case (challenge) | 3 tizimni monolit/mikroservis deb ajratadi | — (nishon) |
| 13 | Bir jumlada ta'riflang | tushuncha | patternsiz vs pattern bilan tavsifni solishtiradi | — |
| 14 | 4-savol | test | million foydalanuvchi — qaysi pattern | ✅ |
| 15 | So'rov oqimini yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · Loyiha | praktika | o'z loyihasini pattern bilan ta'riflaydi (AI yordamchida) | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta (4, 8, 11, 14, 15-ekranlar); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
pattern (sinab ko'rilgan andoza) · MVC · View = Peshtoq = ko'rinish · Controller = Dispetcher = markaz = boshqaruvchi ·
Model = Arxiv = ma'lumot · idora · so'rov oqimi · monolit (bitta bino / bitta katta ilova) · mikroservis (idoralar mahallasi / mustaqil xizmat) ·
miqyoslash · deploy · ko'lam · «ortiqcha murakkablashtirmang» · arxitektura tili

---

## 0 · Kirish — 100 ta fayl  `[683]`
- Eyebrow: Dars · kirish
- Sarlavha: **Loyiha o'sdi — 100 ta fayl. Yangi dasturchi qayerdan boshlaydi?**
- Mentor: Komponentlar bor (o'tgan darsda ko'rdik), lekin ular qanday tartiblanadi? Tugmani bosing — ikki xil loyiha tuzilishini solishtiring.
- Tugma: ▶ Ikki loyihani ko'rish → ✓ Solishtirildi
- Bosilgach — ikki papka:
  - ❌ tartibsiz/ : `index.js` · `kod2.js` · `stuff.js` · `final_ROST.js` · `yana_bir.js …`
  - ✅ tartibli/ (pattern) : `views/` // ko'rinish · `controllers/` // mantiq · `models/` // ma'lumot
- Savol: **Qaysisida tez ishlaydi?** (tugma bosilmaguncha xira)
  - Tartibsizda — fayl ko'p bo'lsa, kuchli loyiha
  - Tartibli (pattern)da — har narsa o'z joyida, darrov topadi
  - Farqi yo'q — ikkalasi bir xil
- Javobdan keyin (qaysi tanlansa ham): Aynan! **Pattern** — kodni tashkil qilishning sinab ko'rilgan andozasi. Har narsa o'z joyida. Bugun eng mashhur pattern — **MVC** va tizim ko'lamlari (monolit/mikroservis) bilan tanishamiz.
- Tugma: Davom etish

## 1 · Reja  `[732]`
- Eyebrow: Reja
- Sarlavha: **Tizimga nom beramiz: arxitektura patterni.**
- Mentor: O'tgan darsda komponentlarni ko'rdingiz. Bugun ularni tashkil qilishning **tayyor andoza**larini o'rganamiz. Yaxshi xabar: siz allaqachon pattern bo'yicha qurgansiz — faqat uning nomini bilmagansiz.
- Blok: dars oxirida — siz shuni ayta olasiz
  - «Mening loyiham — **MVC monolit**: React (View), Nest (Controller), PostgreSQL (Model).» — bir jumla, hamma tushunadi.
  - Pattern = tizimingizning «nomi». 100 faylni tushuntirish o'rniga — bitta tanish so'z.
- Bugungi 4 qadam:
  1. MVC — 3 rol: Model, View, Controller · *mvc*
  2. Sizning mini-do'koningiz allaqachon MVC · *moslash*
  3. Monolit vs mikroservis — qachon qaysi · *ko'lam*
  4. Tizimni pattern bilan ta'riflash · *til*
- Tugmalar (telefonda): 4 qadamni ko'rish / ↩ Natijani ko'rish · Boshlaymiz →

## 2 · Pattern nima  `[768]`
- Eyebrow: Tushuncha · pattern
- Sarlavha: **Pattern — sinab ko'rilgan andoza.**
- Mentor: Pattern — bu ko'p marta sinab ko'rilgan, ishlaydigan tashkil qilish usuli. Uni o'zingiz ixtiro qilmaysiz — tayyorini olasiz. Tugmani bosing.
- Karta: 🧩 **Pattern nima?** — Tez-tez uchraydigan muammoga tayyor, sinab ko'rilgan yechim andozasi. «Bu vaziyatda odamlar shunday qiladi» degan kelishuv.
- Tugma: Hayotdan misol? → ✓ Ko'rdingiz
- Bosilgach — 3 misol:
  - 🗺️ **Shaharsozlikda:** tayyor mahalla rejasi — har mahallani noldan chizmaysiz
  - 🏠 **Qurilishda:** tayyor chizma — har uyni qaytadan loyihalamaysiz
  - 💻 **Kodda:** MVC — kodni qanday bo'lish bo'yicha tayyor andoza
- Xulosa: Pattern = umumiy til. «MVC» desangiz — dunyodagi har bir dasturchi nimani nazarda tutganingizni tushunadi.
- Tugma: Misolni ko'ring → Davom etish

## 3 · MVC — 3 rol  `[800]`
- Eyebrow: Pattern · MVC
- Sarlavha: **MVC — bitta idoraning 3 roli.**
- Mentor: MVC = Model, View, Controller. Bitta idorani tasavvur qiling: **View** — Peshtoq, **Controller** — Dispetcher (markaz), **Model** — Arxiv. Har rolni bosing.
- Rollar (bosilganda ochiladi):
  - **View** · Ko'rinish — Mijoz ko'radigan qism — sahifa, tugmalar, rasmlar. Frontend (React). Faqat ko'rsatadi, qaror qilmaydi. · 🏙️ Idorada: **Peshtoq (mijoz ko'radi)**
  - **Controller** · Boshqaruvchi — So'rovni qabul qiladi, nima qilishni hal qiladi, Model va Viewni bog'laydi. Backend mantiqi — markaz. · 🏙️ Idorada: **Dispetcher (markazda yo'naltiradi)**
  - **Model** · Ma'lumot — Ma'lumot va qoidalar — DB, biznes-mantiq. Saqlaydi va beradi (Database). · 🏙️ Idorada: **Arxiv (saqlaydi)**
- Xulosa: Uch rol bir-birini to'ldiradi: View ko'rsatadi, Controller boshqaradi, Model saqlaydi. Bu — eng mashhur arxitektura patterni.
- Tugma: 3 rolni oching (0/3) → Davom etish

## 4 · 1-savol ✅  `[835]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **MVC'da foydalanuvchi ko'radigan qism qaysi rol?**
  - Controller — so'rovni boshqaradi
  - Model — ma'lumotni saqlaydi
  - Hech qaysi — MVC'ga kirmaydi
  - ✔ View — ko'rinish qatlami (frontend)
- To'g'ri: To'g'ri! View — bu ko'rinish: mijoz ko'radigan sahifa, tugmalar, rasmlar (frontend). Idorada — Peshtoq. U faqat ko'rsatadi.
- Xato izohlari:
  - Controller boshqaradi (Dispetcher), lekin mijozga ko'rinmaydi. Ko'rinadigan qism — View.
  - Model — ma'lumot (Arxiv). Ko'rinadigan qism emas. Bu — View.
  - Aksincha — ko'rinadigan qism aynan MVC'ning V (View) qismi.
  - (umumiy) Ko'rinadigan qism — View.

## 5 · MVC oqimi (animatsiya)  `[855]`
- Eyebrow: Animatsiya · MVC oqimi
- Sarlavha: **Controller — markazda turadi va hammasini bog'laydi.**
- Mentor: MVC'da so'rov to'g'ridan-to'g'ri Model'ga bormaydi — har doim **Controller orqali** o'tadi. Tugmani bosib, so'rov rollar orasida qanday harakatlanishini kuzating.
- Sxema: 🖥️ View *ko'rinish* — 🎮 Controller *markaz* — 🗄️ Model *ma'lumot*
- Qadamlar (▶ So'rovni yuborish → Keyingi qadam → … → ✓ Oqim tugadi):
  1. So'rov keldi → Controller qabul qildi. U — markaz.
  2. Controller Model'dan ma'lumot so'radi (bazaga murojaat).
  3. Model ma'lumotni qaytardi → Controller qabul qildi.
  4. Controller View'ga «buni ko'rsat» dedi.
  5. View foydalanuvchiga chiroyli natijani ko'rsatdi ✨
- Xulosa: Ko'rdingizmi? View ↔ Controller ↔ Model. Controller — vositachi: View hech qachon to'g'ridan Model bilan gaplashmaydi. Shuning uchun kod tartibli.
- Tugma: Oqimni kuzating (1/5) → Davom etish

## 6 · Sizning do'kon — MVC (challenge, nishon)  `[892]`
- Eyebrow: Moslash · sizning do'kon
- Sarlavha: **Sizning mini-do'koningiz allaqachon MVC!**
- Mentor: O'tgan darsdagi komponentlaringiz aynan MVC rollariga to'g'ri keladi. Har bir komponentni mos rolga joylang — o'zingiz ko'rasiz.
- Karta: 🧩 Komponent 1/3 … 3/3:
  1. 🖥️ Frontend (React) — mijoz ko'radigan sahifa → View
  2. ⚙️ Backend (Nest) — so'rovni boshqaradi → Controller
  3. 🗄️ PostgreSQL — ma'lumot saqlanadi → Model
- Tugmalar: qaysi MVC roli? — View · Controller · Model
- Nishon sharti: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- Xato: Bu rol mos emas — komponent nima qilishini o'ylang va qayta tanlang.
- Muvaffaqiyat: Hammasi to'g'ri! Frontend = View, Backend = Controller, Database = Model. Sizning do'koningiz — **MVC ilova**. Nomini endi bilasiz!
- Tugma: Moslang (0/3) → Davom etish

## 7 · Nega pattern  `[935]`
- Eyebrow: Foyda · nega pattern
- Sarlavha: **Nega pattern bo'yicha qurish foydali?**
- Mentor: Pattern shunchaki «chiroyli» emas — u amaliy foyda beradi. Har foydani bosing.
- Foydalar (bosilganda):
  - **Tartib** — Har narsa o'z joyida — qaysi kod qayerda ekanini bilasiz.
  - **Jamoa** — Bir kishi Viewda, boshqasi Modelda ishlaydi — bir-biriga xalaqit bermaydi.
  - **AI tushunadi** — AI'ga «MVC bo'yicha controller yoz» desangiz — darrov to'g'ri joyga yozadi.
  - **Bug topish** — Ma'lumot xato — Modelga qara. Ko'rinish buzuq — Viewga. Tez topasiz.
- Xulosa: Pattern — tartib, jamoaviy ish, AI bilan muloqot va tez bug topish demak. Shuning uchun haqiqiy loyihalar doim pattern bo'yicha quriladi.
- Tugma: 4 foydani ko'ring (0/4) → Davom etish

## 8 · 2-savol ✅  `[973]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **PostgreSQL bazasi MVC'da qaysi rol?**
  - View — chunki ma'lumotni ko'rsatadi
  - ✔ Model — ma'lumot va uning qoidalari
  - Controller — boshqaruvchi mantiq
  - Hech qaysi — baza MVC'dan tashqarida
- To'g'ri: To'g'ri! Database — bu Model: ma'lumot qayerda saqlanadi va qanday qoidalar bilan ishlanadi. Idorada — Arxiv. View ko'rsatadi, Controller boshqaradi, Model saqlaydi.
- Xato izohlari:
  - Baza ma'lumotni ko'rsatmaydi — saqlaydi. Ko'rsatish View ishi. Baza = Model.
  - Controller boshqaruvchi mantiq (Dispetcher). Baza esa ma'lumot arxivi — Model.
  - Aksincha — baza aynan MVC'ning M (Model) qismi.
  - (umumiy) Database = Model.

## 9 · Monolit  `[993]`
- Eyebrow: Ko'lam · monolit
- Sarlavha: **Monolit — hammasi bitta katta ilovada.**
- Mentor: MVC — kodni ICHKARIDA tashkil qiladi. Monolit/mikroservis esa tizimning KO'LAMI haqida. Monolit — hamma bo'lim bitta binoda joylashgan katta idora. Tugmani bosing.
- Rasm-blok: 🏢 mini-do'kon — Frontend + Backend + Baza — hammasi bitta loyihada
- Tugma: Plus va minusi? → ✓ Ko'rdingiz
- Bosilgach:
  - Aksariyat loyihalar monolitdan boshlanadi — bu normal va to'g'ri.
  - ✅ **Plus:** sodda, tez boshlanadi, bitta joyda deploy, oson tushuniladi.
  - ⚠️ **Minus:** juda kattalashsa og'irlashadi; bitta xato butun tizimni to'xtatishi mumkin.
- Tugma: Plus/minusni ko'ring → Davom etish

## 10 · Mikroservis  `[1024]`
- Eyebrow: Ko'lam · mikroservis
- Sarlavha: **Mikroservis — ko'p mustaqil kichik xizmat.**
- Mentor: Tizim juda kattalashganda, uni mustaqil bo'laklarga ajratamiz — har biri o'z ishini qiladi (idoralar mahallasi kabi). Tugmani bosib, monolit qanday bo'linishini ko'ring.
- Rasm-blok (oldin): 🏢 Bitta katta ilova — hammasi birga
- Tugma: ✂️ Mikroservislarga bo'lish → ✓ Bo'lindi
- Bo'lingach: Mahsulotlar · To'lov · Yetkazish · Foydalanuvchi — har birida «mustaqil»
  - Har xizmat alohida ishlaydi, alohida deploy bo'ladi, alohida jamoa qaraydi.
  - ✅ **Plus:** mustaqil miqyoslash; bitta xato faqat o'z xizmatini to'xtatadi; katta jamolar alohida ishlaydi.
  - ⚠️ **Minus:** murakkab; ko'p harakatlanuvchi qism; kichik loyihaga ortiqcha.
- Tugma: Monolitni bo'ling → Davom etish

## 11 · 3-savol ✅  `[1059]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Yangi, kichik loyiha, kichik jamoa. Monolit yoki mikroservis?**
  - ✔ Monolit — sodda va tez; keyin bo'lish mumkin
  - Mikroservis — zamonaviyroq va har doim yaxshiroq
  - Ikkalasini birga — har ehtimolga qarshi ishonch
  - Farqi yo'q — tasodifiy tanlasa ham bo'ladi
- To'g'ri: To'g'ri! Kichik loyihaga monolit — sodda, tez va arzon. Mikroservis murakkablik qo'shadi, u faqat tizim juda kattalashganda kerak. «Ortiqcha murakkablashtirmang» — dasturchilar qoidasi.
- Xato izohlari:
  - Mikroservis har doim yaxshi emas — u kichik loyihaga ortiqcha murakkablik. Avval monolit.
  - Ikkalasini birga qilish — eng murakkab va keraksiz yo'l. Soddadan boshlang.
  - Farqi bor: kichik loyihaga monolit aniq to'g'ri tanlov. Soddalik g'olib.
  - (umumiy) Kichik loyihaga monolit — soddadan boshlang.

## 12 · Pattern topish (case, challenge, nishon)  `[1079]`
- Eyebrow: Hayotiy · pattern topish
- Sarlavha: **Tizimni tasvirga qarab tasniflang.**
- Mentor: Mana arxitektorning ishi: tizim tasvirini o'qib, qaysi pattern ekanini aytish. Har tizimni o'qing va monolit yoki mikroservis ekanini tanlang.
- Karta: 🧩 Tizim 1/3 … 3/3:
  1. Kichik mini-do'kon: React frontend + bitta Nest backend + bitta baza, hammasi bitta loyihada. → Monolit
  2. Ulkan marketplace: to'lov, qidiruv, yetkazib berish — har biri alohida, mustaqil xizmat. → Mikroservis
  3. Yangi startap MVP: tezda bitta ishlaydigan ilova kerak, jamoa kichik. → Monolit
- Tugmalar: qaysi pattern? — 🏢 Monolit · bitta katta ilova · 🧩 Mikroservis · ko'p mustaqil xizmat
- Nishon sharti: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- Xato: Qaytadan o'ylang: bitta loyihami yoki ko'p mustaqil xizmatmi?
- Muvaffaqiyat: Barchasi to'g'ri! Endi tizim tasvirini o'qib, uning patternini ayta olasiz — bu arxitektor mahorati.
- Tugma: Tasniflang (0/3) → Davom etish

## 13 · Bir jumlada ta'riflang  `[1119]`
- Eyebrow: Mahorat · til
- Sarlavha: **Tizimingizni bir jumlada ta'riflang.**
- Mentor: Pattern — umumiy til. Tizimingizni 100 fayl orqali emas, bir nechta tanish so'z bilan tushuntirasiz. Tugmani bosing.
- Karta: 🙈 **Patternsiz** — «Bu yerda fayl bor, u boshqasini chaqiradi, keyin bazaga... » — uzoq, chalkash.
- Tugma: Pattern bilan-chi? → ✓ Ko'rdingiz
- Bosilgach: 🎯 PATTERN BILAN — «MVC monolit: React (View), Nest (Controller), PostgreSQL (Model).» → Bir jumla. Har bir dasturchi va AI darrov tushunadi. Mana arxitektura tili.
- Xulosa: Yangi loyiha boshlashdan oldin AI'ga «MVC monolit qur» desangiz — u to'g'ri tuzilishni darrov yaratadi.
- Tugma: Farqni ko'ring → Davom etish

## 14 · 4-savol ✅  `[1151]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Million foydalanuvchi; har qism alohida miqyoslanishi kerak. Qaysi pattern?**
  - Monolit — bunday ko'lamda ham eng yaxshi
  - Hech qanday pattern bu yerda kerak emas
  - ✔ Mikroservis — har xizmat alohida miqyoslanadi
  - MVC yetarli — ko'lam bu yerda muhim emas
- To'g'ri: To'g'ri! Katta ko'lamda, har qism alohida yuklanganda mikroservis kerak: to'lov xizmatini alohida kuchaytirasiz, qidiruvni alohida. Mustaqillik — mikroservisning asosiy kuchi.
- Xato izohlari:
  - Monolit kichikda yaxshi, lekin million foydalanuvchi va mustaqil miqyoslashda u og'irlashadi. Bu yerda mikroservis.
  - Aksincha — bunday katta tizimda pattern juda muhim. Mikroservis kerak.
  - MVC kodni ichkarida tashkil qiladi, lekin ko'lam (miqyoslash) masalasini hal qilmaydi. Bu yerda mikroservis.
  - (umumiy) Katta, mustaqil miqyoslash — mikroservis.

## 15 · So'rov oqimini yig'ing ✅ (final, nishon)  `[1248]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: MVC so'rov oqimini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang. Eslang: so'rov **Dispetcher (Controller)** orqali o'tadi — to'g'ridan-to'g'ri Arxivga bormaydi.
- Bo'laklar: So'rov · Controller · Model · View · Foydalanuvchiga
- Uyachalar: birinchi nima keladi · keyin kim qabul qiladi · keyin qayerdan ma'lumot · keyin qayerda ko'rsatiladi · eng oxiri nima
- To'g'ri (bo'lak ostida): ✓ To'g'ri: So'rov → Controller → Model → View → Foydalanuvchiga.
- To'g'ri (pastda): ✓ Oqim tayyor: **So'rov → Controller → Model → View → Foydalanuvchiga**. Mana MVC patternining ishlash tartibi.
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang. So'rov avval Controller'ga boradi. · (bo'laklar tugaganda) Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Havola (xato qilgan bo'lsa): 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Oqimni yig'ing → Davom etish

## 16 · Amaliyot · Loyiha  `[2067]`
- Eyebrow: Amaliyot · Loyiha · joy: «AI yordamchida»
- Sarlavha: **O'z tizimingizni pattern bilan ta'riflang**
- Topshiriq (TOPSHIRIQ): O'z loyihangizni (yoki o'tgan darsdagi mini-do'konni) arxitektura tili bilan bir jumlada ta'riflang. Hali kod yozmaysiz — faqat rejalashtirasiz.
- Bosqichlar — belgilab boring:
  1. Loyihangizni bir jumlada nomlang: `MVC monolit` (yoki mikroservis)
  2. Komponentlarni ajrating: qaysi qism `View` (Peshtoq), qaysi `Controller` (Dispetcher), qaysi `Model` (Arxiv)
  3. Qaror qiling: loyihangizga `monolit` yetadimi yoki `mikroservis` kerakmi — va nega?
  4. Bir band javob yozing: «Mening tizimim — ... chunki ...»
- Tugmalar: Avval bajaring · ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.»

## 17 · Natijalar (podium)  `[1813]`
- Umumiy shablon: Natijalar · «Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.» · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2094]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Pattern nima? | Tayyor andoza | Ko'p marta sinab ko'rilgan kod tartibi |
| MVC qaysi uchta so'zdan tuzilgan? | Model, View, Controller | Uchta rol: Arxiv, Peshtoq, Dispetcher |
| Foydalanuvchi ko'radigan qism qaysi MVC roli? | View | Peshtoq — sahifa, tugmalar, rasmlar |
| So'rovni qabul qilib yo'naltiradigan rol qaysi? | Controller | Dispetcher — markazda turadi |
| Ma'lumot va qoidalar qaysi rolda saqlanadi? | Model | Arxiv — masalan PostgreSQL bazasi |
| MVC'da so'rov avval qayerga boradi? | Controller'ga | Keyin Modeldan ma'lumot olib, Viewda ko'rsatadi |
| View qaror qiladimi? | Yo'q | U faqat tayyor natijani ko'rsatadi |
| Hammasi bitta binodagi ilova qanday ataladi? | Monolit | Bitta katta ilova — sodda, tez va arzon |
| Ko'p mustaqil kichik xizmatdan tuzilgan tizim qanday ataladi? | Mikroservis | Har xizmat alohida ishlaydi va alohida joylashtiriladi |
| Yangi kichik loyihaga qaysi pattern to'g'ri keladi? | Monolit | Soddadan boshlang — keyin bo'lish mumkin |
| Band xizmatga qo'shimcha nusxa qo'shish nima deyiladi? | Scaling | Miqyoslash — filial ochishga o'xshaydi |
| Mikroservisda bitta xizmat xato bersa nima bo'ladi? | Faqat o'sha xizmat to'xtaydi | Qolgan xizmatlar ishlashda davom etadi |

- Tugma: Yakunlash →

## 19 · Yakun  `[2107]`
- Eyebrow: Tayyor · belgi: ✓ Patternlarni o'rgandingiz
- Sarlavha: **Endi tizimni pattern bilan ta'riflaysiz.**
- Endi siz bilasiz:
  - Pattern — kodni tashkil qilishning sinab ko'rilgan andozasi
  - MVC: Model (Arxiv) + View (Peshtoq) + Controller (Dispetcher, markaz)
  - Sizning tizimingiz: Front=View, Back=Controller, DB=Model
  - Monolit — bitta katta ilova (soddadan boshlang); mikroservis — ko'p mustaqil xizmat (katta ko'lam)
  - So'rov oqimi: So'rov → Controller → Model → View → Foydalanuvchiga
- Uyga vazifa (Uyga vazifa · Amaliy topshiriqni bajarish → / 📝 Uyga vazifa):
  - **Ta'riflang** — o'z loyihangizni bir jumlada: qaysi pattern (MVC?), monolitmi yoki mikroservis?
  - **Moslang** — komponentlaringizni Model / View / Controller rollariga ajrating
  - **Qaror** — loyihangizga monolit yetadimi yoki mikroservis kerakmi? Nega?
- 🚀 Keyingi dars — AI-agent: u ham tizimning bir komponenti. Arxitekturada qayerda turadi?
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** City Planner — Peshtoq, Dispetcher, Arxiv rollarini joyladingiz (6-ekran) · One Tower vs District — Monolit va mikroservisni ajratdingiz (12) · Split the Block — Katta yukda binoni bo'lish kerakligini bildingiz (14) · Traffic Route — Oqimni tizdingiz: Peshtoq → Dispetcher → Arxiv (15)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.

**Qisqa takrorlash oynalari (5):**
1. (4) View — Peshtoq (ko'rinish): View — mijoz ko'radigan qism (View — bu **Peshtoq**: sahifa, tugmalar, rasmlar. Frontend.) · Faqat ko'rsatadi (View **qaror qilmaydi** — u faqat natijani chiroyli ko'rsatadi.) · V = View (MVC'ning V harfi — Peshtoq, ya'ni ko'rinish qatlami.) · savol: Foydalanuvchi ko'radigan qism qaysi rol?
2. (8) Model — Arxiv (ma'lumot): Model — ma'lumot arxivi (Model — bu **Arxiv**: ma'lumot qayerda saqlanadi va qanday qoidalar bilan ishlanadi.) · Baza = Model (PostgreSQL kabi baza — aynan **M (Model)** qismi.) · Ko'rsatmaydi — saqlaydi (Model ma'lumotni ko'rsatmaydi (bu View ishi) — u saqlaydi va beradi.) · savol: Ma'lumotlar bazasi qaysi MVC roli?
3. (11) Kichik loyiha — monolit: Soddadan boshlang (Kichik loyihaga **monolit** — sodda, tez va arzon.) · Ortiqcha murakkablashtirmang (Mikroservis kichik loyihaga **ortiqcha murakkablik** qo'shadi.) · Keyin bo'lasiz (Kerak bo'lganda monolitni keyinchalik bo'lish mumkin.) · savol: Kichik jamoa, yangi loyiha — qaysi pattern?
4. (14) Katta yuk — mikroservis: Mustaqil xizmatlar (Katta ko'lamda har qism **alohida miqyoslanadi** — mikroservis.) · Idoralar mahallasi (Har idora mustaqil ishlaydi, alohida deploy bo'ladi.) · Xato tarqalmaydi (Bitta xato faqat **o'z xizmatini** to'xtatadi, butun tizimni emas.) · savol: Million foydalanuvchi, alohida miqyoslash — qaysi pattern?
5. (15) MVC oqimi — tartib muhim: So'rov — Dispetcherga (So'rov **Controller**ga (Dispetcher) keladi — u markaz.) · Dispetcher — Arxivdan (Controller **Model**dan (Arxiv) ma'lumot oladi.) · Peshtoqda ko'rsatadi (Natija **View**da (Peshtoq) foydalanuvchiga ko'rinadi.) · sxema: 🙋 So'rov → 🎮 Controller → 🗄️ Model → 🖥️ View → ✨ Javob · savol: Nega so'rov to'g'ridan Model'ga bormaydi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. MVC'da foydalanuvchi ko'radigan qism (Peshtoq) qaysi rol? ✔ View — ko'rinish qatlami · Controller — boshqaruv qatlami · Model — ma'lumot qatlami · Hech qaysi rol mos emas
2. Ma'lumotlar bazasi (Arxiv) MVC'da qaysi rol? View — ma'lumotni ko'rsatadi · ✔ Model — ma'lumot va qoidalar · Controller — so'rovni boshqaradi · Pattern'dan butunlay tashqarida
3. So'rovni qabul qilib, Model va Viewni bog'laydigan markaz qaysi? View — Peshtoq (ko'rinish) · Model — Arxiv (ma'lumot) · ✔ Controller — Dispetcher (markaz) · Baza — PostgreSQL (saqlash)
4. «Hammasi bitta binoda» — bu qaysi pattern? Mikroservis · Serverless · Peer-to-peer · ✔ Monolit
5. Ko'p mustaqil, alohida deploy bo'ladigan kichik xizmatlar — bu? ✔ Mikroservis · Monolit · MVC · Frontend
6. Kichik yangi loyiha, jamoa kichik. Qaysi pattern to'g'ri? Mikroservis — zamonaviyroq · ✔ Monolit — soddadan boshlang · Ikkalasini birga ishlatish · Hech qaysi pattern kerak emas
7. MVC'da so'rov avval qayerga boradi? To'g'ridan Model'ga · To'g'ridan View'ga · ✔ Controller'ga (markaz) · To'g'ridan bazaga
8. Band idoraga (xizmatga) qo'shimcha nusxa qo'shish nima deyiladi? Refactoring (qayta yozish) · Deploy (joylashtirish) · Debugging (xato tuzatish) · ✔ Scaling (miqyoslash)
9. Pattern nima? ✔ Sinab ko'rilgan tayyor kod andozasi · Yangi bir dasturlash tili nomi · Ma'lumotlar bazasining bir turi · Serverning operatsion tizimi turi
10. Frontend (React) MVC'da qaysi rolga to'g'ri keladi? Controller · ✔ View · Model · Baza
11. Mikroservisning asosiy kuchi nimada? Soddalik va arzonlik · Hammasi bitta katta faylda · ✔ Mustaqil miqyoslash imkoni · Kod yozish shart emasligi
12. Backend (Nest) MVC'da qaysi rol? View — Peshtoq (ko'rinish) · Model — Arxiv (ma'lumot) · Ma'lumotlar bazasi · ✔ Controller — Dispetcher

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«miqyoslash» / «Scaling» izohsiz** — 10, 14-ekran va RECAPS-4 da ishlatiladi, lekin darsda hech qayerda ochib berilmaydi; faqat 18-ekran kartochkasi va viktorina 8-savolida («band xizmatga qo'shimcha nusxa», «filial ochishga o'xshaydi») birinchi marta tushuntiriladi
- **Izohsiz inglizcha/texnik so'zlar:** «deploy» (9, 10, RECAPS-4, viktorina 5), «biznes-mantiq» va «DB» (3-ekran Model roli), «MVP», «marketplace», «startap» (12-ekran), «bug» (7-ekran), viktorina 4 distraktorlari «Serverless», «Peer-to-peer» (darsda yo'q)
- **Bir rolning uch nomi:** Controller = «Boshqaruvchi» (3-ekran yorlig'i) = «Dispetcher» = «markaz»; View = «Ko'rinish» = «Peshtoq»; Model = «Ma'lumot» = «Arxiv» — 3-ekranda ikkalasi yonma-yon turadi. Lug'atda (MATN_ETALONI 142-qator) boshqa darslarda Backend = «Hokimlik» deb berilgan, bu yerda Backend = Controller = «Dispetcher»
- **Metafora aralash:** 3-ekran «bitta idora», 9-ekran «bitta binoda joylashgan katta idora», 10-ekran/RECAPS «idoralar mahallasi», 2-ekran «shaharsozlik/mahalla rejasi», 18-ekran «filial» — idora/bino/mahalla/filial bir ipga bog'lanmagan
- **Test «sotilib» qolishi:** 14-ekranda savol «alohida miqyoslanishi kerak» deydi, to'g'ri javob esa «har xizmat alohida miqyoslanadi» — so'zma-so'z aks-sado; 4-ekranda to'g'ri javob yagona qavsli va eng uzun variant («View — ko'rinish qatlami (frontend)»)
- **0-ekran:** qaysi variant tanlansa ham «Aynan!» chiqadi — «Tartibsizda — fayl ko'p bo'lsa, kuchli loyiha» ni tanlagan o'quvchiga ham
- **«tasniflang» (12-ekran sarlavhasi, tugma «Tasniflang (0/3)»)** — kitobiy so'z; «ajrating» sodda bo'lishi mumkin. «Mahorat · til» (13-ekran eyebrow) ham tushunarsiz
- **Takror:** «MVC monolit: React (View), Nest (Controller), PostgreSQL (Model)» jumlasi 1, 13-ekranlarda va amaliyotda deyarli aynan takrorlanadi; 15-ekranda to'g'ri javob matni ikki marta (bo'lak ostida va pastda) chiqadi
