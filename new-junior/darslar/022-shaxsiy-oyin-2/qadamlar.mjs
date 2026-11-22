// 22-dars «Shaxsiy o‘yin 2 va Pre-Demo» qadamlari (QADAM) va ustoz varag'i (VARAQ) — 22.11. Manba: new-junior/manba/022-shaxsiy-oyin-2.md v1, 13 qadam.
// 11-qadam bola ro'yxati 'oxirgi' (A·1) — bola noutbukida oxirgi yechgan pog'onasi o'z dasturi bilan.
const QADAM = [
  ['Kirish', 'P1', ['B0', 'BK']],
  ['Reja', 'P4', ['BK'], 'Bugun: uchta bekat'],
  ['Ko‘ramiz: karta va o‘yin', 'P7', ['BK'], 'Ustoz kartani o‘qiyapti — kuzating'],
  ['O‘zingiz: tugatamiz', 'P5', ['B1A', 'B1Y', 'BK']],
  ['2-bekat', 'P4B', ['BK'], '2-bekat: sinaymiz'],
  ['Ko‘ramiz: ikki marta', 'P8', ['BK'], 'Ustoz o‘yinni sinayapti — kuzating'],
  ['O‘zingiz: sinaymiz', 'P5G', ['B2A', 'B2Y', 'BK']],
  ['3-bekat', 'P4C', ['BK'], '3-bekat: gapiramiz'],
  ['Ko‘ramiz: taqdimot', 'P10', ['BK'], 'Ustoz taqdimotni ko‘rsatyapti — kuzating'],
  ['O‘zingiz: taqdimot kartasi', 'P5B', ['K2', 'BK']],
  ['O‘yiningizni ko‘rsating', 'P11', 'oxirgi'],
  ['Yakun', 'P12', ['B5']],
  ['Sinfimiz bugun', 'P14', ['B5']],
]
// ustoz varag'i: [Ekranda · Siz (manbadagi tayanch gaplar, aynan) · Bola o'rganadi]
const VARAQ = [
  ['«22-dars · Shaxsiy o‘yin 2» — «Bugun o‘yin tayyor bo‘ladi!» Kosmos maydoni; pastda «O‘tgan darsda» — loyiha kartasi.', '«O‘tgan darsda o‘yin kartasini to‘ldirdik.» «Bugun o‘yinni tugatamiz, sinaymiz va ko‘rsatishni mashq qilamiz.» «Noutbukda «Tayyorman» tugmasini bosing.»', 'Darsga kiradi.'],
  ['Reja: tepalik — tugatamiz → sinaymiz → gapiramiz; cho‘qqida «Dars oxirida · o‘yin tayyor».', '«Bugun uchta bekat: tugatamiz, sinaymiz, gapiramiz.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: karta va o‘yin. 21-dars o‘yini; sahnada kichik karta «Mening o‘yinim» — kartani o‘qiysiz, o‘yinni o‘ynaysiz.', '«Kartani o‘qiymiz: nechta dushman? Nechta ball? Nechta jon? O‘yinda ham shunday.» «Yutish uchun kartadagi ballga yetamiz.»', 'Kartani o‘yin bilan solishtiradi.'],
  ['Mashq: «O‘yinni tugating!» — zinapoya: 1 kartadagidek · ★ hammasini uring.', '«Kartaga qarang: dushmanlar, ball, jon — hammasi kartadagidek.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘yinini kartaga mos tugatadi.'],
  ['Tepalik: 1-bekat ✓ — «Sinaymiz».', '«Bir marta ishlagani yetmaydi — ikki marta sinaymiz.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: ikki marta. O‘yinni o‘ynaysiz, keyin yana «▶ Boshlash» — ikkinchi o‘yinda ball yana 0 dan boshlanishini ko‘rsatasiz.', '«Ikkinchi o‘yinda ball yana 0 dan boshlanadimi? Tekshiramiz.»', 'Sinash nima ekanini ko‘radi.'],
  ['Mashq: «O‘yinni sinang!» — zinapoya: 1 ikki marta o‘ynang · ★ yutuqni oshiring.', '«Ikkinchi o‘yinda ball yana 0 dan boshlansin.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘yinni ikki marta sinaydi.'],
  ['Tepalik: 1, 2 ✓ — «Gapiramiz».', '«Oxirgi bekat: o‘yiningiz haqida aytib berasiz.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: taqdimot. Uch qator: mening o‘yinim, qanday yutiladi, eng qiyin joyi; siz namuna ko‘rsatasiz.', '«Uchta gap: mening o‘yinim, qanday yutiladi, eng qiyin joyi.» «Sekin va aniq gapiring — hamma tushunsin.»', 'Taqdimot qanday bo‘lishini ko‘radi.'],
  ['Mashq: «Sinfdoshingizga ayting!» — zinapoya: «Tayyorman» degan bolalar.', '«Sinfdoshingizga o‘yiningiz haqida uchta gap ayting. Keyin u sizga aytadi.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'Uchta gapni ovoz chiqarib aytadi.'],
  ['«O‘yiningizni ko‘rsating». To‘liq o‘yin; bola qoidasini aytadi, siz o‘ynaysiz. Proyektorda ism yo‘q.', '«Kim o‘yinini aytib beradi? Nechta dushman? Qanday yutiladi?»', 'O‘yinini sinfga ko‘rsatadi.'],
  ['Yakun: «O‘yin tayyor!» Keyingi dars — 23 · Demo Day.', '«Uchala bekatdan o‘tdik: tugatdik, sinadik, gapirdik.» «Keyingi darsda ota-onalaringiz o‘yiningizni o‘ynaydi.»', 'Bugungi natijani biladi.'],
  ['Sinfimiz bugun: nechta o‘yin yutildi, necha marta sinaldi, nechta pog‘ona bajarildi (haqiqiy son, ismsiz).', '«Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o‘qiydi)', 'Sinf natijasini ko‘radi.'],
]
