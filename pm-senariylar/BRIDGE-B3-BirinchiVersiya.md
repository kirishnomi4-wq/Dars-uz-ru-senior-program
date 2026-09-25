# Bridge · «Birinchi versiya va uni ko'rsatish» — dars rejasi

> Holat: QORALAMA v1 → metodist korrekturasi → **eMaktab tekshiruvi ✅ · e'tirozlar bo'yicha qarorlar ✅ (6-bo'lim)** → foydalanuvchi bilan kelishildi ✅ (20:40) → **foydalanuvchi o'zi tahrirladi + 3–15-ekran fidbegi kiritildi ✅ (2026-09-23 23:02) — GATE S** → qurish.
> Namuna: `BRIDGE-B1-KimUchun.md` · Manba darslar: `2-Modull/PmLesson5.jsx` (Dekompozitsiya), `2-Modull/PmLesson6.jsx` (Sistemani pitch qilish).

## 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | React'ga qo'shiladigan o'quvchi (3 darsning 3-si, oxirgisi) |
| Mavzular | Dekompozitsiya — birinchi versiya (MVP) · Sistemani kod bilmaydigan odamga tushuntirish (pitch) |
| Maqsad | O'quvchi o'zi tanlagan g'oyani bo'laklarga bo'lib, **birinchi versiyaga 3 ta bo'lak** tanlaydi va uni **kod bilmaydigan odamga 5 gapda** tushuntiradi |
| Misol-ip | **eMaktab — ilgari Kundalik.com** (tekshirildi 2026-09-23: 2023-yildan `emaktab.uz`, odamlar hali ham «Kundalik» deydi) — «agar biz uni noldan qursak»: bo'laklar → birinchi versiya → buviga tushuntirish. Ekranda nom: birinchi ko'rinishda «eMaktab (Kundalik)», keyin «eMaktab». Tinglovchi: nabirasining bahosini bilmoqchi bo'lgan buvi |
| Keys | K3 Instagram — «Burbn'dan uchta narsa qoldi» (faqat bank-faktlari: Burbn'da chekinlar (joy belgilash), rejalar, foto va yana ko'p narsa bor edi · uni deyarli hech kim ishlatmadi · asoschilar odamlarga yoqqanidan boshqa hammasini olib tashladi: foto + filtr + izoh · 2010-yil oktabr, birinchi kunda 25 000 ro'yxatdan o'tish). **Ekranda sana va 25 000 raqami aytilmaydi** — foydalanuvchi qarori 23:02: darsning asosiy fikriga xizmat qilmaydi |
| O'z ishi | Oldingi darsdagi karta ochiladi (kim · muammo · 2 yechim) → bo'laklar ro'yxati → 🔥 birinchi versiya (3) → 5 gapli tushuntirish |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

## 2. Darsning uch asosiy fikri

1. **Katta ish bo'lakdan boshlanadi.** Yaxshi bo'lak — alohida qilib tugatsa bo'ladigan ish: boshi va oxiri ko'rinadi.
2. **Birinchi versiyaga saytning asosiy ishiga kerak va tez tayyor bo'ladigan bo'laklar kiradi — mashq shartida bir haftaga uchtasi sig'adi.** Qolgani o'chirilmaydi, navbati keyin keladi.
3. **Kod bilmaydigan odamga avval uning foydasi aytiladi, kasbiy so'z tanish so'zga almashadi, saytning ichi o'xshatish bilan tushuntiriladi.**

Ip-zanjir: **eMaktabni bo'laklaymiz → uchtasini tanlaymiz → buviga tushuntiramiz → o'z g'oyamizga xuddi shunday.**

> **eMaktab halolligi (tekshirildi 2026-09-23, emaktab.uz):** saytda haqiqatan bor bo'limlar — **baholar (kunlik, chorak, yillik) · uyga vazifa va muddati · dars jadvali va o'zgarishlari · davomat va kechikish**; ota-onalar uchun alohida Kundalik.Family ilovasi bor. 1-ekrandagi to'rt variant va 3-ekrandagi birinchi to'rt bo'lak shulardan. Qolgan to'rt bo'lak (ota-onaga xabar · o'qituvchi bilan yozishuv · o'rtacha baho grafigi · e'lonlar) — **bizning taklifimiz**, «noldan qursak» ro'yxatining qismi; ular eMaktab'da bor deb aytilmaydi. Platforma tarixi, raqamlari, «birinchi versiyasi qanday bo'lgan» — aytilmaydi. Butun mashq ochiq faraz: «Agar eMaktabni biz noldan qursak». Ekran matnlarida «eMaktab» (birinchi ko'rinishda «eMaktab (Kundalik)») — 23:02 da almashtirildi; «qog'oz kundalik» (kichik harf) — o'xshatish, qoladi.

---

## 3. Ekranlar

### KIRISH

**1 · Hook** — ovoz berish (hamma javob to'g'ri)
- Sarlavha: «eMaktab (Kundalik) saytini noldan qursangiz, birinchi kuni faqat bitta bo'lak tayyor bo'ladi. Qaysi bo'lakdan boshlaysiz?»
- Variantlar: Baholarni ko'rish · Dars jadvalini ko'rish · Uyga vazifani ko'rish · Davomatni ko'rish
- Javob (ovozdan keyin): «Javoblar turlicha chiqdi. Qaysi birini tanlamang, sayt birinchi kuniyoq kimgadir foyda beradi. Demak, katta sayt bitta bo'lakdan ham boshlanishi mumkin. Qaysi bo'lakdan — buni bugun o'rganamiz.» (§119: har to'rt tanlov rostdan ham yakka o'zi foyda beradi — hech biri yolg'onga chiqmaydi) bu yoki: «To'rtta javobning hammasi to'g'ri. Muhimi — birinchi kuni kimdirga foyda beradigan bitta bo'lim ishlashi. Bugun shunday bo'limlarni qanday tanlashni o'rganasiz.» ni qoy 1 tasin halol oylab

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «O'zingiz tanlagan g'oyani bo'laklarga bo'lasiz va birinchi versiyasida ishlaydigan uchtasini tanlaysiz — ya'ni sayt ochilgan kuni ishlaydigan qismini. Keyin shu g'oyani kod bilmaydigan odamga besh gapda tushuntirasiz.»
- Vizual: katta «eMaktab» kartasi 8 bo'lakka sochiladi → uchtasi 🔥 ga tushadi → pastda besh gapli tushuntirish o'z-o'zidan yozilib chiqadi.

### 1-QISM · BIRINCHI VERSIYA

**3 · Bo'laklaymiz** — bosib ochish
- Sarlavha: «eMaktab saytini noldan qurish — bitta katta ishmi yoki bir nechta kichik ishmi?»
- Bitta karta «eMaktab saytini qurish» → bosilsa 8 bo'lakka bo'linadi: Baholarni ko'rish · Dars jadvalini ko'rish · Uyga vazifani ko'rish · Davomatni ko'rish · Ota-onaga xabar · O'qituvchi bilan yozishuv · O'rtacha baho grafigi · E'lonlar.
- Kartalar ostida kichik yozuv: «Bu ro'yxat mashq uchun tuzildi. Saytni noldan qursak, uni shunday bo'laklarga ajratishimiz mumkin.»
- Xulosa: «Katta saytni birdaniga qurmaymiz. Avval uni alohida bo'laklarga ajratamiz, keyin birma-bir qurib tugatamiz. Katta ishni shunday bo'laklarga bo'lish **dekompozitsiya** deyiladi.»

**4 · Tugatsa bo'ladimi?** — 4 karta, bosib tekshirish
- Sarlavha: «Qaysi bo'lakning oxiri ko'rinadi?»
- Kartalar: «Baholarni ko'rish» ✓ («Boshlanishi ham, tugashi ham aniq») · «Davomatni ko'rish» ✓ («Boshlanishi ham, tugashi ham aniq») · «Saytni chiroyli qilish» ✗ («Bu juda umumiy ish: qaysi sahifani, nimani, qachongacha chiroyli qilish aniq emas») · «Hamma maktab ishlatsin» ✗ («Bu bajariladigan bo'lak emas, natija. Avval saytni ishlaydigan qilib qurish kerak»).
- Xulosa: «Yaxshi bo'lakning boshlanishi ham, tugashi ham aniq.»

**5 · TEST-1** (ball)
- Lead: «eMaktab ustida ishlayapsiz.» Cue: «Qaysi ishni boshqa ishlarni bajarmasdan ham tugatish mumkin?»
- ✓ Bugungi dars jadvalini ko'rsatish · Saytning butun ishini qurish · Saytni chiroyli qilib bezash · Saytni ko'proq maktabga tanitish
- Reveal (✓): «To'g'ri. "Bugungi dars jadvalini ko'rsatish" — chegarasi aniq kichik ish: uni alohida bajarib, natijasini ko'rish mumkin. Boshi ham, oxiri ham ko'rinadi.»
- Xato: «butun ish» — «Bu butun ishning o'zi. Uni avval bo'laklarga bo'lish kerak.» · «chiroyli» — «Bu juda umumiy ish: qaysi sahifani, nimani, qachongacha — aniq emas.» · «tanitish» — «Bu natija, ish emas. Uni sayt ustida o'tirib tugatib bo'lmaydi.»

**6 · Tarozi — ikki savol** — demo
- Sarlavha: «Qaysi bo'lak birinchi versiyaga kiradi — buni qanday bilamiz?»
- «Ota-onaga xabar» bo'lagi tarozida. 1-savol: «Bu bo'laksiz sayt o'z asosiy ishini qila oladimi?» → Ha · Yo'q. 2-savol: «Bu bo'lakni qancha vaqtda tayyorlash mumkin?» → Bir-ikki kun · Bir haftadan ko'p. Javobga qarab bo'lak o'z joyiga tushadi: 🔥 Birinchi versiya · ⚡ Keyingi versiya · 🌱 Keyinga qoldirilganlar.
- Har joyning izohi (bo'lak tushgach chiqadi): 🔥 «Saytning asosiy ishi shu bo'laksiz bajarilmasa va uni tez tayyorlash mumkin bo'lsa — bo'lak birinchi versiyaga kiradi.» · ⚡ «Bu bo'lak kerak, lekin tayyorlash ko'proq vaqt oladi. Uni keyingi versiyaga qoldiramiz.» · 🌱 «Sayt bu bo'laksiz ham ishlaydi. Uni hozir emas, keyinroq qilamiz.»
- Muhim izoh (harakatdan keyin, hamma holatda): «Keyinga qoldirish — keraksiz deb tashlab yuborish degani emas. Faqat uning navbati keyin keladi.»

**7 · Keys: Instagram** — bashorat + 3 slayd
- Sarlavha: «Burbn ilovasida ko'p narsa bor edi. Odamlarga yoqqan nimalar qoldi?»
- Bashorat: «Instagram asoschilari avval Burbn degan ilova qilgan. Unda ko'p narsa bor edi: joy belgilash, reja tuzish, surat va yana boshqalar. Odamlarga undagi qaysi narsa yoqqan?» — Joy belgilash · Reja tuzish · Surat qo'yish
- Slaydlar:
  1. «Burbn'da ko'p narsa bor edi, lekin uni ishlatadiganlar juda kam edi.»
  2. «Jamoa odamlar eng ko'p yoqtirgan qismlarni qoldirdi: surat, filtr va izoh.»
  3. «Shu kichik ilova Instagram nomi bilan chiqdi — bugun hamma biladigan Instagram.»
- Ko'prik: «Instagram birinchi kuni uchta narsa bilan chiqdi — bu uning **birinchi versiyasi** (MVP). Birinchi versiyada hamma narsa emas, eng kerakli bo'laklar bo'ladi.»

**8 · TEST-2** (ball)
- Lead: «eMaktab bo'laklari tarozidan o'tdi.» Cue: «Birinchi versiyaga qaysi bo'laklar kiradi?»
- ✓ Saytning asosiy ishi uchun zarur va qisqa vaqtda tayyor bo'ladigan bo'laklar · Tez tayyor bo'ladigan, lekin saytning asosiy ishiga kerak bo'lmagan bo'laklar · Saytning asosiy ishiga kerak, lekin uzoq vaqtda tayyor bo'ladigan bo'laklar · Boshqa maktab saytlarida allaqachon bor bo'lgan barcha bo'laklar
- Reveal (✓): «To'g'ri. Tarozining ikkala savoliga javob "kerak va tez" bo'lsa — bo'lak birinchi versiyaga kiradi.»
- Xato: «tez, lekin kerak emas» — «Tez tayyor bo'lishi yetarli emas. U saytning asosiy ishiga kerak bo'lishi ham kerak.» · «kerak, lekin uzoq» — «Bu bo'lak foydali, lekin birinchi versiyani kechiktiradi. Uni keyingi versiyaga qoldiramiz.» · «boshqa saytlarda bor» — «Boshqa saytda borligi hech narsani hal qilmaydi. Savol boshqa: busiz sayt o'z ishini qila oladimi?»

**9 · Birinchi versiya ro'yxati** — sudrash + simulyatsiya
- Sarlavha: «eMaktab saytining birinchi versiyasida qaysi uchta bo'lak ishlaydi?»
- Lead: «Bu mashqda shart shunday: saytni bir kishi bir hafta ichida ishga tushiradi. Shuning uchun eng kerakli va tez tayyor bo'ladigan 3 ta bo'lakni tanlaymiz.»
- 8 bo'lak tarozidan o'tadi (har biriga 2 savol) → o'quvchi 🔥 da faqat 3 ta qolguncha suradi. Keyin simulyatsiya **o'quvchi tanlagan uchta bo'lak bilan**: «Sayt ochildi. O'quvchi kirdi: {1-bo'lak} ✓ · {2-bo'lak} ✓ · {3-bo'lak} ✓. Sayt ishlaydi.»
- 🔥 da 4 ta qolsa: «Bir haftaga uchtasi sig'adi. Qaysi birini keyingi versiyaga o'tkazasiz?»
- Xulosa: «Nega uchta? Bir haftada bitta odam uchta bo'lakni tugata oladi. Vaqt ko'proq bo'lsa, son ham boshqacha bo'lardi.»

**10 · O'z birinchi versiyangiz** — ustaxona
- Sarlavha: «Tanlagan g'oyangizning birinchi versiyasida nimalar ishlaydi?»
- Lead: «Endi shu qoidani o'z g'oyangizga qo'llang.»
- Oldingi darsdagi karta ochiladi: 2 yechim tayyor bo'lak bo'lib turadi. O'quvchi yana 2–4 bo'lak yozadi (jami 4–6) → har birini tarozidan o'tkazadi → 🔥 da ko'pi bilan 3 ta. Karta bo'lmasa — 1-darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim) tanlov bo'lib chiqadi, tanlagach 4 bo'lakni o'zi yozadi.
- Mentor (1 gap): «Oldingi darsda yozgan 2 yechimingizni bo'lak sifatida oling — keyin ularga yana 2–4 ta bo'lak qo'shing.»
- Shart-chiplari: «4–6 ta bo'lak» · «Hammasi tarozidan o'tdi» · «🔥 da ko'pi bilan 3»
- 🔥 da 4 ta qolsa — 9-ekrandagi gap.
- Saqlanadi: «✓ Birinchi versiya tanlandi».

### 2-QISM · KOD BILMAYDIGAN ODAMGA TUSHUNTIRISH

**11 · Tushunish chizig'i** — so'zma-so'z sahna
- Sarlavha: «Buviga eMaktabni tushuntiryapsiz. Qaysi so'zda u sizni tushunmay qoladi?»
- Gap so'zma-so'z chiqadi: «Baholar bazada saqlanadi, serverdan telefonga keladi.» Chiziq (yorlig'i: «Buvi qanchalik tushunyapti») tanish so'zda ko'tariladi, «bazada» va «serverdan» da tushadi. Mentor: «Chiziq tushgan so'zlarni bosing.»
- Xulosa: «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tinglovchi biladigan oddiy so'z bilan almashtiring. Buviga shunday deysiz: "Baholar maktab jurnaliga yoziladi va siz ularni telefonda ko'rasiz."»

**12 · TEST-3** (ball)
- Lead: «Buvi faqat bitta narsani bilmoqchi: nabirasining baholari qanday.» Cue: «Qaysi gapdan boshlasangiz, u oxirigacha tinglaydi?»
- ✓ Endi nabirangizning bahosini telefoningizda ko'rasiz · Sayt uchta bo'lakdan qurildi, hammasi yaxshi ishlaydi · Baholar bazada turadi, sahifa ularni ekranga chiqaradi · Men bu saytni bir hafta davomida o'zim qurib chiqdim
- Reveal (✓): «To'g'ri. Birinchi gapda buvi bilmoqchi bo'lgan narsa turibdi. Sayt nimadan qurilgani — keyin.» *(qoida «avval tinglovchi oladigan foyda» shu yerda ochiq aytiladi)*
- Xato: «uchta bo'lakdan» — «Bu sayt qanday qurilgani haqida. Buvi esa bahoni bilmoqchi.» · «bazada» — «"Baza" — kasbiy so'z. Buvi aynan shu yerda tushunmay qoladi.» · «o'zim qurdim» — «Bu gap siz haqingizda. Mehnatingizni oxirida aytsangiz ham bo'ladi.»

**13 · Sayt ichida nima bo'ladi — o'xshatish** — juftlash
- Sarlavha: «Sayt ichida nima bo'lishini buviga nimaga o'xshatib tushuntirasiz?»
- Saytning uch qismi: Ko'rinadigan qism · Saytning ishlashi · Ma'lumot saqlanadigan joy. O'xshatishlar: qog'oz kundalikning sahifasi · sinf rahbari jurnaldan bahoni topib, kundalikka yozishi · maktab jurnali. Chalg'ituvchilar: «server» · «ma'lumotlar bazasi» — ular qo'yilsa: «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- To'g'ri juftlangach to'liq gap chiqadi: «Ko'rinadigan qism — qog'oz kundalikning sahifasiga o'xshaydi.» · «Saytning ishlashi — sinf rahbari jurnaldan bahoni topib, kundalikka yozishiga o'xshaydi.» · «Ma'lumot saqlanadigan joy — maktab jurnaliga o'xshaydi.»
- Xulosa: «Yaxshi o'xshatish tinglovchining o'z hayotidan olinadi.»

**14 · TEST-4** (ball)
- Lead: «Do'stingiz futbol to'garagiga qatnaydi, kod bilmaydi.» Cue: «Unga "ma'lumot saqlanadigan joy"ni qanday tushuntirasiz?»
- ✓ Murabbiyning daftari kabi — kim nechta gol urgani shu yerga yoziladi · Serverning xotirasi kabi — ma'lumot shu yerda saqlanib turadi · Ma'lumotlar bazasi kabi — hamma saytlarda xuddi shunday bo'ladi · Saytning ichki qismi kabi — uni tushunib o'tirish unchalik shart emas
- Reveal (✓): «To'g'ri. Murabbiyning daftarini do'stingiz har mashg'ulotda ko'radi — darrov tushunadi. Yaxshi o'xshatish tinglovchining hayotida bor narsadan olinadi.»
- Xato: «server» / «ma'lumotlar bazasi» — «Bu tushuntirish kerak bo'lgan kasbiy so'z, o'xshatish emas.» · «ichki qism» — «"Ichki qism" hech qanday aniq narsani ko'rsatmaydi.»

**15 · Besh gap** — ustaxona
- Sarlavha: «G'oyangizni kod bilmaydigan odamga besh gapda ayta olasizmi?»
- 5 maydon, yorliqlar bir xil savol shaklida, **avval tinglovchi va foydasi** (TEST-3 qoidasi): «Bu sayt kimga yordam beradi va ular endi nimaga erishadi?» · «Hozirgacha ular nimada qiynalardi?» · «Birinchi versiyada qaysi 3 ta bo'lak ishlaydi?» · «Saytning ishlashini tinglovchiga tanish nimaga o'xshatasiz?» · «Tinglovchidan keyin nima qilishini so'raysiz?» Birinchi ikki maydon kartadan namuna oladi, uchinchisi — 10-ekrandagi 🔥 bo'laklardan; o'quvchi tuzatishi mumkin.
- Maydon-namunalari kesim shaklida: «avtobus kutadigan o'quvchilar» + «avtobus qachon kelishini bilib, bekatda kutmaydi» · «avtobus qachon kelishini bilmay, bekatda turardi» · «avtobus qayerdaligini xaritada ko'rsatadi, qachon kelishini aytadi va kechiksa ogohlantiradi» · «bekatdagi jonli jadval» · «bir hafta sinab ko'rib, fikringizni ayting».
- Jonli tekshiruv: kasbiy so'z yozilsa qizil chiziq va «Bu kasbiy so'z. Uni tanish so'z bilan ayting.» O'xshatish maydonida «server/baza/kod» so'zi — «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- Beshta maydon besh gapga yig'iladi: «Bu sayt {kim}ga yordam beradi: endi ular {natija}. Hozirgacha ular {muammo}. Birinchi versiyada sayt {3 bo'lak}. Saytning ishlashi {o'xshatish}ga o'xshaydi. Sizdan bitta iltimos — {so'rov}.» Namuna bilan: «Bu sayt avtobus kutadigan o'quvchilarga yordam beradi: endi ular avtobus qachon kelishini bilib, bekatda kutmaydi. Hozirgacha ular avtobus qachon kelishini bilmay, bekatda turardi. Birinchi versiyada sayt avtobus qayerdaligini xaritada ko'rsatadi, qachon kelishini aytadi va kechiksa ogohlantiradi. Saytning ishlashi bekatdagi jonli jadvalga o'xshaydi. Sizdan bitta iltimos — bir hafta sinab ko'rib, fikringizni ayting.»
- Saqlanadi: «✓ Tushuntirish tayyor».

### AI BILAN

**16 · AI — tinglovchi rolida**
- Sarlavha: «Tushuntirishingizda qaysi so'z tushunarsiz qoldi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI buvi o'rnida tinglaydi va qaysi so'zni tushunmaganini aytadi. Gapni o'zgartirish yoki o'zgartirmaslikni siz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
  > «Siz kod umuman bilmaydigan odamsiz. Men sizga loyihamni tushuntiryapman: "{besh gap}". Javob bering: 1) Qaysi so'zlarni tushunmadingiz? 2) Menga qaysi bitta savolni berasiz? Tushuntirishni qayta yozmang, faqat shu ikki javobni bering.»
- «Nusxalash» → gemini.google.com → o'quvchi tushunilmagan so'zni o'zi almashtiradi, savolga javobni 15-ekrandagi maydonga o'zi qo'shadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda ikki narsa chiqadi: (1) o'quvchining besh gapida kasbiy so'zlar ro'yxati bo'yicha topilgan so'zlar belgilanadi (baza · server · API · kod · dizayn · interfeys · funksiya · sozlama); (2) 3 tayyor «buvi savoli» — «Buni telefonimda qanday ochaman?» · «Bu pullikmi?» · «Nabiramning bahosini qayerdan ko'raman?» — o'quvchi bittasini tanlab, javobini besh gapiga qo'shadi. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi (155-qonun).
- Qoida ekranda: «AI faqat qaysi so'z tushunarsiz ekanini aytadi, qayta yozmaydi. Qaysi so'zni almashtirishni siz hal qilasiz.»

### YAKUN

**17 · Sherigingizga ayting** — juftlik (ballsiz)
- Sarlavha: «Sherigingiz besh gapingizni tushunadimi?»
- Yo'riq: «Ekranga qaramay, besh gapingizni sherigingizga ayting. Sherigingiz buvi o'rnida tinglaydi va belgilaydi: 🙂 Tushundim · 😐 Qisman · 😕 Tushunmadim. Tushunmagan so'zini ham aytadi. Keyin almashasiz.»
- Yozish: «Sherigingiz tushunmagan so'zni va uning o'rniga nima deyishingizni bir qatorga yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — foydalanuvchi qarori: hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Dekompozitsiya nima? | Katta ishni alohida tugatsa bo'ladigan bo'laklarga bo'lish |
| Birinchi versiyaga qaysi bo'laklar kiradi? | Saytning asosiy ishiga kerak va tez tayyor bo'ladiganlar |
| Keyinga qolgan bo'lak nima bo'ladi? | O'chirilmaydi — navbati keyin keladi |
| Kasbiy so'zni nima qilasiz? | Tinglovchi biladigan oddiy so'z bilan almashtirasiz |
| Tushuntirish qaysi gapdan boshlanadi? | Tinglovchi oladigan foydadan |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), ikkala mavzudan teng, ekran savollarining nusxasi emas — boshqa vaziyat (o'yin ilovasi, sinf chati, futbol jamoasi sayti) (§144).
- Yakun — 3 qator:
  - Katta ish bo'lakdan boshlanadi.
  - Birinchi versiyada eng kerakli va tez tayyor bo'ladigan bo'laklar bo'ladi.
  - Kod bilmaydigan odamga avval uning foydasini aytasiz, kasbiy so'zsiz.
- Mentor og'zaki: «React modulida shu bo'laklarni birma-bir qurishni o'rganasiz.»

---

## 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 5 · 8 · 12 · 14 — har biri o'z nazariyasidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Piece by Piece!** (3) — «eMaktabni sakkiz bo'lakka ajratdingiz» · **Launch List!** (9) — «Birinchi versiyaga uchta bo'lak tanladingiz» · **First Version!** (10) — «O'z g'oyangizning birinchi versiyasini tanladingiz» · **Plain Words!** (15) — «Besh gapni kasbiy so'zsiz yozdingiz» |

## 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| Birinchi versiya | 3–10 | 33 |
| Kod bilmaydigan odamga | 11–15 | 27 |
| AI + sherik | 16–17 | 12 |
| Yakun | 18–20 | 8 |
| Bufer | | 5 |

## 6. Kelishib olinadigan joylar

1. **Tinglovchi — buvi.** Kod bilmaydigan odam sifatida real va o'smirga tanish. Ma'qulmi, yoki «ota-ona» bo'lsinmi? *(Metodist: ekranda «buvingiz» emas, «buvi» — hamma o'quvchining buvisi hayot bo'lmasligi mumkin.)*
2. **10-ekranda oldingi darsdagi 2 yechim tayyor bo'lak bo'lib keladi.** Karta bo'lmasa (boshqa kompyuter) — o'quvchi 4 bo'lakni o'zi yozadi. *(Metodist: bu holatda g'oya qayerdan olinadi — B1 dagi 4 tayyor g'oya shu yerda ham chiqsinmi? Jurnal D-3.)*
3. **16-ekranda AI qayta yozmaydi, faqat «tushunmadim» deydi** — bu 1-darsdagi AI qadamidan farq qiladi (u yerda AI variant taklif qilardi). Ikki xil AI-roli o'quvchiga AI dan turlicha foydalanishni ko'rsatadi. Qolsinmi?
4. **Mentorning yakuniy gapi** («React modulida…») — faqat React'ga kirayotgan o'quvchi uchun; bu dars boshqa o'tishda ishlatilmaydi, shuning uchun mos.

**Metodist e'tirozlari bo'yicha qarorlar (2026-09-23):**
- D-1 eMaktab nomi — ✅ tekshirildi, yuqorida.
- D-2 «deyarli hech kim ishlatmadi» — ✅ qoladi: bank «hech kim ishlatmadi» va «odamlarga yoqqan narsa» ni birga aytadi, «deyarli» shu ikkisini rost qiladi.
- D-3 kartasi yo'q o'quvchi — ✅ 10-ekranda 1-darsdagi 4 tayyor g'oya (futbol · o'yin · sinf · kiyim) tanlov bo'lib chiqadi, tanlagach 4 bo'lakni o'zi yozadi.
- D-4 TEST-4 ipdan chiqadi — ✅ qoladi (yangi vaziyatda sinash, 1–2-dars bilan bir qoida).
- D-5 TEST-2 qoida parafrazi — ✅ quruvchiga: 6-ekran qoidasi 9-ekran sudrashi tugaguncha yig'ma (yopiq) turadi.
- D-6 16-ekran uzunligi — so'rov o'quvchi ustida ishlaydigan material, proza sanog'iga kirmaydi (ETALON 9-qonun aniqlashtirishi); yashirilmaydi — 1–2-dars bilan bir xil.
- D-7 gap tartibi — ✅ (b): birinchi gap «kim uchun va endi nimaga erishadi», yuqorida 15-ekranda kiritildi.
- D-8 «(MVP)» qavsda — ✅ qoladi: atama birinchi ko'rinishda o'zbekcha nom + original qavsda (til qonuni).

**Foydalanuvchi qarorlari (2026-09-23 20:40, `feedback/F-0923-bridge/SAVOLLAR_2026-09-23.md` 1-bo'lim — «hammasiga tavsiyang bo'yicha»):**
- 1.1 Tinglovchi — **(a) buvi qoladi** (11–13, 17-ekran o'zgarmaydi; ekranda «buvi», «buvingiz» emas).
- 1.2 AI roli — **(a) faqat sinaydi**: qaysi so'z tushunarsiz + bitta savol, qayta yozmaydi (16-ekran o'zgarmaydi). 1-darsdagi «taklif qiladi» rolidan farq ataylab qoladi.
- 1.3 Men yopgan bandlar (deyarli · besh gap tartibi (b) · kartasiz o'quvchiga 4 tayyor g'oya · (MVP) qavsda · 16-ekran so'rovi sanoqsiz · eMaktab ekranlari qurishda tekshiriladi) — e'tiroz yo'q, tasdiqlandi.
- Senariy **GATE S dan o'tdi** — qurish navbatini kutadi (1-dars pilotdan keyin).

---

**Foydalanuvchi ko'rigi (2026-09-23 22:54 o'zi tahrirladi · 23:02 fidbek kiritildi):**
- O'zi yozgan: 1-ekran hook sarlavhasi («eMaktab saytini noldan qursangiz…») · 3-ekran sarlavhasi. Hookdagi «bo'lim» → «bo'lak» (darsda bir so'z — bir tushuncha; «bo'lim» 4-o'tish 3-darsida boshqa ma'noda), birinchi ko'rinishda «eMaktab (Kundalik)».
- Fidbek bo'yicha kiritildi: **3** ro'yxat-izohi «mashq uchun tuzildi» + xulosa «avval ajratamiz, keyin birma-bir tugatamiz» · **4** «chiroyli qilish» izohi (umumiy ish: qaysi sahifa, nima, qachongacha) · **5** cue «boshqa ishlarni bajarmasdan ham», variantlar soddalashdi, reveal «chegarasi aniq kichik ish» · **6** sarlavha va ikki savol («asosiy ishini qila oladimi?» · «qancha vaqtda tayyorlash mumkin?»), uch joy izohi, «keyinga qoldirish — tashlash emas» qoldi, zona 🔥 «Birinchi versiya» · **7** sarlavha «nimalar qoldi?», 1-slayd yumshatildi, 2010/25 000 olindi, «Demak…» ko'prikka · **8** ✓ va ikki xato-izoh mezon bilan · **9** «birinchi versiyasida», mashq-sharti ochiq · **10** «birinchi versiyasida», mentor «2 yechimingizni bo'lak sifatida oling» · **11** qoida qisqa: «tinglovchi biladigan oddiy so'z bilan almashtiring» · **13** sarlavha «sayt ichida nima bo'lishini», «Saytning ishlashi» qismi, juftlangach to'liq gap · **14** reveal + xato-izoh · **15** beshta savol bir xil shaklda, qolip «Hozirgacha…», «Sizdan bitta iltimos —».
- Umumiy qoidalar (2-o'tish 2-darsidan): 16-ekran AI — maqsad-gap · so'rov yig'mada · «Gemini ochilmasa» zaxira (kasbiy so'z ro'yxati + 3 buvi-savoli) · flashcard 8 → 5.
- Halol izohlar (foydalanuvchiga aytildi): (a) 7-ekran 1-slayd — bankdagi «deyarli hech kim ishlatmadi» fakti «ishlatadiganlar juda kam edi» deb yumshatildi; foydalanuvchi taklif qilgan «hammasidan birdek foydalanmasdi» bankda yo'q — olinmadi. (b) 11-ekrandagi namuna-gap ataylab kasbiy so'zli («bazada», «serverdan») — chiziq tushishi uchun; «API» → «serverdan». Atama «texnik atama» emas, «kasbiy so'z» — 3-o'tish 3-darsi bilan bir xil. (c) «Birinchi versiya» so'zi endi 2-ekrandan boshlab ishlatiladi (foydalanuvchi 6/9/10-ekran talabi), 7-ekranda unga (MVP) qo'shiladi.
- Senariy **GATE S dan o'tdi**.

## Korrektura-jurnali (pm-metodist, 2026-09-23)

Tuzilma, ekran soni (20), mexanika, ball-joylari (5 · 8 · 12 · 14) o'zgarmadi. Variantlarda ✓ birinchi yozilgan — qurishda pozitsiyani Jonli aralashtiradi. Asl v1 nusxasi: scratchpad `B3-v1-orig.md`.

### A. Tuzatishlar (❌ → ✅ · sabab)

| # | Ekran | ❌ edi | ✅ bo'ldi | Sabab |
|---|---|---|---|---|
| 1 | 7 bashorat | «…joy belgilash, uchrashuv rejasi, foto, **xabar** — hammasi bitta ilovada. Odamlar undan nimani ishlatardi?» | «Unda ko'p narsa bor edi: joy belgilash, reja tuzish, foto va yana boshqalar. Odamlarga undagi qaysi narsa yoqqan?» | **§101 keys-sadoqat:** bankda «xabar» ham, «uchrashuv» ham yo'q (bank: chekinlar · rejalar · foto · «ko'p funksiya»). «Xabar» manba-darsdan (PmLesson5 `K3_SLIDES`) ko'chib kelgan — u yerda ham bankdan tashqari. Savol bank fe'liga («odamlarga yoqqan») o'tdi |
| 2 | 7 slaydlar | «odamlar **faqat foto qo'yardi**» → «qolganini o'chirib…» | 1) «…ko'p narsa bor edi, lekin uni deyarli hech kim ishlatmadi.» 2) «…odamlarga yoqqan narsani qoldirib, qolganini olib tashladi. Uchta narsa qoldi: foto, filtr va izoh.» 3) «Shu ilova 2010-yil oktabrda Instagram nomi bilan chiqdi…» | «faqat foto qo'yardi» bankda yo'q (bank: yoqqani — foto + filtr + izoh). «hech kim ishlatmadi» bank so'zi qaytdi. **«deyarli»** — bankning o'z ichidagi ziddiyatni (hech kim ishlatmadi ↔ odamlarga yoqqan narsa) yumshatadi; bahsli, D-2. Pasport «Keys» qatori ham bank bilan tekislandi |
| 3 | 7 ko'prik | «Birinchi versiya — eng kam, lekin ishlaydigan. Ko'p narsa emas, kerakli narsa.» | «Instagram birinchi kuni uchta narsa bilan chiqdi. Ochilish kuni ishlaydigan shunday eng kam bo'laklar **birinchi versiya** (MVP) deyiladi.» | **§104/§168:** bosh atama kesik belgi-qurilmada tug'ilardi (ETALON 43); endi hodisa (Instagram) → ta'rif-gap. Atama-format: original qavsda. «Ochilish ro'yxati» (6-ekran zonasi) bilan bog'landi — bir tushunchaga ikki nom ko'priksiz qolmaydi (§156) |
| 4 | 2 | «**G'oyangizni** … birinchi **versiyaga** uchtasini tanlaysiz» · vizual «5 **bo'lakli** tushuntirish» | «O'zingiz tanlagan g'oyani … birinchi kuni ishlaydigan uchtasini tanlaysiz. Keyin shu g'oyani…» · «besh gapli tushuntirish» | §40 (g'oyasi yo'q o'quvchi bor); §126 bosh atama maqsad-ekranda emas; **§156:** «bo'lak» darsda dekompozitsiya bo'lagi — pitch qismlari ham «bo'lak» bo'lsa, bitta so'z ikki ma'noda. Pasport «O'z ishi» ham «5 gapli» |
| 5 | 1 variantlar | Baholar · Dars jadvali · Uyga vazifa ro'yxati · Davomat (7/12/20/7) | Baholarni ko'rish · Dars jadvalini ko'rish · Uyga vazifani ko'rish · Davomatni ko'rish (17/22/21/17) | §21 teng og'irlik (2.86× → 1.29×); nomlar 3-ekrandagi 8 bo'lak bilan so'zma-so'z bir xil (sanoq-mosligi) |
| 6 | 1 payoff | «…lekin hech kim "hammasi birdan" demadi. Katta narsa bitta bo'lakdan boshlanadi.» | «Qaysi birini tanlamang, sayt birinchi kuniyoq kimgadir foyda beradi. Demak, katta sayt bitta bo'lakdan ham boshlanishi mumkin.» | **§119 (vazifa 5-band):** «hech kim demadi» — rost, lekin **soxta kashfiyot**: variantlarda «hammasi» yo'q edi, uni hech kim ayta olmasdi. Bola buni sezadi («bunday tugma yo'q edi-ku»). Yangi payoff har to'rt tanlovga bir xil rost (har bo'lak yakka o'zi ham foydali) va hech birini rad etmaydi |
| 7 | 1 sarlavha | «Kundalik'ni siz qursangiz va birinchi kuni … ishlasa — qaysi biri?» | «Kundalikni siz qurdingiz, lekin birinchi kuni unda faqat bitta narsa ishlaydi. Qaysi biri bo'lsin?» | ikki shart-ergash bitta gapda (§0-3); **«Kundalik'ni» → «Kundalikni»** butun faylda: o'zbekcha so'z — apostrof kerak emas, faylda ikki shakl aralash edi |
| 8 | 3 | sarlavha «Kundalik — bitta ishmi yoki sakkizta?»; faraz ekranda yo'q; xulosa «Bitta katta ishni bir odam bir haftada tugata olmaydi. Sakkiz bo'lakning har birini — tugata oladi.» | sarlavha «Kundalikni noldan qursak — bu bitta ishmi yoki sakkizta?»; kartalar ostida «Bu ro'yxatni biz o'zimiz tuzdik…»; xulosa «Butun saytni birdaniga qurib bo'lmaydi. Bo'laklarni esa birma-bir qurib tugatsa bo'ladi. … **dekompozitsiya** deyiladi.» | **real mahsulot (vazifa 4-band):** faraz faqat reja-hujjatda edi, ekranda yo'q — bola 8 bo'lakni Kundalikning haqiqiy rejasi deb eslab qolardi. Eski xulosa 9-ekranga zid edi («har biri bir haftada» ↔ «bir haftaga uchtasi sig'adi»); §104 ta'rif-gap |
| 9 | 4 kartalar | «Baholar ro'yxati» · «Davomat» · «(qayerda tugaydi?)» · «bu ish emas, orzu» | «Baholarni ko'rish» · «Davomatni ko'rish» · «(qachon tugaydi?)» · «bu ish emas, natija» | 3-ekran nomlari bilan bir xil (§156); «qayerda» — vaqt savoli; «natija» — manba PmLesson5 va TEST-1 xato-izohi bilan bir so'z |
| 10 | 5 TEST-1 | «**Quyi**dagilardan qaysi biri…» · ✓ «…ko'rsatadigan **sahifa**» (ot) ↔ uch «-ish» · «**butunlay** · **juda** · **butun** shaharga» | lead «Kundalik ustida ishlayapsiz.» + cue «Qaysi ishni alohida qilib, oxirigacha tugatsa bo'ladi?» · to'rttasi «-ish» shaklida · mutlaq so'z bitta («hamma») | «quyidagi» — kantselyarit (§136); **shakl-telli:** yolg'iz ot-birikma to'g'ri javobni ko'rsatardi (§147 oilasi, §99 variant savol shaklida); **§110:** uch distraktorda mutlaq so'z, ✓ da yo'q — bilmagan bola ham topardi. Reveal/xato-izohlar yozildi (manba PmLesson5) |
| 11 | 6 | «Buni qurish…» — javob-variantlari yo'q; zona «🌱 Keyinga»; qoida «Kerak va tez — ochilishga. … Qulay, lekin shart emas — keyinga.» | variantlar «Ha · Yo'q» / «Bir-ikki kun · Bir haftadan ko'p»; «🌱 Keyinga qoldirilganlar»; qoida to'liq gaplarda, tarozi savoli so'zlari bilan («Busiz sayt ishlamasa va tez qurilsa — …») | Quruvchi to'qimasin; «Keyinga» ↔ «Keyingi versiya» — deyarli bir so'z (§156); **«qulay»** — tarozida yo'q uchinchi mezon edi; ETALON 43 belgi-qisqa ohang |
| 12 | 8 TEST-2 | ✓ «Busiz sayt birinchi kuni ish bermaydigan bo'laklar» · «Qurish **eng** oson…» · «…**eng** ko'p yoqqan» | ✓ «Busiz sayt ishlamaydigan va tez quriladigan bo'laklar» · «Tez quriladigan, lekin busiz ham sayt ishlaydigan…» · «Busiz sayt ishlamaydigan, lekin uzoq quriladigan…» · «Boshqa maktab saytlarida ham allaqachon bor…» | **halollik:** eski ✓ darsning o'z qoidasiga (6-ekran) ko'ra **chala** — kerak, lekin uzoq bo'lak keyingi versiyaga ketadi; eski «oson» distraktori esa qoidaning yarmi edi (ikkalasi ham yarim-rost). «yoqqan» distraktori 7-ekranda ROST bo'lib qolardi (Instagram odamlarga yoqqanini qoldirdi — §102). Yangi distraktorlar 6-ekran qoidasi ochiq rad etadi (§110 davomi); uzunlik 1.52× → 1.11× |
| 13 | 9 | «Bir haftaga uchta sig'adi» — hafta hech qayerda aytilmagan; simulyatsiya qat'iy «baho · jadval · vazifa»; xulosa «Uchta — chunki chegara vaqt, fikr emas.» | lead «Saytni bitta odam quradi, ochilishgacha bir hafta bor.»; simulyatsiya o'quvchi tanlagan uch bo'lak bilan; xulosa «Nega uchta? Bir haftada bitta odam uchta bo'lakni tugata oladi. Vaqt ko'proq bo'lsa, son ham boshqacha bo'lardi.» | sanoq manbasi ekranda (§95); **§139:** ekran o'quvchining harakatini ko'rsatsin — boshqa uchtani tanlagan bola «meniki emas» degan simulyatsiyani ko'rardi; «fikr emas» — 13 yoshli uchun mavhum; «uchta» qat'iy qoida bo'lib qolmasin (§173b) |
| 14 | 10 | sarlavha «**G'oyangizning** birinchi kunida…»; mentor va shart-yorliqlari yo'q | «Tanlagan g'oyangizning…»; mentor 1 gap; shart-yorliqlari «4–6 ta bo'lak» · «Hammasi tarozidan o'tdi» · «🔥 da ko'pi bilan 3» | §40; ETALON 25/32 (yozish-ekranda mentor ≤1 gap, shartlar chipda ≤4 so'z) |
| 15 | 11 sarlavha | «**Buvingizga** … Qaysi so'zda u sizni **tinglashdan to'xtaydi**?» | «**Buviga** … Qaysi so'zda u sizni **tushunmay qoladi**?» | «buvingiz» — hamma o'quvchida hayot buvi yo'q (6-bo'lim 1-band izohi; 12, 13-ekran ham); ekranda chiziq **tushunishni** o'lchaydi, tinglashni emas (ETALON 42 fe'l ↔ jarayon) |
| 16 | 11 xulosa | «Faqat kod yozadiganlar biladigan so'z — **kasbiy so'z**. … "bazada" **→** "maktab jurnalida", "API orqali" **→** "telefon o'zi olib keladi".» | «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tashlamaysiz, tanish so'z bilan almashtirasiz. Buviga shunday deysiz: "Baholar maktab jurnaliga yoziladi va telefonda ko'rinadi."» | §104 kesik qurilma; ETALON 43 strelka-formula; **§28:** «telefon olib keladi» — jonsiz narsaga odam-fe'li; namuna endi butun gap. Ekran 437 → 393 (lead olib tashlandi, buvi maqsadi TEST-3 lead'ida) |
| 17 | 12 TEST-3 | lead «Buvingizga birinchi versiyani ko'rsatyapsiz.» · cue «Qaysi gapdan boshlaysiz?» · uzunlik 64/48/51/41 | lead «Buvi faqat bitta narsani bilmoqchi: nabirasining baholari qanday.» · cue «Qaysi gapdan boshlasangiz, u oxirigacha tinglaydi?» · 52/53/54/52 | **kognitiv bosqich (S28):** «foyda birinchi» qoidasi test oldidan hech bir ekranda o'rgatilmagan — eski shartda «Sayt uchta bo'lakdan qurildi» ham himoyalanardi. Endi lead tinglovchining maqsadini beradi — javob mulohaza bilan chiqadi, qoida reveal'da tug'iladi (§106). Uzunlik 1.56× → 1.04× |
| 18 | 13 | «Uch **qatlam**» · «**baho qo'yadigan** sinf rahbari» · «kundalik daftarning sahifasi» | «Saytning uch qismi» · «jurnaldan bahoni topib, kundalikka ko'chirib yozadigan sinf rahbari» · «qog'oz kundalikning sahifasi» | **abrazets funksional (S24):** saytning ishlovchi qismi baho **qo'ymaydi** — bahoni o'qituvchi qo'yadi; u saqlangan joydan topib, ko'rinadigan joyga olib boradi. «qatlam» — uchinchi nom (bo'lak · qism · qatlam), keraksiz metafora (§165); «qog'oz» — Kundalik.com bilan omonimdan ajratadi |
| 19 | 14 TEST-4 | ✓ «Bu maktab jurnali kabi — baholar shu yerda yozib qo'yiladi» + buvi | lead «Do'stingiz futbol to'garagiga qatnaydi, kod bilmaydi.» · ✓ «Murabbiyning daftari kabi — kim nechta gol urgani shu yerga yoziladi» · to'rttasi «… kabi —» qolipida | **§106:** eski ✓ 13-ekran juftlashining so'zma-so'z nusxasi (va 11-ekran xulosasi) — test ko'chirtirardi. Yangi tinglovchi — qoidani («tinglovchining o'z hayotidan») ko'chirish sinovi. Distraktor «maktab jurnali» ataylab QO'YILMADI — futbolchi do'stga ham tanish, ikkinchi himoyalanadigan javob bo'lardi. D-4 |
| 20 | 15 | maydon-nomlari «Kim uchun · Qanday muammo · Nima qiladi · **Nega ishlaydi** · Nima **so'rayman**»; «Beshta maydon **bitta gapga** yig'iladi: «[kim] uchun sayt **qildim** — ilgari…; …; sizdan [so'rov].»» | yorliqlar savol shaklida («Sayt kim uchun?» … «U nimaga o'xshaydi?» · «Tinglovchidan nima so'raysiz?»); kesim-namunalar; **besh gapga** yig'iladi: «Bu sayt {kim} uchun. Hozir ular {muammo}. Birinchi versiyada sayt {nima qiladi}. U {o'xshatish} kabi ishlaydi. Sizdan iltimos: {so'rov}.» | **sanoq-mosligi (ETALON 22):** «besh gapda» va'da qilinib, bitta gap yig'ilardi; **§40:** «sayt qildim» — o'quvchi hali hech narsa qurmagan; «Nega ishlaydi» maydoni aslida o'xshatish so'rardi (§31 bo'lak nomi o'zini aytsin); §50 slot o'rniga savol; **§37:** B1/B2 karta-shakllari (KIM · QACHON + NIMASI OG'IR kesim) har juftlikda sinaldi — gap tugal chiqadi |
| 21 | 16 | sarlavha «…AI tushunadimi — sinab ko'ramizmi?»; so'rovda «[tinglovchi — karta **KIM**-maydoni yoki "buvi"] rolidasiz»; qoida «AI qayta yozmaydi — faqat qayerda tushunmaganini aytadi. Nima o'zgarishini…» | sarlavha «Tushuntirishingizda qaysi so'z tushunarsiz qoldi?»; «Siz kod umuman bilmaydigan odamsiz.»; «AI faqat qaysi so'z tushunarsiz ekanini aytadi, qayta yozmaydi. Qaysi so'zni almashtirishni siz hal qilasiz.» | ikki savolli sarlavha; **§37:** KIM «sinfdoshlarim» bo'lsa «Siz … sinfdoshlarim rolidasiz» — gap sinardi; lint `slot-ichki-atama` (error) yopildi; §173 qaror o'quvchiniki — fe'l aniq harakatga bog'landi |
| 22 | 17 | «**Sherikga** ayting»; «Ekransiz, yoddan: besh gapni sherigiga **aytadi**. Sherik hukm beradi: … Yarim …» | «Sherigingizga ayting» + sarlavha «Sherigingiz besh gapingizni tushunadimi?»; siz-forma yo'riq; «Sherigingiz **buvi o'rnida** tinglaydi»; «Qisman»; yozish-yo'rig'i aniq | imlo («sherik» + «-ga» → «sherikka»; siz-formada «sherigingizga»); siz-forma; sherik ham kod o'rganayotgan o'quvchi — «baza, API»ni tushunib qolishi mumkin, rol berilmasa tekshiruv ishlamaydi; «yarim» — so'zlashuv |
| 23 | 19 flashcard | ot-birikma oldlar; «Birinchi versiyaga nechta bo'lak — Uchta — chegara vaqt»; «Instagram'da nima qoldi»; bosh atama **dekompozitsiya** yo'q | savol-shakl oldlar; «Dekompozitsiya nima?» (1-karta, «yaxshi bo'lak» mezoni javobga kirdi); «Nega birinchi versiyada uchta bo'lak? — Bir haftaga shuncha sig'adi — chegara vaqt»; «Burbn'dan Instagram'ga nima o'tdi?» | darsning bosh atamasi takrorlanmasdi; «nechta» → «nega» — son emas, sabab o'rgatilgan (#13); sanoq 8 ta saqlandi |
| 24 | 20 | yakun «Birinchi versiya — eng kam, lekin ishlaydigan.» · «…foyda birinchi, kasbiy so'zsiz.» · mentor «…shu uchta bo'lakni **komponentlarga** bo'lib qurasiz.» · arena yo'nalishsiz | «Birinchi versiyada eng kam, lekin ishlaydigan bo'laklar bo'ladi.» · «…avval uning foydasini aytasiz, kasbiy so'zsiz.» · «React modulida shu bo'laklarni birma-bir qurishni o'rganasiz.» · arena: boshqa vaziyat (o'yin ilovasi, sinf chati, futbol jamoasi sayti) | §52 tugal gap; **ETALON 29:** «komponent» — keyingi modulning bosh atamasi (og'zaki bo'lsa ham) + «bo'lakni komponentlarga bo'lish» — noaniq model; §144 |
| 25 | 5/8/12/14 | reveal va xato-izohlar yo'q | har testga reveal + har distraktorga bir gap | Quruvchi to'qimasin; xato-izoh mezonni eslatadi, javobni aytmaydi (§175) |
| 26 | 4-bo'lim | nishonlar o'zbekcha tasvir | **Piece by Piece! · Launch List! · First Version! · Plain Words!** + siz-forma `desc` | nishon `name` faqat inglizcha (2026-07-16) |
| 27 | 7 sarlavha | yo'q | «Ko'p narsasi bor ilovadan nima qoldi?» | sarlavha = sinfga savol; 6-ekrandagi «qaysi bo'lak qoladi» savoliga ulanadi (§163) |

Ichki joylar ham kaskad bilan tekislandi: pasport «Maqsad» (§40) · «Keys» (bank) · «O'z ishi» («5 gapli»); 2-bo'lim uch fikri (tarozi ikki mezoni, «bir haftaga uchtasi sig'adi»); ip-zanjir; Kundalik-halollik qaydnomasi (shubhali bo'limlar ajratildi).

### B. Test-halollik o'lchovi (Intl.Segmenter, grapheme; ✓ birinchi)

| Ekran | Uzunliklar | max/min | ✓ / eng uzun distraktor | Oldin max/min |
|---|---|---|---|---|
| 1 hook (ballsiz) | 17 / 22 / 21 / 17 | 1.29× | — (to'g'ri javob yo'q) | **2.86×** |
| 7 bashorat (ballsiz; ✓ = Foto) | 13 / 11 / 12 | 1.18× | 1.08 | 1.29× |
| 5 TEST-1 | 39 / 35 / 42 / 36 | 1.20× | 0.93 | 1.30× |
| 8 TEST-2 | 53 / 59 / 58 / 53 | 1.11× | 0.90 | **1.52×** |
| 12 TEST-3 | 52 / 53 / 54 / 52 | 1.04× | 0.96 | **1.56×** |
| 14 TEST-4 | 68 / 61 / 63 / 69 | 1.13× | 0.99 | 1.21× |

- **3-vs-1 shakl (§147):** T1 — «Saytga …» ×2 (✓ bilan), «Saytni», «Kundalikni»; to'rttasi «-ish» bilan tugaydi. T2 — «Busiz …» ×2 (✓ bilan), «Tez», «Boshqa»; to'rttasi «… bo'laklar». T3 — to'rt xil ega (Endi/Sayt/Baholar/Men), guruh yo'q. T4 — to'rttasi «X kabi — …». Yolg'iz qolgan to'g'ri javob yo'q.
- **Mutlaq so'z (§110):** har testda ko'pi bilan bittada — «hamma» T1 · T2 da yo'q · «hammasi» T3 · «hamma» T4.
- **§102 (distraktor darsda rost emasmi):** T1 «hamma narsani qurish» · «chiroyliroq» · «tanitish» — 4-ekran kartalari rad etadi. T2 ikki distraktor — 6-ekran qoidasi ochiq rad etadi; «boshqa saytlarda bor» — hech bir ekranda mezon emas; eski «odamlarga yoqqan» 7-ekranda rost bo'lib qolgani uchun olindi. T3 «uchta bo'lakdan qurildi» — lead (buvi maqsadi) rad etadi; «bazada» — 11-ekran. T4 «server» · «baza» — 13-ekran chalg'ituvchilari; «ichki qism» — hech qayerda rost emas.
- **§106 (slayddan ko'chirish):** T1 ✓ «dars jadvali» 3-ekran bo'lagi, lekin 4-ekranda tekshirilmagan — mezonni qo'llash kerak. T2 ✓ 6-ekran qoidasining parafrazi, «ochilish ro'yxati» → «birinchi versiya» bog'lanishini 7-ekrandan olish kerak (eng zaif joy — D-5). T3 ✓ ↔ 11-ekran: faqat «telefon» so'zi umumiy. T4 ✓ — yangi vaziyat, darsda yo'q.
- **Bitta himoyalanadigan to'g'ri:** T2 da eski ✓ chala edi (#12) — endi ikkala mezon ✓ da. T3 da eski shartda «uchta bo'lakdan qurildi» ham himoyalanardi (#17). T4 da ikkinchi hayotiy o'xshatish ataylab qo'yilmadi (#19).
- **§119 (hook):** payoff har to'rt tanlovga («baho» · «jadval» · «vazifa» · «davomat») bir xil rost — har biri yakka o'zi ham kimgadir foyda beradi. Hech kim «demak, men xato ekanman» demaydi.

### C. Mexanik tekshiruvlar

- Kirill `grep -nP '[\x{0400}-\x{04FF}]'` → **0**.
- Qiyshiq apostrof (U+2018 · U+2019 · U+02BB) → **0**.
- Sen-forma grep → 1 topilma: 16-qator, pasport «Format» qatoridagi so'z o'zagi — soxta.
- Ichki jargon `yadro|artefakt|recap` → **0**; «Hook» — faqat ekran-yorlig'i.
- «Kundalik'» (apostrofli shakl) → **0** (butun fayl «Kundalikni/Kundalikning»).
- **Keys K3:** har gap bank bilan yonma-yon — Burbn · chekin (joy belgilash) · rejalar (reja tuzish) · foto · ko'p funksiya («yana boshqalar») · hech kim ishlatmadi («deyarli» — D-2) · yoqqanidan boshqasini tashladi · foto + filtr + izoh · Instagram · 2010-yil oktabr · birinchi kun · 25 000 ro'yxatdan o'tish. «Xabar», «uchrashuv», «faqat foto qo'yardi», «yangi nom» — olib tashlandi. Qo'shimcha fakt yo'q.
- **Sanoq-mosligi:** 8 bo'lak (1, 3, 9-ekran va 4-bo'lim nishoni — bir xil nomlar) · 3 ta 🔥 (9, 10, 2-vizual) · 5 maydon = 5 gap (15, 2-vizual, 16 so'rov «{besh gap}», 17) · 8 flashcard.
- **Ekran-hajmi (≤400, ko'rinadigan proza; material/variantlar sanalmaydi):** 1 ≈292 · 3 ≈304 · 6 ≈340 · 7 ≈302 (slaydlar navbat bilan) · 9 ≈351 · 11 ≈393 (edi 437) · 15 ≈168 + namunalar · 16 ≈383 + o'quvchining besh gapi → D-6 · 17 ≈322.
- `npm run lint:til pm-senariylar/BRIDGE-B3-BirinchiVersiya.md` → **0 error** (edi 1: `slot-ichki-atama`, 16-ekran so'rovidagi KIM-maydon ishorasi). Warn 7 ta, hammasi soxta (shu qatorning o'zi qoida-nomlarini iqtibos qilgani uchun 2 tasini qo'shadi): `zanjir-streak` ×3 (24-qator «Ip-zanjir» va jurnal-ichidagi «Sarlavha zanjiri»/ip-zanjir — ichki so'z, streak emas) · `kant-quyidagi` (jurnal #10 dagi ❌-iqtibos) · `sen-forma` (grep-tavsif qatori). O'quvchi ko'radigan matnda warn yo'q.

### D. Tuzilmaviy e'tirozlar (tuzatilmadi — foydalanuvchi/Quruvchiga)

1. **Kundalik.com hozirgi holati.** Metodist bilishicha, platforma so'nggi yillarda boshqa nom/manzilga o'tgan bo'lishi mumkin (eMaktab). Qurishdan oldin: (a) sayt hozir shu nom bilan ishlayaptimi — o'smir uni taniydimi; (b) 3-ekrandagi 8 bo'lakdan to'rttasi (ota-onaga xabar · o'qituvchi bilan yozishuv · o'rtacha baho grafigi · e'lonlar) saytda haqiqatan ko'rinadimi. Ko'rinmasa ham faraz-yozuv («ro'yxatni biz tuzdik») darsni halol saqlaydi, lekin 1-ekran hook'idagi to'rt variant (baho · jadval · vazifa · davomat) albatta real bo'lishi kerak.
2. **K3 «deyarli hech kim».** Bank bir vaqtda «hech kim ishlatmadi» va «odamlarga yoqqan narsa» deydi. «Deyarli» ikkalasini bog'laydi. Foydalanuvchi bank so'zini qat'iy xohlasa — 1-slayd «hech kim ishlatmadi», 2-slayd «asoschilar o'zlariga va do'stlariga yoqqan narsani…» emas (bu ham bankda yo'q), balki shu holicha qoladi; qaror kerak.
3. **Karta yo'q o'quvchi (6-bo'lim 2-band).** 10-ekranda kartasi yo'q o'quvchi 4 bo'lakni yozadi — lekin **qaysi g'oya uchun**? 15-ekrandagi birinchi ikki maydon ham kartadan tushadi. Taklif: B1 ning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim) shu yerda ham tanlov bo'lib chiqsin.
4. **TEST-4 ipdan chiqadi** (buvi → futbolchi do'st). Ataylab — 13-ekran juftlashi javobni so'zma-so'z berib qo'ygani uchun (§106). B1/B2 e'tiroz 3/7 bilan bir sinf (transfer-sinov). Qat'iy bitta ip kerak bo'lsa — 13-ekrandan «maktab jurnali» juftligini olib, testga qoldirish kerak (mexanika o'zgarishi).
5. **TEST-2 ↔ 6-ekran.** ✓ 6-ekran qoidasining parafrazi. Kuchliroq variant: 6-ekran qoidasi sudrash tugaguncha yig'ma bo'lib tursin, qoida-gap faqat test reveal'ida to'liq chiqsin (Quruvchi/Dizayn).
6. **16-ekran ≈383 + o'quvchining besh gapi (~250)** — 400 dan oshadi. B1 (17) va B2 (15) bilan bir sinf. Taklif: so'rov default-yopiq «So'rovni ko'rish» yig'masida.
7. **15-ekran gap-tartibi ↔ TEST-3 qoidasi.** TEST-3 «avval tinglovchi oladigan foyda» deydi, besh gap esa «Bu sayt {kim} uchun. Hozir ular {muammo}…» bilan boshlanadi — foyda 3-gapda. Manba PmLesson6 da ham shu tartib (u yerda birinchi gap «tinglovchi haqida» deb talqin qilinadi). Ikkita yo'l: (a) tartib qoladi, flashcard/reveal «birinchi gap tinglovchi haqida» deb yumshatiladi; (b) 1-gap «{kim} endi {nima qiladi}» qolipiga o'tadi (maydonlar tartibi o'zgaradi). Qaror kerak.
8. **«MVP» qavsda (7-ekran).** Atama-format bo'yicha qo'shildi; React-bridge o'quvchisi uchun ortiqcha yuk deb topilsa — olib tashlanadi, dars «birinchi versiya» bilan to'liq ishlaydi.
9. **6-ekran demo bo'lagi «Ota-onaga xabar»** — D-1 dagi shubhali bo'limlardan biri. Real bo'lim tasdiqlanmasa, demo uchun «Davomatni ko'rish» olinsin.
