// 1-dars «Tanishuv» qadamlari (QADAM: nomi, ustoz ekrani, bola ekranlari) va ustoz varag'i (VARAQ) — dvigatel 1b, 19.11.
// Avval etalon/demo.mjs boshida edi — mazmuni o'zgarmagan. Solo yo'li (SOLO_R) hali dvigatel/qobiq.js da — 3-bosqichda shu yerga o'tadi.
const QADAM = [
  ['Kirish', 'P1', ['B0', 'BK']],
  ['Savol', 'P2', ['P2N', 'BK']],
  ['1-sinov: YUR!', 'P2S', ['BY']],
  ['2-sinov: ko‘chiramiz', 'P2B', ['BK'], 'Bir o‘quvchi Coddy’ni sichqoncha bilan ko‘chiradi'],
  ['3-sinov: buyruq', 'P2K', ['BK'], 'Ustoz blokni bosadi — Coddy’ni kuzating'],
  ['Javob', 'P2C', ['BK'], 'Coddy faqat blokni tushunadi'],
  ['Dasturlash nima?', 'P3', ['BK'], 'Yangi so‘z: dasturlash'],
  ['Reja', 'P4', ['BK'], 'Bugungi reja: uch bekat'],
  ['Qahramon tanlash', 'P4T', ['BQ', 'BK']],
  ['Ranglar', 'B1', ['B1']],
  ['Birinchi dastur', 'P5A', ['B2', 'B4']],
  ['Coddy sanaydi', 'P6', ['BK', 'B3X', 'B3Y'], 'Ustoz Coddy’ni yurgizyapti — kuzating'],
  ['Pog‘onalar', 'P5', ['B2P', 'B2Q', 'B2Y', 'BK']],
  ['Xulosa', 'P9', ['BK'], 'Xulosa: blok va dastur'],
  ['O‘yin: Men robotman', 'P10', ['BK'], 'O‘yin: ustozga buyruq bering!'],
  ['2-bekat', 'P4B', ['BK'], 'Reja: 1-bekat o‘tildi'],
  ['say bloki', 'P7A', ['BK'], 'Yangi blok: say'],
  ['say: natija', 'P7', ['BK'], 'say faqat gapiradi'],
  ['Ism va rang', 'P4I', ['B6', 'BK']],
  ['Gapirtiramiz', 'B7', ['B7', 'BK']],
  ['Ustozning sahnasi', 'P11', ['BK'], 'Ustoz o‘z sahnasini ko‘rsatyapti'],
  ['O‘z sahnangiz', 'P12', ['B8A', 'B8', 'BK']],
  ['Ko‘rgazma', 'P13', ['B9']],
  ['Yakun', 'P8', ['B5']],
  ['Sinfimiz bugun', 'P14', ['B5']],
]
const VARAQ = [
  ['«Bugun birinchi dasturingizni tuzasiz!» Pastda — keyingi darslardagi o‘yinlar: labirint, olma yig‘amiz, kosmik o‘yin.', '«Bugun birga dasturlashni o‘rganamiz. Keyingi darslarda bloklardan o‘yin yasaymiz.» O‘quvchilar ismini yozib kiradi, «Kirdi» soni o‘sadi.', 'Kursda nima bo‘lishini biladi — qiziqish.'],
  ['Savol: «Coddy’ni yulduzga qanday olib boramiz?» A — «YUR!» deb aytamiz, B — sichqoncha bilan ko‘chiramiz, C — buyruq beramiz.', '«Har kim noutbukida bitta javobni bossin.» Kartalarda — nechta bola qaysi javobni tanlagani.', 'Taxmin qiladi. Hali hech narsa o‘rgatilmaydi — bu huk.'],
  ['1-sinov: «Hammamiz birga: YUR!» — nechta bola «YUR!» degani.', '«Uchgacha sanaymiz — hammamiz “YUR!” deymiz va tugmani bir marta bosamiz.» Coddy qimirlamaydi.', 'Ovoz bilan kompyuter ishlamaydi.'],
  ['2-sinov: sichqoncha bilan ko‘chiramiz.', 'Bir bolani chiqarib, Coddy’ni sichqoncha bilan ko‘chirtirasiz — Coddy joyidan qimirlamaydi.', 'Qahramonni qo‘l bilan surish ham ishlamaydi.'],
  ['3-sinov: «Bitta buyruq — bitta qadam!» — move right bloki.', 'Blokni uch marta bosasiz: har bosishda Coddy bir qadam sakraydi va yulduzga yetadi.', 'Blokdagi buyruq ishlaydi: bitta blok — bitta qadam.'],
  ['Javob: «Coddy faqat blokni tushunadi». A va B — ✕, C — ✓.', 'Bola «“YUR!” ham buyruq-ku» desa — to‘g‘ri, lekin Coddy faqat blokdagi buyruqni tushunadi.', 'Darsning asosiy fikri: kompyuter faqat o‘zi tushunadigan buyruqni — blokni — bajaradi.'],
  ['«Dasturlash nima?» Dasturchi kod yozadi = biz bloklarni ulaymiz. «Biz bloklardan foydalanamiz.»', 'Ekrandagini o‘qiysiz: «Dasturlash — kompyuterga buyruq berish.»', 'Yangi so‘z: dasturlash. Biz buyruqni blok bilan beramiz.'],
  ['Reja: «Bugun nima o‘rganamiz?» Uch bekat: yurgizamiz, gapirtiramiz, o‘z sahnangiz.', 'Uch bekatni ko‘rsatasiz; o‘ngda — dars oxirida har kim o‘z sahnasini yasaydi.', 'Dars qayerga borishini biladi.'],
  ['«Qahramoningizni tanlang». Coddy — ustozniki, har bolaning o‘z qahramoni bor.', 'Bolalar noutbukida qahramon tanlaydi; ustoz ekranida — nechta bola tanlagani.', 'O‘z qahramoni bor — bugun unga buyruq beradi.'],
  ['Blok studiya: «Ko‘k blok yurgizadi, binafsha blok gapirtiradi».', 'Avval ko‘k, keyin binafsha doirachani bosishni ko‘rsatasiz.', 'Blokning rangi — uning ishi: ko‘k — harakat, binafsha — gap.'],
  ['Mashq: «Endi o‘zingiz!» — nechta bola yulduzga yetgani.', 'Bolalar o‘z qahramonini yulduzga olib boradi. Xato bo‘lsa — «Oz qoldi!», keyin «Yetib bordi!».', 'Birinchi dasturini o‘zi tuzadi. Huk shu yerda yopiladi.'],
  ['Ustozda «4 ta blok — 4 qadam», bolada «Bir qadam ortiqcha!»: Coddy yulduzdan o‘tib ketdi, bizga 3 qadam kerak edi.', 'Ko‘rsatasiz; keyin bolalar o‘z noutbukida ortiqcha blokni bosib, ✕ bilan olib tashlaydi va qayta ishga tushiradi.', 'Xatoni o‘zi topib tuzatadi: har blok — bitta qadam.'],
  ['Mashq: pog‘onalar (1 — yulduzda to‘xtang, 2 — orqaga qayting, 3 — o‘ngga va chapga, ★ — aniq 9 ta blok).', 'Bolalar o‘zi bajaradi; siz yordam so‘raganlarga borasiz.', 'move left — yangi blok; mustaqil ishlaydi.'],
  ['Xulosa: «Blok — bitta buyruq. Dastur — ketma-ket buyruqlar.»', 'Ikki so‘zni o‘qiysiz; o‘ngda Coddy bloklar bilan yuradi.', 'Ikki atama: blok va dastur.'],
  ['O‘yin: «Men — robotman!» — uchta buyruq va «Boshqa buyruqni bilmayman».', 'Siz robot bo‘lasiz, bolalar inglizcha buyruq beradi. Boshqa buyruqni bajarmaysiz.', 'Buyruq aniq bo‘lishi kerak — kompyuter faqat bilganini qiladi.'],
  ['Yo‘l xaritasi: «Endi qahramonimiz gapiradi!» — 1-bekat o‘tildi.', '«Birinchi bekatni o‘tdik — endi qahramonimiz gapiradi.»', 'Darsda qayerda turganini ko‘radi.'],
  ['Yangi blok «say — ayt»: «say blokiga “2 qadam yur” yozdik». Coddy hali jim.', '«Ishga tushir»ni bosasiz — natijani bolalar o‘zi ko‘rsin.', 'say bloki bilan tanishadi.'],
  ['«Gapirdi, lekin yurmadi»: Coddy «2 qadam yur» deb aytdi, lekin joyidan qimirlamadi.', '«say faqat gapiradi, yurgizmaydi.» So‘rashingiz mumkin: «Nega yurmadi?»', 'Blok nima desa, shu bajariladi; yozuv — faqat gap.'],
  ['«Qahramoningizga ism qo‘ying» — sinf taxtasi, «Ism berdi».', 'Bolalar qahramoniga ism va rang beradi. Ismlar ustoz ekraniga chiqmaydi.', 'Qahramoni — o‘ziniki.'],
  ['Mashq: «Qahramoningizga gap yozing» — say blokidagi yozuv.', 'Yozuvni bosib o‘zgartirishni ko‘rsatasiz; «Men Momiqman!» — faqat namuna.', 'O‘zi yozgan gapni qahramoni aytadi.'],
  ['Ustozning sahnasi: Coddy kosmosda (yangi blok — jump).', 'Namuna ko‘rsatasiz: yuradi, gapiradi, sakraydi. «Siznikisi boshqacha bo‘lsin.»', 'O‘z sahnasini qanday yasashni ko‘radi.'],
  ['Mashq: «O‘z sahnangizni yarating!» — joy, kamida 2 ta harakat bloki, o‘zingiz yozgan gap; qo‘shimcha — jump.', 'Bolalar joy tanlab sahna yasaydi; ustoz ekranida — kim tayyor.', 'Harakat va gap blokini o‘zi birlashtiradi — farqini amalda ko‘rsatadi.'],
  ['Ko‘rgazma: «Yoningizdagi do‘stingizning sahnasini ko‘ring».', 'Bolalar yonidagi do‘stining sahnasini ko‘radi, keyin 2–3 bola o‘zinikini ko‘rsatadi. So‘rang: «Do‘stingizning qahramoni nima qildi?» Bolalar ishi ustoz ekraniga chiqmaydi.', 'Ishini ko‘rsatadi, boshqalarnikini ko‘radi.'],
  ['Yakun: «Siz dastur tuzdingiz!» — dasturlash, blok, dastur. Keyingi dars — labirint.', '«Noutbukingizga qarang» — har kimda «Birinchi dasturingiz tayyor!», ishlatgan bloklari va «Keyingi darsda labirintda ko‘rishamiz!».', 'Bugungi uch so‘zni eslaydi; keyingi darsni biladi.'],
]
VARAQ[0] = ['«Bugun birinchi dasturingizni tuzasiz!» Pastda — Blokli dasturlash modulimizdagi o‘yinlar: labirint, olma yig‘amiz, kosmik o‘yin.', '«Bugun birga dasturlashni o‘rganamiz. Shu modulda bloklardan o‘yin ham yasaymiz.» O‘quvchilar ismini yozib kiradi, «Kirdi» soni o‘sadi.', 'Kursda nima bo‘lishini biladi — qiziqish.']
VARAQ[3][1] = 'Bir bolani chiqarib, Coddy’ni sichqoncha bilan ko‘chirtirasiz — Coddy biroz siljiydi-yu, joyiga qaytadi.'
VARAQ[4][1] = 'Ekrandagi move right blokini o‘zingiz bosasiz: har bosishda Coddy bitta zonachaga sakraydi, uchinchisida yulduzga yetadi.'
VARAQ[7][0] = 'Reja: «Bugun nima o‘rganamiz?» Yo‘l tepalikka ko‘tariladi: uch bekat — harakatlantirish, gapirtirish, sahna yaratish; cho‘qqida — dars oxirida o‘z sahnangiz.'
VARAQ[7][1] = 'Uch bekatni pastdan yuqoriga ko‘rsatasiz: har bekat — bir pog‘ona baland. Navbatdagi bekat miltillab turadi.'
VARAQ[15][0] = 'Tepalik: 1-bekat o‘tildi (✓, yoyi oltin), Coddy birinchi pog‘onada. «Endi qahramonimiz gapiradi!»'
VARAQ[9][1] = 'Ko‘k doirachani bosasiz — harakat bloklari chiqadi, binafshani — gap bloki. Bolalar ham o‘z noutbukida bosadi.'
VARAQ[10][1] = 'Bolalar blokni bosib dasturga qo‘shadi va «Ishga tushir»ni bosadi: kam bo‘lsa — «Oz qoldi!», ko‘p bo‘lsa — «Bir qadam ortiqcha!», to‘g‘ri bo‘lsa — «Yetib bordi!».'
VARAQ[11][1] = '«▶ Ishga tushir»ni bosasiz: Coddy yuzida qadamlarni sanaydi va yulduzdan o‘tib ketadi. Ortiqcha blokni bosib, ✕ bilan olib tashlaysiz, qayta ishga tushirasiz — yulduzda to‘xtaydi. Keyin bolalar o‘z noutbukida xuddi shunday tuzatadi.'
VARAQ[16][1] = '«▶ Ishga tushir»ni bosasiz — Coddy «2 qadam yur» deb aytadi, lekin joyidan qimirlamaydi. Keyin «Keyingi».'
VARAQ[18][1] = 'Bolalar ism yozadi (yoki «Ism tanlab ber») va rang tanlaydi — qahramon darhol o‘sha rangga kiradi. Ismlar ustoz ekraniga chiqmaydi.'
VARAQ[19][1] = 'Bolalar binafsha blokdagi yozuvni bosib, o‘z gapini yozadi va «Ishga tushir»ni bosadi; «Men Momiqman!» — faqat namuna.'
VARAQ[20][1] = '«▶ Ishga tushir»ni bosasiz: Coddy yuradi, gapiradi, sakraydi. «Siznikisi boshqacha bo‘lsin.»'
VARAQ[21][1] = 'Bolalar joy tanlaydi, bloklarni bosib qo‘shadi va ishga tushiradi; shartlar bajarilgan sari ✓ yonadi. Ustoz ekranida — kim tayyor.'
VARAQ[8] = ['«Qahramoningizni tanlang». Coddy: «Men — ustozning yordamchisiman. Sizda o‘z qahramoningiz bo‘ladi.»', 'Bolalar noutbukida qahramon tanlaydi; ustoz ekranida — nechta bola tanlagani va ularning qahramonlari (haqiqiy son).', 'O‘z qahramoni bor — bugun unga buyruq beradi.']
VARAQ[10][0] = 'Mashq: «Endi o‘zingiz!» — nechta bola yulduzga yetgani va yordam so‘raganlar (haqiqiy son).'
VARAQ[11] = ['Avval: «4 ta blok bilan ishga tushiramiz». Ishga tushirgach: «4 ta blok — 4 qadam» — Coddy yulduzdan o‘tib ketdi.', '«▶ Ishga tushir»ni bosasiz: Coddy qadamlarni yuzida sanab, yulduzdan o‘tib ketadi. Shu payt bolalar noutbukida topshiriq ochiladi — ortiqcha blokni olib tashlash. Siz ham ortiqcha blokni bosib, ✕ bilan olib tashlab, qayta ishga tushirishingiz mumkin.', 'Xatoni o‘zi topib tuzatadi: har blok — bitta qadam.']
VARAQ[12] = ['Mashq: pog‘onalar — 1 yulduzda to‘xtang · 2 orqaga qayting · 3 olma, keyin yulduz · ★ aniq 9 ta blok. Doskada — har pog‘onani nechta bola bajargani.', 'Bolalar o‘zi bajaradi: biri tugasa, keyingisi o‘zi ochiladi (★ — qo‘shimcha). Siz yordam so‘raganlarga borasiz — soni pastda.', 'move left — yangi blok; ketma-ketlikni o‘zi tuzadi.']
VARAQ[14][1] = 'Siz robot bo‘lasiz, bolalar inglizcha buyruq beradi. Boshqa buyruqni bajarmaysiz. Sinfga orqa o‘girib turing — shunda o‘ng va chap bolalarniki bilan bir xil bo‘ladi.'
VARAQ[20][0] = 'Ustozning sahnasi: Coddy kosmosda — yuradi, gapiradi, sakraydi (jump — o‘yinda tanishgan blok).'
VARAQ[21][1] = 'Bolalar joy tanlaydi, bloklarni bosib qo‘shadi va ishga tushiradi; shartlar bajarilgan sari ✓ yonadi. Doskada — haqiqiy son: kim tayyor, kim qaysi joyni tanladi.'
VARAQ[23][1] = '«Noutbukingizga qarang» — har kimda o‘z natijasi: bugun haqiqatan ishlatgan bloklari. Keyin «Keyingi» — butun sinf natijasi.'
VARAQ.push(['Sinfimiz bugun: butun sinf nechta qadam, sakrash, gap va sahna qildi (haqiqiy son); o‘ngda bolalar tanlagan qahramonlar.', '«Hammangiz zo‘r ishladingiz!» Raqamlarni o‘qing. «Darsni yakunlash»ni bossangiz — hammada «Dars tugadi» chiqadi.', 'Jamoa bo‘lib nimaga erishganini ko‘radi.'])
