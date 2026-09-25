# Bridge · «Ma'lumot, ishonch va "Qanday ishlaydi?"» — dars rejasi

> Holat: QORALAMA v1 (2026-09-23 21:00) → metodist korrekturasi ✅ (2026-09-23, jurnal fayl oxirida) → kelishildi (21:29) → **tashqi fidbek halol saralab kiritildi ✅ (2026-09-23 23:41) — GATE S** → qurish (1-dars pilotdan keyin).
> Namuna: `BRIDGE-B5-NimaQuramiz.md` · Manba darslar: `4-Modull/PmLesson11` (Ma'lumot ham mahsulot qarori — K6 Netflix, xotira tugmalari, maydon → bo'lim), `4-Modull/PmLesson12` (Ochiq va yopiq ma'lumot — «ma'lumotni zarar yopadi»), `4-Modull/PmLesson13` (Sxema — ilova faqat yozilganini biladi), `4-Modull/PmLesson14` (Uch qavat, texnik so'zsiz).
> Suhbatda: **4-o'tish (NestJS) · 3-dars**. Bu dars faqat Nest yo'lida; o'quvchi oldin 3/4-o'tish 1- va 2-darsini ko'rgan (karta, hikoya, birinchi bo'lak, 3 shart).

## 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | NestJS darslariga o'tadigan o'quvchi (3 darsning 3-si, oxirgisi; «Kim uchun, qanday muammo» va «Nima quramiz» dan keyin) |
| Mavzular (4) | Ma'lumot (maydon → bo'lim) · Ochiq va yopiq ma'lumot (zarar mezoni) · Sxema (ilova faqat yozilganini biladi) · Uch qavat, texnik so'zsiz |
| Maqsad | O'quvchi o'z g'oyasi uchun **3 maydon** tanlaydi (har biriga bo'lim), har maydonni **ochiq yoki yopiq** deb belgilaydi (sababi bilan) va birinchi bo'lagida tugma bosilganda ilova ichida nima bo'lishini **uch qavat gapida**, kasbiy so'zsiz aytadi |
| Misol-ip | **YouTube kabi ilovani biz qursak** (ochiq faraz). YouTube bir marta (3-ekran) real namuna sifatida nomlanadi — faqat ko'rinadigan narsalari: video nomi · kanal · ko'rishlar soni · yuklangan sana · «Tarix» bo'limi · layk · izoh. Qolgan hamma qaror (maydonlar, bo'limlar, ochiq/yopiq, e'lon gaplari, layk yo'li) — **bizning ilovamizda** |
| Keys | K6 Netflix — faqat bank-faktlari: har kimning bosh sahifasi o'ziniki — tavsiyalar ko'rish tarixidan yig'iladi · ko'rishlarning taxminan 80 foizi tavsiyadan keladi, qidiruvdan emas (Netflix ochiq bayonoti, 2016) |
| O'z ishi | Oldingi darslardagi karta va birinchi bo'lak + 3 shart ochiladi → 3 maydon + bo'lim → ochiq/yopiq + sabab → uch qavat gapi. Kartasiz o'quvchiga 1-darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi (jurnal D-5) |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

## 2. Darsning to'rt asosiy fikri

1. **Ilova har safar yozib qo'yadigan bitta narsa — maydon.** Bu darsda maydonni u ochadigan bo'limga qarab tanlaymiz: bo'lim topilmasa, hozircha yozib qo'ymaymiz. Ertangi ekran bugun yozilgan ma'lumotdan foydalanib tuziladi.
2. **Ma'lumotni zarar yopadi, turi emas.** Begona ko'rsa egasiga zarar yetadigan maydon yopiladi. Qaysi ma'lumot ochiq qolishini ham tanlaymiz — ochiq qolish ham qaror.
3. **Ilova odamga ko'rsatadigan ma'lumot qayerdadir yozilgan bo'lishi kerak.** Bizning ilovamizda u sxemadagi maydonda turadi: e'londa aytilgan har ma'lumot ortida kerakli maydon bor; hech qaysi gapga kerak bo'lmagan maydon sxemaga kirmaydi.
4. **Ilova uch qavat:** sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi. Layk kabi yozib qo'yiladigan bosish uchalasidan o'tadi. Kod bilmaydigan odamga qavatning nomi emas, ishi tanish so'z bilan aytiladi.

Ip-zanjir: **nimani yozib qo'yamiz → kimga ko'rsatamiz → gap ortida maydon → bosish uch qavatdan o'tadi → o'z g'oyamizga xuddi shunday.**

> **YouTube halolligi:** ilova bir marta (3-ekran) real namuna sifatida nomlanadi — unda **ko'rinib turgan** narsalar: video nomi · kanal nomi · ko'rishlar soni · yuklangan sana · ko'rilgan videolar «Tarix» bo'limida · layk · izohlar (qurishda ilovaning hozirgi ko'rinishi bilan tekshiriladi). Qolgan hamma narsa — «biz qurayotgan ilova» haqida: 3-ekrandagi maydonlar va ularning bo'limlari («Kecha ko'rganlaringiz», «Davom ettiring», Wi-Fi va kontaktlardan bo'lim chiqmasligi), 6-ekrandagi profil maydonlari va ularning ochiq/yopiqligi, 8-ekrandagi e'lon gaplari va maydonlar ro'yxati, 10-ekrandagi layk yo'li — **bizning ilovamizda**, YouTube'da emas. Ekranda shu farq ochiq yoziladi: 3-ekranda «Ilovamiz nimani yozib qo'yishini esa biz hal qilamiz», 6-ekranda «bizning ilovamizdagi sahifangiz», 8-ekranda «ilovamizning e'loni». YouTube'ning tarixi, raqamlari, ichki qarorlari aytilmaydi.

---

## 3. Ekranlar

### KIRISH

**1 · Hook** — fikr-so'rovi, ovoz berish (ikkala javob to'g'ri)
- Sarlavha: «Kechqurun video ko'rdingiz. Ertalab ilova buni eslasinmi?»
- Variantlar: «Ha — qayerda to'xtaganimni ko'rsatsin» · «Yo'q — men haqimda hech narsa saqlamasin»
- Javob (ovozdan keyin, ikkalasiga bir xil): «Ikkala javob ham bo'lishi mumkin — ikkalasi ham qaror. Ilova eslashi uchun nimanidir yozib qo'yishi kerak. Yozmasa, ertalab u hech narsani bilmaydi. Nimani yozib qo'yishni ilovani quradigan odam hal qiladi — bugun shu odam sizsiz.» (§119: «yozmasa, bilmaydi» — «Yo'q» tanlovining o'zi; hech bir tanlov rad etilmaydi)

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Tanlagan g'oyangiz uchun ilova nimani yozib qo'yishini tanlaysiz. Qaysi ma'lumot hammaga ochiq, qaysi biri yopiq bo'lishini hal qilasiz. Oxirida tugma bosilganda ilova ichida nima bo'lishini kod bilmaydigan odamga uch gapda aytasiz.»
- Vizual: uchta karta → har birida 🔓/🔒 belgisi → bitta bosish uch bosqichdan strelka bilan o'tadi. Zanjir chapdan o'ngga. Vizualda «maydon», «sxema», «qavat» so'zlari yozilmaydi — ular keyingi ekranlarda tug'iladi (§126).

### 1-BLOK · NIMANI YOZIB QO'YAMIZ

**3 · Xotira tugmalari** — bosib ochish
- Sarlavha: «YouTube kabi ilova qursak, video ko'rilganda nimani yozib qo'yamiz?»
- Ekranda ochiq: «YouTube'da video nomi, kanal, ko'rishlar soni va sana ko'rinadi. Ko'rganlaringiz "Tarix"da turadi. Ilovamiz nimani yozib qo'yishini esa biz hal qilamiz.»
- 5 tugma, har biri bosilganda «ertangi ekran»da qaysi bo'lim ochilishi ko'rinadi: «Qaysi video ko'rildi» → «Tarix» bo'limi · «Qachon ko'rildi» → «Kecha ko'rganlaringiz» bo'limi · «Qaysi daqiqada to'xtatildi» → «Davom ettiring» bo'limi · «Qaysi Wi-Fi orqali ko'rildi» → «Bizning ilovamizda bundan bo'lim ochilmaydi» · «Telefondagi kontaktlar» → «Bizning ilovamizda kontaktlardan foydalanadigan bo'lim yo'q».
- Xulosa: «Ilova har safar video ko'rganingizda yozib qo'yadigan bitta narsa **maydon** deyiladi. Bu darsda maydonni u ochadigan bo'limga qarab tanlaymiz: bo'lim topilmasa, uni hozircha yozib qo'ymaymiz.»

**4 · Keys: Netflix** — bashorat + 3 slayd (bank-faktlari)
- Sarlavha: «Netflix bosh sahifasi nimadan yig'iladi?»
- Bashorat: «Netflix'da odamlar film va seriallarni ikki yo'l bilan topadi: qidiruvdan yoki tavsiyadan. Ko'rishlarning qanchasi tavsiyadan keladi?» 20 % · 50 % · 80 %
- Slaydlar:
  1. «Netflix'da har kimning bosh sahifasi o'ziniki. Undagi tavsiyalar odamning ko'rish tarixidan yig'iladi.»
  2. «Netflix 2016-yilda ochiq aytgan: ko'rishlarning taxminan 80 foizi tavsiyadan keladi, qidiruvdan emas.»
  3. «Ya'ni har beshta ko'rishdan taxminan to'rttasi qidiruvdan emas, tavsiyadan keladi.»
- Ko'prik: «Ilova nimani yozib qo'ysa, ertangi bosh sahifani tuzishda shu ma'lumotdan foydalanadi. Shuning uchun nimani yozib qo'yish — ilovani quradigan jamoaning muhim qarori.»

**5 · TEST-1** (ball)
- Lead: «Jamoa ilovamizga to'rtta yangi maydon taklif qildi.» Cue: «Bizning ilovamizda qaysi birini yozib qo'yishga arziydi?»
- ✓ Qaysi videoga layk bosildi · Qaysi telefon modelidan kirildi · Batareyada necha foiz qolgan edi · Telefonda bo'sh joy qancha edi
- Reveal: «To'g'ri — bu maydondan "Yoqtirganlaringiz" bo'limi ochiladi.» · Xato-izohlar: (2) «Bizning ilovamizda telefon modelidan ochiladigan bo'lim yo'q. Bo'lim topilmasa — hozircha yozib qo'ymaymiz.» · (3) «Batareya foizidan bizning ilovamizda qaysi bo'lim ochiladi? Bo'lim topilmasa — hozircha yozib qo'ymaymiz.» · (4) «Telefondagi bo'sh joydan bizning ilovamizda qaysi bo'lim ochiladi? Bo'lim topilmasa — hozircha yozib qo'ymaymiz.»

### 2-BLOK · KIMGA KO'RINADI

**6 · Sahifangizni kim ko'radi** — joylashtirish
- Sarlavha: «Bizning ilovamizdagi sahifangizni begona odam ochsa, qaysi maydonlarni ko'rishi mumkin?»
- Yo'riq: «Bu darsda ikki holat bilan ishlaymiz. Har maydonni ikki tomondan biriga qo'ying.» Tomonlar: **Hammaga ochiq** · **Faqat egasiga**. Sahifadagi 6 maydon: Kanal nomi · Kanalga joylagan videolaringiz · Qaysi videolarga layk bosgansiz · Qaysi videolarni ko'rgansiz · Telefon raqamingiz · Parolingiz.
- Tekshiruv (har maydon qo'yilganda o'z fakti chiqadi — xulosani o'quvchi o'zi chiqaradi, §175): Kanal nomi → ochiq («Kanalingizni odamlar topishi kerak.») · Kanalga joylagan videolaringiz → ochiq («Bu videolarni odamlar ko'rishi uchun kanalingizga joylagansiz.») · Qaysi videolarni ko'rgansiz → yopiq («Begona siz nimalarni ko'rganingizni bilib oladi.») · Telefon raqamingiz → yopiq («Raqamingizni bilgan begona sizga qo'ng'iroq qilib, bezovta qila oladi.») · Parolingiz → yopiq («Parolni bilgan begona sahifangizga kirib oladi.») · Qaysi videolarga layk bosgansiz → ikkala tomon ham qabul: «Bu maydon ikkala tomonda ham bo'lishi mumkin — ochiq qolish ham qaror, uni egasi beradi.»
- Xulosa: «Kanal nomi ham, parol ham — oddiy yozuv. Kanal nomi odamlar sizni topishi uchun ochiq, parol esa sahifangizni himoya qilgani uchun yopiq. Demak, yozuvning turiga emas, begona ko'rsa nima bo'lishiga qaraymiz: ma'lumotni zarar yopadi. Bizning kanal ilovamizda hamma maydon yopilsa, odamlar kanalingizni topolmaydi — ochiq qolish ham qaror.»

**7 · TEST-2** (ball)
- Lead: «Ilovamizga yangi maydon qo'shildi: "Oxirgi marta qachon kirgan".» Cue: «Bu maydonni yopish yoki ochiq qoldirishda nimaga qaraymiz?»
- ✓ Begona ko'rsa, egasiga zarar yetadimi · Ilova buni har kuni yangilab turadimi · Bunga boshqa odamlar ko'p qiziqadimi · Unda so'z bormi yoki faqat raqam turadimi
- Reveal: «To'g'ri — mezon bitta: begona buni ko'rsa, egasiga zarar yetadimi. Yetsa — maydon yopiladi, yetmasa — ochiq qolishi mumkin.» · Xato-izohlar: (2) «Qanchalik tez-tez yangilanishi hech narsani hal qilmaydi. Begona buni ko'rsa, nima bo'ladi?» · (3) «Qiziqish kam yoki ko'pligi mezon emas. Begona buni ko'rsa, kimga zarar yetadi?» · (4) «Yozuvning turi hech narsani hal qilmaydi. Begona buni ko'rsa, egasiga nima bo'ladi?»

### 3-BLOK · GAP ORTIDA MAYDON

**8 · Ilova faqat yozilganini biladi** — konstruktor
- Sarlavha: «E'londagi har va'dani ilova qayerdan biladi?»
- Ekranda: «Bu — ilovamizning e'loni: odamga nima ko'rinishini aytadigan besh gap. Har gapni maydon bilan bog'lang.» O'ngda ilova yozib qo'yadigan maydonlar ro'yxati: Video nomi · Kanal · Ko'rishlar soni.
- Bog'lash: «Video nomini ko'rasiz» → Video nomi ✓ · «Kim yuklaganini ko'rasiz» → Kanal ✓ · «Nechta odam ko'rganini ko'rasiz» → Ko'rishlar soni ✓ · «Video qachon yuklanganini ko'rasiz» → mos maydon yo'q. Shu gap bosilsa: «Bizning ilovamizda sana hech qayerda yozilmagan — ilova uni ko'rsata olmaydi, gap yolg'on chiqadi.» → «Maydon qo'shish» → ro'yxatda «Yuklangan sana» paydo bo'ladi, gap ✓ ga o'tadi. Gap noto'g'ri maydonga ulansa: «Bu maydonda boshqa narsa yozilgan. Sana qaysi maydonda turibdi?»
- Beshinchi gap: «Ilova juda tez ishlaydi» → hech qaysi maydonga ulanmaydi: «"Juda tez" — hozircha umumiy baho: unda nima o'lchanishi aytilmagan. Bu gap odamga hech qanday ma'lumot ko'rsatmaydi, shuning uchun unga maydon tanlamaymiz.»
- Xulosa: «Ilova odamga ko'rsatadigan ma'lumot qayerdadir yozilgan bo'lishi kerak. Bizning ilovamizda e'londagi har ma'lumot ortida kerakli maydon turadi. Ilovaning hamma maydonlari ro'yxati **sxema** deyiladi. Sxema qisqa qoladi: kontaktlar kabi hech qaysi gapga kerak bo'lmagan maydon unga kirmaydi.»

**9 · TEST-3** (ball)
- Lead: «Jamoa ilovamiz e'loniga yangi gap qo'shdi: "Video qaysi tilda ekanini ko'rasiz".» Cue: «Endi sxemaga nima bo'ladi?»
- ✓ Sxemaga yangi "Til" maydoni qo'shiladi · Sxemaga "Yaxshi video" maydoni qo'shiladi · "Ko'rishlar soni" o'rniga "Til" yoziladi · Hech narsa — e'londagi gapning o'zi yetadi
- Reveal: «To'g'ri — bizning sxemamizda til yozilgan maydon yo'q. Ilova tilni ko'rsatishi uchun yangi maydon kerak.» · Xato-izohlar: (2) «"Yaxshi" — baho so'zi, ma'lumot emas. Yangi gap odamga nimani ko'rsatadi?» · (3) «"Ko'rishlar soni" o'chsa, "Nechta odam ko'rganini ko'rasiz" gapi yolg'on chiqadi.» · (4) «Gap — odamga va'da. Ilova tilni qayerdan oladi?»

### 4-BLOK · QANDAY ISHLAYDI

**10 · Uch qavat** — bosib ochish, layk yo'li
- Sarlavha: «Layk bosdingiz. Ilovaning ichida nima bo'ldi?»
- Ekranda ilovamizning video sahifasi. O'quvchi 👍 bosadi → yo'l uch qadamda ochiladi: ① **Sahifa** — ko'rsatadi (👍 belgisi yonadi) → ② **Server** — tekshiradi (kim bosdi va u shu videoga oldin layk bosmaganmi) → ③ **Baza** — eslab qoladi (ertaga ham turadi). Keyin «Telefonni o'chirish» tugmasi → ilova qayta ochilganda layk joyida: «Layk joyida — baza uni eslab qoldi, ilova shu ma'lumotdan foydalanib uni yana ko'rsatdi.»
- Xulosa: «Siz ko'rgan uch qadam — ilovaning uch qismi. Ularni **qavat** deymiz, binodagi kabi: har qavatning bitta ishi bor. Sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi. Layk kabi yozib qo'yiladigan bosish uchalasidan o'tadi.»

**11 · TEST-4** (ball)
- Lead: «Akkauntingizga kirmasdan layk bosdingiz. Ekranda "Avval kiring" yozuvi chiqdi.» Cue: «Siz kirmaganingizni qaysi qavat aniqladi?»
- ✓ Server — u kim bosganini tekshirdi · Sahifa — u tugmani qulflab qo'ydi · Baza — u laykni o'chirib tashladi · Telefon — u layk bosishni to'xtatdi
- Reveal: «To'g'ri — kim bosganini va bunga ruxsat bormi, server tekshiradi. Sahifa esa uning javobini ko'rsatdi.» · Xato-izohlar: (2) «Sahifa tugmani qulflamadi — siz uni bosdingiz. Bosishdan keyin kim tekshiradi?» · (3) «Baza laykni o'chirmadi — u hali hech narsa yozib qo'ymagan edi. Kim bosishi mumkinligini qaysi qavat tekshiradi?» · (4) «Telefon — qurilma, ilovaning qavati emas. Uch qavatdan qaysi biri tekshiradi?»

**12 · Kasbiy so'zsiz** — so'z almashtirish (ballsiz)
- Sarlavha: «Kod bilmaydigan odamga layk haqida gapiryapsiz. Qaysi so'zda u sizni tushunmay qoladi?»
- Gap so'zma-so'z chiqadi: «Layk bazaga yoziladi, API orqali sahifaga qaytadi.» Chiziq (yorlig'i: «U qanchalik tushunyapti») tanish so'zda ko'tariladi, «bazaga» va «API» da tushadi. Mentor: «Chiziq tushgan so'zlarni bosing.» Bosilgan so'z o'rniga tanish so'z chiqadi: «bazaga yoziladi» → «ilova eslab qoladi» · «API orqali sahifaga qaytadi» → «sahifa uni ilovadan so'rab, qayta ko'rsatadi». Yangi gap: «Layk bosilganda ilova uni eslab qoladi, sahifa esa uni so'rab, qayta ko'rsatadi.»
- Xulosa: «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tashlamaysiz, tanish so'z bilan almashtirasiz. Kod bilmaydigan odamga qavatning nomini emas, ishini ayting: eslab qoladi, tekshiradi, ko'rsatadi.»

### O'Z G'OYANGIZ

**13 · Uch maydon** — ustaxona
- Sarlavha: «Tanlagan g'oyangizda ilova nimani yozib qo'yadi?»
- Oldingi darslardagi kartangiz va birinchi bo'lagingiz yonda ochiq turadi. **Karta bo'lmasa** (boshqa kompyuter): 1-darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim, 5 qatorli jadval) tanlov bo'lib chiqadi; tanlangan g'oyaning birinchi bo'lagi va bitta sharti jadvalning qo'shimcha ikki ustunidan tushadi (1-dars senariysi 14-ekran ostida; D-5 qarori) — 15-ekran ularni ishlatadi.
- Uch karta, har birida ikki savol: «Ilova nimani yozib qo'yadi?» · «Bundan qaysi bo'lim ochiladi?» Shart-yorliqlari: «3 maydon» · «Har biriga bo'lim».
- Namuna (futbol, birinchi bo'lak «bo'sh vaqtni band qilish»): «Qaysi kun va soat band qilindi» → «Bugungi jadval» · «Kim band qildi» → «Band qilganlarim» · «Kim o'ynashga yozildi» → «Bugun kim o'ynaydi».
- Tekshiruv: bo'lim bo'sh → «Bo'lim topilmasa — bu maydonni hozircha yozib qo'ymaymiz. Boshqa maydon oling yoki bo'limni yozing.»; baho so'zi («yaxshi», «tez», «qulay») → «Bu baho so'zi, ma'lumot emas. Ilova nimani yozib qo'yadi?»

**14 · Ochiq yoki yopiq** — ustaxona
- Sarlavha: «Uch maydoningizdan qaysi biri begonaga ko'rinmasin?»
- Har maydon yonida almashtirgich: **Hammaga ochiq** · **Faqat egasiga** (bu darsdagi ikki holat). Tanlovdan keyin bitta savol chiqadi — javobni o'quvchi o'zi yozadi: yopiq tanlansa «Begona ko'rsa, egasiga qanday zarar yetishi mumkin?» · ochiq tanlansa «Bu ma'lumotni boshqalarga ko'rsatish nega kerak?»
- Hammasi yopilsa: «Hamma maydon yopiq. Ilovangizda boshqalar hech narsani ko'rmasligi kerakmi? Ochiq qolish ham qaror.»
- Namuna: «Kim band qildi» → ochiq (do'stlar kim o'ynashini ko'rsin) yoki yopiq — «Bu maydon ikkala tomonda ham bo'lishi mumkin. Qarorni siz berasiz, sababini yozing.»
- Saqlanadi: «✓ Sxema tayyor: 3 maydon, har biri ochiq yoki yopiq».

**15 · Uch qavat gapi** — ustaxona
- Sarlavha: «Birinchi bo'lagingizda tugma bosilsa, ilova ichida nima bo'ladi?»
- Oldingi darsdagi birinchi shartingiz («Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?») yonda turadi; kartasiz o'quvchida — 13-ekranda tanlangan tayyor g'oyaning bo'lagi va sharti (qo'shimcha jadval). Uch yozuv joyi, yorliqlar savol shaklida: «Ko'rsatadigan qavat: odam ekranda nimani ko'radi?» · «Tekshiradigan qavat: ilova nimani tekshiradi?» · «Eslab qoladigan qavat: ilova nimani eslab qoladi?» — har biriga bitta gap.
- Namuna (futbol): «Bo'sh vaqt bosilganda katak yashil bo'lib, "Band qilindi" yozuvi chiqadi» · «Shu vaqtni boshqa birov oldin band qilmaganini tekshiradi» · «Kim, qaysi kun va soatda band qilganini eslab qoladi — ertaga ham turadi».
- Jonli tekshiruv: kasbiy so'z (baza · API · server · JSON · fetch · kod) yozilsa qizil chiziq va «Bu kasbiy so'z. Qavatning ishini tanish so'z bilan ayting.»; ikki gap bir xil ishni aytsa → «Bu ikki gap bitta ishni aytyapti. Har qavatning o'z ishi bor.»
- Saqlanadi: «✓ Uch qavat gapi tayyor».

### AI BILAN

**16 · AI — maxfiylik savollarini beruvchi**
- Sarlavha: «Ochiq maydonlaringizni begona ko'rsa, nima bo'lishi mumkin?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI ochiq maydonlaringiz haqida savol beradi. Ilovani to'liq tekshirmaydi — qarorni siz qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
  > «Ilovam: {g'oya bir gapda}. Maydonlari: 1) {maydon} — {ochiq/yopiq} 2) {maydon} — {ochiq/yopiq} 3) {maydon} — {ochiq/yopiq}. Har ochiq maydon uchun menga bitta savol bering: begona bu ma'lumotni bilsa, undan qanday foydalanishi mumkin? Yoki uni ochiq qoldirish nima uchun kerak? Maydonni yopish yoki ochiq qoldirishni aytmang — qarorni o'zim qilaman.»
- «Nusxalash» → gemini.google.com → o'quvchi savollarni o'qib, 14-ekrandagi almashtirgichni o'zi qoldiradi yoki o'zgartiradi, sababini yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → har ochiq maydoni yonida ikki tayyor savol chiqadi: «Begona buni bilsa, undan qanday foydalanishi mumkin?» · «Buni ochiq qoldirish kimga, nima uchun kerak?» O'quvchi javob yozadi va almashtirgichni o'zi hal qiladi. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI ilovani to'liq tekshirmaydi, faqat savol beradi. Maydonni yopish yoki ochiq qoldirishni siz hal qilasiz.»

### YAKUN

**17 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz gapingizdan qavatni topa oladimi?»
- Yo'riq: «Uch qavat gapingizdan bittasini sherigingizga o'qing — u qaysi qavat ekanini topsin. Topolmasa, gap qavatning ishini aniq aytmagan yoki ikki qavat ishini aralashtirgan bo'lishi mumkin: birga tuzating. Keyin o'rin almashing.»
- Yozish: «Sherigingiz qaysi gapni topolmadi va nimani o'zgartirdingiz — bitta gapda yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Maydon nima? | Ilova har safar yozib qo'yadigan bitta narsa |
| Ma'lumotni nima yopadi? | Zarar: begona ko'rsa egasiga zarar yetadigan maydon yopiladi |
| Sxema nima? | Ilovaning hamma maydonlari ro'yxati |
| Uch qavat qaysi ishlarni qiladi? | Sahifa ko'rsatadi · server tekshiradi · baza eslab qoladi |
| Kasbiy so'zni nima qilasiz? | Tanish so'z bilan almashtirasiz: qavatning nomi emas, ishi aytiladi |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), to'rt blokdan teng; ekran savollari va flashcard javoblarining nusxasi emas — boshqa vaziyatda (musiqa ilovasi · maktab kutubxonasi sayti · oshxona buyurtma ilovasi).
- Yakun — 4 qator:
  - Bu darsda maydonni u ochadigan bo'limga qarab tanladik.
  - Ma'lumotni zarar yopadi: begona ko'rsa egasiga zarar yetadigan maydon yopiladi.
  - Odamga aytilgan har ma'lumot ortida sxemada kerakli maydon turadi.
  - Layk kabi yozib qo'yiladigan bosish uch qavatdan o'tadi: sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi.
- Mentor og'zaki: «NestJS modulida shu uch qavatning o'rtadagisini — tekshiradigan serverni qurasiz.»

---

## 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 5 · 7 · 9 · 11 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Field Finder!** (3) — «Bo'lim ochadigan maydonlarni topdingiz» · **Who Sees It!** (6) — «Har maydonni kim ko'rishini hal qildingiz» · **Schema Ready!** (14) — «G'oyangizga uch maydonli sxema yozdingiz» · **Three Floors!** (15) — «Uch qavat gapini kasbiy so'zsiz yozdingiz» |

## 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Maydon | 3–5 | 13 |
| 2-blok · Ochiq va yopiq | 6–7 | 10 |
| 3-blok · Sxema | 8–9 | 10 |
| 4-blok · Uch qavat | 10–12 | 14 |
| O'z g'oyasi | 13–15 | 20 |
| AI + juftlik | 16–17 | 8 |
| Yakun | 18–20 | 6 |
| Bufer | | 4 |

Dars zich (4 blok + 3 ustaxona). Vaqt yetmasa, birinchi qisqaradigan joy — 12-ekran (kasbiy so'zsiz): uni mentor 15-ekran oldidan og'zaki aytadi.

## 6. Kelishib olinadigan joylar

1. **«YouTube kabi ilovani biz qursak»** — real ilova bir marta namuna (3-ekran, faqat ko'rinadigan narsalar), qolgani bizning ilova. Ma'qulmi?
2. **Bir so'z — bir tushuncha:** darsda «ilova yozib qo'yadigan bitta narsa» hamma joyda **maydon** (asosiy kursda 11-dars «maydon», 12-dars «qator», 13-dars «ustun» deydi). Bitta darsga uch nom sig'maydi (§156) — «qator» va «ustun» ishlatilmaydi, sxema = maydonlar ro'yxati. Ma'qulmi?
3. **To'rt blok, to'rt test, uch ustaxona** — 90 daqiqaga zich (bufer 4). 12-ekran birinchi qisqaradi. Rozimisiz?
4. **TEST-2 ✓ 6-ekran mezonining boshqa so'zlar bilan aytilishi** (✓ «Begona ko'rsa, egasiga zarar yetganda» ↔ xulosa «Ma'lumotni zarar yopadi, turi emas»); 6-ekranda umumiy formula o'rniga har maydonning o'z fakti chiqadi (metodist #13) — ko'chirma xavfi kam. Asosiy kurs 12-darsida ham shunday mezon-test. Ma'qulmi?
5. **10-ekran serverning tekshiruvi «bu odam shu videoga oldin layk bosmaganmi»**, TEST-4 esa «kirmagan odam» holatini «qaysi qavat aniqladi?» deb so'raydi — ekranda ko'rsatilmagan holatga qoidani ko'chirish; reveal sahifaning javobni ko'rsatishini ham aytadi. Ma'qulmi?
6. **AI faqat savol beradi** (oldingi ikki darsdagi «javob beradi» / «sinaydi» rollaridan farq). Qolsinmi?
7. **Mentor yakun gapi** «NestJS modulida…» — faqat Nest yo'lida ishlatiladi, shuning uchun mos. Og'zaki.

**Foydalanuvchi qarorlari (2026-09-23 21:29, «hammasiga tavsiyang bo'yicha, GATE S dan o'tkaz»):**
- 6-bo'lim 1–7 — hammasi **ma'qul** (YouTube bir marta namuna · «maydon» yagona nom · zich dars, 12-ekran birinchi qisqaradi · TEST-2 mezon-test · TEST-4 ko'chirish · AI faqat savol · mentor gapi og'zaki).
- Metodist D-1 (3-ekran «kontaktlar → bo'lim yo'q») — **qoladi**, mentor sinovida kuzatiladi; e'tiroz chiqsa «Telefon modeli» bilan almashadi (TEST-1 distraktori o'zgaradi).
- D-2 (8-ekran «sxema qisqa qoladi» hodisasi) — **qoladi**, 3-ekran kontaktlariga bog'langan; ortiqcha maydon qadami qo'shilmaydi.
- D-3 (6-ekran ikki tomon: hammaga ochiq · faqat egasiga) — **qoladi**, «do'st» tomoni yo'q.
- D-4 (TEST-4 va real ilova) — **qoladi**: dars modelida tekshirish serverning ishi, reveal sahifaning javobni ko'rsatishini aytadi.
- D-5 (kartasiz o'quvchi 15-ekranda) — **hal qilindi**: 1-dars 14-ekran jadvaliga «birinchi bo'lak · 1 shart» ustunlari qo'shildi (futbol · o'yin · sinf · kiyim), 13/15-ekran ularni ishlatadi (yuqorida kiritildi).
- D-6 («Sayt» kartada ↔ «ilova» darsda) — **(a) qoladi**, mentor og'zaki aytadi.
- D-9 (6-bo'lim 4/5-band matni) — **yangilandi**, yuqorida.
- D-11 («server», «baza» — qavat nomi va kasbiy so'z) — **hozirgi yechim qoladi**: nom o'rganiladi, kod bilmaydigan odamga ishi aytiladi.
- D-7 (16-ekran so'rov yig'mada) · D-8 (4-ekran navbat bilan) · D-10 · D-12 — **quruvchi/jonliga**, o'zgarishsiz.
- Senariy **GATE S dan o'tdi**.

---

**Tashqi fidbek (2026-09-23 23:41) — halol saralandi (26 band):**
- **Qabul qilindi (qisqa chegara-ibora bilan, matn ko'paytirilmadi):** 3 «bu darsda maydonni bo'limga qarab tanlaymiz», Wi-Fi va kontaktlar «bizning ilovamizda» · 4 Netflix 3-slayd bankdan chiqmaydi («taxminan to'rttasi tavsiyadan keladi»), ko'prik «shu ma'lumotdan foydalanadi» · 5 cue va xato-izohlar «bizning ilovamizda» · 6 «Kanalga joylagan videolaringiz», kanal nomi va parol sababi bilan, «hammasini yopish» faqat kanal ilovasiga bog'landi, «bu darsda ikki holat» · 7 cue mezon haqida («nimaga qaraymiz?»), variantlar bir shaklda · 8 «ma'lumot qayerdadir yozilgan bo'lishi kerak», «bitta maydon» o'rniga «kerakli maydon», «juda tez — hozircha umumiy baho» · 9 reveal «bizning sxemamizda» · 10 server «kim bosdi», baza va ekran orasidagi qadam, «layk kabi yozib qo'yiladigan bosish» · 11 ✓ «kim bosganini tekshirdi» · 12 **API almashtirish ma'noni o'zgartirardi — tuzatildi** («sahifa uni so'rab, qayta ko'rsatadi»; «server» so'zi ataylab ishlatilmadi — shu ekran uni kasbiy so'z deb o'rgatadi) · 13 «Nechta o'yinchi keladi — Yana necha kishi kerak» mantiqsiz edi, «Kim o'ynashga yozildi — Bugun kim o'ynaydi» qo'yildi · 14 «bu darsdagi ikki holat», ochiq uchun savol «nega kerak?», hammasi yopiqda savol · 16 «maxfiylik savollarini beruvchi», «to'liq tekshirmaydi», ochiq maydon uchun ikki yo'nalishli savol · 17 sherik topolmasa sabab · kaskad: 2-bo'lim fikrlari, flashcard, yakun.
- **O'zim topgan:** TEST-3 distraktori «tilni "Kanal" maydoni aytadi» fidbekning o'z dalili bilan himoyalanib qolardi (til kanal sozlamasidan kelishi mumkin) — «"Ko'rishlar soni" o'rniga "Til" yoziladi» qo'yildi (8-ekran rad etadi) · TEST-2 yangi to'g'ri javob eng uzun chiqdi — tekislandi · 15-ekran havolasi «Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?» (3/4-o'tish 2-darsi bilan bir xil).
- **Qabul qilinmadi:** (a) test mezonini «bo'lim yoki imkoniyat» ga kengaytirish — «imkoniyat» bilan telefon modeli ham himoyalanardi, test yagona javobini yo'qotardi; o'rniga «bizning ilovamizda» chegarasi · (b) kasbiy so'z ta'rifini kengaytirish — 2-o'tish 3-darsida foydalanuvchi tasdiqlagan ta'rif bilan bir xil qoladi · (c) 15-ekran futbol namunasiga qo'shimcha tekshiruvlar — bu qoida emas, o'quvchi gapining namunasi · (d) Netflix 1-slayd («tavsiyalar ko'rish tarixidan yig'iladi») — bank fakti, qoldi.
- Umumiy qoidalar: 16-ekran AI maqsad-gap va zaxira · flashcard 5 · Podium mazmuni.
- Senariy **GATE S dan o'tdi**.

## Korrektura-jurnali (pm-metodist, 2026-09-23)

Tuzilma, ekran soni (20), mexanika turlari, bloklar tartibi, ball-joylari (5 · 7 · 9 · 11), vaqt jadvali va 6-bo'lim savollari o'zgarmadi. Variantlarda ✓ birinchi yozilgan — qurishda pozitsiyani Jonli aralashtiradi. Atama-qarori saqlandi: «maydon» yagona nom, «qator»/«ustun» o'quvchi matnida yo'q. Asl v1 nusxasi: scratchpad `B7-v1-orig.md`. MATN_KORPUS.md ga yozilmadi.

### A. Tuzatishlar (❌ → ✅ · sabab)

| # | Ekran | ❌ edi | ✅ bo'ldi | Sabab |
|---|---|---|---|---|
| 1 | 1 | sarlavha «Ertalab ilova uni eslab qolsinmi?» · variant «qayerda qolganimni» · payoff «Ikkalasi ham bo'ladi … Bugun ilova nimani yozib qo'yishini, nimani hech kimga ko'rsatmasligini va bosganingizda ichida nima bo'lishini siz hal qilasiz.» | «Ertalab ilova buni eslasinmi?» · «qayerda to'xtaganimni» · «Ikkala javob ham bo'lishi mumkin — ikkalasi ham qaror. … Yozmasa, ertalab u hech narsani bilmaydi. Nimani yozib qo'yishni ilovani quradigan odam hal qiladi — bugun shu odam sizsiz.» | «ertalab eslab qolsin» — vaqt mantig'i teskari. Payoff 2-ekranni sanab takrorlardi (§0-6) va ikkita noto'g'ri va'da berardi: yopiq maydonni egasi ko'radi («hech kimga» emas), bosilganda ichida nima bo'lishini o'quvchi **hal qilmaydi**, tasvirlaydi. **§119:** «yozmasa, bilmaydi» — «Yo'q» tanlovining aynan o'zi, hech bir tanlov rad etilmaydi. «to'xtaganim» — 3-ekran «Qaysi daqiqada to'xtatildi» tugmasi bilan ip (§163) |
| 2 | 2 | «…bitta bosish ilova ichida qanday **yo'l bosishini**…» · vizual «uch maydon-kartasi … uch qavatdan» | «…tugma bosilganda ilova ichida nima bo'lishini…» · vizual: «uchta karta … uch bosqichdan», yozuvsiz | «bosish yo'l bosadi» — bir gapda bir o'zak ikki ma'noda, quloqqa g'aliz (§0-5). **§126:** «maydon», «qavat» maqsad-ekran vizualida gloss'dan oldin chiqardi |
| 3 | 3 sarlavha | «…biz qursak — **har ko'rishda** nimani yozib qo'yamiz?» | «YouTube kabi ilova qursak, video ko'rilganda nimani yozib qo'yamiz?» | **§109:** «har + fe'l-ot» qurilmasi — bosh ta'rif ekranining sarlavhasi birinchi o'qishda o'tirishi kerak |
| 4 | 3 tugmalar | «Qachon ko'rildi» → «Kechqurun ko'rganlaringiz» · «Oxirigacha ko'rildimi» → «Sizga yoqishi mumkin» · «Qayerda ko'rildi (shahar)» → bo'lim chiqmaydi | «Qachon ko'rildi» → «Kecha ko'rganlaringiz» · «Qaysi daqiqada to'xtatildi» → «Davom ettiring» · «Qaysi Wi-Fi orqali ko'rildi» → hech qanday bo'lim ochilmaydi | **§102 (bashorat-chipi kundalik tajribada rost bo'lmasin):** o'smir YouTube'da mamlakat bo'yicha «Trenddagilar»ni va mahalliy reklamani ko'radi — «Shahringizda mashhur» bo'limini o'zi topib, «bo'lim chiqmaydi» ni rad etardi. Wi-Fi nomidan bo'lim o'ylab topib bo'lmaydi, lekin ilova uni bilishi ishonarli (§110). «Oxirigacha ko'rildimi → tavsiya» — ikki qadamli xulosa, 13 yoshli uchun ko'z oldiga kelmaydi; «to'xtatildi → Davom ettiring» — bir qadam va hook bilan ip. «Kecha» — hook («kechqurun ko'rdingiz — ertalab») ipi |
| 5 | 3 xulosa + 19 + 2-bo'lim | «Ilova har safar **ko'rganingizda** yozib qo'yadigan…» | «Ilova har safar **video ko'rganingizda** yozib qo'yadigan bitta narsa **maydon** deyiladi.» | manba ta'rifi (PmLesson11 «tinglaganingizda») «ko'rish» ga moslashtirilganda to'ldiruvchi tushib qoldi: «ilova har safar ko'rganingizda» — ilovani ko'rgandami? **§109 kaskadi:** flashcard 1 so'zma-so'z bir xil |
| 6 | 3 hajm | ekran-matni bir gapda «…ko'rinadi; ko'rgan videolaringiz…» · (tahrir bosqichida qo'shilgan mentor-gap) | ikki gap; ekran 408 → **392** | §0-3 bir gap — bir fikr; ekran ≤400. Mentor-gap qo'shilmadi — besh tugma o'zini aytadi (ETALON 32) |
| 7 | 4 bashorat | «Netflix'da odamlar ko'radigan **videoning** qanchasi qidiruvdan, qanchasi **bosh sahifadagi** tavsiyadan keladi? Tavsiyadan keladigani —» | «Netflix'da odamlar film va seriallarni ikki yo'l bilan topadi: qidiruvdan yoki tavsiyadan. Ko'rishlarning qanchasi tavsiyadan keladi?» | ikki savol bitta gapda + chala gap-dum; bankdagi birlik — «ko'rishlar». Netflix'da «video» emas, film va serial (o'smir farqlaydi) |
| 8 | 4 slayd 3 | «Ya'ni **bosh sahifaning katta qismi** qidiruvdan emas, yozib qo'yilgan ko'rish tarixidan quriladi.» | «Ya'ni har beshta ko'rishdan to'rttasi ko'rish tarixidan yig'ilgan tavsiyadan boshlanadi.» | **§101:** bank «ko'rishlarning 80 %» deydi, slayd «bosh sahifaning katta qismi» dedi — boshqa narsa, va 1-slaydga zid (bosh sahifa **butunlay** tarixdan yig'iladi, «katta qismi» emas). Yangi gap faqat ikki bank-faktining qo'shilmasi («har beshtadan to'rttasi» — PmLesson11 ifodasi) |
| 9 | 4 ko'prik | «Nimani yozib qo'ysangiz, ertangi ekran shundan quriladi. **Ma'lumot — mahsulot qarori.**» | «Ilova nimani yozib qo'ysa, ertangi bosh sahifa shundan quriladi. Shuning uchun nimani yozib qo'yish — ilovani quradigan jamoaning muhim qarori.» | **§104:** kesik qurilma, «mahsulot qarori» — kattalar-atamasi, ochilmagan. «yozib qo'ysangiz» — o'quvchi yozmaydi, ilova yozadi. «Jamoa» — 5-ekran lead'i bilan ulanadi |
| 10 | 5 TEST-1 | lead «Ilovamizga **yangi maydon** taklif qilindi.» · cue «…**saqlashga** arziydi?» · «Telefon batareyasi darajasi» · «Video ko'rilgan kun **ob-havosi**» · «Ko'rish paytida **xona yorug'ligi**» · umumiy xato-izoh | lead «Jamoa ilovamizga to'rtta yangi maydon taklif qildi.» · cue «Qaysi birini yozib qo'yishga arziydi?» · «Qaysi telefon modelidan kirildi» · «Batareyada necha foiz qolgan edi» · «Telefonda bo'sh joy qancha edi» · har distraktorga o'z xato-izohi | lead birlikda, variant to'rtta (§22 sanoq). **§156:** darsning fe'li «yozib qo'yadi», «saqlash» ikkinchi nom edi. **Bitta himoyalanadigan to'g'ri:** «ob-havo» dan bola «Yomg'irli kun uchun videolar» bo'limini topib himoya qila oladi. **§110:** «xona yorug'ligi» — ilova bila olmaydi, kulgili-bo'sh, o'qimagan bola ham chiqarib tashlaydi. Yangi uchtasi ilova chindan biladigan, lekin bo'lim ochmaydigan narsalar. **§147:** «Qaysi…» ×2 (✓ bilan), qolgan ikkitasi boshqa-boshqa |
| 11 | 6 | sarlavha «…sahifangizni **uch odam** ko'rsa…» · «Uch odam: siz · do'stingiz · begona» · tomon «Faqat **o'zingizga**» | «Bizning ilovamizdagi sahifangizni begona odam ochsa, qaysi maydonlarni ko'rishi mumkin?» · yo'riq «Har maydonni ikki tomondan biriga qo'ying.» · «Faqat **egasiga**» | uch odam aytiladi, tomon esa ikkita — «do'st» hech qayerga tushmaydi, bola «do'stim qaysi tomonda?» deb qoladi (§22). Mezon — begona (xulosa, TEST-2, 14, 16). **§156:** 14-ekranda xuddi shu tomon «Faqat egasiga» — bitta almashtirgichga ikki nom edi (D-3) |
| 12 | 6 maydonlar | «Yoqtirganlaringiz» · «Tarix (ko'rganlaringiz)» | «Qaysi videolarga layk bosgansiz» · «Qaysi videolarni ko'rgansiz» · «Telefon raqamingiz» · «Parolingiz» | **§156:** «Tarix» va «Yoqtirganlaringiz» 3/5-ekranda **bo'lim** nomi edi, 6-ekranda esa **maydon** bo'lib chiqdi — bola maydon ↔ bo'lim farqini endigina o'rgangan paytda. Yangi nomlar 3-ekran maydonlari shaklida («Qaysi video ko'rildi»). Sanoq 6 saqlandi |
| 13 | 6 tekshiruv | ochiq — «Begona ko'rsa ham hech kim zarar ko'rmaydi.» · yopiq — «**Begona ko'rsa — egasi zarar ko'radi.**» · parol — «Parol faqat egasida turadi.» | har maydonga o'z fakti: «Kanalingizni odamlar topishi kerak.» · «Videoni hamma ko'rsin deb yuklagansiz.» · «Begona siz nimalarni ko'rganingizni bilib oladi.» · «Raqamingizni bilgan begona sizga qo'ng'iroq qilib, bezovta qila oladi.» · «Parolni bilgan begona sahifangizga kirib oladi.» | **§175:** umumiy formula javobni aytardi (ko'chiriladi), fakt esa xulosani bolaga qoldiradi. **§106:** TEST-2 ✓ («begona ko'rib, egasiga zarar yetganda») shu formulaning so'zma-so'z nusxasi edi — endi 6-ekranda umumiy formula yo'q. Parol-izohi aylanma edi (nega yopiq? — egasida turgani uchun) |
| 14 | 6 xulosa | «Ma'lumotni zarar yopadi, **turi emas**. …» (hodisasiz) | «Kanal nomi ham, parol ham — oddiy yozuv. Lekin biri ochiq qoladi, biri yopiladi. Ma'lumotni zarar yopadi, turi emas. …» | **§0-1:** «turi emas» ning hodisasi ekranda yo'q edi — 13 yoshli «qaysi tur?» deydi. Juftlik ataylab **bir xil turdagi** yozuvdan: «kanal nomi ↔ telefon raqami» olinsa, bola «raqam — yopiq» degan xato qoidani chiqarib, TEST-2 dagi «faqat raqam» distraktorini to'g'ri deb tanlardi (§102). Manba qoidasi so'zma-so'z qoldi |
| 15 | 7 TEST-2 | ✓ «Begona odam ko'rib, egasiga zarar yetganda» (42 — eng uzun) · «Uni **yig'ishga** ilovada ko'p vaqt ketganda» · «Maydonni kam odam **ochib ko'rganda**» · «**Maydon** raqamlardan iborat bo'lganda» · xato-izoh (4) «Raqam ham, so'z ham bo'lishi mumkin…» | ✓ «Begona ko'rsa, egasiga zarar yetganda» · «Ilova uni har kuni qayta yangilab turganda» · «Unga boshqa odamlar kam qiziqqanda» · «Unda so'z emas, faqat raqam turganda» · (4) «Yozuvning turi hech narsani hal qilmaydi. Begona buni ko'rsa, egasiga nima bo'ladi?» | uzunlik: ✓ eng uzun edi (1.05) → 0.88. «yig'ish» — ma'lumot yig'ishmi, vaqt yig'ishmi, noaniq. «maydonni ochib ko'rish» — darsda maydon ochilmaydi, bo'lim ochiladi (§156). Yangi distraktorlar ishonarli: «Oxirgi marta qachon kirgan» chindan har kuni yangilanadi va sana-soatdan iborat — bola shunga suyanadi, 6-ekran xulosasi rad etadi (§110 davomi). Cue «Bu maydon» → «Bunday maydon» — savol mezon haqida, aynan bu maydonning hukmi haqida emas (Telegram'da «oxirgi marta» ni har kim o'zi yopadi — hukm-savol bo'lsa ikki javob himoyalanardi) |
| 16 | 8 sarlavha | «E'londa **"video qachon yuklanganini ko'rasiz"** deyilgan. Ilova buni qayerdan biladi?» | «E'londagi har va'dani ilova qayerdan biladi?» | sarlavha konstruktorning kashfiyotini (qaysi gap ortida maydon yo'q) oldindan aytib qo'yardi — bola bog'lashdan oldin javobni bilardi (§139 ruhi: natija o'quvchi harakatidan chiqsin) |
| 17 | 8 ekran-matn | «ilovamizning e'loni (odamga aytiladigan **to'rt gap**)» + keyin «Beshinchi gap» | «Bu — ilovamizning e'loni: odamga nima ko'rinishini aytadigan besh gap. Har gapni maydon bilan bog'lang.» | «e'lon» — o'smir uchun «reklama/ogohlantirish»; birinchi ko'rinishda nima ekani aytildi (§104). **§22 sanoq:** ekranda besh gap turadi, matn «to'rt» derdi |
| 18 | 8 maydonlar | «Nomi · Kanal · Ko'rishlar» → «Sana» | «Video nomi · Kanal · Ko'rishlar soni» → «Yuklangan sana» | 3-ekran ekran-matni bilan bir so'z (§156); «Nomi» — egalik qo'shimchasi yorliqda osilib qoladi |
| 19 | 8 mexanika-matni | noto'g'ri bog'lanish holati yo'q | «Bu maydonda boshqa narsa yozilgan. Sana qaysi maydonda turibdi?» | **§139/§175:** bola sana gapini «Ko'rishlar soni» ga ulasa, ekran nima deydi — Quruvchi to'qimasin; izoh mezonni eslatadi, javobni aytmaydi |
| 20 | 8 · 9 · 13 | «Bu gap hech qanday ma'lumot va'da qilmaydi — **xohish** maydon ochmaydi.» · 13 «Bu ma'lumot emas, **xohish**.» · 9 «"Yaxshi" — **baho so'zi**…» | 8 «"Tez" — baho so'zi. U odamga hech qanday ma'lumot ko'rsatmaydi, shuning uchun maydon ochmaydi.» · 13 «Bu baho so'zi, ma'lumot emas. Ilova nimani yozib qo'yadi?» | **§156:** bitta tushunchaga ikki nom (xohish · baho so'zi). «Ilova juda tez ishlaydi» — xohish emas, **da'vo**; bola «bu va'da-ku» deydi. «Baho so'zi» ko'z oldiga keladi (tez · yaxshi · qulay) va qo'shni darsda (2-dars 15-ekran) xuddi shu so'zlar tekshirilgan. Manba «Xohish ustun ochmaydi» atama-qarori bilan allaqachon moslashtirilgan edi |
| 21 | 8 xulosa | «…Sxema qisqa qoladi — hech qaysi gapga ulanmagan maydon **olib tashlanadi**.» | «…Sxema qisqa qoladi: kontaktlar kabi hech qaysi gapga kerak bo'lmagan maydon unga kirmaydi.» | **§0-1:** konstruktorda ulanmay qolgan maydon **yo'q** — qoida hodisasiz edi. Endi bola ko'rgan hodisaga (3-ekran, kontaktlardan bo'lim chiqmadi) bog'landi. To'liq yechim — mexanikada (D-2). 415 → 383 |
| 22 | 9 TEST-3 | lead «…yangi gap qo'shildi» · «Hech narsa — **ilova tilni o'zi biladi**» · «"Yaxshi video" maydoni qo'shiladi» · «**Gap o'zgartiriladi**, maydon kerak emas» + izoh «Uni olib tashlamaymiz» | lead «**Jamoa** ilovamiz e'loniga yangi gap qo'shdi…» · cue «Endi sxemaga nima bo'ladi?» · «Sxemaga "Yaxshi video" maydoni qo'shiladi» · «Hech narsa — tilni "Kanal" maydoni aytadi» · «Hech narsa — e'londagi gapning o'zi yetadi» | **§108:** YouTube tilni o'zi aniqlaydi (avto-subtitr, tarjima) — bola **rost tajribasini** rad etishi kerak edi. **Bitta himoyalanadigan to'g'ri:** va'dani olib tashlash ham haqiqiy mahsulot qarori — «Gap o'zgartiriladi» himoyalanardi, «olib tashlamaymiz» darsda o'rgatilmagan qoida edi; endi lead jamoa qarorini qat'iy aytadi. Yangi distraktorlar 8-ekranda ochiq rad etilgan («Kanal» — kim yukladi; «gap yolg'on chiqadi») — o'qiganni mukofotlaydi (§110 davomi). **§147:** «Sxemaga» ×2 · «Hech narsa» ×2 — 2/2 hukm-balansi (§107) |
| 23 | 10 | server — «tekshiradi (bu videoga **ikkinchi layk** emasmi)» · xulosa «Ilova uch qismdan turadi — ularni qavat deymiz, **binoning qavatlari kabi**.» · «Uni baza eslab qoldi.» | «tekshiradi (bu odam shu videoga oldin layk bosmaganmi)» · «Siz ko'rgan uch qadam — ilovaning uch qismi. Ularni **qavat** deymiz, binodagi kabi: har qavatning bitta ishi bor.» · «Layk joyida — uni baza eslab qoldi.» | YouTube'da qayta bosish laykni **olib tashlaydi** — «ikkinchi layk» o'smir tajribasiga to'g'ri kelmaydi. Xulosa endi bola ko'rgan uch qadamdan boshlanadi (hodisa → nom, §104); «qism» faqat shu gapda, darhol «qavat» ga o'tadi (§156) |
| 24 | 11 TEST-4 | lead «**Ilovaga kirmagan holda** layk bosdingiz — ilova "Avval kiring" dedi.» · cue «**Buni** qaysi qavat qildi?» · «Sahifa — u **ko'rsatdi**» · «Baza — u eslab qoldi» · «Telefon — u to'xtatdi» | «Akkauntingizga kirmasdan layk bosdingiz. Ekranda "Avval kiring" yozuvi chiqdi.» · «Siz kirmaganingizni qaysi qavat aniqladi?» · «Sahifa — u tugmani qulflab qo'ydi» · «Baza — u laykni o'chirib tashladi» · «Telefon — u layk bosishni to'xtatdi» | «ilovaga kirmagan» — ilovani ochmaganmi? (ochmasa layk bosa olmaydi). **Bitta himoyalanadigan to'g'ri:** «buni» = yozuv chiqishi — yozuvni **sahifa ko'rsatdi**, ya'ni «Sahifa — u ko'rsatdi» rost edi (§102). Cue endi «aniqladi» — tekshirish haqida. Yangi distraktorlar ekranda rost emas (tugma bosildi — qulflanmagan; layk yozilmagan — o'chiriladigan narsa yo'q). Tahrir bosqichidagi «Baza — u sizni eslab qolmadi» varianti olib tashlandi: bola «meni eslamagani uchun kirmagan deb chiqdi» deb himoya qila olardi. Uzunlik 1.05 → 1.25, ✓ eng uzun emas |
| 25 | 12 | sarlavha «"Layk bazaga yoziladi, **API orqali qaytadi**" — kod bilmaydigan odam buni tushunadimi?» · almashtirish «API orqali qaytadi» → «sahifa **serverdan** so'rab oladi» · xulosa «…qavatning ishini aytadigan **oddiy so'zga** almashtirasiz: **baza** eslab qoladi, **server** tekshiradi, sahifa ko'rsatadi.» | «Kod bilmaydigan odamga layk haqida gapiryapsiz. Qaysi so'zda u sizni tushunmay qoladi?» · «API orqali sahifaga qaytadi» → «keyingi safar ham ekranda turadi» · «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tashlamaysiz, tanish so'z bilan almashtirasiz. Kod bilmaydigan odamga qavatning nomini emas, ishini ayting: eslab qoladi, tekshiradi, ko'rsatadi.» | sarlavhadagi gap ekrandagi gapdan boshqacha edi. **Xulosa o'ziga zid edi:** «kasbiy so'zni almashtiring» deb, darhol «baza», «server» ni ishlatardi — 15-ekran jonli tekshiruvi aynan shu so'zlarni qizil chizadi; almashtirish-natijasida ham «server» qolardi. Yechim: qavat **nomi** — o'quvchining o'zi uchun, kod bilmaydigan odamga — qavatning **ishi** (D-11). Ta'rif-gap va «tanish so'z» — qo'shni darslardagi (3/4-o'tish 3-darslari) tasdiqlangan ifoda, so'zma-so'z |
| 26 | 15 · 19 · 2-bo'lim | «oddiy so'zda ayting» · «oddiy so'zga almashtirasiz» · «oddiy so'z bilan aytiladi» | «tanish so'z bilan» (hamma joyda) | **§156:** 12-ekran xulosasi bilan bir so'z; qo'shni darslar atamasi |
| 27 | 13 | sarlavha «**G'oyangiz** har safar nimani yozib qo'yadi?» · «Uch **qator**, har birida ikki **maydon**» · namuna «Qaysi **vaqt** band qilindi» → «Mening bandlarim» · «Qaysi **kun va soat**» → «Bugungi jadval» · baho → «…**xohish**» | «Tanlagan g'oyangizda ilova nimani yozib qo'yadi?» · «Uch karta, har birida ikki savol» · «Qaysi kun va soat band qilindi» → «Bugungi jadval» · «Kim band qildi» → «Band qilganlarim» · «Nechta o'yinchi keladi» → «Yana necha kishi kerak» | **§28:** g'oya yozib qo'ymaydi — ilova yozadi. **§156:** UI yozuv-joyini «maydon» deyish dars atamasi bilan to'qnashardi, «qator» — atama-qarori bo'yicha taqiq. Namunada ikki maydon bitta narsa edi (vaqt = kun va soat) — bola «3 xil maydon» ni namunadan o'rgana olmasdi. Futbol namunasida «maydon» so'zi futbol maydoni ma'nosida **ataylab ishlatilmadi**. «Mening bandlarim» — so'zlashuv shakli (7-C). **§37:** to'rt g'oyada sinaldi (C bo'lim) |
| 28 | 14 | sarlavha «…qaysi biri begonaga **ko'rinmaydi**?» · yopiq — «Begona ko'rsa **kim** zarar ko'radi?» · ochiq — «Begona ko'rsa hech kim zarar ko'rmaydi» (**o'zi tushadi**) · «…**saytdan** foyda qoladimi?» | «…qaysi biri begonaga ko'rinmasin?» · «Begona ko'rsa, egasiga qanday zarar yetadi?» · «Begona ko'rsa, nega zarar yo'q?» — javobni o'quvchi yozadi · «…ilovadan foyda qoladimi?» | sarlavha — qaror-savoli, darak emas. «Kim» savoliga javob doim «egasi» — bola bir so'z yozib o'tib ketadi; «qanday» sababni so'raydi. **§139:** ochiq tanlovga sabab oldindan yozilib tushardi — holat bolaning harakatidan emas, ssenariydan chiqardi. **§156:** darsda mahsulot — «ilova» (D-6) |
| 29 | 15 | sarlavha «Birinchi bo'lagingizda **bitta bosish qanday yo'l bosadi**?» · «Uch **maydon**» · «Eslab qoladigan qavat: ilova nimani **saqlaydi**?» | «Birinchi bo'lagingizda tugma bosilsa, ilova ichida nima bo'ladi?» · «Uch yozuv joyi» · «…ilova nimani eslab qoladi?» | #2 bilan bir sinf; sarlavha 10-ekran sarlavhasi bilan juft («Layk bosdingiz. Ilovaning ichida nima bo'ldi?», §163). **§156:** UI-maydon; «saqlaydi» — qavat fe'li «eslab qoladi» dan boshqa so'z |
| 30 | 16 | sarlavha «Ochiq maydonlaringizdan qaysi biri begonaga **ish beradi**?» · so'rov «Siz ilovalardagi **ma'lumot xavfsizligini tekshiruvchisiz**. … Har ochiq maydon uchun bitta savol bering: **begona odam buni ko'rsa, egasiga qanday zarar yetishi mumkin?** Qaror bermang…» | «Ochiq maydonlaringizni begona ko'rsa, nima bo'lishi mumkin?» · «Siz ilovadagi ma'lumot begonaga ochilib qolmaganini tekshirasiz. … Har ochiq maydon uchun menga bitta savol bering: begona shu ma'lumotni bilsa, u bilan aniq nima qila oladi? Maydonni yopish yoki ochiq qoldirishni aytmang — qarorni o'zim qilaman.» | «ish beradi» — ko'p ma'noli ibora (foyda beradimi? tashvish beradimi?). So'rov AI'dan o'quvchining **o'z savolini** qaytarib so'ratardi — javob uch marta bir xil savol bo'lib kelardi; endi AI har maydonga aniq holat so'raydi. Ketma-ket ot-birikmalar («ma'lumot xavfsizligini tekshiruvchi») — kantselyarit. **§173:** qaror o'quvchida, so'rovning o'zida ham |
| 31 | 17 | «Keyin **almashasiz**.» · «…**bir qatorda** yozing» | «Keyin o'rin almashing.» · «…bitta gapda yozing» | «almashasiz» — nimani? «qator» — atama-qarori (o'quvchi matnida umuman yo'q) |
| 32 | 19 flashcard | «Maydon qachon **saqlashga** arziydi?» · «…— **tavsiya qidiruvdan ko'p**» · «Zarar — **begona ko'rsa egasi zarar ko'rsa**; turi emas» · «Qavatning ishini aytadigan **oddiy so'zga**…» | «Maydonni qachon yozib qo'yishga arziydi?» · «Odamning ko'rish tarixidan — ko'rishlarning taxminan 80 foizi shu tavsiyadan keladi» · «Zarar: begona ko'rsa egasiga zarar yetadigan maydon yopiladi» · «Tanish so'z bilan almashtirasiz: qavatning nomi emas, ishi aytiladi» | ikki orqa tomon grammatik buzuq edi (§52 tugal gap); #5, #10, #25, #26 kaskadi. Sanoq 8. **§145:** sakkiz karta darsda tug'ilgan nomlarni so'raydi (maydon 3 · sxema 8 · qavat 10 · kasbiy so'z 12) |
| 33 | 20 | yakun «…**begona ko'rsa egasi zarar ko'rsa**, maydon yopiladi.» · «…— **gap ortida maydon bo'lsin**.» · mentor «…uch qavatning **o'rtasini** qurasiz — server tekshiradi.» | «Ma'lumotni zarar yopadi: begona ko'rsa egasiga zarar yetadigan maydon yopiladi.» · «Ilova faqat yozib qo'yilganini biladi: odamga aytilgan har ma'lumot ortida maydon turadi.» · «NestJS modulida shu uch qavatning o'rtadagisini — tekshiradigan serverni qurasiz.» | ikki «-sa» ketma-ket — quloqqa g'aliz; «gap ortida» — qaysi gap? (§52); «qavatning o'rtasi» — ikkinchi qavat emas, bitta qavatning o'rtasi deb o'qiladi |
| 34 | 4-bo'lim | **Memory Keys!** · «Har maydon**ga** kim ko'rishini…» | **Field Finder!** · «Har maydonni kim ko'rishini hal qildingiz» | **§100:** NestJS'ga kirayotgan o'quvchi uchun «memory» — xotira (RAM), «keys» — kalit (bazadagi kalit): ikkalasi ham kurs lug'atidagi texnik omonim. «Field» — «maydon» ning o'zi. Kelishik |
| 35 | pasport · 2-bo'lim · halollik | «bitta bosishning yo'lini» · «Begona ko'rsa egasi zarar ko'radigan…» · «ulanmagan maydon olib tashlanadi» · halollik ro'yxati v1 ekranlariga | #2, #13, #21 kaskadi; halollik ro'yxatiga 3-ekranning yangi bo'limlari (Kecha ko'rganlaringiz · Davom ettiring · Wi-Fi) va 8-ekrandagi maydonlar ro'yxati qo'shildi; «Kartasiz» qatoriga D-5 havolasi | ichki joylar ekran bilan bir xil gapirsin |

### B. Test-halollik o'lchovi (Intl.Segmenter, grapheme; ✓ birinchi)

| Ekran | Uzunliklar | max/min | ✓ / eng uzun distraktor | Oldin |
|---|---|---|---|---|
| 1 hook (ballsiz) | 37 / 40 | 1.08× | — | 1.08× |
| 4 bashorat (ballsiz; ✓ = 80 %) | 4 / 4 / 4 | 1.00× | — | o'zgarmadi |
| 5 TEST-1 | 26 / 31 / 32 / 30 | 1.23× | 0.81 | 1.19× (0.84) |
| 7 TEST-2 | 37 / 42 / 34 / 36 | 1.24× | 0.88 | 1.27× · **✓ eng uzun (1.05)** |
| 9 TEST-3 | 38 / 41 / 41 / 42 | 1.11× | 0.90 | 1.16× |
| 11 TEST-4 | 29 / 33 / 33 / 35 | 1.21× | 0.83 | 1.05× |

- **3-vs-1 shakl (§147):** T1 — «Qaysi…» ×2 (✓ bilan) · «Batareyada» · «Telefonda» — yolg'iz guruh yo'q. T2 — «Begona» · «Ilova» · «Unga» · «Unda»; to'rttasi «…ganda» bilan tugaydi (v1 da «Maydon…» ×2 ↔ ✓ yolg'iz «Begona» edi). T3 — «Sxemaga» ×2 (✓ bilan) · «Hech narsa» ×2. T4 — to'rttasi «{qavat} — u …» qolipida.
- **Mutlaq so'z (§110):** T1 — yo'q · T2 — «faqat» faqat 4-variantda · T3 — «Hech narsa» ikki variantda: bu mutlaq-da'vo emas, hukm («o'zgaradi / o'zgarmaydi»), §107 bo'yicha 2/2 teng · T4 — yo'q. ✓ larda yo'q.
- **§110 kulgili-bo'sh:** v1 T1 «xona yorug'ligi» olib tashlandi (#10). Yangi distraktorlarning har biri ilova chindan bila oladigan narsa.
- **§102 (distraktor darsda rost emasmi):** T1 — uchalasidan bo'lim chiqmaydi, 3-ekran mezoni rad etadi. T2 — «har kuni yangilanadi», «kam qiziqish», «faqat raqam» ning hech biri 6-ekranda mezon bo'lib ko'rinmaydi; «faqat raqam» ni 6-ekran xulosasi (kanal nomi ↔ parol, bir xil tur) rad etadi. T3 — «Kanal» 8-ekran bog'lashida «kim yukladi» ga ulangan; «gapning o'zi yetadi» ni 8-ekran («gap yolg'on chiqadi») rad etadi; «Yaxshi» — 8-ekran baho so'zi. T4 — tugma qulflanmagan (bola uni bosdi), layk yozilmagan, telefon qavat emas — hech biri ekranda rost emas.
- **§106 (ko'chirma):** har ✓ oldingi ikki ekran matni bilan 3 so'zli bo'laklarda solishtirildi — takror **0**. T2: 6-ekrandagi umumiy formula olib tashlangani uchun ✓ endi qoidani qo'llash (#13). T4: to'rt variant ham o'z qavatining 10-ekrandagi fe'lini eslatadi — kalit-so'z faqat ✓ da yashamaydi (§127).
- **§108:** T3 «ilova tilni o'zi biladi» olib tashlandi (#22). T2 cue mezon-savol bo'lib qoldi — «oxirgi marta» maydonining o'z hukmini so'rash ikki javobni himoyalardi (#15).
- **Bitta himoyalanadigan to'g'ri:** T1 «ob-havo» (#10), T3 «gap o'zgartiriladi» (#22), T4 «sahifa ko'rsatdi» (#24) — v1 da uch testda ikkinchi himoyalanadigan javob bor edi.
- **§119 (hook):** payoffdagi «yozmasa, ertalab u hech narsani bilmaydi» — «Yo'q» tanlovining o'zi; «Ha» tanlovi 3-ekranda («Davom ettiring») ro'yobga chiqadi. Hech bir tanlov rad etilmaydi.
- **Reveal + xato-izoh:** to'rt testning har distraktoriga alohida izoh; hammasi mezonni savol bilan eslatadi, javobni aytmaydi (§175).

### C. Mexanik tekshiruvlar

- Kirill `grep -cP '[\x{0400}-\x{04FF}]'` → **0**.
- Qiyshiq apostrof (U+2018 · U+2019 · U+02BB) → **0**.
- Siz-forma grep → toza (yagona topilma — pasport «Format» qatoridagi uyga vazifa ro'yxati, soxta).
- Ichki jargon `yadro|artefakt|recap` → **0**.
- **Atama-inventari (§156):** «maydon» — faqat ilova yozib qo'yadigan narsa (UI yozuv-joyi «yozuv joyi»/«savol», futbol maydoni namunada yo'q) · «bo'lim» — ertangi ekrandagi bo'lim (3, 5, 13) · «sxema» — maydonlar ro'yxati (8, 9, 14, 19) · «qavat» — sahifa · server · baza (10–12, 15, 17, 19, 20) · «qism» — faqat 10-ekran ta'rif-gapida · «baho so'zi» (8, 9, 13) · «kasbiy so'z» (12, 15, 19) · «tanish so'z» (12, 15, 19, 2-bo'lim). Qo'shni darsdan «bo'lak» — birinchi bo'lak ma'nosida (13, 15), «shart» — birinchi shart (15) va chip-yorliq ma'nosida. Residue: «qator»/«ustun» — o'quvchi matnida **0** (faqat 6-bo'lim 2-band va 13-ekrandagi quruvchi-izohi «5 qatorli jadval»); «xohish» → 0; «oddiy so'z» → 0; «saqla» → 1 (hook variantidagi «saqlamasin» — o'quvchining og'zaki javobi, atama emas); «sayt» → 1 (arena ro'yxatidagi «maktab kutubxonasi sayti» — boshqa mahsulot).
- **§126:** bosh atamalarning birinchi uchrashi — ta'rif-gapda yoki undan keyin: maydon (3-ekran xulosa) · sxema (8) · qavat (10) · kasbiy so'z (12). 2-ekran vizualida yozuv yo'q (#2).
- **Keys K6 (§101), gap-ma-gap bank bilan:** 4-ekran bashorat «qidiruvdan yoki tavsiyadan» — bank («tavsiyadan, qidiruvdan emas») · slayd 1 «har kimning bosh sahifasi o'ziniki; tavsiyalar ko'rish tarixidan yig'iladi» — bank 1 · slayd 2 «2016 · ochiq aytgan · taxminan 80 foizi tavsiyadan, qidiruvdan emas» — bank 2 · slayd 3 «har beshtadan to'rttasi ko'rish tarixidan yig'ilgan tavsiyadan» — bank 1 + bank 2 qo'shilmasi, yangi fakt yo'q · ko'prik — Netflix haqida gap yo'q, bizning ilova haqida · flashcard 3 — bank 1 + 2. Bankdan tashqari fakt **0**. Slaydlar bir-biriga zid emas (v1 slayd 3 zid edi, #8).
- **YouTube halolligi:** nom faqat 3-ekranda (sarlavha + ekran-matn), faqat ko'rinadigan narsalar (video nomi · kanal · ko'rishlar soni · sana · «Tarix»). Layk va izoh 10-ekranda «ilovamizning video sahifasi» sifatida — YouTube nomi yo'q. 3-ekrandagi «bo'lim ochilmaydi» ikki maydon — Wi-Fi (bola bo'lim o'ylab topolmaydi) va kontaktlar (korpus §110 namunasi; D-1).
- **Sanoq-mosligi:** 5 tugma (3) · 4 variant (5 lead «to'rtta») · 6 maydon (6) · 2 tomon (6, 14 — bir xil nom) · besh gap = 4 + 1 (8, ekran-matni «besh gap») · 3 maydon ro'yxatda + 1 qo'shiladi (8) · 3 qadam = 3 qavat (10, 11, 15, 20) · 3 maydon ustaxonada (13, 14, 16 so'rov, nishon) · 3 yozuv joyi (15) · 8 flashcard · 4 nishon · 20 ekran.
- **§37 — 15-ekran uch qavat gapi, B4 jadvalidagi to'rt g'oyada** (yorliq-savol + javob ovoz chiqarib): futbol — namuna · o'yin («mos jamoadosh topish»): «Qidirish bosilganda mos o'yinchilar ro'yxati chiqadi» · «o'yinchining darajasi mos kelishini tekshiradi» · «kim bilan o'ynaganingizni eslab qoladi» · sinf («pul berganni belgilash»): «Ism bosilganda yonida ✓ chiqadi» · «bu odam oldin belgilanmaganini tekshiradi» · «kim, qachon pul berganini eslab qoladi» · kiyim («mos o'lchamni ko'rsatish»): «Bo'y va vazn yozilganda mos o'lcham chiqadi» · «raqamlar to'g'ri yozilganini tekshiradi» · «bo'y va vazningizni eslab qoladi». To'rttasi tugal; «Tekshiradigan qavat: ilova nimani tekshiradi?» → «…tekshiradi» shakli har g'oyada o'tiradi. 13-ekran maydon-shakli ham sinaldi: «Qaysi o'yinda qatnashdi» → «Oxirgi o'yinlar» · «Kim pul berdi» → «Pul berganlar» · «Bo'yi va vazni» → «Sizga mos o'lcham».
- **§139:** 6-ekran — har maydon qo'yilganda o'z fakti (holat harakatdan) · 8-ekran — sana gapi bosilganda va noto'g'ri ulanganda alohida xabar (#19) · 14-ekran — sabab oldindan yozilmaydi (#28) · 10-ekran — yo'l 👍 bosilgandan keyin ochiladi.
- **§173:** 16-ekran sarlavhasi o'quvchining maydonlari haqida; so'rov va qoida-gap qarorni o'quvchida qoldiradi; AI savol beradi, maydonni yopmaydi.
- **§144:** arena — musiqa ilovasi · maktab kutubxonasi sayti · oshxona buyurtma ilovasi; ekran-testlari va flashcard javoblarini takrorlamaydi (Quruvchi `QUIZ_BANK` yozganda 5+ so'zli takror grep qilinadi).
- **Ekran-hajmi (≤400, ko'rinadigan proza; tugmalar/variantlar/kartalar/so'rov material sanalmaydi):** 1 ≈310 · 2 ≈264 · 3 ≈392 (edi 408) · 4 ≈316 + slayd ≈90–104 (navbat bilan, D-8) · 6 ≈344 (edi 215 — tomon-yo'riq va «turi emas» hodisasi qo'shildi) · 8 ≈383 (edi 314, oraliq tahrirda 415 — qisqartirildi) · 10 ≈249 · 12 ≈309 · 13 ≈48 · 14 ≈51 · 15 ≈64 · 16 ≈147 + so'rov ≈368 (D-7) · 17 ≈210.
- `npm run lint:til -- pm-senariylar/BRIDGE-B7-MalumotIshonch.md` → **0 error** (v1 da ham 0). Warn 3 ta, hammasi soxta: `zanjir-streak` — «Ip-zanjir» (2-bo'lim), «Zanjir chapdan o'ngga» (2-ekran vizual) va shu qatorning o'zi — ichki so'z, streak emas. O'quvchi ko'radigan matnda warn yo'q.

### D. Tuzilmaviy e'tirozlar (tuzatilmadi — foydalanuvchi/Quruvchiga)

1. **3-ekran «Telefondagi kontaktlar» → bo'lim ochilmaydi.** Korpus §110 aynan shu variantni namuna qiladi, lekin TikTok va Instagram «Kontaktlaringizdagi do'stlar» ni ko'rsatadi — o'smir «Do'stlaringiz ko'rgan videolar» bo'limini o'ylab topishi mumkin. Mentor sinovida kuzatish; kerak bo'lsa «Telefon modeli» bilan almashtiriladi (TEST-1 distraktori boshqasiga o'tadi).
2. **8-ekranda «Sxema qisqa qoladi» qoidasining hodisasi yo'q.** Ro'yxatdagi uchala maydon ham ulanadi — ortiqcha maydon ko'rinmaydi. Hozircha xulosa 3-ekran kontaktlariga bog'landi (#21). To'liq yechim: ro'yxatga ataylab ortiqcha maydon (masalan «Qaysi Wi-Fi orqali ko'rildi») qo'shish — bog'lash oxirida u ulanmay qoladi va bola uni olib tashlaydi. Mexanikaga bitta qadam qo'shiladi — Quruvchi/foydalanuvchi qarori.
3. **6-ekran «uch odam».** Tomonlar ikkita, shuning uchun «do'st» matndan olindi (#11). Agar asl g'oya uch tomonli joylashtirish (hammaga · do'stlarga · faqat egasiga) bo'lsa — bu mexanika o'zgarishi; u holda 14-ekran almashtirgichi ham uch holatli bo'ladi. Tavsiya — ikki tomon (zarar mezoni bitta savolda qoladi).
4. **TEST-4 va real ilova.** Ko'p ilovalarda «Avval kiring» oynasini sahifaning o'zi chiqaradi — NestJS'ga kirayotgan, frontendni ko'rgan o'quvchi buni bilishi mumkin. Dars modelida tekshirish — serverning ishi (manba PmLesson14). Cue «aniqladi» ga o'tdi va sahifa-distraktori ekranda rost bo'lmagan harakatga almashdi (#24) — xavf kamaydi, lekin 6-bo'lim 5-band bilan birga ko'rilsin.
5. **Kartasiz o'quvchi 15-ekranda.** 13-ekran uni 1-darsning 4 tayyor g'oyasi bilan qutqaradi, lekin 15-ekran «oldingi darsdagi birinchi shartingiz» ni yonga qo'yadi — kartasiz bolada birinchi bo'lak ham, shart ham yo'q (B4 jadvalida bu ustunlar yo'q). Taklif: har tayyor g'oyaga bitta bo'lak + bitta shart namunasi qo'shilsin (futbol: «bo'sh vaqtni band qilish» · «Bo'sh vaqt bosilsa» / «"Band qilindi" yozuvi chiqadi»; qolgan uchtasiga C bo'limdagi §37 sinovidagi bo'laklar). Qaror kerak.
6. **«Sayt» ↔ «ilova».** O'quvchining 1-dars kartasida «Sayt kim uchun? · Sayt nima qiladi?», bu darsda esa hammasi «ilova» (14-ekrandagi yolg'iz «saytdan» ham «ilovadan» ga o'tdi, #28). Karta yonda turganda bola «saytim ilovami?» deb qolishi mumkin. Variantlar: (a) shunday qoldirish, (b) 13-ekranga bitta izoh-gap. Tavsiya — (a), mentor og'zaki.
7. **16-ekran ≈147 + so'rov ≈368 + o'quvchining uch maydoni** — 400 dan oshadi (qo'shni darslar D bilan bir sinf). Taklif: so'rov default-yopiq «So'rovni ko'rish» yig'masida.
8. **4-ekran** — bashorat, slayd va ko'prik bir vaqtda tursa ≈420. Navbat bilan chiqsa (bashorat → slaydlar → ko'prik) ≤400. Quruvchiga.
9. **6-bo'lim 4- va 5-band matni o'zgartirilmadi**, lekin ular tegadigan ekranlar o'zgardi: (4) TEST-2 ✓ endi «Begona ko'rsa, egasiga zarar yetganda», 6-ekranda umumiy formula o'rniga maydonlarning o'z faktlari — ko'chirma xavfi kamaydi (#13); (5) 10-ekran tekshiruvi «bu odam shu videoga oldin layk bosmaganmi» deb qayta aytildi, TEST-4 cue «aniqladi» (#23, #24). Foydalanuvchi qaror berganda shu holat hisobga olinsin.
10. **3-ekran bo'limlari «Kecha ko'rganlaringiz» · «Davom ettiring»** — bizning ilova qarori (halollik blokida yozildi). YouTube'da ham qolgan joyni ko'rsatadigan chiziq bor — bola «YouTube'da ham bor» desa, ekran-matni («Ilovamiz nimani yozib qo'yishini esa biz hal qilamiz») unga zid emas.
11. **«Server», «baza» — ham qavat nomi, ham kasbiy so'z.** 10–11-ekranda bola ularni nom sifatida o'rganadi, 12- va 15-ekranda kod bilmaydigan odamga aytilmaydi. Yechim matnda ochiq: «qavatning nomini emas, ishini ayting» (#25). Tasdiq kerak — boshqa yo'l: 10-ekranda qavatlarni faqat fe'l bilan nomlash (ko'rsatadigan · tekshiradigan · eslab qoladigan), «server/baza» esa faqat 20-ekrandagi mentor gapida.
12. **TEST-1 ✓ eng qisqa** (26 ↔ 30–32). Nisbat 1.23×, ✓ eng uzun emas — qoida bo'yicha toza; qisqalik tell bo'lsa, Jonli ko'radi.
