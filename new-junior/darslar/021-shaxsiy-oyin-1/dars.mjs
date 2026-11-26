// 21-dars e'loni (22.11): «Shaxsiy o‘yin 1: loyiha kartasi va boshlash». Manba: new-junior/manba/021-shaxsiy-oyin-1.md (v1 — «Savollar» 1–8 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. Shaxsiy o'yin — kosmik o'yinning o'z varianti: bola loyiha kartasini to'ldiradi (kim o'ynaydi, dushmanlar, har dushman — ball, jon; kod.js), keyin
// o'yinni karta bo'yicha quradi (kosmik.kerak = karta1 · karta2 · karta3). Karta noutbukda saqlanadi — 22–23-dars shu kalit bilan o'qiydi. Sinov: sinov/dvigatel/shaxsiy.mjs
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
  raqam: 21,
  nom: 'Shaxsiy o‘yin 1',
  savol: 'Yasashdan oldin nima <em>qilamiz</em>?',
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
  kartaPog: 1, // karta to'ldirilsa — pog'ona 1 (kod.js kartaTayyor)
  // loyiha kartasi gaplari (kod.js KR; N — son; q_* — bola ekranidagi qator sarlavhalari)
  kartaGap: { kim: 'Kim o‘ynaydi', dush: 'Dushmanlar', ball: 'Har dushman — ball', jon: 'Jon', maqsad: 'Yutish uchun', q_kim: 'Kim o‘ynaydi?', q_dush: 'Dushmanlar', q_ball: 'Har dushman — ball', q_jon: 'Jon',
    toldiring: 'Hamma qatorni tanlang', tayyor: 'Karta tayyor!', kartaYoq: 'Avval kartani to‘ldiring', dushKarta: 'Kartada N ta dushman bor', jonKarta: 'Kartada jon: N', ballKarta: 'Kartada har dushman — N ball',
    uring: 'Dushmanni uring — ball oshadimi?', maqsadKam: 'Yutish uchun N ball kerak', jonQolsin: 'Jon qolsin — yana o‘ynang', bir: 'Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying', hammasi: 'Hamma N dushmanni uring', oshir: 'Yana uring: kamida N ball kerak' },
  // kosmik o'yin gaplari (kosmik.js KS) — 18-dars bilan bir xil (chek-list — 3-bekat)
  kosmikGap: {
    dasturi: 'dasturi', royxat: 'O‘yiningizda:',
    chek: [['tushadi', 'Dushmanlar tushadi'], ['ball', 'O‘q tegsa — ball +1'], ['jon', 'Dushman tegsa — jon −1'], ['tugaydi', 'Jon tugasa — o‘yin tugaydi'], ['yutdi', 'O‘yin yutildi']],
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
  qahramonli: ['BK', 'K1', 'B2A', 'B2Y', 'B3A', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1 karta (K1), 2–3 dushmanlar (B2A, B2Y), 4–5 ball va jon (B3A, B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 1, 0], P5G: ['pog', 2, 1], P5B: ['pog', 4, 3], P14: ['sinf'] },

  ustozKarta: 'P7', // 25.11 (QA F-1125-17, Q17-A): ustoz kartani sinf oldida bosib to'ldiradi (qobiq.js → kod.js kartaUstozTanla; xotirada — bolaning kartasiga yozilmaydi)
  bola: { javob: 'P2N', karta: 'K1', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'O‘yiningiz kartasini ustozga aytib bering',
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', K1: 'Karta tayyor bo‘lsa — tugmani bosing', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda o‘yinni tugatamiz!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2C'], 3: ['P3'], 4: ['P4'], 5: ['P7'], 6: ['K1'], 7: ['P4B'], 8: ['P8'], 9: ['B2A', 'B2Y'], 10: ['P4C'], 11: ['P10'], 12: ['B3A', 'B3Y'], 13: ['B5'] },
    keyingi: ['K1', 'B2A', 'B2Y', 'B3A', 'B3Y'],
    gap: [],
  },

  // bosh.kosmik.kerak — pog'ona sharti (kosmik.js): karta1 · karta2 · karta3 (kod.js kartaShart) · urdi · toliq. Karta — bola ekrani K1 (kod.js kartaTanla)
  studiya: {
    P3: { ish: 'raqam' },
    P8: { tur: 'yol', chegara: 12, bosh: kb({}, pD, undefined, { prog: 0, soloKarta: true }), gap: { boshla: ['', 'Kartaga qarang: nechta dushman?'] } },
    B2A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta1' }, pD, undefined, { pog: 2, progYoq: ['dushman'], perProg: { ...tayyor(), dushman: [DK] } }), maslahat: 'Kartada nechta dushman? repeat ning soni shuncha bo‘lsin' },
    B2Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'urdi', soni: 3 }, pD, undefined, { pog: 3, perProg: tayyor() }), maslahat: 'Dushman ostiga boring — keyin space' },
    P10: { tur: 'yol', chegara: 12, bosh: kb({ chek: true }, pO, undefined, { prog: 0, perProg: tayyor(), soloKarta: true }), gap: { boshla: ['', 'Kartada ball nechta? Jon nechta?'] } },
    B3A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta2', chek: true }, pR, undefined, { pog: 4, progYoq: ['raketa', 'oq'], perProg: { ...tayyor(), raketa: RPR, oq: OQP }, kartaProg: ['dushman'] }), maslahat: 'Kartada har dushman — necha ball? Jon nechta?' },
    B3Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta3', chek: true }, pR, undefined, { pog: 5, kartaProg: true }), maslahat: 'Kartadagi maqsadga yeting — jon qolsin' },
    B5: { ish: 'natija' },
  },
  // natija: ta karta to‘ldirdi — K1, ta o‘yin yutdi — 4 pog'ona, pog‘ona bajardi — 5 pog'ona
  natija: [{ k: 'ta karta to‘ldirdi', ekran: ['K1'] }, { k: 'ta o‘yin yutdi', ekran: ['B2A', 'B2Y', 'B3A', 'B3Y'] }, { k: 'pog‘ona bajardi', ekran: ['K1', 'B2A', 'B2Y', 'B3A', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-021-shaxsiy-oyin-1-v1', versiya: 'v1', kalit: 'jr021',
    // «Rejachi» — karta to'ldirildi (1-pog'ona); «O‘yin boshi» — 3-bekatning 1-pog'onasi (ball va jon kartadagidek)
    yutuqlar: [{ t: 'pog', n: 1, nom: 'rejachi' }, { t: 'pog', n: 4, nom: 'oyinboshi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> katta ishni reja bilan boshlaymiz. Karta — kichik reja: bola o‘zi qoidalarini tanlaydi, dastur shunga mos yoziladi.',
    '<b>Yo‘l:</b> huk (yasashdan oldin nima qilamiz?) → reja kartasi namunasi → yangi so‘z «loyiha kartasi» → reja → 1-bekat «Karta» → 2-bekat «Dushmanlar» → 3-bekat «Ball va jon» → yakun.',
    '<b>Karta bolaning o‘z qarori:</b> «yaxshi» va «yomon» tanlov yo‘q. Bola 8 dushman va 1 ball tanlasa — o‘ynab ko‘rib, o‘zi o‘zgartirishi mumkin.',
    '<b>Yechimni aytmang:</b> «Kartada nechta dushman? repeat ning soni qancha? Kartada jon nechta? Qaysi blokda?»',
    '<b>18-darsda o‘yini saqlanmagan bola</b> uchun o‘yin tayyor keladi — bu xato emas. «Noto‘g‘ri» deb aytilmaydi.',
  ],
}
