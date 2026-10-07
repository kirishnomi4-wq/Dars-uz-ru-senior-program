# 9-dars «React Native va Expo: prototip telefonda» — yakuniy matn

Fayl: `src/9-Modull/ExpoPrototypeLesson.jsx` · 19 ekran · Keyingi dars: «Loyiha kuni: poydevor — Database, kirish, deploy»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Maydon Jamoa» telefoni uch holatda: brauzer (tepada manzil qatori) · Expo Go (ramka ustida «Expo Go» yorlig'i, manzil qatori yo'q) · bosh ekran (telefonning ikonkalar ekrani).
Uch ekran: **O'yinlar** · **O'yin** · **E'lon berish**. Namuna ma'lumot (dars bo'yi bir xil):
- Shanba, 18:00 · Mahalla maydoni · 8 / 10
- Shanba, 20:00 · Maktab maydoni · 6 / 10
- Yakshanba, 10:00 · Park maydoni · 4 / 8
- Yakshanba, 17:00 · Mahalla maydoni · 9 / 10

O'yinlar ekrani: tepada «Maydon Jamoa», sarlavha «O'yinlar», to'rt o'yin kartasi (kun, soat, maydon, «8 / 10»), pastda «E'lon berish». O'yin ekrani: «‹ O'yinlar», «Shanba, 18:00», «Mahalla maydoni», «8 / 10», qo'shilganlar doiralari (10 ta joy), «Qo'shilaman» (bosilgach — «Qo'shildingiz»). E'lon berish ekrani: «‹ O'yinlar», «E'lon berish», maydonlar Kun · Soat · Maydon · Nechta odam, «Yuborish».

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Telefonda `localhost:5173` ni ochsangiz, *nima chiqadi*?
- Mentor (bosqichga qarab):
  - boshida: Jonli prototipingiz kompyuterda `localhost:5173` da ishlayapti, endi uni telefonda ochmoqchisiz — avval javobni tanlang.
  - javobdan keyin: Endi telefon ostidagi «Ochib ko'rish»ni bosing.
  - natijadan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Maket: telefon (brauzer, manzil qatorida `localhost:5173`, ekran bo'sh); orqaroqda kichik kompyuter brauzeri `localhost:5173` — «Maydon Jamoa», O'yinlar, to'rt o'yin kartasi.
- Telefon ostida tugma: Ochib ko'rish (variant tanlanguncha xira)
- Variantlar (ballsiz):
  - Prototip chiqadi — manzil kompyuterdagi bilan bir xil
  - Prototip chiqmaydi — telefon manzilni o'zidan qidiradi
  - Prototip chiqadi — ikkalasi bitta Wi-Fi'da bo'lsa
- «Ochib ko'rish» bosilgach: so'rov konverti telefon atrofida aylanib, telefonning o'ziga qaytadi; telefon ekrani kulrang, ostida kulrang qator: `localhost` — telefonning o'zi: bu yerda prototip yo'q
- Javob izohlari:
  - «Prototip chiqmaydi — telefon manzilni o'zidan qidiradi» tanlansa: **Aynan!** Telefon uchun `localhost` — telefonning o'zi. Prototip kompyuterda, telefon unga boshqa yo'l bilan yetadi.
  - «Prototip chiqadi — manzil kompyuterdagi bilan bir xil» tanlansa: **Qiziq fikr!** Manzil bir xil, lekin `localhost` har qurilmada o'zini bildiradi: telefon prototipni o'zidan qidiradi.
  - «Prototip chiqadi — ikkalasi bitta Wi-Fi'da bo'lsa» tanlansa: **Qiziq fikr!** Bitta Wi-Fi'da ham `localhost` telefonning o'zi bo'lib qoladi — kompyuter boshqa manzil bilan topiladi.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun prototipingizni *o'z telefoningizda* ochasiz.
- Mentor: Mobil trekda prototip Expo ilovasiga aylanadi, web-trekda — telefonga moslashgan saytga. Avval Maydon Jamoa misolida ko'rasiz, keyin o'z trekingizda, o'z repo'ngizda qilasiz.
- Chap — Dars oxirida: telefon (Expo Go) bir marta o'zi o'ynaydi: O'yinlar → Shanba, 18:00 kartasi bosiladi → O'yin ekrani suriladi → «Qo'shilaman» bosiladi → «8 / 10» → «9 / 10», «Qo'shildingiz»
- Reja:
  1. Ekranlarni React Native'ga ko'chirish · Expo
  2. Har ekranni alohida faylga qo'yish · navigatsiya
  3. QR orqali telefonda ochish · Expo Go
  4. Web-trekda: telefonga moslashgan sayt · adaptiv sayt · PWA
- Pastki qator: Trekingiz: mobil (yoki: Trekingiz: web · 8-darsda trek saqlanmagan bo'lsa: Trekni amaliyotda tanlaysiz) · Mentor misoli `maydon-jamoa` · tayyor holat `m11-dars-09-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Karta React Native'da
- Eyebrow: Takror · React Native
- Sarlavha: Prototipdagi karta *React Native'da* qanday yoziladi?
- Mentor: 8-Modulda `View` va `Text` bilan tanishgansiz — avval kodda bo'lakni tanlang, so'ng uning React Native juftini bosing.
- Chap — telefon (brauzer, O'yinlar), ramka ustida yorliq: prototip · React
- O'ng — kod kartasi «OyinKarta · React»; bo'laklar bosiladi (navbatdagisi halqada): ro'yxat qutisi `div`, karta `div` va `onClick={ochish}`, matn `<p>`, ko'rinish `className="…"`:
```jsx
<div className="oyinlar">
  <div className="karta" onClick={ochish}>
    <p>Shanba, 18:00</p>
  </div>
</div>
```
- Hisoblagich: Almashdi: N / 4
- Tugmalar (bo'lak tanlangach faol): View · Pressable · Text · StyleSheet
  - To'g'ri juftlik: kod bo'lagi React Native yozuviga almashadi, telefonda o'sha qism ilova ko'rinishiga o'tadi.
  - Xato juftlik (tugma silkinadi, bir qator):
    - matn bo'lagiga boshqa tugma: `View` — quti: matn uchun boshqa komponent kerak.
    - ko'rinish bo'lagiga boshqa tugma yoki boshqa bo'lakka `StyleSheet`: `StyleSheet` ko'rinish beradi — u teg o'rnida turmaydi.
    - ro'yxat yoki karta bo'lagiga `Text`: `Text` faqat matnni o'raydi — bu yerda quti kerak.
    - ro'yxatga `Pressable` yoki kartaga `View`: Ro'yxat qutisi bosilmaydi — bosiladigani karta.
- 4/4 dan keyin: telefon yorlig'i «Expo Go · React Native», kod kartasi «OyinKarta · React Native»:
```tsx
<View style={s.oyinlar}>
  <Pressable style={s.karta} onPress={ochish}>
    <Text>Shanba, 18:00</Text>
  </Pressable>
</View>
const s = StyleSheet.create({ … })
```
- Xulosa: Bu misolda karta o'sha, faqat komponentlari `View`, `Pressable` va `Text`, ko'rinishi — `StyleSheet` da.
- Tugmalar: Orqaga · Juftlarni toping (N/4) → Davom etish

## 3 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol ustida kod bo'lagi:
```tsx
<View style={s.karta}>
  Shanba, 18:00
</View>
```
- Savol: Bu karta telefonda xato beradi. *Nimani tuzatasiz?*
  - `View` ni `div` bilan almashtiraman
  - ✔ Matnni `<Text>` ichiga olaman
  - `style` ni `className` qilaman
  - Matnni `<p>` ichiga olaman
- Javob izohlari:
  - To'g'ri: React Native'da matn `<Text>` ichida turadi — `View` faqat quti.
  - A: `div` — web tegi: telefondagi ilovada u yo'q.
  - C: `className` — web'niki; React Native'da ko'rinish `style` da.
  - D: `<p>` ham web tegi — React Native uni tanimaydi.
  - Umumiy: React Native'da matn `<Text>` ichida turadi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: B — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 4 · Ekranlar fayllarda
- Eyebrow: Tushuncha · navigatsiya
- Sarlavha: Ilovaning har ekrani *qaysi faylda* turadi?
- Mentor (bosqichga qarab):
  - boshida: `src/app/` papkasidagi fayllarni birma-bir bosing — telefonda qaysi ekran ochilishini ko'rasiz.
  - 4/4 dan keyin: 8-Modulda Stack Navigator bilan ekrandan ekranga o'tgansiz — Expo Router'da ham Stack bor, faqat har ekran — alohida fayl.
- Chap — telefon (Expo Go), boshida ekran bo'sh.
- O'ng — fayl daraxti (fayllar navbat bilan halqada, ochilgani oldida ✓):
```
mobil/
  src/app/
    index.tsx
    elon.tsx
    oyin/
      [id].tsx
    _layout.tsx
```
  - `index.tsx` → telefonda O'yinlar ekrani; yonida `/`
  - `elon.tsx` → E'lon berish ekrani ustiga suriladi; yonida `/elon`
  - `[id].tsx` → O'yin ekrani (Shanba, 18:00) ustiga suriladi; yonida `/oyin/1`
  - `_layout.tsx` → yonida `<Stack />`; uch ekran bir lahza qiya ustma-ust ko'rinadi, keyin ustki ekran chiqib ketadi; qator yonida kulrang: ekran emas — ularni bog'laydi
- Daraxt ostida: `.tsx` — TypeScript'dagi React fayli: kodni agent yozadi, siz o'qiysiz · Hisoblagich: Ochildi: N / 4
- Nom qatori (4/4 dan keyin): Ekranlarni fayllar bilan tuzadigan bu navigatsiya **Expo Router** deyiladi: bu misolda har ekran o'z faylida.
- Xulosa: Bu misolda uch ekran — uch fayl; `_layout.tsx` ularni Stack qilib ustma-ust qo'yadi.
- Tugmalar: Orqaga · Fayllarni oching (N/4) → Davom etish

## 5 · Bitta fayl, to'rt o'yin
- Eyebrow: Tushuncha · [id]
- Sarlavha: To'rt o'yin uchun *nechta O'yin fayli* kerak?
- Mentor: Avval javobni belgilang, keyin O'yinlar ekranidagi to'rt kartani birma-bir bosing.
- Bashorat (ballsiz) — Avval o'zingiz belgilab ko'ring: To'rt o'yin uchun nechta O'yin fayli kerak?
  - 1 ta · 2 ta · 4 ta
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlov
- Chap — telefon (Expo Go, O'yinlar; bashoratgacha xira, navbatdagi karta halqada).
- O'ng — ikki kod kartasi:
  - `src/app/index.tsx`
```tsx
const router = useRouter();
<Pressable onPress={() => router.push(`/oyin/${o.id}`)}>
  <Text>{o.kun}, {o.soat}</Text>
</Pressable>
```
  - manzil yorlig'i: `/oyin/…`
  - `src/app/oyin/[id].tsx`
```tsx
const { id } = useLocalSearchParams();
const oyin = oyinlar.find((o) => o.id === id);
```
- Kartani bosish: `router.push` qatori yonadi → manzil yorlig'ida `/oyin/2` → `oyin/[id].tsx` kartasi yonadi, `id` yonida `= '2'` → telefonda O'yin ekrani o'sha o'yin bilan ochiladi → O'yinlar'ga qaytadi. Hisoblagich: Ochildi: N / 4
- 4/4 da: to'rt manzil `/oyin/1` · `/oyin/2` · `/oyin/3` · `/oyin/4` bitta `oyin/[id].tsx` yorlig'iga chiziq bilan ulanadi.
- Natija: ✓ Taxminingiz to'g'ri chiqdi (boshqa javobda: Taxminingiz: … · haqiqatda: **1 ta**)
- Xulosa: Bu misolda to'rt o'yin bitta `oyin/[id].tsx` faylidan ochiladi: `router.push` manzilga o'yin raqamini qo'yadi.
- Tugmalar: Orqaga · To'rt o'yinni oching (N/4) → Davom etish

## 6 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Ilovaga «Kirish» ekrani kerak. *Expo Router'da nima qilasiz?*
  - `_layout.tsx` fayliga ekran kodini yozaman
  - `index.tsx` faylining oxiriga qo'shaman
  - `App.js` da yangi Stack ekranini e'lon qilaman
  - ✔ `src/app/` da `kirish.tsx` faylini ochaman
- Javob izohlari:
  - To'g'ri: Expo Router'da ekran fayli o'z manzilida ochiladi: `kirish.tsx` — `/kirish`.
  - A: `_layout.tsx` ekranlarni Stack qiladi — o'zi ekran emas.
  - B: `index.tsx` — bitta ekran: O'yinlar ro'yxati.
  - C: Bu — 8-Moduldagi yo'l; Expo Router boshqacha ishlaydi.
  - Umumiy: Expo Router'da ekran fayli o'z manzilida ochiladi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: D — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 7 · Telefon kompyuterni qanday topadi?
- Eyebrow: Tushuncha · Expo Go
- Sarlavha: Telefon kompyuterdagi ilovani *qanday topadi*?
- Mentor (holatga qarab):
  - 1-holat: Telefon va kompyuter bitta Wi-Fi'da — telefonda «QR'ni skanerlash»ni bosing.
  - 2-holat: Endi ikkalasi maktab Wi-Fi'ida, lekin QR ochilmadi — yechimni tanlang.
  - 3-holat: Endi telefon iPhone, Expo Go esa akkaunt so'radi — yechimni tanlang.
- Holat qatori: 1-holat · bitta Wi-Fi · 2-holat · maktab Wi-Fi'i · 3-holat · iPhone (o'tilgani oldida ✓); ulangach yonida: Ulandi ✓ (2-holatda: Ulandi ✓ · sekinroq)
- Chap — telefon (ramka ustida yorliq: Android yoki iPhone), ichida Expo Go oynasi: Expo Go · Loyihalar; ostida tugma: QR'ni skanerlash
- O'rtada — tarmoq chizig'i va Wi-Fi belgisi; o'ngda — terminal `$ npx expo start` va QR.
  - 1-holat: «QR'ni skanerlash» → so'rov Wi-Fi orqali kompyuterga borib qaytadi → telefonda «Maydon Jamoa» O'yinlar ochiladi.
  - 2-holat: so'rov Wi-Fi belgisida to'xtaydi, telefonda: ulanmadi. Yechimlar: Kompyuterni qayta yoqish · `npx expo start --tunnel`
    - Xato tanlansa: Kompyuter joyida — umumiy tarmoq ulanishni to'sib qo'ydi.
    - Tunnel tanlansa: terminal `$ npx expo start --tunnel`, yangi QR, ustida bulut «internet»; so'rov internet orqali o'tadi → ulandi.
  - 3-holat: Expo Go'dagi akkaunt belgisi qizil yonadi. Yechimlar: Expo Go'ni qayta o'rnatish · Ikkalasida bitta Expo akkaunti
    - Xato tanlansa: Ilova joyida — u kompyuter bilan bitta akkaunt kutadi.
    - To'g'ri tanlansa: terminalda `$ npx expo login`, akkaunt belgisi yashil → ulandi.
- Nom qatori (2-holatdan keyin): **Tunnel** — telefon kompyuterga internet orqali ulanadigan yo'l: sekinroq, lekin umumiy tarmoqda yordam berishi mumkin.
- Xulosa: Bu darsda QR odatda bitta Wi-Fi'da ochiladi; ochilmasa — `--tunnel`, iPhone'da — bitta Expo akkaunti.
- Tugmalar: Orqaga · Uch holatni tekshiring (N/3) → Davom etish

## 8 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: Telefonni Wi-Fi'ga ulab bo'lmaydi, u mobil internetda. *QR'ni qanday ochasiz?*
  - ✔ `npx expo start --tunnel` bilan qayta ochaman
  - Expo Go'ni o'chirib, qaytadan o'rnataman
  - Loyihani boshqa nom bilan qayta yarataman
  - QR'ni kompyuter kamerasi bilan skanerlayman
- Javob izohlari:
  - To'g'ri: Tunnel telefonni kompyuterga internet orqali ulaydi — bitta Wi-Fi shart emas.
  - B: Expo Go joyida: telefon kompyuterga yetib bormayapti.
  - C: Loyiha nomi ulanishga ta'sir qilmaydi.
  - D: QR'ni telefon skanerlaydi, kompyuter uni faqat ko'rsatadi.
  - Umumiy: Tunnel telefonni kompyuterga internet orqali ulaydi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: A — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 9 · Telefon kengligida
- Eyebrow: Tushuncha · web-trek
- Sarlavha: Telefon kengligida o'yin kartalari *qanday turadi*?
- Mentor (bosqichga qarab):
  - boshida: Web-trekda prototip telefon brauzerida ochiladi — avval javobni belgilang, keyin surgich bilan sahifani telefon kengligigacha toraytiring.
  - toraytirgandan keyin: Endi «Telefon uchun qoida» kalitini yoqing.
- Bashorat (ballsiz) — Avval o'zingiz belgilab ko'ring: Telefon kengligida o'yin kartalari qanday turadi?
  - Yonma-yon qisilib qoladi · O'zi ustma-ust tushadi
- Chap — brauzer oynasi `localhost:5173`: O'yinlar, to'rt karta yonma-yon (kun va soat, maydon, son); ostida surgich: Kenglik: 1200 px (surilganda — «N px», eng torida — 390 px · telefon). Bashoratgacha xira.
- O'ng — `style.css`:
```css
.oyinlar { display: flex; gap: 12px; }
```
- 600 px dan tor oynada kartalar yonma-yon qisiladi.
- Kalit-tugma (toraytirgandan keyin faol): Telefon uchun qoida → `style.css` ga qo'shiladi va kartalar bitta ustunga tushadi:
```css
@media (max-width: 600px) {
  .oyinlar { flex-direction: column; }
}
```
- Natija: ✓ Taxminingiz to'g'ri chiqdi (boshqa javobda: Taxminingiz: … · haqiqatda: **yonma-yon qisiladi**)
- Nom qatori: Telefon kengligiga moslashadigan sayt **adaptiv sayt** deyiladi.
- Xulosa: Bu misolda `@media` oyna kengligini so'raydi: 600 px dan tor oynada kartalar ustma-ust turadi.
- Tugmalar: Orqaga · Toraytiring va qoidani yoqing (N/2) → Davom etish

## 10 · Telefonda ustma-ust
- Eyebrow: Kod yozish · adaptiv sayt
- Sarlavha: Telefonda kartalarni *ustma-ust qo'yadigan* kod yozamiz.
- Mentor: 9-Modulda `@media` bilan harakatni o'chirgansiz, bugun u oyna kengligini so'raydi — kodni o'zingiz terib yozasiz, nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.
- Chap — vazifa (bajarilgan band oldida ✓):
  1. Faylning oxiriga yozing: `@media (max-width: 600px) { }`
  2. Qavslar ichiga: `.oyinlar { flex-direction: column; }`
  3. Natija oynasida «Telefon» kengligini tanlang — kartalar ustma-ust tursin.
- Yordam (tugma, ochiladi): Kartalar o'zgarmasa, `max-width` dan keyin ikki nuqta borligini va `.oyinlar` qoidasi `@media` qavslari ichida turganini tekshiring.
- Tugma: Bajardim (kod tekshiruvdan o'tib, natija oynasida «Telefon» tanlangach ochiladi)
- O'ng — kod kartasi `style.css` (boshlang'ich holat) va tugma «Kompilyatorni ochish»; ostida: Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.
```css
.oyinlar {
  display: flex;
  gap: 12px;
}
.karta {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
}
/* telefon uchun qoida shu yerga */
```
- Kod oynasi: sarlavha «style.css — telefonda kartalar ustma-ust»; fayllar `style.css` (yuqoridagi) va `index.html` (tayyor):
```html
<div class="oyinlar">
  <div class="karta">Shanba, 18:00 · Mahalla maydoni · 8 / 10</div>
  <div class="karta">Shanba, 20:00 · Maktab maydoni · 6 / 10</div>
  <div class="karta">Yakshanba, 10:00 · Park maydoni · 4 / 8</div>
  <div class="karta">Yakshanba, 17:00 · Mahalla maydoni · 9 / 10</div>
</div>
```
  - Shartlar: Faylning oxiriga yozing: @media (max-width: 600px) { } · Qavslar ichiga: .oyinlar { flex-direction: column; }
  - Shart bajarilmasa: @media da max-width va px bilan kenglik bo'lsin. · @media ichida .oyinlar ga flex-direction: column bo'lsin.
- Kod oynasidan qaytgach — o'ngda: Natija oynasi · tugmalar Kompyuter 900 px · Telefon 390 px · ostida «Kompilyatorni ochish»
- Xulosa («Bajardim» dan keyin): Bitta `@media` qoidasi bilan o'sha sahifa telefonda ustma-ust, kompyuterda yonma-yon turadi.
- Tugmalar: Orqaga · Davom etish

## 11 · Bosh ekranga qo'shish
- Eyebrow: Tushuncha · PWA
- Sarlavha: Sayt telefonning bosh ekraniga *qanday qo'shiladi*?
- Mentor (bosqichga qarab):
  - boshida: Chrome saytni o'rnatishni taklif qilishi uchun sayt o'zi haqida kichik fayl beradi — uning maydonlarini birma-bir qo'shing.
  - 4/4 dan keyin: Endi «Netlify'ga chiqarish»ni bosing — telefon saytni HTTPS manzilda ochadi.
- Chap — telefon bosh ekrani: kulrang ikonka kataklari, bitta bo'sh joy.
- O'ng — fayl kartasi `manifest.webmanifest`, ostida kulrang: sayt o'zi haqida yozgan fayl. To'rt maydon bittadan (joriysi halqada, har birida «Qo'shish»; qo'shilgani oldida ✓):
  1. `"name": "Maydon Jamoa"` → bo'sh joy ostida «Maydon Jamoa»
  2. `"icons": [192 px, 512 px]` → bo'sh joyda ikonka; yonida `192` · `512`
  3. `"start_url": "/"` → yonida kichik ko'rinish: «Maydon Jamoa», O'yinlar, ikki karta (manzil qatori bilan)
  4. `"display": "standalone"` → kichik ko'rinishdan manzil qatori yo'qoladi
  5. Tugma «Netlify'ga chiqarish» → telefon tepasida `https://maydon-jamoa-….netlify.app` qulf bilan → ikonka bosh ekrandagi joyiga tushadi → bosiladi → O'yinlar manzil qatorisiz ochiladi; kartada ✓ `https://maydon-jamoa-….netlify.app`
- Hisoblagich: Shart: N / 5
- Nom qatori (5/5 dan keyin): Bosh ekranga ilova kabi qo'shiladigan sayt **PWA (Progressive Web App)** deyiladi.
- Xulosa: Bu misolda manifestdagi to'rt maydon va HTTPS manzil saytni telefonga o'rnatiladigan qildi.
- Tugmalar: Orqaga · Shartlarni qo'shing (N/5) → Davom etish

## 12 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol: Bugungi web-trekda saytni bosh ekranga qo'shish uchun *nima tayyorlaysiz?*
  - Sayt kompyuterdagi `localhost:5173` da ishlab tursin
  - Telefonga Expo Go ilovasi o'rnatilgan bo'lsin
  - ✔ Sayt manifesti bilan HTTPS manzilda tursin
  - Sayt Play Market'ga ilova bo'lib yuklansin
- Javob izohlari:
  - To'g'ri: Bugun manifest va HTTPS manzil tayyorlanadi — telefon saytni bosh ekranga shundan qo'shadi.
  - A: `localhost` — telefonning o'zi: sayt u yerda yo'q.
  - B: Expo Go — React Native ilovasi uchun, sayt uchun emas.
  - D: PWA do'kondan emas, brauzerdan qo'shiladi.
  - Umumiy: Bugun manifest va HTTPS manzil tayyorlanadi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: C — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 13 · Telefonga yo'l
- Eyebrow: Yakuniy · tartib
- Sarlavha: Prototipni telefonga *qaysi tartibda* olib borasiz?
- Mentor: Mobil trekdagi bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartib):
  1. Expo loyihasini yaratish
  2. QR'ni telefonda Expo Go bilan ochish
  3. Ekranlarni `src/app/` fayllariga ko'chirish
  4. Uch ekranni telefonda bosib tekshirish
- Uyalar: bu yerga qo'ying
- Xato: Tartib xato — bo'lakni bosib qaytaring.
- Yechilgach: Avval loyiha va ulanish, keyin ekranlar: telefonda shablon ochilsa, ulanish joyida ekanini bilasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Davom etish (yechilgach faol)

## 14 · Amaliyot 1 — prototip telefonda
- Eyebrow: Amaliyot 1 · o'z trekingiz
- Sarlavha (trekka qarab):
  - mobil: Prototip ekranlarini *Expo ilovasiga* ko'chiring.
  - web: Prototipingizni *telefon kengligiga* moslang.
- Mentor yonida trek tugmalari: Mobil trek · Web-trek (8-darsdagi tanlov bo'yicha tanlangan; saqlanmagan bo'lsa — ikkalasi bo'sh, halqada)
- Mentor:
  - trek tanlanmagan bo'lsa: Avval trekingizni tanlang: «Mobil trek» yoki «Web-trek».
  - boshida: Hamma qadamni o'z trekingizda, o'z mahsulotingiz bilan qilasiz; Maydon Jamoa — namuna. **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- **Mobil trek** — qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — telefoningizda Expo Go bo'lsin (iPhone'da — Expo akkauntingizga kirilgan). Antigravity'da o'z repo'ngizni oching, terminalda repo papkasida:
     - `npx create-expo-app@latest mobil` (terminal «Skip initializing a new git repository?» deb so'rasa — Enter: yangi git ochilmaydi, `mobil/` repo'ingiz ichida qoladi), keyin `cd mobil` va `npx expo start`.
     - Terminaldagi QR'ni skanerlang: Android'da — Expo Go'dagi «Scan QR code» bilan, iPhone'da — standart kamera ilovasi bilan. Telefonda shablon ilovasi ochiladi.
     - Ochilmasa: telefon va kompyuter bitta Wi-Fi'dami? Bitta bo'lsa ham ochilmasa — tunnel bilan urinib ko'ring: `npm i -g @expo/ngrok`, keyin `npx expo start --tunnel`.
     - iPhone'da akkaunt so'rasa — kompyuterda `npx expo login`, Expo Go'da o'ng yuqoridagi akkaunt belgisi orqali o'sha akkauntga kiring.
  2. **Prompt** — qavslar 7-darsdagi wireframe yozuvingizdan to'ldirilgan; tekshiring, bo'sh qavsni yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - (7-darsdagi yozuv yo'q bo'lsa:) qavslarga o'z ekranlaringizni yozing (7-darsdagi qog'oz chizmangizdan), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash; bosilgach — ✓ Nusxalandi):
       > Qayerda: `mobil/` — Expo Router, ekranlar `src/app/` da. `prototip/` ni faqat o'qi.
       > Nima qilsin: `prototip/` dagi ekranlarni React Native'ga ko'chir: {ekranlar va ularning fayllari}. `src/app/_layout.tsx` da `<Stack />` bo'lsin; shablondagi namuna ekranlar va pastki tablar olib tashlansin (hozirgi shablonda — `explore` ekrani) — `src/app/` da faqat mahsulot ekranlari va `_layout.tsx` qolsin.
       > Ma'lumot `prototip/src/namuna.js` dagidek, `mobil/` ichida. Bosish yo'llari prototipdagidek: {qaysi tugma qaysi ekranni ochadi}.
       > Nima buzilmasin: `prototip/` o'zgarmasin; haqiqiy ma'lumot va Backend yo'q. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {ekranlar va ularning fayllari} — masalan: O'yinlar — `index.tsx`, O'yin — `oyin/[id].tsx`, E'lon berish — `elon.tsx`
       - {qaysi tugma qaysi ekranni ochadi} — masalan: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `mobil/` — Expo Router, ekranlar `src/app/` da. `prototip/` ni faqat o'qi.
       > Nima qilsin: `prototip/` dagi ekranlarni React Native'ga ko'chir: O'yinlar — `src/app/index.tsx`, O'yin — `src/app/oyin/[id].tsx`, E'lon berish — `src/app/elon.tsx`.
       > `src/app/_layout.tsx` da `<Stack />` bo'lsin; shablondagi namuna ekranlar va pastki tablar olib tashlansin (hozirgi shablonda — `explore` ekrani) — `src/app/` da faqat mahsulot ekranlari va `_layout.tsx` qolsin.
       > Ma'lumot `prototip/src/namuna.js` dagidek (4 ta o'yin, har biriga `id`), `mobil/` ichida. Bosish yo'llari prototipdagidek: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar; «Qo'shilaman» sonni bittaga oshirsin.
       > Nima buzilmasin: `prototip/` o'zgarmasin; haqiqiy ma'lumot va Backend yo'q. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — `npx expo start` ishlab tursa, saqlangan o'zgarish telefonda o'zi ko'rinadi; ko'rinmasa — terminalda `r` ni bosing.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     - qayerda — ekranlaringiz `mobil/src/app/` da, `git status` da `prototip/` o'zgarmagan
     - nima qilsin — ekranlar prototipdagidek, har tugma kerakli ekranni ochadi, «‹» orqaga qaytaradi
     - nima buzilmasin — Backend yo'q: terminalda `r` bosilsa, namuna boshidan ochiladi.
     - Farq bo'lsa, agentga: «{nima} prototipdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- **Web-trek** — qadamlar:
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching, terminalda `cd prototip` va `npm run dev`. Chrome'da terminal ko'rsatgan manzilni oching va telefon ko'rinishini yoqing: F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M). Qaysi ekranda nima qisilib qolganini ko'ring.
  2. **Prompt** — qavslarni tekshiring (birinchisi wireframe yozuvingizdan), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `prototip/` — CSS fayllari.
       > Nima qilsin: {ekranlar} telefon kengligiga moslashsin: 600 px dan tor oynada {ustma-ust turadigan qismlar} bitta ustunda, har biri to'liq enida tursin. Kompyuterda ko'rinish o'zgarmasin.
       > Nima buzilmasin: ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {ekranlar} — masalan: O'yinlar, O'yin va E'lon berish ekranlari
       - {ustma-ust turadigan qismlar} — masalan: O'yinlar ekranidagi o'yin kartalari
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `prototip/` — CSS fayllari.
       > Nima qilsin: O'yinlar, O'yin va E'lon berish ekranlari telefon kengligiga moslashsin: 600 px dan tor oynada O'yinlar ekranidagi o'yin kartalari bitta ustunda, har biri to'liq enida tursin. Kompyuterda ko'rinish o'zgarmasin.
       > Nima buzilmasin: ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sahifa o'zi yangilanadi, terminalda xato yo'q.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefon ko'rinishida (390 px) va oddiy oynada:
     - qayerda — o'zgarish faqat `prototip/` da
     - nima qilsin — telefon kengligida kartalar bitta ustunda, yozuvlar uzilmagan; kompyuterda — avvalgidek
     - nima buzilmasin — har tugma kerakli ekranni ochadi, animatsiyalar ishlaydi.
     - Farq bo'lsa, agentga: «{nima} telefon kengligida {qanday}: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - mobil: telefon (Expo Go; bir marta o'zi almashadi: O'yinlar → O'yin → E'lon berish) va ostida `mobil/src/app/` › `_layout.tsx` · `index.tsx` · `elon.tsx` · `oyin/[id].tsx`
  - web: telefon (brauzer `localhost:5173`, kartalar ustma-ust) va kompyuter oynasi `localhost:5173` (kartalar yonma-yon)
- Ostida: Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-09-done`; mobil trekda `cd mobil`, `npm install`, `npx expo start`; web-trekda `cd prototip`, `npm install`, `npm run dev`. Qanday ishlashini ko'rasiz va o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Hammasi bajarilgach:
  - mobil: Prototip telefonda ilova bo'lib ochiladi: uch ekran — uch fayl, bosish yo'llari o'sha.
  - web: Prototip telefon kengligiga moslashdi: kartalar ustma-ust, kompyuterda — avvalgidek.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 15 · Amaliyot 2 — telefonda jonli
- Eyebrow: Amaliyot 2 · o'z trekingiz
- Sarlavha (trekka qarab):
  - mobil: Telefondagi ilovangiz ham *jonli bo'lsin*.
  - web: Saytingizni telefonga *ilova kabi* o'rnating.
- Mentor yonida trek tugmalari: Mobil trek · Web-trek
- Mentor:
  - trek tanlanmagan bo'lsa: Avval trekingizni tanlang: «Mobil trek» yoki «Web-trek».
  - boshida: Talab tayyor — bir-ikki joyni o'z mahsulotingiz bilan to'ldirasiz; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- **Mobil trek** — qadamlar:
  1. **Ochish** — `npx expo start` ishlab tursin, ilova telefoningizda ochiq.
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `mobil/src/app/` — mavjud ekranlar.
       > Nima qilsin: {bosiladigan karta yoki tugma} bosilganda kichrayib qaytsin — 0,15 soniya. {o'zgaradigan son yoki yozuv} o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin. Ekrandan ekranga o'tish Stack'nikidek silliq qolsin.
       > Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; telefonda harakatni kamaytirish yoqilgan bo'lsa, kichrayish va kattalashish bo'lmasin. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {bosiladigan karta yoki tugma} — masalan: o'yin kartasi
       - {o'zgaradigan son yoki yozuv} — masalan: «8 / 10» dagi son
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `mobil/src/app/` — mavjud ekranlar.
       > Nima qilsin: o'yin kartasi bosilganda kichrayib qaytsin — 0,15 soniya. «8 / 10» dagi son o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin. Ekrandan ekranga o'tish Stack'nikidek silliq qolsin.
       > Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; telefonda harakatni kamaytirish yoqilgan bo'lsa, kichrayish va kattalashish bo'lmasin. Paket kerak bo'lsa — faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Ostida: Motion — web uchun; ilovada animatsiyani agent React Native vositasi bilan yozadi.
  3. **Ishga tushirish** — ilova telefonda o'zi yangilanadi; yangilanmasa — terminalda `r`.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatori: karta kichrayib qaytadimi · son kattalashib qaytadimi · ekranlar silliq almashadimi · ekranlar va bosish yo'llari o'sha-o'shami.
     - Hammasi mos bo'lsa — GitHub'ga: repo papkasida `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil, `mobil/` fayllari ko'rinsin; `git add mobil`, `git commit -m "telefonda prototip"`, `git push`.
     - `git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»
- **Web-trek** — qadamlar:
  1. **Ochish** — `prototip/` ishlab tursin (`npm run dev`); app.netlify.com da akkauntingizga kiring (2-Modulda ochgansiz).
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `prototip/` — `public/manifest.webmanifest`, ikonkalar `public/` da, `index.html` da manifestga havola.
       > Nima qilsin: manifestda `name` va `short_name` — {mahsulot nomi}, `start_url` — `/`, `display` — `standalone`, `icons` — 192 va 512 piksel PNG ({ikonka rangi}, matnsiz oddiy shakl). Ikonka faylini yarata olmasang — bitta kvadrat rasmdan shu ikki o'lchamni qanday tayyorlashni menga ayt.
       > Nima buzilmasin: ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {mahsulot nomi} — masalan: Maydon Jamoa
       - {ikonka rangi} — masalan: yashil
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `prototip/` — `public/manifest.webmanifest`, ikonkalar `public/` da, `index.html` da manifestga havola.
       > Nima qilsin: manifestda `name` va `short_name` — Maydon Jamoa, `start_url` — `/`, `display` — `standalone`, `icons` — 192 va 512 piksel PNG (yashil, matnsiz oddiy shakl). Ikonka faylini yarata olmasang — bitta kvadrat rasmdan shu ikki o'lchamni qanday tayyorlashni menga ayt.
       > Nima buzilmasin: ekranlar, namuna ma'lumot, bosish yo'llari va animatsiyalar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — GitHub'ga: `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil; `git add prototip`, `git commit -m "PWA"`, `git push`.
     - Keyin app.netlify.com → yangi loyiha → GitHub'dan import → o'z repo'ngiz. Base directory `prototip`, build `npm run build`, publish `dist`. Havola chiqadi: `….netlify.app`; keyingi har push'da sayt o'zi yangilanadi.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — telefonda `….netlify.app` ni oching.
     - Android'da Chrome: manzil qatori o'ngidagi «⋮» → «Install and create shortcut» → «Install» (telefon tili boshqa bo'lsa — o'sha tildagi nomi).
     - iPhone'da Safari: «Share» → «Add to Home Screen»; ro'yxatda bo'lmasa — pastdagi «Edit Actions» dan qo'shing (telefon tili boshqa bo'lsa — o'sha tildagi nomi).
     - Bosh ekrandagi ikonkani bosing: sayt manzil qatorisiz ochiladi, har tugma kerakli ekranni ochadi.
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - mobil: telefon (Expo Go, jonli, bir marta o'zi o'ynaydi: karta bosiladi → O'yin ekrani → «Qo'shilaman» → «9 / 10», «Qo'shildingiz» → O'yinlar'ga qaytadi) va GitHub sahifasining kichik ko'rinishi: `github.com/…/maydon-jamoa` · `mobil/` · `prototip/` · `README.md`
  - web: telefon (brauzer `maydon-jamoa-….netlify.app`, qulf bilan → bosh ekranda «Maydon Jamoa» ikonkasi bosiladi → O'yinlar manzil qatorisiz) va fayl kartasi `prototip/public/manifest.webmanifest`:
```json
{ "name": "Maydon Jamoa", "short_name": "Maydon Jamoa", "start_url": "/", "display": "standalone",
  "icons": [{ "src": "/ikonka-192.png", "sizes": "192x192" }, { "src": "/ikonka-512.png", "sizes": "512x512" }] }
```
- Hammasi bajarilgach:
  - mobil: Ilova telefonda jonli: karta, son va ekranlar bosishga javob beradi; `mobil/` GitHub'da.
  - web: Sayt telefonda ilova kabi o'rnatildi: bosh ekrandan manzil qatorisiz ochiladi.
- Natija ostida (faqat mobil trekda, blok tugagach): Expo Go'da ilova kompyuteringizdan keladi: `npx expo start` to'xtasa, telefonda ham ochilmaydi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 16 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 17 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| React Native'da ekrandagi matn qayerda turadi? | <Text> ichida | `View` — faqat quti |
| Prototipdagi bosiladigan `div` React Native'da nima bo'ladi? | Pressable | `onClick` o'rniga — `onPress` |
| Expo Router nima? | Expo'ning navigatsiyasi: ekranlar fayllar bilan tuziladi | Bu misolda har ekran o'z faylida, `src/app/` da |
| `_layout.tsx` dagi `<Stack />` nima qiladi? | Ekranlarni ustma-ust qo'yadi | «‹» ustki ekranni olib tashlaydi |
| To'rt o'yin uchun nechta O'yin fayli kerak? | Bitta — oyin/[id].tsx | `id` manzildan keladi: `/oyin/2` |
| Boshqa ekranga qaysi qator o'tkazadi? | router.push('/elon') | `router` — `useRouter()` dan |
| QR ochilishi uchun telefon va kompyuter qayerda bo'ladi? | Bitta Wi-Fi'da | Ochilmasa — `npx expo start --tunnel` |
| iPhone'da Expo Go loyihani ochishi uchun nima kerak? | Kompyuterda va Expo Go'da bitta Expo akkaunti | Kompyuterda — `npx expo login` |
| Expo Go'dagi ilova kodi qayerdan keladi? | Kompyuterdagi npx expo start dan | U to'xtasa, ilova ham ochilmaydi |
| Adaptiv sayt nima? | Telefon kengligiga moslashadigan sayt | Bu darsda 600 px dan tor oynada bitta ustun |
| PWA nima? | Telefonning bosh ekraniga ilova kabi qo'shiladigan sayt | Do'kondan emas, brauzerdan qo'shiladi |
| Sayt telefonda manzil qatorisiz ochilishi uchun manifestda nima yoziladi? | "display": "standalone" | Yana kerak: nom, ikonkalar, `start_url` |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 18 · Dars yakuni
- Eyebrow: Yakun
- Yuqori yorliq: ✓ Prototip telefonda (1- yoki 2-amaliyot bajarilgan bo'lsa; ikkalasi bajarilmagan bo'lsa yorliq yo'q) · N/5 to'g'ri
- Sarlavha (holatga qarab):
  - 2-amaliyot bajarilgan: Prototipingiz endi o'z telefoningizda ochiladi.
  - faqat 1-amaliyot: Prototip telefonda ochildi — oxirgi qadam uyda.
  - 1-amaliyot bajarilmagan: Telefonga chiqarish boshlandi — qolgani uyda.
- Bugungi asosiy fikr: Mobil trekda prototip Expo ilovasiga ko'chadi — har ekran o'z faylida — va QR orqali Expo Go'da ochiladi; web-trekda u adaptiv sayt va PWA bo'lib, telefonning bosh ekraniga qo'shiladi.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - React Native'da quti `View` bilan, matn `Text` bilan, bosiladigan joy `Pressable` bilan yoziladi.
  - Expo Router'da ekranlar fayllar bilan tuziladi: bu misolda har ekran o'z faylida, `_layout.tsx` ularni Stack qiladi.
  - Bitta `oyin/[id].tsx` fayli har o'yinni manzildagi raqami bilan ochadi.
  - QR odatda bitta Wi-Fi'da ochiladi, ochilmasa `--tunnel` bilan urinib ko'rasiz; iPhone'da ikkalasida bitta Expo akkaunti kerak.
  - Adaptiv sayt telefon kengligiga moslashadi, PWA esa bosh ekranga ilova kabi qo'shiladi.
- Uyga vazifa (tugma «Amaliy topshiriqni bajarish →»):
  - Kim uchun — o'z mahsulotingiz · Muddat — keyingi darsgacha
  1. **Tugatish** — darsda ulgurmagan qadamlarni o'z trekingizda bajaring: prototip telefoningizda ochilsin.
  2. **Tekshirish** — telefonda bosib chiqing: wireframe'dagi har tugma kerakli ekranni ochadimi? Farq bo'lsa — agentga bitta tuzatish talabi.
  3. **GitHub** — o'zgarishlar GitHub'da tursin: mobil trekda `mobil/`, web-trekda `prototip/` va `README.md` da Netlify havolasi.
  - Keyingi dars — **«Loyiha kuni: poydevor — Database, kirish, deploy»**: prototip telefonda ochiladi, endi uning ortidagi umumiy Database va kirish navbati.
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Native Card** — Matn <Text> ichida turishini topdingiz (3-ekran, birinchi urinishda to'g'ri)
- **File Router** — Yangi ekran uchun yangi fayl ochishni bildingiz (6-ekran, birinchi urinishda to'g'ri)
- **Tunnel Fix** — Wi-Fi'siz QR'ni tunnel bilan ochishni bildingiz (8-ekran, birinchi urinishda to'g'ri)
- **Pocket Prototype** — Ikkala amaliyot blokini oxirigacha bajardingiz (15-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 3-ekran (1-savol) — **Matn — Text ichida**
   - Quti · `View` · `<View style={s.karta}>`
   - Matn · `Text` · `<Text>Shanba, 18:00</Text>`
   - Bosiladigan joy · `Pressable` · `<Pressable onPress={ochish}>`
   - Sinfga savol: `View` ichiga to'g'ridan matn yozilsa, telefonda nima bo'ladi?
2. 6-ekran (2-savol) — **Ekran fayli va manzil**
   - O'yinlar · `src/app/index.tsx` · manzil `/`
   - E'lon berish · `src/app/elon.tsx` · manzil `/elon`
   - Ekranlar Stack'da · `src/app/_layout.tsx` · `<Stack />`
   - Sinfga savol: «Kirish» ekrani qaysi manzilda ochiladi?
3. 8-ekran (3-savol) — **QR ochilmasa**
   - Bitta Wi-Fi · telefon kompyuterni tarmoqda topadi · `npx expo start`
   - Bitta tarmoq yo'q yoki u to'sadi · internet orqali · `npx expo start --tunnel`
   - iPhone · ikkalasida bitta Expo akkaunti · `npx expo login`
   - Sinfga savol: Tunnel bilan ilova nega sekinroq yangilanadi?
4. 12-ekran (4-savol) — **PWA uchun nima kerak**
   - Manifest · nom, ikonkalar, ochiladigan sahifa · `"start_url": "/"`
   - Ilova kabi ochilish · `"display": "standalone"`
   - HTTPS manzil · Netlify'da o'zi bor · `….netlify.app`
   - Sinfga savol: Nega telefon `localhost` dagi saytni o'rnata olmaydi?
5. 13-ekran (yakuniy) — **Telefonga yo'l**
   - 1 · 2 · Expo loyihasini yaratish · QR'ni telefonda Expo Go bilan ochish
   - 3 · Ekranlarni `src/app/` fayllariga ko'chirish
   - 4 · Uch ekranni telefonda bosib tekshirish
   - Sinfga savol: Nega ulanish ekranlarni ko'chirishdan oldin tekshiriladi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. React Native'da ekrandagi matn qayerga yoziladi?
   - ✔ `<Text>` ichiga
   - `<View>` ichiga
   - `<div>` ichiga
   - `<span>` ichiga
2. Prototipdagi `onClick` React Native'da nimaga almashadi?
   - `onChange`
   - ✔ `onPress`
   - `onSubmit`
   - `onInput`
3. Ilova `/oyin/3` manzilini ochdi. Qaysi fayl ishlaydi?
   - `src/app/oyin/index.tsx`
   - `src/app/oyin/3.tsx`
   - ✔ `src/app/oyin/[id].tsx`
   - `src/app/oyinlar.tsx`
4. `_layout.tsx` dagi `<Stack />` nima qiladi?
   - Ekranlarni pastdagi tablarga joylaydi
   - Har ekranga o'z rangi va shriftini beradi
   - `src/app/` da yangi fayllar yaratadi
   - ✔ Ekranlarni ustma-ust qo'yib boshqaradi
5. `router.push('/elon')` ishlaganda nima bo'ladi?
   - ✔ E'lon berish ekrani ustiga ochiladi
   - Ilova butunlay boshidan qayta yuklanadi
   - `elon.tsx` fayli yangidan yaratiladi
   - O'yinlar ro'yxati qaytadan chiziladi
6. Telefonda QR ochilishi uchun odatda nima kerak?
   - Telefonda Chrome brauzeri ochiq tursin
   - ✔ Telefon va kompyuter bitta Wi-Fi'da tursin
   - Kompyuterga ham Expo Go o'rnatilsin
   - Telefonda mobil internet ham yoqilgan bo'lsin
7. `--tunnel` bilan ulanish qanday ishlaydi?
   - Faqat bitta Wi-Fi ichida, tezroq ulanadi
   - Faqat iPhone telefonlarida ulanadi
   - ✔ Internet orqali ulanadi, lekin sekinroq
   - Kompyutersiz, to'g'ridan telefonda ishlaydi
8. iPhone'da Expo Go akkaunt so'radi. Nima qilasiz?
   - Expo Go ilovasini o'chirib, qayta o'rnataman
   - Loyihani boshqa nom bilan yarataman
   - QR'ni boshqa telefon bilan ochaman
   - ✔ Ikkalasida bitta Expo akkauntiga kiraman
9. Expo Go'dagi ilova kodi qayerdan keladi?
   - ✔ Kompyuterdagi npx expo start dan
   - Play Market'dagi ilova sahifasidan
   - Netlify'dagi sayt manzilidan
   - Telefon xotirasidagi papkadan
10. Adaptiv sayt nima?
    - Faqat telefonda ochiladigan sayt
    - ✔ Telefon kengligiga moslashadigan sayt
    - Telefonga o'rnatiladigan do'kon ilovasi
    - Animatsiyalari bor, bosiladigan sayt
11. PWA telefonga qayerdan qo'shiladi?
    - Play Market do'konidan yuklab
    - Expo Go ilovasidagi QR orqali
    - ✔ Brauzerdan, saytning o'zidan
    - App Store do'konidan yuklab
12. Telefon saytni o'rnatishi uchun manzil qanday bo'ladi?
    - Kompyuterdagi `localhost` manzil
    - Uydagi Wi-Fi tarmog'idagi manzil
    - `http://` bilan boshlanadigan manzil
    - ✔ HTTPS manzil, masalan Netlify'da

## Kartochkalar
17-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 18-ekrandagi 5 qator.
- Keyingi dars — «Loyiha kuni: poydevor — Database, kirish, deploy».
