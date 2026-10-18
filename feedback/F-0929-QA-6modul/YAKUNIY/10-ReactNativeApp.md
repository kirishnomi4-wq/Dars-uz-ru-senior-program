# 10-dars «RN: komponent, navigatsiya, API» — yakuniy matn

> ✎ **F-1015-122 (16.10, 208-qonun 4-band, foydalanuvchi qarori — 2-variant):** dars yuzasidagi bezak emoji kodda olingan — sarlavha, yorliq, karta ikonlari, fayl tablari, test/amaliyot yorliqlari, tugmalar. Qolgan: sxema tugunlari, keys sahnasi, o'yin qatlami (nishon, arena, podium), Yakun, takrorlash oynasi, Mentor paneli, bot/ilova maketidagi mahsulot mazmuni. Bu MD dagi shunday bezak emoji endi ekranda yo'q.


Fayl: `src/6-Modull/ReactNativeAppLesson.jsx` · 20 ekran · Keyingi dars: «Loyiha kuni: mobil ilova»
Holat: 05.10.2026 — kodga mos · ✎ F-1015-155 (17.10): misol-ip AvtoPizza (TelegramBotNest `dars-6-10-done`): mini-do'kon/mahsulot → AvtoPizza/pitsa, `List`/`Detail` → `Menyu`/`Tafsilot`, `/products` → `/menyu`, Node.js → NestJS; tuzilma, ball, `correctIdx` o'zgarmagan

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Bitta ekran — boshlanishi. AvtoPizza ilovasi qanday bo'ladi?
- Mentor: O'tgan darsda bitta ekran qildingiz. Haqiqiy pitsa ilovasida har pitsaning tafsilot ekrani bor, menyu esa serverdan keladi. Tugmani bosing — qanday ko'rinishini ko'ring.
- Telefon:
  - tugma bosilguncha: ? · yorliq: haqiqiy ilova?
  - tugma bosilgach: Menyu ekrani «Menyu» — Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 · yorliq: ko'p ekran + real ma'lumot
- Tugma: ▶ AvtoPizza ilovasi → ✓ Ko'rdingiz
- Savol (tugma bosilgach ochiladi): Real ilova qanday quriladi?
  - Har pitsani kodga qo'lda yozaman, bitta ekranda
  - ✔ Ko'p ekran qo'shaman, ma'lumotni backend'dan olaman
  - Imkonsiz — mobil ilovada faqat bitta ekran bo'ladi
- Javob izohlari:
  - 2-variant: Aynan! Real ilova — ko'p ekran (**navigatsiya**) va backend'dan keladigan ma'lumot (**fetch**). Bugun AvtoPizza mobil ilovasini shunday quramiz — u botning o'sha backend'iga ulanadi.
  - 1-variant: Qiziq fikr! Kichik misolda ishlaydi, lekin AvtoPizza menyusini kodga qo'lda yozib borish noqulay: narx o'zgarsa, kodni tuzatish kerak bo'ladi. Bugun ma'lumotni backend'dan olishni ko'ramiz.
  - 3-variant: Qiziq fikr! Aslida mumkin: buning uchun navigatsiya (ko'p ekran) va backend bilan ishlashni qo'shamiz. Bugun aynan shuni qilamiz.
- Tugma (pastda): Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bitta ekrandan — ko'p ekranli ilovaga.
- Mentor: O'tgan darsda View va Text'ni o'rgandingiz. Bugun uch narsa: pitsalar ro'yxati, tafsilot ekraniga o'tish va backend'dan ma'lumot olish. Eng muhimi — mobil ilova web-sayt bilan **bitta backend**ga ulanadi.
- Yorliq: dars oxirida — ko'p ekranli AvtoPizza ilovasi
- Telefon «AvtoPizza mobil ilovasi»: Menyu ekrani «Menyu» — Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000
- Bugungi 3 asosiy qadam + qo'shimcha:
  (teg yo'q — eyebrow/matnni takrorlardi) *(✎ F-1015-121, 208-qonun 0-band: takror olindi)*
  1. Ro'yxat — FlatList (va yana bir nechta komponent bilan tanishuv)
  2. Navigatsiya — ko'p ekran (Stack)
  3. Backend'dan ma'lumot olish — fetch
  4. Qo'shimcha: AsyncStorage — telefonda saqlash bilan qisqa tanishuv
- Tugmalar (telefonda): Qadamlarni ko'rish · ↩ Natijani ko'rish
- Tugmalar (pastda): Orqaga · Boshlaymiz →

## 2 · Komponentlar
- Eyebrow: Komponentlar
- Sarlavha: Real ekran uchun yana bir nechta komponent.
- Mentor: View va Text — asos. Bugun eng keraklisi — **FlatList**. Qolganlari bilan qisqa tanishib qo'ying, ko'pi web'dagi elementlarga o'xshaydi. Har birini bosing.
- Komponent tugmalari (bosilgani ✓ bilan belgilanadi; o'ngda izoh ochiladi):
  - **Image** — Rasm ko'rsatadi (web'dagi `<img>`).
  - **Pressable** — Bosiladigan element; bosilganda `onPress` ichidagi kod ishlaydi (web'dagi tugma va `onClick`).
  - **ScrollView** — Ekranga sig'magan uzun qismni barmoq bilan surib ko'rish uchun quti.
  - **FlatList** — Ro'yxat: ko'p elementni (pitsa, xabar, post) qulay va samarali ko'rsatadi.
  - **TextInput** — Matn kiritish maydoni (web'dagi `<input>`).
- 5/5 dan keyin: Bugun asosiy ishni **FlatList** qiladi — backend'dan kelgan pitsalar ro'yxatini u ko'rsatadi. Keyingi ekranda ko'ramiz.
- Tugmalar (pastda): Orqaga · 5 komponentni oching (N/5) → Davom etish

## 3 · FlatList
- Eyebrow: Ro'yxat · FlatList
- Sarlavha: FlatList — massivni ro'yxatga aylantiradi.
- Mentor: Har element uchun bitta qator chiziladi — qatorlarni o'zingiz qo'lda yozmaysiz. Tugmani bosing.
- Kod (Menyu.js):
```js
<FlatList
  data={menyu}
  renderItem={({item}) => (
    <Text>{item.nom}</Text>
  )}
/>
```
- Tugma: ▶ Ro'yxatni telefonda chizish → ✓ Chizildi
- Telefon «FlatList natijasi»:
  - tugma bosilguncha: data = [ … ]
  - tugma bosilgach: Menyu ekrani «Menyu» — Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000
- Natija: 3 ta pitsa — 3 qator, avtomatik. Ko'p elementli ro'yxat uchun FlatList qulay va samarali. Endi bu ma'lumot qayerdan keladi — backend'dan.
- Tugmalar (pastda): Orqaga · Ro'yxatni chizing → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Pitsalarning aylantiriladigan ro'yxati uchun qaysi komponent kerak?
  - Text — har bir pitsa uchun bittadan yoziladi
  - Image — har bir pitsaning rasmi ko'rsatiladi
  - TextInput — pitsa nomini yozish uchun maydon
  - ✔ FlatList — har element uchun qator chizadi
- Javob izohlari:
  - To'g'ri: To'g'ri! FlatList massivni oladi va har element uchun qator chizadi — ro'yxatlar (pitsa, xabar, post) uchun qulay va samarali.
  - 1-variant: Text — bitta matn. Ko'p elementli ro'yxatni FlatList chizadi.
  - 2-variant: Image — rasm. Ro'yxatni FlatList chizadi (qator ichida rasm ham bo'lishi mumkin).
  - 3-variant: TextInput — matn kiritish uchun. Ro'yxat ko'rsatish — FlatList.
  - (umumiy) Aylantiriladigan ro'yxat — FlatList.
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda (bitta urinish): Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · xato bo'lsa: To'g'ri javob: <harf> — <variant> · Tugma (pastda): Javob tanlang
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar (pastda): Orqaga · To'g'ri javobni toping → Davom etish

## 5 · Stack Navigator
- Eyebrow: Navigatsiya · Stack
- Sarlavha: Ko'p ekran — Stack Navigator.
- Mentor: Ilovadagi ekranlarni **kartalar dastasi**ga o'xshatish mumkin: yangi ekran ustiga qo'yiladi, «Orqaga» bosilganda olib tashlanadi. Tugmani bosing.
- Karta «Stack — kartalar dastasi»: Menyu ekrani pastda. Pitsani bossangiz, Tafsilot ekrani **ustiga qo'yiladi**. «Orqaga» — Tafsilot ekrani olib tashlanadi, Menyu ekraniga qaytasiz.
- Tugma: push va pop nima? → ✓ Ko'rdingiz
- Tugma bosilgach (o'ngda):
  - **push:** yangi ekranni dastaning ustiga qo'yish.
  - **pop:** «Orqaga» — yuqoridagi ekranni olib tashlash.
  - **Tanish:** brauzerdagi «orqaga» tugmasiga o'xshaydi, lekin mobil ilova uchun.
- Natija: Endi buni harakatda ko'ramiz — keyingi ekranda pitsani bosib, Tafsilot ekrani qanday ochilishini kuzating.
- Tugmalar (pastda): Orqaga · push va pop nima? → Davom etish

## 6 · Navigatsiyani sinash
- Eyebrow: Sinov · navigatsiya
- Sarlavha: Pitsani bosing — Tafsilot ekrani ochiladi.
- Mentor: Mana navigatsiya harakatda. Telefon ichida pitsani bosing — yangi ekran o'ngdan suriladi (push). «‹ Orqaga» bilan qaytasiz (pop). Sinab ko'ring!
- Telefon (yorliq: Menyu ekrani ↔ Tafsilot ekrani):
  - Menyu ekrani «Menyu» — Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 (har qator bosiladi)
  - Tafsilot (bosilgan pitsa): ‹ Orqaga · Tafsilot · nomi · narxi so'm · Menyuga qaytish (bosilsa — Menyu)
    - Margarita — 45 000 so'm
    - Pepperoni — 55 000 so'm
    - Pishloqli — 50 000 so'm
- Karta «Sinab ko'ring»: Telefonda biror pitsani bosing → Tafsilot ekrani ochiladi. «‹ Orqaga» → Menyu ekraniga qaytadi.
- Natija (birinchi ochilgach): Har ekran — alohida komponent; Stack Navigator ularni dasta qilib boshqaradi. Erkin sinab ko'ring.
- Tugmalar (pastda): Orqaga · Pitsani oching → Davom etish

## 7 · navigate kodda
- Eyebrow: Kod · navigate
- Sarlavha: Bir ekrandan boshqasiga: navigation.navigate.
- Mentor: Bosilganda o'tish — bitta qator: uni `onPress` ichida chaqirasiz va kerakli ma'lumotni (pitsani) uzatasiz. Tugmani bosing.
- Kod (Menyu.js):
```js
<Pressable
  onPress={() => navigation.navigate(
    'Tafsilot', { pitsa: item }
  )}>
  <Text>{item.nom}</Text>
</Pressable>
```
- Tugma: Qatorlarni tushuntiring → ✓ Ko'rdingiz
- Tugma bosilgach (o'ngda):
  - **onPress:** bosilganda ishlaydi (web'dagi onClick).
  - **navigate('Tafsilot'):** Tafsilot ekraniga o'tadi — kodda ham bu ekranning nomi `Tafsilot`. Ostida yangi ekran dastaga qo'yiladi (push).
  - **{ pitsa: item }:** Tafsilot ekraniga qaysi pitsa ekanini uzatadi.
  - **Orqaga:** `navigation.goBack()` — oldingi ekranga qaytadi (pop). Tafsilot'dagi «Menyuga qaytish» tugmasi shuni chaqiradi; tepadagi «Orqaga» buni o'zi qiladi.
- Natija: Tafsilot ekrani pitsani `route.params` dan olib, nomi va narxini ko'rsatadi. `navigate` — o'tish, `goBack` — qaytish.
- Tugmalar (pastda): Orqaga · Kodni o'qing → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: React Native'da bir ekrandan boshqasiga qanday o'tasiz?
  - Sahifani qayta yuklab, boshqa fayl ochaman
  - ✔ `navigation.navigate('Ekran')` chaqiraman
  - Web'dagidek `<a href>` tegi bilan o'taman
  - Har ekranni alohida ilova qilib yozaman
- Javob izohlari:
  - To'g'ri: To'g'ri! Stack Navigator ekranlarni boshqaradi: `navigation.navigate('Ekran')` bilan yangi ekranga o'tasiz, «Orqaga» tugmasi yoki `navigation.goBack()` bilan qaytasiz.
  - 1-variant: Mobil ilova web emas — sahifa qayta yuklanmaydi. `navigation.navigate` ishlatiladi.
  - 3-variant: `<a href>` — bu web. React Native'da `navigation.navigate`.
  - 4-variant: Aksincha — bitta ilova, ko'p ekran; navigatsiya ularni bog'laydi.
  - (umumiy) `navigation.navigate` (Stack Navigator).
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda — 4-ekrandagi yozuvlar.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar (pastda): Orqaga · To'g'ri javobni toping → Davom etish

## 9 · Backend'dan fetch
- Eyebrow: API · fetch
- Sarlavha: Ma'lumot — fetch bilan backend'dan.
- Mentor: Menyuni kodga qo'lda yozmaysiz. `useEffect` ichida `fetch` bilan uni **AvtoPizza'ning o'sha NestJS backend'i**dan olasiz — web-saytdagi bilan bir xil API. Tugmani bosing.
- Kod (Menyu.js):
```js
const [menyu, setMenyu] = useState([])

useEffect(() => {
  fetch(BACKEND + '/menyu')   // BACKEND — backend manzili (config.js)
    .then(r => r.json())
    .then(setMenyu)
}, [])
```
- Tugma: Tanish ko'rinyaptimi? → ✓ Ko'rdingiz
- Karta «O'SHA BACKEND» (tugma bosilgach): Bu — botingizning NestJS backend'i: `GET /menyu` menyuni beradi. Web-sayt ham, mobil ilova ham **bitta backend**dan ma'lumot oladi. 1-darsdagi «ko'p kirish yo'li, bitta tizim»ni eslang.
- Natija: `useEffect` + `fetch` — aynan web React'dagidek. Backend'ni qayta qurmaysiz — mobil ilovani unga ulaysiz.
- Tugmalar (pastda): Orqaga · Kodni o'qing → Davom etish

## 10 · fetch harakatda
- Eyebrow: Sinov · fetch
- Sarlavha: Ilova ochildi → backend'dan ma'lumot keladi.
- Mentor: Mana fetch harakatda: ilova avval bo'sh (yuklanmoqda), keyin backend'dan menyu kelib, ro'yxat to'ladi. Tugmani bosing.
- Chizma: telefon → ulanish → server (yuklanayotganda o'qlar yonadi)
- Tugma: ▶ Backend'dan ol (fetch) → yuklanmoqda… → ✓ Yuklandi
- Telefon:
  - boshida: bo'sh — tugmani bosing · yorliq: ilova ochildi
  - yuklanayotganda: aylanuvchi belgi · yorliq: yuklanmoqda…
  - yuklangach: Menyu ekrani «Menyu» — Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 · yorliq: backend ma'lumoti
- Natija: Ma'lumot serverda turadi: ilova backend'ga so'rov yuborib, undagi ma'lumotni oladi. Shu sabab menyuni kodning ichida qo'lda yozib yurish shart emas — backend'dagi menyuga pitsa qo'shsangiz, ilova keyingi so'rovda uni oladi.
- Tugmalar (pastda): Orqaga · Ma'lumotni yuklang → Davom etish

## 11 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mobil ilova pitsalar ro'yxatini qayerdan oladi?
  - Kodga qo'lda yozilgan massivdan
  - Telefonning o'z xotirasidan
  - ✔ Backend'ga so'rov yuborib
  - Internetdagi tasodifiy saytdan
- Javob izohlari:
  - To'g'ri: To'g'ri! Mobil ilova backend'ga `fetch` bilan so'rov yuboradi va ma'lumotni oladi — bu web-sayt ham ishlatadigan o'sha NestJS backend. Bitta backend, ko'p kirish yo'li.
  - 1-variant: Qo'lda yozilgan massiv o'zgarmaydi. Yangilanadigan ma'lumot backend'dan keladi.
  - 2-variant: Telefon xotirasi — kichik mahalliy ma'lumot uchun. Asosiy ma'lumot backend'da.
  - 4-variant: Tasodifiy emas — aniq backend'dan (sizning serveringiz).
  - (umumiy) Backend'dan, `fetch` bilan.
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda — 4-ekrandagi yozuvlar.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar (pastda): Orqaga · To'g'ri javobni toping → Davom etish

## 12 · Asosiy oqim
- Eyebrow: Hayotiy · asosiy oqim
- Sarlavha: AvtoPizza mobil ilovasi — boshidan oxirigacha.
- Mentor: Mana hammasi birga: ilova ochiladi, backend'dan ma'lumot keladi, ro'yxat chiqadi, pitsani bossangiz Tafsilot ekrani ochiladi. Tugmani 4 marta bosib, oqimni kuzating.
- Qadamlar (har bosishda bittadan qo'shiladi):
  1. qadam 1 — Ilova ochildi — birinchi ekran (Menyu).
  2. qadam 2 — Backend'dan fetch — menyu yuklanmoqda…
  3. qadam 3 — FlatList — 3 ta pitsa ro'yxati ko'rindi.
  4. qadam 4 — «Margarita»ni bosish — `navigation.navigate('Tafsilot')` → Tafsilot ekrani ochiladi.
  5. qadam 5 — Tafsilot ekrani: nom, narx, «Menyuga qaytish». Asosiy oqim ishladi!
- Tugma: ▶ Boshlash → Keyingi qadam → → ✓ Asosiy oqim ishladi
- Telefon:
  - 1-qadam: bo'sh · yorliq: ilova
  - 2-qadam: aylanuvchi belgi · yorliq: ilova
  - 3-qadam: Menyu ekrani «Menyu» — Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 · yorliq: Menyu ekrani
  - 4–5-qadam: Margarita — 45 000 so'm — Menyuga qaytish · yorliq: Tafsilot ekrani
- Natija: Ro'yxat (backend'dan) + Tafsilot ekrani (navigatsiya) — mana AvtoPizza ilovasining asosiy oqimi ishladi. Real ilovada yana yuklanish belgisi, xato holati kabi qismlar ham bo'ladi — ularni keyin qo'shasiz. Amaliyotda shu oqimni o'zingiz qurasiz.
- Tugmalar (pastda): Orqaga · Ilovani yuring (N/4) → Davom etish

## 13 · AsyncStorage
- Eyebrow: Qo'shimcha · AsyncStorage
- Sarlavha: AsyncStorage — telefonning o'zida kichik ma'lumot saqlash.
- Mentor: Masalan, savatdagi pitsalar yoki foydalanuvchi sozlamalari. U web'dagi localStorage'ga o'xshaydi. Bugun faqat tanishib qo'yamiz. Tugmani bosing.
- Kod (cart.js):
```js
// saqlash
async function saqlash(savat) {
  const matn = JSON.stringify(savat)
  await AsyncStorage.setItem('savat', matn)
}

// o'qish (ilova qayta ochilganda)
async function yuklash() {
  const data = await AsyncStorage.getItem('savat')
  return JSON.parse(data ?? '[]')
}
```
- Tugma: Qachon kerak? → ✓ Ko'rdingiz
- Tugma bosilgach (o'ngda):
  - **Savat:** ilovani yopib ochsangiz ham saqlanib qoladi.
  - **Sozlamalar:** masalan, tanlangan til yoki mavzu.
  - Ogohlantirish: Faqat kichik, mahalliy ma'lumot uchun. Asosiy ma'lumot — baribir backend'da.
- Natija: AsyncStorage — telefondagi kichik xotira. Backend bilan birga ishlaydi, uning o'rnini bosmaydi.
- Tugmalar (pastda): Orqaga · Nima uchun? → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: AvtoPizza sayti va boti bor. Mobil ilova uchun backend'ni nima qilasiz?
  - ✔ O'sha backend'ga ulayman
  - Mobil uchun yangi backend quraman
  - Backend'siz, hammasini telefonda qilaman
  - Ma'lumotni qo'lda ko'chirib olaman
- Javob izohlari:
  - To'g'ri: To'g'ri! Backend va Database tayyor — ular har qanday kirish yo'li bilan ishlaydi. Mobil ilova ham o'sha API'ga `fetch` bilan so'rov yuboradi. API mos bo'lsa, yangi backend qurish shart emas.
  - 2-variant: Ko'pincha mavjud backend yetadi. Yangi backend qursangiz, ma'lumot ikkiga bo'linib ketishi mumkin.
  - 3-variant: Backend kerak — umumiy ma'lumot u yerda. Telefon uni ko'rsatadi.
  - 4-variant: Qo'lda ko'chirish — xatoga olib keladi va tez eskiradi. Bitta umumiy backend qulay.
  - (umumiy) O'sha backend'ga ulaysiz.
- Javob yorlig'i: To'g'ri · Qaytadan urinib ko'ring
- Jonli darsda — 4-ekrandagi yozuvlar.
- Havola (xato bo'lgan bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar (pastda): Orqaga · To'g'ri javobni toping → Davom etish

## 15 · Ilova oqimini yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: ilova oqimini to'g'ri tartibda yig'ing.
- Mentor: Ko'p ekranli ilova qanday ishlaydi? Qadamlarni o'ng tomondan to'g'ri tartibda tanlang.
- Chap yorliq: ilova oqimi (siz yig'yapsiz) — tanlangan qadamlar → bilan ulanib boradi
- O'ng yorliq: qadamni tanlang (tanlandi: N/5)
- Qadamlar (shu tartibda ko'rinadi; har birida + → ✓):
  - FlatList · ro'yxatni ko'rsatadi.
  - Ilova ochildi · birinchi ekran ochiladi.
  - Tafsilot ekrani · tafsilot ochiladi (push).
  - Backend'dan fetch · GET /menyu — menyuni oladi.
  - Pitsani bosish · navigation.navigate.
- To'g'ri tartib:
  1. Ilova ochildi
  2. Backend'dan fetch
  3. FlatList
  4. Pitsani bosish
  5. Tafsilot ekrani
- Xato bosilganda: Hozir emas — avval «<kerakli qadam>» bo'lishi kerak.
- To'g'ri: ✓ Oqim tayyor: **Ochildi → fetch → FlatList → bosish → Tafsilot ekrani**.
- Tugmalar (pastda): Orqaga · Oqimni yig'ing → Davom etish

## 16 · Amaliyot · VS Code
- Eyebrow: Amaliyot · VS Code
- Sarlavha: Ikki ekranli AvtoPizza: Menyu + Tafsilot
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: Expo loyihangizda (`mobile/`) ikki ekran yig'ing: `Menyu` — FlatList bilan pitsalar ro'yxati; pitsani bossangiz, `navigation.navigate` bilan `Tafsilot` ekrani ochilsin. Menyuni AvtoPizza backend'idan `fetch` bilan oling (`GET /menyu`). Backend ishlab turgan bo'lishi kerak.
- Bosqichlar, yorliqsiz ✎ F-1015-166 (har biri bosib belgilanadi, belgilangani ✓):
  1. Loyihani tayyorlang: navigatsiya kutubxonasini o'rnating — buyruqlar ustoz bergan yo'riqnomada (yoki ustoz bergan tayyor loyihani oching)
  2. `App.js` dagi `Stack.Navigator`da ikki ekran e'lon qiling: `Menyu` va `Tafsilot`
  3. `Menyu` ekranda `useEffect` + `fetch` bilan `/menyu`dan pitsalarni oling — backend ishlayotganini avval brauzerda tekshiring
  4. Pitsalarni `FlatList` bilan chizing; har qatorni `Pressable` qiling: `onPress={() => navigation.navigate('Tafsilot', { pitsa: item })}`
  5. `Tafsilot` ekranda pitsani `route.params.pitsa` dan oling, nomi va narxini ko'rsating; «Menyuga qaytish» tugmasi `navigation.goBack()` bilan Menyu ekraniga qaytarsin
- Xato izohi: Ishlamasa: backend ishlayaptimi? manzil to'g'rimi? telefon va kompyuter bitta Wi-Fi'dami? (8-darsdagi ulanish xatosi qoidasi)
- Tugma: Yana N qadam → ✓ Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach: Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar (pastda): Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
- Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Kartochkalar — «Kartochkalar» bo'limida (12 ta)
- Tugmalar (pastda): Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Dars tugadi · Testlar: N/N ✎ F-1015-161
- Sarlavha: Endi ko'p ekranli mobil ilovaning asosiy oqimini qura olasiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz:
  - FlatList — massivni ro'yxatga aylantiradi; Pressable, Image, ScrollView, TextInput bilan tanishdingiz
  - Navigatsiya — Stack Navigator: `navigate` bilan o'tish, `goBack` bilan qaytish
  - Backend'dan ma'lumot: `useEffect` + `fetch` — AvtoPizza'ning o'sha API'si (`GET /menyu`)
  - Mobil — yana bir kirish yo'li: bitta backend, ko'p kirish yo'li (web, bot, mobil)
  - Qo'shimcha: AsyncStorage — telefonda kichik mahalliy ma'lumot saqlash
- Uyga vazifa · Amaliy topshiriqni bajarish → (fonda suzuvchi so'zlar: amaliyot · loyiha · mashq · natija; bosilgach, karta «Uyga vazifa»):
  - **Chizing** — mobil ilovangiz ekranlarini: qaysi ro'yxat, qaysi tafsilot ekrani?
  - **Ulang** — qaysi ekran backend'dan qaysi ma'lumotni oladi?
  - **O'ylang** — qaysi kichik ma'lumotni telefonda saqlash qulay?
  - Keyingi dars — **Loyiha kuni: mobil ilova.** Bugungi AvtoPizza ilovasiga savat va buyurtma qo'shasiz.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar (pastda): Orqaga · Qaytadan · Yakunlash ✓
✎ F-1015-123 (16.10, S1-A): uy vazifasi kartasi P-025 — sarlavha «Uyda nima qilasiz?» (bannerdagi «Uyga vazifa» bilan takror emas); maydonlar: Kim uchun — mobil ilovangiz · Nechta — 1 chizma · Muddat — keyingi darsgacha (qiymatlar topshiriq matnidan); qadamlar raqam-doira; «Keyingi dars» karta ichida; bezak emoji olindi.

## Kartochkalar
Oyna: Takrorlash — kartochkalar. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N. Tugmalar: ✗ Takrorlash · ✓ Bildim.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Massivdagi ro'yxatni ekranda ko'rsatish uchun qaysi komponent kerak? | FlatList | Har element uchun bitta qatorni o'zi chizadi |
| Bosiladigan element uchun qaysi komponent? | Pressable | Bosilganda onPress ichidagi kod ishlaydi |
| Rasm ko'rsatish uchun qaysi komponent? | Image | Web'dagi `<img>` kabi |
| Foydalanuvchi matn yozadigan maydon? | TextInput | Web'dagi `<input>` kabi |
| Ekranga sig'magan uzun qismni surib ko'rish uchun? | ScrollView | Barmoq bilan suriladi |
| Ko'p ekranni boshqaradigan tizim? | Stack Navigator | Ekranlar kartalar dastasidek ustma-ust turadi |
| Boshqa ekranga o'tish uchun qaysi buyruq? | navigation.navigate | Yangi ekran dastaning ustiga qo'yiladi (push) |
| Oldingi ekranga qaytish uchun? | navigation.goBack() yoki «Orqaga» | Ustki ekran olib tashlanadi (pop) |
| Backend'dan ma'lumot qanday olinadi? | fetch | Ilova serverga so'rov yuborib javobini oladi |
| Ma'lumot ilova ochilganda bir marta yuklanishi uchun? | useEffect(…, []) | Bo'sh massiv «faqat bir marta» degani |
| Savatni telefonning o'zida saqlash uchun? | AsyncStorage | Kichik mahalliy ma'lumot; asosiysi — backend'da |
| Mobil ilova uchun yangi backend kerakmi? | Ko'pincha yo'q — o'sha backend | Web, bot va mobil bitta serverga ulanadi |

- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash

## Nishonlar
- **List Builder** (4-ekran, 1-savol) — Ro'yxat uchun FlatList'ni tanladingiz
- **Navigator** (8-ekran, 2-savol) — navigation.navigate bilan ekranga o'tishni bildingiz
- **Live Data** (11-ekran, 3-savol) — Ma'lumot backend'dan fetch bilan kelishini bildingiz
- **App Flow** (15-ekran, yakuniy) — Ilova oqimini to'g'ri tartibda yig'dingiz
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yuqori paneldagi hisoblagich: Badges — N/4
- Yakun ekranida: Nishonlaringiz — N/4

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. (4-ekran) **FlatList — ro'yxatni chizadi**
   - Massivni oladi — FlatList **massivni** oladi — pitsalar, xabarlar, postlar.
   - Har element — bir qator — **Har element uchun** avtomatik bitta qator chizadi.
   - Qulay va samarali — Ko'p elementli ro'yxat uchun **qulay va samarali**.
   - Sinfga savol: Aylantiriladigan ro'yxat uchun qaysi komponent kerak?
2. (8-ekran) **Navigatsiya — Stack Navigator**
   - Ekranlar dastasi — Stack Navigator'da ekranlar **kartalar dastasi**dek ustma-ust turadi.
   - navigate — o'tish — **navigate** — boshqa ekranga o'tadi (yangi ekran ustiga qo'yiladi — push).
   - Orqaga — qaytish — «Orqaga» yoki **goBack** — qaytadi (ustki ekran olinadi — pop).
   - Sinfga savol: Bir ekrandan boshqasiga qanday o'tasiz?
3. (11-ekran) **Backend'dan fetch**
   - fetch bilan olinadi — Ma'lumot **fetch** bilan backend'dan olinadi.
   - O'sha NestJS backend — Web-sayt ham, mobil ilova ham o'sha **NestJS backend**ga ulanadi.
   - So'rov yuborib oladi — Ma'lumot serverda turadi — ilova so'rov yuborib oladi.
   - Sinfga savol: Mobil ilova menyuni qayerdan oladi?
4. (14-ekran) **Bitta backend — ko'p kirish yo'li**
   - Ko'p kirish yo'li, bitta tizim — Web, bot va mobil — **bitta backend**ga ulanadi.
   - Yangisi shart emas — Ko'pincha mavjud backend yetadi — API mos bo'lsa, yangisi shart emas.
   - Mobil — yana bir kirish yo'li — Telefon ko'rsatadi, ma'lumot serverda.
   - Sinfga savol: Mobil ilova uchun backend'ni nima qilasiz?

## Jonli viktorina (12 savol)
1. Pitsalar ro'yxatini ko'rsatish uchun qaysi komponent?
   - ✔ FlatList — har element uchun qator
   - Text — bitta matn bo'lagi
   - Image — faqat rasm ko'rsatadi
   - TextInput — matn kiritish uchun
2. Bir ekrandan boshqasiga o'tish uchun nima chaqiriladi?
   - Sahifani qayta yuklash
   - ✔ navigation.navigate('Tafsilot')
   - window.location.assign('/tafsilot')
   - <a href> tegi
3. Yangi ekran ochilganda dastada nima bo'ladi?
   - Eski ekran butunlay o'chib ketadi
   - Ilova qaytadan ishga tushadi (reload)
   - ✔ Yangi ekran ustiga qo'yiladi (push)
   - Hech narsa o'zgarmaydi
4. Backend'dan ma'lumot olish uchun nima ishlatiladi?
   - AsyncStorage — telefon xotirasidan
   - localStorage bilan olinadi
   - Qo'lda yozilgan massivdan
   - ✔ fetch — API'ga so'rov
5. Ilova ochilganda ma'lumotni bir marta yuklash qayerda yoziladi?
   - ✔ useEffect(…, []) ichida
   - Har chizilganda, komponent tanasida
   - useState([]) ichida
   - Hech qayerda kerak emas
6. Savatni telefonning o'zida saqlash uchun nima?
   - Backend'dagi Database'da saqlash
   - ✔ AsyncStorage — mahalliy xotira
   - fetch — serverga yuborish
   - FlatList ichida saqlash
7. AvtoPizza sayti va boti bor. Mobil ilova backend'ni nima qiladi?
   - Butunlay yangi backend quradi
   - Backend'siz, telefonda ishlaydi
   - ✔ O'sha backend'ga ulanadi
   - Ma'lumotni qo'lda ko'chiradi
8. Bosiladigan element (web'dagi tugma) — React Native'da qaysi?
   - FlatList
   - ScrollView
   - Image
   - ✔ Pressable
9. Ko'p ekranni boshqaradigan tizim qanday nomlanadi?
   - ✔ Stack Navigator
   - FlatList
   - AsyncStorage
   - useEffect
10. Rasm ko'rsatish uchun qaysi komponent?
    - Text
    - ✔ Image
    - Pressable
    - FlatList
11. Matn kiritish maydoni — qaysi komponent?
    - ScrollView
    - Image
    - ✔ TextInput
    - FlatList
12. Web, bot va mobil bitta serverga ulanadi. Bu nima?
    - Har biri alohida backend
    - Backend umuman kerak emas
    - Faqat web backend'ga ulanadi
    - ✔ Bitta backend, ko'p kirish yo'li
