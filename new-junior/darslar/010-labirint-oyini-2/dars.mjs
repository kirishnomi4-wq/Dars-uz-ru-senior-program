// 10-dars e'loni (20.11): «Labirint o‘yini 2». Manba: new-junior/manba/010-labirint-oyini-2.md (v1.1, tavsiya bo'yicha qurildi — «Savollar» 1–10 hammasi A).
// Faqat ma'lumot. 9-darsning davomi: o'sha o'yin (dastur 9-darsdan — DARS.oyin9), o'sha maydon; yangi — labirint yasash (bosh.yasash), darajalar
// (bosh.darajalar), «Do‘stingiz o‘ynaydi» (studiya BD) — studiya.js «10-dars» bo'limi.
const DARS = {
  raqam: 10,
  nom: 'Labirint o‘yini 2',
  savol: 'Ikkinchi labirintni <em>qanday</em> qo‘shamiz?', // 71-qaror: «O‘yinga …» uch qator bo'lardi (setka) — manba v1.2
  javon: { e: [['k', 'right']], h: ['r', 'l', 'u', 'd', 'x'], a: [['a', 'right']], t: [['n', 'qadam']] },
  maydon: { w: 7, h: 5 },
  dasturchalar: true,
  dasturchaBlok: true,
  dasturchaUstun: 2, // 9-darsdagidek (blockly.js blTartib2)
  blokChegara: 16,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  oyin9: true, oyinTayyor: 'qoida', // o'yin 9-darsdan; bo'lmasa — tayyor (to'rt strelka, har birida qoida)
  chekStatik: true, // «Qoida» va «2-daraja: kalit va eshik» — dasturdan va labirintdan (9-darsdagi ✓ bo'lib keladi)
  chek: [['strelka', 'To‘rt strelka'], ['qoida', 'Qoida'], ['daraja2', '2-daraja: kalit va eshik'], ['ikki', 'Ikki daraja yutildi'], ['dost', 'Do‘stingiz o‘ynadi']],

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2Y', 'B3A', 'B3Y', 'BD', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 o'z labirinti (B1A…B1Y), 5–7 kalit va eshik (B2A, B2B, B2Y), 8–9 ikki daraja (B3A, B3Y), 10 — do'sti o'ynadi (BD)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 6, 4], P5B: ['pog', 8, 7], P11: ['pog', 10, 9], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda ball bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3Y'], 15: ['BD'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2Y', 'B3A', 'B3Y', 'BD'],
    gap: [],
  },

  // labirintlar — manba «Labirintlar» jadvali (tepadan pastga; '#' devor, '.' yo'l, S start, * yulduz, K kalit, E eshik). Sinov: sinov/dvigatel/labirint.mjs
  labirintlar: {
    D1: '##...#*|#K#.##.|#.#..E.|#.#.###|S...###', D1B: '##..##*|#K#.##.|#....E.|#.#.###|S...###', Z: '....#.*|.##.#.#|.#..#.#|.#.##..|S......',
    BOSH: '......*|.......|.......|.......|S......', U1: '..#...*|.##.#.#|....#..|.##.##.|S......', U2: '..#..E*|.##.#.#|K...#..|.##.##.|S......',
  },
  oyinlar: {
    qoida: ['right', 'left', 'up', 'down'].map((y) => [y, [{ t: 'a', yon: y, ichki: [{ t: { right: 'r', left: 'l', up: 'u', down: 'd' }[y] }] }]]),
    bosh: [], // huk A: yangi o'yin — dastur bo'sh
  },

  // labirint yasash: bosh.yasash, xarita (ustoz), xaritaSolo, kerak (pog'ona sharti), olchov (o'lchov qatori); o'yin: bosh.darajalar
  studiya: {
    B0: { ish: 'oyinKarta' }, // «O‘yiningiz ochildi» yoki «Tayyor o‘yin ochildi» (9-darsdagi o'yin saqlanganmi)
    P2: { ish: 'sahnaOyin', dastur: 'qoida', avto: '→↑↑↑↓↓↓→→↑↑→→→↑↑', darajalar: ['D1'] },
    P2N: { ish: 'sahnaOyin', dastur: 'qoida', avto: '→↑↑↑↓↓↓→→↑↑→→→↑↑', darajalar: ['D1'], soloFaqat: true },
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, xarita: 'BOSH', xaritaSolo: 'U1', prog: 'qoldir', olchov: ['devor', 'yol'] }, gap: { boshla: ['', 'Katakni bosing — devor. Yana bosing — devor ketadi'] } },
    B1A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, prog: 'oldingi', pog: 1, kerak: { devor: 6 }, olchov: ['devor', 'yol'] }, gap: { yetdi: 'Labirint tayyor!' }, maslahat: 'Devorlar yo‘lni to‘smasin: yulduzga yo‘l qolsin' },
    B1B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, prog: 'oldingi', pog: 2, kerak: { yol: 14 }, olchov: ['yol'] }, gap: { yetdi: 'Labirint tayyor!' }, maslahat: 'To‘g‘ri yo‘lni devor bilan to‘sing — qahramon aylanib o‘tsin' },
    B1C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, prog: 'oldingi', pog: 3, kerak: { burilish: 5 }, olchov: ['burilish'] }, gap: { yetdi: 'Labirint tayyor!' }, maslahat: 'Uzun to‘g‘ri yo‘lak bormi? Uni devor bilan bo‘ling' },
    B1Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, prog: 'oldingi', pog: 4, kerak: { boshiBerk: 2 }, olchov: ['boshiBerk'] }, gap: { yetdi: 'Labirint tayyor!' }, maslahat: 'Yo‘ldan chetga qisqa yo‘lak oching — oxiri devor bo‘lsin' },
    P7: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, xarita: 'U1', xaritaSolo: 'U2', prog: 'qoldir', olchov: ['kalit', 'eshik', 'yol'] }, gap: { boshla: ['', 'Katakni bosing — devor. Yana bosing — devor ketadi'] } },
    B2A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, prog: 'oldingi', pog: 5, kerak: { eshik: true }, olchov: ['kalit', 'eshik'] }, gap: { yetdi: 'Labirint tayyor!' }, maslahat: 'Yulduzga qaysi katakdan kiriladi? Eshikni o‘sha yo‘lga qo‘ying' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, prog: 'oldingi', pog: 6, kerak: { eshik: true, qaytish: true }, olchov: ['qaytish'] }, gap: { yetdi: 'Labirint tayyor!' }, maslahat: 'Yo‘ldan chetdagi yo‘lak bormi? Kalitni o‘sha yerga qo‘ying' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, yasash: true, prog: 'oldingi', pog: 7, kerak: { eshik: true, yol: 20 }, olchov: ['yol'] }, gap: { yetdi: 'Labirint tayyor!' }, maslahat: 'Kalit va yulduz bir-biridan uzoqroq bo‘lsa — yo‘l uzayadi' },
    P8: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, darajalar: ['D1', 'U2'], prog: 'qoldir', chek: true, shartGap: true }, gap: { yetdi: 'Siz yutdingiz!' } },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, darajalar: ['D1', 'L2'], prog: 'oldingi', pog: 8, chek: true, chekTola: ['strelka', 'qoida', 'daraja2', 'ikki'], saqla: true, shartGap: true, qoidaIshora: true }, gap: { yetdi: 'O‘yiningiz tayyor!', boshla: '▶ Boshlash — 1-darajadan' }, maslahat: 'Ro‘yxatda bo‘sh band bormi? Avval shuni to‘ldiring' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, labirint: true, darajalar: ['D1', 'L2'], prog: 'oldingi', pog: 9, chek: true, adashmay: true, saqla: true, shartGap: true }, gap: { yetdi: 'Siz yutdingiz!', boshla: '▶ Boshlash — 1-darajadan' }, maslahat: 'Shoshilmang: har bosishdan oldin yo‘lga qarang' },
    BD: { ish: 'sahnaOyin', dost: true, darajalar: ['D1', 'L2'], tugma: '▶ Do‘stingiz o‘ynaydi', pog: 10, gap: { boshla: ['Do‘stingiz o‘ynaydi: faqat strelkalar', 'Kimgadir o‘ynating — uydagilardan biri o‘ynasa bo‘ladi'] } },
    B5: { ish: 'natija' },
  },
  // natija: bola — 2-darajadagi devorlar (D), uning yo'li (Q), yutilgan darajalar (G); sinf — yasalgan labirintlar, do'st o'ynagan o'yinlar, darajalar
  natija: [{ k: 'ta devor qo‘ydi', blok: 'D' }, { k: 'qadam — labirintingiz yo‘li', blok: 'Q' }, { k: 'daraja yutdi', blok: 'G' },
    { k: 'ta labirint yasaldi', ekran: ['L2'] }, { k: 'ta o‘yinni do‘st o‘ynadi', ekran: ['BD'] }, { k: 'daraja yutildi', blok: 'G' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-010-labirint-oyini-2-v1', versiya: 'v1', kalit: 'jr010',
    yutuqlar: [{ t: 'pog', n: 1, nom: 'yasovchi' }, { t: 'pog', n: 8, nom: 'ikki_daraja' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> tayyor o‘yinni buzmaymiz — unga yangi daraja qo‘shamiz; dastur bitta, labirint ko‘p.',
    '<b>Yo‘l:</b> huk (ikkinchi labirint — uch sinov) → yangi so‘z «daraja» → reja → 1-bekat «O‘z labirintingiz» → 2-bekat «Kalit va eshik» → 3-bekat «Ikki daraja» → do‘stingiz o‘ynaydi → yakun.',
    '<b>Labirint yasash:</b> asbobni tanlang (Devor · Kalit · Eshik · Yulduz), katakni bosing. Devor — yana bosilsa olinadi; kalit, eshik, yulduz — bittadan, ko‘chadi. Start (0, 0) o‘zgarmaydi. Sahna tepasida o‘lchov: devor, yo‘l, burilish…',
    '<b>Labirint yasashda yagona javob yo‘q.</b> Bolaga labirint chizib bermang — o‘lchovdagi songa qaratib savol bering: «Yo‘lni qanday uzaytirasiz?»',
    '<b>16-qadam:</b> juftlarni oldindan o‘ylang (yoningizdagi do‘st; toq bo‘lsa — uchtadan). «Do‘stingiz o‘ynaydi» rejimida dastur yopiq — do‘st o‘yinni o‘zgartirmaydi.',
  ],
}
// har studiya ekranining chegarasi 16 (9-darsdagidek)
for (const k in DARS.studiya) if (DARS.studiya[k].bosh) DARS.studiya[k].chegara = DARS.blokChegara
