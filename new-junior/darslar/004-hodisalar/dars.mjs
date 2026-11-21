// 4-dars e'loni (20.11): «Hodisalar» — tugma bosilganda. Manba: new-junior/manba/004-hodisalar.md (v1, tavsiya bo'yicha).
// Faqat ma'lumot. Maydonlar ma'nosi — 1–3-dars e'lonlarida; bu yerda faqat farqlari. Ekranlar — ekranlar.mjs (E); qadamlar — qadamlar.mjs (QADAM).
const DARS = {
  raqam: 4,
  nom: 'Hodisalar', // ekranda «4-dars · Hodisalar» (3-dars yakunidagi va'da)
  savol: 'Yulduz <em>qochsa</em>, qanday yetamiz?',
  // javon: yangi Hodisa oilasi (when → key pressed), Harakat (to'rt move va go to), Gap (say — 15 · ★ da kerak bo'ladi)
  javon: { e: [['k', 'right']], h: ['r', 'l', 'u', 'd', 'x'], g: [['s', 'Salom!']] },
  maydon: { w: 7, h: 5 },
  dasturchalar: true, // bir nechta dasturcha — har biri hodisa blokidan (blockly.js)
  blokChegara: 12,

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 bitta tugma (B1A…B1Y), 5–8 to'rt tugma (B2A…B2Y), 9–11 o'yin (B3A, B3B, B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 9, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturchalaringizni ustozga o‘qib bering', // 16-qadam (A·1): bola oxirgi yechgan pog'onasini ko'radi
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda takrorlash bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3Y'],
    gap: [],
  },

  // o'yin topshiriqlari: bosh.oyin — «▶ Boshlash», dastur tugmani kutadi (studiya.js); prog 'oldingi' — oldingi pog'onadagi dasturchalar bilan
  //   kerak — ★ sharti: { tugma, tur, blok } (o'sha tugmaning dasturchasida shu blokdan kamida N ta), qaytdi (space bilan (0, 0) ga), gap (o'z gapi); gap0 — ishora
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: [0, 'qoldir'] } },
    B1A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0, pog: 1 }, maslahat: 'Hodisa bloki tepada turadi — uning ostiga qahramon nima qilishini qo‘ying' },
    B1B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0, pog: 2 }, maslahat: 'Hodisa blokidagi tugmani bosib, boshqa strelkani tanlash mumkin' },
    B1C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0, pog: 3 }, maslahat: 'Har strelkaga o‘z dasturchasi kerak' },
    B1Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0, pog: 4, kerak: { tugma: 'right', tur: 'r', blok: 2, gap0: '→ bir bosishda ikki katak yursin: ostiga ikkita move right' } }, maslahat: 'Bitta bosishda ikki katak — hodisa ostiga nechta blok kerak?' },
    P7: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'qoldir' } },
    B2A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0, pog: 5 }, maslahat: 'Qahramon to‘rt tomonga yura olsin: qaysi strelkalar hali dasturchasiz?' },
    B2B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 6 }, maslahat: 'Avval olmaga boring, keyin yulduzga' },
    B2C: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 7 }, maslahat: 'Ikki olma orasidan qaysi qator bilan o‘tish qisqa?' },
    B2Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 8, kerak: { tugma: 'space', tur: 'x', blok: 1, qaytdi: true, gap0: 'space bosilganda qahramon (0, 0) ga qaytsin: space bosilganda qahramon boshiga qaytsin: qaysi blok bitta sakrashda manzilga olib boradi?' } }, maslahat: 'space bosilganda qahramon boshiga qaytsin: qaysi blok bitta sakrashda manzilga olib boradi?' },
    P8: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'qoldir', qoch: { har: 3, joy: [[3, 2]] } } },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 9, qoch: { har: 3, joy: [[3, 1]] } }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Eng yaqin olmadan boshlang' },
    B3B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 10, qoch: { har: 3, joy: [[0, 2], [5, 0]] } }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Yo‘lni oldindan ko‘z bilan chizing' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 11, kerak: { tugma: 'space', tur: 's', blok: 1, gap: true, gap0: 'space bosilganda qahramoningiz gapirsin: when space key pressed ostiga say' } }, gap: { yetdi: 'Siz yutdingiz!' }, maslahat: 'Gap oilasidagi blokni space dasturchasiga ulang — gapni o‘zingiz yozing' },
    P11: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0 } },
    B5: { ish: 'natija' },
  },
  // natija: marta tugma bosdi — yutilgan o'yinlardagi tugma bosishlar (haqiqiy son); olma terdi; marta yutdi — 3-bekat pog'onalari
  natija: [{ k: 'marta tugma bosdi', blok: 't' }, { k: 'olma terdi', blok: 'o' }, { k: 'marta yutdi', ekran: ['B3A', 'B3B', 'B3Y'] }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-004-hodisalar-v1', versiya: 'v1', kalit: 'jr004',
    yutuqlar: [{ t: 'pog', n: 5, nom: 'boshqaruv' }, { t: 'pog', n: 9, nom: 'oyinchi' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> dastur tugmani kutadi — tugma bosilsa, o‘sha tugmaning dasturchasi ishlaydi. Tugma bosilishi — hodisa (biror narsa sodir bo‘lishi).',
    '<b>Yo‘l:</b> huk (yulduz qochadi — uch sinov) → yangi so‘z «hodisa» → reja → 1-bekat «Bitta tugma» → 2-bekat «To‘rt tugma» → 3-bekat «O‘yin» → o‘qib berish → yakun.',
    '<b>Yangi blok:</b> when → key pressed — tugma bosilganda. Yangi oila — Hodisa (to‘q sariq). Hodisa bloki doim dasturchaning tepasida. Javondan hodisa blokini bossangiz — yangi dasturcha; keyin bosilgan blok oxirgi dasturchaga ulanadi.',
    '<b>O‘yin:</b> «▶ Boshlash» bilan boshlanadi; ungacha strelka ishlamaydi. O‘yin paytida proyektorda → va ← qadam almashtirmaydi — keyingi qadamga «Keyingi» bilan o‘ting. «To‘xtadik. Qo‘llar klaviaturadan.» kelishuvini dars boshida eslating.',
  ],
}
