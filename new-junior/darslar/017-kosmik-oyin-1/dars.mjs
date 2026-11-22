// 17-dars e'loni (21.11): «Kosmik o‘yin 1: raketa va o‘q». Manba: new-junior/manba/017-kosmik-oyin-1.md (v1 — «Savollar» 1–9 tavsiya A bo'yicha qurildi; foydalanuvchi javobi kutilmoqda).
// Faqat ma'lumot. Loyiha darsi: ikki personaj — Raketa (← →, pastki qatorda) va O‘q (asli raketa ichida; space — nusxa, nusxa tepaga uchadi) — har birining o'z dasturi
// (bosh.personaj, kosmik.js perTayyorla); 3-bekatda nishonlar va chek-list «O‘yiningizda:». Sinov: sinov/dvigatel/raketa.mjs
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]] // raketa: →[→] ←[←]
const OQP = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]] // o'q: S[C] · K[R4[↑] D]
const PR = { royxat: [{ id: 'raketa', nom: 'Raketa' }, { id: 'oq', nom: 'O‘q' }] }
const p1 = { ...PR, ochiq: ['raketa'], tanla: 'raketa' }
const p2 = { ...PR, tanla: 'oq' }
const p3 = { ...PR, tanla: 'raketa' }
const kb = (kosmik, personaj, o = {}) => ({ sahna: 'katak', oyin: true, kosmik, personaj, prog: 0, ...o })
const DARS = {
  raqam: 17,
  nom: 'Kosmik o‘yin 1',
  savol: 'Raketa <em>qanday</em> o‘q otadi?',
  // javon (loyiha — hammasi): Hodisa (tugma, ▶), Harakat (← →, go to), Takrorlash, Klon, Tovush
  javon: { e: [['k', 'right'], 'f'], h: ['r', 'l', 'u', ['x', '3,0']], b: [['p', '4']], K: ['C', 'H', 'D'], t: [['n', 'qadam']] },
  maydon: { w: 7, h: 5 },
  masshtabMin: 0.5,
  dasturchalar: true,
  dasturchaBlok: true,
  dasturchaUstun: 1,
  blokChegara: 10,
  maslahatKeyin: true,
  joyQolmadi: 'Dasturga N ta blok sig‘adi',
  // o'q nusxalari soni (klon.js klonSanoq)
  klonGap: { sanoq: 'O‘q: N' },
  // kosmik o'yin gaplari (kosmik.js KS; N — son)
  kosmikGap: {
    dasturi: 'dasturi', royxat: 'O‘yiningizda:',
    chek: [['yuradi', 'Raketa yuradi'], ['otildi', 'O‘q otiladi'], ['ochdi', 'O‘q o‘chadi'], ['hamma', 'Hamma nishon urildi']],
    oyinYz: 'O‘yin: ← → va space',
    bosh: 'Avval blokni bosing — u dasturga qo‘shiladi', boshP: 'Bu yerda hech narsa yo‘q-ku…',
    raketaKlon: 'create clone of myself — O‘q dasturiga', raketaKlonP: 'Raketa ko‘payib ketdi!',
    turib: 'O‘q when I start as a clone ostidagi bloklarni bajaradi', turibP: 'Men nima qilay?',
    chet: 'O‘q tepadan ham yuqoriga uchmoqchi bo‘ldi. move up necha marta?', chetP: 'Maydon tugadi!',
    qoldi: 'Uchib bo‘lgan o‘q o‘chsin — delete this clone', qoldiP: 'Tepada qolib ketdi!',
    yetmadi: 'O‘q tepaga yetmay o‘chdi. move up necha marta?', yetmadiP: 'Oz qoldi!',
    oqQani: 'O‘qni create clone of myself yasaydi — O‘q dasturida', oqQaniP: 'O‘q qani?',
    startKerak: '▶ bosilganda raketa (3, 0) ga borsin', ozP: 'Oz qoldi!',
    qulf: 'O‘q — 2-bekatda', qoyKam: 'Kamida N ta nishon qo‘ying — katakni bosing', qoyPast: 'Nishon tepada bo‘ladi — 2-qatordan yuqori', qoyN: 'Nishon: N ta. ▶ Boshlash — o‘ynang',
    yutdi: 'Siz yutdingiz!',
  },

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 raketa (B1A…B1Y), 5–8 o'q (B2A…B2Y), 9–12 nishonlar (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturingizni ustozga o‘qib bering',
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda dushmanlar bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P7'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P8'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P10'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // bosh.kosmik — bayroq/nishon kataklari, kerak (pog'ona sharti), chek (ro'yxat), qoy (★: bola qo'yadigan nishonlar soni); bosh.personaj — kartalar;
  // perProg — personajning tayyor dasturi; soloPerProg — solo'da (jonli darsda ustoz o'zi tuzadi); prog 'per' — oldingi pog'onadagi dastur (3-bekat)
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P7: { tur: 'yol', chegara: 8, bosh: kb({}, p3, { soloPerProg: { raketa: RPR } }), gap: { boshla: ['', 'Raketa dasturi: → va ← tugmalariga dasturcha'] } },
    B1A: { tur: 'yol', chegara: 8, bosh: kb({ bayroq: [[5, 0]], kerak: 'o‘ng' }, p1, { pog: 1 }), maslahat: 'Qaysi tugma bosilganda raketa o‘ngga yursin?' },
    B1B: { tur: 'yol', chegara: 8, bosh: kb({ bayroq: [[0, 0], [6, 0]], kerak: 'ikki' }, p1, { pog: 2, perProg: { raketa: [RPR[0]] } }), maslahat: '← tugmasi uchun ham dasturcha kerak' },
    B1C: { tur: 'yol', chegara: 8, bosh: kb({ bayroq: [[3, 0]], kerak: 'start' }, p1, { pog: 3, perProg: { raketa: RPR } }), maslahat: 'O‘yin boshlanganda qaysi hodisa ishlaydi?' },
    B1Y: { tur: 'yol', chegara: 8, bosh: kb({ kerak: 'tovush' }, p1, { pog: 4, perProg: { raketa: RPR } }), maslahat: 'Har dasturchaga bitta tovush bloki' },
    P8: { tur: 'yol', chegara: 8, bosh: kb({}, p2, { perProg: { raketa: RPR }, soloPerProg: { raketa: RPR, oq: OQP } }), gap: { boshla: ['', 'O‘q dasturi: space — nusxa, nusxa tepaga uchadi'] } },
    B2A: { tur: 'yol', chegara: 8, bosh: kb({ kerak: 'otish' }, p2, { pog: 5, perProg: { raketa: RPR, oq: [OQP[1]] } }), maslahat: 'Qaysi tugma bosilganda o‘q paydo bo‘lsin?' },
    B2B: { tur: 'yol', chegara: 8, bosh: kb({ kerak: 'uchish' }, p2, { pog: 6, perProg: { raketa: RPR, oq: [OQP[0], [['H'], ['D']]] } }), maslahat: 'Pastdan tepagacha nechta katak?' },
    B2C: { tur: 'yol', chegara: 8, bosh: kb({ kerak: 'ochish' }, p2, { pog: 7, perProg: { raketa: RPR, oq: [OQP[0], [['H'], ['p', '4', [['u']]]]] } }), maslahat: 'Uchib bo‘lgan o‘q nima qilsin?' },
    B2Y: { tur: 'yol', chegara: 8, bosh: kb({ kerak: 'oqTovush' }, p2, { pog: 8, perProg: { raketa: RPR, oq: OQP } }), maslahat: 'O‘q otilganda — qaysi dasturchaga tovush?' },
    P10: { tur: 'yol', chegara: 10, bosh: kb({ nishon: [[1, 4], [3, 3], [5, 4]], kerak: 'nishon', chek: true }, p3, { perProg: { raketa: RPR, oq: OQP } }), gap: { boshla: ['', 'Nishon ostiga boring — keyin space'] } },
    B3A: { tur: 'yol', chegara: 10, bosh: kb({ nishon: [[1, 4], [4, 3], [6, 4]], kerak: 'nishon', chek: true }, p3, { pog: 9, prog: 'per', perProg: { raketa: RPR, oq: OQP } }), maslahat: 'Ro‘yxatga qarang: qaysi band hali ✓ emas?' },
    B3B: { tur: 'yol', chegara: 10, bosh: kb({ nishon: [[0, 2], [3, 2], [6, 2]], kerak: 'nishon', chek: true }, p3, { pog: 10, prog: 'per', perProg: { raketa: RPR, oq: OQP } }), maslahat: 'O‘q nishonga tegsa — o‘chadi' },
    B3C: { tur: 'yol', chegara: 10, bosh: kb({ nishon: [0, 1, 2, 3, 4, 5, 6].map((x) => [x, 4]), kerak: 'nishon', chek: true }, p3, { pog: 11, prog: 'per', perProg: { raketa: RPR, oq: OQP } }), maslahat: 'Har ustun ostida bir marta space' },
    B3Y: { tur: 'yol', chegara: 10, bosh: kb({ kerak: 'nishon', chek: true, qoy: 4 }, p3, { pog: 12, prog: 'per', perProg: { raketa: RPR, oq: OQP } }), maslahat: 'Avval katakni bosib nishon qo‘ying, keyin ▶ Boshlash' },
    P11: { tur: 'yol', chegara: 10, bosh: kb({ nishon: [[1, 4], [3, 3], [5, 4]], kerak: 'nishon', chek: true }, { ...PR, tanla: 'oq' }, { perProg: { raketa: RPR } }) },
    B5: { ish: 'natija' },
  },
  // natija: ta o‘q otdi — 'O' (yutilgan o'yinlardagi o'q nusxalari); ta nishon urdi — 'U'; pog‘ona bajardi — 12 pog'ona
  natija: [{ k: 'ta o‘q otdi', blok: 'O' }, { k: 'ta nishon urdi', blok: 'U' }, { k: 'pog‘ona bajardi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-017-kosmik-oyin-1-v1', versiya: 'v1', kalit: 'jr017',
    // «Uchuvchi» — 1-pog'ona; «Mergan» — 3-bekatning 3-pog'onasi (yetti nishon)
    yutuqlar: [{ t: 'pog', n: 1, nom: 'uchuvchi' }, { t: 'pog', n: 11, nom: 'mergan' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> katta o‘yin — bir nechta personaj, har birining o‘z dasturi. Avval raketa, keyin o‘q, keyin nishonlar — har qismni alohida yasab, sinaymiz. Hukda, xulosada (12) va yakunda chiqadi.',
    '<b>Yo‘l:</b> huk (o‘q qanday otiladi — uch sinov) → yangi so‘z «personaj» → reja → 1-bekat «Raketa» → 2-bekat «O‘q» → 3-bekat «Nishonlar» → o‘qib berish → yakun.',
    '<b>Personaj kartalari</b> dastur ustunining tepasida: «Raketa» · «O‘q». Kartani bosing — uning dasturi ochiladi. Bola «blok qayerga ketdi?» desa — qaysi personaj tanlanganini so‘rang.',
    '<b>O‘qning asli</b> raketaning ichida — ko‘rinmaydi; create clone of myself o‘qni raketa turgan joyda paydo qiladi. O‘yinda bosilgan tugma hamma personajda ishlaydi: raketa → bilan yuradi, o‘q space bilan otiladi.',
    '<b>Yechimni aytmang:</b> «Qaysi personaj otadi? O‘q qayerda to‘xtadi? Tepaga yetgan o‘q nima qilsin?» 3-bekatda ro‘yxatga qarating: qaysi band hali ✓ emas.',
    '<b>Dastur saqlanadi:</b> 3-bekatda o‘yin yutilsa — ikkala personaj dasturi keyingi darsga (18 · Kosmik o‘yin 2) o‘tadi. 16-qadamda proyektorga ism chiqmaydi.',
  ],
}
