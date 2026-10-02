# 6-Modul (LMS: 8-Modul) · 10-dars «RN: komponent, navigatsiya, API» — YANGI MATN (v2)

Fayl: `src/6-Modull/ReactNativeAppLesson.jsx` · 20 ekran · faqat o'zbekcha
Eski matn: `10-ReactNativeApp-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=4-variant, s8=2, s11=3, s14=1; arena 1-2-3-4 aylanma) — faqat matn.

---

## A. Darsning tayanchi

**Markaz — uchlik:** FlatList (ro'yxat) → Navigatsiya (bosish → Tafsilot ekrani → orqaga) → fetch (backend'dan ma'lumot).
Image, ScrollView, TextInput — qisqa tanishuv. AsyncStorage — qo'shimcha qisqa tanishuv (test yo'q, amaliyotda ishlatilmaydi).

**Bir nom qoidasi:**
- `Detail` — faqat kodda; matnda **Tafsilot ekrani**.
- «tap» → **bosish** · «App oqimi» → **ilova oqimi** · «kontent/konteyner» → **matn va rasm / quti**.
- «ko'p eshik, bitta tizim» → **«ko'p kirish yo'li, bitta tizim»** (1-dars v2 bilan bir xil).
- Backend manzili — `/products` (backend darslarida va 8-darsda shu nom; `/mahsulotlar` emas).

**Navigatsiya so'zlari (aniq ajratildi):**
- `navigation.navigate('Detail')` — boshqa ekranga o'tish.
- `navigation.goBack()` yoki «Orqaga» tugmasi — oldingi ekranga qaytish.
- **push / pop** — ekranlar dastasida ostida nima bo'lishi: yangi ekran ustiga qo'yiladi (push), «Orqaga»da olib tashlanadi (pop). `navigate` odatda push qiladi.

**Kafolat yo'q:** «real ilova», «to'liq ishlaydigan ilova» → «asosiy oqimi ishladi» (bu o'quv ilova: yuklanish, xato, bo'sh holat kabi qismlari hali yo'q).
**Metafora:** faqat 5-ekranda — kartalar dastasi. Teatr (massovka, sahna, backstage) — olib tashlanadi.

---

## 0 · Kirish — real do'kon  `[647]`
- Sarlavha: **Bitta ekran — boshlanishi. Real do'kon ilovasi qanday bo'ladi?**
- Mentor: O'tgan darsda bitta ekran qildingiz. Haqiqiy do'konda esa ko'p mahsulot, har biriga tafsilot ekrani va serverdan keladigan ma'lumot bor. Tugmani bosing — qanday ko'rinishini ko'ring.
- Telefon: 🛍️ mini-do'kon · Telefon 2 500 000 · Quloqchin 300 000 · Aqlli soat 800 000
- Tugma: ▶ Real do'kon ilovasi → ✓ Ko'rdingiz
- Savol: **Real ilova qanday quriladi?**
  - Har mahsulotni kodga qo'lda yozaman, bitta ekranda
  - Ko'p ekran qo'shaman, ma'lumotni backend'dan olaman
  - Imkonsiz — mobil ilovada faqat bitta ekran bo'ladi
- Javob — 2-variant: **Aynan!** Real ilova — ko'p ekran (**navigatsiya**) va backend'dan keladigan ma'lumot (**fetch**). Bugun mini-do'kon mobil ilovasini shunday quramiz — u backend darslaridagi o'sha serverga ulanadi.
- Javob — 1-variant: **Qiziq fikr!** Kichik misolda ishlaydi, lekin real do'konda mahsulotlarni kodga qo'lda yozib borish noqulay: har o'zgarishda kodni tuzatish kerak bo'ladi. Bugun ma'lumotni backend'dan olishni ko'ramiz.
- Javob — 3-variant: **Qiziq fikr!** Aslida mumkin: buning uchun navigatsiya (ko'p ekran) va backend bilan ishlashni qo'shamiz. Bugun aynan shuni qilamiz.

✎ «Bitta ekran — bu hali ilova emas» (bitta ekranli ilova ham ilova) → «boshlanishi» · «T6'da» (ichki kod) → «O'tgan darsda» · javob tanlovga qarab uch xil · to'g'ri variant tenglashtirildi (oldin yagona qavsli va texnik so'zli)

## 1 · Reja  `[689]`
- Sarlavha: **Bitta ekrandan — ko'p ekranli ilovaga.**
- Mentor: O'tgan darsda View va Text'ni o'rgandingiz. Bugun uch narsa: mahsulotlar ro'yxati, tafsilot ekraniga o'tish va backend'dan ma'lumot olish. Eng muhimi — mobil ilova web-sayt bilan **bitta backend**ga ulanadi.
- Chap: dars oxirida — ko'p ekranli mobil do'kon (telefon maketi)
- Bugungi 3 asosiy qadam + qo'shimcha:
  1. Ro'yxat — FlatList (va yana bir nechta komponent bilan tanishuv) · *ro'yxat*
  2. Navigatsiya — ko'p ekran (Stack) · *navigatsiya*
  3. Backend'dan ma'lumot olish — fetch · *api*
  4. Qo'shimcha: AsyncStorage — telefonda saqlash bilan qisqa tanishuv · *qo'shimcha*

✎ «real ilova quramiz» → aniq uch narsa · AsyncStorage asosiy qadamdan «qo'shimcha»ga tushdi (unga test yo'q, amaliyotda ishlatilmaydi — pastga qarang) · «T6'da» → «O'tgan darsda»

## 2 · Yana 5 komponent  `[724]`
- Sarlavha: **Real ekran uchun yana bir nechta komponent.**
- Mentor: View va Text — asos. Bugun eng keraklisi — **FlatList**. Qolganlari bilan qisqa tanishib qo'ying, ko'pi web'dagi elementlarga o'xshaydi. Har birini bosing.
- Kartalar:
  - **Image** — rasm ko'rsatadi (web'dagi `<img>`).
  - **Pressable** — bosiladigan element; bosilganda `onPress` ichidagi kod ishlaydi (web'dagi tugma va `onClick`).
  - **ScrollView** — ekranga sig'magan uzun qismni barmoq bilan surib ko'rish uchun quti.
  - **FlatList** — ro'yxat: ko'p elementni (mahsulot, xabar, post) qulay va samarali ko'rsatadi.
  - **TextInput** — matn kiritish maydoni (web'dagi `<input>`).
- Xulosa: Bugun asosiy ishni **FlatList** qiladi — backend'dan kelgan mahsulotlar ro'yxatini u ko'rsatadi. Keyingi ekranda ko'ramiz.

✎ «konteyner», «kontent» → oddiy so'zlar · Image/ScrollView/TextInput — qisqa tanishuv ekani ochiq aytildi (dars zichligini kamaytirish)

## 3 · FlatList  `[756]`
- Sarlavha: **FlatList — massivni ro'yxatga aylantiradi.**
- Mentor: FlatList massivni oladi va har element uchun bitta qator chizadi — qatorlarni o'zingiz qo'lda yozmaysiz. Tugmani bosing.
- Kod (`List.js`) — o'zgarmaydi
- Tugma: ▶ Ro'yxatni telefonda chizish → ✓ Chizildi
- Xulosa: 3 ta mahsulot — 3 qator, avtomatik. Ko'p elementli ro'yxat uchun FlatList qulay va samarali. Endi bu ma'lumot qayerdan keladi — backend'dan.

✎ «100 ta bo'lsa ham bitta FlatList yetadi» (universal qoida emas) → «qulay va samarali»

## 4 · 1-savol ✅  `[791]`
- Savol: **Mahsulotlarning aylantiriladigan ro'yxati uchun qaysi komponent kerak?**
  - Text — har mahsulot uchun bittadan yoziladi
  - Image — har mahsulotning rasmi ko'rsatiladi
  - TextInput — mahsulot nomi kiritiladi
  - ✔ FlatList — har element uchun qator chizadi
- To'g'ri: To'g'ri! FlatList massivni oladi va har element uchun qator chizadi — ro'yxatlar (mahsulot, xabar, post) uchun qulay va samarali.
- Xato izohlari:
  - Text — bitta matn. Ko'p elementli ro'yxatni FlatList chizadi.
  - Image — rasm. Ro'yxatni FlatList chizadi (qator ichida rasm ham bo'lishi mumkin).
  - TextInput — matn kiritish uchun. Ro'yxat ko'rsatish — FlatList.
  - (umumiy) Aylantiriladigan ro'yxat — FlatList.

✎ To'g'ri javob yagona «chunki»siz variant edi → hammasi bir shaklda

## 5 · Stack Navigator  `[811]`
- Sarlavha: **Ko'p ekran — Stack Navigator.**
- Mentor: Ilovadagi ekranlarni kartalar dastasiga o'xshatish mumkin: yangi ekran ustiga qo'yiladi, «Orqaga» bosilganda olib tashlanadi. Tugmani bosing.
- Karta: 🗂️ Stack — kartalar dastasi — Ro'yxat ekrani pastda. Mahsulotni bossangiz, Tafsilot ekrani **ustiga qo'yiladi**. «Orqaga» — Tafsilot ekrani olib tashlanadi, ro'yxatga qaytasiz.
- Tugma: push va pop nima? → ✓ Ko'rdingiz
- Ochilgach:
  - ⬆️ **push:** yangi ekranni dastaning ustiga qo'yish.
  - ⬇️ **pop:** «Orqaga» — yuqoridagi ekranni olib tashlash.
  - 🌐 **Tanish:** brauzerdagi «orqaga» tugmasiga o'xshaydi, lekin mobil ilova uchun.
- Xulosa: Endi buni harakatda ko'ramiz — keyingi ekranda mahsulotni bosib, Tafsilot ekrani qanday ochilishini kuzating.

✎ «Detail ekran» → «Tafsilot ekrani» · «Metaforani ko'ring» tugmasi → «push va pop nima?»

## 6 · Navigatsiya harakatda (markaziy)  `[843]`
- Eyebrow: Sinov · navigatsiya
- Sarlavha: **Mahsulotni bosing — Tafsilot ekrani ochiladi.**
- Mentor: Mana navigatsiya harakatda. Telefon ichida mahsulotni bosing — yangi ekran o'ngdan suriladi (push). «‹ Orqaga» bilan qaytasiz (pop). Sinab ko'ring!
- Telefon yorlig'i: ro'yxat ekrani / tafsilot ekrani
- Tafsilot ekrani ichida — o'zgarmaydi (‹ Orqaga · nom · tavsif · narx · Savatga qo'shish)
- Xulosa: Har ekran — alohida komponent; Stack Navigator ularni dasta qilib boshqaradi. Erkin sinab ko'ring.

✎ «Animatsiya · navigatsiya» (ichki yorliq) → «Sinov» · «Detail» → «Tafsilot ekrani»

## 7 · navigate kodda  `[874]`
- Sarlavha: **Bir ekrandan boshqasiga: `navigation.navigate`.**
- Mentor: Bosilganda boshqa ekranga o'tish — bitta qator. `onPress` ichida `navigation.navigate` chaqirasiz va kerakli ma'lumotni (id) uzatasiz. Tugmani bosing.
- Kod (`ListScreen.js`) — o'zgarmaydi (`navigation.navigate('Detail', { id: item.id })`)
- Ochilgach:
  - 👆 **onPress:** bosilganda ishlaydi (web'dagi `onClick`).
  - 🧭 **navigate('Detail'):** Tafsilot ekraniga o'tadi — kodda bu ekranning nomi `Detail`. Ostida yangi ekran dastaga qo'yiladi (push).
  - 📦 **{ id: item.id }:** Tafsilot ekraniga qaysi mahsulot ekanini uzatadi.
  - ↩️ **Orqaga:** `navigation.goBack()` — oldingi ekranga qaytadi (pop). Ko'pincha buni «Orqaga» tugmasi o'zi qiladi.
- Xulosa: Tafsilot ekrani shu id'ni olib, o'sha mahsulotni ko'rsatadi. `navigate` — o'tish, `goBack` — qaytish.

✎ 🔴 `navigate` va `push` aralash edi, `goBack` esa darsda umuman yo'q edi → endi aniq: navigate — o'tish (ostida push), goBack — qaytish (ostida pop)

## 8 · 2-savol ✅  `[913]`
- Savol: **React Native'da bir ekrandan boshqasiga qanday o'tasiz?**
  - Sahifani qayta yuklab, boshqa fayl ochaman
  - ✔ `navigation.navigate('Ekran')` chaqiraman
  - Web'dagidek `<a href>` tegi bilan o'taman
  - Har ekranni alohida ilova qilib yozaman
- To'g'ri: To'g'ri! Stack Navigator ekranlarni boshqaradi: `navigation.navigate('Ekran')` bilan yangi ekranga o'tasiz, «Orqaga» tugmasi yoki `navigation.goBack()` bilan qaytasiz.
- Xato izohlari:
  - Mobil ilova web emas — sahifa qayta yuklanmaydi. `navigation.navigate` ishlatiladi.
  - `<a href>` — bu web. React Native'da `navigation.navigate`.
  - Aksincha — bitta ilova, ko'p ekran; navigatsiya ularni bog'laydi.
  - (umumiy) `navigation.navigate` (Stack Navigator).

✎ «back bilan qaytasiz (pop)» (noaniq) → «Orqaga» tugmasi yoki `goBack()` · variantlar tenglashtirildi

## 9 · fetch  `[933]`
- Sarlavha: **Ma'lumot — fetch bilan backend'dan.**
- Mentor: Mahsulotlarni kodga qo'lda yozmaysiz. `useEffect` ichida `fetch` bilan backend darslaridagi **o'sha Node.js server**dan olasiz — web-saytdagi bilan bir xil API. Tugmani bosing.
- Kod (`ListScreen.js`):
  ```js
  const [mahsulotlar, setM] = useState([])

  useEffect(() => {
    fetch(BACKEND + '/products')   // BACKEND — backend darslaridagi server manzili
      .then(r => r.json())
      .then(setM)
  }, [])
  ```
- Ochilgach (🔌 O'SHA BACKEND): Bu — backend darslarida qurgan Node.js API'ingiz. Web-sayt ham, mobil ilova ham **bitta backend**dan ma'lumot oladi. 1-darsdagi «ko'p kirish yo'li, bitta tizim»ni eslang.
- Xulosa: `useEffect` + `fetch` — aynan web React'dagidek. Backend'ni qayta qurmaysiz — mobil ilovani unga ulaysiz.

✎ 🔴 FAKT: `/mahsulotlar` → `/products` (backend darslarida va 8-darsda shu nom) · `'https://backend.../mahsulotlar'` (ishlamaydigan manzil) → `BACKEND + '/products'` izoh bilan · «Modul 4/9'dagi» → «backend darslarida» · «ko'p eshik» → «ko'p kirish yo'li» (1-dars v2)

## 10 · fetch harakatda (markaziy)  `[968]`
- Eyebrow: Sinov · fetch
- Sarlavha: **Ilova ochildi → backend'dan ma'lumot keladi.**
- Mentor: Mana fetch harakatda: ilova avval bo'sh (yuklanmoqda), keyin backend'dan mahsulotlar kelib, ro'yxat to'ladi. Tugmani bosing.
- Sxema va tugmalar — o'zgarmaydi
- Xulosa: Ma'lumot serverda turadi: ilova backend'ga so'rov yuborib, undagi ma'lumotni oladi. Shu sabab mahsulotlarni kodning ichida qo'lda yozib yurish shart emas — serverda mahsulot qo'shsangiz, ilova keyingi so'rovda uni oladi.

✎ «har ochilganda eng yangisini oladi», «kod o'zgartirmasdan ilovada paydo bo'ladi» (qat'iy) → aniq ifoda: so'rov yuborib oladi · «Animatsiya» → «Sinov»

## 11 · 3-savol ✅  `[1003]`
- Savol: **Mobil ilova mahsulotlar ro'yxatini qayerdan oladi?**
  - Kodga qo'lda yozilgan massivdan
  - Telefonning o'z xotirasidan
  - ✔ Backend'ga so'rov yuborib
  - Internetdagi tasodifiy saytdan
- To'g'ri: To'g'ri! Mobil ilova backend'ga `fetch` bilan so'rov yuboradi va ma'lumotni oladi — bu web-sayt ham ishlatadigan o'sha Node.js server. Bitta backend, ko'p kirish yo'li.
- Xato izohlari:
  - Qo'lda yozilgan massiv o'zgarmaydi. Yangilanadigan ma'lumot backend'dan keladi.
  - Telefon xotirasi — kichik mahalliy ma'lumot uchun. Asosiy ma'lumot backend'da.
  - Tasodifiy emas — aniq backend'dan (sizning serveringiz).
  - (umumiy) Backend'dan, `fetch` bilan.

✎ 🔴 To'g'ri javob yagona uzun va «fetch» so'zli variant edi → tenglashtirildi (fetch endi izohda)

## 12 · Asosiy oqim (case)  `[1023]`
- Sarlavha: **Mini-do'kon mobil ilovasi — boshidan oxirigacha.**
- Mentor: Mana hammasi birga: ilova ochiladi, backend'dan ma'lumot keladi, ro'yxat chiqadi, mahsulotni bossangiz Tafsilot ekrani ochiladi. Tugmani bosib, 5 qadamni kuzating.
- Qadamlar:
  1. 📱 Ilova ochildi — birinchi ekran (mahsulotlar ro'yxati).
  2. 🔌 Backend'dan fetch — mahsulotlar yuklanmoqda…
  3. 📋 FlatList — 3 mahsulot ro'yxati ko'rindi.
  4. 👆 «Telefon»ni bosish — `navigation.navigate('Detail')` → Tafsilot ekrani ochiladi.
  5. ✅ Tafsilot ekrani: tavsif, narx, «Savatga». Asosiy oqim ishladi!
- Xulosa: Ro'yxat (backend'dan) + Tafsilot ekrani (navigatsiya) — mana mini-do'konning asosiy oqimi ishladi. Real ilovada yana yuklanish belgisi, xato holati kabi qismlar ham bo'ladi — ularni keyin qo'shasiz. Amaliyotda shu oqimni o'zingiz qurasiz.

✎ «to'liq ishlaydigan mobil ilova» → «asosiy oqimi ishladi» + halol eslatma · «tap» → «bosish» · «Amaliyot darsida o'zingiz quryapsiz» (zamon) → «qurasiz» · sarlavha bosh harf bilan · ChatGPT'ning «sarlavhada 4 qadam, ichida 5» bandi — darsda yo'q: «4 qadam» faqat 1-ekran rejasida, 12-ekranda qadamlar 5 ta va hisoblagich avtomatik; xato mening MD-jadvalimda edi

## 13 · AsyncStorage (qo'shimcha tanishuv)  `[1066]`
- Eyebrow: Qo'shimcha · AsyncStorage
- Sarlavha: **AsyncStorage — telefonning o'zida kichik ma'lumot saqlash.**
- Mentor: Ba'zi kichik narsalarni telefonning o'zida saqlash qulay — masalan, savatdagi mahsulotlar yoki foydalanuvchi sozlamalari. Buning uchun AsyncStorage ishlatiladi — web'dagi localStorage'ga o'xshaydi. Bugun faqat tanishib qo'yamiz. Tugmani bosing.
- Kod (`cart.js`):
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
✎ 🔴 TEXNIK (razrabotkada topildi, F-0929-29): oldingi kodda `savat` avval ishlatilib, keyin `const savat` bilan qayta e'lon qilinardi, `await` funksiyasiz turardi — bir joyga ko'chirilsa ishlamasdi → ikki kichik `async` funksiya
- Ochilgach:
  - 🛒 **Savat:** ilovani yopib ochsangiz ham saqlanib qoladi.
  - ⚙️ **Sozlamalar:** masalan, tanlangan til yoki mavzu.
  - ⚠️ Faqat kichik, mahalliy ma'lumot uchun. Asosiy ma'lumot — baribir backend'da.
- Xulosa: AsyncStorage — telefondagi kichik xotira. Backend bilan birga ishlaydi, uning o'rnini bosmaydi.

✎ 🔴 Kod ishlamaydigan edi (`json` qayerdan kelgani yo'q) → to'liq ishlaydigan kod (`JSON.stringify` / `JSON.parse`) · «Token / «kirgan» holat» olib tashlandi — autentifikatsiya mavzusi, hozir chalg'itadi · «o'tgan darsdagi baza g'oyasi» (noaniq) olib tashlandi · ekran «qo'shimcha tanishuv» deb belgilandi (keyingi darslarda AsyncStorage yo'q — tekshirildi, shuning uchun «keyingi darsga ko'chirish» taklifi bajarilmaydi)

## 14 · 4-savol ✅  `[1103]`
- Savol: **Web-do'koningiz bor. Mobil ilova uchun backend'ni nima qilasiz?**
  - ✔ O'sha backend'ga ulayman
  - Mobil uchun yangi backend quraman
  - Backend'siz, hammasini telefonda qilaman
  - Ma'lumotni qo'lda ko'chirib olaman
- To'g'ri: To'g'ri! Backend va baza tayyor — ular har qanday kirish yo'li bilan ishlaydi. Mobil ilova ham o'sha API'ga `fetch` bilan so'rov yuboradi. API mos bo'lsa, yangi backend qurish shart emas.
- Xato izohlari:
  - Ko'pincha mavjud backend yetadi. Yangi backend qursangiz, ma'lumot ikkiga bo'linib ketishi mumkin.
  - Backend kerak — umumiy ma'lumot u yerda. Telefon uni ko'rsatadi.
  - Qo'lda ko'chirish — xatoga olib keladi va tez eskiradi. Bitta umumiy backend qulay.
  - (umumiy) O'sha backend'ga ulaysiz.

✎ «Yangi backend — keraksiz va xato» (qat'iy) → «ko'pincha mavjud backend yetadi; API mos bo'lsa» · to'g'ri javob eng uzuni va «fetch»li edi → tenglashtirildi

## 15 · Ilova oqimini yig'ing ✅ (final)  `[1123]`
- Sarlavha: **Oxirgi qadam: ilova oqimini to'g'ri tartibda yig'ing.**
- Mentor: Ko'p ekranli ilova qanday ishlaydi? Qadamlarni o'ng tomondan to'g'ri tartibda tanlang.
- Qadamlar (aralash): FlatList · Ilova ochildi · Tafsilot ekrani · Backend'dan fetch · Mahsulotni bosish
- Xato bosilsa: Hozir emas — avval «{kerakli qadam}» bo'lishi kerak. *(xatodan keyingi maslahat — qoladi)*
- To'g'ri: ✓ Oqim tayyor: **Ochildi → fetch → FlatList → bosish → Tafsilot ekrani**.

✎ 🔴 Mentor gapi butun tartibni aytib qo'yardi («Eslang: ilova ochiladi → backend'dan fetch → …») — olib tashlandi (4, 9-darslardagi xato bilan bir sinf) · «tap» → «bosish», «Detail ekran» → «Tafsilot ekrani»

## 16 · Amaliyot · VS Code  `[1877]`
- Sarlavha: **Ikki ekranli mini-do'kon: ro'yxat + tafsilot**
- Mentor: Bu topshiriqni o'z kompyuteringizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Topshiriq: Expo loyihangizda ikki ekranli mini-do'kon yig'ing: FlatList bilan mahsulotlar ro'yxati; mahsulotni bossangiz, `navigation.navigate` bilan Tafsilot ekrani ochilsin. Ro'yxatni backend'dan `fetch` bilan oling. Backend darslaridagi serveringiz ishlab turgan bo'lishi kerak.
- Bosqichlar:
  1. Loyihani tayyorlang: navigatsiya kutubxonasini o'rnating — buyruqlar ustoz bergan yo'riqnomada (yoki ustoz bergan tayyor loyihani oching)
  2. `Stack.Navigator`da ikki ekran e'lon qiling: `List` va `Detail`
  3. `List` ekranda `useEffect` + `fetch` bilan `/products`dan mahsulotlarni oling — backend ishlayotganini avval brauzerda tekshiring
  4. Mahsulotlarni `FlatList` bilan chizing; har qatorni `Pressable` qiling: `onPress={() => navigation.navigate('Detail', { id })}`
  5. `Detail` ekranda kelgan id'ni `route.params.id` dan oling va shu mahsulotni ko'rsating; «Orqaga» bilan ro'yxatga qayting
  ✎ 🔴 TEXNIK (F-0929-29): id qayerdan olinishi darsda hech qayerda ko'rsatilmagan edi → `route.params.id`
  - ❓ Ishlamasa: backend ishlayaptimi? manzil to'g'rimi? telefon va kompyuter bitta Wi-Fi'dami? (8-darsdagi ulanish xatosi qoidasi)

✎ 🔴 Amaliyot uchun infratuzilma yo'q edi: kursda navigatsiya kutubxonasini o'rnatish hech qayerda ko'rsatilmagan (grep bilan tekshirildi), «Stack.Navigator sozlang» esa birinchi bosqich edi → 1-bosqich «tayyorlash» qo'shildi, backend sharti va «ishlamasa» ro'yxati qo'shildi · qaror B-1 (pastda)

## 17 · Natijalar (podium)  `[1705]` — o'zgarmaydi · savol yorliqlari: 1 — FlatList · 2 — Navigatsiya · 3 — Fetch · 4 — Bitta backend · 5 — Ilova oqimi

✎ «App oqimi» → «Ilova oqimi»

## 18 · Takrorlash (kartochkalar)  `[1980]`

| Old tomon | Orqa | Izoh |
|---|---|---|
| Massivdagi ro'yxatni ekranda ko'rsatish uchun qaysi komponent? | FlatList | Har element uchun bitta qatorni o'zi chizadi |
| Bosiladigan element uchun qaysi komponent? | Pressable | Bosilganda `onPress` ichidagi kod ishlaydi |
| Rasm ko'rsatish uchun qaysi komponent? | Image | Web'dagi `<img>` kabi |
| Foydalanuvchi matn yozadigan maydon? | TextInput | Web'dagi `<input>` kabi |
| Ekranga sig'magan uzun qismni surib ko'rish uchun? | ScrollView | Barmoq bilan suriladi |
| Ko'p ekranni boshqaradigan tizim? | Stack Navigator | Ekranlar kartalar dastasidek ustma-ust turadi |
| Boshqa ekranga o'tish uchun qaysi buyruq? | navigation.navigate | Yangi ekran dastaning ustiga qo'yiladi (push) |
| Oldingi ekranga qaytish uchun? | navigation.goBack() yoki «Orqaga» | Ustki ekran olib tashlanadi (pop) |
| Backend'dan ma'lumot qanday olinadi? | fetch | Ilova serverga so'rov yuborib, javobini oladi |
| Ma'lumot ilova ochilganda bir marta yuklanishi uchun? | useEffect(…, []) | Bo'sh massiv — «faqat bir marta» degani |
| Savatni telefonning o'zida saqlash uchun? | AsyncStorage | Kichik mahalliy ma'lumot; asosiysi — backend'da |
| Mobil ilova uchun yangi backend kerakmi? | Ko'pincha yo'q — o'sha backend | Web, bot va mobil bitta serverga ulanadi |

✎ goBack kartasi qo'shildi · «konteyner», «localStorage», «Yo'q» (qat'iy) → yumshatildi

## 19 · Yakun  `[1993]`
- Sarlavha: **Endi ko'p ekranli mobil ilovaning asosiy oqimini qura olasiz.**
- Endi siz bilasiz:
  - FlatList — massivni ro'yxatga aylantiradi; Pressable, Image, ScrollView, TextInput bilan tanishdingiz
  - Navigatsiya — Stack Navigator: `navigate` bilan o'tish, `goBack` bilan qaytish
  - Backend'dan ma'lumot: `useEffect` + `fetch` — backend darslaridagi o'sha API
  - Mobil — yana bir kirish yo'li: bitta backend, ko'p kirish yo'li (web, bot, mobil)
  - Qo'shimcha: AsyncStorage — telefonda kichik mahalliy ma'lumot saqlash
- Uyga vazifa:
  - **Chizing** — mobil ilovangiz ekranlarini: qaysi ro'yxat, qaysi tafsilot ekrani?
  - **Ulang** — qaysi ekran backend'dan qaysi ma'lumotni oladi?
  - **O'ylang** — qaysi kichik ma'lumotni telefonda saqlash qulay?
- 🚀 Keyingi dars — **Praktika: mobil ilova.** Mini-do'kon mobil ilovasini boshidan oxirigacha o'zingiz qurasiz.

✎ «Endi to'liq mobil ilova qura olasiz» → «asosiy oqimini» · «Keyingi — P1» (ichki kod) → dars nomi · «token» olib tashlandi

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, teatr nomlari dars atamalariga moslanadi:
- 📋 **List Builder** — ro'yxat uchun FlatList'ni tanladingiz (4)
- 🧭 **Navigator** — `navigation.navigate` bilan ekranga o'tishni bildingiz (8)
- 📡 **Live Data** — ma'lumot backend'dan fetch bilan kelishini bildingiz (11)
- 🔁 **App Flow** — ilova oqimini to'g'ri tartibda yig'dingiz (15)

**Qisqa takrorlash oynalari (4):**
1. (4) **FlatList — ro'yxatni chizadi:** massivni oladi (mahsulotlar, xabarlar, postlar). · Har element uchun avtomatik bitta qator chizadi. · Ko'p elementli ro'yxat uchun qulay va samarali. · Sinfga savol: Aylantiriladigan ro'yxat uchun qaysi komponent kerak?
2. (8) **Navigatsiya — Stack Navigator:** ekranlar kartalar dastasidek ustma-ust turadi. · `navigate` — boshqa ekranga o'tadi (yangi ekran ustiga qo'yiladi — push). · «Orqaga» yoki `goBack` — qaytadi (ustki ekran olinadi — pop). · Sinfga savol: Bir ekrandan boshqasiga qanday o'tasiz?
3. (11) **Backend'dan fetch:** ma'lumot `fetch` bilan backend'dan olinadi. · Web-sayt ham, mobil ilova ham o'sha Node.js server'ga ulanadi. · Ma'lumot serverda turadi — ilova so'rov yuborib oladi. · Sinfga savol: Mobil ilova mahsulotlarni qayerdan oladi?
4. (14) **Bitta backend — ko'p kirish yo'li:** web, bot va mobil — bitta backend'ga ulanadi. · Ko'pincha mavjud backend yetadi — API mos bo'lsa, yangisi shart emas. · Mobil — yana bir kirish yo'li: telefon ko'rsatadi, ma'lumot serverda. · Sinfga savol: Mobil ilova uchun backend'ni nima qilasiz?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Mahsulotlar ro'yxatini ko'rsatish uchun qaysi komponent? ✔ FlatList — har element uchun qator · Text — bitta matn bo'lagi · Image — faqat rasm ko'rsatadi · TextInput — matn kiritish uchun
2. Bir ekrandan boshqasiga o'tish uchun nima chaqiriladi? Sahifani qayta yuklash · ✔ navigation.navigate('Detail') · window.location.href · <a href> tegi
3. Yangi ekran ochilganda dastada nima bo'ladi? Eski ekran butunlay o'chib ketadi · Ilova qaytadan ishga tushadi · ✔ Yangi ekran ustiga qo'yiladi (push) · Hech narsa o'zgarmaydi
4. Backend'dan ma'lumot olish uchun nima ishlatiladi? AsyncStorage bilan olinadi · localStorage bilan olinadi · Qo'lda yozilgan massivdan · ✔ fetch — API'ga so'rov
5. Ilova ochilganda ma'lumotni bir marta yuklash qayerda yoziladi? ✔ useEffect(…, []) ichida · Har chizilganda, komponent tanasida · alert oynasi ichida · Hech qayerda kerak emas
6. Savatni telefonning o'zida saqlash uchun nima? Backend bazasida saqlash · ✔ AsyncStorage — mahalliy xotira · fetch bilan yuborish · FlatList ichida saqlash
7. Web-do'koningiz bor. Mobil ilova backend'ni nima qiladi? Butunlay yangi backend quradi · Backend'siz, telefonda ishlaydi · ✔ O'sha backend'ga ulanadi · Ma'lumotni qo'lda ko'chiradi
8. Bosiladigan element (web'dagi tugma) — React Native'da qaysi? FlatList · ScrollView · Image · ✔ Pressable
9. Ko'p ekranni boshqaradigan tizim qanday nomlanadi? ✔ Stack Navigator · FlatList · AsyncStorage · useEffect
10. Rasm ko'rsatish uchun qaysi komponent? Text · ✔ Image · Pressable · FlatList
11. Matn kiritish maydoni — qaysi komponent? ScrollView · Image · ✔ TextInput · FlatList
12. Web, bot va mobil bitta serverga ulanadi. Bu nima? Har biri alohida backend · Backend umuman kerak emas · Faqat web backend'ga ulanadi · ✔ Bitta backend, ko'p kirish yo'li

✎ 12-savol «mijoz (client)» (qavsli, eng uzun) → «ko'p kirish yo'li» · 5-savol «render ichida» → oddiy ifoda

---

## B. Siz hal qiladigan qarorlar
1. **Amaliyot infratuzilmasi.** Kursda navigatsiya kutubxonasini o'rnatish hech qayerda ko'rsatilmagan, 11-dars ham «Stack Navigator boshqaradi» deb tayyor deb oladi. Ikki yo'l:
   - **Tayyor loyiha (tavsiya):** Expo + navigatsiya sozlangan starter loyiha beriladi, o'quvchi `List` va `Detail`ni to'ldiradi. Amaliyot matni «ustoz bergan tayyor loyihani oching» deydi (v2 shunday yozildi).
   - **O'rnatish qadamlari:** 16-ekranga aniq buyruqlar yoziladi. Kamchiligi: kutubxona versiyalari o'zgarib turadi, o'quvchi o'rnatishda tiqilib qolishi mumkin.
2. **AsyncStorage ekrani.** Keyingi darslarda (11, 13) AsyncStorage yo'q — tekshirildi. Shuning uchun «keyingi darsga ko'chirish» bo'lmaydi. v2'da u «qo'shimcha tanishuv» bo'lib qoldi (testsiz). Agar ekranni butunlay olib tashlashni xohlasangiz — bu tuzilma o'zgarishi (Quruvchi ishi, ekranlar soni va ball-indekslari o'zgaradi).
