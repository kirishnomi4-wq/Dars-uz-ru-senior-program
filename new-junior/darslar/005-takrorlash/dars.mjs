// 5-dars e'loni (20.11): «Takrorlash». Manba: new-junior/manba/005-takrorlash.md (v1 — tavsiya bo'yicha; filtr qarorlari manbaning «Qurishdagi qarorlar» bo'limida).
// Faqat ma'lumot. Maydonlar ma'nosi — 1–4-dars e'lonlarida; bu yerda faqat farqlari. Ekranlar — ekranlar.mjs (E); qadamlar — qadamlar.mjs (QADAM).
const DARS = {
  raqam: 5,
  nom: 'Takrorlash',
  savol: 'Uchta blok bilan <em>qanday</em> yetamiz?',
  // javon: yangi Takrorlash oilasi (repeat 2) va Harakat (to'rt move)
  javon: { b: [['p', '2']], h: ['r', 'l', 'u', 'd'] },
  maydon: { w: 7, h: 5 },
  blokChegara: 12,

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 uzun yo'l (B1A…B1Y), 5–8 kvadrat (B2A…B2Y), 9–12 zinapoya — qisqartirish (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda amaliyot bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  // topshiriqlar: chegara — topshiriqdagi eng ko'p blok (takrorlash va ichidagilar sanaladi; to'lsa Ortiqvoy «Joy qolmadi!»);
  //   bosh.otib — yulduz yo'lda qolsa «o'tib ketdi»; rasm — maydondagi kulrang kataklar (ekranlar.mjs, maydonHtml m.rasm); bosh.uzun — qisqartiriladigan uzun dastur (tejalgan bloklar);
  //   bosh.erkinRasm — ichida kamida ikki blokli takrorlash; gap.boshqa — «(x, y)» qahramonning haqiqiy manziliga almashadi
  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { tur: 'yol', chegara: 2, bosh: { sahna: 'katak', prog: [0, 'qoldir'] } },
    B1A: { tur: 'yol', chegara: 2, bosh: { sahna: 'katak', prog: 0, pog: 1, otib: true }, maslahat: 'Yulduzgacha nechta katak? Shuncha marta takrorlang', gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring', boshqa: 'Qahramon (x, y) da. Kataklarni sanang — repeat sonini tekshiring' } },
    B1B: { tur: 'yol', chegara: 2, bosh: { sahna: 'katak', prog: 0, pog: 2, otib: true }, maslahat: 'Avval kataklarni sanang, keyin sonni repeat ga yozing', gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring', boshqa: 'Qahramon (x, y) da. Kataklarni sanang — repeat sonini tekshiring' } },
    B1C: { tur: 'yol', chegara: 4, bosh: { sahna: 'katak', prog: 0, pog: 3, otib: true }, maslahat: 'Yo‘l ikki bo‘lak: har bo‘lakka o‘z repeat', gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring', boshqa: 'Qahramon (x, y) da. Kataklarni sanang — repeat sonini tekshiring' } },
    B1Y: { tur: 'yol', chegara: 6, bosh: { sahna: 'katak', prog: 0, pog: 4, otib: true }, maslahat: 'Yo‘lni bo‘laklarga ajrating: har burilish — yangi repeat', gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring', boshqa: 'Qahramon (x, y) da. Kataklarni sanang — repeat sonini tekshiring' } },
    P7: { tur: 'yol', chegara: 8, bosh: { sahna: 'katak', prog: 'qoldir' } },
    B2A: { tur: 'yol', chegara: 8, bosh: { sahna: 'katak', prog: 0, pog: 5 }, gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring' }, maslahat: 'Kvadratning to‘rt tomoni bor — har tomonga bitta repeat' },
    B2B: { tur: 'yol', chegara: 8, bosh: { sahna: 'katak', prog: 0, pog: 6 }, gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring' }, maslahat: 'Qahramon qaysi burchakda turibdi? Shu burchakdan aylanib chiqing' },
    B2C: { tur: 'yol', chegara: 8, bosh: { sahna: 'katak', prog: 0, pog: 7 }, gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring' }, maslahat: 'Kvadratdagidek: har tomonga bitta repeat — tomonlar uzunligini sanang' },
    B2Y: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 8 }, gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring' }, maslahat: 'Avval chetini chizing, oxirida o‘rtadagi chiziq' },
    P8: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir' }, qisqa: [{ t: 'p', m: '3', ichki: [{ t: 'r' }, { t: 'u' }] }] },
    B3A: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 0, pog: 9, uzun: 'drdrdrdr' }, gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring', yetdi: 'Qisqartirdingiz!' }, maslahat: 'Uzun dasturda qaysi ikki blok takrorlanadi? Shu juftlikni repeat ichiga qo‘ying' },
    B3B: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', prog: 0, pog: 10, uzun: 'urdrurdr' }, gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring', yetdi: 'Qisqartirdingiz!' }, maslahat: 'Takrorlanadigan bo‘lakni toping — u nechta blokdan iborat?' },
    B3C: { tur: 'yol', chegara: 6, bosh: { sahna: 'katak', prog: 0, pog: 11, uzun: 'rururdrd' }, gap: { chet: 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring', yetdi: 'Qisqartirdingiz!' }, maslahat: 'Dastur ikki bo‘lak: har bo‘lakda nima takrorlanadi?' },
    B3Y: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 12, erkinRasm: true }, gap: { yetdi: 'Rasmingiz tayyor!' }, maslahat: 'repeat ichiga kamida ikkita blok qo‘ying' },
    P11: { tur: 'korish', chegara: 12, bosh: { sahna: 'katak', prog: 0 }, gap: { yetdi: 'Rasm tayyor!' } },
    B5: { ish: 'natija' },
  },
  // natija: rasm chizdi — 2–3-bekatda tayyor rasmlar (★ ham); ta repeat qo'ydi — muvaffaqiyatli dasturlardagi takrorlash bloklari; ta blok tejadi — 3-bekatda uzun dasturdan kam bloklar
  natija: [{ k: 'rasm chizdi', blok: 'c' }, { k: 'ta repeat qo‘ydi', blok: 'p' }, { k: 'ta blok tejadi', blok: 'z' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-005-takrorlash-v1', versiya: 'v1', kalit: 'jr005',
    yutuqlar: [{ t: 'pog', n: 5, nom: 'rassom' }, { t: 'pog', n: 9, nom: 'tejamkor' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> bir marta qo‘yamiz — ko‘p marta bajariladi; ichidagi bloklar tartib bilan takrorlanadi. Hukda, xulosada va 3-bekatda (qisqartirish) chiqadi.',
    '<b>Yo‘l:</b> huk (uchta blok — uch sinov) → yangi so‘z «takrorlash» → reja → 1-bekat «Uzun yo‘l» → 2-bekat «Kvadrat» → 3-bekat «Zinapoya» → o‘qib berish → yakun.',
    '<b>Yangi blok:</b> repeat — takrorla. Yangi oila — Takrorlash (yashil). Javondan repeat bossangiz, u tanlanadi (coral hoshiya) — keyin bosgan bloklaringiz uning ichiga tushadi; repeat ni yana bossangiz — tanlov bekor, keyingi bloklar tashqariga. Sonni bosib tanlashni va ichiga qo‘yishni sekin, ikki marta ko‘rsating.',
    '<b>Chegara:</b> har pog‘onada bloklar soni cheklangan («N / M ta blok») — «Joy qolmadi!» chiqsa, bu takrorlashga ishora, xato emas. 2–3-bekatda maqsad — kulrang kataklarning hammasini oltin qilish; qaysi burchakdan boshlash ahamiyatsiz.',
  ],
}
