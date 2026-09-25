# Bridge · «Kim uchun va qanday muammo?» — dars rejasi

> Holat: QORALAMA v1 → metodist korrekturasi ✅ (2026-09-23, jurnal fayl oxirida) → kelishildi (20:40) → **foydalanuvchi fidbegi 1–7-ekran + to'liq qayta ko'rik kiritildi ✅ (2026-09-23 23:17) — GATE S** → qurish.
> Namuna: `BRIDGE-B1-KimUchun.md` · Manba darslar: `1-Modull/PmLesson1` (auditoriya), `PmLesson2` (struktura), `2-Modull/PmLesson4` (muammo → yechim), `pm/PmJtbdLesson` (JTBD), «muammoni izlash» g'oyalari — `BRIDGE-B2-MuammoniTopamiz.md` bilan bir xil.

## 1. Dars pasporti

| | |
|---|---|
| Kim o'tadi | Node-Express'ga va NestJS'ga qo'shiladigan o'quvchi (3 darsning 1-si). Bu o'quvchi texnikada kuchli, lekin PM ko'rmagan |
| Mavzular (5) | Auditoriya + Struktura (bitta blok) · Muammoni qanday izlash · Muammo → yechim · Jobs-to-be-Done |
| Maqsad | O'quvchi o'zi tanlagan g'oyaga **to'rt savolli karta** yozadi: sayt kim uchun · odam qanday muammoga duch keladi (qachon · nimasi og'ir) · sayt nima qiladi · odam oxirida nimaga erishadi |
| Misol-ip | **Uzum Market** — boshidan oxirigacha: kim kiradi va birinchi nimaga qaraydi → Uzum bo'lmaganda xarid qanday edi → ilovadagi to'rt narsa qaysi muammoga javob → odam telefonning o'zini emas, «do'konga bormay, ertaga qo'lida bo'lishini» oladi |
| Keys | K1 Uzum — ip bilan bitta olam; keys **bir marta** hikoya bo'lib kiradi (6-ekran), faqat bank-faktlari |
| O'z ishi | O'z g'oyasi kartasi — 4 savol (muammo savolida ikki yozuv joyi: qachon · nimasi og'ir). Keyingi ikki darsga o'tadi |
| Format | 20 ekran · mentor bilan jonli · 90 daqiqa · uyga vazifa, koding, LMS yo'q · UZ + RU |

**Eng og'ir bridge dars.** Besh mavzu 4 blokka yig'ildi; har blok — bitta g'oya, bitta harakat, bitta test. Chuqurlik emas, tasavvur darajasi.

## 2. Darsning to'rt asosiy fikri

1. **Auditoriya — ehtiyoji o'xshash odamlar guruhi.** Uni tushunish uchun guruhdagi bitta odamni aniq vaziyatda tasavvur qilamiz. Sahifaning eng ko'zga tashlanadigan joyida — ular birinchi qiladigan ish.
2. **Muammo belgilar bilan topiladi** (takrorlanadi · odam o'zicha chora izlaydi · vaqt yoki pul ketadi · ba'zan voz kechadi) va aniq gap bilan yoziladi: kim · qachon · nimasi og'ir. O'zicha chora — muammo odamga befarq emasligini ko'rsatadi, lekin uning kuchini yolg'iz o'zi isbotlamaydi.
3. **Har yechim bitta muammoga javob beradi.** Qaysi muammoga javob ekani topilmagan narsa ro'yxatdan chiqadi.
4. **Odam mahsulotning o'zini emas, u beradigan natijani oladi.** Telefonning o'zi emas — «do'konga bormay, ertaga qo'limda bo'lsin».

Ip-zanjir: **Uzumga kim kiradi → Uzum bo'lmaganda muammo qayerda edi → ilovadagi to'rt narsa qaysi muammoga javob → odam aslida nimani oladi → o'z g'oyam kartasi.**

> **Uzum halolligi:** Uzum haqida ikki xil manba bor va ular aralashtirilmaydi. (1) **Ko'rinadigan narsalar** — ilovada hozir bor: tepadagi qidiruv qatori, kategoriyalar, savat, mahsulot sahifasidagi yetkazib berish muddati, topshirish punktlari, mahsulot sharhlari va bahosi (qurishda ilovaning hozirgi ko'rinishi bilan tekshiriladi; «ertaga yetkazib berish» **filtri** v1 da bor edi — ilovada borligi tasdiqlanmagan, olib tashlandi). (2) **Bank-faktlari (K1)** — faqat 6-ekranda, ekranda ehtiyotkor ifodada (foydalanuvchi qarori 23:17: «yetkazib berish har doim ham yo'q edi», «dastlabki asosiy e'tibor — yetkazib berish»; bank faktidan kuchli xulosa chiqarilmaydi): 2022-yil oktabrda ochilgan · saytdan emas, yetkazib berishdan boshlagan: o'z mashinalari, topshirish punktlari, ertasi kuni yetkazish · chunki undan oldin odamlar Instagram va Telegram guruhlaridan yetkazib berishsiz olardi · 2024-yil martda O'zbekistonning birinchi «yagona shoxli»si (1 mlrd dollardan qimmat kompaniya — atamani tushuntirish uchun summa aytiladi) · oyiga ~17 mln foydalanuvchi (2025). Bundan boshqa raqam, tarix va ichki qaror aytilmaydi. «Nega qidiruv tepada» kabi savollarga javob Uzumning qarori sifatida emas, xaridorning harakati sifatida beriladi. 5-ekrandagi «Uzum hali yo'q paytdagi xarid» — umumiy hayot tajribasi, Uzum tarixi emas. 10-ekrandagi taklif — Uzum jamoasiniki emas, nomsiz «internet-do'kon ilovasi»niki.

---

## 3. Ekranlar

### KIRISH

**1 · Hook** — ovoz berish (hamma javob to'g'ri)
- Sarlavha: «Uzumga oxirgi marta nima sababdan kirgansiz?»
- Kichik yozuv (sarlavha ostida): «Uzumga kirmagan bo'lsangiz — boshqa internet-do'konni o'ylang.»
- Variantlar: Aniq bir narsani izlab topish uchun · Narxlarni solishtirib ko'rish uchun · Buyurtmam qayerdaligini bilish uchun · Shunchaki ko'rib chiqish uchun
- Javob (ovozdan keyin): «To'rttasi ham odatiy sabab. Bitta odam ilovaga turli kuni turli maqsadda kiradi. Bugun odamlar ilovaga nima uchun kirishini va ularga nima kerakligini ko'rib chiqamiz.» (hech bir tanlov rad etilmaydi; «muammo» so'zi hali aytilmaydi)

**2 · Maqsad** — jonli preview
- Sarlavha: «Dars oxirida nimani qila olasiz?»
- Matn: «Dars oxirida o'zingiz tanlagan g'oya haqida to'rt savolga javob yozasiz: sayt kim uchun, odam qanday muammoga duch keladi, sayt nima qiladi va odam oxirida nimaga erishadi.»
- Vizual: to'rt savol-javob birma-bir yozilib chiqadi; to'rtinchisi yonida «✓ TAYYOR» shtampi («yollandi» so'zi 11-ekrandan oldin ekranga chiqmaydi).

### 1-BLOK · KIM UCHUN VA BIRINCHI NIMA KO'RINADI

**3 · Ikki vaziyat, bitta ilova** — bosib ochish
- Sarlavha: «Uzumga kirgan ikki odam nimaga ko'proq qaraydi?»
- Ikki karta: «Yangi telefon izlayotgan o'quvchi» · «Ertaga sovg'a bermoqchi bo'lgan o'quvchi». Bosilganda ilova sxemasida (brendsiz) har biri eng ko'p qaraydigan joy yonadi: biri — sharhlar va baho («yaxshi telefonmi?»), ikkinchisi — mahsulot sahifasidagi yetkazib berish muddati («ertaga yetib keladimi?»).
- Xulosa: «Bitta saytga kirgan odamlarning maqsadi har xil bo'ladi. Hammaga yozilgan gapda hech kim o'zini tanimaydi. Saytdan foydalanadigan, ehtiyoji o'xshash odamlar guruhi **auditoriya** deyiladi. Ular kirganda birinchi qiladigan ish ko'zga tashlanib tursin: Uzumda xaridor odatda avval kerakli narsani qidiradi — qidiruv qatori tepada.»

**4 · TEST-1** (ball)
- Lead: «Sahifa tepasida faqat "Bizda hamma narsa bor!" deb yozilgan.» Cue: «Bunday sahifaning asosiy kamchiligi nimada?»
- ✓ Uni o'qigan odam sayt aynan unga kerakligini tushunmaydi · Uni qurish oddiy sahifadan ancha qimmatga tushadi · Unda sahifalar oddiy saytdan sekinroq ochiladi · Uni reklamasiz internetda hech kim topolmaydi
- Reveal: «To'g'ri. "Hamma narsa" — juda umumiy gap. Telefon izlayotgan o'quvchi ham, sovg'a bermoqchi bo'lgan o'quvchi ham unda o'ziga kerakli narsani ko'rmaydi.»
- Xato-izohlar (bir gap): qimmat → «Gap narxda emas. Sahifani o'qigan odam nimani o'ylaydi?» · sekin → «Gap tezlikda emas. Bu gap kimga aytilgan?» · reklama → «Gap topishda emas. Sahifani ochgan odam unda o'zini ko'radimi?»

### 2-BLOK · MUAMMO QAYERDA BO'LADI

**5 · Muammoning to'rt belgisi** — bosib ochish
- Sarlavha: «Tumanda yashaydigan odam telefon sotib olmoqchi bo'lsa, nima qilardi?»
- Kichik sarlavha (kartalar ustida): «Muammo borligini qanday bilamiz?»
- To'rt karta, bitta odam — tumanda yashaydigan xaridor:
  - Muammo qayta-qayta takrorlanadi — har safar katta shaharga borishi kerak
  - Odam o'zicha chora izlaydi — shaharga ketayotgan tanishidan «olib keling» deb so'raydi
  - Vaqt yoki pul yo'qotadi — borib-kelishga bir kun va yo'l haqi ketadi
  - Ba'zan kerakli narsasidan voz kechadi — «Mayli, olmay qo'ya qolay» deydi
- Xulosa: «Odam muammoni o'zicha hal qilishga urinayotgan bo'lsa, bu muammo unga befarq emasligini ko'rsatadi. Belgilar qancha ko'p bo'lsa, muammo shuncha rost.»

**6 · Keys: Uzum** — bashorat + 3 slayd (bank-faktlari)
- Sarlavha: «Uzum dastlab qaysi muammoga javob berdi?»
- Bashorat: «2022-yil oktabr, Uzum Market ishga tushyapti. Sizningcha, Uzum avval nimaga e'tibor qaratdi?» — Narsani xaridorga yetkazib berishga · Chiroyli sayt va qulay ilovaga · Televizor va ko'chadagi reklamaga
- Slaydlar:
  1. «Undan oldin ko'pchilik narsani Instagram va Telegram guruhlaridan xarid qilardi. Lekin narsani xaridorga yetkazib berish har doim ham yo'q edi.»
  2. «Uzumning dastlabki asosiy e'tibori narsani xaridorga yetkazib berishga qaratildi: o'z mashinalari, topshirish punktlari (buyurtmani borib oladigan joy) va ertasi kuni yetkazish.»
  3. «2024-yil martda Uzum O'zbekistonda 1 milliard dollardan qimmat baholangan birinchi kompaniya bo'ldi. Bunday kompaniyalarni "yagona shoxli" deb atashadi. 2025-yilda Uzumga oyiga 17 millionga yaqin odam kirgan.»
- Ko'prik: «Odamlar kerakli narsani Instagram va Telegram orqali topishi mumkin edi, lekin uni xaridorga yetkazib berish masalasi hal qilinmagan edi. Uzum shu muammoga javob beradigan xizmatni yo'lga qo'ydi.»

**7 · TEST-2** (ball)
- Lead: «Qo'shningiz har safar biror narsa kerak bo'lsa, Telegram guruhga "Toshkentdan kim olib kelib beradi?" deb yozadi.» Cue: «Bu nimani ko'rsatadi?»
- ✓ U narsa olish muammosini o'zicha hal qilyapti · U guruhda ko'proq gaplashishni yaxshi ko'radi · Bu shunchaki odat — orqasida muammo yo'q · Unga o'sha narsalar unchalik shart emas
- Reveal: «To'g'ri. U kerakli narsani olish uchun har safar boshqa odamdan yordam so'rayapti. Bu — muammoni o'zicha hal qilishga urinayotganining belgisi.»
- Xato-izohlar: gaplashish → «U guruhga suhbat uchun emas, narsa olish uchun yozadi.» · odat → «Har safar birovdan so'rash — oddiy odat emas. U qulay yo'l topa olmaganini ko'rsatishi mumkin.» · shart emas → «Har safar boshqa odamdan so'rashi — unga o'zi uchun qulay yechim topilmaganini ko'rsatishi mumkin.»

**8 · Aniq gap yig'ing** — konstruktor
- Sarlavha: «"Xarid qilish qiyin" gapini qanday aniq qilasiz?»
- Lead (sarlavha ostida): «Voqea: tumanda yashaydigan xaridor telefon olmoqchi bo'ldi va bir kunini shaharga borib-kelishga sarfladi.»
- Uch bo'lak, har birida 3 variant (✓ birinchi). Noto'g'ri variantlar ham tabiiy eshitiladi — faqat voqeadagi aniq ma'lumotni bermaydi (2-o'tish 2-darsi 7-ekrani bilan bir qoida):
  - KIM: tumanda yashaydigan xaridor · hamma odamlar · shahardagi xaridorlar
  - QACHON: telefon olmoqchi bo'lganda · bayram oldidan · dam olish kunlari
  - NIMASI OG'IR: bir kunini yo'lga sarflaydi · do'konlardan norozi · narsa tanlashda qiynaladi
- Gap-qolipi: «{QACHON} {KIM} {NIMASI OG'IR}.» — har juftlik tugal chiqadi («Bayram oldidan shahardagi xaridorlar do'konlardan norozi.» · «Dam olish kunlari hamma odamlar narsa tanlashda qiynaladi.»).
- ✕ tanlansa, bir qator: KIM — «Kim ekani aniq emas: qaysi odam, qayerda yashaydi?» · QACHON — «Voqeada bu vaqt yo'q: u telefon olmoqchi bo'lgan edi» · NIMASI OG'IR — «Norozi yoki qiynaladi — lekin aynan nima bo'ldi, nima ketdi?»
- Natija-gap: «Telefon olmoqchi bo'lganda tumanda yashaydigan xaridor bir kunini yo'lga sarflaydi.»
- Xulosa (harakatdan keyin): «Uchala bo'lagi bor gap **aniq muammo** deyiladi. "Xarid qilish qiyin" esa nolish: undan nimani tuzatish kerakligi bilinmaydi.»

### 3-BLOK · MUAMMODAN YECHIMGA

**9 · Har narsa — bitta javob** — bosib ochish
- Sarlavha: «Uzum ilovasidagi bu to'rt narsa qaysi muammoga javob beradi?»
- Ilova sxemasida 4 joy bosiladi, har biri o'z muammosini ochadi:
  - «Yetkazib berish muddati — narsa qachon kelishi oldindan bilinadi»
  - «Topshirish punkti — uyda kutmaysiz, qulay vaqtda borib olasiz»
  - «Sharhlar va baho — ushlab ko'rmay turib ham, boshqalar fikriga qarab tanlaysiz»
  - «Qidiruv qatori — kerakli narsani varaqlab o'tirmay topasiz»
- Xulosa: «Har biri bitta aniq muammoga javob beradi. Muammoga javob beradigan shunday narsa **yechim** deyiladi.»

**10 · TEST-3** (ball)
- Lead: «Internet-do'kon ilovasi jamoasida kimdir taklif qildi: "Ilova ochilganda chiroyli animatsiya qo'shaylik".» Cue: «Birinchi qaysi savolni berasiz?»
- ✓ Bu kimning qaysi muammosini hal qiladi? · Bu animatsiya necha kunda tayyor bo'ladi? · Bu animatsiya qaysi rangda chiroyliroq? · Boshqa ilovalarda ham animatsiya bormi?
- Reveal: «To'g'ri. Uzumdagi to'rt narsaning har biri bitta muammoga javob edi. Animatsiya ham avval shu savoldan o'tadi.»
- Xato-izohlar: kunlar → «Qancha vaqt ketishi keyin so'raladi. Avval: bu kimga kerak?» · rang → «Rang — keyingi savol. Avval: bu qaysi muammoga javob?» · boshqa ilovalar → «Boshqalarda borligi — sabab emas. Bu kimning muammosini hal qiladi?»

### 4-BLOK · ODAM ASLIDA NIMANI OLADI

**11 · Telefon emas — natija** — bosib ochish
- Sarlavha: «Uzumdan telefon olgan odam aslida nimani oldi?»
- Uch karta ochiladi (oldida — odam nima qildi, orqasida — aslida nimaga erishdi):
  - «Telefon buyurtma qildi» → «Do'konga bormay, ertaga telefonli bo'ldi»
  - «Eng yangi modelni tanladi» → «Do'stlari orasida zamonaviy ko'rinadi»
  - «Onasiga sovg'a buyurtma qildi» → «Onasini xursand qildi»
- Xulosa: «Odam mahsulotning o'zini emas, u beradigan natijani oladi. Odam erishmoqchi bo'lgan natija **vazifa** deyiladi (Jobs-to-be-Done) — uy vazifasi emas, odam hayotida bajarmoqchi bo'lgan ish. Mahsulotni odam go'yo shu ishga yollaydi.»

**12 · TEST-4** (ball)
- Lead: «Sinfdoshingiz bir oy ichida yugurish poyabzali oldi, telefoniga mashq ilovasini yukladi va sport soati taqdi.» Cue: «U bularning hammasi bilan aslida nimaga erishmoqchi?»
- ✓ Sog'lom, baquvvat va chaqqon bo'lishga · Yangi yugurish poyabzaliga ega bo'lishga · Mashq ilovasidan har kuni foydalanishga · Qo'lida sport soati bilan yurishga
- Reveal: «To'g'ri. Poyabzal, ilova va soat — shu natija uchun olingan mahsulotlar. Vazifa — sog'lom va baquvvat bo'lish.»
- Xato-izohlar: poyabzal → «Poyabzal — mahsulot. U nima uchun olindi?» · ilova → «Ilovadan foydalanish — harakat. Oxirida u nimaga erishadi?» · soat → «Soat — mahsulot. Uni taqib nimaga erishmoqchi?»

**13 · Juftini toping** — juftlash (ballsiz)
- Sarlavha: «Har mahsulot qaysi vazifaga yollangan?»
- 4 juft: velosiped → maktabga tez yetib borish · budilnik → ertalab vaqtida uyg'onish · til o'rgatuvchi ilova → chet tilida erkin gapirish · rangli telefon g'ilofi → do'stlar orasida ajralib turish.
- Xulosa: «Vazifa — mahsulotning nomi ham, u bilan qilinadigan harakat ham emas. Bu — odam erishadigan natija.»

### O'Z G'OYANGIZ

**14 · To'rt savolli karta** — ustaxona, bittalab
- Sarlavha: «Tanlagan g'oyangiz haqida to'rt savolga javob bera olasizmi?»
- Mentor (1 gap): «To'rt savolga javob bering — ular bitta kartaga yig'iladi.»
- 4 savol navbat bilan, yorliqlar savol shaklida, namunalar kesim shaklida. Muammo savolida ikki yozuv joyi bor (qachon · nimasi og'ir), KIM birinchi savoldan o'zi qo'shiladi:
  - «Sayt kim uchun?» — namuna: «hovlida futbol o'ynaydigan o'smirlar»
  - «Odam qanday muammoga duch keladi?» — ikki joy: «Qachon?» (namuna: «kechqurun, maktabdan keyin») · «Nimasi og'ir?» (namuna: «maydonga borib, uni band holda topadi»); gap 8-ekran qolipi bilan yig'iladi: «{QACHON} {KIM} {NIMASI OG'IR}.»
  - «Sayt nima qiladi?» — namuna: «bo'sh vaqtni ko'rsatib, band qilib beradi»
  - «Odam oxirida nimaga erishadi?» — namuna: «do'stlari bilan kutmasdan o'ynaydi»
- Tekshiruvlar: KIM da «hamma» → «"Hamma" — bu hali auditoriya emas. Kim, qaysi vaziyatda?»; YECHIM da sifat-so'z («chiroyli, zamonaviy, qulay») → «Bu — baho. Sayt aynan nima qiladi?»; VAZIFA da mahsulot nomi yoki harakat → «Bu — mahsulot yoki harakat. Odam oxirida nimaga erishadi?».
- G'oyasi yo'q o'quvchiga 4 tayyor g'oya (1-o'tish 1-darsidagi olam; bu yerda to'rt savolga to'ldirildi, qolipga qo'yib tekshirildi):

  | Olam | KIM | QACHON | NIMASI OG'IR | SAYT NIMA QILADI | ODAM NIMAGA ERISHADI |
  |---|---|---|---|---|---|
  | Futbol | hovlida futbol o'ynaydigan o'smirlar | Kechqurun, maktabdan keyin | maydonga borib, uni band holda topadi | bo'sh vaqtni ko'rsatib, band qilib beradi | do'stlari bilan kutmasdan o'ynaydi |
  | O'yin | onlayn o'yin o'ynaydigan o'quvchilar | Jamoaviy bellashuv o'rtasida | sherigi chiqib ketib, yutqazib qo'yadi | darajasi va vaqti mos jamoadosh topib beradi | o'yinni oxirigacha o'ynab, yutadi |
  | Sinf | sinf sardori | Ustozga sovg'aga pul yig'ilganda | kim bergani, kim bermaganini adashtirib yuboradi | kim pul berganini belgilab boradi | sovg'ani janjalsiz, vaqtida oladi |
  | Kiyim | internetdan kiyim oladigan o'smir | Posilkani ochganda | kiyim to'g'ri kelmay, qaytarishga ovora bo'ladi | bo'y va vaznga qarab mos o'lchamni ko'rsatadi | birinchi urinishdayoq mos kiyim oladi |

- **3-dars uchun qo'shimcha ikki ustun (1-dars ekranida ko'rinmaydi; kartasiz o'quvchi 3-darsda tayyor g'oya tanlaganda uning birinchi bo'lagi va bitta sharti shu yerdan tushadi — 3-o'tish 3-darsi 12–13-ekran, 4-o'tish 3-darsi 13/15-ekran; qaror 2026-09-23 21:29, 4-o'tish 3-darsi metodist D-5):**

  | Olam | BIRINCHI BO'LAK | 1 SHART — foydalanuvchi nima qiladi? → shundan keyin nima bo'ladi? |
  |---|---|---|
  | Futbol | bo'sh vaqtni band qilish | Bo'sh vaqt bosilsa → «Band qilindi» yozuvi chiqadi |
  | O'yin | mos jamoadosh topish | «Qidirish» bosilsa → darajasi mos o'yinchilar ro'yxati chiqadi |
  | Sinf | pul berganni belgilash | Ism bosilsa → yonida ✓ chiqadi |
  | Kiyim | mos o'lchamni ko'rsatish | Bo'y va vazn yozilsa → bitta mos o'lcham chiqadi |

- Saqlanadi: ekranda faqat «✓ Karta saqlandi» (ochilish-va'dasi ekranga chiqmaydi, §17).

**15 · Sherik-tekshiruv** — 3 tayyor kartaga hukm
- Sarlavha: «Har kartada bitta qator chala. Nimasi yetishmaydi?»
- Karta 1: MUAMMO «Odamlar ko'p ovqat buyurtma qiladi» · Karta 2: YECHIM «Zamonaviy va qulay ilova» · Karta 3: VAZIFA «Ilovani ochadi». Har karta uchun o'quvchi sababni bitta umumiy uch variantdan tanlaydi: «Nimasi og'irligi aytilmagan» · «Sayt nima qilishi aytilmagan» · «Natija emas, harakat yozilgan» (har sabab aynan bitta kartaga tushadi).
- Xulosa: «Har qatorning o'z savoli bor: muammoda — nimasi og'ir, yechimda — sayt nima qiladi, vazifada — odam nimaga erishadi.»

### AI BILAN

**16 · AI — foydalanuvchi rolida**
- Sarlavha: «Kartangizdagi odam bu muammo haqida nima der edi?»
- Ekran boshida, so'rovdan OLDIN, bir gap: «AI kartangizdagi odam o'rnida javob beradi. Kartada nima qolishini o'zingiz hal qilasiz.»
- So'rov o'zi yig'iladi (default-yopiq «So'rovni ko'rish» yig'masida, «Nusxalash» tugmasi ko'rinib turadi):
  > «Siz shunday odamsiz: [KIM]. Menimcha, sizda shunday muammo bor: [QACHON] [NIMASI OG'IR]. Javob bering: 1) Bu sizda oxirgi marta qachon bo'lgan? 2) O'shanda aslida nimaga erishmoqchi edingiz? Mahsulot taklif qilmang, faqat o'z vaziyatingizni aytib bering.»
- «Nusxalash» → gemini.google.com → o'quvchi javobni kartasidagi muammo va «odam oxirida nimaga erishadi» javobi bilan solishtiradi, o'zi tuzatadi yoki qoldiradi.
- **Zaxira yo'l (majburiy):** «Gemini ochilmasa» tugmasi → ekranda o'sha ikki savol katta yozuv bilan chiqadi: «Bu sizda oxirgi marta qachon bo'lgan?» · «O'shanda aslida nimaga erishmoqchi edingiz?» Sherigingiz kartangizdagi odam o'rnida javob beradi, siz javobni kartangiz bilan solishtirasiz. Zaxira yo'l ayblamaydi, ishlaydigan yo'l beradi.
- Qoida ekranda: «AI — o'ylab topilgan bitta odam, haqiqiy foydalanuvchi emas. Kartada nima qolishini siz hal qilasiz.»

### YAKUN

**17 · Juftlik** — ballsiz
- Sarlavha: «Sherigingiz g'oyangizni 30 soniyada tushuna oladimi?»
- Yo'riq: «Sherigingizga 30 soniyada aytib bering: g'oyangiz kim uchun va o'sha odam oxirida nimaga erishadi.» → «Sherigingiz nima dedi? Bir qatorga yozing.»

**18 · Podium** — jonli ball natijasi (ballsiz, harakatsiz)
- Mentor ekranida: 4 testdagi ball bo'yicha birinchi uch o'rin (ism · ball), qolganlar ro'yxat bo'lib ostida. O'quvchi ekranida: o'z bali va o'rni.
- Sarlavha: «Testlarda kim eng ko'p ball to'pladi?»
- Matn yo'q, bayram animatsiyasi 3 soniya; mentor g'oliblarni bir gap bilan tabriklaydi va arenaga o'tadi.

**19 · Flashcard** (5 ta — hamma darsda 5)

| Old tomoni | Orqa tomoni |
|---|---|
| Auditoriya nima? | Saytdan foydalanadigan, ehtiyoji o'xshash odamlar guruhi |
| Odam o'zicha chora izlasa, bu nimani ko'rsatadi? | Muammo unga befarq emas |
| Aniq muammo qaysi uch bo'lakdan iborat? | Kim · qachon · nimasi og'ir |
| Yangi taklif kelsa, birinchi qaysi savol beriladi? | Bu kimning qaysi muammosini hal qiladi? |
| Odam aslida nimani oladi? | Mahsulotning o'zini emas, u beradigan natijani |

**20 · Arena + yakun**
- Arena: 12 savol (3/3/3/3), to'rt blokdan teng, ekran savollarining nusxasi emas (§144: boshqa vaziyat — Uzum va sport o'rniga masalan maktab oshxonasi, o'yin ilovasi, kitob do'koni).
- Yakun — 4 qator (to'rt blok):
  - Sayt ehtiyoji o'xshash aniq odamlar uchun qilinadi.
  - Muammo belgilar bilan topiladi va aniq gap bilan yoziladi: kim, qachon, nimasi og'ir.
  - Har yechim bitta muammoga javob beradi.
  - Odam mahsulotning o'zini emas, u beradigan natijani oladi.
- Mentor og'zaki: «Backend modulida shu kartadagi ma'lumot qayerda va qanday saqlanishini hal qilasiz.»

---

## 4. Ball va nishonlar

| | |
|---|---|
| Ballik testlar | 4 · 7 · 10 · 12 — har biri o'z blokidan keyin |
| Yakuniy sinov | Arena (12 savol) |
| Nishonlar (4) — `name` inglizcha, `desc` o'zbekcha | **Clear Problem!** (8) — «"Xarid qilish qiyin" gapini aniq muammoga aylantirdingiz» · **Perfect Match!** (13) — «To'rt mahsulotni o'z vazifasiga ulab chiqdingiz» · **Idea Card!** (14) — «O'z g'oyangiz uchun to'rt savolli karta yozdingiz» · **Nice Catch!** (15) — «Uch kartadagi chala qatorni topdingiz» |

## 5. Vaqt (90 daqiqa)

| Qism | Ekranlar | Daqiqa |
|---|---|---|
| Kirish | 1–2 | 5 |
| 1-blok · Kim uchun | 3–4 | 10 |
| 2-blok · Muammo qayerda | 5–8 | 22 |
| 3-blok · Muammodan yechimga | 9–10 | 10 |
| 4-blok · Aslida nimani oladi | 11–13 | 15 |
| O'z g'oyasi + sherik | 14–15 | 12 |
| AI + juftlik | 16–17 | 8 |
| Yakun | 18–20 | 5 |
| Bufer | | 3 |

Bufer 3 daqiqa — bu dars zich. Sinovda vaqt yetmasa, 13-ekran (juftlash) qisqartiriladi.

## 6. Kelishib olinadigan joylar

1. **Ip va keys bitta olam — Uzum.** Ko'rinadigan narsalar bilan bank-faktlari qat'iy ajratilgan (2-bo'lim). Ma'qulmi?
2. **Dars zich** (5 mavzu, 4 blok, 20 ekran, bufer 3 daqiqa). Mentor sinovida vaqt yetmasa, birinchi qisqaradigan joy — 13-ekran. Rozimisiz?
3. **Testlar 1 va 3 — 1- va 2-bridge darslardagi tasdiqlangan testlar bilan bir xil** (TEST-3 lead'i «internet-do'kon ilovasi»ga moslandi). **TEST-2** esa shu ipga moslandi: lead Uzum-olamidagi xaridga, bitta distraktor «o'sha narsalar»ga o'tdi. Bu o'quvchilar u darslarni ko'rmaydi, shuning uchun takror emas. Ma'qulmi?
4. **JTBD atamasi** bitta blokda tasavvur darajasida. React modulidagi to'liq JTBD darsini bu o'quvchi ko'rmaydi; Backend darslarida atama uchrasa, shu blok asos bo'ladi.

**Foydalanuvchi qarorlari (2026-09-23 20:40, `feedback/F-0923-bridge/SAVOLLAR_2026-09-23.md` 2-bo'lim — «hammasiga tavsiyang bo'yicha»):**
- 2.1 TEST-1 tayanchi — **(a)**: 3-ekran xulosasiga «Hammaga yozilgan gapda hech kim o'zini tanimaydi» kirdi, qolgani qisqartirildi (yuqorida, ≈396). Jurnal D-1 yopildi.
- 2.2 11-ekran vazifa turlari — **(a) yorliqsiz qoladi** (uch karta uchala turni o'zi ko'rsatadi). Jurnal D-5 yopildi.
- 2.3 14-ekran 4 tayyor g'oya jadvali (5 qator) — **tasdiqlandi**, o'zgarishsiz; shu 4 g'oya 3/4-o'tish 2- va 3-darsiga kartasiz o'quvchi uchun o'tadi. Jurnal D-9 yopildi.
- 2.4 «vazifa» so'zi — **qoladi** (ta'rif-gap yopadi, dars uyga vazifasiz). Jurnal D-8 yopildi.
- 2.5 Tez tasdiqlar (Uzum bitta olam · zich dars, 13-ekran birinchi qisqaradi · TEST-1/3 takror emas) — **ok**.
- 2.6 Quruvchiga qoldirilganlar (Uzum skrinshot-tekshiruvi D-2 · TEST-4 teli D-3 · 5-ekran kartalari D-4 · 16-ekran yig'ma D-6 · 15-ekran sabab-to'plami D-7 · mentor gapi D-10) — o'zgarishsiz, qurish bosqichida.
- Senariy **GATE S dan o'tdi** — qurish navbatini kutadi.

---

**Foydalanuvchi ko'rigi (23:17, 1–7-ekran fidbegi + «qolganini o'zing ko'rib halol tuzat»):**
- Fidbek bo'yicha: **1** «nima sababdan», payoff «muammo»ni erta aytmaydi, Uzumga kirmagan o'quvchiga kichik yozuv · **2** «sayt kim uchun · qanday muammoga duch keladi · oxirida nimaga erishadi» · **3** «sovg'a bermoqchi bo'lgan», auditoriya = ehtiyoji o'xshash odamlar guruhi · **4** cue «asosiy kamchiligi», reveal · **5** sarlavha tarixiy da'vosiz, to'rt belgi bir darajada («ba'zan voz kechadi»), xulosa «befarq emasligini ko'rsatadi» · **6** sarlavha, uch slayd va ko'prik ehtiyotkor ifodada (bank bilan tekshirildi — zid emas), «yagona shoxli» ta'rifi «qimmat baholangan» · **7** reveal, xato-izohlar «ko'rsatishi mumkin».
- O'zim topib tuzatdim: **8** QACHON/NIMASI OG'IR distraktorlari tabiiy (2-o'tish 2-darsidagi fidbek bilan bir sinf) + voqea-lead · **9–10** «yo'qotadi» → «hal qiladi / javob beradi» (2-ekran fidbegi bilan izchil) · **11** «vazifa» ta'rifiga «uy vazifasi emas» izohi (yuqori fidbekdagi xavotir) · **13** «har kuni o'rganish odati» — harakat edi, natija emas → «chet tilida erkin gapirish» · **14** «to'rt qatorli» → «to'rt savolli karta», muammo savolida ikki yozuv joyi ochiq aytildi, «band qildiradi» → «band qilib beradi», «mos kiyim kiyadi» → «oladi» · **16** AI maqsad-gap + zaxira (sherik javob beradi) · **17** sarlavha · **18** Podium mazmuni yozildi · **19** flashcard 5 · kaskad: 2-bo'lim fikrlari, yakun qatorlari, nishon tavsifi.
- «vazifa» atamasi — **qoladi**, izoh bilan (foydalanuvchi: «yo'q, yaxshi, qabul», 2026-09-23).
- Senariy **GATE S dan o'tdi**.

## Korrektura-jurnali (pm-metodist, 2026-09-23)

Tuzilma, ekran soni (20), mexanika, ball-joylari (4 · 7 · 10 · 12), blok-tartibi o'zgarmadi; 9-blokli formatga qaytarilmadi (uyga vazifa, koding yo'q). Variantlarda ✓ birinchi yozilgan — qurishda pozitsiyani Jonli aralashtiradi. Asl v1 nusxasi: scratchpad `B4-v1-orig.md`.

### A. Tuzatishlar (❌ → ✅ · sabab)

| # | Ekran | ❌ edi | ✅ bo'ldi | Sabab |
|---|---|---|---|---|
| 1 | butun fayl | «Uzum'ga · Uzum'dan · Uzum'da · Uzum'ning» | «Uzumga · Uzumdan · Uzumda · Uzumning» | B3 #7 saboq-sinfi: o'zbekcha so'z — apostrof kerak emas; loyihadagi mavjud darslar ham «Uzumdan/Uzumgacha» yozadi (grep: apostrofli shakl faqat shu faylda edi) |
| 2 | 1 variantlar | «Aniq bir narsani izlab» (22) ↔ «Buyurtmam qayerda ekanini bilish uchun» (38) | «Aniq bir narsani izlab topish uchun» · «Buyurtmam qayerdaligini bilish uchun» (35/35/36/30) | §21 hook teng og'irlik; to'rttasi «… uchun» qolipida; 1.73× → 1.20× |
| 3 | 1 payoff | «…ilova har vaziyatga o'z joyini beradi. Bugun shu joylarni va ular ortidagi muammolarni ko'ramiz.» | «Bitta odam ilovaga turli kuni turli sabab bilan kiradi. Bugun shunday vaziyatlarni ko'rib, qaysi birida muammo borligini bilib olamiz.» | **§119:** «har vaziyat ortida muammo» — «Shunchaki ko'rib chiqish»ni tanlagan bolaga yolg'on (ortida muammo yo'q); «har vaziyatga o'z joyi» — ilova haqida tekshirilmagan da'vo. Yangi payoff to'rttasiga bir xil rost |
| 4 | 2 matn + vizual | «…to'rt qatorli karta yozasiz: …qanday yechim…» · shtamp «✓ YOLLANDI» | «…g'oya haqida to'rt savolga javob yozasiz: …sayt nima qiladi…» · «✓ TAYYOR» | §39/§126: «karta», «yechim», «yollandi» — hali tug'ilmagan atamalar maqsad-ekranda; «yollandi» 11-ekrandan oldin bolaga «kim yollandi?» savolini beradi (§178a spoyler) |
| 5 | 3 | sarlavha «…birinchi qayerni bosadi?»; «telefonini almashtirmoqchi bo'lgan o'quvchi»; ikkinchisi — «**ertaga yetkazib berish filtri**»; xulosa «Saytdan real foyda… Eng ko'zga tashlanadigan joyga… Uzum'da bu qidiruv.» | «…nimaga ko'proq qaraydi?»; «Yangi telefon izlayotgan o'quvchi» · «Ertaga sovg'a kerak bo'lgan o'quvchi»; yonadigan joylar — sharhlar va baho · mahsulot sahifasidagi **yetkazib berish muddati**; xulosa «Ikkalasi ham avval kerakli narsani qidiradi. …**auditoriya** deyiladi. Auditoriya birinchi qiladigan ish eng ko'zga tashlanadigan joyda turadi: Uzumda bu — tepadagi qidiruv qatori.» | **real mahsulot (4-band):** filtr ilovada borligi tasdiqlanmagan → ko'rinadigan «yetkazib berish muddati»; **ekran-ichki ziddiyat:** v1 da sovg'a izlovchining birinchi ishi filtr, xulosa esa «birinchi ish — qidiruv, u tepada» — bola «unda nega filtr tepada emas?» deydi. Endi ikkalasi avval qidiradi (tepadagi qidiruv shu bilan oqlanadi), farq — keyin qaraydigan joyda; «real foyda» — kalka (B1 #5); §104 ta'rif-gap. 441 → ≈382 |
| 6 | 4 TEST-1 | reveal/xato-izoh yo'q | reveal «"Hamma narsa" hech bir aniq odamga aytilmagan: telefon izlayotgan o'quvchi ham, ertaga sovg'a kerak bo'lgan o'quvchi ham unda o'zini ko'rmaydi.» + 3 xato-izoh | **kognitiv bosqich (S28):** B1 da bu test oldida «hamma uchun» almashtirgich-ekrani bor edi, bu yerda yo'q — javob 3-ekrandan mulohaza bilan chiqadi, reveal uni 3-ekranning ikki odamiga bog'laydi (D-1); §175 xato-izoh mezonni eslatadi |
| 7 | 5 sarlavha + kartalar | «Uzum bo'lmagan paytda telefon olish qanday edi?» · «Toshkentdan tashqarida yashaydigan xaridor» · «shaharga borish» · 2-karta «Telegram guruhga "Toshkentdan kim olib keladi?" deb yozish» | «Uzum hali yo'q paytda tumandagi odam telefonni qanday olardi?» · «tumanda yashaydigan xaridor» · «katta shaharga borishi kerak» · 2-karta «shaharga ketayotgan tanishidan "olib keling" deb so'raydi»; kartalar kesim-gap | **§106:** v1 2-kartasi 7-ekran TEST-2 materialining deyarli so'zma-so'z nusxasi edi (B2 #6 bilan aynan bir sinf); «Toshkentdan tashqarida» + «shaharga» — Samarqandda yashovchi uchun ham «shahar» (noaniq); sarlavhada odam va vaqt aniq; «Uzum hali yo'q paytda» — umumiy tajriba, Uzum tarixi emas. 427 → ≈388 |
| 8 | 5 xulosa | «…odam muammoni shu qadar sezadiki, o'zi yechim o'ylab topgan.» | «Eng kuchli belgi — o'zicha chora. Demak, muammo odamni rostdan qiynayapti.» | «shu qadar …ki» — rus-kalka qurilmasi; «yechim» 9-ekrandan oldin (§168) — B2 #7 tasdiqlangan gap |
| 9 | 6 bashorat | «…Uzum Market ochilmoqda. Sizningcha, jamoa avval nimaga kuch berdi?» · «Chiroyli sayt va ilovaga» (24) · «Katta reklamaga» (15) · ✓ (29) | «2022-yil oktabr, Uzum Market ishga tushyapti. Sizningcha, Uzum avval nimani qurdi?» · «O'z yetkazib berish xizmatini» · «Chiroyli sayt va qulay ilovani» · «Televizor va ko'chadagi reklamani» (29/30/33) | §163 savol sarlavha so'zi bilan («nimani qurdi»); «jamoa» bankda yo'q; §43 bir o'lchov; 1.93× → 1.14×, ✓ endi eng uzun emas (1.21 → 0.88) |
| 10 | 6 slaydlar | 1) «…olardi — yetkazib berishsiz.» 2) «…topshirish punktlari…» 3) «…1 milliard dollardan qimmat baholangan kompaniya. 2025-yilda oyiga … odam kiradi.» | 1) «…olardi. Lekin u yerda yetkazib berish yo'q edi.» 2) «…topshirish punktlari (buyurtmani borib oladigan joy)…» 3) «…"yagona shoxli"si bo'ldi. Qiymati 1 milliard dollardan oshgan kompaniya shunday ataladi. 2025-yilda Uzumga oyiga 17 millionga yaqin odam kirgan.» | chala qo'shimcha-quyruq (§0-3); «topshirish punkti» birinchi ko'rinishida gloss (9-ekranda qayta keladi); §104 atama alohida ta'rif-gapda; zamon mosligi (2025 — o'tgan yil). **Bank bilan yonma-yon:** 2022 oktabr · saytdan emas, logistikadan · o'z avtoparki · punktlar · ertasi kuni · Instagram/Telegram, yetkazishsiz · 2024 mart · birinchi yagona shoxli · 1 mlrd dollardan yuqori · ~17 mln/oy (2025). Qo'shimcha fakt yo'q; $1,16/$1,5 mlrd ataylab olinmadi (pul faqat atama uchun) |
| 11 | 6 ko'prik | «Odamlarning **eng katta** muammosi **tanlash emas** — olgan narsasi qo'liga qanday yetib kelishi edi. Uzum **eng og'ir** muammodan boshladi.» | «Odamlar kerakli narsani topa olardi, lekin uni qo'liga yetkazib beradigan xizmat yo'q edi. Uzum aynan shu muammodan boshladi.» | **Keys-sadoqat (3-band hukmi): qo'shimcha da'vo.** Bank sababni beradi («chunki yetkazishsiz olardi»), lekin muammolarni **solishtirmaydi** — «eng katta», «eng og'ir», «tanlash muammo emas edi» bankda yo'q (uch ustunlik-da'vosi, §101-a). Yangi gap faqat bankdan chiqadigan xulosa: guruhlardan olardi (= topa olardi) + yetkazish yo'q edi |
| 12 | 7 TEST-2 | lead «…har hafta … "Toshkentdan kim **telefon** olib keladi?"» · «Unga telefon unchalik ham shart emas» (36) | lead «…har safar biror narsa kerak bo'lsa, … "Toshkentdan kim olib kelib beradi?"» · «Unga o'sha narsalar unchalik shart emas» (39); reveal + 3 xato-izoh | har hafta telefon olish — hayotda yo'q holat (bola ishonmaydi); 5-ekran (#7) bilan endi so'zma-so'z kesishmaydi (§106); B2 tasdiqlagan ✓ saqlandi; 1.25× → 1.15× |
| 13 | 8 konstruktor | KIM ✓ «Toshkentdan tashqarida…»; NIMASI OG'IR «shaharga borishi yoki tanishdan so'rashi kerak · **xarid qilish qiyin · do'konlar yomon**» | KIM ✓ «tumanda yashaydigan xaridor»; NIMASI OG'IR «bir kunini yo'lga sarflaydi · xarid qilishda qiynaladi · do'konlarni yomon deydi»; ✕-izoh qatorlari; natija-gap yozildi | **§37:** «Doim hamma odamlar xarid qilish qiyin.» · «Ba'zan ba'zi odamlar do'konlar yomon.» — gap sinardi; endi hamma bo'lak kesim shaklida, 27 juftlikdan har biri tugal. ✓ 5-ekrandagi «yo'lga bir kun» kartasidan o'sadi; NIMASI OG'IR uzunligi 45/17/15 → 27/24/23 |
| 14 | 8 xulosa | «"Xarid qilish qiyin" — nolish: …» | «"Xarid qilish qiyin" esa nolish: …» | B2 #17 tasdiqlangan shakl (belgi-formula ohangi, ETALON 43) |
| 15 | 9 | sarlavha «Ilovadagi bu to'rt narsa…»; muammo-yorliqlar parcha («qachon keladi?» · «ko'rmay olishga ishonch»); xulosa «…Muammo — oldin, javob — keyin. Har bir shunday javob **yechim** deyiladi.» | «Uzum ilovasidagi bu to'rt narsa nima uchun kerak?»; har joyga siz-formada tugal qator («Topshirish punkti — uyda kutmaysiz, qulay vaqtda borib olasiz» …); xulosa «Har biri bitta aniq muammoga javob beradi. Muammoga shunday javob **yechim** deyiladi.» | Quruvchi to'qimasin; «ko'rmay olishga ishonch» — ot-birikma, kim ishonadi noaniq; ETALON 43 belgi-qisqa ohang; §104. **Real mahsulot:** faqat ko'rinadigan to'rt narsa, «ilovadagi har narsa» da'vosi yo'q (B2 #20). 408 → ≈392 |
| 16 | 10 TEST-3 | lead «**Jamoadan** kimdir…» · «Animatsiya qancha vaqtda…» · «…qaysi rangda bo'lsa chiroyli?» | lead «**Internet-do'kon ilovasi jamoasida** kimdir…» · variantlar B2 tasdiqlagan matnda («Bu animatsiya …» ×2); reveal + xato-izohlar | qaysi jamoa — noaniq; «Uzum jamoasida» deyish ichki qaror to'qirdi (halollik) — nomsiz ilova; §147 boshlanish-guruhlari «Bu …» ×3 (✓ bilan) |
| 17 | 11 kartalar | «Telefon» → «Ertaga qo'limda bo'lsin, do'konga bormay» (ish bitsin) · «Eng yangi model» → … · «Sovg'a» → «Yaqinimni xursand qilish» | «Telefon buyurtma qildi» → «Do'konga bormay, ertaga telefonli bo'ldi» · «Eng yangi modelni tanladi» → «Do'stlari orasida zamonaviy ko'rinadi» · «Onasiga sovg'a buyurtma qildi» → «Onasini xursand qildi»; tur-yorliqlari olindi | **abrazets funksional (S24):** v1 da «ertaga, do'konga bormay» — **telefonning** vazifasi emas, **Uzumning** (yetkazish) vazifasi edi; bola «telefon meni do'konga bormaslikka yollanadimi?» deb chalkashadi. Endi karta oldida odamning **harakati**, orqasida **natija** — 13-ekran xulosasi («harakat emas, natija») shu yerda ko'rinadi. «ish bitsin» — ETALON 43 ko'p ma'noli «ish» (JTBD darsida «vazifa»ga almashgan). 506 → ≈396 |
| 18 | 11 xulosa | «Odam mahsulotni emas, natijani sotib oladi. Bu natija **vazifa** deyiladi (inglizcha Jobs-to-be-Done, qisqacha JTBD): mahsulot shu vazifani bajarish uchun "yollanadi".» | «Odam mahsulotning o'zini emas, u beradigan natijani oladi. Odam erishmoqchi bo'lgan natija **vazifa** deyiladi (Jobs-to-be-Done). Mahsulotni odam go'yo shu vazifaga ishga yollaydi.» | «mahsulotni emas … sotib oladi» — sovg'a kartasi bilan zid (u ham sotib oldi); atama-format original qavsda; qo'shtirnoqli «yollanadi» — izohsiz metafora (§41) → «go'yo ishga yollaydi» o'zi tushuntiradi; «JTBD» qisqartmasi o'quvchi matnida boshqa joyda ishlatilmaydi (TMI, ekran 400 ga sig'di) |
| 19 | 12 TEST-4 | lead «Sinfdoshingiz **formaga kirmoqchi**: …» · ✓ «Formada bo'lishni» (17) ↔ 26/26/30 | lead «Sinfdoshingiz bir oy ichida yugurish poyabzali oldi, … sport soati taqdi.» · cue «U bularning hammasi bilan aslida nimaga erishmoqchi?» · ✓ «Sog'lom, baquvvat va chaqqon bo'lishga» · «Yangi yugurish poyabzaliga ega bo'lishga» · «Mashq ilovasidan har kuni foydalanishga» · «Qo'lida sport soati bilan yurishga»; reveal + xato-izohlar | **6-band (PmJtbdLesson bilan solishtiruv):** manbada story «Ali formada bo'lishni xohlaydi…» — javob shartda yozilgan edi; v1 buni «formaga kirmoqchi» deb yumshatgan, lekin baribir **javob lead'da** (§106). Yangi lead faqat harakatlarni beradi — natijani bola o'zi chiqaradi. «forma» — o'smir uchun **maktab formasi** (§117 omonim), «formaga kirmoq» — ruscha «forma» iborasining kalkasi. Uzunlik 1.76× → 1.18× (✓ endi eng qisqa emas: 0.57 → 0.95). Bitta distraktor «foydalanishga» — harakat (13-ekran xulosasi rad etadi, §110 davomi) |
| 20 | 13 | sarlavha «Qaysi mahsulot qaysi vazifaga yollangan?»; xulosa «Vazifa — mahsulot nomi ham, harakat ham emas. Odam erishadigan natija.» | «Har mahsulot qaysi vazifaga yollangan?»; «Vazifa — mahsulotning nomi ham, u bilan qilinadigan harakat ham emas. Bu — odam erishadigan natija.» | **6-band:** juftlar PmJtbdLesson `MP_PAIRS` bilan so'zma-so'z bir xil — o'zgartirilmadi (manba tasdiqlangan). «qaysi … qaysi» qo'sh so'roq og'irroq; «harakat» — nimaning harakati ochildi; egasiz chala gap (§0-3) |
| 21 | 14 | sarlavha «Sizning g'oyangiz — kim uchun, qaysi muammo, qanday yechim, aslida nima uchun?»; maydon-nomlari KIM/MUAMMO/YECHIM/VAZIFA; namunalar yo'q; tayyor g'oyalar «B1 dagi bilan bir xil» (B1 da VAZIFA ham, QACHON ham yo'q) | «Tanlagan g'oyangiz haqida to'rt savolga javob bera olasizmi?»; mentor 1 gap «To'rt javobingiz bitta kartaga yig'iladi.»; savol-yorliqlar + kesim-namunalar; tekshiruv-xabarlar B1/B2 tasdiqlagan matnda; **4 tayyor g'oya to'rt qatorga to'ldirildi** (KIM · QACHON · NIMASI OG'IR · SAYT NIMA QILADI · ODAM NIMAGA ERISHADI) | §40 (g'oyasi yo'q o'quvchi); sarlavhada to'rt bo'lak sanalardi (§0-6) va «aslida nima uchun» — mavhum; §50; «karta» so'zi darsda hech qayerda tug'ilmagan edi — endi harakat bilan nomlanadi (§39); Quruvchi to'qimasin; har g'oya §37 qolipiga qo'yib ovoz chiqarib o'qildi («Ustozga sovg'aga pul yig'ilganda sinf sardori kim bergani, kim bermaganini adashtirib yuboradi.»). Futbol namunasi B1 jadvalidan |
| 22 | 15 | sarlavha «Bu uch kartada xato bormi?» — **uchtasida ham ✕**; sabab «3 tadan» yozilmagan; karta 1 izohi «kuzatuv»; xulosa «Uch xato — uch qator. Har qatorning o'z savoli bor.» | «Har kartada bitta qator chala. Nimasi yetishmaydi?»; uchala karta uchun bitta umumiy uch-sabab to'plami («Nimasi og'irligi aytilmagan» · «Sayt nima qilishi aytilmagan» · «Natija emas, harakat yozilgan», 27/28/29); karta 3 «Ilovani ochadi»; xulosa har qatorning savolini aytadi | **§108/§107:** «xato bormi?» — javobi uch marta «ha» bo'lgan savol, hukm yo'q, ekran javobni sarlavhada beradi; «kuzatuv» — darsda o'rgatilmagan atama (S28); sabablar darsning o'z so'zlari bilan (8, 9, 13-ekran); karta 3 kesim shaklida (§37 — karta-qatorlari 14-ekran namunalari bilan bir shakl); «Uch xato — uch qator» — belgi-ohang (ETALON 43) |
| 23 | 16 | sarlavha «…nima deydi — AI'dan so'rab ko'ramizmi?»; so'rov «Siz [KIM] rolidasiz.» · «Bu vaziyat sizda bo'ladimi…»; qoida «AI — bitta tasavvurdagi foydalanuvchi, real odam emas. Kartani siz tuzatasiz.» | «Kartangizdagi odam bu muammo haqida nima der edi?»; «Siz shunday odamsiz: [KIM]. Menimcha, sizda shunday muammo bor: [MUAMMO]. …1) Bu sizda oxirgi marta qachon bo'lgan? 2) O'shanda aslida nimaga erishmoqchi edingiz?…»; «AI — o'ylab topilgan bitta odam, haqiqiy foydalanuvchi emas. Kartada nima qolishini siz hal qilasiz.» | ikki savolli sarlavha; **§37:** «Siz hovlida futbol o'ynaydigan o'smirlar rolidasiz» — ko'plik KIM bilan g'aliz; «Siz shunday odamsiz: …» har KIM bilan tugal (B3 #21 sinfi); «real odam» — kalka; **§173** — qaror o'quvchiniki, fe'l aniq harakatga bog'landi; so'rov qisqartirildi (405 → ≈388 + o'quvchi matni, D-6) |
| 24 | 17 | «Sherigiga 30 soniyada: «G'oyam kim uchun…» → bir qator yozadi.» | «Sherigingizga 30 soniyada aytib bering: g'oyangiz kim uchun va o'sha odam aslida nimaga erishadi?» → «Eng muhim fikrni bir qatorga yozing.» | siz-forma; B1 #37 tasdiqlangan yo'riq |
| 25 | 19 flashcard | «Saytdan **real** foyda…» · «Eng ko'zga tashlanadigan joyda…» · «Muammoning eng kuchli belgisi» (so'roqsiz) · «Uzum nimadan boshladi? — O'z yetkazib berish xizmatidan» · «Natijani — vazifa bajarilishini» · «Vazifa **nima emas**?» | savol-shakl oldlar; «Saytdan foyda oladigan aniq odamlar guruhi» · «Sahifaning eng ko'zga tashlanadigan joyida…» (3-ekran so'zi bilan) · «Saytdan emas, o'z yetkazib berish xizmatidan» (bank so'zi) · «Mahsulotning o'zini emas, u beradigan natijani» · «Vazifa qanday yoziladi? — Odam erishadigan natija bilan — mahsulot nomi yoki harakat bilan emas» | kalka; §145/§174 mezon so'zma-so'z bir xil; inkor-shakldagi savol («nima emas?») o'quvchini rost narsani rad etishga undaydi (§108); sanoq 8 ta saqlandi |
| 26 | 20 yakun | «Sayt aniq odam uchun, aniq vaziyatda.» · «Muammo o'zicha chora topilgan joyda, aniq gap bilan.» · «Har yechim — bitta muammoga javob.» · «Odam natijani sotib oladi.» | «Sayt aniq odamlar uchun, ularning aniq vaziyati uchun qilinadi.» · «Muammo odam o'zicha chora topgan joyda bo'ladi va aniq gap bilan yoziladi.» · «Har yechim bitta muammoga javob beradi.» · «Odam mahsulotning o'zini emas, u beradigan natijani oladi.» ; arena yo'nalishi (§144) | §52 kesimsiz qatorlar tugal gapga; ETALON 43; «sotib oladi» — #18 kaskadi |
| 27 | 4-bo'lim | nishonlar o'zbekcha tasvir («Aniq gap yig'ildi» …) | **Clear Problem! · Perfect Match! · Idea Card! · Nice Catch!** + siz-forma `desc` | nishon `name` faqat inglizcha (2026-07-16); «Nice Catch!» — namunadagi uslub; «Bug Hunter» ataylab olinmadi (§100: kurs olamida kod-xatosi ma'nosi) |
| 28 | ichki joylar | pasport «Misol-ip» («ilovadagi har narsa») · 2-bo'lim («Uzum'ga bitta odam», «yashaydi») · Uzum-halollik qaydi | «to'rt narsa» · «turli odam» · «bo'ladi»; qaydga filtr-olib tashlash, 5-ekran «umumiy tajriba» va 10-ekran «nomsiz ilova» izohlari qo'shildi; 6-bo'lim 3-band TEST-2 moslanishi bilan yangilandi | kaskad; §28 jonsiz narsaga odam-fe'li («muammo yashaydi») — blok nomi ham «qayerda bo'ladi» |

### B. Test-halollik o'lchovi (Intl.Segmenter, grapheme; ✓ birinchi)

| Ekran | Uzunliklar | max/min | ✓ / eng uzun distraktor | Oldin max/min |
|---|---|---|---|---|
| 1 hook (ballsiz, to'g'ri javob yo'q) | 35 / 35 / 36 / 30 | 1.20× | — | **1.73×** |
| 6 bashorat (ballsiz) | 29 / 30 / 33 | 1.14× | 0.88 | **1.93×** |
| 4 TEST-1 | 45 / 49 / 46 / 45 | 1.09× | 0.92 | 1.09× (B1 matni) |
| 7 TEST-2 | 44 / 45 / 40 / 39 | 1.15× | 0.98 | 1.25× |
| 10 TEST-3 | 38 / 41 / 39 / 39 | 1.08× | 0.93 | 1.05× |
| 12 TEST-4 | 38 / 40 / 39 / 34 | 1.18× | 0.95 | **1.76×** |
| 8 konstruktor NIMASI OG'IR (ballsiz) | 27 / 24 / 23 | 1.17× | 1.13 | 3.00× |
| 15 sabab-to'plami (ballsiz) | 27 / 28 / 29 | 1.07× | — | yozilmagan edi |

- **3-vs-1 shakl (§147):** T1 — to'rttasi «Uni/Unda». T2 — «U …» ×2 (✓ bilan), «Bu», «Unga». T3 — «Bu …» ×3 (✓ bilan), «Boshqa» yolg'iz distraktor. T4 — to'rt xil boshlanish (Sog'lom/Yangi/Mashq/Qo'lida), guruh yo'q; oxiri «-ga» to'rttasida. Yolg'iz qolgan to'g'ri javob yo'q. *(Ma'noviy «bir-o'zi-boshqa» teli T4 da qoladi — D-3.)*
- **Mutlaq so'z (§110):** T1 «hech kim» (distraktorda, bitta) · T2 yo'q · T3 yo'q · T4 «har kuni» (bitta).
- **§102 (distraktor darsning o'z ekranida rost emasmi):** T1 uch distraktor (narx/tezlik/topilish) — hech bir ekranda xulosa emas. T2 «odat — muammo yo'q» — 5-ekran rad etadi; «shart emas» — 5-ekran «voz kechadi» kartasiga yaqin ko'rinadi, lekin lead «har safar so'raydi» — voz kechmagan, rad etiladi. T3 — B2 tahlili amal qiladi; 9-ekran tuzilishi («har narsa — muammoga javob») rangni ham, muddatni ham «birinchi» qilmaydi. T4 «har kuni foydalanish» — 13-ekran xulosasi («harakat emas») rad etadi; «soat bilan yurish» 11-ekrandagi «zamonaviy ko'rinish» (ijtimoiy natija) bilan chalkashmasligi uchun natija emas, harakat shaklida yozildi.
- **§106 (slayddan ko'chirish):** T1 ✓ — 3-ekranda gap sifatida yo'q. T2 lead ↔ 5-ekran — #7 dan keyin so'zma-so'z kesishmaydi; ✓ «o'zicha hal qilib» ↔ kart-yorlig'i «o'zicha chora» — bitta so'z umumiy (B2 bilan bir xil qabul qilingan daraja). T3 ✓ — 9-ekranda savol shaklida yo'q, flashcardda bor (dars oxirida, testdan keyin). T4 ✓ — lead'da ham, 11/13-ekranda ham yo'q.
- **Bitta himoyalanadigan to'g'ri:** T1/T3 — B1/B2 tahlili. T2 — «guruhda gaplashish» lead'dagi so'rov bilan rad etiladi. T4 — «poyabzalga ega bo'lish» ham «istak», lekin cue «hammasi bilan aslida» — uch mahsulotni birlashtiradigan yagona javob ✓.
- **§119 (hook):** payoff («turli kuni turli sabab bilan kiradi… qaysi birida muammo borligini bilib olamiz») to'rt tanlovning hech birini rad etmaydi; «shunchaki ko'rib chiqish»ni tanlagan bola ham «demak men xato ekanman» demaydi.

### C. Mexanik tekshiruvlar

- Kirill `grep -cP '[\x{0400}-\x{04FF}]'` → **0** (jurnal #19 dagi ruscha iqtibos ham lotin tavsifga almashtirildi).
- Qiyshiq apostrof (U+2018 · U+2019 · U+02BB) → **0**.
- Sen-forma grep → 1 topilma: 16-qator «koding» (pasport, so'z o'zagi) — soxta.
- Ichki jargon `yadro|artefakt|recap` → **0**; «Hook» — faqat ekran-yorlig'i.
- «Uzum'» (apostrofli shakl) → **0**.
- **Keys K1:** har gap bank bilan yonma-yon (#10, #11). «eng katta / eng og'ir / tanlash emas» ustunlik-da'volari olindi; «jamoa» olindi; Uzumning ichki qarori sifatida hech narsa aytilmaydi (3-ekran «nega qidiruv tepada» — xaridor harakati bilan: «Ikkalasi ham avval kerakli narsani qidiradi»).
- **Real mahsulot:** ekranlarda faqat — tepadagi qidiruv qatori · sharhlar va baho · mahsulot sahifasidagi yetkazib berish muddati · topshirish punkti. «Ertaga yetkazib berish filtri» — **olib tashlandi** (ilovada borligi tasdiqlanmagan).
- **Sanoq-mosligi:** 4 belgi (5-ekran, 4 karta) · 4 joy (9-ekran sarlavha «bu to'rt narsa» = 4 qator) · 3 karta (11 · 15) · 4 juft (13, nishon «To'rt mahsulotni») · 4 qator (2-ekran «to'rt savol» = 14-ekran 4 maydon = 20-yakun 4 qator = nishon «to'rt qatorli») · 3 sabab (15) · 8 flashcard · 4 tayyor g'oya.
- **Ekran-hajmi (≤400, ko'rinadigan proza; variantlar/material sanalmaydi):** 1 ≈195 · 2 ≈193 · 3 ≈382 (edi ≈441) · 5 ≈388 (edi ≈427) · 6 ≈347 (eng uzun slayd bilan) · 8 ≈252 · 9 ≈392 (edi ≈435) · 11 ≈396 (edi ≈506) · 14 ≈175 + namunalar · 15 ≈166 · 16 ≈388 + o'quvchi karta-matni → D-6.
- `npm run lint:til pm-senariylar/BRIDGE-B4-KimUchunQandayMuammo.md` → **0 error** (jurnal bilan birga). Warn'lar faqat ichki qatorlarda: 27-qator (ip nomi, streak emas) va shu C-bo'limning o'zi (qoida so'zlarini iqtibos qiladi) — soxta. O'quvchi ko'radigan matnda warn yo'q.

### D. Tuzilmaviy e'tirozlar (tuzatilmadi — foydalanuvchi/Quruvchiga)

1. **TEST-1 oldida «hamma uchun» ekrani yo'q.** B1 da bu test 4-ekran almashtirgichidan keyin keladi («Hammaga yozilgan gapda hech kim o'zini tanimaydi»). Bu yerda javob 3-ekrandan mulohaza bilan chiqadi va reveal uni bog'laydi — o'tadi, lekin zaifroq. Kuchliroq yo'l: 3-ekran xulosasiga bitta gap («Hammaga yozilgan gapda hech kim o'zini tanimaydi»), lekin ekran ≈382 → ≈430 bo'ladi. Qaror kerak.
2. **Uzum ilovasining hozirgi ko'rinishi** qurishdan oldin skrinshot bilan tekshirilsin: (a) qidiruv qatori bosh ekranda eng tepadami; (b) yetkazib berish muddati mahsulot sahifasida ko'rinadimi (sana yoki «ertaga» shaklida); (c) sharh va baho mahsulot sahifasidami. (b) ko'rinmasa — 3-ekrandagi sovg'a-kartasi «topshirish punkti»ga o'tadi.
3. **TEST-4 «bir-o'zi-boshqa» teli.** Lead uch mahsulotni sanaydi, uch distraktor — shu uch mahsulot, ✓ — yagona «sanalmagan» narsa. Shakl-teli yopildi (#19), ma'noviy teli JTBD testining tabiati (manbada ham shunday). Kuchaytirish kerak bo'lsa: bitta distraktor lead'da yo'q, lekin darsda rad etilgan narsaga almashadi (masalan «Do'stlariga yangi soatini ko'rsatishga» — **lekin** bu 11-ekranning ijtimoiy natijasiga yaqin, ikkinchi himoyalanadigan javob bo'lib qoladi). Hozirgi holat xavfsizroq deb qoldirildi.
4. **5-ekran kartalari belgi-nomi oldin, misol keyin** (B2 D-6 bilan bir sinf). Induktiv tartib uchun kartaning old tomonida misol, bosilganda belgi nomi — mexanika, Quruvchiga.
5. **11-ekran vazifa-turlari** (amaliy · boshqalar ko'zida · his) ekrandan olindi (#17): TMI, test ham, flashcard ham so'ramaydi, ekran 506 belgi edi. Foydalanuvchi tasavvur darajasida turlarni xohlasa — kartalar orqasida kichik chip («amaliy», «boshqalar ko'zida», «his») bo'lib qaytadi, ekran ≈430 ga chiqadi.
6. **16-ekran ≈388 + o'quvchining kartasi** — 400 dan oshadi (B1 17 · B2 15 · B3 16 bilan bir sinf). Taklif: so'rov default-yopiq «So'rovni ko'rish» yig'masida.
7. **15-ekran mexanikasi** — v1 da «3 tadan tanlaydi» noaniq edi; men uchala karta uchun bitta umumiy uch-sabab to'plamini yozdim (har sabab aynan bitta kartaga). Quruvchi har kartaga alohida 3 variant qilmoqchi bo'lsa — distraktorlar yozilishi kerak (Quruvchi to'qimasin, metodistga qaytsin).
8. **«vazifa» ↔ «uy vazifasi».** O'smir uchun «vazifa» birinchi navbatda uy vazifasi. PmJtbdLesson bilan izchillik uchun qoldirildi (loyiha qarori: ish → vazifa); 11-ekran ta'rif-gapi («Odam erishmoqchi bo'lgan natija vazifa deyiladi») buni yopadi. Bu dars uyga vazifasiz — to'qnashuv kam.
9. **14-ekran tayyor g'oyalarning VAZIFA qatori** B1 da yo'q edi — men yozdim (#21). B1 jadvali bilan bir olam, lekin B1 dagi MUAMMO so'zlari («Maydonga borsa, band bo'lib chiqadi») bu yerda QACHON + NIMASI OG'IR ga bo'lindi. Ikkala darsni ko'radigan o'quvchi yo'q (Node/Nest o'quvchisi faqat shuni ko'radi) — farq zararsiz, lekin foydalanuvchi ko'zdan kechirsin.
10. **20-ekran mentor-gapi** «Backend modulida…» — B1 D-2 bilan bir sinf (kelajak-gap yakunda, §17). Og'zaki bo'lgani uchun qoldirildi.
