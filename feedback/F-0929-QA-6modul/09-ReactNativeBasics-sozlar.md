# 6-Modul (LMS: 8-Modul) · 9-dars «React Native — asoslar» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/ReactNativeBasicsLesson.jsx` · 20 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook (0-ekran):** «Web shouingiz tayyor, mijoz uni telefonda istaydi» — o'quvchi «Sahna reflektorlarini yoqing» tugmasini bosadi, telefonda mini-do'kon ekrani yonadi, so'ng «mobil uchun noldan o'rganasizmi?» degan savolga 3 variantdan birini tanlaydi (hamma javob qabul qilinadi).
- **Markaziy mexanika:** web → mobil «tarjima» (div→View, p→Text, CSS→StyleSheet) va telefon sahnasini bo'lakma-bo'lak yig'ish (7-ekran: View + 2 Text; 12-ekran: sarlavha, mahsulot, narx, tugma); Expo Go QR-ni «skanerlash» (10-ekran).
- **Asosiy metafora:** GASTROL — React = ssenariy, telefon = yangi (tirik) sahna, View = sahna-karkas, Text = aktyor replikasi, StyleSheet = kostyum + yorug'lik varag'i, Expo = gastrol furgoni, QR = chipta. Yonida ikkinchi obraz: web = «shisha ortida», mobil = «tirik sahna».
- **Yakun:** gastrol oqimini tartibda sudrab yig'ish (Expo → View/Text → StyleSheet → QR skan → Telefonda), keyin amaliyot (Expo Snack / VS Code'da View + 2 Text), podium, 12 kartochka, xulosa.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — telefon sahnasi | hook | reflektorni yoqadi, «noldan o'rganasizmi?» savoliga javob beradi | — |
| 1 | Reja | qoida | natija (mini-do'kon telefonda) + bugungi 4 qadam | — |
| 2 | RN nima | tushuncha | «Metafora?» tugmasi — 3 ta izoh ochiladi | — |
| 3 | Shisha ↔ tirik | tushuncha | 3 tarjimani bosadi (div→View…), shisha/tirik tugmasini almashtiradi | — |
| 4 | 1-savol | test | React Native nima uchun ishlatiladi | ✅ |
| 5 | View va Text | tushuncha | «Muhim qoida nima?» — matn faqat Text ichida | — |
| 6 | StyleSheet | tushuncha | «CSS'dan farqi?» — 3 ta farq | — |
| 7 | Sahnani yig'ish | markaziy | View + 2 Text qo'shadi, telefonda jonli paydo bo'ladi | — |
| 8 | 2-savol | test | RN'da matn qayerga yoziladi | ✅ |
| 9 | Expo nima | tushuncha | «Nega Expo qulay?» — 3 ta sabab | — |
| 10 | Expo Go QR | tushuncha | QR-chiptani «skanerlaydi» — ilova telefonda ochiladi | — |
| 11 | 3-savol | test | Expo Go nima qiladi | ✅ |
| 12 | To'liq sahna | case | 4 qator kodni birma-bir qo'shadi (sarlavha, mahsulot, narx, tugma) | — |
| 13 | O'sha React | tushuncha | Komponentlar / Props / useState — 3 tasini bosadi | — |
| 14 | 4-savol | test | mobil uchun nimani qo'shimcha o'rganasiz | ✅ |
| 15 | Gastrol oqimi | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · VS Code / Expo Snack | praktika | o'zida View + 2 Text yozadi, «Bajardim» | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
ssenariy (React bilimi) · sahna / telefon sahnasi / tirik sahna · gastrol · gastrol jamoasi (RN) · sahna-karkas (View) ·
aktyor replikasi (Text) · kostyum + yorug'lik varag'i (StyleSheet) · gastrol furgoni (Expo) · QR = chipta (Expo Go) ·
reflektorlar · shisha ortida (web) ↔ tirik sahna (mobil) · mini-do'kon · React tafakkur

---

## 0 · Kirish — telefon sahnasi  `[739]`
- Eyebrow: Dars · kirish
- Sarlavha: **Web shouingiz tayyor. Mijoz uni telefon sahnasida istaydi. Gastrolga chiqa olasizmi?**
- Mentor: Modul 3'da React o'rgandingiz — bu sizning ssenariyingiz. Endi savol: telefon sahnasi uchun hammasini noldan o'rganasizmi? Tugmani bosing — javobni ko'ring.
- Telefon yorlig'i: telefon sahnasi (qorong'u) → React Native bilan — sahnaga chiqdi!
- Telefonda (yongach): mini-do'kon · 📱 Telefon — 2 500 000 · Sotib olish
- Tugma: ▶ Sahna reflektorlarini yoqing → ✓ Ko'rdingiz
- Savol: **Mobil sahna uchun nima qilasiz?** (reflektor yoqilmaguncha xira)
  - Yo'q — mobil butunlay boshqa sahna, noldan o'rganaman
  - Ha — React bilaman; React Native bilan deyarli o'sha bilim bilan sahnaga chiqaman
  - Iloji yo'q — mobil ilova juda qiyin
- Javobdan keyin (qaysi variant bo'lsa ham): Aynan! **React Native** — React bilimingiz bilan haqiqiy telefon ilovasini yasash. Deyarli o'sha ssenariy, faqat sahna komponentlari o'zgaradi (div→View, p→Text). Bugun birinchi ekranni telefon sahnasiga chiqaramiz!
- Tugma: Davom etish

## 1 · Reja  `[781]`
- Eyebrow: Reja
- Sarlavha: **React bilimingizni telefon sahnasiga olib chiqamiz.**
- Mentor: Yaxshi xabar: mobil ilova — bu butunlay yangi dunyo emas. **React tafakkuringiz** — o'sha ssenariy — qoladi; faqat bir nechta yangi sahna komponenti va Expo vositasini o'rganasiz.
- Chap blok: dars oxirida — birinchi ekraningiz telefon sahnasida · telefon: mini-do'kon (RN) — mini-do'kon · 📱 Telefon — 2 500 000 · Sotib olish
- Bugungi 4 qadam:
  1. React Native nima — React bilan mobil sahna · *rn*
  2. Farqi: shisha ortida (web) ↔ tirik sahna (mobil) · *farq*
  3. Expo bilan telefonda ko'rish (QR = chipta) · *expo*
  4. Birinchi ekranni sahnaga yig'ish · *ekran*
- Tugmalar (telefonda): 4 qadamni ko'rish / ↩ Natijani ko'rish · Boshlaymiz →

## 2 · RN nima  `[816]`
- Eyebrow: Tushuncha · RN
- Sarlavha: **React Native — React bilan haqiqiy mobil ilova.**
- Mentor: React Native — bu React bilimi bilan iOS va Android uchun **haqiqiy** (web-sayt emas) ilova yasash. Bitta ssenariy — ikki sahna. Tugmani bosing.
- Blok: 📱 **React Native nima?** — React'ning «gastrol jamoasi». Siz React komponentlari yozasiz, ular telefonda **haqiqiy mobil ilova** bo'lib ishlaydi (iOS + Android).
- Tugma: Metafora? → ✓ Ko'rdingiz
- Ochiladi:
  - 🎭 **Bir xil ssenariy:** React bilimingiz o'sha — aktyorlar va matn o'zgarmaydi.
  - 📱 **Yangi sahna:** mobil — komponentlar biroz boshqacha (View, Text).
  - 🎬 **Natija:** bitta ssenariy, App Store va Play Market'da namoyish.
- Xulosa: RN — web-sayt emas. U haqiqiy mobil ilova — telefon kamerasi, bildirishnomalar va h.k. bilan ishlay oladi.
- Pastki tugma: Metaforani ko'ring → Davom etish

## 3 · Shisha ortida ↔ tirik sahna  `[848]`
- Eyebrow: Farq · shisha ↔ tirik
- Sarlavha: **Web = shisha ortida, mobil = tirik sahna.**
- Mentor: Ssenariy o'sha (komponent, JSX, props) — faqat sahna komponentlari o'zgaradi. Har tarjimani bosib farqni ko'ring, so'ng «shisha ↔ tirik» tugmasi bilan ikkalasini his qiling.
- Kod (React (web)):
  ```js
  <div className="box">
    <p>Salom</p>
  </div>
  ```
  ↓ tarjima ↓ — React Native (mobil):
  ```js
  <View style={s.box}>
    <Text>Salom</Text>
  </View>
  ```
- Tarjima tugmalari va izohlari:
  - `<div>→<View>` — Sahna-karkas. Web'dagi div (bo'yalgan fon-parda) o'rniga RN'da View — real yog'och sahna: qutilar, bo'limlar.
  - `<p> / <span>→<Text>` — Aktyor replikasi. RN'da HAR QANDAY matn <Text> ichida bo'lishi SHART — bu eng muhim qoida.
  - `CSS / className→StyleSheet / style` — Kostyum + yorug'lik varag'i. Alohida CSS fayl emas — JS obyekt: StyleSheet.create({...}).
- Telefon yorlig'i: 🪟 Shisha ortida (web) — proyeksiya / 📱 Tirik sahna (mobil) — native
- Almashtirish tugmasi: 📱 Tirik sahnaga (mobil) o'tish / 🪟 Shisha ortida (web) ko'rish
- Xulosa: Ssenariy bir xil! div→View, p→Text, CSS→StyleSheet. Web — shisha ortidagi xira proyeksiya; mobil — cho'ntakdagi tirik, native sahna.
- Pastki tugma: 3 farqni oching (0/3) → Davom etish

## 4 · 1-savol ✅  `[890]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **React Native nima uchun ishlatiladi?**
  - Tayyor web-saytlarni brauzerda tezroq ishlatish uchun
  - Ma'lumotlar bazasini serverda boshqarish va saqlash uchun
  - Faqat mobil o'yinlar va ko'ngilochar ilovalar uchun
  - ✔ React bilimi bilan haqiqiy mobil ilova (iOS + Android) yasash uchun
- To'g'ri: To'g'ri! React Native — React bilimingiz bilan iOS va Android uchun haqiqiy mobil ilova yasash imkonini beradi. Bitta ssenariy — ikki sahna.
- Xato izohlari:
  - RN web emas — u haqiqiy mobil ilova yasaydi. Web uchun oddiy React ishlatiladi.
  - Bu — baza vazifasi (PostgreSQL). RN — mobil ilova interfeysi uchun.
  - Faqat o'yin emas — har qanday mobil ilova (do'kon, chat, bank va h.k.).
  - (umumiy) RN — React bilan haqiqiy mobil ilova yasash uchun.

## 5 · View va Text  `[910]`
- Eyebrow: Komponent · View/Text
- Sarlavha: **2 asosiy sahna qismi: View va Text.**
- Mentor: RN'da deyarli hamma narsa shu ikkitadan quriladi. **View** — sahna-karkas (div kabi), **Text** — aktyor replikasi. Muhim qoida bor — tugmani bosing.
- Kod (App.js):
  ```js
  import { View, Text } from 'react-native'

  <View>
    <Text>Salom, mini-do'kon!</Text>
  </View>
  ```
- Tugma: Muhim qoida nima? → ✓ Ko'rdingiz
- Ochiladi (ogohlantirish): ⚠️ **Eng muhim qoida:** RN'da har qanday matn **albatta** `<Text>` ichida bo'lishi kerak. View ichiga to'g'ridan matn yozsangiz — xato beradi.
- Qo'shimcha: View = sahna-karkas (qatorlar, qutilar). Text = ko'rinadigan har bir replika. Boshqa komponentlar (Image, Button) ham bor, lekin shu ikkitasi asos.
- Pastki tugma: Qoidani ko'ring → Davom etish

## 6 · StyleSheet  `[943]`
- Eyebrow: Bezash · StyleSheet
- Sarlavha: **Kostyum + yorug'lik — StyleSheet (CSS fayl emas).**
- Mentor: RN'da alohida CSS fayl yo'q. Stillar — sahnaning kostyum va yorug'lik varag'i — JS obyekt sifatida yoziladi; nomlar deyarli o'sha (padding, color, fontSize). Tugmani bosing.
- Kod (styles):
  ```js
  const s = StyleSheet.create({
    box: { padding: 20, backgroundColor: '#FF4F28' },
    title: { fontSize: 22, color: '#fff' }
  })
  ```
- Tugma: CSS'dan farqi? → ✓ Ko'rdingiz
- Ochiladi:
  - 📦 **JS obyekt:** CSS fayl emas — `StyleSheet.create({...})`.
  - 🔤 **camelCase:** `background-color` → `backgroundColor`.
  - 📐 **flex default:** RN'da hamma narsa flex — sahnaga joylash oson.
- Xulosa: CSS bilimingiz deyarli o'sha — faqat camelCase va JS obyekt. Qiyin emas.
- Pastki tugma: Farqni ko'ring → Davom etish

## 7 · Sahnani yig'ish (markaziy)  `[980]`
- Eyebrow: Sahna · yig'ish
- Sarlavha: **Birinchi ekraningizni sahnaga teraning — telefonda reflektorlar yonadi.**
- Mentor: Har sahna bo'lagini qo'shing va o'ng tomonda telefon sahnasida jonli paydo bo'lishini kuzating. View-karkasni va ikkita Text-replikani teraning.
- Qo'shish tugmalari (+ → ✓): View — sahna-karkas · Text (sarlavha-replika) · Text (mahsulot-replika)
- Kod (App.js): `<View>` `// View qo'shing` … `<Text>mini-do'kon</Text>` · `<Text>📱 Telefon</Text>` … `</View>`
- Telefon (tirik sahna): qorong'u sahna → (faqat View qo'shilsa) View-karkas terildi — endi Text-replika qo'shing → mini-do'kon · 📱 Telefon
- Xulosa: Mana — birinchi mobil sahnangiz! View-karkas ichida Text-replikalar. Aynan React kabi, faqat View/Text bilan.
- Pastki tugma: Sahnani yig'ing (0/3) → Davom etish

## 8 · 2-savol ✅  `[1022]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **RN'da matn (harflar) qayerga yoziladi?**
  - To'g'ridan-to'g'ri <View> ichiga
  - ✔ <Text> komponenti ichiga — har doim
  - <div> ichiga
  - <p> ichiga
- To'g'ri: To'g'ri! RN'da har qanday matn albatta <Text> ichida bo'lishi shart. View-karkas ichiga to'g'ridan matn yozsangiz, ilova xato beradi. Bu — RN'ning eng muhim qoidasi.
- Xato izohlari:
  - View — sahna-karkas, u to'g'ridan matnni ko'tarmaydi. Matn <Text> ichida bo'lishi kerak.
  - <div> — bu web (React). RN'da matn <Text> ichida bo'ladi.
  - <p> — bu ham web. RN'da uning o'rnida <Text> ishlatiladi.
  - (umumiy) RN'da matn <Text> ichida bo'ladi.

## 9 · Expo nima  `[1042]`
- Eyebrow: Vosita · Expo
- Sarlavha: **Expo — gastrol furgoni (RN'ni osonlashtiruvchi vosita).**
- Mentor: RN'ni «yalang'och» o'rnatish murakkab (Xcode, Android Studio…). Expo — ko'chma sahna to'plami — bularning hammasini o'zi qiladi; siz faqat kod yozasiz. Tugmani bosing.
- Blok: 🚚 **Expo nima?** — RN loyihasini yaratish, ishga tushirish va telefonda ko'rishni juda osonlashtiruvchi tayyor to'plam. Yangi boshlovchilar uchun ideal.
- Tugma: Nega Expo qulay? → ✓ Ko'rdingiz
- Ochiladi:
  - ⚡ **Tez start:** bitta buyruq bilan loyiha tayyor.
  - 🛠 **Murakkab sozlash yo'q:** Xcode/Android Studio shart emas.
  - 🎟️ **Expo Go:** ilovani o'z telefoningizda darrov ko'rasiz — chipta bilan (keyingi ekran).
- Xulosa: Expo = mobil sahnaning «oson rejimi». Aynan u tufayli bugun darrov natija ko'rasiz.
- Pastki tugma: Nega qulay? → Davom etish

## 10 · Expo Go QR (chipta)  `[1074]`
- Eyebrow: Sahna · Expo Go
- Sarlavha: **QR = chipta. Skanerlang — ilova telefon sahnangizda.**
- Mentor: Expo Go ilovasini telefoningizga o'rnatasiz, kompyuterdagi QR-chiptani skanerlaysiz — va ilovangiz darrov telefon sahnasida ochiladi. Tugmani bosib ko'ring!
- Chap: kompyuterdagi QR-chipta · tugma 🎟️ Chiptani skanerlash → ✓ Skanerlandi
- Telefon: Expo Go (kutyapti) — chiptani kuting… → 🟢 ulandi — sahna tirik — mini-do'kon · 📱 Telefon — 2 500 000 · Sotib olish
- Xulosa: Mana natija! Kodni o'zgartirsangiz, Expo o'zgarishni telefon sahnasiga darrov yuboradi. Hech qanday murakkab o'rnatish yo'q.
- Pastki tugma: Chiptani skanerlang → Davom etish

## 11 · 3-savol ✅  `[1105]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Expo Go nima qiladi?**
  - ✔ QR-chiptani skanerlab, ilovani telefonda darrov ochadi
  - Sizning o'rningizga kodni o'zi yozib beradi
  - Ilova ma'lumotlarini bazada saqlab boradi
  - Faqat oddiy web-saytni brauzerda ochadi
- To'g'ri: To'g'ri! Expo Go — telefoningizdagi ilova. QR-chiptani skanerlaysiz va loyihangiz darrov telefon sahnasida ochiladi. Kodni o'zgartirsangiz — telefonda ham yangilanadi. Murakkab o'rnatishsiz.
- Xato izohlari:
  - Kodni siz (yoki AI) yozasiz — Expo Go uni telefonda ko'rsatadi.
  - Saqlash — bazaning ishi. Expo Go ilovani telefonda ishga tushiradi.
  - Web emas — Expo Go haqiqiy mobil ilovani telefoningizda ochadi.
  - (umumiy) Expo Go QR (chipta) orqali ilovani telefonda ko'rsatadi.

## 12 · To'liq sahna (case)  `[1125]`
- Eyebrow: Hayotiy · to'liq sahna
- Sarlavha: **mini-do'kon mobil — to'liq birinchi ekran.**
- Mentor: Endi to'liqroq sahna quramiz: sarlavha, mahsulot, narx va tugma. Har qatorni qo'shing va telefon sahnasida jonlanishini kuzating.
- Kod (ShopScreen.js), qatorlar birma-bir qo'shiladi:
  ```js
  <View style={s.card}>
    <Text style={s.title}>mini-do'kon</Text>
    <Text>📱 Telefon</Text>
    <Text style={s.price}>2 500 000 so'm</Text>
    <Pressable style={s.btn}><Text>Sotib olish</Text></Pressable>
  </View>
  ```
- Telefon (mini-do'kon mobil): kod yozilmoqda… → mini-do'kon · Telefon · 2 500 000 so'm · Sotib olish
- Tugma: ▶ Qurishni boshlash → Keyingi qator → → ✓ Sahna tayyor
- Xulosa: To'liq sahna! View-karkas ichida Text-replikalar va Pressable (tugma). Aynan React mantiqida — faqat mobil komponentlar bilan.
- Pastki tugma: Sahnani quring (0/4) → Davom etish

## 13 · O'sha React  `[1162]`
- Eyebrow: Tinchlantiruvchi · o'sha React
- Sarlavha: **Eng yaxshi xabar: React ssenariyingiz o'sha — o'zgarmaydi.**
- Mentor: View/Text va Expo'ni o'rgandingiz. Qolgan hammasi — Modul 3'dagi React. Har birini bosib, ishonch hosil qiling.
- Tugmalar va izohlar:
  - **Komponentlar** — Funksiya-komponentlar, JSX — aynan web React kabi.
  - **Props** — Komponentga ma'lumot uzatish — o'sha props.
  - **useState** — Holat va qayta render — bir xil hooklar (useState, useEffect).
- Uchalasi ochilgach karta: 📍 KEYINGI DARS — Birinchi ekran tayyor. Keyingi darsda ko'p ekranli ilova quramiz: **navigatsiya** (Stack Navigator), **API'dan ma'lumot** va **AsyncStorage**.
- Pastki tugma: 3 narsani ko'ring (0/3) → Davom etish

## 14 · 4-savol ✅  `[1199]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Web React'ni bilasiz. Mobil uchun asosan nimani qo'shimcha o'rganasiz?**
  - Hammasini noldan, chunki React bu yerda umuman yordam bermaydi
  - Boshqa dasturlash tili (masalan Java yoki Swift)
  - ✔ Asosan yangi sahna komponentlari (View/Text) va Expo — React tafakkur o'sha
  - Hech narsa — RN va web bir xil kodni ishlatadi
- To'g'ri: To'g'ri! React bilimingiz (komponent, props, state, JSX) to'liq ishlaydi. Qo'shimcha — bir nechta sahna komponenti (View/Text/StyleSheet) va Expo. Shuning uchun React bilsangiz, mobilga o'tish oson.
- Xato izohlari:
  - Aksincha — React bilimingizning katta qismi ishlaydi. Faqat sahna komponentlari o'zgaradi.
  - Boshqa til shart emas — RN ham JavaScript/React. O'rganganingiz asqotadi.
  - Butunlay bir xil emas — View/Text va Expo bor. Lekin tafakkur o'sha.
  - (umumiy) Asosan View/Text va Expo — React tafakkur o'sha.

## 15 · Gastrol oqimi ✅ (final)  `[1219]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: gastrol qadamlarini tartibda yig'ing.**
- Mentor: Bo'sh loyihadan telefondagi tirik sahnagacha yo'l: Expo loyiha → View/Text bilan ekran → StyleSheet bilan bezab → QR-chipta skan → telefonda jonli. Bo'laklarni to'g'ri tartibda sudrab joylang.
- Yorliq: Gastrol oqimi — bo'laklarni sudrab tartibga soling
- Bo'laklar: Expo loyiha · View/Text · StyleSheet · QR skan · Telefonda
- Uyachalar (ichidagi ko'rsatma):
  1. Expo loyiha — gastrol furgonini tayyorla.
  2. View/Text — sahna ekranini yoz.
  3. StyleSheet — kostyum va yorug'lik ber.
  4. QR skan — chiptani skanerla.
  5. Telefonda — tirik sahnada namoyish.
- To'g'ri: ✓ Gastrol oqimi to'g'ri yig'ildi! · ✓ Oqim tayyor: **Expo → View/Text → StyleSheet → QR skan → Telefonda**. Mana birinchi mobil ilovangiz — gastrol — yo'li.
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Havola: 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Pastki tugma: Oqimni yig'ing → Davom etish

## 16 · Amaliyot · VS Code / Expo Snack  `[2027]`
- Eyebrow: Amaliyot · VS Code / Expo Snack · joy: «kompyuteringizda»
- Sarlavha: **Birinchi mobil sahnangizni yozing**
- TOPSHIRIQ: Bitta <View> va ichida 2 ta <Text> bo'lgan birinchi ekranni o'zingiz yozing. Kod kiritilmaydi — o'zingizda bajarib, «Bajardim» bosasiz; mentor kuzatadi.
- Umumiy matn: Bu topshiriqni o'z kompyuteringizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Bosqichlar — belgilab boring:
  1. `snack.expo.dev` (yoki VS Code) ni oching va bo'sh loyiha yarating
  2. `import { View, Text } from 'react-native'` ni yozing
  3. Bitta `<View>` sahna-karkasini qo'shing
  4. View ichiga 2 ta `<Text>` replika yozing (masalan sarlavha va mahsulot)
  5. Natijani o'ng tomondagi telefon oynasida (yoki Expo Go'da) ko'ring — sahna yondimi?
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1774]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Umumiy shablon: Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2055]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| React bilimingiz bilan haqiqiy mobil ilova yasaydigan vosita qanday nomlanadi? | React Native | Bitta kod bilan telefon ilovasi yoziladi |
| Web'dagi div o'rniga React Native'da qaysi komponent yoziladi? | <View> | View — quti: ichiga boshqa qismlar joylashadi |
| Web'dagi p o'rniga React Native'da qaysi komponent yoziladi? | <Text> | Text — ekrandagi matn bo'lagi |
| React Native'da matnni qayerga yozish shart? | Text ichiga | To'g'ridan View ichiga yozsangiz, ilova xato beradi |
| React Native'da stillar qayerda yoziladi? | StyleSheet | Alohida CSS fayl emas, JS obyekt ichida |
| CSS'dagi background-color React Native'da qanday yoziladi? | backgroundColor | Ikki so'z qo'shiladi, ikkinchisi bosh harf bilan (camelCase) |
| Mobil loyihani tez boshlashga yordam beradigan to'plam qanday nomlanadi? | Expo | Murakkab o'rnatishni o'zi bajaradi, siz kod yozasiz |
| Ilovani o'z telefoningizda ko'rish uchun qaysi ilova kerak? | Expo Go | QR kodni skanerlaysiz va ilova telefonda ochiladi |
| Bitta React Native kodi qaysi ikki turdagi telefonda ishlaydi? | iOS + Android | Ikki marta alohida yozish kerak emas |
| React Native'da ham web'dagidek ishlaydigan uchta asosiy tushuncha qaysi? | Komponent, props, state | React bilimingiz shundoq ishlayveradi |
| React Native'da JSX yozilishi o'zgaradimi? | Yo'q, o'sha-o'sha | Faqat teg nomlari boshqacha: View, Text |
| Kodni o'zgartirsangiz telefondagi ilova nima qiladi? | Darrov yangilanadi | Expo o'zgarishni telefonga o'zi yetkazadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2068]`
- Eyebrow: Tayyor · belgi: ✓ Birinchi mobil sahna tayyor
- Sarlavha: **React bilimingiz endi telefon sahnasida.**
- Endi siz bilasiz:
  - React Native — React bilimi bilan haqiqiy mobil ilova (iOS + Android)
  - Web → mobil: <div>→<View>, <p>→<Text>, CSS→StyleSheet
  - Eng muhim qoida: har qanday matn <Text> ichida bo'ladi
  - Expo + Expo Go — QR-chiptani skanerlab, ilovani telefonda darrov ko'rasiz
  - React tafakkur (komponent, props, state) — o'sha ssenariy ishlaydi
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- 📝 Uyga vazifa:
  - **Tarjima** — web React komponentingizni qog'ozda RN'ga aylantiring (div→View, p→Text)
  - **Yozing** — bitta View + 2 Text bo'lgan birinchi ekran kodini yozing
  - **O'ylang** — mini-do'kon mobil ilovasida yana qanday sahnalar (ekranlar) bo'ladi?
- 🚀 Keyingi dars — RN'da ko'p ekranli ilova: navigatsiya (Stack Navigator), API'dan ma'lumot va AsyncStorage.
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4)** — 1–4-savolga birinchi urinishda to'g'ri javob bersangiz:
🎭 Stage Debut — React Native — mobil sahna ekanini topdingiz · 🪵 Native Stage — Text — aktyor replikasi qoidasini topdingiz · 🎟️ Ticket Scanned — Expo Go — QR-chipta bilan sahnaga chiqdingiz · 🎬 Curtain Up — React ssenariysi o'sha ishlashini tasdiqladingiz
Nishon yozuvlari: Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (5):**
1. React Native — React bilan mobil: 🎭 Bir xil ssenariy — React bilimingiz (komponent, props, state) — o'sha ssenariy, o'zgarmaydi. · 📱 Yangi sahna — telefon — RN o'sha shouni haqiqiy mobil ilova (iOS + Android) sahnasiga chiqaradi. · 🚚 Gastrol jamoasi — RN — web shousini yangi sahnaga moslaydigan gastrol jamoasi. (savol: React Native nima uchun ishlatiladi?)
2. Text — aktyor replikasi qoidasi: 🗣️ Har matn — Text ichida — RN'da har qanday matn albatta <Text> ichida bo'lishi shart. · 🪵 View — sahna-karkas — View — quti/karkas; unga to'g'ridan matn yozsangiz — ilova xato beradi. · 🎬 div→View, p→Text — Web'dagi div → View, p → Text. Bu — RN'ning eng muhim qoidasi. (savol: React Native'da matn qayerga yoziladi?)
3. Expo Go — chipta bilan sahnaga: 🎟️ QR — chipta — Expo Go'da QR kodni skanerlab, ilovangizni o'z telefoningizga chiqarasiz. · 🚚 Gastrol furgoni — Expo murakkab o'rnatishni o'zi bajaradi — siz faqat kod yozasiz. · ⚡ Jonli yangilanish — Kodni o'zgartirsangiz, o'zgarish telefonga darrov yetib boradi. (savol: Expo Go ilovasi nima qiladi?)
4. React ssenariysi — o'sha ishlaydi: 🧩 Komponent + props + state — RN'da ham o'sha React — funksiya-komponent, props, useState/useEffect. · 🎭 Faqat sahna komponentlari yangi — Qo'shimcha — bir nechta mobil komponent (View/Text/StyleSheet) va Expo. · 📱 Bitta kod — ikki platforma — Shuning uchun React bilsangiz, mobilga o'tish oson. (savol: Mobil uchun asosan nimani qo'shimcha o'rganasiz?)
5. Gastrol oqimi — tartib muhim: 🚚 Avval — Expo loyiha — Birinchi qadam — Expo bilan loyiha yaratish (gastrol furgoni tayyorlanadi). · 🪵 Keyin — View/Text va bezak — Ekran kodini yozib, StyleSheet bilan bezaysiz — sahnani tiklaysiz. · 🎟️ Eng oxiri — QR va telefon — QR skanerlanib, ilova telefonda jonli chiqadi. (Expo → View/Text → StyleSheet → QR skan → Telefonda; savol: Nega Expo loyiha eng birinchi qadam?)

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. React Native nima? ✔ React bilimi bilan haqiqiy mobil ilova (iOS+Android) yasash · Faqat web-saytlarni chiroyli bezash uchun kutubxona · Ma'lumotlar bazasini boshqaruvchi server tizimi · Rasmlarni tahrirlash dasturi
2. Web'dagi <div> React Native'da nimaga aylanadi? <p> · ✔ <View> · <div> — o'zgarmaydi · <span>
3. Web'dagi <p> React Native'da nimaga aylanadi? <View> · <div> · ✔ <Text> · <label>
4. RN'da har qanday matn qayerda bo'lishi shart? <View> ichida to'g'ridan · <div> ichida · <p> ichida · ✔ <Text> ichida
5. StyleSheet nima? ✔ Stillar yoziladigan JS obyekt (CSS fayl emas) · Loyihaga ulanadigan alohida .css fayl · Ma'lumotlarni saqlaydigan jadval turi · Rasmlar uchun maxsus fayl formati
6. CSS'dagi background-color RN StyleSheet'da qanday yoziladi? background-color — o'zgarmaydi · ✔ backgroundColor (camelCase) · bg_color · colorBackground
7. Expo nima uchun kerak? Ma'lumotlar bazasini serverda boshqarish uchun · Tayyor web-saytni internetga joylashtirish uchun · ✔ RN loyihasini oson yaratish va telefonda ko'rish uchun · Rasm va grafiklarni chizish uchun
8. Expo Go ilovasi QR kod bilan nima qiladi? Sizning o'rningizga kodni o'zi yozib beradi · Ilova ma'lumotlarini bazada saqlaydi · Faqat oddiy web-saytni brauzerda ochadi · ✔ Ilovangizni telefoningizda darrov ko'rsatadi
9. RN ilova qaysi platformalarda ishlaydi? ✔ iOS va Android — bitta kod bilan · Faqat Apple iOS telefonlarida · Faqat kompyuter brauzerida · Faqat Windows kompyuterlarida
10. React'dan RN'ga o'tganda nima O'ZGARMAYDI? Sahna komponentlari (div, p, span) · ✔ Komponent, props, state — React tafakkur · Alohida CSS faylning ishlatilishi · HTML teglari va tugmalari
11. React Native — bu web-saytmi? Ha, u oddiy web-sayt · Ha, faqat brauzerda ishlaydi · ✔ Yo'q — u haqiqiy mobil ilova · Yo'q — u faqat rasm
12. Birinchi RN ilova (gastrol) qadamlarining to'g'ri tartibi? QR skan → Telefonda → Expo loyiha → View/Text → StyleSheet · Telefonda → StyleSheet → QR skan → View/Text → Expo loyiha · StyleSheet → View/Text → Expo loyiha → Telefonda → QR skan · ✔ Expo loyiha → View/Text → StyleSheet → QR skan → Telefonda

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **To'g'ri javob «sotilib» qolgan:** 4 ta inline testning (4, 8, 11, 14-ekran) to'rttasida ham ✔ variant eng uzun va eng batafsil; viktorinada ham 1, 5, 7-savolda shunday
- **Izohsiz inglizcha/texnik so'zlar:** «native» (3-ekran yorlig'i va xulosasi), «camelCase» va «flex default» (6-ekran), «render», «hooklar» (13-ekran), «Pressable» (12-ekran, faqat qavsda «tugma»), «Expo Snack / snack.expo.dev» (16-ekran — darsda hech qayerda tanishtirilmagan)
- **Ikki metafora aralash:** gastrol/sahna bilan birga «shisha ortida ↔ tirik sahna», «proyeksiya», «bo'yalgan fon-parda ↔ real yog'och sahna» (1, 3-ekran) — bir narsaning ikki obrazi
- **«tafakkur»** (1, 14, 19-ekran, viktorina 10) — kitobiy so'z; «React fikrlash usuli» / «React bilimi» soddaroq. Shu bilan birga «ssenariy», «React bilimi», «React tafakkur» — bir narsaning uch nomi
- **«Modul 3'da React o'rgandingiz»** (0 va 13-ekran) — bu dars 6-Modul (LMS 8-Modul); o'quvchi ko'rgan modul raqamiga mos kelishini tekshirish kerak
- **Takrorlangan matn:** keyingi dars e'loni ikki marta — 13-ekrandagi «📍 KEYINGI DARS» kartasi va 19-ekrandagi «🚀 Keyingi dars» (deyarli so'zma-so'z)
- **13-ekran eyebrow «Tinchlantiruvchi · o'sha React»** — o'quvchiga g'alati tuyuladigan ichki yorliq; «h.k.» qisqartmasi (2 va 4-ekran) — to'liq yozilgani ma'qul
- **0-ekran hook:** uchala variant ham «Aynan!» deb qabul qilinadi — «Yo'q — noldan o'rganaman» yoki «Iloji yo'q» tanlagan o'quvchiga ham «Aynan!» chiqadi
