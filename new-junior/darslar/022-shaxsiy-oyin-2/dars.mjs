// 22-dars e'loni (22.11): «Shaxsiy o‘yin 2 va Pre-Demo». Manba: new-junior/manba/022-shaxsiy-oyin-2.md (v1 — «Savollar» 1–8 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. 21-dars o'yinini karta bo'yicha tugatamiz (kosmik.kerak = karta3 · karta4 · ball0 · karta5), ikki marta o'ynab sinaymiz, taqdimotni mashq qilamiz
// (taqdimot kartasi K2: uch qator + «Tayyorman»). Karta — 21-dars saqlagani (DARS.kartaKalit), bo'lmasa namuna (DARS.kartaNamuna). Sinov: sinov/dvigatel/shaxsiy.mjs
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
  raqam: 22,
  nom: 'Shaxsiy o‘yin 2',
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
  perKalit17: 'jr021', // oldingi darsda saqlangan o'yin (kosmik.js perTayyorla, prog 'per17') — 21-dars
  klonGap: { sanoq: 'O‘q: N' },
  kartaPog: 5, // taqdimot kartasi — pog'ona 5 (kod.js kartaTayyor)
  kartaKalit: 'jr021', // 21-dars kaliti — karta shu yerdan o'qiladi (kod.js kartaOl)
  kartaNamuna: { kim: 'do‘stim', dush: 5, ball: 2, jon: 3 }, // karta saqlanmagan bo'lsa
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
  qahramonli: ['BK', 'B1A', 'B1Y', 'B2A', 'B2Y', 'K2', 'B5'],
  coddyli: [],

  // pog'onalar: 1–2 tugatamiz (B1A, B1Y), 3–4 sinaymiz (B2A, B2Y), 5 taqdimot kartasi (K2)
  sanoq: { P1: ['kirdi'], P5: ['pog', 1, 0], P5G: ['pog', 3, 2], P5B: ['pog', 5, 4], P14: ['sinf'] },

  bola: { karta: 'K2', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'O‘yiningiz haqida uchta gap ayting',
  kichikGap: { B0: 'Dars hozir boshlanadi', K2: 'Tayyor bo‘lsangiz — tugmani bosing', B2Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda Demo Day!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P4'], 2: ['P7'], 3: ['B1A', 'B1Y'], 4: ['P4B'], 5: ['P8'], 6: ['B2A', 'B2Y'], 7: ['P4C'], 8: ['P10'], 9: ['K2'], 11: ['B5'] },
    keyingi: ['B1A', 'B1Y', 'B2A', 'B2Y'],
    gap: [],
  },

  // bosh.kosmik.kerak — pog'ona sharti (kosmik.js): karta3 (yutdi) · karta4 (hammasini urdi) · ball0 (ikkinchi o'yin ham 0 dan) · karta5 (yutuqni oshirdi) — kod.js kartaShart.
  // Dastur: 21-dars o'yini (K+'per', DARS.perKalit17 = 21-dars kaliti), bo'lmasa karta bo'yicha tayyor dastur (kod.js kartaProg)
  studiya: {
    P7: { tur: 'yol', chegara: 12, bosh: kb({}, pR, undefined, { prog: 'per17', kartaProg: true }), gap: { boshla: ['', 'Kartaga qarang — o‘yinda ham shunday'] } },
    B1A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta3', chek: true }, pR, undefined, { pog: 1, prog: 'per17', kartaProg: true }), maslahat: 'Kartada yutish uchun nechta ball kerak? Jon nechta?' },
    B1Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta4', chek: true }, pD, undefined, { pog: 2, kartaProg: true }), maslahat: 'Har dushmanga o‘q — hamma dushmanni uring' },
    P8: { tur: 'yol', chegara: 12, bosh: kb({ chek: true }, pR, undefined, { prog: 0, kartaProg: true }), gap: { boshla: ['', 'Ikkinchi o‘yinda ball yana 0 dan boshlanadimi?'] } },
    B2A: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'ball0', chek: true }, pR, undefined, { pog: 3, progYoq: ['raketa'], perProg: { raketa: [...RPR, [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]] }, kartaProg: ['oq', 'dushman'] }), maslahat: 'O‘yin boshlanganda ball nechchi bo‘lsin? ▶ ostiga set ball to 0' },
    B2Y: { tur: 'yol', chegara: 12, bosh: kb({ kerak: 'karta5', chek: true }, pD, undefined, { pog: 4 }), maslahat: 'Ko‘proq ball — ko‘proq dushman yoki ko‘proq ball har dushmanga' },
    P11: { tur: 'yol', chegara: 12, bosh: kb({ chek: true }, pR, undefined, { prog: 0, kartaProg: true }) },
    B5: { ish: 'natija' },
  },
  // natija: ta o‘yin yutdi — 1-bekat, marta sinadi — 2-bekat, pog‘ona bajardi — 5 pog'ona
  natija: [{ k: 'ta o‘yin yutdi', ekran: ['B1A', 'B1Y'] }, { k: 'marta sinadi', ekran: ['B2A', 'B2Y'] }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B1Y', 'B2A', 'B2Y', 'K2'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-022-shaxsiy-oyin-2-v1', versiya: 'v1', kalit: 'jr022',
    // «O‘yin ustasi» — 1-bekatning 1-pog'onasi (kartadagidek yutdi); «Taqdimotchi» — taqdimot kartasi (5-pog'ona)
    yutuqlar: [{ t: 'pog', n: 1, nom: 'oyinusta' }, { t: 'pog', n: 5, nom: 'taqdimotchi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> o‘yin tayyor bo‘lgach uni sinash va aytib berish kerak. Taqdimot — 23-dars (Demo Day) uchun mashq.',
    '<b>Yo‘l:</b> reja → kartani o‘qiymiz → 1-bekat «Tugatamiz» → 2-bekat «Sinaymiz» (ikki marta o‘ynaydi) → 3-bekat «Gapiramiz» (taqdimot kartasi, juftlikda) → o‘yinni ko‘rsatish → yakun.',
    '<b>Taqdimot mashqida</b> bolalar juft bo‘lib aytadi; aylanib yuring, tinglang. Qo‘rqqan bolaga: «Uchta gapni aytsangiz yetadi.» Ism proyektorga chiqmaydi.',
    '<b>Yechimni aytmang:</b> «Kartada ball qancha kerak? Jon nechta? Ikkinchi o‘yinda ball nimadan boshlanadi?»',
    '<b>21-darsdagi karta saqlanmagan bola</b> uchun namuna karta keladi — bu xato emas. «Noto‘g‘ri» deb aytilmaydi.',
  ],
}
