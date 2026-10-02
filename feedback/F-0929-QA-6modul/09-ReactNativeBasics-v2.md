# 6-Modul (LMS: 8-Modul) · 9-dars «React Native — asoslar» — YANGI MATN (v2)

Fayl: `src/6-Modull/ReactNativeBasicsLesson.jsx` · 20 ekran · faqat o'zbekcha
Eski matn: `09-ReactNativeBasics-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=4-variant, s8=2, s11=1, s14=3; arena 1-2-3-4 aylanma) — faqat matn.

---

## A. Darsning tayanchi (4 blok)

1. **React bilimingiz saqlanadi:** komponent, props, state (`useState`), JSX — o'sha.
2. **Web → mobil — mos komponentlar (tarjima emas, misol):** `div` → `View` · `p`/`span` → `Text` · CSS → `StyleSheet`. React'da fikrlash usuli o'sha, faqat HTML elementlari o'rniga React Native komponentlari ishlatiladi.
3. **Ishga tushirish:** Expo → Expo Go → telefon (odatda telefon va kompyuter bitta Wi-Fi tarmog'ida bo'lishi kerak; Expo Snack'da bu shart emas).
4. **Amaliyot:** View + Text → birinchi ekran.

**Bir nom qoidasi:** «React bilimingiz» (ssenariy / tafakkur — yo'q) · View · Text · StyleSheet · Expo · Expo Go.
**Metafora:** faqat 2-ekranda bir marta — sahna (aktyor boshqa sahnaga chiqadi, roli o'sha). Gastrol, furgon, chipta, kostyum, replika, karkas, «shisha ortida» — olib tashlanadi.

---

## 0 · Kirish — mini-do'kon telefonda  `[739]`
- Eyebrow: Dars · kirish
- Sarlavha: **Mini-do'koningiz saytda ishlayapti. Mijozlar uni telefonda ilova qilib ko'rmoqchi. Qila olasizmi?**
- Mentor: React darslarida web ilova yozishni o'rgandingiz. Endi savol: telefon ilovasi uchun hammasini noldan o'rganish kerakmi? Tugmani bosing — javobni ko'ring.
- Telefon: (o'chiq) → React Native bilan — ilova ochildi! · mini-do'kon · 📱 Telefon — 2 500 000 · Sotib olish
- Tugma: ▶ Ilovani telefonda ochish → ✓ Ko'rdingiz
- Savol: **Telefon ilovasi uchun nima qilasiz?**
  - Hammasini noldan o'rganaman — mobil butunlay boshqa
  - React bilimim bilan React Native'da yozaman
  - Iloji yo'q — mobil ilova men uchun juda qiyin
- Javob — 2-variant: **Aynan!** **React Native** — React bilimingiz bilan haqiqiy telefon ilovasini yasash usuli. Komponent, props, state — o'sha. Faqat ekrandagi elementlar boshqacha nomlanadi: `div` o'rniga `View`, `p` o'rniga `Text`. Bugun birinchi ekranni telefonda ochamiz!
- Javob — 1-variant: **Qiziq fikr!** Lekin yaxshi yangilik bor: hammasini noldan o'rganmaysiz. React bilimingizning katta qismi React Native'da ham ishlaydi.
- Javob — 3-variant: **Qiziq fikr!** Aslida bu o'ylaganingizdek qiyin emas: React bilimingizning katta qismi React Native'da ham ishlaydi. Bugun buni o'zingiz ko'rasiz.

✎ Javob tanlovga qarab uch xil (oldin hammasiga «Aynan!») · 🔴 FAKT: «Modul 3'da React o'rgandingiz» → «React darslarida» (modul raqami LMS'dagi raqam bilan mos emas) · «Web shouingiz… telefon sahnasida… gastrolga chiqa olasizmi?», «reflektorlarni yoqing» → oddiy vaziyat · to'g'ri variant eng uzuni emas

## 1 · Reja  `[781]`
- Sarlavha: **React bilimingizni telefonga olib chiqamiz.**
- Mentor: Yaxshi xabar: mobil ilova — butunlay yangi dunyo emas. React bilimingiz qoladi; bir nechta yangi komponent va Expo vositasini o'rganasiz.
- Chap blok: dars oxirida — birinchi ekraningiz telefonda · mini-do'kon · 📱 Telefon — 2 500 000 · Sotib olish
- Bugungi 4 qadam:
  1. React Native nima — React bilan mobil ilova · *rn*
  2. Web va mobil: qaysi komponent nimaga mos · *farq*
  3. Expo va Expo Go bilan telefonda ko'rish · *expo*
  4. Birinchi ekranni yig'ish · *ekran*

✎ «React tafakkuringiz — o'sha ssenariy», «sahna komponenti», «shisha ortida ↔ tirik sahna», «QR = chipta» → oddiy nomlar

## 2 · React Native nima  `[816]`
- Sarlavha: **React Native — React bilan haqiqiy mobil ilova.**
- Mentor: React Native — React bilimi bilan iOS va Android uchun **haqiqiy** mobil ilova yasash usuli (web-sayt emas). Tugmani bosing.
- Blok: 📱 **React Native nima?** — Siz React komponentlarini yozasiz, ular telefonda haqiqiy mobil ilova bo'lib ishlaydi. Ilovaning ko'p qismini bitta kod bazasida yozib, iOS va Android uchun chiqarish mumkin; platformaga xos joylar ham bo'ladi.
- Tugma: Qanday tasavvur qilish mumkin? → ✓ Ko'rdingiz
- Ochiladi: 🎭 Buni boshqa sahnaga chiqqan aktyorga o'xshatish mumkin: roli o'sha (React bilimingiz), faqat sahna boshqa (telefon) — shuning uchun bir nechta yangi komponentni o'rganasiz (View, Text).
- Xulosa: React Native web-sayt emas — u haqiqiy mobil ilova: telefonning kamerasi, bildirishnomalari kabi imkoniyatlari bilan ishlay oladi.

✎ Metafora faqat shu yerda, bir marta · «Bitta ssenariy — ikki sahna», «gastrol jamoasi» → «bitta kod bazasidan iOS va Android uchun» (real loyihalarda ba'zan har platformaga alohida kod ham kerak bo'ladi — «bitta kod» deb qat'iy aytilmaydi) · «h.k.» → to'liq jumla

## 3 · Web va mobil — mos komponentlar  `[848]`
- Eyebrow: Farq · web va mobil
- Sarlavha: **React o'sha — faqat ekran elementlari boshqacha.**
- Mentor: React'da fikrlash usuli o'zgarmaydi: komponent, JSX, props. Lekin mobil ekran uchun HTML elementlari o'rniga React Native komponentlari ishlatiladi. Har juftlikni bosib, farqini ko'ring.
- Kod: React (web) `<div className="box"><p>Salom</p></div>` ↓ React Native (mobil) `<View style={s.box}><Text>Salom</Text></View>`
- Juftliklar va izohlar:
  - `<div>` → `<View>` — Quti: ichiga boshqa elementlar joylanadi (bo'limlar, qatorlar).
  - `<p>` / `<span>` → `<Text>` — Matn. React Native'da **har qanday matn** `<Text>` ichida bo'lishi shart — bu eng muhim qoida.
  - CSS / `className` → `StyleSheet` / `style` — Alohida CSS fayl emas, JS obyekt: `StyleSheet.create({...})`.
- Almashtirish tugmasi: 🌐 Web ko'rinishi / 📱 Mobil ko'rinishi
- Xulosa: React bilimingiz o'sha — faqat ekran elementlari boshqacha nomlanadi va ishlaydi.

✎ 🔴 «Web = shisha ortidagi xira proyeksiya, mobil = tirik native sahna» (web'ni kamsitadi, texnik ma'nosi yo'q) olib tashlandi · «tarjima» → «mos komponent» (o'quvchi «RN = HTML'ni boshqa nom bilan yozish» deb o'ylamasin) · «sahna-karkas», «aktyor replikasi», «kostyum + yorug'lik varag'i» → «quti», «matn», «JS obyekt»

## 4 · 1-savol ✅  `[890]`
- Savol: **React Native nima uchun ishlatiladi?**
  - Tayyor web-saytni brauzerda tezroq ochish uchun
  - Ma'lumotlar bazasini serverda boshqarish uchun
  - Faqat mobil o'yinlar va ko'ngilochar ilovalar uchun
  - ✔ React bilimi bilan mobil ilova yasash uchun
- To'g'ri: To'g'ri! React Native React bilimingiz bilan iOS va Android uchun haqiqiy mobil ilova yasash imkonini beradi.
- Xato izohlari:
  - React Native web uchun emas — u mobil ilova yasaydi. Web uchun oddiy React ishlatiladi.
  - Bu — baza vazifasi (PostgreSQL). React Native — mobil ilova interfeysi uchun.
  - Faqat o'yin emas — har qanday mobil ilova: do'kon, chat, bank ilovasi.
  - (umumiy) React Native — React bilan mobil ilova yasash uchun.

✎ 🔴 To'g'ri javob eng uzuni va yagona qavsli («(iOS + Android)») variant edi → tenglashtirildi · «h.k.» → to'liq ro'yxat

## 5 · View va Text  `[910]`
- Sarlavha: **Boshlash uchun eng muhim ikki komponent: View va Text.**
- Mentor: Boshlanishida sizga eng ko'p kerak bo'ladigani — shu ikkitasi. **View** — quti (web'dagi `div` kabi), **Text** — matn. Muhim qoida bor — tugmani bosing.
- Kod (App.js) — o'zgarmaydi
- Ochiladi: ⚠️ **Eng muhim qoida:** React Native'da har qanday matn albatta `<Text>` ichida bo'lishi kerak. View ichiga to'g'ridan matn yozsangiz, ilova xato beradi.
- Qo'shimcha: View — quti (qatorlar, bo'limlar). Text — ekrandagi har bir matn. Boshqa komponentlar ham bor (masalan, rasm uchun `Image`), ularni keyin ko'ramiz.

✎ «RN'da deyarli hamma narsa shu ikkitadan quriladi» (juda katta umumlashtirish) → «boshlash uchun eng muhim ikkitasi»

## 6 · StyleSheet  `[943]`
- Eyebrow: Bezash · StyleSheet
- Sarlavha: **Stillar — StyleSheet'da (CSS fayl emas).**
- Mentor: React Native'da alohida CSS fayl yo'q. Stillar JS obyekt sifatida yoziladi; nomlari deyarli o'sha (padding, color, fontSize). Tugmani bosing.
- Kod — o'zgarmaydi
- Ochiladi:
  - 📦 **JS obyekt:** CSS fayl emas — `StyleSheet.create({...})`.
  - 🔤 **camelCase:** ikki so'zli nomlar qo'shib yoziladi, ikkinchisi bosh harf bilan: `background-color` → `backgroundColor`.
  - 📐 **Flexbox:** React Native'da elementlar doim Flexbox bilan joylashadi. Farqi: standart yo'nalish — yuqoridan pastga (web'da — chapdan o'ngga).
- Xulosa: CSS bilimingiz deyarli o'sha — faqat JS obyekt va camelCase.

✎ 🔴 «RN'da hamma narsa flex — sahnaga joylash oson» → aniq fakt: Flexbox har doim ishlaydi, standart yo'nalish esa web'dan farq qiladi (column) · camelCase birinchi uchragan joyida izohlandi · «kostyum + yorug'lik» olib tashlandi

## 7 · Birinchi ekranni yig'ing (markaziy)  `[980]`
- Eyebrow: Ekran · yig'ish
- Sarlavha: **Birinchi ekraningizni yig'ing — telefonda paydo bo'ladi.**
- Mentor: Har bir qismni qo'shing va o'ng tomonda telefonda qanday paydo bo'lishini kuzating. Bitta View va ikkita Text qo'shing.
- Qo'shish tugmalari: View — quti · Text — sarlavha · Text — mahsulot
- Telefon: bo'sh ekran → (faqat View) View qo'shildi — endi Text qo'shing → mini-do'kon · 📱 Telefon
- Xulosa: Mana — birinchi mobil ekraningiz! View ichida ikkita Text. Xuddi React'dagidek, faqat View va Text bilan.

✎ «sahnaga teraning, reflektorlar yonadi», «View-karkas», «Text-replika» → oddiy nomlar · (auditda eng kuchli zanjir: 7 → 12 → 16 — tuzilma saqlandi)

## 8 · 2-savol ✅  `[1022]`
- Savol: **React Native'da matn qayerga yoziladi?**
  - To'g'ridan-to'g'ri `<View>` ichiga
  - ✔ Har doim `<Text>` ichiga
  - Web'dagidek `<div>` ichiga
  - Web'dagidek `<p>` ichiga
- To'g'ri: To'g'ri! React Native'da har qanday matn albatta `<Text>` ichida bo'lishi shart. View ichiga to'g'ridan matn yozsangiz, ilova xato beradi.
- Xato izohlari:
  - View — quti, u to'g'ridan matnni ko'rsatmaydi. Matn `<Text>` ichida bo'lishi kerak.
  - `<div>` — bu web. React Native'da matn `<Text>` ichida bo'ladi.
  - `<p>` — bu ham web. React Native'da uning o'rnida `<Text>` ishlatiladi.
  - (umumiy) React Native'da matn `<Text>` ichida bo'ladi.

✎ To'g'ri javob eng uzuni edi («— har doim») → tenglashtirildi

## 9 · Expo nima  `[1042]`
- Eyebrow: Vosita · Expo
- Sarlavha: **Expo — React Native bilan ishlashni osonlashtiradigan vosita.**
- Mentor: React Native'ni Expo'siz o'rnatish murakkabroq: Xcode yoki Android Studio kabi katta dasturlar kerak bo'ladi. Expo loyihani yaratish, ishga tushirish va telefonda sinashni osonlashtiradi. Tugmani bosing.
- Blok: 🧰 **Expo nima?** — React Native loyihasini yaratish, ishga tushirish va telefonda ko'rishni osonlashtiradigan tayyor to'plam. Boshlovchilar uchun qulay.
- Tugma: Nega Expo qulay? → ✓ Ko'rdingiz
- Ochiladi:
  - ⚡ **Tez boshlash:** bitta buyruq bilan loyiha tayyor bo'ladi.
  - 🛠 **Bugun murakkab sozlash kerak emas:** bugungi mashq uchun Xcode yoki Android Studio shart emas.
  - 📱 **Expo Go:** ilovani o'z telefoningizda ko'rasiz (keyingi ekran).
- Xulosa: Expo tufayli bugun murakkab sozlashlarsiz natija ko'rasiz.

✎ «Expo … bularning hammasini o'zi qiladi; siz faqat kod yozasiz» (ortiqcha va'da) → «osonlashtiradi», «bugungi mashq uchun» · «gastrol furgoni», «ko'chma sahna to'plami», «yalang'och o'rnatish», «oson rejimi» olib tashlandi

## 10 · Expo Go va QR kod  `[1074]`
- Eyebrow: Telefonda · Expo Go
- Sarlavha: **QR kodni skanerlang — ilova telefoningizda ochiladi.**
- Mentor: Telefoningizga Expo Go ilovasini o'rnatasiz va kompyuterdagi QR kodni u bilan skanerlaysiz — loyihangiz telefoningizda ochiladi. Muhim shart: odatda telefon va kompyuter bitta Wi-Fi tarmog'ida bo'lishi kerak. Tugmani bosib ko'ring!
- Chap: kompyuterdagi QR kod · tugma 📷 QR kodni skanerlash → ✓ Skanerlandi
- Telefon: Expo Go (kutyapti) → 🟢 ulandi — mini-do'kon · 📱 Telefon — 2 500 000 · Sotib olish
- Xulosa: Mana natija! Kodni o'zgartirib saqlasangiz, Expo o'zgarishni telefonga tez yuboradi.

✎ «QR = chipta», «darrov telefon sahnasida» → oddiy ifoda · 🔴 muhim amaliy shart qo'shildi: telefon va kompyuter bitta Wi-Fi'da bo'lmasa, QR skanerlansa ham ilova ochilmaydi — sinfda eng ko'p uchraydigan muammo · «Hech qanday murakkab o'rnatish yo'q» → olib tashlandi

## 11 · 3-savol ✅  `[1105]`
- Savol: **Expo Go nima qiladi?**
  - ✔ QR kod orqali loyihani telefonda ochadi
  - Sizning o'rningizga kodni o'zi yozib beradi
  - Ilova ma'lumotlarini bazada saqlab boradi
  - Faqat oddiy web-saytni brauzerda ochadi
- To'g'ri: To'g'ri! Expo Go — telefoningizdagi ilova. QR kodni skanerlaysiz va loyihangiz telefonda ochiladi. Kodni o'zgartirsangiz — telefonda ham yangilanadi.
- Xato izohlari — o'zgarmaydi (faqat «QR (chipta)» → «QR kod»)

✎ To'g'ri javob eng uzuni edi («darrov», «QR-chipta») → tenglashtirildi

## 12 · To'liq ekran (case)  `[1125]`
- Eyebrow: Hayotiy · to'liq ekran
- Sarlavha: **Mini-do'kon mobil ilovasining birinchi ekrani.**
- Mentor: Endi to'liqroq ekran quramiz: sarlavha, mahsulot, narx va tugma. Har qatorni qo'shing va telefonda paydo bo'lishini kuzating. Tugma uchun yangi komponent ishlatamiz: **Pressable** — bosish mumkin bo'lgan element.
- Kod (ShopScreen.js) — o'zgarmaydi
- Xulosa: To'liq ekran! View ichida Text'lar va Pressable (bosiladigan tugma). Xuddi React mantiqida — faqat mobil komponentlar bilan.

✎ 🔴 `Pressable` tushuntirilmay birdan paydo bo'lardi → Mentor gapida bir jumla bilan tanishtirildi

## 13 · O'sha React  `[1162]`
- Eyebrow: Tanish · o'sha React
- Sarlavha: **Eng yaxshi xabar: React bilimingiz o'sha.**
- Mentor: View, Text va Expo'ni o'rgandingiz. Qolgan hammasi — React darslarida o'rganganingiz. Har birini bosib, ishonch hosil qiling.
- Tugmalar va izohlar:
  - **Komponentlar** — funksiya-komponentlar va JSX — xuddi web React'dagidek.
  - **Props** — komponentga ma'lumot uzatish — o'sha props.
  - **State (useState)** — holat o'zgarsa, ekran yangilanadi — o'sha useState.
- (📍 KEYINGI DARS kartasi olib tashlanadi — 19-ekranda bor)

✎ «Tinchlantiruvchi» (ichki yorliq) → «Tanish» · 🔴 FAKT: «Modul 3'dagi React» → «React darslarida» · «qayta render», «bir xil hooklar (useState, useEffect)» → «ekran yangilanadi», faqat useState (useEffect bu darsda kerak emas) · keyingi dars e'loni ikki marta chiqardi (13 va 19) → faqat 19-ekranda

## 14 · 4-savol ✅  `[1199]`
- Savol: **Web React'ni bilasiz. Mobil uchun asosan nimani qo'shimcha o'rganasiz?**
  - Hammasini noldan — React bu yerda yordam bermaydi
  - Boshqa dasturlash tilini (masalan, Java yoki Swift)
  - ✔ Yangi komponentlarni (View, Text) va Expo'ni
  - Hech narsani — web va mobil kodi aynan bir xil
- To'g'ri: To'g'ri! React bilimingiz (komponent, props, state, JSX) ishlayveradi. Qo'shimcha — bir nechta yangi komponent (View, Text, StyleSheet) va Expo.
- Xato izohlari:
  - Aksincha — React bilimingizning katta qismi ishlaydi.
  - Boshqa til shart emas — React Native ham JavaScript va React.
  - Aynan bir xil emas — View, Text va Expo bor. Lekin React bilimingiz o'sha.
  - (umumiy) Asosan View, Text va Expo.

✎ To'g'ri javob eng uzuni va yagona «— React tafakkur o'sha» izohli variant edi → tenglashtirildi · «tafakkur» → «bilim»

## 15 · Bugungi mashq tartibi ✅ (final)  `[1219]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: bugungi mashqimiz tartibini yig'ing.**
- Mentor: Bo'sh loyihadan telefondagi ilovagacha bugun qanday yo'l bosamiz? Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar: Expo loyiha · View/Text · StyleSheet · QR skan · Telefonda
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri (bir marta): ✓ Tartib tayyor: **Expo → View/Text → StyleSheet → QR skan → Telefonda**. Bugungi mashqimiz shu tartibda.

✎ 🔴 Javob ochiq turardi: bo'sh joylarda bo'lak nomlari tartib bilan yozilgan edi («Expo loyiha — gastrol furgonini tayyorla», «View/Text — …» — kodda `FLOW_HINTS`), Mentor ham butun tartibni aytardi → «1-qadam…5-qadam», Mentor gapidan tartib olib tashlandi (4-darsdagi xato bilan bir xil — faqat shu ikki darsda bor) · «gastrol qadamlari» → «bugungi mashq tartibi» (bu React Native'ning yagona umumiy algoritmi emas) · to'g'ri javob ikki marta chiqardi → bir marta

## 16 · Amaliyot · Expo Snack  `[2027]`
- Eyebrow: Amaliyot · Expo Snack · joy: «kompyuteringizda»
- Sarlavha: **Birinchi mobil ekraningizni yozing**
- Topshiriq: Bitta `<View>` va ichida 2 ta `<Text>` bo'lgan birinchi ekranni o'zingiz yozing. O'zingizda bajarib, «Bajardim» tugmasini bosasiz; mentor kuzatadi.
- Bosqichlar:
  1. `snack.expo.dev` ni oching — bu brauzerda React Native kodini yozib, natijasini darrov ko'radigan sayt
  2. `import { View, Text } from 'react-native'` ni yozing
  3. Bitta `<View>` qo'shing
  4. View ichiga 2 ta `<Text>` yozing (masalan, sarlavha va mahsulot)
  5. Natijani o'ng tomondagi telefon oynasida yoki Expo Go'da (QR orqali) ko'ring
  - ⭐ Uyda xohlasangiz: xuddi shu ekranni VS Code'da Expo loyihasi sifatida yarating.

✎ 🔴 «snack.expo.dev (yoki VS Code)» — Expo Snack darsda umuman tanishtirilmagan edi, ikki yo'l teng berilgan edi → Snack asosiy yo'l, bir jumla izoh bilan; VS Code — qo'shimcha · «sahna-karkas», «replika», «sahna yondimi?» → oddiy so'zlar

## 17 · Natijalar (podium)  `[1774]` — o'zgarmaydi (umumiy shablon)

## 18 · Takrorlash (kartochkalar)  `[2055]`

| Old tomon | Orqa | Izoh |
|---|---|---|
| React bilimingiz bilan mobil ilova yasash usuli qanday nomlanadi? | React Native | Ko'p qismi bitta kod bazasida — iOS va Android uchun |
| Web'dagi div o'rniga React Native'da qaysi komponent yoziladi? | View | Quti: ichiga boshqa elementlar joylanadi |
| Web'dagi p o'rniga qaysi komponent yoziladi? | Text | Ekrandagi matn |
| React Native'da matnni qayerga yozish shart? | Text ichiga | View ichiga to'g'ridan yozsangiz, ilova xato beradi |
| React Native'da stillar qayerda yoziladi? | StyleSheet | Alohida CSS fayl emas, JS obyekt |
| CSS'dagi background-color React Native'da qanday yoziladi? | backgroundColor | camelCase: ikkinchi so'z bosh harf bilan |
| React Native'da elementlar standart holatda qaysi yo'nalishda joylashadi? | Yuqoridan pastga | Web'da — chapdan o'ngga |
| Mobil loyihani tez boshlashga yordam beradigan vosita? | Expo | Yaratish, ishga tushirish va sinashni osonlashtiradi |
| Ilovani o'z telefoningizda ko'rish uchun qaysi ilova kerak? | Expo Go | QR kodni skanerlaysiz |
| Expo Go ishlashi uchun odatda qanday shart kerak? | Telefon va kompyuter bitta Wi-Fi'da | Aks holda ilova ochilmasligi mumkin |
| Bosiladigan tugma uchun qaysi komponent ishlatiladi? | Pressable | Ichiga Text qo'yiladi |
| React Native'da ham o'zgarmaydigan uchta tushuncha? | Komponent, props, state | React bilimingiz shundoq ishlayveradi |

✎ «Ikki marta alohida yozish kerak emas» (qat'iy) va «Kodni o'zgartirsangiz — darrov yangilanadi / Expo o'zi yetkazadi» → olib tashlandi · qo'shildi: standart yo'nalish, Wi-Fi sharti, Pressable

## 19 · Yakun  `[2068]`
- Eyebrow: Tayyor · belgi: ✓ Birinchi mobil ekran tayyor
- Sarlavha: **React bilimingiz endi telefonda ham ishlaydi.**
- Endi siz bilasiz:
  - React Native — React bilimi bilan mobil ilova (iOS va Android)
  - Web → mobil: `div` → `View`, `p` → `Text`, CSS → `StyleSheet`
  - Eng muhim qoida: har qanday matn `<Text>` ichida bo'ladi
  - Expo va Expo Go — QR kodni skanerlab, ilovani telefonda ko'rasiz
  - React bilimingiz (komponent, props, state) — o'sha
- Uyga vazifa:
  - **Moslang** — web React komponentingizni qog'ozda React Native'ga o'tkazing (`div` → `View`, `p` → `Text`)
  - **Yozing** — bitta View va 2 ta Text bo'lgan birinchi ekran kodini yozing
  - **O'ylang** — mini-do'kon mobil ilovasida yana qanday ekranlar bo'ladi?
- 🚀 Keyingi dars — React Native'da ko'p ekranli ilova: ekranlar orasida o'tish (navigatsiya) va API'dan ma'lumot olish.

✎ «telefon sahnasida», «React tafakkur … ssenariy» → oddiy · keyingi dars e'lonidan «Stack Navigator», «AsyncStorage» (hali o'tilmagan atamalar) olib tashlandi

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, teatr nomlari mavzuga moslanadi:
- 📱 **RN Start** — React Native nima uchun kerakligini topdingiz (4)
- 🔤 **Text Rule** — matn faqat `<Text>` ichida bo'lish qoidasini topdingiz (8)
- 📷 **Expo Go Ready** — Expo Go loyihani telefonda qanday ochishini bildingiz (11)
- ⚛️ **Same React** — React bilimingiz mobilda ham ishlashini tasdiqladingiz (14)

**Qisqa takrorlash oynalari (5):**
1. (4) **React Native — React bilan mobil:** React bilimingiz (komponent, props, state) o'sha. · React Native haqiqiy mobil ilova yasaydi (iOS va Android). · Web uchun — oddiy React, mobil uchun — React Native. · Sinfga savol: React Native nima uchun ishlatiladi?
2. (8) **Matn — faqat Text ichida:** React Native'da har qanday matn `<Text>` ichida bo'lishi shart. · View — quti; unga to'g'ridan matn yozsangiz, ilova xato beradi. · Web'dagi `div` → `View`, `p` → `Text`. · Sinfga savol: React Native'da matn qayerga yoziladi?
3. (11) **Expo Go — telefonda ko'rish:** Expo Go'da QR kodni skanerlab, loyihani telefonda ochasiz. · Odatda telefon va kompyuter bitta Wi-Fi tarmog'ida bo'lishi kerak. · Kodni o'zgartirib saqlasangiz, telefonda ham yangilanadi. · Sinfga savol: Expo Go nima qiladi?
4. (14) **React bilimi — o'sha:** Komponent, props, state — xuddi React'dagidek. · Qo'shimcha — View, Text, StyleSheet va Expo. · Shuning uchun React bilsangiz, mobilga o'tish oson. · Sinfga savol: Mobil uchun asosan nimani qo'shimcha o'rganasiz?
5. (15) **Bugungi mashq tartibi:** Avval Expo bilan loyiha yaratiladi. · Keyin View va Text bilan ekran yoziladi va StyleSheet bilan bezaladi. · Oxirida QR skanerlanib, ilova telefonda ochiladi. · Sinfga savol: Nega Expo loyiha birinchi qadam?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. React Native nima? ✔ React bilimi bilan mobil ilova yasash usuli · Web-saytlarni chiroyli bezash kutubxonasi · Ma'lumotlar bazasini boshqaruvchi server · Rasmlarni tahrirlaydigan dastur
2. Web'dagi `<div>` React Native'da nimaga mos keladi? `<p>` · ✔ `<View>` · `<div>` — o'zgarmaydi · `<span>`
3. Web'dagi `<p>` React Native'da nimaga mos keladi? `<View>` · `<div>` · ✔ `<Text>` · `<label>`
4. React Native'da har qanday matn qayerda bo'lishi shart? `<View>` ichida to'g'ridan · `<div>` ichida · `<p>` ichida · ✔ `<Text>` ichida
5. StyleSheet nima? ✔ Stillar yoziladigan JS obyekt · Loyihaga ulanadigan .css fayl · Ma'lumot saqlaydigan jadval · Rasmlar uchun fayl formati
6. CSS'dagi background-color StyleSheet'da qanday yoziladi? background-color — o'zgarmaydi · ✔ backgroundColor · bg_color · colorBackground
7. Expo nima uchun kerak? Bazani serverda boshqarish uchun · Tayyor saytni internetga joylash uchun · ✔ Loyihani oson yaratib, telefonda ko'rish uchun · Rasm va grafik chizish uchun
8. Expo Go ilovasi QR kod bilan nima qiladi? Kodni sizning o'rningizga yozadi · Ilova ma'lumotini bazada saqlaydi · Web-saytni brauzerda ochadi · ✔ Loyihangizni telefonda ochadi
9. React Native ilova qaysi platformalarda ishlaydi? ✔ iOS va Android'da · Faqat Apple iOS'da · Faqat kompyuter brauzerida · Faqat Windows kompyuterlarida
10. React'dan React Native'ga o'tganda nima O'ZGARMAYDI? Ekran elementlari (div, p, span) · ✔ Komponent, props va state · Alohida CSS fayl ishlatilishi · HTML teglari va tugmalari
11. React Native — bu web-saytmi? Ha, u oddiy web-sayt · Ha, faqat brauzerda ishlaydi · ✔ Yo'q — u haqiqiy mobil ilova · Yo'q — u faqat rasm
12. Bugungi mashqning to'g'ri tartibi? QR skan → Telefonda → Expo loyiha → View/Text → StyleSheet · Telefonda → StyleSheet → QR skan → View/Text → Expo loyiha · StyleSheet → View/Text → Expo loyiha → Telefonda → QR skan · ✔ Expo loyiha → View/Text → StyleSheet → QR skan → Telefonda

✎ 1, 5, 7-savollarda to'g'ri javob eng uzuni edi → tenglashtirildi · 9-savol «bitta kod bilan» (qat'iy) olib tashlandi · 10-savol «React tafakkur» → «Komponent, props va state» · 12-savol «gastrol» → «bugungi mashq»
