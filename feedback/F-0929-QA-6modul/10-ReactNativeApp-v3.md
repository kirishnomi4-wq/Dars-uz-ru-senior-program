# 6-Modul (LMS: 8-Modul) · 10-dars «RN: komponent, navigatsiya, API» — MD v3

Fayl: `src/6-Modull/ReactNativeAppLesson.jsx` · 20 ekran (`SCREEN_META` o'zgarmaydi) · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `10-ReactNativeApp-v2.md` (F-0929-12/13/29 qarorlari o'z kuchida). v3 hamma ekranni to'liq yozadi: misol-ip AvtoPizza'ga o'tdi (savol D-1), amaliyot repo-blokka (F-1004 Q6 A).
Dasturdagi o'rni (App.jsx `comp:`): oldingi — m6-09 «React Native — asoslari» · keyingi — m6-11 «Praktika: mobil ilova (mini-do'kon)». Menyu nomi = dars nomi (DE-205), o'zgarmaydi.
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: `INLINE_KEYS = { s4: 3, s8: 1, s11: 2, s14: 0, s15: 0 }` — s4 4-variant · s8 2-variant · s11 3-variant · s14 1-variant · s15 tartib; arena 1-2-3-4 aylanma (3/3/3/3).
Sarlavha yonidagi `(NN)` — belgilar soni (backtik va `**` hisobga kirmaydi).

---

## A. v3 qoidalari (v2 A-bo'limi o'z kuchida + 04.10 qonunlari)

1. **Bitta misol-ip — AvtoPizza mobil ilovasi (P-001).** Amaliyot `TelegramBotNest` dagi AvtoPizza backend'iga ulanadi, shuning uchun tushuncha-ekranlar ham shu olamda:
   menyu — Margarita 45 000 so'm · Pepperoni 55 000 so'm · Pishloqli 50 000 so'm (repo `src/api/menyu.ts` `PITSALAR` bilan aynan). v2 dagi mini-do'kon
   (Telefon · Quloqchin · Aqlli soat, `/products`) olinadi — ikkinchi olam bo'lardi.
2. **Bitta vizual — ilova xaritasi (`AppMap`, 163/180).** Telefon + ekranlar dastasi + Backend + bot. Har tushuncha-ekran shu xaritaning bir qismini ishlatadi.
3. **Tushuncha-ekran = harakat → vizual (DE-184).** O'quvchi bitta ish qiladi (bosadi, qo'shadi, ochadi) — telefon, dasta yoki Backend o'zgaradi. Har ekran ostida
   **Harakat → Vizual o'zgarish** qatori. Oldin ballsiz bashorat (181) — 3, 5, 6, 9, 10, 12, 13-ekranlar. Ish tugagach harakat paneli yopiladi, xarita butun enga
   chiqib fokusga keladi (DE-199, `useTugadi`); vizual ⛶ ichida (DE-200).
4. **Matn o'lchovi (162/164, MK §225):** sarlavha bitta qator ≤55 · Mentor ≤2 gap, sarlavhani takrorlamaydi · yashil xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
5. **Toza yuza (185, D4):** tugma, variant, yorliq, karta sarlavhasida emoji yo'q (v2 dagi 🛍️ 📱 🔌 🗄️ 👆 🧭 📦 ↩️ 🛒 ⚙️ ⚠️ ❓ ▶ olinadi). Pitsa — chizilgan doira (CSS).
   Rang — faqat holat (D3). Istisno: nishon medali, arena, podium.
6. **Bir nom qoidasi (T-014):**
   - Ekran nomi kodda va matnda bitta: `Menyu` — «Menyu ekrani», `Tafsilot` — «Tafsilot ekrani». v2 dagi `List`/`Detail` («Detail — faqat kodda») olinadi.
   - Backend manzili — `GET /menyu` (repo: menyu `menyu.ts` da — FAKT). `/products` mini-do'kon olamiga tegishli edi.
   - «bosish» (tap emas) · «ilova» · «so'rov» va «javob» (1-dars) · «ko'p kirish yo'li, bitta tizim» (1-dars) · «backend» (server emas — bitta so'z).
   - «kartalar dastasi» — metafora, faqat 5-ekranda bir marta («…ga o'xshatish mumkin», T-016); keyin atama: «ekranlar dastasi», «dastaga qo'yiladi (push)»,
     «dastadan olinadi (pop)». Boshqaruvchi — `Stack Navigator`.
   - Ekranga ma'lumot uzatish: `navigation.navigate('Tafsilot', { pitsa: item })` → `route.params` (v2 dagi `{ id }` olindi: Tafsilot ekrani id bo'yicha pitsani topa
     olmasdi — menyu unda yo'q; `{ pitsa }` qo'shimcha so'rovsiz ishlaydi).
7. **Kafolat yo'q:** «real ilova», «to'liq ishlaydigan» yo'q. Bu o'quv ilova: yuklanish va xato yozuvi hali yo'q — uyga vazifa buni halol aytadi.

---

## Darsning ipi va bitta vizual

- **Hook:** 9-darsdagi bitta ekran (bitta pitsa kodga qo'lda yozilgan) → «Haqiqiy ilovani ko'rish» → ko'p ekran + menyu backend'dan.
- **Misol-ip:** AvtoPizza — bot darslaridagi namuna (`TelegramBotNest`). Bot `/menu` da shu ro'yxatni ko'rsatadi; bugun ilova ham o'sha backend'dan oladi.
  Bitta manba (180): `MENYU = [{ id, nom, narx }]` × 3 — kod namunalari, telefon maketi, Backend qutisi, bot chati shundan o'qiydi.
- **Ilova xaritasi (`AppMap`, dars bo'yi):**
  - **Telefon** (191-qonun ramkasi 176×312; 9:41, kamera-orol, uy-chizig'i) — joriy ekran:
    Menyu (sarlavha qatori «Menyu» · 3 qator: chizilgan pitsa doirasi + nom + narx) yoki Tafsilot (sarlavha qatori «‹ Orqaga · Tafsilot» · katta doira · nom · narx · «Menyuga qaytish»).
  - **Ekranlar dastasi** — telefon yonida qiyshiq turgan kartalar, Menyu pastda. Push — karta ustiga tushadi, pop — ko'tarilib ketadi.
  - **Backend** (o'ngda; qorong'i quti, holat chirog'i, `$` qatorlari) — `GET /menyu` va `menyu.ts` ning 3 qatori.
  - **Bot** (Backend ostida; kichik Telegram chat) — ikkinchi kirish yo'li, o'sha Backend'ga ulangan.
  - Telefon ↔ Backend chizig'ida **konvert**: so'rov (modul rangi) → javob (yashil, ichida bitta JSON qatori) — 1-dars `SysMap` konverti bilan bir xil.
  - Holatlar: kulrang (hali ishlatilmagan) → oq (ochiq) → accent (joriy) → yashil (ishladi).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Haqiqiy pitsa ilovasiga yana nima kerak?** (40)
- Mentor: O'tgan darsda bitta ekran qildingiz: bitta pitsa, kodga qo'lda yozilgan. Tugmani bosing va haqiqiy ilova bilan solishtiring.
- Maket (chap): telefon — 9-dars ekrani: «AvtoPizza» · Margarita — 45 000 so'm. Ikkinchi darajali tugma: «Haqiqiy ilovani ko'rish».
- Variantlar (radio, tugma bosilgach faol; bir uzunlikda):
  - Har pitsani ilova kodiga qo'lda yozaman (39)
  - Ekran qo'shaman, menyuni backend'dan olaman (43)
  - Hech narsa — ilovaga bitta ekran yetadi (39)
- Javob — 2-variant: **Aynan!** Pitsani bossangiz, yangi ekran ochiladi; menyu esa backend'dan keladi. Bugun ikkalasini qo'shamiz. (105)
- Javob — 1-variant: **Qiziq fikr!** Kichik ilovada ishlaydi, lekin narx o'zgarsa, ilova kodini ham tuzatasiz. Bugun menyuni backend'dan olamiz. (119)
- Javob — 3-variant: **Qiziq fikr!** Bitta ekranga tafsilot sig'maydi: pitsani bossangiz, yangi ekran kerak bo'ladi. Bugun shuni qo'shamiz. (114)
- **Harakat → Vizual o'zgarish:** «Haqiqiy ilovani ko'rish» → telefonda yuklanish belgisi bir lahza, keyin Menyu: 3 qator bittadan chiziladi; Pepperoni qatori
  o'zi bosiladi, Tafsilot ekrani o'ngdan suriladi (1,5 s) va Menyu'ga qaytadi. Tugma o'rnida izoh-qator: «ko'p ekran · menyu backend'dan».
✎ olam: mini-do'kon → AvtoPizza (D-1) · sarlavha 62 → 40 · hook javoblari 186/198/129 → 106/115/114 · javobda atama yo'q (navigatsiya/fetch — rejada teg sifatida, T-011) ·
«Real ilova qanday quriladi?» ikkinchi savoli olindi (sarlavha o'zi savol)

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun pitsa ilovasini backend'ga ulaysiz.** (41)
- Mentor: Menyu bot bilan umumiy bo'ladi: ikkalasi bitta joydan oladi. Amaliyotda buni o'z kompyuteringizda qilasiz.
- Chap: «Dars oxirida — Menyu va Tafsilot ekranli ilova; menyu bot ishlatadigan backend'dan keladi.» + ilova xaritasi (kichik): telefon ↔ Backend ↔ bot;
  konvert aylanib yuradi: telefon → Backend → telefon, keyin bot → Backend → bot (1-dars reja xaritasi kabi, F-1004-48).
- O'ng («01 · matn · teg», bosilmaydi — P-015):
  - 01 · Menyuni ro'yxat qilib chizish · `FlatList`
  - 02 · Pitsani bosib, Tafsilot ekraniga o'tish · `navigate`
  - 03 · Menyuni backend'dan olish · `fetch`
  - 04 · Ilovani o'z backend'ingizga ulash · amaliyot
✎ AsyncStorage rejadan olindi (qo'shimcha — 13-ekran eyebrow'i aytadi) · «Eng muhimi — bitta backend» 3-gap → 2 gap · telefon maketi → kichik xarita (163) ·
reja App.jsx ta'rifiga mos bo'lsin — KOD 11

## 2 · Ekrandagi komponentlar  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · komponentlar
- Sarlavha: **Bu ekranni qaysi komponentlar chizadi?** (38)
- Mentor: View va Text'ni bilasiz. Telefondagi har qismni bosing — uni chizgan komponent nomi chiqadi.
- Maket: telefon — Menyu ekrani, tepadan pastga 5 bosiladigan joy (168: pulsatsiya halqasi):
  - «Manzilingiz…» yozish maydoni → **TextInput** · web'da `<input>`
  - «Bugungi pitsa» rasmi → **Image** · web'da `<img>`
  - o'lcham tugmalari qatori «25 sm · 30 sm · 35 sm · 40 sm» (sig'maydi) → **ScrollView** · surib ko'rish
  - pitsalar ro'yxati (3 qator) → **FlatList** · ro'yxat
  - pastdagi «Qo'ng'iroq qilish» tugmasi → **Pressable** · web'da `<button>`
- **Harakat → Vizual o'zgarish:** joyni bosish → o'sha qism accent ramkaga olinadi, yonida yorliq: komponent nomi (mono) + kulrang juftlik. Har biri o'z ishini
  ko'rsatadi: ScrollView — o'lcham tugmalari o'ngga suriladi; TextInput — kursor chiqib «Chilonzor 5» yoziladi; Pressable — tugma bir lahza bosiladi; FlatList — 3 qator
  bittadan qayta chiziladi; Image — rasm yonadi. Hisoblagich «N/5 komponent topildi» (P-040). 5/5 — hamma yorliq birga, FlatList yorlig'i accent.
- Xulosa (5/5): Ekranni komponentlar chizadi; bugun eng kerakli — ro'yxatni chizadigan FlatList. (80)
- Tugma (pastki): 5 komponentni toping (N/5) → Davom etish
✎ 5 tugma + matn-karta («konteyner», «kontent») → telefondagi joyni bosish (184) · Mentor 4 gap → 2 · xulosa 118 → 82

## 3 · FlatList  ← QTushuncha (qayta qurildi)
- Eyebrow: Tajriba · FlatList
- Sarlavha: **Menyuga pitsa qo'shsangiz, ekranga nima yozasiz?** (48)
- Mentor: FlatList massivni oladi va har element uchun bitta qolipni ishlatadi. Massivga pitsa qo'shib ko'ring.
- Bashorat (ballsiz, 181) — variantlar: Har pitsaga yangi `<Text>` yozaman · Hech narsa — qatorni FlatList o'zi chizadi
- Chap — kod `Menyu.js` (repo'dagi kod bilan bir xil, P-065):
  ```js
  const menyu = [
    { id: 'margarita', nom: 'Margarita', narx: "45 000 so'm" },
  ]

  <FlatList
    data={menyu}
    renderItem={({ item }) => <Text>{item.nom} — {item.narx}</Text>}
  />
  ```
  Kod ostida 2 tugma: «+ Pepperoni» · «+ Pishloqli». O'ngda telefon (Menyu, 1 qator).
- **Harakat → Vizual o'zgarish:** tugmani bosish → massivga yangi qator ajralib kiradi, `renderItem` qatori bir lahza yonadi va telefonda yangi qator paydo bo'ladi;
  `<FlatList>` qismi o'zgarmaydi (yonida kulrang «o'zgarmadi»). 2/2 — telefonda 3 qator.
- Natija qatori: «Taxminingiz: … · haqiqatda: hech narsa yozilmadi — qatorni FlatList chizdi».
- Xulosa: FlatList massivdagi har element uchun renderItem qolipidan bitta qator chizadi. (79)
- Tugma (pastki): Pitsalarni qo'shing (N/2) → Davom etish
✎ «Ro'yxatni telefonda chizish» bitta tugmasi → bashorat + massivga qo'shish (181, 184) · `List.js` → `Menyu.js` · `item.name` → `item.nom` (repo) · xulosa 140 → 85 ·
«Endi bu ma'lumot qayerdan keladi — backend'dan» ko'prigi olindi (keyingi ekran test, T-064)

## 4 · 1-savol  ← QTest (✔ 4-variant, `correctIdx 3`)
- Eyebrow: Mashq · 1-savol
- Savol: **Menyudagi uchta pitsani ro'yxat qilib qaysi komponent chizadi?** (8 so'z)
  - Text — bitta yozuvni ko'rsatadi (31)
  - Image — pitsa rasmini ko'rsatadi (32)
  - TextInput — yozish maydonini ko'rsatadi (39)
  - ✔ FlatList — har pitsaga qator ko'rsatadi (39)
- To'g'ri izohi: FlatList massivni oladi va har element uchun bitta qator chizadi.
- Xato izohlari:
  - Text bitta yozuv: uchta pitsaga uchtasini qo'lda yozasiz. (57)
  - Image faqat rasm chiqaradi — nom va narx unda yo'q. (51)
  - TextInput — foydalanuvchi yozadigan maydon, ro'yxat emas. (57)
  - (umumiy) Massivdagi har element o'z qatoriga aylanishi kerak. (52)
✎ «To'g'ri!» olindi · variantlar bir shaklda («X — … ko'rsatadi»), «qator» so'zi Text variantida ham bor (kalit so'z faqat to'g'rida emas) · xato izohlari ≤60 va to'g'ri javob ifodasini aytmaydi (S-010)

## 5 · Ekranlar dastasi  ← QTushuncha (qayta qurildi; v2 dagi 6-ekran harakati shu yerga)
- Eyebrow: Tajriba · navigatsiya
- Sarlavha: **«Orqaga» bosilganda Menyu ekrani qayerdan chiqadi?** (50)
- Mentor: Ekranlarni kartalar dastasiga o'xshatish mumkin: yangisi ustiga qo'yiladi. Pitsani bosing, keyin «‹ Orqaga».
- Bashorat (ballsiz) — variantlar: Qaytadan yuklanadi · Ostida turgan edi, o'sha holatda chiqadi
- Chap: telefon (Menyu; «Manzilingiz» maydonida «Chilonzor 5»). O'ng: ekranlar dastasi — bitta karta «Menyu».
- **Harakat → Vizual o'zgarish:**
  1. telefonda pitsani bosish → «Tafsilot» kartasi dastaning ustiga tushadi (yonida bir lahza «push»), telefonda Tafsilot ekrani o'ngdan suriladi;
  2. «‹ Orqaga» → ustki karta ko'tarilib chiqib ketadi («pop»), ostidagi Menyu kartasi yonadi; telefonda Menyu — o'sha holatda («Chilonzor 5» joyida, ro'yxat o'sha joyda).
  Hisoblagich N/2.
- Natija qatori: «Taxminingiz: … · haqiqatda: Menyu ostida turgan edi».
- Xulosa: Stack Navigator yangi ekranni dastaga qo'yadi (push), «Orqaga» uni oladi (pop). (79)
- Tugma (pastki): Pitsani oching va qayting (N/2) → Davom etish
✎ matn-karta + «push va pop nima?» 3 karta (⬆️⬇️🌐) → dasta harakatda (184) · sarlavhada atama yo'q, Stack Navigator xulosada — harakatdan keyin (T-011) ·
metafora faqat shu Mentor gapida

## 6 · Bitta Tafsilot ekrani  ← QTushuncha (yangi tajriba)
- Eyebrow: Tajriba · ma'lumot uzatish
- Sarlavha: **Uchta pitsaga nechta Tafsilot ekrani kerak?** (43)
- Mentor: Har pitsani bosib oching va ekran fayllarini sanang.
- Bashorat (ballsiz) — variantlar: Uchta — har pitsaga bittadan · Bitta — pitsa unga uzatiladi
- Chap: telefon (Menyu). O'ng: ekran fayllari — `Menyu.js` · `Tafsilot.js`; ostida hisoblagich «ochilgan pitsa: 0/3».
- **Harakat → Vizual o'zgarish:** pitsani bosish → Menyu'dan Tafsilot'ga konvert uchadi, ichida `{ pitsa: Pepperoni }`; Tafsilot ekrani shu pitsaning nomi va
  narxini ko'rsatadi; `Tafsilot.js` yonadi, yangi fayl qo'shilmaydi. «‹ Orqaga» → keyingi pitsa. 3/3 — fayllar ostida «fayl: 1 · pitsa: 3».
- Natija qatori: «Taxminingiz: … · haqiqatda: bitta ekran, uchta pitsa».
- Xulosa: Tafsilot ekrani bitta; qaysi pitsani ko'rsatishini navigate uzatgan ma'lumotdan biladi. (87)
- Tugma (pastki): 3 pitsani oching (N/3) → Davom etish
✎ v2 «Navigatsiya harakatda» (5-ekranga ko'chdi) o'rniga — ma'lumot uzatish tajribasi: amaliyot 2-qadamida `route.params` kerak, v2 da u darsda ko'rsatilmagan edi
(F-0929-29) · «Erkin sinab ko'ring» → aniq ish va son

## 7 · Ekranlar kodda  ← QTushuncha (kod ↔ xarita, qayta qurildi)
- Eyebrow: Kod · navigate
- Sarlavha: **Ekranlar kodda qanday bog'lanadi?** (33)
- Mentor: Ikki fayldagi belgilangan qismlarni bosing — telefon va dasta har birining ishini ko'rsatadi.
- Chap — kod (ikki fayl; bosiladigan qismlar pulsatsiyada):
  `Menyu.js`
  ```js
  <Pressable
    onPress={() => navigation.navigate('Tafsilot', { pitsa: item })}>
    <Text>{item.nom}</Text>
  </Pressable>
  ```
  `Tafsilot.js`
  ```js
  const { pitsa } = route.params

  <Pressable onPress={() => navigation.goBack()}>
    <Text>Menyuga qaytish</Text>
  </Pressable>
  ```
- **Harakat → Vizual o'zgarish** (qism yonida 2–3 so'zli yorliq):
  - `onPress` → telefondagi Pepperoni qatori bosiladi · «bosilganda ishlaydi»
  - `navigate('Tafsilot'` → dastaga Tafsilot kartasi tushadi · «ekranga o'tish (push)»
  - `{ pitsa: item }` → konvert ichida Pepperoni · «ma'lumot uzatish»
  - `route.params` → Tafsilot ekranida nom va narx chiqadi · «ma'lumotni olish»
  - `goBack()` → karta dastadan olinadi, telefonda Menyu · «qaytish (pop)»
  Hisoblagich N/5.
- Xulosa: navigate ekranga o'tadi va ma'lumot uzatadi, route.params uni oladi, goBack qaytaradi. (86)
- Tugma (pastki): 5 qismni bosing (N/5) → Davom etish
✎ «Qatorlarni tushuntiring» + 4 matn-karta (👆🧭📦↩️) → kod qismi bosilganda telefon/dasta o'zgaradi (184) · `navigate('Detail', { id: item.id })` →
`navigate('Tafsilot', { pitsa: item })` + `route.params` (amaliyot bilan bir xil, P-065) · `goBack` endi kodda ko'rinadi

## 8 · 2-savol  ← QTest (✔ 2-variant, `correctIdx 1`)
- Eyebrow: Mashq · 2-savol
- Savol: **Menyu ekranidan Tafsilot ekraniga qanday o'tasiz?** (7 so'z)
  - Sahifani qayta yuklab, boshqa fayl ochaman (42)
  - ✔ `navigation.navigate('Tafsilot')` chaqiraman (42)
  - Web'dagidek `<a href>` havolasi bilan o'taman (43)
  - Har ekranni alohida ilova qilib yozaman (39)
- To'g'ri izohi: navigate yangi ekranni dastaga qo'yadi, «Orqaga» uni olib tashlaydi.
- Xato izohlari:
  - Ilovada sahifa qayta yuklanmaydi — ekranlar dastada turadi. (59)
  - `<a href>` — brauzer havolasi, telefon ilovasida u yo'q. (54)
  - Bitta ilova ko'p ekrandan iborat — ular bir dastada. (52)
  - (umumiy) Ekranlar bitta ilovada, dasta bo'lib turadi. (44)
✎ «React Native'da bir ekrandan boshqasiga» → aniq ekran nomlari · `'Ekran'` → `'Tafsilot'` · «To'g'ri!» olindi · xato izohlari ≤60

## 9 · fetch  ← QTushuncha (qayta qurildi)
- Eyebrow: Tajriba · fetch
- Sarlavha: **Menyu backend'dan ilovaga qanday keladi?** (40)
- Mentor: Kod qatorlarini tartib bilan bosing va so'rovning yo'lini kuzating.
- Bashorat (ballsiz): **Ilova ochilgan zahoti ro'yxatda nechta pitsa bo'ladi?** · Uchta — ilova bilan birga · Hech qancha — javob kelguncha bo'sh
- Chap — kod `Menyu.js`:
  ```js
  const [menyu, setMenyu] = useState([])

  useEffect(() => {
    fetch(BACKEND + '/menyu')
      .then(r => r.json())
      .then(setMenyu)
  }, [])
  ```
  Kod ostida kulrang qator: «`BACKEND` — backend manzili (`config.js`); amaliyotda o'zingiznikini yozasiz».
- O'ng — ilova xaritasi: telefon ↔ Backend (`GET /menyu`); bot ham Backend'ga ulangan (kulrang).
- **Harakat → Vizual o'zgarish** (navbatdagi qator pulsatsiyada; boshqasi bosilsa — silkinadi):
  1. `useState([])` → telefonda ro'yxat bo'sh, hisoblagich «menyu: 0»
  2. `fetch(BACKEND + '/menyu')` → telefondan so'rov konverti Backend'ga uchadi, `GET /menyu` qatori yonadi
  3. `.then(r => r.json())` → javob konverti (yashil) qaytadi va ochiladi: `[{ "nom": "Margarita", … }]`
  4. `.then(setMenyu)` → ro'yxatda 3 qator paydo bo'ladi, «menyu: 3»
  Oxirgi `[]` yonida kulrang yorliq: «ilova ochilganda bir marta».
- Natija qatori: «Taxminingiz: … · haqiqatda: avval 0, javobdan keyin 3».
- Xulosa: Ilova ochilganda ro'yxat bo'sh; javob kelgach setMenyu uni yozadi va qatorlar chiqadi. (86)
- Tugma (pastki): Qatorlarni bosing (N/4) → Davom etish
✎ «Tanish ko'rinyaptimi?» + «O'SHA BACKEND» matn-kartasi → qatorma-qator so'rov yo'li (184) · `/products` → `/menyu` · `setM` → `setMenyu` ·
«backend darslaridagi Node.js server» → AvtoPizza backend'i (NestJS, bot darslarida) · «bitta backend» fikri 10-ekranga — u yerda harakat bilan

## 10 · Menyu backend'da  ← QTushuncha (qayta qurildi)
- Eyebrow: Tajriba · bitta backend
- Sarlavha: **Menyuga pitsa qo'shilsa, ilova kodini o'zgartirasizmi?** (54)
- Mentor: Backend'dagi menyuga yangi pitsa qo'shing, keyin ilovani qayta oching. Botga ham qarang.
- Bashorat (ballsiz) — variantlar: Ha — ilovaga ham yozaman · Yo'q — ilova backend'dan oladi
- Xarita: Backend qutisida `menyu.ts` (3 qator) · telefon — Menyu (3 qator) · bot chati — `/menu` → 3 tugma · chetda kichik `Menyu.js` belgisi.
- **Harakat → Vizual o'zgarish:**
  1. «+ Qo'ziqorinli · 52 000 so'm» tugmasini bosish → `menyu.ts` ga 4-qator ajralib kiradi; telefon hali 3 qatorda (kulrang «ilova eski ro'yxatda»).
  2. «Ilovani qayta ochish» → telefon miltillaydi, so'rov → javob, ro'yxatda 4-qator; shu payt bot chatida `/menu` → 4 tugma.
  `Menyu.js` belgisi ikkala qadamda jim — yonida kulrang «kod o'zgarmadi».
- Natija qatori: «Taxminingiz: … · haqiqatda: kod o'zgarmadi».
- Xulosa: Menyu backend'da turadi: uni bir joyda o'zgartirsangiz, ilova ham, bot ham yangisini oladi. (91)
- Tugma (pastki): Pitsa qo'shing va ilovani oching (N/2) → Davom etish
✎ bo'sh → yuklanmoqda → ro'yxat (bitta tugma, 📱🔌🗄️ sxema) → backend'da o'zgarish, ilova va bot birga yangilanadi (184; 1-darsdagi «ko'p kirish yo'li, bitta tizim»
harakatda) · xulosa 220 → 97 · «Qo'ziqorinli» — tajriba tugmasi, repo menyusida yo'q

## 11 · 3-savol  ← QTest (✔ 3-variant, `correctIdx 2`)
- Eyebrow: Mashq · 3-savol
- Savol: **Ilova menyu ro'yxatini qayerdan oladi?** (5 so'z)
  - Kodga qo'lda yozilgan massivdan (31)
  - Telefonning o'z xotirasidan (27)
  - ✔ Backend'ga so'rov yuborib (25)
  - Internetdagi tasodifiy saytdan (30)
- To'g'ri izohi: Ilova fetch bilan so'rov yuboradi va menyuni javobda oladi.
- Xato izohlari:
  - Qo'lda yozilgan massiv menyudagi o'zgarishni bilmaydi. (54)
  - Telefon xotirasi — manzil kabi kichik narsa uchun. (50)
  - Tasodifiy sayt AvtoPizza menyusini bilmaydi. (44)
  - (umumiy) Menyu bitta joyda turadi — ilova uni so'raydi. (46)
✎ «Mobil ilova mahsulotlar» → «Ilova menyu» · «To'g'ri!» va izohdagi «Node.js server» olindi · xato izohlari to'g'ri javobni aytmaydi (S-010)

## 12 · Ilova boshidan oxirigacha  ← QTushuncha (QQadamlar, 163.8; CASE)
- Eyebrow: Hayotiy · to'liq oqim
- Sarlavha: **Ilova ochilishidan tafsilotgacha nima bo'ladi?** (46)
- Mentor: Ilovani o'zingiz ishlating: belgisini bosing, keyin Pepperoni'ni oching.
- Bashorat (ballsiz): **Pepperoni'ni bosganda ilova backend'ga yana so'rov yuboradimi?** · Ha — Tafsilot o'zi so'raydi · Yo'q — pitsa navigate bilan keldi
- Chapda qadam-ro'yxati (o'tgani ✓, joriysi accent): Belgi bosildi · So'rov ketdi · Javob keldi · Pepperoni bosildi · Tafsilot ochildi
- O'ngda — ilova xaritasi (telefon avval uy ekranida: AvtoPizza belgisi):
  1. o'quvchi belgini bosadi → ilova ochiladi, Menyu bo'sh, yuklanish belgisi;
  2–3. o'zi davom etadi (≈1,2 s): so'rov konverti Backend'ga, javob qaytadi, 3 qator chiziladi;
  4. o'quvchi Pepperoni'ni bosadi → dastaga Tafsilot (push); telefon ↔ Backend chizig'i jim — konvert yo'q;
  5. Tafsilot: Pepperoni · 55 000 so'm.
  Joriy qadam kartasi — xarita ostida bitta qator (masalan «Backend menyuni JSON qilib qaytardi.»).
- **Harakat → Vizual o'zgarish:** yuqoridagi 1 va 4 — o'quvchi harakati; 2–3 — xaritada konvert yuradi. Har qadamda chapdagi band ✓.
- Natija qatori: «Taxminingiz: … · haqiqatda: so'rov ketmadi — pitsa navigate bilan keldi».
- Xulosa: Ilova menyuni bir marta so'raydi; tafsilotga pitsa navigate bilan uzatiladi. (76)
- Tugma (pastki): Ilovani ishlating (N/5) → Davom etish
✎ «Keyingi qadam» 4 marta + 5 matn-qadam (📱🔌📋👆) → o'quvchi ilovani o'zi ishlatadi (184) · bashorat qo'shildi · xulosa 238 → 82 · «yuklanish belgisi, xato
holati keyin» eslatmasi uyga vazifaga ko'chdi (ikki yopilish matni yo'q, P-051) · qadam nomlari finaldagi bo'laklar so'zi bilan emas

## 13 · Telefon xotirasi (qo'shimcha)  ← QTushuncha (qayta qurildi)
- Eyebrow: Qo'shimcha · AsyncStorage
- Sarlavha: **Ilovani yopib ochsangiz, manzil saqlanadimi?** (44)
- Mentor: Manzilni yozing va ilovani yopib oching. Keyin saqlashni yoqib, yana sinab ko'ring.
- Bashorat (ballsiz) — variantlar: Saqlanadi · Yo'qoladi
- Chap — kod (2 qator, avval kulrang — o'chiq):
  ```js
  await AsyncStorage.setItem('manzil', manzil)
  const saqlangan = await AsyncStorage.getItem('manzil')
  ```
- O'ng — xarita: telefon (Menyu, tepada «Manzilingiz…»), ostida kichik quti «telefon xotirasi» (bo'sh); Backend — o'z joyida.
- **Harakat → Vizual o'zgarish:**
  1. «Chilonzor 5» tugmasini bosish → maydonga yoziladi; «Ilovani yopib ochish» → telefon o'chib yonadi, maydon bo'sh.
  2. «Saqlashni yoqish» → kod qatorlari yonadi; manzil yana yoziladi → «telefon xotirasi»da `manzil: "Chilonzor 5"`; «Ilovani yopib ochish» → maydonda «Chilonzor 5».
  Backend ikkala safar jim — manzil unga bormaydi.
- Natija qatori: «Taxminingiz: … · haqiqatda: saqlashsiz yo'qoldi, saqlash bilan qoldi».
- Xulosa: AsyncStorage telefonda kichik narsani saqlaydi; menyu esa backend'da qoladi. (76)
- Tugma (pastki): Ikki marta sinang (N/2) → Davom etish
✎ savat + `JSON.stringify/parse` (8 qator) → manzil (satr, JSON shart emas) · 3 matn-karta (🛒⚙️⚠️) → yopib-ochish tajribasi (184) · sarlavha 58 → 44 ·
«web'dagi localStorage'ga o'xshaydi» olindi (Mentor 4 gap → 2) · ekran testsiz qo'shimcha qoladi (v2 B-2), amaliyotda ishlatilmaydi

## 14 · 4-savol  ← QTest (✔ 1-variant, `correctIdx 0`)
- Eyebrow: Mashq · 4-savol
- Savol: **Botning backend'i tayyor. Ilova uchun backend'ni nima qilasiz?** (8 so'z)
  - ✔ Botning o'sha backend'iga ulayman (33)
  - Ilova uchun yangi backend quraman (33)
  - Backend'siz, hammasini telefonda qilaman (40)
  - Menyuni ilova kodiga ko'chirib olaman (37)
- To'g'ri izohi: Menyu bitta backend'da; bot ham, ilova ham uni fetch bilan so'raydi.
- Xato izohlari:
  - Ikkita backend — ikkita menyu: narx ikki joyda tuzatiladi. (58)
  - Menyu va buyurtmalar umumiy — ular serverda turadi. (51)
  - Ko'chirilgan menyu narx o'zgarganda eskirib qoladi. (51)
  - (umumiy) Menyu bitta bo'lsa, uni bir joyda o'zgartirasiz. (48)
✎ «Web-do'koningiz bor» → «Botning backend'i tayyor» (bitta olam) · «To'g'ri!» olindi · to'g'ri javob eng uzuni emas

## 15 · Ilova oqimi (final)  ← QTartib (DE-203, 188)
- Eyebrow: Yakuniy · ilova oqimi
- Sarlavha: **Ilova oqimini to'g'ri tartibda yig'ing.** (39)
- Mentor: Har bo'lak — ilovadagi bitta hodisa. Ularni chapdagi bo'sh joylarga qo'ying.
- Bo'laklar (to'g'ri tartib — kodda `FLOW_ORDER`, o'quvchiga aralash; tavsif tartibni ochmaydi):
  1. Ilova ochildi · Menyu ekrani chiqadi
  2. Backend'dan fetch · `/menyu` ga so'rov
  3. FlatList · qatorlarni chizadi
  4. Pitsani bosish · `navigate` chaqiriladi
  5. Tafsilot ekrani · dastaga qo'yiladi
- Uya izohi (hammasida bir xil): «bu yerga qo'ying»
- Xato (to'la, noto'g'ri): Tartib xato — bo'lakni bosib qaytaring va qayta joylang. (56)
- Xulosa (yechilgach): Ilova avval menyuni so'raydi va chizadi; bosilgan pitsa dastaga qo'yiladi. (74)
✎ «Hozir emas — avval «…» bo'lishi kerak» (keyingi bo'lakni aytib qo'yardi, P-068) → QTartib xato matni · tavsif «birinchi ekran ochiladi» («birinchi» tartibni
ochardi) olindi · «Mahsulotni bosish» → «Pitsani bosish» · «✓ Oqim tayyor: Ochildi → …» xulosasi → bitta gap · ball mantiqi o'zgarmaydi (birinchi to'la urinish)

## 16 · Amaliyot  ← amaliyot bloki (`ScreenBlok`, 173)
- Eyebrow: Amaliyot · ilova + backend
- Sarlavha: **Ilovangiz menyuni botingiz backend'idan olsin.** (46)
- Mentor: Menyu va Tafsilot ekranlari endi sizning repo'ngizda quriladi. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan «Bajardim», ↻ qaytaradi; 176):
  1. **Ochish** — Antigravity'da `TelegramBotNest`. 1-terminal: `npm run start:dev` — «Server 3000-portda ishlayapti» (serverdagi bot shu payt jim;
     dars oxirida `git push` uni tiklaydi). 2-terminal: `cd mobile` → `npx expo start`; telefonda Expo Go bilan QR — 9-darsdagi ekran ochiladi.
  2. **Prompt** — qavsga kompyuter IP'sini yozing (2-terminaldagi `exp://192.168.…:8081` qatoridagi raqamlar), «Nusxalash», Antigravity'ga:
     > Backend'ga `GET /menyu` qo'sh: `src/api/menyu.ts` dagi `PITSALAR` ni `[{ id, nom, narx }]` qilib qaytarsin, narx `som()` bilan. Bot va AI o'zgarmasin.
     > `mobile/` da ikki ekran (Stack): `Menyu` — `useEffect` ichida `fetch(BACKEND + '/menyu')`, ro'yxat `FlatList` bilan, qator bosilsa `navigation.navigate('Tafsilot', { pitsa: item })`.
     > `Tafsilot` — `route.params` dagi pitsaning nomi va narxi; «Menyuga qaytish» — `navigation.goBack()`. `BACKEND` = `http://`**{kompyuter IP}**`:3000`.
  3. **Ishga tushirish** — 1-terminal o'zi qayta ishga tushadi, xatosiz. Brauzerda `localhost:3000/menyu` — uchta pitsa.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — Expo Go'da ilova yangilanadi: Menyu'da uchta pitsa → Pepperoni → Tafsilot «Pepperoni · 55 000 so'm» → «Menyuga qaytish».
     Telegramda `/menu` — o'sha pitsalar: bot ham, ilova ham hozir sizning kompyuteringizdagi bitta backend'da.
- O'ngda — kutilgan natija (telefon ramkasi, yorliq «kutilgan natija · namuna: AvtoPizza»): Menyu (Margarita 45 000 so'm · Pepperoni 55 000 so'm · Pishloqli 50 000 so'm)
  → 4-qadamda Tafsilot (Pepperoni · 55 000 so'm · «Menyuga qaytish»). 3-qadamda o'rniga brauzer oynasi: `…/menyu` va JSON (3 qator).
- Ishlamasa (4-qadam ostida, bitta qator): «Network request failed» — IP va Wi-Fi'ni tekshiring. (53)
- Yashil (oxirida): Bot va ilova bitta menyuni ko'rsatadi — ikkalasi bitta backend'dan oladi. (73)
- Pastda: Ortda qoldingizmi — `git checkout -f dars-6-10-done`
✎ `ScreenLivePractice` (5 bosqich ro'yxati, «ustoz bergan yo'riqnoma», TOPSHIRIQ kartasi) → repo-blok (F-1004 Q6 A, 173) · `/products` va «backend darslaridagi server» →
o'z `TelegramBotNest` backend'i (laptopda, 173.2 «Ochish» standarti — 11-dars bloklari bilan bir xil) · `route.params` promptda (F-0929-29) ·
«❓ Ishlamasa … (8-darsdagi qoida)» → aniq xato matni (P-026) · IP qayerdan olinishi aytildi (Expo terminali — OS buyrug'i shart emas) · webhook halol aytildi (173.1, README)

## 17 · Natijalar (podium) — o'zgarmaydi
- Savol yorliqlari (`Q_LABELS`): 1 — FlatList · 2 — Navigatsiya · 3 — fetch · 4 — Bitta backend · 5 — Ilova oqimi
✎ «3 — Fetch» → «3 — fetch» (kod so'zi kichik harf bilan, darsdagidek)

## 18 · Takrorlash  ← QKartochka (12)
| Old tomon | Orqa | Izoh |
|---|---|---|
| Menyuni ro'yxat qilib qaysi komponent chizadi? | FlatList | Har element uchun bitta qator chizadi |
| Bosiladigan element uchun qaysi komponent? | Pressable | Bosilganda `onPress` ishlaydi |
| Foydalanuvchi manzil yozadigan maydon? | TextInput | Web'dagi `<input>` kabi |
| Sig'magan qatorni surib ko'rish uchun? | ScrollView | Barmoq bilan suriladi |
| Ekranlar dastasini nima boshqaradi? | Stack Navigator | Yangi ekran ustiga qo'yiladi |
| Tafsilot ekraniga qaysi buyruq bilan o'tasiz? | navigation.navigate | Ekran dastaga qo'yiladi (push) |
| Oldingi ekranga qaytish uchun? | navigation.goBack() | Ustki ekran olinadi (pop) |
| Tafsilot ekrani pitsani qayerdan oladi? | route.params | navigate uzatgan ma'lumot |
| Menyu backend'dan qanday olinadi? | fetch | Ilova so'rov yuboradi, javobni oladi |
| Menyu ilova ochilganda bir marta yuklanishi uchun? | useEffect(…, []) | Bo'sh massiv — «bir marta» degani |
| Manzilni telefonning o'zida saqlash uchun? | AsyncStorage | Kichik narsa; menyu backend'da |
| Ilova uchun yangi backend kerakmi? | Ko'pincha yo'q — o'sha backend | Bot va ilova bitta menyuni oladi |
✎ «Rasm ko'rsatish — Image» kartasi olindi (arena 10-savoli bor) · `route.params` kartasi qo'shildi · savat → manzil · mahsulot → menyu

## 19 · Yakun  ← QYakun
- Yorliqlar: ✓ Ko'p ekranli ilova · {to'g'ri}/5 to'g'ri
- Sarlavha: **Endi ko'p ekranli ilovani backend'ga ulay olasiz.** (49)
- Endi siz bilasiz:
  - FlatList massivdagi har element uchun bitta qator chizadi
  - `navigate` ekranni dastaga qo'yadi, `goBack` uni oladi; ma'lumot `route.params` da keladi
  - `useEffect` + `fetch` — ilova ochilganda menyuni backend'dan oladi
  - Bot va ilova bitta backend'ga ulanadi — menyu bir joyda o'zgaradi
  - Qo'shimcha: AsyncStorage telefonda kichik narsani saqlaydi
- Uyga vazifa:
  - **Qo'shing** — `menyu.ts` ga bitta yangi pitsa yozing va uni ilovada ham, botda ham ko'ring.
  - **Ko'rsating** — ro'yxat kelguncha Menyu ekranida «Yuklanmoqda…» yozuvi tursin.
  - **Sinang** — noto'g'ri `BACKEND` manzili bilan ilovani oching va ekranga xato yozuvini chiqaring.
- Keyingi dars — **Praktika: mobil ilova (mini-do'kon).** Bugungi ilovaga savat va buyurtma qo'shasiz.
  (Nom App.jsx dagidek; 11-dars MD v3 uni «Loyiha kuni: mobil ilova» ga o'zgartirishni taklif qiladi — tasdiqlansa, shu qator ham.)
- Fon so'zlari (R-008; uz, kod bosqichida {uz, ru}): uyga vazifa banneri — amaliyot · loyiha · mashq · natija; arena — FlatList · fetch · navigate · useEffect ·
  Pressable · push/pop · AsyncStorage · Stack · Tafsilot · backend · ilova · menyu · ✓ · ✗ (kod so'zlari tarjima qilinmaydi; «Tafsilot», «backend», «ilova», «menyu» — {uz, ru}).
✎ sarlavha 61 → 48 · «Chizing / Ulang / O'ylang» (qog'ozda) → repo'dagi uch aniq ish; «yuklanish, xato holati» shu yerda (12-ekrandan) · «Mini-do'kon mobil
ilovasini boshidan oxirigacha» → davom (savol D-1)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, medal belgisi o'yin qatlami:
- **List Builder** — menyu uchun FlatList'ni tanladingiz (4)
- **Navigator** — `navigate` bilan ekranga o'tishni bildingiz (8)
- **Live Data** — menyu backend'dan fetch bilan kelishini bildingiz (11)
- **App Flow** — ilova oqimini to'g'ri tartibda yig'dingiz (15)

**Qisqa takrorlash oynalari (4 × 3 karta; belgi o'rniga kod qatori — S-026):**
1. (4) **FlatList — ro'yxatni chizadi:** `data={menyu}` — massivni oladi · `renderItem` — bitta qator qolipi · har element — bitta qator, qo'lda yozilmaydi ·
   Sinfga savol: Menyuni ro'yxat qilib qaysi komponent chizadi?
2. (8) **Navigatsiya — ekranlar dastasi:** `navigate('Tafsilot')` — dastaga qo'yadi (push) · `route.params` — uzatilgan pitsa · `goBack()` — dastadan oladi (pop) ·
   Sinfga savol: Menyu ekranidan Tafsilot ekraniga qanday o'tasiz?
3. (11) **Backend'dan fetch:** `useState([])` — avval bo'sh · `fetch(BACKEND + '/menyu')` — so'rov · `.then(setMenyu)` — javob ro'yxatga ·
   Sinfga savol: Ilova menyuni qayerdan oladi?
4. (14) **Bitta backend — ko'p kirish yo'li:** `PITSALAR` — menyu bir joyda · `GET /menyu` — ilova uchun yo'l · `/menu` — bot o'sha ro'yxatni ko'rsatadi ·
   Sinfga savol: Ilova uchun backend'ni nima qilasiz?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi — faqat matn):**
1. Pitsalar ro'yxatini ko'rsatish uchun qaysi komponent? ✔ FlatList — har element uchun qator · Text — bitta matn bo'lagi · Image — faqat rasm ko'rsatadi · TextInput — matn kiritish uchun
2. Bir ekrandan boshqasiga o'tish uchun nima chaqiriladi? Sahifani qayta yuklash · ✔ navigation.navigate('Tafsilot') · window.location.assign('/tafsilot') · `<a href>` tegi
3. Yangi ekran ochilganda dastada nima bo'ladi? Eski ekran butunlay o'chib ketadi · Ilova qaytadan ishga tushadi (reload) · ✔ Yangi ekran ustiga qo'yiladi (push) · Hech narsa o'zgarmaydi
4. Backend'dan ma'lumot olish uchun nima ishlatiladi? AsyncStorage — telefon xotirasidan · localStorage bilan olinadi · Qo'lda yozilgan massivdan · ✔ fetch — API'ga so'rov
5. Ilova ochilganda ma'lumotni bir marta yuklash qayerda yoziladi? ✔ useEffect(…, []) ichida · Har chizilganda, komponent tanasida · useState([]) ichida · Hech qayerda kerak emas
6. Manzilni telefonning o'zida saqlash uchun nima? Backend bazasida saqlash · ✔ AsyncStorage — mahalliy xotira · fetch — serverga yuborish · FlatList ichida saqlash
7. Botning backend'i bor. Ilova backend'ni nima qiladi? Butunlay yangi backend quradi · Backend'siz, telefonda ishlaydi · ✔ O'sha backend'ga ulanadi · Ma'lumotni qo'lda ko'chiradi
8. Bosiladigan element (web'dagi tugma) — React Native'da qaysi? FlatList · ScrollView · Image · ✔ Pressable
9. Ko'p ekranni boshqaradigan tizim qanday nomlanadi? ✔ Stack Navigator · FlatList · AsyncStorage · useEffect
10. Rasm ko'rsatish uchun qaysi komponent? Text · ✔ Image · Pressable · FlatList
11. Matn kiritish maydoni — qaysi komponent? ScrollView · Image · ✔ TextInput · FlatList
12. Web, bot va mobil ilova bitta serverga ulanadi. Bu nima? Har biri alohida backend · Backend umuman kerak emas · Faqat web backend'ga ulanadi · ✔ Bitta backend, ko'p kirish yo'li

✎ 1 «Mahsulotlar» → «Pitsalar» · 2 `'Detail'`/`'/detail'` → `'Tafsilot'`/`'/tafsilot'` · 6 savat → manzil · 7 «Web-do'koningiz bor» → «Botning backend'i bor» · 12 «mobil» → «mobil ilova»
(✔ o'rni: 1·2·3·4·1·2·3·4·1·2·3·4 — `git diff` bilan tekshiriladi, q23)

---

## B. KOD (kod bosqichida)
1. **Qolipga o'tkazish** (`src/skelet/NamunaDars.jsx` dan, JR-14): 0 `QKirish` · 1 `QReja` · 2, 3, 5, 6, 7, 9, 10, 12, 13 `QTushuncha` (`zoom`, `tugadi`) · 4, 8, 11, 14 `QTest` +
   darsning `QuestionScreen` (mantiq o'zgarmaydi) · 15 `QTartib` · 16 `ScreenBlok` · 18 `QKartochka` · 19 `QYakun`. Palitra `qolipRang('tex')`, `qolipCss(T)`.
2. **`MENYU` — bitta manba (180):** 3 pitsa, repo `PITSALAR` bilan nom/narx aynan. `PRODUCTS` (Telefon · Quloqchin · Aqlli soat) va `COMPONENTS` matn-kartalari olinadi.
3. **`AppMap`** (`// qolip-maket:` e'loni bilan): `Phone` (191, 176×312) · `Dasta` (push/pop animatsiyasi) · `BackendBox` (`menyu.ts` qatorlari, `GET /menyu`) · `TgMock` (bot,
   `/menu` tugmalari) · konvert (so'rov/javob, 1-dars `SysMap` naqshi). `prefers-reduced-motion` — sakrash. Telefon ichidagi `ProductList`/`ProductDetail` → `MenyuMock`/`TafsilotMock`.
4. **Bashorat ekranlari** (3, 5, 6, 9, 10, 12, 13) — `QBashorat` + `QTaxmin`, ballsiz, `onAnswer` ga kirmaydi.
5. **15-ekran** `pick-row` + «Hozir emas — avval …» → `QTartib` (`hints` = «bu yerga qo'ying» ×5, `xatoMatn`); ball — birinchi to'la urinish (`wrongEverRef`, `achMiss`) saqlanadi.
   `FLOW` yorliqlari/tavsiflari yangilanadi, `FLOW_ORDER` o'zgarmaydi.
6. **16-ekran** `ScreenLivePractice` → `ScreenBlok` (5-Modul `BotAiAgentLesson.jsx` namunasi, o'zini o'zi ta'minlaydi, 173.6); kutilgan natija — telefon ramkasi (chat emas),
   3-qadamda brauzer oynasi. Jonli: `PRACTICE_BASE + ekran` zonasi.
7. **Kod namunalari** (3, 7, 9, 13-ekranlar) — repo `dars-6-10-done` dagi `mobile/ekranlar/Menyu.js`, `Tafsilot.js` bilan bir xil (P-065).
8. **Testlar:** `INLINE_KEYS` va `correctIdx` o'zgarmaydi; `explainCorrect` dan «To'g'ri!» olinadi; xato izohlari ≤60.
9. **Arena:** `QUIZ_BANK` 2, 6, 7, 12-savollar matni; `correct` o'zgarmaydi. `QZ_BG_SHAPES`: `Detail` → `Tafsilot`, 📱 → `ilova`, 🗄️ → `menyu`; so'zlar `{ uz, ru }` (R-008).
10. **RECAPS:** `ic` emoji → kod qatori (S-026); matni yuqoridagidek. `ACHIEVEMENTS.desc` yangilanadi, nomlar va medal belgilari qoladi.
11. **App.jsx** m6-10 `sub`: «View, Text, Stack Navigator, fetch» → «FlatList, Stack Navigator, fetch» (View/Text — 9-darsda; reja ta'rifi bilan mos, P-015). `title` o'zgarmaydi (DE-205).
12. `SCREEN_META` (20), `LESSON_META.lessonId`, `Q_LABELS` indekslari o'zgarmaydi.
13. Darvozalar: `npm run gates -- src/6-Modull/ReactNativeAppLesson.jsx` 12/12 · `lint:olchov` 0 warn · `lint:emoji` qolip 0 · `lint:jsx` · `lint:layout` 1280/1366/390 · surat (1280 + 393).

## C. REPO (`TelegramBotNest` — repo'ga nima qo'shiladi)
1. **Backend:** `src/api/menyu.controller.ts` — `GET /menyu` → `Object.entries(PITSALAR)` dan `[{ id, nom, narx: som(narx) }]`; `AppModule.controllers` ga qo'shiladi.
   Bot, AI va agent `menyu.ts` ni avvalgidek ishlatadi (bitta manba).
2. **`mobile/` starter'ida navigatsiya** (F-0929-13 B-1 — tayyor starter): `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`,
   `react-native-safe-area-context` — `dars-6-09-start` dagi `mobile/package.json` da bo'lsin (10-darsda o'rnatish qadami yo'q). 9-dars MD v3 bilan kelishiladi.
3. `mobile/config.js` — `export const BACKEND = 'http://192.168.…:3000'` (o'quvchi kompyuterining IP'si; tegdagi qiymat — namuna).
4. `mobile/App.js` — `NavigationContainer` + `createNativeStackNavigator`: `Menyu`, `Tafsilot` (`options={{ headerBackTitle: 'Orqaga' }}` — maketdagi «‹ Orqaga» shundan).
5. `mobile/ekranlar/Menyu.js` — `useState([])` + `useEffect` + `fetch(BACKEND + '/menyu')` + `FlatList` + `Pressable` → `navigation.navigate('Tafsilot', { pitsa: item })`.
6. `mobile/ekranlar/Tafsilot.js` — `route.params.pitsa` → nom, narx; «Menyuga qaytish» → `navigation.goBack()`.
7. **Teglar:** `dars-6-10-start` (= `dars-6-09-done`) · `dars-6-10-done`; README «Darslar va teglar» jadvaliga 6-Modul qatorlari (9 · 10) va «Papkalar»ga `mobile/`.
8. **Fork'da yangi teg yo'q:** o'quvchilar repo'ni 5-Modul 3-darsida fork qilgan — `dars-6-*` teglari ularning nusxasiga o'zi tushmaydi. 9-dars 1-qadamida bir marta
   `git fetch https://github.com/Azizbekcrypto/TelegramBotNest.git --tags` (yoki `upstream` remote) — aks holda «Ortda qoldingizmi» buyrug'i ishlamaydi (savol D-2).
9. AsyncStorage repo'ga qo'shilmaydi (13-ekran — tanishuv).

## D. Foydalanuvchi hal qiladigan savollar
1. **Misol-ip:** dars bo'yi AvtoPizza (tavsiya — amaliyot va bot bilan bitta olam, «bitta backend» haqiqiy) yoki mini-do'kon (v2; amaliyot bilan ikki olam).
   AvtoPizza bo'lsa, 9-dars ham shu olamda bo'lishi va m6-11 nomidagi «(mini-do'kon)» o'zgarishi kerak (KOD: App.jsx nom — 11-dars MD v3 da).
   11-dars MD v3 ham AvtoPizza'ni tanlagan (Menyu · Tafsilot, `GET /menyu`, `mobile/`) — nomlar shu MD bilan bir xil.
2. **6-Modul teglari forkda:** 9-dars 1-qadamiga `git fetch … --tags` qo'shish (tavsiya) yoki zaxira teglarisiz («Ortda qoldingizmi» qatori olinadi).

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (m6-09 · m6-10 · m6-11 nomlari aynan; `sub` — KOD 11)
- [✓] Bitta misol-ip (AvtoPizza, D-1 tasdig'i bilan); metafora bitta — «kartalar dastasi», 5-ekranda bir marta; bitta vizual — ilova xaritasi
- [✓] Har tushuncha-ekranda (2, 3, 5, 6, 7, 9, 10, 12, 13) «Harakat → Vizual o'zgarish» bor, matn-karta yo'q
- [✓] Sarlavha ≤55 (eng uzuni 10-ekran 54) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 (eng uzuni 91) · hook javobi ≤120 (eng uzuni 119) · xato izohi ≤60 (eng uzuni 59)
  — o'lchov skript bilan (`scratchpad/10-mdv3/olchov.py`), sarlavha yonidagi sonlar shundan
- [✓] Atamalar 9-dars va 1-dars bilan bir xil (Expo Go, Pressable, so'rov/javob, «ko'p kirish yo'li, bitta tizim», bosish) · siz-forma; zanjir/yorliq ot-shaklda; AI promptida
  sen-forma (§222 istisno)
- [✓] Testlar: variantlar bir shaklda va yaqin uzunlikda, kalit so'z/qavs faqat to'g'rida emas · ✔ o'rni o'zgarmagan (s4 3 · s8 1 · s11 2 · s14 0; arena 3/3/3/3)
- [✓] Final: uya izohi «bu yerga qo'ying», tavsiflar tartibni ochmaydi, Mentor tartibni aytmaydi
- [✓] Emoji yo'q (nishon medali, arena, podium — istisno) · kafolat gaplari yo'q («real ilova», «to'liq ishlaydigan», «darrov» — olindi)
- [✓] Ichki kodlar yo'q (T6, P1, Modul 4/9 yo'q; «9-darsdagi» — dars raqami, menyuda ko'rinadi) · «KOD» 13 band, «REPO» 9 band
- [✓] Karta T · P · S ko'rildi: T-011 (atama harakatdan keyin), T-016 (metafora bir marta), T-064 (ko'prik olindi), P-001, P-015, P-026 (aniq xato matni), P-040, P-052,
  P-055 (12-ekran), P-064, P-065, P-067, P-068, S-001 (savollar ≤12 so'z), S-010, S-026
- [?] P-028 tashqi manzillar: «Server 3000-portda ishlayapti» — repo `main.ts` dagi yozuv (tekshirildi); Expo «Network request failed» — RN
  xato matni, kod bosqichida haqiqiy telefonda bir marta ko'riladi
