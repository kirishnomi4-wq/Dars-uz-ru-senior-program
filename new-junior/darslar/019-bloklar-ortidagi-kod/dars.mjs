// 19-dars e'loni (22.11): «Bloklar ortidagi kod: «Kodini ko‘rsat»». Manba: new-junior/manba/019-bloklar-ortidagi-kod.md (v1 — «Savollar» 1–10 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. Asos — 18-darsdagi kosmik o'yin (uch personaj, kosmik.js); yangisi — «Kodini ko‘rsat» (kod.js): dastur ustuni yonida JavaScript kodi,
// blok ↔ qator, koddagi son. 1-bekat — moslash (o'yin shart emas), 2-bekat — kodda son va o'yin (kosmik.kerak = 'kod'), 3-bekat — faqat kod, oldindan aytish (3-dars bashorat).
// Raketa va o'q, dushman — 18-darsda saqlangan dastur (K+'per', 18-dars kaliti), bo'lmasa tayyor. Sinov: sinov/dvigatel/kod.mjs
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]] // raketa: →[→] ←[←]
const OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]] // o'q: S[C] · K[R4[↑] D]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']] // dushman nusxasi: K[go(R0-6, 4) R4[↓] D]
const DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK] // dushman: ▶[Rn[C]] · K[…]
const OQB = [[['q', 'enemy'], ['c', 'ball:1']]] // o'q: T[change ball by 1]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]] // raketa: ▶[ball 0, jon 3] · T[jon −1; if jon = 0 → game over]
const PR = { royxat: [{ id: 'raketa', nom: 'Raketa' }, { id: 'oq', nom: 'O‘q' }, { id: 'dushman', nom: 'Dushman' }] }
const pD = { ...PR, tanla: 'dushman' }, pO = { ...PR, tanla: 'oq' }, pR = { ...PR, tanla: 'raketa' }
// 18-darsning to'liq o'yini (saqlanmagan bo'lsa)
const tayyor = () => ({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB], dushman: DSP(5) })
const kb = (kosmik, personaj, kod, o = {}) => ({ sahna: 'katak', oyin: true, kosmik: { dushman: { asl: [3, 4] }, ozg: true, ...kosmik }, personaj, prog: 'per', perProg: tayyor(), kod, ...o })
// 3-bekat: faqat kod (bloklar yashirin), raketa — maydon qahramoni; dastur — bitta zanjir (o'yinsiz ekran)
const bash = (prog, o = {}) => ({ sahna: 'katak', bashorat: true, prog: 'qoldir', kod: { faqat: true, tahrirYoq: true, prog: [prog] }, ...o })
const DARS = {
  raqam: 19,
  nom: 'Bloklar ortidagi kod',
  savol: 'Dasturni <em>yozuv</em> bilan qanday yozamiz?',
  // javon (loyiha — hammasi, 18-dars + Tovush): ★ «Yangi qator» — play sound
  javon: { e: [['k', 'right'], 'f', ['q', 'enemy'], 'g'], h: ['r', 'l', 'u', 'd', ['y', '3,4']], b: [['p', '4']], K: ['C', 'H', 'D'], o: [['z', 'ball:0'], ['c', 'ball:1'], ['m', '0-6']], a: [['i', 'jon:0']], t: [['n', 'qadam']] },
  maydon: { w: 7, h: 5 },
  masshtabMin: 0.5,
  dasturchalar: 'oyin', // o'yin ekranlari — dasturchalar; 3-bekat (oldindan aytish) — bitta zanjir
  dasturchaBlok: true,
  dasturchaUstun: 1,
  blokChegara: 12,
  maslahatKeyin: true,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  ozgaruvchi: ['ball', 'jon'],
  changeSonlar: [-3, -2, -1, 1, 2, 3, 5],
  dushmanTegish: true, // when touching — tur ro'yxatiga «enemy» (blockly.js BL_OLMA_D)
  perKalit17: 'jr018', // oldingi darsda saqlangan o'yin (kosmik.js perTayyorla, prog 'per17') — 18-dars
  klonGap: { sanoq: 'O‘q: N' },
  // kosmik o'yin gaplari (kosmik.js KS) — 18-dars bilan bir xil
  kosmikGap: {
    dasturi: 'dasturi', royxat: 'O‘yiningizda:', chek: [],
    oyinYz: 'O‘yin: ← → va space', dushSanoq: 'Dushman: N',
    bosh: 'Avval blokni bosing — u dasturga qo‘shiladi', boshP: 'Bu yerda hech narsa yo‘q-ku…',
    raketaKlon: 'create clone of myself — O‘q yoki Dushman dasturiga', raketaKlonP: 'Raketa ko‘payib ketdi!',
    turib: 'Nusxa when I start as a clone ostidagi bloklarni bajaradi', turibP: 'Men nima qilay?',
    chet: 'O‘q tepadan ham yuqoriga uchmoqchi bo‘ldi. move up necha marta?', chetP: 'Maydon tugadi!',
    chetD: 'Dushman yerdan ham pastga yurmoqchi bo‘ldi. move down necha marta?',
    qoldi: 'Uchib bo‘lgan o‘q o‘chsin — delete this clone', qoldiP: 'Tepada qolib ketdi!',
    yetmadi: 'O‘q tepaga yetmay o‘chdi. move up necha marta?', yetmadiP: 'Oz qoldi!',
    oqQani: 'O‘qni create clone of myself yasaydi — O‘q dasturida', oqQaniP: 'O‘q qani?',
    dushQani: 'Dushman nusxasini create clone of myself yasaydi — Dushman dasturida', dushQaniP: 'Dushman qani?',
    yerda: 'Tushib bo‘lgan dushman o‘chsin — delete this clone', yerdaP: 'Yerda qolib ketdi!',
    jonQani: 'Dushman tegdi. Raketa dasturida when touching enemy ostiga — change jon by -1', jonQaniP: 'Jon qani?',
    jonTugadi: 'Jon 0 bo‘lsa — o‘yin tugasin: if jon = 0 then → game over', jonTugadiP: 'Jon tugadi-ku!',
    ozP: 'Oz qoldi!', tugadi: 'O‘yin tugadi. ▶ Boshlash — yana o‘ynang', yutdi: 'Siz yutdingiz!',
  },
  // kod oynasi gaplari (kod.js KG2; N — son)
  kodGap: {
    sarlavha: 'Kod', ochish: 'Kodini ko‘rsat', yopish: 'Kodni yopish',
    korildi: 'Ochildi: N', topildi: 'Topildi: N / 3', ozgardi: 'Kodda o‘zgargan son: N',
    boshqaKarta: 'Endi boshqa personaj kartasini bosing',
    qatorTop: 'Belgilangan blokning qatorini bosing', blokTop: 'Belgilangan qatorning blokini bosing',
    boshqaQ: 'Belgilangan blokka qarang: uning so‘zi qaysi qatorda?', boshqaQP: 'Bu boshqa qator!',
    boshqaB: 'Qatordagi so‘zga qarang: qaysi blok shunday?', boshqaBP: 'Bu boshqa blok!',
    koddaO: 'Sonni kodda o‘zgartiring — qatordagi sonni bosing',
    ozgarmadi: 'Kodda son o‘zgarmadi — qatordagi sonni bosing', dush8: 'Dushman: N. Kodda dushmanlar sonini 8 qiling',
    ball2: 'Har dushman 2 ball bersin — kodda o‘zgartiring', uring: 'Dushmanni uring — ball oshadimi?',
    jon5: 'O‘yin 5 jon bilan boshlansin — kodda o‘zgartiring', jonQolsin: 'Jon qolsin — yana o‘ynang',
    ikkiSon: 'Kodda yana bitta sonni o‘zgartiring', yuting: 'Dushmanni uring va yuting',
    hukSarlavha: 'Kod', hukTushunmadi: 'Tushunmadim…',
    yutdi: 'Siz yutdingiz!',
  },

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 blok va qator (B1A…B1Y), 5–8 kodda son (B2A…B2Y), 9–12 kodni o'qiymiz (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Kodingizdan bitta qatorni o‘qib bering',
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda takrorlaymiz!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P7'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P8'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P10'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // bosh.kod — kod.js (och · faqat · kerak · tahrirYoq · prog); 2-bekat: kosmik.kerak = 'kod' (o'yin tugaganda kod.js kodOyinShart)
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P7: { tur: 'yol', chegara: 12, bosh: kb({}, pR, { och: false }, { prog: 0 }), gap: { boshla: ['', '«Kodini ko‘rsat»ni bosing'] } },
    B1A: { tur: 'yol', chegara: 12, bosh: kb({}, pR, { kerak: 'och' }, { pog: 1, prog: 'per17' }), maslahat: 'Kartalarni bittadan bosing: Raketa, O‘q, Dushman' },
    B1B: { tur: 'yol', chegara: 12, bosh: kb({}, pD, { och: true, kerak: 'qator' }, { pog: 2 }), maslahat: 'Blokning birinchi so‘ziga qarang — qatorda ham u bor' },
    B1C: { tur: 'yol', chegara: 12, bosh: kb({}, pO, { och: true, kerak: 'blok' }, { pog: 3 }), maslahat: 'moveUp — move up, createClone — create clone' },
    B1Y: { tur: 'yol', chegara: 12, bosh: kb({}, pR, { kerak: 'yangi' }, { pog: 4 }), maslahat: 'Kodni yoping, javondan play sound ni qo‘shing, keyin kodni oching' },
    P8: { tur: 'yol', chegara: 12, bosh: kb({}, pD, { och: true }, { prog: 0 }), gap: { boshla: ['', 'Qatordagi 5 ni bosing'] } },
    B2A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'kod' }, pD, { och: true, kerak: 'dush8' }, { pog: 5 }), maslahat: 'for qatoridagi son — necha marta nusxa yasaladi' },
    B2B: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'kod' }, pO, { och: true, kerak: 'ball2' }, { pog: 6 }), maslahat: 'ball = ball + 1 — qaysi son ball ga qo‘shiladi?' },
    B2C: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'kod' }, pR, { och: true, kerak: 'jon5' }, { pog: 7 }), maslahat: 'O‘yin boshida jon nechchi bo‘ladi? onStart ichiga qarang' },
    B2Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'kod' }, pD, { och: true, kerak: 'ikki' }, { pog: 8 }), maslahat: 'Kodda qaysi sonlar bor? Ikkitasini o‘zgartiring' },
    P10: { tur: 'yol', bosh: bash([['x', '1,0'], ['r'], ['r']]), gap: { boshla: ['', '(3, 0) katakni bosing — bayroqcha qo‘yiladi'] } },
    B3A: { tur: 'yol', bosh: bash([['x', '0,0'], ['r'], ['r'], ['u']], { pog: 9 }), maslahat: 'goTo — boshlanish katagi. Keyin har qator — bitta qadam' },
    B3B: { tur: 'yol', bosh: bash([['x', '1,0'], ['p', '4', [['r']]]], { pog: 10 }), maslahat: 'for qatoridagi son — ichidagi qator necha marta bajariladi' },
    B3C: { tur: 'yol', bosh: bash([['x', '6,2'], ['p', '3', [['l']]], ['u']], { pog: 11 }), maslahat: 'moveLeft — chapga, X kamayadi' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir', pog: 12, kod: { och: true, prog: [[['x', '0,0'], ['p', '2', [['r']]], ['u']]] } }, maslahat: 'Yulduz qaysi ustunda? for qatoridagi sonni o‘zgartiring' },
    P11: { tur: 'yol', chegara: 12, bosh: kb({}, pR, { och: true }, { prog: 0 }) },
    B5: { ish: 'natija' },
  },
  // natija: ta qatorni topdi — 'Q' (moslash), ta sonni o‘zgartirdi — 'S' (kodda), pog‘ona bajardi — 12 pog'ona
  natija: [{ k: 'ta qatorni topdi', blok: 'Q' }, { k: 'ta sonni o‘zgartirdi', blok: 'S' }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-019-bloklar-ortidagi-kod-v1', versiya: 'v1', kalit: 'jr019',
    // «Kod o‘quvchi» — 1-bekatning 3-pog'onasi (blok ↔ qator); «Kod ustasi» — 2-bekatning 3-pog'onasi (kodda son)
    yutuqlar: [{ t: 'pog', n: 3, nom: 'kodchi' }, { t: 'pog', n: 7, nom: 'kodusta' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> bloklar va kod — bitta dastur, ikki ko‘rinish. Har blok — bitta qator; kompyuter kodni bajaradi.',
    '<b>Yo‘l:</b> huk (dasturni yozuv bilan qanday yozamiz — uch sinov) → yangi so‘z «kod» → reja → 1-bekat «Blok va qator» → 2-bekat «Kodda son» → 3-bekat «Kodni o‘qiymiz» → kodni o‘qib berish → yakun.',
    '<b>«Kodini ko‘rsat»</b> — dastur ustunidagi tugma: kod javon o‘rnida, bloklar yonida chiqadi. Kodda sonni bosib o‘zgartirsa bo‘ladi — blok ham o‘zgaradi.',
    '<b>Tinish belgilari:</b> qavs, nuqtali vergul nomlanmaydi — «kodning tinish belgilari, kompyuterga kerak». for, let, === tushuntirilmaydi: «bu qatordagi 5 — necha marta».',
    '<b>Yechimni aytmang:</b> «Blokning so‘zi qatorda qanday yozilgan? Qaysi qatorda son bor? Raketa birinchi qatordan keyin qayerda?»',
    '<b>18-darsda o‘yini saqlanmagan bola</b> uchun o‘yin tayyor keladi — bu xato emas. 16-qadamda proyektorga ism chiqmaydi.',
  ],
}
