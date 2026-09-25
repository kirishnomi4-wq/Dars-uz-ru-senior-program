# Bridge · «Nima quramiz va qachon tayyor?» — dars rejasi

> Holat: QORALAMA v1 → metodist korrekturasi ✅ → kelishildi (20:40) → **foydalanuvchi fidbegi (pasport · fikrlar · 1–18-ekran) halol saralab kiritildi ✅ (2026-09-23 23:29) — GATE S** → qurish.
> Namuna: `BRIDGE-B1-KimUchun.md` · Manba darslar: `pm/PmUserStoryLesson` (User Story), `2-Modull/PmLesson5` (Dekompozitsiya), `3-Modull/PmLesson8` (Prioritet), `3-Modull/PmLesson9` (Acceptance Criteria).

## 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node.js (Express) va NestJS darslariga o'tadigan o'quvchi (3 darsning 2-si, «Kim uchun va qanday muammo?» dan keyin) |
| Mavzular (4) | User Story · Dekompozitsiya · Prioritet · Acceptance Criteria |
| Maqsad | O'quvchi o'z g'oyasiga **bitta foydalanuvchi hikoyasi** yozadi, g'oyani alohida bo'laklarga ajratadi, qaysi bo'lakni avval qurishni **odamlar ehtiyoji va taxminiy vaqtga** qarab tanlaydi va tanlangan bo'lakka **3 ta tekshiriladigan shart** yozadi |
| Misol-ip | **O'zimizning taksi ilovamiz** — «taksi chaqirish xizmatini o'zimiz noldan qursak». Yandex Go faqat taqqoslash namunasi (5-ekranda bir marta): qurilayotgan ilova — bizniki, uning bo'laklari, sonlari va xatolari ham bizniki |
| Keys | K3 Instagram — «Burbn'dan uchta narsa qoldi». Matn 2-o'tish 3-darsida foydalanuvchi tasdiqlagan ko'rinishda (sana va 25 000 raqami ekranda aytilmaydi) |
| O'z ishi | Oldingi darsdagi karta ochiladi → 1 hikoya → 4 bo'lak → birinchi bo'lak + sabab → 3 shart. Keyingi darsga o'tadi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

## 2. Darsning to'rt asosiy fikri

1. **Hikoyada uchta narsa bor: kim, nimani xohlaydi va nima uchun.** Uchalasi ham kerak. «Nima uchun» qismi dasturchiga bu imkoniyat odamga qanday foyda berishini tushuntiradi. «Xaritaga mashinani qo'shing» — oddiy topshiriq; «Men kechqurun to'garakdan qaytadigan o'quvchi sifatida, mashina qayerdaligini xaritada ko'rishni xohlayman — ko'chada kutib qolmaslik uchun» — hikoya.
2. **Katta ish alohida bajarib, tekshirib bo'ladigan kichikroq bo'laklarga ajratiladi.** Birinchi versiya — odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan eng kichik mahsulot.
3. **Qaysi bo'lak avval — bu darsda ikki sodda mezon bilan tanlanadi:** qancha odamga kerak va qancha vaqt oladi. Real loyihalarda boshqa mezonlar ham bo'ladi (masalan, xavfsizlik yoki bir bo'lak boshqasiga bog'liqligi).
4. **«Ishlaydi» va «tayyor» boshqa-boshqa.** «Ishlaydi» — biror holatda to'g'ri natija berdi. «Tayyor» — oldindan kelishilgan hamma shart bajarildi va muhim holatlar tekshirildi. Shartda nima qilinishi va natijada nima bo'lishi aniq yozilsin — kerak bo'lsa son bilan.

Ip-zanjir: **hikoya → bo'laklar → birinchisi → uch shart → o'z g'oyamga xuddi shunday.**

> **Yandex Go halolligi:** Yandex Go bir marta (5-ekran) taqqoslash namunasi sifatida nomlanadi — unda **ko'rinib turgan** narsalar: manzil kiritish · narx buyurtmadan oldin · mashina xaritada · haydovchi va mashina ma'lumoti · safardan keyin baho (qurishda ilovaning hozirgi ko'rinishi bilan tekshiriladi). Qolgan hamma narsa — «biz qurayotgan ilova» haqida: uning bo'laklari, 8-ekrandagi odamlar soni va kunlar (mashq uchun taxmin), xatolari (10-ekrandagi bo'sh manzil bilan ketgan buyurtma) **bizning ilovamizda**, Yandex Go'da emas. Ekranda shu farq ochiq yoziladi: 5-ekranda «ro'yxatni biz o'zimiz tuzdik», 8-ekranda «Odamlar soni va vaqt — mashq uchun qilgan taxminimiz, Yandex Go ma'lumoti emas», 10-ekranda «…bizning ilovamizning "Mashina chaqirish" bo'lagi, Yandex Go emas».

---

## 3. Ekranlar

### KIRISH

**1 · Hook** — ikki so'rovni solishtirish, ovoz berish
- Sarlavha: «Dasturchiga ikki xil topshiriq keldi. Qaysi biri unga ko'proq yordam beradi?»
- Ikki karta: «Xaritaga mashinani qo'shing.» ↔ «Men kechqurun to'garakdan qaytadigan o'quvchi sifatida, mashina qayerdaligini xaritada ko'rishni xohlayman — ko'chada kutib qolmaslik uchun.»
- Javob (ovozdan keyin, ikkala tanlovga bir xil): «Birinchisi qisqa va nimani qilish kerakligini aytadi. Lekin unda kim uchun va nima sababdan kerakligi yo'q. Ikkinchisida esa odam, uning istagi va kutayotgan foydasi ham bor. Ikkinchisi uzunroq bo'lgani uchun emas, shu uchta narsa uchun foydaliroq.»

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «O'zingiz tanlagan g'oyaga bitta hikoya yozasiz. Keyin g'oyani bo'laklarga bo'lib, qaysi biridan boshlashni tanlaysiz. Oxirida tanlagan bo'lagingiz tayyor bo'lganini qanday tekshirishni uchta shart bilan yozasiz.»
- Vizual: hikoya-karta → 4 bo'lakka sochiladi → bittasi yashil «birinchi» bo'lib ajraladi → yonida 3 ta ✓ shart yozilib chiqadi. Chapdan o'ngga.

### 1-BLOK · HIKOYA

**3 · Uch qism** — sudrab yig'ish
- Sarlavha: «Hikoyaning uch qismini joyiga qo'ya olasizmi?»
- Uch qism aralash turadi (yakka o'qilganda ham tugal): «kechqurun to'garakdan qaytadigan o'quvchi» (KIM) · «mashina qayerdaligini xaritada ko'rish» (NIMANI XOHLAYDI) · «ko'chada kutib qolmaslik» (NIMA UCHUN). O'quvchi qolipga joylaydi: «Men {KIM} sifatida, {NIMA}ni xohlayman — {NIMA UCHUN} uchun.» Yig'ilgan gap 1-ekrandagi ikkinchi kartaning aynan o'zi.
- Xulosa (harakatdan keyin): «Kimligi, nimani xohlashi va nima uchun xohlashi ko'rsatilgan bunday gap **foydalanuvchi hikoyasi** (User Story) deyiladi. Uchala qism ham kerak: "nima uchun" qismi dasturchiga bu imkoniyat odamga qanday foyda berishini tushuntiradi.»

**4 · TEST-1** (ball)
- Cue: «Qaysi gapda kim, nimani xohlashi va nima uchun — uchalasi ham bor?»
- ✓ Men shoshayotgan o'quvchi sifatida, narxni oldindan ko'rishni xohlayman — pulim yetishini bilish uchun · Men ilovadan har kuni foydalanadigan odam sifatida, narxni buyurtmadan oldin ekranda ko'rishni xohlayman · Narx buyurtmadan oldin ekranda ko'rinib tursin — safarimni oldindan rejalashtirib olish uchun · Xaritani kattaroq qiling, mashinani esa unda yaxshiroq ko'rinadigan va yorqin qilib qo'ying
- Reveal: «To'g'ri — bu gapda kim ham, nimani xohlashi ham, nima uchun ham bor.» · Xato-izohlar: (2) «Kim va nima bor, lekin odam buni nima uchun xohlayotgani aytilmagan.» · (3) «Nimani xohlashi va nima uchun bor, lekin kim ekani aytilmagan.» · (4) «Bu — oddiy topshiriq: kim uchun va nima uchun, aytilmagan.»

### 2-BLOK · BO'LAKLAR

**5 · Bo'laklaymiz** — bosib ochish
- Sarlavha: «Taksi ilovasini noldan qurish — bitta ishmi yoki bir nechta alohida ishmi?»
- Ekranda ochiq: «Yandex Go'da manzilni yozasiz, narxni oldindan ko'rasiz, mashinani xaritada ko'rasiz. Shunga qarab o'z ilovamizni bo'laklarga bo'ldik — ro'yxatni biz o'zimiz tuzdik.» Bitta karta «Taksi ilovasini qurish» → 6 bo'lak: Mashina chaqirish · Narxni oldindan ko'rish · Mashinani xaritada ko'rish · Haydovchini baholash · Karta bilan to'lash · Safarlar tarixi.
- Kartalar ostida kichik yozuv: «Bo'laklar bir xil kattalikda bo'lishi shart emas. Biz ularni alohida qurib, keyin tekshirib bo'ladigan qismlar sifatida ajratdik.»
- Xulosa: «Katta ilovani bitta ulkan ish sifatida boshqarish qiyin. Har bo'lakni alohida rejalashtirish, qurish va tekshirish osonroq. Katta ishni shunday bo'laklarga bo'lish **dekompozitsiya** deyiladi.»

**6 · Keys: Instagram** — bashorat + 3 slayd (2-o'tish 3-darsi bilan bir xil matn)
- Sarlavha: «Burbn ilovasida ko'p narsa bor edi. Odamlarga yoqqan nimalar qoldi?»
- Bashorat: «Instagram asoschilari avval Burbn degan ilova qilgan. Unda ko'p narsa bor edi: joy belgilash, reja tuzish, surat va yana boshqalar. Odamlarga undagi qaysi narsa yoqqan?» — Joy belgilash · Reja tuzish · Surat qo'yish
- Slaydlar:
  1. «Burbn'da ko'p narsa bor edi, lekin uni ishlatadiganlar juda kam edi.»
  2. «Jamoa odamlar eng ko'p yoqtirgan qismlarni qoldirdi: surat, filtr va izoh.»
  3. «Shu kichik ilova Instagram nomi bilan chiqdi — bugun hamma biladigan Instagram.»
- Ko'prik: «Instagram birinchi kuni uchta narsa bilan chiqdi. Odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan shunday eng kichik mahsulot **birinchi versiya** (MVP) deyiladi.»

**7 · TEST-2** (ball)
- Cue: «Taksi ilovamizning birinchi versiyasi uchun qaysi to'plam yetarli?»
- ✓ Mashina chaqirishning o'zi — qolgani keyin · Karta bilan to'lashning o'zi — qolgani keyin · Olti bo'lakning hammasi, birortasi ham qolmasdan · Haydovchini baholash va safarlar tarixi
- Reveal: «To'g'ri — bu bo'lak odamga asosiy ishni bajarishga imkon beradi: mashina chaqirib, uyiga yetadi. Qolgan bo'laklar keyingi versiyalarda qo'shilishi mumkin.» · Xato-izohlar: (2) «To'lov bor, lekin mashina chaqirib bo'lmaydi — asosiy foyda yo'q.» · (3) «Hammasi bo'lsa, bu to'liq ilova. Birinchi versiya — asosiy foydani beradigan eng kichik mahsulot.» · (4) «Bu bo'laklar bilan mashina chaqirib bo'lmaydi — ilova asosiy foydani bermaydi.»

### 3-BLOK · QAYSI BIRI AVVAL

**8 · Ikki savol, to'rt katak** — joylashtirish
- Sarlavha: «Olti bo'lakdan qaysi biri avval quriladi?»
- Ekran boshida kichik yozuv: «Bu darsda ikkita sodda mezon bilan tanlaymiz. Real loyihalarda boshqa mezonlar ham bo'ladi — masalan, xavfsizlik.»
- Ikki savol ochiladi: «Nechta odamga kerak? ↑» · «Qancha vaqt oladi? →». Ostida bir qator: «Bu mashqda bir haftagacha bo'lgan ishni "tez", bir haftadan ko'pini "uzoq" deb olamiz.» To'rt katak: 🎯 Avval qilinadi (ko'p · tez) · 🏔 Rejaga tushadi (ko'p · uzoq) · 🌱 Vaqt bo'lsa (kam · tez) · ⏳ Hozircha keyinroq (kam · uzoq).
- Har bo'lakda ikki javob yozilgan; kartalar ostida: «Odamlar soni va vaqt — mashq uchun qilgan taxminimiz, Yandex Go ma'lumoti emas.» Ma'lumot: Mashina chaqirish — deyarli hamma yo'lovchiga kerak · 2 kun (🎯) · Narxni oldindan ko'rish — ko'p yo'lovchiga kerak · 2 kun (🎯) · Mashinani xaritada ko'rish — deyarli hamma yo'lovchiga kerak · 3 hafta (🏔) · Karta bilan to'lash — ko'p yo'lovchiga kerak · 2 hafta (🏔) · Haydovchini baholash — kam yo'lovchiga kerak · 1 kun (🌱) · Safarlar tarixi — kam yo'lovchiga kerak · 2 kun (🌱). O'quvchi 6 bo'lakni kataklarga joylaydi.
- Xulosa: «Birinchi bo'lak — 🎯 Avval qilinadi katagidan. U yerda ikki bo'lak bor, ikkalasi ham ikki kunlik. Vaqt teng bo'lsa, bu mashqda ko'proq odamga kerak bo'lganini oldin tanlaymiz: "Mashina chaqirish". Qaysi ishni avval, qaysini keyin qilishni shunday tanlash **prioritet belgilash** deyiladi.»

**9 · TEST-3** (ball)
- Lead: «Yangi bo'lak — "Safarda qo'shiq tanlash": kam yo'lovchiga kerak, qurish uch hafta oladi.» Cue: «Bu bo'lak qaysi katakka tushadi?»
- ✓ Hozircha keyinroq — kam odamga kerak, qurish ham uzoq · Rejaga tushadi — uch hafta uzoq, demak rejaga qo'yamiz · Vaqt bo'lsa — kam odamga kerak, demak keyinroq qilamiz · Avval qilinadi — bu kichik bo'lak, tez qo'shiladi
- Reveal: «To'g'ri — ikkala savol ham shu katakni ko'rsatadi: kam odamga kerak, vaqt uzoq. Bu "keraksiz" degani emas — navbati keyin keladi.» · Xato-izohlar: (2) «Bu mashqda "Rejaga tushadi" katagi ko'p odamga kerak, lekin uzoq quriladigan ishlar uchun. Bu bo'lak kam odamga kerak.» · (3) «"Vaqt bo'lsa" katagiga tez quriladigan ish tushadi. Bu esa uch hafta oladi.» · (4) «Uch hafta bir haftadan ko'p — bu mashqda "tez" emas.»

### 4-BLOK · QACHON TAYYOR

**10 · «Ishlaydi» yoki «tayyor»?** — buyurtma oynasi + 4 shart
- Sarlavha: «Dasturchi "Chaqirish tugmasi ishlaydi" dedi. Bu "tayyor" deganimi?»
- Ekranda ochiq: «Bu — bizning ilovamizning "Mashina chaqirish" bo'lagi, Yandex Go emas.» Oyna: manzil maydoni · «Chaqirish» tugmasi · buyurtmalar ro'yxati. Yonida 4 shart: «Manzil yozib bosilsa, "Buyurtma yuborildi" yozuvi chiqadi» · «Manzil bo'sh bo'lsa, buyurtma yuborilmaydi» · «Tugma ketma-ket ikki marta bosilsa ham, faqat bitta buyurtma yuboriladi» · «Buyurtmalar ro'yxatida yuborilgan buyurtmaning manzili ko'rinadi». O'quvchi bosib ko'radi: 1 va 4 ✓; manzilsiz buyurtma yuborildi ✗; ikki bosish — ikki buyurtma ✗.
- Xulosa: «"Ishlaydi" — biror holatda to'g'ri natija berdi. "Tayyor" — oldindan kelishilgan hamma shart bajarildi va muhim holatlar tekshirildi, odam adashishi mumkin bo'lgan holatlar ham. Ish qachon tayyor deb hisoblanishini ko'rsatadigan, oldindan kelishilgan tekshiriladigan shartlar ro'yxati **qabul shartlari** (Acceptance Criteria) deyiladi.»

**11 · TEST-4** (ball)
- Cue: «Qaysi shartni aniq tekshirib bo'ladi?»
- ✓ Safar tugagach, 1 dan 5 gacha yulduz tanlash oynasi chiqadi · Safar tugagach, baho qo'yish oynasi chiroyli ko'rinadi · Mashina chaqirilgach, kutish vaqti juda qisqa bo'ladi · Ilova ochilgach, undagi hamma narsa qulay va tushunarli bo'ladi
- Reveal: «To'g'ri — safar tugagach oyna chiqadimi va unda 1 dan 5 gacha yulduz tanlash mumkinmi, buni amalda tekshirish mumkin.» · Xato-izohlar (umumiy): «"Chiroyli", "qisqa", "qulay" o'zicha noaniq — har kim har xil tushunadi. Shartda nima qilinishi, natijada nima bo'lishi yoki aniq son yozilsin: masalan, "kutish 5 daqiqadan oshmaydi".»

**12 · Besh qadam tartibi** — tartiblash (ballsiz)
- Sarlavha: «Shartlar qachon yoziladi — ishdan oldinmi, keyinmi?»
- 5 qadam aralash: Shartlarni yozamiz → Shartlarni dasturchi bilan kelishamiz → Dasturchi kodni yozadi → Har shartni birma-bir tekshiramiz → Hammasi bajarilsa, «tayyor» deymiz.
- Xulosa: «Shartlar ish boshlanishidan oldin yoziladi. Shunda dasturchi nimani qurishini oldindan biladi, "tayyor" deganda esa nimani tekshirish kerakligi aniq bo'ladi. Tekshiruvda xato chiqsa, dasturchi tuzatadi va shart qayta tekshiriladi.»

### O'Z G'OYANGIZ

**13 · Hikoyangiz** — ustaxona
- Sarlavha: «Tanlagan g'oyangizga bitta hikoya yoza olasizmi?»
- Oldingi darsdagi kartangiz yonda ochiq turadi (sayt kim uchun · qanday muammo · sayt nima qiladi · odam oxirida nimaga erishadi). **Karta bo'lmasa** (boshqa kompyuter): oldingi darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim) tanlov bo'lib chiqadi — tanlangani karta o'rnida turadi.
- Ko'prik-gap (maydonlar ustida): «Kartada sayt nima qilishi yozilgan edi. Endi shu fikrni odamning o'z tilida yozamiz: "Men … ni xohlayman".»
- Uch maydon, yorliqlar savol shaklida: «Kim?» (kartadagi «Sayt kim uchun?» javobidan) · «Nimani xohlaydi?» (kartadagi «Sayt nima qiladi?» javobidan) · «Nima uchun?» (kartadagi «Odam oxirida nimaga erishadi?» javobidan). Karta javobi maydonga o'zi tushmaydi — namuna bo'lib turadi (karta qatorlari boshqa shaklda yozilgan).
- Qolip: «Men {KIM} sifatida, {NIMA}ni xohlayman — {NIMA UCHUN} uchun.» Namuna (futbol): «hovlida futbol o'ynaydigan o'smir» · «maydonning bo'sh vaqtini oldindan band qilish» · «maydon bo'shashini kutmasdan do'stlarim bilan o'ynash».
- Tekshiruvlar: KIM ko'plikda → «Bu qolipda bitta odam nomidan yozamiz: "o'smirlar" o'rniga "futbol o'ynaydigan o'smir". Shunda uning ehtiyoji aniqroq ko'rinadi.»; NIMA UCHUN harakatni takrorlasa → «Bu hali harakat. Shundan keyin odam nimaga erishadi?»

**14 · Bo'laklar va birinchisi** — ustaxona
- Sarlavha: «G'oyangiz qaysi bo'lakdan boshlanadi?»
- Mentor (1 gap): «Taksi bo'laklariga bergan ikki savolni endi o'z bo'laklaringizga bering.» Shart-yorliqlari: «4 ta bo'lak» · «Har biriga ikki javob» · «Birinchisi va sababi».
- Yo'riq (kichik yozuv): «G'oyangizni 4 ta asosiy bo'lakka ajrating — juda mayda ham, juda katta ham emas: har birini alohida bajarib, tekshirib bo'ladigan qilib yozing.»
- O'quvchi 4 bo'lak yozadi → har biriga ikki javob: «Ko'p odamga · Kam odamga» · «Bir haftagacha · Bir haftadan ko'p» → katak o'zi chiqadi → 🎯 dagi bittasini «birinchi» deb belgilaydi → sabab bir qator. Sababda odam soni ham, vaqt ham bo'lmasa: «Sababda kamida bitta mezon ko'rinsin: nechta odamga kerakligi yoki qancha vaqt olishi. Imkon bo'lsa, ikkalasini ham yozing.»
- 🎯 bo'sh qolsa: «🎯 katagi bo'sh qoldi. Qaysi bo'lakni soddalashtirib, tezroq foyda beradigan kichik qismga aylantirish mumkinligini o'ylang.»

**15 · Uch shart** — ustaxona
- Sarlavha: «Birinchi bo'lagingiz qachon "tayyor" bo'ladi?»
- Birinchi bo'lakka 3 shart bittalab, ikki maydonda: «Foydalanuvchi nima qiladi?» · «Shundan keyin nima bo'ladi?» Namuna: «Bo'sh vaqt bosilsa» · «"Band qilindi" yozuvi chiqadi».
- Jonli tekshiruv: baho-so'zlar (chiroyli · qulay · zamonaviy · tez · yaxshi) → «Buni qanday tekshirasiz? Nima qilinishi va nima bo'lishini aniq yozing, kerak bo'lsa son bilan: masalan, "2 soniyada ochiladi".»; takror shart → «Bu shart oldingisini takrorlayapti. Boshqa holatni oling.»
- Saqlanadi: «✓ Hikoya, bo'laklar va shartlar saqlandi».

### AI BILAN

**16 · AI — sinovchi rolida**
- Sarlavha: «Shartlaringiz qaysi holatni o'tkazib yuborgan?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI shartlaringizda yetishmagan holatni topishga yordam beradi. Qaysi shartni qo'shishni o'zingiz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
  > «Siz ilovadagi xatolarni qidiradigan sinovchisiz. Ilovaning bir bo'lagi: {birinchi bo'lak}. Uning shartlari: 1) {shart} 2) {shart} 3) {shart}. Ikki savolga javob bering: qaysi shart noaniq yozilgan — uni qanday ikki xil tushunish mumkin? Foydalanuvchi qaysi holatda adashishi mumkin, lekin bu holat shartlarda tekshirilmagan? Yangi shartni o'zingiz yozmang — faqat yetishmagan holatni tushuntiring, shartni keyin men o'zim yozaman.»
- «Nusxalash» → gemini.google.com → javobni o'qib, o'quvchi to'rtinchi shart qo'shadi yoki borini aniqroq yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda 3 tayyor sinov-savoli chiqadi, o'quvchi shartlariga qarab bittasini tanlaydi va to'rtinchi shartni o'zi yozadi: «Maydon bo'sh qoldirilsa-chi?» · «Tugma ketma-ket ikki marta bosilsa-chi?» · «Internet uzilib qolsa-chi?» Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI shart yozmaydi, faqat yetishmagan holatni ko'rsatadi. Shartni qo'shish yoki qo'shmaslikni siz hal qilasiz.»

### YAKUN

**17 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz shartingizni tekshira oladimi?»
- Yo'riq: «Sherigingizga 30 soniyada ayting: "Birinchi bo'lagim — …, chunki … . U tayyor ekanini shundan bilaman: …". Sherigingiz shartni qanday tekshirishini aytadi: nima qiladi va qanday natija kutadi.» → «Sherigingiz nima dedi? Bir qatorda yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Foydalanuvchi hikoyasida qaysi uch narsa bor? | Kim · nimani xohlaydi · nima uchun |
| Dekompozitsiya nima? | Katta ishni alohida bajarib, tekshirib bo'ladigan bo'laklarga bo'lish |
| Birinchi versiya nima? | Odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan eng kichik mahsulot |
| Bu darsda qaysi bo'lak avval quriladi? | Ko'p odamga kerak va tez quriladigan |
| «Ishlaydi» va «tayyor» farqi nimada? | «Ishlaydi» — biror holatda to'g'ri natija berdi · «Tayyor» — kelishilgan hamma shart bajarildi va tekshirildi |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), to'rt blokdan teng; ekran savollari va flashcard javoblarining nusxasi emas — boshqa vaziyatda (ovqat yetkazish ilovasi, maktab kutubxonasi sayti, o'yin ilovasi).
- Yakun — sarlavha: «Endi sizda shunchaki g'oya emas, uni qurishni boshlash uchun aniq reja bor.» Ostida 4 qator:
  - Hikoyangizda kim, nimani xohlashi va nima uchun — uchalasi bor.
  - Katta g'oyani alohida tekshirib bo'ladigan bo'laklarga ajratdingiz.
  - Birinchi bo'lakni odamlar ehtiyoji va vaqtga qarab tanladingiz.
  - Birinchi bo'lakka tekshiriladigan shartlar yozdingiz — ular bajarilib, muhim holatlar tekshirilsa, ish tayyor.
- Mentor og'zaki: «Backend modulida shu hikoya va bo'laklardan kelib chiqib, qanday ma'lumot kerakligini va uni qayerda saqlashni o'rganasiz.»

---

## 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 7 · 9 · 11 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Story Built!** (3) — «Hikoyaning uch qismini joyiga qo'ydingiz» · **Grid Master!** (8) — «Olti bo'lakni to'rt katakka joyladingiz» · **First Pick!** (14) — «G'oyangizning birinchi bo'lagini sababi bilan tanladingiz» · **Done Means Done!** (15) — «Birinchi bo'lagingizga uchta tekshiriladigan shart yozdingiz» |

## 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Hikoya | 3–4 | 9 |
| 2-blok · Bo'laklar | 5–7 | 13 |
| 3-blok · Birinchisi | 8–9 | 10 |
| 4-blok · Tayyor | 10–12 | 14 |
| O'z g'oyasi | 13–15 | 20 |
| AI + juftlik | 16–17 | 9 |
| Yakun | 18–20 | 6 |
| Bufer | | 4 |

Dars zich (4 blok + 3 ustaxona). Vaqt yetmasa, birinchi qisqaradigan joy — 12-ekran (besh qadam), uni mentor og'zaki aytadi.

## 6. Kelishib olinadigan joylar

1. **«Yandex Go kabi ilovani biz qursak»** — real ilova bir marta namuna, qolgani bizning ilova. Buyurtma-oynadagi xatolar (10-ekran) bizning ilovada. Ma'qulmi?
2. **Instagram keysi 3-bridge dars bilan bir xil.** Bu o'quvchi 3-darsni ko'rmaydi (u React'ga kiruvchilar uchun), shuning uchun takror emas. Ma'qulmi?
3. **Uch ustaxona ketma-ket (13–15)** — 20 daqiqa. Zanjir tabiiy (hikoya → bo'lak → shart), lekin og'ir. Mentor sinovida ko'ramiz.
4. **AI sinovchi rolida** — 3-dars bilan bir sinf (AI yozmaydi, savol beradi). Qolsinmi?

**Foydalanuvchi qarorlari (2026-09-23 20:40, `feedback/F-0923-bridge/SAVOLLAR_2026-09-23.md` 3-bo'lim — «hammasiga tavsiyang bo'yicha»):**
- 3.1 «Prioritet» — **(a) nomlanadi**: 8-ekran xulosasiga bir gap («…**navbat belgilash** (prioritet) deyiladi») + flashcard 6 almashdi (🏔 katak-kartasi → atama-kartasi; sanoq 8 da qoldi). Jurnal D-6 yopildi.
- 3.2 «Kerak emas» katagi — **(a) bo'sh qoladi**, TEST-3 to'ldiradi. Jurnal D-2 yopildi.
- 3.3 Kartasiz o'quvchi — **ha**: 13-ekranda oldingi darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi (yuqorida kiritildi). Jurnal D-3 yopildi.
- 3.4 Tez tasdiqlar (Yandex Go farazi · Instagram keysi takror emas · uch ustaxona ketma-ket · AI sinovchi) — **ok**.
- 3.5 Quruvchiga qoldirilganlar (Yandex Go skrinshot D-1 · «{NIMA}ni» qolip D-4 · 16-ekran yig'ma D-5 · hook 5× D-7 · «Mashina chaqirish» birinchi D-8) — o'zgarishsiz, qurish bosqichida.
- Senariy **GATE S dan o'tdi** — qurish navbatini kutadi.

---

**Foydalanuvchi ko'rigi (2026-09-23 23:29) — fidbek halol saralandi:**
- **Qabul qilindi:** pasport («Node.js (Express) va NestJS», maqsadda «taxminiy vaqt», misol-ip «o'zimizning taksi ilovamiz», Yandex Go — faqat namuna) · hikoya uch qismi «kim · nimani xohlaydi · nima uchun», «eng muhimi natija» → «uchalasi ham kerak» (3-ekran, TEST-1 xato-izohlari, flashcard, yakun kaskadi) · dekompozitsiya «alohida bajarib, tekshirib bo'ladigan» · MVP ta'rifi «asosiy foydani beradigan, ishga tushirish uchun yetarli eng kichik mahsulot» («ishlaydigan» so'zi ataylab ishlatilmadi — 10-ekrandagi «ishlaydi ↔ tayyor» bilan to'qnashmasin) · hook payoff «uzunroq bo'lgani uchun emas» · maqsad «tayyor bo'lganini qanday tekshirish» · TEST-1 ✓ «yonimdagi pul yetishini bilish uchun» · 5-ekran sarlavhasi va «bo'laklar bir xil kattalikda emas» · 8-ekran: «bu darsda ikki sodda mezon, real loyihada boshqalari ham bor», «bu mashqda bir haftagacha — tez», sonlar «mashq uchun taxmin, Yandex Go ma'lumoti emas», **«Kerak emas» → «⏳ Hozircha keyinroq»** (3.2 qarori katak nomi bo'yicha qayta ko'rildi), «Darrov» → «Avval qilinadi», xulosada «bu mashqda», atama «prioritet belgilash» · TEST-3 va reveal «keraksiz degani emas» · 10-ekran «ishlaydi/tayyor» ta'riflari, 3–4-shart ifodasi, qabul shartlari ta'rifi · TEST-4 reveal va «qisqa — o'lchov berilmagan» izohi · 12-ekran «dasturchi bilan kelishamiz» + «xato chiqsa, tuzatiladi va qayta tekshiriladi» · 13-ekran «bitta odam nomidan yozamiz» izohi, kartadan ko'prik-gap, futbol namunasi · 14-ekran bo'lak o'lchami yo'rig'i, 🎯 bo'sh xabari · 15-ekran «Natijada nima bo'ladi?», «tez» son bilan tekshiriladi · 17-ekran «aniq tekshirish mumkinmi» · 20-ekran yakun sarlavhasi (18-ekran uchun taklif qilingan matn).
- **Qabul qilinmadi / boshqacha qilindi (sababi bilan):** (a) **TEST-2** — fidbek to'g'ri aniqlagan xato («faqat mashina chaqirish» ham himoyalanardi) boshqacha yopildi: ✓ «Mashina chaqirishning o'zi — qolgani keyin», juft distraktor «Karta bilan to'lashning o'zi» — endi yagona himoyalanadigan javob va MVP ta'rifidan chiqadi · (b) **8-ekran kartalarini bir xil «ko'p odamga kerak» qilish** — olinmadi: «deyarli hamma» va «ko'p» farqi vaqt teng bo'lganda qaysi bo'lak avval ekanini hal qiladi; tabiiy ifodaga o'tkazildi («deyarli hamma yo'lovchiga kerak» · «ko'p yo'lovchiga kerak» · «kam yo'lovchiga kerak») · (c) **qolip «…chunki …»** — olinmadi: «— … uchun» 3-ekran, 1-ekran kartasi va 13-ekranda bir xil turadi, User Story qolipiga yaqin · (d) **10-ekran 2-shartga «foydalanuvchiga xabar ko'rsatiladi»** — olinmadi, fidbekning o'zi aytganidek yangi talab qo'shadi · (e) **Instagram keysi** — fidbek o'rniga 2-o'tish 3-darsida foydalanuvchi tasdiqlagan matn qo'yildi (1-slayd yumshoq, sana va 25 000 olindi) — ikki darsda bir keys bir xil gapiradi · (f) **18-ekran Podium** — Podium jonli ball natijasi ekrani (mentor ekranida g'oliblar), dars xulosasi 20-ekranda; taklif qilingan matn 20-ekran yakun-sarlavhasiga ko'chirildi, Podium mazmuni alohida yozildi · (g) **«faylda metodist jurnali qolgan»** — bu fayl ichki senariy-hujjat, o'quvchi ko'rmaydi; ko'rik-hujjat (`BRIDGE_TOLIQ_KORIK_2026-09-23.md`) jurnalsiz yig'iladi.
- Umumiy qoidalar: 16-ekran AI maqsad-gap · so'rov yig'mada · «Gemini ochilmasa» zaxira 3 sinov-savoli · flashcard 5 · Podium mazmuni.
- **Kaskad (ko'rilgan darslarga, shu seansda):** 3/4-o'tish 1-darsi tayyor g'oyalar qo'shimcha jadvali sarlavhasi «nima qilinsa? → natijada nima bo'ladi?». **Keyin (foydalanuvchi ko'rganda):** 3-o'tish 3-darsi 13-ekran va 4-o'tish 3-darsi 15-ekrandagi «Ekranda nima chiqadi?» havolasi.
- **Ikkinchi fidbek (23:34)** — foydalanuvchi uni 3-o'tish 3-dars nomi bilan yubordi, lekin matn shu darsning 23:30 dan oldingi nusxasiga yozilgan (taksi, «Kerak emas», «navbat belgilash»). 31 banddan hozirgi faylda ham to'g'ri kelganlari kiritildi: hook «topshiriq» · dekompozitsiya «boshqarish qiyin, alohida rejalashtirish osonroq» · MVP «g'oyani sinab ko'rishga yetadigan» · TEST-2 reveal ehtiyotkor · «tayyor» — «muhim holatlar» · shart «nima qilinadi · nima bo'ladi · kerak bo'lsa son» · TEST-4 «yulduz tanlash oynasi» (uzunlik tekislandi) · «bahs chiqmaydi» o'rniga «nimani tekshirish aniq» · KIM izohiga sabab · 14-ekran sabab «kamida bitta, imkon bo'lsa ikkalasi» · 15-ekran «Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?» · AI so'rovi aniqroq · juftlik «qanday tekshiradi» · yakun · mentor gapi. Rad: «birinchi versiya» va «MVP» ni ajratish (bridge darslarida bir tushuncha — 2-o'tish 3-darsi bilan bir xil), «…chunki …» qolipi (avval ham rad etilgan), «Oddiy topshiriq / Foydalanuvchi hikoyasi» karta-yorliqlari (atama 3-ekrandan oldin chiqib qolardi). Qolgan bandlar 23:30 da allaqachon yopilgan edi.
- Senariy **GATE S dan o'tdi**.

## Korrektura-jurnali (pm-metodist, 2026-09-23)

Tuzilma, ekran soni (20), mexanika, ball-joylari (4 · 7 · 9 · 11), vaqt jadvali o'zgarmadi. Variantlarda ✓ birinchi yozilgan — qurishda pozitsiyani Jonli aralashtiradi. Asl v1 nusxasi: scratchpad `B5-v1-orig.md`. MATN_KORPUS.md ga yozilmadi.

### A. Tuzatishlar (❌ → ✅ · sabab)

| # | Ekran | ❌ edi | ✅ bo'ldi | Sabab |
|---|---|---|---|---|
| 1 | 3 · 13 · 19 · 2-bo'lim | «Hikoyaning **uch bo'lagi**» (kim · nima · natija) | «Hikoyaning **uch qismi**» | **§156:** darsda «bo'lak» — dekompozitsiya bo'lagi (6 bo'lak, 4 bo'lak, «birinchi bo'lak»). Hikoyaning bo'lagi ham «bo'lak» bo'lsa, 14-ekranda «4 bo'lak yozing» va 3-ekrandagi «3 bo'lak» bitta so'z ikki ma'noda. Sanoq-ro'yxatdagi «3 bo'lak» endi «3 qism» (P0 dagi «1 hikoya — 3 bo'lak» bu darsda ishlamaydi — u yerda dekompozitsiya yo'q) |
| 2 | 3 | qism-qiymatlar «…o'quvchi **sifatida**» · «…ko'rmoqchiman» · «…qolmasligim **uchun**» + qolip «{KIM} sifatida, {NIMA} — {NATIJA} uchun» | qiymatlar egaliksiz: «kechqurun to'garakdan qaytadigan o'quvchi» · «mashina qayerdaligini xaritada ko'rish» · «ko'chada kutib qolmaslik»; qolip P0 dagi: «Men {KIM} sifatida, {NIMA}ni xohlayman — {NATIJA} uchun.» | **§37:** qo'shilganda «sifatida sifatida», «uchun uchun» chiqardi. Korpus §13: chip-qiymat egaliksiz masdar — yakka ham, qolipda ham toza. Yig'ilgan gap 1-ekran kartasi bilan so'zma-so'z bir xil (ip) |
| 3 | 1 | sarlavha «…Qaysi biridan u yaxshi ish qiladi?» · karta «…ko'rmoqchiman — …qolmasligim uchun» · payoff «Ikkinchisida dasturchi KIM uchun va NEGA qilayotganini biladi. Farq shu ikki so'zda.» | «Dasturchiga ikki xil so'rov keldi. Qaysi biri unga ko'proq yordam beradi?» · karta = 3-ekran qolipi · «Birinchisi qisqa va tushunarli, lekin unda kim uchun va nega qurilayotgani yo'q. Ikkinchisida dasturchi shuni ham biladi — farq shu ikki savolda.» | «so'rovdan ish qilmoq» — g'aliz qurilma (§0-5). **§119 (vazifa 5):** bu bashorat, javob ochiladi — mos, qoldi; lekin payoff 1-kartaga ovoz berganni «xato» deb tashlamasin: birinchisining rost yutug'i («qisqa va tushunarli») tan olinadi, keyin yetishmagani aytiladi. Katta harfli urg'u (KIM/NEGA) — ekranda urg'u dizaynniki |
| 4 | 4 TEST-1 | ✓ «Ertalab shoshgan o'quvchi sifatida … ko'rmoqchiman …» · «Foydalanuvchi sifatida … **hamma** narsa …» · «…va **hech qachon** osilib qolmasin» · uzunlik 109/78/73/64 | ✓ «Men shoshayotgan o'quvchi sifatida, narxni oldindan ko'rishni xohlayman — haydovchi bilan bahslashmaslik uchun» · «Men ilovadan har kuni foydalanadigan odam sifatida… (natijasiz)» · «Narx … ko'rinib tursin — yo'lda pulim yetmay qolmasligi uchun» (kimsiz) · «Xaritani kattaroq qiling…» (faqat so'rov) | **uzunlik-tell** 1.70× → 1.36×, ✓ endi eng uzun emas (1.06). **§110:** ikki distraktorda mutlaq so'z, ✓ da yo'q edi — naqsh bilan topilardi. Har distraktor hikoyaning aynan bitta qismini yo'qotadi — xato-izoh aniq («natija yo'q» · «kim yo'q» · «faqat so'rov»). Qolip 3-ekran bilan bir xil |
| 5 | 5 | sarlavha «…biz qursak…» · «Yandex Go'da ko'rinadigan narsalarni sanab, o'z ilovamizning bo'laklarini tuzamiz.» · bo'lak «Manzil kiritish» | «Yandex Go kabi ilovani noldan qursak…» · «Yandex Go'da manzilni yozasiz, narxni oldindan ko'rasiz, mashinani xaritada ko'rasiz. Shunga qarab ilovamizni bo'laklarga bo'ldik — ro'yxatni biz o'zimiz tuzdik.» · bo'lak «**Mashina chaqirish**» | **real mahsulot halolligi (vazifa 4):** eski gap 6 bo'lakning hammasini «Yandex Go'da ko'rinadigan» deb va'da qilardi — halollik ro'yxatida esa «karta bilan to'lash» va «safarlar tarixi» yo'q. Endi Yandex Go'dan faqat ko'rinadigan uchta narsa aytiladi, ro'yxat — bizniki (B3 dagi «biz o'zimiz tuzdik» naqshi). «Manzil kiritish» → «Mashina chaqirish»: oltita bo'lakda **buyurtmaning o'zi** yo'q edi, 10-ekrandagi «Chaqirish» tugmasi esa hech bir bo'lakka tegishli emasdi — endi 5 → 7 → 8 → 10 bitta bo'lak bilan ulanadi |
| 6 | 5 xulosa | «…qurib bo'lmaydi, bo'laklarni birma-bir qurib tugatsa bo'ladi. … Yaxshi bo'lakning boshi va oxiri ko'rinadi.» | «Butun ilovani birdaniga qurib bo'lmaydi, har bo'lakni esa alohida qurib tugatsa bo'ladi. Katta ishni shunday bo'laklarga bo'lish **dekompozitsiya** deyiladi.» | «boshi va oxiri ko'rinadi» — mavhum, ekranda hech narsa ko'rsatmaydi; «alohida tugatsa bo'ladi» mezoni birinchi gapga kirdi. **TMI:** ekran 475 → 380 |
| 7 | 6 ko'prik | «Ochilish kuni **ishlaydigan** eng kam bo'laklar **birinchi versiya** (MVP) deyiladi. Qaysi bo'laklar unga kiradi — keyingi savol.» | «Instagram birinchi kuni uchta narsa bilan chiqdi. Ochilish kuni odamga **foyda beradigan** shunday eng kam bo'laklar birinchi versiya (MVP) deyiladi.» | **§156:** 4-blokning bosh qarama-qarshiligi — «ishlaydi» ↔ «tayyor»; 2-blokda «ishlaydigan» boshqa ma'noda turardi. Kaskad: 2-bo'lim, flashcard 4. **§104/§168:** hodisa (Instagram) → ta'rif-gap (B3 bilan bir xil). «keyingi savol» — mavhum va'da (§38), olindi |
| 8 | 7 TEST-2 | «Birinchi versiya nima?» · ✓ «…eng kam bo'laklar to'plami» · «Hamma bo'lagi **tayyor** bo'lgan…» · «**Eng** chiroyli…» · «Qurish **eng** oson…» | cue «Taksi ilovamizning birinchi versiyasiga qaysi to'plam mos keladi?» · ✓ «Mashina chaqirish va narxni oldindan ko'rish» · «Olti bo'lakning hammasi…» · «Haydovchini baholash va safarlar tarixi» · «Karta bilan to'lash va safarlar tarixi» | **§106:** ✓ ko'prik-gapning parafrazi edi — ko'chirtirardi; endi ta'rifni ipdagi ilovaga qo'llash. **§105:** distraktordagi «tayyor» — 4-blok atamasi kundalik ma'noda. **§110:** «eng» uch variantda. **§102 (B3 #12 sinfi):** «qurish eng oson» 8-ekran qoidasining yarmi (tez) — yarim-rost edi. Yangi distraktorlar 5-ekran («birdaniga qurib bo'lmaydi») va ko'prik («foyda beradigan») bilan ochiq rad etiladi |
| 9 | 8 | tez/uzoq chegarasi yo'q; faqat 3 bo'lakka son; xulosa «Birinchi — 🎯 Darrov qilinadi. Vaqt teng bo'lsa, birinchi savol hal qiladi: ko'proq odam so'ragani.» | chegara-qator «Bir haftaga sig'adigan ish — tez, sig'maydigani — uzoq.» · «Sonlar — bizning taxminimiz.» · 6 bo'lakning hammasiga son · xulosa «Birinchi bo'lak — 🎯 Darrov qilinadi katagidan. U yerda ikki bo'lak bor, ikkalasi ham ikki kunlik. Vaqt teng bo'lsa, ko'proq odam so'ragani birinchi quriladi: "Mashina chaqirish".» | **§95/sanoq manbasi:** «3 hafta — uzoq» nimaga nisbatan? Chegara manba-darsdagi (PmLesson8 «bir haftaga sig'maydi») bilan bir xil. Quruvchi to'qimasin — hamma son berildi. **Halollik:** sonlar Yandex Go'niki deb o'qilmasin. «Vaqt teng bo'lsa» qoidasi eski ma'lumotda hech qayerda **ko'rinmasdi** (teng vaqtli juftlik yo'q edi) — endi 🎯 dagi ikki bo'lak aynan shu qoidani ko'rsatadi. «Birinchi savol hal qiladi» — qaysi «birinchi»? (so'z darsda «birinchi bo'lak» ma'nosida band) → «ko'proq odam so'ragani» to'g'ridan-to'g'ri |
| 10 | 9 TEST-3 | lead «"Mashinani xaritada ko'rish" — deyarli hamma so'raydi, … uch hafta» · ✓ «Rejaga tushadi…» · «Darrov qilinadi — ko'p so'raladi, **demak birinchi**» · «Vaqt bo'lsa — uch hafta juda uzoq» · «Kerak emas — **bir haftaga** sig'maydi» | lead «Yangi bo'lak — "Safarda qo'shiq tanlash": kam odam so'raydi, qurish uch hafta oladi.» · ✓ «Kerak emas — kam odam so'raydi, qurish ham uzoq» · «Rejaga tushadi — uch hafta uzoq, demak rejaga qo'yamiz» · «Vaqt bo'lsa — kam odam so'raydi, demak keyinroq qilamiz» · «Darrov qilinadi — bu kichik bo'lak, tez qo'shiladi» | **§106/§102-kuchaytirish:** eski lead — o'quvchi bir daqiqa oldin 8-ekranda **o'z qo'li bilan** joylagan kartaning aynan o'zi (ma'lumoti bilan) — test ko'chirtirardi. **Vazifa 2:** «Darrov qilinadi — ko'p so'raladi, demak birinchi» 8-ekran xulosasidagi «ko'proq odam so'ragani birinchi» bilan to'qnashardi — diqqatli bola aynan shuni tanlab jazolanardi. «bir haftaga» — eski darsda aytilmagan chegara. «Vaqt bo'lsa — uch hafta juda uzoq» — sabab katak ta'rifiga zid (kulgili-bo'sh, §110). Yangi test hali mashq qilinmagan 🗑 katakni so'raydi; har distraktor **bitta** savolga suyanadi (vaqt yoki odam) — «ikki savol» qoidasi ochiq rad etadi; «Darrov» distraktori lead bilan rad etiladi, 8-ekran xulosasiga tegmaydi. Uzunlik 1.45× → 1.17× |
| 11 | 10 sarlavha | «Dasturchi "Chaqirish tugmasi **tayyor, ishlaydi**" dedi. Tekshirib ko'ramizmi?» | «Dasturchi "Chaqirish tugmasi ishlaydi" dedi. Bu "tayyor" deganimi?» | dasturchi o'zi «tayyor» desa, blokning savoli («ishlaydi» ↔ «tayyor») sarlavhadayoq buziladi. Manba PmLesson9 s2 sarlavhasi bilan bir xil (tasdiqlangan ifoda) |
| 12 | 10 ekran-yozuv | «Bu — biz qurayotgan ilovaning tugmasi.» | «Bu — biz qurayotgan ilovaning "Mashina chaqirish" bo'lagi, Yandex Go emas.» | **vazifa 4:** xatolar Yandex Go'niki deb o'qilmasin — farq endi ochiq, inkor bilan; bo'lak nomi 5/8-ekran bilan ulandi |
| 13 | 10 shartlar | «Manzil kiritilsa, **tasdiq** chiqadi» · «…bitta **mashina keladi**» · «**Narx** bosishdan oldin ko'rinadi»; natija ✗ faqat ikkitasi | «Manzil yozib bosilsa, "Buyurtma yuborildi" yozuvi chiqadi» · «…bitta **buyurtma ketadi**» · «Ketgan buyurtmada yozilgan manzil ko'rinadi»; natija 1 ✓ · 2 ✗ · 3 ✗ · 4 ✓ | «tasdiq» — nima chiqadi, noaniq; **ETALON 42:** oynada mashina kelmaydi — ko'rinadigani ro'yxatdagi buyurtma. «Narx» — alohida bo'lak («Narxni oldindan ko'rish»); boshqa bo'lakning sharti bu bo'lakka qo'yilsa, dekompozitsiya o'zini buzadi (§156). **§105:** «qabul qilindi» emas, «yuborildi» — «qabul shartlari» bilan to'qnashmasin. Har shartning natijasi berildi — Quruvchi to'qimasin |
| 14 | 10 xulosa | «…Shu ro'yxat **qabul shartlari** (Acceptance Criteria) deyiladi **va ish boshlanishidan oldin yoziladi**.» | «"Tayyor" — odam adashadigan yo'llar ham tekshirilgan, kelishilgan hamma shart bajarilgan. Bunday shartlar ro'yxati **qabul shartlari** (Acceptance Criteria) deyiladi.» | **§106 / S28:** «oldin yoziladi» 12-ekranning savoli («ishdan oldinmi, keyinmi?») — ikki ekran oldin javobi berilib qo'yilardi. «Shu ro'yxat» — referent noaniq. «Odam adashadigan yo'llar ham tekshirilgan» — PmLesson9 s2 xulosasi |
| 15 | 11 TEST-4 | ✓ «Manzil bo'sh bo'lsa, «Chaqirish» tugmasi buyurtma yubormaydi» · uch distraktor «…bo'lishi kerak» | ✓ «Safar tugagach, 1 dan 5 gacha yulduzli baho oynasi chiqadi» · «Safar tugagach, baho qo'yish oynasi chiroyli ko'rinadi» · «Mashina chaqirilgach, kutish vaqti juda qisqa bo'ladi» · «Ilova ochilgach, hamma narsa qulay va tushunarli bo'ladi» | **§106:** eski ✓ — 10-ekrandagi 2-shartning so'zma-so'z nusxasi. **§147 3-vs-1:** uch distraktor «…bo'lishi kerak» qolipida, ✓ yolg'iz «…bo'lsa, …» — o'qimasdan topilardi. Endi to'rttasi «…gach, …» qolipida, ✓ va bitta distraktor bir xil boshlanadi. Yangi ✓ — boshqa bo'lak (baholash), son + harakat |
| 16 | 12 | «Dasturchiga beramiz» · xulosa «…yoziladi — keyin bahs bo'lmaydi.» | «Shartlarni dasturchiga beramiz» · «Shartlar ish boshlanishidan oldin yoziladi. Shunda dasturchi nimani qurishini oldindan biladi, "tayyor" deganda esa bahs chiqmaydi.» | manba PmLesson9 `QADAMLAR` bilan so'zma-so'z; nimani beramiz — to'ldiruvchi yo'q edi. «keyin bahs bo'lmaydi» — qachon, kim bilan? Sabab aniq |
| 17 | 13 | sarlavha «**G'oyangizga**…»; maydonlar «KIM (kartadan) · NIMA (yechimdan) · NATIJA (vazifadan)» + qolip «{KIM} sifatida, {NIMA} — {NATIJA} uchun.» | «Tanlagan g'oyangizga…»; maydonlar «Kim?» · «Nimani xohlaydi?» · «Nima uchun?»; karta javobi **namuna bo'lib** turadi, maydonga o'zi tushmaydi; qolip 3-ekran bilan bir xil + futbol namunasi; ko'plik-tekshiruvi | **§37 (to'rt olamda sinaldi):** B4 kartasi qatorlari uchinchi shaxs kesimida («…band qildiradi», «…kutmasdan o'ynaydi») va KIM ko'plikda («o'smirlar») — maydonga to'g'ridan-to'g'ri tushsa: «Men hovlida futbol o'ynaydigan o'smirlar sifatida, bo'sh vaqtni ko'rsatib, oldindan band qildiradini xohlayman — do'stlari bilan kutmasdan o'ynaydi uchun». Yangi shakl: futbol · o'yin («darajasi mos jamoadosh topish» — «o'yinni oxirigacha o'ynab yutish») · sinf («kim pul berganini belgilab borish» — «sovg'ani janjalsiz, vaqtida olish») · kiyim («mos o'lchamni oldindan ko'rish» — «birinchi urinishdayoq mos kiyim olish») — to'rttasi tugal. §40; §50 yorliq savol shaklida |
| 18 | 14 | sarlavha «G'oyangiz qaysi bo'lakdan boshlanadi?» (qoldi); ikki savol javob-variantlarisiz; sabab-tekshiruv matni yo'q; 🎯 bo'sh: «Hech bir bo'lak ham ko'p, ham tez emasmi?…» | javoblar «Ko'p odam · Kam odam» / «Bir haftagacha · Bir haftadan ko'p» (8-ekran chegarasi); mentor 1 gap; shart-yorliqlari ≤4 so'z; sabab-xabari; «🎯 katagi bo'sh qoldi. Eng ko'p so'raladigan bo'lakni ikkita kichikroq bo'lakka bo'lib ko'ring.» | Quruvchi to'qimasin; ETALON 25/32 (mentor ≤1 gap, shartlar chipda). «ham ko'p, ham tez emasmi?» — ikki inkorli savol, 13 yoshli ikki marta o'qiydi (§0-3) |
| 19 | 15 | qolip «nima qilinsa — ekranda nima bo'ladi»; «Boshqa holatni oling» | ikki maydon «Nima qilinsa?» · «Ekranda nima chiqadi?» + namuna; «Bu shart oldingisini takrorlayapti. Boshqa holatni oling.» | §50 slot o'rniga savol; ETALON 43 — ko'rsatma ekran elementiga bog'landi; takror-xabar sababni aytadi (§175 oilasi) |
| 20 | 16 | sarlavha «Shartlaringizni AI **buzib ko'ra oladimi**?» · so'rov «Siz sinovchi rolidasiz. … **Javob bering:** … **faqat savol bering**.» · qoida «AI … faqat **teshik** ko'rsatadi. Shartni siz yozasiz.» | «Shartlaringiz qaysi holatni o'tkazib yuborgan?» · «Siz ilovadagi xatolarni qidiradigan sinovchisiz. … Ikki savolga javob bering: … Yangi shart yozmang, faqat holatni ayting.» · «AI shart yozmaydi, faqat yetishmagan holatni ko'rsatadi. Shartni qo'shish yoki qo'shmaslikni siz hal qilasiz.» | **§173:** sarlavha AI imkoniyatini so'rardi — endi o'quvchining shartlarini; qaror aniq harakat bilan o'quvchida. So'rov o'ziga zid edi («javob bering» ↔ «faqat savol bering»). **§41 metafora-so'z testi:** «teshik» — bosh tushunchaga (odam adashadigan holat) yangi, gloss talab qiladigan obraz; 10-ekran so'zi («odam adashadigan yo'l/holat») qaytdi. Slot «[…]» → «{…}» (B3 lint `slot-ichki-atama` sabog'i) |
| 21 | 17 | sarlavha yo'q · «Sherigiga 30 soniyada: … → bir qator yozadi» | «Sherigingiz shartingizni tekshira oladimi?» · siz-forma yo'riq; sherikka vazifa («bosib tekshirsa bo'ladimi — ha yoki yo'q»); yozish-yo'rig'i | sarlavha = sinfga savol; siz-forma; B3 #22: sherikka rol berilmasa tekshiruv ishlamaydi |
| 22 | 19 flashcard | ot-birikma oldlar; bosh atamalar (foydalanuvchi hikoyasi, dekompozitsiya, qabul shartlari) yo'q; «Yaxshi bo'lak»; «Eng kam, lekin ishlaydigan» | savol-shakl oldlar; «Foydalanuvchi hikoyasi qaysi uch qismdan…» · «Dekompozitsiya nima?» (yaxshi bo'lak mezoni javobda) · «Qabul shartlarida qanday shart bo'ladi?» · «Ochilish kuni foyda beradigan eng kam bo'laklar» | darsning to'rt atamasidan uchtasi takrorlanmasdi (B3 #23 sinfi); #1 va #7 kaskadi. Sanoq 8 ta saqlandi |
| 23 | 20 | yakun «Hikoya: kim, nima, natija.» · «Birinchi — ko'p so'raladigan…» · «Tayyor — hamma shart bajarilgan, shart tekshiriladigan.» · mentor «Backend'da…» · arena yo'nalishsiz | to'rttasi tugal gap (fayl §3/20) · «Backend modulida…» · arena: boshqa vaziyat (ovqat yetkazish, maktab kutubxonasi sayti, o'yin ilovasi) + flashcardni ham takrorlamasin | §52 tugal gap; **§144 va uning davomi (flashcard)** |
| 24 | 4/7/9/11 | reveal va xato-izohlar yo'q | har testga reveal + har distraktorga bir gap | Quruvchi to'qimasin; xato-izoh mezonni eslatadi, javobni aytmaydi (§175) |
| 25 | 4-bo'lim | nishonlar o'zbekcha tasvir («Hikoya yig'ildi» …) | **Story Built! · Grid Master! · First Pick! · Done Means Done!** + siz-forma `desc` | nishon `name` faqat inglizcha (2026-07-16) |
| 26 | 2 | «…bitta hikoya yozasiz, **uni** bo'laklarga bo'lasiz…» | «…bitta hikoya yozasiz. Keyin g'oyani bo'laklarga bo'lib, qaysi biridan boshlashni tanlaysiz. Oxirida shu bo'lak qachon tayyor bo'lishini uchta shart bilan yozasiz.» | «uni» — hikoyani bo'lamizmi? Bo'linadigani g'oya (§0-3 bir gap — bir fikr; §162 reja ekrani nima qila olishni aytadi) |

Ichki joylar kaskad bilan tekislandi: pasport «Maqsad» (g'oya bo'linadi), «Misol-ip», «Keys» (bank); 2-bo'lim to'rt fikri (#1, #7, #9); Yandex Go halollik qaydnomasi (ekrandagi uch farq-yozuvi sanab qo'yildi).

### B. Test-halollik o'lchovi (Intl.Segmenter, grapheme; ✓ birinchi)

| Ekran | Uzunliklar | max/min | ✓ / eng uzun distraktor | Oldin max/min |
|---|---|---|---|---|
| 1 hook (ballsiz) | 28 / 140 | 5.00× | — | 5.00× — ataylab: farqning o'zi (so'rov ↔ hikoya) uzunlikda; tanlov bashorat, ball yo'q |
| 6 bashorat (ballsiz; ✓ = Foto) | 13 / 11 / 12 | 1.18× | 1.08 | o'zgarmadi |
| 4 TEST-1 | 110 / 104 / 85 / 81 | 1.36× | 1.06 | **1.70×** (✓ 1.40) |
| 7 TEST-2 | 44 / 48 / 39 / 38 | 1.26× | 0.92 | 1.17× |
| 9 TEST-3 | 47 / 54 / 55 / 50 | 1.17× | 0.85 | **1.45×** |
| 11 TEST-4 | 58 / 54 / 53 / 56 | 1.09× | 1.04 | 1.18× |

- **3-vs-1 shakl (§147):** T1 — «Men …» ×2 (✓ bilan), «Narx», «Xaritani». T2 — to'rt xil boshlanish, guruh yo'q. T3 — to'rttasi «{katak} — {sabab}» qolipida. T4 — «Safar tugagach» ×2 (✓ bilan), «Mashina chaqirilgach», «Ilova ochilgach»; to'rttasi «…gach, …». Yolg'iz qolgan to'g'ri javob yo'q.
- **Mutlaq so'z (§110):** T1 — yo'q · T2 — «hammasi, birortasi» faqat 2-variantda · T3 — yo'q · T4 — «hamma narsa» faqat 4-variantda. ✓ larda yo'q.
- **§102 (distraktor darsda rost emasmi):** T1 — har biri hikoyaning bitta qismini yo'qotadi, 3-ekran xulosasi rad etadi. T2 — «hammasi» 5-ekran («birdaniga qurib bo'lmaydi»), qolgan ikkitasi 6-ekran ko'prigi («foyda beradigan») rad etadi. T3 — «Rejaga» va «Vaqt bo'lsa» bittadan savolga suyanadi, 8-ekrandagi ikki savol rad etadi; «Darrov» — lead (uch hafta) rad etadi, 8-ekran xulosasiga (vaqt teng bo'lsa — ko'proq odam) tegmaydi. T4 — baho-so'zlar 11-ekran mezoni va 15-ekran tekshiruvi bilan rad etiladi.
- **§106 (slayddan ko'chirish):** T1 ✓ — yangi hikoya (narx), 3-ekran hikoyasi (xarita) emas. T2 ✓ — ta'rifni ipdagi ilovaga qo'llash; «Mashina chaqirish» 8-ekrandan oldin keladi. T3 — 8-ekranda mashq qilinmagan katak, yangi bo'lak. T4 ✓ — 10-ekran shartlarida yo'q, boshqa bo'lak.
- **Bitta himoyalanadigan to'g'ri:** T2 da «faqat mashina chaqirish» varianti ataylab qo'yilmadi — u ham himoyalanardi. T3 da ✓ dan boshqa katak ikki savolning ikkalasiga mos emas.
- **§119 (hook):** bashorat, javob ochiladi — qoldi. Payoff 1-kartaning yutug'ini tan oladi (#3).

### C. Mexanik tekshiruvlar

- Kirill `grep -cP '[\x{0400}-\x{04FF}]'` → **0**.
- Qiyshiq apostrof (U+2018 · U+2019 · U+02BB) → **0**.
- Sen-forma grep → 1 topilma: 16-qator «koding» (pasport «Format») — soxta.
- Ichki jargon `yadro|artefakt|recap` → **0**; «Hook» — faqat ekran-yorlig'i.
- Residue: «uch bo'lak» (hikoya ma'nosida) → 0 · «ishlaydigan» → 0 · «Manzil kiritish» (bo'lak nomi) → 0 (halollik ro'yxatida Yandex Go'da ko'rinadigan narsa sifatida qoldi).
- **§105 «tayyor»:** faqat dars ma'nosida (2, 10, 12, 15, 17, 19, 20-ekran); distraktordagi kundalik «tayyor» olindi (#8).
- **Keys K3:** har gap bank bilan yonma-yon — Burbn · chekin (joy belgilash) · rejalar (reja tuzish) · foto · ko'p funksiya («yana boshqalar») · hech kim ishlatmadi («deyarli» — B3 D-2 bilan bir qaror) · yoqqanidan boshqasini olib tashladi · foto + filtr + izoh · Instagram · 2010-yil oktabr · birinchi kun · 25 000 ro'yxatdan o'tish. Ko'prikdagi «birinchi kuni uchta narsa bilan chiqdi» — slayd 2+3 ning xulosasi, yangi fakt emas. Qo'shimcha fakt yo'q; matn B3 bilan so'zma-so'z bir xil (ko'prik #7 dan tashqari).
- **Yandex Go:** nom faqat 5-ekranda (sarlavha + ekran-yozuv) va 10-ekrandagi inkor-yozuvda («…Yandex Go emas»). 5-ekranda faqat uchta ko'rinadigan narsa aytiladi; 8-ekran sonlari va 10-ekran xatolari ochiq «bizniki».
- **Sanoq-mosligi:** 3 qism (3, 13, 19, 20) · 6 bo'lak (5, 7, 8 — bir xil nomlar; 8-ekranda oltitasiga son) · 4 katak (8, 9, 19) · 4 shart (10 — 2 ✓, 2 ✗) · 5 qadam (12, PmLesson9 bilan so'zma-so'z) · 3 shart (2-vizual, 15, 16 so'rov, 4-bo'lim nishoni) · 4 bo'lak (2-vizual, 14) · 8 flashcard.
- **Ekran-hajmi (≤400, ko'rinadigan proza; kartalar/variantlar/so'rov material sanalmaydi):** 1 ≈386 (kartalar bilan) · 2 ≈220 · 3 ≈217 · 5 ≈380 (edi ≈475) · 6 ≈349 (slaydlar navbat bilan) · 8 ≈305 · 10 ≈370 · 12 ≈182 · 16 ≈155 + so'rov ≈298 (D-5) · 17 ≈260.
- `npm run lint:til pm-senariylar/BRIDGE-B5-NimaQuramiz.md` → **0 error** (v1 da ham 0; jurnal yozilgach bitta soxta error chiqdi — `ekran-nomi-tarjimasi`, #23 qatoridagi korpus-bo'lim nomi; «§144 va uning davomi» deb qayta yozildi). Warn 5 ta, hammasi soxta (bittasini shu qatorning o'zi qo'shadi): «Ip-zanjir» (25-qator), «Zanjir chapdan o'ngga» (43), «Zanjir tabiiy» (6-bo'lim) — ichki so'z, streak emas · siz-forma qoidasi 1 marta — mexanik tekshiruv qatori o'zi «koding» so'zini iqtibos qiladi. O'quvchi ko'radigan matnda warn yo'q.

### D. Tuzilmaviy e'tirozlar (tuzatilmadi — foydalanuvchi/Quruvchiga)

1. **Yandex Go hozirgi ko'rinishi.** Qurishdan oldin tekshirilsin: 5-ekran aytgan uch narsa (manzil · narx oldindan · mashina xaritada) va bo'laklar ro'yxatidagi «Karta bilan to'lash», «Safarlar tarixi» ilovada bormi. Ro'yxat «biz tuzdik» deb yozilgani uchun ular yo'q bo'lsa ham dars yolg'on gapirmaydi, lekin o'smir «Yandex'da bu yo'q-ku» deb qolmasin.
2. **🗑 Kerak emas katagi 8-ekranda bo'sh qoladi** — oltita bo'lakning hammasi real ilovada bor narsa, ulardan birini «kerak emas» deyish yolg'on bo'lardi. TEST-3 shu katakni yangi bo'lak bilan so'raydi (#10). Muqobil: 8-ekranga yettinchi, ataylab ortiqcha bo'lak qo'shish (mexanika o'zgaradi — «olti bo'lak» sanog'i 5, 7, 8, nishon bilan birga ko'chadi). Tavsiya — shu holicha.
3. **Karta yo'q o'quvchi (13–14).** B4 kartasi bo'lmasa, 13-ekrandagi namuna-qatorlar va 14-ekrandagi g'oya qayerdan olinadi? Taklif: B4 ning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim) shu yerda ham tanlov bo'lib chiqsin (B3 D-3 bilan bir sinf).
4. **13-ekran qolipidagi «{NIMA}ni».** O'quvchi maydonga o'zi «…ni» bilan yozsa («band qilishni»), qolip «…nini» beradi. Quruvchiga: oxiridagi «ni» ni avtomatik olib tashlash yoki maydon ostida «masalan: band qilish» namunasini qat'iy ko'rsatish.
5. **16-ekran ≈155 + so'rov ≈298 + o'quvchining shartlari (~150)** — 400 dan oshadi. B1/B2/B3 bilan bir sinf. Taklif: so'rov default-yopiq «So'rovni ko'rish» yig'masida.
6. **«Prioritet» atamasi darsda nomlanmaydi.** Pasportda mavzu sifatida bor, ekranda esa faqat «qaysi biri birinchi» va to'rt katak nomlari. Manba PmLesson8 flashcardda «Foyda va vaqt kataklari (Impact/Effort)» deb nomlaydi. Node-bridge o'quvchisi uchun nom kerak bo'lsa — 8-ekran xulosasiga bir gap («Qaysi ish birinchi ekanini shunday tanlash **navbat belgilash** (prioritet) deyiladi», korpus §1) + flashcard (sanoq 8 → 9 yoki bitta karta almashadi). Qaror kerak.
7. **Hook uzunlik-farqi 5×** — ataylab (so'rov ↔ hikoya), ball yo'q. Uzun karta ko'zga «yaxshisi» bo'lib ko'rinishi mumkin; bu hookning maqsadiga zid emas, chunki payoff har ikki tanlovni hurmat qiladi (#3).
8. **«Mashina chaqirish» bo'lagi 7-ekranda (TEST-2 ✓) va 8-ekranda (xulosa) birinchi bo'lib chiqadi** — 10-ekranda aynan shu bo'lak tekshiriladi. Bu ip uchun yaxshi, lekin TEST-2 8-ekran xulosasini oldindan bildirib qo'yadimi — mentor sinovida ko'rish kerak (xavf past: TEST-2 «foyda» mezonini, 8-ekran «odam · vaqt» mezonini so'raydi).
