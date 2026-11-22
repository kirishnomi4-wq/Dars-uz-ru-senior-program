// 23-dars e'loni (22.11): «Demo Day №1». Manba: new-junior/manba/023-demo-day-1.md (v1 — «Savollar» 1–8 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. Demo Day: oxirgi sinov (kosmik.kerak = karta3), mehmon o'ynaydi (oynadi · karta3), uy yo'riqnomasi kartasi Y1 («Yo‘riqnoma tayyor»; Scratch — ota-ona ruxsati bilan).
// Karta — 21-dars saqlagani (DARS.kartaKalit), bo'lmasa namuna; o'yin — 22-dars saqlagani (perKalit17), bo'lmasa karta bo'yicha tayyor. Sinov: sinov/dvigatel/shaxsiy.mjs
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
  raqam: 23,
  nom: 'Demo Day №1',
  savol: '',
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
  perKalit17: 'jr022', // oldingi darsda saqlangan o'yin (kosmik.js perTayyorla, prog 'per17') — 22-dars
  klonGap: { sanoq: 'O‘q: N' },
  kartaPog: 4, // yo'riqnoma kartasi — pog'ona 4 (kod.js kartaTayyor)
  kartaKalit: 'jr021', // 21-dars kaliti — karta shu yerdan o'qiladi (kod.js kartaOl)
  kartaNamuna: { kim: 'do‘stim', dush: 5, ball: 2, jon: 3 }, // karta saqlanmagan bo'lsa
  // loyiha kartasi gaplari (kod.js KR; N — son; q_* — bola ekranidagi qator sarlavhalari)
  kartaGap: { kim: 'Kim o‘ynaydi', dush: 'Dushmanlar', ball: 'Har dushman — ball', jon: 'Jon', maqsad: 'Yutish uchun', q_kim: 'Kim o‘ynaydi?', q_dush: 'Dushmanlar', q_ball: 'Har dushman — ball', q_jon: 'Jon',
    toldiring: 'Hamma qatorni tanlang', tayyor: 'Karta tayyor!', kartaYoq: 'Avval kartani to‘ldiring', dushKarta: 'Kartada N ta dushman bor', jonKarta: 'Kartada jon: N', ballKarta: 'Kartada har dushman — N ball',
    uring: 'Dushmanni uring — ball oshadimi?', maqsadKam: 'Yutish uchun N ball kerak', jonQolsin: 'Jon qolsin — yana o‘ynang', bir: 'Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying', hammasi: 'Hamma N dushmanni uring', oshir: 'Yana uring: kamida N ball kerak' },
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
    tugadi: 'O‘yin tugadi. ▶ Boshlash — yana o‘ynang', yutdi: 'Siz yutdingiz!', oynadi: 'O‘yin tugadi — mehmon o‘ynadi!',
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
  qahramonli: ['BK', 'B1A', 'B2A', 'B2Y', 'Y1', 'B5'],
  coddyli: [],

  // pog'onalar: 1 oxirgi sinov (B1A), 2–3 mehmon (B2A, B2Y), 4 uy yo'riqnomasi (Y1)
  sanoq: { P1: ['kirdi'], P5: ['pog', 1, 0], P5G: ['pog', 2, 1], P5B: ['pog', 4, 3], P14: ['sinf'] },

  bola: { karta: 'Y1', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'O‘yiningiz haqida mehmonlarga ayting',
  kichikGap: { B0: 'Dars hozir boshlanadi', Y1: 'Karta tayyor bo‘lsa — tugmani bosing', B2Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi modulda sun‘iy intellekt!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P4'], 2: ['P7'], 3: ['B1A'], 4: ['P4B'], 5: ['P8'], 6: ['B2A', 'B2Y'], 7: ['P4C'], 8: ['P10'], 9: ['Y1'], 10: ['B5'] },
    keyingi: ['B1A', 'B2A', 'B2Y'],
    gap: [],
  },

  // bosh.kosmik.kerak — pog'ona sharti (kosmik.js): karta3 (yutdi) · oynadi (bitta o'yin tugadi — yutdi yoki «O‘yin tugadi»). Dastur: 22-dars o'yini (K+'per', perKalit17 = 22-dars kaliti), bo'lmasa karta bo'yicha tayyor.
  studiya: {
    P8: { tur: 'yol', chegara: 12, bosh: kb({}, pR, undefined, { prog: 'per17', kartaProg: true }), gap: { boshla: ['', 'Strelkalar — raketa, probel — o‘q'] } },
    B1A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta3', chek: true }, pR, undefined, { pog: 1, prog: 'per17', kartaProg: true }), maslahat: 'O‘yin kartadagidek ishlayaptimi? Dushmanlar, jon, ball' },
    B2A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'oynadi', chek: true }, pR, undefined, { pog: 2, prog: 'per17', kartaProg: true }), maslahat: 'Mehmon o‘ynaganda aytib bering: nechta dushman, qanday yutiladi' },
    B2Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta3', chek: true }, pR, undefined, { pog: 3, prog: 'per17', kartaProg: true }), maslahat: 'Mehmon yutsin — kartadagi maqsadga yetsin' },
    B5: { ish: 'natija' },
  },
  // natija: ta o‘yin tugadi — mehmon o‘ynadi, ta mehmon yutdi — mehmon yutdi, pog‘ona bajardi — 4 pog'ona
  natija: [{ k: 'ta o‘yin tugadi', ekran: ['B2A'] }, { k: 'ta mehmon yutdi', ekran: ['B2Y'] }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B2A', 'B2Y', 'Y1'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-023-demo-day-1-v1', versiya: 'v1', kalit: 'jr023',
    // «Namoyishchi» — 2-bekatning 1-pog'onasi (mehmon o‘ynadi); «Modul bitiruvchisi» — yo'riqnoma kartasi (4-pog'ona)
    yutuqlar: [{ t: 'pog', n: 2, nom: 'namoyishchi' }, { t: 'pog', n: 4, nom: 'bitiruvchi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> bola o‘z ishini ko‘rsatadi, mehmon o‘ynaydi. Ota-ona bolaning mehnatini ko‘radi.',
    '<b>Yo‘l:</b> reja → qoidalar → 1-bekat «Tayyorlanamiz» (oxirgi sinov) → 2-bekat «Ko‘rsatamiz» (mehmon o‘ynaydi) → 3-bekat «Uyga olib ketamiz» (yo‘riqnoma kartasi) → yakun.',
    '<b>Mehmonlar bilan:</b> noutbuklar tayyor, o‘yinlar saqlangan bo‘lishi kerak (21–22-dars). Mehmon yutmasa — bola «yana urining» deydi. Ism proyektorga chiqmaydi.',
    '<b>Uy yo‘riqnomasi:</b> Scratch — bepul sayt (scratch.mit.edu); bolalar ota-ona ruxsati bilan kiradi. Blok nomlari deyarli bir xil, lekin o‘zgaruvchi nomi «score» bo‘lishi mumkin.',
    '<b>Himoya:</b> har bolani tinglang — nechta dushman, qanday yutiladi, eng qiyin joyi. «Noto‘g‘ri» deb aytilmaydi.',
  ],
}
