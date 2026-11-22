// 16-dars e'loni (21.11): «Klonlar». Manba: new-junior/manba/016-klonlar.md (v1 — «Savollar» 1–10 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. Dastur egasi — dushman (bosh.klon): `when ▶ clicked` — asl bajaradi, `when I start as a clone` — har nusxa (alohida, bir vaqtda);
// yangi «Klon» oilasi — create clone of myself (C), when I start as a clone (H), delete this clone (D) — klon.js, blockly.js. Maydon — «Kosmos» (3-darsdagi maydon).
// 3-bekat: o'yin — dushman dasturi va qahramon (← →) bir vaqtda, jon 3; nusxa qahramonga tushsa — jon −1. Sinov: sinov/dvigatel/klon.mjs
const DARS = {
  raqam: 16,
  nom: 'Klonlar',
  savol: 'Ko‘p dushmanni <em>qanday</em> tushiramiz?',
  // javon (dars bo'yicha): Klon, Hodisa (▶), Harakat (move down, go to — son katakli), Takrorlash, random; pog'onaning o'zi — ekranlar.mjs (JAVON)
  javon: { K: ['C', 'H'], e: ['f'], h: ['d', ['y', '3,4']], b: [['p', '4']], o: [['m', '0-6']] },
  maydon: { w: 7, h: 5 },
  masshtabMin: 0.5,
  dasturchalar: true,
  dasturchaBlok: true,
  dasturchaUstun: 1,
  blokChegara: 12,
  maslahatKeyin: true,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  // dushman gaplari (klon.js KG; N — son, (x, y) — katak)
  klonGap: {
    sanoq: 'Nusxa: N', ishlayapti: 'Dastur ishlayapti…', tayyor: 'Hammasi tushdi!',
    bosh: 'Avval blokni bosing — u dasturga qo‘shiladi', boshP: 'Bu yerda hech narsa yo‘q-ku…',
    yoq: 'Nusxani create clone of myself bloki yasaydi', yoqP: 'Nusxa qani?',
    turib: 'Nusxa when I start as a clone ostidagi bloklarni bajaradi', turibP: 'Men nima qilay?',
    yetmadi: 'Nusxa (x, y) da to‘xtadi. Yergacha yana N ta katak', yetmadiP: 'Yerga yetmadi!',
    chet: 'Nusxa yerdan ham pastga yurmoqchi bo‘ldi. move down necha marta?', chetP: 'Maydon tugadi!',
    chetX: 'random N ni tanladi. Maydonda X — 0 dan 6 gacha', chetY: 'random N ni tanladi. Maydonda Y — 0 dan 4 gacha',
    soni: 'N ta nusxa tushishi kerak', kamP: 'Oz qoldi!', kopP: 'Ko‘payib ketdi!',
    bir: 'Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying', birP: 'Yana o‘sha joy!',
    ustun: 'random N ni ham tanlashi mumkin. random sonlarini tekshiring', ustunP: 'Bu yerga emas!',
    joy: 'Nusxa (x, y) ga tushdi. Kerak — (a, b)', joyP: 'Bu yerga emas!',
    yerda: 'Tushib bo‘lgan nusxa o‘chsin — delete this clone', yerdaP: 'Yerda qolib ketdi!',
    kamida: 'Kamida N ta dushman bo‘lsin',
    oyinIshora: 'O‘yin: ← → bilan qoching', jonTugadi: 'Jon tugadi. ▶ Boshlash — yana o‘ynang', yutdi: 'Siz yutdingiz!',
  },

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 bitta nusxa (B1A…B1Y), 5–8 ko'p nusxa (B2A…B2Y), 9–12 o'yin (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturingizni ustozga o‘qib bering',
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda kosmik o‘yin bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P7'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P8'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P10'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // bosh.klon — dushman dasturi: asl, soni, joy, ustun ('xil' | [a, b]), random (3-bekat: random shart), jon; prog — tayyor dastur (HTML) yoki 0
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P7: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 1 }, prog: [0, 'qoldir'] }, gap: { boshla: ['', 'Ikki dasturcha: when ▶ clicked va when I start as a clone'] } },
    B1A: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 1 }, prog: 'qoldir', pog: 1 }, maslahat: 'Nusxani kim yasaydi? Asl ▶ bosilganda nima qilsin?' },
    B1B: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', klon: { asl: [5, 4], soni: 1 }, prog: 'qoldir', pog: 2 }, maslahat: 'Nusxa tepada paydo bo‘ladi. Yergacha nechta katak?' },
    B1C: { tur: 'yol', chegara: 6, bosh: { sahna: 'katak', klon: { asl: [2, 4], soni: 2 }, prog: 'qoldir', pog: 3 }, maslahat: 'Har create clone — bitta nusxa' },
    B1Y: { tur: 'yol', chegara: 6, bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 1, joy: [[1, 0]] }, prog: 'qoldir', pog: 4 }, maslahat: 'Nusxa avval qaysi ustunga borsin?' },
    P8: { tur: 'yol', chegara: 9, tanlov: [1, 5, 2, 6, 0, 4, 3, 1, 5, 2], bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 5, ustun: 'xil' }, prog: 'qoldir', soloProg: [[['f'], ['p', '5', [['C']]]], [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]]]] }, gap: { boshla: ['', 'Har nusxa o‘z random sonini tanlaydi — ishga tushiring'] } },
    B2A: { tur: 'yol', chegara: 9, bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 5 }, prog: 'qoldir', pog: 5 }, maslahat: 'Nechta nusxa kerak? repeat ichiga nima qo‘yiladi?' },
    B2B: { tur: 'yol', chegara: 9, bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 4, ustun: 'xil' }, prog: 'qoldir', pog: 6 }, maslahat: 'Har nusxa o‘z sonini tanlasin — qaysi blok sonni o‘zi tanlaydi?' },
    B2C: { tur: 'yol', chegara: 9, bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 5, ustun: [0, 3] }, prog: 'qoldir', pog: 7 }, maslahat: 'Chap yarmi — 0 dan nechagacha?' },
    B2Y: { tur: 'yol', chegara: 9, bosh: { sahna: 'katak', klon: { asl: [3, 4], soni: 10, ustun: 'xil' }, prog: 0, pog: 8 }, maslahat: 'O‘nta nusxa — repeat soni nechchi?' },
    P10: { tur: 'yol', chegara: 10, tanlov: [2, 5, 3, 0, 6, 4, 1, 3, 5, 2, 4, 0], bosh: { sahna: 'katak', oyin: true, klon: { asl: [3, 4], soni: 6 }, prog: 'qoldir' }, gap: { boshla: ['', 'Nusxa dasturchasining oxiriga delete this clone qo‘ying'] } },
    B3A: { tur: 'yol', chegara: 10, bosh: { sahna: 'katak', oyin: true, klon: { asl: [3, 4], soni: 5 }, prog: 'qoldir', pog: 9 }, maslahat: 'Nusxa yerga tushdi — keyin nima bo‘lsin?' },
    B3B: { tur: 'yol', chegara: 10, bosh: { sahna: 'katak', oyin: true, klon: { asl: [3, 4], soni: 8 }, prog: 'qoldir', pog: 10 }, maslahat: 'Sakkizta dushman — asl nechta nusxa yasasin?' },
    B3C: { tur: 'yol', chegara: 10, bosh: { sahna: 'katak', oyin: true, klon: { asl: [3, 4], soni: 6, ustun: [1, 5], random: true }, prog: 'qoldir', pog: 11 }, maslahat: 'Eng chetdagi ikki ustun bo‘sh qolsin — random qaysi sonlardan?' },
    B3Y: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', oyin: true, klon: { asl: [3, 4], soni: 0, random: true, kamida: 5 }, prog: 0, pog: 12 }, maslahat: 'Avval nechta dushman bo‘lishini o‘ylang, keyin qaysi ustunlardan' },
    P11: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', oyin: true, klon: { asl: [3, 4] }, prog: 0 } },
    B5: { ish: 'natija' },
  },
  // natija: ta nusxa yasadi — 'N' (hamma muvaffaqiyatli ishga tushirishlarda); ta o‘yin yutdi — 'W'; pog‘ona bajardi — 12 pog'ona
  natija: [{ k: 'ta nusxa yasadi', blok: 'N' }, { k: 'ta o‘yin yutdi', blok: 'W' }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-016-klonlar-v1', versiya: 'v1', kalit: 'jr016',
    // «Nusxachi» — 1-pog'ona (birinchi nusxa yerga tushdi); «Dushman yomg‘iri» — 2-bekatning ★ (o'nta nusxa)
    yutuqlar: [{ t: 'pog', n: 1, nom: 'nusxachi' }, { t: 'pog', n: 8, nom: 'yomgir' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> dushmanni bir marta yasaymiz — nusxalarni dastur o‘zi yasaydi; har nusxa when I start as a clone ni bajaradi; tushgan nusxa o‘chadi. Hukda, xulosada (12) va yakunda chiqadi.',
    '<b>Yo‘l:</b> huk (beshta dushman — uch sinov) → yangi so‘z «klon» → reja → 1-bekat «Bitta nusxa» → 2-bekat «Ko‘p nusxa» → 3-bekat «O‘yin» → o‘qib berish → yakun.',
    '<b>Ikki dasturcha:</b> «asl uchun» (when ▶ clicked — nusxa yasaydi) va «nusxa uchun» (when I start as a clone — nusxa nima qiladi). Bola adashsa — «qaysi dasturchani asl bajaradi, qaysini nusxa?» deb so‘rang.',
    '<b>Yangi bloklar</b> — oila «Klon» (to‘q sariq): create clone of myself — o‘zimdan nusxa yasa; when I start as a clone — nusxa bo‘lib boshlaganimda; delete this clone — bu nusxani o‘chir (14-qadamda). Nusxalar bir vaqtda harakatlanadi — har nusxa o‘z dasturchasini o‘zi bajaradi.',
    '<b>Yechimni aytmang:</b> «Nusxa qayerda to‘xtadi? Yergacha nechta katak? Nechta nusxa kerak — repeat soni nechchi? random qaysi ustunlarni tanlaydi?» 3-bekat o‘yini qiyin bo‘lsa — ← → ni erta bosishni maslahat bering.',
    '<b>Ko‘rish ekranlarida</b> (huk, 7, 10, 14-qadam) tasodif oldindan berilgan: 10-qadamda birinchi beshta nusxa bir ustundan, random qo‘yilgach — 1, 5, 2, 6, 0. 16-qadamda proyektorga ism chiqmaydi.',
  ],
}
