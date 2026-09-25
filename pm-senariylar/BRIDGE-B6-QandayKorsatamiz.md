# Bridge · «Qanday ko'rsatamiz?» — dars rejasi

> Holat: QORALAMA v1 → metodist korrekturasi ✅ → kelishildi (21:29) → **o'z ko'rigim (qolgan 6 dars mezonlari bilan) kiritildi ✅ (2026-09-23 23:47) — GATE S** → qurish (1-dars pilotdan keyin).
> Namuna: `BRIDGE-B5-NimaQuramiz.md` · Manba darslar: `2-Modull/PmLesson6` (Sistemani pitch qilish — kasbiy so'z, birinchi gap, o'xshatish), `3-Modull/PmLesson10` (Frontend pitchi — ekran va gap, kadrlar, bosiladigan joy), `4-Modull/PmLesson14` (Airbnb besh qadam — K12 burchagi).
> Suhbatda: **3-o'tish (Node) · 3-dars**. Bu dars faqat Node yo'lida; 2-o'tish 3-darsi («Birinchi versiya», eMaktab-buvi) bilan bitta o'quvchi ko'rmaydi — kasbiy so'z / o'xshatish materiali qayta ishlatilgan.

## 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node.js (Express) darslariga o'tadigan o'quvchi (3 darsning 3-si, oxirgisi; «Kim uchun, qanday muammo» va «Nima quramiz» dan keyin) |
| Mavzular (2 + 2) | Sistemani kod bilmaydigan odamga tushuntirish (kasbiy so'z · birinchi gap · o'xshatish · Airbnb tartibi) · Ko'rsatuv (ekran va gap · uch kadr · bosiladigan joy) |
| Maqsad | O'quvchi o'z g'oyasini kod bilmaydigan odamga **besh gapda** aytadi va birinchi bo'lagini **uch kadrda** ko'rsatadi: har kadrda bitta gap, o'rta kadrda bitta bosish va ko'rinadigan natija |
| Misol-ip | **eMaktab — «biz noldan qursak»** (ochiq faraz): birinchi versiyada ota-ona farzandining bugungi bahosini ko'radi. Uni **ota-onalar yig'ilishida** ko'rsatish kerak. eMaktabdan faqat ko'rinadigan narsa: baholar bo'limi bor (2-o'tish 3-darsida tekshirilgan, 2026-09-23). Tinglovchi: ota-ona (ekranda «ota-ona», «ota-onangiz» emas) |
| Keys | K12 Airbnb pitch — faqat bank-faktlari: birinchi taqdimoti — o'ntacha oddiy varaq · tartibi: muammo → yechim → bozor → mahsulot → jamoa · internetda ochiq turadi · raqamsiz. Ekranda «bozor» o'rniga PmLesson14 dagi ifoda: «yechimni qancha odam kutayotgani». Burchak (PmLesson14 bilan bir xil): besh qadamda «sayt qanday qurilgani» degan qadam yo'q — tartib odamlarning muammosidan boshlanadi, jamoa bilan tugaydi |
| O'z ishi | Oldingi darslardagi karta (kim · qachon + nimasi og'ir · sayt nima qiladi · odam nimaga erishadi) va birinchi bo'lak + 3 shart ochiladi → 5 gap → 3 kadr → tinglovchi kursisi. Kartasiz o'quvchiga 1-darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi |
| Format | 19 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

## 2. Darsning to'rt asosiy fikri

1. **Kasbiy so'z tinglovchining boshida rasm hosil qilmaydi.** Uni tanish so'z bilan almashtirasiz — ma'nosi qoladi, faqat tushunarli bo'ladi; saytning ichi tinglovchining o'z hayotidan olingan o'xshatish bilan tushuntiriladi.
2. **Birinchi gap tinglovchi haqida:** u nimani bilmoqchi — shundan boshlaysiz. «Men qurdim» — oxirida. Airbnb besh qadami ham shu tartibda: odamlar qiynalgan muammodan boshlanadi, jamoa bilan tugaydi.
3. **Ekran nima borligini ko'rsatadi, gap nima uchunligini aytadi.** Ekranni takrorlagan gap tinglovchiga hech narsa bermaydi.
4. **Ko'rsatuv — uch kadr:** ilgari → mana, ishlaydi → endi. O'rta kadrda bitta bosish bor; bosiladigan joy — ish chindan bajariladigan joy, natijasi ko'rinishi shart.

Ip-zanjir: **eMaktab-farazini ota-onaga tushuntiramiz → Airbnb tartibi → ekranga gap qo'shamiz → uch kadr → o'z g'oyamizga xuddi shunday.**

> **eMaktab halolligi:** butun mashq ochiq faraz — «eMaktab kabi saytni biz noldan qurdik, birinchi versiyasida ota-ona farzandining bugungi bahosini ko'radi». eMaktabdan faqat **ko'rinadigan** narsa aytiladi: saytda baholar bo'limi bor (2-o'tish 3-darsi tekshiruvi). Saytning tarixi, raqamlari, ichki qarorlari aytilmaydi. Ekranlardagi sayt-maketi (bosh sahifa, farzand ismi, baholar ro'yxati) — **bizning farazimiz**, eMaktab skrinshoti emas; 1-ekran lead'ida faraz ochiq yoziladi. Nom faqat 1-ekranda («eMaktab kabi sayt»), keyin «sayt».

---

## 3. Ekranlar

### KIRISH

**1 · Hook** — fikr-so'rovi, ovoz berish (hamma javob to'g'ri)
- Lead (kichik yozuv): «Deylik, eMaktab kabi saytni noldan qurdingiz. Birinchi versiyasida ota-ona farzandining bugungi bahosini ko'radi.»
- Sarlavha: «Yig'ilishda saytni ko'rsatib: "Baholar bazadan chiqadi" dedingiz. Ota-ona so'radi: "Bu nima degani?" Unga nima yetishmadi?»
- Variantlar: «Sayt kim uchun va nega kerakligini aytgan gap» · «Bosilganda natija chiqqan bitta tugma» · «"Baza" o'rniga ota-onaga tanish so'z»
- Javob (ovozdan keyin, hamma tanlovga bir xil): «Uchalasi ham to'g'ri — ota-onaga uchalasi ham yetishmadi. Ekran faqat nima borligini ko'rsatadi. Qolganini siz aytasiz — bugun shuni o'rganamiz.» (§119: har tanlov rost, hech biri rad etilmaydi)

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Tanlagan g'oyangizni kod bilmaydigan odamga besh gapda ayta olasiz. Keyin birinchi bo'lagingizni uch kadrda ko'rsatasiz: har kadrda bitta gap, o'rtasida bitta bosish.»
- Vizual: besh gap-qatori yozilib chiqadi → uch kadr (ilgari · mana, ishlaydi · endi) → tinglovchi kursisi 🙂. Zanjir chapdan o'ngga.

### 1-BLOK · GAP

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

### 2-BLOK · KO'RSATUV

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

### O'Z G'OYANGIZ

**12 · Besh gap** — ustaxona
- Sarlavha: «G'oyangizni kod bilmaydigan odamga besh gapda ayta olasizmi?»
- Oldingi darslardagi kartangiz (kim · qachon + nimasi og'ir · sayt nima qiladi · odam nimaga erishadi) va birinchi bo'lagingiz yonda ochiq turadi. **Karta bo'lmasa** (boshqa kompyuter): 1-darsning 4 tayyor g'oyasi (futbol · o'yin · sinf · kiyim, 5 qatorli jadval) tanlov bo'lib chiqadi; tanlangan g'oyaning birinchi bo'lagi va bitta sharti jadvalning qo'shimcha ikki ustunidan tushadi (1-dars senariysi 14-ekran ostida).
- 6 maydon, yorliqlar savol shaklida, tartib — Airbnb tartibi (odam va uning qiyinchiligi birinchi, so'rov oxirida): «Sayt kimga yordam beradi?» · «Hozirgacha ular nimada qiynalardi?» · «Birinchi versiyada sayt nima qiladi?» (birinchi bo'lak) · «Endi ular nimaga erishadi?» · «Saytning ishlashini tinglovchiga tanish nimaga o'xshatasiz?» · «Tinglovchidan keyin nima qilishini so'raysiz?» (bitta aniq so'rov). Birinchi to'rt maydon kartadan va birinchi bo'lakdan namuna oladi, o'quvchi o'zi yozadi. Birinchi ikki maydon bitta gapga yig'iladi — 6 maydon, 5 gap.
- Maydon-namunalari (futbol, kesim shaklida — §37): «hovlida futbol o'ynaydigan o'smirlar» · «maydonga borib, uni band holda topardi» · «maydonning bo'sh vaqtini ko'rsatadi va band qilib beradi» · «do'stlari bilan kutmasdan o'ynaydi» · «kinoteatrda joy tanlash» · «bir hafta sinab ko'rib, fikringizni ayting».
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

### AI BILAN

**15 · AI — ota-ona rolida**
- Sarlavha: «Besh gapingizda qaysi so'z tushunarsiz qoldi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI ota-ona o'rnida tinglaydi va qaysi so'zni tushunmaganini aytadi. Nimani almashtirishni o'zingiz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
  > «Siz kod umuman bilmaydigan ota-onasiz, farzandingiz maktabda o'qiydi. Men sizga loyihamni tushuntiryapman: "{besh gap}". Keyin ko'rsatyapman: 1) {1-kadr gapi} 2) {2-kadr gapi} 3) {3-kadr gapi}. Uch savolga javob bering: qaysi so'zlarni tushunmadingiz? Qaysi kadr gapi faqat ekranda ko'rinadigan narsani aytadi? Menga qaysi bitta savolni berasiz? Qayta yozmang, faqat shu uch javobni bering.»
- «Nusxalash» → gemini.google.com → o'quvchi tushunilmagan so'zni o'zi almashtiradi, takror kadr gapini o'zi qayta yozadi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda ikki narsa chiqadi: (1) besh gap va uch kadr gapida kasbiy so'zlar ro'yxati bo'yicha topilgan so'zlar belgilanadi (baza · server · API · kod · JSON · deploy); (2) 3 tayyor «ota-ona savoli» — «Buni telefonimda qanday ochaman?» · «Bu pullikmi?» · «Farzandim buni o'zi ishlata oladimi?» — o'quvchi bittasini tanlab, javobini besh gapiga qo'shadi. Takror kadrni sherik 16-ekranda tekshiradi. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI faqat qaysi so'z tushunarsiz va qaysi kadr takror ekanini aytadi, qayta yozmaydi. Nimani almashtirishni siz hal qilasiz.»

### YAKUN

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

## 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 7 · 9 · 11 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Word Catcher!** (3) — «Ota-ona tushunmay qolgan so'zlarni topdingiz» · **Plain Words!** (12) — «Besh gapni kasbiy so'zsiz yozdingiz» · **Show Time!** (13) — «Birinchi bo'lagingiz uchun uch kadr yozdingiz» · **Listener's Seat!** (14) — «Uch ko'rsatuvga tinglovchi ko'zi bilan baho berdingiz» |

## 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Gap | 3–7 | 22 |
| 2-blok · Ko'rsatuv | 8–11 | 16 |
| O'z g'oyasi | 12–14 | 22 |
| AI + juftlik | 15–16 | 10 |
| Yakun | 17–19 | 8 |
| Bufer | | 7 |

Vaqt yetmasa, birinchi qisqaradigan joy — 14-ekran (tinglovchi kursisi): ekran butunlay tushiriladi, mentor C ko'rsatuvni og'zaki aytib, sinfdan «nimasi joyida?» deb so'raydi. Ikki ko'rsatuv bilan uch sabab-varianti ishlamaydi — shuning uchun qisman qisqartirilmaydi (metodist D-7 aniqlashtirildi).

## 6. Kelishib olinadigan joylar

1. **Tinglovchi — ota-ona** (2-o'tish 3-darsida buvi). Ikkala darsni bitta o'quvchi ko'rmaydi, shuning uchun ikki tinglovchi bir-biriga xalaqit bermaydi. Ma'qulmi?
2. **Kasbiy so'z / o'xshatish materiali 2-o'tish 3-darsi bilan bir xil** (3, 5-ekran; TEST-1 ota-ona varianti). Node o'quvchisi u darsni ko'rmaydi — takror emas. Ma'qulmi?
3. **Airbnb burchagi** — «besh qadamda "sayt qanday qurilgani" degan qadam yo'q» PmLesson14 (asosiy kurs) bilan bir xil talqin va ifoda; bank-faktlaridan tashqariga chiqmaydi (beshta qadam bank ro'yxati). Ma'qulmi?
4. **Uch kadr «Nima bosiladi? · Nima chiqadi?» oldingi darsdagi birinchi shartdan o'sadi** — 3-o'tishning uch darsi bitta zanjir bo'lib yopiladi (karta → birinchi bo'lak → shart → kadr). Kartasiz o'quvchida 12-ekranda tanlangan tayyor g'oyaning birinchi bo'lagi va bitta sharti 1-dars senariysidagi qo'shimcha jadvaldan tushadi (1-dars 14-ekran ostida, qaror 2026-09-23).
5. **AI uch savol beradi** (so'z · takror kadr · savol) — oldingi ikki darsdagi «javob beradi» / «sinaydi» rollaridan farq qiladi, qayta yozmaydi. Qolsinmi?
6. **14-ekran tinglovchi kursisi** — ballsiz, 5 daqiqa. Vaqt yetmasa birinchi qisqaradi. Rozimisiz?

**Foydalanuvchi qarorlari (2026-09-23 21:29, «hammasiga tavsiyang bo'yicha, GATE S dan o'tkaz»):**
- 6-bo'lim 1–6 — hammasi **ma'qul** (ota-ona tinglovchi · 2-o'tish 3-darsi materiali takror emas · Airbnb burchagi PmLesson14 ifodasida · kadr shartdan o'sadi · AI uch savol, qayta yozmaydi · tinglovchi kursisi qoladi).
- Metodist D-1 (TEST-1 qoidasi 3-ekranda o'rgatilmaydi) — **qoladi**: lead mulohaza bilan yechiladi, reveal qoidani ochadi; 2-o'tish 3-darsi TEST-3 bilan bir qaror.
- D-2 (12-ekran besh gap tartibi) — **Airbnb tartibi qoladi**: «{Kim} ilgari {qiyinchilik}. Birinchi versiyada sayt {nima qiladi}. Endi {natija}. U {o'xshatish} kabi ishlaydi. Sizdan iltimos: {so'rov}.» Dars 6–7-ekranda shu tartibni o'rgatadi; birinchi gap baribir tinglovchi haqida. (2-o'tish 3-darsida foyda birinchi (b) — boshqa o'quvchi, farq zararsiz.)
- D-7 (5-bo'lim qisqarish qoidasi) — **aniqlashtirildi**, yuqorida.
- D-8 (15-ekran AI personasi doim ota-ona) — **qoladi**: rol «kod bilmaydigan katta odam», g'oya o'yin yoki kiyim bo'lsa ham ishlaydi.
- D-9 (6-bo'lim 3-band iborasi) — **yangilandi**, yuqorida.
- Kartasiz o'quvchi (12–13-ekran) — 1-dars 14-ekran jadvaliga «birinchi bo'lak · 1 shart» ustunlari qo'shildi (4-o'tish 3-darsi D-5 bilan bitta qaror).
- D-3 (13-ekran takror-tekshiruvi sariq) · D-4 (10-ekran kadr yorliqlari tartiblangach chiqadi) · D-5 (6-ekran bashorat yig'iladi) · D-6 (15-ekran so'rov yig'mada) · D-10 («Mana, ishlaydi» — 👦 o'qishda kuzatiladi) · D-11 · D-12 — **quruvchi/tekshiruvchiga**, o'zgarishsiz.
- Senariy **GATE S dan o'tdi**.

---

**Ko'rik (2026-09-23 23:47):** foydalanuvchi bu dars uchun yuborgan fidbek 3/4-o'tish 2-darsi («Nima quramiz») fidbegining so'zma-so'z nusxasi edi — u o'sha darsga kiritilgan. Bu dars qolgan olti dars ko'rigida ishlatilgan mezonlar bilan o'zim ko'rildi:
- **Izchillik (foydalanuvchi tasdiqlagan ifodalar):** 5-ekran «Saytning ishlashi — sinf rahbari…» va juftlangach to'liq gap (2-o'tish 3-darsi) · 12-ekran oltita yorliq bir xil savol shaklida, qolip «hozirgacha … · Saytning ishlashi …ga o'xshaydi · Sizdan bitta iltimos —» (2-o'tish 3-darsi), to'liq namuna-gap qolipga qo'yib tekshirildi · 13-ekran oldingi dars maydonlari «Foydalanuvchi nima qiladi? · Shundan keyin nima bo'ladi?» (3/4-o'tish 2-darsi).
- **Ortiqcha da'vo:** 6-ekran ko'prigidagi «Tartib tasodifiy emas» — bankda Airbnb niyati haqida gap yo'q; «Bu tartibda avval … keladi» qilindi · 8-ekran «hech narsa bermaydi» → «yangi hech narsa bermaydi» · mentor gapi «har texnik qaror» → «texnik qarorlaringizni ham».
- **Umumiy qoidalar:** 15-ekran AI maqsad-gap, so'rov yig'mada, «Gemini ochilmasa» zaxira (kasbiy so'z ro'yxati + 3 ota-ona savoli) · Podium mazmuni · flashcard 5 · pasport «Node.js (Express)».
- **Tekshirildi, o'zgartirilmadi:** testlar (uzunlik, shakl, yagona himoyalanadigan javob — metodist o'lchovi amal qiladi) · Airbnb slaydlari bank bilan (besh qadam va «qanday qurilgani qadami yo'q» — bank ro'yxatidan) · kasbiy so'z ta'rifi (boshqa darslar bilan bir xil).
- Senariy **GATE S dan o'tdi**.

## Korrektura-jurnali (pm-metodist, 2026-09-23)

Tuzilma, ekran soni (19), mexanika turlari, ball-joylari (4 · 7 · 9 · 11), bloklar tartibi, vaqt jadvali va 6-bo'lim savollari o'zgarmadi. Variantlarda ✓ birinchi yozilgan — qurishda pozitsiyani Jonli aralashtiradi. Asl v1 nusxasi: scratchpad `B6-v1-orig.md`. MATN_KORPUS.md ga yozilmadi.

### A. Tuzatishlar (❌ → ✅ · sabab)

| # | Ekran | ❌ edi | ✅ bo'ldi | Sabab |
|---|---|---|---|---|
| 1 | 1 sarlavha | «…"Mana, qildim!" dedingiz. Ota-ona: "…, bu nima o'zi?" — nima yetishmadi?» (boshida to'ldiruvchi so'z) | «Yig'ilishda saytni ko'rsatib: "Baholar bazadan chiqadi" dedingiz. Ota-ona so'radi: "Bu nima degani?" Unga nima yetishmadi?» | to'ldiruvchi so'z va «o'zi» — so'zlashuv (7-C). Eski sahnada o'quvchi hech qanday kasbiy so'z aytmagan edi — «tanish so'z» varianti yetishmagan narsa bo'la olmasdi; endi uchala variant sahnada chindan yetishmaydi (§119 sharti). Hodisa 3-ekrandan oldin induktiv ko'rinadi |
| 2 | 1 variantlar | «Bir gap — bu kim uchun va nega» · «Bir bosish — tugma bosilib, natija chiqishi» · «Tanish so'z — "baza" o'rniga "jurnal"» | «Sayt kim uchun va nega kerakligini aytgan gap» · «Bosilganda natija chiqqan bitta tugma» · «"Baza" o'rniga ota-onaga tanish so'z» | «tugma bosilib, natija chiqishi» — g'aliz masdar-zanjir (§0-5). «jurnal» — 3-ekran xulosasi va 5-ekran juftligining javobi hookda oldindan aytilardi. Uch variant bir shaklga keldi (ot-birikma); uzunlik 1.43× → 1.25× |
| 3 | 1 javob | «Uchalasi ham yetishmagan bo'lishi mumkin — va bugun uchalasini qo'shamiz…» | «Uchalasi ham to'g'ri — ota-onaga uchalasi ham yetishmadi. Ekran faqat nima borligini ko'rsatadi. Qolganini siz aytasiz — bugun shuni o'rganamiz.» | **§119:** «bo'lishi mumkin» — noaniq, bola o'z tanlovi tasdiqlanganini sezmaydi; endi har tanlov ochiq rost. Ekran 400 → ≈370 |
| 4 | 1 lead | «Faraz: eMaktab kabi saytni noldan qurdingiz.» | «Deylik, eMaktab kabi saytni noldan qurdingiz.» | «Faraz:» — hujjat-yorlig'i; faraz ochiq qoladi, ohang jonli (§0-2). Halollik saqlandi |
| 5 | 2 | «…besh gapda aytasiz.» | «…besh gapda ayta olasiz.» | reja-ekran nima qila olishni aytadi (§162) |
| 6 | 3 xulosa · 2-bo'lim · flashcard 2 | «Uni tashlamaysiz, tanish so'z bilan almashtirasiz.» · «Tashlamaysiz — tanish so'z bilan almashtirasiz» | «Uni tanish so'z bilan almashtirasiz — ma'nosi qoladi.» · «Tanish so'z bilan almashtirasiz — ma'nosi qoladi» | o'zaro zid: almashtirilgan so'z baribir gapdan ketadi — «tashlamaysiz» bolani chalg'itadi. Aslida saqlanadigani ma'no. Kaskad uch joyda |
| 7 | 3 | tanish so'z bosilsa — reaksiya yo'q | «Bu so'zni ota-ona biladi — chiziq bu yerda ko'tarilgan.» | **§139/§175:** ekran o'quvchining xato bosishiga javob bersin; fidbek mezonni (chiziq) eslatadi |
| 8 | 4 TEST-1 (2) | «Sayt uch bo'lakdan qurildi, hamma sharti bajarildi» | «Saytning birinchi bo'lagi qurildi, uch sharti bajarildi» | oldingi darsning o'z atamalari (birinchi bo'lak + 3 shart) — distraktor o'quvchiga tanish va ishonarli; «hamma» mutlaq so'zi olindi (§110) |
| 9 | 5 | «Ma'lumot saqlanadigan **joy**»; xato-juftlikka fidbek yo'q | «Ma'lumot saqlanadigan **qism**»; «Bu qism nima ish qiladi? Hayotda shu ishni kim yoki nima qiladi?» | **§156:** «joy» darsda «bosiladigan joy» ma'nosida band; uch qism bir nom bilan. §175: fidbek vazifa-mezonini eslatadi |
| 10 | 6 bashorat + slayd 1 | Airbnb nima ekani aytilmaydi; bashorat va slayd 1 bir gapni ikki marta takrorlaydi; tanlovlar «Kim qurgani · …» (savol «nima turgan?») | bashoratda gloss «Airbnb — odam boshqa birovning uyida ijaraga turadigan sayt» (PmLesson14 bilan so'zma-so'z); savol «tushuntirish nimadan boshlangan?» + tanlovlar «-dan» shaklida; slayd 1 — faqat yangi fakt («ochiq turibdi» + «besh qadam») | Node o'quvchisi Airbnb'ni bilmasligi mumkin (§21 gloss); takror ekran joyini yeydi; tanlov savolga grammatik ulanadi (§99). «Birinchi varaqda» → «tushuntirish» — o'ntacha varaqning birinchisi sarlavha bo'lishi mumkin, bank «birinchi varaq = muammo» demaydi (§101) |
| 11 | 6 slayd 2 | «Varaqlar tartibi: odamlar qiynalgan muammo → yechim → bozor (nechta odam kutayapti) → mahsulot → jamoa.» | «Besh qadam shunday: odamlar qiynalgan muammo, yechim, yechimni qancha odam kutayotgani, mahsulot va jamoa.» | **ETALON 43:** o'quvchi-matnda «→» taqiq. «bozor» + qavs-gloss o'rniga PmLesson14 ifodasi (bir kursda bir ifoda); «nechta odam kutayapti» — g'aliz («nechta» + kishi) |
| 12 | 6 slayd 3 | «Beshtasining hech biri sayt qanday qurilgani haqida emas. Hammasi odamdan boshlanadi va jamoa bilan tugaydi.» | «Shu beshtada "sayt qanday qurilgani" degan qadam yo'q. Tartib odamlarning muammosidan boshlanadi va jamoa bilan tugaydi.» | burchak saqlandi, so'zlashuv bankka yaqinlashdi (§101): bank «mahsulot» qadamini beradi — u varaqda sayt qanday ishlashi ko'rsatilmagan deyishga asos yo'q; «degan qadam yo'q» — PmLesson14 bilan bir da'vo, ro'yxatning o'zidan tekshiriladi. «Hammasi … boshlanadi» — mantiqan xato (boshlanadigani tartib) |
| 13 | 6 ko'prik | «…Sizning ko'rsatuvingiz ham shu tartibda boshlanadi.» | «…"biz" esa oxirida. G'oyangizni siz ham shunday aytasiz.» | **§40:** o'quvchida hali ko'rsatuv yo'q, g'oya esa bor. «Sizning» — ortiqcha rasmiy |
| 14 | 7 TEST-2 | cue «Birinchi varag'ida qaysi gap turadi?» · (2) «Shaharda yigirmata o'yin-klub bor» · xato-izohlar «uchinchi varaq» / «oxirgi varaq» | lead «…kompyuter klubi uchun sayt qildi…» · cue «U qaysi gapdan boshlashi kerak?» · (2) «Shahrimizda minglab o'smir klubga boradi» · izohlar «uchinchi qadam» / «oxirgi qadam» | **§156:** «varaq» (o'ntacha qog'oz) va «qadam» (besh qism) aralashgan — «uchinchi varaq» yolg'on (10 varaqda uchinchisi bozor bo'lishi shart emas). **§102/xato-izoh ziddiyati:** klublar soni — «qancha odam kutayotgani» emas; izoh distraktorni o'zi tushuntira olmasdi. ✓ eng uzun edi (1.02) → «Kechqurun klubdan bo'sh joy topish qiyin», 0.89 dan past tomonda |
| 15 | 8 | «Sinfdoshingiz saytni (faraz) ko'rsatyapti — **to'rt kadr**, har birida ekran + gap» · sarlavha to'rt gap haqida | «Sinfdoshingiz shu saytni yig'ilishda ko'rsatib, **to'rt gap** aytdi. Har gap yonida o'sha paytdagi ekran turibdi.» · «hukm beradi» — har **gapga** | **§156 + sanoq:** 10-ekran qoidasi «ko'rsatuv — uch kadr»; ikki ekran oldin «to'rt kadr» bo'lsa, bola «nega endi uch?» deb qoladi. «kadr» endi faqat uch kadrli ko'rsatuvda. «(faraz)» — ichki izoh ekranga oqardi |
| 16 | 9 TEST-3 | ✓ «Bu yerda bo'sh vaqtlar jadvali ko'rinib turibdi» · (2) «Bolalar maydonga…» · (3) «Endi bo'sh vaqtni uydan chiqmay ko'rish mumkin» · (4) «…vaqt sizga band qilinadi» | ✓ «Jadvalda maydonning bo'sh vaqtlari ko'rsatilgan» · (2) «Ilgari bolalar maydonga borib, uni band holda topardi» · (3) «Bu yerda bola do'stlari bilan qachon o'ynashini tanlaydi» · (4) «Bitta bosish — va vaqt siz uchun band bo'ladi» | **yuza-belgi telli:** 8-ekranda «Mana bu yerda…» Takrorlaydi edi — ✓ ham «Bu yerda…ko'rinib turibdi» bilan boshlansa, bola ma'noni emas, so'zni tanib topadi. Endi «Bu yerda» Qo'shadi-distraktorda turadi, ✓ esa so'z-belgisiz. (3) eski — «ko'rish mumkin» ekranda ko'rinib turgan jadvalni ham aytadi, ikki ma'noli (bitta himoyalanadigan ✓ sharti). Izohlar yangilandi |
| 17 | 10 kadr gaplari | «…kundalikni kutardi» · «Endi baho ishdan qaytgan zahoti telefonda» · o'rta kadrda gap yo'q | «…kundalik uyga kelishini kutardi» · «Endi ota-ona bugungi bahoni ishdan qaytayotib telefonda ko'radi» · to'g'ri joy bosilgach: «Farzandining ismini bosadi — bugungi baho shu zahoti chiqadi.» | «baho ishdan qaytgan» — ega noto'g'ri, kesimsiz; «har kadrda bitta gap» qoidasi o'rta kadrda buzilardi (Quruvchi to'qimasin) |
| 18 | 10 fidbeklar | logotip → «Ota-ona nimani ko'rdi?» · ism → «Ish bajarildi, natija ko'rindi.» | logotip → «Sahifa o'zgarmadi — ota-ona yangi hech narsa bilmadi.» · ism → «Bugungi baho chiqdi — ota-ona bilmoqchi bo'lgan narsa shu.» | **§175:** quruq savol mezonni bermaydi, endi fakt beriladi. **§106:** eski ism-fidbek TEST-4 ✓ («ish chindan bajariladigan joy») ning so'zlarini bir ekran oldin berib qo'yardi |
| 19 | 10 xulosa · 19 yakun | «Ko'rsatuv uch kadr: ilgari → mana, ishlaydi → endi.» | «Ko'rsatuv uch kadrdan iborat: ilgari, mana ishlaydi, endi.» | ETALON 43 (strelka-formula); «uch kadr:» — kesimsiz |
| 20 | 11 TEST-4 lead | «Sinf sardori saytini ko'rsatyapsiz: kim pul berganini belgilaydi.» | «Sinf sardori uchun qurilgan saytni ko'rsatyapsiz: u kim pul berganini belgilaydi.» | «sardori saytini» — sardorning o'z sayti deb o'qiladi; egasiz kesim |
| 21 | 12 maydonlar | 5 maydon, 1-yorliq «Sayt kim uchun va u endi nimaga erishadi?» · qolip «Bu sayt {kim} uchun: endi **ular** {natija}. Ilgari **ular** {muammo}…» · tartib: foyda → muammo | 6 maydon → 5 gap; yorliqlar bittadan savol; qolip «{Kim} ilgari {qiyinchilik}. Birinchi versiyada sayt {nima qiladi}. Endi {natija}. U {o'xshatish} kabi ishlaydi. Sizdan iltimos: {so'rov}.» | **§37 (to'rt olamda sinaldi):** «ular» sinf («sinf sardori») va kiyim («…o'smir») g'oyalarida birlik egaga ulanmasdi. Yangi qolip: «Hovlida futbol o'ynaydigan o'smirlar ilgari maydonga borib, uni band holda topardi.» · «Onlayn o'yin o'ynaydigan o'quvchilar ilgari sherigi chiqib ketib, yutqazib qo'yardi.» · «Sinf sardori ilgari kim bergani, kim bermaganini adashtirib yuborardi.» · «Internetdan kiyim oladigan o'smir ilgari kiyim to'g'ri kelmay, qaytarishga ovora bo'lardi.»; «Endi {natija}» to'rttasida tugal («Endi sovg'ani janjalsiz, vaqtida oladi»). **Sanoq:** 6 bo'sh joy «5 maydon» deb yozilgan edi. **Tartib:** 6–7-ekran «tartib muammodan boshlanadi» deb o'rgatadi, qolip esa foydadan boshlardi — o'quvchi o'z ishida o'rgangani teskarisini qilardi (D-2) |
| 22 | 13 | Ilgari namunasi «Ota-onalar bolasini maydonga yuborib, band deb qaytarib olardi» · o'rta kadr gapi namunasiz · «12-ekrandagi ikkinchi gap» / «natija-qismi» | «Ilgari bolalar maydonga borib, uni band holda topardi» · «Bo'sh vaqtni bosaman — maydon shu zahoti band bo'ladi» · havolalar yangi qolipga (1-gap, 3-gap) | futbol g'oyasining KIMi — o'smirlar; namuna birdan ota-onaga o'tib, ipni uzardi. Havolalar #21 bilan kaskad |
| 23 | 13 tekshiruv | «bu yerda», «ko'rinib turibdi» yozilsa — to'xtatuvchi xabar «Bu gap ekranni takrorlayapti.» | sariq ogohlantirish, saqlashni to'xtatmaydi: «Bu gap ekranni takrorlamayaptimi? Ekran ko'rsatmaydigan narsani ayting: kim uchun, nima uchun.» | so'z-naqsh ma'noni o'lchamaydi: «Bu yerda bola vaqtini uydan chiqmay band qiladi» — yaxshi gap, lekin qizil chiqardi (TEST-3 #16 bilan bir sinf). Savol-shakli bola o'zi hukm qilishini qoldiradi (D-3) |
| 24 | 14 | sarlavha «…qaysi biri tushunarli?» (mexanika — har biriga sabab) · C «bo'y va vazn bosildi» · «Endi birinchi urinishdayoq mos kiyim» · xato-fidbek yo'q | «Endi siz tinglovchisiz. Uch ko'rsatuvga qanday baho berasiz?» · o'rta kadr: «bo'y va vazn yozilib, "O'lchamni ko'rish" bosiladi» · «Endi birinchi buyurtmadayoq mos kiyim keladi» · «Gaplarni yana o'qing: ota-ona qaysi so'zda to'xtab qoladi, qaysi gap ekranda bor narsani aytadi?» | sarlavha mexanikaga mos; «bo'y bosilmaydi» (ETALON 42 fe'l ↔ harakat); kesimsiz gap; §175 |
| 25 | 15 so'rov | «Qaysi kadr ekranda ko'rinib turgan narsani takrorlaydi?» | «Qaysi kadr gapi faqat ekranda ko'rinadigan narsani aytadi?» | AI ekranni ko'rmaydi — faqat gaplarni oladi; savol unga bajarib bo'ladigan shaklda. §173: qoida-matn o'zgarmadi (qaror o'quvchida) |
| 26 | 16 yo'riq | «Ekranga qaramay, besh gapingizni ayting va uch kadrni ko'rsating.» | «Yozganingizga qaramay, besh gapingizni ayting. Keyin uch kadrni ko'rsatib, har kadrda o'z gapingizni ayting.» | o'ziga zid: ekranga qaramay kadr ko'rsatib bo'lmaydi. Qaralmaydigani — yozilgan matn (PmLesson10 «ekranga qaramasdan … ayting» og'zaki nutq haqida) |
| 27 | 18 flashcard 5–6 | «Airbnb varaqlari nimadan boshlanib…» · «Ekran va gap — qaysi biri nimani aytadi?» | «Airbnb besh qadami nimadan boshlanib…» · «Ekran nimani ko'rsatadi, gap nimani aytadi?» | #14 kaskadi (varaq va qadam — ikki narsa); ikkinchisi — tire-qurilma o'rniga oddiy savol. §145: sakkizta kartaning hammasi darsda nomlangan narsani so'raydi |
| 28 | 4-bo'lim nishonlar | Word Catcher «Tushunish chizig'i tushgan so'zlarni topdingiz» · Show Time «…uch kadrda ko'rsatdingiz» · Listener's Seat «…hukm berdingiz» | «Ota-ona tushunmay qolgan so'zlarni topdingiz» · «Birinchi bo'lagingiz uchun uch kadr yozdingiz» · «…baho berdingiz» | «tushunish chizig'i tushgan» — ichki mexanika nomi, so'z-takror; 13-ekranda kadr **yoziladi**, ko'rsatish 16-ekranda — nishon rost aytsin (151-qonun oilasi). `name` to'rttasi inglizcha ✓ |
| 29 | pasport · halollik qaydi | «eMaktab'dan» | «eMaktabdan» | o'zbekcha qo'shimcha oldidan apostrof kerak emas (B4 #1 «Uzum'dan» sinfi) |

Ichki joylar kaskad bilan tekislandi: 2-bo'lim 1- va 2-fikr (#6, #14), pasport «Keys» qatori (bank-matni qoldi + ekran-ifodasi izohi).

### B. Test-halollik o'lchovi (Intl.Segmenter, grapheme; ✓ birinchi)

| Ekran | Uzunliklar | max/min | ✓ / eng uzun distraktor | Oldin max/min (✓ nisbati) |
|---|---|---|---|---|
| 1 hook (ballsiz) | 45 / 37 / 36 | 1.25× | — | 1.43× |
| 6 bashorat (ballsiz; ✓ = muammodan) | 18 / 27 / 24 | 1.50× | — | 2.18× — tanlovlar ballsiz, ✓ eng uzun, lekin javob slaydda ochiladi va ball yo'q |
| 4 TEST-1 | 49 / 55 / 54 / 48 | 1.15× | 0.89 | 1.13× (0.91) |
| 7 TEST-2 | 39 / 40 / 44 / 37 | 1.19× | 0.89 | 1.19× (**1.00 — ✓ eng uzun edi**) |
| 9 TEST-3 | 47 / 53 / 56 / 45 | 1.24× | 0.84 | 1.12× (**1.02 — ✓ eng uzun edi**) |
| 11 TEST-4 | 39 / 41 / 37 / 36 | 1.14× | 0.95 | o'zgarmadi |

- **3-vs-1 shakl (§147):** T1 — «Endi», «Saytning», «Baholar», «Bu» — guruh yo'q. T2 — «Sayt…» ×1 («Saytda»), «Saytni» ×1 — ikkalasi distraktor, ✓ «Kechqurun» va «Shahrimizda» yakka; ✓ yagona yolg'iz emas. T3 — to'rt xil boshlanish. T4 — «… tanlanadi» to'rttasida (§99 namunasi), boshlanishi to'rt xil.
- **Mutlaq so'z (§110):** T1 — yo'q (eski «hamma sharti» olindi) · T2 — yo'q · T3 — yo'q · T4 — «Eng» faqat 3-variantda. ✓ larda yo'q.
- **§102 (distraktor darsda rost emasmi):** T1 — (2) rost fakt, lekin savol «qaysidan boshlasangiz» — 3-ekran va lead rad etadi; (3) 3-ekran kasbiy so'z; (4) Airbnb tartibi («biz» oxirida) keyin tasdiqlaydi. T2 — har distraktor 6-ekran besh qadamidan aniq bittasi (kutayotganlar · yechim · jamoa), ro'yxat tartibi rad etadi. T3 — (2) qiyinchilik, (3) kim uchun, (4) bosish-natija — uchalasi 8-ekran xulosasi bo'yicha «qo'shadi». T4 — (2) 10-ekran logotip tajribasi, (3)–(4) 10-ekran fidbeklari rad etadi.
- **§106 (oldingi 2 ekrandan ko'chirma):** T1 ✓ — 3-ekranda yo'q; lead bilan ma'nodosh, bu ataylab (savol «tinglovchi nimani bilmoqchi — shunga mos gap»). T2 ✓ — yangi olam (kompyuter klubi). T3 ✓ — 8-ekran gaplarida yo'q, «bu yerda» belgisi olindi (#16). T4 ✓ — 10-ekran matnida endi uchramaydi (#18).
- **Bitta himoyalanadigan to'g'ri:** T3 eski (3) «ko'rish mumkin» ikki ma'noli edi — almashdi. T2 (2) eski izoh bilan zid edi — almashdi.
- **§119 (hook):** fikr-so'rovi; sahna uchala tanlovni rost qiladi, javob uchalasini tasdiqlaydi (#1, #3).
- **§107:** 8-ekran Qo'shadi/Takrorlaydi 2/2 ✓.

### C. Mexanik tekshiruvlar

- Kirill `grep -cP '[\x{0400}-\x{04FF}]'` → **0**. Qiyshiq apostrof (U+2018 · U+2019 · U+02BB) → **0**.
- Sen-forma grep → 1 topilma: 17-qator — pasport «Format»dagi dasturlash-mashqi so'zi — soxta.
- Ichki jargon `yadro|artefakt|recap` → **0**; «Hook» — faqat ekran-yorlig'i.
- Residue: ekranlar ichida «→» faqat mexanika-tavsifida (bosish → natija), o'quvchi-matn iqtibosida **0**; 8-ekranda «kadr» → **0**; «varaq» faqat 6-ekran bashorati va slayd 1 da (o'ntacha qog'oz ma'nosida), qadamlar — «qadam»; «bozor» faqat pasport bank-qatorida.
- **§156 so'z-inventari:** «gap» — gap-jumla (besh gap, to'rt gap, kadr gapi); «tushuntirish nimadan boshlangan» — «gap» idiomasi ishlatilmadi. «kadr» — faqat uch kadrli ko'rsatuv (10, 13, 14, 15, 16, 18, 19). «qism» — faqat sayt qismi (5). «bo'lak» — faqat oldingi darsning dekompozitsiya bo'lagi (2, 4, 12, 13, nishon). «joy» — faqat bosiladigan joy (#9). «qadam» — faqat Airbnb besh qadami. «Mana, ishlaydi» — kadr nomi (PmLesson10), kundalik ma'noda; oldingi darsdagi «ishlaydi ↔ tayyor» farqiga tegmaydi (D-10).
- **§173:** 15-ekran — AI uchta savolga javob beradi, qayta yozmaydi; «Nimani almashtirishni siz hal qilasiz.» ✓. 12–13-ekranda AI yo'q.
- **§139:** 3 (xato so'z bosilishi), 5 (xato juftlik), 10 (uch joyning har biri o'z natijasi), 14 (xato sabab) — holat o'quvchining bosganidan chiqadi; oldindan yozilgan yakun-xulosa yo'q. 12–13-ekranlarda yig'ilgan gaplar o'quvchining o'z maydonlaridan.
- **Keys K12:** har gap bank bilan yonma-yon — birinchi tushuntirish · o'ntacha oddiy varaq · internetda ochiq · besh qadam (muammo · yechim · qancha odam kutayotgani = bozor · mahsulot · jamoa) · raqamsiz. Gloss «ijaraga turadigan sayt» — PmLesson14 dan (fakt emas, ta'rif). «"sayt qanday qurilgani" degan qadam yo'q» — besh qadam ro'yxatining o'zidan tekshiriladi (PmLesson14 burchagi). Qo'shimcha fakt yo'q. «investor» so'zi ekranga chiqmadi (bankda bor, lekin gloss talab qiladi va burchakka kerak emas).
- **eMaktab:** nom faqat 1-ekran lead'ida; da'vo — faqat «baholar bo'limi» darajasida (1, 8 va 10-ekran maketlari «bizning faraz»); tarix/raqam yo'q.
- **Sanoq-mosligi:** 5 gap (2, 12, 15, 16, 19 — 12-ekranda 6 maydon → 5 gap, ochiq yozilgan) · 3 kadr (2, 10, 13, 14, 16, 19) · 8-ekran — 4 gap, 2/2 · 3 qism va 3 o'xshatish (5) · 5 qadam (6, 7, 18) · 3 ko'rsatuv va 3 sabab (14) · 3 savol (15) · 8 flashcard · 12 arena savoli (3/3/3/3) · 19 ekran · 4 nishon.
- **Ekran-hajmi (≤400, ko'rinadigan proza; kartalar/variantlar/so'rov material sanalmaydi):** 1 ≈370 (edi 400) · 2 ≈200 · 3 ≈390 (sahna-gapi bilan; edi ≈411) · 5 ≈240 (fidbek bilan) · 6 ≈430 bashorat + eng uzun slayd bir vaqtda ko'rinsa (D-5), bashorat yig'ilsa ≈290 · 8 ≈360 · 10 ≈305 · 12 ≈215 (yorliqlar bilan) · 14 ≈200 · 15 ≈180 + so'rov (D-6) · 16 ≈380.
- **§144:** arena olamlari (kutubxona · oshxona · sport to'garagi) ekranlardagi olamlardan (eMaktab · kompyuter klubi · futbol · sinf sardori · kiyim) farqli; flashcard javoblarini takrorlamaslik yozilgan.
- `npm run lint:til -- pm-senariylar/BRIDGE-B6-QandayKorsatamiz.md` → **0 error**. Warn 7 ta, hammasi soxta va o'quvchi ko'radigan matndan tashqarida (uchtasini jurnalning o'zi qo'shadi): `zanjir-streak` — «Ip-zanjir», «Zanjir chapdan o'ngga», 6-bo'lim «bitta zanjir» (ichki so'z, streak emas) — soxta; `sen-forma` 1 marta — mexanik tekshiruv qatorining o'zi (sen-forma so'zini iqtibos qiladi), soxta. v1 dagi `sheva-toldiruvchi` (1-ekran sarlavhasidagi to'ldiruvchi so'z) #1 bilan yo'qoldi.

### D. Tuzilmaviy e'tirozlar (tuzatilmadi — foydalanuvchi/Quruvchiga)

1. **TEST-1 o'rgatilmagan qoidani so'raydi (S28).** 4-ekran «birinchi gap tinglovchi haqida» qoidasini tekshiradi, lekin undan oldingi yagona teoriya-ekran (3) faqat kasbiy so'zni o'rgatadi. Lead («Ota-ona bitta narsani bilmoqchi…») testni mulohaza bilan yechiladigan qiladi, reveal qoidani ochadi — shuning uchun hozircha qoldirildi. Muqobil: 3-ekran xulosasiga bitta gap yoki TEST-1 ni «qaysi gapda kasbiy so'z yo'q» savoliga o'girish (unda qoida 6-ekran Airbnb bilan birinchi marta ochiladi). Qaror kerak.
2. **12-ekran maydon tartibi o'zgardi (A #21).** v1 da besh gap foydadan boshlanardi («avval tinglovchi va foydasi — TEST-1 qoidasi»), endi Airbnb tartibida: odam va qiyinchiligi → birinchi versiya → natija → o'xshatish → so'rov. Ikkala qoida («odamdan boshlanadi») ham bajariladi, 6–7-ekran bilan ziddiyat yo'qoladi. Foyda birinchi bo'lishi kerak desangiz — qaytarish oson, lekin unda qolip ko'plik/birlik egaga moslanishi kerak (#21 sababi).
3. **13-ekran takror-tekshiruvi so'z-naqshga suyanadi** («bu yerda», «ko'rinib turibdi»). Yaxshi gapda ham chiqadi — sariq, saqlashni to'xtatmaydigan savol qilib yozildi. Quruvchiga: qizil qilinmasin.
4. **10-ekran tartiblash mexanikasi.** Kadr yorliqlari («Ilgari · Mana, ishlaydi · Endi») kartada boshidan ko'rinsa, tartiblash o'z-o'zidan yechiladi (yorliq tartibni aytadi). Taklif: kartalarda faqat ekran-rasmi va gap, yorliq tartiblangach chiqadi. Mexanika — Quruvchiga.
5. **6-ekran hajmi:** bashorat-matni + slayd + ko'prik bir vaqtda ≈430. Taklif: bashorat javob berilgach yig'ilsin (slaydlar navbat bilan chiqadi).
6. **15-ekran so'rov + o'quvchining besh gapi va uch kadri** — 400 dan oshadi (B4 D-6 bilan bir sinf). Taklif: so'rov default-yopiq «So'rovni ko'rish» yig'masida.
7. **5-bo'lim qisqarish-qoidasi noaniq:** «uchta ko'rsatuvdan bittasi (A) qoldiriladi» — «qoldiriladi» ikki ma'noli (qoladi / tashlanadi), va ikki ko'rsatuvga uch sabab-varianti mos kelmaydi. Aniqlash kerak: A olib tashlansa, «Kasbiy so'z bor» varianti ham ketadi.
8. **15-ekran persona — har doim ota-ona** («farzandingiz maktabda o'qiydi»). O'quvchining g'oyasi o'yin yoki kiyim bo'lsa ham tinglovchi ota-ona bo'lib qoladi. Kod bilmaydigan tinglovchi sifatida ishlaydi, lekin umumiyroq persona («kod umuman bilmaydigan odam») ham mumkin. Qaror kerak.
9. **6-bo'lim 3-savoli v1 iborasini iqtibos qiladi** («beshtasining hech biri…»). Ekranda endi PmLesson14 ifodasi («"sayt qanday qurilgani" degan qadam yo'q») — savolning mazmuni o'zgarmagan, savolga tegilmadi.
10. **«Mana, ishlaydi» kadr nomi** — oldingi dars «ishlaydi» va «tayyor» farqini o'rgatgan. Kadr nomi PmLesson10 dan, kundalik ma'noda; to'qnashuv xavfi past, 👦 o'qishda kuzatilsin.
11. **TEST-4 ✓ «Ish chindan bajariladigan joy» 10-ekranda nomlanmaydi** — §106 uchun ataylab (#18): o'quvchi uni tajribada ko'radi, reveal va flashcard 8 nomlaydi. Distraktorlar 10-ekran tajribasi bilan rad etiladi, S28 xavfi past.
12. **Hook sahnasidagi «bazadan chiqadi»** 3-ekran gapiga yaqin — ataylab: kasbiy so'z hodisasi atamadan oldin ko'rinadi (induktiv). 3-ekran «Qaysi so'zda tushunmay qoladi?» savoli hookdagi ota-ona savoliga javob bo'lib ulanadi (§163).
