// 18-dars e'loni (21.11): «Kosmik o‘yin 2: dushman, ball va jon». Manba: new-junior/manba/018-kosmik-oyin-2.md (v1 — «Savollar» 1–10 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. 17-dars o'yinining davomi: uch personaj — Raketa, O‘q, Dushman (16-darsdagi nusxalar, tepadan tushadi) — har birining o'z dasturi (kosmik.js);
// o'q dushmanga tegsa — ikkalasi o'chadi, o'q dasturidagi `when touching enemy` ishlaydi (ball); dushman raketaga tegsa — raketa dasturidagi `when touching enemy` (jon).
// Raketa va o'q — 17-darsda saqlangan dastur (K+'per', 17-dars kaliti), bo'lmasa tayyor. Sinov: sinov/dvigatel/kosmik2.mjs
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]] // raketa: →[→] ←[←]
const OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]] // o'q: S[C] · K[R4[↑] D]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']] // dushman nusxasi: K[go(R0-6, 4) R4[↓] D]
const DSP = (n = 5) => [[['f'], ['p', String(n), [['C']]]], DK] // dushman: ▶[Rn[C]] · K[…]
const OQB = (n = 1) => [[['q', 'enemy'], ['c', 'ball:' + n]]] // o'q: T[change ball by n]
const RB0 = [[['f'], ['z', 'ball:0']]] // raketa: ▶[set ball to 0]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]] // raketa: ▶[ball 0, jon 3] · T[jon −1; if jon = 0 → game over]
const PR = { royxat: [{ id: 'raketa', nom: 'Raketa' }, { id: 'oq', nom: 'O‘q' }, { id: 'dushman', nom: 'Dushman' }] }
const pD = { ...PR, tanla: 'dushman' }, pO = { ...PR, tanla: 'oq' }, pR = { ...PR, tanla: 'raketa' }
const kb = (kosmik, personaj, o = {}) => ({ sahna: 'katak', oyin: true, kosmik: { dushman: { asl: [3, 4] }, ...kosmik }, personaj, prog: 'per', ...o })
const tayyor = (o = {}) => ({ raketa: RPR, oq: OQP, ...o })
const DARS = {
  raqam: 18,
  nom: 'Kosmik o‘yin 2',
  savol: 'Ballni <em>kim</em> sanaydi?',
  // javon (loyiha — hammasi): Hodisa (tugma, ▶, dushmanga tekkanda, game over), Harakat, Takrorlash, Klon, O'zgaruvchi, Shart, random
  javon: { e: [['k', 'right'], 'f', ['q', 'enemy'], 'g'], h: ['r', 'l', 'u', 'd', ['y', '3,4']], b: [['p', '4']], K: ['C', 'H', 'D'], o: [['z', 'ball:0'], ['c', 'ball:1'], ['m', '0-6']], a: [['i', 'jon:0']] },
  maydon: { w: 7, h: 5 },
  masshtabMin: 0.5,
  dasturchalar: true,
  dasturchaBlok: true,
  dasturchaUstun: 1,
  blokChegara: 10,
  maslahatKeyin: true,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  ozgaruvchi: ['ball', 'jon'],
  changeSonlar: [-3, -2, -1, 1, 2, 3, 5],
  dushmanTegish: true, // when touching — tur ro'yxatiga «enemy» (blockly.js BL_OLMA_D)
  perKalit17: 'jr017', // 17-darsda saqlangan raketa va o'q dasturi (kosmik.js perTayyorla)
  klonGap: { sanoq: 'O‘q: N' },
  // kosmik o'yin gaplari (kosmik.js KS; N — son). 17-dars gaplari + dushman, ball, jon
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

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 dushman (B1A…B1Y), 5–8 ball (B2A…B2Y), 9–12 jon (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'O‘yiningiz qoidasini ustozga aytib bering',
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda kod bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P7'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P8'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P10'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // bosh.kosmik.kerak — pog'ona sharti (kosmik.js): dush1 · dush5 · ustun · urdi · ball1 · ball0 · ball2 · rekord · jon · tugaydi · toliq · oz
  // perProg — personajning tayyor dasturi (saqlangani bo'lmasa); soloPerProg — solo'da (jonli darsda ustoz o'zi tuzadi)
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P7: { tur: 'yol', chegara: 10, bosh: kb({}, pD, { prog: 0, perProg: tayyor(), soloPerProg: tayyor({ dushman: DSP(3) }) }), gap: { boshla: ['', 'Dushman dasturi: asl nusxa yasaydi, nusxa tushadi'] } },
    B1A: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'dush1' }, pD, { pog: 1, prog: 'per17', perProg: tayyor({ dushman: [DK] }) }), maslahat: 'Nusxani kim yasaydi? Dushman ▶ bosilganda nima qilsin?' },
    B1B: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'dush5' }, pD, { pog: 2, perProg: tayyor({ dushman: [[['f'], ['C']], DK] }) }), maslahat: 'Beshta nusxa — qaysi blok takrorlaydi?' },
    B1C: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'ustun' }, pD, { pog: 3, progYoq: ['dushman'], perProg: tayyor({ dushman: [DSP()[0], [['H'], ['p', '4', [['d']]], ['D']]] }) }), maslahat: 'Har nusxa o‘z ustunini tanlasin — qaysi blok sonni o‘zi tanlaydi?' },
    B1Y: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'urdi', soni: 3 }, pD, { pog: 4, perProg: tayyor({ dushman: DSP() }) }), maslahat: 'Dushman ostiga boring — keyin space' },
    P8: { tur: 'yol', chegara: 10, bosh: kb({ ozg: true }, pO, { prog: 0, perProg: tayyor({ dushman: DSP(4) }), soloPerProg: tayyor({ raketa: [...RPR, ...RB0], oq: [...OQP, ...OQB()], dushman: DSP(4) }) }), gap: { boshla: ['', 'O‘q dushmanni ursa — ball oshsin'] } },
    B2A: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'ball1', ozg: true }, pO, { pog: 5, progYoq: ['oq'], perProg: tayyor({ oq: [...OQP, [['q', 'enemy']]], dushman: DSP() }) }), maslahat: 'when touching enemy ostiga qaysi blok?' },
    B2B: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'ball0', ozg: true }, pR, { pog: 6, perProg: tayyor({ oq: [...OQP, ...OQB()], dushman: DSP(3) }) }), maslahat: 'O‘yin boshlanganda ball nechchi bo‘lsin?' },
    B2C: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'ball2', ozg: true }, pO, { pog: 7, perProg: tayyor({ raketa: [...RPR, ...RB0], oq: [...OQP, ...OQB()], dushman: DSP(3) }) }), maslahat: 'change ball by — nechta?' },
    B2Y: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'rekord', ozg: true }, pD, { pog: 8, perProg: tayyor({ raketa: [...RPR, ...RB0], oq: [...OQP, ...OQB()], dushman: DSP() }) }), maslahat: 'Dushman ko‘p bo‘lsa — ball ham ko‘p' },
    P10: { tur: 'yol', chegara: 10, bosh: kb({ ozg: true, chek: true }, pR, { prog: 0, perProg: tayyor({ raketa: [...RPR, ...RB0], oq: [...OQP, ...OQB()], dushman: DSP(6) }), soloPerProg: tayyor({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB()], dushman: DSP(6) }) }), gap: { boshla: ['', 'Dushman raketaga tegsa — jon kamaysin'] } },
    B3A: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'jon', ozg: true, chek: true }, pR, { pog: 9, progYoq: ['raketa'], perProg: tayyor({ raketa: [...RPR, [['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy']]], oq: [...OQP, ...OQB()], dushman: DSP() }) }), maslahat: 'Dushman tegdi — jon nima bo‘lsin?' },
    B3B: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'tugaydi', ozg: true, chek: true }, pR, { pog: 10, perProg: tayyor({ raketa: [...RPR, [['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1']]], oq: [...OQP, ...OQB()], dushman: DSP(8) }) }), maslahat: 'Jon 0 bo‘lsa — qaysi shart? Ataylab tegib sinab ko‘ring' },
    B3C: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'toliq', ozg: true, chek: true }, pR, { pog: 11, perProg: tayyor({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB()], dushman: DSP() }) }), maslahat: 'Ro‘yxatga qarang: qaysi band hali ✓ emas?' },
    B3Y: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'oz', ozg: true, chek: true }, pD, { pog: 12, perProg: tayyor({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB()], dushman: DSP() }) }), maslahat: 'Dushman dasturida repeat soni — nechta dushman' },
    P11: { tur: 'yol', chegara: 10, bosh: kb({ ozg: true, chek: true }, pR, { prog: 0, perProg: tayyor({ raketa: [...RPR, ...RJ], oq: [...OQP, ...OQB()], dushman: DSP() }) }) },
    B5: { ish: 'natija' },
  },
  // natija: ta dushman urdi — 'U' (yutilgan o'yinlarda); ta o‘yin yutdi — 'W'; pog‘ona bajardi — 12 pog'ona
  natija: [{ k: 'ta dushman urdi', blok: 'U' }, { k: 'ta o‘yin yutdi', blok: 'W' }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-018-kosmik-oyin-2-v1', versiya: 'v1', kalit: 'jr018',
    // «Himoyachi» — 1-bekatning ★ (o'q dushmanni urdi); «Kosmik o‘yinchi» — 3-bekatning 3-pog'onasi (to'liq o'yin)
    yutuqlar: [{ t: 'pog', n: 4, nom: 'himoyachi' }, { t: 'pog', n: 11, nom: 'kosmik' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> yangi narsa deyarli yo‘q — klon, o‘zgaruvchi va shart bitta o‘yinda uchrashadi. Har personaj o‘z ishini qiladi: dushman tushadi, o‘q uradi va ball beradi, raketa yuradi va jonini saqlaydi.',
    '<b>Yo‘l:</b> huk (ballni kim sanaydi — uch sinov) → «Eslaymiz»: klon, o‘zgaruvchi, shart → reja → 1-bekat «Dushman» → 2-bekat «Ball» → 3-bekat «Jon» → o‘yinni ko‘rsatish → yakun.',
    '<b>Uch karta:</b> «Raketa» · «O‘q» · «Dushman». Ball — o‘q dasturida (o‘q uradi), jon — raketa dasturida (raketaga tegadi). Bola adashsa: «Kim dushmanni uradi? Kimga dushman tegadi?»',
    '<b>Yangi blok bitta:</b> when touching enemy — 11-darsdagi when touching apple ning yangi turi. 17-darsda o‘yini saqlanmagan bola uchun raketa va o‘q tayyor keladi — bu xato emas.',
    '<b>Yechimni aytmang:</b> «Ball qaysi personajda oshadi? O‘yin boshida ball nechchi? Jon 0 bo‘lsa nima bo‘lishi kerak?» 3-bekatda ro‘yxatga qarating.',
    '<b>O‘yin tugadi</b> — muammo emas (12-dars): ▶ Boshlash — yana o‘ynaydi. 16-qadamda proyektorga ism chiqmaydi.',
  ],
}
