# 6-Modul (LMS: 8-Modul) · 9-dars «React Native — asoslari» — MD v3

Fayl: `src/6-Modull/ReactNativeBasicsLesson.jsx` · 20 ekran · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `09-ReactNativeBasics-v2.md`. Misol-ip almashgani uchun (mini-do'kon → AvtoPizza, D1) deyarli hamma ekran to'liq yozildi; «v2 dagidek» — faqat podium.
Dasturdagi o'rni (App.jsx): oldingi — 8 «Praktika: to'liq pipeline» · bu — 9 «React Native — asoslari» · keyingi — 10 «RN: komponent, navigatsiya, API». Menyu nomi = dars nomi (DE-205), o'zgarmaydi.
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: s4 = 4-variant · s8 = 2 · s11 = 1 · s14 = 3 · s15 sentinel `0` · arena 1-2-3-4 aylanma (3/3/3/3).

---

## A. v3 qoidalari (v2 qoidalari o'z kuchida + 04.10 qonunlari)

1. **React bilimingiz saqlanadi** (v2 A-1): komponent, props, state, JSX — o'sha. Yangi: React Native komponentlari va Expo.
2. **Mos komponent, tarjima emas** (v2 A-2): `div` → `View` · `p` → `Text` · `className` → `style` (StyleSheet).
3. **Ishga tushirish** (v2 A-3): Expo → Expo Go → telefon; odatda telefon va kompyuter bitta Wi-Fi'da.
4. **Tushuncha-ekran = harakat → telefon o'zgaradi (DE-184).** Har tushuncha-ekranda o'quvchi bitta ish qiladi (tanlaydi, joylaydi, bosadi), telefon va kod fayli
   birga o'zgaradi. «Bosasiz → matn-karta» yo'q. Ish tugagach harakat paneli yopiladi, telefon fokusga keladi (199). Bashorat ballsiz (181): 2, 5, 6, 10.
5. **Metafora yo'q.** v2 dagi yagona metafora (2-ekran, sahna/aktyor) olindi — harakat o'zi ko'rsatadi (pilotdagi kabi, A-1: bu darsda kerak bo'lmadi).
6. **Bir nom — bir so'z:** «React bilimingiz» · View · Text · StyleSheet · Pressable · Expo · Expo Go · backend (1-dars, 5-Modul bilan bir xil) · «kompyuter manzili» (IP).
7. **Matn o'lchovi (162/164):** sarlavha bitta qator ≤55 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
8. **Toza yuza (185):** tugma, variant, telefon maketi ichida emoji yo'q (eski «📱 Telefon», «▶», «🟢 ulandi», «⚠️», «🚀», «📝» olinadi). Rang — faqat holat foni.

---

## Darsning ipi va bitta vizual

- **Ip (o'quvchining o'z artefakti, P-004):** AvtoPizza — Telegram bot darslaridagi namuna, `TelegramBotNest` repo'si. Menyu repo'dagi `src/api/menyu.ts` bilan aynan:
  Margarita 45 000 so'm · Pepperoni 55 000 so'm · Pishloqli 50 000 so'm. Hook'dan amaliyotgacha bitta ip — amaliyotda o'quvchi aynan shu menyuni telefonida ochadi.
- **Hook:** AvtoPizza boti Telegramda ishlaydi → mijozlar telefon ilovasini so'raydi → «hammasini noldan o'rganasizmi?».
- **Bitta vizual — AvtoPizza telefoni** (163/180, bitta manba `PITSALAR`): telefon ramkasi (F-1004-27: 9:41, kamera-orol, uy-chizig'i) + yonida kod fayli.
  Telefon holatlari: o'chiq (kulrang) → bo'sh (oq) → ilova (sarlavha «AvtoPizza», pitsa qatorlari, tugma) → xato (qizil oyna) → yangilanish (qatorlar bir lahza skelet).
  Har tushuncha-ekranda kod va telefon birga o'zgaradi; yangi qism bir lahza ajralib kiradi (DE-200).
- **Ramka — 1-dars g'oyasi:** bitta backend, ko'p kirish yo'li. 0-ekranda Telegram chat va telefon bitta Backend tuguniga ulanadi; 16-ekranda o'quvchi buni
  o'z kompyuterida yig'adi (narxni bir joyda o'zgartiradi — bot ham, ilova ham yangilanadi).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Telefon ilovasi uchun hammasini noldan o'rganasizmi?** (52)
- Mentor: AvtoPizza boti Telegramda buyurtma qabul qilyapti, mijozlar esa telefon ilovasini so'rayapti. Tugmani bosing — ilova qanday ochilishini ko'ring.
- Maket (chap): Telegram chat (AvtoPizza boti: «Tanlang:» + Margarita · Pepperoni · Pishloqli tugmalari) va o'chiq telefon yonma-yon; ikkalasidan pastga chiziq —
  bitta **Backend** tuguni (`menyu.ts`). Telefon chizig'i uzuq (bo'sh ulanish joyi).
- Tugma (ikkinchi darajali, o'ngda): Ilovani ochish → bosilgach izoh-matnga aylanadi
- **Harakat → Vizual o'zgarish:** «Ilovani ochish» → telefon yonadi, AvtoPizza ilovasi ochiladi (sarlavha, 3 pitsa qatori, «Buyurtma berish»);
  uzuq chiziq to'la bo'ladi, Backend'dan telefonga bitta konvert o'tadi; variantlar faollashadi.
- Savol: Telefon ilovasi uchun nima qilasiz?
- Variantlar (radio): Hammasini noldan o'rganaman · React bilimim bilan yozaman · Bu men uchun juda qiyin
- Javob — 2-variant: **Aynan!** Bu ilova React Native'da yozilgan: komponent, props, state — React'dagidek. (82)
- Javob — 1-variant: **Qiziq fikr!** Noldan shart emas: React bilimingizning katta qismi telefonda ham ishlaydi. (87)
- Javob — 3-variant: **Qiziq fikr!** Qiyin ko'rinadi, lekin React bilimingizning katta qismi telefonda ham ishlaydi. (91)

✎ mini-do'kon → AvtoPizza (repo ipi) · sarlavha 3 gap (97) → bitta savol · javoblar 241/132/143 → 82/87/91 · «▶ Ilovani telefonda ochish → ✓ Ko'rdingiz» →
ikkinchi darajali tugma · bot + telefon + bitta Backend (1-dars g'oyasi) · variantlardagi «— mobil butunlay boshqa» quyruqlari olindi (uzunlik teng)

## 1 · Reja  ← QReja
- Sarlavha: **Bugun AvtoPizza menyusini telefonda ochasiz.** (44)
- Mentor: React bilimingiz qoladi — unga bir nechta yangi komponent va Expo vositasi qo'shiladi.
- Chap: «Dars oxirida — AvtoPizza menyusi telefoningizda» + telefon (ilova holati, uchta pitsa va tugma).
- O'ng (01 · matn · teg):
  01 · Web va mobil: qaysi teg nimaga mos · `farq`
  02 · View, Text va StyleSheet bilan ekran · `ekran`
  03 · Expo Go bilan telefonda ochish · `expo`
  04 · Ilovani botning backend'iga ulash · `backend`

✎ «React bilimingizni telefonga olib chiqamiz» → natija va'dasi (P-014) · Mentor «Yaxshi xabar: mobil ilova — butunlay yangi dunyo emas» olindi (0-ekran javobini takrorlardi) ·
04-qadam yangi — amaliyot repo ustida (173) · 1-qadam «React Native nima» olindi (0 va 2-ekranda ochiladi, reja kashfiyotni oldindan aytmaydi — P-015)

## 2 · Bitta kod — ikki telefon  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · React Native
- Sarlavha: **Shu kod iPhone'da ham, Android'da ham ochiladimi?** (49)
- Mentor: React Native — React bilan telefon ilovasi yasash usuli. Kodni ishga tushiring, keyin telefonni almashtiring.
- Bashorat (ballsiz, 181): **Bu kod qayerda ochiladi?** · Faqat iPhone'da · Ikkalasida ham · Faqat brauzerda
- Chap: `App.js` (4 qator) + tugma «Ishga tushirish»:
  ```
  <View>
    <Text>AvtoPizza</Text>
    <Text>Margarita — 45 000 so'm</Text>
  </View>
  ```
- O'ng: telefon ramkasi + almashtirgich `iPhone | Android` (chizilgan ramka, logotip yo'q — Q3 A).
- **Harakat → Vizual o'zgarish:** «Ishga tushirish» → telefonda ilova to'liq ekranda ochiladi (manzil qatori yo'q). «Android» bosilsa ramka almashadi
  (kamera-teshik, pastki chiziq), ilova o'sha; kod faylida birorta qator o'zgarmaydi — fayl yorlig'i yonida yashil «o'zgarmadi».
- Natija qatori: «Taxminingiz: … · haqiqatda: ikkalasida ham»
- Xulosa: Ilovaning ko'p qismi bitta React kodida yoziladi va iOS hamda Android'da ochiladi. (82)
- Tugma (pastki): Ikki telefonda sinang (N/2) → Davom etish

✎ «📱 React Native nima?» matn-kartasi + «Qanday tasavvur qilish mumkin?» → ishga tushirish + platforma almashtirish (184) · sahna/aktyor metaforasi olindi ·
v2 xulosasidagi «kamera, bildirishnomalar bilan ishlay oladi» olindi (sayt ham qisman qila oladi — T-045 yolg'on qarama-qarshilik) · Mentor «Bitta kod iOS va Android'da ishlaydi» (qat'iy) → xulosada «ko'p qismi»

## 3 · Web tegi → mobil komponent  ← QTushuncha (qayta qurildi)
- Eyebrow: Farq · web va mobil
- Sarlavha: **Telefonda `div` o'rniga nima yoziladi?** (36)
- Mentor: Fikrlash usuli o'sha, faqat teglar boshqa. Har web tegini bosing va uning mobil juftini tanlang.
- Chap: web kod (`Menyu.jsx`), bosiladigan joylar pulsatsiya halqasi bilan (168) — `div` · `p` · `className`:
  ```
  <div className="menyu">
    <p>Margarita — 45 000 so'm</p>
  </div>
  ```
- Tanlov (bosilgan teg ostida, 3 chip): `View` — quti · `Text` — matn · `style` — bezak
- O'ng: brauzer oynasi (`avtopizza.uz`), ichida o'sha menyu.
- **Harakat → Vizual o'zgarish:** to'g'ri juft → kod qatori mobil shaklga o'tadi (`<div className="menyu">` → `<View style={s.menyu}>`), brauzerdagi mos qism
  bir lahza yonadi. 3/3 da brauzer oynasi telefon ramkasiga aylanadi (manzil qatori yo'qoladi, 9:41 chiqadi), menyu o'sha.
  Noto'g'ri juft → chip silkinadi, bir qator: «Teg nima qiladi: quti, matn yoki bezak?» (39)
- Xulosa: React o'sha, faqat teglar boshqa: div → View, p → Text, className → style. (74)
- Tugma (pastki): 3 tegni almashtiring (N/3) → Davom etish

✎ juftlik-chiplari + info-karta + «Web/Mobil ko'rinishi» almashtirgichi → o'quvchi juftni o'zi tanlaydi, brauzer telefonga aylanadi (184) ·
«har qanday matn Text ichida — eng muhim qoida» bu yerdan olindi — 5-ekranda o'quvchi o'zi topadi (bir gap — bir joy, T-048)

## 4 · 1-savol  ← QTest (ball · kalit 3 — 4-variant, o'zgarmaydi)
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **React Native nima uchun kerak?**
  - Saytni brauzerda tezroq ochish uchun
  - Server va baza ishini boshqarish uchun
  - Faqat mobil o'yinlar yasash uchun
  - ✔ iPhone va Android ilovasi yasash uchun
- To'g'ri izohi: Bitta React kodidan iOS va Android ilovasi chiqadi.
- Xato izohlari:
  - 1: Brauzerdagi sayt — oddiy React ishi. (36)
  - 2: Server va baza — backend ishi: NestJS va PostgreSQL. (52)
  - 3: O'yin ham bo'ladi, lekin do'kon va chat ilovasi ham. (52)
  - umumiy: Ilova qayerda ochilganini eslang. (33)

✎ savol majhul nisbatda edi («ishlatiladi» → «kerak», §194) · «React» so'zi faqat to'g'ri variantda edi (kalit so'z — T-070, 8.4) → variantlar 33–38 belgi, kalitsiz · «To'g'ri!» olindi · xato izohlari to'g'ri javobni aytmaydi (S-010)

## 5 · Matn qayerda turadi?  ← QTushuncha (qayta qurildi)
- Eyebrow: Qoida · Text
- Sarlavha: **Matnni View ichiga to'g'ridan yozsangiz nima bo'ladi?** (53)
- Mentor: View — quti, Text — matn. «Margarita» so'zini ikki joyga navbat bilan qo'yib ko'ring.
- Bashorat (ballsiz): **Nima bo'ladi?** · Matn chiqadi · Ilova xato beradi · Ekran bo'sh qoladi
- Chap: `App.js`, `<View>` ichida ikki joylash zonasi (uzuq chiziq — U-041): 1) to'g'ridan View ichida · 2) `<Text>…</Text>` ichida; karta «Margarita».
- **Harakat → Vizual o'zgarish:** «Margarita» kartasini 1-joyga qo'yish → telefon ekrani qizil xato oynasiga aylanadi, asl matn:
  `Text strings must be rendered within a <Text> component.` — ostida bir qator: «Matn Text'dan tashqarida qoldi.» (31).
  Kartani 2-joyga ko'chirish → xato yopiladi, telefonda «Margarita» chiqadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: ilova xato berdi»
- Xulosa: React Native'da har bir matn Text ichida yoziladi, aks holda ilova xato beradi. (79)
- Tugma (pastki): Ikki joyni sinang (N/2) → Davom etish

✎ kod + «Muhim qoida nima?» → ogohlantirish-karta → o'quvchi xatoni o'zi chaqiradi (asl xato matni React Native'niki, T-008) · «Image» qo'shimcha kartasi
olindi (bu darsda kerak emas) · «albatta», «Eng muhim qoida» → oddiy qoida

## 6 · StyleSheet  ← QTushuncha (qayta qurildi)
- Eyebrow: Bezash · StyleSheet
- Sarlavha: **CSS fayli yo'q — ekran qanday bezaladi?** (39)
- Mentor: Stillar JS obyektda, `StyleSheet.create` ichida yoziladi. Qiymatni bosing va telefonga qarang.
- Bashorat (ballsiz, birinchi bosishdan oldin): **Pitsa qatorlari odatda qanday turadi?** · Yonma-yon · Ustma-ust
- Chap: kod, bosiladigan qiymatlar (pulsatsiya halqasi) — rang (3 namuna) · `fontSize` 18 ↔ 26 · `flexDirection` column ↔ row:
  ```
  const s = StyleSheet.create({
    ekran:    { backgroundColor: '#FFF4E5', flexDirection: 'column' },
    sarlavha: { fontSize: 18 },
  });
  ```
- **Harakat → Vizual o'zgarish:** qiymatni bosish → kodda qiymat almashadi, telefon shu zahoti o'zgaradi: fon rangi · «AvtoPizza» sarlavhasi kattalashadi ·
  pitsa qatorlari ustma-ust ↔ yonma-yon. `backgroundColor` birinchi bosilganda yonida kulrang izoh chiqadi: `// CSS'da: background-color`.
- Natija qatori: «Taxminingiz: … · haqiqatda: ustma-ust (column)»
- Xulosa: Stil — JS obyekt; ikki so'zli nom qo'shib yoziladi: backgroundColor (camelCase). (80)
- Tugma (pastki): 3 stilni o'zgartiring (N/3) → Davom etish

✎ «CSS'dan farqi?» + 3 matn-karta (📦 🔤 📐) → qiymatni o'zgartirish + telefon · Flexbox fakti («doim Flexbox», «standart yo'nalish») bashorat-natijaga o'tdi ·
camelCase — hodisadan keyin atama (T-011)

## 7 · Birinchi ekran  ← QTushuncha (saqlanadi, aniqlashtirildi)
- Eyebrow: Ekran · yig'ish
- Sarlavha: **Birinchi ekraningizni yig'ing.** (30)
- Mentor: Bitta quti va ikkita matn — AvtoPizza ilovasining boshlanishi.
- Chap: qo'shish tugmalari — View — quti · Text — sarlavha · Text — pitsa; ostida `App.js` jonli yoziladi.
- **Harakat → Vizual o'zgarish:** tugmani bosish → `App.js` ga qator yoziladi va telefonda o'sha qism ajralib kiradi: View — ekranda quti chegarasi
  bir lahza ko'rinadi · Text — «AvtoPizza» · Text — «Margarita — 45 000 so'm». 3/3 da qo'shish paneli yopiladi, telefon fokusga (199).
- Xulosa: Birinchi ekran tayyor: View ichida ikkita Text. (47)
- Tugma (pastki): Ekranni yig'ing (N/3) → Davom etish

✎ ip AvtoPizza · sarlavha 56 («— telefonda paydo bo'ladi») → 30 · Mentor 2 gap (ekranni ta'riflardi) → 1 · xulosa 3 gap → 1 · «📱 Telefon» emoji olindi ·
auditda eng kuchli zanjir (7 → 12 → 16) saqlandi

## 8 · 2-savol  ← QTest (ball · kalit 1 — 2-variant, o'zgarmaydi)
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **AvtoPizza ekranida «Margarita» so'zini qayerga yozasiz?**
  - `<View>` ichiga
  - ✔ `<Text>` ichiga
  - `<div>` ichiga
  - `<p>` ichiga
- To'g'ri izohi: Har bir matn Text ichida turadi, shunda ilova xato bermaydi.
- Xato izohlari:
  - 1: View — quti, matnni o'zi ko'rsatmaydi: ilova xato beradi. (57)
  - 3: `<div>` — web tegi, telefonda u yo'q. (35)
  - 4: `<p>` ham web tegi, telefonda ishlamaydi. (39)
  - umumiy: Ilova qachon xato berganini eslang. (35)

✎ «Har doim» (kafolat so'zi va faqat to'g'ri variantdagi kalit) olindi · «Web'dagidek» ikki variantda takror edi → to'rtala variant bir shaklda · savol ipda · `questionText` yangilanadi (KOD)

## 9 · Expo  ← QTushuncha (qayta qurildi)
- Eyebrow: Vosita · Expo
- Sarlavha: **Telefon ilovasi loyihasini qaysi buyruq yaratadi?** (49)
- Mentor: Expo — React Native loyihasini yaratadigan va ishga tushiradigan vosita. Bugungi ish uchun Xcode yoki Android Studio shart emas.
- Chap: terminal (qorong'i, `$` qatorlari, DE-200), qadam-ro'yxati 2 band (163.8), joriy buyruq pulsatsiyada:
  1. `npx create-expo-app mobile --template blank`
  2. `cd mobile` · `npx expo start`
- O'ng: papka daraxti `TelegramBotNest/` (`src/`, `package.json`), uzuq joy — `mobile/`; chetda kichik telefon «Expo Go».
- **Harakat → Vizual o'zgarish:** 1-buyruq → terminalda yuklanish qatori, keyin `Your project is ready!`; daraxtda `mobile/` ochiladi: `App.js` · `package.json` · `assets/`.
  2-buyruq → terminalda chizilgan QR kod va `› Metro waiting on exp://192.168.1.5:8081`; telefon yorlig'i «Expo Go: QR kutilmoqda».
- Xulosa: Birinchi buyruq loyihani yaratadi, ikkinchisi uni ishga tushirib QR kod beradi. (79)
- Tugma (pastki): 2 buyruqni ishga tushiring (N/2) → Davom etish

✎ «🧰 Expo nima?» karta + «Nega Expo qulay?» + 3 info-karta (⚡ 🛠 📱) → terminal va papka daraxti (184) · buyruqlar 16-ekran 1-qadami bilan aynan ·
«Boshlovchilar uchun qulay», «tayyor to'plam» olindi · Mentor 3 gap → 2 · terminal chiqishi asl Expo CLI matni (T-008; muhrdan oldin tekshiriladi — REPO 6)

## 10 · Expo Go  ← QTushuncha (kengaytirildi; F-1004-29 qatori saqlanadi)
- Eyebrow: Telefonda · Expo Go
- Sarlavha: **Telefon boshqa tarmoqda bo'lsa, ilova ochiladimi?** (49)
- Mentor: Expo Go — telefondagi ilova: kompyuterdagi QR kodni skanerlab, loyihani ochadi. Hozir telefon mobil internetda.
- Bashorat (ballsiz): **Ilova ochiladimi?** · Ochiladi · Ochilmaydi
- Maket (bitta qator): kompyuter (QR, `npx expo start`, yorliq «Wi-Fi: Sinf») → o'q → telefon (Expo Go, yorliq «Mobil internet»).
  Chapda qadam-ro'yxati (163.8): 1 QR skan · 2 Wi-Fi'ga ulash · 3 Yana QR skan · 4 Kodni saqlash. Joriy qadam tugmasi karta ostida o'ngda (187).
- **Harakat → Vizual o'zgarish:**
  1. «QR kodni skanerlash» → telefonda Expo Go xato oynasi (qizil), o'q uziladi; bir qator: «Telefon va kompyuter boshqa tarmoqda.» (37)
  2. «Wi-Fi'ga ulash» → telefon yorlig'i «Wi-Fi: Sinf», ikki qurilma orasidagi o'q yashil.
  3. «QR kodni skanerlash» → telefonda AvtoPizza ilovasi ochiladi.
  4. «Kodni saqlash» (kompyuterda `App.js`: Margarita narxi 45 000 → 47 000) → konvert o'q bo'ylab yuradi, ostida yorliqlar navbat bilan yonadi:
     Kodni saqlash · Expo'da yig'ish · Wi-Fi orqali yuborish · Expo Go'da qabul · Telefonda yangi ekran; telefonda narx 47 000 bo'ladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: ochilmadi — tarmoq boshqa edi»
- Xulosa: Odatda telefon va kompyuter bitta Wi-Fi'da bo'ladi; kodni saqlasangiz, telefon yangilanadi. (91)
- Tugma (pastki): 4 qadamni bajaring (N/4) → Davom etish

✎ bitta «QR kodni skanerlash» → Wi-Fi sharti o'quvchining o'z xatosi orqali (v2 da faqat Mentor gapida edi; sinfda eng ko'p uchraydigan muammo) ·
4-qadam — kod yo'li (15-ekran finali shu yerda o'rgatiladi, P-063) · «🟢 ulandi», «Mana natija!» olindi · Mentor 3 gap → 2 · «Tugmani bosib ko'ring!» olindi (T-047)

## 11 · 3-savol  ← QTest (ball · kalit 0 — 1-variant, o'zgarmaydi)
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Expo Go nima qiladi?**
  - ✔ QR kod orqali loyihani telefonda ochadi
  - Telefonda kodni sizning o'rningizga yozadi
  - QR kod bilan ma'lumotni bazaga saqlaydi
  - Loyihani faqat kompyuter brauzerida ochadi
- To'g'ri izohi: Expo Go QR orqali loyihani ochadi va saqlangan o'zgarishni ko'rsatadi.
- Xato izohlari:
  - 2: Kodni siz yoki AI yozasiz; Expo Go kod yozmaydi. (48)
  - 3: Ma'lumotni backend va baza saqlaydi. (36)
  - 4: Expo Go — brauzer emas, telefondagi ilova. (42)
  - umumiy: QR skanerlangandan keyin nima bo'lganini eslang. (48)

✎ «QR kod» va «telefonda» faqat to'g'ri variantda edi → chalg'ituvchilarda ham (8.4) · variantlar 39–43 belgi · xato izohlari to'g'ri javob ifodasini aytmaydi (S-010)

## 12 · To'liq menyu  ← QTushuncha (qayta qurildi; case)
- Eyebrow: Hayotiy · to'liq menyu
- Sarlavha: **Menyuga pitsa qo'shsangiz, ekran nima bo'ladi?** (46)
- Mentor: Pitsalar bitta massivda turadi, ekran ularni `.map` bilan chizadi. Tugma uchun yangi komponent — Pressable, ya'ni bosiladigan element.
- Chap: `const MENYU = [ ]` (bo'sh) + 3 tugma: Margarita · Pepperoni · Pishloqli; ostida o'zgarmaydigan kod:
  ```
  {MENYU.map(p => <Text key={p.nom}>{p.nom} — {p.narx} so'm</Text>)}
  <Pressable onPress={() => Alert.alert('AvtoPizza', 'Tez orada!')}>
    <Text>Buyurtma berish</Text>
  </Pressable>
  ```
- O'ng: telefon — «AvtoPizza» sarlavha, bo'sh ro'yxat (sokin skelet), xira «Buyurtma berish».
- **Harakat → Vizual o'zgarish:** pitsa qo'shish → massivga qator yoziladi, telefonda yangi qator ajralib tushadi; `.map` qatori bir lahza yonadi (u o'zgarmadi).
  3/3 da «Buyurtma berish» faollashadi; o'quvchi telefondagi tugmani bosadi → telefon ustida tizim oynasi «AvtoPizza · Tez orada!».
- Xulosa: Ekran massivdan chiziladi: pitsa qo'shilsa, kod emas, faqat ma'lumot o'zgaradi. (79)
- Tugma (pastki): 3 pitsani qo'shing (N/3) → Telefondagi tugmani bosing → Davom etish

✎ «▶ Qurishni boshlash / Keyingi qator →» kuzatuvi → massivni o'quvchi to'ldiradi, `.map` va Pressable ishlaydi (184) · Pressable Mentor gapida bir jumla bilan (v2 tuzatishi saqlandi) ·
xulosa 2 gap → 1 · «Tez orada» — bot darslaridagi tugmalarning birinchi javobi bilan bir xil · massiv g'oyasi amaliyotga ko'prik (menyu backend'dan keladi)

## 13 · O'sha React  ← QTushuncha (qayta qurildi)
- Eyebrow: Tanish · o'sha React
- Sarlavha: **Telefon ilovasida React'dan nima o'zgarmaydi?** (45)
- Mentor: Telefonda bosing — kodda qaysi qator ishlaganini kuzating.
- Chap: kod (3 qator) + 3 kulrang yorliq: Props · State · fetch
  ```
  function PitsaQator({ nom, narx }) { … }
  const [savat, setSavat] = useState(0);
  useEffect(() => { fetch(API_URL + '/menyu') … }, []);
  ```
- O'ng: telefon — yuqorida ↻, 3 pitsa qatori (har birida «+»), pastda «Savat: 0».
- **Harakat → Vizual o'zgarish:**
  - pitsa nomini bosish → qator ustida pufak `nom="Pepperoni" narx={55000}`, kodda `PitsaQator` qatori yonadi → «Props» yashil;
  - «+» → «Savat: 1», kodda `setSavat` yonadi → «State» yashil;
  - ↻ → qatorlar bir lahza skeletga aylanib qayta chiziladi, kodda `fetch` qatori yonadi → «fetch» yashil.
- Xulosa: Props, state va fetch — React darslaridagidek; yangisi faqat View, Text va Pressable. (85)
- Tugma (pastki): 3 ta tanish narsani toping (N/3) → Davom etish

✎ 3 chip → info-karta → telefondagi harakat kodni yoritadi (184) · «Komponentlar» alohida band emas (props bandida ko'rinadi) ·
fetch qo'shildi — React darslarida o'tilgan («API bilan ishlash: GET»), amaliyotda ilova menyuni shu bilan oladi · Mentor 2 gap → 1

## 14 · 4-savol  ← QTest (ball · kalit 2 — 3-variant, o'zgarmaydi)
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Web React'ni bilasiz. Mobil uchun asosan nimani qo'shimcha o'rganasiz?**
  - Hammasini noldan — React bu yerda yordam bermaydi
  - Boshqa dasturlash tilini (masalan, Java yoki Swift)
  - ✔ Yangi komponentlarni (View, Text) va Expo'ni
  - Hech narsani — web va mobil kodi aynan bir xil
- To'g'ri izohi: Props, state, fetch o'sha; yangisi — View, Text, StyleSheet va Expo.
- Xato izohlari:
  - 1: Komponent, props va state telefonda ham ishlaydi. (49)
  - 2: React Native ham JavaScript — boshqa til shart emas. (52)
  - 4: Teglar boshqa: div o'rniga View, p o'rniga Text. (48)
  - umumiy: Telefonda nima o'zgarmaganini eslang. (37)

✎ variantlar v2 dagidek (qavs ikki variantda — kalit emas) · «To'g'ri!» olindi · izohlar ≤60

## 15 · Kod telefonga qanday yetadi? (final)  ← QTartib (ball · sentinel `s15: 0`, o'zgarmaydi)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Saqlangan kod telefonga qanday yetadi?** (38)
- Mentor: Bo'laklarni yo'l bo'ylab to'g'ri tartibda joylang.
- Bo'laklar (to'g'ri tartibda, `KOD_YOLI` — 10-ekran bilan bitta manba): Kodni saqlash · Expo'da yig'ish · Wi-Fi orqali yuborish · Expo Go'da qabul · Telefonda yangi ekran
- Uyalar: 5 ta, har birida «bu yerga qo'ying» (tartibni ochmaydi)
- Xato: Tartib xato — bo'lakni bosib qaytaring. (39)
- Xulosa (yechilgach, bir marta): Kod saqlanadi, Expo uni yig'adi va Wi-Fi orqali telefondagi Expo Go'ga yuboradi. (80)

✎ 🔴 mazmun: «bugungi mashq tartibi» (Expo → View/Text → StyleSheet → QR → Telefonda) bir nechta to'g'ri tartibga ega edi — QR skanni kod yozishdan oldin
qilish ham to'g'ri (amaliyotda aynan shunday: avval QR, keyin kod) → sabab-oqibat zanjiri, yagona tartib (S-002) · v2 tuzatishlari saqlandi (uyada javob yo'q,
Mentor tartibni aytmaydi, to'g'ri javob bir marta) · «⚠️» olindi · arena 12-savol va recap shu zanjirga moslandi

## 16 · Amaliyot — AvtoPizza ilovasi  ← amaliyot bloki (173, repo ustida · ≈25 daq)
- Eyebrow: Amaliyot · AvtoPizza ilovasi · kompyuteringizda
- Sarlavha: **AvtoPizza menyusini telefoningizda oching.** (42)
- Mentor: Telefon ilovasi botning o'sha backend'idan menyuni oladi. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da `TelegramBotNest` papkasini oching. 1-terminalda: `npm run start:dev` — «Telegram bot ulandi» chiqsin.
     2-terminalda: `npx create-expo-app mobile --template blank`, keyin `cd mobile` va `npx expo start`. Expo Go'da QR kodni skanerlang —
     telefonda `Open up App.js to start working on your app!` chiqadi.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Backend: `src/api/app.controller.ts` ga `GET /menyu` qo'sh — `src/api/menyu.ts` dagi PITSALAR ro'yxatini `[{ nom, narx }]` qilib qaytarsin. `src/main.ts` da `app.enableCors()` yoq.
     > Mobil: `mobile/App.js` da AvtoPizza menyu ekranini yoz: View ichida «AvtoPizza» sarlavha Text, ostida pitsalar (har biri Text: nom — narx so'm), pastda «**{tugma matni}**» Pressable.
     > Menyuni `useEffect` ichida `fetch` bilan ol; manzil — kompyuter IP'si (`expo-constants` dagi `hostUri`) va 3000-port. Stillar StyleSheet'da, asosiy rang **{rang}**.
     > Bot ishlashi o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — kompyuter brauzerida `localhost:3000/menyu` ni oching: uchta pitsa chiqadi. Telefonda ilova o'zi yangilanadi.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.» Telefon ochmasa — Expo terminalida `w` bosing: ilova kompyuter brauzerida ochiladi.
  4. **Telefonda va Telegramda tekshirish** — `src/api/menyu.ts` da Margarita narxini 47000 qiling va saqlang. Expo terminalida `r` bosing — telefonda
     Margarita 47 000 so'm. Telegramda botga `/menu` → Margarita: bot ham 47 000 so'm deydi.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - telefon: AvtoPizza · Margarita — 47 000 so'm · Pepperoni — 55 000 so'm · Pishloqli — 50 000 so'm · [{tugma matni}]
  - brauzer `localhost:3000/menyu`: `[{"nom":"Margarita","narx":47000},{"nom":"Pepperoni","narx":55000},{"nom":"Pishloqli","narx":50000}]`
  - Telegram: mijoz `/menu` → Margarita · bot: «Margarita — 47 000 so'm. Buyurtma qabul qilindi. Manzilingizni yozing.»
- Hammasi bajarilgach (yashil xulosa): Bitta backend, ikki kirish yo'li: narxni bir joyda o'zgartirdingiz, bot ham, ilova ham yangilandi. (98)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git checkout -f dars-6-09-done` (o'z kodingiz o'chadi). Teg topilmasa, avval:
  `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ 🔴 Expo Snack (brauzerdagi alohida mashq, botga aloqasiz) → o'quvchining o'z repo'si: bot backend'i + Expo ilova (F-1004 Q6 A, 173) · 1-dars g'oyasi (bitta backend —
ko'p kirish yo'li) o'quvchi qo'lida isbotlanadi · checklist 6 band → 4 qadam (`ScreenBlok`, 5-Modul namunasi) · «⭐ Uyda VS Code'da» olindi (asosiy yo'l endi kompyuterda) ·
«darrov» (kafolat so'zi, §221) olindi · zaxira yo'li (`w`) — yakuniy va'da bitta tashqi bog'liqlikka (telefon + Wi-Fi) osilib qolmaydi (P-026)

## 17 · Natijalar (podium) — v2 dagidek
- Savol yorliqlari (`Q_LABELS`): 1 — RN nima · 2 — Text qoidasi · 3 — Expo Go · 4 — React o'sha · 5 — Kod yo'li

✎ 5-yorliq «Mashq tartibi» → «Kod yo'li» (final mazmuni)

## 18 · Takrorlash  ← QKartochka (12 karta, tepadan, savolsiz — 174)

| Old tomon | Orqa | Izoh |
|---|---|---|
| AvtoPizza'ning telefon ilovasini qaysi vosita bilan yozasiz? | React Native | Ko'p qismi bitta kodda — iOS va Android uchun |
| Web'dagi `div` o'rniga telefonda qaysi komponentni yozasiz? | View | Quti: ichiga boshqa qismlar joylanadi |
| Web'dagi `p` o'rniga qaysi komponentni yozasiz? | Text | Ekrandagi har bir matn |
| Matnni View ichiga to'g'ridan yozsangiz nima bo'ladi? | Ilova xato beradi | Har bir matn Text ichida yoziladi |
| Telefon ilovasida stillarni qayerda yozasiz? | StyleSheet | CSS fayl emas, JS obyekt |
| CSS'dagi `background-color` ni qanday yozasiz? | backgroundColor | camelCase: ikkinchi so'z bosh harf bilan |
| Pitsa qatorlari odatda qanday joylashadi? | Ustma-ust | Yonma-yon uchun `flexDirection: 'row'` |
| Expo loyihasini qaysi buyruq yaratadi? | `npx create-expo-app` | Ishga tushirish — `npx expo start` |
| Loyihani telefonda qaysi ilova ochadi? | Expo Go | QR kodni skanerlaysiz |
| Expo Go ilovani ochmasa, nimani tekshirasiz? | Bitta Wi-Fi'dami | Telefon va kompyuter bitta tarmoqda bo'lsin |
| Bosiladigan tugma uchun qaysi komponent kerak? | Pressable | Ichiga Text qo'yiladi |
| AvtoPizza ilovasi menyuni qayerdan oladi? | Botning backend'idan | `GET /menyu` — narx bir joyda o'zgaradi |

✎ «React bilimingiz bilan mobil ilova yasash usuli qanday nomlanadi?» (javob savolda — T-070) → misol-savol · qo'shildi: View ichidagi xato, buyruq,
backend'dan menyu · olindi: «o'zgarmaydigan uchta tushuncha» (13-ekran va yakunda bor), Wi-Fi kartasi qisqardi

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ AvtoPizza telefonda · {N}/5 to'g'ri
- Sarlavha: **React bilimingiz endi telefonda ham ishlaydi.** (45)
- CTA: CODE STRIKE (arena) — o'zgarmaydi
- Endi siz bilasiz:
  - React Native — React bilan iOS va Android ilovasi
  - Web → mobil: `div` → `View`, `p` → `Text`, `className` → `style`
  - Har bir matn `<Text>` ichida yoziladi, stillar — `StyleSheet`'da
  - Expo loyihani yaratadi, Expo Go uni QR orqali telefonda ochadi
  - Telefon ilovasi botning o'sha backend'idan menyuni oladi
- Uyga vazifa (`uyga`):
  - **Menyu** — `menyu.ts` ga FIKRLAR.md dagi taklif — «Glutensiz» pitsani qo'shing va ilovada tekshiring
  - **Stil** — tugma rangini va qatorlar orasidagi bo'shliqni StyleSheet'da o'zgartiring
  - **O'ylang** — AvtoPizza ilovasiga yana qaysi ekran kerak: savat, buyurtmalarim yoki manzil?
- Keyingi dars: Keyingi dars — ilovada ikkinchi ekran: ekranlar orasida o'tish (navigatsiya) va API bilan ishlash.

✎ chip «Birinchi mobil ekran tayyor» → «AvtoPizza telefonda» · uyga vazifa repo ustida (FIKRLAR.md — 5-Modul fikrlar fayli, taklif №4) ·
«🚀», «📝» olindi · keyingi dars e'loni App.jsx sarlavhasi bilan mos («komponent, navigatsiya, API»)

---

## Nishonlar (4) — inglizcha nom va belgi qoladi (o'yin qatlami), tavsif yangilandi
- **RN Start** — React Native nima uchun kerakligini topdingiz (s4)
- **Text Rule** — matn Text ichida yozilishi qoidasini topdingiz (s8)
- **Expo Go Ready** — Expo Go loyihani telefonda qanday ochishini bildingiz (s11)
- **Same React** — React bilimingiz telefonda ham ishlashini ko'rdingiz (s14)

## Qisqa takrorlash oynalari (5) — har oynada 3 karta, emoji o'rniga koddan bitta qator (S-026); kodsiz kartada raqam
1. (s4) **React Native — telefon ilovasi**
   - Bitta kod — ikki telefon: ko'p qismi bitta React kodida, iOS va Android'da ochiladi · `import { View, Text } from 'react-native'`
   - Sayt emas — ilova: telefonda to'liq ekranda ochiladi, manzil qatori yo'q · (2)
   - React o'sha: komponent, props, state — React darslaridagidek · `function PitsaQator({ nom, narx })`
   - Sinfga savol: React Native nima uchun kerak?
2. (s8) **Matn — Text ichida**
   - Har bir matn Text ichida yoziladi · `<Text>Margarita</Text>`
   - View ichiga to'g'ridan yozilsa, ilova xato beradi · `Text strings must be rendered within a <Text> component.`
   - Web teglarining jufti: div → View, p → Text · `<View style={s.menyu}>`
   - Sinfga savol: «Margarita» so'zini qayerga yozasiz?
3. (s11) **Expo Go — telefonda ochish**
   - Expo Go QR kodni skanerlab, loyihani telefonda ochadi · `npx expo start`
   - Odatda telefon va kompyuter bitta Wi-Fi'da bo'ladi · `exp://192.168.1.5:8081`
   - Kodni saqlasangiz, telefon yangilanadi · (3)
   - Sinfga savol: Expo Go nima qiladi?
4. (s14) **React bilimi — o'sha**
   - Props va state o'sha · `const [savat, setSavat] = useState(0)`
   - Ma'lumot o'sha fetch bilan keladi · `fetch(API_URL + '/menyu')`
   - Yangisi: View, Text, StyleSheet, Pressable va Expo · `StyleSheet.create({ … })`
   - Sinfga savol: Mobil uchun asosan nimani qo'shimcha o'rganasiz?
5. (s15) **Kod telefonga qanday yetadi**
   - Kod saqlanadi, Expo uni yig'adi · `Ctrl+S`
   - Yig'ilgan kod Wi-Fi orqali telefonga boradi · (2)
   - Expo Go qabul qiladi va ekranni yangilaydi · (3)
   - Sinfga savol: Nega telefon va kompyuter bitta Wi-Fi'da bo'lishi kerak?

✎ emoji `ic` (⚛️ 📱 🌐 🔤 📦 🔁 📷 📶 ⚡ 🧩 ➕ 🚀 🧰 🎨) → kod qatori yoki raqam · 5-oyna final mazmuniga moslandi

## Jonli viktorina (arena, 12 savol) — ✔ o'rni o'zgarmaydi (0·1·2·3 aylanma), faqat matn
1. AvtoPizza uchun telefon ilovasini qaysi vosita bilan yozasiz? ✔ React Native · Telegraf · PostgreSQL · NestJS
2. Web'dagi `<div>` React Native'da nimaga mos keladi? `<p>` · ✔ `<View>` · `<div>` — o'zgarmaydi · `<span>`
3. Web'dagi `<p>` React Native'da nimaga mos keladi? `<View>` · `<div>` · ✔ `<Text>` · `<label>`
4. React Native'da har bir matnni qayerga yozasiz? `<View>` ichida to'g'ridan · `<div>` ichida · `<p>` ichida · ✔ `<Text>` ichida
5. StyleSheet nima? ✔ Stillar yoziladigan JS obyekt · Loyihaga ulanadigan .css fayl · Ma'lumot saqlaydigan jadval · Rasmlar uchun fayl formati
6. CSS'dagi background-color'ni StyleSheet'da qanday yozasiz? background-color — o'zgarmaydi · ✔ backgroundColor · bg_color · colorBackground
7. Expo nima uchun kerak? Ma'lumotlar bazasini boshqarish uchun · Tayyor saytni internetga joylash uchun · ✔ Loyihani yaratib, telefonda ochish uchun · Rasm va grafiklarni chizish uchun
8. Expo Go ilovasi QR kod bilan nima qiladi? Kodni sizning o'rningizga yozadi · Ilova ma'lumotini bazada saqlaydi · Web-saytni brauzerda ochadi · ✔ Loyihangizni telefonda ochadi
9. React Native ilova qaysi platformalarda ishlaydi? ✔ iOS va Android'da · Faqat Apple iOS'da · Faqat kompyuter brauzerida · Faqat Windows kompyuterlarida
10. React'dan React Native'ga o'tganda nima o'sha qoladi? Ekran elementlari (div, p, span) · ✔ Komponent, props va state · Alohida CSS fayl ishlatilishi · HTML teglari va tugmalari
11. React Native — bu web-saytmi? Ha, u oddiy web-sayt · Ha, faqat brauzerda ishlaydi · ✔ Yo'q — u telefon ilovasi · Yo'q — u kompyuter dasturi
12. Saqlangan kod telefonga qaysi yo'l bilan yetadi? Wi-Fi → Saqlash → Expo Go → Yig'ish → Ekran · Expo Go → Wi-Fi → Saqlash → Ekran → Yig'ish · Yig'ish → Saqlash → Ekran → Wi-Fi → Expo Go · ✔ Saqlash → Yig'ish → Wi-Fi → Expo Go → Ekran

✎ 1 «React Native nima?» → ✔ «React bilimi bilan…» (javob atama ildizini takrorlardi — T-070) → misol-savol, variantlar o'tilgan vositalar · 7 to'g'ri javob eng uzuni edi → tenglashtirildi ·
10 inkor-savol «nima O'ZGARMAYDI?» → «nima o'sha qoladi?» (S-006) · 11 «u faqat rasm» (bema'ni) → «kompyuter dasturi» · 12 final zanjiriga moslandi

**Fon so'zlari** (R-008; kod bosqichida {uz, ru}):
- arena (`QZ_BG_SHAPES`): `<View>` · `<Text>` · StyleSheet · Expo · Expo Go · useState · iOS+Android · div→View · Pressable · flex · fetch · props (+ o'yin qatlamidagi ⚛️ 📱) —
  kod so'zlari, ru'da ham o'sha · ✎ «Image» (bu darsda o'tilmaydi) → «Expo Go», «native» → «fetch»
- uyga vazifa banneri (`HW_TOKENS`): amaliyot · loyiha · mashq · natija — {ru: практика · проект · упражнение · результат} bor, o'zgarmaydi

---

## B. Kod bosqichida (KOD)
1. **Bitta manba (180):** `PITSALAR` (nom, narx — repo `menyu.ts` bilan aynan) va `KOD_YOLI` (5 bo'lak, 10 va 15-ekran). 0, 1, 2, 3, 5, 6, 7, 12, 13, 16-ekranlar shundan o'qiydi.
   Eski `MAP`, `BUILD`, `CASE_LINES`, `FLOW` — shu manbaga ko'chadi; «mini-do'kon», «📱 Telefon — 2 500 000», `Browser url="mini-dokon.uz"` → AvtoPizza.
2. **`PizzaPhone`** — telefon ramkasi (F-1004-27 o'lchami saqlanadi) holatlari: o'chiq · bo'sh · ilova · xato (qizil) · yangilanish (skelet); `platform="android"` varianti
   (kamera-teshik, pastki chiziq; logotip yo'q) — 2-ekran. Yangi qism bir lahza ajralib kiradi, `prefers-reduced-motion` da to'xtaydi (DE-200).
3. **Qolip turlari:** 0 `QKirish` (+ chat, telefon, Backend tuguni) · 1 `QReja` · 2, 3, 5, 6, 7, 9, 10, 12, 13 `QTushuncha` (`zoom`, `tugadi`) · 4, 8, 11, 14 `QuestionScreen` → `QTest` ·
   15 `QTartib` · 16 `ScreenBlok` + `PromptBox` (5-Modul `BotAiProjectLesson` dan; o'ngda telefon + brauzer JSON + `TgMock`) · 18 `QKartochka` · 19 `QYakun`.
4. **Bashorat** (2, 5, 6, 10) — `QBashorat` ballsiz, `onAnswer` ga kirmaydi; natija — `QTaxmin` bitta qator.
5. **Testlar:** s4, s8, s11 variant matnlari va izohlari yangi; `correctIdx` (3 · 1 · 0 · 2) va `INLINE_KEYS` o'zgarmaydi; `questionText` s4 va s8 yangilanadi.
   `explainCorrect` dan «To'g'ri!» olinadi.
6. **15-ekran:** `FLOW` → `KOD_YOLI`; `doneText` → xulosa; `FLOW_HINTS` «bu yerga qo'ying» qoladi; `onAnswer` `question` matni yangilanadi; `dd-wrong` dan «⚠️».
7. **16-ekran:** `ScreenLivePractice` → `ScreenBlok` (4 qadam, «Bajardim» qulfi, `practice: -1` sentinel o'zgarmaydi); prompt `{tugma matni}`, `{rang}` joylari.
8. **`QUIZ_BANK`:** 1, 4, 7, 10, 11, 12-savol matni; `correct` (0·1·2·3 aylanma) o'zgarmaydi. **`RECAPS`:** `ic` emoji → kod qatori/raqam; 15-oyna yangi.
   **`Q_LABELS`** 15 → «Kod yo'li». **`RN_FLASHCARDS`** — 12 karta (18-bo'lim). **`ACHIEVEMENTS`** tavsiflari.
9. **Yakun:** chip, `RECAP` 5, `HOMEWORK` 3, keyingi dars qatori; «🚀», «📝» olinadi. **`QZ_BG_SHAPES`:** «Image» → «Expo Go», «native» → «fetch».
10. **Darvozalar:** `npm run gates -- src/6-Modull/ReactNativeBasicsLesson.jsx` 12/12 · `lint:olchov` 0 warn (shu dars) · `lint:emoji` 185 · `lint-qolip` (q15–q21) ·
    `lint:layout` 1280/1366/390 · surat (1280 + 393).

## C. Repo (REPO) — `TelegramBotNest` (`/home/kali/Desktop/TelegramBotNest`, oxirgi teg `dars-10-done`)
1. **`dars-6-09-start`** = `dars-10-done` holati (kod o'zgarmaydi; README qatori bilan). O'quvchi `mobile/` ni o'zi yaratadi (9-ekran buyrug'i).
2. **`mobile/`** (done tegida) — `npx create-expo-app mobile --template blank` (JS shabloni; standart shablon TypeScript + expo-router, bizga ortiqcha);
   `App.js` — AvtoPizza menyu ekrani (View · Text · StyleSheet · Pressable, `useEffect` + `fetch`); backend manzili `expo-constants` `hostUri` dan (kompyuter IP) +
   `:3000` — har o'quvchining kompyuterida o'zi ishlaydi (qo'lda IP yozilmaydi); `expo-constants` o'rnatilgan.
3. **`GET /menyu`** — `src/api/app.controller.ts`: `Object.values(PITSALAR)` → `[{ nom, narx }]` (bot, AI va ilova bitta `menyu.ts` dan o'qiydi).
4. **`src/main.ts`** — `app.enableCors()` (Expo web zaxira yo'li `w` uchun; telefon uchun shart emas).
5. **Qurilish buzilmasin:** `tsconfig.build.json` `exclude` ga `mobile`; `.dockerignore` (`mobile`, `node_modules`, `.env`) — Render `Dockerfile` (`COPY . .` + `nest build`)
   `mobile/` ni qurmaydi. **README:** jadvalga «6-09 · telefon ilovasi (Expo)» qatori, «Papkalar»ga `mobile/`, «Yangi teglar» bo'limi — fork'da 6-Modul teglari yo'q:
   `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags`.
6. **Muhrdan oldin haqiqiy sinov (P-028):** Android va iPhone'da Expo Go (iOS «Local network» ruxsati), Windows'da Node 3000-port ruxsati, `w` zaxira yo'li;
   darsdagi terminal matnlari (`Your project is ready!`, `› Metro waiting on …`, `Open up App.js …`) va Expo Go xato oynasi matni shu sinovdan olinadi, taxmin qilinmaydi.
7. **`dars-6-09-done`** = 2–5 bandlar; 10-dars (`dars-6-10-start`) shu tegdan boshlanadi.

## D. Siz hal qiladigan savollar (tavsiya bilan)
1. **Ip:** mini-do'kon (Telefon 2 500 000) → AvtoPizza (repo bilan bitta ip; 10–11-darslar ham shunga o'tadi). Tavsiya: **A — AvtoPizza**.
2. **Backend'ga ulanish 9-darsdayoq** (`GET /menyu` + fetch — React darslaridan tanish, «o'sha React»); 10-dars fetch'ni yangi emas, takror sifatida beradi va
   POST/navigatsiyaga o'tadi. Muqobil B: 9-darsda menyu ilovada qo'lda, ulanish 10-darsda. Tavsiya: **A** (topshiriqdagi G2 qarori, P-001 bitta ip).
3. **Final mazmuni:** «bugungi mashq tartibi» (bir nechta to'g'ri tartib bor) → «saqlangan kod telefonga qanday yetadi» (yagona tartib; arena 12 ham). Tavsiya: **A**.
4. **Expo loyihasini o'quvchi o'zi yaratadi** (`create-expo-app`, 9-ekranda o'rgangan buyruq); teg faqat zaxira. Muqobil: `mobile/` start tegida tayyor turadi. Tavsiya: **o'zi**.

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi — App.jsx bilan mos (205): 8 «Praktika: to'liq pipeline» · 9 «React Native — asoslari» · 10 «RN: komponent, navigatsiya, API»
- [✓] Bitta misol-ip (AvtoPizza, hook → amaliyot); metafora yo'q (v2 dagi bittasi olindi); bitta vizual — AvtoPizza telefoni + kod fayli (`PITSALAR`)
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» (2, 3, 5, 6, 7, 9, 10, 12, 13; hook 0 ham) — matn-karta yo'q
- [✓] Sarlavha ≤55 (eng uzuni 53) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 (eng uzuni 98) · hook javobi ≤120 (eng uzuni 91) · xato izohi ≤60 (eng uzuni 57)
- [✓] Atamalar oldingi darslar bilan bir xil: backend (1-dars, 5-Modul), fetch/useState/props (React darslari), Antigravity, «Shu xato chiqdi: {xato}. Tuzat.» (5-Modul bloklari) ·
      siz-forma; zanjir/yorliq ot-shaklda (15-ekran bo'laklari, 10-ekran yorliqlari), tugma siz-formada; AI-prompt ichida sen-buyruq (§222 istisno)
- [✓] Testlar: variantlar uzunligi yaqin (s4 33–38 · s8 13–15 · s11 39–43), kalit so'z faqat to'g'rida emas (s4 «React», s8 «Har doim», s11 «QR/telefonda» tuzatildi) ·
      ✔ o'rni o'zgarmagan (s4=3 · s8=1 · s11=0 · s14=2 · s15=0 · arena 0·1·2·3)
- [✓] Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi, yagona to'g'ri tartib
- [✓] Emoji yuzada yo'q (nishon, arena, podium — o'yin qatlami) · kafolat so'zlari olindi («Har doim», «darrov», «albatta», «Eng muhim»); «odatda» — Wi-Fi shartida
- [✓] Ichki kodlar o'quvchi matnida yo'q (modul raqami, F-ID); tarixiy voqea yo'q · «KOD» (10 band) va «REPO» (7 band) ro'yxati to'liq
- [✓] Karta T · P · S ko'rildi: T-011 (camelCase hodisadan keyin) · T-016/017 (metafora yo'q) · T-045 («kamera, bildirishnoma» qarama-qarshiligi olindi) · T-064 (izohlarda
      «N-ekran» yo'q) · T-070 (s4, arena 1, kartochka 1) · P-001/004 (AvtoPizza ipi) · P-026/028 (`w` zaxira, REPO 6 sinov) · P-040 (13-ekran sanoq) · P-059 (4 qadam) ·
      P-063 (final 10-ekranda o'rgatiladi) · P-064 (bashorat 2, 5, 6, 10) · S-002 (final yagona) · S-006 (arena 10, 11) · S-010 (izohlar javobni aytmaydi) · S-026 (recap kod qatori)
- [✗ → savol] J-026: hook'da «Aynan!» bitta variantga — so'rovnoma emas, to'g'ri javobi bor (pilotdagi kabi); kodda `correct: true` hammaga — o'zgartirilmadi
- [✗ → savol] Reja (P-015 «dars ta'rifi bilan so'zma-so'z»): App.jsx `sub` «RN nima, Expo setup» — reja 4 qadami kengroq; `sub` ni o'zgartirish shart deb hisoblamadim (menyu nomi o'zgarmaydi)
