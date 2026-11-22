// 15-dars «Xakaton №1» qadamlari (QADAM) va ustoz varag'i (VARAQ) — 21.11. Manba: new-junior/manba/015-xakaton-1.md v1.1, 18 qadam.
// QADAM[i][4] — ikkinchi noutbuk («O‘yin do‘stimning noutbukida», qobiq.js juftlik) ro'yxati; bo'lmasa — o'yin noutbukiniki.
// BX, BS, BD — o'yin turi bo'yicha ekran (DARS.ekranTanlov: «Olma terish» — BXO, «Labirint» — BXL). 16-qadam (null) — bola ekrani o'zgarmaydi.
const QADAM = [
  ['Kirish', 'P1', ['B0', 'BK']],
  ['Savol: bitta o‘yinni qanday yasaymiz?', 'P2', ['P2N', 'BK']],
  ['Uch sinov', 'P2S', ['BK'], 'Ustoz usullarni sinayapti — kuzating'],
  ['Javob: ishni bo‘lamiz, navbat bilan', 'P2C', ['BK']],
  ['Yangi so‘z: xakaton', 'P3', ['BK'], 'Yangi so‘z: xakaton'],
  ['Reja', 'P4', ['BK'], 'Bugun: uchta bekat'],
  ['Bugungi qoida: rul va xarita', 'P6', ['BK'], 'Ustoz bugungi qoidani aytyapti'],
  ['Juftligingizni toping', 'P5', ['BJ', 'BK'], '', ['BJ', 'BJQ', 'BJD']],
  ['Tanlaymiz: o‘yin va qismlar', 'P5T', ['BT', 'BK'], '', ['BJD']],
  ['2-bekat', 'P4B', ['BK'], '2-bekat: yasaymiz', ['BJD']],
  ['Yasaymiz: navbat bilan', 'P5Y', ['BX'], '', ['BJD']],
  ['3-bekat', 'P4C', ['BK'], '3-bekat: sinaymiz', ['BJD']],
  ['Ko‘ramiz: hamma holatni sinaymiz', 'P8', ['BK'], 'Ustoz o‘yinni sinayapti — kuzating', ['BJD']],
  ['Sinaymiz: ro‘yxat', 'P5S', ['BS'], '', ['BJD']],
  ['Do‘stlar o‘ynaydi', 'P5D', ['BD'], '', ['BJD']],
  ['O‘yiningiz haqida ayting', 'P11', null],
  ['Yakun', 'P12', ['B5'], '', ['B5']],
  ['Sinfimiz bugun', 'P14', ['B5'], '', ['B5']],
]
// ustoz varag'i: [Ekranda · Siz (manbadagi tayanch gaplar, aynan) · Bola o'rganadi]
const VARAQ = [
  ['«15-dars · Xakaton №1» — «Bugun juftlikda o‘yin yasaymiz!» Maydon, Coddy (0, 0) da; pastda «O‘tgan darsda» — «Bitta qadam».', '«O‘tgan darsda xatolarni topib tuzatdik.» «Bugun yangi blok yo‘q. Do‘stingiz bilan bitta o‘yin yasaysiz.» «Noutbukda «Tayyorman» tugmasini bosing.»', 'Bugun juftlikda o‘yin yasashini biladi.'],
  ['Savol: «Bitta o‘yinni qanday yasaymiz?» Uchta karta: A «Ikkalamiz birga bosamiz» · B «Alohida-alohida yasaymiz» · C «Ishni bo‘lamiz, navbat bilan».', '«Bugun har o‘yinni ikki do‘st yasaydi. Qanday qilib?» «Har kim noutbukida bitta kartani tanlasin.»', 'Birga ishlash usuli haqida o‘ylaydi.'],
  ['Uch sinov: A — ikki bir xil dasturcha, → — ikki katak, ↑ — Bo‘shvoy («✕ ikkalamiz bir ishni qildik»). «Keyingi» — B: ikki yarim o‘yin («✕ ikki yarim o‘yin»). «Keyingi» — C: ro‘yxat, almashish, «Siz yutdingiz!» («✓ bitta to‘liq o‘yin»).', '«Birga bossak — bir ishni ikki marta qilamiz. Alohida-alohida yasasak — ikki yarim o‘yin.» «Ishni bo‘ldik: biri yasaydi, biri yordam beradi. Keyin almashadi.»', 'Uch usulning natijasini ko‘radi.'],
  ['Javob: «Ishni bo‘lamiz, navbat bilan». A va B xira, C oltin; ro‘yxatda ikki qism ✓, har birining yonida boshqa rul.', '«Ishni bo‘lamiz, navbat bilan. Avval o‘yin ishlasin — keyin qo‘shamiz.»', 'Bugungi asosiy fikrni eshitadi.'],
  ['Yangi so‘z: «Xakaton nima?» «Keyingi» — birma-bir: juftlik, ro‘yxat, tayyor o‘yin «Tayyor!».', '«Xakaton — birga, oz vaqtda bitta narsa yasash.» «Dasturchilar ham shunday qiladi: bir necha kishi bitta narsani birga yasaydi.»', '«Xakaton» so‘zini biladi.'],
  ['Reja: tepalik — tanlaymiz → yasaymiz → sinaymiz; cho‘qqida «Dars oxirida · do‘stlar o‘ynaydi».', '«Bugun uchta bekat: tanlaymiz, yasaymiz, sinaymiz.» «Dars oxirida o‘yiningizni boshqa juftlik o‘ynaydi.»', 'Darsda qayerda turganini biladi.'],
  ['Qoida: «Rul va xarita». «Keyingi» — birma-bir: haydovchi, xaritachi, qism tayyor — almashamiz.', '«Haydovchi — sichqoncha qo‘lida. Xaritachi — kartani o‘qiydi, nima kerakligini aytadi.» «Qism tayyor bo‘lsa — almashasiz. Ikkalangiz ham haydaysiz.» «Xaritachi sichqonchaga tegmaydi — gapirib yordam beradi.»', 'Ikki rolni biladi.'],
  ['Juftlik: «Juftligingizni toping» — «Juftlik bo‘ldi: N / M». Bola noutbukida ikki karta.', '«Juftligingiz bilan bitta noutbuk oldiga o‘tiring.» «Bitta noutbukda «O‘yin shu noutbukda»ni bosing, ikkinchisida — «O‘yin do‘stimning noutbukida».»', 'Juftligi bilan bitta noutbukda o‘tiradi.'],
  ['Doska: «O‘yinni tanlang!» — «Tanladi: N / M», ikki o‘yin kartasi va son.', '«Ikkalangiz kelishib oling: qaysi o‘yin, qaysi ikki qism.» «Birinchi qism hammada bir xil — usiz o‘yin yurmaydi.»', 'Juftligi bilan kelishib tanlaydi.'],
  ['Tepalik: 1-bekat ✓ — «Yasaymiz».', '«Avval o‘yin ishlasin: birinchi qism — strelkalar. Tayyor bo‘lsa — o‘ynab ko‘ring va almashing.»', 'Darsda qayerda turganini biladi.'],
  ['Doska: «Navbat bilan yasaymiz!» — zinapoya 1-qism · 2-qism · 3-qism · ★; «Uch qism tayyor: N / M». Taxminan 30-daqiqada bir marta og‘zaki eslatma.', '«Haydovchi bloklarni qo‘yadi, xaritachi kartani o‘qiydi.» «Har qismdan keyin o‘ynab ko‘ring. O‘yin ishlasa — almashing.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'Navbat bilan qism yasaydi va almashadi.'],
  ['Tepalik: 1, 2 ✓ — «Sinaymiz».', '«Yangi qism boshlamaymiz. Endi bor o‘yinni sinaymiz.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: «Hammasini sinaymiz». Tayyor o‘yin: to‘rt strelka va jon (change jon by −2). ▶ — yutasiz; kaktusga ikki marta tegasiz — jon −1, o‘yin tugamaydi; −2 ni −1 ga o‘zgartirib, uch marta — «O‘yin tugadi».', '«Yutdik — lekin bu hali hammasi emas. Kaktusga ataylab tegib ko‘ramiz.» «Xato — topiladigan narsa. Tuzatdik — yana sinaymiz.» «Endi o‘zingiz.»', 'Hamma holatni sinash kerakligini ko‘radi.'],
  ['Doska: «Sinang va tuzating!» — «Ro‘yxati to‘liq: N / M».', '«Xaritachi ro‘yxatni o‘qiydi, haydovchi sinaydi. Bitta band — bitta haydovchi, keyin almashing.» «Tugamagan qism o‘yinni buzmasin: tugating yoki olib tashlang.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘yinini hamma holatda sinaydi.'],
  ['Doska: «Do‘stlar o‘ynaydi» — «O‘ynab ko‘rildi: N / M»; stollar aylanasi.', '«Keyingi stolga o‘tamiz. O‘yinni o‘ynang — dasturiga tegmang.» «O‘ynab bo‘lgach — sizga nima yoqdi, belgilang.» «Joyingizga qayting: do‘stlar qanday o‘ynaganini ko‘ring.»', 'Do‘stlarning o‘yinini o‘ynaydi va belgilaydi.'],
  ['«O‘yiningiz haqida ayting»: uch qator va ikki o‘yin kartasi — aytayotgan juftlik o‘yini turini bosasiz. Ism yo‘q.', '«Qaysi juftlik o‘yini haqida aytadi? Ikkalangiz ham gapiring.» «Har juftlik o‘z qismlarini tanladi — shuning uchun o‘yinlar har xil.»', 'O‘yini haqida gapirib beradi.'],
  ['Yakun: «Siz o‘yin yasadingiz!» Bugungi so‘z — «Xakaton»; to‘rt belgi; keyingi dars — 16 · Klonlar.', '«Uchala bekatdan o‘tdik: tanladik, navbat bilan yasadik, sinadik.» «Ishni bo‘ldik, navbat bilan. Avval o‘yin ishladi — keyin qo‘shdik.» «Keyingi darsda bitta qahramondan ko‘p nusxa yasaymiz.»', 'Bugun nima qilganini biladi.'],
  ['Sinfimiz bugun: nechta o‘yin yasaldi, nechta qism, do‘stlar necha marta o‘ynadi (haqiqiy son, ismsiz).', '«Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o‘qiydi) «Bugun 7 ta o‘yin yasaldi — har biri boshqacha.» (haqiqiy son bilan)', 'Sinf natijasini ko‘radi.'],
]
