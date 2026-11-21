// 7-dars e'loni (20.11): «Kostyum, animatsiya va tovush». Manba: new-junior/manba/007-kostyum-tovush.md (v1 — agent yozdi; bosh seans filtri — «Filtr qarorlari»).
// Faqat ma'lumot. Maydonlar ma'nosi — 1–6-dars e'lonlarida; bu yerda faqat farqlari. Ekranlar — ekranlar.mjs (E); qadamlar — qadamlar.mjs (QADAM).
// Ikki rejim (KOD 4): 1–2-bekat — bitta dastur, «▶ Ishga tushir»; 3-bekat — o'yin (bosh.oyin: bir nechta dasturcha, «▶ Boshlash»).
const CHET = 'Qahramon shu blokda to‘xtadi. Boshqa tomonga yuring'
const BOSHQA = 'Qahramon (x, y) da. Yulduz (x2, y2) da'
const DARS = {
  raqam: 7,
  nom: 'Kostyum va tovush',
  savol: 'Coddy qanday <em>qo‘l silkitadi</em>?',
  // javon: yangi Ko'rinish (switch costume to) va Tovush (play sound); Harakat, Takrorlash, Hodisa (3-bekatda)
  javon: { v: [['v', 'xursand']], h: ['r', 'l', 'u', 'd'], b: [['p', '2']], e: [['k', 'right']], t: [['n', 'qadam']] },
  maydon: { w: 7, h: 5 },
  blokChegara: 12,
  dasturchalar: 'oyin',
  joyQolmadi: 'Dasturga N ta blok sig‘adi. repeat bilan qisqartiring',

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 kostyum (B1A…B1Y), 5–8 animatsiya (B2A…B2Y), 9–11 tovush (B3A, B3B, B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 10, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  oqishGap: 'Dasturingizni ustozga o‘qib bering',
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda shart bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3Y'],
    gap: [],
  },

  // topshiriqlar: bosh.kostyum — dastur tugaganda (yulduzda) kostyum; bosh.belgi — belgili katakdan shu kostyumda chiqish; bosh.animatsiya — xursand → xotirjam juftlari;
  //   bosh.harQadam — har move dan keyin animatsiya; o'yinda: bosh.tovush { tugma, nom }, bosh.oxiri 'space' (yulduzda space), bosh.xil — kamida N xil kostyum va tovush
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', bosh: { sahna: 'katak', prog: [0, 'qoldir'] } },
    B1A: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir', pog: 1, kostyum: 'xursand' }, maslahat: 'Yulduzga yetgach — kostyumni almashtiring', gap: { chet: CHET, boshqa: BOSHQA } },
    B1B: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 2, kostyum: 'hayron' }, maslahat: 'Blokdagi nomni bosing — ro‘yxatdan tanlang', gap: { chet: CHET, boshqa: BOSHQA } },
    B1C: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 3, kostyum: 'xursand', belgi: [[2, 0, 'hayron']] }, maslahat: 'Belgili katakka yetgach — o‘sha kostyumni qo‘ying', gap: { chet: CHET, boshqa: BOSHQA } },
    B1Y: { tur: 'yol', bosh: { sahna: 'katak', prog: 0, pog: 4, kostyum: 'xursand', belgi: [[0, 2, 'hayron'], [2, 2, 'oylanadi']] }, maslahat: 'Belgiga yetgach — switch costume to', gap: { chet: CHET, boshqa: BOSHQA } },
    P7: { tur: 'yol', bosh: { sahna: 'katak', prog: [0, 'qoldir'], animatsiya: 3, harQadam: true } },
    B2A: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 5, animatsiya: 3, oxirida: true }, maslahat: 'Avval yulduzga yeting. Keyin animatsiyani takrorlang', gap: { chet: CHET, boshqa: BOSHQA } },
    B2B: { tur: 'yol', chegara: 8, bosh: { sahna: 'katak', prog: 0, pog: 6, animatsiya: 4, harQadam: true }, maslahat: 'Har qadamdan keyin animatsiya: qadam ham repeat ichida bo‘lsin', gap: { chet: CHET, boshqa: BOSHQA } },
    B2C: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 7, animatsiya: 6, harQadam: true }, maslahat: 'Yo‘l ikki bo‘lak — har bo‘lakka o‘z repeat', gap: { chet: CHET, boshqa: BOSHQA } },
    B2Y: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 8, animatsiya: 10, harQadam: true }, maslahat: 'Kataklarni sanang: avval o‘ngga, keyin tepaga', gap: { chet: CHET, boshqa: BOSHQA } },
    P8: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: [0, 'qoldir'], oxiri: 'space' }, gap: { boshla: ['', 'Ovozni yoqing — tovush eshitiladi'] } },
    B3A: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0, pog: 9, tovush: { tugma: 'right', nom: 'qadam' } }, maslahat: '→ dasturchasiga tovush blokini ham ulang' },
    B3B: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 10, oxiri: 'space', kostyum: 'xursand', tovush: { tugma: 'space', nom: 'jiring' } }, maslahat: 'space uchun yangi dasturcha: kostyum va tovush' },
    B3Y: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 'oldingi', pog: 11, oxiri: 'space', xil: 2 }, maslahat: 'Har dasturchaga switch costume to va play sound qo‘shing' },
    P11: { tur: 'yol', bosh: { sahna: 'katak', oyin: true, prog: 0, oxiri: 'space' } },
    B5: { ish: 'natija' },
  },
  // natija: K — kostyum haqiqatan almashgan marta, N — animatsiyalar (xursand → xotirjam juftlari; audit 20.11 — sahnadagi «Animatsiya: N / M» bilan bir xil), T — chalingan tovush (studiya.js kosTovushBelgi)
  natija: [{ k: 'marta kostyum almashtirdi', blok: 'K' }, { k: 'ta animatsiya tuzdi', blok: 'N' }, { k: 'marta tovush chaldi', blok: 'T' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-007-kostyum-tovush-v1', versiya: 'v1', kalit: 'jr007',
    yutuqlar: [{ t: 'pog', n: 6, nom: 'animator' }, { t: 'pog', n: 10, nom: 'ovozli' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> kostyum — qahramonning bitta rasmi; kostyumlar navbat bilan almashsa — qahramon jonlanadi (animatsiya). Hukda, xulosada va yakunda chiqadi.',
    '<b>Yo‘l:</b> huk (qo‘l silkitish — uch sinov) → yangi so‘z «animatsiya» → reja → 1-bekat «Kostyum» → 2-bekat «Animatsiya» → 3-bekat «Tovush» (o‘yin) → o‘qib berish → yakun.',
    '<b>Yangi bloklar:</b> switch costume to — kostyumni almashtir (Ko‘rinish oilasi, feruza); play sound — tovushni chal (Tovush oilasi, pushti). Nom bosib tanlanadi. Har ishga tushirishda qahramon xotirjamdan boshlaydi.',
    '<b>Tovush:</b> bolalar noutbuki jim — tovush chalinsa qahramon ustida «♪ nom» chiqadi; sinf tovushni katta ekranda eshitadi (14- va 16-qadam). 3-bekat — o‘yin: «▶ Boshlash», strelkalar; 2-pog‘onadan yulduzda space bosiladi.',
  ],
}
