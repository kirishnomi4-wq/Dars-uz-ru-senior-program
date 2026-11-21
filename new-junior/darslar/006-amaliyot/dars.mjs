// 6-dars e'loni (20.11): «Amaliyot: harakat va takrorlash». Manba: new-junior/manba/006-amaliyot.md (v1.1 — tavsiya bo'yicha; filtr — «Filtr qarorlari», qurish — «Qurishdagi qarorlar»).
// Faqat ma'lumot. Maydonlar ma'nosi — 1–5-dars e'lonlarida; bu yerda faqat farqlari. Ekranlar — ekranlar.mjs (E); qadamlar — qadamlar.mjs (QADAM).
// Amaliyot: yangi blok yo'q — javonda 2–5-darsdagi bloklar birga; har pog'onada chegara; «Maslahat» birinchi ishga tushirishdan keyin ochiladi.
const CHET = 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring'
const BOSHQA = 'Qahramon (x, y) da. Yulduzning manzilini o‘qing'
const OTIB = 'Qahramon yulduzdan o‘tib ketdi — oxirgi blokni tekshiring'
// rasm: (x, y) — qolgan / chiqqan katak (studiya.js, bh.katak)
const RKAM = 'Kulrang katak qoldi — (x, y). Son va yo‘nalishni tekshiring', RCHIQ = 'Qahramon (x, y) ga chiqdi — u kulrang emas. Kerak bo‘lsa — sakrang'
const DARS = {
  raqam: 6,
  nom: 'Amaliyot',
  savol: 'Qaysi bloklar bilan <em>yetamiz</em>?',
  // javon: Takrorlash (repeat 2) va Harakat (go to va to'rt move) — hammasi boshidan
  javon: { b: [['p', '2']], h: ['x', 'r', 'l', 'u', 'd'] },
  maydon: { w: 7, h: 5 },
  blokChegara: 12,
  maslahatKeyin: true, // KOD 1: o'quvchi pog'onasida «Maslahat» qulf bilan, birinchi «▶ Ishga tushir»dan keyin ochiladi
  // Ortiqvoy «Joy qolmadi!» ishorasi: bu darsda javob go to ham bo'lishi mumkin (manba «Yordam va xato»)
  joyQolmadi: 'Dasturga N ta blok sig‘adi. Boshqa blok tanlang',

  namuna: { qahramon: ['Momiq', 'Zippi'], ism: 'Aziz' },
  qahramonli: ['BK', 'B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y', 'B5'],
  coddyli: [],

  // pog'onalar: 1–4 yo'l (B1A…B1Y), 5–8 rasm (B2A…B2Y), 9–12 hammasi birga (B3A…B3Y)
  sanoq: { P1: ['kirdi'], P2: ['javob'], P5: ['pog', 3, 0], P5G: ['pog', 7, 4], P5B: ['pog', 11, 8], P14: ['sinf'] },

  bola: { javob: 'P2N', qahramonYoq: 'BQ', yakun: 'B5', kutish: 'BK', kutishGap: 'Ustozni tinglang' },
  ochish: [],
  kichikGap: { B0: 'Dars hozir boshlanadi', P2N: 'Javobingiz qabul qilindi', B1Y: 'Hamma pog‘onalarni bajardingiz!', B2Y: 'Hamma pog‘onalarni bajardingiz!', B3Y: 'Hamma pog‘onalarni bajardingiz!' },

  tugadi: { ustoz: ['Dars tugadi!', 'Ko‘rishguncha — keyingi darsda kostyum va tovush bilan!'], bola: 'Dars tugadi. Ko‘rishguncha!' },

  solo: {
    yol: { 0: ['B0', 'P1'], 1: ['P2N'], 2: ['P2S'], 3: ['P2C'], 4: ['P3'], 5: ['P4'], 6: ['P6'], 7: ['B1A', 'B1B', 'B1C', 'B1Y'], 8: ['P4B'], 9: ['P7'], 10: ['B2A', 'B2B', 'B2C', 'B2Y'], 11: ['P9'], 12: ['P4C'], 13: ['P8'], 14: ['B3A', 'B3B', 'B3C', 'B3Y'], 16: ['B5'] },
    keyingi: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'],
    gap: [],
  },

  studiya: {
    P2S: { ish: 'huk', gap: { avto: true, keyingi: 'Keyingi ›', sinab: '▶ Sinab ko‘rish' } },
    P3: { ish: 'raqam' },
    P6: { ish: 'raqam' },
    B1A: { tur: 'yol', chegara: 4, bosh: { sahna: 'katak', prog: 0, pog: 1, otib: true }, maslahat: 'Olma yo‘lda — avval olmaga boring', gap: { chet: CHET, boshqa: BOSHQA, otibKetdi: OTIB } },
    B1B: { tur: 'yol', chegara: 1, bosh: { sahna: 'katak', prog: 0, pog: 2, otib: true }, maslahat: 'Bitta blok bilan uzoqqa — sakrash kerak. Yulduzning X va Y sini o‘qing', gap: { chet: CHET, boshqa: BOSHQA, otibKetdi: OTIB } },
    B1C: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 0, pog: 3, otib: true }, maslahat: 'Birinchi olmaga sakrang — qolgani yonma-yon', gap: { chet: CHET, boshqa: BOSHQA, otibKetdi: OTIB } },
    B1Y: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 0, pog: 4, otib: true }, maslahat: 'Har biri uzoqda — har biriga bitta sakrash. Yulduz — oxirida', gap: { chet: CHET, boshqa: BOSHQA, otibKetdi: OTIB } },
    P7: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir' } },
    B2A: { tur: 'yol', chegara: 2, bosh: { sahna: 'katak', prog: 0, pog: 5 }, maslahat: 'Qatorda nechta qadam? Bir xil qadamni repeat ichiga qo‘ying', gap: { chet: CHET, rasmKam: RKAM, rasmChiqdi: RCHIQ } },
    B2B: { tur: 'yol', chegara: 8, bosh: { sahna: 'katak', prog: 0, pog: 6 }, maslahat: 'Har tomonga bitta repeat — kataklarni sanang', gap: { chet: CHET, rasmKam: RKAM, rasmChiqdi: RCHIQ } },
    B2C: { tur: 'yol', chegara: 4, bosh: { sahna: 'katak', prog: 0, pog: 7, uzun: 'urrurr' }, maslahat: 'Uzun dastur ikkita bir xil bo‘lakdan iborat', gap: { chet: CHET, rasmKam: RKAM, rasmChiqdi: RCHIQ, yetdi: 'Qisqartirdingiz!' } },
    B2Y: { tur: 'yol', chegara: 7, bosh: { sahna: 'katak', prog: 0, pog: 8, uzun: 'uurddruurddr' }, maslahat: 'Uzun dasturning birinchi yarmi ikkinchisiga teng', gap: { chet: CHET, rasmKam: RKAM, rasmChiqdi: RCHIQ, yetdi: 'Qisqartirdingiz!' } },
    // 14-qadam: solo'da bola joy almashtirishni o'zi qiladi — olma qolganda ishora (manba «Solo»)
    P8: { tur: 'yol', bosh: { sahna: 'katak', prog: 'qoldir' }, gap: { olmasiz: ['', 'Ikki repeat ni bosing — joyi almashadi'] } },
    B3A: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 0, pog: 9, otib: true }, maslahat: 'Bitta sakrash, keyin bir xil qadamlar', gap: { chet: CHET, boshqa: BOSHQA, otibKetdi: OTIB } },
    B3B: { tur: 'yol', chegara: 5, bosh: { sahna: 'katak', prog: 0, pog: 10 }, maslahat: 'Chiziqlar orasidan yurmang — ikkinchisiga sakrang', gap: { chet: CHET, rasmKam: RKAM, rasmChiqdi: RCHIQ } },
    // 15 · 3: tayyor dastur bola pog'onasida (prog 'qoldir') — o'zgartirsa bo'ladi
    B3C: { tur: 'yol', chegara: 3, bosh: { sahna: 'katak', prog: 'qoldir', pog: 11 }, maslahat: 'To‘xtagan blokni o‘qing: qahramon qayerdan yurishi kerak edi? Bloklar tartibini o‘ylang', gap: { chet: 'Qahramon shu blokda to‘xtadi. Bloklar tartibini tekshiring', boshqa: BOSHQA } },
    B3Y: { tur: 'yol', chegara: 12, bosh: { sahna: 'katak', prog: 0, pog: 12, erkinRasm: { kerak: ['x', 'p'] } }, maslahat: 'Bir bo‘lakni chizing, keyin go to bilan sakrab, yana chizing', gap: { chet: CHET, yetdi: 'Rasmingiz tayyor!' } },
    P11: { tur: 'korish', chegara: 12, bosh: { sahna: 'katak', prog: 0 }, gap: { yetdi: 'Rasm tayyor!' } },
    B5: { ish: 'natija' },
  },
  // natija: pog'ona bajardi — 12 pog'onadan bajarilganlari; ta go to qo'ydi, ta repeat qo'ydi — muvaffaqiyatli dasturlardagi bloklar
  natija: [{ k: 'pog‘ona bajardi', ekran: ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y', 'B3A', 'B3B', 'B3C', 'B3Y'] }, { k: 'ta go to qo‘ydi', blok: 'x' }, { k: 'ta repeat qo‘ydi', blok: 'p' }],
  gapStandart: 'Salom!',

  lms: {
    id: 'junior-006-amaliyot-v1', versiya: 'v1', kalit: 'jr006',
    yutuqlar: [{ t: 'pog', n: 3, nom: 'yolchi' }, { t: 'pog', n: 11, nom: 'usta' }],
  },

  varaq: [
    '<b>Asosiy fikr:</b> har ishga — o‘z bloki; kerak bo‘lsa ular bir dasturda birga ishlaydi. Hukda, xulosada (12) va yakunda chiqadi.',
    '<b>Yo‘l:</b> huk (uchta blok — uch sinov) → eslaymiz: uch blok → reja → qoida → 1-bekat «Yo‘l» → 2-bekat «Rasm» → 3-bekat «Hammasi birga» → o‘qib berish → yakun.',
    '<b>Bu — amaliyot darsi:</b> yangi blok yo‘q, siz topshiriq yechmaysiz. 10- va 14-qadamda faqat topshiriq turini eslatasiz (kulrang rasm, tayyor dasturni tuzatish) — bolalarning pog‘onalari boshqa maydonda.',
    '<b>Maslahat</b> bir urinishdan keyin ochiladi — ataylab: bola avval o‘zi sinaydi. Qulfni ochib bermang. Mashq paytida yechim aytmang: «Qahramon qayerda? Yulduz qayerda? Nechta blok sig‘adi?»',
  ],
}
