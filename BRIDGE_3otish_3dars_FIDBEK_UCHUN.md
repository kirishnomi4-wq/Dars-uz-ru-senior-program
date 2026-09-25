# 3-o'tish (Node.js) · 3-dars — «Qanday ko'rsatamiz?»

> **Fidbek uchun toza nusxa (2026-09-23).** Misol-ip: eMaktab kabi saytni biz noldan qursak — ota-onalar yig'ilishida ko'rsatish. Keys: Airbnb'ning birinchi taqdimoti.
> Bu dars **taksi, User Story, MVP, prioritet haqida EMAS** — ular 3-o'tish 2-darsida. Bu darsda: kasbiy so'z · birinchi gap · o'xshatish · Airbnb tartibi · ekran va gap · uch kadrli ko'rsatuv · bosiladigan joy.
> Test variantlarida to'g'ri javob (✓) birinchi yozilgan — darsda aralashtiriladi. 19 ekran, 90 daqiqa.
> Fikr berish: ekran raqami + nima o'zgarsin.

### 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node.js (Express) darslariga o'tadigan o'quvchi (3 darsning 3-si, oxirgisi; «Kim uchun, qanday muammo» va «Nima quramiz» dan keyin) |
| Mavzular (2 + 2) | Sistemani kod bilmaydigan odamga tushuntirish (kasbiy so'z · birinchi gap · o'xshatish · Airbnb tartibi) · Ko'rsatuv (ekran va gap · uch kadr · bosiladigan joy) |
| Maqsad | O'quvchi o'z g'oyasini kod bilmaydigan odamga **besh gapda** aytadi va birinchi bo'lagini **uch kadrda** ko'rsatadi: har kadrda bitta gap, o'rta kadrda bitta bosish va ko'rinadigan natija |
| Misol-ip | **eMaktab — «biz noldan qursak»** (ochiq faraz): birinchi versiyada ota-ona farzandining bugungi bahosini ko'radi. Uni **ota-onalar yig'ilishida** ko'rsatish kerak. eMaktabdan faqat ko'rinadigan narsa: baholar bo'limi bor (2-o'tish 3-darsida tekshirilgan, 2026-09-23). Tinglovchi: ota-ona (ekranda «ota-ona», «ota-onangiz» emas) |
| Keys | K12 Airbnb pitch — faqat bank-faktlari: birinchi taqdimoti — o'ntacha oddiy varaq · tartibi: muammo → yechim → bozor → mahsulot → jamoa · internetda ochiq turadi · raqamsiz. Ekranda «bozor» o'rniga PmLesson14 dagi ifoda: «yechimni qancha odam kutayotgani». Burchak (PmLesson14 bilan bir xil): besh qadamda «sayt qanday qurilgani» degan qadam yo'q — tartib odamlarning muammosidan boshlanadi, jamoa bilan tugaydi |
| O'z ishi | Oldingi darslardagi karta (kim · qachon + nimasi og'ir · sayt nima qiladi · odam nimaga erishadi) va birinchi bo'lak + 3 shart ochiladi → 5 gap → 3 kadr → tinglovchi kursisi. Kartasiz o'quvchiga 1-darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi |
| Format | 19 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

### 2. Darsning to'rt asosiy fikri

1. **Kasbiy so'z tinglovchining boshida rasm hosil qilmaydi.** Uni tanish so'z bilan almashtirasiz — ma'nosi qoladi, faqat tushunarli bo'ladi; saytning ichi tinglovchining o'z hayotidan olingan o'xshatish bilan tushuntiriladi.
2. **Birinchi gap tinglovchi haqida:** u nimani bilmoqchi — shundan boshlaysiz. «Men qurdim» — oxirida. Airbnb besh qadami ham shu tartibda: odamlar qiynalgan muammodan boshlanadi, jamoa bilan tugaydi.
3. **Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi.** Ekranni takrorlagan gap tinglovchiga hech narsa bermaydi.
4. **Ko'rsatuv — uch kadr:** ilgari → mana, ishlaydi → endi. O'rta kadrda bitta bosish bor; bosiladigan joy — ish chindan bajariladigan joy, natijasi ko'rinishi shart.

Ip-zanjir: **eMaktab-farazini ota-onaga tushuntiramiz → Airbnb tartibi → ekranga gap qo'shamiz → uch kadr → o'z g'oyamizga xuddi shunday.**

> **eMaktab halolligi:** butun mashq ochiq faraz — «eMaktab kabi saytni biz noldan qurdik, birinchi versiyasida ota-ona farzandining bugungi bahosini ko'radi». eMaktabdan faqat **ko'rinadigan** narsa aytiladi: saytda baholar bo'limi bor (2-o'tish 3-darsi tekshiruvi). Saytning tarixi, raqamlari, ichki qarorlari aytilmaydi. Ekranlardagi sayt-maketi (bosh sahifa, farzand ismi, baholar ro'yxati) — **bizning farazimiz**, eMaktab skrinshoti emas; 1-ekran lead'ida faraz ochiq yoziladi. Nom faqat 1-ekranda («eMaktab kabi sayt»), keyin «sayt».

---

### 3. Ekranlar

#### KIRISH

**1 · Hook** — fikr-so'rovi, ovoz berish (hamma javob to'g'ri)
- Lead (kichik yozuv): «Deylik, eMaktab kabi saytni noldan qurdingiz. Birinchi versiyasida ota-ona farzandining bugungi bahosini ko'radi.»
- Sarlavha: «Yig'ilishda saytni ko'rsatib: "Baholar bazadan chiqadi" dedingiz. Ota-ona so'radi: "Bu nima degani?" Unga nima yetishmadi?»
- Variantlar: «Sayt kim uchun va nega kerakligini aytgan gap» · «Bosilganda natija chiqqan bitta tugma» · «"Baza" o'rniga ota-onaga tanish so'z»
- Javob (ovozdan keyin, hamma tanlovga bir xil): «Uchalasi ham to'g'ri — ota-onaga uchalasi ham yetishmadi. Ekran faqat nima borligini ko'rsatadi. Qolganini siz aytasiz — bugun shuni o'rganamiz.»

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Tanlagan g'oyangizni kod bilmaydigan odamga besh gapda ayta olasiz. Keyin birinchi bo'lagingizni uch kadrda ko'rsatasiz: har kadrda bitta gap, o'rtasida bitta bosish.»
- Vizual: besh gap-qatori yozilib chiqadi → uch kadr (ilgari · mana, ishlaydi · endi) → tinglovchi kursisi 🙂. Zanjir chapdan o'ngga.

#### 1-BLOK · GAP

**3 · Tushunish chizig'i** — so'zma-so'z sahna
- Sarlavha: «Ota-onaga saytni tushuntiryapsiz. Qaysi so'zda u sizni tushunmay qoladi?»
- Gap so'zma-so'z chiqadi: «Baholar bazada saqlanadi, API orqali sahifaga keladi.» Chiziq (yorlig'i: «Ota-ona qanchalik tushunyapti») tanish so'zda ko'tariladi, «bazada» va «API» da tushadi. Mentor: «Chiziq tushgan so'zlarni bosing.»
- Tanish so'z bosilsa: «Bu so'zni ota-ona biladi — chiziq bu yerda ko'tarilgan.»
- Xulosa: «Faqat kod yozadiganlar tushunadigan bunday so'z **kasbiy so'z** deyiladi. Uni tanish so'z bilan almashtirasiz — ma'nosi qoladi. Ota-onaga shunday deysiz: "Baholar maktab jurnaliga yoziladi va telefonda ko'rinadi."»

**4 · TEST-1** (ball)
- Lead: «Ota-ona bitta narsani bilmoqchi: farzandining bugungi bahosi.» Cue: «Qaysi gapdan boshlasangiz, u oxirigacha tinglaydi?»
- ✓ Endi farzandingizning bahosini telefonda ko'rasiz · Saytning birinchi bo'lagi qurildi, uch sharti bajarildi · Baholar bazada turadi, sahifa ularni ekranga chiqaradi · Bu saytni bir hafta davomida o'zim qurib chiqdim
- Reveal: «To'g'ri — birinchi gapda ota-ona bilmoqchi bo'lgan narsa turibdi. Sayt qanday qurilgani — keyin.» · Xato-izohlar: (2) «Bu gap sayt qanday qurilgani haqida. Ota-ona esa bahoni bilmoqchi.» · (3) «"Baza" — kasbiy so'z. Ota-ona aynan shu yerda tushunmay qoladi.» · (4) «Bu gap siz haqingizda. Mehnatingizni oxirida aytsangiz ham bo'ladi.»

**5 · Sayt ichida nima bo'ladi — o'xshatish** — juftlash
- Sarlavha: «Sayt ichida nima bo'lishini ota-onaga nimaga o'xshatib tushuntirasiz?»
- Saytning uch qismi: Ko'rinadigan qism · Saytning ishlashi · Ma'lumot saqlanadigan joy. O'xshatishlar: qog'oz kundalikning sahifasi · sinf rahbari jurnaldan bahoni topib, kundalikka yozishi · maktab jurnali. Chalg'ituvchilar: «server» · «ma'lumotlar bazasi» — ular qo'yilsa: «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- O'xshatish noto'g'ri qismga qo'yilsa: «Bu qism nima ish qiladi? Hayotda shu ishni kim yoki nima qiladi?»
- To'g'ri juftlangach to'liq gap chiqadi: «Ko'rinadigan qism — qog'oz kundalikning sahifasiga o'xshaydi.» · «Saytning ishlashi — sinf rahbari jurnaldan bahoni topib, kundalikka yozishiga o'xshaydi.» · «Ma'lumot saqlanadigan joy — maktab jurnaliga o'xshaydi.»
- Xulosa: «Yaxshi o'xshatish tinglovchining o'z hayotidan olinadi. Ota-ona qog'oz kundalikni ham, sinf rahbarini ham biladi.»

**6 · Keys: Airbnb** — bashorat + 3 slayd (bank-faktlari)
- Sarlavha: «Airbnb o'z ishini qanday tushuntirgan?»
- Bashorat: «Airbnb — odam boshqa birovning uyida ijaraga turadigan sayt. U o'z ishini birinchi marta o'ntacha oddiy varaq bilan tushuntirgan. Sizningcha, tushuntirish nimadan boshlangan?» — Uni kim qurganidan · Odamlar qiynalgan muammodan · Sayt qanday qurilganidan (javob 2-slaydda ochiladi)
- Slaydlar:
 1. «O'sha varaqlar hozir ham internetda ochiq turibdi. Ularda Airbnb o'z ishini besh qadamda aytib bergan.»
 2. «Besh qadam shunday: odamlar qiynalgan muammo, yechim, yechimni qancha odam kutayotgani, mahsulot va jamoa.»
 3. «Shu beshtada "sayt qanday qurilgani" degan qadam yo'q. Tartib odamlarning muammosidan boshlanadi va jamoa bilan tugaydi.»
- Ko'prik: «Bu tartibda avval tinglovchi biladigan qiyinchilik keladi, "biz" esa oxirida. G'oyangizni siz ham shunday tartibda aytasiz.»

**7 · TEST-2** (ball)
- Lead: «Do'stingiz kompyuter klubi uchun sayt qildi va uni Airbnb tartibida tushuntirmoqchi.» Cue: «U qaysi gapdan boshlashi kerak?»
- ✓ Kechqurun klubdan bo'sh joy topish qiyin · Shahrimizda minglab o'smir klubga boradi · Saytda bo'sh kompyuterlar ro'yxati ko'rinadi · Saytni ikki do'st bir oy ichida qurdi
- Reveal: «To'g'ri — Airbnb tartibi odamlar qiynalgan muammodan boshlanadi. Qolganlari keyingi qadamlarda.» · Xato-izohlar: (2) «Bu — yechimni qancha odam kutayotgani, uchinchi qadam. Undan oldin muammo va yechim aytiladi.» · (3) «Bu — yechim. U muammodan keyin keladi.» · (4) «Kim qurgani — jamoa haqida, bu oxirgi qadam.»

#### 2-BLOK · KO'RSATUV

**8 · Ekran va gap** — to'rt gap, hukm
- Sarlavha: «To'rt gapdan qaysi ikkitasi ekranga hech narsa qo'shmaydi?»
- Sinfdoshingiz shu saytni yig'ilishda ko'rsatib, to'rt gap aytdi. Har gap yonida o'sha paytdagi ekran turibdi. O'quvchi har gapga hukm beradi: **Qo'shadi** · **Takrorlaydi**.
 1. Ekran: bosh sahifa, tepada «Baholar» tugmasi. Gap: «Mana bu yerda "Baholar" tugmasi bor.» → Takrorlaydi
 2. Ekran: o'sha sahifa. Gap: «Ota-ona ishdan kelib, farzandi bugun nima olganini bilmoqchi.» → Qo'shadi
 3. Ekran: baholar ro'yxati. Gap: «Ro'yxatda beshta baho bor.» → Takrorlaydi
 4. Ekran: o'sha ro'yxat. Gap: «Bitta bosish — va bugungi baho shu yerda, kundalikni kutish shart emas.» → Qo'shadi
- Xulosa: «Ekran nima borligini o'zi ko'rsatadi. Gap nima uchunligini aytadi: kim uchun, qaysi qiyinchilikdan qutqaradi. Ekranda ko'rinib turgan narsani takrorlagan gap tinglovchiga yangi hech narsa bermaydi.»

**9 · TEST-3** (ball)
- Lead: «Sinfdoshingiz futbol maydoni saytini ko'rsatyapti. Ekranda bo'sh vaqtlar jadvali turibdi.» Cue: «Qaysi gap ko'rsatuvga hech narsa qo'shmaydi?»
- ✓ Jadvalda maydonning bo'sh vaqtlari ko'rsatilgan · Ilgari bolalar maydonga borib, uni band holda topardi · Bu yerda bola do'stlari bilan qachon o'ynashini tanlaydi · Bitta bosish — va vaqt siz uchun band bo'ladi
- Reveal: «To'g'ri — jadval ekranda o'zi turibdi, gap uni qayta aytdi.» · Xato-izohlar: (2) «Bu gap ilgarigi qiyinchilikni aytadi — ekranda u ko'rinmaydi.» · (3) «Bu gap kim uchun va nima uchunligini aytadi — jadval buni aytmaydi.» · (4) «Bu gap bosishni va uning natijasini aytadi — ekranda u hali yo'q.»

**10 · Uch kadr** — tartiblash + bosiladigan joy tanlash
- Sarlavha: «Ko'rsatuv nechta kadrdan bo'ladi va o'rtasida nima bosiladi?»
- Uch kadr aralash turadi, o'quvchi tartiblaydi: **Ilgari** — «Ota-ona bahoni bilish uchun kundalik uyga kelishini kutardi» (ekran: qog'oz kundalik) · **Mana, ishlaydi** — bitta bosish (ekran: sayt) · **Endi** — «Endi ota-ona bugungi bahoni ishdan qaytayotib telefonda ko'radi» (ekran: baho chiqqan sahifa).
- O'rta kadrda o'quvchi **bosiladigan joyni tanlaydi** — sahifada uch joy: «Sayt logotipi» · «Farzand ismi» · «Sozlamalar tugmasi». Bosilgach natija ko'rinadi: logotip → bosh sahifa qaytdi: «Sahifa o'zgarmadi — ota-ona yangi hech narsa bilmadi.» · ism → bugungi baho chiqdi: «Bugungi baho chiqdi — ota-ona bilmoqchi bo'lgan narsa shu.» · sozlamalar → sozlamalar ro'yxati: «Sozlamalar ochildi. Ota-ona esa bahoni bilmoqchi edi.» To'g'ri joy bosilgach o'rta kadr gapi chiqadi: «Farzandining ismini bosadi — bugungi baho shu zahoti chiqadi.»
- Xulosa: «Ko'rsatuv uch kadrdan iborat: ilgari, mana ishlaydi, endi. O'rta kadrda bitta bosish bor va natijasi shu zahoti ko'rinadi.»

**11 · TEST-4** (ball)
- Lead: «Sinf sardori uchun qurilgan saytni ko'rsatyapsiz: u kim pul berganini belgilaydi.» Cue: «O'rta kadrda bosiladigan joy qanday tanlanadi?»
- ✓ Ish chindan bajariladigan joy tanlanadi · Sahifada birinchi ko'ringan joy tanlanadi · Eng chiroyli chiqqan sahifa tanlanadi · Qurish ko'p vaqt olgan joy tanlanadi
- Reveal: «To'g'ri — "Berdi" katagini bossangiz, ism yashil bo'ladi: ish bajarildi, natija ko'rindi.» · Xato-izohlar: (2) «Birinchi ko'ringan joy ko'pincha logotip yoki sarlavha — u hech narsa qilmaydi.» · (3) «Chiroyli sahifa — bu ko'rinish. Ko'rsatuvda ish bajarilishi kerak.» · (4) «Qancha mehnat ketgani tinglovchiga ko'rinmaydi. Unga natija ko'rinsin.»

#### O'Z G'OYANGIZ

**12 · Besh gap** — ustaxona
- Sarlavha: «G'oyangizni kod bilmaydigan odamga besh gapda ayta olasizmi?»
- Oldingi darslardagi kartangiz (kim · qachon + nimasi og'ir · sayt nima qiladi · odam nimaga erishadi) va birinchi bo'lagingiz yonda ochiq turadi. **Karta bo'lmasa** (boshqa kompyuter): 1-darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim, 5 qatorli jadval) tanlov bo'lib chiqadi; tanlangan g'oyaning birinchi bo'lagi va bitta sharti jadvalning qo'shimcha ikki ustunidan tushadi (1-dars senariysi 14-ekran ostida).
- 6 maydon, yorliqlar savol shaklida, tartib — Airbnb tartibi (odam va uning qiyinchiligi birinchi, so'rov oxirida): «Sayt kimga yordam beradi?» · «Hozirgacha ular nimada qiynalardi?» · «Birinchi versiyada sayt nima qiladi?» (birinchi bo'lak) · «Endi ular nimaga erishadi?» · «Saytning ishlashini tinglovchiga tanish nimaga o'xshatasiz?» · «Tinglovchidan keyin nima qilishini so'raysiz?» (bitta aniq so'rov). Birinchi to'rt maydon kartadan va birinchi bo'lakdan namuna oladi, o'quvchi o'zi yozadi. Birinchi ikki maydon bitta gapga yig'iladi — 6 maydon, 5 gap.
- Maydon-namunalari: «hovlida futbol o'ynaydigan o'smirlar» · «maydonga borib, uni band holda topardi» · «maydonning bo'sh vaqtini ko'rsatadi va band qilib beradi» · «do'stlari bilan kutmasdan o'ynaydi» · «kinoteatrda joy tanlash» · «bir hafta sinab ko'rib, fikringizni ayting».
- Yig'iladigan besh gap: «{Kim} hozirgacha {qiyinchilik}. Birinchi versiyada sayt {nima qiladi}. Endi {natija}. Saytning ishlashi {o'xshatish}ga o'xshaydi. Sizdan bitta iltimos — {so'rov}.» Namuna bilan: «Hovlida futbol o'ynaydigan o'smirlar hozirgacha maydonga borib, uni band holda topardi. Birinchi versiyada sayt maydonning bo'sh vaqtini ko'rsatadi va band qilib beradi. Endi ular do'stlari bilan kutmasdan o'ynaydi. Saytning ishlashi kinoteatrda joy tanlashga o'xshaydi. Sizdan bitta iltimos — bir hafta sinab ko'rib, fikringizni ayting.»
- Jonli tekshiruv: kasbiy so'z (baza · API · server · kod · JSON · deploy) yozilsa qizil chiziq va «Bu kasbiy so'z. Uni tanish so'z bilan ayting.» O'xshatish maydonida kasbiy so'z — «Bu o'xshatish emas, yana bitta kasbiy so'z.»
- Saqlanadi: «✓ Besh gap tayyor».

**13 · Uch kadr** — ustaxona
- Sarlavha: «Birinchi bo'lagingizni uch kadrda ko'rsata olasizmi?»
- Uch kadr, har birida bitta gap: **Ilgari** — 12-ekrandagi birinchi gap («… hozirgacha …») namuna bo'lib turadi · **Mana, ishlaydi** — gap + ikki maydon: «Nima bosiladi?» · «Nima chiqadi?» (oldingi darsdagi birinchi shartingiz «Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?» yonda turadi — o'sha juftlik shu kadrga tushadi) · **Endi** — 12-ekrandagi uchinchi gap («Endi …») namuna.
- Namuna (futbol): «Ilgari bolalar maydonga borib, uni band holda topardi» · «Bo'sh vaqtni bosaman — maydon shu zahoti band bo'ladi»: «Bo'sh vaqt» → «"Band qilindi" yozuvi» · «Endi bola vaqtini uydan chiqmay band qiladi».
- Tekshiruvlar: «Nima chiqadi?» bo'sh → «Natija ko'rinmasa, tinglovchi ish bajarilganini bilmaydi.»; gapda ekranni takrorlashi mumkin bo'lgan so'z bo'lsa («bu yerda», «ko'rinib turibdi», «tugmasi bor») — sariq ogohlantirish, saqlashni to'xtatmaydi: «Bu gap ekranni takrorlamayaptimi? Ekran ko'rsatmaydigan narsani ayting: kim uchun, nima uchun.»
- Saqlanadi: «✓ Uch kadr tayyor».

**14 · Tinglovchi kursisi** — 3 tayyor ko'rsatuvga hukm (ballsiz)
- Sarlavha: «Endi siz tinglovchisiz. Uch ko'rsatuvga qanday baho berasiz?»
- Uch tayyor ko'rsatuv (kiyim o'lchami sayti — 1-darsning 4-g'oyasi), har biri uch kadr (o'rtasida: bo'y va vazn yozilib, «O'lchamni ko'rish» bosiladi):
 - A: «Ma'lumot bazadan API orqali keladi» → bosish → «O'lcham JSON'da qaytadi» — kasbiy so'z
 - B: «Bu yerda bo'y va vazn maydoni bor» → bosish → «Mana, jadval ko'rinib turibdi» — ekranni takrorlaydi
 - C: «Posilka ochilganda kiyim to'g'ri kelmasdi» → bosish, o'lcham chiqdi → «Endi birinchi buyurtmadayoq mos kiyim keladi» — hammasi joyida
- O'quvchi har ko'rsatuvga bitta sabab qo'yadi (uch sabab, har biri aynan bitta ko'rsatuvga): «Kasbiy so'z bor» · «Gap ekranni takrorlaydi» · «Hammasi joyida».
- Sabab noto'g'ri qo'yilsa: «Gaplarni yana o'qing: ota-ona qaysi so'zda to'xtab qoladi, qaysi gap ekranda bor narsani aytadi?»
- Xulosa: «Tinglovchi o'rnida o'tirsangiz, boshqaning xatosi darrov ko'rinadi. Endi shu ko'z bilan o'z uch kadringizga qarang — kerak bo'lsa tuzating.»

#### AI BILAN

**15 · AI — ota-ona rolida**
- Sarlavha: «Besh gapingizda qaysi so'z tushunarsiz qoldi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI ota-ona o'rnida tinglaydi va qaysi so'zni tushunmaganini aytadi. Nimani almashtirishni o'zingiz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
 > «Siz kod umuman bilmaydigan ota-onasiz, farzandingiz maktabda o'qiydi. Men sizga loyihamni tushuntiryapman: "{besh gap}". Keyin ko'rsatyapman: 1) {1-kadr gapi} 2) {2-kadr gapi} 3) {3-kadr gapi}. Uch savolga javob bering: qaysi so'zlarni tushunmadingiz? Qaysi kadr gapi faqat ekranda ko'rinadigan narsani aytadi? Menga qaysi bitta savolni berasiz? Qayta yozmang, faqat shu uch javobni bering.»
- «Nusxalash» → gemini.google.com → o'quvchi tushunilmagan so'zni o'zi almashtiradi, takror kadr gapini o'zi qayta yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda ikki narsa chiqadi: (1) besh gap va uch kadr gapida kasbiy so'zlar ro'yxati bo'yicha topilgan so'zlar belgilanadi (baza · server · API · kod · JSON · deploy); (2) 3 tayyor «ota-ona savoli» — «Buni telefonimda qanday ochaman?» · «Bu pullikmi?» · «Farzandim buni o'zi ishlata oladimi?» — o'quvchi bittasini tanlab, javobini besh gapiga qo'shadi. Takror kadrni sherik 16-ekranda tekshiradi. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI faqat qaysi so'z tushunarsiz va qaysi kadr takror ekanini aytadi, qayta yozmaydi. Nimani almashtirishni siz hal qilasiz.»

#### YAKUN

**16 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz uch kadringizni tushunadimi?»
- Yo'riq: «Yozganingizga qaramay, besh gapingizni ayting. Keyin uch kadrni ko'rsatib, har kadrda o'z gapingizni ayting. Sherigingiz ota-ona o'rnida tinglaydi va belgilaydi: 🙂 Tushundim · 😐 Qisman · 😕 Tushunmadim. Tushunmagan so'zini yoki takror kadrni aytadi. Keyin almashasiz.»
- Yozish: «Sherigingiz nimani aytdi va nimani o'zgartirasiz — bir qatorda yozing.»

**17 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**18 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Kasbiy so'zni nima qilasiz? | Tanish so'z bilan almashtirasiz — ma'nosi qoladi |
| Tushuntirish qaysi gapdan boshlanadi? | Tinglovchi bilmoqchi bo'lgan narsadan |
| Yaxshi o'xshatish qayerdan olinadi? | Tinglovchining o'z hayotidan |
| Ekran nimani ko'rsatadi, gap nimani aytadi? | Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi |
| Ko'rsatuv qaysi uch kadrdan iborat? | Ilgari · mana, ishlaydi · endi — o'rtasida bitta bosish |

**19 · Arena + yakun**
- Arena: 12 savol (3/3/3/3): kasbiy so'z va birinchi gap · o'xshatish va Airbnb tartibi · ekran va gap · uch kadr va bosiladigan joy. Ekran savollari va flashcard javoblarining nusxasi emas — boshqa vaziyatda (maktab kutubxonasi sayti · oshxona buyurtma ilovasi · sport to'garagi jadvali).
- Yakun — 4 qator:
 - Kasbiy so'zni tanish so'z bilan almashtirasiz.
 - Birinchi gap tinglovchi bilmoqchi bo'lgan narsa haqida bo'ladi.
 - Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi.
 - Ko'rsatuv uch kadrdan iborat: ilgari, mana ishlaydi, endi — o'rtasida bitta bosish.
- Mentor og'zaki: «Backend modulida texnik qarorlaringizni ham odamga foydasi bilan tushuntirasiz — shu besh gap va uch kadr bilan.»

---

### 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 7 · 9 · 11 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Word Catcher!** (3) — «Ota-ona tushunmay qolgan so'zlarni topdingiz» · **Plain Words!** (12) — «Besh gapni kasbiy so'zsiz yozdingiz» · **Show Time!** (13) — «Birinchi bo'lagingiz uchun uch kadr yozdingiz» · **Listener's Seat!** (14) — «Uch ko'rsatuvga tinglovchi ko'zi bilan baho berdingiz» |

### 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Gap | 3–7 | 22 |
| 2-blok · Ko'rsatuv | 8–11 | 16 |
| O'z g'oyasi | 12–14 | 22 |
| AI + juftlik | 15–16 | 10 |
| Yakun | 17–19 | 8 |
| Bufer | | 7 |

Vaqt yetmasa, birinchi qisqaradigan joy — 14-ekran (tinglovchi kursisi): ekran butunlay tushiriladi, mentor C ko'rsatuvni og'zaki aytib, sinfdan «nimasi joyida?» deb so'raydi. Ikki ko'rsatuv bilan uch sabab-varianti ishlamaydi — shuning uchun qisman qisqartirilmaydi.
