// 20-dars e'loni (22.11): «Takrorlash va test». Manba: new-junior/manba/020-takrorlash-va-test.md (v1 — «Savollar» 1–8 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. Test — amaliy topshiriqlar (59-qaror: dars ichida test SAVOLI yo'q): kosmik o'yin (17–19-dars) ustida. 1-bekat — tezkor takrorlash (maslahat bor,
// topshiriqning o'z dasturi bilan), 2-bekat — test (maslahat matni «Test paytida maslahat yo‘q»; test qilinayotgan personaj dasturi noldan), 3-bekat — katta test (to'liq o'yin).
// Sinov: sinov/dvigatel/test20.mjs
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
const TEST_M = 'Test paytida maslahat yo‘q'
const DARS = {
  raqam: 20,
  nom: 'Takrorlash va test',
  savol: 'Qaysi mavzu sizga <em>qiyin</em>?',
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
  // kosmik o'yin gaplari (kosmik.js KS) — 18-dars bilan bir xil (chek-list — 3-bekat)
  kosmikGap: {
    dasturi: 'dasturi', royxat: 'O‘yiningizda:',
    chek: [['tushadi', 'Dushmanlar tushadi'], ['ball', 'O‘q urganda ball'], ['jon', 'Tekkanda jon'], ['tugaydi', 'Jon tugasa — o‘yin tugaydi'], ['yutdi', 'O‘yin yutildi']],
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
    ballQani: 'O‘q dushmanni urdi. O‘q dasturida when touching enemy ostiga — change ball by 1', ballQaniP: 'Ball qani?',
    eskiBall: 'O‘yin boshida ball 0 bo‘lsin — set ball to 0', eskiBallP: 'Eski ball!',
    jonQani: 'Dushman tegdi. Raketa dasturida when touching enemy ostiga — change jon by -1', jonQaniP: 'Jon qani?',
    jonTugadi: 'Jon 0 bo‘lsa — o‘yin tugasin: if jon = 0 then → game over', jonTugadiP: 'Jon tugadi-ku!',
    soni: 'N ta dushman tushsin', bir: 'Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying', birP: 'Yana o‘sha joy!',
    urdiKam: 'Yana uring: N ta dushman', ballKam: 'Ball: N. Yana uring!', ikkiBall: 'Har dushman 2 ball bersin', ozP: 'Oz qoldi!',
    ikkinchi: 'Endi yana ▶ Boshlash — ball 0 dan boshlanadimi?', toliq: 'Yuting: kamida 3 ball, jon qolsin', kamida8: 'Kamida 8 ta dushman bo‘lsin',
    tegsin: 'Ataylab dushman ostida turing — jon kamayadimi?', toliqKam: 'Ro‘yxatga qarang: qaysi band hali ✓ emas?', tugadiYutdi: 'Jon 0 — o‘yin tugadi. Qoida ishlayapti!',
    tugadi: 'O‘yin tugadi. ▶ Boshlash — yana o‘ynang', yutdi: 'Siz yutdingiz!',
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

  // pog'onalar: 1–4 takrorlash (B1A…B1Y), 5–8 test (B2A…B2Y), 9–10 katta test (B3A, B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 9, 8], P13: ['pog', 7, 4], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'O‘yiningiz qoidasini ustozga aytib bering',
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda o‘z o‘yiningizni yasaymiz!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2C'], 3: ['P3'], 4: ['P4'], 5: ['P7'], 6: ['B1A', 'B1B', 'B1C', 'B1Y'], 7: ['P4B'], 8: ['B2A', 'B2B', 'B2C', 'B2Y'], 9: ['P4C'], 10: ['P10'], 11: ['B3A', 'B3Y'], 13: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3Y'],
    gap: [],
  },

  // bosh.kosmik.kerak — pog'ona sharti (kosmik.js): dush5 · ustun · ball1 · ball2 · tugaydi · toliq · oz · kod (kod.js); bosh.kod — kod oynasi (kod.js)
  // progYoq — shu personajning saqlangan dasturi olinmaydi (noldan); perProg — tayyor dastur. Maslahat 2-bekatda: «Test paytida maslahat yo‘q»
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P7: { tur: 'yol', chegara: 12, bosh: kb({}, pR, undefined, { prog: 0 }), gap: { boshla: ['', '«▶ Boshlash»ni bosing — o‘yin ishlaydi'] } },
    // 1-bekat: tezkor takrorlash (maslahat bor)
    B1A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'dush5' }, pD, undefined, { pog: 1, prog: 'per17', perProg: { ...tayyor(), dushman: [[['f'], ['C']], DK] } }), maslahat: 'Beshta nusxa — qaysi blok takrorlaydi?' },
    B1B: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'ball1' }, pO, undefined, { pog: 2, progYoq: ['oq'], perProg: { ...tayyor(), oq: [...OQP, [['q', 'enemy']]] } }), maslahat: 'when touching enemy ostiga qaysi blok?' },
    B1C: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'tugaydi', chek: true }, pR, undefined, { pog: 3, progYoq: ['raketa'], perProg: { ...tayyor(), raketa: [...RPR, [['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1']]], dushman: DSP(8) } }), maslahat: 'Jon 0 bo‘lsa — qaysi shart? Ataylab tegib sinab ko‘ring' },
    B1Y: { tur: 'yol', chegara: 12, bosh: kb({}, pD, { och: true, kerak: 'qator' }, { pog: 4 }), maslahat: 'Blokning birinchi so‘ziga qarang — qatorda ham u bor' },
    // 2-bekat: test (maslahatsiz, noldan)
    B2A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'ustun' }, pD, undefined, { pog: 5, progYoq: ['dushman'], perProg: { ...tayyor(), dushman: [] } }), maslahat: TEST_M },
    B2B: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'ball2' }, pO, undefined, { pog: 6, progYoq: ['oq'], perProg: { ...tayyor(), oq: OQP, dushman: DSP(3) } }), maslahat: TEST_M },
    B2C: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'tugaydi', chek: true }, pR, undefined, { pog: 7, progYoq: ['raketa'], perProg: { ...tayyor(), raketa: RPR, dushman: DSP(8) } }), maslahat: TEST_M },
    B2Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'kod' }, pD, { och: true, kerak: 'dush8' }, { pog: 8, progYoq: ['dushman'], perProg: { ...tayyor(), dushman: DSP(5) } }), maslahat: TEST_M },
    P10: { tur: 'yol', chegara: 12, bosh: kb({ chek: true }, pR, undefined, { prog: 0, perProg: tayyor() }), gap: { boshla: ['', 'Ro‘yxat o‘yin bajargani sari ✓ bo‘ladi'] } },
    // 3-bekat: katta test (to'liq o'yin, maslahat bor)
    B3A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'toliq', chek: true }, pR, undefined, { pog: 9, progYoq: ['raketa', 'oq'], perProg: { ...tayyor(), raketa: RPR, oq: OQP, dushman: DSP() } }), maslahat: 'Ro‘yxatga qarang: qaysi band hali ✓ emas?' },
    B3Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'oz', chek: true }, pD, undefined, { pog: 10 }), maslahat: 'Dushman dasturida repeat soni — nechta dushman' },
    B5: { ish: 'natija' },
  },
  // natija: ta topshiriq yechdi — 1–2-bekat (8 topshiriq), ta o‘yin yutdi — katta test, pog‘ona bajardi — 10 pog'ona
  natija: [{ k: 'ta topshiriq yechdi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y'] }, { k: 'ta o‘yin yutdi', ekran: ['B3A', 'B3Y'] }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-020-takrorlash-va-test-v1', versiya: 'v1', kalit: 'jr020',
    // «Takrorlovchi» — 1-bekatning 4-pog'onasi; «Test ustasi» — 2-bekatning 3-pog'onasi (maslahatsiz)
    yutuqlar: [{ t: 'pog', n: 4, nom: 'takrorchi' }, { t: 'pog', n: 7, nom: 'testusta' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> test baho emas — u nimani takrorlash kerakligini ko‘rsatadi. Qiyin bo‘lsa — bu xato emas.',
    '<b>Yo‘l:</b> huk (qaysi mavzu qiyin) → «Eslaymiz» → reja → o‘yinni ko‘ramiz → 1-bekat «Takrorlaymiz» (maslahat bor) → 2-bekat «Test» (maslahatsiz, noldan) → 3-bekat «Katta test» (to‘liq o‘yin) → qiyin mavzuni qayta ko‘ramiz → yakun.',
    '<b>Test paytida</b> maslahat yo‘q; bola qiynalsa — yoniga boring: «Qaysi blok kerak? O‘q qaysi personajda? Jon 0 bo‘lsa nima bo‘lishi kerak?» Yechimni aytmang.',
    '<b>13-qadam:</b> doskada eng kam yechilgan topshiriqni topasiz va qayta tushuntirasiz. Mentor bo‘shliqlarni shaxsiy o‘yindan (21–22-dars) oldin shu natija bo‘yicha yopadi.',
    '<b>18-darsda o‘yini saqlanmagan bola</b> uchun o‘yin tayyor keladi — bu xato emas. «Noto‘g‘ri» deb aytilmaydi.',
  ],
}
