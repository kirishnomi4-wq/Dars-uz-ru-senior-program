// 23-dars «Demo Day №1» qadamlari (QADAM) va ustoz varag'i (VARAQ) — 22.11. Manba: new-junior/manba/023-demo-day-1.md v1, 12 qadam.
const QADAM = [
  ['Kirish', 'P1', ['B0', 'BK']],
  ['Reja', 'P4', ['BK'], 'Bugun: uchta bekat'],
  ['Ko‘ramiz: Demo Day qoidalari', 'P7', ['BK'], 'Ustoz qoidalarni aytyapti'],
  ['O‘zingiz: oxirgi sinov', 'P5', ['B1A', 'BK']],
  ['2-bekat', 'P4B', ['BK'], '2-bekat: ko‘rsatamiz'],
  ['Ko‘ramiz: mehmon qanday o‘ynaydi', 'P8', ['BK'], 'Ustoz o‘yinni ko‘rsatyapti — kuzating'],
  ['O‘zingiz: mehmon o‘ynaydi', 'P5G', ['B2A', 'B2Y', 'BK']],
  ['3-bekat', 'P4C', ['BK'], '3-bekat: uyga olib ketamiz'],
  ['Ko‘ramiz: uy yo‘riqnomasi', 'P10', ['BK'], 'Ustoz yo‘riqnomani ko‘rsatyapti'],
  ['O‘zingiz: yo‘riqnoma kartasi', 'P5B', ['Y1', 'BK']],
  ['Yakun', 'P12', ['B5']],
  ['Sinfimiz bugun', 'P14', ['B5']],
]
// ustoz varag'i: [Ekranda · Siz (manbadagi tayanch gaplar, aynan) · Bola o'rganadi]
const VARAQ = [
  ['«23-dars · Demo Day №1» — «Demo Day!» Kosmos maydoni: raketa, o‘q, dushman; pastda «O‘tgan darsda» — taqdimot.', '«Hurmatli mehmonlar, xush kelibsiz! Bugun bolalar o‘z o‘yinlarini ko‘rsatadi.» «O‘tgan darsda o‘yinimiz haqida gapirishni mashq qildik.» «Noutbukda «Tayyorman» tugmasini bosing.»', 'Darsga kiradi, mehmonlarni salomlaydi.'],
  ['Reja: tepalik — tayyorlanamiz → ko‘rsatamiz → uyga olib ketamiz; cho‘qqida «Dars oxirida · uy yo‘riqnomasi».', '«Bugun uchta bekat: tayyorlanamiz, ko‘rsatamiz, uyga olib ketamiz.»', 'Darsda qayerda turganini biladi.'],
  ['Qoidalar: «Demo Day qoidalari». Uch qator: mehmon o‘ynaydi · bola aytib beradi · savolga javob beradi.', '«Mehmon o‘ynaydi, bola aytib beradi: nechta dushman, qanday yutiladi, eng qiyin joyi.» «Mehmon yutmasa ham yaxshi: yana urinadi.»', 'Demo Day qoidalarini eshitadi.'],
  ['Mashq: «O‘yinni sinab oling!» — pog‘ona: oxirgi sinov.', '«O‘yiningiz ishlayaptimi? Kartadagidek yuting.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘yinini oxirgi marta sinaydi.'],
  ['Tepalik: 1-bekat ✓ — «Ko‘rsatamiz».', '«Hurmatli mehmonlar, noutbuklarga marhamat.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: mehmon qanday o‘ynaydi. O‘yinni ← → va probel bilan o‘ynaysiz.', '«O‘ynash oson: strelkalar — raketa, probel — o‘q. Dushman tegsa — jon kamayadi.»', 'Mehmonga qanday tushuntirishni ko‘radi.'],
  ['Demo Day: «Mehmon o‘ynaydi!» — zinapoya: 1 mehmon o‘ynadi · ★ mehmon yutdi.', '«Mehmon o‘ynasin. Siz aytib bering: nechta dushman, qanday yutiladi, eng qiyin joyi.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'O‘yinini mehmonga ko‘rsatadi va tushuntiradi.'],
  ['Tepalik: 1, 2 ✓ — «Uyga olib ketamiz».', '«Oxirgi bekat: uyda davom ettirishni o‘rganamiz.»', 'Darsda qayerda turganini biladi.'],
  ['Ko‘ramiz: uy yo‘riqnomasi. «Uyda davom eting» — uch qadam va jadval «Blok studiya → Scratch».', '«Scratch — bolalar uchun bepul dasturlash sayti. Bloklar bizniki bilan deyarli bir xil.» «Saytga kirishdan oldin ota-onangizdan ruxsat so‘rang.»', 'Uyda davom ettirish yo‘lini biladi.'],
  ['Mashq: «Yo‘riqnomani oling!» — pog‘ona: yo‘riqnoma kartasi.', '«Yo‘riqnoma kartasini o‘qing. Uyda ota-onangiz bilan davom etasiz.» Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»', 'Yo‘riqnomani o‘qiydi.'],
  ['Yakun: «Demo Day tugadi!» «1-modul tugadi!» Keyingi dars — 24 · Sun‘iy intellekt (AI) nima.', '«Uchala bekatdan o‘tdik. Birinchi modul tugadi — o‘z o‘yiningizni yasadingiz!» «Keyingi modulda sun‘iy intellekt bilan tanishamiz.»', 'Modul yakunlanganini biladi.'],
  ['Sinfimiz bugun: nechta o‘yin tugadi, nechta mehmon yutdi, nechta pog‘ona bajarildi (haqiqiy son, ismsiz).', '«Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o‘qiydi; mehmonlarga minnatdorchilik)', 'Sinf natijasini ko‘radi.'],
]
