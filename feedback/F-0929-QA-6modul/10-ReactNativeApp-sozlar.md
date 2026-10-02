# 6-Modul (LMS: 8-Modul) · 10-dars «RN: komponent, navigatsiya, API» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/ReactNativeAppLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook (0-ekran):** o'quvchi o'tgan darsda bitta ekran qilgan; endi «real do'kon ilovasi» tugmasini bosib, telefonda 3 mahsulotli ro'yxatni ko'radi va real ilova qanday qurilishini 3 variantdan tanlaydi (qo'lda yozish / ko'p ekran + fetch / imkonsiz).
- **Markaziy mexanika:** telefon-maketida o'quvchi o'zi bosadi — FlatList ro'yxatni chizadi (3), mahsulotni bosib Detail ekranni ochadi va «‹ Orqaga» bilan qaytadi (6), fetch bilan bo'sh ilovaga ma'lumot «oqib keladi» (10), keyin hammasi birga 4 qadamda yuritiladi (12).
- **Asosiy metafora:** Stack Navigator = kartalar dastasi (yangi ekran ustiga qo'yiladi — push, «Orqaga» olib tashlaydi — pop); «bitta backend, ko'p eshik (web + bot + mobil)». Nishonlarda alohida GASTROL (teatr) tili: massovka, sahna, backstage.
- **Yakun:** ilova oqimini to'g'ri tartibda yig'ish (Ochildi → fetch → FlatList → tap → Detail), VS Code/Expo'da ikki ekranli mini-do'kon amaliyoti, kartochkalar, xulosa + uyga vazifa.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — real do'kon | hook | tugma bosib ro'yxatni ko'radi, real ilova qanday qurilishini tanlaydi | — |
| 1 | Reja | qoida | natija-telefon + bugungi 4 qadam | — |
| 2 | Yana 5 komponent | tushuncha | Image / Pressable / ScrollView / FlatList / TextInput ni bosib o'qiydi | — |
| 3 | FlatList | tushuncha | kodni ko'rib, «Ro'yxatni telefonda chizish» bosadi | — |
| 4 | 1-savol | test | aylantiriladigan ro'yxat uchun qaysi komponent | ✅ |
| 5 | Stack Navigator | tushuncha | kartalar dastasi, push/pop | — |
| 6 | Navigatsiya harakatda | markaziy | telefonda mahsulotni bosadi → Detail, «‹ Orqaga» | — |
| 7 | navigate kodda | tushuncha | Pressable + navigation.navigate qatorlari tushuntiriladi | — |
| 8 | 2-savol | test | bir ekrandan boshqasiga qanday o'tiladi | ✅ |
| 9 | fetch | tushuncha | useEffect + fetch kodi, «o'sha backend» | — |
| 10 | fetch harakatda | markaziy | bo'sh ilova → yuklanmoqda → ro'yxat | — |
| 11 | 3-savol | test | mobil ilova real mahsulotlarni qayerdan oladi | ✅ |
| 12 | To'liq ilova | case | 4 qadamda ilovani boshidan oxirigacha yuritadi | — |
| 13 | AsyncStorage | tushuncha | telefonda saqlash (savat, token) | — |
| 14 | 4-savol | test | web-do'kon bor — mobil uchun backendni nima qilasiz | ✅ |
| 15 | Oqimni yig'ing | yakuniy | 5 qadamni to'g'ri tartibda bosadi | ✅ (final) |
| 16 | Amaliyot · VS Code | praktika | Expo'da ikki ekranli mini-do'kon quradi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
mini-do'kon mobil · komponent · FlatList (ro'yxat) · Pressable · Image · ScrollView · TextInput · Detail ekran · tafsilot ·
Stack Navigator · kartalar dastasi · push (ustiga qo'yish) · pop (olib tashlash) · navigation.navigate · onPress · tap ·
backend · fetch · useEffect · «o'sha backend» · bitta backend, ko'p mijoz / ko'p eshik, bitta tizim · AsyncStorage (telefon xotirasi) · ilova oqimi

---

## 0 · Kirish — real do'kon  `[647]`
- Eyebrow: Dars · kirish
- Sarlavha: **Bitta ekran — bu hali ilova emas. Real do'kon qanday bo'ladi?**
- Mentor: T6'da bitta ekran qildingiz. Lekin haqiqiy do'konda ko'p mahsulot, tafsilot sahifasi va real ma'lumot bor. Tugmani bosing — qanday ko'rinishini tasavvur qiling.
- Telefon yorlig'i: haqiqiy ilova? (ichida «?») → bosilgach: ko'p ekran + real ma'lumot
- Telefon ichida (ro'yxat): 🛍️ mini-do'kon · Telefon 2 500 000 · Quloqchin 300 000 · Aqlli soat 800 000
- Tugma: ▶ Real do'kon ilovasi → ✓ Ko'rdingiz
- Savol: **Real ilova qanday quriladi?**
  - Har bir mahsulotni kodga qo'lda yozaman, bitta ekranda
  - Ko'p ekran (navigatsiya) + backend'dan real ma'lumot (fetch)
  - Imkonsiz — mobil ilovada faqat bitta ekran bo'ladi
- Javobdan keyin (qaysi variant tanlansa ham bir xil): Aynan! Real ilova = ko'p ekran (**navigatsiya**) + backend'dan **real ma'lumot** (fetch). Bugun mini-do'kon mobilni shunday quramiz — va u o'sha backendga ulanadi.
- Tugma: Davom etish

## 1 · Reja  `[689]`
- Eyebrow: Reja
- Sarlavha: **Bitta ekrandan — to'liq ilovaga.**
- Mentor: T6'da View/Text'ni o'rgandingiz. Bugun real ilova quramiz: ro'yxat, tafsilot ekrani, backend'dan ma'lumot. Eng muhimi — mobil **o'sha backend**ga ulanadi.
- Chap: dars oxirida — ko'p ekranli mobil do'kon · telefon yorlig'i «mini-do'kon mobil» (ichida o'sha ro'yxat)
- Bugungi 4 qadam:
  1. Ko'proq komponentlar (FlatList, Pressable…) · *komponent*
  2. Navigatsiya — ko'p ekran (Stack) · *navigatsiya*
  3. Backend'dan ma'lumot olish (fetch) · *api*
  4. AsyncStorage — telefonda saqlash · *xotira*
- Tugmalar (telefonda): 4 qadamni ko'rish / ↩ Natijani ko'rish · Boshlaymiz →

## 2 · Yana 5 komponent  `[724]`
- Eyebrow: Komponentlar
- Sarlavha: **Real ekran uchun yana 5 komponent.**
- Mentor: View va Text — asos. Real ilova uchun yana bir nechta komponent kerak. Ko'pchiligi web'dagiga o'xshaydi. Har birini bosing.
- Tugmalar va ochiladigan izohlar:
  - **Image** — Rasm ko'rsatish — web'dagi <img>.
  - **Pressable** — Bosiladigan element — onPress bilan (web'dagi onClick / tugma).
  - **ScrollView** — Aylantiriladigan konteyner — uzun kontent uchun.
  - **FlatList** — Ro'yxat — ko'p elementni samarali ko'rsatadi (mahsulot, xabar, post).
  - **TextInput** — Matn kiritish maydoni — web'dagi <input>.
- Hammasi ochilgach: Eng muhimi — **FlatList**: backend'dan kelgan mahsulotlar ro'yxatini shu bilan ko'rsatamiz. Keyingi ekranda ko'ramiz.
- Tugma: 5 komponentni oching (0/5) → Davom etish

## 3 · FlatList  `[756]`
- Eyebrow: Ro'yxat · FlatList
- Sarlavha: **FlatList — ma'lumotni ro'yxatga aylantiradi.**
- Mentor: FlatList massivni oladi va har element uchun bitta qator chizadi — o'zingiz qo'lda yozmaysiz. Tugmani bosing.
- Kod (`List.js`):
  ```js
  <FlatList
    data={mahsulotlar}
    renderItem={({item}) => (
      <Text>{item.name}</Text>
    )}
  />
  ```
- Telefon yorlig'i: FlatList natijasi · bosishdan oldin ichida `data = [ … ]`
- Tugma: ▶ Ro'yxatni telefonda chizish → ✓ Chizildi
- Xulosa: 3 ta mahsulot — 3 qator, avtomatik. 100 ta bo'lsa ham bitta FlatList yetadi. Endi bu ma'lumot qayerdan keladi — backend'dan.
- Tugma: Ro'yxatni chizing → Davom etish

## 4 · 1-savol ✅  `[791]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mahsulotlarning aylantiriladigan ro'yxati uchun qaysi komponent?**
  - Text — chunki u faqat matn ko'rsatadi
  - Image — chunki mahsulot rasmi bor
  - TextInput — chunki kiritish kerak
  - ✔ FlatList — har element uchun qator chizadi
- To'g'ri: To'g'ri! FlatList ma'lumot massivini oladi va har element uchun avtomatik qator chizadi — ro'yxatlar (mahsulot, xabar, post) uchun ideal va samarali.
- Xato izohlari:
  - Text faqat bitta matn. Ro'yxat (ko'p element) uchun FlatList kerak.
  - Image — rasm. Ro'yxatni FlatList chizadi (ichida rasm ham bo'lishi mumkin).
  - TextInput — matn kiritish uchun. Ro'yxat ko'rsatish — FlatList.
  - (umumiy) Aylantiriladigan ro'yxat — FlatList.

## 5 · Stack Navigator  `[811]`
- Eyebrow: Navigatsiya · Stack
- Sarlavha: **Ko'p ekran — Stack Navigator.**
- Mentor: Ilovada ekranlar **kartalar dastasi** kabi: yangi ekran ustiga qo'yiladi (push), "Orqaga" bilan olib tashlanadi (pop). Tugmani bosing.
- Karta: 🗂️ Stack — kartalar dastasi — Ro'yxat ekran — pastda. Mahsulotni bossangiz, Detail ekran **ustiga qo'yiladi** (push). "Orqaga" — Detail olib tashlanadi (pop), ro'yxatga qaytasiz.
- Tugma: push/pop nima? → ✓ Ko'rdingiz
- Bosilgach:
  - ⬆️ **push:** yangi ekran ochish (Detail ustiga qo'yiladi).
  - ⬇️ **pop:** "Orqaga" — yuqoridagi ekran olib tashlanadi.
  - 🌐 **Tanish:** brauzerdagi «oldinga/orqaga» kabi, lekin mobil uchun.
- Xulosa: Endi buni harakatda ko'ramiz — keyingi ekranda mahsulotni bosib, Detail ekran qanday ochilishini kuzating.
- Tugma: Metaforani ko'ring → Davom etish

## 6 · Navigatsiya harakatda (markaziy)  `[843]`
- Eyebrow: Animatsiya · navigatsiya
- Sarlavha: **Mahsulotni bosing — Detail ekran suriladi.**
- Mentor: Mana navigatsiya harakatda. Telefon ichida mahsulotni bosing — yangi ekran o'ngdan suriladi (push). "‹ Orqaga" bilan qaytasiz (pop). Sinab ko'ring!
- Telefon yorlig'i: ro'yxat ekrani / detail ekrani (push)
- Detail ekran ichida: ‹ Orqaga · mahsulot nomi · tavsif (Telefon: «Zamonaviy smartfon, 128GB xotira.» · Quloqchin: «Simsiz, shovqin bostiruvchi.» · Aqlli soat: «Salomatlik va bildirishnomalar.») · narx + «so'm» · Savatga qo'shish
- Yon karta: 👆 Sinab ko'ring — Telefonda biror mahsulotni bosing → Detail ochiladi. "‹ Orqaga" → ro'yxatga qaytadi.
- Xulosa: Mana push/pop! Har ekran alohida komponent; navigation ularni stack qilib boshqaradi. Erkin sinab ko'ring.
- Tugma: Mahsulotni oching → Davom etish

## 7 · navigate kodda  `[874]`
- Eyebrow: Kod · navigate
- Sarlavha: **Bir ekrandan boshqasiga: navigation.navigate.**
- Mentor: Bosilganda boshqa ekranga o'tish — bitta qator. `onPress` ichida `navigation.navigate` chaqirasiz va kerakli ma'lumotni (id) uzatasiz. Tugmani bosing.
- Kod (`ListScreen.js`):
  ```js
  <Pressable
    onPress={() => navigation.navigate(
      'Detail', { id: item.id }
    )}>
    <Text>{item.name}</Text>
  </Pressable>
  ```
- Tugma: Qatorlarni tushuntir → ✓ Ko'rdingiz
- Bosilgach:
  - 👆 **onPress:** bosilganda ishlaydi (web'dagi onClick).
  - 🧭 **navigate('Detail'):** «Detail» ekraniga o'tadi.
  - 📦 **{ id: item.id }:** Detail ekranga qaysi mahsulot ekanini uzatadi.
- Xulosa: Detail ekran shu id'ni olib, o'sha mahsulot tafsilotini ko'rsatadi. Aniq, oddiy.
- Tugma: Kodni o'qing → Davom etish

## 8 · 2-savol ✅  `[913]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **RN'da bir ekrandan boshqasiga qanday o'tasiz?**
  - Sahifani qayta yuklab olaman
  - ✔ navigation.navigate('Ekran') chaqiriladi
  - <a href> tegi bilan o'taman
  - Iloji yo'q — har ekran alohida ilova
- To'g'ri: To'g'ri! Stack Navigator ekranlarni boshqaradi; navigation.navigate('Ekran') bilan yangi ekran ochasiz (push), back bilan qaytasiz (pop). Bitta qator.
- Xato izohlari:
  - Mobil ilova web emas — sahifa qayta yuklanmaydi. navigation.navigate ishlatiladi.
  - <a href> — bu web. RN'da navigation.navigate.
  - Aksincha — bitta ilova, ko'p ekran, navigation ularni bog'laydi.
  - (umumiy) navigation.navigate (Stack Navigator).

## 9 · fetch  `[933]`
- Eyebrow: API · fetch
- Sarlavha: **Real ma'lumot — fetch bilan backend'dan.**
- Mentor: Mahsulotlarni kodga qo'lda yozmaysiz. `useEffect` ichida `fetch` bilan **o'sha Node.js backend**dan olasiz — web bilan bir xil API. Tugmani bosing.
- Kod (`ListScreen.js`):
  ```js
  const [mahsulotlar, setM] = useState([])

  useEffect(() => {
    fetch('https://backend.../mahsulotlar')
      .then(r => r.json())
      .then(setM)
  }, [])
  ```
- Tugma: Tanish ko'rinyaptimi? → ✓ Ko'rdingiz
- Bosilgach (karta «🔌 O'SHA BACKEND»): Bu — Modul 4/9'dagi o'sha Node.js API. Web-sayt ham, mobil ilova ham **bitta backend**dan ma'lumot oladi. O'tgan darsdagi «ko'p eshik, bitta tizim»ni eslang!
- Xulosa: `useEffect` + `fetch` — aynan web React'dagidek. Backendni qayta qurmaysiz; faqat ulaysiz.
- Tugma: Kodni o'qing → Davom etish

## 10 · fetch harakatda (markaziy)  `[968]`
- Eyebrow: Animatsiya · fetch
- Sarlavha: **Ilova ochildi → backend'dan ma'lumot oqib keladi.**
- Mentor: Mana fetch harakatda: ilova avval bo'sh (yuklanmoqda), keyin backend'dan mahsulotlar kelib ro'yxatga to'ladi. Tugmani bosing.
- Sxema: 📱 → 🔌 → 🗄️
- Tugma: ▶ Backend'dan ol (fetch) → ⏳ yuklanmoqda… → ✓ Yuklandi
- Telefon yorlig'i: ilova ochildi (ichida «bo'sh — tugmani bosing») → yuklanmoqda… → backend ma'lumoti (ro'yxat)
- Xulosa: Ma'lumot serverda turadi; ilova har ochilganda eng yangisini oladi. Mahsulot qo'shsangiz — kod o'zgartirmasdan ilovada paydo bo'ladi.
- Tugma: Ma'lumotni yuklang → Davom etish

## 11 · 3-savol ✅  `[1003]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Mobil ilova real mahsulotlarni qayerdan oladi?**
  - Kodga qo'lda yozilgan ro'yxatdan
  - Telefon xotirasidan, har doim
  - ✔ Backend API'dan — fetch so'rovi bilan
  - Internetdan tasodifiy ravishda
- To'g'ri: To'g'ri! Mobil ilova backend API'ga fetch yuboradi va real ma'lumotni oladi — bu o'sha Node.js server (web-sayt ham shundan oladi). Bitta backend, ko'p mijoz.
- Xato izohlari:
  - Qo'lda yozilgan ro'yxat o'zgarmaydi. Real, yangilanadigan ma'lumot backend'dan keladi.
  - Telefon xotirasi (AsyncStorage) — mahalliy saqlash uchun. Asosiy ma'lumot backend'da.
  - Tasodifiy emas — aniq backend API'dan (sizning serveringiz).
  - (umumiy) Backend API'dan, fetch bilan.

## 12 · To'liq ilova (case)  `[1023]`
- Eyebrow: Hayotiy · to'liq ilova
- Sarlavha: **mini-do'kon mobil — boshidan oxirigacha.**
- Mentor: Mana hammasi birga: ilova ochiladi, backend'dan ma'lumot keladi, ro'yxat chiqadi, mahsulotni bossangiz Detail ochiladi. Tugmani bosib kuzating.
- Qadamlar (har biri «qadam N» yorlig'i bilan ochiladi):
  1. 📱 Ilova ochildi — birinchi ekran (mahsulotlar ro'yxati).
  2. 🔌 Backend'dan fetch — mahsulotlar yuklanmoqda…
  3. 📋 FlatList — 3 mahsulot ro'yxati ko'rindi.
  4. 👆 «Telefon»ni tap — navigation.navigate('Detail') → Detail ekran suriladi.
  5. ✅ Detail ekran: tafsilot, narx, «Savatga». Ko'p ekranli ilova ishladi!
- Telefon yorlig'i: ilova → ro'yxat ekran → detail ekran
- Tugma: ▶ Boshlash → Keyingi qadam → → ✓ Ilova ishladi
- Xulosa: Ro'yxat (backend) + Detail (navigatsiya) — bu to'liq ishlaydigan mobil ilova. Amaliyot darsida o'zingiz quryapsiz.
- Tugma: Ilovani yuring (0/4) → Davom etish

## 13 · AsyncStorage  `[1066]`
- Eyebrow: Xotira · AsyncStorage
- Sarlavha: **AsyncStorage — telefonda saqlash.**
- Mentor: Ba'zi narsalarni telefonning o'zida saqlash kerak — masalan savat yoki «kirgan foydalanuvchi». AsyncStorage — mobil uchun localStorage. Tugmani bosing.
- Kod (`cart.js`):
  ```js
  // saqlash
  AsyncStorage.setItem('savat', json)

  // o'qish (ilova qayta ochilganda)
  const s = await AsyncStorage.getItem('savat')
  ```
- Tugma: Qachon kerak? → ✓ Ko'rdingiz
- Bosilgach:
  - 🛒 **Savat:** ilovani yopib ochsangiz ham saqlanib qoladi.
  - 🔑 **Token:** «kirgan» holatni eslab, qayta login so'ramaydi.
  - ⚠️ Faqat mahalliy, kichik ma'lumot uchun. Asosiy ma'lumot — baribir backend'da.
- Xulosa: AsyncStorage = telefon xotirasi (o'tgan darsdagi baza g'oyasi, lekin qurilmada va kichik). Backend bilan birga ishlaydi.
- Tugma: Nima uchun? → Davom etish

## 14 · 4-savol ✅  `[1103]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Web-do'koningiz bor. Mobil ilova uchun backendni nima qilasiz?**
  - ✔ O'sha backendni ishlataman — fetch bilan ulanadi
  - Mobil uchun yangi backend va baza quraman
  - Backend kerak emas — hammasi telefonda
  - Ma'lumotni qo'lda nusxalayman
- To'g'ri: To'g'ri! Backend va baza tayyor — ular har qanday mijoz bilan ishlaydi. Mobil ilova faqat yana bir mijoz: o'sha API'ga fetch yuboradi. O'tgan darsdagi «ko'p eshik, bitta tizim». Backendni qayta qurish — keraksiz.
- Xato izohlari:
  - Yangi backend — keraksiz va xato: ma'lumot bo'linib ketadi. Mobil o'sha backendga ulanadi.
  - Backend kerak — real, umumiy ma'lumot u yerda. Telefon faqat ko'rsatadi.
  - Qo'lda nusxalash imkonsiz va xato. Bitta umumiy backend yetadi.
  - (umumiy) O'sha backendni ishlatasiz — mobil unga fetch bilan ulanadi.

## 15 · Oqimni yig'ing ✅ (final)  `[1123]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: ilova ish oqimini to'g'ri tartibda yig'ing.**
- Mentor: Ko'p ekranli ilova qanday ishlaydi? Eslang: ilova ochiladi → backend'dan fetch → FlatList ro'yxat → mahsulotni tap → Detail ekran. To'g'ri qadamni o'ng tomondan tanlang.
- Chap: ilova oqimi (siz yig'yapsiz) · O'ng: qadamni tanlang (keyingisi: 0/5)
- Qadamlar (aralash tartibda ko'rinadi):
  - FlatList · ro'yxatni ko'rsatadi.
  - Ilova ochildi · birinchi ekran ochiladi.
  - Detail ekran · tafsilot ochiladi (push).
  - Backend fetch · API'dan mahsulot oladi.
  - Mahsulotni tap · navigation.navigate.
- To'g'ri tartib: Ilova ochildi → Backend fetch → FlatList → Mahsulotni tap → Detail ekran
- Xato bosilsa: Hozir emas — avval {kerakli qadam nomi} bo'lishi kerak. (masalan: «Hozir emas — avval Ilova ochildi bo'lishi kerak.»)
- To'g'ri: ✓ Oqim tayyor: **Ochildi → fetch → FlatList → tap → Detail**. Mana ko'p ekranli mobil ilova ishlash sxemasi.
- Tugma: Oqimni yig'ing → Davom etish

## 16 · Amaliyot · VS Code  `[1877]`
- Eyebrow: Amaliyot · VS Code · joy: «kompyuteringizda»
- Sarlavha: **Ko'p ekranli mini-do'kon: ro'yxat + Detail**
- Mentor: Bu topshiriqni o'z kompyuteringizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Topshiriq: Expo (yoki React Native) loyihangizda ikki ekranli mini-do'kon yig'ing: FlatList bilan mahsulotlar ro'yxati, mahsulotni bossangiz navigation.navigate bilan Detail ekran ochilsin. Ro'yxatni backend'dan fetch bilan oling.
- Bosqichlar — belgilab boring:
  1. Loyihada `Stack.Navigator` sozlang: `List` va `Detail` ekranlari
  2. `List` ekranda `useEffect` + `fetch` bilan mahsulotlarni oling
  3. Mahsulotlarni `FlatList` bilan ro'yxat qilib chizing
  4. Har qatorni `Pressable` qiling: `onPress={() => navigation.navigate('Detail', { id })}`
  5. `Detail` ekranda kelgan id bo'yicha mahsulot tafsilotini ko'rsating
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1705]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (x/5 to'g'ri) · 🏆 To'liq reyting
- Savol yorliqlari: 1 — FlatList · 2 — Navigatsiya · 3 — Fetch · 4 — Bitta backend · 5 — App oqimi

## 18 · Takrorlash (kartochkalar)  `[1980]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Massivdagi ro'yxatni ekranda ko'rsatish uchun qaysi komponent kerak? | FlatList | Har element uchun bitta qatorni o'zi chizadi |
| Bosiladigan tugma kerak bo'lsa qaysi komponent yoziladi? | Pressable | Bosilganda onPress ichidagi kod ishlaydi |
| Ilovada rasm ko'rsatish uchun qaysi komponent ishlatiladi? | Image | Web'dagi img tegining mobil varianti |
| Foydalanuvchi matn yozadigan maydon qaysi komponent? | TextInput | Web'dagi input tegining mobil varianti |
| Uzun kontentni aylantirib ko'rish uchun nima ishlatiladi? | ScrollView | Ekranga sig'magan qismi barmoq bilan suriladi |
| Ko'p ekranni boshqaradigan tizim qanday nomlanadi? | Stack Navigator | Ekranlar karta dastasidek ustma-ust turadi |
| Boshqa ekranga o'tish uchun qaysi buyruq yoziladi? | navigation.navigate | Yangi ekran dastaning ustiga qo'yiladi |
| «Orqaga» bosilganda ekranlar dastasida nima bo'ladi? | Ustki ekran olinadi | Qo'shish push, olib tashlash pop deyiladi |
| Real mahsulotlar ro'yxati backenddan qanday olinadi? | fetch | Ilova serverga so'rov yuborib javobini oladi |
| Ma'lumot ilova ochilganda bir marta yuklanishi uchun nima yoziladi? | useEffect([]) | Bo'sh massiv «faqat bir marta» degani |
| Savatni telefonning o'zida saqlash uchun nima ishlatiladi? | AsyncStorage | Mobil uchun localStorage, ilova yopilsa ham qoladi |
| Mobil ilova uchun yangi backend yozish kerakmi? | Yo'q, o'sha backend | Web, bot va mobil bitta serverga ulanadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[1993]`
- Eyebrow: Tayyor · belgi: ✓ Ko'p ekranli ilova
- Sarlavha: **Endi to'liq mobil ilova qura olasiz.**
- Endi siz bilasiz:
  - Komponentlar: FlatList (ro'yxat), Pressable, Image, ScrollView, TextInput
  - Navigatsiya — Stack Navigator: navigation.navigate (push/pop)
  - Backend'dan ma'lumot: useEffect + fetch (o'sha Node.js API)
  - Mobil — yana bir mijoz: bitta backend, ko'p eshik (web + bot + mobil)
  - AsyncStorage — telefonda mahalliy saqlash (savat, token)
- Uyga vazifa (tugma: Uyga vazifa · Amaliy topshiriqni bajarish →; fonda: amaliyot · loyiha · mashq · natija):
  - **Chizing** — mobil ilovangiz ekranlarini: qaysi ro'yxat, qaysi detail?
  - **Ulang** — qaysi ekran backend'dan qaysi ma'lumotni fetch qiladi?
  - **O'ylang** — nimani AsyncStorage'da (telefonda), nimani backend'da saqlaysiz?
- 🚀 Keyingi — P1: mini-do'kon mobil ilovasini amalda qurish (praktika).
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — x/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🎭 Full House — FlatList massovkasini tanladingiz · 🎬 Scene Changer — navigation.navigate bilan sahnani almashtirdingiz · 📡 Live Feed — Tirik ma'lumot fetch bilan kelishini bildingiz · 🎫 Backstage Pass — Ilova ish oqimini to'g'ri tartibda yig'dingiz
Nishon yozuvlari: Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (4):**
1. FlatList — ro'yxatni chizadi: Massivni oladi (FlatList ma'lumot massivini oladi — mahsulotlar, xabarlar yoki postlar ro'yxatini) · Har element — bir qator (har element uchun avtomatik bitta qator chizadi — o'zingiz qo'lda yozmaysiz) · Ko'p bo'lsa ham yengil (3 ta ham, 100 ta ham — bitta FlatList yetadi) · Savol: Aylantiriladigan ro'yxat uchun qaysi komponent kerak?
2. Navigatsiya — Stack Navigator: Ekranlar dastasi (ekranlarni karta dastasi kabi boshqaradi) · navigate — push (navigation.navigate yangi ekranni ustiga qo'yadi) · Orqaga — pop («Orqaga» yuqoridagi ekranni olib tashlaydi) · Savol: Bir ekrandan boshqasiga qanday o'tasiz?
3. Backend'dan fetch — bitta tizim: fetch bilan olinadi (real ma'lumot fetch bilan backend API'dan olinadi) · O'sha Node.js server (web-sayt ham, mobil ilova ham bitta backenddan oladi) · Doim eng yangisi (ma'lumot serverda turadi — ilova har ochilganda yangilanadi) · Savol: Mobil ilova real mahsulotlarni qayerdan oladi?
4. Bitta backend — ko'p mijoz: Ko'p eshik, bir tizim (web, bot va mobil — hammasi bir xil backendga ulanadi) · Qayta qurmaysiz (mobil uchun yangi backend kerak emas — o'sha API'ga fetch yuborasiz) · Mobil — yana bir mijoz (telefon faqat ko'rsatadi; ma'lumot umumiy serverda) · Savol: Mobil ilova uchun backendni nima qilasiz?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Mahsulotlar ro'yxatini ko'rsatish uchun qaysi komponent? ✔ FlatList — har element uchun qator · Text — faqat bitta matn bo'lagi · Image — faqat rasm ko'rsatadi · TextInput — matn kiritish uchun
2. Bir ekrandan boshqasiga o'tish uchun nima chaqiriladi? Sahifani qayta yuklash · ✔ navigation.navigate('Detail') · window.location.href · <a href> link
3. Yangi ekran ochilganda Stack'da nima bo'ladi? Eski ekran butunlay o'chib ketadi · Ilova qaytadan ishga tushadi · ✔ Ekran ustiga qo'yiladi (push) · Hech narsa saqlanmaydi
4. Backend'dan real ma'lumot olish uchun nima ishlatiladi? AsyncStorage bilan olinadi · localStorage bilan olinadi · Qo'lda yozilgan massivdan · ✔ fetch — API'ga so'rov
5. Ilova ochilganda ma'lumotni bir marta yuklash qayerda yoziladi? ✔ useEffect(() => {...}, []) ichida · render ichida, har chizilganda · alert oynasi ichida · hech qayerda kerak emas
6. Savatni telefon o'zida saqlash uchun nima? Backend bazasida saqlash · ✔ AsyncStorage — mahalliy xotira · fetch bilan yuborish · FlatList ichida
7. Web-do'koningiz bor. Mobil ilova backendni nima qiladi? Butunlay yangi backend quradi · Backendsiz, telefonda ishlaydi · ✔ O'sha backendga fetch bilan ulanadi · Ma'lumotni qo'lda nusxalaydi
8. Bosiladigan element (web'dagi tugma) — RN'da qaysi? FlatList · ScrollView · Image · ✔ Pressable
9. Ko'p ekranni boshqaradigan tizim qanday nomlanadi? ✔ Stack Navigator · FlatList · AsyncStorage · useEffect
10. Rasm ko'rsatish uchun qaysi komponent (web'dagi <img>)? Text · ✔ Image · Pressable · FlatList
11. Matn kiritish maydoni (web'dagi <input>) — qaysi? ScrollView · Image · ✔ TextInput · FlatList
12. Web, bot va mobil bitta serverga ulanadi. Bu nima? Har biri alohida backend · Backend umuman kerak emas · Faqat web backendga ulanadi · ✔ Bitta backend, ko'p mijoz (client)

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **0-ekran — har qanday javobga «Aynan!»**: noto'g'ri variant (qo'lda yozish / imkonsiz) tanlansa ham bir xil maqtov chiqadi.
- **O'quvchi tushunmaydigan ichki havolalar:** «T6'da» (0, 1-ekran), «Modul 4/9'dagi o'sha Node.js API» (9-ekran), «Keyingi — P1» (19-ekran) — o'quvchi bu kodlarni bilmaydi.
- **Inglizcha nishon nomlari va izohsiz GASTROL tili:** Full House · Scene Changer · Live Feed · Backstage Pass; «massovka», «sahnani almashtirdingiz» — dars tanasida teatr metaforasi umuman yo'q.
- **Izohsiz inglizcha/texnik so'zlar:** «tap» (12, 15-ekran, jadval), «Detail» o'zbek gap ichida («Detail ekran», «detail»), «App oqimi» (podium yorlig'i), «kontent» / «konteyner» (2-ekran, kartochka), «back bilan qaytasiz» (8-ekran), «login», «token» (13-ekran), «mijoz (client)» (viktorina 12).
- **Bir narsaning ikki nomi:** «kartalar dastasi» / «stack» / «ustma-ust» (5, 6-ekran); «tafsilot sahifasi / tafsilot ekrani / Detail ekran»; «ko'p eshik, bitta tizim» / «bitta backend, ko'p mijoz» / «Ko'p eshik, bir tizim» (RECAPS).
- **To'g'ri javob shakli bilan «sotilgan» testlar:** 11-ekran (✔ «Backend API'dan — fetch so'rovi bilan» — yagona uzun, dars so'zi «fetch» bor) · 14-ekran (✔ yagona tire bilan izohli, eng uzun, «fetch» bor) · viktorina 12 (✔ eng uzun, qavsli). 4-ekranda ham ✔ yagona variant «chunki»siz.
- **12-ekran:** «Amaliyot darsida o'zingiz quryapsiz» — zamon noto'g'ri (hali qurmayapti); sarlavha kichik harf bilan boshlanadi («mini-do'kon mobil — …»).
- **13-ekran:** «o'tgan darsdagi baza g'oyasi» — qaysi dars ekani noaniq; AsyncStorage uchun test yo'q, lekin 1-ekran rejasida 4-qadam sifatida turibdi.
