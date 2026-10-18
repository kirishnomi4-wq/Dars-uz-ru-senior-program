# 9-dars «React Native — asoslari» — yakuniy matn

Fayl: `src/6-Modull/ReactNativeBasicsLesson.jsx` · 20 ekran · Keyingi dars: «RN: komponent, navigatsiya, API»
Holat: 05.10.2026 — kodga mos (dars eski qolipda, MD v3 bo'yicha qayta qurilmagan)
Jonli darsga kirish oynasi sarlavhasi: React Native darsi

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Mijozlar do'konni ilovada ko'rmoqchi. Qila olasizmi?
- Mentor: React darslarida web ilova yozishni o'rgandingiz. Endi savol: telefon ilovasi uchun hammasini noldan o'rganish kerakmi? Tugmani bosing — javobni ko'ring.
- Telefon (chapda):
  - tugma bosilguncha: ekran xira, ichida «?» · ostida: telefon (o'chiq)
  - tugma bosilgach: mini-do'kon · Telefon — 2 500 000 · Sotib olish (tugma ko'rinishida) · ostida: React Native bilan — ilova ochildi!
- Tugma: ▶ Ilovani telefonda ochish → ✓ Ko'rdingiz
- Savol (o'ngda; variantlar tugma bosilgach faollashadi): Telefon ilovasi uchun nima qilasiz?
  - Hammasini noldan o'rganaman — mobil butunlay boshqa
  - ✔ React bilimim bilan React Native'da yozaman
  - Iloji yo'q — mobil ilova men uchun juda qiyin
- Javob izohlari:
  - 2-variant: **Aynan!** **React Native** — React bilimingiz bilan haqiqiy telefon ilovasini yasash usuli. Komponent, props, state — o'sha. Faqat ekrandagi elementlar boshqacha nomlanadi: `div` o'rniga `View`, `p` o'rniga `Text`. Bugun birinchi ekranni telefonda ochamiz!
  - 1-variant: **Qiziq fikr!** Lekin yaxshi yangilik bor: hammasini noldan o'rganmaysiz. React bilimingizning katta qismi React Native'da ham ishlaydi.
  - 3-variant: **Qiziq fikr!** Aslida bu o'ylaganingizdek qiyin emas: React bilimingizning katta qismi React Native'da ham ishlaydi. Bugun buni o'zingiz ko'rasiz.
- Tugma (pastda): Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: React bilimingizni telefonga olib chiqamiz.
- Mentor: Yaxshi xabar: mobil ilova — butunlay yangi dunyo emas. **React bilimingiz** qoladi; bir nechta yangi komponent va Expo vositasini o'rganasiz.
- Yorliq: dars oxirida — birinchi ekraningiz telefonda
- Telefon: mini-do'kon · Telefon — 2 500 000 · Sotib olish · ostida: mini-do'kon (RN)
- Bugungi 4 qadam:
  1. React Native nima — React bilan mobil ilova · rn
  2. Web va mobil: qaysi komponent nimaga mos · farq
  3. Expo va Expo Go bilan telefonda ko'rish · expo
  4. Birinchi ekranni yig'ish · ekran
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Natijani ko'rish
- Tugmalar (pastda): Orqaga · Boshlaymiz →

## 2 · React Native nima
- Eyebrow: Tushuncha · RN
- Sarlavha: React Native — React bilan haqiqiy mobil ilova.
- Mentor: Bitta kod iOS va Android'da ishlaydi — bu web-sayt emas. Tugmani bosing.
- Karta «React Native nima?»: Siz React komponentlarini yozasiz, ular telefonda **haqiqiy mobil ilova** bo'lib ishlaydi. Ilovaning ko'p qismini bitta kod bazasida yozib, iOS va Android uchun chiqarish mumkin; platformaga xos joylar ham bo'ladi.
- Tugma: Qanday tasavvur qilish mumkin? → ✓ Ko'rdingiz
- Karta (tugma bosilgach): Buni boshqa sahnaga chiqqan aktyorga o'xshatish mumkin: roli o'sha (**React bilimingiz**), faqat sahna boshqa (**telefon**) — shuning uchun bir nechta yangi komponentni o'rganasiz (View, Text).
- Natija (yashil): React Native web-sayt emas — u haqiqiy mobil ilova: telefonning kamerasi, bildirishnomalari kabi imkoniyatlari bilan ishlay oladi.
- Tugmalar (pastda): Orqaga · Tugmani bosing → Davom etish

## 3 · Web va mobil
- Eyebrow: Farq · web va mobil
- Sarlavha: React o'sha — faqat ekran elementlari boshqacha.
- Mentor: Komponent, JSX, props — hammasi o'zgarmaydi. HTML teglari o'rniga React Native komponentlari keladi. Har juftlikni bosib, farqini ko'ring.
- Kod «React (web)»:
```js
<div className="box">
  <p>Salom</p>
</div>
```
- ↓
- Kod «React Native (mobil)»:
```js
<View style={s.box}>
  <Text>Salom</Text>
</View>
```
- Juftlik tugmalari (ochilgani ✓ bilan belgilanadi; bosilganda o'ngda karta):
  - `<div>→<View>` — Quti: ichiga boshqa elementlar joylanadi (bo'limlar, qatorlar).
  - `<p> / <span>→<Text>` — Matn. React Native'da **har qanday matn** `<Text>` ichida bo'lishi shart — bu eng muhim qoida.
  - `CSS / className→StyleSheet / style` — Alohida CSS fayl emas, JS obyekt: StyleSheet.create({...}).
- Ko'rinish (o'ngda): brauzer oynasi (manzil: mini-dokon.uz) — mini-do'kon · Telefon — 2 500 000 · Sotib olish · ostida: Web ko'rinishi
- Almashtirgich tugma: Mobil ko'rinishi ↔ Web ko'rinishi (mobilda: o'sha mazmun telefonda, ostida: Mobil ko'rinishi)
- Natija (3 juftlik ochilgach): React bilimingiz o'sha — faqat ekran elementlari boshqacha nomlanadi va ishlaydi.
- Tugmalar (pastda): Orqaga · 3 juftlikni oching (N/3) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: React Native nima uchun ishlatiladi?
  - Tayyor web-saytni brauzerda tezroq ochish uchun
  - Database'ni serverda boshqarish uchun
  - Faqat mobil o'yinlar va ko'ngilochar ilovalar uchun
  - ✔ React bilimi bilan mobil ilova yasash uchun
- Javob izohlari:
  - To'g'ri: To'g'ri! React Native React bilimingiz bilan iOS va Android uchun haqiqiy mobil ilova yasash imkonini beradi.
  - 1-variant: React Native web uchun emas — u mobil ilova yasaydi. Web uchun oddiy React ishlatiladi.
  - 2-variant: Bu — Database vazifasi (PostgreSQL). React Native — mobil ilova interfeysi uchun.
  - 3-variant: Faqat o'yin emas — har qanday mobil ilova: do'kon, chat, bank ilovasi.
  - (umumiy) React Native — React bilan mobil ilova yasash uchun.
- Test yozuvlari (4, 8, 11, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar (pastda): Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · View va Text
- Eyebrow: Komponent · View/Text
- Sarlavha: Ikki asosiy komponent: View va Text
- Mentor: **View** — quti (web'dagi `div` kabi), **Text** — matn. Bitta qoida bor — tugmani bosing.
- Kod «App.js»:
```js
import { View, Text } from 'react-native'

<View>
  <Text>Salom, mini-do'kon!</Text>
</View>
```
- Tugma: Muhim qoida nima? → ✓ Ko'rdingiz
- Ogohlantirish (tugma bosilgach): **Eng muhim qoida:** React Native'da har qanday matn **albatta** `<Text>` ichida bo'lishi kerak. View ichiga to'g'ridan matn yozsangiz, ilova xato beradi.
- Karta: View — quti (qatorlar, bo'limlar). Text — ekrandagi har bir matn. Boshqa komponentlar ham bor (masalan, rasm uchun `Image`), ularni keyin ko'ramiz.
- Tugmalar (pastda): Orqaga · Qoidani ko'ring → Davom etish

## 6 · StyleSheet
- Eyebrow: Bezash · StyleSheet
- Sarlavha: Stillar — `StyleSheet`'da (CSS fayl emas).
- Mentor: Ular JS obyekt sifatida yoziladi; nomlari deyarli o'sha (padding, color, fontSize). Tugmani bosing.
- Kod «styles»:
```js
const s = StyleSheet.create({
  box: { padding: 20, backgroundColor: '#FF4F28' },
  title: { fontSize: 22, color: '#fff' }
})
```
- Tugma: CSS'dan farqi? → ✓ Ko'rdingiz
- Kartalar (tugma bosilgach):
  - **JS obyekt:** CSS fayl emas — `StyleSheet.create({...})`.
  - **camelCase:** ikki so'zli nomlar qo'shib yoziladi, ikkinchisi bosh harf bilan: `background-color` → `backgroundColor`.
  - **Flexbox:** React Native'da elementlar doim Flexbox bilan joylashadi. Farqi: standart yo'nalish — yuqoridan pastga (web'da — chapdan o'ngga).
- Natija (yashil): CSS bilimingiz deyarli o'sha — faqat JS obyekt va camelCase.
- Tugmalar (pastda): Orqaga · Farqni ko'ring → Davom etish

## 7 · Birinchi ekranni yig'ish
- Eyebrow: Ekran · yig'ish
- Sarlavha: Birinchi ekraningizni yig'ing — telefonda paydo bo'ladi.
- Mentor: Har bir qismni qo'shing va o'ng tomonda telefonda qanday paydo bo'lishini kuzating. Bitta View va ikkita Text qo'shing.
- Qism tugmalari (har biri «+», qo'shilgach ✓):
  - View — quti
  - Text — sarlavha
  - Text — mahsulot
- Kod «App.js» — boshida:
```js
<View>   // View qo'shing
</View>
```
- Kod — uchala qism qo'shilgach:
```js
<View>
  <Text>mini-do'kon</Text>
  <Text>Telefon</Text>
</View>
```
- Telefon (o'ngda):
  - boshida (xira): bo'sh ekran
  - faqat View qo'shilganda: View qo'shildi — endi Text qo'shing
  - Text'lar qo'shilgan sari: mini-do'kon · Telefon
- Natija (yashil): Mana — birinchi mobil ekraningiz! View ichida ikkita Text. Xuddi React'dagidek, faqat View va Text bilan.
- Tugmalar (pastda): Orqaga · Ekranni yig'ing (N/3) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: React Native'da matn qayerga yoziladi?
  - To'g'ridan-to'g'ri `<View>` ichiga
  - ✔ Har doim `<Text>` ichiga
  - Web'dagidek `<div>` ichiga
  - Web'dagidek `<p>` ichiga
- Javob izohlari:
  - To'g'ri: To'g'ri! React Native'da har qanday matn albatta `<Text>` ichida bo'lishi shart. View ichiga to'g'ridan matn yozsangiz, ilova xato beradi.
  - 1-variant: View — quti, u to'g'ridan matnni ko'rsatmaydi. Matn `<Text>` ichida bo'lishi kerak.
  - 3-variant: `<div>` — bu web. React Native'da matn `<Text>` ichida bo'ladi.
  - 4-variant: `<p>` — bu ham web. React Native'da uning o'rnida `<Text>` ishlatiladi.
  - (umumiy) React Native'da matn `<Text>` ichida bo'ladi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Expo nima
- Eyebrow: Vosita · Expo
- Sarlavha: Expo — React Native bilan ishlashni osonlashtiradigan vosita.
- Mentor: React Native'ni Expo'siz o'rnatish murakkabroq: Xcode yoki Android Studio kabi katta dasturlar kerak bo'ladi. Expo loyihani yaratish, ishga tushirish va telefonda sinashni osonlashtiradi. Tugmani bosing.
- Karta «Expo nima?»: React Native loyihasini yaratish, ishga tushirish va telefonda ko'rishni osonlashtiradigan tayyor to'plam. Boshlovchilar uchun qulay.
- Tugma: Nega Expo qulay? → ✓ Ko'rdingiz
- Kartalar (tugma bosilgach):
  - **Tez boshlash:** bitta buyruq bilan loyiha tayyor bo'ladi.
  - **Bugun murakkab sozlash kerak emas:** bugungi mashq uchun Xcode yoki Android Studio shart emas.
  - **Expo Go:** ilovani o'z telefoningizda ko'rasiz (keyingi ekran).
- Natija (yashil): Expo tufayli bugun murakkab sozlashlarsiz natija ko'rasiz.
- Tugmalar (pastda): Orqaga · Nega qulay? → Davom etish

## 10 · Expo Go va QR kod
- Eyebrow: Telefonda · Expo Go
- Sarlavha: QR kodni skanerlang — ilova telefoningizda ochiladi.
- Mentor: Telefonga Expo Go ilovasini o'rnatasiz va u bilan kompyuterdagi kodni skanerlaysiz. **Muhim shart:** odatda telefon va kompyuter bitta Wi-Fi tarmog'ida bo'lishi kerak. Tugmani bosib ko'ring!
- Chapda: kompyuter oynasi (sarlavhasida: npx expo start) ichida QR kod · ostida: kompyuterdagi QR kod
- O'q → telefon:
  - skanerlashdan oldin (xira): QR kodni kuting… · ostida: Expo Go (kutyapti)
  - skanerlangach: mini-do'kon · Telefon — 2 500 000 · Sotib olish · ostida: ulandi (yashil nuqta bilan)
- Tugma: QR kodni skanerlash (bosilgach tugma o'rnida natija chiqadi)
- Natija (yashil): Mana natija! Kodni o'zgartirib saqlasangiz, Expo o'zgarishni telefonga tez yuboradi.
- Tugmalar (pastda): Orqaga · QR kodni skanerlang → Davom etish

## 11 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Expo Go nima qiladi?
  - ✔ QR kod orqali loyihani telefonda ochadi
  - Sizning o'rningizga kodni o'zi yozib beradi
  - Ilova ma'lumotlarini Database'da saqlab boradi
  - Faqat oddiy web-saytni brauzerda ochadi
- Javob izohlari:
  - To'g'ri: To'g'ri! Expo Go — telefoningizdagi ilova. QR kodni skanerlaysiz va loyihangiz telefonda ochiladi. Kodni o'zgartirsangiz — telefonda ham yangilanadi.
  - 2-variant: Kodni siz (yoki AI) yozasiz — Expo Go uni telefonda ko'rsatadi.
  - 3-variant: Saqlash — Database'ning ishi. Expo Go ilovani telefonda ishga tushiradi.
  - 4-variant: Web emas — Expo Go haqiqiy mobil ilovani telefoningizda ochadi.
  - (umumiy) Expo Go QR kod orqali ilovani telefonda ko'rsatadi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 12 · To'liq ekran
- Eyebrow: Hayotiy · to'liq ekran
- Sarlavha: Mini-do'kon mobil ilovasining birinchi ekrani.
- Mentor: Endi to'liqroq ekran quramiz: sarlavha, mahsulot, narx va tugma. Har qatorni qo'shing va telefonda paydo bo'lishini kuzating. Tugma uchun yangi komponent ishlatamiz: **Pressable** — bosish mumkin bo'lgan element.
- Kod «ShopScreen.js» (har bosishda bitta qator qo'shiladi):
```js
<View style={s.card}>
  <Text style={s.title}>mini-do'kon</Text>
  <Text>Telefon</Text>
  <Text style={s.price}>2 500 000 so'm</Text>
  <Pressable style={s.btn}><Text>Sotib olish</Text></Pressable>
</View>
```
- Tugma: ▶ Qurishni boshlash → Keyingi qator → → ✓ Ekran tayyor
- Telefon (ostida: mini-do'kon mobil):
  - boshida: kod yozilmoqda…
  - qator qo'shilgan sari: mini-do'kon (sarlavha) · Telefon · 2 500 000 so'm (narx) · Sotib olish (tugma)
- Natija (yashil): To'liq ekran! View ichida Text'lar va Pressable (bosiladigan tugma). Xuddi React mantiqida — faqat mobil komponentlar bilan.
- Tugmalar (pastda): Orqaga · Ekranni quring (N/4) → Davom etish

## 13 · O'sha React
- Eyebrow: Tanish · o'sha React
- Sarlavha: Eng yaxshi xabar: React bilimingiz o'sha.
- Mentor: View, Text va Expo'ni o'rgandingiz. Qolgan hammasi — React darslarida o'rganganingiz. Har birini bosib, ishonch hosil qiling.
- Tugmalar (ko'rilgani ✓ bilan; bosilganda o'ngda karta):
  - **Komponentlar** — Funksiya-komponentlar va JSX — xuddi web React'dagidek.
  - **Props** — Komponentga ma'lumot uzatish — o'sha props.
  - **State (useState)** — Holat o'zgarsa, ekran yangilanadi — o'sha useState.
- Tugmalar (pastda): Orqaga · 3 narsani ko'ring (N/3) → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Web React'ni bilasiz. Mobil uchun asosan nimani qo'shimcha o'rganasiz?
  - Hammasini noldan — React bu yerda yordam bermaydi
  - Boshqa dasturlash tilini (masalan, Java yoki Swift)
  - ✔ Yangi komponentlarni (View, Text) va Expo'ni
  - Hech narsani — web va mobil kodi aynan bir xil
- Javob izohlari:
  - To'g'ri: To'g'ri! React bilimingiz (komponent, props, state, JSX) ishlayveradi. Qo'shimcha — bir nechta yangi komponent (View, Text, StyleSheet) va Expo.
  - 1-variant: Aksincha — React bilimingizning katta qismi ishlaydi.
  - 2-variant: Boshqa til shart emas — React Native ham JavaScript va React.
  - 4-variant: Aynan bir xil emas — View, Text va Expo bor. Lekin React bilimingiz o'sha.
  - (umumiy) Asosan View, Text va Expo.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Mashq tartibini yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: bugungi mashqimiz tartibini yig'ing.
- Mentor: Bo'sh loyihadan telefondagi ilovagacha bugun qanday yo'l bosamiz? Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. Expo loyiha
  2. View/Text
  3. StyleSheet
  4. QR skan
  5. Telefonda
- Joylar: 1 · 2 · 3 · 4 · 5 (bo'sh joyda: bu yerga qo'ying)
- To'g'ri yig'ilgach: ✓ Tartib tayyor: **Expo → View/Text → StyleSheet → QR skan → Telefonda**. Bugungi mashqimiz shu tartibda.
- Xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Tugmalar (pastda): Orqaga · Tartibni yig'ing → Davom etish

## 16 · Amaliyot · Expo Snack
- Eyebrow: Amaliyot · Expo Snack
- Sarlavha: Birinchi mobil ekraningizni yozing
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: Bitta `<View>` va ichida 2 ta `<Text>` bo'lgan birinchi ekranni o'zingiz yozing. O'zingizda bajarib, «Bajardim» tugmasini bosasiz; mentor kuzatadi.
- Bosqichlar — belgilab boring (bosilgani ✓ bilan belgilanadi):
  1. `snack.expo.dev` ni oching — bu brauzerda React Native kodini yozib, natijasini darrov ko'radigan sayt
  2. `import { View, Text } from 'react-native'` ni yozing
  3. Bitta `<View>` qo'shing
  4. View ichiga 2 ta `<Text>` yozing (masalan, sarlavha va mahsulot)
  5. Natijani o'ng tomondagi telefon oynasida yoki Expo Go'da (QR orqali) ko'ring
  6. Uyda xohlasangiz: xuddi shu ekranni VS Code'da Expo loyihasi sifatida yarating (yulduzcha bilan — qo'shimcha)
- Tugma: Yana N qadam → Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach (yashil): Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar (pastda): Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
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

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar (pastda): Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Birinchi mobil ekran tayyor (yonida: N/5 to'g'ri)
- Sarlavha: React bilimingiz endi telefonda ham ishlaydi.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - React Native — React bilimi bilan mobil ilova (iOS va Android)
  - Web → mobil: `div` → `View`, `p` → `Text`, CSS → `StyleSheet`
  - Eng muhim qoida: har qanday matn `<Text>` ichida bo'ladi
  - Expo va Expo Go — QR kodni skanerlab, ilovani telefonda ko'rasiz
  - React bilimingiz (komponent, props, state) — o'sha
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **Moslang** — web React komponentingizni qog'ozda React Native'ga o'tkazing (`div` → `View`, `p` → `Text`)
  - **Yozing** — bitta View va 2 ta Text bo'lgan birinchi ekran kodini yozing
  - **O'ylang** — mini-do'kon mobil ilovasida yana qanday ekranlar bo'ladi?
  - Keyingi dars — React Native'da ko'p ekranli ilova: ekranlar orasida o'tish (navigatsiya) va API'dan ma'lumot olish.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar (pastda): Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: N/4 · bosilganda: Badges — N/4 (har nishon nomi; olinmagani qulf bilan)
- **RN Start** — React Native nima uchun kerakligini topdingiz (4-ekran)
- **Text Rule** — Matn faqat <Text> ichida bo'lish qoidasini topdingiz (8-ekran)
- **Expo Go Ready** — Expo Go loyihani telefonda qanday ochishini bildingiz (11-ekran)
- **Same React** — React bilimingiz mobilda ham ishlashini tasdiqladingiz (14-ekran)
- Nishon birinchi urinishda to'g'ri javob uchun beriladi (ekranda bu haqda yozuv yo'q).
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. React Native — React bilan mobil (4-ekran)
   - React bilimi o'sha — React bilimingiz (komponent, props, state) **o'sha**.
   - Haqiqiy mobil ilova — React Native **haqiqiy mobil ilova** yasaydi (iOS va Android).
   - Web va mobil — Web uchun — oddiy React, mobil uchun — React Native.
   - Sinfga savol: React Native nima uchun ishlatiladi?
2. Matn — faqat Text ichida (8-ekran)
   - Har matn — Text ichida — React Native'da **har qanday matn** `<Text>` ichida bo'lishi shart.
   - View — quti — View — quti; unga to'g'ridan matn yozsangiz, ilova **xato** beradi.
   - div → View, p → Text — Web'dagi `div` → `View`, `p` → `Text`.
   - Sinfga savol: React Native'da matn qayerga yoziladi?
3. Expo Go — telefonda ko'rish (11-ekran)
   - QR kod — Expo Go'da **QR kodni skanerlab**, loyihani telefonda ochasiz.
   - Bitta Wi-Fi — Odatda telefon va kompyuter **bitta Wi-Fi tarmog'ida** bo'lishi kerak.
   - Tez yangilanish — Kodni o'zgartirib saqlasangiz, telefonda ham yangilanadi.
   - Sinfga savol: Expo Go nima qiladi?
4. React bilimi — o'sha (14-ekran)
   - Komponent, props, state — Komponent, props, state — **xuddi React'dagidek**.
   - Qo'shimcha — bir nechtasi — Qo'shimcha — View, Text, StyleSheet va Expo.
   - Mobilga o'tish oson — Shuning uchun React bilsangiz, mobilga o'tish oson.
   - Sinfga savol: Mobil uchun asosan nimani qo'shimcha o'rganasiz?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting · savol vaqti 15 soniya
- Arena fonidagi so'zlar: `<View>` · `<Text>` · StyleSheet · Expo · useState · iOS+Android · div→View · Pressable · flex · Image · native · props
- Arena yozuvlari (o'quvchiga): Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · Mentor testni boshlashini kuting… · (mustaqil) ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Arenani yopish · jonli dars tugagan bo'lsa: Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish

1. React Native nima?
   - ✔ React bilimi bilan mobil ilova yasash usuli
   - Web-saytlarni chiroyli bezash kutubxonasi
   - Database'ni boshqaruvchi server
   - Rasmlarni tahrirlaydigan dastur
2. Web'dagi `<div>` React Native'da nimaga mos keladi?
   - `<p>`
   - ✔ `<View>`
   - `<div>` — o'zgarmaydi
   - `<span>`
3. Web'dagi `<p>` React Native'da nimaga mos keladi?
   - `<View>`
   - `<div>`
   - ✔ `<Text>`
   - `<label>`
4. React Native'da har qanday matn qayerda bo'lishi shart?
   - `<View>` ichida to'g'ridan
   - `<div>` ichida
   - `<p>` ichida
   - ✔ `<Text>` ichida
5. StyleSheet nima?
   - ✔ Stillar yoziladigan JS obyekt
   - Loyihaga ulanadigan .css fayl
   - Ma'lumot saqlaydigan jadval
   - Rasmlar uchun fayl formati
6. CSS'dagi background-color StyleSheet'da qanday yoziladi?
   - background-color — o'zgarmaydi
   - ✔ backgroundColor
   - bg_color
   - colorBackground
7. Expo nima uchun kerak?
   - Database'ni serverda boshqarish uchun
   - Tayyor saytni internetga joylash uchun
   - ✔ Loyihani oson yaratib, telefonda ko'rish uchun
   - Rasm va grafik chizish uchun
8. Expo Go ilovasi QR kod bilan nima qiladi?
   - Kodni sizning o'rningizga yozadi
   - Ilova ma'lumotini Database'da saqlaydi
   - Web-saytni brauzerda ochadi
   - ✔ Loyihangizni telefonda ochadi
9. React Native ilova qaysi platformalarda ishlaydi?
   - ✔ iOS va Android'da
   - Faqat Apple iOS'da
   - Faqat kompyuter brauzerida
   - Faqat Windows kompyuterlarida
10. React'dan React Native'ga o'tganda nima O'ZGARMAYDI?
    - Ekran elementlari (div, p, span)
    - ✔ Komponent, props va state
    - Alohida CSS fayl ishlatilishi
    - HTML teglari va tugmalari
11. React Native — bu web-saytmi?
    - Ha, u oddiy web-sayt
    - Ha, faqat brauzerda ishlaydi
    - ✔ Yo'q — u haqiqiy mobil ilova
    - Yo'q — u faqat rasm
12. Bugungi mashqning to'g'ri tartibi?
    - QR skan → Telefonda → Expo loyiha → View/Text → StyleSheet
    - Telefonda → StyleSheet → QR skan → View/Text → Expo loyiha
    - StyleSheet → View/Text → Expo loyiha → Telefonda → QR skan
    - ✔ Expo loyiha → View/Text → StyleSheet → QR skan → Telefonda
